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

import { internalMutation, mutation, query, type QueryCtx } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { requireAdmin } from "./leads";
import { openDraft } from "./outbox";
import { targetsFor } from "./targets";
import type { Doc, Id } from "./_generated/dataModel";
import { itemFault, nextOrder, releaseFault } from "../src/lib/releases";

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

    const held = await ctx.db
      .query("releaseItems")
      .withIndex("by_release", (q) => q.eq("releaseId", release._id))
      .collect();

    // Every rule about the shape of a release is in `src/lib/releases.ts`, so it
    // can be asserted without a deployment (`npm run verify:releases`). What
    // needs the database stays here, beside the write: that the thing an item
    // points at exists, and that it belongs to this candidate and not another.
    const fault = itemFault(
      args.kind,
      label,
      { deliverableId: args.deliverableId, cvDocumentId: args.cvDocumentId, url: args.url },
      held,
    );
    if (fault) throw new ConvexError(fault);

    if (args.deliverableId) {
      const d = await ctx.db.get(args.deliverableId);
      if (!d || d.leadId !== release.leadId) throw new ConvexError("That deliverable belongs to a different lead.");
      if (args.kind === "report" && d.kind !== "fit_report") throw new ConvexError("That deliverable is not a Fit Report.");
    }
    if (args.cvDocumentId) {
      const cv = await ctx.db.get(args.cvDocumentId);
      if (!cv || cv.leadId !== release.leadId) throw new ConvexError("That file belongs to a different lead.");
    }

    return await ctx.db.insert("releaseItems", {
      releaseId: release._id,
      leadId: release.leadId,
      kind: args.kind,
      label,
      ...(args.deliverableId ? { deliverableId: args.deliverableId } : {}),
      ...(args.cvDocumentId ? { cvDocumentId: args.cvDocumentId } : {}),
      order: nextOrder(held),
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
    const fault = releaseFault(items, row.noteId ?? null);
    if (fault) throw new ConvexError(fault);
    const note = row.noteId ? await ctx.db.get(row.noteId) : null;
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

    // The outside message, Paul's decision of 17/11/2026: both channels. One
    // email carrying the button, and one LINE text for the coach to copy,
    // because this app cannot send LINE and an outbox quietly growing a sender
    // is not a thing anybody asked for. Both open empty, as every draft here
    // does, carrying the Situation panel as it reads now: the words are written
    // by whatever has a model, and nothing leaves until the coach approves it.
    //
    // Releasing can only happen once, since `draftOf` refuses a release that
    // has gone, so one release never opens a second pair of drafts.
    const titles = (await targetsFor(ctx, row.leadId)).filter((t) => t.status === "active").map((t) => t.title);
    const drafts: Id<"outboxDrafts">[] = [];
    for (const channel of ["email", "line"] as const) {
      drafts.push(
        await openDraft(ctx, {
          leadId: row.leadId,
          kind: "release_ready",
          channel,
          releaseId: row._id,
          ...(row.consultationId ? { consultationId: row.consultationId } : {}),
          titles,
          at: now,
          by,
        }),
      );
    }

    return { items: items.length, filesShared: shared, drafts: drafts.length };
  },
});

/**
 * The wait before the one reminder. Three days, Paul's decision of 17/11/2026,
 * and `coaching-delivery-design.md` § 7a holds the reasoning: it sits inside
 * the rhythm a candidate already has, since a preparation deadline is two
 * working days before a call and a matched role is notified the same day.
 */
const REMINDER_WAIT_DAYS = 3;

/** Today in Bangkok, in the form a task's `dueOn` is written in. */
function bangkokToday(now: number): string {
  return new Date(now + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/**
 * The daily pass that owes two reminders, and never a second of either.
 *
 * A release that has gone, has not been opened and is past the wait gets one
 * reminder drafted. And a task the candidate owes, due today or earlier and not
 * done, gets the one reminder `candidateTasks.remindedAt` has specified from the
 * start and that nothing has ever sent: that field was written by no code until
 * this pass, so the reminder the design promised had never gone out.
 *
 * Both are drafts. This pass sends nothing and says nothing: it opens what is
 * owed, carrying the Situation panel, and the coach approves it. The reminder
 * for a task reuses the missing-input kind, because that is what it is, rather
 * than inventing a kind for the same message.
 *
 * It writes its own marker before anything else can run again, so a draft the
 * coach throws away is not reopened tomorrow. Deciding not to send a reminder
 * is itself a decision about this candidate.
 *
 * Both scans read a whole table. At the volumes this product runs at, a handful
 * of releases and tasks per paying candidate, that is the right shape; the day
 * it is not, the releases scan already has `by_state` to narrow and the tasks
 * would want an index of their own.
 */
export const remindOnce = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const cutoff = now - REMINDER_WAIT_DAYS * 24 * 60 * 60 * 1000;
    const today = bangkokToday(now);

    const titlesFor = async (leadId: Id<"leads">) =>
      (await targetsFor(ctx, leadId)).filter((t) => t.status === "active").map((t) => t.title);

    let unopened = 0;
    for (const r of await ctx.db
      .query("releases")
      .withIndex("by_state", (q) => q.eq("state", "released"))
      .collect()) {
      if (r.firstOpenedAt !== undefined || r.remindedAt !== undefined) continue;
      if ((r.releasedAt ?? r.at) > cutoff) continue;
      const titles = await titlesFor(r.leadId);
      for (const channel of ["email", "line"] as const) {
        await openDraft(ctx, {
          leadId: r.leadId,
          kind: "release_reminder",
          channel,
          releaseId: r._id,
          titles,
          at: now,
          by: "the daily pass",
        });
      }
      await ctx.db.patch(r._id, { remindedAt: now });
      unopened++;
    }

    let owed = 0;
    for (const task of await ctx.db.query("candidateTasks").collect()) {
      if (task.doneAt !== undefined || task.remindedAt !== undefined) continue;
      if (task.dueOn > today) continue;
      const titles = await titlesFor(task.leadId);
      for (const channel of ["email", "line"] as const) {
        await openDraft(ctx, {
          leadId: task.leadId,
          kind: "missing_input",
          channel,
          ...(task.consultationId ? { consultationId: task.consultationId } : {}),
          titles,
          at: now,
          by: "the daily pass",
        });
      }
      await ctx.db.patch(task._id, { remindedAt: now });
      owed++;
    }

    return { unopened, owed };
  },
});
