/**
 * The words a job posting repeats, Teal's "Job Description & Keywords" panel.
 *
 * Deliberately plain: a count of the terms a posting uses most, with common
 * English and the filler every posting shares taken out. It is a reading aid
 * for the checklist step "note the words it repeats", **not a match score**,
 * and nothing here compares the posting with a CV. That comparison is
 * TASK-069, which needs CV extraction first.
 */

const STOP = new Set(
  (
    "a about above after again all also am an and any are as at be been being below between both but by can could did do does " +
    "doing down during each few for from further had has have having he her here hers him his how i if in into is it its itself " +
    "just me more most my no nor not now of off on once only or other our ours out over own same she should so some such than " +
    "that the their theirs them then there these they this those through to too under until up very was we were what when where " +
    "which while who whom why will with would you your yours etc e.g i.e via per within across including include includes " +
    // Words every posting uses, which say nothing about this one.
    "job role position candidate candidates team teams work working company opportunity opportunities apply application " +
    "applications experience years year strong ability able excellent good great new join looking ideal responsibilities " +
    "requirements required preferred plus skills skill knowledge understanding environment based support well within must " +
    "us we're you'll you're it's day days time full part please make help ensure using use used other others key one two three"
  ).split(" "),
);

export interface Keyword {
  term: string;
  count: number;
}

/** Top terms, single words and two-word phrases, most frequent first. */
export function keywordsOf(text: string, limit = 24): Keyword[] {
  const words = text
    .replace(/[’']/g, "'")
    .split(/[^A-Za-z0-9+#.'/-]+/)
    .map((w) => w.replace(/^[.'/-]+|[.'/-]+$/g, ""))
    .filter(Boolean);

  const counts = new Map<string, { term: string; count: number }>();
  const bump = (key: string, term: string) => {
    const hit = counts.get(key);
    if (hit) hit.count += 1;
    else counts.set(key, { term, count: 1 });
  };

  const keep = (w: string) => w.length > 1 && !STOP.has(w.toLowerCase()) && !/^\d+$/.test(w);
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (keep(w)) bump(w.toLowerCase(), w);
    const n = words[i + 1];
    if (n && keep(w) && keep(n)) bump(`${w} ${n}`.toLowerCase(), `${w} ${n}`);
  }

  // A phrase seen once is noise; a word seen once can still be the one tool
  // the posting names, so single words need one mention and phrases two.
  return [...counts.values()]
    .filter((k) => (k.term.includes(" ") ? k.count >= 2 : true))
    .sort((a, b) => b.count - a.count || a.term.localeCompare(b.term))
    .slice(0, limit);
}
