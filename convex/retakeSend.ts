/**
 * Sending the retake email to the people who filled in the Lead Discovery
 * Survey, on the **service** consent they gave when they filled it in.
 *
 * **Why this is not `marketingSend`.** That one resolves `("email", "marketing")`
 * and returns 24 leads, none of them this cohort: the imported survey leads gave
 * service consent and were never asked for marketing. Paul's call, 23/11/2026,
 * is that this message is service, so it goes on the consent these people
 * actually gave rather than through a gate they would all fail. The gate is not
 * removed, it is a different purpose: `resolveConsent(events, "email",
 * "service")` has to return `opted_in` for every address this reaches.
 *
 * **Who it is for is wider than the draft's 78.** That number was the subset
 * whose free-text field no keyword table can read, and it mattered when the
 * email was about their answers being stale. The story is now that EU Fit Check
 * has been rebuilt, which is true for every imported survey lead, so the cohort
 * is `consentSource: "survey_import"` and the readable-field split is reported
 * rather than filtered on.
 *
 *   npx convex run retakeSend:cohort
 *   npx convex run retakeSend:send                      a dry run, the default
 *   npx convex run retakeSend:send '{"dryRun":false}'   a real send
 */

import { v } from "convex/values";
import { internalAction, internalMutation, internalQuery } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { eventsFor } from "./consentDb";
import { resolveConsent } from "../src/lib/consent";
import { knowsCategory } from "../src/lib/role-keywords";
import { audienceFor } from "./audience";
import { retakeEmailHtml, retakeEmailSubject, retakeEmailText } from "./retakeEmail";

type Recipient = { leadId: Id<"leads">; email: string; readableField: boolean };

/**
 * The campaign's own name, and the key the duplicate guard turns on.
 *
 * Before this existed nothing logged a send and `send` had no check, so a
 * second run reached everybody a first run had already reached and the only
 * thing standing in the way was whoever remembered. `audience.ts` reads the
 * `sends` table in the same call that assembles the list, so "already had this
 * message" is no longer a thing a sender can forget to ask.
 */
const CAMPAIGN = "retake-2026";

/** Rows this campaign is about: the imported survey leads, and nobody else. */
const IS_SURVEY_IMPORT = (lead: Doc<"leads">) => lead.consentSource === "survey_import";

/**
 * Everyone this send may reach, and the counts that say who they are.
 *
 * Read-only. Every count names the test that selected it, because a bare number
 * of people is wrong by default on this table.
 *
 * **The scan is gone from this file.** It used to run here, and again in
 * `sendable` below with the same test written a second time, and neither read
 * conversion state: that is how a retake invitation reached a paying client.
 * Both now call `audienceFor`, which resolves consent first and the lifecycle
 * stage second and will not hand back a client.
 */
export const cohort = internalQuery({
  args: {},
  handler: async (ctx) => {
    const audience = await audienceFor(ctx, {
      channel: "email",
      purpose: "service",
      campaign: CAMPAIGN,
      cohort: IS_SURVEY_IMPORT,
    });

    let readable = 0;
    let alsoMarketing = 0;
    for (const r of audience.recipients) {
      const lead = await ctx.db.get(r.leadId);
      if (lead && knowsCategory(lead.roleCategory ?? null)) readable += 1;
      if (resolveConsent(await eventsFor(ctx, r.leadId), "email", "marketing").status === "opted_in") {
        alsoMarketing += 1;
      }
    }

    return {
      /** Rows read, traffic included. Not a headcount; see `audience.ts`. */
      rowsRead: audience.rowsRead,
      /** Of the imported survey leads, the ones both tests let through. */
      sendable: audience.recipients.length,
      /**
       * Why the rest were left out. `stage` is the one this campaign exists to
       * respect: a client is being served rather than sold to, and the free
       * instrument is a step they have already paid to skip.
       */
      excluded: audience.excluded,
      /** Of the sendable, how many also hold a marketing opt-in. */
      alsoMarketing,
      /** Of the sendable, the split the draft's 78 came from. */
      readableField: readable,
      unreadableField: audience.recipients.length - readable,
    };
  },
});

