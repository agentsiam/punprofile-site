import type { Copy } from "./copy";

/**
 * What PunProfile sells, and what it costs. Added 23/08/2026.
 *
 * **The words are Paul's**, from his review pass on `review-pricing-th.md` the
 * same day; the English is a translation of his Thai rather than the other way
 * round, as in `services.ts`.
 *
 * `SCREENED_FOR_YOU` and `NOTHING_FOUND` were the two written after his RETHINK
 * notes rather than by him. Both went back through `thai-review-queue.md` on
 * 23/08/2026 and both came back rewritten, so there is no unread Thai left in
 * this file.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS NOT `services.ts` WITH PRICES ADDED
 * ---------------------------------------------------------------------------
 *
 * `services.ts` sells three coaching offerings that end in a conversation, and
 * its own header refuses to print a price because `01_Project_Foundation.md`
 * still calls its table a pilot hypothesis. That has not changed.
 *
 * This file is the self-serve half, decided 23/08/2026: everything a candidate
 * can buy without talking to anyone, priced in one currency. The two must not be
 * merged. A grid mixing a 1,000 THB purchase with a 15,000 to 25,000 engagement
 * asks the reader to compare things that are not comparable.
 *
 * **One currency.** A token is the only unit. A matched role is 1, a Fit Report
 * is 20, and the packs below are the only prices printed anywhere on the site.
 * Coaching stays outside it, because it is a conversation and it is priced in
 * one.
 *
 * **No price appears on any product page**, by the same decision. A number
 * repeated across six marketing pages is six places for it to drift.
 */

/* -------------------------------------------------------------------- hero */

export const PRICING_HEADING: Copy = {
  en: "Start free, pay only for the features you choose",
  // Paul's wording, 23/08/2026. He replaced `ส่วนไหนฟรี และส่วนไหนมีค่าใช้จ่าย`,
  // which was his own 17/08 line and still stands whole on the landing page. The
  // new one frames the page as free-then-pay rather than free-versus-paid, which
  // is the structure the page actually has.
  th: "เริ่มใช้ฟรี จ่ายเฉพาะบริการที่คุณเลือก",
};

export const PRICING_INTRO: Copy = {
  en: "Use tokens for matched roles or the Fit Report. Pick the pack that fits how much you will use it.",
  // From Paul's wording of 23/08/2026, narrowed 02/11/2026 on his call. "Every
  // service on the site" was an overclaim: coaching is priced in a conversation
  // and three products are free, so a token buys exactly two things.
  th: "คุณใช้โทเคนแลกรับตำแหน่งงานที่คัดให้หรือ Fit Report ได้ เลือกแพ็กให้เหมาะกับปริมาณการใช้งานของคุณ",
};

/* -------------------------------------------------------------------- free */

/**
 * The free tier sits ABOVE the packs and is deliberately not a card beside them.
 *
 * Careersy's pricing page has no free row among its plan cards and explains free
 * credits separately further down; the same reasoning applies here. A free card
 * standing next to a paid pack invites a comparison between things that are not
 * alternatives to each other.
 */
export const FREE_HEADING: Copy = {
  en: "Which features are free",
  // Paul's wording, 23/08/2026. He replaced `ส่วนไหนฟรี` with the ฟีเจอร์
  // loanword, which matches the headline above it.
  th: "ใช้ฟรีได้อะไรบ้าง?",
};

export interface FreeItem {
  id: "jobs" | "check";
  name: Copy;
  body: Copy;
}

