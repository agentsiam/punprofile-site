import { internalAction, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { greetingName } from "./names";
import { matchEmailSubject, matchEmailHtml, matchEmailText, type NoticeRole } from "./matchEmail";
import { walletFor } from "./workspace";

/**
 * The matched-role notice, `prd.md` § 8, Matched roles. Scheduled by
 * `workspace.sendMatchedRole`; never called by a client.
 *
 * It only ever reads and marks roles that already exist, so a retry can send
 * the email again but can never create a role or spend a token.
 */

const RETRY_MS = 60 * 60 * 1000;
const MAX_ATTEMPTS = 3;
/** A role older than this is never announced late, e.g. one sent before notices existed. */
const FRESH_MS = 7 * 24 * 60 * 60 * 1000;

export const pending = internalQuery({
  args: { leadId: v.id("leads") },
  handler: async (ctx, { leadId }) => {
    const lead = await ctx.db.get(leadId);
    if (!lead) return null;
    const apps = await ctx.db
      .query("applications")
      .withIndex("by_lead_time", (q) => q.eq("leadId", leadId))
      .collect();
    const roles = apps
      .filter((a) => a.origin === "matched" && a.notifiedAt === undefined && a.savedAt > Date.now() - FRESH_MS)
      .sort((a, b) => a.savedAt - b.savedAt);
    const { wallet } = await walletFor(ctx, leadId);
    return {
      email: lead.email ?? null,
      firstName: greetingName(lead),
      tokensLeft: wallet.spendable,
      roles: roles.map((a) => ({
        _id: a._id,
        employer: a.employer,
        roleTitle: a.roleTitle,
        country: a.country,
        location: a.location ?? null,
        jobUrl: a.jobUrl ?? null,
        matchReason: a.matchReason ?? null,
        salary: a.salary ?? null,
        feedbackToken: a.feedbackToken ?? null,
      })),
    };
  },
});

/**
 * Give every role about to be announced its like and dislike capability.
 * Done here rather than in `sendMatchedRole` so roles sent before the field
 * existed get one too. Idempotent: a row that has a token keeps it.
 */
export const ensureFeedbackTokens = internalMutation({
  args: { ids: v.array(v.id("applications")) },
  handler: async (ctx, { ids }) => {
    for (const id of ids) {
      const row = await ctx.db.get(id);
      if (!row || row.feedbackToken) continue;
      // Two UUIDs, as the unsubscribe token: it sits in plain text in an
      // email that gets forwarded.
      const token = `${crypto.randomUUID()}${crypto.randomUUID()}`.replace(/-/g, "");
      await ctx.db.patch(id, { feedbackToken: token });
    }
  },
});

export const finish = internalMutation({
  args: { leadId: v.id("leads"), notified: v.array(v.id("applications")), sentAt: v.optional(v.number()) },
  handler: async (ctx, { leadId, notified, sentAt }) => {
    for (const id of notified) {
      const row = await ctx.db.get(id);
      if (row && row.leadId === leadId) await ctx.db.patch(id, { notifiedAt: sentAt ?? Date.now() });
    }
    await ctx.db.patch(leadId, {
      matchNoticeAt: undefined,
      ...(sentAt !== undefined ? { matchNoticeSentAt: sentAt } : {}),
    });
  },
});

export const retryLater = internalMutation({
  args: { leadId: v.id("leads"), attempt: v.number() },
  handler: async (ctx, { leadId, attempt }) => {
    const at = Date.now() + RETRY_MS;
    await ctx.db.patch(leadId, { matchNoticeAt: at });
    await ctx.scheduler.runAt(at, internal.matchNotice.send, { leadId, attempt });
  },
});

export const send = internalAction({
  args: { leadId: v.id("leads"), attempt: v.number() },
  handler: async (ctx, { leadId, attempt }): Promise<void> => {
    const first = await ctx.runQuery(internal.matchNotice.pending, { leadId });
    if (first && first.roles.some((r) => !r.feedbackToken)) {
      await ctx.runMutation(internal.matchNotice.ensureFeedbackTokens, { ids: first.roles.map((r) => r._id) });
    }
    const p = first && first.roles.some((r) => !r.feedbackToken)
      ? await ctx.runQuery(internal.matchNotice.pending, { leadId })
      : first;
    if (!p || !p.email || p.roles.length === 0) {
      await ctx.runMutation(internal.matchNotice.finish, { leadId, notified: [] });
      return;
    }
    const key = process.env.RESEND_API_KEY;
    const from = process.env.MAIL_FROM;
    if (!key || !from) {
      // No mail sender: the roles stay on the dashboard, marked not notified.
      console.warn("matched-role notice not sent: no mail sender set");
      await ctx.runMutation(internal.matchNotice.finish, { leadId, notified: [] });
      return;
    }
    const roles: NoticeRole[] = p.roles.map((r) => ({
      employer: r.employer,
      roleTitle: r.roleTitle,
      country: r.country,
      location: r.location,
      jobUrl: r.jobUrl,
      matchReason: r.matchReason,
      salary: r.salary,
      feedbackToken: r.feedbackToken,
    }));
    const receipt = { used: roles.length, left: p.tokensLeft };
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: p.email,
        ...(process.env.MAIL_REPLY_TO ? { reply_to: process.env.MAIL_REPLY_TO } : {}),
        subject: matchEmailSubject(roles.length),
        html: matchEmailHtml(p.firstName, roles, receipt),
        text: matchEmailText(p.firstName, roles, receipt),
      }),
    });
    if (res.ok) {
      await ctx.runMutation(internal.matchNotice.finish, {
        leadId,
        notified: p.roles.map((r) => r._id),
        sentAt: Date.now(),
      });
      return;
    }
    console.error(`matched-role notice failed, attempt ${attempt}: ${res.status} ${(await res.text()).slice(0, 200)}`);
    if (attempt < MAX_ATTEMPTS) {
      await ctx.runMutation(internal.matchNotice.retryLater, { leadId, attempt: attempt + 1 });
    } else {
      // Give up for now; the next role sent schedules a notice that lists these too.
      await ctx.runMutation(internal.matchNotice.finish, { leadId, notified: [] });
    }
  },
});
