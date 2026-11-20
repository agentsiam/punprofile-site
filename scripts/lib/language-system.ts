import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import yaml from "js-yaml";

export const LANGUAGE_ROOT = resolve(import.meta.dirname, "../..");
export const LANGUAGE_PATH = resolve(LANGUAGE_ROOT, "LANGUAGE-SYSTEM.md");
export const PROMPT_VERSION = "structural-calque-v1";

export type LanguageProvenance =
  | "paul-written"
  | "paul-approved"
  | "draft"
  | "paul-rejected";

export type NarrativeSlot =
  | "audience"
  | "symptom"
  | "misread"
  | "mechanism"
  | "artefact"
  | "limit"
  | "proof"
  | "ask"
  | "house.who"
  | "house.done"
  | "house.relevance"
  | "house.not"
  | "house.consequence"
  | "utility";

export interface LanguageEntry {
  id: string;
  source: string;
  path: string;
  render: string;
  narrative_slot: NarrativeSlot;
  en: string;
  th: string;
  proposal_th?: string;
  provenance: LanguageProvenance;
  date: string;
  term_bindings: string[];
  decision_note: string;
  review: {
    structural_calque: "pass" | "pending" | "fail";
    text_hash: string;
    prompt_version: string;
    basis: string;
  };
}

export interface LanguageSystem {
  source: string;
  entries: LanguageEntry[];
  byId: Map<string, LanguageEntry>;
}

const PROVENANCE = new Set<LanguageProvenance>([
  "paul-written",
  "paul-approved",
  "draft",
  "paul-rejected",
]);
const SLOTS = new Set<NarrativeSlot>([
  "audience", "symptom", "misread", "mechanism", "artefact", "limit", "proof", "ask",
  "house.who", "house.done", "house.relevance", "house.not", "house.consequence", "utility",
]);

export function textHash(en: string, th: string): string {
  return createHash("sha256").update(`${en}\0${th}`).digest("hex");
}

function assertString(value: unknown, field: string, id: string): asserts value is string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${id}: ${field} must be a non-empty string`);
  }
}

function validate(raw: unknown, index: number): LanguageEntry {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error(`copy record ${index + 1} is not a mapping`);
  }
  const entry = raw as Partial<LanguageEntry>;
  const id = typeof entry.id === "string" ? entry.id : `copy record ${index + 1}`;
  for (const field of ["id", "source", "path", "render", "narrative_slot", "en", "th", "provenance", "date", "decision_note"] as const) {
    assertString(entry[field], field, id);
  }
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(entry.date!)) {
    throw new Error(`${id}: date must be DD/MM/YYYY`);
  }
  if (!PROVENANCE.has(entry.provenance as LanguageProvenance)) {
    throw new Error(`${id}: unknown provenance ${entry.provenance}`);
  }
  if (!SLOTS.has(entry.narrative_slot as NarrativeSlot)) {
    throw new Error(`${id}: unknown narrative_slot ${entry.narrative_slot}`);
  }
  if (!Array.isArray(entry.term_bindings) || entry.term_bindings.some((v) => typeof v !== "string")) {
    throw new Error(`${id}: term_bindings must be a string array`);
  }
  if (!entry.review || typeof entry.review !== "object") {
    throw new Error(`${id}: review is required`);
  }
  assertString(entry.review.structural_calque, "review.structural_calque", id);
  assertString(entry.review.text_hash, "review.text_hash", id);
  assertString(entry.review.prompt_version, "review.prompt_version", id);
  assertString(entry.review.basis, "review.basis", id);
  if (!new Set(["pass", "pending", "fail"]).has(entry.review.structural_calque)) {
    throw new Error(`${id}: invalid structural-calque verdict ${entry.review.structural_calque}`);
  }
  return entry as LanguageEntry;
}

export function readLanguageSystem(path = LANGUAGE_PATH): LanguageSystem {
  const source = readFileSync(path, "utf8");
  const records = [...source.matchAll(/<!-- COPY-ENTRY -->\s*\n### `[^`]+`\s*\n\s*```yaml\s*\n([\s\S]*?)\n```/g)];
  if (!records.length) throw new Error(`${path}: no COPY-ENTRY blocks found`);
  const entries = records.map((match, index) => validate(yaml.load(match[1]), index));
  const byId = new Map<string, LanguageEntry>();
  for (const entry of entries) {
    if (byId.has(entry.id)) throw new Error(`${entry.id}: duplicate copy record`);
    byId.set(entry.id, entry);
  }
  return { source, entries, byId };
}

export interface RenderedSource {
  path: string;
  templatePath: string;
  content: string;
  ids: string[];
}

