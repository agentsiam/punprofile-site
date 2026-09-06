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
  en: "What PunProfile helps you with",
  th: "PunProfile ช่วยคุณเรื่องอะไรบ้าง",
};

export const SERVICES_INTRO: Copy = {
  en: "Career coaching is the core service every client starts with. The other two can be taken on their own, depending on what you actually need.",
  // Read back 25/08/2026. `Career Coaching` for `แคเรียร์โค้ชชิ่ง`.
  th: "Career Coaching เป็นบริการหลักที่ลูกค้าทุกคนเริ่มต้นด้วย ส่วนอีกสองบริการเลือกใช้แยกกันได้ตามสิ่งที่คุณต้องการ",
};

export const SERVICES: readonly Service[] = [
  {
    id: "coaching",
    core: true,
    // Read back 25/08/2026. Both columns now read `Career Coaching`, which
    // is what LR-01 does with a service name once the name is English.
    name: { en: "Career Coaching", th: "Career Coaching" },
    question: {
      en: "Where should you be heading, and why?",
      th: "คุณควรมุ่งไปทางไหน และเพราะอะไร",
    },
    summary: {
      en: "This is where every client starts. We get the direction clear before writing a single document, because however good a CV is, sent into the wrong market it is still an application aimed at nothing.",
      th: "นี่คือจุดเริ่มต้นของลูกค้าทุกคน เราจะช่วยกันหาทิศทางให้ชัดก่อนลงมือเขียนเอกสาร เพราะต่อให้ CV ดีแค่ไหน ถ้าส่งไปผิดตลาด ก็ยังเป็นการสมัครที่ไม่ตรงเป้าอยู่ดี",
    },
    includes: [
      {
        en: "Getting the direction and the goal clear: the role, the industry, the country",
        th: "หาทิศทางและกำหนดเป้าหมายให้ชัด ทั้งตำแหน่ง อุตสาหกรรม และประเทศ",
      },
      {
        en: "A realistic look at where you stand right now against what the European market is asking for",
        th: "ประเมินตามความเป็นจริงว่าตอนนี้คุณอยู่ตรงไหน เมื่อเทียบกับสิ่งที่ตลาดงานยุโรปต้องการ",
      },
      {
        en: "Thinking through and deciding on a career change and a move abroad",
        th: "ช่วยคิดและตัดสินใจเรื่องการเปลี่ยนสายงานและการย้ายประเทศ",
      },
      {
        en: "Finding the right position to stand in: what makes you worth hiring, and which employers are looking for someone like you",
        th: "หาจุดยืนที่ใช่: อะไรทำให้คุณน่าจ้าง และนายจ้างแบบไหนกำลังมองหาคนอย่างคุณ",
      },
      // Added 17/08/2026 (Paul). The sessions were always in English; saying so
      // turns a fact about how the service runs into a reason to buy it, since
      // the interview this audience is preparing for is in English too.
      //
      // EN-FIRST, which is the wrong direction for this file: its header records
      // that the words are Paul's Thai and the English is the translation. This
      // one arrived in English, so the Thai below is mine and awaits his pass.
      {
        en: "Sessions are held mainly in English, so every conversation doubles as practice for the interviews you are preparing for",
        // Paul's wording, 17/08/2026. `เป็นหลัก` added, and it is a promise being
        // made accurate rather than softened: sessions are mainly in English, and a
        // flat claim that they ARE in English is one a Thai reader could hold
        // against the first session that switches.
        th: "เซสชันโค้ชชิ่งใช้ภาษาอังกฤษเป็นหลัก ทุกครั้งที่คุยกันจึงได้ฝึกภาษาอังกฤษสำหรับการสัมภาษณ์ไปในตัว",
      },
    ],
    image: {
      src: "/services/direction.jpg",
      alt: {
        en: "The PunProfile character climbing steps towards a signpost",
        th: "ตัวการ์ตูน PunProfile กำลังเดินขึ้นบันไดไปหาป้ายบอกทาง",
      },
    },
    answers: "mobilityReadiness",
  },
  {
    id: "profile",
    core: false,
    name: {
      en: "Getting your profile ready to apply",
      th: "ปรับโปรไฟล์ให้พร้อมสมัครงาน",
    },
    question: {
      en: "Does your profile say who you are clearly and compellingly enough?",
      th: "โปรไฟล์ของคุณสื่อสารตัวตนได้ชัดและน่าสนใจพอหรือยัง",
    },
    summary: {
      en: "This service builds the core set of documents you reuse for every application. We get the base versions ready; tailoring them to a specific role is the next service.",
      th: "บริการนี้จะช่วยสร้างชุดเอกสารหลักที่คุณนำกลับมาใช้เป็นพื้นฐานในการสมัครแต่ละครั้งได้ เราจะทำเวอร์ชันตั้งต้นให้พร้อม ส่วนการปรับให้ตรงกับแต่ละตำแหน่งจะอยู่ในบริการถัดไป",
    },
    includes: [
      {
        en: "A master CV to use as the template every other version comes from",
        th: "CV ฉบับหลักสำหรับใช้เป็นต้นแบบของทุกฉบับ",
      },
      {
        en: "Your LinkedIn profile, from the headline, summary and experience through to the keywords recruiters actually search",
        th: "โปรไฟล์ LinkedIn ตั้งแต่พาดหัว บทสรุป และประสบการณ์ ไปจนถึงคีย์เวิร์ดที่รีครูตเตอร์ใช้ค้นหาผู้สมัคร",
      },
      {
        en: "A portfolio site for non-IT fields, built from your real results and cases, not just a project list like a developer's portfolio",
        th: "เว็บไซต์ Portfolio สำหรับสายงานนอกไอที สร้างจากผลงานและกรณีศึกษาจริงของคุณ ไม่ใช่เพียงรายการโปรเจกต์",
      },
    ],
    image: {
      src: "/services/profile.jpg",
      alt: {
        en: "The PunProfile character beside a laptop showing a profile page",
        th: "ตัวการ์ตูน PunProfile ยืนข้างแล็ปท็อปที่เปิดหน้าโปรไฟล์อยู่",
      },
    },
    answers: "employability",
  },
  {
    id: "applications",
    core: false,
    name: {
      en: "Handling an application start to finish",
      th: "ดูแลการสมัครงานตั้งแต่ต้นจนจบ",
    },
    question: {
      en: "What does it actually take to run one application through every stage?",
      th: "สมัครงานหนึ่งตำแหน่งให้ครบทุกขั้นตอน ต้องทำอย่างไรบ้าง",
    },
    summary: {
      en: "We handle applications one role at a time, from finding the job through to signing the contract. The roles we shortlist are searched specifically against your profile and your goals, not one list sent to everybody.",
      th: "เราทำงานร่วมกับคุณในการสมัครทีละตำแหน่ง ตั้งแต่ค้นหางานจนถึงขั้นเซ็นสัญญา ตำแหน่งที่คัดให้จะค้นหาตามโปรไฟล์และเป้าหมายของคุณโดยเฉพาะ ไม่ใช่รายการเดียวที่ส่งให้ทุกคน",
    },
    includes: [
      {
        en: "Shortlisting roles that match your profile and your goals",
        th: "คัดตำแหน่งที่ตรงกับโปรไฟล์และเป้าหมายของคุณ",
      },
      {
        en: "Tailoring your CV and cover letter to each role",
        th: "ปรับ CV และจดหมายสมัครงานให้ตรงกับแต่ละตำแหน่ง",
      },
      {
        en: "Interview preparation for that specific role and that specific company",
        th: "เตรียมสัมภาษณ์ให้ตรงกับตำแหน่งและบริษัทนั้นโดยเฉพาะ",
      },
      {
        en: "Evaluating the offer, helping you negotiate, and checking the contract",
        th: "ช่วยประเมินข้อเสนอ เตรียมการเจรจาต่อรอง และชี้ประเด็นในสัญญาที่ควรสอบถามเพิ่มเติม",
      },
    ],
    image: {
      src: "/services/applications.jpg",
      alt: {
        en: "The PunProfile character reading a document through a magnifying glass",
        th: "ตัวการ์ตูน PunProfile กำลังส่องเอกสารด้วยแว่นขยาย",
      },
    },
    answers: "europeanMarketFit",
  },
];

