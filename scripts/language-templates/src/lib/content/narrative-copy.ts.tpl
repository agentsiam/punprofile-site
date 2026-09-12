/**
 * **Thai wording passed by Paul, 15/08/2026**, in the review of all shipped
 * Thai. One edit was overruled by the lint and not by me: `นัดคุยฟรี 30 นาที`
 * is the ฟรี collocation LR-04 exists to prevent, and the termbase already
 * bans it in favour of the fixed `นัดปรึกษาฟรี 30 นาที`.
 *
 * The sentence bank behind the personalized result summary.
 *
 * **This personalizes by selection, not generation.** The engine picks which of
 * these fixed sentences apply from the candidate's own scores; it never writes
 * one. That is the only way the summary can be both translatable and honest: a
 * generated sentence would reach a candidate in unreviewed Thai, and could
 * claim something the scores do not support.
 *
 * Language rules, copy, and per-string verdicts live in `LANGUAGE-SYSTEM.md`.
 * `scripts/lint-thai.ts` enforces the mechanical subset and the language-system
 * verifier gates the structural-calque verdict.
 *
 * The one constraint specific to this file: a sentence here must stand on its
 * own for the situation named in its `screen` note, without knowing which
 * others appear beside it, because the engine selects rather than composes.
 * `assertCandidateSafe()` and `scripts/verify-copy.ts` enforce the rest.
 */

import type { CopyEntry } from "./copy";

/**
 * Overall standing bands. Thresholds match `describe()` in `narrative.ts`, so
 * the teaser and the coach report never disagree about what a number means.
 */
export const STANDING_BANDS = [
  { key: "advantage", min: 4.5 },
  { key: "strong", min: 3.5 },
  { key: "typical", min: 2.5 },
  { key: "developing", min: 1.5 },
  { key: "earliest", min: 0 },
] as const;

export type StandingKey = (typeof STANDING_BANDS)[number]["key"];

export const standingFor = (score: number): StandingKey =>
  (STANDING_BANDS.find((b) => score >= b.min) ?? STANDING_BANDS[4]).key;

