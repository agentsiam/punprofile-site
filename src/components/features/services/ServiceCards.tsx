"use client";

/**
 * The three service cards, lifted out of `/services` on 23/08/2026 when that
 * route folded into `/coaching`.
 *
 * **It is a component rather than a page because of one link.** The result
 * screen sends a candidate to `?focus=<dimension>`, and `Service.answers` maps
 * each chart axis to the card that answers it. That is the only link in the
 * product connecting a candidate's own result to what PunProfile does, and
 * `services/page.tsx` was explicit that it is "how the result screen's link can
 * honestly claim to point at the candidate's own chart". Retiring the route
 * without moving this would have broken it or quietly degraded it to a generic
 * page, so the mapping travels with the cards.
 *
 * The mapping stays on `/coaching` rather than moving to a product page, because
 * the four axes map to coaching work rather than to anything plug and play.
 *
 * Everything below the extraction line is unchanged from the page it came from,
 * including the two layout notes that were argued out on screenshots in August.
 */

import { Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useCopy } from "@/components/LocaleProvider";
import { SECTION_HEADING } from "@/lib/content/footer";
import {
  AI_NOTE,
  CORE_BADGE,
  FOCUS_NOTE,
  INCLUDES_LABEL,
  SERVICES,
  SERVICES_HEADING,
  SERVICES_INTRO,
  serviceForDimension,
} from "@/lib/content/services";

/** Clay cutout and tint per service, shared with the home page's cards. */
const CUTOUT: Record<string, string> = {
  coaching: "/home/service-direction.png",
  profile: "/home/service-profile.png",
  applications: "/home/service-applications.png",
};
const TINT: Record<string, string> = {
  coaching: "bg-orange-pale",
  profile: "bg-cyan-pale",
  applications: "bg-yellow-pale",
};

function Body() {
  const { pick, locale } = useCopy();
  const focus = useSearchParams().get("focus");
  const focused = focus ? serviceForDimension(focus) : null;

  return (
    <div className="w-full">
      <h2 className={SECTION_HEADING(locale)}>{pick(SERVICES_HEADING)}</h2>
      <p className="mt-4 max-w-2xl text-body-large text-on-surface-variant">{pick(SERVICES_INTRO)}</p>

      {/* No `items-start`, removed 17/08/2026 on Paul's screenshot: it sized
          every card to its own content, so three cards with different amounts of
          text ended at three different heights and the row looked broken. The
          default `stretch` makes them share the tallest, and the card is already
          `flex flex-col` with a `flex-1` body, so the extra height lands in the
          text column rather than stretching the image. */}
      <div className="mt-12 grid gap-6 large:grid-cols-3">
        {SERVICES.map((s) => {
          const on = focused === s.id;
          return (
            <section
              key={s.id}
              id={s.id}
              className={`card-plain flex flex-col overflow-hidden border duration-[350ms] ease-nav transition-colors ${
                on ? "border-on-primary-pale bg-primary-pale" : "border-line"
              }`}
            >
              {/* The clay cutout on the card's own tint, 04/11/2026: the 3D
                  mascot renders this band held are retired by the brand guide,
                  and these are the same three cutouts the home page and
                  /products use. The person stands on the band's floor. */}
              <div className={`relative aspect-[4/3] w-full ${TINT[s.id]}`}>
                <Image
                  src={CUTOUT[s.id]}
                  alt={pick(s.image.alt)}
                  fill
                  sizes="(max-width: 1200px) 60vw, 360px"
                  className="object-contain object-bottom px-6 pt-6"
                />
              </div>

              <div className="flex flex-1 flex-col px-6 py-7">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-heading-sm">{pick(s.name)}</h3>
                  {s.core && (
                    <span className="rounded-full bg-primary px-2.5 py-0.5 text-caption-strong text-on-primary">
                      {pick(CORE_BADGE)}
                    </span>
                  )}
                </div>

                {on && (
                  <p className="mt-2 text-body-sm-strong text-on-primary-pale">
                    {pick(FOCUS_NOTE)}
                  </p>
                )}

                {/* The client's question, not a tagline. A service described by
                    the problem it answers is checkable; one described by its
                    benefits is not. */}
                <p className="mt-3 text-heading-xs text-ink-deep">&ldquo;{pick(s.question)}&rdquo;</p>
                <p className="mt-3 text-body-md text-on-surface-variant">{pick(s.summary)}</p>

                {/* The list folds, 04/11/2026: open, the three cards were the
                    longest section on /coaching. Open by default on a focused
                    card, which a candidate reached from their own result. */}
                <details className="group mt-auto pt-5" open={on}>
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 border-t border-line pt-4 text-body-md-strong text-ink-deep [&::-webkit-details-marker]:hidden">
                    {pick(INCLUDES_LABEL)}
                    <span
                      aria-hidden
                      className="flex size-8 items-center justify-center rounded-full bg-primary-pale text-on-primary-pale duration-[350ms] ease-nav transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <ul className="mt-3 flex flex-col gap-2.5">
                    {s.includes.map((item, i) => (
                      <li key={i} className="flex gap-3 text-body-md text-on-surface">
                        <span
                          aria-hidden
                          className="mt-2 block size-1.5 shrink-0 rounded-full bg-ink-deep"
                        />
                        <span>{pick(item)}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            </section>
          );
        })}
      </div>

      <p className="mt-10 max-w-3xl text-body-md text-body">{pick(AI_NOTE)}</p>

      {/*
        No action here, and that is the second half of one decision.

        The three cards each carried a filled button. That was three filled
        buttons in one view where the system allows one, so they became a single
        centred pill under the row, and the moment they did the real problem
        showed: the page's closing band sits one screen below with the same
        "Talk to me", so the section ended by asking twice.

        The closing band is the page's declared primary in `cta.ts` and it is
        the better place for it: a reader who has just read three service cards
        is a reader still deciding, and the ask belongs after the decision
        rather than beside it.
      */}
    </div>
  );
}

export default function ServiceCards() {
  // `useSearchParams` needs a Suspense boundary or the route opts out of static
  // rendering at build time.
  return (
    <Suspense fallback={<div className="w-full" />}>
      <Body />
    </Suspense>
  );
}
