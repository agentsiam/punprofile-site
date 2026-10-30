import type { Copy } from "./copy";

/**
 * The paying candidate's own page, `/me/<token>`. Every string on it.
 *
 * **Draft Thai, not yet read by Paul.** Written to `thai-candidate-voice` in
 * the sibling repo's notes: consultative, the coach as โค้ช, เรา for the work
 * done together, English loanwords where this audience lives in them (CV,
 * LinkedIn, Fit Report, recruiter). It goes through the page review queue
 * (`npm run review:page`) before the page is sent to anyone but the first
 * candidate it was built for.
 *
 * Nothing here may use the internal vocabulary `assertCandidateSafe()` bans,
 * and nothing states a figure: the token count is rendered from the ledger.
 *
 * `{name}`, `{n}`, `{date}` are filled at render by `fill()` on the page.
 */

export const PORTAL_TITLE: Copy = { en: "Your page", th: "หน้าของคุณ" };

export const PORTAL_GREETING: Copy = { en: "Hi {name}", th: "สวัสดีครับ {name}" };
export const PORTAL_GREETING_NONAME: Copy = { en: "Hi", th: "สวัสดีครับ" };

export const PORTAL_INTRO: Copy = {
  en: "Everything we are working on together is here: what has been delivered, your CV files, and the jobs you are going for. Bookmark this page, it is yours.",
  th: "ทุกอย่างที่เราทำด้วยกันอยู่ในหน้านี้ ทั้งงานที่ส่งมอบแล้ว ไฟล์ CV และงานที่คุณกำลังสมัคร เก็บลิงก์นี้ไว้ได้เลยครับ เป็นหน้าของคุณเอง",
};

export const PORTAL_PRIVATE: Copy = {
  en: "Only people with this link can open this page. Please do not share it.",
  th: "หน้านี้เปิดได้เฉพาะคนที่มีลิงก์ รบกวนอย่าส่งต่อให้คนอื่นนะครับ",
};

/* ------------------------------------------------------------- tokens */

export const TOKENS_HEADING: Copy = { en: "Tokens left", th: "โทเคนคงเหลือ" };
export const TOKENS_OF: Copy = { en: "of {n} tokens", th: "จาก {n} โทเคน" };
export const TOKENS_MATCHED: Copy = {
  en: "Roles we have picked and sent you: {n}",
  th: "ตำแหน่งงานที่เราคัดส่งให้แล้ว {n} ตำแหน่ง",
};
export const TOKENS_RULE: Copy = {
  en: "A token is only used once you have received the service. Tokens never expire.",
  th: "โทเคนจะถูกหักเมื่อคุณได้รับบริการแล้วเท่านั้น และไม่มีวันหมดอายุครับ",
};

/* ------------------------------------------------------- deliverables */

export const WORK_HEADING: Copy = { en: "What you get", th: "สิ่งที่คุณจะได้รับ" };
export const WORK_EMPTY: Copy = {
  en: "Your coach will add each step here as it is planned.",
  th: "โค้ชจะเพิ่มแต่ละขั้นตอนไว้ที่นี่เมื่อวางแผนกันแล้วครับ",
};
export const WORK_STATUS: Record<"not_started" | "in_progress" | "delivered", Copy> = {
  not_started: { en: "Not started", th: "ยังไม่เริ่ม" },
  in_progress: { en: "In progress", th: "กำลังทำ" },
  delivered: { en: "Delivered", th: "ส่งมอบแล้ว" },
};
export const WORK_DUE: Copy = { en: "Due {date}", th: "กำหนด {date}" };
export const WORK_DONE_ON: Copy = { en: "Delivered {date}", th: "ส่งมอบ {date}" };

export const WORK_KIND: Record<string, Copy> = {
  fit_report: { en: "Fit Report", th: "Fit Report" },
  coaching_session: { en: "Session with your coach", th: "คุยกับโค้ช" },
  base_cv: { en: "Your main CV", th: "CV หลักของคุณ" },
  linkedin: { en: "LinkedIn profile", th: "โปรไฟล์ LinkedIn" },
  portfolio: { en: "Portfolio", th: "พอร์ตโฟลิโอ" },
  country_research: { en: "Country research", th: "ข้อมูลประเทศเป้าหมาย" },
  tailored_application: { en: "Application tailored to one role", th: "ใบสมัครที่ปรับให้ตรงกับตำแหน่ง" },
  interview_prep: { en: "Interview preparation", th: "เตรียมตัวสัมภาษณ์" },
  mock_interview: { en: "Mock interview", th: "ซ้อมสัมภาษณ์" },
  offer_review: { en: "Offer review", th: "ดูข้อเสนองานด้วยกัน" },
  contract_review: { en: "Contract review", th: "ดูสัญญาจ้างด้วยกัน" },
};

/* -------------------------------------------------------------- notes */

export const NOTES_HEADING: Copy = { en: "From your coach", th: "จากโค้ช" };

/* ---------------------------------------------------------------- CVs */

