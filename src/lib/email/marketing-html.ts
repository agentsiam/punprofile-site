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
 * words of its own: the unsubscribe label and the footer's channel names and
 * links are all handed to it, and it takes the same plain-text body the text
 * part uses and lays it out.
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
 * action, and the dark band as the footer. The card takes the 30px card radius
 * and the dark band takes 40px, because `design.md` gives the large panel and
 * the dark band `3xl` rather than the card's `2xl`.
 *
 * **Nothing in the footer is bare text.** The wordmark used to be the literal
 * string `punprofile.app` set in lime. Gmail recognises a bare domain as a web
 * address, wraps it in its own anchor and paints it its own blue with an
 * underline, so the one place the brand colour appeared was the one place it
 * was overridden, and no preview outside Gmail could show it. The footer is now
 * the reversed logo linked to the site, and every other line is a real anchor
 * carrying an explicit colour, which Gmail leaves alone.
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
const CANVAS_BRAND = token("canvas-brand");
const ON_CANVAS_DARK = token("on-canvas-dark");
const INK_DEEP = token("ink-deep");
const PRIMARY = token("primary");
const ON_PRIMARY = token("on-primary");

/**
 * Anuphan first for the clients that load it, then the Thai faces that ship
 * with macOS, iOS, Windows and Android. A Latin-only stack would leave Thai to
 * whatever the client picks, which is where clipped tone marks come from.
 */
/**
 * The reversed wordmark, near-white type with the orange mark, for the dark
 * footer band. Hosted rather than inlined: Gmail refuses `data:` image URIs, and
 * the site's own reversed logo is an SVG, which most mail clients will not
 * render at all. Rendered from `public/punprofile-logo-reversed.svg` at 320px
 * wide and shown at 160, so it stays sharp on a retina screen.
 */
const LOGO = "https://punprofile.app/punprofile-logo-email-reversed.png";

/**
 * The same wordmark in black, for the lime banner at the top. Lime is a fill and
 * never carries type, so the mark on it is the dark one; `design.md` puts
 * `ink-deep` on `canvas-brand` for exactly this reason.
 */
