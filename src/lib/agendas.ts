/**
 * The agreed call agendas, coach-facing. `prd.md` section 8, Session tab, owns
 * the wording; change it there first, then here.
 */
export const AGENDAS: Record<"fit_report" | "coaching_session", { title: string; items: string[] }> = {
  fit_report: {
    title: "Assessment, 30 minutes",
    items: [
      "0-3: confirm purpose, identity and capture consent.",
      "3-8: confirm work history and resolve source contradictions.",
      "8-23: assess unresolved competencies, including appropriate English evidence.",
      "23-27: confirm target assumptions and outstanding facts.",
      "27-30: read back findings, confirm delivery date and next preparation.",
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
