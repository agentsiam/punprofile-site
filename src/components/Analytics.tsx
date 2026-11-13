/**
 * The Google tag, and nothing else. 03/11/2026.
 *
 * A server component with no `"use client"`, for the same reason `JsonLd` is
 * one: the script has to be in the HTML the browser parses rather than written
 * in by React after hydration. Here that is not about crawlers but about order.
 * The consent defaults inside it are only worth anything if they run before the
 * Google tag loads, and a script in the document runs when the parser reaches
 * it, which is before any of this app's own code.
 *
 * It renders nothing at all without a measurement ID, which is the state the
 * repo ships in: `analytics.ts` holds the variable and what it costs to set it.
 *
 * Mounted by the two public root layouts and not by `(private)`, which is the
 * whole of how `/admin` and `/me` are kept out of GA4. `/admin/leads/[id]`
 * carries a lead's own id in its URL, and a page URL is the one thing sent to
 * Google, so a coach working through the CRM would otherwise be sending Google
 * a list of candidate identifiers. Neither screen has an audience to measure:
 * one is read by the founder and the other by a candidate who has already paid.
 */

import { GA_MEASUREMENT_ID, gaBootstrap } from "@/lib/analytics";
import AnalyticsRouteViews from "./AnalyticsRouteViews";

export default function Analytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: gaBootstrap(GA_MEASUREMENT_ID) }} />
      <AnalyticsRouteViews />
    </>
  );
}
