/**
 * Turning one dislike into one rule, `job-database-handoff.md` § 4.
 *
 * Pure, and deliberately narrow. The handoff says a `title_level` dislike
 * becomes "an `exclude_title_term` from the role's title words not in her
 * target titles" and a `pay` dislike raises the floor "to the posting's stated
 * top". Read at their widest, the first proposes a rule for every word that
 * differs, which is noise the coach then has to clear, and the second parses
 * whatever a posting happens to say about money.
 *
 * So both are narrowed to the case that carries the signal, and both propose
 * nothing when they cannot read one. A proposal that is wrong costs the coach
 * a click and costs the candidate a role; no proposal costs nothing.
 */

/**
 * The words that say what level a job is. A dislike on "wrong title or level"
 * is almost always about one of these, and a rule built from any other word in
 * a title would exclude roles she would take.
 */
const LEVEL_WORDS = [
  "intern",
  "graduate",
  "junior",
  "associate",
  "senior",
  "staff",
  "principal",
  "lead",
  "manager",
  "head",
  "director",
  "vp",
  "chief",
  "president",
];

const words = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

/**
 * The level word in this role's title that none of her target titles uses, or
 * null. Null is the common case and the right answer: it means the dislike was
 * about something this rule cannot name.
 */
export function levelTerm(roleTitle: string, targetTitles: string[]): string | null {
  const hers = new Set(targetTitles.flatMap(words));
  const found = words(roleTitle).filter((w) => LEVEL_WORDS.includes(w) && !hers.has(w));
  // The most senior-sounding one, by the order above, so "Senior Director"
  // proposes director rather than senior.
  return found.sort((a, b) => LEVEL_WORDS.indexOf(b) - LEVEL_WORDS.indexOf(a))[0] ?? null;
}

const CURRENCY: Record<string, string> = { "€": "EUR", "£": "GBP", "$": "USD", "฿": "THB" };

/**
 * The top figure a posting states, as a yearly amount, or null.
 *
 * Reads "EUR 70,000 to 85,000", "€70k-€85k", "85.000 EUR" and the single-figure
 * forms of each. A figure under 1,000 after scaling is treated as unreadable
 * rather than as a salary, and a monthly figure is multiplied by twelve only
 * when the text says so, because guessing the period is how a floor ends up
 * twelve times wrong.
 */
export function topSalary(text: string | null | undefined): { amount: number; currency: string } | null {
  if (!text) return null;
  const s = text.replace(/ /g, " ");
  const code = s.match(/\b(EUR|GBP|USD|CHF|SEK|NOK|DKK|PLN|THB)\b/i)?.[1]?.toUpperCase();
  const symbol = Object.keys(CURRENCY).find((c) => s.includes(c));
  const currency = code ?? (symbol ? CURRENCY[symbol] : null);
  if (!currency) return null;

  const figures: number[] = [];
  for (const m of s.matchAll(/(\d[\d.,\s]*)\s*(k\b)?/gi)) {
    const raw = m[1].replace(/[\s,]/g, "");
    // A European posting writes 85.000 and an English one 85.5; a dot with
    // exactly three digits after it is a thousands separator.
    const n = Number(/\.\d{3}$/.test(raw) ? raw.replace(/\./g, "") : raw);
    if (!Number.isFinite(n) || n <= 0) continue;
    figures.push(m[2] ? n * 1000 : n);
  }
  const yearly = /\b(per month|a month|monthly|\/ ?month|pcm)\b/i.test(s) ? 12 : 1;
  const top = Math.max(...figures.filter((n) => n >= 1000 || yearly === 12), 0) * yearly;
  return top >= 1000 ? { amount: Math.round(top), currency } : null;
}

/**
 * The languages a posting requires that the candidate does not hold. Case and
 * surrounding punctuation are ignored; nothing is inferred from a language
 * neither list names.
 */
export function missingLanguages(required: string[] | null | undefined, held: string[] | null | undefined): string[] {
  if (!required?.length) return [];
  const has = new Set((held ?? []).map((l) => l.trim().toLowerCase()));
  return required.map((l) => l.trim()).filter((l) => l && !has.has(l.toLowerCase()));
}
