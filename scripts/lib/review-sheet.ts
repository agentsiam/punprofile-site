/**
 * The Thai review sheet: one home, one builder, one parser.
 *
 * The sheet used to be written wherever the command happened to run, so eight
 * of them accumulated across two repositories and a work folder under three
 * different names, and a session naming one path while a reviewer read another
 * is how a pass went missing. `QUEUE_PATH` is the only place it is written now.
 *
 * The builder and the parser live together on purpose: `--apply` has to read
 * back exactly what the exporter wrote, and the two drifting apart would mean
 * silently misreading a verdict.
 */

import { resolve } from "node:path";
import { stamp } from "./review-guard.js";
import { LANGUAGE_PATH, LANGUAGE_ROOT, type LanguageEntry } from "./language-system.js";

/** The one home. Gitignored, beside the source it is generated from. */
export const QUEUE_PATH = resolve(LANGUAGE_ROOT, "LANGUAGE-REVIEW-QUEUE.md");

/** The sheet for the records still waiting, stamped so edits to it are visible. */
export function buildSheet(rows: LanguageEntry[]): string {
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
  return stamp(document);
}

/** One item's verdict, as the sheet carries it. */
export interface SheetVerdict {
  /** The record id, which is what a pass is cited by. Never the item number. */
  id: string;
  /** The box is ticked: the Thai above it stands as printed. */
  ticked: boolean;
  /** Thai written on the correction line: Paul's own wording. */
  rewrite: string | null;
  /** The draft printed above the line, to catch a model copying it across. */
  draft: string | null;
  /** Anything written under the reason line, kept for the record's basis. */
  note: string | null;
}

/** What the sheet says, item by item. Reads only; it never writes the file. */
export function parseSheet(doc: string): { oneWriter: boolean; verdicts: SheetVerdict[] } {
  const oneWriter = /^authorship: one-writer$/m.test(doc.split("\n---")[0] + doc.slice(0, 400));
  const chunks = doc.split(/^## \d+\. /m).slice(1);
  const verdicts = chunks.map((chunk) => {
    const id = /^`([^`]+)`/.exec(chunk)?.[1] ?? "";
    const between = (from: RegExp, to: RegExp) => {
      const a = from.exec(chunk);
      if (!a) return null;
      const rest = chunk.slice(a.index + a[0].length);
      const b = to.exec(rest);
      const text = (b ? rest.slice(0, b.index) : rest).trim();
      return text || null;
    };
    return {
      id,
      ticked: /^- \[[xX]\] Reviewed/m.test(chunk),
      rewrite: between(/^แก้เป็น:$/m, /^เหตุผล \/ หมายเหตุ:$/m),
      draft: /^ร่างให้พิจารณา: (.*)$/m.exec(chunk)?.[1]?.trim() ?? null,
      // Stops at the rule between items, or the separator joins the note.
      note: between(/^เหตุผล \/ หมายเหตุ:$/m, /^---$/m),
    };
  });
  return { oneWriter, verdicts: verdicts.filter((v) => v.id) };
}
