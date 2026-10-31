/**
 * Which published roles fit one candidate, for the paid Fit Report. Added
 * 26/10/2026.
 *
 * A role fits when its country is one the candidate named and its title carries
 * a keyword of their role category. Titles are the only role signal the job log
 * holds, so this is a title match and the report says so; it is never presented
 * as an eligibility check, which is the coach's job in the interview.
 */
import { MARKET_ROLES, type MarketRole } from "./content/market-roles.generated";
import { ROLE_KEYWORDS, logCountry, titleMatches } from "./role-keywords";

export interface RoleMatch {
  /** Published roles in the candidate's countries. */
  inCountries: number;
  /** Of those, the ones whose title matches their role category. */
  matching: number;
  /** The newest matching roles, at most three. */
  examples: MarketRole[];
}

export function matchRoles(countries: string[], roleCategory: string | null | undefined): RoleMatch {
  const wanted = new Set(countries.map(logCountry));
  const inCountries = MARKET_ROLES.filter((r) => wanted.has(r.country));
  const matching = roleCategory && ROLE_KEYWORDS[roleCategory]?.length
    ? inCountries.filter((r) => titleMatches(r.title, roleCategory))
    : [];
  return { inCountries: inCountries.length, matching: matching.length, examples: matching.slice(0, 3) };
}

/**
 * Every published role in the candidate's countries whose title matches their
 * role category, newest first, from the last `days` days. The candidate's
 * "Jobs for you" feed. Transparent by construction: country is equal, and a
 * title contains one of the category's words. Not a recommender.
 *
 * Recent only: Paul's rule for the pipeline is that an aged entry is not worth
 * resurfacing, whatever the reason it aged.
 */
export function rolesFor(
  countries: string[],
  roleCategory: string | null | undefined,
  days = 30,
  now = Date.now(),
): MarketRole[] {
  const wanted = new Set(countries.map(logCountry));
  if (!roleCategory || !ROLE_KEYWORDS[roleCategory]?.length || !wanted.size) return [];
  const since = new Date(now - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return MARKET_ROLES.filter((r) => {
    if (!wanted.has(r.country) || r.firstSeen < since) return false;
    return titleMatches(r.title, roleCategory);
  });
}
