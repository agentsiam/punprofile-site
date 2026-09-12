import type { Copy } from "./copy";

/**
 * What PunProfile sells. TASK-084, rewritten 14/08/2026 from Paul's own Thai.
 *
 * Source of truth for the structure is `01_Project_Foundation.md` -> Core
 * Offerings: a hybrid, where Career Coaching is the engagement everyone starts
 * with and the other two also sell standalone. **The words are now Paul's**,
 * supplied in Thai; the English is a translation of his Thai rather than the
 * other way round, which is the correct direction for a Thai-first product and
 * a change from the first version of this file.
 *
 * **Still no prices.** `01_Project_Foundation.md` heads its table "Pricing
 * (pilot hypothesis)" and says in as many words that the ranges are a starting
 * point to pilot with real leads, with a validation plan still open. A public
 * page is where a hypothesis stops being one: whatever is printed here is what
 * the next caller has already anchored on. Paul's copy does not mention price
 * either, so the page ends on a conversation. This comment is the thing to
 * delete first when the pilot closes.
 *
 * **The three illustrations became photographs on 17/08/2026**, on Paul's call:
 * `pp_mascot_steping`, `pp_mascot_cv_laptop` and `pp_mascot_magnifying` from the
 * brand assets inbox. They are studio renders of the mascot rather than flat art,
 * which is why `wash` went with them; see the note on `image` below.
 *
 * All three were cover-cropped to 4:3 and re-encoded at build time, 1200x900 at
 * quality 82, which took them from 0.5-1.7MB each to 58-85KB. The crop is decided
 * once in the asset rather than on every render.
 */

export type ServiceId = "coaching" | "profile" | "applications";

export interface Service {
  id: ServiceId;
  /** True for the engagement every client starts with. */
  core: boolean;
  name: Copy;
  /** The client's question, in their words. */
  question: Copy;
  summary: Copy;
  includes: Copy[];
  /**
   * Public path to the photograph for this service.
   *
   * **`wash` is gone, 17/08/2026.** It held the exact colour each illustration
   * was drawn on, so the panel behind it could be painted to match and the image
   * would have no visible edge. That was right for flat art on a single colour
   * and is wrong for what replaced it: these are studio renders on a soft grey
   * with a gradient and a cast shadow, so there is no colour to match and a panel
   * painted to the average would seam wherever the backdrop falls away. The image
   * fills its band edge to edge instead.
   */
  image: { src: string; alt: Copy };
  /**
   * The chart axis this service answers, so the result screen can open the page
   * on the card a candidate's own chart points at. A low score here is a reason
   * to read this card first, never a diagnosis that it is the only one.
   */
  answers: "professionalCapability" | "employability" | "mobilityReadiness" | "europeanMarketFit";
}

export const SERVICES_HEADING: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19IRUFESU5H:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19IRUFESU5H:TH%%,
};

export const SERVICES_INTRO: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19JTlRSTw:EN%%,
  // Read back 25/08/2026. `Career Coaching` for `แคเรียร์โค้ชชิ่ง`.
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19JTlRSTw:TH%%,
};

