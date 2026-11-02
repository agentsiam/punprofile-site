/**
 * The token wallet, Fit Report reservations and the ฿1,500 pack entitlements,
 * as one pure calculation. 02/11/2026.
 *
 * The rules are `01_Project_Foundation.md`, Fit Report and the token wallet;
 * how the data holds them is `lifecycle-data-model.md` § 7a. Both the CRM
 * (`workspace.forLead`) and the candidate's own page (`portal.ts`) read this
 * one function, so the two can never show different figures.
 *
 * Nothing here is stored. The balance is the sum of `tokenLedger`, which stays
 * exactly as it was: a reservation writes no ledger row. It is derived from a
 * `fit_report` deliverable carrying `reservedAt`, which only an explicit
 * selection sets, so a report started before reservations existed is not
 * counted until it has been reconciled and selected.
 */

import { TOKEN_PRICE } from "./tokenPrices";
import { PACKS } from "./content/pricing";

/** The pack that carries the complimentary preview and the CV rewrite. */
export const ENTITLEMENT_PACK_THB = PACKS.find((p) => p.id === "serious")!.thb;

/** Calendar days after the last included document before the coaching closes. */
export const COACHING_CLOSE_DAYS = 7;
const DAY = 24 * 60 * 60 * 1000;

export type LedgerRow = {
  delta: number;
  reason: string;
  deliverableId?: string;
  engagementId?: string;
  at: number;
};

export type DeliverableRow = {
  _id: string;
  kind: string;
  status: "not_started" | "in_progress" | "delivered" | "cancelled";
  deliveredAt?: number;
  createdAt: number;
  reservedAt?: number;
  cancelledAt?: number;
  entitlement?: "pack_preview" | "pack_cv_rewrite";
  forFitReport?: string;
  promiseNote?: string;
  errorReports?: { reportedAt: number; summary: string; resolvedAt?: number }[];
};

export type EngagementRow = {
  _id: string;
  module: string;
  status: string;
  agreedThb?: number;
  agreedAt?: number;
  createdAt: number;
};

const SOLD = new Set(["agreed", "active", "completed"]);

/** A deliverable has been charged if any negative ledger row points at it. */
export function chargedIds(ledger: LedgerRow[]) {
  return new Set(ledger.filter((r) => r.delta < 0 && r.deliverableId).map((r) => r.deliverableId!));
}

/** A selection still holding its 20 tokens. */
export function isOpenReservation(d: DeliverableRow, charged: Set<string>) {
  return (
    d.kind === "fit_report" &&
    d.reservedAt !== undefined &&
    d.status !== "delivered" &&
    d.status !== "cancelled" &&
    !charged.has(d._id)
  );
}

export type Wallet = ReturnType<typeof computeWallet>;