export const FREE_ITEMS: readonly FreeItem[] = [
  {
    id: "jobs",
    name: {
      en: "The jobs we screen for you",
      // Paul's wording, 17/08/2026, carried over from `home.ts`.
      th: "ตำแหน่งงานที่เราคัดมาให้",
    },
    body: {
      en: "Free for anyone to read.",
      th: "ประกาศงาน เปิดให้ทุกคนอ่านฟรี",
    },
  },
  {
    id: "check",
    name: { en: "EU Fit Check", th: "EU Fit Check" },
    body: {
      en: "Answer on your phone, and get your first read the moment you finish.",
      /*
       * Paul's wording, 23/08/2026, and the CUT is the point of it.
       *
       * The `home.ts` version of this sentence ends `จากนั้นจะมีคนอ่านคำตอบของคุณ
       * จริง ๆ และติดต่อกลับ`. He removed that clause here: "removed ... as
       * that's no longer true. No contact, only hot leads self qualify themself
       * and contact us."
       *
       * Clarified by him the same day, and the distinction is the whole of it:
       * **outbound contact has not stopped. The public promise of it has.** He
       * still contacts the most ready leads. What he will not do is tell every
       * finisher they will be contacted, because to a lead who is not ready that
       * is a promise nobody intends to keep.
       *
       * So this is a marketing-copy change and not a funnel change. The
       * 10/08/2026 decision that a person delivers the full result stands, and
       * `customer-journey.md` milestone 6 is unaffected.
       *
       * Three surfaces are deliberately NOT changed with it, because they are
       * not promises: `consent-copy.ts` asks PERMISSION to make contact, which is
       * the legal basis and must not be softened; `privacy.ts` states factually
       * that a human reads before contact; and `faq.ts` already carries his own
       * hedge, that a reply may take a while and its absence does not mean the
       * result was bad.
       */
      th: "ตอบคำถามบนมือถือได้เลย รับผลเบื้องต้นทันทีเมื่อทำเสร็จ",
    },
  },
];

/**
 * The value column of the free rows. The free rows are spec rows (B6), the same
 * shape as what a token buys, so free and paid read as one table in two halves.
 *
 * CV Check and the Job Search Dashboard join the two rows above on the page itself, read
 * from `products.ts`, because `FREE_SLUGS` there already says they are free and
 * a second list here would be a second answer to which products are free.
 */
export const FREE_VALUE: Copy = {
  en: "Free",
  th: "ฟรี",
};

/* ------------------------------------------------------------------- packs */

export const PACKS_HEADING: Copy = {
  en: "Token packs",
  // Paul's wording, 23/08/2026.
  th: "แพ็กโทเคน",
};

export interface Pack {
  id: "starter" | "standard" | "serious";
  name: Copy;
  /** Where the reader is, not what the pack contains. */
  tagline: Copy;
  thb: number;
  tokens: number;
  who: Copy;
  /** Exactly one pack carries it. */
  recommended?: boolean;
  /**
   * One extra that is NOT bought with tokens, and the reason it is its own
   * field rather than a clause in the line above it.
   *
   * Every other line on a card is what the pack's tokens buy. This is added on
   * top of them, so saying the two in one breath would have the card claim that
   * a token buys coaching, which is false: coaching is priced in a conversation
   * and `services.ts` refuses to print a figure for it at all.
   *
   * It is also time-limited, and the end date is in the copy rather than here.
   * See the record's decision note in `LANGUAGE-SYSTEM.md`.
   */
  bonus?: Copy;
}

/**
 * **CONFIRMED BY PAUL, 23/08/2026.** 500/10, 1,000/21 and 1,500/33, over his own
 * earlier 590/990/1,500, which were set before the token currency existed.
 *
 * **What the shape means, and it is the part to protect.** The unit price stays
 * flat at 50 THB. A bigger pack does not buy a cheaper token, it buys free ones:
 * 10, then 20 plus 1, then 30 plus 3. That keeps 50 THB true as the single
 * number a candidate has to hold, which is what the whole one-currency decision
 * was for, and it means the price of the thing never depends on how much of it
 * you bought. Discounting the token instead would make "1 token is 1 role" false
 * for everyone except starter-pack buyers.
 *
 * 50 THB is Paul's own answer of 22/08/2026 to what a Thai candidate would pay
 * for one role at 80% match, delivered one at a time. Every other price on the
 * site is a multiple of it.
 *
 * Round numbers on purpose. These are bank-transfer amounts somebody types into
 * a phone.
 */
