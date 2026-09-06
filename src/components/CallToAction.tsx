"use client";

/**
 * Renders a page's declared actions. TASK-090, 14/08/2026.
 *
 * The framework in `src/lib/content/cta.ts` is only worth having if pages
 * cannot quietly disagree with it, so they do not hand-roll buttons any more:
 * they name their route and this renders whatever the table says. Changing what
 * a page asks for is now an edit to one table, and the check in
 * `scripts/verify-content.ts` runs against that same table.
 *
 * Rule 5 lives here and nowhere else. Primary is a filled Terracotta pill;
 * secondary is a text link. There is deliberately no `variant` prop and no way
 * to render a secondary as a button, because every instance of two buttons on
 * one screen started as somebody having a good reason.
 */

import Link from "next/link";
import { useCopy } from "@/components/LocaleProvider";
import { DESTINATIONS, PAGE_ACTIONS, primaryChannels } from "@/lib/content/cta";
import type { Action } from "@/lib/content/cta";

const BASE =
  "inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full px-8 py-4 text-body-large font-semibold transition-colors";

const PRIMARY_CLASS = `${BASE} btn-filled`;

/**
 * LINE Green, from LINE's own button guidelines. Hard-coded rather than added
 * to the theme on purpose: it is not a PunProfile colour and must never become
 * available to a PunProfile component. `#05b34c` is the hover, LINE's own
 * darker state.
 *
 * ---------------------------------------------------------------------------
 * THE LABEL IS DARK, NOT WHITE, AND THAT IS A DELIBERATE DEPARTURE
 * ---------------------------------------------------------------------------
 *
 * **White on `#06c755` measures 2.26:1.** The floor for this size is 4.5, so
 * the one button the contact page exists for was the only text on the site
 * failing AA, in both colour schemes, at both widths. Measured on the built
 * page 06/09/2026, and it was the last finding of that pass to be settled
 * because it is not a bug: white on green is what LINE's own guidelines ask
 * for.
 *
 * Paul's call, 06/09/2026, choosing the exact brand green over the exact brand
 * lockup: the ground stays `#06c755` and the LABEL goes dark.
 *
 * `#163300` measures **6.17:1** on the green and **5.01:1** on the hover, so
 * both states clear AA. It is written as a literal rather than as
 * `text-ink-deep`, and that is the whole point: this is a fixed ground, like
 * `.ground-fixed` and `.ground-dark` in `globals.css`, so anything on it has to
 * be pinned or it follows the scheme and disappears. `ink-deep`'s dark value is
 * `#cdffad`, which on this green is 1.75 and would have moved the failure
 * rather than fixed it. The number happens to be `ink-deep`'s own LIGHT value,
 * which is why it looks like the brand rather than like a compromise.
 *
 * **The mark is unchanged**, and see `LineMark` for how that is kept true: the
 * bubble is still white and the wordmark is still the green showing through it.
 * Only the words beside it moved.
 */
const LINE_CLASS = `${BASE} bg-[#06c755] text-[#163300] hover:bg-[#05b34c]`;

/**
 * The LINE mark, drawn rather than shipped as an asset.
 *
 * The speech bubble with the wordmark cut out of it, which is how the mark
 * behaves on a coloured button: the glyph is the background showing through,
 * not white paint, so it stays crisp at 20px where a raster asset would not.
 *
 * **The bubble was `currentColor` and is now white**, 06/09/2026, and the swap
 * is what keeps the mark correct after the label went dark. `currentColor` was
 * right while the label was white, because then the mark and the words were the
 * same colour by construction and could not drift apart. Once the label is
 * `#163300` the same inheritance would have painted the bubble dark green,
 * which is not LINE's mark: a dark bubble with green letters is a modified
 * lockup, and modifying somebody's lockup is a bigger departure than
 * recolouring the text beside it.
 *
 * So the two are decoupled on purpose. The mark is LINE's, in LINE's colours,
 * and the words are ours. `#06c755` on the letterforms below is the same green
 * as the button, so they are still the ground showing through rather than paint.
 */
function LineMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5 shrink-0" fill="#ffffff">
      <path d="M12 2.4c5.52 0 10 3.63 10 8.1 0 1.79-.7 3.4-2.05 4.86-1.95 2.24-6.3 4.97-7.3 5.39-.98.41-.85-.26-.81-.5l.13-.8c.03-.24.06-.6-.03-.83-.1-.26-.5-.4-.8-.46C6.3 17.53 2 14.15 2 10.5c0-4.47 4.48-8.1 10-8.1Z" />
      <path
        d="M9.4 8.62v3.53M6.9 8.62v3.53h1.9M17.1 8.62h-1.9v3.53h1.9M15.2 10.38h1.6M11.2 12.15V8.62l2.3 3.53V8.62"
        fill="none"
        stroke="#06c755"
        // 1.2, not 1.05. Rendered both at the real 20px: the lighter stroke thins out
        // and the counters in the N and E start to close up.
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Primary({ action, label, href }: { action: Action; label: string; href: string }) {
  const line = action.brand === "line";
  const body = (
    <>
      {line && <LineMark />}
      {label}
      {/* No arrow on a channel button. The arrow means "onward through the
          site"; LINE opens an app, which is a different promise. */}
      {!line && <span aria-hidden>&rarr;</span>}
    </>
  );
  // `mailto:` and a LINE deep link are not routes, so they must not go through
  // the client router.
  return action.external ? (
    <a
      href={href}
      className={line ? LINE_CLASS : PRIMARY_CLASS}
      {...(line ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {body}
    </a>
  ) : (
    <Link href={href} className={PRIMARY_CLASS}>
      {body}
    </Link>
  );
}

export default function CallToAction({
  page,
  className = "",
  align = "start",
  show = "both",
}: {
  /** Key into `PAGE_ACTIONS`, e.g. "/coaching". */
  page: string;
  className?: string;
  align?: "start" | "center";
  /**
   * Which halves to render. One prop rather than two booleans, because
   * `primaryOnly` and `secondaryOnly` both set to true is a state that should
   * not be expressible.
   *
   * A card grid repeating the primary under rule 1 uses "primary" on each card
   * and "secondary" once at the foot of the page: the primary belongs to every
   * card because a reader finishes at a different one each time, the secondary
   * belongs to the page and must appear exactly once.
   */
  show?: "both" | "primary" | "secondary";
}) {
  const { pick, path } = useCopy();
  const actions = PAGE_ACTIONS[page];
  // A page not in the table renders nothing rather than guessing. The check
  // makes this impossible to ship, so it only ever happens mid-edit.
  if (!actions) return null;

  const channels = show === "secondary" ? [] : primaryChannels(actions);
  const secondary =
    show !== "primary" && actions.secondary ? (DESTINATIONS[actions.secondary] as Action) : null;
  if (channels.length === 0 && !secondary) return null;

  return (
    <div
      className={`flex flex-col gap-4 ${align === "center" ? "items-center" : "items-start"} ${className}`}
    >
      {/* Channels of one action sit side by side. Both carry primary weight
          because they are the same action, which is rule 2. */}
      {channels.length > 0 && (
        <div className={`flex flex-wrap gap-3 ${align === "center" ? "justify-center" : ""}`}>
          {channels.map((action) => (
            <Primary
              key={action.href}
              action={action}
              href={path(action.href)}
              label={pick(action.label)}
            />
          ))}
        </div>
      )}

      {secondary && (
        <Link
          href={path(secondary.href)}
          className="text-body-large text-ink underline underline-offset-2"
        >
          {pick(secondary.label)}
        </Link>
      )}
    </div>
  );
}
