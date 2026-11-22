"use client";

/**
 * The lead's Record page, the second of the two. `prd.md` § 8, "Screen: Lead,
 * the Record page": what PunProfile holds about the person, and nothing that
 * is a step.
 *
 * The call log with the notes and decisions per call, the EU Fit Check answers
 * with the coach's corrections layered over them, contact and consent with the
 * resolved status and the raw event log, and the subject-access export.
 *
 * Decisions live here and not on the ladder. A decision is recorded on its
 * call, never edited, and replaced only by a new decision explicitly linked to
 * it. The ladder names the decision each rung settled and reads it from here.
 *
 * Nothing on this page is a rung and nothing on it is the next step.
 */

import { useMemo, useState } from "react";
import { useConvex, useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { latestCoachIcp } from "@/lib/leadGrade";
import { applyCorrections } from "@/lib/corrections";
import { CRM_STATUS_LABELS } from "@/lib/crm";
import LeadBriefing from "./LeadBriefing";
import CallLog from "./CallLog";
import AnswerSheet from "./AnswerSheet";
import CoachPanel from "./CoachPanel";
import ConsentPanel from "./ConsentPanel";
import OutcomePanel from "./OutcomePanel";

const slug = (s: string) =>
  s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "lead";

/**
 * Renders the EU Fit Check report at click time from the lead's stored
 * answers, opens it in a tab, and lets it print itself to PDF.
 *
 * It sits beside the answers it is built from, which is why it is on this page
 * rather than on Delivery: the Fit Report, the paid document, is a piece of
 * work and opens on the first call's rung instead.
 *
 * Nothing is persisted. `renderReport` is a pure function of a scored profile,
 * so the report is derived rather than stored: no HTML per candidate in the
 * database, no stale copy to invalidate when the scoring changes, and a report
 * generated a year from now reflects today's model rather than the one that
 * happened to be running when the candidate answered.
 *
 * The renderer, the scorer and the chart builder are imported dynamically, so
 * none of them are in the admin bundle until the button is actually pressed.
 *
 * **The tab is opened before the imports are awaited, and that ordering is the
 * whole reason this is not three lines shorter.** A `window.open` that happens
 * after an `await` is not attributable to the click that started it, and every
 * browser blocks it as a popup. So the tab opens empty and synchronously, and
 * the document is written into it once the renderer has loaded.
 */
async function openReport(
  lead: { fullName: string | null; responses: Record<string, unknown>; createdAt: number },
  variant: "full" | "limited",
  coaching = true,
  community?: import("@/lib/report").CommunityStats,
  /** False for someone who already has the Fit Report. Read off the record. */
  fitReport = true,
) {
  const win = window.open("", "_blank");
  if (!win) {
    alert("The report opens in a new tab. Allow popups for this site and press the button again.");
    return;
  }
  // Something has to be on screen while the chunks load, or a slow connection
  // shows a blank tab that reads as a broken button.
  win.document.write("<!doctype html><title>Building…</title><p>Building the report…");

  const [{ renderReport }, { scoreResponse }, { toScoringInputForLead }] = await Promise.all([
    import("@/lib/report"),
    import("@/lib/scoring"),
    import("@/lib/content/mapping"),
  ]);

  // The report is a pure function of the scored profile, so an input read with
  // the wrong mapper produced a document that contradicted the database and
  // read as finished while doing it.
  const input = toScoringInputForLead(lead.responses);
  const html = renderReport(
    scoreResponse(input),
    {
      candidate: lead.fullName ?? "Anonymous lead",
      submittedAt: new Date(lead.createdAt).toISOString().slice(0, 10),
      targetCountries: input.targetCountries,
      targetRole: input.targetRole ?? undefined,
    },
    // English, decided 17/08/2026 (Paul), and NOT because the Thai is missing:
    // every string in this document has Thai and `locale: "th"` renders it.
    //
    // The 1-1 engagement is conducted in English so the client practises the
    // language they will be interviewed in, and the document they keep is part
    // of that. A Thai report handed over before an English engagement would be
    // the one artefact working against it.
    // `coaching` is off for someone already in Coaching 1:1, so their copy
    // does not end on an offer for what they have bought. Paul 2a, 20/11/2026.
    // `fitReport` is the same idea for the cheaper offer, except that it is not
    // a tick box: the record knows whether this person has the Fit Report, so
    // the wrong version cannot be sent by forgetting to untick anything.
    { variant, locale: "en", autoPrint: true, coaching, fitReport, assetOrigin: window.location.origin, community },
  );

  win.document.open();
  win.document.write(html);
  win.document.close();
}

/** Hands a generated file to the browser. Nothing is stored server-side. */
function download(contents: string, filename: string, mime: string) {
  const url = URL.createObjectURL(new Blob([contents], { type: mime }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function RecordPage({ leadId }: { leadId: Id<"leads"> }) {
  const router = useRouter();
  const convex = useConvex();
  const lead = useQuery(api.leads.getForAdmin, { leadId });
  const calls = useQuery(api.consultations.listForLead, { leadId });
  const corrections = useQuery(api.corrections.listForLead, { leadId });
  // For the report's "from everyone who has taken this" page. 20/11/2026.
  const community = useQuery(api.stats.community);
  const coachIcp = useMemo(() => latestCoachIcp(calls ?? []), [calls]);
  const deleteLead = useMutation(api.leads.deleteLeadOnRequest);
  const setCrmStatus = useMutation(api.leads.setCrmStatus);
  const [dispReason, setDispReason] = useState("");
  // Which report is being built, so one spinner cannot appear on both buttons.
  const [building, setBuilding] = useState<"full" | "limited" | null>(null);
  const [withCoaching, setWithCoaching] = useState(true);
  const [confirmText, setConfirmText] = useState("");
  const [deleteNote, setDeleteNote] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (lead === undefined) return <p className="text-body-large text-on-surface-variant">Loading...</p>;
  if (lead === null) return <p className="text-body-large text-error">No lead with that id.</p>;

  const corrected = applyCorrections(lead.responses, corrections ?? []);

  return (
    <div className="grid gap-x-10 gap-y-8 large:grid-cols-2 large:items-start">
      <div className="space-y-8">
        <CallLog leadId={leadId} />

        {/* Above the outcome on purpose. The rating and the note are what a
            coach reads first when reopening a lead, and the LinkedIn is the
            thing they go looking for before a call rather than after it. */}
        <Section title="Coach">
          <CoachPanel
            leadId={leadId}
            linkedinUrl={lead.linkedinUrl}
            notes={lead.notes}
            notesAt={lead.notesAt}
            notesBy={lead.notesBy}
            coachRating={lead.coachRating}
          />
        </Section>

        <Section title="Applications and outcome">
          <OutcomePanel leadId={leadId} />
        </Section>
      </div>

      <div className="space-y-8">
        <Section title="The assessment">
          <div className="flex flex-wrap items-center gap-2">
            {/* Two documents, one scored profile. The candidate one is first
                because it is the one with a recipient: it gets sent after the
                call. The coach copy is preparation for that call. Neither is
                filled: the lead's one filled button is the ladder's next step
                on the Delivery page (`design.md`). */}
            <button
              type="button"
              disabled={building !== null || Object.keys(corrected.effective).length === 0}
              onClick={async () => {
                setBuilding("limited");
                try {
                  await openReport(
                    { ...lead, responses: corrected.effective },
                    "limited",
                    withCoaching,
                    community ?? undefined,
                    lead.fitReportSharedAt === undefined,
                  );
                } finally {
                  setBuilding(null);
                }
              }}
              className="btn-tonal h-10 px-5 text-label-large"
            >
              {building === "limited" ? "Building..." : "Candidate PDF (English)"}
            </button>
            <button
              type="button"
              disabled={building !== null || Object.keys(corrected.effective).length === 0}
              onClick={async () => {
                setBuilding("full");
                try {
                  await openReport({ ...lead, responses: corrected.effective }, "full");
                } finally {
                  setBuilding(null);
                }
              }}
              className="btn-outlined h-10 px-4 text-label-large hover:bg-surface-container"
            >
              {building === "full" ? "Building..." : "Full report PDF (coach)"}
            </button>
          </div>
          <label className="mt-3 flex items-center gap-2 text-body-medium text-on-surface-variant">
            <input
              type="checkbox"
              checked={withCoaching}
              onChange={(e) => setWithCoaching(e.target.checked)}
            />
            Candidate PDF ends with the Coaching 1:1 pages (untick for a Coaching 1:1 client)
          </label>
          {Object.keys(lead.responses).length === 0 && (
            <p className="mt-2 text-body-medium text-on-surface-variant">
              No answers yet, so there is nothing to report on.
            </p>
          )}
          <div className="mt-6 space-y-8">
            <LeadBriefing
              responses={corrected.effective}
              fullName={lead.fullName}
              coachIcp={coachIcp}
              correctedCount={corrected.byKey.size}
            />

            {/* Your own triage from the survey sheet, imported 14/08/2026
                alongside the answers. Rendered here rather than left in the
                data, because a column carried across and never shown is a
                column that was not really imported. Absent on app-native
                leads, which never had it. */}
            {(typeof lead.responses._entryPoint === "string" ||
              typeof lead.responses._manualCheck === "string") && (
              <Section title="From the survey sheet">
                {/* `showConsent={false}`: these are the coach's own triage
                    columns, not channels. Without it `Row` printed "No consent
                    recorded, do not contact" under the suggested entry point,
                    which is not a true statement about anything. */}
                <Row
                  label="Suggested entry point"
                  value={String(lead.responses._entryPoint ?? "")}
                  showConsent={false}
                />
                {typeof lead.responses._manualCheck === "string" &&
                  lead.responses._manualCheck.trim() !== "" && (
                    <Row
                      label="Flagged for manual check"
                      value={String(lead.responses._manualCheck)}
                      showConsent={false}
                    />
                  )}
              </Section>
            )}

            <AnswerSheet
              leadId={leadId}
              responses={lead.responses}
              corrected={corrected}
              dates={{ surveyAt: lead.createdAt, appAt: lead.lastActivityAt }}
            />
          </div>
        </Section>

        <Section title="Contact">
          {lead.consentSource === "survey_import" && (
            <p className="mb-3 rounded-small border border-warning bg-warning-container px-4 py-3 text-body-medium text-on-warning-container">
              Imported from the Lead Discovery Survey. That form asked how best to
              reach them but carried no consent clause, so the dates below are their
              submission date, not a per-channel grant. Judge outreach against what
              the form actually said.
            </p>
          )}
          {/* Actionable now follows the resolved SERVICE consent, not a flat
              timestamp. A withdrawn channel stops being a live link the moment
              the withdrawal is recorded, which is the whole point of building
              the mechanism. */}
          <Row
            label="Email"
            value={lead.email}
            contactable={lead.consent.service.email.status === "opted_in"}
            href={lead.email ? `mailto:${lead.email}` : null}
          />
          {/* LINE has no reliable "message this id" URL scheme, so the id is
              offered for copying rather than linked to something that may not
              open. */}
          <Row
            label="LINE ID"
            value={lead.lineId}
            contactable={lead.consent.service.line.status === "opted_in"}
            copyable
          />
          <Row
            label="Phone"
            value={lead.phone}
            contactable={lead.consent.service.phone.status === "opted_in"}
            href={lead.phone ? `tel:${lead.phone.replace(/[^\d+]/g, "")}` : null}
          />
        </Section>

        <Section title="Consent">
          <ConsentPanel leadId={leadId} consent={lead.consent} events={lead.consentEvents} />
        </Section>

        <section>
          <h2 className="text-title-large">Their data</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {/* Subject-access request. Two formats: the HTML is what you send
                the person, the JSON is the portable copy if they ask for one.

                Built from `lead`, not from the corrected record: an access
                request asks what the person told us and what we hold, and
                their own answers are the first half of that. Corrections are
                ours, and they are disclosed in the conversations section rather
                than silently swapped in over the top of what they said.

                Delivery is included since 30/10/2026; the CV files themselves
                are downloaded from the CV versions panel on the Delivery page
                and sent with this copy. */}
            <button
              type="button"
              onClick={async () => {
                const { renderSubjectExportHtml } = await import("@/lib/subjectExport");
                // Fetched at click time: delivery spans nine tables, and the
                // screen has no other use for this shape.
                const delivery = await convex.query(api.workspace.exportForLead, { leadId });
                download(
                  renderSubjectExportHtml(lead, calls ?? [], lead.consentEvents ?? [], delivery),
                  `punprofile-data-${slug(lead.fullName ?? "record")}.html`,
                  "text/html;charset=utf-8",
                );
              }}
              className="btn-outlined h-10 px-4 text-label-large hover:bg-surface-container"
            >
              Export their data (readable)
            </button>
            <button
              type="button"
              onClick={async () => {
                const { buildSubjectExport } = await import("@/lib/subjectExport");
                const delivery = await convex.query(api.workspace.exportForLead, { leadId });
                download(
                  JSON.stringify(
                    buildSubjectExport(lead, calls ?? [], lead.consentEvents ?? [], delivery),
                    null,
                    2,
                  ),
                  `punprofile-data-${slug(lead.fullName ?? "record")}.json`,
                  "application/json",
                );
              }}
              className="btn-outlined h-10 px-4 text-label-large hover:bg-surface-container"
            >
              Export (JSON)
            </button>
          </div>
        </section>

        <Section title="Where this lead is">
          <details className="text-body-medium text-on-surface-variant">
            <summary className="cursor-pointer text-ink-deep underline">What the stages mean</summary>
            <p className="mt-2">
              Blank means <strong>New</strong>: reachable, and nobody has worked
              them yet. It does not mean qualified. Nurturing and Not now are both
              live and differ in whether you are working them this month.
              Disqualified is your call that we do not pursue them and it asks for a
              reason, because it will outlive whoever made it. Closed lost is
              theirs, not yours. Quoted and Closed won are not here: they are read
              off the engagement row, because that row carries the figure.
            </p>
          </details>
          {lead.crmStatus ? (
            <div className="mt-3 rounded-small border border-outline-variant bg-primary-container px-4 py-3">
              <p className="text-body-large text-on-surface">
                {CRM_STATUS_LABELS[lead.crmStatus]}
                {lead.crmStatusReason ? `: ${lead.crmStatusReason}` : ""}
              </p>
              <button
                type="button"
                onClick={() => void setCrmStatus({ leadId, crmStatus: null })}
                className="mt-2 text-body-medium text-ink-deep underline"
              >
                Back to New
              </button>
            </div>
          ) : (
            <div className="mt-3">
              <label className="field-label">
                Reason, required
                <input
                  value={dispReason}
                  onChange={(e) => setDispReason(e.target.value)}
                  placeholder="e.g. front-line role, outside the channel's scope"
                  className="field mt-1"
                />
              </label>
              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  disabled={!dispReason.trim()}
                  onClick={() =>
                    void setCrmStatus({
                      leadId,
                      crmStatus: "disqualified",
                      reason: dispReason.trim(),
                    }).then(() => setDispReason(""))
                  }
                  className="btn-outlined h-12 px-5 text-label-large"
                >
                  Out of scope
                </button>
                <button
                  type="button"
                  disabled={!dispReason.trim()}
                  onClick={() =>
                    void setCrmStatus({
                      leadId,
                      crmStatus: "not_now",
                      reason: dispReason.trim(),
                    }).then(() => setDispReason(""))
                  }
                  className="btn-outlined h-12 px-5 text-label-large"
                >
                  Not now
                </button>
              </div>
            </div>
          )}
        </Section>

        <section className="rounded-large border-2 border-error p-5">
          <h2 className="text-title-large text-error">Delete on request</h2>
          <div className="mt-3">
            <details className="text-body-medium text-on-surface-variant">
              <summary className="cursor-pointer text-ink-deep underline">What this erases</summary>
              <p className="mt-2">
                Erases this person entirely: the lead, their answers, every call
                logged against them, every correction, and any saved links. This
                cannot be undone and there is no backup to restore from. A record
                that <em>a</em> deletion happened is kept, holding nothing about who
                it was.
              </p>
              <p className="mt-2">
                <strong>Every session this email has</strong>, not only the one open
                here. One person can hold several rows, because each visit starts a
                new one, and deleting a single row used to leave the rest behind.
              </p>
            </details>
            <label className="mt-4 block text-label-large text-on-surface-variant">
              Your reference for this request
              <input
                value={deleteNote}
                onChange={(e) => setDeleteNote(e.target.value)}
                placeholder="e.g. requested on LINE, 10/08/2026"
                className="field mt-1"
              />
              <span className="mt-1 block text-body-medium font-normal text-on-surface-variant">
                Do not paste their name or contact details here. This row outlives them.
              </span>
            </label>
            <label className="mt-4 block text-label-large text-on-surface-variant">
              Type DELETE to confirm
              <input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} className="field mt-1" />
            </label>
            {deleteError && <p className="mt-3 text-body-large text-error">{deleteError}</p>}
            <button
              type="button"
              disabled={confirmText !== "DELETE" || deleting}
              onClick={async () => {
                setDeleting(true);
                setDeleteError(null);
                try {
                  await deleteLead({ leadId, note: deleteNote.trim() || undefined });
                  router.push("/admin");
                } catch (err) {
                  setDeleteError(err instanceof Error ? err.message : "Deletion failed.");
                  setDeleting(false);
                }
              }}
              className="mt-4 h-12 rounded-medium bg-error px-7 text-label-large text-on-error transition-opacity hover:opacity-90 disabled:bg-surface-container-highest disabled:text-on-surface-variant"
            >
              {deleting ? "Deleting..." : "Delete this person permanently"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-title-large">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Row({
  label,
  value,
  contactable = false,
  href,
  copyable,
  showConsent = true,
}: {
  label: string;
  value: string | null;
  /**
   * Resolved from `consentEvents` by the caller, not from a timestamp on the
   * lead. Changed 15/08/2026: the old flat field could not represent a
   * withdrawal, so a channel someone had asked us to stop using stayed a live
   * link forever.
   */
  contactable?: boolean;
  href?: string | null;
  copyable?: boolean;
  /** False for rows that are not contact channels, so no consent line is drawn. */
  showConsent?: boolean;
}) {
  // Only actionable while consent is live. A channel without it is one you must
  // not use, so it stays plain text rather than a live link that invites a
  // click.
  const actionable = !!value && contactable;

  return (
    <div className="border-b border-outline-variant py-2">
      <div className="flex justify-between gap-4">
        <span className="text-body-large text-on-surface-variant">{label}</span>
        {value === null ? (
          <span className="text-body-large text-on-surface-variant">not provided</span>
        ) : actionable && href ? (
          <a className="text-body-large text-ink-deep underline" href={href}>
            {value}
          </a>
        ) : actionable && copyable ? (
          <button
            type="button"
            onClick={() => void navigator.clipboard?.writeText(value)}
            title="Copy"
            className="text-body-large text-ink-deep underline"
          >
            {value}
          </button>
        ) : (
          <span className="text-body-large text-on-surface">{value}</span>
        )}
      </div>
      {showConsent && (
        <p className="text-body-medium text-on-surface-variant">
          {/* Dates and bases live in the Consent section, which can show per
              purpose and can show a withdrawal. This line says only whether
              the channel may be used right now. */}
          {contactable ? "" : value ? "Do not contact on this channel" : ""}
        </p>
      )}
    </div>
  );
}
