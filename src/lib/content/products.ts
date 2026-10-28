import type { Copy } from "./copy";

/**
 * One page per product. Added 23/08/2026, Paul's call to build all of them
 * rather than only the ones that exist.
 *
 * ---------------------------------------------------------------------------
 * WHAT A PRODUCT PAGE IS FOR, AND WHY IT CARRIES NO PRICE
 * ---------------------------------------------------------------------------
 *
 * `/pricing` is where someone chooses. A product page is where someone learns,
 * and the two must not both try to do both: a number repeated across six
 * marketing pages is six places for it to drift. Decided 23/08/2026, and it is
 * how the reference product handles the same split.
 *
 * The shape follows `careersy.ai/cv-score`: a headline naming the PROBLEM rather
 * than the feature, one line on what you get, how it works in three points, what
 * it does NOT do stated plainly, a short FAQ, and one action repeated at the
 * foot. The "what it does not do" block is not modesty. It is the app's own
 * honesty rule applied to a sales page, and on three of these it carries a
 * standing decision: the app does not rewrite CVs, PunProfile is not a
 * recruiter, and the tracker does not chase employers.
 *
 * **Every Thai string here was read back by Paul on 23/08/2026** through
 * `thai-review-queue.md`. Nine he approved as drafted, the rest he rewrote, and
 * each rewritten line is attributed where it sits. Where his Thai moved the
 * meaning, the English was changed to follow it rather than the other way round.
 *
 * ---------------------------------------------------------------------------
 * STATUS, AND WHY AN UNBUILT PRODUCT STILL GETS A PAGE
 * ---------------------------------------------------------------------------
 *
 * Four of the five do not exist yet: only EU Fit Check is `live`. Their pages ship
 * anyway, with `status: "soon"` rendering a line that says so and an action that
 * opens a conversation rather than a dead button. That is the white-glove flow in
 * any case, since payment is a bank transfer arranged one to one, and it measures
 * demand before the build rather than after it.
 *
 * **A page that pretended the thing existed would be the version to refuse.** The
 * status line is what makes shipping these honest.
 *
 * **And a `soon` page is not a search result.** Each one carries `NOT_YET_INDEXED`
 * from `seo.ts`, `index: false, follow: true`, added 23/08/2026 on Paul's call.
 * They are linked from the Products menu on every page of the site, so leaving
 * them indexable would have made the four thinnest pages the four most linked-to.
 * Three things flip together on the day a product opens: `status` to `live`, the
 * route into `PUBLIC_ROUTES`, and that tag off.
 *
 * Coaching 1:1 is deliberately absent from this file. It has `/coaching`, which
 * is a longer sales page with the founder section and the three service cards
 * on it, and folding that into a template would lose more than it tidied.
 */

export type ProductStatus = "live" | "soon";

/**
 * `audience` and `howLede` were drafted 25/08/2026 to fill `PROD-01` and
 * `PROD-02`, the two parts the reference's product pages have and these did
 * not: a chip saying who the thing is for, above everything else, and a line
 * under "how this works" saying what the steps add up to.
 *
 * Both are written from what each product's own `how` list already says, not
 * from a claim about it, which is the rule that keeps a summary honest: if the
 * line cannot be checked against the three bullets under it, it is marketing.
 */
export interface ProductFaq {
  q: Copy;
  a: Copy;
}

export interface Product {
  /** The URL segment, under `/products/`. */
  slug: string;
  /** Who this one is for, in a few words. Renders as the audience chip. */
  audience: Copy;
  /** One line under "how this works", before the steps. */
  howLede: Copy;
  /** Overrides HOW_HEADING on this product's page. 28/10/2026. */
  howHeading?: Copy;
  name: Copy;
  /** Search title where the name alone would collide with another page's. */
  seoTitle?: Copy;
  status: ProductStatus;
  /** The problem the reader arrived with, not a description of the feature. */
  headline: Copy;
  /** What they get, in one line. */
  lede: Copy;
  /** How it works. Three, because a fourth stops being read. */
  how: readonly Copy[];
  /** What it does not do. Plainly, and usually carrying a standing decision. */
  limit: Copy;
  faq: readonly ProductFaq[];
  /** Key into `PAGE_ACTIONS`. Every product page has its own entry. */
  actionsKey: string;
}

/**
 * Shown under the name on any product whose `status` is `soon`.
 *
 * One string for all of them rather than a per-product variant, so the promise
 * is identical everywhere and there is one place to change it on the day the
 * first one ships.
 */
export const COMING_SOON: Copy = {
  en: "Not open yet. Message me and I will tell you when it is.",
  // Paul's wording, 23/08/2026.
  th: "ตอนนี้ยังไม่เปิดให้ใช้งาน ทักมาหาผมได้ แล้วผมจะแจ้งให้คุณรู้เมื่อเปิด",
};

/**
 * The short form of the same fact, for a list. Added 06/09/2026.
 *
 * `COMING_SOON` above is a promise and a sentence: it is not open, message me,
 * I will tell you when it is. That is the right thing to say on the product's
 * own page, where the reader has arrived to find out about one thing and the
 * next step has to be offered rather than implied.
 *
 * It is the wrong thing in a chip. Rendered beside a name in the catalogue, in
 * the comparison table and on the related-products row, the sentence is four
 * times the length of the name it qualifies, wraps to two lines inside a pill
 * and reads as the heading. Measured on the built page, 06/09/2026, which is
 * where it became obvious.
 *
 * So: the label in a list, the sentence on the page. Both say the same thing
 * and neither is a second promise, which is the rule that made `COMING_SOON`
 * one string in the first place.
 */
export const STATUS_SOON: Copy = {
  en: "Coming soon",
  // Read back 06/09/2026.
  th: "เร็ว ๆ นี้",
};

/**
 * The EU Fit Check page's two extra sections, added 25/10/2026, read back and
 * approved by Paul 26/10/2026. See `product-page-eu-fit-check.md` for why only this page has them:
 * it is the one live product, and the only one with a result to show.
 */
/**
 * The example chart in the EU Fit Check hero, 25/10/2026. Invented and labelled
 * as an example on the page. Uneven on purpose, so it teaches what the chart
 * shows rather than flattering the reader.
 */
export const HERO_SAMPLE_SCORES = {
  professionalCapability: 3.8,
  employability: 2.1,
  mobilityReadiness: 3.0,
  europeanMarketFit: 2.6,
} as const;

export const SHOWCASE_HEADING: Copy = {
  en: "What you see at the end",
  th: "สิ่งที่คุณจะเห็นเมื่อทำเสร็จ",
};

