#!/usr/bin/env node
/**
 * TASK-004, one-time key setup. Run from the repo root on the machine that is
 * logged in to Convex:
 *
 *   node scripts/setup-auth.mjs
 *
 * Generates a fresh RS256 keypair PER DEPLOYMENT (dev and prod each get their
 * own) and sets every env var Convex Auth needs, straight through the Convex
 * CLI. Private keys never print and never leave this machine.
 *
 * Safe to re-run: it simply rotates the keys, which signs the admin out
 * everywhere until the next sign-in. That property is also the recovery path
 * if a key is ever exposed: re-run, and the exposed one signs nothing. It does
 * not touch SITE_URL on the deployment the live site reads, for the reason
 * written beside PROD_SITE_URL below.
 *
 * **Never run `npx convex env list` to check this worked.** It prints every
 * value in full, including JWT_PRIVATE_KEY, so a routine "did that land?"
 * check dumps the deployment's signing key into a terminal buffer, a
 * screenshot, or a pasted chat message. Confirmed the hard way on 14/08/2026.
 * List names only:
 *
 *   npx convex env list --prod | grep -oE '^[A-Z_]+=' | tr -d '='
 */
import { exportJWK, exportPKCS8, generateKeyPair } from "jose";
import { execFileSync } from "node:child_process";

// The allowlist, comma-separated. Everyone here may create an account and open
// /admin; see `convex/adminEmails.ts`. Override for a one-off run with
// `ADMIN_EMAILS="a@x.com,b@y.com" node scripts/setup-auth.mjs`.
const ADMIN_EMAILS =
  process.env.ADMIN_EMAILS ??
  "paul.bussabong@gmail.com,tatiyadoyle9@gmail.com";
// Separate on purpose: this one address receives the new-lead alert from
// `convex/notify.ts`. Adding an admin does not change who gets emailed.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "paul.bussabong@gmail.com";
// Changed 14/08/2026 when punprofile.vercel.app was claimed. This must match
// the address candidates actually visit: Convex Auth builds its redirects from
// SITE_URL, so a mismatch breaks admin sign-in on the domain being published
// while still working on the old one, which is the confusing way round.
// punprofile-profile-app.vercel.app stays alive and serves the same
// deployment, it is just no longer the address anything refers to.
// Since 07/09/2026 the primary domain is punprofile.app and the old
// vercel.app addresses 308 to it, so this follows the domain.
const PROD_SITE_URL = "https://punprofile.app";
// There is no DEV_SITE_URL any more, and this is the reason.
//
// `quiet-mule-251` is the deployment the Convex CLI calls dev, and it is also
// the one the live site reads: the deployed bundle builds its client from
// `https://quiet-mule-251.eu-west-1.convex.cloud`. One deployment cannot hold
// two values of SITE_URL, and two things read it to build links that reach
// real people: the new-lead alert in `convex/notify.ts` and the marketing mail
// in `convex/marketingSend.ts`, the unsubscribe link included. A localhost
// value there puts localhost links in somebody's inbox.
//
// So this script no longer writes SITE_URL to anything but prod. Paul's call:
// it stays `https://punprofile.app` on both. The price is that admin sign-in
// from a laptop redirects to the live site, because Convex Auth builds its
// redirects from the same value.

function setEnv(name, value, prod) {
  const args = ["convex", "env", "set"];
  if (prod) args.push("--prod");
  // `--` ends option parsing, and it is not optional here. A PKCS#8 private
  // key begins `-----BEGIN PRIVATE KEY-----`, which the CLI's argument parser
  // reads as an unknown option and rejects with `error: unknown option`,
  // printing the whole key to the terminal as it complains. Found on
  // 14/08/2026, the first time this script ran against a real deployment.
  args.push("--", name, value);
  // stdout inherited so Convex's own confirmation lines show; values are
  // passed as arguments, not echoed.
  execFileSync("npx", args, { stdio: ["ignore", "inherit", "inherit"] });
}

async function configure(prod) {
  const label = prod ? "prod" : "dev";
  const { privateKey, publicKey } = await generateKeyPair("RS256", {
    extractable: true,
  });
  const pkcs8 = await exportPKCS8(privateKey);
  const jwk = await exportJWK(publicKey);
  const jwks = JSON.stringify({ keys: [{ use: "sig", ...jwk }] });

  setEnv("JWT_PRIVATE_KEY", pkcs8, prod);
  setEnv("JWKS", jwks, prod);
  setEnv("ADMIN_EMAILS", ADMIN_EMAILS, prod);
  setEnv("ADMIN_EMAIL", ADMIN_EMAIL, prod);
  // Only prod, and only because a fresh prod deployment has no value at all.
  // On the deployment the live site reads, SITE_URL is left exactly as it is:
  // rotating a key must never silently repoint the links inside email.
  if (prod) setEnv("SITE_URL", PROD_SITE_URL, prod);
  console.log(`[${label}] auth environment configured.`);
}

await configure(false);
try {
  await configure(true);
} catch {
  console.log(
    "[prod] could not configure yet (production deployment not provisioned). " +
      "Re-run this script after the first `npx convex deploy` and it will complete.",
  );
}
