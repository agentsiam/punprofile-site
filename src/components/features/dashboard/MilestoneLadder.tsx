"use client";

/**
 * The milestone ladder, first thing under the Situation panel on the lead's
 * Delivery page. `prd.md` § 8 and `coaching-delivery-design.md` § 7b.
 *
 * Four rungs in order, each naming the decision it settled, what the candidate
 * owes and what it delivers, and each showing one of four states. The fifteen
 * delivery checklist rows are the evidence under the rung they belong to,
 * ticked by the records that always ticked them.
 *
 * Two things make this a page rather than a list:
 *
 * - **The next step is the first undone thing on the current rung**, and it is
 *   the only thing on this page that can be pressed. A rung is not pressable.
 *   `Brand_Guidelines.md` reserves the view's one `action` button for it.
 * - **The work of the current rung opens inside it**, never beside it: the
 *   competency ratings under the first call while that call is the rung, the
 *   close form under a call whose end time has passed, the release under the
 *   rung that delivers it, and the outbox where the drafts it produces wait.
 *   A rung that is not current shows what it settled and what it delivered,
 *   and nothing to fill in.
 *
 * The state colours take roles that already exist, per `Brand_Guidelines.md`:
 * `secondary` for now, an outline for waiting, the `line` hairline and
 * `mute-strong` for done, and the same without the tick for not applying.
 * Lateness is words, never colour.
 */

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { AGENDAS } from "@/lib/agendas";
import { MADRID, formatIn } from "@/lib/sessionTime";
import { ladder, type NextAction, type NextStep, type Rung, type RungState } from "@/lib/ladder";
import type { Step } from "@/lib/checklist";
import Panel from "./Panel";
import CloseSession from "./CloseSession";
import Outbox from "./Outbox";
import FitReportWork from "./FitReportWork";
import { ReleasePanel } from "./DeliveryWorkspace";

const ddmmyyyy = (ms: number) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: MADRID, day: "2-digit", month: "2-digit", year: "numeric" }).format(
    new Date(ms),
  );

/** What a scheduled call serves, in the coach's words. */
const TYPE: Record<string, string> = {
  kick_start: "First call",
  engagement: "Paid session",
  follow_up: "Follow-up",
  other: "Call",
};
const servedBy = (d: { kind: string; entitlement?: string | null; title?: string | null }) =>
  d.entitlement === "pack_preview"
    ? "Complimentary coaching preview"
    : d.entitlement === "pack_cv_rewrite"
      ? "Master CV rewrite (pack)"
      : d.kind === "fit_report"
        ? "Fit Report assessment"
        : (d.title ?? d.kind.replace(/_/g, " "));

/**
 * The four states. `now` takes `secondary`, the role that already carries
 * selection and the navigation active indicator, because the current rung is
 * the selected one. `waiting` is an outline with no fill, because the coach
 * cannot act on it. `done` and `na` are the hairline with muted type, and `na`
 * drops the tick so it can never read as achieved.
 */
const STATE: Record<RungState, { label: string; chip: string; sign: string }> = {
  // `line`, which is `outline-variant`, and `mute-strong` type. No colour:
  // most rows on a finished engagement are done, and colouring them spends the
  // page's attention on work that is over.
  done: { label: "Done", chip: "border border-outline-variant text-mute-strong", sign: "✓" },
  // `secondary`, the role that already carries selection states and the
  // navigation active indicator. The current rung is the selected one.
  now: { label: "Now", chip: "bg-secondary text-on-secondary", sign: "●" },
  // `outline`, with no fill, because it waits on something the coach cannot
  // act on. Legible, and not competing.
  waiting: { label: "Waiting", chip: "border border-outline text-mute-strong", sign: "" },
  // As done, without the tick: `prd.md` § 8 requires that it never read as
  // achieved.
  na: { label: "Does not apply", chip: "border border-outline-variant text-mute-strong", sign: "" },
};

