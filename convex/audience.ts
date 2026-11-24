/**
 * The only place in `convex/` that reads an address out of `leads` in order to
 * assemble a list.
 *
 *   npx convex run audience:tally '{"campaign":"retake-2026"}'
 *
 * **Why this module exists, and why it is a script rather than a convention
 * that keeps it honest.** A retake invitation chose its cohort on consent
 * provenance plus an email address and reached a paying client. No send path in
 * this repo read conversion state at all, and four chokepoints of exactly this
 * kind had already been declared without one of them holding: `mayContact` in
 * `consentDb.ts` says nothing may email a candidate without it returning true
 * and has zero callers; `marketingAudience` in `consent.ts` says the digest and
 * the nurture track must both call it and no sender does; then
 * `marketing.recipients` and `retakeSend.sendable` each rebuilt the same scan
 * with a different test, and `retakeSend.cohort` repeated its own sibling's
 * test a third time inside one file. `scripts/verify-audience.ts` is in the
 * pre-push list because a fifth declaration would otherwise be the fifth thing
 * nobody calls.
 *
 * ---------------------------------------------------------------------------
 * TWO TESTS, IN ORDER, AND NEITHER ANSWERS FOR THE OTHER
 * ---------------------------------------------------------------------------
 *
 * **Consent first.** The consent record decides whether a channel may carry a
 * purpose for one person. It is the lawful basis and it is read before anything
 * else, because being in an audience is no defence for writing to somebody who
 * said no.
 *
 * **The stage second.** `08_Coaching_Business.md` states, for every lifecycle
 * stage, whether a send with a list behind it may reach it, and
 * `mayReceiveListedSend` in `src/lib/lifecycle.ts` is that table. It stops at
 * the sale: every campaign asks for a step a client has already taken.
 *
 * Being entitled to write is not the same as having something to say, and
 * clearing the booking rule is not the same as buying.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS DELIBERATELY DOES NOT GOVERN
 * ---------------------------------------------------------------------------
 *
 * A message to one person about their own result, booking, engagement, sign-in
 * or the roles found for them is part of the delivery, and it is addressed by
 * the thing that caused it. The six senders that take a single `leadId` from
 * the event that caused the message do not come through here and change in no
 * way. That split is the design: it is what keeps a client's sign-in code,
 * report notice and matched roles arriving while the same client sits in no
 * audience.
 *
 * ---------------------------------------------------------------------------
 * EVERY COUNT NAMES ITS POPULATION (R52)
 * ---------------------------------------------------------------------------
 *
 * `audienceFor` returns the recipients and a reason-coded tally of everybody it
 * left out, because a bare recipient count on this table is wrong by default: a
 * `leads` row is created on the first tap, before any answer and before any
 * contact, so the table holds traffic as well as people. The tally is the
 * denominator's receipt.
 */

