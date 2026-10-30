/**
 * The coach's delivery workspace on the Candidate 360. Everything a paying
 * candidate gets after the sale, in one module: the token wallet, the CV
 * versions, the delivery notes, the matched roles, and the link to the
 * candidate's own page.
 *
 * `lifecycle-data-model.md` §§ 7 to 9 own `engagements`, `deliverables` and
 * `applications`, and `delivery.ts` and `outcomes.ts` keep their mutations.
 * This module adds the tables those sections left open: `tokenLedger`,
 * `cvDocuments`, `deliveryNotes`, and `candidateAccess`.
 *
 * Every function here is admin-only. The candidate's side is `portal.ts`, which
 * reads the signed-in candidate's own record and exposes a smaller view.
 */

import { mutation, query, type QueryCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { v, ConvexError } from "convex/values";
import { requireAdmin } from "./leads";
import { isAdminEmail } from "./adminEmails";
import { liveGrant, normaliseEmail } from "./candidateAccess";

/* ------------------------------------------------------------------ tokens */

/** Sum of the ledger. Never stored, see the schema note on `tokenLedger`. */
export async function tokenBalance(ctx: QueryCtx, leadId: Id<"leads">) {
  const rows = await ctx.db
    .query("tokenLedger")
    .withIndex("by_lead", (q) => q.eq("leadId", leadId))
    .collect();
  let bought = 0;
  let spent = 0;
  for (const r of rows) {
    if (r.delta > 0) bought += r.delta;
    else spent += -r.delta;
  }
  return { balance: bought - spent, bought, spent, rows };
}

const ledgerReason = v.union(
  v.literal("purchase"),
  v.literal("fit_report"),
  v.literal("matched_role"),
  v.literal("cash_refund"),
  v.literal("adjustment"),
);

/**
 * One movement in the wallet. Purchases are positive, everything that spends
 * is negative, and the sign is enforced from the reason so a slip of the minus
 * key cannot turn a deduction into a top-up.
 */
export const recordTokens = mutation({
  args: {
    leadId: v.id("leads"),
    reason: ledgerReason,
    /** Always the size of the movement, positive. The sign comes from `reason`. */
    amount: v.number(),
    /** Only for `adjustment`, which may go either way. */
    direction: v.optional(v.union(v.literal("add"), v.literal("remove"))),
    engagementId: v.optional(v.id("engagements")),
    deliverableId: v.optional(v.id("deliverables")),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const by = await requireAdmin(ctx);
    const lead = await ctx.db.get(args.leadId);
    if (!lead) throw new ConvexError("Lead not found.");
    if (!Number.isInteger(args.amount) || args.amount <= 0) {
      throw new ConvexError("Amount is a whole number of tokens, above zero.");
    }

    let sign: 1 | -1;
    if (args.reason === "purchase") sign = 1;
    else if (args.reason === "adjustment") {
      if (!args.direction) throw new ConvexError("Say whether the adjustment adds or removes.");
      if (!args.note?.trim()) throw new ConvexError("An adjustment needs a note saying why.");
      sign = args.direction === "add" ? 1 : -1;
    } else sign = -1;

    // A wallet cannot go below zero. Tokens are prepaid, so a negative balance
    // would be work delivered on credit, which nothing in `pricing.ts` sells.
    if (sign < 0) {
      const { balance } = await tokenBalance(ctx, args.leadId);
      if (balance < args.amount) {
        throw new ConvexError(`Only ${balance} tokens left; this needs ${args.amount}.`);
      }
    }

    for (const [id, table] of [
      [args.engagementId, "engagement"],
      [args.deliverableId, "deliverable"],
    ] as const) {
      if (!id) continue;
      const row = await ctx.db.get(id);
      if (!row || row.leadId !== args.leadId) {
        throw new ConvexError(`That ${table} belongs to a different lead.`);
      }
    }

    return await ctx.db.insert("tokenLedger", {
      leadId: args.leadId,
      delta: sign * args.amount,
      reason: args.reason,
      ...(args.engagementId ? { engagementId: args.engagementId } : {}),
      ...(args.deliverableId ? { deliverableId: args.deliverableId } : {}),
      ...(args.note?.trim() ? { note: args.note.trim() } : {}),
      at: Date.now(),
      by,
    });
  },
});

/* --------------------------------------------------------------------- CVs */

/** Step one of an upload: a short-lived URL the browser POSTs the file to. */
export const cvUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

/** Word, PDF and plain text. Anything else is refused rather than stored. */
const CV_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]);
const CV_MAX_BYTES = 10 * 1024 * 1024;

