import type { Copy } from "./copy";
import { POSTS } from "./blog";
import { DESTINATIONS } from "./cta";

/**
 * **Thai wording passed by Paul, 15/08/2026**, in the review of all shipped Thai.
 *
 * The footer. TASK-091, 14/08/2026.
 *
 * Modelled on a competitor's (Careersu AI), whose structure is worth taking:
 * a wide left block that gives a reason to stay in touch, link columns grouped
 * by what a reader came for rather than by site structure, then a rule, then
 * the legal paragraph, then the fine print. The grouping is the good part. Most
 * footers list every page in one flat row, which tells a reader nothing about
 * which of them is for them.
 *
 * **What was NOT taken: the newsletter capture.** Theirs leads with an email
 * field and "one insight a week". PunProfile has no newsletter, no sending
 * infrastructure and no consent copy covering a marketing list, and a field
 * that collects an email address under PDPA without a lawful basis is a
 * compliance problem rather than a design flourish.
 *
 * What went in its place was a paragraph about the Facebook presence, and that
 * is retired too, 17/08/2026: see the note where `FOLLOW_BODY` used to be. The
 * left block is now the logo, a label and a link, which is what a footer owes.
 * **The lesson is the one the newsletter note already had**, applied a step
 * further: the answer to an empty slot is a smaller block, not a different
 * thing to sell in it.
 *
 * **The legal paragraph is the other thing worth copying.** Theirs names what
 * they are not: not migration agents, no guarantee of employment. Ours says the
 * same because the same is true, and because it is already what the FAQ and the
 * coaching page tell people. A disclaimer that repeats what the rest of the
 * site already says is a disclaimer nobody can call a surprise.
 */

/**
 * Eyebrow type. Tracked and uppercased in English, neither in Thai.
 *
 * `letter-spacing` is a Latin device. Thai is written without word spaces and
 * relies on the eye grouping clusters of a base character with its vowels and
 * tone marks stacked around it; pushing the bases apart makes those clusters
 * ambiguous and the line harder to read, not more emphatic. `text-transform:
 * uppercase` does nothing at all to Thai script, so in Thai the whole treatment
 * would be pure cost.
 *
 * Caught by rendering the footer in Thai before shipping it rather than after,
 * which is the only reason it was visible: in English the same class is exactly
 * right, and that is what makes this class of mistake survive review.
 *
 * So the eyebrow is distinguished by size, weight and colour in both languages,
 * and by tracking in English only.
 */
export const EYEBROW = (locale: string) =>
  locale === "th"
    ? "text-body-medium font-semibold"
    : "text-body-medium font-semibold uppercase tracking-[0.14em]";

/**
 * The two heading tiers, per script. 25/08/2026, with the `wise-1` system.
 *
 * The system has three families and only one of them carries Thai, so a single
 * class cannot serve both scripts here the way `EYEBROW` nearly does. Latin
 * takes the brand's own metrics: `display-*` is Archivo at 900 on a line box
 * 0.85 of the size, and `headline-*` is Inter at 600 with 3% negative tracking.
 * Thai takes Anuphan on a line box nearly 1.4 of the size, because an 0.85 box
 * clips tone marks and vowels outright.
 *
 * So these are the same two jobs, sized and led differently per script, and a
 * page names the job rather than the class.
 */
export const HERO_HEADING = (locale: string) =>
  locale === "th" ? "text-thai-display" : "text-display-lg";

export const SECTION_HEADING = (locale: string) =>
  locale === "th" ? "text-thai-headline" : "text-headline-lg";

export interface FooterLink {
  href: string;
  label: Copy;
  external?: boolean;
}

export interface FooterColumn {
  heading: Copy;
  links: readonly FooterLink[];
}

/**
 * The Facebook Page, supplied by Paul 14/08/2026.
 *
 * The Page, and deliberately not the งานบริษัทในยุโรป group: Paul's instruction
 * the same day was not to publish the group's URL, and it is not recorded
 * anywhere in the coaching repo in any case. Nothing on this site links to it,
 * and no placeholder stands in for it.
 *
 * This is a follow link, not a contact channel. Public contact is LINE and
 * email only, which is why Facebook is absent from the Contact column below.
 */
export const FACEBOOK_PAGE = "https://www.facebook.com/punprofile";

