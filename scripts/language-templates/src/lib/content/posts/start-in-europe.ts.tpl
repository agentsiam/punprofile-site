import type { Post } from "../blog";

/**
 * `start-in-europe`, the blog's first article. Published 18/08/2026.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS ITS OWN FILE
 * ---------------------------------------------------------------------------
 *
 * `blog.ts` says filling `POSTS` is the whole of publishing, and it still is:
 * that array is the registry and the running order. What changed is that this
 * article is roughly 3,000 words in two languages, and pasting it inline would
 * put more prose than schema in the file that defines the schema. `POSTS`
 * imports it and stays a list of articles.
 *
 * The import is one-directional at runtime. This file takes `Post` as a TYPE
 * only, which is erased at compile time, so there is no cycle.
 *
 * ---------------------------------------------------------------------------
 * THE THAI IS PAUL'S AND IT IS THE SOURCE
 * ---------------------------------------------------------------------------
 *
 * He wrote it in Thai on 18/08/2026, rewriting a composed draft in place. **The
 * English below is a translation of it and only ever runs in that direction**,
 * the same as the FAQ. Where the two disagree the Thai is right and the English
 * is what gets corrected. LR-09 is the rule; `blog-first-30-days-th.md` in the
 * coaching repo is the source of record, and it carries the register
 * measurement and the term check.
 *
 * **The English has not been read back by Paul.**
 *
 * ---------------------------------------------------------------------------
 * TWO THINGS THAT WERE CHECKED RATHER THAN ASSUMED
 * ---------------------------------------------------------------------------
 *
 * - **`430` and `422` are in the cited report**, verbatim: "For 422 of the 430
 *   occupations (98%) that have been classified as in shortage in at least one
 *   country, there exists at least one other country that has identified the
 *   same occupation as being in surplus". They were checked because this repo
 *   had only ever recorded the percentage. It is the article's one citation and
 *   its only figure that is not a method.
 * - **`เว็บไซต์ทางการ` in week 1 of the plan is deliberate.** `termbase.yml`
 *   bans that rendering on `post` and the entry now records that the scope is
 *   post-only on purpose: the register argument is about a feed, and a reader
 *   who opened a long guide about visa routes reads ทางการ as precision.
 */
