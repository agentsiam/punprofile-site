/**
 * Send the retake email to the admin address, to see it in a real inbox.
 *
 * **It takes no recipient.** The address is built from `ADMIN_EMAIL` on the
 * deployment, which is where `notify.ts` already sends new-lead alerts, with a
 * `+test<tag>` added: Gmail delivers any plus-tag to the same mailbox, so the
 * tag sorts one test from another without naming anybody new. The tag is
 * stripped to lowercase letters, digits and hyphens, so nothing passed here can
 * reach outside that one mailbox, and there is no argument that could point this
 * at a candidate. That is the property `marketingSend`'s `only` argument protects
 * when it filters the consented list rather than replacing it.
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
    /** Sorts one test from another in the inbox. Defaults to the email's name. */
    tag: v.optional(v.string()),
  },
  handler: async (_ctx, args): Promise<{ sent: boolean; reason?: string }> => {
    const key = process.env.RESEND_API_KEY;
    const from = process.env.MAIL_FROM;
    const admin = process.env.ADMIN_EMAIL;

    /** Refuse loudly and name which one is missing, rather than half-sending. */
    const refuse = (label: string) => {
      const reason = `${label} is not set on this deployment, so nothing was sent.`;
      console.warn(`retakeTest.send refused: ${reason}`);
      return { sent: false, reason };
    };
    if (!key) return refuse("RESEND_API_KEY");
    if (!from) return refuse("MAIL_FROM");
    if (!admin) return refuse("ADMIN_EMAIL");

    /** `name@host` becomes `name+test<tag>@host`, and the tag cannot escape it. */
    const tag = (args.tag ?? "retake").toLowerCase().replace(/[^a-z0-9-]/g, "") || "retake";
    const to = admin.replace(/^([^@]+)@/, `$1+test${tag}@`);

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
    console.log(`retakeTest.send: sent to the admin mailbox tagged +test${tag}, greeting ${name ? "filled" : "empty"}`);
    return { sent: true };
  },
});
