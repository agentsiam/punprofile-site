/**
 * One Situation row as it arrives from a form, and as a proposal is stored.
 *
 * Its own module because two places need the same shape and neither may own
 * it: `schema.ts` stores a proposed row, and `situation.ts` takes a row from
 * the panel and the close form. A second copy of this union is how a proposal
 * starts being a slightly different thing from the row it proposes.
 *
 * `row` names which row, so a save carries only what moved: a close form sends
 * two or three of these, never a whole panel.
 */

import { v } from "convex/values";

export const rowInput = v.union(
  v.object({ row: v.literal("goal"), countries: v.array(v.string()), cities: v.array(v.string()) }),
  v.object({ row: v.literal("seniority"), text: v.string() }),
  v.object({ row: v.literal("workRoute"), text: v.string(), changesOn: v.optional(v.string()) }),
  v.object({ row: v.literal("availableFrom"), date: v.string() }),
  v.object({
    row: v.literal("employersMustOffer"),
    sponsorship: v.union(v.literal("required"), v.literal("not_required"), v.literal("required_until_available")),
    payFloor: v.optional(
      v.object({ amount: v.number(), currency: v.string(), per: v.union(v.literal("year"), v.literal("month")) }),
    ),
    languages: v.array(v.string()),
  }),
  v.object({ row: v.literal("heardFromEmployers"), objections: v.array(v.string()) }),
  v.object({ row: v.literal("whereTheyAreNow"), text: v.string() }),
  v.object({ row: v.literal("nextFromUs"), text: v.string(), dueOn: v.optional(v.string()) }),
);

export type RowInput = typeof rowInput.type;
