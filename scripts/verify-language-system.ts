/** The build gate for LANGUAGE-SYSTEM.md. */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";
import { TERMBASE } from "../src/lib/content/termbase.generated.js";
import { lintThai, type LintTarget } from "./lint-thai.js";
import {
  LANGUAGE_ROOT,
  PROMPT_VERSION,
  readLanguageSystem,
  renderLanguageSources,
  textHash,
  type LanguageEntry,
} from "./lib/language-system.js";

const WHO_BODY = "src/lib/content/home.ts::WHO_BODY";
const fixtureWho = process.argv.includes("--fixture=who-body") ||
  (process.argv.includes("--fixture") && process.argv[process.argv.indexOf("--fixture") + 1] === "who-body");
const cleanOnly = process.argv.includes("--clean-corpus");

let failures = 0;
const DISPLAY_LIMIT = 40;
const fail = (message: string) => {
  failures++;
  if (failures <= DISPLAY_LIMIT) console.error(`FAIL ${message}`);
};

let system;
try {
  system = readLanguageSystem();
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

let rendered;
try {
  rendered = renderLanguageSources(system);
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

const targets: LanguageEntry[] = fixtureWho
  ? [system.byId.get(WHO_BODY)!].filter(Boolean)
  : cleanOnly
    ? system.entries.filter((entry) => entry.provenance === "paul-written")
    : system.entries;

if (fixtureWho && targets.length !== 1) fail(`${WHO_BODY}: fixture is missing`);

const terms = new Map(TERMBASE.terms.map((term) => [term.id, term]));
const surface = (entry: LanguageEntry): LintTarget["surface"] => {
  if (/consent-copy|privacy/.test(entry.source)) return "system";
  if (/questions/.test(entry.source)) return "survey";
  return "app";
};
for (const entry of targets) {
  const expected = textHash(entry.en, entry.th);
  if (entry.review.text_hash !== expected) {
    fail(`${entry.id}: text changed after its judge verdict; review it again`);
  }
  if (entry.review.prompt_version !== PROMPT_VERSION) {
    fail(`${entry.id}: judge prompt is ${entry.review.prompt_version}, expected ${PROMPT_VERSION}`);
  }
  if (entry.review.structural_calque !== "pass") {
    fail(`${entry.id}: structural-calque verdict is ${entry.review.structural_calque}`);
  }
  if (entry.review.structural_calque === "pass" && /draft|rejected/.test(entry.provenance)) {
    fail(`${entry.id}: ${entry.provenance} copy cannot carry a passing native verdict`);
  }
  for (const binding of entry.term_bindings) {
    const term = terms.get(binding);
    if (!term) {
      fail(`${entry.id}: unknown term binding ${binding}`);
      continue;
    }
    if (!term.fixed) fail(`${entry.id}: ${binding} is bound but is not fixed`);
    if (!term.th.includes(entry.th)) {
      fail(`${entry.id}: Thai drifted from fixed term ${binding}`);
    }
  }

  // High-precision nomination for the exact architecture that triggered this
  // system. It does not claim to judge Thai generally; the recorded bilingual
  // judge verdict above is the general gate.
  const abstractActor = /คำแนะนำ(?:จึง|ก็)?เริ่มจาก/.test(entry.th);
  const mirroredTail = /ไม่ใช่จากตำแหน่ง(?:ว่าง)?ที่[^.!?]{0,90}(?:กำลัง)?(?:เร่ง|รีบ)หาคน/.test(entry.th);
  if (abstractActor && mirroredTail && entry.review.structural_calque !== "pass") {
    fail(`${entry.id}: structural-calque triage found abstract agency plus a mirrored relative-clause tail`);
  }
}

if (!cleanOnly && !fixtureWho) {
  for (const file of rendered) {
    let current = "";
    try {
      current = readFileSync(file.path, "utf8");
    } catch {
      fail(`${relative(LANGUAGE_ROOT, file.path)}: generated source is missing`);
      continue;
    }
    if (current !== file.content) fail(`${relative(LANGUAGE_ROOT, file.path)}: generated source is stale`);
  }

  const generatedPaths = new Set(rendered.map((file) => file.path));
  const nonCopyBilingualData = new Set([
    "src/app/(en)/layout.tsx", // hreflang locale-to-URL map
    "src/app/(en)/en/coaching/page.tsx", // metadata composed from canonical coaching records
    "src/app/(th)/layout.tsx", // hreflang locale-to-URL map
    "src/app/(th)/coaching/layout.tsx", // metadata composed from canonical coaching records
    "src/lib/temperature.ts", // unused internal funnel taxonomy
  ]);
  const scan = (dir: string): string[] => readdirSync(dir).flatMap((name) => {
    const path = resolve(dir, name);
    return statSync(path).isDirectory() ? scan(path) : /\.tsx?$/.test(name) ? [path] : [];
  });
  for (const path of scan(resolve(LANGUAGE_ROOT, "src"))) {
    if (path.endsWith(".generated.ts") || generatedPaths.has(path)) continue;
    const source = readFileSync(path, "utf8");
    const rel = relative(LANGUAGE_ROOT, path);
    if (
      !nonCopyBilingualData.has(rel) &&
      /\ben\s*:\s*["'`]/.test(source) &&
      /\bth\s*:\s*["'`]/.test(source)
    ) {
      fail(`${rel}: bilingual copy exists outside the language templates`);
    }
  }

  const mechanical = lintThai(system.entries.map((entry) => ({
    id: entry.id,
    en: entry.en,
    th: entry.th,
    surface: surface(entry),
  }))).filter((finding) => finding.level === "fail");

  for (const finding of mechanical) {
    const entry = system.byId.get(finding.target);
    const approvedPassthrough =
      finding.rule === "LR-01" &&
      entry?.review.structural_calque === "pass" &&
      entry.en === entry.th;
    if (!approvedPassthrough) {
      fail(`${finding.target}: [${finding.rule}] ${finding.message}`);
    }
  }
}

const clean = system.entries.filter((entry) => entry.provenance === "paul-written").length;
const approved = system.entries.filter((entry) => entry.review.structural_calque === "pass").length;
const pending = system.entries.filter((entry) => entry.review.structural_calque === "pending").length;
const rejected = system.entries.filter((entry) => entry.review.structural_calque === "fail").length;

console.log(
  `language system: ${system.entries.length} records, ${clean} clean-corpus, ${approved} approved, ${pending} pending, ${rejected} rejected`,
);
if (cleanOnly && failures === 0) console.log(`clean corpus OK: ${targets.length} records, no structural-calque findings`);
if (failures) {
  if (failures > DISPLAY_LIMIT) console.error(`... ${failures - DISPLAY_LIMIT} more failure(s) omitted`);
  console.error(`${failures} language-system failure(s)`);
  process.exit(1);
}
console.log("language system OK");
