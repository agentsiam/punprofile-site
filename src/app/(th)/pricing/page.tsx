"use client";

/**
 * `/pricing`. Added 23/08/2026.
 *
 * **Its shape is Careersy's, read off the real page rather than the idea of it,
 * and the thing worth carrying over is what its cards are.** Careersy's four
 * cards are Lite, Starter, Pro and Power: they are PLANS, not products, and its
 * own subhead says every plan has every feature. So nothing on that page
 * duplicates a product page.
 *
 * That is why this page does not carry a card per product. Products have their
 * own pages under the Products menu; a card repeating a product's photo, title
 * and paragraph one click from the page that does it properly is the duplication
 * Paul caught. The cards here are token packs.
 *
 * **Free sits above the packs and not among them**, for the same reason Careersy
 * explains free credits separately rather than as a fifth card: a free card
 * standing beside a paid pack invites a comparison between things that are not
 * alternatives.
 *
 * **This page prints the only prices on the site.** Every product page carries
 * none, decided 23/08/2026, because a number repeated across six marketing pages
 * is six places for it to drift.
 */

import Image from "next/image";
import { useCopy } from "@/components/LocaleProvider";
import CallToAction from "@/components/CallToAction";
import TokenCalculator from "@/components/features/pricing/TokenCalculator";
import TokenCoin from "@/components/features/pricing/TokenCoin";
import {
  FREE_HEADING,
  FREE_ITEMS,
  FREE_VALUE,
  INCLUDES,
  INCLUDES_HEADING,
  LIMITS_HEADING,
  NOTHING_FOUND,
  PACKS,
  PACKS_HEADING,
  PRICING_QUESTIONS,
  RECOMMENDED_BADGE,
  TOKEN_BODY,
  TOKEN_HEADING,
  TOKEN_ROWS,
  TOKEN_UNIT,
  PRICING_HEADING,
  PRICING_INTRO,
} from "@/lib/content/pricing";
import { STATUS_SOON, freeCostLabel, isFreeProduct, productBySlug } from "@/lib/content/products";
import type { Copy } from "@/lib/content/copy";
import Band from "@/components/Band";
import { HERO_HEADING, SECTION_HEADING } from "@/lib/content/footer";

/**
 * The page's order since 02/11/2026, and the order is the argument:
 * what is free, what a token buys and what it does not, then the packs, then
 * the picker. The limits sit above every ask, which is slot 6 before slot 8 in
 * `Narrative_System.md`; before this the packs asked three times and the only
 * limit came after them.
 *
 * Free products beyond the two in `FREE_ITEMS` come from `products.ts`, which
 * owns which products are free, so this page cannot list fewer than it says.
 */
const FREE_PRODUCT_SLUGS = ["cv-check", "job-search-dashboard"] as const;

/** The pile each pack opens with: the three sizes of the same coin. */
const PACK_ART: Record<string, { src: string; w: number; h: number }> = {
  starter: { src: "/pricing/pricing-pack-starter.png", w: 481, h: 539 },
  standard: { src: "/pricing/pricing-pack-standard.png", w: 560, h: 365 },
  serious: { src: "/pricing/pricing-pack-serious.png", w: 528, h: 560 },
};

/** One spec row (B6): label and detail left, value right, hairline between. */
function SpecRow({
  label,
  detail,
  value,
  coin,
}: {
  label: string;
  detail?: string;
  value?: string;
  coin?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-outline-variant py-4 last:border-b-0">
      <div>
        <p className="text-heading-sm text-on-surface">{label}</p>
        {detail && <p className="mt-1 text-body-large text-on-surface-variant">{detail}</p>}
      </div>
      {value && (
        <p className="flex shrink-0 items-center gap-2 text-title-medium text-on-surface">
          {coin && <TokenCoin />}
          {value}
        </p>
      )}
    </div>
  );
}

