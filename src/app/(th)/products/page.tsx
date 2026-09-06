import type { Metadata } from "next";
import ProductIndex from "@/components/features/products/ProductIndex";
import { INDEX_HEADING, INDEX_INTRO } from "@/lib/content/products";
import { NOT_YET_INDEXED, pageMetadata } from "@/lib/seo";

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
 * `NOT_YET_INDEXED` until the Thai written for this page is read back, which is
 * the arrangement `/method` and `/services` use and the four unbuilt product
 * pages use for their own separate reason.
 *
 * It shipped without the marker for an hour, on the reasoning that this page is
 * about the catalogue rather than about any one product in it, so it is not
 * thin whichever of them has shipped. That is true and it is the wrong test:
 * thinness is why a `soon` PRODUCT page is not a search result, and unread Thai
 * is why `/method` is not one. This page fails the second test, and it carries
 * more unread Thai than `/services`, which was gated the same afternoon.
 *
 * Both come off together, with the `PUBLIC_ROUTES` entry in `seo.ts`.
 */
export const metadata: Metadata = {
  ...pageMetadata({
    path: "/products",
    title: INDEX_HEADING,
    description: INDEX_INTRO,
  }),
  ...NOT_YET_INDEXED,
};

export default function Page() {
  return <ProductIndex />;
}
