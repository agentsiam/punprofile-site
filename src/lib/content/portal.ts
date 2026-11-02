import type { Copy } from "./copy";

/**
 * The paying candidate's own page, `/me`, and its sign-in. Every string on it.
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

export const PORTAL_TITLE: Copy = { en: "Job Search Dashboard", th: "แดชบอร์ดหางาน" };

export const PORTAL_GREETING: Copy = { en: "Hello {name}", th: "สวัสดีคุณ {name}" };
export const PORTAL_GREETING_NONAME: Copy = { en: "Hello", th: "สวัสดี" };

export const PORTAL_INTRO: Copy = {
  en: "Your target roles, the CV for each, the jobs PunProfile picks for you and the progress of every application, all on this page.",
  th: "ตำแหน่งเป้าหมาย CV สำหรับแต่ละตำแหน่ง ตำแหน่งงานที่ PunProfile คัดให้ และความคืบหน้าของทุกใบสมัคร ดูได้ในหน้านี้",
};

export const PORTAL_INTRO_SHORT: Copy = {
  en: "Track your job search with PunProfile on this page.",
  th: "ติดตามการสมัครงานของคุณกับ PunProfile ได้ในหน้านี้",
};

/* ------------------------------------------------------------- sign-in */

export const SIGNIN_HEADING: Copy = { en: "Sign in to your Job Search Dashboard", th: "เข้าสู่แดชบอร์ดหางาน" };
export const SIGNIN_BODY: Copy = {
  en: "Enter your email and the 6-digit code PunProfile emailed you when your Job Search Dashboard was activated. The code does not change, so keep that email.",
  th: "กรอกอีเมลและรหัส 6 หลักที่ PunProfile ส่งให้ทางอีเมลเมื่อเปิดใช้งานแดชบอร์ดหางานของคุณ รหัสนี้ไม่เปลี่ยน โปรดเก็บอีเมลฉบับนั้นไว้",
};
export const SIGNIN_EMAIL: Copy = { en: "Email", th: "อีเมล" };
export const SIGNIN_CODE: Copy = { en: "6-digit code", th: "รหัส 6 หลัก" };
export const SIGNIN_LOST: Copy = { en: "Can't find the code? Contact PunProfile on LINE for a new one.", th: "หากไม่พบรหัส โปรดติดต่อ PunProfile ทาง LINE เพื่อรับรหัสใหม่" };
export const SIGNIN_LOCKED: Copy = { en: "Too many incorrect attempts. Try again in 1 hour, or contact PunProfile on LINE for a new code.", th: "ใส่รหัสผิดเกินจำนวนครั้งที่กำหนด โปรดลองใหม่ในอีก 1 ชั่วโมง หรือติดต่อ PunProfile ทาง LINE เพื่อรับรหัสใหม่" };
export const SIGNIN_VERIFY: Copy = { en: "Sign in", th: "เข้าสู่ระบบ" };
export const SIGNIN_BAD_CODE: Copy = {
  en: "The email and code do not match. Check the code in the email from PunProfile.",
  th: "อีเมลและรหัสไม่ตรงกัน โปรดตรวจสอบรหัสในอีเมลจาก PunProfile",
};
export const NO_ACCESS_HEADING: Copy = {
  en: "This email does not have a Job Search Dashboard yet",
  th: "PunProfile ยังไม่ได้เปิดแดชบอร์ดหางานสำหรับอีเมลนี้",
};
export const NO_ACCESS_BODY: Copy = {
  en: "Contact PunProfile on LINE to have it opened for this email.",
  th: "โปรดติดต่อ PunProfile ทาง LINE เพื่อเปิดใช้งานสำหรับอีเมลนี้",
};
export const COACH_HERE: Copy = {
  en: "You are signed in as a coach. Open a candidate's Job Search Dashboard from the CRM.",
  th: "คุณเข้าสู่ระบบในฐานะโค้ช เปิดแดชบอร์ดหางานของผู้สมัครได้จาก CRM",
};
export const SIGN_OUT: Copy = { en: "Sign out", th: "ออกจากระบบ" };

