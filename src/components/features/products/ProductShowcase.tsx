"use client";

/**
 * Sections only a product with a real result can carry. Added 25/10/2026.
 *
 * The template's own rule is that pages which stop being parallel leave the
 * template rather than grow a flag inside it. These do not leave: they are the
 * same page with three slots filled, so the slots live here as data, keyed by
 * slug, and `ProductPage.tsx` renders whatever a product has. A `soon` product
 * has no result to show, so it has no entry.
 */

import type { ComponentType } from "react";
import { useCopy } from "@/components/LocaleProvider";
import Band from "@/components/Band";
import MarketStats from "@/components/blocks/MarketStats";
import SampleChartCard from "@/components/features/products/SampleChartCard";
import LiveStatsBand from "@/components/features/products/LiveStatsBand";
import { MARKET_HEADING } from "@/lib/content/home";

/** The pipeline figures as a strip under the hero: proof before the steps. */
function ProofBand() {
  const { pick } = useCopy();
  return (
    <Band block="B3" ground="soft" width="wide">
      <h2 className="text-heading-sm text-ink-deep">{pick(MARKET_HEADING)}</h2>
      <div className="mt-8">
        <MarketStats />
      </div>
    </Band>
  );
}

export interface Showcase {
  /** Replaces the summary card in the hero's right column. */
  hero?: ComponentType;
  /** A band between the hero and "how it works". */
  afterHero?: ComponentType;
  /** A band between "how it works" and "what it does not do". */
  afterHow?: ComponentType;
}

export const SHOWCASE: Partial<Record<string, Showcase>> = {
  "eu-fit-check": {
    hero: SampleChartCard,
    afterHero: ProofBand,
    afterHow: LiveStatsBand,
  },
};
