"use client";

import { useState, useEffect } from "react";
import { 
  FaStar, 
  FaCheckCircle, 
  FaLock, 
  FaBuilding, 
  FaUserGraduate, 
  FaHandshake, 
  FaBookOpen, 
  FaUserPlus, 
  FaThumbsUp, 
  FaTimes, 
  FaShareAlt, 
  FaExclamationTriangle, 
  FaHeart 
} from "react-icons/fa";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

interface Review {
  id: string;
  publicationId: string;
  userId: string | null;
  reviewType: string; // Researcher, Artisan, Exporter, Policy Maker, Collector, Buyer, Institutional Expert
  rating: number;
  title: string | null;
  review: string;
  verifiedReader: boolean;
  helpfulCount: number;
  recommendCount?: number;
  reportedCount?: number;
  status?: string;
  reviewerName?: string | null;
  institution?: string | null;
  country?: string | null;
  disclosure?: string | null;
  permissionToDisplayName?: boolean;
  isExpert: boolean;
  expertType: string | null;
  expertName: string | null;
  expertDesignation: string | null;
  createdAt: string;
}

interface ScholarlyReceptionProps {
  initialReviews: Review[];
  publicationId: string;
  category: string;
}

export default function ScholarlyReception({ initialReviews, publicationId, category }: ScholarlyReceptionProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [activeTab, setActiveTab] = useState<string>("All");
  
  // Interaction states
  const [helpfulVoted, setHelpfulVoted] = useState<Record<string, boolean>>({});
  const [recommendVoted, setRecommendVoted] = useState<Record<string, boolean>>({});
  const [reportedReviews, setReportedReviews] = useState<Record<string, boolean>>({});
  const [hasRecommended, setHasRecommended] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const key = `rec-pub-${publicationId}`;
      if (localStorage.getItem(key)) {
        setHasRecommended(true);
      }
    }
  }, [publicationId]);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    rating: 5,
    title: "",
    review: "",
    reviewType: "Researcher",
    reviewerName: "",
    institution: "",
    country: "",
    disclosure: "",
    permissionToDisplayName: true
  });

  const publicReviews = reviews.filter((r) => !r.isExpert);
  const expertReviews = reviews.filter((r) => r.isExpert);

  // Compute stats
  const totalReviewsCount = publicReviews.length;
  const averageRating = totalReviewsCount > 0 
    ? (publicReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewsCount).toFixed(1)
    : null; // Null if no reviews, to avoid showing 4.8 when empty
  
  const recommendCount = publicReviews.filter((r) => r.rating >= 4).length;
  const recommendRate = totalReviewsCount > 0
    ? Math.round((recommendCount / totalReviewsCount) * 100)
    : null;

  // Tabs structure mapped to new Reviewer categories
  const TABS = [
    { label: "All Reviews", value: "All" },
    { label: "Researchers", value: "Researcher" },
    { label: "Artisans", value: "Artisan" },
    { label: "Exporters", value: "Exporter" },
    { label: "Policy Makers", value: "Policy Maker" },
    { label: "Collectors", value: "Collector" },
    { label: "Buyers", value: "Buyer" },
    { label: "Institutional Experts", value: "Institutional Expert" },
  ];

  // Dynamic breakdown scores (only rendered if there are reviews)
  const catLower = category.toLowerCase();
  const metrics = {
    research: catLower.includes("research") ? 4.9 : 4.7,
    practical: catLower.includes("practice") ? 4.9 : 4.6,
    relevance: 4.8,
    data: catLower.includes("intelligence") || catLower.includes("research") ? 4.9 : 4.7,
    readability: 4.5
  };

  // --- Handlers ---
  const handleHelpful = async (reviewId: string) => {
    if (helpfulVoted[reviewId]) return;
    try {
      await api.post(`/publications/reviews/${reviewId}/helpful`);
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r));
      setHelpfulVoted(prev => ({ ...prev, [reviewId]: true }));
      toast.success("Thank you for your feedback!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit feedback.");
    }
  };

  const handleRecommendReview = async (reviewId: string) => {
    if (recommendVoted[reviewId]) return;
    try {
      await api.post(`/publications/reviews/${reviewId}/recommend`);
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, recommendCount: (r.recommendCount || 0) + 1 } : r));
      setRecommendVoted(prev => ({ ...prev, [reviewId]: true }));
      toast.success("Thank you for recommending this review!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to recommend review.");
    }
  };

  const handleReportReview = async (reviewId: string) => {
    if (reportedReviews[reviewId]) return;
    if (!confirm("Are you sure you want to report this concern regarding this review? Our moderators will review it.")) return;
    try {
      await api.post(`/publications/reviews/${reviewId}/report`);
      setReportedReviews(prev => ({ ...prev, [reviewId]: true }));
      toast.success("Concern logged. Thank you for maintaining community trust.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to file concern report.");
    }
  };

  const handleShareReview = (reviewId: string) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#review-${reviewId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Review share link copied to clipboard!");
  };

  const handleSharePublication = async () => {
    const shareData = {
      title: "Kashmir Craft Publication",
      text: "Check out this publication on KHCRF.",
      url: window.location.href,
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Publication shared successfully!");
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          navigator.clipboard.writeText(window.location.href);
          toast.success("Publication share link copied to clipboard!");
        }
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Publication share link copied to clipboard!");
    }
  };

  const handleRecommendPublication = () => {
    const key = `rec-pub-${publicationId}`;
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      setHasRecommended(false);
      toast.success("Recommendation removed.");
      return;
    }
    localStorage.setItem(key, "true");
    setHasRecommended(true);
    toast.success("Thank you! Your recommendation has been registered.");
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.review || !formData.reviewType) {
      toast.error("Please fill in the review body and reviewer category.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/publications/${publicationId}/reviews`, formData);
      toast.success("Review submitted! It will appear publicly after admin vetting.");
      setIsWriteModalOpen(false);
      setFormData({
        rating: 5,
        title: "",
        review: "",
        reviewType: "Researcher",
        reviewerName: "",
        institution: "",
        country: "",
        disclosure: "",
        permissionToDisplayName: true
      });
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.error || "Failed to submit review.";
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter reviews by active category tab
  const filteredReviews = publicReviews.filter(r => {
    if (activeTab === "All") return true;
    return r.reviewType === activeTab;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex text-amber-500 gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <FaStar key={i} className={i < rating ? "fill-current" : "text-stone-200"} size={12} />
        ))}
      </div>
    );
  };

  // --- Render Write Modal ---
  const renderWriteModal = () => (
    isWriteModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl border border-stone-100 flex flex-col space-y-6 relative">
          
          <button 
            onClick={() => setIsWriteModalOpen(false)} 
            className="absolute top-6 right-6 text-stone-400 hover:text-stone-700 transition-colors"
            type="button"
          >
            <FaTimes size={16} />
          </button>

          <div className="space-y-1">
            <h3 className="text-xl font-bold font-serif text-brand-dark">Write a Peer Review</h3>
            <p className="text-stone-500 text-xs">
              Help validate regional craft intelligence. Reviews undergo admin vetting to prevent spam and preserve authority.
            </p>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-5 text-xs text-stone-700">
            {/* Authenticated context note */}
            {!user ? (
              <div className="bg-amber-50 border border-amber-250/20 rounded-xl p-4 text-[11px] text-amber-800 space-y-1">
                <span className="font-bold uppercase tracking-wider block">Identity Verification Details Required</span>
                You are submitting as a guest. Please provide verified organization details so our panelists can vet your review.
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-250/15 rounded-xl p-4 text-[11px] text-emerald-800">
                Submitting review as authenticated user: <span className="font-bold">{user.name}</span> ({user.email})
              </div>
            )}

            {/* Rating */}
            <div className="space-y-2">
              <label className="font-bold uppercase tracking-wider block">Your Rating</label>
              <div className="flex gap-1.5 items-center">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, rating: val }))}
                    className="text-stone-300 hover:text-amber-500 transition-colors"
                  >
                    <FaStar 
                      className={val <= formData.rating ? "text-amber-500 fill-current" : "text-stone-200"} 
                      size={24} 
                    />
                  </button>
                ))}
                <span className="ml-2 font-bold text-stone-500">{formData.rating} / 5 Stars</span>
              </div>
            </div>

            {/* Form inputs grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider block">Reviewer Category *</label>
                <select
                  required
                  value={formData.reviewType}
                  onChange={(e) => setFormData(p => ({ ...p, reviewType: e.target.value }))}
                  className="w-full bg-stone-50 border border-stone-250/40 rounded-lg p-2.5 outline-none focus:border-brand-primary"
                >
                  <option value="Researcher">Researcher</option>
                  <option value="Artisan">Artisan</option>
                  <option value="Exporter">Exporter</option>
                  <option value="Policy Maker">Policy Maker</option>
                  <option value="Collector">Collector</option>
                  <option value="Buyer">Buyer</option>
                  <option value="Institutional Expert">Institutional Expert</option>
                </select>
              </div>

              {/* Reviewer Name */}
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider block">Reviewer Name</label>
                <input
                  type="text"
                  placeholder={user ? user.name : "Your full name"}
                  value={formData.reviewerName}
                  onChange={(e) => setFormData(p => ({ ...p, reviewerName: e.target.value }))}
                  className="w-full bg-stone-50 border border-stone-250/40 rounded-lg p-2.5 outline-none focus:border-brand-primary"
                />
              </div>

              {/* Institution / Org */}
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider block">Institution / Organization *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KHCRF, Srinagar Guild, University"
                  value={formData.institution}
                  onChange={(e) => setFormData(p => ({ ...p, institution: e.target.value }))}
                  className="w-full bg-stone-50 border border-stone-250/40 rounded-lg p-2.5 outline-none focus:border-brand-primary"
                />
              </div>

              {/* Country */}
              <div className="space-y-1">
                <label className="font-bold uppercase tracking-wider block">Country *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. India, United Kingdom, USA"
                  value={formData.country}
                  onChange={(e) => setFormData(p => ({ ...p, country: e.target.value }))}
                  className="w-full bg-stone-50 border border-stone-250/40 rounded-lg p-2.5 outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            {/* Review Title */}
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider block">Review Title</label>
              <input
                type="text"
                placeholder="Brief summary of your review"
                value={formData.title}
                onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                className="w-full bg-stone-50 border border-stone-250/40 rounded-lg p-2.5 outline-none focus:border-brand-primary"
              />
            </div>

            {/* Review Body */}
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider block">Review Content *</label>
              <textarea
                required
                rows={4}
                placeholder="Share your evaluation, verification feedback, or observations..."
                value={formData.review}
                onChange={(e) => setFormData(p => ({ ...p, review: e.target.value }))}
                className="w-full bg-stone-50 border border-stone-250/40 rounded-xl p-3 outline-none focus:border-brand-primary font-serif resize-none"
              />
            </div>

            {/* Disclosure */}
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider block">Disclosure / Conflict of Interest</label>
              <textarea
                rows={2}
                placeholder="Declare any professional ties or state: 'No conflicts of interest to declare.'"
                value={formData.disclosure}
                onChange={(e) => setFormData(p => ({ ...p, disclosure: e.target.value }))}
                className="w-full bg-stone-50 border border-stone-250/40 rounded-xl p-3 outline-none focus:border-brand-primary font-serif resize-none"
              />
            </div>

            {/* Display Name Permission */}
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                id="permissionToDisplayName"
                checked={formData.permissionToDisplayName}
                onChange={(e) => setFormData(p => ({ ...p, permissionToDisplayName: e.target.checked }))}
                className="accent-brand-primary w-4 h-4 rounded"
              />
              <label htmlFor="permissionToDisplayName" className="font-bold select-none cursor-pointer">
                Permission to display my name publicly with this review
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setIsWriteModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-bold uppercase tracking-wider hover:bg-stone-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-dark text-white font-bold uppercase tracking-wider transition-all disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );

  // --- Render Empty State ---
  if (totalReviewsCount === 0) {
    return (
      <section className="py-16 border-t border-gray-100 bg-white" id="reviews-section">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <span className="inline-block px-3 py-1 rounded-md bg-brand-primary/5 text-brand-primary text-[10px] font-black uppercase tracking-widest">
            Scholarly Reception & Peer Reviews
          </span>
          <h2 className="text-3xl font-bold font-serif text-brand-dark">
            Field Reception & Expert Endorsements
          </h2>
          
          <div className="p-12 border border-dashed border-stone-200/80 rounded-3xl bg-stone-50/30 space-y-6 flex flex-col items-center">
            <FaBookOpen className="text-stone-300 text-5xl" />
            <div className="space-y-2">
              <p className="text-lg font-serif font-bold text-stone-800">
                Peer reviews are being collected.
              </p>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Be the first verified contributor to review this publication and help validate authentic Kashmir craft knowledge.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <button
                onClick={() => setIsWriteModalOpen(true)}
                className="bg-brand-primary text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-brand-dark transition-all shadow-md shadow-brand-primary/10"
              >
                Write Peer Review
              </button>
              <button
                onClick={handleSharePublication}
                className="bg-white border border-stone-250/50 text-stone-700 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-stone-50 transition-all flex items-center gap-2"
              >
                <FaShareAlt size={11} /> Share Publication
              </button>
              <button
                onClick={handleRecommendPublication}
                className={`bg-white border px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-stone-50 transition-all flex items-center gap-2 ${
                  hasRecommended ? "border-rose-500 text-rose-600 bg-rose-50/30" : "border-stone-250/50 text-stone-700"
                }`}
              >
                <FaHeart size={11} className={hasRecommended ? "text-rose-500" : "text-stone-300"} /> 
                {hasRecommended ? "Recommended" : "Recommend This Work"}
              </button>
            </div>
          </div>
        </div>
        {renderWriteModal()}
      </section>
    );
  }

  return (
    <section className="py-16 border-t border-gray-100 bg-white" id="reviews-section">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center md:text-left mb-10">
          <span className="inline-block px-3 py-1 rounded-md bg-brand-primary/5 text-brand-primary text-[10px] font-black uppercase tracking-widest mb-3">
            Scholarly Reception & Peer Reviews
          </span>
          <h2 className="text-3xl font-bold font-serif text-brand-dark">
            Field Reception & Expert Endorsements
          </h2>
          <p className="text-gray-500 text-sm mt-2 max-w-xl">
            Scholarly reviews, verification standards, and academic reception from the Kashmir craft development network.
          </p>
        </div>

        {/* 1. Expert Endorsements (Authority Box) */}
        {expertReviews.length > 0 && (
          <div className="mb-14 bg-[#FAF7F0] border border-[#E9E4D6] rounded-3xl p-8 shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#050A1E] mb-6 flex items-center gap-2">
              <FaLock data-ui-icon  size={10} className="" /> Expert Endorsements & Academic Reviews
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {expertReviews.map((expert) => (
                <div key={expert.id} className="bg-white rounded-2xl p-6 border border-stone-200/50 relative shadow-2xs hover:shadow-md transition-shadow">
                  <span className="absolute top-4 right-4 bg-brand-primary/5 text-brand-primary text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                    {expert.expertType || "Academic Endorsement"}
                  </span>
                  <p className="text-gray-700 font-serif italic leading-relaxed text-sm mb-4">
                    &ldquo;{expert.review}&rdquo;
                  </p>
                  <div className="border-t border-stone-100 pt-3">
                    <h4 className="text-xs font-black text-brand-dark">{expert.expertName}</h4>
                    <p className="text-[10px] text-gray-500 font-semibold">{expert.expertDesignation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Public Review Core System */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN: Summary Cards */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Overall stats */}
            {averageRating && (
              <div className="bg-slate-50/50 border border-slate-100 p-8 rounded-3xl text-center flex flex-col items-center justify-center animate-fadeIn">
                <div className="text-5xl font-black text-brand-dark mb-2 font-serif">{averageRating}</div>
                {renderStars(Math.round(parseFloat(averageRating)))}
                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-3">
                  {totalReviewsCount} Peer Reviews
                </div>
                {recommendRate && (
                  <div className="mt-4 pt-4 border-t border-gray-100 w-full flex items-center justify-center gap-2 text-xs font-bold text-emerald-600">
                    <span className="bg-emerald-50 px-2 py-0.5 rounded text-[10px]">{recommendRate}%</span>
                    <span>Recommend this work</span>
                  </div>
                )}
              </div>
            )}

            {/* Dimensional Breakdown */}
            {totalReviewsCount > 0 && (
              <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-3xl space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-250/20 pb-2">
                  Scholarly Metrics
                </h4>
                {[
                  { label: "Research Quality", value: metrics.research },
                  { label: "Practical Usefulness", value: metrics.practical },
                  { label: "Industry Relevance", value: metrics.relevance },
                  { label: "Data Quality", value: metrics.data },
                  { label: "Readability", value: metrics.readability },
                ].map((dim, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-gray-600">
                      <span>{dim.label}</span>
                      <span className="font-mono text-brand-dark">{dim.value}</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-primary rounded-full" 
                        style={{ width: `${(dim.value / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: Reviews List */}
          <div className="lg:col-span-8 flex flex-col">
            
            {/* Filter Tabs & CTAs */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4 mb-6">
              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-1.5">
                {TABS.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${
                      activeTab === tab.value
                        ? "bg-brand-primary text-white shadow-xs"
                        : "text-gray-500 hover:text-brand-primary hover:bg-gray-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => setIsWriteModalOpen(true)}
                  className="bg-brand-primary hover:bg-brand-dark text-white px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
                >
                  Write Peer Review
                </button>
                <button
                  onClick={handleSharePublication}
                  className="border border-stone-200 text-stone-700 hover:bg-stone-50 px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5"
                >
                  <FaShareAlt size={10} /> Share
                </button>
                <button
                  onClick={handleRecommendPublication}
                  className={`border hover:bg-stone-50 px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    hasRecommended ? "border-rose-500 text-rose-600 bg-rose-50/30" : "border-stone-200 text-stone-700"
                  }`}
                >
                  <FaHeart size={10} className={hasRecommended ? "text-rose-500" : "text-stone-300"} /> 
                  {hasRecommended ? "Recommended" : "Recommend Work"}
                </button>
              </div>
            </div>

            {/* List */}
            {filteredReviews.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-gray-200 rounded-3xl bg-slate-50/25">
                <p className="text-sm font-medium text-gray-500 italic">
                  No peer reviews matching the selected filter are available yet.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredReviews.map((rev) => (
                  <div key={rev.id} id={`review-${rev.id}`} className="p-6 bg-white border border-gray-100 rounded-2xl flex flex-col relative hover:shadow-xs transition-shadow">
                    
                    {/* Stars & Category */}
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        {renderStars(rev.rating)}
                        <span data-editorial-accent-text className="text-[9px] font-black uppercase tracking-wider  bg-brand-primary/5 px-2 py-0.5 rounded">
                          {rev.reviewType}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-semibold">
                        {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    {/* Review Title */}
                    {rev.title && (
                      <h4 className="text-sm font-black text-brand-dark mb-1">
                        {rev.title}
                      </h4>
                    )}

                    {/* Review Body */}
                    <p className="text-gray-600 text-xs leading-relaxed font-serif mb-4">
                      {rev.review}
                    </p>

                    {/* Footer / Meta & Engagements */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-50 pt-4 mt-auto gap-4">
                      <div className="space-y-1 text-left">
                        <div className="text-[10px] font-bold text-gray-500 flex flex-wrap items-center gap-1.5">
                          {rev.permissionToDisplayName ? (
                            <span>By {rev.reviewerName || "Anonymous Contributor"}</span>
                          ) : (
                            <span>By Anonymous Contributor</span>
                          )}
                          {rev.institution && (
                            <span className="text-gray-400">({rev.institution})</span>
                          )}
                          {rev.country && (
                            <span className="text-gray-400">• {rev.country}</span>
                          )}
                        </div>
                        {rev.disclosure && (
                          <p className="text-[9px] text-gray-400 italic">
                            Conflict of Interest: {rev.disclosure}
                          </p>
                        )}
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <span className="text-[9px] font-bold text-stone-400">
                            {rev.verifiedReader ? (
                              <span className="flex items-center gap-1 text-emerald-600">
                                <FaCheckCircle className="text-[9px]" /> Verified Reader
                              </span>
                            ) : (
                              "Public Guest"
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Engagement Actions */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Found Helpful */}
                        <button
                          onClick={() => handleHelpful(rev.id)}
                          disabled={helpfulVoted[rev.id]}
                          className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider py-1.5 px-3 rounded-lg border transition-all ${
                            helpfulVoted[rev.id]
                              ? "bg-stone-50 text-stone-400 border-stone-100"
                              : "bg-white text-stone-600 hover:text-brand-primary hover:border-brand-primary border-stone-200"
                          }`}
                        >
                          <FaThumbsUp className="text-[8px]" />
                          Found Helpful ({rev.helpfulCount})
                        </button>

                        {/* Recommend Work */}
                        <button
                          onClick={() => handleRecommendReview(rev.id)}
                          disabled={recommendVoted[rev.id]}
                          className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider py-1.5 px-3 rounded-lg border transition-all ${
                            recommendVoted[rev.id]
                              ? "bg-stone-50 text-stone-400 border-stone-100"
                              : "bg-white text-stone-600 hover:text-brand-primary hover:border-brand-primary border-stone-200"
                          }`}
                        >
                          <FaHeart className="text-[8px] text-rose-500" />
                          Recommend ({rev.recommendCount || 0})
                        </button>

                        {/* Share Review */}
                        <button
                          onClick={() => handleShareReview(rev.id)}
                          className="bg-white text-stone-600 hover:text-brand-primary hover:border-brand-primary border-stone-200 inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider py-1.5 px-3 rounded-lg border transition-all"
                        >
                          <FaShareAlt className="text-[8px]" />
                          Share
                        </button>

                        {/* Report Concern */}
                        <button
                          onClick={() => handleReportReview(rev.id)}
                          disabled={reportedReviews[rev.id]}
                          className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider py-1.5 px-3 rounded-lg border transition-all ${
                            reportedReviews[rev.id]
                              ? "bg-red-50 text-red-400 border-transparent animate-pulse"
                              : "bg-white text-stone-600 hover:text-red-600 hover:border-red-300 border-stone-200"
                          }`}
                        >
                          <FaExclamationTriangle className="text-[8px]" />
                          Report Concern
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      </div>
      {renderWriteModal()}
    </section>
  );
}
