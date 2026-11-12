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
  PACK_BUYS,
  PACK_BUYS_ROLES,
  PACKS,
  PACKS_HEADING,
  ROLE_UNIT,
  PRICING_QUESTIONS,
  RECOMMENDED_BADGE,
  TOKEN_BODY,
  TOKEN_HEADING,
  TOKEN_ROWS,
  TOKEN_UNIT,
  PRICING_HEADING,
  PRICING_INTRO,
} from "@/lib/content/pricing";
import {
  DASH_EXAMPLE_NOTE,
  STATUS_SOON,
  freeCostLabel,
  isFreeProduct,
  productBySlug,
} from "@/lib/content/products";
import type { Copy } from "@/lib/content/copy";
import Band from "@/components/Band";
/* The bonus panel's coaches. Both already render on the home page and
   `/coaching` from these same records, which is the point: /pricing is not
   allowed a second, looser version of who the coaches are. */
import { COACHES } from "@/lib/content/coaching";
import { COACH_PHOTO } from "@/components/features/coaches/CoachCards";
import { TOKEN_PRICE } from "@/lib/tokenPrices";
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

/**
 * `{price}` and `{count}` in a pack's `includes` line, substituted here.
 *
 * The lines state the Fit Report's price and what the pack has left after it,
 * and neither figure is written into the copy: `TOKEN_PRICE` owns the first and
 * the second is arithmetic on it. A card that typed them would be a third and a
 * fourth place for a price to go stale, on the one page that prints prices.
 */
