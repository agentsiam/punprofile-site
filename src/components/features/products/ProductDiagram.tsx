/**
 * The figure on a product page. Added 06/09/2026.
 *
 * ---------------------------------------------------------------------------
 * WHY A DRAWING AND NOT A PHOTOGRAPH
 * ---------------------------------------------------------------------------
 *
 * Every photograph and illustration in `public/` belongs to another surface:
 * the six block photographs are one per section of the assessment, the three
 * service renders are the cards on `/coaching`, and the three flat mascot
 * scenes are the landing page and the coaching hero. Borrowing one puts the
 * same picture on the site twice meaning two different things, and the note
 * this component replaces recorded what happened the last time the product
 * pages did that: art that looks finished is art nobody replaces.
 *
 * So these are not stand-ins for a picture. Each one draws the mechanism the
 * section beside it has just described in words, which is a thing the page can
 * honestly claim to show. A reader who skims the figure and skips the three
 * steps should come away with the same idea.
 *
 * ---------------------------------------------------------------------------
 * HOW THEY ARE DRAWN
 * ---------------------------------------------------------------------------
 *
 * One 400x300 viewBox each, so all five occupy the same 4:3 box the layout
 * already reserves. Colour comes from the token layer through Tailwind's
 * `fill-*` and `stroke-*` utilities and never from a literal, which is what
 * makes them correct in the dark scheme without a single `dark:` (R20): the
 * grounds and the ink flip underneath them.
 *
 * `primary` is a fill and never type here, per R16. Nothing in a figure is a
 * word, so the question does not arise beyond the marks themselves.
 *
 * The figure is decoration with a description: `ProductPage` passes the `alt`
 * from `PRODUCT_ART` as the accessible name, so the SVG carries `role="img"`
 * and a `<title>` rather than `aria-hidden`.
 */

import type { ProductFigure } from "@/lib/content/products";

const FRAME = "h-full w-full";

/** The quiet page the drawing sits on, edge to edge inside the rounded box. */
function Ground() {
  return <rect x="0" y="0" width="400" height="300" className="fill-canvas" />;
}

/**
 * Four gates as four bars, the shortest one marked.
 *
 * `10_Methodology.md`'s core claim drawn rather than written: the lowest
 * uncleared gate is the one that decides, so the figure marks the short bar
 * rather than the tall one. The heights are shape and not data, which is why
 * no axis, no scale and no number appears on it: a figure with a number on it
 * is a figure stating a figure, and R47 exists because that is how a stale
 * number hides.
 */
function Gates() {
  const bars = [
    { x: 56, h: 118 },
    { x: 136, h: 168 },
    { x: 216, h: 64 },
    { x: 296, h: 140 },
  ];
  const short = 2;
  return (
    <>
      <Ground />
      <line x1="40" y1="242" x2="360" y2="242" className="stroke-line-strong" strokeWidth="2" />
      {bars.map((b, i) => (
        <g key={b.x}>
          <rect
            x={b.x}
            y={242 - b.h}
            width="48"
            height={b.h}
            rx="8"
            className={i === short ? "fill-primary" : "fill-primary-pale"}
          />
          {i === short && (
            <>
              <circle cx={b.x + 24} cy={242 - b.h - 26} r="13" className="fill-primary" />
              <path
                d={`M${b.x + 17} ${242 - b.h - 27} l5 6 9 -11`}
                className="stroke-canvas"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </>
          )}
        </g>
      ))}
      {bars.map((b) => (
        <rect
          key={`t-${b.x}`}
          x={b.x + 10}
          y="256"
          width="28"
          height="6"
          rx="3"
          className="fill-line"
        />
      ))}
    </>
  );
}

/**
 * A CV page with its top third marked off.
 *
 * The first of the three steps on `/products/cv-check` is about what the first
 * third of the page spends itself on, because a screener and a reader both
 * start at the top and both stop early. That is the only thing this draws.
 */
function PageFigure() {
  const rows = [96, 118, 140, 168, 190, 212, 234];
  return (
    <>
      <Ground />
      <rect
        x="104"
        y="28"
        width="192"
        height="244"
        rx="10"
        className="fill-canvas stroke-line-strong"
        strokeWidth="2"
      />
      <rect x="104" y="28" width="192" height="56" rx="10" className="fill-primary-pale" />
      <rect x="122" y="44" width="86" height="9" rx="4.5" className="fill-primary" />
      <rect x="122" y="61" width="120" height="7" rx="3.5" className="fill-line-strong" />
      <line
        x1="104"
        y1="84"
        x2="296"
        y2="84"
        className="stroke-primary"
        strokeWidth="2"
        strokeDasharray="6 5"
      />
      {rows.map((y, i) => (
        <rect
          key={y}
          x="122"
          y={y}
          width={i % 3 === 2 ? 92 : 156}
          height="7"
          rx="3.5"
          className="fill-line"
        />
      ))}
      <circle cx="296" cy="84" r="12" className="fill-primary" />
      <path
        d="M290 84 h12 M296 78 v12"
        className="stroke-canvas"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </>
  );
}

