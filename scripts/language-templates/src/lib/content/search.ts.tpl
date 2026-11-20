import type { Copy } from "./copy";

/**
 * Search-only titles and descriptions: what a search result shows, where the
 * page's own copy is the wrong text for it. 01/11/2026, widened 20/11/2026 from
 * descriptions to titles as well.
 *
 * Search-only. Nothing here appears on a page, and the visible text these
 * stand beside (the home subhead, the article summaries) is unchanged. They
 * exist because those visible strings ran past the 160 characters a result
 * shows, or because one page borrowed another page's line and the two looked
 * like one page in search. `npm run audit:seo` is the check.
 *
 * Approved in `seo-meta-copy-handoff.md`, in the sibling repo. Where only one
 * language needed a new line, the other carries the existing approved string
 * unchanged, because every record here is a pair.
 */

/** `/efc-assessment`. It had borrowed the home page's description. */
export const EFC_ASSESSMENT_SEARCH: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlYXJjaC50czo6RUZDX0FTU0VTU01FTlRfU0VBUkNI:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlYXJjaC50czo6RUZDX0FTU0VTU01FTlRfU0VBUkNI:TH%%,
};

/** `/efc-assessment`. Its title was the navigation label, identical in both trees. */
export const EFC_ASSESSMENT_TITLE: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlYXJjaC50czo6RUZDX0FTU0VTU01FTlRfVElUTEU:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlYXJjaC50czo6RUZDX0FTU0VTU01FTlRfVElUTEU:TH%%,
};

/** `/faq`. Its title and description were the visible heading and intro. */
export const FAQ_TITLE: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlYXJjaC50czo6RkFRX1RJVExF:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlYXJjaC50czo6RkFRX1RJVExF:TH%%,
};

export const FAQ_SEARCH: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlYXJjaC50czo6RkFRX1NFQVJDSA:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlYXJjaC50czo6RkFRX1NFQVJDSA:TH%%,
};

/** The home page. Only `en` is read: the Thai root layout keeps `landing.subhead`. */
export const HOME_SEARCH: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlYXJjaC50czo6SE9NRV9TRUFSQ0g:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlYXJjaC50czo6SE9NRV9TRUFSQ0g:TH%%,
};

/** Per article, by slug, only where the summary does not fit. */
export const ARTICLE_SEARCH: Record<string, Copy> = {
  "cara-working-in-spain": {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlYXJjaC50czo6QVJUSUNMRV9TRUFSQ0guY2FyYS13b3JraW5nLWluLXNwYWlu:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlYXJjaC50czo6QVJUSUNMRV9TRUFSQ0guY2FyYS13b3JraW5nLWluLXNwYWlu:TH%%,
  },
  "linkedin-europe-ready": {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlYXJjaC50czo6QVJUSUNMRV9TRUFSQ0gubGlua2VkaW4tZXVyb3BlLXJlYWR5:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlYXJjaC50czo6QVJUSUNMRV9TRUFSQ0gubGlua2VkaW4tZXVyb3BlLXJlYWR5:TH%%,
  },
  "start-in-europe": {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlYXJjaC50czo6QVJUSUNMRV9TRUFSQ0guc3RhcnQtaW4tZXVyb3Bl:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlYXJjaC50czo6QVJUSUNMRV9TRUFSQ0guc3RhcnQtaW4tZXVyb3Bl:TH%%,
  },
};

/** An article's search description: the override where there is one, else its summary. */
export function articleSearch(post: { slug: string; summary: Copy }): Copy {
  return ARTICLE_SEARCH[post.slug] ?? post.summary;
}

/**
 * Per product, by slug, where the headline is the wrong length for a result.
 * A product page's description is its `headline`, which is visible page copy:
 * stretching that to suit a search result would damage the page, so the result
 * gets its own line here and the page keeps its own.
 */
export const PRODUCT_SEARCH: Record<string, Copy> = {
  "fit-report": {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlYXJjaC50czo6UFJPRFVDVF9TRUFSQ0guZml0LXJlcG9ydA:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlYXJjaC50czo6UFJPRFVDVF9TRUFSQ0guZml0LXJlcG9ydA:TH%%,
  },
  "matched-jobs": {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlYXJjaC50czo6UFJPRFVDVF9TRUFSQ0gubWF0Y2hlZC1qb2Jz:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlYXJjaC50czo6UFJPRFVDVF9TRUFSQ0gubWF0Y2hlZC1qb2Jz:TH%%,
  },
};

/** A product's search description: the override where there is one, else its headline. */
export function productSearch(product: { slug: string; headline: Copy }): Copy {
  return PRODUCT_SEARCH[product.slug] ?? product.headline;
}
