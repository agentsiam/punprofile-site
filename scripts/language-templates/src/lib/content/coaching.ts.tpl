import type { Copy } from "./copy";

/**
 * The 1-1 coaching page. TASK-089, rewritten 14/08/2026 from Paul's own Thai.
 *
 * The structure came from a competitor's landing page (Careersu, ANZ tech
 * coaching), whose insight is that the founder section is not a page but the
 * LAST section of a sales page, reached by a reader already persuaded. The
 * words are now Paul's, supplied in Thai; the English is a translation of his
 * Thai rather than the reverse, which is the right direction for a Thai-first
 * product.
 *
 * Order: name the mechanism the reader is losing to, show they are not alone in
 * it, show the machine, say who it is and is not for, then say who is behind it.
 *
 * The founder section carried a `COACHING_REVIEWED` draft gate until Paul
 * supplied his own words on 14/08/2026. The gate and its banner are gone rather
 * than left switched on: a flag nothing reads is a flag that will be wrong one
 * day without anyone noticing. It existed because no biography lived anywhere
 * in the coaching repo to build one from, and inventing it was the one thing
 * that would have made every other honest claim on this site worthless.
 *
 * **The proof numbers are never written here.** Every figure on this page comes
 * from `convex/stats.ts` at render, each one disappears on its own if its
 * sample is too thin, and none is hard-coded. That is the only reason a page
 * whose competitor fills these slots with client logos and placement rates can
 * make a stronger claim than they do: the reader is one of the people counted.
 */

// ------------------------------------------------------------------- the hook

export const HOOK_EYEBROW: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpIT09LX0VZRUJST1c:EN%%,
  // Read back 25/08/2026. `Career Coaching` for `แคเรียร์โค้ชชิ่ง`.
  th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpIT09LX0VZRUJST1c:TH%%,
};

/**
 * Two lines, the second in Teal.
 *
 * `design.md` reserves Terracotta for the single primary action on a screen so
 * it keeps its persuasive weight, and a headline in the button colour spends
 * exactly that. Teal is the colour the brand is known by and carries emphasis
 * everywhere that is not a button.
 */
export const HOOK_LINE_1: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpIT09LX0xJTkVfMQ:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpIT09LX0xJTkVfMQ:TH%%,
};

export const HOOK_LINE_2: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpIT09LX0xJTkVfMg:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpIT09LX0xJTkVfMg:TH%%,
};

export const HOOK_BODY: readonly Copy[] = [
  {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpIT09LX0JPRFlbMF0:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpIT09LX0JPRFlbMF0:TH%%,
  },
  {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpIT09LX0JPRFlbMV0:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpIT09LX0JPRFlbMV0:TH%%,
  },
];

export const HOOK_CTA_SUB: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpIT09LX0NUQV9TVUI:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpIT09LX0NUQV9TVUI:TH%%,
};

// --------------------------------------------------------- does this sound like you

export const PAIN_HEADING: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQQUlOX0hFQURJTkc:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQQUlOX0hFQURJTkc:TH%%,
};

export const PAINS: readonly Copy[] = [
  {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQQUlOU1swXQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQQUlOU1swXQ:TH%%,
  },
  {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQQUlOU1sxXQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQQUlOU1sxXQ:TH%%,
  },
  {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQQUlOU1syXQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQQUlOU1syXQ:TH%%,
  },
  {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQQUlOU1szXQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQQUlOU1szXQ:TH%%,
  },
  {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQQUlOU1s0XQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQQUlOU1s0XQ:TH%%,
  },
  {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQQUlOU1s1XQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQQUlOU1s1XQ:TH%%,
  },
];

// --------------------------------------------------------------- the proof panel

export const PROOF_HEADING: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQUk9PRl9IRUFESU5H:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQUk9PRl9IRUFESU5H:TH%%,
};

export interface ProofLine {
  /** Key in the `shares` object returned by `stats.community`. */
  share: string;
  label: Copy;
}