export const SHOWCASE_LEDE: Copy = {
  en: "Beside your own chart, the result shows where everyone else who has taken it stands. The figures below are live.",
  th: "นอกจากกราฟของคุณเอง หน้าผลลัพธ์ยังแสดงให้เห็นว่าคนอื่นที่ทำแบบประเมินนี้อยู่ตรงไหน ตัวเลขด้านล่างนี้เป็นข้อมูลจริงล่าสุด",
};

/**
 * The EU Fit Check page's full-version section, and the PDF's, added 26/10/2026.
 * The paid Fit Report gives every competency in each area; this shows one area,
 * readiness to apply, as an invented and labelled example. The keys are the
 * `model.ts` item keys, so the axis names come from `item.*` in `copy.ts`.
 */
export const FULL_SAMPLE: readonly { key: string; score: number }[] = [
  { key: "aiDigitalFluency", score: 3.5 },
  { key: "cvQuality", score: 2.5 },
  { key: "linkedinProfile", score: 2.0 },
  { key: "interviewSkills", score: 3.0 },
  { key: "personalBrand", score: 2.5 },
  { key: "networking", score: 1.5 },
  { key: "jobSearchStrategy", score: 2.0 },
  { key: "recruiterReadiness", score: 3.5 },
];

/** The two labels over the hero's charts, 26/10/2026: what the free check gives, and what the Fit Report gives. */
export const HERO_FREE_LABEL: Copy = {
  en: "Free: 4 areas",
  th: "ฟรี: 4 ด้าน",
};

export const HERO_FULL_LABEL: Copy = {
  en: "Fit Report: every competency",
  th: "Fit Report: ทุกทักษะ",
};

export const FULL_HEADING: Copy = {
  en: "The full version: every competency, area by area",
  th: "ฉบับเต็ม: ครบทุกทักษะ แยกทีละด้าน",
};

export const FULL_LEDE: Copy = {
  en: "The free check scores four areas from your answers. The Fit Report adds a 30-minute interview with an expert and opens each area up like this, eight to ten competencies at a time.",
  th: "EU Fit Check แบบฟรีให้คะแนน 4 ด้านจากคำตอบของคุณ ส่วน Fit Report จะเพิ่มการสัมภาษณ์ 30 นาทีกับ Expert และแสดงผลแต่ละด้านเป็นกราฟแบบนี้ โดยแยกเป็นด้านละ 8–10 ทักษะ",
};

export const FULL_CTA: Copy = {
  en: "See what the Fit Report includes",
  th: "ดูว่า Fit Report มีอะไรบ้าง",
};

export const HOW_HEADING: Copy = {
  en: "How to start",
  // Paul's wording, 23/08/2026.
  th: "เริ่มต้นอย่างไร",
};

export const LIMIT_HEADING: Copy = {
  en: "Worth knowing before you decide",
  // Drafted 23/08/2026, read back and approved unchanged.
  th: "สิ่งที่ควรรู้ก่อนตัดสินใจ",
};

