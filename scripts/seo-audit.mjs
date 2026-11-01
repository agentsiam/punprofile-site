/**
 * The findability audit, and the test of done for any change to it. 01/11/2026.
 *
 * Fetches every URL in the sitemap, renders it in a real browser, and fails on
 * anything a search engine or an answer engine would read wrong:
 *
 * - status 200, not noindex, canonical naming itself, `hreflang` th, en and
 *   x-default, `<html lang>` matching the tree
 * - exactly one visible `h1`, counted after hydration (a raw-HTML count reads
 *   React's Suspense fallback as a second heading)
 * - title of 60 or fewer and description of 160 or fewer, counted as a reader
 *   sees them (Thai vowel and tone marks take no width), neither duplicated
 *   within one language tree
 * - an `og:image`, alt on every image (an empty alt is listed for review, and
 *   must carry a comment in the code saying why it is decorative)
 * - no placeholder text
 * - the organisation node, with name, url, sameAs, and a phone or the email the
 *   site publishes instead (public contact is LINE and email only)
 * - every `FAQPage` question and answer present in the page's own text
 * - a lead link in the main content (the EU Fit Check, or /contact for paid
 *   work), except on the lead form's own page and on /privacy
 * - `/llms.txt` serving, and every site link in it resolving to 200
 *
 * Run it against a local build, a Vercel preview, or production:
 *
 *   node scripts/seo-audit.mjs http://localhost:3100
 *   node scripts/seo-audit.mjs https://<preview>.vercel.app
 *   node scripts/seo-audit.mjs https://punprofile.app
 *
 * The second argument is the origin the sitemap and canonicals should name,
 * default `https://punprofile.app`. Needs Playwright with Chromium, which is not
 * a dependency of the app: `npm i --no-save playwright && npx playwright install
 * chromium`, or point PLAYWRIGHT_PATH at an installed copy. Exit code 1 on any
 * failure.
 */
const pw = await import(process.env.PLAYWRIGHT_PATH ?? "playwright").catch(() => {
  console.error("Playwright not found. npm i --no-save playwright && npx playwright install chromium");
  process.exit(2);
});
const { chromium } = pw.default ?? pw;

const BASE = (process.argv[2] || "http://localhost:3100").replace(/\/$/, "");
const ORIGIN = (process.argv[3] || "https://punprofile.app").replace(/\/$/, "");
// Path of the one lead form, Thai tree. Its own page is exempt from the link check.
const LEAD_FORM = process.env.LEAD_FORM ?? "/efc-assessment";
// Pages with no lead link by decision: /privacy is a legal notice (Paul, 2a,
// 01/11/2026). Paid work starts on /contact by LINE or email, so /contact
// counts as a lead link alongside the EU Fit Check.
const EXEMPT = (process.env.LEAD_EXEMPT ?? "/privacy").split(",");
const toLocal = (u) => u.replace(ORIGIN, BASE);

const sm = await (await fetch(BASE + "/sitemap.xml")).text();
const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const browser = await chromium.launch();
const ctx = await browser.newContext({ locale: "th-TH" });
const results = [];
const titles = new Map();
const descs = new Map();

