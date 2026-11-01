"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import AdminGate, { DEV_ADMIN_BYPASS } from "@/components/AdminGate";
import LeadList from "@/components/features/dashboard/LeadList";
import ConsultationQueues from "@/components/features/dashboard/ConsultationQueues";
import DeliveryQueue from "@/components/features/dashboard/DeliveryQueue";
import BookingCutReadout from "@/components/features/dashboard/BookingCutReadout";

/**
 * TASK-004/034: the authenticated admin shell and the lead list.
 *
 * Proxy redirects anonymous visitors to /login before this renders, and
 * `AdminGate` is the belt-and-braces fallback for a stale session. Neither is
 * the security boundary: `requireAdmin` in `convex/leads.ts` is, because a
 * direct call to a Convex query never passes through either of them.
 *
 * **Width, 24/08/2026.** The shell was `max-w-3xl`, 48rem, while the lead table
 * declares `min-w-[52rem]` and now more, so the one screen this app exists to be
 * worked in was permanently horizontally scrolled on a display with room to
 * spare. The shell is wide now and the two readouts are pinned back to 48rem
 * inside it: they are prose and short lists, and prose set 100rem wide is worse
 * than prose set narrow, whereas a table is better wide. This is the site's only
 * wide page, and it is not a candidate surface.
 */
export default function AdminPage() {
  const { signOut } = useAuthActions();
  return (
    <div className="flex flex-1 flex-col items-center gap-4 px-4 py-10 text-center leading-normal sm:px-6">
      <div className="w-full max-w-[108rem] text-left">
        <AdminGate>
          {/* Dark title band and full width, 01/11/2026: the same frame as the
              candidate dashboard, and the three working blocks side by side
              instead of a narrow column with the right half empty. */}
          <div className="flex items-center justify-between gap-4 rounded-extra-large bg-canvas-dark px-6 py-6 medium:px-8">
            <h1 className="text-headline-large text-primary-active">Coach dashboard</h1>
            {/* Nothing to sign out of when the session was never required. */}
            {!DEV_ADMIN_BYPASS && (
              <button
                onClick={() => void signOut()}
                className="shrink-0 rounded-full border border-primary-active px-5 py-2 text-label-large text-primary-active"
              >
                Sign out
              </button>
            )}
          </div>
          {/* First: these people have paid. What is owed to them outranks
              everything that is still a prospect. */}
          <div className="mt-6">
            <DeliveryQueue />
          </div>
          <div className="mt-6 grid gap-6 large:grid-cols-2 large:items-start">
            <ConsultationQueues />
            <BookingCutReadout />
          </div>
          <div className="mt-8">
            <LeadList />
          </div>
        </AdminGate>
      </div>
    </div>
  );
}
