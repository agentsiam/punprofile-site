/**
 * Time for sessions: zones, the preparation deadline, and calendar files.
 * 02/11/2026. The rules are `prd.md` section 8, Candidate page, preparation
 * and appointments.
 *
 * Every instant is a UTC timestamp. A wall-clock time exists only at the edge:
 * when the coach types a Madrid time, and when a time is shown. The offset is
 * read from the zone database through `Intl` for that very instant, so a
 * daylight-saving change between today and the appointment is never missed.
 */

export const MADRID = "Europe/Madrid";

/** Minutes past 00:00 Madrid on the deadline day. */
const DEADLINE_HOUR = 17;
/** Weekdays before the appointment's Madrid date. */
const DEADLINE_WEEKDAYS = 2;

/** Session lengths, from the agreed agendas in `prd.md` section 8. */
export const SESSION_MINUTES = { fit_report: 30, coaching_session: 60 } as const;

export function isValidTimeZone(tz: string): boolean {
  if (!tz || tz.length > 64) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

type Parts = { y: number; m: number; d: number; h: number; mi: number; s: number; weekday: number };

/** The wall-clock reading of `instant` in `tz`. `weekday` is 0 for Sunday. */
export function wallParts(instant: number, tz: string): Parts {
  const f = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "short",
  });
  const p: Record<string, string> = {};
  for (const x of f.formatToParts(new Date(instant))) p[x.type] = x.value;
  return {
    y: Number(p.year),
    m: Number(p.month),
    d: Number(p.day),
    h: Number(p.hour),
    mi: Number(p.minute),
    s: Number(p.second),
    weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday),
  };
}

/** Calendar days between `then` and `now` in Madrid: 0 today, 1 yesterday. */
export function madridDaysBetween(then: number, now: number): number {
  const a = wallParts(then, MADRID);
  const b = wallParts(now, MADRID);
  return Math.round((Date.UTC(b.y, b.m - 1, b.d) - Date.UTC(a.y, a.m - 1, a.d)) / 86400000);
}

/** Offset of `tz` from UTC at `instant`, in milliseconds. */
export function offsetAt(instant: number, tz: string): number {
  const w = wallParts(instant, tz);
  return Date.UTC(w.y, w.m - 1, w.d, w.h, w.mi, w.s) - Math.floor(instant / 1000) * 1000;
}

/**
 * The instant at which `tz` reads the given wall-clock time. Two passes settle
 * the offset on either side of a change. A time skipped by a spring-forward
 * lands one hour later; a repeated autumn hour takes its first occurrence.
 */
export function zonedToUtc(y: number, m: number, d: number, h: number, mi: number, tz: string): number {
  const naive = Date.UTC(y, m - 1, d, h, mi);
  let t = naive - offsetAt(naive, tz);
  t = naive - offsetAt(t, tz);
  const earlier = naive - offsetAt(t - 3600_000, tz);
  const w = wallParts(earlier, tz);
  if (earlier < t && w.h === h && w.mi === mi && w.d === d) return earlier;
  return t;
}

/** "2026-11-05T09:30", the value a datetime-local input holds, read in `tz`. */
export function toLocalInput(instant: number, tz: string): string {
  const w = wallParts(instant, tz);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${w.y}-${p(w.m)}-${p(w.d)}T${p(w.h)}:${p(w.mi)}`;
}

export function fromLocalInput(value: string, tz: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!m) return null;
  return zonedToUtc(+m[1], +m[2], +m[3], +m[4], +m[5], tz);
}

/**
 * 17:00 Madrid, two weekdays before the appointment's date in Madrid, counting
 * Monday to Friday. Service holidays are not yet counted.
 */
export function preparationDeadline(startsAt: number): number {
  const w = wallParts(startsAt, MADRID);
  // Walk back calendar days on a UTC date, which has no zone of its own.
  const day = new Date(Date.UTC(w.y, w.m - 1, w.d));
  let left = DEADLINE_WEEKDAYS;
  while (left > 0) {
    day.setUTCDate(day.getUTCDate() - 1);
    const wd = day.getUTCDay();
    if (wd !== 0 && wd !== 6) left--;
  }
  return zonedToUtc(day.getUTCFullYear(), day.getUTCMonth() + 1, day.getUTCDate(), DEADLINE_HOUR, 0, MADRID);
}

/** Show an instant in a zone, with the zone's short name, e.g. "Thu 5 Nov 2026, 09:30 CET". */
export function formatIn(instant: number, tz: string, locale: "en" | "th" = "en"): string {
  return new Intl.DateTimeFormat(locale === "th" ? "th-TH" : "en-GB", {
    timeZone: tz,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZoneName: "short",
  }).format(new Date(instant));
}

/**
 * A calendar file. The time is written in UTC with a `Z`, so every calendar
 * shows it in its own zone and nothing floats.
 */
export function icsFor(e: { uid: string; title: string; startsAt: number; minutes: number; url?: string }): string {
  const stamp = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PunProfile//Sessions//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${e.uid}@punprofile.app`,
    `DTSTAMP:${stamp(Date.now())}`,
    `DTSTART:${stamp(e.startsAt)}`,
    `DTEND:${stamp(e.startsAt + e.minutes * 60_000)}`,
    `SUMMARY:${esc(e.title)}`,
    ...(e.url ? [`URL:${e.url}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}