/* ---------------------------------------------------------------- tabs */

export const TAB_OVERVIEW: Copy = { en: "Overview", th: "ภาพรวม" };
export const TAB_TRACKER: Copy = { en: "Applications", th: "การสมัครงาน" };
export const TAB_FEED: Copy = { en: "Jobs picked for you", th: "ตำแหน่งที่คัดให้" };
export const FEED_INTRO: Copy = {
  en: "Jobs PunProfile screened in the last 30 days in {countries}, matching {role}. Save one to add it to your applications.",
  th: "ตำแหน่งงานสาย {role} ใน {countries} ที่ PunProfile คัดไว้ในช่วง 30 วันที่ผ่านมา กดบันทึกเพื่อเพิ่มเข้ารายการสมัครงาน",
};
export const FEED_EMPTY: Copy = {
  en: "No new jobs for your target in the last 30 days. New ones appear here once PunProfile screens them.",
  th: "ในช่วง 30 วันที่ผ่านมา PunProfile ยังไม่ได้คัดตำแหน่งที่ตรงกับเป้าหมายของคุณ เมื่อมีตำแหน่งใหม่ที่ผ่านการคัดแล้ว จะแสดงที่นี่",
};
export const FEED_NO_TARGET: Copy = {
  en: "Your target country and role are not set yet. Contact PunProfile on LINE to set them.",
  th: "ยังไม่ได้ระบุประเทศและสายงานเป้าหมาย โปรดติดต่อ PunProfile ทาง LINE เพื่อระบุประเทศและสายงานที่ต้องการสมัคร",
};
export const FEED_SAVE: Copy = { en: "Save", th: "บันทึก" };
export const FEED_SAVED: Copy = { en: "Saved", th: "บันทึกแล้ว" };
export const FEED_SEEN: Copy = { en: "Screened {date}", th: "คัดเมื่อ {date}" };
export const FEED_UPDATED: Copy = { en: "Updated {date}", th: "อัปเดตล่าสุด {date}" };
export const TITLES_HEADING: Copy = { en: "Target roles", th: "ตำแหน่งเป้าหมาย" };
export const TITLES_NOTE: Copy = { en: "Each target role has its own CV, and each job in your applications belongs to one of them.", th: "แต่ละตำแหน่งเป้าหมายใช้ CV แยกกัน ส่วนตำแหน่งงานในรายการสมัครงานจะจัดกลุ่มตามตำแหน่งเป้าหมาย" };
export const TITLES_FIRST: Copy = { en: "Priority", th: "ลำดับแรก" };
export const TITLES_EMPTY: Copy = { en: "No target roles yet. They are set with PunProfile in your first session.", th: "ยังไม่มีตำแหน่งเป้าหมาย คุณจะกำหนดร่วมกับ PunProfile ในการพูดคุยครั้งแรก" };
export const TITLE_STATS: Copy = { en: "{applied} applied · {interviewing} interviewing", th: "สมัครแล้ว {applied} · สัมภาษณ์ {interviewing}" };
export const CV_BASE: Copy = { en: "Main CV", th: "CV หลัก" };
export const CV_FOR_TITLE: Copy = { en: "CV for {title}", th: "CV สำหรับ {title}" };
export const CV_EARLIER: Copy = { en: "Earlier versions ({n})", th: "ฉบับก่อนหน้า ({n})" };
export const CV_NONE_FOR_TITLE: Copy = { en: "No CV for this role yet. PunProfile adds it here.", th: "ยังไม่มี CV สำหรับตำแหน่งนี้ PunProfile จะเพิ่มไว้ที่นี่" };
export const CV_TAILORED: Copy = { en: "Tailored to a job ad", th: "CV ที่ปรับตามประกาศรับสมัคร" };
export const CV_OTHER: Copy = { en: "Other CVs", th: "CV อื่น ๆ" };
export const JOB_TITLE: Copy = { en: "Target role", th: "ตำแหน่งเป้าหมาย" };
export const JOB_TITLE_NONE: Copy = { en: "Not set", th: "ยังไม่ระบุ" };
export const TITLE_ALL: Copy = { en: "All roles", th: "ทุกตำแหน่ง" };
export const FEED_INTRO_TITLES: Copy = { en: "Jobs PunProfile screened in the last 30 days that match your target roles and countries. Save one to add it to your applications.", th: "ตำแหน่งงานที่ PunProfile คัดไว้ใน 30 วันที่ผ่านมา ตรงกับตำแหน่งและประเทศเป้าหมายของคุณ กดบันทึกเพื่อเพิ่มเข้ารายการสมัครงาน" };
export const FEED_TITLE_EMPTY: Copy = { en: "No new jobs for this role in the last 30 days.", th: "ในช่วง 30 วันที่ผ่านมา PunProfile ยังไม่ได้คัดตำแหน่งงานที่ตรงกับตำแหน่งเป้าหมายนี้" };
export const TAB_CV: Copy = { en: "CV files", th: "ไฟล์ CV" };
export const TAB_COACH: Copy = { en: "Your coach", th: "โค้ชของคุณ" };

