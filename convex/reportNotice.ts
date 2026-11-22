import { internalAction, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { greetingName } from "./names";
import { REPORT_EMAIL_SUBJECT, reportEmailHtml, reportEmailText, type ReportReceipt } from "./reportEmail";
import { walletFor } from "./workspace";

/**
 * The Fit Report notice. Scheduled by `workspace.scheduleFitReportNotice` from
 * the two mutations that put the report on the candidate's page; never called
 * by a client. `matchNotice.ts` is the pattern, for the same reason it was the
 * pattern for the release message in `coaching-delivery-design-system.md` § 7a: a
 * notice that can be retried without any chance of charging a token twice.
 *
 * It reads and announces. It never shares a report, marks a deliverable or
 * touches the ledger, so a retry can send the email again and can do nothing
 * else. `fitReportNoticeSentAt` is the one thing it writes besides clearing its
 * own pending stamp, and `pending` refuses once that is set, so a candidate is
 * told the report is ready once however often it is re-shared.
 *
 * The three reasons it sends nothing, each leaving the report on the dashboard
 * exactly as it is: the report is no longer shared (the coach un-shared it
 * inside the quarter-hour wait), the record carries no email address, or the
 * deployment has no mail sender. The first is a decision and the other two are
 * faults, so the coach queue shows them rather than this file guessing.
 */

const RETRY_MS = 60 * 60 * 1000;
const MAX_ATTEMPTS = 3;

export const pending = internalQuery({
  args: { leadId: v.id("leads") },
  handler: async (ctx, { leadId }) => {
    const lead = await ctx.db.get(leadId);
    if (!lead) return null;
    // Re-read rather than trusted from the schedule: the quarter-hour wait is
    // there so an un-share takes the email back, which only works if the share
    // is checked when the email is about to go and not when it was queued.
    if (lead.fitReportSharedAt === undefined) return null;
    if (lead.fitReportNoticeSentAt !== undefined) return null;

    const { wallet, ledger, deliverables } = await walletFor(ctx, leadId);
    const fit = deliverables.find((d) => d.kind === "fit_report" && d.status === "delivered");
    // The charge the delivery wrote, which is the only honest source for what
    // the report cost this candidate. A report shared without one, e.g. an
    // early record reconciled by hand, simply carries no receipt line.
    const charge = ledger.find(
      (t) => t.delta < 0 && t.reason === "fit_report" && (fit ? t.deliverableId === fit._id : true),
    );
    const receipt: ReportReceipt | null = charge ? { used: -charge.delta, left: wallet.spendable } : null;

    return { email: lead.email ?? null, firstName: greetingName(lead), receipt };
  },
});

export const finish = internalMutation({
  args: { leadId: v.id("leads"), sentAt: v.optional(v.number()) },
  handler: async (ctx, { leadId, sentAt }) => {
    if (!(await ctx.db.get(leadId))) return;
    await ctx.db.patch(leadId, {
      fitReportNoticeAt: undefined,
      ...(sentAt !== undefined ? { fitReportNoticeSentAt: sentAt } : {}),
    });
  },
});

/**
 * Three hours of failures, or an address that was never there.
 *
 * It clears the pending stamp without marking the notice sent, so re-sharing
 * the report queues a fresh one, and it leaves one unshared `deliveryNotes`
 * row saying why. That row is the point: Sentry watches the website and sees
 * nothing that happens inside Convex, so a failed send would otherwise exist
 * only as a line in the deployment log that nobody reads, and the coach would
 * believe a candidate had been told.
 */
export const giveUp = internalMutation({
  args: { leadId: v.id("leads"), why: v.string() },
  handler: async (ctx, { leadId, why }) => {
    if (!(await ctx.db.get(leadId))) return;
    await ctx.db.patch(leadId, { fitReportNoticeAt: undefined });
    await ctx.db.insert("deliveryNotes", {
      leadId,
      body: `The Fit Report email did not go out: ${why} The report is on their dashboard. Tell them another way, or share it again to try the email once more.`,
      shared: false,
      at: Date.now(),
      by: "the Fit Report notice",
    });
  },
});

export const retryLater = internalMutation({
  args: { leadId: v.id("leads"), attempt: v.number() },
  handler: async (ctx, { leadId, attempt }) => {
    const at = Date.now() + RETRY_MS;
    await ctx.db.patch(leadId, { fitReportNoticeAt: at });
    await ctx.scheduler.runAt(at, internal.reportNotice.send, { leadId, attempt });
  },
});

export const send = internalAction({
  args: { leadId: v.id("leads"), attempt: v.number() },
  handler: async (ctx, { leadId, attempt }): Promise<void> => {
    const p = await ctx.runQuery(internal.reportNotice.pending, { leadId });
    if (!p) {
      await ctx.runMutation(internal.reportNotice.finish, { leadId });
      return;
    }
    if (!p.email) {
      // Nothing here can make an address, so the coach is told instead.
      await ctx.runMutation(internal.reportNotice.giveUp, {
        leadId,
        why: "there is no email address on this record.",
      });
      return;
    }
    const key = process.env.RESEND_API_KEY;
    const from = process.env.MAIL_FROM;
    if (!key || !from) {
      await ctx.runMutation(internal.reportNotice.giveUp, {
        leadId,
        why: "this deployment has no mail sender set.",
      });
      return;
    }
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: p.email,
        ...(process.env.MAIL_REPLY_TO ? { reply_to: process.env.MAIL_REPLY_TO } : {}),
        subject: REPORT_EMAIL_SUBJECT,
        html: reportEmailHtml(p.firstName, p.receipt),
        text: reportEmailText(p.firstName, p.receipt),
      }),
    });
    if (res.ok) {
      await ctx.runMutation(internal.reportNotice.finish, { leadId, sentAt: Date.now() });
      return;
    }
    console.error(`Fit Report notice failed, attempt ${attempt}: ${res.status} ${(await res.text()).slice(0, 200)}`);
    if (attempt < MAX_ATTEMPTS) {
      await ctx.runMutation(internal.reportNotice.retryLater, { leadId, attempt: attempt + 1 });
      return;
    }
    await ctx.runMutation(internal.reportNotice.giveUp, {
      leadId,
      why: `the mail service refused it ${MAX_ATTEMPTS} times over ${MAX_ATTEMPTS} hours.`,
    });
  },
});
