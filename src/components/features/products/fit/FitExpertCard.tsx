"use client";

/**
 * Who runs the interview, as the reason to trust the report. Added 28/10/2026
 * (Paul, 2a), rewritten the same day from Paul's own facts: he has been the
 * Thai applicant sending CVs into Europe, and he is now the hiring manager the
 * CVs reach after the AI and Talent Acquisition screens. No hire counts, by his
 * choice, and no employer name.
 */

import Image from "next/image";
import Link from "next/link";
import { useCopy } from "@/components/LocaleProvider";
import Band from "@/components/Band";
import { SECTION_HEADING } from "@/lib/content/footer";
import { PORTRAIT_ALT } from "@/lib/content/coaching";
import { FIT_EXPERT, FIT_EXPERT_HEADING } from "@/lib/content/products";

export default function FitExpertCard() {
  const { pick, locale, path } = useCopy();
  return (
    <Band block="B7" ground="canvas" width="wide">
      <h2 className={SECTION_HEADING(locale)}>{pick(FIT_EXPERT_HEADING)}</h2>
      <div className="ground-dark mt-8 grid gap-8 rounded-[30px] bg-canvas-dark px-6 py-8 text-on-canvas-dark medium:grid-cols-[12rem_1fr] medium:px-10 medium:py-10">
        <Image
          src="/paul-portrait.png"
          alt={pick(PORTRAIT_ALT)}
          width={421}
          height={421}
          className="size-28 rounded-full bg-primary object-cover medium:size-48"
        />
        <div>
          <h3 className="text-[1.75rem] font-semibold leading-snug text-white">{pick(FIT_EXPERT.title)}</h3>
          <p className="mt-2 text-body-md-strong text-primary">{pick(FIT_EXPERT.role)}</p>
          <div className="mt-6 grid gap-4 large:grid-cols-2">
            {[
              [FIT_EXPERT.applicantHeading, FIT_EXPERT.applicant],
              [FIT_EXPERT.hiringHeading, FIT_EXPERT.hiring],
            ].map(([h, b], i) => (
              <div key={i} className="rounded-[20px] bg-white/[0.07] px-5 py-5">
                <p className="text-body-md-strong text-primary">{pick(h)}</p>
                <p className="mt-2 text-body-md text-on-canvas-dark">{pick(b)}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-body-large text-on-canvas-dark">{pick(FIT_EXPERT.bridge)}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {FIT_EXPERT.facts.map((f, i) => (
              <li key={i} className="rounded-full px-3 py-1.5 text-body-sm text-on-canvas-dark ring-1 ring-inset ring-white/30">
                {pick(f)}
              </li>
            ))}
          </ul>
          <Link
            href={path("/coaching")}
            className="group mt-6 inline-flex items-center gap-2 text-body-md-strong text-primary underline underline-offset-4"
          >
            {pick(FIT_EXPERT.link)}
            <span aria-hidden className="duration-[350ms] ease-nav transition-transform group-hover:translate-x-1">&rarr;</span>
          </Link>
        </div>
      </div>
    </Band>
  );
}