export const PRODUCTS: readonly Product[] = [
  /* ------------------------------------------------------------ EU Fit Check */
  {
    slug: "eu-fit-check",
    // `/efc-assessment` is titled "EU Fit Check" too; this keeps the two apart.
    seoTitle: {
      en: "EU Fit Check: what it shows you",
      th: "EU Fit Check บอกอะไรคุณบ้าง",
    },
    // Read back 25/08/2026. Draft for `PROD-01-eu-fit-check`.
    audience: {
      en: "For anyone weighing up a move to Europe",
      th: "คนที่กำลังคิดเรื่องไปทำงานในยุโรป",
    },
    // Read back 25/08/2026. Draft for `PROD-02-eu-fit-check`.
    // Read back and approved by Paul 26/10/2026, `product-page-eu-fit-check.md`.
    howLede: {
      en: "What you answer, and what you see the moment you finish.",
      th: "สิ่งที่คุณจะตอบ และสิ่งที่คุณจะเห็นทันทีที่ทำเสร็จ",
    },
    name: { en: "EU Fit Check", th: "EU Fit Check" },
    status: "live",
    /*
     * Replaced 25/10/2026, approved by Paul the same day. It was `home.ts` HERO_REFRAME, which is the
     * home page's reframe of the whole problem: six lines in Thai at hero size,
     * and it never said what this page offers. A product headline names the
     * question the product answers, in one line.
     */
    headline: {
      en: "Before you apply in Europe, find out how ready you are.",
      th: "ก่อนสมัครงานในยุโรป รู้ก่อนว่าตอนนี้คุณพร้อมแค่ไหน",
    },
    /*
     * Rewritten 25/10/2026, read back and approved by Paul 26/10/2026. The old lede said only
     * how long it takes. This one says what the reader gets for the two
     * minutes. "Four things that decide a hire" is the framework's own grouping,
     * the four chart axes, as `coaching.ts` describes it.
     */
    lede: {
      en: "17 questions, about 2 minutes, and you see your result on the four things that decide a hire in Europe straight away. Free, no sign-up.",
      th: "ตอบคำถาม 17 ข้อ ใช้เวลาประมาณ 2 นาที แล้วเห็นผลทันทีใน 4 ด้านที่มีผลต่อการจ้างงานในยุโรป ใช้ฟรี ไม่ต้องสมัครสมาชิก",
    },
    /*
     * Rewritten 25/10/2026, read back and approved by Paul 26/10/2026. What you answer, what
     * you see, what you compare against. Every claim is on the first read today:
     * the four axes, the percentile line and the job-pipeline card.
     */
    how: [
      {
        en: "17 questions about your work experience, your English, your target country and where you are in the move. In Thai, on your phone.",
        // Built from Paul's approved answer to "EU Fit Check คืออะไร" in `faq.ts`.
        th: "คำถาม 17 ข้อ เกี่ยวกับประสบการณ์ทำงาน ระดับภาษาอังกฤษ ประเทศเป้าหมาย และตอนนี้คุณอยู่ขั้นไหนบนเส้นทางไปทำงานในยุโรป ตอบเป็นภาษาไทยบนมือถือได้เลย",
      },
      {
        en: "Your own chart across four areas: skills in your field, readiness to apply, readiness to relocate, and fit with the European market. Each scored out of 5.",
        // The four Thai names are the chart's own axis labels in `copy.ts`.
        th: "กราฟของคุณเองใน 4 ด้าน คือ ทักษะในสายงาน ความพร้อมในการสมัครงาน ความพร้อมในการย้ายประเทศ และความสอดคล้องกับตลาดยุโรป แต่ละด้านมีคะแนนเต็ม 5",
      },
      {
        en: "How you compare with everyone else who has taken it, and how many of the job adverts we checked come from employers who sponsor a visa.",
        th: "ดูว่าคุณเทียบกับคนอื่นที่ทำแบบประเมินนี้แล้วเป็นอย่างไร และจากประกาศงานที่เราตรวจสอบ มีกี่ตำแหน่งที่บริษัทระบุว่าสปอนเซอร์วีซ่า",
      },
    ],
    // Approved by Paul 26/10/2026, built from his approved FAQ answer on the empty parts
    // of the chart. It now answers that question, so the question left this FAQ.
    limit: {
      en: "It reads your answers, not your CV. Where a form cannot measure something reliably, the chart leaves it empty instead of guessing. Those parts need someone to read your real CV or talk with you.",
      th: "แบบประเมินนี้อ่านจากคำตอบของคุณ ยังไม่ได้อ่าน CV ตัวจริง เรื่องไหนที่ประเมินจากคำตอบได้ไม่น่าเชื่อถือพอ กราฟจะเว้นว่างไว้แทนการเดาคะแนน ส่วนนั้นต้องมีคนอ่าน CV ตัวจริงของคุณหรือได้คุยกับคุณก่อน",
    },
    /*
     * Four questions, 25/10/2026, chosen for the doubts that stop someone
     * tapping. Answers are Paul's approved `faq.ts` Thai, unchanged; the data
     * question, approved 26/10/2026, drops ฉัน from the /faq version.
     */
    faq: [
      {
        q: {
          en: "My English is not strong yet. Can I still do this?",
          th: "ภาษาอังกฤษยังไม่แข็งแรง ทำได้ไหม",
        },
        a: {
          en: "Yes. The assessment is in Thai, and language is one of the things we assess rather than a condition for starting.",
          th: "ได้ แบบประเมินเป็นภาษาไทย และเรื่องภาษาเป็นหนึ่งในหัวข้อที่เราประเมิน ไม่ใช่เงื่อนไขในการเริ่มทำ",
        },
      },
      {
        q: {
          en: "What happens after I finish the assessment?",
          th: "ทำแบบประเมินเสร็จแล้วจะเกิดอะไรขึ้น",
        },
        a: {
          en: "A person actually reads your answers. The system does not decide on its own who gets contacted back.",
          th: "จะมีคนอ่านคำตอบของคุณจริง ๆ ระบบไม่ได้เป็นผู้ตัดสินเพียงลำพังว่าเราจะติดต่อใครกลับ",
        },
      },
      {
        q: {
          en: "What happens to the information I enter?",
          th: "ข้อมูลที่กรอกไปจะถูกนำไปใช้ทำอะไร",
        },
        a: {
          en: "We use it to prepare your result and to contact you through the channels you agreed to, nothing else. We do not sell it or pass it on, and you can ask us to delete it at any time.",
          th: "เราใช้ข้อมูลของคุณเพื่อจัดทำผลประเมินและติดต่อกลับผ่านช่องทางที่คุณยินยอมไว้เท่านั้น เราไม่ขายหรือส่งต่อข้อมูลให้บุคคลอื่น และคุณขอให้ลบได้ทุกเมื่อ",
        },
      },
      {
        q: { en: "Can I change an answer, or take it again?", th: "แก้คำตอบหรือทำใหม่ได้ไหม" },
        a: {
          en: "Yes. You can go back and change an answer at any point, and the chart updates straight away.",
          th: "ได้ คุณย้อนกลับไปแก้คำตอบได้ตลอด กราฟจะอัปเดตตามคำตอบใหม่ให้ทันที",
        },
      },
    ],
    actionsKey: "/products/eu-fit-check",
  },

  /* --------------------------------------------------------------- CV Check */
  {
    slug: "cv-check",
    // Read back 25/08/2026. Draft for `PROD-01-cv-check`.
    audience: {
      en: "For anyone whose CV was written for the Thai market",
      th: "คนที่เขียน CV ไว้สำหรับตลาดไทย",
    },
    // Read back 25/08/2026. Draft for `PROD-02-cv-check`.
    howLede: {
      en: "We read your CV the way a European reader does, and list what to fix.",
      th: "เราอ่าน CV ของคุณแบบเดียวกับคนอ่านในยุโรป แล้วบอกว่าควรแก้จุดไหนบ้าง",
    },
    name: { en: "CV Check", th: "CV Check" },
    status: "soon",
    headline: {
      en: "A CV that works in the Thai market can leave a European reader unable to see your strengths.",
      // Paul's wording, 23/08/2026.
      th: "CV ที่ใช้ได้ดีในตลาดไทย อาจทำให้คนในตลาดยุโรปมองไม่เห็นจุดแข็งของคุณ",
    },
    lede: {
      en: "Upload your CV and see how much of your profile a European reader can actually understand. Free.",
      // Paul's wording, 23/08/2026.
      th: "อัปโหลด CV แล้วดูว่าคนในตลาดยุโรปเข้าใจโปรไฟล์ของคุณได้มากแค่ไหน ใช้ฟรี",
    },
    how: [
      {
        en: "What the first third of the page spends itself on, because a screener and a reader both start at the top and both stop early.",
        // Paul's wording, 23/08/2026. The reading-order opener from the Kick-start
        // run sheet, which exists because the ATS artefact only shows up when a CV
        // parses badly and the first real CV parsed cleanly.
        th: "ดูว่าหนึ่งในสามแรกของหน้าใช้พื้นที่ไปกับอะไร เพราะทั้งระบบคัดกรองและคนอ่านต่างเริ่มจากด้านบน และอาจหยุดอ่านตั้งแต่เนิ่น ๆ",
      },
      {
        en: "Whether your employers and job titles mean anything to someone who does not know the Thai market.",
        // Paul's wording, 23/08/2026. This is the core claim in `10_Methodology.md`:
        // illegibility rather than capability. A Bangkok senior title may read as
        // mid-level and a well-known Thai employer reads as an unknown one.
        th: "เช็กว่าชื่อบริษัทและชื่อตำแหน่งของคุณสื่อความหมายกับคนที่ไม่รู้จักตลาดงานไทยหรือไม่",
      },
      {
        en: "Where you have written duties when the market is reading for results.",
        // Drafted 23/08/2026, read back and approved unchanged.
        th: "ชี้จุดที่เขียนเป็นหน้าที่ความรับผิดชอบ ทั้งที่ควรเขียนเป็นผลลัพธ์",
      },
    ],
    limit: {
      en: "We do not rewrite your CV. What you get is a list of what to fix, and why each one matters.",
      /*
       * Drafted 23/08/2026, read back and approved unchanged, and this line is a standing decision rather
       * than a caveat. **The app does not rewrite CVs**, decided by Paul on
       * 04/08/2026 and recorded in `competitive-reference.md` as the one thing
       * explicitly not taken from the nearest competitor. A checker reads and
       * scores. The difference has to hold in the copy as well as the code.
       */
      th: "เราไม่เขียน CV ใหม่ให้คุณ สิ่งที่ได้คือรายการจุดที่ควรแก้ พร้อมเหตุผลของแต่ละจุด",
    },
    faq: [
      {
        q: { en: "Does it cost anything?", th: "มีค่าใช้จ่ายไหม" },
        a: {
          en: "No. The CV Check is free.",
          // Paul's wording, 23/08/2026.
          th: "ไม่มีค่าใช้จ่าย CV Check ใช้ฟรี",
        },
      },
    ],
    actionsKey: "/products/cv-check",
  },

  /* ------------------------------------------------------------- Fit Report */
  {
    slug: "fit-report",
    // Read back 25/08/2026. Draft for `PROD-01-fit-report`.
    audience: {
      en: "For anyone who has done the EU Fit Check and wants to know what to work on next",
      th: "สำหรับคนที่ทำ EU Fit Check แล้ว และอยากรู้ว่าควรพัฒนาอะไรต่อ",
    },
    // Read back 25/08/2026. Draft for `PROD-02-fit-report`.
    howLede: {
      en: "From first contact to the report in your hands.",
      th: "ตั้งแต่เริ่มติดต่อจนได้รับรายงาน",
    },
    name: { en: "Fit Report", th: "Fit Report" },
    status: "live",
    headline: {
      en: "You have your first result. Where should you start?",
      // Drafted 23/08/2026, read back and approved unchanged. `อยู่ขั้นไหน` is Paul's own correction on the
      // pinned post of 14/08/2026, where he changed อยู่ตรงไหน to อยู่ขั้นไหน:
      // progress is a stage you are at, not a place you are in.
      th: "รู้ผลเบื้องต้นแล้ว ควรเริ่มพัฒนาตรงไหนก่อน?",
    },
    lede: {
      en: "The full report: all four areas scored competency by competency, completed in a 30-minute interview with an expert.",
      // Rebuilt from Paul's own Thai of 23/08/2026 on the pricing sheet.
      th: "ผลประเมินฉบับเต็ม ครบทั้ง 4 ด้าน แยกคะแนนเป็นรายทักษะ โดยใช้ทั้งคำตอบของคุณและการสัมภาษณ์ 30 นาทีกับผู้เชี่ยวชาญ",
    },
    how: [
      {
        en: "Message me on LINE. I will send the payment details and book a time that suits you.",
        // Drafted 23/08/2026, read back and approved unchanged. Thresholds rather than scores, which
        // `10_Methodology.md` calls the single most important idea in the method.
        th: "ทักมาทาง LINE ผมจะแจ้งรายละเอียดการชำระเงิน และนัดเวลาสัมภาษณ์ที่สะดวก",
      },
      {
        en: "A 30-minute video interview with an expert about your CV, your work experience and the roles you are interested in, in Thai or English.",
        // Paul's wording, 23/08/2026. Gates are cleared in dependency order, not
        // score order, and the lowest uncleared one is the only one that matters
        // this month.
        th: "สัมภาษณ์ผ่านวิดีโอคอล 30 นาทีกับผู้เชี่ยวชาญ พูดคุยเกี่ยวกับ CV ประสบการณ์ทำงาน และตำแหน่งที่คุณสนใจ โดยเลือกสัมภาษณ์เป็นภาษาไทยหรืออังกฤษได้",
      },
      {
        en: "Your Fit Report arrives as a PDF the same day, yours to keep and plan from.",
        // Paul's wording, 23/08/2026.
        th: "ได้รับ Fit Report เป็น PDF ภายในวันเดียวกัน เก็บไว้ใช้วางแผนต่อได้",
      },
    ],
    limit: {
      en: "The Fit Report tells you what to work on and where to start. If you want me to help with your CV and LinkedIn, or to practise interviews together, that continues in 1:1 coaching.",
      // Drafted 23/08/2026, read back and approved unchanged.
      th: "Fit Report ช่วยให้คุณรู้ว่าควรพัฒนาอะไรและเริ่มจากตรงไหน หากต้องการให้ผมช่วยปรับ CV และ LinkedIn หรือฝึกสัมภาษณ์ด้วยกัน สามารถทำต่อได้ใน Coaching 1:1",
    },
    faq: [
      {
        q: { en: "Do I need to do the EU Fit Check first?", th: "ต้องทำ EU Fit Check ก่อนไหม" },
        a: {
          en: "We recommend it. The Fit Report takes your EU Fit Check answers further, so the 30-minute interview can go deep on what the assessment cannot tell us yet.",
          // Paul's wording, 23/08/2026.
          th: "แนะนำให้ทำก่อนครับ เพราะ Fit Report จะนำคำตอบจาก EU Fit Check มาวิเคราะห์ต่อ ทำให้การสัมภาษณ์ 30 นาทีเน้นเจาะลึกในสิ่งที่แบบประเมินยังบอกเราไม่ได้",
        },
      },
      {
        q: { en: "Which language is the interview in?", th: "สัมภาษณ์เป็นภาษาอะไร" },
        a: { en: "Thai or English, your choice. If you want your working English assessed too, do it in English.", th: "เลือกได้ทั้งไทยและอังกฤษ ถ้าอยากให้ประเมินภาษาอังกฤษเพื่อการทำงานด้วย แนะนำให้คุยเป็นภาษาอังกฤษ" },
      },
      {
        q: { en: "How long until I get the report?", th: "นานแค่ไหนกว่าจะได้รายงาน" },
        a: { en: "The same day as the interview.", th: "ภายในวันเดียวกับที่สัมภาษณ์" },
      },
    ],
    howHeading: { en: "How to get your Fit Report", th: "ขั้นตอนการรับ Fit Report" },
    actionsKey: "/products/fit-report",
  },

  /* ----------------------------------------------------------- Matched Jobs */
  {
    slug: "matched-jobs",
    // Read back 25/08/2026. Draft for `PROD-01-matched-jobs`.
    audience: {
      en: "For anyone tired of scrolling job boards",
      th: "คนที่เหนื่อยกับการไล่หาประกาศงานเอง",
    },
    // Read back 25/08/2026. Draft for `PROD-02-matched-jobs`.
    howLede: {
      en: "You set the criteria, we screen against them and send one role at a time.",
      th: "คุณกำหนดเงื่อนไข เราคัดกรองให้ตามนั้น แล้วส่งให้ทีละตำแหน่ง",
    },
    name: { en: "Matched Jobs", th: "Matched Jobs" },
    status: "soon",
    headline: {
      en: "There are plenty of roles in Europe. There are not many you can actually apply for.",
      // Drafted 23/08/2026, read back and approved unchanged.
      th: "ตำแหน่งงานในยุโรปมีเยอะ แต่ที่คุณสมัครได้จริงมีไม่กี่ตำแหน่ง",
    },
    lede: {
      en: "We screen roles against the criteria you set and send them to your email, one at a time.",
      // Paul's own Thai of 23/08/2026, from the pricing sheet.
      th: "เราคัดตำแหน่งงานที่ตรงกับเงื่อนไขของคุณ แล้วส่งตรงถึงอีเมลทีละตำแหน่ง",
    },
    how: [
      {
        en: "You set the criteria: the field, the countries, the language, the level of role you want.",
        // Paul's wording, 23/08/2026.
        th: "คุณเป็นคนกำหนดเงื่อนไขเอง ทั้งสายงาน ประเทศ ภาษา และระดับตำแหน่งที่ต้องการ",
      },
      {
        en: "One role at a time, so you have the time to look at each one properly.",
        // Paul's wording, 23/08/2026. One at a time is the method's own rule
        // against handing anyone a five-item list, applied to job search.
        th: "ส่งให้ทีละตำแหน่ง เพื่อให้คุณมีเวลาดูแต่ละงานจริง ๆ",
      },
      {
        en: "Every role says plainly whether it needs work rights you already hold, before you spend time applying.",
        // Drafted 23/08/2026, read back and approved unchanged. Work rights sit outside the match bar and are
        // always stated, decided 22/08/2026, using the pipeline's own
        // "Publish (Work Rights Required)" verdict whose rule is that the label is
        // not optional and not a footnote.
        th: "ทุกตำแหน่งระบุชัดว่าต้องมีสิทธิ์ทำงานอยู่แล้วหรือไม่ ก่อนที่คุณจะเสียเวลาในการสมัคร",
      },
    ],
    limit: {
      en: "We are not a recruitment agency. Applying is still yours.",
      // Paul's wording, 23/08/2026. Paul's own FAQ makes the same point: PunProfile
      // takes its fee from the candidate rather than the employer, so there is no
      // quota and no role anyone is pushed toward.
      th: "เราไม่ใช่บริษัทจัดหางาน และคุณยังต้องเป็นคนสมัครด้วยตัวเอง",
    },
    faq: [
      {
        q: { en: "What if nothing matches?", th: "ถ้ารอบไหนไม่มีตำแหน่งที่ตรงเลย" },
        a: {
          en: "We keep looking, and a token is only deducted once a role matching your criteria has reached you.",
          // Paul's wording, 23/08/2026. Deliberately does not say real time: the
          // mechanism will be batched, and a promise of real time is a claim the
          // system does not meet.
          th: "เราจะค้นหาต่อให้ และหักโทเคนเฉพาะเมื่อมีตำแหน่งที่ตรงกับเงื่อนไขส่งถึงคุณแล้ว",
        },
      },
    ],
    actionsKey: "/products/matched-jobs",
  },

  /* ------------------------------------------------------- Guided Job Hunt */
  {
    slug: "guided-job-hunt",
    // Read back 25/08/2026. Draft for `PROD-01-guided-job-hunt`.
    audience: {
      en: "For anyone applying to several roles at once",
      th: "คนที่กำลังสมัครงานหลายตำแหน่งพร้อมกัน",
    },
    // Read back 25/08/2026. Draft for `PROD-02-guided-job-hunt`.
    howLede: {
      en: "One place holding every application and where each one stands.",
      th: "ที่เดียวที่เก็บทุกตำแหน่งที่คุณสมัคร พร้อมสถานะของแต่ละตำแหน่ง",
    },
    name: { en: "Guided Job Hunt", th: "Guided Job Hunt" },
    status: "soon",
    headline: {
      en: "You have applied to a lot of places, and you can no longer remember which one is where.",
      // Drafted 23/08/2026, read back and approved unchanged.
      th: "สมัครไปหลายที่ จนจำไม่ได้แล้วว่าที่ไหนไปถึงขั้นไหน",
    },
    lede: {
      en: "One place holding every role you applied for, with where each one stands. Free.",
      // Paul's wording, 23/08/2026. Free because it is the surface paid deliveries
      // land on, decided 23/08/2026: charging for it would be charging twice for
      // one workflow.
      th: "รวมทุกตำแหน่งที่คุณสมัครไว้ในที่เดียว พร้อมสถานะล่าสุดของแต่ละที่ ใช้ฟรี",
    },
    how: [
      {
        en: "Save the roles you are interested in, then decide which to apply for.",
        // Paul's wording, 23/08/2026.
        th: "บันทึกตำแหน่งที่สนใจไว้ แล้วค่อยตัดสินใจว่าจะสมัครตำแหน่งไหน",
      },
      {
        en: "Update the status yourself, from applying through interviews to an offer.",
        // Paul's wording, 23/08/2026. Self-updated by design: a notebook rather than
        // an automated pipeline, per the 04/08/2026 scope note.
        th: "อัปเดตสถานะได้ด้วยตัวเอง ตั้งแต่ส่งใบสมัคร นัดสัมภาษณ์ ไปจนถึงได้รับข้อเสนองาน",
      },
      {
        en: "See where you are actually getting stuck most often.",
        // Paul's wording, 23/08/2026.
        th: "ดูได้ว่าคุณมักติดอยู่ที่ขั้นตอนไหนของการสมัครงาน",
      },
    ],
    limit: {
      en: "We do not apply for you, and we do not chase employers on your behalf.",
      // Paul's wording, 23/08/2026.
      th: "เราไม่สมัครงานแทนคุณ และไม่ติดตามนายจ้างแทนคุณ",
    },
    faq: [
      {
        q: { en: "Does it cost anything?", th: "มีค่าใช้จ่ายไหม" },
        a: {
          en: "No charge. It is included with Matched Jobs, because it is where those roles arrive.",
          // Paul's wording, 23/08/2026.
          th: "ไม่มีค่าใช้จ่าย เพราะรวมอยู่ในบริการส่งตำแหน่งงานที่ตรงกับคุณแล้ว",
        },
      },
    ],
    actionsKey: "/products/guided-job-hunt",
  },
];

