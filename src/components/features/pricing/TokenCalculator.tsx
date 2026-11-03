"use client";

/**
 * The pack picker on `/pricing`. Rebuilt 02/11/2026 on Paul's call, over the
 * salary calculator of 23/08/2026.
 *
 * **Why the salary version went.** It subtracted salary now from target salary
 * and divided the difference by the token price. For a Thai candidate the first
 * number is in baht and the second in euro, so the subtraction meant nothing,
 * and the token count it printed was a raise expressed as something to spend.
 * Its heading asked which pack fits and nothing on screen ever named one.
 *
 * **What this asks instead is usage**, the shape credit-pack calculators take:
 * does the reader want the Fit Report, how many matched roles a week, and for how
 * long. The output is the token count and the cheapest set of packs that covers
 * it. The honesty rules of the old one still hold, applied to a better input:
 *
 * 1. Every number traces to the reader's three answers or a pack in `PACKS`.
 *    No salary, no market figure, nothing PunProfile claims about outcomes.
 * 2. Nothing is stored. Component state, gone with the page.
 * 3. The prices are never restated. Token costs come from `TOKEN_ROWS` and the
 *    packs from `PACKS`, so a price change cannot leave this behind.
 *
 * It renders inside a B2 band (`page.tsx`), which carries `artefact` and `ask`
 * in `Narrative_System.md`, and it sits below the limits on purpose: the ask at
 * its foot comes after the page has said what a token does not do.
 */

import { useMemo, useState } from "react";
import { useCopy } from "@/components/LocaleProvider";
import CallToAction from "@/components/CallToAction";
import TokenCoin from "@/components/features/pricing/TokenCoin";
import { SECTION_HEADING } from "@/lib/content/footer";
import {
  CALC_BEST_FIT,
  CALC_FIT_NO,
  CALC_FIT_REPORT,
  CALC_FIT_YES,
  CALC_HEADING,
  CALC_HOW_LONG,
  CALC_LEFT_OVER,
  CALC_MONTHS,
  CALC_NEED,
  CALC_NOTE,
  CALC_PER_WEEK,
  PACKS,
  TOKEN_ROWS,
  TOKEN_UNIT,
  type Pack,
} from "@/lib/content/pricing";

const ROLE_TOKENS = TOKEN_ROWS[0].tokens;
const FIT_REPORT_TOKENS = TOKEN_ROWS[1].tokens;
const WEEKS_PER_MONTH = 4;

const PER_WEEK_OPTIONS = [1, 2, 3, 5] as const;
const MONTH_OPTIONS = [1, 3, 6] as const;

interface Plan {
  counts: { pack: Pack; n: number }[];
  tokens: number;
  thb: number;
}

/**
 * The cheapest set of packs whose tokens cover `need`. At the same price the
 * set with more tokens wins, because a bigger pack buys free tokens rather than
 * cheaper ones and the reader should get them; then the fewest packs. The
 * search is small: no answer on this form needs more than 140 tokens.
 */
function cheapestPlan(need: number): Plan {
  const limit = (p: Pack) => Math.ceil(need / p.tokens);
  let best: Plan | null = null;
  const [a, b, c] = PACKS;
  for (let i = 0; i <= limit(a); i++) {
    for (let j = 0; j <= limit(b); j++) {
      for (let k = 0; k <= limit(c); k++) {
        const tokens = i * a.tokens + j * b.tokens + k * c.tokens;
        if (tokens < need) continue;
        const thb = i * a.thb + j * b.thb + k * c.thb;
        const packs = i + j + k;
        const better =
          !best ||
          thb < best.thb ||
          (thb === best.thb && tokens > best.tokens) ||
          (thb === best.thb &&
            tokens === best.tokens &&
            packs < best.counts.reduce((s, x) => s + x.n, 0));
        if (better) {
          best = {
            counts: [
              { pack: a, n: i },
              { pack: b, n: j },
              { pack: c, n: k },
            ].filter((x) => x.n > 0),
            tokens,
            thb,
          };
        }
      }
    }
  }
  return best as Plan;
}

