"use client";

/**
 * The coaches on /coaching as two equal cards side by side, 04/11/2026 (Paul
 * chose 1a in the /coaching revamp). Each card shows the portrait, the pill,
 * the greeting, the pull line and the credential chips, and folds the long
 * story under the coach's own "Read … story" link text, so two walls of text
 * become two cards a reader can open.
 *
 * Replaces `CoachRows` on this page. Each card keeps the coach's `id` as its
 * anchor, which the home page's coach cards link to; arriving on that anchor
 * opens the story.
 */

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCopy } from "@/components/LocaleProvider";
import { COACHES } from "@/lib/content/coaching";
import { COACH_PHOTO } from "./CoachCards";

export default function CoachFold() {
  const { pick } = useCopy();
  const [hash, setHash] = useState("");
  useEffect(() => {
    const read = () => setHash(window.location.hash.replace("#", ""));
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  return (
    <div className="grid gap-6 large:grid-cols-2 large:items-start">
      {COACHES.map((c) => (
        <article
          key={c.id}
          id={c.id}
          className="flex scroll-mt-24 flex-col overflow-hidden rounded-[30px] border border-outline-variant bg-canvas"
        >
          <Image
            src={COACH_PHOTO[c.id]}
            alt={pick(c.alt)}
            width={1200}
            height={900}
            sizes="(min-width: 1200px) 50vw, 100vw"
            className="aspect-[4/3] w-full object-cover"
          />
          <div className="flex flex-1 flex-col px-6 pb-7 pt-6 medium:px-8">
            <p className="self-start rounded-full bg-primary px-3 py-1 text-body-medium text-on-primary">
              {pick(c.pill)}
            </p>
            <h2 className="mt-4 text-headline-sm text-on-surface">{pick(c.heading)}</h2>
            <p className="mt-4 border-l-4 border-primary pl-4 text-heading-xs text-on-surface">
              {pick(c.pull)}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {c.pills.map((p, i) => (
                <li
                  key={i}
                  className="rounded-full border border-line px-3 py-1 text-body-sm text-on-surface"
                >
                  {pick(p)}
                </li>
              ))}
            </ul>
            <details className="group mt-6" open={hash === c.id}>
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 border-t border-line pt-4 text-body-md-strong text-ink-deep [&::-webkit-details-marker]:hidden">
                {pick(c.link)}
                <span
                  aria-hidden
                  className="flex size-8 items-center justify-center rounded-full bg-primary-pale text-on-primary-pale duration-[350ms] ease-nav transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="mt-4 flex flex-col gap-4">
                {c.story.map((p, j) => (
                  <p key={j} className="text-body-md text-on-surface-variant">
                    {pick(p)}
                  </p>
                ))}
              </div>
            </details>
          </div>
        </article>
      ))}
    </div>
  );
}
