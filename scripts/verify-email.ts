/**
 * The email surface, checked.
 *
 * `verify:copy` reads the Thai out of these templates and says nothing about
 * the document around it. Nothing checked the frame at all, which is how four
 * emails came to hold four copies of it and twelve hand-written colours, seven
 * of which match no design token.
 *
 * So this renders every email PunProfile sends and asserts what is true of all
 * of them. It cannot see any of it: a rendered email still has to be opened and
 * looked at, and this list does not replace that. What it does catch is the
 * drift a reader would not notice until a candidate did.
 *
 * **Five templates, two frames.** Four are built on `convex/emailShell.ts`. The
 * fifth, the newsletter in `src/lib/email/marketing-html.ts`, frames itself,
 * and for the first fortnight it existed nothing here rendered it at all,
 * because it sits under `src/` and this file only ever imported from `convex/`.
 * A whole live sender was unchecked for no better reason than which folder it
 * was in. It is rendered twice now, every optional block off and then every one
 * on, since those branches appear in no other render.
 *
 * The document rules apply to all five. Two move, and `Kind` below says why.
 *
 * Run by `npm run verify:email`, and in the pre-push list.
 */

import { codeEmailHtml } from "../convex/codeEmail.js";
import { matchEmailHtml, matchEmailText, type NoticeRole } from "../convex/matchEmail.js";
import { outboxEmailHtml, outboxEmailText } from "../convex/outboxEmail.js";
import { reportEmailHtml, reportEmailText } from "../convex/reportEmail.js";
import { C } from "../convex/emailShell.js";
import { renderMarketingEmail } from "../src/lib/email/marketing-html.js";
import { issueDateTh } from "../src/lib/email/issue-date.js";
import { readFileSync } from "node:fs";

const PALETTE = new Set(Object.values(C).map((h) => h.toLowerCase()));

/**
 * The email palette is the design system's light scheme, flattened to hex
 * because no mail client reads a CSS variable. Every colour an email uses has
 * to be a token first, which is what this reads: the generated light values
 * out of `tokens.generated.css`, whose own source is `design.md` (R14).
 *
 * One exception, declared rather than discovered: the backdrop behind the
 * matched-roles header picture is sampled from the photograph, so it answers to
 * the image and not to the system.
 */
const OWN_TO_EMAIL = new Set(["headerGround"]);

