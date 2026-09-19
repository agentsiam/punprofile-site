"use client";

/**
 * TASK-035: one lead in full. Sits under /admin so the existing proxy matcher
 * (`/admin(.*)`) already covers it, and `requireAdmin` in `convex/leads.ts` is
 * what actually enforces it.
 */

import { use } from "react";
import { useQuery } from "convex/react";
import AdminGate from "@/components/AdminGate";
import LeadDetail from "@/components/features/dashboard/LeadDetail";
import { api } from "../../../../../../convex/_generated/api";

/**
 * The id in the URL is unchecked text. Resolved first, so an id from another
 * table reads as "no lead" instead of throwing a validator error from every
 * query `LeadDetail` runs. Inside `AdminGate`, so it only runs signed in.
 */
function ResolvedLead({ id }: { id: string }) {
  const leadId = useQuery(api.leads.resolveLeadId, { id });
  if (leadId === undefined) {
    return <p className="text-body-large text-on-surface-variant">Loading...</p>;
  }
  if (leadId === null) {
    return <p className="text-body-large text-error">No lead with that id.</p>;
  }
  return <LeadDetail leadId={leadId} />;
}

export default function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    // Wider than the rest of the site on purpose. Every other page is a reading
    // column; this one is two working columns side by side, and 48rem split in
    // half leaves both too narrow to scan.
    <div className="mx-auto w-full max-w-5xl px-6 py-16 leading-normal">
      <AdminGate>
        <ResolvedLead id={id} />
      </AdminGate>
    </div>
  );
}