/**
 * Step two: attach the uploaded file to the lead as the next version.
 *
 * Size and type are read from the stored file, not from what the browser
 * claimed, and a refused file is deleted from storage in the same call so a
 * rejected upload leaves nothing behind.
 */
export const saveCv = mutation({
  args: {
    leadId: v.id("leads"),
    storageId: v.id("_storage"),
    fileName: v.string(),
    author: v.union(v.literal("candidate"), v.literal("coach")),
    label: v.string(),
    basedOn: v.optional(v.id("cvDocuments")),
    changeNote: v.optional(v.string()),
    deliverableId: v.optional(v.id("deliverables")),
    /** When the candidate sent it, for `author: candidate`. Defaults to now. */
    receivedAt: v.optional(v.number()),
    share: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const by = await requireAdmin(ctx);
    const lead = await ctx.db.get(args.leadId);
    if (!lead) {
      await ctx.storage.delete(args.storageId);
      throw new ConvexError("Lead not found.");
    }

    const meta = await ctx.db.system.get(args.storageId);
    if (!meta) throw new ConvexError("The upload did not arrive. Try again.");
    const contentType = meta.contentType ?? "";
    if (!CV_TYPES.has(contentType)) {
      await ctx.storage.delete(args.storageId);
      throw new ConvexError("Only PDF, Word or plain text.");
    }
    if (meta.size > CV_MAX_BYTES) {
      await ctx.storage.delete(args.storageId);
      throw new ConvexError("Over 10 MB.");
    }

    if (args.basedOn) {
      const base = await ctx.db.get(args.basedOn);
      if (!base || base.leadId !== args.leadId) {
        await ctx.storage.delete(args.storageId);
        throw new ConvexError("That earlier version belongs to a different lead.");
      }
    }
    if (args.deliverableId) {
      const d = await ctx.db.get(args.deliverableId);
      if (!d || d.leadId !== args.leadId) {
        await ctx.storage.delete(args.storageId);
        throw new ConvexError("That deliverable belongs to a different lead.");
      }
    }

    const label = args.label.trim();
    if (!label) {
      await ctx.storage.delete(args.storageId);
      throw new ConvexError("Give the version a name.");
    }

    const existing = await ctx.db
      .query("cvDocuments")
      .withIndex("by_lead", (q) => q.eq("leadId", args.leadId))
      .collect();
    const version = existing.reduce((m, r) => Math.max(m, r.version), 0) + 1;
    const now = Date.now();

    const id = await ctx.db.insert("cvDocuments", {
      leadId: args.leadId,
      version,
      author: args.author,
      label,
      storageId: args.storageId,
      fileName: args.fileName.trim() || `cv-v${version}`,
      contentType,
      bytes: meta.size,
      ...(args.basedOn ? { basedOn: args.basedOn } : {}),
      ...(args.changeNote?.trim() ? { changeNote: args.changeNote.trim() } : {}),
      ...(args.deliverableId ? { deliverableId: args.deliverableId } : {}),
      ...(args.share ? { sharedAt: now } : {}),
      // TASK-063 interim basis: a file that reached a coach by message.
      consentSource: "coach_direct",
      cvConsentAt: args.author === "candidate" ? (args.receivedAt ?? now) : now,
      linkedBy: "manual",
      uploadedAt: now,
      by,
    });

    // The CV column on the lead list reads this stamp. The first candidate
    // file sets it; a later one leaves the original date alone.
    if (args.author === "candidate" && lead.cvReceivedAt === undefined) {
      await ctx.db.patch(args.leadId, { cvReceivedAt: args.receivedAt ?? now, updatedAt: now });
    }
    return id;
  },
});