const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));

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
  const roles = (n: number) => `${n} ${pick(n === 1 ? ROLE_UNIT.one : ROLE_UNIT.many)}`;

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
            {/* Added 12/11/2026 from a UX review Paul accepted. The hero was a
                heading, a paragraph and a photograph, and the first button on
                the page was four screens down inside the cards: a reader the
                headline had already convinced had nowhere to go.

                It is the page's OWN action, not a new one. `cta.ts` rule 1
                allows one action to repeat and refuses a second, so this is the
                same `contact` the three cards carry, rendered where a convinced
                reader happens to be. A "compare packs" button would have been a
                second destination and the checker would have said so.

                No class names it dark: the band is `ground="brand"`, which
                carries `.ground-fixed`, and inside that `action` is pinned to
                the green-black. The lime pill would be invisible on lime (R21).
            */}
            <CallToAction page="/pricing" className="mt-8" show="primary" />
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

          {/* The product, not a picture of the idea of it. 12/11/2026, from a
              UX review Paul accepted: this slot held a clay render of an
              interview, which decorated the token table without explaining
              anything in it. The row above says a matched role is sent to your
              Job Search Dashboard; this is that dashboard, the same screenshot
              the dashboard's own page uses, in the reader's language.

              `DASH_EXAMPLE_NOTE` comes with it and is not optional. The shot is
              a real render of `CandidateApp` with an example account, so without
              the note a stranger's name and employers on a sales page read as a
              real client's. */}
          <figure>
            <div className="overflow-hidden rounded-3xl border border-line">
              <Image
                src={`/products/dashboard/dash-step-feed-${locale}.jpg`}
                alt={pick(productBySlug("job-search-dashboard")?.name ?? DASH_EXAMPLE_NOTE)}
                width={1600}
                height={1000}
                sizes="(min-width: 1200px) 420px, 100vw"
                className="h-auto w-full"
              />
            </div>
            <figcaption className="mt-2 text-body-sm text-mute-strong">
              {pick(DASH_EXAMPLE_NOTE)}
            </figcaption>
          </figure>
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

        {/* `items-start`, reversing 17/08/2026. That note said stretching the
            three cards to the tallest put the extra height in the text rather
            than above the button, and it was right until the cards stopped
            carrying the same amount: the Serious card now holds two panels and
            the Starter card holds four lines, so stretching bought Starter a
            hundred and fifty pixels of nothing between its offer and its
            action. A card ends where its content ends. 12/11/2026. */}
        <div className="mt-10 grid gap-6 large:grid-cols-3 large:items-start">
          {PACKS.map((pack) => {
            const art = PACK_ART[pack.id];
            /* **The recommended card stopped being a dark slab, 12/11/2026.**
               It was lifted, after Duolingo: dark ground, taller than its
               neighbours, badge as a tab on the edge. What broke it is that the
               argument moved: the Serious card now carries the interview and the
               promotion, so the tallest card was the dark one with the least on
               it and the row had two cards competing to be looked at.

               A border and the badge now carry the emphasis, which is what the
               review asked for and is also the quieter answer: `line-strong` is
               a boundary role that passes the 3:1 non-text floor, so the card is
               marked without being shouted. The dark ground is not gone from the
               page, it is back to meaning what `design.md` says it means. */
            return (
              <section
                key={pack.id}
                className={`relative flex flex-col rounded-large border bg-surface px-6 pb-7 pt-5 ${
                  pack.recommended ? "border-line-strong" : "border-outline-variant"
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

                {/* 32px, not 26. The price is what a pricing card is for and it
                    was two points above the body copy under it. 12/11/2026. */}
                <p className="mt-5 text-display-sm text-on-surface">
                  {pack.thb.toLocaleString("en-US")}
                  {/* The unit is spelled out rather than abbreviated, and it is
                      the only place THB appears on a card. */}
                  <span className="ml-1 text-body-large text-on-surface-variant">THB</span>
                </p>
                <p className="mt-1 flex items-center gap-2 text-body-large text-on-surface-variant">
                  <TokenCoin size={18} />
                  {tokens(pack.tokens)}
                </p>


                {/* What the tokens buy, on all three cards and in the same
                    place on each. Added 12/11/2026 from a UX review Paul
                    accepted; it replaces the itemised list that only the Serious
                    card carried, and it is better than that list was for two
                    reasons.

                    One, a reader at three cards is asking which, and a question
                    asked of three cards has to be answered by three cards in the
                    same words and the same position. Two, the list said "what
                    you get in this pack" and named a Fit Report AND thirteen
                    roles, which is one of the two things 33 tokens can do, not
                    the pack's contents. A pack is a balance. This line says `or`
                    and states both uses, which is what is actually true.

                    Which line a card takes is arithmetic, not an id: a pack that
                    cannot reach the Fit Report's price cannot offer the choice.
                    Today that is Starter alone, and if a price moves it moves on
                    its own.

                    The detail under it is `TOKEN_ROWS[1].detail`, already on this
                    page and already approved, shown on the cards where a Fit
                    Report is actually reachable. A reader should not have to
                    scroll back up to find out what the thirty minutes are. */}
                {(() => {
                  const rest = pack.tokens - TOKEN_PRICE.fitReport;
                  const reaches = rest >= 0;
                  return (
                    <>
                      <p className="mt-4 text-body-large text-on-surface">
                        {fill(pick(reaches ? PACK_BUYS : PACK_BUYS_ROLES), {
                          count: pack.tokens,
                          rest: roles(rest),
                        })}
                      </p>
                      {/* The interview, carded rather than captioned, on both
                          packs that can reach it. 12/11/2026, Paul's call: it is
                          the one thing on a pack card that is a person rather
                          than a number, and set as a line of small print under
                          the outcome it read as a footnote to the arithmetic.

                          `canvas-soft` and not the gold. The gold is
                          `canvas-promo` and the rule that came with it is that
                          it means something the reader does NOT pay for; this
                          half hour is inside the Fit Report's twenty tokens, so
                          claiming it in the promotional colour would be the
                          system lying about what is being given away. Soft is
                          the quiet ground, which is what this is: the same card,
                          one step down.

                          One class works on both packs because the role does the
                          work. On the Serious card `canvas-soft` is the pale
                          grey-green; inside the recommended card `.ground-dark`
                          pins it to #1d4200 and it comes out a lift on the dark
                          green instead. Nothing here names a scheme or a pack
                          (R20). */}
                      {reaches && (
                        <div className="mt-3 flex items-start gap-3 rounded-2xl border border-line bg-canvas-soft px-4 py-4">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-canvas">
                            <svg
                              aria-hidden
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={1.75}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="size-5 text-ink-deep"
                            >
                              <circle cx="12" cy="12" r="8.5" />
                              <path d="M12 7.25V12l3 1.75" />
                            </svg>
                          </span>
                          <p className="text-body-medium text-on-surface">
                            {pick(TOKEN_ROWS[1].detail)}
                          </p>
                        </div>
                      )}
                    </>
                  );
                })()}

                <p className="mt-5 text-body-large text-on-surface-variant">{pick(pack.who)}</p>

                {/* The promotion, and the only one this page is allowed. It is
                    the first block on the site to take `canvas-promo`, the fifth
                    ground, added to `design.md` on 12/11/2026 because the system
                    had four grounds with a look and none with a meaning, so an
                    offer had nowhere to sit and twice took a colour that already
                    meant something else: a pale tint, which is what a disclaimer
                    takes, and then the dark ground, which is the authority block
                    and the recommended card beside it.

                    The ground is a gold, and the reason is that no other role
                    owns that value: lime acts, the dark ground is authority,
                    orange is the mark and the mascot, cyan is EU Fit Check, and
                    the pale tints rotate, so a reader learns nothing from which
                    one turns up. A promotion in any of those is a promotion
                    wearing another block's clothes, which is what both earlier
                    versions of this panel were. It is fixed in both schemes, so
                    the panel carries `.ground-fixed` and the content roles pin
                    to their light values (R21). `mute-strong` holds 3.34 here
                    and is not a text colour on this ground, so the line under
                    each name takes `body` at 5.91.

                    `Narrative_System.md` > promotions owns whether this may
                    exist at all, and `verify:narrative` fails the build the day
                    after `ends`. `block-library.md` > P1 owns its anatomy.

                    The two coaches are the block, not an ornament on it. What is
                    being given away is an hour of somebody's attention, and no
                    reader can price that from the name of the service. Until
                    12/11/2026 each name carried `pill`, which is a title line:
                    founder, co-founder. A lead has no reason to care who owns
                    the company. `relevance` is the house narrative's own slot 3,
                    cut to one line: what this person does to a CV like theirs.
                    One of them decides which CVs reach a hiring manager and the
                    other IS one, which between them is the whole gate the reader
                    is trying to get through.

                    Dew's line named the United States until Paul struck it on
                    12/11/2026. The reader is going to Europe, so a bridge line
                    that names another market argues against itself however real
                    the credential; her country is biography and stays on
                    `/coaching`. `Narrative_System.md` § 4 carries the rule now
                    and `verify:narrative` fails on it, in the YAML and in these
                    `COACHES` lines, which is where it got in. */}
                {pack.bonus && (
                  <div className="ground-fixed mt-6 rounded-2xl bg-canvas-promo p-6">
                    <span className="flex size-10 items-center justify-center rounded-full bg-canvas">
                      <svg
                        aria-hidden
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.75}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-5 text-ink-deep"
                      >
                        <rect x="2.75" y="6.5" width="12.5" height="11" rx="3" />
                        <path d="M15.25 10.9l4.3-2.8a.7.7 0 0 1 1.1.6v6.6a.7.7 0 0 1-1.1.6l-4.3-2.8z" />
                      </svg>
                    </span>
                    <p className="mt-4 text-title-medium text-ink-deep">{pick(pack.bonus)}</p>
                    <ul className="mt-5 flex flex-col gap-3 border-t border-ink-deep/15 pt-5">
                      {COACHES.map((c) => (
                        <li key={c.id} className="flex items-center gap-3">
                          <Image
                            src={COACH_PHOTO[c.id]}
                            alt={pick(c.alt)}
                            width={1200}
                            height={900}
                            sizes="48px"
                            className="size-12 shrink-0 rounded-full object-cover object-[50%_22%]"
                          />
                          <div>
                            <p className="text-body-md-strong text-ink-deep">{pick(c.name)}</p>
                            <p className="text-body-sm text-body">{pick(c.relevance)}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* All three buttons are the same action to the same place, which
                    is rule 1 in `cta.ts`: one action may repeat once per card. */}
                <CallToAction page="/pricing" className="pt-7" show="primary" />
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