export const SERVICES: readonly Service[] = [
  {
    id: "coaching",
    core: true,
    // Read back 25/08/2026. Both columns now read `Career Coaching`, which
    // is what LR-01 does with a service name once the name is English.
    name: { en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1swXS5uYW1l:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1swXS5uYW1l:TH%% },
    question: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1swXS5xdWVzdGlvbg:EN%%,
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1swXS5xdWVzdGlvbg:TH%%,
    },
    summary: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1swXS5zdW1tYXJ5:EN%%,
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1swXS5zdW1tYXJ5:TH%%,
    },
    includes: [
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1swXS5pbmNsdWRlc1swXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1swXS5pbmNsdWRlc1swXQ:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1swXS5pbmNsdWRlc1sxXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1swXS5pbmNsdWRlc1sxXQ:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1swXS5pbmNsdWRlc1syXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1swXS5pbmNsdWRlc1syXQ:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1swXS5pbmNsdWRlc1szXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1swXS5pbmNsdWRlc1szXQ:TH%%,
      },
      // Added 17/08/2026 (Paul). The sessions were always in English; saying so
      // turns a fact about how the service runs into a reason to buy it, since
      // the interview this audience is preparing for is in English too.
      //
      // EN-FIRST, which is the wrong direction for this file: its header records
      // that the words are Paul's Thai and the English is the translation. This
      // one arrived in English, so the Thai below is mine and awaits his pass.
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1swXS5pbmNsdWRlc1s0XQ:EN%%,
        // Paul's wording, 17/08/2026. `เป็นหลัก` added, and it is a promise being
        // made accurate rather than softened: sessions are mainly in English, and a
        // flat claim that they ARE in English is one a Thai reader could hold
        // against the first session that switches.
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1swXS5pbmNsdWRlc1s0XQ:TH%%,
      },
    ],
    image: {
      src: "/services/direction.jpg",
      alt: {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1swXS5pbWFnZS5hbHQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1swXS5pbWFnZS5hbHQ:TH%%,
      },
    },
    answers: "mobilityReadiness",
  },
  {
    id: "profile",
    core: false,
    name: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1sxXS5uYW1l:EN%%,
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1sxXS5uYW1l:TH%%,
    },
    question: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1sxXS5xdWVzdGlvbg:EN%%,
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1sxXS5xdWVzdGlvbg:TH%%,
    },
    summary: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1sxXS5zdW1tYXJ5:EN%%,
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1sxXS5zdW1tYXJ5:TH%%,
    },
    includes: [
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1sxXS5pbmNsdWRlc1swXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1sxXS5pbmNsdWRlc1swXQ:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1sxXS5pbmNsdWRlc1sxXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1sxXS5pbmNsdWRlc1sxXQ:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1sxXS5pbmNsdWRlc1syXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1sxXS5pbmNsdWRlc1syXQ:TH%%,
      },
    ],
    image: {
      src: "/services/profile.jpg",
      alt: {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1sxXS5pbWFnZS5hbHQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1sxXS5pbWFnZS5hbHQ:TH%%,
      },
    },
    answers: "employability",
  },
  {
    id: "applications",
    core: false,
    name: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1syXS5uYW1l:EN%%,
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1syXS5uYW1l:TH%%,
    },
    question: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1syXS5xdWVzdGlvbg:EN%%,
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1syXS5xdWVzdGlvbg:TH%%,
    },
    summary: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1syXS5zdW1tYXJ5:EN%%,
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1syXS5zdW1tYXJ5:TH%%,
    },
    includes: [
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1syXS5pbmNsdWRlc1swXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1syXS5pbmNsdWRlc1swXQ:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1syXS5pbmNsdWRlc1sxXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1syXS5pbmNsdWRlc1sxXQ:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1syXS5pbmNsdWRlc1syXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1syXS5pbmNsdWRlc1syXQ:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1syXS5pbmNsdWRlc1szXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1syXS5pbmNsdWRlc1szXQ:TH%%,
      },
    ],
    image: {
      src: "/services/applications.jpg",
      alt: {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1syXS5pbWFnZS5hbHQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU1syXS5pbWFnZS5hbHQ:TH%%,
      },
    },
    answers: "europeanMarketFit",
  },
];

/** AI runs through all three rather than being a fourth product. */
export const AI_NOTE: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpBSV9OT1RF:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpBSV9OT1RF:TH%%,
};

export const CORE_BADGE: Copy = { en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpDT1JFX0JBREdF:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpDT1JFX0JBREdF:TH%% };

/**
 * The line on the card a candidate's own result points at. Moved here
 * 06/09/2026.
 *
 * It was an inline `pick({ en, th })` literal inside `ServiceCards.tsx`, which
 * is what R49 forbids: a candidate-facing string outside `src/lib/content/` is
 * a string `verify:pages` never harvests, so its Thai is unlinted and a missing
 * column is invisible. It only renders on a `?focus=` arrival, which is the
 * least-viewed state on the page and therefore the least likely place for
 * anyone to notice. Wording unchanged.
 */
export const FOCUS_NOTE: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpGT0NVU19OT1RF:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpGT0NVU19OT1RF:TH%%,
};

