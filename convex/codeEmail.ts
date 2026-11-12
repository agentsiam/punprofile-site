import { POSTS, TOPICS, type Post } from "../src/lib/content/blog";

/**
 * The candidate code email, 01/11/2026.
 *
 * One permanent sign-in code, sent once when a coach opens a candidate's page
 * (and again only if the coach sends a new code). Thai first, then English,
 * in Paul's wording of 01/11/2026: written register, no ครับ, PunProfile in
 * the third person.
 *
 * Built as an email, not a web page: tables, inline styles, a 600px column,
 * images by absolute URL, colours from the site's design tokens written out
 * as hex because mail clients do not read CSS variables. Thai falls back to
 * the system Thai face where Anuphan cannot load (Gmail strips web fonts).
 *
 * The blog card is the newest post in `POSTS` at send time, so publishing an
 * article changes the next email with no edit here.
 */

export const SITE = "https://punprofile.app";

export const C = {
  canvas: "#ffffff",
  soft: "#ecefeb",
  ink: "#0e0f0c",
  body: "#454745",
  mute: "#6a6c6a",
  line: "#dfe3dc",
  primary: "#9fe870",
  onPrimary: "#163300",
  pale: "#e2f6d5",
  deep: "#163300",
  onDeep: "#e8ebe6",
  lime: "#cdffad",
};

export const FONT =
  "Anuphan, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans Thai', Tahoma, Arial, sans-serif";
export const DISPLAY =
  "Inter, Anuphan, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans Thai', Tahoma, Arial, sans-serif";

export const CODE_EMAIL_SUBJECT = "แดชบอร์ดหางานของคุณพร้อมแล้ว | PunProfile";

export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function latestPost(): Post | null {
  const sorted = [...POSTS].sort((a, b) => b.published.localeCompare(a.published));
  return sorted[0] ?? null;
}

const ddmmyyyy = (iso: string) => iso.split("-").reverse().join("/");

export function button(href: string, label: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-radius:9999px;background:${C.primary};">
<a href="${href}" style="display:inline-block;padding:15px 30px;font-family:${FONT};font-size:16px;font-weight:600;line-height:20px;color:${C.onPrimary};text-decoration:none;border-radius:9999px;">${label}</a>
</td></tr></table>`;
}

function step(n: number, text: string) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 10px;"><tr>
<td width="32" valign="top"><div style="width:26px;height:26px;border-radius:9999px;background:${C.deep};color:${C.lime};font-family:${FONT};font-size:13px;font-weight:700;line-height:26px;text-align:center;">${n}</div></td>
<td style="padding-left:10px;font-family:${FONT};font-size:15px;line-height:26px;color:${C.body};">${text}</td>
</tr></table>`;
}

function blogCard(post: Post, lang: "th" | "en") {
  const url = `${SITE}${lang === "en" ? "/en" : ""}/blog/${post.slug}`;
  const topic = TOPICS.find((t) => t.id === post.topic)?.label[lang] ?? "";
  const heading = lang === "th" ? "บทความล่าสุดจากบล็อก PunProfile" : "Latest from the PunProfile blog";
  const read = lang === "th" ? "อ่านต่อ" : "Read more";
  return `
<tr><td class="px" style="padding:8px 40px 0;font-family:${FONT};font-size:13px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:${C.mute};">${heading}</td></tr>
<tr><td class="px" style="padding:12px 40px 8px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${C.line};border-radius:16px;overflow:hidden;">
    <tr><td><a href="${url}"><img src="${SITE}${post.image.src}" width="518" alt="${esc(post.image.alt[lang])}" style="display:block;width:100%;max-width:518px;height:auto;border:0;border-radius:16px 16px 0 0;"></a></td></tr>
    <tr><td style="padding:20px 24px 24px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="background:${C.soft};border-radius:9999px;padding:4px 12px;font-family:${FONT};font-size:12px;font-weight:600;color:${C.ink};">${esc(topic)}</td>
        <td style="padding-left:10px;font-family:${FONT};font-size:12px;color:${C.mute};">${ddmmyyyy(post.published)}</td>
      </tr></table>
      <a href="${url}" style="display:block;margin-top:12px;font-family:${DISPLAY};font-size:20px;font-weight:700;line-height:1.4;color:${C.ink};text-decoration:none;">${esc(post.title[lang])}</a>
      <p style="margin:10px 0 18px;font-family:${FONT};font-size:15px;line-height:1.7;color:${C.body};">${esc(post.summary[lang])}</p>
      <a href="${url}" style="font-family:${FONT};font-size:15px;font-weight:600;color:${C.deep};text-decoration:underline;text-underline-offset:3px;">${read} &rarr;</a>
    </td></tr>
  </table>
</td></tr>`;
}

