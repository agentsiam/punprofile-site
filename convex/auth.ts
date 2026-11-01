import { convexAuth, retrieveAccount } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { ConvexCredentials } from "@convex-dev/auth/providers/ConvexCredentials";
import { Scrypt } from "lucia";
import { ConvexError } from "convex/values";
import { adminEmails, isAdminEmail } from "./adminEmails";
import { internal } from "./_generated/api";
import { clearHeldCodes, liveGrant, normaliseEmail } from "./candidateAccess";
import { STATIC_PROVIDER } from "./candidateCode";

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
 * `lifecycle-data-model.md` § 10 went to option (b).** Email and a permanent
 * six-digit code (01/11/2026; before that, a fresh code per sign-in). Only an
 * address a coach has granted (`candidateAccess`) is given a code, and only an
 * admin or a granted address gets a session.
 * Admin data is still guarded by `requireAdmin` alone, which a candidate never
 * passes.
 */

/**
 * Email and the candidate's permanent code, decided 01/11/2026. The code is the
 * account secret, scrypt-hashed like a password, and made and emailed by
 * `candidateCode.ts` when a coach grants access. Convex Auth rate-limits wrong
 * codes per account. An address without a live grant never authorises, and
 * `beforeSessionCreation` checks the grant again.
 */
const CandidateStatic = ConvexCredentials({
  id: STATIC_PROVIDER,
  authorize: async (credentials, ctx) => {
    const email = normaliseEmail(String(credentials.email ?? ""));
    const code = String(credentials.code ?? "").replace(/\D/g, "");
    if (!email || code.length !== 6) return null;
    if (!(await ctx.runQuery(internal.candidateAccess.isGranted, { email }))) return null;
    try {
      const { user } = await retrieveAccount(ctx, { provider: STATIC_PROVIDER, account: { id: email, secret: code } });
      return { userId: user._id };
    } catch (e) {
      // Convex Auth throws "TooManyFailedAttempts" once the hourly limit is
      // spent; the page says so rather than "wrong code" again.
      if (e instanceof Error && e.message.includes("TooManyFailedAttempts")) throw new ConvexError("locked");
      return null;
    }
  },
  crypto: {
    async hashSecret(secret: string) {
      return await new Scrypt().hash(secret);
    },
    async verifySecret(secret: string, hash: string) {
      return await new Scrypt().verify(hash, secret);
    },
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
    CandidateStatic,
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
