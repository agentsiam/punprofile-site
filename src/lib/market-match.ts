/**
 * Which published roles fit one candidate, for the paid Fit Report. Added
 * 26/10/2026.
 *
 * A role fits when its country is one the candidate named and its title carries
 * a keyword of their role category. Titles are the only role signal the job log
 * holds, so this is a title match and the report says so; it is never presented
 * as an eligibility check, which is the coach's job in the interview.
 */
import { MARKET_ROLES, type MarketRole } from "./content/market-roles.generated";

/** Lower-case title keywords per role category, from `questions.ts` ROLE_CATEGORIES. */
const ROLE_KEYWORDS: Record<string, string[]> = {
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

export interface RoleMatch {
  /** Published roles in the candidate's countries. */
  inCountries: number;
  /** Of those, the ones whose title matches their role category. */
  matching: number;
  /** The newest matching roles, at most three. */
  examples: MarketRole[];
}

export function matchRoles(countries: string[], roleCategory: string | null | undefined): RoleMatch {
  const wanted = new Set(countries.map((c) => (c === "UK" ? "United Kingdom" : c)));
  const inCountries = MARKET_ROLES.filter((r) => wanted.has(r.country));
  const words = roleCategory ? ROLE_KEYWORDS[roleCategory] ?? [] : [];
  const matching = words.length
    ? inCountries.filter((r) => {
        const t = ` ${r.title.toLowerCase()} `;
        return words.some((w) => t.includes(w));
      })
    : [];
  return { inCountries: inCountries.length, matching: matching.length, examples: matching.slice(0, 3) };
}

/**
 * Every published role in the candidate's countries whose title matches their
 * role category, newest first, from the last `days` days. The candidate's
 * "Jobs for you" feed. Transparent by construction: country is equal, and a
 * title contains one of the category's words. Not a recommender.
 *
 * Recent only: Paul's rule for the pipeline is that an aged entry is not worth
 * resurfacing, whatever the reason it aged.
 */
export function rolesFor(
  countries: string[],
  roleCategory: string | null | undefined,
  days = 30,
  now = Date.now(),
): MarketRole[] {
  const wanted = new Set(countries.map((c) => (c === "UK" ? "United Kingdom" : c)));
  const words = roleCategory ? ROLE_KEYWORDS[roleCategory] ?? [] : [];
  if (!words.length || !wanted.size) return [];
  const since = new Date(now - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return MARKET_ROLES.filter((r) => {
    if (!wanted.has(r.country) || r.firstSeen < since) return false;
    const t = ` ${r.title.toLowerCase()} `;
    return words.some((w) => t.includes(w));
  });
}
