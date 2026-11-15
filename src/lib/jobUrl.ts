/**
 * One posting, one row: the canonical form of a job URL.
 *
 * `job-database-handoff.md` § 3. Two runs, a client pass and a candidate's own
 * tracker all meet the same posting by slightly different links, and the whole
 * job database rests on those collapsing to one key. Pure, and shared by the
 * import, the mutations and anything that checks a link, because a second
 * implementation is how one posting becomes two rows.
 *
 * What it does, and nothing more: lower-cases the scheme and host, drops `www.`
 * and a default port, strips the tracking parameters the handoff names, sorts
 * what survives, and drops a trailing slash and any fragment. It does NOT
 * rewrite a path or guess at an ATS's own id: a board that encodes the posting
 * in a query parameter would lose its identity, and quietly merging two
 * postings is worse than keeping two rows.
 */

/** Dropped from every URL: they say where a click came from, not which job. */
const TRACKING = ["gh_src", "source", "ref", "src", "trk", "trackingId", "gclid", "fbclid"];

export function canonicalJobUrl(raw: string): string {
  const trimmed = raw.trim();
  let u: URL;
  try {
    u = new URL(trimmed);
  } catch {
    // Not a URL at all. Returned as it came rather than repaired: a caller
    // validating links should see what it was given.
    return trimmed;
  }
  u.protocol = u.protocol.toLowerCase();
  u.hostname = u.hostname.toLowerCase().replace(/^www\./, "");
  u.hash = "";
  if ((u.protocol === "https:" && u.port === "443") || (u.protocol === "http:" && u.port === "80")) u.port = "";

  const keep = [...u.searchParams.entries()]
    .filter(([k]) => !/^utm_/i.test(k) && !TRACKING.some((t) => t.toLowerCase() === k.toLowerCase()))
    .sort((a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]));
  u.search = "";
  for (const [k, v] of keep) u.searchParams.append(k, v);

  if (u.pathname.length > 1 && u.pathname.endsWith("/")) u.pathname = u.pathname.replace(/\/+$/, "");
  return u.toString();
}

/** Whether two links are the same posting. */
export const sameJob = (a: string, b: string): boolean => canonicalJobUrl(a) === canonicalJobUrl(b);
