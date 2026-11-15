/**
 * The Situation panel and the end-of-session close,
 * `candidate-situation-handoff.md`.
 *
 * The panel is the candidate's current situation on the first page of their
 * CRM record, and it is the only thing a candidate-facing message, a match
 * reason or a search is written from. That rule is only worth anything if the
 * panel has one write path, so it has one: `applyRows` below. The coach
 * reaches it through `setRow` and `closeSession`; the candidate's own actions
 * and the app's own events will reach it through the same function with their
 * own source, and nothing writes `leads.situation` directly.
 *
 * Which rows exist, and what each one holds, is the sibling repo's decision.
 * The wording of a row is `src/lib/situation.ts`, which the drafting paths
 * share so a message and the panel cannot describe the same fact differently.
 */

import { mutation, query, type MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { v, ConvexError } from "convex/values";
import { requireAdmin } from "./leads";
import { targetsFor } from "./targets";
import { rowInput, type RowInput } from "./situationRows";
import {
  isPanelDate,
  missingGates,
  panel,
  rowLine,
  searchGates,
  SITUATION_ROWS,
  type Situation,
  type SituationRowKey,
  type SituationSource,
} from "../src/lib/situation";

/**
 * Trim, collapse runs of space, cut at a length. A guard against a paste
 * accident, not a rule about how long an answer may be: every limit here is
 * generous enough that no real answer meets it.
 */
const clean = (s: string, max: number) => s.trim().replace(/\s+/g, " ").slice(0, max);

/** Cleaned, empties dropped, duplicates dropped, order kept. */
function cleanList(xs: string[], max: number, what: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const x of xs) {
    const c = clean(x, 120);
    if (!c || seen.has(c.toLowerCase())) continue;
    seen.add(c.toLowerCase());
    out.push(c);
  }
  if (out.length > max) throw new ConvexError(`Up to ${max} ${what}.`);
  return out;
}

function checkDate(s: string | undefined, what: string): string | undefined {
  if (s === undefined || s.trim() === "") return undefined;
  const d = s.trim();
  if (!isPanelDate(d)) throw new ConvexError(`${what} is a date, 2027-03 or 2027-03-01.`);
  return d;
}

/** The value half of a row, validated. The stamp is added by `applyRows`. */
function valueOf(input: RowInput): Record<string, unknown> {
  switch (input.row) {
    case "goal": {
      const countries = cleanList(input.countries, 6, "countries");
      const cities = cleanList(input.cities, 12, "cities");
      if (!countries.length) throw new ConvexError("Name the country they are going to.");
      return { countries, cities };
    }
    case "workRoute": {
      const text = clean(input.text, 400);
      if (!text) throw new ConvexError("Write how they can legally work there.");
      const changesOn = checkDate(input.changesOn, "The date the work route changes");
      return { text, ...(changesOn ? { changesOn } : {}) };
    }
    case "availableFrom": {
      const date = checkDate(input.date, "Their earliest start date");
      if (!date) throw new ConvexError("Give their earliest start date.");
      return { date };
    }
    case "employersMustOffer": {
      const languages = cleanList(input.languages, 8, "languages");
      let payFloor: { amount: number; currency: string; per: "year" | "month" } | undefined;
      if (input.payFloor) {
        const currency = clean(input.payFloor.currency, 8).toUpperCase();
        if (!/^[A-Z]{3}$/.test(currency)) throw new ConvexError("The pay floor's currency is a three-letter code, EUR or THB.");
        if (!Number.isFinite(input.payFloor.amount) || input.payFloor.amount <= 0) {
          throw new ConvexError("A pay floor is a figure above zero. Leave it empty where none is agreed.");
        }
        payFloor = { amount: Math.round(input.payFloor.amount), currency, per: input.payFloor.per };
      }
      return { sponsorship: input.sponsorship, languages, ...(payFloor ? { payFloor } : {}) };
    }
    case "heardFromEmployers":
      return { objections: cleanList(input.objections, 10, "objections") };
    case "whereTheyAreNow": {
      const text = clean(input.text, 300);
      if (!text) throw new ConvexError("Write one line on where they are now.");
      return { text };
    }
    case "nextFromUs": {
      const text = clean(input.text, 300);
      if (!text) throw new ConvexError("Write the one thing we owe them next.");
      const dueOn = checkDate(input.dueOn, "The date it is owed by");
      return { text, ...(dueOn ? { dueOn } : {}) };
    }
  }
}

