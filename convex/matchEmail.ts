import { C, DISPLAY, FONT, SITE, button, esc } from "./codeEmail";

/**
 * The matched-role notice, `prd.md` § 8, Matched roles.
 *
 * A transactional email, and built to read as one: it tells a paying
 * candidate that a service they bought has been delivered, so it carries a
 * receipt (tokens used, tokens left) and none of the marketing email's dress.
 * No header picture, no mascot, no image logo, no blog card. Everything is
 * text, so nothing in it fails to load when a mail client blocks images. The
 * footer says in both languages that this is a service notice, not marketing.
 *
 * Each role card carries a like and a dislike link. Each is a capability on
 * that one row (`applications.feedbackToken`) and lands on
 * `/match-feedback/<token>?v=up|down`, which records the verdict when the
 * page runs, not when the link is fetched, so a mail scanner that prefetches
 * links records nothing.
 *
 * One email lists every role sent since the last notice. Thai first, then
 * English, written register, no ครับ, PunProfile in the third person. The
 * match reason is the coach's own text, in the language it was written in.
 */

export type NoticeRole = {
  employer: string;
  roleTitle: string;
  country: string;
  location: string | null;
  jobUrl: string | null;
  matchReason: string | null;
  /** @absent none — not stated on the posting */
  salary?: string | null;
  /** @absent none — no like and dislike links, e.g. the copy linter's sample */
  feedbackToken?: string | null;
};

/** Tokens spent on the roles in this email, and what the wallet holds now. */
export type NoticeReceipt = { used: number; left: number };

export const matchEmailSubject = (n: number) =>
  `ตำแหน่งงานที่คัดให้คุณ ${n} ตำแหน่ง · ใช้ ${n} โทเคน | PunProfile`;

/** Kept for callers that want the one-role wording. */
export const MATCH_EMAIL_SUBJECT = matchEmailSubject(1);

const where = (r: NoticeRole) => [r.location, r.country].filter(Boolean).join(", ");
const feedbackUrl = (token: string, v: "up" | "down") => `${SITE}/match-feedback/${encodeURIComponent(token)}?v=${v}`;

function verdictButton(href: string, label: string) {
  return `<td style="padding-right:8px;"><a href="${href}" style="display:inline-block;padding:9px 16px;border:1px solid ${C.line};border-radius:9999px;font-family:${FONT};font-size:14px;font-weight:600;line-height:18px;color:${C.ink};text-decoration:none;">${label}</a></td>`;
}

function roleCard(r: NoticeRole) {
  const link = r.jobUrl
    ? `<p style="margin:14px 0 0;"><a href="${esc(r.jobUrl)}" style="font-family:${FONT};font-size:14px;font-weight:600;color:${C.deep};text-decoration:underline;text-underline-offset:3px;">ดูประกาศงาน · View the job</a></p>`
    : "";
  const salary = r.salary
    ? `<p style="margin:4px 0 0;font-family:${FONT};font-size:14px;line-height:1.6;color:${C.body};">ค่าตอบแทนตามประกาศ · Pay as posted: ${esc(r.salary)}</p>`
    : "";
  const verdict = r.feedbackToken
    ? `<tr><td style="padding:14px 24px 18px;border-top:1px solid ${C.line};">
      <p style="margin:0 0 10px;font-family:${FONT};font-size:14px;line-height:1.6;color:${C.body};">ตำแหน่งนี้ตรงกับที่คุณมองหาไหม คำตอบช่วยให้ PunProfile คัดตำแหน่งถัดไปได้ตรงขึ้น<br><span style="color:${C.mute};">Does this role fit? Your answer helps PunProfile pick the next ones.</span></p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        ${verdictButton(feedbackUrl(r.feedbackToken, "up"), "&#128077; ตรง · Fits")}
        ${verdictButton(feedbackUrl(r.feedbackToken, "down"), "&#128078; ไม่ตรง · Misses")}
      </tr></table>
    </td></tr>`
    : "";
  return `<tr><td class="px" style="padding:0 32px 12px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${C.line};border-radius:12px;">
    <tr><td style="padding:20px 24px 16px;">
      <p style="margin:0;font-family:${DISPLAY};font-size:18px;font-weight:700;line-height:1.4;color:${C.ink};">${esc(r.roleTitle)}</p>
      <p style="margin:4px 0 0;font-family:${FONT};font-size:15px;line-height:1.6;color:${C.body};">${esc(r.employer)} · ${esc(where(r))}</p>
      ${salary}
      ${r.matchReason ? `<p style="margin:12px 0 0;font-family:${FONT};font-size:15px;line-height:1.7;color:${C.body};">${esc(r.matchReason)}</p>` : ""}
      ${link}
    </td></tr>
    ${verdict}
  </table>
</td></tr>`;
}

