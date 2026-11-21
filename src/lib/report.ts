/**
 * The assessment as a document, in two variants, built for print.
 *
 * Structure follows `08_Coaching_Business.md` → ECRA "Candidate Report
 * Structure": executive summary, one spider chart per assessment, top
 * strengths, development priorities, readiness summary.
 *
 * Styling is token-driven, from the brand system in `design.md`. The tokens
 * themselves live in `design-tokens.ts`, shared with the report book and the
 * two-views demo, so a palette change is one edit rather than three. Report
 * HTML is standalone and cannot use `next/font`, hence the font <link>.
 *
 * Every score in the document carries its tier, and a table view mirrors every
 * chart — `prd.md` § 7 requires the non-visual form, and FR-007 requires the
 * self-reported labelling to be impossible to miss.
 *
 * ---------------------------------------------------------------------------
 * PDF, AND WHY THERE IS NO PDF LIBRARY HERE. 17/08/2026.
 * ---------------------------------------------------------------------------
 *
 * The coach sends this to the candidate, so it had to become a PDF rather than
 * an HTML file that arrives in an inbox as an attachment nobody opens on a
 * phone. It is produced by printing this document from the browser, and the
 * whole PDF layer is the `@page` block and the `@media print` rules below.
 *
 * **The alternative was a PDF library, and Thai rules it out.** Thai does not
 * put spaces between words, so correct line breaking needs a dictionary.
 * Chrome ships ICU and does it. `@react-pdf/renderer` and jsPDF break on
 * whitespace, which turns a Thai paragraph into one unbreakable line running
 * off the page. The limited variant is the Thai one, so that is not a
 * trade-off, it is a wall.
 *
 * A headless-Chrome route would return a real `.pdf` in one click and remains
 * open as a later step: it would render THIS html, so nothing here is thrown
 * away by starting with the print dialog. It is not worth ~50MB of Chromium in
 * a serverless function while a person is in the loop anyway.
 *
 * Two consequences worth knowing rather than discovering:
 *
 * - **Fonts must be loaded before `print()` fires**, or the PDF is set in the
 *   fallback stack. `PRINT_BOOTSTRAP` waits on `document.fonts.ready`.
 * - **Chrome ignores `@page` margin boxes**, so there are no automatic page
 *   numbers. Each section carries its own footing instead.
 *
 * ---------------------------------------------------------------------------
 * TWO VARIANTS
 * ---------------------------------------------------------------------------
 *
 * `full` is the coach's copy. English, every competency, tier badges, and the
 * reason each unscored item is blank.
 *
 * `limited` is what the candidate is sent, and is the same document with the
 * internals taken out: no tier badges, no why-blank column, no raw coverage
 * percentage, and no rows for competencies the survey cannot reach. It is
 * localised. Its own wording is checked for internal vocabulary by
 * `scripts/verify-report.ts` and `verify-copy`, before a release, never while a
 * coach or candidate opens it: the client's own words, such as a "Growth Lead"
 * target title, must never stop a report from being delivered (Paul, 21/11/2026).
 *
 * The unscored ROWS go too, which is one step past "hide the internal
 * columns". With the why-blank column removed their only remaining content was
 * an em dash, and twenty-nine of those read as twenty-nine failures rather
 * than as twenty-nine things a form cannot see. The honest version of that
 * information is the count line under the table, which is kept.
 */

import { radarSvg } from "./radar";
import { BRAND_FONT_LINK, BRAND_FONT_STACKS, BRAND_TOKENS_CSS } from "./design-tokens";
import type { RadarAxis } from "./radar";
import { buildNarrative } from "./narrative";
import { itemName, dimensionName, dimensionNameByLabel } from "./views";
import { t, type Locale } from "./locale";
import { BAND_COPY, DIMENSIONS, GATES } from "./model";
import { topStrengths, developmentPriorities, scoreResponse, scoreFull } from "./scoring";
import { ECRA } from "./ecra";
import { FIT_SAMPLE_INPUT, fitSampleRatings } from "./fit-sample-core";
import { RESULTS, SAMPLE_LABEL } from "./content/home";
import { projectUnlock } from "./levers";
import { FIT_CALLOUTS, FULL_CTA, FULL_SAMPLE, HERO_SAMPLE_SCORES } from "./content/products";
import { CLOSE_LEAD, COACHES, HOOK_BODY, HOOK_EYEBROW, HOOK_LINE_1, HOOK_LINE_2, PAIN_HEADING, PAINS } from "./content/coaching";
import { PRICING_QUESTIONS } from "./content/pricing";
import { DESTINATIONS } from "./content/cta";
import type { ProfileScore } from "./scoring";
import type { Tier } from "./model";
import { COUNTRY_FACTS, COUNTRY_FACTS_RESEARCHED } from "./content/country-facts.generated";
import { COUNTRY_FACTS_TEXT, COUNTRY_PAGE_LABELS } from "./content/country-page";
import { FREE_BADGE, FREE_BADGE_NOTE, INTERVIEW_BODY, METHOD_NOTE, INTERVIEW_HEADING, PREVIEW_AREAS, PREVIEW_LABEL, PREVIEW_MOVES, PREVIEW_ROLES } from "./content/report-upsell";

/**
 * The country page, added 20/11/2026: quick facts for the first country the
 * candidate ticked, laid out per permit route (Paul, Q2 option 2a).
 *
 * Facts come from `country-facts.generated.ts`, which already drops anything the
 * coaching repo has not confirmed on a government page. Every sentence of fact
 * text is looked up in `COUNTRY_FACTS_TEXT` by its exact English; a miss throws,
 * because a fact that changed upstream must not reach a candidate untranslated
 * or carrying last year's Thai (Paul, Q1 option 1a). Country and capital names
 * stay in English, as the country question itself prints them.
 *
 * Returns "" when the first choice is "not sure" or a country with no facts row.
 */
export function countryFactsBody(country: string | undefined, locale: Locale, asset: (p: string) => string = (p) => p): string {
  const row = COUNTRY_FACTS.find((c) => c.country === country);
  if (!row) return "";
  const L = (k: keyof typeof COUNTRY_PAGE_LABELS) => esc(COUNTRY_PAGE_LABELS[k][locale]);
  const tx = (en: string) => {
    const hit = COUNTRY_FACTS_TEXT[en];
    if (!hit) throw new Error(`countryFactsBody: no copy record for fact text "${en}". Add it to LANGUAGE-SYSTEM.md.`);
    return esc(hit[locale]);
  };
  const link = (href: string, label: string) => `<a href="${esc(href)}">${label}</a>`;
  const routes = row.routes
    .map((r) => {
      const rows: string[] = [];
      if (r.employer) rows.push(`<dt>${L("employer")}</dt><dd>${tx(r.employer)}</dd>`);
      rows.push(
        `<dt>${L("salary")}</dt><dd>${
          r.salary
            ? `${tx(r.salary)}${r.salaryAsOf ? ` <span class="cf-meta">${L("as_of")} ${esc(r.salaryAsOf)}</span>` : ""}${
                r.salarySource ? ` <span class="cf-meta">${link(r.salarySource, L("source"))}</span>` : ""
              }`
            : `<span class="cf-meta">${L("salary_none")}</span>`
        }</dd>`,
      );
      if (r.partner) rows.push(`<dt>${L("partner")}</dt><dd>${tx(r.partner)}</dd>`);
      if (r.processing)
        rows.push(
          `<dt>${L("processing")}</dt><dd>${tx(r.processing)}${
            r.processingUrl ? ` <span class="cf-meta">${link(r.processingUrl, L("official"))}</span>` : ""
          }</dd>`,
        );
      return `<article class="cf-route">
    <h3>${tx(r.name)}</h3>
    <dl>${rows.join("")}</dl>
    ${r.url ? `<p class="cf-link">${link(r.url, L("official"))}</p>` : ""}
  </article>`;
    })
    .join("\n  ");
  // Paul's photographs of each capital, 20/11/2026, in public/images/countries/
  // named by the country in lower case with hyphens.
  const photo = asset(`/images/countries/${row.country.toLowerCase().replace(/\s+/g, "-")}.jpg`);
  return `<div class="cf">
  <div class="cf-hero">
    <div class="cf-photo"><img src="${photo}" alt="" onerror="this.closest('.cf-hero').classList.add('no-photo');this.parentNode.remove()"></div>
    <div class="cf-hero-text">
      <p class="cf-eyebrow">${L("title")}</p>
      <h2>${esc(row.country)}</h2>
      <p class="cf-facts"><span>${L("capital")} <strong>${esc(row.capital)}</strong></span><span>${L("time")} <strong>${tx(row.timeFromBangkok)}</strong></span></p>
    </div>
  </div>
  <p class="cf-lede">${L("intro")}</p>
  ${row.note ? `<p class="cf-note">${tx(row.note)}</p>` : ""}
  ${routes}
  ${row.otherRoutes ? `<p class="cf-note"><strong>${L("other_routes")}:</strong> ${tx(row.otherRoutes)}</p>` : ""}
  <p class="cf-meta">${L("checked")} ${esc(COUNTRY_FACTS_RESEARCHED)}</p>
</div>`;
}

/**
 * The cover's geometry, in millimetres of the printed page.
 *
 * A cover is a text column on the left and a picture on the right, and the
 * picture is 92mm wide pinned to the band's right edge, so the column the text
 * may use ends where the picture's column begins. Nothing used to say so on the
 * Fit Report's cover: the name was given 110mm and the line under it 100mm of a
 * band whose picture starts at 102mm, so an ordinary two-word name printed its
 * lime line under the photograph. The free report's cover already keeps that
 * gutter, and these are the numbers that make both of them keep it.
 *
 * The name is the one element allowed the full width, because it sits above the
 * picture rather than beside it — so what it needs instead is a floor: its
 * block has to end before the picture's top edge, which is `nameBudget` below.
 *
 * Read by `scripts/verify-report.ts` as well as by the stylesheet, so a cover
 * element and the check that it clears the picture cannot drift apart.
 */
export const COVER = {
  /** The page, and the Fit Report band's own height and padding. */
  page: 210,
  band: 200,
  padX: 16,
  padY: 18,
  /** The logo above the eyebrow, then the eyebrow's margins and its one line. */
  logo: 11,
  eyebrowTop: 30,
  eyebrowLine: 6,
  eyebrowBottom: 3,
  /** The picture: square, pinned to the band's right, hanging below the band. */
  artW: 92,
  artRight: 16,
  artBelow: 24,
  /** What is kept between the text column and the picture's column. */
  gutter: 8,
  /** The name: its own width, its ceiling and floor, and its line height. */
  nameW: 110,
  nameMax: 50,
  nameMin: 24,
  nameLead: 1.02,
  /** 11pt text in the band: one line box, and one character's own advance. */
  line: 6,
  charMm: 2.17,
  /** The meta line's top margin; the lime line's top margin and its padding. */
  subTop: 5,
  pillTop: 9,
  pillPad: 2,
  /** The free report's cover, which puts its picture in the same column. */
  freeNameW: 80,
  freeSubW: 78,
  freeBadgeW: 68,
};

/** The picture's own edges on the Fit Report's cover, from the band's corner. */
export const COVER_ART = {
  left: COVER.page - COVER.artRight - COVER.artW,
  right: COVER.page - COVER.artRight,
  top: COVER.band + COVER.artBelow - COVER.artW,
  bottom: COVER.band + COVER.artBelow,
};

/** The column the text may use, where it starts, and the name's own ceiling. */
export const COVER_TEXT = {
  left: COVER.padX,
  width: COVER_ART.left - COVER.padX - COVER.gutter,
  top: COVER.padY + COVER.logo + COVER.eyebrowTop + COVER.eyebrowLine + COVER.eyebrowBottom,
  nameBudget: COVER_ART.top - (COVER.padY + COVER.logo + COVER.eyebrowTop + COVER.eyebrowLine + COVER.eyebrowBottom) - COVER.gutter,
};

export const UPSELL_STYLES = `
  .cover-badge { margin: 8mm 0 0; max-width: ${COVER.freeBadgeW}mm; font-size: 9.5pt; font-weight: 600; line-height: 1.4; }
  .cover-badge span { display: table; padding: 1.5mm 4mm; margin-right: 2mm; border-radius: 4mm; background: var(--color-ink-deep); color: var(--color-canvas-brand); font-size: 11pt; font-weight: 900; margin-bottom: 1.5mm; }
  .preview { margin: 4mm 0 0; padding: 3mm 4mm; border-radius: 3mm; background: var(--color-canvas-brand); font-size: 8.5pt; break-inside: avoid; }
  .preview strong { margin-right: 1.5mm; }
  .method-note { margin: 4mm 0 0; padding-top: 2.5mm; border-top: 0.3mm solid var(--color-line); font-size: 7.5pt; color: var(--color-mute-strong); }
  .interview { display: grid; grid-template-columns: 42mm 1fr; gap: 5mm; align-items: center; margin: 4mm 0 5mm; padding: 4mm; border-radius: 5mm; background: var(--color-action); color: var(--color-on-action); break-inside: avoid; }
  .interview img { width: 42mm; height: 30mm; object-fit: cover; border-radius: 3mm; }
  .interview h3 { margin: 0 0 1.5mm; font-size: 15pt; font-weight: 900; }
  .interview p { margin: 0; font-size: 9.5pt; line-height: 1.45; }
`;

export const FUN_FACTS_STYLES = `
  .ff-card { border: 0.3mm solid var(--color-line); border-radius: 4mm; padding: 4mm 5mm; margin: 0 0 4mm; break-inside: avoid; }
  .ff-label { margin: 0 0 3mm; font-size: 10pt; font-weight: 800; }
  .ff-bars { list-style: none; padding: 0; margin: 0; display: grid; gap: 2mm; }
  .ff-bars li { display: grid; grid-template-columns: 52mm 1fr 12mm; align-items: center; gap: 3mm; font-size: 8.5pt; }
  .ff-track { height: 2mm; border-radius: 1mm; background: var(--color-surface-container); }
  .ff-track span { display: block; height: 2mm; border-radius: 1mm; background: var(--color-primary); }
  .ff-pct { text-align: right; font-weight: 700; }
  .ff-line { margin: 3mm 0 0; font-size: 9pt; }
  .ff-foot { margin: 2mm 0 0; font-size: 7.5pt; color: var(--color-mute-strong); }
  .ff-you ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 2.5mm; font-size: 9pt; }
  .ff-big { font-size: 14pt; font-weight: 900; margin-right: 1.5mm; }
`;

export const COUNTRY_STYLES = `
  .cf-hero { position: relative; height: 78mm; margin: 0 0 5mm; border-radius: 6mm; overflow: hidden; background: var(--color-ink-deep); break-inside: avoid; }
  /* The photo and its dark fade sit in their own box with a filter that does nothing visible, so
     Chrome prints them as one flat picture. Printed as a see-through gradient instead, macOS Preview
     drew the fade pink (Paul, 20/11/2026). The text stays outside the box, so it prints as text. */
  .cf-photo { position: absolute; inset: 0; filter: saturate(1.0001); }
  .cf-photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .cf-photo::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.05) 15%, rgba(0,0,0,0.8) 100%); }
  .cf-hero-text { position: absolute; left: 7mm; right: 7mm; bottom: 6mm; z-index: 1; color: #fff; }
  .cf-eyebrow { display: inline-block; margin: 0 0 2mm; padding: 0.8mm 3mm; border-radius: 3mm; font-size: 8.5pt; font-weight: 800; background: var(--color-brand-lime); color: var(--color-ink-deep); }
  .cf-hero h2 { margin: 0 0 2mm; font-size: 30pt; font-weight: 900; line-height: 1; color: #fff; }
  .cf-facts { display: flex; gap: 7mm; flex-wrap: wrap; margin: 0; font-size: 8.5pt; }
  .cf-facts strong { display: block; font-size: 10pt; }
  .cf-lede { margin: 0 0 4mm; font-size: 9.5pt; }
  .cf-note { margin: 0 0 3mm; font-size: 8.5pt; }
  .cf-route { border-radius: 4mm; padding: 4mm 5mm; margin: 0 0 3mm; background: var(--color-canvas-soft); border-left: 2mm solid var(--color-brand-lime); break-inside: avoid; }
  .cf-route h3 { margin: 0 0 2.5mm; font-size: 11.5pt; font-weight: 800; }
  .cf-route dl { display: grid; grid-template-columns: 38mm 1fr; gap: 1.2mm 4mm; margin: 0; font-size: 8.5pt; }
  .cf-route dt { font-weight: 700; }
  .cf-route dd { margin: 0; }
  .cf-link { margin: 2mm 0 0; font-size: 8pt; }
  .cf-meta { font-size: 7.5pt; color: var(--color-mute-strong); }
  .cf a { color: inherit; text-decoration: underline; }
`;

