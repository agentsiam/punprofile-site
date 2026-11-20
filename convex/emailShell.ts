/**
 * The email surface: the frame every PunProfile email is built in, and the one
 * palette they all draw from.
 *
 * **Why this exists.** Four emails had each written out their own document:
 * the doctype, the head, the font link, the hidden preheader, the 600px column
 * and the footer, about forty identical lines apiece, with the palette hand
 * written in `codeEmail.ts` and imported by the rest. Every new email started
 * from a copy of an old one, so a fix to the frame reached whichever files
 * someone remembered. This module owns the frame; a template owns its content
 * and nothing else.
 *
 * **Why the colours are literals here and not tokens.** A mail client does not
 * read CSS variables, so every colour has to be written into the markup as hex.
 * `design.md` in the sibling repo owns the design system and says nothing about
 * email, which is how seven of these twelve values came to match no token at
 * all. Until that document has an email section (drafted for Paul), this table
 * is the email surface's palette and the one place it may be stated. **Never
 * write a hex into a template.** A colour a template needs and this table does
 * not hold is a change to the design system, not a literal in a `<td>`.
 *
 * The shape of an email here: a logo row, one white card with a dark header
 * band at its top, the content, and a quiet centred footer saying why this
 * message arrived. `matchEmail` replaces the logo row with its header picture
 * and puts its role cards outside the card, which is why this module gives
 * pieces rather than one whole-email function.
 */

import { POSTS, TOPICS, type Post } from "../src/lib/content/blog";

export const SITE = "https://punprofile.app";

/** The email palette. See the note above before adding to it. */
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
  /** The backdrop behind the matched-roles header picture, sampled from it, so
   *  a client that blocks images still shows a band of the same colour rather
   *  than a white gap. Declared in `matchEmail.ts` until 20/11/2026, which is
   *  how it escaped every check there was. */
  headerGround: "#9dcddb",
};

export const FONT =
  "Anuphan, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans Thai', Tahoma, Arial, sans-serif";
export const DISPLAY =
  "Inter, Anuphan, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans Thai', Tahoma, Arial, sans-serif";

export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * The document: everything outside the 600px column.
 *
 * `css` is the email's own `@media` block, because what has to collapse on a
 * phone belongs to the content. `gutter` is the padding around the column, and
 * `heavyDisplay` asks for Inter 900, which only the templates with a large
 * display heading load.
 */
export function emailDocument(o: {
  title: string;
  /** The hidden line a phone shows beside the subject. Omitted where a
   *  template never had one; adding it is a copy decision, not a refactor. */
  preheader?: string;
  css: string;
  gutter: string;
  heavyDisplay?: boolean;
  rows: string;
}): string {
  const weights = o.heavyDisplay ? "400;600;700;900" : "400;600;700";
  return `<!DOCTYPE html>
<html lang="th" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${o.title}</title>
<link href="https://fonts.googleapis.com/css2?family=Anuphan:wght@400;600;700&family=Inter:wght@${weights}&display=swap" rel="stylesheet">
<style>
${o.css}
  a{color:${C.deep}}
</style>
</head>
<body style="margin:0;padding:0;background:${C.soft};">${
    o.preheader ? `\n<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${o.preheader}</div>` : ""
  }
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.soft};">
<tr><td align="center" style="padding:${o.gutter};">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
${o.rows}
</table>
</td></tr>
</table>
</body>
</html>`;
}

/** The mark, linked, above the card. */
export function logoRow(padding = "0 8px 20px") {
  return `  <tr><td style="padding:${padding};">
    <a href="${SITE}"><img src="${SITE}/punprofile-logo-email.png" width="160" height="44" alt="PunProfile" style="display:block;border:0;"></a>
  </td></tr>`;
}

/** The white card the content sits in. `rows` are its own table rows. */
export function card(rows: string) {
  return `  <tr><td style="background:${C.canvas};border-radius:24px;overflow:hidden;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${rows}
  </table>
  </td></tr>`;
}

/**
 * The dark band at the top of the card: who it is to, what it is about, and
 * optionally one line saying more. The heading is the email's subject without
 * its brand suffix, which is the house pattern.
 */
export function headerBand(o: { greeting: string; heading: string; sub?: string; padding?: string; size?: number; greetingGap?: number }) {
  const pad = o.padding ?? "40px 40px 36px";
  const size = o.size ?? 30;
  const gap = o.greetingGap ?? 14;
  return `    <tr><td class="px" style="background:${C.deep};padding:${pad};border-radius:24px 24px 0 0;">
      <p style="margin:0 0 ${gap}px;font-family:${FONT};font-size:15px;color:${C.onDeep};">${o.greeting}</p>
      <h1 class="h1" style="margin:0;font-family:${DISPLAY};font-size:${size}px;font-weight:700;line-height:1.35;color:${C.lime};">${o.heading}</h1>${
        o.sub
          ? `
      <p style="margin:14px 0 0;font-family:${FONT};font-size:16px;line-height:1.7;color:${C.onDeep};">${o.sub}</p>`
          : ""
      }
    </td></tr>`;
}

/** The one action. Always the pill, always the lime. */
export function button(href: string, label: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-radius:9999px;background:${C.primary};">
<a href="${href}" style="display:inline-block;padding:15px 30px;font-family:${FONT};font-size:16px;font-weight:600;line-height:20px;color:${C.onPrimary};text-decoration:none;border-radius:9999px;">${label}</a>
</td></tr></table>`;
}

/** A numbered instruction, dark disc and lime numeral. */
export function step(n: number, text: string) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 10px;"><tr>
<td width="32" valign="top"><div style="width:26px;height:26px;border-radius:9999px;background:${C.deep};color:${C.lime};font-family:${FONT};font-size:13px;font-weight:700;line-height:26px;text-align:center;">${n}</div></td>
<td style="padding-left:10px;font-family:${FONT};font-size:15px;line-height:26px;color:${C.body};">${text}</td>
</tr></table>`;
}

/** A hairline inside the card. */
export function divider(padding = "0 40px") {
  return `    <tr><td class="px" style="padding:${padding};"><div style="height:1px;background:${C.line};line-height:1px;font-size:0;">&nbsp;</div></td></tr>`;
}

/**
 * The quiet foot. Every email says why it arrived, which is what makes it a
 * service message rather than marketing, and none of them carries an
 * unsubscribe link for the same reason.
 */
export function footerBlock(padding: string, lines: string[]) {
  return `  <tr><td align="center" style="padding:${padding};font-family:${FONT};font-size:12px;line-height:1.7;color:${C.mute};">
    ${lines.join("<br>\n    ")}
  </td></tr>`;
}

/** `punprofile.app`, in the footer's own muted colour. */
export const siteLink = `<a href="${SITE}" style="color:${C.mute};">punprofile.app</a>`;

/* ------------------------------------------------------------- blog card */

export function latestPost(): Post | null {
  const sorted = [...POSTS].sort((a, b) => b.published.localeCompare(a.published));
  return sorted[0] ?? null;
}

const ddmmyyyy = (iso: string) => iso.split("-").reverse().join("/");

/**
 * The newest article, in the one email that carries one. Publishing changes
 * the next email sent with no edit here.
 */
export function blogCard(post: Post, lang: "th" | "en") {
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
