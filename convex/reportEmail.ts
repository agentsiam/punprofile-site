import { C, FONT, SITE, button, card, emailDocument, esc, footerBlock, headerBand, logoRow, siteLink, step } from "./emailShell";

/**
 * The Fit Report notice: the paid report is on the candidate's dashboard.
 *
 * Spec: `coaching-delivery-design.md` § 7a, the outside message, and the row
 * of its own audit table that read "The Fit Report delivered: Nothing". It
 * says what arrived and carries one button to the dashboard, and it does not
 * repeat what is in the report: a paid document is read where it lives, not
 * summarised in an email that then disagrees with it.
 *
 * **It carries no attachment and no file link, because there is no file.** The
 * report is built in the browser at click time from the stored answers plus the
 * coach's interview ratings (`openFitReport.ts`), so the only honest link is
 * the dashboard, and the copy says what the candidate does when they get there.
 * A stored PDF would be a second copy of a document whose inputs keep moving.
 *
 * **Every Thai string here is Paul's own, written 20/11/2026.** It is a
 * different register from `codeEmail.ts`, which states written register, no
 * ครับ and PunProfile in the third person: this one is addressed ครับ, signs off
 * ทีม PunProfile and says เรา. That is his voice on this surface and the
 * header in `codeEmail.ts` is a session's reading of it, so the two emails a
 * paying candidate receives now disagree and his wording is the newer one.
 * Nothing here is to be conformed to that header without asking him.
 *
 * Three strings are placed rather than written by him, and each reuses
 * something already approved rather than inventing Thai. The headline is his
 * own subject line without the brand suffix, as `codeEmail.ts` does. The button
 * says เปิดแดชบอร์ดหางาน, borrowed from that email, because the link lands on
 * the dashboard and his second step reserves เปิด Fit Report for the button
 * there. And where the record holds no name, คุณ stands alone in the three
 * places he addresses her by name.
 */

/** Tokens the report cost, and what the wallet holds now. */
export type ReportReceipt = { used: number; left: number };

export const REPORT_EMAIL_SUBJECT = "Fit Report ของคุณพร้อมแล้ว | PunProfile";

/** His subject line is the headline, as the sign-in email's is. */
const HEADING = "Fit Report ของคุณพร้อมแล้ว";
const ME_URL = `${SITE}/me`;

const receiptTh = (r: ReportReceipt) =>
  `รายงานฉบับนี้ใช้ ${r.used} โทเคน คงเหลือ ${r.left} โทเคนในแพ็กเกจของคุณ`;
const receiptEn = (r: ReportReceipt) => `${r.used} tokens used for this report. You have ${r.left} tokens left.`;

