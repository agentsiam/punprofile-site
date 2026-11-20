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

import { C, FONT, SITE, card, emailDocument, esc, headerBand, logoRow } from "./emailShell";

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

  return emailDocument({
    title: esc(subject),
    gutter: "32px 12px",
    heavyDisplay: true,
    css: `  @media (max-width:620px){ .px{padding-left:24px!important;padding-right:24px!important} .h1{font-size:24px!important} }`,
    rows: `${logoRow()}

${card(`${headerBand({ greeting: greet, heading: esc(subject), padding: "36px 40px 32px", size: 28, greetingGap: 12 })}

    <tr><td class="px" style="padding:32px 40px 8px;">
      ${paras}
    </td></tr>

    <tr><td class="px" style="padding:8px 40px 36px;">
      <p style="margin:0;font-family:${FONT};font-size:14px;line-height:1.7;color:${C.body};">
        ความคืบหน้าทั้งหมดอยู่ที่ <a href="${SITE}/me">${SITE}/me</a>
      </p>
    </td></tr>`)}

  <tr><td style="padding:20px 8px 0;">
    <p style="margin:0;font-family:${FONT};font-size:12px;line-height:1.7;color:${C.mute};">PunProfile</p>
  </td></tr>`,
  });
}

export function outboxEmailText(firstName: string | null, subject: string, body: string): string {
  const greet = firstName ? `สวัสดีคุณ ${firstName}` : "สวัสดี";
  return [greet, "", subject, "", ...paragraphs(body), "", `ความคืบหน้าทั้งหมดอยู่ที่ ${SITE}/me`, "", "PunProfile"].join("\n");
}
