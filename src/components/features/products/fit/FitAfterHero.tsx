"use client";

/** The bands between the Fit Report hero and "how to start", in order. 28/10/2026. */

import FitShowcaseBand from "./FitShowcaseBand";
import FitCompareBand from "./FitCompareBand";
import FitInsideBand from "./FitInsideBand";

export default function FitAfterHero() {
  return (
    <>
      <FitShowcaseBand />
      <FitCompareBand />
      <FitInsideBand />
    </>
  );
}
