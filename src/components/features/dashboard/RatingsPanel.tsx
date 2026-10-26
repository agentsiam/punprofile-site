"use client";

/**
 * The Fit Report interview, rated competency by competency. Added 26/10/2026.
 *
 * Coach-facing and English, like the rest of the dashboard. Each competency is
 * rated by the framework's own formula from `src/lib/ecra.ts`: tick the
 * indicators that were met, or pick the lookup level. The note is the one
 * thing here a candidate reads: it prints as "what to do next" beside that
 * competency in their Fit Report, so it is written in Thai, in the coach's own
 * voice. Below the area's market bar it is required, because a low score with
 * no next step is a verdict, not a report (Paul, 26/10/2026).
 *
 * Saving adds a row; it never edits one. The latest per competency counts.
 */

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { DIMENSIONS, GATES } from "@/lib/model";
import { ECRA, ecraScore } from "@/lib/ecra";

function Row({ leadId, itemKey, label, bar, latest }: {
  leadId: Id<"leads">;
  itemKey: string;
  label: string;
  bar: number;
  latest?: { value: number; score: number; note?: string };
}) {
  const rule = ECRA[itemKey];
  const rate = useMutation(api.ratings.rate);
  const [ticks, setTicks] = useState<boolean[]>(() =>
    rule.formula === "indicators" ? [0, 1, 2, 3].map((i) => i < (latest?.value ?? 0)) : [],
  );
  const [level, setLevel] = useState<number>(latest && rule.formula === "lookup" ? latest.value : -1);
  const [note, setNote] = useState(latest?.note ?? "");
  const [saving, setSaving] = useState(false);
  const value = rule.formula === "indicators" ? ticks.filter(Boolean).length : level;
  const chosen = rule.formula === "indicators" || level >= 0;
  const belowBar = chosen && ecraScore(rule, value) < bar;
  const ready = chosen && (!belowBar || note.trim().length > 0);

  return (
    <div className="border-b border-line py-4">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-body-md-strong">{label}</p>
        <p className="text-body-sm text-mute-strong">
          {latest ? `Saved ${latest.score}/5` : "Not rated"}
          {chosen ? ` · now ${ecraScore(rule, value)}/5 (bar ${bar})` : ""}
        </p>
      </div>
      {rule.formula === "indicators" ? (
        <ul className="mt-2 space-y-1">
          {rule.indicators.map((text, i) => (
            <li key={i}>
              <label className="flex items-start gap-2 text-body-sm">
                <input
                  type="checkbox"
                  checked={ticks[i] ?? false}
                  onChange={(e) => setTicks((t) => t.map((x, j) => (j === i ? e.target.checked : x)))}
                />
                <span>{text}</span>
              </label>
            </li>
          ))}
        </ul>
      ) : (
        <select
          className="mt-2 w-full rounded-md border border-line bg-canvas px-2 py-1.5 text-body-sm"
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
        >
          <option value={-1}>Pick a level ({rule.source})</option>
          {rule.levels.map((l, i) => (
            <option key={i} value={i}>{`${5 - i} · ${l}`}</option>
          ))}
        </select>
      )}
      <textarea
        className="mt-2 w-full rounded-md border border-line bg-canvas px-2 py-1.5 text-body-sm"
        rows={2}
        placeholder={
          belowBar
            ? "Required below the bar: what they should do next, in Thai. Printed in their Fit Report."
            : "Optional: what they should do next, in Thai. Printed in their Fit Report."
        }
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button
        type="button"
        disabled={!ready || saving}
        onClick={async () => {
          setSaving(true);
          try {
            await rate({ leadId, itemKey, value, note: note.trim() || undefined });
          } finally {
            setSaving(false);
          }
        }}
        className="mt-2 btn-outlined h-9 px-4 text-label-large"
      >
        {saving ? "Saving..." : "Save rating"}
      </button>
    </div>
  );
}

export default function RatingsPanel({ leadId }: { leadId: Id<"leads"> }) {
  const rows = useQuery(api.ratings.latestForLead, { leadId });
  const latest = useMemo(() => new Map((rows ?? []).map((r) => [r.itemKey, r])), [rows]);
  if (rows === undefined) return <p className="text-body-md text-mute-strong">Loading...</p>;
  const rated = rows.length;
  const total = Object.keys(ECRA).length;

  return (
    <div>
      <p className="text-body-md text-mute-strong">
        {rated} of {total} competencies rated. Unrated ones show as not rated in the Fit Report; a survey-measured one keeps its survey score until you rate it.
      </p>
      {DIMENSIONS.map((d) => (
        <details key={d.key} className="mt-4">
          <summary className="cursor-pointer text-heading-sm">
            {d.label} ({d.items.filter((i) => i.tier !== "proxy" && latest.has(i.key)).length}/
            {d.items.filter((i) => i.tier !== "proxy").length})
          </summary>
          {d.items
            .filter((i) => i.tier !== "proxy" && ECRA[i.key])
            .map((i) => (
              <Row
                key={i.key}
                leadId={leadId}
                itemKey={i.key}
                label={i.label}
                bar={GATES.find((g) => g.key === d.key)?.bar ?? 3}
                latest={latest.get(i.key)}
              />
            ))}
        </details>
      ))}
    </div>
  );
}
