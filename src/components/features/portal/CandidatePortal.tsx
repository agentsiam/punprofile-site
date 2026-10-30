"use client";

/**
 * The paying candidate's own page. Teal's job tracker and home, cut to what a
 * PunProfile client needs, and Thai first:
 *
 * - **Home strip:** tokens left, roles we have sent, what is delivered.
 * - **What you get:** the deliverables, each with its state and date.
 * - **From your coach:** shared delivery notes only.
 * - **Your CV files:** shared versions, newest first, each revision with what
 *   changed. Download only, never displayed.
 * - **Your job list:** a stage strip to filter by, one card per job, status
 *   moved by the candidate, and their own jobs added beside the ones we sent.
 *
 * Every string comes from `src/lib/content/portal.ts` (R49). No score, grade or
 * coach-only record reaches this page; `convex/portal.ts` decides that, not the
 * component.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCopy } from "@/components/LocaleProvider";
import Band from "@/components/Band";
import { HERO_HEADING, SECTION_HEADING } from "@/lib/content/footer";
import type { Copy } from "@/lib/content/copy";
import * as C from "@/lib/content/portal";

const PIPELINE = ["interested", "applied", "screening", "interviewing", "offer", "accepted"] as const;
const CLOSED = ["rejected", "withdrawn"] as const;
type Status = (typeof PIPELINE)[number] | (typeof CLOSED)[number];

const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));

const toMs = (iso: string) => (iso ? Date.parse(`${iso}T12:00:00Z`) : null);
const toIso = (ms: number | null) => (ms === null ? "" : new Date(ms).toISOString().slice(0, 10));

export default function CandidatePortal({ token }: { token: string }) {
  const { pick, locale } = useCopy();
  const data = useQuery(api.portal.view, { token });
  const opened = useMutation(api.portal.opened);
  const stamped = useRef(false);

  useEffect(() => {
    if (data && !stamped.current) {
      stamped.current = true;
      void opened({ token });
    }
  }, [data, opened, token]);

  const date = (ms: number) =>
    new Date(ms).toLocaleDateString(locale === "th" ? "th-TH" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  const t = (c: Copy, vars: Record<string, string | number> = {}) => fill(pick(c), vars);

  if (data === undefined) {
    return (
      <Band block="B1" ground="canvas" width="wide">
        <p className="text-body-large text-on-surface-variant">{pick(C.LOADING)}</p>
      </Band>
    );
  }

  if (data === null) {
    return (
      <Band block="B1" ground="canvas" width="text">
        <h1 className={HERO_HEADING(locale)}>{pick(C.LINK_INVALID_HEADING)}</h1>
        <p className="mt-4 text-body-large text-on-surface-variant">{pick(C.LINK_INVALID_BODY)}</p>
      </Band>
    );
  }

  const delivered = data.deliverables.filter((d) => d.status === "delivered").length;

  return (
    <div className="w-full">
      {/* -------------------------------------------------------- hero */}
      <Band block="B1" ground="canvas" width="wide">
        <h1 className={HERO_HEADING(locale)}>
          {data.firstName ? t(C.PORTAL_GREETING, { name: data.firstName }) : pick(C.PORTAL_GREETING_NONAME)}
        </h1>
        <p className="mt-4 max-w-2xl text-body-large text-on-surface-variant">{pick(C.PORTAL_INTRO)}</p>

        <div className="mt-8 grid gap-4 medium:grid-cols-3">
          {data.tokens.bought > 0 && (
            <div className="card-outlined px-6 py-5">
              <p className="text-label-large text-on-surface-variant">{pick(C.TOKENS_HEADING)}</p>
              <p className="mt-1 text-display-sm text-ink">
                {data.tokens.balance}{" "}
                <span className="text-body-large text-on-surface-variant">
                  {t(C.TOKENS_OF, { n: data.tokens.bought })}
                </span>
              </p>
              <p className="mt-2 text-body-medium text-on-surface-variant">
                {t(C.TOKENS_MATCHED, { n: data.tokens.matchedSent })}
              </p>
            </div>
          )}
          {data.deliverables.length > 0 && (
            <div className="card-outlined px-6 py-5">
              <p className="text-label-large text-on-surface-variant">{pick(C.WORK_HEADING)}</p>
              <p className="mt-1 text-display-sm text-ink">
                {delivered}
                <span className="text-body-large text-on-surface-variant"> / {data.deliverables.length}</span>
              </p>
              <Progress done={delivered} total={data.deliverables.length} />
            </div>
          )}
          <div className="card-outlined px-6 py-5">
            <p className="text-label-large text-on-surface-variant">{pick(C.JOBS_HEADING)}</p>
            <p className="mt-1 text-display-sm text-ink">{data.jobs.length}</p>
            <p className="mt-2 text-body-medium text-on-surface-variant">
              {PIPELINE.filter((s) => s !== "interested")
                .map((s) => [s, data.jobs.filter((j) => j.status === s).length] as const)
                .filter(([, n]) => n > 0)
                .map(([s, n]) => `${pick(C.JOBS_STATUS[s])} ${n}`)
                .join(" · ")}
            </p>
          </div>
        </div>
        {data.tokens.bought > 0 && (
          <p className="mt-3 text-body-medium text-on-surface-variant">{pick(C.TOKENS_RULE)}</p>
        )}
      </Band>

      {/* ----------------------------------------- deliverables + notes */}
      <Band block="B4" ground="soft" width="wide">
        <div className="grid gap-10 large:grid-cols-2">
          <div>
            <h2 className={SECTION_HEADING(locale)}>{pick(C.WORK_HEADING)}</h2>
            {data.deliverables.length === 0 ? (
              <p className="mt-4 text-body-large text-on-surface-variant">{pick(C.WORK_EMPTY)}</p>
            ) : (
              <ol className="mt-5 space-y-3">
                {data.deliverables.map((d) => (
                  <li key={d._id} className="card-plain flex items-center gap-4 px-5 py-4">
                    <StepMark status={d.status} />
                    <div className="min-w-0 flex-1">
                      <p className="text-heading-sm">
                        {d.title ?? pick(C.WORK_KIND[d.kind] ?? { en: d.kind, th: d.kind })}
                      </p>
                      <p className="text-body-medium text-on-surface-variant">
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
            )}
          </div>

          <div>
            <h2 className={SECTION_HEADING(locale)}>{pick(C.NOTES_HEADING)}</h2>
            {data.notes.length === 0 ? (
              <p className="mt-4 text-body-large text-on-surface-variant">{pick(C.WORK_EMPTY)}</p>
            ) : (
              <ul className="mt-5 space-y-3">
                {data.notes.map((n) => (
                  <li key={n._id} className="card-plain px-5 py-4">
                    <p className="text-body-medium text-on-surface-variant">{date(n.at)}</p>
                    <p className="mt-1 whitespace-pre-line text-body-large text-ink">{n.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Band>

      {/* -------------------------------------------------------- CVs */}
      <Band block="B4" ground="canvas" width="wide">
        <h2 className={SECTION_HEADING(locale)}>{pick(C.CV_HEADING)}</h2>
        {data.cvs.length === 0 ? (
          <p className="mt-4 text-body-large text-on-surface-variant">{pick(C.CV_EMPTY)}</p>
        ) : (
          <ul className="mt-5 grid gap-4 large:grid-cols-2">
            {data.cvs.map((c, i) => (
              <li key={c._id} className="card-outlined px-6 py-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-heading-sm">
                    {t(C.CV_VERSION, { n: c.version })} · {c.label}
                  </p>
                  {i === 0 && (
                    <span className="rounded-sm bg-primary-pale px-2 py-0.5 text-label-medium text-on-primary-pale">
                      {pick(C.CV_LATEST)}
                    </span>
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
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    download={c.fileName}
                    className="mt-4 inline-flex h-11 items-center btn-outlined px-5 text-label-large"
                  >
                    {pick(C.CV_DOWNLOAD)}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </Band>

      {/* ------------------------------------------------------- jobs */}
      <Band block="B4" ground="soft" width="wide">
        <JobList token={token} jobs={data.jobs} date={date} />
        <p className="mt-10 text-body-medium text-on-surface-variant">{pick(C.PORTAL_PRIVATE)}</p>
      </Band>
    </div>
  );
}

function Progress({ done, total }: { done: number; total: number }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-canvas-soft" aria-hidden>
      <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
    </div>
  );
}

function StepMark({ status }: { status: "not_started" | "in_progress" | "delivered" }) {
  if (status === "delivered") {
    return (
      <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-on-primary">
        ✓
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className={
        "grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 " +
        (status === "in_progress" ? "border-ink-deep" : "border-line")
      }
    >
      {status === "in_progress" ? <span className="h-2.5 w-2.5 rounded-full bg-ink-deep" /> : null}
    </span>
  );
}

type Job = NonNullable<ReturnType<typeof useQuery<typeof api.portal.view>>>["jobs"][number];

function JobList({ token, jobs, date }: { token: string; jobs: Job[]; date: (ms: number) => string }) {
  const { pick, locale } = useCopy();
  const [filter, setFilter] = useState<Status | "all">("all");
  const [adding, setAdding] = useState(false);
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const j of jobs) c[j.status] = (c[j.status] ?? 0) + 1;
    return c;
  }, [jobs]);
  const shown = filter === "all" ? jobs : jobs.filter((j) => j.status === filter);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className={SECTION_HEADING(locale)}>{pick(C.JOBS_HEADING)}</h2>
        {!adding && (
          <button type="button" className="h-12 btn-filled px-6 text-label-large" onClick={() => setAdding(true)}>
            {pick(C.ADD_JOB)}
          </button>
        )}
      </div>
      <p className="mt-3 max-w-2xl text-body-large text-on-surface-variant">{pick(C.JOBS_INTRO)}</p>

      {adding && <AddJob token={token} onDone={() => setAdding(false)} />}

      {/* Stage strip: Teal's chevron row, as chips that filter. */}
      {jobs.length > 0 && (
        <div className="mt-6 flex gap-2 overflow-x-auto pb-1" role="tablist">
          {(["all", ...PIPELINE, ...CLOSED] as const).map((s) => {
            const n = s === "all" ? jobs.length : (counts[s] ?? 0);
            if (s !== "all" && n === 0) return null;
            const on = filter === s;
            return (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setFilter(s)}
                className={
                  "shrink-0 rounded-sm border px-3 py-1.5 text-label-large " +
                  (on ? "border-ink-deep bg-canvas text-ink" : "border-line text-on-surface-variant")
                }
              >
                {pick(s === "all" ? C.JOBS_ALL : C.JOBS_STATUS[s])} {n}
              </button>
            );
          })}
        </div>
      )}

      {jobs.length === 0 ? (
        <p className="mt-6 text-body-large text-on-surface-variant">{pick(C.JOBS_EMPTY)}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {shown.map((j) => (
            <JobCard key={j._id} token={token} job={j} date={date} />
          ))}
        </ul>
      )}
    </>
  );
}

function JobCard({ token, job, date }: { token: string; job: Job; date: (ms: number) => string }) {
  const { pick } = useCopy();
  const setStatus = useMutation(api.portal.setJobStatus);
  const update = useMutation(api.portal.updateJob);
  const remove = useMutation(api.portal.removeJob);
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(job.notes ?? "");
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState(false);
  const fill2 = (c: Copy, d: number) => pick(c).replace("{date}", date(d));

  const act = async (fn: () => Promise<unknown>) => {
    setError(false);
    try {
      await fn();
    } catch {
      setError(true);
    }
  };

  return (
    <li className="card-plain px-5 py-4">
      {/* Status under the title on a phone, beside it from medium up: a select
          beside the title squeezed a three-word role into one word a line. */}
      <div className="flex flex-col gap-3 medium:flex-row medium:items-start medium:justify-between">
        <div className="min-w-0 flex-1">
          {job.fromUs && (
            <span className="mb-1 inline-block rounded-sm bg-primary-pale px-2 py-0.5 text-label-medium text-on-primary-pale">
              {pick(C.JOBS_FROM_US)}
            </span>
          )}
          <p className="text-heading-sm">{job.roleTitle}</p>
          <p className="text-body-medium text-on-surface-variant">
            {job.employer} · {job.location ? `${job.location}, ` : ""}
            {job.country}
            {job.salary ? ` · ${job.salary}` : ""}
          </p>
          <p className="text-body-medium text-on-surface-variant">
            {job.appliedAt ? fill2(C.JOBS_APPLIED_ON, job.appliedAt) : ""}
            {job.appliedAt && job.deadlineAt && job.status === "interested" ? " · " : ""}
            {job.deadlineAt && job.status === "interested" ? fill2(C.JOBS_CLOSES, job.deadlineAt) : ""}
          </p>
        </div>
        <select
          aria-label={pick(C.ADD_STATUS)}
          className="field h-11 w-full py-0 medium:w-auto"
          value={job.status}
          onChange={(e) => void act(() => setStatus({ token, applicationId: job._id, status: e.target.value as Status }))}
        >
          {[...PIPELINE, ...CLOSED].map((s) => (
            <option key={s} value={s}>
              {pick(C.JOBS_STATUS[s])}
            </option>
          ))}
        </select>
      </div>

      {job.fromUs && job.matchReason && (
        <p className="mt-2 text-body-medium text-ink">
          <span className="text-on-surface-variant">{pick(C.JOBS_WHY)}: </span>
          {job.matchReason}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-4">
        {job.jobUrl && (
          <a href={job.jobUrl} target="_blank" rel="noreferrer" className="text-body-medium text-ink-deep underline">
            {pick(C.JOBS_POSTING)}
          </a>
        )}
        <button type="button" className="text-body-medium text-ink-deep underline" onClick={() => setOpen((o) => !o)}>
          {pick(C.JOBS_DETAILS)}
        </button>
      </div>

      {open && (
        <div className="mt-4 grid gap-4 medium:grid-cols-[1fr_auto]">
          <label className="field-label block">
            {pick(C.JOBS_NOTES)}
            <textarea rows={3} className="field mt-1" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
          <label className="field-label block">
            {pick(C.JOBS_FOLLOW_UP)}
            <input
              type="date"
              className="field mt-1"
              value={toIso(job.followUpAt)}
              onChange={(e) => void act(() => update({ token, applicationId: job._id, followUpAt: toMs(e.target.value) }))}
            />
          </label>
          <div className="flex flex-wrap items-center gap-4 medium:col-span-2">
            <button
              type="button"
              className="h-11 btn-tonal px-5 text-label-large"
              onClick={() => void act(() => update({ token, applicationId: job._id, notes }))}
            >
              {pick(C.JOBS_SAVE)}
            </button>
            {job.mine && !job.fromUs && (
              confirm ? (
                <button
                  type="button"
                  className="text-body-medium text-error underline"
                  onClick={() => void act(() => remove({ token, applicationId: job._id }))}
                >
                  {pick(C.JOBS_REMOVE_CONFIRM)}
                </button>
              ) : (
                <button type="button" className="text-body-medium text-on-surface-variant underline" onClick={() => setConfirm(true)}>
                  {pick(C.JOBS_REMOVE)}
                </button>
              )
            )}
          </div>
        </div>
      )}
      {error && <p className="field-support-error mt-2">{pick(C.ERROR_GENERIC)}</p>}
    </li>
  );
}

function AddJob({ token, onDone }: { token: string; onDone: () => void }) {
  const { pick } = useCopy();
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
      await add({ token, ...f });
      onDone();
    } catch {
      setError(C.ERROR_GENERIC);
    } finally {
      setBusy(false);
    }
  };

  const field = (key: keyof typeof f, label: Copy, type = "text") => (
    <label className="field-label block">
      {pick(label)}
      <input
        type={type}
        className="field mt-1"
        value={f[key]}
        onChange={(e) => setF({ ...f, [key]: e.target.value })}
      />
    </label>
  );

  return (
    <div className="card-outlined mt-6 px-6 py-5">
      <div className="grid gap-4 medium:grid-cols-2">
        {field("roleTitle", C.ADD_ROLE)}
        {field("employer", C.ADD_EMPLOYER)}
        {field("country", C.ADD_COUNTRY)}
        {field("location", C.ADD_LOCATION)}
        {field("jobUrl", C.ADD_URL, "url")}
        {field("salary", C.ADD_SALARY)}
        <label className="field-label block">
          {pick(C.ADD_STATUS)}
          <select
            className="field mt-1"
            value={f.status}
            onChange={(e) => setF({ ...f, status: e.target.value as Status })}
          >
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
        <button type="button" disabled={busy} className="h-12 btn-filled px-6 text-label-large" onClick={() => void save()}>
          {pick(C.JOBS_SAVE)}
        </button>
        <button type="button" className="text-body-medium text-ink-deep underline" onClick={onDone}>
          {pick(C.JOBS_CANCEL)}
        </button>
      </div>
    </div>
  );
}