export const PACKS: readonly Pack[] = [
  {
    id: "starter",
    name: { en: "Starter pack", th: "แพ็กเกจเริ่มต้น" },
    tagline: { en: "Trying it out", th: "ลองใช้บริการ" },
    thb: 500,
    tokens: 10,
    who: {
      en: "For someone who wants to see first how closely the roles we pick match what you are looking for.",
      th: "เหมาะกับคนที่อยากลองดูก่อนว่า ตำแหน่งที่เราคัดให้ตรงกับสิ่งที่คุณมองหาแค่ไหน",
    },
  },
  {
    id: "standard",
    name: { en: "Standard", th: "มาตรฐาน" },
    tagline: { en: "Job hunting", th: "กำลังหางานอยู่" },
    thb: 1000,
    tokens: 21,
    who: {
      en: "For someone applying every week who also wants the full assessment to plan the next step with.",
      th: "เหมาะกับคนที่สมัครงานเป็นประจำทุกสัปดาห์ และอยากได้ผลประเมินฉบับเต็มไว้ช่วยวางแผนขั้นต่อไป",
    },
    recommended: true,
  },
  {
    id: "serious",
    name: { en: "Serious pack", th: "แพ็กเกจเอาจริง" },
    tagline: { en: "Moving this year", th: "ตั้งใจย้ายปีนี้" },
    thb: 1500,
    tokens: 33,
    who: {
      en: "For someone set on moving to Europe within the year, searching steadily over the months ahead.",
      th: "เหมาะกับคนที่ตั้งใจย้ายไปยุโรปภายในปีนี้ และวางแผนหางานอย่างต่อเนื่องในช่วงหลายเดือนข้างหน้า",
    },
    bonus: {
      en: "We add one free hour of Coaching 1:1 to this pack, until 31 December 2026",
      th: "เราแถม Coaching 1:1 ฟรี 1 ชั่วโมงให้ด้วย ถึงวันที่ 31 ธันวาคม 2026",
    },
  },
];

/**
 * What a pack's tokens buy, said once for every pack rather than itemised on the
 * one card that had to sell. Added 12/11/2026 from a UX review Paul accepted.
 *
 * **The two uses are alternatives, not inclusions.** A pack is a balance, and
 * the same 33 tokens are either 33 roles or a Fit Report and 13 roles. The line
 * says `or` for that reason, and a card that listed both as things you get would
 * be claiming twice what the pack holds.
 *
 * `PACK_BUYS_ROLES` is the line for a pack that cannot reach the Fit Report's
 * price at all. Which pack that is comes out of the arithmetic rather than out
 * of an id, so a price change moves it without anyone editing this file.
 *
 * `{count}`, `{rest}` and the figures in them are substituted at render from
 * `TOKEN_PRICE`. Nothing here is typed, so no card can contradict the token
 * table printed above it.
 */
export const PACK_BUYS: Copy = {
  en: "{count} matched roles, or a Fit Report and {rest}",
  th: "ตำแหน่งงานที่คัดให้ {count} ตำแหน่ง หรือ Fit Report พร้อมอีก {rest}",
};

export const PACK_BUYS_ROLES: Copy = {
  en: "{count} matched roles",
  th: "ตำแหน่งงานที่คัดให้ {count} ตำแหน่ง",
};

/**
 * The unit after a count of roles, singular and plural, exactly as `TOKEN_UNIT`
 * does it for tokens. It exists because the Standard pack leaves one role after
 * a Fit Report and `1 roles` is the kind of thing that ships.
 */
export const ROLE_UNIT = {
  one: {
    en: "role",
    th: "ตำแหน่ง",
  },
  many: {
    en: "roles",
    th: "ตำแหน่ง",
  },
} as const;

