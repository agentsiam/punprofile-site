import type { Metadata } from "next";
import { METHOD_HEADING, METHOD_INTRO } from "@/lib/content/method";
import { pageMetadata } from "@/lib/seo";

/** `/en/method`. See `src/app/(en)/en/page.tsx` for why this file exists. */
export const metadata: Metadata = pageMetadata({
  path: "/method",
  title: METHOD_HEADING,
  description: METHOD_INTRO,
  locale: "en",
});

export { default } from "../../../(th)/method/page";
