"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Slot from "@/components/blocks/Slot";

/**
 * B13: quote cards as a social-post carousel, grounds rotating.
 *
 * Each card reads like a post: a round avatar, the name and role beside it,
 * then the quote. Cards sit in one horizontal track that scrolls and snaps, so
 * it swipes on a phone and pages with the two round arrows on a desktop.
 *
 * **The arrows only exist while there is somewhere to go.** With three cards on
 * a wide screen the track fits and the controls are not drawn, because a
 * control that does nothing is worse than no control. Each arrow is disabled at
 * its own end.
 *
 * **No stock faces.** These are real clients. A stock photograph beside a real
 * client's name would present a stranger as that client. `portrait` takes a
 * drawn avatar or the client's own photo; without one the avatar is the
 * client's initial on a fixed ground.
 *
 * **Ours renders slots until there is a real quote.** A slot is a coded
 * question with a dashed border round it, and it cannot be mistaken for a
 * client saying something.
 */

export interface Quote {
  quote: React.ReactNode;
  who: React.ReactNode;
  role?: React.ReactNode;
  /** The letter in the avatar. Omit to take it from `who` when that is text. */
  initial?: string;
  portrait?: { src: string; alt: string };
}

/**
 * The first letter worth showing. Thai writes some vowels before the consonant
 * they follow (เ แ โ ใ ไ), and an avatar reading เ for เจ is wrong, so those
 * are skipped.
 */
function initialOf(who: React.ReactNode): string {
  if (typeof who !== "string") return "";
  const chars = Array.from(who.trim());
  const first = chars.find((c) => !/[เ-ไ]/.test(c));
  return (first ?? "").toUpperCase();
}

export default function Testimonials({
  items,
  placeholders = 0,
  codePrefix = "TESTIMONIAL",
  prevLabel = "Previous",
  nextLabel = "Next",
}: {
  items: readonly Quote[];
  /** How many slotted cards to draw while `items` is empty. */
  placeholders?: number;
  /** Slot codes are `${codePrefix}-${n}-quote` and `-who`. */
  codePrefix?: string;
  /** Accessible names for the arrows, picked by the caller (R49). */
  prevLabel?: string;
  nextLabel?: string;
}) {
  const track = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    // A pixel of slack: fractional widths leave scrollLeft one short of the end.
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      ro.disconnect();
    };
  }, [measure, items.length]);

  const page = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const step = card ? card.getBoundingClientRect().width + gap : el.clientWidth;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * step, behavior: reduce ? "auto" : "smooth" });
  };

  if (items.length === 0 && placeholders === 0) return null;

  /*
   * Grounds rotate dark green, then the secondary palette's tints (design.md,
   * 30/10/2026). Each tint carries its own text role. Lime-pale sits out: the
   * drawn avatars already bring the lime, and lime stays the action colour.
   */
  const GROUNDS = [
    "ground-dark bg-canvas-dark",
    "bg-orange-pale text-on-orange-pale",
    "bg-cyan-pale text-on-cyan-pale",
    "bg-yellow-pale text-on-yellow-pale",
  ] as const;
  const dark = (i: number) => i % GROUNDS.length === 0;
  const ground = (i: number) => GROUNDS[i % GROUNDS.length];
  // The avatar sits on the opposite fixed ground, so it reads in both schemes.
  const avatarGround = (i: number) =>
    dark(i) ? "ground-fixed bg-canvas-brand text-ink" : "ground-dark bg-canvas-dark text-ink";

  const card =
    "flex w-[85%] shrink-0 snap-start flex-col rounded-2xl px-7 py-8 medium:w-[360px] large:w-[calc((100%-3rem)/3)]";

  const arrow =
    "inline-flex size-12 items-center justify-center rounded-full border border-line-strong text-ink duration-[350ms] ease-nav transition-colors hover:bg-primary-pale disabled:cursor-default disabled:opacity-35 disabled:hover:bg-transparent";

  const scrolls = !(atStart && atEnd);

  return (
    <div>
      <ul
        ref={track}
        className="-mx-1 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => {
          const letter = item.initial ?? initialOf(item.who);
          return (
            <li key={`q${i}`} className={`${card} ${ground(i)}`}>
              <div className="flex items-center gap-3">
                {item.portrait ? (
                  <Image
                    src={item.portrait.src}
                    alt={item.portrait.alt}
                    width={96}
                    height={96}
                    className="size-12 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden
                    className={`flex size-12 shrink-0 items-center justify-center rounded-full text-body-md-strong ${avatarGround(i)}`}
                  >
                    {letter}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="text-body-sm-strong">{item.who}</p>
                  {item.role && <p className="text-body-sm opacity-80">{item.role}</p>}
                </div>
              </div>
              <p className="mt-5 text-body-md-strong">&ldquo;{item.quote}&rdquo;</p>
            </li>
          );
        })}

        {items.length === 0 &&
          Array.from({ length: placeholders }, (_, i) => (
            <li key={`s${i}`} className={`${card} ${ground(i)}`}>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex size-12 shrink-0 items-center justify-center rounded-full border border-dashed border-line-strong text-caption text-mute-strong"
                >
                  {i + 1}
                </span>
                <Slot code={`${codePrefix}-${i + 1}-who`} block>
                  who said it: a name, and what they were doing at the time
                </Slot>
              </div>
              <div className="mt-5">
                <Slot code={`${codePrefix}-${i + 1}-quote`} block>
                  the quote, in their words, two or three lines
                </Slot>
              </div>
            </li>
          ))}
      </ul>

      {scrolls && (
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className={arrow}
            onClick={() => page(-1)}
            disabled={atStart}
            aria-label={prevLabel}
          >
            <span aria-hidden>&larr;</span>
          </button>
          <button
            type="button"
            className={arrow}
            onClick={() => page(1)}
            disabled={atEnd}
            aria-label={nextLabel}
          >
            <span aria-hidden>&rarr;</span>
          </button>
        </div>
      )}
    </div>
  );
}
