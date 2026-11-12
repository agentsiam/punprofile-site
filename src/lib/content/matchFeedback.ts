import type { Copy } from "./copy";

/**
 * The page a like or dislike link in the matched-role email lands on,
 * `/match-feedback/<token>?v=up|down`. Written register, no ครับ, PunProfile
 * in the third person, as the email it comes from.
 */

export const MATCH_FEEDBACK_WORKING: Copy = { th: "รอสักครู่", en: "One moment." };

export const MATCH_FEEDBACK_UP_HEADING: Copy = {
  th: "ขอบคุณ PunProfile บันทึกแล้วว่าตำแหน่งนี้ตรงกับที่คุณมองหา",
  en: "Thanks. PunProfile has recorded that this role fits what you are looking for.",
};

export const MATCH_FEEDBACK_DOWN_HEADING: Copy = {
  th: "ขอบคุณ PunProfile บันทึกแล้วว่าตำแหน่งนี้ยังไม่ตรง",
  en: "Thanks. PunProfile has recorded that this role misses.",
};

export const MATCH_FEEDBACK_BODY: Copy = {
  th: "PunProfile ใช้คำตอบนี้คัดตำแหน่งถัดไปให้ตรงกับคุณมากขึ้น",
  en: "PunProfile uses your answer to pick your next roles.",
};

export const MATCH_FEEDBACK_REASON_ASK: Copy = {
  th: "เหตุผลหลักคืออะไร (ไม่บังคับ)",
  en: "What was the main reason? (optional)",
};

export const MATCH_FEEDBACK_REASON_SAVED: Copy = { th: "บันทึกเหตุผลแล้ว", en: "Reason recorded." };

export const MATCH_FEEDBACK_SWITCH: Copy = {
  th: "กดผิด? เปลี่ยนคำตอบ",
  en: "Tapped the wrong one? Change your answer",
};

export const MATCH_FEEDBACK_DASHBOARD: Copy = { th: "เปิดแดชบอร์ดหางาน", en: "Open your Job Search Dashboard" };

/** Ids are stored on the row; the words are only ever shown. */
export const MATCH_FEEDBACK_REASONS: { id: string; label: Copy }[] = [
  { id: "closed", label: { th: "ประกาศปิดรับแล้ว", en: "The posting has closed" } },
  { id: "title_level", label: { th: "ตำแหน่งหรือระดับไม่ตรง", en: "Wrong title or level" } },
  { id: "location", label: { th: "สถานที่ทำงานไม่ตรง", en: "Wrong location" } },
  { id: "pay", label: { th: "ค่าตอบแทนต่ำเกินไป", en: "Pay too low" } },
  { id: "permit", label: { th: "ไม่สนับสนุนใบอนุญาตทำงาน", en: "No work permit sponsorship" } },
  { id: "language", label: { th: "ต้องใช้ภาษาที่คุณไม่ได้ใช้", en: "Needs a language you do not speak" } },
  { id: "applied", label: { th: "เคยสมัครไปแล้ว", en: "Already applied" } },
  { id: "other", label: { th: "เหตุผลอื่น", en: "Something else" } },
];

export const MATCH_FEEDBACK_REASON_IDS = MATCH_FEEDBACK_REASONS.map((r) => r.id);
