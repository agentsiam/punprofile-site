---
version: 1
kind: canonical-language-source
---

# PunProfile language system

> Status: canonical implementation source. Generated TypeScript must never be edited for copy.
> Decision owner: Paul. Last migration audit: 09/09/2026.

## Contract

This file is the only source of truth for candidate-facing English and Thai. Each fenced YAML block is one copy record. `npm run language:generate` emits the TypeScript modules from the structure-only templates. `npm run verify:language` fails when generated code is stale, an entry is missing or duplicated, a fixed term drifts, provenance is incomplete, or a changed string has no current structural-calque verdict.

The schema is `version: 1`. Required fields are `id`, `source`, `path`, `render`, `narrative_slot`, `en`, `th`, `provenance`, `date`, `term_bindings`, `decision_note`, and `review`; `proposal_th` is optional and is never approved copy. `review.text_hash` is SHA-256 of English, a null byte, then Thai. The parser rejects missing or invalid required fields, and the verifier requires every template token and every entry to resolve exactly once. The generator also emits the decision history into `language-notes.generated.ts`, so regenerating the modules cannot discard the reasoning carried here.

## Corpus established before the rules

The migration found **893 bilingual copy records** in executable source. This replaces the hand-off's approximate 561. **199 records postdate their module's file-level sign-off.** A file header was accepted only for a string whose blamed source line is no later than that sign-off. Later strings received provenance only with string-local evidence that Paul wrote, rewrote, read back, or explicitly approved them. Approval can make a record buildable; only evidence that Paul wrote or amended the Thai puts it in the clean corpus. `TH-UNREVIEWED`, absent evidence, and ambiguous notes such as “read back, drafted” were excluded. Paul's 08/09 verdict excludes `WHO_BODY` even though an older comment implied a read-back.

Result: **429 Paul-written clean-corpus records**, **788 records approved to build**, **104 awaiting a native verdict**, and **1 rejected**. Approval and calibration are deliberately different: a model draft Paul approved unchanged can ship, but the `golden-th` rule excludes it from the corpus used to induce voice or set register bands. The clean corpus is exactly `provenance: paul-written`; it is not inferred from module headers at runtime. The missing `golden-th/reference/Thai Text To Learn.md` was not used.

## Voice rules, induced from the clean corpus

1. Put a person in the verb slot. Prefer `เรา`, `ผม`, or `คุณ` doing the action. Do not make an abstraction such as advice, a result, or a service behave like an English grammatical subject.
   - DO: `ปกติเราตอบทาง LINE ได้เร็วกว่า` (Paul's wording, contact page).
   - DON'T: `คำแนะนำจึงเริ่มจากเป้าหมายของคุณ` (rejected in `WHO_BODY`).
2. Rebuild the thought in Thai. English is a semantic brief, not a clause order to preserve. A one-to-one run of clauses, joins, and relative clauses is evidence to inspect, not a style to imitate.
   - DO: `ปัญหาส่วนใหญ่ไม่ใช่ว่าคุณเก่งไม่พอ แต่เป็นเพราะตลาดงานยุโรปเล่นด้วยกติกาคนละชุดกับไทย` (Paul's wording, home page).
   - DON'T: translate each English clause and reconnect it with `จึง`, `ที่`, and `ไม่ใช่จาก` in the same order.
3. Name the reader's lived symptom before diagnosing it. In short-form use the observed `มี X แต่ Y...` stack, then hand the floor back. Long-form answers the question the reader deliberately opened and does not inherit feed padding.
4. Relocate blame from the reader to the rules without promising an outcome. State limits in the same breath as the offer. PunProfile has no placed-client claim.
5. Keep Thai rhythm short enough to scan, but do not chop it to hit a metric. Register bands are triage only. They do not prove idiomatic Thai.
6. Apply termbase decisions exactly. Product names, navigation labels, LINE, and fixed calls to action are decisions, not untranslated gaps. An exact English-to-Thai pass-through without a termbase entry fails unless its record already carries a current Paul-approved verdict; that verdict is per-string evidence, not inference.
7. Use `เรา` for broadcast and app copy, `ผม` for one-to-one messages, and state `คุณ` when addressing the reader. The termbase records deliberate exceptions.
8. Preserve the narrative argument. Every record names one of `audience`, `symptom`, `misread`, `mechanism`, `artefact`, `limit`, `proof`, `ask`, a `house.*` slot, or `utility`. A fluent rewrite in the wrong slot fails.

## Structural-calque verdict

The hand-off diagnosis is confirmed and refined. `WHO_BODY` is stiff because English controls both agency and clause topology: `คำแนะนำ` acts where a person should, the final `ที่` clause carries an English relative-clause load, and the sequence mirrors the English proposition by proposition. Nominalisation, particles, and phrase length are orthogonal; two of those three metrics can pass while the architecture remains translated.

No honest regex can decide this class without a wall of false positives. The enforceable mechanism is a versioned bilingual judge verdict bound to the exact text hash. Mechanical patterns may nominate a record for review, but they never approve or reject it alone.

### Judge protocol: structural-calque-v1

Inputs: the record's render location and neighbouring block, narrative slot and its definition from `Narrative_System.md`, English as semantic brief, Thai candidate, fixed term bindings, decision note, and five clean records from the same surface. Prompt:

> Decide whether the Thai reads as Thai composed for this reader, preserves the stated narrative slot and claims, and is free of English-controlled agency or clause order. Inspect abstract nouns used as actors, clause-for-clause alignment, stacked relative clauses, imported connectors, and policy-register flattening. Do not fail a termbase-fixed English name. Return JSON only: verdict (pass or fail), categories, concise evidence, and an optional proposed Thai. A proposal is a draft and never approval.

The build fails when the verdict is missing, pending, or fail; when `review.text_hash` does not match the current EN and TH; when `prompt_version` differs; or when a fixed term binding fails. Paul's wording or amendment is authoritative and may be recorded as pass without a second native review.

## Authoring workflow

Read the relevant narrative slots and clean same-surface records first. Write an English meaning brief, then compose Thai without looking at English clause order. Check the termbase. Record provenance, date, decision history, and narrative slot here. Run the judge, generate, then verify. Paul reviews all pending Thai in one generated queue from `npm run review:language`; approval is written back here in one pass, never collected one string at a time in chat.

## Decommission decision

| Artifact | State | Reason |
|---|---|---|
| `copy-worksheet.md`, `export-copy-worksheet.ts`, `import-copy-worksheet.ts` | Retired; app scripts deleted. Coaching copy proposed for removal. | They protect the old code-to-Markdown round trip. |
| Coaching `Language_System.md` | Folded in here; proposed archive, not modified by this repo. | The app build cannot gate on a sibling specification. |
| `thai-review-queue.md`, `export-thai-review.ts` | Retired as a source; exporter replaced by a view of this file. Coaching file proposed for removal. | Review state now lives per string here. |
| `scripts/lib/provenance.ts` | Deleted. | File-level regex caused approval to leak forward. |
| `thai-composer` | Kept as a supplementary authoring skill; its five-step procedure is folded into the workflow above. | It helps compose, but this file owns rules and approval state. |
| `verify-thai-register.ts` | Kept as non-gating triage, recalibrated from this file's clean records. | Its three metrics cannot judge structural calque. |

## Copy records


<!-- COPY-ENTRY -->
### `src/components/LocaleToggle.tsx::CODES`

```yaml
id: src/components/LocaleToggle.tsx::CODES
source: src/components/LocaleToggle.tsx
path: CODES
render: src/components/LocaleToggle.tsx, CODES
narrative_slot: utility
en: EN
th: TH
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 22dc0fcdd3acc53b69bfe0680473b9da5ddf3c33bf72eaea3a6c63d5b1764dbf
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/components/LocaleToggle.tsx::NAMES`

```yaml
id: src/components/LocaleToggle.tsx::NAMES
source: src/components/LocaleToggle.tsx
path: NAMES
render: src/components/LocaleToggle.tsx, NAMES
narrative_slot: utility
en: English
th: ไทย
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: b86b776811f7b530aadeab23df7a3bed774edf8e4b1844e2a83040f1e0826db4
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/consent-copy.ts::CONSENT_COPY.consent.channel.email`

```yaml
id: src/lib/consent-copy.ts::CONSENT_COPY.consent.channel.email
source: src/lib/consent-copy.ts
path: CONSENT_COPY.consent.channel.email
render: Contact gate, inside the consent statement
narrative_slot: utility
en: email
th: อีเมล
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c29a29bdc82d45722cc7a6cd229ec7e9594e2a725cadf9353718d0f47594f589
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/consent-copy.ts::CONSENT_COPY.consent.channel.line`

```yaml
id: src/lib/consent-copy.ts::CONSENT_COPY.consent.channel.line
source: src/lib/consent-copy.ts
path: CONSENT_COPY.consent.channel.line
render: Contact gate, beside the LINE ID field
narrative_slot: utility
en: LINE
th: LINE
provenance: paul-approved
date: 14/08/2026
term_bindings:
  - channel-line
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: a9f2f8da787c503d62c2401c415a3b30ab4bcd391c31af58fc3f3d81eada41c4
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/consent-copy.ts::CONSENT_COPY.consent.channel.phone`

```yaml
id: src/lib/consent-copy.ts::CONSENT_COPY.consent.channel.phone
source: src/lib/consent-copy.ts
path: CONSENT_COPY.consent.channel.phone
render: Contact gate, beside the phone field
narrative_slot: utility
en: phone
th: โทรศัพท์
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 461559c185d660e59d5ca95f19a47e5b7b0b2c4c4f73d996d370533a5fa9a43d
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/consent-copy.ts::CONSENT_COPY.consent.channelJoin`

```yaml
id: src/lib/consent-copy.ts::CONSENT_COPY.consent.channelJoin
source: src/lib/consent-copy.ts
path: CONSENT_COPY.consent.channelJoin
render: Contact gate, between channel names
narrative_slot: utility
en: ' and '
th: ' และ '
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 04681ca65adad7851f75e7897153fa1ffcd8cf3a42734a4699f9d32531c7314d
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/consent-copy.ts::CONSENT_COPY.consent.marketing`

```yaml
id: src/lib/consent-copy.ts::CONSENT_COPY.consent.marketing
source: src/lib/consent-copy.ts
path: CONSENT_COPY.consent.marketing
render: Contact gate, a separate optional tick under the consent statement
narrative_slot: utility
en: >-
  Get the latest news and practical advice from PunProfile, delivered straight to your inbox. Tell us any time
  if you want it to stop.
th: รับข่าวสารและคำแนะนำดี ๆ จากปั้นโปรไฟล์ ส่งตรงถึงอีเมลของคุณ หากไม่อยากรับต่อ แจ้งเราได้ทุกเมื่อ
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 17/08/2026, with his own `แจ้งเราได้ทุกเมื่อ` kept on the

  end: it is the third constraint above and it was in the string this

  replaces.
review:
  structural_calque: pass
  text_hash: b0e86d1d856f8b31422b672d6e91aa10043e004e5c0c38f6818d99f26c9cb30c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/consent-copy.ts::CONSENT_COPY.consent.marketingNote`

```yaml
id: src/lib/consent-copy.ts::CONSENT_COPY.consent.marketingNote
source: src/lib/consent-copy.ts
path: CONSENT_COPY.consent.marketingNote
render: Contact gate, directly under the optional marketing tick
narrative_slot: utility
en: By entering your email, you agree to our Terms of Service and Privacy Policy.
th: การกรอกอีเมลถือว่าคุณยอมรับข้อกำหนดการใช้บริการและนโยบายความเป็นส่วนตัวของเรา
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: Paul's wording, 17/08/2026, unchanged.
review:
  structural_calque: pass
  text_hash: 2cd52af182d97eb0aa8d4b201203f1593412b146962d8acc6816309606226e89
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/consent-copy.ts::CONSENT_COPY.consent.privacyLink`

```yaml
id: src/lib/consent-copy.ts::CONSENT_COPY.consent.privacyLink
source: src/lib/consent-copy.ts
path: CONSENT_COPY.consent.privacyLink
render: Contact gate, under the purpose paragraph
narrative_slot: utility
en: Read our Privacy Policy
th: อ่านนโยบายความเป็นส่วนตัว
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: e2eb75e28874d8d7f2ecd9fcfc859bf7de1cec36b65354f837aa781a88c80e0b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/consent-copy.ts::CONSENT_COPY.consent.purpose`

```yaml
id: src/lib/consent-copy.ts::CONSENT_COPY.consent.purpose
source: src/lib/consent-copy.ts
path: CONSENT_COPY.consent.purpose
render: 'Contact gate, above the fields: what the data is for'
narrative_slot: utility
en: >-
  We use your email to send your result. If you would like us to contact you by phone or on LINE, fill in that
  channel and tick the consent box. We keep your information for twelve months from the last time you were in
  touch, and we do not pass it to anyone else. Change your mind at any point and tell us at
  punprofile.career@gmail.com.
th: >-
  เราจะใช้อีเมลของคุณเพื่อส่งผลประเมิน หากต้องการให้เราติดต่อทางโทรศัพท์หรือ LINE
  ให้กรอกช่องทางนั้นและติ๊กช่องยินยอม เราจะเก็บข้อมูลของคุณไว้สิบสองเดือนนับจากการติดต่อครั้งล่าสุด
  และจะไม่ส่งต่อข้อมูลให้บุคคลอื่น หากคุณเปลี่ยนใจ แจ้งเราได้ทุกเมื่อที่ punprofile.career@gmail.com
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 3682a635727027f428fbfcaed675837e5409fabe648ef6ba8731101e82617385
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/consent-copy.ts::CONSENT_COPY.consent.statement`

```yaml
id: src/lib/consent-copy.ts::CONSENT_COPY.consent.statement
source: src/lib/consent-copy.ts
path: CONSENT_COPY.consent.statement
render: Contact gate, beside the email field
narrative_slot: utility
en: I agree that PunProfile may contact me about my result and career coaching by email, LINE or phone.
th: ยินยอมให้ PunProfile ติดต่อกลับเกี่ยวกับผลประเมินและบริการแนะแนวอาชีพทางอีเมล LINE หรือ โทรศัพท์
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 3bef445a39aa2bca172f792ac04a291c4607d8ac2667c5daa508950178a8ef25
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/blog.ts::BLOG_ALL`

```yaml
id: src/lib/content/blog.ts::BLOG_ALL
source: src/lib/content/blog.ts
path: BLOG_ALL
render: Blog index, BLOG_ALL
narrative_slot: utility
en: All
th: ทั้งหมด
provenance: paul-approved
date: 17/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 831a830871bff2542250db8c82cb408059ffdb0e5df5f6ccb75e7da3cb19dd14
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/blog.ts::BLOG_BACK`

```yaml
id: src/lib/content/blog.ts::BLOG_BACK
source: src/lib/content/blog.ts
path: BLOG_BACK
render: Blog index, BLOG_BACK
narrative_slot: utility
en: All articles
th: บทความทั้งหมด
provenance: paul-approved
date: 17/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c4ce5133cbb2fe9197e6e42d8dbe0991ecbdf9420acaa81401a8f536e2ca0882
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/blog.ts::BLOG_CLOSE`

```yaml
id: src/lib/content/blog.ts::BLOG_CLOSE
source: src/lib/content/blog.ts
path: BLOG_CLOSE
render: Blog index, BLOG_CLOSE
narrative_slot: ask
en: >-
  Read this far and still not sure where to start? Two minutes, and you will know which stage of the path to
  working in Europe you are on.
th: >-
  อ่านมาถึงตรงนี้แล้วยังไม่รู้ว่าจะเริ่มจากไหน? ใช้เวลาเพียง 2 นาที เช็กว่าตอนนี้คุณอยู่ขั้นไหน
  และควรทำอะไรต่อเพื่อไปทำงานในยุโรป
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 17/08/2026, and it is the closing line on the index and

  at the foot of every article.

  `อ่านมาถึงตรงนี้แล้ว` earns the ask from what the reader just did,

  which is the one thing a closing line can do that an opening cannot.

  The second half is his own closing sentence from the pinned post,

  already used on the home page, so the blog closes the way the site

  closes.
review:
  structural_calque: pass
  text_hash: 44812e9934fb3fb3165e6453fd424cfabaa74417db3a596d01366b917ee04af4
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/blog.ts::BLOG_EMPTY`

```yaml
id: src/lib/content/blog.ts::BLOG_EMPTY
source: src/lib/content/blog.ts
path: BLOG_EMPTY
render: Blog index, BLOG_EMPTY
narrative_slot: utility
en: Nothing in this topic yet.
th: ยังไม่มีบทความในหัวข้อนี้
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 17/08/2026. He cut `ลองดูหัวข้ออื่น`: the topic row is

  directly above this line, so telling the reader to try another one is

  narrating a control they can already see.
review:
  structural_calque: pass
  text_hash: 37a51ff22e982c9c4f0bdb254029231968a3bc07855c769c521ec9e51990aef8
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/blog.ts::BLOG_HEADING`

```yaml
id: src/lib/content/blog.ts::BLOG_HEADING
source: src/lib/content/blog.ts
path: BLOG_HEADING
render: Blog index, BLOG_HEADING
narrative_slot: utility
en: Stories from Europe, on the road to settling there
th: เรื่องเล่าจากยุโรป บนเส้นทางสู่การลงหลักปักฐาน
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 17/08/2026. It was a description of the blog's method,

  "explained one piece at a time"; his is a promise about what the reader gets

  out of it. `ลงหลักปักฐาน`, putting down roots, is the first time anything on

  this site names the actual end state rather than the job.
review:
  structural_calque: pass
  text_hash: 21b693839cd81d408021eedf4c228a9f3f1cef2fbe94c6b97ba90ca3ab84e489
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/blog.ts::BLOG_INTRO`

```yaml
id: src/lib/content/blog.ts::BLOG_INTRO
source: src/lib/content/blog.ts
path: BLOG_INTRO
render: Blog index, BLOG_INTRO
narrative_slot: utility
en: >-
  Articles on finding work in Europe: visas, CVs and getting ready. Written from real information you can
  check, not shortcuts that sound good and do not work.
th: >-
  รวมบทความเรื่องการหางานในยุโรป วีซ่า เรซูเม่ และการเตรียมตัว เขียนจากข้อมูลจริงที่ตรวจสอบได้
  ไม่ใช่สูตรลัดที่ฟังดูดีแต่ใช้จริงไม่ได้
provenance: paul-approved
date: 17/08/2026
term_bindings: []
decision_note: |-
  chose this one, the later of the two.

  Three changes from what it replaced, and the last is the one that matters.

  `การหางานในยุโรป` rather than `ตลาดงานยุโรป`: the reader's activity rather

  than the subject area. `ข้อมูลจริงที่ตรวจสอบได้` rather than

  `สิ่งที่ตรวจสอบได้`. And the closing clause is now an argument rather than a

  label: `ไม่ใช่สูตรลัดที่ฟังดูดีแต่ใช้จริงไม่ได้`, not shortcuts that sound

  good and do not work, where it had said only "not shortcuts".

  His other draft closed on `ไม่ขายฝันด้วยสูตรลัด`, we do not sell dreams. He

  did not pick it, and it is worth recording why that is the right call: it

  accuses the rest of the market, and nothing else on this site does.
review:
  structural_calque: pass
  text_hash: 45b5c0af3257f3e04fc22e4d91af9533928f70de30a8bcfc782433b6c5cc72f7
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/blog.ts::BLOG_NONE_YET`

```yaml
id: src/lib/content/blog.ts::BLOG_NONE_YET
source: src/lib/content/blog.ts
path: BLOG_NONE_YET
render: Blog index, BLOG_NONE_YET
narrative_slot: utility
en: There is nothing to read yet. We are writing the first one.
th: ตอนนี้ยังไม่มีบทความให้อ่าน เรากำลังเขียนชิ้นแรกอยู่
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 17/08/2026, and this is the one that matters most on

  this page: with no articles published it is the only Thai a visitor to

  `/blog` actually sees. `ให้อ่าน` says what is missing from the reader's

  side, and `เรา` puts someone behind the work rather than leaving it as

  a state the page is in.
review:
  structural_calque: pass
  text_hash: a9f50872e7e0e101b802af9a12368a9806fa1ce693f190c18d5a3abe56efa366
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/blog.ts::BLOG_QUESTION_LABEL`

```yaml
id: src/lib/content/blog.ts::BLOG_QUESTION_LABEL
source: src/lib/content/blog.ts
path: BLOG_QUESTION_LABEL
render: Blog index, BLOG_QUESTION_LABEL
narrative_slot: utility
en: A question for you
th: คำถามสำหรับคุณ
provenance: paul-approved
date: 17/08/2026
term_bindings: []
decision_note: |-
  Paul's own label, from the second of the two pieces that closes on a

  question. See the note at the top of this file on why it replaced the other.
review:
  structural_calque: pass
  text_hash: ab960bce74265f14a40242ed040f190c31f7811373261b8502cd06593ca9c18d
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/blog.ts::BLOG_READ`

```yaml
id: src/lib/content/blog.ts::BLOG_READ
source: src/lib/content/blog.ts
path: BLOG_READ
render: Blog index, BLOG_READ
narrative_slot: utility
en: Read
th: อ่านบทความ
provenance: paul-approved
date: 17/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 4e57f0b6d13b9382c312c5a98a1015a13e96850ffbef674ce0df00b8ae38f4c6
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/blog.ts::BLOG_TOPICS_LABEL`

```yaml
id: src/lib/content/blog.ts::BLOG_TOPICS_LABEL
source: src/lib/content/blog.ts
path: BLOG_TOPICS_LABEL
render: Blog index, BLOG_TOPICS_LABEL
narrative_slot: utility
en: Pick a topic
th: เลือกหัวข้อ
provenance: paul-approved
date: 17/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 674f022d5aa393de08bff58c3a5e945da139472532e125bc9bf7840e0b33c715
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/blog.ts::PLAYBOOKS_HEADING`

```yaml
id: src/lib/content/blog.ts::PLAYBOOKS_HEADING
source: src/lib/content/blog.ts
path: PLAYBOOKS_HEADING
render: Blog index, PLAYBOOKS_HEADING
narrative_slot: utility
en: First time here? Start with these guides.
th: เพิ่งเข้ามาครั้งแรกใช่ไหม? เริ่มจากคู่มือเหล่านี้ได้เลย
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 17/08/2026. `ใช่ไหม` and `ได้เลย` are the difference

  between a label and someone speaking: the first makes the question a

  real one and the second gives permission rather than an instruction.
review:
  structural_calque: pass
  text_hash: b91c0fe1b832c1270be62f96f5c9bc03aa1a9bddb64954a87c215507290009d7
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/blog.ts::PLAYBOOKS_INTRO`

```yaml
id: src/lib/content/blog.ts::PLAYBOOKS_INTRO
source: src/lib/content/blog.ts
path: PLAYBOOKS_INTRO
render: Blog index, PLAYBOOKS_INTRO
narrative_slot: ask
en: The articles to start with. Each one explains from the basics through to what you can go and do yourself.
th: บทความแนะนำสำหรับเริ่มต้น แต่ละเรื่องอธิบายตั้งแต่พื้นฐานจนคุณนำไปใช้ต่อได้ด้วยตัวเอง
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 17/08/2026. `ควรเริ่มอ่าน` rather than `ควรอ่านก่อน`,

  which is where to begin rather than an order of merit, and `พื้นฐาน`

  names what they start from.
review:
  structural_calque: pass
  text_hash: 46cc2e0ef6604e2ffd7436bbc0c1cd7944131c11223bb0f03f055ccb1f4a543f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/blog.ts::SIGNUP_BAD_EMAIL`

```yaml
id: src/lib/content/blog.ts::SIGNUP_BAD_EMAIL
source: src/lib/content/blog.ts
path: SIGNUP_BAD_EMAIL
render: Blog index, SIGNUP_BAD_EMAIL
narrative_slot: utility
en: That email is not right. Please check it.
th: อีเมลนี้ไม่ถูกต้อง ลองตรวจดูอีกครั้ง
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 17/08/2026. `ดู` goes: the field either parses or it

  does not, and hedging a validation error makes the reader wonder

  whether they have to fix it.
review:
  structural_calque: pass
  text_hash: 7df2e7542779fe0e95301bb585e8ee9246caea5f20843667e6b6675ee1655c28
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/blog.ts::SIGNUP_BUSY`

```yaml
id: src/lib/content/blog.ts::SIGNUP_BUSY
source: src/lib/content/blog.ts
path: SIGNUP_BUSY
render: Blog index, SIGNUP_BUSY
narrative_slot: utility
en: That did not save. Please try again in a moment.
th: บันทึกไม่สำเร็จ ลองอีกครั้งในอีกสักครู่
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 17/08/2026. Shorter, and it leads with what happened rather

  than with our inability to do it: `บันทึกไม่สำเร็จ` states the outcome where

  `ยังบันทึกไม่ได้ในตอนนี้` narrates our side of it.
review:
  structural_calque: pass
  text_hash: 3c704a2f8eb645fa48f53b76d4ccae14e93d903915ecb5a0b44a1e5d237f74ca
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/blog.ts::SIGNUP_BUTTON`

```yaml
id: src/lib/content/blog.ts::SIGNUP_BUTTON
source: src/lib/content/blog.ts
path: SIGNUP_BUTTON
render: Blog index, SIGNUP_BUTTON
narrative_slot: utility
en: Get news and advice by email
th: รับข่าวสารและคำแนะนำทางอีเมล
provenance: paul-approved
date: 17/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 17a232752526eb3cc734ca2e4f779f0206d2dcdf6bef2165cd5bcac25b2a5ecc
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/blog.ts::SIGNUP_CONSENT`

```yaml
id: src/lib/content/blog.ts::SIGNUP_CONSENT
source: src/lib/content/blog.ts
path: SIGNUP_CONSENT
render: Blog index, SIGNUP_CONSENT
narrative_slot: utility
en: >-
  You agree that PunProfile may keep and use your email address to send you news and practical advice. We do
  not pass your details to anyone else.
th: ยินยอมให้ PunProfile เก็บและใช้อีเมลของคุณเพื่อส่งข่าวสารและคำแนะนำ เราจะไม่ส่งต่อข้อมูลของคุณให้บุคคลอื่น
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  Same correction as `SIGNUP_BUTTON` above: it said the email is kept "in

  order to send you matching roles", which is the Phase 4 paid feature. The

  no-onward-disclosure half is unchanged and is true; `privacy.ts` says the

  same thing at length.

  Paul's wording, 17/08/2026. Two changes worth keeping straight: he drops

  "เมื่อกดปุ่มนี้", since a consent line under a button does not need to say

  which button, and he writes `เก็บและใช้` rather than `เก็บ`. The second is

  the substantive one for PDPA: keeping and using are different operations and

  the notice discloses both, so the consent should name both.

  `ปั้นโปรไฟล์` in Thai script rather than the wordmark, which is LR-01 where

  the brand opens a Thai clause.
review:
  structural_calque: pass
  text_hash: 3ab29b7d241a7d35e1e262b17a913219a9b80ee786abf8d659394ce1856f2f4f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/blog.ts::SIGNUP_DONE`

```yaml
id: src/lib/content/blog.ts::SIGNUP_DONE
source: src/lib/content/blog.ts
path: SIGNUP_DONE
render: Blog index, SIGNUP_DONE
narrative_slot: utility
en: Done. We will send news and practical advice to this address.
th: เรียบร้อย เราจะส่งข่าวสารและคำแนะนำไปที่อีเมลนี้
provenance: paul-approved
date: 17/08/2026
term_bindings: []
decision_note: |-
  Last of the four, 17/08/2026. Same paid-feature promise in the success

  message, which is the one a reader sees only after they have said yes.
review:
  structural_calque: pass
  text_hash: 1cdd1305b930a20a4ccebc386b0446d507404069ef916aa742518e85d02cb892
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/blog.ts::SIGNUP_LABEL`

```yaml
id: src/lib/content/blog.ts::SIGNUP_LABEL
source: src/lib/content/blog.ts
path: SIGNUP_LABEL
render: Blog index, SIGNUP_LABEL
narrative_slot: utility
en: Your email
th: อีเมลของคุณ
provenance: paul-approved
date: 17/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c5801e2355eee20fb68490e6efd18de92e4f33a695b0b0056cb1f8caf289295f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/blog.ts::SIGNUP_NOTE`

```yaml
id: src/lib/content/blog.ts::SIGNUP_NOTE
source: src/lib/content/blog.ts
path: SIGNUP_NOTE
render: Blog index, SIGNUP_NOTE
narrative_slot: utility
en: News and practical advice only. No spam, and you can stop at any time.
th: ส่งเฉพาะข่าวสารและคำแนะนำ ไม่มีสแปม ยกเลิกได้ทุกเมื่อ
provenance: paul-approved
date: 17/08/2026
term_bindings: []
decision_note: |-
  The fifth and last of the job-alert promises, caught by Paul 17/08/2026

  after the other four were fixed. It said "only roles that match you", which

  is the same Phase 4 paid feature.

  *Worth recording that it took two passes.** Four strings were corrected by

  grepping for `แจ้งตำแหน่งงาน` and `matching roles`, and this one used neither:

  it says `ส่งเฉพาะตำแหน่งที่ตรงกับคุณ`, the same promise in different words. A

  grep finds the phrasing it was given and a person reading the form finds the

  promise. That is why he found it and the search did not.

  The no-spam and stop-any-time halves are unchanged and are still true.
review:
  structural_calque: pass
  text_hash: 45cc5e7ae3916ce4cc94a8b8fa812af165224c421e43b68ebdc27c222b1717c7
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/blog.ts::TOPICS[0].label`

```yaml
id: src/lib/content/blog.ts::TOPICS[0].label
source: src/lib/content/blog.ts
path: TOPICS[0].label
render: Blog index, TOPICS[0].label
narrative_slot: utility
en: How-to
th: How-to
provenance: paul-approved
date: 17/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c77c46fd85215b5240aa315df50481cb109ca73eacec9527353ffdc9afda0199
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/blog.ts::TOPICS[1].label`

```yaml
id: src/lib/content/blog.ts::TOPICS[1].label
source: src/lib/content/blog.ts
path: TOPICS[1].label
render: Blog index, TOPICS[1].label
narrative_slot: utility
en: The European job market
th: ตลาดงานยุโรป
provenance: paul-approved
date: 17/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: b0865d3bc61e1c3e5f5241ec5dc84a1d9aaaeb11633f1d6748ca8cfed8e27242
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/blog.ts::TOPICS[2].label`

```yaml
id: src/lib/content/blog.ts::TOPICS[2].label
source: src/lib/content/blog.ts
path: TOPICS[2].label
render: Blog index, TOPICS[2].label
narrative_slot: utility
en: Perspective
th: มุมมอง
provenance: paul-approved
date: 17/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c34b686de33cdfc4d1e2759a60a0cd0536e302a7bf1d023792fb8f2d086051c5
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/blog.ts::TOPICS[3].label`

```yaml
id: src/lib/content/blog.ts::TOPICS[3].label
source: src/lib/content/blog.ts
path: TOPICS[3].label
render: Blog index, TOPICS[3].label
narrative_slot: utility
en: What people worry about
th: เรื่องที่หลายคนกังวล
provenance: paul-approved
date: 17/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 3595bf2843350501d6fe190de8c3e81672b4b178781d998e995da641ff6071e7
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/blog.ts::UNSUBSCRIBE_BODY`

```yaml
id: src/lib/content/blog.ts::UNSUBSCRIBE_BODY
source: src/lib/content/blog.ts
path: UNSUBSCRIBE_BODY
render: Blog index, UNSUBSCRIBE_BODY
narrative_slot: utility
en: >-
  We have recorded your request to stop, with the date. Your details and your result are unchanged, and you
  can still contact us about your result at any time.
th: >-
  เราได้บันทึกคำขอหยุดรับข่าวสารพร้อมวันที่ไว้แล้ว ข้อมูลและผลประเมินของคุณยังอยู่ตามเดิม
  และคุณยังติดต่อเราเพื่อสอบถามเกี่ยวกับผลได้เสมอ
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 17/08/2026. It names what was recorded rather than only

  that something was: `คำขอหยุดรับข่าวสารพร้อมวันที่` is the PDPA record

  this page exists to create, and `privacy.ts` promises exactly it.
review:
  structural_calque: pass
  text_hash: 4031b5e73e3c01ac35d33a04d88e399b5717cd4eae1f2b6c56436bba62004a23
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/blog.ts::UNSUBSCRIBE_HEADING`

```yaml
id: src/lib/content/blog.ts::UNSUBSCRIBE_HEADING
source: src/lib/content/blog.ts
path: UNSUBSCRIBE_HEADING
render: Blog index, UNSUBSCRIBE_HEADING
narrative_slot: utility
en: You will not get these emails any more
th: คุณจะไม่ได้รับอีเมลเหล่านี้อีก
provenance: paul-approved
date: 17/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: d65633f4152cc9eea5b676a6d932b4d700c200fead50a0c3a57a8c272e664555
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/blog.ts::UNSUBSCRIBE_RESTART`

```yaml
id: src/lib/content/blog.ts::UNSUBSCRIBE_RESTART
source: src/lib/content/blog.ts
path: UNSUBSCRIBE_RESTART
render: Blog index, UNSUBSCRIBE_RESTART
narrative_slot: ask
en: Change your mind whenever, and you can sign up again from the blog, or just contact us.
th: เปลี่ยนใจเมื่อไหร่ ก็กลับมาสมัครรับข่าวสารใหม่ได้ที่หน้าบทความ หรือติดต่อเราได้เลย
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 17/08/2026. It adds the second route: someone who has

  just unsubscribed may not want to hunt for a form, and the contact page

  is a person.
review:
  structural_calque: pass
  text_hash: 51686cd8a941bd18ec012bacaafcc69bb79e5ae23d21c9d645003ac2834d741d
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/blog.ts::UNSUBSCRIBE_WORKING`

```yaml
id: src/lib/content/blog.ts::UNSUBSCRIBE_WORKING
source: src/lib/content/blog.ts
path: UNSUBSCRIBE_WORKING
render: Blog index, UNSUBSCRIBE_WORKING
narrative_slot: utility
en: One moment.
th: รอสักครู่
provenance: paul-approved
date: 17/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: bac1c6afe6938cf6014f7b9706530f70d661187489145db86cb10390f977e011
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::CLOSE_LEAD`

```yaml
id: src/lib/content/coaching.ts::CLOSE_LEAD
source: src/lib/content/coaching.ts
path: CLOSE_LEAD
render: Coaching page, CLOSE_LEAD
narrative_slot: ask
en: If any of that landed, the next step is not a form. It is a conversation.
th: ถ้ามีข้อไหนตรงกับคุณ ขั้นต่อไปไม่ใช่การกรอกฟอร์ม แต่คือการได้คุยกัน
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 2d82dc7bb161cafa1ee1d97454f4acf5a06cbbf7b242dbbcb0eef2ff7505def4
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::FOUNDER_AFTER[0]`

```yaml
id: src/lib/content/coaching.ts::FOUNDER_AFTER[0]
source: src/lib/content/coaching.ts
path: FOUNDER_AFTER[0]
render: Coaching page, FOUNDER_AFTER[0]
narrative_slot: proof
en: >-
  For us, career coaching is not writing you a new story that makes you look better than you are. It is
  helping you see who your existing experience is valuable to, which direction you should be heading, and how
  to tell your own story so another market understands it.
th: >-
  สำหรับเรา Career Coaching ไม่ใช่การแต่งเรื่องใหม่ให้คุณดูดีกว่าความเป็นจริง
  แต่คือการช่วยให้คุณมองเห็นว่าประสบการณ์ที่มีอยู่ของคุณมีคุณค่าสำหรับใคร ควรมุ่งหน้าไปทางไหน
  และจะเล่าเรื่องของตัวเองอย่างไรให้คนในตลาดอื่นเข้าใจ
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: |-
  Read back 06/09/2026, and `ผม` to `เรา` held.

  What coaching is, is a claim about the method and never was Paul's

  opinion, so it moves to the shared voice cleanly. See

  `founder-section-we.md` for which paragraphs could not.

  Paul's wording, 06/09/2026, and the read-back this comment was asking for.

  The worry it recorded was real: the term had been swapped and not a word

  around it, and an English phrase dropped into the middle of his Thai is

  the kind of change that is right as a rule and wrong in a particular

  voice. He rewrote the sentence around it rather than accepting the swap:

  `เขียนเรื่องใหม่` became `แต่งเรื่องใหม่`, `ดูเก่งกว่า` became `ดูดีกว่า`,

  and the closing clause reads `คนในตลาดอื่น` rather than `คนอีกตลาด`.
review:
  structural_calque: pass
  text_hash: 9c41e29cac16b01d588c4d8c2a63f7d4013fd77f818071acce4efb58f696ec7b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::FOUNDER_AFTER[1]`

```yaml
id: src/lib/content/coaching.ts::FOUNDER_AFTER[1]
source: src/lib/content/coaching.ts
path: FOUNDER_AFTER[1]
render: Coaching page, FOUNDER_AFTER[1]
narrative_slot: proof
en: >-
  We chose career coaching over being recruiters because the first question should be “what suits you”, not
  “which vacancy can I put you into”.
th: >-
  เราเลือกทำ Career Coaching แทนการเป็นบริษัทจัดหางาน เพราะคำถามแรกควรเป็น “งานแบบไหนเหมาะกับคุณ” ไม่ใช่
  “มีตำแหน่งว่างไหนที่เราจะส่งคุณเข้าไปได้บ้าง”
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: |-
  Read back 06/09/2026, and `ผม` to `เรา` held.

  The minimum change. This paragraph is the one Dew changes most and not by

  wording: ten years in US placement means one of them did the recruiting

  job before choosing not to do it here. That is his to write.

  Paul's wording, 06/09/2026. `นายหน้าจัดหางาน` became `บริษัทจัดหางาน`,

  which is the form the published disclaimer in `footer.ts` already uses, so

  the page and the legal line now name the same thing. Both quoted questions

  were opened out: "อะไรเหมาะกับคุณ" to "งานแบบไหนเหมาะกับคุณ", and

  "จะนำคุณไปใส่ในตำแหน่งไหนได้บ้าง" to

  "มีตำแหน่งว่างไหนที่เราจะส่งคุณเข้าไปได้บ้าง".
review:
  structural_calque: pass
  text_hash: df8c07fc412dfe92d947dd533f622e5aaf63f59079a396c1271447ccf619aab3
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::FOUNDER_AFTER[2]`

```yaml
id: src/lib/content/coaching.ts::FOUNDER_AFTER[2]
source: src/lib/content/coaching.ts
path: FOUNDER_AFTER[2]
render: Coaching page, FOUNDER_AFTER[2]
narrative_slot: proof
en: >-
  PunProfile is paid by you, not by an employer. So the advice starts from your goals and your situation, not
  from a role somebody is rushing to fill.
th: >-
  PunProfile รับค่าบริการจากคุณ ไม่ใช่นายจ้าง คำแนะนำจึงเริ่มจากเป้าหมายและความเป็นจริงของคุณ
  ไม่ใช่จากตำแหน่งที่ใครกำลังรีบหาคนไปใส่
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 5fadc4683df16362441a13cc08efc9b0ae9c15da256a853a501b7977565ec262
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::FOUNDER_AFTER[3]`

```yaml
id: src/lib/content/coaching.ts::FOUNDER_AFTER[3]
source: src/lib/content/coaching.ts
path: FOUNDER_AFTER[3]
render: Coaching page, FOUNDER_AFTER[3]
narrative_slot: proof
en: >-
  In the end, you are still the one walking this road. Our job is to make sure you are not guessing the whole
  way: to let you know what you already have in hand, what is still missing, and what the next step should be.
th: >-
  สุดท้ายคุณยังเป็นคนที่ต้องเดินเส้นทางนี้ด้วยตัวเอง งานของเราคือช่วยให้คุณไม่ต้องคาดเดาไปตลอดทาง
  ให้คุณรู้ว่ามีอะไรอยู่ในมือแล้ว ยังขาดอะไร และควรก้าวต่อไปทางไหน
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026, and `ผม` to `เรา` held.
review:
  structural_calque: pass
  text_hash: 5b1054ab40029b0cc636fbc2ebdf7effa8700bf4de1aa933b7911a0b71015a51
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::FOUNDER_BEFORE[0]`

```yaml
id: src/lib/content/coaching.ts::FOUNDER_BEFORE[0]
source: src/lib/content/coaching.ts
path: FOUNDER_BEFORE[0]
render: Coaching page, FOUNDER_BEFORE[0]
narrative_slot: proof
en: >-
  I run PunProfile and the “Jobs at companies in Europe” group. Most people meet me through that group first.
  My day job is in Marketing Operations, here in Europe.
th: >-
  ผมดูแล PunProfile และกลุ่ม “งานบริษัทในยุโรป” หลายคนรู้จักผมครั้งแรกผ่านกลุ่มนี้ ส่วนงานประจำ ผมทำด้าน
  Marketing Operations อยู่ในยุโรป
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 160a0d97bcf92bb5789938c55e3598a8b5907c749570aa964b34d1080d88189a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::FOUNDER_BEFORE[1]`

```yaml
id: src/lib/content/coaching.ts::FOUNDER_BEFORE[1]
source: src/lib/content/coaching.ts
path: FOUNDER_BEFORE[1]
render: Coaching page, FOUNDER_BEFORE[1]
narrative_slot: proof
en: >-
  The longer I work here, the clearer one thing becomes: good people are not always seen, especially when
  their experience comes from another country.
th: >-
  การทำงานอยู่ในยุโรปทำให้ผมเห็นเรื่องหนึ่งชัดขึ้นเรื่อย ๆ ว่า คนเก่งไม่ได้ถูกมองเห็นเสมอไป
  โดยเฉพาะเมื่อประสบการณ์ของเขามาจากอีกประเทศ
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 6d84224cb4d50c773ea8719a594208aae4882ea43221366c5af58900fd622282
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::FOUNDER_BEFORE[2]`

```yaml
id: src/lib/content/coaching.ts::FOUNDER_BEFORE[2]
source: src/lib/content/coaching.ts
path: FOUNDER_BEFORE[2]
render: Coaching page, FOUNDER_BEFORE[2]
narrative_slot: proof
en: >-
  A company name every Thai person knows may be a name a European hiring manager has never heard. Work we know
  was large and difficult can become one unremarkable line on a CV. And years of accumulated experience can be
  passed over, not because it has no value, but because the person reading it does not have enough context to
  see that value.
th: >-
  ชื่อบริษัทที่คนไทยรู้จักดี อาจเป็นเพียงชื่อที่ผู้จัดการฝ่ายสรรหาในยุโรปไม่เคยได้ยิน
  งานที่เรารู้ว่าใหญ่และยาก อาจกลายเป็นเพียงหนึ่งบรรทัดธรรมดาใน CV และประสบการณ์ที่สั่งสมมาหลายปีอาจถูกมองข้าม
  ไม่ใช่เพราะมันไม่มีค่า แต่เพราะคนอ่านยังไม่มีบริบทมากพอที่จะเห็นคุณค่านั้น
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 4b9965e8376aa019acd4fb0df7e00131467ffc314df057eb349c95d6ffa81f9e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::FOUNDER_BEFORE[3]`

```yaml
id: src/lib/content/coaching.ts::FOUNDER_BEFORE[3]
source: src/lib/content/coaching.ts
path: FOUNDER_BEFORE[3]
render: Coaching page, FOUNDER_BEFORE[3]
narrative_slot: proof
en: >-
  I have watched this happen again and again to Thai people in the group. When applications go unanswered,
  many of them try harder: send more, revise the CV again, read more advice. But in a cross-border job market,
  effort does not automatically turn into opportunity. If the market still cannot read you, applying more is
  just sending the same unclear story out over and over.
th: >-
  ผมเห็นเรื่องนี้เกิดขึ้นซ้ำ ๆ กับคนไทยในกลุ่ม เมื่อสมัครงานแล้วไม่ได้รับคำตอบ หลายคนจึงพยายามมากขึ้น
  สมัครมากขึ้น แก้ CV อีกรอบ และอ่านคำแนะนำเพิ่มอีก แต่ในตลาดงานข้ามประเทศ
  ความพยายามไม่ได้กลายเป็นโอกาสโดยอัตโนมัติ ถ้าตลาดยังอ่านเราไม่ออก
  การสมัครเพิ่มก็เป็นเพียงการส่งเรื่องเดิมที่ยังไม่ชัดออกไปซ้ำ ๆ
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 0418561fe097a31771ca0523b8bf877da05397344d351dee77394e39ac331a03
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::FOUNDER_HEADING`

```yaml
id: src/lib/content/coaching.ts::FOUNDER_HEADING
source: src/lib/content/coaching.ts
path: FOUNDER_HEADING
render: Coaching page, FOUNDER_HEADING
narrative_slot: utility
en: Hi, I'm Paul
th: สวัสดีครับ ผมพอล
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 0dde2e273e25a7fa00ed9ed1cf87260b255ab0b02269d47b84c2d45b1f41a469
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::FOUNDER_TURN`

```yaml
id: src/lib/content/coaching.ts::FOUNDER_TURN
source: src/lib/content/coaching.ts
path: FOUNDER_TURN
render: Coaching page, FOUNDER_TURN
narrative_slot: proof
en: That is why I started PunProfile.
th: นี่คือเหตุผลที่ผมเริ่มทำ PunProfile
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 79c9b495f8542da0f703d62c82de5775725ddc392957035b550fbb7e0aa97e43
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::HOOK_BODY[0]`

```yaml
id: src/lib/content/coaching.ts::HOOK_BODY[0]
source: src/lib/content/coaching.ts
path: HOOK_BODY[0]
render: Coaching page, HOOK_BODY[0]
narrative_slot: symptom
en: >-
  A hiring manager in Amsterdam opens your CV. They do not know your last company, they cannot tell how big
  the job you were responsible for actually was, and the visa question has no answer yet. They are not
  deciding that you are not good. They simply have not been given enough reason to keep reading.
th: >-
  ลองนึกภาพว่าผู้จัดการฝ่ายสรรหาในอัมสเตอร์ดัมเปิด CV ของคุณขึ้นมา เขาไม่รู้จักบริษัทเดิมของคุณ
  ไม่รู้ว่างานล่าสุดที่คุณรับผิดชอบใหญ่หรือซับซ้อนแค่ไหน
  และยังไม่รู้ว่าคุณมีสิทธิ์ทำงานอยู่แล้วหรือต้องขอวีซ่า เขาอาจไม่ได้คิดว่าคุณไม่เก่ง
  เพียงแต่ยังไม่เห็นเหตุผลมากพอที่จะอ่านต่อ
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 3cfe21d519efebb8e6cbc8338b9356ba055ea43f555362fca52665f79b9bd4e8
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::HOOK_BODY[1]`

```yaml
id: src/lib/content/coaching.ts::HOOK_BODY[1]
source: src/lib/content/coaching.ts
path: HOOK_BODY[1]
render: Coaching page, HOOK_BODY[1]
narrative_slot: symptom
en: >-
  The problem is getting your experience across to another market, not your ability, and sending more
  applications does not solve it.
th: >-
  ปัญหาอยู่ที่การถ่ายทอดประสบการณ์ให้คนในอีกตลาดเข้าใจ ไม่ใช่ความสามารถของคุณ
  และการส่งใบสมัครเพิ่มขึ้นก็ไม่ได้แก้ปัญหานี้เสมอไป
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: f80bb0af0944f239d33b3ac58116b3e05f5b8c3ba2c92fced70e156f436530dc
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::HOOK_CTA_SUB`

```yaml
id: src/lib/content/coaching.ts::HOOK_CTA_SUB
source: src/lib/content/coaching.ts
path: HOOK_CTA_SUB
render: Coaching page, HOOK_CTA_SUB
narrative_slot: symptom
en: The three ways of working together, and what each one does for you.
th: ดูบริการทั้ง 3 รูปแบบ และแต่ละแบบจะช่วยคุณได้อย่างไร
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: ff8b0dad71cc4a92c93ec1d2514ccc3b7386bdec614a16530418ce07261ef01b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::HOOK_EYEBROW`

```yaml
id: src/lib/content/coaching.ts::HOOK_EYEBROW
source: src/lib/content/coaching.ts
path: HOOK_EYEBROW
render: Coaching page, HOOK_EYEBROW
narrative_slot: utility
en: 1-1 career coaching for Thai professionals heading to Europe
th: Career Coaching แบบตัวต่อตัว สำหรับคนไทยที่ตั้งเป้าไปทำงานในยุโรป
provenance: paul-approved
date: 25/08/2026
term_bindings: []
decision_note: Read back 25/08/2026. `Career Coaching` for `แคเรียร์โค้ชชิ่ง`.
review:
  structural_calque: pass
  text_hash: 3d077cdfef31d98d18a2bc913dbfaabd8eedf9509f6903e4cc204d8b66ee8ea8
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::HOOK_LINE_1`

```yaml
id: src/lib/content/coaching.ts::HOOK_LINE_1
source: src/lib/content/coaching.ts
path: HOOK_LINE_1
render: Coaching page, HOOK_LINE_1
narrative_slot: symptom
en: It is rarely that your experience is not enough.
th: ปัญหามักไม่ใช่ว่าคุณมีประสบการณ์ไม่พอ
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 8cbf91bd1943bf17f8a6deb4262e979577fa0a7e40af7a0771e48e273a8d8c3c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::HOOK_LINE_2`

```yaml
id: src/lib/content/coaching.ts::HOOK_LINE_2
source: src/lib/content/coaching.ts
path: HOOK_LINE_2
render: Coaching page, HOOK_LINE_2
narrative_slot: symptom
en: It is that nobody in Europe can see what that experience is worth.
th: แต่คือคนในยุโรปยังไม่เห็นว่าประสบการณ์นั้นมีค่าอย่างไร
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c255782a02aa0359b6e94235f3c26bf1fbe89eed48537766590392665a5a8d08
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::MASCOT_ALT`

```yaml
id: src/lib/content/coaching.ts::MASCOT_ALT
source: src/lib/content/coaching.ts
path: MASCOT_ALT
render: Coaching page, MASCOT_ALT
narrative_slot: utility
en: The PunProfile character climbing steps towards a signpost
th: ภาพการ์ตูน PunProfile เดินขึ้นบันไดไปยังป้ายบอกทาง
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 27a0527cbfaad4cf279b990b2a1a041667dcb815e434b4c612ca4d56a8e8282d
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::METHOD_HEADING`

```yaml
id: src/lib/content/coaching.ts::METHOD_HEADING
source: src/lib/content/coaching.ts
path: METHOD_HEADING
render: Coaching page, METHOD_HEADING
narrative_slot: utility
en: Before I give you advice, I show you what the assessment is based on.
th: ก่อนให้คำแนะนำ ผมอยากให้คุณเห็นว่าเราใช้เกณฑ์อะไรในการประเมิน
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: dc76eebc02b81fc7ee0b95216594f164426ec077da00f4429cef6cb389000b18
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::METHOD_INTRO`

```yaml
id: src/lib/content/coaching.ts::METHOD_INTRO
source: src/lib/content/coaching.ts
path: METHOD_INTRO
render: Coaching page, METHOD_INTRO
narrative_slot: mechanism
en: >-
  Advice whose source you cannot check is no different from one person's opinion delivered confidently. So I
  am opening up the whole framework behind it, including its limits and the things it cannot assess.
th: >-
  คำแนะนำที่ตรวจสอบที่มาไม่ได้ก็ไม่ต่างจากความเห็นของใครสักคนที่พูดอย่างมั่นใจ
  ผมจึงเปิดกรอบการประเมินที่อยู่เบื้องหลังทั้งหมด รวมถึงข้อจำกัดและสิ่งที่กรอบนี้ประเมินไม่ได้
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: f82f141dfab1612db0253a37b0ed632c1fcaf02e09d61c7d1e102cfe25c4f21e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::METHOD[0].body[0]`

```yaml
id: src/lib/content/coaching.ts::METHOD[0].body[0]
source: src/lib/content/coaching.ts
path: METHOD[0].body[0]
render: Coaching page, METHOD[0].body[0]
narrative_slot: mechanism
en: >-
  Hiring decisions in Europe come from a number of factors that can be named and assessed. The framework
  behind the EU Fit Check divides them into thirty-four items, covering professional capability, readiness to
  apply, readiness to move country, and fit with the European market you are aiming at.
th: >-
  การตัดสินใจจ้างงานในยุโรปขึ้นอยู่กับหลายปัจจัยที่สามารถระบุและประเมินได้ กรอบเบื้องหลัง EU Fit Check
  แบ่งออกเป็น 34 ข้อ ครอบคลุมทั้งทักษะในสายงาน การสมัครงาน ความพร้อมในการย้ายประเทศ
  และความเหมาะสมกับตลาดยุโรปที่คุณตั้งเป้าไว้
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 7f2d618869c4877ed8342aa0e7e592240caf756597a9c53267aee670b0804de4
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::METHOD[0].heading`

```yaml
id: src/lib/content/coaching.ts::METHOD[0].heading
source: src/lib/content/coaching.ts
path: METHOD[0].heading
render: Coaching page, METHOD[0].heading
narrative_slot: utility
en: Thirty-four assessed items
th: กรอบประเมิน 34 ข้อ
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 179616907031f577531da610cc61cbf9a9fd5a8b0b0a1ec9a49a81d0db39be13
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::METHOD[1].body[0]`

```yaml
id: src/lib/content/coaching.ts::METHOD[1].body[0]
source: src/lib/content/coaching.ts
path: METHOD[1].body[0]
render: Coaching page, METHOD[1].body[0]
narrative_slot: mechanism
en: >-
  Of those thirty-four, only five can be assessed reliably from answers on a form. So we score those five, and
  show the rest as a hollow circle meaning “not assessed yet”, not a score of zero.
th: >-
  ใน 34 ข้อนี้ มีเพียง 5 ข้อที่ประเมินจากคำตอบในแบบฟอร์มได้อย่างน่าเชื่อถือ เราจึงให้คะแนนเฉพาะ 5 ข้อนั้น
  ส่วนข้อที่เหลือจะแสดงเป็นวงกลมโปร่งเพื่อบอกว่า “ยังไม่ได้ประเมิน” ไม่ใช่คะแนนศูนย์
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: d21dbfde6179ceacdbbb1ec98211ecd8d4fffd3f23b43e6eeb11633177c71d1e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::METHOD[1].body[1]`

```yaml
id: src/lib/content/coaching.ts::METHOD[1].body[1]
source: src/lib/content/coaching.ts
path: METHOD[1].body[1]
render: Coaching page, METHOD[1].body[1]
narrative_slot: mechanism
en: Most tools fill in all thirty-four and then let you plan around numbers nobody can stand behind.
th: เราไม่เติมคะแนนให้ครบเพียงเพื่อให้กราฟดูสมบูรณ์ เพราะตัวเลขที่ยืนยันไม่ได้ไม่ควรถูกนำไปใช้วางแผนชีวิตของคุณ
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 1f4fb66d3ac0614adfee576e664a598a3344f89ddfed65c7ac26e4816cb58e24
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::METHOD[1].heading`

```yaml
id: src/lib/content/coaching.ts::METHOD[1].heading
source: src/lib/content/coaching.ts
path: METHOD[1].heading
render: Coaching page, METHOD[1].heading
narrative_slot: utility
en: Five a form can really assess
th: มีแค่ 5 ข้อที่แบบประเมินวัดได้จริง
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved the supplied suggested revision.
review:
  structural_calque: pass
  text_hash: e06623257a287a040e041391d9413bc608ef30674d9598f697f366cb55566087
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::METHOD[2].body[0]`

```yaml
id: src/lib/content/coaching.ts::METHOD[2].body[0]
source: src/lib/content/coaching.ts
path: METHOD[2].body[0]
render: Coaching page, METHOD[2].body[0]
narrative_slot: mechanism
en: >-
  Before anyone contacts you, a person actually reads your answers. The things a form cannot answer are what
  the first conversation is for: the CV you are using, the roles you are applying to, and the reason your last
  application went unanswered.
th: >-
  ก่อนติดต่อกลับ เราจะอ่านคำตอบของคุณจริง ๆ ส่วนที่แบบฟอร์มประเมินไม่ได้ เราจะคุยกันในการพูดคุยครั้งแรก
  ไม่ว่าจะเป็น CV ที่คุณใช้อยู่ ตำแหน่งที่กำลังสมัคร หรือเหตุผลที่ใบสมัครล่าสุดไม่ได้รับการตอบกลับ
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: ae8f5c8e3071a072082f24169d188f91bcaf97e5848d409db6b017a90e7c0c0f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::METHOD[2].heading`

```yaml
id: src/lib/content/coaching.ts::METHOD[2].heading
source: src/lib/content/coaching.ts
path: METHOD[2].heading
render: Coaching page, METHOD[2].heading
narrative_slot: utility
en: A person really reads your answers
th: มีคนอ่านคำตอบของคุณจริง ๆ
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: e55783821dbbb9e28afd9fdeced891392818903940f29359eb8d4fada7b3d17d
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::METHOD[3].body[0]`

```yaml
id: src/lib/content/coaching.ts::METHOD[3].body[0]
source: src/lib/content/coaching.ts
path: METHOD[3].body[0]
render: Coaching page, METHOD[3].body[0]
narrative_slot: mechanism
en: >-
  We keep your answers as evidence, not just a score, so you can take the assessment again later and compare
  the charts.
th: เราเก็บคำตอบของคุณไว้ ไม่ได้เก็บเพียงคะแนน คุณจึงกลับมาทำแบบประเมินอีกครั้งในภายหลังและเปรียบเทียบกราฟได้
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: be0f9852c89501e584b65591d6f017bf0db611197d8ed4b257a22933e2cada2e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::METHOD[3].body[1]`

```yaml
id: src/lib/content/coaching.ts::METHOD[3].body[1]
source: src/lib/content/coaching.ts
path: METHOD[3].body[1]
render: Coaching page, METHOD[3].body[1]
narrative_slot: mechanism
en: >-
  Work you cannot measure means taking it on faith that it is getting better, and in this market you have been
  asked to take enough on faith without evidence already.
th: >-
  งานที่วัดผลไม่ได้ทำให้คุณต้องเชื่อไปก่อนว่าทุกอย่างกำลังดีขึ้น และในตลาดนี้
  คุณถูกขอให้เชื่อคำพูดที่ไม่มีหลักฐานมามากพอแล้ว
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 0bf5357122dc4727676683ba17f6d8595a31c37804775d6cc9d898820177cabb
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::METHOD[3].heading`

```yaml
id: src/lib/content/coaching.ts::METHOD[3].heading
source: src/lib/content/coaching.ts
path: METHOD[3].heading
render: Coaching page, METHOD[3].heading
narrative_slot: utility
en: Measurable again, so you can see it change
th: ทำซ้ำได้ และเห็นความเปลี่ยนแปลงจริง
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 356ef33b2bd83994b6244b2c2f720ce46e351cb9458d0f82f3bbb6666b7134be
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::NOT_FOR_HEADING`

```yaml
id: src/lib/content/coaching.ts::NOT_FOR_HEADING
source: src/lib/content/coaching.ts
path: NOT_FOR_HEADING
render: Coaching page, NOT_FOR_HEADING
narrative_slot: utility
en: And who it is not for
th: และอาจไม่เหมาะกับคุณ ถ้า…
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 51114cf484a332d0b6affa573bdfa3e9e3781ce1f4c5913acdc17d9fa9770b9b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::NOT_FOR[0]`

```yaml
id: src/lib/content/coaching.ts::NOT_FOR[0]
source: src/lib/content/coaching.ts
path: NOT_FOR[0]
render: Coaching page, NOT_FOR[0]
narrative_slot: limit
en: >-
  People looking for a recruitment agency. PunProfile is paid by you, not by an employer, so there is no
  vacancy anyone has to push you towards.
th: >-
  คนที่กำลังมองหาบริษัทจัดหางาน PunProfile รับค่าบริการจากคุณ ไม่ใช่นายจ้าง
  เราจึงไม่มีตำแหน่งที่ต้องพยายามผลักให้คุณสมัคร
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 5f3a9523c12f06077be8b748a17170e246c4c6290a3d9af4a794d78d8f59d52a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::NOT_FOR[1]`

```yaml
id: src/lib/content/coaching.ts::NOT_FOR[1]
source: src/lib/content/coaching.ts
path: NOT_FOR[1]
render: Coaching page, NOT_FOR[1]
narrative_slot: limit
en: >-
  People who want a guarantee of a job or a visa. Nobody can guarantee that honestly, and anyone who makes you
  feel they can is selling you something else.
th: >-
  คนที่ต้องการคำรับประกันว่าจะได้งานหรือวีซ่า ไม่มีใครรับประกันเรื่องนี้ได้อย่างซื่อสัตย์
  ใครที่ทำให้คุณรู้สึกว่ารับประกันได้ อาจกำลังขายความหวังมากกว่าความจริง
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 0e8de926fa8232477b7c56bd4942709196e550e8ef98036d10200f516a547a04
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::NOT_FOR[2]`

```yaml
id: src/lib/content/coaching.ts::NOT_FOR[2]
source: src/lib/content/coaching.ts
path: NOT_FOR[2]
render: Coaching page, NOT_FOR[2]
narrative_slot: limit
en: >-
  People who want it all done for them. The CV goes out under your name, and when the interview comes, the
  person sitting there is you.
th: >-
  คนที่อยากให้เราทำทุกอย่างแทน CV ต้องส่งออกไปในชื่อของคุณ และเมื่อถึงเวลาสัมภาษณ์
  คนที่ต้องนั่งอยู่ตรงนั้นก็คือคุณ
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 58efeb3a47869baba8ea033f376e9b406097b042d8b95b140918987aebb93e7c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::PAIN_HEADING`

```yaml
id: src/lib/content/coaching.ts::PAIN_HEADING
source: src/lib/content/coaching.ts
path: PAIN_HEADING
render: Coaching page, PAIN_HEADING
narrative_slot: utility
en: Does any of this sound like you?
th: มีข้อไหนตรงกับคุณบ้าง?
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 66d39444def40c6f1109ab91f5b81aa390d27177b33226e027a99df58e9bf8f7
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::PAINS[0]`

```yaml
id: src/lib/content/coaching.ts::PAINS[0]
source: src/lib/content/coaching.ts
path: PAINS[0]
render: Coaching page, PAINS[0]
narrative_slot: symptom
en: You have sent applications to Europe several times and heard nothing back from anyone.
th: ส่งใบสมัครไปยุโรปหลายครั้ง แต่เงียบ ไม่มีใครตอบกลับมาเลย
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 4495550ed521e6bfcbe8e54ee41b777901c89e53047267a3fae721eddabebe7f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::PAINS[1]`

```yaml
id: src/lib/content/coaching.ts::PAINS[1]
source: src/lib/content/coaching.ts
path: PAINS[1]
render: Coaching page, PAINS[1]
narrative_slot: symptom
en: >-
  You know you are good at your job in Thailand, but you have no idea what the same experience is worth in
  Berlin or Rotterdam.
th: คุณรู้ว่าตัวเองทำงานเก่งในไทย แต่ไม่รู้ว่าประสบการณ์แบบเดียวกันมีค่าแค่ไหนในเบอร์ลินหรือรอตเทอร์ดาม
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: d395ede186e584bf04726c3f9bac359b5614d999560d4f0aa35dca82c7ae6d7a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::PAINS[2]`

```yaml
id: src/lib/content/coaching.ts::PAINS[2]
source: src/lib/content/coaching.ts
path: PAINS[2]
render: Coaching page, PAINS[2]
narrative_slot: symptom
en: Most advice on the internet is written for people who already have the right to work in the EU.
th: คำแนะนำบนอินเทอร์เน็ตส่วนใหญ่เขียนมาสำหรับคนที่มีสิทธิ์ทำงานใน EU อยู่แล้ว
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 9764b0a7524dc8f61f4f533316cc31850c625cac49ba5a6f706ea3142686f025
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::PAINS[3]`

```yaml
id: src/lib/content/coaching.ts::PAINS[3]
source: src/lib/content/coaching.ts
path: PAINS[3]
render: Coaching page, PAINS[3]
narrative_slot: symptom
en: You have revised your CV several times and still cannot say which version is genuinely better.
th: แก้ CV มาหลายรอบ แต่ยังบอกไม่ได้ว่าเวอร์ชันไหนดีกว่ากันจริง
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 300c669c81af9643d0e8e4aafa26be26e1b3761782deac93ee8e159c2676f3db
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::PAINS[4]`

```yaml
id: src/lib/content/coaching.ts::PAINS[4]
source: src/lib/content/coaching.ts
path: PAINS[4]
render: Coaching page, PAINS[4]
narrative_slot: symptom
en: You are not sure whether the visa is a real obstacle or an excuse you are using to hold yourself back.
th: ไม่แน่ใจว่าวีซ่าเป็นอุปสรรคจริง ๆ หรือเป็นข้ออ้างที่คุณใช้รั้งตัวเองไว้
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 36a67f211c0207a9614ff1adb34165279c5938af77200cbed8eec6b8323de06a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::PAINS[5]`

```yaml
id: src/lib/content/coaching.ts::PAINS[5]
source: src/lib/content/coaching.ts
path: PAINS[5]
render: Coaching page, PAINS[5]
narrative_slot: symptom
en: If you could move tomorrow you would go, but you still cannot say which country, or which role.
th: ถ้าย้ายได้พรุ่งนี้ คุณก็พร้อมไป แต่ยังตอบไม่ได้ว่าจะไปประเทศไหนหรือสมัครตำแหน่งอะไร
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: a4046d2cc7a45a5092afe96bac3ef9957648ee1aba69d698e0f1f2a11f44ad8e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::PERSONA_HEADING`

```yaml
id: src/lib/content/coaching.ts::PERSONA_HEADING
source: src/lib/content/coaching.ts
path: PERSONA_HEADING
render: Coaching page, PERSONA_HEADING
narrative_slot: utility
en: Who this is for
th: บริการนี้เหมาะกับใคร
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 4b5f7688407b5f67a89e3b34035bdbbed555b1b73fcd20894359e6c6366111fd
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::PERSONAS[0]`

```yaml
id: src/lib/content/coaching.ts::PERSONAS[0]
source: src/lib/content/coaching.ts
path: PERSONAS[0]
render: Coaching page, PERSONAS[0]
narrative_slot: utility
en: >-
  Working Thai professionals with real experience, in any field, who have never had to explain that experience
  to a European reader.
th: คนไทยวัยทำงานที่มีประสบการณ์จริง ไม่ว่าจะอยู่สายไหน แต่ยังไม่เคยต้องเล่าประสบการณ์นั้นให้คนยุโรปเข้าใจ
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c0019e04e3a26f92d4b144d2dbc2f94fd543610e1913d02fbdc64d75799f340b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::PERSONAS[1]`

```yaml
id: src/lib/content/coaching.ts::PERSONAS[1]
source: src/lib/content/coaching.ts
path: PERSONAS[1]
render: Coaching page, PERSONAS[1]
narrative_slot: utility
en: >-
  People who have applied many times and got silence back instead of a rejection they could learn something
  from.
th: คนที่สมัครมาหลายครั้ง แต่ได้รับความเงียบกลับมาแทนคำปฏิเสธที่พอจะนำไปปรับปรุงได้
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 1dffeedaf9e37d90c20ac50b12801adf2596a18f88d0a5b547e378daffb2e545
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::PERSONAS[2]`

```yaml
id: src/lib/content/coaching.ts::PERSONAS[2]
source: src/lib/content/coaching.ts
path: PERSONAS[2]
render: Coaching page, PERSONAS[2]
narrative_slot: utility
en: >-
  People weighing up whether to move at all, who want to decide on real information rather than on the mood of
  a good week or a bad one.
th: คนที่กำลังชั่งใจว่าจะย้ายดีไหม และอยากตัดสินใจจากข้อมูลจริง ไม่ใช่อารมณ์ในวันที่รู้สึกมีหวังหรือหมดหวัง
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: fb1a990d13b5c0765103e27bd44afef807378160d255a26fcbcc0cf786950bfd
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::PERSONAS[3]`

```yaml
id: src/lib/content/coaching.ts::PERSONAS[3]
source: src/lib/content/coaching.ts
path: PERSONAS[3]
render: Coaching page, PERSONAS[3]
narrative_slot: utility
en: People planning to move with a partner or children, because this decision has never been only about a job.
th: คนที่วางแผนย้ายพร้อมคู่ครองหรือลูก เพราะการตัดสินใจนี้ไม่เคยมีแค่เรื่องงาน
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: da83df4ea6997f0d164a853488b11b7015bcd5c30539ad6238b93a17776a2825
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::PORTRAIT_ALT`

```yaml
id: src/lib/content/coaching.ts::PORTRAIT_ALT
source: src/lib/content/coaching.ts
path: PORTRAIT_ALT
render: Coaching page, PORTRAIT_ALT
narrative_slot: utility
en: Portrait of Paul Bussabong
th: พอล บุษบง ผู้ดูแล PunProfile
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: dcfac03e49b46cfb84dccf0d9cbf8c43da73fb5f80071ea52220266525a8c5ed
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::PROOF_CONCLUSION`

```yaml
id: src/lib/content/coaching.ts::PROOF_CONCLUSION
source: src/lib/content/coaching.ts
path: PROOF_CONCLUSION
render: Coaching page, PROOF_CONCLUSION
narrative_slot: proof
en: >-
  So the gap is not effort, and it is not English. It is getting experience from the Thai market across to a
  European employer. That takes specific expertise, and it is the work I do.
th: >-
  ช่องว่างจึงไม่ได้อยู่ที่ความพยายามหรือภาษาอังกฤษ
  แต่อยู่ที่การถ่ายทอดประสบการณ์จากตลาดไทยให้นายจ้างยุโรปเข้าใจ งานนี้ต้องใช้ความเชี่ยวชาญเฉพาะ
  และนี่คืองานที่ผมทำ
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 292aa5644ba1224f71d2c4f304f6d91beac770e4a60996be03570a786c7b1656
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::PROOF_FOOT`

```yaml
id: src/lib/content/coaching.ts::PROOF_FOOT
source: src/lib/content/coaching.ts
path: PROOF_FOOT
render: Coaching page, PROOF_FOOT
narrative_slot: proof
en: >-
  From people who have taken the EU Fit Check, calculated from those who answered each question. The figures
  update as more people take it.
th: ข้อมูลจากผู้ทำ EU Fit Check โดยคำนวณจากผู้ที่ตอบคำถามข้อนั้น ๆ ตัวเลขจะอัปเดตเมื่อมีผู้ทำแบบประเมินเพิ่มขึ้น
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: |-
  No sample size. See the note on the return value in `convex/stats.ts`: how

  many people have taken the check is PunProfile's own information, so the

  footnote says who was counted and not how many.
review:
  structural_calque: pass
  text_hash: 47d31bf5ec126d626c09fc01d0adafbeff0e3ae6ace62a8d147d31ffb94ea2ee
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::PROOF_HEADING`

```yaml
id: src/lib/content/coaching.ts::PROOF_HEADING
source: src/lib/content/coaching.ts
path: PROOF_HEADING
render: Coaching page, PROOF_HEADING
narrative_slot: utility
en: It is not that people are not trying.
th: ปัญหาไม่ใช่ว่าคุณพยายามไม่พอ
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: b7c6fb312402c8fa33fc3361cca56a4b955809ab558eec019fa32ccd40e950aa
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::PROOF_LINES[0].label`

```yaml
id: src/lib/content/coaching.ts::PROOF_LINES[0].label
source: src/lib/content/coaching.ts
path: PROOF_LINES[0].label
render: Coaching page, PROOF_LINES[0].label
narrative_slot: utility
en: have already started applying to roles in Europe
th: เริ่มสมัครงานในยุโรปไปแล้ว
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c160e9313781da85190548347d86f7eef52c297d39a65fb86727c63cce54e442
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::PROOF_LINES[1].label`

```yaml
id: src/lib/content/coaching.ts::PROOF_LINES[1].label
source: src/lib/content/coaching.ts
path: PROOF_LINES[1].label
render: Coaching page, PROOF_LINES[1].label
narrative_slot: utility
en: already have English at the level European job adverts ask for
th: มีทักษะภาษาอังกฤษอยู่ในระดับที่ประกาศงานในยุโรปต้องการ
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 03f04f5ec0fd8e4d5a2049a990dc0787b1ab38e94dd81ebd8b64f538f4c3c86c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/coaching.ts::PROOF_LINES[2].label`

```yaml
id: src/lib/content/coaching.ts::PROOF_LINES[2].label
source: src/lib/content/coaching.ts
path: PROOF_LINES[2].label
render: Coaching page, PROOF_LINES[2].label
narrative_slot: utility
en: are still applying with a CV that was never adapted to the European market
th: ยังสมัครงานด้วย CV ที่ไม่เคยปรับให้เข้ากับตลาดยุโรป
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 45d7941924aca661c24cfbce3679446ac68c220d99d9a67bb1288c3eaf8ac343
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/contact.ts::CONTACT_ALREADY_IN_QUEUE`

```yaml
id: src/lib/content/contact.ts::CONTACT_ALREADY_IN_QUEUE
source: src/lib/content/contact.ts
path: CONTACT_ALREADY_IN_QUEUE
render: Contact page, CONTACT_ALREADY_IN_QUEUE
narrative_slot: ask
en: If you have already taken the check and left your details, you are in the queue. No need to write as well.
th: ถ้าคุณทำแบบประเมินและฝากช่องทางติดต่อไว้แล้ว คุณอยู่ในคิวเรียบร้อย ไม่ต้องส่งข้อความมาซ้ำ
provenance: paul-approved
date: 17/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 17da3af3c1ebac6cdb25e3a85bc239d0b22852c290e7fec14eb0fd3d8bb1464b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/contact.ts::CONTACT_CHANNELS`

```yaml
id: src/lib/content/contact.ts::CONTACT_CHANNELS
source: src/lib/content/contact.ts
path: CONTACT_CHANNELS
render: Contact page, CONTACT_CHANNELS
narrative_slot: ask
en: We usually reply faster on Line. Email suits anything detailed, or when you want to attach a CV.
th: ปกติเราตอบทาง LINE ได้เร็วกว่า ส่วนอีเมลเหมาะกับคำถามที่มีรายละเอียดเยอะหรือเมื่อต้องการแนบ CV มาด้วย
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 17/08/2026. `ปกติเราตอบ` puts us in the sentence: it

  was the channel that was fast, and now it is us being faster on it,

  which is a thing we can be held to.

  *He wrote `LINE` and this says `Line`**, which is the one departure

  from his text. `channel-line` in `termbase.yml` is `fixed: true` with

  `LINE` explicitly banned, so the capitalisation is a decided term

  rather than a preference and `lint-thai` fails the build on it. If the

  decision should change, it changes in the termbase and everywhere at

  once.
review:
  structural_calque: pass
  text_hash: e6c9fa75cccb6999bee6c19df6f0f1cbc5a0a87870b363b9e7295b84b6cd119a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/contact.ts::CONTACT_HEADING`

```yaml
id: src/lib/content/contact.ts::CONTACT_HEADING
source: src/lib/content/contact.ts
path: CONTACT_HEADING
render: Contact page, CONTACT_HEADING
narrative_slot: utility
en: Contact
th: ติดต่อเรา
provenance: paul-approved
date: 17/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: be0531eea10a2b22293036dfbdfb20937a8a27867b5859f53db8debd8a998e00
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/contact.ts::CONTACT_INTRO`

```yaml
id: src/lib/content/contact.ts::CONTACT_INTRO
source: src/lib/content/contact.ts
path: CONTACT_INTRO
render: Contact page, CONTACT_INTRO
narrative_slot: ask
en: Whatever you want to ask about, the services, your result, or your data, just write. We read every message.
th: ไม่ว่าจะมีคำถามเรื่องบริการ ผลประเมิน หรือข้อมูลของคุณ ทักมาได้เลย เราอ่านทุกข้อความ
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 17/08/2026. `ไม่ว่าจะ` turns a list of three permitted

  subjects into an invitation that covers all of them, and drops the two

  repeated `เรื่อง`.
review:
  structural_calque: pass
  text_hash: 480ca254086cd4ca0f7fafb50c4ac06da5a2b9d52e3eae6bb55f449e6b5b4f82
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.assess.back`

```yaml
id: src/lib/content/copy.ts::COPY.assess.back
source: src/lib/content/copy.ts
path: COPY.assess.back
render: Assessment, the link back to the previous question
narrative_slot: utility
en: Back
th: ย้อนกลับ
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: ea29cdaebc4f5761a5b50732bc788661eb86619c8cc6b93dfdea066691096242
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.assess.busy`

```yaml
id: src/lib/content/copy.ts::COPY.assess.busy
source: src/lib/content/copy.ts
path: COPY.assess.busy
render: Assessment, when the session could not be created. Rate limit or network
narrative_slot: utility
en: We couldn't start your assessment just now. Please try again in a moment.
th: ยังเริ่ม EU Fit Check ไม่ได้ในตอนนี้ โปรดลองอีกครั้งในอีกสักครู่
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 8a3f435c8834e12b71b4a250de55ddf3ca98bef38954fb233bfb6c52eceffb36
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.assess.continue`

```yaml
id: src/lib/content/copy.ts::COPY.assess.continue
source: src/lib/content/copy.ts
path: COPY.assess.continue
render: Assessment, the button that moves to the next question
narrative_slot: utility
en: Continue
th: ไปต่อ
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 55a7353a8bc518d05a0e33e18b0b9eb0cf8a036b5d31401e28b214e412b334ef
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.assess.progress`

```yaml
id: src/lib/content/copy.ts::COPY.assess.progress
source: src/lib/content/copy.ts
path: COPY.assess.progress
render: Assessment, the step counter. {step} and {total} are substituted
narrative_slot: utility
en: '{step} / {total}'
th: '{step} / {total}'
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 6aff8223429b2c8505ee91e6cac877a34d323fe6d93eeea06d0860f77f231c3d
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.assess.retry`

```yaml
id: src/lib/content/copy.ts::COPY.assess.retry
source: src/lib/content/copy.ts
path: COPY.assess.retry
render: Assessment, the retry button beside that message
narrative_slot: utility
en: Try again
th: ลองใหม่อีกครั้ง
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 66a1979ba30b858fc05a4e3338f7f5b1de1558ea67ae0a0cdbc296ae92b4eed1
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.assess.starting`

```yaml
id: src/lib/content/copy.ts::COPY.assess.starting
source: src/lib/content/copy.ts
path: COPY.assess.starting
render: Assessment, while the session is created
narrative_slot: ask
en: Starting...
th: กำลังเตรียมข้อมูล...
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 74c95f771ad52c86df75e3873a0323d813b2c8a8f751b1762d2d0c6bc6766250
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.band.indicative`

```yaml
id: src/lib/content/copy.ts::COPY.band.indicative
source: src/lib/content/copy.ts
path: COPY.band.indicative
render: Candidate PDF, under a dimension score, when coverage is under 25%
narrative_slot: utility
en: an early indication only, and much of it needs a conversation before it gets any clearer
th: นี่เป็นเพียงผลประเมินเบื้องต้น หลายส่วนยังต้องพูดคุยเพิ่มเติมจึงจะประเมินได้ชัดเจนขึ้น
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 17/08/2026. `ผลประเมินเบื้องต้น` rather than `ภาพ`, which

  matches every other place the app names this thing, and `หลายส่วน` rather

  than `ส่วนใหญ่`: several parts, not most of it. The band is the lowest

  coverage tier and still should not overstate how little is known.
review:
  structural_calque: pass
  text_hash: 90e391ddbec94ab0290f6fe7f64c3bed73ea108b83f8035008bd7f7a68707ff9
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.band.limited`

```yaml
id: src/lib/content/copy.ts::COPY.band.limited
source: src/lib/content/copy.ts
path: COPY.band.limited
render: Candidate PDF, under a dimension score, when coverage is 25% to 45%
narrative_slot: limit
en: a partial read, several areas are still unmeasured
th: ประเมินได้บางส่วน และยังมีหลายหัวข้อที่ต้องพูดคุยเพิ่มเติม
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: e84911dd7cd5afa794645791183de42f410515b467c75f63dbe7c6796e62ee70
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.band.moderate`

```yaml
id: src/lib/content/copy.ts::COPY.band.moderate
source: src/lib/content/copy.ts
path: COPY.band.moderate
render: Candidate PDF, under a dimension score, when coverage is 45% or better
narrative_slot: utility
en: reasonably well covered by what you told us
th: ประเมินได้ค่อนข้างครบจากคำตอบของคุณ
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 4060a67e75d3e3700c74c3422ddec5de9e482ebb355572be06552d76e80406cc
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.dimension.employability`

```yaml
id: src/lib/content/copy.ts::COPY.dimension.employability
source: src/lib/content/copy.ts
path: COPY.dimension.employability
render: Spider chart axis
narrative_slot: utility
en: Employability
th: ความพร้อมในการสมัครงาน
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 27c98d11657bb89e77cfb3097bbcecfb44e97fd47563674a50bc97008188bb30
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.dimension.europeanMarketFit`

```yaml
id: src/lib/content/copy.ts::COPY.dimension.europeanMarketFit
source: src/lib/content/copy.ts
path: COPY.dimension.europeanMarketFit
render: Spider chart axis
narrative_slot: utility
en: European Market Fit
th: ความสอดคล้องกับตลาดยุโรป
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: a20935efc3ce315f03937fafb841c1b8ef13027f6e0dea6a3040f94f8d882027
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.dimension.mobilityReadiness`

```yaml
id: src/lib/content/copy.ts::COPY.dimension.mobilityReadiness
source: src/lib/content/copy.ts
path: COPY.dimension.mobilityReadiness
render: Spider chart axis
narrative_slot: utility
en: Mobility Readiness
th: ความพร้อมในการย้ายประเทศ
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 1ca56bacf2f77dc59ac2a125ca351f4c5b3b0ee03230d56a0208dfe433e5cc78
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.dimension.professionalCapability`

```yaml
id: src/lib/content/copy.ts::COPY.dimension.professionalCapability
source: src/lib/content/copy.ts
path: COPY.dimension.professionalCapability
render: Spider chart axis
narrative_slot: utility
en: Professional Capability
th: ทักษะในสายงาน
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 2a9f85f9b81e64ff4355b6d8cde123e15cd0ab6f5966e6cb18a9fef5856bccbd
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.english.switch.body`

```yaml
id: src/lib/content/copy.ts::COPY.english.switch.body
source: src/lib/content/copy.ts
path: COPY.english.switch.body
render: Assessment, the English switch panel
narrative_slot: utility
en: >-
  You said your English is B1 or better, so we switched the questions over so we can practice your English.
  You can go back to Thai whenever you like.
th: >-
  คุณระบุว่าภาษาอังกฤษของคุณอยู่ในระดับ B1 ขึ้นไป จึงเลือกทำคำถามที่เหลือเป็นภาษาอังกฤษเพื่อฝึกได้
  และเปลี่ยนกลับเป็นภาษาไทยได้ทุกเมื่อ
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 17/08/2026, and he added a reason the panel did not

  give: the switch is practice, not administration. It now says the same

  thing `SERVICES[0].includes[4]` says about the coaching sessions, which

  he wrote the same day.
review:
  structural_calque: pass
  text_hash: 68e87287df3325dfd011b99d612bf695429feda06f3800cc1237f0c085d70731
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.english.switch.revert`

```yaml
id: src/lib/content/copy.ts::COPY.english.switch.revert
source: src/lib/content/copy.ts
path: COPY.english.switch.revert
render: Assessment, the English switch panel, the way back
narrative_slot: utility
en: Back to Thai (ภาษาไทย)
th: กลับไปใช้ภาษาไทย
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  The English column carries the Thai too, because this is the one button

  whose reader is by definition the person not reading the English around

  it. An identical-in-both-columns passthrough would have said the same

  thing more cleanly and needs a termbase entry to be allowed, which is

  Paul's to decide rather than mine to add.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: cc305293eae7bd95216101ae3b114d2c996ca6e54ccfb792d129c4e366f84b4f
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.english.switch.stay`

```yaml
id: src/lib/content/copy.ts::COPY.english.switch.stay
source: src/lib/content/copy.ts
path: COPY.english.switch.stay
render: Assessment, the English switch panel, the primary button
narrative_slot: utility
en: Continue in English
th: ทำต่อเป็นภาษาอังกฤษ
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 8a75e27e2e96948113adced1091dcc24f6a3ee4aee227c000e7d90b47951526f
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.english.switch.title`

```yaml
id: src/lib/content/copy.ts::COPY.english.switch.title
source: src/lib/content/copy.ts
path: COPY.english.switch.title
render: Assessment, the panel after the English question is answered B1 or above
narrative_slot: utility
en: Let's finish this in English!
th: ลองทำแบบประเมินต่อเป็นภาษาอังกฤษไหม?
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 17/08/2026. `เลยดีกว่า` rather than `กันเลย`: the panel

  is proposing something, and `ดีกว่า` is how a Thai speaker proposes it.
review:
  structural_calque: pass
  text_hash: b5bcf07755200fa86da068c11c772ab44a6e40036279c9b6f9d6aadea81179fe
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.footer.brand`

```yaml
id: src/lib/content/copy.ts::COPY.footer.brand
source: src/lib/content/copy.ts
path: COPY.footer.brand
render: Footer, every screen
narrative_slot: utility
en: PunProfile Career Coaching | 2026 | All Rights Reserved
th: PunProfile Career Coaching | 2026 | All Rights Reserved
provenance: paul-approved
date: 15/08/2026
term_bindings:
  - footer-legal
decision_note: |-
  Not translated. The brand name, the year and a rights line read the same

  to both audiences, and a Thai transliteration of a legal formula reads

  as a mistake rather than as a courtesy.
review:
  structural_calque: pass
  text_hash: ab71364fdb2ecfd18c43e03e9d669036160c160c5eafd6e940e6a0f3380df2bf
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.gate.body`

```yaml
id: src/lib/content/copy.ts::COPY.gate.body
source: src/lib/content/copy.ts
path: COPY.gate.body
render: Contact step, under the heading. Says what happens next
narrative_slot: utility
en: Your name, and whichever channel suits you for us to get back to you.
th: กรอกชื่อและเลือกช่องทางที่สะดวกให้เราติดต่อกลับ
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 6c2fd8c81faab394e1249562e409e27e18e2d61f01f07a3a2f18d3e36d11a9f8
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.gate.channelHint`

```yaml
id: src/lib/content/copy.ts::COPY.gate.channelHint
source: src/lib/content/copy.ts
path: COPY.gate.channelHint
render: Contact gate, above the LINE and phone fields. Explains why one is required
narrative_slot: utility
en: Choose at least one channel so the team can reach you.
th: เลือกอย่างน้อยหนึ่งช่องทางให้ทีมติดต่อกลับได้
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 782b5f171aaf7387c0d0d1b7476e5a51bf8a6824c588fab5ce12a6b91aaa038e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.gate.email`

```yaml
id: src/lib/content/copy.ts::COPY.gate.email
source: src/lib/content/copy.ts
path: COPY.gate.email
render: Contact gate, email field label
narrative_slot: utility
en: Email
th: อีเมล
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: a84c4b8c0704df5c212c7bb1f7ab937e0d90bb602645a37b99a6fb7e5235735f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.gate.error.channel_required`

```yaml
id: src/lib/content/copy.ts::COPY.gate.error.channel_required
source: src/lib/content/copy.ts
path: COPY.gate.error.channel_required
render: Contact gate, when neither LINE nor phone was given
narrative_slot: utility
en: Please add a LINE ID or a phone number.
th: กรอก LINE ID หรือหมายเลขโทรศัพท์อย่างน้อย 1 ช่องทาง
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 56a57898eed52221824a19a6af41d904d78f799cc28305db07f174d391e601ba
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.gate.error.consent_email`

```yaml
id: src/lib/content/copy.ts::COPY.gate.error.consent_email
source: src/lib/content/copy.ts
path: COPY.gate.error.consent_email
render: Contact gate, when email consent is unticked
narrative_slot: utility
en: We need your permission before we can send anything.
th: โปรดยินยอมให้เราส่งผลทางอีเมลก่อน
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 9b82a62d11f73d369b9ff0b15e628688c6d5e20053edc62f31a9e16f86ef1c05
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.gate.error.consent_line`

```yaml
id: src/lib/content/copy.ts::COPY.gate.error.consent_line
source: src/lib/content/copy.ts
path: COPY.gate.error.consent_line
render: Contact gate, when a LINE ID was given without consent
narrative_slot: utility
en: Tick the consent for LINE, or clear the ID.
th: โปรดยินยอมให้เราติดต่อทาง LINE หรือลบ LINE ID ออก
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 4b76b13db7ed4d3eacf64ce23600b847d6e7b9f69259697b581500784c749497
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.gate.error.consent_phone`

```yaml
id: src/lib/content/copy.ts::COPY.gate.error.consent_phone
source: src/lib/content/copy.ts
path: COPY.gate.error.consent_phone
render: Contact gate, when a phone was given without consent
narrative_slot: utility
en: Tick the consent for phone, or clear the number.
th: โปรดยินยอมให้เราติดต่อทางโทรศัพท์ หรือลบหมายเลขโทรศัพท์ออก
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: aab7f6f817676857179814f59f472b698fe7235f96bae081db474ccf21916add
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.gate.error.email_invalid`

```yaml
id: src/lib/content/copy.ts::COPY.gate.error.email_invalid
source: src/lib/content/copy.ts
path: COPY.gate.error.email_invalid
render: Contact gate, when the email is missing or malformed
narrative_slot: utility
en: That email doesn't look right. Please check it.
th: อีเมลไม่ถูกต้อง
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c5d8e0591fefb2eed72fb5edae376c147a418e7787fad4f639e76891c4258449
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.gate.error.first_name_required`

```yaml
id: src/lib/content/copy.ts::COPY.gate.error.first_name_required
source: src/lib/content/copy.ts
path: COPY.gate.error.first_name_required
render: Contact step, when the first name is empty
narrative_slot: utility
en: Please enter your first name.
th: กรุณากรอกชื่อ
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: b14082e173d3a2e9aeac55f00541f5818e0285fff2f2f75176168b2a8e59abfe
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.gate.error.last_name_required`

```yaml
id: src/lib/content/copy.ts::COPY.gate.error.last_name_required
source: src/lib/content/copy.ts
path: COPY.gate.error.last_name_required
render: Contact step, when the last name is empty
narrative_slot: utility
en: Please enter your last name.
th: กรุณากรอกนามสกุล
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 65f5e59b3d4d5909795e769fdaa5f4581cfd05b1929ab0a9e289e1b32c7f019b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.gate.error.unknown`

```yaml
id: src/lib/content/copy.ts::COPY.gate.error.unknown
source: src/lib/content/copy.ts
path: COPY.gate.error.unknown
render: Contact gate, any failure with no specific cause. Network, mostly
narrative_slot: utility
en: That didn't go through. Please try again.
th: ส่งข้อมูลไม่สำเร็จ โปรดลองอีกครั้ง
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 4ceb56161af90cb62d57265ccb1152222cbcae0caa45e3c18c9233a4249e8eb8
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.gate.firstName`

```yaml
id: src/lib/content/copy.ts::COPY.gate.firstName
source: src/lib/content/copy.ts
path: COPY.gate.firstName
render: Contact step, first name field label
narrative_slot: utility
en: First name
th: ชื่อ
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c2d51368be49d3aa7d01cbe1724fed4bc719c50c5c00ee5f8996dfdd73dc232c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.gate.heading`

```yaml
id: src/lib/content/copy.ts::COPY.gate.heading
source: src/lib/content/copy.ts
path: COPY.gate.heading
render: Contact step, the heading. Last step of the survey
narrative_slot: utility
en: Last step
th: ขั้นตอนสุดท้าย
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: cf35987354db462f9c37c5a43010c9ce1fef7dbdb08d2be83ab250976c29d357
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.gate.lastName`

```yaml
id: src/lib/content/copy.ts::COPY.gate.lastName
source: src/lib/content/copy.ts
path: COPY.gate.lastName
render: Contact step, last name field label
narrative_slot: utility
en: Last name
th: นามสกุล
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: e047ecbc0dc4ff081a00343b7e73e3774ccd90be1670160c27429c58cbf9083b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.gate.lineId`

```yaml
id: src/lib/content/copy.ts::COPY.gate.lineId
source: src/lib/content/copy.ts
path: COPY.gate.lineId
render: Contact gate, LINE ID field label
narrative_slot: utility
en: LINE ID
th: LINE ID
provenance: paul-approved
date: 15/08/2026
term_bindings:
  - field-line-id
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 8aab2b16aac529cdb87d5d55ca64b53af5087de515267f8c426e260235903045
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.gate.phone`

```yaml
id: src/lib/content/copy.ts::COPY.gate.phone
source: src/lib/content/copy.ts
path: COPY.gate.phone
render: Contact gate, phone field label
narrative_slot: utility
en: Phone number
th: เบอร์โทร
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: af3dfc9aaba34ca0b787fa441ef3c4f421dc60404877679f76e0f26789d70968
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.gate.submit`

```yaml
id: src/lib/content/copy.ts::COPY.gate.submit
source: src/lib/content/copy.ts
path: COPY.gate.submit
render: Contact step, the submit button
narrative_slot: utility
en: See my first read
th: ดูผลเบื้องต้นได้เลย
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 3b11bf7ea9bf379c45d105e8cdad8d9332607bc2eea00598cb54b920ea2c63de
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.gate.working`

```yaml
id: src/lib/content/copy.ts::COPY.gate.working
source: src/lib/content/copy.ts
path: COPY.gate.working
render: Contact gate, submit button while the write is in flight
narrative_slot: utility
en: Working...
th: กำลังบันทึกข้อมูล...
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: d637c1c1e768f3e4e1f381e636e94f050bc6da0d070063e639ab625f34f5e26f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.item.aiDigitalFluency`

```yaml
id: src/lib/content/copy.ts::COPY.item.aiDigitalFluency
source: src/lib/content/copy.ts
path: COPY.item.aiDigitalFluency
render: Named when this is the candidate's strongest area
narrative_slot: utility
en: AI & Digital Fluency
th: ทักษะการใช้ AI และเครื่องมือดิจิทัล
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 44ac921d904ded3db685f1e001a6e573482dca10cdff76e27a6c9ee16e47710d
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.item.applicationActivity`

```yaml
id: src/lib/content/copy.ts::COPY.item.applicationActivity
source: src/lib/content/copy.ts
path: COPY.item.applicationActivity
render: Named when this is the candidate's strongest area
narrative_slot: utility
en: Application Activity
th: การลงมือสมัครงาน
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: e0c9161b84a41fd7a1f1b1644991eca1f41776a82edcf30992fe65a316a4601f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.item.businessEnglish`

```yaml
id: src/lib/content/copy.ts::COPY.item.businessEnglish
source: src/lib/content/copy.ts
path: COPY.item.businessEnglish
render: Named when this is the candidate's strongest area
narrative_slot: utility
en: Business English
th: ภาษาอังกฤษสำหรับการทำงาน
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 61f15fe999a42a421d2cc49f2422b59106111926423066deef51e6b2e3ec7b62
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.item.collaboration`

```yaml
id: src/lib/content/copy.ts::COPY.item.collaboration
source: src/lib/content/copy.ts
path: COPY.item.collaboration
render: Depth chart, an unscored axis
narrative_slot: utility
en: Collaboration
th: การทำงานร่วมกับผู้อื่น
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: |-
  Paul, 23/08/2026: `ผู้อื่น` over the draft's `คนอื่น`. The formal form on an

  axis label, against the register note above.
review:
  structural_calque: pass
  text_hash: faa6d5318b0aaec212e473d4648de372b45a3a50a2a661eb47791cc4cdf49589
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.item.communication`

```yaml
id: src/lib/content/copy.ts::COPY.item.communication
source: src/lib/content/copy.ts
path: COPY.item.communication
render: Depth chart, an unscored axis
narrative_slot: utility
en: Communication
th: การสื่อสารในที่ทำงาน
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: Drafted 21/08/2026, read back and approved unchanged 23/08/2026.
review:
  structural_calque: pass
  text_hash: 87aa3616db4b5508087b14a49a14bde8db4644def2ff985a9c5223b57baf4ebe
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.item.countryReach`

```yaml
id: src/lib/content/copy.ts::COPY.item.countryReach
source: src/lib/content/copy.ts
path: COPY.item.countryReach
render: Named when this is the candidate's strongest or weakest area
narrative_slot: utility
en: Country Reach
th: ประเทศเป้าหมายที่คุณมีโอกาสไปทำงานได้จริง
provenance: paul-approved
date: 13/08/2026
term_bindings: []
decision_note: |-
  Draft, 13/08/2026, for Paul to correct. "Countries you can actually work

  in", rather than a literal rendering of "reach", which has no natural Thai

  noun here. Deliberately says ทำงาน rather than ไป: the item is about being

  employable there, not about being able to travel there.
review:
  structural_calque: pass
  text_hash: afd390a5237cba4491e548a52f176e9e3aafba385abc14da2edf813cd9072f33
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.item.cvStatus`

```yaml
id: src/lib/content/copy.ts::COPY.item.cvStatus
source: src/lib/content/copy.ts
path: COPY.item.cvStatus
render: Named when this is the candidate's strongest area
narrative_slot: utility
en: CV Status
th: ความพร้อมของ CV
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: e0e6f804958610d76068702142afea53a48fa2f1bbb43d11db6793378912adde
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.item.execution`

```yaml
id: src/lib/content/copy.ts::COPY.item.execution
source: src/lib/content/copy.ts
path: COPY.item.execution
render: Depth chart, an unscored axis
narrative_slot: utility
en: Execution
th: การผลักดันงานให้สำเร็จ
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: |-
  Drafted 21/08/2026, read back and approved unchanged 23/08/2026. Avoids

  `ลงมือ`, which already carries item.applicationActivity,

  item.searchFollowThrough and teaser.nextStep.
review:
  structural_calque: pass
  text_hash: 88c66b04b61ce384c063b4608c00cdcd0bdbf5486c51e93cd1a2218a214b469b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.item.experienceDepth`

```yaml
id: src/lib/content/copy.ts::COPY.item.experienceDepth
source: src/lib/content/copy.ts
path: COPY.item.experienceDepth
render: Named when this is the candidate's strongest area
narrative_slot: utility
en: Experience Depth
th: ประสบการณ์ในสายงาน
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: e66680c7b74a4d4c3f227387c9227bc3b5c63eed5eca63fd3b089e05f7fbd2c1
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.item.familyReadiness`

```yaml
id: src/lib/content/copy.ts::COPY.item.familyReadiness
source: src/lib/content/copy.ts
path: COPY.item.familyReadiness
render: Named when this is the candidate's strongest area
narrative_slot: utility
en: Family Readiness
th: ความพร้อมของครอบครัวในการย้ายประเทศ
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 56f29597d71341bf0eb298b92c52c73244ab01ce7e01a903716dae2deba93cd9
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.item.languageReadiness`

```yaml
id: src/lib/content/copy.ts::COPY.item.languageReadiness
source: src/lib/content/copy.ts
path: COPY.item.languageReadiness
render: Named when this is the candidate's strongest area
narrative_slot: utility
en: Language Readiness
th: ความพร้อมด้านภาษา
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: f03484d3f6a6322847af2530d17639f3a3b29690af9f8cbded921cc6ad00bc52
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.item.leadershipOwnership`

```yaml
id: src/lib/content/copy.ts::COPY.item.leadershipOwnership
source: src/lib/content/copy.ts
path: COPY.item.leadershipOwnership
render: Depth chart, an unscored axis
narrative_slot: utility
en: Leadership & Ownership
th: ภาวะผู้นำและความรับผิดชอบต่องาน
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: |-
  Paul, 23/08/2026, from `การนำทีมและรับผิดชอบงาน`. `ภาวะผู้นำ` restored, and

  `ความรับผิดชอบต่องาน` is ownership of the work rather than of a team, which

  is what the item measures for candidates who lead nobody.
review:
  structural_calque: pass
  text_hash: 92198a346cece566c4a4c51e0b718c8bfaea94f4c4bf795d4f0aec859baa35d0
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.item.learningAgility`

```yaml
id: src/lib/content/copy.ts::COPY.item.learningAgility
source: src/lib/content/copy.ts
path: COPY.item.learningAgility
render: Depth chart, an unscored axis
narrative_slot: utility
en: Learning Agility
th: การเรียนรู้และปรับตัวได้เร็ว
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: |-
  Paul, 23/08/2026, from his own `การปรับตัวกับสิ่งแวดล้อม` of 21/08. This closes

  the flag that stood on it: `สิ่งแวดล้อม` read as adapting to surroundings,

  where the ECRA indicators are about picking things up quickly. The new

  wording names both halves, learning and adapting fast.
review:
  structural_calque: pass
  text_hash: 1604b354e3fe4c8954b4d48b79012ff252852dc1a2e6dc5ed2ffa5cc89372885
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.item.learningInvestment`

```yaml
id: src/lib/content/copy.ts::COPY.item.learningInvestment
source: src/lib/content/copy.ts
path: COPY.item.learningInvestment
render: Named when this is the candidate's strongest area
narrative_slot: utility
en: Learning Investment
th: การเรียนรู้และพัฒนาทักษะ
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 0b71ab7a8cc28eff4abd0c2a691d4b4df90f677cccd6f81a943709288b0877e4
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.item.linkedinStatus`

```yaml
id: src/lib/content/copy.ts::COPY.item.linkedinStatus
source: src/lib/content/copy.ts
path: COPY.item.linkedinStatus
render: Named when this is the candidate's strongest area
narrative_slot: utility
en: LinkedIn Status
th: ความพร้อมของ LinkedIn
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 3eedc7d8ccf4544cf5bf76567d50ee050cab0cadd756b9f61f85c6a863399516
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.item.portfolioEvidence`

```yaml
id: src/lib/content/copy.ts::COPY.item.portfolioEvidence
source: src/lib/content/copy.ts
path: COPY.item.portfolioEvidence
render: Named when this is the candidate's strongest area
narrative_slot: proof
en: Portfolio Evidence
th: ความพร้อมของ Portfolio
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 416cfdb1035e50451c08ee061e398fe495a071fc07f1677579ecb022a2328fe8
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.item.problemSolving`

```yaml
id: src/lib/content/copy.ts::COPY.item.problemSolving
source: src/lib/content/copy.ts
path: COPY.item.problemSolving
render: Depth chart, an unscored axis
narrative_slot: symptom
en: Problem Solving
th: การวิเคราะห์และแก้ปัญหา
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: |-
  Paul, 23/08/2026, from `การแก้ปัญหาหน้างาน`. Adds the analysis half and drops

  `หน้างาน`, which had narrowed it to problems that arrive at your desk.
review:
  structural_calque: pass
  text_hash: 183feac89ee9498cc876e6d8d216ded59cf559c0eeccf47ab99bb7ee21df6e86
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.item.relocationTimeline`

```yaml
id: src/lib/content/copy.ts::COPY.item.relocationTimeline
source: src/lib/content/copy.ts
path: COPY.item.relocationTimeline
render: Named when this is the candidate's strongest area
narrative_slot: utility
en: Relocation Timeline
th: ช่วงเวลาที่พร้อมย้ายประเทศ
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: dcc697959a1ab9d8d0051eaaf9851189adaa639f13795e7eda8c9095bc7a1ef7
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.item.salaryStated`

```yaml
id: src/lib/content/copy.ts::COPY.item.salaryStated
source: src/lib/content/copy.ts
path: COPY.item.salaryStated
render: Named when this is the candidate's strongest area
narrative_slot: utility
en: Salary Expectation Stated
th: ความชัดเจนของเงินเดือนที่คาดหวัง
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 34e2420f4ca08c5bb8b32a9b17cbefa950be7a6665940a954fd14fd52caf9342
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.item.searchFollowThrough`

```yaml
id: src/lib/content/copy.ts::COPY.item.searchFollowThrough
source: src/lib/content/copy.ts
path: COPY.item.searchFollowThrough
render: Named when this is the candidate's strongest area
narrative_slot: utility
en: Search Follow-through
th: การลงมือหางานอย่างต่อเนื่อง
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 18ac91d476bf52160de55b423c0c32ff8180052500da87d3e420e2f72d0f556c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.item.strategicThinking`

```yaml
id: src/lib/content/copy.ts::COPY.item.strategicThinking
source: src/lib/content/copy.ts
path: COPY.item.strategicThinking
render: Depth chart, an unscored axis
narrative_slot: utility
en: Strategic Thinking
th: การคิดเชิงกลยุทธ์
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: |-
  Paul, 23/08/2026, from `การคิดและวางแผนระยะยาว`. The direct term, matching

  the English label rather than paraphrasing it.
review:
  structural_calque: pass
  text_hash: 4073456513507cfe0b93971cbfe59ce2093a48f654da57a821aa3b07663cae63
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.item.targetClarity`

```yaml
id: src/lib/content/copy.ts::COPY.item.targetClarity
source: src/lib/content/copy.ts
path: COPY.item.targetClarity
render: Named when this is the candidate's strongest area
narrative_slot: utility
en: Target Clarity
th: ความชัดเจนของเป้าหมาย
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 3008934eaf52095908a4b719c57834ea91401fa3050d4a69ff1aca00c26a7ff6
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.item.technicalExpertise`

```yaml
id: src/lib/content/copy.ts::COPY.item.technicalExpertise
source: src/lib/content/copy.ts
path: COPY.item.technicalExpertise
render: Depth chart, an unscored axis
narrative_slot: utility
en: Technical Expertise
th: ความเชี่ยวชาญในสายงาน
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: |-
  Paul, 23/08/2026, from `ความเชี่ยวชาญในงานที่ทำ`. `สายงาน` is the field, which

  is what an axis label wants; `งานที่ทำ` was the current job. Still distinct

  from item.experienceDepth, which is how long rather than how deep.
review:
  structural_calque: pass
  text_hash: e6d52fce5bb209a1909e4f569a431f9b353be8c4e931439c7142f647c6e515c0
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.item.visaReadiness`

```yaml
id: src/lib/content/copy.ts::COPY.item.visaReadiness
source: src/lib/content/copy.ts
path: COPY.item.visaReadiness
render: Named when this is the candidate's strongest area
narrative_slot: utility
en: Visa Readiness
th: ความพร้อมด้านวีซ่า
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: d4925e7fb5f72f21416895a90e5cb2e759e0a5e88fe9d57cc4cc14022179621c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.landing.eyebrow`

```yaml
id: src/lib/content/copy.ts::COPY.landing.eyebrow
source: src/lib/content/copy.ts
path: COPY.landing.eyebrow
render: Landing, above the headline
narrative_slot: utility
en: Career coaching for Thai professionals heading to Europe
th: โค้ชชิ่งด้านอาชีพสำหรับคนไทยที่ตั้งเป้าไปทำงานในยุโรป
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  Names the business, not the assessment. Same phrasing as the footer's

  Coaching column heading, which is Paul's.

  *Paul's wording, 17/08/2026**, from the review sheet. He took

  `แคเรียร์` off the front: `โค้ชชิ่งด้านอาชีพ` reads as the category, and

  `แคเรียร์โค้ชชิ่ง` is the service name, which belongs on the card in

  section 3 rather than in the line that says who this site is for.
review:
  structural_calque: pass
  text_hash: 93c8099802f295120e5c1ed3474bf8e2c1fa358fc709b205d3ac75da2e3b7b79
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.landing.headline`

```yaml
id: src/lib/content/copy.ts::COPY.landing.headline
source: src/lib/content/copy.ts
path: COPY.landing.headline
render: Landing, and the site's default page title
narrative_slot: utility
en: From the day you thought “I want to work in Europe” to the day you sign a real contract.
th: จากวันที่คิดว่า “อยากไปทำงานที่ยุโรป” สู่วันที่ได้เซ็นสัญญาจ้างจริง
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  professionals go from "I want to work in Europe" to "I have a signed

  contract". This is that sentence turned to face the reader.

  *Paul's wording, 17/08/2026.** Two changes, and both are the same move:

  `จากวันที่คิดว่า` rather than a bare `จาก`, and `สู่วันที่` rather than

  `ถึงวันที่`, so the sentence runs day to day rather than phrase to day.

  The reader is placed at a moment they can remember having, which is what

  the quoted thought was always for.

  He also put `ที่ยุโรป` back inside the quotation marks, where my revision

  had corrected it to `ในยุโรป` on the evidence of his own prose. That was

  the wrong correction to make: the quote is someone thinking out loud, and

  it should sound like speech rather than like the page around it.
review:
  structural_calque: pass
  text_hash: c59bd1363a8f847715c2e23da3ff2e36cb4d6f1b817d17bfa5a41116a0470c23
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.landing.reassurance`

```yaml
id: src/lib/content/copy.ts::COPY.landing.reassurance
source: src/lib/content/copy.ts
path: COPY.landing.reassurance
render: Landing, under the button
narrative_slot: utility
en: Under 2 minutes. Your first read straight away, with no sign-up.
th: ใช้เวลาไม่ถึง 2 นาที รู้ผลเบื้องต้นทันที ไม่ต้องสมัครสมาชิก
provenance: paul-approved
date: 17/08/2026
term_bindings: []
decision_note: |-
  Revised by Paul 17/08/2026, from his own 15/08 wording. Three clauses

  instead of one sentence with a trailing `โดย`, which is the shape the rest

  of this hero now has.
review:
  structural_calque: pass
  text_hash: 65ab7984c21b6038acf645820dfc75132a67cd12d5365d80265171de15141c90
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.landing.subhead`

```yaml
id: src/lib/content/copy.ts::COPY.landing.subhead
source: src/lib/content/copy.ts
path: COPY.landing.subhead
render: Landing, and the site's default meta description
narrative_slot: utility
en: >-
  PunProfile works alongside Thai professionals who have decided on the European job market, from setting the
  career direction and reworking the profile through to applying one role at a time.
th: >-
  PunProfile ทำงานร่วมกับคนไทยที่ตัดสินใจแล้วว่าจะมุ่งสู่ตลาดงานยุโรป ตั้งแต่การวางทิศทางอาชีพและปรับโปรไฟล์
  ไปจนถึงการสมัครงานทีละตำแหน่ง
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  First mention of the brand in running Thai, so it takes the gloss:

  LR-01, ปั้นโปรไฟล์ (PunProfile) first, PunProfile alone afterwards.

  *Paul's wording, 17/08/2026.** `ทำงานร่วมกับ` rather than `ทำงานกับ`,

  which is the difference between working with someone and working

  alongside them. `ตลาดงานยุโรป` rather than `ยุโรป`: the decision a reader

  has made is about a job market, not about a continent. And

  `การสมัครงานทีละตำแหน่ง` rather than `การลงมือสมัครแต่ละตำแหน่ง`, which

  says the same thing in three fewer syllables.
review:
  structural_calque: pass
  text_hash: f5036ffcc5e37ab2dc66a4e6091438792a4174ede17f5d6334b08b1e0bbf0611
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.lang.body`

```yaml
id: src/lib/content/copy.ts::COPY.lang.body
source: src/lib/content/copy.ts
path: COPY.lang.body
render: Stage 2, language grid
narrative_slot: utility
en: This helps identify which countries are realistic options for you.
th: คำตอบนี้ช่วยระบุว่าประเทศใดเป็นตัวเลือกที่เป็นไปได้จริงสำหรับคุณ
provenance: paul-written
date: 25/08/2026
term_bindings: []
decision_note: |-
  Both halves rewritten 25/08/2026, Paul, and the English moved with the
  Thai rather than being left behind.
  It said the answer CHANGES which countries are open, which overstates
  what one question does: it identifies, it does not decide. The old Thai
  also claimed an effect on positions as well as countries, and this grid
  feeds Country Reach only.
review:
  structural_calque: pass
  text_hash: 3cdde216592888421a082e875a0c0a109998281d7d3e51dca3a16a02aa19be40
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.lang.heading`

```yaml
id: src/lib/content/copy.ts::COPY.lang.heading
source: src/lib/content/copy.ts
path: COPY.lang.heading
render: Stage 2, language grid
narrative_slot: utility
en: Do you speak any other European languages?
th: นอกจากภาษาอังกฤษแล้ว คุณใช้ภาษายุโรปอื่นได้ไหม?
provenance: paul-approved
date: 25/08/2026
term_bindings: []
decision_note: |-
  Read back 25/08/2026. `แล้ว` after the English clause and `ได้ไหม`

  rather than `ได้อีกไหม`: the old one asked whether they could speak one

  MORE, which reads as a follow-up to a question nobody asked.
review:
  structural_calque: pass
  text_hash: 1c43d5d0d251d591dcec746ac2e863510a2581c9534820b08e5bc11aaa22a697
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.lang.levelLabel`

```yaml
id: src/lib/content/copy.ts::COPY.lang.levelLabel
source: src/lib/content/copy.ts
path: COPY.lang.levelLabel
render: Stage 2, language grid
narrative_slot: utility
en: level
th: ระดับภาษา
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 5f23e08942c7b5daea9e6a50172258ff991a55f7be2e409f8594653f9b34189c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.lang.name.czech`

```yaml
id: src/lib/content/copy.ts::COPY.lang.name.czech
source: src/lib/content/copy.ts
path: COPY.lang.name.czech
render: Stage 2, language grid
narrative_slot: utility
en: Czech
th: เช็ก
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 2bd15891e615d1fb264ba5966f496ac51e352a5e92348751c001ebafbea22de7
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.lang.name.danish`

```yaml
id: src/lib/content/copy.ts::COPY.lang.name.danish
source: src/lib/content/copy.ts
path: COPY.lang.name.danish
render: Stage 2, language grid
narrative_slot: utility
en: Danish
th: เดนมาร์ก
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 934f906e85816a149c81f6882129416472315dc4b823358ce8d2d5d15baf9f4c
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.lang.name.dutch`

```yaml
id: src/lib/content/copy.ts::COPY.lang.name.dutch
source: src/lib/content/copy.ts
path: COPY.lang.name.dutch
render: Stage 2, language grid
narrative_slot: utility
en: Dutch
th: ดัตช์
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 842091b2bca432b714bd04b0a0c929cb4ca31a026cb0839321e145200d95d99e
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.lang.name.finnish`

```yaml
id: src/lib/content/copy.ts::COPY.lang.name.finnish
source: src/lib/content/copy.ts
path: COPY.lang.name.finnish
render: Stage 2, language grid
narrative_slot: utility
en: Finnish
th: ฟินแลนด์
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 19da778a763bd69ce02a8b2b325dc06a56bee9d1a7b71386c1cb70528f430367
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.lang.name.french`

```yaml
id: src/lib/content/copy.ts::COPY.lang.name.french
source: src/lib/content/copy.ts
path: COPY.lang.name.french
render: Stage 2, language grid
narrative_slot: utility
en: French
th: ฝรั่งเศส
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 1356494174f8dbd744604d994dd3db730294c0f17071502a737df0b6bf2b5673
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.lang.name.german`

```yaml
id: src/lib/content/copy.ts::COPY.lang.name.german
source: src/lib/content/copy.ts
path: COPY.lang.name.german
render: Stage 2, language grid
narrative_slot: utility
en: German
th: เยอรมัน
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: ab2b3d414ce2b12f0ee1ca2314716a2965edcfe3b44f25af4a6e1ae1466f15b2
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.lang.name.italian`

```yaml
id: src/lib/content/copy.ts::COPY.lang.name.italian
source: src/lib/content/copy.ts
path: COPY.lang.name.italian
render: Stage 2, language grid
narrative_slot: utility
en: Italian
th: อิตาลี
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: c9b4ff68ad7601808ffca5b3549f414bb1709666ef8352868599e3dcc1c4fee5
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.lang.name.norwegian`

```yaml
id: src/lib/content/copy.ts::COPY.lang.name.norwegian
source: src/lib/content/copy.ts
path: COPY.lang.name.norwegian
render: Stage 2, language grid
narrative_slot: utility
en: Norwegian
th: นอร์เวย์
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 3a7745470ab5a6b7c9deb36dde50f125ff7ae0e47f070fc4f7c0db7ed6f9f3c4
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.lang.name.polish`

```yaml
id: src/lib/content/copy.ts::COPY.lang.name.polish
source: src/lib/content/copy.ts
path: COPY.lang.name.polish
render: Stage 2, language grid
narrative_slot: utility
en: Polish
th: โปแลนด์
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 3eee06934f440c622f9586ed15584a7292ed8a617d376a5c99d7d39660ea65a5
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.lang.name.portuguese`

```yaml
id: src/lib/content/copy.ts::COPY.lang.name.portuguese
source: src/lib/content/copy.ts
path: COPY.lang.name.portuguese
render: Stage 2, language grid
narrative_slot: utility
en: Portuguese
th: โปรตุเกส
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 662969c98818eede3b528ea97c3def47f6b01cd7108b57f84db058ec9d1e7799
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.lang.name.spanish`

```yaml
id: src/lib/content/copy.ts::COPY.lang.name.spanish
source: src/lib/content/copy.ts
path: COPY.lang.name.spanish
render: Stage 2, language grid
narrative_slot: utility
en: Spanish
th: สเปน
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: ab8b21a3d5d04f37ed37e5f1596d8dd94058fd5517e635bb33ff320e9a8730ca
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.lang.name.swedish`

```yaml
id: src/lib/content/copy.ts::COPY.lang.name.swedish
source: src/lib/content/copy.ts
path: COPY.lang.name.swedish
render: Stage 2, language grid
narrative_slot: utility
en: Swedish
th: สวีเดน
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: b69dd51393a2e45295624a40e5777217e1f95a22e2c41778ddf459435ea30a5f
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.lang.scale`

```yaml
id: src/lib/content/copy.ts::COPY.lang.scale
source: src/lib/content/copy.ts
path: COPY.lang.scale
render: Stage 2, language grid
narrative_slot: utility
en: A1 beginner, B2 working proficiency, C2 highly proficient.
th: A1 ระดับเริ่มต้น, B2 ใช้ทำงานได้, C2 ใช้ภาษาได้อย่างเชี่ยวชาญ
provenance: paul-written
date: 25/08/2026
term_bindings: []
decision_note: |-
  **C2 is not native-level.** Paul, 25/08/2026, and it is a factual
  correction rather than a wording preference: CEFR defines C2 as highly
  proficient, and a native speaker is not a CEFR level at all. Telling a
  candidate that C2 means native-like invites them to under-tick, which
  this grid scores.
review:
  structural_calque: pass
  text_hash: fe7dde226596552d6930b67a949a9e908fe01feba1dc63491f93ad6e7fd6b007
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.lang.skip`

```yaml
id: src/lib/content/copy.ts::COPY.lang.skip
source: src/lib/content/copy.ts
path: COPY.lang.skip
render: Stage 2, language grid
narrative_slot: utility
en: I don't speak another European language.
th: ไม่ได้พูดภาษายุโรปอื่น
provenance: paul-approved
date: 25/08/2026
term_bindings: []
decision_note: |-
  Rewritten 25/08/2026. "another" alone left the noun to the heading, which
  is fine on screen and wrong as a button label read on its own by a screen
  reader. The Thai also dropped `ยัง`, which framed not speaking one as a
  state the candidate is still in rather than a plain answer.
review:
  structural_calque: pass
  text_hash: 3ec944fbd69908101026b72bebc817400d4ea977511432de4a2a3bbf223b4e6b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.lang.submit`

```yaml
id: src/lib/content/copy.ts::COPY.lang.submit
source: src/lib/content/copy.ts
path: COPY.lang.submit
render: Stage 2, language grid
narrative_slot: utility
en: Continue
th: ไปต่อ
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 55a7353a8bc518d05a0e33e18b0b9eb0cf8a036b5d31401e28b214e412b334ef
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.menu.promo`

```yaml
id: src/lib/content/copy.ts::COPY.menu.promo
source: src/lib/content/copy.ts
path: COPY.menu.promo
render: Site menu, the card at the foot of the drawer
narrative_slot: utility
en: Not sure where to start?
th: ยังไม่รู้ว่าจะเริ่มตรงไหน
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: c9918a52ec960f2006ff19394b3b9a70dbfa52a1bb16a6e9bb69e803c23d559b
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.nav.allProducts`

```yaml
id: src/lib/content/copy.ts::COPY.nav.allProducts
source: src/lib/content/copy.ts
path: COPY.nav.allProducts
render: Site menu, the Products group
narrative_slot: utility
en: All products
th: บริการทั้งหมด
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: e52f61b8178a06469ecc201067161817c991926699a267ab6a87a1f88a1ac088
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.nav.assess`

```yaml
id: src/lib/content/copy.ts::COPY.nav.assess
source: src/lib/content/copy.ts
path: COPY.nav.assess
render: Site menu, the one action in the list
narrative_slot: utility
en: EU Fit Check
th: EU Fit Check
provenance: paul-approved
date: 15/08/2026
term_bindings:
  - product-eu-fit-check
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 7ae9e3e4001863e709a469f1869c47b8f8c2602e150e67572122b07756d09f9f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.nav.blog`

```yaml
id: src/lib/content/copy.ts::COPY.nav.blog
source: src/lib/content/copy.ts
path: COPY.nav.blog
render: Site menu
narrative_slot: utility
en: Blog
th: Blog
provenance: paul-approved
date: 10/09/2026
term_bindings:
  - nav-blog
decision_note: |-
  English in both columns, on Paul's call 16/08/2026, joining the five nav

  items decided the same way on 15/08/2026. It was drafted as บทความ, which

  is correct Thai and was the wrong answer: it would have made this the one

  item in the menu that translates, and a menu that is English except for

  one word reads as an oversight rather than as a choice.

  `nav-blog` in `termbase.yml` is what records that, and it is not optional

  bookkeeping. Without the entry, `lint-thai.ts` fails this string under

  LR-01, and it is right to: an English word in the Thai column is a decided

  passthrough or an untranslated key, and the termbase is the only thing

  that can tell those apart.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: a3999a477b5b7d5ac3cf03db19d9e792a550fca431184cf6f3ef4398b2a94652
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.nav.brand`

```yaml
id: src/lib/content/copy.ts::COPY.nav.brand
source: src/lib/content/copy.ts
path: COPY.nav.brand
render: Header, every screen
narrative_slot: utility
en: PunProfile
th: PunProfile
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: The wordmark is a fixed asset and never translated or transliterated.
review:
  structural_calque: pass
  text_hash: 730d410dd78f8e4832f252263435b6fd4ebd2b8a147010f6d3c10997972e5a23
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.nav.coaching`

```yaml
id: src/lib/content/copy.ts::COPY.nav.coaching
source: src/lib/content/copy.ts
path: COPY.nav.coaching
render: Site menu
narrative_slot: utility
en: Coaching 1:1
th: Coaching 1:1
provenance: paul-approved
date: 15/08/2026
term_bindings:
  - coaching-1-1
decision_note: |-
  Not "About". The page sells the coaching and introduces Paul at the end,

  so the label names what the reader gets rather than who wrote it.

  Identical in both languages, on Paul's call. "Coaching 1:1" is already

  how this is said in Thai professional contexts, and โค้ชชิ่งตัวต่อตัว is

  the longest item in a menu whose other entries are two words.
review:
  structural_calque: pass
  text_hash: 8b67be0a260c370c5e3ff6bad5ce2dc1ed70c233a5628ed888b40ed64b1cdca9
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.nav.contact`

```yaml
id: src/lib/content/copy.ts::COPY.nav.contact
source: src/lib/content/copy.ts
path: COPY.nav.contact
render: Site menu
narrative_slot: utility
en: Contact
th: Contact
provenance: paul-approved
date: 15/08/2026
term_bindings:
  - nav-contact
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: ed25acd17973d3af8ec2e6ac112655e368038bd4c09d8db5d9bb053018973a71
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.nav.cvCheck`

```yaml
id: src/lib/content/copy.ts::COPY.nav.cvCheck
source: src/lib/content/copy.ts
path: COPY.nav.cvCheck
render: Site menu, the Products group
narrative_slot: utility
en: CV Check
th: CV Check
provenance: paul-approved
date: 10/09/2026
term_bindings:
  - product-cv-check
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 763af023d3f2ca172d8bcec349705590ec8e8dd3c8ecb318a3df57bbef653aaa
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.nav.faq`

```yaml
id: src/lib/content/copy.ts::COPY.nav.faq
source: src/lib/content/copy.ts
path: COPY.nav.faq
render: Site menu
narrative_slot: utility
en: FAQ
th: FAQ
provenance: paul-approved
date: 15/08/2026
term_bindings:
  - nav-faq
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 81f842b22fdad90a717fe2d11acd8e58527901348e416631a98d9f071faa0885
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.nav.fitReport`

```yaml
id: src/lib/content/copy.ts::COPY.nav.fitReport
source: src/lib/content/copy.ts
path: COPY.nav.fitReport
render: Site menu, the Products group
narrative_slot: utility
en: Fit Report
th: Fit Report
provenance: paul-approved
date: 10/09/2026
term_bindings:
  - product-fit-report
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 899b32eb43aa35737948310d7d8d389bddf837a171fb03522711b719b93178cf
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.nav.guidedJobHunt`

```yaml
id: src/lib/content/copy.ts::COPY.nav.guidedJobHunt
source: src/lib/content/copy.ts
path: COPY.nav.guidedJobHunt
render: Site menu, the Products group
narrative_slot: utility
en: Guided Job Hunt
th: Guided Job Hunt
provenance: paul-approved
date: 10/09/2026
term_bindings:
  - product-guided-job-hunt
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 0306c1557b504fc623b194bbe30c6302c7f52d7e43f51c9c42965ed3747f4b9c
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.nav.language`

```yaml
id: src/lib/content/copy.ts::COPY.nav.language
source: src/lib/content/copy.ts
path: COPY.nav.language
render: Header, the TH/EN switch
narrative_slot: utility
en: Language
th: ภาษา
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c0e8c7a385670e725de6649f9d45e4078499c16cefa5f9994ed21b2f33ac4ebb
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.nav.matchedJobs`

```yaml
id: src/lib/content/copy.ts::COPY.nav.matchedJobs
source: src/lib/content/copy.ts
path: COPY.nav.matchedJobs
render: Site menu, the Products group
narrative_slot: utility
en: Matched Jobs
th: Matched Jobs
provenance: paul-approved
date: 10/09/2026
term_bindings:
  - product-matched-jobs
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: c1465efef0ce201aef0edc88423adcb5db8310968c1746cd882c7320cc0bb75d
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.nav.menu`

```yaml
id: src/lib/content/copy.ts::COPY.nav.menu
source: src/lib/content/copy.ts
path: COPY.nav.menu
render: Header, the burger button's accessible name
narrative_slot: utility
en: Menu
th: Menu
provenance: paul-approved
date: 15/08/2026
term_bindings:
  - nav-menu
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: b045c9930212f9f1ab37888a0da79e14f7893292d769693e6d1d264d044cf031
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.nav.menuClose`

```yaml
id: src/lib/content/copy.ts::COPY.nav.menuClose
source: src/lib/content/copy.ts
path: COPY.nav.menuClose
render: Header, the open menu's close button
narrative_slot: utility
en: Close menu
th: Close menu
provenance: paul-approved
date: 15/08/2026
term_bindings:
  - nav-menu-close
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 965f9cec3b88543063b9b6bd27ecb96b044dd4172d1c458b51260f99f321cfac
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.nav.pricing`

```yaml
id: src/lib/content/copy.ts::COPY.nav.pricing
source: src/lib/content/copy.ts
path: COPY.nav.pricing
render: Site menu
narrative_slot: utility
en: Pricing
th: แพ็กเกจและราคา
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's wording, 23/08/2026.
review:
  structural_calque: pass
  text_hash: 0402222fd86fa10d6905f638e69aac1e341bdfd4ccfb1c619682d747cb795a1c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.nav.products`

```yaml
id: src/lib/content/copy.ts::COPY.nav.products
source: src/lib/content/copy.ts
path: COPY.nav.products
render: Site menu, the Products group
narrative_slot: utility
en: Products
th: บริการของเรา
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's wording, 23/08/2026.
review:
  structural_calque: pass
  text_hash: ad0cfdfc55a7f7c9d7415c9d49ca8ead59c54aeeffb1a27144d46dfbc062f406
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.nav.services`

```yaml
id: src/lib/content/copy.ts::COPY.nav.services
source: src/lib/content/copy.ts
path: COPY.nav.services
render: Site menu, the Products group
narrative_slot: utility
en: Our Services
th: Our Services
provenance: paul-approved
date: 10/09/2026
term_bindings:
  - our-services
decision_note: |-
  English in the Thai column, which is what `our-services` fixes and what
  `nav.faq`, `nav.contact` and `nav.menu` already do. LR-01's passthrough
  check allows an identical pair only where a termbase entry says so, and
  this is one of the five it says it about.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 7ceda5303b01063407907df65f5a2472b73704a4cc4d9297e118238b9e3bc501
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.report.competency`

```yaml
id: src/lib/content/copy.ts::COPY.report.competency
source: src/lib/content/copy.ts
path: COPY.report.competency
render: Candidate PDF, the score table's first column header
narrative_slot: artefact
en: What we looked at
th: หัวข้อที่ประเมิน
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 21f251fa07e0aff24927516b3ac25970b2a99bde635546f55a4950ef2fd0724b
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.report.footer`

```yaml
id: src/lib/content/copy.ts::COPY.report.footer
source: src/lib/content/copy.ts
path: COPY.report.footer
render: Candidate PDF, the footing on the last page
narrative_slot: utility
en: >-
  This report was prepared by PunProfile Career Coaching from your EU Fit Check answers. A 30-minute
  conversation covers the parts a form cannot fully reflect.
th: >-
  ผลประเมินนี้จัดทำโดย PunProfile จากคำตอบใน EU Fit Check นัดคุยกัน 30
  นาทีเพื่อประเมินส่วนที่แบบฟอร์มยังสะท้อนได้ไม่ครบ
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 17/08/2026. It names the instrument the answers came

  from, opens on what the document is, and turns the closing clause into

  an invitation, `นัดคุยกัน`, rather than a statement about coverage.

  *`PunProfile แคเรียร์โค้ชชิ่ง` is half-transliterated, and that is his**

  rather than a slip to tidy: LR-01 exempts the legal entity

  `PunProfile Career Coaching` from translation where it names the data

  controller, and a report footing says who prepared a document rather

  than who controls the data. `footer.brand`, which does name the

  controller, is a `fixed` termbase string and is untouched.
review:
  structural_calque: pass
  text_hash: 0b6bb50404e53bba01728f7456224a37f2cd2f5adf1237c992dbd892463156b6
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.report.next`

```yaml
id: src/lib/content/copy.ts::COPY.report.next
source: src/lib/content/copy.ts
path: COPY.report.next
render: Candidate PDF, section heading over the closing card
narrative_slot: artefact
en: What happens next
th: ขั้นตอนต่อไป
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: e62bbd59dd4d30b56a468001933286b030a70411f2273568850771d8a403768c
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.report.priorities`

```yaml
id: src/lib/content/copy.ts::COPY.report.priorities
source: src/lib/content/copy.ts
path: COPY.report.priorities
render: Candidate PDF, section heading over the development list
narrative_slot: artefact
en: Where the gains are
th: สิ่งที่ควรพัฒนาต่อ
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 3eb0085dbf164e8703f958041f32de51bb8869fc7c434f0d0c00255b2632ea87
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.report.savePdf`

```yaml
id: src/lib/content/copy.ts::COPY.report.savePdf
source: src/lib/content/copy.ts
path: COPY.report.savePdf
render: Candidate PDF, the button that reopens the print dialog. Screen only, never printed
narrative_slot: artefact
en: Download as PDF
th: ดาวน์โหลด PDF
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  *Paul's wording, 17/08/2026**, with the น์ restored on his confirmation.

  `ดาวน์โหลด` is the standard spelling and `ดาวโหลด` is a common enough

  misspelling to look deliberate, which is why it was held rather than

  corrected silently.

  The change of substance is his: download rather than save. The button

  reopens the print dialog, and what a reader wants from it is a file.
review:
  structural_calque: pass
  text_hash: 88dcded2fbb7883396c6fce3d3462e1d5e2bc795ec9568e42880037d9eafe4ef
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.report.score`

```yaml
id: src/lib/content/copy.ts::COPY.report.score
source: src/lib/content/copy.ts
path: COPY.report.score
render: Candidate PDF, the score table's second column header
narrative_slot: artefact
en: Score
th: คะแนน
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: a096d57c36ebcc509628256523f8cb7af3b7d51a3ffb19263a25c95aaf17abe4
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.report.strengths`

```yaml
id: src/lib/content/copy.ts::COPY.report.strengths
source: src/lib/content/copy.ts
path: COPY.report.strengths
render: Candidate PDF, section heading over the strengths list
narrative_slot: artefact
en: What you already have
th: จุดแข็งของคุณ
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: a0ad6d4a427b1b2e1e0feb75bc55acdd0eff3b4ff87477a4e8bfd9cc6fa4ce17
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.report.unmeasured`

```yaml
id: src/lib/content/copy.ts::COPY.report.unmeasured
source: src/lib/content/copy.ts
path: COPY.report.unmeasured
render: Candidate PDF, under a dimension's table. {count} is substituted
narrative_slot: artefact
en: '{count} more things in this area need a conversation rather than a form, so they are left blank.'
th: ในด้านนี้ยังมีอีก {count} หัวข้อที่ต้องมาพูดคุยกัน จึงจะประเมินได้
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  Says what is missing and why, in the candidate's own terms. The coach's

  copy names each blank item individually; this names the number, which is

  the honest form of the same fact without listing things they cannot act on.

  Paul's wording, 17/08/2026. `ต้องมาพูดคุยกัน` is an invitation where

  `ต้องใช้การพูดคุย` was a requirement, and he cut `แทนการเดา`: the sentence

  already says the areas are left blank, and defending the choice not to

  guess draws attention to guessing.
review:
  structural_calque: pass
  text_hash: 1cece303c7fde0c8c0fd741d8dde9388513755772d9a21cda4b5ab52e0c8bb60
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.result.caveat`

```yaml
id: src/lib/content/copy.ts::COPY.result.caveat
source: src/lib/content/copy.ts
path: COPY.result.caveat
render: Full result, the persistent honesty line. FR-007 requires it to be unmissable
narrative_slot: utility
en: Everything here is self-reported and preliminary. It is a first read of where you stand, not a verdict.
th: นี่คือผลประเมินเบื้องต้นจากข้อมูลที่คุณให้มา เพื่อช่วยให้เห็นว่าตอนนี้คุณอยู่ตรงไหน ไม่ใช่ข้อสรุปตายตัว
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 5d5157dbeeeabe4ca0ff7ee4b7fb538e823d018edbd5e082d76595fbe98969a6
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.result.measured`

```yaml
id: src/lib/content/copy.ts::COPY.result.measured
source: src/lib/content/copy.ts
path: COPY.result.measured
render: Full result, the coverage line. {count}, {total} and {more} are substituted
narrative_slot: utility
en: >-
  Your answers measure {count} of {total} areas. A 30-minute conversation can measure {more} more, the parts
  no form can see.
th: >-
  จากคำตอบของคุณ เราประเมินได้ {count} จาก {total} ด้าน การพูดคุย 30 นาทีจะช่วยประเมินเพิ่มได้อีก {more} ด้าน
  รวมถึงรายละเอียดที่แบบฟอร์มนี้ยังสะท้อนไม่ได้
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 1cac878220666b5b77597270a38741e6c6fe93748fa81948be90a6ecfecd336c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.result.startWith`

```yaml
id: src/lib/content/copy.ts::COPY.result.startWith
source: src/lib/content/copy.ts
path: COPY.result.startWith
render: Full result, fallback next step when no specific action matches. {area} substituted
narrative_slot: ask
en: Start with {area}.
th: 'เรื่องที่ควรให้ความสำคัญก่อน: {area}'
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: e9a924e5af58ceac43654afecf3973ea58ec97f9def6af3388f0279c7527473a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.services.cta.body`

```yaml
id: src/lib/content/copy.ts::COPY.services.cta.body
source: src/lib/content/copy.ts
path: COPY.services.cta.body
render: First read, the secondary CTA to /coaching
narrative_slot: ask
en: Here is what working with PunProfile actually involves, and which part of it your result points at.
th: ทำความรู้จักแนวทางการทำงานของปั้นโปรไฟล์ และดูว่าบริการไหนเหมาะกับเป้าหมายของคุณ
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: |-
  Pitched at the reading, not at the sale, and deliberately not a second

  booking button on a screen that already has one. A page explaining what

  the coaching actually is does more for a later call.
review:
  structural_calque: pass
  text_hash: 4ebf77e9e4d242bf6544b50f520d633e816bed43ed8eaec7112c7a3f5dd3a6e3
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.services.cta.button`

```yaml
id: src/lib/content/copy.ts::COPY.services.cta.button
source: src/lib/content/copy.ts
path: COPY.services.cta.button
render: First read, the secondary CTA to /coaching
narrative_slot: ask
en: See what PunProfile does
th: ดูบริการของ PunProfile
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: a0bddefd5a791d4c4d05e90afc1459bfd3ed962e88ca0429622724887113a7c7
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.services.cta.heading`

```yaml
id: src/lib/content/copy.ts::COPY.services.cta.heading
source: src/lib/content/copy.ts
path: COPY.services.cta.heading
render: First read, the secondary CTA to /coaching
narrative_slot: utility
en: What you can do with this now
th: นำผลนี้ไปทำอะไรต่อได้บ้าง
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: |-
  **Rewritten 23/08/2026, Paul's call, and it is the same cut he made on
  `/pricing` the same day.**
  It read "While you wait" / `ในระหว่างรอการติดต่อกลับจากเรา`, which told every
  finisher, in the heading of a card on the result screen, that contact was
  coming. His rule: outbound contact has not stopped, the public promise of
  it has, because to a lead who is not ready that is a promise nobody
  intends to keep.
  It was also stale twice over. The wait framing was written when
  `teaser.nextStep` named a queue on this same screen, and his rewrite of
  20/08/2026 dropped the queue. So the card was the last thing on the page
  still describing a wait that nothing else mentioned.
  **What replaces it hands the move back to the reader**, which is the
  mechanic `teaser.nextStep` already uses on this screen: a condition they
  can act on rather than a report on our capacity.

  Paul's wording, 23/08/2026.
review:
  structural_calque: pass
  text_hash: 88a66157d02ee7fac86a44d0c46001393446d9f2b9e35f81a865fc850745d15f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.stats.countries.foot`

```yaml
id: src/lib/content/copy.ts::COPY.stats.countries.foot
source: src/lib/content/copy.ts
path: COPY.stats.countries.foot
render: First read, under the top-countries list
narrative_slot: utility
en: From people who took the EU Fit Check and named a target country.
th: อ้างอิงจากผู้ที่ทำ EU Fit Check และระบุประเทศเป้าหมาย
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: |-
  No sample size, on Paul's call 14/08/2026: the number of people who have

  taken the check is PunProfile's own information. What survives is WHO

  was counted, which is the part that stops a ranking being read as a

  claim about Europe rather than about this group.
review:
  structural_calque: pass
  text_hash: 685aa29101c1afa565065b1728e97984d165d805621aded94f92dde950b4e5e1
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.stats.countries.label`

```yaml
id: src/lib/content/copy.ts::COPY.stats.countries.label
source: src/lib/content/copy.ts
path: COPY.stats.countries.label
render: First read, the top-countries stat
narrative_slot: utility
en: The five countries this group is aiming at
th: 5 ประเทศเป้าหมายยอดนิยม
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 5d78774badf07c7d8dcdf2da2b429e64b95781fea1450410fd8b15841ac776f0
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.stats.heading`

```yaml
id: src/lib/content/copy.ts::COPY.stats.heading
source: src/lib/content/copy.ts
path: COPY.stats.heading
render: First read, above the community stats
narrative_slot: utility
en: From everyone who has taken this
th: ข้อมูลจากผู้ที่ทำแบบประเมินนี้ทั้งหมด
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 1f5530322ec14fcbe3911e32a4ce225ef3bff799d2b3e6d8a5c730ce78e1d7bd
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.stats.market.employers`

```yaml
id: src/lib/content/copy.ts::COPY.stats.market.employers
source: src/lib/content/copy.ts
path: COPY.stats.market.employers
render: The home page, the label under the count of employers
narrative_slot: utility
en: employers
th: บริษัทผู้จ้างงาน
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  Not shown on the first read, which prints only the two counts and the

  snapshot date. Defined here anyway because the home page shows all three

  and the alternative is a third figure label in a fourth place.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: c85ab25e71f1c5337f3bc74dceb2f616f7a3094431be8304fa642e8562ee6d5c
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.stats.market.foot`

```yaml
id: src/lib/content/copy.ts::COPY.stats.market.foot
source: src/lib/content/copy.ts
path: COPY.stats.market.foot
render: First read, under the job-pipeline figures. {to} is the snapshot date
narrative_slot: utility
en: Last updated {to}
th: อัปเดตล่าสุด {to}
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 4f998dd7a85c6c84f36f6fa25d4e09b7b28be3972bfa363dc5f083aafa3f0c18
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.stats.market.label`

```yaml
id: src/lib/content/copy.ts::COPY.stats.market.label
source: src/lib/content/copy.ts
path: COPY.stats.market.label
render: First read, the title of the job-pipeline card
narrative_slot: utility
en: Jobs we screened for this group
th: ตำแหน่งที่เราคัดมาแชร์ในกลุ่ม
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 17/08/2026. `มาแชร์ใน` rather than `ให้`, which read as

  screened FOR this group as a service. They are screened and then shared,

  and the group is where they are shared rather than the client.
review:
  structural_calque: pass
  text_hash: b0b996d9b9ae167e94be87e0a096e0aee9b00e0cad1078e56e4e35f5a6fb752d
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.stats.market.published`

```yaml
id: src/lib/content/copy.ts::COPY.stats.market.published
source: src/lib/content/copy.ts
path: COPY.stats.market.published
render: First read and the home page, the label under the count that cleared the sponsorship bar
narrative_slot: utility
en: roles where the employer sponsors a visa
th: ตำแหน่งที่บริษัทระบุว่าสปอนเซอร์วีซ่า
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 99d88c071b638c082c6bed04c1787615f0b0796f124bb83c6050efe9f9fe72a9
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.stats.market.screened`

```yaml
id: src/lib/content/copy.ts::COPY.stats.market.screened
source: src/lib/content/copy.ts
path: COPY.stats.market.screened
render: First read and the home page, the label under the count of adverts checked
narrative_slot: utility
en: job adverts checked
th: ประกาศงานที่ตรวจสอบแล้ว
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 34ce3cb28df052fd537f430cefae5e67c46282e81888ce6e13c457c32a9484c1
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.stats.percentile`

```yaml
id: src/lib/content/copy.ts::COPY.stats.percentile
source: src/lib/content/copy.ts
path: COPY.stats.percentile
render: First read, the personal comparison. Completes the big percentage above it
narrative_slot: utility
en: of the people here score lower than you on {dimension}.
th: ของผู้เข้ารับการประเมินทั้งหมด มีคะแนนด้าน {dimension} ต่ำกว่าคุณ
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  have shown the same number twice in three words of each other. `{n}` is

  gone from the text for that reason; `{dimension}` stays.

  *Paul's wording, 17/08/2026**, with one typo corrected on his

  confirmation: he wrote `ผู้ทำรับการประเมิน`, which is `ผู้ทำ` and

  `ผู้เข้ารับการประเมิน` merged. Held rather than shipped, because a merged

  phrase on the screen every candidate reaches is not a thing to guess at.

  His change of substance is the denominator: `ทั้งหมด`, everyone assessed,

  rather than `กลุ่มนี้`, which read as some subgroup the reader could not

  identify. It is also true, which the sentence next to it is not:

  `stats.readiness.foot` keeps its per-question denominator for that reason,

  on his call the same day.
review:
  structural_calque: pass
  text_hash: 0f75cf480cb7af5ef0ac3f377bd2239d9141aac3dfd3d631565b3aff9a537d55
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.stats.percentile.foot`

```yaml
id: src/lib/content/copy.ts::COPY.stats.percentile.foot
source: src/lib/content/copy.ts
path: COPY.stats.percentile.foot
render: First read, under the percentile line
narrative_slot: utility
en: Compared on self-reported answers, the same as yours.
th: อ้างอิงจากคำตอบที่ผู้ทำแบบประเมินให้ไว้
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: baada73d83cf757bb7f70dd11082daf40e831d436bb26d4557407ca6d64f7a55
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.stats.readiness.cv`

```yaml
id: src/lib/content/copy.ts::COPY.stats.readiness.cv
source: src/lib/content/copy.ts
path: COPY.stats.readiness.cv
render: First read, readiness bar 1
narrative_slot: utility
en: CV not yet written for the European market
th: เรซูเม่ยังไม่ได้ปรับให้ตรงกับตลาดยุโรป
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 7bbd2cece9b48df45714e173d24aac3b2d2a027d9e8bdeff8d03d0a0de4e75fb
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.stats.readiness.foot`

```yaml
id: src/lib/content/copy.ts::COPY.stats.readiness.foot
source: src/lib/content/copy.ts
path: COPY.stats.readiness.foot
render: First read, under the readiness bars
narrative_slot: utility
en: From the people who answered each question.
th: อ้างอิงจากผู้ที่ตอบคำถามแต่ละข้อ
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  Same rule as every other share in `stats.ts`: the denominator is the

  people who answered that question, not everyone.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 74ffc10926fdcba930795b7eff5d236d1d6093c34c3642f08488d52870cb915c
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.stats.readiness.label`

```yaml
id: src/lib/content/copy.ts::COPY.stats.readiness.label
source: src/lib/content/copy.ts
path: COPY.stats.readiness.label
render: First read, the title of the readiness card
narrative_slot: utility
en: Where this group stands on the three things a hiring manager checks first
th: ความพร้อม 3 ด้านแรกที่ผู้จัดการฝ่ายสรรหามองหา
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 17/08/2026. `Hiring Manager` in Latin, and the English

  follows it off `recruiter`: the person who reads a CV and decides is a

  hiring manager, and a recruiter is often neither. LR-05's principle,

  which is to reach for the loanword the audience already uses rather than

  translate into a vaguer Thai noun. `ผู้จ้างงาน` was that vaguer noun.
review:
  structural_calque: pass
  text_hash: 509e22375222c44c5133c212a3f981344b87e0bca16510efb10bdc1249e4c1f4
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.stats.readiness.linkedin`

```yaml
id: src/lib/content/copy.ts::COPY.stats.readiness.linkedin
source: src/lib/content/copy.ts
path: COPY.stats.readiness.linkedin
render: First read, readiness bar 3
narrative_slot: utility
en: LinkedIn empty or barely filled in
th: โปรไฟล์ LinkedIn ยังไม่สมบูรณ์
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: dec90645ece8c17f0f4146366a8b1aaf373fdf236930db1f2223017fa75fe87d
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.stats.readiness.portfolio`

```yaml
id: src/lib/content/copy.ts::COPY.stats.readiness.portfolio
source: src/lib/content/copy.ts
path: COPY.stats.readiness.portfolio
render: First read, readiness bar 2
narrative_slot: utility
en: No portfolio or work anyone can look at
th: ยังไม่มี Portfolio ที่แสดงผลงาน
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 17/08/2026. `portfolio` rather than `ผลงาน`, matching

  `item.portfolioEvidence` below, and the audience is dropped: on a bar in

  a readiness stack, who would look at it is not the point.
review:
  structural_calque: pass
  text_hash: 67b8fb5d809e1445396b93a68a4272a1ce2623ea434024f31ca4788aa617097e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.stats.timing`

```yaml
id: src/lib/content/copy.ts::COPY.stats.timing
source: src/lib/content/copy.ts
path: COPY.stats.timing
render: First read, the timing sentence. {waiting} and {soon} are percentages
narrative_slot: utility
en: '{waiting}% have not started applying yet, and {soon}% want to be in Europe within three months.'
th: '{waiting}% ยังไม่ได้เริ่มสมัครงาน และ {soon}% ตั้งใจไปยุโรปภายใน 3 เดือน'
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  The two halves are only worth saying together. Separately they are

  demographics; together they name the tension the product sits inside.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 8dfd4c3a1533e290f68a672631a486611f3248f647772b718efb04117aa1eb52
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.step.applicationActivity`

```yaml
id: src/lib/content/copy.ts::COPY.step.applicationActivity
source: src/lib/content/copy.ts
path: COPY.step.applicationActivity
render: Full result, journey checklist step
narrative_slot: mechanism
en: Get applications going out
th: เริ่มส่งใบสมัคร
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 5060401620241c468b87b197d089a655c795376a0bf122c3e1ca890a1b2f125f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.step.cvStatus`

```yaml
id: src/lib/content/copy.ts::COPY.step.cvStatus
source: src/lib/content/copy.ts
path: COPY.step.cvStatus
render: Full result, journey checklist step
narrative_slot: mechanism
en: Get your CV Europe-ready
th: ปรับ CV ให้พร้อมสมัครงานในตลาดยุโรป
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 2f59d7ef7d43d1ddbacd4e4819ac8f84a716254a5cfac7354a5a23199c51292c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.step.languageReadiness`

```yaml
id: src/lib/content/copy.ts::COPY.step.languageReadiness
source: src/lib/content/copy.ts
path: COPY.step.languageReadiness
render: Full result, journey checklist step
narrative_slot: mechanism
en: Keep your English moving
th: ฝึกใช้ภาษาอังกฤษอย่างต่อเนื่อง
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 975b2f3c56d2b17cf0a0309e8950e2b21f6a50c7eac7c6eaabecb22d9e9a3ad0
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.step.linkedinStatus`

```yaml
id: src/lib/content/copy.ts::COPY.step.linkedinStatus
source: src/lib/content/copy.ts
path: COPY.step.linkedinStatus
render: Full result, journey checklist step
narrative_slot: mechanism
en: Make LinkedIn active and findable
th: อัปเดต LinkedIn ให้เป็นปัจจุบัน มีความเคลื่อนไหว และค้นเจอง่าย
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: e27c97de19f3e08aff23da41c32d54f69be3d5ddd6668d726993460110f75d5a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.step.portfolioEvidence`

```yaml
id: src/lib/content/copy.ts::COPY.step.portfolioEvidence
source: src/lib/content/copy.ts
path: COPY.step.portfolioEvidence
render: Full result, journey checklist step
narrative_slot: mechanism
en: Show some work you are proud of
th: เตรียม Portfolio ที่แสดงทักษะและผลลัพธ์จากการทำงานของคุณ
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 2a7f6145067543bad11e1d209126dce93cf9f0087ff312148b95ffa542d4b9bc
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.step.targetClarity`

```yaml
id: src/lib/content/copy.ts::COPY.step.targetClarity
source: src/lib/content/copy.ts
path: COPY.step.targetClarity
render: Full result, journey checklist step
narrative_slot: mechanism
en: Pick one target country and role
th: กำหนดประเทศและตำแหน่งงานเป้าหมายให้ชัดเจน
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: a343f39a9c75efc27e24601e9e1fed18cace4a116d0f8c149895604bc407942a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.step.unanswered`

```yaml
id: src/lib/content/copy.ts::COPY.step.unanswered
source: src/lib/content/copy.ts
path: COPY.step.unanswered
render: Full result, on a step nothing has been answered for yet
narrative_slot: mechanism
en: Two quick answers and this fills in
th: ตอบเพิ่มอีกไม่กี่ข้อเพื่อดูผลในส่วนนี้
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: adede9fc1645baef4a0801a0c59273c1771924e8589c423609d7b269a29b4f1b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.step.visaReadiness`

```yaml
id: src/lib/content/copy.ts::COPY.step.visaReadiness
source: src/lib/content/copy.ts
path: COPY.step.visaReadiness
render: Full result, journey checklist step
narrative_slot: mechanism
en: Know your visa route by name
th: ตรวจสอบว่าเส้นทางวีซ่าแบบใดเหมาะกับคุณ
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: aa83449aebfdcb1a3b4f9269fd6ab501adc898af25599458cc3c0c0314e17236
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.teaser.chart.heading`

```yaml
id: src/lib/content/copy.ts::COPY.teaser.chart.heading
source: src/lib/content/copy.ts
path: COPY.teaser.chart.heading
render: First read, the title of the card the chart sits in
narrative_slot: utility
en: Skills and readiness
th: ทักษะและความพร้อม
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 8783240a44eb23f526add26d86bf7e3b9bae18e9d3318a3f4b6f40cfae5a6e94
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.teaser.headline`

```yaml
id: src/lib/content/copy.ts::COPY.teaser.headline
source: src/lib/content/copy.ts
path: COPY.teaser.headline
render: Teaser, after the last question
narrative_slot: utility
en: Here's your first read
th: ผลประเมินความพร้อมเบื้องต้นของคุณ
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 895cdac2bc102ef03c68295c9758473717ff9e9431cf8d2ba38410d580e3b7ff
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.teaser.nextStep`

```yaml
id: src/lib/content/copy.ts::COPY.teaser.nextStep
source: src/lib/content/copy.ts
path: COPY.teaser.nextStep
render: First read, the closing card. What happens after this screen
narrative_slot: mechanism
en: If your goal is clear, a job in Europe within three months, and you are ready to act on it, contact us now.
th: หากเป้าหมายของคุณคือการได้งานในยุโรปภายใน 3 เดือน และพร้อมลงมืออย่างจริงจัง ทักมาคุยกับเราได้เลย
provenance: paul-written
date: 20/08/2026
term_bindings: []
decision_note: |-
  **Rewritten 17/08/2026, and the change is the flow rather than the
  wording.** It said the team is dealing with a lot of enquiries and would
  reach the candidate when their turn came round, which was Paul's own line
  from 14/08/2026 and a deliberate downgrade of an earlier promise: naming
  the queue meant a candidate who waited a week had been told a week was
  normal rather than concluding they had not qualified.
  That was the right fix for a screen whose last word was a promise. It is
  the wrong last word for a screen that has just shown someone their own
  result, because it ends on our capacity instead of on their position, which
  is the opposite of move 6 in `03_Content_System.md`.
  **The queue was still named, and on 20/08/2026 it stopped being.** That
  paragraph read: the queue is true, it is the reason a reply may take time,
  and deleting it would put back the silence the 14/08 line was written to
  explain. Paul's own rewrite drops it. Kept here rather than deleted,
  because the argument for naming the queue is the thing to weigh again if
  candidates start reading the silence as rejection.
  What survives the rewrite is the mechanic: the last word is a condition
  the reader can act on. `stats.timing` on this same screen reports the
  share of this pool who want to be in Europe within three months, so the
  reader has just been shown that they are not unusual in being in a hurry.
  The card it sits in gains a `Talk to me` button, which is why this string
  no longer has to do the asking on its own.

  Paul's wording, 20/08/2026, read back and shipped as written apart from

  หา → หาก, which was a typing slip. His line drops the queue sentence the

  17/08 rewrite kept: what replaces it is a condition rather than an

  explanation, so the last word is the reader's move and not our capacity.
review:
  structural_calque: pass
  text_hash: 5c08878cc987e1e3928c7f9f39d9ca8d5dc6d338ef43fedee0d0c652ec865278
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.teaser.revise`

```yaml
id: src/lib/content/copy.ts::COPY.teaser.revise
source: src/lib/content/copy.ts
path: COPY.teaser.revise
render: Teaser, the link back to the last question
narrative_slot: utility
en: Go back and change an answer
th: กลับไปแก้ไขคำตอบ
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 2cd23a2b5d9ca155c870371f77342c2e3c06f043cdf5d642dda7f018fd459551
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.teaser.score.none`

```yaml
id: src/lib/content/copy.ts::COPY.teaser.score.none
source: src/lib/content/copy.ts
path: COPY.teaser.score.none
render: First read, the legend entry for a dimension the answers could not reach
narrative_slot: utility
en: Not measured yet
th: ยังไม่สามารถประเมินได้
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  Never a zero and never a dash. A dash reads as a broken field; a zero is

  a claim. This says the honest thing, which is that we did not measure it.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 27a3d3ea2314035d5d1dd896787214b2aa99ffa60e7704ded3f3b22491d2f899
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.teaser.score.value`

```yaml
id: src/lib/content/copy.ts::COPY.teaser.score.value
source: src/lib/content/copy.ts
path: COPY.teaser.score.value
render: First read, one dimension's score in the legend. {score} is one decimal, the scale is not
narrative_slot: utility
en: '{score}/5'
th: '{score}/5'
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 200870f762dee7a35b6def2bd862a16fef744ab94838173d9fc7c0733edaccbc
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/copy.ts::COPY.teaser.selfReported`

```yaml
id: src/lib/content/copy.ts::COPY.teaser.selfReported
source: src/lib/content/copy.ts
path: COPY.teaser.selfReported
render: Teaser, under the headline. FR-007 requires this to be unmissable
narrative_slot: artefact
en: Self-reported and preliminary, from your own answers just now.
th: ผลประเมินนี้อ้างอิงจากคำตอบที่คุณให้ไว้
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 94fd4797e9d89a2bbd73d201ddf7d72752e72f38ca878925ce051b0e21340985
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/cta.ts::DESTINATIONS.assess.label`

```yaml
id: src/lib/content/cta.ts::DESTINATIONS.assess.label
source: src/lib/content/cta.ts
path: DESTINATIONS.assess.label
render: Calls to action, DESTINATIONS.assess.label
narrative_slot: utility
en: Start the EU Fit Check
th: เริ่มทำ EU Fit Check
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: cba0278f78b344f379bcf86d8539d281a1cab2ca38dd622f21ef4ef7328d3799
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/cta.ts::DESTINATIONS.coaching.label`

```yaml
id: src/lib/content/cta.ts::DESTINATIONS.coaching.label
source: src/lib/content/cta.ts
path: DESTINATIONS.coaching.label
render: Calls to action, DESTINATIONS.coaching.label
narrative_slot: utility
en: How the coaching works
th: ดูว่าการโค้ชของเราเป็นอย่างไร
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: a0aa955bee10ab3d66fbb975963879782062496315008fc0fbf24f0d0a3105e5
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/cta.ts::DESTINATIONS.contact.label`

```yaml
id: src/lib/content/cta.ts::DESTINATIONS.contact.label
source: src/lib/content/cta.ts
path: DESTINATIONS.contact.label
render: Calls to action, DESTINATIONS.contact.label
narrative_slot: utility
en: Talk to me
th: ทักมาคุยกัน
provenance: paul-approved
date: 10/09/2026
term_bindings:
  - contact-talk-to-me
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: d88d225019bf784b4fc0747ec74b4c895faacbeb1fb3337f9e2aa37bc58da340
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/cta.ts::DESTINATIONS.cvcheck.label`

```yaml
id: src/lib/content/cta.ts::DESTINATIONS.cvcheck.label
source: src/lib/content/cta.ts
path: DESTINATIONS.cvcheck.label
render: Calls to action, DESTINATIONS.cvcheck.label
narrative_slot: utility
en: See how the CV Check works
th: ดูว่า CV Check ทำงานอย่างไร
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 4d46ba5357103765ceeb483b184e04f10a473e63607b1636f4f674d852e8f004
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/cta.ts::DESTINATIONS.email.label`

```yaml
id: src/lib/content/cta.ts::DESTINATIONS.email.label
source: src/lib/content/cta.ts
path: DESTINATIONS.email.label
render: Calls to action, DESTINATIONS.email.label
narrative_slot: utility
en: Email us
th: ส่งอีเมลหาเรา
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 1c6194910fe0dcd7d3bbed8b67fd73dd70d0af4be96afe66941b5a948df14027
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/cta.ts::DESTINATIONS.line.label`

```yaml
id: src/lib/content/cta.ts::DESTINATIONS.line.label
source: src/lib/content/cta.ts
path: DESTINATIONS.line.label
render: Calls to action, DESTINATIONS.line.label
narrative_slot: utility
en: Chat on LINE
th: ทักทาง LINE
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: e52720ffbd6453424af64547cf2510cc7d7418829037c421fafe57d5ef9ef62e
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/cta.ts::DESTINATIONS.pricing.label`

```yaml
id: src/lib/content/cta.ts::DESTINATIONS.pricing.label
source: src/lib/content/cta.ts
path: DESTINATIONS.pricing.label
render: Calls to action, DESTINATIONS.pricing.label
narrative_slot: utility
en: See the prices
th: ดูแพ็กเกจและราคา
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 18d32b66905d41941df853507c4275714bd979bae558573c632725eda2a7041d
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/cta.ts::DESTINATIONS.products.label`

```yaml
id: src/lib/content/cta.ts::DESTINATIONS.products.label
source: src/lib/content/cta.ts
path: DESTINATIONS.products.label
render: Calls to action, DESTINATIONS.products.label
narrative_slot: utility
en: See everything we make
th: ดูบริการทั้งหมดของเรา
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 30d1144a2566eb18fd7d389651d9ce5581fa1de327fcec1be85e91cb76c1d963
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/cta.ts::DESTINATIONS.services.label`

```yaml
id: src/lib/content/cta.ts::DESTINATIONS.services.label
source: src/lib/content/cta.ts
path: DESTINATIONS.services.label
render: Calls to action, DESTINATIONS.services.label
narrative_slot: utility
en: See how we work together
th: ดูขั้นตอนการทำงานร่วมกัน
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 4d78fa59bd4356fd4632732d21877f9d6f95c243b57485a4e1fa27f190fbeb94
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/cta.ts::DESTINATIONS.servicesPage.label`

```yaml
id: src/lib/content/cta.ts::DESTINATIONS.servicesPage.label
source: src/lib/content/cta.ts
path: DESTINATIONS.servicesPage.label
render: Calls to action, DESTINATIONS.servicesPage.label
narrative_slot: utility
en: See the three services
th: ดูบริการทั้งสามอย่าง
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: f08a9171843348621e74b9eb60ae5d3f2373d21c1d1ca02eb2bf0e750316a772
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ_CLOSE`

```yaml
id: src/lib/content/faq.ts::FAQ_CLOSE
source: src/lib/content/faq.ts
path: FAQ_CLOSE
render: FAQ page, FAQ_CLOSE
narrative_slot: ask
en: >-
  Not taken the EU Fit Check yet? A lot of the answers above are much easier to understand once you have seen
  your own result.
th: ยังไม่ได้ทำ EU Fit Check ใช่ไหม คำตอบหลายข้อด้านบนจะเข้าใจง่ายขึ้นมากเมื่อคุณได้เห็นผลของตัวเอง
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 8fa7c0d879d0b877868edb50080d81e68b804862959c9fc4d6bc9e86dd724c20
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ_HEADING`

```yaml
id: src/lib/content/faq.ts::FAQ_HEADING
source: src/lib/content/faq.ts
path: FAQ_HEADING
render: FAQ page, FAQ_HEADING
narrative_slot: utility
en: Frequently asked questions
th: คำถามที่พบบ่อย
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 5d2eb18e9b4a38709aefd29e1ef1986e51b9a3df1afc4be131012c2e86f4da68
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ_INTRO`

```yaml
id: src/lib/content/faq.ts::FAQ_INTRO
source: src/lib/content/faq.ts
path: FAQ_INTRO
render: FAQ page, FAQ_INTRO
narrative_slot: utility
en: If you cannot find the answer you are looking for, message me and ask.
th: ถ้ายังไม่เจอคำตอบที่ต้องการ ทักมาถามผมได้เลย
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 072f391265a82341252ad97385ae2812fb0e3132116285cdc5b39afc829b049b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[0].a[0]`

```yaml
id: src/lib/content/faq.ts::FAQ[0].a[0]
source: src/lib/content/faq.ts
path: FAQ[0].a[0]
render: FAQ page, FAQ[0].a[0]
narrative_slot: utility
en: >-
  The EU Fit Check is a short assessment about your work experience, your English level, your target
  countries, and where you are right now on the road to working in Europe.
th: >-
  EU Fit Check เป็นแบบประเมินสั้น ๆ เกี่ยวกับประสบการณ์ทำงาน ระดับภาษาอังกฤษ ประเทศเป้าหมาย
  และตอนนี้คุณอยู่ขั้นไหนบนเส้นทางไปทำงานในยุโรป
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 4385cf4dbb37267c7ad83e681890fc21025127eee2e661f4bd88cadcee00e231
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[0].a[1]`

```yaml
id: src/lib/content/faq.ts::FAQ[0].a[1]
source: src/lib/content/faq.ts
path: FAQ[0].a[1]
render: FAQ page, FAQ[0].a[1]
narrative_slot: utility
en: It takes about two minutes. As soon as you finish, you see your first read and your own chart straight away.
th: ใช้เวลาประมาณ 2 นาที พอทำเสร็จ คุณจะเห็นผลเบื้องต้นและกราฟของตัวเองทันที
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: de1493d2fe9ad0d92313c951c62b80cacfde86ef8513edbb34653ef46356c137
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[0].q`

```yaml
id: src/lib/content/faq.ts::FAQ[0].q
source: src/lib/content/faq.ts
path: FAQ[0].q
render: FAQ page, FAQ[0].q
narrative_slot: utility
en: What is the EU Fit Check?
th: EU Fit Check คืออะไร
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 4256c6108c5765b9f07dab01b7a9250062a7af8991f6e809daa0621b9a6e75e5
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[1].a[0]`

```yaml
id: src/lib/content/faq.ts::FAQ[1].a[0]
source: src/lib/content/faq.ts
path: FAQ[1].a[0]
render: FAQ page, FAQ[1].a[0]
narrative_slot: utility
en: No. The EU Fit Check is free, and there is no payment step in it.
th: ไม่มีค่าใช้จ่าย คุณทำ EU Fit Check ได้ฟรี และไม่มีขั้นตอนการชำระเงิน
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 82a995ccbbda243fde7518117702fb4cf67f326455cf8083ba3aeaa55689d04c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[1].q`

```yaml
id: src/lib/content/faq.ts::FAQ[1].q
source: src/lib/content/faq.ts
path: FAQ[1].q
render: FAQ page, FAQ[1].q
narrative_slot: utility
en: Does it cost anything?
th: มีค่าใช้จ่ายไหม
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 3867b4ff9ebd8cb5cbc19e0f222183801f6d65242d00cf6fe3804baa0aa1a1a2
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[2].a[0]`

```yaml
id: src/lib/content/faq.ts::FAQ[2].a[0]
source: src/lib/content/faq.ts
path: FAQ[2].a[0]
render: FAQ page, FAQ[2].a[0]
narrative_slot: utility
en: Because we do not guess a score for something a form cannot measure.
th: เพราะเราไม่เดาคะแนนในเรื่องที่แบบฟอร์มวัดไม่ได้
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 4ac6659a98709ade2262691df86a09cb525983671a53237a7340437b799990b1
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[2].a[1]`

```yaml
id: src/lib/content/faq.ts::FAQ[2].a[1]
source: src/lib/content/faq.ts
path: FAQ[2].a[1]
render: FAQ page, FAQ[2].a[1]
narrative_slot: utility
en: >-
  The framework behind the EU Fit Check has thirty-four assessed items in total, but only five can be assessed
  reliably from your answers. The rest need someone to read your actual CV, or to talk to you first.
th: >-
  กรอบเบื้องหลัง EU Fit Check มีหัวข้อประเมินทั้งหมด 34 ข้อ แต่มีเพียง 5
  ข้อที่ประเมินจากคำตอบของคุณได้อย่างน่าเชื่อถือ ส่วนที่เหลือต้องมีคนอ่าน CV ตัวจริงของคุณหรือพูดคุยกับคุณก่อน
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: cc14b1a34a34d463b8dee543806dba76d3fadb942139c4face1b439759e65cda
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[2].a[2]`

```yaml
id: src/lib/content/faq.ts::FAQ[2].a[2]
source: src/lib/content/faq.ts
path: FAQ[2].a[2]
render: FAQ page, FAQ[2].a[2]
narrative_slot: utility
en: So a hollow marker means “not assessed yet”. It does not mean a score of zero.
th: จุดวงกลมโปร่งจึงหมายถึง “ยังไม่ได้ประเมิน” ไม่ใช่คะแนนศูนย์
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c2a1c49a8a0b8c4834c0685e66a52186432a2844b166c80c8c3a915ed405c79d
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[2].q`

```yaml
id: src/lib/content/faq.ts::FAQ[2].q
source: src/lib/content/faq.ts
path: FAQ[2].q
render: FAQ page, FAQ[2].q
narrative_slot: utility
en: Why are parts of my chart empty?
th: ทำไมกราฟบางส่วนถึงว่างอยู่
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 9e9a6952675211ac1c35ce4b0594170fd6e3e6f01fb39d42533d72588f06de4c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[3].a[0]`

```yaml
id: src/lib/content/faq.ts::FAQ[3].a[0]
source: src/lib/content/faq.ts
path: FAQ[3].a[0]
render: FAQ page, FAQ[3].a[0]
narrative_slot: utility
en: >-
  This first read is based on the answers you gave yourself, so it is exactly as accurate as the information
  you put in. We say so clearly on the result screen.
th: >-
  ผลเบื้องต้นอ้างอิงจากคำตอบที่คุณให้เอง ความแม่นยำจึงขึ้นอยู่กับข้อมูลที่คุณกรอก
  เราระบุเรื่องนี้ไว้อย่างชัดเจนบนหน้าผลลัพธ์
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: ad393210bc30a38c9020c0d2f03e721d1ee501c440a66faf241316624c365bce
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[3].a[1]`

```yaml
id: src/lib/content/faq.ts::FAQ[3].a[1]
source: src/lib/content/faq.ts
path: FAQ[3].a[1]
render: FAQ page, FAQ[3].a[1]
narrative_slot: utility
en: It is meant as a starting point for a conversation, not a verdict on whether you are good at your job.
th: ผลนี้มีไว้เป็นจุดเริ่มต้นสำหรับการพูดคุย ไม่ใช่คำตัดสินว่าคุณเก่งหรือไม่เก่ง
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 31de29f04967fe3d97ea3ec5c075017d3b894073beaa52ab9047f977d10e771e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[3].q`

```yaml
id: src/lib/content/faq.ts::FAQ[3].q
source: src/lib/content/faq.ts
path: FAQ[3].q
render: FAQ page, FAQ[3].q
narrative_slot: utility
en: How accurate is the result?
th: ผลที่ได้แม่นยำแค่ไหน
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 17b0e13f550ae6fa3a19a34a64adda9158a14bd995e2eeafd19cf54031fa92ba
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[4].a[0]`

```yaml
id: src/lib/content/faq.ts::FAQ[4].a[0]
source: src/lib/content/faq.ts
path: FAQ[4].a[0]
render: FAQ page, FAQ[4].a[0]
narrative_slot: utility
en: A person actually reads your answers. The system does not decide on its own who gets contacted back.
th: จะมีคนอ่านคำตอบของคุณจริง ๆ ระบบไม่ได้เป็นผู้ตัดสินเพียงลำพังว่าเราจะติดต่อใครกลับ
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 9cd4b6aae1b6ce40f429424a9f6624fa4bbb8dbafc7b8c001b0b3389b638831c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[4].a[1]`

```yaml
id: src/lib/content/faq.ts::FAQ[4].a[1]
source: src/lib/content/faq.ts
path: FAQ[4].a[1]
render: FAQ page, FAQ[4].a[1]
narrative_slot: utility
en: >-
  There are a lot of enquiries at the moment, so there may be a wait. If you do not hear back straight away,
  it does not mean your result was poor or that you did not qualify.
th: >-
  ช่วงนี้มีคนติดต่อเข้ามาค่อนข้างมาก จึงอาจต้องรอสักหน่อย หากยังไม่ได้รับการติดต่อกลับทันที
  ไม่ได้หมายความว่าผลของคุณไม่ดีหรือไม่ผ่าน
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 5839c3c71718b8277eef38e953615c5bd938c675e81d8a4dde96a86ab52c571d
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[4].q`

```yaml
id: src/lib/content/faq.ts::FAQ[4].q
source: src/lib/content/faq.ts
path: FAQ[4].q
render: FAQ page, FAQ[4].q
narrative_slot: utility
en: What happens after I finish the assessment?
th: ทำแบบประเมินเสร็จแล้วจะเกิดอะไรขึ้น
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 5f55bf4b9f1df6e11d6c57dd4623518783cfc80a655ad37160e3215c91554980
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[5].a[0]`

```yaml
id: src/lib/content/faq.ts::FAQ[5].a[0]
source: src/lib/content/faq.ts
path: FAQ[5].a[0]
render: FAQ page, FAQ[5].a[0]
narrative_slot: utility
en: No. And nobody can honestly guarantee a job or a visa.
th: ไม่ครับ และไม่มีใครรับประกันว่าจะได้งานหรือวีซ่าได้อย่างซื่อสัตย์
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 9defa21e588b8185b4a86e4c3d6b0e3839c9b94e28196f010cb53bc4f404d325
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[5].a[1]`

```yaml
id: src/lib/content/faq.ts::FAQ[5].a[1]
source: src/lib/content/faq.ts
path: FAQ[5].a[1]
render: FAQ page, FAQ[5].a[1]
narrative_slot: utility
en: >-
  PunProfile provides career coaching, not recruitment. We are paid by you, not by an employer, so there is no
  quota and no vacancy anyone has to push you into applying for.
th: >-
  PunProfile ให้บริการ Career Coaching ไม่ใช่บริการจัดหางาน เรารับค่าบริการจากคุณ ไม่ใช่นายจ้าง
  จึงไม่มีโควตาหรือตำแหน่งว่างที่ต้องผลักดันให้คุณสมัคร
provenance: paul-approved
date: 25/08/2026
term_bindings: []
decision_note: Read back 25/08/2026. `Career Coaching` for `แคเรียร์โค้ชชิ่ง`.
review:
  structural_calque: pass
  text_hash: ad59a684dd486f2852f0e5c0345e68ce6c68686c44a17efa342a5e583fe069e7
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[5].a[2]`

```yaml
id: src/lib/content/faq.ts::FAQ[5].a[2]
source: src/lib/content/faq.ts
path: FAQ[5].a[2]
render: FAQ page, FAQ[5].a[2]
narrative_slot: utility
en: >-
  What we do is help you decide which direction to head in, build a profile that makes people want to keep
  reading, and work through each application with you.
th: >-
  สิ่งที่เราทำคือช่วยให้คุณตัดสินใจได้ว่าควรมุ่งไปทางไหน สร้างโปรไฟล์ที่ทำให้คนอยากอ่านต่อ
  และลงมือสมัครแต่ละตำแหน่งไปพร้อมกับคุณ
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 074045244d432b8f29f213760364344697ba9edc58f051232620c20f9e04c8ca
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[5].link.label`

```yaml
id: src/lib/content/faq.ts::FAQ[5].link.label
source: src/lib/content/faq.ts
path: FAQ[5].link.label
render: FAQ page, FAQ[5].link.label
narrative_slot: utility
en: See what PunProfile does
th: ดูบริการของ PunProfile
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: a0bddefd5a791d4c4d05e90afc1459bfd3ed962e88ca0429622724887113a7c7
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[5].q`

```yaml
id: src/lib/content/faq.ts::FAQ[5].q
source: src/lib/content/faq.ts
path: FAQ[5].q
render: FAQ page, FAQ[5].q
narrative_slot: utility
en: Do you find me a job, or guarantee that I will get one?
th: คุณหางานให้หรือรับประกันว่าจะได้งานไหม
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: d1fa9efd9ca6df69ac690460d081c32c028fb39dae844b8c5643087dac60a4fa
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[6].a[0]`

```yaml
id: src/lib/content/faq.ts::FAQ[6].a[0]
source: src/lib/content/faq.ts
path: FAQ[6].a[0]
render: FAQ page, FAQ[6].a[0]
narrative_slot: utility
en: >-
  It depends what you want help with and how far that help goes. We go through the details and tell you the
  cost clearly the first time we talk, and then you decide whether to go ahead.
th: >-
  ค่าบริการขึ้นอยู่กับเรื่องที่คุณอยากให้เราช่วยและขอบเขตความช่วยเหลือที่ต้องการ
  เราจะคุยรายละเอียดพร้อมแจ้งค่าใช้จ่ายให้ชัดเจนตั้งแต่ครั้งแรก แล้วคุณค่อยตัดสินใจว่าจะใช้บริการหรือไม่
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 8896f0b0c358540c79dd3e006ca80e47edd4678b63a1acafd79a6eba78d6692a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[6].a[1]`

```yaml
id: src/lib/content/faq.ts::FAQ[6].a[1]
source: src/lib/content/faq.ts
path: FAQ[6].a[1]
render: FAQ page, FAQ[6].a[1]
narrative_slot: utility
en: Both the EU Fit Check and that first conversation are free.
th: ทำ EU Fit Check พร้อมดูผลเบื้องต้น และคุยกับเราครั้งแรกได้ฟรี
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 6606c39e58a68f22e9142ef7466143df8b6031ea21d4df786515227ffb5ede24
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[6].q`

```yaml
id: src/lib/content/faq.ts::FAQ[6].q
source: src/lib/content/faq.ts
path: FAQ[6].q
render: FAQ page, FAQ[6].q
narrative_slot: utility
en: What does Career Coaching cost?
th: บริการ Career Coaching ราคาเท่าไร
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: d41c8c27a4ef0f0aaf6a7abe5852101864c3549f74c0a23c5cbdc6b7a9ffb20a
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[7].a[0]`

```yaml
id: src/lib/content/faq.ts::FAQ[7].a[0]
source: src/lib/content/faq.ts
path: FAQ[7].a[0]
render: FAQ page, FAQ[7].a[0]
narrative_slot: utility
en: >-
  Yes. The assessment is in Thai, and language is one of the things we assess rather than a condition for
  starting.
th: ได้ แบบประเมินเป็นภาษาไทย และเรื่องภาษาเป็นหนึ่งในหัวข้อที่เราประเมิน ไม่ใช่เงื่อนไขในการเริ่มทำ
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: bbecbc80aab11b5b97a1af3793baa6a0089fbc758195f960fbda5406d36101f8
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[7].a[1]`

```yaml
id: src/lib/content/faq.ts::FAQ[7].a[1]
source: src/lib/content/faq.ts
path: FAQ[7].a[1]
render: FAQ page, FAQ[7].a[1]
narrative_slot: utility
en: >-
  Speaking plainly: European employers outside the multinationals usually expect at least B2, in English or in
  the local language. Knowing how far you are from that right now is more useful than not knowing at all.
th: >-
  พูดกันตรง ๆ หลายตำแหน่งในยุโรปต้องการภาษาอังกฤษหรือภาษาท้องถิ่นอย่างน้อยระดับ B2
  การรู้ว่าตอนนี้คุณห่างจากจุดนั้นแค่ไหน มีประโยชน์กว่าการไม่รู้เลย
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 48aac57b85bcc8a73888dd458871b9272773a31a481142388f5441205b8df7de
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[7].q`

```yaml
id: src/lib/content/faq.ts::FAQ[7].q
source: src/lib/content/faq.ts
path: FAQ[7].q
render: FAQ page, FAQ[7].q
narrative_slot: utility
en: My English is not strong yet. Can I still do this?
th: ภาษาอังกฤษยังไม่แข็งแรง ทำได้ไหม
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 9ca129a4502f1809f73354c46e3d4c4bd925c601523d468854d2c3b4c4545ec4
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[8].a[0]`

```yaml
id: src/lib/content/faq.ts::FAQ[8].a[0]
source: src/lib/content/faq.ts
path: FAQ[8].a[0]
render: FAQ page, FAQ[8].a[0]
narrative_slot: utility
en: >-
  Yes. You can go back and change an answer at any point, even once you have reached the result screen, and
  the chart updates to your new answers straight away.
th: ได้ คุณย้อนกลับไปแก้คำตอบได้ตลอด แม้จะมาถึงหน้าผลลัพธ์แล้วก็ตาม กราฟจะอัปเดตตามคำตอบใหม่ให้ทันที
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c4a38103f6b68d69742d44e5d9cab90df9c679f07abc2dc246b4177cd97ff4c1
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[8].a[1]`

```yaml
id: src/lib/content/faq.ts::FAQ[8].a[1]
source: src/lib/content/faq.ts
path: FAQ[8].a[1]
render: FAQ page, FAQ[8].a[1]
narrative_slot: utility
en: >-
  The assessment does not save your previous session on your device. So opening it again starts a new round
  rather than continuing the old one.
th: >-
  แบบประเมินไม่ได้บันทึกรอบเดิมไว้บนอุปกรณ์ของคุณ หากเปิดแบบประเมินใหม่ จึงเท่ากับเริ่มทำรอบใหม่
  ไม่ใช่ทำต่อจากรอบเดิม
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 918a7a204f9ce4a4e82eb9cc0eb6633cf495680e7f0f87eb90fd4d1a7cbf13f8
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[8].q`

```yaml
id: src/lib/content/faq.ts::FAQ[8].q
source: src/lib/content/faq.ts
path: FAQ[8].q
render: FAQ page, FAQ[8].q
narrative_slot: utility
en: Can I change an answer, or take it again?
th: แก้คำตอบหรือทำใหม่ได้ไหม
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c045967d24f00345d88ece595c942e4c8b490b72758986e0446f4fd7027d6a76
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[9].a[0]`

```yaml
id: src/lib/content/faq.ts::FAQ[9].a[0]
source: src/lib/content/faq.ts
path: FAQ[9].a[0]
render: FAQ page, FAQ[9].a[0]
narrative_slot: utility
en: >-
  We use your information to prepare your result and to contact you back through the channels you consented
  to, and nothing else.
th: เราใช้ข้อมูลของคุณเพื่อจัดทำผลประเมินและติดต่อกลับผ่านช่องทางที่คุณยินยอมไว้เท่านั้น
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 9a5a0c149093dd012b1cd3c06320303305365bd4a98f35d7faf60261d3c0b923
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[9].a[1]`

```yaml
id: src/lib/content/faq.ts::FAQ[9].a[1]
source: src/lib/content/faq.ts
path: FAQ[9].a[1]
render: FAQ page, FAQ[9].a[1]
narrative_slot: utility
en: >-
  We do not sell your information or pass it to anyone else. It is kept for twelve months from the last time
  we were in contact, and you can ask us to delete it sooner at any point.
th: >-
  เราไม่ขายหรือส่งต่อข้อมูลให้บุคคลอื่น ข้อมูลจะถูกเก็บไว้ 12 เดือนนับจากวันที่เราติดต่อกันครั้งล่าสุด
  และคุณขอให้ลบก่อนกำหนดได้ทุกเมื่อ
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 31ba78c40da375cd3f6246650885903ef24b74647c1ca9f7cbd6993c1f396a5f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[9].link.label`

```yaml
id: src/lib/content/faq.ts::FAQ[9].link.label
source: src/lib/content/faq.ts
path: FAQ[9].link.label
render: FAQ page, FAQ[9].link.label
narrative_slot: utility
en: Read the privacy policy
th: อ่านนโยบายความเป็นส่วนตัว
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 3cfc2ec0e5bf577328e99f248925e54a517f2eeca9bf24cd291916be2bf089da
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/faq.ts::FAQ[9].q`

```yaml
id: src/lib/content/faq.ts::FAQ[9].q
source: src/lib/content/faq.ts
path: FAQ[9].q
render: FAQ page, FAQ[9].q
narrative_slot: utility
en: What happens to my information?
th: ข้อมูลของฉันจะถูกนำไปทำอะไร
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 11491fb6029fd61ae85217fa533966d954dd9503f2006a66fe8adca57a75b2e4
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/footer.ts::DISCLAIMER`

```yaml
id: src/lib/content/footer.ts::DISCLAIMER
source: src/lib/content/footer.ts
path: DISCLAIMER
render: Site footer, DISCLAIMER
narrative_slot: utility
en: >-
  PunProfile provides career coaching and job-search guidance. We are not a recruitment agency, and we are not
  immigration lawyers or licensed migration advisers. Nothing here is legal, immigration or financial advice:
  for visa and work-rights questions, consult a qualified immigration lawyer in the country concerned. We are
  paid by you rather than by an employer, results vary from person to person, and we do not guarantee
  employment, an interview or a visa.
th: >-
  ปั้นโปรไฟล์ ให้บริการโค้ชชิ่งด้านอาชีพและคำแนะนำในการหางาน เราไม่ใช่บริษัทจัดหางาน
  และไม่ใช่ทนายความหรือที่ปรึกษาด้านการย้ายถิ่นฐานที่ได้รับใบอนุญาต ข้อมูลในเว็บไซต์นี้ไม่ใช่คำแนะนำทางกฎหมาย
  การเข้าเมือง หรือการเงิน สำหรับคำถามเรื่องวีซ่าและสิทธิ์ในการทำงาน
  กรุณาปรึกษาทนายความด้านการเข้าเมืองในประเทศนั้น ๆ เรารับค่าบริการจากคุณไม่ใช่จากนายจ้าง
  ผลลัพธ์แตกต่างกันไปในแต่ละบุคคล และเราไม่รับประกันว่าคุณจะได้งาน ได้สัมภาษณ์ หรือได้วีซ่า
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: a89d0e40b19200de5b310b4423d6db0344fb80475db14e40360b5d3df54cfaae
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/footer.ts::FOLLOW_EYEBROW`

```yaml
id: src/lib/content/footer.ts::FOLLOW_EYEBROW
source: src/lib/content/footer.ts
path: FOLLOW_EYEBROW
render: Site footer, FOLLOW_EYEBROW
narrative_slot: utility
en: Follow
th: ติดตามเรา
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 536fa555bd17a4cd38d6321efdc43975a501e7e90060164c0ea00ae39c368c24
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/footer.ts::FOLLOW_LABEL`

```yaml
id: src/lib/content/footer.ts::FOLLOW_LABEL
source: src/lib/content/footer.ts
path: FOLLOW_LABEL
render: Site footer, FOLLOW_LABEL
narrative_slot: utility
en: Our Facebook page
th: เพจ Facebook ของเรา
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 0c83c0100e40d41ead8f90edd1d51ceef78d5a3fdc19ec6f2c44b81852267b02
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/footer.ts::FOOTER_COLUMNS[0].heading`

```yaml
id: src/lib/content/footer.ts::FOOTER_COLUMNS[0].heading
source: src/lib/content/footer.ts
path: FOOTER_COLUMNS[0].heading
render: Site footer, FOOTER_COLUMNS[0].heading
narrative_slot: utility
en: EU Fit Check
th: EU Fit Check
provenance: paul-approved
date: 15/08/2026
term_bindings:
  - product-eu-fit-check
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 7ae9e3e4001863e709a469f1869c47b8f8c2602e150e67572122b07756d09f9f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/footer.ts::FOOTER_COLUMNS[0].links[0].label`

```yaml
id: src/lib/content/footer.ts::FOOTER_COLUMNS[0].links[0].label
source: src/lib/content/footer.ts
path: FOOTER_COLUMNS[0].links[0].label
render: Site footer, FOOTER_COLUMNS[0].links[0].label
narrative_slot: utility
en: Take the check
th: ทำ EU Fit Check
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: c666f6fa977fe6bcc52b489e20b0057b77ecaf11f7a21c5e55ecec1858a138bd
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/footer.ts::FOOTER_COLUMNS[0].links[1].label`

```yaml
id: src/lib/content/footer.ts::FOOTER_COLUMNS[0].links[1].label
source: src/lib/content/footer.ts
path: FOOTER_COLUMNS[0].links[1].label
render: Site footer, FOOTER_COLUMNS[0].links[1].label
narrative_slot: utility
en: How we measure
th: วิธีที่เราใช้ประเมิน
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: b0e6fc4d8276c67431931567d1b8009598e8c3c8d7ec3a1023998046e6d5f124
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/footer.ts::FOOTER_COLUMNS[0].links[2].label`

```yaml
id: src/lib/content/footer.ts::FOOTER_COLUMNS[0].links[2].label
source: src/lib/content/footer.ts
path: FOOTER_COLUMNS[0].links[2].label
render: Site footer, FOOTER_COLUMNS[0].links[2].label
narrative_slot: utility
en: FAQ
th: FAQ
provenance: paul-approved
date: 15/08/2026
term_bindings:
  - nav-faq
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 81f842b22fdad90a717fe2d11acd8e58527901348e416631a98d9f071faa0885
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/footer.ts::FOOTER_COLUMNS[1].heading`

```yaml
id: src/lib/content/footer.ts::FOOTER_COLUMNS[1].heading
source: src/lib/content/footer.ts
path: FOOTER_COLUMNS[1].heading
render: Site footer, FOOTER_COLUMNS[1].heading
narrative_slot: utility
en: Coaching
th: Career Coaching
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 87d77187210c8f54a96785b0949a45463cc99ca5261845d783692c9fe5c4d400
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/footer.ts::FOOTER_COLUMNS[1].links[0].label`

```yaml
id: src/lib/content/footer.ts::FOOTER_COLUMNS[1].links[0].label
source: src/lib/content/footer.ts
path: FOOTER_COLUMNS[1].links[0].label
render: Site footer, FOOTER_COLUMNS[1].links[0].label
narrative_slot: utility
en: Coaching 1:1
th: Coaching 1:1
provenance: paul-approved
date: 15/08/2026
term_bindings:
  - coaching-1-1
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 8b67be0a260c370c5e3ff6bad5ce2dc1ed70c233a5628ed888b40ed64b1cdca9
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/footer.ts::FOOTER_COLUMNS[1].links[1].label`

```yaml
id: src/lib/content/footer.ts::FOOTER_COLUMNS[1].links[1].label
source: src/lib/content/footer.ts
path: FOOTER_COLUMNS[1].links[1].label
render: Site footer, FOOTER_COLUMNS[1].links[1].label
narrative_slot: utility
en: Pricing
th: แพ็กเกจและราคา
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 0402222fd86fa10d6905f638e69aac1e341bdfd4ccfb1c619682d747cb795a1c
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/footer.ts::FOOTER_COLUMNS[2].heading`

```yaml
id: src/lib/content/footer.ts::FOOTER_COLUMNS[2].heading
source: src/lib/content/footer.ts
path: FOOTER_COLUMNS[2].heading
render: Site footer, FOOTER_COLUMNS[2].heading
narrative_slot: utility
en: Contact
th: ติดต่อ
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 4c2846c9960c2abbc3d5abe58e319e02448c55e87955ec2f9faf0a9be790cc7e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/footer.ts::FOOTER_COLUMNS[2].links[0].label`

```yaml
id: src/lib/content/footer.ts::FOOTER_COLUMNS[2].links[0].label
source: src/lib/content/footer.ts
path: FOOTER_COLUMNS[2].links[0].label
render: Site footer, FOOTER_COLUMNS[2].links[0].label
narrative_slot: utility
en: Contact us
th: ติดต่อเรา
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: e42a777527d9edf4f28ea864895279d2063116f7aae90f752777aa688a6c65a5
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/footer.ts::FOOTER_COLUMNS[2].links[1].label`

```yaml
id: src/lib/content/footer.ts::FOOTER_COLUMNS[2].links[1].label
source: src/lib/content/footer.ts
path: FOOTER_COLUMNS[2].links[1].label
render: Site footer, FOOTER_COLUMNS[2].links[1].label
narrative_slot: utility
en: LINE
th: LINE
provenance: paul-approved
date: 10/09/2026
term_bindings:
  - channel-line
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: a9f2f8da787c503d62c2401c415a3b30ab4bcd391c31af58fc3f3d81eada41c4
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/footer.ts::FOOTER_COLUMNS[2].links[2].label`

```yaml
id: src/lib/content/footer.ts::FOOTER_COLUMNS[2].links[2].label
source: src/lib/content/footer.ts
path: FOOTER_COLUMNS[2].links[2].label
render: Site footer, FOOTER_COLUMNS[2].links[2].label
narrative_slot: utility
en: Email
th: อีเมล
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: a84c4b8c0704df5c212c7bb1f7ab937e0d90bb602645a37b99a6fb7e5235735f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::CATALOGUE_FREE`

```yaml
id: src/lib/content/home.ts::CATALOGUE_FREE
source: src/lib/content/home.ts
path: CATALOGUE_FREE
render: Home page, CATALOGUE_FREE
narrative_slot: utility
en: Free
th: ใช้ได้ฟรี
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  Paul's own heading from `/pricing`, 23/08/2026, shortened to a label.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 2664147e02f2dbaeed5aa7d85b327dba0eab9f06881d05d094875ee2c7687aa7
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::CATALOGUE_HEADING`

```yaml
id: src/lib/content/home.ts::CATALOGUE_HEADING
source: src/lib/content/home.ts
path: CATALOGUE_HEADING
render: Home page, CATALOGUE_HEADING
narrative_slot: utility
en: What you can get
th: คุณได้อะไรจากที่นี่บ้าง
provenance: paul-approved
date: 25/08/2026
term_bindings: []
decision_note: Read back 25/08/2026.
review:
  structural_calque: pass
  text_hash: 33c7f9299e336d33b83325ae702ac86ff213bc879e9990dfa04b5dc0ecc423c1
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::CATALOGUE_LEAD`

```yaml
id: src/lib/content/home.ts::CATALOGUE_LEAD
source: src/lib/content/home.ts
path: CATALOGUE_LEAD
render: Home page, CATALOGUE_LEAD
narrative_slot: utility
en: Three ways of working together, and below them everything you can use on your own.
th: สามรูปแบบที่เราจะทำงานร่วมกัน และด้านล่างคือทุกอย่างที่คุณใช้ได้ด้วยตัวเอง
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 99b93a8e2db41b74717a92d41b7866550c3602c8977bcb64f7d29c90daf45ed2
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::CATALOGUE_PAID`

```yaml
id: src/lib/content/home.ts::CATALOGUE_PAID
source: src/lib/content/home.ts
path: CATALOGUE_PAID
render: Home page, CATALOGUE_PAID
narrative_slot: utility
en: Paid with tokens
th: จ่ายด้วยโทเคน
provenance: paul-approved
date: 25/08/2026
term_bindings: []
decision_note: Read back 25/08/2026.
review:
  structural_calque: pass
  text_hash: 7a506f0a1998fc884783d8f232681621e1224a9974d8a49951265e9e9bb91985
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::CATALOGUE_PRICE_LINE`

```yaml
id: src/lib/content/home.ts::CATALOGUE_PRICE_LINE
source: src/lib/content/home.ts
path: CATALOGUE_PRICE_LINE
render: Home page, CATALOGUE_PRICE_LINE
narrative_slot: utility
en: One role that matches your criteria, sent to you, is 50 THB. Everything here is priced in the same token.
th: >-
  ตำแหน่งงาน 1 ตำแหน่งที่ตรงกับเงื่อนไขของคุณและส่งตรงถึงคุณ ราคา 50 บาท
  ทุกอย่างที่นี่คิดราคาเป็นหน่วยโทเคนเดียวกัน
provenance: paul-written
date: 24/08/2026
term_bindings: []
decision_note: |-
  Read back 25/08/2026, and this is the only price on the page.
  Paul, 24/08/2026, option 2a: one number and a link, not the pack table.
  The number is the unit rather than a pack, which is the whole reason the
  unit was held flat at 50 THB when the packs were decided: it is the one
  figure a candidate has to carry, and it stays true whichever pack they buy.
review:
  structural_calque: pass
  text_hash: 53512ba7bd83453f0511418765fc025e8cfc728d7afb7bae783180e7563056fb
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::CLOSE_LEAD`

```yaml
id: src/lib/content/home.ts::CLOSE_LEAD
source: src/lib/content/home.ts
path: CLOSE_LEAD
render: Home page, CLOSE_LEAD
narrative_slot: ask
en: See which stage of the path to working in Europe you are on.
th: เช็กว่าตอนนี้คุณอยู่ขั้นไหน และควรทำอะไรต่อเพื่อไปทำงานในยุโรป
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  PAUL, from `pinned-post-punprofile-intro.md`, with the timing clause

  removed, and `ไปทำงาน` restored on his read of 17/08/2026 where this

  file had drifted to `สู่การทำงาน`.
review:
  structural_calque: pass
  text_hash: 0499245ff695a03c34c76a7d943972ba28916dc6be3edb7fbd53af75f3f9f049
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::FAQ_TEASER_HEADING`

```yaml
id: src/lib/content/home.ts::FAQ_TEASER_HEADING
source: src/lib/content/home.ts
path: FAQ_TEASER_HEADING
render: Home page, FAQ_TEASER_HEADING
narrative_slot: utility
en: You ask, we answer straight
th: ถามมา เราตอบตรง
provenance: paul-approved
date: 25/08/2026
term_bindings: []
decision_note: |-
  Read back 25/08/2026. The reference product's own heading, and it

  suits a page whose FAQ opens by refusing to guarantee a job or a visa.
review:
  structural_calque: pass
  text_hash: 664ca86af7bae7c15cda9247e3e34032db4c27aa2568f1a149cf2dea570ada73
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::HERO_MASCOT_ALT`

```yaml
id: src/lib/content/home.ts::HERO_MASCOT_ALT
source: src/lib/content/home.ts
path: HERO_MASCOT_ALT
render: Home page, HERO_MASCOT_ALT
narrative_slot: utility
en: The PunProfile character reading a document through a magnifying glass
th: ตัวการ์ตูน PunProfile กำลังส่องเอกสารด้วยแว่นขยาย
provenance: paul-approved
date: 17/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 02553e05239580e4b504de85f187925fe38c970a2af1c64739244caac36ec4ef
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::HERO_REFRAME`

```yaml
id: src/lib/content/home.ts::HERO_REFRAME
source: src/lib/content/home.ts
path: HERO_REFRAME
render: Home page, HERO_REFRAME
narrative_slot: misread
en: >-
  Most of the problem is not that you are not good enough. It is that the European job market plays by a
  different set of rules from Thailand's, and nobody tells you at the start what those rules are.
th: >-
  ปัญหาส่วนใหญ่ไม่ใช่ว่าคุณเก่งไม่พอ แต่เป็นเพราะตลาดงานยุโรปเล่นด้วยกติกาคนละชุดกับไทย
  และไม่มีใครบอกคุณตั้งแต่แรกว่ากติกาเหล่านั้นคืออะไร
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  *Paul's wording, 17/08/2026.** Worth reading against what it replaced,

  because it is the same move landed harder.

  `ไม่ใช่ว่าคุณเก่งไม่พอ` rather than `ไม่ได้อยู่ที่ความสามารถ`: the abstract

  noun becomes the thing the reader actually says to themselves, in the

  second person. That is move 4 doing its job, and my version had sanded

  it into a proposition.

  `ตลาดงานยุโรปเล่นด้วยกติกาคนละชุด` gives the market the verb. The rules

  stop being a property of a situation and become something someone else

  is already playing by.
review:
  structural_calque: pass
  text_hash: 5062c9a033a377adc6824ae575ce5136d074893fa73aa48bdb9ec7d3a5e4e809
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::HERO_STANDING`

```yaml
id: src/lib/content/home.ts::HERO_STANDING
source: src/lib/content/home.ts
path: HERO_STANDING
render: Home page, HERO_STANDING
narrative_slot: proof
en: >-
  We have talked with over a hundred Thai professionals who want to work in Europe, and we see the same
  picture come up again and again.
th: เราคุยกับคนไทยกว่าร้อยคนที่อยากไปทำงานในยุโรป และเห็นภาพเดิมเกิดขึ้นซ้ำ ๆ
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  *Rewritten by Paul, 17/08/2026**, from his own pinned-post sentence.

  The note above about `มารับร้อยคน` being a typo for `มาเป็นร้อยคน` is

  settled by this: he wrote `กว่าร้อยคน`, and moved it in front of the

  clause it modifies rather than leaving it trailing.

  `เห็นภาพเดิมเกิดขึ้นซ้ำ ๆ` replaces `เจอแพทเทิร์นเดิมซ้ำ ๆ`. The loanword

  goes, which is the opposite of LR-05's usual direction and right here:

  ภาพ is ordinary Thai for what he means, and แพทเทิร์น was carrying

  nothing the Thai could not.
review:
  structural_calque: pass
  text_hash: 81489939e66d4667591ebdcfc12a177c888ba37a0027376d802ec088750a071a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::HOW_HEADING`

```yaml
id: src/lib/content/home.ts::HOW_HEADING
source: src/lib/content/home.ts
path: HOW_HEADING
render: Home page, HOW_HEADING
narrative_slot: utility
en: How it works
th: ขั้นตอนเป็นอย่างไร
provenance: paul-approved
date: 25/08/2026
term_bindings: []
decision_note: Read back 25/08/2026.
review:
  structural_calque: pass
  text_hash: 9c470592fc224aa554eac1c8a6e44fddd883a70a3364ddb2dadac5322dceee76
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::HOW_STEPS[0].body`

```yaml
id: src/lib/content/home.ts::HOW_STEPS[0].body
source: src/lib/content/home.ts
path: HOW_STEPS[0].body
render: Home page, HOW_STEPS[0].body
narrative_slot: mechanism
en: Seventeen questions about where you are now. No CV needed and no account.
th: คำถาม 17 ข้อเกี่ยวกับสถานการณ์ของคุณตอนนี้ ไม่ต้องใช้ CV และไม่ต้องสร้างบัญชี
provenance: paul-approved
date: 25/08/2026
term_bindings: []
decision_note: |-
  Read back 25/08/2026. The count is real: `verify-content.ts` pins

  Stage 1 at 17 questions and fails the build if it drifts.
review:
  structural_calque: pass
  text_hash: c2355c2dae4b873771fb5f8871c850a5144af62cb5bf6031ed30ab3adbc66327
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::HOW_STEPS[0].title`

```yaml
id: src/lib/content/home.ts::HOW_STEPS[0].title
source: src/lib/content/home.ts
path: HOW_STEPS[0].title
render: Home page, HOW_STEPS[0].title
narrative_slot: utility
en: Answer on your phone
th: ตอบคำถามบนมือถือ
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  Rebuilt from Paul's own EU Fit Check line of 23/08/2026 on `/pricing`.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: ff61e29b8884da9c33408ce2c9c02cb281972db392d733cba2037499fb01cf2a
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::HOW_STEPS[1].body`

```yaml
id: src/lib/content/home.ts::HOW_STEPS[1].body
source: src/lib/content/home.ts
path: HOW_STEPS[1].body
render: Home page, HOW_STEPS[1].body
narrative_slot: mechanism
en: >-
  Four scores against the bars the European market uses, and the parts your answers could not reach are named
  rather than filled in.
th: คะแนนสี่ด้านเทียบกับเกณฑ์ที่ตลาดยุโรปใช้จริง ส่วนที่คำตอบของคุณยังประเมินไม่ได้ เราจะบอกตรง ๆ แทนที่จะเดาให้
provenance: paul-approved
date: 25/08/2026
term_bindings: []
decision_note: |-
  Read back 25/08/2026. The second clause is the not-measured rule

  from `teaser.score.none`, which is the honest half of this product.
review:
  structural_calque: pass
  text_hash: 3268e4eaf5e65003bef915101a746cd3677857dd7cfbcc81e7c38d5ebd7cdd1c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::HOW_STEPS[1].title`

```yaml
id: src/lib/content/home.ts::HOW_STEPS[1].title
source: src/lib/content/home.ts
path: HOW_STEPS[1].title
render: Home page, HOW_STEPS[1].title
narrative_slot: utility
en: See your first read straight away
th: เห็นผลเบื้องต้นทันที
provenance: paul-approved
date: 25/08/2026
term_bindings: []
decision_note: Read back 25/08/2026.
review:
  structural_calque: pass
  text_hash: 53eaf53d0ea9d06a2401b7bba3797b06b6b7b5dd661c8eb36d8351dcabffb58a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::HOW_STEPS[2].body`

```yaml
id: src/lib/content/home.ts::HOW_STEPS[2].body
source: src/lib/content/home.ts
path: HOW_STEPS[2].body
render: Home page, HOW_STEPS[2].body
narrative_slot: mechanism
en: The read names the weakest area and what to do about it, in the order that moves the result soonest.
th: ผลจะบอกว่าด้านไหนยังอ่อนที่สุด และควรทำอะไรก่อน โดยเริ่มจากสิ่งที่จะช่วยให้คุณเห็นผลได้เร็วที่สุด
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: |-
  Read back 25/08/2026. `เห็นผลได้เร็วที่สุด` is Paul's own phrase from

  the Fit Report page, reviewed 23/08/2026.
review:
  structural_calque: pass
  text_hash: 794a3bf5ce0013a59bd47833993489cccdaaf5cdc79d49e3b08dcfc160ceb221
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::HOW_STEPS[2].title`

```yaml
id: src/lib/content/home.ts::HOW_STEPS[2].title
source: src/lib/content/home.ts
path: HOW_STEPS[2].title
render: Home page, HOW_STEPS[2].title
narrative_slot: utility
en: Find which one comes first
th: รู้ว่าควรเริ่มจากเรื่องไหน
provenance: paul-approved
date: 25/08/2026
term_bindings: []
decision_note: Read back 25/08/2026.
review:
  structural_calque: pass
  text_hash: ff23b8e4b6c33e9b8b1f502fb565e73b7ecff40d684748f0eaaf9b9caf9966d1
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::HOW_STEPS[3].body`

```yaml
id: src/lib/content/home.ts::HOW_STEPS[3].body
source: src/lib/content/home.ts
path: HOW_STEPS[3].body
render: Home page, HOW_STEPS[3].body
narrative_slot: mechanism
en: Some of what comes next is free. The rest is bought a piece at a time, and nothing needs a subscription.
th: บางส่วนใช้ได้ฟรี ส่วนที่เหลือเลือกซื้อทีละชิ้นได้ตามที่ต้องการ ไม่มีระบบสมาชิกรายเดือน
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: |-
  Read back 25/08/2026. Says nothing about being contacted, which is

  the 23/08/2026 decision recorded on `FREE_ITEMS` in `pricing.ts`.
review:
  structural_calque: pass
  text_hash: 9cd200176ffd138d595d5875e372d3925ee3f331ac6f1688378b82a681b1bbbf
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::HOW_STEPS[3].title`

```yaml
id: src/lib/content/home.ts::HOW_STEPS[3].title
source: src/lib/content/home.ts
path: HOW_STEPS[3].title
render: Home page, HOW_STEPS[3].title
narrative_slot: utility
en: Take the next step when you are ready
th: ไปต่อเมื่อคุณพร้อม
provenance: paul-approved
date: 25/08/2026
term_bindings: []
decision_note: Read back 25/08/2026.
review:
  structural_calque: pass
  text_hash: 41fce1fce686c9f7c69948338e2b89e33f357da7881036e4760f2323ffc84010
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::MARKET_BODY`

```yaml
id: src/lib/content/home.ts::MARKET_BODY
source: src/lib/content/home.ts
path: MARKET_BODY
render: Home page, MARKET_BODY
narrative_slot: utility
en: >-
  We go through job adverts from across Europe, check which employers really do sponsor a visa, and pick out
  only the roles a Thai applicant can genuinely apply for.
th: >-
  เราไล่ดูประกาศงานจากทั่วยุโรป เช็กว่าบริษัทไหนระบุเรื่องสปอนเซอร์วีซ่าไว้อย่างชัดเจน
  แล้วคัดมาเฉพาะตำแหน่งที่คนไทยมีโอกาสสมัครได้จริง
provenance: paul-approved
date: 17/08/2026
term_bindings: []
decision_note: |-
  *`สปอนเซอร์วีซ่า`, decided by Paul 17/08/2026**, overriding the

  `สนับสนุนวีซ่า` this line briefly carried. He used it as a verb three

  times in one review pass, here, on the stat label below and in

  `VISA_BODY`, which settles a term that had never actually been decided.

  It belongs in `termbase.yml`.

  `ไล่ดู` and `คัดมา` rather than `อ่าน` and `ประกาศ`: the first pair

  describes sifting, the second described reading and republishing, and

  sifting is what the pipeline does. `สมัครได้จริง` closes on the reader.
review:
  structural_calque: pass
  text_hash: a44f6cfbbb13f60f6b31b2e409c756b11cfb8753ca8f8a9bc31ff4ba214505f5
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::MARKET_FOOT`

```yaml
id: src/lib/content/home.ts::MARKET_FOOT
source: src/lib/content/home.ts
path: MARKET_FOOT
render: Home page, MARKET_FOOT
narrative_slot: utility
en: Figures from {from} to {to}. We post these roles in the Thai Jobs in Europe group.
th: ระหว่าง {from} ถึง {to} เราได้ประกาศตำแหน่งเหล่านี้ในกลุ่ม Thai Jobs in Europe
provenance: paul-approved
date: 17/08/2026
term_bindings: []
decision_note: |-
  The free-and-public clause was here and came out on 17/08/2026, for two
  reasons that landed together.
  The first is a rule. It was `เปิดฟรีและเป็นสาธารณะ`, reused verbatim from
  `FOLLOW_BODY` in `footer.ts` on the reasoning that an approved collocation
  beats a fresh one. Running `lint-thai` over the page modules, which
  `verify-copy.ts` does not reach, **failed it under LR-04**: ฟรี is attached
  to เปิด, and LR-04 allows ฟรี only on a word that already denotes a valuable
  service. The reuse was sound and the string it reused had simply never been
  linted. `footer.ts` still carries it and that is Paul's to decide; see
  `npm run verify:pages`.
  The second is better than the first. The claim belongs in `COST_ROWS`, which
  is a whole section about what is free, and a footnote about dates is not
  where a reader looks for it. Removing it removed a duplicate.
review:
  structural_calque: pass
  text_hash: 6f4b625e9986eebcde2daa2b054c88bc331d7856b7ab51c72a979693aeaacd70
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::MARKET_HEADING`

```yaml
id: src/lib/content/home.ts::MARKET_HEADING
source: src/lib/content/home.ts
path: MARKET_HEADING
render: Home page, MARKET_HEADING
narrative_slot: utility
en: What we actually do, every day
th: สิ่งที่เราทำจริงในทุกวัน
provenance: paul-approved
date: 17/08/2026
term_bindings: []
decision_note: |-
  *Daily, not weekly**, corrected by Paul 17/08/2026. That is a fact

  rather than a wording preference and I had it wrong: `run.sh` in the

  coaching repo's `work-skills/daily-jobs/` fires every day at 18:00

  Europe/Berlin.

  `ทุกๆวัน` is his spacing and is left exactly as he typed it.
review:
  structural_calque: pass
  text_hash: 291c84d9bd06d010a6446c4a213f575df985b7d9ffee49b4dc9a2846fcc128a7
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::PROBLEM_BODY`

```yaml
id: src/lib/content/home.ts::PROBLEM_BODY
source: src/lib/content/home.ts
path: PROBLEM_BODY
render: Home page, PROBLEM_BODY
narrative_slot: symptom
en: >-
  A Bangkok senior title can read as mid-level in Amsterdam. A well-known Thai employer reads as an unknown
  one. Most people are not turned down for what they have done, they are turned down before anyone works out
  what that was.
th: >-
  ตำแหน่งระดับอาวุโสในกรุงเทพฯ อาจถูกมองว่าเป็นเพียงระดับกลางในอัมสเตอร์ดัม
  บริษัทชื่อดังในไทยอาจไม่มีใครรู้จักในยุโรป คนส่วนใหญ่ไม่ได้ถูกปฏิเสธเพราะประสบการณ์ที่มี
  แต่ถูกปฏิเสธก่อนที่ใครจะเข้าใจด้วยซ้ำว่าเคยทำอะไรมาบ้าง
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  Read back 25/08/2026. Drafted from `10_Methodology.md` and from the

  CV Check page's own `how` lines, which Paul reviewed on 23/08/2026.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: b8bd43ea4529051d8b4ec6850932b90d5b30125b3e520f1a97fdf2d0cae32c6f
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::PROBLEM_HEADING`

```yaml
id: src/lib/content/home.ts::PROBLEM_HEADING
source: src/lib/content/home.ts
path: PROBLEM_HEADING
render: Home page, PROBLEM_HEADING
narrative_slot: utility
en: The problem is rarely the experience
th: ปัญหาส่วนใหญ่ไม่ได้อยู่ที่ประสบการณ์ของคุณ
provenance: paul-approved
date: 25/08/2026
term_bindings: []
decision_note: |-
  Read back 25/08/2026. `10_Methodology.md`'s core claim said to a

  stranger: illegibility rather than capability.
review:
  structural_calque: pass
  text_hash: 7a7ab5a6fe5c1ccf03295c8395da05592b890197c41f4e4ccd531db66f27561f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::RESULTS_HEADING`

```yaml
id: src/lib/content/home.ts::RESULTS_HEADING
source: src/lib/content/home.ts
path: RESULTS_HEADING
render: Home page, RESULTS_HEADING
narrative_slot: utility
en: What happened next
th: ผลลัพธ์ที่เกิดขึ้นจริง
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  Not rendered while RESULTS is empty. Held rather than written, so the day

  there is one to show, the heading is not the thing blocking it.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: d8464af22c11c45694e5e7007fcabb78737c3928eb0125c8430eab58a93738fd
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::RESULTS[0].quote`

```yaml
id: src/lib/content/home.ts::RESULTS[0].quote
source: src/lib/content/home.ts
path: RESULTS[0].quote
render: Home page, RESULTS[0].quote
narrative_slot: proof
en: The one-on-one coaching helped me recognize my strengths and present my experience more effectively. I now feel much more confident and focused in my job search.
th: พอได้คุยกับโค้ชแบบตัวต่อตัว ฉันเห็นจุดแข็งของตัวเองชัดขึ้น และรู้ว่าจะเล่าประสบการณ์อย่างไรให้น่าสนใจ ตอนนี้สมัครงานได้อย่างมั่นใจและมีทิศทางมากขึ้นค่ะ
provenance: paul-approved
date: 22/09/2026
term_bindings: []
decision_note: |-
  Paul supplied this on 22/09/2026 as a real client's words, from 1-on-1 coaching. Quoted as supplied, never edited for voice.

  Not part of the clean corpus: this is the client's voice, not PunProfile's.
review:
  structural_calque: pass
  text_hash: 8a25c60f282bfce7c8bcaf7fb7bd6591bae36d399643f5b9cae3fd2682f9b765
  prompt_version: structural-calque-v1
  basis: Paul supplied this text on 22/09/2026 as a real client's words. A quote is not rewritten, so it is recorded as authoritative.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::RESULTS[0].who`

```yaml
id: src/lib/content/home.ts::RESULTS[0].who
source: src/lib/content/home.ts
path: RESULTS[0].who
render: Home page, RESULTS[0].who
narrative_slot: utility
en: Min
th: มิน
provenance: paul-approved
date: 22/09/2026
term_bindings: []
decision_note: |-
  The client's first name, as Paul supplied it on 22/09/2026.
review:
  structural_calque: pass
  text_hash: 456dcd3f622b36a408d4f59ac8e561f1d6c90cc6727ca68d00be5cb3ebca7a83
  prompt_version: structural-calque-v1
  basis: Paul supplied this text on 22/09/2026 as a real client's words. A quote is not rewritten, so it is recorded as authoritative.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::RESULTS[0].role`

```yaml
id: src/lib/content/home.ts::RESULTS[0].role
source: src/lib/content/home.ts
path: RESULTS[0].role
render: Home page, RESULTS[0].role
narrative_slot: utility
en: Marketing Professional
th: สายงานการตลาด
provenance: paul-approved
date: 22/09/2026
term_bindings: []
decision_note: |-
  The client's line of work, as Paul supplied it on 22/09/2026.
review:
  structural_calque: pass
  text_hash: 86347d8e1c0ef8653541b895f5aa39c618723ec7dc1f069a886671eeacb20550
  prompt_version: structural-calque-v1
  basis: Paul supplied this text on 22/09/2026 as a real client's words. A quote is not rewritten, so it is recorded as authoritative.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::RESULTS[1].quote`

```yaml
id: src/lib/content/home.ts::RESULTS[1].quote
source: src/lib/content/home.ts
path: RESULTS[1].quote
render: Home page, RESULTS[1].quote
narrative_slot: proof
en: The customized job alerts save me a lot of time. Relevant opportunities that match my skills and goals arrive directly in my inbox, so I never miss a great role.
th: ระบบแจ้งเตือนงานช่วยประหยัดเวลาได้เยอะครับ ไม่ต้องคอยไล่หางานเองทุกวัน เพราะตำแหน่งที่ตรงกับทักษะและเป้าหมายจะส่งเข้าอีเมลให้เลย ทำให้ไม่พลาดโอกาสดี ๆ
provenance: paul-approved
date: 22/09/2026
term_bindings: []
decision_note: |-
  Paul supplied this on 22/09/2026 as a real client's words, from customised job alerts. Quoted as supplied, never edited for voice.

  Not part of the clean corpus: this is the client's voice, not PunProfile's.
review:
  structural_calque: pass
  text_hash: ff6f99a0540ca7fce6207f911bd6b03d4b773984323b8b5bc4af3a30ebd2b283
  prompt_version: structural-calque-v1
  basis: Paul supplied this text on 22/09/2026 as a real client's words. A quote is not rewritten, so it is recorded as authoritative.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::RESULTS[1].who`

```yaml
id: src/lib/content/home.ts::RESULTS[1].who
source: src/lib/content/home.ts
path: RESULTS[1].who
render: Home page, RESULTS[1].who
narrative_slot: utility
en: Non
th: นนท์
provenance: paul-approved
date: 22/09/2026
term_bindings: []
decision_note: |-
  The client's first name, as Paul supplied it on 22/09/2026.
review:
  structural_calque: pass
  text_hash: bd14cd4cb30497c16269b0846263275ee239d974630368f46e4a2611f17327ee
  prompt_version: structural-calque-v1
  basis: Paul supplied this text on 22/09/2026 as a real client's words. A quote is not rewritten, so it is recorded as authoritative.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::RESULTS[1].role`

```yaml
id: src/lib/content/home.ts::RESULTS[1].role
source: src/lib/content/home.ts
path: RESULTS[1].role
render: Home page, RESULTS[1].role
narrative_slot: utility
en: IT Professional
th: สายงานไอที
provenance: paul-approved
date: 22/09/2026
term_bindings: []
decision_note: |-
  The client's line of work, as Paul supplied it on 22/09/2026.
review:
  structural_calque: pass
  text_hash: 9e73b72df16afca807b7d6f7aab6f23d3270c93e3cf5532c4f7ca965c63b9212
  prompt_version: structural-calque-v1
  basis: Paul supplied this text on 22/09/2026 as a real client's words. A quote is not rewritten, so it is recorded as authoritative.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::RESULTS[2].quote`

```yaml
id: src/lib/content/home.ts::RESULTS[2].quote
source: src/lib/content/home.ts
path: RESULTS[2].quote
render: Home page, RESULTS[2].quote
narrative_slot: proof
en: PunProfile’s AI upskilling course was easy to follow and immediately useful. I now work more efficiently and feel confident using AI tools in my daily tasks.
th: เนื้อหาเรื่อง AI เข้าใจง่ายและนำไปใช้กับงานได้จริงครับ ตอนนี้ผมใช้เครื่องมือ AI ช่วยทำงานได้คล่องขึ้น ประหยัดเวลา และมั่นใจกว่าเดิมเยอะ
provenance: paul-approved
date: 22/09/2026
term_bindings: []
decision_note: |-
  Paul supplied this on 22/09/2026 as a real client's words, from AI training. Quoted as supplied, never edited for voice.

  The brand is cased PunProfile in the English, where the supplied text read Punprofile. Nothing else was changed.

  Not part of the clean corpus: this is the client's voice, not PunProfile's.
review:
  structural_calque: pass
  text_hash: 4697f845c2d7980a7673d7fcee9edb6b65f8d440dfce72a17428264525fe8d11
  prompt_version: structural-calque-v1
  basis: Paul supplied this text on 22/09/2026 as a real client's words. A quote is not rewritten, so it is recorded as authoritative.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::RESULTS[2].who`

```yaml
id: src/lib/content/home.ts::RESULTS[2].who
source: src/lib/content/home.ts
path: RESULTS[2].who
render: Home page, RESULTS[2].who
narrative_slot: utility
en: Jay
th: เจ
provenance: paul-approved
date: 22/09/2026
term_bindings: []
decision_note: |-
  The client's first name, as Paul supplied it on 22/09/2026.
review:
  structural_calque: pass
  text_hash: 29f9dae3837af3714a6bf6437a0da18b852516d2f934c5d533cdb7867bc69d0c
  prompt_version: structural-calque-v1
  basis: Paul supplied this text on 22/09/2026 as a real client's words. A quote is not rewritten, so it is recorded as authoritative.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::RESULTS[2].role`

```yaml
id: src/lib/content/home.ts::RESULTS[2].role
source: src/lib/content/home.ts
path: RESULTS[2].role
render: Home page, RESULTS[2].role
narrative_slot: utility
en: Business Professional
th: สายงานธุรกิจ
provenance: paul-approved
date: 22/09/2026
term_bindings: []
decision_note: |-
  The client's line of work, as Paul supplied it on 22/09/2026.
review:
  structural_calque: pass
  text_hash: 421572bcb3a3c6cf194aa551b4ff2662788a28a90cdd073f95e68c84b95dad5e
  prompt_version: structural-calque-v1
  basis: Paul supplied this text on 22/09/2026 as a real client's words. A quote is not rewritten, so it is recorded as authoritative.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::SAMPLE_HEADING`

```yaml
id: src/lib/content/home.ts::SAMPLE_HEADING
source: src/lib/content/home.ts
path: SAMPLE_HEADING
render: Home page, SAMPLE_HEADING
narrative_slot: utility
en: You cannot fix what nobody will tell you
th: สิ่งที่ไม่มีใครบอก คุณก็แก้ไม่ได้
provenance: paul-approved
date: 25/08/2026
term_bindings: []
decision_note: |-
  Read back 25/08/2026. The reference product's own heading, which is

  the argument for the whole section.
review:
  structural_calque: pass
  text_hash: db793b0f7708f4887e9ba4fd6c39df44d6ec6e4e23166337305ef9ab446950e0
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::SAMPLE_LABEL`

```yaml
id: src/lib/content/home.ts::SAMPLE_LABEL
source: src/lib/content/home.ts
path: SAMPLE_LABEL
render: Home page, SAMPLE_LABEL
narrative_slot: utility
en: Example
th: ตัวอย่าง
provenance: paul-approved
date: 25/08/2026
term_bindings: []
decision_note: Read back 25/08/2026. One word, above the card, unmissable.
review:
  structural_calque: pass
  text_hash: 105ede4807f24c6f5f2aa979f89ef0bd97b878e40a78a5d5b3aec3e7de360fc2
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::SAMPLE_LEAD`

```yaml
id: src/lib/content/home.ts::SAMPLE_LEAD
source: src/lib/content/home.ts
path: SAMPLE_LEAD
render: Home page, SAMPLE_LEAD
narrative_slot: proof
en: 'This is what the first read looks like: four scores, and what each one means for you.'
th: 'ผลเบื้องต้นมีหน้าตาแบบนี้: คะแนนสี่ด้าน พร้อมคำอธิบายว่าแต่ละด้านหมายถึงอะไรสำหรับคุณ'
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 14ea918a71dba4a0aa5bba487362baae689abb430388965f5b1f77068f31321b
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::SAMPLE_NOTE`

```yaml
id: src/lib/content/home.ts::SAMPLE_NOTE
source: src/lib/content/home.ts
path: SAMPLE_NOTE
render: Home page, SAMPLE_NOTE
narrative_slot: proof
en: An example, not a real person. Your own numbers come from your own answers.
th: นี่เป็นเพียงตัวอย่าง ไม่ใช่ผลของคนจริง ตัวเลขของคุณจะมาจากคำตอบของคุณเอง
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: |-
  Read back 25/08/2026. Built on the shape of Paul's own calculator

  disclaimer of 23/08/2026, which says the numbers come from what you typed.
review:
  structural_calque: pass
  text_hash: 9f6dfe5339354be893d538e3fc0bdb4d8e4984f75d2ce2f91bbaf194ec794a7e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::TRIAGE_HEADING`

```yaml
id: src/lib/content/home.ts::TRIAGE_HEADING
source: src/lib/content/home.ts
path: TRIAGE_HEADING
render: Home page, TRIAGE_HEADING
narrative_slot: utility
en: You do not need to know which service you need
th: คุณไม่จำเป็นต้องรู้ว่าควรใช้บริการไหน
provenance: paul-approved
date: 25/08/2026
term_bindings: []
decision_note: |-
  Read back 25/08/2026. The reference product's own framing, which is

  the load-bearing idea on its page: the reader picks a problem, not a tool.
review:
  structural_calque: pass
  text_hash: ed026bb1a3a496c45eab960dbbf33884d9272b061341043e2cd6e6db20e37804
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::TRIAGE_LEAD`

```yaml
id: src/lib/content/home.ts::TRIAGE_LEAD
source: src/lib/content/home.ts
path: TRIAGE_LEAD
render: Home page, TRIAGE_LEAD
narrative_slot: utility
en: Pick the one that sounds like you.
th: เลือกข้อที่ตรงกับคุณที่สุด
provenance: paul-approved
date: 25/08/2026
term_bindings: []
decision_note: Read back 25/08/2026.
review:
  structural_calque: pass
  text_hash: 57630e2d7259eda2f68f4678306621a76ba49629a4391c0012f352748004a77c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::TRIAGE[0].body`

```yaml
id: src/lib/content/home.ts::TRIAGE[0].body
source: src/lib/content/home.ts
path: TRIAGE[0].body
render: Home page, TRIAGE[0].body
narrative_slot: utility
en: Go to CV Check, which reads the CV the way a European screener reads it.
th: ไปที่ CV Check ซึ่งจะอ่าน CV ของคุณแบบเดียวกับที่ผู้คัดกรองในยุโรปอ่าน
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 3c579e7657eabe6246a67fbce88830c071dc61199dc59a6e50744d445ea1d2d0
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::TRIAGE[0].line`

```yaml
id: src/lib/content/home.ts::TRIAGE[0].line
source: src/lib/content/home.ts
path: TRIAGE[0].line
render: Home page, TRIAGE[0].line
narrative_slot: utility
en: I have applied to a lot of places and hardly anyone gets back to me.
th: สมัครไปหลายที่แล้ว แต่แทบไม่มีใครติดต่อกลับ
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  Paul's Thai, VERBATIM from `questions.ts`, the employer-response option.

  Nothing was added: it already stands on its own.
review:
  structural_calque: pass
  text_hash: 2f30abad7fe916e4a37191bc102c2df6228a0293571f161862c788cdecd3457e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::TRIAGE[1].body`

```yaml
id: src/lib/content/home.ts::TRIAGE[1].body
source: src/lib/content/home.ts
path: TRIAGE[1].body
render: Home page, TRIAGE[1].body
narrative_slot: utility
en: Go to coaching, where we work through the round you keep stopping at.
th: ไปที่หน้าโค้ชชิ่ง เพื่อช่วยกันแก้จุดที่ทำให้คุณติดอยู่ในรอบเดิม
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 787826ffc887f88b7a6057ad7a6ebd33c3fe45ae8cc2ab1f7eb1dbc72dc232bc
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::TRIAGE[1].line`

```yaml
id: src/lib/content/home.ts::TRIAGE[1].line
source: src/lib/content/home.ts
path: TRIAGE[1].line
render: Home page, TRIAGE[1].line
narrative_slot: utility
en: I have interviewed, but I do not get through to the next round.
th: เคยสัมภาษณ์แล้ว แต่ยังไม่ผ่านเข้ารอบถัดไป
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: Paul's Thai, VERBATIM from `questions.ts`, the job-search-stage option.
review:
  structural_calque: pass
  text_hash: e4e7de2eca63b6d1d13eca32b49d953f6b5030a16fe7aa8704ea6afa2a8c9bb9
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::TRIAGE[2].body`

```yaml
id: src/lib/content/home.ts::TRIAGE[2].body
source: src/lib/content/home.ts
path: TRIAGE[2].body
render: Home page, TRIAGE[2].body
narrative_slot: utility
en: Go to CV Check, which lists what to change and why, one point at a time.
th: ไปที่ CV Check ซึ่งจะบอกว่าควรแก้จุดไหน พร้อมเหตุผลของแต่ละจุด
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 5bf24650da17e7536dfdb5bf52f25ddc372a2019bbb202d2b75204b7b62646b3
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::TRIAGE[2].line`

```yaml
id: src/lib/content/home.ts::TRIAGE[2].line
source: src/lib/content/home.ts
path: TRIAGE[2].line
render: Home page, TRIAGE[2].line
narrative_slot: utility
en: I have a CV, but it has not been adapted for Europe.
th: มี CV อยู่แล้ว แต่ยังไม่ได้ปรับให้เหมาะกับตลาดยุโรป
provenance: paul-approved
date: 25/08/2026
term_bindings: []
decision_note: |-
  Read back 25/08/2026. Paul's CV option `มีแต่ยังไม่ปรับให้เหมาะกับยุโรป`

  with its subject restored, because the option is a fragment answering

  a question the reader cannot see here.
review:
  structural_calque: pass
  text_hash: 77b63944c9d79bd2fc60d01871cf554d44354ef0aba4a815ef90daeef326d6d9
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::TRIAGE[3].body`

```yaml
id: src/lib/content/home.ts::TRIAGE[3].body
source: src/lib/content/home.ts
path: TRIAGE[3].body
render: Home page, TRIAGE[3].body
narrative_slot: utility
en: Start the check, which asks about work rights and says where you stand.
th: เริ่มทำ EU Fit Check ซึ่งจะถามเรื่องสิทธิในการทำงานและบอกว่าตอนนี้คุณอยู่จุดไหน
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: fd86dbdad05f4d4212435527b71a48658f5c8d7a589991e26c1172d9d3e1405a
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::TRIAGE[3].line`

```yaml
id: src/lib/content/home.ts::TRIAGE[3].line
source: src/lib/content/home.ts
path: TRIAGE[3].line
render: Home page, TRIAGE[3].line
narrative_slot: utility
en: On visas and work rights, I do not yet know what I need to prepare.
th: เรื่องวีซ่าและสิทธิในการทำงาน ยังไม่รู้ว่าต้องเตรียมอะไรบ้าง
provenance: paul-approved
date: 25/08/2026
term_bindings: []
decision_note: |-
  Read back 25/08/2026. Paul's visa option `ยังไม่รู้ว่าต้องเตรียมอะไรบ้าง`

  with the subject of its own question folded in.
review:
  structural_calque: pass
  text_hash: 96e7b23866f13a125736030caac7510914d6852bdf1855f0ae7123dadc521968
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::TRIAGE[4].body`

```yaml
id: src/lib/content/home.ts::TRIAGE[4].body
source: src/lib/content/home.ts
path: TRIAGE[4].body
render: Home page, TRIAGE[4].body
narrative_slot: utility
en: Go to coaching, where deciding the direction is the first thing we do.
th: ไปที่หน้าโค้ชชิ่ง ซึ่งสิ่งแรกที่เราจะทำคือช่วยกันกำหนดทิศทาง
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 865a6d74911984477a3827365ed282904c6137725a0afd6e954e34786e91f195
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::TRIAGE[4].line`

```yaml
id: src/lib/content/home.ts::TRIAGE[4].line
source: src/lib/content/home.ts
path: TRIAGE[4].line
render: Home page, TRIAGE[4].line
narrative_slot: utility
en: I am not sure which field I want to work in over there.
th: ยังไม่แน่ใจว่าอยากทำงานสายไหนในยุโรป
provenance: paul-approved
date: 25/08/2026
term_bindings: []
decision_note: |-
  Read back 25/08/2026. Paul's `ยังไม่แน่ใจ` on the target-field

  question, which needs that question to mean anything.
review:
  structural_calque: pass
  text_hash: e7e812fa0f0a7d52f3c006fc367aa24102c4bcccf3692a527cf1fce48be61783
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::TRIAGE[5].body`

```yaml
id: src/lib/content/home.ts::TRIAGE[5].body
source: src/lib/content/home.ts
path: TRIAGE[5].body
render: Home page, TRIAGE[5].body
narrative_slot: utility
en: Start the check, which scores how ready your profile is to be found.
th: เริ่มทำ EU Fit Check ซึ่งจะประเมินว่าโปรไฟล์ของคุณพร้อมให้คนหาเจอแค่ไหน
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 50880f855429050a1f189b10d013f03c036f99ac2b567c6307cdc12ab99414fd
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::TRIAGE[5].line`

```yaml
id: src/lib/content/home.ts::TRIAGE[5].line
source: src/lib/content/home.ts
path: TRIAGE[5].line
render: Home page, TRIAGE[5].line
narrative_slot: utility
en: I have a LinkedIn, but I have not updated it in a long time.
th: มี LinkedIn อยู่ แต่ไม่ได้อัปเดตมานานแล้ว
provenance: paul-approved
date: 25/08/2026
term_bindings: []
decision_note: |-
  Read back 25/08/2026. Paul's LinkedIn option `มี แต่ไม่ได้อัปเดต`,

  expanded the same way as the two above.
review:
  structural_calque: pass
  text_hash: 3e6bfdcf2d30ff49688a3e765bd0c95fd6417599b896542140e65025ab305b1c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::VISA_BODY`

```yaml
id: src/lib/content/home.ts::VISA_BODY
source: src/lib/content/home.ts
path: VISA_BODY
render: Home page, VISA_BODY
narrative_slot: utility
en: >-
  Visa sponsorship is the question we are asked most. What we can do is help make your profile strong enough
  to compete from the start, rather than waiting for luck to fall your way.
th: >-
  คำถามเรื่องการสปอนเซอร์วีซ่าคือเรื่องที่เราเจอบ่อยที่สุด
  สิ่งที่เราทำได้คือช่วยให้โปรไฟล์ของคุณแข็งแรงพอที่จะแข่งขันได้ตั้งแต่แรก แทนที่จะต้องรอให้โชคเข้าข้าง
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  *Paul rewrote his own pinned-post sentence for this page, 17/08/2026.**

  The note that used to sit here said it was his verbatim and not to be

  paraphrased, which was right about everyone except him.

  `การสปอนเซอร์วีซ่า` nominalises what was a bare noun phrase, `แข็งแรง`

  replaces `แข็งแกร่ง`, and `แทนที่จะต้องรอให้โชคเข้าข้าง` replaces

  `ไม่ใช่แค่รอโชคช่วย`. That last one is the interesting change: the feed

  version refuses the magic in four words, and a page has room to say

  what you do instead of waiting.
review:
  structural_calque: pass
  text_hash: 0200debc90c37fc3332b657456a9b33c012549d9f12d16402889d877f11061ce
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::WHO_BODY`

```yaml
id: src/lib/content/home.ts::WHO_BODY
source: src/lib/content/home.ts
path: WHO_BODY
render: Home page, WHO_BODY
narrative_slot: house.not
en: >-
  PunProfile is two people, and you talk to both of them. Neither is paid by an employer, so the advice starts
  from your goals rather than from a vacancy somebody is rushing to fill.
th: >-
  PunProfile มีกันสองคน และคุณจะได้คุยกับเราทั้งคู่ เราไม่ได้รับเงินจากนายจ้าง
  บริษัทไหนจะรีบหาคนแค่ไหนก็ไม่ใช่โจทย์ของเรา เราเริ่มจากเป้าหมายของคุณ
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  **Two people since 25/08/2026, and this is a factual correction.** Dew
  joined, so "run by one person" is wrong rather than dated. The argument
  survives the change intact, which is the point worth keeping: what mattered
  was never the headcount, it was who pays. `Narrative_System.md` § the house
  narrative carries the slot this line fills.
  He is not named here yet. His name, the ten-year claim and why US placement
  is evidence for reading a European market are all his to write, and
  `dew-tatiy-review.md` is waiting on them.

  Read back 25/08/2026. Drafted.

  Read back 25/08/2026. The second sentence is Paul's own, from

  `FOUNDER_AFTER` in `coaching.ts`, which he wrote and reviewed.

  Reworked 10/09/2026 after Paul said WHO_BODY still needed work. The new
  candidate removes abstract agency and rebuilds the contrast around what we
  do when talking with the reader. It remains pending until Paul approves the
  final Thai wording.

  Approved 10/09/2026. Paul chose a second rework over the pending candidate.
  It drops the remaining `จึง` and the closing `ที่` clause, carries the
  contrast by Thai topic order (`บริษัทไหนจะรีบหาคนแค่ไหนก็ไม่ใช่โจทย์ของเรา`),
  and ends on the reader's goal. Model-drafted and approved unchanged, so it
  ships but stays out of the clean corpus.
review:
  structural_calque: pass
  text_hash: 056429264ae04257ed203a9e53050d8247efd04c363ea4ad7332b2ae8a99d3c0
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/home.ts::WHO_HEADING`

```yaml
id: src/lib/content/home.ts::WHO_HEADING
source: src/lib/content/home.ts
path: WHO_HEADING
render: Home page, WHO_HEADING
narrative_slot: utility
en: Who is behind this
th: ใครอยู่เบื้องหลัง PunProfile
provenance: paul-approved
date: 25/08/2026
term_bindings: []
decision_note: Read back 25/08/2026.
review:
  structural_calque: pass
  text_hash: f947cb61e2a800b0c83327a85645503e38eeb9e401fd6088ceb560ed58786f6b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/method.ts::CLAIM_BODY`

```yaml
id: src/lib/content/method.ts::CLAIM_BODY
source: src/lib/content/method.ts
path: CLAIM_BODY
render: Method page, CLAIM_BODY
narrative_slot: mechanism
en: >-
  Getting hired in Europe is not mostly a question of being good enough. It is a question of being legible,
  and legibility can be measured.
th: >-
  การได้งานในยุโรปไม่ได้อยู่ที่ว่าคุณเก่งพอหรือไม่เป็นหลัก
  แต่อยู่ที่ว่าคนอ่านโปรไฟล์มองเห็นสิ่งที่คุณมีหรือไม่ และเรื่องนี้วัดได้
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: |-
  Paul's wording, 06/09/2026. The home page states the same claim from the reader's side,

  in Paul's own approved wording; this states it as the premise of a method,

  which is a different sentence doing a different job on a different page.
review:
  structural_calque: pass
  text_hash: 8d8b6fe2a7d733cf84f411d44795b6ebba01065b8a62693b1c9109a917f6e6ee
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/method.ts::CLAIM_HEADING`

```yaml
id: src/lib/content/method.ts::CLAIM_HEADING
source: src/lib/content/method.ts
path: CLAIM_HEADING
render: Method page, CLAIM_HEADING
narrative_slot: utility
en: What it rests on
th: ข้อสมมติหลักของวิธีนี้
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: 0e96244bd0375c41c1c9fc6512f8c89f96b45514cafd5ed7ccdee2434d85f5f2
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/method.ts::GATE_BAR`

```yaml
id: src/lib/content/method.ts::GATE_BAR
source: src/lib/content/method.ts
path: GATE_BAR
render: Method page, GATE_BAR
narrative_slot: mechanism
en: clears at
th: เกณฑ์ผ่าน
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: Paul's wording, 06/09/2026.
review:
  structural_calque: pass
  text_hash: abef073aee041f13c3f054668b980898ca72e596a4ee5cbb748e262e7e18a31a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/method.ts::GATE_QUESTIONS.employability`

```yaml
id: src/lib/content/method.ts::GATE_QUESTIONS.employability
source: src/lib/content/method.ts
path: GATE_QUESTIONS.employability
render: Method page, GATE_QUESTIONS.employability
narrative_slot: utility
en: Can you get interviews?
th: คุณไปถึงขั้นสัมภาษณ์ได้หรือไม่
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: Paul's wording, 06/09/2026.
review:
  structural_calque: pass
  text_hash: d320e0dd56d3c2ea1e437c46b2fd362f2aab9f6001ddd622451aefe7f2fa6638
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/method.ts::GATE_QUESTIONS.europeanMarketFit`

```yaml
id: src/lib/content/method.ts::GATE_QUESTIONS.europeanMarketFit
source: src/lib/content/method.ts
path: GATE_QUESTIONS.europeanMarketFit
render: Method page, GATE_QUESTIONS.europeanMarketFit
narrative_slot: utility
en: Are you competitive against local candidates?
th: คุณแข่งกับผู้สมัครในประเทศนั้นได้หรือไม่
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: 3b76ff1591ec7dd8f60e1ab3d8914e055c97b5807f0d0a4b781e4cfeb8074fb6
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/method.ts::GATE_QUESTIONS.mobilityReadiness`

```yaml
id: src/lib/content/method.ts::GATE_QUESTIONS.mobilityReadiness
source: src/lib/content/method.ts
path: GATE_QUESTIONS.mobilityReadiness
render: Method page, GATE_QUESTIONS.mobilityReadiness
narrative_slot: utility
en: Can you legally and practically be there?
th: คุณไปอยู่ที่นั่นได้จริงหรือไม่ ทั้งในทางกฎหมายและในทางปฏิบัติ
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: 433c0337947cfb13609e31d72b7788944426283b169eda63a83ef569b965d67a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/method.ts::GATE_QUESTIONS.professionalCapability`

```yaml
id: src/lib/content/method.ts::GATE_QUESTIONS.professionalCapability
source: src/lib/content/method.ts
path: GATE_QUESTIONS.professionalCapability
render: Method page, GATE_QUESTIONS.professionalCapability
narrative_slot: utility
en: Can you do the job?
th: คุณทำงานนั้นได้หรือไม่
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: 67ecf076631dcd750093a016cdedc56b9bd0081874278d1f766e33835324edcd
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/method.ts::GATES_HEADING`

```yaml
id: src/lib/content/method.ts::GATES_HEADING
source: src/lib/content/method.ts
path: GATES_HEADING
render: Method page, GATES_HEADING
narrative_slot: utility
en: The four gates, in the order they are cleared
th: สี่ด่าน เรียงตามลำดับที่ต้องผ่าน
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: 18dd492e4366f19f4dcbbe9a48e352614f1c9e617242e7ec0f42f40b521aa2ca
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/method.ts::GATES_LOWEST`

```yaml
id: src/lib/content/method.ts::GATES_LOWEST
source: src/lib/content/method.ts
path: GATES_LOWEST
render: Method page, GATES_LOWEST
narrative_slot: mechanism
en: >-
  And the lowest gate you have not cleared is the only one that matters this month. The method does not hand
  you a five-item list.
th: และด่านแรกที่คุณยังไม่ผ่าน คือด่านเดียวที่สำคัญในเดือนนี้ วิธีนี้ไม่ได้ยื่นรายการห้าข้อให้คุณไปทำพร้อมกัน
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: Paul's wording, 06/09/2026.
review:
  structural_calque: pass
  text_hash: 186cbcfe3c057224d05fa9ba6ca964e00c5498a74744ae6a5bd445f125b69c67
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/method.ts::GATES_ORDER`

```yaml
id: src/lib/content/method.ts::GATES_ORDER
source: src/lib/content/method.ts
path: GATES_ORDER
render: Method page, GATES_ORDER
narrative_slot: mechanism
en: >-
  This order, and not score order. Someone with no route to work there is polishing a CV for a job they cannot
  legally take.
th: >-
  ต้องเรียงตามลำดับนี้ ไม่ใช่ตามคะแนน เพราะคนที่ยังไม่มีช่องทางไปทำงานที่นั่นอย่างถูกกฎหมาย ต่อให้ปรับ CV
  ดีแค่ไหน ก็ยังสมัครงานที่ตัวเองไม่มีสิทธิรับอยู่ดี
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: Paul's wording, 06/09/2026.
review:
  structural_calque: pass
  text_hash: 4701be230a927e3bc4b3c31235c7ad8b2645ca57b125bb88e086ed0451816ec0
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/method.ts::LIMIT_BODY[0]`

```yaml
id: src/lib/content/method.ts::LIMIT_BODY[0]
source: src/lib/content/method.ts
path: LIMIT_BODY[0]
render: Method page, LIMIT_BODY[0]
narrative_slot: mechanism
en: >-
  It measures what a form can reach. A bar you have not cleared is a sequence, not a refusal, and the method
  never scores something it cannot see.
th: >-
  วิธีนี้วัดได้เฉพาะสิ่งที่แบบสอบถามเข้าถึง เกณฑ์ที่คุณยังไม่ผ่านบอกเพียงลำดับว่าควรทำอะไรก่อน
  ไม่ใช่คำตัดสินว่าคุณไปต่อไม่ได้ และวิธีนี้จะไม่ให้คะแนนสิ่งที่มองไม่เห็น
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: Paul's wording, 06/09/2026.
review:
  structural_calque: pass
  text_hash: b19b50736e414f8df9705e0b9a9c2ed210e05578c4383c5434d299c9742d0c1a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/method.ts::LIMIT_BODY[1]`

```yaml
id: src/lib/content/method.ts::LIMIT_BODY[1]
source: src/lib/content/method.ts
path: LIMIT_BODY[1]
render: Method page, LIMIT_BODY[1]
narrative_slot: mechanism
en: >-
  The method names a fifth gate, whether you can afford to get there and land. The check does not score it,
  because nothing it asks you can measure that honestly.
th: >-
  วิธีนี้มีด่านที่ห้า คือคุณมีเงินพอสำหรับการเดินทางและตั้งหลักที่นั่นหรือไม่
  แต่แบบประเมินนี้ไม่ให้คะแนนด่านดังกล่าว เพราะไม่มีคำถามใดที่สามารถวัดเรื่องนี้ได้อย่างตรงไปตรงมา
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: Paul's wording, 06/09/2026.
review:
  structural_calque: pass
  text_hash: 1d940eb22def08be7a560e9065546ce1323b48435745407b5927082e1617ff1b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/method.ts::LIMIT_HEADING`

```yaml
id: src/lib/content/method.ts::LIMIT_HEADING
source: src/lib/content/method.ts
path: LIMIT_HEADING
render: Method page, LIMIT_HEADING
narrative_slot: utility
en: What it does not do
th: สิ่งที่วิธีนี้ไม่ได้ทำ
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: 5e91df1f4870c48e20125e6dda09134ae37b7265ce15997f7fdaa635c2b26b86
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/method.ts::METHOD_CLOSE`

```yaml
id: src/lib/content/method.ts::METHOD_CLOSE
source: src/lib/content/method.ts
path: METHOD_CLOSE
render: Method page, METHOD_CLOSE
narrative_slot: mechanism
en: That is the whole method. See where you stand against it.
th: ทั้งหมดนี้คือวิธีที่เราใช้ ลองดูว่าตอนนี้คุณอยู่ตรงไหนเมื่อวัดด้วยวิธีนี้
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: 1349af54187f36868ef113cb1fdb743baac3f8fad0ebcfb8139e44b0f212d33a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/method.ts::METHOD_HEADING`

```yaml
id: src/lib/content/method.ts::METHOD_HEADING
source: src/lib/content/method.ts
path: METHOD_HEADING
render: Method page, METHOD_HEADING
narrative_slot: utility
en: The method behind the score
th: วิธีประเมินที่อยู่เบื้องหลังคะแนน
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: b28beda07956e2a876620cb22df02266963b77b79356e7a57276650a8015bab7
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/method.ts::METHOD_INTRO`

```yaml
id: src/lib/content/method.ts::METHOD_INTRO
source: src/lib/content/method.ts
path: METHOD_INTRO
render: Method page, METHOD_INTRO
narrative_slot: mechanism
en: >-
  Every number this site gives you comes from the same method. It is written down here so you can judge it
  before you decide how much to trust it.
th: >-
  ตัวเลขทุกตัวที่คุณเห็นบนเว็บนี้มาจากวิธีเดียวกัน เราเขียนวิธีนี้ไว้ให้อ่านก่อน
  คุณจะได้ตัดสินใจเองว่าจะเชื่อมากแค่ไหน
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: aed099526ddac1c45ad9ad64d0a3fbd347004b442f91d8c52f05f8f463025bcd
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/method.ts::METHOD_PROOF`

```yaml
id: src/lib/content/method.ts::METHOD_PROOF
source: src/lib/content/method.ts
path: METHOD_PROOF
render: Method page, METHOD_PROOF
narrative_slot: mechanism
en: The method is published, gate by gate
th: เปิดวิธีประเมินให้ดูครบทุกด่าน
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: e84c09ba7c1a9ccd3063ef6b7b8a63f5d16f6b2ca2cd102b34779f8148c6b2f5
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/method.ts::THRESHOLD_BODY[0]`

```yaml
id: src/lib/content/method.ts::THRESHOLD_BODY[0]
source: src/lib/content/method.ts
path: THRESHOLD_BODY[0]
render: Method page, THRESHOLD_BODY[0]
narrative_slot: mechanism
en: >-
  A score tells you where you stand. A threshold tells you whether you are ready, and only the second one is
  something you can act on.
th: >-
  คะแนนบอกว่าคุณอยู่ตรงไหน ส่วนเกณฑ์ผ่านบอกว่าคุณพร้อมหรือยัง
  และมีเพียงอย่างหลังเท่านั้นที่นำไปวางแผนลงมือต่อได้
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: Paul's wording, 06/09/2026.
review:
  structural_calque: pass
  text_hash: 8a12b99c1c8a4205ddbf2eece4eb71a397a7978d576e7fcfae403d849359644c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/method.ts::THRESHOLD_BODY[1]`

```yaml
id: src/lib/content/method.ts::THRESHOLD_BODY[1]
source: src/lib/content/method.ts
path: THRESHOLD_BODY[1]
render: Method page, THRESHOLD_BODY[1]
narrative_slot: mechanism
en: >-
  So the method sets a bar for each dimension, and you are ready when you clear every bar rather than when the
  average looks respectable. The dimensions do not trade against each other: being good at the job does not
  give you the right to work there.
th: >-
  วิธีนี้จึงตั้งเกณฑ์ไว้ในแต่ละด้าน คุณพร้อมเมื่อผ่านครบทุกด้าน ไม่ใช่เมื่อค่าเฉลี่ยดูดี
  เพราะแต่ละด้านทดแทนกันไม่ได้ ความเก่งในงานไม่ได้ทำให้คุณมีสิทธิ์ทำงานที่นั่น
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: 427716b729df2d4c6eadf08d1e0a48dcfb7a56263bbbd03bb2748380a5d0012b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/method.ts::THRESHOLD_HEADING`

```yaml
id: src/lib/content/method.ts::THRESHOLD_HEADING
source: src/lib/content/method.ts
path: THRESHOLD_HEADING
render: Method page, THRESHOLD_HEADING
narrative_slot: utility
en: Thresholds, not scores
th: เกณฑ์ผ่าน ไม่ใช่แค่คะแนน
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: 378fe7059cb053fcb82a893e2ac2b51fb218ace80c6f880c3f676ad47808121b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/method.ts::VERBS[0].body`

```yaml
id: src/lib/content/method.ts::VERBS[0].body
source: src/lib/content/method.ts
path: VERBS[0].body
render: Method page, VERBS[0].body
narrative_slot: mechanism
en: >-
  What you already have, so the market can read it. Same experience, made visible. This part is fast, and it
  is most of the gap.
th: >-
  จัดสิ่งที่คุณมีอยู่แล้วให้ตลาดงานมองเห็น ประสบการณ์ยังเหมือนเดิม เพียงแต่นำเสนอให้ชัดขึ้น ขั้นนี้ทำได้เร็ว
  และปัญหาส่วนใหญ่มักอยู่ตรงนี้
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: Paul's wording, 06/09/2026.
review:
  structural_calque: pass
  text_hash: 17d8353913b73c00b13e9e1d26cfa8456b0c174c3b4fbd22f831df3323f5cc39
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/method.ts::VERBS[0].name`

```yaml
id: src/lib/content/method.ts::VERBS[0].name
source: src/lib/content/method.ts
path: VERBS[0].name
render: Method page, VERBS[0].name
narrative_slot: mechanism
en: Reorganise
th: จัดระเบียบ
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: 16292e614a003622881ba8be91e7d369ac1391a7051edab83eba4d730a4721be
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/method.ts::VERBS[1].body`

```yaml
id: src/lib/content/method.ts::VERBS[1].body
source: src/lib/content/method.ts
path: VERBS[1].body
render: Method page, VERBS[1].body
narrative_slot: mechanism
en: >-
  What you genuinely do not have. Language before anything else. This part is slow, which is the reason to
  start it early rather than when it becomes the thing in the way.
th: >-
  เติมสิ่งที่คุณยังไม่มีจริง ๆ โดยเริ่มจากภาษาเป็นอันดับแรก ขั้นนี้ต้องใช้เวลา จึงควรเริ่มให้เร็ว
  แทนที่จะรอจนมันกลายเป็นอุปสรรค
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: Paul's wording, 06/09/2026.
review:
  structural_calque: pass
  text_hash: a8f73768df1d04a542a5deed72233e07f9e732e88d6827166611439ed569fa24
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/method.ts::VERBS[1].name`

```yaml
id: src/lib/content/method.ts::VERBS[1].name
source: src/lib/content/method.ts
path: VERBS[1].name
render: Method page, VERBS[1].name
narrative_slot: mechanism
en: Upskill
th: เติมทักษะที่ยังขาด
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: f1ed67f50461d78d6116855263f9980764510bf16974389af8c5df3282db7346
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/narrative-copy.ts::NARRATIVE_COPY.narrative.cta.body`

```yaml
id: src/lib/content/narrative-copy.ts::NARRATIVE_COPY.narrative.cta.body
source: src/lib/content/narrative-copy.ts
path: NARRATIVE_COPY.narrative.cta.body
render: Result summary, under the heading. Sells measurement, never a verdict
narrative_slot: ask
en: >-
  A 30-minute consultation with PunProfile goes through your answers in detail and turns this into a plan you
  can act on.
th: >-
  มาคุยกัน 30 นาทีกับ PunProfile เราจะช่วยดูคำตอบของคุณให้ละเอียดขึ้น
  แล้วสรุปออกมาเป็นแผนที่บอกชัดว่าควรทำอะไรต่อ
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: d98cab5d9bdd6f27bf020c92011054d77329c4c60e9e57ab40fb231be7d2a1d1
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/narrative-copy.ts::NARRATIVE_COPY.narrative.cta.button`

```yaml
id: src/lib/content/narrative-copy.ts::NARRATIVE_COPY.narrative.cta.button
source: src/lib/content/narrative-copy.ts
path: NARRATIVE_COPY.narrative.cta.button
render: Result summary, the consultation button itself
narrative_slot: ask
en: Book a free 30-minute consultation
th: นัดปรึกษาฟรี 30 นาที
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: a3fe95a9a57ab32aed49c4a50f3936f20e4dcc56b241a2f93ca810113308061b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/narrative-copy.ts::NARRATIVE_COPY.narrative.cta.heading`

```yaml
id: src/lib/content/narrative-copy.ts::NARRATIVE_COPY.narrative.cta.heading
source: src/lib/content/narrative-copy.ts
path: NARRATIVE_COPY.narrative.cta.heading
render: Result summary, above the consultation button
narrative_slot: utility
en: Want to go through this properly?
th: อยากเข้าใจผลประเมินนี้ให้ชัดขึ้นไหม
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: ea9796065cb2a1406ecaef3759ab39ac78a3280e29c0500bfd397085723b24c1
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/narrative-copy.ts::NARRATIVE_COPY.narrative.next.lead`

```yaml
id: src/lib/content/narrative-copy.ts::NARRATIVE_COPY.narrative.next.lead
source: src/lib/content/narrative-copy.ts
path: NARRATIVE_COPY.narrative.next.lead
render: Result summary, before the single next action
narrative_slot: utility
en: 'If you change one thing first, make it this:'
th: 'ถ้าจะเลือกทำก่อนสักเรื่อง เราแนะนำเรื่องนี้:'
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 3ae2259a1e0e1db39709752ac1ab8f09798c7c52d1b2686874066b3e1056e182
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/narrative-copy.ts::NARRATIVE_COPY.narrative.opener.family`

```yaml
id: src/lib/content/narrative-copy.ts::NARRATIVE_COPY.narrative.opener.family
source: src/lib/content/narrative-copy.ts
path: NARRATIVE_COPY.narrative.opener.family
render: Result summary, opening line when the route is family or partner
narrative_slot: utility
en: >-
  You're moving through a family or partner route. Your right to work is likely the settled part, so the work
  goes into the profile itself.
th: >-
  คุณวางแผนย้ายไปยุโรปกับครอบครัวหรือคู่ครอง เส้นทางด้านสิทธิ์การทำงานจึงน่าจะชัดเจนขึ้น
  จากนี้ควรหันมาเตรียมโปรไฟล์ให้พร้อมสำหรับตลาดงาน
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 61ee031f2eeba5707dc72b0ffe9ee46bb3d398ec09631b0397b4341d90c4ed83
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/narrative-copy.ts::NARRATIVE_COPY.narrative.opener.job_first`

```yaml
id: src/lib/content/narrative-copy.ts::NARRATIVE_COPY.narrative.opener.job_first
source: src/lib/content/narrative-copy.ts
path: NARRATIVE_COPY.narrative.opener.job_first
render: Result summary, opening line when the route is find-a-job-first
narrative_slot: utility
en: >-
  You're aiming to land the job first, then move. That's the route with the most moving parts, and the one
  where being specific pays off fastest.
th: >-
  คุณตั้งใจหางานให้ได้ก่อนแล้วค่อยย้าย เส้นทางนี้มีหลายเรื่องให้จัดการ แต่ไม่ต้องทำทุกอย่างพร้อมกัน
  ยิ่งรู้ชัดว่าอยากไปประเทศไหนและทำงานอะไร ก็ยิ่งวางแผนขั้นต่อไปได้ง่ายขึ้น
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 5ba9d51ef744e7692fd6d45801790776bf231873eaf7954c49b10dc9f8ebe229
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/narrative-copy.ts::NARRATIVE_COPY.narrative.opener.not_sure`

```yaml
id: src/lib/content/narrative-copy.ts::NARRATIVE_COPY.narrative.opener.not_sure
source: src/lib/content/narrative-copy.ts
path: NARRATIVE_COPY.narrative.opener.not_sure
render: Result summary, opening line when the route is not chosen yet. Must not read as a worse answer
narrative_slot: utility
en: >-
  You're still weighing up how you'd get to Europe. That's a reasonable place to be, and this read is meant to
  help you choose rather than assume you already have.
th: >-
  คุณยังไม่แน่ใจว่าจะไปยุโรปด้วยเส้นทางไหน ไม่เป็นไรเลย ผลประเมินนี้มีไว้ช่วยให้คุณเห็นทางเลือกชัดขึ้น
  ไม่ได้คาดหวังว่าต้องมีคำตอบตั้งแต่วันนี้
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 929148fe96ec684fb08a83e76f57d9616ba4eea6a366e165a8f178a619aaa061
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/narrative-copy.ts::NARRATIVE_COPY.narrative.opener.study_first`

```yaml
id: src/lib/content/narrative-copy.ts::NARRATIVE_COPY.narrative.opener.study_first
source: src/lib/content/narrative-copy.ts
path: NARRATIVE_COPY.narrative.opener.study_first
render: Result summary, opening line when the route is study-first
narrative_slot: utility
en: >-
  You're planning to study first, then work. That buys you time in-country, and it changes which parts of this
  matter most right now.
th: >-
  คุณวางแผนไปเรียนก่อนแล้วค่อยเริ่มทำงาน เส้นทางนี้ทำให้คุณมีเวลาอยู่ในประเทศเป้าหมายมากขึ้น
  และอาจเปิดโอกาสให้ได้ฝึกงาน สิ่งที่ควรเตรียมตอนนี้จึงต่างจากคนที่กำลังสมัครงานจากไทย
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: f7041fd2bfcb092a31c2af9fac867716d1d797353bd202cdfcf0d783846967a2
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/narrative-copy.ts::NARRATIVE_COPY.narrative.standing.advantage`

```yaml
id: src/lib/content/narrative-copy.ts::NARRATIVE_COPY.narrative.standing.advantage
source: src/lib/content/narrative-copy.ts
path: NARRATIVE_COPY.narrative.standing.advantage
render: Result summary, when the overall picture is a real advantage
narrative_slot: proof
en: On what you've told us, you're further along than most people at this stage.
th: จากคำตอบของคุณ ตอนนี้ถือว่าพร้อมกว่าคนส่วนใหญ่ที่อยู่ในจุดเดียวกัน
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 8a15a21b84e6d408184c55396be38e9d958025dab1c60eeb3740b27a23f592b6
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/narrative-copy.ts::NARRATIVE_COPY.narrative.standing.developing`

```yaml
id: src/lib/content/narrative-copy.ts::NARRATIVE_COPY.narrative.standing.developing
source: src/lib/content/narrative-copy.ts
path: NARRATIVE_COPY.narrative.standing.developing
render: Result summary, when the overall picture is still developing
narrative_slot: proof
en: >-
  On what you've told us, there's groundwork still to do. That's normal this early, and it's all work you can
  actually do.
th: ยังมีบางเรื่องที่ควรเตรียมเพิ่ม ซึ่งเป็นเรื่องปกติมากในช่วงเริ่มต้น ค่อย ๆ ทำทีละเรื่องได้
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: ec4f54c3c9260f27ef14a1c7b4e4fc0a1c28fe0471fe33dabebb3b986565260b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/narrative-copy.ts::NARRATIVE_COPY.narrative.standing.earliest`

```yaml
id: src/lib/content/narrative-copy.ts::NARRATIVE_COPY.narrative.standing.earliest
source: src/lib/content/narrative-copy.ts
path: NARRATIVE_COPY.narrative.standing.earliest
render: Result summary, when the candidate is at the very beginning
narrative_slot: proof
en: You're at the start of this. Nothing here is a verdict, and every part of it moves with work.
th: ตอนนี้คุณเพิ่งเริ่มต้น ผลนี้จึงเป็นเพียงภาพคร่าว ๆ ว่าควรพัฒนาตรงไหนต่อ ไม่ใช่คำตัดสินว่าคุณไปได้ไกลแค่ไหน
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: d05ce76c9ed8636105fdccece392f91d99170c2eba3e0206febe49dc5370f557
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/narrative-copy.ts::NARRATIVE_COPY.narrative.standing.strong`

```yaml
id: src/lib/content/narrative-copy.ts::NARRATIVE_COPY.narrative.standing.strong
source: src/lib/content/narrative-copy.ts
path: NARRATIVE_COPY.narrative.standing.strong
render: Result summary, when the overall picture is strong
narrative_slot: proof
en: On what you've told us, you've got real foundations in place.
th: จากคำตอบของคุณ พื้นฐานตอนนี้ถือว่าดีทีเดียว
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 1d5e07ee0c33db906b0b15adf4db4c8a7374c32f64d5eb4a3023b184078ff0a6
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/narrative-copy.ts::NARRATIVE_COPY.narrative.standing.typical`

```yaml
id: src/lib/content/narrative-copy.ts::NARRATIVE_COPY.narrative.standing.typical
source: src/lib/content/narrative-copy.ts
path: NARRATIVE_COPY.narrative.standing.typical
render: Result summary, when the overall picture is mid-range
narrative_slot: proof
en: On what you've told us, you're about where most people are at this stage.
th: ความพร้อมของคุณตอนนี้ใกล้เคียงกับคนส่วนใหญ่ที่อยู่ในจุดเดียวกัน
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: bc6e9d695da4e5c8dd86d9af4ca546d5fe23f0565ee172f5c86ebae7e9dd6051
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/narrative-copy.ts::NARRATIVE_COPY.narrative.strength.lead`

```yaml
id: src/lib/content/narrative-copy.ts::NARRATIVE_COPY.narrative.strength.lead
source: src/lib/content/narrative-copy.ts
path: NARRATIVE_COPY.narrative.strength.lead
render: Result summary, before the strongest area. {area} is substituted
narrative_slot: utility
en: Your strongest area right now is {area}.
th: ตอนนี้จุดแข็งที่เห็นชัดที่สุดของคุณคือ {area}
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 980f4ee25c19a9237e65ede4c792a6f7e27c9fe48442e95b78d0e705e94a46e2
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/narrative-copy.ts::NARRATIVE_COPY.narrative.unmeasured`

```yaml
id: src/lib/content/narrative-copy.ts::NARRATIVE_COPY.narrative.unmeasured
source: src/lib/content/narrative-copy.ts
path: NARRATIVE_COPY.narrative.unmeasured
render: Result summary, when parts could not be scored. {count} is substituted
narrative_slot: utility
en: >-
  {count} things this measures need a conversation rather than a form, so they're left blank rather than
  guessed at.
th: >-
  ยังมีอีก {count} เรื่องที่ต้องคุยกันเพิ่มเติมถึงจะประเมินได้ เราเลยเว้นส่วนนั้นไว้ก่อน
  แทนที่จะเดาคำตอบให้คุณ
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 4d5a466df806a861d0f453c6f5492b0b2d023f32e9684ee8d6ba4564f865394e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.image.alt`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.image.alt
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.image.alt
render: 'Blog article: Start in Europe, START_IN_EUROPE.image.alt'
narrative_slot: utility
en: >-
  A clay figure placing a pin on a map of Europe, at a desk laid out with a notebook, a profile sheet under a
  magnifier, and a tray of envelopes
th: ตัวการ์ตูนดินปั้นกำลังปักหมุดลงบนแผนที่ยุโรป บนโต๊ะมีสมุด เอกสารโปรไฟล์พร้อมแว่นขยาย และถาดใส่ซองจดหมาย
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: ab57afdb5cf22b3637571ecf253ba0384852a22024debd3e56c2a595506ee7f2
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.question`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.question
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.question
render: 'Blog article: Start in Europe, START_IN_EUROPE.question'
narrative_slot: symptom
en: >-
  Right now, which is the one you still cannot answer: the country, the route, the profile, the language, or
  the money?
th: ตอนนี้เรื่องที่คุณยังตอบไม่ได้คือประเทศ เส้นทางการย้าย โปรไฟล์ ภาษา หรือเงิน?
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 9c4ab48177f1c772906dc30a457dc6d40ec8dbbd3cf7ba7ea4459612dbdc7cc9
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[0].body[0].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[0].body[0].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[0].body[0].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[0].body[0].text'
narrative_slot: utility
en: >-
  Moving to Europe for work can look like one large decision. It is really several, and they have to be taken
  in the right order.
th: >-
  การย้ายไปทำงานในยุโรปอาจดูเหมือนการตัดสินใจครั้งใหญ่เพียงครั้งเดียว แต่จริง ๆ
  แล้วประกอบด้วยการตัดสินใจหลายเรื่องที่ต้องเรียงให้ถูกลำดับ
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 24075c4cf0bc51a6ed3b804640c456b3ce7a8f71bd75ac412dadfa6fb45387cc
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[0].body[1].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[0].body[1].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[0].body[1].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[0].body[1].text'
narrative_slot: utility
en: >-
  The country decides what the market wants. The route decides which companies are able to hire you. Your
  profile decides whether an employer sees your value at all. And the application is the instrument that tests
  how right the first three were.
th: >-
  ประเทศกำหนดว่าตลาดต้องการอะไร เส้นทางการย้ายกำหนดว่าบริษัทแบบไหนจ้างคุณได้
  โปรไฟล์กำหนดว่านายจ้างจะมองเห็นคุณค่าของคุณหรือไม่ และใบสมัครคือเครื่องมือทดสอบว่าสามเรื่องแรกถูกต้องแค่ไหน
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 89832211f7a8dc935578a12ebf3e217b6be8f0831787beee2253ea7d5bd9a6c8
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[0].body[2].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[0].body[2].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[0].body[2].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[0].body[2].text'
narrative_slot: utility
en: Most people start with the last one.
th: คนส่วนใหญ่กลับเริ่มจากเรื่องสุดท้าย
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: e67ccc250880b7c97df7d01dfc2133c8e464e35ce4cbde15f99e6107f464a21a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[0].body[3].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[0].body[3].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[0].body[3].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[0].body[3].text'
narrative_slot: utility
en: >-
  They translate the CV into English, adjust LinkedIn, and apply to every role they can read. It all feels
  like progress. Motion is not always strategy.
th: >-
  พวกเขาแปลเรซูเม่เป็นภาษาอังกฤษ ปรับ LinkedIn แล้วส่งใบสมัครไปยังทุกตำแหน่งที่อ่านออก
  สิ่งเหล่านี้ทำให้รู้สึกว่ากำลังคืบหน้า แต่ความเคลื่อนไหวไม่ใช่กลยุทธ์เสมอไป
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: ec449d412bd06dd69d2baf28c2e5c04b0c5010935e4553653f457234c70e837f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[0].body[4].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[0].body[4].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[0].body[4].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[0].body[4].text'
narrative_slot: utility
en: Put simply, an opportunity in a job market abroad needs three things at once.
th: มองแบบง่าย ๆ โอกาสในตลาดงานข้ามประเทศเกิดจากสามอย่างประกอบกัน
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c87caa6905715d8c89514649d98dcf79e0af4856f46aea008bfaf1c207e27302
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[0].body[5].items[0]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[0].body[5].items[0]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[0].body[5].items[0]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[0].body[5].items[0]'
narrative_slot: utility
en: That market wants what you do
th: ตลาดนั้นต้องการสิ่งที่คุณทำ
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 0dcff6dd1f066ab7577bd4d65bf3e9564e379151f3888cbf62ffc892ec72b051
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[0].body[5].items[1]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[0].body[5].items[1]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[0].body[5].items[1]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[0].body[5].items[1]'
narrative_slot: utility
en: An employer can see the value of the experience you have
th: นายจ้างมองเห็นคุณค่าของประสบการณ์ที่คุณมี
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 421331806ab7e44129cd38016da0a5cd0692cd73d61d222045a09652abfe5965
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[0].body[5].items[2]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[0].body[5].items[2]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[0].body[5].items[2]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[0].body[5].items[2]'
narrative_slot: utility
en: The company is actually able to hire you and move you there
th: บริษัทสามารถจ้างและพาคุณย้ายประเทศได้จริง
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 1c0dca96bca567f21bde646c44a7f8a70beaaaf3d6e696d726236851831c190c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[0].body[6].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[0].body[6].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[0].body[6].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[0].body[6].text'
narrative_slot: utility
en: If any one of them is zero, sending more applications does not make up for it.
th: หากข้อใดข้อหนึ่งเป็นศูนย์ การส่งใบสมัครเพิ่มก็ชดเชยไม่ได้
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: a43c6e950e50b9fea6374cfd01195c64f9be3969239c18e688706788badd495b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[0].body[7].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[0].body[7].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[0].body[7].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[0].body[7].text'
narrative_slot: utility
en: >-
  So the first month is not for accumulating applications. It is for reducing the uncertainty far enough that
  every application after it has a reason behind it.
th: >-
  เดือนแรกจึงไม่ได้มีไว้สะสมจำนวนใบสมัคร
  แต่มีไว้ลดความไม่แน่นอนให้เหลือน้อยพอที่ใบสมัครทุกฉบับหลังจากนั้นจะมีเหตุผลรองรับ
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 762b191b3c460efec4128780b2f7770c82a48cb216f111b7e1cd21d78fd53f8f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[0].heading`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[0].heading
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[0].heading
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[0].heading'
narrative_slot: utility
en: In short
th: สรุปสั้น ๆ
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 374fe2a22b8ee3e8e5258f04555c18cc495f7e98cd81f38c658fcd36b432e16b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[1].body[0].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[1].body[0].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[1].body[0].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[1].body[0].text'
narrative_slot: misread
en: 'People who start thinking about working in Europe tend to ask the same question: where should I start?'
th: คนที่เริ่มคิดเรื่องไปทำงานในยุโรปมักถามเหมือนกันว่า “ควรเริ่มจากตรงไหน”
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 7426c5a51f33e35a7c79628363417c8314e03dc85a94790f83f19662efd8080b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[1].body[1].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[1].body[1].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[1].body[1].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[1].body[1].text'
narrative_slot: misread
en: When the answer does not come, that question slowly turns into questions about yourself.
th: เมื่อยังหาคำตอบไม่ได้ คำถามนั้นจะค่อย ๆ เปลี่ยนเป็นคำถามเกี่ยวกับตัวเอง
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: ace4be6b732c6e55976db206e0b2599e95f38909f6dae44b82ccbb2bde733273
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[1].body[2].items[0]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[1].body[2].items[0]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[1].body[2].items[0]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[1].body[2].items[0]'
narrative_slot: misread
en: Does experience from Thailand carry enough weight?
th: ประสบการณ์จากไทยมีน้ำหนักพอไหม
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 1b614d9a612126701eccdda219a9ba09a38e0b1aed4ff917e25003c16553df62
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[1].body[2].items[1]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[1].body[2].items[1]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[1].body[2].items[1]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[1].body[2].items[1]'
narrative_slot: misread
en: Am I still in time at this age?
th: อายุเท่านี้ยังทันหรือเปล่า
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 4d5353f46364362ae656d9ebe64cb9c9773a5d06ffef42fdfc55785327e8e25f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[1].body[2].items[2]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[1].body[2].items[2]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[1].body[2].items[2]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[1].body[2].items[2]'
narrative_slot: misread
en: Is my language not good enough?
th: ภาษายังไม่ดีพอใช่ไหม
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 6ba46c796db3f7790930ee071131b960943f19be0e151b986e80517808f98077
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[1].body[2].items[3]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[1].body[2].items[3]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[1].body[2].items[3]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[1].body[2].items[3]'
narrative_slot: misread
en: Why can other people go, when I still do not know how to begin?
th: ทำไมคนอื่นไปได้ แต่เรายังไม่รู้จะเริ่มอย่างไร
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: cf26ec9b28fb755fb331d3138e00f6994fe42eec812540fe57bfc87e0ef37e88
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[1].body[3].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[1].body[3].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[1].body[3].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[1].body[3].text'
narrative_slot: misread
en: >-
  These questions come to everyone, but going round on them does not make the answer any clearer, because what
  is missing is not all inside you. Part of it is in the rules of a market you have never had to use before.
th: >-
  คำถามเหล่านี้เกิดขึ้นได้กับทุกคน แต่การคิดวนต่อไปจะไม่ทำให้คำตอบชัดขึ้น
  เพราะสิ่งที่ยังขาดไม่ได้อยู่ในตัวคุณทั้งหมด ส่วนหนึ่งอยู่ในกติกาของตลาดที่คุณยังไม่เคยต้องใช้
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 54ae03a29bc5d0ff4a33ec08c83d382d9cd1f1ed1beab5d38c1e7db81c828e73
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[1].body[4].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[1].body[4].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[1].body[4].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[1].body[4].text'
narrative_slot: misread
en: >-
  The European job market has several layers of rules that Thailand does not: the right to work, recognition
  of qualifications, the language level each country expects, and the way an employer reads a CV from another
  country.
th: >-
  ตลาดงานยุโรปมีกติกาต่างจากไทยหลายชั้น ทั้งสิทธิในการทำงาน การรับรองคุณวุฒิ ระดับภาษาที่แต่ละประเทศต้องการ
  และวิธีที่นายจ้างตีความเรซูเม่จากอีกประเทศ
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: cc6427637b5a647ff8a514ebb90d74f25b46da7571189cbd5a3bd4987102a157
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[1].body[5].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[1].body[5].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[1].body[5].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[1].body[5].text'
narrative_slot: misread
en: Not knowing those rules does not mean you are not good enough.
th: การไม่รู้กติกาเหล่านี้ไม่ได้แปลว่าคุณเก่งไม่พอ
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: f2eb22584109b6eea22f8eadbf3b79191a8eb8e5dd7a0978e5ac00266f676f03
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[1].body[6].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[1].body[6].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[1].body[6].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[1].body[6].text'
narrative_slot: misread
en: >-
  The first month is for learning the rules and setting out assumptions you can test, not for rushing to apply
  and then letting silence from the market pass judgement on your worth.
th: >-
  เดือนแรกมีไว้เรียนรู้กติกาและวางสมมติฐานที่ตรวจสอบได้
  ไม่ใช่รีบกดสมัครแล้วใช้ความเงียบจากตลาดมาตัดสินคุณค่าของตัวเอง
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: ed6cbd6acf97923f5fb7129283860b2d811bc3bb3ea4b19f8dc374935c9f77e7
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[1].heading`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[1].heading
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[1].heading
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[1].heading'
narrative_slot: misread
en: The problem is not that you have not tried hard enough
th: ปัญหาไม่ใช่คุณยังพยายามไม่มากพอ
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: af6e48c6983709f30b3db84494e740cef621854a60cd69603e575f14be55e601
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[10].body[0].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[10].body[0].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[10].body[0].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[10].body[0].text'
narrative_slot: mechanism
en: >-
  The four steps above have an order. Two other things should not wait for them to finish: language, and the
  life you will have after the move.
th: >-
  สี่ขั้นตอนข้างต้นมีลำดับ แต่ยังมีอีกสองเรื่องที่ไม่ควรรอให้ขั้นตอนเหล่านั้นเสร็จ นั่นคือภาษา
  และชีวิตหลังย้าย
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 3f42dc4214f14d8de13575599c076a1e1612b46552d99c6a6486c498aefdaefe
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[10].heading`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[10].heading
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[10].heading
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[10].heading'
narrative_slot: mechanism
en: Two things that have to start on day one alongside everything else
th: สองเรื่องที่ต้องเริ่มพร้อมกันตั้งแต่วันแรก
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 76a8a02f2de829866aec0e83fae6ba0287be748024a20885bc862fe174eb4711
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[11].body[0].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[11].body[0].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[11].body[0].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[11].body[0].text'
narrative_slot: mechanism
en: >-
  Everything up to this point is organising what you already have, so it is measured in weeks. Language has to
  be built up gradually, and it is measured in months or years.
th: >-
  สิ่งที่พูดมาทั้งหมดก่อนหน้านี้คือการจัดระบบสิ่งที่คุณมีอยู่แล้ว จึงใช้เวลาเป็นสัปดาห์
  แต่ภาษาเป็นเรื่องที่ต้องค่อย ๆ สร้างเพิ่ม และต้องใช้เวลาเป็นเดือนหรือเป็นปี
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 6b240d824d06619054e44ebce9a14a877a08487ef43d54532b6c15d44c775861
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[11].body[1].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[11].body[1].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[11].body[1].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[11].body[1].text'
narrative_slot: mechanism
en: Because it is the slowest, it has to start first.
th: เพราะช้าที่สุด จึงต้องเริ่มก่อน
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: a137bcb0d35032ec3861ab390f5efc8694893654204a4f15f59836a502b5972e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[11].body[2].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[11].body[2].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[11].body[2].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[11].body[2].text'
narrative_slot: mechanism
en: >-
  Do not wait until language becomes the reason a job has to be turned down. The order that works for most
  people is English to a level you can work in first, then the local language if the target market needs it.
th: >-
  อย่ารอจนภาษากลายเป็นเหตุผลที่ต้องปฏิเสธงาน ลำดับที่ใช้ได้จริงสำหรับหลายคนคือ
  พัฒนาภาษาอังกฤษให้ถึงระดับที่ใช้ทำงานได้ก่อน แล้วจึงเพิ่มภาษาท้องถิ่นหากตลาดเป้าหมายต้องการ
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 7039c18105d554b00e11d5c9597247e2b644c82e07ca8c340b54b24f214bef30
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[11].body[3].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[11].body[3].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[11].body[3].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[11].body[3].text'
narrative_slot: mechanism
en: >-
  The 20 job adverts you collected will tell you better than any general opinion which language that field and
  country need, at what level, and how often.
th: >-
  ประกาศงาน 20 ตำแหน่งที่คุณเก็บไว้จะบอกได้ดีกว่าความเห็นทั่วไปว่า ในสายงานและประเทศนั้นต้องใช้ภาษาใด ระดับไหน
  และบ่อยเพียงใด
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 7bf7f67d65656b5b589a9aee974960c9d5bb03970717b661a3e86c3ecc1680bf
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[11].body[4].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[11].body[4].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[11].body[4].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[11].body[4].text'
narrative_slot: mechanism
en: >-
  Language does not only matter at the interview. It sets how many roles you can reach, how widely you can
  change direction later, and how quickly you find your feet in daily life after the move.
th: >-
  ภาษาไม่ได้มีผลเฉพาะตอนสัมภาษณ์ แต่กำหนดว่าคุณจะเข้าถึงงานได้กี่ตำแหน่ง เปลี่ยนสายงานในอนาคตได้กว้างเพียงใด
  และตั้งหลักในชีวิตประจำวันได้เร็วแค่ไหนหลังย้าย
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 2a487c6c888159c87a18d06dbeed939f109795fef6901c3fbbe09e9322c095c1
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[11].body[5].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[11].body[5].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[11].body[5].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[11].body[5].text'
narrative_slot: mechanism
en: Language is not an accessory to moving country. It is part of the structure of the life you are building.
th: ภาษาไม่ใช่อุปกรณ์เสริมของการย้ายประเทศ แต่เป็นส่วนหนึ่งของโครงสร้างชีวิตที่คุณกำลังสร้าง
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 81f3bf1a7abce6b6dd25440d2b251ef55821c7757a8bb318a0f42f567b54a2d8
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[11].heading`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[11].heading
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[11].heading
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[11].heading'
narrative_slot: mechanism
en: Language is not the last hurdle, it is the foundation
th: ภาษาไม่ใช่ด่านสุดท้าย แต่เป็นโครงสร้างพื้นฐาน
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 727bb8c8b07692067f24a630e1d65ddb56c823f0d8768f09600b7f2658df646e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[12].body[0].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[12].body[0].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[12].body[0].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[12].body[0].text'
narrative_slot: limit
en: Do not wait until you have the job to think about how you will live.
th: อย่ารอให้ได้งานก่อนแล้วค่อยคิดว่าจะใช้ชีวิตอย่างไร
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: e5a8aba3e56c5a16b1667736ca723a51f316b40759b398ac09c19a381cc020d7
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[12].body[1].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[12].body[1].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[12].body[1].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[12].body[1].text'
narrative_slot: limit
en: >-
  Work out the transition costs, be clear with your family about the target country, and ask what each person
  needs in order to live securely.
th: >-
  ประเมินค่าใช้จ่ายในช่วงเปลี่ยนผ่าน คุยกับครอบครัวให้ชัดเรื่องประเทศเป้าหมาย
  และถามว่าแต่ละคนต้องการอะไรจึงจะใช้ชีวิตได้อย่างมั่นคง
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 7591da68a30c3c6dfba7fdc1d830af5527dffed0a69bbce78e875af2b1155683
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[12].body[2].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[12].body[2].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[12].body[2].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[12].body[2].text'
narrative_slot: limit
en: >-
  If the plan is for you to go alone first, agree how long that will be, how you will stay in touch, and when
  you will come back and review the plan together.
th: >-
  หากวางแผนย้ายไปก่อนเพียงคนเดียว ควรตกลงกันว่าจะเป็นเวลานานแค่ไหน จะติดต่อกันอย่างไร
  และจะกลับมาทบทวนแผนร่วมกันเมื่อใด
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: d35412d3ff571bfb0621158d7c1fabfdc00b8b0774188bc664e619b4b13fe87a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[12].body[3].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[12].body[3].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[12].body[3].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[12].body[3].text'
narrative_slot: limit
en: >-
  If you are moving with a partner or family, check your own right to work from the start, because in many
  countries the right to reside does not automatically carry the right to work. At the same time, plan how you
  will keep or build on your own career after the move.
th: >-
  หากย้ายตามคู่ครองหรือครอบครัว ให้ตรวจสอบสิทธิในการทำงานตั้งแต่ต้น เพราะในหลายประเทศ
  การมีสิทธิพำนักไม่ได้หมายความว่าจะมีสิทธิทำงานโดยอัตโนมัติ
  พร้อมกันนั้นก็ควรวางแผนว่าจะรักษาหรือต่อยอดเส้นทางอาชีพของตัวเองอย่างไรหลังย้าย
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 93a2192c816b615eef1c687ff839b7d3ad2fa438a6ad1db5b0fd40f7ffd0e8d3
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[12].body[4].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[12].body[4].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[12].body[4].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[12].body[4].text'
narrative_slot: limit
en: Savings do not guarantee you a job. They buy you the time not to accept the first option out of fear.
th: เงินเก็บไม่ได้รับประกันว่าคุณจะได้งาน แต่มันซื้อเวลาให้คุณไม่ต้องตอบรับทางเลือกแรกเพราะความกลัว
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 7fb09a36c4d7f7a56f1e4013d99760a1a26e6de2662033ec47099c38082babfe
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[12].body[5].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[12].body[5].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[12].body[5].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[12].body[5].text'
narrative_slot: limit
en: >-
  Someone who knows how many months their money covers after the move has room to choose. Someone who does not
  is usually forced to choose by urgency, and decisions made under urgency are almost never on target.
th: >-
  คนที่รู้ว่าเงินของตัวเองรองรับชีวิตหลังย้ายได้นานกี่เดือนมีพื้นที่ให้เลือก
  ส่วนคนที่ไม่รู้มักถูกความเร่งรีบบังคับให้เลือก และการตัดสินใจภายใต้ความเร่งรีบแทบไม่เคยตรงเป้า
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 8c6e5ef1ec091a6d13ea575265d9f42df8bbe2a8f6fcce5319de6cddb2fb1a9a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[12].heading`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[12].heading
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[12].heading
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[12].heading'
narrative_slot: limit
en: Family and money are not things to leave until later
th: ครอบครัวและเงินไม่ใช่เรื่องที่ควรเก็บไว้คิดทีหลัง
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 7160369afe037563de9b0b77c0ac7950464b8a180f7bf2b9a0338ef88931f68f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[0].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[0].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[13].body[0].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[13].body[0].text'
narrative_slot: mechanism
en: 'Week 1: choose the market and name the route'
th: 'สัปดาห์ที่ 1: เลือกตลาดและตั้งชื่อเส้นทาง'
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 8604a6183f7fdfbfeb32967579d47ca808a131f3c60d2d82bd193e75a5784f2c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[1].items[0]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[1].items[0]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[13].body[1].items[0]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[13].body[1].items[0]'
narrative_slot: mechanism
en: Choose one target country, or no more than three with a shared reason holding them together
th: เลือกประเทศเป้าหมายหนึ่งประเทศ หรือไม่เกินสามประเทศที่มีเหตุผลร่วมกัน
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: ee87953232d0d79db09c1579f0b661673734d39cf6609cc8f581aa2810dc8506
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[1].items[1]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[1].items[1]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[13].body[1].items[1]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[13].body[1].items[1]'
narrative_slot: mechanism
en: Check the visa routes on the official websites
th: ตรวจเส้นทางวีซ่าจากเว็บไซต์ทางการ
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: b9937a264fe4c054b46fb516702492f9b5b3b92a9538216aac8cd018fc162c05
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[1].items[2]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[1].items[2]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[13].body[1].items[2]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[13].body[1].items[2]'
narrative_slot: mechanism
en: Estimate the transition costs
th: ประเมินค่าใช้จ่ายช่วงเปลี่ยนผ่าน
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 71035111dedb5f43e6ceab042b68f8ad5b099c060cc29ab5ccfc8e018311f836
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[1].items[3]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[1].items[3]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[13].body[1].items[3]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[13].body[1].items[3]'
narrative_slot: mechanism
en: Write one paragraph on why this country suits what you have
th: เขียนให้ได้หนึ่งย่อหน้าว่า ทำไมประเทศนี้จึงเหมาะกับสิ่งที่คุณมี
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 212d0fd29a2baab891f50bf9d856a973f51cf3eb56aae964600516931a06fcc6
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[10].items[0]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[10].items[0]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[13].body[10].items[0]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[13].body[10].items[0]'
narrative_slot: mechanism
en: Draw up a list of about 20 target companies
th: ทำรายชื่อบริษัทเป้าหมายประมาณ 20 แห่ง
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 5069f7177b0684f36c3defcd9098f5aa5dffae60341f82ce450402ffddab0105
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[10].items[1]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[10].items[1]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[13].body[10].items[1]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[13].body[10].items[1]'
narrative_slot: mechanism
en: Talk to people in the market to test what you have understood
th: คุยกับคนในตลาดเพื่อทดสอบสิ่งที่เข้าใจ
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 3239926ce4aed73f427c9fd4994f5feb2cd054d195f58a4ff55d6d218c38c5f4
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[10].items[2]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[10].items[2]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[13].body[10].items[2]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[13].body[10].items[2]'
narrative_slot: mechanism
en: Pick three to five roles that genuinely fit
th: เลือกตำแหน่งที่ตรงจริงสามถึงห้าตำแหน่ง
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 75c7269764f707aa035010b9e44ca1c24c6b569dab2666ca49c8c682d82e1f9c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[10].items[3]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[10].items[3]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[13].body[10].items[3]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[13].body[10].items[3]'
narrative_slot: mechanism
en: Tailor the application to each of them before deciding to send
th: ปรับใบสมัครให้ตอบโจทย์แต่ละตำแหน่ง ก่อนตัดสินใจส่ง
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 13d988ade08c706c3c67b5aeaed772a1ea735b7b12487eee72eb365478eff028
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[11].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[11].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[13].body[11].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[13].body[11].text'
narrative_slot: mechanism
en: >-
  What you should end up with: an answer on whether to start applying, to work on the profile further, or to
  build skills first.
th: 'ผลลัพธ์ที่ควรได้: คำตอบว่าคุณควรเริ่มสมัคร ปรับโปรไฟล์เพิ่มเติม หรือพัฒนาทักษะก่อน'
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 96399684e45b833b9f919a07c9172a62c2ae43b328349549c80b3dc64d84cfbb
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[12].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[12].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[13].body[12].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[13].body[12].text'
narrative_slot: mechanism
en: >-
  If on day 30 you find you should not be applying yet, that is not a failure. It is finding the gap before
  the market points it out to you through silence.
th: >-
  หากวันที่ 30 คุณพบว่ายังไม่ควรสมัคร นั่นไม่ใช่ความล้มเหลว
  แต่คือการพบช่องว่างก่อนที่ตลาดจะเป็นคนชี้ให้เห็นผ่านความเงียบ
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 9260700e33648a22845f2ecd843fe6e20c9994919554d69723d6578d03ea39db
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[2].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[2].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[13].body[2].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[13].body[2].text'
narrative_slot: mechanism
en: 'What you should end up with: one target country, a route you can name, and an opening cost figure.'
th: 'ผลลัพธ์ที่ควรได้: ประเทศเป้าหมายหนึ่งแห่ง เส้นทางการย้ายที่เรียกชื่อได้ และตัวเลขค่าใช้จ่ายตั้งต้น'
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 176b8f662ff17af98c1d5104c29ca1c1a3b066be172d0d63fae1a67ffa886017
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[3].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[3].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[13].body[3].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[13].body[3].text'
narrative_slot: mechanism
en: 'Week 2: read the market before you write about yourself'
th: 'สัปดาห์ที่ 2: อ่านตลาดก่อนเขียนตัวเอง'
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: dd4802ff9d443b3594384a163a98070950fcf10ca9c5f5a0122c4f62ade1a53c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[4].items[0]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[4].items[0]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[13].body[4].items[0]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[13].body[4].items[0]'
narrative_slot: mechanism
en: Collect 20 real job adverts
th: เก็บประกาศงานจริง 20 ตำแหน่ง
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c8690a66ea07d8862286fbd4747ae792d08dad7de77c2ba46cad8d0176592ba6
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[4].items[1]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[4].items[1]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[13].body[4].items[1]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[13].body[4].items[1]'
narrative_slot: mechanism
en: Note the job titles, skills, tools, languages and conditions that recur
th: จดชื่อตำแหน่ง ทักษะ เครื่องมือ ภาษา และเงื่อนไขที่พบซ้ำ
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: d6efd02d340fc467467309ecbbb5ed1db4cd7f691c2c83272100ca2cbece9b4c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[4].items[2]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[4].items[2]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[13].body[4].items[2]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[13].body[4].items[2]'
narrative_slot: mechanism
en: Check which roles are open to candidates from abroad
th: ตรวจว่าตำแหน่งใดเปิดรับผู้สมัครจากต่างประเทศ
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: d93fb72db5c74d2620090b21a0ca5f7594810bc2a0bc37c87146e4bcd880fa52
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[4].items[3]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[4].items[3]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[13].body[4].items[3]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[13].body[4].items[3]'
narrative_slot: mechanism
en: Separate what you already have from what you still have to build
th: แยกสิ่งที่คุณมีอยู่แล้วออกจากสิ่งที่ต้องพัฒนาเพิ่ม
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: f1118362d3ef50b26685fd9438da847d321f03bd8ab48f7ad7b54a0b5359bf43
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[5].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[5].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[13].body[5].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[13].body[5].text'
narrative_slot: mechanism
en: >-
  What you should end up with: a picture of the candidate the market is looking for, rather than a feeling
  that you could probably apply.
th: 'ผลลัพธ์ที่ควรได้: ภาพของผู้สมัครที่ตลาดกำลังมองหา ไม่ใช่เพียงความรู้สึกว่าคุณน่าจะสมัครได้'
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 07f0f27c1b66bea725ee4ae03d4982f512228286fa76bbc5e2dd0e4f28c0c2ae
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[6].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[6].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[13].body[6].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[13].body[6].text'
narrative_slot: mechanism
en: 'Week 3: make the profile readable'
th: 'สัปดาห์ที่ 3: ทำให้โปรไฟล์อ่านออก'
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 8d2aaefb355b10b7b5e006857484830e3f44df9e897795030203a235f89fa302
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[7].items[0]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[7].items[0]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[13].body[7].items[0]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[13].body[7].items[0]'
narrative_slot: mechanism
en: Choose two or three target job titles
th: เลือกชื่อตำแหน่งเป้าหมายสองถึงสามแบบ
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 84be27bed52d5e04c693ab0893704323ab2b0fed88e3a8cf6d30d83d85a5d6db
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[7].items[1]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[7].items[1]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[13].body[7].items[1]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[13].body[7].items[1]'
narrative_slot: mechanism
en: Rewrite your experience as problem, role and result
th: เรียบเรียงประสบการณ์เป็นปัญหา บทบาท และผลลัพธ์
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 951c29dc107dc129703895ecb3f591c1df64c5a8618afd518bc096f77ef13736
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[7].items[2]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[7].items[2]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[13].body[7].items[2]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[13].body[7].items[2]'
narrative_slot: mechanism
en: Bring the CV and LinkedIn into one story
th: ปรับเรซูเม่และ LinkedIn ให้เล่าเรื่องเดียวกัน
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 959426827510681284d686241fbed7f2ac9c60a2886fe2ba9528cce5d2779dca
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[7].items[3]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[7].items[3]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[13].body[7].items[3]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[13].body[7].items[3]'
narrative_slot: mechanism
en: State your right to work, where you are, and when you could start
th: ระบุเรื่องสิทธิทำงาน สถานที่อยู่ และช่วงเวลาที่พร้อมเริ่มงานให้ชัด
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 6be02c8f99d530202f21d1514e2fa914ba0068ef85e6a17ae346c52f9ee07867
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[8].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[8].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[13].body[8].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[13].body[8].text'
narrative_slot: mechanism
en: >-
  What you should end up with: a starting profile the market can understand without knowing anything about the
  Thai context.
th: 'ผลลัพธ์ที่ควรได้: โปรไฟล์ตั้งต้นที่ตลาดเข้าใจได้โดยไม่ต้องรู้จักบริบทของไทยมาก่อน'
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 30be25cc2688e0f494deef8a8c7f84ae8c3e0424141a897d2e718dec9c75bb1d
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[9].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].body[9].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[13].body[9].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[13].body[9].text'
narrative_slot: mechanism
en: 'Week 4: test it, specifically'
th: 'สัปดาห์ที่ 4: ทดสอบอย่างเจาะจง'
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 8bb9867a534b4424c601bd2bbeb835f1fade5b2cb8bc8d18d9d55ee0f6bff354
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].heading`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[13].heading
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[13].heading
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[13].heading'
narrative_slot: mechanism
en: A plan for the first 30 days
th: แผน 30 วันแรก
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: f41ef531152d8f92a7649b0a19799c805980dda9823dd75add22a5d96eea9c5e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[14].body[0].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[14].body[0].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[14].body[0].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[14].body[0].text'
narrative_slot: proof
en: A job offer is the measure at the end. Uncertainty going down is the measure that the strategy is improving.
th: ข้อเสนองานเป็นตัวชี้วัดปลายทาง แต่ความไม่แน่นอนที่ลดลงคือตัวชี้วัดว่ากลยุทธ์กำลังดีขึ้น
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: a9187d20ce36e779d1194bc82579d10572458207a72930896382d02efab6e1ed
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[14].body[1].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[14].body[1].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[14].body[1].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[14].body[1].text'
narrative_slot: proof
en: >-
  Knowing which country suits what you have, which route you will move on, which jobs are worth applying for,
  and which skills still need filling in, is all progress.
th: >-
  การรู้ว่าประเทศไหนเหมาะกับสิ่งที่คุณมี จะย้ายไปด้วยเส้นทางใด งานแบบไหนควรสมัคร และยังต้องเติมทักษะด้านไหน
  ล้วนเป็นความคืบหน้า
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 721569535478d6494579594a7232a5f32f343fa37723ac6251c641801eb354da
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[14].body[2].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[14].body[2].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[14].body[2].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[14].body[2].text'
narrative_slot: proof
en: >-
  So the goal of the first month is not to send as many applications as possible. It is to build a plan that
  makes the next application carry more weight than one sent without knowing who it was going to.
th: >-
  เป้าหมายของเดือนแรกจึงไม่ใช่การส่งใบสมัครให้ได้มากที่สุด
  แต่คือการสร้างแผนที่ทำให้ใบสมัครฉบับต่อไปมีน้ำหนักกว่าฉบับที่ส่งไปโดยยังไม่รู้ว่ากำลังส่งให้ใคร
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 7153a0aa95bee115344cdbeadc7cfc7bd32c304d1219557ee99eb9e0cb46677d
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[14].body[3].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[14].body[3].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[14].body[3].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[14].body[3].text'
narrative_slot: proof
en: >-
  You are not starting from zero. You are starting from experience that has not yet been arranged so a new
  market can understand it.
th: คุณไม่ได้เริ่มจากศูนย์ คุณเริ่มจากประสบการณ์ที่ยังไม่ได้จัดวางให้ตลาดใหม่เข้าใจ
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 62a03e6f6873d41ab363085c11f8625e013dea7680ad6e1f67f3aea1562fb2e0
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[14].heading`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[14].heading
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[14].heading
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[14].heading'
narrative_slot: proof
en: You are not starting from zero
th: คุณไม่ได้เริ่มจากศูนย์
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: e9115ecd5c96fa63d86cfb1c1865050a4a441dd6cfc7e6694ee92164cf7693be
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[0].a[0]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[0].a[0]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[15].body[0].a[0]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[15].body[0].a[0]'
narrative_slot: utility
en: >-
  It depends on the country, the role and the company. Some markets use English as their main working
  language, others need the local language, and even roles in the same country can differ.
th: >-
  ขึ้นอยู่กับประเทศ ตำแหน่ง และบริษัท บางตลาดใช้ภาษาอังกฤษเป็นภาษาหลักในการทำงาน
  ขณะที่บางตลาดต้องใช้ภาษาท้องถิ่น แม้แต่ตำแหน่งในประเทศเดียวกันก็อาจมีข้อกำหนดต่างกัน
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 0da36553856e79e7f6fbcdb4fb162fddc1e079e3d121844ac2c463bd585cb868
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[0].a[1]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[0].a[1]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[15].body[0].a[1]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[15].body[0].a[1]'
narrative_slot: utility
en: >-
  A more accurate answer than asking in general terms is to read 20 real adverts in your target market and see
  which language level keeps appearing.
th: คำตอบที่แม่นกว่าการถามแบบกว้าง ๆ คือการอ่านประกาศจริง 20 ตำแหน่งในตลาดเป้าหมาย แล้วดูว่าระดับภาษาใดปรากฏซ้ำ
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 28e4a13bafe34a899ece7de0e03e6210af749ed71d40e63fd548022665a3736f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[0].q`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[0].q
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[15].body[0].q
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[15].body[0].q'
narrative_slot: utility
en: How good does my English have to be before I can apply?
th: ต้องเก่งภาษาอังกฤษระดับไหนถึงจะสมัครงานได้
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: fce39294b03570c3d6af6880343925f03ddbbc66d4eff3a74ea7facafbf85c51
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[1].a[0]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[1].a[0]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[15].body[1].a[0]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[15].body[1].a[0]'
narrative_slot: utility
en: >-
  Age alone cannot answer whether you can go. What matters more is how well your experience fits the market,
  what conditions the visa route has, what level your language is at, and how flexible your life is about
  moving.
th: >-
  อายุเพียงอย่างเดียวตอบไม่ได้ว่าคุณไปได้หรือไม่ สิ่งที่มีผลมากกว่าคือประสบการณ์ตรงกับตลาดแค่ไหน
  เส้นทางวีซ่ามีเงื่อนไขอย่างไร ภาษาอยู่ระดับใด และชีวิตของคุณยืดหยุ่นต่อการย้ายมากแค่ไหน
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 9e45208f788496e6f322475714f41bc013609407c0ed9388934c5f57ec094bf2
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[1].a[1]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[1].a[1]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[15].body[1].a[1]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[15].body[1].a[1]'
narrative_slot: utility
en: >-
  At this age experience and judgement can be a strength, though changing field may mean accepting a different
  level to start from. Rather than asking whether this age is too late, ask which roles can see the value of
  the experience you have already built.
th: >-
  ในวัยนี้ ประสบการณ์และวุฒิภาวะอาจเป็นจุดแข็ง แต่การเปลี่ยนสายงานอาจต้องยอมเริ่มจากระดับที่ต่างจากเดิม
  แทนที่จะถามว่าอายุเท่านี้สายเกินไปหรือไม่ ให้ถามว่าตำแหน่งใดมองเห็นคุณค่าของประสบการณ์ที่คุณสะสมมาแล้ว
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c65e00e704c4730d894db47adb48e9a98842ff733308b3f0d6cf3f18814444ef
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[1].q`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[1].q
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[15].body[1].q
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[15].body[1].q'
narrative_slot: utility
en: I am 35 or 40 already. Can I still go?
th: อายุ 35 หรือ 40 แล้ว ยังไปได้ไหม
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 78aa1d590d61aaa634865047267596fc0f3f3c1c51be26db654b85a9bceafa61
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[2].a[0]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[2].a[0]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[15].body[2].a[0]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[15].body[2].a[0]'
narrative_slot: utility
en: >-
  There is no single number that works for everyone, because the costs differ by country, by city and by the
  route you take.
th: ไม่มีตัวเลขเดียวที่ใช้ได้กับทุกคน เพราะค่าใช้จ่ายต่างกันตามประเทศ เมือง และเส้นทางการย้าย
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 701a960b905411ad15a063b0adf0b17ef3259ab10ccf3187e9a71ee7e8cd4f0b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[2].a[1]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[2].a[1]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[15].body[2].a[1]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[15].body[2].a[1]'
narrative_slot: utility
en: >-
  Make a list: travel, deposit and first month's rent, translating and certifying documents, insurance, living
  costs while you wait for the first salary, and tuition if you take the study route. Then find the real
  figures for your target country.
th: >-
  ทำรายการค่าเดินทาง ค่ามัดจำและค่าเช่าเดือนแรก ค่าแปลและรับรองเอกสาร ค่าประกัน
  ค่าใช้ชีวิตระหว่างรอเงินเดือนก้อนแรก และค่าเล่าเรียนหากเลือกเส้นทางเรียนต่อ
  จากนั้นหาตัวเลขจริงของประเทศเป้าหมาย
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 9a29b57fac01f732224eb89037708a67bc4011be1aa7aaf86ea7b32757d856cd
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[2].a[2]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[2].a[2]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[15].body[2].a[2]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[15].body[2].a[2]'
narrative_slot: utility
en: >-
  Do not look for a European average. Look for the number of months your money buys you to decide without
  rushing.
th: อย่าหาค่าเฉลี่ยของยุโรป ให้หาจำนวนเดือนที่เงินของคุณจะซื้อเวลาให้ตัดสินใจได้โดยไม่ต้องรีบ
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: ca59c82ba457e5fa93ba784a61f21761993dad71fb0d6ee4a4412508d3e8c3cd
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[2].q`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[2].q
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[15].body[2].q
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[15].body[2].q'
narrative_slot: utility
en: How much do I need saved?
th: ต้องมีเงินเก็บเท่าไร
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 79b8f39368c2a7f8fe40d65d8bdc91719daed0c3349e5b5a2e62fd0744fafacc
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[3].a[0]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[3].a[0]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[15].body[3].a[0]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[15].body[3].a[0]'
narrative_slot: utility
en: It depends on money, language, and how likely sponsorship is in your field.
th: ขึ้นอยู่กับเงิน ภาษา และโอกาสได้รับการสปอนเซอร์ในสายงานของคุณ
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: a0e6dcb39e8175267bc299ee25c6b5892160e2ab64d30ced550f5a34f1034fc0
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[3].a[1]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[3].a[1]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[15].body[3].a[1]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[15].body[3].a[1]'
narrative_slot: utility
en: >-
  Finding the job first suits you when there are employers willing to sponsor a visa for candidates at your
  level. The study route needs a lump sum, but it buys you time in the country, a network, and access to
  openings that are harder to reach from abroad.
th: >-
  เส้นทางหางานให้ได้ก่อนย้ายเหมาะเมื่อมีนายจ้างพร้อมสปอนเซอร์วีซ่าให้ผู้สมัครในระดับของคุณ
  ส่วนเส้นทางเรียนต่อต้องใช้เงินก้อน แต่ช่วยให้มีเวลาอยู่ในประเทศ สร้างเครือข่าย
  และเข้าถึงโอกาสที่สมัครจากต่างประเทศได้ยากกว่า
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: ae97e0a9d3e091ab772978de5c880a94662862c4fa6b0ffd12320b16e456fd00
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[3].a[2]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[3].a[2]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[15].body[3].a[2]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[15].body[3].a[2]'
narrative_slot: utility
en: >-
  If you choose to study, do not look only at the course or the name of the university. Check the internship
  opportunities, the professional network, and the right to work after graduating.
th: >-
  หากเลือกเรียนต่อ อย่าดูแค่หลักสูตรหรือชื่อมหาวิทยาลัย ให้ตรวจโอกาสฝึกงาน เครือข่ายวิชาชีพ
  และสิทธิในการทำงานหลังเรียนจบด้วย
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: e67a7c1cb20cb902bbc05071e0d6907625724e6795ea86f35405e9b04536db94
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[3].q`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[3].q
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[15].body[3].q
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[15].body[3].q'
narrative_slot: utility
en: Should I find the job before moving, or study first?
th: ควรหางานให้ได้ก่อนย้าย หรือเรียนต่อก่อน
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c98ae7650f59fa8dee0683656ebb9511d664c71c5c91ede1545e94f2a1ed9790
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[4].a[0]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[4].a[0]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[15].body[4].a[0]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[15].body[4].a[0]'
narrative_slot: utility
en: Yes, for some roles and some companies. It does not mean every company in that country sponsors.
th: มีจริงในบางตำแหน่งและบางบริษัท แต่ไม่ได้หมายความว่าทุกบริษัทในประเทศนั้นจะสปอนเซอร์
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: dbecee8f2943f6402aa7d396ce692bd97d07ba0f8ee8576fac44e352e1329cd2
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[4].a[1]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[4].a[1]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[15].body[4].a[1]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[15].body[4].a[1]'
narrative_slot: utility
en: >-
  Whether it happens usually depends on the type of work, the salary level, how short the skill is, the size
  of the company, and the conditions of the visa. Some adverts state it plainly. Where they do not, you can
  ask before applying.
th: >-
  ความเป็นไปได้มักขึ้นอยู่กับประเภทงาน ระดับเงินเดือน ความขาดแคลนของทักษะ ขนาดบริษัท และเงื่อนไขของวีซ่า
  ประกาศงานบางตำแหน่งระบุไว้ชัดเจน หากไม่ระบุ คุณสามารถสอบถามก่อนสมัครได้
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: e0bb33075c00f3abdb0010c47e1ec581c10d9f5296c24119671652ddba699dac
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[4].q`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[4].q
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[15].body[4].q
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[15].body[4].q'
narrative_slot: utility
en: Do companies really sponsor visas?
th: บริษัทสปอนเซอร์วีซ่าให้จริงหรือไม่
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: a62e5f916221cee2ca98a34444a555d206a6d65b73b28ec2d1b7287ab4a43ce4
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[5].a[0]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[5].a[0]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[15].body[5].a[0]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[15].body[5].a[0]'
narrative_slot: utility
en: >-
  It depends on the profession. Health, law, education, safety and other regulated professions usually carry
  extra requirements, and you may have to go through a recognition process or obtain a licence before you can
  apply or start.
th: >-
  ขึ้นอยู่กับอาชีพ งานด้านสุขภาพ กฎหมาย การศึกษา ความปลอดภัย และวิชาชีพที่มีการกำกับดูแลมักมีข้อกำหนดเพิ่มเติม
  คุณอาจต้องผ่านกระบวนการรับรองคุณวุฒิหรือขอใบประกอบวิชาชีพก่อนสมัครหรือเริ่มงาน
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: d13525014258d429bcbc1527858318fda80a05be7e7784914714302edecdf95c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[5].a[1]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[5].a[1]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[15].body[5].a[1]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[15].body[5].a[1]'
narrative_slot: utility
en: Check it before you plan around applying, because these processes cost both time and money.
th: ควรตรวจสอบตั้งแต่ก่อนวางแผนสมัคร เพราะกระบวนการเหล่านี้ใช้ทั้งเวลาและค่าใช้จ่าย
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 5ac3601571156b4d5c1b26118190b7b01cd74fd1ad3415fadb71a06b54400dcf
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[5].q`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[5].q
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[15].body[5].q
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[15].body[5].q'
narrative_slot: utility
en: Is a Thai qualification accepted?
th: วุฒิการศึกษาจากไทยใช้ได้หรือไม่
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: ce3d9058c34f62d00a35bd00e0a87742d15ab3ae2569e471c3f807462f1d5502
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[6].a[0]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[6].a[0]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[15].body[6].a[0]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[15].body[6].a[0]'
narrative_slot: utility
en: Do not wait for a readiness nobody has defined.
th: อย่ารอความพร้อมแบบที่ไม่มีคำนิยาม
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 153f90f5a736fe16a10350abb1193a5f2fe5e6937a5f71980cd40b0614fc8399
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[6].a[1]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[6].a[1]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[15].body[6].a[1]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[15].body[6].a[1]'
narrative_slot: utility
en: >-
  You can start gathering information, learning the language, checking visa routes, reading job adverts and
  organising your experience today. What should wait is not starting. It is sending applications, until you
  know what you are testing.
th: >-
  คุณเริ่มหาข้อมูล เรียนภาษา ตรวจเส้นทางวีซ่า อ่านประกาศงาน และจัดระเบียบประสบการณ์ได้ตั้งแต่วันนี้
  สิ่งที่ควรรอไม่ใช่การเริ่มต้น แต่คือการส่งใบสมัครจนกว่าจะรู้ว่ากำลังทดสอบอะไร
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: d369cb9add1fc5884f8dd7d0a6eca655bbbffd3ec1261ebd84f327d4cb0135c3
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[6].a[2]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[6].a[2]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[15].body[6].a[2]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[15].body[6].a[2]'
narrative_slot: utility
en: Preparing and applying do not have to begin on the same day.
th: การเตรียมตัวกับการสมัครงานไม่จำเป็นต้องเริ่มวันเดียวกัน
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c92b54a18405a00ba1ed7d8012d8ab9ff9c382edb7fbb3d13b4356e7947e5ce2
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[6].q`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[6].q
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[15].body[6].q
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[15].body[6].q'
narrative_slot: utility
en: I am not ready. Should I wait until I am?
th: ยังไม่พร้อม ควรรอให้พร้อมก่อนหรือไม่
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: b864da6482029bc8dfe0abd211bbfb1e16c975a0912fcbb13ffe84cd112fe734
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[7].a[0]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[7].a[0]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[15].body[7].a[0]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[15].body[7].a[0]'
narrative_slot: utility
en: >-
  There is no timeframe that applies to everyone, because it depends on the profession, the language, the
  route, the quality of the profile, and how specific the search is.
th: >-
  ไม่มีระยะเวลาที่ใช้ได้กับทุกคน เพราะขึ้นอยู่กับอาชีพ ภาษา เส้นทางการย้าย คุณภาพของโปรไฟล์
  และความเจาะจงของการค้นหา
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: baf83e109804390b23163f6760142c4a059aa00cd67cf58c266a2d09790a1064
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[7].a[1]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[7].a[1]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[15].body[7].a[1]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[15].body[7].a[1]'
narrative_slot: utility
en: >-
  Two things clearly make it take longer: starting to apply before you know what you are offering the market,
  and aiming at several countries with no shared reason connecting them.
th: >-
  สองเรื่องที่ทำให้ใช้เวลานานขึ้นอย่างชัดเจนคือ การเริ่มสมัครก่อนรู้ว่าตัวเองเสนออะไรให้ตลาด
  และการเล็งหลายประเทศที่ไม่มีเหตุผลร่วมกัน
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 4e1fc561245cc7127803906c57f0f24f7685445b8b2437af6fa2fbe0eb82de04
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[7].a[2]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[7].a[2]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[15].body[7].a[2]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[15].body[7].a[2]'
narrative_slot: utility
en: You cannot control the day an offer arrives. You can control how many uncertainties you remove each week.
th: คุณควบคุมวันที่จะได้รับข้อเสนองานไม่ได้ แต่ควบคุมได้ว่าทุกสัปดาห์จะลดความไม่แน่นอนลงกี่เรื่อง
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: e3e6de91e8f97d2b3eeed214c922e35422e1cb81e622eca6e5d65ba6507208b1
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[7].q`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].body[7].q
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[15].body[7].q
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[15].body[7].q'
narrative_slot: utility
en: How long does it take to get a job?
th: ใช้เวลานานแค่ไหนกว่าจะได้งาน
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 0850e557655320b14a0657b9e815f42262864325dac639c9291fa8a7d8ef114f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].heading`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[15].heading
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[15].heading
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[15].heading'
narrative_slot: utility
en: Frequently asked questions
th: คำถามที่พบบ่อย
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 5d2eb18e9b4a38709aefd29e1ef1986e51b9a3df1afc4be131012c2e86f4da68
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[2].body[0].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[2].body[0].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[2].body[0].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[2].body[0].text'
narrative_slot: symptom
en: In the first week, most people do four things.
th: ในสัปดาห์แรก คนส่วนใหญ่มักทำสี่อย่าง
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 39790d4f2a6d4dba9c39ccd895c8e058c66b4ed7298718d384e84a7675687967
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[2].body[1].items[0]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[2].body[1].items[0]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[2].body[1].items[0]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[2].body[1].items[0]'
narrative_slot: symptom
en: Translate the CV into English
th: แปลเรซูเม่เป็นภาษาอังกฤษ
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 30d26f011f150680e46f88e083983d3a7041e19f5adbcdcccb94a8af85f75633
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[2].body[1].items[1]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[2].body[1].items[1]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[2].body[1].items[1]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[2].body[1].items[1]'
narrative_slot: symptom
en: Change the job title on LinkedIn
th: เปลี่ยนชื่อตำแหน่งบน LinkedIn
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 90a66e2c5f8c598f7432d2232c5c027630181d73a3871b1fc9eedeaecd601263
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[2].body[1].items[2]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[2].body[1].items[2]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[2].body[1].items[2]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[2].body[1].items[2]'
narrative_slot: symptom
en: Ask which country is easiest to get into
th: ถามว่าประเทศไหนไปง่ายที่สุด
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 9341183b3405cb50ce8429c9c2827c8099b8e2708cf5baf53a636cff7d0231c3
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[2].body[1].items[3]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[2].body[1].items[3]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[2].body[1].items[3]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[2].body[1].items[3]'
narrative_slot: symptom
en: Apply to every role advertised in English
th: ส่งใบสมัครไปยังทุกตำแหน่งที่ประกาศเป็นภาษาอังกฤษ
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 996c3db7e7a122d67d8955dc48c9edd296863c67ab0d218c3684192fd8889bda
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[2].body[2].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[2].body[2].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[2].body[2].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[2].body[2].text'
narrative_slot: symptom
en: All four look like action. All four are answering a question that has not been framed properly yet.
th: ทั้งสี่อย่างดูเหมือนการลงมือ แต่กำลังตอบคำถามที่ยังตั้งไม่ถูก
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: b7447584acc3dd6ccdb401a59c1e03538ea2990571206db4a56336a596f9eed6
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[2].body[3].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[2].body[3].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[2].body[3].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[2].body[3].text'
narrative_slot: symptom
en: >-
  A word-for-word translation gets you an English document that still tells its story by the logic of the Thai
  market. Asking which country is easiest gets you an answer built on somebody else's profession, language,
  money and life. And applying broadly gets you a silence you cannot interpret, because you do not know
  whether it is silent because the profile did not fit, because the market did not want it, or because the
  company could never hire from outside the country in the first place.
th: >-
  การแปลเรซูเม่แบบคำต่อคำจะได้เอกสารภาษาอังกฤษที่ยังเล่าเรื่องด้วยตรรกะแบบตลาดไทย
  การถามว่าประเทศไหนไปง่ายที่สุดจะได้คำตอบที่ตั้งอยู่บนอาชีพ ภาษา เงิน และชีวิตของคนอื่น
  ส่วนการสมัครแบบกระจายจะได้ความเงียบที่ตีความไม่ได้ เพราะคุณไม่รู้ว่าเงียบเพราะโปรไฟล์ไม่ตรง ตลาดไม่ต้องการ
  หรือบริษัทจ้างคนจากนอกประเทศไม่ได้ตั้งแต่ต้น
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 47868c25eb0b3b621d00f1e46aa2e8cfbd7128436949b80c588b1b30bc09fe30
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[2].body[4].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[2].body[4].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[2].body[4].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[2].body[4].text'
narrative_slot: symptom
en: So the real cost of applying too early is not the time spent. It is the information that does not come back.
th: ต้นทุนที่แท้จริงของการรีบสมัครจึงไม่ใช่เพียงเวลาที่เสียไป แต่คือข้อมูลที่ไม่ได้กลับมา
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 588795943cf7b78db7117361e3c2554c5f9041512138140ea1c29b753813ba36
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[2].body[5].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[2].body[5].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[2].body[5].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[2].body[5].text'
narrative_slot: symptom
en: >-
  You spend the market's first look at you on a version of your profile that is not finished, and you get back
  a result that cannot tell you what to fix next.
th: >-
  คุณใช้โอกาสแรกที่ตลาดจะเห็นคุณกับโปรไฟล์เวอร์ชันที่ยังจัดวางไม่เสร็จ
  แล้วได้รับผลลัพธ์ที่บอกไม่ได้ว่าควรแก้อะไรต่อ
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 13566a438a10379d8648b2413380c60596212c1c3cb7e324d81427872932696b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[2].heading`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[2].heading
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[2].heading
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[2].heading'
narrative_slot: symptom
en: The cost of applying too early is not only time
th: ต้นทุนของการรีบสมัครไม่ใช่แค่เวลา
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 0fc4b2ccc9c06f5e0206d9d92e04e5ad03a82f1fe639301d6805786b8e2ba4e3
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[3].body[0].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[3].body[0].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[3].body[0].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[3].body[0].text'
narrative_slot: mechanism
en: “Europe” is not one job market.
th: “ยุโรป” ไม่ใช่ตลาดงานเดียว
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 81f2e572d54318c721105cb7a573c19cbcb169736328bdaff68c324951e11d11
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[3].body[1].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[3].body[1].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[3].body[1].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[3].body[1].text'
narrative_slot: mechanism
en: >-
  The same job can be short of people in one country and have more applicants than openings in the next.
  European Labour Authority data finds that of 430 occupations classed as in shortage in at least one country,
  422 of them, 98%, are also classed as being in surplus in another country.
th: >-
  งานชนิดเดียวกันอาจขาดแคลนในประเทศหนึ่งและมีผู้สมัครเกินความต้องการในอีกประเทศหนึ่ง ข้อมูลของ European Labour
  Authority พบว่า จาก 430 อาชีพที่ขาดแคลนในอย่างน้อยหนึ่งประเทศ มีถึง 422 อาชีพ หรือ 98%
  ที่ถูกจัดว่ามีแรงงานเกินความต้องการในประเทศอื่นด้วย
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 83d21fa2da8b24b2218be301877e9bbb85bc7f2532189951cd36e0e4291cab57
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[3].body[2].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[3].body[2].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[3].body[2].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[3].body[2].text'
narrative_slot: mechanism
en: >-
  That number does not tell you whether Europe has jobs or does not. It tells you that “does Europe need my
  profession?” is too broad a question to plan with.
th: >-
  ตัวเลขนี้ไม่ได้บอกว่ายุโรปมีหรือไม่มีงาน แต่มันบอกว่าคำว่า “ยุโรปต้องการอาชีพของฉันไหม”
  เป็นคำถามที่กว้างเกินกว่าจะใช้วางแผนได้
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 7ab21b1525fe93e6ce4dd9fb525b960f5e660a505e7d963fc59b9d067292ddd5
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[3].body[3].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[3].body[3].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[3].body[3].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[3].body[3].text'
narrative_slot: mechanism
en: The more useful question is this.
th: คำถามที่มีประโยชน์กว่าคือ
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 53e4995d4d538377e1a4fa7edfd8d31abebc93606cbfc4a4a86328a8eeb3976e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[3].body[4].items[0]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[3].body[4].items[0]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[3].body[4].items[0]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[3].body[4].items[0]'
narrative_slot: mechanism
en: Which country needs my skills?
th: ประเทศไหนกำลังต้องการทักษะของฉัน
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 5d7919997b1a5d0d94d4094c0e904ac5f21c31fb85e87c81b0ad9f7d69cd1f8b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[3].body[4].items[1]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[3].body[4].items[1]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[3].body[4].items[1]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[3].body[4].items[1]'
narrative_slot: mechanism
en: And do I meet that country's conditions for working there?
th: และฉันผ่านเงื่อนไขที่จะทำงานในประเทศนั้นหรือไม่
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 169f59e6afc9b17879fc7843367200e9ddd73f67223636454e43c77566d8c711
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[3].body[5].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[3].body[5].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[3].body[5].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[3].body[5].text'
narrative_slot: mechanism
en: >-
  Start with one to three target countries, but there has to be a shared reason holding them together: a
  language you can work in, markets that are open to English in your field, or visa routes with similar
  conditions.
th: >-
  เริ่มจากประเทศเป้าหมายหนึ่งถึงสามประเทศ แต่ต้องมีเหตุผลร่วมกันที่เชื่อมประเทศเหล่านั้นไว้ เช่น
  ภาษาที่คุณใช้ทำงานได้ ตลาดที่เปิดรับภาษาอังกฤษในสายงานของคุณ หรือเส้นทางวีซ่าที่มีเงื่อนไขใกล้เคียงกัน
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 646a4d0917e65687d67eb69bb20e038b2c415aa5ebe18d8e41882af20ff04eaa
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[3].body[6].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[3].body[6].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[3].body[6].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[3].body[6].text'
narrative_slot: mechanism
en: A list of countries with nothing connecting them is not spreading your risk. It is not having chosen.
th: รายชื่อประเทศที่ไม่มีอะไรเชื่อมกันไม่ใช่การกระจายความเสี่ยง แต่คือการยังไม่ได้เลือก
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 47858a7caaf70586c01769e5393f8e3391f77369017466eb1bbdb726d18041a3
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[3].body[7].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[3].body[7].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[3].body[7].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[3].body[7].text'
narrative_slot: mechanism
en: >-
  Even if several countries are open to you, start work on one of them first, because visa rules, how you
  apply, the language level and what employers weigh are all different.
th: >-
  ถึงคุณจะมีโอกาสในหลายประเทศ ก็ควรเริ่มลงมือกับประเทศเดียวก่อน เพราะกฎวีซ่า วิธีสมัครงาน ระดับภาษา
  และสิ่งที่นายจ้างให้ความสำคัญล้วนต่างกัน
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 90319a128ec1aeee54991d8edeb2689ae9875e9d5ee2c0e4174901df311f47e7
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[3].body[8].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[3].body[8].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[3].body[8].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[3].body[8].text'
narrative_slot: mechanism
en: >-
  Starting one country at a time does not mean only one country is available to you. It means you are choosing
  to learn one market deeply enough to take that way of thinking to the next one.
th: >-
  การเริ่มทีละประเทศไม่ได้แปลว่าคุณไปได้เพียงประเทศเดียว แต่แปลว่าคุณเลือกเรียนรู้ตลาดหนึ่งให้ลึกพอ
  ก่อนนำวิธีคิดนั้นไปใช้กับตลาดถัดไป
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: e343e0c28344c1ff67b9d8342fbd51b003d07dbaf8838bc8c06903eaf21ea3be
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[3].heading`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[3].heading
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[3].heading
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[3].heading'
narrative_slot: mechanism
en: 1. Do not start from the word “Europe”
th: 1. อย่าเริ่มจากคำว่า “ยุโรป”
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 37ea29aeff56ee33c83f3d44cd943edca1fa7f6a5b845a893f33c5142f674361
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[4].body[0].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[4].body[0].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[4].body[0].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[4].body[0].text'
narrative_slot: mechanism
en: >-
  Most Thai people who want to work in Europe need a visa. Saying that you need a company to help with the
  visa therefore does not make your route any clearer.
th: >-
  คนไทยส่วนใหญ่ที่อยากไปทำงานในยุโรปต้องใช้วีซ่า
  การบอกว่าต้องการบริษัทช่วยเรื่องวีซ่าจึงยังไม่ได้ทำให้เส้นทางชัดขึ้น
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: de8a4bac83183b54e377edd5410f142c8e01948485d190684fe0fb8df1ac77e2
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[4].body[1].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[4].body[1].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[4].body[1].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[4].body[1].text'
narrative_slot: mechanism
en: >-
  What turns you from someone who wants to go into someone with a plan to go is being able to name your own
  route.
th: สิ่งที่เปลี่ยนคุณจากคนที่ “อยากไป” เป็นคนที่ “มีแผนไป” คือการเรียกชื่อเส้นทางของตัวเองได้
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c66d24c9db8d7b1e2728de0064f87386483503cfabfe6cdabc858d431d796f44
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[4].body[2].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[4].body[2].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[4].body[2].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[4].body[2].text'
narrative_slot: mechanism
en: The main routes are usually these.
th: เส้นทางหลักมักประกอบด้วย
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c016ccad814f5f1db1e2230749107847b8db3a8a4bbde6d9b7d7f4367415f806
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[4].body[3].items[0]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[4].body[3].items[0]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[4].body[3].items[0]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[4].body[3].items[0]'
narrative_slot: mechanism
en: Find a job where the employer is willing to sponsor, under a visa type you can name
th: หางานที่นายจ้างพร้อมสปอนเซอร์ภายใต้วีซ่าประเภทที่ระบุได้
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 275b3d1cef49eaf2bfcd139889a92b4dc5edd3a3066eaeb4ba2ed4d2de06aab4
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[4].body[3].items[1]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[4].body[3].items[1]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[4].body[3].items[1]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[4].body[3].items[1]'
narrative_slot: mechanism
en: Study, then use your post-study rights to look for work
th: เรียนต่อแล้วใช้สิทธิหลังเรียนจบเพื่อหางาน
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 504c23e4c1b3b2103cda406b8cf14b38b921a75027e347db4519852b445afc8e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[4].body[3].items[2]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[4].body[3].items[2]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[4].body[3].items[2]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[4].body[3].items[2]'
narrative_slot: mechanism
en: Move with a partner or family
th: ย้ายตามคู่ครองหรือครอบครัว
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 71823475a85fc82dfad1ef5ad1a85dfb18442768330e811e664f91eb104fafae
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[4].body[3].items[3]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[4].body[3].items[3]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[4].body[3].items[3]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[4].body[3].items[3]'
narrative_slot: mechanism
en: Use a right to work you already hold
th: ใช้สิทธิทำงานที่มีอยู่แล้ว
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: bf6a427dc12668a34c330112a47ec98253cb36ae03032196ed55d648e77b9896
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[4].body[4].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[4].body[4].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[4].body[4].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[4].body[4].text'
narrative_slot: mechanism
en: >-
  The difference between “I want a company to help with the visa” and “a role at this level meets the criteria
  for this visa type, and employers of this kind tend to file it” is not confidence. It is the quality of your
  information.
th: >-
  ความต่างระหว่าง “อยากให้บริษัทช่วยเรื่องวีซ่า” กับ “ตำแหน่งระดับนี้เข้าเกณฑ์วีซ่าประเภทนี้
  และนายจ้างลักษณะนี้มีแนวโน้มยื่นให้” ไม่ได้อยู่ที่ความมั่นใจ แต่อยู่ที่คุณภาพของข้อมูล
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 35876c38409d440a492635b3324c5b423869d08a5e21dc64bb4ab77b7b8e225d
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[4].body[5].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[4].body[5].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[4].body[5].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[4].body[5].text'
narrative_slot: mechanism
en: >-
  That information should come from the government websites of your target country and from real job adverts,
  not from a summary post that never says who it applies to or when it was last updated.
th: >-
  ข้อมูลนี้ควรมาจากเว็บไซต์หน่วยงานรัฐของประเทศเป้าหมายและประกาศงานจริง
  ไม่ใช่โพสต์สรุปที่ไม่ได้ระบุว่าข้อมูลใช้กับใครหรืออัปเดตเมื่อใด
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: d3b74fe0da68a726112670d8906b180e6ead8c378fbbd4d174e61635c0566e5c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[4].body[6].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[4].body[6].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[4].body[6].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[4].body[6].text'
narrative_slot: mechanism
en: >-
  Money belongs at this stage too, because it is not just what you spend after you get the job. It decides
  which routes are open to you in the first place.
th: >-
  เรื่องเงินต้องเข้ามาอยู่ในขั้นนี้ด้วย เพราะเงินไม่ได้เป็นเพียงค่าใช้จ่ายหลังได้งาน
  แต่เป็นตัวกำหนดว่าเส้นทางใดเปิดให้คุณตั้งแต่แรก
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 0afdf9f864c3dbac935d20cc85cb13a22d220c3909bafc1ea2b90eff041c820f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[4].body[7].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[4].body[7].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[4].body[7].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[4].body[7].text'
narrative_slot: mechanism
en: >-
  The study route needs a lump sum up front, and every route has transition costs: travel, a deposit on
  somewhere to live, the first month's rent, translating and certifying documents, insurance, and living
  expenses while you wait for the first salary.
th: >-
  เส้นทางเรียนต่อต้องใช้เงินก้อน ขณะที่ทุกเส้นทางมีค่าใช้จ่ายช่วงเปลี่ยนผ่าน เช่น ค่าเดินทาง ค่ามัดจำที่พัก
  ค่าเช่าเดือนแรก ค่าแปลและรับรองเอกสาร ค่าประกัน และค่าใช้ชีวิตระหว่างรอเงินเดือนก้อนแรก
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 52653b3914cb455cc8a4f5de81735980c5d51d9d0365f5cd5c0a1e5136c27c4d
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[4].body[8].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[4].body[8].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[4].body[8].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[4].body[8].text'
narrative_slot: mechanism
en: >-
  Do not go looking for what it costs to go to Europe. Go looking for what it costs to move to your target
  country, by the route you have chosen.
th: อย่าหาว่า “ไปยุโรปต้องมีเงินเท่าไร” ให้หาว่าการย้ายไปประเทศเป้าหมายด้วยเส้นทางที่คุณเลือกต้องใช้เงินเท่าไร
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 25ca7df75955e347c92cd743db6107523a6cca2ff2fd77223e9750f32b27ace9
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[4].body[9].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[4].body[9].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[4].body[9].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[4].body[9].text'
narrative_slot: mechanism
en: >-
  A checkable number for one country lets you actually plan. An average across the whole of Europe means
  almost nothing to any individual life.
th: >-
  ตัวเลขที่ตรวจสอบได้ของประเทศเดียวช่วยให้คุณวางแผนได้จริง
  ค่าเฉลี่ยของทั้งยุโรปแทบไม่มีความหมายกับชีวิตของใครคนหนึ่ง
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: ef6395236628ceb4f9e821ab0c8e70b114b2998e37371f91d7981255d9713cd7
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[4].heading`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[4].heading
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[4].heading
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[4].heading'
narrative_slot: mechanism
en: 2. “I need a visa” is not yet a plan
th: 2. “ต้องใช้วีซ่า” ยังไม่ใช่แผน
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c0d0f617bdc47149b225755663f55613ac11b1b945008eac278c73110a2ed573
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[5].body[0].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[5].body[0].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[5].body[0].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[5].body[0].text'
narrative_slot: misread
en: A European employer does not automatically know the Thai context.
th: นายจ้างยุโรปไม่ได้รู้จักบริบทของไทยโดยอัตโนมัติ
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 12bcc365a644041017ac745142c93848c867643cc24ca69df64311ca21c3de8b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[5].body[1].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[5].body[1].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[5].body[1].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[5].body[1].text'
narrative_slot: misread
en: >-
  A company name the whole of Thailand knows may be just a name a European recruiter has never heard. A senior
  job title in Bangkok may be read as mid-level. And a project you know was large and complex may come out as
  one ordinary line on a CV.
th: >-
  ชื่อบริษัทที่คนไทยรู้จักกันทั้งประเทศ อาจเป็นเพียงชื่อหนึ่งที่ผู้สรรหาในยุโรปไม่เคยได้ยิน
  ชื่อตำแหน่งระดับอาวุโสในกรุงเทพฯ อาจถูกตีความเป็นระดับกลาง
  และโครงการที่คุณรู้ว่าใหญ่และซับซ้อนอาจกลายเป็นเพียงหนึ่งบรรทัดธรรมดาในเรซูเม่
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 0d2931f0f0575820e8dd408b6ba9cb848b15149a84a3e117f9c185e387e4b812
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[5].body[2].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[5].body[2].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[5].body[2].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[5].body[2].text'
narrative_slot: misread
en: >-
  None of this makes your experience worth less. It puts the work of interpretation on the reader, and the
  reader usually does not have time for it.
th: >-
  สิ่งเหล่านี้ไม่ได้ทำให้ประสบการณ์ของคุณมีค่าน้อยลง แต่เพิ่มภาระให้คนอ่านต้องตีความเอง
  และคนอ่านมักไม่มีเวลาทำเช่นนั้น
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c74197c64f6a07f8936cae6522588e90e40352d0151fd034ed44d60093e7a382
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[5].body[3].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[5].body[3].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[5].body[3].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[5].body[3].text'
narrative_slot: misread
en: There is another layer, and it is cultural.
th: ยังมีความต่างทางวัฒนธรรมอีกชั้นหนึ่ง
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 789307cf43fb186523d40a03913e74cf3d7bad944fc31431f9228e3ec83770ef
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[5].body[4].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[5].body[4].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[5].body[4].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[5].body[4].text'
narrative_slot: misread
en: >-
  Working life in Thailand values modesty and giving the credit to the team, while CVs and interviews in
  Europe generally want a candidate to state plainly what they did themselves, what they decided, and what
  results they produced.
th: >-
  การทำงานในไทยให้คุณค่ากับความถ่อมตัวและการยกความดีให้ทีม
  ขณะที่เรซูเม่และการสัมภาษณ์ในยุโรปมักต้องการให้ผู้สมัครระบุอย่างชัดเจนว่า ตัวเองทำอะไร ตัดสินใจอะไร
  และสร้างผลลัพธ์แบบไหน
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: e00351a48993d3b40867737a6707b2ad45b8524e12e31e86b5c1930315d31398
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[5].body[5].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[5].body[5].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[5].body[5].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[5].body[5].text'
narrative_slot: misread
en: >-
  So a great many Thai people are not underselling themselves for lack of confidence. They are correctly
  following the rules of a different market.
th: >-
  คนไทยจำนวนมากจึงไม่ได้เล่าตัวเองต่ำกว่าความจริงเพราะขาดความมั่นใจ
  แต่เพราะกำลังใช้กติกาของอีกตลาดหนึ่งอย่างถูกต้อง
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 72f960f1750c35f7b8fc96e6e67a3b8fe2b2140d8837d0e5a612df0bca42e51a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[5].body[6].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[5].body[6].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[5].body[6].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[5].body[6].text'
narrative_slot: misread
en: >-
  Which is why “be more confident” is not enough advice. What is needed is translating the context, not only
  the language.
th: คำแนะนำว่า “ต้องมั่นใจขึ้น” จึงไม่เพียงพอ สิ่งที่ต้องทำคือแปลบริบท ไม่ใช่แค่แปลภาษา
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 468db8e00b788a729c208c92b7ca84f46e24ada219f1222c02c8609d020a5523
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[5].heading`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[5].heading
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[5].heading
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[5].heading'
narrative_slot: misread
en: 3. The problem may not be your experience, but that the reader cannot interpret it
th: 3. ปัญหาอาจไม่ใช่ประสบการณ์ แต่คือคนอ่านยังตีความไม่ออก
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: b50c4b6808b5fdff24ce5255abc270fe098b4c3d74c3e6366370374ad84f4584
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[6].body[0].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[6].body[0].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[6].body[0].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[6].body[0].text'
narrative_slot: mechanism
en: >-
  Before you go back to the CV, pick at least 20 real job adverts in your target country and field, and note
  down what keeps recurring.
th: ก่อนกลับไปแก้เรซูเม่ ให้เลือกประกาศงานจริงอย่างน้อย 20 ตำแหน่งในประเทศและสายงานเป้าหมาย แล้วจดสิ่งที่พบซ้ำ
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 59f93f45827e3fbc42eb0f5aa6ef6c41fcc6fee56b6c419e99ca5ee65faa8b5f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[6].body[1].items[0]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[6].body[1].items[0]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[6].body[1].items[0]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[6].body[1].items[0]'
narrative_slot: mechanism
en: The job titles the market actually uses
th: ชื่อตำแหน่งที่ตลาดใช้
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 8e505fb3dcd270c74fe6513c2dedb6d329b618aec9aa5f4c9c8c54516e1b3e4f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[6].body[1].items[1]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[6].body[1].items[1]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[6].body[1].items[1]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[6].body[1].items[1]'
narrative_slot: mechanism
en: The problem the company wants someone in this role to solve
th: ปัญหาที่บริษัทต้องการให้คนตำแหน่งนี้แก้
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 0f1d1b111f76f754c4ee8496fe4da5ddf60d6a6282d4f1ebc11eb2533afa4873
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[6].body[1].items[2]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[6].body[1].items[2]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[6].body[1].items[2]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[6].body[1].items[2]'
narrative_slot: mechanism
en: Skills and tools that appear often
th: ทักษะและเครื่องมือที่ปรากฏบ่อย
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 479610e61ab44592dbdde8e84ab1508b3ee48b91bb8215cc747ddcdf5e04ef55
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[6].body[1].items[3]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[6].body[1].items[3]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[6].body[1].items[3]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[6].body[1].items[3]'
narrative_slot: mechanism
en: Language level
th: ระดับภาษา
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 0a79453854d7aa948532f05212a8a6bb3bb6fdf8bb21e82ed6a4ba98c044c4c6
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[6].body[1].items[4]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[6].body[1].items[4]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[6].body[1].items[4]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[6].body[1].items[4]'
narrative_slot: mechanism
en: Industry experience
th: ประสบการณ์ในอุตสาหกรรม
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: bc06fbf00c5b6d9248ac8fee0ed0f160498e9e79a6b8439f7cc9c2a62e6e629e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[6].body[1].items[5]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[6].body[1].items[5]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[6].body[1].items[5]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[6].body[1].items[5]'
narrative_slot: mechanism
en: Conditions on visas or the right to work
th: เงื่อนไขเรื่องวีซ่าหรือสิทธิทำงาน
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 2c96daad01e07ff518b15d78b6f6406cfafaff07bdd575c72492f26d8d4aa98a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[6].body[1].items[6]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[6].body[1].items[6]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[6].body[1].items[6]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[6].body[1].items[6]'
narrative_slot: mechanism
en: Qualifications or professional licences required
th: คุณวุฒิหรือใบประกอบวิชาชีพที่ต้องมี
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: dde0e48f8568ece0f689016b26978327c02de7183a9199bb7f0af8ca89191966
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[6].body[2].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[6].body[2].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[6].body[2].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[6].body[2].text'
narrative_slot: mechanism
en: >-
  The turn comes when the question in your head changes from “how do I describe myself?” to “what problem is
  the market hiring someone to solve?”
th: จุดเปลี่ยนเกิดขึ้นเมื่อคำถามในหัวเปลี่ยนจาก “ฉันจะอธิบายตัวเองอย่างไร” เป็น “ตลาดกำลังจ้างคนมาแก้ปัญหาอะไร”
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: a533b2a1edb6a1e27bdbc5866561af999aa7afcdd1add4021086f68b29e84c42
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[6].body[3].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[6].body[3].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[6].body[3].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[6].body[3].text'
narrative_slot: mechanism
en: Once you have the answer, then go back and rewrite the CV.
th: เมื่อรู้คำตอบแล้วจึงค่อยกลับไปเขียนเรซูเม่ใหม่
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 98c6abcfb2c5e5262bee521d71fc1ca086fcc567840e7b59c146b4d0ab7c39b0
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[6].body[4].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[6].body[4].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[6].body[4].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[6].body[4].text'
narrative_slot: mechanism
en: >-
  Do not write only that you were responsible for a project. Say what problem that project solved, what your
  role in it was, and what came of it. If your old job title is a term used only in Thailand, add a
  description a foreign reader can understand without guessing.
th: >-
  อย่าเขียนเพียงว่าคุณรับผิดชอบโครงการ ให้บอกว่าโครงการนั้นแก้ปัญหาอะไร คุณมีบทบาทอย่างไร และเกิดผลลัพธ์แบบไหน
  หากชื่อตำแหน่งเดิมเป็นคำที่ใช้เฉพาะในไทย ให้เพิ่มคำอธิบายที่คนต่างประเทศเข้าใจได้โดยไม่ต้องเดา
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 49b01f741f58055678b1849dee258a9c7247e75eb0aeb3686e75696d4a64a5ca
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[6].body[5].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[6].body[5].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[6].body[5].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[6].body[5].text'
narrative_slot: mechanism
en: >-
  LinkedIn has to tell the same story. The headline, the summary, the experience and the skills should all run
  in the same direction as the CV. When an employer looks you up, they should understand you better, not find
  a different account.
th: >-
  LinkedIn ต้องเล่าเรื่องเดียวกัน ชื่อตำแหน่ง คำแนะนำตัว ประสบการณ์ และทักษะควรไปในทิศทางเดียวกับเรซูเม่
  เมื่อนายจ้างเปิดดูต่อ เขาควรเข้าใจคุณชัดขึ้น ไม่ใช่พบเรื่องเล่าคนละชุด
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: fde6da20b6d4a37648b3b3a787b149a6dda104025a859a0b118fa655f6a64527
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[6].body[6].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[6].body[6].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[6].body[6].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[6].body[6].text'
narrative_slot: mechanism
en: >-
  The goal is not to make you look larger than you are. It is to make the value you already have visible
  quickly enough.
th: เป้าหมายไม่ใช่ทำให้คุณดูใหญ่กว่าความจริง แต่ทำให้คุณค่าที่มีอยู่แล้วถูกมองเห็นได้เร็วพอ
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 75292dc9e6aa0bfc40106f5f3fafa7bd1f60971ef6f81388902252ee2be07bc8
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[6].heading`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[6].heading
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[6].heading
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[6].heading'
narrative_slot: mechanism
en: Start with 20 job adverts
th: เริ่มจากประกาศงาน 20 ตำแหน่ง
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 751ed0950524299ccb5debd70f7004a362ffc841f97ef1b140a1e9ab30cf78f0
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[7].body[0].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[7].body[0].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[7].body[0].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[7].body[0].text'
narrative_slot: mechanism
en: >-
  Even where your experience fits, an employer still has several other questions to answer before hiring a
  candidate from abroad.
th: แม้ประสบการณ์จะตรง นายจ้างยังต้องตอบคำถามอีกหลายข้อก่อนจ้างผู้สมัครจากต่างประเทศ
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: a6e387fb3d083628d0bb7b8cb0513fbc229a9dce4eb4d9e231c6e2bfc83399ae
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[7].body[1].items[0]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[7].body[1].items[0]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[7].body[1].items[0]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[7].body[1].items[0]'
narrative_slot: mechanism
en: Is the qualification or professional licence valid in that country?
th: คุณวุฒิหรือใบประกอบวิชาชีพใช้ได้ในประเทศนั้นหรือไม่
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 1c74f86a68f1748d27e1146544d941d15631a3116c4d196deb21687ac2179d3a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[7].body[1].items[1]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[7].body[1].items[1]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[7].body[1].items[1]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[7].body[1].items[1]'
narrative_slot: mechanism
en: What level of the local language does the role need?
th: ตำแหน่งต้องใช้ภาษาท้องถิ่นระดับใด
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 4accfa64f7746f9c6a4da33820d5ce76b7aaf627daabb91a7d1471990b53eba2
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[7].body[1].items[2]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[7].body[1].items[2]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[7].body[1].items[2]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[7].body[1].items[2]'
narrative_slot: mechanism
en: Is the company able to hire from outside the country?
th: บริษัทสามารถจ้างคนจากนอกประเทศได้หรือไม่
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 7ff40360f0a2a13d00ee70a8014ee5da820f77d1ae528e4904a43dcf2199f601
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[7].body[1].items[3]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[7].body[1].items[3]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[7].body[1].items[3]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[7].body[1].items[3]'
narrative_slot: mechanism
en: Which work permit or visa type would be needed?
th: ต้องใช้ใบอนุญาตทำงานหรือวีซ่าประเภทใด
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 41f8c77c3908314d42e0b416bdab8ce954862ce7b2a5e6ff7950c7a386e562ca
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[7].body[1].items[4]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[7].body[1].items[4]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[7].body[1].items[4]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[7].body[1].items[4]'
narrative_slot: mechanism
en: When could you start and move?
th: คุณพร้อมเริ่มงานและย้ายประเทศเมื่อใด
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: e07e17a5bf34211728bc2e070732e185530dac034c8246c791a8c49303ebe98c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[7].body[2].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[7].body[2].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[7].body[2].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[7].body[2].text'
narrative_slot: mechanism
en: >-
  This is why capable people can go unanswered. The problem is not always the worth of the experience. It is
  that the employer cannot yet see how hiring you would actually happen.
th: >-
  นี่คือเหตุผลที่คนมีฝีมืออาจยังไม่ได้รับการตอบกลับ ปัญหาไม่ได้อยู่ที่คุณค่าของประสบการณ์เสมอไป
  แต่อยู่ที่นายจ้างยังมองไม่เห็นว่าการจ้างคุณจะเกิดขึ้นจริงได้อย่างไร
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 39db24ac20e4a3a8e0d0b42a2fdcb276f135c512905c5bfd79b490db7bf00fac
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[7].body[3].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[7].body[3].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[7].body[3].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[7].body[3].text'
narrative_slot: mechanism
en: Do not leave them to guess.
th: อย่าปล่อยให้เขาเดา
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 282268d19d87a1d5114f466b2ddd63a92d27fcb06cc2c204c1dbbf9deb004532
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[7].body[4].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[7].body[4].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[7].body[4].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[7].body[4].text'
narrative_slot: mechanism
en: >-
  State plainly where you are now, when you could start, whether you already hold a right to work, and what
  support you would need. That clarity screens out the companies that cannot hire you at the beginning, rather
  than after two rounds of interviews.
th: >-
  ระบุให้ชัดว่าตอนนี้คุณอยู่ที่ไหน เริ่มงานได้เมื่อไร มีสิทธิทำงานอยู่แล้วหรือไม่ และต้องการการสนับสนุนด้านใด
  ความชัดเจนนี้ช่วยคัดบริษัทที่จ้างคุณไม่ได้ออกตั้งแต่ต้น แทนที่จะเพิ่งมารู้หลังสัมภาษณ์ไปแล้วสองรอบ
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 4db09c9d2d9f087cce87c9c5eca7e6b8b91c9d3335bbf83181d07c9e2cbbeb9b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[7].heading`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[7].heading
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[7].heading
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[7].heading'
narrative_slot: mechanism
en: An employer is not only asking whether you can do the job
th: นายจ้างไม่ได้ดูแค่ว่าคุณทำงานเป็นหรือไม่
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 132bce40181a325c50016eff6e14e54a57c33432ace9df35cf0e6ad220b00eaf
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[8].body[0].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[8].body[0].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[8].body[0].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[8].body[0].text'
narrative_slot: mechanism
en: Urgency will tell you to apply everywhere and hope one of them answers.
th: ความเร่งรีบจะบอกให้คุณส่งใบสมัครไปทุกที่ แล้วหวังว่าจะมีสักแห่งตอบกลับ
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: e284a29d2cd4812dc3421d5fa20b55410ac151c8ec77d7785820e367aecc32d8
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[8].body[1].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[8].body[1].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[8].body[1].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[8].body[1].text'
narrative_slot: mechanism
en: >-
  The trouble is that when you apply everywhere you gradually stop being specific, and once a profile is not
  specific you become a candidate anyone else can be swapped in for.
th: >-
  ปัญหาคือ เมื่อสมัครทุกที่ คุณจะค่อย ๆ เลิกเจาะจง และเมื่อโปรไฟล์ไม่เจาะจง
  คุณจะกลายเป็นผู้สมัครที่แทนที่ด้วยใครก็ได้
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 8b108d64eca571c6db08f816742287589847807f97c5fc4148c43a308dea5fea
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[8].body[2].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[8].body[2].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[8].body[2].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[8].body[2].text'
narrative_slot: mechanism
en: A good application should be testing a clear assumption.
th: ใบสมัครที่ดีควรทดสอบสมมติฐานที่ชัดเจนว่า
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 1dc5bb5497b69758b4b9dfb290bba68f01163780b6f7d615abd0cff5938dc452
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[8].body[3].items[0]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[8].body[3].items[0]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[8].body[3].items[0]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[8].body[3].items[0]'
narrative_slot: mechanism
en: This market wants this kind of skill
th: ตลาดนี้ต้องการทักษะแบบนี้
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: e69314016f0797ef48c67b2e6ed403f56e82c13e401e85d9243b2da4d4f52fe3
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[8].body[3].items[1]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[8].body[3].items[1]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[8].body[3].items[1]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[8].body[3].items[1]'
narrative_slot: mechanism
en: My experience proves I can do it
th: ประสบการณ์ของฉันพิสูจน์ได้ว่าทำเรื่องนี้เป็น
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 91b4e0f7ad7424e778527dcc9d2e04a5f4ab932007fa9cef1cc0231a8e77837f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[8].body[3].items[2]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[8].body[3].items[2]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[8].body[3].items[2]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[8].body[3].items[2]'
narrative_slot: mechanism
en: And this company has a way of actually hiring me
th: และบริษัทนี้มีทางจ้างฉันได้จริง
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: e203c69e118dd23693bc2f4e452868176df11f2b1d5abb2de51e42dfa30ed48e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[8].body[4].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[8].body[4].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[8].body[4].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[8].body[4].text'
narrative_slot: mechanism
en: If you cannot yet write those three lines, you may not be ready to test it with an application.
th: หากยังเขียนสามบรรทัดนี้ไม่ได้ คุณอาจยังไม่พร้อมทดสอบด้วยใบสมัคร
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 5bd733cfba92beb14a58f59e9f8e221a32b6c3902b963b0ed46200434a1e5fb8
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[8].body[5].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[8].body[5].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[8].body[5].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[8].body[5].text'
narrative_slot: mechanism
en: >-
  Start by writing down about 20 real companies in your target country. Half of them ones you would genuinely
  want to work for, half of them ones you would consider.
th: >-
  เริ่มจากทำรายชื่อบริษัทจริงประมาณ 20 แห่งในประเทศเป้าหมาย ครึ่งหนึ่งเป็นบริษัทที่คุณอยากทำงานด้วยจริง
  อีกครึ่งหนึ่งเป็นบริษัทที่คุณพิจารณาได้
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 666821128ac9079c894634bdb1facbf19dbdf779d196506760df8a9a9e2d1bcf
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[8].body[6].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[8].body[6].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[8].body[6].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[8].body[6].text'
narrative_slot: mechanism
en: >-
  If you cannot fill the list, that is not a failure. It is information that the direction is not settled yet,
  and that is more useful than carrying on applying without knowing what you are testing.
th: >-
  หากยังหารายชื่อไม่ครบ ไม่ได้แปลว่าคุณล้มเหลว แต่มันเป็นข้อมูลว่าทิศทางยังไม่ชัด
  ซึ่งมีประโยชน์กว่าการส่งใบสมัครต่อไปโดยไม่รู้ว่ากำลังทดสอบอะไร
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 9da44c63c04732af24d2313d1a8c5ad89e696a58b70a4f3430d2dd92538dd714
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[8].body[7].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[8].body[7].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[8].body[7].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[8].body[7].text'
narrative_slot: mechanism
en: >-
  Then go company by company: what roles they open, whether they have hired from abroad before, and what
  background the people doing work like yours have. You can find all of it on the company's own careers page
  and on current employees' profiles.
th: >-
  จากนั้นตรวจทีละบริษัทว่าเปิดรับตำแหน่งแบบใด เคยจ้างคนจากต่างประเทศหรือไม่
  และพนักงานที่ทำงานคล้ายคุณมีพื้นฐานแบบไหน ข้อมูลเหล่านี้หาได้จากหน้าอาชีพของบริษัทและโปรไฟล์พนักงานปัจจุบัน
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 704f11990edcfec497cd07e4ddbb74e2804ceef9ff726a0e80937f656f86147b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[8].heading`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[8].heading
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[8].heading
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[8].heading'
narrative_slot: mechanism
en: 4. An application is not a lottery ticket, it is a test of an assumption
th: 4. ใบสมัครไม่ใช่ลอตเตอรี่ แต่เป็นการทดสอบสมมติฐาน
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 1910538689449518b606e44454ba6d25db0a982a758d4583263b67a052cfbde3
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[9].body[0].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[9].body[0].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[9].body[0].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[9].body[0].text'
narrative_slot: mechanism
en: A website tells you what a company says. People in the market tell you how it decides.
th: เว็บไซต์บอกได้ว่าบริษัทพูดอะไร แต่คนในตลาดจะบอกได้ว่าบริษัทตัดสินใจอย่างไร
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 1ee79933cae41fd5556014d4f543ed06844595db70fa5681efaa7b956ed3dea5
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[9].body[1].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[9].body[1].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[9].body[1].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[9].body[1].text'
narrative_slot: mechanism
en: >-
  Try talking to people in your own field, to alumni, or to Thai people working in your target country. Come
  with specific questions.
th: ลองคุยกับคนในสายเดียวกัน ศิษย์เก่า หรือคนไทยที่ทำงานอยู่ในประเทศเป้าหมาย เตรียมคำถามที่เฉพาะเจาะจง เช่น
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: a55d9da6a2eda422dd43dca0ec371cc049dd6659ab5c557cfdd9c1e429c26752
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[9].body[2].items[0]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[9].body[2].items[0]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[9].body[2].items[0]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[9].body[2].items[0]'
narrative_slot: mechanism
en: What kind of company usually takes candidates from abroad?
th: บริษัทแบบไหนมักรับผู้สมัครจากต่างประเทศ
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c0aee114a2601f6ef87e960b6124d64645ca8531d0cc383977fdb9acdc6a9598
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[9].body[2].items[1]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[9].body[2].items[1]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[9].body[2].items[1]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[9].body[2].items[1]'
narrative_slot: mechanism
en: Which skills carry more weight than the advert says?
th: ทักษะอะไรมีน้ำหนักมากกว่าที่เขียนไว้ในประกาศ
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: b01697d2a2dd06bc5f5fca1b96a2f762f59d2abd877277215d149090669d9f97
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[9].body[2].items[2]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[9].body[2].items[2]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[9].body[2].items[2]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[9].body[2].items[2]'
narrative_slot: mechanism
en: What do candidates from abroad usually get wrong?
th: ผู้สมัครจากต่างประเทศมักพลาดเรื่องใด
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 0c3dc196632c66c911c239cdc9969da6eef466ea9b494d530095cb742735a5af
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[9].body[2].items[3]`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[9].body[2].items[3]
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[9].body[2].items[3]
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[9].body[2].items[3]'
narrative_slot: mechanism
en: Which job title is closest to your experience?
th: ชื่อตำแหน่งใดใกล้กับประสบการณ์ของคุณที่สุด
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 019265b2d91d58df81a49b67c168892038fbb7598856aca6b9c5d7a3848df4ad
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[9].body[3].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[9].body[3].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[9].body[3].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[9].body[3].text'
narrative_slot: mechanism
en: >-
  The purpose is not to ask them to put you forward. It is to compare how the real market differs from what
  you have read.
th: จุดประสงค์ไม่ใช่การขอฝากงาน แต่เพื่อเปรียบเทียบว่าตลาดจริงต่างจากสิ่งที่คุณอ่านอย่างไร
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c56ba47ea8a4a5863ffd90dcffa57fd14b85cdc489431af6c7b5a07ee3fb4494
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[9].body[4].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[9].body[4].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[9].body[4].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[9].body[4].text'
narrative_slot: mechanism
en: >-
  The order matters. Talking before applying beats applying and then talking, because a conversation that
  happens first can still change your application, while one that happens afterwards can only explain what you
  already sent.
th: >-
  ลำดับมีผล คุยก่อนสมัครดีกว่าสมัครแล้วค่อยคุย เพราะบทสนทนาที่เกิดขึ้นก่อนยังเปลี่ยนใบสมัครของคุณได้
  ส่วนบทสนทนาหลังสมัครทำได้เพียงอธิบายสิ่งที่ส่งไปแล้ว
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: ed85dde6b397a0fa3b9ace794e86529ff7494419280a5df8c5e9672ac2861c60
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[9].body[5].text`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[9].body[5].text
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[9].body[5].text
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[9].body[5].text'
narrative_slot: mechanism
en: >-
  Applying without knowing anyone is not useless, but you are stepping into a space full of similar
  candidates. What shifts the odds is not knowing someone so you can skip a step. It is having context in
  place before your name reaches the company as a PDF.
th: >-
  การสมัครโดยไม่รู้จักใครไม่ได้ไร้ประโยชน์ แต่คุณกำลังเข้าไปอยู่ในพื้นที่ที่มีผู้สมัครคล้ายกันจำนวนมาก
  สิ่งที่ช่วยเปลี่ยนความน่าจะเป็นไม่ใช่การรู้จักคนเพื่อข้ามขั้นตอน
  แต่คือการมีบริบทก่อนที่ชื่อของคุณจะไปถึงบริษัทในรูปแบบไฟล์ PDF
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 3b2a24945839f1ddaa3475d26dd7090316d9ba5e10a5e4c8ee3d40aa841f6fdc
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[9].heading`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.sections[9].heading
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.sections[9].heading
render: 'Blog article: Start in Europe, START_IN_EUROPE.sections[9].heading'
narrative_slot: mechanism
en: Talk to people before you send a file
th: คุยกับคนก่อนส่งไฟล์
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 372e4d5c70e381159da9a51cd44f9cbe1408f38da70b8d4226bf07a8a5bae0ca
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.summary`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.summary
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.summary
render: 'Blog article: Start in Europe, START_IN_EUROPE.summary'
narrative_slot: misread
en: >-
  Most people start by sending applications, when an application should be the end point of three earlier
  decisions: which market to go after, which route you will move on, and how you will make an employer see the
  value of experience gained in Thailand.
th: >-
  คนส่วนใหญ่เริ่มจากการส่งใบสมัคร ทั้งที่ใบสมัครควรเป็นปลายทางของการตัดสินใจสามเรื่องก่อนหน้า ได้แก่
  จะเจาะตลาดไหน จะย้ายไปด้วยเส้นทางใด และจะทำให้นายจ้างเข้าใจคุณค่าของประสบการณ์จากไทยได้อย่างไร
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 32bcf8c2360590bac79413aa3f09392fed78ebb7fbeab976bb266248d6a239cf
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.title`

```yaml
id: src/lib/content/posts/start-in-europe.ts::START_IN_EUROPE.title
source: src/lib/content/posts/start-in-europe.ts
path: START_IN_EUROPE.title
render: 'Blog article: Start in Europe, START_IN_EUROPE.title'
narrative_slot: utility
en: You want to work in Europe. Where do you start? Do not spend the first 30 days applying
th: 'อยากไปทำงานยุโรป เริ่มจากตรงไหน: 30 วันแรกอย่าเพิ่งหว่านใบสมัคร'
provenance: paul-written
date: 18/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 05f005ef49a2064707c9a41aa7ff5613f01068f3e9af15829317e9dad5ba6b0e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::CALC_HEADING`

```yaml
id: src/lib/content/pricing.ts::CALC_HEADING
source: src/lib/content/pricing.ts
path: CALC_HEADING
render: Pricing page, CALC_HEADING
narrative_slot: utility
en: Work out which pack fits how much you will use it
th: ลองคำนวณดูว่าแพ็กไหนพอดีกับการใช้งานของคุณ
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's wording, 23/08/2026.
review:
  structural_calque: pass
  text_hash: 9927bc08c752d76a6c655893d42fbbea10b465ef53cf2a0ed7f44733839b67aa
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::CALC_IN_TOKENS`

```yaml
id: src/lib/content/pricing.ts::CALC_IN_TOKENS
source: src/lib/content/pricing.ts
path: CALC_IN_TOKENS
render: Pricing page, CALC_IN_TOKENS
narrative_slot: utility
en: How many tokens that is
th: คิดเป็นกี่โทเคน?
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: d7f5861348319ef3723c7ac3717bf6612186ebed90b6b5beaa8ce9609e050c2e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::CALC_NOTE`

```yaml
id: src/lib/content/pricing.ts::CALC_NOTE
source: src/lib/content/pricing.ts
path: CALC_NOTE
render: Pricing page, CALC_NOTE
narrative_slot: utility
en: >-
  The result is worked out from what you entered. It is an estimate, not a guarantee of what you will actually
  earn.
th: ผลคำนวณอ้างอิงจากข้อมูลที่คุณกรอก เป็นเพียงตัวเลขประมาณการ และไม่ใช่การรับประกันเงินเดือนที่คุณจะได้รับจริง
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's wording, 23/08/2026.
review:
  structural_calque: pass
  text_hash: ef643cd188f792c392e284a9f7705cfa6002fa53387f621f12bfea531418c8c3
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::CALC_NOW`

```yaml
id: src/lib/content/pricing.ts::CALC_NOW
source: src/lib/content/pricing.ts
path: CALC_NOW
render: Pricing page, CALC_NOW
narrative_slot: utility
en: Salary now
th: เงินเดือนปัจจุบัน
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 12f48b41f7f2d2f9cea3698c11cb7026d899c6b584785a8f62aa6812dd358942
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::CALC_PER_MONTH`

```yaml
id: src/lib/content/pricing.ts::CALC_PER_MONTH
source: src/lib/content/pricing.ts
path: CALC_PER_MONTH
render: Pricing page, CALC_PER_MONTH
narrative_slot: utility
en: Difference per month
th: ส่วนต่างเงินเดือนต่อเดือน
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: f08fa80a175ce6ed7cb2468f714a64597e4e9362d8ef09f11a3e337af5c68512
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::CALC_PER_YEAR`

```yaml
id: src/lib/content/pricing.ts::CALC_PER_YEAR
source: src/lib/content/pricing.ts
path: CALC_PER_YEAR
render: Pricing page, CALC_PER_YEAR
narrative_slot: utility
en: Difference per year
th: ส่วนต่างเงินเดือนต่อปี
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 1da3ec5aceadcee18a552c28fa19ced773b72891a5a357325c088e79177b2f89
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::CALC_TARGET`

```yaml
id: src/lib/content/pricing.ts::CALC_TARGET
source: src/lib/content/pricing.ts
path: CALC_TARGET
render: Pricing page, CALC_TARGET
narrative_slot: utility
en: Target salary
th: เงินเดือนเป้าหมาย
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 29a043b1c10e873844021f47c0f6d92bd2b860845f44caa176b8380f51592f6f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::FREE_HEADING`

```yaml
id: src/lib/content/pricing.ts::FREE_HEADING
source: src/lib/content/pricing.ts
path: FREE_HEADING
render: Pricing page, FREE_HEADING
narrative_slot: utility
en: Which features are free
th: ใช้ฟรีได้อะไรบ้าง?
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 23/08/2026. He replaced `ส่วนไหนฟรี` with the ฟีเจอร์

  loanword, which matches the headline above it.
review:
  structural_calque: pass
  text_hash: 2ac8b79172173542788f76fd11d26f89d7e8d26128ba7f2ecfff236f153bb6f8
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::FREE_ITEMS[0].body`

```yaml
id: src/lib/content/pricing.ts::FREE_ITEMS[0].body
source: src/lib/content/pricing.ts
path: FREE_ITEMS[0].body
render: Pricing page, FREE_ITEMS[0].body
narrative_slot: utility
en: Posted in the Thai Jobs in Europe group, free for anyone to read.
th: ประกาศงานในกลุ่ม Thai Jobs in Europe เปิดให้ทุกคนอ่านฟรี
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 694c3a27553f363da36fca9ba82c1e94d1c5ee06c88e4dd2ab487cdd81f707b0
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::FREE_ITEMS[0].name`

```yaml
id: src/lib/content/pricing.ts::FREE_ITEMS[0].name
source: src/lib/content/pricing.ts
path: FREE_ITEMS[0].name
render: Pricing page, FREE_ITEMS[0].name
narrative_slot: utility
en: The jobs we screen for you
th: ตำแหน่งงานที่เราคัดมาให้
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: Paul's wording, 17/08/2026, carried over from `home.ts`.
review:
  structural_calque: pass
  text_hash: 2003cedc42031699f02c0969e9f05bb3469f0bd80082623907b42c60a83a0f27
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::FREE_ITEMS[1].body`

```yaml
id: src/lib/content/pricing.ts::FREE_ITEMS[1].body
source: src/lib/content/pricing.ts
path: FREE_ITEMS[1].body
render: Pricing page, FREE_ITEMS[1].body
narrative_slot: utility
en: Answer on your phone, and get your first read the moment you finish.
th: ตอบคำถามบนมือถือได้เลย รับผลเบื้องต้นทันทีเมื่อทำเสร็จ
provenance: paul-written
date: 10/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 23/08/2026, and the CUT is the point of it.
  The `home.ts` version of this sentence ends `จากนั้นจะมีคนอ่านคำตอบของคุณ
  จริง ๆ และติดต่อกลับ`. He removed that clause here: "removed ... as
  that's no longer true. No contact, only hot leads self qualify themself
  and contact us."
  Clarified by him the same day, and the distinction is the whole of it:
  **outbound contact has not stopped. The public promise of it has.** He
  still contacts the most ready leads. What he will not do is tell every
  finisher they will be contacted, because to a lead who is not ready that
  is a promise nobody intends to keep.
  So this is a marketing-copy change and not a funnel change. The
  10/08/2026 decision that a person delivers the full result stands, and
  `customer-journey.md` milestone 6 is unaffected.
  Three surfaces are deliberately NOT changed with it, because they are
  not promises: `consent-copy.ts` asks PERMISSION to make contact, which is
  the legal basis and must not be softened; `privacy.ts` states factually
  that a human reads before contact; and `faq.ts` already carries his own
  hedge, that a reply may take a while and its absence does not mean the
  result was bad.
review:
  structural_calque: pass
  text_hash: 88a12762ca731c94f619fac44052367f2c872f69f2373763f9f8b22d2b703e6c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::FREE_ITEMS[1].name`

```yaml
id: src/lib/content/pricing.ts::FREE_ITEMS[1].name
source: src/lib/content/pricing.ts
path: FREE_ITEMS[1].name
render: Pricing page, FREE_ITEMS[1].name
narrative_slot: utility
en: EU Fit Check
th: EU Fit Check
provenance: paul-approved
date: 23/08/2026
term_bindings:
  - product-eu-fit-check
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 7ae9e3e4001863e709a469f1869c47b8f8c2602e150e67572122b07756d09f9f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::INCLUDES_HEADING`

```yaml
id: src/lib/content/pricing.ts::INCLUDES_HEADING
source: src/lib/content/pricing.ts
path: INCLUDES_HEADING
render: Pricing page, INCLUDES_HEADING
narrative_slot: utility
en: Whichever pack you pick, it works on everything
th: ไม่ว่าเลือกแพ็กไหน ก็ใช้ได้กับทุกบริการ
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's wording, 23/08/2026.
review:
  structural_calque: pass
  text_hash: b01835f3d826607a3719b5547f3cef740282e330178adadd2eddc74e02563806
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::INCLUDES[0]`

```yaml
id: src/lib/content/pricing.ts::INCLUDES[0]
source: src/lib/content/pricing.ts
path: INCLUDES[0]
render: Pricing page, INCLUDES[0]
narrative_slot: artefact
en: Tokens never expire
th: โทเคนไม่มีวันหมดอายุ
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's wording, 23/08/2026.
review:
  structural_calque: pass
  text_hash: 9913275de891a585aa6751bbb5c85b6a7691111d3b05d76700828a9f9e6ec844
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::INCLUDES[1]`

```yaml
id: src/lib/content/pricing.ts::INCLUDES[1]
source: src/lib/content/pricing.ts
path: INCLUDES[1]
render: Pricing page, INCLUDES[1]
narrative_slot: artefact
en: Withdraw them as cash if you have not used them
th: ขอคืนเงินได้ หากยังไม่ได้ใช้โทเคน
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's wording, 23/08/2026. He changed ขอคืน to ถอนออกคืน.
review:
  structural_calque: pass
  text_hash: d1f8612be6e6fbae1286421f455aef21eef5544e59b2b97c5933acb1f03e33cd
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::INCLUDES[2]`

```yaml
id: src/lib/content/pricing.ts::INCLUDES[2]
source: src/lib/content/pricing.ts
path: INCLUDES[2]
render: Pricing page, INCLUDES[2]
narrative_slot: artefact
en: Screened against the criteria you set, not one list sent to everyone
th: คัดตามเงื่อนไขที่คุณกำหนด ไม่ใช่รายการเดียวกันที่ส่งให้ทุกคน
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's wording, 23/08/2026, over the line written after his RETHINK. See the note above.
review:
  structural_calque: pass
  text_hash: 8c537f6f82fe7c2897ad03cb39cec8f62ccace117da5b8b4c51d439a1ebf0c24
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::INCLUDES[3]`

```yaml
id: src/lib/content/pricing.ts::INCLUDES[3]
source: src/lib/content/pricing.ts
path: INCLUDES[3]
render: Pricing page, INCLUDES[3]
narrative_slot: artefact
en: Work rights are stated clearly on every role
th: ระบุสิทธิ์การทำงานของทุกตำแหน่งให้ชัด
provenance: paul-written
date: 22/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 23/08/2026. This is the decision of 22/08/2026 that work

  rights sit outside the match bar and are always named, said to a candidate.
review:
  structural_calque: pass
  text_hash: fef6a92bb38caa2cde61551caa940d784a69c549b19975ab4370825f4f53d48f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::NOTHING_FOUND`

```yaml
id: src/lib/content/pricing.ts::NOTHING_FOUND
source: src/lib/content/pricing.ts
path: NOTHING_FOUND
render: Pricing page, NOTHING_FOUND
narrative_slot: utility
en: We keep looking, and a token is only deducted once a role matching your criteria has reached you.
th: เราจะค้นหาต่อให้ และหักโทเคนเฉพาะเมื่อมีตำแหน่งที่ตรงกับเงื่อนไขส่งถึงคุณแล้ว
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's wording, 23/08/2026, over the line written after his RETHINK. See the note above.
review:
  structural_calque: pass
  text_hash: 95f4e4c75bd51b126d6f6257c7e70fa61930fe16f5b36e1d40f42f00b3b18214
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::PACKS_HEADING`

```yaml
id: src/lib/content/pricing.ts::PACKS_HEADING
source: src/lib/content/pricing.ts
path: PACKS_HEADING
render: Pricing page, PACKS_HEADING
narrative_slot: utility
en: Token packs
th: แพ็กโทเคน
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's wording, 23/08/2026.
review:
  structural_calque: pass
  text_hash: 74b2b6557788b24b7dca36c740c1bd8e1d655d965d1f105cc881997005276b51
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::PACKS[0].name`

```yaml
id: src/lib/content/pricing.ts::PACKS[0].name
source: src/lib/content/pricing.ts
path: PACKS[0].name
render: Pricing page, PACKS[0].name
narrative_slot: utility
en: Starter pack
th: แพ็กเกจเริ่มต้น
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 44b09bcb4509cde4a4863f6cbb812c67cf00e8e016e0f386d5e0584454941afe
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::PACKS[0].tagline`

```yaml
id: src/lib/content/pricing.ts::PACKS[0].tagline
source: src/lib/content/pricing.ts
path: PACKS[0].tagline
render: Pricing page, PACKS[0].tagline
narrative_slot: utility
en: Trying it out
th: ลองใช้บริการ
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: f03323c431af60952feb8f11d95dc4b331609065958f01e56b57b142f5b036da
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::PACKS[0].who`

```yaml
id: src/lib/content/pricing.ts::PACKS[0].who
source: src/lib/content/pricing.ts
path: PACKS[0].who
render: Pricing page, PACKS[0].who
narrative_slot: utility
en: For someone who wants to see first how closely the roles we pick match what you are looking for.
th: เหมาะกับคนที่อยากลองดูก่อนว่า ตำแหน่งที่เราคัดให้ตรงกับสิ่งที่คุณมองหาแค่ไหน
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: f54ab5354617e2ff59b6db4cbd5511165b19ab50652d82459513b4d134c810f1
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::PACKS[1].name`

```yaml
id: src/lib/content/pricing.ts::PACKS[1].name
source: src/lib/content/pricing.ts
path: PACKS[1].name
render: Pricing page, PACKS[1].name
narrative_slot: utility
en: Standard
th: มาตรฐาน
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: b6ef65a12b6689c5e8330ad4fda9f66709eb086b096f4783233265cc8fbac3e9
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::PACKS[1].tagline`

```yaml
id: src/lib/content/pricing.ts::PACKS[1].tagline
source: src/lib/content/pricing.ts
path: PACKS[1].tagline
render: Pricing page, PACKS[1].tagline
narrative_slot: utility
en: Job hunting
th: กำลังหางานอยู่
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: be2e027196e1664c08fcf523caecc590c825dfb5ea9b1edc406bd0d5089533d1
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::PACKS[1].who`

```yaml
id: src/lib/content/pricing.ts::PACKS[1].who
source: src/lib/content/pricing.ts
path: PACKS[1].who
render: Pricing page, PACKS[1].who
narrative_slot: utility
en: For someone applying every week who also wants the full assessment to plan the next step with.
th: เหมาะกับคนที่สมัครงานเป็นประจำทุกสัปดาห์ และอยากได้ผลประเมินฉบับเต็มไว้ช่วยวางแผนขั้นต่อไป
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: aa2190140944d824e78468a47697d4cd5d8ad7e6e610ecc86a84633c0275aaa2
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::PACKS[2].name`

```yaml
id: src/lib/content/pricing.ts::PACKS[2].name
source: src/lib/content/pricing.ts
path: PACKS[2].name
render: Pricing page, PACKS[2].name
narrative_slot: utility
en: Serious pack
th: แพ็กเกจเอาจริง
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 5b35dab47f9258a65490724e1e148585442f04b7ab3f0480073c2f51672e5f3c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::PACKS[2].tagline`

```yaml
id: src/lib/content/pricing.ts::PACKS[2].tagline
source: src/lib/content/pricing.ts
path: PACKS[2].tagline
render: Pricing page, PACKS[2].tagline
narrative_slot: utility
en: Moving this year
th: ตั้งใจย้ายปีนี้
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 4a35dba6c964d65f37a167cb25cb78ca705edc3d83ad4de1ec006d90fefc5bdf
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::PACKS[2].who`

```yaml
id: src/lib/content/pricing.ts::PACKS[2].who
source: src/lib/content/pricing.ts
path: PACKS[2].who
render: Pricing page, PACKS[2].who
narrative_slot: utility
en: For someone set on moving to Europe within the year, searching steadily over the months ahead.
th: เหมาะกับคนที่ตั้งใจย้ายไปยุโรปภายในปีนี้ และวางแผนหางานอย่างต่อเนื่องในช่วงหลายเดือนข้างหน้า
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: ed64b83add44f11c0aef64599d7e37698ac7508e011b6e237c95741fea9343bb
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::PRICING_HEADING`

```yaml
id: src/lib/content/pricing.ts::PRICING_HEADING
source: src/lib/content/pricing.ts
path: PRICING_HEADING
render: Pricing page, PRICING_HEADING
narrative_slot: utility
en: Start free, pay only for the features you choose
th: เริ่มใช้ฟรี จ่ายเฉพาะบริการที่คุณเลือก
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 23/08/2026. He replaced `ส่วนไหนฟรี และส่วนไหนมีค่าใช้จ่าย`,

  which was his own 17/08 line and still stands whole on the landing page. The

  new one frames the page as free-then-pay rather than free-versus-paid, which

  is the structure the page actually has.
review:
  structural_calque: pass
  text_hash: 8f5dbcc51e2a984ca4a4f0cff37b619b519811325f9d982fc01dd4668cb0b39c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::PRICING_INTRO`

```yaml
id: src/lib/content/pricing.ts::PRICING_INTRO
source: src/lib/content/pricing.ts
path: PRICING_INTRO
render: Pricing page, PRICING_INTRO
narrative_slot: utility
en: One token, good for every service on the site. Pick the pack that fits how much you will use it.
th: โทเคนเดียว ใช้ได้กับทุกบริการบนเว็บไซต์ เลือกแพ็กที่พอดีกับการใช้งานของคุณได้เลย
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 23/08/2026. This is the one-currency decision said out loud

  and the sentence the rest of the page depends on.
review:
  structural_calque: pass
  text_hash: 3c0ea85385a9319b76e87f74467495810ebd684f1dcfcbafb21dbccc3f52855e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::PRICING_QUESTIONS[0].a[0]`

```yaml
id: src/lib/content/pricing.ts::PRICING_QUESTIONS[0].a[0]
source: src/lib/content/pricing.ts
path: PRICING_QUESTIONS[0].a[0]
render: Pricing page, PRICING_QUESTIONS[0].a[0]
narrative_slot: utility
en: >-
  It depends what you want help with and how far that help goes. We go through the details and tell you the
  cost clearly the first time we talk, and then you decide whether to go ahead.
th: >-
  ค่าบริการขึ้นอยู่กับเรื่องที่คุณอยากให้เราช่วยและขอบเขตความช่วยเหลือที่ต้องการ
  เราจะคุยรายละเอียดพร้อมแจ้งค่าใช้จ่ายให้ชัดเจนตั้งแต่ครั้งแรก แล้วคุณค่อยตัดสินใจว่าจะใช้บริการหรือไม่
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 8896f0b0c358540c79dd3e006ca80e47edd4678b63a1acafd79a6eba78d6692a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::PRICING_QUESTIONS[0].a[1]`

```yaml
id: src/lib/content/pricing.ts::PRICING_QUESTIONS[0].a[1]
source: src/lib/content/pricing.ts
path: PRICING_QUESTIONS[0].a[1]
render: Pricing page, PRICING_QUESTIONS[0].a[1]
narrative_slot: utility
en: Both the EU Fit Check and that first conversation are free.
th: ทำ EU Fit Check พร้อมดูผลเบื้องต้น และคุยกับเราครั้งแรกได้ฟรี
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 6606c39e58a68f22e9142ef7466143df8b6031ea21d4df786515227ffb5ede24
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::PRICING_QUESTIONS[0].q`

```yaml
id: src/lib/content/pricing.ts::PRICING_QUESTIONS[0].q
source: src/lib/content/pricing.ts
path: PRICING_QUESTIONS[0].q
render: Pricing page, PRICING_QUESTIONS[0].q
narrative_slot: utility
en: What does Career Coaching cost?
th: บริการ Career Coaching ราคาเท่าไร?
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 53465b7aa2e16683b4ebc14d96b5681c8327e346f1812208b77a0654a337f8d1
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::PRICING_QUESTIONS[1].a[0]`

```yaml
id: src/lib/content/pricing.ts::PRICING_QUESTIONS[1].a[0]
source: src/lib/content/pricing.ts
path: PRICING_QUESTIONS[1].a[0]
render: Pricing page, PRICING_QUESTIONS[1].a[0]
narrative_slot: utility
en: They do not. And if you have not used them, you can have the money back.
th: ไม่หมดอายุ และถ้ายังไม่ได้ใช้ ขอคืนเป็นเงินได้
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 190af003a734833302092b256bbb69a6fe7a49ce68539d167d3e03e25da8d131
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::PRICING_QUESTIONS[1].q`

```yaml
id: src/lib/content/pricing.ts::PRICING_QUESTIONS[1].q
source: src/lib/content/pricing.ts
path: PRICING_QUESTIONS[1].q
render: Pricing page, PRICING_QUESTIONS[1].q
narrative_slot: utility
en: Do tokens expire?
th: โทเคนมีวันหมดอายุไหม?
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 005d7c75f9a57178b881e8dd171e8546d0cad1ccaae99ecbe00b2774e6572275
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::RECOMMENDED_BADGE`

```yaml
id: src/lib/content/pricing.ts::RECOMMENDED_BADGE
source: src/lib/content/pricing.ts
path: RECOMMENDED_BADGE
render: Pricing page, RECOMMENDED_BADGE
narrative_slot: utility
en: Recommended
th: แพ็กเกจแนะนำ
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's wording, 23/08/2026.
review:
  structural_calque: pass
  text_hash: 01f6710f3b28108937c7839fb79cf093215c527f31ff4669ed908d3e7f2a49a4
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::TOKEN_BODY`

```yaml
id: src/lib/content/pricing.ts::TOKEN_BODY
source: src/lib/content/pricing.ts
path: TOKEN_BODY
render: Pricing page, TOKEN_BODY
narrative_slot: utility
en: >-
  Every PunProfile service uses the same token, and we only deduct one once you have actually received the
  service.
th: ทุกบริการบน PunProfile ใช้โทเคนเดียวกัน และเราจะหักโทเคนก็ต่อเมื่อคุณได้รับบริการจริงแล้วเท่านั้น
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's wording, 23/08/2026.
review:
  structural_calque: pass
  text_hash: ac676335f2751b889d19e7c80e934e29ca061e61e194d43278c477429cbfef36
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::TOKEN_EXAMPLES[0]`

```yaml
id: src/lib/content/pricing.ts::TOKEN_EXAMPLES[0]
source: src/lib/content/pricing.ts
path: TOKEN_EXAMPLES[0]
render: Pricing page, TOKEN_EXAMPLES[0]
narrative_slot: utility
en: 1 token is 1 role matching your criteria, sent to your email
th: 1 โทเคน = 1 ตำแหน่งที่ตรงกับเงื่อนไขของคุณ ส่งตรงถึงอีเมล
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's wording, 23/08/2026.
review:
  structural_calque: pass
  text_hash: a9a392cb5c421550c3a59dfb979a07e7f6262fb8b4295622aa992fc56991d35c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::TOKEN_EXAMPLES[1]`

```yaml
id: src/lib/content/pricing.ts::TOKEN_EXAMPLES[1]
source: src/lib/content/pricing.ts
path: TOKEN_EXAMPLES[1]
render: Pricing page, TOKEN_EXAMPLES[1]
narrative_slot: utility
en: 20 tokens = 1 Fit Report
th: 20 โทเคน = Fit Report 1 ฉบับ
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's wording, 23/08/2026.
review:
  structural_calque: pass
  text_hash: 919d238bf847379901f480cf83b4ae2a55f90f3fae46759d1d699d8c7827c8dd
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/pricing.ts::TOKEN_HEADING`

```yaml
id: src/lib/content/pricing.ts::TOKEN_HEADING
source: src/lib/content/pricing.ts
path: TOKEN_HEADING
render: Pricing page, TOKEN_HEADING
narrative_slot: utility
en: What can one token do
th: 1 โทเคนใช้ทำอะไรได้บ้าง
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's wording, 23/08/2026.
review:
  structural_calque: pass
  text_hash: e15e3be00945195797d958067e49b047ea8ce77b8393ebc4baf40b637757de8d
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_BACK`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_BACK
source: src/lib/content/privacy.ts
path: PRIVACY_BACK
render: Privacy notice, PRIVACY_BACK
narrative_slot: utility
en: Back to the start
th: กลับหน้าแรก
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: d1349097f8b2e5084d0f19cc5c557a8d72961dcfcbffa3b3542240f13d047900
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_DRAFT_BANNER`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_DRAFT_BANNER
source: src/lib/content/privacy.ts
path: PRIVACY_DRAFT_BANNER
render: Privacy notice, PRIVACY_DRAFT_BANNER
narrative_slot: utility
en: Draft. Not yet reviewed by a qualified person and not yet something to rely on.
th: ฉบับร่าง ยังไม่ผ่านการตรวจสอบทางกฎหมาย ยังไม่ควรใช้อ้างอิง
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 443c44ffc940d37528cc5fb8921b9b4e03cfe4cb03281622d6c76e3766fc531f
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_HEADING`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_HEADING
source: src/lib/content/privacy.ts
path: PRIVACY_HEADING
render: Privacy notice, PRIVACY_HEADING
narrative_slot: utility
en: Privacy Policy
th: นโยบายความเป็นส่วนตัว
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: a5aa26264d76f28b9393e7084a4a1e4787980f1282ca9346cf413a14e52d119d
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_INTRO`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_INTRO
source: src/lib/content/privacy.ts
path: PRIVACY_INTRO
render: Privacy notice, PRIVACY_INTRO
narrative_slot: utility
en: >-
  This notice explains what PunProfile collects when you use the EU Fit Check, why we hold it, and what you
  can ask us to do with it.
th: >-
  ประกาศนี้อธิบายว่า PunProfile เก็บข้อมูลอะไรบ้างเมื่อคุณใช้ EU Fit Check เก็บไว้เพื่ออะไร
  และคุณขอให้เราทำอะไรกับข้อมูลนั้นได้บ้าง
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 2bdebd5f3fb73d070b5eaf0b4283023b1d85f943fce05087f55239efdb3a0dcf
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[0].body[0]`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[0].body[0]
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[0].body[0]
render: Privacy notice, PRIVACY_SECTIONS[0].body[0]
narrative_slot: utility
en: >-
  PunProfile Career Coaching. Only the PunProfile Team can reach your data, two people today, each signing in
  with their own account. No one else can sign in.
th: >-
  PunProfile Career Coaching ผู้ที่เข้าถึงข้อมูลของคุณคือทีมงานปั้นโปรไฟล์เท่านั้น ตอนนี้มี 2 คน
  แต่ละคนเข้าสู่ระบบด้วยบัญชีของตัวเอง และไม่มีใครอื่นเข้าสู่ระบบได้
provenance: paul-approved
date: 20/08/2026
term_bindings: []
decision_note: |-
  **The head count in this paragraph is a live claim, 20/08/2026.** It
  used to say one person and no team, which stopped being true the day a
  second coach was added to `ADMIN_EMAILS`. If that variable changes on
  production, this sentence and `PRIVACY_LAST_UPDATED` change with it, in
  both languages. Nothing enforces that but this comment: the allowlist
  lives in the Convex environment and no build step can read it.
  Wording is Paul's, 20/08/2026. `PunProfile Team` and
  `ทีมงานปั้นโปรไฟล์`, not "the coaching team". The controller keeps its
  Latin legal name at the head of the sentence, per LR-01.
review:
  structural_calque: pass
  text_hash: acf319257a44b991716856f7172aeeaa720440307978dfe0e388b95cc8c47b22
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[0].heading`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[0].heading
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[0].heading
render: Privacy notice, PRIVACY_SECTIONS[0].heading
narrative_slot: utility
en: Who holds your data
th: ใครเป็นผู้เก็บข้อมูลของคุณ
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 4d59377aeaf5c25fc1831f9dfb480b99756116d98882371ace9a0d3d73cde840
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[1].body[0]`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[1].body[0]
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[1].body[0]
render: Privacy notice, PRIVACY_SECTIONS[1].body[0]
narrative_slot: utility
en: >-
  Your answers to the nine assessment questions: your route to Europe, target countries, target role, CV and
  LinkedIn status, visa and right-to-work status, English level, job-search stage, and desired timeline. Every
  one is a fixed choice you tap. The assessment collects no free text anywhere.
th: >-
  คำตอบของคุณในคำถามประเมินทั้งเก้าข้อ ได้แก่ เส้นทางไปยุโรป ประเทศเป้าหมาย ตำแหน่งงานเป้าหมาย สถานะ CV และ
  LinkedIn สถานะวีซ่าและสิทธิในการทำงาน ระดับภาษาอังกฤษ ขั้นตอนการหางาน และกรอบเวลาที่ต้องการ
  ทุกข้อเป็นตัวเลือกที่กำหนดไว้ให้เลือก แบบประเมินนี้ไม่มีการเก็บข้อความที่พิมพ์เองในส่วนใดเลย
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 95eae5badf1975082d41cacb3c247189edd3bf201969e351c440bff0c81b777f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[1].body[1]`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[1].body[1]
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[1].body[1]
render: Privacy notice, PRIVACY_SECTIONS[1].body[1]
narrative_slot: utility
en: 'Your contact details at the final step: first name, last name, email address, and a LINE ID or phone number.'
th: ข้อมูลติดต่อของคุณในขั้นตอนสุดท้าย ได้แก่ ชื่อ นามสกุล อีเมล และ LINE ID หรือหมายเลขโทรศัพท์
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: f5e38fcfebc9a25097505d214c6d7b6663af113a0636a1c74ab477fdb4a4cfd0
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[1].body[2]`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[1].body[2]
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[1].body[2]
render: Privacy notice, PRIVACY_SECTIONS[1].body[2]
narrative_slot: utility
en: >-
  One of those questions asks about your visa and right-to-work status, which says something about your
  immigration position. We hold it because it changes what advice is honest, and for no other reason.
th: >-
  หนึ่งในคำถามเหล่านั้นถามถึงสถานะวีซ่าและสิทธิในการทำงานของคุณ ซึ่งบ่งบอกถึงสถานะทางการเข้าเมืองของคุณ
  เราเก็บข้อมูลนี้เพราะมันเปลี่ยนคำแนะนำที่เราจะให้ได้อย่างตรงไปตรงมา และไม่มีเหตุผลอื่นนอกจากนี้
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c74fafc9fd0f5b9aa5162f54018fd6d25e1a4e4c22e5d6dc461c9ae5d2e1973c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[1].heading`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[1].heading
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[1].heading
render: Privacy notice, PRIVACY_SECTIONS[1].heading
narrative_slot: utility
en: What we collect
th: เราเก็บข้อมูลอะไรบ้าง
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 38e88f83c24a4c08d4b6d4a7f3fed6b75284e809ae996782e435ced2b284be2e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[2].body[0]`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[2].body[0]
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[2].body[0]
render: Privacy notice, PRIVACY_SECTIONS[2].body[0]
narrative_slot: utility
en: >-
  From your answers we calculate four readiness scores and select a recommended next step. You did not provide
  these; the system computed them, and they are yours to ask about.
th: >-
  จากคำตอบของคุณ เราคำนวณคะแนนความพร้อมสี่ด้านและเลือกขั้นตอนถัดไปที่แนะนำ ข้อมูลส่วนนี้คุณไม่ได้ให้ไว้
  แต่ระบบคำนวณขึ้นมา และคุณมีสิทธิสอบถามเกี่ยวกับข้อมูลนี้ได้
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: bfc3bff70e97d9d4d688028029bed248fa8ea131ac567e16d90d6fdc28cbae91
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[2].body[1]`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[2].body[1]
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[2].body[1]
render: Privacy notice, PRIVACY_SECTIONS[2].body[1]
narrative_slot: utility
en: >-
  We also form an internal judgement about whether PunProfile is the right fit to work with you. It is used to
  decide who we follow up with. It is not shown to you and it is not stored.
th: >-
  นอกจากนี้เรายังประเมินภายในว่า PunProfile เหมาะที่จะทำงานร่วมกับคุณหรือไม่
  ใช้เพื่อพิจารณาว่าจะติดต่อกลับหาใคร ข้อมูลนี้ไม่ได้แสดงให้คุณเห็นและไม่ได้ถูกจัดเก็บไว้
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 8b28acea4777f4ee3ad541f544170b84e6431661f9a8a75414ae07942283fc10
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[2].body[2]`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[2].body[2]
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[2].body[2]
render: Privacy notice, PRIVACY_SECTIONS[2].body[2]
narrative_slot: utility
en: No decision here is fully automated. A person reads your record before anyone contacts you.
th: ไม่มีการตัดสินใจใดในขั้นตอนนี้ที่เป็นระบบอัตโนมัติทั้งหมด จะมีคนอ่านข้อมูลของคุณก่อนที่จะมีการติดต่อไป
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: aa352cf5a9598e2eb2da7a0d86f93ad488ec5ca967b9a454a347ccc8a72d5b11
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[2].heading`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[2].heading
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[2].heading
render: Privacy notice, PRIVACY_SECTIONS[2].heading
narrative_slot: utility
en: What we work out from it
th: เราประมวลผลอะไรจากข้อมูลนั้น
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: d7549907623a09802cd991fa14df4c37df23c8b0a0d48bea14c0f5ecb005507a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[3].body[0]`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[3].body[0]
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[3].body[0]
render: Privacy notice, PRIVACY_SECTIONS[3].body[0]
narrative_slot: utility
en: >-
  To produce your assessment result and send it to you, and, if you gave consent for that channel, to contact
  you about career coaching. We do not sell your data, and we do not use it for anything you have not agreed
  to.
th: >-
  เพื่อจัดทำผลการประเมินและส่งให้คุณ และหากคุณให้ความยินยอมสำหรับช่องทางนั้น
  เพื่อติดต่อคุณเกี่ยวกับบริการแนะแนวอาชีพ เราไม่ขายข้อมูลของคุณ
  และไม่นำไปใช้เพื่อการที่คุณไม่ได้ให้ความยินยอม
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: |-
  "We do not use it for anything else" was the wording Paul signed off

  on 14/08/2026 and it stops being true the moment the marketing tick

  ships. Narrowed rather than gated, so one sentence is correct in both

  states instead of two sentences being maintained.
review:
  structural_calque: pass
  text_hash: 66a88ce4633af700eeeb561306c2f024a483d2dc434d8350cf9e7c7e11176be5
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[3].body[2]`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[3].body[2]
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[3].body[2]
render: Privacy notice, PRIVACY_SECTIONS[3].body[2]
narrative_slot: utility
en: >-
  Each contact channel is consented to separately, and each consent is recorded with the date and time you
  gave it. A phone number with no consent beside it is one we will not call.
th: >-
  แต่ละช่องทางติดต่อต้องให้ความยินยอมแยกกัน และความยินยอมแต่ละรายการจะถูกบันทึกพร้อมวันและเวลาที่คุณให้ไว้
  หมายเลขโทรศัพท์ที่ไม่มีการให้ความยินยอมกำกับไว้ คือหมายเลขที่เราจะไม่โทรหา
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: ba8ae64b800b15aa0bd49987c3bcff8eb08f0630cd203a013b48d6f5b9b58bae
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[3].heading`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[3].heading
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[3].heading
render: Privacy notice, PRIVACY_SECTIONS[3].heading
narrative_slot: utility
en: Why we hold it
th: เหตุใดเราจึงเก็บข้อมูลนี้
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 8d168fffb4f2cc3a5e065990895790bccaf4c6119bd5658337239c34a9c41c75
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[5].body[0]`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[5].body[0]
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[5].body[0]
render: Privacy notice, PRIVACY_SECTIONS[5].body[0]
narrative_slot: utility
en: >-
  Your data is stored on servers in Ireland, operated by our database provider Convex. This means information
  you give us in Thailand is transferred out of Thailand and held in the European Union.
th: >-
  ข้อมูลของคุณถูกจัดเก็บบนเซิร์ฟเวอร์ในประเทศไอร์แลนด์ ซึ่งดำเนินการโดย Convex ผู้ให้บริการฐานข้อมูลของเรา
  หมายความว่าข้อมูลที่คุณให้เราในประเทศไทยจะถูกโอนออกนอกประเทศไทยและจัดเก็บไว้ในสหภาพยุโรป
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 5f8a5c052220f0c0eed6c86febdf80100efec04b23ad16f27255c11594b4f10e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[5].body[1]`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[5].body[1]
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[5].body[1]
render: Privacy notice, PRIVACY_SECTIONS[5].body[1]
narrative_slot: utility
en: '- Convex, our database. Holds everything described above.'
th: '- Convex ฐานข้อมูลของเรา จัดเก็บข้อมูลทั้งหมดที่อธิบายไว้ข้างต้น'
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 0c57ad76cdf67e366f3adf03ed5031b1401b0e121d2bab0a8db38c791c495f7a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[5].body[2]`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[5].body[2]
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[5].body[2]
render: Privacy notice, PRIVACY_SECTIONS[5].body[2]
narrative_slot: utility
en: '- Vercel, our hosting. Handles the web traffic. Stores none of your answers.'
th: '- Vercel ผู้ให้บริการโฮสติ้งของเรา ดูแลการรับส่งข้อมูลของเว็บไซต์ ไม่ได้จัดเก็บคำตอบของคุณ'
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: ad2996d840c4a0193c2dcaecab238012558427b4c4992adaff1fdf19de57ac85
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[5].body[3]`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[5].body[3]
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[5].body[3]
render: Privacy notice, PRIVACY_SECTIONS[5].body[3]
narrative_slot: utility
en: >-
  - Sentry, our error reporting, on its European servers. Receives technical error reports only. Your name,
  contact details and answers are stripped out before anything is sent.
th: >-
  - Sentry ระบบรายงานข้อผิดพลาดของเรา ใช้เซิร์ฟเวอร์ในยุโรป รับเฉพาะรายงานข้อผิดพลาดทางเทคนิคเท่านั้น ชื่อ
  ข้อมูลติดต่อ และคำตอบของคุณจะถูกตัดออกก่อนส่งทุกครั้ง
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 20978001440cf0d089bfd07d7e786853d0b8beabb05897b4740cfffbfbaa3190
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[5].body[4]`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[5].body[4]
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[5].body[4]
render: Privacy notice, PRIVACY_SECTIONS[5].body[4]
narrative_slot: utility
en: >-
  These are service providers processing data on our behalf, not parties we share your information with. No
  one else receives it.
th: >-
  ทั้งหมดนี้คือผู้ให้บริการที่ประมวลผลข้อมูลในนามของเรา ไม่ใช่บุคคลที่เราเปิดเผยข้อมูลของคุณให้
  ไม่มีผู้อื่นได้รับข้อมูลนี้
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c9ae782f24ab4978052105cd74f611a064ccbf9a36eceff81c9d97bf41f30350
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[5].heading`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[5].heading
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[5].heading
render: Privacy notice, PRIVACY_SECTIONS[5].heading
narrative_slot: utility
en: Where it is stored, and where it goes
th: ข้อมูลถูกเก็บที่ใด และส่งต่อไปที่ใด
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 560f867d36a95517810dd15067554a8f3f3c1495f809a5260e329624e2d4888f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[6].body[0]`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[6].body[0]
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[6].body[0]
render: Privacy notice, PRIVACY_SECTIONS[6].body[0]
narrative_slot: utility
en: >-
  Nothing that identifies you. We store no session identifier and no tracking cookie, and every visit starts
  fresh. The only thing we keep on your device is your language choice, Thai or English, which cannot be
  linked back to you or to your answers.
th: >-
  ไม่มีข้อมูลใดที่ระบุตัวตนของคุณ เราไม่จัดเก็บรหัสเซสชันและไม่มีคุกกี้ติดตาม
  การเข้าใช้งานทุกครั้งเริ่มต้นใหม่ทั้งหมด สิ่งเดียวที่เราเก็บไว้บนอุปกรณ์ของคุณคือภาษาที่คุณเลือก
  ไทยหรืออังกฤษ ซึ่งไม่สามารถเชื่อมโยงกลับมาถึงตัวคุณหรือคำตอบของคุณได้
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: afdd7e440077ab8d3c601f994a35809a2e3b782ef65925f563db81020f0ae032
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[6].heading`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[6].heading
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[6].heading
render: Privacy notice, PRIVACY_SECTIONS[6].heading
narrative_slot: utility
en: What is stored on your device
th: ข้อมูลที่จัดเก็บบนอุปกรณ์ของคุณ
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 6f4600b8d53c794ab60008f17fce0b727a4545f7d416c621fd10018edb2fe000
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[7].body[0]`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[7].body[0]
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[7].body[0]
render: Privacy notice, PRIVACY_SECTIONS[7].body[0]
narrative_slot: utility
en: >-
  Twelve months from your last contact with us, whether that is the day you submit or a later conversation,
  unless you ask us to delete it sooner.
th: >-
  สิบสองเดือนนับจากการติดต่อครั้งล่าสุดของคุณ ไม่ว่าจะเป็นวันที่คุณส่งข้อมูลหรือการติดต่อครั้งหลังจากนั้น
  เว้นแต่คุณจะขอให้เราลบก่อนกำหนด
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 5e99636e4c57221c3ef77c32bcc7255cae6f6f77d98cf897bcb0d1e74dad5fdf
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[7].heading`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[7].heading
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[7].heading
render: Privacy notice, PRIVACY_SECTIONS[7].heading
narrative_slot: utility
en: How long we keep it
th: เราเก็บข้อมูลไว้นานเท่าใด
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 6aaf89a112d4fdac7110d0daa85a5e0cf1e250ded2ff04f2fd77e84209951097
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[8].body[0]`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[8].body[0]
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[8].body[0]
render: Privacy notice, PRIVACY_SECTIONS[8].body[0]
narrative_slot: utility
en: >-
  - Ask for a copy of everything we hold about you. We will send you a readable copy, including the scores the
  system worked out from your answers.
th: >-
  - ขอสำเนาข้อมูลทั้งหมดที่เรามีเกี่ยวกับคุณ เราจะส่งสำเนาที่อ่านเข้าใจได้ให้คุณ
  รวมถึงคะแนนที่ระบบคำนวณจากคำตอบของคุณ
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 50f4aa880bb9d58ba275b4fc86db488f8bf2e65a1ee389190c21c594c8f35508
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[8].body[1]`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[8].body[1]
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[8].body[1]
render: Privacy notice, PRIVACY_SECTIONS[8].body[1]
narrative_slot: utility
en: '- Ask us to correct anything that is wrong.'
th: '- ขอให้เราแก้ไขข้อมูลที่ไม่ถูกต้อง'
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: bc329d9947a8472aa5d4e3715f223da188fbbb70f4e8f052cf62e8b321370c11
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[8].body[2]`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[8].body[2]
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[8].body[2]
render: Privacy notice, PRIVACY_SECTIONS[8].body[2]
narrative_slot: utility
en: >-
  - Ask us to delete you entirely. This removes your record, your answers and any link we sent you. It cannot
  be undone and there is no backup to restore from.
th: >-
  - ขอให้เราลบข้อมูลของคุณทั้งหมด การดำเนินการนี้จะลบระเบียนข้อมูล คำตอบ และลิงก์ใด ๆ ที่เราเคยส่งให้คุณ
  ไม่สามารถย้อนกลับได้และไม่มีข้อมูลสำรองให้กู้คืน
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: ebba5d29c8afd7460b6faa9183a07b3b01c06c5e4943093f4a949b323cede793
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[8].body[3]`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[8].body[3]
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[8].body[3]
render: Privacy notice, PRIVACY_SECTIONS[8].body[3]
narrative_slot: utility
en: >-
  - Withdraw your consent for any contact channel at any time. Withdrawing it stops future contact on that
  channel; it does not undo contact already made.
th: >-
  - ถอนความยินยอมสำหรับช่องทางติดต่อใดก็ได้ทุกเมื่อ การถอนความยินยอมจะหยุดการติดต่อในช่องทางนั้นในอนาคต
  แต่ไม่ได้ย้อนกลับการติดต่อที่เกิดขึ้นไปแล้ว
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 9132b44b34e28b4f99104a5eaeba36dc7a971bff34ac443627aabed6a1299db7
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[8].body[5]`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[8].body[5]
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[8].body[5]
render: Privacy notice, PRIVACY_SECTIONS[8].body[5]
narrative_slot: utility
en: '- Object to how we assess you, or complain to Thailand''s Personal Data Protection Committee.'
th: '- คัดค้านวิธีที่เราประเมินคุณ หรือร้องเรียนต่อคณะกรรมการคุ้มครองข้อมูลส่วนบุคคลของประเทศไทย'
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: ee8806ff097a844d9dc46a49a02c5c793fec659cdfba711e040bca2fb83257f7
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[8].body[6]`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[8].body[6]
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[8].body[6]
render: Privacy notice, PRIVACY_SECTIONS[8].body[6]
narrative_slot: utility
en: >-
  To exercise any of these, contact us using the details below. We may ask you to confirm something only the
  person in the record would know, because we have no way to log you in and we will not hand your data to
  someone claiming to be you.
th: >-
  หากต้องการใช้สิทธิเหล่านี้ โปรดติดต่อเราตามรายละเอียดด้านล่าง
  เราอาจขอให้คุณยืนยันบางอย่างที่เฉพาะเจ้าของข้อมูลเท่านั้นที่ทราบ เนื่องจากเราไม่มีระบบให้คุณเข้าสู่ระบบ
  และเราจะไม่ส่งมอบข้อมูลของคุณให้ผู้ที่อ้างว่าเป็นคุณ
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 0c73858b44a8457de8e3bd03df050202911729bc93a5e8b30fffabc813b3560c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[8].heading`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[8].heading
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[8].heading
render: Privacy notice, PRIVACY_SECTIONS[8].heading
narrative_slot: utility
en: Your rights
th: สิทธิของคุณ
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 9f92c7f78426330cdb2f29c35df850a98049f6c7ce57a9d2a0e13b19f13bec88
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[9].body[0]`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[9].body[0]
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[9].body[0]
render: Privacy notice, PRIVACY_SECTIONS[9].body[0]
narrative_slot: utility
en: Email punprofile.career@gmail.com. We answer data requests from that address.
th: อีเมล punprofile.career@gmail.com เราตอบคำขอเกี่ยวกับข้อมูลส่วนบุคคลจากที่อยู่นี้
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: f21725af9e2ac5588c9f141760cb2f31eedc90f6525dee144714b218568572e9
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_SECTIONS[9].heading`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_SECTIONS[9].heading
source: src/lib/content/privacy.ts
path: PRIVACY_SECTIONS[9].heading
render: Privacy notice, PRIVACY_SECTIONS[9].heading
narrative_slot: utility
en: Contact us
th: ติดต่อเรา
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: e42a777527d9edf4f28ea864895279d2063116f7aae90f752777aa688a6c65a5
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/privacy.ts::PRIVACY_UPDATED_LABEL`

```yaml
id: src/lib/content/privacy.ts::PRIVACY_UPDATED_LABEL
source: src/lib/content/privacy.ts
path: PRIVACY_UPDATED_LABEL
render: Privacy notice, PRIVACY_UPDATED_LABEL
narrative_slot: utility
en: Last updated
th: ปรับปรุงล่าสุด
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 370e231ec2fec78a231a003c1e36734bb2f1c08e64604245ee299eb24e1276bb
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::CARD_ACTION`

```yaml
id: src/lib/content/products.ts::CARD_ACTION
source: src/lib/content/products.ts
path: CARD_ACTION
render: Product pages, CARD_ACTION
narrative_slot: ask
en: See what it does
th: ดูว่าเครื่องมือนี้ช่วยอะไรได้บ้าง
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: |-
  Paul's wording, 06/09/2026. Follows the pattern the `read`-cost labels in

  `cta.ts` already use: ดู, and then what the page shows.
review:
  structural_calque: pass
  text_hash: 22da139111dcfd06eb487f57510dbb8c8d779fd7496bbfd92520af2f586e55eb
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::CLOSE_BODY`

```yaml
id: src/lib/content/products.ts::CLOSE_BODY
source: src/lib/content/products.ts
path: CLOSE_BODY
render: Product pages, CLOSE_BODY
narrative_slot: ask
en: >-
  Tell me where you are and what you are aiming at, and I will say which of these is worth your time and which
  is not.
th: บอกผมว่าตอนนี้คุณอยู่ตรงไหนและตั้งเป้าอะไรไว้ แล้วผมจะบอกว่าอันไหนคุ้มกับเวลาของคุณ และอันไหนยังไม่ต้อง
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: |-
  Read back 06/09/2026. First person, which is what `DESTINATIONS.contact`

  in `cta.ts` settled: the reader reaches a person, not a company.
review:
  structural_calque: pass
  text_hash: 7332baf18ac13b93e3fc84e39074b3625c6a14da6f9fd3363747bdbcf7ec0c49
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::CLOSE_HEADING`

```yaml
id: src/lib/content/products.ts::CLOSE_HEADING
source: src/lib/content/products.ts
path: CLOSE_HEADING
render: Product pages, CLOSE_HEADING
narrative_slot: utility
en: Not sure which one you need?
th: ยังไม่แน่ใจว่าควรเริ่มจากอันไหน
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: f6d4b0ea94a707d8a12b36f27b6169105bc4a1e43510d787307cfe4ef974a51e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::COL_COST`

```yaml
id: src/lib/content/products.ts::COL_COST
source: src/lib/content/products.ts
path: COL_COST
render: Product pages, COL_COST
narrative_slot: utility
en: How it is paid for
th: จ่ายอย่างไร
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: 99f1567cb032992e6e72d4fcc466e3f3bdc4839b2654bb87510aeebfd3b115fb
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::COL_PRODUCT`

```yaml
id: src/lib/content/products.ts::COL_PRODUCT
source: src/lib/content/products.ts
path: COL_PRODUCT
render: Product pages, COL_PRODUCT
narrative_slot: utility
en: What it is
th: บริการ
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: 1e64d19d901c888b475b8c578135752f586bde2a8ce83d104df508d4113d71f4
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::COL_WHAT`

```yaml
id: src/lib/content/products.ts::COL_WHAT
source: src/lib/content/products.ts
path: COL_WHAT
render: Product pages, COL_WHAT
narrative_slot: utility
en: What happens
th: เกิดอะไรขึ้นบ้าง
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: e38860f285d5f448ebd779805cf97b2b91a1a50337a6acb1b91ffed7f4c98d14
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::COL_WHO`

```yaml
id: src/lib/content/products.ts::COL_WHO
source: src/lib/content/products.ts
path: COL_WHO
render: Product pages, COL_WHO
narrative_slot: utility
en: Who it is for
th: เหมาะกับใคร
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: 1b2a5c629ccbe3bc534b83fb5b016ad16fb5cbad8d1dd001492ea1c952cd1487
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::COMING_SOON`

```yaml
id: src/lib/content/products.ts::COMING_SOON
source: src/lib/content/products.ts
path: COMING_SOON
render: Product pages, COMING_SOON
narrative_slot: utility
en: Not open yet. Message me and I will tell you when it is.
th: ตอนนี้ยังไม่เปิดให้ใช้งาน ทักมาหาผมได้ แล้วผมจะแจ้งให้คุณรู้เมื่อเปิด
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's wording, 23/08/2026.
review:
  structural_calque: pass
  text_hash: 9e079d0dd4aa2ac6140960ba7cc2da9993e98fc50e7dd5a538c7bb0dd03827a8
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::HOW_HEADING`

```yaml
id: src/lib/content/products.ts::HOW_HEADING
source: src/lib/content/products.ts
path: HOW_HEADING
render: Product pages, HOW_HEADING
narrative_slot: utility
en: How it works
th: บริการนี้ทำงานอย่างไร
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's wording, 23/08/2026.
review:
  structural_calque: pass
  text_hash: 252fd935c8dae450f3bcccb0c9b7bdaf554f2a4048f7a9ba88ff3e0000464988
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::INDEX_EYEBROW`

```yaml
id: src/lib/content/products.ts::INDEX_EYEBROW
source: src/lib/content/products.ts
path: INDEX_EYEBROW
render: Product pages, INDEX_EYEBROW
narrative_slot: utility
en: Everything PunProfile makes
th: เครื่องมือและบริการทั้งหมดจาก PunProfile
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: Paul's wording, 06/09/2026.
review:
  structural_calque: pass
  text_hash: ab6126b2d8d2b27e437dc337a816b0d5df4873a106f08cf7192a8766f7332378
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::INDEX_HEADING`

```yaml
id: src/lib/content/products.ts::INDEX_HEADING
source: src/lib/content/products.ts
path: INDEX_HEADING
render: Product pages, INDEX_HEADING
narrative_slot: utility
en: Five tools and one conversation, in the order most people take them
th: เครื่องมือห้าอย่างและการพูดคุยกับโค้ชอีกหนึ่งแบบ เรียงตามลำดับที่คนส่วนใหญ่มักใช้
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: Paul's wording, 06/09/2026.
review:
  structural_calque: pass
  text_hash: 1fb894badf46d96455f0478e8f98c9765e9ce6bce73c1146df940aff44514595
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::INDEX_INTRO`

```yaml
id: src/lib/content/products.ts::INDEX_INTRO
source: src/lib/content/products.ts
path: INDEX_INTRO
render: Product pages, INDEX_INTRO
narrative_slot: utility
en: >-
  Start wherever you are. Nothing here needs the one before it, and the first two ask for nothing but your
  answers.
th: >-
  เริ่มจากจุดที่คุณอยู่ตอนนี้ได้เลย แต่ละอย่างใช้แยกกันได้ ไม่จำเป็นต้องทำอันก่อนหน้า
  และสองอย่างแรกต้องการเพียงคำตอบจากคุณ
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: Paul's wording, 06/09/2026.
review:
  structural_calque: pass
  text_hash: 45ac6d86c5af5db999c9cdbfbb947a706857f431a7411f62969968295e7cd9b7
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::INDEX_PATH_HEADING`

```yaml
id: src/lib/content/products.ts::INDEX_PATH_HEADING
source: src/lib/content/products.ts
path: INDEX_PATH_HEADING
render: Product pages, INDEX_PATH_HEADING
narrative_slot: utility
en: How they fit together
th: แต่ละอย่างทำงานร่วมกันอย่างไร
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: Paul's wording, 06/09/2026.
review:
  structural_calque: pass
  text_hash: 49361297e9e302ee670156987e12e697cc7582b2848705e1ec95f153774c92e9
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::INDEX_PATH_LEDE`

```yaml
id: src/lib/content/products.ts::INDEX_PATH_LEDE
source: src/lib/content/products.ts
path: INDEX_PATH_LEDE
render: Product pages, INDEX_PATH_LEDE
narrative_slot: utility
en: Each one answers the question the one before it leaves you holding.
th: แต่ละอย่างช่วยตอบคำถามที่อันก่อนหน้าทิ้งไว้
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: Paul's wording, 06/09/2026.
review:
  structural_calque: pass
  text_hash: 81219abc1ed0de6c2f3647577132fd2718c52ead581ce3a898d03c0c61bfaca1
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::INDEX_TABLE_HEADING`

```yaml
id: src/lib/content/products.ts::INDEX_TABLE_HEADING
source: src/lib/content/products.ts
path: INDEX_TABLE_HEADING
render: Product pages, INDEX_TABLE_HEADING
narrative_slot: utility
en: Side by side
th: เปรียบเทียบกันชัด ๆ
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: Paul's wording, 06/09/2026.
review:
  structural_calque: pass
  text_hash: c93517d41302af880cb41e04f75c1c40d3717f0c3ecddf14dc274fd1d187b932
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::LIMIT_HEADING`

```yaml
id: src/lib/content/products.ts::LIMIT_HEADING
source: src/lib/content/products.ts
path: LIMIT_HEADING
render: Product pages, LIMIT_HEADING
narrative_slot: utility
en: What it does not do
th: สิ่งที่บริการนี้ไม่ได้ทำ
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: Drafted 23/08/2026, read back and approved unchanged.
review:
  structural_calque: pass
  text_hash: 61085714bb8fce91fa331b9e2f96cd150124c760cf7a876abdd1c6ab02d7aa3e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::NOT_A_TOOL_BODY`

```yaml
id: src/lib/content/products.ts::NOT_A_TOOL_BODY
source: src/lib/content/products.ts
path: NOT_A_TOOL_BODY
render: Product pages, NOT_A_TOOL_BODY
narrative_slot: utility
en: >-
  Everything above reads what you already have. The coaching is where we decide what to do about it, and it is
  the engagement every client starts with.
th: >-
  เครื่องมือทั้งหมดด้านบนอ่านสิ่งที่คุณมีอยู่แล้ว
  ส่วนการโค้ชคือพื้นที่ที่เราช่วยกันตัดสินใจว่าจะทำอะไรกับสิ่งที่พบ และเป็นจุดเริ่มต้นของลูกค้าทุกคน
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: Paul's wording, 06/09/2026.
review:
  structural_calque: pass
  text_hash: a6e83349e3b2efb49ac3282735fe48275fe4a73c88a996426f1ca39c5a26e0d3
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::NOT_A_TOOL_HEADING`

```yaml
id: src/lib/content/products.ts::NOT_A_TOOL_HEADING
source: src/lib/content/products.ts
path: NOT_A_TOOL_HEADING
render: Product pages, NOT_A_TOOL_HEADING
narrative_slot: utility
en: And the part that is not a tool
th: และส่วนที่ไม่ใช่เครื่องมือ
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: 936805a8ee892866e4740bab80385b4f8877b2e9ef86c421325a2ecf067c8cab
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCT_ART.cv-check.alt`

```yaml
id: src/lib/content/products.ts::PRODUCT_ART.cv-check.alt
source: src/lib/content/products.ts
path: PRODUCT_ART.cv-check.alt
render: Product pages, PRODUCT_ART.cv-check.alt
narrative_slot: utility
en: A page of a CV with the top third marked out from the rest
th: CV หนึ่งหน้า โดยทำเครื่องหมายแยกส่วนหนึ่งในสามด้านบนออกจากส่วนที่เหลือ
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: Paul's wording, 06/09/2026.
review:
  structural_calque: pass
  text_hash: 67218ebf0e251fccaa04d69231e878551abec7e6e8ead929688e5a6a76bddc3d
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCT_ART.eu-fit-check.alt`

```yaml
id: src/lib/content/products.ts::PRODUCT_ART.eu-fit-check.alt
source: src/lib/content/products.ts
path: PRODUCT_ART.eu-fit-check.alt
render: Product pages, PRODUCT_ART.eu-fit-check.alt
narrative_slot: utility
en: Four bars of different heights, one per gate, with the shortest marked
th: แท่งกราฟสี่แท่งความสูงต่างกัน แทนด่านทั้งสี่ โดยแท่งที่สั้นที่สุดถูกทำเครื่องหมายไว้
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: |-
  Read back 06/09/2026. Describes what the drawing shows and nothing

  about what it means, which is the rule `PORTRAIT_ALT` in `coaching.ts`

  already follows.
review:
  structural_calque: pass
  text_hash: 9e96df95eb336cab606c880a19b42fda9a55d6ee79f2735f6ad9ea4e22726a47
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCT_ART.fit-report.alt`

```yaml
id: src/lib/content/products.ts::PRODUCT_ART.fit-report.alt
source: src/lib/content/products.ts
path: PRODUCT_ART.fit-report.alt
render: Product pages, PRODUCT_ART.fit-report.alt
narrative_slot: artefact
en: A report laid out as a chart above four rows of findings
th: หน้ารายงานที่มีกราฟด้านบน และผลการประเมินสี่แถวด้านล่าง
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: Paul's wording, 06/09/2026.
review:
  structural_calque: pass
  text_hash: 88092007510863d15e1966b11d120961684f6451e8283dfcc73c1a0a5885c05b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCT_ART.guided-job-hunt.alt`

```yaml
id: src/lib/content/products.ts::PRODUCT_ART.guided-job-hunt.alt
source: src/lib/content/products.ts
path: PRODUCT_ART.guided-job-hunt.alt
render: Product pages, PRODUCT_ART.guided-job-hunt.alt
narrative_slot: utility
en: Four columns of a tracker, from saved through to offer
th: กระดานติดตามการสมัครงานสี่คอลัมน์ ตั้งแต่ตำแหน่งที่เก็บไว้จนถึงข้อเสนอจ้างงาน
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: 2574b14aebe721f58a5ca88f8ce03e0932ef02d0a13d48b389507b6af09fa0ce
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCT_ART.matched-jobs.alt`

```yaml
id: src/lib/content/products.ts::PRODUCT_ART.matched-jobs.alt
source: src/lib/content/products.ts
path: PRODUCT_ART.matched-jobs.alt
render: Product pages, PRODUCT_ART.matched-jobs.alt
narrative_slot: utility
en: Three role cards, one of them marked as the one that matches
th: การ์ดตำแหน่งงานสามใบ โดยใบหนึ่งถูกทำเครื่องหมายว่าตรงกับโปรไฟล์
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: 709c5b253ed7891bc5539df88f65f0a31ba0c93426720e0e60b7b784b8dfdd0e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[0].audience`

```yaml
id: src/lib/content/products.ts::PRODUCTS[0].audience
source: src/lib/content/products.ts
path: PRODUCTS[0].audience
render: Product pages, PRODUCTS[0].audience
narrative_slot: audience
en: For anyone weighing up a move to Europe
th: คนที่กำลังคิดเรื่องไปทำงานในยุโรป
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 1e17465bd78fd8557572cf2e89acd03361a191de2892e2d497bc6517e06dc176
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[0].faq[0].a`

```yaml
id: src/lib/content/products.ts::PRODUCTS[0].faq[0].a
source: src/lib/content/products.ts
path: PRODUCTS[0].faq[0].a
render: Product pages, PRODUCTS[0].faq[0].a
narrative_slot: utility
en: Because we do not guess a score for something a form cannot measure.
th: เพราะเราไม่เดาคะแนนในเรื่องที่แบบฟอร์มวัดไม่ได้
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 4ac6659a98709ade2262691df86a09cb525983671a53237a7340437b799990b1
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[0].faq[0].q`

```yaml
id: src/lib/content/products.ts::PRODUCTS[0].faq[0].q
source: src/lib/content/products.ts
path: PRODUCTS[0].faq[0].q
render: Product pages, PRODUCTS[0].faq[0].q
narrative_slot: utility
en: Why are parts of my chart empty?
th: ทำไมกราฟบางส่วนถึงว่างอยู่
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 9e9a6952675211ac1c35ce4b0594170fd6e3e6f01fb39d42533d72588f06de4c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[0].faq[1].a`

```yaml
id: src/lib/content/products.ts::PRODUCTS[0].faq[1].a
source: src/lib/content/products.ts
path: PRODUCTS[0].faq[1].a
render: Product pages, PRODUCTS[0].faq[1].a
narrative_slot: utility
en: Yes. You can go back and change an answer at any point, and the chart updates straight away.
th: ได้ คุณย้อนกลับไปแก้คำตอบได้ตลอด กราฟจะอัปเดตตามคำตอบใหม่ให้ทันที
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 557aab42165d22f6f978856b2464f922e7451ad00df031255838d8e7233f37a4
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[0].faq[1].q`

```yaml
id: src/lib/content/products.ts::PRODUCTS[0].faq[1].q
source: src/lib/content/products.ts
path: PRODUCTS[0].faq[1].q
render: Product pages, PRODUCTS[0].faq[1].q
narrative_slot: utility
en: Can I change an answer, or take it again?
th: แก้คำตอบหรือทำใหม่ได้ไหม
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c045967d24f00345d88ece595c942e4c8b490b72758986e0446f4fd7027d6a76
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[0].how[0]`

```yaml
id: src/lib/content/products.ts::PRODUCTS[0].how[0]
source: src/lib/content/products.ts
path: PRODUCTS[0].how[0]
render: Product pages, PRODUCTS[0].how[0]
narrative_slot: mechanism
en: It takes about 2 minutes, and the moment you finish you see your first read and your own chart.
th: ใช้เวลาประมาณ 2 นาที พอทำเสร็จ คุณจะเห็นผลเบื้องต้นและกราฟของตัวเองทันที
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's own Thai, `faq.ts`.
review:
  structural_calque: pass
  text_hash: 8cd8d75f3158c77c9c09c0cbe13c0ad8c65d92105313fff87c7faff6bca5da78
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[0].how[1]`

```yaml
id: src/lib/content/products.ts::PRODUCTS[0].how[1]
source: src/lib/content/products.ts
path: PRODUCTS[0].how[1]
render: Product pages, PRODUCTS[0].how[1]
narrative_slot: mechanism
en: Answer on your phone, and get your first read the moment you finish.
th: ตอบคำถามบนมือถือได้เลย รับผลเบื้องต้นทันทีเมื่อทำเสร็จ
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's own Thai, 23/08/2026, from the pricing sheet.
review:
  structural_calque: pass
  text_hash: 88a12762ca731c94f619fac44052367f2c872f69f2373763f9f8b22d2b703e6c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[0].how[2]`

```yaml
id: src/lib/content/products.ts::PRODUCTS[0].how[2]
source: src/lib/content/products.ts
path: PRODUCTS[0].how[2]
render: Product pages, PRODUCTS[0].how[2]
narrative_slot: mechanism
en: No. The EU Fit Check is free, and there is no payment step in it.
th: ไม่มีค่าใช้จ่าย คุณทำ EU Fit Check ได้ฟรี และไม่มีขั้นตอนการชำระเงิน
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's own Thai, `faq.ts`.
review:
  structural_calque: pass
  text_hash: 82a995ccbbda243fde7518117702fb4cf67f326455cf8083ba3aeaa55689d04c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[0].howLede`

```yaml
id: src/lib/content/products.ts::PRODUCTS[0].howLede
source: src/lib/content/products.ts
path: PRODUCTS[0].howLede
render: Product pages, PRODUCTS[0].howLede
narrative_slot: mechanism
en: Seventeen questions on your phone, and a first read the moment you finish.
th: คำถาม 17 ข้อบนมือถือ พร้อมผลเบื้องต้นทันทีที่คุณทำเสร็จ
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 3925c6e792cb3217c98826d42bd139105d5df080132b726143bb5bec2f4c1545
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[0].lede`

```yaml
id: src/lib/content/products.ts::PRODUCTS[0].lede
source: src/lib/content/products.ts
path: PRODUCTS[0].lede
render: Product pages, PRODUCTS[0].lede
narrative_slot: utility
en: Under 2 minutes. Your first read straight away, with no sign-up.
th: ใช้เวลาไม่ถึง 2 นาที รู้ผลเบื้องต้นทันที ไม่ต้องสมัครสมาชิก
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's own Thai, `copy.ts` landing.reassurance.
review:
  structural_calque: pass
  text_hash: 65ab7984c21b6038acf645820dfc75132a67cd12d5365d80265171de15141c90
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[0].limit`

```yaml
id: src/lib/content/products.ts::PRODUCTS[0].limit
source: src/lib/content/products.ts
path: PRODUCTS[0].limit
render: Product pages, PRODUCTS[0].limit
narrative_slot: limit
en: We do not guess a score for something a form cannot measure.
th: เพราะเราไม่เดาคะแนนในเรื่องที่แบบฟอร์มวัดไม่ได้
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: |-
  Paul's own Thai, `faq.ts`. It is the honesty rule in his own words and it

  belongs on this page more than anywhere else.
review:
  structural_calque: pass
  text_hash: b3828f6b4e7aa6b4860113b2793d6e6f53051f240bb14748a4cee17e3c53b55e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[0].name`

```yaml
id: src/lib/content/products.ts::PRODUCTS[0].name
source: src/lib/content/products.ts
path: PRODUCTS[0].name
render: Product pages, PRODUCTS[0].name
narrative_slot: utility
en: EU Fit Check
th: EU Fit Check
provenance: paul-approved
date: 23/08/2026
term_bindings:
  - product-eu-fit-check
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 7ae9e3e4001863e709a469f1869c47b8f8c2602e150e67572122b07756d09f9f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[1].audience`

```yaml
id: src/lib/content/products.ts::PRODUCTS[1].audience
source: src/lib/content/products.ts
path: PRODUCTS[1].audience
render: Product pages, PRODUCTS[1].audience
narrative_slot: audience
en: For anyone whose CV was written for the Thai market
th: คนที่เขียน CV ไว้สำหรับตลาดไทย
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 150f97fa3bdcc552d7ff9ab3322cf7e9bb52c78b91667a46fff3d1d06de145d1
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[1].faq[0].a`

```yaml
id: src/lib/content/products.ts::PRODUCTS[1].faq[0].a
source: src/lib/content/products.ts
path: PRODUCTS[1].faq[0].a
render: Product pages, PRODUCTS[1].faq[0].a
narrative_slot: utility
en: No. The CV Check is free.
th: ไม่มีค่าใช้จ่าย CV Check ใช้ฟรี
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's wording, 23/08/2026.
review:
  structural_calque: pass
  text_hash: 45c904baa797b004d6b4accbc69d5bc383ca42dd16e9a86f12eddcbbab7c61db
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[1].faq[0].q`

```yaml
id: src/lib/content/products.ts::PRODUCTS[1].faq[0].q
source: src/lib/content/products.ts
path: PRODUCTS[1].faq[0].q
render: Product pages, PRODUCTS[1].faq[0].q
narrative_slot: utility
en: Does it cost anything?
th: มีค่าใช้จ่ายไหม
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 3867b4ff9ebd8cb5cbc19e0f222183801f6d65242d00cf6fe3804baa0aa1a1a2
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[1].headline`

```yaml
id: src/lib/content/products.ts::PRODUCTS[1].headline
source: src/lib/content/products.ts
path: PRODUCTS[1].headline
render: Product pages, PRODUCTS[1].headline
narrative_slot: utility
en: A CV that works in the Thai market can leave a European reader unable to see your strengths.
th: CV ที่ใช้ได้ดีในตลาดไทย อาจทำให้คนในตลาดยุโรปมองไม่เห็นจุดแข็งของคุณ
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's wording, 23/08/2026.
review:
  structural_calque: pass
  text_hash: a301c3df3fd73f0d3c6f4523858407372f2c356c83e6176dd0e7293739ed4872
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[1].how[0]`

```yaml
id: src/lib/content/products.ts::PRODUCTS[1].how[0]
source: src/lib/content/products.ts
path: PRODUCTS[1].how[0]
render: Product pages, PRODUCTS[1].how[0]
narrative_slot: mechanism
en: >-
  What the first third of the page spends itself on, because a screener and a reader both start at the top and
  both stop early.
th: >-
  ดูว่าหนึ่งในสามแรกของหน้าใช้พื้นที่ไปกับอะไร เพราะทั้งระบบคัดกรองและคนอ่านต่างเริ่มจากด้านบน
  และอาจหยุดอ่านตั้งแต่เนิ่น ๆ
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 23/08/2026. The reading-order opener from the Kick-start

  run sheet, which exists because the ATS artefact only shows up when a CV

  parses badly and the first real CV parsed cleanly.
review:
  structural_calque: pass
  text_hash: 873281751a939d735b9221da3e7c2d64eca4e30f343118fc28770af2d458042e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[1].how[1]`

```yaml
id: src/lib/content/products.ts::PRODUCTS[1].how[1]
source: src/lib/content/products.ts
path: PRODUCTS[1].how[1]
render: Product pages, PRODUCTS[1].how[1]
narrative_slot: mechanism
en: Whether your employers and job titles mean anything to someone who does not know the Thai market.
th: เช็กว่าชื่อบริษัทและชื่อตำแหน่งของคุณสื่อความหมายกับคนที่ไม่รู้จักตลาดงานไทยหรือไม่
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 23/08/2026. This is the core claim in `10_Methodology.md`:

  illegibility rather than capability. A Bangkok senior title may read as

  mid-level and a well-known Thai employer reads as an unknown one.
review:
  structural_calque: pass
  text_hash: 3300a62d461a434cfd000f7d225583668b327893d9165c42fe057b1b4c42ca6b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[1].how[2]`

```yaml
id: src/lib/content/products.ts::PRODUCTS[1].how[2]
source: src/lib/content/products.ts
path: PRODUCTS[1].how[2]
render: Product pages, PRODUCTS[1].how[2]
narrative_slot: mechanism
en: Where you have written duties when the market is reading for results.
th: ชี้จุดที่เขียนเป็นหน้าที่ความรับผิดชอบ ทั้งที่ควรเขียนเป็นผลลัพธ์
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: Drafted 23/08/2026, read back and approved unchanged.
review:
  structural_calque: pass
  text_hash: 41f14d9690f56aff08a3ef54a8c3850b86d275ac1210751c07939cc359ccfb95
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[1].howLede`

```yaml
id: src/lib/content/products.ts::PRODUCTS[1].howLede
source: src/lib/content/products.ts
path: PRODUCTS[1].howLede
render: Product pages, PRODUCTS[1].howLede
narrative_slot: mechanism
en: We read your CV the way a European reader does, and list what to fix.
th: เราอ่าน CV ของคุณแบบเดียวกับคนอ่านในยุโรป แล้วบอกว่าควรแก้จุดไหนบ้าง
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 9eebbb7dc409ca7557e0b4f6122dad13a68e5d5f9ef146a22fcd677dfc0f8d6a
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[1].lede`

```yaml
id: src/lib/content/products.ts::PRODUCTS[1].lede
source: src/lib/content/products.ts
path: PRODUCTS[1].lede
render: Product pages, PRODUCTS[1].lede
narrative_slot: utility
en: Upload your CV and see how much of your profile a European reader can actually understand. Free.
th: อัปโหลด CV แล้วดูว่าคนในตลาดยุโรปเข้าใจโปรไฟล์ของคุณได้มากแค่ไหน ใช้ฟรี
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's wording, 23/08/2026.
review:
  structural_calque: pass
  text_hash: b92cbbe7434f85d024b73e89f476c267af59701b87f7f6b0e28a837d135d51f5
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[1].limit`

```yaml
id: src/lib/content/products.ts::PRODUCTS[1].limit
source: src/lib/content/products.ts
path: PRODUCTS[1].limit
render: Product pages, PRODUCTS[1].limit
narrative_slot: limit
en: We do not rewrite your CV. What you get is a list of what to fix, and why each one matters.
th: เราไม่เขียน CV ใหม่ให้คุณ สิ่งที่ได้คือรายการจุดที่ควรแก้ พร้อมเหตุผลของแต่ละจุด
provenance: paul-approved
date: 04/08/2026
term_bindings: []
decision_note: |-
  Drafted 23/08/2026, read back and approved unchanged, and this line is a standing decision rather
  than a caveat. **The app does not rewrite CVs**, decided by Paul on
  04/08/2026 and recorded in `competitive-reference.md` as the one thing
  explicitly not taken from the nearest competitor. A checker reads and
  scores. The difference has to hold in the copy as well as the code.
review:
  structural_calque: pass
  text_hash: f189fc2ba09a4bf9c8a7fd50e0ca0a16a8fcef132cf3eec5cb96d81cc3f10a12
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[1].name`

```yaml
id: src/lib/content/products.ts::PRODUCTS[1].name
source: src/lib/content/products.ts
path: PRODUCTS[1].name
render: Product pages, PRODUCTS[1].name
narrative_slot: utility
en: CV Check
th: CV Check
provenance: paul-approved
date: 23/08/2026
term_bindings:
  - product-cv-check
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 763af023d3f2ca172d8bcec349705590ec8e8dd3c8ecb318a3df57bbef653aaa
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[2].audience`

```yaml
id: src/lib/content/products.ts::PRODUCTS[2].audience
source: src/lib/content/products.ts
path: PRODUCTS[2].audience
render: Product pages, PRODUCTS[2].audience
narrative_slot: audience
en: For anyone who wants the full read, not the summary
th: คนที่อยากได้ผลแบบเต็ม ไม่ใช่แค่สรุป
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 7ccfc4558622aafaa87f1e48394ce2563bc3b7c96d5c13e288a30e11458c7de1
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[2].faq[0].a`

```yaml
id: src/lib/content/products.ts::PRODUCTS[2].faq[0].a
source: src/lib/content/products.ts
path: PRODUCTS[2].faq[0].a
render: Product pages, PRODUCTS[2].faq[0].a
narrative_slot: utility
en: The free read shows you where you stand. This one names the gate and sequences the work.
th: ผลเบื้องต้นบอกว่าคุณอยู่ขั้นไหน ส่วนฉบับเต็มบอกว่าด่านไหนยังไม่ผ่าน และควรทำอะไรตามลำดับ
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's wording, 23/08/2026.
review:
  structural_calque: pass
  text_hash: c0d6757dceee83cd753ba016a270a1d7c982fc97fae0bff78e187b68cafce626
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[2].faq[0].q`

```yaml
id: src/lib/content/products.ts::PRODUCTS[2].faq[0].q
source: src/lib/content/products.ts
path: PRODUCTS[2].faq[0].q
render: Product pages, PRODUCTS[2].faq[0].q
narrative_slot: utility
en: How is this different from the free result?
th: ต่างจากผลเบื้องต้นที่ได้ฟรีอย่างไร
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 64dffb12429ef0411d880c14241dab0a70207cff0a093c0bdebef28f14966e84
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[2].headline`

```yaml
id: src/lib/content/products.ts::PRODUCTS[2].headline
source: src/lib/content/products.ts
path: PRODUCTS[2].headline
render: Product pages, PRODUCTS[2].headline
narrative_slot: utility
en: You know which stage you are at. The next question is what to do first.
th: รู้ว่าตัวเองอยู่ขั้นไหนแล้ว คำถามต่อไปคือควรลงมือทำอะไรก่อน
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: |-
  Drafted 23/08/2026, read back and approved unchanged. `อยู่ขั้นไหน` is Paul's own correction on the

  pinned post of 14/08/2026, where he changed อยู่ตรงไหน to อยู่ขั้นไหน:

  progress is a stage you are at, not a place you are in.
review:
  structural_calque: pass
  text_hash: b33bce90b94e058f268373267c98620a395d130aad7ae77bbfc35349b9a20049
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[2].how[0]`

```yaml
id: src/lib/content/products.ts::PRODUCTS[2].how[0]
source: src/lib/content/products.ts
path: PRODUCTS[2].how[0]
render: Product pages, PRODUCTS[2].how[0]
narrative_slot: mechanism
en: All four scores against the bars the European market actually uses, rather than four numbers on their own.
th: เทียบคะแนนทั้งสี่ด้านกับเกณฑ์ที่ตลาดยุโรปใช้จริง ไม่ใช่แค่ตัวเลขลอย ๆ
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: |-
  Drafted 23/08/2026, read back and approved unchanged. Thresholds rather than scores, which

  `10_Methodology.md` calls the single most important idea in the method.
review:
  structural_calque: pass
  text_hash: cb3795be96b119a2d9830310f107dfc9d7c289bda8904d134cc54b59a2c73eaf
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[2].how[1]`

```yaml
id: src/lib/content/products.ts::PRODUCTS[2].how[1]
source: src/lib/content/products.ts
path: PRODUCTS[2].how[1]
render: Product pages, PRODUCTS[2].how[1]
narrative_slot: mechanism
en: Which gate you have not cleared, and why you should start with that one.
th: บอกว่าคุณยังไม่ผ่านด่านไหน และทำไมจึงควรเริ่มจากด่านนั้นก่อน
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 23/08/2026. Gates are cleared in dependency order, not

  score order, and the lowest uncleared one is the only one that matters

  this month.
review:
  structural_calque: pass
  text_hash: f2949a233340c29e409cf18b65c474ae1c0b6e279d6d7f9d9f5a2f6485d25048
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[2].how[2]`

```yaml
id: src/lib/content/products.ts::PRODUCTS[2].how[2]
source: src/lib/content/products.ts
path: PRODUCTS[2].how[2]
render: Product pages, PRODUCTS[2].how[2]
narrative_slot: mechanism
en: A sequence of what to do, ordered by what moves the result soonest.
th: จัดลำดับสิ่งที่ควรทำ โดยเริ่มจากสิ่งที่จะช่วยให้คุณเห็นผลได้เร็วที่สุด
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's wording, 23/08/2026.
review:
  structural_calque: pass
  text_hash: 5eec16ed5bb3b4202822590c08559d28eef7e0089daf5203f117a540c7bef81f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[2].howLede`

```yaml
id: src/lib/content/products.ts::PRODUCTS[2].howLede
source: src/lib/content/products.ts
path: PRODUCTS[2].howLede
render: Product pages, PRODUCTS[2].howLede
narrative_slot: mechanism
en: All four scores against the market's own bars, and what to do first.
th: คะแนนทั้งสี่ด้านเทียบกับเกณฑ์ที่ตลาดใช้จริง พร้อมบอกว่าควรเริ่มจากอะไร
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 2b52a14a2d84c57edc658dcaa71d2e17688258278912c06dab2da4c1ef7a3cd2
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[2].lede`

```yaml
id: src/lib/content/products.ts::PRODUCTS[2].lede
source: src/lib/content/products.ts
path: PRODUCTS[2].lede
render: Product pages, PRODUCTS[2].lede
narrative_slot: utility
en: The full EU Fit Check result as a document you keep and plan the next step with.
th: ผลประเมินฉบับเต็มจาก EU Fit Check ในรูปแบบเอกสารที่คุณเก็บไว้ใช้ในการวางแผนขั้นต่อไปได้
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Rebuilt from Paul's own Thai of 23/08/2026 on the pricing sheet.
review:
  structural_calque: pass
  text_hash: 5488d404c79d1bd5e3410ad959ad6e5f4ff8b0a2984f20d01765372298493a3e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[2].limit`

```yaml
id: src/lib/content/products.ts::PRODUCTS[2].limit
source: src/lib/content/products.ts
path: PRODUCTS[2].limit
render: Product pages, PRODUCTS[2].limit
narrative_slot: limit
en: The document tells you what to do. It does not do it for you.
th: เอกสารนี้บอกว่าควรทำอะไร แต่ไม่ได้ลงมือทำแทนคุณ
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: Drafted 23/08/2026, read back and approved unchanged.
review:
  structural_calque: pass
  text_hash: 35bce5897fe97bcc6c0cf69a3fec2540b3fa7838611c6e9359378d632ac4d45a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[2].name`

```yaml
id: src/lib/content/products.ts::PRODUCTS[2].name
source: src/lib/content/products.ts
path: PRODUCTS[2].name
render: Product pages, PRODUCTS[2].name
narrative_slot: utility
en: Fit Report
th: Fit Report
provenance: paul-approved
date: 23/08/2026
term_bindings:
  - product-fit-report
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 899b32eb43aa35737948310d7d8d389bddf837a171fb03522711b719b93178cf
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[3].audience`

```yaml
id: src/lib/content/products.ts::PRODUCTS[3].audience
source: src/lib/content/products.ts
path: PRODUCTS[3].audience
render: Product pages, PRODUCTS[3].audience
narrative_slot: audience
en: For anyone tired of scrolling job boards
th: คนที่เหนื่อยกับการไล่หาประกาศงานเอง
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 7e5a1767c143defbfcbd8a86abb23b76d8a508161a14c195c9bbfa00103c3ee8
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[3].faq[0].a`

```yaml
id: src/lib/content/products.ts::PRODUCTS[3].faq[0].a
source: src/lib/content/products.ts
path: PRODUCTS[3].faq[0].a
render: Product pages, PRODUCTS[3].faq[0].a
narrative_slot: utility
en: We keep looking, and a token is only deducted once a role matching your criteria has reached you.
th: เราจะค้นหาต่อให้ และหักโทเคนเฉพาะเมื่อมีตำแหน่งที่ตรงกับเงื่อนไขส่งถึงคุณแล้ว
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 23/08/2026. Deliberately does not say real time: the

  mechanism will be batched, and a promise of real time is a claim the

  system does not meet.
review:
  structural_calque: pass
  text_hash: 95f4e4c75bd51b126d6f6257c7e70fa61930fe16f5b36e1d40f42f00b3b18214
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[3].faq[0].q`

```yaml
id: src/lib/content/products.ts::PRODUCTS[3].faq[0].q
source: src/lib/content/products.ts
path: PRODUCTS[3].faq[0].q
render: Product pages, PRODUCTS[3].faq[0].q
narrative_slot: utility
en: What if nothing matches?
th: ถ้ารอบไหนไม่มีตำแหน่งที่ตรงเลย
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 711b6950cea77071ed3ec1e8338a7fa2f9a3832ee73923c8d90c42e7eca670ad
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[3].headline`

```yaml
id: src/lib/content/products.ts::PRODUCTS[3].headline
source: src/lib/content/products.ts
path: PRODUCTS[3].headline
render: Product pages, PRODUCTS[3].headline
narrative_slot: utility
en: There are plenty of roles in Europe. There are not many you can actually apply for.
th: ตำแหน่งงานในยุโรปมีเยอะ แต่ที่คุณสมัครได้จริงมีไม่กี่ตำแหน่ง
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: Drafted 23/08/2026, read back and approved unchanged.
review:
  structural_calque: pass
  text_hash: b9cb622f88ae869219b500acf455bc02d27908d1326853c1ff9ecbfe5407225f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[3].how[0]`

```yaml
id: src/lib/content/products.ts::PRODUCTS[3].how[0]
source: src/lib/content/products.ts
path: PRODUCTS[3].how[0]
render: Product pages, PRODUCTS[3].how[0]
narrative_slot: mechanism
en: 'You set the criteria: the field, the countries, the language, the level of role you want.'
th: คุณเป็นคนกำหนดเงื่อนไขเอง ทั้งสายงาน ประเทศ ภาษา และระดับตำแหน่งที่ต้องการ
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's wording, 23/08/2026.
review:
  structural_calque: pass
  text_hash: 989186ef27453655adcb63250f71e396a48800760c0973fad6faf4047eb5c189
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[3].how[1]`

```yaml
id: src/lib/content/products.ts::PRODUCTS[3].how[1]
source: src/lib/content/products.ts
path: PRODUCTS[3].how[1]
render: Product pages, PRODUCTS[3].how[1]
narrative_slot: mechanism
en: One role at a time, so you have the time to look at each one properly.
th: ส่งให้ทีละตำแหน่ง เพื่อให้คุณมีเวลาดูแต่ละงานจริง ๆ
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 23/08/2026. One at a time is the method's own rule

  against handing anyone a five-item list, applied to job search.
review:
  structural_calque: pass
  text_hash: 3ab0120e197f71b9975f531e9a707bd95e9ce8f56523d55104c0efa9e8bed2d9
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[3].how[2]`

```yaml
id: src/lib/content/products.ts::PRODUCTS[3].how[2]
source: src/lib/content/products.ts
path: PRODUCTS[3].how[2]
render: Product pages, PRODUCTS[3].how[2]
narrative_slot: mechanism
en: Every role says plainly whether it needs work rights you already hold, before you spend time applying.
th: ทุกตำแหน่งระบุชัดว่าต้องมีสิทธิ์ทำงานอยู่แล้วหรือไม่ ก่อนที่คุณจะเสียเวลาในการสมัคร
provenance: paul-approved
date: 22/08/2026
term_bindings: []
decision_note: |-
  Drafted 23/08/2026, read back and approved unchanged. Work rights sit outside the match bar and are

  always stated, decided 22/08/2026, using the pipeline's own

  "Publish (Work Rights Required)" verdict whose rule is that the label is

  not optional and not a footnote.
review:
  structural_calque: pass
  text_hash: a961b876ff46ce3d9ad8fad8286c68ad414ba4efcc15d87de1d1ced7ce58fae4
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[3].howLede`

```yaml
id: src/lib/content/products.ts::PRODUCTS[3].howLede
source: src/lib/content/products.ts
path: PRODUCTS[3].howLede
render: Product pages, PRODUCTS[3].howLede
narrative_slot: mechanism
en: You set the criteria, we screen against them and send one role at a time.
th: คุณกำหนดเงื่อนไข เราคัดกรองให้ตามนั้น แล้วส่งให้ทีละตำแหน่ง
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: ae6d52b68b16c70fc621496891bba05a82509bec21165b36025f93b21445dabf
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[3].lede`

```yaml
id: src/lib/content/products.ts::PRODUCTS[3].lede
source: src/lib/content/products.ts
path: PRODUCTS[3].lede
render: Product pages, PRODUCTS[3].lede
narrative_slot: utility
en: We screen roles against the criteria you set and send them to your email, one at a time.
th: เราคัดตำแหน่งงานที่ตรงกับเงื่อนไขของคุณ แล้วส่งตรงถึงอีเมลทีละตำแหน่ง
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's own Thai of 23/08/2026, from the pricing sheet.
review:
  structural_calque: pass
  text_hash: a0a2c48af37eb63ab0828997781391becb6af1dd7034bcb1d13b6ab8f4cb41a1
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[3].limit`

```yaml
id: src/lib/content/products.ts::PRODUCTS[3].limit
source: src/lib/content/products.ts
path: PRODUCTS[3].limit
render: Product pages, PRODUCTS[3].limit
narrative_slot: limit
en: We are not a recruitment agency. Applying is still yours.
th: เราไม่ใช่บริษัทจัดหางาน และคุณยังต้องเป็นคนสมัครด้วยตัวเอง
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 23/08/2026. Paul's own FAQ makes the same point: PunProfile

  takes its fee from the candidate rather than the employer, so there is no

  quota and no role anyone is pushed toward.
review:
  structural_calque: pass
  text_hash: 95d18baff01c390646a2ddbd8c4c72ea0aa966c4aca516bdc909b343697a3e2c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[3].name`

```yaml
id: src/lib/content/products.ts::PRODUCTS[3].name
source: src/lib/content/products.ts
path: PRODUCTS[3].name
render: Product pages, PRODUCTS[3].name
narrative_slot: utility
en: Matched Jobs
th: Matched Jobs
provenance: paul-approved
date: 23/08/2026
term_bindings:
  - product-matched-jobs
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c1465efef0ce201aef0edc88423adcb5db8310968c1746cd882c7320cc0bb75d
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[4].audience`

```yaml
id: src/lib/content/products.ts::PRODUCTS[4].audience
source: src/lib/content/products.ts
path: PRODUCTS[4].audience
render: Product pages, PRODUCTS[4].audience
narrative_slot: audience
en: For anyone applying to several roles at once
th: คนที่กำลังสมัครงานหลายตำแหน่งพร้อมกัน
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: d4ed02d797033b3c07f7b33b1f730216a2c207a3d6a356532cfb54d9103aba31
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[4].faq[0].a`

```yaml
id: src/lib/content/products.ts::PRODUCTS[4].faq[0].a
source: src/lib/content/products.ts
path: PRODUCTS[4].faq[0].a
render: Product pages, PRODUCTS[4].faq[0].a
narrative_slot: utility
en: No charge. It is included with Matched Jobs, because it is where those roles arrive.
th: ไม่มีค่าใช้จ่าย เพราะรวมอยู่ในบริการส่งตำแหน่งงานที่ตรงกับคุณแล้ว
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's wording, 23/08/2026.
review:
  structural_calque: pass
  text_hash: cfaf77a99b22e0f4192a0d52617d2178910a3f2c8ebe9137fa5cdb846da249d4
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[4].faq[0].q`

```yaml
id: src/lib/content/products.ts::PRODUCTS[4].faq[0].q
source: src/lib/content/products.ts
path: PRODUCTS[4].faq[0].q
render: Product pages, PRODUCTS[4].faq[0].q
narrative_slot: utility
en: Does it cost anything?
th: มีค่าใช้จ่ายไหม
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 3867b4ff9ebd8cb5cbc19e0f222183801f6d65242d00cf6fe3804baa0aa1a1a2
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[4].headline`

```yaml
id: src/lib/content/products.ts::PRODUCTS[4].headline
source: src/lib/content/products.ts
path: PRODUCTS[4].headline
render: Product pages, PRODUCTS[4].headline
narrative_slot: utility
en: You have applied to a lot of places, and you can no longer remember which one is where.
th: สมัครไปหลายที่ จนจำไม่ได้แล้วว่าที่ไหนไปถึงขั้นไหน
provenance: paul-approved
date: 23/08/2026
term_bindings: []
decision_note: Drafted 23/08/2026, read back and approved unchanged.
review:
  structural_calque: pass
  text_hash: f6a388bc58dab6c0dd5cb0b8412b8e5d155efad5adce6fede674876ba63a049a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[4].how[0]`

```yaml
id: src/lib/content/products.ts::PRODUCTS[4].how[0]
source: src/lib/content/products.ts
path: PRODUCTS[4].how[0]
render: Product pages, PRODUCTS[4].how[0]
narrative_slot: mechanism
en: Save the roles you are interested in, then decide which to apply for.
th: บันทึกตำแหน่งที่สนใจไว้ แล้วค่อยตัดสินใจว่าจะสมัครตำแหน่งไหน
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's wording, 23/08/2026.
review:
  structural_calque: pass
  text_hash: 4849bc8b12754cb22e7706c0f284a45e450f68f49b8a938096b328a39eb2f444
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[4].how[1]`

```yaml
id: src/lib/content/products.ts::PRODUCTS[4].how[1]
source: src/lib/content/products.ts
path: PRODUCTS[4].how[1]
render: Product pages, PRODUCTS[4].how[1]
narrative_slot: mechanism
en: Update the status yourself, from applying through interviews to an offer.
th: อัปเดตสถานะได้ด้วยตัวเอง ตั้งแต่ส่งใบสมัคร นัดสัมภาษณ์ ไปจนถึงได้รับข้อเสนองาน
provenance: paul-written
date: 04/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 23/08/2026. Self-updated by design: a notebook rather than

  an automated pipeline, per the 04/08/2026 scope note.
review:
  structural_calque: pass
  text_hash: 6dbdb56d44576bd3b150a1fcabe2a39db728d874ccc38503e6b17e8b501f5ccb
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[4].how[2]`

```yaml
id: src/lib/content/products.ts::PRODUCTS[4].how[2]
source: src/lib/content/products.ts
path: PRODUCTS[4].how[2]
render: Product pages, PRODUCTS[4].how[2]
narrative_slot: mechanism
en: See where you are actually getting stuck most often.
th: ดูได้ว่าคุณมักติดอยู่ที่ขั้นตอนไหนของการสมัครงาน
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's wording, 23/08/2026.
review:
  structural_calque: pass
  text_hash: 4b99eff37d3e1e8bdc16d5116a92f4ed8445a7dea93bff5174263ac5c8d39344
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[4].howLede`

```yaml
id: src/lib/content/products.ts::PRODUCTS[4].howLede
source: src/lib/content/products.ts
path: PRODUCTS[4].howLede
render: Product pages, PRODUCTS[4].howLede
narrative_slot: mechanism
en: One place holding every application and where each one stands.
th: ที่เดียวที่เก็บทุกตำแหน่งที่คุณสมัคร พร้อมสถานะของแต่ละตำแหน่ง
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: c88657832e7fe3243fe854842b5abf74aad12949c5de4260a56f802d975a96a5
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[4].lede`

```yaml
id: src/lib/content/products.ts::PRODUCTS[4].lede
source: src/lib/content/products.ts
path: PRODUCTS[4].lede
render: Product pages, PRODUCTS[4].lede
narrative_slot: utility
en: One place holding every role you applied for, with where each one stands. Free.
th: รวมทุกตำแหน่งที่คุณสมัครไว้ในที่เดียว พร้อมสถานะล่าสุดของแต่ละที่ ใช้ฟรี
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: |-
  Paul's wording, 23/08/2026. Free because it is the surface paid deliveries

  land on, decided 23/08/2026: charging for it would be charging twice for

  one workflow.
review:
  structural_calque: pass
  text_hash: 655f131fb61fe72dbf58205fba1592b2982f2c6e50f4ff75a2d7727a344fca25
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[4].limit`

```yaml
id: src/lib/content/products.ts::PRODUCTS[4].limit
source: src/lib/content/products.ts
path: PRODUCTS[4].limit
render: Product pages, PRODUCTS[4].limit
narrative_slot: limit
en: We do not apply for you, and we do not chase employers on your behalf.
th: เราไม่สมัครงานแทนคุณ และไม่ติดตามนายจ้างแทนคุณ
provenance: paul-written
date: 23/08/2026
term_bindings: []
decision_note: Paul's wording, 23/08/2026.
review:
  structural_calque: pass
  text_hash: cadd53fe75fcce9071dd56269716c883efbc4feed2ed0372bb8c8e6e4fbbcffd
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::PRODUCTS[4].name`

```yaml
id: src/lib/content/products.ts::PRODUCTS[4].name
source: src/lib/content/products.ts
path: PRODUCTS[4].name
render: Product pages, PRODUCTS[4].name
narrative_slot: utility
en: Guided Job Hunt
th: Guided Job Hunt
provenance: paul-approved
date: 23/08/2026
term_bindings:
  - product-guided-job-hunt
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 0306c1557b504fc623b194bbe30c6302c7f52d7e43f51c9c42965ed3747f4b9c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::RELATED_HEADING`

```yaml
id: src/lib/content/products.ts::RELATED_HEADING
source: src/lib/content/products.ts
path: RELATED_HEADING
render: Product pages, RELATED_HEADING
narrative_slot: utility
en: The rest of the catalogue
th: บริการอื่นในชุดเดียวกัน
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: 6f624ccb9c80c2c007310160eeaef6fcf12162e010273ea5bb41ac492286643a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::STATUS_LIVE`

```yaml
id: src/lib/content/products.ts::STATUS_LIVE
source: src/lib/content/products.ts
path: STATUS_LIVE
render: Product pages, STATUS_LIVE
narrative_slot: utility
en: Open now
th: เปิดให้ใช้งานแล้ว
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: c2261e17532a8a2a5c84cec7539cc8a5a135c58343f0104c671cebc5048c2543
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/products.ts::STATUS_SOON`

```yaml
id: src/lib/content/products.ts::STATUS_SOON
source: src/lib/content/products.ts
path: STATUS_SOON
render: Product pages, STATUS_SOON
narrative_slot: utility
en: Coming soon
th: เร็ว ๆ นี้
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: 4199b5787be83b51c6a8f6c45cb6c8ff1384f0c26463eb355f7130886c30e362
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::PATHWAYS[0]`

```yaml
id: src/lib/content/questions.ts::PATHWAYS[0]
source: src/lib/content/questions.ts
path: PATHWAYS[0]
render: EU Fit Check questions, PATHWAYS[0]
narrative_slot: utility
en: Find a job first, then relocate
th: หางานก่อน แล้วค่อยย้าย
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 6bccc847540fa546e37c4f20e34e7419acf4aef50bf8bd41c9ac06e9e9835f4b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::PATHWAYS[1]`

```yaml
id: src/lib/content/questions.ts::PATHWAYS[1]
source: src/lib/content/questions.ts
path: PATHWAYS[1]
render: EU Fit Check questions, PATHWAYS[1]
narrative_slot: utility
en: Study first, then find work there
th: เรียนต่อก่อน แล้วค่อยหางานที่นั่น
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c97f0933d7ddf482dafb95d49eab9c8bf3a3f833fac72366d3fb4c770a7c9980
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::PATHWAYS[2]`

```yaml
id: src/lib/content/questions.ts::PATHWAYS[2]
source: src/lib/content/questions.ts
path: PATHWAYS[2]
render: EU Fit Check questions, PATHWAYS[2]
narrative_slot: utility
en: Family or partner route
th: ไปตามคู่ครองหรือครอบครัว
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 4ba416c68b843519fe59a5cf50a1985c18664782c1f9dad99805bc0612e583d3
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::PATHWAYS[3]`

```yaml
id: src/lib/content/questions.ts::PATHWAYS[3]
source: src/lib/content/questions.ts
path: PATHWAYS[3]
render: EU Fit Check questions, PATHWAYS[3]
narrative_slot: utility
en: Not sure yet, exploring
th: ยังไม่แน่ใจ กำลังหาข้อมูลอยู่
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: e8f8f80f69928e2dc6f716a9d3524397d0c659f5579b9f40e3849f9c3c7ec5be
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[0]`

```yaml
id: src/lib/content/questions.ts::STAGE1[0]
source: src/lib/content/questions.ts
path: STAGE1[0]
render: EU Fit Check questions, STAGE1[0]
narrative_slot: utility
en: Which route to Europe are you exploring?
th: คุณกำลังพิจารณาเส้นทางไหนเพื่อไปทำงานในยุโรป?
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: |-
  SLOT: pathway. Context and narrative only, no score: it drives the

  opening line of the result (FR-008) and is stored on `leads.pathway`,

  not in ScoringInput. All four routes are written to read as equally

  legitimate.
review:
  structural_calque: pass
  text_hash: 40aa39a521a00443abca0a7d0c8faa9d34137468901491011fce714269d049c8
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[1]`

```yaml
id: src/lib/content/questions.ts::STAGE1[1]
source: src/lib/content/questions.ts
path: STAGE1[1]
render: EU Fit Check questions, STAGE1[1]
narrative_slot: utility
en: Target country or countries in Europe (you can choose more than one)
th: คุณสนใจไปทำงานในประเทศใดบ้างในยุโรป? (เลือกได้มากกว่า 1 ข้อ)
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: |-
  SLOT: targetCountries [proxy: Target Clarity]. Multi-select: the live

  form was free text and produced "Netherlands Germany France" and

  "สนใจทุกประเทศ", which no scorer can read.
review:
  structural_calque: pass
  text_hash: 6d52b565b92451bc425942267aaff469b0937ffa84a53523d159aa3324da7689
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[1].options[1]`

```yaml
id: src/lib/content/questions.ts::STAGE1[1].options[1]
source: src/lib/content/questions.ts
path: STAGE1[1].options[1]
render: EU Fit Check questions, STAGE1[1].options[1]
narrative_slot: utility
en: Not sure yet
th: ยังไม่แน่ใจ
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: d83729a5dc3b036e1ab89b99a71097d7f455a3f7b9561b91266f5fe39f80a9f8
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[10]`

```yaml
id: src/lib/content/questions.ts::STAGE1[10]
source: src/lib/content/questions.ts
path: STAGE1[10]
render: EU Fit Check questions, STAGE1[10]
narrative_slot: utility
en: What stage are you at right now?
th: ตอนนี้คุณอยู่ขั้นตอนไหนของการหางานแล้ว
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: |-
  options inside the cut and the other outside it, and the negotiation

  module and its own LINE message variant exist for that value alone. So

  the merge made the negotiation conversation unreachable for every

  app-native lead.

  This is the same fault as the dead `already have an offer` string

  recorded in `08_Coaching_Business.md`, which made the quiz's negotiation

  floor unreachable for the whole life of that form. Fixing it costs one

  tap and moves no score.

  Thai is the live form's own wording for the two options, quoted in that

  document's Q11 list, not new copy.
review:
  structural_calque: pass
  text_hash: d927e81417059ba733986fd8cf0d97fe93a67583c6f88cbb7b5758bc0a81a74d
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[10].options[0]`

```yaml
id: src/lib/content/questions.ts::STAGE1[10].options[0]
source: src/lib/content/questions.ts
path: STAGE1[10].options[0]
render: EU Fit Check questions, STAGE1[10].options[0]
narrative_slot: utility
en: Haven't started
th: ยังไม่เริ่ม
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 62b4c0a192b01f80f14c047d021639b14e8db793a2588fcf2bebf0a3f3cb12af
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[10].options[1]`

```yaml
id: src/lib/content/questions.ts::STAGE1[10].options[1]
source: src/lib/content/questions.ts
path: STAGE1[10].options[1]
render: EU Fit Check questions, STAGE1[10].options[1]
narrative_slot: utility
en: Researching
th: กำลังหาข้อมูล
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: cce456dfb8eb8615f1f427a27547d6cf3fa4f601d5c255d00dcdb37cc8b892df
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[10].options[2]`

```yaml
id: src/lib/content/questions.ts::STAGE1[10].options[2]
source: src/lib/content/questions.ts
path: STAGE1[10].options[2]
render: EU Fit Check questions, STAGE1[10].options[2]
narrative_slot: utility
en: Actively applying
th: กำลังสมัครงาน
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 69c21ae3bc0833a82fbe5ceb67b72a738526b2359e692d1abb2a9a89ada66e5c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[10].options[3]`

```yaml
id: src/lib/content/questions.ts::STAGE1[10].options[3]
source: src/lib/content/questions.ts
path: STAGE1[10].options[3]
render: EU Fit Check questions, STAGE1[10].options[3]
narrative_slot: utility
en: Interviewing
th: มีนัดสัมภาษณ์แล้ว
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c55ba21abdd6af7ec5533c7849954bda6e21b3a037e27e3fe633c0f4199ca611
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[10].options[4]`

```yaml
id: src/lib/content/questions.ts::STAGE1[10].options[4]
source: src/lib/content/questions.ts
path: STAGE1[10].options[4]
render: EU Fit Check questions, STAGE1[10].options[4]
narrative_slot: utility
en: Interviewing but not getting through
th: เคยสัมภาษณ์แล้ว แต่ยังไม่ผ่านเข้ารอบถัดไป
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: adc4efece54a1ae7710113e66941fedac9ed6badb096304775d808f383f250aa
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[10].options[5]`

```yaml
id: src/lib/content/questions.ts::STAGE1[10].options[5]
source: src/lib/content/questions.ts
path: STAGE1[10].options[5]
render: EU Fit Check questions, STAGE1[10].options[5]
narrative_slot: utility
en: Have an offer
th: ได้รับข้อเสนองานแล้ว
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 346de2443dae55581839c56db75f1e6da3911b958cb0c678889b5b5a476cd6ba
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[10].options[6]`

```yaml
id: src/lib/content/questions.ts::STAGE1[10].options[6]
source: src/lib/content/questions.ts
path: STAGE1[10].options[6]
render: EU Fit Check questions, STAGE1[10].options[6]
narrative_slot: utility
en: Negotiating a contract
th: กำลังเจรจาสัญญา
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: b40235744e5f8afe8e213d320286f5d33f63768956ff8372fd9ba6b93731cef6
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[11]`

```yaml
id: src/lib/content/questions.ts::STAGE1[11]
source: src/lib/content/questions.ts
path: STAGE1[11]
render: EU Fit Check questions, STAGE1[11]
narrative_slot: utility
en: How many roles in Europe have you applied to so far?
th: คุณสมัครงานในยุโรปไปแล้วกี่ตำแหน่ง?
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: |-
  SLOT: applications [proxy: Application Activity with Q11, and Search

  Follow-through]. Added 14/08/2026.

  Bands, not a number: the scorer only ever asks "none / under five / five

  or more", so a free number would collect a precision nothing reads. The

  fourth band exists for the coach rather than the score, which is a fair

  trade at one tap.

  `20+` is retired from the question, superseded by the three bands

  above on Paul's pass 15/08/2026. It still maps in `mapping.ts` because

  existing records hold it.
review:
  structural_calque: pass
  text_hash: 30a967b36736aa981389f70a9927591ba95f32ef40d633cd848638e457e3fb4f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[11].options[0]`

```yaml
id: src/lib/content/questions.ts::STAGE1[11].options[0]
source: src/lib/content/questions.ts
path: STAGE1[11].options[0]
render: EU Fit Check questions, STAGE1[11].options[0]
narrative_slot: utility
en: None yet
th: ยังไม่ได้สมัคร
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 77be5963ad5c19d453d7d07f1187a0a30b979eaf62376048c28e0bfddf5620bb
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[11].options[1]`

```yaml
id: src/lib/content/questions.ts::STAGE1[11].options[1]
source: src/lib/content/questions.ts
path: STAGE1[11].options[1]
render: EU Fit Check questions, STAGE1[11].options[1]
narrative_slot: utility
en: 1 to 4
th: 1–4
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 47bd93a5bc68d0aebe0a4793402e1dc5d79cecfc0f1bf522b2c1f255de4b5488
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[11].options[2]`

```yaml
id: src/lib/content/questions.ts::STAGE1[11].options[2]
source: src/lib/content/questions.ts
path: STAGE1[11].options[2]
render: EU Fit Check questions, STAGE1[11].options[2]
narrative_slot: utility
en: 5 to 20
th: 5–20
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 80faf43018d2f55c02117b39b3fa32a13981131cdf7d2c05516417d9ae195a3d
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[11].options[3]`

```yaml
id: src/lib/content/questions.ts::STAGE1[11].options[3]
source: src/lib/content/questions.ts
path: STAGE1[11].options[3]
render: EU Fit Check questions, STAGE1[11].options[3]
narrative_slot: utility
en: 21 to 50
th: 21–50
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 94186d870f8be08489c362343104fb1d09a8d45c044e913b091cff7c000cdc1b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[11].options[4]`

```yaml
id: src/lib/content/questions.ts::STAGE1[11].options[4]
source: src/lib/content/questions.ts
path: STAGE1[11].options[4]
render: EU Fit Check questions, STAGE1[11].options[4]
narrative_slot: utility
en: 51 to 100
th: 51–100
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 249e6aa2b9df8fe3d8e72f0d870501424c4aeef0a8a2e8f230fa5e3302bb6a9f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[11].options[5]`

```yaml
id: src/lib/content/questions.ts::STAGE1[11].options[5]
source: src/lib/content/questions.ts
path: STAGE1[11].options[5]
render: EU Fit Check questions, STAGE1[11].options[5]
narrative_slot: utility
en: More than 100
th: มากกว่า 100
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: b8d6950940e734d3d0b6aa20b24ea0635d0ed771cb85e2fc004546dc65a5159b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[12]`

```yaml
id: src/lib/content/questions.ts::STAGE1[12]
source: src/lib/content/questions.ts
path: STAGE1[12]
render: EU Fit Check questions, STAGE1[12]
narrative_slot: utility
en: Have you heard back from any of them?
th: จากตำแหน่งที่สมัครไป มีนายจ้างติดต่อกลับมาบ้างไหม?
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  already seen; the stem is new and reviewed separately.

  *A separate question rather than a follow-up, because the app has no

  conditional question display** (see `family` below for the same

  constraint solved a different way). So "haven't applied yet" is an option

  rather than a reason to skip: it is the quiz's own 0-point answer, and it

  keeps the question coherent for the person who has not applied.

  It can contradict `applications`. Someone can answer "None yet" there and

  "got some responses" here. Nothing resolves that automatically, on

  purpose: this answer is the one Temperature reads, because it is the one

  the weights were written against.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 1f3195187265011eb4cf4cd00ccfe587c2af6b92bf16bce5b6cb578275735411
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[12].options[0]`

```yaml
id: src/lib/content/questions.ts::STAGE1[12].options[0]
source: src/lib/content/questions.ts
path: STAGE1[12].options[0]
render: EU Fit Check questions, STAGE1[12].options[0]
narrative_slot: utility
en: Haven't applied yet
th: ยังไม่เคยสมัครเลย
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: e8e1921f361acf369863a7c41e83914b09052db03d5a5d975b943291627580e5
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[12].options[1]`

```yaml
id: src/lib/content/questions.ts::STAGE1[12].options[1]
source: src/lib/content/questions.ts
path: STAGE1[12].options[1]
render: EU Fit Check questions, STAGE1[12].options[1]
narrative_slot: utility
en: Applied to several, almost no response
th: สมัครไปหลายที่แล้ว แต่แทบไม่มีใครติดต่อกลับ
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 550deaf58b6a68d10593032da979bcc37b8e5a042e7b53d936006e143893a62e
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[12].options[2]`

```yaml
id: src/lib/content/questions.ts::STAGE1[12].options[2]
source: src/lib/content/questions.ts
path: STAGE1[12].options[2]
render: EU Fit Check questions, STAGE1[12].options[2]
narrative_slot: utility
en: Applied, and got some responses
th: สมัครไปแล้ว และมีคนติดต่อกลับมาบ้าง
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 85b14d20a634398680dc72f669c78b0c5d52e43573a38a0b6c9652df6518c446
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[13]`

```yaml
id: src/lib/content/questions.ts::STAGE1[13]
source: src/lib/content/questions.ts
path: STAGE1[13]
render: EU Fit Check questions, STAGE1[13]
narrative_slot: utility
en: When do you want to start working in Europe?
th: คุณอยากเริ่มทำงานในยุโรปเมื่อไร?
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: 'SLOT: timeline [proxy: Relocation Timeline].'
review:
  structural_calque: pass
  text_hash: f2288d7ed18bbb17f21c1fe9ab70d4702035bc6df08f576dfff5f76c5d203fc4
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[13].options[0]`

```yaml
id: src/lib/content/questions.ts::STAGE1[13].options[0]
source: src/lib/content/questions.ts
path: STAGE1[13].options[0]
render: EU Fit Check questions, STAGE1[13].options[0]
narrative_slot: utility
en: Within 3 months
th: ภายใน 3 เดือน
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 042044243411302da4ee4397985ba9e6e9e16befa898cb8678ddc80c701e2daf
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[13].options[1]`

```yaml
id: src/lib/content/questions.ts::STAGE1[13].options[1]
source: src/lib/content/questions.ts
path: STAGE1[13].options[1]
render: EU Fit Check questions, STAGE1[13].options[1]
narrative_slot: utility
en: In 3 to 6 months
th: 3–6 เดือน
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 438d471f376083e4446fd222d16ca29022e26d995409b75aff8304d46a07e826
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[13].options[2]`

```yaml
id: src/lib/content/questions.ts::STAGE1[13].options[2]
source: src/lib/content/questions.ts
path: STAGE1[13].options[2]
render: EU Fit Check questions, STAGE1[13].options[2]
narrative_slot: utility
en: In 6 to 12 months
th: 6–12 เดือน
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 48d55b4a35276474f55766bdbdedeb016a26f21ed38c22fe0128697348307566
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[13].options[3]`

```yaml
id: src/lib/content/questions.ts::STAGE1[13].options[3]
source: src/lib/content/questions.ts
path: STAGE1[13].options[3]
render: EU Fit Check questions, STAGE1[13].options[3]
narrative_slot: utility
en: Not sure, still exploring
th: ยังไม่แน่ใจ กำลังศึกษาข้อมูลอยู่
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: d04aa4ee51929ebc2c6333bf2157e6d8e72531a976a69a362616db4c59406d0f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[14]`

```yaml
id: src/lib/content/questions.ts::STAGE1[14]
source: src/lib/content/questions.ts
path: STAGE1[14]
render: EU Fit Check questions, STAGE1[14]
narrative_slot: utility
en: If you moved, who moves with you? Choose all that apply.
th: ถ้าคุณย้ายไปยุโรป ตอนนี้คุณและคนใกล้ชิดวางแผนเรื่องนี้ไปถึงไหนแล้ว? (เลือกได้มากกว่า 1 ข้อ)
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: |-
  would have shown to every single person with no partner and no children.

  The exclusive "no partner or dependents" option carries `hasDependents:

  false`, which the framework auto-scores 5, and the four indicator

  options carry `true` plus their own flag.

  `not_yet` exists so that having dependents and having done none of this

  is expressible. Without it, someone with a family and no plan would have

  had to either lie or leave the question, and those score very

  differently.

  Family Readiness is scored but never offered as a next action: it is a

  life circumstance, not a task, and the funnel picker excludes it.
review:
  structural_calque: pass
  text_hash: 23b6e0981945d41e0e14de6031fa9936370075315f28d275febacda881941b35
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[14].options[0]`

```yaml
id: src/lib/content/questions.ts::STAGE1[14].options[0]
source: src/lib/content/questions.ts
path: STAGE1[14].options[0]
render: EU Fit Check questions, STAGE1[14].options[0]
narrative_slot: utility
en: Nobody, I would be moving alone
th: ไม่มี ย้ายไปคนเดียว
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: d1e9ef5a118a7c6c90622fafa36ec1dd3ec2540a72436d222e44c391153ad499
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[14].options[1]`

```yaml
id: src/lib/content/questions.ts::STAGE1[14].options[1]
source: src/lib/content/questions.ts
path: STAGE1[14].options[1]
render: EU Fit Check questions, STAGE1[14].options[1]
narrative_slot: utility
en: I have talked the move through with everyone it affects
th: คุยเรื่องการย้ายกับทุกคนที่เกี่ยวข้องแล้ว
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: ce492e12ba47c1f389166e6e2f6ea8c74aed0658583a3605044419478f4cd94d
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[14].options[2]`

```yaml
id: src/lib/content/questions.ts::STAGE1[14].options[2]
source: src/lib/content/questions.ts
path: STAGE1[14].options[2]
render: EU Fit Check questions, STAGE1[14].options[2]
narrative_slot: utility
en: Nobody close to me is against it
th: ไม่มีคนใกล้ชิดคัดค้านเรื่องการย้าย
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: b41b5fba8255ef66b38c8ee6917a7ad07d51e8a889408fa1004dbfc0de6bc25a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[14].options[3]`

```yaml
id: src/lib/content/questions.ts::STAGE1[14].options[3]
source: src/lib/content/questions.ts
path: STAGE1[14].options[3]
render: EU Fit Check questions, STAGE1[14].options[3]
narrative_slot: utility
en: We have a plan for school or care for the people who depend on me
th: วางแผนเรื่องโรงเรียนหรือการดูแลผู้สูงอายุที่อยู่ในความรับผิดชอบแล้ว
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: ed14d96d53ab19d80ad9d32005788e7a5e93c022310a7858419c513dc7378443
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[14].options[4]`

```yaml
id: src/lib/content/questions.ts::STAGE1[14].options[4]
source: src/lib/content/questions.ts
path: STAGE1[14].options[4]
render: EU Fit Check questions, STAGE1[14].options[4]
narrative_slot: utility
en: We have thought through the practical side, visas, housing, my partner's work
th: คิดเรื่องวีซ่า ที่พัก และงานของคู่ครองไว้แล้ว
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: aba216c5a1c0568e15b5bdaf030b8c1e92ce0eff4f61c306e0a9a005a911b0b5
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[14].options[5]`

```yaml
id: src/lib/content/questions.ts::STAGE1[14].options[5]
source: src/lib/content/questions.ts
path: STAGE1[14].options[5]
render: EU Fit Check questions, STAGE1[14].options[5]
narrative_slot: utility
en: Someone would move with me, but we have not worked any of this out
th: มีคนจะย้ายไปด้วย แต่ยังไม่ได้วางแผนเรื่องเหล่านี้
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: b49610c17a5f243e7d3fee192b85bed7bc6aa320dd63b98a82f4d728400309fe
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[15]`

```yaml
id: src/lib/content/questions.ts::STAGE1[15]
source: src/lib/content/questions.ts
path: STAGE1[15]
render: EU Fit Check questions, STAGE1[15]
narrative_slot: utility
en: What monthly salary would you be aiming for in Europe, before tax?
th: คุณตั้งเป้าเงินเดือนในยุโรปไว้ประมาณเท่าไร ก่อนหักภาษี?
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: |-
  SLOT: salary [proxy: Salary Expectation Stated]. Added 14/08/2026.

  The proxy is named for what it measures: whether a usable figure exists,

  never whether the figure is realistic. Classifying it would need a

  country and role market benchmark, and `salaryExpectations` stays a

  coach-tier item for exactly that reason.

  Bands rather than free text, which the app has no input type for anyway,

  and which here is an improvement: a band guarantees a figure, a currency

  and a period, where the survey's free text produced "depends" often

  enough to need its own parser branch. Every band scores the same 3 on

  purpose. The band itself is for the call.
review:
  structural_calque: pass
  text_hash: 3d252cc1c146081d06bd90b28e087b13a38986170102f1ddbdfff39345b8b1a9
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[15].options[0]`

```yaml
id: src/lib/content/questions.ts::STAGE1[15].options[0]
source: src/lib/content/questions.ts
path: STAGE1[15].options[0]
render: EU Fit Check questions, STAGE1[15].options[0]
narrative_slot: utility
en: Under €2,500 a month
th: ต่ำกว่า 2,500 ยูโรต่อเดือน
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 63974042994295d8b443b6fe7307484dc769c5f7b840c51e07bcaf80a0b444c3
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[15].options[1]`

```yaml
id: src/lib/content/questions.ts::STAGE1[15].options[1]
source: src/lib/content/questions.ts
path: STAGE1[15].options[1]
render: EU Fit Check questions, STAGE1[15].options[1]
narrative_slot: utility
en: €2,500 to €3,500 a month
th: 2,500–3,500 ยูโรต่อเดือน
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 21fefc85ef490d49cec9a61e8968da3a2f2a848fc045c00cca4dee8c72ee89fa
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[15].options[2]`

```yaml
id: src/lib/content/questions.ts::STAGE1[15].options[2]
source: src/lib/content/questions.ts
path: STAGE1[15].options[2]
render: EU Fit Check questions, STAGE1[15].options[2]
narrative_slot: utility
en: €3,500 to €5,000 a month
th: 3,500–5,000 ยูโรต่อเดือน
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 2bd7285502789ae643d35e65100257e3b54a5ef1d227a7073d9a2a76edbac4f4
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[15].options[3]`

```yaml
id: src/lib/content/questions.ts::STAGE1[15].options[3]
source: src/lib/content/questions.ts
path: STAGE1[15].options[3]
render: EU Fit Check questions, STAGE1[15].options[3]
narrative_slot: utility
en: Over €5,000 a month
th: มากกว่า 5,000 ยูโรต่อเดือน
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 5d9c73534bf5a4f6289abb2762428f1b9a0f480623b283bf5ac45ef9613dcd42
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[15].options[4]`

```yaml
id: src/lib/content/questions.ts::STAGE1[15].options[4]
source: src/lib/content/questions.ts
path: STAGE1[15].options[4]
render: EU Fit Check questions, STAGE1[15].options[4]
narrative_slot: utility
en: I have not worked that out yet
th: ยังไม่ได้คิดเรื่องนี้
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 878556388ce813e73976b8b105cf6706d52b255b82a91ddd713bef9070376fcc
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[16]`

```yaml
id: src/lib/content/questions.ts::STAGE1[16]
source: src/lib/content/questions.ts
path: STAGE1[16]
render: EU Fit Check questions, STAGE1[16]
narrative_slot: utility
en: Have you ever paid for any of these? Choose all that apply.
th: ที่ผ่านมา คุณเคยจ่ายเงินเพื่อเรียนรู้หรือพัฒนาตัวเองในด้านใดบ้าง เลือกได้มากกว่า 1 ข้อ
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: |-
  app, since it comes from free text nothing here collects.

  Added 14/08/2026 on Paul's call: portfolio had to be one of the

  subjects. It is the highest-signal option in the list for this

  business, because it is the only one that names something PunProfile

  itself sells: someone who has already paid to have a CV or a

  LinkedIn profile written has priced this category of work before,

  and their objection on a call is never "why would anyone pay for

  that".

  The score is unaffected, as with every other area here. The

  framework asks about prior spend and not its aim, so `toGradeInput`

  collapses any paid area to the same band. This is for the call.
review:
  structural_calque: pass
  text_hash: b9573a3ac357943848a7717844e33b6dcc5a3710e4a720223d3318f1f942f90c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[16].options[0]`

```yaml
id: src/lib/content/questions.ts::STAGE1[16].options[0]
source: src/lib/content/questions.ts
path: STAGE1[16].options[0]
render: EU Fit Check questions, STAGE1[16].options[0]
narrative_slot: utility
en: Learning a language
th: เรียนภาษา
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: db56b0811fc75976f9ad059ca2e37ffd071cfe6402c529c28e0815de8c31ba08
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[16].options[1]`

```yaml
id: src/lib/content/questions.ts::STAGE1[16].options[1]
source: src/lib/content/questions.ts
path: STAGE1[16].options[1]
render: EU Fit Check questions, STAGE1[16].options[1]
narrative_slot: utility
en: Soft skills, for example communication or leadership
th: ทักษะในการทำงาน เช่น การสื่อสารหรือภาวะผู้นำ
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 66fcf63991398272512ade27abe9df90af2ec5c24c98ef3c07deabd2ac488210
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[16].options[2]`

```yaml
id: src/lib/content/questions.ts::STAGE1[16].options[2]
source: src/lib/content/questions.ts
path: STAGE1[16].options[2]
render: EU Fit Check questions, STAGE1[16].options[2]
narrative_slot: utility
en: A technical skill or a programming language
th: เรียนทักษะเฉพาะทางหรือการเขียนโปรแกรม
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 8979382f373054f29c76c4dc12dc78b19b191edff2011cdcd611820fc4756ccf
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[16].options[3]`

```yaml
id: src/lib/content/questions.ts::STAGE1[16].options[3]
source: src/lib/content/questions.ts
path: STAGE1[16].options[3]
render: EU Fit Check questions, STAGE1[16].options[3]
narrative_slot: utility
en: A professional certification or qualification
th: เรียนหลักสูตรเพื่อรับใบรับรองหรือคุณวุฒิวิชาชีพ
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: ef6c290747a7043b94b013a4b06853b30864682b103fccb914d82fdd8a7292fa
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[16].options[4]`

```yaml
id: src/lib/content/questions.ts::STAGE1[16].options[4]
source: src/lib/content/questions.ts
path: STAGE1[16].options[4]
render: EU Fit Check questions, STAGE1[16].options[4]
narrative_slot: utility
en: Having a CV, LinkedIn profile or portfolio written or reviewed
th: จ้างผู้เชี่ยวชาญช่วยเขียนหรือรีวิว CV โปรไฟล์ LinkedIn หรือ Portfolio
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: |-
  Added 14/08/2026 on Paul's call: portfolio had to be one of the

  subjects. It is the highest-signal option in the list for this

  business, because it is the only one that names something PunProfile

  itself sells: someone who has already paid to have a CV or a

  LinkedIn profile written has priced this category of work before,

  and their objection on a call is never "why would anyone pay for

  that".

  The score is unaffected, as with every other area here. The

  framework asks about prior spend and not its aim, so `toGradeInput`

  collapses any paid area to the same band. This is for the call.
review:
  structural_calque: pass
  text_hash: 9708996e0fcef48c732aea421c36d6848d7681de0335e1db8dd87dac32cca521
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[16].options[5]`

```yaml
id: src/lib/content/questions.ts::STAGE1[16].options[5]
source: src/lib/content/questions.ts
path: STAGE1[16].options[5]
render: EU Fit Check questions, STAGE1[16].options[5]
narrative_slot: utility
en: A career coach
th: ใช้บริการโค้ชชิ่งด้านอาชีพ
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 0754d2bff76295b10889cf556077ed56cc6c55dcb476c16d6e35ec57e15c762e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[16].options[6]`

```yaml
id: src/lib/content/questions.ts::STAGE1[16].options[6]
source: src/lib/content/questions.ts
path: STAGE1[16].options[6]
render: EU Fit Check questions, STAGE1[16].options[6]
narrative_slot: utility
en: None of these yet
th: ยังไม่เคยลงทุนกับเรื่องเหล่านี้
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 7b5e42557a5e3be80f3308893c6128f8fa49c66a18db5a7fad81e8911e621250
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[2]`

```yaml
id: src/lib/content/questions.ts::STAGE1[2]
source: src/lib/content/questions.ts
path: STAGE1[2]
render: EU Fit Check questions, STAGE1[2]
narrative_slot: utility
en: Which field do you want to work in in Europe?
th: สายงานที่อยากทำในยุโรป
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: |-
  SLOT: targetRole [proxy: Target Clarity]. The field, not the title, since

  14/08/2026: see the note on ROLE_CATEGORIES above.
review:
  structural_calque: pass
  text_hash: 6312ded95218b50809feff62478cb8dd63b98d78e17957018c9cf92f99b91b74
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[2].options[1]`

```yaml
id: src/lib/content/questions.ts::STAGE1[2].options[1]
source: src/lib/content/questions.ts
path: STAGE1[2].options[1]
render: EU Fit Check questions, STAGE1[2].options[1]
narrative_slot: utility
en: Not sure yet
th: ยังไม่แน่ใจ
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: d83729a5dc3b036e1ab89b99a71097d7f455a3f7b9561b91266f5fe39f80a9f8
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[3]`

```yaml
id: src/lib/content/questions.ts::STAGE1[3]
source: src/lib/content/questions.ts
path: STAGE1[3]
render: EU Fit Check questions, STAGE1[3]
narrative_slot: utility
en: How many years of professional experience do you have?
th: คุณมีประสบการณ์ทำงานมากี่ปีแล้ว
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: |-
  SLOT: experienceYears [ICP Gate 2: Offering Match]. Added 14/08/2026.

  Deliberately NOT mapped into ScoringInput. `experienceDepth` is an item

  of Professional Capability, and Stage 1 leaves that dimension hollow on

  purpose (PRD § 1, and `verify-content.ts` asserts both directions of it).

  This answer reaches the coach through `toGradeInput` only, so the

  candidate's first read is unchanged by it.
review:
  structural_calque: pass
  text_hash: 2fa23358c8096f16fa70114c5365faaad093cdc020f98a6b9bd5a23f20442534
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[3].options[0]`

```yaml
id: src/lib/content/questions.ts::STAGE1[3].options[0]
source: src/lib/content/questions.ts
path: STAGE1[3].options[0]
render: EU Fit Check questions, STAGE1[3].options[0]
narrative_slot: utility
en: Up to 1 year
th: ไม่เกิน 1 ปี
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: cfdce2a5194455e9ba999931a2454df5f99cf99178074fb5b5a3eebe1ca8b68d
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[3].options[1]`

```yaml
id: src/lib/content/questions.ts::STAGE1[3].options[1]
source: src/lib/content/questions.ts
path: STAGE1[3].options[1]
render: EU Fit Check questions, STAGE1[3].options[1]
narrative_slot: utility
en: 2 to 10 years
th: 2–10 ปี
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: a1448c598528232c5eaf10970dfaca951cc21d711177c00572df16f9548f5858
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[3].options[2]`

```yaml
id: src/lib/content/questions.ts::STAGE1[3].options[2]
source: src/lib/content/questions.ts
path: STAGE1[3].options[2]
render: EU Fit Check questions, STAGE1[3].options[2]
narrative_slot: utility
en: 11 to 15 years
th: 11–15 ปี
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 0e6532bfc4f9c698b8da1e05c2fb771eb3931c4b7bb581e4af4ad5f0799dcac8
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[3].options[3]`

```yaml
id: src/lib/content/questions.ts::STAGE1[3].options[3]
source: src/lib/content/questions.ts
path: STAGE1[3].options[3]
render: EU Fit Check questions, STAGE1[3].options[3]
narrative_slot: utility
en: 16 years or more
th: 16 ปีขึ้นไป
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 93d4614513bd27b7726504f01de374dc5ac9ddc09ae7d2b8eb4468cb0bff4097
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[4]`

```yaml
id: src/lib/content/questions.ts::STAGE1[4]
source: src/lib/content/questions.ts
path: STAGE1[4]
render: EU Fit Check questions, STAGE1[4]
narrative_slot: utility
en: Do you have an updated CV?
th: ตอนนี้คุณมี CV ที่อัปเดตและพร้อมใช้แล้วหรือยัง?
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: 'SLOT: cv [proxy: CV Status].'
review:
  structural_calque: pass
  text_hash: 4f8ea3b091ac6544c79257534b566e6ec34dd01142ce0221e6bab4e336c95af4
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[4].options[0]`

```yaml
id: src/lib/content/questions.ts::STAGE1[4].options[0]
source: src/lib/content/questions.ts
path: STAGE1[4].options[0]
render: EU Fit Check questions, STAGE1[4].options[0]
narrative_slot: utility
en: Don't have one yet
th: ยังไม่มี
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 82fd4c18be661a45bad812f0f9a55d3d9316221578be69e12cdc7d379686f62f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[4].options[1]`

```yaml
id: src/lib/content/questions.ts::STAGE1[4].options[1]
source: src/lib/content/questions.ts
path: STAGE1[4].options[1]
render: EU Fit Check questions, STAGE1[4].options[1]
narrative_slot: utility
en: Have one, not tailored for Europe
th: มีแต่ยังไม่ปรับให้เหมาะกับยุโรป
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 5b03241b5469bf8cd6f836984d536a58530821c0c95d179de8cfef734e7aaa7d
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[4].options[2]`

```yaml
id: src/lib/content/questions.ts::STAGE1[4].options[2]
source: src/lib/content/questions.ts
path: STAGE1[4].options[2]
render: EU Fit Check questions, STAGE1[4].options[2]
narrative_slot: utility
en: Have one, but outdated
th: มีแล้ว แต่ไม่ได้อัปเดตมานาน
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: bc409834318eae8d1ee511b8beb8af423848a192366644e3c0382d479ae40229
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[4].options[3]`

```yaml
id: src/lib/content/questions.ts::STAGE1[4].options[3]
source: src/lib/content/questions.ts
path: STAGE1[4].options[3]
render: EU Fit Check questions, STAGE1[4].options[3]
narrative_slot: utility
en: Have one, Europe-ready
th: มีแล้วพร้อมใช้สมัครงานยุโรป
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 3706a24166cdd18e3c38327b098b023b9430c1a4480deeb01b71483e85bed2aa
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[5]`

```yaml
id: src/lib/content/questions.ts::STAGE1[5]
source: src/lib/content/questions.ts
path: STAGE1[5]
render: EU Fit Check questions, STAGE1[5]
narrative_slot: utility
en: Do you have a LinkedIn profile?
th: ตอนนี้คุณมีโปรไฟล์ LinkedIn แล้วหรือยัง?
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: 'SLOT: linkedin [proxy: LinkedIn Status].'
review:
  structural_calque: pass
  text_hash: 25b1d8f457b3d86eedb5d6772738eeccad851667d3feb4f098fe6e79b0287d12
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[5].options[0]`

```yaml
id: src/lib/content/questions.ts::STAGE1[5].options[0]
source: src/lib/content/questions.ts
path: STAGE1[5].options[0]
render: EU Fit Check questions, STAGE1[5].options[0]
narrative_slot: utility
en: None
th: ยังไม่มี
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 248b2356a2e6ad2208e3ee626bd2c62ddad33b48d47ab8fd364e193a20ceac5a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[5].options[1]`

```yaml
id: src/lib/content/questions.ts::STAGE1[5].options[1]
source: src/lib/content/questions.ts
path: STAGE1[5].options[1]
render: EU Fit Check questions, STAGE1[5].options[1]
narrative_slot: utility
en: Have one, rarely updated
th: มี แต่ไม่ได้อัปเดต
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 6c1ae5919f41c7f91040a6c78e7fda78515899cd66f8934da8504073537142b2
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[5].options[2]`

```yaml
id: src/lib/content/questions.ts::STAGE1[5].options[2]
source: src/lib/content/questions.ts
path: STAGE1[5].options[2]
render: EU Fit Check questions, STAGE1[5].options[2]
narrative_slot: utility
en: Active and kept up to date
th: มี และอัปเดตสม่ำเสมอ
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 12770074cf15fc8326a5da58ddbdea8d4dcb88753f4a776c086e8018dd98a39e
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[5].options[3]`

```yaml
id: src/lib/content/questions.ts::STAGE1[5].options[3]
source: src/lib/content/questions.ts
path: STAGE1[5].options[3]
render: EU Fit Check questions, STAGE1[5].options[3]
narrative_slot: utility
en: Active and posts regularly
th: มี อัปเดต และโพสต์อย่างสม่ำเสมอ
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: e4da66c4ccc00345461380e0657a2be35220966847edb97b081df86c4d8015f2
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[6]`

```yaml
id: src/lib/content/questions.ts::STAGE1[6]
source: src/lib/content/questions.ts
path: STAGE1[6]
render: EU Fit Check questions, STAGE1[6]
narrative_slot: utility
en: Do you have a portfolio or work samples showing your results?
th: คุณมี Portfolio หรือตัวอย่างผลงานที่แสดงผลลัพธ์จากการทำงานหรือไม่?
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: |-
  SLOT: portfolio [proxy: Portfolio Evidence]. Added 14/08/2026, one of

  five questions carried over from the Google Form before it retires.

  Worth knowing what the answers look like: 44 of the first 63 survey

  respondents said no, which scores the floor, and that is precisely why

  the lowest-score-wins picker used to nominate "build a portfolio" as

  almost everyone's next action. The funnel-ordered picker handles it now.

  `good` is retired from the question and still scores, because ~160

  existing records hold it. See `scorePortfolio`.
review:
  structural_calque: pass
  text_hash: fd208f9fd94cb80780eded39bb6de8f5d57f6c1d5b8d982b3e56a860ac43a14e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[6].options[0]`

```yaml
id: src/lib/content/questions.ts::STAGE1[6].options[0]
source: src/lib/content/questions.ts
path: STAGE1[6].options[0]
render: EU Fit Check questions, STAGE1[6].options[0]
narrative_slot: utility
en: Not yet
th: ยังไม่มี
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 01ff7eac186229184d8ec16129270a82f44d09c3c564b2d546d18f451d9369a8
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[6].options[1]`

```yaml
id: src/lib/content/questions.ts::STAGE1[6].options[1]
source: src/lib/content/questions.ts
path: STAGE1[6].options[1]
render: EU Fit Check questions, STAGE1[6].options[1]
narrative_slot: utility
en: Some pieces, not organised
th: มีบางส่วน ยังไม่ได้จัดรวม
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: af1140b92b49d40cc9b6be115dd432412c685d0a9755af5180b27bd75ecf4a47
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[6].options[2]`

```yaml
id: src/lib/content/questions.ts::STAGE1[6].options[2]
source: src/lib/content/questions.ts
path: STAGE1[6].options[2]
render: EU Fit Check questions, STAGE1[6].options[2]
narrative_slot: utility
en: Yes, on paper
th: มีแล้ว เป็นเอกสารหรือแฟ้มผลงาน
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  `good` is retired from the question and still scores, because ~160

  existing records hold it. See `scorePortfolio`.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 47dbc2d5ce12f21d9fe2b89137653a788ae3ec3124c7255388f5e37d1543d061
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[6].options[3]`

```yaml
id: src/lib/content/questions.ts::STAGE1[6].options[3]
source: src/lib/content/questions.ts
path: STAGE1[6].options[3]
render: EU Fit Check questions, STAGE1[6].options[3]
narrative_slot: utility
en: Yes, digital or online
th: มีแล้ว ในรูปแบบดิจิทัลหรือออนไลน์
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 5a5d71472dc705ad7925cf78033c571922b1d3b32a553c8cc6cf46ddaefbb62a
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[7]`

```yaml
id: src/lib/content/questions.ts::STAGE1[7]
source: src/lib/content/questions.ts
path: STAGE1[7]
render: EU Fit Check questions, STAGE1[7]
narrative_slot: utility
en: Which of these are true about how you work? Choose all that apply.
th: ข้อใดตรงกับวิธีที่คุณใช้เทคโนโลยีและเรียนรู้เครื่องมือใหม่ในการทำงานบ้าง? (เลือกได้มากกว่า 1 ข้อ)
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: |-
  SLOT: aiTools [ECRA: AI & Digital Fluency]. Added 14/08/2026.

  This is one of only FIVE competencies out of ECRA's 34 that self-report

  can honestly score, so losing it with the Google Form would have taken

  the app from five real scores to four. The framework's formula is

  literally `1 + indicators met`, which is why the options are the

  indicators themselves rather than a satisfaction scale.

  The flags are stored as well as the count: "adopt indicator 3" is only

  prescribable if we know 3 is the missing one. Evidence stays granular,

  scores compress.
review:
  structural_calque: pass
  text_hash: d3fce47f4763cf480e7cd88a6285ac203de3f484ccd7f2708f067c61da30f274
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[7].options[0]`

```yaml
id: src/lib/content/questions.ts::STAGE1[7].options[0]
source: src/lib/content/questions.ts
path: STAGE1[7].options[0]
render: EU Fit Check questions, STAGE1[7].options[0]
narrative_slot: utility
en: I use AI tools like ChatGPT for work or job-search tasks most weeks
th: ใช้ AI เช่น ChatGPT ช่วยทำงานหรือหางานเกือบทุกสัปดาห์
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 2442e58c5c60dd337bab6815b9fa0c63223ed2c65e1141ee3d6d7091817f5e7c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[7].options[1]`

```yaml
id: src/lib/content/questions.ts::STAGE1[7].options[1]
source: src/lib/content/questions.ts
path: STAGE1[7].options[1]
render: EU Fit Check questions, STAGE1[7].options[1]
narrative_slot: utility
en: I am comfortable with the tools European teams run on, for example Slack, Notion, Jira, CRM, PM Tool
th: ใช้เครื่องมือที่ทีมในยุโรปนิยมได้ เช่น Slack, Notion, Jira, CRM หรือเครื่องมือบริหารโครงการ
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 021b30f37968ddadc659a443d9f3387882f28bf8069ed5d32cce64bbdd3e145f
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[7].options[2]`

```yaml
id: src/lib/content/questions.ts::STAGE1[7].options[2]
source: src/lib/content/questions.ts
path: STAGE1[7].options[2]
render: EU Fit Check questions, STAGE1[7].options[2]
narrative_slot: utility
en: I have used AI to tailor a CV or an application
th: เคยใช้ AI ปรับ CV หรือใบสมัครงาน
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: d104483e87acd98f4d69ad5ac41eb0df5fe9f79fa73e923491242722dad73b00
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[7].options[3]`

```yaml
id: src/lib/content/questions.ts::STAGE1[7].options[3]
source: src/lib/content/questions.ts
path: STAGE1[7].options[3]
render: EU Fit Check questions, STAGE1[7].options[3]
narrative_slot: utility
en: I picked these up on my own, not because a job required it
th: เรียนรู้เครื่องมือเหล่านี้ด้วยตัวเอง ไม่ได้รอให้งานบังคับ
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 1c8ded8fb3712f5de45d4fbbd1b7364f3b6c7078b5de675895cc7c9d88d2391c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[7].options[4]`

```yaml
id: src/lib/content/questions.ts::STAGE1[7].options[4]
source: src/lib/content/questions.ts
path: STAGE1[7].options[4]
render: EU Fit Check questions, STAGE1[7].options[4]
narrative_slot: utility
en: None of these yet
th: ยังไม่มีข้อไหนตรง
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: e569b55ca970c48dfe943f275cf54edf24650b5e24b77840f9ad5d848638dfaa
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[8]`

```yaml
id: src/lib/content/questions.ts::STAGE1[8]
source: src/lib/content/questions.ts
path: STAGE1[8]
render: EU Fit Check questions, STAGE1[8]
narrative_slot: utility
en: Where do you stand on visa and the right to work in Europe?
th: เรื่องวีซ่าและสิทธิ์การทำงานในยุโรป ตอนนี้คุณอยู่ขั้นไหน?
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: |-
  SLOT: workAuth [ECRA: Visa Readiness]. `sponsor_route_named` has no live

  equivalent: the framework scores "knows the specific route" a full point

  above "knows sponsorship is needed", and no form ever asked it.
review:
  structural_calque: pass
  text_hash: fbb6670caea73211924611236dbff2bdab47e7bce6683603d30a06953140a83c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[8].options[0]`

```yaml
id: src/lib/content/questions.ts::STAGE1[8].options[0]
source: src/lib/content/questions.ts
path: STAGE1[8].options[0]
render: EU Fit Check questions, STAGE1[8].options[0]
narrative_slot: utility
en: Already have an EU passport or work rights
th: มีพาสปอร์ต EU หรือสิทธิ์ทำงานอยู่แล้ว
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: a64788d960a3c7379b6c60f14786902eeaf175c257ca372e473a14cde62f0651
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[8].options[1]`

```yaml
id: src/lib/content/questions.ts::STAGE1[8].options[1]
source: src/lib/content/questions.ts
path: STAGE1[8].options[1]
render: EU Fit Check questions, STAGE1[8].options[1]
narrative_slot: utility
en: Need sponsorship and know which visa route I'd use
th: ต้องการสปอนเซอร์วีซ่า และรู้แล้วว่าจะใช้วีซ่าประเภทไหน
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 12468f473efd761e46fa148202ef132090ba5f018d426dcf4035c7fd09aa2ed2
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[8].options[2]`

```yaml
id: src/lib/content/questions.ts::STAGE1[8].options[2]
source: src/lib/content/questions.ts
path: STAGE1[8].options[2]
render: EU Fit Check questions, STAGE1[8].options[2]
narrative_slot: utility
en: Understand I'll need visa sponsorship
th: เข้าใจว่าต้องหาบริษัทที่ช่วยสปอนเซอร์วีซ่า
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 0d143a00149887a5c3f09b865377641ef0224642d3c6366bace12caf733b60ce
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[8].options[3]`

```yaml
id: src/lib/content/questions.ts::STAGE1[8].options[3]
source: src/lib/content/questions.ts
path: STAGE1[8].options[3]
render: EU Fit Check questions, STAGE1[8].options[3]
narrative_slot: utility
en: Not sure what's needed at all
th: ยังไม่รู้ว่าต้องเตรียมอะไรบ้าง
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: be32a3b3e1e43f7f9ac05d9c98c20b08c02283a0c1a21f694a036e06b608c0c5
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[9]`

```yaml
id: src/lib/content/questions.ts::STAGE1[9]
source: src/lib/content/questions.ts
path: STAGE1[9]
render: EU Fit Check questions, STAGE1[9]
narrative_slot: utility
en: Your English level (CEFR)
th: ระดับภาษาอังกฤษของคุณ (CEFR)
provenance: paul-approved
date: 14/08/2026
term_bindings: []
decision_note: |-
  SLOT: englishCefr [ECRA: Language Readiness + Business English]. Feeds

  two of the four dimensions. Founder decision 08/08/2026: no test-score

  follow-up, buttons are enough.

  Six levels since 14/08/2026, the full CEFR ladder, on Paul's call. The

  four-button version folded A1 into A2 and B2 into B1, which cost the two

  distinctions that matter most in this pool: a true beginner scored the

  same as someone with school English, and B2, the level most European

  employers actually ask for, had nowhere to land. The scale, the

  normaliser and `parseCefr` already carried all six; only the question

  was short.
review:
  structural_calque: pass
  text_hash: 46aa0e786e985957be69c10ed8203469b6ad3ae79f440def499627179cbeee26
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[9].options[0]`

```yaml
id: src/lib/content/questions.ts::STAGE1[9].options[0]
source: src/lib/content/questions.ts
path: STAGE1[9].options[0]
render: EU Fit Check questions, STAGE1[9].options[0]
narrative_slot: utility
en: Beginner (A1)
th: เริ่มต้น (A1)
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: e8a536c0d6a892396146861db874d528d60956eddf4c85757403925e6d8de227
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[9].options[1]`

```yaml
id: src/lib/content/questions.ts::STAGE1[9].options[1]
source: src/lib/content/questions.ts
path: STAGE1[9].options[1]
render: EU Fit Check questions, STAGE1[9].options[1]
narrative_slot: utility
en: Elementary (A2)
th: พื้นฐาน (A2)
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: ed345f78ba2fa3920ad7dd05842f9dc4ec2a011c2b1eaf0acaa358bb0be0db1a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[9].options[2]`

```yaml
id: src/lib/content/questions.ts::STAGE1[9].options[2]
source: src/lib/content/questions.ts
path: STAGE1[9].options[2]
render: EU Fit Check questions, STAGE1[9].options[2]
narrative_slot: utility
en: Conversational (B1)
th: สื่อสารเรื่องทั่วไปได้ (B1)
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 9695e75b7749ec7aedbb97cb8f2cd64efee07bdf5d569e07390ec58635019948
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[9].options[3]`

```yaml
id: src/lib/content/questions.ts::STAGE1[9].options[3]
source: src/lib/content/questions.ts
path: STAGE1[9].options[3]
render: EU Fit Check questions, STAGE1[9].options[3]
narrative_slot: utility
en: Working proficiency (B2)
th: ใช้ทำงาน พรีเซนต์ และเจรจาได้ (B2)
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 160f38e9891ff7a3a292b4a4e8e8701cc39b15e98ffb8b40ff67d0d18d4c4357
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[9].options[4]`

```yaml
id: src/lib/content/questions.ts::STAGE1[9].options[4]
source: src/lib/content/questions.ts
path: STAGE1[9].options[4]
render: EU Fit Check questions, STAGE1[9].options[4]
narrative_slot: utility
en: Fluent (C1)
th: สื่อสารในการทำงานได้อย่างคล่องแคล่ว (C1)
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: a50291736f95dcd62b9f87f72a3c759cd74af174f722f97dfa065eba7d9f1318
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/questions.ts::STAGE1[9].options[5]`

```yaml
id: src/lib/content/questions.ts::STAGE1[9].options[5]
source: src/lib/content/questions.ts
path: STAGE1[9].options[5]
render: EU Fit Check questions, STAGE1[9].options[5]
narrative_slot: utility
en: Native-level (C2)
th: เชี่ยวชาญและสื่อสารเรื่องซับซ้อนได้ (C2)
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 786965ef6e546235f88403a285634b26b607514c30ccf6e9a72575bb9add304d
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::AI_NOTE`

```yaml
id: src/lib/content/services.ts::AI_NOTE
source: src/lib/content/services.ts
path: AI_NOTE
render: Services page, AI_NOTE
narrative_slot: utility
en: >-
  AI is part of all three services. You learn to use it yourself, for drafting, preparing and researching, and
  PunProfile uses it behind the scenes to work faster without lowering the quality of the thinking.
th: >-
  AI เป็นส่วนหนึ่งของทั้ง 3 บริการ คุณจะได้เรียนรู้วิธีใช้ AI ด้วยตัวเองเพื่อช่วยร่าง เตรียมตัว
  และค้นคว้าข้อมูล ส่วน PunProfile ใช้ AI ช่วยงานเบื้องหลังให้รวดเร็วขึ้น
  โดยยังใช้การคิดและการตัดสินใจของคนเป็นหลัก
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: a784bcc95bab5031b79e3ef5b913b6c3a9e30e30278a505df38551d2a7e3865a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::CORE_BADGE`

```yaml
id: src/lib/content/services.ts::CORE_BADGE
source: src/lib/content/services.ts
path: CORE_BADGE
render: Services page, CORE_BADGE
narrative_slot: utility
en: Core service
th: บริการหลัก
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 45e26430981eda0d64b380936bf3d81a55e076609816e6d2a399495fa63106c7
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::ENGAGEMENT_HEADING`

```yaml
id: src/lib/content/services.ts::ENGAGEMENT_HEADING
source: src/lib/content/services.ts
path: ENGAGEMENT_HEADING
render: Services page, ENGAGEMENT_HEADING
narrative_slot: utility
en: How an engagement runs
th: เราทำงานร่วมกันอย่างไร
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: Paul's wording, 06/09/2026.
review:
  structural_calque: pass
  text_hash: 4595924b9748bb64bcb718947cb3721219dc5b1ccb6e0c684396ed67f2c70038
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::ENGAGEMENT_LEDE`

```yaml
id: src/lib/content/services.ts::ENGAGEMENT_LEDE
source: src/lib/content/services.ts
path: ENGAGEMENT_LEDE
render: Services page, ENGAGEMENT_LEDE
narrative_slot: utility
en: >-
  Four steps, and the first one is free. Nothing is scoped or priced until we both know what you are actually
  aiming at.
th: >-
  มีสี่ขั้นตอน และขั้นแรกไม่มีค่าใช้จ่าย เราจะยังไม่กำหนดขอบเขตงานหรือราคา
  จนกว่าทั้งคุณและเราจะรู้ชัดว่าคุณกำลังมุ่งไปทางไหน
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: |-
  Paul's wording, 06/09/2026. `ไม่มีค่าใช้จ่าย` rather than the shorter word,

  which is the form `faq.ts` and the product pages already use for this.
review:
  structural_calque: pass
  text_hash: 4518df9397da081896ad04caa6c4e63e36b6a294e98acf5bde4e574f90bffb9b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::ENGAGEMENT[0].body`

```yaml
id: src/lib/content/services.ts::ENGAGEMENT[0].body
source: src/lib/content/services.ts
path: ENGAGEMENT[0].body
render: Services page, ENGAGEMENT[0].body
narrative_slot: utility
en: >-
  Thirty minutes on where you are and what you are aiming at. If nothing here is the right thing for you, that
  is what the half hour is for.
th: >-
  คุยกันครึ่งชั่วโมงว่าตอนนี้คุณอยู่ตรงไหนและกำลังมุ่งไปทางไหน หากไม่มีบริการไหนเหมาะกับคุณ
  การคุยครั้งนี้ก็มีไว้เพื่อบอกให้ชัดตั้งแต่ต้น
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: Paul's wording, 06/09/2026.
review:
  structural_calque: pass
  text_hash: e6a4a34be7ab3527d17566a1fd5c842df16dfe016c48012e0e8b150a6c175d86
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::ENGAGEMENT[0].lead`

```yaml
id: src/lib/content/services.ts::ENGAGEMENT[0].lead
source: src/lib/content/services.ts
path: ENGAGEMENT[0].lead
render: Services page, ENGAGEMENT[0].lead
narrative_slot: utility
en: A first conversation, at no charge
th: คุยกันครั้งแรก โดยไม่มีค่าใช้จ่าย
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: 1cecc1a93776f93ab802a77dd98088ecb678d41718fe91e56993e3817aefa3f8
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::ENGAGEMENT[1].body`

```yaml
id: src/lib/content/services.ts::ENGAGEMENT[1].body
source: src/lib/content/services.ts
path: ENGAGEMENT[1].body
render: Services page, ENGAGEMENT[1].body
narrative_slot: utility
en: >-
  The role, the industry and the country, decided together and written down, because however good a CV is,
  sent into the wrong market it is still an application aimed at nothing.
th: >-
  เราจะช่วยกันเลือกตำแหน่ง อุตสาหกรรม และประเทศเป้าหมาย แล้วเขียนทั้งหมดไว้ให้ชัด เพราะต่อให้ CV ดีแค่ไหน
  หากส่งไปผิดตลาด ก็ยังเป็นใบสมัครที่ไม่ตรงเป้าอยู่ดี
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: |-
  Paul's wording, 06/09/2026. The reasoning is the `coaching` service's own

  summary above, which is Paul's Thai; this line points at it rather than

  replacing it.
review:
  structural_calque: pass
  text_hash: ff3fe7dac7b4604407bab771a6c50649c33ada596ed5d6e2c72e3142bafcb523
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::ENGAGEMENT[1].lead`

```yaml
id: src/lib/content/services.ts::ENGAGEMENT[1].lead
source: src/lib/content/services.ts
path: ENGAGEMENT[1].lead
render: Services page, ENGAGEMENT[1].lead
narrative_slot: utility
en: The direction, before any document
th: หาทิศทางให้ชัด ก่อนลงมือทำเอกสาร
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: 08f5b3f485961393290b81c7b24613b017a5c736010014760a1876d2a6f5a4c6
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::ENGAGEMENT[2].body`

```yaml
id: src/lib/content/services.ts::ENGAGEMENT[2].body
source: src/lib/content/services.ts
path: ENGAGEMENT[2].body
render: Services page, ENGAGEMENT[2].body
narrative_slot: utility
en: >-
  A master CV, a LinkedIn profile and, where the field asks for one, a portfolio. Base versions, built once
  and tailored per role afterwards.
th: >-
  CV ฉบับหลัก โปรไฟล์ LinkedIn และ Portfolio หากสายงานของคุณต้องใช้ ทำเป็นฉบับตั้งต้นไว้ครั้งเดียว
  แล้วค่อยปรับให้ตรงกับแต่ละตำแหน่ง
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: Paul's wording, 06/09/2026.
review:
  structural_calque: pass
  text_hash: 67b9df89de182d6a5dded1c490c76c972e5a0d26aa176ff8ab1980d8ff166101
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::ENGAGEMENT[2].lead`

```yaml
id: src/lib/content/services.ts::ENGAGEMENT[2].lead
source: src/lib/content/services.ts
path: ENGAGEMENT[2].lead
render: Services page, ENGAGEMENT[2].lead
narrative_slot: utility
en: The documents you reuse
th: ชุดเอกสารที่คุณใช้ซ้ำได้
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: 2f88a1deb803be97ba1a2fd19b9ec63acbb372c86aa50c556490311beba8209c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::ENGAGEMENT[3].body`

```yaml
id: src/lib/content/services.ts::ENGAGEMENT[3].body
source: src/lib/content/services.ts
path: ENGAGEMENT[3].body
render: Services page, ENGAGEMENT[3].body
narrative_slot: utility
en: >-
  Shortlist, tailor, prepare for that specific interview, then read the offer and the contract together. The
  CV goes out under your name and the person in the interview is you.
th: >-
  คัดตำแหน่ง ปรับเอกสาร เตรียมตัวสำหรับการสัมภาษณ์แต่ละงาน แล้วช่วยกันอ่านข้อเสนอและสัญญาจ้าง CV
  ถูกส่งออกไปในชื่อของคุณ และคนที่ต้องนั่งอยู่ในห้องสัมภาษณ์ก็คือคุณ
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: |-
  Paul's wording, 06/09/2026. The closing clause is Paul's own, from

  `NOT_FOR` in `coaching.ts`.
review:
  structural_calque: pass
  text_hash: 3022b2062296834c942e663c0f1e797e2cae7b69d7bda63e146fd9d737b1b797
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::ENGAGEMENT[3].lead`

```yaml
id: src/lib/content/services.ts::ENGAGEMENT[3].lead
source: src/lib/content/services.ts
path: ENGAGEMENT[3].lead
render: Services page, ENGAGEMENT[3].lead
narrative_slot: utility
en: One application at a time, to the end
th: สมัครทีละตำแหน่ง จนจบกระบวนการ
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: efefda69201a17d1f241b3739b8fe40663004ee2200841f9c9c53c1cdad5700b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::FOCUS_NOTE`

```yaml
id: src/lib/content/services.ts::FOCUS_NOTE
source: src/lib/content/services.ts
path: FOCUS_NOTE
render: Services page, FOCUS_NOTE
narrative_slot: utility
en: Your result points here
th: ผลประเมินของคุณชี้มาที่บริการนี้
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 48ba5d6e963364ba95b864f76fce4129ffc6596bde01dabbc3600ad8a696c5cb
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES_CLOSE_BODY`

```yaml
id: src/lib/content/services.ts::SERVICES_CLOSE_BODY
source: src/lib/content/services.ts
path: SERVICES_CLOSE_BODY
render: Services page, SERVICES_CLOSE_BODY
narrative_slot: ask
en: >-
  Tell me where you are and what you are aiming at. If none of this is the right thing for you, I would rather
  say so in the first conversation than in the third.
th: >-
  บอกผมว่าตอนนี้คุณอยู่ตรงไหนและกำลังมุ่งไปทางไหน หากไม่มีบริการไหนตรงกับสิ่งที่คุณต้องการ
  ผมอยากบอกคุณตั้งแต่คุยกันครั้งแรก มากกว่าปล่อยให้ไปถึงครั้งที่สาม
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: |-
  Paul's wording, 06/09/2026. First person, per `DESTINATIONS.contact` in

  `cta.ts`: the reader reaches a person, not a company.
review:
  structural_calque: pass
  text_hash: b840030c0616d7fb375e4ac0f502b331802925b9f65ecdaa092b69e33d2c78da
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES_CLOSE_HEADING`

```yaml
id: src/lib/content/services.ts::SERVICES_CLOSE_HEADING
source: src/lib/content/services.ts
path: SERVICES_CLOSE_HEADING
render: Services page, SERVICES_CLOSE_HEADING
narrative_slot: utility
en: Start with the half hour
th: เริ่มจากการคุยกันครึ่งชั่วโมง
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: d5cfc17cf47e20080b722b7380065a2bc5bc3b52b079131f2c35049ff353b9b7
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES_EYEBROW`

```yaml
id: src/lib/content/services.ts::SERVICES_EYEBROW
source: src/lib/content/services.ts
path: SERVICES_EYEBROW
render: Services page, SERVICES_EYEBROW
narrative_slot: utility
en: Working with a person
th: ทำงานร่วมกับคน
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: Paul's wording, 06/09/2026.
review:
  structural_calque: pass
  text_hash: 90105eaa6cbaa33b6851effddc77b71c78e39f68e1b6515b64afa3cbd3ed1f74
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES_FAQ_INTRO`

```yaml
id: src/lib/content/services.ts::SERVICES_FAQ_INTRO
source: src/lib/content/services.ts
path: SERVICES_FAQ_INTRO
render: Services page, SERVICES_FAQ_INTRO
narrative_slot: utility
en: Four things people ask before the first conversation.
th: สี่เรื่องที่คนมักถามก่อนจะได้คุยกันครั้งแรก
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: 15ca928462b9a06161ebce0f3aab9330d5cb5de940c54857258f8f63a49647b1
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES_FAQ[0].a`

```yaml
id: src/lib/content/services.ts::SERVICES_FAQ[0].a
source: src/lib/content/services.ts
path: SERVICES_FAQ[0].a
render: Services page, SERVICES_FAQ[0].a
narrative_slot: utility
en: >-
  No. The other two can be taken on their own. The coaching is where every client starts because the direction
  usually turns out to be the thing that was unclear, not the documents.
th: >-
  ไม่ต้อง อีกสองบริการเลือกใช้แยกกันได้ ส่วนลูกค้าที่เลือกโค้ชชิ่งจะเริ่มจากการหาทิศทาง
  เพราะส่วนใหญ่สิ่งที่ยังไม่ชัดคือทิศทาง ไม่ใช่เอกสาร
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: Paul's wording, 06/09/2026.
review:
  structural_calque: pass
  text_hash: 994bd31da86ce250066c9d4147bc1193c3ac7b445a4f211e82e753ad4d5e5ed8
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES_FAQ[0].q`

```yaml
id: src/lib/content/services.ts::SERVICES_FAQ[0].q
source: src/lib/content/services.ts
path: SERVICES_FAQ[0].q
render: Services page, SERVICES_FAQ[0].q
narrative_slot: utility
en: Do I have to take the coaching to get the other two?
th: ต้องใช้บริการโค้ชชิ่งก่อนถึงจะใช้อีกสองบริการได้ไหม
provenance: paul-approved
date: 06/09/2026
term_bindings: []
decision_note: Read back 06/09/2026.
review:
  structural_calque: pass
  text_hash: 245fa124fbcb4908c750de3508fd1003a711eb9626bb6a210bbb190c981a3c05
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES_FAQ[1].a`

```yaml
id: src/lib/content/services.ts::SERVICES_FAQ[1].a
source: src/lib/content/services.ts
path: SERVICES_FAQ[1].a
render: Services page, SERVICES_FAQ[1].a
narrative_slot: utility
en: >-
  It depends on which of the three you need and how far you already are, so it is settled in the first
  conversation rather than on this page. The tools have their own prices and those are published.
th: >-
  ขึ้นอยู่กับว่าคุณต้องการบริการไหนในสามบริการ และตอนนี้เตรียมไปถึงไหนแล้ว เราจึงจะตกลงราคากันในการคุยครั้งแรก
  ไม่ได้กำหนดไว้ในหน้านี้ ส่วนเครื่องมือต่าง ๆ มีราคาแยกและประกาศไว้แล้ว
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: |-
  Paul's wording, 06/09/2026. It points at `/pricing` in words rather than

  quoting a number, which is the rule the product pages follow.
review:
  structural_calque: pass
  text_hash: 85d4e4589f7784212ec5d45135923b946626dbc533527eaf893024b9c45117e0
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES_FAQ[1].q`

```yaml
id: src/lib/content/services.ts::SERVICES_FAQ[1].q
source: src/lib/content/services.ts
path: SERVICES_FAQ[1].q
render: Services page, SERVICES_FAQ[1].q
narrative_slot: utility
en: What does it cost?
th: ค่าบริการเท่าไร
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: Paul's wording, 06/09/2026.
review:
  structural_calque: pass
  text_hash: 1e13a96e7418f9432d123ac6dd483cbaed0f6ee14e64ad651c42eda3cdf6e9c1
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES_FAQ[2].a`

```yaml
id: src/lib/content/services.ts::SERVICES_FAQ[2].a
source: src/lib/content/services.ts
path: SERVICES_FAQ[2].a
render: Services page, SERVICES_FAQ[2].a
narrative_slot: utility
en: No. Most of the people we work with are still in Thailand, and the sessions are held online.
th: ไม่ต้อง คนส่วนใหญ่ที่เราทำงานด้วยยังอยู่ในประเทศไทย และเราคุยกันทางออนไลน์
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: Paul's wording, 06/09/2026.
review:
  structural_calque: pass
  text_hash: 5f1dfdccf4cd320cc229089b1d85dc934cd0ff1a8ea618580ae515920fd07d55
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES_FAQ[2].q`

```yaml
id: src/lib/content/services.ts::SERVICES_FAQ[2].q
source: src/lib/content/services.ts
path: SERVICES_FAQ[2].q
render: Services page, SERVICES_FAQ[2].q
narrative_slot: utility
en: Do I need to be in Europe already?
th: ต้องอยู่ในยุโรปก่อนหรือไม่
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: Paul's wording, 06/09/2026.
review:
  structural_calque: pass
  text_hash: a6f04179e2af8ad2dc711fc487be602fac4e161d91a17dc22f54efbbfb5c4aef
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES_FAQ[3].a`

```yaml
id: src/lib/content/services.ts::SERVICES_FAQ[3].a
source: src/lib/content/services.ts
path: SERVICES_FAQ[3].a
render: Services page, SERVICES_FAQ[3].a
narrative_slot: utility
en: >-
  Mainly English, so every conversation doubles as practice for the interviews you are preparing for. Anything
  that has to be precise can be said in Thai.
th: >-
  ใช้ภาษาอังกฤษเป็นหลัก ทุกครั้งที่คุยกันจึงเป็นการฝึกสำหรับการสัมภาษณ์ไปในตัว
  หากมีเรื่องไหนที่ต้องคุยกันให้เข้าใจตรงกันอย่างแม่นยำ ก็ใช้ภาษาไทยได้
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: |-
  Paul's wording, 06/09/2026. The first clause is Paul's own wording from

  the coaching service's `includes` above, including `เป็นหลัก`, which is

  there because a flat claim that sessions ARE in English is one a reader

  could hold against the first session that switches.
review:
  structural_calque: pass
  text_hash: 79dd25a869579028d16e5a2b83368d5c70d3b9db4ae3991f3f4586e2fbfd3452
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES_FAQ[3].q`

```yaml
id: src/lib/content/services.ts::SERVICES_FAQ[3].q
source: src/lib/content/services.ts
path: SERVICES_FAQ[3].q
render: Services page, SERVICES_FAQ[3].q
narrative_slot: utility
en: What language are the sessions in?
th: คุยกันเป็นภาษาอะไร
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: Paul's wording, 06/09/2026.
review:
  structural_calque: pass
  text_hash: 4eb196f5ff1be9e2b54812c8a2d7e5754a414d2a4a407e70aef1b8ef16fa6bf6
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES_HEADING`

```yaml
id: src/lib/content/services.ts::SERVICES_HEADING
source: src/lib/content/services.ts
path: SERVICES_HEADING
render: Services page, SERVICES_HEADING
narrative_slot: utility
en: What PunProfile helps you with
th: PunProfile ช่วยคุณเรื่องอะไรบ้าง
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: de94573ea6f0b4bfd9d612de0ab6efc24270683082abf835a37e5759eee7ec1e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES_INTRO`

```yaml
id: src/lib/content/services.ts::SERVICES_INTRO
source: src/lib/content/services.ts
path: SERVICES_INTRO
render: Services page, SERVICES_INTRO
narrative_slot: utility
en: >-
  Career coaching is the core service every client starts with. The other two can be taken on their own,
  depending on what you actually need.
th: >-
  Career Coaching เป็นบริการหลักที่ลูกค้าทุกคนเริ่มต้นด้วย
  ส่วนอีกสองบริการเลือกใช้แยกกันได้ตามสิ่งที่คุณต้องการ
provenance: paul-approved
date: 25/08/2026
term_bindings: []
decision_note: Read back 25/08/2026. `Career Coaching` for `แคเรียร์โค้ชชิ่ง`.
review:
  structural_calque: pass
  text_hash: 714f750d8a9cb8611612d736d53dea2cae6b1e515c65f898c347e34cd9e21e50
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES_PAGE_HEADING`

```yaml
id: src/lib/content/services.ts::SERVICES_PAGE_HEADING
source: src/lib/content/services.ts
path: SERVICES_PAGE_HEADING
render: Services page, SERVICES_PAGE_HEADING
narrative_slot: utility
en: Three services, and the one you start with
th: สามบริการ และจุดเริ่มต้นของคุณ
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: Paul's wording, 06/09/2026.
review:
  structural_calque: pass
  text_hash: ca110a6fc6eb9d678b843ca30906673dc3caa6c9c3e1eda8d489ffa86ea766fc
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES_PAGE_INTRO`

```yaml
id: src/lib/content/services.ts::SERVICES_PAGE_INTRO
source: src/lib/content/services.ts
path: SERVICES_PAGE_INTRO
render: Services page, SERVICES_PAGE_INTRO
narrative_slot: utility
en: >-
  The tools read what you already have. This is the part where someone reads it with you and decides what to
  do about it.
th: >-
  เครื่องมือต่าง ๆ อ่านสิ่งที่คุณมีอยู่แล้ว ส่วนตรงนี้คือการมีใครสักคนช่วยอ่านไปกับคุณ
  และช่วยกันตัดสินใจว่าจะทำอะไรกับสิ่งที่พบ
provenance: paul-written
date: 06/09/2026
term_bindings: []
decision_note: Paul's wording, 06/09/2026.
review:
  structural_calque: pass
  text_hash: 2b0da7381611c712577d9de1782696219d0e92096ff425327bfdd1ff89b40ed3
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES[0].image.alt`

```yaml
id: src/lib/content/services.ts::SERVICES[0].image.alt
source: src/lib/content/services.ts
path: SERVICES[0].image.alt
render: Services page, SERVICES[0].image.alt
narrative_slot: utility
en: The PunProfile character climbing steps towards a signpost
th: ตัวการ์ตูน PunProfile กำลังเดินขึ้นบันไดไปหาป้ายบอกทาง
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: e3c57d835eeff96fb057a58afce0691b77a5e2197129887a657489abb4f5a286
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES[0].includes[0]`

```yaml
id: src/lib/content/services.ts::SERVICES[0].includes[0]
source: src/lib/content/services.ts
path: SERVICES[0].includes[0]
render: Services page, SERVICES[0].includes[0]
narrative_slot: artefact
en: 'Getting the direction and the goal clear: the role, the industry, the country'
th: หาทิศทางและกำหนดเป้าหมายให้ชัด ทั้งตำแหน่ง อุตสาหกรรม และประเทศ
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 33510c3e6f01d7c15acc54c52c7778d0a6fd57d8756a8cf07d3d49f84637adab
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES[0].includes[1]`

```yaml
id: src/lib/content/services.ts::SERVICES[0].includes[1]
source: src/lib/content/services.ts
path: SERVICES[0].includes[1]
render: Services page, SERVICES[0].includes[1]
narrative_slot: artefact
en: A realistic look at where you stand right now against what the European market is asking for
th: ประเมินตามความเป็นจริงว่าตอนนี้คุณอยู่ตรงไหน เมื่อเทียบกับสิ่งที่ตลาดงานยุโรปต้องการ
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 7261af277cb13e6270f00859585a9587f9fece59cd83f769adcdd06d664d7273
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES[0].includes[2]`

```yaml
id: src/lib/content/services.ts::SERVICES[0].includes[2]
source: src/lib/content/services.ts
path: SERVICES[0].includes[2]
render: Services page, SERVICES[0].includes[2]
narrative_slot: artefact
en: Thinking through and deciding on a career change and a move abroad
th: ช่วยคิดและตัดสินใจเรื่องการเปลี่ยนสายงานและการย้ายประเทศ
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 1e7c008783da031286b0d9edc5053952722328c9c7fd3390df52a5faa4f03440
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES[0].includes[3]`

```yaml
id: src/lib/content/services.ts::SERVICES[0].includes[3]
source: src/lib/content/services.ts
path: SERVICES[0].includes[3]
render: Services page, SERVICES[0].includes[3]
narrative_slot: artefact
en: >-
  Finding the right position to stand in: what makes you worth hiring, and which employers are looking for
  someone like you
th: 'หาจุดยืนที่ใช่: อะไรทำให้คุณน่าจ้าง และนายจ้างแบบไหนกำลังมองหาคนอย่างคุณ'
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 8f899c776748aa404048b07654736ba5e546f5d26b534cda985688e42e0ad5ae
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES[0].includes[4]`

```yaml
id: src/lib/content/services.ts::SERVICES[0].includes[4]
source: src/lib/content/services.ts
path: SERVICES[0].includes[4]
render: Services page, SERVICES[0].includes[4]
narrative_slot: artefact
en: >-
  Sessions are held mainly in English, so every conversation doubles as practice for the interviews you are
  preparing for
th: เซสชันโค้ชชิ่งใช้ภาษาอังกฤษเป็นหลัก ทุกครั้งที่คุยกันจึงได้ฝึกภาษาอังกฤษสำหรับการสัมภาษณ์ไปในตัว
provenance: paul-written
date: 17/08/2026
term_bindings: []
decision_note: |-
  Added 17/08/2026 (Paul). The sessions were always in English; saying so

  turns a fact about how the service runs into a reason to buy it, since

  the interview this audience is preparing for is in English too.

  EN-FIRST, which is the wrong direction for this file: its header records

  that the words are Paul's Thai and the English is the translation. This

  one arrived in English, so the Thai below is mine and awaits his pass.

  Paul's wording, 17/08/2026. `เป็นหลัก` added, and it is a promise being

  made accurate rather than softened: sessions are mainly in English, and a

  flat claim that they ARE in English is one a Thai reader could hold

  against the first session that switches.
review:
  structural_calque: pass
  text_hash: ea08e55c655d244268a9ced20d5108b7b0b5fe97da44ee6a32836c4a35db7d4c
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES[0].name`

```yaml
id: src/lib/content/services.ts::SERVICES[0].name
source: src/lib/content/services.ts
path: SERVICES[0].name
render: Services page, SERVICES[0].name
narrative_slot: utility
en: Career Coaching
th: Career Coaching
provenance: paul-approved
date: 10/09/2026
term_bindings:
  - career-coaching
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 52c07619f9d994a04d36968aaaa5f3f792cf6c2130ae326871e9670be13fbcf8
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES[0].question`

```yaml
id: src/lib/content/services.ts::SERVICES[0].question
source: src/lib/content/services.ts
path: SERVICES[0].question
render: Services page, SERVICES[0].question
narrative_slot: utility
en: Where should you be heading, and why?
th: คุณควรมุ่งไปทางไหน และเพราะอะไร
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: a8f67d921c0174c7d7829c3a0db28d69f670345524d964c439156af194d3554d
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES[0].summary`

```yaml
id: src/lib/content/services.ts::SERVICES[0].summary
source: src/lib/content/services.ts
path: SERVICES[0].summary
render: Services page, SERVICES[0].summary
narrative_slot: utility
en: >-
  This is where every client starts. We get the direction clear before writing a single document, because
  however good a CV is, sent into the wrong market it is still an application aimed at nothing.
th: >-
  นี่คือจุดเริ่มต้นของลูกค้าทุกคน เราจะช่วยกันหาทิศทางให้ชัดก่อนลงมือเขียนเอกสาร เพราะต่อให้ CV ดีแค่ไหน
  ถ้าส่งไปผิดตลาด ก็ยังเป็นการสมัครที่ไม่ตรงเป้าอยู่ดี
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 2de07c7e7e22e03e90ef6c1b7f66936546ef3c53a9faf22cedfe1fc2e2eb9674
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES[1].image.alt`

```yaml
id: src/lib/content/services.ts::SERVICES[1].image.alt
source: src/lib/content/services.ts
path: SERVICES[1].image.alt
render: Services page, SERVICES[1].image.alt
narrative_slot: utility
en: The PunProfile character beside a laptop showing a profile page
th: ตัวการ์ตูน PunProfile ยืนข้างแล็ปท็อปที่เปิดหน้าโปรไฟล์อยู่
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 1abb2feb3c0883919d407fbdc1cf6b651a9df8a47cf9e0bfac04c2fcb3683686
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES[1].includes[0]`

```yaml
id: src/lib/content/services.ts::SERVICES[1].includes[0]
source: src/lib/content/services.ts
path: SERVICES[1].includes[0]
render: Services page, SERVICES[1].includes[0]
narrative_slot: artefact
en: A master CV to use as the template every other version comes from
th: CV ฉบับหลักสำหรับใช้เป็นต้นแบบของทุกฉบับ
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 2dcdc83f8d6e1caa53cea18ba5d0e53a5794e78b2cfa4f57fd3d511a1f494f38
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES[1].includes[1]`

```yaml
id: src/lib/content/services.ts::SERVICES[1].includes[1]
source: src/lib/content/services.ts
path: SERVICES[1].includes[1]
render: Services page, SERVICES[1].includes[1]
narrative_slot: artefact
en: >-
  Your LinkedIn profile, from the headline, summary and experience through to the keywords recruiters actually
  search
th: โปรไฟล์ LinkedIn ตั้งแต่พาดหัว บทสรุป และประสบการณ์ ไปจนถึงคีย์เวิร์ดที่รีครูตเตอร์ใช้ค้นหาผู้สมัคร
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 7b48e03524c5eee2279a179301f2804f4f8172e8177e773b538c7ebb6a7808b9
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES[1].includes[2]`

```yaml
id: src/lib/content/services.ts::SERVICES[1].includes[2]
source: src/lib/content/services.ts
path: SERVICES[1].includes[2]
render: Services page, SERVICES[1].includes[2]
narrative_slot: artefact
en: >-
  A portfolio site for non-IT fields, built from your real results and cases, not just a project list like a
  developer's portfolio
th: เว็บไซต์ Portfolio สำหรับสายงานนอกไอที สร้างจากผลงานและกรณีศึกษาจริงของคุณ ไม่ใช่เพียงรายการโปรเจกต์
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: b00100d5648aadd4589296de1ffb270a950b7a86a74f5724a364d04cabf79e3b
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES[1].name`

```yaml
id: src/lib/content/services.ts::SERVICES[1].name
source: src/lib/content/services.ts
path: SERVICES[1].name
render: Services page, SERVICES[1].name
narrative_slot: utility
en: Getting your profile ready to apply
th: ปรับโปรไฟล์ให้พร้อมสมัครงาน
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 2de494abe672189716da4efc8d653e61555d5902784c14cdc9799f8c9659735d
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES[1].question`

```yaml
id: src/lib/content/services.ts::SERVICES[1].question
source: src/lib/content/services.ts
path: SERVICES[1].question
render: Services page, SERVICES[1].question
narrative_slot: utility
en: Does your profile say who you are clearly and compellingly enough?
th: โปรไฟล์ของคุณสื่อสารตัวตนได้ชัดและน่าสนใจพอหรือยัง
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: ad57226e04712827c31c359b790df0aee7965aaec014a13d794a21bc3a242102
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES[1].summary`

```yaml
id: src/lib/content/services.ts::SERVICES[1].summary
source: src/lib/content/services.ts
path: SERVICES[1].summary
render: Services page, SERVICES[1].summary
narrative_slot: utility
en: >-
  This service builds the core set of documents you reuse for every application. We get the base versions
  ready; tailoring them to a specific role is the next service.
th: >-
  บริการนี้จะช่วยสร้างชุดเอกสารหลักที่คุณนำกลับมาใช้เป็นพื้นฐานในการสมัครแต่ละครั้งได้
  เราจะทำเวอร์ชันตั้งต้นให้พร้อม ส่วนการปรับให้ตรงกับแต่ละตำแหน่งจะอยู่ในบริการถัดไป
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: c0130030e09da3b38a62107b98fa923b7769441a6f8a70360a84dc49156cc398
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES[2].image.alt`

```yaml
id: src/lib/content/services.ts::SERVICES[2].image.alt
source: src/lib/content/services.ts
path: SERVICES[2].image.alt
render: Services page, SERVICES[2].image.alt
narrative_slot: utility
en: The PunProfile character reading a document through a magnifying glass
th: ตัวการ์ตูน PunProfile กำลังส่องเอกสารด้วยแว่นขยาย
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 02553e05239580e4b504de85f187925fe38c970a2af1c64739244caac36ec4ef
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES[2].includes[0]`

```yaml
id: src/lib/content/services.ts::SERVICES[2].includes[0]
source: src/lib/content/services.ts
path: SERVICES[2].includes[0]
render: Services page, SERVICES[2].includes[0]
narrative_slot: artefact
en: Shortlisting roles that match your profile and your goals
th: คัดตำแหน่งที่ตรงกับโปรไฟล์และเป้าหมายของคุณ
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 2a13c53c2693abcd82018fa3b8189b8121ff6c16debdaf64d259dd825473877e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES[2].includes[1]`

```yaml
id: src/lib/content/services.ts::SERVICES[2].includes[1]
source: src/lib/content/services.ts
path: SERVICES[2].includes[1]
render: Services page, SERVICES[2].includes[1]
narrative_slot: artefact
en: Tailoring your CV and cover letter to each role
th: ปรับ CV และจดหมายสมัครงานให้ตรงกับแต่ละตำแหน่ง
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 860a5436023ae2ac8b7cc7d29138a7f5a2715d4166f7e106025f31f10a744b7a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES[2].includes[2]`

```yaml
id: src/lib/content/services.ts::SERVICES[2].includes[2]
source: src/lib/content/services.ts
path: SERVICES[2].includes[2]
render: Services page, SERVICES[2].includes[2]
narrative_slot: artefact
en: Interview preparation for that specific role and that specific company
th: เตรียมสัมภาษณ์ให้ตรงกับตำแหน่งและบริษัทนั้นโดยเฉพาะ
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 673759027a15f08c8b2ca567373ef4c39fe646fda73bc20f8b9742d60ccd8ac3
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES[2].includes[3]`

```yaml
id: src/lib/content/services.ts::SERVICES[2].includes[3]
source: src/lib/content/services.ts
path: SERVICES[2].includes[3]
render: Services page, SERVICES[2].includes[3]
narrative_slot: artefact
en: Evaluating the offer, helping you negotiate, and checking the contract
th: ช่วยประเมินข้อเสนอ เตรียมการเจรจาต่อรอง และชี้ประเด็นในสัญญาที่ควรสอบถามเพิ่มเติม
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: de3400fe2e7ccc80f645ed9a219930cddfbba11003be73f0f38902fefc248ca5
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES[2].name`

```yaml
id: src/lib/content/services.ts::SERVICES[2].name
source: src/lib/content/services.ts
path: SERVICES[2].name
render: Services page, SERVICES[2].name
narrative_slot: utility
en: Handling an application start to finish
th: ดูแลการสมัครงานตั้งแต่ต้นจนจบ
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 486842ff4169e691035bf955f1239c0f4938b719592cc09b6a184580c0ce484d
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES[2].question`

```yaml
id: src/lib/content/services.ts::SERVICES[2].question
source: src/lib/content/services.ts
path: SERVICES[2].question
render: Services page, SERVICES[2].question
narrative_slot: utility
en: What does it actually take to run one application through every stage?
th: สมัครงานหนึ่งตำแหน่งให้ครบทุกขั้นตอน ต้องทำอย่างไรบ้าง
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 38db8972ab4be666fc7a6075bad0e75863d95835a90cd41e56d9c7dea50f0a38
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/content/services.ts::SERVICES[2].summary`

```yaml
id: src/lib/content/services.ts::SERVICES[2].summary
source: src/lib/content/services.ts
path: SERVICES[2].summary
render: Services page, SERVICES[2].summary
narrative_slot: utility
en: >-
  We handle applications one role at a time, from finding the job through to signing the contract. The roles
  we shortlist are searched specifically against your profile and your goals, not one list sent to everybody.
th: >-
  เราทำงานร่วมกับคุณในการสมัครทีละตำแหน่ง ตั้งแต่ค้นหางานจนถึงขั้นเซ็นสัญญา
  ตำแหน่งที่คัดให้จะค้นหาตามโปรไฟล์และเป้าหมายของคุณโดยเฉพาะ ไม่ใช่รายการเดียวที่ส่งให้ทุกคน
provenance: paul-written
date: 14/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: f5405fe4fd3b0f65de0f3613f7f4045337e811fb238eac7007aabca73f2cca93
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/levers.ts::MOVES[0].candidate`

```yaml
id: src/lib/levers.ts::MOVES[0].candidate
source: src/lib/levers.ts
path: MOVES[0].candidate
render: EU Fit Check next-step cards, MOVES[0].candidate
narrative_slot: utility
en: Name the one role you are aiming at. Everything after this step gets easier once it is specific.
th: กำหนดตำแหน่งงานเป้าหมายให้ชัดก่อน เมื่อรู้ว่ากำลังมองหางานแบบไหน การตัดสินใจในขั้นตอนต่อจากนี้จะง่ายขึ้นมาก
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved this Thai unchanged.
review:
  structural_calque: pass
  text_hash: 0300cf7a297ee8f1c45ad3d7bc47ddc88fec6898c2230f29227033a4b65ee610
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/levers.ts::MOVES[1].candidate`

```yaml
id: src/lib/levers.ts::MOVES[1].candidate
source: src/lib/levers.ts
path: MOVES[1].candidate
render: EU Fit Check next-step cards, MOVES[1].candidate
narrative_slot: utility
en: >-
  Retailor your CV for the European market. It is the first thing an employer sees, and format alone filters
  people out.
th: >-
  ปรับ CV ให้เข้ากับตลาดงานยุโรป เพราะนี่มักเป็นสิ่งแรกที่นายจ้างเห็น ต่อให้ประสบการณ์ดี
  แต่ถ้ารูปแบบหรือเนื้อหาไม่ตรงกับที่เขาคุ้นเคย ก็อาจถูกมองข้ามได้
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 96549d6633eefc0dd1c8e1b805b507154ed806e337ce352f66a70308072cb24e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/levers.ts::MOVES[10].candidate`

```yaml
id: src/lib/levers.ts::MOVES[10].candidate
source: src/lib/levers.ts
path: MOVES[10].candidate
render: EU Fit Check next-step cards, MOVES[10].candidate
narrative_slot: utility
en: 'Make AI research a weekly habit: companies, visa rules, salary ranges, one hour, every week.'
th: >-
  ลองกันเวลาสัปดาห์ละ 1 ชั่วโมงให้ AI ช่วยค้นคว้าเรื่องบริษัท กฎวีซ่า และช่วงเงินเดือน
  แล้วตรวจสอบข้อมูลสำคัญกับแหล่งข้อมูลต้นทางทุกครั้ง
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 213365dc35970ecaed5393551ddb41183042499dcc98289a83a97466abcc688e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/levers.ts::MOVES[11].candidate`

```yaml
id: src/lib/levers.ts::MOVES[11].candidate
source: src/lib/levers.ts
path: MOVES[11].candidate
render: EU Fit Check next-step cards, MOVES[11].candidate
narrative_slot: utility
en: Get hands-on with Slack, Teams, and Notion. These tools are common in European workplaces.
th: ฝึกใช้ Slack, Teams และ Notion ให้คุ้นมือ เพราะเป็นเครื่องมือที่พบได้บ่อยในทีมและองค์กรยุโรป
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 1fb58ea737e48dc35000b0068514f183548b6dc0b32111b7972b9ed35b907441
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/levers.ts::MOVES[12].candidate`

```yaml
id: src/lib/levers.ts::MOVES[12].candidate
source: src/lib/levers.ts
path: MOVES[12].candidate
render: EU Fit Check next-step cards, MOVES[12].candidate
narrative_slot: utility
en: Use AI to tailor your CV and cover letter to each specific role instead of sending one version everywhere.
th: >-
  ใช้ AI ช่วยปรับ CV และจดหมายสมัครงานให้เข้ากับแต่ละตำแหน่ง แล้วตรวจทานด้วยตัวเองก่อนส่ง
  แทนการใช้เอกสารฉบับเดียวสมัครทุกงาน
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: ee0d893c3a490467c3eb752e6f0d07cfa4a91b71cc2bd005a1d01bae88ae9e4a
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/levers.ts::MOVES[13].candidate`

```yaml
id: src/lib/levers.ts::MOVES[13].candidate
source: src/lib/levers.ts
path: MOVES[13].candidate
render: EU Fit Check next-step cards, MOVES[13].candidate
narrative_slot: utility
en: Choose one job-search tool yourself, such as an application tracker, and make it part of your routine.
th: >-
  เลือกเครื่องมือใหม่มาลองใช้ด้วยตัวเองสักหนึ่งอย่าง เช่น เครื่องมือติดตามใบสมัคร แล้วใช้ต่อเนื่องจนคล่อง
  โดยไม่ต้องรอให้มีใครมาบอกว่าควรเริ่มเมื่อไร
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 37f5636af4f723fb402961691ec559390cb228c073d2710a9cea5c1785d2bc7d
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/levers.ts::MOVES[2].candidate`

```yaml
id: src/lib/levers.ts::MOVES[2].candidate
source: src/lib/levers.ts
path: MOVES[2].candidate
render: EU Fit Check next-step cards, MOVES[2].candidate
narrative_slot: utility
en: Wake up your LinkedIn. European recruiters search there directly, and a quiet profile is invisible to them.
th: >-
  กลับมาอัปเดต LinkedIn ให้มีความเคลื่อนไหว รีครูตเตอร์ในยุโรปใช้ช่องทางนี้ค้นหาผู้สมัครโดยตรง
  โปรไฟล์ที่ไม่ได้อัปเดตเลยจึงมีโอกาสถูกเห็นน้อยลง
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: b9234549d6fbce6d46252d96f0672a863281d89d28ee97c4c10a07cec7a77a5e
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/levers.ts::MOVES[3].candidate`

```yaml
id: src/lib/levers.ts::MOVES[3].candidate
source: src/lib/levers.ts
path: MOVES[3].candidate
render: EU Fit Check next-step cards, MOVES[3].candidate
narrative_slot: utility
en: >-
  Find and name the specific visa route you would use. Knowing the route changes which employers are even
  worth applying to.
th: >-
  ค้นหาและระบุเส้นทางวีซ่าที่เหมาะกับคุณให้ชัด
  การรู้เส้นทางนี้จะช่วยคัดกรองว่าบริษัทไหนและตำแหน่งไหนคุ้มค่าที่จะสมัคร
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved the supplied suggested revision.
review:
  structural_calque: pass
  text_hash: 6866875bed5721dc70a9e654ead416bd222e6fdb8cda4a70ca34bb5b3775210e
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/levers.ts::MOVES[4].candidate`

```yaml
id: src/lib/levers.ts::MOVES[4].candidate
source: src/lib/levers.ts
path: MOVES[4].candidate
render: EU Fit Check next-step cards, MOVES[4].candidate
narrative_slot: utility
en: Spend one session learning what working in Europe legally requires. It is the single fastest gap to close.
th: >-
  กันเวลาศึกษากฎและเงื่อนไขการทำงานในประเทศเป้าหมาย เรื่องนี้อาจดูซับซ้อน แต่ยิ่งรู้เร็ว
  ก็ยิ่งวางแผนเรื่องอื่นได้ตรงขึ้น
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 36c328d0369b38ac1bd655bb3ce3f9f8f62c7cdc19155013769956bc4c0c07fb
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/levers.ts::MOVES[5].candidate`

```yaml
id: src/lib/levers.ts::MOVES[5].candidate
source: src/lib/levers.ts
path: MOVES[5].candidate
render: EU Fit Check next-step cards, MOVES[5].candidate
narrative_slot: utility
en: >-
  Work out a salary expectation for your target country, with currency and period. It anchors every later
  conversation.
th: >-
  หาข้อมูลช่วงเงินเดือนของตำแหน่งที่สนใจในประเทศเป้าหมาย แล้วกำหนดตัวเลขที่คาดหวังให้ชัด
  อย่าลืมระบุสกุลเงินและคิดเป็นรายเดือนหรือรายปี เพื่อใช้เป็นจุดอ้างอิงในการคุยครั้งต่อไป
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 10200a929dc51945735bdc17eb58fd9c17327a1d2d040200181c84304b7862a2
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/levers.ts::MOVES[6].candidate`

```yaml
id: src/lib/levers.ts::MOVES[6].candidate
source: src/lib/levers.ts
path: MOVES[6].candidate
render: EU Fit Check next-step cards, MOVES[6].candidate
narrative_slot: utility
en: >-
  Put two or three pieces of your work somewhere an employer can see them. Evidence argues better than
  adjectives.
th: >-
  เลือกผลงานที่ดีที่สุด 2–3 ชิ้น แล้วนำไปไว้ในที่ที่นายจ้างเปิดดูได้ง่าย
  ผลงานจริงช่วยให้เห็นความสามารถของคุณชัดกว่าคำบรรยายเพียงอย่างเดียว
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: 94a7a92cc0ea0d9c461b0ebd60284ea6ce234625a9d018d5e8776dfd07dd30d4
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/levers.ts::MOVES[7].candidate`

```yaml
id: src/lib/levers.ts::MOVES[7].candidate
source: src/lib/levers.ts
path: MOVES[7].candidate
render: EU Fit Check next-step cards, MOVES[7].candidate
narrative_slot: utility
en: Send your first five targeted applications and track each one. Nothing downstream starts until these go out.
th: >-
  ส่งใบสมัคร 5 ตำแหน่งแรกที่เล็งไว้ แล้วติดตามสถานะแต่ละตำแหน่ง
  เพราะขั้นตอนถัดไปจะเริ่มได้ก็ต่อเมื่อคุณส่งใบสมัครเหล่านี้ออกไปก่อน
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved the supplied suggested revision.
review:
  structural_calque: pass
  text_hash: f0ca23a6aebd3d836a7e726f82ffe9a610f09e0eaf59bc42df5841547dbc67f8
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```

<!-- COPY-ENTRY -->
### `src/lib/levers.ts::MOVES[8].candidate`

```yaml
id: src/lib/levers.ts::MOVES[8].candidate
source: src/lib/levers.ts
path: MOVES[8].candidate
render: EU Fit Check next-step cards, MOVES[8].candidate
narrative_slot: utility
en: >-
  Start a steady English routine aiming at fluent professional level. It moves slowly, which is exactly why
  starting now matters.
th: >-
  ฝึกภาษาอังกฤษอย่างสม่ำเสมอ โดยตั้งเป้าให้ใช้ทำงานได้คล่องขึ้น ทักษะนี้ต้องใช้เวลา
  จึงควรเริ่มฝึกตั้งแต่ตอนนี้
provenance: paul-approved
date: 15/08/2026
term_bindings: []
decision_note: No string-local reasoning comment was present at migration.
review:
  structural_calque: pass
  text_hash: e671d979d163ed808281db6c0d1447b1f7651041f0b879e2516cad0cc24ecd16
  prompt_version: structural-calque-v1
  basis: Paul-authored or Paul-approved Thai is authoritative by project decision.
```

<!-- COPY-ENTRY -->
### `src/lib/levers.ts::MOVES[9].candidate`

```yaml
id: src/lib/levers.ts::MOVES[9].candidate
source: src/lib/levers.ts
path: MOVES[9].candidate
render: EU Fit Check next-step cards, MOVES[9].candidate
narrative_slot: utility
en: >-
  Set up your AI job-search toolkit: weekly AI research, the workplace tools European teams use, AI-tailored
  applications, and one tracker you pick yourself.
th: >-
  ตั้งชุดเครื่องมือหางานด้วย AI ให้ตัวเอง: วิจัยงานด้วย AI ทุกสัปดาห์ เครื่องมือที่ทีมในยุโรปใช้
  ปรับใบสมัครด้วย AI และเลือกเครื่องมือติดตามสถานะเองหนึ่งอย่าง
provenance: paul-approved
date: 10/09/2026
term_bindings: []
decision_note: |-
  No string-local reasoning comment was present at migration.

  Consolidated review applied 10/09/2026. Paul approved the supplied suggested revision.
review:
  structural_calque: pass
  text_hash: da4f7c6b915d11c8eba30b9d63dfc904168dbc0309f8dbca60124dcda3b21506
  prompt_version: structural-calque-v1
  basis: Paul approved this item through the consolidated language review on 10/09/2026.
```
