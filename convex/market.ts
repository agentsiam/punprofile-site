/**
 * The published-role feed, kept fresh by a push after each evening pipeline run.
 *
 * The app still cannot read across repos at runtime, and does not: the push
 * runs on the Mac where both repos live, reads `job-log.json` the same way
 * `sync-market-snapshot.ts` does, and hands the rows to `replaceRoles`. Only the
 * feed reads this table. The headline figures and the Fit Report's matched-roles
 * page stay on the build-time snapshot, which prints its own date.
 */
import { internalMutation, type QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { logCountry, titleMatches } from "../src/lib/role-keywords";

const role = v.object({
  id: v.string(),
  employer: v.string(),
  title: v.string(),
  country: v.string(),
  firstSeen: v.string(),
  url: v.string(),
});

/**
 * Make the table equal to the pushed set. Rows not in the push are deleted, so
 * the table never holds a role the pipeline has stopped publishing. An empty
 * push is refused rather than taken as "delete everything", because an empty
 * set is far likelier to be a broken read than a market with no roles.
 */
export const replaceRoles = internalMutation({
  args: { roles: v.array(role) },
  handler: async (ctx, { roles }) => {
    if (roles.length === 0) throw new Error("Refusing an empty push; the feed is left as it was.");
    const now = Date.now();
    const pushed = new Map(roles.map((r) => [r.id, r]));
    let added = 0;
    let updated = 0;
    let removed = 0;
    for (const row of await ctx.db.query("marketRoles").collect()) {
      const r = pushed.get(row.roleId);
      if (!r) {
        await ctx.db.delete(row._id);
        removed++;
        continue;
      }
      await ctx.db.patch(row._id, {
        employer: r.employer,
        title: r.title,
        country: r.country,
        firstSeen: r.firstSeen,
        url: r.url,
        syncedAt: now,
      });
      pushed.delete(r.id);
      updated++;
    }
    for (const r of pushed.values()) {
      await ctx.db.insert("marketRoles", {
        roleId: r.id,
        employer: r.employer,
        title: r.title,
        country: r.country,
        firstSeen: r.firstSeen,
        url: r.url,
        syncedAt: now,
      });
      added++;
    }
    return { added, updated, removed, total: roles.length };
  },
});

/**
 * One candidate's feed: the last `days` days, their countries, a category word
 * in the title, newest first. `null` when the table has never been filled, so
 * the page can fall back to the built-in list instead of showing an empty feed.
 */
export async function feedFor(
  ctx: QueryCtx,
  countries: string[],
  category: string | null,
  days = 30,
) {
  const newest = await ctx.db.query("marketRoles").withIndex("by_first_seen").order("desc").first();
  if (!newest) return null;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const wanted = new Set(countries.map(logCountry));
  const rows =
    category && wanted.size
      ? await ctx.db
          .query("marketRoles")
          .withIndex("by_first_seen", (q) => q.gte("firstSeen", since))
          .order("desc")
          .collect()
      : [];
  return {
    syncedAt: newest.syncedAt,
    roles: rows
      .filter((r) => wanted.has(r.country) && titleMatches(r.title, category!))
      .map((r) => ({
        id: r.roleId,
        employer: r.employer,
        title: r.title,
        country: r.country,
        firstSeen: r.firstSeen,
        url: r.url,
      })),
  };
}
