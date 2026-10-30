"use client";

/**
 * Everyone who has paid and what is still owed to them, at the top of the
 * coach dashboard. `workspace.queue` orders it: a sign-in code waiting to be
 * sent first (it expires in minutes), then anyone with overdue work, then the
 * soonest due.
 *
 * Empty until somebody pays, and it says so rather than taking space.
 */

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { KIND_LABEL } from "./DeliveryWorkspace";

const day = (ms: number) =>
  new Date(ms).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

export default function DeliveryQueue() {
  const rows = useQuery(api.workspace.queue, {});
  if (rows === undefined) return null;

  return (
    <section className="rounded-large border border-outline-variant p-5">
      <h2 className="text-title-large">Delivery</h2>
      {rows.length === 0 ? (
        <p className="mt-2 text-body-medium text-on-surface-variant">Nobody with an active purchase.</p>
      ) : (
        <ul className="mt-3 divide-y divide-outline-variant">
          {rows.map((r) => {
            const next = r.open[0];
            const overdue = r.open.filter((d) => d.overdue).length;
            return (
              <li key={r.leadId} className="py-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <Link href={`/admin/leads/${r.leadId}`} className="text-body-large text-ink-deep underline">
                    {r.name}
                  </Link>
                  <span className="text-body-medium text-on-surface-variant">
                    {r.tokens} tokens left · {r.jobsLive} jobs open
                    {r.interviewing ? `, ${r.interviewing} at interview or offer` : ""}
                  </span>
                </div>
                {r.heldCode && (
                  <p className="mt-1 rounded-medium bg-primary-container px-3 py-1.5 text-body-medium text-on-primary-container">
                    Sign-in code to send on LINE: <strong className="tracking-widest">{r.heldCode.code}</strong>, until{" "}
                    {new Date(r.heldCode.expiresAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                )}
                {r.tokenRequestedAt && (
                  <p className="mt-1 text-body-medium text-ink-deep">
                    Asked for more tokens on {day(r.tokenRequestedAt)}: send the transfer details on LINE.
                  </p>
                )}
                <p className="mt-1 text-body-medium text-on-surface-variant">
                  {next ? (
                    <>
                      Next: {next.title ?? KIND_LABEL[next.kind] ?? next.kind}
                      {next.dueAt ? `, due ${day(next.dueAt)}` : ", no date set"}
                      {overdue ? <span className="text-error"> · {overdue} overdue</span> : null}
                      {r.open.length > 1 ? ` · ${r.open.length - 1} more open` : ""}
                    </>
                  ) : (
                    "Everything sold is delivered."
                  )}
                  {!r.hasAccess
                    ? " · no page access yet"
                    : r.lastSignInAt
                      ? ` · last on their page ${day(r.lastSignInAt)}`
                      : " · has not signed in yet"}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
