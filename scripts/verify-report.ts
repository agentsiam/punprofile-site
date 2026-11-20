/**
 * Every sheet of a saved report is a whole page, for any candidate.
 *
 *   npx tsx scripts/verify-report.ts
 *
 * The paid report is rendered for a set of fictional candidates chosen to break
 * the layout rather than to look plausible: a hyphenated name, a 40-character
 * name, one word, a nickname and a Thai name; an area where every competency
 * carries a long coach note and one with none; three active target titles and
 * none; roles that were sent and none at all. Nothing here reads a real
 * candidate, and nothing is written to disk.
 *
 * What it asserts is everything about a printed sheet that can be read off the
 * markup: the logo and the footer on every sheet, a header row on every table,
 * unique ids, section numbers that run straight, no sheet asked to hold more
 * than it has room for, and a cover name that fits its band at the size the
 * stylesheet will choose. What it cannot assert is how any of it looks, so a
 * pass here is the precondition for printing the thing and reading it, not a
 * substitute for doing so.
 */

import { renderFitReport, SHEET, sheetRow, COVER_EM } from "../src/lib/report.js";
import { FIT_SAMPLE_INPUT, fitSampleRatings } from "../src/lib/fit-sample.js";
import { scoreResponse, scoreFull } from "../src/lib/scoring.js";
import { ECRA } from "../src/lib/ecra.js";
import { rankMoves } from "../src/lib/levers.js";
import type { SentRoleRow } from "../src/lib/market-match.js";

const failures: string[] = [];
const fail = (msg: string) => failures.push(msg);
/** The widest split any one section needed, so a pass says what it exercised. */
let widest = { label: "none", heading: "", sheets: 1 };

const SENT: SentRoleRow[] = [
  { employer: "Zalando", title: "Senior Customer Success Manager (DACH)", country: "Germany", url: "https://example.com/a", reason: "Their DACH book is the work you already do, and the posting asks for English plus one more language.", liked: true },
  { employer: "Wise", title: "Technical Account Manager", country: "Netherlands", url: "https://example.com/b", reason: "API onboarding, which is most of your current role.", liked: false },
];

const NAMES: [string, string][] = [
  ["hyphenated", "Siriporn-Chaiyasit"],
  ["forty characters", "Kanyanat Siriwattanakul Prachayapruit Tho"],
  ["one word", "Phatcharaporn"],
  ["nickname", "Nok"],
  ["Thai", "ศิริพร ชัยยาสิทธิ์"],
];

/** The size the stylesheet will land on, in millimetres of type. */
function coverSize(name: string, bandMm: number, maxPt: number, minPt = 24): number {
  const whole = name.replace(/-/g, "‑");
  const run = Math.max(1, ...whole.split(/\s+/).map((w) => w.length));
  const len = Math.max(1, whole.length);
  const pt = (mm: number) => (mm * 72) / 25.4;
  return Math.max(minPt, Math.min(maxPt, pt(bandMm / (run * COVER_EM)), pt((bandMm * 3) / (len * COVER_EM))));
}

const profile = scoreResponse(FIT_SAMPLE_INPUT);
const LONG =
  "Strong on the evidence she gave in the call, and she talked through two examples unprompted, " +
  "but the second one turned on a decision her manager took, so this is a mark to revisit once " +
  "she has run something comparable on her own.";