export const updateCv = mutation({
  args: {
    cvId: v.id("cvDocuments"),
    label: v.optional(v.string()),
    changeNote: v.optional(v.string()),
    shared: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const row = await ctx.db.get(args.cvId);
    if (!row) throw new ConvexError("CV not found.");
    const patch: Record<string, unknown> = {};
    if (args.label !== undefined) {
      if (!args.label.trim()) throw new ConvexError("A version needs a name.");
      patch.label = args.label.trim();
    }
    if (args.changeNote !== undefined) patch.changeNote = args.changeNote.trim() || undefined;
    if (args.shared !== undefined) patch.sharedAt = args.shared ? (row.sharedAt ?? Date.now()) : undefined;
    await ctx.db.patch(args.cvId, patch);
  },
});

/**
 * Remove one version and its file. For a file attached to the wrong person or
 * uploaded by mistake; a superseded version is kept, that is the point of
 * versions. Anything pointing at it loses the pointer rather than dangling.
 */
export const deleteCv = mutation({
  args: { cvId: v.id("cvDocuments") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const row = await ctx.db.get(args.cvId);
    if (!row) return;
    const siblings = await ctx.db
      .query("cvDocuments")
      .withIndex("by_lead", (q) => q.eq("leadId", row.leadId))
      .collect();
    for (const s of siblings) if (s.basedOn === row._id) await ctx.db.patch(s._id, { basedOn: undefined });
    const apps = await ctx.db
      .query("applications")
      .withIndex("by_lead_time", (q) => q.eq("leadId", row.leadId))
      .collect();
    for (const a of apps) if (a.cvDocumentId === row._id) await ctx.db.patch(a._id, { cvDocumentId: undefined });
    await ctx.storage.delete(row.storageId);
    await ctx.db.delete(row._id);
  },
});

/* ------------------------------------------------------------------ notes */

export const addNote = mutation({
  args: {
    leadId: v.id("leads"),
    body: v.string(),
    shared: v.boolean(),
    deliverableId: v.optional(v.id("deliverables")),
    applicationId: v.optional(v.id("applications")),
  },
  handler: async (ctx, args) => {
    const by = await requireAdmin(ctx);
    const body = args.body.trim();
    if (!body) throw new ConvexError("The note is empty.");
    const lead = await ctx.db.get(args.leadId);
    if (!lead) throw new ConvexError("Lead not found.");
    for (const id of [args.deliverableId, args.applicationId]) {
      if (!id) continue;
      const row = await ctx.db.get(id);
      if (!row || row.leadId !== args.leadId) throw new ConvexError("That row belongs to a different lead.");
    }
    return await ctx.db.insert("deliveryNotes", {
      leadId: args.leadId,
      body,
      shared: args.shared,
      ...(args.deliverableId ? { deliverableId: args.deliverableId } : {}),
      ...(args.applicationId ? { applicationId: args.applicationId } : {}),
      at: Date.now(),
      by,
    });
  },
});

export const updateNote = mutation({
  args: { noteId: v.id("deliveryNotes"), body: v.optional(v.string()), shared: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const row = await ctx.db.get(args.noteId);
    if (!row) throw new ConvexError("Note not found.");
    if (args.body !== undefined && !args.body.trim()) throw new ConvexError("The note is empty.");
    await ctx.db.patch(args.noteId, {
      ...(args.body !== undefined ? { body: args.body.trim() } : {}),
      ...(args.shared !== undefined ? { shared: args.shared } : {}),
    });
  },
});

export const deleteNote = mutation({
  args: { noteId: v.id("deliveryNotes") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.noteId);
  },
});

/* ------------------------------------------------------------ matched roles */

/**
 * Send one screened role to the candidate, and spend its token, in one
 * transaction. `pricing.ts`: "a token is only deducted once a role matching
 * your criteria has reached you". The row appearing on their page is that
 * moment, so the insert and the deduction cannot be separated.
 */
