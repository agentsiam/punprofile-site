"use client";

/**
 * One template for every product page. Added 23/08/2026, filled out 06/09/2026.
 *
 * A template rather than five hand-built pages because these five genuinely are
 * parallel: same question in the headline, same three-point mechanism, same
 * limit, same single action. Where two of them stop being parallel they should
 * leave this file rather than grow a flag inside it, which is why `/coaching`
 * was never folded in: it carries a founder section and three service cards and
 * would have cost more in exceptions than it saved in duplication.
 *
 * **The `soon` line is what makes shipping an unbuilt product's page honest.** It
 * is not a disclaimer at the bottom; it sits directly under the name, before the
 * reader has invested anything in reading, and the action underneath opens a
 * conversation rather than a dead button.
 *
 * ---------------------------------------------------------------------------
 * WHAT THE 06/09/2026 UI REVIEW CHANGED, AND WHY
 * ---------------------------------------------------------------------------
 *
 * The five pages were measured in a browser at 1280 and at 390, in both colour
 * schemes. Nothing on them failed contrast and nothing overflowed. What they
 * did instead was read as unfinished, in four specific ways, and each one is
 * fixed here rather than being a matter of taste:
 *
 * - **Three chips stacked before the headline.** Audience, then the product
 *   name in mute grey, then the status pill, each on its own line, all three
 *   above an `h1` that had not been reached yet. The name and the status are
 *   one fact about one thing, so they are one row now, above the audience chip
 *   rather than under it: the name is the eyebrow, which is the pattern
 *   `/coaching` already uses.
 * - **The right half of the hero was empty**, on every page, at every width
 *   over `large`. It carries the summary card now: who it is for, what happens,
 *   and which column of the catalogue it is in. All three are strings the page
 *   already had; none of them is a price, which stays `/pricing`'s (R47).
 * - **A dashed PLACEHOLDER box in the middle of the page.** See
 *   `ProductDiagram.tsx` for what replaced it and why it is a drawing.
 * - **A closing band with a button and no words in it.** B8 in the block
 *   library gives the action a line above it, and 215px of dark green with a
 *   pill floating in the middle is a band a reader scrolls past.
 *
 * The FAQ had no heading over it, which on `cv-check` left one question reading
 * as a stray paragraph, and a reader who finished a page had nowhere to go but
 * back to the menu. Both are sections now.
 */

import Link from "next/link";
import { useCopy } from "@/components/LocaleProvider";
import CallToAction from "@/components/CallToAction";
import Band from "@/components/Band";
import SplitFeature from "@/components/blocks/SplitFeature";
import Checklist from "@/components/blocks/Checklist";
import AudienceChip from "@/components/blocks/AudienceChip";
import ProductDiagram from "@/components/features/products/ProductDiagram";
import { EYEBROW, HERO_HEADING, SECTION_HEADING } from "@/lib/content/footer";
import { FAQ_HEADING } from "@/lib/content/faq";
import { CATALOGUE_FREE, CATALOGUE_PAID } from "@/lib/content/home";
import {
  CLOSE_BODY,
  CLOSE_HEADING,
  COL_COST,
  COL_WHAT,
  COL_WHO,
  COMING_SOON,
  HOW_HEADING,
  LIMIT_HEADING,
  PRODUCTS,
  PRODUCT_ART,
  RELATED_HEADING,
  STATUS_LIVE,
  STATUS_SOON,
  isFreeProduct,
  type Product,
} from "@/lib/content/products";

