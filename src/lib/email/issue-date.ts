/**
 * The issue date in the masthead, derived from when the send runs. 13/11/2026.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS NOT AN ARGUMENT
 * ---------------------------------------------------------------------------
 *
 * A date typed into a caller's arguments is a date that is right once. It was
 * briefly, and the second send would have carried the first send's date with
 * nothing to catch it, because a stale date looks exactly like a correct one.
 * The only reading that cannot go stale is the clock at the moment of sending.
 *
 * ---------------------------------------------------------------------------
 * WHY NOT Intl
 * ---------------------------------------------------------------------------
 *
 * `Intl.DateTimeFormat("th-TH", { timeZone: "Asia/Bangkok" })` is the obvious
 * way and it is the wrong one here. It needs the runtime to ship full ICU data,
 * which a Convex action's isolate is not guaranteed to, and the failure mode is
 * a silent fallback to a Latin date sitting in the middle of a Thai masthead.
 * A wrong date nobody notices is worse than a build error.
 *
 * So the arithmetic is done here. It is safe to do by hand for exactly one
 * reason: **Thailand has no daylight saving and has been UTC+7 since 1920**, so
 * a fixed offset is not an approximation of the zone, it is the zone. Do not
 * copy this helper for a zone where that is untrue.
 */

/** UTC+7, fixed. See above: this is Thailand's only offset, not a simplification. */
const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000;

/**
 * Thai month names, full form. Calendar vocabulary rather than editorial copy,
 * which is why they sit here and not in `src/lib/content/`.
 */
const MONTHS_TH = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

/**
 * The Buddhist era runs 543 years ahead of the common era. Switching the
 * masthead to it is this one constant: `true` prints 2569 where `false` prints
 * 2026. Paul's call, and a one-line change either way.
 */
const USE_BUDDHIST_ERA = false;

/** The issue date as the masthead prints it, for the instant given or for now. */
export function issueDateTh(at: Date = new Date()): string {
  const bangkok = new Date(at.getTime() + BANGKOK_OFFSET_MS);
  const day = bangkok.getUTCDate();
  const month = MONTHS_TH[bangkok.getUTCMonth()];
  const year = bangkok.getUTCFullYear() + (USE_BUDDHIST_ERA ? 543 : 0);
  return `${day} ${month} ${year}`;
}
