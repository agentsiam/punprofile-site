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

import { TOKEN_PRICE } from "../src/lib/tokenPrices";
import { INTERVIEW_ITEMS } from "../src/lib/fitInterview";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { v, ConvexError } from "convex/values";
import { requireAdmin } from "./leads";
import { isAdminEmail } from "./adminEmails";
import { liveGrant, normaliseEmail } from "./candidateAccess";
import { targetsFor } from "./targets";
import { computeWallet, cvEarnedBySelectionNow } from "../src/lib/wallet";
import { preparationState, nextCall, leadItems, decisionsView, previewOf, scheduledCallFor } from "../src/lib/session";
import { isValidTimeZone } from "../src/lib/sessionTime";

/** A target id passed in must belong to the same lead. */
async function checkTarget(ctx: QueryCtx, targetId: Id<"targets"> | undefined | null, leadId: Id<"leads">) {
  if (!targetId) return null;
  const t = await ctx.db.get(targetId);
  if (!t || t.leadId !== leadId) throw new ConvexError("That title belongs to a different lead.");
  return t;
}

/**
 * Number one CV group 1..n by upload time. A group is one target's line (or the
 * base CV's) or one application's tailored copies, § 8a. The latest is current.
 */
async function renumberCvs(
  ctx: MutationCtx,
  leadId: Id<"leads">,
  targetId: Id<"targets"> | undefined,
  applicationId: Id<"applications"> | undefined,
) {
  const group = (
    await ctx.db
      .query("cvDocuments")
      .withIndex("by_lead", (q) => q.eq("leadId", leadId))
      .collect()
  )
    .filter((c) => c.targetId === targetId && c.applicationId === applicationId)
    .sort((a, b) => a.uploadedAt - b.uploadedAt);
  for (const [i, c] of group.entries()) if (c.version !== i + 1) await ctx.db.patch(c._id, { version: i + 1 });
}

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

/**
 * The wallet with reservations and entitlements, `lifecycle-data-model.md`
 * § 7a. The CRM and the candidate's page both read this, never their own sum.
 */
export async function walletFor(ctx: QueryCtx, leadId: Id<"leads">) {
  const [ledger, deliverables, engagements] = await Promise.all([
    ctx.db.query("tokenLedger").withIndex("by_lead", (q) => q.eq("leadId", leadId)).collect(),
    ctx.db.query("deliverables").withIndex("by_lead", (q) => q.eq("leadId", leadId)).collect(),
    ctx.db.query("engagements").withIndex("by_lead", (q) => q.eq("leadId", leadId)).collect(),
  ]);
  return { wallet: computeWallet(ledger, deliverables, engagements, Date.now()), ledger, deliverables, engagements };
}

/**
 * One paid candidate's wallet, deliverables, logged calls, preparation and
 * open items, `lifecycle-data-model.md` § 7b. The delivery queue and the
 * Session tab both read this, so they cannot disagree.
 */
