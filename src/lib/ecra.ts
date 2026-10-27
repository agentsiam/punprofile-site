/**
 * The ECRA rating rules for every competency, as the coach applies them in the
 * Fit Report interview. Copied from the framework tables in
 * `08_Coaching_Business.md` on 26/10/2026; that file owns them, and a change
 * there is copied here, never made here first.
 *
 * Coach-facing English only. A candidate never sees an indicator's wording:
 * the Fit Report shows how many of the four were met, and the coach's own note.
 *
 * `indicators`: score = 1 + the number met, so 1 to 5.
 * `lookup`: the coach picks one level, listed best first, so the first is 5.
 */
export type EcraRule =
  | { formula: "indicators"; indicators: string[]; autoFiveIfNoDependents?: boolean }
  | { formula: "lookup"; source: string; levels: string[] };

export const ECRA: Record<string, EcraRule> = {
  technicalExpertise: { formula: "indicators", indicators: ["Explains methodology/tools unprompted", "cites verifiable outcomes, not generic duties", "aware of current field standards/trends", "Q6 years of experience \u2265 2"] },
  problemSolving: { formula: "indicators", indicators: ["Breaks a case into components before answering", "references evidence over pure intuition", "names \u22651 trade-off/risk", "reaches a clear recommendation"] },
  communication: { formula: "indicators", indicators: ["Explains complex topics in plain language", "structures answers without rambling", "adjusts explanation when asked to clarify", "written messages are clear, typo-free"] },
  collaboration: { formula: "indicators", indicators: ["Gives a specific (not generic) team example", "describes own contribution, not just team's", "mentions a conflict handled constructively", "account is internally consistent"] },
  leadershipOwnership: { formula: "indicators", indicators: ["Describes unprompted initiative", "describes owning and correcting a mistake", "has led/mentored \u22651 person", "frames outcomes as driven, not assigned"] },
  strategicThinking: { formula: "indicators", indicators: ["Connects a past decision to a longer-term goal", "articulates target market's bigger-picture trends", "prioritizes among options when asked", "distinguishes urgent from important"] },
  execution: { formula: "indicators", indicators: ["Q12 shows \u22651 completed application (follow-through)", "describes a project taken plan-to-completion", "names a concrete deadline kept", "no major unfinished commitment blocking search"] },
  learningAgility: { formula: "indicators", indicators: ["Q21 shows \u22651 prior paid course/cert/coaching", "describes a skill learned in the last 12 months unprompted", "names a specific method they use to keep learning", "shows willingness to learn new language/tool for the EU market"] },
  cvQuality: { formula: "indicators", indicators: ["Quantified achievements present (numbers/metrics)", "tailored to a specific target role, not generic", "no ATS-breaking formatting (tables/images/unusual fonts)", "\u22642 pages, EU-standard format"] },
  linkedinProfile: { formula: "indicators", indicators: ["Headline states target role/value proposition", "About section populated and role-specific", "active engagement in last 90 days", "skills section matches target-role keywords"] },
  interviewSkills: { formula: "indicators", indicators: ["Uses a structured answer format (e.g. STAR) unprompted", "steady under a follow-up/pushback question", "asks \u22651 substantive question of the interviewer", "answer length appropriate, not rambling/one-word"] },
  personalBrand: { formula: "indicators", indicators: ["CV, LinkedIn, and verbal pitch tell a consistent story", "states value proposition in one sentence unprompted", "differentiates from a generic candidate in their field", "positioning matches actual target role"] },
  networking: { formula: "indicators", indicators: ["Has \u22651 professional contact in a target country/company", "reached out cold in the last 6 months for career purposes", "active in \u22651 relevant professional community", "names a specific next networking action"] },
  jobSearchStrategy: { formula: "indicators", indicators: ["Q12 shows targeted applications, not undifferentiated volume", "has a defined application cadence/target", "uses more than one channel (boards + referrals + direct outreach)", "tracks and follows up systematically"] },
  aiDigitalFluency: { formula: "indicators", indicators: ["Uses AI tools weekly for search-related tasks", "comfortable with core EU workplace tools (Slack/Teams/Notion)", "has used AI to tailor materials, not just generic ones", "adopted \u22651 digital tool independently, not because required"] },
  recruiterReadiness: { formula: "indicators", indicators: ["Responds to coach outreach within 24 hours", "arrives prepared to sessions (materials/questions ready)", "follows through on agreed action items", "professional tone in written correspondence"] },
  visaReadiness: { formula: "lookup", source: "Lookup (Q18)", levels: ["EU passport/existing work rights", "sponsorship needed, specific route named", "sponsorship needed, no route named", "unsure what's needed", "no awareness"] },
  qualificationRecognition: { formula: "lookup", source: "Lookup (coach research)", levels: ["Confirmed recognized/not required", "recognition process identified and started", "identified, not started", "unclear, research pending", "not yet assessed"] },
  financialPreparedness: { formula: "indicators", indicators: ["States a specific relocation budget figure", "budget covers \u22653 months of target-country costs (self-reported, coach sanity-checks)", "no financial-blocker language in Q19/Q20", "names a concrete funding plan (savings/support/loan)"] },
  relocationPlanning: { formula: "indicators", indicators: ["Q10 timeline is specific, not \"just exploring\"", "has identified target city/region, not just country", "has researched housing/cost of living for that location", "has a rough month-by-month plan to target start date"] },
  languageReadiness: { formula: "lookup", source: "Lookup (Q16/Q17, verified where tested)", levels: ["Native/C2", "fluent/C1", "conversational/B1\u2013B2", "basic/A1\u2013A2", "not functional"] },
  familyReadiness: { formula: "indicators", indicators: ["Discussed relocation with all affected family members", "no unresolved objection from a dependent/partner", "has a plan for dependents (schooling, partner's work) or confirmed N/A", "timeline accounts for family logistics"], autoFiveIfNoDependents: true },
  culturalAdaptability: { formula: "indicators", indicators: ["Q9 motivation reflects genuine cultural/lifestyle interest, not economics only", "has lived/traveled outside Thailand before", "describes handling an unfamiliar cultural situation well", "shows unprompted curiosity about target country's culture"] },
  administrativeReadiness: { formula: "indicators", indicators: ["Passport valid \u226512 months", "degree/certificates translated/apostilled or in progress", "aware of the document checklist for target visa route", "no outstanding legal/administrative issue blocking departure"] },
  businessEnglish: { formula: "lookup", source: "Lookup (Q16, verified where tested)", levels: ["Native/C2 professional register", "fluent, comfortable professionally", "conversational, needs polish", "basic, would struggle professionally", "not functional"] },
  crossCultural: { formula: "indicators", indicators: ["Has worked with international/multicultural colleagues before", "adjusts style when coach role-plays a different cultural context", "avoids assuming shared context/idioms", "describes a cross-cultural misunderstanding navigated well"] },
  independence: { formula: "indicators", indicators: ["Describes a project completed with minimal supervision", "makes an in-session decision without seeking coach approval first", "has worked remotely/autonomously before", "doesn't default to \"what should I do\" on an open-ended prompt"] },
  ownershipMindset: { formula: "indicators", indicators: ["Uses \"I\" language for outcomes, not just \"we\"/\"the team\"", "proactively follows up without being chased", "acknowledges a personal mistake without deflecting", "acts on coaching feedback between sessions without reminders"] },
  businessAwareness: { formula: "indicators", indicators: ["Explains how their role connects to revenue/cost/customer outcomes", "aware of target industry's commercial pressures in Europe specifically", "frames own value in business-outcome terms, not task terms", "asks informed questions about a target employer's business model"] },
  collaborationStyle: { formula: "indicators", indicators: ["Comfortable working in flat/non-hierarchical structures", "comfortable giving feedback upward, not just receiving it", "describes adapting style to different personality types", "no conflict-avoidance/over-reliance-on-hierarchy red flags"] },
  salaryExpectations: { formula: "lookup", source: "Lookup (coach benchmark)", levels: ["Within realistic market range", "slightly off but flexible", "meaningfully misaligned but open", "meaningfully misaligned and inflexible", "no expectation stated/no market awareness"] },
  labourMarketKnowledge: { formula: "indicators", indicators: ["Names specific companies/sectors hiring in target field/country", "aware of typical hiring timelines/process in target country", "aware of \u22651 competitive disadvantage (visa, local-candidate preference) and how to address it", "follows industry/market news for target country"] },
  adaptability: { formula: "indicators", indicators: ["Describes a significant unplanned change handled well", "responds constructively (not defensively) to direct in-session feedback", "has adjusted target role/country/strategy based on new information before", "expresses openness to a Plan B"] },
  professionalConfidence: { formula: "indicators", indicators: ["Maintains composure under a challenging mock-interview question", "states achievements without excessive hedging", "recovers smoothly from a question they don't know", "advocates for themselves (next steps, timeline) without prompting"] },
};

/** The score a rating produces, by the framework's own formula. */
export function ecraScore(rule: EcraRule, value: number): number {
  return rule.formula === "indicators" ? 1 + value : 5 - value;
}
