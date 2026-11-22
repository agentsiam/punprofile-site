"use client";

/**
 * The running state, beside the ladder rather than on it, `prd.md` § 8. None of
 * it completes, which is why none of it is a rung.
 *
 * Dashboard access, the wallet with the entitlements and the Fit Report
 * reservation, what was sold, the target titles, the CV versions, the job
 * tracker and the delivery notes are `DeliveryWorkspace`'s own panels. This
 * file adds the four parts that were not its: the evening run's roles, the one
 * checklist row that runs rather than ticks, the exceptions, and the
 * corrections reported against something already released.
 *
 * The wallet, the entitlements and the reservation come from the one
 * calculation the candidate's own page also reads, so the two cannot disagree.
 */

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { MADRID, formatIn } from "@/lib/sessionTime";
import { MATCH_FEEDBACK_REASONS } from "@/lib/content/matchFeedback";
import Panel from "./Panel";
import { WorkspacePanels } from "./DeliveryWorkspace";

export default function RunningState({ leadId }: { leadId: Id<"leads"> }) {
  return (
    <section aria-label="The running state" className="space-y-5">
      <p className="text-body-medium text-on-surface-variant">
        Beside the ladder because none of it completes. Matching starts when the first release lands and runs until
        coaching closes.
      </p>
      <WorkspacePanels leadId={leadId} />
      <Matching leadId={leadId} />
      <FoundRoles leadId={leadId} />
      <OpenItems leadId={leadId} />
    </section>
  );
}

/**
 * The checklist row that is not a tick. On the ladder it would never tick, and
 * a ladder holding a rung that never ticks reads as a delivery that is
 * permanently late (`coaching-delivery-design-system.md` § 7b). The weekly maximum,
 * the pause and the send form itself are in the job tracker above.
 */
function Matching({ leadId }: { leadId: Id<"leads"> }) {
  const c = useQuery(api.checklist.forLead, { leadId });
  if (!c) return null;
  const rows = c.rows.filter((r) => r.state === "ongoing");
  if (rows.length === 0) return null;
  return (
    <Panel title="Running, and not a rung" testid="rs-running">
      <ul className="space-y-1">
        {rows.map((r) => (
          <li key={r.key} className="flex flex-wrap items-center gap-3" data-testid={`check-${r.key}`}>
            <span
              aria-label="Ongoing"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-pale text-label-medium text-on-cyan-pale"
            >
              ↻
            </span>
            <span className="text-body-medium text-on-surface">{r.label}</span>
            <span className="text-body-small text-on-surface-variant">{r.detail}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/**
 * The exceptions, and the corrections reported against a released item.
 *
 * An exception needs a judgement and changes no booking and no tokens. It
 * still shows as unresolved where the action, the owner or the date cannot be
 * determined from the record. The routine open items are not here any more:
 * the ladder's next step is what they became.
 */
function OpenItems({ leadId }: { leadId: Id<"leads"> }) {
  const s = useQuery(api.workspace.session, { leadId });
  if (!s) return null;
  const exceptions = s.items.filter((i) => i.exception);
  const unresolved = <em className="not-italic text-error">unresolved</em>;
  return (
    <>
      <Panel title="Exceptions" testid="rs-exceptions">
        {exceptions.length === 0 ? (
          <p className="text-body-medium text-on-surface-variant">None.</p>
        ) : (
          <ul className="space-y-1 text-body-medium text-on-surface">
            {exceptions.map((x) => (
              <li key={x.key}>
                {x.what} · Who: {x.owner ?? unresolved} · By: {x.by ? formatIn(x.by, MADRID) : unresolved}
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <Panel title="Corrections to put right" testid="rs-corrections">
        {s.openErrorReports.length === 0 ? (
          <p className="text-body-medium text-on-surface-variant">None reported.</p>
        ) : (
          <ul className="space-y-1 text-body-medium text-on-surface">
            {s.openErrorReports.map((e) => (
              <li key={`${e.deliverableId}-${e.index}`}>{e.summary}</li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-body-medium text-on-surface-variant">
          A correction is marked put right on the release that carries the item.
        </p>
      </Panel>
    </>
  );
}

/**
 * The roles the 18:00 run found for a paying client, each with a Send and a
 * Dismiss. Send works as "Send a matched role" does in the job tracker, with
 * the same weekly maximum, pause and token rules, and asks for a second click
 * before it spends the token.
 */
function FoundRoles({ leadId }: { leadId: Id<"leads"> }) {
  const c = useQuery(api.checklist.forLead, { leadId });
  if (!c) return null;
  return (
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
  );
}

type Found = NonNullable<ReturnType<typeof useQuery<typeof api.checklist.forLead>>>["found"][number];

function FoundRole({ f }: { f: Found }) {
  const send = useMutation(api.checklist.sendFound);
  const dismiss = useMutation(api.checklist.dismissFound);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // A dismissal is feedback too, `job-database-handoff.md` § 3: the same reason
  // ids the candidate picks from. "The posting has closed" is the one that is a
  // fact about the job rather than a preference, and it marks it filled for
  // everyone.
  const [reason, setReason] = useState("");
  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(
        e instanceof Error ? e.message.replace(/^.*ConvexError: /, "").split("\n")[0] : "Something went wrong.",
      );
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
        {[
          [f.location, f.country].filter(Boolean).join(", "),
          `for ${f.targetTitle}`,
          f.postedOn ? `posted ${f.postedOn.split("-").reverse().join("/")}` : "no posting date",
          f.salary ?? "salary not stated",
          `found ${f.foundOn.split("-").reverse().join("/")}`,
        ].join(" · ")}
      </p>
      <p className="mt-2 text-body-medium text-on-surface">{f.matchReason}</p>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <a href={f.jobUrl} target="_blank" rel="noreferrer" className="text-body-medium text-ink-deep underline">
          Open the posting
        </a>
        {confirming ? (
          <>
            {/* Tonal, not filled: the page's one filled button is the next
                step on the ladder, `design-system.md`. */}
            <button
              type="button"
              disabled={busy}
              className="btn-tonal h-9 px-4 text-label-large"
              onClick={() => void run(() => send({ id: f._id }))}
            >
              Confirm: send and spend 1 token
            </button>
            <button type="button" className="text-body-medium text-ink-deep underline" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              disabled={busy}
              className="btn-outlined h-9 px-4 text-label-large"
              onClick={() => setConfirming(true)}
            >
              Send
            </button>
            <select
              className="field field-dense max-w-56"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              aria-label="Why it is being dismissed"
            >
              <option value="">No reason</option>
              {MATCH_FEEDBACK_REASONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label.en}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={busy}
              className="text-body-medium text-ink-deep underline"
              onClick={() => void run(() => dismiss({ id: f._id, ...(reason ? { reason } : {}) }))}
            >
              Dismiss
            </button>
          </>
        )}
      </div>
      {error && <p className="mt-2 text-body-medium text-error">{error}</p>}
    </li>
  );
}
