"use client";

/**
 * A piece of the real report, shown on a page. Added 28/10/2026 for the Fit
 * Report page.
 *
 * An iframe rather than inline HTML because the report carries its own
 * stylesheet, written for paper, and it must not leak into the site or take
 * the site's colour scheme. `srcDoc` keeps it same-origin, so the frame can be
 * sized to its content.
 *
 * Two modes. `sheet` is a fixed page (794 by `sheetHeight` CSS px) scaled to
 * the width it is given, for the page tiles. Without it the frame is as wide as
 * its container and as tall as its content, for the book, which is responsive
 * on its own.
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function ReportFrame({
  html,
  title,
  sheetHeight,
  className = "",
}: {
  html: string | null;
  title: string;
  sheetHeight?: number;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(0.3);
  const [height, setHeight] = useState<number | null>(null);
  const SHEET_W = 794;

  // Measured once before paint, then on every resize. The first measure must
  // not wait for ResizeObserver: a tab rendered in the background (a preview
  // pane, a prerender) can hold its callbacks back, and the page then sat at
  // the 0.3 starting scale. Found testing the live page 30/10/2026.
  useLayoutEffect(() => {
    if (sheetHeight && wrap.current?.clientWidth) setScale(wrap.current.clientWidth / SHEET_W);
  }, [sheetHeight, html]);

  useEffect(() => {
    if (!sheetHeight || !wrap.current) return;
    const el = wrap.current;
    const onResize = () => setScale(el.clientWidth / SHEET_W);
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(el);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [sheetHeight]);

  useEffect(() => {
    if (sheetHeight) return;
    const f = frame.current;
    if (!f) return;
    const measure = () => {
      const doc = f.contentDocument;
      if (doc?.body) setHeight(doc.documentElement.scrollHeight);
    };
    f.addEventListener("load", measure);
    const ro = new ResizeObserver(measure);
    if (wrap.current) ro.observe(wrap.current);
    // Fonts arrive after load and change the height.
    const t = window.setTimeout(measure, 800);
    return () => {
      f.removeEventListener("load", measure);
      ro.disconnect();
      window.clearTimeout(t);
    };
  }, [html, sheetHeight]);

  if (sheetHeight) {
    return (
      <div
        ref={wrap}
        className={`relative w-full overflow-hidden ${className}`}
        style={{ aspectRatio: `${SHEET_W} / ${sheetHeight}` }}
      >
        {html && (
          <iframe
            ref={frame}
            title={title}
            srcDoc={html}
            tabIndex={-1}
            aria-hidden
            scrolling="no"
            className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
            style={{ width: SHEET_W, height: sheetHeight, transform: `scale(${scale})` }}
          />
        )}
      </div>
    );
  }

  return (
    <div ref={wrap} className={`w-full ${className}`} style={{ minHeight: height ?? 240 }}>
      {html && (
        <iframe
          ref={frame}
          title={title}
          srcDoc={html}
          tabIndex={-1}
          scrolling="no"
          className="pointer-events-none block w-full border-0"
          style={{ height: height ?? 240 }}
        />
      )}
    </div>
  );
}