/** The evidence row marks, as the flat checklist drew them. */
const MARK: Record<string, { sign: string; cls: string; label: string }> = {
  done: { sign: "✓", cls: "bg-primary-pale text-on-primary-pale", label: "Done" },
  todo: { sign: "", cls: "border border-outline", label: "To do" },
  na: { sign: "–", cls: "bg-canvas-soft text-on-surface-variant", label: "Does not apply" },
  ongoing: { sign: "↻", cls: "bg-cyan-pale text-on-cyan-pale", label: "Ongoing" },
};

function reveal(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  if (el instanceof HTMLDetailsElement) el.open = true;
}

export default function MilestoneLadder({
  leadId,
  onOpenRecord,
}: {
  leadId: Id<"leads">;
  /** The Record page holds the call log, which three steps are done in. */
  onOpenRecord: () => void;
}) {
  const c = useQuery(api.checklist.forLead, { leadId });
  const s = useQuery(api.workspace.session, { leadId });
  const calls = useQuery(api.consultations.listForLead, { leadId });
  const tick = useMutation(api.checklist.tick);

  if (c === undefined || s === undefined || calls === undefined) {
    return <p className="text-body-medium text-on-surface-variant">Loading...</p>;
  }
  if (c === null || s === null) {
    return <p className="text-body-medium text-error">No lead with that id.</p>;
  }

  // The first call rung's entry is a booking, and it has no row of its own for
  // one: row 4 is "Call 1 held". A call that serves the complimentary preview
  // is the hour's, not this one's.
  const previewId = s.preview?._id ?? null;
  const firstCallBooked = calls.some(
    (call) =>
      (call.outcome === "scheduled" || call.outcome === "held") &&
      (previewId === null || call.deliverableId !== previewId),
  );

  const l = ladder(c.rows, { firstCallBooked });

  const press = (action: NextAction) => {
    if (action.kind === "record") return onOpenRecord();
    if (action.kind === "tick") return void tick({ leadId, key: "timeline_shared", done: true });
    reveal(action.target);
  };

  return (
    <section aria-label="The ladder" className="space-y-4">
      <ol className="space-y-4">
        {l.rungs.map((rung, i) => (
          <RungBlock
            key={rung.key}
            n={i + 1}
            leadId={leadId}
            rung={rung}
            next={l.next && l.next.rung === rung.key ? l.next : null}
            onPress={press}
          >
            {rung.state === "now" ? (
              <RungWork leadId={leadId} rung={rung} s={s} />
            ) : null}
          </RungBlock>
        ))}
      </ol>

      {/* A draft release under a current rung that does not deliver one would
          otherwise be unreachable, so it falls back to here. */}
      {l.current !== "first_call" && l.current !== "hour" ? <ReleasePanel leadId={leadId} /> : null}
    </section>
  );
}

