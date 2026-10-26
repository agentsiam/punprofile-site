"use client";

/**
 * "The full version", on the EU Fit Check page. Added 26/10/2026.
 *
 * The free check gives four axes; the paid Fit Report gives every competency in
 * each area. This shows one area as the full report draws it, labelled as an
 * example, and links to the Fit Report page, which carries the way to buy.
 */

import Link from "next/link";
import { useCopy } from "@/components/LocaleProvider";
import Band from "@/components/Band";
import FullSampleChart from "@/components/features/products/FullSampleChart";
import { SECTION_HEADING } from "@/lib/content/footer";
import { SAMPLE_LABEL, SAMPLE_NOTE } from "@/lib/content/home";
import { FULL_CTA, FULL_HEADING, FULL_LEDE } from "@/lib/content/products";

export default function FullReportBand() {
  const { t, pick, locale, path } = useCopy();

  return (
    <Band block="B3" ground="soft" width="wide">
      <div className="grid items-center gap-10 large:grid-cols-[1fr_1.1fr] large:gap-16">
        <div>
          <h2 className={SECTION_HEADING(locale)}>{pick(FULL_HEADING)}</h2>
          <p className="mt-4 max-w-2xl text-body-large text-on-surface-variant">{pick(FULL_LEDE)}</p>
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
        <div>
          <span className="inline-flex rounded-full bg-canvas px-3 py-1 text-body-sm-strong text-ink-deep">
            {pick(SAMPLE_LABEL)}
          </span>
          <div className="card-plain mt-3 px-4 py-6 large:px-6 large:py-7">
            <h3 className="text-heading-sm text-ink-deep">{t("dimension.employability")}</h3>
            <FullSampleChart />
          </div>
          <p className="mt-3 text-body-medium text-on-surface-variant">{pick(SAMPLE_NOTE)}</p>
        </div>
      </div>
    </Band>
  );
}