/** The result screen's lowest axis picks the card to open on. */
export function serviceForDimension(dimension: string): ServiceId {
  const hit = SERVICES.find((s) => s.answers === dimension);
  // Professional Capability has no service of its own on purpose: it is what
  // the coaching conversation reads rather than what a module fixes, so it
  // falls through to the core engagement, which is also the honest answer for
  // anything unrecognised.
  return hit?.id ?? "coaching";
}

/* ==========================================================================
   THE SERVICES PAGE, /services
   ========================================================================== */

/**
 * `/services`, restored 06/09/2026 on Paul's call.
 *
 * ---------------------------------------------------------------------------
 * IT WAS RETIRED ONCE, AND WHAT IS DIFFERENT NOW
 * ---------------------------------------------------------------------------
 *
 * The route existed for one day and folded into `/coaching` on 23/08/2026,
 * recorded in `nav.ts`. The fold was right at the time: the page was the three
 * cards and nothing else, `/coaching` needed them, and two pages carrying one
 * section is one section that gets edited in the wrong place.
 *
 * What changed is that `/products` now exists. The catalogue of TOOLS has a
 * page, and the three services had nowhere of their own to be compared, so the
 * site could answer "what can I buy" for the plug-and-play half and not for the
 * half a person delivers. This page is the second half of that pair, and the
 * split between it and `/coaching` is the one the fold blurred:
 *
 * - **`/services` is what the work is.** Three services, how an engagement
 *   runs, what it does not cover.
 * - **`/coaching` is why you would want it.** The hook, the proof, the personas
 *   and the founder section, which is a pitch and not a catalogue.
 *
 * The cards themselves are still `ServiceCards`, rendered by both pages, so
 * there is still exactly one place they are written.
 *
 * **The limit section is `coaching.ts`'s `NOT_FOR`, imported rather than
 * rewritten.** Those three lines are Paul's own and they carry two standing
 * decisions, that PunProfile is paid by the candidate rather than by an
 * employer and that nobody can honestly guarantee a job or a visa. A second
 * wording of a standing decision is the thing this repo has a lint for.
 */
export const SERVICES_EYEBROW: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19FWUVCUk9X:EN%%,
  // Paul's wording, 06/09/2026.
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19FWUVCUk9X:TH%%,
};

export const SERVICES_PAGE_HEADING: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19QQUdFX0hFQURJTkc:EN%%,
  // Paul's wording, 06/09/2026.
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19QQUdFX0hFQURJTkc:TH%%,
};

export const SERVICES_PAGE_INTRO: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19QQUdFX0lOVFJP:EN%%,
  // Paul's wording, 06/09/2026.
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19QQUdFX0lOVFJP:TH%%,
};

export const ENGAGEMENT_HEADING: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpFTkdBR0VNRU5UX0hFQURJTkc:EN%%,
  // Paul's wording, 06/09/2026.
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpFTkdBR0VNRU5UX0hFQURJTkc:TH%%,
};

export const ENGAGEMENT_LEDE: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpFTkdBR0VNRU5UX0xFREU:EN%%,
  // Paul's wording, 06/09/2026. `ไม่มีค่าใช้จ่าย` rather than the shorter word,
  // which is the form `faq.ts` and the product pages already use for this.
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpFTkdBR0VNRU5UX0xFREU:TH%%,
};

export interface EngagementStep {
  lead: Copy;
  body: Copy;
}

