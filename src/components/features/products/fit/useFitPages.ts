"use client";

/**
 * The sample Fit Report, rendered once per locale and shared by every band on
 * the page that shows a piece of it. 28/10/2026.
 */

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/locale";

const cache = new Map<Locale, Promise<(id: string) => string>>();

function load(locale: Locale) {
  let p = cache.get(locale);
  if (!p) {
    p = Promise.all([import("@/lib/report"), import("@/lib/fit-sample")]).then(([r, f]) => {
      const html = r.renderFitReport(f.fitSampleInput(), f.fitSampleMeta(locale), {
        locale,
        autoPrint: false,
        sampleNotes: true,
      });
      return (id: string) => r.fitReportPage(html, id);
    });
    cache.set(locale, p);
  }
  return p;
}

export function useFitPages(locale: Locale, ids: readonly string[]) {
  const [pages, setPages] = useState<Record<string, string> | null>(null);
  const key = ids.join(",");
  useEffect(() => {
    let live = true;
    load(locale).then((page) => {
      if (live) setPages(Object.fromEntries(key.split(",").map((id) => [id, page(id)])));
    });
    return () => {
      live = false;
    };
  }, [locale, key]);
  return pages;
}
