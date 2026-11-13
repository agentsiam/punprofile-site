/**
 * Google Analytics 4, and the consent state it runs under. 03/11/2026.
 *
 * `prd.md` in the sibling repo names PostHog as this product's analytics and
 * FR-015 lists the funnel events it would carry. PostHog was never installed:
 * it appears in `README.md` and `.env.example` and in no code, so until today
 * nothing measured traffic at all. GA4 is what this file loads, on Paul's call,
 * and the PRD's two standing constraints on analytics are carried over rather
 * than dropped with the product they named. No personal data reaches an
 * analytics product, and analytics is never a hard dependency of the
 * assessment: nothing here throws, and an unset measurement ID renders nothing.
 *
 * ---------------------------------------------------------------------------
 * THE READER GRANTS ANALYTICS STORAGE, OR NOBODY DOES
 * ---------------------------------------------------------------------------
 *
 * Paul's call, 04/11/2026: the analytics cookie is asked for. It replaces the
 * route decided a day earlier, where the notice was rewritten to describe the
 * cookie and the cookie was set without asking. A notice is not consent.
 * Article 5(3) of the ePrivacy Directive wants consent before a non-essential
 * cookie is stored, this audience is Thai nationals living in Europe, and the
 * banner is what makes the cookie lawful for most of the people it lands on.
 *
 * So this file never decides to grant. Three things have to line up, and the
 * default is denied whenever any of them is missing.
 *
 * 1. A measurement ID exists.
 * 2. `PRIVACY_COVERS_ANALYTICS` in `privacy.ts` is true, meaning the published
 *    notice describes the analytics cookie. Consent that is not informed is not
 *    consent, so until the notice says what the cookie does, nobody is asked
 *    and nothing is granted. `MAY_ASK_CONSENT` below is those two together.
 * 3. This reader answered yes, which is a cookie `cookieConsent.ts` writes and
 *    the inline script below reads before the tag loads.
 *
 * Denied is not off. Consent Mode sends cookieless pings, so page and event
 * counts arrive from a refusal exactly as they did before any of this, and what
 * a refusal costs is identity: no client ID is persisted, so one person
 * arriving twice is two people and every user, session and retention figure is
 * a restatement of the page count.
 *
 * The two advertising signals stay denied for everyone, consent or not. This
 * site carries no advertising and runs no remarketing, so there is nothing for
 * a reader to agree to and nothing to ask about.
 *
 * The assessment is the one surface that never asks. `CookieBanner` sits inside
 * `NavLockGate` like the menu and the footer, so mid-assessment the question
 * does not appear, which leaves analytics storage denied until the candidate is
 * out of the flow. US-001's promise that nothing identifies them on their own
 * device therefore holds throughout the assessment for anyone who has not
 * already said yes elsewhere on the site.
 *
 * ---------------------------------------------------------------------------
 * WHAT IS DELIBERATELY NOT HERE
 * ---------------------------------------------------------------------------
 *
 * No `anonymize_ip`. It was a Universal Analytics parameter, the string does
 * not appear anywhere in the current `gtag/js` bundle, and GA4 has no
 * equivalent switch because it does not log IP addresses.
 *
 * No `user_id`, and no event properties from this repo at all. Email, phone and
 * LINE ID are personal data under the PDPA and the PRD forbids them reaching an
 * analytics product. The one thing sent beyond Google's defaults is the page
 * URL, and `gaPagePath` is what keeps a secret out of it.
 */

import { PRIVACY_COVERS_ANALYTICS } from "./content/privacy";
import { CONSENT_COOKIE } from "./cookieConsent";

/**
 * The GA4 measurement ID, from the property's own Data Streams screen.
 *
 * `NEXT_PUBLIC_` because the browser is what sends to GA4, and Next inlines
 * every `NEXT_PUBLIC_` value at build time, so setting it on the Vercel project
 * takes effect on the next deploy and not on save.
 *
 * A GTM container ID or an old Universal Analytics property ID in this variable
 * would load a tag that silently collects nothing, which is a failure nobody
 * notices for a month, so the shape is checked rather than trusted. The check
 * is also what makes the value safe to interpolate into the inline script
 * below: a validated ID cannot carry a `</script>` sequence.
 */
const CONFIGURED_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

export const GA_MEASUREMENT_ID = /^G-[A-Z0-9]+$/.test(CONFIGURED_MEASUREMENT_ID)
  ? CONFIGURED_MEASUREMENT_ID
  : "";

