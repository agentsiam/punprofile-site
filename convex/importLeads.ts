import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { knowsCategory } from "../src/lib/role-keywords";

/**
 * TASK-053: backfill the historical Lead Discovery Survey responses.
 *
 * `internalMutation`, so it is unreachable from any client and can only be run
 * from the CLI by someone already holding deployment access.
 *
 * **Idempotent on `email`.** Re-running updates the matching lead rather than
 * creating a second one, because an import that duplicates on retry is worse
 * than one that fails: you find out about a failure, and you do not find out
 * about ninety silent duplicates until the coach starts calling people twice.
 *
 * Consent is written only for channels the respondent actually nominated in
 * "ช่องทางติดต่อที่สะดวกที่สุด". The Google account address is stored but carries
 * no timestamp, because the form never offered email as a way to be reached and
 * a timestamp there would assert a consent nobody gave.
 */
const leadArg = v.object({
  fullName: v.string(),
  email: v.optional(v.string()),
  phone: v.optional(v.string()),
  lineId: v.optional(v.string()),
  /** True only when they typed an address as their chosen channel. */
  emailNominated: v.boolean(),
  /** The contact answer verbatim, so a Facebook or LinkedIn link survives. */
  contactRaw: v.string(),
  /** Their submission time, which is the basis date for consent. */
  submittedAt: v.number(),
  responses: v.record(v.string(), v.any()),
  scores: v.object({
    professionalCapability: v.optional(v.number()),
    employability: v.optional(v.number()),
    mobilityReadiness: v.optional(v.number()),
    europeanMarketFit: v.optional(v.number()),
  }),
});

/**
 * Batched, because the whole backfill then lands in ONE transaction. Ninety
 * separate calls can fail halfway and leave the table half-migrated, with no
 * clean way to tell which rows made it.
 */
/**
 * Records email consent for imported leads that have an address but no
 * timestamp, dated to their form submission.
 *
 * **Dated to submission, not to now, and that is a deliberate change from what
 * was asked.** A consent timestamp answers "when did this person agree". Every
 * one of these people did hand over their address, on the day they submitted
 * the form; none of them did anything at all today. Stamping today's date would
 * put an event in the audit trail that never happened, which is the one failure
 * mode a consent log cannot survive: if the record is ever challenged, a
 * fabricated date is worse evidence than an absent one.
 *
 * Submission is also consistent with the phone and LINE consents already
 * written by the import, so the whole record reads as one coherent event rather
 * than a real one plus a backfilled one.
 *
 * Only touches `survey_import` rows. An app-native lead without email consent
 * declined it at the gate, and that is a real answer to leave alone.
 */
export const backfillEmailConsent = internalMutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("leads").collect();
    let updated = 0;
    let skippedNoEmail = 0;

    for (const lead of all) {
      if (lead.consentSource !== "survey_import") continue;
      if (lead.emailConsentAt) continue;
      if (!lead.email) {
        skippedNoEmail++;
        continue;
      }
      await ctx.db.patch(lead._id, {
        emailConsentAt: lead.createdAt,
        updatedAt: Date.now(),
      });
      updated++;
    }
    return { updated, skippedNoEmail };
  },
});

export const importLegacyLeads = internalMutation({
  args: { leads: v.array(leadArg) },
  handler: async (ctx, args) => {
    let inserted = 0;
    let updated = 0;

    for (const lead of args.leads) {
      const existing = lead.email
        ? await ctx.db
            .query("leads")
            .withIndex("by_email", (q) => q.eq("email", lead.email))
            .first()
        : null;

      const at = lead.submittedAt;
      const fields = {
        fullName: lead.fullName,
        ...(lead.email ? { email: lead.email } : {}),
        ...(lead.phone ? { phone: lead.phone, phoneConsentAt: at } : {}),
        ...(lead.lineId ? { lineId: lead.lineId, lineConsentAt: at } : {}),
        ...(lead.emailNominated && lead.email ? { emailConsentAt: at } : {}),
        consentSource: "survey_import" as const,
        // The raw answer rides along with the responses so nothing the
        // candidate wrote is lost to a parser that did not know its shape.
        responses: { ...lead.responses, _contactRaw: lead.contactRaw },
        scores: lead.scores,
        status: "email_captured" as const,
        source: "survey_import",
        updatedAt: Date.now(),
        lastActivityAt: at,
      };

      if (existing) {
        await ctx.db.patch(existing._id, fields);
        updated++;
      } else {
        await ctx.db.insert("leads", { ...fields, createdAt: at });
        inserted++;
      }
    }
    return { inserted, updated };
  },
});