/**
 * The badge on the recommended pack.
 *
 * **It says PunProfile recommends this one. It does not say most people choose
 * it.** Careersy's badge reads "Where most people land", which is a claim about
 * its own customers. PunProfile has none, so the same badge would be false, and
 * the Social Proof pillar being empty is exactly why. Do not let this drift back
 * toward a popularity claim once there are a few customers and the temptation
 * returns; that needs its own decision and a real number behind it.
 */
export const RECOMMENDED_BADGE: Copy = {
  en: "Recommended",
  // Paul's wording, 23/08/2026.
  th: "แพ็กเกจแนะนำ",
};

/* ---------------------------------------------------------------- includes */

export const INCLUDES_HEADING: Copy = {
  en: "Every pack comes with the same terms",
  // 02/11/2026, on Paul's call, over his 23/08/2026 line "it works on
  // everything", which said more than a token buys.
  th: "ทุกแพ็กใช้เงื่อนไขเดียวกัน",
};

/**
 * `SCREENED_FOR_YOU` replaces a line Paul rejected, and his reason is recorded
 * because it generalises: the first version said every role is screened by the
 * same standard as the ones posted in the group, and he wrote "this is not good
 * selling as it has to be better, not the same. and we dont mention the FB group
 * everywhere."
 *
 * Both halves hold. Telling a paying customer they get the same thing that is
 * free elsewhere argues against the purchase, and it was the second group
 * mention he cut in two passes, for the same reason each time: not every lead
 * knows the group exists.
 *
 * The true difference is not the standard, which genuinely is the same one. It
 * is who the screening was done FOR: the feed is one to many, a token is one to
 * one. `01_Project_Foundation.md` already draws that line internally; this is it
 * said to a candidate.
 */
export const INCLUDES: readonly Copy[] = [
  {
    en: "Tokens never expire",
    // Paul's wording, 23/08/2026.
    th: "โทเคนไม่มีวันหมดอายุ",
  },
  {
    en: "Withdraw them as cash if you have not used them",
    // Paul's wording, 23/08/2026. He changed ขอคืน to ถอนออกคืน.
    th: "ขอคืนเงินได้ หากยังไม่ได้ใช้โทเคน",
  },
  {
    en: "Screened against the criteria you set, not one list sent to everyone",
    // Paul's wording, 23/08/2026, over the line written after his RETHINK. See the note above.
    th: "คัดตามเงื่อนไขที่คุณกำหนด ไม่ใช่รายการเดียวกันที่ส่งให้ทุกคน",
  },
  {
    en: "Work rights are stated clearly on every role",
    // Paul's wording, 23/08/2026. This is the decision of 22/08/2026 that work
    // rights sit outside the match bar and are always named, said to a candidate.
    th: "ระบุสิทธิ์การทำงานของทุกตำแหน่งให้ชัด",
  },
];

/* ------------------------------------------------------------ what a token */

export const TOKEN_HEADING: Copy = {
  en: "What can one token do",
  // Paul's wording, 23/08/2026.
  th: "1 โทเคนใช้ทำอะไรได้บ้าง",
};

export const TOKEN_BODY: Copy = {
  en: "Matched roles and the Fit Report are both paid in tokens, and PunProfile only deducts them once you have received the service.",
  // Paul's wording, 23/08/2026, with the subject narrowed 02/11/2026 for the
  // same reason as `PRICING_INTRO`.
  th: "ทั้งบริการคัดตำแหน่งงานและ Fit Report ชำระด้วยโทเคน โดย PunProfile จะหักโทเคนเมื่อคุณได้รับบริการแล้วเท่านั้น",
};

export interface TokenRow {
  label: Copy;
  detail: Copy;
  /** Tokens, not baht. The packs are the only baht on the site. */
  tokens: number;
}

