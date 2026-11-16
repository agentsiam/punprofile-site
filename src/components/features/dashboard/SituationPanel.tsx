"use client";

/**
 * The Situation panel, first on the Session tab,
 * `candidate-situation-handoff.md`. One glance answers where this person is
 * and what anything we send them has to respect.
 *
 * Every row is editable here, and every change is stamped with who made it and
 * when. The wording of a row is `src/lib/situation.ts`, shared with the
 * drafting paths, so the panel and a message about the same fact cannot read
 * differently.
 *
 * A row nobody has filled shows as not established, never as none: an empty
 * pay floor is not "any salary will do", and a search holds a role it cannot
 * judge rather than sending it.
 */

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { ROW_ASKS, type Situation, type SituationRowKey } from "@/lib/situation";
import Panel from "./Panel";

const INPUT = "field mt-1";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="field-label">
      {label}
      {children}
      {hint && <span className="field-support font-normal">{hint}</span>}
    </label>
  );
}

const SPONSORSHIP: [string, string][] = [
  ["required", "Sponsorship needed"],
  ["not_required", "No sponsorship needed"],
  ["required_until_available", "Needed now, not from their available date"],
];

/** A comma-separated box in, a trimmed list out. */
const splitList = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);
/** One per line, for the objections, because an objection has commas in it. */
const splitLines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);

export type Draft = Record<string, string>;

/** The boxes a row opens with, filled from what is stored. */
export function draftFor(key: SituationRowKey, s: Situation): Draft {
  switch (key) {
    case "goal":
      return { countries: (s.goal?.countries ?? []).join(", "), cities: (s.goal?.cities ?? []).join(", ") };
    case "seniority":
      return { text: s.seniority?.text ?? "" };
    case "workRoute":
      return { text: s.workRoute?.text ?? "", changesOn: s.workRoute?.changesOn ?? "" };
    case "availableFrom":
      return { date: s.availableFrom?.date ?? "" };
    case "employersMustOffer":
      return {
        sponsorship: s.employersMustOffer?.sponsorship ?? "required",
        amount: s.employersMustOffer?.payFloor ? String(s.employersMustOffer.payFloor.amount) : "",
        currency: s.employersMustOffer?.payFloor?.currency ?? "EUR",
        per: s.employersMustOffer?.payFloor?.per ?? "year",
        languages: (s.employersMustOffer?.languages ?? []).join(", "),
      };
    case "heardFromEmployers":
      return { objections: (s.heardFromEmployers?.objections ?? []).join("\n") };
    case "whereTheyAreNow":
      return { text: s.whereTheyAreNow?.text ?? "" };
    case "nextFromUs":
      return { text: s.nextFromUs?.text ?? "", dueOn: s.nextFromUs?.dueOn ?? "" };
  }
}

/**
 * The boxes for a row that something else proposed, so taking a proposal and
 * editing a row open the same editor on the same shape. It goes through
 * `draftFor` rather than reading the proposal's keys directly, so a row that
 * gains a field does not have to be handled twice.
 */
export function draftFromValue(value: { row: SituationRowKey } & Record<string, unknown>): Draft {
  const { row, ...rest } = value;
  return draftFor(row, { [row]: { ...rest, source: "coach", at: 0 } } as unknown as Situation);
}

/** The draft as the mutation takes it. */
export function rowValue(key: SituationRowKey, d: Draft) {
  switch (key) {
    case "goal":
      return { row: "goal" as const, countries: splitList(d.countries ?? ""), cities: splitList(d.cities ?? "") };
    case "seniority":
      return { row: "seniority" as const, text: d.text ?? "" };
    case "workRoute":
      return { row: "workRoute" as const, text: d.text ?? "", ...(d.changesOn ? { changesOn: d.changesOn } : {}) };
    case "availableFrom":
      return { row: "availableFrom" as const, date: d.date ?? "" };
    case "employersMustOffer":
      return {
        row: "employersMustOffer" as const,
        sponsorship: (d.sponsorship ?? "required") as "required" | "not_required" | "required_until_available",
        languages: splitList(d.languages ?? ""),
        ...(d.amount?.trim()
          ? { payFloor: { amount: Number(d.amount), currency: d.currency ?? "EUR", per: (d.per ?? "year") as "year" | "month" } }
          : {}),
      };
    case "heardFromEmployers":
      return { row: "heardFromEmployers" as const, objections: splitLines(d.objections ?? "") };
    case "whereTheyAreNow":
      return { row: "whereTheyAreNow" as const, text: d.text ?? "" };
    case "nextFromUs":
      return { row: "nextFromUs" as const, text: d.text ?? "", ...(d.dueOn ? { dueOn: d.dueOn } : {}) };
  }
}

