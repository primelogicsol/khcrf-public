export type AssessmentStageStatus = "Completed" | "Open / In Progress" | "Scheduled" | "Closed";

export interface AssessmentStage {
  id: string;
  sequence: number;
  publicLabel: string;
  plannedStart?: string;
  plannedEnd?: string;
  actualStart?: string;
  actualEnd?: string;
  status: AssessmentStageStatus;
  path?: string;
}

export const AssessmentCycle2026: Record<string, AssessmentStage> = {
  governanceFramework: {
    id: "governanceFramework",
    sequence: 1,
    publicLabel: "Governance Framework",
    status: "Completed",
  },
  stakeholderRegistrySystem: {
    id: "stakeholderRegistrySystem",
    sequence: 2,
    publicLabel: "Stakeholder Registry System",
    status: "Completed",
  },
  registration: {
    id: "registration",
    sequence: 3,
    publicLabel: "Stakeholder Registration",
    // Canonical: registration opens 17 August 2026
    plannedStart: "2026-08-17",
    plannedEnd: "2027-01-27",
    status: "Open / In Progress",
    path: "/state-of-kashmir-crafts/registration",
  },
  hearingRegistration: {
    id: "hearingRegistration",
    sequence: 4,
    publicLabel: "Public Hearing Registration",
    // Canonical: public hearing registration opens 17 August 2026
    plannedStart: "2026-08-17",
    plannedEnd: "2026-11-28", // hearing-specific: closes 24h before each hearing
    status: "Open / In Progress",
    path: "/state-of-kashmir-crafts/stakeholder-registry",
  },
  orientation: {
    id: "orientation",
    sequence: 5,
    publicLabel: "Public Hearing Orientation",
    // Canonical: orientation 25 August 2026
    plannedStart: "2026-08-25",
    plannedEnd: "2026-08-25",
    status: "Completed",
  },
  publicParticipation: {
    id: "publicParticipation",
    sequence: 6,
    publicLabel: "General Public Consultation",
    // Canonical: general consultation Sept 1 – Oct 31 2026
    // Hearing-specific evidence continues 72h after each hearing (can extend beyond Oct 31)
    plannedStart: "2026-08-17",
    plannedEnd: "2026-10-31",
    status: "Open / In Progress",
    path: "/state-of-kashmir-crafts/participate",
  },
  hearings: {
    id: "hearings",
    sequence: 7,
    publicLabel: "Public Hearings",
    // Canonical: formal hearings begin 5 September 2026, conclude 28 November 2026
    plannedStart: "2026-09-05",
    plannedEnd: "2026-11-28",
    status: "Open / In Progress",
    path: "/state-of-kashmir-crafts/public-hearings",
  },
  draftFindings: {
    id: "draftFindings",
    sequence: 8,
    publicLabel: "Draft Findings",
    plannedStart: "2027-03-18",
    plannedEnd: "2027-04-14",
    status: "Scheduled",
    path: "/state-of-kashmir-crafts/draft-findings",
  },
  review: {
    id: "review",
    sequence: 9,
    publicLabel: "Review",
    plannedStart: "2027-04-15",
    plannedEnd: "2027-05-05",
    status: "Scheduled",
  },
  validation: {
    id: "validation",
    sequence: 10,
    publicLabel: "Validation",
    plannedStart: "2027-05-08",
    plannedEnd: "2027-05-12",
    status: "Scheduled",
    path: "/state-of-kashmir-crafts/validation",
  },
  expertReview: {
    id: "expertReview",
    sequence: 11,
    publicLabel: "Expert Review",
    plannedStart: "2027-05-15",
    plannedEnd: "2027-05-24",
    status: "Scheduled",
    path: "/state-of-kashmir-crafts/expert-review",
  },
  finalReport: {
    id: "finalReport",
    sequence: 12,
    publicLabel: "Final Report Publication",
    plannedStart: "2027-05-31",
    plannedEnd: "2027-05-31",
    status: "Scheduled",
    path: "/state-of-kashmir-crafts/final-report",
  }
};


export const getAssessmentStagesSorted = () => {
  return Object.values(AssessmentCycle2026).sort((a, b) => a.sequence - b.sequence);
};
