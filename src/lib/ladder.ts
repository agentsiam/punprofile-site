/**
 * The milestone ladder on the lead's Delivery page, `prd.md` § 8 and
 * `coaching-delivery-design.md` § 7b.
 *
 * Four rungs in order. Each carries one decision that is ours, whatever the
 * candidate owes before the next rung can start, and what it delivers. A rung
 * is not a date; it is something settled.
 *
 * Pure. The Convex query gathers the records, `src/lib/checklist.ts` decides
 * the fifteen rows, and this groups them under the rungs and names the next
 * step. Nothing here is a second source: a rung's state is read off the same
 * rows the flat checklist always carried, so a tick written against a row
 * still means the same step.
 */

import type { Step } from "./checklist";

export type RungKey = "pack" | "first_call" | "hour" | "closed";

/**
 * The four states of `prd.md` § 8, which `design-system.md` maps onto roles
 * that already exist rather than onto a new colour family:
 *
 * - `done`, no colour, because most rows on a finished engagement are done.
 * - `now`, the selected rung: exactly one, and the only rung with work in it.
 * - `waiting`, outlined, because the coach cannot act on it yet.
 * - `na`, drawn as done without the tick, because it must never read as
 *   achieved.
 */
export type RungState = "done" | "now" | "waiting" | "na";

export type RungSpec = {
  key: RungKey;
  title: string;
  /** What has to be true before the rung starts. */
  entry: string;
  /** The one decision that is ours on this rung. */
  settles: string;
  /** What the candidate owes before the next rung can start. */
  owed: string;
  delivers: string;
  /**
   * The checklist rows that are this rung's evidence, in the order they
   * happen. `coaching-delivery-design.md` § 7b groups them; the numbers stay
   * the checklist's own.
   *
   * The hour reads in happening order rather than in row-number order, which
   * puts the booking first. § 7b's own table reads that way, and the next-step
   * rule requires it: "where the next rung has no call booked, the next step
   * is to book it" only holds if the booking is the rung's first row. The
   * checklist numbered the timeline page 8, "which is where it was written
   * rather than where it happens".
   */
  rows: string[];
};

export const RUNGS: RungSpec[] = [
  {
    key: "pack",
    title: "The sale",
    entry: "The sale is recorded, whatever was sold",
    settles: "None. The access email goes by itself",
    owed: "Nothing",
    delivers: "The sign-in code, and the dashboard",
    rows: ["pack", "signin_sent", "signed_in"],
  },
  {
    key: "first_call",
    title: "The first call, 30 minutes",
    entry: "A 30-minute call is booked",
    settles: "The direction: up to three target titles in priority order, and up to three markets to search",
    owed: "Nothing before it",
    delivers: "The first release: the Fit Report with that direction, the same day",
    rows: ["call1", "call1_notes", "summary_email", "titles", "fit_report"],
  },
  {
    key: "hour",
    title: "The hour",
    entry: "A 60-minute call is booked and the preparation is in",
    settles: "The role family the master CV is written for, which gaps are worth the work, and the matching rules",
    owed: "Their preparation, by its deadline",
    delivers: "The second release: the CV, the action plan and the timeline page",
    rows: ["session_booked", "prep", "session_held", "timeline_shared", "cv_rewrite"],
  },
  {
    key: "closed",
    title: "Closed",
    entry: "Everything included is delivered",
    settles: "None. It is computed",
    owed: "Any correction, inside the window",
    delivers: "Nothing. The service closes and matching continues",
    rows: ["closed"],
  },
];

/**
 * Matching is not a rung. It starts when the first release lands and runs
 * until closure, so it belongs beside the ladder: on it, it would never tick,
 * and a ladder holding a rung that never ticks reads as a delivery that is
 * permanently late.
 */
export const RUNNING_ROWS = ["matched_roles"];

export type Rung = RungSpec & { state: RungState; evidence: Step[] };

/**
 * Where the work is done. The next step is the one thing on the page that can
 * be pressed, so it says where it goes rather than doing something new:
 *
 * - `tick`, the one step the coach still ticks by hand.
 * - `work`, the current rung's own work, which opens inside the rung.
 * - `running`, a panel in the running state beside the ladder, by its id.
 * - `record`, the call log on the Record page.
 */
export type NextAction =
  | { kind: "tick"; label: string }
  | { kind: "work"; target: string; label: string }
  | { kind: "running"; target: string; label: string }
  | { kind: "record"; label: string };

export type NextStep = {
  rung: RungKey;
  /** The checklist row, or null where the rung's entry is itself the step. */
  key: string | null;
  /** What to do, as an instruction rather than as a state. */
  what: string;
  detail: string | null;
  /** True where the candidate owes it and the coach is waiting on them. */
  theirs: boolean;
  action: NextAction;
};

