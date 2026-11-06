/**
 * TASK-007: PII scrubbing shared by all three Sentry runtimes.
 *
 * The assessment flow handles a full name, email, phone and LINE ID, so an
 * error thrown from inside a form can carry candidate contact data in its
 * message, its breadcrumbs or the request body. Everything here strips
 * aggressively and accepts false positives: losing a digit string from an error
 * report is cheap, leaking a candidate's phone number to a third-party service
 * is not. TASK-041 later verifies this against real assessment-flow errors, not
 * just synthetic ones.
 *
 * Names and LINE IDs have no pattern, so no regex can catch them. They are
 * covered only by the wholesale deletions below (`user`, `request.data`,
 * `extra`, breadcrumb `data`), which is where form values actually live. The
 * gap that leaves is an identity interpolated into an error string, so: never
 * put a candidate's name, LINE ID or email into a thrown message. Refer to a
 * lead by its document id.
 */

import type { ErrorEvent } from "@sentry/nextjs";

/** DSNs are client-visible by design; env var wins so a rotation needs no deploy. */
export const SENTRY_DSN =
  process.env.NEXT_PUBLIC_SENTRY_DSN ??
  "https://88f97116f6fadca8b3b67c88ecdb82ee@o4511852989841408.ingest.de.sentry.io/4511852996919376";

const EMAIL = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/gi;
// 8+ digit runs with common separators: catches Thai mobiles and EU numbers.
const PHONE = /\+?\d[\d\s().-]{6,}\d/g;

const clean = (s: string) => s.replace(EMAIL, "[email]").replace(PHONE, "[number]");

export function scrubEvent(event: ErrorEvent): ErrorEvent {
  // Identity blocks are dropped wholesale, not cleaned.
  delete event.user;
  if (event.request) {
    delete event.request.cookies;
    delete event.request.headers;
    delete event.request.data;
  }
  delete event.extra;

  if (event.message) event.message = clean(event.message);
  for (const ex of event.exception?.values ?? []) {
    if (ex.value) ex.value = clean(ex.value);
  }
  for (const b of event.breadcrumbs ?? []) {
    if (b.message) b.message = clean(b.message);
    // Breadcrumb data can carry form values (input events, fetch bodies).
    delete b.data;
  }
  return event;
}

/**
 * Browser-only noise filter, added 06/11/2026 after issue JAVASCRIPT-NEXTJS-17.
 *
 * That issue was an `InvalidAccessError` on `/efc-assessment` whose entire
 * stack belonged to a visitor's own browser extension: `mutationObserverCallback`
 * to `logLoginFieldDetected` to `sendPostMessage` to `dispatchToBridge`, a login
 * field scanner relaying what it found to its background worker. None of those
 * symbols exist in this repo, nothing here constructs a `MutationObserver` or
 * calls `postMessage`, and the served HTML loads no script that is not ours.
 * Sentry saw it only because the browser SDK hooks `onunhandledrejection`
 * globally, which means every extension crash in every visitor's browser bills
 * to the free tier and pages whoever is on the alert.
 *
 * The test is the frame filename. `rewriteFrames` turns a same-origin script
 * into `app:///…`, and our own code is always under `/_next/`, because that is
 * where Next serves every chunk. A script injected into the page inherits the
 * document's URL instead and arrives as `app:///blog/<slug>:1:4222`, with no
 * `/_next/` anywhere in the stack; an extension that keeps its own origin
 * arrives as `chrome-extension://…`. Neither has an app frame.
 *
 * Deliberately not `thirdPartyErrorFilterIntegration`: that decides by module
 * metadata the bundler plugin injects, so if the injection ever stops working
 * under Turbopack no frame looks like ours any more and the SDK drops
 * *everything*, silently. This fails the other way, and for the same reason an
 * event carrying no frames at all is kept rather than guessed at.
 *
 * Browser only. Server and edge frames live under `/var/task/` and `.next/server/`,
 * so wiring this into those runtimes would drop every error they report.
 */
const APP_FRAME = /\/_next\//;

export function isThirdPartyBrowserEvent(event: ErrorEvent): boolean {
  const frames = (event.exception?.values ?? []).flatMap(
    (value) => value.stacktrace?.frames ?? [],
  );
  if (frames.length === 0) return false;
  return !frames.some((frame) => APP_FRAME.test(frame.filename ?? ""));
}
