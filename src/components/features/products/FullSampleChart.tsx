"use client";

/**
 * One area of the paid Fit Report, drawn as the full report draws it: every
 * competency an axis. Added 26/10/2026 for the EU Fit Check page.
 *
 * The scores are `FULL_SAMPLE`, invented and labelled as an example where it is
 * shown. The axis names are the `item.*` keys in `copy.ts`, the same names the
 * report uses, so the example cannot drift from the real thing.
 */

import { useMemo } from "react";
import { useCopy } from "@/components/LocaleProvider";
import { radarSvg } from "@/lib/radar";
import type { AnyCopyKey } from "@/lib/locale";
import { FULL_SAMPLE } from "@/lib/content/products";

export default function FullSampleChart() {
  const { t } = useCopy();
  const svg = useMemo(
    () =>
      radarSvg(
        FULL_SAMPLE.map((a) => ({ label: t(`item.${a.key}` as AnyCopyKey), value: a.score })),
        { idPrefix: "fullsample", size: 470, maxLabel: 40, wrapLabels: true, values: true, widthRatio: 1.9 },
      ),
    [t],
  );
  return <div className="viz-root w-full" dangerouslySetInnerHTML={{ __html: svg }} />;
}
