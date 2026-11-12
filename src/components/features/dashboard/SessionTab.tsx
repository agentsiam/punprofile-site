"use client";

/**
 * The Session tab: one view for a call, `prd.md` section 8. It is
 * assembled from records that already exist, the call log, target titles,
 * the wallet, the candidate's preparation and the same open items the coach
 * queues show, through `workspace.session`. It holds nothing of its own and
 * edits nothing: bookings, decisions and the time zone are changed in the
 * Calls and notes tab, the wallet and deliverables in the Delivery tab.
 *
 * The brief is a summary of recorded information. Nothing here is generated.
 *
 * The one place it acts is the delivery checklist at the top: the coach's two
 * ticks for steps outside the app, and the roles the evening run found, sent or
 * dismissed from here with the same rules as the Delivery tab.
 */

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { AGENDAS } from "@/lib/agendas";
import { MADRID, formatIn } from "@/lib/sessionTime";

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

const TYPE: Record<string, string> = {
  kick_start: "First call",
  engagement: "Paid session",
  follow_up: "Follow-up",
  other: "Call",
};
const label = (d: { kind: string; entitlement?: string | null; title?: string | null }) =>
  d.entitlement === "pack_preview"
    ? "Complimentary coaching preview"
    : d.entitlement === "pack_cv_rewrite"
      ? "Master CV rewrite (pack)"
      : d.kind === "fit_report"
        ? "Fit Report assessment"
        : (d.title ?? d.kind.replace(/_/g, " "));

export default function SessionTab({ leadId }: { leadId: Id<"leads"> }) {
  const s = useQuery(api.workspace.session, { leadId });
  if (s === undefined) return <p className="text-body-medium text-on-surface-variant">Loading...</p>;
  if (s === null) return <p className="text-body-medium text-error">No lead with that id.</p>;
  return (
    <div className="space-y-5">
      <DeliveryChecklist leadId={leadId} />
      <SessionView s={s} />
    </div>
  );
}

const ddmmyyyy = (ms: number) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: MADRID, day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(ms));

const MARK: Record<string, { sign: string; cls: string; label: string }> = {
  done: { sign: "✓", cls: "bg-primary-pale text-on-primary-pale", label: "Done" },
  todo: { sign: "", cls: "border border-outline", label: "To do" },
  na: { sign: "–", cls: "bg-canvas-soft text-on-surface-variant", label: "Does not apply" },
  ongoing: { sign: "↻", cls: "bg-cyan-pale text-on-cyan-pale", label: "Ongoing" },
};

