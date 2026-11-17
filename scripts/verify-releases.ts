/**
 * Assertions over the release rules. `npx tsx scripts/verify-releases.ts`.
 *
 * Same shape as `verify-consent.ts` and `audit.ts`: no test framework in this
 * repo, so an invariant is checked by a script that exits non-zero. Run it
 * after touching `src/lib/releases.ts` or `convex/releases.ts`.
 *
 * The invariants here are the ones with a consequence attached. A release is
 * one-way: a rule that fails does not produce a wrong number on a screen, it
 * puts something on a paying candidate's page that cannot be taken back, or
 * puts half of what a call produced there and leaves the rest.
 */

import { itemFault, releaseFault, factFault, nextOrder, type CheckedFact, type HeldItem } from "../src/lib/releases";

let failures = 0;

function check(name: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`  ok   ${name}`);
  } else {
    failures += 1;
    console.error(`  FAIL ${name}${detail ? `\n       ${detail}` : ""}`);
  }
}

const none: HeldItem[] = [];
const report: HeldItem = { kind: "report", order: 1 };
const direction: HeldItem = { kind: "direction", order: 2 };
const file = (id: string, order: number): HeldItem => ({ kind: "file", cvDocumentId: id, order });

console.log("\nrelease rules\n");

// --- what may not go out at all --------------------------------------------

check("an empty release cannot go out", releaseFault(none, "note1") !== null);

check(
  "a release with items but no note cannot go out",
  releaseFault([report, direction], null) !== null,
  "without the note the candidate gets a list of documents and nothing saying what they are",
);

check("a release with items and a note can go out", releaseFault([report, direction], "note1") === null);

check("an undefined note is as missing as a null one", releaseFault([report], undefined) !== null);

// --- the link, which is the verified one ------------------------------------

check(
  "a link is refused, whatever else is right about it",
  itemFault("link", "Your timeline", { url: "https://example.com/page" }, none) !== null,
  "verified 17/11/2026: an artifact link asks a visitor to sign in and shows nothing",
);

// --- an item that would open nothing ---------------------------------------

check("the report needs the deliverable it is", itemFault("report", "Fit Report", {}, none) !== null);

check("a file item needs the file", itemFault("file", "Your CV", {}, none) !== null);

check(
  "the direction points at nothing else",
  itemFault("direction", "Your titles and markets", { cvDocumentId: "cv1" }, none) !== null,
  "it is the targets rows and the panel, so a pointer on it would be a second place for the same fact",
);

check("an item with no label is refused", itemFault("report", "   ", { deliverableId: "d1" }, none) !== null);

// --- what may not be in it twice -------------------------------------------

check("the report cannot be added twice", itemFault("report", "Fit Report", { deliverableId: "d1" }, [report]) !== null);

check(
  "the direction cannot be added twice",
  itemFault("direction", "Your titles and markets", {}, [direction]) !== null,
);

check(
  "the same file cannot be added twice",
  itemFault("file", "Your CV again", { cvDocumentId: "cv1" }, [file("cv1", 1)]) !== null,
);

check(
  "a different file can be added beside it",
  itemFault("file", "CV for the second title", { cvDocumentId: "cv2" }, [file("cv1", 1)]) === null,
);

// --- the first release, which is the one the pack delivers first ------------

check(
  "the report and the direction together are a valid first release",
  itemFault("report", "Fit Report", { deliverableId: "d1" }, none) === null &&
    itemFault("direction", "Your titles and the markets", {}, [report]) === null &&
    releaseFault([report, direction], "note1") === null,
  "the report with the direction, which is Stage 0's exit handed over",
);

// --- places ----------------------------------------------------------------

check("the first item takes place 1", nextOrder(none) === 1);
check("the next item takes the place after the highest", nextOrder([report, direction]) === 3);
check(
  "a gap left by a removed item does not put two items in one place",
  nextOrder([{ kind: "report", order: 7 }]) === 8,
);

// --- the facts a release repeats -------------------------------------------

const agreed: CheckedFact = { label: "Her start date", value: "04/2027", source: "the Situation panel", agrees: true };
const disputed: CheckedFact = {
  label: "The spend she managed",
  value: "EUR 2.4M",
  source: "her own CV",
  sourceValue: "EUR 1.8M",
  agrees: false,
};

check("facts nobody checked hold nothing", factFault(undefined) === null && factFault([]) === null);

check("a fact whose sources agree holds nothing", factFault([agreed]) === null);

check(
  "a fact whose sources disagree holds the release",
  factFault([agreed, disputed]) !== null,
  "two different figures for the same thing is what the candidate catches, and it cannot be unsent",
);

check(
  "the message names the fact and where the other value came from",
  (factFault([disputed]) ?? "").includes("The spend she managed") &&
    (factFault([disputed]) ?? "").includes("her own CV"),
);

check("a settled fact lets it go", factFault([{ ...disputed, chosen: "EUR 1.8M" }]) === null);

check(
  "the release gate reads the facts too",
  releaseFault([report, direction], "note1", [disputed]) !== null &&
    releaseFault([report, direction], "note1", [{ ...disputed, chosen: "EUR 1.8M" }]) === null,
);

check(
  "an empty release is still the first thing refused, facts or no facts",
  releaseFault(none, "note1", [agreed]) === "There is nothing in this release.",
);

// --- what this script does not measure -------------------------------------

console.log(
  "\nNot measured here, and it cannot be from a script: the transaction. That the\n" +
    "release mutation shares the covering note and every CV the release carries in\n" +
    "one write, and that two clicks cannot half-release it, is the database's\n" +
    "guarantee and this repo has no way to exercise a mutation without a\n" +
    "deployment. The deployment this tree points at is the one candidates are\n" +
    "served from, so the first real release is the first exercise of that path,\n" +
    "and it is one-way. Nor does this script know whether a deliverable or a file\n" +
    "belongs to the candidate it is being released to: that check needs the\n" +
    "database and lives in the mutation beside the write.\n",
);

if (failures > 0) {
  console.error(`${failures} assertion(s) failed.\n`);
  process.exit(1);
}
console.log("All release invariants hold.\n");
