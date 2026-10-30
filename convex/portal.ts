/**
 * The paying candidate's own page, `/me/<token>`.
 *
 * `lifecycle-data-model.md` § 10 leaves the account question open between a
 * revived magic link and a real login. This is the magic link: no password, no
 * `users` row, the token is the credential and a coach issues and revokes it
 * from the Candidate 360 (`workspace.issuePortalLink`). Moving to a real
 * account later replaces `leadForToken` and nothing else.
 *
 * **What crosses this boundary is deliberately small.** No scores, no grade, no
 * temperature, no coach-only notes, no internal ids beyond the row ids the page
 * needs to act on. Everything returned here is something the candidate either
 * gave us or was given by us.
 *
 * TASK-059's rule holds on this side too: the job list is the candidate's
 * notebook. Nothing infers a status, and a row they move becomes theirs.
 */

import { mutation, query, type QueryCtx } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { v, ConvexError } from "convex/values";
import { tokenBalance } from "./workspace";

/** A live portal link's lead, or null. Never says why a link failed. */
async function leadForToken(ctx: QueryCtx, token: string): Promise<Doc<"leads"> | null> {
  if (token.length < 20) return null;
  const link = await ctx.db
    .query("magicLinks")
    .withIndex("by_token", (q) => q.eq("token", token))
    .unique();
  if (!link || link.purpose !== "portal") return null;
  if (link.revokedAt !== undefined || link.expiresAt < Date.now()) return null;
  return await ctx.db.get(link.leadId);
}

async function requireLead(ctx: QueryCtx, token: string): Promise<Doc<"leads">> {
  const lead = await leadForToken(ctx, token);
  // One message for every failure, so a guessed token learns nothing.
  if (!lead) throw new ConvexError("link_invalid");
  return lead;
}

const statusValidator = v.union(
  v.literal("interested"),
  v.literal("applied"),
  v.literal("screening"),
  v.literal("interviewing"),
  v.literal("offer"),
  v.literal("rejected"),
  v.literal("withdrawn"),
  v.literal("accepted"),
);

export const view = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const lead = await leadForToken(ctx, args.token);
    if (!lead) return null;

    const { balance, bought, rows } = await tokenBalance(ctx, lead._id);

    const engagements = await ctx.db
      .query("engagements")
      .withIndex("by_lead", (q) => q.eq("leadId", lead._id))
      .collect();
    const sold = engagements.filter((e) => e.status !== "proposed");
    const soldIds = new Set(sold.map((e) => e._id));
    const deliverables = (
      await ctx.db
        .query("deliverables")
        .withIndex("by_lead", (q) => q.eq("leadId", lead._id))
        .collect()
    )
      .filter((d) => soldIds.has(d.engagementId))
      .sort((a, b) => a.createdAt - b.createdAt)
      .map((d) => ({
        _id: d._id,
        kind: d.kind,
        title: d.title ?? null,
        status: d.status,
        dueAt: d.dueAt ?? null,
        deliveredAt: d.deliveredAt ?? null,
      }));

    const cvs = await Promise.all(
      (
        await ctx.db
          .query("cvDocuments")
          .withIndex("by_lead", (q) => q.eq("leadId", lead._id))
          .collect()
      )
        .filter((c) => c.sharedAt !== undefined)
        .sort((a, b) => b.version - a.version)
        .map(async (c) => ({
          _id: c._id,
          version: c.version,
          author: c.author,
          label: c.label,
          fileName: c.fileName,
          changeNote: c.changeNote ?? null,
          sharedAt: c.sharedAt!,
          url: await ctx.storage.getUrl(c.storageId),
        })),
    );

    const notes = (
      await ctx.db
        .query("deliveryNotes")
        .withIndex("by_lead", (q) => q.eq("leadId", lead._id))
        .collect()
    )
      .filter((n) => n.shared)
      .sort((a, b) => b.at - a.at)
      .map((n) => ({ _id: n._id, body: n.body, at: n.at, applicationId: n.applicationId ?? null }));

    const jobs = (
      await ctx.db
        .query("applications")
        .withIndex("by_lead_time", (q) => q.eq("leadId", lead._id))
        .collect()
    )
      .sort((a, b) => b.statusChangedAt - a.statusChangedAt)
      .map((a) => ({
        _id: a._id,
        employer: a.employer,
        roleTitle: a.roleTitle,
        country: a.country,
        location: a.location ?? null,
        jobUrl: a.jobUrl ?? null,
        salary: a.salary ?? null,
        status: a.status,
        fromUs: a.origin === "matched",
        matchReason: a.matchReason ?? null,
        mine: a.recordedBy === "candidate",
        savedAt: a.savedAt,
        appliedAt: a.appliedAt ?? null,
        deadlineAt: a.deadlineAt ?? null,
        followUpAt: a.followUpAt ?? null,
        notes: a.notes ?? null,
      }));

    const matchedSent = rows.filter((r) => r.reason === "matched_role").reduce((s, r) => s - r.delta, 0);

    return {
      firstName: lead.firstName ?? null,
      tokens: { balance, bought, matchedSent },
      packs: sold.map((e) => ({ module: e.module, status: e.status })),
      deliverables,
      cvs,
      notes,
      jobs,
    };
  },
});

