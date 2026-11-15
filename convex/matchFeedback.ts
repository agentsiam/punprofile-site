import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { MATCH_FEEDBACK_REASON_IDS } from "../src/lib/content/matchFeedback";
import { levelTerm, missingLanguages, topSalary } from "../src/lib/matchRules";
import { addRule } from "./candidateRules";
import { targetsFor } from "./targets";
import type { Situation } from "../src/lib/situation";

/**
 * A candidate's like or dislike on a matched role, from the email's links.
 * Public and unauthenticated: the token is the authorisation and it can do
 * exactly one thing, set the verdict on its own row and what follows from it.
 *
 * A bad token is not distinguished from a good one in the response, as
 * `marketing.unsubscribe`. Changing the answer is allowed: the latest verdict
 * stands, and a reason is cleared when the verdict turns to a like.
 *
 * What follows from a verdict, `job-database-handoff.md` § 4. The reason id
 * becomes at most one rule for this candidate and nobody else, because Paul's
 * decision D2 is that the public feed is untouched by anyone's taste. The one
 * exception is the one answer that is a fact about the job rather than a
 * preference: a posting reported closed is closed for everyone.
 *
 * The two the handoff says the coach confirms, a title term and a pay floor,
 * are written switched off. A figure or a word inferred from one dislike is a
 * guess until somebody agrees with it, and a guess applied silently costs the
 * candidate roles she would have taken.
 */
export const record = mutation({
  args: {
    token: v.string(),
    verdict: v.union(v.literal("up"), v.literal("down")),
    reason: v.optional(v.string()),
    /** The candidate's own words, D3. Optional, and the signal the eight
     *  reasons cannot carry. Never turned into a rule here: the run reads it
     *  and proposes one with the quote attached, for the coach to switch on. */
    comment: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    if (args.token.length < 32) return null;
    const row = await ctx.db
      .query("applications")
      .withIndex("by_feedback_token", (q) => q.eq("feedbackToken", args.token))
      .first();
    if (!row || row.origin !== "matched") return null;
    const reason =
      args.verdict === "down" && args.reason && MATCH_FEEDBACK_REASON_IDS.includes(args.reason) ? args.reason : undefined;
    const comment = args.comment?.trim().slice(0, 1000) || undefined;
    await ctx.db.patch(row._id, {
      candidateVerdict: args.verdict,
      candidateVerdictAt: Date.now(),
      candidateVerdictReason: args.verdict === "down" ? (reason ?? row.candidateVerdictReason) : undefined,
      ...(comment ? { candidateVerdictComment: comment } : {}),
    });

    const lead = await ctx.db.get(row.leadId);
    const situation = (lead?.situation ?? {}) as Situation;
    const titles = (await targetsFor(ctx, row.leadId)).filter((t) => t.status === "active").map((t) => t.title);
    const rule = (
      kind: Parameters<typeof addRule>[1]["kind"],
      extra: { value?: string; amount?: number; currency?: string },
      active: boolean,
    ) =>
      addRule(ctx, {
        leadId: row.leadId,
        kind,
        ...extra,
        source: "feedback",
        applicationId: row._id,
        ...(comment ? { quote: comment } : {}),
        active,
      });

    if (args.verdict === "up") {
      await rule("prefer_employer", { value: row.employer }, true);
      const term = row.roleTitle.split(/[^A-Za-z0-9]+/).find((w) => w.length > 3);
      if (term) await rule("prefer_title_term", { value: term }, true);
      return null;
    }

    switch (reason) {
      case "closed": {
        // A job fact, D5: true for everyone, the public feed included. No
        // personal rule, and no re-check: being told it is gone is the
        // encounter.
        if (row.jobId) {
          const job = await ctx.db.get(row.jobId);
          if (job && job.status === "open") await ctx.db.patch(row.jobId, { status: "filled", filledAt: Date.now() });
        }
        break;
      }
      case "title_level": {
        const term = levelTerm(row.roleTitle, titles);
        if (term) await rule("exclude_title_term", { value: term }, false);
        break;
      }
      case "location": {
        for (const city of situation.goal?.cities ?? []) await rule("require_city", { value: city }, true);
        break;
      }
      case "pay": {
        const top = topSalary(row.salary ?? null);
        const floor = situation.employersMustOffer?.payFloor;
        // Only where the posting's own top is above the floor already on the
        // panel: a dislike on a posting that states nothing says what she
        // turned down, not what she wants.
        if (top && (!floor || floor.currency !== top.currency || top.amount > floor.amount)) {
          await rule("min_pay", { amount: top.amount, currency: top.currency }, false);
        }
        break;
      }
      case "permit": {
        // Her word sets her own rule. The job's own `sponsorship` field is not
        // changed on it: what a posting says is read off the posting.
        await rule("require_sponsorship", {}, true);
        break;
      }
      case "language": {
        const job = row.jobId ? await ctx.db.get(row.jobId) : null;
        for (const l of missingLanguages(job?.languages, situation.employersMustOffer?.languages)) {
          await rule("exclude_language", { value: l }, true);
        }
        break;
      }
      case "applied": {
        await rule("exclude_employer", { value: row.employer }, true);
        break;
      }
      default:
        // `other`, or no reason at all. Nothing automatic: an invented rule
        // from free text is worse than none, and the comment is the signal.
        break;
    }
    return null;
  },
});
