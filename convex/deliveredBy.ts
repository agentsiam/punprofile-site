/**
 * A deliverable is marked delivered by the work that delivers it, never by a
 * separate tick.
 *
 * The candidate's page lists their deliverables with a status and a date. When
 * the status waited for a coach to remember a second step, a session that had
 * been held stayed "not started" with an overdue date and a booking button, and
 * a CV the candidate could already download sat under "not started". Paul,
 * 20/11/2026: it has to follow what the coach does on the candidate's record.
 *
 * So two events deliver, and nothing else needs doing:
 * - a call logged or closed as held delivers the session it is linked to,
 *   dated the day of the call;
 * - a release delivers every deliverable its items belong to, dated the
 *   release.
 *
 * The Fit Report is left out on purpose: it is delivered only through
 * `workspace.deliverFitReport`, which charges its tokens in the same
 * transaction. Delivering it here would hand it over without the charge.
 * A cancelled deliverable is left alone, and one already delivered keeps its
 * first date: a correction does not re-date the work.
 */

import type { MutationCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";

export async function deliverWith(
  ctx: MutationCtx,
  deliverableId: Id<"deliverables"> | undefined,
  at: number,
): Promise<boolean> {
  if (!deliverableId) return false;
  const d = await ctx.db.get(deliverableId);
  if (!d || d.kind === "fit_report" || d.status === "delivered" || d.status === "cancelled") return false;
  await ctx.db.patch(deliverableId, { status: "delivered", deliveredAt: at, updatedAt: Date.now() });
  return true;
}

/** A held call delivers the session it is linked to, dated the call. */
export async function deliverHeldCall(ctx: MutationCtx, call: Doc<"consultations">): Promise<boolean> {
  if (call.outcome !== "held") return false;
  return deliverWith(ctx, call.deliverableId, call.heldAt);
}