export interface ReportMeta {
  /** Display name or a pseudonymous reference. */
  candidate: string;
  submittedAt?: string;
  targetCountries?: string[];
  targetRole?: string;
  /**
   * The candidate's active target titles, as job ads write them, in the
   * coach's priority order. The paid report's cover and its roles page
   * prefer these to `targetRole`, which is the questionnaire's broad field:
   * "IT & Software" is not what a client with three live titles is being
   * put forward for. The field stays the fallback for someone with none.
   */
  targetTitles?: string[];
  currentRole?: string;
  /**
   * The name on the Fit Report book's cover in the free report, when it is not
   * `candidate`: the result screen titles its PDF "your result" but still knows
   * the name typed at the contact step. 27/10/2026.
   */
  coverName?: string;
}

export type ReportVariant = "full" | "limited" | "fit";

export interface ReportOptions {
  /**
   * Whether the free report carries the Fit Report with it: the free-version
   * badge on the cover, the banners saying what the paid version adds, and the
   * page that sells it with the 30-minute interview and a sample sheet.
   *
   * On by default, because the candidate who downloads this from the result
   * screen has bought nothing yet. Off for someone who already has the Fit
   * Report, and the coach's own screen reads that off the record rather than
   * asking: a tick box that has to be remembered is a wrong document waiting to
   * be sent, and it was the badge on the cover that gave it away.
   */
  fitReport?: boolean;
  /** Defaults to `full`, so the two offline scripts need no argument. */
  variant?: ReportVariant;
  /**
   * Only read by the `limited` variant. The full report is coach-facing and
   * English on purpose; `copy.ts` says so at the top of the file.
   */
  locale?: Locale;
  /**
   * Emit the script that waits for fonts and opens the print dialog.
   *
   * Off by default. The offline scripts write these to disk for reading, and a
   * file that prints itself on open is a file nobody opens twice.
   */
  autoPrint?: boolean;
  /**
   * Fit Report only: draw grey lines where a competency below the bar has no
   * coach note. For the public sample, where an invented note would read as
   * real advice. 28/10/2026.
   */
  sampleNotes?: boolean;
  /**
   * Candidate report only: include the two Coaching 1:1 pages at the end.
   * Default on; a coach sending the report to someone already in Coaching 1:1
   * turns it off. Paul 2a, 20/11/2026.
   */
  coaching?: boolean;
  /**
   * Candidate report only: where its pictures load from. The document is
   * written into a blank tab, so callers in the browser pass their own origin.
   */
  assetOrigin?: string;
  /**
   * Candidate report only: the result of `api.stats.community`, for the
   * "from everyone who has taken this" page (Paul, Q1 option 1a, 20/11/2026).
   * Aggregates and percentages only; the query never returns a sample size, so
   * this page cannot print how many people completed the check. Absent or all
   * null, the page is left out.
   */
  community?: CommunityStats;
}

/** The shape `convex/stats.ts` `community` returns. Percentages only, by design. */
export interface CommunityStats {
  shares: Record<string, { pct: number } | null>;
  topCountries: { country: string; share: number }[] | null;
  distribution: Record<string, number[] | null>;
  mostLanguages: number | null;
}

/** Same rule as `CommunityStats.tsx`: understates on ties, caps at 95. */
function percentBelow(score: number, boundaries: number[]): number {
  const under = boundaries.filter((b) => b < score).length;
  return Math.max(0, (under - 1) * 5);
}

const esc = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * DD/MM/YYYY, the house format, from whatever the caller had.
 *
 * The app passes an ISO date; the offline scripts pass the Google Form's own
 * `7/8/2026 1:14:46`, which is ambiguous between two date orders and carries a
 * timestamp nobody needs on a printed report. Anything unrecognised is returned
 * as it came, because a submission date that cannot be parsed is still better
 * shown than silently dropped.
 */
/**
 * A candidate's name on a cover, sized to its band instead of wrapped badly.
 *
 * Three things, because a name is the one string on the page we do not control
 * the shape of: a hyphenated name keeps its hyphen non-breaking, so it never
 * splits across two lines at the hyphen; the longest unbreakable run and the
 * whole length go to the stylesheet as numbers, which shrinks the type until
 * the run fits the band and the name fits three lines; and only once the floor
 * is reached does the stylesheet break a word, which is better than a name
 * running off the cover. Latin, Thai, one word, a nickname or a double-barrelled
 * name all come out whole.
 */
function coverName(name: string, fit?: { width: number; max: number; budget: number }): string {
  const whole = name.replace(/-/g, "\u2011");
  const run = Math.max(1, ...whole.split(/\s+/).filter(Boolean).map((w) => w.length));
  // A cover that keeps a height for its name needs the line count to divide it
  // by, and CSS cannot wrap a string. So the wrap is done here, at the size the
  // name's own two ceilings give, and sent out as a number. A smaller size only
  // ever takes fewer lines, so a count made at the larger one cannot let the
  // name grow past the height it was given.
  const lines = fit ? `;--cover-lines:${coverLines(whole, fit.width, coverNameSize(whole, fit.width, fit.max))}` : "";
  return `<h1 style="--cover-run:${run};--cover-len:${Math.max(1, whole.length)}${lines}">${esc(whole)}</h1>`;
}