/** AI runs through all three rather than being a fourth product. */
export const AI_NOTE: Copy = {
  en: "AI is part of all three services. You learn to use it yourself, for drafting, preparing and researching, and PunProfile uses it behind the scenes to work faster without lowering the quality of the thinking.",
  th: "AI เป็นส่วนหนึ่งของทั้ง 3 บริการ คุณจะได้เรียนรู้วิธีใช้ AI ด้วยตัวเองเพื่อช่วยร่าง เตรียมตัว และค้นคว้าข้อมูล ส่วน PunProfile ใช้ AI ช่วยงานเบื้องหลังให้รวดเร็วขึ้น โดยยังใช้การคิดและการตัดสินใจของคนเป็นหลัก",
};

export const CORE_BADGE: Copy = { en: "Core service", th: "บริการหลัก" };

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
  en: "Your result points here",
  th: "ผลประเมินของคุณชี้มาที่บริการนี้",
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
  en: "Working with a person",
  // TH-UNREVIEWED, 06/09/2026.
  th: "งานส่วนที่ต้องทำร่วมกับคน",
};

export const SERVICES_PAGE_HEADING: Copy = {
  en: "Three services, and the one you start with",
  // TH-UNREVIEWED, 06/09/2026.
  th: "สามบริการ และบริการที่คุณจะเริ่มต้นด้วย",
};

