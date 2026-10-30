"use client";

/**
 * The coach's preview of a candidate's `/me` page: the identical component fed
 * by `portal.viewAsCoach`, every control inert. What a coach checks here is
 * exactly what the candidate sees, because there is only one screen.
 */

import { use } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../../convex/_generated/dataModel";
import AdminGate from "@/components/AdminGate";
import CandidateApp from "@/components/features/portal/CandidateApp";

function Preview({ id }: { id: string }) {
  const data = useQuery(api.portal.viewAsCoach, { leadId: id as Id<"leads"> });
  if (data === undefined) return <p className="px-6 py-10 text-body-large text-on-surface-variant">Loading...</p>;
  if (data === null) return <p className="px-6 py-10 text-body-large text-error">No lead with that id.</p>;
  return <CandidateApp data={data} readOnly />;
}

export default function AsCandidatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <div className="w-full">
      <AdminGate>
        <p className="mx-auto mt-4 max-w-7xl rounded-small border border-warning bg-warning-container px-4 py-3 text-body-medium text-on-warning-container">
          Coach preview: exactly what this candidate sees at /me, read-only.{" "}
          <Link className="underline" href={`/admin/leads/${id}`}>
            Back to their CRM page
          </Link>
        </p>
        <Preview id={id} />
      </AdminGate>
    </div>
  );
}
