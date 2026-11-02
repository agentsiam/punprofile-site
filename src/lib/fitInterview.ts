/**
 * The Fit Report interview as the coach runs it, 02/11/2026: which competency
 * each part of the call reaches, and the question that reaches it. The source
 * is `references/observation-set.md` in the coaching repo's fit-report-interview
 * skill; this is its order, for the screen.
 *
 * Everything the candidate's own answers and documents already decide is filled
 * before the call by the skill, as evidence. The coach sees only what is left.
 */
export interface InterviewItem {
  key: string;
  /** What to ask, or where in the call it is heard. */
  ask: string;
}
export interface InterviewPart {
  id: string;
  title: string;
  note?: string;
  items: InterviewItem[];
}

export const INTERVIEW_PARTS: InterviewPart[] = [
  {
    id: "work",
    title: "Their work",
    note: "In English: a European employer will interview them in English.",
    items: [
      { key: "technicalExpertise", ask: "What did you actually do there, day to day?" },
      { key: "problemSolving", ask: "Walk me through the hardest problem you had there." },
      { key: "learningAgility", ask: "What did you have to learn to do that?" },
      { key: "communication", ask: "Heard throughout: how the answers are built." },
      { key: "businessEnglish", ask: "Heard throughout: the level you hear, not the one they ticked." },
    ],
  },
  {
    id: "target",
    title: "Target and reality",
    items: [
      { key: "labourMarketKnowledge", ask: "Which companies hire for this in the target country, and how long does hiring take there?" },
      { key: "adaptability", ask: "Give the reality check straight, then watch how it is taken." },
      { key: "professionalConfidence", ask: "“Let me ask you the question a recruiter there will ask.”" },
    ],
  },
];

/** The competencies the 30-minute interview must settle before the report goes out. */
export const INTERVIEW_ITEMS: string[] = INTERVIEW_PARTS.flatMap((p) => p.items.map((i) => i.key));

/** Reached in the one-hour session, not the 30-minute call. */
export const LATER_ITEMS: string[] = [
  "leadershipOwnership",
  "strategicThinking",
  "execution",
  "collaboration",
  "ownershipMindset",
  "businessAwareness",
  "independence",
  "crossCultural",
  "collaborationStyle",
  "interviewSkills",
  "recruiterReadiness",
];
