/**
 * **Thai wording passed by Paul, 15/08/2026.** Fifty-one strings rewritten in
 * his own words during the review of all shipped Thai, forty-six applied
 * directly. Five navigation items are held rather than applied: his edit put
 * English in the Thai column for `nav.menu`, `nav.menuClose`,
 * `nav.faq` and `nav.contact`, and one of those, `บริการของเรา`, is a fixed
 * termbase term. Whether Thai navigation should be in English is a decision
 * and not a typo, so it waits for one.
 *
 * Every candidate-facing string in the app, in both languages.
 *
 * Same shape as `questions.ts`: `{ en, th }` side by side rather than two
 * per-locale dictionaries, so a reviewer sees the source and the translation
 * together and cannot approve one without the other.
 *
 * **An empty `th` means "not yet supplied", not "same in both".** It falls back
 * to English at render, which is what lets Thai arrive key by key instead of in
 * one pass. `scripts/verify-copy.ts` counts and lists the empties, so what is
 * left to translate is a command rather than a hunt.
 *
 * Do not add admin, login or coach-report strings here. Those surfaces are
 * English on purpose; only the founder reads them.
 *
 * Language rules, wording, provenance, and structural-calque verdicts live in
 * `LANGUAGE-SYSTEM.md`. This file is generated from that canonical source by
 * `npm run language:generate`; edit the Markdown, never the generated copy.
 *
 * ---------------------------------------------------------------------------
 * EVERY STRING IN THIS FILE HAS NOW BEEN READ BACK, 17/08 AND 23/08/2026
 * ---------------------------------------------------------------------------
 *
 * There are no `TH-UNREVIEWED` markers left here. Paul worked through
 * `thai-review-queue.md` in two passes on 17/08/2026 and closed all twenty-seven,
 * then closed the eight depth-chart axis labels the same way on 23/08/2026, six
 * rewritten and two approved as drafted. Their block carries the detail. The two
 * menu keys added on 06/09/2026 were closed in the same way that day, in a pass
 * that emptied the queue across every module for the first time.
 *
 * `services.cta.heading` was rewritten and read back the same day; its own note
 * says why it stopped promising contact.
 *
 * Twelve he rewrote, and each of those carries its own note saying what changed
 * and why. **The remaining sixteen he read and left exactly as they were**, which
 * is approval rather than a skip: the queue file came back byte-identical to what
 * was generated, and he said so. Recorded here once rather than as sixteen copies
 * of the same sentence, which is this file's own one-fact-one-place rule.
 *
 * The strings involved were the English switch panel's two buttons, the chart
 * card heading, the not-measured legend entry, two readiness bars and their
 * footnote, the timing sentence, the pipeline footnote, six PDF report headings
 * and two coverage bands.
 *
 * `stats.readiness.foot` is among them and is the one to be careful with. Its
 * wording survived a proposed replacement on the same day: it says the shares
 * come from the people who answered each question, and `convex/stats.ts` computes
 * them exactly that way. Anything that widens it to "everyone who took EU Fit
 * Check" is false twice over, because the denominators differ per bar and the
 * pool includes a hundred imported survey leads who never took it.
 *
 * A new string starts as `draft` with a pending verdict in the canonical file.
 * `npm run review:language` turns those records into Paul's one review queue.
 */

export interface Copy {
  en: string;
  /** Empty means "not yet supplied" and falls back to `en`. */
  th: string;
}

/**
 * `screen` is carried through to the worksheet so the founder knows where a
 * string appears without reading the code.
 */
export interface CopyEntry extends Copy {
  screen: string;
}