export const PROOF_LINES: readonly ProofLine[] = [
  {
    // "Started" rather than "five or more", 14/08/2026. See the note on
    // `appliedAny` in `convex/stats.ts`: the volume figure came out at 22% and
    // argued against the heading above it. The claim this panel is making is
    // that these people are already in motion, which is what this measures.
    share: "appliedAny",
    label: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQUk9PRl9MSU5FU1swXS5sYWJlbA:EN%%,
      th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQUk9PRl9MSU5FU1swXS5sYWJlbA:TH%%,
    },
  },
  {
    share: "englishB2",
    label: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQUk9PRl9MSU5FU1sxXS5sYWJlbA:EN%%,
      th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQUk9PRl9MSU5FU1sxXS5sYWJlbA:TH%%,
    },
  },
  {
    share: "cvNotForEurope",
    label: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQUk9PRl9MSU5FU1syXS5sYWJlbA:EN%%,
      th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQUk9PRl9MSU5FU1syXS5sYWJlbA:TH%%,
    },
  },
];

export const PROOF_FOOT: Copy = {
  // No sample size. See the note on the return value in `convex/stats.ts`: how
  // many people have taken the check is PunProfile's own information, so the
  // footnote says who was counted and not how many.
  en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQUk9PRl9GT09U:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQUk9PRl9GT09U:TH%%,
};

export const PROOF_CONCLUSION: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQUk9PRl9DT05DTFVTSU9O:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQUk9PRl9DT05DTFVTSU9O:TH%%,
};

// ------------------------------------------------------------------ the machine

export const METHOD_HEADING: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpNRVRIT0RfSEVBRElORw:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpNRVRIT0RfSEVBRElORw:TH%%,
};

export const METHOD_INTRO: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpNRVRIT0RfSU5UUk8:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpNRVRIT0RfSU5UUk8:TH%%,
};

export interface MethodStep {
  n: string;
  heading: Copy;
  /** Paragraphs, in order. Two of the four steps need a second one. */
  body: readonly Copy[];
}

export const METHOD: readonly MethodStep[] = [
  {
    n: "01",
    heading: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpNRVRIT0RbMF0uaGVhZGluZw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpNRVRIT0RbMF0uaGVhZGluZw:TH%% },
    body: [
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpNRVRIT0RbMF0uYm9keVswXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpNRVRIT0RbMF0uYm9keVswXQ:TH%%,
      },
    ],
  },
  {
    n: "02",
    heading: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpNRVRIT0RbMV0uaGVhZGluZw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpNRVRIT0RbMV0uaGVhZGluZw:TH%% },
    body: [
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpNRVRIT0RbMV0uYm9keVswXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpNRVRIT0RbMV0uYm9keVswXQ:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpNRVRIT0RbMV0uYm9keVsxXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpNRVRIT0RbMV0uYm9keVsxXQ:TH%%,
      },
    ],
  },
  {
    n: "03",
    heading: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpNRVRIT0RbMl0uaGVhZGluZw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpNRVRIT0RbMl0uaGVhZGluZw:TH%% },
    body: [
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpNRVRIT0RbMl0uYm9keVswXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpNRVRIT0RbMl0uYm9keVswXQ:TH%%,
      },
    ],
  },
  {
    n: "04",
    heading: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpNRVRIT0RbM10uaGVhZGluZw:EN%%,
      th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpNRVRIT0RbM10uaGVhZGluZw:TH%%,
    },
    body: [
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpNRVRIT0RbM10uYm9keVswXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpNRVRIT0RbM10uYm9keVswXQ:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpNRVRIT0RbM10uYm9keVsxXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpNRVRIT0RbM10uYm9keVsxXQ:TH%%,
      },
    ],
  },
];

// -------------------------------------------------------------- who this is for

export const PERSONA_HEADING: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQRVJTT05BX0hFQURJTkc:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQRVJTT05BX0hFQURJTkc:TH%%,
};

export const PERSONAS: readonly Copy[] = [
  {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQRVJTT05BU1swXQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQRVJTT05BU1swXQ:TH%%,
  },
  {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQRVJTT05BU1sxXQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQRVJTT05BU1sxXQ:TH%%,
  },
  {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQRVJTT05BU1syXQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQRVJTT05BU1syXQ:TH%%,
  },
  {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQRVJTT05BU1szXQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQRVJTT05BU1szXQ:TH%%,
  },
];

export const NOT_FOR_HEADING: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpOT1RfRk9SX0hFQURJTkc:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpOT1RfRk9SX0hFQURJTkc:TH%%,
};

export const NOT_FOR: readonly Copy[] = [
  {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpOT1RfRk9SWzBd:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpOT1RfRk9SWzBd:TH%%,
  },
  {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpOT1RfRk9SWzFd:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpOT1RfRk9SWzFd:TH%%,
  },
  {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpOT1RfRk9SWzJd:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpOT1RfRk9SWzJd:TH%%,
  },
];

