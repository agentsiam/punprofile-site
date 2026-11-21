/**
 * One design token's value, for HTML that cannot use a custom property.
 *
 * Email is that case. No mail client resolves `var()`, so every colour has to
 * be written into the markup as a literal, which is how the email surface came
 * to hold a hand-written copy of the palette with seven values matching no
 * token at all. Reading each one out of the generated block at render time
 * instead means the copy cannot exist: `design.md` changes, `npm run tokens`
 * regenerates, and the next render is already right.
 *
 * **It throws rather than falling back.** A colour that quietly defaults is one
 * nobody notices is wrong until a candidate does. Every caller is rendered by
 * `npm run verify:email`, which is in the pre-push list, so a token that stops
 * existing fails the gate rather than a send.
 *
 * Both email frames use this: `convex/emailShell.ts` for the four service
 * messages and `marketing-html.ts` beside this file for the newsletter.
 */
import { BRAND_TOKENS_CSS } from "../design-tokens.generated";

export function token(name: string): string {
  const found = BRAND_TOKENS_CSS.match(new RegExp(`--color-${name}:\\s*([^;]+);`));
  if (!found) throw new Error(`design token --color-${name} is not in the generated block`);
  return found[1].trim();
}