export const NARRATIVE_COPY = {
  // ------------------------------------------------------- pathway openers
  // FR-008: the opening line must differ meaningfully by route, and "not sure"
  // must read as an equally legitimate answer rather than a lesser one.
  "narrative.opener.job_first": {
    screen: "Result summary, opening line when the route is find-a-job-first",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L25hcnJhdGl2ZS1jb3B5LnRzOjpOQVJSQVRJVkVfQ09QWS5uYXJyYXRpdmUub3BlbmVyLmpvYl9maXJzdA:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L25hcnJhdGl2ZS1jb3B5LnRzOjpOQVJSQVRJVkVfQ09QWS5uYXJyYXRpdmUub3BlbmVyLmpvYl9maXJzdA:TH%%,
  },
  "narrative.opener.study_first": {
    screen: "Result summary, opening line when the route is study-first",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L25hcnJhdGl2ZS1jb3B5LnRzOjpOQVJSQVRJVkVfQ09QWS5uYXJyYXRpdmUub3BlbmVyLnN0dWR5X2ZpcnN0:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L25hcnJhdGl2ZS1jb3B5LnRzOjpOQVJSQVRJVkVfQ09QWS5uYXJyYXRpdmUub3BlbmVyLnN0dWR5X2ZpcnN0:TH%%,
  },
  "narrative.opener.family": {
    screen: "Result summary, opening line when the route is family or partner",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L25hcnJhdGl2ZS1jb3B5LnRzOjpOQVJSQVRJVkVfQ09QWS5uYXJyYXRpdmUub3BlbmVyLmZhbWlseQ:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L25hcnJhdGl2ZS1jb3B5LnRzOjpOQVJSQVRJVkVfQ09QWS5uYXJyYXRpdmUub3BlbmVyLmZhbWlseQ:TH%%,
  },
  "narrative.opener.not_sure": {
    screen: "Result summary, opening line when the route is not chosen yet. Must not read as a worse answer",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L25hcnJhdGl2ZS1jb3B5LnRzOjpOQVJSQVRJVkVfQ09QWS5uYXJyYXRpdmUub3BlbmVyLm5vdF9zdXJl:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L25hcnJhdGl2ZS1jb3B5LnRzOjpOQVJSQVRJVkVfQ09QWS5uYXJyYXRpdmUub3BlbmVyLm5vdF9zdXJl:TH%%,
  },

  // ------------------------------------------------------- overall standing
  "narrative.standing.advantage": {
    screen: "Result summary, when the overall picture is a real advantage",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L25hcnJhdGl2ZS1jb3B5LnRzOjpOQVJSQVRJVkVfQ09QWS5uYXJyYXRpdmUuc3RhbmRpbmcuYWR2YW50YWdl:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L25hcnJhdGl2ZS1jb3B5LnRzOjpOQVJSQVRJVkVfQ09QWS5uYXJyYXRpdmUuc3RhbmRpbmcuYWR2YW50YWdl:TH%%,
  },
  "narrative.standing.strong": {
    screen: "Result summary, when the overall picture is strong",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L25hcnJhdGl2ZS1jb3B5LnRzOjpOQVJSQVRJVkVfQ09QWS5uYXJyYXRpdmUuc3RhbmRpbmcuc3Ryb25n:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L25hcnJhdGl2ZS1jb3B5LnRzOjpOQVJSQVRJVkVfQ09QWS5uYXJyYXRpdmUuc3RhbmRpbmcuc3Ryb25n:TH%%,
  },
  "narrative.standing.typical": {
    screen: "Result summary, when the overall picture is mid-range",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L25hcnJhdGl2ZS1jb3B5LnRzOjpOQVJSQVRJVkVfQ09QWS5uYXJyYXRpdmUuc3RhbmRpbmcudHlwaWNhbA:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L25hcnJhdGl2ZS1jb3B5LnRzOjpOQVJSQVRJVkVfQ09QWS5uYXJyYXRpdmUuc3RhbmRpbmcudHlwaWNhbA:TH%%,
  },
  "narrative.standing.developing": {
    screen: "Result summary, when the overall picture is still developing",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L25hcnJhdGl2ZS1jb3B5LnRzOjpOQVJSQVRJVkVfQ09QWS5uYXJyYXRpdmUuc3RhbmRpbmcuZGV2ZWxvcGluZw:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L25hcnJhdGl2ZS1jb3B5LnRzOjpOQVJSQVRJVkVfQ09QWS5uYXJyYXRpdmUuc3RhbmRpbmcuZGV2ZWxvcGluZw:TH%%,
  },
  "narrative.standing.earliest": {
    screen: "Result summary, when the candidate is at the very beginning",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L25hcnJhdGl2ZS1jb3B5LnRzOjpOQVJSQVRJVkVfQ09QWS5uYXJyYXRpdmUuc3RhbmRpbmcuZWFybGllc3Q:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L25hcnJhdGl2ZS1jb3B5LnRzOjpOQVJSQVRJVkVfQ09QWS5uYXJyYXRpdmUuc3RhbmRpbmcuZWFybGllc3Q:TH%%,
  },

  // ------------------------------------------------------------ lead-in lines
  "narrative.strength.lead": {
    screen: "Result summary, before the strongest area. {area} is substituted",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L25hcnJhdGl2ZS1jb3B5LnRzOjpOQVJSQVRJVkVfQ09QWS5uYXJyYXRpdmUuc3RyZW5ndGgubGVhZA:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L25hcnJhdGl2ZS1jb3B5LnRzOjpOQVJSQVRJVkVfQ09QWS5uYXJyYXRpdmUuc3RyZW5ndGgubGVhZA:TH%%,
  },
  "narrative.next.lead": {
    screen: "Result summary, before the single next action",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L25hcnJhdGl2ZS1jb3B5LnRzOjpOQVJSQVRJVkVfQ09QWS5uYXJyYXRpdmUubmV4dC5sZWFk:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L25hcnJhdGl2ZS1jb3B5LnRzOjpOQVJSQVRJVkVfQ09QWS5uYXJyYXRpdmUubmV4dC5sZWFk:TH%%,
  },
  "narrative.unmeasured": {
    screen: "Result summary, when parts could not be scored. {count} is substituted",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L25hcnJhdGl2ZS1jb3B5LnRzOjpOQVJSQVRJVkVfQ09QWS5uYXJyYXRpdmUudW5tZWFzdXJlZA:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L25hcnJhdGl2ZS1jb3B5LnRzOjpOQVJSQVRJVkVfQ09QWS5uYXJyYXRpdmUudW5tZWFzdXJlZA:TH%%,
  },

  // -------------------------------------------------------------------- CTA
  "narrative.cta.heading": {
    screen: "Result summary, above the consultation button",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L25hcnJhdGl2ZS1jb3B5LnRzOjpOQVJSQVRJVkVfQ09QWS5uYXJyYXRpdmUuY3RhLmhlYWRpbmc:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L25hcnJhdGl2ZS1jb3B5LnRzOjpOQVJSQVRJVkVfQ09QWS5uYXJyYXRpdmUuY3RhLmhlYWRpbmc:TH%%,
  },
  "narrative.cta.body": {
    screen: "Result summary, under the heading. Sells measurement, never a verdict",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L25hcnJhdGl2ZS1jb3B5LnRzOjpOQVJSQVRJVkVfQ09QWS5uYXJyYXRpdmUuY3RhLmJvZHk:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L25hcnJhdGl2ZS1jb3B5LnRzOjpOQVJSQVRJVkVfQ09QWS5uYXJyYXRpdmUuY3RhLmJvZHk:TH%%,
  },
  "narrative.cta.button": {
    screen: "Result summary, the consultation button itself",
    en: %%LANG:c3JjL2xpYi9jb250ZW50L25hcnJhdGl2ZS1jb3B5LnRzOjpOQVJSQVRJVkVfQ09QWS5uYXJyYXRpdmUuY3RhLmJ1dHRvbg:EN%%,
    th: %%LANG:c3JjL2xpYi9jb250ZW50L25hcnJhdGl2ZS1jb3B5LnRzOjpOQVJSQVRJVkVfQ09QWS5uYXJyYXRpdmUuY3RhLmJ1dHRvbg:TH%%,
  },
} as const satisfies Record<string, CopyEntry>;

export type NarrativeCopyKey = keyof typeof NARRATIVE_COPY;