/**
 * Spec rows (B6) since 02/11/2026: the thing on the left, what it is in one
 * line, the price in tokens on the right. They were two bullets, and the Fit
 * Report bullet left out the 30-minute interview, which is what the Fit Report
 * is since 26/10/2026.
 */
export const TOKEN_ROWS: readonly TokenRow[] = [
  {
    label: {
      en: "A role that matches your criteria",
      th: "ตำแหน่งงานที่ตรงกับเงื่อนไขของคุณ",
    },
    detail: {
      en: "Sent to your Job Search Dashboard, with the work rights it needs stated",
      th: "ส่งไปยังแดชบอร์ดหางานของคุณ พร้อมระบุสิทธิ์การทำงานที่ผู้สมัครต้องมี",
    },
    tokens: 1,
  },
  {
    label: {
      en: "Fit Report",
      th: "Fit Report",
    },
    detail: {
      en: "A 30-minute interview with a coach, and the full report the same day",
      // Built from the Fit Report's own `how` steps in `products.ts`.
      th: "สัมภาษณ์ 30 นาทีกับโค้ช และรับรายงานฉบับเต็มภายในวันเดียวกัน",
    },
    tokens: 20,
  },
];

/** The unit after a token count, singular and plural. */
export const TOKEN_UNIT = {
  one: {
    en: "token",
    th: "โทเคน",
  },
  many: {
    en: "tokens",
    th: "โทเคน",
  },
} as const;

/**
 * The group of limits under the token rows. Slot 6 of the spine, placed above
 * the packs so the page states what a token does not buy before it asks for
 * one. The rows are `NOTHING_FOUND` below and the `limit` of Matched Jobs and
 * of the Fit Report, read from `products.ts` rather than copied.
 */
export const LIMITS_HEADING: Copy = {
  en: "What a token does not do",
  th: "ข้อจำกัดของบริการที่ใช้โทเคน",
};

/**
 * The rule that stops this reading like a slot machine, rewritten 23/08/2026.
 *
 * The first version said "if a round finds nothing close enough, no token is
 * deducted". Paul: "it's not shown to the candidates which round we run, for
 * them it's running all the time! real time!"
 *
 * Right that รอบ should not appear; a candidate should experience a standing
 * search rather than a schedule. **But this copy deliberately does not say real
 * time.** The batching test decided on 22/08/2026 exists because per-candidate
 * runs only work at this price if one run serves several candidates, so the
 * mechanism will be batched. Promising real time would be a claim the system
 * does not meet, in the product whose own principle is honesty over conversion
 * optimisation.
 *
 * `ต่อเนื่อง` is true under either mechanism and asserts nothing about
 * frequency.
 */
export const NOTHING_FOUND: Copy = {
  en: "We keep looking, and a token is only deducted once a role matching your criteria has reached you.",
  // Paul's wording, 23/08/2026, over the line written after his RETHINK. See the note above.
  th: "เราจะค้นหาต่อให้ และหักโทเคนเฉพาะเมื่อมีตำแหน่งที่ตรงกับเงื่อนไขส่งถึงคุณแล้ว",
};

/* ------------------------------------------------------------- calculator */

/**
 * The pack picker, rebuilt 02/11/2026 on Paul's call. It replaced a salary
 * calculator that subtracted a THB salary from a EUR target and divided the
 * raise by 50, which answered nothing its own heading asked.
 *
 * It asks how much the reader will use, and every number it shows comes from
 * their three answers or a pack on this page. No salary, no market figure,
 * nothing stored.
 */
export const CALC_HEADING: Copy = {
  en: "Work out which pack fits how much you will use it",
  // Paul's wording, 23/08/2026. The heading stayed; the tool now answers it.
  th: "ลองคำนวณดูว่าแพ็กไหนพอดีกับการใช้งานของคุณ",
};

export const CALC_FIT_REPORT: Copy = {
  en: "Do you want the Fit Report?",
  th: "คุณต้องการ Fit Report หรือไม่?",
};

