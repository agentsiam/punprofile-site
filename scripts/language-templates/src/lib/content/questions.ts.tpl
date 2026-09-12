/**
 * **Thai wording passed by Paul, 15/08/2026.** Twenty-nine strings across
 * fourteen questions were rewritten in his own words during a review of all
 * shipped Thai. That makes this file his for the wording; the option *values*
 * are unchanged and the additions he proposed are held as decisions, because
 * several of them move scoring, the ICP grade or the booking gate.
 *
 * TASK-051: the staged questionnaire, as data.
 *
 * Decided 04/08/2026: this app absorbs both Google instruments. Every question
 * lives here with CANONICAL answer values, the same vocabulary `ScoringInput`
 * speaks, so the app never parses free text; the fuzzy parsers in
 * `normalize.ts` serve only the historical backfill.
 *
 * Stage 1 is the pre-email set: the nine questions specified in
 * `survey-spec-template.md`, one under the 10-question cap from PRD § 1,
 * tap-only, covering both live instruments' Stage 1 topics and feeding the
 * teaser chart. Stage 2 (post-unlock) lands in Phase 2.
 *
 * Copy: every `th` string below comes from `survey-spec-template.md`, which
 * extracted them from the two published forms rather than authoring them, so
 * this is wording candidates have already seen. The two exceptions are
 * `pathway` and the multi-select framing of `targetCountries`, which have no
 * live equivalent; both were approved by the founder on 08/08/2026 ahead of
 * the consolidated native-tone pass (TASK-052). An empty `th` still means
 * "not yet reviewed" and the UI falls back to English.
 */

export interface Option {
  /** Canonical value, written verbatim into `responses` and mapped to ScoringInput. */
  value: string;
  en: string;
  th: string;
}

export interface Question {
  key: string;
  stage: 1 | 2;
  /**
   * "one" stores a string, "many" stores an array. The distinction is enforced
   * by `isValidAnswer` on the server, not just prevented in the UI.
   */
  select: "one" | "many";
  en: string;
  th: string;
  options: Option[];
}

/**
 * Values that mean "I don't know" and therefore cannot be combined with a real
 * answer in a many-select question. "Germany, Netherlands, not sure yet" is not
 * a coherent answer.
 */
// `never` joins `not_sure` on 14/08/2026, for the investment question: "I have
// not paid for any of these" cannot coexist with an item from the same list.
// A distinct value rather than reusing `none`, which several single-select
// questions already use for something that is not exclusive of anything.
export const EXCLUSIVE_VALUES = new Set(["not_sure", "never", "none", "not_yet"]);

/**
 * Functions, not job titles. Rewritten 14/08/2026 on Paul's read: "it's not a
 * job title, the goal is to find out what the aspiration is in terms of
 * department or capability".
 *
 * Two things were wrong, and the list was only the second of them. The question
 * itself asked `ตำแหน่งงานหรือสายงาน`, position OR field, so it asked two
 * questions at once and a candidate could honestly answer either. And
 * `Management & Executive` sat in a list of functions while being a seniority,
 * which is what made the whole set read as titles: a marketing director had to
 * choose between their function and their level, and lost the more useful of
 * the two. Seniority is already answered by the experience question, so it is
 * gone from here.
 *
 * `Other` is gone as well, and that is what removed the pressure for a free
 * text box. It was never an answer, only a bucket that needed a text field to
 * mean anything, and the app has no free-text question type by decision
 * (13/08/2026, the In Scope gate reads the CV instead). `Still deciding` is a
 * real answer in its place, and it scores honestly as low Target Clarity,
 * which is exactly what someone who cannot yet name a field should score.
 *
 * Categories rather than titles for the original reason too: Target Clarity
 * needs "a field is named", not an essay.
 */
export const ROLE_CATEGORIES = [
  "IT & Software",
  "Engineering & Technical",
  "Data & Analytics",
  "Finance & Accounting",
  "Marketing",
  "Sales & Business Development",
  "Customer Success & Account Management",
  "HR & People",
  "Design & Creative",
  "Procurement, Supply Chain & Operations",
  "Business, Strategy & Project",
  "Education & Training",
  "Healthcare & Life Sciences",
  "Hospitality & Tourism",
  "Legal & Compliance",
  "Research & Science",
] as const;

