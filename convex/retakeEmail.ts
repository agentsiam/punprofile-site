/**
 * The email telling a lead from the old questionnaire that EU Fit Check has been
 * rebuilt, and asking them to answer it and download their report.
 *
 * Copy: `email-assessment-rebuilt.md` in the sibling repo's `work-content/email/`,
 * and every Thai string in it is Paul's own, which is why it is also in
 * `golden-th/email/e-assessment-rebuilt.md`. This file holds the envelope and
 * the copy, as every template on this shell does, and decides nothing about
 * either.
 *
 * **One thing this file deliberately does not do.** It takes the greeting name
 * rather than deriving one, because `greetingName()` reads `nickname` then
 * `firstName` and the cohort this is written for has only `fullName`, so what
 * fills `{ชื่อ}` is a decision above this layer. It went out on 24/11/2026 with
 * that argument null, so every recipient got the no-name greeting.
 *
 * The send path is `retakeSend.ts`, and it resolves `("email", "service")`: this
 * message is service, Paul's call, so it rests on the consent the cohort gave
 * when they filled the survey in rather than on `marketing.ts`, which requires a
 * marketing opt-in all but three of them never gave.
 *
 * The picture beside the button is the proof block from the design system's
 * Email section: what pressing the primary gives, in a 236px column, stacking
 * above the pill under 480px.
 */

import {
  C,
  DISPLAY,
  FONT,
  SITE,
  button,
  card,
  emailDocument,
  footerBlock,
  headerBand,
  logoRow,
} from "./emailShell";

/**
 * The two asks, per the design system's Email section.
 *
 * The pill is the primary: EU Fit Check, which is what the paragraphs argue for
 * and what the picture beside it shows, and it carries the campaign parameters
 * so the send is attributed. LINE is the secondary, a link inside the closing
 * sentence rather than a second button, which is the quieter of the two forms
 * the section allows and the right one here because the sentence says what it is
 * for. An add-friend link takes no query string, so that tap is not recorded;
 * the link worth measuring is the primary.
 */
const HREF = `${SITE}/efc-assessment?src=email&campaign=survey-import-retake-2026-11`;
const LINE_HREF = "https://line.me/ti/p/m5CG2t8Aa4";
/** `cta.ts` › DESTINATIONS.line, with `LINE` fixed uppercase by the termbase. */
const LINE_PHRASE = "ทักทาง LINE";

const SUBJECT = "เมื่อไหร่จะได้ย้ายไป EU ตอบแบบสอบถามแล้วโหลดรายงานเลย";
const HEADING = "มาดูกันว่าตอนนี้คุณอยู่จุดไหน";
const PREHEADER = "ใช้เวลาแค่ไม่กี่นาที ก็เห็นว่าควรเริ่มแก้เรื่องไหนก่อน โดยไม่มีค่าใช้จ่าย";
const CTA = "ทำ EFC และโหลดรายงานของคุณ";
/**
 * The closing line, which carries the secondary ask.
 *
 * It used to say reply to this email, and `MAIL_FROM` is `no-reply@`: a reader
 * sees that and does not write back whatever `MAIL_REPLY_TO` is set to, so the
 * copy asked for something its own sender said was impossible.
 */
const REPLY_BEFORE = "หากมีอะไรอยากสอบถาม ";
const REPLY_AFTER = " ได้เลยครับ";
const FOOT = "คุณได้รับอีเมลนี้เนื่องจากคุณเคยทำแบบสอบถามของ PunProfile ไว้";

/** The city photograph at the head, and the free report's first page beside the pill. */
const HEADER_PICTURE = `${SITE}/images/photos/amsterdam-canal-houses-wide.jpg`;
const HEADER_ALT = "ทิวตึกริมคลองในเมืองยุโรปยามแดดบ่าย";
const PROOF_PICTURE = `${SITE}/products/report-free-page1-th.jpg`;
const PROOF_ALT = "หน้าแรกของรายงานผลประเมินฉบับย่อ ตัวอย่างสิ่งที่คุณจะได้รับ";

/**
 * The body, which is also the plain-text part.
 *
 * Written line by line with the URL under the words that become the button,
 * because that shape is already the text part: one body, both parts, and no
 * second copy of the copy to drift.
 */
