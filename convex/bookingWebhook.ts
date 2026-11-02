/**
 * Cal.com bookings into the call log. `prd.md` section 8, Booking and
 * rescheduling; `lifecycle-data-model.md` § 7b. Approved by Paul 02/11/2026.
 *
 * The HTTP route in `http.ts` checks the signature and parses the body
 * (`src/lib/calBooking.ts`); `apply` below decides and writes. Nothing is
 * guessed: an event that does not resolve to exactly one lead, one kind of
 * call and, for a change, one existing row, waits in `bookingInbox` for Paul.
 *
 * Every branch is a no-op on a repeat, because Cal.com retries and a request
 * can be replayed: a second BOOKING_CREATED finds its own row, a second
 * reschedule finds the new id already in place, a second cancellation finds
 * the call already cancelled, and an inbox row is written once per booking
 * and trigger.
 */

import { internalMutation, mutation, query, type MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { requireAdmin } from "./leads";
import { purposeOf, INBOX_REASONS, type InboxReason } from "../src/lib/calBooking";

const EVENT = v.object({
  trigger: v.union(v.literal("BOOKING_CREATED"), v.literal("BOOKING_RESCHEDULED"), v.literal("BOOKING_CANCELLED")),
  uid: v.string(),
  rescheduleUid: v.union(v.string(), v.null()),
  startAt: v.number(),
  lengthMinutes: v.union(v.number(), v.null()),
  attendeeEmail: v.union(v.string(), v.null()),
  attendeeName: v.union(v.string(), v.null()),
  createdAt: v.union(v.number(), v.null()),
});

type Event = {
  trigger: "BOOKING_CREATED" | "BOOKING_RESCHEDULED" | "BOOKING_CANCELLED";
  uid: string;
  rescheduleUid: string | null;
  startAt: number;
  lengthMinutes: number | null;
  attendeeEmail: string | null;
  attendeeName: string | null;
  createdAt: number | null;
};

export type ApplyResult =
  | { result: "created"; consultationId: Id<"consultations"> }
  | { result: "rescheduled"; consultationId: Id<"consultations"> }
  | { result: "cancelled"; consultationId: Id<"consultations"> }
  | { result: "unchanged" }
  | { result: "inbox"; reason: InboxReason };

const callByBooking = (ctx: MutationCtx, uid: string) =>
  ctx.db.query("consultations").withIndex("by_cal_booking", (q) => q.eq("calBookingId", uid)).first();

async function toInbox(ctx: MutationCtx, e: Event, reason: InboxReason): Promise<ApplyResult> {
  const seen = await ctx.db
    .query("bookingInbox")
    .withIndex("by_booking", (q) => q.eq("calBookingId", e.uid).eq("trigger", e.trigger))
    .first();
  if (!seen) {
    await ctx.db.insert("bookingInbox", {
      calBookingId: e.uid,
      trigger: e.trigger,
      startAt: e.startAt,
      ...(e.lengthMinutes !== null ? { lengthMinutes: e.lengthMinutes } : {}),
      ...(e.attendeeName !== null ? { attendeeName: e.attendeeName } : {}),
      ...(e.attendeeEmail !== null ? { attendeeEmail: e.attendeeEmail } : {}),
      reason,
      receivedAt: Date.now(),
    });
  }
  return { result: "inbox", reason };
}

/** The one open deliverable a booking serves, or null when none or several fit. */
function servedBy(ds: Doc<"deliverables">[], purpose: "assessment" | "preview"): Doc<"deliverables"> | null {
  const open = ds.filter((d) => d.status !== "delivered" && d.status !== "cancelled");
  const fit =
    purpose === "preview"
      ? open.filter((d) => d.entitlement === "pack_preview")
      : open.filter((d) => d.kind === "fit_report" && d.reservedAt !== undefined);
  return fit.length === 1 ? fit[0] : null;
}

export async function applyCalEvent(ctx: MutationCtx, e: Event): Promise<ApplyResult> {
  const now = Date.now();

  if (e.trigger === "BOOKING_CANCELLED") {
    const call = await callByBooking(ctx, e.uid);
    if (!call) return toInbox(ctx, e, "unknown_booking");
    if (call.outcome !== "scheduled") return { result: "unchanged" };
    await ctx.db.patch(call._id, { outcome: "cancelled", updatedAt: now });
    return { result: "cancelled", consultationId: call._id };
  }

  if (e.trigger === "BOOKING_RESCHEDULED") {
    if (await callByBooking(ctx, e.uid)) return { result: "unchanged" };
    const call = e.rescheduleUid ? await callByBooking(ctx, e.rescheduleUid) : null;
    if (!call) return toInbox(ctx, e, "unknown_booking");
    // The row, its preparation request and the preparation itself are kept;
    // the deadline is computed from heldAt, so it moves with it.
    await ctx.db.patch(call._id, {
      heldAt: e.startAt,
      calBookingId: e.uid,
      ...(e.lengthMinutes !== null ? { durationMinutes: e.lengthMinutes } : {}),
      ...(call.outcome === "cancelled" ? { outcome: "scheduled" as const } : {}),
      updatedAt: now,
    });
    return { result: "rescheduled", consultationId: call._id };
  }

  // BOOKING_CREATED
  if (await callByBooking(ctx, e.uid)) return { result: "unchanged" };
  const purpose = purposeOf(e.lengthMinutes);
  if (!purpose) return toInbox(ctx, e, "unknown_length");
  if (!e.attendeeEmail) return toInbox(ctx, e, "no_email");
  const leads = await ctx.db
    .query("leads")
    .withIndex("by_email", (q) => q.eq("email", e.attendeeEmail!))
    .take(2);
  if (leads.length === 0) return toInbox(ctx, e, "no_lead");
  if (leads.length > 1) return toInbox(ctx, e, "several_leads");
  const lead = leads[0];

  const ds = await ctx.db.query("deliverables").withIndex("by_lead", (q) => q.eq("leadId", lead._id)).collect();
  const served = servedBy(ds, purpose);
  if (served) {
    const calls = await ctx.db
      .query("consultations")
      .withIndex("by_lead_time", (q) => q.eq("leadId", lead._id))
      .collect();
    if (calls.some((c) => c.deliverableId === served._id && c.outcome === "scheduled")) {
      return toInbox(ctx, e, "already_scheduled");
    }
  }

  const consultationId = await ctx.db.insert("consultations", {
    leadId: lead._id,
    type: "engagement",
    outcome: "scheduled",
    heldAt: e.startAt,
    durationMinutes: e.lengthMinutes!,
    bookedAt: e.createdAt ?? now,
    calBookingId: e.uid,
    ...(served ? { deliverableId: served._id } : {}),
    createdBy: "cal.com webhook",
    createdAt: now,
    updatedAt: now,
  });
  return { result: "created", consultationId };
}

/** Called by the HTTP route once the signature has verified. */
export const apply = internalMutation({
  args: { event: EVENT },
  handler: async (ctx, { event }) => applyCalEvent(ctx, event),
});

/** Bookings waiting to be placed, newest first. Coach only. */
export const inbox = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const rows = await ctx.db.query("bookingInbox").withIndex("by_received").order("desc").collect();
    return rows.map((r) => ({
      _id: r._id,
      trigger: r.trigger,
      startAt: r.startAt,
      lengthMinutes: r.lengthMinutes ?? null,
      attendeeName: r.attendeeName ?? null,
      attendeeEmail: r.attendeeEmail ?? null,
      reason: INBOX_REASONS[r.reason],
      receivedAt: r.receivedAt,
    }));
  },
});

/** Paul has logged it by hand or judged it irrelevant. Deletes the row. */
export const clearInbox = mutation({
  args: { id: v.id("bookingInbox") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const row = await ctx.db.get(id);
    if (row) await ctx.db.delete(id);
  },
});