export function codeEmailHtml(firstName: string | null, email: string, code: string, post: Post | null = latestPost()) {
  const greetTh = firstName ? `สวัสดีคุณ ${esc(firstName)}` : "สวัสดี";
  const greetEn = firstName ? `Hello ${esc(firstName)},` : "Hello,";
  const spaced = code.split("").join("&#8202;");
  const meUrl = `${SITE}/me`;

  return `<!DOCTYPE html>
<html lang="th" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${CODE_EMAIL_SUBJECT}</title>
<link href="https://fonts.googleapis.com/css2?family=Anuphan:wght@400;600;700&family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet">
<style>
  @media (max-width:620px){
    .px{padding-left:24px!important;padding-right:24px!important}
    .code{font-size:34px!important;letter-spacing:6px!important}
    .h1{font-size:26px!important}
  }
  a{color:${C.deep}}
</style>
</head>
<body style="margin:0;padding:0;background:${C.soft};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">รหัสเข้าใช้งานแดชบอร์ดหางานอยู่ในอีเมลนี้ รหัสนี้ไม่เปลี่ยน โปรดเก็บอีเมลไว้</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.soft};">
<tr><td align="center" style="padding:32px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">

  <tr><td style="padding:0 8px 20px;">
    <a href="${SITE}"><img src="${SITE}/punprofile-logo-email.png" width="160" height="44" alt="PunProfile" style="display:block;border:0;"></a>
  </td></tr>

  <tr><td style="background:${C.canvas};border-radius:24px;overflow:hidden;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

    <tr><td class="px" style="background:${C.deep};padding:40px 40px 36px;border-radius:24px 24px 0 0;">
      <p style="margin:0 0 14px;font-family:${FONT};font-size:15px;color:${C.onDeep};">${greetTh}</p>
      <h1 class="h1" style="margin:0;font-family:${DISPLAY};font-size:30px;font-weight:700;line-height:1.35;color:${C.lime};">แดชบอร์ดหางานของคุณพร้อมแล้ว</h1>
      <p style="margin:14px 0 0;font-family:${FONT};font-size:16px;line-height:1.7;color:${C.onDeep};">ตำแหน่งที่คุณเล็งไว้ CV ของแต่ละตำแหน่ง งานที่ PunProfile คัดมาให้ และความคืบหน้าของทุกใบสมัคร รวมไว้ในที่เดียว</p>
    </td></tr>

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

    <tr><td class="px" style="padding:0 40px;"><div style="height:1px;background:${C.line};line-height:1px;font-size:0;">&nbsp;</div></td></tr>
    <tr><td style="height:28px;line-height:28px;font-size:0;">&nbsp;</td></tr>

    ${post ? blogCard(post, "th") : ""}

    <tr><td style="height:28px;line-height:28px;font-size:0;">&nbsp;</td></tr>
    <tr><td class="px" style="padding:0 40px;"><div style="height:1px;background:${C.line};line-height:1px;font-size:0;">&nbsp;</div></td></tr>
    <tr><td class="px" style="padding:28px 40px 36px;" lang="en">
      <p style="margin:0 0 8px;font-family:${FONT};font-size:13px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:${C.mute};">In English</p>
      <p style="margin:0 0 10px;font-family:${FONT};font-size:15px;line-height:1.7;color:${C.body};">${greetEn} your Job Search Dashboard is ready. The roles you are targeting, the CV for each one, the jobs PunProfile picks for you and the progress of every application, all in one place.</p>
      <p style="margin:0 0 10px;font-family:${FONT};font-size:15px;line-height:1.7;color:${C.body};">Sign in at <a href="${meUrl}" style="color:${C.deep};font-weight:600;">punprofile.app/me</a> with the email and code above.</p>
      <p style="margin:0;font-family:${FONT};font-size:15px;line-height:1.7;color:${C.body};">The code does not change or expire, so keep this email. If you can't find it, contact PunProfile on LINE for a new one.</p>
    </td></tr>

  </table>
  </td></tr>

  <tr><td align="center" style="padding:24px 16px 8px;font-family:${FONT};font-size:12px;line-height:1.7;color:${C.mute};">
    PunProfile Career Coaching · <a href="${SITE}" style="color:${C.mute};">punprofile.app</a><br>
    คุณได้รับอีเมลนี้เพราะ PunProfile เปิดแดชบอร์ดหางานให้คุณ หากมีคำถาม ตอบกลับอีเมลนี้ได้
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
