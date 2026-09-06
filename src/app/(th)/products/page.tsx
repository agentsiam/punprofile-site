import type { Metadata } from "next";
import ProductIndex from "@/components/features/products/ProductIndex";
import { INDEX_HEADING, INDEX_INTRO } from "@/lib/content/products";
import { pageMetadata } from "@/lib/seo";

/**
 * `/products`, the catalogue page. Added 06/09/2026.
 *
 * **A server component holding its own metadata, and no `layout.tsx`.** The
 * pages that put metadata in a layout do it because the page itself is
 * `"use client"` and a client component cannot export `metadata`. A layout here
 * would wrap `products/[slug]` as well, which is five pages that already
 * generate their own, so the metadata lives on this file and the interactive
 * part is imported.
 *
 * **It is indexed, as of 06/09/2026.** It shipped `NOT_YET_INDEXED` for a few
 * hours, on the rule `/method` set: an unreviewed page is not a search result,
 * whatever it is about. Paul read the Thai back the same day, so the marker and
 * the `PUBLIC_ROUTES` entry in `seo.ts` moved together, which is the pairing
 * that keeps them from drifting apart.
 */
export const metadata: Metadata = pageMetadata({
  path: "/products",
  title: INDEX_HEADING,
  description: INDEX_INTRO,
});

export default function Page() {
  return <ProductIndex />;
}
