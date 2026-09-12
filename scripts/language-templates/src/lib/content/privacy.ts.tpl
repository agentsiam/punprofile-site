/**
 * The privacy notice, Thai-first. Resolves `[Privacy Notice TODO]` in
 * `consent-copy.ts`.
 *
 * **Founder-signed off 14/08/2026, same gate as the consent copy.** Paul
 * settled the withdrawal contact and the retention basis (twelve months rolling
 * from last contact), which were the two placeholders holding this back.
 * `PRIVACY_REVIEWED` is true from that sign-off. It is a founder sign-off, not
 * an external legal opinion; a lawyer's wording would replace these strings
 * wholesale rather than being merged into them.
 *
 * **"Who holds your data" was rewritten 20/08/2026, on Paul's wording**, when
 * a second coach was added to the admin allowlist. The old paragraph said one
 * person, no team, nobody else can sign in, which was true when it was signed
 * off and false the moment `ADMIN_EMAILS` carried two addresses. A head count
 * in a privacy notice is a claim with a maintenance cost; see the note at the
 * paragraph itself.
 *
 * **The contact address was corrected 17/08/2026 to
 * `punprofile.career@gmail.com`**, on Paul's instruction. It had been an
 * address at a domain belonging to a different business of his, repeated here
 * and in four other documents from one original mistake. The reasoning is in
 * `consent-copy.ts`, which owns the address; this file publishes it.
 *
 * What IS reliable here is the factual half. Every claim about what the system
 * collects, where it stores it, who processes it and what leaves Thailand was
 * taken from `data-inventory.md`, which was written by reading the schema, the
 * Sentry scrubber and the import scripts. The reviewer's job is the framing:
 * lawful basis, rights language, whether the cross-border disclosure is
 * sufficient. Not the facts.
 *
 * Two statements in here are commitments rather than descriptions, and both are
 * flagged at their section:
 *
 * - **Retention is enforced as of 15/08/2026.** `convex/retention.ts` runs
 *   daily and erases records whose last contact is more than twelve months old.
 *   The clock counts contact from either side, so a call or a coach note resets
 *   it as the candidate's own activity does. A lead with a live engagement or a
 *   placement is never swept, and neither exemption applies to a request from
 *   the person themselves. Nothing falls due until July 2027, so the job will do
 *   nothing for a long time, which is the promise being kept rather than the job
 *   being useful. This paragraph was a standing caveat and is now a fact.
 *
 * Structured as sections rather than flat keys because it is long-form prose,
 * and a `privacy.section4.para2` key space would be unreadable in the worksheet
 * for no gain. It flows through the same `{ en, th }` shape as everything else.
 */

import type { Copy } from "./copy";
import { MARKETING_CONSENT_COPY_REVIEWED } from "@/lib/consent-copy";

/** TASK-047 cleared on Paul's sign-off, 14/08/2026. */
export const PRIVACY_REVIEWED = true;

/** Last substantive change to the text, DD/MM/YYYY. Shown to the reader. */
export const PRIVACY_LAST_UPDATED = "20/08/2026";

/**
 * The marketing opt-in, 16/08/2026.
 *
 * A notice has to describe what the product does, and the marketing tick in
 * `ContactGate` is built and waiting on one thing: Paul's own Thai. It renders
 * only when `MARKETING_CONSENT_COPY_REVIEWED` is true, and **every paragraph
 * here that describes it is gated on the same constant.**
 *
 * One flag, because there is one fact underneath: whether this business asks
 * for marketing consent. Two flags would allow the state that matters, a tick
 * collecting consent for a purpose the published notice does not mention, and
 * PDPA requires the notice to exist before the collection rather than after it.
 * Flipping the constant turns on the tick and the text that covers it together.
 *
 * **One sentence outside the gate changed, and it is a narrowing.** "Why we hold
 * it" said "We do not use it for anything else", which is true today and becomes
 * false the moment the tick ships. It now says we do not use the data for
 * anything the reader has not agreed to, which is true in both states. That
 * sentence is inside Paul's 14/08/2026 sign-off and its replacement is not; it
 * is flagged for his read rather than treated as covered.
 *
 * The Thai below is composed rather than translated, per LR-09, and it is still
 * mine rather than his. It is behind the gate for that reason as much as any
 * other.
 */

export interface PrivacySection {
  heading: Copy;
  /** Paragraphs. A leading "- " marks a list item at render. */
  body: Copy[];
}

/**
 * The page's own heading. Added 16/08/2026, when the title and the meta
 * description needed it and the page was still writing it inline as a ternary.
 * It sits with `PRIVACY_SECTIONS` because it is part of the same reviewed
 * document, even though it is the one line in it a lawyer would not read
 * differently in a browser tab.
 */
export const PRIVACY_HEADING: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfSEVBRElORw:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfSEVBRElORw:TH%%,
};

