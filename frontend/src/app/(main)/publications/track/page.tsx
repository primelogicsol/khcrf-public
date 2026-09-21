"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaArrowLeft, FaSearch, FaSpinner, FaCheckCircle, FaTimesCircle, FaClock, FaEye } from "react-icons/fa";
import api from "@/lib/api";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  "Submitted": { label: "Submitted", color: "bg-blue-100 text-blue-800", icon: FaClock },
  "Under Review": { label: "Under Review", color: "bg-yellow-100 text-yellow-800", icon: FaEye },
  "Need More Information": { label: "Need More Information", color: "bg-orange-100 text-orange-800", icon: FaClock },
  "Approved": { label: "Approved", color: "bg-green-100 text-green-800", icon: FaCheckCircle },
  "Rejected": { label: "Rejected", color: "bg-red-100 text-red-800", icon: FaTimesCircle },
  "Invited to Dashboard": { label: "Invited to Dashboard", color: "bg-purple-100 text-purple-800", icon: FaCheckCircle },
  "Active Contributor": { label: "Active Contributor", color: "bg-emerald-100 text-emerald-800", icon: FaCheckCircle },
  "Suspended": { label: "Suspended", color: "bg-gray-100 text-gray-800", icon: FaTimesCircle },
};

function TrackContent() {
  const searchParams = useSearchParams();
  const initialTrackingId = searchParams.get("trackingId") || "";
  const [trackingId, setTrackingId] = useState(initialTrackingId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    if (!trackingId.trim()) {
      setError("Please enter a tracking ID.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await api.get(`/intake/track/${encodeURIComponent(trackingId.trim())}`);
      setResult(res.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("No submission found with this tracking ID.");
      } else {
        setError("Failed to track submission. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTrackingId) {
      handleTrack();
    }
  }, []);

  const StatusIcon = result ? statusConfig[result.status]?.icon || FaClock : FaClock;

  return (
    <div className="min-h-screen bg-stone-50/30 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        <Link href="/publications" className="group inline-flex items-center text-stone-400 hover:text-brand-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
          <FaArrowLeft className="mr-3 transition-transform group-hover:-translate-x-1" />
          Back to Library Hub
        </Link>

        <div className="bg-brand-dark rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <span className="bg-brand-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md">TRACKING</span>
          <h1 className="text-3xl font-bold font-serif mt-4 text-white leading-tight">Track Your Submission</h1>
          <p className="text-stone-300 text-xs mt-2 max-w-xl leading-relaxed">
            Enter the tracking ID you received after submitting your contributor application to check its status.
          </p>
        </div>

        <div className="bg-white border border-stone-200/65 rounded-3xl p-6 shadow-sm">
          <div className="flex gap-3">
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTrack()}
              placeholder="Enter your tracking ID (e.g. CTB-a3x9k2m7)"
              className="flex-1 bg-stone-50 border border-stone-200 rounded-xl p-3 outline-none focus:border-brand-primary font-medium text-sm"
            />
            <button
              onClick={handleTrack}
              disabled={loading}
              className="bg-brand-primary hover:bg-brand-dark text-white font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 text-xs"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
              Track
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-700">
              {error}
            </div>
          )}
        </div>

        {result && (
          <div className="bg-white border border-stone-200/65 rounded-3xl p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-brand-dark">Submission Details</h2>
                <p className="text-xs text-stone-400">Submitted on {new Date(result.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold ${statusConfig[result.status]?.color || "bg-stone-100 text-stone-700"}`}>
                <StatusIcon />
                {statusConfig[result.status]?.label || result.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-stone-400 block">Full Name</span>
                <span className="font-semibold text-brand-dark">{result.fullName}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Proposed Title</span>
                <span className="font-semibold text-brand-dark">{result.title}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Last Updated</span>
                <span className="font-semibold text-brand-dark">{new Date(result.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>

            {result.adminReview && (
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2">Admin Review</span>
                <p className="text-sm text-stone-700">{result.adminReview}</p>
              </div>
            )}

            {!result.adminReview && result.status === "Submitted" && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-700">
                Your submission is in the queue and awaiting review by our editorial team.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackSubmissionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-50/30 flex items-center justify-center">
        <FaSpinner data-ui-icon  className="animate-spin text-3xl " />
      </div>
    }>
      <TrackContent />
    </Suspense>
  );
}
