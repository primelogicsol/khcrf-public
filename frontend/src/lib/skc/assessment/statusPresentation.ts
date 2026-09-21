import type { AssessmentStageStatus } from '@/config/assessmentCycle';

export interface AssessmentStatusPresentation {
  label: string;
  roadmapBadgeClass: string;
  roadmapIcon: string;
  heroPanelClass: string;
  heroLabelClass: string;
  heroDotClass: string;
  progressBarClass: string;
  summaryTextClass: string;
  summaryBadgeClass: string;
  summaryDotClass: string;
}

export function getAssessmentStatusPresentation(
  status: string,
): AssessmentStatusPresentation {
  const normalizedStatus = status ? status.toLowerCase() : 'scheduled';
  
  if (normalizedStatus.includes('completed')) {
    return {
      label: 'Completed',
      roadmapBadgeClass: 'text-green-700 bg-green-50',
      roadmapIcon: '✔️',
      heroPanelClass: 'bg-emerald-500/15 border-emerald-400/40 shadow-[0_10px_30px_rgba(16,185,129,0.10)]',
      heroLabelClass: 'text-emerald-100',
      heroDotClass: 'bg-emerald-400',
      progressBarClass: 'bg-emerald-500',
      summaryTextClass: 'text-emerald-700',
      summaryBadgeClass: 'text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200',
      summaryDotClass: 'bg-emerald-500',
    };
  }

  if (normalizedStatus.includes('published')) {
    return {
      label: 'Published',
      roadmapBadgeClass: 'text-green-700 bg-green-50',
      roadmapIcon: '✔️',
      heroPanelClass: 'bg-emerald-500/15 border-emerald-400/40 shadow-[0_10px_30px_rgba(16,185,129,0.10)]',
      heroLabelClass: 'text-emerald-100',
      heroDotClass: 'bg-emerald-400',
      progressBarClass: 'bg-emerald-500',
      summaryTextClass: 'text-emerald-700',
      summaryBadgeClass: 'text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200',
      summaryDotClass: 'bg-emerald-500',
    };
  }
  
  if (normalizedStatus.includes('active') || normalizedStatus.includes('open') || normalizedStatus.includes('progress')) {
    const isReg = normalizedStatus.includes('registration');
    return {
      label: isReg ? 'Registration Open' : 'Active',
      roadmapBadgeClass: 'text-blue-700 bg-blue-50 font-bold ring-1 ring-blue-200',
      roadmapIcon: '🔄',
      heroPanelClass: 'bg-blue-500/15 border-blue-400/45 shadow-[0_10px_30px_rgba(59,130,246,0.12)]',
      heroLabelClass: 'text-blue-100',
      heroDotClass: 'bg-blue-400 animate-pulse',
      progressBarClass: 'bg-blue-600',
      summaryTextClass: 'text-blue-700',
      summaryBadgeClass: 'text-blue-700 bg-blue-50 ring-1 ring-blue-200',
      summaryDotClass: 'bg-blue-500 animate-pulse',
    };
  }

  if (normalizedStatus.includes('under review')) {
    return {
      label: 'Under Review',
      roadmapBadgeClass: 'text-purple-700 bg-purple-50 font-bold ring-1 ring-purple-200',
      roadmapIcon: '🔍',
      heroPanelClass: 'bg-purple-500/15 border-purple-400/45 shadow-[0_10px_30px_rgba(168,85,247,0.12)]',
      heroLabelClass: 'text-purple-100',
      heroDotClass: 'bg-purple-400 animate-pulse',
      progressBarClass: 'bg-purple-600',
      summaryTextClass: 'text-purple-700',
      summaryBadgeClass: 'text-purple-700 bg-purple-50 ring-1 ring-purple-200',
      summaryDotClass: 'bg-purple-500',
    };
  }

  if (normalizedStatus.includes('upcoming')) {
    return {
      label: 'Upcoming',
      roadmapBadgeClass: 'text-amber-700 bg-amber-50',
      roadmapIcon: '⏳',
      heroPanelClass: 'bg-amber-400/10 border-amber-300/30 shadow-[0_10px_30px_rgba(251,191,36,0.06)]',
      heroLabelClass: 'text-amber-100',
      heroDotClass: 'bg-amber-300',
      progressBarClass: 'bg-amber-500',
      summaryTextClass: 'text-amber-700',
      summaryBadgeClass: 'text-amber-700 bg-amber-50 ring-1 ring-amber-200',
      summaryDotClass: 'bg-amber-500',
    };
  }

  if (normalizedStatus.includes('closed') || normalizedStatus.includes('cancelled')) {
    return {
      label: normalizedStatus.includes('cancelled') ? 'Cancelled' : 'Closed',
      roadmapBadgeClass: 'text-gray-700 bg-gray-100',
      roadmapIcon: '🔒',
      heroPanelClass: 'bg-red-500/10 border-red-400/35 shadow-[0_10px_30px_rgba(239,68,68,0.08)]',
      heroLabelClass: 'text-red-100',
      heroDotClass: 'bg-red-400',
      progressBarClass: 'bg-red-500',
      summaryTextClass: 'text-red-700',
      summaryBadgeClass: 'text-red-700 bg-red-50 ring-1 ring-red-200',
      summaryDotClass: 'bg-red-500',
    };
  }

  // Default Scheduled/Postponed
  return {
    label: normalizedStatus.includes('postponed') ? 'Postponed' : 'Scheduled',
    roadmapBadgeClass: 'text-gray-600 bg-gray-50',
    roadmapIcon: '⚪',
    heroPanelClass: 'bg-violet-400/10 border-violet-300/30 shadow-[0_10px_30px_rgba(167,139,250,0.06)]',
    heroLabelClass: 'text-violet-100',
    heroDotClass: 'bg-violet-300',
    progressBarClass: 'bg-violet-500',
    summaryTextClass: 'text-violet-700',
    summaryBadgeClass: 'text-violet-700 bg-violet-50 ring-1 ring-violet-200',
    summaryDotClass: 'bg-violet-500',
  };
}

export function getEnrollmentStatusLabel(status: AssessmentStageStatus): string {
  switch (status) {
    case 'Open / In Progress':
      return 'Enrollment Open / In Progress';
    case 'Completed':
      return 'Enrollment Completed';
    case 'Closed':
      return 'Enrollment Closed';
    case 'Scheduled':
    default:
      return 'Enrollment Scheduled';
  }
}
