"use client";

/**
 * `/me`, the paying candidate's own page. Outside both language trees like
 * `/admin`: it is behind a sign-in, never indexed (`robots.ts` closes `/me`,
 * the private layout sets `NOT_INDEXED`), and the locale comes from the
 * cookie, Thai by default.
 *
 * `portal.view` decides what this person may see from their session; this
 * page only picks the screen for the answer.
 */

import { useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../../../convex/_generated/api";
import { useCopy } from "@/components/LocaleProvider";
import CandidateApp from "@/components/features/portal/CandidateApp";
import SignIn from "@/components/features/portal/SignIn";
import * as C from "@/lib/content/portal";

export default function MyPage() {
  const { pick } = useCopy();
  const { signOut } = useAuthActions();
  const me = useQuery(api.portal.view, {});

  if (me === undefined) {
    return <p className="mx-auto max-w-md px-6 py-16 text-body-large text-on-surface-variant">{pick(C.LOADING)}</p>;
  }
  if (me.state === "signed_out") return <SignIn />;
  if (me.state === "candidate") return <CandidateApp data={me.data} onSignOut={() => void signOut()} />;

  return (
    <div className="mx-auto w-full max-w-md px-6 py-16">
      <h1 className="text-headline-sm text-ink">
        {pick(me.state === "coach" ? C.SIGNIN_HEADING : C.NO_ACCESS_HEADING)}
      </h1>
      <p className="mt-3 text-body-large text-on-surface-variant">
        {pick(me.state === "coach" ? C.COACH_HERE : C.NO_ACCESS_BODY)}
      </p>
      <button type="button" className="mt-6 text-body-medium text-ink-deep underline" onClick={() => void signOut()}>
        {pick(C.SIGN_OUT)}
      </button>
    </div>
  );
}