const COUNTRIES = [
  "Germany",
  "Netherlands",
  // Added 13/08/2026. Absent by omission rather than by decision: it was the
  // third most-named country across the 90 imported survey leads, `07_Reference.md`
  // already carries its visa rules, and Country Fit already tiers it as harder.
  "United Kingdom",
  "France",
  "Denmark",
  "Sweden",
  "Norway",
  "Finland",
  "Ireland",
  "Belgium",
  "Austria",
  "Switzerland",
  "Spain",
  "Italy",
  "Portugal",
  "Poland",
  "Czech Republic",
] as const;

export const PATHWAYS = [
  { value: "job_first", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6UEFUSFdBWVNbMF0:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6UEFUSFdBWVNbMF0:TH%% },
  { value: "study_first", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6UEFUSFdBWVNbMV0:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6UEFUSFdBWVNbMV0:TH%% },
  { value: "family", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6UEFUSFdBWVNbMl0:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6UEFUSFdBWVNbMl0:TH%% },
  { value: "not_sure", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6UEFUSFdBWVNbM10:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6UEFUSFdBWVNbM10:TH%% },
] as const;

export const STAGE1: Question[] = [
  {
    // SLOT: pathway. Context and narrative only, no score: it drives the
    // opening line of the result (FR-008) and is stored on `leads.pathway`,
    // not in ScoringInput. All four routes are written to read as equally
    // legitimate.
    key: "pathway",
    stage: 1,
    select: "one",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzBd:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzBd:TH%%,
    options: PATHWAYS.map((p) => ({ value: p.value, en: p.en, th: p.th })),
  },
  {
    // SLOT: targetCountries [proxy: Target Clarity]. Multi-select: the live
    // form was free text and produced "Netherlands Germany France" and
    // "สนใจทุกประเทศ", which no scorer can read.
    key: "targetCountries",
    stage: 1,
    select: "many",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzFd:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzFd:TH%%,
    options: [
      ...COUNTRIES.map((c) => ({ value: c, en: c, th: c })),
      { value: "not_sure", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzFdLm9wdGlvbnNbMV0:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzFdLm9wdGlvbnNbMV0:TH%% },
    ],
  },
  {
    // SLOT: targetRole [proxy: Target Clarity]. The field, not the title, since
    // 14/08/2026: see the note on ROLE_CATEGORIES above.
    key: "targetRole",
    stage: 1,
    select: "one",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzJd:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzJd:TH%%,
    options: [
      ...ROLE_CATEGORIES.map((r) => ({ value: r, en: r, th: r })),
      { value: "not_sure", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzJdLm9wdGlvbnNbMV0:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzJdLm9wdGlvbnNbMV0:TH%% },
    ],
  },
  {
    // SLOT: experienceYears [ICP Gate 2: Offering Match]. Added 14/08/2026.
    //
    // Deliberately NOT mapped into ScoringInput. `experienceDepth` is an item
    // of Professional Capability, and Stage 1 leaves that dimension hollow on
    // purpose (PRD § 1, and `verify-content.ts` asserts both directions of it).
    // This answer reaches the coach through `toGradeInput` only, so the
    // candidate's first read is unchanged by it.
    key: "experienceYears",
    stage: 1,
    select: "one",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzNd:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzNd:TH%%,
    options: [
      { value: "0-1", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzNdLm9wdGlvbnNbMF0:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzNdLm9wdGlvbnNbMF0:TH%% },
      { value: "2-10", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzNdLm9wdGlvbnNbMV0:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzNdLm9wdGlvbnNbMV0:TH%% },
      { value: "11-15", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzNdLm9wdGlvbnNbMl0:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzNdLm9wdGlvbnNbMl0:TH%% },
      { value: "16+", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzNdLm9wdGlvbnNbM10:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzNdLm9wdGlvbnNbM10:TH%% },
    ],
  },
  {
    // SLOT: cv [proxy: CV Status].
    key: "cv",
    stage: 1,
    select: "one",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzRd:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzRd:TH%%,
    options: [
      { value: "none", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzRdLm9wdGlvbnNbMF0:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzRdLm9wdGlvbnNbMF0:TH%% },
      { value: "untailored", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzRdLm9wdGlvbnNbMV0:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzRdLm9wdGlvbnNbMV0:TH%% },
      { value: "out_dated", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzRdLm9wdGlvbnNbMl0:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzRdLm9wdGlvbnNbMl0:TH%% },
      { value: "europe_ready", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzRdLm9wdGlvbnNbM10:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzRdLm9wdGlvbnNbM10:TH%% },
    ],
  },
  {
    // SLOT: linkedin [proxy: LinkedIn Status].
    key: "linkedin",
    stage: 1,
    select: "one",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzVd:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzVd:TH%%,
    options: [
      { value: "none", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzVdLm9wdGlvbnNbMF0:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzVdLm9wdGlvbnNbMF0:TH%% },
      { value: "basic", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzVdLm9wdGlvbnNbMV0:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzVdLm9wdGlvbnNbMV0:TH%% },
      { value: "active", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzVdLm9wdGlvbnNbMl0:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzVdLm9wdGlvbnNbMl0:TH%% },
      { value: "utilized", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzVdLm9wdGlvbnNbM10:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzVdLm9wdGlvbnNbM10:TH%% },
    ],
  },
  {
    // SLOT: portfolio [proxy: Portfolio Evidence]. Added 14/08/2026, one of
    // five questions carried over from the Google Form before it retires.
    //
    // Worth knowing what the answers look like: 44 of the first 63 survey
    // respondents said no, which scores the floor, and that is precisely why
    // the lowest-score-wins picker used to nominate "build a portfolio" as
    // almost everyone's next action. The funnel-ordered picker handles it now.
    key: "portfolio",
    stage: 1,
    select: "one",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzZd:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzZd:TH%%,
    options: [
      { value: "none", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzZdLm9wdGlvbnNbMF0:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzZdLm9wdGlvbnNbMF0:TH%% },
      { value: "partial", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzZdLm9wdGlvbnNbMV0:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzZdLm9wdGlvbnNbMV0:TH%% },
      // `good` is retired from the question and still scores, because ~160
      // existing records hold it. See `scorePortfolio`.
      { value: "good_physical", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzZdLm9wdGlvbnNbMl0:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzZdLm9wdGlvbnNbMl0:TH%% },
      { value: "good_digital", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzZdLm9wdGlvbnNbM10:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzZdLm9wdGlvbnNbM10:TH%% },
    ],
  },
  {
    // SLOT: aiTools [ECRA: AI & Digital Fluency]. Added 14/08/2026.
    //
    // This is one of only FIVE competencies out of ECRA's 34 that self-report
    // can honestly score, so losing it with the Google Form would have taken
    // the app from five real scores to four. The framework's formula is
    // literally `1 + indicators met`, which is why the options are the
    // indicators themselves rather than a satisfaction scale.
    //
    // The flags are stored as well as the count: "adopt indicator 3" is only
    // prescribable if we know 3 is the missing one. Evidence stays granular,
    // scores compress.
    key: "aiTools",
    stage: 1,
    select: "many",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzdd:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzdd:TH%%,
    options: [
      {
        value: "ai_weekly",
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzddLm9wdGlvbnNbMF0:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzddLm9wdGlvbnNbMF0:TH%%,
      },
      {
        value: "eu_tools",
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzddLm9wdGlvbnNbMV0:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzddLm9wdGlvbnNbMV0:TH%%,
      },
      {
        value: "ai_tailor",
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzddLm9wdGlvbnNbMl0:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzddLm9wdGlvbnNbMl0:TH%%,
      },
      {
        value: "self_taught",
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzddLm9wdGlvbnNbM10:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzddLm9wdGlvbnNbM10:TH%%,
      },
      { value: "never", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzddLm9wdGlvbnNbNF0:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzddLm9wdGlvbnNbNF0:TH%% },
    ],
  },
  {
    // SLOT: workAuth [ECRA: Visa Readiness]. `sponsor_route_named` has no live
    // equivalent: the framework scores "knows the specific route" a full point
    // above "knows sponsorship is needed", and no form ever asked it.
    key: "workAuth",
    stage: 1,
    select: "one",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzhd:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzhd:TH%%,
    options: [
      {
        value: "eu_rights",
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzhdLm9wdGlvbnNbMF0:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzhdLm9wdGlvbnNbMF0:TH%%,
      },
      {
        value: "sponsor_route_named",
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzhdLm9wdGlvbnNbMV0:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzhdLm9wdGlvbnNbMV0:TH%%,
      },
      {
        value: "sponsor_no_route",
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzhdLm9wdGlvbnNbMl0:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzhdLm9wdGlvbnNbMl0:TH%%,
      },
      { value: "unsure", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzhdLm9wdGlvbnNbM10:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzhdLm9wdGlvbnNbM10:TH%% },
    ],
  },
  {
    // SLOT: englishCefr [ECRA: Language Readiness + Business English]. Feeds
    // two of the four dimensions. Founder decision 08/08/2026: no test-score
    // follow-up, buttons are enough.
    //
    // Six levels since 14/08/2026, the full CEFR ladder, on Paul's call. The
    // four-button version folded A1 into A2 and B2 into B1, which cost the two
    // distinctions that matter most in this pool: a true beginner scored the
    // same as someone with school English, and B2, the level most European
    // employers actually ask for, had nowhere to land. The scale, the
    // normaliser and `parseCefr` already carried all six; only the question
    // was short.
    key: "english",
    stage: 1,
    select: "one",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzld:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzld:TH%%,
    options: [
      { value: "A1", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzldLm9wdGlvbnNbMF0:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzldLm9wdGlvbnNbMF0:TH%% },
      { value: "A2", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzldLm9wdGlvbnNbMV0:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzldLm9wdGlvbnNbMV0:TH%% },
      { value: "B1", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzldLm9wdGlvbnNbMl0:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzldLm9wdGlvbnNbMl0:TH%% },
      { value: "B2", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzldLm9wdGlvbnNbM10:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzldLm9wdGlvbnNbM10:TH%% },
      { value: "C1", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzldLm9wdGlvbnNbNF0:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzldLm9wdGlvbnNbNF0:TH%% },
      { value: "C2", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzldLm9wdGlvbnNbNV0:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzldLm9wdGlvbnNbNV0:TH%% },
    ],
  },
  {
    // SLOT: stage [proxy: Application Activity].
    //
    // **Unmerged 15/08/2026.** `survey-spec-template.md` merged the live form's
    // last two options into one because they score identically, and they still
    // do: both return 5 from `scoreApplicationActivity`. But the score was
    // never the only reader. `08_Coaching_Business.md` gates the booking link
    // on stage = interviewing or negotiating, which puts one of the two merged
    // options inside the cut and the other outside it, and the negotiation
    // module and its own LINE message variant exist for that value alone. So
    // the merge made the negotiation conversation unreachable for every
    // app-native lead.
    //
    // This is the same fault as the dead `already have an offer` string
    // recorded in `08_Coaching_Business.md`, which made the quiz's negotiation
    // floor unreachable for the whole life of that form. Fixing it costs one
    // tap and moves no score.
    //
    // Thai is the live form's own wording for the two options, quoted in that
    // document's Q11 list, not new copy.
    key: "stage",
    stage: 1,
    select: "one",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEwXQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEwXQ:TH%%,
    options: [
      { value: "not_started", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEwXS5vcHRpb25zWzBd:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEwXS5vcHRpb25zWzBd:TH%% },
      { value: "researching", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEwXS5vcHRpb25zWzFd:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEwXS5vcHRpb25zWzFd:TH%% },
      { value: "applying", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEwXS5vcHRpb25zWzJd:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEwXS5vcHRpb25zWzJd:TH%% },
      { value: "interviewing", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEwXS5vcHRpb25zWzNd:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEwXS5vcHRpb25zWzNd:TH%% },
      {
        value: "interviewing_unsuccessful",
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEwXS5vcHRpb25zWzRd:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEwXS5vcHRpb25zWzRd:TH%%,
      },
      { value: "offer", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEwXS5vcHRpb25zWzVd:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEwXS5vcHRpb25zWzVd:TH%% },
      { value: "negotiating", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEwXS5vcHRpb25zWzZd:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEwXS5vcHRpb25zWzZd:TH%% },
    ],
  },
  {
    // SLOT: applications [proxy: Application Activity with Q11, and Search
    // Follow-through]. Added 14/08/2026.
    //
    // Bands, not a number: the scorer only ever asks "none / under five / five
    // or more", so a free number would collect a precision nothing reads. The
    // fourth band exists for the coach rather than the score, which is a fair
    // trade at one tap.
    key: "applications",
    stage: 1,
    select: "one",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzExXQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzExXQ:TH%%,
    options: [
      { value: "0", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzExXS5vcHRpb25zWzBd:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzExXS5vcHRpb25zWzBd:TH%% },
      { value: "1-4", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzExXS5vcHRpb25zWzFd:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzExXS5vcHRpb25zWzFd:TH%% },
      { value: "5-20", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzExXS5vcHRpb25zWzJd:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzExXS5vcHRpb25zWzJd:TH%% },
      { value: "21-50", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzExXS5vcHRpb25zWzNd:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzExXS5vcHRpb25zWzNd:TH%% },
      { value: "51-100", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzExXS5vcHRpb25zWzRd:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzExXS5vcHRpb25zWzRd:TH%% },
      { value: "100+", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzExXS5vcHRpb25zWzVd:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzExXS5vcHRpb25zWzVd:TH%% },
      // `20+` is retired from the question, superseded by the three bands
      // above on Paul's pass 15/08/2026. It still maps in `mapping.ts` because
      // existing records hold it.
    ],
  },
  {
    // SLOT: none. This question scores nothing and is the only one that does
    // not, added 19/08/2026 for Temperature alone (TASK-055 follow-up).
    //
    // It is the retired Europe Readiness Check's Q4, which is the ONLY input of
    // the five Temperature weights that this app could not measure. That quiz
    // asked how many roles and whether anyone replied in one breath; the count
    // half is already `applications` above, so only the reply half is asked
    // here. Its two "applied" options are that form's own Thai, quoted from
    // `europe-readiness-check-quiz.md`, so they are wording candidates have
    // already seen; the stem is new and reviewed separately.
    //
    // **A separate question rather than a follow-up, because the app has no
    // conditional question display** (see `family` below for the same
    // constraint solved a different way). So "haven't applied yet" is an option
    // rather than a reason to skip: it is the quiz's own 0-point answer, and it
    // keeps the question coherent for the person who has not applied.
    //
    // It can contradict `applications`. Someone can answer "None yet" there and
    // "got some responses" here. Nothing resolves that automatically, on
    // purpose: this answer is the one Temperature reads, because it is the one
    // the weights were written against.
    key: "applicationResponse",
    stage: 1,
    select: "one",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEyXQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEyXQ:TH%%,
    options: [
      { value: "not_applied", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEyXS5vcHRpb25zWzBd:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEyXS5vcHRpb25zWzBd:TH%% },
      {
        value: "no_replies",
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEyXS5vcHRpb25zWzFd:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEyXS5vcHRpb25zWzFd:TH%%,
      },
      {
        value: "some_replies",
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEyXS5vcHRpb25zWzJd:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEyXS5vcHRpb25zWzJd:TH%%,
      },
    ],
  },
  {
    // SLOT: timeline [proxy: Relocation Timeline].
    key: "timeline",
    stage: 1,
    select: "one",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEzXQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEzXQ:TH%%,
    options: [
      { value: "within_3m", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEzXS5vcHRpb25zWzBd:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEzXS5vcHRpb25zWzBd:TH%% },
      { value: "3_6m", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEzXS5vcHRpb25zWzFd:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEzXS5vcHRpb25zWzFd:TH%% },
      { value: "6_12m", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEzXS5vcHRpb25zWzJd:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEzXS5vcHRpb25zWzJd:TH%% },
      { value: "exploring", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEzXS5vcHRpb25zWzNd:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzEzXS5vcHRpb25zWzNd:TH%% },
    ],
  },
  {
    // SLOT: family [ECRA: Family Readiness]. Added 14/08/2026, and the fifth
    // of the five real ECRA competencies self-report can reach.
    //
    // One question, not two, for the same reason Q11 is one: the app has no
    // conditional question display, so a follow-up about family logistics
    // would have shown to every single person with no partner and no children.
    // The exclusive "no partner or dependents" option carries `hasDependents:
    // false`, which the framework auto-scores 5, and the four indicator
    // options carry `true` plus their own flag.
    //
    // `not_yet` exists so that having dependents and having done none of this
    // is expressible. Without it, someone with a family and no plan would have
    // had to either lie or leave the question, and those score very
    // differently.
    //
    // Family Readiness is scored but never offered as a next action: it is a
    // life circumstance, not a task, and the funnel picker excludes it.
    key: "family",
    stage: 1,
    select: "many",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE0XQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE0XQ:TH%%,
    options: [
      {
        value: "none",
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE0XS5vcHRpb25zWzBd:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE0XS5vcHRpb25zWzBd:TH%%,
      },
      {
        value: "discussed",
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE0XS5vcHRpb25zWzFd:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE0XS5vcHRpb25zWzFd:TH%%,
      },
      {
        value: "no_objection",
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE0XS5vcHRpb25zWzJd:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE0XS5vcHRpb25zWzJd:TH%%,
      },
      {
        value: "dependents_plan",
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE0XS5vcHRpb25zWzNd:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE0XS5vcHRpb25zWzNd:TH%%,
      },
      {
        value: "logistics",
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE0XS5vcHRpb25zWzRd:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE0XS5vcHRpb25zWzRd:TH%%,
      },
      {
        value: "not_yet",
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE0XS5vcHRpb25zWzVd:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE0XS5vcHRpb25zWzVd:TH%%,
      },
    ],
  },
  {
    // SLOT: salary [proxy: Salary Expectation Stated]. Added 14/08/2026.
    //
    // The proxy is named for what it measures: whether a usable figure exists,
    // never whether the figure is realistic. Classifying it would need a
    // country and role market benchmark, and `salaryExpectations` stays a
    // coach-tier item for exactly that reason.
    //
    // Bands rather than free text, which the app has no input type for anyway,
    // and which here is an improvement: a band guarantees a figure, a currency
    // and a period, where the survey's free text produced "depends" often
    // enough to need its own parser branch. Every band scores the same 3 on
    // purpose. The band itself is for the call.
    key: "salary",
    stage: 1,
    select: "one",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE1XQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE1XQ:TH%%,
    options: [
      { value: "under_2500", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE1XS5vcHRpb25zWzBd:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE1XS5vcHRpb25zWzBd:TH%% },
      { value: "2500_3500", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE1XS5vcHRpb25zWzFd:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE1XS5vcHRpb25zWzFd:TH%% },
      { value: "3500_5000", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE1XS5vcHRpb25zWzJd:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE1XS5vcHRpb25zWzJd:TH%% },
      { value: "over_5000", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE1XS5vcHRpb25zWzNd:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE1XS5vcHRpb25zWzNd:TH%% },
      { value: "not_sure", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE1XS5vcHRpb25zWzRd:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE1XS5vcHRpb25zWzRd:TH%% },
    ],
  },
  {
    // SLOT: priorInvestment [ICP score: Investment Readiness]. Added
    // 14/08/2026, and the reason the pair was added at all: measured across
    // all 90 survey leads this was the ONLY ICP criterion that separated the
    // pool, 41% having paid for career development against 53% who had not.
    //
    // Last, exactly as the Lead Discovery Survey placed it (Q21). Revealed
    // past spend is a better willingness-to-pay signal than a hypothetical
    // budget question, and it reads as a normal closing question rather than
    // a price probe when it comes after everything else.
    //
    // **Multi-select since later the same day, on Paul's call: he wanted to
    // know WHAT they paid for, not just whether they had.** Asking the areas
    // directly answers both, so this stayed one question rather than becoming
    // a yes/no plus a follow-up. That matters more than it looks: the app has
    // no conditional question display, so a follow-up would have shown to
    // everyone including the people who just said no.
    //
    // The score does not change with the areas, and should not. The framework
    // asks about prior spend and not its aim: "having paid for anything before
    // is the signal". The areas are for the coach's call preparation, and
    // `toGradeInput` collapses them back to paid or not paid.
    //
    // The 0 band ("named money as a blocker") still cannot be reached from the
    // app, since it comes from free text nothing here collects.
    key: "priorInvestment",
    stage: 1,
    select: "many",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE2XQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE2XQ:TH%%,
    options: [
      { value: "language", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE2XS5vcHRpb25zWzBd:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE2XS5vcHRpb25zWzBd:TH%% },
      {
        value: "soft_skills",
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE2XS5vcHRpb25zWzFd:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE2XS5vcHRpb25zWzFd:TH%%,
      },
      {
        value: "technical",
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE2XS5vcHRpb25zWzJd:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE2XS5vcHRpb25zWzJd:TH%%,
      },
      {
        value: "certification",
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE2XS5vcHRpb25zWzNd:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE2XS5vcHRpb25zWzNd:TH%%,
      },
      {
        // Added 14/08/2026 on Paul's call: portfolio had to be one of the
        // subjects. It is the highest-signal option in the list for this
        // business, because it is the only one that names something PunProfile
        // itself sells: someone who has already paid to have a CV or a
        // LinkedIn profile written has priced this category of work before,
        // and their objection on a call is never "why would anyone pay for
        // that".
        //
        // The score is unaffected, as with every other area here. The
        // framework asks about prior spend and not its aim, so `toGradeInput`
        // collapses any paid area to the same band. This is for the call.
        value: "profile_docs",
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE2XS5vcHRpb25zWzRd:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE2XS5vcHRpb25zWzRd:TH%%,
      },
      { value: "career_coach", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE2XS5vcHRpb25zWzVd:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE2XS5vcHRpb25zWzVd:TH%% },
      { value: "never", en: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE2XS5vcHRpb25zWzZd:EN%%, th: %%LANG:c3JjL2xpYi9jb250ZW50L3F1ZXN0aW9ucy50czo6U1RBR0UxWzE2XS5vcHRpb25zWzZd:TH%% },
    ],
  },
];

export const QUESTION_INDEX: Record<string, Question> = Object.fromEntries(
  STAGE1.map((q) => [q.key, q]),
);

/**
 * True when `value` is a legal answer for `questionKey`. The server calls this.
 *
 * A "one" question takes a string and rejects an array; a "many" question takes
 * a non-empty array with no duplicates, and rejects a bare string. In a "many"
 * question an exclusive value such as `not_sure` may only appear on its own.
 */
export function isValidAnswer(questionKey: string, value: unknown): boolean {
  const q = QUESTION_INDEX[questionKey];
  if (!q) return false;

  const legal = (v: unknown): boolean =>
    typeof v === "string" && q.options.some((o) => o.value === v);

  if (q.select === "one") return legal(value);

  if (!Array.isArray(value) || value.length === 0) return false;
  if (!value.every(legal)) return false;
  if (new Set(value).size !== value.length) return false;
  if (value.length > 1 && value.some((v) => EXCLUSIVE_VALUES.has(v as string))) return false;
  return true;
}
