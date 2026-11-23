/**
 * Send the retake email to the admin address, to see it in a real inbox.
 *
 * **It takes no recipient.** The address comes from `ADMIN_EMAIL` on the
 * deployment, which is where `notify.ts` already sends new-lead alerts, so this
 * reaches somebody this system emails anyway and there is no argument that could
 * point it at a candidate. That is the same property `marketingSend`'s `only`
 * argument protects, and the reason it filters the consented list rather than
 * replacing it: nothing here should be able to name a recipient it would not
 * otherwise have reached.
 *
 * It is a test of the frame, not of the campaign. Whether the retake email may
 * be sent to the 78 at all is the consent question, which is unsettled and lives
 * nowhere near this file.
 *
 *   npx convex run retakeTest:send '{"name":"มายด์"}'
 *
 * A run without `--prod` reaches `quiet-mule-251`, which is the deployment the
 * live site reads and the one holding the real sender.
 */

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { retakeEmailHtml, retakeEmailSubject, retakeEmailText } from "./retakeEmail";

export const send = internalAction({
  args: {
    /** What fills `{ชื่อ}`. Pass nothing to see the no-name greeting that ships. */
    name: v.optional(v.string()),
  },
  handler: async (_ctx, args): Promise<{ sent: boolean; reason?: string }> => {
    const key = process.env.RESEND_API_KEY;
    const from = process.env.MAIL_FROM;
    const to = process.env.ADMIN_EMAIL;

    // Refuse loudly and name which one is missing, rather than half-sending.
    for (const [label, value] of [
      ["RESEND_API_KEY", key],
      ["MAIL_FROM", from],
      ["ADMIN_EMAIL", to],
    ] as const) {
      if (!value) {
        const reason = `${label} is not set on this deployment, so nothing was sent.`;
        console.warn(`retakeTest.send refused: ${reason}`);
        return { sent: false, reason };
      }
    }

    const name = args.name?.trim() || null;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        // The close of this email asks for a reply, and `MAIL_FROM` is a
        // no-reply address on a domain with no MX records, so without this
        // every reply bounces.
        ...(process.env.MAIL_REPLY_TO ? { reply_to: process.env.MAIL_REPLY_TO } : {}),
        subject: retakeEmailSubject,
        text: retakeEmailText(name),
        html: retakeEmailHtml(name),
      }),
    });

    if (!res.ok) {
      const reason = `Resend returned ${res.status}: ${await res.text()}`;
      console.warn(`retakeTest.send failed: ${reason}`);
      return { sent: false, reason };
    }
    console.log(`retakeTest.send: sent the retake email to the admin address, greeting ${name ? "filled" : "empty"}`);
    return { sent: true };
  },
});
