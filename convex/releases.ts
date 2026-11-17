/**
 * Releases: everything one call produced, reaching the candidate in one coach
 * action. Spec: `coaching-delivery-design.md` § 7a, and `prd.md` § 8 under the
 * lead's Delivery page.
 *
 * Coach surface. `releasesFor` is the one thing that crosses to the candidate's
 * own page, through `portal.buildView`, and it returns released rows only.
 *
 * **The rule this module exists to enforce.** The release is the unit that
 * becomes visible. `release` is one mutation: it stamps the release, shares the
 * covering note and shares every CV the release carries, so the candidate never
 * sees half of what one call produced, and never a document before the report
 * that justifies it. Nothing here charges a token, writes an assessment or
 * touches a deliverable's own status: a release is a handover, not a spend.
 *
 * The first release carries no file. The Fit Report, the target titles and the
 * markets are rows this database already holds, so its items point at them,
 * which is why this step needed no upload path and nothing here writes to
 * storage.
 *
 * Three things the design names and this module deliberately does not do yet,
 * each its own step in the build order in `candidate-delivery-handoff.md`: the
 * outside message that says something is waiting, the first-open date, and the
 * facts a release was checked on, which will refuse a release while one
 * disagrees.
 */

import { mutation, query, type QueryCtx } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { requireAdmin } from "./leads";
import type { Doc, Id } from "./_generated/dataModel";

const kindValidator = v.union(
  v.literal("report"),
  v.literal("direction"),
  v.literal("file"),
  v.literal("link"),
);

/** One release with its items in order, oldest item first. */
async function withItems(ctx: QueryCtx, release: Doc<"releases">) {
  const items = await ctx.db
    .query("releaseItems")
    .withIndex("by_release", (q) => q.eq("releaseId", release._id))
    .collect();
  return { ...release, items: items.sort((a, b) => a.order - b.order) };
}

/**
 * Every release of one lead, newest first. The coach sees drafts; the
 * candidate's page asks for `releasedOnly`.
 */
export async function releasesFor(ctx: QueryCtx, leadId: Id<"leads">, releasedOnly = false) {
  const rows = await ctx.db
    .query("releases")
    .withIndex("by_lead", (q) => q.eq("leadId", leadId))
    .collect();
  const kept = releasedOnly ? rows.filter((r) => r.state === "released") : rows;
  return await Promise.all(kept.sort((a, b) => b.at - a.at).map((r) => withItems(ctx, r)));
}

export const forLead = query({
  args: { leadId: v.id("leads") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await releasesFor(ctx, args.leadId);
  },
});

/**
 * Opens the draft a call's output is collected into.
 *
 * One draft per lead at a time, because two open drafts is how a release goes
 * out with half of what it should carry: the coach adds the CV to one and the
 * report to the other and both look complete.
 */
export const open = mutation({
  args: {
    leadId: v.id("leads"),
    title: v.string(),
    consultationId: v.optional(v.id("consultations")),
  },
  handler: async (ctx, args) => {
    const by = await requireAdmin(ctx);
    const lead = await ctx.db.get(args.leadId);
    if (!lead) throw new ConvexError("Lead not found.");
    const title = args.title.trim();
    if (!title) throw new ConvexError("Name the release, so you can tell two of them apart.");

    const held = await ctx.db
      .query("releases")
      .withIndex("by_lead", (q) => q.eq("leadId", args.leadId))
      .collect();
    if (held.some((r) => r.state === "draft")) {
      throw new ConvexError("There is already a draft release for this candidate. Release it or empty it first.");
    }
    if (args.consultationId) {
      const call = await ctx.db.get(args.consultationId);
      if (!call || call.leadId !== args.leadId) throw new ConvexError("That call belongs to a different lead.");
    }

    return await ctx.db.insert("releases", {
      leadId: args.leadId,
      ...(args.consultationId ? { consultationId: args.consultationId } : {}),
      title,
      state: "draft",
      at: Date.now(),
      by,
    });
  },
});

async function draftOf(ctx: QueryCtx, releaseId: Id<"releases">) {
  const release = await ctx.db.get(releaseId);
  if (!release) throw new ConvexError("No such release.");
  if (release.state !== "draft") {
    throw new ConvexError("That release has gone to the candidate. It cannot be changed.");
  }
  return release;
}

/**
 * Adds one item to a draft.
 *
 * The pointer has to match the kind, checked here rather than trusted from the
 * screen, because an item pointing at nothing is an item the candidate sees and
 * cannot open.
 */