function receiptRow(th: string, en: string, value: string, strong = false) {
  return `<tr>
  <td style="padding:6px 0;font-family:${FONT};font-size:14px;line-height:1.5;color:${C.body};">${th} <span style="color:${C.mute};">· ${en}</span></td>
  <td align="right" style="padding:6px 0;font-family:${DISPLAY};font-size:15px;font-weight:${strong ? 700 : 600};color:${C.ink};">${value}</td>
</tr>`;
}

export function matchEmailHtml(firstName: string | null, roles: NoticeRole[], receipt?: NoticeReceipt) {
  const greetTh = firstName ? `สวัสดีคุณ ${esc(firstName)}` : "สวัสดี";
  const greetEn = firstName ? `Hello ${esc(firstName)},` : "Hello,";
  const meUrl = `${SITE}/me`;
  const n = roles.length;
  const used = receipt?.used ?? n;
  const subject = matchEmailSubject(n);

  return `<!DOCTYPE html>
<html lang="th" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${subject}</title>
<style>
  @media (max-width:620px){ .px{padding-left:20px!important;padding-right:20px!important} }
  a{color:${C.deep}}
</style>
</head>
<body style="margin:0;padding:0;background:${C.canvas};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">แจ้งการส่งบริการ: ตำแหน่งงานที่คัดให้คุณ ${n} ตำแหน่ง ใช้ ${used} โทเคน</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.canvas};">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;border:1px solid ${C.line};border-radius:12px;">

  <tr><td class="px" style="padding:20px 32px;border-bottom:1px solid ${C.line};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="font-family:${DISPLAY};font-size:18px;font-weight:700;color:${C.ink};">PunProfile</td>
      <td align="right" style="font-family:${FONT};font-size:12px;font-weight:600;letter-spacing:0.04em;color:${C.mute};">แจ้งการส่งบริการ · SERVICE NOTICE</td>
    </tr></table>
  </td></tr>

  <tr><td class="px" style="padding:28px 32px 8px;">
    <p style="margin:0 0 10px;font-family:${FONT};font-size:15px;color:${C.body};">${greetTh}</p>
    <h1 style="margin:0;font-family:${DISPLAY};font-size:24px;font-weight:700;line-height:1.35;color:${C.ink};">ตำแหน่งงานที่คัดให้คุณ ${n} ตำแหน่ง</h1>
    <p style="margin:12px 0 0;font-family:${FONT};font-size:15px;line-height:1.7;color:${C.body};">อีเมลนี้แจ้งว่า PunProfile ส่งบริการคัดตำแหน่งงานที่คุณซื้อไว้แล้ว ทุกตำแหน่งผ่านการตรวจว่ายังเปิดรับสมัครและตรงกับตำแหน่งเป้าหมายของคุณ และอยู่ในแดชบอร์ดหางานของคุณแล้ว</p>
  </td></tr>

  ${receipt ? `<tr><td class="px" style="padding:16px 32px 8px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.soft};border-radius:8px;"><tr><td style="padding:10px 18px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        ${receiptRow("ใช้ในอีเมลนี้", "Used for these roles", `${receipt.used} โทเคน`)}
        ${receiptRow("โทเคนคงเหลือ", "Tokens left", `${receipt.left} โทเคน`, true)}
      </table>
    </td></tr></table>
  </td></tr>` : ""}

  <tr><td style="height:16px;line-height:16px;font-size:0;">&nbsp;</td></tr>
  ${roles.map(roleCard).join("\n")}

  <tr><td class="px" style="padding:12px 32px 28px;">${button(meUrl, "เปิดแดชบอร์ดหางาน")}</td></tr>

  <tr><td class="px" style="padding:0 32px;"><div style="height:1px;background:${C.line};line-height:1px;font-size:0;">&nbsp;</div></td></tr>
  <tr><td class="px" style="padding:24px 32px 28px;" lang="en">
    <p style="margin:0 0 8px;font-family:${FONT};font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:${C.mute};">In English</p>
    <p style="margin:0;font-family:${FONT};font-size:15px;line-height:1.7;color:${C.body};">${greetEn} this email confirms that PunProfile has delivered ${n === 1 ? "a role" : `${n} roles`} from the job matching you paid for${receipt ? `, using ${receipt.used} token${receipt.used === 1 ? "" : "s"}. You have ${receipt.left} left` : ""}. Each role was checked as still open and matching your target roles, and is on your <a href="${meUrl}" style="color:${C.deep};font-weight:600;">Job Search Dashboard</a>. Tap Fits or Misses on each one to help PunProfile pick the next.</p>
  </td></tr>

</table>
</td></tr>
<tr><td align="center" style="padding:8px 24px 32px;font-family:${FONT};font-size:12px;line-height:1.7;color:${C.mute};">
  อีเมลแจ้งการส่งบริการ ไม่ใช่อีเมลข่าวสารหรือการตลาด PunProfile ส่งให้เพราะคุณซื้อโทเคนสำหรับบริการคัดตำแหน่งงาน หากมีคำถาม ตอบกลับอีเมลนี้ได้<br>
  A service notice for something you paid for, not marketing. Reply to this email with any question.<br>
  PunProfile Career Coaching · <a href="${SITE}" style="color:${C.mute};">punprofile.app</a>
</td></tr>
</table>
</body>
</html>`;
}

