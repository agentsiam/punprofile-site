"use client";

/**
 * "You do not need to know which service you need", as tabs. Rebuilt
 * 03/11/2026 from the layout research (Wise home's "for whom" tabs).
 *
 * The reader picks the line that sounds like them and the panel beside it shows
 * where that goes, with the picture of the thing they would be using. Same six
 * lines and the same six bodies as before, out of `TRIAGE` in `home.ts`: Paul's
 * call of 03/11/2026 was to merge this list into the product picture, not to
 * write new copy for it.
 *
 * **A disclosure, not an ARIA tablist.** On a phone the panel opens directly
 * under the line that was tapped, which a tablist cannot do without moving
 * focus far down the page; on a wide screen the same panel sits in the right
 * column. Each line is a button with `aria-expanded`, which reads correctly in
 * both layouts.
 *
 * Pictures: a product photograph for a product, the coaching cutouts from the
 * service cards for coaching, so nothing here is art made only for this block.
 */

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCopy } from "@/components/LocaleProvider";
import { TRIAGE, CATALOGUE_FREE, CATALOGUE_PAID } from "@/lib/content/home";
import { DESTINATIONS } from "@/lib/content/cta";
import { productBySlug, isFreeProduct } from "@/lib/content/products";
import { PRODUCT_PHOTO } from "@/components/features/products/productPhotos";

/** Picture per line, by id. `cutout` pictures sit whole on a tint; photos fill. */
const PICTURE: Record<string, { src: string; cutout?: boolean }> = {
  "no-callbacks": { src: PRODUCT_PHOTO["cv-check"].src },
  "no-offers": { src: "/home/service-applications.png", cutout: true },
  "cv-not-europe": { src: PRODUCT_PHOTO["cv-check"].src },
  "visa-unknown": { src: PRODUCT_PHOTO["eu-fit-check"].src },
  "no-target": { src: "/home/service-direction.png", cutout: true },
  "dormant-linkedin": { src: PRODUCT_PHOTO["eu-fit-check"].src },
};

/** The assessment is the EU Fit Check product, so it takes that product's tag. */
const slugFor = (href: string): string | undefined => {
  if (href === DESTINATIONS.assess.href) return "eu-fit-check";
  const m = href.match(/^\/products\/([a-z-]+)$/);
  return m ? m[1] : undefined;
};

export default function Triage() {
  const { pick, path } = useCopy();
  const [open, setOpen] = useState<string>(TRIAGE[0].id);

  const panel = (id: string, placement: "inline" | "side") => {
    const item = TRIAGE.find((t) => t.id === id)!;
    const slug = slugFor(item.href);
    const product = slug ? productBySlug(slug) : undefined;
    const pic = PICTURE[item.id];
    const label =
      item.href === DESTINATIONS.assess.href
        ? pick(DESTINATIONS.assess.label)
        : item.href === DESTINATIONS.coaching.href
          ? pick(DESTINATIONS.coaching.label)
          : product
            ? pick(product.name)
            : "";

    return (
      <div
        id={`triage-${item.id}-${placement}`}
        className="card-plain flex h-full flex-col overflow-hidden border border-line"
      >
        <div
          className={`relative aspect-[4/3] w-full ${pic.cutout ? "bg-orange-pale" : ""}`}
        >
          <Image
            src={pic.src}
            // Decorative: the line and the body beside it carry the meaning.
            alt=""
            fill
            sizes="(max-width: 1200px) 100vw, 560px"
            className={pic.cutout ? "object-contain p-6" : "object-cover"}
          />
        </div>
        <div className="flex flex-1 flex-col px-6 py-6 medium:px-8">
          {product && (
            <p className="flex flex-wrap items-center gap-2 text-caption-strong">
              <span className="rounded-full bg-cyan-pale px-3 py-1 text-on-cyan-pale">
                {pick(product.name)}
              </span>
              <span className="rounded-full bg-yellow-pale px-3 py-1 text-on-yellow-pale">
                {pick(isFreeProduct(product.slug) ? CATALOGUE_FREE : CATALOGUE_PAID)}
              </span>
            </p>
          )}
          <p className="mt-4 text-body-large text-body">{pick(item.body)}</p>
          <Link
            href={path(item.href)}
            className="mt-6 inline-flex min-h-12 items-center gap-2 self-start rounded-full border border-line-strong px-5 text-body-sm-strong text-ink-deep duration-[350ms] ease-nav transition-colors hover:bg-primary-pale"
          >
            {label}
            <span aria-hidden>&rarr;</span>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8 grid gap-6 large:grid-cols-[1fr_1.1fr] large:items-start">
      <ul className="flex flex-col gap-3">
        {TRIAGE.map((item) => {
          const on = item.id === open;
          return (
            <li key={item.id}>
              <button
                type="button"
                aria-expanded={on}
                aria-controls={`triage-${item.id}-inline triage-${item.id}-side`}
                onClick={() => setOpen(item.id)}
                className={`flex min-h-16 w-full items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left text-body-md-strong duration-[350ms] ease-nav transition-colors ${
                  on
                    ? "border-on-primary-pale bg-primary-pale text-on-primary-pale"
                    : "border-line bg-canvas text-ink-deep hover:border-line-strong"
                }`}
              >
                <span className="min-w-0">{pick(item.line)}</span>
                <span
                  aria-hidden
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full duration-[350ms] ease-nav transition-transform ${
                    on ? "bg-canvas text-ink-deep" : "bg-primary-pale text-on-primary-pale"
                  }`}
                >
                  &rarr;
                </span>
              </button>
              {on && <div className="mt-3 large:hidden">{panel(item.id, "inline")}</div>}
            </li>
          );
        })}
      </ul>
      <div className="hidden large:sticky large:top-24 large:block">{panel(open, "side")}</div>
    </div>
  );
}
