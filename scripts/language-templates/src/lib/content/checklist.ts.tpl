import type { Copy } from "./copy";

/**
 * The per-stage checklist on a job in the candidate's tracker, Teal's "Check
 * List" tab with PunProfile's own wording.
 *
 * **What belongs here (Paul, 30/10/2026):** steps that apply to every
 * candidate, with or without a visa sponsor, and that are about moving the
 * application along. Nothing about the opening's own criteria, and nothing
 * about visas.
 *
 * **Draft, awaiting Paul's approval.** The approved wording is recorded in the
 * coaching repo before this ships to anyone.
 *
 * Item ids are stable and stored on `applications.checklist` as done marks, so
 * an id is never reused for a different step. Rewording keeps the id; a step
 * that is replaced gets a new one.
 */

export interface ChecklistItem {
  id: string;
  label: Copy;
}

export const CHECKLIST: Record<
  "interested" | "applied" | "screening" | "interviewing" | "offer" | "accepted",
  readonly ChecklistItem[]
> = {
  interested: [
    { id: "saved-read-jd", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmludGVyZXN0ZWRbMF0ubGFiZWw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmludGVyZXN0ZWRbMF0ubGFiZWw:TH%% } },
    { id: "saved-pick-cv", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmludGVyZXN0ZWRbMV0ubGFiZWw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmludGVyZXN0ZWRbMV0ubGFiZWw:TH%% } },
    { id: "saved-tailor-cv", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmludGVyZXN0ZWRbMl0ubGFiZWw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmludGVyZXN0ZWRbMl0ubGFiZWw:TH%% } },
    { id: "saved-cover", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmludGVyZXN0ZWRbM10ubGFiZWw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmludGVyZXN0ZWRbM10ubGFiZWw:TH%% } },
    { id: "saved-deadline", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmludGVyZXN0ZWRbNF0ubGFiZWw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmludGVyZXN0ZWRbNF0ubGFiZWw:TH%% } },
  ],
  applied: [
    { id: "applied-record-cv", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmFwcGxpZWRbMF0ubGFiZWw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmFwcGxpZWRbMF0ubGFiZWw:TH%% } },
    { id: "applied-follow-date", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmFwcGxpZWRbMV0ubGFiZWw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmFwcGxpZWRbMV0ubGFiZWw:TH%% } },
    { id: "applied-find-contact", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmFwcGxpZWRbMl0ubGFiZWw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmFwcGxpZWRbMl0ubGFiZWw:TH%% } },
    { id: "applied-message", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmFwcGxpZWRbM10ubGFiZWw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmFwcGxpZWRbM10ubGFiZWw:TH%% } },
    { id: "applied-follow-up", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmFwcGxpZWRbNF0ubGFiZWw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmFwcGxpZWRbNF0ubGFiZWw:TH%% } },
  ],
  screening: [
    { id: "screen-intro", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULnNjcmVlbmluZ1swXS5sYWJlbA:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULnNjcmVlbmluZ1swXS5sYWJlbA:TH%% } },
    { id: "screen-salary", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULnNjcmVlbmluZ1sxXS5sYWJlbA:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULnNjcmVlbmluZ1sxXS5sYWJlbA:TH%% } },
    { id: "screen-start", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULnNjcmVlbmluZ1syXS5sYWJlbA:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULnNjcmVlbmluZ1syXS5sYWJlbA:TH%% } },
    { id: "screen-tech", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULnNjcmVlbmluZ1szXS5sYWJlbA:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULnNjcmVlbmluZ1szXS5sYWJlbA:TH%% } },
    { id: "screen-log", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULnNjcmVlbmluZ1s0XS5sYWJlbA:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULnNjcmVlbmluZ1s0XS5sYWJlbA:TH%% } },
  ],
  interviewing: [
    { id: "iv-research", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmludGVydmlld2luZ1swXS5sYWJlbA:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmludGVydmlld2luZ1swXS5sYWJlbA:TH%% } },
    { id: "iv-stories", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmludGVydmlld2luZ1sxXS5sYWJlbA:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmludGVydmlld2luZ1sxXS5sYWJlbA:TH%% } },
    { id: "iv-questions", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmludGVydmlld2luZ1syXS5sYWJlbA:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmludGVydmlld2luZ1syXS5sYWJlbA:TH%% } },
    { id: "iv-thanks", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmludGVydmlld2luZ1szXS5sYWJlbA:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmludGVydmlld2luZ1szXS5sYWJlbA:TH%% } },
    { id: "iv-log", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmludGVydmlld2luZ1s0XS5sYWJlbA:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmludGVydmlld2luZ1s0XS5sYWJlbA:TH%% } },
  ],
  offer: [
    { id: "offer-writing", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULm9mZmVyWzBdLmxhYmVs:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULm9mZmVyWzBdLmxhYmVs:TH%% } },
    { id: "offer-net", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULm9mZmVyWzFdLmxhYmVs:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULm9mZmVyWzFdLmxhYmVs:TH%% } },
    { id: "offer-terms", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULm9mZmVyWzJdLmxhYmVs:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULm9mZmVyWzJdLmxhYmVs:TH%% } },
    { id: "offer-reply", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULm9mZmVyWzNdLmxhYmVs:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULm9mZmVyWzNdLmxhYmVs:TH%% } },
    { id: "offer-coach", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULm9mZmVyWzRdLmxhYmVs:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULm9mZmVyWzRdLmxhYmVs:TH%% } },
  ],
  accepted: [
    { id: "acc-sign", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmFjY2VwdGVkWzBdLmxhYmVs:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmFjY2VwdGVkWzBdLmxhYmVs:TH%% } },
    { id: "acc-withdraw", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmFjY2VwdGVkWzFdLmxhYmVs:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmFjY2VwdGVkWzFdLmxhYmVs:TH%% } },
    { id: "acc-close-list", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmFjY2VwdGVkWzJdLmxhYmVs:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmFjY2VwdGVkWzJdLmxhYmVs:TH%% } },
    { id: "acc-thank", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmFjY2VwdGVkWzNdLmxhYmVs:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmFjY2VwdGVkWzNdLmxhYmVs:TH%% } },
    { id: "acc-docs", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmFjY2VwdGVkWzRdLmxhYmVs:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNULmFjY2VwdGVkWzRdLmxhYmVs:TH%% } },
  ],
};

export const CHECKLIST_TAB: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNUX1RBQg:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNUX1RBQg:TH%% };
export const CHECKLIST_PROGRESS: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNUX1BST0dSRVNT:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNUX1BST0dSRVNT:TH%% };
export const CHECKLIST_OTHER: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNUX09USEVS:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NoZWNrbGlzdC50czo6Q0hFQ0tMSVNUX09USEVS:TH%% };