import { v } from "convex/values";
import { internalQuery, type QueryCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { eventsFor } from "./consentDb";
import { CONSENT_PURPOSES, resolveConsent, type ConsentChannel } from "../src/lib/consent";
import {
  hasContact,
  mayReceiveListedSend,
  meetsBookingGate,
  stateFor,
  type ExclusionReason,
  type LifecycleState,
} from "../src/lib/lifecycle";

const channelValidator = v.union(v.literal("email"), v.literal("line"), v.literal("phone"));
const purposeValidator = v.union(v.literal("service"), v.literal("marketing"));

/**
 * "Agreed or beyond" read as "not still a proposal". `lapsed` and `refunded`
 * are what happened after a sale rather than instead of one, and treating a
 * refunded client as a lead again would be claiming they never bought.
 */
const AGREED_OR_BEYOND = new Set(["agreed", "active", "completed", "lapsed", "refunded"]);

export type Recipient = {
  leadId: Id<"leads">;
  address: string;
  fullName: string | null;
  stage: LifecycleState | null;
};

export type Audience = {
  recipients: Recipient[];
  /** Everybody the two tests and the send record left out, by reason (R52). */
  excluded: Record<ExclusionReason, number>;
  /** Rows read. Traffic as well as people, which is why it is not a headcount. */
  rowsRead: number;
  /** The tests that selected the recipients, so a readout can name them. */
  tests: { channel: ConsentChannel; purpose: string; campaign: string | null };
};

/**
 * The lifecycle stage of one lead, server side.
 *
 * `stateFor` was only ever called from the admin screen and an export script,
 * which is the mechanical reason no send path read conversion state: there was
 * nothing in `convex/` to call. This is that, and it stays private to this
 * module so a sender cannot reach past the two tests to the stage alone.
 */
async function stageOf(ctx: QueryCtx, lead: Doc<"leads">): Promise<LifecycleState | null> {
  const consultations = await ctx.db
    .query("consultations")
    .withIndex("by_lead_time", (q) => q.eq("leadId", lead._id))
    .collect();
  const engagements = await ctx.db
    .query("engagements")
    .withIndex("by_lead", (q) => q.eq("leadId", lead._id))
    .collect();
  const placements = await ctx.db
    .query("placements")
    .withIndex("by_lead", (q) => q.eq("leadId", lead._id))
    .collect();
  const events = await eventsFor(ctx, lead._id);

  // Every channel they gave, withdrawn for every purpose. A channel with no
  // consent recorded is not somebody who asked us to stop, so `never_asked`
  // does not count and the stage stays whatever else they are.
  const channels: ConsentChannel[] = [];
  if (lead.email) channels.push("email");
  if (lead.lineId) channels.push("line");
  if (lead.phone) channels.push("phone");
  const fullyWithdrawn =
    channels.length > 0 &&
    channels.every((channel) =>
      CONSENT_PURPOSES.every(
        (purpose) => resolveConsent(events, channel, purpose).status === "opted_out",
      ),
    );

  return stateFor({
    hasContact: hasContact(lead),
    meetsSqlRule: meetsBookingGate(lead.responses),
    consultationsHeld: consultations.filter((c) => c.outcome === "held").length,
    engagementsAgreed: engagements.filter((e) => AGREED_OR_BEYOND.has(e.status)).length,
    placementsSigned: placements.filter((p) => typeof p.signedAt === "number").length,
    fullyWithdrawn,
  });
}

/** The address a channel sends to, or null when this person has none. */
function addressOn(lead: Doc<"leads">, channel: ConsentChannel): string | null {
  const raw = channel === "email" ? lead.email : channel === "line" ? lead.lineId : lead.phone;
  return raw && raw.trim() !== "" ? raw : null;
}

/**
 * Assemble a list. The one function a campaign, a digest or a re-engagement
 * calls, and the only one in `convex/` permitted to take an address off a
 * `leads` row for that purpose.
 *
 * `campaign` is what makes a second run safe. Pass the campaign's own name and
 * anybody already carrying a `sends` row for it drops out as `already_sent`,
 * which is the guard the retake campaign did not have: it logged nothing and
 * its sender had no check, so the only thing between a cohort and a duplicate
 * was whoever remembered running it. Pass null for a genuinely repeatable send,
 * such as a weekly digest, where having had last week's is not a reason to miss
 * this week's.
 */
export async function audienceFor(
  ctx: QueryCtx,
  args: {
    channel: ConsentChannel;
    purpose: "service" | "marketing";
    campaign: string | null;
    /** Narrow to rows this predicate accepts, before either test runs. A
     *  campaign's own cohort rule, never a substitute for the two tests. */
    cohort?: (lead: Doc<"leads">) => boolean;
  },
): Promise<Audience> {
  const recipients: Recipient[] = [];
  const excluded: Record<ExclusionReason, number> = {
    no_address: 0,
    consent: 0,
    stage: 0,
    already_sent: 0,
  };
  let rowsRead = 0;

  for (const lead of await ctx.db.query("leads").collect()) {
    rowsRead += 1;
    if (args.cohort && !args.cohort(lead)) continue;

    const address = addressOn(lead, args.channel);
    if (address === null) {
      excluded.no_address += 1;
      continue;
    }

    // Consent first. It is the lawful basis and it is not a stage question.
    const events = await eventsFor(ctx, lead._id);
    if (resolveConsent(events, args.channel, args.purpose).status !== "opted_in") {
      excluded.consent += 1;
      continue;
    }

    // Then the stage. `null` is traffic and stays in: somebody who gave an
    // email alone has asked to be written to and holds no lifecycle position.
    const stage = await stageOf(ctx, lead);
    if (!mayReceiveListedSend(stage)) {
      excluded.stage += 1;
      continue;
    }

    if (args.campaign !== null) {
      const already = await ctx.db
        .query("sends")
        .withIndex("by_campaign_lead", (q) =>
          q.eq("campaign", args.campaign as string).eq("leadId", lead._id),
        )
        .first();
      if (already !== null) {
        excluded.already_sent += 1;
        continue;
      }
    }

    recipients.push({
      leadId: lead._id,
      address,
      fullName: lead.fullName ?? null,
      stage,
    });
  }

  return {
    recipients,
    excluded,
    rowsRead,
    tests: { channel: args.channel, purpose: args.purpose, campaign: args.campaign },
  };
}

/**
 * The tally without the addresses, so a run can be logged and reasoned about
 * without a list of people in the output.
 */
export const tally = internalQuery({
  args: {
    channel: channelValidator,
    purpose: purposeValidator,
    campaign: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const audience = await audienceFor(ctx, {
      channel: args.channel,
      purpose: args.purpose,
      campaign: args.campaign ?? null,
    });
    const byStage: Record<string, number> = {};
    for (const r of audience.recipients) {
      const key = r.stage ?? "traffic";
      byStage[key] = (byStage[key] ?? 0) + 1;
    }
    return {
      /** Rows read, traffic included. Not a headcount; see the module note. */
      rowsRead: audience.rowsRead,
      /** Of those, the ones both tests and the send record let through. */
      recipients: audience.recipients.length,
      excluded: audience.excluded,
      byStage,
      tests: audience.tests,
    };
  },
});
