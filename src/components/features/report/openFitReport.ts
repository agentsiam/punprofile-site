"use client";

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
) {
  const win = window.open("", "_blank");
  if (!win) {
    return false;
  }
  win.document.write("<!doctype html><title>Building…</title><p>Building the Fit Report…");
  const [{ renderFitReport }, { scoreResponse, scoreFull }, { toScoringInputForLead }, { rankMoves }, { matchRoles }, { ECRA }] =
    await Promise.all([
      import("@/lib/report"),
      import("@/lib/scoring"),
      import("@/lib/content/mapping"),
      import("@/lib/levers"),
      import("@/lib/market-match"),
      import("@/lib/ecra"),
    ]);
  const input = toScoringInputForLead(lead.responses);
  const profile = scoreResponse(input);
  const html = renderFitReport(
    {
      profile,
      full: scoreFull(profile, ratings, (k) => ECRA[k]?.formula),
      moves: rankMoves(input),
      roles: matchRoles(input.targetCountries ?? [], input.targetRole),
    },
    {
      candidate: lead.fullName ?? "Anonymous lead",
      targetCountries: input.targetCountries,
      targetRole: input.targetRole ?? undefined,
    },
    { locale, autoPrint: true },
  );
  win.document.open();
  win.document.write(html);
  win.document.close();
  return true;
}

