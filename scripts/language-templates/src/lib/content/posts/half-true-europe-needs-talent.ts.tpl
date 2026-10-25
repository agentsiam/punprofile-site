import type { Post } from "../blog";

/**
 * `half-true-europe-needs-talent`, the blog's second article. Published 23/10/2026.
 *
 * Paul's Thai, from `thai-europe-job-guide.md` in the coaching repo's
 * `golden-th/other/` (Newsletter 2), queued in the coaching repo's `blog/blog.md` on 16/08/2026
 * with its slug, pillar, citation map and English. Publishing it was
 * transcription, not a second round of decisions.
 *
 * The queue's three edits are applied: the subject and preheader lines are gone,
 * the preheader is the card summary, the bracketed CTA placeholder is gone
 * because `cta.ts` owns every action, and the closing label is
 * `คำถามสำหรับคุณ`. The source's one `#` heading on the last section is read as
 * a section heading like the others; it is the article's fourth `##`, not a
 * second title.
 *
 * Thai is the source and the English is a translation of it. Where the two
 * disagree the Thai is right. **Paul has not read the English back.**
 *
 * Citations sit on the paragraph whose claim they support. The ELA report
 * carries two claims in two paragraphs, the 98% and the named shortage
 * occupations, so it is cited on both rather than borrowed by one.
 *
 * The illustration is the series' clay figure on a cobbled street, holding a
 * star-headed key up to three front doors, only one of which has a star: the
 * article's claim that skills fit some countries and not others. Made from the
 * prompt in the queue entry, saved in the coaching repo's brand inbox, cut to
 * 1200 x 900 here and to a 1200 x 630 sharing card with the 15% upward bias.
 */
