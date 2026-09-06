import type { Copy } from "./copy";
import type { DimensionKey } from "@/lib/model";

/**
 * `/method`. Added 26/08/2026, Paul's call.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS PAGE EXISTS, AND WHAT IT IS ALLOWED TO SAY
 * ---------------------------------------------------------------------------
 *
 * `Narrative_System.md` gives every offer a slot 7, the thing that makes it
 * checkable, and the EU Fit Check's reads: *the four gates are published
 * reasoning in `10_Methodology.md`, not a claim.* On 26/08/2026 that was found
 * to be false in the only way that matters. The document is real and it is in
 * the coaching repo, where no reader can open it, so the home page's hero had
 * been carrying Matched Jobs' pipeline count instead. A record cannot cite a
 * page the reader cannot reach. This page is what makes the citation true.
 *
 * **It publishes the bars, as of 26/08/2026.** For one day it did not. The page
 * shipped with the gates and their questions and no numbers, because
 * `10_Methodology.md` was headed "Status: draft" and called them "**Proposed**
 * bars, for the owner to set", while `model.ts` › `GATES` implemented 4.0, 4.0,
 * 3.5 and 3.0 and the app scored real candidates against them daily. Printing a
 * number the owning document called undecided would have settled it by
 * publishing, which is backwards.
 *
 * Building this page is what forced the decision, and Paul made it the same day:
 * the bars are confirmed at the values already in the code, and the owning
 * document says so. Nothing in the app changed. What changed is that the numbers
 * are now a decision rather than a habit.
 *
 * **The order is not written here.** The page walks `GATES` from `model.ts`,
 * which is the same array `firstAction()` stops at. A published method that
 * could disagree with the implemented one is worse than no published method,
 * and importing it is the only version of this page that cannot drift.
 *
 * **The gate names are not written here either.** They are
 * `dimension.mobilityReadiness` and friends in `copy.ts`, already read back and
 * already on the spider chart. A second Thai name for an axis a candidate has
 * seen on their own result is the one-string-one-place failure.
 *
 * ---------------------------------------------------------------------------
 * THAI
 * ---------------------------------------------------------------------------
 *
 * **Every Thai string in this file has now been read back, 06/09/2026.** They
 * were drafts carrying `TH-UNREVIEWED` from the day the page shipped, which is
 * why `/method` was `NOT_YET_INDEXED`: linked, honest, and not offered to a
 * crawler as finished. Paul closed all twenty-five in one pass through
 * `thai-review-queue.md`, rewriting ten of them, so the marker and the tag both
 * come off together.
 */

export const METHOD_HEADING: Copy = {
  en: "The method behind the score",
  // Read back 06/09/2026.
  th: "วิธีประเมินที่อยู่เบื้องหลังคะแนน",
};

export const METHOD_INTRO: Copy = {
  en: "Every number this site gives you comes from the same method. It is written down here so you can judge it before you decide how much to trust it.",
  // Read back 06/09/2026.
  th: "ตัวเลขทุกตัวที่คุณเห็นบนเว็บนี้มาจากวิธีเดียวกัน เราเขียนวิธีนี้ไว้ให้อ่านก่อน คุณจะได้ตัดสินใจเองว่าจะเชื่อมากแค่ไหน",
};

export const CLAIM_HEADING: Copy = {
  en: "What it rests on",
  // Read back 06/09/2026.
  th: "ข้อสมมติหลักของวิธีนี้",
};

export const CLAIM_BODY: Copy = {
  en: "Getting hired in Europe is not mostly a question of being good enough. It is a question of being legible, and legibility can be measured.",
  // Paul's wording, 06/09/2026. The home page states the same claim from the reader's side,
  // in Paul's own approved wording; this states it as the premise of a method,
  // which is a different sentence doing a different job on a different page.
  th: "การได้งานในยุโรปไม่ได้อยู่ที่ว่าคุณเก่งพอหรือไม่เป็นหลัก แต่อยู่ที่ว่าคนอ่านโปรไฟล์มองเห็นสิ่งที่คุณมีหรือไม่ และเรื่องนี้วัดได้",
};

