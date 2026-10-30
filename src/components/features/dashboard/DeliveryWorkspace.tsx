"use client";

/**
 * The delivery workspace on the Candidate 360: everything a paying candidate
 * gets after the sale, worked from one place.
 *
 * Five panels, in the order a coach works them:
 *
 * 1. **Wallet and link.** Token balance (`tokenLedger`, never stored) and the
 *    candidate's own page, `/me/<token>`.
 * 2. **What was sold and what is due.** `engagements` and `deliverables`, with
 *    status moved in place and a due date per item.
 * 3. **CV versions.** Every file, never overwritten, each revision saying what
 *    changed and which piece of work it belongs to. Shared ones appear on the
 *    candidate's page.
 * 4. **Job tracker.** `applications` as a pipeline, matched roles sent from here
 *    with their token spent in the same step, and the CV used per application.
 * 5. **Delivery notes.** Private by default; a shared note is what the
 *    candidate reads as "from your coach".
 *
 * English only, like every admin surface (`copy.ts`).
 */

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Doc, Id } from "../../../../convex/_generated/dataModel";

/* ---------------------------------------------------------------- helpers */

const day = (ms: number | null | undefined) =>
  ms === null || ms === undefined
    ? ""
    : new Date(ms).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

/** `<input type="date">` holds YYYY-MM-DD; stored as midday UTC so no timezone moves the day. */
const toMs = (iso: string) => (iso ? Date.parse(`${iso}T12:00:00Z`) : undefined);
const toIso = (ms: number | null | undefined) =>
  ms === null || ms === undefined ? "" : new Date(ms).toISOString().slice(0, 10);

const errText = (e: unknown) => {
  const d = (e as { data?: unknown })?.data;
  if (typeof d === "string") return d;
  return e instanceof Error ? e.message : "Something went wrong.";
};

const INPUT = "field mt-1";
const BTN = "btn-tonal h-10 px-5 text-label-large";
const LINK = "text-body-medium text-ink-deep underline";

function Panel({ title, aside, children }: { title: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-large border border-outline-variant p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-title-medium text-on-surface">{title}</h3>
        {aside}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className="field-label block">
      {text}
      {children}
    </label>
  );
}

function Chip({ children, tone = "plain" }: { children: React.ReactNode; tone?: "plain" | "strong" }) {
  return (
    <span
      className={
        tone === "strong"
          ? "rounded-small bg-primary-container px-2 py-0.5 text-label-medium text-on-primary-container"
          : "rounded-small border border-outline-variant px-2 py-0.5 text-label-medium text-on-surface-variant"
      }
    >
      {children}
    </span>
  );
}

function ErrorLine({ error }: { error: string | null }) {
  return error ? (
    <p role="alert" className="field-support-error mt-2">
      {error}
    </p>
  ) : null;
}

/* ----------------------------------------------------------------- labels */

const MODULE_LABEL: Record<string, string> = {
  career_coaching: "Career Coaching",
  profile_optimization: "Candidate Profile Optimization",
  job_application_lifecycle: "Job Application Lifecycle",
  bundle: "Europe-Ready bundle",
  token_pack: "Token pack",
};

export const KIND_LABEL: Record<string, string> = {
  fit_report: "Fit Report",
  coaching_session: "Coaching session",
  base_cv: "Base CV",
  linkedin: "LinkedIn",
  portfolio: "Portfolio site",
  country_research: "Country research",
  tailored_application: "Tailored application",
  interview_prep: "Interview prep",
  mock_interview: "Mock interview",
  offer_review: "Offer review",
  contract_review: "Contract review",
};

const STAGE_LABEL: Record<string, string> = {
  direction: "Direction",
  route: "Route",
  legibility: "Legibility",
  execution: "Execution",
};

const REASON_LABEL: Record<string, string> = {
  purchase: "Purchase",
  fit_report: "Fit Report",
  matched_role: "Matched role",
  cash_refund: "Cash refund",
  adjustment: "Adjustment",
};

