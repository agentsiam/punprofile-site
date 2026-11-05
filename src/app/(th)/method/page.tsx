"use client";

/**
 * `/method`. Added 26/08/2026.
 *
 * The page walks `GATES` from `model.ts` rather than a list of its own, so the
 * published order and the published bars are the implemented ones by
 * construction. See the header of `src/lib/content/method.ts` for why this page
 * exists, and for the one day it carried the gates without their bars.
 *
 * Blocks, per `Narrative_System.md`: B1 carries the claim and the ask, B6 the
 * gates as spec rows, B10 the limit, B8 the ask again. The limit band is above
 * the closing panel and not below it, which is the one rule `verify:narrative`
 * enforces about page order.
 */

import Image from "next/image";
import { useCopy } from "@/components/LocaleProvider";
import CallToAction from "@/components/CallToAction";
import Band from "@/components/Band";
import { HERO_HEADING, SECTION_HEADING } from "@/lib/content/footer";
import { GATES } from "@/lib/model";
import {
  CLAIM_BODY,
  CLAIM_HEADING,
  GATES_HEADING,
  GATES_LOWEST,
  GATES_ORDER,
  GATE_BAR,
  GATE_QUESTIONS,
  LIMIT_BODY,
  LIMIT_HEADING,
  METHOD_CLOSE,
  METHOD_HEADING,
  METHOD_INTRO,
  THRESHOLD_BODY,
  THRESHOLD_HEADING,
  VERBS,
} from "@/lib/content/method";

/** Each step's height on wide screens, so the four read as a staircase. */
const STEP_HEIGHT = ["large:h-28", "large:h-40", "large:h-52", "large:h-64"];
const STEP_TINT = [
  "bg-cyan-pale text-on-cyan-pale",
  "bg-yellow-pale text-on-yellow-pale",
  "bg-orange-pale text-on-orange-pale",
  "bg-canvas-dark ground-dark",
];

/**
 * A copy-free picture of "thresholds, not scores", 03/11/2026: four bars, each
 * with its own target notch, drawn from `GATES` so the notches are the real
 * bars. Two bars clear and two fall short, which is the whole point: a decent
 * average does not mean ready.
 */
function ThresholdBars() {
  const example = [4.3, 3.2, 3.8, 2.6];
  return (
    <svg viewBox="0 0 320 220" className="h-auto w-full" aria-hidden>
      {GATES.map((g, i) => {
        const x = 30 + i * 75;
        const h = (v: number) => (v / 5) * 180;
        const clear = example[i] >= g.bar;
        return (
          <g key={g.key}>
            <rect x={x} y={200 - 180} width={40} height={180} rx={8} className="fill-canvas-soft" />
            <rect
              x={x}
              y={200 - h(example[i])}
              width={40}
              height={h(example[i])}
              rx={8}
              className={clear ? "fill-accent-cyan" : "fill-accent-orange"}
            />
            <rect x={x - 8} y={200 - h(g.bar) - 3} width={56} height={6} rx={3} className="fill-ink-deep" />
          </g>
        );
      })}
    </svg>
  );
}

