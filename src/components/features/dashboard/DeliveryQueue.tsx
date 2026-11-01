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

  // One tint per client card, rotating, so neighbours read apart at a glance.
  const tints = ["bg-cyan-pale text-on-cyan-pale", "bg-orange-pale text-on-orange-pale", "bg-yellow-pale text-on-yellow-pale", "bg-primary-pale text-on-primary-pale"];
  return (
    <section>
      <h2 className="text-title-large">Clients</h2>
      {rows.length === 0 ? (
        <p className="mt-2 text-body-medium text-on-surface-variant">Nobody with an active purchase.</p>
      ) : (
        <ul className="mt-3 grid gap-4 medium:grid-cols-2 large:grid-cols-3">
          {rows.map((r, i) => {
            const next = r.open[0];
            const overdue = r.open.filter((d) => d.overdue).length;
            return (
              <li key={r.leadId}>
                <Link href={`/admin/leads/${r.leadId}`} className={`block h-full rounded-extra-large px-5 py-4 transition-transform hover:-translate-y-0.5 ${tints[i % tints.length]}`}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-title-large">{r.name}</span>
                    {overdue > 0 && <span className="rounded-full bg-error px-2.5 py-0.5 text-label-medium text-on-error">{overdue} overdue</span>}
                  </div>
                  <p className="mt-2 text-display-small leading-none">
                    {r.tokens} <span className="text-body-large">tokens left</span>
                  </p>
                  <p className="mt-2 text-body-medium">
                    {r.jobsLive} jobs open{r.interviewing ? ` · ${r.interviewing} at interview or offer` : ""}
                  </p>
                  {r.heldCode && (
                    <p className="mt-2 rounded-large bg-canvas px-3 py-1.5 text-body-medium text-ink">
                      Code to send on LINE: <strong className="tracking-widest">{r.heldCode.code}</strong>, until{" "}
                      {new Date(r.heldCode.expiresAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  )}
                  {r.tokenRequestedAt && (
                    <p className="mt-2 rounded-large bg-canvas px-3 py-1.5 text-body-medium text-ink">
                      Asked for more tokens on {day(r.tokenRequestedAt)}: send the transfer details on LINE.
                    </p>
                  )}
                  <p className="mt-3 border-t border-current/20 pt-2 text-body-medium">
                    {next ? (
                      <>
                        Next: {next.title ?? KIND_LABEL[next.kind] ?? next.kind}
                        {next.dueAt ? `, due ${day(next.dueAt)}` : ", no date set"}
                        {r.open.length > 1 ? ` · ${r.open.length - 1} more open` : ""}
                      </>
                    ) : (
                      "Everything sold is delivered."
                    )}
                  </p>
                  <p className="text-body-small opacity-80">
                    {!r.hasAccess
                      ? "No dashboard access yet"
                      : r.lastSignInAt
                        ? `Last on their dashboard ${day(r.lastSignInAt)}`
                        : "Has not signed in yet"}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
