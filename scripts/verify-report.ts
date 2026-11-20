/**
 * Every sheet of a saved report is a whole page, for any candidate.
 *
 *   npx tsx scripts/verify-report.ts
 *
 * The paid report is rendered for a set of fictional candidates chosen to break
 * the layout rather than to look plausible: a hyphenated name, a 40-character
 * name, one word, a nickname and a Thai name; an area where every competency
 * carries a long coach note and one with none; three active target titles and
 * none; roles that were sent, none sent so that the public pipeline is what
 * the page shows, and nothing at all. Nothing here reads a real candidate,
 * and nothing is written to disk.
 *
 * What it asserts is everything about a printed sheet that can be read off the
 * markup: the logo and the footer on every sheet, a header row on every table,
 * unique ids, section numbers that run straight, no sheet asked to hold more
 * than it has room for, the roles page included, and a cover name that fits
 * its band at the size the
 * stylesheet will choose. What it cannot assert is how any of it looks, so a
 * pass here is the precondition for printing the thing and reading it, not a
 * substitute for doing so.
 */

import { renderFitReport, renderReport, ROLE, SHEET, roleRow, sheetRow, COVER_EM } from "../src/lib/report.js";
import { FIT_SAMPLE_INPUT, fitSampleRatings } from "../src/lib/fit-sample.js";
import { scoreResponse, scoreFull } from "../src/lib/scoring.js";
import { ECRA } from "../src/lib/ecra.js";
import { rankMoves } from "../src/lib/levers.js";
import { matchPipeline, type RoleMatch, type SentRoleRow, type TargetRow } from "../src/lib/market-match.js";

const failures: string[] = [];
const fail = (msg: string) => failures.push(msg);
/** The widest split any one section needed, so a pass says what it exercised. */
let widest = { label: "none", heading: "", sheets: 1 };

/**
 * `ROLE_CAP` roles, each carrying what a sent role really carries: a reason,
 * which `checklist.addFound` requires of every role the evening run adds, and
 * the posting's own link. Six of those do not fit one sheet, which is why the
 * page is dealt into sheets, so the full set is what this has to exercise.
 */
const SENT: SentRoleRow[] = (
  [
    ["Zalando", "Senior Customer Success Manager (DACH)", "Germany"],
    ["Wise", "Technical Account Manager", "Netherlands"],
    ["Adyen", "Enterprise Customer Success Manager, Benelux", "Netherlands"],
    ["Personio", "Customer Success Manager (m/f/d) — Mid-Market", "Germany"],
    ["Mollie", "Technical Account Manager, Payments Platform", "Netherlands"],
    ["N26", "FinOps Analyst, Cost and Cloud", "Germany"],
  ] as const
).map(([employer, title, country], i) => ({
  employer,
  title,
  country,
  url: `https://example.com/very/long/posting/path/that/wraps/${i}-${employer.toLowerCase()}-role`,
  reason:
    "Their DACH book is the work you already do, and the posting asks for English plus one more language, which is the pairing your last two roles were built on.",
  liked: i % 2 === 0,
}));

/** With nothing sent, the page falls back to the published list, matched on
 *  the candidate's own target titles. That is the state between roles sent and
 *  no page at all, and it is read out of the generated market snapshot. */
const TARGETS: TargetRow[] = ["Customer Success Manager", "Technical Account Manager", "FinOps Analyst"].map((title) => ({
  title,
  alsoCalled: [],
  roleCategory: null,
  countries: null,
}));
const NO_PIPELINE: RoleMatch = { inCountries: 0, matching: 0, examples: [] };

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

const PIPELINE: RoleMatch = matchPipeline(FIT_SAMPLE_INPUT.targetCountries ?? [], TARGETS, FIT_SAMPLE_INPUT.targetRole);
if (!PIPELINE.matching) {
  // C47. The published list is read across a boundary. A snapshot that matched
  // none of the sample's titles would leave this file quietly testing two of
  // the roles page's three states and still passing.
  console.error("FAIL the published role list matches none of the sample's target titles, so the pipeline state went untested");
  process.exit(1);
}

/** The roles page has three states and the page is a different page in each. */
const ROLE_STATES: [string, SentRoleRow[], RoleMatch][] = [
  ["sent", SENT, NO_PIPELINE],
  ["pipeline", [], PIPELINE],
  ["no roles", [], NO_PIPELINE],
];

const profile = scoreResponse(FIT_SAMPLE_INPUT);
const LONG =
  "Strong on the evidence she gave in the call, and she talked through two examples unprompted, " +
  "but the second one turned on a decision her manager took, so this is a mark to revisit once " +
  "she has run something comparable on her own.";

