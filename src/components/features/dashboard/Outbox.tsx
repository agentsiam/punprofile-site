"use client";

/**
 * The outbox on the Session tab, `candidate-situation-handoff.md` § 4.
 *
 * What we are about to say to this candidate, each draft written from the
 * Situation panel plus the event that called for it. The panel lines it was
 * given are shown under every draft, so the coach can see what it was allowed
 * to know before reading what it said.
 *
 * Editing the words here is editing a message. Editing a FACT goes back into
 * the panel through the close form, never into the message alone, and the
 * panel lines below each draft are what make that visible.
 *
 * Email goes when approved. LINE is copied and never sent. A dashboard note
 * becomes a shared note on the candidate's own page.
 */

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import Panel from "./Panel";

const KIND_LABEL: Record<string, string> = {
  session_summary: "Summary email",
  line_after_session: "LINE message",
  dashboard_note: "Note on their page",
  matched_role: "Why this role fits",
  missing_input: "What we still need from them",
  release_ready: "A release is waiting",
  release_reminder: "A reminder that it is still waiting",
};

const CHANNEL_WORD: Record<string, string> = {
  email: "sent by email when you approve it",
  line: "copied, never sent from here",
  dashboard: "put on their own page when you approve it",
};

type Draft = NonNullable<ReturnType<typeof useQuery<typeof api.outbox.forLead>>>["open"][number];

function DraftCard({ d, email }: { d: Draft; email: string | null }) {
  const fill = useMutation(api.outbox.fill);
  const approve = useMutation(api.outbox.approve);
  const discard = useMutation(api.outbox.discard);
  const [editing, setEditing] = useState(false);
  const [subject, setSubject] = useState(d.subject ?? "");
  const [body, setBody] = useState(d.body ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message.replace(/^.*ConvexError: /, "").split("\n")[0] : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const waiting = d.state === "awaiting";

  return (
    <li className="rounded-medium border border-outline-variant p-4" data-testid={`draft-${d.kind}`}>
      <p className="text-label-large text-on-surface">
        {KIND_LABEL[d.kind] ?? d.kind}
        <span className="ml-2 text-body-small font-normal text-on-surface-variant">{CHANNEL_WORD[d.channel]}</span>
      </p>

      {waiting && !editing && (
        <p className="mt-2 text-body-medium text-on-surface-variant">
          Owed, and nothing has written it yet. It is drafted from the panel below plus this session, by whatever reads them.
        </p>
      )}

      {!waiting && !editing && (
        <>
          {d.subject && <p className="mt-2 text-body-medium text-on-surface">{d.subject}</p>}
          <p className="mt-1 whitespace-pre-wrap text-body-medium text-on-surface">{d.body}</p>
        </>
      )}

      {editing && (
        <div className="mt-3 space-y-3">
          {d.channel === "email" && (
            <label className="field-label block">
              Subject
              <input className="field mt-1" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </label>
          )}
          <label className="field-label block">
            The message
            <textarea className="field mt-1" rows={8} value={body} onChange={(e) => setBody(e.target.value)} />
          </label>
        </div>
      )}

      {d.writtenFrom && d.writtenFrom.length > 0 && (
        <details className="mt-3">
          <summary className="cursor-pointer text-body-small text-on-surface-variant">
            Written from {d.writtenFrom.length} panel row{d.writtenFrom.length === 1 ? "" : "s"}
            {d.decisions?.length ? ` and ${d.decisions.length} decision${d.decisions.length === 1 ? "" : "s"}` : ""}
          </summary>
          <ul className="mt-2 space-y-1 text-body-small text-on-surface-variant">
            {d.writtenFrom.map((r) => (
              <li key={r.label}>
                {r.label}: {r.line}
              </li>
            ))}
            {d.decisions?.map((x) => <li key={x}>Decision: {x}</li>)}
          </ul>
        </details>
      )}

      {d.failure && (
        <p role="alert" className="field-support-error mt-2">
          Last send failed: {d.failure}
        </p>
      )}
      {d.channel === "email" && !email && (
        <p className="mt-2 text-body-small text-error">No email address on this record, so this one cannot be sent.</p>
      )}
      {error && (
        <p role="alert" className="field-support-error mt-2">
          {error}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-4">
        {editing ? (
          <>
            <button
              type="button"
              disabled={busy}
              className="btn-filled h-9 px-4 text-label-large"
              onClick={() => void run(() => fill({ id: d._id, body, ...(d.channel === "email" ? { subject } : {}) }))}
            >
              Save the draft
            </button>
            <button type="button" className="text-body-medium text-ink-deep underline" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button type="button" className="btn-outlined h-9 px-4 text-label-large" onClick={() => setEditing(true)}>
              {waiting ? "Write it yourself" : "Edit"}
            </button>
            {d.state === "drafted" && (
              <button
                type="button"
                disabled={busy || (d.channel === "email" && !email)}
                className="btn-filled h-9 px-4 text-label-large"
                onClick={() => void run(() => approve({ id: d._id }))}
              >
                {d.channel === "line" ? "Mark it copied" : "Approve and send"}
              </button>
            )}
            {d.state === "approved" && <span className="text-body-medium text-on-surface-variant">Approved, sending.</span>}
            {d.channel === "line" && d.body && (
              <button
                type="button"
                className="text-body-medium text-ink-deep underline"
                onClick={() => {
                  void navigator.clipboard?.writeText(d.body ?? "");
                  setCopied(true);
                }}
              >
                {copied ? "Copied" : "Copy the text"}
              </button>
            )}
            <button
              type="button"
              disabled={busy}
              className="ml-auto text-body-medium text-ink-deep underline"
              onClick={() => void run(() => discard({ id: d._id }))}
            >
              Throw it away
            </button>
          </>
        )}
      </div>
    </li>
  );
}

export default function Outbox({ leadId }: { leadId: Id<"leads"> }) {
  const o = useQuery(api.outbox.forLead, { leadId });
  if (!o) return null;
  return (
    <Panel
      title="Outbox"
      aside={
        <span className="text-label-medium text-on-surface-variant">
          Written from the Situation panel and the event, nothing else
        </span>
      }
      testid="sx-outbox"
    >
      {o.open.length === 0 ? (
        <p className="text-body-medium text-on-surface-variant">Nothing waiting to go.</p>
      ) : (
        <ul className="space-y-4">
          {o.open.map((d) => (
            <DraftCard key={d._id} d={d} email={o.email} />
          ))}
        </ul>
      )}
      {o.done.length > 0 && (
        <ul className="mt-4 space-y-1 text-body-small text-on-surface-variant" data-testid="outbox-done">
          {o.done.map((d) => (
            <li key={d._id}>
              {KIND_LABEL[d.kind] ?? d.kind}:{" "}
              {d.state === "sent" ? "sent" : d.state === "copied" ? "copied" : "thrown away"}
              {d.sentAt ? `, ${new Date(d.sentAt).toLocaleDateString("en-GB")}` : ""}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
