"use client";

/**
 * The lead's Delivery page, the first of the two and the one a coach opens by
 * habit. `prd.md` § 8, "Screen: Lead, the Delivery page".
 *
 * It answers what the next thing to do for this person is, and holds the work
 * that does it. In order: the Situation panel, the ladder with the next step,
 * the release being assembled under the rung that delivers it, and the running
 * state beside them.
 *
 * Unlike the Session tab it replaces, this page is not read-only: the ladder's
 * current rung is where the coach works.
 */

import type { Id } from "../../../../convex/_generated/dataModel";
import SituationPanel from "./SituationPanel";
import MilestoneLadder from "./MilestoneLadder";
import RunningState from "./RunningState";

export default function DeliveryPage({
  leadId,
  onOpenRecord,
}: {
  leadId: Id<"leads">;
  /** Three steps are done in the call log, which the Record page holds. */
  onOpenRecord: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* First on the page. Every candidate-facing draft is written from this
          panel plus the event that triggered it and from nothing else. */}
      <SituationPanel leadId={leadId} />

      {/* The running state is beside the ladder, not on it. Two columns at
          `large:`, which is where this repo's pages take their columns. */}
      <div className="grid gap-x-10 gap-y-6 large:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] large:items-start">
        <MilestoneLadder leadId={leadId} onOpenRecord={onOpenRecord} />
        <RunningState leadId={leadId} />
      </div>
    </div>
  );
}
