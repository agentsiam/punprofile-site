"use client";

/**
 * `/products`, the catalogue page. Added 06/09/2026 on Paul's call.
 *
 * ---------------------------------------------------------------------------
 * WHY IT EXISTS
 * ---------------------------------------------------------------------------
 *
 * The five product pages shipped on 23/08/2026 with two ways in: the Products
 * menu, which is a list of names and no shape, and the catalogue section of the
 * landing page, which a reader arriving on one product page from a shared link
 * never sees. There was nowhere to send someone who wants to know how the five
 * fit together before choosing one, and no page for the menu itself to point at
 * as "all of it".
 *
 * ---------------------------------------------------------------------------
 * WHAT IT MAY NOT DO
 * ---------------------------------------------------------------------------
 *
 * **No prices.** `/pricing` is where someone chooses and this is where someone
 * learns, which is the split `products.ts` states at its head and the reason a
 * product page carries no number either. The cost column names the COLUMN of
 * the catalogue, free or token-priced, in `home.ts`'s own words so the landing
 * page and this page cannot drift into two labels for one thing.
 *
 * **Nothing restated.** Every string on this page is read off `products.ts`.
 * The one exception is the page's own furniture, the heading, the intro and the
 * column labels, which are in `products.ts` too. A third wording of the
 * catalogue is a third thing to keep true, and it would be this page that
 * drifted first, because it is the one nobody opens when a product changes.
 *
 * ---------------------------------------------------------------------------
 * THE TABLE, AND WHY IT IS NOT A TABLE ELEMENT
 * ---------------------------------------------------------------------------
 *
 * Five columns of Thai prose do not fit a phone, and the two usual answers are
 * both bad: horizontal scroll hides two columns behind a gesture nobody makes,
 * and a font small enough to fit breaks R17 before it breaks legibility. So it
 * is a grid that is a table at `large:` and a stack of labelled rows below it,
 * with each cell carrying its own label at the small size. The header row is
 * hidden rather than duplicated, because at the small size every cell already
 * says what it is.
 */

import Image from "next/image";
import Link from "next/link";
import { useCopy } from "@/components/LocaleProvider";
import type { Copy } from "@/lib/content/copy";
import Band from "@/components/Band";
import CallToAction from "@/components/CallToAction";
import Checklist from "@/components/blocks/Checklist";
import ProductDiagram from "@/components/features/products/ProductDiagram";
import { PRODUCT_PHOTO } from "@/components/features/products/productPhotos";
import { EYEBROW, HERO_HEADING, SECTION_HEADING } from "@/lib/content/footer";
import { CATALOGUE_FREE, CATALOGUE_PAID, RESULTS } from "@/lib/content/home";
import CoachingCards from "@/components/features/services/CoachingCards";
import { DESTINATIONS } from "@/lib/content/cta";
import {
  CARD_ACTION,
  CLOSE_BODY,
  CLOSE_HEADING,
  COL_COST,
  COL_PRODUCT,
  COL_WHAT,
  COL_WHO,
  STATUS_SOON,
  INDEX_EYEBROW,
  INDEX_HEADING,
  INDEX_INTRO,
  INDEX_PATH_HEADING,
  INDEX_PATH_LEDE,
  INDEX_TABLE_HEADING,
  LIMIT_HEADING,
  NOT_A_TOOL_BODY,
  NOT_A_TOOL_HEADING,
  PRODUCTS,
  PRODUCT_ART,
  STATUS_LIVE,
  freeCostLabel,
  isFreeProduct,
  type Product,
} from "@/lib/content/products";



