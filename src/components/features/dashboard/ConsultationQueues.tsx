"use client";

/**
 * What is due, across every lead. `booking-tracking.md`, 22/08/2026.
 *
 * Nothing sends the LINE reminder or the same-day follow-up, so both are
 * messages the coach has to remember to write. Until this panel existed the
 * only record of an unsent one was a missing field on a row inside one
 * candidate's page, which cannot be a trigger list: reading it means already
 * knowing whose page to open, and the whole failure mode is the person nobody
 * thought of. Four buckets, ordered by what it costs to miss one:
 *
 * 1. **Reminder due.** A booked slot inside 48 hours with no reminder written.
 *    The only bucket whose failure costs a real call rather than a data field.
 * 2. **Follow-up due.** A held call with no same-day message.
 * 3. **Outcome missing.** The slot has passed and the row still says
 *    scheduled, so nobody has said whether they turned up. The wave 1 cut is
 *    untestable for exactly as long as this sits here.
 * 4. **Never booked.** Invited a fortnight ago, no slot chosen. Chase it or
 *    mark it expired; leaving it invited reads as still live.
 *
 * Empty buckets do not render, and an empty panel says so in one line rather
 * than showing four empty headings. Nothing here is clickable except the lead:
 * every one of these is finished by writing a message and then ticking the box
 * on the call itself, and a tick here would let the box be ticked without the
 * message being sent.
 */

import { madridDaysBetween } from "@/lib/sessionTime";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { api } from "../../../../convex/_generated/api";

/** Local time, DD/MM/YYYY, per the house date rule and to match the call log. */
const stamp = (ms: number) =>
  new Date(ms).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/** Calendar days in Madrid, where Paul works: a call held at 15:00 yesterday
 *  is "yesterday" this morning, not "today" because 24 hours have not passed. */
