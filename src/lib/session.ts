/**
 * The computed parts of a paid candidate's calls: the preparation state, the
 * next call, the coach's open items, and current decisions. 02/11/2026.
 * `prd.md` section 8 owns the behaviour, `lifecycle-data-model.md` § 7b the
 * data. Nothing here is stored.
 *
 * Appointments are rows of the call log, `consultations`, and nowhere else.
 * The same `leadItems` feeds the coach queues and the Session tab, so the two
 * can never disagree. Paul conducts every pilot call (`01_Project_Foundation.md`,
 * Coach), so a coach action's owner is Paul; where a date cannot be
 * determined from the record it is `null` and shows as unresolved.
 */

import { preparationDeadline } from "./sessionTime";
import type { Wallet } from "./wallet";

export type SessionDeliverable = {
  _id: string;
  kind: string;
  status: "not_started" | "in_progress" | "delivered" | "cancelled";
  entitlement?: "pack_preview" | "pack_cv_rewrite";
  title?: string;
  deliveredAt?: number;
  errorReports?: { resolvedAt?: number }[];
};

export type Call = {
  _id: string;
  type: string;
  outcome: string;
  heldAt: number;
  durationMinutes?: number;
  deliverableId?: string;
  prepRequestedAt?: number;
};

export type Preparation = {
  deliverableId: string;
  priorities: string[];
  titleChanges?: string;
  vacancyUrls: string[];
  question?: string;
  submittedAt: number;
};

export type DecisionNote = {
  _id: string;
  body: string;
  at: number;
  by: string;
  consultationId?: string;
  supersedes?: string;
};

export const LIMITS = { priorities: [1, 3], vacancyUrls: [0, 2] } as const;

export function preparationComplete(p: Preparation | undefined) {
  return !!p && p.priorities.length >= LIMITS.priorities[0];
}

/** The complimentary preview, the one call that takes preparation. */
export function previewOf<T extends SessionDeliverable>(ds: T[]): T | undefined {
  return ds.find((d) => d.entitlement === "pack_preview" && d.status !== "cancelled");
}

/** The logged, still-scheduled call for a deliverable, if any. */
export function scheduledCallFor<C extends Call>(calls: C[], deliverableId: string): C | undefined {
  return calls
    .filter((c) => c.deliverableId === deliverableId && c.outcome === "scheduled")
    .sort((a, b) => b.heldAt - a.heldAt)[0];
}

export type PrepState =
  | { state: "not_needed" }
  | { state: "not_booked" }
  | { state: "not_requested"; deadline: number }
  | { state: "waiting"; deadline: number }
  | { state: "complete"; deadline: number | null }
  | { state: "missing_at_deadline"; deadline: number };

export function preparationState(
  ds: SessionDeliverable[],
  calls: Call[],
  preps: Preparation[],
  now: number,
): PrepState {
  const preview = previewOf(ds);
  if (!preview || preview.status === "delivered") return { state: "not_needed" };
  const prep = preps.find((p) => p.deliverableId === preview._id);
  const call = scheduledCallFor(calls, preview._id);
  const deadline = call ? preparationDeadline(call.heldAt) : null;
  if (preparationComplete(prep)) return { state: "complete", deadline };
  if (deadline === null) return { state: "not_booked" };
  if (now >= deadline) return { state: "missing_at_deadline", deadline };
  if (call!.prepRequestedAt === undefined) return { state: "not_requested", deadline };
  return { state: "waiting", deadline };
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

/** The next logged call still to happen, allowing two hours for one in progress. */
export function nextCall<C extends Call>(calls: C[], now: number): C | null {
  return (
    calls
      .filter((c) => c.outcome === "scheduled" && c.heldAt >= now - 2 * 3600_000)
      .sort((a, b) => a.heldAt - b.heldAt)[0] ?? null
  );
}

export type Item = {
  key:
    | "preview_not_logged"
    | "preparation_not_requested"
    | "preparation_waiting"
    | "preparation_missing_at_deadline"
    | "fit_report_to_deliver"
    | "cv_rewrite_owed"
    | "unfinished_fit_report_not_selected"
    | "reservation_shortfall"
    | "delivered_fit_report_not_charged"
    | "pack_purchase_without_recorded_sale"
    | "open_error_reports";
  what: string;
  owner: "Paul" | "candidate" | null;
  by: number | null;
  /** An exception needs a judgement; an action is routine. */
  exception: boolean;
};

/**
 * Every open item for one paid candidate, most pressing first. The coach
 * queues list these across candidates; the Session tab shows them for one.
 */
export function leadItems(ds: SessionDeliverable[], calls: Call[], preps: Preparation[], wallet: Wallet, now: number): Item[] {
  const out: Item[] = [];
  const preview = previewOf(ds);
  const prep = preparationState(ds, calls, preps, now);
  if (preview && preview.status !== "delivered") {
    if (prep.state === "not_booked") {
      // Agreed by message and logged by hand: the free Calendly plan has one event type.
      out.push({ key: "preview_not_logged", what: "Agree the preview time and log it in the call log", owner: "Paul", by: null, exception: false });
    } else if (prep.state === "not_requested") {
      out.push({ key: "preparation_not_requested", what: "Send the preparation request on LINE, then tick it on the call", owner: "Paul", by: prep.deadline, exception: false });
    } else if (prep.state === "waiting") {
      out.push({ key: "preparation_waiting", what: "Send the preview preparation", owner: "candidate", by: prep.deadline, exception: false });
    } else if (prep.state === "missing_at_deadline") {
      const call = scheduledCallFor(calls, preview._id)!;
      out.push({
        key: "preparation_missing_at_deadline",
        what: "Preview preparation missing at its deadline: decide whether to reschedule. The booking and tokens are unchanged",
        owner: "Paul",
        by: call.heldAt,
        exception: true,
      });
    }
  }
  if (wallet.openReservationId) {
    const call = scheduledCallFor(calls, wallet.openReservationId);
    out.push({ key: "fit_report_to_deliver", what: "Deliver the Fit Report", owner: "Paul", by: call?.heldAt ?? null, exception: false });
  }
  const cv = ds.find((d) => d.entitlement === "pack_cv_rewrite" && d.status !== "delivered" && d.status !== "cancelled");
  if (cv) out.push({ key: "cv_rewrite_owed", what: "Deliver the master CV rewrite", owner: "Paul", by: null, exception: false });
  const flagWhat: Record<string, string> = {
    unfinished_fit_report_not_selected: "A Fit Report from before reservations holds no tokens: select it or cancel it",
    reservation_shortfall: "The balance is below what is reserved",
    delivered_fit_report_not_charged: "A delivered Fit Report was never charged",
    pack_purchase_without_recorded_sale: "A 33-token purchase has no recorded ฿1,500 sale",
  };
  for (const f of wallet.flags) {
    out.push({ key: f as Item["key"], what: flagWhat[f] ?? f, owner: "Paul", by: null, exception: true });
  }
  if (wallet.entitlements.openErrorReports > 0) {
    out.push({ key: "open_error_reports", what: "Resolve the factual errors reported in a complimentary document", owner: "Paul", by: null, exception: true });
  }
  return out;
}
