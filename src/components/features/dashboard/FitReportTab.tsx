"use client";

/**
 * The Fit Report, in one tab, 02/11/2026.
 *
 * Before the call the Fit Report skill fills every competency the candidate's
 * own answers, CVs and documents can decide, as evidence, and leaves the
 * indicators it cannot decide open. The coach walks into the interview with
 * only those open ones in front of them, in the order the call reaches them,
 * then delivers from here: one button shares the report on the candidate's
 * dashboard, marks the deliverable delivered and deducts its tokens.
 *
 * A draft (indicators still open) is not a rating: the report and the
 * dashboard skip it until the coach settles it, because an indicator nobody
 * observed is not one the candidate failed.
 */

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Doc, Id } from "../../../../convex/_generated/dataModel";
import { DIMENSIONS, GATES } from "@/lib/model";
import { ECRA, ecraScore } from "@/lib/ecra";
import { INTERVIEW_ITEMS, INTERVIEW_PARTS, LATER_ITEMS } from "@/lib/fitInterview";
import { TOKEN_PRICE } from "@/lib/tokenPrices";

type Rating = Doc<"competencyRatings">;

const ITEMS = DIMENSIONS.flatMap((d) =>
  d.items
    .filter((i) => i.tier !== "proxy" && ECRA[i.key])
    .map((i) => ({ key: i.key, label: i.label, bar: GATES.find((g) => g.key === d.key)?.bar ?? 3 })),
);
const META = new Map(ITEMS.map((i) => [i.key, i]));
const isDraft = (r?: Rating) => !!r && (r.open?.length ?? 0) > 0;
const settled = (r?: Rating) => !!r && !isDraft(r);
const day = (ms: number) => {
  const d = new Date(ms);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

export default function FitReportTab({
  leadId,
  sharedAt,
  onOpenPdf,
}: {
  leadId: Id<"leads">;
  sharedAt: number | undefined;
  onOpenPdf: (loc: "en" | "th") => Promise<void>;
}) {
  const rows = useQuery(api.ratings.latestForLead, { leadId });
  const deliver = useMutation(api.workspace.deliverFitReport);
  const latest = useMemo(() => new Map((rows ?? []).map((r) => [r.itemKey, r])), [rows]);
  const [busy, setBusy] = useState<"pdf" | "deliver" | null>(null);
  const [error, setError] = useState<string | null>(null);
  if (rows === undefined) return <p className="text-body-md text-mute-strong">Loading...</p>;

  const toAsk = INTERVIEW_ITEMS.filter((k) => !settled(latest.get(k)));
  const fromEvidence = ITEMS.filter((i) => settled(latest.get(i.key)) && latest.get(i.key)?.source === "evidence");
  const byCoach = ITEMS.filter((i) => settled(latest.get(i.key)) && latest.get(i.key)?.source !== "evidence");
  const later = LATER_ITEMS.filter((k) => !settled(latest.get(k)) && META.has(k));
  const rest = ITEMS.filter(
    (i) => !settled(latest.get(i.key)) && !INTERVIEW_ITEMS.includes(i.key) && !LATER_ITEMS.includes(i.key),
  );

  return (
    <div className="space-y-8">
      {/* Where the report stands, and the one way it goes out. */}
      <section className="rounded-extra-large bg-canvas-soft p-6">
        <div className="grid gap-3 medium:grid-cols-3">
          <Stat n={fromEvidence.length} label="filled before the call, from their answers and documents" tint="bg-cyan-pale text-on-cyan-pale" />
          <Stat n={toAsk.length} label={`of the ${INTERVIEW_ITEMS.length} interview areas still to settle in the call`} tint="bg-yellow-pale text-on-yellow-pale" />
          <Stat n={byCoach.length} label="confirmed by you" tint="bg-primary-pale text-on-primary-pale" />
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={busy !== null}
            onClick={async () => {
              setBusy("pdf");
              try {
                await onOpenPdf("en");
              } finally {
                setBusy(null);
              }
            }}
            className="btn-outlined h-11 px-5 text-label-large"
          >
            {busy === "pdf" ? "Building..." : "Preview the Fit Report"}
          </button>
          <button
            type="button"
            disabled={busy !== null || toAsk.length > 0 || sharedAt !== undefined}
            onClick={async () => {
              if (!confirm(`Deliver the Fit Report? It goes on their dashboard, the Fit Report is marked delivered and ${TOKEN_PRICE.fitReport} tokens are deducted.`)) return;
              setBusy("deliver");
              setError(null);
              try {
                await deliver({ leadId });
              } catch (e) {
                setError(e instanceof Error ? e.message.replace(/^.*ConvexError:\s*/, "") : "Could not deliver.");
              } finally {
                setBusy(null);
              }
            }}
            className="h-11 btn-filled px-6 text-label-large"
          >
            {busy === "deliver" ? "Delivering..." : "Deliver Fit Report"}
          </button>
          <span className="text-body-md text-mute-strong">
            {sharedAt !== undefined
              ? `On their dashboard since ${day(sharedAt)}.`
              : toAsk.length > 0
                ? "Delivers once every interview area is settled."
                : `Shares it on their dashboard, marks it delivered, deducts ${TOKEN_PRICE.fitReport} tokens.`}
          </span>
          <button type="button" className="text-body-md text-ink-deep underline" onClick={() => void onOpenPdf("th")}>
            Thai version
          </button>
        </div>
        {error && <p className="mt-2 text-body-md text-error">{error}</p>}
      </section>

      {/* What the call has to settle, in the order the call reaches it. */}
      <section>
        <h2 className="text-title-large">Ask in the interview</h2>
        {toAsk.length === 0 ? (
          <p className="mt-2 text-body-large text-mute-strong">Nothing left to ask. Every interview area is settled.</p>
        ) : (
          INTERVIEW_PARTS.map((part) => {
            const items = part.items.filter((i) => toAsk.includes(i.key));
            if (!items.length) return null;
            return (
              <div key={part.id} className="mt-5">
                <h3 className="text-heading-sm">{part.title}</h3>
                {part.note && <p className="text-body-md text-mute-strong">{part.note}</p>}
                <div className="mt-2 space-y-3">
                  {items.map((i) => (
                    <ItemCard key={i.key} leadId={leadId} itemKey={i.key} ask={i.ask} latest={latest.get(i.key)} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </section>

      <Group title={`Filled before the call (${fromEvidence.length})`} hint="From their own answers and documents. Change any you disagree with.">
        {fromEvidence.map((i) => (
          <ItemCard key={i.key} leadId={leadId} itemKey={i.key} latest={latest.get(i.key)} compact />
        ))}
      </Group>
      <Group title={`Confirmed by you (${byCoach.length})`}>
        {byCoach.map((i) => (
          <ItemCard key={i.key} leadId={leadId} itemKey={i.key} latest={latest.get(i.key)} compact />
        ))}
      </Group>
      <Group title={`For the one-hour session (${later.length})`} hint="Reached by working together, not in 30 minutes.">
        {later.map((k) => (
          <ItemCard key={k} leadId={leadId} itemKey={k} latest={latest.get(k)} compact />
        ))}
      </Group>
      <Group title={`Not measured yet (${rest.length})`} hint="Coach research or later sessions. They show as not measured in the report.">
        {rest.map((i) => (
          <ItemCard key={i.key} leadId={leadId} itemKey={i.key} latest={latest.get(i.key)} compact />
        ))}
      </Group>
    </div>
  );
}

function Stat({ n, label, tint }: { n: number; label: string; tint: string }) {
  return (
    <div className={`rounded-large px-4 py-3 ${tint}`}>
      <p className="text-headline-small">{n}</p>
      <p className="text-body-md">{label}</p>
    </div>
  );
}

function Group({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode[] }) {
  if (!children.length) return null;
  return (
    <details className="rounded-large border border-line p-4">
      <summary className="cursor-pointer text-heading-sm">{title}</summary>
      {hint && <p className="mt-1 text-body-md text-mute-strong">{hint}</p>}
      <div className="mt-3 space-y-3">{children}</div>
    </details>
  );
}

/**
 * One competency. Indicators the evidence already decided are ticked and
 * marked as such; the open ones are what the coach listens for. Saving always
 * writes a coach row with nothing left open.
 */
function ItemCard({
  leadId,
  itemKey,
  latest,
  ask,
  compact = false,
}: {
  leadId: Id<"leads">;
  itemKey: string;
  latest?: Rating;
  ask?: string;
  compact?: boolean;
}) {
  const meta = META.get(itemKey)!;
  const rule = ECRA[itemKey];
  const rate = useMutation(api.ratings.rate);
  const [open, setOpen] = useState(!compact);
  const fromEvidence = new Set(latest?.source === "evidence" ? (latest.ticks ?? []) : []);
  const openSet = new Set(latest?.open ?? []);
  const [ticks, setTicks] = useState<boolean[]>(() =>
    [0, 1, 2, 3].map((i) => (latest?.ticks ? latest.ticks.includes(i) : i < (latest?.value ?? 0))),
  );
  const [level, setLevel] = useState<number>(latest && rule.formula === "lookup" ? latest.value : -1);
  const [note, setNote] = useState(latest?.note ?? "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const value = rule.formula === "indicators" ? ticks.filter(Boolean).length : level;
  const chosen = rule.formula === "indicators" || level >= 0;
  const score = chosen ? ecraScore(rule, value) : null;
  const belowBar = score !== null && score < meta.bar;
  const ready = chosen && (!belowBar || note.trim().length > 0);

  const status = !latest
    ? { text: "Not rated", cls: "bg-canvas-soft text-ink" }
    : isDraft(latest)
      ? { text: `${openSet.size} to observe`, cls: "bg-yellow-pale text-on-yellow-pale" }
      : latest.source === "evidence"
        ? { text: `From evidence · ${latest.score}/5`, cls: "bg-cyan-pale text-on-cyan-pale" }
        : { text: `Confirmed · ${latest.score}/5`, cls: "bg-primary-pale text-on-primary-pale" };

  return (
    <div className="rounded-large border border-line bg-canvas p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <button type="button" className="text-left text-body-md-strong" onClick={() => setOpen((o) => !o)}>
          {meta.label}
        </button>
        <span className={`rounded-full px-3 py-0.5 text-label-medium ${status.cls}`}>{status.text}</span>
      </div>
      {ask && <p className="mt-1 text-body-md text-ink-deep">Ask: {ask}</p>}
      {latest?.evidence && <p className="mt-1 whitespace-pre-line text-body-sm text-mute-strong">{latest.evidence}</p>}
      {open && (
        <>
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
                    <span>
                      {text}
                      {fromEvidence.has(i) && <span className="ml-2 text-mute-strong">(evidence)</span>}
                      {openSet.has(i) && <span className="ml-2 font-semibold text-warning-deep">listen for this</span>}
                    </span>
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
                ? "Required below the bar: what they should do next, in English. Printed in their Fit Report."
                : "Optional: what they should do next, in English. Printed in their Fit Report."
            }
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              disabled={!ready || saving}
              onClick={async () => {
                setSaving(true);
                setErr(null);
                try {
                  await rate({
                    leadId,
                    itemKey,
                    value,
                    note: note.trim() || undefined,
                    source: "coach",
                    ...(latest?.evidence ? { evidence: latest.evidence } : {}),
                    ...(rule.formula === "indicators"
                      ? { ticks: ticks.flatMap((t, i) => (t ? [i] : [])), open: [] }
                      : {}),
                  });
                } catch (e) {
                  setErr(e instanceof Error ? e.message.replace(/^.*ConvexError:\s*/, "") : "Could not save.");
                } finally {
                  setSaving(false);
                }
              }}
              className="btn-outlined h-9 px-4 text-label-large"
            >
              {saving ? "Saving..." : latest?.source === "evidence" && !isDraft(latest) ? "Confirm" : "Save rating"}
            </button>
            {score !== null && (
              <span className="text-body-sm text-mute-strong">
                {score}/5 · market bar {meta.bar}
              </span>
            )}
            {err && <span className="text-body-sm text-error">{err}</span>}
          </div>
        </>
      )}
    </div>
  );
}
