"use client";

import { getAssessmentStagesSorted } from "@/config/assessmentCycle";
import { getAssessmentStatusPresentation } from "@/lib/skc/assessment/statusPresentation";
import Link from "next/link";
import { format } from "date-fns";

const CANONICAL_STAGES = getAssessmentStagesSorted().map(stage => {
  const getLocalDate = (dateStr?: string) => dateStr ? new Date(dateStr + "T00:00:00") : null;
  const pStart = getLocalDate(stage.plannedStart);
  const pEnd = getLocalDate(stage.plannedEnd);

  let scheduleText = pStart ? format(pStart, "d MMM yyyy") : "";
  if (pStart && pEnd && pStart.getTime() !== pEnd.getTime()) {
    if (pStart.getFullYear() === pEnd.getFullYear()) {
      scheduleText = `${format(pStart, "d MMM")} to ${format(pEnd, "d MMM yyyy")}`;
    } else {
      scheduleText = `${format(pStart, "d MMM yyyy")} to ${format(pEnd, "d MMM yyyy")}`;
    }
  } else if (!pStart) {
    scheduleText = "Completed";
  }

  if (stage.status === "Completed") scheduleText = "Completed";

  return {
    id: stage.id,
    title: stage.publicLabel,
    status: stage.status,
    description: null,
    targetEndDate: stage.plannedEnd,
    completedDate: stage.actualEnd || null,
    linkedRoute: stage.path || null,
    order: stage.sequence,
    plannedSchedule: scheduleText,
    startDate: stage.plannedStart || null
  };
});

export default function AssessmentLifecycleTracker({ overrideProgress, liveStages }: { overrideProgress?: number, liveStages?: any[] }) {
  // Always use the canonical 12-stage structure, ignoring API overrides to ensure uniformity
  const displayStages = CANONICAL_STAGES;

  const totalStages = displayStages.length;
  const completedStages = displayStages.filter((s) => s.status.toLowerCase().includes('completed') || s.status.toLowerCase().includes('published')).length;
  const inProgressStages = displayStages.filter((s) => s.status.toLowerCase().includes('progress') || s.status.toLowerCase().includes('active') || s.status.toLowerCase().includes('review') || s.status.toLowerCase().includes('open')).length;
  
  // Calculate strict completion directly from canonical stages
  const progressPercent = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

  const formatDateString = (stage: any) => {
    return stage.plannedSchedule || "Not scheduled yet";
  };

  const formatPlannedSchedule = (text: string) => {
    if (text.startsWith("Opens ")) {
      return (
        <span>
          Opens <span className="font-bold">{text.replace("Opens ", "")}</span>
        </span>
      );
    }
    if (text !== "Completed" && text !== "Not scheduled yet") {
      return <span className="font-bold">{text}</span>;
    }
    return text;
  };

  return (
    <div
      className="w-full max-w-5xl mx-auto px-4 md:px-8 py-10 bg-white rounded-2xl shadow-sm border border-gray-100 relative"
      data-ui-version="assessment-lifecycle-v2"
    >
      <div className="mb-10 text-center">
        <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-2">
          Official Assessment Roadmap 2026-2027
        </h2>
        <p className="text-gray-500 italic mb-6">
          The official lifecycle governing the 2026 State of Kashmir Crafts Assessment
        </p>

        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-between text-sm font-bold text-gray-600 mb-2 px-1">
            <span>{completedStages} of {totalStages} stages completed • {inProgressStages} currently active</span>
            <span className="text-brand-primary">{progressPercent}% lifecycle completion</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-brand-primary h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      </div>

      <div className="mb-8" />

      <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm mb-6">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-700">
              <th className="py-4 px-6 text-sm font-bold uppercase tracking-wider text-right w-20">Stage</th>
              <th className="py-4 px-6 text-sm font-bold uppercase tracking-wider">Assessment Phase</th>
              <th className="py-4 px-6 text-sm font-bold uppercase tracking-wider">Planned Schedule</th>
              <th className="py-4 px-6 text-sm font-bold uppercase tracking-wider w-40">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {displayStages.map((stage) => {
              const displayInfo = getAssessmentStatusPresentation(stage.status);
              const scheduleText = formatDateString(stage);

              return (
                <tr key={stage.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="py-4 px-6 text-right font-black text-gray-900">
                    {stage.order.toString().padStart(2, "0")}
                  </td>
                  <td className="py-4 px-6">
                    {stage.linkedRoute ? (
                      <Link href={stage.linkedRoute} className="font-semibold text-gray-900 hover:text-brand-primary hover:underline">
                        {stage.title}
                      </Link>
                    ) : (
                      <span className="font-semibold text-gray-900">{stage.title}</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-gray-700 text-sm">
                    {formatPlannedSchedule(scheduleText)}
                  </td>
                  <td className="py-4 px-6">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${displayInfo.roadmapBadgeClass}`}>
                      <span>{displayInfo.roadmapIcon}</span>
                      <span>{displayInfo.label}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-gray-700 font-medium px-2">
        <span className="font-bold">2026 Hearing Mode:</span> Online <br />
        <span className="text-sm text-gray-500">Hearings conducted through the SKC Online Secretariat.</span>
      </div>
    </div>
  );
}
