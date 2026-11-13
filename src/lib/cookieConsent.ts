/**
 * The reader's answer about the analytics cookie, and the only place it is
 * written or read. 04/11/2026.
 *
 * A one-value external store in the shape `navLock.ts` already uses here, and
 * for the same structural reason: the banner is rendered by the shell, above
 * `<main>`, and the control that reopens it sits in the footer, so the two are
 * siblings that cannot reach each other through context without lifting the
 * shell into a client provider.
 *
 * ---------------------------------------------------------------------------
 * WHY THE ANSWER IS A COOKIE AND NOT localStorage
 * ---------------------------------------------------------------------------
 *
 * The Google tag has to know the answer before it loads, inside the inline
 * script in `analytics.ts`, because consent that arrives after the tag is
 * consent the tag has already decided without. An inline script can read
 * `document.cookie` synchronously. It cannot read anything that needs a module
 * to load first.
 *
 * Storing the answer itself needs no consent under either regime: it is the
 * record of a choice the reader made, it is read by nothing but this site, and
 * without it the only alternative is asking the same person on every page.
 *
 * Six months, then the question comes back. A permission that never expires is
 * a permission nobody remembers giving, and re-asking twice a year is the
 * interval the French regulator recommends and the one most of the EU follows.
 *
 * ---------------------------------------------------------------------------
 * WHAT "DENIED" HAS TO ACTUALLY DO
 * ---------------------------------------------------------------------------
 *
 * Withdrawal that leaves the cookies on the device is not withdrawal. So
 * `settleConsent` tells the tag, writes the answer, and on a refusal deletes
 * what the tag already wrote: `_ga` and `_ga_<measurement id>`, both of which
 * the tag writes from JavaScript, which is also why this file can remove them.
 *
 * A cookie is deleted by its name, path and domain together, and the tag writes
 * its own on the registrable domain rather than the exact host. Nothing in the
 * browser will say which domain a cookie came from, so the expiry is written
 * for every candidate: the host, the host with a leading dot, and the last two
 * labels of it with a leading dot. Expiring a cookie that does not exist costs
 * nothing and reports nothing, so trying all three is cheaper than being
 * clever about which one is real.
 */

export const CONSENT_COOKIE = "pp_analytics_consent";

/** Six months, in seconds. */
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 182;

/** What the reader can have said. */
export type ConsentChoice = "granted" | "denied";

/**
 * `unknown` is the server's answer and the first client render's, because the
 * cookie is not read until the banner mounts. It renders nothing, which is what
 * keeps the server and the client agreeing and stops the banner flashing in
 * front of somebody who answered months ago. `asking` is the banner on screen.
 */
export type ConsentState = "unknown" | "asking" | ConsentChoice;

let state: ConsentState = "unknown";
const listeners = new Set<() => void>();

const publish = (next: ConsentState): void => {
  if (state === next) return;
  state = next;
  for (const fn of listeners) fn();
};

export function subscribeConsent(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getConsent(): ConsentState {
  return state;
}

export function getConsentServer(): ConsentState {
  return "unknown";
}

/** The stored answer, or null when this reader has not been asked yet. */
export function readStoredConsent(): ConsentChoice | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE}=(granted|denied)(?:;|$)`),
  );
  return match ? (match[1] as ConsentChoice) : null;
}

/**
 * Called once from the banner's own effect, which is the sanctioned place for a
 * read of something outside React, the same way the assessment publishes the
 * nav lock from an effect.
 */
export function initConsent(): void {
  publish(readStoredConsent() ?? "asking");
}

/** The footer control. Puts the question back on screen with both answers. */
export function openConsentChoice(): void {
  publish("asking");
}

const domainsFor = (host: string): string[] => {
  const labels = host.split(".");
  const registrable = labels.length > 2 ? labels.slice(-2).join(".") : host;
  return [host, `.${host}`, `.${registrable}`];
};

const deleteGoogleCookies = (): void => {
  for (const pair of document.cookie.split(";")) {
    const name = pair.split("=")[0]?.trim();
    if (!name || !name.startsWith("_ga")) continue;
    for (const domain of domainsFor(location.hostname)) {
      document.cookie = `${name}=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
};

/**
 * The answer, in the order that matters: the tag is told first, so nothing is
 * written to the device after this returns on a refusal and nothing is missed
 * on an acceptance, then the answer is stored, then the device is cleaned up.
 */
export function settleConsent(choice: ConsentChoice): void {
  window.gtag?.("consent", "update", { analytics_storage: choice });

  const secure = location.protocol === "https:" ? "; secure" : "";
  document.cookie =
    `${CONSENT_COOKIE}=${choice}; path=/; max-age=${CONSENT_MAX_AGE}; samesite=lax${secure}`;

  if (choice === "denied") deleteGoogleCookies();

  publish(choice);
}
