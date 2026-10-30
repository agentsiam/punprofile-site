"use client";

/**
 * The coaches on /coaching, one row each: portrait, a lime pill, the greeting,
 * one pull line and their own paragraphs. 30/10/2026, replacing the full-bleed
 * lime band, which Paul found overwhelming. Lime is the accent only here: the
 * pill and the rule beside the pull line.
 *
 * Two voices, not a merged "we" (decided 25/08/2026). The shared "why we do
 * this" paragraphs follow both rows, on the page, in a soft-grey card.
 *
 * Each row carries the coach's `id` as its anchor, for the home cards' links.
 */

import Image from "next/image";
import { useCopy } from "@/components/LocaleProvider";
import { COACHES } from "@/lib/content/coaching";
import { SECTION_HEADING } from "@/lib/content/footer";
import { COACH_PHOTO } from "./CoachCards";

export default function CoachRows() {
  const { pick, locale } = useCopy();
  return (
    <div className="flex flex-col">
      {COACHES.map((c, i) => (
        <article
          key={c.id}
          id={c.id}
          className={`grid scroll-mt-24 gap-8 medium:grid-cols-[minmax(0,18rem)_1fr] large:gap-14 ${
            i > 0 ? "mt-12 border-t border-outline-variant pt-12" : ""
          }`}
        >
          <Image
            src={COACH_PHOTO[c.id]}
            alt={pick(c.alt)}
            width={1200}
            height={900}
            sizes="(min-width: 768px) 18rem, 100vw"
            className="aspect-[4/3] w-full rounded-[30px] object-cover medium:aspect-[4/5]"
          />
          <div>
            <p className="inline-block rounded-full bg-primary px-3 py-1 text-body-medium text-on-primary">
              {pick(c.pill)}
            </p>
            <h2 className={`mt-4 ${SECTION_HEADING(locale)}`}>{pick(c.heading)}</h2>
            <p className="mt-5 border-l-4 border-primary pl-4 text-heading-sm text-on-surface">
              {pick(c.pull)}
            </p>
            <div className="mt-6 flex max-w-2xl flex-col gap-4">
              {c.story.map((p, j) => (
                <p key={j} className="text-body-large text-on-surface-variant">
                  {pick(p)}
                </p>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
