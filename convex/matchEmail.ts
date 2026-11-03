import { C, DISPLAY, FONT, SITE, button, esc } from "./codeEmail";

/**
 * The matched-role notice, `prd.md` § 8, Matched roles.
 *
 * One email lists every role sent since the last notice. Thai first, then
 * English, in the register of the sign-in code email: written, no ครับ,
 * PunProfile in the third person. The match reason is the coach's own text,
 * in the language it was written in. Thai in Paul's wording, 03/11/2026.
 *
 * Layout from `codeEmail.ts`, so both emails look like one sender. The header
 * is the mascot handing over the roles that passed, from a pile that did not.
 */

/** The header picture's own backdrop, so the slot is the same colour when a
 *  mail client blocks images. Sampled from `public/email-matched-roles-header.jpg`. */
const HEADER_GROUND = "#9dcddb";

export const MATCH_EMAIL_SUBJECT = "ตำแหน่งงานใหม่ที่คัดให้คุณ | PunProfile";

export type NoticeRole = {
  employer: string;
  roleTitle: string;
  country: string;
  location: string | null;
  jobUrl: string | null;
  matchReason: string | null;
};

const where = (r: NoticeRole) => [r.location, r.country].filter(Boolean).join(", ");

function roleCard(r: NoticeRole) {
  const link = r.jobUrl
    ? `<a href="${esc(r.jobUrl)}" style="font-family:${FONT};font-size:14px;font-weight:600;color:${C.deep};text-decoration:underline;text-underline-offset:3px;">ดูประกาศงาน · View the job</a>`
    : "";
  return `<tr><td class="px" style="padding:0 40px 12px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${C.line};border-radius:16px;">
    <tr><td style="padding:20px 24px;">
      <p style="margin:0;font-family:${DISPLAY};font-size:18px;font-weight:700;line-height:1.4;color:${C.ink};">${esc(r.roleTitle)}</p>
      <p style="margin:4px 0 0;font-family:${FONT};font-size:15px;line-height:1.6;color:${C.body};">${esc(r.employer)} · ${esc(where(r))}</p>
      ${r.matchReason ? `<p style="margin:12px 0 0;font-family:${FONT};font-size:15px;line-height:1.7;color:${C.body};">${esc(r.matchReason)}</p>` : ""}
      ${link ? `<p style="margin:14px 0 0;">${link}</p>` : ""}
    </td></tr>
  </table>
</td></tr>`;
}