export function matchEmailText(firstName: string | null, roles: NoticeRole[], receipt?: NoticeReceipt) {
  const n = roles.length;
  const list = roles
    .map((r) =>
      [
        `- ${r.roleTitle}, ${r.employer}, ${where(r)}`,
        r.salary ? `  ค่าตอบแทนตามประกาศ · Pay as posted: ${r.salary}` : "",
        r.matchReason ? `  ${r.matchReason}` : "",
        r.jobUrl ? `  ${r.jobUrl}` : "",
        r.feedbackToken ? `  ตรง · Fits: ${feedbackUrl(r.feedbackToken, "up")}` : "",
        r.feedbackToken ? `  ไม่ตรง · Misses: ${feedbackUrl(r.feedbackToken, "down")}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n\n");
  return [
    "PunProfile · แจ้งการส่งบริการ · Service notice",
    "",
    firstName ? `สวัสดีคุณ ${firstName}` : "สวัสดี",
    "",
    `ตำแหน่งงานที่คัดให้คุณ ${n} ตำแหน่ง`,
    "",
    `อีเมลนี้แจ้งว่า PunProfile ส่งบริการคัดตำแหน่งงานที่คุณซื้อไว้แล้ว ทุกตำแหน่งผ่านการตรวจว่ายังเปิดรับสมัครและตรงกับตำแหน่งเป้าหมายของคุณ และอยู่ในแดชบอร์ดหางานของคุณแล้ว: ${SITE}/me`,
    ...(receipt ? ["", `ใช้ในอีเมลนี้ · Used: ${receipt.used} โทเคน`, `โทเคนคงเหลือ · Tokens left: ${receipt.left} โทเคน`] : []),
    "",
    list,
    "",
    `${firstName ? `Hello ${firstName},` : "Hello,"} this email confirms that PunProfile has delivered ${n === 1 ? "a role" : `${n} roles`} from the job matching you paid for. They are on your Job Search Dashboard: ${SITE}/me`,
    "",
    "อีเมลแจ้งการส่งบริการ ไม่ใช่อีเมลข่าวสารหรือการตลาด · A service notice, not marketing.",
  ].join("\n");
}
