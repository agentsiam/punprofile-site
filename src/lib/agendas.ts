/**
 * The agreed call agendas, coach-facing. `prd.md` section 8, Session tab, owns
 * them; the assessment's run sheet itself is the Fit Report interview skill's.
 */
export const AGENDAS: Record<"fit_report" | "coaching_session", { title: string; items: string[] }> = {
  fit_report: {
    title: "Fit Report assessment, 30 minutes",
    items: [
      "Four blocks of 5, 12, 8 and 5 minutes, run from the Fit Report interview skill, which owns their content.",
      "The report cannot be delivered until all eight interview items are settled.",
    ],
  },
  coaching_session: {
    title: "Coaching preview, 60 minutes",
    items: [
      "0-5: confirm desired outcome and report understanding where applicable.",
      "5-20: choose primary role family, seniority and employer direction.",
      "20-35: prioritise gaps and agree evidence-led CV positioning.",
      "35-48: build practical actions, dependencies and timeline.",
      "48-55: confirm matching rules, limits and customer responsibilities.",
      "55-60: read back decisions and confirm written delivery date.",
    ],
  },
};
