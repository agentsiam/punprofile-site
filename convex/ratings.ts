/**
 * The coach's ECRA ratings for the paid Fit Report. Added 26/10/2026.
 *
 * Append-only, like `corrections.ts`: rating a competency again adds a row, and
 * the report reads the latest per competency. The rule table and the score
 * formula live in `src/lib/ecra.ts`, so a rating is checked against the same
 * rules the coach screen offered.
 */
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./leads";
import { v, ConvexError } from "convex/values";
import { ECRA, ecraScore } from "../src/lib/ecra";
import { DIMENSIONS, GATES } from "../src/lib/model";

/** The latest rating per competency for one candidate. */
export const latestForLead = query({
  args: { leadId: v.id("leads") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const rows = await ctx.db
      .query("competencyRatings")
      .withIndex("by_lead_item", (q) => q.eq("leadId", args.leadId))
      .collect();
    const latest = new Map<string, (typeof rows)[number]>();
    for (const r of rows) {
      const seen = latest.get(r.itemKey);
      if (!seen || r.ratedAt > seen.ratedAt) latest.set(r.itemKey, r);
    }
    return [...latest.values()];
  },
});

export const rate = mutation({
  args: {
    leadId: v.id("leads"),
    itemKey: v.string(),
    value: v.number(),
    note: v.optional(v.string()),
    source: v.optional(v.union(v.literal("coach"), v.literal("evidence"))),
    evidence: v.optional(v.string()),
    ticks: v.optional(v.array(v.number())),
    open: v.optional(v.array(v.number())),
  },
  handler: async (ctx, args) => {
    const by = await requireAdmin(ctx);
    const lead = await ctx.db.get(args.leadId);
    if (!lead) throw new ConvexError("Lead not found.");
    const rule = ECRA[args.itemKey];
    if (!rule) throw new ConvexError(`Unknown competency ${args.itemKey}.`);
    const max = rule.formula === "indicators" ? 4 : rule.levels.length - 1;
    if (!Number.isInteger(args.value) || args.value < 0 || args.value > max) {
      throw new ConvexError(`Value out of range for ${args.itemKey}.`);
    }
    const note = args.note?.trim() || undefined;
    const ticks = rule.formula === "indicators" && args.ticks ? [...new Set(args.ticks)].filter((i) => i >= 0 && i <= 3).sort() : undefined;
    const open = rule.formula === "indicators" && args.open ? [...new Set(args.open)].filter((i) => i >= 0 && i <= 3 && !ticks?.includes(i)).sort() : undefined;
    if (ticks && ticks.length !== args.value) throw new ConvexError("The ticked indicators and the value disagree.");
    const draft = (open?.length ?? 0) > 0;
    const score = ecraScore(rule, args.value);
    // Below the area's market bar a rating needs a next step, because it prints
    // in the candidate's Fit Report as "what to do next". Paul, 26/10/2026.
    const dim = DIMENSIONS.find((d) => d.items.some((i) => i.key === args.itemKey));
    const bar = GATES.find((g) => g.key === dim?.key)?.bar ?? 3;
    // A draft is not a rating yet, so it owes no next step until it is settled.
    if (!draft && score < bar && !note) throw new ConvexError("Below the market bar, write what they should do next.");
    return await ctx.db.insert("competencyRatings", {
      leadId: args.leadId,
      itemKey: args.itemKey,
      value: args.value,
      score,
      note,
      source: args.source ?? "coach",
      ...(args.evidence?.trim() ? { evidence: args.evidence.trim() } : {}),
      ...(ticks ? { ticks } : {}),
      ...(draft ? { open } : {}),
      ratedAt: Date.now(),
      by,
    });
  },
});

/** A row the report may read: not a draft with indicators still open. */
export const settled = <T extends { open?: number[] }>(r: T) => !r.open || r.open.length === 0;
