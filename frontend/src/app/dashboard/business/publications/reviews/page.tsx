"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  FaArrowLeft, 
  FaCheck, 
  FaTimes, 
  FaFlag, 
  FaExclamationTriangle, 
  FaHourglassHalf, 
  FaSearch, 
  FaCheckCircle, 
  FaLock, 
  FaBuilding, 
  FaBookOpen,
  FaSpinner,
  FaEye,
  FaSync,
  FaExclamationCircle,
  FaStar
} from "react-icons/fa";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { normalizeArray } from "@/lib/normalize";

interface Review {
  id: string;
  publicationId: string;
  userId: string | null;
  reviewType: string;
  rating: number;
  title: string | null;
  review: string;
  verifiedReader: boolean;
  helpfulCount: number;
  recommendCount?: number;
  reportedCount?: number;
  status: string; // Submitted, Under Review, Approved, Needs Revision, Rejected, Flagged, Hidden
  reviewerName?: string | null;
  institution?: string | null;
  country?: string | null;
  disclosure?: string | null;
  permissionToDisplayName?: boolean;
  createdAt: string;
  publication?: {
    title: string;
    slug: string;
  };
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const url = selectedStatus === "All" 
        ? "/publications/reviews/admin/queue" 
        : `/publications/reviews/admin/queue?status=${selectedStatus}`;
      const { data } = await api.get(url);
      setReviews(normalizeArray(data, ["reviews", "items", "results", "data"]));
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load reviews queue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [selectedStatus]);

  const handleStatusUpdate = async (reviewId: string, newStatus: string) => {
    try {
      await api.put(`/publications/reviews/admin/${reviewId}/status`, { status: newStatus });
      toast.success(`Review status updated to ${newStatus}`);
      fetchReviews();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to update review status.");
    }
  };

  const STATUS_FILTERS = [
    "All",
    "Submitted",
    "Under Review",
    "Approved",
    "Needs Revision",
    "Rejected",
    "Flagged",
    "Hidden"
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Submitted":
        return <span className="bg-amber-50 text-amber-700 border border-amber-200/50 text-[10px] font-black uppercase px-2 py-0.5 rounded">Submitted</span>;
      case "Under Review":
        return <span className="bg-blue-50 text-blue-700 border border-blue-200/50 text-[10px] font-black uppercase px-2 py-0.5 rounded">Under Review</span>;
      case "Approved":
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-250/30 text-[10px] font-black uppercase px-2 py-0.5 rounded">Approved</span>;
      case "Needs Revision":
        return <span className="bg-orange-50 text-orange-700 border border-orange-200/50 text-[10px] font-black uppercase px-2 py-0.5 rounded">Needs Revision</span>;
      case "Rejected":
        return <span className="bg-rose-50 text-rose-700 border border-rose-250/20 text-[10px] font-black uppercase px-2 py-0.5 rounded">Rejected</span>;
      case "Flagged":
        return <span className="bg-purple-50 text-purple-700 border border-purple-200/50 text-[10px] font-black uppercase px-2 py-0.5 rounded">Flagged</span>;
      case "Hidden":
        return <span className="bg-stone-100 text-stone-600 border border-stone-200/50 text-[10px] font-black uppercase px-2 py-0.5 rounded">Hidden</span>;
      default:
        return <span className="bg-stone-50 text-stone-500 text-[10px] font-black uppercase px-2 py-0.5 rounded">{status}</span>;
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/business/publications"
            className="p-2 text-stone-500 hover:bg-stone-50 rounded-xl transition-all border border-stone-200"
          >
            <FaArrowLeft />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-serif">Reviews & Publishing Control Room</h1>
            <p className="text-stone-500 text-sm">Moderate contributor peer reviews, assess engagement data, and maintain scholarly integrity.</p>
          </div>
        </div>

        <button 
          onClick={fetchReviews}
          className="p-2 text-stone-600 border border-stone-200 rounded-xl hover:bg-stone-50 transition-all self-start md:self-auto flex items-center gap-2 text-xs font-bold"
        >
          <FaSync className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-stone-200 pb-4">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${
              selectedStatus === status
                ? "bg-brand-primary text-white shadow-sm"
                : "text-stone-600 hover:text-brand-primary hover:bg-stone-50 border border-transparent"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Reviews Queue list */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <FaSpinner data-ui-icon  className="animate-spin text-3xl " />
        </div>
      ) : reviews.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-stone-200 rounded-3xl bg-stone-50/20 space-y-4 max-w-lg mx-auto">
          <FaBookOpen className="text-stone-300 text-4xl mx-auto" />
          <h3 className="text-sm font-bold text-stone-700">Moderation Queue is Empty</h3>
          <p className="text-xs text-stone-500">No peer reviews are currently matching the status: <span className="font-bold text-brand-primary">{selectedStatus}</span>.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4 relative hover:border-stone-300 transition-colors">
              
              {/* Top Row: Info & Badges */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-50 pb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {getStatusBadge(rev.status)}
                    <span className="bg-brand-primary/5 text-brand-secondary px-2 py-0.5 rounded text-[10px] font-bold">
                      {rev.reviewType}
                    </span>
                    <span className="text-[10px] text-stone-400 font-semibold">
                      Submitted {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-stone-850 mt-2">
                    Review on: <span className="font-serif text-brand-primary italic">{rev.publication?.title || "Unknown Publication"}</span>
                  </h3>
                </div>

                {/* Rating Score */}
                <div className="flex items-center gap-1 bg-stone-50 border border-stone-100 rounded-lg px-2.5 py-1">
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar key={i} className={i < rev.rating ? "fill-current" : "text-stone-200"} size={10} />
                    ))}
                  </div>
                  <span className="text-[10px] font-black text-stone-700">{rev.rating}.0</span>
                </div>
              </div>

              {/* Review Content */}
              <div className="space-y-2">
                {rev.title && (
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wide">
                    &ldquo;{rev.title}&rdquo;
                  </h4>
                )}
                <p className="text-xs text-stone-650 leading-relaxed font-serif bg-stone-50/20 p-4 rounded-xl border border-stone-100 italic">
                  &ldquo;{rev.review}&rdquo;
                </p>
              </div>

              {/* Reviewer Details Card */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-stone-50/50 p-4 rounded-xl border border-stone-250/20 text-xs">
                <div>
                  <span className="text-[9px] text-stone-400 block font-bold uppercase tracking-wider">Reviewer Name</span>
                  <span className="font-bold text-stone-850">
                    {rev.permissionToDisplayName ? (rev.reviewerName || "Anonymous") : "Anonymous (Requested)"}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-stone-400 block font-bold uppercase tracking-wider">Institution / Org</span>
                  <span className="font-semibold text-stone-850">{rev.institution || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[9px] text-stone-400 block font-bold uppercase tracking-wider">Country Focus</span>
                  <span className="font-semibold text-stone-850">{rev.country || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[9px] text-stone-400 block font-bold uppercase tracking-wider">Conflict Disclosure</span>
                  <span className="font-medium text-stone-500 italic truncate block" title={rev.disclosure || ""}>
                    {rev.disclosure || "None Declared"}
                  </span>
                </div>
              </div>

              {/* Engagement Stats Band */}
              <div className="flex gap-4 text-[10px] text-stone-500 font-bold bg-stone-50/30 px-3 py-1.5 rounded-lg w-max border border-stone-100">
                <span>Helpful Votes: <strong className="text-stone-750 font-black">{rev.helpfulCount}</strong></span>
                <span>Recommendations: <strong className="text-stone-750 font-black">{rev.recommendCount || 0}</strong></span>
                <span className="flex items-center gap-1">
                  Reported Concern Flags: 
                  <strong className={`font-black ${(rev.reportedCount || 0) > 0 ? "text-red-650" : "text-stone-750"}`}>
                    {rev.reportedCount || 0}
                  </strong>
                  {(rev.reportedCount || 0) >= 3 && <FaExclamationCircle className="text-red-500 animate-pulse" size={10} />}
                </span>
              </div>

              {/* Moderation Actions Footer */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-50 justify-between items-center">
                {/* View publication details link */}
                {rev.publication?.slug && (
                  <Link 
                    href={`/publications/${rev.publication.slug}`}
                    target="_blank"
                    className="text-[10px] font-black text-icon-on-light hover:text-brand-dark uppercase tracking-wider flex items-center gap-1"
                  >
                    <FaEye size={10} /> View Detail Page
                  </Link>
                )}

                {/* Status action buttons */}
                <div className="flex flex-wrap gap-1.5">
                  {rev.status !== "Approved" && (
                    <button
                      onClick={() => handleStatusUpdate(rev.id, "Approved")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1"
                    >
                      <FaCheck size={9} /> Approve review
                    </button>
                  )}
                  {rev.status !== "Under Review" && (
                    <button
                      onClick={() => handleStatusUpdate(rev.id, "Under Review")}
                      className="border border-blue-200 text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
                    >
                      Under Review
                    </button>
                  )}
                  {rev.status !== "Needs Revision" && (
                    <button
                      onClick={() => handleStatusUpdate(rev.id, "Needs Revision")}
                      className="border border-orange-200 text-orange-700 hover:bg-orange-50 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
                    >
                      Needs Revision
                    </button>
                  )}
                  {rev.status !== "Rejected" && (
                    <button
                      onClick={() => handleStatusUpdate(rev.id, "Rejected")}
                      className="border border-red-200 text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
                    >
                      Reject
                    </button>
                  )}
                  {rev.status !== "Flagged" && (
                    <button
                      onClick={() => handleStatusUpdate(rev.id, "Flagged")}
                      className="border border-purple-200 text-purple-700 hover:bg-purple-50 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1"
                    >
                      <FaFlag size={8} /> Flag review
                    </button>
                  )}
                  {rev.status !== "Hidden" && (
                    <button
                      onClick={() => handleStatusUpdate(rev.id, "Hidden")}
                      className="border border-stone-300 text-stone-600 hover:bg-stone-50 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
                    >
                      Hide
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
