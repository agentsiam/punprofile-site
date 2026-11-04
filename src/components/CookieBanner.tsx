"use client";

/**
 * The cookie question, and the two answers. 04/11/2026.
 *
 * It asks before the analytics cookie exists, which is the whole point:
 * `analytics.ts` defaults analytics storage to denied, this is what can change
 * that, and nothing is written to the device until somebody presses the filled
 * button. A reader who presses neither is a reader who refused, and the site
 * works the same either way, so there is nothing here that blocks the page.
 *
 * **Both answers are the same size.** A refusal that is harder to reach than an
 * acceptance is not freely given, which is the defect regulators name in most
 * banners on the web. So the two buttons share their height, their padding,
 * their shape and their type, and differ only as a filled button differs from
 * an outlined one, which is the design system's own pair of equals.
 *
 * **It renders nothing until it has read the cookie.** The store answers
 * `unknown` on the server and on the first client render, so the server HTML
 * and the first paint agree and a reader who answered months ago never sees
 * this flash past. The read happens in the effect below, which is where
 * `navLock.ts` says a read of something outside React belongs.
 *
 * **It is inside `NavLockGate` in the shell**, so it does not appear during an
 * assessment, for the reason the menu and the footer are hidden there: nothing
 * belongs over that flow. The consequence is that a candidate who has not
 * answered elsewhere stays denied for the whole assessment, which is the
 * stronger side of the promise US-001 makes about their device.
 *
 * It is not a modal. R29 puts a modal at `level-3` and over a scrim; this is a
 * sheet at `level-2`, the page scrolls behind it, and every link stays live.
 */

import { useEffect } from "react";
import { useSyncExternalStore } from "react";
import { MAY_ASK_CONSENT } from "@/lib/analytics";
import {
  getConsent,
  getConsentServer,
  initConsent,
  settleConsent,
  subscribeConsent,
} from "@/lib/cookieConsent";
import { COOKIE_CONSENT } from "@/lib/content/cookie-consent";
import { useCopy } from "@/components/LocaleProvider";

export default function CookieBanner() {
  const state = useSyncExternalStore(subscribeConsent, getConsent, getConsentServer);
  const { locale, path, pick, t } = useCopy();

  useEffect(() => {
    if (MAY_ASK_CONSENT) initConsent();
  }, []);

  if (!MAY_ASK_CONSENT || state !== "asking") return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-body"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-canvas shadow-level-2"
    >
      <div className="page-container flex flex-col gap-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] expanded:flex-row expanded:items-center expanded:justify-between expanded:gap-8">
        <p
          id="cookie-consent-body"
          className="max-w-2xl text-body-medium leading-relaxed text-body"
        >
          {pick(COOKIE_CONSENT.body)}{" "}
          <a
            href={path("/privacy")}
            className="underline underline-offset-4 duration-[350ms] ease-nav transition-colors hover:text-ink-deep"
          >
            {t("consent.privacyLink")}
          </a>
        </p>

        {/* The order is refusal first in the markup and in the tab order, and
            the filled one second. Reading order on a phone puts them in a
            column, where the first thing under the question should not be the
            answer this site would prefer. */}
        {/* `grow` with `whitespace-nowrap` is what keeps the two the same
            size. Without it the longer label wrapped inside a squeezed button
            and the refusal came out half again as tall as the acceptance,
            measured at 74px against 48px, which is the exact inequality this
            banner is built to avoid. On a phone they share the row; from
            `expanded` they take their own width side by side. */}
        <div
          className="flex w-full shrink-0 flex-wrap gap-3 expanded:w-auto"
          lang={locale}
        >
          <button
            type="button"
            onClick={() => settleConsent("denied")}
            className="flex min-h-12 grow items-center justify-center whitespace-nowrap rounded-full border border-line-strong px-6 text-body-md-strong duration-[350ms] ease-nav transition-colors hover:bg-primary-pale expanded:grow-0"
          >
            {pick(COOKIE_CONSENT.reject)}
          </button>
          <button
            type="button"
            onClick={() => settleConsent("granted")}
            className="flex min-h-12 grow items-center justify-center whitespace-nowrap rounded-full bg-primary px-6 text-body-md-strong text-on-primary duration-[350ms] ease-nav transition-colors hover:bg-primary-active expanded:grow-0"
          >
            {pick(COOKIE_CONSENT.accept)}
          </button>
        </div>
      </div>
    </div>
  );
}
