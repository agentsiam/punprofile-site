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
 * It is in `PUBLIC_ROUTES` and carries no `NOT_YET_INDEXED`, unlike the four
 * unbuilt product pages: this page is about the catalogue rather than about any
 * one product in it, so it is not thin whichever of them has shipped.
 */
export const metadata: Metadata = pageMetadata({
  path: "/products",
  title: INDEX_HEADING,
  description: INDEX_INTRO,
});

export default function Page() {
  return <ProductIndex />;
}
