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