export const sendMatchedRole = mutation({
  args: {
    leadId: v.id("leads"),
    engagementId: v.optional(v.id("engagements")),
    employer: v.string(),
    roleTitle: v.string(),
    country: v.string(),
    location: v.optional(v.string()),
    jobUrl: v.optional(v.string()),
    salary: v.optional(v.string()),
    deadlineAt: v.optional(v.number()),
    matchReason: v.optional(v.string()),
    jobDescription: v.optional(v.string()),
    jobLogId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const by = await requireAdmin(ctx);
    const lead = await ctx.db.get(args.leadId);
    if (!lead) throw new ConvexError("Lead not found.");
    const employer = args.employer.trim();
    const roleTitle = args.roleTitle.trim();
    const country = args.country.trim();
    if (!employer || !roleTitle || !country) {
      throw new ConvexError("Employer, role and country are all required.");
    }
    if (args.engagementId) {
      const e = await ctx.db.get(args.engagementId);
      if (!e || e.leadId !== args.leadId) throw new ConvexError("That engagement belongs to a different lead.");
    }

    const { balance } = await tokenBalance(ctx, args.leadId);
    if (balance < 1) throw new ConvexError("No tokens left. Record a purchase first.");

    const now = Date.now();
    const applicationId = await ctx.db.insert("applications", {
      leadId: args.leadId,
      ...(args.engagementId ? { engagementId: args.engagementId } : {}),
      ...(args.jobLogId ? { jobLogId: args.jobLogId } : {}),
      employer,
      roleTitle,
      country,
      ...(args.location?.trim() ? { location: args.location.trim() } : {}),
      ...(args.jobUrl?.trim() ? { jobUrl: args.jobUrl.trim() } : {}),
      ...(args.salary?.trim() ? { salary: args.salary.trim() } : {}),
      ...(args.deadlineAt ? { deadlineAt: args.deadlineAt } : {}),
      ...(args.matchReason?.trim() ? { matchReason: args.matchReason.trim() } : {}),
      ...(args.jobDescription?.trim() ? { jobDescription: args.jobDescription.trim().slice(0, 20000) } : {}),
      status: "interested",
      // Coach-recorded so the coach can correct it; once the candidate moves
      // it on their page the row becomes theirs. See `portal.setJobStatus`.
      recordedBy: "coach",
      origin: "matched",
      savedAt: now,
      statusChangedAt: now,
    });
    await ctx.db.insert("tokenLedger", {
      leadId: args.leadId,
      delta: -1,
      reason: "matched_role",
      applicationId,
      ...(args.engagementId ? { engagementId: args.engagementId } : {}),
      at: now,
      by,
    });
    return applicationId;
  },
});

/**
 * Take a matched role back, e.g. sent to the wrong person or the posting was
 * already closed. Its token returns to the wallet, because the candidate never
 * received a role they could use. Only while it is still untouched by them.
 */
export const withdrawMatchedRole = mutation({
  args: { applicationId: v.id("applications"), note: v.string() },
  handler: async (ctx, args) => {
    const by = await requireAdmin(ctx);
    const row = await ctx.db.get(args.applicationId);
    if (!row) throw new ConvexError("Role not found.");
    if (row.origin !== "matched") throw new ConvexError("Only a matched role can be withdrawn here.");
    if (row.recordedBy === "candidate") {
      throw new ConvexError("The candidate has already worked on this one. Leave it with them.");
    }
    if (!args.note.trim()) throw new ConvexError("Say why it is being withdrawn.");
    const spent = await ctx.db
      .query("tokenLedger")
      .withIndex("by_application", (q) => q.eq("applicationId", args.applicationId))
      .collect();
    const now = Date.now();
    const net = spent.reduce((s, r) => s + r.delta, 0);
    if (net < 0) {
      await ctx.db.insert("tokenLedger", {
        leadId: row.leadId,
        delta: -net,
        reason: "adjustment",
        note: `Matched role withdrawn: ${row.roleTitle} at ${row.employer}. ${args.note.trim()}`,
        at: now,
        by,
      });
    }
    for (const r of spent) await ctx.db.patch(r._id, { applicationId: undefined });
    await ctx.db.delete(args.applicationId);
  },
});

