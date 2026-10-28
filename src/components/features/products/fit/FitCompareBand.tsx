"use client";

/**
 * EU Fit Check beside the Fit Report as two cards of the same size, each with
 * its own chart, rows and button. Rebuilt 28/10/2026 (Paul, 2a): the table that
 * sat under two unequal charts read as two blocks saying one thing.
 */

import Link from "next/link";
import { useCopy } from "@/components/LocaleProvider";
import Band from "@/components/Band";
import CallToAction from "@/components/CallToAction";
import SpiderChart from "@/components/features/chart/SpiderChart";
import FullSampleChart from "@/components/features/products/FullSampleChart";
import { SECTION_HEADING } from "@/lib/content/footer";
import { SAMPLE_NOTE } from "@/lib/content/home";
import { DESTINATIONS } from "@/lib/content/cta";
import {
  FIT_COMPARE_HEADING,
  FIT_PLAN_FREE,
  FIT_PLAN_FULL,
  HERO_SAMPLE_SCORES,
  PRODUCTS,
  type Product,
} from "@/lib/content/products";
import type { Copy } from "@/lib/content/copy";

function Rows({ rows }: { rows: readonly { text: Copy; on: boolean }[] }) {
  const { pick } = useCopy();
  return (
    <ul className="mt-6 flex flex-col">
      {rows.map((r, i) => (
        <li key={i} className="grid grid-cols-[1.75rem_1fr] gap-2 border-b border-line py-3 last:border-b-0">
          <span aria-hidden className={r.on ? "font-bold text-positive-deep" : "font-bold text-mute"}>
            {r.on ? "✓" : "–"}
          </span>
          <span className={`text-body-md ${r.on ? "text-ink-deep" : "text-mute-strong"}`}>{pick(r.text)}</span>
        </li>
      ))}
    </ul>
  );
}

function Card({
  product,
  pill,
  sub,
  chart,
  rows,
  action,
  featured,
}: {
  product: Product;
  pill: string;
  sub: string;
  chart: React.ReactNode;
  rows: readonly { text: Copy; on: boolean }[];
  action: React.ReactNode;
  featured?: boolean;
}) {
  const { pick } = useCopy();
  return (
    <div className={`flex flex-col rounded-[30px] bg-white px-6 py-7 large:px-8 large:py-8 ${featured ? "ring-[3px] ring-primary" : ""}`}>
      <span className={`self-start rounded-full px-3 py-1 text-body-sm-strong text-ink-deep ${featured ? "bg-primary" : "bg-canvas-soft"}`}>
        {pill}
      </span>
      <h3 className="mt-4 text-[1.5rem] font-semibold leading-tight text-ink-deep">{pick(product.name)}</h3>
      <p className="mt-1 text-body-md text-mute-strong">{sub}</p>
      <div className="mt-5 flex h-[19rem] items-center justify-center overflow-hidden rounded-[20px] bg-canvas-soft/60 px-2">
        <div className="w-full max-w-[26rem]">{chart}</div>
      </div>
      <Rows rows={rows} />
      <div className="mt-auto pt-4">{action}</div>
    </div>
  );
}

export default function FitCompareBand() {
  const { pick, locale, path } = useCopy();
  const free = PRODUCTS.find((p) => p.slug === "eu-fit-check")!;
  const full = PRODUCTS.find((p) => p.slug === "fit-report")!;
  const assess = DESTINATIONS.assess;

  return (
    <Band block="B3" ground="soft" width="wide">
      <h2 className={SECTION_HEADING(locale)}>{pick(FIT_COMPARE_HEADING)}</h2>
      <div className="mt-10 grid items-stretch gap-6 large:grid-cols-2">
        <Card
          product={free}
          pill={pick(FIT_PLAN_FREE.pill)}
          sub={pick(FIT_PLAN_FREE.sub)}
          chart={<SpiderChart scores={HERO_SAMPLE_SCORES} variant="full" />}
          rows={FIT_PLAN_FREE.rows}
          action={
            <Link
              href={path(assess.href)}
              className="inline-flex rounded-full px-6 py-3 text-body-md-strong text-ink-deep ring-2 ring-inset ring-ink-deep"
            >
              {pick(assess.label)}
            </Link>
          }
        />
        <Card
          product={full}
          pill={pick(full.name)}
          sub={pick(FIT_PLAN_FULL.sub)}
          chart={<FullSampleChart />}
          rows={FIT_PLAN_FULL.rows}
          action={<CallToAction page="/products/fit-report" show="primary" />}
          featured
        />
      </div>
      <p className="mt-4 text-body-medium text-on-surface-variant">{pick(SAMPLE_NOTE)}</p>
    </Band>
  );
}
