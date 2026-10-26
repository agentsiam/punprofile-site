"use client";

/**
 * "The full version", on the EU Fit Check page. Added 26/10/2026.
 *
 * The free check gives four axes; the paid Fit Report gives every competency in
 * each area. Since 26/10/2026 the example chart sits in the hero beside the
 * free one, so this band is the words: what the full version adds, and the
 * link to the Fit Report page, which carries the way to buy.
 */

import Link from "next/link";
import { useCopy } from "@/components/LocaleProvider";
import Band from "@/components/Band";
import { SECTION_HEADING } from "@/lib/content/footer";
import { FULL_CTA, FULL_HEADING, FULL_LEDE } from "@/lib/content/products";

export default function FullReportBand() {
  const { pick, locale, path } = useCopy();

  return (
    <Band block="B3" ground="canvas" width="wide">
      <div className="max-w-3xl">
        <h2 className={SECTION_HEADING(locale)}>{pick(FULL_HEADING)}</h2>
        <p className="mt-4 text-body-large text-on-surface-variant">{pick(FULL_LEDE)}</p>
        <Link
          href={path("/products/fit-report")}
          className="group mt-6 inline-flex items-center gap-2 text-body-md-strong text-ink-deep underline underline-offset-4"
        >
          {pick(FULL_CTA)}
          <span aria-hidden className="duration-[350ms] ease-nav transition-transform group-hover:translate-x-1">
            &rarr;
          </span>
        </Link>
      </div>
    </Band>
  );
}