export const START_IN_EUROPE: Post = {
  slug: "start-in-europe",
  topic: "how-to",
  playbook: true,
  published: "2026-08-18",

  title: {
    th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnRpdGxl:TH%%,
    en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnRpdGxl:EN%%,
  },

  seoTitle: {
    th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlb1RpdGxl:TH%%,
    en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlb1RpdGxl:EN%%,
  },

  summary: {
    th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnN1bW1hcnk:TH%%,
    en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnN1bW1hcnk:EN%%,
  },

  image: {
    src: "/blog/start-in-europe.jpg",
    // Describes the scene, not the article. An alt that summarised the argument
    // would read the thesis twice to anyone using a screen reader and tell them
    // nothing about the picture.
    alt: {
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLmltYWdlLmFsdA:TH%%,
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLmltYWdlLmFsdA:EN%%,
    },
  },

  question: {
    th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnF1ZXN0aW9u:TH%%,
    en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnF1ZXN0aW9u:EN%%,
  },

  sections: [
    {
      heading: { th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzBdLmhlYWRpbmc:TH%%, en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzBdLmhlYWRpbmc:EN%% },
      body: [
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzBdLmJvZHlbMF0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzBdLmJvZHlbMF0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzBdLmJvZHlbMV0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzBdLmJvZHlbMV0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzBdLmJvZHlbMl0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzBdLmJvZHlbMl0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzBdLmJvZHlbM10udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzBdLmJvZHlbM10udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzBdLmJvZHlbNF0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzBdLmJvZHlbNF0udGV4dA:EN%%,
          },
        },
        {
          kind: "list",
          items: [
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzBdLmJvZHlbNV0uaXRlbXNbMF0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzBdLmJvZHlbNV0uaXRlbXNbMF0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzBdLmJvZHlbNV0uaXRlbXNbMV0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzBdLmJvZHlbNV0uaXRlbXNbMV0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzBdLmJvZHlbNV0uaXRlbXNbMl0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzBdLmJvZHlbNV0uaXRlbXNbMl0:EN%%,
            },
          ],
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzBdLmJvZHlbNl0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzBdLmJvZHlbNl0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzBdLmJvZHlbN10udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzBdLmJvZHlbN10udGV4dA:EN%%,
          },
        },
      ],
    },

    {
      heading: {
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzFdLmhlYWRpbmc:TH%%,
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzFdLmhlYWRpbmc:EN%%,
      },
      body: [
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzFdLmJvZHlbMF0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzFdLmJvZHlbMF0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzFdLmJvZHlbMV0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzFdLmJvZHlbMV0udGV4dA:EN%%,
          },
        },
        {
          kind: "list",
          bare: true,
          items: [
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzFdLmJvZHlbMl0uaXRlbXNbMF0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzFdLmJvZHlbMl0uaXRlbXNbMF0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzFdLmJvZHlbMl0uaXRlbXNbMV0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzFdLmJvZHlbMl0uaXRlbXNbMV0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzFdLmJvZHlbMl0uaXRlbXNbMl0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzFdLmJvZHlbMl0uaXRlbXNbMl0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzFdLmJvZHlbMl0uaXRlbXNbM10:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzFdLmJvZHlbMl0uaXRlbXNbM10:EN%%,
            },
          ],
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzFdLmJvZHlbM10udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzFdLmJvZHlbM10udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzFdLmJvZHlbNF0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzFdLmJvZHlbNF0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzFdLmJvZHlbNV0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzFdLmJvZHlbNV0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzFdLmJvZHlbNl0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzFdLmJvZHlbNl0udGV4dA:EN%%,
          },
        },
      ],
    },

    {
      heading: {
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzJdLmhlYWRpbmc:TH%%,
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzJdLmhlYWRpbmc:EN%%,
      },
      body: [
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzJdLmJvZHlbMF0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzJdLmJvZHlbMF0udGV4dA:EN%%,
          },
        },
        {
          kind: "list",
          bare: true,
          items: [
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzJdLmJvZHlbMV0uaXRlbXNbMF0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzJdLmJvZHlbMV0uaXRlbXNbMF0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzJdLmJvZHlbMV0uaXRlbXNbMV0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzJdLmJvZHlbMV0uaXRlbXNbMV0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzJdLmJvZHlbMV0uaXRlbXNbMl0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzJdLmJvZHlbMV0uaXRlbXNbMl0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzJdLmJvZHlbMV0uaXRlbXNbM10:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzJdLmJvZHlbMV0uaXRlbXNbM10:EN%%,
            },
          ],
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzJdLmJvZHlbMl0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzJdLmJvZHlbMl0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzJdLmJvZHlbM10udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzJdLmJvZHlbM10udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzJdLmJvZHlbNF0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzJdLmJvZHlbNF0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzJdLmJvZHlbNV0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzJdLmJvZHlbNV0udGV4dA:EN%%,
          },
        },
      ],
    },

    {
      heading: {
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzNdLmhlYWRpbmc:TH%%,
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzNdLmhlYWRpbmc:EN%%,
      },
      body: [
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzNdLmJvZHlbMF0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzNdLmJvZHlbMF0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzNdLmJvZHlbMV0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzNdLmJvZHlbMV0udGV4dA:EN%%,
          },
          cite: {
            label: "European Labour Authority",
            href: "https://www.ela.europa.eu/en/publications/labour-shortages-and-surpluses-europe-2024",
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzNdLmJvZHlbMl0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzNdLmJvZHlbMl0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzNdLmJvZHlbM10udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzNdLmJvZHlbM10udGV4dA:EN%%,
          },
        },
        {
          kind: "list",
          bare: true,
          items: [
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzNdLmJvZHlbNF0uaXRlbXNbMF0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzNdLmJvZHlbNF0uaXRlbXNbMF0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzNdLmJvZHlbNF0uaXRlbXNbMV0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzNdLmJvZHlbNF0uaXRlbXNbMV0:EN%%,
            },
          ],
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzNdLmJvZHlbNV0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzNdLmJvZHlbNV0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzNdLmJvZHlbNl0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzNdLmJvZHlbNl0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzNdLmJvZHlbN10udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzNdLmJvZHlbN10udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzNdLmJvZHlbOF0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzNdLmJvZHlbOF0udGV4dA:EN%%,
          },
        },
      ],
    },

    {
      heading: {
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzRdLmhlYWRpbmc:TH%%,
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzRdLmhlYWRpbmc:EN%%,
      },
      body: [
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzRdLmJvZHlbMF0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzRdLmJvZHlbMF0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzRdLmJvZHlbMV0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzRdLmJvZHlbMV0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzRdLmJvZHlbMl0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzRdLmJvZHlbMl0udGV4dA:EN%%,
          },
        },
        {
          kind: "list",
          items: [
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzRdLmJvZHlbM10uaXRlbXNbMF0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzRdLmJvZHlbM10uaXRlbXNbMF0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzRdLmJvZHlbM10uaXRlbXNbMV0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzRdLmJvZHlbM10uaXRlbXNbMV0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzRdLmJvZHlbM10uaXRlbXNbMl0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzRdLmJvZHlbM10uaXRlbXNbMl0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzRdLmJvZHlbM10uaXRlbXNbM10:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzRdLmJvZHlbM10uaXRlbXNbM10:EN%%,
            },
          ],
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzRdLmJvZHlbNF0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzRdLmJvZHlbNF0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzRdLmJvZHlbNV0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzRdLmJvZHlbNV0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzRdLmJvZHlbNl0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzRdLmJvZHlbNl0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzRdLmJvZHlbN10udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzRdLmJvZHlbN10udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzRdLmJvZHlbOF0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzRdLmJvZHlbOF0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzRdLmJvZHlbOV0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzRdLmJvZHlbOV0udGV4dA:EN%%,
          },
        },
      ],
    },

    {
      heading: {
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzVdLmhlYWRpbmc:TH%%,
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzVdLmhlYWRpbmc:EN%%,
      },
      body: [
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzVdLmJvZHlbMF0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzVdLmJvZHlbMF0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzVdLmJvZHlbMV0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzVdLmJvZHlbMV0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzVdLmJvZHlbMl0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzVdLmJvZHlbMl0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzVdLmJvZHlbM10udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzVdLmJvZHlbM10udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzVdLmJvZHlbNF0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzVdLmJvZHlbNF0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzVdLmJvZHlbNV0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzVdLmJvZHlbNV0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzVdLmJvZHlbNl0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzVdLmJvZHlbNl0udGV4dA:EN%%,
          },
        },
      ],
    },

    {
      heading: {
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzZdLmhlYWRpbmc:TH%%,
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzZdLmhlYWRpbmc:EN%%,
      },
      body: [
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzZdLmJvZHlbMF0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzZdLmJvZHlbMF0udGV4dA:EN%%,
          },
        },
        {
          kind: "list",
          items: [
            { th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzZdLmJvZHlbMV0uaXRlbXNbMF0:TH%%, en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzZdLmJvZHlbMV0uaXRlbXNbMF0:EN%% },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzZdLmJvZHlbMV0uaXRlbXNbMV0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzZdLmJvZHlbMV0uaXRlbXNbMV0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzZdLmJvZHlbMV0uaXRlbXNbMl0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzZdLmJvZHlbMV0uaXRlbXNbMl0:EN%%,
            },
            { th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzZdLmJvZHlbMV0uaXRlbXNbM10:TH%%, en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzZdLmJvZHlbMV0uaXRlbXNbM10:EN%% },
            { th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzZdLmJvZHlbMV0uaXRlbXNbNF0:TH%%, en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzZdLmJvZHlbMV0uaXRlbXNbNF0:EN%% },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzZdLmJvZHlbMV0uaXRlbXNbNV0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzZdLmJvZHlbMV0uaXRlbXNbNV0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzZdLmJvZHlbMV0uaXRlbXNbNl0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzZdLmJvZHlbMV0uaXRlbXNbNl0:EN%%,
            },
          ],
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzZdLmJvZHlbMl0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzZdLmJvZHlbMl0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzZdLmJvZHlbM10udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzZdLmJvZHlbM10udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzZdLmJvZHlbNF0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzZdLmJvZHlbNF0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzZdLmJvZHlbNV0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzZdLmJvZHlbNV0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzZdLmJvZHlbNl0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzZdLmJvZHlbNl0udGV4dA:EN%%,
          },
        },
      ],
    },

    {
      heading: {
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzddLmhlYWRpbmc:TH%%,
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzddLmhlYWRpbmc:EN%%,
      },
      body: [
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzddLmJvZHlbMF0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzddLmJvZHlbMF0udGV4dA:EN%%,
          },
        },
        {
          kind: "list",
          bare: true,
          items: [
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzddLmJvZHlbMV0uaXRlbXNbMF0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzddLmJvZHlbMV0uaXRlbXNbMF0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzddLmJvZHlbMV0uaXRlbXNbMV0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzddLmJvZHlbMV0uaXRlbXNbMV0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzddLmJvZHlbMV0uaXRlbXNbMl0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzddLmJvZHlbMV0uaXRlbXNbMl0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzddLmJvZHlbMV0uaXRlbXNbM10:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzddLmJvZHlbMV0uaXRlbXNbM10:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzddLmJvZHlbMV0uaXRlbXNbNF0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzddLmJvZHlbMV0uaXRlbXNbNF0:EN%%,
            },
          ],
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzddLmJvZHlbMl0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzddLmJvZHlbMl0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: { th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzddLmJvZHlbM10udGV4dA:TH%%, en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzddLmJvZHlbM10udGV4dA:EN%% },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzddLmJvZHlbNF0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzddLmJvZHlbNF0udGV4dA:EN%%,
          },
        },
      ],
    },

    {
      heading: {
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzhdLmhlYWRpbmc:TH%%,
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzhdLmhlYWRpbmc:EN%%,
      },
      body: [
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzhdLmJvZHlbMF0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzhdLmJvZHlbMF0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzhdLmJvZHlbMV0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzhdLmJvZHlbMV0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzhdLmJvZHlbMl0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzhdLmJvZHlbMl0udGV4dA:EN%%,
          },
        },
        {
          kind: "list",
          bare: true,
          items: [
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzhdLmJvZHlbM10uaXRlbXNbMF0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzhdLmJvZHlbM10uaXRlbXNbMF0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzhdLmJvZHlbM10uaXRlbXNbMV0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzhdLmJvZHlbM10uaXRlbXNbMV0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzhdLmJvZHlbM10uaXRlbXNbMl0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzhdLmJvZHlbM10uaXRlbXNbMl0:EN%%,
            },
          ],
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzhdLmJvZHlbNF0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzhdLmJvZHlbNF0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzhdLmJvZHlbNV0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzhdLmJvZHlbNV0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzhdLmJvZHlbNl0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzhdLmJvZHlbNl0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzhdLmJvZHlbN10udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzhdLmJvZHlbN10udGV4dA:EN%%,
          },
        },
      ],
    },

    {
      heading: { th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzldLmhlYWRpbmc:TH%%, en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzldLmhlYWRpbmc:EN%% },
      body: [
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzldLmJvZHlbMF0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzldLmJvZHlbMF0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzldLmJvZHlbMV0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzldLmJvZHlbMV0udGV4dA:EN%%,
          },
        },
        {
          kind: "list",
          bare: true,
          items: [
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzldLmJvZHlbMl0uaXRlbXNbMF0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzldLmJvZHlbMl0uaXRlbXNbMF0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzldLmJvZHlbMl0uaXRlbXNbMV0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzldLmJvZHlbMl0uaXRlbXNbMV0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzldLmJvZHlbMl0uaXRlbXNbMl0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzldLmJvZHlbMl0uaXRlbXNbMl0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzldLmJvZHlbMl0uaXRlbXNbM10:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzldLmJvZHlbMl0uaXRlbXNbM10:EN%%,
            },
          ],
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzldLmJvZHlbM10udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzldLmJvZHlbM10udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzldLmJvZHlbNF0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzldLmJvZHlbNF0udGV4dA:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzldLmJvZHlbNV0udGV4dA:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzldLmJvZHlbNV0udGV4dA:EN%%,
          },
        },
      ],
    },

    {
      heading: {
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEwXS5oZWFkaW5n:TH%%,
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEwXS5oZWFkaW5n:EN%%,
      },
      body: [
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEwXS5ib2R5WzBdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEwXS5ib2R5WzBdLnRleHQ:EN%%,
          },
        },
      ],
    },

    {
      heading: {
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzExXS5oZWFkaW5n:TH%%,
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzExXS5oZWFkaW5n:EN%%,
      },
      body: [
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzExXS5ib2R5WzBdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzExXS5ib2R5WzBdLnRleHQ:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzExXS5ib2R5WzFdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzExXS5ib2R5WzFdLnRleHQ:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzExXS5ib2R5WzJdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzExXS5ib2R5WzJdLnRleHQ:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzExXS5ib2R5WzNdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzExXS5ib2R5WzNdLnRleHQ:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzExXS5ib2R5WzRdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzExXS5ib2R5WzRdLnRleHQ:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzExXS5ib2R5WzVdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzExXS5ib2R5WzVdLnRleHQ:EN%%,
          },
        },
      ],
    },

    {
      heading: {
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEyXS5oZWFkaW5n:TH%%,
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEyXS5oZWFkaW5n:EN%%,
      },
      body: [
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEyXS5ib2R5WzBdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEyXS5ib2R5WzBdLnRleHQ:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEyXS5ib2R5WzFdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEyXS5ib2R5WzFdLnRleHQ:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEyXS5ib2R5WzJdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEyXS5ib2R5WzJdLnRleHQ:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEyXS5ib2R5WzNdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEyXS5ib2R5WzNdLnRleHQ:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEyXS5ib2R5WzRdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEyXS5ib2R5WzRdLnRleHQ:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEyXS5ib2R5WzVdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEyXS5ib2R5WzVdLnRleHQ:EN%%,
          },
        },
      ],
    },

    {
      heading: { th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5oZWFkaW5n:TH%%, en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5oZWFkaW5n:EN%% },
      body: [
        {
          kind: "sub",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzBdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzBdLnRleHQ:EN%%,
          },
        },
        {
          kind: "list",
          items: [
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzFdLml0ZW1zWzBd:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzFdLml0ZW1zWzBd:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzFdLml0ZW1zWzFd:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzFdLml0ZW1zWzFd:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzFdLml0ZW1zWzJd:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzFdLml0ZW1zWzJd:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzFdLml0ZW1zWzNd:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzFdLml0ZW1zWzNd:EN%%,
            },
          ],
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzJdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzJdLnRleHQ:EN%%,
          },
        },
        {
          kind: "sub",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzNdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzNdLnRleHQ:EN%%,
          },
        },
        {
          kind: "list",
          items: [
            { th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzRdLml0ZW1zWzBd:TH%%, en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzRdLml0ZW1zWzBd:EN%% },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzRdLml0ZW1zWzFd:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzRdLml0ZW1zWzFd:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzRdLml0ZW1zWzJd:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzRdLml0ZW1zWzJd:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzRdLml0ZW1zWzNd:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzRdLml0ZW1zWzNd:EN%%,
            },
          ],
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzVdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzVdLnRleHQ:EN%%,
          },
        },
        {
          kind: "sub",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzZdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzZdLnRleHQ:EN%%,
          },
        },
        {
          kind: "list",
          items: [
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzddLml0ZW1zWzBd:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzddLml0ZW1zWzBd:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzddLml0ZW1zWzFd:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzddLml0ZW1zWzFd:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzddLml0ZW1zWzJd:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzddLml0ZW1zWzJd:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzddLml0ZW1zWzNd:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzddLml0ZW1zWzNd:EN%%,
            },
          ],
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzhdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzhdLnRleHQ:EN%%,
          },
        },
        {
          kind: "sub",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzldLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzldLnRleHQ:EN%%,
          },
        },
        {
          kind: "list",
          items: [
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzEwXS5pdGVtc1swXQ:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzEwXS5pdGVtc1swXQ:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzEwXS5pdGVtc1sxXQ:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzEwXS5pdGVtc1sxXQ:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzEwXS5pdGVtc1syXQ:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzEwXS5pdGVtc1syXQ:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzEwXS5pdGVtc1szXQ:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzEwXS5pdGVtc1szXQ:EN%%,
            },
          ],
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzExXS50ZXh0:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzExXS50ZXh0:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzEyXS50ZXh0:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzEzXS5ib2R5WzEyXS50ZXh0:EN%%,
          },
        },
      ],
    },

    {
      heading: { th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE0XS5oZWFkaW5n:TH%%, en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE0XS5oZWFkaW5n:EN%% },
      body: [
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE0XS5ib2R5WzBdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE0XS5ib2R5WzBdLnRleHQ:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE0XS5ib2R5WzFdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE0XS5ib2R5WzFdLnRleHQ:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE0XS5ib2R5WzJdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE0XS5ib2R5WzJdLnRleHQ:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE0XS5ib2R5WzNdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE0XS5ib2R5WzNdLnRleHQ:EN%%,
          },
        },
      ],
    },

    {
      heading: { th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5oZWFkaW5n:TH%%, en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5oZWFkaW5n:EN%% },
      body: [
        {
          kind: "qa",
          q: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzBdLnE:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzBdLnE:EN%%,
          },
          a: [
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzBdLmFbMF0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzBdLmFbMF0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzBdLmFbMV0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzBdLmFbMV0:EN%%,
            },
          ],
        },
        {
          kind: "qa",
          q: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzFdLnE:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzFdLnE:EN%%,
          },
          a: [
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzFdLmFbMF0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzFdLmFbMF0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzFdLmFbMV0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzFdLmFbMV0:EN%%,
            },
          ],
        },
        {
          kind: "qa",
          q: { th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzJdLnE:TH%%, en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzJdLnE:EN%% },
          a: [
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzJdLmFbMF0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzJdLmFbMF0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzJdLmFbMV0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzJdLmFbMV0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzJdLmFbMl0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzJdLmFbMl0:EN%%,
            },
          ],
        },
        {
          kind: "qa",
          q: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzNdLnE:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzNdLnE:EN%%,
          },
          a: [
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzNdLmFbMF0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzNdLmFbMF0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzNdLmFbMV0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzNdLmFbMV0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzNdLmFbMl0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzNdLmFbMl0:EN%%,
            },
          ],
        },
        {
          kind: "qa",
          q: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzRdLnE:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzRdLnE:EN%%,
          },
          a: [
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzRdLmFbMF0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzRdLmFbMF0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzRdLmFbMV0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzRdLmFbMV0:EN%%,
            },
          ],
        },
        {
          kind: "qa",
          q: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzVdLnE:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzVdLnE:EN%%,
          },
          a: [
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzVdLmFbMF0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzVdLmFbMF0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzVdLmFbMV0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzVdLmFbMV0:EN%%,
            },
          ],
        },
        {
          kind: "qa",
          q: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzZdLnE:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzZdLnE:EN%%,
          },
          a: [
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzZdLmFbMF0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzZdLmFbMF0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzZdLmFbMV0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzZdLmFbMV0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzZdLmFbMl0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzZdLmFbMl0:EN%%,
            },
          ],
        },
        {
          kind: "qa",
          q: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzddLnE:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzddLnE:EN%%,
          },
          a: [
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzddLmFbMF0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzddLmFbMF0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzddLmFbMV0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzddLmFbMV0:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzddLmFbMl0:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL3N0YXJ0LWluLWV1cm9wZS50czo6U1RBUlRfSU5fRVVST1BFLnNlY3Rpb25zWzE1XS5ib2R5WzddLmFbMl0:EN%%,
            },
          ],
        },
      ],
    },
  ],
};
