/**
 * Scheduled jobs. TASK-080, the reminders, and the job-database archive.
 *
 * The first is the retention sweep. Runs daily rather than monthly so a
 * record is never much more than a day past its promised expiry, and so a
 * problem surfaces the next morning rather than four weeks later.
 *
 * **It runs with `apply: true`, which is the whole point**, and the safety is
 * inside `retention.sweep`: it refuses outright rather than truncating if more
 * records are due than the per-run cap, it never touches a live engagement or a
 * placement, and it writes a `deletionLog` row for every run that deletes
 * anything.
 *
 * Nothing falls due until July 2027 on current data, so this will do nothing at
 * all for a long time. That is the correct behaviour for a promise being kept
 * rather than a job being useful.
 *
 * The second owes two reminders and never a second of either, and it is the
 * first code to write `candidateTasks.remindedAt`: the one reminder that table
 * has specified from the start had never gone out. It opens drafts for Paul and
 * sends nothing itself. `coaching-delivery-design-system.md` § 7a.
 *
 * The third is the job-database archive, `job-database-handoff.md` § 5. It
 * holds no personal data and deletes nothing: a job filled, or first seen over
 * 90 days ago, becomes `archived` and loses its description, and the row stays
 * because it still blocks a repeat and still holds what the job led to.
 */

import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "retention sweep",
  // Early morning Europe/Berlin, which is the middle of the night in Thailand.
  // Nothing a candidate does should race a deletion.
  { hourUTC: 2, minuteUTC: 15 },
  internal.retention.sweep,
  { apply: true },
);

crons.daily(
  "reminders",
  // Early morning Europe/Berlin, so what it opens is in the outbox when Paul
  // starts rather than late in his day. It sends nothing and shows the
  // candidate nothing: it opens drafts and waits for him.
  { hourUTC: 6, minuteUTC: 0 },
  internal.releases.remindOnce,
);

crons.daily(
  "job archive",
  // After the retention sweep, and in the same quiet hour: the job database is
  // written by the evening run, which is long finished by then.
  { hourUTC: 2, minuteUTC: 45 },
  internal.jobs.archiveOld,
  { apply: true },
);

export default crons;
