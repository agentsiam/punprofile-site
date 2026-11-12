import { C, DISPLAY, FONT, SITE, button, esc } from "./codeEmail";

/**
 * The matched-role notice, `prd.md` § 8, Matched roles.
 *
 * The job leads. A paying candidate opens this to see the role she bought,
 * so the header picture and the role card come first, the reason it fits
 * second, the like and dislike third, and the token count is one quiet line
 * at the foot, not a receipt on top. What marks it as hers rather than
 * marketing is the content, her name and her role, plus that foot line; it
 * carries no blog card, no newsletter dress and no unsubscribe link.
 *
 * The header picture has its own backdrop colour behind it, so a mail client
 * that blocks images still shows a coloured band of the same height.
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
  n === 1 ? "ตำแหน่งใหม่ที่คัดมาให้คุณ | PunProfile" : `ตำแหน่งใหม่ ${n} ตำแหน่งที่คัดมาให้คุณ | PunProfile`;

/** Kept for callers that want the one-role wording. */
export const MATCH_EMAIL_SUBJECT = matchEmailSubject(1);

/** The header picture's own backdrop, so the slot keeps its colour when a
 *  mail client blocks images. Sampled from `public/email-matched-roles-header.jpg`. */
const HEADER_GROUND = "#9dcddb";

const where = (r: NoticeRole) => [r.location, r.country].filter(Boolean).join(", ");
const feedbackUrl = (token: string, v: "up" | "down") => `${SITE}/match-feedback/${encodeURIComponent(token)}?v=${v}`;
const initial = (employer: string) => esc((employer.trim()[0] ?? "?").toUpperCase());

function chip(text: string) {
  return `<td style="padding:0 6px 6px 0;"><span style="display:inline-block;padding:5px 12px;border-radius:9999px;background:${C.pale};font-family:${FONT};font-size:13px;font-weight:600;line-height:18px;color:${C.deep};">${text}</span></td>`;
}

function verdictButton(href: string, label: string) {
  return `<td style="padding-right:8px;"><a href="${href}" style="display:inline-block;padding:10px 18px;border:1.5px solid ${C.line};border-radius:9999px;background:${C.canvas};font-family:${FONT};font-size:14px;font-weight:600;line-height:18px;color:${C.ink};text-decoration:none;">${label}</a></td>`;
}

function roleCard(r: NoticeRole) {
  const chips = [chip(`&#128205; ${esc(where(r))}`), r.salary ? chip(`&#128182; ${esc(r.salary)}`) : ""].join("");
  const view = r.jobUrl ? `<tr><td style="padding:18px 24px 0;">${button(esc(r.jobUrl), "ดูประกาศงาน · View the job")}</td></tr>` : "";
  const reason = r.matchReason
    ? `<tr><td style="padding:22px 24px 0;">
      <p style="margin:0 0 6px;font-family:${FONT};font-size:13px;font-weight:700;color:${C.deep};">&#10024; ทำไมตำแหน่งนี้เหมาะกับคุณ · Why it fits you</p>
      <p style="margin:0;font-family:${FONT};font-size:15px;line-height:1.7;color:${C.body};">${esc(r.matchReason)}</p>
    </td></tr>`
    : "";
  const verdict = r.feedbackToken
    ? `<tr><td style="padding:22px 24px 22px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.soft};border-radius:14px;"><tr><td style="padding:16px 18px;">
        <p style="margin:0 0 12px;font-family:${FONT};font-size:15px;font-weight:600;line-height:1.5;color:${C.ink};">ตำแหน่งนี้ใช่สำหรับคุณไหม <span style="font-weight:400;color:${C.mute};">· Is this one for you?</span></p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          ${verdictButton(feedbackUrl(r.feedbackToken, "up"), "&#128077; ใช่เลย · Yes")}
          ${verdictButton(feedbackUrl(r.feedbackToken, "down"), "&#128078; ไม่ใช่ · Not for me")}
        </tr></table>
        <p style="margin:10px 0 0;font-family:${FONT};font-size:13px;line-height:1.6;color:${C.mute};">คำตอบช่วยให้ PunProfile คัดตำแหน่งถัดไปได้ตรงใจขึ้น</p>
      </td></tr></table>
    </td></tr>`
    : `<tr><td style="height:22px;line-height:22px;font-size:0;">&nbsp;</td></tr>`;
  return `<tr><td class="px" style="padding:0 24px 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.canvas};border:1px solid ${C.line};border-radius:20px;">
    <tr><td style="padding:22px 24px 0;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td width="52" valign="top"><div style="width:48px;height:48px;border-radius:14px;background:${C.deep};color:${C.lime};font-family:${DISPLAY};font-size:22px;font-weight:700;line-height:48px;text-align:center;">${initial(r.employer)}</div></td>
        <td valign="top" style="padding-left:12px;">
          <p style="margin:0;font-family:${FONT};font-size:14px;font-weight:600;line-height:1.4;color:${C.body};">${esc(r.employer)}</p>
          <p style="margin:2px 0 0;font-family:${DISPLAY};font-size:20px;font-weight:700;line-height:1.35;color:${C.ink};">${esc(r.roleTitle)}</p>
        </td>
      </tr></table>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:14px;"><tr>${chips}</tr></table>
    </td></tr>
    ${view}
    ${reason}
    ${verdict}
  </table>
</td></tr>`;
}

