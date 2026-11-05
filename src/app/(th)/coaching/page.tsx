"use client";

/**
 * 1-1 Coaching. TASK-089, 14/08/2026. Replaces the About page.
 *
 * A sales page in the order a stranger actually needs it: the mechanism they
 * are losing to, evidence they are not alone in it, the machine, who it is for
 * and who it is not, then who is behind it. The founder section is last on
 * purpose. See the note at the top of `src/lib/content/coaching.ts`.
 *
 * **There is no EU Fit Check call to action on this page**, added 14/08/2026 on
 * Paul's read. It had three. A reader here has already self-selected into
 * wanting coaching, and sending them to a two-minute questionnaire is asking
 * them to go back to the top of a funnel they have walked most of the way down.
 * The check earns its place on the landing page, in the FAQ and on the contact
 * page, where the reader has not yet decided anything. Here the one action is
 * the services, and the only mention of the check is as the source of the
 * numbers, which is a citation rather than an invitation.
 *
 * **Revamped 04/11/2026** (Paul chose 1a; plan in `Claude outputs/coaching-images/
 * coaching-plan.md`). Same words, new order and layout: a clay hero, the pains
 * as ticked tiles, the placements as proof, the services moved up with their
 * lists folded, the method as four steps in a row, who it is for and not for
 * side by side, the coaches as two cards with their stories folded, and the
 * "why we do this" as a two-column panel.
 *
 * One accent button per view, per `design.md`. The quiet link to /contact under
 * it is text, not a second button.
 */

import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCopy } from "@/components/LocaleProvider";
import { EYEBROW, HERO_HEADING, SECTION_HEADING } from "@/lib/content/footer";
import Band from "@/components/Band";
import CallToAction from "@/components/CallToAction";
import CoachFold from "@/components/features/coaches/CoachFold";
import Testimonials from "@/components/blocks/Testimonials";
import { RESULTS, RESULTS_HEADING, RESULTS_NEXT, RESULTS_PREV } from "@/lib/content/home";
import ServiceCards from "@/components/features/services/ServiceCards";
import {
  CLOSE_LEAD,
  FOUNDER_AFTER,
  FOUNDER_TURN,
  HOOK_BODY,
  HOOK_CTA_SUB,
  HOOK_EYEBROW,
  HOOK_LINE_1,
  HOOK_LINE_2,
  METHOD,
  METHOD_HEADING,
  METHOD_INTRO,
  NOT_FOR,
  NOT_FOR_HEADING,
  PAINS,
  PAIN_HEADING,
  PERSONAS,
  PERSONA_HEADING,
  PROOF_CONCLUSION,
  PROOF_FOOT,
  PROOF_HEADING,
  PROOF_LINES,
} from "@/lib/content/coaching";

