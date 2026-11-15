/**
 * The outbox: what we are about to say to a candidate, waiting on the coach,
 * `candidate-situation-handoff.md` § 4.
 *
 * A draft is created empty by the event that calls for it, carrying the
 * Situation panel as it read at that moment and the decisions of the session.
 * Whatever has a model writes the words into it; this app has none, and a
 * design that pretended otherwise would have to invent the writing somewhere.
 * The coach reads it, edits it and approves it.
 *
 * The rule the panel exists to enforce: a draft is written from the panel plus
 * its event and nothing else, so a message cannot miss the work route or the
 * start date, and cannot state a fact the panel does not hold. `writtenFrom`
 * keeps the lines it was given, so that is checkable later rather than merely
 * claimed. An edit to a FACT goes back into the panel through the close form,
 * never into the message alone, or the next message contradicts this one.
 *
 * Email is sent from here. LINE is copied by the coach and never sent: there
 * is no LINE integration, and an outbox quietly growing one is not a thing
 * anybody asked for.
 */

import { internalAction, internalMutation, internalQuery, mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { v, ConvexError } from "convex/values";
import { requireAdmin } from "./leads";
import { greetingName } from "./names";
import { targetsFor } from "./targets";
import { outboxEmailHtml, outboxEmailText } from "./outboxEmail";
import { panel, type Situation } from "../src/lib/situation";

const KIND = v.union(
  v.literal("session_summary"),
  v.literal("line_after_session"),
  v.literal("dashboard_note"),
  v.literal("matched_role"),
  v.literal("missing_input"),
);

const CHANNEL = v.union(v.literal("email"), v.literal("line"), v.literal("dashboard"));

const clean = (s: string, max: number) => s.trim().slice(0, max);

/** The panel as it reads now, label and line, for a draft to be written from. */
export async function panelLines(
  ctx: QueryCtx | MutationCtx,
  leadId: Id<"leads">,
  titles: string[],
): Promise<{ label: string; line: string }[]> {
  const lead = await ctx.db.get(leadId);
  return panel((lead?.situation ?? null) as Situation | null, titles)
    .filter((r) => r.line !== null)
    .map((r) => ({ label: r.label, line: r.line as string }));
}

/**
 * The event says a message is owed. Nothing is written yet.
 *
 * Used by the session close and callable on its own, because a coach who
 * needs a missing-input request should not have to invent a session to get
 * one. A draft of the same kind for the same event that is still open is
 * returned as it is rather than duplicated.
 */
export async function openDraft(
  ctx: MutationCtx,
  args: {
    leadId: Id<"leads">;
    kind: typeof KIND.type;
    channel: "email" | "line" | "dashboard";
    consultationId?: Id<"consultations">;
    applicationId?: Id<"applications">;
    decisions?: string[];
    titles: string[];
    at: number;
    by: string;
  },
): Promise<Id<"outboxDrafts">> {
  const writtenFrom = await panelLines(ctx, args.leadId, args.titles);
  return await ctx.db.insert("outboxDrafts", {
    leadId: args.leadId,
    kind: args.kind,
    channel: args.channel,
    ...(args.consultationId ? { consultationId: args.consultationId } : {}),
    ...(args.applicationId ? { applicationId: args.applicationId } : {}),
    state: "awaiting",
    ...(writtenFrom.length ? { writtenFrom } : {}),
    ...(args.decisions?.length ? { decisions: args.decisions } : {}),
    at: args.at,
    by: args.by,
  });
}

/** Everything waiting on this person, newest last, settled ones kept. */
export const forLead = query({
  args: { leadId: v.id("leads") },
  handler: async (ctx, { leadId }) => {
    await requireAdmin(ctx);
    const rows = (await ctx.db.query("outboxDrafts").withIndex("by_lead", (q) => q.eq("leadId", leadId)).collect()).sort(
      (a, b) => a.at - b.at,
    );
    const lead = await ctx.db.get(leadId);
    return {
      /** No address means an email draft can be written and never sent. */
      email: lead?.email ?? null,
      open: rows.filter((r) => r.state === "awaiting" || r.state === "drafted" || r.state === "approved"),
      done: rows.filter((r) => r.state === "sent" || r.state === "copied" || r.state === "discarded").slice(-10),
    };
  },
});

/** Ask for a draft outside a session close. */
export const open = mutation({
  args: {
    leadId: v.id("leads"),
    kind: KIND,
    channel: CHANNEL,
    consultationId: v.optional(v.id("consultations")),
    applicationId: v.optional(v.id("applications")),
  },
  handler: async (ctx, args) => {
    const by = await requireAdmin(ctx);
    if (!(await ctx.db.get(args.leadId))) throw new ConvexError("Lead not found.");
    const held = (await ctx.db.query("outboxDrafts").withIndex("by_lead", (q) => q.eq("leadId", args.leadId)).collect()).find(
      (r) =>
        r.kind === args.kind &&
        r.channel === args.channel &&
        (r.consultationId ?? null) === (args.consultationId ?? null) &&
        (r.applicationId ?? null) === (args.applicationId ?? null) &&
        (r.state === "awaiting" || r.state === "drafted" || r.state === "approved"),
    );
    if (held) return held._id;
    const titles = (await targetsFor(ctx, args.leadId)).filter((t) => t.status === "active").map((t) => t.title);
    return await openDraft(ctx, { ...args, titles, at: Date.now(), by });
  },
});

/**
 * The words arrive. Written by whatever read the panel and the event, or by
 * the coach editing in place: the same path either way, because a draft the
 * coach rewrote and a draft something else wrote are both just a draft until
 * it is approved.
 */
export const fill = mutation({
  args: { id: v.id("outboxDrafts"), subject: v.optional(v.string()), body: v.string() },
  handler: async (ctx, { id, subject, body }) => {
    const by = await requireAdmin(ctx);
    const row = await ctx.db.get(id);
    if (!row) throw new ConvexError("No such draft.");
    if (row.state === "sent" || row.state === "copied" || row.state === "discarded") {
      throw new ConvexError("That draft is finished. Open a new one.");
    }
    const text = clean(body, 8000);
    if (!text) throw new ConvexError("Write the message.");
    const head = subject ? clean(subject, 200) : undefined;
    if (row.channel === "email" && !head && !row.subject) throw new ConvexError("An email needs a subject.");
    await ctx.db.patch(id, {
      body: text,
      ...(head ? { subject: head } : {}),
      state: "drafted",
      filledAt: Date.now(),
      filledBy: by,
      failure: undefined,
    });
  },
});

/**
 * The coach approves. An email goes; a LINE message is marked copied, which is
 * as far as this app takes one.
 */
export const approve = mutation({
  args: { id: v.id("outboxDrafts") },
  handler: async (ctx, { id }) => {
    const by = await requireAdmin(ctx);
    const row = await ctx.db.get(id);
    if (!row) throw new ConvexError("No such draft.");
    if (row.state !== "drafted") throw new ConvexError("Only a drafted message is approved.");
    if (!row.body?.trim()) throw new ConvexError("There is nothing written to approve.");
    const at = Date.now();
    if (row.channel === "line") {
      await ctx.db.patch(id, { state: "copied", settledAt: at, settledBy: by });
      return { sent: false as const };
    }
    if (row.channel === "dashboard") {
      // The one draft that becomes a record here instead of leaving: a shared
      // delivery note, which is what the candidate reads on their own page.
      await ctx.db.insert("deliveryNotes", {
        leadId: row.leadId,
        body: row.body.trim(),
        shared: true,
        ...(row.consultationId ? { consultationId: row.consultationId } : {}),
        at,
        by,
      });
      await ctx.db.patch(id, { state: "sent", sentAt: at, settledAt: at, settledBy: by });
      return { sent: true as const };
    }
    const lead = await ctx.db.get(row.leadId);
    if (!lead?.email) throw new ConvexError("No email address on this record. Send it another way.");
    await ctx.db.patch(id, { state: "approved", settledAt: at, settledBy: by, failure: undefined });
    await ctx.scheduler.runAfter(0, internal.outbox.deliver, { id });
    return { sent: true as const };
  },
});

/** The coach throws it away. The row stays: what we chose not to say is record. */
export const discard = mutation({
  args: { id: v.id("outboxDrafts") },
  handler: async (ctx, { id }) => {
    const by = await requireAdmin(ctx);
    const row = await ctx.db.get(id);
    if (!row) throw new ConvexError("No such draft.");
    if (row.state === "sent") throw new ConvexError("That one has gone. It cannot be thrown away.");
    await ctx.db.patch(id, { state: "discarded", settledAt: Date.now(), settledBy: by });
  },
});

export const toSend = internalQuery({
  args: { id: v.id("outboxDrafts") },
  handler: async (ctx, { id }) => {
    const row = await ctx.db.get(id);
    if (!row || row.state !== "approved" || row.channel !== "email") return null;
    const lead = await ctx.db.get(row.leadId);
    if (!lead?.email) return null;
    return {
      to: lead.email,
      firstName: greetingName(lead),
      subject: row.subject ?? "",
      body: row.body ?? "",
    };
  },
});

export const landed = internalMutation({
  args: { id: v.id("outboxDrafts"), failure: v.optional(v.string()) },
  handler: async (ctx, { id, failure }) => {
    const row = await ctx.db.get(id);
    if (!row || row.state !== "approved") return;
    if (failure) {
      // Back to drafted, so the coach sees it waiting rather than believing it
      // went. A failed send never leaves a message looking delivered.
      await ctx.db.patch(id, { state: "drafted", failure: failure.slice(0, 300) });
      return;
    }
    await ctx.db.patch(id, { state: "sent", sentAt: Date.now(), failure: undefined });
  },
});

/**
 * Send one approved email. Never called by a client: the coach's approval
 * schedules it, and a retry can send the same message again but can never
 * approve one.
 */
export const deliver = internalAction({
  args: { id: v.id("outboxDrafts") },
  handler: async (ctx, { id }): Promise<void> => {
    const d = await ctx.runQuery(internal.outbox.toSend, { id });
    if (!d) return;
    const key = process.env.RESEND_API_KEY;
    const from = process.env.MAIL_FROM;
    if (!key || !from) {
      await ctx.runMutation(internal.outbox.landed, { id, failure: "No mail sender is set on this deployment." });
      return;
    }
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: d.to,
        ...(process.env.MAIL_REPLY_TO ? { reply_to: process.env.MAIL_REPLY_TO } : {}),
        subject: d.subject,
        html: outboxEmailHtml(d.firstName, d.subject, d.body),
        text: outboxEmailText(d.firstName, d.subject, d.body),
      }),
    });
    if (res.ok) {
      await ctx.runMutation(internal.outbox.landed, { id });
      return;
    }
    await ctx.runMutation(internal.outbox.landed, {
      id,
      failure: `${res.status} ${(await res.text()).slice(0, 200)}`,
    });
  },
});

export type OutboxKind = typeof KIND.type;