export function matchEmailHtml(firstName: string | null, roles: NoticeRole[], receipt?: NoticeReceipt) {
  const greetTh = firstName ? `สวัสดีคุณ ${esc(firstName)}` : "สวัสดี";
  const greetEn = firstName ? `Hi ${esc(firstName)},` : "Hi,";
  const meUrl = `${SITE}/me`;
  const n = roles.length;
  const subject = matchEmailSubject(n);
  const tokenLine = receipt
    ? `ใช้ ${receipt.used} โทเคนจากแพ็กเกจของคุณ เหลืออีก ${receipt.left} โทเคน · ${receipt.used} token used, ${receipt.left} left`
    : "";

  return `<!DOCTYPE html>
<html lang="th" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${subject}</title>
<link href="https://fonts.googleapis.com/css2?family=Anuphan:wght@400;600;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  @media (max-width:620px){ .px{padding-left:16px!important;padding-right:16px!important} .h1{font-size:26px!important} }
  a{color:${C.deep}}
</style>
</head>
<body style="margin:0;padding:0;background:${C.soft};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${n === 1 ? `${esc(roles[0].roleTitle)} ที่ ${esc(roles[0].employer)}` : `ตำแหน่งใหม่ ${n} ตำแหน่ง`} คัดมาให้คุณแล้ว</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.soft};">
<tr><td align="center" style="padding:24px 10px 32px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">

  <tr><td style="background:${C.deep};border-radius:24px 24px 0 0;line-height:0;font-size:0;">
    <img src="${SITE}/email-matched-roles-header.jpg" width="600" height="198" alt="PunProfile คัดตำแหน่งงานให้คุณ · Roles picked for you" style="display:block;width:100%;max-width:600px;height:auto;border:0;border-radius:24px 24px 0 0;background:${HEADER_GROUND};">
  </td></tr>

  <tr><td class="px" style="background:${C.deep};padding:28px 32px 30px;">
    <p style="margin:0 0 10px;font-family:${FONT};font-size:15px;color:${C.onDeep};">${greetTh} &#128075;</p>
    <h1 class="h1" style="margin:0;font-family:${DISPLAY};font-size:30px;font-weight:700;line-height:1.3;color:${C.lime};">${n === 1 ? "ตำแหน่งใหม่ที่คัดมาให้คุณ" : `ตำแหน่งใหม่ ${n} ตำแหน่งที่คัดมาให้คุณ`}</h1>
    <p style="margin:12px 0 0;font-family:${FONT};font-size:16px;line-height:1.7;color:${C.onDeep};">PunProfile ตรวจแล้วว่ายังเปิดรับสมัคร และตรงกับเป้าหมายของคุณ</p>
  </td></tr>

  <tr><td style="background:${C.deep};border-radius:0 0 24px 24px;height:24px;line-height:24px;font-size:0;">&nbsp;</td></tr>
  <tr><td style="height:16px;line-height:16px;font-size:0;">&nbsp;</td></tr>

  ${roles.map(roleCard).join("\n")}

  <tr><td align="center" style="padding:8px 24px 0;font-family:${FONT};font-size:15px;line-height:1.7;color:${C.body};">
    ทุกตำแหน่งอยู่ใน<a href="${meUrl}" style="color:${C.deep};font-weight:600;">แดชบอร์ดหางาน</a>ของคุณแล้ว ติดตามการสมัครต่อได้ที่นั่น
  </td></tr>

  <tr><td class="px" style="padding:24px 24px 0;" lang="en">
    <p style="margin:0;font-family:${FONT};font-size:14px;line-height:1.7;color:${C.mute};">${greetEn} PunProfile picked ${n === 1 ? "a new role" : `${n} new roles`} for you, checked as still open and matching your goals. ${n === 1 ? "It is" : "They are"} on your <a href="${meUrl}" style="color:${C.deep};font-weight:600;">Job Search Dashboard</a>. Tap Yes or Not for me to help PunProfile pick the next.</p>
  </td></tr>

  <tr><td align="center" style="padding:28px 24px 0;font-family:${FONT};font-size:12px;line-height:1.7;color:${C.mute};">
    ${tokenLine ? `${tokenLine}<br>` : ""}คุณได้รับอีเมลนี้เพราะใช้บริการคัดตำแหน่งงานของ PunProfile · ตอบกลับอีเมลนี้ได้หากมีคำถาม<br>
    <a href="${SITE}" style="color:${C.mute};">punprofile.app</a>
  </td></tr>

</table>
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
        `${r.roleTitle}, ${r.employer}`,
        where(r),
        r.salary ? r.salary : "",
        r.jobUrl ? `ดูประกาศงาน · View the job: ${r.jobUrl}` : "",
        r.matchReason ? `\nทำไมตำแหน่งนี้เหมาะกับคุณ · Why it fits you\n${r.matchReason}` : "",
        r.feedbackToken ? `\nตำแหน่งนี้ใช่สำหรับคุณไหม · Is this one for you?\nใช่เลย · Yes: ${feedbackUrl(r.feedbackToken, "up")}\nไม่ใช่ · Not for me: ${feedbackUrl(r.feedbackToken, "down")}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n\n---\n\n");
  return [
    firstName ? `สวัสดีคุณ ${firstName}` : "สวัสดี",
    "",
    n === 1 ? "ตำแหน่งใหม่ที่คัดมาให้คุณ" : `ตำแหน่งใหม่ ${n} ตำแหน่งที่คัดมาให้คุณ`,
    "PunProfile ตรวจแล้วว่ายังเปิดรับสมัคร และตรงกับเป้าหมายของคุณ",
    "",
    list,
    "",
    `ทุกตำแหน่งอยู่ในแดชบอร์ดหางานของคุณแล้ว: ${SITE}/me`,
    "",
    `${firstName ? `Hi ${firstName},` : "Hi,"} PunProfile picked ${n === 1 ? "a new role" : `${n} new roles`} for you. ${n === 1 ? "It is" : "They are"} on your Job Search Dashboard: ${SITE}/me`,
    "",
    ...(receipt ? [`ใช้ ${receipt.used} โทเคนจากแพ็กเกจของคุณ เหลืออีก ${receipt.left} โทเคน · ${receipt.used} token used, ${receipt.left} left`] : []),
    "คุณได้รับอีเมลนี้เพราะใช้บริการคัดตำแหน่งงานของ PunProfile",
  ].join("\n");
}