export const CALC_FIT_YES: Copy = {
  en: "Yes",
  th: "ต้องการ",
};

export const CALC_FIT_NO: Copy = {
  en: "Not yet",
  th: "ยังไม่ต้องการ",
};

export const CALC_PER_WEEK: Copy = {
  en: "How many matched roles a week?",
  th: "ต้องการรับตำแหน่งงานที่คัดให้สัปดาห์ละกี่ตำแหน่ง?",
};

export const CALC_HOW_LONG: Copy = {
  en: "For how long?",
  th: "ต้องการรับต่อเนื่องนานเท่าใด?",
};

export const CALC_MONTHS = {
  one: {
    en: "month",
    th: "เดือน",
  },
  many: {
    en: "months",
    th: "เดือน",
  },
} as const;

export const CALC_NEED: Copy = {
  en: "You need about",
  th: "คุณต้องใช้ประมาณ",
};

export const CALC_BEST_FIT: Copy = {
  en: "The pack that fits",
  th: "แพ็กที่เหมาะกับการใช้งานของคุณ",
};

export const CALC_LEFT_OVER: Copy = {
  en: "left over, which never expire and can be refunded",
  th: "ที่เหลือไม่มีวันหมดอายุ และขอคืนเงินได้",
};

/**
 * Why the recommended set is the recommended set, shown rather than asserted.
 *
 * The finder answers a need no single pack covers by naming two, which reads as
 * an upsell until you check it. For 44 tokens the most 2,000 THB can buy is 43,
 * one short, and that is the fact that makes the extra 500 obviously necessary
 * rather than apparently optional. Both figures are computed at render.
 */
export const CALC_NEARLY: Copy = {
  en: "The cheapest set that covers it: {thb} THB would buy only {tokens}.",
  th: "นี่คือชุดที่ถูกที่สุดที่เพียงพอ ถ้าจ่าย {thb} THB จะได้เพียง {tokens}",
};

export const CALC_NOTE: Copy = {
  en: "Worked out from your answers and the pack prices on this page, counting a month as four weeks. A token is only deducted when a role reaches you.",
  th: "คำนวณจากคำตอบของคุณและราคาแพ็กในหน้านี้ โดยนับ 1 เดือนเป็น 4 สัปดาห์ และจะหักโทเคนก็ต่อเมื่อมีตำแหน่งงานส่งถึงคุณแล้วเท่านั้น",
};

/* --------------------------------------------------------------- questions */

export interface PricingQuestion {
  q: Copy;
  a: readonly Copy[];
}

/**
 * One question only, since 02/11/2026: "Do tokens expire?" was answered by
 * `INCLUDES` on the same screen. The rest of the FAQ lives in `faq.ts` and is
 * not duplicated here.
 *
 * The first pair is Paul's rewrite of 23/08/2026 of strings that are ALREADY
 * LIVE in `faq.ts`. The same rewrite has to land there too, or one question is
 * answered two ways on two pages.
 */
export const PRICING_QUESTIONS: readonly PricingQuestion[] = [
  {
    q: {
      en: "What does Coaching 1:1 cost?",
      th: "Coaching 1:1 ราคาเท่าไร?",
    },
    a: [
      {
        en: "It depends what you want help with and how far that help goes. We go through the details and tell you the cost clearly the first time we talk, and then you decide whether to go ahead.",
        th: "ค่าบริการขึ้นอยู่กับเรื่องที่คุณอยากให้เราช่วยและขอบเขตความช่วยเหลือที่ต้องการ เราจะคุยรายละเอียดพร้อมแจ้งค่าใช้จ่ายให้ชัดเจนตั้งแต่ครั้งแรก แล้วคุณค่อยตัดสินใจว่าจะใช้บริการหรือไม่",
      },
      {
        en: "The EU Fit Check is free.",
        th: "ทำ EU Fit Check และดูผลเบื้องต้นได้ฟรี",
      },
    ],
  },
];
