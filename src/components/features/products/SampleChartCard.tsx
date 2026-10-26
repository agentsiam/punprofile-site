"use client";

/**
 * The result chart, as a labelled example, for the EU Fit Check product page
 * hero. Added 25/10/2026.
 *
 * It draws the real `SpiderChart` and `ScoreLegend` from the result screen, fed
 * `HERO_SAMPLE_SCORES`, so the picture a reader sees here is the picture
 * they get at the end, not a drawing of one. The numbers are invented, which is
 * why `SAMPLE_LABEL` sits above the card and `SAMPLE_NOTE` under it, the same
 * test `SampleRead.tsx` passes: it illustrates a format, it asserts no result.
 *
 * All four axes are scored here, unlike the home page's sample. Measured on the
 * built page 25/10/2026: with one axis unmeasured the radar draws an open line
 * and no filled shape, which reads as an empty chart at hero size. The
 * not-measured state is still explained on this page, in "what it does not do".
 *
 * `full` rather than `teaser`: at this column width the teaser radar rendered at
 * about half the card, with labels too small to read.
 */

import { useCopy } from "@/components/LocaleProvider";
import SpiderChart from "@/components/features/chart/SpiderChart";
import ScoreLegend from "@/components/features/chart/ScoreLegend";
import { SAMPLE_LABEL, SAMPLE_NOTE } from "@/lib/content/home";
import { HERO_SAMPLE_SCORES } from "@/lib/content/products";

export default function SampleChartCard() {
  const { t, pick } = useCopy();

  return (
    <div>
      <span className="inline-flex rounded-full bg-canvas-soft px-3 py-1 text-body-sm-strong text-ink-deep">
        {pick(SAMPLE_LABEL)}
      </span>
      <div className="card-outlined mt-3 px-4 py-6 large:px-6 large:py-7">
        <h2 className="text-heading-sm text-ink-deep">{t("teaser.chart.heading")}</h2>
        <SpiderChart scores={HERO_SAMPLE_SCORES} variant="full" />
        <div className="mt-2 border-t border-line pt-5">
          <ScoreLegend scores={HERO_SAMPLE_SCORES} />
        </div>
      </div>
      <p className="mt-3 text-body-medium text-on-surface-variant">{pick(SAMPLE_NOTE)}</p>
    </div>
  );
}
