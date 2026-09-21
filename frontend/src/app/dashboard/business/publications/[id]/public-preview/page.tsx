"use client";

/**
 * Dashboard Public Page Preview
 * Route: /dashboard/business/publications/[id]/public-preview
 *
 * Renders the exact same layout as the public /publications/[slug] page,
 * but fetches by ID (not slug) and works for any publishedStatus.
 * Shown as an in-dashboard iframe-like preview with a warning banner.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";
import {
  FaEdit, FaBookOpen, FaRocket, FaSpinner, FaTimesCircle, FaEye, FaClock, FaExclamationTriangle
} from "react-icons/fa";
import PublicationPublicView from "@/components/publications/PublicationPublicView";
import { toCanonicalPublicationPresentation } from "@/types/CanonicalPublicationPresentation";

// ─── Status Banner ─────────────────────────────────────────────────────────────

function StatusBanner({ status, id }: { status: string; id: string }) {
  const configs = {
    DRAFT: { bg: "bg-stone-900", border: "border-stone-700", text: "text-stone-200", icon: <FaEdit size={10} />, label: "DRAFT — Not published yet. This is how the public page will look when published." },
    UNDER_REVIEW: { bg: "bg-amber-900/90", border: "border-amber-600", text: "text-amber-100", icon: <FaClock size={10} />, label: "UNDER REVIEW — This publication is awaiting editorial approval before going live." },
    SCHEDULED: { bg: "bg-purple-900/90", border: "border-purple-600", text: "text-purple-100", icon: <FaClock size={10} />, label: "SCHEDULED — This publication will go live at the scheduled date and time." },
    PUBLISHED: { bg: "bg-emerald-900/90", border: "border-emerald-600", text: "text-emerald-100", icon: <FaRocket size={10} />, label: "PUBLISHED — This publication is live. This is the exact public page." },
  };
  const cfg = configs[status as keyof typeof configs] ?? configs.DRAFT;

  return (
    <div className={`sticky top-0 z-50 ${cfg.bg} border-b ${cfg.border} px-6 py-3 flex items-center justify-between`}>
      <div className={`flex items-center gap-3 ${cfg.text}`}>
        <FaEye size={12} className="shrink-0" />
        <span className="text-[10px] font-black uppercase tracking-widest mr-2 flex items-center gap-1">
          {cfg.icon} {status.replace("_", " ")}
        </span>
        <span className="text-[10px] opacity-70">{cfg.label}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link href={`/dashboard/business/publications/add?edit=${id}`}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/20 text-white text-[10px] font-black rounded-xl hover:bg-white/20 transition-all">
          <FaEdit size={9} /> Back to Editor
        </Link>
        <Link href={`/dashboard/business/publications/${id}/preview`}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/20 text-white text-[10px] font-black rounded-xl hover:bg-white/20 transition-all">
          <FaBookOpen size={9} /> Full Book Preview
        </Link>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function PublicPagePreview({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [pub, setPub] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ id: resolvedId }) => {
      setId(resolvedId);
      api.get(`/publications/${resolvedId}`)
        .then(res => setPub(res.data))
        .catch(() => setPub(null))
        .finally(() => setLoading(false));
    });
  }, [params]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-stone-50">
      <FaSpinner className="animate-spin text-teal-500 text-3xl" />
    </div>
  );

  if (!pub) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50">
      <FaTimesCircle className="text-red-400 text-4xl mb-4" />
      <p className="text-lg font-bold text-gray-700">Publication not found</p>
      <button onClick={() => router.back()} className="mt-4 text-sm text-teal-600 font-bold hover:underline">← Go Back</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50/30 flex flex-col">
      <StatusBanner status={pub.publishedStatus} id={id} />
      
      {/* Informative preview warning panel */}
      <div className="max-w-7xl mx-auto px-6 mt-4 w-full">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <FaExclamationTriangle className="text-amber-500 text-lg shrink-0" />
          <div>
            <p className="text-[10px] font-black text-amber-800 uppercase tracking-wider">Preview Mode Active</p>
            <p className="text-[9px] text-amber-600">
              Interactive reading and pricing CTAs are disabled/simulated. This template faithfully renders the exact structure and layout of the live public detail route.
            </p>
          </div>
        </div>
      </div>

      <PublicationPublicView
        canonical={toCanonicalPublicationPresentation(pub)}
        isPreviewMode={true}
      />
    </div>
  );
}