/**
 * Sets `leads.roleCategory` from a field a person read out of each lead's own
 * free-text answer to the field question. Fed the reviewed file directly:
 *
 *   npx convex run importLeads:setRoleFields "$(cat data/role-field-2026-11-23.json)"
 *
 * **The raw answer is never touched.** What the candidate wrote stays in
 * `responses.targetRole` and is still what the coach's answer record shows.
 * Only the reading is stored, beside it, with who read it and when.
 *
 * **`answer` is a guard, not data.** It is the answer as the reader saw it, and
 * a row whose answer has changed since is skipped and reported rather than
 * written: a reading belongs to the words it was made from. Same reason
 * `backfill-leads.ts` refuses a shifted sheet instead of guessing.
 *
 * **Idempotent.** A row already holding the same field is left alone and
 * counted as unchanged, so a run that dies half way is resumed by running it
 * again (R45). Nothing here depends on the deploy that added the field, and
 * nothing the deploy does depends on this having run (R43): before it, the
 * write is rejected by the schema and nothing happens; after it and before
 * this, every row's field is absent and `portal.ts` falls back to the raw
 * answer, which is today's behaviour.
 *
 * **Stamped with the day the answers were read, not the day this ran**, for
 * the reason `backfillEmailConsent` dates consent to submission: the timestamp
 * answers when the reading was made, and a reading made on one day does not
 * become a different one because the write was slow. It also keeps re-runs
 * byte-identical.
 *
 * `field: null` is an answer that named no field, or named only a sector no
 * category covers. Those are left absent rather than guessed, which is the
 * whole point of `knowsCategory`: never searched reads differently to nothing
 * found.
 */
export const setRoleFields = internalMutation({
  args: {
    /** ISO date the answers were read. Written to every row it sets. */
    readOn: v.string(),
    /** Who read them. */
    by: v.string(),
    /** Which export the answers were read out of. Not stored: it is here so
     *  the file says what it was made from (C33). */
    source: v.string(),
    /** The rule the reader applied, in one sentence. Not stored, same reason. */
    rule: v.string(),
    leads: v.array(
      v.object({
        leadId: v.id("leads"),
        /** The answer as the reader saw it. Checked, never written. */
        answer: v.string(),
        /** One of ROLE_CATEGORIES, or null where the answer named no field. */
        field: v.union(v.string(), v.null()),
        /** Why, for whoever reads the run. Not stored. */
        note: v.string(),
        /** How many countries the lead named. Context only, not stored. */
        countries: v.optional(v.number()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const at = Date.parse(`${args.readOn}T00:00:00Z`);
    if (Number.isNaN(at)) throw new Error(`readOn is not an ISO date: ${args.readOn}`);

    // A category the keyword table cannot read would store a field that finds
    // nothing and still reports itself as searched, which is worse than absent.
    // The whole batch stops, because one bad value means the file is wrong.
    for (const l of args.leads) {
      if (l.field !== null && !knowsCategory(l.field)) {
        throw new Error(`not a role category the keyword table holds: ${l.field}`);
      }
    }

    let set = 0;
    let unchanged = 0;
    let unmapped = 0;
    const missing: string[] = [];
    const changed: string[] = [];

    for (const l of args.leads) {
      if (l.field === null) {
        unmapped++;
        continue;
      }
      const lead = await ctx.db.get(l.leadId);
      // Erased since the export was taken, which is a PDPA deletion doing
      // exactly what it should.
      if (!lead) {
        missing.push(l.leadId);
        continue;
      }
      const current = (lead.responses ?? {}) as Record<string, unknown>;
      if (current.targetRole !== l.answer) {
        changed.push(l.leadId);
        continue;
      }
      if (lead.roleCategory === l.field) {
        unchanged++;
        continue;
      }
      await ctx.db.patch(l.leadId, {
        roleCategory: l.field,
        roleCategoryAt: at,
        roleCategoryBy: args.by,
        updatedAt: Date.now(),
      });
      set++;
    }

    return { set, unchanged, unmapped, missing, changed };
  },
});
