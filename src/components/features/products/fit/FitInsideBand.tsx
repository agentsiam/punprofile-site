"use client";

/**
 * Five real pages of the report, then the whole sample as a PDF. Added
 * 28/10/2026.
 *
 * Each tile is a page cut out of a Fit Report rendered from the invented
 * candidate in `fit-sample.ts`, so what a reader sees here is what the report
 * code draws today. The titles are the pages' own headings.
 */

import { useEffect, useState } from "react";
import { useCopy } from "@/components/LocaleProvider";
import Band from "@/components/Band";
import CallToAction from "@/components/CallToAction";
import ReportFrame from "./ReportFrame";
import { SECTION_HEADING } from "@/lib/content/footer";
import { FIT_INSIDE_HEADING, FIT_SAMPLE_PDF, FIT_TILES } from "@/lib/content/products";
import type { AnyCopyKey } from "@/lib/locale";

const SHEET_H = 900;

export default function FitInsideBand() {
  const { t, pick, locale } = useCopy();
  const [pages, setPages] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    let live = true;
    Promise.all([import("@/lib/report"), import("@/lib/fit-sample")]).then(([r, f]) => {
      if (!live) return;
      const html = r.renderFitReport(f.fitSampleInput(), f.fitSampleMeta(locale), {
        locale,
        autoPrint: false,
        sampleNotes: true,
      });
      setPages(Object.fromEntries(FIT_TILES.map((tile) => [tile.section, r.fitReportPage(html, tile.section)])));
    });
    return () => {
      live = false;
    };
  }, [locale]);

  return (
    <Band block="B3" ground="canvas" width="wide">
      <h2 className={SECTION_HEADING(locale)}>{pick(FIT_INSIDE_HEADING)}</h2>

      <ol className="mt-10 grid gap-x-6 gap-y-10 medium:grid-cols-2 large:grid-cols-3">
        {FIT_TILES.map((tile) => (
          <li key={tile.section}>
            <div className="card-outlined overflow-hidden shadow-[0_12px_28px_rgba(0,0,0,.10)]">
              <ReportFrame html={pages?.[tile.section] ?? null} title={tile.title ? pick(tile.title) : t(tile.titleKey as AnyCopyKey)} sheetHeight={SHEET_H} />
            </div>
            <h3 className="mt-4 text-heading-sm text-ink-deep">
              {tile.title ? pick(tile.title) : t(tile.titleKey as AnyCopyKey)}
            </h3>
            <p className="mt-2 text-body-md text-on-surface-variant">{pick(tile.caption)}</p>
          </li>
        ))}
      </ol>

      <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
        <CallToAction page="/products/fit-report" show="primary" />
        <a
          href={`/samples/fit-report-sample-${locale}.pdf`}
          target="_blank"
          rel="noopener"
          className="text-body-md-strong text-ink-deep underline underline-offset-4"
        >
          {pick(FIT_SAMPLE_PDF)}
        </a>
      </div>
    </Band>
  );
}