export const CV_HEADING: Copy = { en: "Your CV files", th: "ไฟล์ CV ของคุณ" };
export const CV_EMPTY: Copy = {
  en: "No file here yet. Send your latest CV to your coach on LINE or by email.",
  th: "ยังไม่มีไฟล์ครับ ส่ง CV ฉบับล่าสุดให้โค้ชทาง LINE หรืออีเมลได้เลย",
};
export const CV_VERSION: Copy = { en: "Version {n}", th: "ฉบับที่ {n}" };
export const CV_LATEST: Copy = { en: "Latest", th: "ล่าสุด" };
export const CV_THEIRS: Copy = { en: "The version you sent", th: "ฉบับที่คุณส่งมา" };
export const CV_OURS: Copy = { en: "Revised by your coach", th: "ฉบับที่โค้ชปรับให้" };
export const CV_CHANGED: Copy = { en: "What changed", th: "สิ่งที่ปรับ" };
export const CV_DOWNLOAD: Copy = { en: "Download", th: "ดาวน์โหลด" };

/* --------------------------------------------------------------- jobs */

export const JOBS_HEADING: Copy = { en: "Your job list", th: "งานที่คุณกำลังสมัคร" };
export const JOBS_INTRO: Copy = {
  en: "This list is yours. Move each job along as things happen. Roles marked Picked by PunProfile are ones we screened for you.",
  th: "ลิสต์นี้เป็นของคุณ อัปเดตสถานะได้เองทุกครั้งที่มีความคืบหน้า ตำแหน่งที่มีป้าย คัดโดย PunProfile คือตำแหน่งที่เราคัดมาให้ครับ",
};
export const JOBS_EMPTY: Copy = {
  en: "Nothing on the list yet. Add a job you are interested in, or wait for the first roles we pick for you.",
  th: "ยังไม่มีงานในลิสต์ เพิ่มงานที่คุณสนใจได้เลย หรือรอตำแหน่งแรกที่เราคัดให้ก็ได้ครับ",
};
export const JOBS_ALL: Copy = { en: "All", th: "ทั้งหมด" };
export const JOBS_STATUS: Record<string, Copy> = {
  interested: { en: "Saved", th: "บันทึกไว้" },
  applied: { en: "Applied", th: "สมัครแล้ว" },
  screening: { en: "Screening", th: "รอคัดเลือก" },
  interviewing: { en: "Interviewing", th: "สัมภาษณ์" },
  offer: { en: "Offer", th: "ได้ข้อเสนอ" },
  accepted: { en: "Accepted", th: "ตอบรับแล้ว" },
  rejected: { en: "Not this time", th: "ไม่ผ่านรอบนี้" },
  withdrawn: { en: "Withdrew", th: "ถอนตัว" },
};
export const JOBS_FROM_US: Copy = { en: "Picked by PunProfile", th: "คัดโดย PunProfile" };
export const JOBS_WHY: Copy = { en: "Why this role", th: "ทำไมเราคัดตำแหน่งนี้" };
export const JOBS_POSTING: Copy = { en: "Open the posting", th: "เปิดประกาศงาน" };
export const JOBS_CLOSES: Copy = { en: "Closes {date}", th: "ปิดรับ {date}" };
export const JOBS_APPLIED_ON: Copy = { en: "Applied {date}", th: "สมัครเมื่อ {date}" };
export const JOBS_FOLLOW_UP: Copy = { en: "Follow up on", th: "วันที่จะตามผล" };
export const JOBS_NOTES: Copy = { en: "Notes", th: "โน้ต" };
export const JOBS_SAVE: Copy = { en: "Save", th: "บันทึก" };
export const JOBS_CANCEL: Copy = { en: "Cancel", th: "ยกเลิก" };
export const JOBS_REMOVE: Copy = { en: "Remove", th: "ลบ" };
export const JOBS_REMOVE_CONFIRM: Copy = { en: "Remove for good", th: "ลบออกจากลิสต์" };
export const JOBS_DETAILS: Copy = { en: "Details", th: "รายละเอียด" };

export const ADD_JOB: Copy = { en: "Add a job", th: "เพิ่มงาน" };
export const ADD_ROLE: Copy = { en: "Job title", th: "ตำแหน่ง" };
export const ADD_EMPLOYER: Copy = { en: "Company", th: "บริษัท" };
export const ADD_COUNTRY: Copy = { en: "Country", th: "ประเทศ" };
export const ADD_LOCATION: Copy = { en: "City, or remote", th: "เมือง หรือ remote" };
export const ADD_URL: Copy = { en: "Link to the posting", th: "ลิงก์ประกาศงาน" };
export const ADD_SALARY: Copy = { en: "Salary, if stated", th: "เงินเดือน ถ้ามีระบุ" };
export const ADD_STATUS: Copy = { en: "Where you are with it", th: "ตอนนี้อยู่ขั้นไหน" };

/* ------------------------------------------------------------- errors */

export const LINK_INVALID_HEADING: Copy = { en: "This link no longer works", th: "ลิงก์นี้ใช้ไม่ได้แล้ว" };
export const LINK_INVALID_BODY: Copy = {
  en: "It may have expired, or a newer link has replaced it. Message your coach on LINE and they will send you a fresh one.",
  th: "ลิงก์อาจหมดอายุ หรือมีลิงก์ใหม่มาแทนแล้ว ทักโค้ชทาง LINE ได้เลยครับ เดี๋ยวส่งลิงก์ใหม่ให้",
};
export const ERROR_FIELDS: Copy = {
  en: "Fill in the job title, company and country first.",
  th: "กรอกตำแหน่ง บริษัท และประเทศก่อนนะครับ",
};
export const ERROR_GENERIC: Copy = {
  en: "That did not save. Try again in a moment.",
  th: "ยังบันทึกไม่สำเร็จ ลองใหม่อีกครั้งนะครับ",
};
export const LOADING: Copy = { en: "Loading...", th: "กำลังโหลด..." };