/** The addresses themselves, kept separate from the counts so a log can stay countable. */
export const sendable = internalQuery({
  args: {},
  handler: async (ctx): Promise<Recipient[]> => {
    const audience = await audienceFor(ctx, {
      channel: "email",
      purpose: "service",
      campaign: CAMPAIGN,
      cohort: IS_SURVEY_IMPORT,
    });
    const out: Recipient[] = [];
    for (const r of audience.recipients) {
      const lead = await ctx.db.get(r.leadId);
      out.push({
        leadId: r.leadId,
        email: r.address,
        readableField: knowsCategory(lead?.roleCategory ?? null),
      });
    }
    return out;
  },
});

/**
 * Written after a send actually leaves, one row per person per campaign.
 *
 * It is the thing that makes a second run safe, so it is written per recipient
 * rather than once at the end: a run that dies half way leaves the people it
 * reached marked and the rest still reachable, which is what lets the same
 * command be the resume (R45).
 */
export const recordSend = internalMutation({
  args: { leadId: v.id("leads"), to: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const already = await ctx.db
      .query("sends")
      .withIndex("by_campaign_lead", (q) => q.eq("campaign", CAMPAIGN).eq("leadId", args.leadId))
      .first();
    if (already !== null) return null;
    await ctx.db.insert("sends", {
      leadId: args.leadId,
      campaign: CAMPAIGN,
      to: args.to,
      sentAt: Date.now(),
    });
    return null;
  },
});

export const send = internalAction({
  args: {
    /** Log what would happen and send nothing. The default, deliberately. */
    dryRun: v.optional(v.boolean()),
    /**
     * Send to this one address instead of the whole cohort.
     *
     * It filters the consented list; it does not replace it, so an address that
     * is not in the cohort matches nothing and the run reports zero attempted.
     * There is no way to name a recipient this function would not otherwise have
     * reached, which is the property `marketingSend` has and the reason this is
     * not a `to` argument.
     */
    only: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ attempted: number; sent: number; failed: number }> => {
    const key = process.env.RESEND_API_KEY;
    const from = process.env.MAIL_FROM;
    const dryRun = args.dryRun ?? true;

    const everyone: Recipient[] = await ctx.runQuery(internal.retakeSend.sendable, {});
    const only = args.only?.trim().toLowerCase();
    const list = only ? everyone.filter((r) => r.email.toLowerCase() === only) : everyone;

    if (only && list.length === 0) {
      console.warn(
        `retakeSend refused: the address given to \`only\` is not in the cohort, ` +
          `so there is nobody to send to. ${everyone.length} recipient(s) were untouched.`,
      );
      return { attempted: 0, sent: 0, failed: 0 };
    }
    if (!key || !from) {
      console.warn(
        `retakeSend refused: ${!key ? "RESEND_API_KEY" : "MAIL_FROM"} is not set on this deployment. ` +
          `${list.length} recipient(s) hold a live service opt-in and none were emailed.`,
      );
      return { attempted: list.length, sent: 0, failed: 0 };
    }

    let sent = 0;
    let failed = 0;
    for (const r of list) {
      if (dryRun) {
        sent++;
        continue;
      }
      try {
        // The greeting is empty for all of them: `greetingName()` reads nickname
        // then firstName and this cohort carries only fullName, so the no-name
        // line is what ships until that decision moves.
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from,
            to: [r.email],
            // `MAIL_FROM` is a no-reply address on a domain with no MX records.
            ...(process.env.MAIL_REPLY_TO ? { reply_to: process.env.MAIL_REPLY_TO } : {}),
            subject: retakeEmailSubject,
            text: retakeEmailText(null),
            html: retakeEmailHtml(null),
          }),
        });
        if (res.ok) {
          sent++;
          // Logged per recipient, not once at the end: see `recordSend`.
          await ctx.runMutation(internal.retakeSend.recordSend, {
            leadId: r.leadId as Id<"leads">,
            to: r.email,
          });
        } else {
          failed++;
          console.warn(`retakeSend: Resend returned ${res.status} for one recipient`);
        }
      } catch (e) {
        failed++;
        console.warn(`retakeSend: one recipient failed, ${String(e)}`);
      }
    }

    console.log(
      `retakeSend: attempted ${list.length}, sent ${sent}, failed ${failed}, dryRun ${dryRun}` +
        (only ? ", restricted to one address" : ""),
    );
    return { attempted: list.length, sent, failed };
  },
});
