"use client";

/**
 * Candidate sign-in: email, then a six-digit code. No password, no sign-up.
 * `convex/auth.ts` only mails a code to an address a coach granted, so the
 * form says the same thing whether or not the address has access.
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
  const [step, setStep] = useState<"email" | "code">("email");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<Copy | null>(null);

  const send = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return;
    setBusy(true);
    setError(null);
    try {
      await signIn("candidate-code", { email: email.trim().toLowerCase() });
      setStep("code");
    } catch {
      setError(C.ERROR_GENERIC);
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    setBusy(true);
    setError(null);
    try {
      await signIn("candidate-code", { email: email.trim().toLowerCase(), code: code.trim() });
    } catch {
      setError(C.SIGNIN_BAD_CODE);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-6 py-16">
      <h1 className="text-headline-sm text-ink">{pick(C.SIGNIN_HEADING)}</h1>
      <p className="mt-3 text-body-large text-on-surface-variant">{pick(C.SIGNIN_BODY)}</p>

      {step === "email" ? (
        <form
          className="mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            void send();
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
          <button type="submit" disabled={busy} className="mt-5 h-12 w-full btn-filled px-6 text-label-large">
            {pick(C.SIGNIN_SEND)}
          </button>
        </form>
      ) : (
        <form
          className="mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            void verify();
          }}
        >
          <p className="text-body-medium text-on-surface-variant">{pick(C.SIGNIN_SENT)}</p>
          <p className="mt-1 text-body-medium text-ink">{email}</p>
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
          <button type="submit" disabled={busy || code.length !== 6} className="mt-5 h-12 w-full btn-filled px-6 text-label-large">
            {pick(C.SIGNIN_VERIFY)}
          </button>
          <div className="mt-4 flex justify-between">
            <button type="button" className="text-body-medium text-ink-deep underline" onClick={() => void send()}>
              {pick(C.SIGNIN_RESEND)}
            </button>
            <button
              type="button"
              className="text-body-medium text-ink-deep underline"
              onClick={() => {
                setStep("email");
                setCode("");
              }}
            >
              {pick(C.SIGNIN_OTHER_EMAIL)}
            </button>
          </div>
        </form>
      )}
      {error && <p className="field-support-error mt-4">{pick(error)}</p>}
    </div>
  );
}