/** The two verbs, in this order. `10_Methodology.md` § 1 owns the reasoning. */
export const VERBS: readonly { name: Copy; body: Copy }[] = [
  {
    name: {
      en: "Reorganise",
      // Read back 06/09/2026.
      th: "จัดระเบียบ",
    },
    body: {
      en: "What you already have, so the market can read it. Same experience, made visible. This part is fast, and it is most of the gap.",
      // Paul's wording, 06/09/2026.
      th: "จัดสิ่งที่คุณมีอยู่แล้วให้ตลาดงานมองเห็น ประสบการณ์ยังเหมือนเดิม เพียงแต่นำเสนอให้ชัดขึ้น ขั้นนี้ทำได้เร็ว และปัญหาส่วนใหญ่มักอยู่ตรงนี้",
    },
  },
  {
    name: {
      en: "Upskill",
      // Read back 06/09/2026.
      th: "เติมทักษะที่ยังขาด",
    },
    body: {
      en: "What you genuinely do not have. Language before anything else. This part is slow, which is the reason to start it early rather than when it becomes the thing in the way.",
      // Paul's wording, 06/09/2026.
      th: "เติมสิ่งที่คุณยังไม่มีจริง ๆ โดยเริ่มจากภาษาเป็นอันดับแรก ขั้นนี้ต้องใช้เวลา จึงควรเริ่มให้เร็ว แทนที่จะรอจนมันกลายเป็นอุปสรรค",
    },
  },
];

export const THRESHOLD_HEADING: Copy = {
  en: "Thresholds, not scores",
  // Read back 06/09/2026.
  th: "เกณฑ์ผ่าน ไม่ใช่แค่คะแนน",
};

export const THRESHOLD_BODY: readonly Copy[] = [
  {
    en: "A score tells you where you stand. A threshold tells you whether you are ready, and only the second one is something you can act on.",
    // Paul's wording, 06/09/2026.
    th: "คะแนนบอกว่าคุณอยู่ตรงไหน ส่วนเกณฑ์ผ่านบอกว่าคุณพร้อมหรือยัง และมีเพียงอย่างหลังเท่านั้นที่นำไปวางแผนลงมือต่อได้",
  },
  {
    en: "So the method sets a bar for each dimension, and you are ready when you clear every bar rather than when the average looks respectable. The dimensions do not trade against each other: being good at the job does not give you the right to work there.",
    // Read back 06/09/2026.
    th: "วิธีนี้จึงตั้งเกณฑ์ไว้ในแต่ละด้าน คุณพร้อมเมื่อผ่านครบทุกด้าน ไม่ใช่เมื่อค่าเฉลี่ยดูดี เพราะแต่ละด้านทดแทนกันไม่ได้ ความเก่งในงานไม่ได้ทำให้คุณมีสิทธิ์ทำงานที่นั่น",
  },
];

export const GATES_HEADING: Copy = {
  en: "The four gates, in the order they are cleared",
  // Read back 06/09/2026.
  th: "สี่ด่าน เรียงตามลำดับที่ต้องผ่าน",
};

/**
 * The question each gate answers. Keyed by `DimensionKey` so the page can walk
 * `GATES` from `model.ts` and look each one up, which is what stops this list
 * and the scorer's order from ever disagreeing.
 *
 * The gate NAMES are not here. They are `dimension.*` in `copy.ts`.
 */
export const GATE_QUESTIONS: Record<DimensionKey, Copy> = {
  mobilityReadiness: {
    en: "Can you legally and practically be there?",
    // Read back 06/09/2026.
    th: "คุณไปอยู่ที่นั่นได้จริงหรือไม่ ทั้งในทางกฎหมายและในทางปฏิบัติ",
  },
  employability: {
    en: "Can you get interviews?",
    // Paul's wording, 06/09/2026.
    th: "คุณไปถึงขั้นสัมภาษณ์ได้หรือไม่",
  },
  europeanMarketFit: {
    en: "Are you competitive against local candidates?",
    // Read back 06/09/2026.
    th: "คุณแข่งกับผู้สมัครในประเทศนั้นได้หรือไม่",
  },
  professionalCapability: {
    en: "Can you do the job?",
    // Read back 06/09/2026.
    th: "คุณทำงานนั้นได้หรือไม่",
  },
};

