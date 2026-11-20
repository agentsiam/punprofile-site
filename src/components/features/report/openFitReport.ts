"use client";

import type { ReportRoles } from "@/lib/market-match";

/**
 * Opens the paid Fit Report in a new tab, ready to print or save as PDF.
 * Shared by the Candidate 360 and the candidate's own page, so both build the
 * one document from the same inputs and cannot drift apart.
 */

/**
 * The paid Fit Report, built the same way as `openReport`: at click time, from
 * the stored answers plus the coach's interview ratings, nothing persisted.
 * Added 26/10/2026.
 */
export async function openFitReport(
  lead: { fullName: string | null; responses: Record<string, unknown>; createdAt: number },
  ratings: { itemKey: string; value: number; score: number; note?: string }[],
  locale: "th" | "en",
  /**
   * What `api.reportRoles.forReport` returned for this person: the roles
   * PunProfile sent them and their active target titles. Both callers read
   * it from that one query, so the coach and the candidate cannot end up
   * holding two different reports. Null where the read was unavailable, and
   * the page then falls back to the public pipeline rather than telling a
   * paying client that nothing fits them.
   */
  roles: ReportRoles | null,
) {
  const win = window.open("", "_blank");
  if (!win) {
    return false;
  }
  win.document.write("<!doctype html><title>Building…</title><p>Building the Fit Report…");
  const [{ renderFitReport }, { scoreResponse, scoreFull }, { toScoringInputForLead }, { rankMoves }, { matchPipeline }, { ECRA }] =
    await Promise.all([
      import("@/lib/report"),
      import("@/lib/scoring"),
      import("@/lib/content/mapping"),
      import("@/lib/levers"),
      import("@/lib/market-match"),
      import("@/lib/ecra"),
    ]);
  const input = toScoringInputForLead(lead.responses);
  const sent = roles?.sent ?? [];
  const targets = roles?.targets ?? [];
  const profile = scoreResponse(input);
  const html = renderFitReport(
    {
      profile,
      full: scoreFull(profile, ratings, (k) => ECRA[k]?.formula),
      moves: rankMoves(input),
      roles: {
        sent,
        // Only read when they have nothing of their own, and matched on their
        // target titles where they have any.
        pipeline: sent.length
          ? { inCountries: 0, matching: 0, examples: [] }
          : matchPipeline(input.targetCountries ?? [], targets, input.targetRole),
      },
    },
    {
      candidate: lead.fullName ?? "Anonymous lead",
      targetCountries: input.targetCountries,
      targetRole: input.targetRole ?? undefined,
      targetTitles: targets.map((t) => t.title),
    },
    { locale, autoPrint: true, assetOrigin: window.location.origin },
  );
  win.document.open();
  win.document.write(html);
  win.document.close();
  return true;
}