function RungBlock({
  n,
  leadId,
  rung,
  next,
  onPress,
  children,
}: {
  n: number;
  leadId: Id<"leads">;
  rung: Rung;
  next: NextStep | null;
  onPress: (a: NextAction) => void;
  children: React.ReactNode;
}) {
  const st = STATE[rung.state];
  return (
    <li
      id={`rung-${rung.key}`}
      data-testid={`rung-${rung.key}`}
      data-state={rung.state}
      className="rounded-large border border-outline-variant p-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="flex items-center gap-3 text-title-medium text-on-surface">
          <span
            aria-hidden
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-label-medium ${st.chip}`}
          >
            {st.sign || n}
          </span>
          {rung.title}
        </h3>
        <span className={`rounded-full px-3 py-0.5 text-label-medium ${st.chip}`}>{st.label}</span>
      </div>

      <dl className="mt-3 grid gap-x-6 gap-y-1 text-body-medium medium:grid-cols-[max-content_1fr]">
        <dt className="text-on-surface-variant">Starts when</dt>
        <dd className="text-on-surface">{rung.entry}</dd>
        <dt className="text-on-surface-variant">{rung.state === "done" ? "It settled" : "It settles"}</dt>
        <dd className="text-on-surface">{rung.settles}</dd>
        <dt className="text-on-surface-variant">They owe</dt>
        <dd className="text-on-surface">{rung.owed}</dd>
        <dt className="text-on-surface-variant">{rung.state === "done" ? "It delivered" : "It delivers"}</dt>
        <dd className="text-on-surface">{rung.delivers}</dd>
      </dl>

      {next ? <NextStepBlock next={next} onPress={onPress} /> : null}
      <Evidence leadId={leadId} rows={rung.evidence} />
      {children}
    </li>
  );
}

/**
 * The next step, and the page's one action button. The button says where the
 * work is done rather than doing it: the step itself is a call to hold, a
 * record to write or a document to deliver, and each of those already has a
 * place on one of the two pages.
 */
function NextStepBlock({ next, onPress }: { next: NextStep; onPress: (a: NextAction) => void }) {
  return (
    <div className="mt-4 rounded-medium bg-canvas-soft px-4 py-3" data-testid="next-step">
      <p className="text-label-medium text-on-surface-variant">
        The next step{next.theirs ? ", which they owe" : ""}
      </p>
      <p className="mt-0.5 text-body-large text-on-surface">{next.what}</p>
      {next.detail ? <p className="text-body-medium text-on-surface-variant">{next.detail}</p> : null}
      <button type="button" className="btn-filled mt-3 h-10 px-5 text-label-large" onClick={() => onPress(next.action)}>
        {next.action.label}
      </button>
    </div>
  );
}

/**
 * The delivery checklist, grouped under its rung. A row is ticked by the
 * record that proves it, with its date; the one row that happens outside the
 * app is ticked by the coach and that tick can be undone; a row that does not
 * apply shows as not applying, never as done.
 */
function Evidence({ leadId, rows }: { leadId: Id<"leads">; rows: Step[] }) {
  if (rows.length === 0) return null;
  return (
    <ol className="mt-4 divide-y divide-outline-variant border-t border-outline-variant">
      {rows.map((r) => {
        const m = MARK[r.state];
        return (
          <li key={r.key} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2" data-testid={`check-${r.key}`}>
            <span
              aria-label={m.label}
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-label-medium ${m.cls}`}
            >
              {m.sign}
            </span>
            <span className={`text-body-medium ${r.state === "na" ? "text-on-surface-variant" : "text-on-surface"}`}>
              {r.label}
            </span>
            <span className="text-body-small text-on-surface-variant">
              {[r.at ? ddmmyyyy(r.at) : null, r.detail].filter(Boolean).join(" · ")}
            </span>
            {r.manual ? <UndoTick leadId={leadId} row={r} /> : null}
          </li>
        );
      })}
    </ol>
  );
}

/** The coach's one hand tick, and the undo the spec keeps on it. */
function UndoTick({ leadId, row }: { leadId: Id<"leads">; row: Step }) {
  const tick = useMutation(api.checklist.tick);
  return (
    <button
      type="button"
      className="ml-auto text-body-medium text-ink-deep underline"
      onClick={() => void tick({ leadId, key: "timeline_shared", done: row.state !== "done" })}
    >
      {row.state === "done" ? "Undo" : "Mark done"}
    </button>
  );
}

type S = NonNullable<ReturnType<typeof useQuery<typeof api.workspace.session>>>;

/**
 * The work of the current rung, inside it.
 *
 * The next call and its agenda sit here for every rung. The first call's own
 * work is the Fit Report, which the interview settles and which that rung
 * delivers; the hour's is the candidate's preparation, which appears as it
 * arrives. The close form, the release and the outbox follow, and each decides
 * for itself whether it has anything to show.
 */
function RungWork({ leadId, rung, s }: { leadId: Id<"leads">; rung: Rung; s: S }) {
  const delivers = rung.key === "first_call" || rung.key === "hour";
  return (
    <div className="mt-5 space-y-4 border-t border-outline-variant pt-5" id="rung-work">
      <p className="text-label-medium text-on-surface-variant">The work of this rung</p>
      <NextCall s={s} />
      {rung.key === "first_call" ? <FitReport leadId={leadId} /> : null}
      {rung.key === "hour" ? <Preparation s={s} /> : null}
      <CloseSession leadId={leadId} />
      {delivers ? <ReleasePanel leadId={leadId} /> : null}
      <div id="rung-outbox">
        <Outbox leadId={leadId} />
      </div>
    </div>
  );
}