for (const [nameCase, candidate] of NAMES) {
  for (const notes of ["every note long", "no notes"] as const) {
    for (const titles of [["Customer Success Manager", "Technical Account Manager", "FinOps Analyst"], []]) {
      for (const sent of [SENT, []]) {
        const ratings = fitSampleRatings().map((r) => ({ ...r, note: notes === "no notes" ? undefined : LONG }));
        const full = scoreFull(profile, ratings, (k) => ECRA[k]?.formula);
        const label = `${nameCase} / ${notes} / ${titles.length} titles / ${sent.length} sent`;
        const html = renderFitReport(
          { profile, full, moves: rankMoves(FIT_SAMPLE_INPUT), roles: { sent, pipeline: { inCountries: 0, matching: 0, examples: [] } } },
          { candidate, targetCountries: FIT_SAMPLE_INPUT.targetCountries, targetRole: FIT_SAMPLE_INPUT.targetRole ?? undefined, targetTitles: titles },
          { locale: "en", assetOrigin: "" },
        );

        // ---- every sheet is a whole page
        const sheets = html.match(/<section class="fit-sec"[\s\S]*?<\/section>/g) ?? [];
        if (!sheets.length) fail(`${label}: no sheets rendered`);
        const ids: string[] = [];
        for (const sheet of sheets) {
          const id = /id="([^"]+)"/.exec(sheet)?.[1] ?? "?";
          ids.push(id);
          if ((sheet.match(/class="fit-logo"/g) ?? []).length !== 1) fail(`${label}: sheet ${id} has no logo`);
          if ((sheet.match(/class="sec-foot"/g) ?? []).length !== 1) fail(`${label}: sheet ${id} has no footer`);
          if (/<table class="scores"/.test(sheet) && !/<thead>/.test(sheet)) {
            fail(`${label}: sheet ${id} has a score table with no header row`);
          }
        }
        const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
        if (dupes.length) fail(`${label}: repeated sheet id ${dupes.join(", ")}`);

        // ---- a section that runs on says where the reader is, on every sheet of it
        const runs = new Map<string, string[]>();
        for (const sheet of sheets) {
          const num = /class="sec-num">(\d+)</.exec(sheet)?.[1];
          if (num) runs.set(num, [...(runs.get(num) ?? []), sheet]);
        }
        for (const [num, group] of runs) {
          if (group.length === 1) continue;
          if (group.length > widest.sheets) {
            widest = { label, heading: /class="sec-num">\d+<\/span>([^<]*)/.exec(group[0])?.[1] ?? num, sheets: group.length };
          }
          for (const [i, sheet] of group.entries()) {
            if (!sheet.includes(`\u00b7 ${i + 1}/${group.length}<`)) {
              fail(`${label}: section ${num} spans ${group.length} sheets and sheet ${i + 1} does not say so`);
            }
          }
        }

        // ---- the numbers run straight, one per section however many sheets it takes.
        // The country page carries no number by design and is skipped here.
        const nums = sheets
          .map((sheet) => /class="sec-num">(\d+)</.exec(sheet)?.[1])
          .filter((n): n is string => n !== undefined);
        const seen: string[] = [];
        for (const n of nums) if (!seen.includes(n)) seen.push(n);
        const straight = seen.every((n, i) => Number(n) === i + 1);
        if (!straight) fail(`${label}: section numbers are ${seen.join(", ")}`);

        // ---- no sheet was asked to hold more than it has room for
        for (const sheet of sheets) {
          const rows = sheet.match(/<tr><th scope="row">[\s\S]*?<\/tr>/g) ?? [];
          if (!rows.length) continue;
          const id = /id="([^"]+)"/.exec(sheet)?.[1] ?? "?";
          const used = rows.reduce((mm, row) => {
            const cells = row.match(/<th scope="row">([\s\S]*?)<\/th>[\s\S]*?class="coach-note">([\s\S]*?)<\/td>/);
            const note = (cells?.[2] ?? "").replace(/<[^>]*>/g, "");
            return mm + sheetRow(cells?.[1] ?? "", note, /class="bk-line"/.test(row) ? 2 : 0);
          }, SHEET.heading + SHEET.thead + (/class="chart"/.test(sheet) ? SHEET.opener : 0));
          if (used > SHEET.content) {
            fail(`${label}: sheet ${id} is asked to hold ${used.toFixed(0)}mm of a ${SHEET.content}mm page`);
          }
        }

        // ---- the roles page is there when there is something to put on it
        const hasRoles = /<section class="fit-sec" id="roles"/.test(html);
        if (hasRoles !== sent.length > 0) {
          fail(`${label}: roles page ${hasRoles ? "present" : "absent"} with ${sent.length} sent`);
        }

        // ---- the cover name fits its band at the size the stylesheet will pick
        const h1 = /<h1 style="--cover-run:(\d+);--cover-len:(\d+)"/.exec(html);
        if (!h1) fail(`${label}: the cover name carries no measurements`);
        else {
          const size = coverSize(candidate, 110, 50);
          const runMm = Number(h1[1]) * COVER_EM * ((size * 25.4) / 72);
          if (runMm > 110.5 && size > 24) fail(`${label}: the longest run needs ${runMm.toFixed(0)}mm of a 110mm band at ${size.toFixed(1)}pt`);
        }
      }
    }
  }
}

const cases = NAMES.length * 2 * 2 * 2;
if (failures.length) {
  for (const f of failures) console.error(`FAIL ${f}`);
  console.error(`\n${failures.length} failure(s) across ${cases} fictional candidates`);
  process.exit(1);
}
console.log(`report sheets OK: ${cases} fictional candidates, every sheet a whole page`);
console.log(`  widest split: ${widest.sheets} sheets for "${widest.heading.trim()}" (${widest.label})`);
for (const [nameCase, candidate] of NAMES) {
  console.log(`  cover, ${nameCase}: ${coverSize(candidate, 110, 50).toFixed(1)}pt for "${candidate}"`);
}