export const HALF_TRUE_EUROPE_NEEDS_TALENT: Post = {
  slug: "half-true-europe-needs-talent",
  topic: "market",
  published: "2026-10-23",

  image: {
    src: "/blog/half-true-europe-needs-talent.jpg",
    // Describes the scene, not the article, like the first article's alt.
    alt: {
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5pbWFnZS5hbHQ:TH%%,
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5pbWFnZS5hbHQ:EN%%,
    },
  },

  title: {
    th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC50aXRsZQ:TH%%,
    en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC50aXRsZQ:EN%%,
  },

  summary: {
    th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zdW1tYXJ5:TH%%,
    en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zdW1tYXJ5:EN%%,
  },

  question: {
    th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5xdWVzdGlvbg:TH%%,
    en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5xdWVzdGlvbg:EN%%,
  },

  sections: [
    {
      body: [
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1swXS5ib2R5WzBdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1swXS5ib2R5WzBdLnRleHQ:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1swXS5ib2R5WzFdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1swXS5ib2R5WzFdLnRleHQ:EN%%,
          },
          cite: { label: "European Commission", href: "https://economy-finance.ec.europa.eu/publications/migration-mobility-and-eu-labour-market-recent-developments_en" },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1swXS5ib2R5WzJdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1swXS5ib2R5WzJdLnRleHQ:EN%%,
          },
        },
      ],
    },
    {
      heading: {
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1sxXS5oZWFkaW5n:TH%%,
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1sxXS5oZWFkaW5n:EN%%,
      },
      body: [
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1sxXS5ib2R5WzBdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1sxXS5ib2R5WzBdLnRleHQ:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1sxXS5ib2R5WzFdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1sxXS5ib2R5WzFdLnRleHQ:EN%%,
          },
          cite: { label: "European Labour Authority", href: "https://www.ela.europa.eu/en/publications/labour-shortages-and-surpluses-europe-2024" },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1sxXS5ib2R5WzJdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1sxXS5ib2R5WzJdLnRleHQ:EN%%,
          },
          cite: { label: "European Labour Authority", href: "https://www.ela.europa.eu/en/publications/labour-shortages-and-surpluses-europe-2024" },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1sxXS5ib2R5WzNdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1sxXS5ib2R5WzNdLnRleHQ:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1sxXS5ib2R5WzRdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1sxXS5ib2R5WzRdLnRleHQ:EN%%,
          },
        },
      ],
    },
    {
      heading: {
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1syXS5oZWFkaW5n:TH%%,
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1syXS5oZWFkaW5n:EN%%,
      },
      body: [
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1syXS5ib2R5WzBdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1syXS5ib2R5WzBdLnRleHQ:EN%%,
          },
        },
        {
          kind: "list",
          items: [
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1syXS5ib2R5WzFdLml0ZW1zWzBd:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1syXS5ib2R5WzFdLml0ZW1zWzBd:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1syXS5ib2R5WzFdLml0ZW1zWzFd:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1syXS5ib2R5WzFdLml0ZW1zWzFd:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1syXS5ib2R5WzFdLml0ZW1zWzJd:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1syXS5ib2R5WzFdLml0ZW1zWzJd:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1syXS5ib2R5WzFdLml0ZW1zWzNd:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1syXS5ib2R5WzFdLml0ZW1zWzNd:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1syXS5ib2R5WzFdLml0ZW1zWzRd:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1syXS5ib2R5WzFdLml0ZW1zWzRd:EN%%,
            },
          ],
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1syXS5ib2R5WzJdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1syXS5ib2R5WzJdLnRleHQ:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1syXS5ib2R5WzNdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1syXS5ib2R5WzNdLnRleHQ:EN%%,
          },
        },
      ],
    },
    {
      heading: {
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1szXS5oZWFkaW5n:TH%%,
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1szXS5oZWFkaW5n:EN%%,
      },
      body: [
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1szXS5ib2R5WzBdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1szXS5ib2R5WzBdLnRleHQ:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1szXS5ib2R5WzFdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1szXS5ib2R5WzFdLnRleHQ:EN%%,
          },
          cite: { label: "Council of the EU", href: "https://www.consilium.europa.eu/en/press/press-releases/2026/03/30/council-gives-final-go-ahead-to-eu-talent-platform-for-non-eu-jobseekers/pdf/" },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1szXS5ib2R5WzJdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1szXS5ib2R5WzJdLnRleHQ:EN%%,
          },
        },
      ],
    },
    {
      heading: {
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1s0XS5oZWFkaW5n:TH%%,
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1s0XS5oZWFkaW5n:EN%%,
      },
      body: [
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1s0XS5ib2R5WzBdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1s0XS5ib2R5WzBdLnRleHQ:EN%%,
          },
        },
        {
          kind: "list",
          ordered: true,
          items: [
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1s0XS5ib2R5WzFdLml0ZW1zWzBd:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1s0XS5ib2R5WzFdLml0ZW1zWzBd:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1s0XS5ib2R5WzFdLml0ZW1zWzFd:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1s0XS5ib2R5WzFdLml0ZW1zWzFd:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1s0XS5ib2R5WzFdLml0ZW1zWzJd:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1s0XS5ib2R5WzFdLml0ZW1zWzJd:EN%%,
            },
            {
              th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1s0XS5ib2R5WzFdLml0ZW1zWzNd:TH%%,
              en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1s0XS5ib2R5WzFdLml0ZW1zWzNd:EN%%,
            },
          ],
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1s0XS5ib2R5WzJdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1s0XS5ib2R5WzJdLnRleHQ:EN%%,
          },
        },
        {
          kind: "p",
          text: {
            th: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1s0XS5ib2R5WzNdLnRleHQ:TH%%,
            en: %%LANG:c3JjL2xpYi9jb250ZW50L3Bvc3RzL2hhbGYtdHJ1ZS1ldXJvcGUtbmVlZHMtdGFsZW50LnRzOjpIQUxGX1RSVUVfRVVST1BFX05FRURTX1RBTEVOVC5zZWN0aW9uc1s0XS5ib2R5WzNdLnRleHQ:EN%%,
          },
        },
      ],
    },
  ],
};
