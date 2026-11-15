/**
 * The job database: one row per posting, shared by the public group feed and
 * paying clients' matched roles. `job-database-handoff.md`, Paul's decision of
 * 12/11/2026.
 *
 * Nothing about a person is here. Who a job went to is its own row elsewhere
 * pointing at this one, so a candidate's taste and an erasure request never
 * reach the job.
 *
 * **No job is ever re-checked.** Everything in this module is driven by coming
 * across a posting: a run meets it, a candidate reports it, the matched-role
 * skill opens it on the day a role is sent. There is no sweep that goes back
 * to look, and an open job nobody meets again simply ages out.
 *
 * Every write here is idempotent, so the evening run can be re-run after it
 * dies half way and the second run changes nothing it already did.
 */

import { internalMutation, mutation, query, type MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { v, ConvexError } from "convex/values";
import { requireAdmin } from "./leads";
import { canonicalJobUrl } from "../src/lib/jobUrl";

const SPONSORSHIP = v.union(v.literal("stated_yes"), v.literal("stated_no"), v.literal("silent"));

const jobInput = v.object({
  url: v.string(),
  employer: v.string(),
  title: v.string(),
  country: v.string(),
  city: v.optional(v.string()),
  postedOn: v.optional(v.string()),
  sponsorship: v.optional(SPONSORSHIP),
  sponsorshipQuote: v.optional(v.string()),
  languages: v.optional(v.array(v.string())),
  salary: v.optional(v.string()),
  source: v.optional(v.string()),
  groupVerdict: v.optional(v.string()),
  groupReason: v.optional(v.string()),
  description: v.optional(v.string()),
  /** The run's own date for this encounter, ISO. Defaults to now. */
  seenOn: v.optional(v.string()),
});

type JobInput = typeof jobInput.type;

const clean = (s: string | undefined, max: number) => (s === undefined ? undefined : s.trim().slice(0, max) || undefined);

/** ISO date to a timestamp at noon UTC, so a date never lands on the wrong day. */
const dayMs = (iso: string | undefined, fallback: number): number => {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return fallback;
  const t = Date.parse(`${iso}T12:00:00Z`);
  return Number.isNaN(t) ? fallback : t;
};

/**
 * The job row for a posting, created if this is the first time anyone has come
 * across it. Shared by the group feed's import, the client pass and the two
 * places a role reaches a candidate.
 *
 * Fields already on the row are not overwritten by a later, emptier sighting:
 * a run that reads a salary and a run that does not are not equal evidence,
 * and the one that read something wins whichever came first. `lastSeenAt` only
 * moves forward.
 */
export async function seeJob(ctx: MutationCtx, input: JobInput, now: number): Promise<{ id: Id<"jobs">; added: boolean }> {
  const url = canonicalJobUrl(input.url);
  if (!/^https?:\/\//i.test(url)) throw new ConvexError(`Not an http link: ${input.url}`);
  const seenAt = dayMs(input.seenOn, now);
  const held = await ctx.db.query("jobs").withIndex("by_url", (q) => q.eq("url", url)).first();

  const given = {
    employer: clean(input.employer, 200),
    title: clean(input.title, 300),
    country: clean(input.country, 100),
    city: clean(input.city, 120),
    postedOn: clean(input.postedOn, 10),
    sponsorship: input.sponsorship,
    sponsorshipQuote: clean(input.sponsorshipQuote, 600),
    languages: input.languages?.map((l) => l.trim()).filter(Boolean),
    salary: clean(input.salary, 200),
    source: clean(input.source, 60),
    groupVerdict: clean(input.groupVerdict, 60),
    groupReason: clean(input.groupReason, 600),
    description: clean(input.description, 20000),
  };

  if (!held) {
    if (!given.employer || !given.title || !given.country) throw new ConvexError(`${url}: employer, title and country are required.`);
    const id = await ctx.db.insert("jobs", {
      url,
      employer: given.employer,
      title: given.title,
      country: given.country,
      ...(given.city ? { city: given.city } : {}),
      ...(given.postedOn ? { postedOn: given.postedOn } : {}),
      firstSeenAt: seenAt,
      lastSeenAt: seenAt,
      status: "open",
      ...(given.sponsorship ? { sponsorship: given.sponsorship } : {}),
      ...(given.sponsorshipQuote ? { sponsorshipQuote: given.sponsorshipQuote } : {}),
      ...(given.languages ? { languages: given.languages } : {}),
      ...(given.salary ? { salary: given.salary } : {}),
      ...(given.source ? { source: given.source } : {}),
      ...(given.groupVerdict ? { groupVerdict: given.groupVerdict } : {}),
      ...(given.groupReason ? { groupReason: given.groupReason } : {}),
      ...(given.description ? { description: given.description } : {}),
    });
    return { id, added: true };
  }

  const patch: Record<string, unknown> = {};
  // Only forward, and only into a gap. An encounter is evidence that the job
  // exists, never evidence that what this sighting failed to read is absent.
  if (seenAt > held.lastSeenAt) patch.lastSeenAt = seenAt;
  if (seenAt < held.firstSeenAt) patch.firstSeenAt = seenAt;
  for (const [k, value] of Object.entries(given)) {
    if (value === undefined) continue;
    if (held[k as keyof typeof held] === undefined) patch[k] = value;
  }
  if (Object.keys(patch).length) await ctx.db.patch(held._id, patch);
  return { id: held._id, added: false };
}

/** The evening run reports what it came across. Re-running it changes nothing twice. */
export const seen = mutation({
  args: { jobs: v.array(jobInput) },
  handler: async (ctx, { jobs }) => {
    await requireAdmin(ctx);
    const now = Date.now();
    let added = 0;
    for (const j of jobs) {
      const r = await seeJob(ctx, j, now);
      if (r.added) added++;
    }
    return { added, held: jobs.length - added };
  },
});

/**
 * Come across again and no longer open. A job fact under D5, so it is true for
 * everyone, the public feed included: a filled job stops being posted and stops
 * being sent.
 *
 * Marking one twice is not an error and does not move the date.
 */
export const markFilled = mutation({
  args: { url: v.optional(v.string()), id: v.optional(v.id("jobs")) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const row = args.id
      ? await ctx.db.get(args.id)
      : args.url
        ? await ctx.db.query("jobs").withIndex("by_url", (q) => q.eq("url", canonicalJobUrl(args.url as string))).first()
        : null;
    if (!row) throw new ConvexError("No job with that link.");
    if (row.status !== "open") return { already: true as const };
    await ctx.db.patch(row._id, { status: "filled", filledAt: Date.now() });
    return { already: false as const };
  },
});

/** A job drafted for the group feed. One row per job per channel per day. */
export const recordPost = mutation({
  args: { url: v.string(), draftDate: v.string(), publishedAt: v.optional(v.number()) },
  handler: async (ctx, { url, draftDate, publishedAt }) => {
    await requireAdmin(ctx);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(draftDate)) throw new ConvexError("draftDate is an ISO date.");
    const job = await ctx.db.query("jobs").withIndex("by_url", (q) => q.eq("url", canonicalJobUrl(url))).first();
    if (!job) throw new ConvexError("That job is not in the database. Report it as seen first.");
    const rows = await ctx.db.query("jobPosts").withIndex("by_job", (q) => q.eq("jobId", job._id)).collect();
    const same = rows.find((r) => r.channel === "facebook_group" && r.draftDate === draftDate);
    if (same) {
      if (publishedAt && same.publishedAt === undefined) await ctx.db.patch(same._id, { publishedAt });
      return same._id;
    }
    return await ctx.db.insert("jobPosts", {
      jobId: job._id,
      channel: "facebook_group",
      draftDate,
      ...(publishedAt ? { publishedAt } : {}),
    });
  },
});

/** One posting by link, for a skill checking what is already known about it. */
export const byUrl = query({
  args: { url: v.string() },
  handler: async (ctx, { url }) => {
    await requireAdmin(ctx);
    return await ctx.db.query("jobs").withIndex("by_url", (q) => q.eq("url", canonicalJobUrl(url))).first();
  },
});

/**
 * The nightly archive, `job-database-handoff.md` § 5.
 *
 * A job filled, or first seen over 90 days ago, becomes `archived` and loses
 * its description. The row stays: it still blocks a repeat and still holds
 * what the job led to.
 *
 * It does not delete. The 12-month deletion of an archived job that nothing
 * points at is a separate decision and is not made on a timer here.
 */
export const archiveOld = internalMutation({
  args: { apply: v.optional(v.boolean()) },
  handler: async (ctx, { apply }) => {
    const now = Date.now();
    const cutoff = now - 90 * 24 * 60 * 60 * 1000;
    const due = [
      ...(await ctx.db.query("jobs").withIndex("by_status_firstSeen", (q) => q.eq("status", "filled")).collect()),
      ...(await ctx.db
        .query("jobs")
        .withIndex("by_status_firstSeen", (q) => q.eq("status", "open").lt("firstSeenAt", cutoff))
        .collect()),
    ];
    if (!apply) return { due: due.length, archived: 0 };
    let archived = 0;
    for (const j of due) {
      await ctx.db.patch(j._id, { status: "archived", description: undefined });
      archived++;
    }
    return { due: due.length, archived };
  },
});
