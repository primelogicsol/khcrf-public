"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  FaSpinner, FaExclamationCircle, FaUsers, FaBookOpen, FaFeatherAlt,
  FaClipboardList, FaHandshake, FaChartBar, FaArrowRight, FaSearch,
  FaVideo, FaLayerGroup, FaBrain, FaImages, FaTasks, FaFolderOpen
} from "react-icons/fa";

const NAV_SECTIONS = [
  {
    title: "Artisan Nominations",
    description: "Review public nominations and supporting evidence.",
    icon: FaClipboardList,
    href: "/dashboard/master-artisans/nominations",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    title: "Artisan Registry",
    description: "Manage Master Artisans, Living Legends, women artisans, emerging artisans and apprentices.",
    icon: FaUsers,
    href: "/dashboard/master-artisans/registry",
    color: "bg-teal-50 text-teal-700 border-teal-200",
  },
  {
    title: "Stories & Editorial",
    description: "Manage submitted stories, editorial series and latest stories.",
    icon: FaFeatherAlt,
    href: "/dashboard/master-artisans/stories",
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    title: "Magazine Issues",
    description: "Create, schedule, publish and archive issues.",
    icon: FaBookOpen,
    href: "/dashboard/master-artisans/magazine-issues",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    title: "Studio",
    description: "Manage documentary films, oral histories, interviews, audio and demonstrations.",
    icon: FaVideo,
    href: "/dashboard/master-artisans/studio",
    color: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    title: "Collections",
    description: "Manage heritage collections, masterpieces, archive objects and essays.",
    icon: FaLayerGroup,
    href: "/dashboard/master-artisans/collections",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    title: "Knowledge",
    description: "Manage lineages, techniques, tools, materials, motifs, dyes and glossary terms.",
    icon: FaBrain,
    href: "/dashboard/master-artisans/knowledge",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    title: "Contributors",
    description: "Review contributor applications and assignments.",
    icon: FaHandshake,
    href: "/dashboard/master-artisans/contributors",
    color: "bg-orange-50 text-orange-700 border-orange-200",
  },
  {
    title: "Documentation Support",
    description: "Process public evidence and documentation submissions.",
    icon: FaFolderOpen,
    href: "/dashboard/master-artisans/documentation",
    color: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  {
    title: "Media Library",
    description: "Manage images, video, audio, documents and rights.",
    icon: FaImages,
    href: "/dashboard/master-artisans/media",
    color: "bg-pink-50 text-pink-700 border-pink-200",
  },
  {
    title: "Editorial Workflow",
    description: "Review all pending content across modules.",
    icon: FaTasks,
    href: "/dashboard/master-artisans/workflow",
    color: "bg-violet-50 text-violet-700 border-violet-200",
  },
  {
    title: "Analytics",
    description: "Monitor content performance and workflow health.",
    icon: FaChartBar,
    href: "/dashboard/master-artisans/analytics",
    color: "bg-slate-50 text-slate-700 border-slate-200",
  },
];

export default function MasterArtisansDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // In a real implementation, this would fetch from an aggregated overview endpoint
    api.get("/admin/master-artisans/overview-stats")
      .then((res) => {
        setStats(res.data?.data ?? res.data);
      })
      .catch((err: any) => {
        setError(err?.response?.data?.message || err.message || "Failed to load data.");
        setStats(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto pb-12 space-y-10">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Master Artisans</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage people, stories, collections, knowledge, media and participation.
          </p>
        </div>
      </div>

      {/* Operational Status (Overview) */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-wider">Operational Status</h2>
        
        {loading ? (
          <div className="flex items-center justify-center h-20">
            <FaSpinner data-ui-icon  className="animate-spin  text-xl" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <StatCard label="Pending Nominations" value={stats?.pendingNominations || 0} urgent={stats?.pendingNominations > 10} />
            <StatCard label="Stories Awaiting Review" value={stats?.storiesAwaitingReview || 0} urgent={stats?.storiesAwaitingReview > 5} />
            <StatCard label="Contributor Applications" value={stats?.contributorApplications || 0} />
            <StatCard label="Documentation Submissions" value={stats?.documentationSubmissions || 0} />
            <StatCard label="Draft Magazine Issues" value={stats?.draftMagazineIssues || 0} />
            <StatCard label="Scheduled Publications" value={stats?.scheduledPublications || 0} />
            <StatCard label="Unpublished Profiles" value={stats?.unpublishedProfiles || 0} />
            <StatCard label="Videos Processing" value={stats?.videosProcessing || 0} />
            <StatCard label="Audio Awaiting Review" value={stats?.audioAwaitingReview || 0} />
            <StatCard label="Missing Media/Metadata" value={stats?.missingMedia || 0} urgent={stats?.missingMedia > 0} />
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-stone-100">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Unified Workflow Pipeline</h3>
          <div className="flex items-center justify-between text-xs font-medium text-gray-600 bg-stone-50 p-4 rounded-xl border border-stone-100 overflow-x-auto">
            <span className="flex-shrink-0">Submitted</span>
            <FaArrowRight className="text-stone-300 mx-2 flex-shrink-0" />
            <span className="flex-shrink-0">Screening</span>
            <FaArrowRight className="text-stone-300 mx-2 flex-shrink-0" />
            <span className="flex-shrink-0 text-amber-600">Verification</span>
            <FaArrowRight className="text-stone-300 mx-2 flex-shrink-0" />
            <span className="flex-shrink-0 text-blue-600">Editorial Review</span>
            <FaArrowRight className="text-stone-300 mx-2 flex-shrink-0" />
            <span className="flex-shrink-0 text-emerald-600">Approved</span>
            <FaArrowRight className="text-stone-300 mx-2 flex-shrink-0" />
            <span className="flex-shrink-0 text-purple-600">Scheduled</span>
            <FaArrowRight className="text-stone-300 mx-2 flex-shrink-0" />
            <span className="flex-shrink-0 font-bold text-gray-900">Published</span>
            <FaArrowRight className="text-stone-300 mx-2 flex-shrink-0" />
            <span className="flex-shrink-0 text-stone-400">Archived</span>
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-2">Platform Modules</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-0">
        {NAV_SECTIONS.map((section) => (
          <Link
            key={section.title}
            href={section.href}
            className="group bg-white border border-stone-200 rounded-2xl p-5 hover:border-brand-primary/40 hover:shadow-md transition-all flex flex-col justify-between h-40"
          >
            <div>
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border mb-3 ${section.color}`}>
                <section.icon size={14} />
              </div>
              <h3 className="text-sm font-black text-gray-900 mb-1 leading-tight">{section.title}</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{section.description}</p>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}

function StatCard({ label, value, urgent = false }: { label: string, value: number, urgent?: boolean }) {
  return (
    <div className={`p-4 rounded-xl border ${urgent ? 'bg-red-50 border-red-100' : 'bg-white border-stone-100'}`}>
      <div className={`text-2xl font-black ${urgent ? 'text-red-600' : 'text-gray-900'}`}>{value}</div>
      <div className={`text-[10px] font-bold uppercase mt-1 leading-tight ${urgent ? 'text-red-500' : 'text-gray-400'}`}>{label}</div>
    </div>
  );
}
