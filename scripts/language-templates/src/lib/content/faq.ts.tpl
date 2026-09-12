import type { Copy } from "./copy";

/**
 * The FAQ. TASK-087, rewritten 14/08/2026 from Paul's own Thai.
 *
 * Every answer here is checkable against something that already exists: the
 * privacy notice for anything about data, `self-report-scoring.md` for anything
 * about the chart, `01_Project_Foundation.md` for anything about the services.
 * That constraint is the point of the page. An FAQ is where a brand quietly
 * starts making claims nobody reviewed, because each answer looks too small to
 * need checking, and a hundred small unreviewed claims is a bigger liability
 * than one long page that went through legal.
 *
 * So: no timelines we have not committed to, no success rates, no "most of our
 * clients", and no price. The cost question is answered by saying where it gets
 * answered, which is true and stays true when the pilot pricing settles.
 *
 * The voice is first person singular, matching the coaching page: this is one
 * person answering, not a company. Paul's Thai is the source and the English is
 * a translation of it.
 */
export interface FaqItem {
  q: Copy;
  /** Paragraphs, in order. */
  a: Copy[];
  /** Renders an inline link at the end of the answer. */
  link?: { href: string; label: Copy };
}

export const FAQ_HEADING: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRX0hFQURJTkc:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRX0hFQURJTkc:TH%%,
};

export const FAQ_INTRO: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRX0lOVFJP:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRX0lOVFJP:TH%%,
};

export const FAQ_CLOSE: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRX0NMT1NF:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRX0NMT1NF:TH%%,
};

export const FAQ: readonly FaqItem[] = [
  {
    q: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzBdLnE:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzBdLnE:TH%% },
    a: [
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzBdLmFbMF0:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzBdLmFbMF0:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzBdLmFbMV0:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzBdLmFbMV0:TH%%,
      },
    ],
  },
  {
    q: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzFdLnE:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzFdLnE:TH%% },
    a: [
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzFdLmFbMF0:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzFdLmFbMF0:TH%%,
      },
    ],
  },
  {
    q: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzJdLnE:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzJdLnE:TH%% },
    a: [
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzJdLmFbMF0:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzJdLmFbMF0:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzJdLmFbMV0:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzJdLmFbMV0:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzJdLmFbMl0:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzJdLmFbMl0:TH%%,
      },
    ],
  },
  {
    q: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzNdLnE:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzNdLnE:TH%% },
    a: [
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzNdLmFbMF0:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzNdLmFbMF0:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzNdLmFbMV0:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzNdLmFbMV0:TH%%,
      },
    ],
  },
  {
    q: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzRdLnE:EN%%,
      th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzRdLnE:TH%%,
    },
    a: [
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzRdLmFbMF0:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzRdLmFbMF0:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzRdLmFbMV0:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzRdLmFbMV0:TH%%,
      },
    ],
  },
  {
    q: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzVdLnE:EN%%,
      th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzVdLnE:TH%%,
    },
    a: [
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzVdLmFbMF0:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzVdLmFbMF0:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzVdLmFbMV0:EN%%,
        // Read back 25/08/2026. `Career Coaching` for `แคเรียร์โค้ชชิ่ง`.
        th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzVdLmFbMV0:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzVdLmFbMl0:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzVdLmFbMl0:TH%%,
      },
    ],
    link: {
      href: "/coaching",
      label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzVdLmxpbmsubGFiZWw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzVdLmxpbmsubGFiZWw:TH%% },
    },
  },
  {
    // Paul's rewrite, 23/08/2026, from the pricing review sheet. Applied here
    // too so one question is not answered two ways on two pages.
    q: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzZdLnE:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzZdLnE:TH%% },
    a: [
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzZdLmFbMF0:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzZdLmFbMF0:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzZdLmFbMV0:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzZdLmFbMV0:TH%%,
      },
    ],
  },
  {
    q: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzddLnE:EN%%,
      th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzddLnE:TH%%,
    },
    a: [
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzddLmFbMF0:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzddLmFbMF0:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzddLmFbMV0:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzddLmFbMV0:TH%%,
      },
    ],
  },
  {
    q: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzhdLnE:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzhdLnE:TH%% },
    a: [
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzhdLmFbMF0:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzhdLmFbMF0:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzhdLmFbMV0:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzhdLmFbMV0:TH%%,
      },
    ],
  },
  {
    q: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzldLnE:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzldLnE:TH%% },
    a: [
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzldLmFbMF0:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzldLmFbMF0:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzldLmFbMV0:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzldLmFbMV0:TH%%,
      },
    ],
    link: {
      href: "/privacy",
      label: { en: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzldLmxpbmsubGFiZWw:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2ZhcS50czo6RkFRWzldLmxpbmsubGFiZWw:TH%% },
    },
  },
];