export default function PricingPage() {
  const { pick, locale } = useCopy();
  const tokens = (n: number) => `${n} ${pick(n === 1 ? TOKEN_UNIT.one : TOKEN_UNIT.many)}`;

  const freeProducts = FREE_PRODUCT_SLUGS.map((slug) => productBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => !!p && isFreeProduct(p.slug));

  const limits: Copy[] = [
    NOTHING_FOUND,
    productBySlug("matched-jobs")?.limit,
    productBySlug("fit-report")?.limit,
  ].filter((c): c is Copy => !!c);

  return (
    <div className="w-full">
      {/* The hero on lime since 03/11/2026, split with a clay scene, after
          Wise's own pricing hero. The page's only fixed high-energy ground: the
          recommended pack below is a dark CARD, not a band. Text inside takes
          the roles `.ground-fixed` pins (`ink`, `body`). */}
      <Band block="B2" ground="brand" width="wide">
        <div className="grid items-center gap-10 large:grid-cols-[1fr_1fr]">
          <div>
            <h1 className={HERO_HEADING(locale)}>{pick(PRICING_HEADING)}</h1>
            <p className="mt-4 max-w-xl text-body-large text-body">{pick(PRICING_INTRO)}</p>
          </div>
          <div className="overflow-hidden rounded-3xl">
            <Image
              src="/pricing/pricing-hero-candidate-tokens.jpg"
              alt=""
              width={1200}
              height={896}
              priority
              sizes="(min-width: 1200px) 50vw, 100vw"
              className="aspect-square h-auto w-full object-cover medium:aspect-[4/3]"
            />
          </div>
        </div>
      </Band>

      {/* ------------------------------------------------------------ free */}
      <Band block="B6" ground="soft" width="wide">
        <div className="flex items-end justify-between gap-6">
          <h2 className={SECTION_HEADING(locale)}>{pick(FREE_HEADING)}</h2>
          {/* Spot art, after Notion's corner illustrations: the existing
              magnifier mascot, which is what free reading looks like. */}
          <Image
            src="/mascot-magnifier.png"
            alt=""
            width={300}
            height={160}
            className="-mb-3 hidden h-24 w-auto expanded:block"
          />
        </div>
        <div className="card-plain mt-5 px-6 py-2">
          {FREE_ITEMS.map((item) => (
            <SpecRow
              key={item.id}
              label={pick(item.name)}
              detail={pick(item.body)}
              value={pick(FREE_VALUE)}
            />
          ))}
          {freeProducts.map((p) => (
            <SpecRow
              key={p.slug}
              label={p.status === "soon" ? `${pick(p.name)} · ${pick(STATUS_SOON)}` : pick(p.name)}
              detail={pick(p.howLede)}
              value={pick(freeCostLabel(p.slug, FREE_VALUE))}
            />
          ))}
        </div>
      </Band>

      {/* ---------------------------------- what a token buys, and does not */}
      <Band block="B6" ground="canvas" width="wide">
        <h2 className={SECTION_HEADING(locale)}>{pick(TOKEN_HEADING)}</h2>
        <p className="mt-3 max-w-2xl text-body-large text-on-surface-variant">{pick(TOKEN_BODY)}</p>
        {/* The rows beside the Fit Report call, after Preply. The call is the
            only priced thing on the page with people in it, so the page shows
            them. Square art since 03/11/2026, when it was regenerated with the
            real eight-axis Fit Report chart on the desk. */}
        <div className="mt-5 grid items-start gap-6 large:grid-cols-[1.5fr_1fr]">
        <div className="card-outlined px-6 py-2">
          {TOKEN_ROWS.map((row, i) => (
            <SpecRow
              key={i}
              label={pick(row.label)}
              detail={pick(row.detail)}
              value={tokens(row.tokens)}
              coin
            />
          ))}
        </div>

          <Image
            src="/pricing/pricing-fit-report-interview.jpg"
            alt=""
            width={1024}
            height={1024}
            sizes="(min-width: 1200px) 420px, 100vw"
            className="aspect-[4/3] h-auto w-full rounded-3xl object-cover large:aspect-square"
          />
        </div>

        <h3 className="mt-10 text-heading-sm text-on-surface">{pick(LIMITS_HEADING)}</h3>
        <ul className="mt-4 flex flex-col gap-2.5">
          {limits.map((item, i) => (
            <li key={i} className="flex gap-3 text-body-large text-on-surface">
              <span aria-hidden className="mt-2 block size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{pick(item)}</span>
            </li>
          ))}
        </ul>
      </Band>

      {/* ----------------------------------------------------------- packs */}
      <Band block="B4" ground="soft" width="wide">
        <h2 className={SECTION_HEADING(locale)}>{pick(PACKS_HEADING)}</h2>

        {/* No `items-start`: the default stretch makes the three cards share
            the tallest, and the card is `flex flex-col` with an `mt-auto`
            action, so the extra height lands in the text rather than above the
            button. Same reasoning as the services grid, 17/08/2026. */}
        <div className="mt-10 grid gap-6 large:grid-cols-3 large:items-stretch">
          {PACKS.map((pack) => {
            const art = PACK_ART[pack.id];
            /* The recommended pack is lifted, after Duolingo: a dark card in a
               white row, with the badge as a tab on its top edge. `.ground-dark`
               pins every role inside it, so the same classes read on it. */
            return (
              <section
                key={pack.id}
                className={`relative flex flex-col rounded-large border px-6 pb-7 pt-5 ${
                  pack.recommended
                    ? "ground-dark border-transparent bg-canvas-dark large:-my-4 large:pb-11 large:pt-9"
                    : "border-outline-variant bg-surface"
                }`}
              >
                {pack.recommended && (
                  <span className="absolute -top-3.5 left-6 rounded-full bg-yellow-pale px-3 py-1 text-body-medium text-on-yellow-pale">
                    {pick(RECOMMENDED_BADGE)}
                  </span>
                )}
                {art && (
                  <Image
                    src={art.src}
                    alt=""
                    width={art.w}
                    height={art.h}
                    sizes="240px"
                    className="mx-auto h-36 w-auto object-contain"
                  />
                )}
                <h3 className="mt-4 text-title-large text-on-surface">{pick(pack.name)}</h3>

                <p className="mt-1 text-body-large text-on-surface-variant">{pick(pack.tagline)}</p>

                <p className="mt-5 text-headline-small text-on-surface">
                  {pack.thb.toLocaleString("en-US")}
                  {/* The unit is spelled out rather than abbreviated, and it is
                      the only place THB appears on a card. */}
                  <span className="ml-1 text-body-large text-on-surface-variant">THB</span>
                </p>
                <p className="mt-1 flex items-center gap-2 text-body-large text-on-surface-variant">
                  <TokenCoin size={18} />
                  {tokens(pack.tokens)}
                </p>

                <p className="mt-5 flex-1 text-body-large text-on-surface-variant">{pick(pack.who)}</p>

                {/* All three buttons are the same action to the same place, which
                    is rule 1 in `cta.ts`: one action may repeat once per card. */}
                <CallToAction page="/pricing" className="mt-auto pt-7" show="primary" />
              </section>
            );
          })}
        </div>

        {/* The terms every pack shares, under the packs they qualify. */}
        <h3 className="mt-10 text-heading-sm text-on-surface">{pick(INCLUDES_HEADING)}</h3>
        <ul className="mt-4 grid gap-2.5 large:grid-cols-2">
          {INCLUDES.map((item, i) => (
            <li key={i} className="flex gap-3 text-body-large text-on-surface">
              <span aria-hidden className="mt-2 block size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{pick(item)}</span>
            </li>
          ))}
        </ul>
      </Band>

      {/* ------------------------------------------------------ pack picker */}
      <Band block="B2" ground="canvas" width="wide">
        <TokenCalculator />
      </Band>

      {/* ---------------------------------------- questions, then the close */}
      <Band block="B5" ground="soft" width="wide">
        {PRICING_QUESTIONS.map((item, i) => (
          <div key={i} className="border-b border-outline-variant py-6 last:border-b-0">
            <h3 className="text-heading-sm">{pick(item.q)}</h3>
            {item.a.map((line, j) => (
              <p key={j} className="mt-3 text-body-large text-on-surface-variant">
                {pick(line)}
              </p>
            ))}
          </div>
        ))}
        {/* The page's secondary, exactly once, as the text link rule 5 makes
            it. It used to sit alone in a B8 dark panel, a block built for a
            heading and a filled pill, holding one underlined link. */}
        <CallToAction page="/pricing" className="mt-6" show="secondary" />
      </Band>
    </div>
  );
}
