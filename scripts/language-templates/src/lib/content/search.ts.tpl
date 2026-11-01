import type { Copy } from "./copy";

/**
 * Search descriptions: the line under a page's title in a search result.
 * 01/11/2026.
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
  "start-in-europe": {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlYXJjaC50czo6QVJUSUNMRV9TRUFSQ0guc3RhcnQtaW4tZXVyb3Bl:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlYXJjaC50czo6QVJUSUNMRV9TRUFSQ0guc3RhcnQtaW4tZXVyb3Bl:TH%%,
  },
};

/** An article's search description: the override where there is one, else its summary. */
export function articleSearch(post: { slug: string; summary: Copy }): Copy {
  return ARTICLE_SEARCH[post.slug] ?? post.summary;
}
