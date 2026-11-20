/**
 * Generates one disposable review view from LANGUAGE-SYSTEM.md.
 *
 * **One writer, 12/11/2026.** The view used to be a surface two different authors
 * wrote on: Paul, whose wording is authoritative and clears a record on its own,
 * and a judging session, whose proposed Thai is a draft and clears nothing. Both
 * wrote on the same `แก้เป็น:` line, and nothing in the file said which was which.
 * That cost a round trip to Paul to ask who had written one line, and the ask is
 * the cheap outcome; the expensive one is a model's draft recorded as his wording,
 * which clears a string no native reader has read and is the one thing the
 * structural-calque gate exists to prevent.
 *
 * Asking each writer to mark its own lines was the obvious fix and is the wrong
 * one. It has already been tried here. `PB:` is a real mechanism and stays one,
 * a note from Paul to whoever reads the file next, which this exporter must never
 * destroy. What it is not is an authorship marker: `review-guard.ts` records that
 * the first version of that guard gated on it and failed, because Paul edits the
 * quoted Thai in place rather than announcing himself, which is his prerogative on
 * his own review sheet. A marker only one of two writers uses cannot carry
 * provenance, and the writer who would use it reliably is the one whose lines
 * carry no authority anyway.
 *
 * So the second writer leaves instead. A model's proposed Thai belongs in
 * `proposal_th` in LANGUAGE-SYSTEM.md, which the contract already defines as
 * optional and never approved copy, and which this exporter prints into the view
 * above the line it must not touch. Nothing is asked of Paul, the schema gains no
 * field, and authorship becomes readable off the file by construction: whatever
 * the generator printed came from the tracked source, and whatever is handwritten
 * is his.
 *
 * **The rule needs a date on it, 13/11/2026.** Stated flatly, "handwriting in the
 * queue is Paul's" is false for every sheet generated before the rule existed, and
 * the live one is exactly that: five filled correction lines, one his and four a
 * judging session's, written when nothing forbade it. The carve-out for a model
 * copying its own proposal across does not catch them, because none of the four
 * matches a printed draft. So a session applying that sheet under a flat rule would
 * record four model-written strings as his wording and clear them without a native
 * read, which is the failure this file was changed to prevent, reached from the
 * other side. The dangerous copy of the rule was not here but in the contract,
 * which is file-independent and applies to any sheet a session picks up.
 *
 * So the frontmatter carries `authorship: one-writer`, and the rule is conditional
 * on it. A sheet without the field predates the rule and establishes nothing. The
 * field sits inside what the checksum covers, so it cannot be edited onto an older
 * sheet without breaking the stamp. What it asserts is the regime a sheet was
 * generated under, not that every writer obeyed it; a model that reads "do not
 * write in this file" and writes anyway still defeats it, and no generator can
 * know otherwise. A handwritten authorship note outranks the rule either way,
 * which is C43 and is what is holding the line on the live sheet today.
 */

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { checkOverwrite } from "./lib/review-guard.js";
import { LANGUAGE_PATH, patchRecord, readLanguageSystem, textHash } from "./lib/language-system.js";
import { QUEUE_PATH, buildSheet, parseSheet } from "./lib/review-sheet.js";

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const force = args.includes("--force");
/**
 * An explicit path exports a pristine copy somewhere else, which is how you diff
 * an edited sheet. Applying only ever reads the one home: a pass picked up from
 * a copy is how a verdict gets read off the wrong file.
 */
const out = args.find((arg) => !arg.startsWith("-")) ?? QUEUE_PATH;

const waiting = () => readLanguageSystem().entries.filter((entry) => entry.review.structural_calque !== "pass");

function exportSheet(path: string, forced: boolean) {
  const guard = forced ? { safe: true, reasons: [] } : checkOverwrite(path, "review:language");
  if (!guard.safe) {
    console.error(path);
    for (const reason of guard.reasons) console.error(reason);
    process.exit(1);
  }
  const rows = waiting();
  writeFileSync(path, buildSheet(rows));
  console.log(`wrote ${path}: ${rows.length} records waiting`);
}

function today(): string {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

/**
 * Write a finished pass back into the record, from the sheet.
 *
 * A tick clears the line as printed and the record becomes `paul-approved`;
 * Thai on the correction line becomes the record's Thai and it becomes
 * `paul-written`. Either way the text hash is recomputed, the spent draft is
 * dropped, and the basis says which it was and when. Nothing is interpreted:
 * a model moves his words, it never types them.
 *
 * Refused, by record id and without touching the file: an id the source does
 * not have, and a correction that is the printed draft word for word, which is
 * a model copying its own proposal across rather than a pass. An item with
 * neither a tick nor a correction is simply still waiting.
 */
function applyPass() {
  let sheet = "";
  try {
    sheet = readFileSync(QUEUE_PATH, "utf8");
  } catch {
    console.error(`${QUEUE_PATH}: no sheet to apply. Run \`npm run review:language\` to make one.`);
    process.exit(1);
  }
  const { oneWriter, verdicts } = parseSheet(sheet);
  if (!oneWriter) {
    console.error(`${QUEUE_PATH}: this sheet does not say \`authorship: one-writer\`, so it predates the`);
    console.error("  rule that makes handwriting in it Paul's. Who wrote each line has to be");
    console.error("  established first. Nothing applied.");
    process.exit(1);
  }

  const system = readLanguageSystem();
  let doc = readFileSync(LANGUAGE_PATH, "utf8");
  const cleared: string[] = [];
  const refused: string[] = [];

  for (const verdict of verdicts) {
    if (!verdict.ticked && !verdict.rewrite) continue;
    const entry = system.byId.get(verdict.id);
    if (!entry) {
      refused.push(`${verdict.id}: the source has no record with that id`);
      continue;
    }
    if (verdict.rewrite && verdict.draft && verdict.rewrite === verdict.draft) {
      refused.push(`${verdict.id}: the correction is the printed draft word for word, so it is a model's proposal copied across rather than a pass`);
      continue;
    }
    const th = verdict.rewrite ?? entry.th;
    const how = verdict.rewrite ? "Paul wrote this Thai on the review sheet" : "Paul ticked this unchanged on the review sheet";
    const basis = `${how}, applied ${today()}.${verdict.note ? ` ${verdict.note.replace(/\s+/g, " ")}` : ""}`;
    doc = patchRecord(doc, verdict.id, {
      th,
      provenance: verdict.rewrite ? "paul-written" : "paul-approved",
      dropProposal: true,
      review: { structural_calque: "pass", text_hash: textHash(entry.en, th), basis },
    });
    cleared.push(`${verdict.id} (${verdict.rewrite ? "rewritten" : "unchanged"})`);
  }

  if (cleared.length) {
    writeFileSync(LANGUAGE_PATH, doc);
    exportSheet(QUEUE_PATH, true);
    // The modules are regenerated here so the pass is finished rather than staged:
    // a cleared record that has not reached `copy.ts` is still not on the page.
    execFileSync("npm", ["run", "language:generate"], { stdio: "inherit" });
  }
  for (const line of cleared) console.log(`cleared ${line}`);
  for (const line of refused) console.error(`REFUSED ${line}`);
  if (!cleared.length && !refused.length) console.log("nothing on the sheet to apply: no ticks and no corrections");
  if (refused.length) process.exit(1);
}

if (apply) {
  applyPass();
} else {
  exportSheet(out, force);
}