export function reportEmailHtml(firstName: string | null, receipt?: ReportReceipt | null) {
  const name = firstName ? esc(firstName) : null;
  /** How he addresses her inside a sentence, and what is left without a name. */
  const khun = name ? `คุณ${name}` : "คุณ";
  const greetTh = name ? `สวัสดีครับคุณ${name}` : "สวัสดีครับ";
  const link = `<a href="${ME_URL}" style="color:${C.deep};font-weight:600;">${ME_URL}</a>`;

  return emailDocument({
    title: REPORT_EMAIL_SUBJECT,
    preheader: "ในรายงานจะเห็นว่าผลประเมินแต่ละด้านของคุณอยู่ตรงไหนเมื่อเทียบกับเกณฑ์ของตลาดงาน และควรพัฒนาเรื่องไหนต่อ",
    gutter: "32px 12px",
    heavyDisplay: true,
    css: `  @media (max-width:620px){ .px{padding-left:24px!important;padding-right:24px!important} .h1{font-size:26px!important} }`,
    rows: `${logoRow()}

${card(`${headerBand({ greeting: greetTh, heading: HEADING })}

    <tr><td class="px" style="padding:32px 40px 0;">
      <p style="margin:0;font-family:${FONT};font-size:16px;line-height:1.8;color:${C.body};">${khun}เปิดอ่าน Fit Report ได้แล้วครับ ในรายงานจะเห็นว่าผลประเมินแต่ละด้านของคุณอยู่ตรงไหนเมื่อเทียบกับเกณฑ์ของตลาดงาน และควรพัฒนาเรื่องไหนต่อ</p>
    </td></tr>

    <tr><td class="px" style="padding:28px 40px 0;">${button(ME_URL, "เปิดแดชบอร์ดหางาน")}</td></tr>

    <tr><td class="px" style="padding:28px 40px 32px;">
      ${step(1, `เข้าสู่ระบบที่ ${link} ด้วยอีเมลของคุณและรหัสที่ PunProfile ส่งให้ก่อนหน้านี้`)}
      ${step(2, "ในแดชบอร์ด กด &ldquo;เปิด Fit Report&rdquo; รายงานจะเปิดในแท็บใหม่ ถ้าอยากเก็บไว้อ่านทีหลัง ให้เลือกพิมพ์หรือบันทึกเป็น PDF ได้เลยครับ")}
    </td></tr>

    <tr><td class="px" style="padding:0 40px 32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.soft};border-radius:16px;">
        <tr><td style="padding:20px 24px;font-family:${FONT};font-size:15px;line-height:1.7;color:${C.body};">
          ถ้าเห็นข้อมูลในรายงานที่ไม่ตรงกับความเป็นจริง ตอบกลับอีเมลนี้หรือแจ้งเราทาง LINE ได้เลยครับ เราจะตรวจสอบและแก้ไขให้ เมื่อแก้แล้ว ${khun}เปิดดูฉบับล่าสุดได้จากแดชบอร์ดเดิม
        </td></tr>
      </table>
    </td></tr>

    <tr><td class="px" style="padding:0 40px 36px;">
      <p style="margin:0;font-family:${FONT};font-size:16px;line-height:1.7;color:${C.ink};">ทีม PunProfile</p>
    </td></tr>`)}

${footerBlock("24px 16px 8px", [
      ...(receipt ? [esc(receiptTh(receipt)), `${esc(receiptEn(receipt))}<br>`] : []),
      "คุณได้รับอีเมลนี้เพราะ PunProfile จัดทำ Fit Report ของคุณเรียบร้อยแล้ว",
      `PunProfile Career Coaching · ${siteLink}`,
    ])}`,
  });
}

export function reportEmailText(firstName: string | null, receipt?: ReportReceipt | null) {
  const khun = firstName ? `คุณ${firstName}` : "คุณ";
  return [
    firstName ? `สวัสดีครับคุณ${firstName}` : "สวัสดีครับ",
    "",
    `${khun}เปิดอ่าน Fit Report ได้แล้วครับ ในรายงานจะเห็นว่าผลประเมินแต่ละด้านของคุณอยู่ตรงไหนเมื่อเทียบกับเกณฑ์ของตลาดงาน และควรพัฒนาเรื่องไหนต่อ`,
    "",
    `1. เข้าสู่ระบบที่ ${ME_URL} ด้วยอีเมลของคุณและรหัสที่ PunProfile ส่งให้ก่อนหน้านี้`,
    `2. ในแดชบอร์ด กด “เปิด Fit Report” รายงานจะเปิดในแท็บใหม่ ถ้าอยากเก็บไว้อ่านทีหลัง ให้เลือกพิมพ์หรือบันทึกเป็น PDF ได้เลยครับ`,
    "",
    `ถ้าเห็นข้อมูลในรายงานที่ไม่ตรงกับความเป็นจริง ตอบกลับอีเมลนี้หรือแจ้งเราทาง LINE ได้เลยครับ เราจะตรวจสอบและแก้ไขให้ เมื่อแก้แล้ว ${khun}เปิดดูฉบับล่าสุดได้จากแดชบอร์ดเดิม`,
    "",
    "ทีม PunProfile",
    "",
    ...(receipt ? [receiptTh(receipt), receiptEn(receipt), ""] : []),
    "คุณได้รับอีเมลนี้เพราะ PunProfile จัดทำ Fit Report ของคุณเรียบร้อยแล้ว",
  ].join("\n");
}
