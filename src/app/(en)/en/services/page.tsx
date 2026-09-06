import type { Metadata } from "next";
import { SERVICES_PAGE_HEADING, SERVICES_PAGE_INTRO } from "@/lib/content/services";
import { pageMetadata } from "@/lib/seo";

/** `/en/services`. See `src/app/(en)/en/page.tsx` for why this file exists. */
export const metadata: Metadata = pageMetadata({
  path: "/services",
  title: SERVICES_PAGE_HEADING,
  description: SERVICES_PAGE_INTRO,
  locale: "en",
});

export { default } from "../../../(th)/services/page";
