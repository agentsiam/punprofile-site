"use client";

/**
 * What you can get. Added 24/08/2026, replacing two sections at once.
 *
 * It replaces the old "three things we help with", which read `services.ts` and
 * so named only the 1:1 coaching half, and the old cost table, which `/pricing`
 * has carried with real numbers since 23/08/2026.
 *
 * **Read from `products.ts`, never restated.** Same rule the old section
 * followed for `services.ts`: a third rendering of the catalogue is a third
 * wording of it, and this one would drift first because it is the page nobody
 * opens when a product changes.
 *
 * **Split by what it costs, not by what it is**, because that is the question a
 * stranger arriving from a job post is actually holding. Free first: a reader
 * who learns the first two cost nothing is more likely to read the third.
 *
 * `status: "soon"` shows the same `STATUS_SOON` label the catalogue page and
 * the product pages use, so a candidate cannot tap through to a page and
 * discover there what this page could have told them. It was `COMING_SOON`, the
 * full sentence, until 06/09/2026: see the note on `STATUS_SOON` in
 * `products.ts` for why a promise and a label are two strings.
 */

import Image from "next/image";
import Link from "next/link";
import { PRODUCT_PHOTO } from "@/components/features/products/productPhotos";
import { useCopy } from "@/components/LocaleProvider";
import { PRODUCTS, STATUS_SOON, isFreeProduct, type Product } from "@/lib/content/products";
import {
  CATALOGUE_FREE,
  CATALOGUE_PAID,
  CATALOGUE_PRICE_LINE,
} from "@/lib/content/home";
import { DESTINATIONS } from "@/lib/content/cta";

/*
 * Free versus token-priced moved into `products.ts` on 06/09/2026, as
 * `FREE_SLUGS` and `isFreeProduct`, when `/products` needed the same answer.
 * Two copies of that set would be two answers to which column a product is in,
 * and the second one edited would be wrong silently, on whichever page nobody
 * had open.
 *
 * The reason it is not a field on the product is unchanged and is worth keeping
 * here: `products.ts` has no price field on purpose. `/pricing` owns every
 * number and a second place holding what something costs is a second place for
 * it to be wrong. What the set holds is not a price, it is which of two columns
 * a product belongs in, which is a fact about the catalogue rather than about
 * the money.
 */

export default function Catalogue() {
  const { pick, path } = useCopy();

  const free = PRODUCTS.filter((p) => isFreeProduct(p.slug));
  const paid = PRODUCTS.filter((p) => !isFreeProduct(p.slug));

  /*
   * Bento cards, 03/11/2026 (Wise home in the layout research): each product
   * shows its own clay photograph on a tinted ground, and the tints rotate so
   * two neighbours never share one. The photographs are the product pages' own,
   * from `productPhotos.ts`, so a product looks the same here as on its page.
   */
  const TINTS = [
    "bg-cyan-pale text-on-cyan-pale",
    "bg-orange-pale text-on-orange-pale",
    "bg-yellow-pale text-on-yellow-pale",
  ];

  const card = (
    slug: string,
    name: string,
    headline: string,
    soon: boolean,
    tint: string,
    note?: Product["costLabel"],
    side = false,
  ) => {
    const photo = PRODUCT_PHOTO[slug];
    return (
      <li key={slug}>
        <Link
          href={path(`/products/${slug}`)}
          className={`group flex h-full flex-col overflow-hidden rounded-3xl ${tint} ${side ? "medium:flex-row" : ""}`}
        >
          {photo && (
            <span
              className={`relative block w-full shrink-0 overflow-hidden ${
                side ? "aspect-[4/3] medium:aspect-square medium:w-2/5" : "aspect-[4/3]"
              }`}
            >
              <Image
                src={photo.src}
                // Decorative: the product name under it carries the meaning.
                alt=""
                fill
                sizes="(max-width: 840px) 100vw, 33vw"
                className="object-cover duration-[350ms] ease-nav transition-transform group-hover:scale-[1.03]"
              />
            </span>
          )}
          <span className={`flex flex-1 flex-col px-6 py-6 ${side ? "medium:justify-center" : ""}`}>
            <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-heading-sm">{name}</span>
              {soon && <span className="text-caption-strong">{pick(STATUS_SOON)}</span>}
              {/* A free product only a buyer can open says so under the "Free"
                  heading, rather than letting the heading promise it to everyone. */}
              {note && <span className="text-caption-strong">{pick(note)}</span>}
            </span>
            <span className="mt-2 text-body-md">{headline}</span>
          </span>
        </Link>
      </li>
    );
  };

  return (
    <div className="mt-8 flex flex-col gap-10">
      <div>
        <h3 className="border-b border-line pb-3 text-body-md text-mute-strong">{pick(CATALOGUE_FREE)}</h3>
        <ul className="mt-4 grid gap-4 medium:grid-cols-3">
          {free.map((p, i) =>
            card(p.slug, pick(p.name), pick(p.headline), p.status === "soon", TINTS[i % 3], p.costLabel),
          )}
        </ul>
      </div>

      <div>
        <h3 className="border-b border-line pb-3 text-body-md text-mute-strong">{pick(CATALOGUE_PAID)}</h3>
        <ul className="mt-4 grid gap-4 medium:grid-cols-2">
          {paid.map((p, i) =>
            card(p.slug, pick(p.name), pick(p.headline), p.status === "soon", TINTS[(i + 1) % 3], undefined, true),
          )}
        </ul>
        {/* The only price on this page, and it is the unit rather than a pack.
            Paul, 24/08/2026: one number and a link. The unit was held flat at
            50 THB when the packs were decided precisely so that it can be said
            on its own like this and stay true whichever pack someone buys.

            B6 in the block library, 25/08/2026: a fee is a ROW. A chip
            introduces it, the sentence sits in the middle, the way to the full
            prices sits at the end, and hairlines close it top and bottom. It
            was a paragraph followed by a link, which on a page of cards read as
            small print rather than as the price.

            The sentence is not split into a label and a value. It is one string
            in `home.ts` in both languages, and Thai puts the number in its own
            place; pulling "50" out of it here would be inventing copy and would
            break the moment the Thai is reviewed. */}
        <div className="mt-8 border-y border-line py-6">
          {/* Below `medium` the link takes its own row under the sentence. As a
              flex row the sentence was squeezed to about six words a line
              beside the button on a phone (site audit, 22/09/2026). */}
          <div className="grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-4 medium:flex medium:flex-wrap">
            <span
              aria-hidden
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-pale text-on-primary-pale"
            >
              &#3647;
            </span>
            <p className="min-w-0 flex-1 text-body-md-strong text-ink-deep">
              {pick(CATALOGUE_PRICE_LINE)}
            </p>
            <Link
              href={path(DESTINATIONS.pricing.href)}
              className="col-span-2 inline-flex min-h-12 shrink-0 items-center justify-self-start rounded-full border border-line-strong px-5 text-body-sm-strong text-ink-deep duration-[350ms] ease-nav transition-colors hover:bg-primary-pale"
            >
              {pick(DESTINATIONS.pricing.label)}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
