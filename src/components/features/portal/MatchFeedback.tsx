"use client";

/**
 * Where a like or dislike link in the matched-role email lands, 12/11/2026.
 *
 * It records the verdict when the page runs, not when the link is fetched, so
 * a mail scanner that prefetches links records nothing. A dislike then offers
 * one-tap reasons, optional. A bad token ends on the same page as a good one,
 * as `Unsubscribe`, because the mutation reports nothing back.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCopy } from "@/components/LocaleProvider";
import {
  MATCH_FEEDBACK_BODY,
  MATCH_FEEDBACK_DASHBOARD,
  MATCH_FEEDBACK_DOWN_HEADING,
  MATCH_FEEDBACK_REASONS,
  MATCH_FEEDBACK_REASON_ASK,
  MATCH_FEEDBACK_REASON_SAVED,
  MATCH_FEEDBACK_SWITCH,
  MATCH_FEEDBACK_UP_HEADING,
  MATCH_FEEDBACK_WORKING,
} from "@/lib/content/matchFeedback";

type Verdict = "up" | "down";

export default function MatchFeedback({ token, initial }: { token: string; initial: Verdict }) {
  const { pick, path } = useCopy();
  const record = useMutation(api.matchFeedback.record);
  const [verdict, setVerdict] = useState<Verdict>(initial);
  const [done, setDone] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const fired = useRef(false);

  const send = (v: Verdict, r?: string) =>
    record({ token, verdict: v, ...(r ? { reason: r } : {}) }).catch((err) => console.error("match feedback failed", err));

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    send(initial).finally(() => setDone(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchTo = (v: Verdict) => {
    setVerdict(v);
    setReason(null);
    void send(v);
  };

  if (!done) {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-16">
        <p className="text-body-large text-on-surface-variant">{pick(MATCH_FEEDBACK_WORKING)}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <h1 className="text-headline-large">
        {pick(verdict === "up" ? MATCH_FEEDBACK_UP_HEADING : MATCH_FEEDBACK_DOWN_HEADING)}
      </h1>
      <p className="mt-5 text-body-large text-on-surface-variant">{pick(MATCH_FEEDBACK_BODY)}</p>

      {verdict === "down" && (
        <div className="mt-8">
          <p className="text-title-medium">{pick(MATCH_FEEDBACK_REASON_ASK)}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {MATCH_FEEDBACK_REASONS.map((r) => (
              <button
                key={r.id}
                type="button"
                aria-pressed={reason === r.id}
                onClick={() => {
                  setReason(r.id);
                  void send("down", r.id);
                }}
                className={
                  "rounded-full border px-4 py-2 text-label-large " +
                  (reason === r.id ? "border-ink-deep bg-canvas-soft text-ink" : "border-outline-variant text-on-surface")
                }
              >
                {pick(r.label)}
              </button>
            ))}
          </div>
          {reason && <p className="mt-3 text-body-medium text-mute-strong">{pick(MATCH_FEEDBACK_REASON_SAVED)}</p>}
        </div>
      )}

      <p className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-body-large">
        <Link href={path("/me")} className="text-ink-deep underline underline-offset-2">
          {pick(MATCH_FEEDBACK_DASHBOARD)}
        </Link>
        <button
          type="button"
          onClick={() => switchTo(verdict === "up" ? "down" : "up")}
          className="text-on-surface-variant underline underline-offset-2"
        >
          {pick(MATCH_FEEDBACK_SWITCH)}
        </button>
      </p>
    </div>
  );
}
