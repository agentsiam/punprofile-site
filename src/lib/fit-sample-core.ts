/**
 * The invented candidate's answers and interview scores, without the job list.
 * Split out of `fit-sample.ts` on 30/10/2026 so the free report, which is
 * built in the candidate's browser, can draw a page of the sample Fit Report
 * without bundling every published role. See `fit-sample.ts` for why the data
 * is invented.
 */

import { DIMENSIONS } from "./model";
import type { ScoringInput, CompetencyRating } from "./scoring";

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

