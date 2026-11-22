/**
 * Checks that a fact with a named owner is written in one place only.
 *
 *   npm run verify:single-owner
 *
 * Every layer of this product has a rule saying where a fact lives, and the
 * ones with a script behind them hold. `verify:narrative` keeps a figure out of
 * a story record, `verify:copy` keeps a string out of a component, and
 * `verify:email` keeps a hex off the email surface; all three pass. The layers
 * with the same kind of rule and no script have all leaked: the design system
 * says a document points at `design.md` and never restates a colour, and the
 * colour values are in a second context document anyway.
 *
 * So this is not a new rule. It is the missing half of one that already exists.
 *
 * ---------------------------------------------------------------------------
 * WHAT IT CHECKS
 * ---------------------------------------------------------------------------
 *
 * **A colour `design.md` defines appears in no other document.** That is the
 * test, and the qualifier is the whole of it: a hex `design.md` does not hold
 * cannot be a copy of `design.md`.
 *
 * The first version of this check flagged any hex at all and was wrong about
 * two thirds of what it found. Most of what it caught was a second brand's
 * palette, which lived in one document and nowhere else, so flagging it was
 * flagging the only copy of a fact rather than a duplicate. It also flagged the
 * true black the logo uses, which `design.md` deliberately does not carry,
 * because its ink is the softer near-black. A check with that false-positive
 * rate gets switched off, and a switched-off check is the state this layer was
 * already in.
 *
 * What survives the qualifier is the real thing: a document naming a PunProfile
 * token and then restating its value beside it, which goes stale the day the
 * token moves and reads as authoritative while it does.
 *
 * Excluded, and each for a stated reason: `design.md` itself, because it is the
 * owner; anything under `ctxt-brand/assets/`, because a binary is not a
 * document; and the work zone, because it holds drafts and run output rather
 * than the record.
 *
 * Reading across the repo boundary, it announces a missing sibling and stops
 * rather than passing on half the files.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const CONTEXT = "../punprofile-career-coaching/punprofile-context";
const OWNER = "ctxt-brand/design.md";
const SKIP_DIRS = ["assets", "reference-sources"];

/** A six-digit hex, not an HTML numeric entity: `&#128205;` is an emoji. */
const HEX = /(^|[^&#\w])(#[0-9a-fA-F]{6})\b/g;

/** Every colour value `design.md` defines, lower-cased. */
function ownedColours(ownerPath: string): Set<string> {
  const out = new Set<string>();
  for (const m of readFileSync(ownerPath, "utf8").matchAll(HEX)) out.add(m[2].toLowerCase());
  return out;
}

function markdownUnder(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (SKIP_DIRS.includes(entry)) continue;
      out.push(...markdownUnder(full));
    } else if (entry.endsWith(".md")) {
      out.push(full);
    }
  }
  return out;
}

function main() {
  if (!existsSync(CONTEXT)) {
    console.error(`FAIL cannot read ${CONTEXT}.`);
    console.error("The coaching repo must sit beside this one for this check to run.");
    process.exit(1);
  }

  const owner = join(CONTEXT, OWNER);
  if (!existsSync(owner)) {
    console.error(`FAIL the owning document is missing: ${owner}`);
    process.exit(1);
  }

  const owned = ownedColours(owner);
  if (owned.size === 0) {
    console.error(`FAIL no colour values found in ${OWNER}; the check has nothing to compare against.`);
    process.exit(1);
  }

  const offenders: { file: string; line: number; value: string }[] = [];
  for (const file of markdownUnder(CONTEXT)) {
    if (relative(CONTEXT, file) === OWNER) continue;
    readFileSync(file, "utf8")
      .split("\n")
      .forEach((text, i) => {
        for (const m of text.matchAll(HEX)) {
          if (!owned.has(m[2].toLowerCase())) continue;
          offenders.push({ file: relative(CONTEXT, file), line: i + 1, value: m[2] });
        }
      });
  }

  if (offenders.length === 0) {
    console.log(
      `single-owner OK: none of the ${owned.size} colours ${OWNER} defines is restated in another document.`,
    );
    return;
  }

  const byFile = new Map<string, number>();
  for (const o of offenders) byFile.set(o.file, (byFile.get(o.file) ?? 0) + 1);

  console.error(
    `FAIL ${offenders.length} value(s) that ${OWNER} defines, restated in ${byFile.size} other document(s).`,
  );
  console.error("Name the token and drop the hex. The value belongs to `design.md` alone.\n");
  for (const [file, n] of [...byFile].sort((a, b) => b[1] - a[1])) {
    console.error(`  ${file}  (${n})`);
    for (const o of offenders.filter((x) => x.file === file).slice(0, 6)) {
      console.error(`      line ${o.line}: ${o.value}`);
    }
    if (n > 6) console.error(`      and ${n - 6} more`);
  }
  process.exit(1);
}

main();