export type SituationStamp = { source: SituationSource; at: number; by?: string; evidence?: string };

/**
 * The one write path into `leads.situation`. Every row it writes carries where
 * the value came from and when, which is the whole point of the panel: a
 * reader can tell a fact the candidate gave from one a coach inferred.
 *
 * Rows the caller did not send are left exactly as they were, so a close form
 * that changes two rows cannot blank the other five.
 */
export async function applyRows(
  ctx: MutationCtx,
  leadId: Id<"leads">,
  inputs: RowInput[],
  stamp: SituationStamp,
): Promise<SituationRowKey[]> {
  const lead = await ctx.db.get(leadId);
  if (!lead) throw new ConvexError("Lead not found.");
  const next: Record<string, unknown> = { ...(lead.situation ?? {}) };
  const touched: SituationRowKey[] = [];
  for (const input of inputs) {
    if (touched.includes(input.row)) throw new ConvexError(`The ${input.row} row was sent twice.`);
    const evidence = stamp.evidence ? clean(stamp.evidence, 300) : undefined;
    // A rewritten row starts clean. `nextFromUs` losing its `doneAt` is the
    // case that matters and it is right: a new thing owed is not already done.
    next[input.row] = {
      ...valueOf(input),
      source: stamp.source,
      at: stamp.at,
      ...(stamp.by ? { by: stamp.by } : {}),
      ...(evidence ? { evidence } : {}),
    };
    touched.push(input.row);
  }
  await ctx.db.patch(leadId, { situation: next as typeof lead.situation, updatedAt: stamp.at });
  return touched;
}

/**
 * A proposed row as a line, so the coach compares a sentence with a sentence
 * rather than a form with a form. It goes through the panel's own wording, so
 * a proposal cannot describe a fact differently from the way the panel will
 * once it is accepted.
 */
function proposedLine(proposed: RowInput, titles: string[]): string | null {
  const value = valueOf(proposed);
  const fake = { [proposed.row]: { ...value, source: "coach" as const, at: 0 } } as Situation;
  return rowLine(fake, proposed.row, titles);
}

/**
 * A transcript's reading of a call, waiting for the coach's click.
 *
 * Written from outside the app, by whatever read the recording: this has no
 * model and is not going to extract anything itself. Nothing here reaches the
 * panel. The close form shows each proposal beside the value the panel already
 * holds, and the coach accepts it, edits it or throws it away.
 *
 * A proposal for a row that already has an identical value is dropped rather
 * than stored: it is not a change, and a list of non-changes to click through
 * is how a coach starts clicking without reading.
 */
export const propose = mutation({
  args: {
    leadId: v.id("leads"),
    consultationId: v.optional(v.id("consultations")),
    proposals: v.array(v.object({ proposed: rowInput, quote: v.optional(v.string()) })),
  },
  handler: async (ctx, args) => {
    const by = await requireAdmin(ctx);
    const lead = await ctx.db.get(args.leadId);
    if (!lead) throw new ConvexError("Lead not found.");
    if (args.consultationId) {
      const call = await ctx.db.get(args.consultationId);
      if (!call || call.leadId !== args.leadId) throw new ConvexError("That call belongs to a different lead.");
    }
    const titles = (await targetsFor(ctx, args.leadId)).filter((t) => t.status === "active").map((t) => t.title);
    const held = (lead.situation ?? {}) as Situation;
    const open = (await ctx.db.query("situationProposals").withIndex("by_lead", (q) => q.eq("leadId", args.leadId)).collect())
      .filter((r) => r.settledAt === undefined);
    const at = Date.now();
    let added = 0;
    let unchanged = 0;
    for (const p of args.proposals) {
      const line = proposedLine(p.proposed, titles);
      const was = rowLine(held, p.proposed.row, titles);
      if (line === was) {
        unchanged++;
        continue;
      }
      // The same proposal twice is one proposal. A run that dies half way is
      // resumed by running it again.
      if (open.some((r) => r.proposed.row === p.proposed.row && proposedLine(r.proposed, titles) === line)) {
        unchanged++;
        continue;
      }
      await ctx.db.insert("situationProposals", {
        leadId: args.leadId,
        ...(args.consultationId ? { consultationId: args.consultationId } : {}),
        proposed: p.proposed,
        ...(was ? { wasLine: was } : {}),
        ...(p.quote?.trim() ? { quote: clean(p.quote, 600) } : {}),
        at,
        by,
      });
      added++;
    }
    return { added, unchanged };
  },
});

