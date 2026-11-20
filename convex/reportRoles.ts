/**
 * The roles the paid Fit Report's last page may show, read once for both
 * audiences. The coach's Candidate 360 passes `leadId`; the candidate's own
 * page passes nothing and is resolved from their session. One query rather
 * than a read on each side, so the coach and the candidate can never be
 * looking at two different lists for the same person.
 *
 * What it does not read: `foundRoles`. A role the coach has not approved and
 * sent does not reach the candidate through a report either, so a waiting row
 * is absent here by decision and not by omission.
 */

import { v } from "convex/values";
import { query, type QueryCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { requireAdmin } from "./leads";
import { signedInCandidate } from "./candidateAccess";
import { targetsFor } from "./targets";
import type { SentRoleRow, TargetRow } from "../src/lib/market-match";

/**
 * How many of a lead's most recent role rows are read before the sent ones are
 * picked out. `origin` sits in no index, so that predicate runs after the index
 * scan and the scan itself has to be bounded. Newest first, so this ceiling can
 * only ever hide a sent role that already has 200 newer rows above it.
 */
const SCAN = 200;

/** What fits on one A4 sheet with an employer, a country, a link and a reason. */
export const ROLE_CAP = 6;

async function coachLead(ctx: QueryCtx, leadId: Id<"leads">): Promise<Id<"leads"> | null> {
  await requireAdmin(ctx);
  const lead = await ctx.db.get(leadId);
  return lead ? lead._id : null;
}

async function ownLead(ctx: QueryCtx): Promise<Id<"leads"> | null> {
  const who = await signedInCandidate(ctx);
  if (who.state !== "candidate") return null;
  // The gate the report itself has: nothing until a coach has shared it.
  if (who.lead.fitReportSharedAt === undefined) return null;
  return who.lead._id;
}

export const forReport = query({
  args: { leadId: v.optional(v.id("leads")) },
  handler: async (ctx, args) => {
    const leadId = args.leadId ? await coachLead(ctx, args.leadId) : await ownLead(ctx);
    if (!leadId) return null;

    const recent = await ctx.db
      .query("applications")
      .withIndex("by_lead_time", (q) => q.eq("leadId", leadId))
      .order("desc")
      .take(SCAN);

    const sent: SentRoleRow[] = recent
      .filter((r) => r.origin === "matched" && r.candidateVerdict !== "down")
      .slice(0, ROLE_CAP)
      .map((r) => ({
        employer: r.employer,
        title: r.roleTitle,
        country: r.country,
        url: r.jobUrl ?? null,
        reason: r.matchReason ?? null,
        liked: r.candidateVerdict === "up",
      }));

    const targets: TargetRow[] = (await targetsFor(ctx, leadId))
      .filter((t) => t.status === "active")
      .map((t) => ({
        title: t.title,
        alsoCalled: t.alsoCalled,
        roleCategory: t.roleCategory ?? null,
        countries: t.countries ?? null,
      }));

    return { sent, targets };
  },
});
