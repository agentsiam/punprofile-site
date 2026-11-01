"use client";

/**
 * Candidate sign-in: email and their permanent six-digit code, in one step.
 * The code was emailed once when the coach opened their page
 * (`convex/candidateCode.ts`); a lost code is replaced by the coach, so the
 * page sends them to LINE rather than offering a reset of its own.
 *
 * The error never says whether the address has access, only that the pair does
 * not match, so the form cannot be used to find out who is a client.
 */

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useCopy } from "@/components/LocaleProvider";
import type { Copy } from "@/lib/content/copy";
import * as C from "@/lib/content/portal";

export default function SignIn() {
  const { pick } = useCopy();
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<Copy | null>(null);

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && code.length === 6;

  const submit = async () => {
    if (!valid) return;
    setBusy(true);
    setError(null);
    try {
      // A wrong pair does not throw: Convex Auth answers signingIn: false.
      const { signingIn } = await signIn("candidate-static", { email: email.trim().toLowerCase(), code });
      if (!signingIn) setError(C.SIGNIN_BAD_CODE);
    } catch (e) {
      setError(String(e).includes("locked") ? C.SIGNIN_LOCKED : C.SIGNIN_BAD_CODE);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-6 py-16">
      <h1 className="text-headline-sm text-ink">{pick(C.SIGNIN_HEADING)}</h1>
      <p className="mt-3 text-body-large text-on-surface-variant">{pick(C.SIGNIN_BODY)}</p>

      <form
        className="mt-6"
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <label className="field-label block">
          {pick(C.SIGNIN_EMAIL)}
          <input
            type="email"
            autoComplete="email"
            required
            className="field mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="field-label mt-4 block">
          {pick(C.SIGNIN_CODE)}
          <input
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            required
            className="field mt-1 tracking-[0.4em]"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          />
        </label>
        <button type="submit" disabled={busy || !valid} className="mt-5 h-12 w-full btn-filled px-6 text-label-large">
          {pick(C.SIGNIN_VERIFY)}
        </button>
      </form>
      {error && <p className="field-support-error mt-4">{pick(error)}</p>}
      <p className="mt-6 text-body-medium text-on-surface-variant">{pick(C.SIGNIN_LOST)}</p>
    </div>
  );
}