function FitReport({ leadId }: { leadId: Id<"leads"> }) {
  return (
    <div id="rung-fit">
      <Panel title="The Fit Report" testid="fit-report-work">
        <FitReportWork leadId={leadId} />
      </Panel>
    </div>
  );
}

function NextCall({ s }: { s: S }) {
  const tz = s.timeZone;
  const call = s.nextCall;
  const agendaKind =
    call?.deliverable?.kind === "fit_report"
      ? "fit_report"
      : call?.deliverable?.entitlement === "pack_preview"
        ? "coaching_session"
        : null;
  return (
    <Panel title="The next call" testid="sx-next-call">
      {call ? (
        <p className="text-body-large text-on-surface">
          {call.deliverable ? servedBy(call.deliverable) : (TYPE[call.type] ?? "Call")}: {formatIn(call.heldAt, MADRID)}
          {tz && tz !== MADRID ? (
            <span className="text-on-surface-variant">
              {" · candidate: "}
              {formatIn(call.heldAt, tz)}
            </span>
          ) : null}
          {call.durationMinutes ? <span className="text-on-surface-variant"> · {call.durationMinutes} min</span> : null}
        </p>
      ) : (
        <p className="text-body-medium text-on-surface-variant">No scheduled call in the call log.</p>
      )}
      <p className="mt-1 text-body-medium text-on-surface-variant" data-testid="sx-zone">
        Candidate time zone: {tz ?? "not selected by the candidate, times shown in Madrid only"}
      </p>
      {agendaKind ? (
        <div className="mt-3" data-testid="sx-agenda">
          <p className="text-body-medium text-on-surface">{AGENDAS[agendaKind].title}</p>
          <ul className="mt-1 list-disc pl-5 text-body-medium text-on-surface-variant">
            {AGENDAS[agendaKind].items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </Panel>
  );
}

/**
 * The candidate's preparation, on the hour's rung as it arrives: their
 * priorities, the title changes they asked for, their example vacancies and
 * their question. Where it is not in, the deadline it is due by.
 */
function Preparation({ s }: { s: S }) {
  const prep = s.preview?.prep ?? null;
  const state = s.preview?.state;
  return (
    <Panel title="Their preparation" testid="sx-prep">
      {!s.preview ? (
        <p className="text-body-medium text-on-surface-variant">No complimentary preview on the record.</p>
      ) : prep ? (
        <dl className="grid gap-x-6 gap-y-1 text-body-medium medium:grid-cols-[max-content_1fr]">
          <dt className="text-on-surface-variant">Priorities</dt>
          <dd className="text-on-surface">{prep.priorities.join(" · ")}</dd>
          {prep.titleChanges ? (
            <>
              <dt className="text-on-surface-variant">Title changes asked for</dt>
              <dd className="text-on-surface">{prep.titleChanges}</dd>
            </>
          ) : null}
          {prep.question ? (
            <>
              <dt className="text-on-surface-variant">Their question</dt>
              <dd className="text-on-surface">{prep.question}</dd>
            </>
          ) : null}
          {prep.vacancyUrls.length ? (
            <>
              <dt className="text-on-surface-variant">Example vacancies</dt>
              <dd className="text-on-surface">
                <ul className="space-y-0.5">
                  {prep.vacancyUrls.map((u) => (
                    <li key={u}>
                      <a href={u} target="_blank" rel="noreferrer" className="text-ink-deep underline">
                        {u}
                      </a>
                    </li>
                  ))}
                </ul>
              </dd>
            </>
          ) : null}
        </dl>
      ) : state?.state === "not_booked" ? (
        <p className="text-body-medium text-on-surface-variant">Not sent; no preview call is logged yet.</p>
      ) : state && "deadline" in state && state.deadline ? (
        <p className="text-body-medium text-on-surface-variant">
          Not sent. Due {formatIn(state.deadline, MADRID)}
          {state.state === "missing_at_deadline" ? ", and its deadline has passed" : ""}
        </p>
      ) : (
        <p className="text-body-medium text-on-surface-variant">Not sent.</p>
      )}
    </Panel>
  );
}