export const productBySlug = (slug: string): Product | undefined =>
  PRODUCTS.find((p) => p.slug === slug);

/* ==========================================================================
   THE ARTWORK
   ========================================================================== */

/**
 * A figure per product page. Filled 06/09/2026.
 *
 * It moved here out of `ProductPage.tsx` for one reason: a description of a
 * picture is a candidate-facing string, and R49 says those live in a content
 * module. While every entry pointed at the same dashed box there was nothing to
 * describe and an empty `alt` at the call site was honest. The moment a figure
 * says something, a reader who cannot see it is owed the same sentence.
 *
 * **`figure` names a drawing, not a file.** Every photograph and illustration
 * in `public/` is already spoken for by another surface, and the note this
 * replaces was right about the alternative: art borrowed from the assessment
 * looks finished, says nothing about the product on the page, and is therefore
 * art nobody ever replaces. What is drawn instead is the mechanism the page has
 * just described, in `ProductDiagram.tsx`, out of the same tokens as the rest of
 * the page. A diagram of a thing the product actually does cannot be mistaken
 * for stock, and it stays true in both colour schemes.
 *
 * **This map is still the swap list.** One line per product, so replacing one
 * with a real photograph is one line here plus a branch in the diagram
 * component, and replacing all five is five.
 */
export type ProductFigure = "gates" | "page" | "report" | "roles" | "pipeline";

