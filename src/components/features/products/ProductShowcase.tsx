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
import HeroCharts from "@/components/features/products/HeroCharts";
import LiveStatsBand from "@/components/features/products/LiveStatsBand";
import FullReportBand from "@/components/features/products/FullReportBand";
import FitHeroNone from "@/components/features/products/fit/FitHeroNone";
import FitAfterHero from "@/components/features/products/fit/FitAfterHero";
import FitExpertCard from "@/components/features/products/fit/FitExpertCard";

export interface Showcase {
  /** Replaces the summary card in the hero's right column. */
  hero?: ComponentType;
  /** Takes the hero's full width under the text, instead of a right column. */
  heroWide?: ComponentType;
  /** "How it works" as the steps alone, without its illustration. */
  hideHowMedia?: boolean;
  /** A band between the hero and "how it works". */
  afterHero?: ComponentType;
  /** A band between "how it works" and "what it does not do". */
  afterHow?: ComponentType;
}

export const SHOWCASE: Partial<Record<string, Showcase>> = {
  "eu-fit-check": {
    // 26/10/2026, Paul's call: free and full charts side by side in the first
    // screen, the full-version words straight after it, and the generic
    // illustration out of "how it works". The job-ad strip left this page the
    // same evening: it proves the job pipeline, not the check (Paul, 1b).
    heroWide: HeroCharts,
    afterHero: FullReportBand,
    hideHowMedia: true,
    afterHow: LiveStatsBand,
  },
  "fit-report": {
    // 28/10/2026, round 2 (fit-report-page-v2.md, Paul 1a 2a): one real page
    // flat on the lime band instead of the book, then free and full as two
    // equal cards, then five pages and the sample PDF, then the buying steps,
    // then Paul on both sides of the interview table.
    heroWide: FitHeroNone,
    afterHero: FitAfterHero,
    hideHowMedia: true,
    afterHow: FitExpertCard,
  },
};
