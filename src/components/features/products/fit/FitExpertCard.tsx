"use client";

/**
 * Who runs the interview. Added 28/10/2026 (Paul, 2a).
 *
 * Every coach-led page in the research put the person beside the offer. The
 * page still says "Expert"; this card answers who that is, in the words and
 * the portrait /coaching already uses, and sends anyone who wants more there.
 */

import Image from "next/image";
import Link from "next/link";
import { useCopy } from "@/components/LocaleProvider";
import Band from "@/components/Band";
import { SECTION_HEADING } from "@/lib/content/footer";
import { FOUNDER_BEFORE, FOUNDER_HEADING, PORTRAIT_ALT } from "@/lib/content/coaching";
import { FIT_EXPERT_HEADING } from "@/lib/content/products";

export default function FitExpertCard() {
  const { t, pick, locale, path } = useCopy();
  return (
    <Band block="B7" ground="canvas" width="wide">
      <h2 className={SECTION_HEADING(locale)}>{pick(FIT_EXPERT_HEADING)}</h2>
      <div className="card-outlined mt-8 flex flex-col gap-6 px-6 py-7 medium:flex-row medium:items-start medium:px-8">
        <Image
          src="/paul-portrait.png"
          alt={pick(PORTRAIT_ALT)}
          width={421}
          height={421}
          className="size-24 shrink-0 rounded-full bg-canvas-soft object-cover medium:size-28"
        />
        <div>
          <h3 className="text-heading-sm text-ink-deep">{pick(FOUNDER_HEADING)}</h3>
          <p className="mt-3 max-w-2xl text-body-large text-on-surface-variant">{pick(FOUNDER_BEFORE[0])}</p>
          <Link
            href={path("/coaching")}
            className="group mt-4 inline-flex items-center gap-2 text-body-md-strong text-ink-deep underline underline-offset-4"
          >
            {t("nav.coaching")}
            <span aria-hidden className="duration-[350ms] ease-nav transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </Band>
  );
}