export interface ProductArt {
  figure: ProductFigure;
  alt: Copy;
}

export const PRODUCT_ART: Record<string, ProductArt> = {
  "eu-fit-check": {
    figure: "gates",
    alt: {
      en: "Four bars of different heights, one per gate, with the shortest marked",
      // Read back 06/09/2026. Describes what the drawing shows and nothing
      // about what it means, which is the rule `PORTRAIT_ALT` in `coaching.ts`
      // already follows.
      th: "แท่งกราฟสี่แท่งความสูงต่างกัน แทนด่านทั้งสี่ โดยแท่งที่สั้นที่สุดถูกทำเครื่องหมายไว้",
    },
  },
  "cv-check": {
    figure: "page",
    alt: {
      en: "A page of a CV with the top third marked out from the rest",
      // Paul's wording, 06/09/2026.
      th: "CV หนึ่งหน้า โดยทำเครื่องหมายแยกส่วนหนึ่งในสามด้านบนออกจากส่วนที่เหลือ",
    },
  },
  "fit-report": {
    figure: "report",
    alt: {
      en: "A report laid out as a chart above four rows of findings",
      // Paul's wording, 06/09/2026.
      th: "หน้ารายงานที่มีกราฟด้านบน และผลการประเมินสี่แถวด้านล่าง",
    },
  },
  "matched-jobs": {
    figure: "roles",
    alt: {
      en: "Three role cards, one of them marked as the one that matches",
      // Read back 06/09/2026.
      th: "การ์ดตำแหน่งงานสามใบ โดยใบหนึ่งถูกทำเครื่องหมายว่าตรงกับโปรไฟล์",
    },
  },
  "guided-job-hunt": {
    figure: "pipeline",
    alt: {
      en: "Four columns of a tracker, from saved through to offer",
      // Read back 06/09/2026.
      th: "กระดานติดตามการสมัครงานสี่คอลัมน์ ตั้งแต่ตำแหน่งที่เก็บไว้จนถึงข้อเสนอจ้างงาน",
    },
  },
};

