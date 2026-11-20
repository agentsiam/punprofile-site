import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { FAQ_SEARCH, FAQ_TITLE } from "@/lib/content/search";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

/** See `services/layout.tsx` for why a layout carries this. */
export const metadata: Metadata = pageMetadata({
  path: "/faq",
  // Was the visible heading and intro. Both are right on the page and wrong
  // in a result: the heading named no subject and the intro is 44 characters.
  // 20/11/2026.
  title: FAQ_TITLE,
  description: FAQ_SEARCH,
});

// The FAQPage markup is emitted here, a server component, rather than in the
// client page, so the content modules `seo.ts` imports stay out of its bundle.
export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={faqJsonLd("th")} />
      {children}
    </>
  );
}