/* ------------------------------------------------------------ overview */

export const PIPELINE_HEADING: Copy = { en: "Applications so far", th: "ภาพรวมการสมัครงาน" };
export const DATES_HEADING: Copy = { en: "Coming up", th: "วันสำคัญที่ใกล้จะถึง" };
export const DATES_EMPTY: Copy = {
  en: "Nothing dated yet. Add a follow-up date in your applications and it shows here.",
  th: "ยังไม่มีกำหนดการ เพิ่มวันติดตามผลในรายการสมัครงาน แล้วดูวันที่กำหนดไว้ได้ที่นี่",
};
export const DATE_FOLLOW: Copy = { en: "Follow up", th: "ติดตามผล" };
export const DATE_CLOSES: Copy = { en: "Closes", th: "ปิดรับสมัคร" };
export const DATE_DUE: Copy = { en: "Due", th: "กำหนดส่ง" };
export const LATEST_NOTE: Copy = { en: "Latest note from PunProfile", th: "ข้อความล่าสุดจาก PunProfile" };
export const SEE_ALL: Copy = { en: "See all", th: "ดูทั้งหมด" };

/* ------------------------------------------------------------- tokens */

export const TOKENS_HEADING: Copy = { en: "Tokens left", th: "โทเคนคงเหลือ" };
export const TOKENS_OF: Copy = { en: "of {n} tokens", th: "จาก {n} โทเคน" };
export const TOKENS_MATCHED: Copy = {
  en: "Jobs picked for you: {n}",
  th: "ตำแหน่งงานที่คัดให้แล้ว {n} ตำแหน่ง",
};
/** Shown only while a Fit Report is selected, `01_Project_Foundation.md`. */
export const TOKENS_RESERVED: Copy = {
  en: "{n} reserved for your Fit Report",
  th: "กันไว้สำหรับ Fit Report {n} โทเคน",
};
export const TOKENS_SPENDABLE: Copy = {
  en: "{n} available for matched jobs",
  th: "ใช้รับตำแหน่งงานที่คัดให้ได้ {n} โทเคน",
};
/** Appointments and the preview's preparation, `prd.md` section 8. */
export const APPT_HEADING: Copy = {
  en: "Your appointments",
  th: "นัดหมายของคุณ",
};
export const APPT_NONE: Copy = {
  en: "No appointment booked yet.",
  th: "ยังไม่มีนัดหมาย",
};
export const APPT_ZONE_LABEL: Copy = {
  en: "Your time zone",
  th: "เขตเวลาของคุณ",
};
export const APPT_ZONE_PROMPT: Copy = {
  en: "Times below are Madrid time. Select your time zone to also see your own time.",
  th: "เวลาด้านล่างเป็นเวลามาดริด เลือกเขตเวลาของคุณเพื่อดูเวลาท้องถิ่นของคุณด้วย",
};
export const APPT_ZONE_CHOOSE: Copy = {
  en: "Select a time zone",
  th: "เลือกเขตเวลา",
};
export const APPT_MADRID: Copy = {
  en: "Madrid time: {t}",
  th: "เวลามาดริด: {t}",
};
export const APPT_YOURS: Copy = {
  en: "Your time: {t}",
  th: "เวลาของคุณ: {t}",
};
export const APPT_CALENDAR: Copy = {
  en: "Add to calendar",
  th: "เพิ่มลงปฏิทิน",
};
export const PREP_HEADING: Copy = {
  en: "Before your coaching preview",
  th: "ก่อนการพูดคุยกับ PunProfile",
};
export const PREP_DUE: Copy = {
  en: "Send by {t}",
  th: "ส่งภายใน {t}",
};
export const PREP_NOT_BOOKED: Copy = {
  en: "Your session is not booked yet. You can send this now.",
  th: "ยังไม่ได้นัดเวลา ส่งข้อมูลนี้ล่วงหน้าได้เลย",
};
export const PREP_ROLES: Copy = {
  en: "Target roles, most wanted first (1 to 3)",
  th: "ตำแหน่งที่ต้องการ เรียงจากที่อยากได้มากที่สุด (1 ถึง 3 ตำแหน่ง)",
};
export const PREP_PRIORITIES: Copy = {
  en: "What you most want help with (1 to 3)",
  th: "เรื่องที่อยากได้คำแนะนำมากที่สุด (1 ถึง 3 ข้อ)",
};
export const PREP_VACANCIES: Copy = {
  en: "Example job ads you like (optional, up to 2 links)",
  th: "ตัวอย่างประกาศงานที่สนใจ (ไม่บังคับ ไม่เกิน 2 ลิงก์)",
};
export const PREP_SEND: Copy = {
  en: "Send",
  th: "ส่ง",
};
export const PREP_SENT: Copy = {
  en: "Sent. You can change it until the session.",
  th: "ส่งแล้ว แก้ไขได้จนถึงวันนัด",
};
export const PREP_LATE: Copy = {
  en: "The deadline has passed. You can still send it, and PunProfile will confirm whether the session stays as booked.",
  th: "เลยกำหนดส่งแล้ว แต่ยังส่งได้ PunProfile จะยืนยันอีกครั้งว่าคงเวลานัดเดิมหรือไม่",
};
export const PREP_INVALID: Copy = {
  en: "Add at least one role and one priority. Links must start with https.",
  th: "ใส่ตำแหน่งอย่างน้อย 1 ตำแหน่ง และเรื่องที่อยากได้คำแนะนำอย่างน้อย 1 ข้อ ลิงก์ต้องขึ้นต้นด้วย https",
};
export const TOKENS_RULE: Copy = {
  en: "A token is used only once a service is delivered. Tokens never expire.",
  th: "โทเคนจะถูกหักเมื่อได้รับบริการแล้วเท่านั้น และไม่มีวันหมดอายุ",
};

