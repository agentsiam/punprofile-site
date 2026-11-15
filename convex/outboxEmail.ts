/**
 * The shell for a coach-approved message to a candidate,
 * `candidate-situation-handoff.md` § 4.
 *
 * Every other email here is its own design, because each one does one job: the
 * sign-in code shows a code, the matched-role notice leads with the job. This
 * one carries whatever the coach approved, so it is a plain letter and nothing
 * else: the mark, a dark header with the greeting and the subject, the
 * paragraphs, and a quiet line at the foot. No blog card, no newsletter dress,
 * no unsubscribe link. It is a service message about work the candidate paid
 * for.
 *
 * The words are not here. They are written per candidate from the Situation
 * panel plus the event, stored on the draft, and read back by the coach before
 * anything goes. This file only puts them in an envelope.
 */

import { C, DISPLAY, FONT, SITE, esc } from "./codeEmail";

/** One blank line between paragraphs, which is how a coach writes a message. */
export const paragraphs = (body: string): string[] =>
  body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

export function outboxEmailHtml(firstName: string | null, subject: string, body: string): string {
  const greet = firstName ? `สวัสดีคุณ ${esc(firstName)}` : "สวัสดี";
  const paras = paragraphs(body)
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font-family:${FONT};font-size:16px;line-height:1.8;color:${C.body};">${esc(p).replace(/\n/g, "<br>")}</p>`,
    )
    .join("\n      ");

  return `<!DOCTYPE html>
<html lang="th" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(subject)}</title>
<link href="https://fonts.googleapis.com/css2?family=Anuphan:wght@400;600;700&family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet">
<style>
  @media (max-width:620px){ .px{padding-left:24px!important;padding-right:24px!important} .h1{font-size:24px!important} }
  a{color:${C.deep}}
</style>
</head>
<body style="margin:0;padding:0;background:${C.soft};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.soft};">
<tr><td align="center" style="padding:32px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">

  <tr><td style="padding:0 8px 20px;">
    <a href="${SITE}"><img src="${SITE}/punprofile-logo-email.png" width="160" height="44" alt="PunProfile" style="display:block;border:0;"></a>
  </td></tr>

  <tr><td style="background:${C.canvas};border-radius:24px;overflow:hidden;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

    <tr><td class="px" style="background:${C.deep};padding:36px 40px 32px;border-radius:24px 24px 0 0;">
      <p style="margin:0 0 12px;font-family:${FONT};font-size:15px;color:${C.onDeep};">${greet}</p>
      <h1 class="h1" style="margin:0;font-family:${DISPLAY};font-size:28px;font-weight:700;line-height:1.35;color:${C.lime};">${esc(subject)}</h1>
    </td></tr>

    <tr><td class="px" style="padding:32px 40px 8px;">
      ${paras}
    </td></tr>

    <tr><td class="px" style="padding:8px 40px 36px;">
      <p style="margin:0;font-family:${FONT};font-size:14px;line-height:1.7;color:${C.body};">
        ความคืบหน้าทั้งหมดอยู่ที่ <a href="${SITE}/me">${SITE}/me</a>
      </p>
    </td></tr>

  </table>
  </td></tr>

  <tr><td style="padding:20px 8px 0;">
    <p style="margin:0;font-family:${FONT};font-size:12px;line-height:1.7;color:${C.mute};">PunProfile</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

export function outboxEmailText(firstName: string | null, subject: string, body: string): string {
  const greet = firstName ? `สวัสดีคุณ ${firstName}` : "สวัสดี";
  return [greet, "", subject, "", ...paragraphs(body), "", `ความคืบหน้าทั้งหมดอยู่ที่ ${SITE}/me`, "", "PunProfile"].join("\n");
}