export const ENGAGEMENT: readonly EngagementStep[] = [
  {
    lead: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpFTkdBR0VNRU5UWzBdLmxlYWQ:EN%%,
      // Read back 06/09/2026.
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpFTkdBR0VNRU5UWzBdLmxlYWQ:TH%%,
    },
    body: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpFTkdBR0VNRU5UWzBdLmJvZHk:EN%%,
      // Paul's wording, 06/09/2026.
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpFTkdBR0VNRU5UWzBdLmJvZHk:TH%%,
    },
  },
  {
    lead: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpFTkdBR0VNRU5UWzFdLmxlYWQ:EN%%,
      // Read back 06/09/2026.
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpFTkdBR0VNRU5UWzFdLmxlYWQ:TH%%,
    },
    body: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpFTkdBR0VNRU5UWzFdLmJvZHk:EN%%,
      // Paul's wording, 06/09/2026. The reasoning is the `coaching` service's own
      // summary above, which is Paul's Thai; this line points at it rather than
      // replacing it.
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpFTkdBR0VNRU5UWzFdLmJvZHk:TH%%,
    },
  },
  {
    lead: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpFTkdBR0VNRU5UWzJdLmxlYWQ:EN%%,
      // Read back 06/09/2026.
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpFTkdBR0VNRU5UWzJdLmxlYWQ:TH%%,
    },
    body: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpFTkdBR0VNRU5UWzJdLmJvZHk:EN%%,
      // Paul's wording, 06/09/2026.
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpFTkdBR0VNRU5UWzJdLmJvZHk:TH%%,
    },
  },
  {
    lead: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpFTkdBR0VNRU5UWzNdLmxlYWQ:EN%%,
      // Read back 06/09/2026.
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpFTkdBR0VNRU5UWzNdLmxlYWQ:TH%%,
    },
    body: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpFTkdBR0VNRU5UWzNdLmJvZHk:EN%%,
      // Paul's wording, 06/09/2026. The closing clause is Paul's own, from
      // `NOT_FOR` in `coaching.ts`.
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpFTkdBR0VNRU5UWzNdLmJvZHk:TH%%,
    },
  },
];

export const SERVICES_FAQ_INTRO: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19GQVFfSU5UUk8:EN%%,
  // Read back 06/09/2026.
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19GQVFfSU5UUk8:TH%%,
};

export interface ServiceFaq {
  q: Copy;
  a: Copy;
}

export const SERVICES_FAQ: readonly ServiceFaq[] = [
  {
    q: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19GQVFbMF0ucQ:EN%%,
      // Read back 06/09/2026.
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19GQVFbMF0ucQ:TH%%,
    },
    a: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19GQVFbMF0uYQ:EN%%,
      // Paul's wording, 06/09/2026.
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19GQVFbMF0uYQ:TH%%,
    },
  },
  {
    q: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19GQVFbMV0ucQ:EN%%,
      // Paul's wording, 06/09/2026.
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19GQVFbMV0ucQ:TH%%,
    },
    a: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19GQVFbMV0uYQ:EN%%,
      // Paul's wording, 06/09/2026. It points at `/pricing` in words rather than
      // quoting a number, which is the rule the product pages follow.
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19GQVFbMV0uYQ:TH%%,
    },
  },
  {
    q: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19GQVFbMl0ucQ:EN%%,
      // Paul's wording, 06/09/2026.
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19GQVFbMl0ucQ:TH%%,
    },
    a: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19GQVFbMl0uYQ:EN%%,
      // Paul's wording, 06/09/2026.
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19GQVFbMl0uYQ:TH%%,
    },
  },
  {
    q: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19GQVFbM10ucQ:EN%%,
      // Paul's wording, 06/09/2026.
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19GQVFbM10ucQ:TH%%,
    },
    a: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19GQVFbM10uYQ:EN%%,
      // Paul's wording, 06/09/2026. The first clause is Paul's own wording from
      // the coaching service's `includes` above, including `เป็นหลัก`, which is
      // there because a flat claim that sessions ARE in English is one a reader
      // could hold against the first session that switches.
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19GQVFbM10uYQ:TH%%,
    },
  },
];

export const SERVICES_CLOSE_HEADING: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19DTE9TRV9IRUFESU5H:EN%%,
  // Read back 06/09/2026.
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19DTE9TRV9IRUFESU5H:TH%%,
};

export const SERVICES_CLOSE_BODY: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19DTE9TRV9CT0RZ:EN%%,
  // Paul's wording, 06/09/2026. First person, per `DESTINATIONS.contact` in
  // `cta.ts`: the reader reaches a person, not a company.
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3NlcnZpY2VzLnRzOjpTRVJWSUNFU19DTE9TRV9CT0RZ:TH%%,
};
