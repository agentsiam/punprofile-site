import type { Copy } from "./copy";

/**
 * Search descriptions: the line under a page's title in a search result.
 * 01/11/2026.
 *
 * Search-only. Nothing here appears on a page, and the visible text these
 * stand beside (the home subhead, the article summaries) is unchanged. They
 * exist because those visible strings ran past the 160 characters a result
 * shows, or because one page borrowed another page's line and the two looked
 * like one page in search. `npm run audit:seo` is the check.
 *
 * Approved in `seo-meta-copy-handoff.md`, in the sibling repo. Change the line
 * there first.
 */

/** `/efc-assessment`. It had borrowed the home page's description. */
export const EFC_ASSESSMENT_SEARCH: Copy = {
  th: "ทำ EU Fit Check ได้ฟรีบนมือถือ ใช้เวลาประมาณ 2 นาที ประเมินความพร้อมทำงานในยุโรปทั้ง 4 ด้าน ดูผลเบื้องต้นได้โดยไม่ต้องสมัครสมาชิก",
  en: "Take the free EU Fit Check on your phone in about two minutes. Assess four areas of readiness for work in Europe and see initial results without signing up.",
};

/**
 * `/en`. English only: the Thai home description is the subhead and fits,
 * and its English translation did not.
 */
export const HOME_SEARCH_EN = "PunProfile works with Thai professionals targeting Europe on career direction, profile refinement and applications, one role at a time.";

/**
 * Per article, by slug, only where the summary does not fit. A language left
 * out falls back to the article's own summary.
 */
export const ARTICLE_SEARCH: Record<string, Partial<Copy>> = {
  "cara-working-in-spain": {
    en: "Cara's 6 lessons from Thai student to work in Spain: a third language is not always needed, age is not the main issue, and CV photos help less than you think.",
  },
  "start-in-europe": {
    th: "วางแผน 3 เรื่องก่อนสมัครงานในยุโรป: จะเจาะตลาดไหน ย้ายประเทศด้วยเส้นทางใด และจะทำให้นายจ้างเห็นคุณค่าของประสบการณ์จากไทยอย่างไร",
    en: "Plan three things before applying in Europe: which market to target, how to relocate and how to show employers the value of your experience in Thailand.",
  },
};

/** An article's search description: the override where there is one, else its summary. */
export function articleSearch(post: { slug: string; summary: Copy }): Copy {
  const o = ARTICLE_SEARCH[post.slug] ?? {};
  return { th: o.th ?? post.summary.th, en: o.en ?? post.summary.en };
}
