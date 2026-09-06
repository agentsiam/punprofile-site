import type { Metadata } from "next";
import { METHOD_HEADING, METHOD_INTRO } from "@/lib/content/method";
import { pageMetadata } from "@/lib/seo";

/**
 * See `faq/layout.tsx` for why a layout carries this rather than the page.
 *
 * **Indexed as of 06/09/2026.** It carried `NOT_YET_INDEXED` from the day it
 * shipped, on one condition: until the Thai on this page is read back. Paul
 * read back all twenty-five of its strings that day, in the pass that emptied
 * `thai-review-queue.md` across every module, rewriting ten of them. The marker
 * and the `PUBLIC_ROUTES` entry in `seo.ts` came off together, because they are
 * one decision and drift apart if they are made on different days.
 */
export const metadata: Metadata = pageMetadata({
  path: "/method",
  title: METHOD_HEADING,
  description: METHOD_INTRO,
});

export default function MethodLayout({ children }: { children: React.ReactNode }) {
  return children;
}
