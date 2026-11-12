import type { Metadata } from "next";
import { MATCH_FEEDBACK_BODY } from "@/lib/content/matchFeedback";
import { pick } from "@/lib/locale";
import { NOT_INDEXED } from "@/lib/seo";

/** `/en/match-feedback/<token>`. See the Thai route. */
export const metadata: Metadata = {
  ...NOT_INDEXED,
  title: pick(MATCH_FEEDBACK_BODY, "en"),
};

export { default } from "../../../../(th)/match-feedback/[token]/page";
