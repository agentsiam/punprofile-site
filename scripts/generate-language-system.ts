/**
 * Emits every bilingual TypeScript source from LANGUAGE-SYSTEM.md.
 *
 *   npm run language:generate
 *   npm run language:generate -- --check
 *
 * The templates contain code shape and historical comments, but no English or
 * Thai payload. This preserves the reasoning in the old modules while making
 * the Markdown the only place copy can be changed.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { LANGUAGE_ROOT, readLanguageSystem, renderLanguageSources } from "./lib/language-system.js";
import { QUEUE_PATH, buildSheet } from "./lib/review-sheet.js";
import { checkOverwrite } from "./lib/review-guard.js";

const check = process.argv.includes("--check");
const system = readLanguageSystem();
const rendered = renderLanguageSources(system);
const stale: string[] = [];

const notesPath = resolve(LANGUAGE_ROOT, "src/lib/content/language-notes.generated.ts");
const notesContent = `// Generated from LANGUAGE-SYSTEM.md. Do not edit.\n` +
  `export const LANGUAGE_DECISION_NOTES = ${JSON.stringify(Object.fromEntries(
    system.entries.map((entry) => [entry.id, {
      source: entry.source,
      path: entry.path,
      render: entry.render,
      narrativeSlot: entry.narrative_slot,
      provenance: entry.provenance,
      date: entry.date,
      decisionNote: entry.decision_note,
      proposalTh: entry.proposal_th,
    }]),
  ), null, 2)} as const;\n`;

for (const file of rendered) {
  const rel = relative(LANGUAGE_ROOT, file.path);
  let current = "";
  try {
    current = readFileSync(file.path, "utf8");
  } catch {
    // A missing generated source is stale and can be restored in write mode.
  }
  if (current === file.content) continue;
  if (check) stale.push(rel);
  else writeFileSync(file.path, file.content);
}

let currentNotes = "";
try {
  currentNotes = readFileSync(notesPath, "utf8");
} catch {
  // Missing generated decision history is stale.
}
if (currentNotes !== notesContent) {
  if (check) stale.push(relative(LANGUAGE_ROOT, notesPath));
  else writeFileSync(notesPath, notesContent);
}

if (stale.length) {
  console.error("Generated language sources are stale:");
  for (const path of stale) console.error(`  ${path}`);
  console.error("Run: npm run language:generate");
  process.exit(1);
}

console.log(
  check
    ? `language sources current: ${system.entries.length} records across ${rendered.length + 1} files`
    : `generated ${system.entries.length} records across ${rendered.length + 1} files`,
);

/**
 * Keep the review sheet level with the source.
 *
 * A record added after the sheet was exported leaves the sheet short by exactly
 * the lines nobody has been asked about, and nothing says so: a reviewer reads
 * four items off a sheet while six are waiting, which is how two of them went
 * unseen. Rebuilding it here means the sheet is a function of the source rather
 * than of whoever last remembered to run the exporter.
 *
 * It never overwrites an edited sheet. A pass sitting in there unapplied is
 * worth more than being up to date, so that case says so and leaves it alone.
 */
if (!check) {
  const waiting = system.entries.filter((entry) => entry.review.structural_calque !== "pass");
  if (waiting.length) {
    if (checkOverwrite(QUEUE_PATH, "review:language").safe) {
      writeFileSync(QUEUE_PATH, buildSheet(waiting));
      console.log(`review sheet: ${waiting.length} records waiting`);
    } else {
      console.log(`review sheet: edited since it was generated, so it was left alone.`);
      console.log(`  It is now behind the source. Apply it with: npm run review:language -- --apply`);
    }
  }
}
