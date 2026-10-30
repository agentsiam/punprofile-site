"use client";

/**
 * The two coaches as equal cards, for the home page's "who is behind this"
 * block. 30/10/2026, replacing the single wide photo of Paul.
 *
 * Same photo frame, same rows, same height: a reader compares the two people,
 * so nothing about the layout may rank one above the other. Each card links to
 * that coach's row on /coaching, where the long story lives. Copy is `COACHES`
 * in `coaching.ts`.
 *
 * White cards on the white ground need an edge, so they carry the hairline
 * `outline-variant` border rather than a shadow (`wise-1`: no elevation).
 */

import Image from "next/image";
import Link from "next/link";
import { useCopy } from "@/components/LocaleProvider";
import { COACHES } from "@/lib/content/coaching";

export const COACH_PHOTO: Record<string, string> = {
  paul: "/coach-paul.jpg",
  dew: "/coach-tatiya.jpg",
};

export default function CoachCards() {
  const { pick, path } = useCopy();
  return (
    <div className="grid gap-6 medium:grid-cols-2">
      {COACHES.map((c) => (
        <article
          key={c.id}
          className="flex flex-col overflow-hidden rounded-[30px] border border-outline-variant bg-canvas"
        >
          <Image
            src={COACH_PHOTO[c.id]}
            alt={pick(c.alt)}
            width={1200}
            height={900}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="aspect-[4/3] w-full object-cover"
          />
          <div className="flex flex-1 flex-col px-6 pb-7 pt-6 medium:px-8">
            <h3 className="text-heading-sm text-on-surface">{pick(c.name)}</h3>
            <p className="mt-1 text-body-medium text-on-surface-variant">{pick(c.role)}</p>
            <p className="mt-4 text-body-large text-on-surface">{pick(c.summary)}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {c.pills.map((p, i) => (
                <li
                  key={i}
                  className="rounded-full bg-primary px-3 py-1 text-body-medium text-on-primary"
                >
                  {pick(p)}
                </li>
              ))}
            </ul>
            <Link
              href={path(`/coaching#${c.id}`)}
              className="group mt-auto inline-flex items-center gap-2 pt-6 text-body-md-strong text-on-surface underline underline-offset-4"
            >
              {pick(c.link)}
              <span
                aria-hidden
                className="duration-[350ms] ease-nav transition-transform group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
