/**
 * Cal.com webhook events, read and checked. `prd.md` section 8, Booking and
 * rescheduling; `lifecycle-data-model.md` § 7b.
 *
 * Pure: no database, so the parsing, the signature check and the decision of
 * what an event means are tested without a deployment. The mutation in
 * `convex/bookingWebhook.ts` does the writing.
 *
 * Payload version 2021-10-20, the version the webhook form offers. Envelope:
 * `triggerEvent`, `createdAt`, `payload`. A reschedule names the booking it
 * replaces in `payload.rescheduleUid`.
 */

export type CalTrigger = "BOOKING_CREATED" | "BOOKING_RESCHEDULED" | "BOOKING_CANCELLED";
export const CAL_TRIGGERS: readonly CalTrigger[] = ["BOOKING_CREATED", "BOOKING_RESCHEDULED", "BOOKING_CANCELLED"];

export type CalEvent = {
  trigger: CalTrigger;
  /** The booking this event is about. On a reschedule, the new booking. */
  uid: string;
  /** On a reschedule only: the booking it replaces. */
  rescheduleUid: string | null;
  startAt: number;
  lengthMinutes: number | null;
  attendeeEmail: string | null;
  attendeeName: string | null;
  /** When Cal.com raised the event, used as `bookedAt` on a new booking. */
  createdAt: number | null;
};

/** Which paid call a booking is, from its length. The two Cal.com links are
 *  30 and 60 minutes (`00_Quick_Facts.md`); anything else is not placed. */
export type CallPurpose = "assessment" | "preview";
export function purposeOf(lengthMinutes: number | null): CallPurpose | null {
  if (lengthMinutes === 30) return "assessment";
  if (lengthMinutes === 60) return "preview";
  return null;
}

const str = (x: unknown): string | null => (typeof x === "string" && x.trim() !== "" ? x.trim() : null);
const time = (x: unknown): number | null => {
  const s = str(x);
  if (!s) return null;
  const t = Date.parse(s);
  return Number.isFinite(t) ? t : null;
};

export type Parsed =
  | { kind: "event"; event: CalEvent }
  | { kind: "ignored"; trigger: string }
  | { kind: "invalid"; why: string };

/** Reads a request body. A trigger outside the three is ignored, not an error:
 *  the webhook form ticks every trigger by default. */
export function parseCalEvent(body: unknown): Parsed {
  if (!body || typeof body !== "object") return { kind: "invalid", why: "not an object" };
  const b = body as Record<string, unknown>;
  const trigger = str(b.triggerEvent);
  if (!trigger) return { kind: "invalid", why: "no triggerEvent" };
  if (!(CAL_TRIGGERS as readonly string[]).includes(trigger)) return { kind: "ignored", trigger };
  const p = b.payload;
  if (!p || typeof p !== "object") return { kind: "invalid", why: "no payload" };
  const pl = p as Record<string, unknown>;
  const uid = str(pl.uid);
  if (!uid) return { kind: "invalid", why: "no uid" };
  const startAt = time(pl.startTime);
  if (startAt === null) return { kind: "invalid", why: "no startTime" };
  const endAt = time(pl.endTime);
  const length =
    typeof pl.length === "number" && pl.length > 0
      ? pl.length
      : endAt !== null && endAt > startAt
        ? Math.round((endAt - startAt) / 60000)
        : null;
  const attendees = Array.isArray(pl.attendees) ? pl.attendees : [];
  const first = (attendees[0] ?? {}) as Record<string, unknown>;
  const email = str(first.email);
  return {
    kind: "event",
    event: {
      trigger: trigger as CalTrigger,
      uid,
      rescheduleUid: trigger === "BOOKING_RESCHEDULED" ? str(pl.rescheduleUid) : null,
      startAt,
      lengthMinutes: length,
      attendeeEmail: email ? email.toLowerCase() : null,
      attendeeName: str(first.name),
      createdAt: time(b.createdAt),
    },
  };
}

const hex = (buf: ArrayBuffer) =>
  Array.from(new Uint8Array(buf), (x) => x.toString(16).padStart(2, "0")).join("");

/** HMAC-SHA256 of the raw body with the shared secret, lowercase hex, in
 *  `x-cal-signature-256`. A `sha256=` prefix is tolerated. Constant-time
 *  comparison. No secret configured means nothing verifies. */
export async function verifyCalSignature(rawBody: string, header: string | null, secret: string | undefined): Promise<boolean> {
  if (!secret || !header) return false;
  const given = header.trim().toLowerCase().replace(/^sha256=/, "");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const expected = hex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody)));
  if (given.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ given.charCodeAt(i);
  return diff === 0;
}

/** Why an event waits for Paul instead of being written. Shown in the queue. */
export const INBOX_REASONS = {
  no_lead: "No lead has this email",
  several_leads: "More than one lead has this email",
  unknown_length: "Not a 30- or 60-minute booking",
  no_email: "The booking has no attendee email",
  unknown_booking: "The call log does not hold the booking this changes",
  already_scheduled: "The call it serves already has a scheduled call in the log",
} as const;
export type InboxReason = keyof typeof INBOX_REASONS;
