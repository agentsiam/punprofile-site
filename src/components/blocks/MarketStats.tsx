"use client";

/**
 * The job pipeline's three figures, with the window they cover. Lifted out of
 * the home page on 25/10/2026 so the EU Fit Check product page can carry the
 * same strip without a second copy of the marks or the markup.
 *
 * The figures come from `market-snapshot.generated.ts` and nowhere else, and the
 * foot always prints the window, because a stale figure that names its own date
 * is honest and one that does not is not.
 */

import { useCopy } from "@/components/LocaleProvider";
import { MARKET } from "@/lib/content/market-snapshot.generated";
import { MARKET_FOOT, MARKET_STATS } from "@/lib/content/home";

/**
 * One mark per pipeline figure. `screened` is a document, `published` is a
 * document with a tick, `employers` is a building. Nothing here is a brand
 * asset; they are the plainest reading of each noun.
 */
const STAT_MARK: Record<string, string> = {
  screened: "M6 2h8l4 4v16H6V2Zm7 1.5V7h3.5L13 3.5ZM8 11h8v1.5H8V11Zm0 4h8v1.5H8V15Z",
  published:
    "M6 2h8l4 4v16H6V2Zm7 1.5V7h3.5L13 3.5Zm-2.2 15.1L7.5 15.3l1.1-1.1 2.2 2.2 4.6-4.6 1.1 1.1-5.7 5.7Z",
  employers:
    "M3 21V7l7-4 7 4v3h4v11H3Zm2-2h4v-3H5v3Zm0-5h4v-3H5v3Zm0-5h4V6H5v3Zm6 10h4v-3h-4v3Zm0-5h4v-3h-4v3Zm0-5h4V6h-4v3Zm8 10h2v-7h-2v7Z",
};

export default function MarketStats() {
  const { t, pick } = useCopy();

  return (
    <>
      <div className="grid gap-10 medium:grid-cols-3">
        {MARKET_STATS.map((stat) => (
          <div key={stat.field}>
            <span
              aria-hidden
              className="flex size-10 items-center justify-center rounded-full bg-primary-pale text-on-primary-pale"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
                <path d={STAT_MARK[stat.field] ?? STAT_MARK.screened} />
              </svg>
            </span>
            <p className="mt-4 text-display-md text-ink-deep">{MARKET[stat.field]}</p>
            <p className="mt-2 text-body-large text-body">{t(stat.label)}</p>
          </div>
        ))}
      </div>
      {/* One sentence in both languages rather than fragments joined here:
          Thai puts the dates in its own place and only the whole sentence can
          carry that. */}
      <p className="mt-4 text-body-medium text-on-surface-variant">
        {pick(MARKET_FOOT).replaceAll("{from}", MARKET.from).replaceAll("{to}", MARKET.to)}
      </p>
    </>
  );
}