export const SERVICES_PAGE_INTRO: Copy = {
  en: "The tools read what you already have. This is the part where someone reads it with you and decides what to do about it.",
  // TH-UNREVIEWED, 06/09/2026.
  th: "เครื่องมือต่าง ๆ ทำหน้าที่อ่านสิ่งที่คุณมีอยู่แล้ว ส่วนนี้คือการที่มีคนอ่านไปพร้อมกับคุณ แล้วช่วยตัดสินใจว่าจะทำอะไรต่อ",
};

export const ENGAGEMENT_HEADING: Copy = {
  en: "How an engagement runs",
  // TH-UNREVIEWED, 06/09/2026.
  th: "การทำงานร่วมกันเป็นอย่างไร",
};

export const ENGAGEMENT_LEDE: Copy = {
  en: "Four steps, and the first one is free. Nothing is scoped or priced until we both know what you are actually aiming at.",
  // TH-UNREVIEWED, 06/09/2026. `ไม่มีค่าใช้จ่าย` rather than the shorter word,
  // which is the form `faq.ts` and the product pages already use for this.
  th: "สี่ขั้นตอน โดยขั้นแรกไม่มีค่าใช้จ่าย เราจะยังไม่กำหนดขอบเขตงานหรือราคา จนกว่าทั้งสองฝ่ายจะเห็นตรงกันว่าคุณกำลังมุ่งไปทางไหน",
};

export interface EngagementStep {
  lead: Copy;
  body: Copy;
}

export const ENGAGEMENT: readonly EngagementStep[] = [
  {
    lead: {
      en: "A first conversation, at no charge",
      // TH-UNREVIEWED, 06/09/2026.
      th: "คุยกันครั้งแรก โดยไม่มีค่าใช้จ่าย",
    },
    body: {
      en: "Thirty minutes on where you are and what you are aiming at. If nothing here is the right thing for you, that is what the half hour is for.",
      // TH-UNREVIEWED, 06/09/2026.
      th: "ครึ่งชั่วโมงเพื่อคุยว่าตอนนี้คุณอยู่ตรงไหนและตั้งเป้าอะไรไว้ ถ้าไม่มีบริการไหนที่เหมาะกับคุณ ครึ่งชั่วโมงนี้ก็มีไว้เพื่อบอกแบบนั้น",
    },
  },
  {
    lead: {
      en: "The direction, before any document",
      // TH-UNREVIEWED, 06/09/2026.
      th: "หาทิศทางให้ชัด ก่อนลงมือทำเอกสาร",
    },
    body: {
      en: "The role, the industry and the country, decided together and written down, because however good a CV is, sent into the wrong market it is still an application aimed at nothing.",
      // TH-UNREVIEWED, 06/09/2026. The reasoning is the `coaching` service's own
      // summary above, which is Paul's Thai; this line points at it rather than
      // replacing it.
      th: "ตำแหน่ง อุตสาหกรรม และประเทศ ตัดสินใจร่วมกันและเขียนไว้ให้ชัด เพราะต่อให้ CV ดีแค่ไหน ถ้าส่งไปผิดตลาด ก็ยังเป็นการสมัครที่ไม่ตรงเป้าอยู่ดี",
    },
  },
  {
    lead: {
      en: "The documents you reuse",
      // TH-UNREVIEWED, 06/09/2026.
      th: "ชุดเอกสารที่คุณใช้ซ้ำได้",
    },
    body: {
      en: "A master CV, a LinkedIn profile and, where the field asks for one, a portfolio. Base versions, built once and tailored per role afterwards.",
      // TH-UNREVIEWED, 06/09/2026.
      th: "CV ฉบับหลัก โปรไฟล์ LinkedIn และเว็บไซต์ Portfolio ในสายงานที่ต้องใช้ ทำเวอร์ชันตั้งต้นไว้ก่อน แล้วค่อยปรับให้ตรงกับแต่ละตำแหน่ง",
    },
  },
  {
    lead: {
      en: "One application at a time, to the end",
      // TH-UNREVIEWED, 06/09/2026.
      th: "สมัครทีละตำแหน่ง จนจบกระบวนการ",
    },
    body: {
      en: "Shortlist, tailor, prepare for that specific interview, then read the offer and the contract together. The CV goes out under your name and the person in the interview is you.",
      // TH-UNREVIEWED, 06/09/2026. The closing clause is Paul's own, from
      // `NOT_FOR` in `coaching.ts`.
      th: "คัดตำแหน่ง ปรับเอกสาร เตรียมสัมภาษณ์ให้ตรงกับที่นั่น แล้วอ่านข้อเสนอและสัญญาไปด้วยกัน CV ต้องส่งออกไปในชื่อของคุณ และคนที่นั่งสัมภาษณ์ก็คือคุณ",
    },
  },
];