/** Stamp the first open. A query cannot write, so the page calls this once. */
export const opened = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("magicLinks")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();
    if (!link || link.purpose !== "portal" || link.usedAt !== undefined) return;
    if (link.revokedAt !== undefined || link.expiresAt < Date.now()) return;
    await ctx.db.patch(link._id, { usedAt: Date.now() });
  },
});

const clean = (s: string | undefined, max = 300) => {
  const t = (s ?? "").trim();
  return t ? t.slice(0, max) : undefined;
};

/** A job the candidate found themselves. */
export const addJob = mutation({
  args: {
    token: v.string(),
    employer: v.string(),
    roleTitle: v.string(),
    country: v.string(),
    location: v.optional(v.string()),
    jobUrl: v.optional(v.string()),
    salary: v.optional(v.string()),
    status: statusValidator,
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const lead = await requireLead(ctx, args.token);
    const employer = clean(args.employer, 120);
    const roleTitle = clean(args.roleTitle, 160);
    const country = clean(args.country, 80);
    if (!employer || !roleTitle || !country) throw new ConvexError("fields_required");

    const existing = await ctx.db
      .query("applications")
      .withIndex("by_lead_time", (q) => q.eq("leadId", lead._id))
      .collect();
    // A notebook, not a dumping ground: a ceiling well above any real search
    // stops a leaked link being used to fill the table.
    if (existing.length >= 500) throw new ConvexError("too_many");

    const now = Date.now();
    const url = clean(args.jobUrl, 500);
    return await ctx.db.insert("applications", {
      leadId: lead._id,
      employer,
      roleTitle,
      country,
      ...(clean(args.location, 120) ? { location: clean(args.location, 120) } : {}),
      ...(url && /^https?:\/\//i.test(url) ? { jobUrl: url } : {}),
      ...(clean(args.salary, 80) ? { salary: clean(args.salary, 80) } : {}),
      status: args.status,
      recordedBy: "candidate",
      origin: "candidate",
      savedAt: now,
      ...(args.status !== "interested" ? { appliedAt: now } : {}),
      statusChangedAt: now,
      ...(clean(args.notes, 2000) ? { notes: clean(args.notes, 2000) } : {}),
    });
  },
});

async function ownRow(ctx: QueryCtx, token: string, applicationId: Doc<"applications">["_id"]) {
  const lead = await requireLead(ctx, token);
  const row = await ctx.db.get(applicationId);
  if (!row || row.leadId !== lead._id) throw new ConvexError("link_invalid");
  return row;
}

/**
 * The candidate moves a job along. The row becomes theirs from this moment:
 * a matched role they act on is now their application, and a coach can no
 * longer move it for them (`outcomes.updateApplicationStatus` refuses).
 */
export const setJobStatus = mutation({
  args: { token: v.string(), applicationId: v.id("applications"), status: statusValidator },
  handler: async (ctx, args) => {
    const row = await ownRow(ctx, args.token, args.applicationId);
    if (row.status === args.status) return;
    const now = Date.now();
    await ctx.db.patch(row._id, {
      status: args.status,
      recordedBy: "candidate",
      statusChangedAt: now,
      ...(args.status !== "interested" && row.appliedAt === undefined ? { appliedAt: now } : {}),
    });
  },
});

export const updateJob = mutation({
  args: {
    token: v.string(),
    applicationId: v.id("applications"),
    notes: v.optional(v.string()),
    followUpAt: v.optional(v.union(v.number(), v.null())),
  },
  handler: async (ctx, args) => {
    const row = await ownRow(ctx, args.token, args.applicationId);
    await ctx.db.patch(row._id, {
      ...(args.notes !== undefined ? { notes: clean(args.notes, 2000) } : {}),
      ...(args.followUpAt !== undefined ? { followUpAt: args.followUpAt ?? undefined } : {}),
    });
  },
});

/** Only a job they added themselves. A role we sent stays on the record. */
export const removeJob = mutation({
  args: { token: v.string(), applicationId: v.id("applications") },
  handler: async (ctx, args) => {
    const row = await ownRow(ctx, args.token, args.applicationId);
    if (row.origin !== "candidate") throw new ConvexError("not_yours");
    await ctx.db.delete(row._id);
  },
});
