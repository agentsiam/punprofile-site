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

import { internalQuery, type QueryCtx, type MutationCtx } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
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
