import React, { useEffect, useState } from "react";
import {
  FaUsers, FaCheckCircle, FaInbox, FaBullhorn, FaArchive,
  FaTimesCircle, FaHourglassHalf, FaPenNib, FaUserTie,
  FaCalendarAlt, FaUndo, FaSignOutAlt, FaSync, FaExclamationTriangle,
  FaClock, FaArrowRight
} from "react-icons/fa";
import Link from "next/link";
import api from "@/lib/api";
import { getCurrentAssessmentPhase, formatTimelineDate } from "@/lib/skc/timeline";
import { SKC_2026_SCHEDULE } from "@/config/skcSchedule";
import { format } from "date-fns";

interface StatsData {
  invitationsIssued: number;
  awaitingSubmission: number;
  submitted: number;
  identityReview: number;
  editorialReview: number;
  contributorApproval: number;
  scheduled: number;
  published: number;
  revisionRequested: number;
  declined: number;
  withdrawn: number;
  archived: number;
  inReview: number;
  totalMessages: number;
  [key: string]: number;
}

const STATUS_COLORS: Record<string, string> = {
  PRE_LAUNCH: "bg-amber-50 text-amber-700 border-amber-200",
  CONSULTATION_OPEN: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CONSULTATION_CLOSED: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function OverviewTab({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);

  const phase = getCurrentAssessmentPhase();
  const isPreLaunch = phase === "PRE_LAUNCH";
  const isConsultationOpen = phase === "PUBLIC_PARTICIPATION_OPEN" || phase === "HEARINGS_IN_PROGRESS";
  
  const phaseLabel = isPreLaunch ? "Pre-Launch Phase" : isConsultationOpen ? "Consultation Open" : "Consultation Closed";

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, recentRes] = await Promise.all([
        api.get('/api/skc/admin/official-messages/stats'),
        api.get('/api/skc/admin/official-messages/messages?page=1&pageSize=5')
      ]);

      const raw = statsRes.data;
      const s = (raw?.success && raw?.data) ? raw.data : raw;
      setStats(s || {});

      const msgs = recentRes.data;
      const msgData = (msgs?.success && msgs?.data) ? msgs.data : (Array.isArray(msgs) ? msgs : []);
      setRecentMessages(Array.isArray(msgData) ? msgData.slice(0, 5) : []);
    } catch (err: any) {
      console.error("Failed to fetch OM stats", err);
      setError(err?.response?.data?.error || err.message || "Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { label: "Invitations Issued", value: stats?.invitationsIssued ?? 0, icon: FaUsers, tab: "Invitations", color: "bg-blue-50 text-blue-600" },
    { label: "Awaiting Submission", value: stats?.awaitingSubmission ?? 0, icon: FaHourglassHalf, tab: "Invitations", color: "bg-amber-50 text-amber-600" },
    { label: "Submitted", value: stats?.submitted ?? 0, icon: FaInbox, tab: "Submissions", color: "bg-indigo-50 text-indigo-600" },
    { label: "Identity Review", value: stats?.identityReview ?? 0, icon: FaUserTie, tab: "Review Queue", color: "bg-purple-50 text-purple-600" },
    { label: "Editorial Review", value: stats?.editorialReview ?? 0, icon: FaPenNib, tab: "Review Queue", color: "bg-pink-50 text-pink-600" },
    { label: "Contributor Approval", value: stats?.contributorApproval ?? 0, icon: FaCheckCircle, tab: "Review Queue", color: "bg-teal-50 text-teal-600" },
    { label: "Scheduled", value: stats?.scheduled ?? 0, icon: FaCalendarAlt, tab: "Scheduled", color: "bg-cyan-50 text-cyan-600" },
    { label: "Published", value: stats?.published ?? 0, icon: FaBullhorn, tab: "Published", color: "bg-emerald-50 text-emerald-600" },
    { label: "Revision Requested", value: stats?.revisionRequested ?? 0, icon: FaUndo, tab: "Review Queue", color: "bg-orange-50 text-orange-600" },
    { label: "Declined", value: stats?.declined ?? 0, icon: FaTimesCircle, tab: "Archived", color: "bg-red-50 text-red-600" },
    { label: "Withdrawn", value: stats?.withdrawn ?? 0, icon: FaSignOutAlt, tab: "Archived", color: "bg-rose-50 text-rose-600" },
    { label: "Archived", value: stats?.archived ?? 0, icon: FaArchive, tab: "Archived", color: "bg-gray-50 text-gray-600" },
  ];

  const WORKFLOW_STATUS_COLORS: Record<string, string> = {
    SUBMITTED: "bg-indigo-100 text-indigo-700",
    IDENTITY_REVIEW: "bg-purple-100 text-purple-700",
    AUTHORITY_VERIFICATION: "bg-violet-100 text-violet-700",
    EDITORIAL_REVIEW: "bg-pink-100 text-pink-700",
    REVISION_REQUESTED: "bg-orange-100 text-orange-700",
    AWAITING_CONTRIBUTOR_APPROVAL: "bg-teal-100 text-teal-700",
    APPROVED: "bg-green-100 text-green-700",
    SCHEDULED: "bg-cyan-100 text-cyan-700",
    PUBLISHED: "bg-emerald-100 text-emerald-700",
    WITHDRAWN: "bg-rose-100 text-rose-700",
    DECLINED: "bg-red-100 text-red-700",
    ARCHIVED: "bg-gray-100 text-gray-600",
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-400 font-bold animate-pulse space-y-4">
        <FaSync className="mx-auto text-3xl animate-spin" />
        <p>Loading overview statistics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
          <FaExclamationTriangle />
          <span className="text-sm font-medium">{error}</span>
          <button onClick={fetchAll} className="ml-auto text-xs font-bold underline hover:no-underline">Retry</button>
        </div>
      )}

      {/* Phase Banner */}
      <div className={`flex items-center justify-between p-4 rounded-xl border ${STATUS_COLORS[phase]}`}>
        <div className="flex items-center gap-3">
          <FaClock className="text-lg" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider opacity-70">Programme Phase</div>
            <div className="font-bold">{phaseLabel}</div>
          </div>
        </div>
        <div className="text-sm font-medium opacity-80">
          {isPreLaunch ? `Submission opens ${formatTimelineDate(SKC_2026_SCHEDULE.publicParticipation.plannedStart)}` : isConsultationOpen ? `Closes ${formatTimelineDate(SKC_2026_SCHEDULE.publicParticipation.plannedEnd)}` : "Review in progress"}
        </div>
        <button onClick={fetchAll} title="Refresh statistics" className="p-2 rounded-lg hover:bg-black/5 transition-colors">
          <FaSync className="text-sm" />
        </button>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(card.tab)}
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md hover:border-brand-primary/30 transition-all text-left group"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color} group-hover:scale-110 transition-transform`}>
              <card.icon className="text-base" />
            </div>
            <div className="text-3xl font-black text-gray-900 mb-1">{card.value}</div>
            <div className="text-xs font-bold text-gray-500 leading-tight">{card.label}</div>
            <div data-ui-icon className="mt-2 flex items-center gap-1 text-xs  font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              View {card.tab} <FaArrowRight className="text-[10px]" />
            </div>
          </button>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Recent Activity</h3>
          <button onClick={() => setActiveTab("Submissions")} className="text-xs text-icon-on-light font-bold hover:underline flex items-center gap-1">
            View all <FaArrowRight />
          </button>
        </div>
        {recentMessages.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm font-medium">
            No messages yet. <button onClick={() => setActiveTab("Invitations")} className="text-brand-primary font-bold hover:underline">Create an invitation</button> to get started.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentMessages.map((msg: any) => (
              <div key={msg.id} className="px-5 py-3 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                <div data-ui-icon className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center  text-xs font-black shrink-0">
                  {(msg.fullName || msg.contributorName || "?").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-gray-900 truncate">{msg.fullName || msg.contributorName}</div>
                  <div className="text-xs text-gray-500 truncate">{msg.institution} · {msg.contributorCategory}</div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold shrink-0 ${WORKFLOW_STATUS_COLORS[msg.workflowStatus] || "bg-gray-100 text-gray-600"}`}>
                  {msg.workflowStatus?.replace(/_/g, " ")}
                </span>
                <div className="text-xs text-gray-400 shrink-0">
                  {msg.createdAt ? format(new Date(msg.createdAt), "MMM d") : "-"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link href="/dashboard/skc/official-messages/create-invitation" className="bg-white border border-gray-100 rounded-xl p-4 text-center text-sm font-bold text-brand-primary hover:bg-brand-primary hover:text-white hover:shadow-lg transition-all group">
          + Create Invitation
        </Link>
        <Link href="/dashboard/skc/official-messages/add-manual" className="bg-white border border-gray-100 rounded-xl p-4 text-center text-sm font-bold text-gray-700 hover:bg-gray-800 hover:text-white hover:shadow-lg transition-all">
          + Add Manual Record
        </Link>
        <Link href="/state-of-kashmir-crafts/official-messages" target="_blank" className="bg-white border border-gray-100 rounded-xl p-4 text-center text-sm font-bold text-gray-700 hover:bg-gray-800 hover:text-white hover:shadow-lg transition-all">
          View Public Page ↗
        </Link>
        <button onClick={() => setActiveTab("Settings")} className="bg-white border border-gray-100 rounded-xl p-4 text-center text-sm font-bold text-gray-700 hover:bg-gray-800 hover:text-white hover:shadow-lg transition-all">
          Module Settings
        </button>
      </div>
    </div>
  );
}
