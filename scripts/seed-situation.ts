/**
 * The first fill of the Situation panel for each paying client,
 * `candidate-situation-handoff.md` step 3.
 *
 *   npx tsx scripts/seed-situation.ts --preview <out.html>
 *   npx tsx scripts/seed-situation.ts --write [--only <nickname>]
 *
 * Two modes over one seed file, `data/clients/situation-seed.json`, so what
 * Paul reads is what gets written. `--preview` renders each client's filled
 * panel, row by row, with the source every value was read off, and writes no
 * row anywhere. `--write` sends each row through `situation:setRow` on the
 * deployment the live site reads, using `data/agent/convex-admin.sh`.
 *
 * Idempotent, so a run that dies half way is resumed by running it again: a
 * row whose stored value already matches the seed is skipped and said to be
 * skipped. It writes with `source: "coach"`, because a seeded value is a
 * coach's reading of a folder and not a thing the candidate told the app.
 *
 * Candidate data stays in `data/`, which is gitignored and in neither repo.
 * The seed file and the preview are both temporary: once the panels are
 * accepted and written, the panel is the record and both are deleted.
 */

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { BRAND_FONT_LINK, BRAND_FONT_STACKS, BRAND_TOKENS_CSS } from "../src/lib/design-tokens.js";
import { panel, ROW_LABEL, SITUATION_ROWS, type Situation, type SituationRowKey } from "../src/lib/situation.js";

const ROOT = resolve(import.meta.dirname, "..");
const SEED = resolve(ROOT, "data/clients/situation-seed.json");
const ADMIN = resolve(ROOT, "data/agent/convex-admin.sh");
const READER = resolve(ROOT, "data/agent/convex-read.sh");

type SeedRow = { row: SituationRowKey; evidence?: string } & Record<string, unknown>;
type SeedClient = {
  nickname: string;
  folder: string;
  leadId: string;
  rows: SeedRow[];
  absent?: Record<string, string>;
};
type Seed = { note: string; builtOn: string; clients: SeedClient[] };

const argv = process.argv.slice(2);
const mode = argv.includes("--write") ? "write" : "preview";
const out = argv[argv.indexOf("--preview") + 1];
const only = argv.includes("--only") ? argv[argv.indexOf("--only") + 1] : null;
if (mode === "preview" && (!argv.includes("--preview") || !out || out.startsWith("--"))) {
  console.error("usage: seed-situation.ts --preview <out.html> | --write [--only <nickname>]");
  process.exit(1);
}

const seed = JSON.parse(readFileSync(SEED, "utf8")) as Seed;
const clients = only ? seed.clients.filter((c) => c.nickname.toLowerCase() === only.toLowerCase()) : seed.clients;
if (!clients.length) {
  console.error(only ? `no client called ${only} in the seed file` : "the seed file holds no clients");
  process.exit(1);
}

/** The whole `leads` table, read through Paul's own read-only key. */
function leads(): Record<string, unknown>[] {
  try {
    return JSON.parse(execFileSync("bash", [READER, "leads"], { encoding: "utf8", maxBuffer: 1 << 28 }));
  } catch (e) {
    // C47: a read across a boundary that finds its source absent says so and
    // stops, rather than passing with partial data and seeding over a panel
    // somebody has already filled.
    console.error(`could not read the leads table through ${READER}: ${e instanceof Error ? e.message : String(e)}`);
    process.exit(1);
  }
}

/** The stamp a row carries once written, for the preview to show. */
const stamped = (r: SeedRow, builtOn: string) => {
  const { row: _key, evidence, ...value } = r;
  return {
    ...value,
    source: "coach" as const,
    at: Date.parse(`${builtOn}T12:00:00Z`),
    by: "seeded from the client folder",
    ...(evidence ? { evidence } : {}),
  };
};

/** The seed as a Situation, so the preview renders through the panel's own wording. */
function asSituation(c: SeedClient, builtOn: string): Situation {
  const s: Record<string, unknown> = {};
  for (const r of c.rows) s[r.row] = stamped(r, builtOn);
  return s as Situation;
}

/** The titles the Goal row reads from `targets`, through the same key. */
function titlesFor(leadId: string): string[] {
  const rows = JSON.parse(execFileSync("bash", [READER, "targets"], { encoding: "utf8", maxBuffer: 1 << 26 })) as {
    leadId: string;
    status: string;
    title: string;
    priority: number;
  }[];
  return rows
    .filter((t) => t.leadId === leadId && t.status === "active")
    .sort((a, b) => a.priority - b.priority)
    .map((t) => t.title);
}

