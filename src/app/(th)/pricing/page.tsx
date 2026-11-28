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
  PACK_BUYS_ROLES,
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
import {
  DASH_EXAMPLE_NOTE,
  STATUS_SOON,
  freeCostLabel,
  isFreeProduct,
  productBySlug,
} from "@/lib/content/products";
/* The four steps of an engagement, and their heading and lede, from the same
   records `/services` renders. Reused rather than restated, which is the rule
   this page already follows for `COACHES`: one set of records, rendered
   wherever it is needed, so `/pricing` cannot grow a second and looser account
   of how the work runs. */
import { ENGAGEMENT, ENGAGEMENT_HEADING, ENGAGEMENT_LEDE } from "@/lib/content/services";
import type { Copy } from "@/lib/content/copy";
import Band from "@/components/Band";
/* The bonus panel's coaches. Both already render on the home page and
   `/coaching` from these same records, which is the point: /pricing is not
   allowed a second, looser version of who the coaches are. */
import { COACHES } from "@/lib/content/coaching";
import { COACH_PHOTO } from "@/components/features/coaches/CoachCards";
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
  standard: { src: "/pricing/pricing-pack-standard.png", w: 431, h: 296 },
  serious: { src: "/pricing/pricing-pack-serious.png", w: 528, h: 560 },
};

/**
 * `{price}` and `{count}` in a pack's `includes` line, substituted here, so a
 * card never types a figure and becomes another place for a price to go stale
 * on the one page that prints prices.
 *
 * It used to fill the Fit Report's token price and the roles a pack had left
 * after it. Since 28/11/2026 no pack has a remainder to state, because the
 * report is not bought with tokens (`01_Project_Foundation.md`), and `{count}`
 * is now the pack's own token count and nothing else.
 */
const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));

/**
 * The four stage circles, in the secondary palette's decorative tints.
 *
 * `design-system.md` gives those three tints no meaning on purpose: lime acts, the
 * dark ground is authority, orange is the mark and the mascot, cyan is EU Fit
 * Check, and the pale tints rotate, so a reader learns nothing from which one
 * turns up and nothing is being claimed by colouring a circle. That is what
 * makes them safe here and it is also why there is no lime in the run: lime is
 * the one colour that says a thing can be pressed, and the only pressable thing
 * on this panel is the button under it (R16).
 *
 * The fourth is the white card ground rather than a fourth tint, which is the
 * reference's own arrangement and keeps the run from reading as a four-colour
 * chart. Each tint carries its own `on-` role for the numeral.
 */
