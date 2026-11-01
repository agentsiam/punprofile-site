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
 * Approved in `seo-meta-copy-handoff.md`, in the sibling repo. Where only one
 * language needed a new line, the other carries the existing approved string
 * unchanged, because every record here is a pair.
 */

/** `/efc-assessment`. It had borrowed the home page's description. */
export const EFC_ASSESSMENT_SEARCH: Copy = {
  en: "Take the free EU Fit Check on your phone in about two minutes. Assess four areas of readiness for work in Europe and see initial results without signing up.",
  th: "ทำ EU Fit Check ได้ฟรีบนมือถือ ใช้เวลาประมาณ 2 นาที ประเมินความพร้อมทำงานในยุโรปทั้ง 4 ด้าน ดูผลเบื้องต้นได้โดยไม่ต้องสมัครสมาชิก",
};

/** The home page. Only `en` is read: the Thai root layout keeps `landing.subhead`. */
export const HOME_SEARCH: Copy = {
  en: "PunProfile works with Thai professionals targeting Europe on career direction, profile refinement and applications, one role at a time.",
  th: "PunProfile ทำงานร่วมกับคนไทยที่ตัดสินใจแล้วว่าจะมุ่งสู่ตลาดงานยุโรป ตั้งแต่การวางทิศทางอาชีพและปรับโปรไฟล์ ไปจนถึงการสมัครงานทีละตำแหน่ง",
};

/** Per article, by slug, only where the summary does not fit. */
export const ARTICLE_SEARCH: Record<string, Copy> = {
  "cara-working-in-spain": {
    en: "Cara's 6 lessons from Thai student to work in Spain: a third language is not always needed, age is not the main issue, and CV photos help less than you think.",
    th: "ไม่ต้องพูดภาษาที่ 3 ก็ทำงานในบริษัทได้ อายุไม่ใช่ปัญหาหลัก และรูปในเรซูเม่ไม่ได้ช่วยอย่างที่คิด คาร่าเล่า 6 เรื่องจากเส้นทางนักเรียนไทยสู่คนทำงานในสเปน",
  },
  "start-in-europe": {
    en: "Plan three things before applying in Europe: which market to target, how to relocate and how to show employers the value of your experience in Thailand.",
    th: "วางแผน 3 เรื่องก่อนสมัครงานในยุโรป: จะเจาะตลาดไหน ย้ายประเทศด้วยเส้นทางใด และจะทำให้นายจ้างเห็นคุณค่าของประสบการณ์จากไทยอย่างไร",
  },
};

/** An article's search description: the override where there is one, else its summary. */
export function articleSearch(post: { slug: string; summary: Copy }): Copy {
  return ARTICLE_SEARCH[post.slug] ?? post.summary;
}
