"use client";

/**
 * Where a like or dislike link in the matched-role email lands, 12/11/2026.
 *
 * It records the verdict when the page runs, not when the link is fetched, so
 * a mail scanner that prefetches links records nothing. A dislike then offers
 * one-tap reasons, optional. A bad token ends on the same page as a good one,
 * as `Unsubscribe`, because the mutation reports nothing back.
 *
 * ---------------------------------------------------------------------------
 * **Nothing here confirms a write that has not happened, 14/11/2026.**
 * ---------------------------------------------------------------------------
 *
 * Every state this page shows used to be set before, or regardless of, the
 * mutation it describes:
 *
 * - the first write was `send(initial).finally(() => setDone(true))`, and
 *   `.finally` runs on rejection too, so "PunProfile has recorded" rendered
 *   after a write that failed;
 * - a reason pill set its own saved line from local state, so "Reason
 *   recorded" appeared the instant it was tapped;
 * - the switch link flipped the heading the same way;
 * - and all of them fired concurrent mutations with no ordering, so the row
 *   could end on an earlier tap than the candidate's last one.
 *
 * Now a claim about the stored row is only rendered once the write behind it
 * has resolved, and writes are serialised so the row ends where the candidate
 * left it. The UI still responds on tap: what is immediate is the *selection*
 * (`aria-pressed`, the switch's busy state), and what waits is the
 * *confirmation*.
 *
 * **The silence for a bad token is deliberate and is untouched.**
 * `convex/matchFeedback.ts` returns `null` for a short token and for a missing
 * row; it never throws. So a bad token RESOLVES, and from here it is
 * indistinguishable from a good one, which is the point. A rejection
 * therefore never means "your token was refused", only that the request did
 * not arrive, and that is the one case the retry below exists for. Retrying
 * cannot leak which tokens are real.
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

/** 0.5s, 1s, 2s. Three waits, so four attempts in all. */
const RETRY_WAITS = [500, 1000, 2000];

export default function MatchFeedback({ token, initial }: { token: string; initial: Verdict }) {
  const { pick, path } = useCopy();
  const record = useMutation(api.matchFeedback.record);

  /** The verdict the row is known to hold, which is what the page states. */
  const [verdict, setVerdict] = useState<Verdict>(initial);
  const [done, setDone] = useState(false);
  /** The reason that is selected, for `aria-pressed`. */
  const [reason, setReason] = useState<string | null>(null);
  /** The reason whose own write has resolved, which is what is confirmed. */
  const [savedReason, setSavedReason] = useState<string | null>(null);
  const [switching, setSwitching] = useState(false);

  const fired = useRef(false);
  /** Serialises writes: one in flight at a time, in the order they were made. */
  const chain = useRef<Promise<void>>(Promise.resolve());
  /** The newest intent. An older one still queued is dropped rather than sent. */
  const intent = useRef(0);

  /**
   * Queue a write. Resolves true only when this exact intent reached the
   * server, false when it was superseded by a later tap or the request failed.
   */
  function write(v: Verdict, r?: string): Promise<boolean> {
    const id = ++intent.current;
    const run = chain.current.then(async () => {
      // A tap that has already been overtaken is never sent: two writes that
      // overlap can land in either order, and the row would then keep
      // whichever arrived last rather than whichever was meant.
      if (intent.current !== id) return false;
      try {
        await record({ token, verdict: v, ...(r ? { reason: r } : {}) });
        return true;
      } catch (err) {
        console.error("match feedback failed", err);
        return false;
      }
    });
    // The chain must never reject, or every later write is dropped with it.
    chain.current = run.then(
      () => undefined,
      () => undefined,
    );
    return run;
  }

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    let live = true;

    void (async () => {
      for (let attempt = 0; attempt <= RETRY_WAITS.length; attempt++) {
        if (await write(initial)) {
          if (live) setDone(true);
          return;
        }
        if (!live) return;
        if (attempt < RETRY_WAITS.length) {
          await new Promise((r) => setTimeout(r, RETRY_WAITS[attempt]));
        }
      }
      // Out of attempts. The page stays on its waiting line rather than
      // claiming a record that does not exist. A visible retry needs a copy
      // record that does not exist yet; see the handover.
    })();

    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function switchTo(v: Verdict) {
    setSwitching(true);
    // The heading names what the row holds, so it moves only once the row
    // does. A failed switch leaves the old verdict and the old reason on
    // screen, which is what the row still holds, rather than clearing the
    // selection for a change that did not happen.
    if (await write(v)) {
      setVerdict(v);
      setReason(null);
      setSavedReason(null);
    }
    setSwitching(false);
  }

  async function chooseReason(id: string) {
    setReason(id);
    setSavedReason(null);
    if (await write("down", id)) setSavedReason(id);
  }

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
                onClick={() => void chooseReason(r.id)}
                className={
                  "rounded-full border px-4 py-2 text-label-large " +
                  (reason === r.id ? "border-ink-deep bg-canvas-soft text-ink" : "border-outline-variant text-on-surface")
                }
              >
                {pick(r.label)}
              </button>
            ))}
          </div>
          {/* Confirms the stored reason, not the tapped one. */}
          {savedReason !== null && savedReason === reason && (
            <p className="mt-3 text-body-medium text-mute-strong">{pick(MATCH_FEEDBACK_REASON_SAVED)}</p>
          )}
        </div>
      )}

      <p className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-body-large">
        <Link href={path("/me")} className="text-ink-deep underline underline-offset-2">
          {pick(MATCH_FEEDBACK_DASHBOARD)}
        </Link>
        <button
          type="button"
          disabled={switching}
          onClick={() => void switchTo(verdict === "up" ? "down" : "up")}
          className="text-on-surface-variant underline underline-offset-2 disabled:opacity-60"
        >
          {pick(MATCH_FEEDBACK_SWITCH)}
        </button>
      </p>
    </div>
  );
}
