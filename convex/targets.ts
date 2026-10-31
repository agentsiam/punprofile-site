/**
 * Target titles: the job titles a candidate goes for, set with the coach in the
 * Direction conversation. `lifecycle-data-model.md` § 8a.
 *
 * Admin-only writes. The candidate reads their active titles through
 * `portal.ts`. At most five active, because LinkedIn Open to Work takes five
 * titles; priorities among active titles are always 1..n with no gaps, so
 * "pushed first" is never ambiguous.
 */

import { mutation, type MutationCtx, type QueryCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { v, ConvexError } from "convex/values";
import { requireAdmin } from "./leads";

export const MAX_ACTIVE_TARGETS = 5;

/** Every target of a lead, active first by priority, then the rest by priority. */
export async function targetsFor(ctx: QueryCtx, leadId: Id<"leads">): Promise<Doc<"targets">[]> {
  const rows = await ctx.db
    .query("targets")
    .withIndex("by_lead", (q) => q.eq("leadId", leadId))
    .collect();
  const rank = (s: Doc<"targets">["status"]) => (s === "active" ? 0 : s === "paused" ? 1 : 2);
  return rows.sort((a, b) => rank(a.status) - rank(b.status) || a.priority - b.priority);
}

/** Close the gaps: active targets become 1..n in their current order. */
async function renumber(ctx: MutationCtx, leadId: Id<"leads">) {
  const active = (await targetsFor(ctx, leadId)).filter((t) => t.status === "active");
  for (const [i, t] of active.entries()) {
    if (t.priority !== i + 1) await ctx.db.patch(t._id, { priority: i + 1 });
  }
}

const clean = (s: string, max: number) => s.trim().replace(/\s+/g, " ").slice(0, max);

function cleanNames(names: string[], title: string): string[] {
  const seen = new Set([title.toLowerCase()]);
  const out: string[] = [];
  for (const n of names) {
    const c = clean(n, 80);
    if (!c || seen.has(c.toLowerCase())) continue;
    seen.add(c.toLowerCase());
    out.push(c);
  }
  if (out.length > 6) throw new ConvexError("Up to six other names per title.");
  return out;
}

async function activeCount(ctx: QueryCtx, leadId: Id<"leads">) {
  return (await targetsFor(ctx, leadId)).filter((t) => t.status === "active").length;
}

export const addTarget = mutation({
  args: {
    leadId: v.id("leads"),
    title: v.string(),
    alsoCalled: v.optional(v.array(v.string())),
    roleCategory: v.optional(v.string()),
    countries: v.optional(v.array(v.string())),
    evidenceNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const by = await requireAdmin(ctx);
    const lead = await ctx.db.get(args.leadId);
    if (!lead) throw new ConvexError("Lead not found.");
    const title = clean(args.title, 120);
    if (title.length < 2) throw new ConvexError("Give the title as job ads write it.");
    const n = await activeCount(ctx, args.leadId);
    if (n >= MAX_ACTIVE_TARGETS) {
      throw new ConvexError(`Already ${MAX_ACTIVE_TARGETS} active titles. Pause or drop one first.`);
    }
    const countries = (args.countries ?? []).map((c) => clean(c, 60)).filter(Boolean);
    return await ctx.db.insert("targets", {
      leadId: args.leadId,
      title,
      alsoCalled: cleanNames(args.alsoCalled ?? [], title),
      ...(args.roleCategory?.trim() ? { roleCategory: args.roleCategory.trim() } : {}),
      ...(countries.length ? { countries } : {}),
      priority: n + 1,
      status: "active",
      ...(args.evidenceNote?.trim() ? { evidenceNote: args.evidenceNote.trim().slice(0, 1000) } : {}),
      createdAt: Date.now(),
      by,
    });
  },
});

export const updateTarget = mutation({
  args: {
    targetId: v.id("targets"),
    title: v.optional(v.string()),
    alsoCalled: v.optional(v.array(v.string())),
    roleCategory: v.optional(v.union(v.string(), v.null())),
    countries: v.optional(v.union(v.array(v.string()), v.null())),
    evidenceNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const row = await ctx.db.get(args.targetId);
    if (!row) throw new ConvexError("Title not found.");
    const patch: Partial<Doc<"targets">> = {};
    const title = args.title !== undefined ? clean(args.title, 120) : row.title;
    if (title.length < 2) throw new ConvexError("A title cannot be empty.");
    if (args.title !== undefined) patch.title = title;
    if (args.alsoCalled !== undefined || args.title !== undefined) {
      patch.alsoCalled = cleanNames(args.alsoCalled ?? row.alsoCalled, title);
    }
    if (args.roleCategory !== undefined) patch.roleCategory = args.roleCategory?.trim() || undefined;
    if (args.countries !== undefined) {
      const c = (args.countries ?? []).map((x) => clean(x, 60)).filter(Boolean);
      patch.countries = c.length ? c : undefined;
    }
    if (args.evidenceNote !== undefined) patch.evidenceNote = args.evidenceNote.trim().slice(0, 1000) || undefined;
    await ctx.db.patch(args.targetId, patch);
  },
});

/**
 * Pause, drop or bring back a title. Coming back puts it last among the active
 * ones, and still counts against the five.
 */
export const setTargetStatus = mutation({
  args: {
    targetId: v.id("targets"),
    status: v.union(v.literal("active"), v.literal("paused"), v.literal("dropped")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const row = await ctx.db.get(args.targetId);
    if (!row) throw new ConvexError("Title not found.");
    if (row.status === args.status) return;
    if (args.status === "active") {
      const n = await activeCount(ctx, row.leadId);
      if (n >= MAX_ACTIVE_TARGETS) {
        throw new ConvexError(`Already ${MAX_ACTIVE_TARGETS} active titles. Pause or drop one first.`);
      }
      await ctx.db.patch(args.targetId, { status: "active", priority: n + 1 });
    } else {
      await ctx.db.patch(args.targetId, { status: args.status });
    }
    await renumber(ctx, row.leadId);
  },
});

/** Swap an active title with its neighbour. Moving it to 1 makes it the one pushed first. */
export const moveTarget = mutation({
  args: { targetId: v.id("targets"), direction: v.union(v.literal("up"), v.literal("down")) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const row = await ctx.db.get(args.targetId);
    if (!row || row.status !== "active") throw new ConvexError("Only an active title can be moved.");
    const active = (await targetsFor(ctx, row.leadId)).filter((t) => t.status === "active");
    const i = active.findIndex((t) => t._id === row._id);
    const j = args.direction === "up" ? i - 1 : i + 1;
    if (j < 0 || j >= active.length) return;
    await ctx.db.patch(active[i]._id, { priority: active[j].priority });
    await ctx.db.patch(active[j]._id, { priority: active[i].priority });
  },
});

/** Delete a title entered by mistake. Its CVs and jobs stay, unassigned. */
export const deleteTarget = mutation({
  args: { targetId: v.id("targets") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const row = await ctx.db.get(args.targetId);
    if (!row) return;
    for (const c of await ctx.db
      .query("cvDocuments")
      .withIndex("by_lead", (q) => q.eq("leadId", row.leadId))
      .collect()) {
      if (c.targetId === row._id) await ctx.db.patch(c._id, { targetId: undefined });
    }
    for (const a of await ctx.db
      .query("applications")
      .withIndex("by_lead_time", (q) => q.eq("leadId", row.leadId))
      .collect()) {
      if (a.targetId === row._id) await ctx.db.patch(a._id, { targetId: undefined });
    }
    await ctx.db.delete(row._id);
    await renumber(ctx, row.leadId);
  },
});
