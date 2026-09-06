import type { Metadata } from "next";
import { INDEX_HEADING, INDEX_INTRO } from "@/lib/content/products";
import { pageMetadata } from "@/lib/seo";

/** `/en/products`. See `src/app/(en)/en/page.tsx` for why this file exists. */
export const metadata: Metadata = pageMetadata({
  path: "/products",
  title: INDEX_HEADING,
  description: INDEX_INTRO,
  locale: "en",
});

export { default } from "../../../(th)/products/page";
