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

export const PORTAL_TITLE: Copy = { en: "Your page", th: "หน้าของคุณ" };

export const PORTAL_GREETING: Copy = { en: "Hi {name}", th: "สวัสดีครับ {name}" };
export const PORTAL_GREETING_NONAME: Copy = { en: "Hi", th: "สวัสดีครับ" };

export const PORTAL_INTRO: Copy = {
  en: "Everything we are working on together is here: what has been delivered, your CV files, and the jobs you are going for. Bookmark this page, it is yours.",
  th: "ทุกอย่างที่เราทำด้วยกันอยู่ในหน้านี้ ทั้งงานที่ส่งมอบแล้ว ไฟล์ CV และงานที่คุณกำลังสมัคร เก็บลิงก์นี้ไว้ได้เลยครับ เป็นหน้าของคุณเอง",
};

export const PORTAL_INTRO_SHORT: Copy = {
  en: "Everything we are working on together, in one place.",
  th: "ทุกอย่างที่เราทำด้วยกัน อยู่ในที่เดียว",
};

/* ------------------------------------------------------------- sign-in */

export const SIGNIN_HEADING: Copy = { en: "Sign in to your page", th: "เข้าสู่หน้าของคุณ" };
export const SIGNIN_BODY: Copy = {
  en: "Enter the email you use with PunProfile and we will send you a 6-digit code. No password needed.",
  th: "กรอกอีเมลที่คุณใช้กับ PunProfile แล้วเราจะส่งรหัส 6 หลักไปให้ ไม่ต้องตั้งรหัสผ่านครับ",
};
export const SIGNIN_EMAIL: Copy = { en: "Email", th: "อีเมล" };
export const SIGNIN_SEND: Copy = { en: "Send me a code", th: "ส่งรหัส" };
export const SIGNIN_SENT: Copy = {
  en: "If this address has access, your code is on its way, by email or from your coach on LINE. It can take a few minutes.",
  th: "ถ้าอีเมลนี้มีสิทธิ์เข้าใช้ รหัสกำลังส่งไปครับ ทางอีเมล หรือโค้ชจะส่งให้ทาง LINE อาจใช้เวลาสักครู่",
};
export const SIGNIN_CODE: Copy = { en: "6-digit code", th: "รหัส 6 หลัก" };
export const SIGNIN_VERIFY: Copy = { en: "Sign in", th: "เข้าสู่ระบบ" };
export const SIGNIN_BAD_CODE: Copy = {
  en: "That code is wrong or has expired. Ask for a new one.",
  th: "รหัสไม่ถูกต้องหรือหมดอายุแล้ว ขอรหัสใหม่ได้เลยครับ",
};
export const SIGNIN_OTHER_EMAIL: Copy = { en: "Use a different email", th: "ใช้อีเมลอื่น" };
export const SIGNIN_RESEND: Copy = { en: "Send a new code", th: "ส่งรหัสใหม่" };
export const NO_ACCESS_HEADING: Copy = {
  en: "This email does not have a page yet",
  th: "อีเมลนี้ยังไม่มีหน้าของคุณ",
};
export const NO_ACCESS_BODY: Copy = {
  en: "Message your coach on LINE and they will open it for this address.",
  th: "ทักโค้ชทาง LINE ได้เลยครับ เดี๋ยวโค้ชเปิดสิทธิ์ให้อีเมลนี้",
};
export const COACH_HERE: Copy = {
  en: "You are signed in as a coach. Open a candidate's page from the CRM.",
  th: "คุณเข้าสู่ระบบในฐานะโค้ช เปิดหน้าของผู้สมัครได้จาก CRM",
};
export const SIGN_OUT: Copy = { en: "Sign out", th: "ออกจากระบบ" };

/* ---------------------------------------------------------------- tabs */