/** Coach edits to the job details of a row the coach owns. */
export const updateApplicationDetails = mutation({
  args: {
    applicationId: v.id("applications"),
    employer: v.optional(v.string()),
    roleTitle: v.optional(v.string()),
    country: v.optional(v.string()),
    location: v.optional(v.string()),
    jobUrl: v.optional(v.string()),
    salary: v.optional(v.string()),
    matchReason: v.optional(v.string()),
    deadlineAt: v.optional(v.union(v.number(), v.null())),
    followUpAt: v.optional(v.union(v.number(), v.null())),
    cvDocumentId: v.optional(v.union(v.id("cvDocuments"), v.null())),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const row = await ctx.db.get(args.applicationId);
    if (!row) throw new ConvexError("Application not found.");
    // The candidate's own rows: a coach may add a note or link the CV that went
    // with it, never rewrite what they recorded about their own search.
    const candidateOwned = row.recordedBy === "candidate";
    const patch: Record<string, unknown> = {};
    const text = (k: keyof typeof args, required = false) => {
      const val = args[k];
      if (val === undefined || typeof val !== "string") return;
      if (candidateOwned) throw new ConvexError("This row is the candidate's own. Add a note instead.");
      const t = val.trim();
      if (required && !t) throw new ConvexError(`${String(k)} cannot be empty.`);
      patch[k] = t || undefined;
    };
    text("employer", true);
    text("roleTitle", true);
    text("country", true);
    text("location");
    text("jobUrl");
    text("salary");
    text("matchReason");
    if (args.deadlineAt !== undefined) patch.deadlineAt = args.deadlineAt ?? undefined;
    if (args.followUpAt !== undefined) patch.followUpAt = args.followUpAt ?? undefined;
    if (args.cvDocumentId !== undefined) {
      if (args.cvDocumentId) {
        const cv = await ctx.db.get(args.cvDocumentId);
        if (!cv || cv.leadId !== row.leadId) throw new ConvexError("That CV belongs to a different lead.");
      }
      patch.cvDocumentId = args.cvDocumentId ?? undefined;
    }
    if (args.notes !== undefined) patch.notes = args.notes.trim() || undefined;
    await ctx.db.patch(args.applicationId, patch);
  },
});

/* ------------------------------------------------------------ sign-in */

/**
 * Let this candidate sign in to their own page at `/me`, with the address
 * given or the lead's own. One live grant per lead: a new address replaces the
 * old one, and the old row is kept, revoked, as history.
 */
