"use client";

/**
 * TASK-035, FR-013: one lead in full.
 *
 * English, coach-facing. Every field the app holds, including the raw answers,
 * the full consent history, and everything past the consultation.
 *
 * Missing data is shown explicitly as "not provided" rather than omitted. A
 * blank row and an absent row look identical on screen, and the difference
 * between "they declined to give a phone number" and "we never asked" is the
 * whole point of a PDPA audit trail. The same principle now runs through the
 * consent panel, where `never_asked` is drawn differently from `opted_out`.
 *
 * **Rebuilt 15/08/2026** for the lifecycle data model. What changed and why:
 *
 * - Consent left this file. It was three timestamps that could not express a
 *   purpose or a withdrawal, so a founder-backfilled email consent was
 *   indistinguishable on screen from a candidate ticking a box.
 * - Contact rows are actionable on resolved consent rather than on a
 *   timestamp, so a withdrawn channel stops being a live link.
 * - The header leads with the derived lifecycle state. `status` stays beside
 *   it because it answers a different question, how far through the assessment
 *   they got, and the two were being read as one thing.
 * - Engagement, delivery and outcome panels exist and are empty for everyone
 *   today. Their empty states say why, because a panel that reads as broken
 *   gets ignored.
 *
 * **Two pages, not five tabs.** The lead now has the Delivery page and the
 * Record page, `prd.md` § 8 and `coaching-delivery-design.md` § 7b. The
 * delivery used to be split across the Session and Delivery tabs and neither
 * answered what the next thing to do for this person was; the Fit Report was a
 * tab the same weight as the call log while being a piece of work; and three
 * reference surfaces were tabs of the same weight as the work. This file is
 * now the shell: the header a coach always has in view, the two-page switch,
 * and nothing else. `DeliveryPage` and `RecordPage` are the pages.
 */

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { CRM_STATUS_LABELS } from "@/lib/crm";
import DeliveryPage from "./DeliveryPage";
import RecordPage from "./RecordPage";
import { stateFor, meetsBookingGate, LIFECYCLE_LABELS } from "@/lib/lifecycle";
import { CONSENT_CHANNELS, CONSENT_PURPOSES } from "@/lib/consent";

const stamp = (ms: number | null) =>
  ms === null ? null : new Date(ms).toISOString().replace("T", " ").slice(0, 16);