export const COPY = {
  // ------------------------------------------------------------------ shell
  "nav.brand": {
    screen: "Header, every screen",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2LmJyYW5k:EN%%,
    // The wordmark is a fixed asset and never translated or transliterated.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2LmJyYW5k:TH%%,
  },
  // ------------------------------------------------------------- site menu
  // The burger's destinations. `nav.brand` is not among them: the wordmark is
  // centred and inert, so nothing here is a second way to say "home" except
  // the one entry that says it.
  "nav.menu": {
    screen: "Header, the burger button's accessible name",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2Lm1lbnU:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2Lm1lbnU:TH%%,
  },
  "nav.menuClose": {
    screen: "Header, the open menu's close button",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2Lm1lbnVDbG9zZQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2Lm1lbnVDbG9zZQ:TH%%,
  },
  "nav.assess": {
    screen: "Site menu, the one action in the list",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2LmFzc2Vzcw:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2LmFzc2Vzcw:TH%%,
  },
  "nav.coaching": {
    screen: "Site menu",
    // Not "About". The page sells the coaching and introduces Paul at the end,
    // so the label names what the reader gets rather than who wrote it.
    //
    // Identical in both languages, on Paul's call. "Coaching 1:1" is already
    // how this is said in Thai professional contexts, and โค้ชชิ่งตัวต่อตัว is
    // the longest item in a menu whose other entries are two words.
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2LmNvYWNoaW5n:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2LmNvYWNoaW5n:TH%%,
  },
  "nav.blog": {
    screen: "Site menu",
    // English in both columns, on Paul's call 16/08/2026, joining the five nav
    // items decided the same way on 15/08/2026. It was drafted as บทความ, which
    // is correct Thai and was the wrong answer: it would have made this the one
    // item in the menu that translates, and a menu that is English except for
    // one word reads as an oversight rather than as a choice.
    //
    // `nav-blog` in `termbase.yml` is what records that, and it is not optional
    // bookkeeping. Without the entry, `lint-thai.ts` fails this string under
    // LR-01, and it is right to: an English word in the Thai column is a decided
    // passthrough or an untranslated key, and the termbase is the only thing
    // that can tell those apart.
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2LmJsb2c:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2LmJsb2c:TH%%,
  },
  /*
   * Added 23/08/2026. THAI, not the English passthrough every other entry uses.
   *
   * Paul's call on the review sheet, and it is a deliberate departure from the
   * rule recorded on `nav.blog` below: the menu has been English in both columns
   * since 15 and 16/08/2026, on the reasoning that a menu which is English
   * except for one word reads as an oversight rather than a choice.
   *
   * With these two in Thai the menu now reads Menu, Our Services, Coaching 1:1,
   * Blog, FAQ, Contact, แพ็กเกจและราคา. That is the same objection pointing the
   * other way, and it is flagged for him rather than resolved here: either the
   * whole menu goes Thai or these go back to English.
   */
  "nav.pricing": {
    screen: "Site menu",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2LnByaWNpbmc:EN%%,
    // Paul's wording, 23/08/2026.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2LnByaWNpbmc:TH%%,
  },
  /**
   * The Products group label. Not yet in `NAV`: the group needs the submenu the
   * top bar introduces, and the top bar is a separate pass.
   *
   * Note it is `บริการของเรา`, which is the Thai reasoning behind the English
   * label on `/services`, the page that is retiring into `/coaching`. Worth a
   * second look before the group ships.
   */
  "nav.products": {
    screen: "Site menu, the Products group",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2LnByb2R1Y3Rz:EN%%,
    // Paul's wording, 23/08/2026.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2LnByb2R1Y3Rz:TH%%,
  },
  /*
   * The four product names, added 23/08/2026 with the product pages.
   *
   * English in both columns, which is the menu's own rule and here it is also
   * simply what they are called: these are product names, and LR-01 passes a
   * product name through rather than translating it. `nav.assess` above already
   * does the same for EU Fit Check.
   */
  "nav.cvCheck": {
    screen: "Site menu, the Products group",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2LmN2Q2hlY2s:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2LmN2Q2hlY2s:TH%%,
  },
  "nav.fitReport": {
    screen: "Site menu, the Products group",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2LmZpdFJlcG9ydA:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2LmZpdFJlcG9ydA:TH%%,
  },
  "nav.matchedJobs": {
    screen: "Site menu, the Products group",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2Lm1hdGNoZWRKb2Jz:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2Lm1hdGNoZWRKb2Jz:TH%%,
  },
  "nav.guidedJobHunt": {
    screen: "Site menu, the Products group",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2Lmd1aWRlZEpvYkh1bnQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2Lmd1aWRlZEpvYkh1bnQ:TH%%,
  },
  /*
   * Two entries added 06/09/2026 with `/products` and `/services`.
   *
   * **`nav.allProducts` is an overview row, not a product**, and it sits first
   * in the group for that reason: a menu of five names with no shape was the
   * gap the catalogue page was built to close, so the row that leads to the
   * shape belongs above the names rather than under them.
   *
   * **`nav.services` and `nav.coaching` are not the same destination and the
   * labels have to say so.** `/coaching` is the pitch, with the hook, the proof
   * and the founder section on it; `/services` is what the work actually is.
   * "Coaching 1:1" names the relationship and "Our Services" names the
   * catalogue, which is the distinction a reader is choosing between. The two
   * rows sit next to each other at the foot of the group so that reading is
   * available rather than implied.
   *
   * **`nav.services` is the key and the label is English, Paul's call on
   * 06/09/2026.** The key carries a binding: `BINDINGS` in `verify-copy.ts`
   * maps it to the termbase term `our-services`, fixed at "Our Services" since
   * 15/08/2026 on the rule that site navigation is English. The key had no
   * string behind it for the fifteen days `/services` did not exist, so the
   * binding sat dormant, and the first draft of this entry stepped around it
   * under a different key. Paul kept the term instead, which is the answer that
   * leaves one rule about navigation rather than two.
   *
   * **What it costs, recorded because it is visible on the page.** The group
   * heading directly above this row is `nav.products`, which Paul rewrote to
   * `บริการของเรา` on 23/08/2026, and `our-services`' own `why` notes it was
   * `บริการของเรา` until the English rule replaced it. So the menu now reads
   * `บริการของเรา` as the heading and "Our Services" as a row inside it: the
   * same two words, once in each language, one above the other. If that reads
   * wrong on the page, the fix is the term rather than this key, and it is one
   * edit in `termbase.yml` followed by `npm run termbase`.
   */
  "nav.allProducts": {
    screen: "Site menu, the Products group",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2LmFsbFByb2R1Y3Rz:EN%%,
    // Read back 06/09/2026.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2LmFsbFByb2R1Y3Rz:TH%%,
  },
  "nav.services": {
    screen: "Site menu, the Products group",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2LnNlcnZpY2Vz:EN%%,
    /*
     * English in the Thai column, which is what `our-services` fixes and what
     * `nav.faq`, `nav.contact` and `nav.menu` already do. LR-01's passthrough
     * check allows an identical pair only where a termbase entry says so, and
     * this is one of the five it says it about.
     */
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2LnNlcnZpY2Vz:TH%%,
  },
  "nav.faq": {
    screen: "Site menu",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2LmZhcQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2LmZhcQ:TH%%,
  },
  "nav.contact": {
    screen: "Site menu",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2LmNvbnRhY3Q:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2LmNvbnRhY3Q:TH%%,
  },
  /*
   * The menu's promotional card, at the foot of the drawer. Added 16/08/2026.
   *
   * Only the headline lives here. The card's action reuses the assessment's own
   * label from the table in `cta.ts`, for the same reason `landing.cta` does not
   * exist: a second definition of the same button is a second wording of it.
   *
   * The Thai is built from phrasing already in the approved corpus rather than
   * translated from the English. "ไม่รู้จะเริ่มตรงไหน" is the daily-jobs drafts'
   * own construction, so the card sounds like the group's posts rather than like
   * a website.
   */
  "menu.promo": {
    screen: "Site menu, the card at the foot of the drawer",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubWVudS5wcm9tbw:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubWVudS5wcm9tbw:TH%%,
  },

  "nav.language": {
    screen: "Header, the TH/EN switch",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2Lmxhbmd1YWdl:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubmF2Lmxhbmd1YWdl:TH%%,
  },
  "footer.brand": {
    screen: "Footer, every screen",
    // Not translated. The brand name, the year and a rights line read the same
    // to both audiences, and a Thai transliteration of a legal formula reads
    // as a mistake rather than as a courtesy.
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZm9vdGVyLmJyYW5k:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZm9vdGVyLmJyYW5k:TH%%,
  },

  // ---------------------------------------------------------------- landing
  /*
   * Rewritten 17/08/2026, when the home page stopped being an EU Fit Check
   * pitch. All three of the old strings were about the assessment, which was
   * right while it was the only thing the app did and wrong from 04/08/2026,
   * when `AGENTS.md` named the app as the product and the assessment as one
   * feature of it. Paul made the same correction to the share card on
   * 16/08/2026; the page the card points at had not caught up.
   *
   * These four stay here rather than moving to `home.ts` with the rest of the
   * page, and the split is not arbitrary. `verify-copy.ts` runs `lint-thai`
   * over this file and not over the per-page content modules, and the headline
   * and subhead are also the site's default `<title>` and meta description in
   * `(th)/layout.tsx`. The strings carrying the most weight stay where the lint
   * can see them.
   *
   * Reasoning for the page itself is `home-page.md` in the coaching repo's
   * `work-projects/eu-fit-check/`.
   */
  "landing.eyebrow": {
    screen: "Landing, above the headline",
    // Names the business, not the assessment. Same phrasing as the footer's
    // Coaching column heading, which is Paul's.
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZGluZy5leWVicm93:EN%%,
    // **Paul's wording, 17/08/2026**, from the review sheet. He took
    // `แคเรียร์` off the front: `โค้ชชิ่งด้านอาชีพ` reads as the category, and
    // `แคเรียร์โค้ชชิ่ง` is the service name, which belongs on the card in
    // section 3 rather than in the line that says who this site is for.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZGluZy5leWVicm93:TH%%,
  },
  "landing.headline": {
    screen: "Landing, and the site's default page title",
    // `01_Project_Foundation.md` states the mission as helping Thai
    // professionals go from "I want to work in Europe" to "I have a signed
    // contract". This is that sentence turned to face the reader.
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZGluZy5oZWFkbGluZQ:EN%%,
    // **Paul's wording, 17/08/2026.** Two changes, and both are the same move:
    // `จากวันที่คิดว่า` rather than a bare `จาก`, and `สู่วันที่` rather than
    // `ถึงวันที่`, so the sentence runs day to day rather than phrase to day.
    // The reader is placed at a moment they can remember having, which is what
    // the quoted thought was always for.
    //
    // He also put `ที่ยุโรป` back inside the quotation marks, where my revision
    // had corrected it to `ในยุโรป` on the evidence of his own prose. That was
    // the wrong correction to make: the quote is someone thinking out loud, and
    // it should sound like speech rather than like the page around it.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZGluZy5oZWFkbGluZQ:TH%%,
  },
  "landing.subhead": {
    screen: "Landing, and the site's default meta description",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZGluZy5zdWJoZWFk:EN%%,
    // First mention of the brand in running Thai, so it takes the gloss:
    // LR-01, ปั้นโปรไฟล์ (PunProfile) first, PunProfile alone afterwards.
    //
    // **Paul's wording, 17/08/2026.** `ทำงานร่วมกับ` rather than `ทำงานกับ`,
    // which is the difference between working with someone and working
    // alongside them. `ตลาดงานยุโรป` rather than `ยุโรป`: the decision a reader
    // has made is about a job market, not about a continent. And
    // `การสมัครงานทีละตำแหน่ง` rather than `การลงมือสมัครแต่ละตำแหน่ง`, which
    // says the same thing in three fewer syllables.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZGluZy5zdWJoZWFk:TH%%,
  },
  // No `landing.cta` here. The landing button's label comes from the table in
  // `cta.ts`, which owns every action on every page. A second definition of the
  // same button is a second wording of it, which is the failure this file's
  // one-string-one-place rule exists to prevent.
  "landing.reassurance": {
    screen: "Landing, under the button",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZGluZy5yZWFzc3VyYW5jZQ:EN%%,
    // Revised by Paul 17/08/2026, from his own 15/08 wording. Three clauses
    // instead of one sentence with a trailing `โดย`, which is the shape the rest
    // of this hero now has.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZGluZy5yZWFzc3VyYW5jZQ:TH%%,
  },

  // ------------------------------------------------------------- assessment
  "assess.starting": {
    screen: "Assessment, while the session is created",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuYXNzZXNzLnN0YXJ0aW5n:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuYXNzZXNzLnN0YXJ0aW5n:TH%%,
  },
  "assess.busy": {
    screen: "Assessment, when the session could not be created. Rate limit or network",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuYXNzZXNzLmJ1c3k:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuYXNzZXNzLmJ1c3k:TH%%,
  },
  "assess.retry": {
    screen: "Assessment, the retry button beside that message",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuYXNzZXNzLnJldHJ5:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuYXNzZXNzLnJldHJ5:TH%%,
  },
  "assess.back": {
    screen: "Assessment, the link back to the previous question",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuYXNzZXNzLmJhY2s:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuYXNzZXNzLmJhY2s:TH%%,
  },
  "assess.continue": {
    screen: "Assessment, the button that moves to the next question",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuYXNzZXNzLmNvbnRpbnVl:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuYXNzZXNzLmNvbnRpbnVl:TH%%,
  },
  "assess.progress": {
    screen: "Assessment, the step counter. {step} and {total} are substituted",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuYXNzZXNzLnByb2dyZXNz:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuYXNzZXNzLnByb2dyZXNz:TH%%,
  },

  // ------------------------------------------------------------ teaser chart
  // ---- Stage 2, question one: the per-language grid (TASK-072, 14/08/2026).
  // Placed after the first read on purpose: Stage 1 had no room left inside
  // the 90-second budget, and this is accuracy a candidate volunteers rather
  // than something the first read depends on.
  "lang.heading": {
    screen: "Stage 2, language grid",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5oZWFkaW5n:EN%%,
    // Read back 25/08/2026. `แล้ว` after the English clause and `ได้ไหม`
    // rather than `ได้อีกไหม`: the old one asked whether they could speak one
    // MORE, which reads as a follow-up to a question nobody asked.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5oZWFkaW5n:TH%%,
  },
  "lang.body": {
    screen: "Stage 2, language grid",
    /*
     * Both halves rewritten 25/08/2026, Paul, and the English moved with the
     * Thai rather than being left behind.
     *
     * It said the answer CHANGES which countries are open, which overstates
     * what one question does: it identifies, it does not decide. The old Thai
     * also claimed an effect on positions as well as countries, and this grid
     * feeds Country Reach only.
     */
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5ib2R5:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5ib2R5:TH%%,
  },
  "lang.levelLabel": {
    screen: "Stage 2, language grid",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5sZXZlbExhYmVs:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5sZXZlbExhYmVs:TH%%,
  },
  "lang.scale": {
    screen: "Stage 2, language grid",
    /*
     * **C2 is not native-level.** Paul, 25/08/2026, and it is a factual
     * correction rather than a wording preference: CEFR defines C2 as highly
     * proficient, and a native speaker is not a CEFR level at all. Telling a
     * candidate that C2 means native-like invites them to under-tick, which
     * this grid scores.
     */
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5zY2FsZQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5zY2FsZQ:TH%%,
  },
  "lang.submit": {
    screen: "Stage 2, language grid",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5zdWJtaXQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5zdWJtaXQ:TH%%,
  },
  /*
   * The twelve language names, moved here 25/08/2026 on Paul's note.
   *
   * They were a `LANGUAGE_TH` map inside `LanguageGrid.tsx`, on the reasoning
   * that a language name is a proper noun and proper nouns are not copy. His
   * correction: they are localised UI text whoever they name, and keeping them
   * in a component split the translation workflow across two files, so the
   * worksheet and the review exporters could not see half the screen.
   *
   * They are candidate-facing strings like any other now, and they go through
   * the worksheet like any other.
   */
  "lang.name.german": { screen: "Stage 2, language grid", en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5uYW1lLmdlcm1hbg:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5uYW1lLmdlcm1hbg:TH%% },
  "lang.name.french": { screen: "Stage 2, language grid", en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5uYW1lLmZyZW5jaA:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5uYW1lLmZyZW5jaA:TH%% },
  "lang.name.spanish": { screen: "Stage 2, language grid", en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5uYW1lLnNwYW5pc2g:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5uYW1lLnNwYW5pc2g:TH%% },
  "lang.name.italian": { screen: "Stage 2, language grid", en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5uYW1lLml0YWxpYW4:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5uYW1lLml0YWxpYW4:TH%% },
  "lang.name.dutch": { screen: "Stage 2, language grid", en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5uYW1lLmR1dGNo:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5uYW1lLmR1dGNo:TH%% },
  "lang.name.portuguese": { screen: "Stage 2, language grid", en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5uYW1lLnBvcnR1Z3Vlc2U:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5uYW1lLnBvcnR1Z3Vlc2U:TH%% },
  "lang.name.polish": { screen: "Stage 2, language grid", en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5uYW1lLnBvbGlzaA:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5uYW1lLnBvbGlzaA:TH%% },
  "lang.name.swedish": { screen: "Stage 2, language grid", en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5uYW1lLnN3ZWRpc2g:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5uYW1lLnN3ZWRpc2g:TH%% },
  "lang.name.danish": { screen: "Stage 2, language grid", en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5uYW1lLmRhbmlzaA:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5uYW1lLmRhbmlzaA:TH%% },
  "lang.name.norwegian": { screen: "Stage 2, language grid", en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5uYW1lLm5vcndlZ2lhbg:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5uYW1lLm5vcndlZ2lhbg:TH%% },
  "lang.name.finnish": { screen: "Stage 2, language grid", en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5uYW1lLmZpbm5pc2g:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5uYW1lLmZpbm5pc2g:TH%% },
  "lang.name.czech": { screen: "Stage 2, language grid", en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5uYW1lLmN6ZWNo:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5uYW1lLmN6ZWNo:TH%% },

  "lang.skip": {
    screen: "Stage 2, language grid",
    /*
     * Rewritten 25/08/2026. "another" alone left the noun to the heading, which
     * is fine on screen and wrong as a button label read on its own by a screen
     * reader. The Thai also dropped `ยัง`, which framed not speaking one as a
     * state the candidate is still in rather than a plain answer.
     */
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5za2lw:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkubGFuZy5za2lw:TH%%,
  },

  "teaser.headline": {
    screen: "Teaser, after the last question",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkudGVhc2VyLmhlYWRsaW5l:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkudGVhc2VyLmhlYWRsaW5l:TH%%,
  },
  "teaser.selfReported": {
    screen: "Teaser, under the headline. FR-007 requires this to be unmissable",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkudGVhc2VyLnNlbGZSZXBvcnRlZA:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkudGVhc2VyLnNlbGZSZXBvcnRlZA:TH%%,
  },
  "teaser.nextStep": {
    screen: "First read, the closing card. What happens after this screen",
    /*
     * **Rewritten 17/08/2026, and the change is the flow rather than the
     * wording.** It said the team is dealing with a lot of enquiries and would
     * reach the candidate when their turn came round, which was Paul's own line
     * from 14/08/2026 and a deliberate downgrade of an earlier promise: naming
     * the queue meant a candidate who waited a week had been told a week was
     * normal rather than concluding they had not qualified.
     *
     * That was the right fix for a screen whose last word was a promise. It is
     * the wrong last word for a screen that has just shown someone their own
     * result, because it ends on our capacity instead of on their position, which
     * is the opposite of move 6 in `03_Content_System.md`.
     *
     * **The queue was still named, and on 20/08/2026 it stopped being.** That
     * paragraph read: the queue is true, it is the reason a reply may take time,
     * and deleting it would put back the silence the 14/08 line was written to
     * explain. Paul's own rewrite drops it. Kept here rather than deleted,
     * because the argument for naming the queue is the thing to weigh again if
     * candidates start reading the silence as rejection.
     *
     * What survives the rewrite is the mechanic: the last word is a condition
     * the reader can act on. `stats.timing` on this same screen reports the
     * share of this pool who want to be in Europe within three months, so the
     * reader has just been shown that they are not unusual in being in a hurry.
     *
     * The card it sits in gains a `Talk to me` button, which is why this string
     * no longer has to do the asking on its own.
     */
    // Paul's wording, 20/08/2026, read back and shipped as written apart from
    // หา → หาก, which was a typing slip. His line drops the queue sentence the
    // 17/08 rewrite kept: what replaces it is a condition rather than an
    // explanation, so the last word is the reader's move and not our capacity.
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkudGVhc2VyLm5leHRTdGVw:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkudGVhc2VyLm5leHRTdGVw:TH%%,
  },
  "teaser.revise": {
    screen: "Teaser, the link back to the last question",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkudGVhc2VyLnJldmlzZQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkudGVhc2VyLnJldmlzZQ:TH%%,
  },

  // -------------------------------------- the English switch prompt, 16/08/2026
  // Fires once, mid-flow, when a candidate reading in Thai says their English is
  // B1 or better. The flow is already in English by the time this renders, so
  // the Thai column here is only reached if the switch is ever changed back to
  // an offer. Keep it correct anyway; a string that is wrong in the branch
  // nobody takes is wrong on the day somebody takes it.
  "english.switch.title": {
    screen: "Assessment, the panel after the English question is answered B1 or above",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZW5nbGlzaC5zd2l0Y2gudGl0bGU:EN%%,
    // Paul's wording, 17/08/2026. `เลยดีกว่า` rather than `กันเลย`: the panel
    // is proposing something, and `ดีกว่า` is how a Thai speaker proposes it.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZW5nbGlzaC5zd2l0Y2gudGl0bGU:TH%%,
  },
  "english.switch.body": {
    screen: "Assessment, the English switch panel",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZW5nbGlzaC5zd2l0Y2guYm9keQ:EN%%,
    // Paul's wording, 17/08/2026, and he added a reason the panel did not
    // give: the switch is practice, not administration. It now says the same
    // thing `SERVICES[0].includes[4]` says about the coaching sessions, which
    // he wrote the same day.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZW5nbGlzaC5zd2l0Y2guYm9keQ:TH%%,
  },
  "english.switch.stay": {
    screen: "Assessment, the English switch panel, the primary button",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZW5nbGlzaC5zd2l0Y2guc3RheQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZW5nbGlzaC5zd2l0Y2guc3RheQ:TH%%,
  },
  "english.switch.revert": {
    screen: "Assessment, the English switch panel, the way back",
    // The English column carries the Thai too, because this is the one button
    // whose reader is by definition the person not reading the English around
    // it. An identical-in-both-columns passthrough would have said the same
    // thing more cleanly and needs a termbase entry to be allowed, which is
    // Paul's to decide rather than mine to add.
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZW5nbGlzaC5zd2l0Y2gucmV2ZXJ0:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZW5nbGlzaC5zd2l0Y2gucmV2ZXJ0:TH%%,
  },

  // ------------------------------------------------- the chart card, 16/08/2026
  // The radar used to sit on a bare surface with nothing naming it and nothing
  // stating the four numbers. A radar is a shape, not a reading: two axes an
  // eyeball apart can be 0.4 apart, and a screen reader gets nothing at all
  // from the polygon. The legend under it is the accessible form PRD § 7 asks
  // for and the thing a candidate can actually quote to someone.
  "teaser.chart.heading": {
    screen: "First read, the title of the card the chart sits in",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkudGVhc2VyLmNoYXJ0LmhlYWRpbmc:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkudGVhc2VyLmNoYXJ0LmhlYWRpbmc:TH%%,
  },
  "teaser.score.value": {
    screen: "First read, one dimension's score in the legend. {score} is one decimal, the scale is not",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkudGVhc2VyLnNjb3JlLnZhbHVl:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkudGVhc2VyLnNjb3JlLnZhbHVl:TH%%,
  },
  "teaser.score.none": {
    screen: "First read, the legend entry for a dimension the answers could not reach",
    // Never a zero and never a dash. A dash reads as a broken field; a zero is
    // a claim. This says the honest thing, which is that we did not measure it.
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkudGVhc2VyLnNjb3JlLm5vbmU:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkudGVhc2VyLnNjb3JlLm5vbmU:TH%%,
  },

  // --------------------------------------------- the readiness stack, 16/08/2026
  // Three shares that all point the same way, shown together because that is
  // the whole argument: what separates this group from a European shortlist is
  // presentation, not ability. One of them alone is an anecdote.
  "stats.readiness.label": {
    screen: "First read, the title of the readiness card",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMucmVhZGluZXNzLmxhYmVs:EN%%,
    // Paul's wording, 17/08/2026. `Hiring Manager` in Latin, and the English
    // follows it off `recruiter`: the person who reads a CV and decides is a
    // hiring manager, and a recruiter is often neither. LR-05's principle,
    // which is to reach for the loanword the audience already uses rather than
    // translate into a vaguer Thai noun. `ผู้จ้างงาน` was that vaguer noun.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMucmVhZGluZXNzLmxhYmVs:TH%%,
  },
  "stats.readiness.cv": {
    screen: "First read, readiness bar 1",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMucmVhZGluZXNzLmN2:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMucmVhZGluZXNzLmN2:TH%%,
  },
  "stats.readiness.portfolio": {
    screen: "First read, readiness bar 2",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMucmVhZGluZXNzLnBvcnRmb2xpbw:EN%%,
    // Paul's wording, 17/08/2026. `portfolio` rather than `ผลงาน`, matching
    // `item.portfolioEvidence` below, and the audience is dropped: on a bar in
    // a readiness stack, who would look at it is not the point.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMucmVhZGluZXNzLnBvcnRmb2xpbw:TH%%,
  },
  "stats.readiness.linkedin": {
    screen: "First read, readiness bar 3",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMucmVhZGluZXNzLmxpbmtlZGlu:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMucmVhZGluZXNzLmxpbmtlZGlu:TH%%,
  },
  "stats.readiness.foot": {
    screen: "First read, under the readiness bars",
    // Same rule as every other share in `stats.ts`: the denominator is the
    // people who answered that question, not everyone.
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMucmVhZGluZXNzLmZvb3Q:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMucmVhZGluZXNzLmZvb3Q:TH%%,
  },
  "stats.timing": {
    screen: "First read, the timing sentence. {waiting} and {soon} are percentages",
    // The two halves are only worth saying together. Separately they are
    // demographics; together they name the tension the product sits inside.
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMudGltaW5n:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMudGltaW5n:TH%%,
  },

  // ------------------------------------------- the job pipeline proof, 16/08/2026
  // The only figure on this screen that is about PunProfile doing work rather
  // than about the candidate or the crowd. Numbers come from a dated snapshot
  // of `job-log.json`, and the date is printed because a screening figure with
  // no window is a boast.
  "stats.market.label": {
    screen: "First read, the title of the job-pipeline card",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMubWFya2V0LmxhYmVs:EN%%,
    // Paul's wording, 17/08/2026. `มาแชร์ใน` rather than `ให้`, which read as
    // screened FOR this group as a service. They are screened and then shared,
    // and the group is where they are shared rather than the client.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMubWFya2V0LmxhYmVs:TH%%,
  },
  /*
   * The three figure labels, and they are shared.
   *
   * **Both the first read and the home page render the same three numbers out of
   * `market-snapshot.generated.ts`.** They were briefly defined twice, here and
   * as `MARKET_STATS` in `home.ts`, by two sessions on 17/08/2026 that split the
   * old one-sentence `stats.market.value` at the same time. `home.ts` now reads
   * these keys instead of carrying its own copies, so there is one definition
   * and it is the one the lint can see.
   *
   * **The Thai is Paul's**, from the home-page review of 17/08/2026, which
   * supersedes the draft wording the split inherited: `ประกาศงานที่อ่าน` became
   * `ประกาศงานที่ตรวจสอบแล้ว`, because the number counts what was screened and
   * reading is only how it was screened, and `ผ่านเกณฑ์สปอนเซอร์วีซ่า` became
   * `ตำแหน่งงานที่บริษัทสปอนเซอร์วีซ่า`, because a role does not sponsor anything
   * and a company does.
   *
   * `visa-sponsorship` in `termbase.yml`, decided the same day, is what keeps a
   * third rendering from appearing.
   */
  "stats.market.screened": {
    screen: "First read and the home page, the label under the count of adverts checked",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMubWFya2V0LnNjcmVlbmVk:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMubWFya2V0LnNjcmVlbmVk:TH%%,
  },
  "stats.market.published": {
    screen: "First read and the home page, the label under the count that cleared the sponsorship bar",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMubWFya2V0LnB1Ymxpc2hlZA:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMubWFya2V0LnB1Ymxpc2hlZA:TH%%,
  },
  "stats.market.employers": {
    // Not shown on the first read, which prints only the two counts and the
    // snapshot date. Defined here anyway because the home page shows all three
    // and the alternative is a third figure label in a fourth place.
    screen: "The home page, the label under the count of employers",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMubWFya2V0LmVtcGxveWVycw:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMubWFya2V0LmVtcGxveWVycw:TH%%,
  },
  "stats.market.foot": {
    screen: "First read, under the job-pipeline figures. {to} is the snapshot date",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMubWFya2V0LmZvb3Q:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMubWFya2V0LmZvb3Q:TH%%,
  },

  // ------------------------------------------------------- community stats
  // The three lines under the first read, TASK-083. Their job is to give a
  // candidate something to hold and something to repeat: the countries line is
  // the one that gets screenshotted, the language line is the one that gets
  // quoted, and the percentile is the only sentence on the screen about them
  // in relation to anyone else.
  //
  // Placeholders are substituted at render, never composed here. `{n}`, `{max}`
  // and `{dimension}` appear in both languages and Thai puts them in a
  // different place, which is exactly why the whole sentence is a copy entry
  // rather than three fragments joined in a component.
  "stats.heading": {
    screen: "First read, above the community stats",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMuaGVhZGluZw:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMuaGVhZGluZw:TH%%,
  },
  "stats.countries.label": {
    screen: "First read, the top-countries stat",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMuY291bnRyaWVzLmxhYmVs:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMuY291bnRyaWVzLmxhYmVs:TH%%,
  },
  "stats.countries.foot": {
    screen: "First read, under the top-countries list",
    // No sample size, on Paul's call 14/08/2026: the number of people who have
    // taken the check is PunProfile's own information. What survives is WHO
    // was counted, which is the part that stops a ranking being read as a
    // claim about Europe rather than about this group.
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMuY291bnRyaWVzLmZvb3Q:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMuY291bnRyaWVzLmZvb3Q:TH%%,
  },
  // The three `stats.languages.*` strings were removed on 16/08/2026 with the
  // card they belonged to. `verify-copy.ts` fails on a defined-but-unused key,
  // which is what forced the choice rather than letting them rot here. The
  // query still computes `mostLanguages`; if the figure ever earns a place back,
  // the wording is in this file's git history.
  "stats.percentile": {
    screen: "First read, the personal comparison. Completes the big percentage above it",
    // The one sentence on this screen that is about the candidate rather than
    // the pool, which is why it sits with the stats rather than in the
    // narrative: the narrative is selected from a bank and cannot say this.
    //
    // **Rewritten 16/08/2026 for the redesign, and it needs Paul's read.** The
    // figure is now set large on its own line, so the sentence completes it
    // instead of containing it. Printing the old string under a big "55%" would
    // have shown the same number twice in three words of each other. `{n}` is
    // gone from the text for that reason; `{dimension}` stays.
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMucGVyY2VudGlsZQ:EN%%,
    // **Paul's wording, 17/08/2026**, with one typo corrected on his
    // confirmation: he wrote `ผู้ทำรับการประเมิน`, which is `ผู้ทำ` and
    // `ผู้เข้ารับการประเมิน` merged. Held rather than shipped, because a merged
    // phrase on the screen every candidate reaches is not a thing to guess at.
    //
    // His change of substance is the denominator: `ทั้งหมด`, everyone assessed,
    // rather than `กลุ่มนี้`, which read as some subgroup the reader could not
    // identify. It is also true, which the sentence next to it is not:
    // `stats.readiness.foot` keeps its per-question denominator for that reason,
    // on his call the same day.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMucGVyY2VudGlsZQ:TH%%,
  },
  "stats.percentile.foot": {
    screen: "First read, under the percentile line",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMucGVyY2VudGlsZS5mb290:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RhdHMucGVyY2VudGlsZS5mb290:TH%%,
  },

  // ------------------------------------------------------------- coaching CTA
  //
  // The key is still `services.*` because the string keys are what the copy
  // worksheet round-trips on and renaming them breaks that trip for no gain.
  // The destination moved to `/coaching` on 23/08/2026 when `/services` retired.
  "services.cta.heading": {
    screen: "First read, the secondary CTA to /coaching",
    /*
     * **Rewritten 23/08/2026, Paul's call, and it is the same cut he made on
     * `/pricing` the same day.**
     *
     * It read "While you wait" / `ในระหว่างรอการติดต่อกลับจากเรา`, which told every
     * finisher, in the heading of a card on the result screen, that contact was
     * coming. His rule: outbound contact has not stopped, the public promise of
     * it has, because to a lead who is not ready that is a promise nobody
     * intends to keep.
     *
     * It was also stale twice over. The wait framing was written when
     * `teaser.nextStep` named a queue on this same screen, and his rewrite of
     * 20/08/2026 dropped the queue. So the card was the last thing on the page
     * still describing a wait that nothing else mentioned.
     *
     * **What replaces it hands the move back to the reader**, which is the
     * mechanic `teaser.nextStep` already uses on this screen: a condition they
     * can act on rather than a report on our capacity.
     */
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc2VydmljZXMuY3RhLmhlYWRpbmc:EN%%,
    // Paul's wording, 23/08/2026.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc2VydmljZXMuY3RhLmhlYWRpbmc:TH%%,
  },
  "services.cta.body": {
    screen: "First read, the secondary CTA to /coaching",
    // Pitched at the reading, not at the sale, and deliberately not a second
    // booking button on a screen that already has one. A page explaining what
    // the coaching actually is does more for a later call.
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc2VydmljZXMuY3RhLmJvZHk:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc2VydmljZXMuY3RhLmJvZHk:TH%%,
  },
  "services.cta.button": {
    screen: "First read, the secondary CTA to /coaching",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc2VydmljZXMuY3RhLmJ1dHRvbg:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc2VydmljZXMuY3RhLmJ1dHRvbg:TH%%,
  },

  // --------------------------------------------------------- chart dimensions
  // Candidate-facing labels only. `model.ts` keeps its own English copies for
  // the coach report, which is a different audience, not a second source of
  // truth for this one.
  "dimension.professionalCapability": {
    screen: "Spider chart axis",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZGltZW5zaW9uLnByb2Zlc3Npb25hbENhcGFiaWxpdHk:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZGltZW5zaW9uLnByb2Zlc3Npb25hbENhcGFiaWxpdHk:TH%%,
  },
  "dimension.employability": {
    screen: "Spider chart axis",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZGltZW5zaW9uLmVtcGxveWFiaWxpdHk:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZGltZW5zaW9uLmVtcGxveWFiaWxpdHk:TH%%,
  },
  "dimension.mobilityReadiness": {
    screen: "Spider chart axis",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZGltZW5zaW9uLm1vYmlsaXR5UmVhZGluZXNz:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZGltZW5zaW9uLm1vYmlsaXR5UmVhZGluZXNz:TH%%,
  },
  "dimension.europeanMarketFit": {
    screen: "Spider chart axis",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZGltZW5zaW9uLmV1cm9wZWFuTWFya2V0Rml0:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZGltZW5zaW9uLmV1cm9wZWFuTWFya2V0Rml0:TH%%,
  },

  // ------------------------------------------------------------ contact gate
  // FR-005. Full name, email, and at least one of LINE ID or phone.
  "gate.heading": {
    screen: "Contact step, the heading. Last step of the survey",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5oZWFkaW5n:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5oZWFkaW5n:TH%%,
  },
  "gate.body": {
    screen: "Contact step, under the heading. Says what happens next",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5ib2R5:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5ib2R5:TH%%,
  },
  "gate.firstName": {
    screen: "Contact step, first name field label",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5maXJzdE5hbWU:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5maXJzdE5hbWU:TH%%,
  },
  "gate.lastName": {
    screen: "Contact step, last name field label",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5sYXN0TmFtZQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5sYXN0TmFtZQ:TH%%,
  },
  "gate.email": {
    screen: "Contact gate, email field label",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5lbWFpbA:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5lbWFpbA:TH%%,
  },
  "gate.channelHint": {
    screen: "Contact gate, above the LINE and phone fields. Explains why one is required",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5jaGFubmVsSGludA:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5jaGFubmVsSGludA:TH%%,
  },
  "gate.lineId": {
    screen: "Contact gate, LINE ID field label",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5saW5lSWQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5saW5lSWQ:TH%%,
  },
  "gate.phone": {
    screen: "Contact gate, phone field label",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5waG9uZQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5waG9uZQ:TH%%,
  },
  "gate.submit": {
    screen: "Contact step, the submit button",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5zdWJtaXQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5zdWJtaXQ:TH%%,
  },
  "gate.working": {
    screen: "Contact gate, submit button while the write is in flight",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS53b3JraW5n:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS53b3JraW5n:TH%%,
  },

  // Errors. Thrown server-side as stable codes and resolved here, so a rule
  // enforced on the server can still speak the candidate's language.
  "gate.error.first_name_required": {
    screen: "Contact step, when the first name is empty",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5lcnJvci5maXJzdF9uYW1lX3JlcXVpcmVk:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5lcnJvci5maXJzdF9uYW1lX3JlcXVpcmVk:TH%%,
  },
  "gate.error.last_name_required": {
    screen: "Contact step, when the last name is empty",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5lcnJvci5sYXN0X25hbWVfcmVxdWlyZWQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5lcnJvci5sYXN0X25hbWVfcmVxdWlyZWQ:TH%%,
  },
  "gate.error.email_invalid": {
    screen: "Contact gate, when the email is missing or malformed",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5lcnJvci5lbWFpbF9pbnZhbGlk:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5lcnJvci5lbWFpbF9pbnZhbGlk:TH%%,
  },
  "gate.error.channel_required": {
    screen: "Contact gate, when neither LINE nor phone was given",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5lcnJvci5jaGFubmVsX3JlcXVpcmVk:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5lcnJvci5jaGFubmVsX3JlcXVpcmVk:TH%%,
  },
  "gate.error.consent_email": {
    screen: "Contact gate, when email consent is unticked",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5lcnJvci5jb25zZW50X2VtYWls:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5lcnJvci5jb25zZW50X2VtYWls:TH%%,
  },
  "gate.error.consent_phone": {
    screen: "Contact gate, when a phone was given without consent",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5lcnJvci5jb25zZW50X3Bob25l:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5lcnJvci5jb25zZW50X3Bob25l:TH%%,
  },
  "gate.error.consent_line": {
    screen: "Contact gate, when a LINE ID was given without consent",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5lcnJvci5jb25zZW50X2xpbmU:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5lcnJvci5jb25zZW50X2xpbmU:TH%%,
  },
  "gate.error.unknown": {
    screen: "Contact gate, any failure with no specific cause. Network, mostly",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5lcnJvci51bmtub3du:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuZ2F0ZS5lcnJvci51bmtub3du:TH%%,
  },

  // ------------------------------------------------------- full result screen
  "result.startWith": {
    screen: "Full result, fallback next step when no specific action matches. {area} substituted",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkucmVzdWx0LnN0YXJ0V2l0aA:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkucmVzdWx0LnN0YXJ0V2l0aA:TH%%,
  },
  "result.measured": {
    screen: "Full result, the coverage line. {count}, {total} and {more} are substituted",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkucmVzdWx0Lm1lYXN1cmVk:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkucmVzdWx0Lm1lYXN1cmVk:TH%%,
  },
  "result.caveat": {
    screen: "Full result, the persistent honesty line. FR-007 requires it to be unmissable",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkucmVzdWx0LmNhdmVhdA:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkucmVzdWx0LmNhdmVhdA:TH%%,
  },

  // The journey checklist. Statuses are computed; these are the step names.
  "step.unanswered": {
    screen: "Full result, on a step nothing has been answered for yet",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RlcC51bmFuc3dlcmVk:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RlcC51bmFuc3dlcmVk:TH%%,
  },
  "step.targetClarity": {
    screen: "Full result, journey checklist step",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RlcC50YXJnZXRDbGFyaXR5:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RlcC50YXJnZXRDbGFyaXR5:TH%%,
  },
  "step.cvStatus": {
    screen: "Full result, journey checklist step",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RlcC5jdlN0YXR1cw:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RlcC5jdlN0YXR1cw:TH%%,
  },
  "step.linkedinStatus": {
    screen: "Full result, journey checklist step",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RlcC5saW5rZWRpblN0YXR1cw:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RlcC5saW5rZWRpblN0YXR1cw:TH%%,
  },
  "step.visaReadiness": {
    screen: "Full result, journey checklist step",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RlcC52aXNhUmVhZGluZXNz:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RlcC52aXNhUmVhZGluZXNz:TH%%,
  },
  "step.languageReadiness": {
    screen: "Full result, journey checklist step",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RlcC5sYW5ndWFnZVJlYWRpbmVzcw:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RlcC5sYW5ndWFnZVJlYWRpbmVzcw:TH%%,
  },
  "step.portfolioEvidence": {
    screen: "Full result, journey checklist step",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RlcC5wb3J0Zm9saW9FdmlkZW5jZQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RlcC5wb3J0Zm9saW9FdmlkZW5jZQ:TH%%,
  },
  "step.applicationActivity": {
    screen: "Full result, journey checklist step",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RlcC5hcHBsaWNhdGlvbkFjdGl2aXR5:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuc3RlcC5hcHBsaWNhdGlvbkFjdGl2aXR5:TH%%,
  },

  // ---------------------------------------------- the candidate's PDF, 17/08/2026
  // The report the coach sends after the call. It is the same document as the
  // coach's own copy with the internals taken out, so most of what it says is
  // already keyed above: the honesty line, the coverage line, the step names,
  // the competency and dimension names. What is here is only what the printed
  // document adds — its section headings, its table headers, and its footing.
  //
  // These belong in this file and not beside the coach report, because they are
  // the one part of that document a candidate reads. The rule at the top of the
  // file still holds for everything else in it: coach-report strings are English
  // on purpose and stay out of here.
  "report.competency": {
    screen: "Candidate PDF, the score table's first column header",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkucmVwb3J0LmNvbXBldGVuY3k:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkucmVwb3J0LmNvbXBldGVuY3k:TH%%,
  },
  "report.score": {
    screen: "Candidate PDF, the score table's second column header",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkucmVwb3J0LnNjb3Jl:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkucmVwb3J0LnNjb3Jl:TH%%,
  },
  "report.unmeasured": {
    screen: "Candidate PDF, under a dimension's table. {count} is substituted",
    // Says what is missing and why, in the candidate's own terms. The coach's
    // copy names each blank item individually; this names the number, which is
    // the honest form of the same fact without listing things they cannot act on.
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkucmVwb3J0LnVubWVhc3VyZWQ:EN%%,
    // Paul's wording, 17/08/2026. `ต้องมาพูดคุยกัน` is an invitation where
    // `ต้องใช้การพูดคุย` was a requirement, and he cut `แทนการเดา`: the sentence
    // already says the areas are left blank, and defending the choice not to
    // guess draws attention to guessing.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkucmVwb3J0LnVubWVhc3VyZWQ:TH%%,
  },
  "report.strengths": {
    screen: "Candidate PDF, section heading over the strengths list",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkucmVwb3J0LnN0cmVuZ3Rocw:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkucmVwb3J0LnN0cmVuZ3Rocw:TH%%,
  },
  "report.priorities": {
    screen: "Candidate PDF, section heading over the development list",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkucmVwb3J0LnByaW9yaXRpZXM:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkucmVwb3J0LnByaW9yaXRpZXM:TH%%,
  },
  "report.next": {
    screen: "Candidate PDF, section heading over the closing card",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkucmVwb3J0Lm5leHQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkucmVwb3J0Lm5leHQ:TH%%,
  },
  "report.footer": {
    screen: "Candidate PDF, the footing on the last page",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkucmVwb3J0LmZvb3Rlcg:EN%%,
    // Paul's wording, 17/08/2026. It names the instrument the answers came
    // from, opens on what the document is, and turns the closing clause into
    // an invitation, `นัดคุยกัน`, rather than a statement about coverage.
    //
    // **`PunProfile แคเรียร์โค้ชชิ่ง` is half-transliterated, and that is his**
    // rather than a slip to tidy: LR-01 exempts the legal entity
    // `PunProfile Career Coaching` from translation where it names the data
    // controller, and a report footing says who prepared a document rather
    // than who controls the data. `footer.brand`, which does name the
    // controller, is a `fixed` termbase string and is untouched.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkucmVwb3J0LmZvb3Rlcg:TH%%,
  },
  "report.savePdf": {
    screen: "Candidate PDF, the button that reopens the print dialog. Screen only, never printed",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkucmVwb3J0LnNhdmVQZGY:EN%%,
    // **Paul's wording, 17/08/2026**, with the น์ restored on his confirmation.
    // `ดาวน์โหลด` is the standard spelling and `ดาวโหลด` is a common enough
    // misspelling to look deliberate, which is why it was held rather than
    // corrected silently.
    //
    // The change of substance is his: download rather than save. The button
    // reopens the print dialog, and what a reader wants from it is a file.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkucmVwb3J0LnNhdmVQZGY:TH%%,
  },

  // ------------------------------------------------ confidence bands, 17/08/2026
  // `model.ts` carries these three sentences in English for the coach report.
  // The candidate's PDF says the same thing to a different reader, so it reads
  // them from here instead. Two wordings of one fact, which is allowed because
  // the audiences differ; the BAND itself is computed once, in `bandFor`.
  "band.moderate": {
    screen: "Candidate PDF, under a dimension score, when coverage is 45% or better",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuYmFuZC5tb2RlcmF0ZQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuYmFuZC5tb2RlcmF0ZQ:TH%%,
  },
  "band.limited": {
    screen: "Candidate PDF, under a dimension score, when coverage is 25% to 45%",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuYmFuZC5saW1pdGVk:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuYmFuZC5saW1pdGVk:TH%%,
  },
  "band.indicative": {
    screen: "Candidate PDF, under a dimension score, when coverage is under 25%",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuYmFuZC5pbmRpY2F0aXZl:EN%%,
    // Paul's wording, 17/08/2026. `ผลประเมินเบื้องต้น` rather than `ภาพ`, which
    // matches every other place the app names this thing, and `หลายส่วน` rather
    // than `ส่วนใหญ่`: several parts, not most of it. The band is the lowest
    // coverage tier and still should not overstate how little is known.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuYmFuZC5pbmRpY2F0aXZl:TH%%,
  },

  // -------------------------------------------------------- competency names
  // `model.ts` names them in English for the coach report; these are the
  // candidate-facing names, used wherever one is shown by name ("your strongest
  // area is X").
  //
  // **The 15 scoreable ones came first, and on 21/08/2026 the 8 coach-tier
  // Professional Capability items joined them.** The old rule here was that a
  // coach-tier competency is never named to a candidate because it has no score
  // to show. Paul reversed it deliberately for the depth chart: the 11-axis view
  // is a sneak peek, and the coach-tier axes render named and explicitly
  // unscored rather than being hidden. Naming is not scoring, and the "never
  // score a coach-tier competency" rule is untouched. A label here is not
  // permission to put a number beside it.
  //
  // The "(self-declared)" suffix `model.ts` carries is deliberately dropped:
  // the whole result page already says the assessment is self-reported, and
  // repeating it inside every label reads as hedging rather than honesty.
  "item.experienceDepth": {
    screen: "Named when this is the candidate's strongest area",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5leHBlcmllbmNlRGVwdGg:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5leHBlcmllbmNlRGVwdGg:TH%%,
  },
  "item.learningInvestment": {
    screen: "Named when this is the candidate's strongest area",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5sZWFybmluZ0ludmVzdG1lbnQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5sZWFybmluZ0ludmVzdG1lbnQ:TH%%,
  },
  "item.searchFollowThrough": {
    screen: "Named when this is the candidate's strongest area",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5zZWFyY2hGb2xsb3dUaHJvdWdo:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5zZWFyY2hGb2xsb3dUaHJvdWdo:TH%%,
  },
  "item.aiDigitalFluency": {
    screen: "Named when this is the candidate's strongest area",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5haURpZ2l0YWxGbHVlbmN5:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5haURpZ2l0YWxGbHVlbmN5:TH%%,
  },
  "item.cvStatus": {
    screen: "Named when this is the candidate's strongest area",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5jdlN0YXR1cw:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5jdlN0YXR1cw:TH%%,
  },
  "item.linkedinStatus": {
    screen: "Named when this is the candidate's strongest area",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5saW5rZWRpblN0YXR1cw:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5saW5rZWRpblN0YXR1cw:TH%%,
  },
  "item.portfolioEvidence": {
    screen: "Named when this is the candidate's strongest area",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5wb3J0Zm9saW9FdmlkZW5jZQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5wb3J0Zm9saW9FdmlkZW5jZQ:TH%%,
  },
  "item.applicationActivity": {
    screen: "Named when this is the candidate's strongest area",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5hcHBsaWNhdGlvbkFjdGl2aXR5:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5hcHBsaWNhdGlvbkFjdGl2aXR5:TH%%,
  },
  "item.visaReadiness": {
    screen: "Named when this is the candidate's strongest area",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS52aXNhUmVhZGluZXNz:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS52aXNhUmVhZGluZXNz:TH%%,
  },
  "item.languageReadiness": {
    screen: "Named when this is the candidate's strongest area",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5sYW5ndWFnZVJlYWRpbmVzcw:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5sYW5ndWFnZVJlYWRpbmVzcw:TH%%,
  },
  "item.familyReadiness": {
    screen: "Named when this is the candidate's strongest area",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5mYW1pbHlSZWFkaW5lc3M:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5mYW1pbHlSZWFkaW5lc3M:TH%%,
  },
  "item.relocationTimeline": {
    screen: "Named when this is the candidate's strongest area",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5yZWxvY2F0aW9uVGltZWxpbmU:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5yZWxvY2F0aW9uVGltZWxpbmU:TH%%,
  },
  "item.businessEnglish": {
    screen: "Named when this is the candidate's strongest area",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5idXNpbmVzc0VuZ2xpc2g:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5idXNpbmVzc0VuZ2xpc2g:TH%%,
  },
  "item.targetClarity": {
    screen: "Named when this is the candidate's strongest area",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS50YXJnZXRDbGFyaXR5:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS50YXJnZXRDbGFyaXR5:TH%%,
  },
  "item.countryReach": {
    screen: "Named when this is the candidate's strongest or weakest area",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5jb3VudHJ5UmVhY2g:EN%%,
    // Draft, 13/08/2026, for Paul to correct. "Countries you can actually work
    // in", rather than a literal rendering of "reach", which has no natural Thai
    // noun here. Deliberately says ทำงาน rather than ไป: the item is about being
    // employable there, not about being able to travel there.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5jb3VudHJ5UmVhY2g:TH%%,
  },
  "item.salaryStated": {
    screen: "Named when this is the candidate's strongest area",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5zYWxhcnlTdGF0ZWQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5zYWxhcnlTdGF0ZWQ:TH%%,
  },

  // ------------------------------- the 8 coach-tier Professional Capability
  // items, named for the depth chart, 21/08/2026.
  //
  // These render on the sneak-peek axis view WITHOUT a score, which is the whole
  // point of them: the candidate sees what the full picture contains and that
  // this instrument cannot fill it in. `model.ts` carries the coach-facing
  // English and the note on what each one actually needs.
  //
  // READ BACK BY PAUL, 23/08/2026, through `thai-review-queue.md`. Six rewritten,
  // two (`communication`, `execution`) returned with an empty correction line,
  // which is approval rather than a skip.
  //
  // His pass reversed the register call these eight were drafted under. The
  // drafts avoided `เฉพาะทาง`, `ภาวะผู้นำ`, `เชิงกลยุทธ์` and `ผู้อื่น` as too formal,
  // and he put three of the four back. What he did NOT do is verb them: where a
  // draft turned an activity into something done (`การนำทีม`, `การแก้ปัญหาหน้างาน`),
  // he named the activity itself (`ภาวะผู้นำ`, `การวิเคราะห์และแก้ปัญหา`). These are
  // axis labels on a chart, not instructions, and they read as nouns.
  "item.technicalExpertise": {
    screen: "Depth chart, an unscored axis",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS50ZWNobmljYWxFeHBlcnRpc2U:EN%%,
    // Paul, 23/08/2026, from `ความเชี่ยวชาญในงานที่ทำ`. `สายงาน` is the field, which
    // is what an axis label wants; `งานที่ทำ` was the current job. Still distinct
    // from item.experienceDepth, which is how long rather than how deep.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS50ZWNobmljYWxFeHBlcnRpc2U:TH%%,
  },
  "item.problemSolving": {
    screen: "Depth chart, an unscored axis",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5wcm9ibGVtU29sdmluZw:EN%%,
    // Paul, 23/08/2026, from `การแก้ปัญหาหน้างาน`. Adds the analysis half and drops
    // `หน้างาน`, which had narrowed it to problems that arrive at your desk.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5wcm9ibGVtU29sdmluZw:TH%%,
  },
  "item.communication": {
    screen: "Depth chart, an unscored axis",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5jb21tdW5pY2F0aW9u:EN%%,
    // Drafted 21/08/2026, read back and approved unchanged 23/08/2026.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5jb21tdW5pY2F0aW9u:TH%%,
  },
  "item.collaboration": {
    screen: "Depth chart, an unscored axis",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5jb2xsYWJvcmF0aW9u:EN%%,
    // Paul, 23/08/2026: `ผู้อื่น` over the draft's `คนอื่น`. The formal form on an
    // axis label, against the register note above.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5jb2xsYWJvcmF0aW9u:TH%%,
  },
  "item.leadershipOwnership": {
    screen: "Depth chart, an unscored axis",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5sZWFkZXJzaGlwT3duZXJzaGlw:EN%%,
    // Paul, 23/08/2026, from `การนำทีมและรับผิดชอบงาน`. `ภาวะผู้นำ` restored, and
    // `ความรับผิดชอบต่องาน` is ownership of the work rather than of a team, which
    // is what the item measures for candidates who lead nobody.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5sZWFkZXJzaGlwT3duZXJzaGlw:TH%%,
  },
  "item.strategicThinking": {
    screen: "Depth chart, an unscored axis",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5zdHJhdGVnaWNUaGlua2luZw:EN%%,
    // Paul, 23/08/2026, from `การคิดและวางแผนระยะยาว`. The direct term, matching
    // the English label rather than paraphrasing it.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5zdHJhdGVnaWNUaGlua2luZw:TH%%,
  },
  "item.execution": {
    screen: "Depth chart, an unscored axis",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5leGVjdXRpb24:EN%%,
    // Drafted 21/08/2026, read back and approved unchanged 23/08/2026. Avoids
    // `ลงมือ`, which already carries item.applicationActivity,
    // item.searchFollowThrough and teaser.nextStep.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5leGVjdXRpb24:TH%%,
  },
  "item.learningAgility": {
    screen: "Depth chart, an unscored axis",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5sZWFybmluZ0FnaWxpdHk:EN%%,
    // Paul, 23/08/2026, from his own `การปรับตัวกับสิ่งแวดล้อม` of 21/08. This closes
    // the flag that stood on it: `สิ่งแวดล้อม` read as adapting to surroundings,
    // where the ECRA indicators are about picking things up quickly. The new
    // wording names both halves, learning and adapting fast.
    th: %%LANG:c3JjL2xpYi9jb250ZW50L2NvcHkudHM6OkNPUFkuaXRlbS5sZWFybmluZ0FnaWxpdHk:TH%%,
  },
} as const satisfies Record<string, CopyEntry>;

export type CopyKey = keyof typeof COPY;
