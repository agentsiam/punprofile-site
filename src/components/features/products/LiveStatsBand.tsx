"use client";

/**
 * "What you see at the end", for the EU Fit Check product page. Added 25/10/2026.
 *
 * The result screen's own community block, rendered with no candidate scores,
 * so it shows only what is true of everyone: the readiness bars and the top
 * target countries. No percentile line, because there is no reader's score to
 * place yet.
 *
 * Real data, live from Convex. The whole band is withheld until the statistics
 * clear their own sample floor, so the heading is never left over an empty space.
 */

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCopy } from "@/components/LocaleProvider";
import Band from "@/components/Band";
import CommunityStats from "@/components/features/assessment/CommunityStats";
import { SECTION_HEADING } from "@/lib/content/footer";
import { SHOWCASE_HEADING, SHOWCASE_LEDE } from "@/lib/content/products";

export default function LiveStatsBand() {
  const stats = useQuery(api.stats.community);
  const { pick, locale } = useCopy();

  if (!stats || stats.topCountries === null) return null;

  return (
    <Band block="B3" ground="canvas" width="wide">
      <h2 className={SECTION_HEADING(locale)}>{pick(SHOWCASE_HEADING)}</h2>
      <p className="mt-4 max-w-2xl text-body-large text-on-surface-variant">
        {pick(SHOWCASE_LEDE)}
      </p>
      <CommunityStats scores={{}} />
    </Band>
  );
}
