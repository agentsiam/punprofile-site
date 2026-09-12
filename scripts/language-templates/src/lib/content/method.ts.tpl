import type { Copy } from "./copy";
import type { DimensionKey } from "@/lib/model";

/**
 * `/method`. Added 26/08/2026, Paul's call.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS PAGE EXISTS, AND WHAT IT IS ALLOWED TO SAY
 * ---------------------------------------------------------------------------
 *
 * `Narrative_System.md` gives every offer a slot 7, the thing that makes it
 * checkable, and the EU Fit Check's reads: *the four gates are published
 * reasoning in `10_Methodology.md`, not a claim.* On 26/08/2026 that was found
 * to be false in the only way that matters. The document is real and it is in
 * the coaching repo, where no reader can open it, so the home page's hero had
 * been carrying Matched Jobs' pipeline count instead. A record cannot cite a
 * page the reader cannot reach. This page is what makes the citation true.
 *
 * **It publishes the bars, as of 26/08/2026.** For one day it did not. The page
 * shipped with the gates and their questions and no numbers, because
 * `10_Methodology.md` was headed "Status: draft" and called them "**Proposed**
 * bars, for the owner to set", while `model.ts` › `GATES` implemented 4.0, 4.0,
 * 3.5 and 3.0 and the app scored real candidates against them daily. Printing a
 * number the owning document called undecided would have settled it by
 * publishing, which is backwards.
 *
 * Building this page is what forced the decision, and Paul made it the same day:
 * the bars are confirmed at the values already in the code, and the owning
 * document says so. Nothing in the app changed. What changed is that the numbers
 * are now a decision rather than a habit.
 *
 * **The order is not written here.** The page walks `GATES` from `model.ts`,
 * which is the same array `firstAction()` stops at. A published method that
 * could disagree with the implemented one is worse than no published method,
 * and importing it is the only version of this page that cannot drift.
 *
 * **The gate names are not written here either.** They are
 * `dimension.mobilityReadiness` and friends in `copy.ts`, already read back and
 * already on the spider chart. A second Thai name for an axis a candidate has
 * seen on their own result is the one-string-one-place failure.
 *
 * ---------------------------------------------------------------------------
 * THAI
 * ---------------------------------------------------------------------------
 *
 * **Every Thai string in this file has now been read back, 06/09/2026.** They
 * were drafts carrying `TH-UNREVIEWED` from the day the page shipped, which is
 * why `/method` was `NOT_YET_INDEXED`: linked, honest, and not offered to a
 * crawler as finished. Paul closed all twenty-five in one pass through
 * `thai-review-queue.md`, rewriting ten of them, so the marker and the tag both
 * come off together.
 */

export const METHOD_HEADING: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6TUVUSE9EX0hFQURJTkc:EN%%,
  // Read back 06/09/2026.
  th: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6TUVUSE9EX0hFQURJTkc:TH%%,
};

export const METHOD_INTRO: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6TUVUSE9EX0lOVFJP:EN%%,
  // Read back 06/09/2026.
  th: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6TUVUSE9EX0lOVFJP:TH%%,
};

export const CLAIM_HEADING: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6Q0xBSU1fSEVBRElORw:EN%%,
  // Read back 06/09/2026.
  th: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6Q0xBSU1fSEVBRElORw:TH%%,
};

export const CLAIM_BODY: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6Q0xBSU1fQk9EWQ:EN%%,
  // Paul's wording, 06/09/2026. The home page states the same claim from the reader's side,
  // in Paul's own approved wording; this states it as the premise of a method,
  // which is a different sentence doing a different job on a different page.
  th: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6Q0xBSU1fQk9EWQ:TH%%,
};

/** The two verbs, in this order. `10_Methodology.md` § 1 owns the reasoning. */
export const VERBS: readonly { name: Copy; body: Copy }[] = [
  {
    name: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6VkVSQlNbMF0ubmFtZQ:EN%%,
      // Read back 06/09/2026.
      th: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6VkVSQlNbMF0ubmFtZQ:TH%%,
    },
    body: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6VkVSQlNbMF0uYm9keQ:EN%%,
      // Paul's wording, 06/09/2026.
      th: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6VkVSQlNbMF0uYm9keQ:TH%%,
    },
  },
  {
    name: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6VkVSQlNbMV0ubmFtZQ:EN%%,
      // Read back 06/09/2026.
      th: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6VkVSQlNbMV0ubmFtZQ:TH%%,
    },
    body: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6VkVSQlNbMV0uYm9keQ:EN%%,
      // Paul's wording, 06/09/2026.
      th: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6VkVSQlNbMV0uYm9keQ:TH%%,
    },
  },
];

export const THRESHOLD_HEADING: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6VEhSRVNIT0xEX0hFQURJTkc:EN%%,
  // Read back 06/09/2026.
  th: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6VEhSRVNIT0xEX0hFQURJTkc:TH%%,
};

