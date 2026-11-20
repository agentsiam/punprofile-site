import { C, DISPLAY, FONT, SITE, blogCard, button, card, divider, emailDocument, esc, footerBlock, headerBand, latestPost, logoRow, siteLink, step } from "./emailShell";
import type { Post } from "../src/lib/content/blog";

/**
 * The candidate code email, 01/11/2026.
 *
 * One permanent sign-in code, sent once when a coach opens a candidate's page
 * (and again only if the coach sends a new code). Paul's wording of
 * 01/11/2026: written register, no ครับ, PunProfile in the third person.
 *
 * Thai only since 20/11/2026. It carried a translation of itself at the foot
 * under an "In English" rule, which told a Thai reader nothing and told a
 * reader who needed English that they were an afterthought. The frame, the
 * palette and the blog card are `emailShell.ts`; what is left here is this
 * email's own content.
 */

export const CODE_EMAIL_SUBJECT = "แดชบอร์ดหางานของคุณพร้อมแล้ว | PunProfile";

export function codeEmailHtml(firstName: string | null, email: string, code: string, post: Post | null = latestPost()) {
  const greetTh = firstName ? `สวัสดีคุณ ${esc(firstName)}` : "สวัสดี";
  const spaced = code.split("").join("&#8202;");
  const meUrl = `${SITE}/me`;

  return emailDocument({
    title: CODE_EMAIL_SUBJECT,
    preheader: "รหัสเข้าใช้งานแดชบอร์ดหางานอยู่ในอีเมลนี้ รหัสนี้ไม่เปลี่ยน โปรดเก็บอีเมลไว้",
    gutter: "32px 12px",
    heavyDisplay: true,
    css: `  @media (max-width:620px){
    .px{padding-left:24px!important;padding-right:24px!important}
    .code{font-size:34px!important;letter-spacing:6px!important}
    .h1{font-size:26px!important}
  }`,
    rows: `${logoRow()}

${card(`${headerBand({
      greeting: greetTh,
      heading: "แดชบอร์ดหางานของคุณพร้อมแล้ว",
      sub: "ตำแหน่งที่คุณเล็งไว้ CV ของแต่ละตำแหน่ง งานที่ PunProfile คัดมาให้ และความคืบหน้าของทุกใบสมัคร รวมไว้ในที่เดียว",
    })}

    <tr><td class="px" style="padding:32px 40px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.pale};border-radius:16px;">
        <tr><td style="padding:24px 24px 8px;font-family:${FONT};font-size:13px;font-weight:600;color:${C.onPrimary};">รหัสเข้าใช้งาน · Sign-in code</td></tr>
        <tr><td class="code" style="padding:0 24px;font-family:'SF Mono',Menlo,Consolas,'Courier New',monospace;font-size:42px;font-weight:700;letter-spacing:10px;color:${C.ink};">${spaced}</td></tr>
        <tr><td style="padding:10px 24px 24px;font-family:${FONT};font-size:14px;color:${C.body};">อีเมลที่ใช้เข้าสู่ระบบ · Email&nbsp;&nbsp;<span style="color:${C.ink};font-weight:600;">${esc(email)}</span></td></tr>
      </table>
    </td></tr>

    <tr><td class="px" style="padding:24px 40px 8px;">${button(meUrl, "เปิดแดชบอร์ดหางาน")}</td></tr>

    <tr><td class="px" style="padding:16px 40px 32px;font-family:${FONT};font-size:14px;line-height:1.7;color:${C.body};">
      รหัสนี้ไม่เปลี่ยนและไม่มีวันหมดอายุ โปรดเก็บอีเมลฉบับนี้ไว้ หากไม่พบรหัส โปรดติดต่อ PunProfile ทาง LINE เพื่อรับรหัสใหม่
    </td></tr>

    <tr><td class="px" style="padding:0 40px 32px;">
      <p style="margin:0 0 14px;font-family:${DISPLAY};font-size:18px;font-weight:700;color:${C.ink};">เริ่มต้นใช้งาน</p>
      ${step(1, "เข้าสู่ระบบที่ punprofile.app/me ด้วยอีเมลและรหัสด้านบน")}
      ${step(2, "ดูตำแหน่งที่คุณเล็งไว้ และ CV ที่เตรียมไว้สำหรับแต่ละตำแหน่ง")}
      ${step(3, "บันทึกทุกใบสมัครที่ส่ง เพื่อให้ PunProfile ติดตามความคืบหน้าไปพร้อมกับคุณ")}
    </td></tr>

${divider()}
    <tr><td style="height:28px;line-height:28px;font-size:0;">&nbsp;</td></tr>
${post ? blogCard(post, "th") : ""}
    <tr><td style="height:36px;line-height:36px;font-size:0;">&nbsp;</td></tr>`)}

${footerBlock("24px 16px 8px", [
      `PunProfile Career Coaching · ${siteLink}`,
      "คุณได้รับอีเมลนี้เพราะ PunProfile เปิดแดชบอร์ดหางานให้คุณ หากมีคำถาม ตอบกลับอีเมลนี้ได้",
    ])}`,
  });
}
