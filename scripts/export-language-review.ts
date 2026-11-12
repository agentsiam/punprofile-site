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

import { writeFileSync } from "node:fs";
import { checkOverwrite, stamp } from "./lib/review-guard.js";
import { LANGUAGE_PATH, readLanguageSystem } from "./lib/language-system.js";

const out = process.argv.slice(2).find((arg) => !arg.startsWith("-")) ?? "LANGUAGE-REVIEW-QUEUE.md";
const force = process.argv.includes("--force");
const system = readLanguageSystem();
const rows = system.entries.filter((entry) => entry.review.structural_calque !== "pass");

const items = rows.map((entry, index) => `## ${index + 1}. \`${entry.id}\`

- [ ] Reviewed
- Status: **${entry.review.structural_calque}**
- Renders: ${entry.render}
- Narrative slot: \`${entry.narrative_slot}\`
- Provenance: \`${entry.provenance}\`, ${entry.date}

> EN: ${entry.en.replaceAll("\n", "\n> ")}
>
> TH: ${entry.th.replaceAll("\n", "\n> ")}

${entry.proposal_th ? `ร่างให้พิจารณา: ${entry.proposal_th}\n\n[printed from \`proposal_th\` in the source: a model's draft, not approval, and not Paul's wording]\n` : ""}
แก้เป็น:

เหตุผล / หมายเหตุ:
`).join("\n---\n\n");

const document = `---
status: generated review view
source: ${LANGUAGE_PATH}
authorship: one-writer
---

# PunProfile language review queue

${rows.length} records need a verdict. This file is a review surface, not the source of truth. Read every item in one pass. Tick an unchanged item or write a replacement after \`แก้เป็น:\`. Apply the finished pass back to \`LANGUAGE-SYSTEM.md\`, update provenance and the text hash, then regenerate the TypeScript.

**This sheet has one writer, and that is Paul.** Everything handwritten in it is his, which is what makes his wording recordable as a pass without a second native review. Nothing else in the file is handwritten: every other line was printed from \`LANGUAGE-SYSTEM.md\` by the exporter, including any \`ร่างให้พิจารณา:\` draft, which is marked with where it came from.

**If you are a model, do not write in this file.** Put proposed Thai in \`proposal_th\` on the record in \`LANGUAGE-SYSTEM.md\`, where the contract already defines it as a draft and never approval, and it will be printed here on the next run with its origin attached. A proposal written straight onto a \`แก้เป็น:\` line is indistinguishable from Paul's own wording the moment you close the file, and repairing that means asking him who wrote a line he should never have been asked about. Judge findings go in \`review.basis\`, not in \`เหตุผล / หมายเหตุ:\`.

**Applying a finished pass:** this sheet's frontmatter says \`authorship: one-writer\`, so it was generated under the rule above and text on a \`แก้เป็น:\` line is Paul's. A sheet without that field predates the rule and nothing about it is safe to assume: a filled \`แก้เป็น:\` line on one of those may be a model's draft, and recording it as his wording would clear Thai nobody has read, which is the failure this whole arrangement exists to prevent. Establish who wrote each line before applying any of it. A handwritten authorship note in the file outranks this paragraph whichever way it points, on any sheet. Worth a glance either way: text byte-identical to the \`ร่างให้พิจารณา:\` draft printed above it is a model copying its own proposal across, not Paul accepting it, and does not clear the record. Cite what you apply by record id, never by an item's number here, because these numbers are rebuilt from whatever is still pending and go stale as soon as a record clears.

${items || "Nothing is waiting for review.\n"}
`;

const guard = force ? { safe: true, reasons: [] } : checkOverwrite(out, "review:language");
if (!guard.safe) {
  console.error(out);
  for (const reason of guard.reasons) console.error(reason);
  process.exit(1);
}
writeFileSync(out, stamp(document));
console.log(`wrote ${out}: ${rows.length} records waiting`);