/* ------------------------------------------------------- deliverables */

export const WORK_HEADING: Copy = { en: "Your services", th: "บริการของคุณ" };
export const WORK_EMPTY: Copy = {
  en: "Each service appears here once it is planned with PunProfile.",
  th: "บริการแต่ละรายการจะแสดงที่นี่เมื่อวางแผนร่วมกับ PunProfile แล้ว",
};
export const WORK_STATUS: Record<"not_started" | "in_progress" | "delivered", Copy> = {
  not_started: { en: "Not started", th: "ยังไม่เริ่ม" },
  in_progress: { en: "In progress", th: "กำลังดำเนินการ" },
  delivered: { en: "Delivered", th: "ส่งมอบแล้ว" },
};
export const WORK_DUE: Copy = { en: "Due {date}", th: "กำหนดส่ง {date}" };
export const WORK_DONE_ON: Copy = { en: "Delivered {date}", th: "ส่งมอบเมื่อ {date}" };

export const WORK_KIND: Record<string, Copy> = {
  fit_report: { en: "Fit Report", th: "Fit Report" },
  coaching_session: { en: "Session with PunProfile", th: "การพูดคุยกับ PunProfile" },
  base_cv: { en: "Main CV", th: "CV หลัก" },
  linkedin: { en: "LinkedIn profile", th: "โปรไฟล์ LinkedIn" },
  portfolio: { en: "Portfolio", th: "พอร์ตโฟลิโอ" },
  country_research: { en: "Country research", th: "ข้อมูลประเทศเป้าหมาย" },
  tailored_application: { en: "Application tailored to a job ad", th: "ใบสมัครที่ปรับตามประกาศรับสมัคร" },
  interview_prep: { en: "Interview preparation", th: "เตรียมตัวสัมภาษณ์" },
  mock_interview: { en: "Mock interview", th: "ซ้อมสัมภาษณ์" },
  offer_review: { en: "Offer review", th: "ตรวจข้อเสนองาน" },
  contract_review: { en: "Contract review", th: "ตรวจสัญญาจ้าง" },
};

