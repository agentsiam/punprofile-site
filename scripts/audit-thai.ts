/** Reports Thai provenance from the per-string canonical records. */

import { lintThai, type LintTarget } from "./lint-thai.js";
import { readLanguageSystem } from "./lib/language-system.js";

const system = readLanguageSystem();
const grouped = Map.groupBy(system.entries, (entry) => entry.source);
let failures = 0;

console.log("\nShipped Thai, by per-string provenance\n");
for (const [source, entries] of [...grouped].sort((a, b) => a[0].localeCompare(b[0]))) {
  const pass = entries.filter((entry) => entry.review.structural_calque === "pass").length;
  const pending = entries.filter((entry) => entry.review.structural_calque === "pending").length;
  const rejected = entries.filter((entry) => entry.review.structural_calque === "fail").length;
  console.log(`  ${source.padEnd(54)} ${String(pass).padStart(3)} approved  ${String(pending).padStart(3)} pending  ${String(rejected).padStart(2)} rejected`);
}

const pending = system.entries.filter((entry) => entry.review.structural_calque === "pending");
const rejected = system.entries.filter((entry) => entry.review.structural_calque === "fail");
const cleanCorpus = system.entries.filter((entry) => entry.provenance === "paul-written").length;
console.log(`\n  ${system.entries.length} total: ${system.entries.length - pending.length - rejected.length} approved, ${pending.length} pending, ${rejected.length} rejected; ${cleanCorpus} Paul-written corpus records.`);

console.log("\n  RULE BREAKS");
const surface = (entry: (typeof system.entries)[number]): LintTarget["surface"] => {
  if (/consent-copy|privacy/.test(entry.source)) return "system";
  if (/questions/.test(entry.source)) return "survey";
  return "app";
};
const findings = lintThai(system.entries.map((entry) => ({
  id: entry.id,
  en: entry.en,
  th: entry.th,
  surface: surface(entry),
}))).filter((finding) => {
  if (finding.level !== "fail") return false;
  const entry = system.byId.get(finding.target);
  return !(
    finding.rule === "LR-01" &&
    entry?.review.structural_calque === "pass" &&
    entry.en === entry.th
  );
});
for (const finding of findings) {
  console.log(`    ${finding.target}: [${finding.rule}] ${finding.message}`);
  failures++;
}
if (!failures) console.log("    none.");

console.log("\n  Review queue: npm run review:language\n");
process.exit(failures ? 1 : 0);
