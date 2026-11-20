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

/* ===================================================== the paid report's page

   The Fit Report's last page is the candidate's own roles first and the public
   pipeline only as a fallback, so the shapes below are what that page reads.
   They live here, with the matcher, and `convex/reportRoles.ts` imports them
   as types alone: a type import is erased, so the Convex bundle still never
   takes the generated role list this module imports. */

/** One role PunProfile screened and sent, as the report prints it. */
export interface SentRoleRow {
  employer: string;
  title: string;
  country: string;
  url: string | null;
  /** Why it was picked for this person, in the words it was sent in. */
  reason: string | null;
  /** They marked it a yes. A "Not for me" never reaches this list. */
  liked: boolean;
}

/** An active target title, as the matcher needs it. */
export interface TargetRow {
  title: string;
  alsoCalled: string[];
  roleCategory: string | null;
  /** Where this title is pursued, or null for every country they named. */
  countries: string[] | null;
}

/** What `convex/reportRoles.ts` returns, and what the report page is built from. */
export interface ReportRoles {
  /** Roles sent to this candidate, newest first, a "Not for me" left out. */
  sent: SentRoleRow[];
  /** The active target titles, in priority order. Empty for a lead with none. */
  targets: TargetRow[];
}

/** The names a target is recognised by: its own title and the rest recruiters use. */
const phrases = (t: TargetRow): string[] =>
  [t.title, ...t.alsoCalled].map((s) => s.trim().toLowerCase()).filter(Boolean);

/**
 * Whether a published role carries one of the candidate's target titles. A
 * posting's title contains the target phrase, which catches "Senior Customer
 * Success Manager (DACH)" for a target of "Customer Success Manager" without
 * matching the other way round, where a short posting title would swallow a
 * long target.
 */
export function titleMatchesTargets(roleTitle: string, targets: TargetRow[]): boolean {
  const t = roleTitle.toLowerCase();
  return targets.some((x) => phrases(x).some((p) => t.includes(p)));
}

/**
 * The public pipeline for the paid report: matched on the candidate's active
 * target titles where they have any, and on the questionnaire's broad field
 * only where they have none.
 *
 * A paying client's titles are the better signal and the field was never meant
 * to carry this weight: "IT & Software" matches no Customer Success, Technical
 * Account Manager or FinOps posting, which is how a client with three live
 * titles was told nothing fit them.
 *
 * Each target is matched inside its own countries where it names them, and
 * inside every country the candidate named where it does not. `inCountries`
 * stays the count across the countries they named, because that is the honest
 * denominator for what we published where they are looking.
 */
export function matchPipeline(
  countries: string[],
  targets: TargetRow[],
  roleCategory: string | null | undefined,
): RoleMatch {
  if (!targets.length) return matchRoles(countries, roleCategory);
  const named = new Set(countries.map(logCountry));
  const inCountries = MARKET_ROLES.filter((r) => named.has(r.country));
  const matching = inCountries.filter((r) =>
    targets.some((t) => {
      const where = t.countries?.length ? new Set(t.countries.map(logCountry)) : named;
      if (!where.has(r.country)) return false;
      return phrases(t).some((p) => r.title.toLowerCase().includes(p));
    }),
  );
  return { inCountries: inCountries.length, matching: matching.length, examples: matching.slice(0, 3) };
}
