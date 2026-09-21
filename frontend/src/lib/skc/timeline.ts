import { AssessmentCycle2026 } from "../../config/assessmentCycle";

export type ProgrammePhase =
  | "PRE_LAUNCH"
  | "REGISTRATION_OPEN"
  | "PUBLIC_PARTICIPATION_OPEN"
  | "HEARINGS_IN_PROGRESS"
  | "EVIDENCE_REVIEW"
  | "DRAFT_REVIEW"
  | "VALIDATION"
  | "EXPERT_REVIEW"
  | "FINAL_PUBLICATION";

export function getProgrammeBoundary(dateStr: string | undefined, isEndOfDay = false): Date {
  if (!dateStr) return new Date("2099-12-31T00:00:00+05:30"); // Fallback for undefined
  const time = isEndOfDay ? "T23:59:59" : "T00:00:00";
  return new Date(`${dateStr}${time}+05:30`); // Using +05:30 for Asia/Kolkata
}

export function getCurrentAssessmentPhase(): ProgrammePhase {
  const now = new Date();
  if (now >= getProgrammeBoundary(AssessmentCycle2026.finalReport.plannedStart)) return "FINAL_PUBLICATION";
  if (now >= getProgrammeBoundary(AssessmentCycle2026.expertReview.plannedStart)) return "EXPERT_REVIEW";
  if (now >= getProgrammeBoundary(AssessmentCycle2026.validation.plannedStart)) return "VALIDATION";
  if (now >= getProgrammeBoundary(AssessmentCycle2026.draftFindings.plannedStart)) return "DRAFT_REVIEW";
  // The original timeline had an explicit evidenceReview, which mapped roughly to draftFindings / review
  if (now >= getProgrammeBoundary(AssessmentCycle2026.review.plannedStart)) return "EVIDENCE_REVIEW";
  if (now >= getProgrammeBoundary(AssessmentCycle2026.hearings.plannedStart)) return "HEARINGS_IN_PROGRESS";
  if (now >= getProgrammeBoundary(AssessmentCycle2026.publicParticipation.plannedStart)) return "PUBLIC_PARTICIPATION_OPEN";
  return "PRE_LAUNCH";
}

export function getRegistrationStatus() {
  const now = new Date();
  const start = getProgrammeBoundary(AssessmentCycle2026.registration.plannedStart);
  const end = getProgrammeBoundary(AssessmentCycle2026.registration.plannedEnd, true);
  return now >= start && now <= end;
}

export function getPublicParticipationStatus() {
  const now = new Date();
  const start = getProgrammeBoundary(AssessmentCycle2026.publicParticipation.plannedStart);
  const end = getProgrammeBoundary(AssessmentCycle2026.publicParticipation.plannedEnd, true);
  return now >= start && now <= end;
}

export function getEvidenceSubmissionStatus() {
  const now = new Date();
  // We align evidence submission with public participation in the new model or hearings
  const start = getProgrammeBoundary(AssessmentCycle2026.publicParticipation.plannedStart);
  const end = getProgrammeBoundary(AssessmentCycle2026.publicParticipation.plannedEnd, true);
  return now >= start && now <= end;
}

export function getPublicHearingStatus() {
  const now = new Date();
  const start = getProgrammeBoundary(AssessmentCycle2026.hearings.plannedStart);
  const end = getProgrammeBoundary(AssessmentCycle2026.hearings.plannedEnd, true);
  return now >= start && now <= end;
}

export function getEvidenceReviewStatus() {
  const now = new Date();
  const start = getProgrammeBoundary(AssessmentCycle2026.review.plannedStart);
  const end = getProgrammeBoundary(AssessmentCycle2026.review.plannedEnd, true);
  return now >= start && now <= end;
}

export function getDraftReviewStatus() {
  const now = new Date();
  const start = getProgrammeBoundary(AssessmentCycle2026.draftFindings.plannedStart);
  const end = getProgrammeBoundary(AssessmentCycle2026.draftFindings.plannedEnd, true);
  return now >= start && now <= end;
}

export function getValidationStatus() {
  const now = new Date();
  const date = getProgrammeBoundary(AssessmentCycle2026.validation.plannedStart);
  return now >= date;
}

export function getExpertReviewStatus() {
  const now = new Date();
  const date = getProgrammeBoundary(AssessmentCycle2026.expertReview.plannedStart);
  return now >= date;
}

export function getFinalPublicationStatus() {
  const now = new Date();
  const date = getProgrammeBoundary(AssessmentCycle2026.finalReport.plannedStart);
  return now >= date;
}

export function formatTimelineDate(dateStr: string): string {
  const dt = new Date(dateStr);
  return dt.toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC"
  });
}