/** Pipeline order, as the candidate's page shows it. Closed outcomes sit apart. */
export const PIPELINE = ["interested", "applied", "screening", "interviewing", "offer", "accepted"] as const;
export const CLOSED = ["rejected", "withdrawn"] as const;
const STATUS_LABEL: Record<string, string> = {
  interested: "Saved",
  applied: "Applied",
  screening: "Screening",
  interviewing: "Interviewing",
  offer: "Offer",
  accepted: "Accepted",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

const ORIGIN_LABEL: Record<string, string> = {
  matched: "Matched by us",
  candidate: "Theirs",
  coach: "Coach logged",
};

/* ================================================================== root */

export default function DeliveryWorkspace({ leadId }: { leadId: Id<"leads"> }) {
  const ws = useQuery(api.workspace.forLead, { leadId });
  const engagements = useQuery(api.delivery.forLead, { leadId });

  if (ws === undefined || engagements === undefined) {
    return <p className="text-body-medium text-on-surface-variant">Loading...</p>;
  }

  return (
    <div className="space-y-5">
      <WalletAndLink leadId={leadId} ws={ws} engagements={engagements} />
      <Deliverables leadId={leadId} engagements={engagements} />
      <CvVersions leadId={leadId} cvs={ws.cvs} engagements={engagements} />
      <JobTracker
        leadId={leadId}
        apps={ws.applications}
        cvs={ws.cvs}
        balance={ws.tokens.balance}
        engagements={engagements}
      />
      <Notes leadId={leadId} notes={ws.notes} engagements={engagements} apps={ws.applications} />
    </div>
  );
}

type Ws = NonNullable<ReturnType<typeof useQuery<typeof api.workspace.forLead>>>;
type Engs = NonNullable<ReturnType<typeof useQuery<typeof api.delivery.forLead>>>;

/* ======================================================= 1. wallet + link */

function WalletAndLink({ leadId, ws, engagements }: { leadId: Id<"leads">; ws: Ws; engagements: Engs }) {
  const record = useMutation(api.workspace.recordTokens);
  const grant = useMutation(api.workspace.grantAccess);
  const shareReport = useMutation(api.workspace.shareFitReport);
  const handleRequest = useMutation(api.workspace.handleTokenRequest);
  const revoke = useMutation(api.workspace.revokeAccess);
  const [accessEmail, setAccessEmail] = useState<string | null>(null);
  const [form, setForm] = useState<null | {
    reason: "purchase" | "fit_report" | "cash_refund" | "adjustment";
    amount: string;
    direction: "add" | "remove";
    engagementId: string;
    note: string;
  }>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLedger, setShowLedger] = useState(false);
  const pageUrl = typeof window !== "undefined" ? `${window.location.origin}/me` : "/me";

  const giveAccess = async (email?: string) => {
    setError(null);
    try {
      await grant({ leadId, ...(email ? { email } : {}) });
      setAccessEmail(null);
    } catch (e) {
      setError(errText(e));
    }
  };

  const save = async () => {
    if (!form) return;
    setError(null);
    try {
      await record({
        leadId,
        reason: form.reason,
        amount: Number(form.amount),
        ...(form.reason === "adjustment" ? { direction: form.direction } : {}),
        ...(form.engagementId ? { engagementId: form.engagementId as Id<"engagements"> } : {}),
        ...(form.note.trim() ? { note: form.note.trim() } : {}),
      });
      setForm(null);
    } catch (e) {
      setError(errText(e));
    }
  };

  return (
    <Panel title="Wallet and the candidate's page">
      <div className="grid gap-5 medium:grid-cols-2">
        <div>
          <p className="text-label-large text-on-surface-variant">Tokens left</p>
          <p className="text-display-small text-on-surface">{ws.tokens.balance}</p>
          <p className="text-body-medium text-on-surface-variant">
            {ws.tokens.bought} bought, {ws.tokens.spent} spent
          </p>
          {ws.tokenRequest && (
            <p className="mt-2 rounded-medium bg-primary-container px-3 py-2 text-body-medium text-on-primary-container">
              Asked for more tokens on {day(ws.tokenRequest.at)}. Send the transfer details on LINE, record the
              purchase when it lands, then{" "}
              <button type="button" className="underline" onClick={() => void handleRequest({ requestId: ws.tokenRequest!._id })}>
                mark handled
              </button>
              .
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-4">
            <button
              type="button"
              className={LINK}
              onClick={() =>
                setForm({ reason: "purchase", amount: "", direction: "add", engagementId: "", note: "" })
              }
            >
              Record tokens
            </button>
            {ws.tokens.ledger.length > 0 && (
              <button type="button" className={LINK} onClick={() => setShowLedger((s) => !s)}>
                {showLedger ? "Hide history" : `History (${ws.tokens.ledger.length})`}
              </button>
            )}
          </div>
        </div>

        <div>
          <p className="text-label-large text-on-surface-variant">Their own page</p>
          {ws.access ? (
            <>
              <p className="mt-1 text-body-medium text-on-surface">
                {ws.access.email} can sign in at {pageUrl} with a code sent to that address.
              </p>
              {ws.heldCode && (
                <p className="mt-2 rounded-medium bg-primary-container px-3 py-2 text-body-medium text-on-primary-container">
                  Sign-in code waiting: <strong className="tracking-widest">{ws.heldCode.code}</strong>, valid
                  until{" "}
                  {new Date(ws.heldCode.expiresAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}.
                  Email is not set up yet, so send it to them on LINE.
                </p>
              )}
              <p className="text-body-medium text-on-surface-variant">
                Access since {day(ws.access.grantedAt)}
                {ws.access.lastSignInAt ? `, last signed in ${day(ws.access.lastSignInAt)}` : ", not signed in yet"}
              </p>
              <div className="mt-2 flex flex-wrap gap-4">
                <a className={LINK} href={`/admin/leads/${leadId}/as-candidate`} target="_blank" rel="noreferrer">
                  See their page
                </a>
                <button type="button" className={LINK} onClick={() => setAccessEmail(ws.access!.email)}>
                  Change address
                </button>
                <button type="button" className={LINK} onClick={() => void revoke({ leadId })}>
                  Switch off
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="mt-1 text-body-medium text-on-surface-variant">
                No access yet. Their page shows what they bought, what is done, the CVs and notes you
                share, and a Teal-style job tracker they keep themselves. They sign in at {pageUrl} with
                their email and a code; no password.
              </p>
              <div className="mt-3 flex flex-wrap gap-4">
                <button type="button" className={BTN} onClick={() => setAccessEmail("")}>
                  Give access
                </button>
                <a className={`${LINK} self-center`} href={`/admin/leads/${leadId}/as-candidate`} target="_blank" rel="noreferrer">
                  Preview their page
                </a>
              </div>
            </>
          )}
          {accessEmail !== null && (
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <Label text="Address they sign in with (blank uses the one on file)">
                <input className={INPUT} value={accessEmail} onChange={(e) => setAccessEmail(e.target.value)} />
              </Label>
              <button type="button" className={BTN} onClick={() => void giveAccess(accessEmail.trim() || undefined)}>
                Save
              </button>
              <button type="button" className={LINK} onClick={() => setAccessEmail(null)}>
                Cancel
              </button>
            </div>
          )}
          <div className="mt-4 border-t border-outline-variant pt-3">
            <p className="text-label-large text-on-surface-variant">Fit Report on their page</p>
            {ws.fitReport.shared ? (
              <p className="mt-1 text-body-medium text-on-surface">
                Shared. They open it from their page, built live from the answers and your ratings.{" "}
                <button type="button" className={LINK} onClick={() => void shareReport({ leadId, shared: false })}>
                  Take it off
                </button>
              </p>
            ) : (
              <p className="mt-1 text-body-medium text-on-surface-variant">
                {ws.fitReport.rated
                  ? `${ws.fitReport.rated} competencies rated. `
                  : "Nothing rated yet; rate the interview first. "}
                {ws.fitReport.rated > 0 && (
                  <button
                    type="button"
                    className={LINK}
                    onClick={() => void shareReport({ leadId, shared: true }).catch((e) => setError(errText(e)))}
                  >
                    Share it on their page
                  </button>
                )}
              </p>
            )}
          </div>
          {!form && <ErrorLine error={error} />}
        </div>
      </div>

      {showLedger && (
        <ul className="mt-4 divide-y divide-outline-variant border-y border-outline-variant">
          {ws.tokens.ledger.map((r) => (
            <li key={r._id} className="flex items-baseline justify-between gap-4 py-2">
              <span className="text-body-medium text-on-surface">
                {REASON_LABEL[r.reason]}
                {r.note ? <span className="text-on-surface-variant"> · {r.note}</span> : null}
              </span>
              <span className="whitespace-nowrap text-body-medium text-on-surface-variant">
                <span className="text-on-surface">{r.delta > 0 ? `+${r.delta}` : r.delta}</span> · {day(r.at)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {form && (
        <div className="mt-4 rounded-medium border border-outline-variant bg-surface p-4">
          <div className="grid gap-4 medium:grid-cols-3">
            <Label text="What">
              <select
                className={INPUT}
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value as typeof form.reason })}
              >
                <option value="purchase">Purchase (adds)</option>
                <option value="fit_report">Fit Report delivered (spends)</option>
                <option value="cash_refund">Cash refund of unused (spends)</option>
                <option value="adjustment">Adjustment</option>
              </select>
            </Label>
            <Label text="Tokens">
              <input
                className={INPUT}
                inputMode="numeric"
                value={form.amount}
                placeholder={form.reason === "fit_report" ? "20" : "33"}
                onChange={(e) => setForm({ ...form, amount: e.target.value.replace(/\D/g, "") })}
              />
            </Label>
            {form.reason === "adjustment" ? (
              <Label text="Direction">
                <select
                  className={INPUT}
                  value={form.direction}
                  onChange={(e) => setForm({ ...form, direction: e.target.value as "add" | "remove" })}
                >
                  <option value="add">Add</option>
                  <option value="remove">Remove</option>
                </select>
              </Label>
            ) : (
              <Label text="Against">
                <select
                  className={INPUT}
                  value={form.engagementId}
                  onChange={(e) => setForm({ ...form, engagementId: e.target.value })}
                >
                  <option value="">Nothing specific</option>
                  {engagements.map((e) => (
                    <option key={e._id} value={e._id}>
                      {MODULE_LABEL[e.module] ?? e.module}
                      {e.agreedThb ? `, ${e.agreedThb.toLocaleString()} THB` : ""}
                    </option>
                  ))}
                </select>
              </Label>
            )}
          </div>
          <div className="mt-3">
            <Label text={form.reason === "adjustment" ? "Why, required" : "Note"}>
              <input className={INPUT} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
            </Label>
          </div>
          <ErrorLine error={error} />
          <div className="mt-3 flex items-center gap-4">
            <button type="button" className={BTN} disabled={!form.amount} onClick={() => void save()}>
              Save
            </button>
            <button type="button" className={LINK} onClick={() => setForm(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </Panel>
  );
}

/* ====================================================== 2. deliverables */

function Deliverables({ leadId, engagements }: { leadId: Id<"leads">; engagements: Engs }) {
  const createEngagement = useMutation(api.delivery.createEngagement);
  const updateEngagement = useMutation(api.delivery.updateEngagement);
  const addDeliverable = useMutation(api.delivery.addDeliverable);
  const updateDeliverable = useMutation(api.delivery.updateDeliverable);
  const record = useMutation(api.workspace.recordTokens);
  const ws = useQuery(api.workspace.forLead, { leadId });

  const [newEng, setNewEng] = useState<null | { module: string; thb: string; status: string; notes: string }>(null);
  const [addTo, setAddTo] = useState<null | {
    engagementId: Id<"engagements">;
    kind: string;
    stage: string;
    due: string;
    notes: string;
    title: string;
  }>(null);
  const [error, setError] = useState<string | null>(null);

  const fitReportPaid = useMemo(() => {
    const ids = new Set<string>();
    for (const r of ws?.tokens.ledger ?? []) if (r.reason === "fit_report" && r.deliverableId) ids.add(r.deliverableId);
    return ids;
  }, [ws]);

  const run = async (fn: () => Promise<unknown>) => {
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(errText(e));
    }
  };

  const next: Record<string, "not_started" | "in_progress" | "delivered"> = {
    not_started: "in_progress",
    in_progress: "delivered",
    delivered: "not_started",
  };

  return (
    <Panel
      title="What was sold, what is due"
      aside={
        <button
          type="button"
          className={LINK}
          onClick={() => setNewEng({ module: "token_pack", thb: "", status: "active", notes: "" })}
        >
          Record a sale
        </button>
      }
    >
      {engagements.length === 0 && !newEng && (
        <p className="text-body-medium text-on-surface-variant">Nothing sold to this person yet.</p>
      )}

      <ul className="space-y-5">
        {engagements.map((e) => {
          const done = e.deliverables.filter((d) => d.status === "delivered").length;
          return (
            <li key={e._id} className="border-b border-outline-variant pb-4 last:border-b-0">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <span className="text-body-large text-on-surface">
                  {MODULE_LABEL[e.module] ?? e.module}
                  {e.agreedThb !== undefined ? `, ${e.agreedThb.toLocaleString()} THB` : ""}
                </span>
                <span className="flex items-center gap-3">
                  <span className="text-body-medium text-on-surface-variant">
                    {done} of {e.deliverables.length} delivered
                  </span>
                  <select
                    aria-label="Engagement status"
                    className="field field-dense w-auto"
                    value={e.status}
                    onChange={(ev) =>
                      void run(() =>
                        updateEngagement({
                          engagementId: e._id,
                          status: ev.target.value as Doc<"engagements">["status"],
                        }),
                      )
                    }
                  >
                    {["proposed", "agreed", "active", "completed", "lapsed", "refunded"].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </span>
              </div>
              {e.module === "bundle" && /token/i.test(e.notes ?? "") && (
                <p className="mt-1 text-body-medium text-on-surface-variant">
                  Logged as a bundle but the note says tokens.{" "}
                  <button
                    type="button"
                    className={LINK}
                    onClick={() => void run(() => updateEngagement({ engagementId: e._id, module: "token_pack" }))}
                  >
                    Mark as a token pack
                  </button>
                </p>
              )}
              {e.notes && <p className="mt-1 text-body-medium text-on-surface-variant">{e.notes}</p>}

              <ul className="mt-3 space-y-2">
                {e.deliverables.map((d) => (
                  <li key={d._id} className="flex flex-wrap items-center justify-between gap-3">
                    <span className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label={`Status: ${d.status}. Move on.`}
                        title="Click to move to the next status"
                        onClick={() => void run(() => updateDeliverable({ deliverableId: d._id, status: next[d.status] }))}
                        className={
                          "grid h-6 w-6 place-items-center rounded-full border text-label-medium " +
                          (d.status === "delivered"
                            ? "border-transparent bg-primary-container text-on-primary-container"
                            : d.status === "in_progress"
                              ? "border-ink-deep text-on-surface"
                              : "border-outline-variant text-on-surface-variant")
                        }
                      >
                        {d.status === "delivered" ? "✓" : d.status === "in_progress" ? "•" : ""}
                      </button>
                      <span className="text-body-medium text-on-surface">
                        {KIND_LABEL[d.kind] ?? d.kind}
                        <span className="text-on-surface-variant"> · {STAGE_LABEL[d.methodStage]}</span>
                        {d.notes ? <span className="text-on-surface-variant"> · {d.notes}</span> : null}
                        <TitleEdit
                          value={d.title ?? ""}
                          onSave={(title) => run(() => updateDeliverable({ deliverableId: d._id, title }))}
                        />
                        {d.status !== "delivered" && (
                          <TitleEdit
                            label="Booking link"
                            empty="none, booked by message"
                            value={d.bookingUrl ?? ""}
                            onSave={(bookingUrl) => run(() => updateDeliverable({ deliverableId: d._id, bookingUrl }))}
                          />
                        )}
                      </span>
                    </span>
                    <span className="flex items-center gap-3 text-body-medium text-on-surface-variant">
                      {d.status === "delivered" ? (
                        `Delivered ${day(d.deliveredAt)}`
                      ) : (
                        <label className="flex items-center gap-2">
                          Due
                          <input
                            type="date"
                            className="field field-dense w-auto"
                            value={toIso(d.dueAt)}
                            onChange={(ev) =>
                              void run(() =>
                                updateDeliverable({ deliverableId: d._id, dueAt: toMs(ev.target.value) ?? null }),
                              )
                            }
                          />
                        </label>
                      )}
                      {d.kind === "fit_report" && d.status === "delivered" && !fitReportPaid.has(d._id) && (
                        <button
                          type="button"
                          className={LINK}
                          onClick={() =>
                            void run(() =>
                              record({
                                leadId,
                                reason: "fit_report",
                                amount: 20,
                                engagementId: e._id,
                                deliverableId: d._id,
                              }),
                            )
                          }
                        >
                          Spend its 20 tokens
                        </button>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              {addTo?.engagementId === e._id ? (
                <div className="mt-3 rounded-medium border border-outline-variant bg-surface p-4">
                  <div className="grid gap-3 medium:grid-cols-3">
                    <Label text="Work">
                      <select className={INPUT} value={addTo.kind} onChange={(ev) => setAddTo({ ...addTo, kind: ev.target.value })}>
                        {Object.entries(KIND_LABEL).map(([k, l]) => (
                          <option key={k} value={k}>
                            {l}
                          </option>
                        ))}
                      </select>
                    </Label>
                    <Label text="Method stage">
                      <select className={INPUT} value={addTo.stage} onChange={(ev) => setAddTo({ ...addTo, stage: ev.target.value })}>
                        {Object.entries(STAGE_LABEL).map(([k, l]) => (
                          <option key={k} value={k}>
                            {l}
                          </option>
                        ))}
                      </select>
                    </Label>
                    <Label text="Due">
                      <input type="date" className={INPUT} value={addTo.due} onChange={(ev) => setAddTo({ ...addTo, due: ev.target.value })} />
                    </Label>
                  </div>
                  <div className="mt-3 grid gap-3 medium:grid-cols-2">
                    <Label text="Name on their page, Thai (optional)">
                      <input
                        className={INPUT}
                        placeholder="e.g. คุยทำความรู้จัก 30 นาที"
                        value={addTo.title}
                        onChange={(ev) => setAddTo({ ...addTo, title: ev.target.value })}
                      />
                    </Label>
                    <Label text="Coach note (private)">
                      <input className={INPUT} value={addTo.notes} onChange={(ev) => setAddTo({ ...addTo, notes: ev.target.value })} />
                    </Label>
                  </div>
                  <div className="mt-3 flex gap-4">
                    <button
                      type="button"
                      className={BTN}
                      onClick={() =>
                        void run(async () => {
                          await addDeliverable({
                            engagementId: addTo.engagementId,
                            kind: addTo.kind as Doc<"deliverables">["kind"],
                            methodStage: addTo.stage as Doc<"deliverables">["methodStage"],
                            ...(toMs(addTo.due) ? { dueAt: toMs(addTo.due) } : {}),
                            ...(addTo.notes.trim() ? { notes: addTo.notes.trim() } : {}),
                            ...(addTo.title.trim() ? { title: addTo.title.trim() } : {}),
                          });
                          setAddTo(null);
                        })
                      }
                    >
                      Add
                    </button>
                    <button type="button" className={LINK} onClick={() => setAddTo(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className={`${LINK} mt-3`}
                  onClick={() => setAddTo({ engagementId: e._id, kind: "base_cv", stage: "legibility", due: "", notes: "", title: "" })}
                >
                  Add a piece of work
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {newEng && (
        <div className="mt-4 rounded-medium border border-outline-variant bg-surface p-4">
          <div className="grid gap-3 medium:grid-cols-3">
            <Label text="What was sold">
              <select className={INPUT} value={newEng.module} onChange={(ev) => setNewEng({ ...newEng, module: ev.target.value })}>
                {Object.entries(MODULE_LABEL).map(([k, l]) => (
                  <option key={k} value={k}>
                    {l}
                  </option>
                ))}
              </select>
            </Label>
            <Label text="Agreed, THB">
              <input
                className={INPUT}
                inputMode="numeric"
                value={newEng.thb}
                onChange={(ev) => setNewEng({ ...newEng, thb: ev.target.value.replace(/\D/g, "") })}
              />
            </Label>
            <Label text="Status">
              <select className={INPUT} value={newEng.status} onChange={(ev) => setNewEng({ ...newEng, status: ev.target.value })}>
                {["proposed", "agreed", "active"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Label>
          </div>
          <div className="mt-3">
            <Label text="Note">
              <input className={INPUT} value={newEng.notes} onChange={(ev) => setNewEng({ ...newEng, notes: ev.target.value })} />
            </Label>
          </div>
          <p className="mt-2 text-body-medium text-on-surface-variant">
            A token pack&apos;s tokens are recorded separately, under Record tokens, so the wallet is
            always the sum of its history.
          </p>
          <div className="mt-3 flex gap-4">
            <button
              type="button"
              className={BTN}
              onClick={() =>
                void run(async () => {
                  await createEngagement({
                    leadId,
                    module: newEng.module as Doc<"engagements">["module"],
                    status: newEng.status as Doc<"engagements">["status"],
                    ...(newEng.thb ? { agreedThb: Number(newEng.thb), quotedThb: Number(newEng.thb) } : {}),
                    ...(newEng.notes.trim() ? { notes: newEng.notes.trim() } : {}),
                  });
                  setNewEng(null);
                })
              }
            >
              Save
            </button>
            <button type="button" className={LINK} onClick={() => setNewEng(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
      <ErrorLine error={error} />
    </Panel>
  );
}

/* ====================================================== 3. CV versions */

function CvVersions({ leadId, cvs, engagements }: { leadId: Id<"leads">; cvs: Ws["cvs"]; engagements: Engs }) {
  const uploadUrl = useMutation(api.workspace.cvUploadUrl);
  const saveCv = useMutation(api.workspace.saveCv);
  const updateCv = useMutation(api.workspace.updateCv);
  const deleteCv = useMutation(api.workspace.deleteCv);

  type Draft = {
    file: File | null;
    author: "candidate" | "coach";
    label: string;
    basedOn: string;
    changeNote: string;
    deliverableId: string;
    received: string;
    share: boolean;
  };
  const blank = (author: "candidate" | "coach"): Draft => ({
    file: null,
    author,
    label: "",
    basedOn: author === "coach" && cvs[0] ? cvs[0]._id : "",
    changeNote: "",
    deliverableId: "",
    received: new Date().toISOString().slice(0, 10),
    share: author === "candidate",
  });
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const deliverables = engagements.flatMap((e) => e.deliverables);
  const byId = new Map(cvs.map((c) => [c._id as string, c]));

  const upload = async () => {
    if (!draft?.file) return;
    setBusy(true);
    setError(null);
    try {
      const url = await uploadUrl({});
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": draft.file.type || "application/octet-stream" },
        body: draft.file,
      });
      if (!res.ok) throw new Error(`Upload failed (${res.status}).`);
      const { storageId } = (await res.json()) as { storageId: Id<"_storage"> };
      await saveCv({
        leadId,
        storageId,
        fileName: draft.file.name,
        author: draft.author,
        label: draft.label.trim() || draft.file.name.replace(/\.[^.]+$/, ""),
        ...(draft.basedOn ? { basedOn: draft.basedOn as Id<"cvDocuments"> } : {}),
        ...(draft.changeNote.trim() ? { changeNote: draft.changeNote.trim() } : {}),
        ...(draft.deliverableId ? { deliverableId: draft.deliverableId as Id<"deliverables"> } : {}),
        ...(draft.author === "candidate" && toMs(draft.received) ? { receivedAt: toMs(draft.received) } : {}),
        share: draft.share,
      });
      setDraft(null);
    } catch (e) {
      setError(errText(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Panel
      title="CV versions"
      aside={
        <span className="flex gap-4">
          <button type="button" className={LINK} onClick={() => setDraft(blank("candidate"))}>
            Add a file they sent
          </button>
          {cvs.length > 0 && (
            <button type="button" className={LINK} onClick={() => setDraft(blank("coach"))}>
              Add our revision
            </button>
          )}
        </span>
      }
    >
      <p className="text-body-medium text-on-surface-variant">
        Stored on the Convex deployment, never overwritten. Files download, they are never displayed,
        so a photo on a CV is never shown by the app.
      </p>

      {cvs.length === 0 && !draft && (
        <p className="mt-3 text-body-medium text-on-surface-variant">No CV on file.</p>
      )}

      <ol className="mt-3 space-y-3">
        {cvs.map((c, i) => (
          <li key={c._id} className="rounded-medium border border-outline-variant px-4 py-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-body-large text-on-surface">
                Version {c.version} · {c.label}
              </span>
              <span className="flex flex-wrap items-center gap-2">
                {i === 0 && <Chip tone="strong">Latest</Chip>}
                <Chip>{c.author === "candidate" ? "Theirs" : "Our revision"}</Chip>
                {c.sharedAt ? <Chip>On their page</Chip> : null}
              </span>
            </div>
            <p className="mt-1 text-body-medium text-on-surface-variant">
              {c.fileName} · {Math.max(1, Math.round(c.bytes / 1024))} KB ·{" "}
              {c.author === "candidate" ? `received ${day(c.cvConsentAt)}` : `uploaded ${day(c.uploadedAt)}`}
              {c.basedOn && byId.get(c.basedOn) ? ` · from version ${byId.get(c.basedOn)!.version}` : ""}
              {c.deliverableId
                ? ` · for ${KIND_LABEL[deliverables.find((d) => d._id === c.deliverableId)?.kind ?? ""] ?? "a deliverable"}`
                : ""}
            </p>
            {c.changeNote && (
              <p className="mt-2 whitespace-pre-line text-body-medium text-on-surface">{c.changeNote}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-4">
              {c.url && (
                <a className={LINK} href={c.url} target="_blank" rel="noreferrer" download={c.fileName}>
                  Download
                </a>
              )}
              <button
                type="button"
                className={LINK}
                onClick={() => void updateCv({ cvId: c._id, shared: !c.sharedAt })}
              >
                {c.sharedAt ? "Take off their page" : "Share on their page"}
              </button>
              {confirmDelete === c._id ? (
                <>
                  <button type="button" className="text-body-medium text-error underline" onClick={() => void deleteCv({ cvId: c._id })}>
                    Delete file for good
                  </button>
                  <button type="button" className={LINK} onClick={() => setConfirmDelete(null)}>
                    Keep it
                  </button>
                </>
              ) : (
                <button type="button" className="text-body-medium text-on-surface-variant underline" onClick={() => setConfirmDelete(c._id)}>
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ol>

      {draft && (
        <div className="mt-4 rounded-medium border border-outline-variant bg-surface p-4">
          <h4 className="text-label-large text-on-surface">
            {draft.author === "candidate" ? "A file they sent" : "A revision we made"}
          </h4>
          <div className="mt-3 grid gap-3 medium:grid-cols-2">
            <Label text="File (PDF, Word or text, up to 10 MB)">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                className="mt-1 block text-body-medium"
                onChange={(e) => setDraft({ ...draft, file: e.target.files?.[0] ?? null })}
              />
            </Label>
            <Label text="Name for this version">
              <input
                className={INPUT}
                placeholder={draft.author === "candidate" ? "e.g. Their own, two-column" : "e.g. Ireland IT, one column"}
                value={draft.label}
                onChange={(e) => setDraft({ ...draft, label: e.target.value })}
              />
            </Label>
            {draft.author === "candidate" ? (
              <Label text="Date they sent it">
                <input type="date" className={INPUT} value={draft.received} onChange={(e) => setDraft({ ...draft, received: e.target.value })} />
              </Label>
            ) : (
              <Label text="Made from">
                <select className={INPUT} value={draft.basedOn} onChange={(e) => setDraft({ ...draft, basedOn: e.target.value })}>
                  <option value="">Nothing, new from scratch</option>
                  {cvs.map((c) => (
                    <option key={c._id} value={c._id}>
                      Version {c.version} · {c.label}
                    </option>
                  ))}
                </select>
              </Label>
            )}
            {draft.author === "coach" && (
              <Label text="Part of">
                <select className={INPUT} value={draft.deliverableId} onChange={(e) => setDraft({ ...draft, deliverableId: e.target.value })}>
                  <option value="">No specific piece of work</option>
                  {deliverables.map((d) => (
                    <option key={d._id} value={d._id}>
                      {KIND_LABEL[d.kind] ?? d.kind}
                      {d.notes ? `, ${d.notes}` : ""}
                    </option>
                  ))}
                </select>
              </Label>
            )}
          </div>
          {draft.author === "coach" && (
            <div className="mt-3">
              <Label text="What changed and why (they read this beside the file)">
                <textarea rows={4} className={INPUT} value={draft.changeNote} onChange={(e) => setDraft({ ...draft, changeNote: e.target.value })} />
              </Label>
            </div>
          )}
          <label className="mt-3 flex items-center gap-2 text-body-medium text-on-surface">
            <input type="checkbox" checked={draft.share} onChange={(e) => setDraft({ ...draft, share: e.target.checked })} />
            Show on their page
          </label>
          <ErrorLine error={error} />
          <div className="mt-3 flex items-center gap-4">
            <button type="button" className={BTN} disabled={!draft.file || busy} onClick={() => void upload()}>
              {busy ? "Uploading..." : "Upload"}
            </button>
            <button type="button" className={LINK} onClick={() => setDraft(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </Panel>
  );
}

/* ====================================================== 4. job tracker */

function JobTracker({
  leadId,
  apps,
  cvs,
  balance,
  engagements,
}: {
  leadId: Id<"leads">;
  apps: Ws["applications"];
  cvs: Ws["cvs"];
  balance: number;
  engagements: Engs;
}) {
  const sendMatched = useMutation(api.workspace.sendMatchedRole);
  const withdraw = useMutation(api.workspace.withdrawMatchedRole);
  const recordApp = useMutation(api.outcomes.recordApplication);
  const setStatus = useMutation(api.outcomes.updateApplicationStatus);
  const updateDetails = useMutation(api.workspace.updateApplicationDetails);

  type Draft = {
    mode: "matched" | "coach";
    employer: string;
    roleTitle: string;
    country: string;
    location: string;
    jobUrl: string;
    salary: string;
    deadline: string;
    matchReason: string;
    jobDescription: string;
    status: string;
  };
  const [draft, setDraft] = useState<Draft | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [open, setOpen] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const a of apps) c[a.status] = (c[a.status] ?? 0) + 1;
    return c;
  }, [apps]);
  const matched = apps.filter((a) => a.origin === "matched").length;
  const shown = filter === "all" ? apps : apps.filter((a) => a.status === filter);
  const pack = engagements.find((e) => e.module === "token_pack" && e.status !== "proposed") ?? engagements[0];
  const cvById = new Map(cvs.map((c) => [c._id as string, c]));

  const run = async (fn: () => Promise<unknown>) => {
    setError(null);
    try {
      await fn();
      return true;
    } catch (e) {
      setError(errText(e));
      return false;
    }
  };

  const submit = async () => {
    if (!draft) return;
    const base = {
      leadId,
      employer: draft.employer,
      roleTitle: draft.roleTitle,
      country: draft.country,
      ...(draft.location.trim() ? { location: draft.location } : {}),
      ...(draft.jobUrl.trim() ? { jobUrl: draft.jobUrl } : {}),
      ...(draft.salary.trim() ? { salary: draft.salary } : {}),
      ...(toMs(draft.deadline) ? { deadlineAt: toMs(draft.deadline) } : {}),
      ...(pack ? { engagementId: pack._id } : {}),
    };
    const ok = await run(() =>
      draft.mode === "matched"
        ? sendMatched({
            ...base,
            ...(draft.matchReason.trim() ? { matchReason: draft.matchReason } : {}),
            ...(draft.jobDescription.trim() ? { jobDescription: draft.jobDescription } : {}),
          })
        : recordApp({ ...base, status: draft.status as Doc<"applications">["status"] }),
    );
    if (ok) setDraft(null);
  };

  const blank = (mode: Draft["mode"]): Draft => ({
    mode,
    employer: "",
    roleTitle: "",
    country: "",
    location: "",
    jobUrl: "",
    salary: "",
    deadline: "",
    matchReason: "",
    jobDescription: "",
    status: "applied",
  });

  return (
    <Panel
      title="Job tracker"
      aside={
        <span className="flex gap-4">
          <button type="button" className={LINK} disabled={balance < 1} onClick={() => setDraft(blank("matched"))}>
            Send a matched role ({balance} left)
          </button>
          <button type="button" className={LINK} onClick={() => setDraft(blank("coach"))}>
            Log an application
          </button>
        </span>
      }
    >
      {/* The pipeline strip, Teal's chevron row: one count per stage, click to filter. */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-small border px-3 py-1 text-label-large ${filter === "all" ? "border-ink-deep text-on-surface" : "border-outline-variant text-on-surface-variant"}`}
        >
          All {apps.length}
        </button>
        {[...PIPELINE, ...CLOSED].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-small border px-3 py-1 text-label-large ${filter === s ? "border-ink-deep text-on-surface" : "border-outline-variant text-on-surface-variant"}`}
          >
            {STATUS_LABEL[s]} {counts[s] ?? 0}
          </button>
        ))}
      </div>
      <p className="mt-2 text-body-medium text-on-surface-variant">
        {matched} matched role{matched === 1 ? "" : "s"} sent. A row the candidate has moved on their page is theirs; you can add a note, not move it.
      </p>

      {shown.length === 0 ? (
        <p className="mt-3 text-body-medium text-on-surface-variant">Nothing here yet.</p>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-body-medium">
            <thead className="text-label-large text-on-surface-variant">
              <tr className="border-b border-outline-variant">
                <th className="py-2 pr-3 font-normal">Role</th>
                <th className="py-2 pr-3 font-normal">Where</th>
                <th className="py-2 pr-3 font-normal">Status</th>
                <th className="py-2 pr-3 font-normal">From</th>
                <th className="py-2 pr-3 font-normal">Saved</th>
                <th className="py-2 pr-3 font-normal">Follow up</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((a) => (
                <FragmentRow key={a._id}>
                  <tr className="border-b border-outline-variant align-top">
                    <td className="py-2 pr-3">
                      <button type="button" className="text-left text-on-surface underline-offset-2 hover:underline" onClick={() => setOpen(open === a._id ? null : a._id)}>
                        {a.roleTitle}
                      </button>
                      <div className="text-on-surface-variant">{a.employer}</div>
                    </td>
                    <td className="py-2 pr-3 text-on-surface-variant">
                      {a.location ? `${a.location}, ` : ""}
                      {a.country}
                    </td>
                    <td className="py-2 pr-3">
                      {a.recordedBy === "candidate" ? (
                        <span className="text-on-surface">{STATUS_LABEL[a.status]}</span>
                      ) : (
                        <select
                          aria-label="Status"
                          className="field field-dense w-auto"
                          value={a.status}
                          onChange={(e) =>
                            void run(() =>
                              setStatus({ applicationId: a._id, status: e.target.value as Doc<"applications">["status"] }),
                            )
                          }
                        >
                          {[...PIPELINE, ...CLOSED].map((s) => (
                            <option key={s} value={s}>
                              {STATUS_LABEL[s]}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="py-2 pr-3 text-on-surface-variant">{ORIGIN_LABEL[a.origin ?? ""] ?? (a.recordedBy === "candidate" ? "Theirs" : "Coach logged")}</td>
                    <td className="py-2 pr-3 text-on-surface-variant">{day(a.savedAt)}</td>
                    <td className="py-2 pr-3 text-on-surface-variant">
                      <input
                        type="date"
                        aria-label="Follow up"
                        className="field field-dense w-auto"
                        value={toIso(a.followUpAt)}
                        onChange={(e) => void run(() => updateDetails({ applicationId: a._id, followUpAt: toMs(e.target.value) ?? null }))}
                      />
                    </td>
                  </tr>
                  {open === a._id && (
                    <tr className="border-b border-outline-variant">
                      <td colSpan={6} className="bg-surface px-3 py-3">
                        <div className="grid gap-2 text-body-medium text-on-surface-variant medium:grid-cols-2">
                          {a.jobUrl && (
                            <a className={LINK} href={a.jobUrl} target="_blank" rel="noreferrer">
                              Posting
                            </a>
                          )}
                          {a.salary && <span>Salary: {a.salary}</span>}
                          {a.deadlineAt && <span>Closes {day(a.deadlineAt)}</span>}
                          {a.appliedAt && <span>Applied {day(a.appliedAt)}</span>}
                          {a.matchReason && <span className="medium:col-span-2">Why it matched: {a.matchReason}</span>}
                          {a.notes && <span className="medium:col-span-2 whitespace-pre-line">Notes: {a.notes}</span>}
                          {(a.interviews ?? []).length > 0 && (
                            <span className="medium:col-span-2">
                              Interviews:{" "}
                              {(a.interviews ?? [])
                                .map((r) => [r.round, r.at ? day(r.at) : null, r.interviewers].filter(Boolean).join(", "))
                                .join("; ")}
                            </span>
                          )}
                          {(a.contacts ?? []).length > 0 && (
                            <span className="medium:col-span-2">
                              Contacts:{" "}
                              {(a.contacts ?? []).map((c) => [c.name, c.role, c.email].filter(Boolean).join(", ")).join("; ")}
                            </span>
                          )}
                          <label className="flex items-center gap-2">
                            CV sent
                            <select
                              className="field field-dense w-auto"
                              value={a.cvDocumentId ?? ""}
                              onChange={(e) =>
                                void run(() =>
                                  updateDetails({
                                    applicationId: a._id,
                                    cvDocumentId: (e.target.value || null) as Id<"cvDocuments"> | null,
                                  }),
                                )
                              }
                            >
                              <option value="">Not recorded</option>
                              {cvs.map((c) => (
                                <option key={c._id} value={c._id}>
                                  Version {c.version} · {c.label}
                                </option>
                              ))}
                            </select>
                          </label>
                          {a.cvDocumentId && cvById.get(a.cvDocumentId)?.url && (
                            <a className={LINK} href={cvById.get(a.cvDocumentId)!.url!} target="_blank" rel="noreferrer">
                              That CV
                            </a>
                          )}
                        </div>
                        {a.origin === "matched" && a.recordedBy !== "candidate" && (
                          <WithdrawMatched onWithdraw={(note) => run(() => withdraw({ applicationId: a._id, note }))} />
                        )}
                      </td>
                    </tr>
                  )}
                </FragmentRow>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {draft && (
        <div className="mt-4 rounded-medium border border-outline-variant bg-surface p-4">
          <h4 className="text-label-large text-on-surface">
            {draft.mode === "matched" ? "Send a matched role, spends 1 token" : "Log an application"}
          </h4>
          <div className="mt-3 grid gap-3 medium:grid-cols-2">
            <Label text="Role title">
              <input className={INPUT} value={draft.roleTitle} onChange={(e) => setDraft({ ...draft, roleTitle: e.target.value })} />
            </Label>
            <Label text="Employer">
              <input className={INPUT} value={draft.employer} onChange={(e) => setDraft({ ...draft, employer: e.target.value })} />
            </Label>
            <Label text="Country">
              <input className={INPUT} value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value })} />
            </Label>
            <Label text="City or remote">
              <input className={INPUT} value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} />
            </Label>
            <Label text="Link to the posting">
              <input className={INPUT} value={draft.jobUrl} onChange={(e) => setDraft({ ...draft, jobUrl: e.target.value })} />
            </Label>
            <Label text="Salary, with currency and period">
              <input className={INPUT} value={draft.salary} onChange={(e) => setDraft({ ...draft, salary: e.target.value })} />
            </Label>
            <Label text="Closes">
              <input type="date" className={INPUT} value={draft.deadline} onChange={(e) => setDraft({ ...draft, deadline: e.target.value })} />
            </Label>
            {draft.mode === "coach" && (
              <Label text="Status">
                <select className={INPUT} value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}>
                  {[...PIPELINE, ...CLOSED].map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
              </Label>
            )}
          </div>
          {draft.mode === "matched" && (
            <div className="mt-3">
              <Label text="Why it matches them, in Thai (they see this)">
                <textarea rows={3} className={INPUT} value={draft.matchReason} onChange={(e) => setDraft({ ...draft, matchReason: e.target.value })} />
              </Label>
              <div className="mt-3">
                <Label text="The posting's text (optional, so it survives the posting being taken down)">
                  <textarea rows={5} className={INPUT} value={draft.jobDescription} onChange={(e) => setDraft({ ...draft, jobDescription: e.target.value })} />
                </Label>
              </div>
            </div>
          )}
          <ErrorLine error={error} />
          <div className="mt-3 flex gap-4">
            <button type="button" className={BTN} onClick={() => void submit()}>
              {draft.mode === "matched" ? "Send and spend 1 token" : "Save"}
            </button>
            <button type="button" className={LINK} onClick={() => setDraft(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {!draft && <ErrorLine error={error} />}
    </Panel>
  );
}

/** The candidate-facing name, edited in place. Blank shows the kind's own name. */
function TitleEdit({
  value,
  onSave,
  label = "Their page",
  empty = "standard name",
}: {
  value: string;
  onSave: (title: string) => Promise<unknown>;
  label?: string;
  empty?: string;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  if (draft === null) {
    return (
      <span className="block text-on-surface-variant">
        {label}: {value || empty}{" "}
        <button type="button" className="underline" onClick={() => setDraft(value)}>
          {value ? "change" : "set"}
        </button>
      </span>
    );
  }
  return (
    <span className="mt-1 flex items-center gap-2">
      <input className="field field-dense w-auto" value={draft} onChange={(e) => setDraft(e.target.value)} />
      <button type="button" className="underline" onClick={() => void onSave(draft).then(() => setDraft(null))}>
        Save
      </button>
      <button type="button" className="underline" onClick={() => setDraft(null)}>
        Cancel
      </button>
    </span>
  );
}

function FragmentRow({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function WithdrawMatched({ onWithdraw }: { onWithdraw: (note: string) => Promise<boolean> }) {
  const [note, setNote] = useState<string | null>(null);
  if (note === null) {
    return (
      <button type="button" className={`${LINK} mt-3`} onClick={() => setNote("")}>
        Withdraw this role and return its token
      </button>
    );
  }
  return (
    <div className="mt-3 flex flex-wrap items-end gap-3">
      <Label text="Why">
        <input className={INPUT} value={note} onChange={(e) => setNote(e.target.value)} />
      </Label>
      <button type="button" className={BTN} disabled={!note.trim()} onClick={() => void onWithdraw(note)}>
        Withdraw
      </button>
      <button type="button" className={LINK} onClick={() => setNote(null)}>
        Cancel
      </button>
    </div>
  );
}

/* ====================================================== 5. notes */

function Notes({
  leadId,
  notes,
  engagements,
  apps,
}: {
  leadId: Id<"leads">;
  notes: Ws["notes"];
  engagements: Engs;
  apps: Ws["applications"];
}) {
  const add = useMutation(api.workspace.addNote);
  const update = useMutation(api.workspace.updateNote);
  const remove = useMutation(api.workspace.deleteNote);
  const [body, setBody] = useState("");
  const [shared, setShared] = useState(false);
  const [about, setAbout] = useState("");
  const [error, setError] = useState<string | null>(null);

  const deliverables = engagements.flatMap((e) => e.deliverables);
  const label = (n: Ws["notes"][number]) => {
    if (n.deliverableId) {
      const d = deliverables.find((x) => x._id === n.deliverableId);
      return d ? KIND_LABEL[d.kind] : null;
    }
    if (n.applicationId) {
      const a = apps.find((x) => x._id === n.applicationId);
      return a ? `${a.roleTitle}, ${a.employer}` : null;
    }
    return null;
  };

  const save = async () => {
    setError(null);
    try {
      const [kind, id] = about.split(":");
      await add({
        leadId,
        body,
        shared,
        ...(kind === "d" ? { deliverableId: id as Id<"deliverables"> } : {}),
        ...(kind === "a" ? { applicationId: id as Id<"applications"> } : {}),
      });
      setBody("");
      setShared(false);
      setAbout("");
    } catch (e) {
      setError(errText(e));
    }
  };

  return (
    <Panel title="Delivery notes">
      <div className="rounded-medium border border-outline-variant bg-surface p-4">
        <textarea
          rows={3}
          className="field"
          placeholder="What was done, what is next, what you noticed"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <select className="field field-dense max-w-xs" value={about} onChange={(e) => setAbout(e.target.value)} aria-label="About">
            <option value="">About the whole engagement</option>
            {deliverables.map((d) => (
              <option key={d._id} value={`d:${d._id}`}>
                {KIND_LABEL[d.kind] ?? d.kind}
                {d.notes ? `, ${d.notes}` : ""}
              </option>
            ))}
            {apps.map((a) => (
              <option key={a._id} value={`a:${a._id}`}>
                Job: {a.roleTitle}, {a.employer}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-body-medium text-on-surface">
            <input type="checkbox" checked={shared} onChange={(e) => setShared(e.target.checked)} />
            Show on their page (write it in Thai)
          </label>
          <button type="button" className={BTN} disabled={!body.trim()} onClick={() => void save()}>
            Add note
          </button>
        </div>
        <ErrorLine error={error} />
      </div>

      {notes.length === 0 ? (
        <p className="mt-3 text-body-medium text-on-surface-variant">No notes yet.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {notes.map((n) => (
            <li key={n._id} className="border-b border-outline-variant pb-3 last:border-b-0">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-body-medium text-on-surface-variant">
                  {day(n.at)} · {n.by}
                  {label(n) ? ` · ${label(n)}` : ""}
                </span>
                <span className="flex items-center gap-3">
                  {n.shared ? <Chip tone="strong">On their page</Chip> : <Chip>Private</Chip>}
                  <button type="button" className={LINK} onClick={() => void update({ noteId: n._id, shared: !n.shared })}>
                    {n.shared ? "Make private" : "Share"}
                  </button>
                  <button type="button" className="text-body-medium text-on-surface-variant underline" onClick={() => void remove({ noteId: n._id })}>
                    Delete
                  </button>
                </span>
              </div>
              <p className="mt-1 whitespace-pre-line text-body-large text-on-surface">{n.body}</p>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
