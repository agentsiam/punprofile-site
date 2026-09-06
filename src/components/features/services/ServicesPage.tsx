"use client";

/**
 * `/services`. Added 06/09/2026. See the header of `services.ts` for why the
 * route came back and where the line between this page and `/coaching` now is.
 *
 * **The three cards are `ServiceCards`, the same component `/coaching` renders.**
 * That component owns the `?focus=<dimension>` mapping from a candidate's own
 * chart to the card that answers it, which is the one link in the product
 * connecting a result to what PunProfile does. It stays one component for the
 * reason it became one: two renderings of three cards is two wordings of them.
 *
 * **The limit band is `coaching.ts`'s `NOT_FOR`.** Imported, not restated: the
 * three lines are Paul's own and two of them carry standing decisions.
 */

import Image from "next/image";
import { useCopy } from "@/components/LocaleProvider";
import Band from "@/components/Band";
import CallToAction from "@/components/CallToAction";
import Checklist from "@/components/blocks/Checklist";
import ServiceCards from "@/components/features/services/ServiceCards";
import { EYEBROW, HERO_HEADING, SECTION_HEADING } from "@/lib/content/footer";
import { FAQ_HEADING } from "@/lib/content/faq";
import { NOT_FOR, NOT_FOR_HEADING } from "@/lib/content/coaching";
import {
  ENGAGEMENT,
  ENGAGEMENT_HEADING,
  ENGAGEMENT_LEDE,
  SERVICES,
  SERVICES_CLOSE_BODY,
  SERVICES_CLOSE_HEADING,
  SERVICES_EYEBROW,
  SERVICES_FAQ,
  SERVICES_FAQ_INTRO,
  SERVICES_PAGE_HEADING,
  SERVICES_PAGE_INTRO,
} from "@/lib/content/services";

export default function ServicesPage() {
  const { pick, locale } = useCopy();

  /* The hero picture is the core service's own photograph, which is the one
     the three cards below already use for it. A fourth image chosen for this
     page would be a fourth thing to keep true, and the character climbing
     towards a signpost is the page's subject anyway. */
  const hero = SERVICES[0].image;

  return (
    <div className="w-full">
      {/* ------------------------------------------------------------ hero */}
      <Band block="B1" ground="canvas" width="wide">
        <div className="grid items-center gap-12 large:grid-cols-[1.1fr_1fr] large:gap-16">
          <div>
            <p className={`text-mute-strong ${EYEBROW(locale)}`}>{pick(SERVICES_EYEBROW)}</p>
            <h1 className={`mt-4 text-balance ${HERO_HEADING(locale)}`}>
              {pick(SERVICES_PAGE_HEADING)}
            </h1>
            <p className="mt-5 max-w-2xl text-body-large text-on-surface-variant">
              {pick(SERVICES_PAGE_INTRO)}
            </p>
            <CallToAction page="/services" className="mt-8" />
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl">
            <Image
              src={hero.src}
              alt={pick(hero.alt)}
              fill
              sizes="(max-width: 1200px) 100vw, 45vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </Band>

      {/* ----------------------------------------------------- the three ---- */}
      <Band block="B4" ground="soft" width="wide">
        <ServiceCards />
      </Band>

      {/* ------------------------------------------------------ engagement -- */}
      <Band block="B2" ground="canvas" width="wide">
        <h2 className={SECTION_HEADING(locale)}>{pick(ENGAGEMENT_HEADING)}</h2>
        <p className="mt-4 max-w-2xl text-body-large text-on-surface-variant">
          {pick(ENGAGEMENT_LEDE)}
        </p>
        <div className="mt-10 max-w-3xl">
          <Checklist
            items={ENGAGEMENT.map((step) => ({
              lead: pick(step.lead),
              body: pick(step.body),
            }))}
          />
        </div>
      </Band>

      {/* ----------------------------------------------------------- limit -- */}
      {/* Stated before the ask and never after it, which is the one rule
          `verify:narrative` enforces about the order of a selling page. */}
      <Band block="B10" ground="soft">
        <h2 className={SECTION_HEADING(locale)}>{pick(NOT_FOR_HEADING)}</h2>
        <ul className="mt-8 flex flex-col">
          {NOT_FOR.map((item, i) => (
            <li key={i} className="border-b border-line py-5 last:border-b-0">
              <p className="text-body-large text-on-surface">{pick(item)}</p>
            </li>
          ))}
        </ul>
      </Band>

      {/* ------------------------------------------------------------- faq -- */}
      <Band block="B5" ground="canvas">
        <h2 className={SECTION_HEADING(locale)}>{pick(FAQ_HEADING)}</h2>
        <p className="mt-4 text-body-large text-on-surface-variant">{pick(SERVICES_FAQ_INTRO)}</p>
        <div className="mt-8">
          {SERVICES_FAQ.map((item, i) => (
            <div key={i} className="border-b border-line py-6 last:border-b-0">
              <h3 className="text-heading-sm">{pick(item.q)}</h3>
              <p className="mt-3 text-body-large text-on-surface-variant">{pick(item.a)}</p>
            </div>
          ))}
        </div>
      </Band>

      {/* ----------------------------------------------------------- close -- */}
      <Band block="B8" ground="dark" align="center" className="text-center">
        <h2 className={SECTION_HEADING(locale)}>{pick(SERVICES_CLOSE_HEADING)}</h2>
        <p className="mx-auto mt-4 max-w-xl text-body-large">{pick(SERVICES_CLOSE_BODY)}</p>
        <CallToAction page="/services" align="center" show="primary" className="mt-8" />
      </Band>
    </div>
  );
}