export default function MethodPage() {
  const { pick, t, locale } = useCopy();

  /* The jump row's targets, labelled with the sections' own headings. */
  const sections = [
    { id: "rests-on", label: CLAIM_HEADING },
    { id: "thresholds", label: THRESHOLD_HEADING },
    { id: "gates", label: GATES_HEADING },
    { id: "limits", label: LIMIT_HEADING },
  ];

  return (
    <div className="w-full">
      {/* Split with a clay scene since 03/11/2026: the candidate checking her
          own chart against the bars, which is the page's whole argument. */}
      <Band block="B1" ground="canvas" width="wide">
        <div className="grid items-center gap-10 large:grid-cols-[1fr_1fr] large:gap-16">
          <div>
            <h1 className={HERO_HEADING(locale)}>{pick(METHOD_HEADING)}</h1>
            <p className="mt-4 max-w-xl text-body-large text-on-surface-variant">
              {pick(METHOD_INTRO)}
            </p>
            {/* A jump row, after Airalo's How it works and Headspace Research:
                a long explainer says up front what is on it. */}
            <nav className="mt-8 flex flex-wrap gap-2">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="rounded-full border border-line px-4 py-2 text-body-sm-strong text-ink-deep transition-colors hover:border-line-strong"
                >
                  {pick(s.label)}
                </a>
              ))}
            </nav>
          </div>
          <Image
            src="/method/method-thresholds.jpg"
            alt=""
            width={1200}
            height={896}
            priority
            sizes="(min-width: 1200px) 50vw, 100vw"
            className="aspect-square h-auto w-full rounded-3xl object-cover medium:aspect-[4/3]"
          />
        </div>
      </Band>

      {/* What it rests on: the two verbs as tinted panels, after Notion's
          contrasting panels, rather than two white boxes. */}
      <Band block="B6" ground="soft" width="wide" id="rests-on">
        <h2 className={SECTION_HEADING(locale)}>{pick(CLAIM_HEADING)}</h2>
        <p className="mt-4 max-w-2xl text-body-large text-on-surface">{pick(CLAIM_BODY)}</p>
        <div className="mt-10 grid gap-6 medium:grid-cols-2">
          {VERBS.map((verb, i) => (
            <div
              key={verb.name.en}
              className={`rounded-2xl px-7 py-7 ${
                i === 0 ? "bg-cyan-pale text-on-cyan-pale" : "bg-orange-pale text-on-orange-pale"
              }`}
            >
              <p className="text-heading-md">{pick(verb.name)}</p>
              <p className="mt-3 text-body-large">{pick(verb.body)}</p>
            </div>
          ))}
        </div>
      </Band>

      {/* Thresholds: its own band now, text beside a drawn example. */}
      <Band block="B10" ground="canvas" width="wide" id="thresholds">
        <div className="grid items-center gap-10 large:grid-cols-[1.2fr_1fr] large:gap-16">
          <div>
            <h2 className={SECTION_HEADING(locale)}>{pick(THRESHOLD_HEADING)}</h2>
            <div className="mt-4 flex flex-col gap-3">
              {THRESHOLD_BODY.map((p, i) => (
                <p key={i} className="text-body-large text-on-surface-variant">
                  {pick(p)}
                </p>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-canvas-soft px-8 py-8">
            <ThresholdBars />
          </div>
        </div>
      </Band>

      {/*
        The four gates as one staircase, after Duolingo's one-diagram method
        page: four steps rising left to right in the order they are cleared,
        the last on dark green as the top. Each step carries its name, its
        question and its bar as a meter, all read off `GATES` and `copy.ts`, so
        the published bar and the enforced bar are the same value by
        construction (published 26/08/2026 once Paul confirmed it).
      */}
      <Band block="B6" ground="soft" width="wide" id="gates">
        <h2 className={SECTION_HEADING(locale)}>{pick(GATES_HEADING)}</h2>
        <ol className="mt-10 grid gap-4 large:grid-cols-4 large:items-end large:gap-3">
          {GATES.map((gate, i) => (
            <li key={gate.key} className="flex flex-col">
              <span className="text-display-sm text-ink-deep">{i + 1}</span>
              <span className="mt-1 text-heading-md text-ink-deep">{t(`dimension.${gate.key}`)}</span>
              <span className="mt-1 text-body-md text-on-surface-variant">
                {pick(GATE_QUESTIONS[gate.key])}
              </span>
              <span
                className={`mt-4 flex flex-col justify-end rounded-t-2xl px-5 pb-5 pt-5 ${STEP_HEIGHT[i]} ${STEP_TINT[i]}`}
              >
                <span className="flex items-baseline justify-between text-body-md-strong">
                  <span>{pick(GATE_BAR)}</span>
                  <span>{gate.bar.toFixed(1)}</span>
                </span>
                <span aria-hidden className="mt-2 block h-2 w-full overflow-hidden rounded-full bg-canvas">
                  <span
                    className="block h-full rounded-full bg-ink-deep"
                    style={{ width: `${(gate.bar / 5) * 100}%` }}
                  />
                </span>
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-8 grid gap-3 large:grid-cols-2 large:gap-10">
          <p className="text-body-large text-on-surface-variant">{pick(GATES_ORDER)}</p>
          <p className="text-body-large text-on-surface-variant">{pick(GATES_LOWEST)}</p>
        </div>
      </Band>

      <Band block="B10" ground="canvas" id="limits">
        <h2 className={SECTION_HEADING(locale)}>{pick(LIMIT_HEADING)}</h2>
        <div className="mt-4 flex max-w-2xl flex-col gap-3">
          {LIMIT_BODY.map((p, i) => (
            <p key={i} className="text-body-large text-on-surface-variant">
              {pick(p)}
            </p>
          ))}
        </div>
      </Band>

      <Band block="B8" ground="dark" align="center" className="text-center">
        <p className={SECTION_HEADING(locale)}>{pick(METHOD_CLOSE)}</p>
        <CallToAction page="/method" className="mt-8" align="center" show="primary" />
      </Band>
    </div>
  );
}