/* ==========================================================================
   WHICH COLUMN A PRODUCT SITS IN
   ========================================================================== */

/**
 * Free versus token-priced. Moved here 06/09/2026 out of `Catalogue.tsx`.
 *
 * It was defined inside the landing page's catalogue section, which was the
 * only place that needed it until `/products` existed. Two copies of this set
 * would be two answers to which column a product is in, and the second one to
 * be edited would be wrong silently, on whichever page nobody had open.
 *
 * `products.ts` still holds no price and never will: `/pricing` owns every
 * number. What this holds is a fact about the catalogue rather than about the
 * money, which is why it can live beside the products without breaking that.
 */
export const FREE_SLUGS: ReadonlySet<string> = new Set([
  "eu-fit-check",
  "cv-check",
  "guided-job-hunt",
]);

export const isFreeProduct = (slug: string): boolean => FREE_SLUGS.has(slug);

/* ==========================================================================
   THE CATALOGUE PAGE, /products
   ========================================================================== */

/**
 * `/products`, added 06/09/2026 on Paul's call.
 *
 * **Why it did not exist until now.** The five product pages shipped on
 * 23/08/2026 reachable only from the menu, and the landing page's catalogue
 * section is the only other place that lists them. That is enough for someone
 * arriving at the top of the site and nothing at all for someone who arrives on
 * one product page from a shared link: the menu is a list of names with no
 * shape, and there was nowhere to send a reader who wants to see how the five
 * fit together before choosing one.
 *
 * **It states no price**, the same rule the product pages follow. `/pricing` is
 * where someone chooses; this is where someone learns the shape of the offer.
 * The two columns below say free or token-priced, which is a fact about the
 * catalogue rather than a number, and the labels are `home.ts`'s own so the
 * landing page and this page cannot drift into two words for one column.
 */
export const INDEX_EYEBROW: Copy = {
  en: "Everything PunProfile makes",
  // Paul's wording, 06/09/2026.
  th: "เครื่องมือและบริการทั้งหมดจาก PunProfile",
};

/** The index page's search title. The heading is a sentence and ran to 94
 *  characters in Thai as a title. */
export const INDEX_TITLE: Copy = {
  en: "Tools and coaching for working in Europe",
  th: "เครื่องมือและโค้ชสำหรับคนที่อยากไปทำงานยุโรป",
};

export const INDEX_HEADING: Copy = {
  en: "Five tools and one conversation, in the order most people take them",
  // Paul's wording, 06/09/2026.
  th: "เครื่องมือห้าอย่างและการพูดคุยกับโค้ชอีกหนึ่งแบบ เรียงตามลำดับที่คนส่วนใหญ่มักใช้",
};

export const INDEX_INTRO: Copy = {
  en: "Start wherever you are. Nothing here needs the one before it, and the first two ask for nothing but your answers.",
  // Paul's wording, 06/09/2026.
  th: "เริ่มจากจุดที่คุณอยู่ตอนนี้ได้เลย แต่ละอย่างใช้แยกกันได้ ไม่จำเป็นต้องทำอันก่อนหน้า และสองอย่างแรกต้องการเพียงคำตอบจากคุณ",
};

export const INDEX_PATH_HEADING: Copy = {
  en: "How they fit together",
  // Paul's wording, 06/09/2026.
  th: "แต่ละอย่างทำงานร่วมกันอย่างไร",
};

export const INDEX_PATH_LEDE: Copy = {
  en: "Each one answers the question the one before it leaves you holding.",
  // Paul's wording, 06/09/2026.
  th: "แต่ละอย่างช่วยตอบคำถามที่อันก่อนหน้าทิ้งไว้",
};

export const INDEX_TABLE_HEADING: Copy = {
  en: "Side by side",
  // Paul's wording, 06/09/2026.
  th: "เปรียบเทียบกันชัด ๆ",
};

export const COL_PRODUCT: Copy = {
  en: "What it is",
  // Read back 06/09/2026.
  th: "บริการ",
};

export const COL_WHO: Copy = {
  en: "Who it is for",
  // Read back 06/09/2026.
  th: "เหมาะกับใคร",
};