export const FOLLOW_EYEBROW: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L2Zvb3Rlci50czo6Rk9MTE9XX0VZRUJST1c:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2Zvb3Rlci50czo6Rk9MTE9XX0VZRUJST1c:TH%% };

/**
 * The label on the Facebook button. Moved here 06/09/2026.
 *
 * It was written inline in `SiteFooter.tsx` as a ternary on the locale, which
 * is what R49 forbids and for a reason this string demonstrates: it sits in the
 * chrome of every page on the site and `verify:copy` had never read it, so
 * nothing checked its Thai against the termbase or noticed if one column went
 * missing. Wording unchanged; only where it lives is.
 */
export const FOLLOW_LABEL: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L2Zvb3Rlci50czo6Rk9MTE9XX0xBQkVM:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L2Zvb3Rlci50czo6Rk9MTE9XX0xBQkVM:TH%%,
};

/*
 * `FOLLOW_BODY` was here and is retired, 17/08/2026, on Paul: "it does not make
 * sense, we're not promoting the FB group on the web app."
 *
 * Worth recording properly, because the line was wrong twice in three days for
 * two different reasons and only the second one is the real one.
 *
 * It began as a description of the Facebook Group's free job posts sitting above
 * a link to the Facebook Page. `Content_Strategy.md` § Channels has said since
 * 11/07/2026 that those are different surfaces carrying different pillars: the
 * Group has Job Trend and How-Tos, the Page has Thought Leadership, How-Tos and
 * Social Proof. A note on 14/08/2026 claimed to have fixed exactly that and had
 * only changed the reasoning. Rewritten on 17/08/2026 to describe the Page.
 *
 * **Then retired the same day, which supersedes all of it.** The app does not
 * advertise Facebook. A paragraph selling a channel is a paragraph the footer
 * does not owe anyone, and the question of which Facebook surface it described
 * stops mattering once there is no paragraph.
 *
 * `FOLLOW_EYEBROW` and the Facebook button below it stay. A labelled link is a
 * link; it was the sales copy under it that had no business being there.
 * `FACEBOOK_PAGE` also stays: `SiteShell` reads it for the organisation's
 * `sameAs` in JSON-LD, which is a machine-readable fact about who we are rather
 * than a promotion.
 */

/**
 * Three columns, grouped by what the reader wants rather than by route.
 * Everything here already exists; a footer is the worst place to discover a
 * link to a page nobody built.
 */
