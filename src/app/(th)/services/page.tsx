import type { Metadata } from "next";
import ServicesPage from "@/components/features/services/ServicesPage";
import { SERVICES_PAGE_HEADING, SERVICES_PAGE_INTRO } from "@/lib/content/services";
import { pageMetadata } from "@/lib/seo";

/**
 * `/services`, restored 06/09/2026. See the header of `services.ts`.
 *
 * **It is indexed, as of 06/09/2026.** It shipped `NOT_YET_INDEXED`, which is
 * the arrangement `/method` and the four unbuilt product pages use, and the
 * condition was the `TH-UNREVIEWED` markers rather than the page. Paul read the
 * Thai back the same day, so the marker and the `PUBLIC_ROUTES` entry in
 * `seo.ts` came off together: they are one decision and they drift apart if
 * they are made on different days.
 */
export const metadata: Metadata = pageMetadata({
  path: "/services",
  title: SERVICES_PAGE_HEADING,
  description: SERVICES_PAGE_INTRO,
});

export default function Page() {
  return <ServicesPage />;
}
