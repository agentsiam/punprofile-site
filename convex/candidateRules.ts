/**
 * The per-person filter the evening run reads, `job-database-handoff.md` § 4.
 *
 * Paul's decision D2 of 12/11/2026: feedback changes only that candidate's
 * search, and the public feed is untouched by anyone's taste. The one thing
 * that does cross over is a fact about the job itself, and there is exactly
 * one of those: a posting reported closed is closed for everybody. That is
 * handled on `jobs`, not here.
 *
 * Rules rather than a trained model, and the reason is arithmetic rather than
 * taste: a paying client receives at most 13 roles in her pack, so she yields
 * 10 to 20 labels in all. No preference model learns anything from that; it
 * would fit noise and nobody could check it. A rule is a sentence the coach
 * can read, switch off and disagree with, and it applies from the first answer.
 *
 * Every rule a reason produces is written here with the role it came from, so
 * the coach can see the case rather than a conclusion.
 */

import { mutation, query, type MutationCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { v, ConvexError } from "convex/values";
import { requireAdmin } from "./leads";

const KIND = v.union(
  v.literal("exclude_employer"),
  v.literal("exclude_title_term"),
  v.literal("require_sponsorship"),
  v.literal("min_pay"),
  v.literal("require_city"),
  v.literal("exclude_language"),
  v.literal("prefer_employer"),
  v.literal("prefer_title_term"),
);

type Kind = typeof KIND.type;

/**
 * The rule as a sentence, which is how it is shown to the coach. A rule nobody
 * can read is a rule nobody can overrule.
 */
export function ruleLine(r: Doc<"candidateRules">): string {
  switch (r.kind) {
    case "exclude_employer":
      return `Skip ${r.value}`;
    case "exclude_title_term":
      return `Skip titles with "${r.value}" in them`;
    case "require_sponsorship":
      return "Only roles that state they sponsor";
    case "min_pay":
      return `Nothing under ${r.currency ?? ""} ${r.amount ?? ""} a year`.replace(/\s+/g, " ").trim();
    case "require_city":
      return `Only in ${r.value}`;
    case "exclude_language":
      return `Skip anything needing ${r.value}`;
    case "prefer_employer":
      return `Push ${r.value} up`;
    case "prefer_title_term":
      return `Push titles with "${r.value}" up`;
  }
}

/** The same rule twice is one rule. Keyed on what it does, not on what made it. */
function same(a: { kind: Kind; value?: string; amount?: number }, b: Doc<"candidateRules">): boolean {
  if (a.kind !== b.kind) return false;
  if (a.kind === "min_pay") return true;
  return (a.value ?? "").trim().toLowerCase() === (b.value ?? "").trim().toLowerCase();
}

/**
 * Write a rule, or leave the one already there alone.
 *
 * `min_pay` is the exception that is not a duplicate: a second dislike on pay
 * raises the floor rather than adding a rule, and it only ever goes up, because
 * a role she turned down for pay is evidence about the floor and a cheaper one
 * later is not evidence it came down.
 */
export async function addRule(
  ctx: MutationCtx,
  r: {
    leadId: Id<"leads">;
    kind: Kind;
    value?: string;
    amount?: number;
    currency?: string;
    source: "feedback" | "coach" | "brief";
    applicationId?: Id<"applications">;
    quote?: string;
    active: boolean;
    by?: string;
  },
): Promise<{ id: Id<"candidateRules">; added: boolean } | null> {
  const value = r.value?.trim().replace(/\s+/g, " ").slice(0, 200);
  if (r.kind !== "require_sponsorship" && r.kind !== "min_pay" && !value) return null;
  if (r.kind === "min_pay" && !(r.amount && r.amount > 0)) return null;

  const held = (await ctx.db.query("candidateRules").withIndex("by_lead", (q) => q.eq("leadId", r.leadId)).collect()).filter(
    (x) => same({ kind: r.kind, ...(value ? { value } : {}), ...(r.amount ? { amount: r.amount } : {}) }, x),
  );
  const existing = held[0];
  if (existing) {
    if (r.kind === "min_pay" && r.amount && r.amount > (existing.amount ?? 0)) {
      await ctx.db.patch(existing._id, {
        amount: r.amount,
        ...(r.currency ? { currency: r.currency } : {}),
        changedAt: Date.now(),
      });
    }
    return { id: existing._id, added: false };
  }
  const id = await ctx.db.insert("candidateRules", {
    leadId: r.leadId,
    kind: r.kind,
    ...(value ? { value } : {}),
    ...(r.amount ? { amount: r.amount } : {}),
    ...(r.currency ? { currency: r.currency } : {}),
    source: r.source,
    ...(r.applicationId ? { applicationId: r.applicationId } : {}),
    ...(r.quote?.trim() ? { quote: r.quote.trim().slice(0, 600) } : {}),
    active: r.active,
    createdAt: Date.now(),
    ...(r.by ? { by: r.by } : {}),
  });
  return { id, added: true };
}

/** One candidate's rules for the coach, each as a sentence with its case. */
export const forLead = query({
  args: { leadId: v.id("leads") },
  handler: async (ctx, { leadId }) => {
    await requireAdmin(ctx);
    const rows = (await ctx.db.query("candidateRules").withIndex("by_lead", (q) => q.eq("leadId", leadId)).collect()).sort(
      (a, b) => Number(b.active) - Number(a.active) || b.createdAt - a.createdAt,
    );
    const apps = await ctx.db.query("applications").withIndex("by_lead_time", (q) => q.eq("leadId", leadId)).collect();
    const role = new Map(apps.map((a) => [a._id, `${a.roleTitle}, ${a.employer}`]));
    return rows.map((r) => ({
      _id: r._id,
      line: ruleLine(r),
      active: r.active,
      source: r.source,
      quote: r.quote ?? null,
      from: r.applicationId ? (role.get(r.applicationId) ?? null) : null,
      createdAt: r.createdAt,
    }));
  },
});

/** The coach switches a rule on or off. Nothing is deleted: a rule turned off is a decision. */
export const setActive = mutation({
  args: { id: v.id("candidateRules"), active: v.boolean() },
  handler: async (ctx, { id, active }) => {
    const by = await requireAdmin(ctx);
    const row = await ctx.db.get(id);
    if (!row) throw new ConvexError("No such rule.");
    if (row.active === active) return;
    await ctx.db.patch(id, { active, changedAt: Date.now(), by });
  },
});

/** The coach writes one by hand. */
export const add = mutation({
  args: {
    leadId: v.id("leads"),
    kind: KIND,
    value: v.optional(v.string()),
    amount: v.optional(v.number()),
    currency: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const by = await requireAdmin(ctx);
    if (!(await ctx.db.get(args.leadId))) throw new ConvexError("Lead not found.");
    const r = await addRule(ctx, { ...args, source: "coach", active: true, by });
    if (!r) throw new ConvexError("That rule needs something to act on.");
    return r;
  },
});

/**
 * What the evening run reads: the active rules, and the last twenty verdicts
 * with their reasons and comments, per person.
 *
 * By lead id, as the panel's own run query is, so the exporter never has to
 * read a table of people whole to find two of them.
 */
export const forRun = query({
  args: { leadIds: v.array(v.id("leads")) },
  handler: async (ctx, { leadIds }) => {
    await requireAdmin(ctx);
    if (leadIds.length > 50) throw new ConvexError("Up to 50 people in one call.");
    const out = [];
    for (const leadId of leadIds) {
      const rules = await ctx.db.query("candidateRules").withIndex("by_lead", (q) => q.eq("leadId", leadId)).collect();
      const apps = await ctx.db.query("applications").withIndex("by_lead_time", (q) => q.eq("leadId", leadId)).collect();
      out.push({
        leadId,
        rules: rules
          .filter((r) => r.active)
          .map((r) => ({
            kind: r.kind,
            value: r.value ?? null,
            amount: r.amount ?? null,
            currency: r.currency ?? null,
            line: ruleLine(r),
          })),
        /** Proposed and not yet applied, so the run can say what is waiting. */
        proposed: rules.filter((r) => !r.active).map((r) => ({ kind: r.kind, line: ruleLine(r) })),
        verdicts: apps
          .filter((a) => a.candidateVerdict !== undefined)
          .sort((a, b) => (b.candidateVerdictAt ?? 0) - (a.candidateVerdictAt ?? 0))
          .slice(0, 20)
          .map((a) => ({
            employer: a.employer,
            roleTitle: a.roleTitle,
            verdict: a.candidateVerdict,
            reason: a.candidateVerdictReason ?? null,
            comment: a.candidateVerdictComment ?? null,
            at: a.candidateVerdictAt ?? null,
          })),
        /** The status of every matched role, which is the strongest signal of the three. */
        matched: apps
          .filter((a) => a.origin === "matched")
          .map((a) => ({ employer: a.employer, roleTitle: a.roleTitle, status: a.status, changedAt: a.statusChangedAt })),
      });
    }
    return out;
  },
});