for (const url of urls) {
  const page = await ctx.newPage();
  const fails = [];
  const notes = [];
  const res = await page.goto(toLocal(url), { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const status = res.status();
  if (status !== 200) fails.push(`status ${status}`);
  const xr = res.headers()["x-robots-tag"];
  if (xr && /noindex/i.test(xr)) fails.push(`X-Robots-Tag ${xr}`);

  const d = await page.evaluate(() => {
    const m = (sel, attr = "content") => document.querySelector(sel)?.getAttribute(attr) ?? null;
    const visible = (el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none";
    };
    const imgs = [...document.querySelectorAll("img")].map((i) => ({
      src: i.getAttribute("src"),
      alt: i.getAttribute("alt"),
      ariaHidden: i.closest("[aria-hidden=true]") != null,
    }));
    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => {
      try { return JSON.parse(s.textContent); } catch { return { __bad: s.textContent.slice(0, 80) }; }
    });
    const links = [...document.querySelectorAll("main a[href]")].map((a) => a.getAttribute("href"));
    return {
      title: document.title,
      desc: m('meta[name="description"]'),
      robots: m('meta[name="robots"]'),
      canonical: m('link[rel="canonical"]', "href"),
      hreflang: [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map((l) => [l.getAttribute("hreflang"), l.href]),
      ogImage: m('meta[property="og:image"]'),
      h1: [...document.querySelectorAll("h1")].filter(visible).map((h) => h.innerText.trim()),
      h1All: document.querySelectorAll("h1").length,
      imgs,
      ld,
      lang: document.documentElement.lang,
      text: document.body.innerText,
      // Collapsed <details> answers are in the page but not in innerText.
      allText: document.body.textContent,
      links,
    };
  });

  // Step 3: technical baseline
  if (d.robots && /noindex/i.test(d.robots)) fails.push(`meta robots ${d.robots}`);
  const canon = d.canonical ? new URL(d.canonical, ORIGIN).href.replace(/\/$/, "") : null;
  if (canon !== url.replace(/\/$/, "")) fails.push(`canonical ${d.canonical} != ${url}`);
  if (d.h1.length !== 1) fails.push(`${d.h1.length} visible h1 (${d.h1All} in DOM): ${JSON.stringify(d.h1)}`);
  // Characters as a reader sees them: Thai vowel and tone marks are separate
  // code points but take no width, so count grapheme clusters.
  const seg = new Intl.Segmenter("th", { granularity: "grapheme" });
  const glen = (x) => [...seg.segment(x || "")].length;
  const tl = glen(d.title);
  const dl = glen(d.desc);
  if (!d.title) fails.push("no title");
  else if (tl > 60) fails.push(`title ${tl} chars: ${d.title}`);
  if (!d.desc) fails.push("no description");
  else if (dl > 160) fails.push(`description ${dl} chars`);
  titles.set(d.title, [...(titles.get(d.title) || []), url]);
  descs.set(d.desc, [...(descs.get(d.desc) || []), url]);
  if (!d.ogImage) fails.push("no og:image");
  const noAlt = d.imgs.filter((i) => i.alt === null);
  if (noAlt.length) fails.push(`img without alt: ${noAlt.map((i) => i.src).join(", ")}`);
  const emptyAlt = d.imgs.filter((i) => i.alt === "");
  if (emptyAlt.length) notes.push(`decorative (alt=""): ${emptyAlt.map((i) => i.src).join(", ")}`);
  const ph = d.text.match(/lorem ipsum|\bTODO\b|\bTBD\b|\bFIXME\b|placeholder|\{\{|\[\s*(?:name|ชื่อ)\s*\]/i);
  if (ph) fails.push(`placeholder text: "${ph[0]}"`);

  // Step 4: organisation schema with name, phone, url, sameAs
  const nodes = d.ld.flatMap((x) => (x["@graph"] ? x["@graph"] : [x]));
  const bad = nodes.filter((n) => n.__bad);
  if (bad.length) fails.push("unparseable JSON-LD");
  const org = nodes.find((n) => ["Organization", "ProfessionalService", "LocalBusiness"].includes(n["@type"]));
  if (!org) fails.push("no Organization schema");
  else {
    for (const k of ["name", "url", "sameAs"]) if (!org[k] || (Array.isArray(org[k]) && !org[k].length)) fails.push(`org schema missing ${k}`);
    // Phone, or the channel the business publishes instead. PunProfile's public
    // contact is LINE and email only, so email plus a ContactPoint satisfies it.
    if (!org.telephone && !org.email) fails.push("org schema has neither telephone nor email");
  }
  // FAQPage must match visible text word for word
  for (const f of nodes.filter((n) => n["@type"] === "FAQPage")) {
    for (const q of f.mainEntity || []) {
      const norm = (s) => s.replace(/\s+/g, " ").trim();
      const T = norm(d.allText);
      if (!T.includes(norm(q.name))) fails.push(`FAQ question not visible: ${q.name.slice(0, 50)}`);
      if (!T.includes(norm(q.acceptedAnswer.text).slice(0, 120))) fails.push(`FAQ answer not visible: ${q.name.slice(0, 50)}`);
    }
  }
  notes.push(`schema: ${nodes.map((n) => n["@type"]).join(", ")}`);

  // Step 7: hreflang
  const hl = Object.fromEntries(d.hreflang);
  for (const k of ["th", "en", "x-default"]) if (!hl[k]) fails.push(`hreflang ${k} missing`);
  const wantLang = new URL(url).pathname.startsWith("/en") ? "en" : "th";
  if (d.lang !== wantLang) fails.push(`html lang ${d.lang}, expected ${wantLang}`);

  // Step 6: conversion. Reply-time claims and where the page sends people.
  const rt = d.text.match(/(within|ภายใน)\s*\d+\s*(hours?|ชั่วโมง|days?|วัน|นาที|minutes?)/i);
  if (rt) notes.push(`reply-time claim: "${rt[0]}"`);
  const ctas = [...new Set(d.links.filter((h) => /contact|efc-assessment|line\.me|mailto/.test(h || "")))];
  notes.push(`lead links in main: ${ctas.join(" ") || "NONE"}`);
  // The lead form's own page is the destination, not a page that needs a link to it.
  const isForm = LEAD_FORM && new URL(url).pathname.replace(/^\/en/, "") === LEAD_FORM;
  const isExempt = EXEMPT.includes(new URL(url).pathname.replace(/^\/en(?=\/|$)/, "") || "/");
  if (!ctas.length && !isForm && !isExempt) fails.push("no lead link in main content");

  results.push({ url, status, title: d.title, tl, dl, fails, notes });
  await page.close();
}

// Duplicates count within one language tree. A Thai page and its English pair
// may share a product name as their title; hreflang already tells a search
// engine they are one page in two languages.
const tree = (u) => (new URL(u).pathname.startsWith("/en") ? "en" : "th");
for (const m of [titles, descs]) for (const [k, u] of [...m]) {
  m.delete(k);
  for (const l of ["th", "en"]) { const x = u.filter((y) => tree(y) === l); if (x.length) m.set(`${l}\u0000${k}`, x); }
}
for (const [t, u] of titles) if (u.length > 1) results.filter((r) => u.includes(r.url)).forEach((r) => r.fails.push(`duplicate title with ${u.filter((x) => x !== r.url).join(", ")}`));
for (const [t, u] of descs) if (!t.endsWith("\u0000null") && u.length > 1) results.filter((r) => u.includes(r.url)).forEach((r) => r.fails.push(`duplicate description with ${u.filter((x) => x !== r.url).join(", ")}`));

// Step 4: llms.txt exists and every link in it resolves
const llmsRes = await fetch(BASE + "/llms.txt");
const llms = await llmsRes.text();
const llmsFails = [];
if (llmsRes.status !== 200) llmsFails.push(`llms.txt status ${llmsRes.status}`);
for (const [, href] of llms.matchAll(/\]\((https?:[^)]+)\)/g)) {
  if (!href.startsWith(ORIGIN)) continue;
  const r = await fetch(toLocal(href), { redirect: "manual" });
  if (r.status !== 200) llmsFails.push(`llms.txt link ${href} -> ${r.status}`);
}

await browser.close();

const failing = results.filter((r) => r.fails.length);
console.log(`URLs: ${results.length}, failing: ${failing.length}, llms.txt issues: ${llmsFails.length}`);
for (const r of results) {
  console.log(`\n${r.fails.length ? "FAIL" : "PASS"} ${r.url}  [title ${r.tl}, desc ${r.dl}]`);
  r.fails.forEach((f) => console.log("  x " + f));
  r.notes.forEach((n) => console.log("  . " + n));
}
llmsFails.forEach((f) => console.log("x " + f));
process.exit(failing.length || llmsFails.length ? 1 : 0);
