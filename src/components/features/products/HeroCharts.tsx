"use client";

/**
 * The EU Fit Check hero's two charts, side by side. Added 26/10/2026, Paul's
 * call: the first screen shows what the free check gives and what the paid Fit
 * Report gives, so the upgrade is visible before anyone scrolls. The button
 * above still starts the free check; the full chart only links to its page.
 *
 * Both are examples with invented numbers, and `SAMPLE_NOTE` says so once
 * under the pair.
 */

import Link from "next/link";
import { useCopy } from "@/components/LocaleProvider";
import SpiderChart from "@/components/features/chart/SpiderChart";
import FullSampleChart from "@/components/features/products/FullSampleChart";
import { SAMPLE_NOTE } from "@/lib/content/home";
import { FULL_CTA, HERO_FREE_LABEL, HERO_FULL_LABEL, HERO_SAMPLE_SCORES } from "@/lib/content/products";

export default function HeroCharts() {
  const { t, pick, path } = useCopy();

  return (
    <div className="mt-12">
      <div className="grid gap-6 large:grid-cols-2">
        <div>
          <span className="inline-flex rounded-full bg-canvas-soft px-3 py-1 text-body-sm-strong text-ink-deep">
            {pick(HERO_FREE_LABEL)}
          </span>
          <div className="card-outlined mt-3 px-4 py-6 large:px-6">
            <h2 className="text-heading-sm text-ink-deep">{t("teaser.chart.heading")}</h2>
            <SpiderChart scores={HERO_SAMPLE_SCORES} variant="full" />
          </div>
        </div>
        <div>
          <span className="inline-flex rounded-full bg-canvas-brand px-3 py-1 text-body-sm-strong text-ink-deep">
            {pick(HERO_FULL_LABEL)}
          </span>
          <div className="card-outlined mt-3 px-4 py-6 large:px-6">
            <h2 className="text-heading-sm text-ink-deep">{t("dimension.employability")}</h2>
            <FullSampleChart />
          </div>
          <Link
            href={path("/products/fit-report")}
            className="group mt-3 inline-flex items-center gap-2 text-body-md-strong text-ink-deep underline underline-offset-4"
          >
            {pick(FULL_CTA)}
            <span aria-hidden className="duration-[350ms] ease-nav transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
      <p className="mt-3 text-body-medium text-on-surface-variant">{pick(SAMPLE_NOTE)}</p>
    </div>
  );
}
