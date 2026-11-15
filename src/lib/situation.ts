/**
 * The Situation panel: the candidate's current situation, first on the Session
 * tab, `candidate-situation-handoff.md`. One glance answers where this person
 * is and what anything we send them has to respect.
 *
 * Pure. The Convex query gathers the lead and their target titles, this decides
 * the rows, their order, and the one line each of them reads as. Every
 * candidate-facing message, match reason and search reads the panel, so one
 * module turns a stored row into words and nothing else writes that wording.
 *
 * The seven rows and what they hold are the handoff's, not this file's: a row
 * added or dropped here is a product decision and belongs in the sibling repo
 * first.
 */

/** Which of the three writers set a value. Nothing else writes the panel. */
export type SituationSource = "candidate" | "coach" | "system";

/** The stamp every row carries: who, when, and what it was read off. */
export type RowStamp = {
  source: SituationSource;
  at: number;
  /** The coach's address, for a coach change only. */
  by?: string;
  /** Where the value came from, in words: a call date, a document. */
  evidence?: string;
};

export type GoalRow = RowStamp & { countries: string[]; cities: string[] };
export type WorkRouteRow = RowStamp & { text: string; changesOn?: string };
export type AvailableFromRow = RowStamp & { date: string };
export type PayFloor = { amount: number; currency: string; per: "year" | "month" };
export type EmployersMustOfferRow = RowStamp & {
  sponsorship: "required" | "not_required" | "required_until_available";
  payFloor?: PayFloor;
  languages: string[];
};
export type HeardFromEmployersRow = RowStamp & { objections: string[] };
export type WhereTheyAreNowRow = RowStamp & { text: string };
export type NextFromUsRow = RowStamp & { text: string; dueOn?: string; doneAt?: number };

export type Situation = {
  goal?: GoalRow;
  workRoute?: WorkRouteRow;
  availableFrom?: AvailableFromRow;
  employersMustOffer?: EmployersMustOfferRow;
  heardFromEmployers?: HeardFromEmployersRow;
  whereTheyAreNow?: WhereTheyAreNowRow;
  nextFromUs?: NextFromUsRow;
};

export const SITUATION_ROWS = [
  "goal",
  "workRoute",
  "availableFrom",
  "employersMustOffer",
  "heardFromEmployers",
  "whereTheyAreNow",
  "nextFromUs",
] as const;

export type SituationRowKey = (typeof SITUATION_ROWS)[number];

export const ROW_LABEL: Record<SituationRowKey, string> = {
  goal: "Goal",
  workRoute: "Work route",
  availableFrom: "Available from",
  employersMustOffer: "What employers must offer",
  heardFromEmployers: "Heard from employers",
  whereTheyAreNow: "Where they are now",
  nextFromUs: "Next from us",
};

/** What the row is for, shown beside its label so the coach fills the right thing. */
export const ROW_ASKS: Record<SituationRowKey, string> = {
  goal: "Country and cities. The titles come from their target titles.",
  workRoute: "How they can legally work there, and the date it changes.",
  availableFrom: "Their earliest start date.",
  employersMustOffer: "Sponsorship or not, the floor under the pay, the languages they hold.",
  heardFromEmployers: "Objections employers have already put to them.",
  whereTheyAreNow: "One line: what is happening this week.",
  nextFromUs: "The one thing we owe them next, and by when.",
};

const SOURCE_WORD: Record<SituationSource, string> = {
  candidate: "from them",
  coach: "set by the coach",
  system: "recorded by the app",
};

/** A date the panel stores: ISO `YYYY-MM-DD`, or `YYYY-MM` where only the month is known. */
export function isPanelDate(s: string): boolean {
  return /^\d{4}-\d{2}(-\d{2})?$/.test(s) && !Number.isNaN(Date.parse(s.length === 7 ? `${s}-01` : s));
}

/** DD/MM/YYYY, or MM/YYYY for a month, because prose dates read that way here. */
export function panelDate(s: string): string {
  const [y, m, d] = s.split("-");
  return d ? `${d}/${m}/${y}` : `${m}/${y}`;
}

const list = (xs: string[]) => xs.filter((x) => x.trim()).join(", ");

export function payFloorLine(f: PayFloor): string {
  const amount = f.amount >= 1000 && f.amount % 1000 === 0 ? `${f.amount / 1000}K` : String(f.amount);
  return `${f.currency} ${amount} a ${f.per}`;
}

