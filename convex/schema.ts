import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
import { rowInput } from "./situationRows";

/**
 * Data model per `docs/prd.md` § 3, plus the `assessments` snapshot table from
 * `docs/candidate-data-architecture.md` L3.
 *
 * `assessments` stores EVIDENCE, never scores: scores are a pure function of
 * responses, so a scoring fix retroactively corrects history instead of
 * contradicting it. Since 15/08/2026 `leads.scores` follows the same rule and
 * is no longer written or read; see its own note below.
 */
/**
 * The stamp every row of `leads.situation` carries, per
 * `candidate-situation-handoff.md` § 4: which of the three writers set the
 * value, when, and the evidence it was read off. Spread into each row rather
 * than nested under it, so a row reads as one record.
 *
 * `by` is the coach's address for a coach change and absent otherwise: the
 * candidate and the system are named by `source` already.
 *
 * `evidence` is where the value came from in words, a call date or a document,
 * kept because a seeded value and a value the candidate gave are not equally
 * firm and the panel has to be able to say which it holds.
 */
const situationRow = {
  source: v.union(v.literal("candidate"), v.literal("coach"), v.literal("system")),
  at: v.number(),
  by: v.optional(v.string()),
  evidence: v.optional(v.string()),
};

export default defineSchema({
  // Convex Auth's own tables (users, sessions, accounts...). Only coach
  // accounts on the `ADMIN_EMAILS` allowlist ever land here (two as of
  // 20/08/2026); candidates are leads, not users.
  ...authTables,

  // One row per candidate session, from first partial answer onward.
  leads: defineTable({
    // Contact info: all optional until captured. Decided 08/08/2026, the unlock
    // requires a full name, an email, AND at least one of LINE ID or phone.
    // Email alone is not enough: it keeps the magic link deliverable (FR-011)
    // but Thai candidates largely do not read email, so a lead reachable only
    // there is not reachable. The live Lead Discovery Survey already asked for
    // both (`08_Coaching_Business.md` § A.1 and § A.3); the app had narrowed it
    // to email, which was a regression rather than a simplification.
    //
    // One field, not first/last: the survey asked ชื่อ-นามสกุล as a single
    // question, and a forced split produces junk for candidates who go by a
    // nickname.
    /**
     * Split since 10/08/2026. `fullName` is kept and still written, composed
     * from the two, because the 90 imported survey leads only ever had one
     * field and every read path already uses it.
     */
    /** @absent unmeasured — not captured until the contact gate clears */
    firstName: v.optional(v.string()),
    /**
     * What the candidate is called, set by the coach, 02/11/2026. Thai
     * candidates go by a nickname, and their dashboard and the coach's page
     * lead with it. Fallback order everywhere: nickname, firstName, fullName.
     */
    /** @absent none — the coach has not set one */
    nickname: v.optional(v.string()),
    /** IANA zone the candidate selected for their appointments, § 7b.
     *  @absent notyet — not selected; pages show Madrid, labelled, never a guess */
    timeZone: v.optional(v.string()),
    /** @absent unmeasured — not captured until the contact gate clears */
    lastName: v.optional(v.string()),
    /** @absent unmeasured — composed from the two above once both exist */
    fullName: v.optional(v.string()),
    /** @absent unmeasured — not captured until the contact gate clears */
    email: v.optional(v.string()),
    /** @absent none — they gave LINE instead; one of the two is required, not both */
    phone: v.optional(v.string()),
    /** @absent none — they gave a phone number instead; one of the two is required */
    lineId: v.optional(v.string()),

    /**
     * Consent: each with its own timestamp for the PDPA audit trail.
     *
     * **Superseded 15/08/2026 by `consentEvents`, still written.** These are in
     * the middle of the same three-step retirement `leads.scores` went through:
     * dual-write now, stop reading next, clear and remove last. Every read path
     * already resolves from `consentEvents`; these remain only so a rollback
     * before the backfill is verified does not lose the grants.
     *
     * Do not add a fourth. A new channel or a new purpose is an event.
     */
    /** @absent notyet — legacy. absent means no grant recorded in the old shape */
    emailConsentAt: v.optional(v.number()),
    /** @absent notyet — legacy. absent means the channel was left blank */
    phoneConsentAt: v.optional(v.number()),
    /** @absent notyet — legacy. absent means the channel was left blank */
    lineConsentAt: v.optional(v.number()),

    /**
     * Where the consent above came from. `app` means it passed through the
     * contact gate: a per-channel tick, timestamped at the moment it was given.
     * `survey_import` means it came from the Lead Discovery Survey, which asked
     * "ช่องทางติดต่อที่สะดวกที่สุด" and carried no consent clause at all, so the
     * timestamp is the submission date and the basis is the question rather
     * than an explicit grant.
     *
     * Absent means `app`, since every lead predating the backfill came through
     * the gate. The distinction is recorded because a PDPA request asks what
     * someone agreed to, and "they told us how to reach them" and "they ticked
     * a box saying we may" are not the same answer.
     */
    /** @absent default:"app" — every lead predating the 10/08/2026 backfill came through the gate */
    consentSource: v.optional(v.union(v.literal("app"), v.literal("survey_import"))),

    // Relocation pathway: asked early, shapes the self-report commentary.
    /** @absent unmeasured — they have not reached question 1 yet */
    pathway: v.optional(
      v.union(
        v.literal("job_first"),
        v.literal("study_first"),
        v.literal("family"),
        v.literal("not_sure"),
      ),
    ),

    // Raw answers keyed by question id. Deliberately loose: the question set
    // will evolve, and a rigid per-question schema would need a migration on
    // every content change. Shape is validated in application code.
    /** @absent default:{} — no question answered yet */
    responses: v.optional(v.record(v.string(), v.any())),

    /**
     * **Legacy. Written by nothing, read by nothing, since 15/08/2026.**
     *
     * This held the denormalised dimension scores, computed at answer time.
     * PRD § 3 justified the denormalisation as what made the chart reactive
     * without a round-trip, and that turned out not to be what it was buying:
     * recomputing inside the query is just as reactive.
     *
     * What it did buy was drift. A stored score is a number produced by
     * whichever model was running the day the candidate answered, and Country
     * Reach landing on 13/08/2026 invalidated every score computed before it
     * without anything noticing. Every read now calls `scoresFor`.
     *
     * Kept in the schema only because ~160 documents still carry the field and
     * removing it needs a migration to clear them first. The values in those
     * documents are stale by construction and must not be read.
     */
    /** @absent none — dead field. written by nothing, read by nothing since 15/08/2026 */
    scores: v.optional(
      v.object({
        professionalCapability: v.optional(v.number()),
        employability: v.optional(v.number()),
        mobilityReadiness: v.optional(v.number()),
        europeanMarketFit: v.optional(v.number()),
      }),
    ),

    /**
     * The coach's own judgement about whether this lead should be worked at
     * all. Added 15/08/2026.
     *
     * **Separate from `status` on purpose.** `status` is how far through the
     * assessment they got, which is a fact about them. This is a decision about
     * us. Conflating the two is how a funnel report starts counting a judgement
     * as a stage.
     *
     * `disqualified` is Gate 1 from `08_Coaching_Business.md`: not a
     * white-collar or IT professional, so out of scope. That document is
     * explicit that such a lead "is excluded, not scored 0", and until now
     * there was nowhere to record the exclusion.
     *
     * `not_now` is a real answer that is not a rejection: right person, wrong
     * moment. It exists so that parking someone does not require calling them
     * disqualified, which would be false and would follow them. It stayed its
     * own status rather than becoming a flag on `nurturing`, on Paul's call
     * 26/08/2026: a parked lead is a different working state from one being
     * actively worked.
     *
     * **Absent is the normal state and means nobody has judged**, not that the
     * lead passed. Never read an absent value as qualified.
     */
    /**
     * **Widened into the CRM status, 26/08/2026.** It held `disqualified` and
     * `not_now` and no row had ever been set, so widening cost no migration.
     *
     * These are the four statuses Paul sets by hand. The other three are read
     * off evidence and are never stored: `quoted` and `closed_won` come from
     * the `engagements` rows, because those carry the figures and a hand-set
     * label could disagree with the money, and `new` is the absence of both.
     * `crmStatusFor()` in `src/lib/crm.ts` resolves the one shown.
     *
     * **Storing these does not break the no-stored-state rule** that keeps
     * `lifecycle.ts` computing everything. That rule protects derivations,
     * which go stale when the rule behind them moves. These are decisions, and
     * a decision is a record of what a person chose on a day.
     *
     * **Absent is the normal state and means New**, not that they passed
     * anything. Never read an absent value as qualified.
     */
    /** @absent notyet — nobody has worked this lead. Displays as New */
    crmStatus: v.optional(
      v.union(
        v.literal("nurturing"),
        v.literal("not_now"),
        v.literal("quoted"),
        v.literal("closed_won"),
        v.literal("closed_lost"),
        v.literal("disqualified"),
      ),
    ),
    /** Why. Required by the mutation for `disqualified` only: that one is a
     *  judgement about a person and will outlive whoever made it. Closed lost
     *  is a fact about a deal and "they went quiet" is a complete answer. */
    /** @absent none — only present alongside a status Paul set */
    crmStatusReason: v.optional(v.string()),
    /** @absent none — only present alongside a status Paul set */
    crmStatusAt: v.optional(v.number()),
    /** Which admin decided. Their own data, not the subject's. */
    /** @absent none — only present alongside a status Paul set */
    crmStatusBy: v.optional(v.string()),

    /**
     * The candidate's LinkedIn, when the coach finds it.
     *
     * Added 16/08/2026. The assessment asks how good their LinkedIn is and
     * never asks where it is, which was fine while nothing left the app and
     * stopped being fine the moment a coach read one profile and wanted to keep
     * the link. `linkedin` in `responses` is a self-rated state; this is an
     * address, and they are not the same field.
     *
     * Coach-entered, never candidate-entered, so it carries no consent
     * question of its own beyond the lead already being in the database.
     */
    /** @absent unmeasured — the coach has not looked them up */
    linkedinUrl: v.optional(v.string()),

    /**
     * The coach's own running note on this person.
     *
     * One editable field rather than an append-only log, which is what was
     * asked for and is the right shape for a scratchpad. The cost is real and
     * worth stating: **there is no history**, so an overwrite loses what was
     * there. If it starts carrying decisions rather than context, it should
     * become a table, and `consultations.notes` is already the place for
     * anything tied to a specific call.
     *
     * Personal data about the subject, so it is erased with the lead. That is
     * automatic here and would not be from a separate table; see `erase.ts`.
     */
    /** @absent unmeasured — nobody has written a note */
    notes: v.optional(v.string()),
    /** @absent none — only present alongside a note */
    notesAt: v.optional(v.number()),
    /** @absent none — only present alongside a note */
    notesBy: v.optional(v.string()),

    /**
     * The coach's own read of this person, one to five.
     *
     * **Not a score and it must never feed one.** `grade` is computed from ICP
     * inputs and `scores` from the assessment; both are evidence-derived and
     * both are auditable. This is a judgement after talking to someone, which
     * is exactly the thing the framework cannot reach, and its value is that it
     * is subjective rather than despite it.
     *
     * Kept separate from `crmStatus` on purpose. The status answers where they
     * are in the pipeline; this answers how promising they feel, and a lead can
     * be a 5 and still be `not_now`. Blank until Paul has met them: a rating
     * nobody has given is not a low rating.
     */
    /** @absent unmeasured — the coach has not rated them */
    coachRating: v.optional(v.number()),
    /** @absent none — only present alongside a rating */
    coachRatingAt: v.optional(v.number()),
    /** @absent none — only present alongside a rating */
    coachRatingBy: v.optional(v.string()),

    /**
     * Whether this person has actually sent their CV. Added 24/08/2026.
     *
     * **Not `responses.cv`, and the two must never be read as one.**
     * `responses.cv` is the candidate's own rating of the CV they have
     * (`none`, `untailored`, `out_dated`, `europe_ready`) and it is an answer
     * to a form. This is a coach's tick meaning a document arrived, by email or
     * on LINE, and it is the precondition the Kick-start call actually waits
     * on.
     *
     * A timestamp rather than a boolean, for the same reason the consent fields
     * are: "we have their CV" is a fact with a date, and the date is what says
     * whether it predates the last time they were asked for one.
     *
     * **It feeds nothing.** It does not move `grade`, it is not an input to the
     * In Scope gate, and a delivered CV review belongs in `deliverables`. It
     * exists so the list can be worked without opening every row.
     */
    /** @absent notyet — no CV has arrived, or nobody has ticked it */
    cvReceivedAt: v.optional(v.number()),
    /** When a coach put the paid Fit Report on the candidate's own page.
     *  Built at click time from the answers and the coach's ratings, as on the
     *  Candidate 360; nothing is stored but this switch.
     *  @absent notyet — not shared */
    fitReportSharedAt: v.optional(v.number()),
    /** The candidate's own weekly target for applications sent, Teal's goal
     *  ring. Set by them on their page. @absent none — no goal set */
    weeklyApplicationGoal: v.optional(v.number()),
    /** Matched roles: the most sent in a Madrid Monday-to-Sunday week, set by
     *  the candidate or the coach, `prd.md` § 8. @absent default — 3 */
    matchWeeklyMax: v.optional(v.number()),
    /** When matched roles were paused. Nothing is sent while it is set.
     *  @absent none — not paused */
    matchPausedAt: v.optional(v.number()),
    /** When the next matched-role notice is scheduled to go, so a second send
     *  the same day does not schedule another. @absent none — nothing pending */
    matchNoticeAt: v.optional(v.number()),
    /** When the last matched-role notice went. @absent notyet — never sent */
    matchNoticeSentAt: v.optional(v.number()),
    /** @absent none — only present alongside a received CV */
    cvReceivedBy: v.optional(v.string()),

    /**
     * The candidate's current situation: the first panel on the Session tab,
     * `candidate-situation-handoff.md`. Everything a coach or an agent needs
     * before contacting them, in the one place every candidate-facing message,
     * match reason and search is written from.
     *
     * Fields on the lead rather than a table of their own: one per person,
     * read with the lead, erased with the lead, carried in the subject-access
     * export.
     *
     * Each row carries where its value came from and when it changed, because
     * three different things write this panel and only three: the candidate,
     * at intake and through their own actions on their page; the coach, at the
     * end-of-session close and nowhere else; and the system, for an event it
     * records itself. A fact a skill needs and cannot find here is a gap to
     * raise, not something to fill from a working file.
     *
     * Every row is optional and absent means nobody has established it yet,
     * which is not the same as none: an empty pay floor is "no floor agreed",
     * never "any salary will do". A gate reading an absent row holds the role
     * rather than passing it.
     */
    /** @absent unmeasured — the panel has not been filled for this candidate */
    situation: v.optional(
      v.object({
        /**
         * Where they are going. The titles belong to `targets` and are read
         * from there; only the geography is stored here.
         */
        goal: v.optional(v.object({ ...situationRow, countries: v.array(v.string()), cities: v.array(v.string()) })),
        /**
         * The level they are aiming at, in the coach's own words: a first
         * manager role, a senior IC role with scope. A line and not a band,
         * because the mapping from a Thai title to a European one is where a
         * band breaks, and nothing is gated on it. It is read into a draft,
         * never compared.
         */
        seniority: v.optional(v.object({ ...situationRow, text: v.string() })),
        /**
         * How they can legally work there, in the coach's own words, and the
         * date the answer changes when it is known.
         */
        workRoute: v.optional(v.object({ ...situationRow, text: v.string(), changesOn: v.optional(v.string()) })),
        /** Earliest start date, ISO, `YYYY-MM` where only the month is known. */
        availableFrom: v.optional(v.object({ ...situationRow, date: v.string() })),
        /**
         * What an employer has to offer for a role to be worth sending:
         * sponsorship or not, the floor under the pay, and the languages they
         * hold. `required_until_available` is the real third state, a candidate
         * who needs sponsorship now and will not once their start date passes.
         */
        employersMustOffer: v.optional(
          v.object({
            ...situationRow,
            sponsorship: v.union(v.literal("required"), v.literal("not_required"), v.literal("required_until_available")),
            payFloor: v.optional(
              v.object({ amount: v.number(), currency: v.string(), per: v.union(v.literal("year"), v.literal("month")) }),
            ),
            languages: v.array(v.string()),
          }),
        ),
        /** Objections employers have already put to them, in their own words. */
        heardFromEmployers: v.optional(v.object({ ...situationRow, objections: v.array(v.string()) })),
        /** One line, coach-written: what is happening this week. */
        whereTheyAreNow: v.optional(v.object({ ...situationRow, text: v.string() })),
        /**
         * The one thing PunProfile owes them next, and the date it is owed by.
         * `doneAt` closes it; until then it shows at the top of the page and on
         * the CRM list, and the evening run reads it.
         */
        nextFromUs: v.optional(
          v.object({ ...situationRow, text: v.string(), dueOn: v.optional(v.string()), doneAt: v.optional(v.number()) }),
        ),
      }),
    ),

    // Lifecycle. `email_captured` keeps the PRD's vocabulary, but since
    // 08/08/2026 it means the whole contact set cleared the gate: name, email
    // and a LINE ID or phone number.
    status: v.union(
      v.literal("partial"),
      v.literal("email_captured"),
      v.literal("completed"),
    ),
    /**
     * Set by hand from the admin list rather than earned. Added 24/08/2026 on
     * Paul's call, over the objection recorded here.
     *
     * `status` is normally written by the funnel: `captureContact` moves a lead
     * to `email_captured` when the contact gate clears, and finishing the
     * assessment moves it to `completed`. Those transitions are evidence. A
     * hand-set one is a claim, and the two must not be indistinguishable,
     * because every funnel number on this app is a count of this column:
     * `stats.community`, the abandoned-versus-finished split, and the
     * denominator under the booking cut.
     *
     * So an override is stamped. **Nothing reads the stamp, and that is a
     * decision rather than an omission** (Paul, 24/08/2026, having been asked
     * the question directly). `stats.community`, the abandoned-versus-finished
     * split and the booking-cut denominator all count a hand-set row exactly
     * like an earned one, so those numbers describe the working picture rather
     * than the form's behaviour. Do not "fix" this by filtering on
     * `statusOverrideAt`: at one to four leads a week the measured funnel is
     * not the question being asked of this screen, and splitting the two would
     * put two different answers to "how many completed" on one page.
     *
     * The stamp is an audit trail. It says a human touched the row, which is
     * worth knowing when a number looks wrong, and it is what makes the
     * measured answer recoverable later if the volume ever justifies asking for
     * it. The row and the pipeline card both surface it.
     *
     * It is not cleared when the funnel would later write the same value on its
     * own. The stamp records that a human touched the row, which stays true.
     */
    /** @absent none — the funnel wrote this status, nobody overrode it */
    statusOverrideAt: v.optional(v.number()),
    /** @absent none — only present alongside an override */
    statusOverrideBy: v.optional(v.string()),
    /**
     * **Superseded 15/08/2026 by `attribution`, still written.** Same
     * three-step retirement as the consent timestamps: dual-write, stop
     * reading, then clear and drop.
     */
    /** @absent unmeasured — arrived without a source parameter, origin unknown */
    source: v.optional(v.string()), // e.g. "fb_pinned_post", "fb_consultation_hook"

    /**
     * Why this person is here. Spec: `lifecycle-data-model.md` § 5.
     *
     * `source` was one loose string and, worse, the client hardcoded it to
     * `"direct"` and never read a URL parameter at all, so every lead in the
     * database claims the same origin and none of it is true. Nothing could
     * answer "which job post produced a lead", which is the one attribution
     * question this business actually has.
     *
     * **First touch only, never overwritten.** A multi-touch table is real
     * attribution modelling and it is not worth building at one to four leads a
     * week; recorded as a deliberate limit in the spec rather than an oversight.
     *
     * `campaign` carries the `job-log.json` id when a job post sent them, which
     * is the join that makes the channel's own pipeline measurable against what
     * candidates did next.
     */
    /** @absent unmeasured — landed before attribution existed, or with no parameters */
    attribution: v.optional(
      v.object({
        channel: v.union(
          v.literal("fb_group_post"),
          v.literal("fb_pinned_post"),
          v.literal("line_oa"),
          v.literal("direct"),
          v.literal("referral"),
          v.literal("other"),
        ),
        /** The `job-log.json` id, when a job post sent them. */
        campaign: v.optional(v.string()),
        landedAt: v.number(),
        /** The parameter exactly as it arrived, kept so a channel added later
         *  is recoverable rather than lost to `other`. */
        raw: v.optional(v.string()),
      }),
    ),
    /**
     * The one-click opt-out in a marketing email. Added 16/08/2026.
     *
     * A long random string, generated the first time this person is sent to and
     * never regenerated, so a link in an email from March still works in
     * December. It is not a login: following it can only ever stop email, which
     * is why it needs no expiry and why a leaked one is a nuisance rather than a
     * breach. `magicLinks` is the opposite case and rightly has both.
     *
     * Absent means nobody has ever been sent a marketing email, which is true of
     * every lead today because there is no send path yet.
     */
    /** @absent notyet — no marketing email has ever been addressed to them */
    unsubscribeToken: v.optional(v.string()),

    createdAt: v.number(),
    updatedAt: v.number(),
    lastActivityAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_status_recency", ["status", "lastActivityAt"])
    .index("by_unsubscribe_token", ["unsubscribeToken"])
    .index("by_pathway", ["pathway"]),

  /**
   * Consent as an append-only event log. Spec: `lifecycle-data-model.md` § 6.
   * Built 15/08/2026. Resolution logic is `src/lib/consent.ts`, which is where
   * the reasoning lives; this is only the shape.
   *
   * It replaces the three flat timestamps on `leads`, which could record a
   * grant and not a withdrawal, and could not tell "we may send you your
   * result" apart from "we may send you a job digest every week". Those are
   * different agreements and only the first has ever been asked for.
   *
   * Nothing here is ever patched or deleted, except by the cascade in
   * `leads.deleteLeadOnRequest`. An amended consent record is not evidence.
   */
  consentEvents: defineTable({
    leadId: v.id("leads"),
    channel: v.union(v.literal("email"), v.literal("line"), v.literal("phone")),
    /** `service` is your result and your booking. `marketing` is digests and
     *  nurture, and no one has been asked for it yet. */
    purpose: v.union(v.literal("service"), v.literal("marketing")),
    action: v.union(v.literal("opt_in"), v.literal("opt_out")),
    at: v.number(),

    /**
     * How the permission was obtained. Kept granular because a PDPA request
     * asks what someone agreed to, and "ticked a box" and "the published post
     * said submitting means they agree" are different answers.
     *
     * `public_notice` is Paul's recorded basis, 15/08/2026: the social post
     * carrying the link stated that submitting constitutes acceptance.
     * `founder_backfill` is superseded by it and is written by nothing.
     */
    basis: v.union(
      v.literal("app_tick"),
      v.literal("survey_import"),
      v.literal("public_notice"),
      v.literal("founder_backfill"),
      v.literal("coach_recorded"),
      v.literal("unsubscribe_link"),
      v.literal("reply_or_block"),
    ),

    /** The sentence actually shown at the moment of the tick, or where a
     *  withdrawal arrived. A consent record that cannot say what was agreed to
     *  is a timestamp, not evidence. */
    /** @absent unmeasured — the wording shown was not captured for this row */
    evidence: v.optional(v.string()),
    /** Which admin recorded it, when a human did. Their data, not the subject's. */
    /** @absent none — no human recorded it; it came from the gate or a migration */
    by: v.optional(v.string()),
  })
    .index("by_lead", ["leadId", "at"])
    .index("by_lead_scope", ["leadId", "channel", "purpose", "at"]),

  // One active token per lead; regenerated on each email send. Older tokens
  // are invalidated by the generating mutation, not deleted: history stays.
  magicLinks: defineTable({
    leadId: v.id("leads"),
    token: v.string(), // long random string, never the document id
    expiresAt: v.number(), // Unix ms; createdAt + 30 days
    /** @absent notyet — the link has not been followed. absent IS the unused state */
    usedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_lead", ["leadId"]),

  /**
   * Proof that a deletion happened, holding nothing about who it was.
   *
   * A deletion log that stored an email, or even a hash of one, would retain
   * data about the very person who asked to be forgotten, and a weak hash is
   * reversible enough to be the same thing. So this records the event and the
   * counts only. Tying it to a person is the coach's own record-keeping, which
   * is what `note` is for: "request received on LINE, 10/08/2026".
   */
  deletionLog: defineTable({
    deletedAt: v.number(),
    /** Which admin performed it. Their own data, not the subject's. */
    performedBy: v.string(),
    /** Free-text reference the coach supplies. Never paste the subject's details here. */
    /** @absent none — the coach supplied no reference */
    note: v.optional(v.string()),
    counts: v.object({
      leads: v.number(),
      assessments: v.number(),
      magicLinks: v.number(),
      /**
       * Optional because rows written before `consultations` existed have no
       * such count, and backfilling a zero would claim we checked when the
       * table was not there to check.
       */
      consultations: v.optional(v.number()),
      /** Optional for the same reason as `consultations`: rows written before
       *  `consentEvents` existed have no such count, and a backfilled zero
       *  would claim we checked when the table was not there to check. */
      consentEvents: v.optional(v.number()),
      /** Optional for the same reason again: rows written before these tables
       *  existed have no such count. */
      engagements: v.optional(v.number()),
      deliverables: v.optional(v.number()),
      applications: v.optional(v.number()),
      placements: v.optional(v.number()),
      tokenLedger: v.optional(v.number()),
      cvDocuments: v.optional(v.number()),
      deliveryNotes: v.optional(v.number()),
      candidateAccess: v.optional(v.number()),
      tokenRequests: v.optional(v.number()),
      targets: v.optional(v.number()),
      preparations: v.optional(v.number()),
      bookingInbox: v.optional(v.number()),
      /** Optional for the same reason again: rows written before this table
       *  existed have no such count. */
      candidateTasks: v.optional(v.number()),
      situationProposals: v.optional(v.number()),
      outboxDrafts: v.optional(v.number()),
      candidateRules: v.optional(v.number()),
    }),
  }).index("by_time", ["deletedAt"]),

  /**
   * One row per call or session with a candidate, coach-side entirely.
   *
   * The funnel had no record of its own last step: `leads` tracked a candidate
   * from first partial answer to `completed` and stopped, so nothing stored
   * that a call happened, what it surfaced, or what was agreed. Spec and
   * reasoning in `booking-tracking.md`; the fields below come from that plus
   * the `kick-start` skill's run sheet and observation set, which is the
   * document that says what actually happens in these thirty minutes.
   *
   * A table rather than fields on `leads`, following `assessments`,
   * `magicLinks` and `deletionLog`: a candidate has more than one of these over
   * an engagement, and flat fields would overwrite the history that makes the
   * booking cut testable at all.
   *
   * Three rules this must not break, from that spec:
   *
   * - **It never enters the candidate view.** `views.ts` gains no field and
   *   `assertCandidateSafe()` should fail on this vocabulary as it does on
   *   `tier`.
   * - **An outcome never moves a score.** Services move coverage, never scores
   *   (`candidate-data-architecture.md`). A `no_show` is not evidence about
   *   anyone's employability. What the call *observed* is evidence, and its
   *   home is an `assessments` row with `source: "coach"`, not this table.
   * - **`nextStep` is the same pick as `firstAction`**, or the reason it
   *   differs is written down. Two competing answers to "what do I do first" is
   *   the failure `08_Coaching_Business.md` records under merging option values.
   */
  consultations: defineTable({
    leadId: v.id("leads"),

    /**
     * Kick-start is the free 30-minute first call, the only one with a run
     * sheet, and the only instrument in the funnel that reaches the
     * competencies a form cannot. The other three exist so the log does not
     * stop being usable the moment someone buys something.
     */
    type: v.union(
      v.literal("kick_start"),
      v.literal("engagement"),
      v.literal("follow_up"),
      v.literal("other"),
    ),

    outcome: v.union(
      v.literal("invited"),
      v.literal("scheduled"),
      v.literal("held"),
      v.literal("no_show"),
      v.literal("cancelled"),
      v.literal("expired"),
    ),

    /**
     * When it happened, or when it is due to. Both live in one field on purpose.
     *
     * `booking-tracking.md` specified a separate `scheduledFor`. One field
     * instead, because two would need keeping in step for no gain: a row is
     * either a slot in the future or a call in the past, never both, and the
     * outcome already says which.
     */
    heldAt: v.number(),

    // ---------------------------------------------------------- the invitation
    //
    // From `booking-tracking.md`, built 15/08/2026. Entered by hand: the free
    // Calendly tier has no webhooks, no API and no Zapier, so nothing can push
    // this in. Five seconds when the confirmation lands, and no integration to
    // maintain. It breaks silently the day it is forgotten, which is the
    // accepted cost of the free tier rather than of this design.

    /**
     * What fired the send, and the field that makes the wave 1 cut measurable.
     *
     * It records the RULE, not the person's answers, so changing the rule later
     * does not rewrite the history of what the old rule actually produced.
     */
    /** @absent unmeasured — rows written before the field existed */
    trigger: v.optional(
      v.union(
        v.literal("survey_stage_wave1"), // interviewing or negotiating
        v.literal("survey_urgent_wave2"), // within 3 months and applying or later
        v.literal("manual"), // coach judgement, no rule fired
      ),
    ),
    /** @absent notyet — no invitation sent yet */
    sentAt: v.optional(v.number()),
    /** @absent notyet — no invitation sent yet */
    sentChannel: v.optional(v.union(v.literal("line"), v.literal("email"))),
    /**
     * When they chose a slot. The gap between `sentAt` and this is the only
     * read anyone gets on whether the message worked.
     */
    /** @absent notyet — they have not chosen a slot. absent IS the not-booked state */
    bookedAt: v.optional(v.number()),
    /** Manual, because the free tier sends no reminders. Absent is the queue. */
    /** @absent notyet — absent IS the reminder queue; the free tier sends none */
    reminderSentAt: v.optional(v.number()),
    /** The deliverable this call serves, e.g. the Fit Report or the pack's
     *  preview. `lifecycle-data-model.md` § 7b. Appointments live here and
     *  nowhere else. @absent none — a call not tied to one piece of work */
    deliverableId: v.optional(v.id("deliverables")),
    /** When Paul sent the preview's preparation request on LINE. Manual,
     *  because nothing reaches the candidate on its own. § 7b.
     *  @absent notyet — not sent, or not a preview call */
    prepRequestedAt: v.optional(v.number()),
    /** The Cal.com booking id, on a call the booking webhook wrote, so a
     *  reschedule or cancellation finds its row. § 7b.
     *  @absent none — logged by hand */
    calBookingId: v.optional(v.string()),
    /**
     * When the coach closed this session on the Session tab's close form,
     * `candidate-situation-handoff.md` § 4. The close is the one moment a coach
     * writes the Situation panel, so this is what says a call has been written
     * up at all: a held call without it is a call whose decisions are still in
     * somebody's head.
     */
    /** @absent notyet — the call has not been closed on the form */
    sessionClosedAt: v.optional(v.number()),
    /** @absent notyet — only present alongside a close */
    sessionClosedBy: v.optional(v.string()),
    /** @absent unmeasured — not recorded */
    durationMinutes: v.optional(v.number()),
    /** @absent unmeasured — not recorded */
    channel: v.optional(
      v.union(v.literal("line"), v.literal("meet"), v.literal("phone"), v.literal("other")),
    ),

    /**
     * Which language the call actually ran in, and it is not bookkeeping.
     *
     * The run sheet's default is English for the middle two blocks, because
     * that is the only test Business English gets: its ECRA lookup is a
     * self-report "verified where tested". A call held entirely in Thai did not
     * test it, so nobody may later promote that competency on the strength of
     * having had a call. This field is what makes that checkable afterwards.
     */
    /** @absent unmeasured — not recorded. must NOT be read as English */
    language: v.optional(v.union(v.literal("thai"), v.literal("english"), v.literal("mixed"))),

    /** Their own question, verbatim. It is what the last five minutes must answer. */
    /** @absent unmeasured — not written down */
    theirQuestion: v.optional(v.string()),
    /** The two strengths named back to them, from their own document. */
    /** @absent unmeasured — not written down */
    strengthsNamed: v.optional(v.string()),

    /** The one action given. One item, never a list; the method forbids a list. */
    /** @absent notyet — no action given yet, or the call has not happened */
    nextStep: v.optional(v.string()),
    /**
     * False when the action given differed from the app's `firstAction`.
     *
     * The skill is explicit that a disagreement between the two is a bug to
     * log rather than a thing to tell the candidate, so the log has to be able
     * to hold the disagreement.
     */
    /** @absent unmeasured — never compared. absent is NOT agreement */
    nextStepMatchesApp: v.optional(v.boolean()),

    /**
     * The salary figure with the role and the country it was quoted against.
     * Free text because a number alone cannot be classified, and the benchmark
     * is a manual coach lookup rather than a formula.
     */
    /** @absent unmeasured — salary did not come up */
    salaryQuote: v.optional(v.string()),

    /** Which module they would buy. A conclusion for the file, never said in the call. */
    /** @absent notyet — no conclusion reached yet */
    moduleFit: v.optional(v.string()),

    /**
     * The three ICP inputs, collected conversationally in the first five
     * minutes: Gate 1, Gate 2 and Investment Readiness in that order.
     *
     * **These now feed the grade**, decided 15/08/2026. Every app-native lead
     * arrived ungraded because Stage 1 asks for none of them, and a grade that
     * stays blank after you have spoken to someone for half an hour is not
     * measuring caution, it is just missing.
     *
     * They are not merged into `leads.responses`. The grade reads them from
     * here, so a coach-collected answer keeps its attribution: who recorded it,
     * on what date, in which call. Self-report and observation stay
     * distinguishable, which is the rule the whole scoring model rests on.
     *
     * Two are closed-choice for that reason: an answer that has to reach a
     * lookup cannot be free text. The job title stays free text because Gate 1
     * classifies through the Job Title Pool, which is not loaded, so nothing
     * here may classify it.
     */
    /** @absent unmeasured — not collected on this call */
    icpJobTitle: v.optional(v.string()),
    /** @absent unmeasured — not collected. never scored as a zero */
    icpExperienceYears: v.optional(
      v.union(v.literal("0-1"), v.literal("2-10"), v.literal("11-15"), v.literal("16+")),
    ),
    /** @absent unmeasured — not collected. never scored as none */
    icpPriorInvestment: v.optional(
      v.union(v.literal("none"), v.literal("unrelated"), v.literal("relevant")),
    ),

    /**
     * When the same-day Thai follow-up went out. Absent on a held call is the
     * queue: the free Calendly tier sends nothing, the follow-up is manual, and
     * it is the step most likely to be missed.
     */
    /** @absent notyet — absent on a held call IS the follow-up queue */
    followUpSentAt: v.optional(v.number()),

    /** @absent none — nothing further to record */
    notes: v.optional(v.string()),

    /** Which admin wrote the row. Their own data, not the candidate's. */
    createdBy: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_lead_time", ["leadId", "heldAt"])
    // The follow-up and reminder queues: what is coming up, across all leads.
    .index("by_time", ["heldAt"])
    .index("by_cal_booking", ["calBookingId"]),

  /**
   * A Cal.com event the booking webhook could not place, waiting for Paul.
   * `prd.md` section 8; `lifecycle-data-model.md` § 7b. Coach-only. A row
   * exists only until Paul clears it, and clearing deletes it, because the
   * attendee's name and email are the reason it is here and nothing else.
   */
  bookingInbox: defineTable({
    calBookingId: v.string(),
    trigger: v.union(
      v.literal("BOOKING_CREATED"),
      v.literal("BOOKING_RESCHEDULED"),
      v.literal("BOOKING_CANCELLED"),
    ),
    startAt: v.number(),
    /** @absent unmeasured — the event carried no length */
    lengthMinutes: v.optional(v.number()),
    /** @absent unmeasured — the event carried no name */
    attendeeName: v.optional(v.string()),
    /** Lowercased. @absent unmeasured — the event carried no email */
    attendeeEmail: v.optional(v.string()),
    reason: v.union(
      v.literal("no_lead"),
      v.literal("several_leads"),
      v.literal("unknown_length"),
      v.literal("no_email"),
      v.literal("unknown_booking"),
      v.literal("already_scheduled"),
    ),
    receivedAt: v.number(),
  })
    .index("by_booking", ["calBookingId", "trigger"])
    .index("by_email", ["attendeeEmail"])
    .index("by_received", ["receivedAt"]),

  /**
   * What was sold. Spec: `lifecycle-data-model.md` § 7, built 15/08/2026.
   *
   * The funnel had no record past the consultation: `leads` stops at
   * `completed` and `consultations` stops when the call ends, so the fact that
   * somebody paid lived nowhere but Paul's memory. A row here at `agreed` is
   * what makes a person a client; a row at `proposed` is a pipeline and not a
   * client, which is why one status field covers both.
   */
  engagements: defineTable({
    leadId: v.id("leads"),

    /** Names come from `01_Project_Foundation.md` Core Offerings and must stay
     *  in step with the module names `levers.ts` already validates. `bundle` is
     *  its own value rather than four rows, because that is how it is priced. */
    module: v.union(
      v.literal("career_coaching"),
      v.literal("profile_optimization"),
      v.literal("job_application_lifecycle"),
      v.literal("bundle"),
      /** A self-serve token pack from `pricing.ts`, sold one to one by
       *  transfer before the wallet exists. The pack's tokens live in
       *  `tokenLedger`, never in a field here, so the balance is a sum and
       *  cannot drift from the history that produced it. */
      v.literal("token_pack"),
    ),

    status: v.union(
      v.literal("proposed"),
      v.literal("agreed"),
      v.literal("active"),
      v.literal("completed"),
      v.literal("lapsed"),
      v.literal("refunded"),
    ),

    /** THB. A fact about this one transaction, never a copy of the pricing
     *  table, which stays owned by `01_Project_Foundation.md` and is an
     *  explicit pilot hypothesis until real leads validate it. */
    /** @absent unmeasured — no figure quoted. never zero */
    quotedThb: v.optional(v.number()),
    /** @absent notyet — nothing agreed yet, or agreed without a recorded figure */
    agreedThb: v.optional(v.number()),

    /** @absent unmeasured — rows written before the field existed */
    proposedAt: v.optional(v.number()),
    /** @absent notyet — still at proposed. absent IS the not-sold state */
    agreedAt: v.optional(v.number()),
    /** @absent notyet — agreed but not started */
    startedAt: v.optional(v.number()),
    /** @absent notyet — still running */
    completedAt: v.optional(v.number()),

    /** Which call produced the sale. `consultations.moduleFit` is the coach's
     *  pre-sale conclusion; this is what actually happened. */
    /** @absent none — no call produced it; coach judgement or inbound */
    fromConsultation: v.optional(v.id("consultations")),

    /** @absent none — nothing further to record */
    notes: v.optional(v.string()),
    createdBy: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_lead", ["leadId", "createdAt"])
    .index("by_status", ["status", "updatedAt"]),

  /**
   * What was actually done inside an engagement. `lifecycle-data-model.md` § 8.
   *
   * The rule that keeps this table honest: **a delivered service moves
   * coverage, never a score** (`candidate-data-architecture.md`). Doing a CV
   * review does not raise anyone's CV Quality; what the review *observed*
   * raises it, and that belongs in an `assessments` row with `source: "coach"`.
   * `producedAssessment` is the pointer between the two, so "we did the work"
   * and "here is what the work found" can never be the same record.
   */
  deliverables: defineTable({
    engagementId: v.id("engagements"),
    /** Denormalised for the per-person timeline query only. Never authoritative;
     *  the engagement owns the relationship. */
    leadId: v.id("leads"),

    kind: v.union(
      v.literal("base_cv"),
      v.literal("linkedin"),
      v.literal("portfolio"),
      v.literal("country_research"),
      v.literal("tailored_application"),
      v.literal("interview_prep"),
      v.literal("mock_interview"),
      v.literal("offer_review"),
      v.literal("contract_review"),
      v.literal("coaching_session"),
      /** The paid Fit Report: the interview, the coach panel and the PDF. One
       *  row, delivered when the PDF goes out, because that is what was paid for. */
      v.literal("fit_report"),
    ),

    /** @absent none — no date agreed yet */
    dueAt: v.optional(v.number()),
    /** A booking page for this session, shown to the candidate as a button
     *  while it is not yet delivered. @absent none — booked by message */
    bookingUrl: v.optional(v.string()),
    /** The name the candidate sees on their own page, in their language, e.g.
     *  "คุยทำความรู้จัก 30 นาที". Two sessions of the same kind are otherwise
     *  indistinguishable to them. `notes` stays the coach's own words.
     *  @absent none — their page shows the kind's standard name */
    title: v.optional(v.string()),

    /** From `10_Methodology.md` § 4. It labels which stage's work this was. It
     *  never decides what the candidate does next: that is the gates, and two
     *  mechanisms answering "what do I do first" is the failure
     *  `08_Coaching_Business.md` records under merging option values. */
    methodStage: v.union(
      v.literal("direction"),
      v.literal("route"),
      v.literal("legibility"),
      v.literal("execution"),
    ),

    status: v.union(
      v.literal("not_started"),
      v.literal("in_progress"),
      v.literal("delivered"),
      /** Withdrawn before delivery, `lifecycle-data-model.md` § 7a. A cancelled
       *  Fit Report holds no reservation and is never charged. */
      v.literal("cancelled"),
    ),
    /** @absent notyet — not delivered. absent IS the outstanding state */
    deliveredAt: v.optional(v.number()),
    /** @absent notyet — not cancelled */
    cancelledAt: v.optional(v.number()),
    /** Set only by `workspace.selectFitReport` on a `fit_report`. While set,
     *  undelivered, uncancelled and uncharged, it holds 20 tokens. § 7a.
     *  @absent notyet — never explicitly selected; a report started before
     *  reservations existed stays unreserved until reconciled and selected */
    reservedAt: v.optional(v.number()),
    /** Complimentary work of the ฿1,500 pack, `01_Project_Foundation.md`.
     *  @absent none — paid or ordinary work */
    entitlement: v.optional(v.union(v.literal("pack_preview"), v.literal("pack_cv_rewrite"))),
    /** On a `pack_cv_rewrite`: the Fit Report selection that earned it.
     *  @absent none — not a CV rewrite, or earned some other recorded way */
    forFitReport: v.optional(v.id("deliverables")),
    /** On a `pack_cv_rewrite` kept through its Fit Report's cancellation: the
     *  existing promise that keeps it. @absent none — no promise recorded */
    promiseNote: v.optional(v.string()),
    /** Factual errors the candidate reported in a complimentary document. An
     *  unresolved one holds the coaching open. @absent none — none reported */
    errorReports: v.optional(
      v.array(
        v.object({
          reportedAt: v.number(),
          summary: v.string(),
          /** @absent notyet — still open */
          resolvedAt: v.optional(v.number()),
        }),
      ),
    ),
    /** @absent none — this work produced no coach observation worth recording */
    producedAssessment: v.optional(v.id("assessments")),

    /** @absent none — nothing further to record */
    notes: v.optional(v.string()),
    by: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_engagement", ["engagementId", "createdAt"])
    .index("by_lead", ["leadId", "createdAt"]),

  /**
   * The candidate's own job list. `lifecycle-data-model.md` § 9.
   *
   * This absorbs the `savedJobs` table TASK-059 proposed rather than sitting
   * beside it: a saved job and an applied job are the same job at two statuses,
   * and two tables would need a link that is only ever one-to-one.
   *
   * TASK-059 is explicit that this is the candidate's notebook and **nothing
   * infers status**. `recordedBy` is what enforces that: a coach-entered status
   * is visibly a coach's, and no code may move a candidate's row on their
   * behalf.
   */
  applications: defineTable({
    leadId: v.id("leads"),
    /** Absent means they did this without a paid engagement, which is the
     *  common case and must stay representable. */
    /** @absent none — they did this without a paid engagement, the common case */
    engagementId: v.optional(v.id("engagements")),

    /** Set when the job came from the personalised feed, so the channel's own
     *  pipeline can be joined back to what candidates did with it. */
    /** @absent none — the job did not come from our own feed */
    jobLogId: v.optional(v.string()),
    employer: v.string(),
    roleTitle: v.string(),
    country: v.string(),
    /** @absent unmeasured — no link captured */
    jobUrl: v.optional(v.string()),

    status: v.union(
      v.literal("interested"), // saved, not applied: TASK-059's bookmark state
      v.literal("applied"),
      v.literal("screening"),
      v.literal("interviewing"),
      v.literal("offer"),
      v.literal("rejected"),
      v.literal("withdrawn"),
      v.literal("accepted"),
    ),
    recordedBy: v.union(v.literal("candidate"), v.literal("coach")),

    savedAt: v.number(),
    /** @absent notyet — saved but not applied. absent IS the bookmark state */
    appliedAt: v.optional(v.number()),
    statusChangedAt: v.number(),
    /** @absent none — nothing further to record */
    notes: v.optional(v.string()),

    /** Where the row came from. `matched` is a role PunProfile screened and
     *  sent, which is what a Matched Jobs token pays for; its token is
     *  deducted in the same transaction that inserts the row.
     *  @absent unmeasured — written before this field existed */
    origin: v.optional(
      v.union(v.literal("matched"), v.literal("candidate"), v.literal("coach")),
    ),
    /** Free text with currency and period, as `placements.salary`.
     *  @absent none — not stated on the posting */
    salary: v.optional(v.string()),
    /** City or remote, beside `country`. @absent none — not recorded */
    location: v.optional(v.string()),
    /** @absent none — the posting gave no closing date */
    deadlineAt: v.optional(v.number()),
    /** When someone should chase it. @absent none — no follow-up set */
    followUpAt: v.optional(v.number()),
    /** The CV version sent with this application, so a reply can be read
     *  against the document that earned it. @absent none — not recorded */
    cvDocumentId: v.optional(v.id("cvDocuments")),
    /** Why a matched role was picked for this person, shown to them.
     *  @absent none — not a matched role, or no reason written */
    matchReason: v.optional(v.string()),
    /** When the email telling the candidate about this matched role went.
     *  @absent notyet — not a matched role, or its notice has not gone */
    notifiedAt: v.optional(v.number()),
    /** The posting in the job database. Optional through the migration: rows
     *  written before `jobs` existed have none. @absent notyet — not linked */
    jobId: v.optional(v.id("jobs")),
    /** The capability in the matched-role email's like and dislike links.
     *  Random, unguessable, and it can do one thing: set the verdict below.
     *  @absent notyet — not a matched role, or its notice has not been built */
    feedbackToken: v.optional(v.string()),
    /** The candidate's own verdict on a matched role, from the email.
     *  @absent none — not given */
    candidateVerdict: v.optional(v.union(v.literal("up"), v.literal("down"))),
    /** @absent none — only present alongside a verdict */
    candidateVerdictAt: v.optional(v.number()),
    /** Why the role missed, one of `MATCH_FEEDBACK_REASONS` in
     *  `src/lib/content/matchFeedback.ts`. @absent none — no reason picked */
    candidateVerdictReason: v.optional(v.string()),
    /** What the candidate wrote in their own words after the verdict,
     *  `job-database-handoff.md` D3. The nuance the eight reasons miss, and
     *  the signal a reason id cannot carry: it is read by the run and turned
     *  into a proposed rule with the quote attached, never applied blindly.
     *  @absent none — nothing written */
    candidateVerdictComment: v.optional(v.string()),
    /** How much the candidate wants this one, 1 to 5, their own mark. Teal's
     *  "excitement" column. @absent none — not marked */
    excitement: v.optional(v.number()),
    /** Teal's interview tracking: one entry per round, the candidate's own
     *  record. A list on the row rather than a table, because a round has no
     *  life apart from its application and twenty is a generous ceiling.
     *  @absent none — no round recorded */
    /** Which target title this job is for, § 8a.
     *  @absent none — not assigned to a title */
    targetId: v.optional(v.id("targets")),
    interviews: v.optional(
      v.array(
        v.object({
          /** e.g. "Recruiter screen", "Technical", "Final". */
          round: v.string(),
          /** @absent none — no date yet */
          at: v.optional(v.number()),
          /** @absent none — not recorded */
          format: v.optional(v.union(v.literal("video"), v.literal("phone"), v.literal("onsite"))),
          /** Names, as the candidate writes them. @absent none — not recorded */
          interviewers: v.optional(v.string()),
          /** @absent none — nothing written */
          notes: v.optional(v.string()),
        }),
      ),
    ),
    /** The posting's text, pasted by the candidate or the coach, so the job's
     *  keywords can be read off it (Teal's "Job Description & Keywords") after
     *  the posting itself is taken down. @absent none — not pasted */
    jobDescription: v.optional(v.string()),
    /** Ids of the checklist steps the candidate has ticked, from
     *  `src/lib/content/checklist.ts`. Ids, not text, so rewording a step
     *  keeps the tick. @absent none — nothing ticked */
    checklist: v.optional(v.array(v.string())),
    /** Teal's People: who the candidate is talking to about this job.
     *  @absent none — no contact recorded */
    contacts: v.optional(
      v.array(
        v.object({
          name: v.string(),
          /** e.g. "Recruiter", "Hiring manager". @absent none — not recorded */
          role: v.optional(v.string()),
          /** @absent none — not recorded */
          email: v.optional(v.string()),
          /** @absent none — not recorded */
          linkedin: v.optional(v.string()),
        }),
      ),
    ),
  })
    .index("by_lead_time", ["leadId", "savedAt"])
    .index("by_lead_status", ["leadId", "status", "statusChangedAt"])
    .index("by_feedback_token", ["feedbackToken"]),

  /**
   * The outcome the whole business is measured on.
   * `lifecycle-data-model.md` § 9, and `01_Project_Foundation.md` Success
   * Metrics: "interviews secured, offers received, contracts signed".
   *
   * `signedAt` is the moment `10_Methodology.md` Stage 3 exits, and the moment
   * a person stops being a client and becomes a placement.
   */
  placements: defineTable({
    leadId: v.id("leads"),
    /** @absent none — not linked to a tracked application */
    applicationId: v.optional(v.id("applications")),

    employer: v.string(),
    roleTitle: v.string(),
    country: v.string(),

    /** @absent unmeasured — the offer date was not recorded */
    offerAt: v.optional(v.number()),
    /** @absent notyet — offer not signed. absent IS the unsigned state, and gates the placed lifecycle state */
    signedAt: v.optional(v.number()),
    /** @absent notyet — start date not agreed or not known */
    startAt: v.optional(v.number()),

    /** Free text carrying its own currency and period, for the same reason
     *  `consultations.salaryQuote` is: a bare number cannot be classified, and
     *  the benchmark is a manual coach lookup rather than a formula. */
    /** @absent unmeasured — not disclosed. never zero */
    salary: v.optional(v.string()),

    /** The route that actually worked. The single most valuable field here for
     *  `07_Reference.md`, because it is the only place a claimed visa route is
     *  ever confirmed against reality. */
    /** @absent unmeasured — not recorded */
    visaRoute: v.optional(v.string()),

    /**
     * Coach judgement, recorded as judgement rather than inferred.
     * `engagement` means PunProfile did the work on this application;
     * `assisted` means an engagement existed but this was not it; `self` means
     * they got there alone and told us.
     *
     * Success metrics read this field. A metric that counted rows instead would
     * claim credit for every placement anyone ever reported, which is the exact
     * shape of overstatement `01_Project_Foundation.md` Accuracy forbids.
     */
    attributedTo: v.union(
      v.literal("engagement"),
      v.literal("assisted"),
      v.literal("self"),
    ),
    /** @absent none — attributedTo is self or assisted, so there is no engagement to name */
    attributedEngagementId: v.optional(v.id("engagements")),

    /** Permission to tell their story is its own grant and is implied by
     *  nothing above. The Social Proof pillar in `Content_Strategy.md` is empty
     *  and this is the field that eventually fills it, honestly. */
    /** @absent notyet — permission to tell the story has not been given. absent means DO NOT publish */
    storyConsentAt: v.optional(v.number()),

    /** @absent none — nothing further to record */
    notes: v.optional(v.string()),
    createdBy: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_lead", ["leadId", "createdAt"])
    .index("by_signed", ["signedAt"]),

  // Point-in-time evidence snapshots, the trajectory layer. A delta between
  // two snapshots is what makes "get their score up" measurable, and the
  // source field carries attribution: an "app" change stays self-reported, a
  // "coach" change is verified.
  assessments: defineTable({
    leadId: v.id("leads"),
    takenAt: v.number(),
    source: v.union(
      v.literal("survey_import"), // backfilled from the Google Form era
      v.literal("app"), // the candidate's own answers in this app
      v.literal("coach"), // coach-verified corrections during an engagement
    ),
    responses: v.record(v.string(), v.any()),

    /**
     * Why the coach changed it. Added 15/08/2026, when this table stopped being
     * written by nothing and became the correction layer.
     *
     * The reason is the point, not decoration. Candidates contradict
     * themselves, and "they said B2 on the form and could not hold a sentence
     * in English on the call" is the fact worth keeping. A corrected value with
     * no reason is just a second opinion with better formatting.
     */
    /** @absent none — no reason recorded; expected on app and import rows, a gap on coach rows */
    note: v.optional(v.string()),
    /** Which admin made the correction. Their own data, not the candidate's. */
    /** @absent none — not a human correction; it came from the app or an import */
    by: v.optional(v.string()),
  }).index("by_lead_time", ["leadId", "takenAt"]),

  /**
   * The coach's ECRA ratings from the Fit Report interview, one row per
   * rating. Added 26/10/2026. Nothing is edited in place: a re-rating is a new
   * row and the latest row per competency is the one the report uses, so every
   * earlier rating keeps its date and author.
   *
   * `value` is in the framework's own units (`src/lib/ecra.ts`): the number of
   * indicators met, 0 to 4, or the index of the lookup level, 0 being best.
   * `score` is the 1 to 5 result, stored so a later change to the rule table
   * cannot silently rescore a report already sent.
   */
  competencyRatings: defineTable({
    leadId: v.id("leads"),
    itemKey: v.string(),
    value: v.number(),
    score: v.number(),
    /** What to do next, in English since 02/11/2026, shown to the candidate under the competency. */
    /** @absent none — the coach left no note for this competency */
    note: v.optional(v.string()),
    /**
     * Who scored it, 02/11/2026. "evidence": filled before the interview by the
     * Fit Report skill from the candidate's own answers, CVs and documents.
     * "coach": observed or confirmed by the coach.
     */
    /** @absent coach — every row before 02/11/2026 was the coach's */
    source: v.optional(v.union(v.literal("coach"), v.literal("evidence"))),
    /** The facts behind an evidence rating, each with where it came from. */
    /** @absent none — a coach rating needs no evidence line */
    evidence: v.optional(v.string()),
    /** Indicator positions met (0 to 3), for an indicators competency. */
    /** @absent none — a lookup competency, or a row from before 02/11/2026 */
    ticks: v.optional(v.array(v.number())),
    /**
     * Indicator positions the evidence could not decide, left for the
     * interview. Non-empty makes the row a draft: it never reaches the report
     * until the coach settles them, because an unobserved indicator is not a
     * failed one.
     */
    /** @absent none — nothing left open */
    open: v.optional(v.array(v.number())),
    ratedAt: v.number(),
    /** Which admin rated it. Their own data, not the candidate's. */
    by: v.string(),
  }).index("by_lead_item", ["leadId", "itemKey"]),
  /**
   * Every token a person has bought, spent or been refunded, one row per
   * movement. `pricing.ts`: one currency, a token is deducted only once the
   * service has actually been received, tokens never expire, unused ones are
   * refundable.
   *
   * **The balance is never stored.** It is the sum of `delta` over the rows,
   * computed by `tokenBalance` in `convex/portal.ts`, for the reason
   * `lifecycle-data-model.md` § 11 gives for every derived value: a stored
   * verdict drifts.
   */
  tokenLedger: defineTable({
    leadId: v.id("leads"),
    /** Positive for a purchase or a refund back into the wallet, negative for a
     *  service delivered or tokens paid out in cash. Never zero. */
    delta: v.number(),
    reason: v.union(
      v.literal("purchase"),
      v.literal("fit_report"),
      v.literal("matched_role"),
      v.literal("cash_refund"),
      v.literal("adjustment"),
    ),
    /** @absent none — not tied to a sale */
    engagementId: v.optional(v.id("engagements")),
    /** @absent none — not tied to one piece of work */
    deliverableId: v.optional(v.id("deliverables")),
    /** @absent none — not a matched role */
    applicationId: v.optional(v.id("applications")),
    /** @absent none — nothing further to record */
    note: v.optional(v.string()),
    at: v.number(),
    by: v.string(),
  })
    .index("by_lead", ["leadId", "at"])
    .index("by_application", ["applicationId"]),

  /**
   * A candidate's CV, every version, never overwritten. TASK-064.
   *
   * The file sits in Convex file storage on this deployment, not on anyone's
   * laptop. A re-upload is a new row with the next `version`; the old one stays
   * readable, because "what did we change" is answered by comparing two rows.
   *
   * TASK-063's rules hold: the file is offered for download and never rendered
   * inline, so a photograph on it is never displayed by the app, and nothing is
   * extracted from it here.
   */
  cvDocuments: defineTable({
    leadId: v.id("leads"),
    /** 1, 2, 3 per target title (or per lead for the base CV), in upload
     *  order. Per lead before 31/10/2026; those rows keep their numbers. */
    version: v.number(),
    /** The target title this CV is written for, `lifecycle-data-model.md`
     *  § 8a. The latest one for a target is its current CV.
     *  @absent none — the candidate's base CV, holding everything */
    targetId: v.optional(v.id("targets")),
    /** A one-off copy tailored for one job. Never a target's current CV.
     *  @absent none — not tied to one application */
    applicationId: v.optional(v.id("applications")),
    /** Who wrote this version. `candidate` is a file they sent us,
     *  `coach` a revision PunProfile made. */
    author: v.union(v.literal("candidate"), v.literal("coach")),
    /** Shown to the candidate on their own page, beside the title it is for.
     *  Written for them, in Thai or as a CV would name itself, never as a note
     *  about them. Defaults to the target's title. */
    label: v.string(),
    storageId: v.id("_storage"),
    fileName: v.string(),
    contentType: v.string(),
    bytes: v.number(),
    /** The version this one was made from. @absent none — an original */
    basedOn: v.optional(v.id("cvDocuments")),
    /** What changed against `basedOn` and why, coach's words. This is the
     *  delivery note a candidate reads beside the file.
     *  @absent none — an original, nothing changed */
    changeNote: v.optional(v.string()),
    /** The piece of paid work this revision belongs to.
     *  @absent none — not part of a deliverable */
    deliverableId: v.optional(v.id("deliverables")),
    /** Visible on the candidate's own page. Coach drafts stay off it until
     *  they are ready. @absent notyet — not shared with the candidate */
    sharedAt: v.optional(v.number()),
    /** TASK-063's interim basis. A CV arriving by message is `coach_direct`
     *  and its date is the day they sent it. Never backfilled to `app`. */
    consentSource: v.union(v.literal("coach_direct"), v.literal("app")),
    cvConsentAt: v.number(),
    /** How the file was attached to this lead, TASK-064. */
    linkedBy: v.union(v.literal("manual"), v.literal("self_upload"), v.literal("email_match")),
    uploadedAt: v.number(),
    by: v.string(),
  }).index("by_lead", ["leadId", "version"]),

  /**
   * The coach's own ticks on the Session tab's delivery checklist, for the two
   * steps that happen outside the app, `prd.md` § 8. One row per step ticked;
   * undoing the tick deletes the row.
   */
  checklistTicks: defineTable({
    leadId: v.id("leads"),
    key: v.union(v.literal("summary_email"), v.literal("timeline_shared")),
    at: v.number(),
    by: v.string(),
  }).index("by_lead", ["leadId"]),

  /**
   * Roles the evening run found for a paying client and that passed the
   * matched-role gates, waiting for the coach to send or dismiss them from the
   * Session tab, `prd.md` § 8. Sending goes through `workspace.sendMatched`,
   * so the weekly maximum, the pause and the token rules are the same.
   */
  foundRoles: defineTable({
    leadId: v.id("leads"),
    /** The run's date, ISO. */
    foundOn: v.string(),
    targetTitle: v.string(),
    employer: v.string(),
    roleTitle: v.string(),
    country: v.string(),
    /** @absent none — no city on the posting */
    location: v.optional(v.string()),
    jobUrl: v.string(),
    /** As stated on the posting. @absent none — not stated */
    salary: v.optional(v.string()),
    /** The posting's own date, ISO. @absent unmeasured — the page shows none */
    postedOn: v.optional(v.string()),
    matchReason: v.string(),
    /** The posting in the job database. Optional through the migration: rows
     *  written before `jobs` existed have none, and a read that needs the job
     *  says so rather than inventing one. @absent notyet — not linked yet */
    jobId: v.optional(v.id("jobs")),
    /** A coach dismissal is feedback too, one of the reason ids in
     *  `src/lib/content/matchFeedback.ts`. @absent none — no reason given */
    dismissReason: v.optional(v.string()),
    status: v.union(v.literal("waiting"), v.literal("sent"), v.literal("dismissed")),
    /** The role row it became once sent. @absent notyet — not sent */
    applicationId: v.optional(v.id("applications")),
    /** @absent notyet — still waiting */
    decidedAt: v.optional(v.number()),
    addedAt: v.number(),
  })
    .index("by_lead", ["leadId", "status"])
    .index("by_lead_url", ["leadId", "jobUrl"]),

  /**
   * What the candidate owes, written at the end-of-session close,
   * `candidate-situation-handoff.md` § 4. It appears on their own page as a
   * task, and it is reminded once at its date: the delivery design's rule is
   * one check and no repeat chasing, so a second reminder is not a setting
   * that was left off, it is a thing this table will not do.
   *
   * One row per thing owed. The coach writes it, the candidate or the coach
   * closes it, and a closed row stays: what was asked for and whether it
   * arrived is the record of why a session went the way it did.
   */
  candidateTasks: defineTable({
    leadId: v.id("leads"),
    /** One line, in the coach's words, as the candidate will read it. */
    what: v.string(),
    /** The date it is owed by, ISO. */
    dueOn: v.string(),
    /** The call it was agreed in. @absent none — written outside a call */
    consultationId: v.optional(v.id("consultations")),
    at: v.number(),
    by: v.string(),
    /** @absent notyet — still owed */
    doneAt: v.optional(v.number()),
    /** Which side closed it. The coach's own address is in `by`.
     *  @absent notyet — still owed */
    doneBy: v.optional(v.union(v.literal("candidate"), v.literal("coach"))),
    /** When the one reminder went. @absent notyet — not reminded yet */
    remindedAt: v.optional(v.number()),
  }).index("by_lead", ["leadId"]),

  /**
   * A Situation row a transcript proposes, waiting for the coach's click,
   * `candidate-situation-handoff.md` § 4.
   *
   * Nothing from a transcript lands on the panel on its own. The delivery
   * design is explicit that extraction is evidence capture and not proof that
   * every spoken statement is correct, so a reading of a call arrives here,
   * beside the value the panel already holds, and the coach accepts it, edits
   * it or throws it away. The close form is where that happens.
   *
   * Written from outside the app, the same way the evening run writes the
   * roles it found: whatever reads the recording has a model and this does
   * not. `quote` is what was actually said, so the coach is deciding about
   * evidence rather than about a summary of it.
   *
   * A settled proposal is kept. What a call proposed and what the coach did
   * with it is the record of how a fact on the panel came to be there.
   */
  situationProposals: defineTable({
    leadId: v.id("leads"),
    /** The call it was read off. @absent none — not tied to one call */
    consultationId: v.optional(v.id("consultations")),
    /** The proposed row, in the shape the panel takes. */
    proposed: rowInput,
    /** What the panel read at the moment the proposal was made, so the coach
     *  sees a change rather than a bare new value.
     *  @absent none — the row was empty */
    wasLine: v.optional(v.string()),
    /** What was said, verbatim. @absent none — no quote was carried */
    quote: v.optional(v.string()),
    at: v.number(),
    by: v.string(),
    /** @absent notyet — still waiting for the coach */
    settledAt: v.optional(v.number()),
    /** @absent notyet — still waiting for the coach */
    settledBy: v.optional(v.string()),
    /** Whether the coach took it. An edited accept is `true`: what landed is
     *  on the panel with its own stamp. @absent notyet — still waiting */
    accepted: v.optional(v.boolean()),
  })
    .index("by_lead", ["leadId"])
    .index("by_consultation", ["consultationId"]),

  /**
   * The outbox: what we are about to say to a candidate, waiting on the coach,
   * `candidate-situation-handoff.md` § 4.
   *
   * Every draft is written from the Situation panel plus the event that
   * triggered it and nothing else, which is the point of the panel: a message
   * cannot then miss the work route or the start date, and cannot state a fact
   * the panel does not hold. `writtenFrom` keeps the panel lines as they read
   * at the moment the draft was asked for, so that claim is checkable
   * afterwards rather than merely asserted.
   *
   * A row is created empty, by the event. Whatever has a model fills the body,
   * the same way a transcript's proposals arrive. The coach approves or edits
   * in place; an edit to a FACT goes back through the close form into the
   * panel, not into the message alone, or the next message contradicts this
   * one.
   *
   * Email is sent from here. LINE is copied, never sent: there is no LINE
   * integration and inventing one in an outbox would be the kind of quiet
   * capability nobody asked for.
   */
  outboxDrafts: defineTable({
    leadId: v.id("leads"),
    kind: v.union(
      v.literal("session_summary"),
      v.literal("line_after_session"),
      v.literal("dashboard_note"),
      v.literal("matched_role"),
      v.literal("missing_input"),
      /**
       * One release is waiting on the candidate's dashboard. It says that and
       * nothing else: never a list of the items, which is the whole point of
       * the dashboard being the place they are read.
       */
      v.literal("release_ready"),
      /**
       * The one reminder that a release is still unopened. A second
       * `release_ready` would read as the same message twice, and this is a
       * different message: it says they have not looked yet.
       */
      v.literal("release_reminder"),
    ),
    /** `dashboard` approves into a shared delivery note on the candidate's own
     *  page, which is the one place a draft becomes a record here rather than
     *  leaving the app. */
    channel: v.union(v.literal("email"), v.literal("line"), v.literal("dashboard")),
    /** The call it follows. @absent none — not drafted off a call */
    consultationId: v.optional(v.id("consultations")),
    /** The role it is about. @absent none — not about one role */
    applicationId: v.optional(v.id("applications")),
    /** The release it says is waiting. @absent none — not about a release */
    releaseId: v.optional(v.id("releases")),
    /** Email only. @absent notyet — not drafted yet, or a LINE message */
    subject: v.optional(v.string()),
    /** @absent notyet — nothing has drafted it */
    body: v.optional(v.string()),
    /**
     * `awaiting` means the event has happened and nothing has written the
     * words yet. `copied` is the end state of a LINE draft, which is as far as
     * this app goes towards sending one.
     */
    state: v.union(
      v.literal("awaiting"),
      v.literal("drafted"),
      v.literal("approved"),
      v.literal("sent"),
      v.literal("copied"),
      v.literal("discarded"),
    ),
    /** The panel as it read when the draft was asked for, label and line.
     *  @absent none — the panel was empty */
    writtenFrom: v.optional(v.array(v.object({ label: v.string(), line: v.string() }))),
    /** The decisions of the session it was drafted from.
     *  @absent none — not drafted off a session */
    decisions: v.optional(v.array(v.string())),
    at: v.number(),
    by: v.string(),
    /** @absent notyet — still awaiting words */
    filledAt: v.optional(v.number()),
    /** @absent notyet — still awaiting words */
    filledBy: v.optional(v.string()),
    /** @absent notyet — the coach has not approved or thrown it away */
    settledAt: v.optional(v.number()),
    /** @absent notyet — the coach has not approved or thrown it away */
    settledBy: v.optional(v.string()),
    /** @absent notyet — not sent */
    sentAt: v.optional(v.number()),
    /** Why the last send attempt failed, for the coach to read.
     *  @absent none — nothing has failed */
    failure: v.optional(v.string()),
  })
    .index("by_lead", ["leadId"])
    .index("by_state", ["state"]),

  /**
   * One row per job posting, shared by the public group feed and paying
   * clients' matched roles, `job-database-handoff.md` § 3. Paul's decision of
   * 12/11/2026: one job database, in this database, not a file.
   *
   * Before it there were two records that never met: `job-log.json` for the
   * feed and per-client daily files for matches, so one posting sent to the
   * group and to a client existed twice with no link between them.
   *
   * **Nothing about a person is stored here.** Who a job went to is its own
   * row in `jobPosts`, `foundRoles` or `applications`, each pointing at this
   * one, so a candidate's taste and an erasure request never reach the job.
   *
   * **A job is never re-checked.** The system looks forward at newly published
   * postings. A job turns `filled` only when it is come across again and is
   * gone: a run meets the URL, or a candidate reports it closed, or the
   * matched-role skill opens it on the day a paid role is sent. There is no
   * sweep that goes back to look, and an open job that nobody meets again
   * simply ages out.
   */
  jobs: defineTable({
    /** Canonical, by `canonicalJobUrl` in `src/lib/jobUrl.ts`. The key the
     *  whole table rests on, so it is never written raw. */
    url: v.string(),
    employer: v.string(),
    title: v.string(),
    country: v.string(),
    /** @absent unmeasured — the posting names no city */
    city: v.optional(v.string()),
    /** The posting's own date, ISO. @absent unmeasured — the page shows none */
    postedOn: v.optional(v.string()),
    /** Set when a run or a candidate comes across the job. Nothing goes back
     *  to look at a job on purpose, so `lastSeenAt` is a record of encounters
     *  and never of checks. */
    firstSeenAt: v.number(),
    lastSeenAt: v.number(),
    status: v.union(v.literal("open"), v.literal("filled"), v.literal("archived")),
    /** When it was come across again and found no longer open.
     *  @absent notyet — still open, or archived by age */
    filledAt: v.optional(v.number()),
    /** From the posting's own words, never from anyone's belief about the
     *  employer. @absent unmeasured — not read off the posting */
    sponsorship: v.optional(v.union(v.literal("stated_yes"), v.literal("stated_no"), v.literal("silent"))),
    /** The posting's words, so a gate decision can be checked against them.
     *  @absent none — nothing was quoted */
    sponsorshipQuote: v.optional(v.string()),
    /** Languages the posting requires. Empty means none required; absent means
     *  nobody read the qualifications. @absent unmeasured — not read */
    languages: v.optional(v.array(v.string())),
    /** As stated on the posting. @absent none — not stated */
    salary: v.optional(v.string()),
    /** `greenhouse`, `ashby`, `lever`, `employer_site`, `arbeitnow` and the
     *  rest. Free text: a new board should not need a migration.
     *  @absent unmeasured — not recorded */
    source: v.optional(v.string()),
    /** The public feed's Pass 1 to 3 outcome, today's `verdict` and `reason`
     *  in `job-log.json`. @absent notyet — the feed has not judged it */
    groupVerdict: v.optional(v.string()),
    /** @absent notyet — the feed has not judged it */
    groupReason: v.optional(v.string()),
    /** The posting's text, kept while open and dropped at archive.
     *  @absent none — not captured */
    description: v.optional(v.string()),
  })
    .index("by_url", ["url"])
    .index("by_status_firstSeen", ["status", "firstSeenAt"])
    .index("by_firstSeen", ["firstSeenAt"]),

  /**
   * A job that went to the public group feed, `job-database-handoff.md` § 3.
   * The record of what was posted, which `drafts/` used to be; the draft files
   * stay as the text Paul posts.
   */
  jobPosts: defineTable({
    jobId: v.id("jobs"),
    channel: v.literal("facebook_group"),
    /** The run's date, ISO. */
    draftDate: v.string(),
    /** @absent notyet — drafted, not yet posted by Paul */
    publishedAt: v.optional(v.number()),
  })
    .index("by_job", ["jobId"])
    .index("by_draftDate", ["draftDate"]),

  /**
   * The per-person filter the evening run reads, `job-database-handoff.md`
   * § 3 and § 4. One candidate's taste, never anybody else's: Paul's decision
   * D2 of 12/11/2026 is that feedback changes only that candidate's search and
   * the public feed is untouched by anyone's preferences.
   *
   * Rules rather than a model, and the reason is arithmetic: a paying client
   * receives at most 13 roles in her pack, so she yields 10 to 20 labels in
   * total. Nothing learns a preference from that. It would fit noise and
   * nobody could check it. A rule is a sentence the coach can read, switch off
   * and argue with, and it works from the first answer.
   *
   * `active` false means proposed and not yet applied. Everything read out of
   * free text arrives that way, and so do the two the handoff says the coach
   * confirms, because a figure or a title term inferred from one dislike is a
   * guess until someone agrees with it.
   */
  candidateRules: defineTable({
    leadId: v.id("leads"),
    kind: v.union(
      v.literal("exclude_employer"),
      v.literal("exclude_title_term"),
      v.literal("require_sponsorship"),
      v.literal("min_pay"),
      v.literal("require_city"),
      v.literal("exclude_language"),
      v.literal("prefer_employer"),
      v.literal("prefer_title_term"),
    ),
    /** The employer, term, city or language. Absent on `require_sponsorship`,
     *  which carries no value, and on `min_pay`, which carries a figure.
     *  @absent none — this kind carries no text */
    value: v.optional(v.string()),
    /** `min_pay` only, in `currency` a year. @absent none — not a pay rule */
    amount: v.optional(v.number()),
    /** @absent none — not a pay rule */
    currency: v.optional(v.string()),
    /** Where it came from. `feedback` is the candidate's own verdict,
     *  `coach` is typed in, `brief` is carried over from a retired brief file. */
    source: v.union(v.literal("feedback"), v.literal("coach"), v.literal("brief")),
    /** The role whose verdict produced it, so the coach can see the case.
     *  @absent none — not from one role */
    applicationId: v.optional(v.id("applications")),
    /** The candidate's own words behind it, where there were any.
     *  @absent none — produced from a reason id alone */
    quote: v.optional(v.string()),
    /** False means proposed, and the run does not apply it yet. */
    active: v.boolean(),
    createdAt: v.number(),
    /** @absent none — written by the feedback mutation, not a person */
    by: v.optional(v.string()),
    /** @absent notyet — never switched on or off by hand */
    changedAt: v.optional(v.number()),
  }).index("by_lead", ["leadId"]),

  /**
   * The coach's working notes on delivery, one row per entry, newest first on
   * the page. Not `leads.notes`, which is one overwritten field.
   *
   * `shared` notes appear on the candidate's own page, so a coach can leave
   * "what to do before our next session" where the candidate will see it. The
   * default is private: a note written about someone is not a note written to
   * them.
   */
  deliveryNotes: defineTable({
    leadId: v.id("leads"),
    body: v.string(),
    shared: v.boolean(),
    /** @absent none — a note about the whole engagement */
    deliverableId: v.optional(v.id("deliverables")),
    /** @absent none — not about one application */
    applicationId: v.optional(v.id("applications")),
    /** A decision captured in the Session tab, `prd.md` section 8.
     *  @absent none — an ordinary delivery note */
    decision: v.optional(v.boolean()),
    /** The call a decision was made in. § 7b.
     *  @absent none — not a decision, or recorded outside a call */
    consultationId: v.optional(v.id("consultations")),
    /** The decision this one explicitly replaces. Never edited afterwards.
     *  @absent none — replaces nothing */
    supersedes: v.optional(v.id("deliveryNotes")),
    at: v.number(),
    by: v.string(),
  }).index("by_lead", ["leadId", "at"]),

  /**
   * A release: everything one call produced, reaching the candidate in one
   * coach action. `coaching-delivery-design.md` § 7a.
   *
   * The pack has two and they are not symmetrical. The first carries no file at
   * all, because the Fit Report, the target titles and the markets are rows
   * this database already holds and its items point at them. The second carries
   * the pack's documents.
   *
   * **The release is the unit that becomes visible**, which is why `releasedAt`
   * lives here and not on the items: a half-shared release, a CV on the page
   * before the report that justifies it, is the failure this table exists to
   * prevent.
   *
   * The covering note stays a `deliveryNotes` row, written from the Situation
   * panel like every candidate-facing draft, and `noteId` points at it rather
   * than this table holding a second copy of its words.
   */
  releases: defineTable({
    leadId: v.id("leads"),
    /** The call it followed. @absent none — not drafted off a call */
    consultationId: v.optional(v.id("consultations")),
    /** What the coach calls it while assembling. The candidate reads the note. */
    title: v.string(),
    /**
     * `draft` while the coach is adding to it. `released` is the only state the
     * candidate sees, and it is one way: what has gone cannot be recalled, the
     * same way a sent email cannot.
     */
    state: v.union(v.literal("draft"), v.literal("released")),
    /** @absent notyet — still a draft */
    releasedAt: v.optional(v.number()),
    /** @absent notyet — still a draft */
    releasedBy: v.optional(v.string()),
    /** The covering note this release shares. @absent none — none chosen yet */
    noteId: v.optional(v.id("deliveryNotes")),
    /**
     * The facts this release repeats, and what the check of each one found,
     * `coaching-delivery-design.md` § 7a. Written from outside the app, the way
     * a transcript writes `situationProposals`, because the comparison needs
     * something with a model and this app has none. A mismatch nobody has
     * settled refuses the release.
     *
     * @absent none — nothing was found, which is not the same as nothing having
     * been looked for
     */
    facts: v.optional(
      v.array(
        v.object({
          /** The fact itself, in the words the coach reads. */
          label: v.string(),
          /** The value the release's own items use. */
          value: v.string(),
          /** Where the check looked: the panel, or a named source document. */
          source: v.string(),
          /** What that source holds. @absent none — it holds the same value */
          sourceValue: v.optional(v.string()),
          agrees: v.boolean(),
          /** The value the coach settled on. @absent notyet — not settled */
          chosen: v.optional(v.string()),
          /** @absent notyet — not settled */
          settledAt: v.optional(v.number()),
          /** @absent notyet — not settled */
          settledBy: v.optional(v.string()),
        }),
      ),
    ),
    /**
     * When the one reminder went, so a second never does. Written by the daily
     * pass, and absent on a release that was opened before the wait ran out.
     * @absent notyet — no reminder has gone
     */
    remindedAt: v.optional(v.number()),
    /**
     * When the candidate first opened it: the only measure of whether any of
     * this worked. Written once, by their own page, and not written yet. Step 3
     * of the build order in `candidate-delivery-handoff.md`.
     * @absent notyet — they have not opened it
     */
    firstOpenedAt: v.optional(v.number()),
    at: v.number(),
    by: v.string(),
  })
    .index("by_lead", ["leadId", "at"])
    .index("by_state", ["state"]),

  /**
   * One item in a release, `coaching-delivery-design.md` § 7a.
   *
   * An item points at the row that already holds the thing wherever one exists,
   * and carries the thing itself only for the kinds with no home of their own.
   * That is why no label is copied from `cvDocuments` and no note's words are
   * copied here.
   *
   * `kind` says which pointer is the real one:
   * - `report`, the Fit Report, by its `deliverableId`.
   * - `direction`, the target titles and the markets. They are `targets` rows
   *   and the Situation panel, so there is nothing further to point at and the
   *   label is what the candidate reads.
   * - `file`, either `cvDocumentId` for a CV already held, or `storageId` with
   *   its file metadata for anything else.
   * - `link`, `url`, an editable document. Whether an item may be a link at all
   *   is Decision 1 in § 7a and still open, so nothing writes this yet.
   */
  releaseItems: defineTable({
    releaseId: v.id("releases"),
    /** Denormalised for the per-person query only. The release owns the link. */
    leadId: v.id("leads"),
    kind: v.union(v.literal("report"), v.literal("direction"), v.literal("file"), v.literal("link")),
    /** The piece of paid work it belongs to. @absent none — not tied to one */
    deliverableId: v.optional(v.id("deliverables")),
    /** What the candidate reads, in their language. */
    label: v.string(),
    /** A CV this database already holds. @absent none — not a CV */
    cvDocumentId: v.optional(v.id("cvDocuments")),
    /** A file with no other home. @absent none — not an uploaded file */
    storageId: v.optional(v.id("_storage")),
    /** @absent none — not an uploaded file */
    fileName: v.optional(v.string()),
    /** @absent none — not an uploaded file */
    contentType: v.optional(v.string()),
    /** @absent none — not an uploaded file */
    bytes: v.optional(v.number()),
    /** An editable document. @absent none — not a link */
    url: v.optional(v.string()),
    /**
     * What the candidate says is wrong in this item, `coaching-delivery-design.md`
     * § 7a. The same shape `deliverables.errorReports` has, for the same reason:
     * an unresolved one holds the coaching open. The difference is that this
     * covers every paid item rather than the complimentary documents alone.
     *
     * Recorded by the coach from what the candidate told them until the
     * candidate's own line on their page has its Thai read.
     *
     * @absent none — nothing reported
     */
    corrections: v.optional(
      v.array(
        v.object({
          reportedAt: v.number(),
          summary: v.string(),
          /** @absent notyet — still open */
          resolvedAt: v.optional(v.number()),
          /** @absent notyet — still open */
          resolvedBy: v.optional(v.string()),
        }),
      ),
    ),
    /** Its place on the candidate's page, 1 upward. */
    order: v.number(),
    at: v.number(),
    by: v.string(),
  })
    .index("by_release", ["releaseId", "order"])
    .index("by_lead", ["leadId"]),

  /**
   * The candidate's preparation for the complimentary preview, § 7b. One row
   * per session, kept through a reschedule, written only by the signed-in
   * candidate it belongs to (`portal.submitPreparation`).
   */
  preparations: defineTable({
    leadId: v.id("leads"),
    deliverableId: v.id("deliverables"),
    /** One to three. */
    priorities: v.array(v.string()),
    /** A change they want to their target titles, which the coach makes in
     *  `targets`. @absent none — no change asked for */
    titleChanges: v.optional(v.string()),
    /** Zero to two, https. Optional examples never block the session. */
    vacancyUrls: v.array(v.string()),
    /** What they most want answered. @absent none — not given */
    question: v.optional(v.string()),
    submittedAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_lead", ["leadId"])
    .index("by_deliverable", ["deliverableId"]),
  /**
   * Who may sign in to their own page at `/me`. `lifecycle-data-model.md`
   * § 10, option (b): a real candidate account, email and a one-time code, no
   * password.
   *
   * Access is a grant a coach makes from the Candidate 360, never a side
   * effect of having an email on a lead. `leads.email` is not unique, so
   * resolving a signed-in person by email alone could open the wrong record;
   * this row names the lead explicitly. A code is only ever emailed to an
   * address with a live grant, so the sign-in form cannot be used to mail
   * strangers.
   */
  candidateAccess: defineTable({
    leadId: v.id("leads"),
    /** Lower-cased. The address the code goes to. */
    email: v.string(),
    grantedAt: v.number(),
    by: v.string(),
    /** @absent notyet — still live */
    revokedAt: v.optional(v.number()),
    /** @absent notyet — never signed in */
    lastSignInAt: v.optional(v.number()),
    /** When the current permanent code was made, 01/11/2026 design.
     *  @absent none — granted before permanent codes, or not issued yet */
    codeIssuedAt: v.optional(v.number()),
    /** How the current code reached them: emailed, held for the coach to send
     *  on LINE (no mail sender), or failed to email and held.
     *  @absent none — no code issued yet */
    codeDelivery: v.optional(v.union(v.literal("emailed"), v.literal("held"), v.literal("failed"))),
    /** Why it was held or failed. @absent none — emailed or not issued */
    codeDeliveryNote: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_lead", ["leadId"]),
  /**
   * A candidate's permanent code held for the coach to pass on by LINE,
   * because it could not be emailed: no mail sender is configured, or the send
   * failed. `candidateCode.ts` writes here, only for an address with a live
   * `candidateAccess` grant.
   *
   * Plain text on purpose and for 24 hours at most: the coach has to be able
   * to read it out. Only `requireAdmin` reads it, a successful sign-in or an
   * emailed code deletes it, and an expired row is ignored and overwritten.
   * Once email is configured this table stays empty.
   */
  pendingSignInCodes: defineTable({
    email: v.string(),
    code: v.string(),
    expiresAt: v.number(),
    at: v.number(),
  }).index("by_email", ["email"]),
  /**
   * A candidate asking for more tokens from their page. Payment stays one to
   * one by transfer (`pricing.ts`); this only tells the coach to send the
   * details. One open request per candidate.
   */
  tokenRequests: defineTable({
    leadId: v.id("leads"),
    at: v.number(),
    /** @absent notyet — not handled yet */
    handledAt: v.optional(v.number()),
    /** @absent none — handled without a note */
    note: v.optional(v.string()),
  }).index("by_lead", ["leadId", "at"]),

  /**
   * The roles the job pipeline published, for the candidate's "Jobs for you"
   * feed. Added 30/10/2026 so the feed is as fresh as the last pipeline run
   * rather than the last deploy.
   *
   * Written only by `market.replaceRoles`, which `scripts/push-market-roles.ts`
   * calls after the evening run. Each push is the whole recent published set,
   * so a role the pipeline stopped publishing goes on the next push. Holds
   * nothing about any person. When it is empty the feed falls back to the list
   * built into the app.
   */
  marketRoles: defineTable({
    /** The job-log id, stored as applications.jobLogId when a candidate saves it. */
    roleId: v.string(),
    employer: v.string(),
    title: v.string(),
    country: v.string(),
    /** YYYY-MM-DD, as the job log has it. */
    firstSeen: v.string(),
    /** Empty when the log has no link. */
    url: v.string(),
    /** When the push that last wrote this row ran. */
    syncedAt: v.number(),
  })
    .index("by_role_id", ["roleId"])
    .index("by_first_seen", ["firstSeen"]),

  /**
   * The job titles a candidate goes for, set with the coach in the Direction
   * conversation. `lifecycle-data-model.md` § 8a and `10_Methodology.md`
   * Stage 0. Everything downstream hangs off the title: its CV, its feed, its
   * applications.
   *
   * At most four active, usually three, enforced on write. A dropped title keeps its CVs and applications as history.
   */
  targets: defineTable({
    leadId: v.id("leads"),
    /** As job ads write it: "Customer Success Manager", not a field. */
    title: v.string(),
    /** Other names recruiters search for the same role. Matching and
     *  LinkedIn only; variants of one role share one CV. */
    alsoCalled: v.array(v.string()),
    /** One of ROLE_CATEGORIES. @absent none — not mapped to a field */
    roleCategory: v.optional(v.string()),
    /** Where this title is pursued, a subset of the candidate's countries.
     *  @absent all — every country the candidate named */
    countries: v.optional(v.array(v.string())),
    /** 1 to 5 among active targets; 1 is pushed first and is the one the Fit
     *  Report reads against. Paused and dropped rows keep their last value. */
    priority: v.number(),
    status: v.union(v.literal("active"), v.literal("paused"), v.literal("dropped")),
    /** Coach-only: what in their background carries this title.
     *  @absent none — not written down */
    evidenceNote: v.optional(v.string()),
    createdAt: v.number(),
    by: v.string(),
  }).index("by_lead", ["leadId", "priority"]),
});
