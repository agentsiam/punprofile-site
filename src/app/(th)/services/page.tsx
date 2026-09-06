import type { Metadata } from "next";
import ServicesPage from "@/components/features/services/ServicesPage";
import { SERVICES_PAGE_HEADING, SERVICES_PAGE_INTRO } from "@/lib/content/services";
import { NOT_YET_INDEXED, pageMetadata } from "@/lib/seo";

/**
 * `/services`, restored 06/09/2026. See the header of `services.ts`.
 *
 * `NOT_YET_INDEXED` until the Thai written for this page is read back, which is
 * the arrangement `/method` and the four unbuilt product pages already use. It
 * comes off with the `TH-UNREVIEWED` markers, at which point the route joins
 * `PUBLIC_ROUTES` in `seo.ts`. Both are the same decision and drift apart if
 * they are made on different days.
 */
export const metadata: Metadata = {
  ...pageMetadata({
    path: "/services",
    title: SERVICES_PAGE_HEADING,
    description: SERVICES_PAGE_INTRO,
  }),
  ...NOT_YET_INDEXED,
};

export default function Page() {
  return <ServicesPage />;
}
