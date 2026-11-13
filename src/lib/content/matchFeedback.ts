import type { Copy } from "./copy";

/**
 * The page a like or dislike link in the matched-role email lands on,
 * `/match-feedback/<token>?v=up|down`. Written register, no ครับ, PunProfile
 * in the third person, as the email it comes from.
 */

export const MATCH_FEEDBACK_WORKING: Copy = { th: "รอสักครู่", en: "One moment." };

export const MATCH_FEEDBACK_UP_HEADING: Copy = {
  th: "ขอบคุณสำหรับคำตอบ PunProfile บันทึกไว้แล้วว่าตำแหน่งนี้ตรงกับสิ่งที่คุณมองหา",
  en: "Thanks. PunProfile has recorded that this role fits what you are looking for.",
};

export const MATCH_FEEDBACK_DOWN_HEADING: Copy = {
  th: "ขอบคุณสำหรับคำตอบ PunProfile บันทึกไว้แล้วว่าตำแหน่งนี้ยังไม่ตรงกับสิ่งที่คุณมองหา",
  en: "Thanks. PunProfile has recorded that this role misses.",
};

export const MATCH_FEEDBACK_BODY: Copy = {
  th: "PunProfile จะใช้คำตอบนี้คัดตำแหน่งงานที่จะแนะนำให้คุณต่อไป",
  en: "PunProfile uses your answer to pick your next roles.",
};

export const MATCH_FEEDBACK_REASON_ASK: Copy = {
  th: "เหตุผลหลักคืออะไร (ไม่บังคับ)",
  en: "What was the main reason? (optional)",
};

export const MATCH_FEEDBACK_REASON_SAVED: Copy = { th: "บันทึกเหตุผลแล้ว", en: "Reason recorded." };

export const MATCH_FEEDBACK_SWITCH: Copy = {
  th: "หากกดผิด เปลี่ยนคำตอบได้",
  en: "Tapped the wrong one? Change your answer",
};

export const MATCH_FEEDBACK_DASHBOARD: Copy = { th: "เปิดแดชบอร์ดหางาน", en: "Open your Job Search Dashboard" };

/** Ids are stored on the row; the words are only ever shown. */
export const MATCH_FEEDBACK_REASONS: { id: string; label: Copy }[] = [
  { id: "closed", label: { th: "ปิดรับสมัครแล้ว", en: "The posting has closed" } },
  { id: "title_level", label: { th: "ชื่อตำแหน่งหรือระดับงานไม่ตรง", en: "Wrong title or level" } },
  { id: "location", label: { th: "สถานที่ทำงานไม่ตรง", en: "Wrong location" } },
  { id: "pay", label: { th: "ค่าตอบแทนต่ำเกินไป", en: "Pay too low" } },
  { id: "permit", label: { th: "บริษัทไม่สปอนเซอร์ใบอนุญาตทำงาน", en: "No work permit sponsorship" } },
  { id: "language", label: { th: "ต้องใช้ภาษาที่คุณพูดไม่ได้", en: "Needs a language you do not speak" } },
  { id: "applied", label: { th: "สมัครไปแล้ว", en: "Already applied" } },
  { id: "other", label: { th: "เหตุผลอื่น", en: "Something else" } },
];

export const MATCH_FEEDBACK_REASON_IDS = MATCH_FEEDBACK_REASONS.map((r) => r.id);
