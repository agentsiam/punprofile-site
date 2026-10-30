"use client";

/**
 * The paying candidate's own app, shaped on Teal's job tracker because that is
 * the tool a job seeker already knows (Paul, 30/10/2026: "why can't the
 * dashboard look like the tracker in Teal"). Structure taken from Teal, read
 * off the live app the same day; the words and the colours are ours.
 *
 * - **Overview** is Teal's Home: tokens, what is being delivered, the search
 *   pipeline as bars, and the dates coming up.
 * - **Job tracker** is Teal's Job Tracker: the chevron stage bar with a count
 *   per stage that filters the list, a search box, and a table with the same
 *   columns (title, company, salary, location, status, saved, closes, applied,
 *   follow up, interest). A phone gets cards instead of the table.
 * - **A job** opens Teal's detail view: the list down the left, the stage bar
 *   as a stepper that moves the job, and tabs for job info, notes, the CV sent,
 *   and what the coach said about it.
 * - **CV** and **Your coach** are ours: the shared CV versions with what
 *   changed, and the deliverables and shared notes.
 *
 * `readOnly` is the coach's preview from the Candidate 360: the same screen
 * with every control inert, so what a coach checks is what the candidate sees.
 *
 * Every string comes from `src/lib/content/portal.ts` (R49).
 */

import { useMemo, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import type { PortalView } from "../../../../convex/portal";
import { useCopy } from "@/components/LocaleProvider";
import type { Copy } from "@/lib/content/copy";
import * as C from "@/lib/content/portal";

type Job = PortalView["jobs"][number];
const PIPELINE = ["interested", "applied", "screening", "interviewing", "offer", "accepted"] as const;
const CLOSED = ["rejected", "withdrawn"] as const;
type Status = (typeof PIPELINE)[number] | (typeof CLOSED)[number];
type Tab = "overview" | "tracker" | "cv" | "coach";

const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));
const toMs = (iso: string) => (iso ? Date.parse(`${iso}T12:00:00Z`) : null);
const toIso = (ms: number | null) => (ms === null ? "" : new Date(ms).toISOString().slice(0, 10));

function useFormat() {
  const { pick, locale } = useCopy();
  const date = (ms: number) =>
    new Date(ms).toLocaleDateString(locale === "th" ? "th-TH" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });
  const t = (c: Copy, vars: Record<string, string | number> = {}) => fill(pick(c), vars);
  return { pick, locale, date, t };
}

/* ================================================================== app */

export default function CandidateApp({
  data,
  readOnly = false,
  onSignOut,
}: {
  data: PortalView;
  readOnly?: boolean;
  onSignOut?: () => void;
}) {
  const { pick, t } = useFormat();
  const [tab, setTab] = useState<Tab>("tracker");
  const [openJob, setOpenJob] = useState<Id<"applications"> | null>(null);

  const tabs: [Tab, Copy][] = [
    ["overview", C.TAB_OVERVIEW],
    ["tracker", C.TAB_TRACKER],
    ["cv", C.TAB_CV],
    ["coach", C.TAB_COACH],
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 medium:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-headline-sm text-ink">
            {data.firstName ? t(C.PORTAL_GREETING, { name: data.firstName }) : pick(C.PORTAL_GREETING_NONAME)}
          </h1>
          <p className="text-body-medium text-on-surface-variant">{pick(C.PORTAL_INTRO_SHORT)}</p>
        </div>
        {onSignOut && (
          <button type="button" className="text-body-medium text-ink-deep underline" onClick={onSignOut}>
            {pick(C.SIGN_OUT)}
          </button>
        )}
      </div>

      {/* Tabs. Teal puts these in a left rail; on a phone a rail costs a
          quarter of the screen, so they sit on top for everyone. */}
      <nav className="mt-5 flex gap-1 overflow-x-auto border-b border-line" role="tablist">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => {
              setTab(id);
              setOpenJob(null);
            }}
            className={
              "-mb-px shrink-0 border-b-2 px-4 py-2.5 text-label-large " +
              (tab === id ? "border-ink-deep text-ink" : "border-transparent text-on-surface-variant")
            }
          >
            {pick(label)}
            {id === "tracker" && data.jobs.length > 0 ? ` ${data.jobs.length}` : ""}
          </button>
        ))}
      </nav>

      <div className="mt-6">
        {tab === "overview" && (
          <Overview
            data={data}
            onOpenJob={(id) => {
              setTab("tracker");
              setOpenJob(id);
            }}
            onTab={setTab}
          />
        )}
        {tab === "tracker" &&
          (openJob && data.jobs.some((j) => j._id === openJob) ? (
            <JobDetail data={data} jobId={openJob} onOpen={setOpenJob} readOnly={readOnly} />
          ) : (
            <Tracker data={data} onOpen={setOpenJob} readOnly={readOnly} />
          ))}
        {tab === "cv" && <CvTab data={data} />}
        {tab === "coach" && <CoachTab data={data} />}
      </div>
    </div>
  );
}

/* ============================================================ overview */

