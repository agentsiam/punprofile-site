/**
 * Paul's Cal.com booking links. `00_Quick_Facts.md` owns them; this mirrors
 * it, and changes with it. `prd.md` section 8.
 */
export const CAL_LINKS = {
  /** Fit Report assessment, 30 minutes. */
  assessment: "https://cal.com/paul-bussabong-a5rt7n/30min",
  /** The ฿1,500 pack's complimentary preview, 60 minutes. */
  preview: "https://cal.com/paul-bussabong-a5rt7n/1-hour-meeting",
} as const;

/**
 * The booking link a deliverable's button uses. A link the coach set wins.
 * Otherwise only the pack's preview has one, its 60-minute link, and only
 * while no call serving it is scheduled (the preparation deadline is computed
 * from that call, so a null deadline means none is), so a booked preview is
 * never offered a second booking. The preparation is absent once the preview
 * is delivered.
 */
export function bookingUrlFor(
  d: { _id: string; bookingUrl: string | null },
  preparation: { deliverableId: string; deadline: number | null } | null,
): string | null {
  if (d.bookingUrl) return d.bookingUrl;
  if (preparation && preparation.deliverableId === d._id && preparation.deadline === null) return CAL_LINKS.preview;
  return null;
}