export async function leadState(ctx: QueryCtx, leadId: Id<"leads">, now: number) {
  const { wallet, deliverables, ledger, engagements } = await walletFor(ctx, leadId);
  const [calls, preps] = await Promise.all([
    ctx.db.query("consultations").withIndex("by_lead_time", (q) => q.eq("leadId", leadId)).collect(),
    ctx.db.query("preparations").withIndex("by_lead", (q) => q.eq("leadId", leadId)).collect(),
  ]);
  const live = deliverables.filter((d) => d.status !== "cancelled");
  return { wallet, ledger, engagements, deliverables: live, calls, preps, items: leadItems(live, calls, preps, wallet, now) };
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
    // Reserved tokens are not spendable here, § 7a. A Fit Report is charged
    // through `deliverFitReport`, or here only for a delivered report that was
    // never charged, and never twice.
    if (sign < 0) {
      const { wallet, ledger } = await walletFor(ctx, args.leadId);
      if (args.reason === "fit_report") {
        if (!args.deliverableId) throw new ConvexError("A Fit Report charge names the report it pays for.");
        const d = await ctx.db.get(args.deliverableId);
        if (!d || d.kind !== "fit_report" || d.status !== "delivered") {
          throw new ConvexError("Charge a Fit Report with Deliver; this is only for a delivered report never charged.");
        }
        if (ledger.some((r) => r.deliverableId === args.deliverableId && r.delta < 0)) {
          throw new ConvexError("This Fit Report has already been charged.");
        }
      }
      if (wallet.spendable < args.amount) {
        throw new ConvexError(
          `Only ${wallet.spendable} tokens spendable (${wallet.reserved} reserved for the Fit Report); this needs ${args.amount}.`,
        );
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
    /** Shown to the candidate. Defaults to the target's title. */
    label: v.optional(v.string()),
    /** The title this CV is for. Absent = the base CV. */
    targetId: v.optional(v.id("targets")),
    /** A one-off copy tailored for one job. */
    applicationId: v.optional(v.id("applications")),
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

    let target;
    try {
      target = await checkTarget(ctx, args.targetId, args.leadId);
      if (args.applicationId) {
        const a = await ctx.db.get(args.applicationId);
        if (!a || a.leadId !== args.leadId) throw new ConvexError("That job belongs to a different lead.");
      }
    } catch (e) {
      await ctx.storage.delete(args.storageId);
      throw e;
    }
    const label =
      args.label?.trim() || target?.title || args.fileName.trim().replace(/\.[A-Za-z0-9]+$/, "") || "CV";

    const existing = await ctx.db
      .query("cvDocuments")
      .withIndex("by_lead", (q) => q.eq("leadId", args.leadId))
      .collect();
    // Versions count within the CV's own line, § 8a: one title's, the base
    // CV's, or one job's tailored copies.
    const version =
      existing
        .filter((r) => r.targetId === args.targetId && r.applicationId === args.applicationId)
        .reduce((m, r) => Math.max(m, r.version), 0) + 1;
    const now = Date.now();

    const id = await ctx.db.insert("cvDocuments", {
      leadId: args.leadId,
      version,
      author: args.author,
      label,
      ...(args.targetId ? { targetId: args.targetId } : {}),
      ...(args.applicationId ? { applicationId: args.applicationId } : {}),
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
    /** Move the CV to another title's line, or `null` for the base CV. */
    targetId: v.optional(v.union(v.id("targets"), v.null())),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const row = await ctx.db.get(args.cvId);
    if (!row) throw new ConvexError("CV not found.");
    const patch: Record<string, unknown> = {};
    if (args.targetId !== undefined) {
      await checkTarget(ctx, args.targetId, row.leadId);
      const next = args.targetId ?? undefined;
      if (next !== row.targetId) {
        await ctx.db.patch(args.cvId, { targetId: next, version: Number.MAX_SAFE_INTEGER });
        await renumberCvs(ctx, row.leadId, row.targetId, row.applicationId);
        await renumberCvs(ctx, row.leadId, next, row.applicationId);
      }
    }
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
    /** The title this role is matched for. */
    targetId: v.optional(v.id("targets")),
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

    await checkTarget(ctx, args.targetId, args.leadId);
    const { wallet } = await walletFor(ctx, args.leadId);
    if (wallet.spendable < 1) {
      throw new ConvexError(
        wallet.reserved
          ? `No spendable tokens: ${wallet.reserved} are reserved for the Fit Report.`
          : "No tokens left. Record a purchase first.",
      );
    }

    const now = Date.now();
    const applicationId = await ctx.db.insert("applications", {
      leadId: args.leadId,
      ...(args.engagementId ? { engagementId: args.engagementId } : {}),
      ...(args.jobLogId ? { jobLogId: args.jobLogId } : {}),
      ...(args.targetId ? { targetId: args.targetId } : {}),
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
    /** Which title the job is for. Allowed on the candidate's own rows too:
     *  it files the job, it does not rewrite what they recorded. */
    targetId: v.optional(v.union(v.id("targets"), v.null())),
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
    if (args.targetId !== undefined) {
      await checkTarget(ctx, args.targetId, row.leadId);
      patch.targetId = args.targetId ?? undefined;
    }
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
    const id = await ctx.db.insert("candidateAccess", { leadId: args.leadId, email, grantedAt: now, by });
    // Their permanent code, made and emailed once (candidateCode.ts).
    await ctx.scheduler.runAfter(0, internal.candidateCode.issueCode, { leadId: args.leadId });
    return id;
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
    const { wallet } = await walletFor(ctx, args.leadId);

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
      wallet,
      cvs,
      notes,
      applications,
      access: access
        ? {
            email: access.email,
            grantedAt: access.grantedAt,
            lastSignInAt: access.lastSignInAt ?? null,
            codeIssuedAt: access.codeIssuedAt ?? null,
            codeDelivery: access.codeDelivery ?? null,
            codeDeliveryNote: access.codeDeliveryNote ?? null,
          }
        : null,
      heldCode,
      tokenRequest: openRequest ? { _id: openRequest._id, at: openRequest.at } : null,
      fitReport: { shared: lead?.fitReportSharedAt !== undefined, rated: ratedCount },
      /** Active first by priority, with how each title is doing, § 8a. */
      targets: (await targetsFor(ctx, args.leadId)).map((t) => {
        const mine = applications.filter((a) => a.targetId === t._id);
        return {
          ...t,
          jobs: mine.length,
          applied: mine.filter((a) => a.status !== "interested").length,
          interviewing: mine.filter((a) => ["interviewing", "offer", "accepted"].includes(a.status)).length,
        };
      }),
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
      items: ReturnType<typeof leadItems>;
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
        .filter((d) => ids.has(d.engagementId) && d.status !== "delivered" && d.status !== "cancelled")
        .sort((a, b) => (a.dueAt ?? Infinity) - (b.dueAt ?? Infinity));
      // Reservations, reconciliation flags, preparation and the CV owed, § 7b.
      const { items } = await leadState(ctx, leadId, now);
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
        items,
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
        Number(b.items.some((i) => i.exception)) - Number(a.items.some((i) => i.exception)) ||
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
      const rated = (
        await ctx.db
          .query("competencyRatings")
          .withIndex("by_lead_item", (q) => q.eq("leadId", args.leadId))
          .collect()
      ).some((r) => !r.open || r.open.length === 0);
      if (!rated) throw new ConvexError("Rate the interview first; the report has nothing scored yet.");
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

/**
 * Everything delivery holds about one person, for the subject-access export.
 *
 * The export predates delivery, so without this a request answered today would
 * leave out what they bought, their token history, every CV version, the coach's
 * delivery notes, the job tracker and their sign-in access. The 15/08/2026 rule
 * for call notes applies here too: coach notes are included, shared or not,
 * because they are a written record of an identified person.
 *
 * Held back, and none of it is about the person: who on the staff did each
 * thing (`by`), storage ids, and a placement's attribution, which is a judgement
 * about the business like `moduleFit` is. Internal ids are resolved to the name
 * the person would recognise. CV files are listed here; the files themselves
 * are sent alongside, downloaded from the CRM.
 */
export const exportForLead = query({
  args: { leadId: v.id("leads") },
  handler: async (ctx, { leadId }) => {
    await requireAdmin(ctx);
    const lead = await ctx.db.get(leadId);
    if (!lead) return null;
    const targets = await targetsFor(ctx, leadId);
    const targetName = new Map(targets.map((t) => [t._id, t.title]));
    const [engagements, deliverables, applications, placements, ledger, cvs, notes, access, requests] =
      await Promise.all([
        ctx.db.query("engagements").withIndex("by_lead", (q) => q.eq("leadId", leadId)).collect(),
        ctx.db.query("deliverables").withIndex("by_lead", (q) => q.eq("leadId", leadId)).collect(),
        ctx.db.query("applications").withIndex("by_lead_time", (q) => q.eq("leadId", leadId)).collect(),
        ctx.db.query("placements").withIndex("by_lead", (q) => q.eq("leadId", leadId)).collect(),
        ctx.db.query("tokenLedger").withIndex("by_lead", (q) => q.eq("leadId", leadId)).collect(),
        ctx.db.query("cvDocuments").withIndex("by_lead", (q) => q.eq("leadId", leadId)).collect(),
        ctx.db.query("deliveryNotes").withIndex("by_lead", (q) => q.eq("leadId", leadId)).collect(),
        ctx.db.query("candidateAccess").withIndex("by_lead", (q) => q.eq("leadId", leadId)).collect(),
        ctx.db.query("tokenRequests").withIndex("by_lead", (q) => q.eq("leadId", leadId)).collect(),
      ]);

    const deliverableName = new Map(
      deliverables.map((d) => [d._id, d.title ?? d.kind]),
    );
    const cvName = new Map(
      cvs.map((c) => [c._id, `Version ${c.version} · ${c.label}`]),
    );
    const roleName = new Map(
      applications.map((a) => [a._id, `${a.roleTitle}, ${a.employer}`]),
    );

    return {
      fitReportSharedAt: lead.fitReportSharedAt ?? null,
      weeklyApplicationGoal: lead.weeklyApplicationGoal ?? null,
      targets: targets.map((t) => ({
        title: t.title,
        alsoCalled: t.alsoCalled,
        countries: t.countries ?? null,
        priority: t.priority,
        status: t.status,
        createdAt: t.createdAt,
        evidenceNote: t.evidenceNote ?? null,
      })),
      purchases: engagements.map((e) => ({
        module: e.module,
        status: e.status,
        quotedThb: e.quotedThb ?? null,
        agreedThb: e.agreedThb ?? null,
        agreedAt: e.agreedAt ?? null,
        startedAt: e.startedAt ?? null,
        completedAt: e.completedAt ?? null,
        notes: e.notes ?? null,
      })),
      deliverables: deliverables.map((d) => ({
        name: d.title ?? d.kind,
        kind: d.kind,
        stage: d.methodStage,
        status: d.status,
        dueAt: d.dueAt ?? null,
        deliveredAt: d.deliveredAt ?? null,
        notes: d.notes ?? null,
      })),
      tokens: ledger
        .sort((a, b) => a.at - b.at)
        .map((t) => ({
          at: t.at,
          delta: t.delta,
          reason: t.reason,
          forWhat:
            (t.deliverableId && deliverableName.get(t.deliverableId)) ||
            (t.applicationId && roleName.get(t.applicationId)) ||
            null,
          note: t.note ?? null,
        })),
      tokenRequests: requests.map((r) => ({
        at: r.at,
        handledAt: r.handledAt ?? null,
      })),
      cvs: cvs
        .sort((a, b) => a.version - b.version)
        .map((c) => ({
          version: c.version,
          label: c.label,
          forTitle: c.targetId ? (targetName.get(c.targetId) ?? null) : null,
          author: c.author,
          fileName: c.fileName,
          bytes: c.bytes,
          basedOn: c.basedOn ? (cvName.get(c.basedOn) ?? null) : null,
          changeNote: c.changeNote ?? null,
          forDeliverable: c.deliverableId ? (deliverableName.get(c.deliverableId) ?? null) : null,
          uploadedAt: c.uploadedAt,
          sharedAt: c.sharedAt ?? null,
          cvConsentAt: c.cvConsentAt,
        })),
      notes: notes
        .sort((a, b) => a.at - b.at)
        .map((n) => ({
          at: n.at,
          body: n.body,
          shownToYou: n.shared,
          about:
            (n.deliverableId && deliverableName.get(n.deliverableId)) ||
            (n.applicationId && roleName.get(n.applicationId)) ||
            null,
        })),
      applications: applications.map((a) => ({
        roleTitle: a.roleTitle,
        employer: a.employer,
        country: a.country,
        forTitle: a.targetId ? (targetName.get(a.targetId) ?? null) : null,
        location: a.location ?? null,
        jobUrl: a.jobUrl ?? null,
        salary: a.salary ?? null,
        status: a.status,
        origin: a.origin ?? a.recordedBy,
        matchReason: a.matchReason ?? null,
        savedAt: a.savedAt,
        appliedAt: a.appliedAt ?? null,
        deadlineAt: a.deadlineAt ?? null,
        followUpAt: a.followUpAt ?? null,
        excitement: a.excitement ?? null,
        cvUsed: a.cvDocumentId ? (cvName.get(a.cvDocumentId) ?? null) : null,
        notes: a.notes ?? null,
        interviews: a.interviews ?? [],
        contacts: a.contacts ?? [],
        checklistDone: (a.checklist ?? []).length,
        jobDescription: a.jobDescription ?? null,
      })),
      placements: placements.map((p) => ({
        employer: p.employer,
        roleTitle: p.roleTitle,
        country: p.country,
        offerAt: p.offerAt ?? null,
        signedAt: p.signedAt ?? null,
        startAt: p.startAt ?? null,
        salary: p.salary ?? null,
        visaRoute: p.visaRoute ?? null,
        storyConsentAt: p.storyConsentAt ?? null,
        notes: p.notes ?? null,
      })),
      preparations: (
        await ctx.db.query("preparations").withIndex("by_lead", (q) => q.eq("leadId", leadId)).collect()
      ).map((p) => ({
        session: deliverableName.get(p.deliverableId) ?? null,
        priorities: p.priorities,
        titleChanges: p.titleChanges ?? null,
        vacancyUrls: p.vacancyUrls,
        question: p.question ?? null,
        submittedAt: p.submittedAt,
        updatedAt: p.updatedAt,
      })),
      timeZone: lead.timeZone ?? null,
      signIn: access.map((g) => ({
        email: g.email,
        grantedAt: g.grantedAt,
        revokedAt: g.revokedAt ?? null,
        lastSignInAt: g.lastSignInAt ?? null,
      })),
    };
  },
});

/**
 * Deliver the Fit Report in one step, 02/11/2026: put it on their dashboard,
 * mark the Fit Report deliverable delivered, deduct its tokens against that
 * deliverable, and leave a note on the record. One transaction, so a half
 * delivery (shared but not charged, charged but not shared) cannot happen.
 *
 * Refuses while any interview competency is still unrated or a draft, because
 * the report would go out with holes the coach meant to fill.
 */
export const deliverFitReport = mutation({
  args: { leadId: v.id("leads") },
  handler: async (ctx, args) => {
    const by = await requireAdmin(ctx);
    const lead = await ctx.db.get(args.leadId);
    if (!lead) throw new ConvexError("Lead not found.");

    const rows = await ctx.db
      .query("competencyRatings")
      .withIndex("by_lead_item", (q) => q.eq("leadId", args.leadId))
      .collect();
    const latest = new Map<string, (typeof rows)[number]>();
    for (const r of rows) {
      const seen = latest.get(r.itemKey);
      if (!seen || r.ratedAt > seen.ratedAt) latest.set(r.itemKey, r);
    }
    const missing = INTERVIEW_ITEMS.filter((k) => {
      const r = latest.get(k);
      return !r || (r.open?.length ?? 0) > 0;
    });
    if (missing.length) throw new ConvexError(`Still to rate: ${missing.join(", ")}.`);

    const deliverables = await ctx.db
      .query("deliverables")
      .withIndex("by_lead", (q) => q.eq("leadId", args.leadId))
      .collect();
    // The selected report first; an unselected unfinished one still delivers,
    // paid from spendable tokens, because it holds no reservation.
    const open = deliverables.filter(
      (d) => d.kind === "fit_report" && d.status !== "delivered" && d.status !== "cancelled",
    );
    const fit = open.find((d) => d.reservedAt !== undefined) ?? open[0];
    const already = deliverables.find((d) => d.kind === "fit_report" && d.status === "delivered");
    const now = Date.now();

    if (fit) {
      const charged = (
        await ctx.db
          .query("tokenLedger")
          .withIndex("by_lead", (q) => q.eq("leadId", args.leadId))
          .collect()
      ).some((t) => t.deliverableId === fit._id && t.delta < 0);
      if (!charged) {
        // A reserved report pays from its own reservation; an unreserved one
        // from what is spendable, so it cannot take another report's tokens.
        const { wallet } = await walletFor(ctx, args.leadId);
        const reservedForThis = wallet.openReservationId === fit._id;
        const available = reservedForThis ? wallet.spendable + TOKEN_PRICE.fitReport : wallet.spendable;
        if (Math.min(available, wallet.balance) < TOKEN_PRICE.fitReport) {
          throw new ConvexError(
            `Only ${Math.min(available, wallet.balance)} tokens available for this report; it needs ${TOKEN_PRICE.fitReport}.`,
          );
        }
        await ctx.db.insert("tokenLedger", {
          leadId: args.leadId,
          delta: -TOKEN_PRICE.fitReport,
          reason: "fit_report",
          engagementId: fit.engagementId,
          deliverableId: fit._id,
          note: "Fit Report delivered",
          at: now,
          by,
        });
      }
      await ctx.db.patch(fit._id, { status: "delivered", deliveredAt: now });
    } else if (!already) {
      throw new ConvexError("No Fit Report deliverable on this record. Add one in Delivery, kind Fit Report, first.");
    }

    await ctx.db.patch(args.leadId, { fitReportSharedAt: lead.fitReportSharedAt ?? now });
    await ctx.db.insert("deliveryNotes", {
      leadId: args.leadId,
      body: "Fit Report delivered and shared on the dashboard.",
      shared: false,
      ...(fit ? { deliverableId: fit._id } : {}),
      at: now,
      by,
    });
  },
});

/* ------------------------------------------- reservations and entitlements */

const SOLD_STATUSES = new Set(["agreed", "active", "completed"]);

/**
 * Select the Fit Report: reserve its 20 tokens, `01_Project_Foundation.md`,
 * Fit Report and the token wallet. The only way a reservation is made.
 *
 * With `deliverableId`, marks an existing unfinished report once Paul has
 * reconciled it. Without, creates the report on the lead's recorded token
 * pack sale. Refuses below 20 spendable, stating what is missing, and refuses
 * while another selection is open. If the lead holds a recorded ฿1,500 pack
 * and the complimentary coaching has not closed, the CV rewrite is created in
 * the same transaction, so its eligibility is fixed at selection.
 */
export const selectFitReport = mutation({
  args: {
    leadId: v.id("leads"),
    deliverableId: v.optional(v.id("deliverables")),
    /** The sale the new report belongs to, from the Delivery tab's form.
     *  Defaults to the latest recorded token pack. */
    engagementId: v.optional(v.id("engagements")),
  },
  handler: async (ctx, args) => {
    const by = await requireAdmin(ctx);
    const lead = await ctx.db.get(args.leadId);
    if (!lead) throw new ConvexError("Lead not found.");
    const { wallet, ledger, engagements } = await walletFor(ctx, args.leadId);
    if (wallet.openReservationId) throw new ConvexError("A Fit Report is already selected for this candidate.");
    if (wallet.spendable < TOKEN_PRICE.fitReport) {
      throw new ConvexError(
        `Needs ${wallet.selectionShortfall} more spendable tokens to select the Fit Report (${wallet.spendable} of ${TOKEN_PRICE.fitReport}).`,
      );
    }
    const now = Date.now();
    let fitId: Id<"deliverables">;
    let engagementId: Id<"engagements">;
    if (args.deliverableId) {
      const d = await ctx.db.get(args.deliverableId);
      if (!d || d.leadId !== args.leadId || d.kind !== "fit_report") {
        throw new ConvexError("That is not a Fit Report on this record.");
      }
      if (d.status === "delivered" || d.status === "cancelled") throw new ConvexError("That report is already closed.");
      if (ledger.some((r) => r.deliverableId === d._id && r.delta < 0)) {
        throw new ConvexError("That report has already been charged.");
      }
      await ctx.db.patch(d._id, { reservedAt: now, updatedAt: now });
      fitId = d._id;
      engagementId = d.engagementId;
    } else {
      if (wallet.unfinishedUnselectedIds.length) {
        throw new ConvexError("An unfinished Fit Report is already on this record. Select or cancel that one first.");
      }
      const chosen = args.engagementId ? engagements.find((e) => e._id === args.engagementId) : undefined;
      if (args.engagementId && !chosen) throw new ConvexError("That sale belongs to a different lead.");
      const pack =
        chosen ??
        engagements
          .filter((e) => e.module === "token_pack" && SOLD_STATUSES.has(e.status))
          .sort((a, b) => (b.agreedAt ?? b.createdAt) - (a.agreedAt ?? a.createdAt))[0];
      if (!pack) throw new ConvexError("No token pack sale is recorded. Record the sale first.");
      engagementId = pack._id;
      fitId = await ctx.db.insert("deliverables", {
        engagementId,
        leadId: args.leadId,
        kind: "fit_report",
        // The assessment answers which roles fit, which is the Direction stage.
        methodStage: "direction",
        status: "not_started",
        reservedAt: now,
        by,
        createdAt: now,
        updatedAt: now,
      });
    }

    let cv = false;
    if (cvEarnedBySelectionNow(wallet) && wallet.entitlements.pack) {
      await ctx.db.insert("deliverables", {
        engagementId: wallet.entitlements.pack.engagementId as Id<"engagements">,
        leadId: args.leadId,
        kind: "base_cv",
        methodStage: "legibility",
        status: "not_started",
        entitlement: "pack_cv_rewrite",
        forFitReport: fitId,
        by,
        createdAt: now,
        updatedAt: now,
      });
      cv = true;
    }
    await ctx.db.insert("deliveryNotes", {
      leadId: args.leadId,
      body: `Fit Report selected, ${TOKEN_PRICE.fitReport} tokens reserved.${cv ? " Master CV rewrite now owed." : ""}`,
      shared: false,
      deliverableId: fitId,
      at: now,
      by,
    });
    return fitId;
  },
});

/**
 * Cancel an undelivered Fit Report. Releases its reservation with no charge
 * and cancels the undelivered CV rewrite it earned, unless `promiseNote` names
 * an existing promise that keeps it. A delivered report is a refund, not this.
 */
export const cancelFitReport = mutation({
  args: { deliverableId: v.id("deliverables"), note: v.string(), promiseNote: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const by = await requireAdmin(ctx);
    const d = await ctx.db.get(args.deliverableId);
    if (!d || d.kind !== "fit_report") throw new ConvexError("That is not a Fit Report.");
    if (d.status === "delivered") throw new ConvexError("Already delivered. A delivered report is refunded, not cancelled.");
    if (d.status === "cancelled") return;
    if (!args.note.trim()) throw new ConvexError("Say why it is cancelled.");
    const { ledger } = await walletFor(ctx, d.leadId);
    if (ledger.some((r) => r.deliverableId === d._id && r.delta < 0)) {
      throw new ConvexError("This report has been charged. Refund it instead.");
    }
    const now = Date.now();
    await ctx.db.patch(d._id, { status: "cancelled", cancelledAt: now, updatedAt: now });
    const dependents = (
      await ctx.db
        .query("deliverables")
        .withIndex("by_lead", (q) => q.eq("leadId", d.leadId))
        .collect()
    ).filter((c) => c.forFitReport === d._id && c.status !== "delivered" && c.status !== "cancelled");
    const promise = args.promiseNote?.trim();
    for (const c of dependents) {
      if (promise) await ctx.db.patch(c._id, { promiseNote: promise, updatedAt: now });
      else await ctx.db.patch(c._id, { status: "cancelled", cancelledAt: now, updatedAt: now });
    }
    await ctx.db.insert("deliveryNotes", {
      leadId: d.leadId,
      body:
        `Fit Report cancelled, reservation released, no charge. ${args.note.trim()}` +
        (dependents.length ? (promise ? ` CV rewrite kept: ${promise}` : " Its CV rewrite is cancelled.") : ""),
      shared: false,
      deliverableId: d._id,
      at: now,
      by,
    });
  },
});

/**
 * Add the ฿1,500 pack's complimentary preview. Once per customer. With
 * `deliverableId`, marks an existing coaching session as the preview instead of
 * adding a second one, which is how a customer from before this rule is
 * reconciled.
 */
export const addPackPreview = mutation({
  args: {
    leadId: v.id("leads"),
    deliverableId: v.optional(v.id("deliverables")),
    dueAt: v.optional(v.number()),
    bookingUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const by = await requireAdmin(ctx);
    const { wallet, deliverables } = await walletFor(ctx, args.leadId);
    const pack = wallet.entitlements.pack;
    if (!pack) throw new ConvexError("No ฿1,500 pack sale is recorded, so no preview is owed.");
    if (deliverables.some((d) => d.entitlement === "pack_preview" && d.status !== "cancelled")) {
      throw new ConvexError("The preview is once per customer and is already on this record.");
    }
    const now = Date.now();
    if (args.deliverableId) {
      const d = await ctx.db.get(args.deliverableId);
      if (!d || d.leadId !== args.leadId || d.kind !== "coaching_session" || d.status === "cancelled") {
        throw new ConvexError("Only an existing coaching session on this record can be marked as the preview.");
      }
      await ctx.db.patch(d._id, { entitlement: "pack_preview", updatedAt: now });
      return d._id;
    }
    return await ctx.db.insert("deliverables", {
      engagementId: pack.engagementId as Id<"engagements">,
      leadId: args.leadId,
      kind: "coaching_session",
      methodStage: "direction",
      status: "not_started",
      entitlement: "pack_preview",
      ...(args.dueAt ? { dueAt: args.dueAt } : {}),
      ...(args.bookingUrl?.trim() ? { bookingUrl: args.bookingUrl.trim() } : {}),
      by,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/** A factual error the candidate reported in a complimentary document. */
export const reportDocumentError = mutation({
  args: { deliverableId: v.id("deliverables"), summary: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const d = await ctx.db.get(args.deliverableId);
    if (!d || !d.entitlement) throw new ConvexError("Only a complimentary pack document takes error reports.");
    if (!args.summary.trim()) throw new ConvexError("Say what the error is.");
    const now = Date.now();
    await ctx.db.patch(d._id, {
      errorReports: [...(d.errorReports ?? []), { reportedAt: now, summary: args.summary.trim() }],
      updatedAt: now,
    });
  },
});

export const resolveDocumentError = mutation({
  args: { deliverableId: v.id("deliverables"), index: v.number() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const d = await ctx.db.get(args.deliverableId);
    const list = d?.errorReports ?? [];
    if (!d || !list[args.index]) throw new ConvexError("No such error report.");
    const now = Date.now();
    await ctx.db.patch(d._id, {
      errorReports: list.map((e, i) => (i === args.index && e.resolvedAt === undefined ? { ...e, resolvedAt: now } : e)),
      updatedAt: now,
    });
  },
});

/**
 * Every lead with a token ledger, with its wallet and what needs Paul's eye.
 * Read-only: reconciliation decides nothing and writes nothing, § 7a.
 */
export const reconcile = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const ids = new Set<Id<"leads">>();
    for (const r of await ctx.db.query("tokenLedger").collect()) ids.add(r.leadId);
    const out = [];
    for (const leadId of ids) {
      const lead = await ctx.db.get(leadId);
      const { wallet } = await walletFor(ctx, leadId);
      out.push({
        leadId,
        name: lead?.nickname ?? lead?.firstName ?? lead?.fullName ?? null,
        balance: wallet.balance,
        reserved: wallet.reserved,
        spendable: wallet.spendable,
        reservationShortfall: wallet.reservationShortfall,
        pack: wallet.entitlements.pack !== null,
        preview: wallet.entitlements.preview,
        cvRewrite: wallet.entitlements.cvRewrite,
        closure: wallet.entitlements.closure.state,
        flags: wallet.flags,
      });
    }
    return out.sort((a, b) => b.flags.length - a.flags.length);
  },
});

/* ------------------------------------------------- sessions and decisions */


/** The coach records the candidate's zone on their behalf, or clears it. */
export const setLeadTimeZone = mutation({
  args: { leadId: v.id("leads"), timeZone: v.union(v.string(), v.null()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    if (args.timeZone !== null && !isValidTimeZone(args.timeZone)) throw new ConvexError("Not a time zone.");
    await ctx.db.patch(args.leadId, { timeZone: args.timeZone ?? undefined });
  },
});

/**
 * Record a decision. Never edited afterwards. With `supersedes`, it explicitly
 * replaces that one decision, which stays visible as history; without, it
 * replaces nothing, whatever its subject.
 */
export const addDecision = mutation({
  args: {
    leadId: v.id("leads"),
    body: v.string(),
    /** The call it was made in. */
    consultationId: v.id("consultations"),
    supersedes: v.optional(v.id("deliveryNotes")),
  },
  handler: async (ctx, args) => {
    const by = await requireAdmin(ctx);
    const body = args.body.trim();
    if (!body) throw new ConvexError("Write the decision.");
    if (args.supersedes) {
      const old = await ctx.db.get(args.supersedes);
      if (!old || old.leadId !== args.leadId || !old.decision) throw new ConvexError("That is not a decision on this record.");
      const notes = await ctx.db.query("deliveryNotes").withIndex("by_lead", (q) => q.eq("leadId", args.leadId)).collect();
      if (notes.some((n) => n.supersedes === args.supersedes)) throw new ConvexError("That decision has already been replaced.");
    }
    const call = await ctx.db.get(args.consultationId);
    if (!call || call.leadId !== args.leadId) throw new ConvexError("That call belongs to a different lead.");
    return await ctx.db.insert("deliveryNotes", {
      leadId: args.leadId,
      body,
      shared: false,
      decision: true,
      consultationId: args.consultationId,
      ...(call.deliverableId ? { deliverableId: call.deliverableId } : {}),
      ...(args.supersedes ? { supersedes: args.supersedes } : {}),
      at: Date.now(),
      by,
    });
  },
});

/**
 * The Session tab, `prd.md` section 8: a read-only assembly of the call log,
 * targets, wallet, preparation and the same open items the queues show.
 */
export const session = query({
  args: { leadId: v.id("leads") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const lead = await ctx.db.get(args.leadId);
    if (!lead) return null;
    const now = Date.now();
    const { wallet, deliverables, calls, preps, items } = await leadState(ctx, args.leadId, now);
    const notes = await ctx.db.query("deliveryNotes").withIndex("by_lead", (q) => q.eq("leadId", args.leadId)).collect();
    const preview = previewOf(deliverables);
    const prep = preview ? preps.find((p) => p.deliverableId === preview._id) ?? null : null;
    const next = nextCall(calls, now);
    const nextFor = next?.deliverableId ? deliverables.find((d) => d._id === next.deliverableId) ?? null : null;

    const ratings = await ctx.db
      .query("competencyRatings")
      .withIndex("by_lead_item", (q) => q.eq("leadId", args.leadId))
      .collect();
    const latest = new Map<string, (typeof ratings)[number]>();
    for (const r of ratings) {
      const seen = latest.get(r.itemKey);
      if (!seen || r.ratedAt > seen.ratedAt) latest.set(r.itemKey, r);
    }
    const fitOpen = INTERVIEW_ITEMS.filter((k) => {
      const r = latest.get(k);
      return !r || (r.open?.length ?? 0) > 0;
    });
    const cv = (await ctx.db.query("cvDocuments").withIndex("by_lead", (q) => q.eq("leadId", args.leadId)).collect()).sort(
      (a, b) => b.uploadedAt - a.uploadedAt,
    )[0];

    return {
      now,
      timeZone: lead.timeZone ?? null,
      wallet,
      deliverables: deliverables.sort((a, b) => a.createdAt - b.createdAt),
      nextCall: next
        ? {
            _id: next._id,
            type: next.type,
            heldAt: next.heldAt,
            durationMinutes: next.durationMinutes ?? null,
            deliverable: nextFor ? { kind: nextFor.kind, entitlement: nextFor.entitlement ?? null, title: nextFor.title ?? null } : null,
          }
        : null,
      preview: preview
        ? {
            _id: preview._id,
            call: scheduledCallFor(calls, preview._id)?.heldAt ?? null,
            state: preparationState(deliverables, calls, preps, now),
            prep,
          }
        : null,
      items,
      decisions: decisionsView(notes.filter((n) => n.decision)),
      goal: (await targetsFor(ctx, args.leadId)).filter((t) => t.status === "active").map((t) => t.title),
      evidence: {
        cv: cv ? { label: cv.label, version: cv.version, uploadedAt: cv.uploadedAt } : null,
        fitReportShared: lead.fitReportSharedAt !== undefined,
        fitOpen,
      },
      openErrorReports: deliverables.flatMap((d) =>
        (d.errorReports ?? []).flatMap((e, i) => (e.resolvedAt === undefined ? [{ deliverableId: d._id, index: i, summary: e.summary }] : [])),
      ),
    };
  },
});