export function matchEmailHtml(firstName: string | null, roles: NoticeRole[]) {
  const greetTh = firstName ? `สวัสดีคุณ ${esc(firstName)}` : "สวัสดี";
  const greetEn = firstName ? `Hello ${esc(firstName)},` : "Hello,";
  const meUrl = `${SITE}/me`;
  const n = roles.length;

  return `<!DOCTYPE html>
<html lang="th" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${MATCH_EMAIL_SUBJECT}</title>
<link href="https://fonts.googleapis.com/css2?family=Anuphan:wght@400;600;700&family=Archivo:wght@700;900&display=swap" rel="stylesheet">
<style>
  @media (max-width:620px){
    .px{padding-left:24px!important;padding-right:24px!important}
    .h1{font-size:26px!important}
  }
  a{color:${C.deep}}
</style>
</head>
<body style="margin:0;padding:0;background:${C.soft};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">PunProfile คัดตำแหน่งงานให้คุณ ${n} ตำแหน่ง ดูได้ในหน้าติดตามการสมัครงาน</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.soft};">
<tr><td align="center" style="padding:32px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">

  <tr><td style="padding:0 8px 20px;">
    <a href="${SITE}"><img src="${SITE}/punprofile-logo-email.png" width="160" height="44" alt="PunProfile" style="display:block;border:0;"></a>
  </td></tr>

  <tr><td style="background:${C.canvas};border-radius:24px;overflow:hidden;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

    <tr><td style="background:${HEADER_GROUND};border-radius:24px 24px 0 0;line-height:0;font-size:0;">
      <img src="${SITE}/email-matched-roles-header.jpg" width="600" height="198" alt="PunProfile คัดตำแหน่งงานให้คุณ · Roles picked for you" style="display:block;width:100%;max-width:600px;height:auto;border:0;border-radius:24px 24px 0 0;">
    </td></tr>

    <tr><td class="px" style="background:${C.deep};padding:36px 40px 36px;">
      <p style="margin:0 0 14px;font-family:${FONT};font-size:15px;color:${C.onDeep};">${greetTh}</p>
      <h1 class="h1" style="margin:0;font-family:${DISPLAY};font-size:30px;font-weight:700;line-height:1.35;color:${C.lime};">ตำแหน่งงานใหม่ที่คัดให้คุณ ${n} ตำแหน่ง</h1>
      <p style="margin:14px 0 0;font-family:${FONT};font-size:16px;line-height:1.7;color:${C.onDeep};">PunProfile ตรวจสอบแล้วว่าทุกตำแหน่งยังเปิดรับสมัครและตรงกับตำแหน่งเป้าหมายของคุณ ดูรายละเอียดและเหตุผลที่คัดแต่ละตำแหน่งได้ในหน้าติดตามการสมัครงาน</p>
    </td></tr>

    <tr><td style="height:28px;line-height:28px;font-size:0;">&nbsp;</td></tr>
    ${roles.map(roleCard).join("\n")}

    <tr><td class="px" style="padding:12px 40px 8px;">${button(meUrl, "เปิดแดชบอร์ดหางาน")}</td></tr>

    <tr><td class="px" style="padding:16px 40px 32px;font-family:${FONT};font-size:14px;line-height:1.7;color:${C.body};">
      แต่ละตำแหน่งใช้ 1 โทเคน คุณสามารถปรับจำนวนตำแหน่งต่อสัปดาห์หรือหยุดรับชั่วคราวได้ในหน้าติดตามการสมัครงาน
    </td></tr>

    <tr><td class="px" style="padding:0 40px;"><div style="height:1px;background:${C.line};line-height:1px;font-size:0;">&nbsp;</div></td></tr>
    <tr><td class="px" style="padding:28px 40px 36px;" lang="en">
      <p style="margin:0 0 8px;font-family:${FONT};font-size:13px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:${C.mute};">In English</p>
      <p style="margin:0 0 10px;font-family:${FONT};font-size:15px;line-height:1.7;color:${C.body};">${greetEn} PunProfile has picked ${n === 1 ? "a new role" : `${n} new roles`} for you. Each one was checked as still open and matching your target roles, and is on your <a href="${meUrl}" style="color:${C.deep};font-weight:600;">Job Search Dashboard</a> with the reason it was picked.</p>
      <p style="margin:0;font-family:${FONT};font-size:15px;line-height:1.7;color:${C.body};">Each role uses one token. To change how many you get a week, or to pause, use your Job Search Dashboard.</p>
    </td></tr>

  </table>
  </td></tr>

  <tr><td align="center" style="padding:24px 16px 8px;font-family:${FONT};font-size:12px;line-height:1.7;color:${C.mute};">
    PunProfile Career Coaching · <a href="${SITE}" style="color:${C.mute};">punprofile.app</a><br>
    PunProfile ส่งอีเมลนี้เพื่อแจ้งว่ามีตำแหน่งงานใหม่ที่คัดให้คุณ หากมีคำถาม สามารถตอบกลับอีเมลนี้ได้
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

export function matchEmailText(firstName: string | null, roles: NoticeRole[]) {
  const n = roles.length;
  const list = roles
    .map((r) => [`- ${r.roleTitle}, ${r.employer}, ${where(r)}`, r.matchReason ? `  ${r.matchReason}` : "", r.jobUrl ? `  ${r.jobUrl}` : ""].filter(Boolean).join("\n"))
    .join("\n\n");
  return [
    firstName ? `สวัสดีคุณ ${firstName}` : "สวัสดี",
    "",
    `ตำแหน่งงานใหม่ที่คัดให้คุณ ${n} ตำแหน่ง`,
    "",
    `PunProfile ตรวจสอบแล้วว่าทุกตำแหน่งยังเปิดรับสมัครและตรงกับตำแหน่งเป้าหมายของคุณ ดูรายละเอียดและเหตุผลที่คัดแต่ละตำแหน่งได้ในหน้าติดตามการสมัครงาน: ${SITE}/me`,
    "",
    list,
    "",
    "แต่ละตำแหน่งใช้ 1 โทเคน คุณสามารถปรับจำนวนตำแหน่งต่อสัปดาห์หรือหยุดรับชั่วคราวได้ในหน้าติดตามการสมัครงาน",
    "",
    `${firstName ? `Hello ${firstName},` : "Hello,"} PunProfile has picked ${n === 1 ? "a new role" : `${n} new roles`} for you. They are on your Job Search Dashboard with the reason each was picked: ${SITE}/me`,
    "Each role uses one token. To change how many you get a week, or to pause, use your Job Search Dashboard.",
  ].join("\n");
}
