import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { Email } from "@convex-dev/auth/providers/Email";
import { ConvexError } from "convex/values";
import { adminEmails, isAdminEmail } from "./adminEmails";
import { internal } from "./_generated/api";
import { clearHeldCodes, liveGrant, normaliseEmail } from "./candidateAccess";

/**
 * TASK-004: coach authentication, allowlisted.
 *
 * Password sign-in, with account creation gated to the admin allowlist. The
 * gate lives in `profile`, which runs when an account would be created, so
 * there is no public sign-up path at all rather than a hidden one. Candidates
 * are never users; they are `leads` reached by magic link (Phase 2), which is
 * a separate mechanism on purpose.
 *
 * The allowlist is `ADMIN_EMAILS`, a Convex deployment env var set by
 * `scripts/setup-auth.mjs`. It is read through `adminEmails.ts` rather than
 * here, so this gate and `requireAdmin` in `leads.ts` can never disagree about
 * who is allowed in. Two admins as of 20/08/2026; the shape does not care how
 * many.
 *
 * **Candidates sign in too, since the account decision in
 * `lifecycle-data-model.md` § 10 went to option (b).** Email and a six-digit
 * code, no password. Only an address a coach has granted (`candidateAccess`)
 * is ever sent a code, and only an admin or a granted address gets a session.
 * Admin data is still guarded by `requireAdmin` alone, which a candidate never
 * passes.
 */

const CODE_MINUTES = 15;

/** Six digits from the platform's CSPRNG, rejection-sampled so no digit is favoured. */
async function sixDigits(): Promise<string> {
  const buf = new Uint32Array(1);
  const limit = Math.floor(0xffffffff / 1_000_000) * 1_000_000;
  for (;;) {
    crypto.getRandomValues(buf);
    if (buf[0] < limit) return String(buf[0] % 1_000_000).padStart(6, "0");
  }
}

const CandidateCode = Email({
  id: "candidate-code",
  maxAge: CODE_MINUTES * 60,
  generateVerificationToken: sixDigits,
  normalizeIdentifier: normaliseEmail,
  // Convex Auth passes the action ctx as a second argument; Auth.js's type for
  // this hook does not know that, hence the rest parameter.
  async sendVerificationRequest({ identifier, token }: { identifier: string; token: string }, ...rest: unknown[]) {
    const ctx = rest[0];
    // Silently do nothing for an address nobody granted. The form says "if this
    // address has access, a code is on its way" either way, so it cannot be used
    // to find out who is a client, or to mail strangers.
    const runQuery = (ctx as unknown as { runQuery: (f: unknown, a: unknown) => Promise<boolean> }).runQuery;
    if (!(await runQuery(internal.candidateAccess.isGranted, { email: identifier }))) return;

    // Local development: no mail goes out, the code goes to the deployment log.
    if (process.env.DEV_LOG_SIGNIN_CODES === "1") {
      console.log(`candidate-code for ${identifier}: ${token}`);
      return;
    }

    const key = process.env.RESEND_API_KEY;
    const from = process.env.MAIL_FROM;
    if (!key || !from) {
      // No sender yet (parked by Paul, 30/10/2026). Hold the code for the coach
      // to pass on by LINE instead; the Candidate 360 shows it for fifteen
      // minutes. The moment both variables are set, this branch stops running.
      const runMutation = (ctx as { runMutation: (f: unknown, a: unknown) => Promise<unknown> }).runMutation;
      await runMutation(internal.candidateAccess.holdCode, {
        email: identifier,
        code: token,
        expiresAt: Date.now() + CODE_MINUTES * 60 * 1000,
      });
      return;
    }
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: identifier,
        subject: `รหัสเข้าสู่ระบบ PunProfile: ${token}`,
        text:
          `รหัสเข้าสู่ระบบ PunProfile ของคุณคือ ${token}\n\n` +
          `ใช้ได้ภายใน ${CODE_MINUTES} นาที ถ้าคุณไม่ได้ขอรหัสนี้ ไม่ต้องทำอะไรครับ\n\n` +
          `Your PunProfile sign-in code is ${token}. It works for ${CODE_MINUTES} minutes.`,
      }),
    });
    if (!res.ok) {
      console.error(`candidate-code send failed: ${res.status} ${await res.text()}`);
      throw new ConvexError("code_not_sent");
    }
  },
});
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        const email = String(params.email ?? "").trim().toLowerCase();
        // Distinct causes, distinct errors. These previously shared one
        // message, so a deployment with no admin address set was
        // indistinguishable from someone typing the wrong one, and both were
        // reported by the UI as the latter.
        if (adminEmails().length === 0) throw new ConvexError("admin_email_unset");
        if (!isAdminEmail(email)) throw new ConvexError("not_admin_email");
        return { email };
      },
    }),
    CandidateCode,
  ],
  callbacks: {
    async beforeSessionCreation(ctx, { userId }) {
      const user = await ctx.db.get(userId);
      const email = typeof user?.email === "string" ? normaliseEmail(user.email) : "";
      if (email && isAdminEmail(email)) return;
      // The QueryCtx type is the app's; the callback's ctx is a generic mutation
      // ctx over the same deployment.
      const grant = email
        ? await liveGrant(ctx as unknown as Parameters<typeof liveGrant>[0], email)
        : null;
      if (!grant) throw new ConvexError("no_access");
      await ctx.db.patch(grant._id, { lastSignInAt: Date.now() });
      await clearHeldCodes(ctx as unknown as Parameters<typeof clearHeldCodes>[0], email);
    },
  },
});