export default function ProductIndex() {
  const { pick, locale, path } = useCopy();

  const free = PRODUCTS.filter((p) => isFreeProduct(p.slug));
  const coachingQuote = RESULTS.find((r) => r.id === "coaching");
  const paid = PRODUCTS.filter((p) => !isFreeProduct(p.slug));

  /* A card, with the page's own figure at the top of it. The figure is the one
     on that product's page, at the same 4:3 it is drawn at, so a reader who
     taps through arrives at something they have already seen. */
  const card = (p: Product) => {
    const art = PRODUCT_ART[p.slug];
    const photo = PRODUCT_PHOTO[p.slug];
    return (
      <li key={p.slug}>
        <Link
          href={path(`/products/${p.slug}`)}
          className="card-plain group flex h-full flex-col overflow-hidden border border-line duration-[350ms] ease-nav transition-colors hover:border-line-strong"
        >
          {/* The clay scene from the product's own page since 03/11/2026,
              after Monzo's plans, where each one opens with its own object.
              The code-drawn figure stays as the fallback for a product
              without a scene. */}
          {photo ? (
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-canvas-soft">
              <Image
                src={photo.src}
                alt=""
                fill
                sizes="(min-width: 1200px) 30vw, 100vw"
                className="object-cover duration-[350ms] ease-nav transition-transform group-hover:scale-[1.03]"
              />
            </div>
          ) : (
            <div className="aspect-[16/9] w-full bg-canvas-soft p-4">
              <ProductDiagram figure={art.figure} title={pick(art.alt)} />
            </div>
          )}
          <div className="flex flex-1 flex-col px-6 py-6">
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-heading-sm">{pick(p.name)}</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-caption-strong ${
                  p.status === "soon"
                    ? "bg-canvas-soft text-ink-deep"
                    : "bg-primary text-on-primary"
                }`}
              >
                {pick(p.status === "soon" ? STATUS_SOON : STATUS_LIVE)}
              </span>
            </span>
            <span className="mt-3 text-body-md text-body">{pick(p.headline)}</span>
            <span className="mt-5 flex items-center gap-2 text-body-sm-strong text-ink-deep underline underline-offset-4">
              {pick(CARD_ACTION)}
              <span
                aria-hidden
                className="duration-[350ms] ease-nav transition-transform group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </span>
          </div>
        </Link>
      </li>
    );
  };


  return (
    <div className="w-full">
      {/* ------------------------------------------------------------ hero */}
      <Band block="B1" ground="canvas" width="wide">
        <div className="max-w-3xl">
          <p className={`text-mute-strong ${EYEBROW(locale)}`}>{pick(INDEX_EYEBROW)}</p>
          <h1 className={`mt-4 text-balance ${HERO_HEADING(locale)}`}>{pick(INDEX_HEADING)}</h1>
          <p className="mt-5 text-body-large text-on-surface-variant">{pick(INDEX_INTRO)}</p>
          <CallToAction page="/products" className="mt-8" />
        </div>
      </Band>

      {/* ------------------------------------------------------- catalogue */}
      <Band block="B4" ground="soft" width="wide">
        <div className="flex flex-col gap-12">
          <div>
            <h2 className="border-b border-line pb-3 text-body-md text-mute-strong">
              {pick(CATALOGUE_FREE)}
            </h2>
            <ul className="mt-6 grid gap-6 medium:grid-cols-2 large:grid-cols-3">
              {free.map(card)}
            </ul>
          </div>
          <div>
            <h2 className="border-b border-line pb-3 text-body-md text-mute-strong">
              {pick(CATALOGUE_PAID)}
            </h2>
            <ul className="mt-6 grid gap-6 medium:grid-cols-2">{paid.map(card)}</ul>
          </div>
        </div>
      </Band>

      {/* -------------------------------------------------------- coaching

          03/11/2026, Paul: the page sold five tools and left the coaching to
          a small outlined box above the footer, although its own heading
          promises "one conversation". The conversation now has a band of its
          own straight after the tools: the three services as the same clay
          cards the home page uses, then a client in her own words, then the
          way in. Every string was already written and reviewed. */}
      <Band block="B2" ground="canvas" width="wide">
        <div className="max-w-3xl">
          <h2 className={SECTION_HEADING(locale)}>{pick(NOT_A_TOOL_HEADING)}</h2>
          <p className="mt-4 text-body-large text-on-surface-variant">{pick(NOT_A_TOOL_BODY)}</p>
        </div>
        <CoachingCards />
        {coachingQuote && (
          <figure className="mt-12 grid items-center gap-6 rounded-3xl bg-canvas-dark px-8 py-9 ground-dark medium:grid-cols-[auto_1fr_auto] medium:px-10">
            <Image
              src="/home/testimonials/testimonial-photo-min.jpg"
              // Decorative: the name sits beside it.
              alt=""
              width={96}
              height={96}
              className="size-20 rounded-full object-cover"
            />
            <div>
              <blockquote className="text-body-large text-ink">&ldquo;{pick(coachingQuote.quote)}&rdquo;</blockquote>
              <figcaption className="mt-3 text-body-sm text-mute-strong">
                <span className="text-body-sm-strong text-ink">{pick(coachingQuote.who)}</span>
                {" · "}
                {pick(coachingQuote.role)}
              </figcaption>
            </div>
            <Link
              href={path(DESTINATIONS.coaching.href)}
              className="inline-flex min-h-12 items-center justify-self-start rounded-full bg-primary px-6 text-body-sm-strong text-on-primary duration-[350ms] ease-nav transition-colors hover:bg-primary-active"
            >
              {pick(DESTINATIONS.coaching.label)}
            </Link>
          </figure>
        )}
      </Band>

      {/* ------------------------------------------------------------ path

          B2 carries mechanism and artefact. The order is `PRODUCTS`' own, which
          is the order the catalogue was built in and the order the funnel runs
          in, so nothing here decides an order that is not already decided. */}
      <Band block="B2" ground="soft" width="wide">
        <h2 className={SECTION_HEADING(locale)}>{pick(INDEX_PATH_HEADING)}</h2>
        <p className="mt-4 max-w-2xl text-body-large text-on-surface-variant">
          {pick(INDEX_PATH_LEDE)}
        </p>
        <div className="mt-10 max-w-3xl">
          <Checklist
            items={PRODUCTS.map((p) => ({
              lead: pick(p.name),
              body: pick(p.howLede),
            }))}
          />
        </div>
      </Band>

      {/* ----------------------------------------------------------- table

          B6 carries artefact and limit, which is why the limit column is in it
          rather than being a band of its own: a comparison that lists what five
          things do and never what they do not is the comparison every product
          page on this site was written to avoid. */}
      <Band block="B6" ground="canvas" width="wide">
        <h2 className={SECTION_HEADING(locale)}>{pick(INDEX_TABLE_HEADING)}</h2>

        {/*
          03/11/2026, Paul's pick (1a) from the layout research: Teal's pricing
          table. White, products as columns, the questions as rows, and the
          place to start, EU Fit Check, picked out with a dark green outline
          rather than a colour. Each column opens with the product's clay photo
          as a small circle. Below `large` it becomes one block per product,
          the first one outlined the same way. Same strings as before.
        */}
        {(() => {
          const rows: { label: Copy; value: (p: Product) => string; strong?: boolean }[] = [
            { label: COL_WHO, value: (p) => pick(p.audience) },
            { label: COL_WHAT, value: (p) => pick(p.howLede) },
            { label: LIMIT_HEADING, value: (p) => pick(p.limit) },
            {
              label: COL_COST,
              value: (p) =>
                pick(isFreeProduct(p.slug) ? freeCostLabel(p.slug, CATALOGUE_FREE) : CATALOGUE_PAID),
              strong: true,
            },
          ];
          const head = (p: Product) => {
            const photo = PRODUCT_PHOTO[p.slug];
            return (
              <div className="flex items-center gap-3 large:flex-col large:items-start">
                {photo && (
                  <span className="relative block size-14 shrink-0 overflow-hidden rounded-full bg-canvas-soft">
                    <Image src={photo.src} alt="" fill sizes="56px" className="object-cover" />
                  </span>
                )}
                <div>
                  <Link
                    href={path(`/products/${p.slug}`)}
                    className="inline-flex min-h-6 items-center text-body-md-strong text-ink-deep underline underline-offset-4"
                  >
                    {pick(p.name)}
                  </Link>
                  {p.status === "soon" && (
                    <p className="mt-1 text-caption-strong text-mute-strong">{pick(STATUS_SOON)}</p>
                  )}
                </div>
              </div>
            );
          };
          const START = "eu-fit-check";
          return (
            <>
              {/* Wide: one white card, products across. */}
              <div className="card-plain relative mt-10 hidden border border-line p-2 large:block">
                <div
                  className="relative grid grid-cols-[150px_repeat(5,minmax(0,1fr))]"
                  style={{ gridTemplateRows: `repeat(${rows.length + 1}, auto)` }}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none rounded-2xl border-2 border-ink-deep"
                    style={{
                      gridColumn: `${PRODUCTS.findIndex((p) => p.slug === START) + 2}`,
                      gridRow: `1 / ${rows.length + 2}`,
                    }}
                  />
                  <p
                    className="self-end px-4 pb-4 text-caption-strong text-mute-strong"
                    style={{ gridColumn: 1, gridRow: 1 }}
                  >
                    {pick(COL_PRODUCT)}
                  </p>
                  {PRODUCTS.map((p, c) => (
                    <div key={p.slug} className="px-4 pt-5 pb-4" style={{ gridColumn: c + 2, gridRow: 1 }}>
                      {head(p)}
                    </div>
                  ))}
                  {rows.map((r, ri) => (
                    <div key={ri} className="contents">
                      <p
                        className="border-t border-line px-4 py-5 text-caption-strong text-mute-strong"
                        style={{ gridColumn: 1, gridRow: ri + 2 }}
                      >
                        {pick(r.label)}
                      </p>
                      {PRODUCTS.map((p, c) => (
                        <p
                          key={p.slug}
                          className={`border-t border-line px-4 py-5 ${
                            r.strong ? "text-body-md-strong text-ink-deep" : "text-body-sm text-body"
                          }`}
                          style={{ gridColumn: c + 2, gridRow: ri + 2 }}
                        >
                          {r.value(p)}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Narrow: one block per product, the place to start outlined. */}
              <ul className="mt-8 flex flex-col gap-4 large:hidden">
                {PRODUCTS.map((p) => (
                  <li
                    key={p.slug}
                    className={`card-plain px-5 py-5 ${
                      p.slug === START ? "border-2 border-ink-deep" : "border border-line"
                    }`}
                  >
                    {head(p)}
                    <dl className="mt-4 flex flex-col gap-3">
                      {rows.map((r, ri) => (
                        <div key={ri} className="border-t border-line pt-3">
                          <dt className="text-caption-strong text-mute-strong">{pick(r.label)}</dt>
                          <dd
                            className={`mt-1 ${
                              r.strong ? "text-body-md-strong text-ink-deep" : "text-body-md text-body"
                            }`}
                          >
                            {r.value(p)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </li>
                ))}
              </ul>
            </>
          );
        })()}
      </Band>

      {/* ----------------------------------------------------------- close */}
      <Band block="B8" ground="dark" align="center" className="text-center">
        <h2 className={SECTION_HEADING(locale)}>{pick(CLOSE_HEADING)}</h2>
        <p className="mx-auto mt-4 max-w-xl text-body-large">{pick(CLOSE_BODY)}</p>
        <CallToAction page="/products" align="center" show="primary" className="mt-8" />
      </Band>
    </div>
  );
}
