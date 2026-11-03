/**
 * Matched roles: the weekly maximum, the pause and the week they count in.
 * `prd.md` § 8, Matched roles. Shared by the CRM, the candidate page and the
 * Convex functions, so the limit is read the same way everywhere.
 */

import { MADRID, wallParts, zonedToUtc } from "./sessionTime";

/** The weekly maximum until the candidate or the coach changes it. */
export const DEFAULT_WEEKLY_MAX = 3;
export const MIN_WEEKLY_MAX = 1;
export const MAX_WEEKLY_MAX = 10;

/** How long after the first role of a day its notice goes, so a batch sent in
 *  one sitting arrives as one email. */
export const NOTICE_DELAY_MS = 15 * 60 * 1000;
/** The hour, Madrid time, a held notice goes the next day. */
export const NOTICE_NEXT_DAY_HOUR = 9;

export function weeklyMaxOf(lead: { matchWeeklyMax?: number } | null | undefined): number {
  return lead?.matchWeeklyMax ?? DEFAULT_WEEKLY_MAX;
}

export function isValidWeeklyMax(n: number): boolean {
  return Number.isInteger(n) && n >= MIN_WEEKLY_MAX && n <= MAX_WEEKLY_MAX;
}

/** Midnight on the Monday that starts `now`'s week, in Madrid. */
export function weekStartMadrid(now: number): number {
  const w = wallParts(now, MADRID);
  const day = new Date(Date.UTC(w.y, w.m - 1, w.d));
  day.setUTCDate(day.getUTCDate() - ((w.weekday + 6) % 7));
  return zonedToUtc(day.getUTCFullYear(), day.getUTCMonth() + 1, day.getUTCDate(), 0, 0, MADRID);
}

/** True when `a` and `b` fall on the same calendar day in Madrid. */
export function sameMadridDay(a: number, b: number): boolean {
  const x = wallParts(a, MADRID);
  const y = wallParts(b, MADRID);
  return x.y === y.y && x.m === y.m && x.d === y.d;
}

/** 09:00 Madrid on the day after `now`. */
export function nextMadridMorning(now: number): number {
  const w = wallParts(now, MADRID);
  const day = new Date(Date.UTC(w.y, w.m - 1, w.d));
  day.setUTCDate(day.getUTCDate() + 1);
  return zonedToUtc(day.getUTCFullYear(), day.getUTCMonth() + 1, day.getUTCDate(), NOTICE_NEXT_DAY_HOUR, 0, MADRID);
}

/**
 * Matched roles sent this week: spends on the ledger since Monday that still
 * point at a role. A withdrawn role loses its link and its token comes back,
 * so it does not count.
 */
export function sentThisWeek(
  ledger: { reason: string; delta: number; at: number; applicationId?: unknown }[],
  now: number,
): number {
  const start = weekStartMadrid(now);
  return ledger.filter((r) => r.reason === "matched_role" && r.delta < 0 && r.at >= start && r.applicationId).length;
}

export type MatchingState = { weeklyMax: number; paused: boolean; sentThisWeek: number };

/** Why a role cannot be sent now, or null when it can. */
export function sendBlock(s: MatchingState): "paused" | "weekly_max" | null {
  if (s.paused) return "paused";
  if (s.sentThisWeek >= s.weeklyMax) return "weekly_max";
  return null;
}
