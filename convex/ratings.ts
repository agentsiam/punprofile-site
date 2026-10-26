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
    return await ctx.db.insert("competencyRatings", {
      leadId: args.leadId,
      itemKey: args.itemKey,
      value: args.value,
      score: ecraScore(rule, args.value),
      note,
      ratedAt: Date.now(),
      by,
    });
  },
});
