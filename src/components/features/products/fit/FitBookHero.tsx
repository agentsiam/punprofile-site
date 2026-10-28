"use client";

/**
 * The Fit Report page's first screen: the book, as the free report shows it.
 * Added 28/10/2026 (Paul, 1a). Same builder as the PDF, so the page and the
 * report cannot show two different books.
 */

import { useEffect, useState } from "react";
import { useCopy } from "@/components/LocaleProvider";
import ReportFrame from "./ReportFrame";
import { SAMPLE_LABEL } from "@/lib/content/home";
import { FIT_SAMPLE_INPUT } from "@/lib/fit-sample";

export default function FitBookHero() {
  const { t, locale } = useCopy();
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    import("@/lib/report").then(({ renderBookPreview }) => {
      if (!live) return;
      setHtml(
        renderBookPreview(locale, {
          name: SAMPLE_LABEL[locale],
          sub: [FIT_SAMPLE_INPUT.targetRole, FIT_SAMPLE_INPUT.targetCountries?.join(", ")].filter(Boolean).join(" · "),
        }),
      );
    });
    return () => {
      live = false;
    };
  }, [locale]);

  return (
    <div className="mt-12">
      <div className="card-outlined overflow-hidden bg-canvas-soft">
        <ReportFrame html={html} title={t("report.full.example")} />
      </div>
      <p className="mt-3 text-body-medium text-on-surface-variant">{t("report.full.example")}</p>
    </div>
  );
}