const SPONSORSHIP_LINE: Record<EmployersMustOfferRow["sponsorship"], string> = {
  required: "Sponsorship needed",
  not_required: "No sponsorship needed",
  required_until_available: "Sponsorship needed, or a start on or after their available date",
};

/**
 * The one line a row reads as, in the coach's and an agent's language both.
 * Null means the row is empty: nobody has established it, which a reader shows
 * as unknown and never as none.
 */
export function rowLine(s: Situation, key: SituationRowKey, titles: string[] = []): string | null {
  switch (key) {
    case "goal": {
      const r = s.goal;
      const where = r ? [list(r.cities), list(r.countries)].filter(Boolean).join("; ") : "";
      const what = titles.length ? titles.join(", then ") : "";
      const parts = [what, where].filter(Boolean);
      return parts.length ? parts.join(". ") : null;
    }
    case "workRoute": {
      const r = s.workRoute;
      if (!r?.text.trim()) return null;
      return r.changesOn ? `${r.text.trim()}; changes ${panelDate(r.changesOn)}` : r.text.trim();
    }
    case "availableFrom":
      return s.availableFrom ? panelDate(s.availableFrom.date) : null;
    case "employersMustOffer": {
      const r = s.employersMustOffer;
      if (!r) return null;
      return [
        SPONSORSHIP_LINE[r.sponsorship],
        r.payFloor ? `floor ${payFloorLine(r.payFloor)}` : null,
        r.languages.length ? `languages ${list(r.languages)}` : null,
      ]
        .filter(Boolean)
        .join("; ");
    }
    case "heardFromEmployers": {
      const r = s.heardFromEmployers;
      const said = r?.objections.filter((o) => o.trim()) ?? [];
      return said.length ? said.map((o) => `"${o.trim()}"`).join("; ") : null;
    }
    case "whereTheyAreNow":
      return s.whereTheyAreNow?.text.trim() || null;
    case "nextFromUs": {
      const r = s.nextFromUs;
      if (!r?.text.trim()) return null;
      const when = r.dueOn ? `, by ${panelDate(r.dueOn)}` : "";
      return `${r.text.trim()}${when}${r.doneAt ? " (done)" : ""}`;
    }
  }
}

/** How a row says where it came from and when, under its value. */
export function rowProvenance(s: Situation, key: SituationRowKey): string | null {
  const r = s[key] as RowStamp | undefined;
  if (!r) return null;
  const changed = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Madrid",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(r.at));
  return [`${SOURCE_WORD[r.source]}, ${changed}`, r.evidence?.trim()].filter(Boolean).join(" · ");
}

/** Every row, in the handoff's order, ready to render or to draft from. */
export function panel(s: Situation | null | undefined, titles: string[] = []) {
  const sit = s ?? {};
  return SITUATION_ROWS.map((key) => ({
    key,
    label: ROW_LABEL[key],
    asks: ROW_ASKS[key],
    line: rowLine(sit, key, titles),
    provenance: rowProvenance(sit, key),
  }));
}

/**
 * The rows a role cannot be judged without. A gate reading an absent row holds
 * the role rather than passing it, so the run and the coach see the same list.
 */
export const GATE_ROWS = ["goal", "workRoute", "availableFrom", "employersMustOffer"] as const;

/** Which gate rows are still empty, named as the panel names them. */
export function missingGates(s: Situation | null | undefined, titles: string[] = []): string[] {
  const sit = s ?? {};
  return GATE_ROWS.filter((k) => rowLine(sit, k, titles) === null).map((k) => ROW_LABEL[k]);
}

/**
 * The gates the evening run and the matched-role skill read, as values rather
 * than words. Absent stays absent: a missing floor is not a floor of zero.
 */
export function searchGates(s: Situation | null | undefined, titles: string[]) {
  const sit = s ?? {};
  return {
    titles,
    countries: sit.goal?.countries ?? null,
    cities: sit.goal?.cities ?? null,
    workRoute: sit.workRoute ? { text: sit.workRoute.text, changesOn: sit.workRoute.changesOn ?? null } : null,
    availableFrom: sit.availableFrom?.date ?? null,
    sponsorship: sit.employersMustOffer?.sponsorship ?? null,
    payFloor: sit.employersMustOffer?.payFloor ?? null,
    languages: sit.employersMustOffer?.languages ?? null,
    missing: missingGates(sit, titles),
  };
}
