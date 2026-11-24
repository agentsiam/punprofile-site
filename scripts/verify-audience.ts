/**
 * No module assembles its own list of people to email.
 *
 *   npm run verify:audience
 *
 * A retake invitation chose its cohort on consent provenance plus an email
 * address and reached a paying client. The rule it needed was already written
 * down: `08_Coaching_Business.md` states, for every lifecycle stage, whether a
 * send with a list behind it may reach it, and it stops at the sale. Nothing in
 * `convex/` read conversion state at all.
 *
 * ---------------------------------------------------------------------------
 * WHY A SCRIPT AND NOT A CONVENTION
 * ---------------------------------------------------------------------------
 *
 * Four chokepoints of this kind were declared before this one and not one held.
 * `mayContact` in `convex/consentDb.ts` says nothing may email a candidate
 * without it first returning true, and has zero callers. `marketingAudience` in
 * `convex/consent.ts` said the digest and the nurture track must both call it
 * before sending, and no sender did. Then `marketing.recipients` and
 * `retakeSend.sendable` each rebuilt the same scan with a different test, and
 * `retakeSend.cohort` repeated its own sibling's test a third time inside one
 * file. A fifth declaration with nothing checking it would be the fifth thing
 * nobody calls, so the check is the deliverable and `convex/audience.ts` is
 * only where the rule lives.
 *
 * ---------------------------------------------------------------------------
 * WHAT IT CHECKS
 * ---------------------------------------------------------------------------
 *
 * **One: no module both reaches a mail sender and reads the whole `leads`
 * table.** Those two together are a list send, whatever the module is called.
 * `convex/audience.ts` is excluded because it is the one permitted assembler,
 * and it reaches no sender itself.
 *
 * **The signal is the scan, not the address.** A sender that reads
 * `lead.email` off a row it fetched by id is answering an event: somebody's
 * sign-in code, report notice or matched roles, which is part of the delivery
 * and is addressed by the thing that caused it. Flagging that would flag the
 * six senders that must keep working, and a check with that false-positive rate
 * gets switched off. Collecting the table is what says a list is being built.
 *
 * **Two: the modules that were rewired still call it.** A future edit can
 * reinstate a scan under an expression this script does not recognise, so the
 * three that lost their own scans are named here and must still reach
 * `audienceFor`. This is the half that fails loudly when somebody quietly goes
 * back to the old shape.
 *
 * **Three: the stage table answers for every state.** `LISTED_SEND_BY_STAGE`
 * is a `Record` over the state union, so a seventh stage already fails the
 * typecheck; this additionally fails a stage that `LIFECYCLE_STATES` holds and
 * the table does not, which is the same failure one layer out.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const CONVEX = "convex";
const OWNER = "audience.ts";

/** A fetch to Resend, which is the only mail sender this app has. */
const SENDS_MAIL = /api\.resend\.com/;
/** Reading the whole `leads` table, however the call is spaced or chained. */
const SCANS_LEADS = /ctx\.db\s*\.?\s*query\(\s*"leads"\s*\)\s*\.\s*collect\(\s*\)/;

/** Modules that lost their own scan and must still get their list from the owner. */
const REWIRED = ["retakeSend.ts", "marketing.ts", "consent.ts"];

const failures: string[] = [];
const fail = (m: string) => failures.push(m);

const files = readdirSync(CONVEX).filter((f) => f.endsWith(".ts"));
if (files.length < 20) {
  console.error(`FAIL only ${files.length} modules were read out of ${CONVEX}/; the scan is wrong`);
  process.exit(1);
}

let senders = 0;
for (const file of files) {
  const src = readFileSync(join(CONVEX, file), "utf8");
  const sends = SENDS_MAIL.test(src);
  const scans = SCANS_LEADS.test(src);
  if (sends) senders += 1;

  if (file === OWNER) {
    if (sends) {
      fail(`${OWNER} reaches a mail sender. It assembles lists and must not send them.`);
    }
    if (!scans) {
      fail(`${OWNER} no longer reads the leads table, so the check has nothing to be the exception to.`);
    }
    continue;
  }

  if (sends && scans) {
    fail(
      `convex/${file} both reaches a mail sender and collects the whole leads table, ` +
        `which is a list send assembled outside convex/${OWNER}. Call \`audienceFor\` instead: ` +
        `it resolves consent first and the lifecycle stage second, and it will not hand back a client.`,
    );
  }
}

if (senders === 0) {
  console.error("FAIL no module in convex/ reaches a mail sender; the sender pattern no longer matches");
  process.exit(1);
}

for (const file of REWIRED) {
  const src = readFileSync(join(CONVEX, file), "utf8");
  if (!/audienceFor\s*\(/.test(src)) {
    fail(
      `convex/${file} no longer calls \`audienceFor\`. It is one of the modules that had its own ` +
        `scan removed, so losing the call means the scan came back.`,
    );
  }
}

// ------------------------------------------------- every stage has an answer
{
  const lifecycle = readFileSync("src/lib/lifecycle.ts", "utf8");
  const statesBlock = lifecycle.slice(
    lifecycle.indexOf("export const LIFECYCLE_STATES"),
    lifecycle.indexOf("export type LifecycleState"),
  );
  const tableBlock = lifecycle.slice(
    lifecycle.indexOf("export const LISTED_SEND_BY_STAGE"),
    lifecycle.indexOf("export function mayReceiveListedSend"),
  );
  const states = [...statesBlock.matchAll(/"(\w+)"/g)].map((m) => m[1]);
  const answered = new Set([...tableBlock.matchAll(/^ {2}(\w+):\s*(?:true|false),/gm)].map((m) => m[1]));
  if (states.length < 5) {
    console.error(`FAIL only ${states.length} lifecycle states were read; the parse is wrong`);
    process.exit(1);
  }
  for (const state of states) {
    if (!answered.has(state)) {
      fail(
        `LISTED_SEND_BY_STAGE in src/lib/lifecycle.ts has no answer for \`${state}\`. ` +
          `Reaching a stage grants no permission by itself, and 08_Coaching_Business.md ` +
          `states an answer for every one.`,
      );
    }
  }
}

if (failures.length) {
  for (const f of failures) console.error(`FAIL ${f}`);
  console.error(`\n${failures.length} failure(s)`);
  process.exit(1);
}
console.log(
  `audience OK: ${senders} module(s) reach a mail sender and none of them assembles a list; ` +
    `${REWIRED.length} rewired module(s) still call audienceFor; every lifecycle stage has an answer`,
);