const LOGO_DARK = "https://punprofile.app/punprofile-logo-email.png";

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
function blocks(body: string, image?: { src: string; alt: string }): string {
  const paragraphs = body.trim().split(/\n\s*\n/);
  return paragraphs
    .map((paragraph, index) => {
      const lines = paragraph.split("\n").map((l) => l.trim()).filter(Boolean);
      const urlAt = lines.findIndex(isUrl);

      if (urlAt > -1) {
        const href = lines[urlAt];
        const label = lines[urlAt - 1] ?? href;
        const before = lines.slice(0, Math.max(0, urlAt - 1));
        const pill = `<table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr><td style="border-radius:9999px;background:${PRIMARY};">
                <a href="${escape(href)}" style="display:inline-block;padding:13px 28px;border-radius:9999px;font-family:${FONT};font-size:17px;line-height:24px;font-weight:600;color:${ON_PRIMARY};text-decoration:none;">${escape(label)}</a>
              </td></tr>
            </table>`;
        const ask = image
          ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 28px;">
              <tr>
                <td class="stack" width="236" valign="middle" style="width:236px;padding:0 20px 0 0;">
                  <img src="${escape(image.src)}" alt="${escape(image.alt)}" width="236" style="display:block;width:100%;max-width:236px;height:auto;border-radius:20px;border:0;">
                </td>
                <td class="stack" valign="middle">${pill}</td>
              </tr>
            </table>`
          : `<div style="margin:8px 0 28px;">${pill}</div>`;
        return `${before.map((l) => `<p style="${P}">${escape(l)}</p>`).join("")}${ask}`;
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
  /** The word the stop link is written on, passed in rather than written here. */
  stopLabel: string;
  /**
   * The footer's channels, in the order they should read. Passed in for the
   * same reason the copy is: which channels PunProfile points a reader at is a
   * decision this file does not get to make.
   */
  channels?: { label: string; href: string }[];
  /**
   * The second ask, under the article's own. Quieter by construction: a white
   * card like the first but shorter, and an outlined pill rather than a lime
   * one, because `design.md` keeps lime as the single thing that reads as
   * pressable and a second lime fill would make the email ask twice at equal
   * volume. It carries no price: a price restated in an email is a second place
   * for a stale number to live, so the card points at the page that owns it.
   */
  offer?: { title: string; body: string; ctaLabel: string; href: string };
  /** The one way to reach a person, on the channel the business publishes. */
  contact?: { label: string; href: string };
  /**
   * The article's own image, at a public URL, with the alt text that already
   * describes it. Optional: an email that announces nothing visual does not
   * need one, and a broken image is worse than no image.
   */
  image?: { src: string; alt: string };
}): string {
  const preheader = args.body.trim().split(/\n\s*\n/)[1] ?? args.subject;
  const stop = escape(args.stopUrl);
  const channels = args.channels ?? [];
  const link = `color:${ON_CANVAS_DARK};text-decoration:underline;`;

  return `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escape(args.subject)}</title>
<style>
  @media only screen and (max-width:480px) {
    .stack { display:block !important; width:100% !important; max-width:100% !important; padding:0 0 20px 0 !important; }
    .stack img { width:100% !important; max-width:100% !important; }
  }
</style>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anuphan:wght@400;500;600;700&display=swap">
</head>
<body style="margin:0;padding:0;background:${CANVAS_SOFT};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escape(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${CANVAS_SOFT};">
  <tr><td align="center" style="padding:32px 16px;">

    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
      <tr><td align="center" style="background:${CANVAS_BRAND};border-radius:30px;padding:28px 32px;text-align:center;">
        <a href="https://punprofile.app" style="display:inline-block;text-decoration:none;">
          <img src="${LOGO_DARK}" alt="PunProfile" width="150" style="display:block;width:150px;max-width:150px;height:auto;border:0;margin:0 auto;">
        </a>
      </td></tr>

      <tr><td style="height:16px;line-height:16px;font-size:0;">&nbsp;</td></tr>

      <tr><td style="background:${CANVAS};border-radius:30px;padding:48px 32px;">
        ${blocks(args.body, args.image)}
      </td></tr>

      <tr><td style="height:16px;line-height:16px;font-size:0;">&nbsp;</td></tr>

      ${
        args.offer
          ? `<tr><td style="background:${CANVAS};border-radius:30px;padding:32px;">
        <p style="margin:0 0 6px;font-family:${FONT};font-size:20px;line-height:32px;font-weight:600;color:${INK_DEEP};">${escape(args.offer.title)}</p>
        <p style="margin:0 0 20px;font-family:${FONT};font-size:18px;line-height:32px;color:${INK_DEEP};">${escape(args.offer.body)}</p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="border-radius:9999px;border:1px solid ${INK_DEEP};">
            <a href="${escape(args.offer.href)}" style="display:inline-block;padding:12px 26px;border-radius:9999px;font-family:${FONT};font-size:17px;line-height:24px;font-weight:600;color:${INK_DEEP};text-decoration:none;">${escape(args.offer.ctaLabel)}</a>
          </td></tr>
        </table>
      </td></tr>

      <tr><td style="height:16px;line-height:16px;font-size:0;">&nbsp;</td></tr>`
          : ""
      }

      <tr><td style="background:${CANVAS_DARK};border-radius:40px;padding:32px;">
        <a href="https://punprofile.app" style="display:inline-block;text-decoration:none;">
          <img src="${LOGO}" alt="PunProfile" width="160" style="display:block;width:160px;max-width:160px;height:auto;border:0;">
        </a>
        ${
          args.contact
            ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 0;">
                <tr><td style="border-radius:9999px;background:${PRIMARY};">
                  <a href="${escape(args.contact.href)}" style="display:inline-block;padding:12px 26px;border-radius:9999px;font-family:${FONT};font-size:17px;line-height:24px;font-weight:600;color:${ON_PRIMARY};text-decoration:none;">${escape(args.contact.label)}</a>
                </td></tr>
              </table>`
            : ""
        }
        ${
          channels.length > 0
            ? `<p style="margin:24px 0 0;font-family:${FONT};font-size:14px;line-height:22px;color:${ON_CANVAS_DARK};">${channels
                .map((c) => `<a href="${escape(c.href)}" style="${link}">${escape(c.label)}</a>`)
                .join(`<span style="padding:0 10px;">&middot;</span>`)}</p>`
            : ""
        }
        <p style="margin:18px 0 0;font-family:${FONT};font-size:14px;line-height:22px;color:${ON_CANVAS_DARK};">
          <a href="${stop}" style="${link}">${escape(args.stopLabel)}</a>
        </p>
      </td></tr>

    </table>

  </td></tr>
</table>
</body>
</html>`;
}
