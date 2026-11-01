import type { Metadata } from "next";
import { FAQ_HEADING, FAQ_INTRO } from "@/lib/content/faq";
import JsonLd from "@/components/JsonLd";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import FaqPage from "../../../(th)/faq/page";

/** `/en/faq`. See `src/app/(en)/en/page.tsx` for why this file exists. */
export const metadata: Metadata = pageMetadata({
  path: "/faq",
  title: FAQ_HEADING,
  description: FAQ_INTRO,
  locale: "en",
});

// Not a bare re-export like its siblings: the Thai tree's FAQPage markup sits
// on `(th)/faq/layout.tsx`, which does not wrap this route, so the English
// markup is emitted here.
export default function EnFaqPage() {
  return (
    <>
      <JsonLd data={faqJsonLd("en")} />
      <FaqPage />
    </>
  );
}
