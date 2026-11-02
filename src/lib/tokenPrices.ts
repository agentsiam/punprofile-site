/**
 * What each service costs in tokens, as numbers code can read. 02/11/2026.
 *
 * The pricing page states the same prices in words (`content/pricing.ts`,
 * "20 tokens = 1 Fit Report"); this is the figure the Deliver button deducts,
 * so the two are changed together.
 */
export const TOKEN_PRICE = {
  fitReport: 20,
  matchedRole: 1,
} as const;
