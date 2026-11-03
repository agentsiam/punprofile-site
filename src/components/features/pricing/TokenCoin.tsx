import Image from "next/image";

/**
 * The token, drawn. Clay art from 03/11/2026, Paul's own generation from the
 * brief in his pricing visual research. Decorative everywhere it appears: the
 * number beside it already says "tokens", so it carries `alt=""`.
 *
 * Mustard rather than lime on purpose. Lime is the one action colour (R16), and
 * a lime coin beside a lime button would read as a second thing to press.
 */
const COIN = "/pricing/pricing-token-coin.png";
export default function TokenCoin({ size = 20 }: { size?: number }) {
  return <Image src={COIN} alt="" width={size} height={size} className="inline-block shrink-0" />;
}

