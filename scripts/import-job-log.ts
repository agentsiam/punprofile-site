/**
 * Import the public feed's job log into the job database,
 * `job-database-handoff.md` step 4.
 *
 *   npx tsx scripts/import-job-log.ts            (dry run: says what it would do)
 *   npx tsx scripts/import-job-log.ts --write
 *
 * `job-log.json` in the sibling repo has been the feed's only record since
 * 07/07/2026: url, employer, title, country, first_seen, verdict, reason, and
 * nothing is ever removed from it. Those rows become `jobs`, keyed on the
 * canonical URL, with `firstSeenAt` from `first_seen` and the feed's verdict
 * kept as `groupVerdict` and `groupReason`.
 *
 * Idempotent, which is the point: it is keyed on the URL, so a run that dies
 * half way is resumed by running it again, and a second complete run writes 0.
 * It never overwrites a field a later sighting filled in, because `jobs.seen`
 * only writes into a gap.
 *
 * It does NOT mark anything filled or archived. Every row in the log is a job
 * somebody came across once; nothing has been back to look, and inventing a
 * status from an old date would be asserting what nobody checked. The nightly
 * archive ages them out on `firstSeenAt`, which is the honest rule.
 *
 * Reads across to the sibling repo and stops rather than passing with partial
 * data when it is not there (C47).
 */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { canonicalJobUrl } from "../src/lib/jobUrl.js";

const ROOT = resolve(import.meta.dirname, "..");
const LOG = resolve(ROOT, "../punprofile-career-coaching/punprofile-work/work-pipeline/job-log.json");
const ADMIN = resolve(ROOT, "data/agent/convex-admin.sh");
/** Small enough that one failure costs little, large enough to be quick. */
const BATCH = 40;

type LogRow = {
  url?: string;
  employer?: string;
  title?: string;
  country?: string;
  first_seen?: string;
  verdict?: string;
  reason?: string;
};

if (!existsSync(LOG)) {
  console.error(`The job log is not here: ${LOG}\nThis script reads the sibling coaching repo. Clone it beside this one, or run this where both are.`);
  process.exit(1);
}
if (!existsSync(ADMIN)) {
  console.error(`No admin caller at ${ADMIN}. It is gitignored and local to Paul's machine.`);
  process.exit(1);
}

const write = process.argv.includes("--write");
const rows = JSON.parse(readFileSync(LOG, "utf8")) as LogRow[];

/** One per canonical URL. The log holds re-listings, and they are one job. */
const byUrl = new Map<string, LogRow>();
let noUrl = 0;
let noFields = 0;
let notALink = 0;
for (const r of rows) {
  // A posting with no link cannot be keyed and cannot block a repeat, which is
  // the whole job of this table. 139 of the log's rows are like this, every one
  // of them a reject or a needs-more-research, so nothing published is lost.
  if (!r.url) {
    noUrl++;
    continue;
  }
  if (!r.employer || !r.title || !r.country) {
    noFields++;
    continue;
  }
  const key = canonicalJobUrl(r.url);
  // `seeJob` refuses anything that is not an http link, and the log holds one
  // row whose link is a bare slug with no host. It cannot be keyed, any more
  // than a row with no link at all can, so it is skipped and counted the same
  // way rather than killing a run half way through.
  if (!/^https?:\/\//i.test(key)) {
    notALink++;
    continue;
  }
  const held = byUrl.get(key);
  // The earliest sighting wins the date; a later one fills a gap, which is the
  // same rule the mutation applies.
  if (!held) byUrl.set(key, r);
  else if ((r.first_seen ?? "9999") < (held.first_seen ?? "9999")) byUrl.set(key, { ...r, ...held, first_seen: r.first_seen });
}

const jobs = [...byUrl.entries()].map(([url, r]) => ({
  url,
  employer: r.employer as string,
  title: r.title as string,
  country: r.country as string,
  ...(r.first_seen ? { seenOn: r.first_seen } : {}),
  ...(r.verdict ? { groupVerdict: r.verdict } : {}),
  ...(r.reason ? { groupReason: r.reason } : {}),
  source: "job_log",
}));

console.log(
  [
    `${rows.length} rows in the log`,
    `${byUrl.size} distinct postings by canonical URL`,
    noUrl ? `${noUrl} with no link, which cannot be keyed and are skipped` : null,
    notALink ? `${notALink} whose link is not a URL, skipped for the same reason` : null,
    noFields ? `${noFields} with no employer, title or country, skipped` : null,
  ]
    .filter(Boolean)
    .join(", "),
);

if (!write) {
  console.log("Dry run. Nothing was written. Run it again with --write.");
  process.exit(0);
}

let added = 0;
let held = 0;
for (let i = 0; i < jobs.length; i += BATCH) {
  const slice = jobs.slice(i, i + BATCH);
  const out = execFileSync("bash", [ADMIN, "mutation", "jobs:seen", JSON.stringify({ jobs: slice })], {
    encoding: "utf8",
    maxBuffer: 1 << 26,
  });
  let res: { status?: string; value?: { added?: number; held?: number }; errorMessage?: string };
  try {
    res = JSON.parse(out);
  } catch {
    console.error(`batch at ${i}: could not read the answer: ${out.slice(0, 300)}`);
    process.exit(1);
  }
  if (res.status !== "success") {
    console.error(`batch at ${i}: ${String(res.errorMessage).slice(0, 400)}`);
    process.exit(1);
  }
  added += res.value?.added ?? 0;
  held += res.value?.held ?? 0;
  process.stdout.write(`\r${i + slice.length} of ${jobs.length} sent, ${added} new`);
}
console.log(`\n${added} job(s) written, ${held} already held. Run it again and it writes 0.`);