/** The coach's view of every delivery step, and the evening run's roles, `prd.md` § 8. */
function DeliveryChecklist({ leadId }: { leadId: Id<"leads"> }) {
  const c = useQuery(api.checklist.forLead, { leadId });
  const tick = useMutation(api.checklist.tick);
  if (!c) return null;
  return (
    <>
      <Panel
        title="Delivery checklist"
        aside={<span className="text-label-medium text-on-surface-variant">Ticked by the records; two by you</span>}
        testid="sx-checklist"
      >
        <ol className="divide-y divide-outline-variant">
          {c.rows.map((r) => {
            const m = MARK[r.state];
            const isNext = c.next === r.key;
            return (
              <li key={r.key} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2" data-testid={`check-${r.key}`}>
                <span
                  aria-label={m.label}
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-label-medium ${m.cls}`}
                >
                  {m.sign}
                </span>
                <span className={`text-body-medium ${r.state === "na" ? "text-on-surface-variant" : "text-on-surface"}`}>{r.label}</span>
                {isNext && <span className="rounded-full bg-canvas-brand px-2 py-0.5 text-label-small text-on-brand-lime">Next</span>}
                <span className="text-body-small text-on-surface-variant">
                  {[r.at ? ddmmyyyy(r.at) : null, r.detail].filter(Boolean).join(" · ")}
                </span>
                {r.manual && (
                  <button
                    type="button"
                    className="ml-auto text-body-medium text-ink-deep underline"
                    onClick={() => void tick({ leadId, key: r.key as "summary_email" | "timeline_shared", done: r.state !== "done" })}
                  >
                    {r.state === "done" ? "Undo" : "Mark done"}
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      </Panel>
      <Panel
        title="Roles found by the evening run"
        aside={<span className="text-label-medium text-on-surface-variant">{c.spendable} tokens spendable</span>}
        testid="sx-found"
      >
        {c.found.length === 0 ? (
          <p className="text-body-medium text-on-surface-variant">None waiting.</p>
        ) : (
          <ul className="space-y-4">
            {c.found.map((f) => (
              <FoundRole key={f._id} f={f} />
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}

type Found = NonNullable<ReturnType<typeof useQuery<typeof api.checklist.forLead>>>["found"][number];

function FoundRole({ f }: { f: Found }) {
  const send = useMutation(api.checklist.sendFound);
  const dismiss = useMutation(api.checklist.dismissFound);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message.replace(/^.*ConvexError: /, "").split("\n")[0] : "Something went wrong.");
    } finally {
      setBusy(false);
      setConfirming(false);
    }
  };
  return (
    <li className="rounded-medium border border-outline-variant px-4 py-3" data-testid="found-role">
      <p className="text-title-small text-on-surface">
        {f.roleTitle}, {f.employer}
      </p>
      <p className="text-body-small text-on-surface-variant">
        {[[f.location, f.country].filter(Boolean).join(", "), `for ${f.targetTitle}`, f.postedOn ? `posted ${f.postedOn.split("-").reverse().join("/")}` : "no posting date", f.salary ?? "salary not stated", `found ${f.foundOn.split("-").reverse().join("/")}`].join(" · ")}
      </p>
      <p className="mt-2 text-body-medium text-on-surface">{f.matchReason}</p>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <a href={f.jobUrl} target="_blank" rel="noreferrer" className="text-body-medium text-ink-deep underline">
          Open the posting
        </a>
        {confirming ? (
          <>
            <button type="button" disabled={busy} className="btn-filled h-9 px-4 text-label-large" onClick={() => void run(() => send({ id: f._id }))}>
              Confirm: send and spend 1 token
            </button>
            <button type="button" className="text-body-medium text-ink-deep underline" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button type="button" disabled={busy} className="btn-outlined h-9 px-4 text-label-large" onClick={() => setConfirming(true)}>
              Send
            </button>
            <button type="button" disabled={busy} className="text-body-medium text-ink-deep underline" onClick={() => void run(() => dismiss({ id: f._id }))}>
              Dismiss
            </button>
          </>
        )}
      </div>
      {error && <p className="mt-2 text-body-medium text-error">{error}</p>}
    </li>
  );
}

type S = NonNullable<ReturnType<typeof useQuery<typeof api.workspace.session>>>;

export function SessionView({ s }: { s: S }) {
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
  const call = s.nextCall;
  const agendaKind = call?.deliverable?.kind === "fit_report" ? "fit_report" : call?.deliverable?.entitlement === "pack_preview" ? "coaching_session" : null;
  const prep = s.preview?.prep ?? null;
  const prepState = s.preview?.state;
  const unresolved = <em className="not-italic text-error">unresolved</em>;
  const actions = s.items.filter((i) => !i.exception);
  const exceptions = s.items.filter((i) => i.exception);

  return (
    <div className="space-y-5">
      <p className="text-body-medium text-on-surface-variant">
        Below the checklist, read-only. Bookings, decisions and the time zone change in Calls and notes; the wallet and deliverables in Delivery.
      </p>
      <Panel title="Next call" testid="sx-next-call">
        {call ? (
          <p className="text-body-large text-on-surface">
            {call.deliverable ? label(call.deliverable) : (TYPE[call.type] ?? "Call")}: {both(call.heldAt)}
            {call.durationMinutes ? <span className="text-on-surface-variant"> · {call.durationMinutes} min</span> : null}
          </p>
        ) : (
          <p className="text-body-medium text-on-surface-variant">No scheduled call in the call log.</p>
        )}
        <p className="mt-1 text-body-medium text-on-surface-variant" data-testid="sx-zone">
          Candidate time zone: {tz ?? "not selected by the candidate, times shown in Madrid only"}
        </p>
      </Panel>

      <Panel title="Entitlements" testid="sx-entitlements">
        <p className="text-body-medium text-on-surface">
          {s.wallet.balance} tokens · {s.wallet.reserved} reserved for Fit Report · {s.wallet.spendable} spendable
        </p>
        <p className="text-body-medium text-on-surface-variant">
          Preview: {s.wallet.entitlements.preview.replace(/_/g, " ")} · CV rewrite: {s.wallet.entitlements.cvRewrite.replace(/_/g, " ")} ·
          Coaching: {s.wallet.entitlements.closure.state.replace(/_/g, " ")}
        </p>
      </Panel>

      <Panel title="Brief" aside={<span className="text-label-medium text-on-surface-variant">Summary of recorded information</span>} testid="sx-brief">
        <dl className="grid gap-x-6 gap-y-2 text-body-medium medium:grid-cols-[max-content_1fr]">
          <dt className="text-on-surface-variant">Target titles</dt>
          <dd className="text-on-surface">{s.goal.length ? s.goal.join(" · ") : "None active"}</dd>
          <dt className="text-on-surface-variant">Their preparation</dt>
          <dd className="text-on-surface" data-testid="sx-prep">
            {!s.preview ? (
              "No complimentary preview on the record"
            ) : prep ? (
              <ul className="space-y-0.5">
                <li>Priorities: {prep.priorities.join(" · ")}</li>
                {prep.titleChanges ? <li>Title changes asked for: {prep.titleChanges}</li> : null}
                {prep.question ? <li>Their question: {prep.question}</li> : null}
                {prep.vacancyUrls.length ? <li>Example vacancies: {prep.vacancyUrls.length}</li> : null}
              </ul>
            ) : prepState?.state === "not_booked" ? (
              "Not sent; no preview call is logged yet"
            ) : prepState && "deadline" in prepState && prepState.deadline ? (
              `Not sent. Due ${formatIn(prepState.deadline, MADRID)}`
            ) : (
              "Not sent"
            )}
          </dd>
          <dt className="text-on-surface-variant">Evidence</dt>
          <dd className="text-on-surface">
            {s.evidence.cv ? `CV version ${s.evidence.cv.version}, ${s.evidence.cv.label}` : "No CV on the record"} · Fit Report{" "}
            {s.evidence.fitReportShared ? "shared" : "not shared"}
          </dd>
          <dt className="text-on-surface-variant">Unresolved questions</dt>
          <dd className="text-on-surface">
            {[
              s.evidence.fitOpen.length
                ? `Fit Report items still open: ${s.evidence.fitOpen.map((k) => k.replace(/([A-Z])/g, " $1").toLowerCase()).join(", ")}`
                : null,
              ...s.openErrorReports.map((e) => `Error reported: ${e.summary}`),
            ]
              .filter(Boolean)
              .join(". ") || "None recorded"}
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
              "No paid call scheduled, so no agenda"
            )}
          </dd>
        </dl>
      </Panel>

      <Panel title="Decisions" testid="sx-decisions">
        {s.decisions.current.length === 0 ? (
          <p className="text-body-medium text-on-surface-variant">None recorded. Decisions are recorded on their call in Calls and notes.</p>
        ) : (
          <ul className="space-y-1 text-body-medium text-on-surface">
            {s.decisions.current.map((d) => (
              <li key={d._id}>
                {d.body} <span className="text-on-surface-variant">{formatIn(d.at, MADRID)}</span>
              </li>
            ))}
          </ul>
        )}
        {s.decisions.history.length > 0 && (
          <p className="mt-2 text-body-medium text-on-surface-variant">{s.decisions.history.length} replaced, kept in Calls and notes.</p>
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
        {actions.length === 0 ? (
          <p className="text-body-medium text-on-surface-variant">No open action.</p>
        ) : (
          <ul className="space-y-1 text-body-medium text-on-surface">
            {actions.map((a) => (
              <li key={a.key}>
                {a.what} · Who: {a.owner ?? unresolved} · By: {a.by ? both(a.by) : unresolved}
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Exceptions" testid="sx-exceptions">
        {exceptions.length === 0 ? (
          <p className="text-body-medium text-on-surface-variant">None.</p>
        ) : (
          <ul className="space-y-1 text-body-medium text-on-surface">
            {exceptions.map((x) => (
              <li key={x.key}>{x.what}</li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