const esc = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function preview(): string {
  const all = leads();
  const byId = new Map(all.map((l) => [String(l._id), l]));
  const sections = clients.map((c) => {
    const lead = byId.get(c.leadId);
    const held = (lead?.situation ?? null) as Situation | null;
    const titles = titlesFor(c.leadId);
    const rows = panel(asSituation(c, seed.builtOn), titles);
    const absent = SITUATION_ROWS.filter((k) => rows.find((r) => r.key === k)?.line === null);
    return `
  <section>
    <h2>${esc(c.nickname)}</h2>
    <p class="meta">${esc(c.folder)} · lead ${esc(c.leadId)} · ${
      held ? '<strong class="warn">a panel is already stored for this person</strong>' : "nothing stored yet"
    }</p>
    <table>
      ${rows
        .map(
          (r) => `<tr>
        <th>${esc(r.label)}</th>
        <td>${r.line === null ? '<span class="absent">Not established</span>' : esc(r.line)}
          ${r.provenance ? `<div class="src">${esc(r.provenance)}</div>` : ""}</td>
      </tr>`,
        )
        .join("\n      ")}
    </table>
    ${
      absent.length
        ? `<h3>Why these are empty</h3><ul>${absent
            .map((k) => `<li><strong>${esc(ROW_LABEL[k])}.</strong> ${esc(c.absent?.[k] ?? "No reason recorded in the seed.")}</li>`)
            .join("")}</ul>`
        : ""
    }
  </section>`;
  });
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Situation panels for review</title>
${BRAND_FONT_LINK}
<style>
${BRAND_TOKENS_CSS}
  :root {
${BRAND_FONT_STACKS}
  }
  body { font-family: var(--font-display); background: var(--canvas-soft, #fff); color: var(--ink, #111); margin: 0; padding: 2rem 1rem; }
  main { max-width: 56rem; margin: 0 auto; }
  h1 { font-size: 1.75rem; margin: 0 0 .25rem; }
  h2 { font-size: 1.25rem; margin: 0 0 .25rem; }
  h3 { font-size: 1rem; margin: 1.5rem 0 .5rem; }
  p.lede, p.meta { color: var(--ink-soft, #555); }
  p.lede { margin: 0 0 2rem; }
  p.meta { font-size: .8125rem; margin: 0 0 1rem; }
  section { background: var(--canvas, #fff); border: 1px solid var(--border, #ddd); border-radius: 1rem; padding: 1.5rem; margin-bottom: 1.5rem; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; vertical-align: top; width: 13rem; padding: .625rem 1rem .625rem 0; color: var(--ink-soft, #555); font-weight: 500; border-top: 1px solid var(--border, #eee); }
  td { vertical-align: top; padding: .625rem 0; border-top: 1px solid var(--border, #eee); }
  .src { font-size: .8125rem; color: var(--ink-soft, #666); margin-top: .25rem; }
  .absent { color: var(--ink-soft, #777); font-style: normal; }
  .warn { color: var(--negative, #b00); }
  ul { margin: 0; padding-left: 1.25rem; }
  li { margin-bottom: .375rem; }
  footer { color: var(--ink-soft, #555); font-size: .875rem; margin-top: 2rem; }
</style>
</head>
<body>
<main>
  <h1>Situation panels, first fill</h1>
  <p class="lede">${esc(seed.note)}</p>
  ${sections.join("\n")}
  <footer>Built ${esc(seed.builtOn)} from the client folders and the CRM. Nothing has been written to any record: this page is the
  check before the write. The rows below each panel are the ones nobody has established yet, which is a different thing from a row
  that is empty, and a search holds a role it cannot judge against them.</footer>
</main>
</body>
</html>`;
}

/** One row's value as the stored row would hold it, for the skip comparison. */
function sameAsStored(stored: Situation | null, r: SeedRow): boolean {
  const held = stored?.[r.row] as Record<string, unknown> | undefined;
  if (!held) return false;
  const { row: _key, evidence: _e, ...want } = r;
  return Object.entries(want).every((entry) => JSON.stringify(held[entry[0]]) === JSON.stringify(entry[1]));
}

function write(): void {
  const byId = new Map(leads().map((l) => [String(l._id), l]));
  let wrote = 0;
  let skipped = 0;
  for (const c of clients) {
    const stored = (byId.get(c.leadId)?.situation ?? null) as Situation | null;
    for (const r of c.rows) {
      if (sameAsStored(stored, r)) {
        skipped++;
        console.log(`[${c.nickname}] ${r.row}: already stored, skipped`);
        continue;
      }
      const { row, evidence, ...value } = r;
      const args = JSON.stringify({
        leadId: c.leadId,
        value: { row, ...value },
        ...(evidence ? { evidence } : {}),
      });
      const res = JSON.parse(execFileSync("bash", [ADMIN, "mutation", "situation:setRow", args], { encoding: "utf8" }));
      if (res.status !== "success") {
        console.error(`[${c.nickname}] ${row}: ${String(res.errorMessage).slice(0, 300)}`);
        process.exit(1);
      }
      wrote++;
      console.log(`[${c.nickname}] ${row}: written`);
    }
  }
  console.log(`${wrote} row(s) written, ${skipped} already stored. Run it again and it writes 0.`);
}

if (mode === "preview") {
  writeFileSync(resolve(out), preview());
  console.log(`${clients.length} panel(s) rendered to ${resolve(out)}. Nothing written to any record.`);
} else {
  write();
}