export const BOOK_TIME: Copy = { en: "Book a time", th: "จองเวลา" };
export const TOKENS_MORE: Copy = { en: "Ask for more tokens", th: "ขอโทเคนเพิ่ม" };
export const TOKENS_LOW: Copy = { en: "Running low on tokens.", th: "โทเคนใกล้หมด" };
export const TOKENS_REQUESTED: Copy = {
  en: "Request sent. PunProfile will reply on LINE.",
  th: "ส่งคำขอแล้ว PunProfile จะติดต่อกลับทาง LINE",
};

/* ----------------------------------------------------------- Fit Report */

export const FIT_HEADING: Copy = { en: "Your Fit Report", th: "Fit Report ของคุณ" };
export const FIT_BODY: Copy = {
  en: "Your rating in each area against the market, and what to work on next. Opens in a new tab, ready to save as a PDF.",
  th: "ผลประเมินแต่ละด้านเทียบกับเกณฑ์ตลาดงาน และสิ่งที่ควรพัฒนาต่อ รายงานเปิดในแท็บใหม่และบันทึกเป็น PDF ได้",
};
export const FIT_OPEN: Copy = { en: "Open the Fit Report", th: "เปิด Fit Report" };
export const FIT_POPUP: Copy = {
  en: "Your browser blocked the new tab. Allow pop-ups for this site and try again.",
  th: "เบราว์เซอร์บล็อกการเปิดแท็บใหม่ โปรดอนุญาต pop-up สำหรับเว็บไซต์นี้ แล้วเปิดรายงานอีกครั้ง",
};

/* --------------------------------------------------------------- goal */

export const GOAL_HEADING: Copy = { en: "This week's goal", th: "เป้าหมายสัปดาห์นี้" };
export const GOAL_PROGRESS: Copy = { en: "{done} of {goal} applications sent", th: "สมัครแล้ว {done} จาก {goal} ตำแหน่ง" };
export const GOAL_NONE: Copy = {
  en: "Set how many applications to send each week and track it here.",
  th: "กำหนดจำนวนใบสมัครที่จะส่งในแต่ละสัปดาห์ แล้วติดตามความคืบหน้าได้ที่นี่",
};
export const GOAL_PROMPT: Copy = { en: "Applications per week", th: "จำนวนใบสมัครต่อสัปดาห์" };
export const GOAL_SET: Copy = { en: "Set a goal", th: "ตั้งเป้าหมาย" };
export const GOAL_CHANGE: Copy = { en: "Change", th: "เปลี่ยน" };
export const GOAL_WEEK_NOTE: Copy = {
  en: "Weeks start on Monday, Thailand time.",
  th: "สัปดาห์เริ่มวันจันทร์ ตามเวลาประเทศไทย",
};

/* -------------------------------------------------------------- notes */

export const NOTES_HEADING: Copy = { en: "Notes from PunProfile", th: "ข้อความจาก PunProfile" };

/* ---------------------------------------------------------------- CVs */

