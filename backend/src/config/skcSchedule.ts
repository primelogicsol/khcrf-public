export type SkcEventType =
  | "GOVERNANCE_MILESTONE"
  | "REGISTRY_MILESTONE"
  | "REGISTRATION"
  | "PUBLIC_PARTICIPATION"
  | "EVIDENCE_SUBMISSION"
  | "ORIENTATION"
  | "PUBLIC_HEARING"
  | "THEMATIC_CONSULTATION"
  | "SUBMISSION_DEADLINE"
  | "EVIDENCE_REVIEW"
  | "DRAFT_REVIEW"
  | "VALIDATION"
  | "EXPERT_REVIEW"
  | "FINAL_PUBLICATION";

export const SKC_2026_SCHEDULE = {
  governanceFramework: {
    completedBefore: "2026-07-31",
  },
  stakeholderRegistrySystem: {
    completedBefore: "2026-07-31",
  },
  stakeholderRegistration: {
    start: "2026-08-17",
    end: "2026-11-28",
  },
  publicParticipation: {
    start: "2026-08-17",
    end: "2026-11-28",
  },
  evidenceSubmission: {
    start: "2026-08-17",
    end: "2026-11-28",
  },
  hearingOrientation: {
    date: "2026-08-25",
  },
  publicHearings: {
    start: "2026-09-05",
    end: "2026-11-21",
  },
  closingThematicConsultation: {
    date: "2026-11-28",
    type: "THEMATIC_CONSULTATION",
    isFormalHearing: false,
  },
  evidenceReview: {
    start: "2026-11-22",
    end: "2026-12-07",
  },
  draftFindingsReview: {
    start: "2026-12-08",
    end: "2026-12-17",
  },
  stakeholderValidation: {
    date: "2026-12-18",
  },
  expertReview: {
    date: "2026-12-16",
  },
  finalPublication: {
    date: "2026-12-29",
  },
  timezone: "Asia/Kolkata",
  timezoneOffset: "+05:30",
} as const;
