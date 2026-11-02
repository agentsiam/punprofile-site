import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";
import { parseCalEvent, verifyCalSignature } from "../src/lib/calBooking";

// TASK-004: mounts the auth HTTP endpoints (sign-in, token refresh) on the
// deployment's .site domain.
const http = httpRouter();
auth.addHttpRoutes(http);

/**
 * Cal.com's booking webhook. `prd.md` section 8. The secret is the
 * deployment's CALCOM_WEBHOOK_SECRET, set by Paul in the Convex dashboard and
 * typed by him into Cal.com; it is never in the repo. Without it, or without a
 * matching signature, nothing is written. Cal.com's ping test, which may come
 * unsigned, gets a 200 and writes nothing.
 */
http.route({
  path: "/calcom-webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const raw = await req.text();
    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return new Response("Bad JSON", { status: 400 });
    }
    const trigger = (body as { triggerEvent?: unknown } | null)?.triggerEvent;
    const ok = await verifyCalSignature(raw, req.headers.get("x-cal-signature-256"), process.env.CALCOM_WEBHOOK_SECRET);
    if (!ok) {
      if (trigger === "PING") return new Response("pong", { status: 200 });
      return new Response("Signature does not verify", { status: 401 });
    }
    const parsed = parseCalEvent(body);
    if (parsed.kind === "invalid") return new Response(`Unreadable event: ${parsed.why}`, { status: 400 });
    if (parsed.kind === "ignored") return new Response("Ignored", { status: 200 });
    const result = await ctx.runMutation(internal.bookingWebhook.apply, { event: parsed.event });
    return new Response(JSON.stringify(result), { status: 200, headers: { "content-type": "application/json" } });
  }),
});

export default http;