export const COL_WHAT: Copy = {
  en: "What happens",
  // Read back 06/09/2026.
  th: "เกิดอะไรขึ้นบ้าง",
};

export const COL_COST: Copy = {
  en: "How it is paid for",
  // Read back 06/09/2026.
  th: "จ่ายอย่างไร",
};

/** The chip on a product that is open. The counterpart of `COMING_SOON`. */
export const STATUS_LIVE: Copy = {
  en: "Available now",
  // Read back 06/09/2026.
  th: "พร้อมให้บริการ",
};

/** The link at the foot of a card on the catalogue page. */
export const CARD_ACTION: Copy = {
  en: "See what it does",
  // Paul's wording, 06/09/2026. Follows the pattern the `read`-cost labels in
  // `cta.ts` already use: ดู, and then what the page shows.
  th: "ดูว่าเครื่องมือนี้ช่วยอะไรได้บ้าง",
};

/**
 * The coaching card at the foot of the catalogue, and why it is set apart.
 *
 * Coaching is deliberately absent from `PRODUCTS`, stated at the head of this
 * file: it has `/coaching`, which is a longer page with the founder section on
 * it, and folding it into the product template would lose more than it tidied.
 * The catalogue page still has to name it, because a reader comparing five
 * tools is a reader who should know the sixth thing exists and is not a tool.
 */
export const NOT_A_TOOL_HEADING: Copy = {
  en: "And the part that is not a tool",
  // Read back 06/09/2026.
  th: "และส่วนที่ไม่ใช่เครื่องมือ",
};

export const NOT_A_TOOL_BODY: Copy = {
  en: "Everything above reads what you already have. The coaching is where we decide what to do about it, and it is the engagement every client starts with.",
  // Paul's wording, 06/09/2026.
  th: "เครื่องมือทั้งหมดด้านบนอ่านสิ่งที่คุณมีอยู่แล้ว ส่วนการโค้ชคือพื้นที่ที่เราช่วยกันตัดสินใจว่าจะทำอะไรกับสิ่งที่พบ และเป็นจุดเริ่มต้นของลูกค้าทุกคน",
};

/* ==========================================================================
   THE TWO LINES THE CLOSING BAND NEVER HAD
   ========================================================================== */

/**
 * The closing band on every product page carried a button and nothing else.
 *
 * Found in the UI review of 06/09/2026: a 215px dark-green band with a single
 * pill floating in the middle of it, on all five pages. A band that asks for
 * something without saying what it is asking about is a band a reader scrolls
 * past, and the block library gives B8 a line above the action for exactly this
 * reason.
 *
 * One pair for all five rather than a pair per product, for the same reason
 * `COMING_SOON` is one string: the ask is identical on all five and a second
 * wording of it is a second promise.
 */
export const CLOSE_HEADING: Copy = {
  en: "Not sure which one you need?",
  // Read back 06/09/2026.
  th: "ยังไม่แน่ใจว่าควรเริ่มจากอันไหน",
};

export const CLOSE_BODY: Copy = {
  en: "Tell me where you are and what you are aiming at, and I will say which of these is worth your time and which is not.",
  // Read back 06/09/2026. First person, which is what `DESTINATIONS.contact`
  // in `cta.ts` settled: the reader reaches a person, not a company.
  th: "บอกผมว่าตอนนี้คุณอยู่ตรงไหนและตั้งเป้าอะไรไว้ แล้วผมจะบอกว่าอันไหนคุ้มกับเวลาของคุณ และอันไหนยังไม่ต้อง",
};

/**
 * The heading over a product page's own FAQ, which it never had.
 *
 * The questions sat on the band with no heading over them, so on `/products/
 * cv-check`, where there is one question, the section read as a stray paragraph
 * rather than as an answer to something. `FAQ_HEADING` in `faq.ts` is the site's
 * word for this and is imported rather than restated.
 */
export const RELATED_HEADING: Copy = {
  en: "More from PunProfile",
  // Read back 06/09/2026.
  th: "บริการอื่นของ PunProfile",
};

/* ---------------------------------------------------------------------------
 * The Fit Report page, 28/10/2026. product-page-fit-report.md has the research
 * and the order; Paul approved the order (1a), the expert card (2a) and no
 * guarantee (3a) on 28/10/2026.
 * ------------------------------------------------------------------------- */

export const FIT_COMPARE_HEADING: Copy = { en: "EU Fit Check and the Fit Report, side by side", th: "EU Fit Check และ Fit Report ต่างกันอย่างไร" };

export const FIT_INSIDE_HEADING: Copy = { en: "What is in the Fit Report", th: "ใน Fit Report มีอะไรบ้าง" };

/** One tile per report page. `section` is the page's id in renderFitReport; the title is the page's own heading where it has one. */
export const FIT_TILES: readonly { section: string; titleKey?: string; title?: Copy; caption: Copy }[] = [
  { section: "summary", titleKey: "fit.summary.heading", caption: { en: "See all four areas on one chart against the bar the European market expects, and how far each one still has to go.", th: "ดูคะแนนทั้ง 4 ด้านในกราฟเดียว เปรียบเทียบกับเกณฑ์ที่ตลาดงานยุโรปคาดหวัง พร้อมดูว่าแต่ละด้านยังต้องพัฒนาอีกเท่าไร" } },
  { section: "path", titleKey: "fit.path.heading", caption: { en: "Which bar to clear first, and where to start.", th: "ควรผ่านเกณฑ์ด้านไหนก่อน และเริ่มพัฒนาจากจุดใด" } },
  { section: "employability", title: { en: "Every competency in each area", th: "ทุกทักษะในแต่ละด้าน" }, caption: { en: "A closer look at all four areas, one chart each with eight to ten competencies, with advice on which are below the bar and how to develop them.", th: "เจาะลึกทักษะทั้ง 4 ด้าน ผ่านกราฟแยกด้านละ 8–10 ทักษะ พร้อมคำแนะนำว่าทักษะไหนยังไม่ถึงเกณฑ์ และควรพัฒนาอย่างไร" } },
  { section: "moves", titleKey: "fit.moves.heading", caption: { en: "Ranked for you: what to work on first to lift your score most, with the before and after.", th: "จัดลำดับให้แล้วว่าควรพัฒนาอะไรก่อน เพื่อเพิ่มคะแนนได้มากที่สุด พร้อมเปรียบเทียบคะแนนก่อนและหลัง" } },
  { section: "roles", titleKey: "fit.roles.heading", caption: { en: "Open roles in the countries you chose, with the job ads we have checked.", th: "ตำแหน่งงานที่เปิดรับสมัครจริงในประเทศที่คุณเลือก พร้อมประกาศงานที่เราตรวจสอบแล้ว" } },
];