function Overview({
  data,
  onOpenJob,
  onTab,
}: {
  data: PortalView;
  onOpenJob: (id: Id<"applications">) => void;
  onTab: (t: Tab) => void;
}) {
  const { pick, t, date } = useFormat();
  const delivered = data.deliverables.filter((d) => d.status === "delivered").length;
  const counts = countBy(data.jobs);
  const max = Math.max(1, ...PIPELINE.map((s) => counts[s] ?? 0));

  // Teal's "Dates" card: everything with a date in the next six weeks, plus
  // anything already overdue, soonest first.
  // Read once per mount: the overview is not a clock, and a render that reads
  // the time is not pure.
  const [now] = useState(() => Date.now());
  const horizon = now + 42 * 24 * 60 * 60 * 1000;
  const dated: { at: number; label: Copy; what: string; jobId?: Id<"applications"> }[] = [];
  for (const j of data.jobs) {
    if (CLOSED.includes(j.status as (typeof CLOSED)[number]) || j.status === "accepted") continue;
    if (j.followUpAt) dated.push({ at: j.followUpAt, label: C.DATE_FOLLOW, what: `${j.roleTitle}, ${j.employer}`, jobId: j._id });
    if (j.deadlineAt && j.status === "interested")
      dated.push({ at: j.deadlineAt, label: C.DATE_CLOSES, what: `${j.roleTitle}, ${j.employer}`, jobId: j._id });
  }
  for (const d of data.deliverables) {
    if (d.dueAt && d.status !== "delivered")
      dated.push({ at: d.dueAt, label: C.DATE_DUE, what: d.title ?? pick(C.WORK_KIND[d.kind] ?? { en: d.kind, th: d.kind }) });
  }
  const upcoming = dated.filter((x) => x.at <= horizon).sort((a, b) => a.at - b.at).slice(0, 8);

  return (
    <div className="grid gap-5 large:grid-cols-3">
      <div className="space-y-5 large:col-span-2">
        <div className="grid gap-4 medium:grid-cols-3">
          {data.tokens.bought > 0 && (
            <Stat label={pick(C.TOKENS_HEADING)} big={String(data.tokens.balance)} small={t(C.TOKENS_OF, { n: data.tokens.bought })}>
              {t(C.TOKENS_MATCHED, { n: data.tokens.matchedSent })}
            </Stat>
          )}
          {data.deliverables.length > 0 && (
            <Stat label={pick(C.WORK_HEADING)} big={String(delivered)} small={`/ ${data.deliverables.length}`}>
              <Bar value={delivered} max={data.deliverables.length} />
            </Stat>
          )}
          <Stat label={pick(C.JOBS_HEADING)} big={String(data.jobs.length)} small="">
            {PIPELINE.filter((s) => s !== "interested" && (counts[s] ?? 0) > 0)
              .map((s) => `${pick(C.JOBS_STATUS[s])} ${counts[s]}`)
              .join(" · ")}
          </Stat>
        </div>

        {/* Teal's "Job Search Pipeline": one bar per stage. */}
        <section className="card-outlined px-6 py-5">
          <h2 className="text-heading-sm">{pick(C.PIPELINE_HEADING)}</h2>
          <ul className="mt-4 space-y-3">
            {PIPELINE.map((s) => (
              <li key={s} className="grid grid-cols-[7rem_1fr_2rem] items-center gap-3">
                <span className="text-body-medium text-on-surface-variant">{pick(C.JOBS_STATUS[s])}</span>
                <span className="h-3 overflow-hidden rounded-full bg-canvas-soft">
                  <span
                    className="block h-full rounded-full bg-ink-deep"
                    style={{ width: `${((counts[s] ?? 0) / max) * 100}%` }}
                  />
                </span>
                <span className="text-right text-body-medium text-ink">{counts[s] ?? 0}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card-outlined px-6 py-5">
          <h2 className="text-heading-sm">{pick(C.WORK_HEADING)}</h2>
          <Deliverables data={data} />
        </section>
      </div>

      <div className="space-y-5">
        <section className="card-outlined px-6 py-5">
          <h2 className="text-heading-sm">{pick(C.DATES_HEADING)}</h2>
          {upcoming.length === 0 ? (
            <p className="mt-3 text-body-medium text-on-surface-variant">{pick(C.DATES_EMPTY)}</p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {upcoming.map((x, i) => (
                <li key={i} className="flex items-baseline gap-3 py-2.5">
                  <span className={`w-20 shrink-0 text-label-large ${x.at < now ? "text-error" : "text-ink"}`}>
                    {date(x.at)}
                  </span>
                  <span className="min-w-0 text-body-medium">
                    <span className="text-on-surface-variant">{pick(x.label)} · </span>
                    {x.jobId ? (
                      <button type="button" className="text-left text-ink underline-offset-2 hover:underline" onClick={() => onOpenJob(x.jobId!)}>
                        {x.what}
                      </button>
                    ) : (
                      <span className="text-ink">{x.what}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {data.notes[0] && (
          <section className="card-outlined px-6 py-5">
            <h2 className="text-heading-sm">{pick(C.LATEST_NOTE)}</h2>
            <p className="mt-1 text-body-medium text-on-surface-variant">{date(data.notes[0].at)}</p>
            <p className="mt-2 whitespace-pre-line text-body-large text-ink">{data.notes[0].body}</p>
            {data.notes.length > 1 && (
              <button type="button" className="mt-3 text-body-medium text-ink-deep underline" onClick={() => onTab("coach")}>
                {pick(C.SEE_ALL)}
              </button>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function Stat({ label, big, small, children }: { label: string; big: string; small: string; children?: React.ReactNode }) {
  return (
    <div className="card-outlined px-5 py-4">
      <p className="text-label-large text-on-surface-variant">{label}</p>
      <p className="mt-1 text-display-sm text-ink">
        {big} <span className="text-body-large text-on-surface-variant">{small}</span>
      </p>
      <div className="mt-2 text-body-medium text-on-surface-variant">{children}</div>
    </div>
  );
}

function Bar({ value, max }: { value: number; max: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-canvas-soft" aria-hidden>
      <div className="h-full rounded-full bg-primary" style={{ width: `${max ? (value / max) * 100 : 0}%` }} />
    </div>
  );
}

function countBy(jobs: Job[]) {
  const c: Record<string, number> = {};
  for (const j of jobs) c[j.status] = (c[j.status] ?? 0) + 1;
  return c;
}

/* ======================================================= stage chevrons */

/**
 * Teal's stage bar. Each stage is a chevron with its count over its name.
 * As a filter on the list, and as the stepper on one job, where the stages up
 * to the job's own are filled.
 */
function StageBar({
  counts,
  active,
  reached,
  onPick,
  disabled,
}: {
  counts?: Record<string, number>;
  active?: Status | null;
  /** Stepper mode: stages up to and including this one are filled. */
  reached?: Status | null;
  onPick?: (s: Status) => void;
  disabled?: boolean;
}) {
  const { pick } = useFormat();
  const reachedAt = reached ? PIPELINE.indexOf(reached as (typeof PIPELINE)[number]) : -1;
  return (
    <div className="flex overflow-x-auto pb-1">
      {PIPELINE.map((s, i) => {
        const filled = reached !== undefined ? i <= reachedAt : active === s;
        const notch = 12;
        const clip =
          i === 0
            ? `polygon(0 0, calc(100% - ${notch}px) 0, 100% 50%, calc(100% - ${notch}px) 100%, 0 100%)`
            : `polygon(0 0, calc(100% - ${notch}px) 0, 100% 50%, calc(100% - ${notch}px) 100%, 0 100%, ${notch}px 50%)`;
        return (
          <button
            key={s}
            type="button"
            disabled={disabled || !onPick}
            onClick={() => onPick?.(s)}
            aria-pressed={filled}
            style={{ clipPath: clip, marginLeft: i === 0 ? 0 : -6 }}
            className={
              "min-w-[7.5rem] flex-1 px-5 py-2.5 text-center transition-none " +
              (filled ? "bg-primary text-on-primary" : "bg-canvas-soft text-ink") +
              (onPick && !disabled ? " cursor-pointer" : " cursor-default")
            }
          >
            {counts && <span className="block text-title-medium leading-tight">{counts[s] ?? 0}</span>}
            <span className="block text-label-medium">{pick(C.JOBS_STATUS[s])}</span>
          </button>
        );
      })}
    </div>
  );
}

function Stars({ value, onChange, disabled }: { value: number | null; onChange?: (n: number | null) => void; disabled?: boolean }) {
  const { pick } = useFormat();
  return (
    <span className="inline-flex" role="group" aria-label={pick(C.COL_EXCITEMENT)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled || !onChange}
          aria-label={`${n}`}
          onClick={(e) => {
            e.stopPropagation();
            onChange?.(value === n ? null : n);
          }}
          className={`px-0.5 text-title-medium leading-none ${value !== null && n <= value ? "text-ink-deep" : "text-mute-strong opacity-40"}`}
        >
          ★
        </button>
      ))}
    </span>
  );
}

/* ============================================================== tracker */

function Tracker({ data, onOpen, readOnly }: { data: PortalView; onOpen: (id: Id<"applications">) => void; readOnly: boolean }) {
  const { pick } = useFormat();
  const [filter, setFilter] = useState<Status | null>(null);
  const [showClosed, setShowClosed] = useState(false);
  const [q, setQ] = useState("");
  const [adding, setAdding] = useState(false);
  const counts = countBy(data.jobs);
  const closedCount = CLOSED.reduce((n, s) => n + (counts[s] ?? 0), 0);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return data.jobs.filter((j) => {
      const closed = CLOSED.includes(j.status as (typeof CLOSED)[number]);
      if (filter) {
        if (j.status !== filter) return false;
      } else if (closed !== showClosed) return false;
      if (!needle) return true;
      return `${j.roleTitle} ${j.employer} ${j.country} ${j.location ?? ""}`.toLowerCase().includes(needle);
    });
  }, [data.jobs, filter, showClosed, q]);

  return (
    <div>
      <StageBar counts={counts} active={filter} onPick={(s) => setFilter(filter === s ? null : s)} />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          type="search"
          className="field field-dense h-11 w-full medium:max-w-xs"
          placeholder={pick(C.JOBS_SEARCH)}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {closedCount > 0 && (
          <button
            type="button"
            onClick={() => {
              setFilter(null);
              setShowClosed((c) => !c);
            }}
            className={`rounded-sm border px-3 py-1.5 text-label-large ${showClosed && !filter ? "border-ink-deep text-ink" : "border-line text-on-surface-variant"}`}
          >
            {pick(C.JOBS_CLOSED)} {closedCount}
          </button>
        )}
        <span className="hidden flex-1 medium:block" />
        {!readOnly && !adding && (
          <button type="button" className="h-11 btn-filled px-5 text-label-large" onClick={() => setAdding(true)}>
            + {pick(C.ADD_JOB)}
          </button>
        )}
      </div>

      {adding && <AddJob onDone={() => setAdding(false)} />}

      {data.jobs.length === 0 ? (
        <p className="mt-8 max-w-xl text-body-large text-on-surface-variant">{pick(C.JOBS_EMPTY)}</p>
      ) : shown.length === 0 ? (
        <p className="mt-8 text-body-large text-on-surface-variant">{pick(C.JOBS_NO_MATCH)}</p>
      ) : (
        <>
          <JobTable jobs={shown} onOpen={onOpen} readOnly={readOnly} />
          <ul className="mt-4 space-y-3 expanded:hidden">
            {shown.map((j) => (
              <JobCard key={j._id} job={j} onOpen={onOpen} readOnly={readOnly} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function useJobActions(readOnly: boolean) {
  const setStatus = useMutation(api.portal.setJobStatus);
  const update = useMutation(api.portal.updateJob);
  const [error, setError] = useState(false);
  const run = (fn: () => Promise<unknown>) => {
    if (readOnly) return;
    setError(false);
    fn().catch(() => setError(true));
  };
  return {
    error,
    status: (id: Id<"applications">, status: Status) => run(() => setStatus({ applicationId: id, status })),
    update: (id: Id<"applications">, patch: Omit<Parameters<typeof update>[0], "applicationId">) =>
      run(() => update({ applicationId: id, ...patch })),
  };
}

function StatusSelect({ job, readOnly, onChange }: { job: Job; readOnly: boolean; onChange: (s: Status) => void }) {
  const { pick } = useFormat();
  return (
    <select
      aria-label={pick(C.COL_STATUS)}
      className="field field-dense w-auto"
      value={job.status}
      disabled={readOnly}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => onChange(e.target.value as Status)}
    >
      {[...PIPELINE, ...CLOSED].map((s) => (
        <option key={s} value={s}>
          {pick(C.JOBS_STATUS[s])}
        </option>
      ))}
    </select>
  );
}

function FromUs() {
  const { pick } = useFormat();
  return (
    <span className="inline-block whitespace-nowrap rounded-sm bg-primary-pale px-1.5 py-0.5 text-label-small text-on-primary-pale">
      {pick(C.JOBS_FROM_US)}
    </span>
  );
}

function JobTable({ jobs, onOpen, readOnly }: { jobs: Job[]; onOpen: (id: Id<"applications">) => void; readOnly: boolean }) {
  const { pick, date } = useFormat();
  const act = useJobActions(readOnly);
  const cols: Copy[] = [C.COL_ROLE, C.COL_COMPANY, C.COL_SALARY, C.COL_LOCATION, C.COL_STATUS, C.COL_SAVED, C.COL_DEADLINE, C.COL_APPLIED, C.COL_FOLLOW, C.COL_EXCITEMENT];
  return (
    <div className="mt-4 hidden overflow-x-auto rounded-xl border border-line expanded:block">
      <table className="w-full min-w-[56rem] text-left text-body-medium">
        <thead className="bg-canvas-soft text-label-large text-on-surface-variant">
          <tr>
            {cols.map((c, i) => (
              <th key={i} className="whitespace-nowrap px-3 py-2.5 font-normal">
                {pick(c)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j._id} className="cursor-pointer border-t border-line align-middle hover:bg-canvas-soft" onClick={() => onOpen(j._id)}>
              <td className="min-w-[14rem] max-w-[20rem] px-3 py-2.5">
                {j.fromUs && <FromUs />}
                <span className="block text-ink">{j.roleTitle}</span>
              </td>
              <td className="px-3 py-2.5 text-ink">{j.employer}</td>
              <td className="px-3 py-2.5 text-on-surface-variant">{j.salary ?? ""}</td>
              <td className="px-3 py-2.5 text-on-surface-variant">
                {j.location ? `${j.location}, ` : ""}
                {j.country}
              </td>
              <td className="px-3 py-2.5">
                <StatusSelect job={j} readOnly={readOnly} onChange={(s) => act.status(j._id, s)} />
              </td>
              <td className="whitespace-nowrap px-3 py-2.5 text-on-surface-variant">{date(j.savedAt)}</td>
              <td className="whitespace-nowrap px-3 py-2.5 text-on-surface-variant">{j.deadlineAt ? date(j.deadlineAt) : "–"}</td>
              <td className="whitespace-nowrap px-3 py-2.5 text-on-surface-variant">{j.appliedAt ? date(j.appliedAt) : "–"}</td>
              <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                <input
                  type="date"
                  aria-label={pick(C.COL_FOLLOW)}
                  className="field field-dense w-[8.75rem]"
                  disabled={readOnly}
                  value={toIso(j.followUpAt)}
                  onChange={(e) => act.update(j._id, { followUpAt: toMs(e.target.value) })}
                />
              </td>
              <td className="whitespace-nowrap px-3 py-2.5">
                <Stars value={j.excitement} disabled={readOnly} onChange={(n) => act.update(j._id, { excitement: n })} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {act.error && <p className="field-support-error px-3 py-2">{pick(C.ERROR_GENERIC)}</p>}
    </div>
  );
}

function JobCard({ job, onOpen, readOnly }: { job: Job; onOpen: (id: Id<"applications">) => void; readOnly: boolean }) {
  const { pick, date } = useFormat();
  const act = useJobActions(readOnly);
  return (
    <li className="card-outlined px-4 py-3" onClick={() => onOpen(job._id)}>
      {job.fromUs && <FromUs />}
      <p className="text-heading-sm">{job.roleTitle}</p>
      <p className="text-body-medium text-on-surface-variant">
        {job.employer} · {job.location ? `${job.location}, ` : ""}
        {job.country}
        {job.salary ? ` · ${job.salary}` : ""}
      </p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <StatusSelect job={job} readOnly={readOnly} onChange={(s) => act.status(job._id, s)} />
        <Stars value={job.excitement} disabled={readOnly} onChange={(n) => act.update(job._id, { excitement: n })} />
      </div>
      <p className="mt-1 text-body-small text-on-surface-variant">
        {job.appliedAt ? `${pick(C.COL_APPLIED)} ${date(job.appliedAt)}` : `${pick(C.COL_SAVED)} ${date(job.savedAt)}`}
        {job.followUpAt ? ` · ${pick(C.COL_FOLLOW)} ${date(job.followUpAt)}` : ""}
      </p>
      {act.error && <p className="field-support-error mt-1">{pick(C.ERROR_GENERIC)}</p>}
    </li>
  );
}

/* ============================================================ job detail */

function JobDetail({
  data,
  jobId,
  onOpen,
  readOnly,
}: {
  data: PortalView;
  jobId: Id<"applications">;
  onOpen: (id: Id<"applications"> | null) => void;
  readOnly: boolean;
}) {
  const { pick, date } = useFormat();
  const job = data.jobs.find((j) => j._id === jobId)!;
  const act = useJobActions(readOnly);
  const remove = useMutation(api.portal.removeJob);
  const [tab, setTab] = useState<"info" | "notes" | "cv" | "coach">("info");
  const [notes, setNotes] = useState(job.notes ?? "");
  const [savedNotes, setSavedNotes] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const closed = CLOSED.includes(job.status as (typeof CLOSED)[number]);
  const coachNotes = data.notes.filter((n) => n.applicationId === job._id);
  const own = job.mine && !job.fromUs;

  return (
    <div className="grid gap-6 large:grid-cols-[17rem_1fr]">
      {/* Teal keeps the list down the left while a job is open. */}
      <aside className="hidden large:block">
        <button type="button" className="mb-3 text-body-medium text-ink-deep underline" onClick={() => onOpen(null)}>
          ← {pick(C.BACK_TO_LIST)}
        </button>
        <ul className="max-h-[70vh] overflow-y-auto rounded-xl border border-line">
          {data.jobs.map((j) => (
            <li key={j._id}>
              <button
                type="button"
                onClick={() => onOpen(j._id)}
                className={`block w-full border-b border-line px-3 py-2.5 text-left ${j._id === jobId ? "bg-canvas-soft" : ""}`}
              >
                <span className="block truncate text-body-medium text-ink">{j.roleTitle}</span>
                <span className="block truncate text-body-small text-on-surface-variant">{j.employer}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="min-w-0">
        <button type="button" className="mb-3 text-body-medium text-ink-deep underline large:hidden" onClick={() => onOpen(null)}>
          ← {pick(C.BACK_TO_LIST)}
        </button>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            {job.fromUs && <FromUs />}
            <h2 className="text-headline-sm text-ink">{job.roleTitle}</h2>
            <p className="text-body-large text-on-surface-variant">
              {job.employer} · {job.location ? `${job.location}, ` : ""}
              {job.country}
            </p>
          </div>
          <div className="text-right">
            {job.salary && <p className="text-title-medium text-ink">{job.salary}</p>}
            <Stars value={job.excitement} disabled={readOnly} onChange={(n) => act.update(job._id, { excitement: n })} />
          </div>
        </div>

        <div className="mt-4">
          {closed ? (
            <p className="text-body-large text-ink">
              {pick(C.JOBS_STATUS[job.status])}
              {!readOnly && (
                <button type="button" className="ml-3 text-body-medium text-ink-deep underline" onClick={() => act.status(job._id, "interested")}>
                  {pick(C.REOPEN)}
                </button>
              )}
            </p>
          ) : (
            <>
              <StageBar reached={job.status} onPick={(s) => act.status(job._id, s)} disabled={readOnly} />
              {!readOnly && (
                <p className="mt-2 text-body-medium text-on-surface-variant">
                  {pick(C.CLOSE_AS)}{" "}
                  {CLOSED.map((s, i) => (
                    <span key={s}>
                      {i > 0 ? " · " : ""}
                      <button type="button" className="text-ink-deep underline" onClick={() => act.status(job._id, s)}>
                        {pick(C.JOBS_STATUS[s])}
                      </button>
                    </span>
                  ))}
                </p>
              )}
            </>
          )}
        </div>

        {job.fromUs && job.matchReason && (
          <p className="mt-4 rounded-xl bg-primary-pale px-4 py-3 text-body-large text-on-primary-pale">
            <span className="text-label-large">{pick(C.JOBS_WHY)}</span>
            <br />
            {job.matchReason}
          </p>
        )}

        <nav className="mt-5 flex gap-1 overflow-x-auto border-b border-line" role="tablist">
          {(
            [
              ["info", C.DTAB_INFO],
              ["notes", C.DTAB_NOTES],
              ["cv", C.DTAB_CV],
              ["coach", C.DTAB_COACH],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={
                "-mb-px shrink-0 border-b-2 px-4 py-2 text-label-large " +
                (tab === id ? "border-ink-deep text-ink" : "border-transparent text-on-surface-variant")
              }
            >
              {pick(label)}
              {id === "coach" && coachNotes.length ? ` ${coachNotes.length}` : ""}
            </button>
          ))}
        </nav>

        <div className="mt-5">
          {tab === "info" && (
            <div className="space-y-5">
              {!own && <p className="text-body-medium text-on-surface-variant">{pick(C.DETAIL_OURS)}</p>}
              <div>
                <h3 className="text-label-large text-on-surface-variant">{pick(C.DETAIL_DATES)}</h3>
                <div className="mt-2 grid gap-4 medium:grid-cols-4">
                  <ReadDate label={pick(C.COL_SAVED)} value={date(job.savedAt)} />
                  {own ? (
                    <DateField
                      label={pick(C.COL_DEADLINE)}
                      value={job.deadlineAt}
                      disabled={readOnly}
                      onChange={(ms) => act.update(job._id, { deadlineAt: ms })}
                    />
                  ) : (
                    <ReadDate label={pick(C.COL_DEADLINE)} value={job.deadlineAt ? date(job.deadlineAt) : "–"} />
                  )}
                  <ReadDate label={pick(C.COL_APPLIED)} value={job.appliedAt ? date(job.appliedAt) : "–"} />
                  <DateField
                    label={pick(C.COL_FOLLOW)}
                    value={job.followUpAt}
                    disabled={readOnly}
                    onChange={(ms) => act.update(job._id, { followUpAt: ms })}
                  />
                </div>
              </div>
              {own && !readOnly && <EditOwnJob job={job} onSave={(p) => act.update(job._id, p)} />}
              {job.jobUrl && (
                <a href={job.jobUrl} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center btn-outlined px-5 text-label-large">
                  {pick(C.JOBS_POSTING)}
                </a>
              )}
              {own && !readOnly && (
                <div>
                  {confirm ? (
                    <button
                      type="button"
                      className="text-body-medium text-error underline"
                      onClick={() => {
                        void remove({ applicationId: job._id }).then(() => onOpen(null));
                      }}
                    >
                      {pick(C.JOBS_REMOVE_CONFIRM)}
                    </button>
                  ) : (
                    <button type="button" className="text-body-medium text-on-surface-variant underline" onClick={() => setConfirm(true)}>
                      {pick(C.JOBS_REMOVE)}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {tab === "notes" && (
            <div>
              <textarea
                rows={8}
                className="field"
                value={notes}
                disabled={readOnly}
                onChange={(e) => {
                  setNotes(e.target.value);
                  setSavedNotes(false);
                }}
              />
              {!readOnly && (
                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    className="h-11 btn-tonal px-5 text-label-large"
                    onClick={() => {
                      act.update(job._id, { notes });
                      setSavedNotes(true);
                    }}
                  >
                    {pick(C.JOBS_SAVE)}
                  </button>
                  {savedNotes && <span className="text-body-medium text-on-surface-variant">{pick(C.SAVED_OK)}</span>}
                </div>
              )}
            </div>
          )}

          {tab === "cv" && (
            <div className="max-w-xl">
              <p className="text-body-medium text-on-surface-variant">{pick(C.CV_SENT_HELP)}</p>
              <select
                className="field mt-3"
                disabled={readOnly}
                value={job.cvDocumentId ?? ""}
                onChange={(e) => act.update(job._id, { cvDocumentId: (e.target.value || null) as Id<"cvDocuments"> | null })}
              >
                <option value="">{pick(C.CV_SENT_NONE)}</option>
                {data.cvs.map((c) => (
                  <option key={c._id} value={c._id}>
                    {fill(pick(C.CV_VERSION), { n: c.version })} · {c.label}
                  </option>
                ))}
              </select>
              {job.cvDocumentId &&
                (() => {
                  const cv = data.cvs.find((c) => c._id === job.cvDocumentId);
                  return cv?.url ? (
                    <a href={cv.url} target="_blank" rel="noreferrer" download={cv.fileName} className="mt-3 inline-block text-body-medium text-ink-deep underline">
                      {pick(C.CV_DOWNLOAD)}
                    </a>
                  ) : null;
                })()}
            </div>
          )}

          {tab === "coach" &&
            (coachNotes.length === 0 ? (
              <p className="text-body-medium text-on-surface-variant">{pick(C.COACH_NOTES_NONE)}</p>
            ) : (
              <ul className="space-y-3">
                {coachNotes.map((n) => (
                  <li key={n._id} className="card-outlined px-5 py-4">
                    <p className="text-body-medium text-on-surface-variant">{date(n.at)}</p>
                    <p className="mt-1 whitespace-pre-line text-body-large text-ink">{n.body}</p>
                  </li>
                ))}
              </ul>
            ))}
        </div>
        {act.error && <p className="field-support-error mt-3">{pick(C.ERROR_GENERIC)}</p>}
      </div>
    </div>
  );
}

function ReadDate({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="field-label">{label}</p>
      <p className="mt-2 text-body-large text-ink">{value}</p>
    </div>
  );
}

function DateField({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value: number | null;
  disabled: boolean;
  onChange: (ms: number | null) => void;
}) {
  return (
    <label className="field-label block">
      {label}
      <input type="date" className="field mt-1" disabled={disabled} value={toIso(value)} onChange={(e) => onChange(toMs(e.target.value))} />
    </label>
  );
}

function EditOwnJob({
  job,
  onSave,
}: {
  job: Job;
  onSave: (p: { employer: string; roleTitle: string; country: string; location: string; jobUrl: string; salary: string }) => void;
}) {
  const { pick } = useFormat();
  const [f, setF] = useState({
    roleTitle: job.roleTitle,
    employer: job.employer,
    country: job.country,
    location: job.location ?? "",
    jobUrl: job.jobUrl ?? "",
    salary: job.salary ?? "",
  });
  const [ok, setOk] = useState(false);
  const field = (k: keyof typeof f, label: Copy) => (
    <label className="field-label block">
      {pick(label)}
      <input
        className="field mt-1"
        value={f[k]}
        onChange={(e) => {
          setF({ ...f, [k]: e.target.value });
          setOk(false);
        }}
      />
    </label>
  );
  return (
    <div>
      <div className="grid gap-4 medium:grid-cols-2">
        {field("roleTitle", C.ADD_ROLE)}
        {field("employer", C.ADD_EMPLOYER)}
        {field("country", C.ADD_COUNTRY)}
        {field("location", C.ADD_LOCATION)}
        {field("jobUrl", C.ADD_URL)}
        {field("salary", C.ADD_SALARY)}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          className="h-11 btn-tonal px-5 text-label-large"
          onClick={() => {
            onSave(f);
            setOk(true);
          }}
        >
          {pick(C.JOBS_SAVE)}
        </button>
        {ok && <span className="text-body-medium text-on-surface-variant">{pick(C.SAVED_OK)}</span>}
      </div>
    </div>
  );
}

function AddJob({ onDone }: { onDone: () => void }) {
  const { pick } = useFormat();
  const add = useMutation(api.portal.addJob);
  const [f, setF] = useState({
    roleTitle: "",
    employer: "",
    country: "",
    location: "",
    jobUrl: "",
    salary: "",
    status: "interested" as Status,
  });
  const [error, setError] = useState<Copy | null>(null);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!f.roleTitle.trim() || !f.employer.trim() || !f.country.trim()) {
      setError(C.ERROR_FIELDS);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await add(f);
      onDone();
    } catch {
      setError(C.ERROR_GENERIC);
    } finally {
      setBusy(false);
    }
  };

  const field = (key: Exclude<keyof typeof f, "status">, label: Copy, type = "text") => (
    <label className="field-label block">
      {pick(label)}
      <input type={type} className="field mt-1" value={f[key]} onChange={(e) => setF({ ...f, [key]: e.target.value })} />
    </label>
  );

  return (
    <div className="card-outlined mt-4 px-6 py-5">
      <div className="grid gap-4 medium:grid-cols-3">
        {field("roleTitle", C.ADD_ROLE)}
        {field("employer", C.ADD_EMPLOYER)}
        {field("country", C.ADD_COUNTRY)}
        {field("location", C.ADD_LOCATION)}
        {field("jobUrl", C.ADD_URL, "url")}
        {field("salary", C.ADD_SALARY)}
        <label className="field-label block">
          {pick(C.ADD_STATUS)}
          <select className="field mt-1" value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as Status })}>
            {[...PIPELINE, ...CLOSED].map((s) => (
              <option key={s} value={s}>
                {pick(C.JOBS_STATUS[s])}
              </option>
            ))}
          </select>
        </label>
      </div>
      {error && <p className="field-support-error mt-3">{pick(error)}</p>}
      <div className="mt-5 flex items-center gap-4">
        <button type="button" disabled={busy} className="h-11 btn-filled px-6 text-label-large" onClick={() => void save()}>
          {pick(C.JOBS_SAVE)}
        </button>
        <button type="button" className="text-body-medium text-ink-deep underline" onClick={onDone}>
          {pick(C.JOBS_CANCEL)}
        </button>
      </div>
    </div>
  );
}

/* ================================================================ CV tab */

function CvTab({ data }: { data: PortalView }) {
  const { pick, date, t } = useFormat();
  if (data.cvs.length === 0) return <p className="text-body-large text-on-surface-variant">{pick(C.CV_EMPTY)}</p>;
  return (
    <ul className="grid gap-4 large:grid-cols-2">
      {data.cvs.map((c, i) => (
        <li key={c._id} className="card-outlined px-6 py-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-heading-sm">
              {t(C.CV_VERSION, { n: c.version })} · {c.label}
            </p>
            {i === 0 && (
              <span className="rounded-sm bg-primary-pale px-2 py-0.5 text-label-medium text-on-primary-pale">{pick(C.CV_LATEST)}</span>
            )}
          </div>
          <p className="mt-1 text-body-medium text-on-surface-variant">
            {pick(c.author === "candidate" ? C.CV_THEIRS : C.CV_OURS)} · {date(c.sharedAt)}
          </p>
          {c.changeNote && (
            <div className="mt-3">
              <p className="text-label-large text-on-surface-variant">{pick(C.CV_CHANGED)}</p>
              <p className="mt-1 whitespace-pre-line text-body-large text-ink">{c.changeNote}</p>
            </div>
          )}
          {c.url && (
            <a href={c.url} target="_blank" rel="noreferrer" download={c.fileName} className="mt-4 inline-flex h-11 items-center btn-outlined px-5 text-label-large">
              {pick(C.CV_DOWNLOAD)}
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

/* ============================================================= coach tab */

function Deliverables({ data }: { data: PortalView }) {
  const { pick, t, date } = useFormat();
  if (data.deliverables.length === 0) return <p className="mt-3 text-body-medium text-on-surface-variant">{pick(C.WORK_EMPTY)}</p>;
  return (
    <ol className="mt-3 space-y-2">
      {data.deliverables.map((d) => (
        <li key={d._id} className="flex items-center gap-3">
          <StepMark status={d.status} />
          <div className="min-w-0">
            <p className="text-body-large text-ink">{d.title ?? pick(C.WORK_KIND[d.kind] ?? { en: d.kind, th: d.kind })}</p>
            <p className="text-body-small text-on-surface-variant">
              {pick(C.WORK_STATUS[d.status])}
              {d.status === "delivered" && d.deliveredAt
                ? ` · ${t(C.WORK_DONE_ON, { date: date(d.deliveredAt) })}`
                : d.dueAt
                  ? ` · ${t(C.WORK_DUE, { date: date(d.dueAt) })}`
                  : ""}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function StepMark({ status }: { status: "not_started" | "in_progress" | "delivered" }) {
  if (status === "delivered") {
    return (
      <span aria-hidden className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-on-primary">
        ✓
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className={"grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 " + (status === "in_progress" ? "border-ink-deep" : "border-line")}
    >
      {status === "in_progress" ? <span className="h-2 w-2 rounded-full bg-ink-deep" /> : null}
    </span>
  );
}

function CoachTab({ data }: { data: PortalView }) {
  const { pick, date } = useFormat();
  return (
    <div className="grid gap-6 large:grid-cols-2">
      <section className="card-outlined px-6 py-5">
        <h2 className="text-heading-sm">{pick(C.WORK_HEADING)}</h2>
        <Deliverables data={data} />
        {data.tokens.bought > 0 && <p className="mt-4 text-body-medium text-on-surface-variant">{pick(C.TOKENS_RULE)}</p>}
      </section>
      <section>
        <h2 className="text-heading-sm">{pick(C.NOTES_HEADING)}</h2>
        {data.notes.length === 0 ? (
          <p className="mt-3 text-body-medium text-on-surface-variant">{pick(C.WORK_EMPTY)}</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {data.notes.map((n) => {
              const job = n.applicationId ? data.jobs.find((j) => j._id === n.applicationId) : null;
              return (
                <li key={n._id} className="card-outlined px-5 py-4">
                  <p className="text-body-medium text-on-surface-variant">
                    {date(n.at)}
                    {job ? ` · ${job.roleTitle}, ${job.employer}` : ""}
                  </p>
                  <p className="mt-1 whitespace-pre-line text-body-large text-ink">{n.body}</p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
