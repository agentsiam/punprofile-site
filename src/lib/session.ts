/**
 * The Session tab's computed parts, and the preparation state the candidate's
 * page shows. 02/11/2026. `prd.md` section 8 owns the behaviour,
 * `lifecycle-data-model.md` § 7b the data. Nothing here is stored.
 *
 * Where the next action, its owner or its date cannot be determined from the
 * record, that part is `null` and the screen says unresolved. None is invented.
 */

import { preparationDeadline } from "./sessionTime";
import type { Wallet } from "./wallet";

export type SessionDeliverable = {
  _id: string;
  kind: string;
  status: "not_started" | "in_progress" | "delivered" | "cancelled";
  entitlement?: "pack_preview" | "pack_cv_rewrite";
  startsAt?: number;
  deliveredAt?: number;
  bookingUrl?: string;
  title?: string;
  errorReports?: { resolvedAt?: number }[];
};

export type Preparation = {
  deliverableId: string;
  roles: string[];
  priorities: string[];
  vacancyUrls: string[];
  submittedAt: number;
};

export type DecisionNote = { _id: string; body: string; at: number; by: string; deliverableId?: string; supersedes?: string };

export const LIMITS = { roles: [1, 3], priorities: [1, 3], vacancyUrls: [0, 2] } as const;

export function preparationComplete(p: Preparation | undefined) {
  return !!p && p.roles.length >= LIMITS.roles[0] && p.priorities.length >= LIMITS.priorities[0];
}

/** The complimentary preview, the one session that takes preparation. */
export function previewOf<T extends SessionDeliverable>(ds: T[]): T | undefined {
  return ds.find((d) => d.entitlement === "pack_preview" && d.status !== "cancelled");
}

export type PrepState =
  | { state: "not_needed" }
  | { state: "not_booked" }
  | { state: "waiting"; deadline: number }
  | { state: "complete"; deadline: number | null }
  | { state: "missing_at_deadline"; deadline: number };

export function preparationState(ds: SessionDeliverable[], preps: Preparation[], now: number): PrepState {
  const preview = previewOf(ds);
  if (!preview || preview.status === "delivered") return { state: "not_needed" };
  const prep = preps.find((p) => p.deliverableId === preview._id);
  const deadline = preview.startsAt ? preparationDeadline(preview.startsAt) : null;
  if (preparationComplete(prep)) return { state: "complete", deadline };
  if (deadline === null) return { state: "not_booked" };
  return now >= deadline ? { state: "missing_at_deadline", deadline } : { state: "waiting", deadline };
}

/** Current decisions are those nothing supersedes; the rest is history. */
export function decisionsView<T extends DecisionNote>(notes: T[]) {
  const superseded = new Map<string, string>();
  for (const n of notes) if (n.supersedes) superseded.set(n.supersedes, n._id);
  const sorted = [...notes].sort((a, b) => a.at - b.at);
  return {
    current: sorted.filter((n) => !superseded.has(n._id)),
    history: sorted.filter((n) => superseded.has(n._id)).map((n) => ({ ...n, supersededBy: superseded.get(n._id)! })),
  };
}

export type NextAction = { what: string | null; owner: "Paul" | "candidate" | null; by: number | null };

export function nextAppointment<T extends SessionDeliverable>(ds: T[], now: number): T | null {
  return (
    ds
      .filter((d) => d.startsAt !== undefined && d.status !== "delivered" && d.status !== "cancelled")
      .sort((a, b) => a.startsAt! - b.startsAt!)
      .find((d) => d.startsAt! >= now - 2 * 3600_000) ?? null
  );
}

export function nextAction(ds: SessionDeliverable[], preps: Preparation[], wallet: Wallet, now: number): NextAction {
  const preview = previewOf(ds);
  if (preview && preview.status !== "delivered") {
    if (!preview.startsAt) {
      // Who books is not on the record: a booking link means the candidate,
      // otherwise it is unresolved.
      return { what: "Book the complimentary preview", owner: preview.bookingUrl ? "candidate" : null, by: null };
    }
    const prep = preparationState(ds, preps, now);
    if (prep.state === "waiting") return { what: "Send the preview preparation", owner: "candidate", by: prep.deadline };
    if (prep.state === "missing_at_deadline") {
      return { what: "Preparation missing: decide whether to reschedule", owner: "Paul", by: preview.startsAt };
    }
    return { what: "Hold the complimentary preview", owner: "Paul", by: preview.startsAt };
  }
  const fit = ds.find((d) => d._id === wallet.openReservationId);
  if (fit) return { what: "Deliver the Fit Report", owner: "Paul", by: fit.startsAt ?? null };
  const cv = ds.find((d) => d.entitlement === "pack_cv_rewrite" && d.status !== "delivered" && d.status !== "cancelled");
  if (cv) return { what: "Deliver the master CV rewrite", owner: "Paul", by: null };
  if (wallet.unfinishedUnselectedIds.length) return { what: "Reconcile the unfinished Fit Report", owner: "Paul", by: null };
  return { what: null, owner: null, by: null };
}

export function exceptions(ds: SessionDeliverable[], preps: Preparation[], wallet: Wallet, now: number): string[] {
  const out = [...wallet.flags];
  if (preparationState(ds, preps, now).state === "missing_at_deadline") out.push("preparation_missing_at_deadline");
  if (wallet.entitlements.openErrorReports > 0) out.push("open_error_reports");
  return out;
}