export const CV_HEADING: Copy = { en: "Your CVs", th: "CV ของคุณ" };
export const CV_EMPTY: Copy = {
  en: "No CV yet. Send your latest CV to PunProfile on LINE or by email.",
  th: "ยังไม่มี CV โปรดส่ง CV ฉบับล่าสุดให้ PunProfile ทาง LINE หรืออีเมล",
};
export const CV_VERSION: Copy = { en: "Version {n}", th: "ฉบับที่ {n}" };
export const CV_LATEST: Copy = { en: "Latest", th: "ล่าสุด" };
export const CV_THEIRS: Copy = { en: "Your version", th: "ฉบับของคุณ" };
export const CV_OURS: Copy = { en: "Revised by PunProfile", th: "ฉบับที่ PunProfile ปรับแก้" };
export const CV_CHANGED: Copy = { en: "What changed", th: "สิ่งที่ปรับแก้" };
export const CV_DOWNLOAD: Copy = { en: "Download", th: "ดาวน์โหลด" };

/* --------------------------------------------------------------- jobs */

export const JOBS_HEADING: Copy = { en: "Your applications", th: "รายการสมัครงาน" };
export const JOBS_INTRO: Copy = {
  en: "Update each job's status as it moves. Jobs marked Picked by PunProfile were screened for you.",
  th: "อัปเดตสถานะของแต่ละตำแหน่งเมื่อมีความคืบหน้า ตำแหน่งที่มีป้าย “คัดโดย PunProfile” คือตำแหน่งที่ PunProfile คัดมาให้",
};
export const JOBS_EMPTY: Copy = {
  en: "No jobs yet. Add one yourself, or wait for the first jobs PunProfile picks for you.",
  th: "ยังไม่มีตำแหน่งงานในรายการสมัครงาน คุณเพิ่มตำแหน่งที่สนใจได้เอง หรือรอตำแหน่งแรกที่ PunProfile คัดให้",
};
export const JOBS_ALL: Copy = { en: "All", th: "ทั้งหมด" };
export const JOBS_STATUS: Record<string, Copy> = {
  interested: { en: "Saved", th: "บันทึกไว้" },
  applied: { en: "Applied", th: "สมัครแล้ว" },
  screening: { en: "Screening", th: "คัดกรองเบื้องต้น" },
  interviewing: { en: "Interviewing", th: "อยู่ระหว่างสัมภาษณ์" },
  offer: { en: "Offer", th: "ได้ข้อเสนอ" },
  accepted: { en: "Accepted", th: "ตอบรับแล้ว" },
  rejected: { en: "Not selected", th: "ไม่ผ่านการคัดเลือก" },
  withdrawn: { en: "Withdrew", th: "ถอนตัว" },
};
export const JOBS_FROM_US: Copy = { en: "Picked by PunProfile", th: "คัดโดย PunProfile" };
export const JOBS_WHY: Copy = { en: "Why this job", th: "เหตุผลที่คัดตำแหน่งนี้" };
export const JOBS_POSTING: Copy = { en: "Open the job ad", th: "เปิดประกาศรับสมัคร" };
export const JOBS_CLOSES: Copy = { en: "Closes {date}", th: "ปิดรับสมัคร {date}" };
export const JOBS_APPLIED_ON: Copy = { en: "Applied {date}", th: "สมัครเมื่อ {date}" };
export const JOBS_FOLLOW_UP: Copy = { en: "Follow-up date", th: "วันติดตามผล" };
export const JOBS_NOTES: Copy = { en: "Notes", th: "โน้ต" };
export const JOBS_SAVE: Copy = { en: "Save", th: "บันทึก" };
export const JOBS_CANCEL: Copy = { en: "Cancel", th: "ยกเลิก" };
export const JOBS_REMOVE: Copy = { en: "Remove", th: "ลบ" };
export const JOBS_REMOVE_CONFIRM: Copy = { en: "Remove for good", th: "ลบถาวร" };
export const JOBS_DETAILS: Copy = { en: "Details", th: "รายละเอียด" };
export const JOBS_SEARCH: Copy = { en: "Search job title or company", th: "ค้นหาตำแหน่งหรือบริษัท" };
export const JOBS_CLOSED: Copy = { en: "Closed", th: "ปิดแล้ว" };
export const JOBS_NO_MATCH: Copy = { en: "No jobs match your search.", th: "ไม่พบตำแหน่งงานที่ตรงกับคำค้นหา" };
export const COL_ROLE: Copy = { en: "Job title", th: "ตำแหน่ง" };
export const COL_COMPANY: Copy = { en: "Company", th: "บริษัท" };
export const COL_SALARY: Copy = { en: "Salary", th: "เงินเดือน" };
export const COL_LOCATION: Copy = { en: "Location", th: "สถานที่" };
export const COL_STATUS: Copy = { en: "Status", th: "สถานะ" };
export const COL_SAVED: Copy = { en: "Saved", th: "วันที่บันทึก" };
export const COL_DEADLINE: Copy = { en: "Closes", th: "ปิดรับสมัคร" };
export const COL_APPLIED: Copy = { en: "Applied", th: "วันที่สมัคร" };
export const COL_FOLLOW: Copy = { en: "Follow up", th: "ติดตามผล" };
export const COL_EXCITEMENT: Copy = { en: "Interest", th: "ความสนใจ" };
export const BACK_TO_LIST: Copy = { en: "Back to applications", th: "กลับไปที่รายการสมัครงาน" };
export const DTAB_INFO: Copy = { en: "Job info", th: "ข้อมูลงาน" };
export const DTAB_NOTES: Copy = { en: "Notes", th: "โน้ต" };
export const DTAB_CV: Copy = { en: "CV sent", th: "CV ที่ใช้สมัคร" };
export const DTAB_COACH: Copy = { en: "From PunProfile", th: "จาก PunProfile" };
export const DTAB_INTERVIEWS: Copy = { en: "Interviews", th: "สัมภาษณ์" };
export const DTAB_CONTACTS: Copy = { en: "Contacts", th: "ผู้ติดต่อ" };
export const IV_EMPTY: Copy = {
  en: "No interviews yet. Add each round as it is booked, to prepare and look back.",
  th: "ยังไม่ได้บันทึกรอบสัมภาษณ์ เมื่อได้รับนัดหมายแล้ว ให้เพิ่มรายละเอียดแต่ละรอบไว้เพื่อเตรียมตัวและดูย้อนหลัง",
};
export const IV_ADD: Copy = { en: "Add a round", th: "เพิ่มรอบสัมภาษณ์" };
export const IV_ROUND: Copy = { en: "Round", th: "รอบ" };
export const IV_ROUND_HINT: Copy = { en: "e.g. Recruiter screen, Technical, Final", th: "เช่น Recruiter screen, Technical, รอบสุดท้าย" };
export const IV_DATE: Copy = { en: "Date", th: "วันที่" };
export const IV_FORMAT: Copy = { en: "Format", th: "รูปแบบ" };
export const IV_FORMATS: Record<"video" | "phone" | "onsite", Copy> = {
  video: { en: "Video call", th: "วิดีโอคอล" },
  phone: { en: "Phone", th: "โทรศัพท์" },
  onsite: { en: "In person", th: "พบกันโดยตรง" },
};
export const IV_INTERVIEWERS: Copy = { en: "Interviewers", th: "ผู้สัมภาษณ์" };
export const IV_NOTES: Copy = { en: "How it went and what they asked", th: "รายละเอียดการสัมภาษณ์และคำถามที่ได้รับ" };
export const CT_EMPTY: Copy = {
  en: "No contacts yet. Add the recruiter or hiring manager you are in touch with.",
  th: "ยังไม่มีผู้ติดต่อ เพิ่ม recruiter หรือ hiring manager ที่คุณติดต่ออยู่",
};
export const CT_ADD: Copy = { en: "Add a contact", th: "เพิ่มผู้ติดต่อ" };
export const CT_NAME: Copy = { en: "Name", th: "ชื่อ" };
export const CT_ROLE: Copy = { en: "Role", th: "ตำแหน่ง" };
export const CT_ROLE_HINT: Copy = { en: "e.g. Recruiter, Hiring manager", th: "เช่น Recruiter, Hiring manager" };
export const CT_EMAIL: Copy = { en: "Email", th: "อีเมล" };
export const CT_LINKEDIN: Copy = { en: "LinkedIn link", th: "ลิงก์ LinkedIn" };
export const JD_HEADING: Copy = { en: "Job description and keywords", th: "Job description และคีย์เวิร์ด" };
export const JD_HELP: Copy = {
  en: "Paste the job description here. It stays even if the ad is taken down, and its most repeated words show below.",
  th: "วาง job description ไว้ที่นี่ เพื่อกลับมาอ่านได้แม้บริษัทลบประกาศแล้ว คำที่ใช้บ่อยในประกาศจะแสดงด้านล่าง",
};
export const JD_KEYWORDS: Copy = { en: "Words this posting repeats", th: "คำที่ใช้บ่อยในประกาศนี้" };
export const JD_EMPTY: Copy = { en: "No job description yet.", th: "ยังไม่มี job description" };
export const LIST_REMOVE: Copy = { en: "Remove", th: "ลบ" };
export const DETAIL_DATES: Copy = { en: "Dates", th: "วันที่" };
export const DETAIL_OURS: Copy = {
  en: "PunProfile picked this job, so its details stay as sent. Your notes, follow-up date, interest and CV sent are yours to change.",
  th: "ตำแหน่งนี้ PunProfile คัดมาให้ รายละเอียดงานจึงแก้ไขไม่ได้ ส่วนโน้ต วันติดตามผล ความสนใจ และ CV ที่ใช้สมัคร แก้ไขได้",
};
export const CV_SENT_HELP: Copy = {
  en: "Choose the CV you sent for this job, to see later which version worked.",
  th: "เลือก CV ที่ใช้สมัครตำแหน่งนี้ เพื่อย้อนดูได้ว่าฉบับไหนได้ผล",
};
export const CV_SENT_NONE: Copy = { en: "Not chosen", th: "ยังไม่ได้เลือก" };
export const COACH_NOTES_NONE: Copy = {
  en: "No note from PunProfile on this job yet.",
  th: "ยังไม่มีข้อความจาก PunProfile สำหรับตำแหน่งนี้",
};
export const CLOSE_AS: Copy = { en: "Close this application as", th: "ปิดการสมัครตำแหน่งนี้ในสถานะ" };
export const REOPEN: Copy = { en: "Reopen as Saved", th: "เปิดใหม่ในสถานะ “บันทึกไว้”" };
export const SAVED_OK: Copy = { en: "Saved", th: "บันทึกแล้ว" };

