"use client";

/**
 * `/me/<token>`, the paying candidate's own page. Outside both language trees
 * like `/admin`, because it is reached only by a link a coach sends, it is never
 * indexed (`robots.ts` closes `/me/`, the private layout sets `NOT_INDEXED`),
 * and the token in the path is the credential. The locale comes from the cookie,
 * Thai by default, and the site's own language switch changes it.
 *
 * The page renders nothing about the person until `portal.view` has checked
 * the token on the server; a bad or expired link gets one neutral message.
 */

import { use } from "react";
import CandidatePortal from "@/components/features/portal/CandidatePortal";

export default function MyPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  return <CandidatePortal token={token} />;
}
