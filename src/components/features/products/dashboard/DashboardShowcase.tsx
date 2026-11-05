"use client";

/**
 * The Job Search Dashboard's own page, shown with the real product. 04/11/2026.
 *
 * Every picture here is a screenshot of the live dashboard component
 * (`CandidateApp`) rendered with an example account and invented data, in the
 * reader's own language, then staged: a browser window for the desktop, a
 * phone for the mobile view, and one matched-role card lifted out of the feed.
 * Nothing is drawn to look like the product; it is the product. The note under
 * the stage says the data is made up, because a stranger's name and employers
 * on a sales page would otherwise read as a real client's.
 *
 * Screenshots live in `public/products/dashboard/`, one per locale. To refresh
 * them after the dashboard changes, render `CandidateApp` with the example
 * account at 1280px and 390px wide, two pixels per point, and crop to 16:10.
 */

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCopy } from "@/components/LocaleProvider";
import type { Copy } from "@/lib/content/copy";
import { TAB_FEED, TAB_OVERVIEW, TAB_TRACKER } from "@/lib/content/portal";
import { DASH_EXAMPLE_NOTE, productBySlug } from "@/lib/content/products";

const DIR = "/products/dashboard";

function BrowserFrame({ src, priority = false, className = "" }: { src: string; priority?: boolean; className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-line bg-canvas shadow-[0_24px_60px_-20px_rgba(22,51,0,0.35)] ${className}`}
    >
      <div aria-hidden className="flex items-center gap-2 border-b border-line bg-canvas-soft px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-[#FF8A80]" />
        <span className="size-2.5 rounded-full bg-[#FFD54F]" />
        <span className="size-2.5 rounded-full bg-[#9FE870]" />
        <span className="ml-3 rounded-full bg-canvas px-3 py-0.5 text-caption text-mute-strong">punprofile.app/me</span>
      </div>
      <Image
        src={src}
        // Decorative: the steps and headings beside it say what it shows.
        alt=""
        width={1600}
        height={1000}
        priority={priority}
        sizes="(min-width: 1200px) 900px, 100vw"
        className="block h-auto w-full"
      />
    </div>
  );
}

function PhoneFrame({ src, className = "" }: { src: string; className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-[2.2rem] border-[6px] border-ink-deep bg-canvas shadow-[0_24px_60px_-20px_rgba(22,51,0,0.45)] ${className}`}
    >
      <Image src={src} alt="" width={520} height={1040} sizes="220px" className="block h-auto w-full" />
    </div>
  );
}

/** The hero stage: the applications table in a browser, the overview on a phone, one matched role lifted out. */
export function DashboardHero() {
  const { pick, locale } = useCopy();
  return (
    <div className="mt-12">
      <div className="relative overflow-hidden rounded-[40px] bg-cyan-pale px-4 pb-10 pt-10 medium:px-10 large:px-16 large:pb-16 large:pt-14">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-yellow-pale" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-20 size-96 rounded-full bg-orange-pale" />
        <div className="relative mx-auto max-w-5xl">
          <BrowserFrame src={`${DIR}/dash-hero-tracker-${locale}.jpg`} priority className="hidden medium:block" />
          {/* A phone gets the phone's own screen: the desktop table would be
              unreadable at that width. */}
          <PhoneFrame src={`${DIR}/dash-m-hero-${locale}.jpg`} className="mx-auto w-60 medium:hidden" />
          <div className="absolute -left-6 -top-6 hidden w-[22rem] -rotate-2 overflow-hidden rounded-2xl border border-line bg-canvas shadow-[0_18px_40px_-14px_rgba(22,51,0,0.4)] large:block">
            <Image src={`${DIR}/dash-float-role-${locale}.jpg`} alt="" width={700} height={149} sizes="352px" className="block h-auto w-full" />
          </div>
          <PhoneFrame
            src={`${DIR}/dash-hero-phone-${locale}.jpg`}
            className="absolute -bottom-10 -right-4 hidden w-[13.5rem] medium:block large:-right-10"
          />
        </div>
      </div>
      <p className="mt-4 text-body-sm text-mute-strong">{pick(DASH_EXAMPLE_NOTE)}</p>
    </div>
  );
}

/** "How to start": each step beside the screen it happens on. */
export function DashboardHow() {
  const { pick, locale } = useCopy();
  const product = productBySlug("job-search-dashboard");
  const [on, setOn] = useState(0);
  // The steps advance on their own every six seconds, like a short tour,
  // until the reader picks one; never for a reader who asked for less motion.
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (touched || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setOn((i) => (i + 1) % 3), 6000);
    return () => window.clearInterval(id);
  }, [touched]);
  if (!product) return null;
  const screens: { tab: Copy; src: string; phone: string }[] = [
    { tab: TAB_FEED, src: `${DIR}/dash-step-feed-${locale}.jpg`, phone: `${DIR}/dash-m-feed-${locale}.jpg` },
    { tab: TAB_TRACKER, src: `${DIR}/dash-step-job-${locale}.jpg`, phone: `${DIR}/dash-m-job-${locale}.jpg` },
    { tab: TAB_OVERVIEW, src: `${DIR}/dash-step-overview-${locale}.jpg`, phone: `${DIR}/dash-m-overview-${locale}.jpg` },
  ];
  const steps = product.how.slice(0, screens.length);

  return (
    <div className="grid gap-8 large:grid-cols-[0.8fr_1.4fr] large:items-center large:gap-12">
      <ol className="flex flex-col gap-3">
        {steps.map((s, i) => {
          const active = i === on;
          return (
            <li key={i}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setTouched(true);
                  setOn(i);
                }}
                className={`flex w-full gap-4 rounded-2xl border px-5 py-5 text-left duration-[350ms] ease-nav transition-colors ${
                  active ? "border-ink-deep bg-canvas" : "border-transparent hover:bg-canvas"
                }`}
              >
                <span
                  aria-hidden
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full text-body-md-strong ${
                    active ? "bg-primary text-on-primary" : "bg-canvas text-ink-deep"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-caption-strong text-mute-strong">{pick(screens[i].tab)}</span>
                  <span className="mt-1 block text-body-md-strong text-ink-deep">{pick(s)}</span>
                </span>
              </button>
              {/* Below `large` each step carries its own screen under it: the
                  phone's screen on a phone, the browser's on a tablet. */}
              <PhoneFrame src={screens[i].phone} className="mx-auto mt-4 w-56 medium:hidden" />
              <BrowserFrame src={screens[i].src} className="mt-3 hidden medium:block large:hidden" />
            </li>
          );
        })}
      </ol>
      {/* All three screens are stacked and cross-fade, so switching never
          waits on an image load or shifts the layout. */}
      <div className="relative hidden large:block">
        {screens.map((sc, i) => (
          <div
            key={sc.src}
            aria-hidden={i !== on}
            className={`duration-500 ease-nav transition-opacity ${i === 0 ? "" : "absolute inset-0"} ${
              i === on ? "opacity-100" : "opacity-0"
            }`}
          >
            <BrowserFrame src={sc.src} />
          </div>
        ))}
      </div>
    </div>
  );
}
