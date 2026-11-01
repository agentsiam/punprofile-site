/**
 * Candidate sign-in, the access side. `lifecycle-data-model.md` § 10 (b).
 *
 * A candidate is a `users` row created by Convex Auth's email-code provider
 * plus a live `candidateAccess` grant naming their lead. Both halves are
 * required: a code is only mailed to a granted address (`sendCode` in
 * `auth.ts` asks `isGranted` first), and a session is only created for an
 * admin or a granted address (`beforeSessionCreation`).
 *
 * `requireAdmin` in `leads.ts` is unchanged and still the only door to coach
 * data. A signed-in candidate is not on the admin list, so every admin query
 * refuses them exactly as it refuses a stranger.
 */

import { internalMutation, internalQuery, type QueryCtx, type MutationCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { isAdminEmail } from "./adminEmails";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const normaliseEmail = (e: string) => e.trim().toLowerCase();

export async function liveGrant(ctx: QueryCtx, email: string): Promise<Doc<"candidateAccess"> | null> {
  const rows = await ctx.db
    .query("candidateAccess")
    .withIndex("by_email", (q) => q.eq("email", normaliseEmail(email)))
    .collect();
  // Newest live grant wins. Two live grants for one address would mean a coach
  // granted the same email on two leads; the newest is the deliberate one.
  return rows.filter((r) => r.revokedAt === undefined).sort((a, b) => b.grantedAt - a.grantedAt)[0] ?? null;
}

/** Asked by the email provider before it sends anything. */
export const isGranted = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => (await liveGrant(ctx, args.email)) !== null,
});

/**
 * The signed-in candidate's lead, or why there is none. Never throws, so a
 * page can tell "signed out" from "signed in but not given access".
 */
export async function signedInCandidate(
  ctx: QueryCtx | MutationCtx,
): Promise<
  | { state: "signed_out" }
  | { state: "no_access"; email: string }
  | { state: "candidate"; lead: Doc<"leads">; grant: Doc<"candidateAccess"> }
> {
  const userId = await getAuthUserId(ctx);
  if (!userId) return { state: "signed_out" };
  const user = await ctx.db.get(userId);
  const email = typeof user?.email === "string" ? user.email : "";
  if (!email) return { state: "no_access", email: "" };
  const grant = await liveGrant(ctx, email);
  if (!grant) return { state: "no_access", email };
  const lead = await ctx.db.get(grant.leadId);
  if (!lead) return { state: "no_access", email };
  return { state: "candidate", lead, grant };
}

/**
 * Hold a code for the coach to send on LINE, when no mail sender is set.
 * One live code per address: a new request replaces the old one.
 */
export const holdCode = internalMutation({
  args: { email: v.string(), code: v.string(), expiresAt: v.number() },
  handler: async (ctx, args) => {
    const email = normaliseEmail(args.email);
    if (!(await liveGrant(ctx, email))) return;
    const old = await ctx.db
      .query("pendingSignInCodes")
      .withIndex("by_email", (q) => q.eq("email", email))
      .collect();
    for (const o of old) await ctx.db.delete(o._id);
    await ctx.db.insert("pendingSignInCodes", { email, code: args.code, expiresAt: args.expiresAt, at: Date.now() });
  },
});

/** Drop any held code for this address. Called on sign-in and on erasure. */
export async function clearHeldCodes(ctx: MutationCtx, email: string) {
  const rows = await ctx.db
    .query("pendingSignInCodes")
    .withIndex("by_email", (q) => q.eq("email", normaliseEmail(email)))
    .collect();
  for (const r of rows) await ctx.db.delete(r._id);
}

/**
 * Remove the login behind a candidate's address, for erasure. Their sign-in
 * accounts (the permanent-code one and the older email-code one), anything
 * hanging off them, and the user itself once it has no other way in. An admin
 * user is never touched: a coach's own address is not a candidate's.
 * Returns how many auth rows went, for the deletion log's own arithmetic.
 */
export async function removeCandidateLogin(ctx: MutationCtx, email: string): Promise<number> {
  const id = normaliseEmail(email);
  let removed = 0;
  const userIds = new Set<Id<"users">>();
  for (const provider of ["candidate-static", "candidate-code"]) {
    const accounts = await ctx.db
      .query("authAccounts")
      .withIndex("providerAndAccountId", (q) => q.eq("provider", provider).eq("providerAccountId", id))
      .collect();
    for (const a of accounts) {
      userIds.add(a.userId);
      for (const c of await ctx.db.query("authVerificationCodes").withIndex("accountId", (q) => q.eq("accountId", a._id)).collect()) {
        await ctx.db.delete(c._id);
        removed++;
      }
      for (const r of await ctx.db.query("authRateLimits").withIndex("identifier", (q) => q.eq("identifier", a._id)).collect()) {
        await ctx.db.delete(r._id);
        removed++;
      }
      await ctx.db.delete(a._id);
      removed++;
    }
  }
  for (const userId of userIds) {
    const user = await ctx.db.get(userId);
    if (!user || (typeof user.email === "string" && isAdminEmail(user.email))) continue;
    const others = await ctx.db.query("authAccounts").withIndex("userIdAndProvider", (q) => q.eq("userId", userId)).first();
    if (others) continue;
    for (const s of await ctx.db.query("authSessions").withIndex("userId", (q) => q.eq("userId", userId)).collect()) {
      for (const t of await ctx.db.query("authRefreshTokens").withIndex("sessionId", (q) => q.eq("sessionId", s._id)).collect()) {
        await ctx.db.delete(t._id);
        removed++;
      }
      await ctx.db.delete(s._id);
      removed++;
    }
    await ctx.db.delete(userId);
    removed++;
  }
  return removed;
}
