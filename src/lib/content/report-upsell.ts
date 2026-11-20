import type { Copy } from "./copy";

/**
 * The free candidate report's pointers to the paid Fit Report. Added
 * 20/11/2026: the "free short version" badge on the cover, the 30-minute
 * interview panel on the full-version page, and one banner per page saying
 * what the paid version adds there. Generated from `LANGUAGE-SYSTEM.md`.
 */

export const FREE_BADGE: Copy = { en: "Free short version", th: "ฉบับย่อ ฟรี" };
export const FREE_BADGE_NOTE: Copy = { en: "The full Fit Report adds a 30-minute interview with a coach.", th: "ใน Fit Report ฉบับเต็ม คุณจะได้สัมภาษณ์กับโค้ชเป็นเวลา 30 นาที" };
export const INTERVIEW_HEADING: Copy = { en: "30 minutes with a coach", th: "คุยกับโค้ช 30 นาที" };
export const INTERVIEW_BODY: Copy = { en: "Your answers here reach four areas. In the interview a coach asks about the work you have actually done and scores every competency your answers cannot reach. That conversation is what makes the full version.", th: "จากคำตอบในแบบประเมิน เราประเมินความพร้อมของคุณได้ 4 ด้าน ในการสัมภาษณ์สำหรับ Fit Report ฉบับเต็ม โค้ชจะถามถึงงานที่คุณเคยทำ เพื่อให้คะแนนได้ครบทุกทักษะ รวมถึงทักษะที่ต้องพูดคุยเพิ่มเติมจึงจะประเมินได้" };
export const PREVIEW_LABEL: Copy = { en: "In the full Fit Report", th: "ใน Fit Report ฉบับเต็ม" };
export const PREVIEW_AREAS: Copy = { en: "Every competency in this area gets its own score, including the ones left blank here.", th: "ในด้านนี้ โค้ชจะให้คะแนนแยกทีละทักษะ รวมถึงข้อที่ยังเว้นว่างไว้ในฉบับนี้" };
export const PREVIEW_MOVES: Copy = { en: "The moves that would lift your score most, and how much each one adds.", th: "คุณควรเริ่มปรับเรื่องไหนก่อน และแต่ละเรื่องจะช่วยเพิ่มคะแนนได้เท่าไร" };
export const PREVIEW_ROLES: Copy = { en: "Open roles in your target countries that carry the job titles you are aiming for, from the job adverts we screen.", th: "เราตรวจประกาศงานที่ยังเปิดรับในประเทศเป้าหมายของคุณ แล้วคัดตำแหน่งงานที่ตรงกับชื่อตำแหน่งที่คุณตั้งเป้าไว้" };

/** Where the report's method comes from. Text only: the EURES logo needs ELA's written permission. */
export const METHOD_NOTE: Copy = { en: "How this report was built: the four areas draw on EURES, the European job mobility network, and the European Commission's ESCO skills framework. Country facts are read on each government's own pages. EURES and the Commission have not reviewed this report.", th: "เราประเมินความพร้อมใน 4 ด้าน โดยอ้างอิงข้อมูลจาก EURES เครือข่ายที่ช่วยให้คนหางานข้ามประเทศในยุโรป และ ESCO กรอบทักษะของคณะกรรมาธิการยุโรป สำหรับข้อมูลรายประเทศ เราตรวจสอบจากเว็บไซต์ทางการของหน่วยงานรัฐในแต่ละประเทศโดยตรง ทั้ง EURES และคณะกรรมาธิการยุโรปไม่ได้ตรวจสอบรายงานฉบับนี้" };
