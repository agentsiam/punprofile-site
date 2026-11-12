import { mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { requireAdmin } from "./leads";
import { matchingFor, sendMatched, walletFor } from "./workspace";
import { targetsFor } from "./targets";
import { checklist, nextStep, MANUAL_STEPS } from "../src/lib/checklist";

/**
 * The Session tab's delivery checklist and the roles the evening run found,
 * `prd.md` § 8. The checklist is computed from records that already exist;
 * the only things stored here are the coach's two ticks and the found roles.
 */

const manualKey = v.union(v.literal("summary_email"), v.literal("timeline_shared"));

export const forLead = query({
  args: { leadId: v.id("leads") },
  handler: async (ctx, { leadId }) => {
    await requireAdmin(ctx);
    const lead = await ctx.db.get(leadId);
    if (!lead) return null;
    const now = Date.now();
    const { wallet, deliverables } = await walletFor(ctx, leadId);
    const live = deliverables.filter((d) => d.status !== "cancelled");
    const calls = (
      await ctx.db.query("consultations").withIndex("by_lead_time", (q) => q.eq("leadId", leadId)).collect()
    ).sort((a, b) => a.heldAt - b.heldAt);
    const preview = live.find((d) => d.entitlement === "pack_preview") ?? null;
    const prep = preview
      ? (await ctx.db.query("preparations").withIndex("by_lead", (q) => q.eq("leadId", leadId)).collect()).find(
          (p) => p.deliverableId === preview._id,
        ) ?? null
      : null;
    const access = (
      await ctx.db.query("candidateAccess").withIndex("by_lead", (q) => q.eq("leadId", leadId)).collect()
    )
      .filter((a) => a.revokedAt === undefined)
      .sort((a, b) => b.grantedAt - a.grantedAt)[0];
    const sharedNotes = (
      await ctx.db.query("deliveryNotes").withIndex("by_lead", (q) => q.eq("leadId", leadId)).collect()
    ).filter((n) => n.shared);
    const ticks = await ctx.db.query("checklistTicks").withIndex("by_lead", (q) => q.eq("leadId", leadId)).collect();
    const fit = live.find((d) => d.kind === "fit_report") ?? null;
    const cv = live.find((d) => d.entitlement === "pack_cv_rewrite") ?? null;

    const rows = checklist({
      packAt: wallet.entitlements.pack ? (wallet.entitlements.pack.agreedAt ?? now) : null,
      access: access
        ? {
            codeIssuedAt: access.codeIssuedAt ?? null,
            codeEmailed: access.codeDelivery === "emailed",
            lastSignInAt: access.lastSignInAt ?? null,
          }
        : null,
      calls: calls.map((c) => ({ heldAt: c.heldAt, outcome: c.outcome, deliverableId: c.deliverableId ?? null })),
      firstSharedNoteAt: sharedNotes.length ? Math.min(...sharedNotes.map((n) => n.at)) : null,
      ticks: Object.fromEntries(ticks.map((t) => [t.key, t.at])),
      activeTitles: (await targetsFor(ctx, leadId)).filter((t) => t.status === "active").length,
      matching: await matchingFor(ctx, leadId),
      preview: preview ? { id: preview._id, status: preview.status, deliveredAt: preview.deliveredAt ?? null } : null,
      previewPrepAt: prep?.submittedAt ?? null,
      fitReport: fit ? { status: fit.status, deliveredAt: fit.deliveredAt ?? null } : null,
      cvRewrite: cv ? { status: cv.status, deliveredAt: cv.deliveredAt ?? null } : null,
      closure: wallet.entitlements.closure,
      now,
    });

    const found = (
      await ctx.db
        .query("foundRoles")
        .withIndex("by_lead", (q) => q.eq("leadId", leadId).eq("status", "waiting"))
        .collect()
    ).sort((a, b) => b.foundOn.localeCompare(a.foundOn) || a.addedAt - b.addedAt);

    return { rows, next: nextStep(rows), found, spendable: wallet.spendable };
  },
});

/** The coach ticks, or unticks, one of the two steps outside the app. */
export const tick = mutation({
  args: { leadId: v.id("leads"), key: manualKey, done: v.boolean() },
  handler: async (ctx, { leadId, key, done }) => {
    const by = await requireAdmin(ctx);
    if (!MANUAL_STEPS.includes(key)) throw new ConvexError("Not a step the coach ticks.");
    const rows = await ctx.db.query("checklistTicks").withIndex("by_lead", (q) => q.eq("leadId", leadId)).collect();
    const existing = rows.filter((r) => r.key === key);
    if (done && existing.length === 0) await ctx.db.insert("checklistTicks", { leadId, key, at: Date.now(), by });
    if (!done) for (const r of existing) await ctx.db.delete(r._id);
  },
});

const foundRole = v.object({
  targetTitle: v.string(),
  employer: v.string(),
  roleTitle: v.string(),
  country: v.string(),
  location: v.optional(v.string()),
  jobUrl: v.string(),
  salary: v.optional(v.string()),
  postedOn: v.optional(v.string()),
  matchReason: v.string(),
});

/**
 * The evening run adds the roles that passed for one client. A link already
 * held for this candidate, waiting, sent or dismissed, is skipped, and so is
 * one already in their job tracker.
 */
export const addFound = mutation({
  args: { leadId: v.id("leads"), foundOn: v.string(), roles: v.array(foundRole) },
  handler: async (ctx, { leadId, foundOn, roles }) => {
    await requireAdmin(ctx);
    if (!(await ctx.db.get(leadId))) throw new ConvexError("Lead not found.");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(foundOn)) throw new ConvexError("foundOn is an ISO date.");
    const tracked = new Set(
      (await ctx.db.query("applications").withIndex("by_lead_time", (q) => q.eq("leadId", leadId)).collect()).flatMap((a) =>
        a.jobUrl ? [a.jobUrl] : [],
      ),
    );
    let added = 0;
    let skipped = 0;
    for (const r of roles) {
      const jobUrl = r.jobUrl.trim();
      if (!/^https:\/\//.test(jobUrl)) throw new ConvexError(`Not an https link: ${jobUrl}`);
      const held = await ctx.db
        .query("foundRoles")
        .withIndex("by_lead_url", (q) => q.eq("leadId", leadId).eq("jobUrl", jobUrl))
        .first();
      if (held || tracked.has(jobUrl)) {
        skipped++;
        continue;
      }
      await ctx.db.insert("foundRoles", {
        leadId,
        foundOn,
        targetTitle: r.targetTitle.trim(),
        employer: r.employer.trim(),
        roleTitle: r.roleTitle.trim(),
        country: r.country.trim(),
        ...(r.location?.trim() ? { location: r.location.trim() } : {}),
        jobUrl,
        ...(r.salary?.trim() ? { salary: r.salary.trim() } : {}),
        ...(r.postedOn?.trim() ? { postedOn: r.postedOn.trim() } : {}),
        matchReason: r.matchReason.trim(),
        status: "waiting",
        addedAt: Date.now(),
      });
      added++;
    }
    return { added, skipped };
  },
});

export const dismissFound = mutation({
  args: { id: v.id("foundRoles") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const row = await ctx.db.get(id);
    if (!row || row.status !== "waiting") throw new ConvexError("That role is no longer waiting.");
    await ctx.db.patch(id, { status: "dismissed", decidedAt: Date.now() });
  },
});

/** Send a found role as a matched role: the same rules as the Delivery tab. */
export const sendFound = mutation({
  args: { id: v.id("foundRoles") },
  handler: async (ctx, { id }) => {
    const by = await requireAdmin(ctx);
    const row = await ctx.db.get(id);
    if (!row || row.status !== "waiting") throw new ConvexError("That role is no longer waiting.");
    const want = row.targetTitle.trim().toLowerCase();
    const target = (await targetsFor(ctx, row.leadId)).find(
      (t) => t.status === "active" && (t.title.trim().toLowerCase() === want || t.alsoCalled.some((a) => a.trim().toLowerCase() === want)),
    );
    const applicationId = await sendMatched(ctx, by, {
      leadId: row.leadId,
      employer: row.employer,
      roleTitle: row.roleTitle,
      country: row.country,
      ...(row.location ? { location: row.location } : {}),
      jobUrl: row.jobUrl,
      ...(row.salary ? { salary: row.salary } : {}),
      matchReason: row.matchReason,
      ...(target ? { targetId: target._id } : {}),
    });
    await ctx.db.patch(id, { status: "sent", applicationId, decidedAt: Date.now() });
    return applicationId;
  },
});
