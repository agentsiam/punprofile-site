/** Generates one disposable review view from LANGUAGE-SYSTEM.md. */

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

${entry.proposal_th ? `ร่างให้พิจารณา: ${entry.proposal_th}\n` : ""}
แก้เป็น:

เหตุผล / หมายเหตุ:
`).join("\n---\n\n");

const document = `---
status: generated review view
source: ${LANGUAGE_PATH}
---

# PunProfile language review queue

${rows.length} records need a verdict. This file is a review surface, not the source of truth. Read every item in one pass. Tick an unchanged item or write a replacement after \`แก้เป็น:\`. Apply the finished pass back to \`LANGUAGE-SYSTEM.md\`, update provenance and the text hash, then regenerate the TypeScript.

${items || "Nothing is waiting for review.\n"}
`;

const guard = force ? { safe: true, reasons: [] } : checkOverwrite(out);
if (!guard.safe) {
  console.error(out);
  for (const reason of guard.reasons) console.error(reason);
  process.exit(1);
}
writeFileSync(out, stamp(document));
console.log(`wrote ${out}: ${rows.length} records waiting`);
