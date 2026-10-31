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
import type { Doc, Id } from "./_generated/dataModel";
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

/** Lower-case phrases a title answers to, matched as whole words. */
function phrasesOf(t: { title: string; alsoCalled: string[] }) {
  return [t.title, ...t.alsoCalled]
    .map((p) => p.toLowerCase().trim())
    // A one-letter name would match noise like the "d" in "(m/f/d)".
    .filter((p) => p.length >= 2)
    .map((p) => new RegExp(`(^|[^a-z0-9])${p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}($|[^a-z0-9])`));
}

/**
 * One candidate's feed: the last `days` days, newest first. `null` when the
 * table has never been filled, so the page can fall back to the built-in list
 * instead of showing an empty feed.
 *
 * With target titles (`lifecycle-data-model.md` § 8a), a role matches a title
 * when its own title contains that title or one of its other names, as whole
 * words, in that title's countries or else the candidate's. Each role is filed
 * under the first title, by priority, that it matches. Without titles, the
 * assessment's field decides, as before.
 */
export async function feedFor(
  ctx: QueryCtx,
  countries: string[],
  category: string | null,
  targets: Doc<"targets">[] = [],
  days = 30,
) {
  const newest = await ctx.db.query("marketRoles").withIndex("by_first_seen").order("desc").first();
  if (!newest) return null;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const leadCountries = new Set(countries.map(logCountry));
  const byTitle = [...targets]
    .sort((a, b) => a.priority - b.priority)
    .map((t) => ({
      id: t._id,
      phrases: phrasesOf(t),
      countries: t.countries?.length ? new Set(t.countries.map(logCountry)) : leadCountries,
    }));
  const useTitles = byTitle.length > 0;
  const rows =
    useTitles || (category && leadCountries.size)
      ? await ctx.db
          .query("marketRoles")
          .withIndex("by_first_seen", (q) => q.gte("firstSeen", since))
          .order("desc")
          .collect()
      : [];
  const out = [];
  for (const r of rows) {
    let targetId: Id<"targets"> | null = null;
    if (useTitles) {
      // German postings tag gender as "(m/f/d)", "(f/m/x)" and so on; it is
      // not part of the title and must not match a title's letters.
      const t = ` ${r.title.toLowerCase().replace(/\((?:[mfwdx]\s*\/\s*)+[mfwdx]\)/g, " ")} `;
      const hit = byTitle.find((x) => x.countries.has(r.country) && x.phrases.some((p) => p.test(t)));
      if (!hit) continue;
      targetId = hit.id;
    } else if (!(leadCountries.has(r.country) && titleMatches(r.title, category!))) {
      continue;
    }
    out.push({
      id: r.roleId,
      employer: r.employer,
      title: r.title,
      country: r.country,
      firstSeen: r.firstSeen,
      url: r.url,
      targetId,
    });
  }
  return { syncedAt: newest.syncedAt, byTitle: useTitles, roles: out };
}