export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    heading: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2Zvb3Rlci50czo6Rk9PVEVSX0NPTFVNTlNbMF0uaGVhZGluZw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2Zvb3Rlci50czo6Rk9PVEVSX0NPTFVNTlNbMF0uaGVhZGluZw:TH%% },
    links: [
      { href: "/efc-assessment", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2Zvb3Rlci50czo6Rk9PVEVSX0NPTFVNTlNbMF0ubGlua3NbMF0ubGFiZWw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2Zvb3Rlci50czo6Rk9PVEVSX0NPTFVNTlNbMF0ubGlua3NbMF0ubGFiZWw:TH%% } },
      /*
       * `/method`, 26/08/2026, and this column rather than another. The page is
       * how the check decides what it decides, so it belongs beside the check
       * and above the questions people ask about it.
       *
       * Read back 06/09/2026. on the label, like everything else on that page.
       */
      { href: "/method", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2Zvb3Rlci50czo6Rk9PVEVSX0NPTFVNTlNbMF0ubGlua3NbMV0ubGFiZWw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2Zvb3Rlci50czo6Rk9PVEVSX0NPTFVNTlNbMF0ubGlua3NbMV0ubGFiZWw:TH%% } },
      { href: "/faq", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2Zvb3Rlci50czo6Rk9PVEVSX0NPTFVNTlNbMF0ubGlua3NbMl0ubGFiZWw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2Zvb3Rlci50czo6Rk9PVEVSX0NPTFVNTlNbMF0ubGlua3NbMl0ubGFiZWw:TH%% } },
    ],
  },
  {
    // Read back 25/08/2026. `Career Coaching` for `แคเรียร์โค้ชชิ่ง`. The English
    // column keeps the short "Coaching": it heads a column whose first link is
    // already called Coaching 1:1, and the full name twice in four words reads
    // as a mistake rather than as emphasis.
    heading: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2Zvb3Rlci50czo6Rk9PVEVSX0NPTFVNTlNbMV0uaGVhZGluZw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2Zvb3Rlci50czo6Rk9PVEVSX0NPTFVNTlNbMV0uaGVhZGluZw:TH%% },
    links: [
      { href: "/coaching", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2Zvb3Rlci50czo6Rk9PVEVSX0NPTFVNTlNbMV0ubGlua3NbMF0ubGFiZWw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2Zvb3Rlci50czo6Rk9PVEVSX0NPTFVNTlNbMV0ubGlua3NbMF0ubGFiZWw:TH%% } },
      /*
       * "Our Services" pointed at `/services` until 23/08/2026 and was retargeted
       * with everything else when that route folded into `/coaching`. That made
       * it the second link in this column to the same page, which React caught
       * as a duplicate key before anyone read the column.
       *
       * Removed rather than deduplicated by giving it a different key. Two
       * labels for one destination in one footer column is a reader being told
       * there are two things behind them, and the fold means there is one.
       * `/pricing` takes the slot, which is the page the column was missing.
       */
      { href: "/pricing", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2Zvb3Rlci50czo6Rk9PVEVSX0NPTFVNTlNbMV0ubGlua3NbMV0ubGFiZWw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2Zvb3Rlci50czo6Rk9PVEVSX0NPTFVNTlNbMV0ubGlua3NbMV0ubGFiZWw:TH%% } },
      // The blog, added 16/08/2026, and this column rather than a fourth one.
      //
      // The grid beside this is three columns wide and a fourth would rebuild
      // the footer for one link. Of the three, this is the one it belongs to:
      // `Content_Strategy.md` files written content as demand generation for the
      // coaching business, and the articles are that business's point of view in
      // public. It reads oddly under a heading that says Coaching, which is the
      // cost of not having a "Read" column, and is worth revisiting when there
      // is enough here to justify one.
      //
      // Absent until the blog has an article, same gate and same reason as the
      // menu entry in `nav.ts`. This file's own note above says a footer is the
      // worst place to discover a link to a page nobody built, and a page built
      // with nothing on it is the same discovery.
      ...(POSTS.length > 0
        ? [{ href: "/blog", label: { en: "Blog", th: "Blog" } }]
        : []),
    ],
  },
  {
    // LINE and email only, Paul's call 14/08/2026. Facebook came out: it is
    // somewhere to follow us, not somewhere to reach us, and listing it here
    // promised a reply on a channel nobody watches for one. It keeps its place
    // in the Follow block above.
    heading: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2Zvb3Rlci50czo6Rk9PVEVSX0NPTFVNTlNbMl0uaGVhZGluZw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2Zvb3Rlci50czo6Rk9PVEVSX0NPTFVNTlNbMl0uaGVhZGluZw:TH%% },
    links: [
      { href: "/contact", label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2Zvb3Rlci50czo6Rk9PVEVSX0NPTFVNTlNbMl0ubGlua3NbMF0ubGFiZWw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2Zvb3Rlci50czo6Rk9PVEVSX0NPTFVNTlNbMl0ubGlua3NbMF0ubGFiZWw:TH%% } },
      { href: DESTINATIONS.line.href, label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2Zvb3Rlci50czo6Rk9PVEVSX0NPTFVNTlNbMl0ubGlua3NbMV0ubGFiZWw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2Zvb3Rlci50czo6Rk9PVEVSX0NPTFVNTlNbMl0ubGlua3NbMV0ubGFiZWw:TH%% }, external: true },
      {
        href: DESTINATIONS.email.href,
        label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2Zvb3Rlci50czo6Rk9PVEVSX0NPTFVNTlNbMl0ubGlua3NbMl0ubGFiZWw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2Zvb3Rlci50czo6Rk9PVEVSX0NPTFVNTlNbMl0ubGlua3NbMl0ubGFiZWw:TH%% },
        external: true,
      },
    ],
  },
];

/**
 * What PunProfile is not.
 *
 * Every clause here is already stated somewhere a reader can check: the "no
 * guarantee" line is the FAQ's answer and the coaching page's who-this-is-not-
 * for list, and the "paid by you, not an employer" line is in both. The visa
 * clause is new here and is the one that most needs saying, because relocation
 * coaching sits close enough to immigration advice that a reader can reasonably
 * assume it includes it. It does not.
 */
export const DISCLAIMER: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L2Zvb3Rlci50czo6RElTQ0xBSU1FUg:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L2Zvb3Rlci50czo6RElTQ0xBSU1FUg:TH%%,
};