type Manifest = { version: number; sources: string[] };

export function renderLanguageSources(system = readLanguageSystem()): RenderedSource[] {
  const templateRoot = resolve(LANGUAGE_ROOT, "scripts/language-templates");
  const manifest = JSON.parse(readFileSync(resolve(templateRoot, "manifest.json"), "utf8")) as Manifest;
  if (manifest.version !== 1 || !Array.isArray(manifest.sources)) {
    throw new Error("scripts/language-templates/manifest.json: unsupported manifest");
  }
  const uses = new Map<string, { EN: number; TH: number }>();
  const rendered = manifest.sources.map((path) => {
    const templatePath = resolve(templateRoot, `${path}.tpl`);
    const ids: string[] = [];
    const content = readFileSync(templatePath, "utf8").replace(
      /%%LANG:([A-Za-z0-9_-]+):(EN|TH)%%/g,
      (_whole, token: string, locale: "EN" | "TH") => {
        const id = Buffer.from(token, "base64url").toString("utf8");
        const entry = system.byId.get(id);
        if (!entry) throw new Error(`${templatePath}: token refers to missing record ${id}`);
        ids.push(id);
        const fields = uses.get(id) ?? { EN: 0, TH: 0 };
        fields[locale]++;
        uses.set(id, fields);
        return JSON.stringify(locale === "EN" ? entry.en : entry.th);
      },
    );
    if (/%%LANG:/.test(content)) throw new Error(`${templatePath}: unresolved language token`);
    return { path: resolve(LANGUAGE_ROOT, path), templatePath, content, ids };
  });
  for (const entry of system.entries) {
    const fields = uses.get(entry.id);
    if (!fields || fields.EN !== 1 || fields.TH !== 1) {
      throw new Error(`${entry.id}: record must supply exactly one EN and one TH template token`);
    }
  }
  return rendered;
}

/** What a finished pass changes on a record. Anything absent is left alone. */
export interface RecordPatch {
  th?: string;
  provenance?: LanguageProvenance;
  /** Drop a spent `proposal_th`, so a cleared record cannot be misread later. */
  dropProposal?: boolean;
  review?: { structural_calque?: string; text_hash?: string; basis?: string };
}

/**
 * Rewrite one record in `LANGUAGE-SYSTEM.md`, in place, by id.
 *
 * Only the keys named are touched and only inside that record's own YAML block,
 * so a neighbouring record, a `decision_note` block scalar and everything else
 * in the file come through unchanged. The review keys are found after the
 * `review:` line rather than by indent, because a decision note's own lines are
 * indented too and a line of prose is not a field.
 */
export function patchRecord(doc: string, id: string, patch: RecordPatch): string {
  const heading = "### `" + id + "`";
  const at = doc.indexOf(heading);
  if (at < 0) throw new Error(`${id}: no record with that id`);
  const open = doc.indexOf("```yaml\n", at);
  const close = doc.indexOf("\n```", open);
  if (open < 0 || close < 0) throw new Error(`${id}: the record has no YAML block`);

  const lines = doc.slice(open + "```yaml\n".length, close).split("\n");
  // Looked up every time rather than held, because dropping a key shifts every
  // line below it and a stale index writes a second copy of a field instead of
  // replacing the one that is there.
  const reviewAt = () => lines.findIndex((l) => l === "review:");
  const set = (key: string, value: string, from: number, to: number) => {
    const prefix = from > 0 ? "  " : "";
    const i = lines.findIndex((l, n) => n >= from && n < to && l.startsWith(`${prefix}${key}: `));
    if (i >= 0) lines[i] = `${prefix}${key}: ${value}`;
    else lines.splice(to, 0, `${prefix}${key}: ${value}`);
  };
  const top = () => (reviewAt() < 0 ? lines.length : reviewAt());

  if (patch.th !== undefined) set("th", JSON.stringify(patch.th), 0, top());
  if (patch.provenance) set("provenance", patch.provenance, 0, top());
  if (patch.dropProposal) {
    const i = lines.findIndex((l) => l.startsWith("proposal_th: "));
    if (i >= 0) lines.splice(i, 1);
  }
  if (patch.review && reviewAt() >= 0) {
    const from = reviewAt() + 1;
    const after = lines.findIndex((l, n) => n >= from && l.length > 0 && !l.startsWith("  "));
    const to = after < 0 ? lines.length : after;
    for (const [key, value] of Object.entries(patch.review)) {
      if (value !== undefined) set(key, JSON.stringify(value), from, to);
    }
  }
  return doc.slice(0, open + "```yaml\n".length) + lines.join("\n") + doc.slice(close);
}
