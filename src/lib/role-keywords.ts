/**
 * The title words that put a published role in a role category. Split out of
 * `market-match.ts` on 30/10/2026 so the Convex feed can match server-side
 * without bundling the generated role list that module imports.
 *
 * A role fits a category when its title carries one of these words. Titles are
 * the only role signal the job log holds, so this is a title match, never an
 * eligibility check.
 */

/** Lower-case title keywords per role category, from `questions.ts` ROLE_CATEGORIES. */
export const ROLE_KEYWORDS: Record<string, string[]> = {
  // No bare "engineer" or "security": both pulled aerospace, mechanical and
  // site-security roles into an IT feed (Paul, 30/10/2026). A title counts
  // only on a word that is about software, systems or IT support itself.
  "IT & Software": [
    "software", "developer", "devops", "frontend", "front-end", "backend", "back-end", "full stack", "fullstack",
    "cloud", " it ", "sre", "site reliability", "qa ", "test automation", "mobile", " ios", "android", "web",
    "platform engineer", "infrastructure", "sysadmin", "system administrator", "systems administrator", "network",
    "cyber", "security engineer", "application security", "data engineer", "machine learning", " api",
    "support engineer", "technical support", "it support", "helpdesk", "help desk", "solutions engineer",
  ],
  "Engineering & Technical": ["engineer", "mechanical", "electrical", "civil", "technician", "hardware", "manufacturing", "process"],
  "Data & Analytics": ["data", "analyst", "analytics", "machine learning", "ml ", "bi ", "scientist"],
  "Finance & Accounting": ["finance", "financial", "accountant", "accounting", "controller", "audit", "tax", "treasury"],
  Marketing: ["marketing", "seo", "content", "brand", "growth", "crm", "social media", "communications"],
  "Sales & Business Development": ["sales", "business development", "account executive", "bdr", "sdr"],
  "Customer Success & Account Management": ["customer success", "account manager", "customer support", "customer service", "client"],
  "HR & People": ["hr", "human resources", "people", "recruiter", "talent"],
  "Design & Creative": ["designer", "design", "ux", "ui", "creative"],
  "Procurement, Supply Chain & Operations": ["procurement", "supply chain", "logistics", "operations", "purchasing", "buyer"],
  "Business, Strategy & Project": ["project", "program", "product manager", "strategy", "business analyst", "consultant"],
  "Education & Training": ["teacher", "trainer", "education", "tutor", "instructor"],
  "Healthcare & Life Sciences": ["nurse", "doctor", "clinical", "medical", "pharma", "health", "biotech"],
  "Hospitality & Tourism": ["hotel", "chef", "cook", "hospitality", "restaurant", "tourism", "travel"],
  "Legal & Compliance": ["legal", "lawyer", "compliance", "counsel", "paralegal"],
  "Research & Science": ["research", "scientist", "phd", "postdoc", "laboratory", "lab "],
};

/** Whether `title` carries a word of `category`. Padded so " it " matches at either end. */
export function titleMatches(title: string, category: string): boolean {
  const words = ROLE_KEYWORDS[category] ?? [];
  const t = ` ${title.toLowerCase()} `;
  return words.some((w) => t.includes(w));
}

/** The UK is stored as "United Kingdom" in the job log; the assessment says "UK". */
export const logCountry = (c: string) => (c === "UK" ? "United Kingdom" : c);
