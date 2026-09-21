import {
  AssessmentCycle2026,
  type AssessmentStage,
  type AssessmentStageStatus,
  getAssessmentStagesSorted,
} from '@/config/assessmentCycle';

export interface AssessmentRoadmapSummary {
  cycleYear: string;
  totalStages: number;
  completedStages: number;
  inProgressStages: number;
  progressPercent: number;
  overallStatus: AssessmentStageStatus;
  activeStages: AssessmentStage[];
  currentPhaseLabel: string;
  consultationStart: string | null;
  consultationEnd: string | null;
  finalReportDate: string | null;
}

function resolveOverallStatus(stages: AssessmentStage[]): AssessmentStageStatus {
  if (stages.length > 0 && stages.every((stage) => stage.status === 'Completed')) {
    return 'Completed';
  }
  if (stages.some((stage) => stage.status === 'Open / In Progress')) {
    return 'Open / In Progress';
  }
  if (stages.some((stage) => stage.status === 'Closed')) {
    return 'Closed';
  }
  return 'Scheduled';
}

function resolveCurrentPhaseLabel(stages: AssessmentStage[]): string {
  const active = stages.filter((stage) => stage.status === 'Open / In Progress');
  if (active.length > 0) {
    return active.map((stage) => stage.publicLabel).join(' & ');
  }

  const firstUpcoming = stages.find((stage) => stage.status === 'Scheduled');
  if (firstUpcoming) return firstUpcoming.publicLabel;

  const lastCompleted = [...stages].reverse().find((stage) => stage.status === 'Completed');
  if (lastCompleted) return lastCompleted.publicLabel;

  return 'Assessment Cycle';
}

export function getAssessmentRoadmapSummary(): AssessmentRoadmapSummary {
  const stages = getAssessmentStagesSorted();
  const completedStages = stages.filter((stage) => stage.status === 'Completed').length;
  const inProgressStages = stages.filter((stage) => stage.status === 'Open / In Progress').length;
  const weightedActiveStages = completedStages + (inProgressStages * 0.5);
  const progressPercent = stages.length > 0
    ? Math.round((weightedActiveStages / stages.length) * 100)
    : 0;

  return {
    cycleYear: '2026',
    totalStages: stages.length,
    completedStages,
    inProgressStages,
    progressPercent,
    overallStatus: resolveOverallStatus(stages),
    activeStages: stages.filter((stage) => stage.status === 'Open / In Progress'),
    currentPhaseLabel: resolveCurrentPhaseLabel(stages),
    consultationStart:
      AssessmentCycle2026.publicParticipation.actualStart ||
      AssessmentCycle2026.publicParticipation.plannedStart ||
      null,
    consultationEnd:
      AssessmentCycle2026.publicParticipation.actualEnd ||
      AssessmentCycle2026.publicParticipation.plannedEnd ||
      null,
    finalReportDate:
      AssessmentCycle2026.finalReport.actualEnd ||
      AssessmentCycle2026.finalReport.actualStart ||
      AssessmentCycle2026.finalReport.plannedEnd ||
      AssessmentCycle2026.finalReport.plannedStart ||
      null,
  };
}