function daysAgo(ms: number): string {
  const days = madridDaysBetween(ms, Date.now());
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

/** Hours until, for the one bucket where the question is how soon, not how late. */
function hoursUntil(ms: number): string {
  const hours = Math.round((ms - Date.now()) / 3600000);
  if (hours <= 0) return "now";
  if (hours < 24) return `in ${hours}h`;
  return `in ${Math.round(hours / 24)} day${Math.round(hours / 24) === 1 ? "" : "s"}`;
}

type Queues = NonNullable<ReturnType<typeof useConsultationQueues>>;
type Row = Queues["reminder"][number];

function useConsultationQueues() {
  return useQuery(api.consultations.queues, {});
}

function Bucket({
  title,
  why,
  rows,
  detail,
}: {
  title: string;
  why: string;
  rows: Row[];
  detail: (row: Row) => string;
}) {
  if (rows.length === 0) return null;
  return (
    <div className="mt-5 first:mt-0">
      <h3 className="text-label-large text-on-surface">
        {title} ({rows.length})
      </h3>
      <p className="mt-0.5 text-body-medium text-on-surface-variant">{why}</p>
      <ul className="mt-2 flex flex-col gap-1.5">
        {rows.map((row) => (
          <li key={row.consultationId} className="text-body-medium">
            <Link href={`/admin/leads/${row.leadId}`} className="text-ink-deep underline">
              {row.name}
            </Link>
            <span className="text-on-surface-variant"> {detail(row)}</span>
            {/* The reminder goes out on LINE. A row with no LINE id is not a
                message the coach can write, and finding that out on opening the
                lead is finding out too late. */}
            {!row.lineId && (
              <span className="text-on-surface-variant"> · no LINE id, email only</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Cal.com events the booking webhook could not place. `prd.md` section 8.
 * The one button here is honest in a way a tick on the buckets below would not
 * be: Paul logs the call by hand, or decides it needs nothing, and clearing
 * deletes the row, which holds the attendee's name and email and nothing else.
 */
function BookingsToPlace() {
  const rows = useQuery(api.bookingWebhook.inbox, {});
  const clear = useMutation(api.bookingWebhook.clearInbox);
  if (!rows || rows.length === 0) return null;
  return <BookingsToPlaceList rows={rows} onClear={(id) => void clear({ id })} />;
}

type InboxRow = NonNullable<FunctionReturnType<typeof api.bookingWebhook.inbox>>[number];

export function BookingsToPlaceList({ rows, onClear }: { rows: InboxRow[]; onClear: (id: InboxRow["_id"]) => void }) {
  const what = { BOOKING_CREATED: "Booked", BOOKING_RESCHEDULED: "Rescheduled", BOOKING_CANCELLED: "Cancelled" } as const;
  return (
    <div className="mb-5">
      <h3 className="text-label-large text-on-surface">Bookings to place ({rows.length})</h3>
      <p className="mt-0.5 text-body-medium text-on-surface-variant">
        Cal.com sent these and the app could not place them. Log the call by hand if it needs one, then clear it.
      </p>
      <ul className="mt-2 flex flex-col gap-1.5">
        {rows.map((r) => (
          <li key={r._id} className="text-body-medium">
            <span className="text-on-surface">{r.attendeeName ?? "No name"}</span>
            <span className="text-on-surface-variant">
              {" "}
              {r.attendeeEmail ? `· ${r.attendeeEmail} ` : ""}· {what[r.trigger]}, {stamp(r.startAt)}
              {r.lengthMinutes ? `, ${r.lengthMinutes} min` : ""} · {r.reason}
            </span>{" "}
            <button type="button" className="text-ink-deep underline" onClick={() => onClear(r._id)}>
              Clear
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ConsultationQueues() {
  const queues = useConsultationQueues();

  if (queues === undefined) return null;

  const total =
    queues.reminder.length +
    queues.followUp.length +
    queues.outcomeMissing.length +
    queues.staleInvite.length +
    queues.prepNotRequested.length +
    queues.prepMissing.length;

  return (
    <section className="rounded-large border border-outline-variant bg-surface px-6 py-5">
      <h2 className="text-title-medium text-on-surface">Consultations, what is due</h2>
      <BookingsToPlace />
      {total === 0 ? (
        <p className="mt-2 text-body-medium text-on-surface-variant">
          Nothing due. No reminder unsent, no follow-up unwritten, no call without an outcome.
        </p>
      ) : (
        <>
          <Bucket
            title="Reminder due"
            why="Booked inside 48 hours with no reminder written."
            rows={queues.reminder}
            detail={(row) => `· ${stamp(row.heldAt)}, ${hoursUntil(row.heldAt)}`}
          />
          <Bucket
            title="Follow-up due"
            why="Call held, same-day message not yet sent."
            rows={queues.followUp}
            detail={(row) => `· held ${stamp(row.heldAt)}, ${daysAgo(row.heldAt)}`}
          />
          <Bucket
            title="Outcome missing"
            why="The slot has passed and the row still says scheduled. Until this is answered the booking cut cannot be judged."
            rows={queues.outcomeMissing}
            detail={(row) => `· slot was ${stamp(row.heldAt)}, ${daysAgo(row.heldAt)}`}
          />
          <Bucket
            title="Preparation to request"
            why="A preview call is logged and its preparation request has not gone out on LINE. Send it with the /me link, then tick it on the call."
            rows={queues.prepNotRequested}
            detail={(row) => `· call ${stamp(row.heldAt)}, ${hoursUntil(row.heldAt)}`}
          />
          <Bucket
            title="Preparation missing"
            why="The preview's preparation was not in by 17:00 Madrid two weekdays before. The booking and tokens are unchanged; decide whether to reschedule."
            rows={queues.prepMissing}
            detail={(row) => `· call ${stamp(row.heldAt)}, ${hoursUntil(row.heldAt)}`}
          />
          <Bucket
            title="Never booked"
            why="Invited a fortnight or more ago, no slot chosen. Chase it, or mark it expired."
            rows={queues.staleInvite}
            detail={(row) => `· sent ${row.sentAt ? daysAgo(row.sentAt) : "date not recorded"}`}
          />
        </>
      )}
    </section>
  );
}