/** What to do about each row, and where that is done. */
const STEP: Record<string, { what: string; theirs?: boolean; action: NextAction }> = {
  pack: {
    what: "Record the sale",
    action: { kind: "running", target: "rs-sold", label: "Open what was sold" },
  },
  signin_sent: {
    what: "Send the dashboard sign-in code",
    action: { kind: "running", target: "rs-wallet", label: "Open their dashboard access" },
  },
  signed_in: {
    what: "They have not signed in yet",
    theirs: true,
    action: { kind: "running", target: "rs-wallet", label: "Open their dashboard access" },
  },
  call1: {
    what: "Hold the 30-minute assessment call, then log its outcome",
    action: { kind: "record", label: "Open the call log" },
  },
  call1_notes: {
    what: "Put the call 1 notes on their dashboard",
    action: { kind: "running", target: "rs-notes", label: "Open the delivery notes" },
  },
  summary_email: {
    what: "Approve the summary email",
    action: { kind: "work", target: "rung-outbox", label: "Open the outbox" },
  },
  titles: {
    what: "Set the target titles, one to three, in priority order",
    action: { kind: "running", target: "rs-titles", label: "Open the target titles" },
  },
  fit_report: {
    what: "Settle every interview area, then deliver the Fit Report",
    action: { kind: "work", target: "rung-fit", label: "Open the Fit Report" },
  },
  session_booked: {
    what: "Send the 60-minute booking link, and let the booking write the call",
    action: { kind: "running", target: "rs-sold", label: "Open what was sold" },
  },
  prep: {
    what: "Their preparation, by its deadline. Request it on LINE, then tick it on the call",
    theirs: true,
    action: { kind: "record", label: "Open the call log" },
  },
  session_held: {
    what: "Hold the 60-minute session, then log its outcome",
    action: { kind: "record", label: "Open the call log" },
  },
  timeline_shared: {
    what: "Build the timeline page and show it in the session",
    action: { kind: "tick", label: "Mark the timeline page shared" },
  },
  cv_rewrite: {
    what: "Deliver the master CV rewrite",
    action: { kind: "running", target: "rs-cvs", label: "Open the CV versions" },
  },
  closed: {
    what: "Nothing to do. Coaching closes itself once the correction window has passed",
    theirs: true,
    action: { kind: "running", target: "rs-entitlements", label: "Open the entitlements" },
  },
};

/** The 30-minute call the first call rung cannot start without. */
const BOOK_FIRST_CALL: Omit<NextStep, "rung"> = {
  key: null,
  what: "Book the 30-minute assessment call",
  detail: "Its Cal.com link is sent at the sale; the booking writes the call",
  theirs: false,
  action: { kind: "record", label: "Open the call log" },
};

function kindOf(evidence: Step[]): "done" | "na" | "open" {
  if (evidence.length === 0 || evidence.every((r) => r.state === "na")) return "na";
  if (evidence.every((r) => r.state === "done" || r.state === "na")) return "done";
  return "open";
}

export type Ladder = {
  rungs: Rung[];
  /** The rung in the `now` state, or null once nothing is open. */
  current: RungKey | null;
  next: NextStep | null;
  /** The rows that run beside the ladder rather than on it. */
  running: Step[];
};

/**
 * The ladder for one candidate.
 *
 * A rung is `na` where every row under it does not apply, which is checked
 * first so a rung that does not apply can never render as done. It is `done`
 * where every row is done or does not apply. Of the rest, the first in order
 * is the current one and is `now`; the ones behind it are `waiting`, because
 * the coach cannot act on them until it is finished.
 *
 * `firstCallBooked` is read from the call log: the first call rung has no
 * "booked" row of its own, and its entry is a booking.
 */
export function ladder(rows: Step[], { firstCallBooked }: { firstCallBooked: boolean }): Ladder {
  const by = new Map(rows.map((r) => [r.key, r]));
  const pick = (keys: string[]) =>
    keys.flatMap((k) => {
      const row = by.get(k);
      return row ? [row] : [];
    });

  const grouped = RUNGS.map((spec) => ({ spec, evidence: pick(spec.rows) }));
  const kinds = grouped.map((g) => kindOf(g.evidence));
  const currentIndex = kinds.findIndex((k) => k === "open");

  const rungs: Rung[] = grouped.map((g, i) => ({
    ...g.spec,
    evidence: g.evidence,
    state:
      kinds[i] === "na" ? "na" : kinds[i] === "done" ? "done" : i === currentIndex ? "now" : "waiting",
  }));

  const current = currentIndex === -1 ? null : RUNGS[currentIndex].key;
  return { rungs, current, next: nextStep(rungs, current, firstCallBooked), running: pick(RUNNING_ROWS) };
}

/**
 * The first undone thing on the current rung, and where the rung's entry is a
 * booking that has not happened, the booking instead.
 */
function nextStep(rungs: Rung[], current: RungKey | null, firstCallBooked: boolean): NextStep | null {
  if (current === null) return null;
  if (current === "first_call" && !firstCallBooked) return { ...BOOK_FIRST_CALL, rung: current };
  const rung = rungs.find((r) => r.key === current)!;
  const row = rung.evidence.find((r) => r.state === "todo");
  const step = row ? STEP[row.key] : undefined;
  if (!row || !step) return null;
  return {
    rung: current,
    key: row.key,
    what: step.what,
    detail: row.detail,
    theirs: step.theirs ?? false,
    action: step.action,
  };
}
