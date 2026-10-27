"use client";

/**
 * The result screen's Fit Report card, and the candidate's own PDF. Added
 * 26/10/2026, Paul's call: the moment someone finishes the check is when they
 * are most interested, and until now this screen never mentioned the paid
 * Fit Report.
 *
 * Two actions, deliberately unequal. The download is the candidate's own
 * report, built here from their answers and saved to their device, so the
 * Fit Report offer printed inside it stays with them after they close the
 * tab. The link goes to the Fit Report page, which carries the way to buy.
 *
 * The PDF is the same `limited` document a coach sends, in the locale the
 * candidate is reading, and `renderReport` runs `assertCandidateSafe` on it as
 * it always does. Nothing is stored: it is built in the browser at the click.
 */

import { useState } from "react";
import Link from "next/link";
import { useCopy } from "@/components/LocaleProvider";
import FullSampleChart from "@/components/features/products/FullSampleChart";
import { FULL_CTA, HERO_FULL_LABEL } from "@/lib/content/products";

export default function FitReportOffer({
  responses,
  name,
}: {
  responses: Record<string, unknown>;
  /** Typed at the contact step; goes on the cover of the Fit Report book in the PDF. */
  name?: string;
}) {
  const { t, pick, path, locale } = useCopy();
  const [building, setBuilding] = useState(false);

  async function download() {
    // The tab opens before anything is awaited, or the browser blocks it as a
    // popup. Same reason as the coach's report buttons in `LeadDetail.tsx`.
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write("<!doctype html><title>…</title><p>…");
    setBuilding(true);
    try {
      const [{ renderReport }, { scoreResponse }, { toScoringInput }] = await Promise.all([
        import("@/lib/report"),
        import("@/lib/scoring"),
        import("@/lib/content/mapping"),
      ]);
      const input = toScoringInput(responses as Parameters<typeof toScoringInput>[0]);
      const html = renderReport(
        scoreResponse(input),
        {
          candidate: t("report.self.title"),
          coverName: name || "Fit Report",
          submittedAt: new Date().toISOString().slice(0, 10),
          targetCountries: input.targetCountries,
          targetRole: input.targetRole ?? undefined,
        },
        { variant: "limited", locale, autoPrint: true },
      );
      win.document.open();
      win.document.write(html);
      win.document.close();
    } finally {
      setBuilding(false);
    }
  }

  return (
    <div className="card-outlined mt-10 grid gap-8 rounded-large px-5 py-6 text-left large:grid-cols-[1fr_1.1fr] large:items-center large:px-8">
      <div>
        <span className="inline-flex rounded-full bg-canvas-brand px-3 py-1 text-body-sm-strong text-ink-deep">
          {pick(HERO_FULL_LABEL)}
        </span>
        <h2 className="mt-4 text-title-large">{t("result.fitReport.heading")}</h2>
        <p className="mt-2 text-body-large text-on-surface-variant">{t("result.fitReport.body")}</p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={download}
            disabled={building}
            className="btn-tonal inline-flex min-h-12 items-center px-6 text-body-large font-semibold"
          >
            {t("result.download")}
          </button>
          <Link
            href={path("/products/fit-report")}
            className="text-body-md-strong text-ink-deep underline underline-offset-4"
          >
            {pick(FULL_CTA)}
          </Link>
        </div>
      </div>
      <div>
        <h3 className="text-heading-sm text-ink-deep">{t("dimension.employability")}</h3>
        <FullSampleChart />
      </div>
    </div>
  );
}
