/**
 * The rules a release holds, as pure functions.
 *
 * They live here rather than inside the mutation for the reason `scoring.ts`
 * and `consent.ts` do: there is no test framework in this repo and no way to
 * exercise a Convex mutation without a deployment, and the deployment this
 * tree points at is the one candidates are served from. A rule that can be
 * asserted by a script is a rule that is checked before it ships, which
 * `scripts/verify-releases.ts` does.
 *
 * What is here is every rule about the SHAPE of a release: which pointer
 * belongs to which kind of item, what may not be in it twice, and what has to
 * be true before it can go. What is not here is everything that needs the
 * database: that the thing an item points at exists, and that it belongs to
 * this candidate. `convex/releases.ts` checks those, in the same mutation that
 * writes, because only the database can answer them.
 *
 * The consequence that makes these worth asserting: a release is one-way. What
 * goes out is on a paying candidate's page, and the mutation has no undo.
 */

export type ReleaseItemKind = "report" | "direction" | "file" | "link";

export interface ItemPointers {
  deliverableId?: string;
  cvDocumentId?: string;
  url?: string;
}

/** An item already in the release, as much of it as these rules need. */
export interface HeldItem {
  kind: ReleaseItemKind;
  cvDocumentId?: string;
  order: number;
}

/**
 * Why this item cannot be added, in the words the coach will read, or null.
 *
 * The label is checked because it is what the candidate reads: an item with no
 * label is a row on their page that says nothing about itself.
 */
export function itemFault(
  kind: ReleaseItemKind,
  label: string,
  pointers: ItemPointers,
  held: HeldItem[],
): string | null {
  if (!label.trim()) return "Give the item the name the candidate will read.";

  if (kind === "link") {
    // Verified 17/11/2026: a Claude artifact link, opened with no Claude
    // session, asks the visitor to sign in and shows nothing. Whether an item
    // may be a link at all is Decision 1 in § 7a of the delivery design.
    return "Links are not settled yet. Share the file, or add it as the report or the direction.";
  }

  if (kind === "report" && !pointers.deliverableId) return "Say which Fit Report this is.";
  if (kind === "file" && !pointers.cvDocumentId) {
    return "Pick the file to release. Only a CV already held can be released yet.";
  }
  if (kind === "direction" && (pointers.deliverableId || pointers.cvDocumentId || pointers.url)) {
    return "The direction is the titles and the markets this record already holds. It points at nothing else.";
  }

  if (kind === "report" && held.some((i) => i.kind === "report")) return "The report is already in this release.";
  if (kind === "direction" && held.some((i) => i.kind === "direction")) {
    return "The direction is already in this release.";
  }
  if (pointers.cvDocumentId && held.some((i) => i.cvDocumentId === pointers.cvDocumentId)) {
    return "That file is already in this release.";
  }

  return null;
}

/** A fact a release repeats, and what the check of it found. */
export interface CheckedFact {
  /** The fact itself, in the words the coach will read. */
  label: string;
  /** The value the release's own items use. */
  value: string;
  /** Where the check looked: the Situation panel, or a named source document. */
  source: string;
  /** What that source holds, when it is not the same. */
  sourceValue?: string;
  agrees: boolean;
  /** The value the coach settled on, once they have. */
  chosen?: string;
}

/**
 * Why the facts hold this release back, or null.
 *
 * Only a mismatch somebody found holds it. This gate cannot require that a
 * check was run at all: the comparison needs something with a model, this app
 * has none, and a release carrying the report and the direction repeats no
 * figures to compare. So an empty list means nothing was found, and never that
 * nothing was looked for. What stops a release going out unchecked is the
 * process, not this function, and saying otherwise here would be a gate that
 * only looked like one.
 */
export function factFault(facts: CheckedFact[] | undefined): string | null {
  const open = (facts ?? []).filter((f) => !f.agrees && !f.chosen);
  if (open.length === 0) return null;
  const first = open[0];
  if (open.length === 1) return `"${first.label}" disagrees with ${first.source}. Settle it first.`;
  return `${open.length} facts disagree with their sources, starting with "${first.label}". Settle each one first.`;
}

/**
 * Why this release cannot go to the candidate, or null.
 *
 * The note is required because it is the one thing they read before the items.
 * Without it a release is a list of documents with nothing saying what they
 * are or why they arrived, which is the email this design exists to replace.
 */
export function releaseFault(
  held: HeldItem[],
  noteId: string | null | undefined,
  facts?: CheckedFact[],
): string | null {
  if (held.length === 0) return "There is nothing in this release.";
  if (!noteId) return "Choose the note the candidate reads over the release first.";
  return factFault(facts);
}

/** The next item's place, so two items never share one. */
export function nextOrder(held: HeldItem[]): number {
  return held.reduce((n, i) => Math.max(n, i.order), 0) + 1;
}