// ------------------------------------------------------------------ the founder

export const FOUNDER_HEADING: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpGT1VOREVSX0hFQURJTkc:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpGT1VOREVSX0hFQURJTkc:TH%%,
};

/** Before the turn. What he sees, and why it happens. */
export const FOUNDER_BEFORE: readonly Copy[] = [
  {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpGT1VOREVSX0JFRk9SRVswXQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpGT1VOREVSX0JFRk9SRVswXQ:TH%%,
  },
  {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpGT1VOREVSX0JFRk9SRVsxXQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpGT1VOREVSX0JFRk9SRVsxXQ:TH%%,
  },
  {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpGT1VOREVSX0JFRk9SRVsyXQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpGT1VOREVSX0JFRk9SRVsyXQ:TH%%,
  },
  {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpGT1VOREVSX0JFRk9SRVszXQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpGT1VOREVSX0JFRk9SRVszXQ:TH%%,
  },
];

/** The hinge of the section, set apart from the paragraphs on either side. */
export const FOUNDER_TURN: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpGT1VOREVSX1RVUk4:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpGT1VOREVSX1RVUk4:TH%%,
};

/** After the turn. What he does about it, and what he will not do. */
export const FOUNDER_AFTER: readonly Copy[] = [
  {
    // Read back 06/09/2026, and `ผม` to `เรา` held.
    // What coaching is, is a claim about the method and never was Paul's
    // opinion, so it moves to the shared voice cleanly. See
    // `founder-section-we.md` for which paragraphs could not.
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpGT1VOREVSX0FGVEVSWzBd:EN%%,
    // Paul's wording, 06/09/2026, and the read-back this comment was asking for.
    // The worry it recorded was real: the term had been swapped and not a word
    // around it, and an English phrase dropped into the middle of his Thai is
    // the kind of change that is right as a rule and wrong in a particular
    // voice. He rewrote the sentence around it rather than accepting the swap:
    // `เขียนเรื่องใหม่` became `แต่งเรื่องใหม่`, `ดูเก่งกว่า` became `ดูดีกว่า`,
    // and the closing clause reads `คนในตลาดอื่น` rather than `คนอีกตลาด`.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpGT1VOREVSX0FGVEVSWzBd:TH%%,
  },
  {
    // Read back 06/09/2026, and `ผม` to `เรา` held.
    // The minimum change. This paragraph is the one Dew changes most and not by
    // wording: ten years in US placement means one of them did the recruiting
    // job before choosing not to do it here. That is his to write.
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpGT1VOREVSX0FGVEVSWzFd:EN%%,
    // Paul's wording, 06/09/2026. `นายหน้าจัดหางาน` became `บริษัทจัดหางาน`,
    // which is the form the published disclaimer in `footer.ts` already uses, so
    // the page and the legal line now name the same thing. Both quoted questions
    // were opened out: "อะไรเหมาะกับคุณ" to "งานแบบไหนเหมาะกับคุณ", and
    // "จะนำคุณไปใส่ในตำแหน่งไหนได้บ้าง" to
    // "มีตำแหน่งว่างไหนที่เราจะส่งคุณเข้าไปได้บ้าง".
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpGT1VOREVSX0FGVEVSWzFd:TH%%,
  },
  {
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpGT1VOREVSX0FGVEVSWzJd:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpGT1VOREVSX0FGVEVSWzJd:TH%%,
  },
  {
    // Read back 06/09/2026, and `ผม` to `เรา` held.
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpGT1VOREVSX0FGVEVSWzNd:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpGT1VOREVSX0FGVEVSWzNd:TH%%,
  },
];

// ------------------------------------------------------------------- the close

export const CLOSE_LEAD: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpDTE9TRV9MRUFE:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpDTE9TRV9MRUFE:TH%%,
};

/** Alt text. Describes what the picture shows, not what the brand means by it. */
export const MASCOT_ALT: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpNQVNDT1RfQUxU:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpNQVNDT1RfQUxU:TH%%,
};

export const PORTRAIT_ALT: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQT1JUUkFJVF9BTFQ:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvYWNoaW5nLnRzOjpQT1JUUkFJVF9BTFQ:TH%%,
};