for (const [nameCase, candidate] of NAMES) {
  for (const notes of ["every note long", "no notes"] as const) {
    for (const titles of [["Customer Success Manager", "Technical Account Manager", "FinOps Analyst"], []]) {
      for (const [state, sent, pipeline] of ROLE_STATES) {
        const ratings = fitSampleRatings().map((r) => ({ ...r, note: notes === "no notes" ? undefined : LONG }));
        const full = scoreFull(profile, ratings, (k) => ECRA[k]?.formula);
        const label = `${nameCase} / ${notes} / ${titles.length} titles / ${state}`;
        const html = renderFitReport(
          { profile, full, moves: rankMoves(FIT_SAMPLE_INPUT), roles: { sent, pipeline } },
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

        // ---- the roles page is there when there is something to put on it,
        //      which is roles sent OR a published list matched on their titles,
        //      and gone when there is neither.
        const hasRoles = /<section class="fit-sec" id="roles"/.test(html);
        const wantRoles = sent.length > 0 || pipeline.matching > 0;
        if (hasRoles !== wantRoles) {
          fail(`${label}: roles page ${hasRoles ? "present" : "absent"} in the ${state} state`);
        }

        // ---- no sheet of the roles page is asked to hold more than it has
        //      room for either. Nothing in the tab reflows a list of roles, so
        //      the renderer's own split is the only thing standing between six
        //      roles and a sheet with the footer alone on it.
        const roleSheets = sheets.filter((sheet) => /id="roles(-\d+)?"/.test(sheet));
        if (wantRoles && !roleSheets.length) fail(`${label}: no roles sheet rendered in the ${state} state`);
        for (const [i, sheet] of roleSheets.entries()) {
          const id = /id="([^"]+)"/.exec(sheet)?.[1] ?? "?";
          const items = sheet.match(/<li>[\s\S]*?<\/li>/g) ?? [];
          const used =
            SHEET.heading +
            (i === 0 ? ROLE.lede : 0) +
            (i === roleSheets.length - 1 ? ROLE.note + ROLE.fine : 0) +
            items.reduce((mm, item) => {
              const title = /class="r-title">([\s\S]*?)<\/span>/.exec(item)?.[1] ?? "";
              const reason = /class="r-why">([\s\S]*?)<\/span>/.exec(item)?.[1] ?? null;
              const url = /class="r-link" href="([^"]*)"/.exec(item)?.[1] ?? null;
              return mm + roleRow({ title, reason, url });
            }, 0);
          if (used > SHEET.content) {
            fail(`${label}: roles sheet ${id} is asked to hold ${used.toFixed(0)}mm of a ${SHEET.content}mm page`);
          }
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

// ---------------------------------------------------------------- the free report
//
// The same two rules it shares with the paid one, a header and a footer on every
// sheet, plus the switch: someone who already has the Fit Report must not be sent
// the version that sells it to them, and the pages must still count straight once
// that page is gone.
for (const has of [false, true]) {
  const html = renderReport(
    profile,
    { candidate: "Siriporn-Chaiyasit", coverName: "Siriporn-Chaiyasit", targetCountries: FIT_SAMPLE_INPUT.targetCountries },
    { variant: "limited", locale: "en", assetOrigin: "", fitReport: !has },
  );
  const who = has ? "already has the Fit Report" : "has not bought it";
  const pages = html.match(/<section class="page[\s\S]*?<\/section>/g) ?? [];
  if (!pages.length) fail(`free report, ${who}: no pages rendered`);
  for (const page of pages) {
    // The cover carries neither, in this report and in the paid one: a running
    // header and a page number on a cover would be furniture on a title page.
    const cls = /<section class="([^"]*)"/.exec(page)?.[1] ?? "";
    if (cls.split(" ").includes("cover")) continue;
    const id = /id="([^"]*)"/.exec(page)?.[1] ?? cls;
    if (!/class="pg-head"/.test(page)) fail(`free report, ${who}: page ${id} has no header`);
    if (!/class="pg-foot/.test(page)) fail(`free report, ${who}: page ${id} has no footer`);
  }
  // The badge and the page that sells it, present for one and gone for the other.
  for (const [what, re] of [
    ["the free-version badge", /class="cover-badge"/],
    ["the page selling the Fit Report", /<section class="page" id="full">/],
    ["a banner saying what the paid version adds", /class="preview"/],
  ] as const) {
    if (re.test(html) === has) fail(`free report, ${who}: ${what} is ${has ? "there" : "missing"}`);
  }
  // The numbers on the pages run straight either way.
  const ns = [...html.matchAll(/<span class="sec-n">(\d+)<\/span>/g)].map((m) => Number(m[1]));
  if (!ns.every((n, i) => n === i + 1)) fail(`free report, ${who}: page numbers are ${ns.join(", ")}`);
  // And the footers keep counting every sheet, numbered or not.
  const fs = [...html.matchAll(/class="pg-n">(\d+)</g)].map((m) => Number(m[1]));
  if (!fs.every((n, i) => n === i + 2)) fail(`free report, ${who}: footer numbers are ${fs.join(", ")}`);
}

const cases = NAMES.length * 2 * 2 * ROLE_STATES.length;
if (failures.length) {
  for (const f of failures) console.error(`FAIL ${f}`);
  console.error(`\n${failures.length} failure(s) across ${cases} fictional candidates`);
  process.exit(1);
}
console.log(`report sheets OK: ${cases} fictional candidates, every sheet a whole page`);
console.log("  free report: the badge, the banners and the page that sells the Fit Report go for someone who has it");
console.log(`  widest split: ${widest.sheets} sheets for "${widest.heading.trim()}" (${widest.label})`);
for (const [nameCase, candidate] of NAMES) {
  console.log(`  cover, ${nameCase}: ${coverSize(candidate, 110, 50).toFixed(1)}pt for "${candidate}"`);
}