/**
 * A report: a chart above the rows it produced.
 *
 * The Fit Report is the full read of a set of answers, so the figure is the
 * chart and the findings under it, in that order, which is the order the
 * document itself is in.
 */
function Report() {
  const rows = [176, 202, 228, 254];
  return (
    <>
      <Ground />
      <rect
        x="40"
        y="24"
        width="320"
        height="252"
        rx="12"
        className="fill-canvas stroke-line-strong"
        strokeWidth="2"
      />
      <rect x="64" y="48" width="272" height="104" rx="8" className="fill-canvas-soft" />
      <polyline
        points="80,132 128,104 176,116 224,72 272,90 320,60"
        fill="none"
        className="stroke-primary"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {[
        [128, 104],
        [224, 72],
        [320, 60],
      ].map(([cx, cy]) => (
        <circle key={cx} cx={cx} cy={cy} r="5" className="fill-primary" />
      ))}
      {rows.map((y, i) => (
        <g key={y}>
          <circle cx="76" cy={y} r="7" className="fill-primary-pale" />
          <rect
            x="94"
            y={y - 4}
            width={[196, 168, 212, 144][i]}
            height="8"
            rx="4"
            className="fill-line"
          />
        </g>
      ))}
    </>
  );
}

/**
 * Three role cards, one of them marked as the match.
 *
 * Matched Jobs sends roles that were searched against one candidate's profile
 * rather than one list sent to everybody, so the figure has to show a choice
 * being made among several rather than a list arriving.
 */
function Roles() {
  const cards = [24, 112, 200];
  return (
    <>
      <Ground />
      {cards.map((y, i) => (
        <g key={y}>
          <rect
            x="48"
            y={y}
            width="304"
            height="72"
            rx="10"
            className={
              i === 1
                ? "fill-primary-pale stroke-primary"
                : "fill-canvas stroke-line-strong"
            }
            strokeWidth="2"
          />
          <circle cx="82" cy={y + 36} r="14" className={i === 1 ? "fill-primary" : "fill-line"} />
          <rect
            x="110"
            y={y + 22}
            width={i === 1 ? 150 : 126}
            height="9"
            rx="4.5"
            className={i === 1 ? "fill-primary" : "fill-line-strong"}
          />
          <rect x="110" y={y + 42} width="182" height="7" rx="3.5" className="fill-line" />
          {i === 1 && (
            <path
              d="M76 36 l5 6 10 -12"
              transform={`translate(0 ${y})`}
              className="stroke-canvas"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          )}
        </g>
      ))}
    </>
  );
}

/**
 * A tracker, four columns wide.
 *
 * Guided Job Hunt is the surface matched roles land on, and the one thing its
 * limit says plainly is that it does not chase employers. A board with columns
 * says that better than a list does: the cards move because the candidate moves
 * them.
 */
function Pipeline() {
  const cols = [24, 120, 216, 312];
  const counts = [3, 2, 2, 1];
  return (
    <>
      <Ground />
      {cols.map((x, i) => (
        <g key={x}>
          <rect x={x} y="28" width="64" height="248" rx="10" className="fill-canvas-soft" />
          <rect x={x + 12} y="44" width="40" height="7" rx="3.5" className="fill-line-strong" />
          {Array.from({ length: counts[i] }).map((_, j) => (
            <rect
              key={j}
              x={x + 10}
              y={66 + j * 52}
              width="44"
              height="42"
              rx="8"
              className={
                i === cols.length - 1 ? "fill-primary" : "fill-canvas stroke-line-strong"
              }
              strokeWidth="2"
            />
          ))}
        </g>
      ))}
      {[88, 184, 280].map((x) => (
        <path
          key={x}
          d={`M${x} 152 l14 0 M${x + 8} 146 l6 6 l-6 6`}
          className="stroke-line-strong"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ))}
    </>
  );
}

const FIGURES: Record<ProductFigure, () => React.ReactElement> = {
  gates: Gates,
  page: PageFigure,
  report: Report,
  roles: Roles,
  pipeline: Pipeline,
};

export default function ProductDiagram({
  figure,
  title,
}: {
  figure: ProductFigure;
  title: string;
}) {
  const Figure = FIGURES[figure];
  return (
    <svg viewBox="0 0 400 300" role="img" className={FRAME} preserveAspectRatio="xMidYMid meet">
      <title>{title}</title>
      <Figure />
    </svg>
  );
}
