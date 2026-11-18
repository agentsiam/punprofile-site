"use client";

/**
 * "Close the session": the coach's one input, `candidate-situation-handoff.md`
 * § 4. One form at the end of a call, the same form for every session type,
 * and the only moment a coach writes the Situation panel.
 *
 * The rows open pre-filled from the panel, so the coach changes what moved and
 * nothing else: only a row whose boxes actually differ is sent, which is what
 * keeps a close from re-dating five rows that nobody touched. Where they are
 * now and what we owe them next are asked every time, because those two move
 * in every session by definition.
 *
 * Where a transcript has been read, its proposals appear above the rows, each
 * one against the value the panel already holds and with what was actually
 * said. Taking one fills that row's boxes; nothing from a transcript lands
 * without that click, because extraction is evidence capture and not proof
 * that every spoken statement was right.
 *
 * About five minutes. It replaces the separate places the same facts used to
 * be typed: a call's free-text notes, the delivery notes and the summary-email
 * tick.
 */

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { ROW_ASKS, ROW_LABEL, SITUATION_ROWS, type SituationRowKey } from "@/lib/situation";
import { MADRID, formatIn } from "@/lib/sessionTime";
import Panel from "./Panel";
import { RowEditor, draftFor, draftFromValue, rowValue, type Draft } from "./SituationPanel";

const TYPE: Record<string, string> = {
  kick_start: "First call",
  engagement: "Paid session",
  follow_up: "Follow-up",
  other: "Call",
};