export const FIT_SAMPLE_PDF: Copy = { en: "Download a sample Fit Report (PDF)", th: "ดาวน์โหลดตัวอย่าง Fit Report ฉบับเต็ม (PDF)" };

export const FIT_EXPERT_HEADING: Copy = { en: "Who will interview you", th: "ใครจะเป็นผู้สัมภาษณ์คุณ" };

/** The two comparison cards, 28/10/2026 (Paul, 2a). `on` false draws a dash. */
export const FIT_PLAN_FREE = {
  pill: { en: "Free", th: "ฟรี" },
  sub: { en: "17 questions, about 2 minutes", th: "แบบประเมิน 17 ข้อ ประมาณ 2 นาที" },
  rows: [
    { text: { en: "4 area scores, from your answers", th: "คะแนน 4 ด้าน จากคำตอบของคุณ" }, on: true },
    { text: { en: "One next step", th: "สิ่งที่ควรทำต่อ 1 ข้อ" }, on: true },
    { text: { en: "The market's bar on every chart", th: "เกณฑ์ของตลาดบนทุกกราฟ" }, on: false },
    { text: { en: "All 34 competencies", th: "ครบ 34 ทักษะ" }, on: false },
    { text: { en: "Roles that fit you", th: "ตำแหน่งงานที่ตรงกับคุณ" }, on: false },
  ],
} as const;

export const FIT_PLAN_FULL = {
  sub: { en: "Your answers + a 30-minute interview with an expert", th: "คำตอบของคุณ + สัมภาษณ์ 30 นาทีกับผู้เชี่ยวชาญ" },
  rows: [
    { text: { en: "All 4 areas, all 34 competencies", th: "คะแนน 4 ด้าน ครบ 34 ทักษะ" }, on: true },
    { text: { en: "A next step for every competency below the bar, in order", th: "สิ่งที่ควรทำต่อ ทุกทักษะที่ยังไม่ถึงเกณฑ์ พร้อมลำดับ" }, on: true },
    { text: { en: "The market's bar on every chart", th: "เกณฑ์ของตลาดบนทุกกราฟ" }, on: true },
    { text: { en: "The order to work in", th: "ลำดับที่ควรลงมือ" }, on: true },
    { text: { en: "Roles that fit you", th: "ตำแหน่งงานที่ตรงกับคุณ" }, on: true },
  ],
} as const;

/** The three notes beside the big page in the showcase band, 28/10/2026 (Paul, 1a). */
export const FIT_CALLOUTS: readonly { mark: string; title: Copy; body: Copy }[] = [
  { mark: "bar", title: { en: "The job market's bar on every chart", th: "เทียบเกณฑ์ตลาดงานในทุกกราฟ" }, body: { en: "See clearly which skills clear the bar and which still need work.", th: "เห็นชัดว่าทักษะไหนผ่านเกณฑ์ และทักษะไหนยังต้องพัฒนา" } },
  { mark: "34", title: { en: "All 4 areas, skill by skill", th: "ครบทั้ง 4 ด้าน แยกเป็นรายทักษะ" }, body: { en: "Eight to ten skills per area, assessed from your answers and a 30-minute interview.", th: "ด้านละ 8–10 ทักษะ ประเมินจากคำตอบของคุณและการสัมภาษณ์ 30 นาที" } },
  { mark: "check", title: { en: "How to develop each skill", th: "รู้ว่าควรพัฒนาแต่ละทักษะอย่างไร" }, body: { en: "Advice for you, with things you can act on next.", th: "คำแนะนำเฉพาะคุณ พร้อมสิ่งที่นำไปลงมือทำต่อได้" } },
];

/** Paul as the expert, from his own facts of 28/10/2026. No hire counts, by his choice. */
export const FIT_EXPERT = {
  title: { en: "I have sat on both sides of the interview table", th: "ผมเคยนั่งอยู่ทั้งสองฝั่งของโต๊ะสัมภาษณ์" },
  role: { en: "Paul · founder of PunProfile · Marketing Director in Europe", th: "พอล · ผู้ก่อตั้ง PunProfile · Marketing Director ในยุโรป" },
  applicantHeading: { en: "As an applicant", th: "ฝั่งผู้สมัคร" },
  applicant: { en: "I moved to Spain to work in 2016. Since then I have sent thousands of applications and sat hundreds of interviews, so I know what it is like to send a CV and hear nothing back.", th: "ผมย้ายมาทำงานที่สเปนตั้งแต่ปี 2016 ตลอดเส้นทางนี้ผมสมัครงานไปหลายพันตำแหน่ง และผ่านการสัมภาษณ์มาหลายร้อยครั้ง ผมจึงเข้าใจดีว่าการส่ง CV ออกไปแล้วไม่มีใครตอบกลับเป็นอย่างไร" },
  hiringHeading: { en: "As a hiring manager", th: "ฝั่งผู้จ้าง" },
  hiring: { en: "Today I am a Marketing Director. The CVs that reach me have already passed the AI screen and the Talent Acquisition manager, and I have read hundreds of them, so I have seen not just good CVs but the ones that actually get the job. I also hire remote workers and freelancers in Marketing and MarTech for several employers.", th: "วันนี้ผมเป็น Marketing Director CV ที่มาถึงผมผ่านการคัดกรองจาก AI และ Talent Acquisition Manager มาแล้ว ผมอ่าน CV ระดับนี้มาหลายร้อยฉบับ จึงได้เห็นไม่ใช่แค่ CV ที่ดี แต่เป็น CV ที่ได้งานจริง นอกจากนี้ผมยังคัดเลือก remote worker และ freelancer ด้าน Marketing และ MarTech ให้กับหลายบริษัท" },
  bridge: { en: "In the 30-minute interview I read your profile the way a hiring manager in Europe would, and bring a marketer's eye to how you present yourself.", th: "ในการสัมภาษณ์ 30 นาที ผมจะอ่านโปรไฟล์ของคุณด้วยมุมมองเดียวกับ hiring manager ในยุโรป และใช้มุมมองด้านการตลาดช่วยให้คุณนำเสนอตัวเองได้ชัดขึ้น" },
  facts: [
    { en: "Working in Europe since 2016", th: "ทำงานในยุโรปตั้งแต่ปี 2016" },
    { en: "Based in Spain, clients across Europe, mostly the UK", th: "ประจำที่สเปน ดูแลลูกค้าทั่วยุโรป โดยเฉพาะ UK" },
    { en: "Marketing and MarTech hiring", th: "คัดเลือกคนด้าน Marketing และ MarTech" },
    { en: "Runs the “Jobs at companies in Europe” group", th: "ผู้ดูแลกลุ่ม “งานบริษัทในยุโรป”" },
  ],
  link: { en: "Read my story", th: "อ่านเรื่องราวของผม" },
} as const;