export const ADD_JOB: Copy = { en: "Add a job", th: "เพิ่มตำแหน่งงาน" };
export const ADD_ROLE: Copy = { en: "Job title", th: "ตำแหน่ง" };
export const ADD_EMPLOYER: Copy = { en: "Company", th: "บริษัท" };
export const ADD_COUNTRY: Copy = { en: "Country", th: "ประเทศ" };
export const ADD_LOCATION: Copy = { en: "City, or remote", th: "เมือง หรือ remote" };
export const ADD_URL: Copy = { en: "Job ad link", th: "ลิงก์ประกาศรับสมัคร" };
export const ADD_SALARY: Copy = { en: "Salary, if stated", th: "เงินเดือน (ถ้าระบุ)" };
export const ADD_STATUS: Copy = { en: "Current status", th: "สถานะปัจจุบัน" };

/* ------------------------------------------------------------- errors */

export const ERROR_FIELDS: Copy = {
  en: "Fill in the job title, company and country first.",
  th: "โปรดกรอกตำแหน่ง บริษัท และประเทศ",
};
export const ERROR_GENERIC: Copy = {
  en: "That did not save. Try again in a moment.",
  th: "บันทึกไม่สำเร็จ โปรดลองใหม่ในอีกสักครู่",
};
export const LOADING: Copy = { en: "Loading...", th: "กำลังโหลด..." };
