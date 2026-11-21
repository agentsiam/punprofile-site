/**
 * Every table that holds a person is in both cascades.
 *
 *   npx tsx scripts/verify-cascades.ts
 *
 * Two functions walk a lead's records: `movePersonalRecords` in `convex/merge.ts`,
 * which re-points them at the surviving row, and `eraseLead` in `convex/erase.ts`,
 * which destroys them. A table added to the schema and to neither is invisible to
 * both, and this is what that cost on 21/11/2026:
 *
 * - Four tables — `checklistTicks`, `foundRoles`, `releases`, `releaseItems` —
 *   were erased but not moved. `mergeLeads` has a net for exactly that and it
 *   fired, which rolled the merge back and made `captureContact` throw. Every
 *   page load writes a new session row and the contact step merges the old one
 *   in, so a returning candidate who had ever had a role found for them could
 *   not get past the contact step of the EU Fit Check.
 * - `competencyRatings` was in neither, so the net could not fire for it: a
 *   merge left the interview scores pointing at a row that had just been
 *   deleted, and an erasure request left them on the record for good. That
 *   table holds a mark and a written note per competency.
 *
 * The net in `mergeLeads` only catches the first kind, and only at runtime, on
 * a real merge, in front of whoever triggered it. This catches both kinds
 * before a push.
 *
 * It reads the two functions as source rather than calling them: a cascade is a
 * list of tables, and whether the list is complete is a question about the text.
 */

import { readFileSync } from "node:fs";

const failures: string[] = [];
const fail = (msg: string) => failures.push(msg);

/**
 * A table the merge copies to the survivor instead of re-pointing, with the
 * reason. The copies carry the same facts against the surviving row and the
 * originals stay attached, so the dropped row's own go with it when it is erased.
 *
 * This is the sanctioned way to record such a decision. A table that genuinely
 * belongs out of a cascade goes here with its reason, rather than this file
 * being edited to stop asking.
 */
const COPIED_NOT_MOVED: Record<string, string> = {
  consentEvents: "copied rather than re-pointed, so a grant is never lost and the originals go with the dropped row",
};

/** The body of one function, by its declaration and the text that ends it. */
function body(file: string, opens: string, closes: string): string {
  const src = readFileSync(file, "utf8");
  const start = src.indexOf(opens);
  if (start < 0) {
    // C47. Renamed or moved, and a file that cannot find what it checks has to
    // say so rather than pass with nothing to check.
    console.error(`FAIL ${file} no longer contains ${JSON.stringify(opens)}, so the cascade went unchecked`);
    process.exit(1);
  }
  const end = src.indexOf(closes, start);
  if (end < 0) {
    console.error(`FAIL ${file}: found ${JSON.stringify(opens)} but not its ${JSON.stringify(closes)}`);
    process.exit(1);
  }
  return src.slice(start, end);
}

/** Every `const name = await ctx.db.query("table")` in a function body. */
function collected(text: string): Map<string, string> {
  const rows = new Map<string, string>();
  for (const m of text.matchAll(/const (\w+) = (?:leadEmail\s*\?\s*)?await ctx\.db\s*\.query\("(\w+)"\)/g)) {
    rows.set(m[2], m[1]);
  }
  return rows;
}

// ------------------------------------------- who the schema says holds a person
const schema = readFileSync("convex/schema.ts", "utf8");
const owners: string[] = [];
for (const m of schema.matchAll(/^ {2}(\w+): defineTable\(([\s\S]*?)^ {2}\}\)/gm)) {
  if (/leadId:\s*v\.(optional\(v\.)?id\("leads"\)/.test(m[2])) owners.push(m[1]);
}
if (owners.length < 20) {
  console.error(`FAIL only ${owners.length} tables in convex/schema.ts were read as holding a leadId; the parse is wrong`);
  process.exit(1);
}

// ------------------------------------------------------------- the two cascades
const move = body("convex/merge.ts", "async function movePersonalRecords", "return { consentCopied");
const erase = body("convex/erase.ts", "export async function eraseLead", "\n  return {");
const moves = collected(move);
const erases = collected(erase);

for (const table of owners) {
  const moveName = moves.get(table);
  const eraseName = erases.get(table);

  if (!moveName) {
    fail(
      `movePersonalRecords in convex/merge.ts does not move ${table}: a merge would ${
        eraseName ? "throw and roll back, stopping whoever triggered it" : "leave its rows pointing at a deleted lead, silently"
      }`,
    );
  } else if (COPIED_NOT_MOVED[table]) {
    if (new RegExp(`\\.\\.\\.${moveName}\\b`).test(move)) {
      fail(`convex/merge.ts re-points ${table}, which is listed as ${COPIED_NOT_MOVED[table]}`);
    }
  } else if (!new RegExp(`\\.\\.\\.${moveName}\\b`).test(move)) {
    fail(`convex/merge.ts collects ${table} as \`${moveName}\` and never re-points it at the surviving row`);
  }

  if (!eraseName) {
    fail(`eraseLead in convex/erase.ts does not erase ${table}: an erasure request would leave its rows on the record`);
  } else if (!new RegExp(`for \\(const \\w+ of ${eraseName}\\)`).test(erase)) {
    fail(`convex/erase.ts collects ${table} as \`${eraseName}\` and never deletes it`);
  }
}

// --------------------------------- and the log the erasure writes can hold them
//
// `deleteLeadOnRequest` inserts its counts into `deletionLog`, whose validator
// names every field. A count `eraseLead` returns and the validator does not
// have is rejected at the insert, which rolls the whole deletion back: the
// subject stays in the database and the screen shows a server error. That has
// happened twice — 03/11/2026, found on 18/11, and again on 21/11 when the
// interview marks were added here — so it is checked rather than remembered.
{
  const counts = body("convex/erase.ts", "export type EraseCounts = {", "\n};");
  const logged = body("convex/schema.ts", "    counts: v.object({", "\n    }),");
  const want = [...counts.matchAll(/^ {2}(\w+): number;/gm)].map((m) => m[1]);
  const have = new Set([...logged.matchAll(/^ {6}(\w+): v\./gm)].map((m) => m[1]));
  if (want.length < 20) {
    console.error(`FAIL only ${want.length} fields were read out of EraseCounts; the parse is wrong`);
    process.exit(1);
  }
  for (const field of want) {
    if (!have.has(field)) {
      fail(
        `deletionLog.counts in convex/schema.ts has no ${field}, which eraseLead returns: ` +
          `the insert in deleteLeadOnRequest would be rejected and the erasure rolled back`,
      );
    }
  }
}

if (failures.length) {
  for (const f of failures) console.error(`FAIL ${f}`);
  console.error(`\n${failures.length} failure(s) across ${owners.length} tables holding a person`);
  process.exit(1);
}
console.log(`cascades OK: ${owners.length} tables hold a leadId, every one moved by a merge and erased by a request`);
console.log("  and every count the erasure returns is a field the deletion log can hold");
const copied = Object.keys(COPIED_NOT_MOVED);
if (copied.length) console.log(`  copied rather than re-pointed: ${copied.join(", ")}`);
