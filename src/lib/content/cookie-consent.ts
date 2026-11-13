import type { Copy } from "./copy";

/**
 * The cookie banner's four strings. 04/11/2026.
 *
 * Its own module rather than a key under `CONSENT_COPY`, which is the PDPA
 * contact consent: the tick that says PunProfile may send an email, call a
 * number or write on LINE. `verify-consent.ts` asserts invariants over that
 * block, and `08_Coaching_Business.md` owns the four instruments it belongs to.
 * Cookie consent is a different permission with a different legal basis and a
 * different reader moment, and folding the two into one object is how a session
 * reading either one later ends up conflating them.
 *
 * **Not a link table and not a page module.** The banner is chrome: it renders
 * over whatever page the reader is on, in `CookieBanner.tsx`, and the footer
 * control that reopens it renders in `SiteFooter.tsx`. The strings live here
 * because R49 says no candidate-facing string is written inline in a component,
 * and the language system is what makes them reviewable.
 *
 * The privacy notice link in the banner is `consent.privacyLink` from
 * `copy.ts`, which already says "read our privacy policy" in both languages and
 * is already approved. A second string saying the same thing would be a second
 * place for it to drift, and `verify-copy.ts` forbids two identical consent
 * strings for exactly that reason.
 *
 * Linted at the `app` surface, which is what `verify-language-system.ts` gives
 * a module under `content/`. `system`, the surface the privacy notice and the
 * consent copy are linted at, would have been arguable: this is a legal control
 * rather than a page. It is left as `app` because the only difference the
 * surface makes is which termbase entries apply, every term these four strings
 * can touch is marked for all surfaces, and a regex in a verifier is a worse
 * place to encode that judgement than this comment.
 */
export const COOKIE_CONSENT: {
  body: Copy;
  accept: Copy;
  reject: Copy;
  settings: Copy;
} = {
  /** The ask. Says what the cookies do, that they are not for advertising, and that the choice is reversible. */
  body: {
    en: "PunProfile uses Google Analytics cookies to count visits, to see which pages people open, and to see which job posts bring them to the site. These cookies are not used for advertising, and the site works normally if you do not allow analytics cookies. You can change your settings at any time.",
    th: "PunProfile ใช้คุกกี้ Google Analytics เพื่อนับการเข้าชม ดูว่าผู้เข้าชมเปิดหน้าใด และดูว่าประกาศงานใดพาผู้เข้าชมมาที่เว็บไซต์ คุกกี้เหล่านี้ไม่ใช้เพื่อโฆษณา และคุณใช้งานเว็บไซต์ได้ตามปกติแม้ไม่อนุญาตให้ใช้คุกกี้วิเคราะห์ คุณเปลี่ยนการตั้งค่าได้ทุกเมื่อ",
  },
  /**
   * The two answers, which are the same size and the same shape on the screen.
   *
   * Equal prominence is the requirement, not a preference: a reject that is
   * harder to find than its accept is the defect regulators name in most
   * banners. One is a filled button and the other is outlined, which is the
   * design system's own pair of peers, and `CookieBanner.tsx` gives them
   * identical height, padding and type.
   */
  accept: {
    en: "Allow analytics cookies",
    th: "อนุญาตคุกกี้วิเคราะห์",
  },
  reject: {
    en: "Do not allow analytics cookies",
    th: "ไม่อนุญาตคุกกี้วิเคราะห์",
  },
  /**
   * The way back to the choice, in the footer beside the privacy link.
   *
   * Withdrawal has to be as easy as consent was, so it is on every page the
   * footer is on rather than inside the notice. It is absent during an
   * assessment for the same reason the menu and the footer are, which costs
   * nothing: nobody is withdrawing consent mid-assessment, and a reader who
   * wants to has the rest of the site.
   */
  settings: {
    en: "Cookie settings",
    th: "การตั้งค่าคุกกี้",
  },
};