const PARAGRAPHS = [
  "ก่อนหน้านี้คุณเคยทำแบบสอบถามของ PunProfile ไว้ ตอนนั้นคุณบอกว่ากำลังเล็งประเทศไหน สนใจทำงานสายอะไร และ CV อยู่ในขั้นไหนแล้ว",
  "ตอนนี้เราได้ปรับ EU Fit Check ใหม่ให้ถามละเอียดกว่าเดิม ประเมินได้แม่นยำขึ้น และแสดงผลให้คุณได้ทันทีโดยไม่ต้องรอ",
  "ใช้เวลาแค่ไม่กี่นาที คุณก็ดาวน์โหลดรายงานได้เลย จะเห็นว่าตอนนี้ตัวเองอยู่จุดไหนในแต่ละด้าน และควรเริ่มแก้เรื่องไหนก่อน โดยไม่มีค่าใช้จ่าย",
  "คำตอบเดิมของคุณยังอยู่ครบครับ แต่แบบใหม่ถามครอบคลุมกว่า ผมเลยอยากชวนให้คุณลองทำอีกครั้ง",
];

const greet = (name: string | null) => (name ? `สวัสดีครับคุณ${name}` : "สวัสดีครับ");

export const retakeEmailSubject = SUBJECT;

export function retakeEmailHtml(name: string | null): string {
  const para = (t: string) =>
    `    <tr><td class="px" style="padding:0 40px 18px;font-family:${FONT};font-size:16px;line-height:1.8;color:${C.body};">${t}</td></tr>`;

  return emailDocument({
    title: SUBJECT,
    preheader: PREHEADER,
    gutter: "32px 12px",
    heavyDisplay: true,
    css: `  @media (max-width:620px){
    .px{padding-left:24px!important;padding-right:24px!important}
    .h1{font-size:26px!important}
  }
  @media (max-width:480px){
    .stack{display:block!important;width:100%!important;max-width:100%!important;padding:0 0 18px 0!important}
    .stack img{width:100%!important;max-width:100%!important}
  }`,
    rows: `${logoRow()}
${card(
  `    <tr><td style="line-height:0;font-size:0;">
      <img src="${HEADER_PICTURE}" width="600" height="198" alt="${HEADER_ALT}" style="display:block;width:100%;max-width:600px;height:auto;border:0;">
    </td></tr>
${headerBand({ greeting: greet(name), heading: HEADING }).replace("border-radius:24px 24px 0 0;", "")}
    <tr><td class="px" style="padding:34px 40px 0;"></td></tr>
${PARAGRAPHS.map(para).join("\n")}
    <tr><td class="px" style="padding:6px 40px 32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td class="stack" width="236" valign="middle" style="width:236px;padding:0 20px 0 0;">
            <a href="${HREF}" style="display:block;text-decoration:none;"><img src="${PROOF_PICTURE}" width="236" alt="${PROOF_ALT}" style="display:block;width:100%;max-width:236px;height:auto;border:1px solid ${C.line};border-radius:8px;"></a>
          </td>
          <td class="stack" valign="middle">${button(HREF, CTA)}</td>
        </tr>
      </table>
    </td></tr>
${para(`${REPLY_BEFORE}<a href="${LINE_HREF}" style="color:${C.deep};text-decoration:underline;">${LINE_PHRASE}</a>${REPLY_AFTER}`)}
    <tr><td class="px" style="padding:10px 40px 40px;font-family:${DISPLAY};font-size:16px;line-height:1.7;color:${C.deep};">Paul<br>PunProfile</td></tr>`,
)}
${footerBlock("22px 24px 0", [FOOT])}`,
  });
}

export function retakeEmailText(name: string | null): string {
  return [
    greet(name),
    "",
    ...PARAGRAPHS.flatMap((p) => [p, ""]),
    CTA,
    HREF,
    "",
    `${REPLY_BEFORE}${LINE_PHRASE}${REPLY_AFTER} ${LINE_HREF}`,
    "",
    "Paul",
    "PunProfile",
    "",
    FOOT,
  ].join("\n");
}