export function computeWallet(
  ledger: LedgerRow[],
  deliverables: DeliverableRow[],
  engagements: EngagementRow[],
  now: number,
) {
  let bought = 0;
  let spent = 0;
  for (const r of ledger) {
    if (r.delta > 0) bought += r.delta;
    else spent += -r.delta;
  }
  const balance = bought - spent;
  const charged = chargedIds(ledger);

  const reservations = deliverables.filter((d) => isOpenReservation(d, charged));
  const reserved = reservations.length * TOKEN_PRICE.fitReport;
  const spendable = Math.max(0, balance - reserved);
  /** Shown before selecting: what is missing to reserve a Fit Report now. */
  const selectionShortfall = reservations.length
    ? 0
    : Math.max(0, TOKEN_PRICE.fitReport - spendable);
  /** Shown on an existing reservation: the balance is below what is reserved. */
  const reservationShortfall = Math.max(0, reserved - balance);

  const unfinishedUnselected = deliverables.filter(
    (d) =>
      d.kind === "fit_report" &&
      d.reservedAt === undefined &&
      d.status !== "delivered" &&
      d.status !== "cancelled" &&
      !charged.has(d._id),
  );
  const deliveredUncharged = deliverables.filter(
    (d) => d.kind === "fit_report" && d.status === "delivered" && !charged.has(d._id),
  );

  // ---- the ฿1,500 pack, read only from a recorded sale
  const packSale = engagements
    .filter((e) => e.module === "token_pack" && SOLD.has(e.status) && e.agreedThb === ENTITLEMENT_PACK_THB)
    .sort((a, b) => (a.agreedAt ?? a.createdAt) - (b.agreedAt ?? b.createdAt))[0];
  const packTokens = PACKS.find((p) => p.id === "serious")!.tokens;
  const unrecordedPackPurchase =
    !packSale && ledger.some((r) => r.reason === "purchase" && r.delta === packTokens && !r.engagementId);

  const live = (d: DeliverableRow) => d.status !== "cancelled";
  const previews = deliverables.filter((d) => d.entitlement === "pack_preview" && live(d));
  const preview = previews[0];
  const cvs = deliverables.filter((d) => d.entitlement === "pack_cv_rewrite" && live(d));
  const cv = cvs[0];

  // ---- closure, computed, never stored
  const included = [...previews, ...cvs];
  const openErrors = included.reduce(
    (n, d) => n + (d.errorReports ?? []).filter((e) => e.resolvedAt === undefined).length,
    0,
  );
  let closure:
    | { state: "not_started" }
    | { state: "open"; waitingFor: ("preview" | "cv_rewrite" | "error_reports")[] }
    | { state: "closing"; closesAt: number }
    | { state: "closed"; closedAt: number };
  if (!packSale || !preview) closure = { state: "not_started" };
  else {
    const waitingFor: ("preview" | "cv_rewrite" | "error_reports")[] = [];
    if (preview.status !== "delivered") waitingFor.push("preview");
    if (cvs.some((d) => d.status !== "delivered")) waitingFor.push("cv_rewrite");
    if (openErrors > 0) waitingFor.push("error_reports");
    if (waitingFor.length) closure = { state: "open", waitingFor };
    else {
      const last = Math.max(...included.map((d) => d.deliveredAt ?? 0));
      const closesAt = last + COACHING_CLOSE_DAYS * DAY;
      closure = now >= closesAt ? { state: "closed", closedAt: closesAt } : { state: "closing", closesAt };
    }
  }

  const entitlements = {
    pack: packSale ? { engagementId: packSale._id, agreedAt: packSale.agreedAt ?? null } : null,
    unrecordedPackPurchase,
    preview: !packSale
      ? ("not_eligible" as const)
      : !preview
        ? ("owed_not_scheduled" as const)
        : preview.status === "delivered"
          ? ("delivered" as const)
          : ("scheduled" as const),
    cvRewrite: cv
      ? cv.status === "delivered"
        ? ("delivered" as const)
        : ("owed" as const)
      : ("not_owed" as const),
    cvKeptByPromise: cv?.promiseNote ?? null,
    closure,
    openErrorReports: openErrors,
  };

  const flags: string[] = [];
  if (unfinishedUnselected.length) flags.push("unfinished_fit_report_not_selected");
  if (reservationShortfall > 0) flags.push("reservation_shortfall");
  if (deliveredUncharged.length) flags.push("delivered_fit_report_not_charged");
  if (unrecordedPackPurchase) flags.push("pack_purchase_without_recorded_sale");

  return {
    balance,
    bought,
    spent,
    reserved,
    spendable,
    selectionShortfall,
    reservationShortfall,
    openReservationId: reservations[0]?._id ?? null,
    unfinishedUnselectedIds: unfinishedUnselected.map((d) => d._id),
    entitlements,
    flags,
  };
}

/** Whether a Fit Report selected now earns the CV rewrite. Decided at selection. */
export function cvEarnedBySelectionNow(w: Wallet) {
  return (
    w.entitlements.pack !== null &&
    w.entitlements.cvRewrite === "not_owed" &&
    w.entitlements.closure.state !== "closed"
  );
}
