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

import { ECRA } from "./ecra";
import { scoreResponse, scoreFull } from "./scoring";
import { rankMoves } from "./levers";
import { matchRoles } from "./market-match";
import type { FitReportInput, ReportMeta } from "./report";
import type { Locale } from "./locale";
import { SAMPLE_LABEL } from "./content/home";

export { FIT_SAMPLE_INPUT, fitSampleRatings } from "./fit-sample-core";
import { FIT_SAMPLE_INPUT, fitSampleRatings } from "./fit-sample-core";

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
