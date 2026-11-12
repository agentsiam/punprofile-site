import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { MATCH_FEEDBACK_REASON_IDS } from "../src/lib/content/matchFeedback";

/**
 * A candidate's like or dislike on a matched role, from the email's links.
 * Public and unauthenticated: the token is the authorisation and it can do
 * exactly one thing, set the verdict on its own row.
 *
 * A bad token is not distinguished from a good one in the response, as
 * `marketing.unsubscribe`. Changing the answer is allowed: the latest verdict
 * stands, and a reason is cleared when the verdict turns to a like.
 */
export const record = mutation({
  args: {
    token: v.string(),
    verdict: v.union(v.literal("up"), v.literal("down")),
    reason: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    if (args.token.length < 32) return null;
    const row = await ctx.db
      .query("applications")
      .withIndex("by_feedback_token", (q) => q.eq("feedbackToken", args.token))
      .first();
    if (!row || row.origin !== "matched") return null;
    const reason = args.verdict === "down" && args.reason && MATCH_FEEDBACK_REASON_IDS.includes(args.reason)
      ? args.reason
      : undefined;
    await ctx.db.patch(row._id, {
      candidateVerdict: args.verdict,
      candidateVerdictAt: Date.now(),
      candidateVerdictReason: args.verdict === "down" ? (reason ?? row.candidateVerdictReason) : undefined,
    });
    return null;
  },
});