/** A line of boxes the coach can add to and take away from. */
function Lines({
  label,
  hint,
  rows,
  set,
  add,
  remove,
  dated,
}: {
  label: string;
  hint: string;
  rows: { what: string; dueOn?: string }[];
  set: (i: number, patch: { what?: string; dueOn?: string }) => void;
  add: () => void;
  remove: (i: number) => void;
  dated?: boolean;
}) {
  return (
    <div>
      <p className="field-label">{label}</p>
      <p className="field-support">{hint}</p>
      <ul className="mt-2 space-y-2">
        {rows.map((r, i) => (
          <li key={i} className="flex flex-wrap items-start gap-2">
            <input
              className="field flex-1"
              value={r.what}
              onChange={(e) => set(i, { what: e.target.value })}
              placeholder={dated ? "What they owe us" : "One line"}
            />
            {dated && (
              <input
                className="field w-40"
                value={r.dueOn ?? ""}
                onChange={(e) => set(i, { dueOn: e.target.value })}
                placeholder="2026-11-24"
              />
            )}
            <button type="button" className="mt-2 text-body-small text-ink-deep underline" onClick={() => remove(i)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="mt-2 text-body-medium text-ink-deep underline" onClick={add}>
        Add another
      </button>
    </div>
  );
}

export default function CloseSession({ leadId }: { leadId: Id<"leads"> }) {
  const f = useQuery(api.situation.closeForm, { leadId });
  const sit = useQuery(api.situation.forLead, { leadId });
  const close = useMutation(api.situation.closeSession);
  const closeTask = useMutation(api.situation.closeTask);

  const [open, setOpen] = useState(false);
  const [callId, setCallId] = useState<string>("");
  const [drafts, setDrafts] = useState<Record<string, Draft> | null>(null);
  const [decisions, setDecisions] = useState<{ what: string }[]>([{ what: "" }]);
  const [owes, setOwes] = useState<{ what: string; dueOn: string }[]>([]);
  const [settled, setSettled] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  if (!f || !sit) return null;

  const waiting = f.calls.filter((c) => f.waiting.includes(c._id));
  const chosen = f.calls.find((c) => c._id === callId) ?? waiting[0] ?? f.calls.find((c) => c.ended) ?? null;

  const start = () => {
    const stored = Object.fromEntries(SITUATION_ROWS.map((k) => [k, draftFor(k, sit.situation)])) as Record<string, Draft>;
    setDrafts(stored);
    setDecisions([{ what: "" }]);
    setOwes([]);
    setSettled({});
    setCallId(chosen?._id ?? "");
    setError(null);
    setSaved(null);
    setOpen(true);
  };

  const setDraft = (key: SituationRowKey, k: string, v: string) =>
    setDrafts((d) => (d ? { ...d, [key]: { ...d[key], [k]: v } } : d));

  /** Only the rows whose boxes differ from what is stored, plus the two always asked. */
  const changedRows = (): SituationRowKey[] => {
    if (!drafts) return [];
    return SITUATION_ROWS.filter((k) => {
      if (k === "whereTheyAreNow" || k === "nextFromUs") return true;
      return JSON.stringify(rowValue(k, drafts[k])) !== JSON.stringify(rowValue(k, draftFor(k, sit.situation)));
    });
  };

  const save = async () => {
    if (!drafts || !chosen) return;
    setBusy(true);
    setError(null);
    try {
      const result = await close({
        leadId,
        consultationId: chosen._id,
        rows: changedRows().map((k) => rowValue(k, drafts[k])),
        decisions: decisions.map((d) => d.what).filter((x) => x.trim()),
        candidateOwes: owes.filter((o) => o.what.trim()).map((o) => ({ what: o.what, dueOn: o.dueOn })),
        settled: Object.entries(settled).map(([id, accepted]) => ({ id: id as Id<"situationProposals">, accepted })),
      });
      setSaved(
        `Closed. ${result.changed.length} row${result.changed.length === 1 ? "" : "s"} on the panel, ${result.decisions} decision${
          result.decisions === 1 ? "" : "s"
        }, ${result.tasks} thing${result.tasks === 1 ? "" : "s"} asked of them${
          result.settled ? `, ${result.settled} proposal${result.settled === 1 ? "" : "s"} settled` : ""
        }.`,
      );
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message.replace(/^.*ConvexError: /, "").split("\n")[0] : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const changed = drafts ? changedRows() : [];
  // A proposal with no call of its own belongs to whichever call is being
  // closed: it was read off something about this person either way.
  const openProposals = f.proposals.filter((p) => p.consultationId === null || p.consultationId === chosen?._id);

  return (
    <Panel
      title="Close the session"
      aside={
        <span className="text-label-medium text-on-surface-variant">
          {waiting.length === 0 ? "No call waiting to be written up" : `${waiting.length} waiting to be written up`}
        </span>
      }
      testid="sx-close"
    >
      {saved && (
        <p className="mb-3 text-body-medium text-on-surface" data-testid="close-saved">
          {saved}
        </p>
      )}

      {!open && (
        <>
          <p className="text-body-medium text-on-surface-variant">
            {waiting.length > 0
              ? "The one place the panel, the decisions, what we owe next and what they owe are written. About five minutes."
              : "Every ended call has been written up. Open the form anyway to correct a close."}
          </p>
          {f.openTasks.length > 0 && (
            <ul className="mt-3 space-y-1 text-body-medium text-on-surface" data-testid="close-open-tasks">
              {f.openTasks.map((t) => (
                <li key={t._id}>
                  They owe us: {t.what} · by {t.dueOn.split("-").reverse().join("/")}
                  <button
                    type="button"
                    className="ml-3 text-body-small text-ink-deep underline"
                    onClick={() => void closeTask({ id: t._id, done: true })}
                  >
                    Arrived
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            disabled={f.calls.length === 0}
            className="btn-tonal mt-4 h-9 px-4 text-label-large"
            onClick={start}
          >
            {waiting.length > 0 ? "Close the session" : "Open the form"}
          </button>
          {f.calls.length === 0 && (
            <p className="mt-2 text-body-medium text-on-surface-variant">No call in the log to close. Log it in the call log, on the Record page, first.</p>
          )}
        </>
      )}

      {open && drafts && (
        <div className="space-y-5">
          <label className="field-label block max-w-md">
            The call being closed
            <select className="field mt-1" value={chosen?._id ?? ""} onChange={(e) => setCallId(e.target.value)}>
              {f.calls.map((c) => (
                <option key={c._id} value={c._id}>
                  {TYPE[c.type] ?? "Call"}, {formatIn(c.heldAt, MADRID)}
                  {c.closedAt ? " (already closed)" : c.ended ? "" : " (not ended yet)"}
                </option>
              ))}
            </select>
          </label>

          {openProposals.length > 0 && (
            <div data-testid="close-proposals">
              <p className="field-label">What the recording says changed</p>
              <p className="field-support">
                Read off the call, not applied. Take one and it fills that row below; nothing here reaches the panel on its own.
              </p>
              <ul className="mt-2 space-y-3">
                {openProposals.map((p) => (
                  <li key={p._id} className="rounded-medium border border-outline-variant p-4" data-testid={`proposal-${p.row}`}>
                    <p className="text-label-large text-on-surface">{ROW_LABEL[p.row]}</p>
                    <p className="mt-1 text-body-medium text-on-surface-variant">
                      Now: {p.wasLine ?? "not established"}
                    </p>
                    <p className="text-body-medium text-on-surface">Proposed: {p.line ?? "nothing readable"}</p>
                    {p.quote && <p className="mt-1 text-body-small text-on-surface-variant">Said: &ldquo;{p.quote}&rdquo;</p>}
                    <div className="mt-3 flex flex-wrap items-center gap-4">
                      {settled[p._id] === undefined ? (
                        <>
                          <button
                            type="button"
                            className="btn-outlined h-9 px-4 text-label-large"
                            onClick={() => {
                              setDrafts((d) => (d ? { ...d, [p.row]: draftFromValue(p.proposed) } : d));
                              setSettled((x) => ({ ...x, [p._id]: true }));
                            }}
                          >
                            Take it
                          </button>
                          <button
                            type="button"
                            className="text-body-medium text-ink-deep underline"
                            onClick={() => setSettled((x) => ({ ...x, [p._id]: false }))}
                          >
                            Leave it
                          </button>
                        </>
                      ) : (
                        <span className="text-body-medium text-on-surface-variant">
                          {settled[p._id] ? "Taken, and in the row below" : "Left, and recorded as read and not taken"}
                          <button
                            type="button"
                            className="ml-3 text-body-small text-ink-deep underline"
                            onClick={() => setSettled((x) => { const n = { ...x }; delete n[p._id]; return n; })}
                          >
                            Undo
                          </button>
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="field-label">1. What moved on the panel</p>
            <p className="field-support">
              Pre-filled from the panel. Change only what the session settled; {changed.length} row
              {changed.length === 1 ? "" : "s"} will be saved.
            </p>
            <div className="mt-3 space-y-4">
              {SITUATION_ROWS.map((k) => (
                <div key={k} className="rounded-medium border border-outline-variant p-4" data-testid={`close-row-${k}`}>
                  <p className="text-label-large text-on-surface">
                    {ROW_LABEL[k]}
                    {changed.includes(k) && (
                      <span className="ml-2 rounded-full bg-canvas-brand px-2 py-0.5 text-label-small text-on-brand-lime">
                        {k === "whereTheyAreNow" || k === "nextFromUs" ? "Asked every time" : "Changed"}
                      </span>
                    )}
                  </p>
                  <p className="text-body-small text-on-surface-variant">{ROW_ASKS[k]}</p>
                  <div className="mt-3">
                    <RowEditor rowKey={k} draft={drafts[k]} set={(kk, v) => setDraft(k, kk, v)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Lines
            label="2. Decisions made in the session"
            hint="One line each, as they were agreed. They land on the call in the call log, on the Record page, and are never edited afterwards."
            rows={decisions}
            set={(i, patch) => setDecisions((xs) => xs.map((x, j) => (j === i ? { ...x, ...patch } : x)))}
            add={() => setDecisions((xs) => [...xs, { what: "" }])}
            remove={(i) => setDecisions((xs) => xs.filter((_, j) => j !== i))}
          />

          {chosen && chosen.decisions.length > 0 && (
            <ul className="space-y-1 text-body-medium text-on-surface-variant" data-testid="close-recorded">
              {chosen.decisions.map((d) => (
                <li key={d._id}>Already recorded on this call: {d.body}</li>
              ))}
            </ul>
          )}

          <Lines
            label="3. What they owe us"
            hint="Each with the date it is owed by. It appears on their own page and is reminded once at its date, never again."
            rows={owes}
            set={(i, patch) => setOwes((xs) => xs.map((x, j) => (j === i ? { ...x, ...patch } : x)))}
            add={() => setOwes((xs) => [...xs, { what: "", dueOn: "" }])}
            remove={(i) => setOwes((xs) => xs.filter((_, j) => j !== i))}
            dated
          />

          {error && (
            <p role="alert" className="field-support-error">
              {error}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4">
            <button type="button" disabled={busy || !chosen} className="btn-tonal h-9 px-4 text-label-large" onClick={() => void save()}>
              Save the close
            </button>
            <button type="button" className="text-body-medium text-ink-deep underline" onClick={() => setOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </Panel>
  );
}