/** The coach throws a proposal away without opening the close form. */
export const settleProposal = mutation({
  args: { id: v.id("situationProposals"), accepted: v.boolean() },
  handler: async (ctx, { id, accepted }) => {
    const by = await requireAdmin(ctx);
    const row = await ctx.db.get(id);
    if (!row) throw new ConvexError("No such proposal.");
    if (row.settledAt !== undefined) return;
    await ctx.db.patch(id, { settledAt: Date.now(), settledBy: by, accepted });
  },
});

/** The panel as the Session tab draws it, and as a draft reads it. */
export const forLead = query({
  args: { leadId: v.id("leads") },
  handler: async (ctx, { leadId }) => {
    await requireAdmin(ctx);
    const lead = await ctx.db.get(leadId);
    if (!lead) return null;
    const titles = (await targetsFor(ctx, leadId)).filter((t) => t.status === "active").map((t) => t.title);
    const situation: Situation = (lead.situation ?? {}) as Situation;
    const tasks = (await ctx.db.query("candidateTasks").withIndex("by_lead", (q) => q.eq("leadId", leadId)).collect()).sort(
      (a, b) => a.dueOn.localeCompare(b.dueOn),
    );
    return {
      titles,
      situation,
      rows: panel(situation, titles),
      missing: missingGates(situation, titles),
      gates: searchGates(situation, titles),
      tasks,
      /** Rows nobody has ever filled, so the panel can say so once at the top. */
      empty: SITUATION_ROWS.every((k) => situation[k] === undefined),
    };
  },
});

/**
 * What the close form needs: which calls are waiting to be written up, and
 * what is already recorded against the one being closed.
 *
 * A call is waiting once its end time has passed and nobody has closed it. The
 * end time is its logged time plus its length; a call with no length recorded
 * counts as ended an hour after it started, which is the longest session type.
 */
export const closeForm = query({
  args: { leadId: v.id("leads") },
  handler: async (ctx, { leadId }) => {
    await requireAdmin(ctx);
    const now = Date.now();
    const calls = (
      await ctx.db.query("consultations").withIndex("by_lead_time", (q) => q.eq("leadId", leadId)).collect()
    )
      .filter((c) => c.outcome === "scheduled" || c.outcome === "held")
      .sort((a, b) => b.heldAt - a.heldAt);
    const ended = (c: (typeof calls)[number]) => c.heldAt + (c.durationMinutes ?? 60) * 60_000 <= now;
    const notes = await ctx.db.query("deliveryNotes").withIndex("by_lead", (q) => q.eq("leadId", leadId)).collect();
    const tasks = await ctx.db.query("candidateTasks").withIndex("by_lead", (q) => q.eq("leadId", leadId)).collect();
    const titles = (await targetsFor(ctx, leadId)).filter((t) => t.status === "active").map((t) => t.title);
    const proposals = (
      await ctx.db.query("situationProposals").withIndex("by_lead", (q) => q.eq("leadId", leadId)).collect()
    )
      .filter((r) => r.settledAt === undefined)
      .sort((a, b) => a.at - b.at)
      .map((r) => ({
        _id: r._id,
        consultationId: r.consultationId ?? null,
        row: r.proposed.row,
        proposed: r.proposed,
        line: proposedLine(r.proposed, titles),
        wasLine: r.wasLine ?? null,
        quote: r.quote ?? null,
        at: r.at,
      }));
    return {
      now,
      proposals,
      calls: calls.map((c) => ({
        _id: c._id,
        type: c.type,
        outcome: c.outcome,
        heldAt: c.heldAt,
        durationMinutes: c.durationMinutes ?? null,
        deliverableId: c.deliverableId ?? null,
        closedAt: c.sessionClosedAt ?? null,
        ended: ended(c),
        decisions: notes
          .filter((n) => n.decision && n.consultationId === c._id)
          .sort((a, b) => a.at - b.at)
          .map((n) => ({ _id: n._id, body: n.body, at: n.at })),
      })),
      /** Oldest first: the one the coach has been owing longest comes first. */
      waiting: calls.filter((c) => ended(c) && c.sessionClosedAt === undefined).map((c) => c._id),
      openTasks: tasks
        .filter((t) => t.doneAt === undefined)
        .sort((a, b) => a.dueOn.localeCompare(b.dueOn))
        .map((t) => ({ _id: t._id, what: t.what, dueOn: t.dueOn })),
    };
  },
});