export const PRIVACY_INTRO: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfSU5UUk8:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfSU5UUk8:TH%%,
};

/**
 * The way back, at the foot of the notice. Moved here 06/09/2026.
 *
 * It was written inline in `privacy/page.tsx` as a ternary on the locale,
 * `th ? "กลับหน้าแรก" : "Back to the start"`, which is the one thing R49 exists
 * to prevent: a candidate-facing string outside `src/lib/content/` is a string
 * `verify:copy` never reads, so it can carry an LR failure, lose its Thai or
 * drift from its English and nothing catches it. Found in the UI review of
 * 06/09/2026. The wording is unchanged; only where it lives is.
 */
/**
 * The draft banner and the last-updated label. Moved here 06/09/2026, with
 * `PRIVACY_BACK` below and for the same reason.
 *
 * The banner renders only while `PRIVACY_REVIEWED` is false, which is why it
 * survived three copy reviews unread: `verify:copy` never saw it because it was
 * not in a content module, and nobody saw it on the page because the flag has
 * been true since 20/08/2026. That is the worst shape a string can have. It is
 * kept rather than deleted, because the flag exists to be flipped back the next
 * time the notice is rewritten.
 */
export const PRIVACY_DRAFT_BANNER: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfRFJBRlRfQkFOTkVS:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfRFJBRlRfQkFOTkVS:TH%%,
};

export const PRIVACY_UPDATED_LABEL: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfVVBEQVRFRF9MQUJFTA:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfVVBEQVRFRF9MQUJFTA:TH%%,
};

export const PRIVACY_BACK: Copy = {
  en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfQkFDSw:EN%%,
  th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfQkFDSw:TH%%,
};