function lightTokenValues(): Set<string> {
  const css = readFileSync("src/app/tokens.generated.css", "utf8");
  const cut = css.indexOf("prefers-color-scheme: dark");
  const light = cut > 0 ? css.slice(0, cut) : css;
  return new Set([...light.matchAll(/--[\w-]+:\s*(#[0-9a-fA-F]{6})/g)].map((m) => m[1].toLowerCase()));
}

const role: NoticeRole = {
  employer: "Acme GmbH",
  roleTitle: "Data Analyst",
  country: "Germany",
  location: "Berlin",
  jobUrl: "https://example.com/j/1",
  matchReason: "ตรงกับประสบการณ์ด้านข้อมูลของคุณ",
  salary: "€55,000",
  feedbackToken: "tok123",
};

/**
 * The newsletter's furniture, as `convex/marketingSend.ts` declares it: on
 * every message that function sends whatever the caller passes, so it is part
 * of the template rather than content.
 */
const STOP_TH = "หยุดรับอีเมลนี้";
const STOP_URL = "https://punprofile.app/stop/tok123";
const CHANNELS = [
  { label: "Facebook", href: "https://www.facebook.com/punprofile" },
  { label: "TikTok", href: "https://www.tiktok.com/@punprofile" },
];

/**
 * Placeholder Thai, in the same spirit as the coach message's below: this
 * checks the document a template builds and never the words poured into it.
 * The newsletter's real copy is an argument drafted in the sibling repo, and
 * reading it from there would couple a pre-push gate to that checkout for
 * nothing this file asserts.
 */
const NEWS_BODY = "ย่อหน้าแรก\n\nย่อหน้าที่สอง\n\nย่อหน้าที่สาม";
const NEWS_TEXT = `${NEWS_BODY}\n\n---\n${STOP_TH}: ${STOP_URL}`;

/**
 * Which of two contracts an email is held to.
 *
 * `service` is the four built on `emailShell.ts`: the palette is that module's
 * table and nothing else, because R51 forbids a hex in a template, and the foot
 * says why the message arrived.
 *
 * `list` is the newsletter. Both rules move rather than relax. It holds no hex
 * at all, resolving every colour out of the generated token layer by name at
 * render time, so it cannot invent one and any light-scheme value is legitimate
 * including the secondary tints the shell's table has no reason to carry. And
 * what makes it honest is a one-click stop rather than a reason sentence: the
 * reason belongs to copy the sender hands in, so a template cannot promise it.
 */
type Kind = "service" | "list";

type Mail = { id: string; html: string; text?: string; kind?: Kind };

const MAILS: Mail[] = [
  { id: "sign-in code", html: codeEmailHtml("มายด์", "a@b.c", "123456", null) },
  { id: "matched roles", html: matchEmailHtml("มายด์", [role], { used: 1, left: 12 }), text: matchEmailText("มายด์", [role], { used: 1, left: 12 }) },
  { id: "coach message", html: outboxEmailHtml("มายด์", "เรื่องที่ต้องแจ้ง", "ย่อหน้าแรก\n\nย่อหน้าที่สอง"), text: outboxEmailText("มายด์", "เรื่องที่ต้องแจ้ง", "ย่อหน้าแรก\n\nย่อหน้าที่สอง") },
  { id: "fit report", html: reportEmailHtml("มายด์", { used: 20, left: 13 }), text: reportEmailText("มายด์", { used: 20, left: 13 }) },

  // The newsletter, twice: every optional block off, then every one on. The
  // optional branches are where a frame fault hides, because nothing else
  // renders them.
  {
    id: "newsletter",
    kind: "list",
    html: renderMarketingEmail({
      subject: "หัวเรื่อง",
      body: NEWS_BODY,
      stopUrl: STOP_URL,
      stopLabel: STOP_TH,
      channels: CHANNELS,
    }),
    text: NEWS_TEXT,
  },
  {
    id: "newsletter, everything on",
    kind: "list",
    html: renderMarketingEmail({
      subject: "หัวเรื่อง",
      body: NEWS_BODY,
      stopUrl: STOP_URL,
      stopLabel: STOP_TH,
      channels: CHANNELS,
      masthead: { name: "คนไทยทำงานในยุโรป", date: issueDateTh() },
      image: { src: "https://punprofile.app/blog/salary-thresholds-europe.jpg", alt: "ภาพประกอบบทความ" },
      contact: { label: "LINE", href: "https://line.me/R/ti/p/@punprofile" },
      cards: [
        {
          title: "EU Fit Check",
          body: "ดูว่าคุณอยู่ตรงไหนของเส้นทางการทำงานในยุโรป",
          ctaLabel: "เริ่มทำแบบประเมิน",
          href: "https://punprofile.app/eu-fit-check",
          tint: "cyan",
        },
        {
          title: "Real Stories",
          body: "เรื่องจริงของคนไทยที่ไปทำงานในยุโรปแล้ว",
          ctaLabel: "อ่านเรื่องล่าสุด",
          href: "https://punprofile.app/blog",
          tint: "orange",
          image: { src: "https://punprofile.app/blog/salary-thresholds-europe.jpg", alt: "ภาพประกอบเรื่องเล่า" },
        },
      ],
    }),
    text: NEWS_TEXT,
  },
];

const problems: string[] = [];
const fail = (id: string, what: string) => problems.push(`${id}: ${what}`);

// The palette against the design system, before any email is rendered.
const light = lightTokenValues();
for (const [role, hex] of Object.entries(C)) {
  if (OWN_TO_EMAIL.has(role)) continue;
  if (!light.has(hex.toLowerCase())) {
    fail("palette", `${role} ${hex} is no longer a light-scheme token; change it in design.md and run npm run tokens`);
  }
}

for (const m of MAILS) {
  const { id, html, text } = m;
  const kind: Kind = m.kind ?? "service";

  // The document. One of each, and Thai, because the whole surface is Thai.
  // The doctype is matched without case, which is what HTML says it is: the
  // shell writes it upper and the newsletter lower, and neither is wrong.
  if ((html.match(/<!doctype html>/gi) ?? []).length !== 1) fail(id, "not exactly one doctype");
  if (!/<html lang="th"/.test(html)) fail(id, 'the document is not lang="th"');
  if ((html.match(/<title>/g) ?? []).length !== 1) fail(id, "not exactly one title");
  if (!html.includes("max-width:600px")) fail(id, "no 600px column");
  if (!/<meta name="color-scheme" content="light">/.test(html)) fail(id, "no light color-scheme, so a dark client inverts it");

  // Thai only, since 20/11/2026. The translated block at the foot told a Thai
  // reader nothing and told an English reader they were an afterthought.
  if (/lang="en"/.test(html)) fail(id, 'carries a lang="en" block');
  if (/>In English</.test(html)) fail(id, "carries an In English heading");

  // For a service email the palette is `emailShell.ts` and nowhere else, so a
  // hex that is not in it is a colour invented in a template. The newsletter
  // writes no hex at all, so the question there is only whether the token it
  // resolved is one this design system still has.
  const allowed = kind === "list" ? light : PALETTE;
  for (const hex of new Set(html.match(/(?<!&)#[0-9a-fA-F]{6}\b/g) ?? [])) {
    if (!allowed.has(hex.toLowerCase())) {
      fail(id, kind === "list"
        ? `colour ${hex} is not a light-scheme token any more`
        : `colour ${hex} is not in the email palette`);
    }
  }

  // R10: chat, LINE, email and social copy carry no em dashes.
  if (html.includes("—")) fail(id, "em dash in the copy");

  // Every link leaves for somewhere real, since a mail client has no base URL.
  for (const href of html.match(/href="([^"]+)"/g) ?? []) {
    const url = href.slice(6, -1);
    if (!/^https:\/\//.test(url)) fail(id, `relative or non-https link ${url}`);
  }

  // A service message says why it arrived, which is what makes it one, and is
  // why none of them carries an unsubscribe link. A list email is the other
  // way round: the reason is in copy the sender hands in, so the template
  // cannot promise it, and what it must carry instead is the way out.
  if (kind === "list") {
    if (!html.includes(STOP_TH)) fail(id, "no stop link, which is what a list email owes its reader");
    if (!html.includes(STOP_URL)) fail(id, "the stop link does not carry the recipient's own token");
  } else if (id !== "coach message" && !html.includes("คุณได้รับอีเมลนี้เพราะ")) {
    fail(id, "does not say why the candidate received it");
  }

  if (text !== undefined) {
    if (!text.trim()) fail(id, "empty plain-text part");
    if (/<[a-z/][^>]*>/i.test(text)) fail(id, "HTML leaked into the plain-text part");
    if (text.includes("—")) fail(id, "em dash in the plain-text part");
  }
}

if (problems.length) {
  console.error("email problems:\n" + problems.map((p) => `  ${p}`).join("\n"));
  process.exit(1);
}
const templates = new Set(MAILS.map((m) => m.id.split(",")[0])).size;
const listed = MAILS.filter((m) => m.kind === "list").length;
console.log(
  `email OK: ${templates} templates in ${MAILS.length} renders, Thai only. ` +
    `${templates - 1} on the shell's frame and its ${Object.keys(C).length} palette roles ` +
    `(${Object.keys(C).length - OWN_TO_EMAIL.size} of them design tokens); ` +
    `the newsletter on its own frame, ${listed} renders, every colour resolved from the ` +
    `${light.size} light-scheme tokens at render time.`,
);