/**
 * The label beside each bar. The NUMBER is never written here: the page reads
 * it off `GATES` in `model.ts`, the same array the scorer walks, so a published
 * bar and an enforced bar cannot become two different numbers.
 */
export const GATE_BAR: Copy = {
  en: "clears at",
  // Paul's wording, 06/09/2026.
  th: "เกณฑ์ผ่าน",
};

export const GATES_ORDER: Copy = {
  en: "This order, and not score order. Someone with no route to work there is polishing a CV for a job they cannot legally take.",
  // Paul's wording, 06/09/2026.
  th: "ต้องเรียงตามลำดับนี้ ไม่ใช่ตามคะแนน เพราะคนที่ยังไม่มีช่องทางไปทำงานที่นั่นอย่างถูกกฎหมาย ต่อให้ปรับ CV ดีแค่ไหน ก็ยังสมัครงานที่ตัวเองไม่มีสิทธิรับอยู่ดี",
};

export const GATES_LOWEST: Copy = {
  en: "And the lowest gate you have not cleared is the only one that matters this month. The method does not hand you a five-item list.",
  // Paul's wording, 06/09/2026.
  th: "และด่านแรกที่คุณยังไม่ผ่าน คือด่านเดียวที่สำคัญในเดือนนี้ วิธีนี้ไม่ได้ยื่นรายการห้าข้อให้คุณไปทำพร้อมกัน",
};

/**
 * Slot 6, and it comes before the ask at the foot. Two limits, and the second
 * one is `model.ts`'s own note made public: Financial Readiness is a fifth gate
 * in `10_Methodology.md` and is absent from `GATES` because its competency has
 * no survey input, so a bar would be checked against a permanently null score.
 * Flagged there, and flagged here rather than quietly dropped.
 */
export const LIMIT_HEADING: Copy = {
  en: "What it does not do",
  // Read back 06/09/2026.
  th: "สิ่งที่วิธีนี้ไม่ได้ทำ",
};

export const LIMIT_BODY: readonly Copy[] = [
  {
    en: "It measures what a form can reach. A bar you have not cleared is a sequence, not a refusal, and the method never scores something it cannot see.",
    // Paul's wording, 06/09/2026.
    th: "วิธีนี้วัดได้เฉพาะสิ่งที่แบบสอบถามเข้าถึง เกณฑ์ที่คุณยังไม่ผ่านบอกเพียงลำดับว่าควรทำอะไรก่อน ไม่ใช่คำตัดสินว่าคุณไปต่อไม่ได้ และวิธีนี้จะไม่ให้คะแนนสิ่งที่มองไม่เห็น",
  },
  {
    en: "The method names a fifth gate, whether you can afford to get there and land. The check does not score it, because nothing it asks you can measure that honestly.",
    // Paul's wording, 06/09/2026.
    th: "วิธีนี้มีด่านที่ห้า คือคุณมีเงินพอสำหรับการเดินทางและตั้งหลักที่นั่นหรือไม่ แต่แบบประเมินนี้ไม่ให้คะแนนด่านดังกล่าว เพราะไม่มีคำถามใดที่สามารถวัดเรื่องนี้ได้อย่างตรงไปตรงมา",
  },
];

export const METHOD_CLOSE: Copy = {
  en: "That is the whole method. See where you stand against it.",
  // Read back 06/09/2026.
  th: "ทั้งหมดนี้คือวิธีที่เราใช้ ลองดูว่าตอนนี้คุณอยู่ตรงไหนเมื่อวัดด้วยวิธีนี้",
};

/**
 * The home page's second hero proof, and it is a link rather than a sentence.
 *
 * Slot 7 says a proof is a figure, a document or a worked example and never an
 * adjective. "Our method is published" unlinked is an adjective; the same words
 * pointing at the page are a document the reader can open, which is the whole
 * difference.
 */
export const METHOD_PROOF: Copy = {
  en: "The method is published, gate by gate",
  // Read back 06/09/2026.
  th: "เปิดวิธีประเมินให้ดูครบทุกด่าน",
};
