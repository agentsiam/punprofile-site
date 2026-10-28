"use client";

/**
 * The first picture on the Fit Report page: one real page of the report, flat,
 * on the lime band, with three notes on what to look at. Replaced the book on
 * 28/10/2026 (Paul, 1a): Wise, which our design system is built from, shows
 * product as real UI in white cards on a coloured band, with no shadows and no
 * 3D, and the book was all three.
 */

import { useCopy } from "@/components/LocaleProvider";
import Band from "@/components/Band";
import ReportFrame from "./ReportFrame";
import { useFitPages } from "./useFitPages";
import { FIT_CALLOUTS } from "@/lib/content/products";

const IDS = ["employability"] as const;

function Mark({ kind }: { kind: string }) {
  if (kind === "bar")
    return <span aria-hidden className="mt-2 inline-block w-7 shrink-0 border-t-[3px] border-dashed border-warning-deep" />;
  return (
    <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-ink-deep text-body-sm-strong text-[var(--color-canvas-brand)]">
      {kind === "check" ? "✓" : kind}
    </span>
  );
}

export default function FitShowcaseBand() {
  const { t, pick, locale } = useCopy();
  const pages = useFitPages(locale, IDS);

  return (
    <Band block="B3" ground="brand" width="wide">
      <div className="grid items-start gap-5 large:grid-cols-[1.35fr_1fr] large:gap-6">
        <div className="overflow-hidden rounded-[30px] bg-white">
          <ReportFrame html={pages?.employability ?? null} title={t("report.full.example")} sheetHeight={720} />
        </div>
        <div className="flex flex-col gap-4">
          {FIT_CALLOUTS.map((c, i) => (
            <div key={i} className="flex gap-4 rounded-[24px] bg-white px-6 py-5">
              <Mark kind={c.mark} />
              <div>
                <p className="text-body-md-strong text-ink-deep">{pick(c.title)}</p>
                <p className="mt-1 text-body-md text-ink-deep">{pick(c.body)}</p>
              </div>
            </div>
          ))}
          <p className="px-2 text-body-sm text-ink-deep">{t("report.full.example")}</p>
        </div>
      </div>
    </Band>
  );
}
