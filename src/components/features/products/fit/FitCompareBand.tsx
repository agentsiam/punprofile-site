"use client";

/**
 * What the free check gives beside what the Fit Report gives. Added 28/10/2026.
 *
 * The research for this page (product-page-fit-report.md) found the upgrade
 * sold as a picture first: the smaller result beside the full one. The two
 * charts are the EU Fit Check hero's own, so a reader who came from there sees
 * the same pair; the table under them carries the rest.
 */

import { useCopy } from "@/components/LocaleProvider";
import Band from "@/components/Band";
import SpiderChart from "@/components/features/chart/SpiderChart";
import FullSampleChart from "@/components/features/products/FullSampleChart";
import { SECTION_HEADING } from "@/lib/content/footer";
import { SAMPLE_NOTE } from "@/lib/content/home";
import {
  FIT_COMPARE_HEADING,
  FIT_COMPARE_ROWS,
  HERO_FREE_LABEL,
  HERO_FULL_LABEL,
  HERO_SAMPLE_SCORES,
  PRODUCTS,
} from "@/lib/content/products";

export default function FitCompareBand() {
  const { t, pick, locale } = useCopy();
  const free = PRODUCTS.find((p) => p.slug === "eu-fit-check")!;
  const full = PRODUCTS.find((p) => p.slug === "fit-report")!;

  return (
    <Band block="B3" ground="soft" width="wide">
      <h2 className={SECTION_HEADING(locale)}>{pick(FIT_COMPARE_HEADING)}</h2>

      <div className="mt-10 grid gap-6 large:grid-cols-2">
        <div>
          <span className="inline-flex rounded-full bg-canvas px-3 py-1 text-body-sm-strong text-ink-deep">
            {pick(HERO_FREE_LABEL)}
          </span>
          <div className="card-outlined mt-3 bg-canvas px-4 py-6 large:px-6">
            <h3 className="text-heading-sm text-ink-deep">{t("teaser.chart.heading")}</h3>
            <SpiderChart scores={HERO_SAMPLE_SCORES} variant="full" />
          </div>
        </div>
        <div>
          <span className="inline-flex rounded-full bg-canvas-brand px-3 py-1 text-body-sm-strong text-ink-deep">
            {pick(HERO_FULL_LABEL)}
          </span>
          <div className="card-outlined mt-3 bg-canvas px-4 py-6 large:px-6">
            <h3 className="text-heading-sm text-ink-deep">{t("dimension.employability")}</h3>
            <FullSampleChart />
          </div>
        </div>
      </div>
      <p className="mt-3 text-body-medium text-on-surface-variant">{pick(SAMPLE_NOTE)}</p>

      {/* Phones get one card per row: a three-column table does not fit 390px. */}
      <dl className="mt-10 flex flex-col gap-3 medium:hidden">
        {FIT_COMPARE_ROWS.map((row, i) => (
          <div key={i} className="card-outlined bg-canvas px-5 py-4">
            <dt className="text-body-sm-strong text-mute-strong">{pick(row.label)}</dt>
            <dd className="mt-3 grid grid-cols-[7.5rem_1fr] gap-x-3 gap-y-2 text-body-md">
              <span className="text-mute-strong">{pick(free.name)}</span>
              <span className="text-on-surface-variant">{row.free ? pick(row.free) : "–"}</span>
              <span className="text-mute-strong">{pick(full.name)}</span>
              <span className="text-body-md-strong text-ink-deep">{row.full ? pick(row.full) : "–"}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="card-outlined mt-10 hidden overflow-hidden bg-canvas medium:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="w-1/3 px-5 py-4" />
              <th scope="col" className="px-5 py-4 text-body-md-strong text-ink-deep">{pick(free.name)}</th>
              <th scope="col" className="bg-primary-pale px-5 py-4 text-body-md-strong text-ink-deep">{pick(full.name)}</th>
            </tr>
          </thead>
          <tbody>
            {FIT_COMPARE_ROWS.map((row, i) => (
              <tr key={i} className="border-b border-line last:border-b-0">
                <th scope="row" className="px-5 py-4 text-body-sm-strong text-mute-strong">{pick(row.label)}</th>
                <td className="px-5 py-4 text-body-md text-on-surface-variant">{row.free ? pick(row.free) : "–"}</td>
                <td className="bg-primary-pale px-5 py-4 text-body-md-strong text-ink-deep">{row.full ? pick(row.full) : "–"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Band>
  );
}