export const TAB_OVERVIEW: Copy = { en: "Overview", th: "ภาพรวม" };
export const TAB_TRACKER: Copy = { en: "Job tracker", th: "ติดตามงาน" };
export const TAB_FEED: Copy = { en: "Jobs for you", th: "งานสำหรับคุณ" };
export const FEED_INTRO: Copy = {
  en: "Roles our team screened in the last 30 days, in {countries}, matching {role}. The same jobs we post in the group, filtered to your target. Save one to put it in your job list.",
  th: "ตำแหน่งที่ทีมเราคัดใน 30 วันที่ผ่านมา ใน {countries} ตรงกับสาย {role} เป็นงานชุดเดียวกับที่โพสต์ในกลุ่ม แต่กรองตาม target ของคุณ กดบันทึกเพื่อเพิ่มเข้าลิสต์งานได้เลยครับ",
};
export const FEED_EMPTY: Copy = {
  en: "Nothing in your target in the last 30 days. A narrow target can go quiet for a while; this fills as new roles are screened.",
  th: "ช่วง 30 วันที่ผ่านมายังไม่มีตำแหน่งที่ตรงกับ target ของคุณ target ที่เฉพาะเจาะจงอาจเงียบไปบ้าง ตรงนี้จะขึ้นเมื่อมีตำแหน่งใหม่ที่ผ่านการคัดครับ",
};
export const FEED_NO_TARGET: Copy = {
  en: "We do not have your target country and role yet. Tell your coach, and this list fills.",
  th: "เรายังไม่มีข้อมูลประเทศและสายงานที่คุณตั้งเป้าไว้ บอกโค้ชได้เลยครับ แล้วลิสต์นี้จะขึ้น",
};
export const FEED_SAVE: Copy = { en: "Save to my list", th: "บันทึกเข้าลิสต์" };
export const FEED_SAVED: Copy = { en: "In your list", th: "อยู่ในลิสต์แล้ว" };
export const FEED_SEEN: Copy = { en: "Screened {date}", th: "คัดเมื่อ {date}" };
export const FEED_UPDATED: Copy = { en: "List updated {date}", th: "อัปเดตลิสต์ล่าสุด {date}" };
export const TAB_CV: Copy = { en: "CV", th: "ไฟล์ CV" };
export const TAB_COACH: Copy = { en: "Your coach", th: "โค้ชของคุณ" };

/* ------------------------------------------------------------ overview */

export const PIPELINE_HEADING: Copy = { en: "Your search so far", th: "ภาพรวมการสมัครงาน" };
export const DATES_HEADING: Copy = { en: "Coming up", th: "วันที่ต้องจำ" };
export const DATES_EMPTY: Copy = {
  en: "Nothing dated yet. Add a follow-up date to a job and it shows here.",
  th: "ยังไม่มีวันที่ต้องตาม ใส่วันตามผลให้งานไหนก็ได้ แล้วจะขึ้นที่นี่ครับ",
};
export const DATE_FOLLOW: Copy = { en: "Follow up", th: "ตามผล" };
export const DATE_CLOSES: Copy = { en: "Closes", th: "ปิดรับ" };
export const DATE_DUE: Copy = { en: "Due", th: "กำหนด" };
export const LATEST_NOTE: Copy = { en: "Latest from your coach", th: "ข้อความล่าสุดจากโค้ช" };
export const SEE_ALL: Copy = { en: "See all", th: "ดูทั้งหมด" };

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

export const BOOK_TIME: Copy = { en: "Book a time", th: "จองเวลา" };
export const TOKENS_MORE: Copy = { en: "Ask for more tokens", th: "ขอโทเคนเพิ่ม" };
export const TOKENS_LOW: Copy = { en: "You are running low on tokens.", th: "โทเคนใกล้หมดแล้วครับ" };
export const TOKENS_REQUESTED: Copy = {
  en: "Request sent. Your coach will get back to you on LINE.",
  th: "ส่งคำขอแล้วครับ โค้ชจะติดต่อกลับทาง LINE",
};

/* ----------------------------------------------------------- Fit Report */

export const FIT_HEADING: Copy = { en: "Your Fit Report", th: "Fit Report ของคุณ" };
export const FIT_BODY: Copy = {
  en: "Every area your coach rated, where you stand against the market, and what to do next in each. It opens in a new tab, ready to save as a PDF.",
  th: "ทุกด้านที่โค้ชประเมิน ตำแหน่งของคุณเทียบกับตลาด และสิ่งที่ควรทำต่อในแต่ละด้าน เปิดในแท็บใหม่ บันทึกเป็น PDF ได้เลยครับ",
};
export const FIT_OPEN: Copy = { en: "Open the Fit Report", th: "เปิด Fit Report" };
export const FIT_POPUP: Copy = {
  en: "Your browser blocked the new tab. Allow pop-ups for this site and try again.",
  th: "เบราว์เซอร์บล็อกแท็บใหม่ไว้ อนุญาต pop-up ของเว็บนี้แล้วลองกดอีกครั้งนะครับ",
};

/* --------------------------------------------------------------- goal */

