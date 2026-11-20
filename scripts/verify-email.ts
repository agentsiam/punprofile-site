/**
 * The email surface, checked.
 *
 * `verify:copy` reads the Thai out of these templates and says nothing about
 * the document around it. Nothing checked the frame at all, which is how four
 * emails came to hold four copies of it and twelve hand-written colours, seven
 * of which match no design token.
 *
 * So this renders every email and asserts what `design.md`'s email section
 * says is true of all of them. It cannot see any of it: a rendered email still
 * has to be opened and looked at, and this list does not replace that. What it
 * does catch is the drift a reader would not notice until a candidate did.
 *
 * Run by `npm run verify:email`, and in the pre-push list.
 */

import { codeEmailHtml } from "../convex/codeEmail.js";
import { matchEmailHtml, matchEmailText, type NoticeRole } from "../convex/matchEmail.js";
import { outboxEmailHtml, outboxEmailText } from "../convex/outboxEmail.js";
import { reportEmailHtml, reportEmailText } from "../convex/reportEmail.js";
import { C } from "../convex/emailShell.js";
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

type Mail = { id: string; html: string; text?: string };

const MAILS: Mail[] = [
  { id: "sign-in code", html: codeEmailHtml("มายด์", "a@b.c", "123456", null) },
  { id: "matched roles", html: matchEmailHtml("มายด์", [role], { used: 1, left: 12 }), text: matchEmailText("มายด์", [role], { used: 1, left: 12 }) },
  { id: "coach message", html: outboxEmailHtml("มายด์", "เรื่องที่ต้องแจ้ง", "ย่อหน้าแรก\n\nย่อหน้าที่สอง"), text: outboxEmailText("มายด์", "เรื่องที่ต้องแจ้ง", "ย่อหน้าแรก\n\nย่อหน้าที่สอง") },
  { id: "fit report", html: reportEmailHtml("มายด์", { used: 20, left: 13 }), text: reportEmailText("มายด์", { used: 20, left: 13 }) },
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

  // The document. One of each, and Thai, because the whole surface is Thai.
  if ((html.match(/<!DOCTYPE html>/g) ?? []).length !== 1) fail(id, "not exactly one doctype");
  if (!/<html lang="th"/.test(html)) fail(id, 'the document is not lang="th"');
  if ((html.match(/<title>/g) ?? []).length !== 1) fail(id, "not exactly one title");
  if (!html.includes("max-width:600px")) fail(id, "no 600px column");
  if (!/<meta name="color-scheme" content="light">/.test(html)) fail(id, "no light color-scheme, so a dark client inverts it");

  // Thai only, since 20/11/2026. The translated block at the foot told a Thai
  // reader nothing and told an English reader they were an afterthought.
  if (/lang="en"/.test(html)) fail(id, 'carries a lang="en" block');
  if (/>In English</.test(html)) fail(id, "carries an In English heading");

  // The palette is `emailShell.ts` and nowhere else. A hex that is not in it
  // is a colour invented in a template.
  for (const hex of new Set(html.match(/(?<!&)#[0-9a-fA-F]{6}\b/g) ?? [])) {
    if (!PALETTE.has(hex.toLowerCase())) fail(id, `colour ${hex} is not in the email palette`);
  }

  // R10: chat, LINE, email and social copy carry no em dashes.
  if (html.includes("—")) fail(id, "em dash in the copy");

  // Every link leaves for somewhere real, since a mail client has no base URL.
  for (const href of html.match(/href="([^"]+)"/g) ?? []) {
    const url = href.slice(6, -1);
    if (!/^https:\/\//.test(url)) fail(id, `relative or non-https link ${url}`);
  }

  // It says why it arrived. That is what makes it a service message, and it is
  // why none of these carries an unsubscribe link.
  if (!html.includes("คุณได้รับอีเมลนี้เพราะ") && id !== "coach message") {
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
console.log(
  `email OK: ${MAILS.length} templates, one frame, ${Object.keys(C).length} palette roles ` +
    `(${Object.keys(C).length - OWN_TO_EMAIL.size} of them design tokens), Thai only.`,
);
