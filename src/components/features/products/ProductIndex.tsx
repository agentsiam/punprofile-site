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

import Link from "next/link";
import { useCopy } from "@/components/LocaleProvider";
import Band from "@/components/Band";
import CallToAction from "@/components/CallToAction";
import Checklist from "@/components/blocks/Checklist";
import ProductDiagram from "@/components/features/products/ProductDiagram";
import { EYEBROW, HERO_HEADING, SECTION_HEADING } from "@/lib/content/footer";
import { CATALOGUE_FREE, CATALOGUE_PAID } from "@/lib/content/home";
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
  isFreeProduct,
  type Product,
} from "@/lib/content/products";

const GRID = "large:grid-cols-[0.9fr_1fr_1.3fr_1.3fr_0.7fr]";

export default function ProductIndex() {
  const { pick, locale, path } = useCopy();

  const free = PRODUCTS.filter((p) => isFreeProduct(p.slug));
  const paid = PRODUCTS.filter((p) => !isFreeProduct(p.slug));

  /* A card, with the page's own figure at the top of it. The figure is the one
     on that product's page, at the same 4:3 it is drawn at, so a reader who
     taps through arrives at something they have already seen. */
  const card = (p: Product) => {
    const art = PRODUCT_ART[p.slug];
    return (
      <li key={p.slug}>
        <Link
          href={path(`/products/${p.slug}`)}
          className="card-plain group flex h-full flex-col overflow-hidden border border-line duration-[350ms] ease-nav transition-colors hover:border-line-strong"
        >
          <div className="aspect-[16/9] w-full bg-canvas-soft p-4">
            <ProductDiagram figure={art.figure} title={pick(art.alt)} />
          </div>
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

  const cell = (label: string, value: string, strong = false) => (
    <div>
      <p className="text-caption-strong text-mute-strong large:hidden">{label}</p>
      <p className={`mt-1 large:mt-0 ${strong ? "text-body-md-strong text-ink-deep" : "text-body-md text-body"}`}>
        {value}
      </p>
    </div>
  );

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

      {/* ------------------------------------------------------------ path

          B2 carries mechanism and artefact. The order is `PRODUCTS`' own, which
          is the order the catalogue was built in and the order the funnel runs
          in, so nothing here decides an order that is not already decided. */}
      <Band block="B2" ground="canvas" width="wide">
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
      <Band block="B6" ground="soft" width="wide">
        <h2 className={SECTION_HEADING(locale)}>{pick(INDEX_TABLE_HEADING)}</h2>

        <div className={`mt-10 hidden gap-6 border-b border-line-strong pb-3 large:grid ${GRID}`}>
          {[COL_PRODUCT, COL_WHO, COL_WHAT, LIMIT_HEADING, COL_COST].map((c, i) => (
            <p key={i} className="text-caption-strong text-mute-strong">
              {pick(c)}
            </p>
          ))}
        </div>

        <div className="flex flex-col">
          {PRODUCTS.map((p) => (
            <div
              key={p.slug}
              className={`grid gap-4 border-b border-line py-7 large:items-start large:gap-6 ${GRID}`}
            >
              <div>
                <Link
                  href={path(`/products/${p.slug}`)}
                  /* `inline-flex min-h-6` for the same reason as the footer
                     links: an inline text link is 17px tall at this size and
                     WCAG 2.2 sets the floor at 24. */
                  className="inline-flex min-h-6 items-center text-body-md-strong text-ink-deep underline underline-offset-4"
                >
                  {pick(p.name)}
                </Link>
                {p.status === "soon" && (
                  <p className="mt-1 text-caption-strong text-mute-strong">{pick(STATUS_SOON)}</p>
                )}
              </div>
              {cell(pick(COL_WHO), pick(p.audience))}
              {cell(pick(COL_WHAT), pick(p.howLede))}
              {cell(pick(LIMIT_HEADING), pick(p.limit))}
              {cell(pick(COL_COST), pick(isFreeProduct(p.slug) ? CATALOGUE_FREE : CATALOGUE_PAID), true)}
            </div>
          ))}
        </div>
      </Band>

      {/* --------------------------------------------------- the sixth thing */}
      <Band block="B4" ground="canvas">
        <div className="card-outlined px-8 py-9">
          <h2 className="text-heading-sm">{pick(NOT_A_TOOL_HEADING)}</h2>
          <p className="mt-3 text-body-large text-on-surface-variant">{pick(NOT_A_TOOL_BODY)}</p>
          <Link
            href={path(DESTINATIONS.coaching.href)}
            className="mt-6 inline-flex min-h-12 items-center rounded-full border border-line-strong px-6 text-body-sm-strong text-ink-deep duration-[350ms] ease-nav transition-colors hover:bg-primary-pale"
          >
            {pick(DESTINATIONS.coaching.label)}
          </Link>
        </div>
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
