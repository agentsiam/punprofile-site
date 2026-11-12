import type { Metadata } from "next";
import MatchFeedback from "@/components/features/portal/MatchFeedback";
import { MATCH_FEEDBACK_BODY } from "@/lib/content/matchFeedback";
import { DEFAULT_LOCALE, pick } from "@/lib/locale";
import { NOT_INDEXED } from "@/lib/seo";

/**
 * `/match-feedback/<token>?v=up|down`, 12/11/2026. Never indexed: the URL is
 * a capability on one candidate's matched role, as `/unsubscribe/<token>`.
 */
export const metadata: Metadata = {
  ...NOT_INDEXED,
  title: pick(MATCH_FEEDBACK_BODY, DEFAULT_LOCALE),
};

export default async function MatchFeedbackPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ v?: string }>;
}) {
  const { token } = await params;
  const { v } = await searchParams;
  return <MatchFeedback token={token} initial={v === "down" ? "down" : "up"} />;
}
