import type { Copy } from "./copy";

/**
 * The per-stage checklist on a job in the candidate's tracker, Teal's "Check
 * List" tab with PunProfile's own wording.
 *
 * **What belongs here (Paul, 30/10/2026):** steps that apply to every
 * candidate, with or without a visa sponsor, and that are about moving the
 * application along. Nothing about the opening's own criteria, and nothing
 * about visas.
 *
 * **Draft, awaiting Paul's approval.** The approved wording is recorded in the
 * coaching repo before this ships to anyone.
 *
 * Item ids are stable and stored on `applications.checklist` as done marks, so
 * an id is never reused for a different step. Rewording keeps the id; a step
 * that is replaced gets a new one.
 */

export interface ChecklistItem {
  id: string;
  label: Copy;
}

export const CHECKLIST: Record<
  "interested" | "applied" | "screening" | "interviewing" | "offer" | "accepted",
  readonly ChecklistItem[]
> = {
  interested: [
    { id: "saved-read-jd", label: { en: "Read the whole job description and note the words it repeats", th: "ลองอ่าน job description ให้ครบ แล้วจดคีย์เวิร์ดที่ใช้บ่อยไว้" } },
    { id: "saved-pick-cv", label: { en: "Choose the CV version you will send", th: "เลือก CV ฉบับที่จะใช้กับงานนี้" } },
    { id: "saved-tailor-cv", label: { en: "Tailor that CV to use the posting's own words", th: "ปรับ CV ให้ใช้คำเดียวกับใน job description" } },
    { id: "saved-cover", label: { en: "Write a cover letter or short note, if the posting asks for one", th: "ถ้าบริษัทขอ cover letter หรือข้อความแนะนำตัวสั้น ๆ ลองเตรียมไว้ก่อนส่งใบสมัคร" } },
    { id: "saved-deadline", label: { en: "Add the closing date, if there is one", th: "ใส่วันปิดรับสมัคร ถ้าประกาศระบุไว้" } },
  ],
  applied: [
    { id: "applied-record-cv", label: { en: "Record which CV you sent, in the CV sent tab", th: "บันทึกว่าส่ง CV ฉบับไหนไป ในแท็บ CV ที่ใช้สมัคร" } },
    { id: "applied-follow-date", label: { en: "Set a follow-up date 7 to 10 days from now", th: "ตั้งวันที่จะ follow up ไว้ประมาณ 7 ถึง 10 วันหลังสมัคร" } },
    { id: "applied-find-contact", label: { en: "Find the recruiter or hiring manager on LinkedIn and add them as a contact", th: "ลองหา recruiter หรือ hiring manager บน LinkedIn แล้วบันทึกไว้ในแท็บผู้ติดต่อ" } },
    { id: "applied-message", label: { en: "Send them a short message that you have applied", th: "ส่งข้อความสั้น ๆ ทาง LinkedIn ว่าคุณสมัครตำแหน่งนี้แล้ว" } },
    { id: "applied-follow-up", label: { en: "Follow up on the date if you have heard nothing", th: "ถ้าถึงวันที่ตั้งไว้แล้วยังไม่ได้รับคำตอบ ลองส่งข้อความไป follow up อีกครั้ง" } },
  ],
  screening: [
    { id: "screen-intro", label: { en: "Prepare a one-minute answer to 'tell me about yourself'", th: "เตรียมคำตอบแนะนำตัวให้จบใน 1 นาที" } },
    { id: "screen-salary", label: { en: "Prepare your expected salary as a yearly range in the local currency", th: "เตรียมช่วงเงินเดือนที่คาดหวัง โดยคิดเป็นรายปีและใช้สกุลเงินของประเทศนั้น" } },
    { id: "screen-start", label: { en: "Know your notice period and the earliest date you can start", th: "เช็ก notice period ของคุณ และวันที่คุณเริ่มงานได้เร็วที่สุด" } },
    { id: "screen-tech", label: { en: "Test your microphone, camera and the call link 10 minutes before", th: "ทดสอบไมค์ กล้อง และลิงก์ก่อนเวลานัด 10 นาที" } },
    { id: "screen-log", label: { en: "Afterwards, log who you spoke to and what they asked, in Interviews", th: "หลังคุยเสร็จ ลองบันทึกว่าคุยกับใครและมีคำถามอะไรบ้างไว้ในแท็บสัมภาษณ์" } },
  ],
  interviewing: [
    { id: "iv-research", label: { en: "Research the company and the people interviewing you", th: "หาข้อมูลบริษัทและคนที่จะสัมภาษณ์คุณ" } },
    { id: "iv-stories", label: { en: "Prepare three examples of your work, each with a result in numbers", th: "เตรียมตัวอย่างผลงาน 3 เรื่อง แต่ละเรื่องมีผลลัพธ์เป็นตัวเลข" } },
    { id: "iv-questions", label: { en: "Prepare three questions to ask them", th: "เตรียมคำถามถามกลับ 3 ข้อ" } },
    { id: "iv-thanks", label: { en: "Send a thank-you email within 24 hours of each round", th: "ส่งอีเมลขอบคุณภายใน 24 ชั่วโมงหลังสัมภาษณ์แต่ละรอบ" } },
    { id: "iv-log", label: { en: "Log each round and what was asked, in Interviews", th: "บันทึกรายละเอียดแต่ละรอบและคำถามที่เจอไว้ในแท็บสัมภาษณ์" } },
  ],
  offer: [
    { id: "offer-writing", label: { en: "Ask for the offer in writing", th: "ขอข้อเสนอเป็นลายลักษณ์อักษร" } },
    { id: "offer-net", label: { en: "Work out the salary after tax against the city's cost of living", th: "คำนวณเงินเดือนหลังหักภาษี แล้วเทียบกับค่าครองชีพของเมืองนั้น" } },
    { id: "offer-terms", label: { en: "Check the start date, probation period and paid leave", th: "เช็กวันเริ่มงาน ระยะทดลองงาน และวันลาที่ได้รับค่าจ้าง" } },
    { id: "offer-reply", label: { en: "Accept or negotiate before the deadline they gave", th: "ตอบรับหรือต่อรองก่อนวันที่บริษัทกำหนด" } },
    { id: "offer-coach", label: { en: "If anything in the contract is unclear, ask your coach before you sign", th: "ถ้ามีอะไรในสัญญาที่ไม่แน่ใจ ทักโค้ชก่อนเซ็น" } },
  ],
  accepted: [
    { id: "acc-sign", label: { en: "Sign the contract and keep a copy", th: "เซ็นสัญญาและเก็บสำเนาไว้" } },
    { id: "acc-withdraw", label: { en: "Tell the other companies you are still talking to that you are withdrawing", th: "แจ้งบริษัทอื่นที่ยังคุยอยู่ว่าคุณขอถอนตัว" } },
    { id: "acc-close-list", label: { en: "Close your other jobs in this list as withdrawn", th: "เปลี่ยนสถานะตำแหน่งอื่นในลิสต์นี้เป็น “ถอนตัว”" } },
    { id: "acc-thank", label: { en: "Thank the people who referred you or gave a reference", th: "ขอบคุณคนที่ช่วยแนะนำหรือเป็น reference ให้" } },
    { id: "acc-docs", label: { en: "Ask the employer which documents they need before your first day", th: "ถามบริษัทว่าต้องเตรียมเอกสารอะไรบ้างก่อนวันเริ่มงาน" } },
  ],
};

export const CHECKLIST_TAB: Copy = { en: "Checklist", th: "เช็กลิสต์" };
export const CHECKLIST_PROGRESS: Copy = { en: "{stage} steps: {done} of {total} done", th: "ขั้นตอนในสถานะ {stage}: ทำแล้ว {done} จาก {total} ข้อ" };
export const CHECKLIST_OTHER: Copy = { en: "Other stages", th: "ขั้นตอนในสถานะอื่น ๆ" };