export function RowEditor({ rowKey, draft, set }: { rowKey: SituationRowKey; draft: Draft; set: (k: string, v: string) => void }) {
  switch (rowKey) {
    case "goal":
      return (
        <div className="grid gap-4 medium:grid-cols-2">
          <Field label="Countries" hint="Comma separated. The one they are going to first, first.">
            <input className={INPUT} value={draft.countries ?? ""} onChange={(e) => set("countries", e.target.value)} />
          </Field>
          <Field label="Cities" hint="Comma separated. Leave empty where anywhere in the country will do.">
            <input className={INPUT} value={draft.cities ?? ""} onChange={(e) => set("cities", e.target.value)} />
          </Field>
        </div>
      );
    case "seniority":
      return (
        <Field label="The level they are aiming at" hint="Your words. It is quoted in drafts and holds no role back.">
          <input className={INPUT} value={draft.text ?? ""} onChange={(e) => set("text", e.target.value)} />
        </Field>
      );
    case "workRoute":
      return (
        <div className="grid gap-4 medium:grid-cols-[1fr_12rem]">
          <Field label="How they can legally work there">
            <textarea className={INPUT} rows={2} value={draft.text ?? ""} onChange={(e) => set("text", e.target.value)} />
          </Field>
          <Field label="The date it changes" hint="2027-03 or 2027-03-01. Empty where it does not change.">
            <input className={INPUT} value={draft.changesOn ?? ""} onChange={(e) => set("changesOn", e.target.value)} />
          </Field>
        </div>
      );
    case "availableFrom":
      return (
        <Field label="Earliest start date" hint="2027-04 where only the month is known.">
          <input className={`${INPUT} max-w-xs`} value={draft.date ?? ""} onChange={(e) => set("date", e.target.value)} />
        </Field>
      );
    case "employersMustOffer":
      return (
        <div className="grid gap-4 medium:grid-cols-2">
          <Field label="Sponsorship">
            <select className={INPUT} value={draft.sponsorship ?? "required"} onChange={(e) => set("sponsorship", e.target.value)}>
              {SPONSORSHIP.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Languages they hold" hint="Comma separated.">
            <input className={INPUT} value={draft.languages ?? ""} onChange={(e) => set("languages", e.target.value)} />
          </Field>
          <Field label="Pay floor" hint="Leave empty where no floor is agreed. Empty is not a floor of zero.">
            <input
              className={INPUT}
              type="number"
              min={0}
              value={draft.amount ?? ""}
              onChange={(e) => set("amount", e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Currency">
              <input className={INPUT} maxLength={3} value={draft.currency ?? ""} onChange={(e) => set("currency", e.target.value)} />
            </Field>
            <Field label="Per">
              <select className={INPUT} value={draft.per ?? "year"} onChange={(e) => set("per", e.target.value)}>
                <option value="year">a year</option>
                <option value="month">a month</option>
              </select>
            </Field>
          </div>
        </div>
      );
    case "heardFromEmployers":
      return (
        <Field label="Objections they have been given" hint="One per line, in the employer's own words.">
          <textarea className={INPUT} rows={3} value={draft.objections ?? ""} onChange={(e) => set("objections", e.target.value)} />
        </Field>
      );
    case "whereTheyAreNow":
      return (
        <Field label="One line on this week">
          <input className={INPUT} value={draft.text ?? ""} onChange={(e) => set("text", e.target.value)} />
        </Field>
      );
    case "nextFromUs":
      return (
        <div className="grid gap-4 medium:grid-cols-[1fr_12rem]">
          <Field label="The one thing we owe them next">
            <input className={INPUT} value={draft.text ?? ""} onChange={(e) => set("text", e.target.value)} />
          </Field>
          <Field label="By" hint="2026-11-17.">
            <input className={INPUT} value={draft.dueOn ?? ""} onChange={(e) => set("dueOn", e.target.value)} />
          </Field>
        </div>
      );
  }
}

export default function SituationPanel({ leadId }: { leadId: Id<"leads"> }) {
  const s = useQuery(api.situation.forLead, { leadId });
  const setRow = useMutation(api.situation.setRow);
  const clearRow = useMutation(api.situation.clearRow);
  const markDone = useMutation(api.situation.markNextDone);
  const [editing, setEditing] = useState<SituationRowKey | null>(null);
  const [draft, setDraft] = useState<Draft>({});
  const [evidence, setEvidence] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!s) return null;

  const open = (key: SituationRowKey) => {
    setEditing(key);
    setDraft(draftFor(key, s.situation));
    setEvidence(s.situation[key]?.evidence ?? "");
    setError(null);
  };

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      setEditing(null);
    } catch (e) {
      setError(e instanceof Error ? e.message.replace(/^.*ConvexError: /, "").split("\n")[0] : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const done = s.situation.nextFromUs?.doneAt !== undefined;

  return (
    <Panel
      title="Situation"
      aside={
        <span className="text-label-medium text-on-surface-variant">
          Every message, match reason and search is written from this panel
        </span>
      }
      testid="sx-situation"
    >
      {s.empty && (
        <p className="mb-3 text-body-medium text-error" data-testid="situation-empty">
          Nothing filled in yet. Until the goal, work route, start date and what employers must offer are here, the evening run holds
          roles rather than sending them, and no message can be drafted.
        </p>
      )}
      {!s.empty && s.missing.length > 0 && (
        <p className="mb-3 text-body-medium text-on-surface-variant" data-testid="situation-missing">
          Still to establish: {s.missing.join(", ")}. A search holds a role it cannot judge against these.
        </p>
      )}
      <dl className="grid gap-x-6 gap-y-3 text-body-medium medium:grid-cols-[14rem_1fr]">
        {s.rows.map((r) => (
          <div key={r.key} className="contents" data-testid={`situation-${r.key}`}>
            <dt className="text-on-surface-variant">{r.label}</dt>
            <dd className="text-on-surface">
              {editing === r.key ? (
                <div className="rounded-medium border border-outline-variant p-4">
                  <p className="text-body-small text-on-surface-variant">{ROW_ASKS[r.key]}</p>
                  <div className="mt-3">
                    <RowEditor rowKey={r.key} draft={draft} set={(k, v) => setDraft((d) => ({ ...d, [k]: v }))} />
                  </div>
                  <div className="mt-4 max-w-md">
                    <Field label="Where this came from" hint="A call date, a document. Optional, and worth it.">
                      <input className={INPUT} value={evidence} onChange={(e) => setEvidence(e.target.value)} />
                    </Field>
                  </div>
                  {error && (
                    <p role="alert" className="field-support-error mt-3">
                      {error}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      disabled={busy}
                      className="btn-filled h-9 px-4 text-label-large"
                      onClick={() =>
                        void run(() =>
                          setRow({ leadId, value: rowValue(r.key, draft), ...(evidence.trim() ? { evidence: evidence.trim() } : {}) }),
                        )
                      }
                    >
                      Save
                    </button>
                    <button type="button" className="text-body-medium text-ink-deep underline" onClick={() => setEditing(null)}>
                      Cancel
                    </button>
                    {r.line !== null && (
                      <button
                        type="button"
                        disabled={busy}
                        className="ml-auto text-body-medium text-ink-deep underline"
                        onClick={() => void run(() => clearRow({ leadId, row: r.key }))}
                      >
                        Empty this row
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <span className={r.line === null ? "text-on-surface-variant" : ""}>{r.line ?? "Not established"}</span>
                  <button type="button" className="text-body-small text-ink-deep underline" onClick={() => open(r.key)}>
                    {r.line === null ? "Fill in" : "Edit"}
                  </button>
                  {r.key === "nextFromUs" && r.line !== null && (
                    <button
                      type="button"
                      disabled={busy}
                      className="text-body-small text-ink-deep underline"
                      onClick={() => void run(() => markDone({ leadId, done: !done }))}
                    >
                      {done ? "Not done after all" : "Mark done"}
                    </button>
                  )}
                  {r.provenance && <span className="text-body-small text-on-surface-variant">{r.provenance}</span>}
                </div>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}
