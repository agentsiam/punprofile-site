"use client";

/**
 * The three coaching services as clay cutouts standing on tinted cards, the
 * head breaking above the card's top edge. Built for the home page on
 * 03/11/2026 and shared with `/products` the same day, so the coaching looks
 * the same wherever it is sold.
 *
 * Copy and links are `services.ts`'s own `name` and `question`, linking to the
 * anchor `/coaching` gives each service, so nothing here is written twice.
 */

import Image from "next/image";
import Link from "next/link";
import { useCopy } from "@/components/LocaleProvider";
import { SERVICES } from "@/lib/content/services";
import { DESTINATIONS } from "@/lib/content/cta";

/** Clay cutout per coaching service, files under `public/home/`. */
const SERVICE_CUTOUT: Record<string, string> = {
  coaching: "/home/service-direction.png",
  profile: "/home/service-profile.png",
  applications: "/home/service-applications.png",
};

const SERVICE_TINT = [
  "bg-orange-pale text-on-orange-pale",
  "bg-cyan-pale text-on-cyan-pale",
  "bg-yellow-pale text-on-yellow-pale",
];

export default function CoachingCards({ className = "mt-24" }: { className?: string }) {
  const { pick, path } = useCopy();

  return (
    <ul className={`grid gap-x-6 gap-y-24 large:grid-cols-3 ${className}`}>
      {SERVICES.map((s, i) => (
        <li key={s.id} className="flex">
          <Link
            href={`${path("/coaching")}#${s.id}`}
            className={`group flex w-full flex-col rounded-3xl ${SERVICE_TINT[i % 3]}`}
          >
            <span className="relative -mt-20 block h-72 w-full">
              <Image
                src={SERVICE_CUTOUT[s.id] ?? s.image.src}
                alt={pick(s.image.alt)}
                fill
                sizes="(max-width: 1200px) 60vw, 300px"
                className="object-contain object-bottom duration-[350ms] ease-nav transition-transform group-hover:-translate-y-1"
              />
            </span>
            <span className="flex flex-1 flex-col px-6 pt-4 pb-7">
              <span className="text-heading-sm">{pick(s.name)}</span>
              {/* The client's question, not a tagline. A service described
                  by the problem it answers is checkable. */}
              <span className="mt-3 flex-1 text-body-md">&ldquo;{pick(s.question)}&rdquo;</span>
              <span className="mt-5 flex items-center gap-2 text-body-sm-strong underline underline-offset-4">
                {pick(DESTINATIONS.coaching.label)}
                <span
                  aria-hidden
                  className="duration-[350ms] ease-nav transition-transform group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