/** The coach corrects one row in place. */
export const setRow = mutation({
  args: { leadId: v.id("leads"), value: rowInput, evidence: v.optional(v.string()) },
  handler: async (ctx, { leadId, value, evidence }) => {
    const by = await requireAdmin(ctx);
    const touched = await applyRows(ctx, leadId, [value], {
      source: "coach",
      at: Date.now(),
      by,
      ...(evidence ? { evidence } : {}),
    });
    return { changed: touched };
  },
});

/**
 * The coach empties a row they should not have filled.
 *
 * Absent is a real state on this panel: it means nobody has established the
 * value, and a gate reading an absent row holds a role rather than passing it.
 * Clearing is therefore a correction, not a way to say "no constraint".
 */
export const clearRow = mutation({
  args: { leadId: v.id("leads"), row: v.union(...SITUATION_ROWS.map((k) => v.literal(k))) },
  handler: async (ctx, { leadId, row }) => {
    await requireAdmin(ctx);
    const lead = await ctx.db.get(leadId);
    if (!lead) throw new ConvexError("Lead not found.");
    const next = { ...(lead.situation ?? {}) } as Record<string, unknown>;
    if (next[row] === undefined) return;
    delete next[row];
    await ctx.db.patch(leadId, { situation: next as typeof lead.situation, updatedAt: Date.now() });
  },
});

/** The coach closes out what we owed, without touching what it was. */
export const markNextDone = mutation({
  args: { leadId: v.id("leads"), done: v.boolean() },
  handler: async (ctx, { leadId, done }) => {
    await requireAdmin(ctx);
    const lead = await ctx.db.get(leadId);
    if (!lead) throw new ConvexError("Lead not found.");
    const row = lead.situation?.nextFromUs;
    if (!row) throw new ConvexError("Nothing is recorded as owed.");
    // Built without the key rather than with an `undefined` one: `undefined` is
    // not a Convex value, and inside a nested object it does not mean absent.
    const open = { ...row };
    delete open.doneAt;
    const next = { ...lead.situation, nextFromUs: done ? { ...open, doneAt: Date.now() } : open };
    await ctx.db.patch(leadId, { situation: next, updatedAt: Date.now() });
  },
});

/** A task the candidate owes, closed from the CRM. */
export const closeTask = mutation({
  args: { id: v.id("candidateTasks"), done: v.boolean() },
  handler: async (ctx, { id, done }) => {
    await requireAdmin(ctx);
    const row = await ctx.db.get(id);
    if (!row) throw new ConvexError("No such task.");
    await ctx.db.patch(id, done ? { doneAt: Date.now(), doneBy: "coach" } : { doneAt: undefined, doneBy: undefined });
  },
});

/**
 * The end-of-session close: the coach's one input, `candidate-situation-handoff.md`
 * § 4. One form at the end of a call, the same form for every session type,
 * and the only moment a coach writes the panel.
 *
 * It does five things in one transaction, because a close that half-saved
 * would leave a panel claiming a date for a decision that was not recorded:
 * marks the call held, writes the rows that moved, records the decisions,
 * writes what we owe next, and writes what the candidate owes.
 *
 * Sending it twice for the same call is safe: a decision whose words are
 * already on this call is not recorded again, and nor is a task.
 */
