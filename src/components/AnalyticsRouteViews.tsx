"use client";

/**
 * A page view for every navigation after the first. 03/11/2026.
 *
 * The Google tag counts the page it loaded on and nothing after it. Every link
 * inside this app is a client-side navigation, which replaces the page without
 * loading a document, so without this the whole site reads in GA4 as a landing
 * page nobody ever moved off.
 *
 * The first run sends nothing, because `gaBootstrap` has already had the tag
 * count that page, and a second event for it would double every landing.
 *
 * `usePathname` and not `useSearchParams`, for the reason the assessment page
 * states where it reads the campaign tags off `location` by hand: taking the
 * search params through a hook opts the whole route into a Suspense boundary.
 * `location.href` carries the query string anyway, so nothing is lost but the
 * case of a navigation that changes only the query string, which inside this
 * app is a filter rather than a page.
 *
 * `set` before `event`, because `page_location` left in the tag's configuration
 * is the location of the page that loaded the document, and any
 * enhanced-measurement event the GA4 property is switched on to collect would
 * otherwise report a scroll on this page against the previous page's URL.
 */

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gaPagePath } from "@/lib/analytics";

export default function AnalyticsRouteViews() {
  const pathname = usePathname();
  const landed = useRef(true);

  useEffect(() => {
    if (landed.current) {
      landed.current = false;
      return;
    }

    const location =
      window.location.origin + gaPagePath(window.location.pathname) + window.location.search;

    // Optional chaining rather than an assertion: the tag is appended by an
    // inline script and a reader behind a filter that blocks it still gets a
    // working app, which is the degradation rule FR-015 asks for.
    window.gtag?.("set", { page_location: location });
    window.gtag?.("event", "page_view", {
      page_location: location,
      // Read at effect time, so a title Next has not finished applying arrives
      // as the previous page's. The URL is the field every report groups by and
      // it is always the new one.
      page_title: document.title,
    });
  }, [pathname]);

  return null;
}