export default function ProductPage({ product }: { product: Product }) {
  const { pick, locale, path } = useCopy();
  const soon = product.status === "soon";
  const art = PRODUCT_ART[product.slug];
  const others = PRODUCTS.filter((p) => p.slug !== product.slug);

  /*
   * The summary card, and the one thing it must not become.
   *
   * Three rows, all three read off the product rather than written for the
   * card, which is the test that keeps a summary honest: if a line cannot be
   * checked against the page under it, it is marketing. The third row names a
   * COLUMN of the catalogue and never a number, because `/pricing` owns every
   * number and a fourth place holding one is a fourth place for it to be stale.
   */
  const summary = [
    { label: COL_WHO, value: product.audience },
    { label: COL_WHAT, value: product.howLede },
    { label: COL_COST, value: isFreeProduct(product.slug) ? CATALOGUE_FREE : CATALOGUE_PAID },
  ];

  return (
    <div className="w-full">
      <Band block="B1" ground="canvas" width="wide">
        <div className="grid items-start gap-12 large:grid-cols-[1.15fr_1fr] large:gap-16">
          <div>
            {/* The name and the status are one row. Two stacked pills said the
                same kind of thing twice and pushed the headline down a line. */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className={`text-mute-strong ${EYEBROW(locale)}`}>{pick(product.name)}</p>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-body-sm-strong ${
                  soon ? "bg-canvas-soft text-ink-deep" : "bg-primary text-on-primary"
                }`}
              >
                {pick(soon ? STATUS_SOON : STATUS_LIVE)}
              </span>
            </div>

            {/* B22, the audience chip: the reference's product pages say who a
                thing is for before they say anything else, which is a cheap and
                honest way to let the wrong reader leave. */}
            <div className="mt-5">
              <AudienceChip>{pick(product.audience)}</AudienceChip>
            </div>

            {/* The problem, not the feature. A page that opens on what the
                product IS asks a stranger to care about the product first; one
                that opens on what went wrong hands them their own experience. */}
            <h1 className={`mt-5 text-balance ${HERO_HEADING(locale)}`}>
              {pick(product.headline)}
            </h1>
            <p className="mt-5 max-w-2xl text-body-large text-on-surface-variant">
              {pick(product.lede)}
            </p>

            {/* The promise, in full, and this is where it belongs. The chip
                above carries the short label because a sentence in a pill reads
                as the heading; the sentence itself sits here, above the action,
                so the reader meets it before deciding to take one. */}
            {soon && (
              <p className="mt-4 max-w-2xl text-body-md text-mute-strong">{pick(COMING_SOON)}</p>
            )}

            <CallToAction page={product.actionsKey} className="mt-8" show="primary" />
          </div>

          <div className="card-outlined px-8 py-8">
            <dl className="flex flex-col">
              {summary.map((row, i) => (
                <div
                  key={i}
                  className="border-b border-line py-5 first:pt-0 last:border-b-0 last:pb-0"
                >
                  <dt className="text-caption-strong text-mute-strong">{pick(row.label)}</dt>
                  <dd className="mt-2 text-body-md-strong text-ink-deep">{pick(row.value)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Band>

      {/* --------------------------------------------------------- how ----

          B11: the steps beside a picture rather than a bulleted list on their
          own. It was a numbered list and it is still numbered; what changed is
          that each step gets a hairline and the section gets something to look
          at, which is what the reference does on every page that has to say
          what a product actually does. */}
      <Band block="B2" ground="soft" width="wide">
        <h2 className={SECTION_HEADING(locale)}>{pick(HOW_HEADING)}</h2>
        {/* The reference puts a line under this heading before the checklist. */}
        <p className="mt-4 max-w-2xl text-body-large text-on-surface-variant">
          {pick(product.howLede)}
        </p>
        <div className="mt-10">
          <SplitFeature
            reverse
            media={
              <div className="flex h-full w-full items-center justify-center bg-canvas p-6">
                <ProductDiagram figure={art.figure} title={pick(art.alt)} />
              </div>
            }
          >
            <Checklist items={product.how.map((item) => ({ lead: pick(item) }))} />
          </SplitFeature>
        </div>
      </Band>

      {/* ------------------------------------------------------- limit ---- */}
      {/* Its own block with its own heading rather than a line of small print.
          Several of these carry a standing decision (the app does not rewrite
          CVs; PunProfile is not a recruiter), and a decision that only appears
          as a footnote is one nobody reads before they buy. */}
      <Band block="B10" ground="canvas">
        <div className="card-plain border border-line px-8 py-9">
          <h2 className="text-heading-sm">{pick(LIMIT_HEADING)}</h2>
          <p className="mt-3 text-body-large text-on-surface-variant">{pick(product.limit)}</p>
        </div>
      </Band>

      {/* --------------------------------------------------------- faq ---- */}
      {product.faq.length > 0 && (
        <Band block="B5" ground="soft">
          <h2 className={SECTION_HEADING(locale)}>{pick(FAQ_HEADING)}</h2>
          <div className="mt-8">
            {product.faq.map((item, i) => (
              <div key={i} className="border-b border-line py-6 last:border-b-0">
                <h3 className="text-heading-sm">{pick(item.q)}</h3>
                <p className="mt-3 text-body-large text-on-surface-variant">{pick(item.a)}</p>
              </div>
            ))}
          </div>
        </Band>
      )}

      {/* ----------------------------------------------------- related ----

          B4 carries audience, artefact and ask. A reader who has finished one
          product page and is not going to take its action has exactly one
          question left, which is what the other four are, and until 06/09/2026
          the only answer was the menu. The catalogue page is the heading's own
          link rather than a sixth card, so the row does not have to grow every
          time the catalogue does. */}
      <Band block="B4" ground="canvas" width="wide">
        <Link
          href={path("/products")}
          className="inline-flex items-center gap-3 duration-[350ms] ease-nav transition-opacity hover:opacity-70"
        >
          <h2 className={SECTION_HEADING(locale)}>{pick(RELATED_HEADING)}</h2>
          <span aria-hidden className="text-body-large">
            &rsaquo;
          </span>
        </Link>
        <ul className="mt-8 grid gap-4 medium:grid-cols-2 large:grid-cols-4">
          {others.map((p) => (
            <li key={p.slug}>
              <Link
                href={path(`/products/${p.slug}`)}
                className="card-plain flex h-full flex-col border border-line px-6 py-6 duration-[350ms] ease-nav transition-colors hover:border-line-strong"
              >
                <span className="text-heading-sm">{pick(p.name)}</span>
                {p.status === "soon" && (
                  <span className="mt-1 text-caption-strong text-mute-strong">
                    {pick(STATUS_SOON)}
                  </span>
                )}
                <span className="mt-3 text-body-md text-body">{pick(p.audience)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Band>

      {/* The same action as the top, once more at the foot. Rule 1 in `cta.ts`
          allows one action to repeat; a reader who got this far arrived at the
          decision here rather than at the headline. It says what it is asking
          about now: see the review note at the head of this file. */}
      <Band block="B8" ground="dark" align="center" className="text-center">
        <h2 className={SECTION_HEADING(locale)}>{pick(CLOSE_HEADING)}</h2>
        <p className="mx-auto mt-4 max-w-xl text-body-large">{pick(CLOSE_BODY)}</p>
        <CallToAction page={product.actionsKey} align="center" show="primary" className="mt-8" />
      </Band>
    </div>
  );
}
