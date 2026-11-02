"use client";

/**
 * The Session tab: everything the coach needs during a call, on one screen.
 * `prd.md` section 8 owns what it shows and in what order; the data is
 * `workspace.session`, computed from the record, nothing stored.
 *
 * The brief is a summary of recorded information. Nothing here is generated,
 * and where the next action, its owner or its date cannot be determined it
 * says unresolved rather than guessing.
 */

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { AGENDAS } from "@/lib/agendas";
import { MADRID, formatIn, fromLocalInput, toLocalInput } from "@/lib/sessionTime";

const LINK = "text-body-medium text-ink-deep underline";
const BTN = "btn-tonal h-10 px-5 text-label-large";
const INPUT = "field mt-1";

const errText = (e: unknown) => {
  const d = (e as { data?: unknown })?.data;
  return typeof d === "string" ? d : e instanceof Error ? e.message : "Something went wrong.";
};

function Panel({ title, aside, children, testid }: { title: string; aside?: React.ReactNode; children: React.ReactNode; testid?: string }) {
  return (
    <section className="rounded-large border border-outline-variant p-5" data-testid={testid}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-title-medium text-on-surface">{title}</h3>
        {aside}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

const KIND: Record<string, string> = {
  fit_report: "Fit Report assessment",
  coaching_session: "Coaching session",
  base_cv: "Master CV",
};
const label = (d: { kind: string; entitlement?: string; title?: string }) =>
  d.entitlement === "pack_preview"
    ? "Complimentary coaching preview"
    : d.entitlement === "pack_cv_rewrite"
      ? "Master CV rewrite (pack)"
      : (d.title ?? KIND[d.kind] ?? d.kind.replace(/_/g, " "));

const EXCEPTION_LABEL: Record<string, string> = {
  unfinished_fit_report_not_selected: "Unfinished Fit Report from before reservations: select it or cancel it.",
  reservation_shortfall: "The balance is below what is reserved.",
  delivered_fit_report_not_charged: "A delivered Fit Report was never charged.",
  pack_purchase_without_recorded_sale: "33-token purchase with no recorded ฿1,500 sale.",
  preparation_missing_at_deadline: "Preview preparation missing at its deadline. The booking and tokens are unchanged; decide whether to reschedule.",
  open_error_reports: "Open factual-error reports on a complimentary document.",
};

const ZONES: string[] = (() => {
  try {
    return (Intl as unknown as { supportedValuesOf(k: string): string[] }).supportedValuesOf("timeZone");
  } catch {
    return [MADRID, "Asia/Bangkok"];
  }
})();

export default function SessionTab({ leadId }: { leadId: Id<"leads"> }) {
  const s = useQuery(api.workspace.session, { leadId });
  if (s === undefined) return <p className="text-body-medium text-on-surface-variant">Loading...</p>;
  if (s === null) return <p className="text-body-medium text-error">No lead with that id.</p>;
  return <SessionView leadId={leadId} s={s} />;
}

type S = NonNullable<ReturnType<typeof useQuery<typeof api.workspace.session>>>;

export function SessionView({ leadId, s }: { leadId: Id<"leads">; s: S }) {
  const setZone = useMutation(api.workspace.setLeadTimeZone);
  const setStart = useMutation(api.workspace.setSessionStart);
  const addDecision = useMutation(api.workspace.addDecision);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [replacing, setReplacing] = useState<null | { id: Id<"deliveryNotes">; body: string }>(null);
  const [editing, setEditing] = useState<null | { id: Id<"deliverables">; value: string }>(null);
  const run = async (f: () => Promise<unknown>) => {
    setError(null);
    try {
      await f();
      return true;
    } catch (e) {
      setError(errText(e));
      return false;
    }
  };
  const tz = s.timeZone;
  const both = (ms: number) => (
    <>
      <span data-testid="time-madrid">{formatIn(ms, MADRID)}</span>
      {tz && tz !== MADRID ? (
        <span className="text-on-surface-variant" data-testid="time-candidate">
          {" · candidate: "}
          {formatIn(ms, tz)}
        </span>
      ) : null}
    </>
  );
  const appt = s.nextAppointment;
  const agendaKind = appt?.kind === "fit_report" ? "fit_report" : appt?.kind === "coaching_session" ? "coaching_session" : null;
  const sessions = s.deliverables.filter(
    (d) => (d.kind === "fit_report" || d.kind === "coaching_session") && d.status !== "delivered",
  );
  const w = s.wallet;
  const prep = s.preview?.prep ?? null;
  const prepState = s.preview?.state;
  const unresolved = <em className="not-italic text-error">unresolved</em>;

  return (
    <div className="space-y-5">
      <Panel title="Next appointment" testid="sx-appointment">
        {appt ? (
          <p className="text-body-large text-on-surface">
            {label(appt)}: {both(appt.startsAt!)}
          </p>
        ) : (
          <p className="text-body-medium text-on-surface-variant">Nothing booked.</p>
        )}
        <p className="mt-2 text-body-medium text-on-surface-variant" data-testid="sx-zone">
          Candidate time zone: {tz ?? "not selected by the candidate, times shown in Madrid only"}
        </p>
        <label className="field-label mt-2 block max-w-sm">
          Set on their behalf
          <select
            className={INPUT}
            value={tz ?? ""}
            onChange={(e) => void run(() => setZone({ leadId, timeZone: e.target.value || null }))}
          >
            <option value="">Not selected</option>
            {ZONES.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </label>
        {sessions.length > 0 && (
          <ul className="mt-4 space-y-2 text-body-medium">
            {sessions.map((d) => (
              <li key={d._id} className="flex flex-wrap items-baseline gap-2">
                <span className="text-on-surface">{label(d)}:</span>
                {editing?.id === d._id ? (
                  <>
                    <input
                      type="datetime-local"
                      className="field field-dense w-auto"
                      value={editing.value}
                      onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                    />
                    <span className="text-on-surface-variant">Madrid time</span>
                    <button
                      type="button"
                      className={LINK}
                      onClick={async () => {
                        const ms = fromLocalInput(editing.value, MADRID);
                        if (ms !== null && (await run(() => setStart({ deliverableId: d._id, startsAt: ms })))) setEditing(null);
                      }}
                    >
                      Save
                    </button>
                    <button type="button" className={LINK} onClick={() => setEditing(null)}>
                      Keep
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-on-surface-variant">{d.startsAt ? both(d.startsAt) : "not booked"}</span>
                    <button
                      type="button"
                      className={LINK}
                      onClick={() =>
                        setEditing({ id: d._id, value: d.startsAt ? toLocalInput(d.startsAt, MADRID) : "" })
                      }
                    >
                      {d.startsAt ? "Reschedule" : "Book"}
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Entitlements" testid="sx-entitlements">
        <p className="text-body-medium text-on-surface">
          {w.balance} tokens · {w.reserved} reserved for Fit Report · {w.spendable} spendable
        </p>
        <p className="text-body-medium text-on-surface-variant">
          Preview: {w.entitlements.preview.replace(/_/g, " ")} · CV rewrite: {w.entitlements.cvRewrite.replace(/_/g, " ")} · Coaching:{" "}
          {w.entitlements.closure.state.replace(/_/g, " ")}
        </p>
      </Panel>

      <Panel title="Brief" aside={<span className="text-label-medium text-on-surface-variant">Summary of recorded information</span>} testid="sx-brief">
        <dl className="grid gap-x-6 gap-y-2 text-body-medium medium:grid-cols-[max-content_1fr]">
          <dt className="text-on-surface-variant">Goal</dt>
          <dd className="text-on-surface">{s.goal.length ? s.goal.join(" · ") : "No active target titles recorded"}</dd>
          <dt className="text-on-surface-variant">Their preparation</dt>
          <dd className="text-on-surface" data-testid="sx-prep">
            {!s.preview
              ? "No complimentary preview on the record"
              : prep
                ? `Roles: ${prep.roles.join(" · ")}. Priorities: ${prep.priorities.join(" · ")}.${prep.vacancyUrls.length ? ` Example vacancies: ${prep.vacancyUrls.length}.` : ""}`
                : prepState?.state === "not_booked"
                  ? "Not sent; the preview is not booked yet"
                  : prepState && "deadline" in prepState && prepState.deadline
                    ? `Not sent. Due ${formatIn(prepState.deadline, MADRID)}`
                    : "Not sent"}
          </dd>
          <dt className="text-on-surface-variant">Evidence</dt>
          <dd className="text-on-surface">
            {s.evidence.cv ? `CV version ${s.evidence.cv.version}, ${s.evidence.cv.label}` : "No CV on the record"} · Fit Report{" "}
            {s.evidence.fitReportShared ? "shared" : "not shared"}
          </dd>
          <dt className="text-on-surface-variant">Unresolved questions</dt>
          <dd className="text-on-surface">
            {[
              s.evidence.fitOpen.length ? `Fit Report items still open: ${s.evidence.fitOpen.map((k) => k.replace(/([A-Z])/g, " $1").toLowerCase()).join(", ")}` : null,
              s.preview && !prep ? "Preview preparation not sent" : null,
              ...s.openErrorReports.map((e) => `Error reported: ${e.summary}`),
            ]
              .filter(Boolean)
              .join(". ") || "None recorded"}
          </dd>
          <dt className="text-on-surface-variant">To confirm</dt>
          <dd className="text-on-surface">
            {prep ? "The role order and priorities they submitted" : "Nothing submitted to confirm"}
          </dd>
          <dt className="text-on-surface-variant">Agenda</dt>
          <dd className="text-on-surface" data-testid="sx-agenda">
            {agendaKind ? (
              <>
                {AGENDAS[agendaKind].title}
                <ul className="mt-1 list-disc pl-5">
                  {AGENDAS[agendaKind].items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </>
            ) : (
              "No session booked, so no agenda"
            )}
          </dd>
        </dl>
      </Panel>

      <Panel title="Decisions" testid="sx-decisions">
        {s.decisions.current.length === 0 ? (
          <p className="text-body-medium text-on-surface-variant">None recorded.</p>
        ) : (
          <ul className="space-y-2 text-body-medium">
            {s.decisions.current.map((d) => (
              <li key={d._id} className="text-on-surface">
                {d.body}{" "}
                <span className="text-on-surface-variant">
                  {formatIn(d.at, MADRID)}
                  {d.supersedes ? " · replaces an earlier decision" : ""}
                </span>{" "}
                <button type="button" className={LINK} onClick={() => setReplacing({ id: d._id as Id<"deliveryNotes">, body: "" })}>
                  Replace
                </button>
                {replacing?.id === d._id && (
                  <span className="mt-2 flex flex-wrap gap-2">
                    <input
                      className="field field-dense w-96"
                      placeholder="The decision that replaces this one"
                      value={replacing.body}
                      onChange={(e) => setReplacing({ ...replacing, body: e.target.value })}
                    />
                    <button
                      type="button"
                      className={LINK}
                      disabled={!replacing.body.trim()}
                      onClick={async () => {
                        if (await run(() => addDecision({ leadId, body: replacing.body, supersedes: d._id as Id<"deliveryNotes">, ...(appt ? { deliverableId: appt._id as Id<"deliverables"> } : {}) })))
                          setReplacing(null);
                      }}
                    >
                      Save replacement
                    </button>
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            className="field field-dense min-w-80 flex-1"
            placeholder="Record a decision"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button
            type="button"
            className={BTN}
            disabled={!draft.trim()}
            onClick={async () => {
              if (await run(() => addDecision({ leadId, body: draft, ...(appt ? { deliverableId: appt._id as Id<"deliverables"> } : {}) }))) setDraft("");
            }}
          >
            Record
          </button>
        </div>
        {s.decisions.history.length > 0 && (
          <details className="mt-3 text-body-medium text-on-surface-variant">
            <summary>Replaced decisions ({s.decisions.history.length})</summary>
            <ul className="mt-2 space-y-1">
              {s.decisions.history.map((d) => (
                <li key={d._id}>
                  <s>{d.body}</s> · {formatIn(d.at, MADRID)}
                </li>
              ))}
            </ul>
          </details>
        )}
      </Panel>

      <Panel title="Deliverables" testid="sx-deliverables">
        <ul className="space-y-1 text-body-medium">
          {s.deliverables.map((d) => (
            <li key={d._id} className="text-on-surface">
              {label(d)}: {d.status.replace(/_/g, " ")}
              {d.deliveredAt ? `, ${formatIn(d.deliveredAt, MADRID)}` : ""}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Next action" testid="sx-next">
        <p className="text-body-large text-on-surface">
          {s.nextAction.what ?? (s.nextAction.owner === null && s.nextAction.by === null ? "No open action" : unresolved)}
        </p>
        {s.nextAction.what && (
          <p className="text-body-medium text-on-surface-variant">
            Who: {s.nextAction.owner ?? unresolved} · By: {s.nextAction.by ? both(s.nextAction.by) : unresolved}
          </p>
        )}
      </Panel>

      <Panel title="Exceptions" testid="sx-exceptions">
        {s.exceptions.length === 0 ? (
          <p className="text-body-medium text-on-surface-variant">None.</p>
        ) : (
          <ul className="space-y-1 text-body-medium text-on-surface">
            {s.exceptions.map((x) => (
              <li key={x}>{EXCEPTION_LABEL[x] ?? x}</li>
            ))}
          </ul>
        )}
      </Panel>
      {error && <p className="text-body-medium text-error">{error}</p>}
    </div>
  );
}
