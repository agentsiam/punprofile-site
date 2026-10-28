/**
 * The invented candidate behind every public picture of the Fit Report: the
 * page tiles on /products/fit-report and the sample PDFs in /public/samples.
 * Added 28/10/2026.
 *
 * Invented on purpose. No answer, score or role here comes from a real lead,
 * and the cover and every page footer say "sample". Coach notes are left empty
 * so the report draws grey lines in their place (`sampleNotes`): a written note
 * is advice to one person, and an invented one would read as advice to the
 * reader.
 */

import { DIMENSIONS } from "./model";
import { ECRA } from "./ecra";
import { scoreResponse, scoreFull, type ScoringInput, type CompetencyRating } from "./scoring";
import { rankMoves } from "./levers";
import { matchRoles } from "./market-match";
import type { FitReportInput, ReportMeta } from "./report";
import type { Locale } from "./locale";
import { SAMPLE_LABEL } from "./content/home";

export const FIT_SAMPLE_INPUT: ScoringInput = {
  targetCountries: ["Netherlands", "Germany"],
  targetRole: "IT & Software",
  cv: "untailored",
  linkedin: "basic",
  workAuth: "sponsor_no_route",
  englishCefr: "B2",
  stage: "applying",
  timeline: "3_6m",
  portfolio: "partial",
  applicationCount: 10,
};

/**
 * One interview score per competency, in model order, cycling. Chosen so every
 * area has some competencies over its bar and some under, which is what a real
 * first report looks like and what the page needs to show.
 */
const PATTERN = [3.5, 2.5, 2.0, 4.0, 3.0, 1.5, 3.5, 2.5, 4.5, 3.0];

export function fitSampleRatings(): CompetencyRating[] {
  const out: CompetencyRating[] = [];
  let n = 0;
  for (const d of DIMENSIONS) {
    for (const i of d.items) {
      if (i.tier === "proxy") continue;
      const score = PATTERN[n++ % PATTERN.length];
      out.push({ itemKey: i.key, value: score, score });
    }
  }
  return out;
}

export function fitSampleInput(): FitReportInput {
  const profile = scoreResponse(FIT_SAMPLE_INPUT);
  return {
    profile,
    full: scoreFull(profile, fitSampleRatings(), (k) => ECRA[k]?.formula),
    moves: rankMoves(FIT_SAMPLE_INPUT),
    roles: matchRoles(FIT_SAMPLE_INPUT.targetCountries ?? [], FIT_SAMPLE_INPUT.targetRole),
  };
}

export function fitSampleMeta(locale: Locale): ReportMeta {
  return {
    candidate: SAMPLE_LABEL[locale],
    targetCountries: FIT_SAMPLE_INPUT.targetCountries,
    targetRole: FIT_SAMPLE_INPUT.targetRole ?? undefined,
  };
}
