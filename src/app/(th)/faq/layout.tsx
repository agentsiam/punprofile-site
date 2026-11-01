import type { Metadata } from "next";
import { FAQ_HEADING, FAQ_INTRO } from "@/lib/content/faq";
import JsonLd from "@/components/JsonLd";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

/** See `services/layout.tsx` for why a layout carries this. */
export const metadata: Metadata = pageMetadata({
  path: "/faq",
  title: FAQ_HEADING,
  description: FAQ_INTRO,
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
