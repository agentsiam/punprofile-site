"use client";

/**
 * Frequently asked questions. TASK-087, 14/08/2026.
 *
 * Native `<details>` rather than a JS accordion: it is keyboard operable and
 * announced correctly with no code, it survives before hydration, and browser
 * find-in-page opens a closed section in current Chrome and Safari, which no
 * hand-built version does. The only cost is that the disclosure triangle needs
 * hiding, which is one line.
 *
 * Every answer is sourced. See the note at the top of `src/lib/content/faq.ts`
 * for what this page is deliberately not allowed to say.
 */

import Image from "next/image";
import Link from "next/link";
import { useCopy } from "@/components/LocaleProvider";
import CallToAction from "@/components/CallToAction";
import Band from "@/components/Band";
import { HERO_HEADING } from "@/lib/content/footer";
import { FAQ, FAQ_CLOSE, FAQ_HEADING, FAQ_INTRO } from "@/lib/content/faq";

export default function FaqPage() {
  const { pick, path, locale } = useCopy();

  return (
    <div className="w-full">
      {/* Split with a clay scene since 03/11/2026, the same treatment as
          /pricing and /contact. Art on pale yellow per the brand palette for
          images, so it reads against the white hero. */}
      <Band block="B1" ground="canvas" width="wide">
        <div className="grid items-center gap-10 large:grid-cols-[1fr_1fr] large:gap-16">
          <div>
            <h1 className={HERO_HEADING(locale)}>{pick(FAQ_HEADING)}</h1>
            <p className="mt-4 max-w-xl text-body-large text-on-surface-variant">
              {pick(FAQ_INTRO)}
            </p>
          </div>
          <Image
            src="/faq/faq-questions.jpg"
            alt=""
            width={1200}
            height={896}
            priority
            sizes="(min-width: 1200px) 50vw, 100vw"
            className="aspect-square h-auto w-full rounded-3xl object-cover medium:aspect-[4/3]"
          />
        </div>
      </Band>

      {/* One white card of rows with hairlines between them, after Wise's
          pricing rows, 03/11/2026. Ten separately coloured pills read as ten
          buttons of equal weight; one card reads as one list. Grouping under
          topic headings is the next step and waits on that copy. */}
      <Band block="B5" ground="soft" width="wide">
        <div className="grid items-start gap-8 large:grid-cols-[1.7fr_1fr]">
          <div className="card-plain px-6 py-1">
            {FAQ.map((item) => (
              <details
                key={item.q.en}
                className="group border-b border-line py-5 last:border-b-0 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-body-md-strong text-ink-deep">
                  {pick(item.q)}
                  {/* Rotates rather than swapping glyphs, so the open and closed
                    states are the same shape moving and cannot land at different
                    optical weights between the Thai and Latin stacks. */}
                  <span
                    aria-hidden
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-canvas-soft text-heading-sm text-ink-deep transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="mt-3 flex flex-col gap-3 pr-12">
                  {item.a.map((p, i) => (
                    <p
                      key={i}
                      className="text-body-large text-on-surface-variant"
                    >
                      {pick(p)}
                    </p>
                  ))}
                  {item.link && (
                    <Link
                      href={path(item.link.href)}
                      className="text-body-large text-ink-deep underline underline-offset-2"
                    >
                      {pick(item.link.label)}
                    </Link>
                  )}
                </div>
              </details>
            ))}
          </div>

          {/* The close as a tinted card beside the list rather than a dark band,
            03/11/2026, the way help centres keep the contact route in view
            while you read. Sticky on wide screens, under the list on a phone.
            The secondary (talk to me) is the "still stuck?" route. */}
          <aside className="flex flex-col items-start gap-5 rounded-2xl bg-cyan-pale px-6 py-7 text-on-cyan-pale large:sticky large:top-24">
            <Image
              src="/mascot-magnifier.png"
              alt=""
              width={300}
              height={160}
              className="h-20 w-auto shrink-0"
            />
            <div className="flex-1">
              <p className="text-heading-sm">{pick(FAQ_CLOSE)}</p>
              <CallToAction page="/faq" className="mt-5" />
            </div>
          </aside>
        </div>
      </Band>
    </div>
  );
}
