// TASK-007, browser runtime. Loaded automatically by Next.js.
import * as Sentry from "@sentry/nextjs";
import { SENTRY_DSN, isThirdPartyBrowserEvent, scrubEvent } from "./src/lib/scrub";

Sentry.init({
  dsn: SENTRY_DSN,
  // Error tracking only: tracing off keeps the free tier roomy and the
  // client bundle lean. PRD scope is "catch production issues", not APM.
  tracesSampleRate: 0,
  sendDefaultPii: false,
  // Drop a visitor's extension crashes before scrubbing rather than after:
  // they are thrown by code this repo does not ship and cannot fix, and an
  // event that is going nowhere is not worth cleaning. Browser only, and
  // `isThirdPartyBrowserEvent` says why.
  beforeSend: (event) => (isThirdPartyBrowserEvent(event) ? null : scrubEvent(event)),
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