export const GOAL_HEADING: Copy = { en: "This week's goal", th: "เป้าหมายสัปดาห์นี้" };
export const GOAL_PROGRESS: Copy = { en: "{done} of {goal} applications sent", th: "สมัครแล้ว {done} จาก {goal} ตำแหน่ง" };
export const GOAL_NONE: Copy = {
  en: "Set how many applications you aim to send each week, and see your progress here.",
  th: "ตั้งจำนวนใบสมัครที่อยากส่งในแต่ละสัปดาห์ แล้วดูความคืบหน้าได้ที่นี่ครับ",
};
export const GOAL_PROMPT: Copy = { en: "Applications per week", th: "จำนวนใบสมัครต่อสัปดาห์" };
export const GOAL_SET: Copy = { en: "Set a goal", th: "ตั้งเป้าหมาย" };
export const GOAL_CHANGE: Copy = { en: "Change", th: "เปลี่ยน" };
export const GOAL_WEEK_NOTE: Copy = {
  en: "The week starts on Monday, Thailand time.",
  th: "สัปดาห์เริ่มวันจันทร์ ตามเวลาไทย",
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
export const JOBS_SEARCH: Copy = { en: "Search role or company", th: "ค้นหาตำแหน่งหรือบริษัท" };
export const JOBS_CLOSED: Copy = { en: "Closed", th: "ปิดแล้ว" };
export const JOBS_NO_MATCH: Copy = { en: "No job matches.", th: "ไม่พบงานที่ตรงกับที่ค้นหา" };
export const COL_ROLE: Copy = { en: "Job title", th: "ตำแหน่ง" };
export const COL_COMPANY: Copy = { en: "Company", th: "บริษัท" };
export const COL_SALARY: Copy = { en: "Salary", th: "เงินเดือน" };
export const COL_LOCATION: Copy = { en: "Location", th: "สถานที่" };
export const COL_STATUS: Copy = { en: "Status", th: "สถานะ" };
export const COL_SAVED: Copy = { en: "Saved", th: "วันที่บันทึก" };
export const COL_DEADLINE: Copy = { en: "Closes", th: "ปิดรับ" };
export const COL_APPLIED: Copy = { en: "Applied", th: "วันที่สมัคร" };
export const COL_FOLLOW: Copy = { en: "Follow up", th: "ตามผล" };
export const COL_EXCITEMENT: Copy = { en: "Interest", th: "ความสนใจ" };
export const BACK_TO_LIST: Copy = { en: "Back to the list", th: "กลับไปที่ลิสต์" };
export const DTAB_INFO: Copy = { en: "Job info", th: "ข้อมูลงาน" };
export const DTAB_NOTES: Copy = { en: "Notes", th: "โน้ต" };
export const DTAB_CV: Copy = { en: "CV sent", th: "CV ที่ใช้สมัคร" };
export const DTAB_COACH: Copy = { en: "From your coach", th: "จากโค้ช" };
export const DTAB_INTERVIEWS: Copy = { en: "Interviews", th: "สัมภาษณ์" };
export const DTAB_CONTACTS: Copy = { en: "Contacts", th: "ผู้ติดต่อ" };
export const IV_EMPTY: Copy = {
  en: "No interview recorded yet. Add each round as it is booked, so you can prepare and look back.",
  th: "ยังไม่มีรอบสัมภาษณ์ เพิ่มแต่ละรอบเมื่อได้นัด จะได้เตรียมตัวและย้อนดูได้ครับ",
};
export const IV_ADD: Copy = { en: "Add a round", th: "เพิ่มรอบสัมภาษณ์" };
export const IV_ROUND: Copy = { en: "Round", th: "รอบ" };
export const IV_ROUND_HINT: Copy = { en: "e.g. Recruiter screen, Technical, Final", th: "เช่น คุยกับ recruiter, technical, รอบสุดท้าย" };
export const IV_DATE: Copy = { en: "Date", th: "วันที่" };
export const IV_FORMAT: Copy = { en: "Format", th: "รูปแบบ" };
export const IV_FORMATS: Record<"video" | "phone" | "onsite", Copy> = {
  video: { en: "Video call", th: "วิดีโอคอล" },
  phone: { en: "Phone", th: "โทรศัพท์" },
  onsite: { en: "In person", th: "ที่บริษัท" },
};
export const IV_INTERVIEWERS: Copy = { en: "Interviewers", th: "ผู้สัมภาษณ์" };
export const IV_NOTES: Copy = { en: "How it went, what they asked", th: "เป็นอย่างไรบ้าง ถูกถามอะไร" };
export const CT_EMPTY: Copy = {
  en: "No contact yet. Add the recruiter or hiring manager you are talking to.",
  th: "ยังไม่มีผู้ติดต่อ เพิ่ม recruiter หรือ hiring manager ที่คุณคุยด้วยได้เลยครับ",
};
export const CT_ADD: Copy = { en: "Add a contact", th: "เพิ่มผู้ติดต่อ" };
export const CT_NAME: Copy = { en: "Name", th: "ชื่อ" };
export const CT_ROLE: Copy = { en: "Role", th: "ตำแหน่ง" };
export const CT_ROLE_HINT: Copy = { en: "e.g. Recruiter, Hiring manager", th: "เช่น Recruiter, Hiring manager" };
export const CT_EMAIL: Copy = { en: "Email", th: "อีเมล" };
export const CT_LINKEDIN: Copy = { en: "LinkedIn link", th: "ลิงก์ LinkedIn" };
export const JD_HEADING: Copy = { en: "Job description and keywords", th: "Job description และคำสำคัญ" };
export const JD_HELP: Copy = {
  en: "Paste the posting here. It stays even if the posting is taken down, and the words it repeats show underneath.",
  th: "วางข้อความประกาศงานไว้ตรงนี้ เก็บไว้ได้แม้ประกาศจะถูกลบ และคำที่ประกาศพูดซ้ำบ่อย ๆ จะขึ้นด้านล่างครับ",
};
export const JD_KEYWORDS: Copy = { en: "Words this posting repeats", th: "คำที่ประกาศนี้พูดซ้ำ" };
export const JD_EMPTY: Copy = { en: "No job description pasted yet.", th: "ยังไม่ได้วาง job description" };
export const LIST_REMOVE: Copy = { en: "Remove", th: "ลบ" };
export const DETAIL_DATES: Copy = { en: "Dates", th: "วันที่" };
export const DETAIL_OURS: Copy = {
  en: "We picked this role for you, so its details stay as we sent them. Your notes, follow-up date, interest and the CV you sent are yours to change.",
  th: "ตำแหน่งนี้เราคัดให้ รายละเอียดงานจึงคงไว้ตามที่ส่งมา ส่วนโน้ต วันตามผล ความสนใจ และ CV ที่ใช้สมัคร แก้ได้เองครับ",
};
export const CV_SENT_HELP: Copy = {
  en: "Pick the CV you sent with this job, so you can see later which version worked.",
  th: "เลือกว่าส่ง CV ฉบับไหนไปกับงานนี้ จะได้ย้อนดูได้ว่าฉบับไหนได้ผลครับ",
};
export const CV_SENT_NONE: Copy = { en: "Not chosen", th: "ยังไม่ได้เลือก" };
export const COACH_NOTES_NONE: Copy = {
  en: "No note from your coach on this job yet.",
  th: "ยังไม่มีโน้ตจากโค้ชสำหรับงานนี้",
};
export const CLOSE_AS: Copy = { en: "Close it as", th: "ปิดงานนี้เป็น" };
export const REOPEN: Copy = { en: "Reopen as saved", th: "เปิดกลับมาเป็นบันทึกไว้" };
export const SAVED_OK: Copy = { en: "Saved", th: "บันทึกแล้ว" };

export const ADD_JOB: Copy = { en: "Add a job", th: "เพิ่มงาน" };
export const ADD_ROLE: Copy = { en: "Job title", th: "ตำแหน่ง" };
export const ADD_EMPLOYER: Copy = { en: "Company", th: "บริษัท" };
export const ADD_COUNTRY: Copy = { en: "Country", th: "ประเทศ" };
export const ADD_LOCATION: Copy = { en: "City, or remote", th: "เมือง หรือ remote" };
export const ADD_URL: Copy = { en: "Link to the posting", th: "ลิงก์ประกาศงาน" };
export const ADD_SALARY: Copy = { en: "Salary, if stated", th: "เงินเดือน ถ้ามีระบุ" };
export const ADD_STATUS: Copy = { en: "Where you are with it", th: "ตอนนี้อยู่ขั้นไหน" };

/* ------------------------------------------------------------- errors */

export const ERROR_FIELDS: Copy = {
  en: "Fill in the job title, company and country first.",
  th: "กรอกตำแหน่ง บริษัท และประเทศก่อนนะครับ",
};
export const ERROR_GENERIC: Copy = {
  en: "That did not save. Try again in a moment.",
  th: "ยังบันทึกไม่สำเร็จ ลองใหม่อีกครั้งนะครับ",
};
export const LOADING: Copy = { en: "Loading...", th: "กำลังโหลด..." };
