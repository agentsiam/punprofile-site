"use client";

/**
 * The way back to the cookie answer, in the footer beside the privacy link.
 * 04/11/2026.
 *
 * Withdrawing has to be as easy as agreeing was, so this is on every page the
 * footer is on rather than buried in the notice. It is a button and not a link
 * because there is no page to go to: it puts the question back on screen where
 * the reader already is, with both answers, and refusing from here also deletes
 * the cookies the tag has already written. `cookieConsent.ts` does that part.
 *
 * A client island inside a server footer, which is the smallest thing that can
 * carry an `onClick`. The footer's own comment says it is a server component on
 * purpose and that shipping JavaScript to render eleven links pays for nothing;
 * this ships a button, and the eleven links stay server-rendered.
 *
 * It renders nothing while there is nothing to ask about: no measurement ID, or
 * a privacy notice that does not describe the cookie yet. A control that opens
 * a question the site is not asking is a control that explains nothing.
 */

import { MAY_ASK_CONSENT } from "@/lib/analytics";
import { openConsentChoice } from "@/lib/cookieConsent";
import { COOKIE_CONSENT } from "@/lib/content/cookie-consent";
import { useCopy } from "@/components/LocaleProvider";

export default function CookieSettingsButton() {
  const { pick } = useCopy();

  if (!MAY_ASK_CONSENT) return null;

  return (
    <button
      type="button"
      onClick={openConsentChoice}
      className="underline underline-offset-4 duration-[350ms] ease-nav transition-colors hover:text-ink-deep"
    >
      {pick(COOKIE_CONSENT.settings)}
    </button>
  );
}