function ProofPanel() {
  const stats = useQuery(api.stats.community);
  const { pick, locale } = useCopy();
  if (!stats) return null;

  const lines = PROOF_LINES.map((line) => ({
    line,
    value: stats.shares[line.share],
  })).filter((x): x is { line: (typeof PROOF_LINES)[number]; value: { pct: number } } =>
    Boolean(x.value),
  );
  if (lines.length === 0) return null;

  return (
    <Band block="B1" ground="soft">
      <h2 className={SECTION_HEADING(locale)}>{pick(PROOF_HEADING)}</h2>
      <div className="mt-6 grid gap-4 medium:grid-cols-3">
        {lines.map(({ line, value }) => (
          <div key={line.share} className="card-plain px-8 py-9">
            <p className="text-headline-large text-ink-deep">{value.pct}%</p>
            <p className="mt-2 text-body-large text-on-surface">{pick(line.label)}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-body-medium text-on-surface-variant">{pick(PROOF_FOOT)}</p>
      <p className="mt-6 text-heading-sm text-on-surface">{pick(PROOF_CONCLUSION)}</p>
    </Band>
  );
}

/** The four placements, each crediting coaching work. Photos as on the home page. */
const PLACEMENTS: { id: string; photo: string }[] = [
  { id: "placed-hotel-germany", photo: "/home/testimonials/testimonial-photo-may.jpg" },
  { id: "placed-chef-netherlands", photo: "/home/testimonials/testimonial-photo-ton.jpg" },
  { id: "placed-it-ireland", photo: "/home/testimonials/testimonial-photo-nat.jpg" },
  { id: "placed-logistics-sweden", photo: "/home/testimonials/testimonial-photo-nut.jpg" },
];

export default function CoachingPage() {
  const { pick, locale } = useCopy();

  return (
    <div className="w-full">
      {/* ------------------------------------------------------------ hero
          04/11/2026: the clay scene replaces the flat mascot, which the brand
          guide keeps for small moments. The loose line under the buttons is
          now what it always meant to be, a jump to the services. */}
      <Band block="B3" ground="canvas" width="wide">
        <div className="grid items-center gap-10 large:grid-cols-[1.1fr_1fr] large:gap-14">
          <div>
            <p className={`text-on-surface-variant ${EYEBROW(locale)}`}>{pick(HOOK_EYEBROW)}</p>
            <h1 className={`mt-5 text-balance ${HERO_HEADING(locale)}`}>
              {pick(HOOK_LINE_1)}
              <br />
              <span className="text-ink-deep">{pick(HOOK_LINE_2)}</span>
            </h1>
            <div className="mt-6 flex max-w-xl flex-col gap-4">
              {HOOK_BODY.map((p, i) => (
                <p key={i} className="text-body-large text-on-surface-variant">
                  {pick(p)}
                </p>
              ))}
            </div>
            <CallToAction page="/coaching" className="mt-8" />
            <a
              href="#services"
              className="group mt-5 inline-flex min-h-6 items-center gap-2 text-body-md text-on-surface-variant underline underline-offset-4"
            >
              {pick(HOOK_CTA_SUB)}
              <span aria-hidden className="duration-[350ms] ease-nav transition-transform group-hover:translate-y-0.5">
                &darr;
              </span>
            </a>
          </div>
          <Image
            src="/coaching/coaching-hero.jpg"
            // Decorative: the headline beside it carries the meaning.
            alt=""
            width={1200}
            height={900}
            priority
            sizes="(max-width: 1200px) 92vw, 560px"
            className="mx-auto h-auto w-full max-w-[640px] rounded-3xl"
          />
        </div>
      </Band>

      {/* ---------------------------------------------- does this sound like you
          Six tiles with a tick each, the full width. Recognition before
          argument. */}
      <Band block="B5" ground="canvas" width="wide">
        <h2 className={SECTION_HEADING(locale)}>{pick(PAIN_HEADING)}</h2>
        <ul className="mt-8 grid gap-4 medium:grid-cols-2 large:grid-cols-3">
          {PAINS.map((p, i) => (
            <li key={i} className="card-plain flex gap-4 border border-line px-6 py-6">
              <span
                aria-hidden
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-body-sm-strong text-on-primary"
              >
                &#10003;
              </span>
              <span className="text-body-md text-on-surface">{pick(p)}</span>
            </li>
          ))}
        </ul>
      </Band>

      <ProofPanel />

      {/* --------------------------------------------------------- placements
          New on this page 04/11/2026: the page that sells the coaching had no
          proof, and the four placement stories credit coaching work. */}
      <Band block="B13" ground="soft" width="wide">
        <h2 className={SECTION_HEADING(locale)}>{pick(RESULTS_HEADING)}</h2>
        <div className="mt-10">
          <Testimonials
            items={PLACEMENTS.flatMap(({ id, photo }) => {
              const r = RESULTS.find((x) => x.id === id);
              return r
                ? [{ quote: pick(r.quote), who: pick(r.who), role: pick(r.role), portrait: { src: photo, alt: "" } }]
                : [];
            })}
            codePrefix="COACHING-PROOF"
            prevLabel={pick(RESULTS_PREV)}
            nextLabel={pick(RESULTS_NEXT)}
          />
        </div>
      </Band>

      {/* ----------------------------------------------------------- services
          Moved up from the foot of the page. It carries the `?focus=` contract
          the result screen depends on; see the note at the top of
          `ServiceCards`. */}
      <Band block="B4" ground="canvas" width="wide" id="services">
        <ServiceCards />
      </Band>

      {/* ------------------------------------------------------------- method
          Four steps in a row on the wide screen, with large numbers. */}
      <Band block="B2" ground="soft" width="wide">
        <div className="max-w-3xl">
          <h2 className={SECTION_HEADING(locale)}>{pick(METHOD_HEADING)}</h2>
          <p className="mt-4 text-body-large text-on-surface-variant">{pick(METHOD_INTRO)}</p>
        </div>
        <ol className="mt-10 grid gap-4 medium:grid-cols-2 large:grid-cols-4">
          {METHOD.map((step) => (
            <li key={step.n} className="card-plain flex flex-col px-6 py-7">
              <p className="text-display-sm text-ink-deep">{step.n}</p>
              <h3 className="mt-3 text-heading-xs">{pick(step.heading)}</h3>
              <div className="mt-3 flex flex-col gap-3">
                {step.body.map((b, i) => (
                  <p key={i} className="text-body-md text-on-surface-variant">
                    {pick(b)}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </Band>

      {/* ---------------------------------------------- who it is for, and not
          B10: the second half is the limit slot. Side by side since
          04/11/2026, ticks against crosses. */}
      <Band block="B10" ground="canvas" width="wide">
        <div className="grid gap-6 large:grid-cols-2">
          <div className="card-plain border-2 border-ink-deep px-6 py-7 medium:px-8">
            <h2 className="text-headline-sm">{pick(PERSONA_HEADING)}</h2>
            <ul className="mt-6 flex flex-col gap-4">
              {PERSONAS.map((p, i) => (
                <li key={i} className="flex gap-3 text-body-md text-on-surface">
                  <span
                    aria-hidden
                    className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-caption-strong text-on-primary"
                  >
                    &#10003;
                  </span>
                  <span>{pick(p)}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Saying who you turn away is the cheapest credibility on the page. */}
          <div className="card-plain border border-line px-6 py-7 medium:px-8">
            <h2 className="text-headline-sm">{pick(NOT_FOR_HEADING)}</h2>
            <ul className="mt-6 flex flex-col gap-4">
              {NOT_FOR.map((p, i) => (
                <li key={i} className="flex gap-3 text-body-md text-on-surface-variant">
                  <span
                    aria-hidden
                    className="flex size-6 shrink-0 items-center justify-center rounded-full bg-canvas-soft text-caption-strong text-ink-deep"
                  >
                    &#10005;
                  </span>
                  <span>{pick(p)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Band>

      {/* ------------------------------------------------------------ coaches
          Two equal cards, stories folded (`CoachFold`), then the shared "why
          we do this" as a two-column panel: the line on the left, the four
          paragraphs on the right. */}
      <Band block="B7" ground="canvas" width="wide">
        <CoachFold />
        <div className="mt-10 grid gap-8 rounded-[30px] bg-primary-pale px-6 py-9 text-on-primary-pale medium:px-10 large:grid-cols-[1fr_2fr]">
          <p className="text-headline-sm">{pick(FOUNDER_TURN)}</p>
          <div className="flex flex-col gap-4">
            {FOUNDER_AFTER.map((p, i) => (
              <p key={i} className="text-body-md">
                {pick(p)}
              </p>
            ))}
          </div>
        </div>
      </Band>

      <Band block="B8" ground="dark" align="center" className="text-center">
        <p className={SECTION_HEADING(locale)}>{pick(CLOSE_LEAD)}</p>
        <CallToAction page="/coaching" className="mt-8" align="center" />
      </Band>
    </div>
  );
}