export const addItem = mutation({
  args: {
    releaseId: v.id("releases"),
    kind: kindValidator,
    label: v.string(),
    deliverableId: v.optional(v.id("deliverables")),
    cvDocumentId: v.optional(v.id("cvDocuments")),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const by = await requireAdmin(ctx);
    const release = await draftOf(ctx, args.releaseId);
    const label = args.label.trim();
    if (!label) throw new ConvexError("Give the item the name the candidate will read.");

    if (args.kind === "link") {
      // Verified 17/11/2026: a Claude artifact link asks a visitor to sign in,
      // so a link is not somewhere a delivered document can live. Whether an
      // item may be a link at all is Decision 1 in § 7a and still open.
      throw new ConvexError("Links are not settled yet. Share the file, or add it as the report or the direction.");
    }

    if (args.kind === "report") {
      if (!args.deliverableId) throw new ConvexError("Say which Fit Report this is.");
      const d = await ctx.db.get(args.deliverableId);
      if (!d || d.leadId !== release.leadId) throw new ConvexError("That deliverable belongs to a different lead.");
      if (d.kind !== "fit_report") throw new ConvexError("That deliverable is not a Fit Report.");
    }

    if (args.kind === "file") {
      if (!args.cvDocumentId) throw new ConvexError("Pick the file to release. Only a CV already held can be released yet.");
      const cv = await ctx.db.get(args.cvDocumentId);
      if (!cv || cv.leadId !== release.leadId) throw new ConvexError("That file belongs to a different lead.");
    }

    if (args.kind === "direction" && (args.deliverableId || args.cvDocumentId || args.url)) {
      throw new ConvexError("The direction is the titles and the markets this record already holds. It points at nothing else.");
    }

    const items = await ctx.db
      .query("releaseItems")
      .withIndex("by_release", (q) => q.eq("releaseId", release._id))
      .collect();
    if (args.kind === "report" && items.some((i) => i.kind === "report")) {
      throw new ConvexError("The report is already in this release.");
    }
    if (args.kind === "direction" && items.some((i) => i.kind === "direction")) {
      throw new ConvexError("The direction is already in this release.");
    }
    if (args.cvDocumentId && items.some((i) => i.cvDocumentId === args.cvDocumentId)) {
      throw new ConvexError("That file is already in this release.");
    }

    return await ctx.db.insert("releaseItems", {
      releaseId: release._id,
      leadId: release.leadId,
      kind: args.kind,
      label,
      ...(args.deliverableId ? { deliverableId: args.deliverableId } : {}),
      ...(args.cvDocumentId ? { cvDocumentId: args.cvDocumentId } : {}),
      order: items.reduce((n, i) => Math.max(n, i.order), 0) + 1,
      at: Date.now(),
      by,
    });
  },
});

export const removeItem = mutation({
  args: { itemId: v.id("releaseItems") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const item = await ctx.db.get(args.itemId);
    if (!item) throw new ConvexError("No such item.");
    await draftOf(ctx, item.releaseId);
    await ctx.db.delete(args.itemId);
  },
});

/**
 * Chooses the covering note, which is the one thing the candidate reads before
 * the items. It is an existing `deliveryNotes` row, written from the Situation
 * panel at the session close, so the release cannot say anything the panel does
 * not hold.
 */
export const setNote = mutation({
  args: { releaseId: v.id("releases"), noteId: v.union(v.id("deliveryNotes"), v.null()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const release = await draftOf(ctx, args.releaseId);
    if (args.noteId === null) {
      await ctx.db.patch(release._id, { noteId: undefined });
      return;
    }
    const note = await ctx.db.get(args.noteId);
    if (!note || note.leadId !== release.leadId) throw new ConvexError("That note belongs to a different lead.");
    if (note.decision) throw new ConvexError("A decision is the record of a call, not a note to the candidate.");
    await ctx.db.patch(release._id, { noteId: args.noteId });
  },
});

/**
 * The one coach action.
 *
 * Everything the release carries becomes visible in this transaction and
 * nothing before it: the note is shared, and every CV in the release gets its
 * `sharedAt` if it has not got one. Convex mutations are serialisable, so two
 * clicks cannot half-release it.
 *
 * A CV that was already shared keeps its original date. Sharing is not undone
 * by anything here; taking something off the candidate's page is still done
 * where that row lives, which is where a coach would look for it.
 */
export const release = mutation({
  args: { releaseId: v.id("releases") },
  handler: async (ctx, args) => {
    const by = await requireAdmin(ctx);
    const row = await draftOf(ctx, args.releaseId);

    const items = await ctx.db
      .query("releaseItems")
      .withIndex("by_release", (q) => q.eq("releaseId", row._id))
      .collect();
    if (items.length === 0) throw new ConvexError("There is nothing in this release.");
    if (!row.noteId) throw new ConvexError("Choose the note the candidate reads over the release first.");
    const note = await ctx.db.get(row.noteId);
    if (!note) throw new ConvexError("The note this release points at is gone. Choose another.");

    const now = Date.now();
    let shared = 0;
    for (const item of items) {
      if (!item.cvDocumentId) continue;
      const cv = await ctx.db.get(item.cvDocumentId);
      if (!cv) throw new ConvexError(`"${item.label}" points at a file that is gone. Take it out of the release.`);
      if (cv.sharedAt === undefined) {
        await ctx.db.patch(cv._id, { sharedAt: now });
        shared++;
      }
    }
    if (!note.shared) await ctx.db.patch(note._id, { shared: true });
    await ctx.db.patch(row._id, { state: "released", releasedAt: now, releasedBy: by });

    return { items: items.length, filesShared: shared };
  },
});
