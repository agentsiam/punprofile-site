/**
 * The HTML part of a marketing email. 11/11/2026.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS A TEMPLATE AND NOT CONTENT
 * ---------------------------------------------------------------------------
 *
 * `marketingSend.send` takes the words as an argument, because what PunProfile
 * says to a list is an editorial decision owned by `03_Content_System.md` and
 * drafted in the coaching repo. That rule is about words. This file holds no
 * words of its own except the two unsubscribe labels it is handed: it takes the
 * same plain-text body the text part uses and lays it out.
 *
 * So the copy stays one string in one place, the two parts of the email cannot
 * drift, and nobody has to write HTML to send one.
 *
 * ---------------------------------------------------------------------------
 * EVERY COLOUR COMES FROM design.md
 * ---------------------------------------------------------------------------
 *
 * Read out of `design-tokens.generated.ts` rather than typed, because a hex
 * typed here is a copy of the palette that goes stale the day the palette
 * changes (C54). Email clients strip `:root` and do not resolve `var()`, so the
 * values are resolved to literals at render time instead of being referenced.
 *
 * The layout is the design system's own idiom: a `canvas-soft` band with a
 * white 30px card on it, `ink-deep` for the copy, one lime pill for the one
 * action, and the dark band as the footer. A lime fill never carries type, but
 * on `canvas-dark` lime IS the accent, which is what the wordmark uses there.
 *
 * ---------------------------------------------------------------------------
 * WHAT EMAIL FORCES
 * ---------------------------------------------------------------------------
 *
 * Tables, inline styles, no custom properties, no flex or grid, 600px. Anuphan
 * is linked for the clients that load webfonts and falls back to the system
 * Thai faces everywhere else, which is most of them. What does NOT fall back is
 * the line box: Thai tone marks stack above and below the baseline, so the
 * `thai-*` line heights are carried inline on every block of copy.
 */
import { BRAND_TOKENS_CSS } from "../design-tokens.generated";

/** One token's value, by its generated custom-property name. */
function token(name: string): string {
  const found = BRAND_TOKENS_CSS.match(new RegExp(`--color-${name}:\\s*([^;]+);`));
  if (!found) throw new Error(`design token --color-${name} is not in the generated block`);
  return found[1].trim();
}

const CANVAS = token("canvas");
const CANVAS_SOFT = token("canvas-soft");
const CANVAS_DARK = token("canvas-dark");
const ON_CANVAS_DARK = token("on-canvas-dark");
const INK_DEEP = token("ink-deep");
const PRIMARY = token("primary");
const ON_PRIMARY = token("on-primary");

/**
 * Anuphan first for the clients that load it, then the Thai faces that ship
 * with macOS, iOS, Windows and Android. A Latin-only stack would leave Thai to
 * whatever the client picks, which is where clipped tone marks come from.
 */
const FONT =
  "Anuphan, 'Noto Sans Thai', 'Sukhumvit Set', 'Leelawadee UI', Thonburi, " +
  "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const isUrl = (line: string) => /^https?:\/\/\S+$/.test(line.trim());

/** `thai-body`, 18/32. The line box is the part that cannot be left to the client. */
const P = `margin:0 0 20px;font-family:${FONT};font-size:18px;line-height:32px;color:${INK_DEEP};`;

/**
 * Lay the plain-text body out as blocks.
 *
 * A paragraph is a run of lines between blank lines. A line that is a bare URL
 * becomes the lime pill, and the line above it in the same paragraph becomes
 * its label, which is why the copy puts the invitation on its own line. The
 * last paragraph is the sign-off and is set quieter.
 */
function blocks(body: string): string {
  const paragraphs = body.trim().split(/\n\s*\n/);
  return paragraphs
    .map((paragraph, index) => {
      const lines = paragraph.split("\n").map((l) => l.trim()).filter(Boolean);
      const urlAt = lines.findIndex(isUrl);

      if (urlAt > -1) {
        const href = lines[urlAt];
        const label = lines[urlAt - 1] ?? href;
        const before = lines.slice(0, Math.max(0, urlAt - 1));
        return `${before.map((l) => `<p style="${P}">${escape(l)}</p>`).join("")}
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 28px;">
            <tr><td style="border-radius:9999px;background:${PRIMARY};">
              <a href="${escape(href)}" style="display:inline-block;padding:13px 28px;border-radius:9999px;font-family:${FONT};font-size:17px;line-height:24px;font-weight:600;color:${ON_PRIMARY};text-decoration:none;">${escape(label)}</a>
            </td></tr>
          </table>`;
      }

      if (index === paragraphs.length - 1) {
        return `<p style="${P}margin-bottom:0;">${lines.map(escape).join("<br>")}</p>`;
      }
      return `<p style="${P}">${lines.map(escape).join("<br>")}</p>`;
    })
    .join("\n");
}

export function renderMarketingEmail(args: {
  subject: string;
  /** The same plain text the text part sends. */
  body: string;
  /** The recipient's own one-click stop link. */
  stopUrl: string;
  /** The unsubscribe line, Thai then English, passed in rather than written here. */
  stopLabels: { th: string; en: string };
}): string {
  const preheader = args.body.trim().split(/\n\s*\n/)[1] ?? args.subject;
  const stop = escape(args.stopUrl);
  const link = `color:${ON_CANVAS_DARK};text-decoration:underline;`;

  return `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escape(args.subject)}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anuphan:wght@400;500;600;700&display=swap">
</head>
<body style="margin:0;padding:0;background:${CANVAS_SOFT};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escape(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${CANVAS_SOFT};">
  <tr><td align="center" style="padding:32px 16px;">

    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
      <tr><td style="padding:0 8px 20px;font-family:${FONT};font-size:17px;line-height:24px;font-weight:600;letter-spacing:0.1px;color:${INK_DEEP};">PunProfile</td></tr>

      <tr><td style="background:${CANVAS};border-radius:30px;padding:48px 32px;">
        ${blocks(args.body)}
      </td></tr>

      <tr><td style="height:16px;line-height:16px;font-size:0;">&nbsp;</td></tr>

      <tr><td style="background:${CANVAS_DARK};border-radius:30px;padding:28px 32px;">
        <p style="margin:0 0 18px;font-family:${FONT};font-size:14px;line-height:22px;color:${ON_CANVAS_DARK};">
          <a href="${stop}" style="${link}">${escape(args.stopLabels.th)}</a>
          &nbsp;&middot;&nbsp;
          <a href="${stop}" style="${link}">${escape(args.stopLabels.en)}</a>
        </p>
        <p style="margin:0;font-family:${FONT};font-size:16px;line-height:24px;font-weight:600;color:${PRIMARY};">punprofile.app</p>
      </td></tr>

    </table>

  </td></tr>
</table>
</body>
</html>`;
}