export default function TokenCalculator() {
  const { pick, locale } = useCopy();
  const [fitReport, setFitReport] = useState(true);
  const [perWeek, setPerWeek] = useState<number>(2);
  const [months, setMonths] = useState<number>(3);

  const need =
    (fitReport ? FIT_REPORT_TOKENS : 0) + perWeek * WEEKS_PER_MONTH * months * ROLE_TOKENS;
  const plan = useMemo(() => cheapestPlan(need), [need]);
  const leftOver = plan.tokens - need;

  const tokens = (n: number) => `${n} ${pick(n === 1 ? TOKEN_UNIT.one : TOKEN_UNIT.many)}`;

  /** One group of choices. The `.tile` is the assessment's own option tile. */
  const group = <T,>(
    label: string,
    options: readonly { value: T; text: string }[],
    value: T,
    set: (v: T) => void,
  ) => (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 text-heading-sm text-on-surface">{label}</legend>
      <div
        className={`grid grid-cols-2 gap-2 ${options.length === 3 ? "medium:grid-cols-3" : "medium:grid-cols-4"}`}
      >
        {options.map((o) => {
          const on = o.value === value;
          return (
            <button
              key={String(o.value)}
              type="button"
              aria-pressed={on}
              onClick={() => set(o.value)}
              className="tile"
            >
              <span>{o.text}</span>
              <span aria-hidden className="tile-mark">
                {on && <span />}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );

  return (
    <div className="grid gap-8 large:grid-cols-2 large:items-start">
      <div className="flex flex-col gap-7">
        <h2 className={SECTION_HEADING(locale)}>{pick(CALC_HEADING)}</h2>
        {group(
          pick(CALC_FIT_REPORT),
          [
            { value: true, text: pick(CALC_FIT_YES) },
            { value: false, text: pick(CALC_FIT_NO) },
          ],
          fitReport,
          setFitReport,
        )}
        {group(
          pick(CALC_PER_WEEK),
          PER_WEEK_OPTIONS.map((n) => ({ value: n as number, text: String(n) })),
          perWeek,
          setPerWeek,
        )}
        {group(
          pick(CALC_HOW_LONG),
          MONTH_OPTIONS.map((n) => ({
            value: n as number,
            text: `${n} ${pick(n === 1 ? CALC_MONTHS.one : CALC_MONTHS.many)}`,
          })),
          months,
          setMonths,
        )}
      </div>

      {/* The answer card. `aria-live` so a screen reader hears the new pack as
          the choices change, which is the whole output of the tool. */}
      <div className="card-outlined flex flex-col px-6 py-7" aria-live="polite">
        <p className="text-body-large text-on-surface-variant">{pick(CALC_NEED)}</p>
        <p className="mt-1 flex items-center gap-3 text-headline-small text-on-surface">
          <TokenCoin size={32} />
          {tokens(need)}
        </p>

        <p className="mt-6 text-body-large text-on-surface-variant">{pick(CALC_BEST_FIT)}</p>
        <p className="mt-1 text-title-large text-on-surface">
          {plan.counts
            .map(({ pack, n }) => (n > 1 ? `${pick(pack.name)} × ${n}` : pick(pack.name)))
            .join(" + ")}
        </p>
        <p className="mt-1 text-body-large text-on-surface">
          {tokens(plan.tokens)}, {plan.thb.toLocaleString("en-US")} THB
        </p>
        {leftOver > 0 && (
          <p className="mt-3 text-body-large text-on-surface-variant">
            {tokens(leftOver)} {pick(CALC_LEFT_OVER)}
          </p>
        )}

        <CallToAction page="/pricing" className="mt-7" show="primary" />
        <p className="mt-6 text-body-medium text-on-surface-variant">{pick(CALC_NOTE)}</p>
      </div>
    </div>
  );
}