function ddmmyyyy(raw: string): string {
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`;
  // The sheet export is D/M/YYYY, matching the locale the form was filled in.
  const sheet = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (sheet) return `${sheet[1].padStart(2, "0")}/${sheet[2].padStart(2, "0")}/${sheet[3]}`;
  return raw;
}

const TIER_BADGE: Record<Tier, { text: string; title: string }> = {
  ecra: { text: "measured", title: "The survey collects this competency's own defined inputs. This is the real framework score." },
  proxy: { text: "proxy", title: "The survey evidences part of the picture. Named as its own observable thing, not as the competency it gestures at." },
  coach: { text: "needs a coach", title: "No survey evidence exists for this. Left blank rather than estimated." },
};

/**
 * Waits for the webfonts, then prints.
 *
 * `document.title` is what Chrome seeds the PDF filename with, so the title is
 * set to the filename stem rather than to a sentence. The 300ms is for the SVG
 * charts: fonts.ready resolves before the axis labels have been laid out
 * against the newly-swapped family, and printing into that gap clips the
 * longest Thai label.
 *
 * The dialog is opened once. A coach who wants a second copy uses the button,
 * which is why the button exists rather than being a duplicate of this.
 */
/**
 * Deal a long table onto as many whole sheets as it needs, by measuring the
 * page instead of guessing at it.
 *
 * The renderer splits an area first, from an estimate of how tall each row
 * comes out. That is close, and it is still an estimate: a coach's note, a
 * longer competency name, Thai rather than English, or a webfont that lands
 * after first paint all move it, and when it is wrong the table spills onto a
 * sheet with no top margin and no logo, which is the thing the rule forbids.
 *
 * So this runs in the tab the report is opened in, once the fonts are in and
 * again before printing. It moves rows down until no sheet is taller than a
 * page, pulls them back up while they fit, drops any sheet left empty, and
 * renumbers the sheet positions. Every sheet it makes is a clone of the one it
 * came from, so it carries the same logo, heading and footer.
 *
 * It only ever moves whole table rows between sheets of one section. If
 * anything throws, the report prints as the renderer laid it out.
 */
const SHEET_FIT = `<script>
(function () {
  var PAGE = 0;
  function measure() {
    var probe = document.createElement("div");
    probe.style.cssText = "position:absolute;left:-9999px;top:0;visibility:hidden;height:296.5mm";
    document.body.appendChild(probe);
    var h = probe.offsetHeight;
    probe.parentNode.removeChild(probe);
    return h;
  }
  function group(src) {
    var out = [src], next = src.nextElementSibling;
    while (next && next.getAttribute("data-sheet-of") === src.id) { out.push(next); next = next.nextElementSibling; }
    return out;
  }
  function rows(el) { return el.querySelector("table.scores tbody"); }
  function over(el) { return el.offsetHeight > PAGE + 1; }
  function addSheet(src, after) {
    var sheet = document.createElement("section");
    sheet.className = src.className;
    sheet.setAttribute("data-sheet-of", src.id);
    var logo = src.querySelector(".fit-logo");
    if (logo) sheet.appendChild(logo.cloneNode(true));
    var h2 = src.querySelector("h2");
    if (h2) sheet.appendChild(h2.cloneNode(true));
    var table = src.querySelector("table.scores");
    var copy = table.cloneNode(false);
    var head = table.querySelector("thead");
    if (head) copy.appendChild(head.cloneNode(true));
    copy.appendChild(document.createElement("tbody"));
    sheet.appendChild(copy);
    var foot = src.querySelector(".sec-foot");
    if (foot) sheet.appendChild(foot.cloneNode(true));
    after.parentNode.insertBefore(sheet, after.nextSibling);
    return sheet;
  }
  function run() {
    try {
      PAGE = measure();
      if (!PAGE) return;
      var all = document.querySelectorAll(".fit-sec"), srcs = [], i;
      for (i = 0; i < all.length; i++) {
        if (!all[i].getAttribute("data-sheet-of") && all[i].querySelector("table.scores")) srcs.push(all[i]);
      }
      for (var s = 0; s < srcs.length; s++) {
        var sheets = group(srcs[s]), guard = 0;
        for (var g = 0; g < sheets.length && guard < 500; g++) {
          var cur = sheets[g];
          while (over(cur) && guard++ < 500) {
            var from = rows(cur);
            if (!from || from.rows.length < 2) break;
            if (!sheets[g + 1]) sheets.push(addSheet(srcs[s], cur));
            var to = rows(sheets[g + 1]);
            if (!to) break;
            to.insertBefore(from.rows[from.rows.length - 1], to.firstChild);
          }
          while (sheets[g + 1] && guard++ < 500) {
            var below = rows(sheets[g + 1]), here = rows(cur);
            if (!below || !below.rows.length || !here) break;
            var row = below.rows[0];
            here.appendChild(row);
            if (over(cur)) { below.insertBefore(row, below.firstChild); break; }
          }
        }
        sheets = group(srcs[s]);
        for (var k = sheets.length - 1; k > 0; k--) {
          var left = rows(sheets[k]);
          if (left && !left.rows.length) { sheets[k].parentNode.removeChild(sheets[k]); sheets.splice(k, 1); }
        }
        for (var m = 0; m < sheets.length; m++) {
          if (m > 0) sheets[m].id = srcs[s].id + "-" + (m + 1);
          var pos = sheets[m].querySelector(".sec-pos");
          if (pos) pos.textContent = sheets.length > 1 ? " · " + (m + 1) + "/" + sheets.length : "";
        }
      }
    } catch (e) {
      /* A report that could not be reflowed still prints as the renderer laid it out. */
    }
  }
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(run); } else { window.addEventListener("load", run); }
  window.addEventListener("beforeprint", run);
})();
</script>`;

const PRINT_BOOTSTRAP = `<script>
(function () {
  var go = function () { setTimeout(function () { window.print(); }, 300); };
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(go); }
  else { window.addEventListener("load", go); }
})();
</script>`;

/**
 * The whole stylesheet, screen and print.
 *
 * Kept as one `<style>` block because `scripts/build-report-book.ts` lifts the
 * first one out of a rendered report by regex and writes its own shell CSS
 * against the `--viz-*`, `--ink-*` and `--border` names in it. A second block
 * would silently give the book half a stylesheet.
 */
const STYLES = `${BRAND_TOKENS_CSS.replace(/\n  \}$/, `\n${BRAND_FONT_STACKS}\n  }`)}
  * { box-sizing: border-box; }

  /* Tonal surfaces carry meaning here — the banner, the badges, the score
     strip. Chrome drops backgrounds when printing unless told not to, which
     would print the honesty banner as unstyled body text. */
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  body {
    margin: 0; padding: 0 1rem 4rem;
    background: var(--viz-page); color: var(--ink-1);
    font-family: var(--font-sans);
    line-height: 1.55;
  }
  main { max-width: 58rem; margin: 0 auto; }
  h1, h2, h3 { font-family: var(--font-display); }

  /* ------------------------------------------------------------- masthead */
  header.top { padding: 2.5rem 0 1.25rem; border-bottom: 2px solid var(--ink-1); }
  .eyebrow {
    margin: 0 0 .5rem; font-size: .7rem; font-weight: 700;
    letter-spacing: .12em; text-transform: uppercase; color: var(--viz-series-1);
  }
  h1 { font-size: 1.9rem; margin: 0 0 .3rem; letter-spacing: -0.015em; line-height: 1.15; }
  .sub { color: var(--ink-2); margin: 0; font-size: .88rem; }
  .banner {
    margin: 1.25rem 0 0; padding: .8rem 1rem;
    border: 1px solid var(--border); border-left: 3px solid var(--viz-series-1);
    background: var(--viz-surface); border-radius: 6px;
    font-size: .86rem; color: var(--ink-2);
  }
  .banner strong { color: var(--ink-1); }

  /* -------------------------------------------------------- the print button */
  .toolbar { max-width: 58rem; margin: 1.25rem auto -1rem; text-align: right; }
  .print-btn {
    font: 600 .85rem/1 var(--font-sans); color: var(--viz-surface);
    background: var(--ink-1); border: 0; border-radius: 999px;
    padding: .7rem 1.4rem; cursor: pointer;
  }

  /* ---------------------------------------- the Fit Report ask, 27/10/2026
     A real button, kept in print: the PDF is where the candidate reads this,
     and a link in a PDF stays clickable. It goes to the Fit Report page, the
     same step the EU Fit Check page's own button takes; that page asks for the
     conversation that buys it. */
  .cta-row { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem 1.25rem; margin-top: 1.25rem; break-inside: avoid; }
  .cta-btn {
    display: inline-block; font: 600 .95rem/1 var(--font-sans); color: var(--viz-surface);
    background: var(--ink-1); border-radius: 999px; padding: .85rem 1.6rem; text-decoration: none;
  }

  /* ------------------------------------------------------------ score strip */
  .strip {
    display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px;
    background: var(--border); border: 1px solid var(--border);
    border-radius: 10px; overflow: hidden; margin: 1.5rem 0 0;
  }
  @media (min-width: 44rem) { .strip { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
  .strip-cell { background: var(--viz-surface); padding: .85rem .9rem 1rem; }
  .strip-label { margin: 0; font-size: .72rem; font-weight: 600; color: var(--ink-2); line-height: 1.3; }
  .strip-score { margin: .3rem 0 0; font-size: 1.85rem; font-weight: 700; font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
  .strip-score .of { font-size: .8rem; font-weight: 500; color: var(--viz-muted); }
  .strip-score.is-none { font-size: .82rem; font-weight: 600; color: var(--viz-muted); letter-spacing: 0; }
  .strip-band { margin: .2rem 0 0; font-size: .68rem; color: var(--viz-muted); line-height: 1.35; }

  /* -------------------------------------------------------------- sections */
  section { margin: 2.5rem 0 0; }
  h2 { font-size: 1.2rem; margin: 0 0 .15rem; letter-spacing: -0.01em; }
  .lede { font-size: 1.05rem; margin: .75rem 0 0; }
  .dim { background: var(--viz-surface); border: 1px solid var(--border); border-radius: 10px; padding: 1.25rem 1.35rem 1.5rem; }
  .dim-head { border-bottom: 1px solid var(--border); padding-bottom: .75rem; margin-bottom: 1rem; }
  .dim-q { margin: 0; color: var(--ink-2); font-size: .86rem; }
  .dim-score { margin: .5rem 0 0; font-size: 1.05rem; }
  .dim-score strong { font-size: 1.5rem; }
  .dim-cov { color: var(--ink-2); font-size: .82rem; }
  .dim-body { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.25rem; }
  @media (min-width: 60rem) { .dim-body { grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); align-items: start; } }
  figure.chart { margin: 0; background: var(--viz-surface); min-width: 0; }
  .viz-radar { display: block; }
  .viz-axis-label { font: 500 11px var(--font-sans); fill: var(--ink-2); }
  .viz-axis-unscored { fill: var(--viz-muted); }
  .viz-axis-value { font-weight: 700; fill: var(--ink-1); font-variant-numeric: tabular-nums; }
  .viz-axis-unscored .viz-axis-value { fill: var(--viz-muted); font-weight: 500; }
  .viz-tick { font: 10px system-ui, sans-serif; fill: var(--viz-muted); font-variant-numeric: tabular-nums; }
  .viz-caption { font: 11px var(--font-sans); fill: var(--viz-muted); }

  /* ---------------------------------------------------------------- tables */
  table.scores { width: 100%; border-collapse: collapse; margin-top: 1rem; font-size: .84rem; }
  table.scores caption { text-align: left; color: var(--ink-2); font-size: .8rem; padding-bottom: .4rem; }
  table.scores th, table.scores td { text-align: left; padding: .4rem .5rem; border-bottom: 1px solid var(--border); vertical-align: top; }
  table.scores thead th { color: var(--ink-2); font-weight: 600; font-size: .78rem; }
  table.scores th[scope="row"] { font-weight: 500; }
  .num { font-variant-numeric: tabular-nums; font-weight: 700; width: 3.5rem; }
  .is-unscored th[scope="row"], .is-unscored .num { color: var(--viz-muted); font-weight: 500; }
  .note { color: var(--viz-muted); font-size: .78rem; }
  .unmeasured { margin: .6rem 0 0; color: var(--viz-muted); font-size: .78rem; }
  .badge { display: inline-block; padding: .05rem .4rem; border-radius: 999px; font-size: .68rem; font-weight: 600; border: 1px solid var(--border); white-space: nowrap; }
  .badge-ecra { color: var(--viz-series-1); border-color: currentColor; }
  .badge-proxy { color: var(--ink-2); }
  .badge-coach { color: var(--viz-muted); }

  /* ------------------------------------------------------------ highlights */
  ol.highlights { list-style: none; margin: .5rem 0 0; padding: 0; }
  ol.highlights li { display: grid; grid-template-columns: 2.5rem minmax(0,1fr) auto auto; gap: .6rem; align-items: baseline; padding: .45rem 0; border-bottom: 1px solid var(--border); }
  .h-score { font-variant-numeric: tabular-nums; font-weight: 700; font-size: 1.05rem; }
  .h-dim { color: var(--viz-muted); font-size: .78rem; }
  .cols { display: grid; grid-template-columns: minmax(0,1fr); gap: 1.5rem; }
  @media (min-width: 48rem) { .cols { grid-template-columns: 1fr 1fr; } }

  /* The candidate variant drops the tier badge, so its rows are three cells and
     not four. Left on the coach's grid the fourth track still claimed width and
     squeezed the competency name into a two-line column beside empty space. */
  .is-limited ol.highlights li { grid-template-columns: 2.5rem minmax(0,1fr) auto; }

  /* A dimension with fewer than three scored items gets no radar, because two
     axes are a line rather than a shape. Without this the table stays in the
     chart's column and prints against half a page of nothing. */
  .dim-body.is-solo { grid-template-columns: minmax(0, 1fr) !important; }
  .muted { color: var(--viz-muted); }
  .next { background: var(--viz-surface); border: 1px solid var(--border); border-left: 3px solid var(--viz-series-1); border-radius: 8px; padding: 1rem 1.15rem; }
  footer { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid var(--border); color: var(--viz-muted); font-size: .78rem; }

  /* ===================================================================== */
  /* PRINT                                                                  */
  /* ===================================================================== */
  @page { size: A4; margin: 14mm 13mm 12mm; }

  @media print {
    /* The page tint is a screen surface. On paper it is 400 sheets of pale
       green and a document that reads as a photocopy. */
    body { background: #fff; padding: 0; font-size: 10pt; line-height: 1.5; }
    main { max-width: none; }
    .no-print { display: none !important; }

    header.top { padding-top: 0; }
    h1 { font-size: 18pt; }
    h2 { font-size: 12.5pt; }
    .lede { font-size: 11pt; }

    /* A4's content column is ~184mm, which is narrower than the 60rem the
       screen layout switches at, so both grids would collapse to one column
       and every chart would print at full width with its table underneath.
       Print sets them explicitly instead of inheriting a screen breakpoint. */
    .strip { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .dim-body { grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); align-items: start; gap: 1rem; }
    .cols { grid-template-columns: 1fr 1fr; }

    /* Nothing that reads as one object may be split across a fold: a heading
       orphaned at the foot of a page, a chart cut in half, a strength split
       from its score. */
    .next, .strip, figure.chart, ol.highlights li, .banner, .dim-head, .dim-body { break-inside: avoid; }
    h2, h3 { break-after: avoid; }
    p { orphans: 3; widows: 3; }

    /* The full report's tables run to twelve rows and a card can legitimately
       be taller than a page, so the table is ALLOWED to break and the header
       repeats on the far side. Forbidding the break instead pushes a
       half-empty page ahead of it and then breaks it anyway. Rows stay whole. */
    table.scores thead { display: table-header-group; }
    table.scores tr { break-inside: avoid; }
    .is-limited .dim { break-inside: avoid; }

    /* One dimension per page in the full report. Each is a 500px chart plus a
       table of every competency in it, so two never share a page anyway and
       letting them try produces a fold through the middle of the second. The
       limited variant carries far less and is allowed to flow. */
    .is-full .dim { break-before: page; }

    /* Borders and tonal fills survive, shadows and rounding do not read on
       paper. Keeping the radius costs nothing and keeps the two media
       recognisably the same document. */
    .dim { border-color: var(--border); }

    footer { margin-top: 1.5rem; break-inside: avoid; }
    a { color: inherit; text-decoration: none; }
  }`;

/** The four-cell readout above the charts. Numbers before shapes. */
function scoreStrip(
  profile: ProfileScore,
  label: (key: string, fallback: string) => string,
  bandCopy: (band: string) => string,
  notMeasured: string,
): string {
  const cells = profile.dimensions
    .map(
      (d) => `<div class="strip-cell">
      <p class="strip-label">${esc(label(d.key, d.label))}</p>
      ${
        d.score === null
          ? `<p class="strip-score is-none">${esc(notMeasured)}</p>`
          : `<p class="strip-score">${d.score.toFixed(1)}<span class="of"> / 5</span></p>`
      }
      <p class="strip-band">${esc(bandCopy(d.band))}</p>
    </div>`,
    )
    .join("\n");
  return `<div class="strip">\n${cells}\n  </div>`;
}

/**
 * The document shell. One `<style>`, one `<main>`, and the print script
 * outside both, because the report book's regexes depend on all three.
 */
function document_(args: {
  lang: string;
  title: string;
  variant: ReportVariant;
  printLabel: string;
  body: string;
  autoPrint: boolean;
}): string {
  return `<!doctype html>
<html lang="${args.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(args.title)}</title>
${BRAND_FONT_LINK}
<style>
${STYLES}
</style>
</head>
<body class="is-${args.variant}">
<div class="toolbar no-print"><button type="button" class="print-btn" onclick="window.print()">${esc(args.printLabel)}</button></div>
<main>
${args.body}
</main>
${args.variant === "fit" ? SHEET_FIT : ""}
${args.autoPrint ? PRINT_BOOTSTRAP : ""}
</body>
</html>`;
}

/**
 * The coach's copy. English, every competency, every tier, every reason a
 * score is blank.
 */
export function renderReport(profile: ProfileScore, meta: ReportMeta, opts: ReportOptions = {}): string {
  if (opts.variant === "limited") return renderCandidateReport(profile, meta, opts);

  const n = buildNarrative(profile);

  const overviewAxes: RadarAxis[] = profile.dimensions.map((d) => ({ label: d.label, value: d.score }));
  const overview = radarSvg(overviewAxes, {
    idPrefix: "overview",
    size: 320,
    widthRatio: 1.9,
    caption: "Four dimensions, self-reported",
  });

  const dimSections = profile.dimensions
    .map((d, idx) => {
      const axes: RadarAxis[] = d.items.map((i) => ({ label: i.label, value: i.score }));
      // Sized so the axis labels land near their nominal 11px on paper rather
      // than at the 4px an A4 column scaled them to. The wide ratio is for the
      // English competency names, which are the longest labels in the document.
      const svg = radarSvg(axes, {
        idPrefix: `dim${idx}`,
        size: 250,
        widthRatio: 2.1,
        maxLabel: 30,
        caption: `${d.label} — ${d.scoredCount} of ${d.totalCount} scored`,
      });
      const rows = d.items
        .map(
          (i) => `<tr class="${i.score === null ? "is-unscored" : ""}">
        <th scope="row">${esc(i.label)}</th>
        <td class="num">${i.score === null ? "—" : i.score.toFixed(1)}</td>
        <td><span class="badge badge-${i.tier}" title="${esc(TIER_BADGE[i.tier].title)}">${TIER_BADGE[i.tier].text}</span></td>
        <td class="note">${esc(i.note ?? "")}</td>
      </tr>`,
        )
        .join("\n");

      return `<section class="dim" id="${d.key}">
  <header class="dim-head">
    <h2>${esc(d.label)}</h2>
    <p class="dim-q">${esc(d.question)}</p>
    <p class="dim-score">${d.score === null ? "Not scored" : `<strong>${d.score.toFixed(1)}</strong> / 5`}
      <span class="dim-cov">· ${Math.round(d.coverage * 100)}% coverage · ${esc(d.band)}</span></p>
  </header>
  <div class="dim-body">
    <figure class="chart">${svg}</figure>
    <div class="dim-text">
      <p>${esc(n.perDimension[idx].text)}</p>
    </div>
  </div>
  <table class="scores">
    <caption>Every competency in ${esc(d.label)}, and where its number came from</caption>
    <thead><tr><th scope="col">Competency</th><th scope="col">Score</th><th scope="col">Evidence</th><th scope="col">Why blank</th></tr></thead>
    <tbody>
${rows}
    </tbody>
  </table>
</section>`;
    })
    .join("\n");

  const listOf = (items: { label: string; score: number; dimension: string; tier: Tier }[]) =>
    items.length
      ? `<ol class="highlights">${items
          .map(
            (h) =>
              `<li><span class="h-score">${h.score.toFixed(1)}</span><span class="h-label">${esc(h.label)}</span><span class="h-dim">${esc(h.dimension)}</span><span class="badge badge-${h.tier}">${TIER_BADGE[h.tier].text}</span></li>`,
          )
          .join("")}</ol>`
      : `<p class="muted">Not enough scored answers yet.</p>`;

  const metaBits = [
    meta.currentRole ? `Currently ${esc(meta.currentRole)}` : "",
    meta.targetRole ? `Targeting ${esc(meta.targetRole)}` : "",
    meta.targetCountries?.length ? esc(meta.targetCountries.join(", ")) : "",
    meta.submittedAt ? `Submitted ${esc(ddmmyyyy(meta.submittedAt))}` : "",
  ].filter(Boolean);

  const body = `  <header class="top">
    <p class="eyebrow">PunProfile · EU Fit Check · Coach copy</p>
    <h1>${esc(meta.candidate)}</h1>
    <p class="sub">${metaBits.join(" · ")}</p>
    <p class="banner"><strong>Self-reported and preliminary.</strong> ${esc(n.caveat)}</p>
  </header>

  <section id="summary">
    <h2>Executive summary</h2>
    <p class="lede">${esc(n.headline)}</p>
    ${scoreStrip(profile, (_k, fallback) => fallback, (band) => BAND_COPY[band as keyof typeof BAND_COPY] ?? band, "Not scored")}
    <figure class="chart" style="max-width:34rem">${overview}</figure>
  </section>

${dimSections}

  <section class="cols">
    <div>
      <h2>Top strengths</h2>
      ${listOf(n.strengths)}
    </div>
    <div>
      <h2>Development priorities</h2>
      ${listOf(n.priorities)}
    </div>
  </section>

  <section>
    <h2>What to do first</h2>
    <p class="next">${esc(n.nextStep)}</p>
  </section>

  <footer>
    Scored by the mapping in <code>docs/self-report-scoring.md</code> against the ECRA framework
    owned by <code>08_Coaching_Business.md</code>. Scores marked “measured” use the framework's own
    formula; “proxy” scores measure a related observable and are named for what they actually
    measure; “needs a coach” items are left blank rather than estimated.
  </footer>`;

  return document_({
    lang: "en",
    // Chrome seeds the PDF filename from the title, so this is a filename stem
    // and not a sentence.
    title: `EU Fit Check — ${meta.candidate} — coach copy`,
    variant: "full",
    printLabel: "Save as PDF",
    body,
    autoPrint: opts.autoPrint ?? false,
  });
}

/**
 * What the candidate is sent.
 *
 * Same scores as the coach's copy, internals removed (see the variant note at
 * the top of this file), laid out as fixed A4 pages rather than one flowing
 * column. Redesigned 20/11/2026, Paul's call: a white-paper layout in the
 * brand's own colours, with pictures, ending on the Coaching 1:1 offer.
 *
 * Pages, in order: cover, first read, the four areas over two pages,
 * strengths and priorities, the Fit Report, then two Coaching 1:1 pages.
 * The Fit Report page stays in front of the coaching pages (Paul 1a,
 * 20/11/2026): the cheaper offer first, the engagement as the close.
 *
 * The two coaching pages are on by default, because the candidate who
 * downloads this from the result screen has bought nothing yet. A coach
 * sending it to someone already in Coaching 1:1 turns them off with
 * `coaching: false` (Paul 2a, 20/11/2026). Nothing is stored about who paid.
 *
 * Every sentence a reader sees is a line that already exists: `copy.ts` for
 * the report, and the /coaching, home and /pricing modules for the two
 * coaching pages. No wording was written for this layout.
 *
 * Pictures follow "Where clay and where the mascot" in `Brand_Guidelines.md`:
 * a clay scene is a page's main picture, the flat mascot appears only as spot
 * art in a card corner, the two never share a page, and client faces are
 * their own photographs. Images are loaded from the site by absolute URL,
 * because this document is written into a blank tab where a relative path has
 * nothing to resolve against.
 */
export function renderCandidateReport(
  profile: ProfileScore,
  meta: ReportMeta,
  opts: ReportOptions = {},
): string {
  const locale: Locale = opts.locale ?? "th";
  const s = (key: Parameters<typeof t>[0], vars?: Record<string, string | number>) => t(key, locale, vars);
  const pick = (c: { en: string; th: string }) => c[locale];
  const origin = opts.assetOrigin ?? (typeof location !== "undefined" ? location.origin : "");
  const asset = (path: string) => `${origin}${path}`;
  const sitePath = (path: string) => `https://punprofile.app${locale === "en" ? `/en${path}` : path}`;
  const withCoaching = opts.coaching ?? true;
  const withFitReport = opts.fitReport ?? true;

  const dimLabel = (key: string, fallback: string) => dimensionName(key, fallback, locale);
  const notMeasured = s("teaser.score.none");
  // Written out rather than composed as `band.${d.band}`, because `verify-copy`
  // greps the source for each key to prove it is reachable.
  const bandCopy = (band: string) =>
    band === "moderate"
      ? s("band.moderate")
      : band === "limited"
        ? s("band.limited")
        : s("band.indicative");

  const coverNameText = meta.coverName ?? meta.candidate;
  const metaBits = [
    meta.targetRole ? esc(meta.targetRole) : "",
    meta.targetCountries?.length ? esc(meta.targetCountries.join(", ")) : "",
    meta.submittedAt ? esc(ddmmyyyy(meta.submittedAt)) : "",
  ].filter(Boolean);

  let pageNo = 1;
  const head = (dark = false) =>
    `<header class="pg-head"><img class="pg-logo" src="${asset(dark ? "/punprofile-logo-reversed.svg" : "/efc-logo.svg")}" alt=""></header>`;
  const foot = (dark = false) =>
    `<footer class="pg-foot${dark ? " on-dark" : ""}"><span>EU Fit Check · ${esc(coverNameText)}</span><span class="pg-n">${String(++pageNo).padStart(2, "0")}</span></footer>`;
  const opener = (n: string, title = "", eyebrow = "", dark = false) =>
    `<div class="opener${dark ? " on-dark" : ""}"><span class="sec-n">${n}</span><span class="rule"></span>${
      eyebrow ? `<p class="op-eyebrow">${esc(eyebrow)}</p>` : ""
    }${title ? `<h2>${esc(title)}</h2>` : ""}</div>`;

  // What the paid version adds, one line per page that has a paid counterpart.
  const preview = (c: { en: string; th: string }) =>
    `<p class="preview"><strong>${esc(pick(PREVIEW_LABEL))}</strong> ${esc(pick(c))}</p>`;

  // ------------------------------------------------------------------ cover
  const cover = `<section class="page cover">
  <div class="cover-band">
    <img class="cover-logo" src="${asset("/efc-logo.svg")}" alt="EU Fit Check by PunProfile">
    ${withFitReport ? `<p class="cover-badge"><span>${esc(pick(FREE_BADGE))}</span> ${esc(pick(FREE_BADGE_NOTE))}</p>` : ""}
    <p class="cover-eyebrow">${esc(s("teaser.headline"))}</p>
    ${coverName(coverNameText)}
    <p class="cover-sub">${metaBits.join(" · ")}</p>
    <div class="cover-collage">
      <img class="cc-tall" src="${asset("/images/photos/cafe-woman-reading-tall.jpg")}" alt="">
      <img src="${asset("/images/photos/copenhagen-nyhavn.jpg")}" alt="">
      <img src="${asset("/images/photos/cinque-terre-coast.jpg")}" alt="">
      <img class="cc-wide" src="${asset("/images/photos/eu-flag-sky-wide.jpg")}" alt="">
    </div>
    <img class="cover-art" src="${asset("/products/product-eu-fit-check.jpg")}" alt="">
  </div>
  <div class="cover-low">
    <p class="cover-caveat"><strong>${esc(s("teaser.selfReported"))}</strong> ${esc(s("result.caveat"))}</p>
  </div>
  <img class="cover-pp" src="${asset("/punprofile-logo.svg")}" alt="PunProfile">
</section>`;

  // ------------------------------------------------------- 01 first read
  // Values off and the box widened: a Thai axis name plus its number is wider
  // than the plot leaves room for. Sized to land near 1:1 on paper.
  const overview = radarSvg(
    profile.dimensions.map((d) => ({ label: dimLabel(d.key, d.label), value: d.score })),
    { idPrefix: "overview", size: 300, values: false, maxLabel: 40, widthRatio: 2.1, caption: s("teaser.chart.heading") },
  );
  const tiles = profile.dimensions
    .map(
      (d) => `<div class="tile">
      <p class="tile-label">${esc(dimLabel(d.key, d.label))}</p>
      ${
        d.score === null
          ? `<p class="tile-score is-none">${esc(notMeasured)}</p>`
          : `<p class="tile-score">${d.score.toFixed(1)}<span>/5</span></p>`
      }
      <p class="tile-band">${esc(bandCopy(d.band))}</p>
    </div>`,
    )
    .join("");
  // The same projection the result screen shows, not a second count.
  const unlock = projectUnlock(profile);
  const firstRead = `<section class="page">
  ${head()}
  ${opener("01", s("teaser.headline"))}
  <div class="tiles">${tiles}</div>
  <figure class="chart overview">${overview}</figure>
  <div class="measured">
    <p>${esc(
      s("result.measured", {
        count: unlock.measuredNow,
        total: unlock.totalItems,
        more: unlock.measuredAfter - unlock.measuredNow,
      }),
    )}</p>
    <img class="spot" src="${asset("/mascot-magnifier.png")}" alt="">
  </div>
  <p class="method-note">${esc(pick(METHOD_NOTE))}</p>
  ${foot()}
</section>`;

  // ------------------------------------------------- 02 the four areas
  const area = (d: ProfileScore["dimensions"][number], idx: number) => {
    const scored = d.items.filter((i) => i.score !== null);
    const unmeasured = d.totalCount - d.scoredCount;
    const axes: RadarAxis[] = scored.map((i) => ({ label: itemName(i.key, i.label, locale), value: i.score }));
    // A radar needs three axes to be a shape; below that the table stands alone.
    const svg =
      axes.length >= 3
        ? radarSvg(axes, { idPrefix: `dim${idx}`, size: 240, values: false, maxLabel: 40, widthRatio: 2.3 })
        : "";
    const rows = scored
      .map(
        (i) =>
          `<tr><th scope="row">${esc(itemName(i.key, i.label, locale))}</th><td class="num">${(i.score as number).toFixed(1)}</td></tr>`,
      )
      .join("");
    return `<article class="area" id="${d.key}">
    <header class="area-head">
      <p class="area-n">${String(idx + 1).padStart(2, "0")}</p>
      <h3>${esc(dimLabel(d.key, d.label))}</h3>
      <p class="area-score">${d.score === null ? esc(notMeasured) : `<strong>${d.score.toFixed(1)}</strong>/5`}</p>
    </header>
    <p class="area-band">${esc(bandCopy(d.band))}</p>
    <div class="area-body${svg ? "" : " is-solo"}">
      ${svg ? `<figure class="chart">${svg}</figure>` : ""}
      <div>
        ${
          rows
            ? `<table class="scores"><thead><tr><th scope="col">${esc(s("report.competency"))}</th><th scope="col">${esc(s("report.score"))}</th></tr></thead><tbody>${rows}</tbody></table>`
            : ""
        }
        ${unmeasured > 0 ? `<p class="unmeasured">${esc(s("report.unmeasured", { count: unmeasured }))}</p>` : ""}
      </div>
    </div>
  </article>`;
  };
  const dims = profile.dimensions;
  const areaPages = [dims.slice(0, 2), dims.slice(2)]
    .filter((pair) => pair.length)
    .map(
      (pair, p) => `<section class="page soft">
  ${head()}
  ${p === 0 ? opener("02", s("teaser.chart.heading")) : ""}
  ${pair.map((d, i) => area(d, p * 2 + i)).join("\n")}
  ${p === 0 && withFitReport ? preview(PREVIEW_AREAS) : ""}
  ${foot()}
</section>`,
    )
    .join("\n");

  // --------------------------------------- 03 strengths and priorities
  const listOf = (items: { key: string; label: string; score: number; dimension: string }[]) =>
    items.length
      ? `<ol class="hl">${items
          .map(
            (h) =>
              `<li><span class="hl-score">${h.score.toFixed(1)}</span><span class="hl-label">${esc(itemName(h.key, h.label, locale))}<small>${esc(dimensionNameByLabel(h.dimension, locale))}</small></span></li>`,
          )
          .join("")}</ol>`
      : `<p class="muted">${esc(notMeasured)}</p>`;
  const strengthsPage = `<section class="page">
  ${head()}
  ${opener("03")}
  <div class="two">
    <div class="card cyan"><h3>${esc(s("report.strengths"))}</h3>${listOf(topStrengths(profile, 3))}</div>
    <div class="card orange"><h3>${esc(s("report.priorities"))}</h3>${listOf(developmentPriorities(profile, 3))}</div>
  </div>
  <figure class="photo-card">
    <img src="${asset("/home/service-direction.png")}" alt="">
    <figcaption>
      <h3>${esc(s("report.next"))}</h3>
      <p>${esc(s("teaser.nextStep"))}</p>
    </figcaption>
  </figure>
  ${withFitReport ? preview(PREVIEW_MOVES) : ""}
  ${foot()}
</section>`;

  // ------------------------------------------------- 04 the Fit Report
  // One real page of the sample Fit Report, flat on the lime ground, with its
  // three notes beside it (Paul 2a, 30/10/2026). Invented, labelled data.
  const fitPage = `<section class="page" id="full">
  ${head()}
  ${opener("04", s("report.full.heading"))}
  <p class="lede">${esc(s("report.full.body"))}</p>
  <div class="interview">
    <img src="${asset("/pricing/pricing-fit-report-interview.jpg")}" alt="">
    <div><h3>${esc(pick(INTERVIEW_HEADING))}</h3><p>${esc(pick(INTERVIEW_BODY))}</p></div>
  </div>
  <p class="eyebrow-s">${esc(s("report.full.example"))}</p>
  ${flatShowcase(locale)}
  <p class="cta-row"><a class="btn" href="${sitePath("/products/fit-report")}">${esc(FULL_CTA[locale])}</a></p>
  ${foot()}
</section>`;

  // ------------------------------------------ 05 and 06 Coaching 1:1
  // The /coaching page's own lines, in its order: the hook, the pains, the
  // people, a placement in the client's words, the price and the close.
  const europe = asset("/images/photos/europe-street-cafe.jpg");
  const europeFallback = asset("/home/home-hero.jpg");
  const pains = PAINS.map((p) => `<li><span class="tick">✓</span><span>${esc(pick(p))}</span></li>`).join("");
  const hookPage = `<section class="page dark">
  ${head(true)}
  ${opener("05", "", pick(HOOK_EYEBROW), true)}
  <p class="hook">${esc(pick(HOOK_LINE_1))}<br><span>${esc(pick(HOOK_LINE_2))}</span></p>
  <div class="hook-grid">
    <div>${HOOK_BODY.map((p) => `<p class="hook-body">${esc(pick(p))}</p>`).join("")}</div>
    <img class="hook-img" src="${europe}" onerror="this.onerror=null;this.src='${europeFallback}'" alt="">
  </div>
  <div class="pains">
    <h3>${esc(pick(PAIN_HEADING))}</h3>
    <ul>${pains}</ul>
  </div>
  ${foot(true)}
</section>`;

  // Photographs as on /coaching and the home page's placements.
  const COACH_PHOTO: Record<string, string> = { paul: "/coach-paul.jpg", dew: "/coach-tatiya.jpg" };
  const PLACED_PHOTO: Record<string, string> = {
    "placed-hotel-germany": "/home/testimonials/testimonial-photo-may.jpg",
    "placed-chef-netherlands": "/home/testimonials/testimonial-photo-ton.jpg",
    "placed-it-ireland": "/home/testimonials/testimonial-photo-nat.jpg",
    "placed-logistics-sweden": "/home/testimonials/testimonial-photo-nut.jpg",
  };
  const coaches = COACHES.map(
    (c) => `<article class="coach">
      <img src="${asset(COACH_PHOTO[c.id] ?? "/coach-paul.jpg")}" alt="${esc(pick(c.alt))}">
      <div>
        <p class="coach-pill">${esc(pick(c.pill))}</p>
        <h3>${esc(pick(c.heading))}</h3>
        <p class="coach-pull">${esc(pick(c.pull))}</p>
        <p class="coach-sum">${esc(pick(c.summary))}</p>
      </div>
    </article>`,
  ).join("");
  const placed = RESULTS.filter((r) => PLACED_PHOTO[r.id]);
  const quoted = placed.find((r) => r.id === "placed-it-ireland") ?? placed[0];
  const proof = placed
    .map(
      (r) =>
        `<li><img src="${asset(PLACED_PHOTO[r.id])}" alt=""><p class="who">${esc(pick(r.who))}</p><p class="where">${esc(pick(r.role))}</p></li>`,
    )
    .join("");
  const price = PRICING_QUESTIONS[0];
  const closePage = `<section class="page">
  ${head()}
  ${opener("06")}
  <div class="coaches">${coaches}</div>
  ${
    quoted
      ? `<blockquote class="quote"><span class="qmark">“</span>${esc(pick(quoted.quote))}<cite>${esc(pick(quoted.who))} · ${esc(pick(quoted.role))}</cite></blockquote>`
      : ""
  }
  <ul class="proof">${proof}</ul>
  <div class="close">
    <div>
      <p class="close-lead">${esc(pick(CLOSE_LEAD))}</p>
      ${price ? price.a.map((line, i) => `<p class="${i === 0 ? "price" : "price-sub"}">${esc(pick(line))}</p>`).join("") : ""}
      <p class="cta-row">
        <a class="btn" href="${DESTINATIONS.line.href}">${esc(pick(DESTINATIONS.line.label))}</a>
        <a class="btn-ghost" href="${sitePath(DESTINATIONS.coaching.href)}">${esc(pick(DESTINATIONS.coaching.label))}</a>
      </p>
    </div>
    <img class="spot" src="${asset("/mascot-laptop.png")}" alt="">
  </div>
  <p class="fine">${esc(s("report.footer"))}</p>
  ${foot()}
</section>`;

  // Country page, straight after the cover, for the first country ticked.
  const countryInner = countryFactsBody(meta.targetCountries?.[0], locale, asset);
  const countryPage = countryInner
    ? `<section class="page">
  ${head()}
  ${countryInner}
  ${withFitReport ? preview(PREVIEW_ROLES) : ""}
  ${foot()}
</section>`
    : "";

  // From everyone who has taken this: top five countries, the three readiness
  // shares, and where the candidate sits on each area. All copy is the
  // first read's, already approved. Each block renders only when the query
  // cleared its own sample floor; the whole page goes when none did.
  const stats = opts.community;
  const ffCountries = stats?.topCountries?.length
    ? `<div class="ff-card"><p class="ff-label">${esc(s("stats.countries.label"))}</p><ol class="ff-bars">${stats.topCountries
        .map(
          (c) =>
            `<li><span class="ff-name">${esc(c.country)}</span><span class="ff-track"><span style="width:${Math.max(6, (c.share / stats.topCountries![0].share) * 100)}%"></span></span><span class="ff-pct">${c.share}%</span></li>`,
        )
        .join("")}</ol><p class="ff-foot">${esc(s("stats.countries.foot"))}</p></div>`
    : "";
  const ready = (
    [
      ["cvNotForEurope", s("stats.readiness.cv")],
      ["noPortfolio", s("stats.readiness.portfolio")],
      ["linkedinThin", s("stats.readiness.linkedin")],
    ] as const
  ).map(([k, label]) => ({ label, pct: stats?.shares[k]?.pct ?? null }));
  const waiting = stats?.shares.notApplyingYet?.pct ?? null;
  const soon = stats?.shares.soonWithin3m?.pct ?? null;
  const ffReady = ready.every((r) => r.pct !== null)
    ? `<div class="ff-card"><p class="ff-label">${esc(s("stats.readiness.label"))}</p><ul class="ff-bars">${ready
        .map((r) => `<li><span class="ff-name">${esc(r.label)}</span><span class="ff-track"><span style="width:${r.pct}%"></span></span><span class="ff-pct">${r.pct}%</span></li>`)
        .join("")}</ul>${
        waiting !== null && soon !== null ? `<p class="ff-line">${esc(s("stats.timing", { waiting, soon }))}</p>` : ""
      }<p class="ff-foot">${esc(s("stats.readiness.foot"))}</p></div>`
    : "";
  const standing = profile.dimensions
    .map((d) => {
      const b = stats?.distribution[d.key];
      if (typeof d.score !== "number" || !b) return "";
      return `<li><span class="ff-big">${percentBelow(d.score, b)}%</span> ${esc(s("stats.percentile", { dimension: dimLabel(d.key, d.label) }))}</li>`;
    })
    .filter(Boolean)
    .join("");
  const ffStanding = standing
    ? `<div class="ff-card ff-you"><ul>${standing}</ul><p class="ff-foot">${esc(s("stats.percentile.foot"))}</p></div>`
    : "";
  const funFactsPage =
    ffCountries || ffReady || ffStanding
      ? `<section class="page">
  ${head()}
  ${opener("", s("stats.heading"))}
  ${ffCountries}
  ${ffReady}
  ${ffStanding}
  ${foot()}
</section>`
      : "";

  const body = [
    cover,
    countryPage,
    firstRead,
    funFactsPage,
    areaPages,
    strengthsPage,
    withFitReport ? fitPage : "",
    withCoaching ? hookPage : "",
    withCoaching ? closePage : "",
  ]
    .filter(Boolean)
    .join("\n")
    // Pages are built out of order (the country and community pages after the
    // ones they precede), so the footers are numbered here, in reading order.
    .replace(/<span class="pg-n">\d+<\/span>/g, (() => {
      let n = 1;
      return () => `<span class="pg-n">${String(++n).padStart(2, "0")}</span>`;
    })())
    // The numbers on the pages themselves, for the same reason and now for one
    // more: a report with no Fit Report page in it would otherwise count
    // 01, 02, 03, 05, 06. The unnumbered opener has no digits and is left alone.
    .replace(/<span class="sec-n">\d+<\/span>/g, (() => {
      let n = 0;
      return () => `<span class="sec-n">${String(++n).padStart(2, "0")}</span>`;
    })());

  const html = document_({
    lang: locale,
    title: `EU Fit Check — ${coverNameText}`,
    variant: "limited",
    printLabel: s("report.savePdf"),
    body,
    autoPrint: opts.autoPrint ?? false,
  }).replace("</style>", `${FLAT_STYLES}\n${FIT_STYLES}\n${PAGED_STYLES}\n${COUNTRY_STYLES}\n${FUN_FACTS_STYLES}\n${UPSELL_STYLES}\n</style>`);

  return html;
}

/**
 * The candidate report's page layout, appended after the shared stylesheet so
 * it wins. Every colour is a brand token; lime is a fill and never type.
 * Fixed A4 pages with no printer margin, because the cover and the dark page
 * run to the paper's edge. A page that outgrows A4 flows onto the next sheet
 * rather than clipping, which is why the pages take a minimum height.
 */
/**
 * The type size for a name on a cover, shared by all three of them.
 *
 * Two ceilings and a floor. The name shrinks until its longest unbreakable run
 * fits the band's width, and until the whole name fits three lines of it; the
 * smaller of the two wins, capped at the cover's own size. `--cover-em` is the
 * average advance of a glyph at these heavy weights, as a fraction of the type
 * size, and it is the one number here that is measured rather than derived, so
 * it is named once and tuned in one place. Below the floor the stylesheet
 * breaks a word instead, which only happens to a name long enough that running
 * off the cover would be the only alternative.
 *
 * Each cover sets `--cover-w` and `--cover-max`; the renderer sets
 * `--cover-run` and `--cover-len` on the element, per name.
 */
/** The average advance of a glyph at these weights, as a fraction of the type
 *  size. Measured, not derived, and read by `scripts/verify-report.ts` as well
 *  as by the stylesheet, so the check and the page cannot drift apart. */
export const COVER_EM = 0.58;

/**
 * The characters of a word that take width. Thai writes its vowels and tones
 * above and below the consonant they belong to, and a combining mark has no
 * advance of its own, so counting them would make every Thai name look a third
 * longer than it sets. Only the line count uses this: `--cover-run` and
 * `--cover-len` keep counting codepoints, because they are what the shipped
 * covers were sized against and a name that prints well today must not move.
 */
const advances = (word: string) => word.replace(/[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/g, "").length;

/**
 * How many lines a name takes at a size, wrapped the way the browser wraps it:
 * a whole word to a line while the line has room, a word too long for a line of
 * its own broken across lines. `COVER_EM` stands in for the font's own metrics,
 * so this is an estimate — and it is the same estimate the stylesheet's own
 * ceilings make, which is the point: the page and the check agree or neither is
 * worth anything. Checked against a browser for every name shape in
 * `scripts/verify-report.ts`.
 */
export function coverLines(name: string, widthMm: number, sizePt: number): number {
  const charMm = COVER_EM * ((sizePt * 25.4) / 72);
  const chars = Math.max(1, widthMm / charMm);
  const words = name.replace(/-/g, "\u2011").split(/\s+/).filter(Boolean);
  let lines = 0;
  let used = 0;
  for (const word of words) {
    if (lines === 0) lines = 1;
    const w = advances(word);
    const need = used === 0 ? w : used + 1 + w;
    if (used > 0 && need > chars) {
      lines += 1;
      used = w;
    } else {
      used = need;
    }
    if (used > chars) {
      const broken = Math.ceil(used / chars) - 1;
      lines += broken;
      used -= broken * chars;
    }
  }
  return Math.max(1, lines);
}

/**
 * The size the stylesheet will land on for a name, in points.
 *
 * Two ceilings from the name's own shape, a third from the height the cover
 * gives it where it gives it one, and the floor underneath all three. A cover
 * that passes no `budgetMm` has nothing below its name to clear.
 */
export function coverNameSize(name: string, widthMm: number, maxPt: number, budgetMm?: number): number {
  const whole = name.replace(/-/g, "\u2011");
  const words = whole.split(/\s+/).filter(Boolean);
  const run = Math.max(1, ...words.map((w) => w.length));
  const len = Math.max(1, whole.length);
  const pt = (mm: number) => (mm * 72) / 25.4;
  const shape = Math.min(maxPt, pt(widthMm / (run * COVER_EM)), pt((widthMm * 3) / (len * COVER_EM)));
  const ceiling =
    budgetMm === undefined ? shape : Math.min(shape, pt(budgetMm / (coverLines(whole, widthMm, shape) * COVER.nameLead)));
  return Math.max(COVER.nameMin, ceiling);
}

const COVER_NAME_FIT = `--cover-em: ${COVER_EM};
    font-size: max(var(--cover-min, ${COVER.nameMin}pt), min(var(--cover-max), calc(var(--cover-w) / (var(--cover-run, 8) * var(--cover-em))), calc(var(--cover-w) * 3 / (var(--cover-len, 8) * var(--cover-em))), calc(var(--cover-h, 999mm) / (var(--cover-lines, 1) * ${COVER.nameLead}))));
    hyphens: none; overflow-wrap: anywhere;`;

const PAGED_STYLES = `
  @page { size: A4; margin: 0; }
  .is-limited { background: var(--color-canvas-soft); padding: 0 0 2rem; }
  .is-limited main { max-width: none; }
  .is-limited .toolbar { max-width: 210mm; margin: 1.25rem auto .5rem; }
  .page { position: relative; box-sizing: border-box; width: 210mm; min-height: 296.5mm; margin: 0 auto 8mm; padding: 22mm 16mm 20mm; background: var(--color-canvas); color: var(--color-ink); break-after: page; overflow: hidden; box-shadow: 0 1px 6px rgba(14,15,12,.12); }
  .page:last-child { break-after: auto; }
  .page.soft { background: var(--color-canvas-soft); }
  .page.dark { background: var(--color-canvas-dark); color: var(--color-on-canvas-dark); }
  .page h1, .page h2, .page h3 { margin: 0; }
  @media print {
    .is-limited { background: var(--color-canvas); padding: 0; font-size: inherit; }
    .page { margin: 0; box-shadow: none; }
    /* Nothing see-through reaches the PDF. macOS Preview, which candidates open
       the file in, draws Chrome's transparent layers wrongly: a fade prints pink
       and a shadow prints as a visible square. So every shadow, fade and
       semi-transparent overlay either goes in print, as below, or is flattened
       into one picture, the way the country photo is. */
    .cover-art { box-shadow: none; }
    .pg-foot.on-dark { border-top: 0; }
    ol.hl li { border-bottom-color: var(--color-line); }
    .pains { background: none; }
  }

  .pg-head { position: absolute; top: 9mm; right: 16mm; }
  .pg-logo { height: 7mm; display: block; }
  .pg-foot { position: absolute; bottom: 8mm; left: 16mm; right: 16mm; display: flex; justify-content: space-between; border-top: 1px solid var(--color-line); padding-top: 2.5mm; font-size: 7.5pt; color: var(--color-mute-strong); }
  .pg-foot.on-dark { border-color: rgba(232,235,230,.25); color: var(--color-on-canvas-dark); }
  .pg-n { font-weight: 700; color: inherit; }

  .opener { margin: 0 0 7mm; }
  .sec-n { display: inline-block; font-size: 9pt; font-weight: 700; background: var(--color-canvas-brand); color: var(--color-on-primary); border-radius: 999px; padding: .5mm 3mm; }
  .rule { display: block; width: 14mm; height: 1.2mm; background: var(--color-ink); margin: 5mm 0 4mm; border-radius: 1mm; }
  .opener.on-dark .rule { background: var(--color-canvas-brand); }
  .op-eyebrow { margin: 0; font-size: 11pt; font-weight: 700; }
  .opener h2 { font-size: 24pt; line-height: 1.15; letter-spacing: -0.02em; font-weight: 800; max-width: 150mm; }

  .cover { padding: 0; }
  .cover-band { position: relative; height: 190mm; background: var(--color-canvas-brand); color: var(--color-on-primary); padding: 18mm 16mm; }
  .cover-logo { height: 11mm; display: block; }
  .cover-eyebrow { margin: 34mm 0 3mm; font-size: 11pt; font-weight: 700; }
  .cover h1 { --cover-w: ${COVER.freeNameW}mm; --cover-max: 54pt; ${COVER_NAME_FIT}
    line-height: 1; letter-spacing: -0.03em; font-weight: 900; color: var(--color-ink-deep); max-width: 80mm; }
  .cover-sub { margin: ${COVER.subTop}mm 0 0; font-size: 11pt; font-weight: 500; max-width: ${COVER.freeSubW}mm; }
  /* Europe as the reader will live it, per "Where clay and where the
     mascot" in Brand_Guidelines.md. */
  .cover-collage { position: absolute; left: ${COVER_ART.left}mm; right: ${COVER.artRight}mm; top: 16mm; height: 120mm; display: grid; grid-template-columns: 1.05fr 1fr; grid-template-rows: 1fr 1fr .5fr; gap: 2.5mm; }
  .cover-collage img { width: 100%; height: 100%; object-fit: cover; display: block; border-radius: 4mm; min-height: 0; }
  .cover-collage .cc-tall { grid-row: 1 / 3; }
  .cover-collage .cc-wide { grid-column: 1 / 3; }
  .cover-art { position: absolute; right: ${COVER.artRight}mm; bottom: -22mm; width: ${COVER.artW}mm; border-radius: 6mm; box-shadow: 0 2mm 6mm rgba(22,51,0,.18); }
  .cover-low { position: absolute; left: ${COVER.padX}mm; right: ${COVER.page - COVER_ART.left + COVER.gutter}mm; top: 202mm; }
  .cover-caveat { font-size: 9.5pt; color: var(--color-body); margin: 0; }
  .cover-caveat strong { display: block; color: var(--color-ink); font-size: 11pt; margin-bottom: 1.5mm; }
  .cover-pp { position: absolute; left: 16mm; bottom: 14mm; height: 8mm; }

  .tiles { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3mm; }
  .tile { background: var(--color-cyan-pale); color: var(--color-on-cyan-pale); border-radius: 5mm; padding: 4mm 4mm 4.5mm; }
  .tile-label { margin: 0; font-size: 8.5pt; font-weight: 700; line-height: 1.3; min-height: 2.6em; }
  .tile-score { margin: 2mm 0 0; font-size: 30pt; font-weight: 800; letter-spacing: -0.03em; line-height: 1; }
  .tile-score span { font-size: 10pt; font-weight: 600; margin-left: .5mm; }
  .tile-score.is-none { font-size: 10pt; }
  .tile-band { margin: 2mm 0 0; font-size: 7.5pt; line-height: 1.35; }
  figure.chart.overview { width: 150mm; margin: 8mm auto 0; background: transparent; }
  .measured { position: relative; margin-top: 6mm; background: var(--color-canvas-soft); border-radius: 5mm; padding: 5mm 58mm 5mm 6mm; min-height: 26mm; }
  .measured p { margin: 0; font-size: 10pt; }
  .spot { position: absolute; right: 2mm; bottom: 0; width: 52mm; }

  .area { background: var(--color-canvas); border-radius: 6mm; padding: 6mm 7mm; margin-bottom: 6mm; break-inside: avoid; }
  .area-head { display: grid; grid-template-columns: auto 1fr auto; align-items: baseline; gap: 4mm; border-bottom: 1px solid var(--color-line); padding-bottom: 3mm; }
  .area-n { margin: 0; font-size: 9pt; font-weight: 700; color: var(--color-mute-strong); }
  .area h3 { font-size: 16pt; font-weight: 800; letter-spacing: -0.015em; }
  .area-score { margin: 0; font-size: 10pt; color: var(--color-body); }
  .area-score strong { font-size: 24pt; color: var(--color-ink); font-weight: 800; }
  .area-band { margin: 2.5mm 0 3mm; font-size: 8.5pt; color: var(--color-body); }
  .area-body { display: grid; grid-template-columns: 1.25fr 1fr; gap: 5mm; align-items: center; }
  .area-body.is-solo { grid-template-columns: 1fr; }
  .area figure.chart { margin: 0; }
  .area table.scores { margin-top: 0; font-size: 8.5pt; }

  .two { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; }
  .card { border-radius: 6mm; padding: 6mm; }
  .card h3 { font-size: 15pt; font-weight: 800; margin-bottom: 2mm; }
  .card.cyan { background: var(--color-cyan-pale); color: var(--color-on-cyan-pale); }
  .card.orange { background: var(--color-orange-pale); color: var(--color-on-orange-pale); }
  ol.hl { list-style: none; margin: 0; padding: 0; }
  ol.hl li { display: grid; grid-template-columns: 13mm 1fr; gap: 2mm; align-items: baseline; padding: 2.5mm 0; border-bottom: 1px solid rgba(22,51,0,.12); }
  .hl-score { font-size: 17pt; font-weight: 800; }
  .hl-label { font-size: 10pt; font-weight: 600; }
  .hl-label small { display: block; font-size: 7.5pt; font-weight: 500; color: var(--color-body); }
  .photo-card { margin: 7mm 0 0; display: grid; grid-template-columns: 1fr 1fr; background: var(--color-yellow-pale); color: var(--color-on-yellow-pale); border-radius: 6mm; overflow: hidden; }
  .photo-card img { width: 100%; height: 120mm; object-fit: contain; object-position: center bottom; display: block; padding-top: 6mm; }
  .photo-card figcaption { padding: 8mm 7mm; align-self: center; }
  .photo-card h3 { font-size: 15pt; font-weight: 800; margin-bottom: 3mm; }
  .photo-card p { margin: 0; font-size: 10pt; }

  .lede { font-size: 10.5pt; margin: -2mm 0 4mm; max-width: 160mm; color: var(--color-body); }
  .eyebrow-s { font-size: 7.5pt; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--color-mute-strong); margin: 0 0 2mm; }
  .btn { display: inline-block; font-weight: 700; font-size: 10pt; background: var(--color-canvas-brand); color: var(--color-on-primary); border-radius: 999px; padding: 3mm 7mm; text-decoration: none; }
  .btn-ghost { display: inline-block; font-weight: 700; font-size: 10pt; color: var(--color-ink); border: 1.5px solid currentColor; border-radius: 999px; padding: 2.6mm 6mm; text-decoration: none; }
  .page .cta-row { display: flex; gap: 3mm; flex-wrap: wrap; margin: 5mm 0 0; }

  .hook { font-size: 25pt; line-height: 1.18; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 7mm; }
  .hook span { background: var(--color-canvas-brand); color: var(--color-on-primary); padding: 0 1.5mm; border-radius: 1.5mm; -webkit-box-decoration-break: clone; box-decoration-break: clone; }
  .hook-grid { display: grid; grid-template-columns: 1fr 72mm; gap: 7mm; align-items: start; }
  .hook-body { font-size: 9.5pt; margin: 0 0 3mm; }
  .hook-img { width: 72mm; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 5mm; display: block; }
  .pains { margin-top: 7mm; background: rgba(255,255,255,.06); border-radius: 6mm; padding: 6mm 7mm; }
  .pains h3 { font-size: 13pt; font-weight: 800; margin-bottom: 3mm; }
  .pains ul { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 3mm 6mm; }
  .pains li { display: grid; grid-template-columns: 6mm 1fr; gap: 2mm; font-size: 9pt; line-height: 1.4; }
  .tick { width: 5mm; height: 5mm; border-radius: 50%; background: var(--color-canvas-brand); color: var(--color-on-primary); font-size: 7pt; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; }

  .coaches { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; }
  .coach { background: var(--color-canvas-soft); border-radius: 6mm; overflow: hidden; }
  .coach img { width: 100%; height: 44mm; object-fit: cover; object-position: center 25%; display: block; }
  .coach > div { padding: 4mm 5mm 5mm; }
  .coach-pill { display: inline-block; margin: 0 0 2mm; font-size: 7pt; font-weight: 700; background: var(--color-canvas); border-radius: 999px; padding: .5mm 2.5mm; }
  .coach h3 { font-size: 12pt; font-weight: 800; }
  .coach-pull { margin: 1mm 0 1.5mm; font-size: 9pt; font-weight: 600; }
  .coach-sum { margin: 0; font-size: 8pt; color: var(--color-body); }
  .quote { margin: 6mm 0 0; padding: 0 0 0 14mm; position: relative; font-size: 10.5pt; font-weight: 600; line-height: 1.45; break-inside: avoid; }
  .qmark { position: absolute; left: 0; top: -4mm; font-size: 40pt; font-weight: 900; line-height: 1; }
  .quote cite { display: block; margin-top: 2mm; font-style: normal; font-size: 8pt; font-weight: 500; color: var(--color-body); }
  .proof { list-style: none; padding: 0; margin: 5mm 0 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 3mm; text-align: center; }
  .proof img { width: 15mm; height: 15mm; border-radius: 50%; object-fit: cover; }
  .proof .who { margin: 1mm 0 0; font-size: 8pt; font-weight: 700; }
  .proof .where { margin: 0; font-size: 7pt; color: var(--color-body); }
  .close { position: relative; margin-top: 6mm; background: var(--color-canvas-brand); color: var(--color-on-primary); border-radius: 6mm; padding: 6mm 62mm 6mm 7mm; break-inside: avoid; }
  .close-lead { margin: 0 0 3mm; font-size: 13pt; font-weight: 800; line-height: 1.25; }
  .price { margin: 0; font-size: 11pt; font-weight: 800; }
  .price-sub { margin: 1mm 0 0; font-size: 8pt; }
  .close .btn { background: var(--color-ink-deep); color: var(--color-canvas-brand); }
  .close .btn-ghost { color: var(--color-on-primary); }
  .close .spot { width: 60mm; right: 1mm; bottom: 1mm; }
  .fine { font-size: 7pt; color: var(--color-mute-strong); margin: 3mm 0 0; }
`;

/**
 * Text content only, for the safety check.
 *
 * The markup itself carries `class="highlights"` and an `id` per dimension, and
 * a check run over raw HTML would fail on a CSS class name rather than on
 * anything a candidate can read.
 */
/** The text a reader sees, for the vocabulary check in `scripts/verify-report.ts`. */
export function stripMarkup(html: string): string {
  return html
    .replace(/<style>[\s\S]*?<\/style>/g, " ")
    .replace(/<script>[\s\S]*?<\/script>/g, " ")
    .replace(/<[^>]+>/g, " ");
}

/**
 * The Fit Report as a book, for the free report's last section. 27/10/2026.
 *
 * Each page is laid out at a real page width and scaled down with a transform,
 * so the miniature is the paid document's own typography shrunk, not a second
 * design that can drift from it. The notes column shows grey lines, not text:
 * a coach note is written per candidate and an invented one would read as
 * advice.
 */
function bookShowcase(
  locale: Locale,
  s: (key: Parameters<typeof t>[0], vars?: Record<string, string | number>) => string,
  dimLabel: (key: string, fallback: string) => string,
  cover: { name: string; sub: string },
): string {
  const empAvg = FULL_SAMPLE.reduce((n, a) => n + a.score, 0) / FULL_SAMPLE.length;
  const areaScore = (k: string) =>
    k === "employability" ? empAvg : (HERO_SAMPLE_SCORES as Record<string, number>)[k] ?? 0;
  // The real report draws and lists the areas in model order, not gate order.
  const areas = DIMENSIONS.map((d) => ({ key: d.key, bar: GATES.find((g) => g.key === d.key)?.bar ?? 3, score: areaScore(d.key) }));
  const empBar = GATES.find((g) => g.key === "employability")!.bar;

  const overview = radarSvg(
    areas.map((a) => ({ label: dimLabel(a.key, a.key), value: a.score })),
    { idPrefix: "bookov", size: 300, values: true, maxLabel: 40, widthRatio: 1.75, wrapLabels: true, threshold: areas.map((a) => a.bar) },
  );
  const areaChart = radarSvg(
    FULL_SAMPLE.map((a) => ({ label: itemName(a.key, a.key, locale), value: a.score })),
    { idPrefix: "bookemp", size: 300, values: false, maxLabel: 40, widthRatio: 1.75, wrapLabels: true, threshold: empBar },
  );
  const gapRows = areas
    .map((a) => {
      const gap = a.score >= a.bar ? `<td class="bk-clear">${esc(s("fit.cleared"))}</td>` : `<td class="bk-gap">${(a.bar - a.score).toFixed(1)}</td>`;
      return `<tr><th>${esc(dimLabel(a.key, a.key))}</th><td>${a.score.toFixed(1)}</td><td>${a.bar.toFixed(1)}</td>${gap}</tr>`;
    })
    .join("");
  const noteRows = FULL_SAMPLE.map((a, i) => {
    const note =
      a.score >= empBar
        ? `<span class="bk-clear">${esc(s("fit.cleared"))}</span>`
        : `<span class="bk-line" style="width:${[88, 72, 94, 64, 80, 70, 90, 76][i % 8]}%"></span><span class="bk-line" style="width:${[52, 66, 40, 58, 46, 62, 50, 44][i % 8]}%"></span>`;
    return `<tr><th>${esc(itemName(a.key, a.key, locale))}</th><td>${a.score.toFixed(1)}</td><td>${note}</td></tr>`;
  }).join("");
  const foot = (num: string, heading: string) =>
    `<p class="bk-foot"><span>${esc(s("fit.eyebrow"))}</span><span>${num} · ${esc(heading)}</span></p>`;

  return `<div class="book" aria-label="${esc(s("report.full.example"))}">
    <div class="bk-closed">
      <div class="bk-frame"><div class="bk-page bk-cover">
        <div>
          <p class="bk-eyebrow">${esc(s("fit.eyebrow"))}</p>
          <p class="bk-title" style="--cover-run:${Math.max(1, ...cover.name.replace(/-/g, "\u2011").split(/\s+/).map((w) => w.length))};--cover-len:${Math.max(1, cover.name.length)}">${esc(cover.name.replace(/-/g, "\u2011"))}</p>
          ${cover.sub ? `<p class="bk-sub">${esc(cover.sub)}</p>` : ""}
        </div>
        <div>
          <p class="bk-coverline">${esc(s("fit.cover.sub", { count: 34 }))}</p>
          <span class="bk-line bk-line-dark" style="width:34%"></span>
        </div>
      </div></div>
    </div>
    <div class="bk-open">
      <div class="bk-frame"><div class="bk-page">
        <h3><span class="bk-num">01</span>${esc(s("fit.summary.heading"))}</h3>
        <figure>${overview}</figure>
        <p class="bk-legend">${esc(s("fit.legend.bar"))}</p>
        <table><thead><tr><th>${esc(s("fit.col.area"))}</th><th>${esc(s("fit.col.score"))}</th><th>${esc(s("fit.col.bar"))}</th><th>${esc(s("fit.col.gap"))}</th></tr></thead><tbody>${gapRows}</tbody></table>
        ${foot("01", s("fit.summary.heading"))}
      </div></div>
      <div class="bk-frame"><div class="bk-page">
        <h3><span class="bk-num">04</span>${esc(dimLabel("employability", "Employability"))}</h3>
        <p class="bk-score"><strong>${empAvg.toFixed(1)}</strong> / 5 · ${esc(s("fit.col.bar"))} ${empBar.toFixed(1)}</p>
        <figure>${areaChart}</figure>
        <p class="bk-legend">${esc(s("fit.legend.bar"))}</p>
        <table class="bk-notes"><thead><tr><th>${esc(s("report.competency"))}</th><th>${esc(s("report.score"))}</th><th>${esc(s("fit.col.note"))}</th></tr></thead><tbody>${noteRows}</tbody></table>
        ${foot("04", dimLabel("employability", "Employability"))}
      </div></div>
    </div>
  </div>`;
}

/**
 * The free report's last picture, the same as the top of the Fit Report page:
 * page 04 of the sample Fit Report, flat on the lime ground, and the three
 * notes beside it. The page is the real renderer's output, cut out by section
 * id and scaled, so it cannot drift from the paid report. 30/10/2026.
 */
function flatShowcase(locale: Locale): string {
  const profile = scoreResponse(FIT_SAMPLE_INPUT);
  const html = renderFitReport(
    {
      profile,
      full: scoreFull(profile, fitSampleRatings(), (k) => ECRA[k]?.formula),
      moves: [],
      roles: { sent: [], pipeline: { inCountries: 0, matching: 0, examples: [] } },
    },
    { candidate: SAMPLE_LABEL[locale] },
    { locale, sampleNotes: true },
  );
  const m = html.match(/<section class="fit-sec" id="employability">([\s\S]*?)<\/section>/);
  const page = m ? m[1] : "";
  const pick = (c: { en: string; th: string }) => (locale === "th" ? c.th : c.en);
  const mark = (k: string) =>
    k === "bar" ? `<span class="fl-bar"></span>` : `<span class="fl-dot">${k === "check" ? "✓" : esc(k)}</span>`;
  return `<div class="flat">
    <div class="fl-sheet"><div class="fl-page is-fit"><div class="fit-sec">${page}</div></div></div>
    <ul class="fl-notes">${FIT_CALLOUTS.map(
      (c) => `<li>${mark(c.mark)}<div><p class="fl-t">${esc(pick(c.title))}</p><p class="fl-b">${esc(pick(c.body))}</p></div></li>`,
    ).join("")}</ul>
  </div>`;
}

const FLAT_STYLES = `
  .flat {
    display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 14px; align-items: start;
    margin: 1.25rem 0 .5rem; padding: 18px; border-radius: 22px; background: var(--color-canvas-brand);
    break-inside: avoid;
  }
  .fl-sheet { --k: .5; position: relative; background: #fff; border-radius: 16px; overflow: hidden; height: calc(760px * var(--k)); }
  .fl-page { position: absolute; top: 0; left: 0; width: 794px; padding: 40px 48px; transform: scale(var(--k)); transform-origin: top left; }
  .fl-page .sec-foot { display: none; }
  .fl-page .fit-sec { break-before: auto !important; margin: 0; }
  ul.fl-notes { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
  ul.fl-notes li { display: flex; gap: 12px; background: #fff; border-radius: 16px; padding: 14px 16px; }
  .fl-t { margin: 0; font-weight: 700; font-size: .92rem; color: #163300; }
  .fl-b { margin: .2rem 0 0; font-size: .84rem; color: #163300; }
  .fl-dot { flex: none; display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; background: #163300; color: #9fe870; font-weight: 700; font-size: .75rem; }
  .fl-bar { flex: none; width: 26px; margin-top: 10px; border-top: 3px dashed #b86700; height: 0; }
  @media (max-width: 640px) {
    .flat { grid-template-columns: 1fr; }
    .fl-sheet { --k: .4; }
  }
  @media print {
    .fl-sheet { --k: .48; }
  }
`;

/** The book's stylesheet. Scoped under `.book`, used only by the free report. */
const BOOK_STYLES = `
  .book {
    --viz-bar: var(--color-warning-deep);
    --pw: 560px; --ph: 792px; --k: .36; --kc: .27;
    display: flex; align-items: flex-end; justify-content: center; gap: 2.25rem;
    margin: 1.5rem 0 .5rem; padding: 2.25rem 1.5rem 2rem;
    background: radial-gradient(120% 90% at 50% 0%, var(--viz-surface) 0%, var(--viz-grid) 100%);
    border: 1px solid var(--border); border-radius: 16px; break-inside: avoid;
  }
  .bk-frame { position: relative; width: calc(var(--pw) * var(--k)); height: calc(var(--ph) * var(--k)); overflow: hidden; background: #fff; }
  .bk-page {
    position: absolute; top: 0; left: 0; width: var(--pw); height: var(--ph);
    transform: scale(var(--k)); transform-origin: top left;
    padding: 44px 40px 36px; color: var(--ink-1); font-size: 14px; line-height: 1.45;
    display: flex; flex-direction: column;
  }
  .bk-page h3 { font-size: 22px; line-height: 1.25; margin: 0 0 6px; }
  .bk-num { display: inline-block; min-width: 38px; color: var(--color-warning-deep); }
  .bk-page figure { margin: 4px auto 0; width: 100%; }
  .bk-page figure svg { width: 100%; height: auto; display: block; }
  .bk-legend { color: var(--ink-2); font-size: 12px; margin: 2px 0 8px; }
  .bk-legend::before { content: ""; display: inline-block; width: 26px; border-top: 2px dashed var(--color-warning-deep); vertical-align: middle; margin-right: 8px; }
  .bk-page table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .bk-page th, .bk-page td { text-align: left; padding: 7px 6px; border-bottom: 1px solid var(--border); vertical-align: middle; }
  .bk-page thead th { color: var(--ink-2); font-size: 11px; font-weight: 600; }
  .bk-page tbody th { font-weight: 600; }
  .bk-notes tbody th { width: 40%; font-weight: 400; }
  .bk-score { margin: 4px 0 0; font-size: 15px; }
  .bk-score strong { font-size: 22px; }
  .bk-notes td:nth-child(2) { width: 46px; font-weight: 700; }
  .bk-open .bk-frame:last-child figure { width: 80%; margin-bottom: 0; }
  .bk-open .bk-frame:first-child figure { width: 100%; margin: 14px auto 8px; }
  .bk-open .bk-page tbody td:nth-child(2) { font-weight: 700; }
  .bk-clear { color: var(--color-positive-deep); font-weight: 700; }
  .bk-gap { color: var(--color-warning-deep); font-weight: 700; }
  .bk-line { display: block; height: 7px; border-radius: 999px; background: var(--viz-grid); margin: 3px 0; }
  .bk-line-dark { background: rgba(255,255,255,.22); height: 9px; }
  .bk-foot { margin-top: auto; padding-top: 8px; border-top: 1px solid var(--border); color: var(--viz-muted); font-size: 11px; display: flex; justify-content: space-between; }

  /* the closed book: cover on the dark brand ground, page edges behind it */
  .bk-closed { position: relative; transform: rotate(-4deg); margin-bottom: .4rem; }
  .bk-closed .bk-frame { --k: var(--kc); border-radius: 3px 8px 8px 3px;
    box-shadow: 3px 3px 0 #f4f2ec, 6px 6px 0 #e6e3da, 9px 9px 0 #f4f2ec, 12px 12px 0 #dcd8cc, 0 18px 28px rgba(0,0,0,.22); }
  .bk-closed .bk-frame::before { content: ""; position: absolute; inset: 0 auto 0 0; width: 9px; background: linear-gradient(90deg, rgba(0,0,0,.35), rgba(0,0,0,0)); z-index: 2; }
  .bk-cover { background: var(--color-canvas-dark); color: var(--color-on-canvas-dark); justify-content: space-between; padding: 64px 48px 56px 60px; }
  .bk-eyebrow { color: var(--color-canvas-brand); font-size: 16px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; margin: 0; }
  .bk-title { --cover-w: 452px; --cover-max: 52px; --cover-min: 22px; ${COVER_NAME_FIT}
    color: #fff; font-weight: 800; line-height: 1.1; margin: 22px 0 0; }
  .bk-sub { color: var(--color-on-canvas-dark); font-size: 18px; margin: 12px 0 0; }
  .bk-coverline { color: var(--color-canvas-brand); font-size: 22px; font-weight: 600; line-height: 1.35; margin: 0 0 22px; }

  /* the open spread: two pages meeting at a shaded spine */
  .bk-open { display: flex; position: relative; filter: drop-shadow(0 16px 22px rgba(0,0,0,.18)); }
  .bk-open .bk-frame:first-child { border-radius: 6px 0 0 6px; box-shadow: inset -18px 0 22px -18px rgba(0,0,0,.28); }
  .bk-open .bk-frame:last-child { border-radius: 0 6px 6px 0; box-shadow: inset 18px 0 22px -18px rgba(0,0,0,.28); }
  .bk-open::after { content: ""; position: absolute; left: 0; right: 0; bottom: -6px; height: 6px; border-radius: 0 0 6px 6px;
    background: repeating-linear-gradient(180deg, #e8e5dc 0 1px, #fbfaf7 1px 2px); }

  @media (max-width: 720px) {
    .book { --k: .26; --kc: .2; gap: 1.25rem; padding: 1.5rem .75rem; }
  }
  @media (max-width: 480px) {
    .book { flex-direction: column; align-items: center; --k: .27; --kc: .2; }
  }
  @media print {
    .book { --k: .37; --kc: .27; gap: 1.75rem; padding: 1.75rem 1rem 1.5rem; }
    /* Nothing see-through reaches the PDF. macOS Preview, which candidates open
       the file in, draws Chrome's transparent layers wrongly: a fade prints pink
       and a shadow prints as a visible square. So every shadow, fade and
       semi-transparent overlay either goes in print, as below, or is flattened
       into one picture, the way the country photo is. */
    .bk-closed .bk-frame { box-shadow: 3px 3px 0 #f4f2ec, 6px 6px 0 #e6e3da, 9px 9px 0 #f4f2ec, 12px 12px 0 #dcd8cc; }
    .bk-closed .bk-frame::before { display: none; }
    .bk-open { filter: none; }
    .bk-open .bk-frame:first-child, .bk-open .bk-frame:last-child { box-shadow: none; }
    .bk-line-dark { background: var(--color-on-canvas-dark); }
  }
`;

/**
 * What fits on one sheet of the paid report, in millimetres, so that a long
 * area is split into whole pages instead of spilling onto a short strip with no
 * margin, logo or footer.
 *
 * An area page used to be one A4 box however much the coach had written, and a
 * coach's notes are a different length for every candidate, so the layout could
 * not go on assuming they fit. These numbers are measured off the stylesheet
 * above: the page is 296.5mm with 22mm of margin top and bottom, the heading
 * block runs to the rule under its number, and the score line, the radar at
 * 118mm across a 2.1:1 viewBox, and the legend sit above the table on the
 * first sheet only.
 *
 * Measured off a rendered report in a browser rather than reasoned about, which
 * is how the row heights were found to be half as tall again as they had been
 * guessed at. They are still only a first cut: the pass that runs in the tab
 * measures the real page and rebalances, and that is what makes the rule true.
 * These numbers are what the renderer gets right before it is corrected, and
 * what `verify:report` can check without a browser.
 */
export const SHEET = {
  /** A4 less the 22mm of margin top and bottom. */
  content: 252,
  /** The numbered heading, its badge and the rule under it. */
  heading: 34,
  /** The score line, the radar at 56mm and its legend. First sheet only. */
  opener: 81,
  /** The table's header row, repeated on every sheet it continues onto. */
  thead: 9,
  /** A row's own padding, and one line of text in it. */
  rowPad: 3.8,
  rowLine: 5.7,
  /** Characters to a line in the note column and in the competency column. */
  noteChars: 40,
  nameChars: 50,
};

/** How tall one competency row comes out, given what is written in it. */
export const sheetRow = (label: string, note: string, lines = 0) =>
  SHEET.rowPad +
  SHEET.rowLine *
    Math.max(1, lines, Math.ceil(label.length / SHEET.nameChars), Math.ceil(note.length / SHEET.noteChars));

/**
 * What fits on a sheet of the roles page, in millimetres, so that the roles
 * PunProfile sent are split into whole pages the way a long area is.
 *
 * The roles page was the one section nothing measured. An area table is dealt
 * into sheets by `sheetGroups` and corrected in the tab by `SHEET_FIT`, which
 * only ever moves table rows; a list of roles went through neither, and
 * `ROLE_CAP`'s six turned out to be six only for roles carrying no reason.
 * Six roles with a coach's reason measured 313mm of a 296.5mm sheet, which put
 * the report's fine print and the whole of the roles footer on a sixteenth
 * sheet with no top margin, no logo and nothing else on it.
 *
 * Measured off a rendered report in a browser, as `SHEET` was, and every
 * number rounded the safe way, so a row is budgeted at least as tall as it
 * comes out and the split can only ever happen early. The wrap points found
 * were a title at 81 to 89 characters, a link at 121 to 139, and a reason at
 * 101 in English and past 130 in Thai; each divisor below sits at or under the
 * narrowest of them, so a line is never under-counted.
 *
 * Nothing corrects these in the tab: `SHEET_FIT` moves table rows and a role
 * is not one. They stand on their own, which is why they are measured and
 * conservative rather than tight.
 */
export const ROLE = {
  /** A role with its title, its employer and country, and nothing else. */
  row: 19.5,
  /** Each further line: a line of the reason, the link, a wrapped title. */
  line: 6.7,
  /** Characters to a line in the reason, the link and the title. */
  reasonChars: 100,
  linkChars: 110,
  titleChars: 70,
  /** The lede over the list, and the space above the list itself. */
  lede: 14,
  /** The note under the list, which belongs on the last sheet of it. */
  note: 16,
  /** The report's fine print, which lands on the last sheet of the document. */
  fine: 13,
};

/** How tall one sent role comes out, given what was written about it. */
export const roleRow = (r: { title: string; reason: string | null; url: string | null }) =>
  ROLE.row +
  ROLE.line *
    (Math.ceil((r.reason?.length ?? 0) / ROLE.reasonChars) +
      Math.ceil((r.url?.length ?? 0) / ROLE.linkChars) +
      Math.max(0, Math.ceil(r.title.length / ROLE.titleChars) - 1));

/**
 * Deal items into sheets, the first of which has less room than the rest
 * because it carries the chart. Every sheet takes at least one item, so an item
 * taller than a whole page gets its own sheet rather than an empty one.
 */
function sheetGroups<T>(items: T[], height: (item: T) => number, first: number, rest: number): T[][] {
  const out: T[][] = [];
  let room = first;
  let sheet: T[] = [];
  for (const item of items) {
    const h = height(item);
    if (sheet.length && h > room) {
      out.push(sheet);
      sheet = [];
      room = rest;
    }
    sheet.push(item);
    room -= h;
  }
  if (sheet.length) out.push(sheet);
  return out;
}

/* ===================================================================== */
/* THE PAID FIT REPORT                                                    */
/* ===================================================================== */

/**
 * What the paid Fit Report adds to the stylesheet. Added 26/10/2026.
 *
 * The free report is plain on purpose: white, one chart colour, no cover. This
 * one has to read as a different document at a glance, so it gets a cover page
 * on the dark brand ground, numbered sections with their own footing, and the
 * market bar as a second chart mark in the warning-deep token.
 */
const FIT_STYLES = `
  .is-fit { --viz-bar: var(--color-warning-deep); }
  .cover {
    background: var(--color-canvas-dark); color: var(--color-on-canvas-dark);
    border-radius: 14px; padding: 3.5rem 2.5rem; margin-top: 2rem;
    min-height: 34rem; display: flex; flex-direction: column; justify-content: space-between;
  }
  .cover .eyebrow { color: var(--color-canvas-brand); font-size: .8rem; }
  .cover h1 { color: #fff; font-size: 2.6rem; margin-top: 1rem; }
  .cover .sub { color: var(--color-on-canvas-dark); font-size: 1rem; margin-top: .5rem; }
  .cover .cover-line { color: var(--color-canvas-brand); font-size: 1.15rem; font-weight: 600; max-width: 32rem; margin: 2.5rem 0 0; }
  .cover .cover-date { color: var(--color-on-canvas-dark); font-size: .85rem; margin: 0; }
  .sec-num { display: inline-block; min-width: 2rem; color: var(--color-warning-deep); font-variant-numeric: tabular-nums; }
  .sec-foot { margin-top: 1.25rem; padding-top: .5rem; border-top: 1px solid var(--border); color: var(--viz-muted); font-size: .72rem; display: flex; justify-content: space-between; }
  .legend-bar { color: var(--ink-2); font-size: .78rem; margin: .5rem 0 0; }
  .legend-bar::before { content: ""; display: inline-block; width: 1.6rem; border-top: 2px dashed var(--color-warning-deep); vertical-align: middle; margin-right: .5rem; }
  table.gap { width: 100%; border-collapse: collapse; margin-top: 1rem; font-size: .9rem; }
  table.gap th, table.gap td { text-align: left; padding: .55rem .5rem; border-bottom: 1px solid var(--border); }
  table.gap thead th { color: var(--ink-2); font-size: .78rem; font-weight: 600; }
  .gap-open { color: var(--color-warning-deep); font-weight: 700; }
  .gap-clear { color: var(--color-positive-deep); font-weight: 700; }
  ol.path { list-style: none; padding: 0; margin: 1rem 0 0; display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: .5rem; }
  ol.path li { background: var(--viz-surface); border: 1px solid var(--border); border-radius: 10px; padding: .8rem .85rem; font-size: .84rem; }
  ol.path li.is-start { border: 2px solid var(--color-warning-deep); }
  ol.path .p-num { color: var(--viz-muted); font-size: .72rem; font-weight: 700; }
  ol.path .p-name { font-weight: 700; margin: .2rem 0; }
  ol.path .p-tag { display: inline-block; margin-top: .3rem; padding: .05rem .5rem; border-radius: 999px; font-size: .7rem; font-weight: 700; background: var(--color-warning-deep); color: #fff; }
  .how-none { color: var(--viz-muted); }
  .coach-note { color: var(--ink-1); font-size: .86rem; }
  .coach-note .bk-line { display: block; height: 7px; border-radius: 999px; background: var(--viz-grid); margin: 4px 0; }
  .is-fit table.scores thead th:first-child { width: 38%; }
  .is-fit table.scores thead th:nth-child(2) { width: 4.5rem; }
  ol.moves { list-style: none; padding: 0; margin: 1rem 0 0; }
  ol.moves li { background: var(--viz-surface); border: 1px solid var(--border); border-radius: 10px; padding: 1rem 1.1rem; margin-bottom: .6rem; }
  .m-text { font-weight: 600; margin: 0 0 .5rem; }
  .m-dim { color: var(--ink-2); font-size: .78rem; margin: 0 0 .35rem; }
  .m-bars { display: grid; grid-template-columns: 4.5rem minmax(0,1fr) 2.5rem; gap: .25rem .5rem; align-items: center; font-size: .78rem; }
  .m-track { height: .55rem; background: var(--viz-grid); border-radius: 999px; overflow: hidden; }
  .m-fill { height: 100%; border-radius: 999px; background: var(--viz-muted); }
  .m-fill.is-after { background: var(--viz-series-1); }
  ul.roles { list-style: none; padding: 0; margin: 1rem 0 0; }
  ul.roles li { padding: .6rem 0; border-bottom: 1px solid var(--border); }
  .r-title { font-weight: 600; }
  .r-meta { color: var(--ink-2); font-size: .8rem; }
  .r-yes { display: inline-block; margin-left: .4rem; padding: .05rem .4rem; border-radius: 1rem; font-size: .7rem; font-weight: 700; background: var(--color-primary-pale); color: var(--color-on-primary-pale); }
  .r-why { color: var(--color-ink); font-size: .82rem; }
  .r-link { color: var(--color-mute-strong); font-size: .72rem; word-break: break-all; }
  @media print {
    .cover { min-height: 255mm; border-radius: 0; margin: 0; break-after: page; }
    .is-fit .fit-sec { break-before: page; }
    ol.path, ol.moves li, table.gap { break-inside: avoid; }
  }`;

/**
 * The Fit Report as fixed A4 pages, redesigned 20/11/2026 to match the EU Fit
 * Check report. Scoped to `body.is-fit`, the Fit Report's own document, so the
 * page of it the free report shows (`flatShowcase`) keeps its own styling.
 * Lime is a fill and never type; the dashed bar keeps `--viz-bar`.
 */
const FIT_PAGED_STYLES = `
  .fit-logo { display: none; }
  body.is-fit { background: var(--color-canvas-soft); padding: 0 0 2rem; }
  body.is-fit main { max-width: none; }
  body.is-fit .toolbar { max-width: 210mm; margin: 1.25rem auto .5rem; }
  body.is-fit .fit-sec { position: relative; box-sizing: border-box; width: 210mm; min-height: 296.5mm; margin: 0 auto 8mm; padding: 22mm 16mm 22mm; background: var(--color-canvas); overflow: hidden; break-before: page; box-shadow: 0 1px 6px rgba(14,15,12,.12); }
  body.is-fit .fit-sec:not(#summary):not(#path):not(#moves):not([id^="roles"]) { background: var(--color-canvas-soft); }
  body.is-fit .fit-logo { display: block; position: absolute; top: 9mm; right: 16mm; height: 7mm; }
  body.is-fit .fit-sec h2 { font-size: 24pt; line-height: 1.15; letter-spacing: -0.02em; font-weight: 800; margin: 0 0 6mm; max-width: 150mm; }
  body.is-fit .fit-sec .sec-num { position: relative; display: block; width: fit-content; min-width: 0; font-size: 9pt; font-weight: 700; letter-spacing: 0; background: var(--color-canvas-brand); color: var(--color-on-primary); border-radius: 999px; padding: .5mm 3mm; margin-bottom: 13mm; }
  body.is-fit .fit-sec .sec-num::after { content: ""; position: absolute; left: 0; top: calc(100% + 5mm); width: 14mm; height: 1.2mm; border-radius: 1mm; background: var(--color-ink); }
  body.is-fit .sec-foot { position: absolute; bottom: 8mm; left: 16mm; right: 16mm; margin: 0; padding-top: 2.5mm; font-size: 7.5pt; color: var(--color-mute-strong); border-top: 1px solid var(--color-line); }
  body.is-fit .fit-sec > p { font-size: 10.5pt; color: var(--color-body); max-width: 165mm; }
  body.is-fit .dim-score { font-size: 11pt; margin: -2mm 0 2mm; }
  body.is-fit .dim-score strong { font-size: 30pt; font-weight: 800; letter-spacing: -0.03em; color: var(--color-ink); }
  body.is-fit figure.chart { background: transparent; margin: 0 auto !important; max-width: 118mm !important; }
  body.is-fit table.gap, body.is-fit table.scores { background: var(--color-canvas); border-radius: 5mm; overflow: hidden; border-collapse: separate; border-spacing: 0; }
  body.is-fit table.gap th, body.is-fit table.gap td, body.is-fit table.scores th, body.is-fit table.scores td { padding: 1.8mm 4mm; }
  body.is-fit table.gap thead th, body.is-fit table.scores thead th { background: var(--color-cyan-pale); color: var(--color-on-cyan-pale); }
  body.is-fit table.gap tr:last-child > *, body.is-fit table.scores tr:last-child > * { border-bottom: 0; }
  /* The renderer deals rows into whole sheets; these two make an underestimate
     harmless. A header group reprints itself wherever a table does carry on, and
     a row that will not fit moves down whole instead of being cut in half. */
  body.is-fit table.gap thead, body.is-fit table.scores thead { display: table-header-group; }
  body.is-fit table.gap tr, body.is-fit table.scores tr { break-inside: avoid; }
  body.is-fit ol.path li { border: 0; background: var(--color-canvas-soft); border-radius: 5mm; padding: 4mm; }
  body.is-fit ol.path li.is-start { background: var(--color-yellow-pale); outline: 2px solid var(--color-warning-deep); }
  body.is-fit ol.moves li { border: 0; background: var(--color-canvas-soft); border-radius: 5mm; padding: 5mm; }
  body.is-fit ul.roles li { padding: 3mm 0; break-inside: avoid; }
  body.is-fit .r-yes { font-size: 7.5pt; }
  body.is-fit .r-why { font-size: 9pt; }
  body.is-fit .r-link { font-size: 7.5pt; }
  body.is-fit .fit-fine { font-size: 7.5pt !important; color: var(--color-mute-strong) !important; margin-top: 8mm; }

  body.is-fit .cover { position: relative; box-sizing: border-box; display: block; width: 210mm; min-height: 296.5mm; margin: 0 auto 8mm; padding: 0; border-radius: 0; background: var(--color-canvas); color: var(--color-ink); overflow: hidden; box-shadow: 0 1px 6px rgba(14,15,12,.12); }
  body.is-fit .fc-band { position: relative; height: ${COVER.band}mm; padding: ${COVER.padY}mm ${COVER.padX}mm; background: var(--color-canvas-dark); color: var(--color-on-canvas-dark); }
  body.is-fit .fc-logo { height: ${COVER.logo}mm; display: block; }
  body.is-fit .cover .eyebrow { margin: ${COVER.eyebrowTop}mm 0 ${COVER.eyebrowBottom}mm; color: var(--color-on-canvas-dark); font-size: 11pt; letter-spacing: .12em; }
  body.is-fit .cover h1 { --cover-w: ${COVER.nameW}mm; --cover-max: ${COVER.nameMax}pt; --cover-h: ${COVER_TEXT.nameBudget}mm; ${COVER_NAME_FIT}
    margin: 0; line-height: ${COVER.nameLead}; letter-spacing: -0.03em; font-weight: 900; color: var(--color-canvas); max-width: ${COVER.nameW}mm; }
  body.is-fit .cover .sub { margin: ${COVER.subTop}mm 0 0; font-size: 11pt; color: var(--color-on-canvas-dark); max-width: ${COVER_TEXT.width}mm; }
  body.is-fit .cover .cover-line { display: inline-block; margin: ${COVER.pillTop}mm 0 0; padding: ${COVER.pillPad}mm 4mm; border-radius: 2mm; background: var(--color-canvas-brand); color: var(--color-on-primary); font-size: 11pt; font-weight: 700; max-width: ${COVER_TEXT.width}mm; }
  body.is-fit .fc-art { position: absolute; right: ${COVER.artRight}mm; bottom: -${COVER.artBelow}mm; width: ${COVER.artW}mm; border-radius: 6mm; box-shadow: 0 2mm 6mm rgba(22,51,0,.25); }
  body.is-fit .cover-date { position: absolute; left: 16mm; top: 212mm; margin: 0; font-size: 10pt; color: var(--color-body); }
  body.is-fit .fc-pp { position: absolute; left: 16mm; bottom: 14mm; height: 8mm; }

  @page { size: A4; margin: 0; }
  @media print {
    body.is-fit { background: var(--color-canvas); padding: 0; }
    body.is-fit .fit-sec, body.is-fit .cover { margin: 0; box-shadow: none; }
    /* Nothing see-through reaches the PDF. macOS Preview, which candidates open
       the file in, draws Chrome's transparent layers wrongly: a fade prints pink
       and a shadow prints as a visible square. So every shadow, fade and
       semi-transparent overlay either goes in print, as below, or is flattened
       into one picture, the way the country photo is. */
    body.is-fit .fc-art { box-shadow: none; }
    body.is-fit .cover { break-after: page; min-height: 296.5mm; }
  }
`;

export interface FitReportInput {
  profile: ProfileScore;
  full: import("./scoring").FullDimensionScore[];
  moves: import("./levers").MoveImpact[];
  /**
   * The candidate's own roles first, the public pipeline only as a fallback.
   * `sent` is what PunProfile screened and sent them, from the one Convex read
   * in `convex/reportRoles.ts` that the coach's copy and the candidate's copy
   * both go through; `pipeline` is the published list, matched on their active
   * target titles, and it is read only when `sent` is empty.
   */
  roles: {
    sent: import("./market-match").SentRoleRow[];
    pipeline: import("./market-match").RoleMatch;
  };
}

export function renderFitReport(input: FitReportInput, meta: ReportMeta, opts: ReportOptions = {}): string {
  const locale: Locale = opts.locale ?? "th";
  const s = (key: Parameters<typeof t>[0], vars?: Record<string, string | number>) => t(key, locale, vars);
  const dimLabel = (key: string, fallback: string) => dimensionName(key, fallback, locale);
  const name = (key: string, fallback: string) => itemName(key, fallback, locale);
  const { full, moves, roles } = input;
  const today = ddmmyyyy(new Date().toISOString().slice(0, 10));
  const origin = opts.assetOrigin ?? (typeof location !== "undefined" ? location.origin : "");
  const asset = (path: string) => `${origin}${path}`;
  const competencies = full.reduce((n, d) => n + d.items.length, 0);

  let secNo = 0;
  /**
   * One sheet: a whole A4 page carrying its own top margin, logo, numbered
   * heading and footer. `of` is passed where a section runs onto more than one
   * sheet. The number counts sections rather than sheets, so a continued sheet
   * keeps it and says its place in the footer as a figure, which needs no word
   * in either language; its id takes a suffix, because an id is unique per
   * document and the first sheet keeps the bare one that `flatShowcase` cuts by.
   */
  const section = (id: string, heading: string, inner: string, of?: { sheet: number; sheets: number }) => {
    if (!of || of.sheet === 1) secNo++;
    const num = String(secNo).padStart(2, "0");
    const place = of && of.sheets > 1 ? ` · ${of.sheet}/${of.sheets}` : "";
    // A continuation sheet says which section it belongs to, so the measuring
    // pass in the tab treats the whole run as one group and rebalances across
    // all of it rather than mistaking the second sheet for a section of its own.
    const belongs = of && of.sheet > 1 ? ` data-sheet-of="${id}"` : "";
    return `<section class="fit-sec" id="${of && of.sheet > 1 ? `${id}-${of.sheet}` : id}"${belongs}>
  <img class="fit-logo" src="${asset("/efc-logo.svg")}" alt="">
  <h2><span class="sec-num">${num}</span>${esc(heading)}</h2>
${inner}
  <p class="sec-foot"><span>${esc(s("fit.eyebrow"))} · ${esc(meta.candidate)}</span><span>${num} · ${esc(heading)}<span class="sec-pos">${place}</span></span></p>
</section>`;
  };
  const gapCell = (score: number | null, bar: number) =>
    score === null
      ? `<td class="how-none">${esc(s("fit.how.none"))}</td>`
      : score >= bar
        ? `<td class="gap-clear">${esc(s("fit.cleared"))}</td>`
        : `<td class="gap-open">${(bar - score).toFixed(1)}</td>`;

  // ---- summary: the overview with every area's bar
  const overview = radarSvg(
    full.map((d) => ({ label: dimLabel(d.key, d.label), value: d.score })),
    { idPrefix: "fitoverview", size: 300, values: true, maxLabel: 40, widthRatio: 2.1, wrapLabels: true, threshold: full.map((d) => d.bar) },
  );
  const gapRows = full
    .map(
      (d) => `<tr><th scope="row">${esc(dimLabel(d.key, d.label))}</th><td class="num">${d.score === null ? "–" : d.score.toFixed(1)}</td><td class="num">${d.bar.toFixed(1)}</td>${gapCell(d.score, d.bar)}</tr>`,
    )
    .join("");
  const summary = section(
    "summary",
    s("fit.summary.heading"),
    `  <figure class="chart" style="max-width:36rem">${overview}</figure>
  <p class="legend-bar">${esc(s("fit.legend.bar"))}</p>
  <table class="gap"><thead><tr><th scope="col">${esc(s("fit.col.area"))}</th><th scope="col">${esc(s("fit.col.score"))}</th><th scope="col">${esc(s("fit.col.bar"))}</th><th scope="col">${esc(s("fit.col.gap"))}</th></tr></thead><tbody>${gapRows}</tbody></table>
  <p>${esc(s("fit.scores.replace"))}</p>
  <p class="method-note">${esc(METHOD_NOTE[locale])}</p>`,
  );

  // ---- the order to work in: gates in dependency order, first uncleared marked
  const ordered = GATES.map((g) => full.find((d) => d.key === g.key)!).filter(Boolean);
  const startKey = ordered.find((d) => d.score !== null && d.score < d.bar)?.key;
  const path = section(
    "path",
    s("fit.path.heading"),
    `  <p>${esc(s("fit.path.lede"))}</p>
  <ol class="path">${ordered
    .map(
      (d, i) => `<li class="${d.key === startKey ? "is-start" : ""}"><span class="p-num">${i + 1}</span><p class="p-name">${esc(dimLabel(d.key, d.label))}</p><span>${d.score === null ? esc(s("fit.how.none")) : `${d.score.toFixed(1)} / ${d.bar.toFixed(1)}`}</span>${d.key === startKey ? `<br><span class="p-tag">${esc(s("fit.path.start"))}</span>` : ""}</li>`,
    )
    .join("")}</ol>`,
  );

  // ---- one page per area, every competency an axis
  const areas = full
    .map((d, idx) => {
      const svg = radarSvg(
        d.items.map((i) => ({ label: name(i.key, i.label), value: i.score })),
        { idPrefix: `fitdim${idx}`, size: 300, values: false, maxLabel: 60, widthRatio: 2.1, wrapLabels: true, threshold: d.bar },
      );
      const cells = d.items.map((i) => {
        const label = name(i.key, i.label);
        const skeleton = !i.note && opts.sampleNotes && i.score !== null && i.score < d.bar;
        return {
          // The sample's two ruled lines stand in for a note and take two lines.
          h: sheetRow(label, i.note ?? "", skeleton ? 2 : 0),
          html: `<tr><th scope="row">${esc(label)}</th><td class="num">${i.score === null ? "–" : i.score.toFixed(1)}</td><td class="coach-note">${
            i.note
              ? esc(i.note)
              : skeleton
                ? `<span class="bk-line" style="width:86%"></span><span class="bk-line" style="width:54%"></span>`
                : ""
          }</td></tr>`,
        };
      });
      const sheets = sheetGroups(
        cells,
        (c) => c.h,
        SHEET.content - SHEET.heading - SHEET.opener - SHEET.thead,
        SHEET.content - SHEET.heading - SHEET.thead,
      );
      const scores = (rows: typeof cells) =>
        `<table class="scores"><thead><tr><th scope="col">${esc(s("report.competency"))}</th><th scope="col">${esc(s("report.score"))}</th><th scope="col">${esc(s("fit.col.note"))}</th></tr></thead><tbody>${rows
          .map((c) => c.html)
          .join("")}</tbody></table>`;
      const opener = `  <p class="dim-score">${d.score === null ? esc(s("fit.how.none")) : `<strong>${d.score.toFixed(1)}</strong> / 5 · ${esc(s("fit.col.bar"))} ${d.bar.toFixed(1)}`}</p>
  <figure class="chart" style="max-width:36rem">${svg}</figure>
  <p class="legend-bar">${esc(s("fit.legend.bar"))}</p>`;
      // The chart and the score go on the first sheet; the table carries on over
      // as many more as the coach's notes need, each one a whole page.
      return sheets
        .map((rows, n) =>
          section(
            d.key,
            dimLabel(d.key, d.label),
            n === 0 ? `${opener}\n  ${scores(rows)}` : `  ${scores(rows)}`,
            { sheet: n + 1, sheets: sheets.length },
          ),
        )
        .join("\n");
    })
    .join("\n");

  // ---- what moves the score most
  const top = moves.filter((m) => m.changes.length && m.changes[0].delta > 0).slice(0, 4);
  const pct = (v: number | null) => `${Math.round(((v ?? 0) / 5) * 100)}%`;
  const movesSec = top.length
    ? section(
        "moves",
        s("fit.moves.heading"),
        `  <p>${esc(s("fit.moves.lede"))}</p>
  <ol class="moves">${top
    .map((m) => {
      const c = m.changes[0];
      return `<li><p class="m-text">${esc(m.move.candidate[locale] || m.move.candidate.en)}</p><p class="m-dim">${esc(dimLabel(c.dimension, c.label))}</p>
  <div class="m-bars"><span>${(c.from ?? 0).toFixed(1)}</span><div class="m-track"><div class="m-fill" style="width:${pct(c.from)}"></div></div><span></span>
  <span>${(c.to ?? 0).toFixed(1)}</span><div class="m-track"><div class="m-fill is-after" style="width:${pct(c.to)}"></div></div><span>+${c.delta.toFixed(1)}</span></div></li>`;
    })
    .join("")}</ol>`,
      )
    : "";

  // ---- roles that fit
  //
  // Three states, in this order. Roles PunProfile screened and sent them,
  // newest first, which is what a paying client has actually been given. Then,
  // only when there are none, the public pipeline matched on their target
  // titles. Then nothing at all: the page is left out rather than telling
  // someone who paid that nothing fits them. A role still waiting for the
  // coach's approval never appears, because it has not reached them either.
  const countries = (meta.targetCountries ?? []).join(", ");
  const sentRole = (r: import("./market-match").SentRoleRow) => {
    const liked = r.liked ? ` <span class="r-yes">${esc(s("fit.roles.liked"))}</span>` : "";
    const why = r.reason ? `<br><span class="r-why">${esc(r.reason)}</span>` : "";
    const link = r.url ? `<br><a class="r-link" href="${esc(r.url)}">${esc(r.url)}</a>` : "";
    return `<li><span class="r-title">${esc(r.title)}</span>${liked}<br><span class="r-meta">${esc(r.employer)} · ${esc(r.country)}</span>${why}${link}</li>`;
  };
  const legend = (key: "fit.roles.sent.note" | "fit.roles.note") =>
    `\n  <p class="legend-bar" style="margin-top:1rem">${esc(s(key))}</p>`;
  /**
   * The roles PunProfile sent, dealt into whole sheets. Six roles each
   * carrying a reason do not fit one A4 page, and nothing split this section
   * or measured it, so the overflow landed on a sheet of its own with no
   * margin, logo or footer. Dealt by the same helper the area tables use, with
   * the lede on the first sheet and the note under the list on the last.
   *
   * The note and the fine print are budgeted out of every sheet rather than
   * only the last, which costs nothing here and keeps the arithmetic one line.
   */
  const sentSheets = sheetGroups(
    roles.sent,
    roleRow,
    SHEET.content - SHEET.heading - ROLE.lede - ROLE.note - ROLE.fine,
    SHEET.content - SHEET.heading - ROLE.note - ROLE.fine,
  );
  const rolesSec = roles.sent.length
    ? sentSheets
        .map((group, n) =>
          section(
            "roles",
            s("fit.roles.heading"),
            `${n === 0 ? `  <p>${esc(s("fit.roles.sent.lede", { count: roles.sent.length }))}</p>\n` : ""}  <ul class="roles">${group
              .map(sentRole)
              .join("")}</ul>${n === sentSheets.length - 1 ? legend("fit.roles.sent.note") : ""}`,
            { sheet: n + 1, sheets: sentSheets.length },
          ),
        )
        .join("\n")
    : // The public pipeline shows at most the three examples `matchPipeline`
      // keeps, each a title and one line under it, so this branch is one sheet.
      roles.pipeline.matching
      ? section(
          "roles",
          s("fit.roles.heading"),
          `  <p>${esc(
            s(meta.targetTitles?.length ? "fit.roles.titles.lede" : "fit.roles.lede", {
              total: roles.pipeline.inCountries,
              matching: roles.pipeline.matching,
              countries,
            }),
          )}</p>
  <ul class="roles">${roles.pipeline.examples
    .map((r) => `<li><span class="r-title">${esc(r.title)}</span><br><span class="r-meta">${esc(r.employer)} · ${esc(r.country)} · ${esc(ddmmyyyy(r.firstSeen))}</span></li>`)
    .join("")}</ul>${legend("fit.roles.note")}`,
        )
      : "";

  /**
   * The report's fine print goes on whichever sheet turns out to be the last
   * one. It used to be nailed to the roles page, which takes the fine print
   * out of the report entirely for a candidate whose roles page is absent.
   */
  const withFinePrint = (html: string) => {
    const at = html.lastIndexOf("</section>");
    if (at < 0) return html;
    return `${html.slice(0, at)}  <p class="fit-fine">${esc(s("fit.footer"))}</p>\n${html.slice(at)}`;
  };

  // The paid report describes the person as the coach knows them: their own
  // target titles where they have any, and the questionnaire's broad field
  // only where they have none.
  const titles = meta.targetTitles?.length ? meta.targetTitles.join(", ") : meta.targetRole;
  const metaBits = [titles ? esc(titles) : "", countries ? esc(countries) : ""].filter(Boolean);
  const countryInner = countryFactsBody(meta.targetCountries?.[0], locale, asset);
  // Built by hand rather than through `section()`, because this page has its own
  // title over the photograph and takes no number: numbering counts the scored
  // sections, and the country page sits outside them. It still owes the reader
  // the same furniture as every other sheet, which is the footer below.
  const countrySec = countryInner
    ? `<section class="fit-sec" id="country">
  <img class="fit-logo" src="${asset("/efc-logo.svg")}" alt="">
${countryInner}
  <p class="sec-foot"><span>${esc(s("fit.eyebrow"))} · ${esc(meta.candidate)}</span><span>${esc(meta.targetCountries?.[0] ?? "")}</span></p>
</section>`
    : "";
  // The cover, redesigned 20/11/2026 to match the EU Fit Check report: a dark
  // band with the name, the Fit Report interview scene (clay, a page's main
  // picture), the date and the mark below. Still `.cover`, which the product
  // page's page tiles hide.
  const body = withFinePrint(`  <div class="cover">
    <div class="fc-band">
      <img class="fc-logo" src="${asset("/efc-logo-reversed.svg")}" alt="EU Fit Check by PunProfile">
      <p class="eyebrow">${esc(s("fit.eyebrow"))}</p>
      ${coverName(meta.candidate, { width: COVER.nameW, max: COVER.nameMax, budget: COVER_TEXT.nameBudget })}
      <p class="sub">${metaBits.join(" · ")}</p>
      <p class="cover-line">${esc(s("fit.cover.sub", { count: competencies }))}</p>
      <img class="fc-art" src="${asset("/pricing/pricing-fit-report-interview.jpg")}" alt="">
    </div>
    <p class="cover-date">${esc(s("fit.cover.prepared", { date: today }))}</p>
    <img class="fc-pp" src="${asset("/punprofile-logo.svg")}" alt="PunProfile">
  </div>

${countrySec}
${summary}
${path}
${areas}
${movesSec}
${rolesSec}`);

  const html = document_({
    lang: locale,
    title: `Fit Report — ${meta.candidate}`,
    variant: "fit",
    printLabel: s("report.savePdf"),
    body,
    autoPrint: opts.autoPrint ?? false,
  }).replace("</style>", `${FIT_STYLES}\n${FIT_PAGED_STYLES}\n${COUNTRY_STYLES}\n${UPSELL_STYLES}\n</style>`);

  return html;
}


/* ===================================================================== */
/* PIECES FOR THE FIT REPORT PRODUCT PAGE, 28/10/2026                     */
/* ===================================================================== */

/** A bare document around `body`: the report's own stylesheet, no toolbar, transparent ground. */
function pieceDocument(lang: string, extraCss: string, body: string): string {
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${BRAND_FONT_LINK}
<style>
${STYLES}
${extraCss}
  html, body { background: transparent; padding: 0; margin: 0; overflow: hidden; }
  main { max-width: none; }
</style>
</head>
<body>
<main>
${body}
</main>
</body>
</html>`;
}

/**
 * The book on its own, for the Fit Report page's hero. The same builder the
 * free report uses, so the page and the PDF cannot show two different books.
 */
export function renderBookPreview(locale: Locale, cover: { name: string; sub: string }): string {
  const s = (key: Parameters<typeof t>[0], vars?: Record<string, string | number>) => t(key, locale, vars);
  const dimLabel = (key: string, fallback: string) => dimensionName(key, fallback, locale);
  return pieceDocument(
    locale,
    `${BOOK_STYLES}
  .book { margin: 0; border: 0; background: transparent; --k: .44; --kc: .33; padding: 1.5rem 1rem 2rem; }
  @media (max-width: 900px) { .book { --k: .36; --kc: .27; } }
  @media (max-width: 720px) { .book { --k: .27; --kc: .2; } }
  @media (max-width: 480px) { .book { --k: .3; --kc: .17; } }`,
    bookShowcase(locale, s, dimLabel, cover),
  );
}

/**
 * One page of a rendered Fit Report, cut out of the whole document by section
 * id, as a fixed A4 sheet the page scales down. `html` is a renderFitReport()
 * result; nothing is re-laid-out, so a tile is the real page.
 */
export function fitReportPage(html: string, sectionId: string): string {
  const css = `<style>
  html, body { background: #fff !important; margin: 0; padding: 0; overflow: hidden; }
  body { width: 794px; height: 1123px; padding: 0 !important; box-sizing: border-box; }
  .toolbar, footer, .cover { display: none !important; }
  .fit-sec { display: none !important; }
  .fit-sec#${sectionId} { display: block !important; break-before: auto; margin: 0 !important; box-shadow: none !important; }
  main { max-width: none !important; }
</style>`;
  return html.replace("</head>", `${css}\n</head>`);
}