export const closeSession = mutation({
  args: {
    leadId: v.id("leads"),
    consultationId: v.id("consultations"),
    /** The rows that moved. `whereTheyAreNow` and `nextFromUs` every time. */
    rows: v.array(rowInput),
    /** One line each, as they were agreed in the call. */
    decisions: v.array(v.string()),
    /** What the candidate owes, each with the date it is owed by. */
    candidateOwes: v.array(v.object({ what: v.string(), dueOn: v.string() })),
    /** The transcript's proposals the coach took or threw away, settled in the
     *  same transaction as the rows they produced. */
    settled: v.optional(v.array(v.object({ id: v.id("situationProposals"), accepted: v.boolean() }))),
    /** How long the call ran, where the log does not have it yet. */
    durationMinutes: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const by = await requireAdmin(ctx);
    const at = Date.now();
    const call = await ctx.db.get(args.consultationId);
    if (!call || call.leadId !== args.leadId) throw new ConvexError("That call belongs to a different lead.");
    if (call.outcome === "cancelled" || call.outcome === "no_show") {
      throw new ConvexError("That call is logged as not held. Change its outcome in Calls and notes first.");
    }

    const sent = args.rows.map((r) => r.row);
    for (const need of ["whereTheyAreNow", "nextFromUs"] as const) {
      if (!sent.includes(need)) {
        throw new ConvexError(
          need === "whereTheyAreNow" ? "Write one line on where they are now." : "Write the one thing we owe them next.",
        );
      }
    }

    const changed = await applyRows(ctx, args.leadId, args.rows, {
      source: "coach",
      at,
      by,
      evidence: `session close, ${new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Madrid",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(call.heldAt))}`,
    });

    // The call is held once it has been closed. This is what ticks "Call 1
    // held" on the checklist, so the coach does not log the same call twice.
    // `sessionClosedAt` is what says the call has been written up at all, and
    // it is kept from the first close: a correction does not re-date the work.
    await ctx.db.patch(args.consultationId, {
      ...(call.outcome === "held" ? {} : { outcome: "held" as const }),
      ...(args.durationMinutes && call.durationMinutes === undefined ? { durationMinutes: args.durationMinutes } : {}),
      ...(call.sessionClosedAt === undefined ? { sessionClosedAt: at, sessionClosedBy: by } : {}),
      updatedAt: at,
    });

    const existing = (
      await ctx.db.query("deliveryNotes").withIndex("by_lead", (q) => q.eq("leadId", args.leadId)).collect()
    ).filter((n) => n.decision && n.consultationId === args.consultationId);
    const already = new Set(existing.map((n) => n.body.trim().toLowerCase()));
    const decisions: Id<"deliveryNotes">[] = [];
    for (const raw of args.decisions) {
      const body = clean(raw, 400);
      if (!body || already.has(body.toLowerCase())) continue;
      already.add(body.toLowerCase());
      decisions.push(
        await ctx.db.insert("deliveryNotes", {
          leadId: args.leadId,
          body,
          shared: false,
          decision: true,
          consultationId: args.consultationId,
          ...(call.deliverableId ? { deliverableId: call.deliverableId } : {}),
          at,
          by,
        }),
      );
    }

    const heldTasks = await ctx.db.query("candidateTasks").withIndex("by_lead", (q) => q.eq("leadId", args.leadId)).collect();
    const openTasks = new Set(heldTasks.filter((t) => t.doneAt === undefined).map((t) => t.what.trim().toLowerCase()));
    const tasks: Id<"candidateTasks">[] = [];
    for (const owed of args.candidateOwes) {
      const what = clean(owed.what, 300);
      if (!what) continue;
      const dueOn = checkDate(owed.dueOn, `The date for "${what}"`);
      if (!dueOn) throw new ConvexError(`Give the date "${what}" is owed by.`);
      if (openTasks.has(what.toLowerCase())) continue;
      openTasks.add(what.toLowerCase());
      tasks.push(
        await ctx.db.insert("candidateTasks", {
          leadId: args.leadId,
          what,
          dueOn,
          consultationId: args.consultationId,
          at,
          by,
        }),
      );
    }

    let settled = 0;
    for (const p of args.settled ?? []) {
      const row = await ctx.db.get(p.id);
      if (!row || row.leadId !== args.leadId || row.settledAt !== undefined) continue;
      await ctx.db.patch(p.id, { settledAt: at, settledBy: by, accepted: p.accepted });
      settled++;
    }

    return { changed, decisions: decisions.length, tasks: tasks.length, settled };
  },
});
