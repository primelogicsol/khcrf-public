// Temporary controlled pre-launch state.
// Replace with the server-side lifecycle and canonical metrics service.

export const SKC_PUBLIC_STATE = {
  cycleYear: 2026,
  operatingState: "PRE_LAUNCH",
  currentPhase: "Design & Pre-Launch",
  activityPublished: false,
  stakeholderRegistrationOpen: false,
  hearingRegistrationOpen: false,
  validationOpen: false,
  findingsPublished: false,
} as const;
