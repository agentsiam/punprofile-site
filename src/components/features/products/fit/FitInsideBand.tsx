"use client";

/**
 * Five real pages of the report, then the whole sample as a PDF. Added
 * 28/10/2026, made flat the same day (Paul, 1a): each page is cropped to its
 * top, where the point of the page is, and on a phone the row scrolls sideways
 * instead of shrinking the pages past reading.
 */

import { useCopy } from "@/components/LocaleProvider";
import Band from "@/components/Band";
import CallToAction from "@/components/CallToAction";
import ReportFrame from "./ReportFrame";
import { useFitPages } from "./useFitPages";
import { SECTION_HEADING } from "@/lib/content/footer";
import { FIT_INSIDE_HEADING, FIT_SAMPLE_PDF, FIT_TILES } from "@/lib/content/products";
import type { AnyCopyKey } from "@/lib/locale";

const IDS = FIT_TILES.map((x) => x.section);

export default function FitInsideBand() {
  const { t, pick, locale } = useCopy();
  const pages = useFitPages(locale, IDS);
  const title = (tile: (typeof FIT_TILES)[number]) => (tile.title ? pick(tile.title) : t(tile.titleKey as AnyCopyKey));

  return (
    <Band block="B3" ground="canvas" width="wide">
      <h2 className={SECTION_HEADING(locale)}>{pick(FIT_INSIDE_HEADING)}</h2>

      <ol className="-mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 medium:mx-0 medium:grid medium:grid-cols-2 medium:gap-6 medium:overflow-visible medium:px-0 large:grid-cols-3">
        {FIT_TILES.map((tile) => (
          <li key={tile.section} className="w-[78%] shrink-0 snap-start medium:w-auto">
            <div className="card-outlined overflow-hidden rounded-[30px] bg-white">
              <ReportFrame html={pages?.[tile.section] ?? null} title={title(tile)} sheetHeight={600} />
            </div>
            <h3 className="mt-4 text-heading-sm text-ink-deep">{title(tile)}</h3>
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
