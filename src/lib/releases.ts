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

/**
 * Why this release cannot go to the candidate, or null.
 *
 * The note is required because it is the one thing they read before the items.
 * Without it a release is a list of documents with nothing saying what they
 * are or why they arrived, which is the email this design exists to replace.
 */
export function releaseFault(held: HeldItem[], noteId: string | null | undefined): string | null {
  if (held.length === 0) return "There is nothing in this release.";
  if (!noteId) return "Choose the note the candidate reads over the release first.";
  return null;
}

/** The next item's place, so two items never share one. */
export function nextOrder(held: HeldItem[]): number {
  return held.reduce((n, i) => Math.max(n, i.order), 0) + 1;
}