if (
  CONFIGURED_MEASUREMENT_ID &&
  !GA_MEASUREMENT_ID &&
  process.env.NODE_ENV !== "production"
) {
  console.warn(
    `NEXT_PUBLIC_GA_MEASUREMENT_ID is "${CONFIGURED_MEASUREMENT_ID}", which is not a GA4 measurement ID. It reads as G- followed by the property's own characters, and no tag was loaded.`,
  );
}

/**
 * Whether a reader may be asked about the analytics cookie at all.
 *
 * `CookieBanner` and the footer control both read this and render nothing while
 * it is false, which is the state the repo ships in: no measurement ID, and a
 * notice that does not yet describe the cookie. One owner for the question, so
 * the banner and the footer cannot disagree about whether there is anything to
 * ask.
 */
export const MAY_ASK_CONSENT = Boolean(GA_MEASUREMENT_ID) && PRIVACY_COVERS_ANALYTICS;

/**
 * The advertising half of the consent state, denied for everyone.
 *
 * Consent Mode v2 reads all four signals and these three never move, so they
 * are stated once here. The fourth, `analytics_storage`, is not a build-time
 * value at all: it is this reader's own answer, read out of their cookie by the
 * inline script below.
 */
const GA_ADS_CONSENT = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
} as const;

/**
 * The one path on this site whose URL is a secret.
 *
 * `/unsubscribe/<token>` and `/en/unsubscribe/<token>` carry a per-person token
 * in the path itself, and a page URL is the one thing this file does send to
 * Google. Reported verbatim it would hand Google a working unsubscribe link for
 * a named person, so the token is replaced by its own name before anything is
 * sent. The pattern is held as a string rather than a literal because the
 * inline bootstrap needs the same rule and two copies of it would drift.
 */
const SECRET_PATH = "^(\\/en)?\\/unsubscribe\\/.+$";
const SECRET_PATH_REDACTED = "$1/unsubscribe/[token]";

/** A path safe to report. Every other route on the site passes through as it is. */
export const gaPagePath = (pathname: string): string =>
  pathname.replace(new RegExp(SECRET_PATH), SECRET_PATH_REDACTED);

/**
 * What the inline script sets `analytics_storage` to, as JavaScript source.
 *
 * While the notice does not describe the cookie this is the literal `'denied'`,
 * so the shipped page says so in as many words and no cookie this site wrote
 * can change it. Once the notice covers it, the reader's own answer decides,
 * read straight off `document.cookie` because the tag has to know before it
 * loads. An unanswered reader is denied, which is what makes the banner's
 * appearance the only thing that can grant anything.
 */
const ANALYTICS_DEFAULT = PRIVACY_COVERS_ANALYTICS
  ? `/(?:^|;\\s*)${CONSENT_COOKIE}=granted(?:;|$)/.test(document.cookie) ? 'granted' : 'denied'`
  : `'denied'`;

/**
 * The inline script that starts the tag, in the one order that works.
 *
 * Consent defaults have to be set before the Google tag loads or the tag has
 * already decided it may write a cookie, so this appends `gtag/js` itself at
 * the end rather than leaving the loader to `next/script`. A separate
 * `<Script>` with its own strategy would be a second thing whose execution
 * order relative to this one has to be reasoned about on every Next upgrade;
 * one script that does both cannot be got wrong. It is appended `async`, so it
 * neither blocks paint nor delays hydration, and calls queued in `dataLayer`
 * before it arrives are replayed when it does.
 *
 * `page_location` is set here rather than left to the tag's own reading of the
 * address bar, because the tag's reading would include an unsubscribe token.
 * Setting it in `config` covers the automatic first page view and every
 * enhanced-measurement event the GA4 property may be switched to collect, none
 * of which this repo can see or control.
 */
export const gaBootstrap = (measurementId: string): string => `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
var consent = ${JSON.stringify(GA_ADS_CONSENT)};
consent.analytics_storage = ${ANALYTICS_DEFAULT};
gtag('consent', 'default', consent);
gtag('js', new Date());
gtag('config', '${measurementId}', {
  page_location: location.origin
    + location.pathname.replace(new RegExp(${JSON.stringify(SECRET_PATH)}), ${JSON.stringify(SECRET_PATH_REDACTED)})
    + location.search
});
(function(){
  var tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=${measurementId}';
  document.head.appendChild(tag);
})();
`;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
