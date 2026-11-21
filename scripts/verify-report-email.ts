/**
 * The Fit Report email is the Thai Paul approved, and not the generic letter.
 *
 *   npx tsx scripts/verify-report-email.ts
 *
 * It is the one candidate-facing message this product sends without a coach
 * approving it first, so the words in it are the words he wrote. They live in
 * `golden-th/email/d-fit-report-delivery.md` in the sibling repo, which is the
 * record of what he approved, and they are set out in `convex/reportEmail.ts`,
 * which is not under the language system: `R49` covers strings in components,
 * and every email template in `convex/` holds its Thai inline. Nothing was
 * holding the two together, and the pull on the file is towards the other way:
 * `codeEmail.ts`'s header states a different register, no `ครับ` and PunProfile
 * in the third person, and a session tidying one email to match the other
 * would rewrite his voice on this surface with nothing to stop it.
 *
 * So this reads his file and asserts every line of it reaches the candidate,
 * in the HTML part and in the plain-text one. It cannot tell whether the Thai
 * is good, only whether it is still his. Same shape as `verify-releases.ts`:
 * no test framework in this repo, so an invariant is a script that exits
 * non-zero.
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { REPORT_EMAIL_SUBJECT, reportEmailHtml, reportEmailText } from "../convex/reportEmail.js";

const GOLDEN = resolve(
  import.meta.dirname,
  "../../punprofile-career-coaching/punprofile-work/work-content/golden-th/email/d-fit-report-delivery.md",
);

let failures = 0;
const check = (name: string, ok: boolean, detail?: string) => {
  if (ok) console.log(`  ok   ${name}`);
  else {
    failures += 1;
    console.error(`  FAIL ${name}${detail ? `\n       ${detail}` : ""}`);
  }
};

console.log("\nthe Fit Report email\n");

// C47: the approved copy lives in the other repo. A lone clone says so and
// stops, rather than passing because it found nothing to compare against.
if (!existsSync(GOLDEN)) {
  console.error(`FAIL the approved Thai is missing: ${GOLDEN}`);
  console.error("     It lives in the sibling repo punprofile-career-coaching, cloned beside this one.");
  process.exit(1);
}

/** The name and the figures he wrote it for, so the lines match as written. */
const NAME = "มายด์";
const RECEIPT = { used: 20, left: 13 };
const html = reportEmailHtml(NAME, RECEIPT);
const text = reportEmailText(NAME, RECEIPT);
/** The HTML with its tags gone, and the two entities his quotes become. */
const rendered = html.replace(/<[^>]*>/g, "").replace(/&ldquo;|&rdquo;/g, "”").replace(/&nbsp;/g, " ");

const lines = readFileSync(GOLDEN, "utf8")
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean);
check(`the approved file has lines to check (${lines.length})`, lines.length > 0);

for (const line of lines) {
  const short = line.length > 44 ? `${line.slice(0, 44)}…` : line;
  if (line === REPORT_EMAIL_SUBJECT) {
    check(`subject: ${short}`, rendered.includes(line));
    continue;
  }
  // Paul's quotes are curly in his file and entities in the HTML, which the
  // strip above puts back; the plain-text part carries them as he wrote them.
  const want = line.replace(/“/g, "”");
  check(`html: ${short}`, rendered.includes(line) || rendered.includes(want));
  check(`text: ${short}`, text.includes(line));
}

// The three strings that vary, and the shapes they must not take.
const noName = reportEmailHtml(null, null);
check(
  "without a name the greeting is คุณ alone",
  noName.includes("สวัสดีครับ") && !/คุณ(null|undefined)/.test(noName),
  "a record with no name must not greet คุณnull",
);
check(
  "without a charge there is no receipt line",
  !noName.includes("โทเคน") && !reportEmailText(null, null).includes("โทเคน"),
  "a report never charged carries no token figures",
);
check(
  "the receipt states what the delivery charged",
  html.includes(`ใช้ ${RECEIPT.used} โทเคน`) && html.includes(`คงเหลือ ${RECEIPT.left} โทเคน`),
);

// And the notice sends this letter rather than the outbox's plain one, which
// is the thing a later edit could quietly undo.
const notice = readFileSync(resolve(import.meta.dirname, "../convex/reportNotice.ts"), "utf8");
check(
  "the notice sends the designed letter",
  /reportEmailHtml\(/.test(notice) && /reportEmailText\(/.test(notice) && !/outboxEmailHtml/.test(notice),
  "convex/reportNotice.ts must build the body from reportEmail.ts, not from the outbox letter",
);

/**
 * Where the email is scheduled from, which is an ordering rather than a value
 * and so is read off the source. Coarse on purpose: it cannot run a mutation
 * without a deployment, and the deployment this repo talks to without `--prod`
 * holds real leads (`R38`). What it pins is the two facts a later edit would
 * undo without anything else noticing.
 */
const workspace = readFileSync(resolve(import.meta.dirname, "../convex/workspace.ts"), "utf8");
const deliver = workspace.slice(workspace.indexOf("export const deliverFitReport"));
const body = deliver.slice(0, deliver.indexOf("\n});"));
const scheduledAt = body.indexOf("scheduleFitReportNotice(");
const guardAt = body.indexOf("if (!firstShare)");
check(
  "delivery schedules the email",
  scheduledAt >= 0,
  "deliverFitReport must tell the candidate the report is waiting",
);
check(
  "it is scheduled above the firstShare guard",
  scheduledAt >= 0 && guardAt >= 0 && scheduledAt < guardAt,
  "shareFitReport can put the report on the dashboard without passing through delivery, so an email below that guard is an email a re-delivery never sends",
);
check(
  "sharing schedules it too",
  /shareFitReport[\s\S]*?scheduleFitReportNotice\(/.test(workspace),
  "the candidate is told however the coach got there",
);
check(
  "it is sent once however often the report is re-shared",
  /fitReportNoticeSentAt !== undefined\) return;/.test(workspace),
  "scheduleFitReportNotice must refuse once the notice has gone",
);

if (failures) {
  console.error(`\n${failures} failure(s)`);
  process.exit(1);
}
console.log(`\nthe Fit Report email is Paul's approved Thai: ${lines.length} lines, html and text\n`);
