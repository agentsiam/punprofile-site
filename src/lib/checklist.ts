/**
 * The coach's delivery checklist on the Session tab, `prd.md` § 8. One row per
 * step in the order a candidate goes through them, each ticked by the record
 * that proves it. Two steps happen outside the app and are ticked by the coach.
 * Pure: the Convex query gathers the records, this decides the rows.
 */

export const MANUAL_STEPS = ["summary_email", "timeline_shared"] as const;
export type ManualStep = (typeof MANUAL_STEPS)[number];

export type StepState = "done" | "todo" | "na" | "ongoing";

export type Step = {
  key: string;
  label: string;
  state: StepState;
  /** When the record that ticks it was made. */
  at: number | null;
  /** A short fact beside the label: a count, a date to come, what is missing. */
  detail: string | null;
  /** True for a step the coach ticks by hand. */
  manual: boolean;
};

export type ChecklistInput = {
  packAt: number | null;
  access: { codeIssuedAt: number | null; codeEmailed: boolean; lastSignInAt: number | null } | null;
  /** Every logged call, oldest first. */
  calls: { heldAt: number; outcome: string; deliverableId: string | null }[];
  firstSharedNoteAt: number | null;
  ticks: Partial<Record<ManualStep, number>>;
  activeTitles: number;
  matching: { weeklyMax: number; paused: boolean; sentThisWeek: number };
  preview: { id: string; status: string; deliveredAt: number | null } | null;
  previewPrepAt: number | null;
  fitReport: { status: string; deliveredAt: number | null } | null;
  cvRewrite: { status: string; deliveredAt: number | null } | null;
  closure: { state: string; closedAt?: number; closesAt?: number };
  now: number;
};

const step = (key: string, label: string, state: StepState, at: number | null = null, detail: string | null = null, manual = false): Step => ({
  key,
  label,
  state,
  at,
  detail,
  manual,
});

export function checklist(i: ChecklistInput): Step[] {
  const previewCalls = i.preview ? i.calls.filter((c) => c.deliverableId === i.preview!.id) : [];
  const firstHeld = i.calls.find((c) => c.outcome === "held" && (!i.preview || c.deliverableId !== i.preview.id));
  const previewBooked = previewCalls.find((c) => c.outcome === "scheduled" || c.outcome === "held");
  const previewHeld = previewCalls.find((c) => c.outcome === "held");
  const previewDone = i.preview?.status === "delivered" ? (i.preview.deliveredAt ?? previewHeld?.heldAt ?? null) : (previewHeld?.heldAt ?? null);
  const noPack = i.packAt === null;

  const rows: Step[] = [
    i.packAt !== null ? step("pack", "Pack recorded", "done", i.packAt) : step("pack", "Pack recorded", "todo", null, "No ฿1,500 sale in the Delivery tab"),
    i.access?.codeEmailed
      ? step("signin_sent", "Dashboard sign-in sent", "done", i.access.codeIssuedAt)
      : step("signin_sent", "Dashboard sign-in sent", "todo", null, i.access ? "Not delivered by email" : "No access granted yet"),
    i.access?.lastSignInAt
      ? step("signed_in", "Signed in", "done", i.access.lastSignInAt)
      : step("signed_in", "Signed in", "todo", null, "Not yet"),
    firstHeld ? step("call1", "Call 1 held", "done", firstHeld.heldAt) : step("call1", "Call 1 held", "todo"),
    i.firstSharedNoteAt !== null
      ? step("call1_notes", "Call 1 notes on the dashboard", "done", i.firstSharedNoteAt)
      : step("call1_notes", "Call 1 notes on the dashboard", "todo", null, "No shared note"),
    i.ticks.summary_email !== undefined
      ? step("summary_email", "Summary email sent", "done", i.ticks.summary_email, null, true)
      : step("summary_email", "Summary email sent", "todo", null, "Tick when sent", true),
    i.activeTitles > 0
      ? step("titles", "Target titles set", "done", null, `${i.activeTitles} active`)
      : step("titles", "Target titles set", "todo", null, "None active"),
    i.ticks.timeline_shared !== undefined
      ? step("timeline_shared", "Timeline page shared", "done", i.ticks.timeline_shared, null, true)
      : step("timeline_shared", "Timeline page shared", "todo", null, "Tick when shared", true),
    step(
      "matched_roles",
      "Matched roles",
      "ongoing",
      null,
      i.matching.paused ? "Paused by request" : `${i.matching.sentThisWeek} of ${i.matching.weeklyMax} this week`,
    ),
  ];

  if (noPack || !i.preview) {
    rows.push(step("session_booked", "1-hour session booked", "na"));
    rows.push(step("prep", "Preparation received", "na"));
    rows.push(step("session_held", "1-hour session held", "na"));
  } else {
    rows.push(
      previewDone !== null || previewBooked
        ? step("session_booked", "1-hour session booked", "done", null, previewBooked && previewBooked.outcome === "scheduled" ? `For ${fmt(previewBooked.heldAt)}` : null)
        : step("session_booked", "1-hour session booked", "todo", null, "Not booked"),
    );
    rows.push(
      i.previewPrepAt !== null ? step("prep", "Preparation received", "done", i.previewPrepAt) : step("prep", "Preparation received", "todo"),
    );
    rows.push(previewDone !== null ? step("session_held", "1-hour session held", "done", previewDone) : step("session_held", "1-hour session held", "todo"));
  }

  rows.push(
    !i.fitReport || i.fitReport.status === "cancelled"
      ? step("fit_report", "Fit Report delivered", "na", null, "Not bought")
      : i.fitReport.status === "delivered"
        ? step("fit_report", "Fit Report delivered", "done", i.fitReport.deliveredAt)
        : step("fit_report", "Fit Report delivered", "todo"),
  );
  rows.push(
    !i.cvRewrite
      ? step("cv_rewrite", "CV rewrite delivered", "na", null, "Not owed")
      : i.cvRewrite.status === "delivered"
        ? step("cv_rewrite", "CV rewrite delivered", "done", i.cvRewrite.deliveredAt)
        : step("cv_rewrite", "CV rewrite delivered", "todo"),
  );
  rows.push(
    i.closure.state === "closed"
      ? step("closed", "Coaching closed", "done", i.closure.closedAt ?? null)
      : i.closure.state === "closing"
        ? step("closed", "Coaching closed", "todo", null, `Closes ${fmt(i.closure.closesAt ?? i.now)}, after the correction window`)
        : i.closure.state === "not_started"
          ? step("closed", "Coaching closed", "na")
          : step("closed", "Coaching closed", "todo"),
  );
  return rows;
}

/** The first step still to do, which the panel marks as next. */
export function nextStep(rows: Step[]): string | null {
  return rows.find((r) => r.state === "todo")?.key ?? null;
}

function fmt(ms: number): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(ms));
}