export const THRESHOLD_BODY: readonly Copy[] = [
  {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6VEhSRVNIT0xEX0JPRFlbMF0:EN%%,
    // Paul's wording, 06/09/2026.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6VEhSRVNIT0xEX0JPRFlbMF0:TH%%,
  },
  {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6VEhSRVNIT0xEX0JPRFlbMV0:EN%%,
    // Read back 06/09/2026.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6VEhSRVNIT0xEX0JPRFlbMV0:TH%%,
  },
];

export const GATES_HEADING: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6R0FURVNfSEVBRElORw:EN%%,
  // Read back 06/09/2026.
  th: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6R0FURVNfSEVBRElORw:TH%%,
};

/**
 * The question each gate answers. Keyed by `DimensionKey` so the page can walk
 * `GATES` from `model.ts` and look each one up, which is what stops this list
 * and the scorer's order from ever disagreeing.
 *
 * The gate NAMES are not here. They are `dimension.*` in `copy.ts`.
 */
export const GATE_QUESTIONS: Record<DimensionKey, Copy> = {
  mobilityReadiness: {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6R0FURV9RVUVTVElPTlMubW9iaWxpdHlSZWFkaW5lc3M:EN%%,
    // Read back 06/09/2026.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6R0FURV9RVUVTVElPTlMubW9iaWxpdHlSZWFkaW5lc3M:TH%%,
  },
  employability: {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6R0FURV9RVUVTVElPTlMuZW1wbG95YWJpbGl0eQ:EN%%,
    // Paul's wording, 06/09/2026.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6R0FURV9RVUVTVElPTlMuZW1wbG95YWJpbGl0eQ:TH%%,
  },
  europeanMarketFit: {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6R0FURV9RVUVTVElPTlMuZXVyb3BlYW5NYXJrZXRGaXQ:EN%%,
    // Read back 06/09/2026.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6R0FURV9RVUVTVElPTlMuZXVyb3BlYW5NYXJrZXRGaXQ:TH%%,
  },
  professionalCapability: {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6R0FURV9RVUVTVElPTlMucHJvZmVzc2lvbmFsQ2FwYWJpbGl0eQ:EN%%,
    // Read back 06/09/2026.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6R0FURV9RVUVTVElPTlMucHJvZmVzc2lvbmFsQ2FwYWJpbGl0eQ:TH%%,
  },
};

/**
 * The label beside each bar. The NUMBER is never written here: the page reads
 * it off `GATES` in `model.ts`, the same array the scorer walks, so a published
 * bar and an enforced bar cannot become two different numbers.
 */
export const GATE_BAR: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6R0FURV9CQVI:EN%%,
  // Paul's wording, 06/09/2026.
  th: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6R0FURV9CQVI:TH%%,
};

export const GATES_ORDER: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6R0FURVNfT1JERVI:EN%%,
  // Paul's wording, 06/09/2026.
  th: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6R0FURVNfT1JERVI:TH%%,
};

export const GATES_LOWEST: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6R0FURVNfTE9XRVNU:EN%%,
  // Paul's wording, 06/09/2026.
  th: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6R0FURVNfTE9XRVNU:TH%%,
};

/**
 * Slot 6, and it comes before the ask at the foot. Two limits, and the second
 * one is `model.ts`'s own note made public: Financial Readiness is a fifth gate
 * in `10_Methodology.md` and is absent from `GATES` because its competency has
 * no survey input, so a bar would be checked against a permanently null score.
 * Flagged there, and flagged here rather than quietly dropped.
 */
export const LIMIT_HEADING: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6TElNSVRfSEVBRElORw:EN%%,
  // Read back 06/09/2026.
  th: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6TElNSVRfSEVBRElORw:TH%%,
};

export const LIMIT_BODY: readonly Copy[] = [
  {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6TElNSVRfQk9EWVswXQ:EN%%,
    // Paul's wording, 06/09/2026.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6TElNSVRfQk9EWVswXQ:TH%%,
  },
  {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6TElNSVRfQk9EWVsxXQ:EN%%,
    // Paul's wording, 06/09/2026.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6TElNSVRfQk9EWVsxXQ:TH%%,
  },
];

export const METHOD_CLOSE: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6TUVUSE9EX0NMT1NF:EN%%,
  // Read back 06/09/2026.
  th: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6TUVUSE9EX0NMT1NF:TH%%,
};

/**
 * The home page's second hero proof, and it is a link rather than a sentence.
 *
 * Slot 7 says a proof is a figure, a document or a worked example and never an
 * adjective. "Our method is published" unlinked is an adjective; the same words
 * pointing at the page are a document the reader can open, which is the whole
 * difference.
 */
export const METHOD_PROOF: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6TUVUSE9EX1BST09G:EN%%,
  // Read back 06/09/2026.
  th: %%LANG:c3JjL2xpYi9jb250ZW50L21ldGhvZC50czo6TUVUSE9EX1BST09G:TH%%,
};
