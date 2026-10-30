/**
 * Pushes the pipeline's recent published roles into Convex, so the candidate's
 * "Jobs for you" feed is as fresh as the last evening run, not the last deploy.
 *
 *   npx tsx scripts/push-market-roles.ts
 *
 * Runs on the Mac where both repos live, after the coaching repo's `daily-jobs`
 * run has rewritten `job-log.json`. The schedule is
 * `scripts/schedule/com.punprofile.push-market-roles.plist`, 19:35 Europe/Berlin
 * daily, which leaves the 18:05 run ninety minutes. A run that overruns that is
 * picked up the next evening: the push is the whole recent set every time, so a
 * late day costs a day of freshness and nothing else.
 *
 * Targets whatever deployment the Convex CLI targets from this folder, which is
 * the dev deployment the live site reads (`CONVEX_DEPLOYMENT` in `.env.local`).
 * `PUSH_DRY_RUN=1` prints what would go and pushes nothing.
 *
 * Only the feed reads the table. The headline figures and the Fit Report's
 * matched-roles page stay on `sync-market-snapshot.ts`, deliberately: a figure
 * a candidate quotes should move when someone decides it should.
 */

import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { SOURCE, publishedRoles, type JobRow } from "./sync-market-snapshot";

/** The feed shows 30 days; the margin covers a few missed evenings. */
const WINDOW_DAYS = 35;

function main() {
  if (!existsSync(SOURCE)) {
    console.error(`FAIL cannot read ${SOURCE}. The coaching repo must sit beside this one.`);
    process.exit(1);
  }
  const rows = JSON.parse(readFileSync(SOURCE, "utf8")) as JobRow[];
  const since = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const all = publishedRoles(rows).filter((r) => r.firstSeen >= since);
  // A role with no id cannot be matched to a saved job or updated in place.
  const roles = all.filter((r) => r.id !== "");
  const noId = all.length - roles.length;

  console.log(
    `${new Date().toISOString()} push: ${roles.length} published roles since ${since}` +
      (noId ? `, ${noId} skipped for having no id` : ""),
  );
  if (roles.length === 0) {
    // `replaceRoles` refuses an empty push too; failing here says why sooner.
    console.error("FAIL nothing to push; the feed is left as it was.");
    process.exit(1);
  }
  if (process.env.PUSH_DRY_RUN === "1") {
    console.log(JSON.stringify(roles.slice(0, 3), null, 2));
    return;
  }
  const out = execFileSync("npx", ["convex", "run", "market:replaceRoles", JSON.stringify({ roles })], {
    encoding: "utf8",
  });
  console.log(out.trim());
}

if (process.argv[1]?.endsWith("push-market-roles.ts")) main();