const STAGE_TINT = [
  "bg-cyan-pale text-on-cyan-pale",
  "bg-yellow-pale text-on-yellow-pale",
  "bg-orange-pale text-on-orange-pale",
  "bg-canvas text-ink-deep",
] as const;

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
  /* THB in both languages, the way the calculator's own answer line prints it.
     Paul's call of 12/11/2026 was that the figures on this page carry one
     label, so a baht price in the spec rows does not take บาท while the card
     below it takes THB. */
  const thb = (n: number) => `${n.toLocaleString("en-US")} THB`;

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
            width={1442}
            height={720}
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
              value={"tokens" in row.price ? tokens(row.price.tokens) : thb(row.price.thb)}
              coin={"tokens" in row.price}
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
               page, it is back to meaning what `design-system.md` says it means. */
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

                    A reader at three cards is asking which, and a question
                    asked of three cards has to be answered by three cards in the
                    same words and the same position. It replaced a list that
                    said "what you get in this pack" and named a Fit Report AND
                    thirteen roles, which was one of the two things 33 tokens
                    could do rather than the pack's contents. A pack is a
                    balance.

                    It said `or` until 28/11/2026, because 33 tokens could buy
                    the report or thirteen roles. Tokens now buy matched roles
                    and nothing else, the Fit Report being 990 THB
                    (`01_Project_Foundation.md`), so there is no choice left to
                    state: every card takes the roles line. `PACK_BUYS` is
                    retired with it, and so is the interview card that sat
                    underneath on the two packs that could reach twenty tokens,
                    whose own ground colour was reasoned from the half hour
                    being inside those twenty. */}
                <p className="mt-4 text-body-large text-on-surface">
                  {fill(pick(PACK_BUYS_ROLES), { count: pack.tokens })}
                </p>

                <p className="mt-5 text-body-large text-on-surface-variant">{pick(pack.who)}</p>

                {/* The promotion, and the only one this page is allowed. It is
                    the first block on the site to take `canvas-promo`, the fifth
                    ground, added to `design-system.md` on 12/11/2026 because the system
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

      {/* ------------------------------------------------- the close, 18/11/2026
          **The Coaching 1:1 price is the page\'s closing panel now, not a row
          in a question list.** It was a `B5` row-list holding one question: a
          hairline, a bold line, and the only four-figure number on the page set
          in the same grey body type as a token count, with the page\'s secondary
          text link under it. The number the page works hardest to earn was its
          quietest typography.

          **It is a white panel on the soft band, not a dark one.** The first
          build of this was `canvas-dark`, which gave the close authority and
          then kept it for twelve hundred pixels, and a block that large reads
          as a change of ground rather than as one more thing. White card on a
          tinted band is what `design-system.md` says a card is (R18); the tonal step
          the panel needs is spent inside it, on the stage strip, where it
          carries meaning rather than weight.

          It stays `B8` because B8 is this shape: icon chip, heading, pill, on
          a rounded card of its own. What it is not is B8's ground, and the
          block is written as the dark closing panel. It also carries a stage
          strip and two faces, which that block as written does not.
          `block-library.md` owns whether B8 gains a light variant or this
          becomes a block of its own, and that file is in the sibling repo
          (R1), so the entry is unchanged and this comment is the flag.

          **The question is the eyebrow and the answer is the heading.** Both
          are Paul\'s own strings, unchanged: his answer opens with the figure
          and closes on the reason to start, which is the argument the panel
          needs.

          **The ask is `contact`, the page\'s declared primary** (`cta.ts` rule 1
          allows one action to repeat, which is why the hero and the three pack
          cards carry this same button). A reader who has just read that the
          price is settled in the first conversation is one step from that
          conversation. The secondary under it goes to `/coaching` since
          18/11/2026, Paul\'s call: it was the EU Fit Check, and the cheapest
          link on the page cannot be the free assessment when it sits directly
          beneath a paid price. See `cta.ts` for that entry. */}
      <Band block="B8" ground="soft" width="wide">
        <div className="card-plain rounded-3xl px-6 py-12 text-center medium:px-14">
          <span
            aria-hidden
            className="mx-auto flex size-12 items-center justify-center rounded-full bg-orange-pale text-on-orange-pale"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-6"
            >
              <path d="M20.25 11.4c0 3.8-3.7 6.9-8.25 6.9-.9 0-1.78-.12-2.6-.35l-4.4 1.8 1.1-3.5c-1.4-1.3-2.1-2.98-2.1-4.85 0-3.8 3.7-6.9 8.25-6.9s8.25 3.1 8.25 6.9z" />
            </svg>
          </span>
          {PRICING_QUESTIONS.map((item, i) => (
            <div key={i}>
              <p className="mt-6 text-body-md text-mute-strong">{pick(item.q)}</p>
              {/* The first answer line is the price and takes the price\'s
                  typography; the rest is what qualifies it and takes the body\'s.
                  They were one record until 18/11/2026 and one record can only
                  be one size, which is the whole reason they are two. The index
                  is the rule: `a[0]` is the figure, by the contract in
                  `pricing.ts.tpl`.

                  `SECTION_HEADING`, not a `display-*` class picked by hand. The
                  Latin display tier sits on a line box 0.85 of its size and
                  that box clips Thai tone marks outright, which is why the two
                  scripts have separate tiers and why a page names the job
                  rather than the class (R25). */}
              {item.a.map((line, j) =>
                j === 0 ? (
                  <p key={j} className={`mt-2 ${SECTION_HEADING(locale)}`}>
                    {pick(line)}
                  </p>
                ) : (
                  <p
                    key={j}
                    className="mx-auto mt-4 max-w-2xl text-body-large text-on-surface-variant"
                  >
                    {pick(line)}
                  </p>
                ),
              )}
            </div>
          ))}

          {/* ------------------------------------------------- the approach
              **The four stages as a run rather than a stack.** Paul\'s
              reference, 18/11/2026: numbered circles on a flowing connector
              with each stage\'s text in a column underneath, which reads as one
              process rather than four separate claims.

              Built in this system\'s own materials. The strip takes
              `canvas-soft`, the quiet ground the pack cards already step down
              to inside a white card, so the panel has one tonal move and it is
              this one. The circles are `canvas` on it, which is the same figure
              and ground as the reference, the connector is `line-strong`, a
              boundary role that clears the 3:1 floor for a thing that is not
              text, and the numerals are `ink-deep`. No lime anywhere in it:
              lime marks what can be pressed and there is exactly one of those
              in this panel (R16).

              The copy is `ENGAGEMENT` from `services.ts`, Paul\'s wording of
              06/09/2026, the same four records `/services` renders rather than
              a retelling of them. `ENGAGEMENT_LEDE` is what makes a from-price
              legible: nothing is scoped or priced until both sides know what
              the aim is.

              **These four are not a list of what 8,900 buys.**
              `01_Project_Foundation.md` publishes the from-price and no
              component list while the structure is open, because a published
              list is what the next caller anchors on. They say how the work
              runs, in order. Step one names the Fit Report, which that document
              prices at 990 THB on its own and also includes inside the
              engagement, 28/11/2026; it is no longer bought with tokens, which
              now buy matched roles and nothing else. This panel prices
              nothing.

              The wave is `large:` only and `aria-hidden`: it needs the five
              columns side by side to mean anything, and below that width the
              stages stack and the circles alternate no more. Its five nodes and
              the inset are one arrangement: at `inset-x-[10%]` the path's 0,
              250, 500, 750 and 1000 land on 10, 30, 50, 70 and 90 per cent,
              which is where five columns put their circles, so the circles sit
              on the line rather than near it. Change the column count and the
              inset changes with it. The offsets are paired so
              the circles ride the wave while the text rows stay level, which is
              the reference\'s own arrangement: a circle dropped by `mt-12` takes
              `mt-4` above its text and a circle at the top takes `mt-16`. */}
          <div className="mt-10 rounded-2xl bg-canvas-soft px-5 py-10 medium:px-8">
            <p className="text-title-medium text-on-surface">{pick(ENGAGEMENT_HEADING)}</p>
            <p className="mx-auto mt-2 max-w-2xl text-body-md text-on-surface-variant">
              {pick(ENGAGEMENT_LEDE)}
            </p>

            <div className="relative mt-8">
              <svg
                aria-hidden
                viewBox="0 0 1000 150"
                preserveAspectRatio="none"
                className="absolute inset-x-[10%] top-10 hidden h-28 text-canvas large:block"
              >
                <path
                  d="M 0 30 C 110 30, 110 120, 250 120 S 390 30, 500 30 S 640 120, 750 120 S 890 30, 1000 30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="9"
                  strokeLinecap="round"
                />
              </svg>
              <ol className="relative grid gap-8 medium:grid-cols-3 large:grid-cols-5 large:gap-5">
                {ENGAGEMENT.map((step, i) => {
                  const dropped = i % 2 === 1;
                  const tint = STAGE_TINT[i % STAGE_TINT.length];
                  return (
                    <li key={i} className="text-center large:text-left">
                      <span
                        aria-hidden
                        className={`mx-auto flex size-20 items-center justify-center rounded-full text-display-xs large:mx-0 ${tint} ${
                          dropped ? "large:mt-12" : ""
                        }`}
                      >
                        {i + 1}
                      </span>
                      <p
                        className={`mt-4 text-body-md-strong text-on-surface ${
                          dropped ? "large:mt-4" : "large:mt-16"
                        }`}
                      >
                        {pick(step.lead)}
                      </p>
                      <p className="mt-1.5 text-body-md text-on-surface-variant">
                        {pick(step.body)}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* ------------------------------------------------- who you meet
              Paul and Dew at a size worth looking at, 18/11/2026 on Paul\'s
              call. They are already on this page at 48px inside the Serious
              pack\'s promotion, where they are the faces of a free hour; here
              they are the people an 8,900 engagement is spent with, which is the
              last thing a reader weighs before the button.

              The same `COACHES` records and the same `COACH_PHOTO` map as the
              home page, `/coaching` and the panel above, so this page still
              cannot grow a second and looser account of who they are. The crop
              is the one that panel already uses: these are 4:3 portraits and a
              centred circular crop takes the chin and leaves the forehead. */}
          <ul className="mx-auto mt-10 grid max-w-2xl gap-8 medium:grid-cols-2">
            {COACHES.map((c) => (
              <li key={c.id} className="flex flex-col items-center text-center">
                <Image
                  src={COACH_PHOTO[c.id]}
                  alt={pick(c.alt)}
                  width={1200}
                  height={900}
                  sizes="128px"
                  className="size-32 rounded-full object-cover object-[50%_22%]"
                />
                <p className="mt-4 text-body-md-strong text-on-surface">{pick(c.name)}</p>
                <p className="mt-1 text-body-md text-on-surface-variant">{pick(c.relevance)}</p>
              </li>
            ))}
          </ul>

          {/* Primary and secondary, and the secondary\'s one appearance on the
              page: rule 5 renders it as a text link under the pill. */}
          <CallToAction page="/pricing" className="mt-10" align="center" />
        </div>
      </Band>
    </div>
  );
}
