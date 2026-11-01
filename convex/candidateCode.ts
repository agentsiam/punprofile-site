import { CODE_EMAIL_SUBJECT, codeEmailHtml } from "./codeEmail";
/**
 * The candidate's permanent sign-in code. Decided by Paul 01/11/2026: one code
 * per candidate, made when a coach grants access and sent once by email from
 * @punprofile.app; the candidate signs in at /me with email and code from then
 * on. A coach can send a new code, which replaces the old one.
 *
 * The code is stored only as a scrypt hash, as the secret of a Convex Auth
 * account under the `candidate-static` provider (see `auth.ts`). Convex Auth
 * rate-limits wrong codes per account, ten an hour, so six digits cannot be
 * guessed in any useful time. The plain code exists in memory here, in the
 * email, and nowhere else, except as below.
 *
 * Without a mail sender (`RESEND_API_KEY` and `MAIL_FROM` unset) the code is
 * held for the coach for 24 hours, on the Candidate 360, to pass on by LINE.
 * That is the only time a plain code is stored, and signing in clears it.
 */

import { internalAction, internalMutation, internalQuery, mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { v, ConvexError } from "convex/values";
import { createAccount, modifyAccountCredentials } from "@convex-dev/auth/server";
import { requireAdmin } from "./leads";
import { clearHeldCodes } from "./candidateAccess";

export const STATIC_PROVIDER = "candidate-static";
const HOLD_HOURS = 24;

/** Six digits from the platform's CSPRNG, rejection-sampled so no digit is favoured. */
export function sixDigits(): string {
  const buf = new Uint32Array(1);
  const limit = Math.floor(0xffffffff / 1_000_000) * 1_000_000;
  for (;;) {
    crypto.getRandomValues(buf);
    if (buf[0] < limit) return String(buf[0] % 1_000_000).padStart(6, "0");
  }
}

/** The live grant of a lead, with the first name for the email. */
export const grantForLead = internalQuery({
  args: { leadId: v.id("leads") },
  handler: async (ctx, { leadId }) => {
    const grant = (
      await ctx.db
        .query("candidateAccess")
        .withIndex("by_lead", (q) => q.eq("leadId", leadId))
        .collect()
    ).find((g) => g.revokedAt === undefined);
    if (!grant) return null;
    const lead = await ctx.db.get(leadId);
    return { grantId: grant._id, email: grant.email, firstName: lead?.firstName ?? null };
  },
});

export const recordDelivery = internalMutation({
  args: {
    grantId: v.id("candidateAccess"),
    delivery: v.union(v.literal("emailed"), v.literal("held"), v.literal("failed")),
    note: v.optional(v.string()),
  },
  handler: async (ctx, { grantId, delivery, note }) => {
    // An emailed code supersedes anything held for the coach from before.
    const grant = await ctx.db.get(grantId);
    if (grant && delivery === "emailed") await clearHeldCodes(ctx, grant.email);
    await ctx.db.patch(grantId, {
      codeIssuedAt: Date.now(),
      codeDelivery: delivery,
      codeDeliveryNote: note,
    });
  },
});

function emailText(firstName: string | null, email: string, code: string) {
  return [
    firstName ? `สวัสดีคุณ ${firstName}` : "สวัสดี",
    "",
    "แดชบอร์ดหางานของคุณพร้อมแล้ว ตำแหน่งที่คุณเล็งไว้ CV ของแต่ละตำแหน่ง งานที่ PunProfile คัดมาให้ และความคืบหน้าของทุกใบสมัคร รวมไว้ในที่เดียว",
    "",
    "เข้าสู่ระบบที่ https://punprofile.app/me",
    `อีเมลที่ใช้เข้าสู่ระบบ: ${email}`,
    `รหัสเข้าใช้งาน: ${code}`,
    "",
    "รหัสนี้ไม่เปลี่ยนและไม่มีวันหมดอายุ โปรดเก็บอีเมลฉบับนี้ไว้ หากไม่พบรหัส โปรดติดต่อ PunProfile ทาง LINE เพื่อรับรหัสใหม่",
    "",
    "---",
    "",
    firstName ? `Hello ${firstName},` : "Hello,",
    "",
    "Your Job Search Dashboard is ready. The roles you are targeting, the CV for each one, the jobs PunProfile picks for you and the progress of every application, all in one place.",
    "",
    "Sign in at https://punprofile.app/me",
    `Email: ${email}`,
    `Code: ${code}`,
    "",
    "The code does not change or expire, so keep this email. If you can't find it, contact PunProfile on LINE for a new one.",
  ].join("\n");
}

/**
 * Make a new code for the lead's live grant, store its hash, and deliver it.
 * Scheduled by `grantAccess` and by `sendNewCode`; never called by a client.
 */
export const issueCode = internalAction({
  args: { leadId: v.id("leads") },
  handler: async (ctx, { leadId }): Promise<void> => {
    const grant = await ctx.runQuery(internal.candidateCode.grantForLead, { leadId });
    if (!grant) return;
    const code = sixDigits();

    // Replace the secret if the account exists, else create it, linked to any
    // user who already signed in with this address by the old email-code way.
    try {
      await modifyAccountCredentials(ctx, { provider: STATIC_PROVIDER, account: { id: grant.email, secret: code } });
    } catch {
      await createAccount(ctx, {
        provider: STATIC_PROVIDER,
        account: { id: grant.email, secret: code },
        profile: { email: grant.email, emailVerified: true } as never,
        shouldLinkViaEmail: true,
      });
    }

    // A new code also lifts any lockout from wrong tries with the old one,
    // which is what the locked-out message promises.
    await ctx.runMutation(internal.candidateCode.clearLockout, { email: grant.email });

    const key = process.env.RESEND_API_KEY;
    const from = process.env.MAIL_FROM;
    if (!key || !from) {
      await ctx.runMutation(internal.candidateAccess.holdCode, {
        email: grant.email,
        code,
        expiresAt: Date.now() + HOLD_HOURS * 60 * 60 * 1000,
      });
      await ctx.runMutation(internal.candidateCode.recordDelivery, {
        grantId: grant.grantId,
        delivery: "held",
        note: "No mail sender set; shown to the coach for 24 hours.",
      });
      return;
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: grant.email,
        ...(process.env.MAIL_REPLY_TO ? { reply_to: process.env.MAIL_REPLY_TO } : {}),
        subject: CODE_EMAIL_SUBJECT,
        html: codeEmailHtml(grant.firstName, grant.email, code),
        text: emailText(grant.firstName, grant.email, code),
      }),
    });
    if (res.ok) {
      await ctx.runMutation(internal.candidateCode.recordDelivery, { grantId: grant.grantId, delivery: "emailed" });
      return;
    }
    // A failed send must not strand the candidate: hold it for the coach too.
    const why = `${res.status} ${(await res.text()).slice(0, 200)}`;
    console.error(`candidate code email failed: ${why}`);
    await ctx.runMutation(internal.candidateAccess.holdCode, {
      email: grant.email,
      code,
      expiresAt: Date.now() + HOLD_HOURS * 60 * 60 * 1000,
    });
    await ctx.runMutation(internal.candidateCode.recordDelivery, {
      grantId: grant.grantId,
      delivery: "failed",
      note: why,
    });
  },
});

export const clearLockout = internalMutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const account = await ctx.db
      .query("authAccounts")
      .withIndex("providerAndAccountId", (q) => q.eq("provider", STATIC_PROVIDER).eq("providerAccountId", email))
      .unique();
    if (!account) return;
    for (const r of await ctx.db.query("authRateLimits").withIndex("identifier", (q) => q.eq("identifier", account._id)).collect()) {
      await ctx.db.delete(r._id);
    }
  },
});

/** The coach's "Send a new code" button. The old code stops working. */
export const sendNewCode = mutation({
  args: { leadId: v.id("leads") },
  handler: async (ctx, { leadId }) => {
    await requireAdmin(ctx);
    const live = (
      await ctx.db
        .query("candidateAccess")
        .withIndex("by_lead", (q) => q.eq("leadId", leadId))
        .collect()
    ).find((g) => g.revokedAt === undefined);
    if (!live) throw new ConvexError("Give them access first.");
    await ctx.scheduler.runAfter(0, internal.candidateCode.issueCode, { leadId: leadId as Id<"leads"> });
  },
});