export const SERVICES_FAQ_INTRO: Copy = {
  en: "Four things people ask before the first conversation.",
  // TH-UNREVIEWED, 06/09/2026.
  th: "สี่เรื่องที่คนมักถามก่อนจะได้คุยกันครั้งแรก",
};

export interface ServiceFaq {
  q: Copy;
  a: Copy;
}

export const SERVICES_FAQ: readonly ServiceFaq[] = [
  {
    q: {
      en: "Do I have to take the coaching to get the other two?",
      // TH-UNREVIEWED, 06/09/2026.
      th: "ต้องใช้บริการโค้ชชิ่งก่อนถึงจะใช้อีกสองบริการได้ไหม",
    },
    a: {
      en: "No. The other two can be taken on their own. The coaching is where every client starts because the direction usually turns out to be the thing that was unclear, not the documents.",
      // TH-UNREVIEWED, 06/09/2026.
      th: "ไม่ต้อง อีกสองบริการเลือกใช้แยกกันได้ ที่ลูกค้าทุกคนเริ่มจากโค้ชชิ่ง เพราะส่วนใหญ่แล้วสิ่งที่ยังไม่ชัดคือทิศทาง ไม่ใช่ตัวเอกสาร",
    },
  },
  {
    q: {
      en: "What does it cost?",
      // TH-UNREVIEWED, 06/09/2026.
      th: "ค่าบริการเท่าไหร่",
    },
    a: {
      en: "It depends on which of the three you need and how far you already are, so it is settled in the first conversation rather than on this page. The tools have their own prices and those are published.",
      // TH-UNREVIEWED, 06/09/2026. It points at `/pricing` in words rather than
      // quoting a number, which is the rule the product pages follow.
      th: "ขึ้นอยู่กับว่าคุณต้องใช้บริการไหนบ้าง และตอนนี้คุณไปถึงขั้นไหนแล้ว จึงตกลงกันในการคุยครั้งแรกแทนที่จะระบุไว้ในหน้านี้ ส่วนเครื่องมือต่าง ๆ มีราคาประกาศไว้แยกต่างหาก",
    },
  },
  {
    q: {
      en: "Do I need to be in Europe already?",
      // TH-UNREVIEWED, 06/09/2026.
      th: "ต้องอยู่ในยุโรปอยู่แล้วหรือเปล่า",
    },
    a: {
      en: "No. Most of the people we work with are still in Thailand, and the sessions are held online.",
      // TH-UNREVIEWED, 06/09/2026.
      th: "ไม่ต้อง คนส่วนใหญ่ที่เราทำงานด้วยยังอยู่ในประเทศไทย และเซสชันจัดแบบออนไลน์",
    },
  },
  {
    q: {
      en: "What language are the sessions in?",
      // TH-UNREVIEWED, 06/09/2026.
      th: "เซสชันใช้ภาษาอะไร",
    },
    a: {
      en: "Mainly English, so every conversation doubles as practice for the interviews you are preparing for. Anything that has to be precise can be said in Thai.",
      // TH-UNREVIEWED, 06/09/2026. The first clause is Paul's own wording from
      // the coaching service's `includes` above, including `เป็นหลัก`, which is
      // there because a flat claim that sessions ARE in English is one a reader
      // could hold against the first session that switches.
      th: "ใช้ภาษาอังกฤษเป็นหลัก ทุกครั้งที่คุยกันจึงได้ฝึกภาษาสำหรับการสัมภาษณ์ไปในตัว ส่วนเรื่องที่ต้องสื่อสารให้แม่นยำ พูดภาษาไทยได้",
    },
  },
];

export const SERVICES_CLOSE_HEADING: Copy = {
  en: "Start with the half hour",
  // TH-UNREVIEWED, 06/09/2026.
  th: "เริ่มจากการคุยกันครึ่งชั่วโมง",
};

export const SERVICES_CLOSE_BODY: Copy = {
  en: "Tell me where you are and what you are aiming at. If none of this is the right thing for you, I would rather say so in the first conversation than in the third.",
  // TH-UNREVIEWED, 06/09/2026. First person, per `DESTINATIONS.contact` in
  // `cta.ts`: the reader reaches a person, not a company.
  th: "บอกผมว่าตอนนี้คุณอยู่ตรงไหนและตั้งเป้าอะไรไว้ ถ้าไม่มีอะไรตรงกับคุณเลย ผมอยากบอกตั้งแต่การคุยครั้งแรก มากกว่าจะมาบอกตอนครั้งที่สาม",
};
