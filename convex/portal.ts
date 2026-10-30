/**
 * The paying candidate's own page, `/me`, signed in with email and a code.
 *
 * `lifecycle-data-model.md` § 10 option (b): a real candidate account. Who the
 * candidate is comes from the session (`candidateAccess.signedInCandidate`),
 * never from an argument, so no call here can be pointed at somebody else's
 * record.
 *
 * **What crosses this boundary is deliberately small.** No scores, no grade, no
 * temperature, no coach-only notes, no unshared CV. Everything returned here is
 * something the candidate either gave us or was given by us. `viewAsCoach`
 * returns the identical shape for the coach's preview, so what a coach checks
 * is exactly what the candidate sees.
 *
 * TASK-059's rule holds on this side too: the job list is the candidate's
 * notebook. Nothing infers a status, and a row they move becomes theirs.
 */

import { mutation, query, type QueryCtx, type MutationCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { v, ConvexError } from "convex/values";
import { tokenBalance } from "./workspace";
import { signedInCandidate } from "./candidateAccess";
import { requireAdmin } from "./leads";
import { isAdminEmail } from "./adminEmails";
import { getAuthUserId } from "@convex-dev/auth/server";

async function requireLead(ctx: MutationCtx): Promise<Doc<"leads">> {
  const who = await signedInCandidate(ctx);
  if (who.state !== "candidate") throw new ConvexError("not_signed_in");
  return who.lead;
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

async function buildView(ctx: QueryCtx, lead: Doc<"leads">) {
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
    const sharedCvIds = new Set(cvs.map((c) => c._id as string));

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
        excitement: a.excitement ?? null,
        interviews: a.interviews ?? [],
        contacts: a.contacts ?? [],
        // Only a CV they can see. A coach may link an unshared draft; that link
        // stays on the coach's side.
        cvDocumentId: a.cvDocumentId && sharedCvIds.has(a.cvDocumentId) ? a.cvDocumentId : null,
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
}

export type PortalView = Awaited<ReturnType<typeof buildView>>;

/**
 * Who is looking, and their page if they may see it. `state` lets the page
 * tell signed-out from signed-in-without-access from a coach, so each gets its
 * own screen rather than one vague error.
 */
export const view = query({
  args: {},
  handler: async (ctx) => {
    const who = await signedInCandidate(ctx);
    if (who.state === "candidate") {
      return { state: "candidate" as const, data: await buildView(ctx, who.lead) };
    }
    if (who.state === "no_access" && isAdminEmail(who.email)) {
      return { state: "coach" as const, data: null };
    }
    return { state: who.state, data: null };
  },
});

/** The coach's preview of one candidate's page, read-only, same shape. */
export const viewAsCoach = query({
  args: { leadId: v.id("leads") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const lead = await ctx.db.get(args.leadId);
    if (!lead) return null;
    return await buildView(ctx, lead);
  },
});

/** Whether anyone is signed in at all; used by the sign-in screen. */
export const signedIn = query({
  args: {},
  handler: async (ctx) => (await getAuthUserId(ctx)) !== null,
});

const clean = (s: string | undefined, max = 300) => {
  const t = (s ?? "").trim();
  return t ? t.slice(0, max) : undefined;
};

/** A job the candidate found themselves. */
export const addJob = mutation({
  args: {
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
    const lead = await requireLead(ctx);
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

async function ownRow(ctx: MutationCtx, applicationId: Id<"applications">) {
  const lead = await requireLead(ctx);
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
  args: { applicationId: v.id("applications"), status: statusValidator },
  handler: async (ctx, args) => {
    const row = await ownRow(ctx, args.applicationId);
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

/**
 * The candidate's own fields on any row in their list: notes, follow-up date,
 * how much they want it, and which shared CV they sent. The job's own details
 * (employer, title, where, salary, closing date) are editable only on a row
 * they added; on a role we sent, those are what we sent.
 */
export const updateJob = mutation({
  args: {
    applicationId: v.id("applications"),
    notes: v.optional(v.string()),
    followUpAt: v.optional(v.union(v.number(), v.null())),
    excitement: v.optional(v.union(v.number(), v.null())),
    cvDocumentId: v.optional(v.union(v.id("cvDocuments"), v.null())),
    employer: v.optional(v.string()),
    roleTitle: v.optional(v.string()),
    country: v.optional(v.string()),
    location: v.optional(v.string()),
    jobUrl: v.optional(v.string()),
    salary: v.optional(v.string()),
    deadlineAt: v.optional(v.union(v.number(), v.null())),
    interviews: v.optional(
      v.array(
        v.object({
          round: v.string(),
          at: v.optional(v.number()),
          format: v.optional(v.union(v.literal("video"), v.literal("phone"), v.literal("onsite"))),
          interviewers: v.optional(v.string()),
          notes: v.optional(v.string()),
        }),
      ),
    ),
    contacts: v.optional(
      v.array(
        v.object({
          name: v.string(),
          role: v.optional(v.string()),
          email: v.optional(v.string()),
          linkedin: v.optional(v.string()),
        }),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const row = await ownRow(ctx, args.applicationId);
    const patch: Record<string, unknown> = {};
    if (args.notes !== undefined) patch.notes = clean(args.notes, 2000);
    if (args.followUpAt !== undefined) patch.followUpAt = args.followUpAt ?? undefined;
    if (args.excitement !== undefined) {
      if (args.excitement !== null && (!Number.isInteger(args.excitement) || args.excitement < 1 || args.excitement > 5)) {
        throw new ConvexError("bad_value");
      }
      patch.excitement = args.excitement ?? undefined;
    }
    if (args.cvDocumentId !== undefined) {
      if (args.cvDocumentId) {
        const cv = await ctx.db.get(args.cvDocumentId);
        if (!cv || cv.leadId !== row.leadId || cv.sharedAt === undefined) throw new ConvexError("bad_value");
      }
      patch.cvDocumentId = args.cvDocumentId ?? undefined;
    }
    // Rounds and contacts are the candidate's notebook on any row, ours or theirs.
    if (args.interviews !== undefined) {
      if (args.interviews.length > 20) throw new ConvexError("too_many");
      patch.interviews = args.interviews
        .map((i) => ({
          round: clean(i.round, 80) ?? "",
          ...(i.at !== undefined ? { at: i.at } : {}),
          ...(i.format ? { format: i.format } : {}),
          ...(clean(i.interviewers, 200) ? { interviewers: clean(i.interviewers, 200) } : {}),
          ...(clean(i.notes, 2000) ? { notes: clean(i.notes, 2000) } : {}),
        }))
        .filter((i) => i.round);
    }
    if (args.contacts !== undefined) {
      if (args.contacts.length > 20) throw new ConvexError("too_many");
      patch.contacts = args.contacts
        .map((c) => {
          const li = clean(c.linkedin, 300);
          return {
            name: clean(c.name, 120) ?? "",
            ...(clean(c.role, 80) ? { role: clean(c.role, 80) } : {}),
            ...(clean(c.email, 200) ? { email: clean(c.email, 200) } : {}),
            ...(li && /^https?:\/\//i.test(li) ? { linkedin: li } : {}),
          };
        })
        .filter((c) => c.name);
    }
    const details = ["employer", "roleTitle", "country", "location", "jobUrl", "salary", "deadlineAt"] as const;
    if (details.some((k) => args[k] !== undefined)) {
      if (row.origin !== "candidate") throw new ConvexError("not_yours");
      for (const k of ["employer", "roleTitle", "country"] as const) {
        if (args[k] !== undefined) {
          const t = clean(args[k], 160);
          if (!t) throw new ConvexError("fields_required");
          patch[k] = t;
        }
      }
      if (args.location !== undefined) patch.location = clean(args.location, 120);
      if (args.salary !== undefined) patch.salary = clean(args.salary, 80);
      if (args.jobUrl !== undefined) {
        const u = clean(args.jobUrl, 500);
        patch.jobUrl = u && /^https?:\/\//i.test(u) ? u : undefined;
      }
      if (args.deadlineAt !== undefined) patch.deadlineAt = args.deadlineAt ?? undefined;
    }
    await ctx.db.patch(row._id, patch);
  },
});

/** Only a job they added themselves. A role we sent stays on the record. */
export const removeJob = mutation({
  args: { applicationId: v.id("applications") },
  handler: async (ctx, args) => {
    const row = await ownRow(ctx, args.applicationId);
    if (row.origin !== "candidate") throw new ConvexError("not_yours");
    await ctx.db.delete(row._id);
  },
});