export const grantAccess = mutation({
  args: { leadId: v.id("leads"), email: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const by = await requireAdmin(ctx);
    const lead = await ctx.db.get(args.leadId);
    if (!lead) throw new ConvexError("Lead not found.");
    const email = normaliseEmail(args.email ?? lead.email ?? "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ConvexError("That is not an email address.");
    if (isAdminEmail(email)) throw new ConvexError("That address is a coach account.");

    const taken = await liveGrant(ctx, email);
    if (taken && taken.leadId !== args.leadId) {
      throw new ConvexError("That address already opens another candidate's page. Switch that one off first.");
    }

    const now = Date.now();
    const mine = await ctx.db
      .query("candidateAccess")
      .withIndex("by_lead", (q) => q.eq("leadId", args.leadId))
      .collect();
    for (const g of mine) {
      if (g.revokedAt === undefined) {
        if (g.email === email) return g._id;
        await ctx.db.patch(g._id, { revokedAt: now });
      }
    }
    return await ctx.db.insert("candidateAccess", { leadId: args.leadId, email, grantedAt: now, by });
  },
});

export const revokeAccess = mutation({
  args: { leadId: v.id("leads") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const now = Date.now();
    const mine = await ctx.db
      .query("candidateAccess")
      .withIndex("by_lead", (q) => q.eq("leadId", args.leadId))
      .collect();
    for (const g of mine) if (g.revokedAt === undefined) await ctx.db.patch(g._id, { revokedAt: now });
  },
});

/* ------------------------------------------------------------------- read */

/**
 * Everything the delivery workspace on the 360 page shows, in one query, so
 * the panel renders from one consistent snapshot.
 */
export const forLead = query({
  args: { leadId: v.id("leads") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { balance, bought, spent, rows: ledger } = await tokenBalance(ctx, args.leadId);

    const cvRows = await ctx.db
      .query("cvDocuments")
      .withIndex("by_lead", (q) => q.eq("leadId", args.leadId))
      .collect();
    const cvs = await Promise.all(
      cvRows
        .sort((a, b) => b.version - a.version)
        .map(async (c) => ({ ...c, url: await ctx.storage.getUrl(c.storageId) })),
    );

    const notes = (
      await ctx.db
        .query("deliveryNotes")
        .withIndex("by_lead", (q) => q.eq("leadId", args.leadId))
        .collect()
    ).sort((a, b) => b.at - a.at);

    const applications = (
      await ctx.db
        .query("applications")
        .withIndex("by_lead_time", (q) => q.eq("leadId", args.leadId))
        .collect()
    ).sort((a, b) => b.statusChangedAt - a.statusChangedAt);

    const access = (
      await ctx.db
        .query("candidateAccess")
        .withIndex("by_lead", (q) => q.eq("leadId", args.leadId))
        .collect()
    ).find((g) => g.revokedAt === undefined);
    const held = access
      ? (
          await ctx.db
            .query("pendingSignInCodes")
            .withIndex("by_email", (q) => q.eq("email", access.email))
            .collect()
        ).find((c) => c.expiresAt > Date.now())
      : undefined;
    const heldCode = held ? { code: held.code, expiresAt: held.expiresAt } : null;
    const openRequest = (
      await ctx.db
        .query("tokenRequests")
        .withIndex("by_lead", (q) => q.eq("leadId", args.leadId))
        .collect()
    ).find((r) => r.handledAt === undefined);
    const lead = await ctx.db.get(args.leadId);
    const ratedCount = new Set(
      (
        await ctx.db
          .query("competencyRatings")
          .withIndex("by_lead_item", (q) => q.eq("leadId", args.leadId))
          .collect()
      ).map((r) => r.itemKey),
    ).size;

    return {
      tokens: {
        balance,
        bought,
        spent,
        ledger: ledger.sort((a, b) => b.at - a.at),
      },
      cvs,
      notes,
      applications,
      access: access
        ? { email: access.email, grantedAt: access.grantedAt, lastSignInAt: access.lastSignInAt ?? null }
        : null,
      heldCode,
      tokenRequest: openRequest ? { _id: openRequest._id, at: openRequest.at } : null,
      fitReport: { shared: lead?.fitReportSharedAt !== undefined, rated: ratedCount },
    };
  },
});

/* ------------------------------------------------------------------ queue */

/**
 * Everyone who has paid, with what is owed to them, for the top of the coach
 * dashboard. The delivery counterpart of `ConsultationQueues`: things already
 * promised and not yet done, soonest first, so nothing paid for waits unseen.
 */
export const queue = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const now = Date.now();
    const live = (await ctx.db.query("engagements").collect()).filter(
      (e) => e.status === "agreed" || e.status === "active",
    );
    const byLead = new Map<Id<"leads">, typeof live>();
    for (const e of live) byLead.set(e.leadId, [...(byLead.get(e.leadId) ?? []), e]);

    type Row = {
      leadId: Id<"leads">;
      name: string;
      modules: string[];
      tokens: number;
      open: { _id: Id<"deliverables">; kind: string; title: string | null; status: string; dueAt: number | null; overdue: boolean }[];
      heldCode: { code: string; expiresAt: number } | null;
      hasAccess: boolean;
      lastSignInAt: number | null;
      jobsLive: number;
      interviewing: number;
      tokenRequestedAt: number | null;
    };
    const rows: Row[] = [];
    for (const [leadId, engagements] of byLead) {
      const lead = await ctx.db.get(leadId);
      if (!lead) continue;
      const ids = new Set(engagements.map((e) => e._id as string));
      const open = (
        await ctx.db
          .query("deliverables")
          .withIndex("by_lead", (q) => q.eq("leadId", leadId))
          .collect()
      )
        .filter((d) => ids.has(d.engagementId) && d.status !== "delivered")
        .sort((a, b) => (a.dueAt ?? Infinity) - (b.dueAt ?? Infinity));
      const { balance } = await tokenBalance(ctx, leadId);
      const access = (
        await ctx.db
          .query("candidateAccess")
          .withIndex("by_lead", (q) => q.eq("leadId", leadId))
          .collect()
      ).find((g) => g.revokedAt === undefined);
      const held = access
        ? (
            await ctx.db
              .query("pendingSignInCodes")
              .withIndex("by_email", (q) => q.eq("email", access.email))
              .collect()
          ).find((c) => c.expiresAt > now)
        : undefined;
      const apps = await ctx.db
        .query("applications")
        .withIndex("by_lead_time", (q) => q.eq("leadId", leadId))
        .collect();
      const live = apps.filter((a) => !["rejected", "withdrawn", "accepted"].includes(a.status));
      const interviewing = live.filter((a) => a.status === "interviewing" || a.status === "offer").length;
      rows.push({
        leadId,
        name: lead.firstName ?? lead.fullName ?? lead.email ?? "Unnamed",
        modules: engagements.map((e) => e.module),
        tokens: balance,
        open: open.map((d) => ({
          _id: d._id,
          kind: d.kind,
          title: d.title ?? null,
          status: d.status,
          dueAt: d.dueAt ?? null,
          overdue: d.dueAt !== undefined && d.dueAt < now,
        })),
        heldCode: held ? { code: held.code, expiresAt: held.expiresAt } : null,
        hasAccess: !!access,
        lastSignInAt: access?.lastSignInAt ?? null,
        jobsLive: live.length,
        interviewing,
        tokenRequestedAt:
          (
            await ctx.db
              .query("tokenRequests")
              .withIndex("by_lead", (q) => q.eq("leadId", leadId))
              .collect()
          ).find((t) => t.handledAt === undefined)?.at ?? null,
      });
    }
    // Held codes first (they expire in minutes), then overdue, then soonest due.
    const firstDue = (r: Row) => r.open[0]?.dueAt ?? Infinity;
    return rows.sort(
      (a, b) =>
        Number(!!b.heldCode) - Number(!!a.heldCode) ||
        Number(!!b.tokenRequestedAt) - Number(!!a.tokenRequestedAt) ||
        Number(b.open.some((d) => d.overdue)) - Number(a.open.some((d) => d.overdue)) ||
        firstDue(a) - firstDue(b),
    );
  },
});

/* ------------------------------------------------------- report + requests */

/** Put the Fit Report on the candidate's page, or take it off. */
export const shareFitReport = mutation({
  args: { leadId: v.id("leads"), shared: v.boolean() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const lead = await ctx.db.get(args.leadId);
    if (!lead) throw new ConvexError("Lead not found.");
    if (args.shared) {
      const rated = await ctx.db
        .query("competencyRatings")
        .withIndex("by_lead_item", (q) => q.eq("leadId", args.leadId))
        .first();
      if (!rated) throw new ConvexError("Rate the interview first; the report has nothing coach-scored yet.");
    }
    await ctx.db.patch(args.leadId, { fitReportSharedAt: args.shared ? (lead.fitReportSharedAt ?? Date.now()) : undefined });
  },
});

export const handleTokenRequest = mutation({
  args: { requestId: v.id("tokenRequests"), note: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const row = await ctx.db.get(args.requestId);
    if (!row || row.handledAt !== undefined) return;
    await ctx.db.patch(args.requestId, { handledAt: Date.now(), ...(args.note?.trim() ? { note: args.note.trim() } : {}) });
  },
});
