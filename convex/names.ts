/**
 * The name PunProfile greets a candidate by, everywhere they see one: the
 * dashboard and every email. The coach-set nickname when there is one, else
 * the first name, else nothing (the caller then greets without a name).
 */
export function greetingName(lead: { nickname?: string; firstName?: string } | null | undefined): string | null {
  return lead?.nickname?.trim() || lead?.firstName?.trim() || null;
}