export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    heading: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbMF0uaGVhZGluZw:EN%%,
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbMF0uaGVhZGluZw:TH%%,
    },
    body: [
      /**
       * **The head count in this paragraph is a live claim, 20/08/2026.** It
       * used to say one person and no team, which stopped being true the day a
       * second coach was added to `ADMIN_EMAILS`. If that variable changes on
       * production, this sentence and `PRIVACY_LAST_UPDATED` change with it, in
       * both languages. Nothing enforces that but this comment: the allowlist
       * lives in the Convex environment and no build step can read it.
       *
       * Wording is Paul's, 20/08/2026. `PunProfile Team` and
       * `ทีมงานปั้นโปรไฟล์`, not "the coaching team". The controller keeps its
       * Latin legal name at the head of the sentence, per LR-01.
       */
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbMF0uYm9keVswXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbMF0uYm9keVswXQ:TH%%,
      },
    ],
  },
  {
    heading: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbMV0uaGVhZGluZw:EN%%,
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbMV0uaGVhZGluZw:TH%%,
    },
    body: [
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbMV0uYm9keVswXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbMV0uYm9keVswXQ:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbMV0uYm9keVsxXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbMV0uYm9keVsxXQ:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbMV0uYm9keVsyXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbMV0uYm9keVsyXQ:TH%%,
      },
    ],
  },
  {
    heading: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbMl0uaGVhZGluZw:EN%%,
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbMl0uaGVhZGluZw:TH%%,
    },
    body: [
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbMl0uYm9keVswXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbMl0uYm9keVswXQ:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbMl0uYm9keVsxXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbMl0uYm9keVsxXQ:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbMl0uYm9keVsyXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbMl0uYm9keVsyXQ:TH%%,
      },
    ],
  },
  {
    heading: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbM10uaGVhZGluZw:EN%%,
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbM10uaGVhZGluZw:TH%%,
    },
    body: [
      {
        // "We do not use it for anything else" was the wording Paul signed off
        // on 14/08/2026 and it stops being true the moment the marketing tick
        // ships. Narrowed rather than gated, so one sentence is correct in both
        // states instead of two sentences being maintained.
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbM10uYm9keVswXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbM10uYm9keVswXQ:TH%%,
      },
      ...(MARKETING_CONSENT_COPY_REVIEWED
        ? [
            {
              // Rewritten 17/08/2026 with `consent.marketing` itself. It said
              // "job emails ... matching roles", which is a paid Phase 4 feature
              // and was removed from the tick on Paul's call. A privacy notice
              // that describes a consent the form no longer asks for is worse
              // than one that says nothing: it is the document a reader checks
              // the form against.
              en: "If you ticked the optional box, we also use your email address to send you news and practical advice. That is a separate consent from the one above.",
              th: "หากคุณติ๊กช่องเลือกไว้ เราจะใช้อีเมลของคุณส่งข่าวสารและคำแนะนำให้ด้วย ความยินยอมนี้แยกจากข้อด้านบน",
            },
          ]
        : []),
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbM10uYm9keVsyXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbM10uYm9keVsyXQ:TH%%,
      },
    ],
  },
  ...(MARKETING_CONSENT_COPY_REVIEWED
    ? [
        {
          heading: {
            // Retitled 17/08/2026 with the tick it describes. It said "job
            // emails", which is the Phase 4 paid feature Paul took out of the
            // consent. A notice section named after something the form does not
            // ask for sends a reader looking for a box that is not there.
            en: "News emails, if you asked for them",
            th: "อีเมลข่าวสาร หากคุณเลือกรับ",
          },
          body: [
            {
              en: "The box is optional and is never ticked for you. Leaving it unticked does not affect your result, and it does not affect anything else we do for you.",
              th: "ช่องนี้เป็นตัวเลือก และไม่ได้ถูกติ๊กไว้ล่วงหน้า การไม่ติ๊กไม่มีผลต่อผลการประเมินของคุณ และไม่มีผลต่อสิ่งอื่นที่เราทำให้คุณ",
            },
            {
              en: "If you tick it, we send news and practical advice by email. We do not send them on Line or by phone, whatever you consented to for those channels: they are for talking to you about your own result and your coaching.",
              th: "หากคุณติ๊ก เราจะส่งข่าวสารและคำแนะนำทางอีเมล เราจะไม่ส่งทาง LINE หรือโทรศัพท์ ไม่ว่าคุณจะให้ความยินยอมช่องทางเหล่านั้นไว้หรือไม่ เพราะช่องทางเหล่านั้นมีไว้พูดคุยเรื่องผลการประเมินและการโค้ชของคุณ",
            },
            {
              en: "You can stop at any time by writing to the address at the end of this notice. We record the date you asked. Stopping does not delete your record and does not stop us answering you about your own result.",
              th: "คุณขอหยุดรับได้ทุกเมื่อโดยเขียนมาที่อีเมลท้ายประกาศนี้ เราจะบันทึกวันที่คุณแจ้ง การหยุดรับไม่ได้ลบระเบียนข้อมูลของคุณ และไม่ได้หยุดการตอบกลับเรื่องผลการประเมินของคุณ",
            },
          ],
        },
      ]
    : []),
  {
    heading: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbNV0uaGVhZGluZw:EN%%,
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbNV0uaGVhZGluZw:TH%%,
    },
    body: [
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbNV0uYm9keVswXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbNV0uYm9keVswXQ:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbNV0uYm9keVsxXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbNV0uYm9keVsxXQ:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbNV0uYm9keVsyXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbNV0uYm9keVsyXQ:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbNV0uYm9keVszXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbNV0uYm9keVszXQ:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbNV0uYm9keVs0XQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbNV0uYm9keVs0XQ:TH%%,
      },
    ],
  },
  {
    heading: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbNl0uaGVhZGluZw:EN%%,
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbNl0uaGVhZGluZw:TH%%,
    },
    body: [
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbNl0uYm9keVswXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbNl0uYm9keVswXQ:TH%%,
      },
    ],
  },
  {
    heading: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbN10uaGVhZGluZw:EN%%,
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbN10uaGVhZGluZw:TH%%,
    },
    body: [
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbN10uYm9keVswXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbN10uYm9keVswXQ:TH%%,
      },
    ],
  },
  {
    heading: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbOF0uaGVhZGluZw:EN%%,
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbOF0uaGVhZGluZw:TH%%,
    },
    body: [
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbOF0uYm9keVswXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbOF0uYm9keVswXQ:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbOF0uYm9keVsxXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbOF0uYm9keVsxXQ:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbOF0uYm9keVsyXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbOF0uYm9keVsyXQ:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbOF0uYm9keVszXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbOF0uYm9keVszXQ:TH%%,
      },
      ...(MARKETING_CONSENT_COPY_REVIEWED
        ? [
            {
              en: "- Stop the news emails without withdrawing anything else. The two consents are recorded separately, so stopping one leaves the other exactly as it was.",
              th: "- หยุดรับข่าวสารทางอีเมลโดยไม่ต้องถอนความยินยอมอื่น ความยินยอมทั้งสองถูกบันทึกแยกกัน การหยุดอย่างหนึ่งจึงไม่กระทบอีกอย่าง",
            },
          ]
        : []),
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbOF0uYm9keVs1XQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbOF0uYm9keVs1XQ:TH%%,
      },
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbOF0uYm9keVs2XQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbOF0uYm9keVs2XQ:TH%%,
      },
    ],
  },
  {
    heading: {
      en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbOV0uaGVhZGluZw:EN%%,
      th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbOV0uaGVhZGluZw:TH%%,
    },
    body: [
      {
        en: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbOV0uYm9keVswXQ:EN%%,
        th: %%LANG:c3JjL2xpYi9jb250ZW50L3ByaXZhY3kudHM6OlBSSVZBQ1lfU0VDVElPTlNbOV0uYm9keVswXQ:TH%%,
      },
    ],
  },
];