export default function LeadDetail({ leadId }: { leadId: Id<"leads"> }) {
  const lead = useQuery(api.leads.getForAdmin, { leadId });
  // The same query `CallLog` runs. Convex dedupes identical subscriptions, so
  // this costs nothing extra and keeps the grade and the log reading one
  // source rather than two that can disagree.
  const calls = useQuery(api.consultations.listForLead, { leadId });
  // Read for the lifecycle state in the header. The pages below subscribe to
  // the same queries; Convex dedupes identical subscriptions, so the state
  // badge and the pages can never disagree about what exists.
  const engagements = useQuery(api.delivery.forLead, { leadId });
  const outcomes = useQuery(api.outcomes.forLead, { leadId });
  // The workspace knows about tokens bought and dashboard access, which the
  // lifecycle state does not read; a token purchase makes someone a client.
  const ws = useQuery(api.workspace.forLead, { leadId });
  const [page, setPage] = useState<LeadPage | null>(null);

  if (lead === undefined) {
    return <p className="text-body-large text-on-surface-variant">Loading...</p>;
  }
  if (lead === null) {
    return <p className="text-body-large text-error">No lead with that id.</p>;
  }

  /**
   * Derived, never stored. Same rule as the scores: the booking gate is
   * expected to change and wave 2 is already written down, so a stored stage
   * would be silently wrong the day it moves.
   *
   * `fullyWithdrawn` reads every channel the person actually gave us. Someone
   * who withdrew email but still has a live LINE consent is not withdrawn, and
   * treating them as such would lose a channel that is still open.
   */
  const heldChannels = CONSENT_CHANNELS.filter(
    (c) => (c === "email" && lead.email) || (c === "line" && lead.lineId) || (c === "phone" && lead.phone),
  );
  const lifecycle = stateFor({
    hasContact: lead.status !== "partial",
    meetsSqlRule: meetsBookingGate(lead.responses),
    consultationsHeld: (calls ?? []).filter((c) => c.outcome === "held").length,
    engagementsAgreed: (engagements ?? []).filter((e) => e.status !== "proposed").length,
    placementsSigned: (outcomes?.placements ?? []).filter((p) => p.signedAt !== undefined).length,
    fullyWithdrawn:
      heldChannels.length > 0 &&
      heldChannels.every((c) =>
        CONSENT_PURPOSES.every((p) => lead.consent[p][c].status !== "opted_in"),
      ),
  });

  const isClient =
    lifecycle === "client" ||
    lifecycle === "placed" ||
    lead.crmStatus === "closed_won" ||
    (ws?.tokens.bought ?? 0) > 0 ||
    !!ws?.access ||
    (engagements ?? []).some((e) => e.status !== "proposed");
  // Delivery is the page a coach opens by habit. A lead who has bought
  // nothing has no delivery to work, so they open on their record instead,
  // which is where their answers are.
  const current: LeadPage = page ?? (isClient ? "delivery" : "record");
  const lineOk = lead.consent.service.line.status === "opted_in";
  const emailOk = lead.consent.service.email.status === "opted_in";

  return (
    <div className="w-full space-y-6">
      {/* Header band, 01/11/2026: the candidate dashboard's dark band, so the
          two surfaces read as one product. Name, stage and the three things a
          coach reaches for most, always in view. */}
      <div className="rounded-extra-large bg-canvas-dark px-6 py-6 text-on-canvas-dark medium:px-8">
        <Link href="/admin" className="text-body-medium text-primary-active underline">
          Back to all leads
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <NicknameTitle leadId={leadId} nickname={lead.nickname ?? undefined} fullName={lead.fullName ?? undefined} />
          <span
            className={`rounded-full px-3 py-0.5 text-label-large ${
              lifecycle === "withdrawn"
                ? "bg-error text-on-error"
                : lifecycle === "placed" || lifecycle === "client"
                  ? "bg-primary text-on-primary"
                  : "bg-cyan-pale text-on-cyan-pale"
            }`}
          >
            {lifecycle ? LIFECYCLE_LABELS[lifecycle] : "Traffic, no contact"}
          </span>
          {lead.crmStatus && (
            <span className="rounded-full bg-orange-pale px-3 py-0.5 text-label-large text-on-orange-pale">
              {CRM_STATUS_LABELS[lead.crmStatus]}
            </span>
          )}
        </div>
        <p className="mt-1 text-body-medium">
          assessment {lead.status} · started {stamp(lead.createdAt)} · last active {stamp(lead.lastActivityAt)} ·{" "}
          {lead.attribution
            ? `via ${
                lead.attribution.raw === "blog_signup" ? "blog newsletter sign-up" : lead.attribution.channel.replace(/_/g, " ")
              }${lead.attribution.campaign ? ` · post ${lead.attribution.campaign}` : ""}`
            : "origin unknown"}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {lead.email && emailOk && (
            <a href={`mailto:${lead.email}`} className="rounded-full bg-primary-active px-4 py-1.5 text-label-large text-ink-deep">
              Email {lead.email}
            </a>
          )}
          {lead.lineId && lineOk && (
            <button
              type="button"
              onClick={() => void navigator.clipboard?.writeText(lead.lineId!)}
              className="rounded-full bg-primary-active px-4 py-1.5 text-label-large text-ink-deep"
              title="Copy"
            >
              Copy LINE ID {lead.lineId}
            </button>
          )}
          {isClient && (
            <a
              href={`/admin/leads/${leadId}/as-candidate`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-primary-active px-4 py-1.5 text-label-large text-primary-active"
            >
              See their dashboard
            </a>
          )}
        </div>
      </div>

      {/* Two pages, 18/11/2026, replacing the Session, Delivery, Fit Report,
          Calls and notes and Assessment tabs. Delivery holds the work and
          answers what to do next; Record holds what we know about the person.
          Sticky, so switching never needs a scroll up. */}
      <nav className="sticky top-0 z-10 -mx-2 flex gap-2 overflow-x-auto bg-surface px-2 py-3" role="tablist">
        {LEAD_PAGES.map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={current === id}
            onClick={() => setPage(id)}
            className={`shrink-0 rounded-full px-4 py-2 text-label-large transition-colors ${
              current === id ? "bg-secondary text-on-secondary" : "bg-canvas-soft text-ink hover:bg-primary-pale"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {current === "delivery" ? (
        <DeliveryPage leadId={leadId} onOpenRecord={() => setPage("record")} />
      ) : (
        <RecordPage leadId={leadId} />
      )}
    </div>
  );
}

type LeadPage = "delivery" | "record";
const LEAD_PAGES: [LeadPage, string][] = [
  ["delivery", "Delivery"],
  ["record", "Record"],
];

/**
 * What the candidate is called, in large type, with their full name under it.
 * Click to set or change it: it is also how their dashboard greets them.
 */
function NicknameTitle({
  leadId,
  nickname,
  fullName,
}: {
  leadId: Id<"leads">;
  nickname?: string;
  fullName?: string;
}) {
  const save = useMutation(api.leads.setCoachFields);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(nickname ?? "");
  if (editing) {
    return (
      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void save({ leadId, nickname: value.trim() || null }).then(() => setEditing(false));
        }}
      >
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Nickname"
          className="h-11 rounded-full bg-canvas px-4 text-title-large text-ink"
        />
        <button type="submit" className="rounded-full bg-primary-active px-4 py-2 text-label-large text-ink-deep">
          Save
        </button>
        <button type="button" onClick={() => setEditing(false)} className="text-label-large text-primary-active underline">
          Cancel
        </button>
      </form>
    );
  }
  return (
    <div>
      <h1 className="text-headline-small text-primary-active">
        {nickname ?? fullName ?? "Anonymous lead"}
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="ml-3 align-middle text-label-large font-normal text-primary-active underline"
        >
          {nickname ? "Edit nickname" : "Add nickname"}
        </button>
      </h1>
      {nickname && fullName && <p className="text-body-medium">{fullName}</p>}
    </div>
  );
}
