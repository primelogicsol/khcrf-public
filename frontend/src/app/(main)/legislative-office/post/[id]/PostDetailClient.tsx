"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useParams } from "next/navigation";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaFileAlt,
  FaLandmark,
  FaTag,
  FaShareAlt,
  FaFlag,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaEnvelope,
  FaInstagram,
  FaBullhorn,
} from "react-icons/fa";
import Link from "next/link";
import ShareButtons from "@/components/common/ShareButtons";
import ReportModal from "@/components/common/ReportModal";

export default function PostDetailClient({
  initialId,
}: {
  initialId?: string;
}) {
  const params = useParams();
  const id = initialId || (params.id as string);
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    if (id) fetchPost();
  }, [id]);

  const handleReportSubmit = async (reason: string) => {
    try {
      await api.post("/legislative/public/posts/report", {
        postId: id,
        reason,
      });
      alert("Report submitted. Thank you for your feedback.");
    } catch (err) {
      console.error("Report error:", err);
      alert("Failed to submit report. Please try again.");
    }
  };

  const fetchPost = async () => {
    try {
      const { data } = await api.get(`/legislative/public/post/${id}`);
      setPost(data);
    } catch (err) {
      setError("Post not found.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-[#F8F9FA] text-gray-500 font-medium">
        Loading verified update...
      </div>
    );

  if (error || !post)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#F8F9FA] text-center">
        <FaLandmark className="text-6xl text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Content Not Found
        </h1>
        <p className="text-gray-500">{error}</p>
        <Link
          href="/"
          className="mt-8 text-brand-primary font-bold hover:underline"
        >
          Return Home
        </Link>
      </div>
    );

  const office = post.office;

  // Mock Data for Sidebar Context
  const meetings = [
    {
      title: "Annual Artisan Cluster Meet",
      date: "2024-10-25",
      type: "Consultation",
    },
    {
      title: "Credit Awareness Camp",
      date: "2024-11-02",
      type: "Workshop",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans pb-20">
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
      />

      {/* --- Header / Official Banner --- */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="bg-brand-primary/5 border-b border-brand-primary/10 px-4 py-2">
          <div data-editorial-accent-text className="max-w-7xl mx-auto flex justify-between items-center text-xs font-bold  uppercase tracking-widest gap-2">
            <span className="flex items-center gap-2">
              <FaLandmark /> Legislative Constituency Artisan Desk
            </span>
            <span className="flex items-center gap-2 text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
              <FaCheckCircle /> Verified Official Portal
            </span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link
            href={`/legislative-office/${office.username}`}
            className="flex items-center gap-2 text-gray-600 hover:text-brand-primary font-bold text-sm transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 group-hover:border-brand-primary">
              {office.officeImageUrl ? (
                <img
                  src={office.officeImageUrl}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaLandmark className="text-gray-400" />
              )}
            </div>
            <span className="flex flex-col">
              <span className="text-xs text-gray-400 uppercase tracking-wide">
                Back to Office
              </span>
              <span className="text-gray-900 group-hover:text-brand-primary">
                {office.representativeName}
              </span>
            </span>
          </Link>

          <ShareButtons
            url={typeof window !== "undefined" ? window.location.href : ""}
            title={post.title}
            // compact // Assuming ShareButtons accepts a compact prop, or just render normally
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* --- LEFT COL: Main Article Content --- */}
          <article className="lg:col-span-2 space-y-8 animate-fadeIn">
            {/* Hero Header */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-brand-secondary text-white text-xs font-bold uppercase tracking-wide rounded-md flex items-center gap-2 shadow-sm shadow-brand-secondary/20">
                  <FaBullhorn /> Verified Update
                </span>
                <span className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wide">
                  <FaCalendarAlt />{" "}
                  {new Date(post.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                {post.isPinned && (
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] font-bold uppercase rounded border border-yellow-200">
                    ★ Pinned Notice
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-playfair font-black text-gray-900 leading-tight mb-6">
                {post.title}
              </h1>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded border border-gray-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Content Body */}
            <div className="prose prose-lg prose-slate max-w-none prose-headings:font-playfair prose-headings:font-bold prose-img:rounded-xl">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {/* Attachments */}
            {post.documents && post.documents.length > 0 && (
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FaFileAlt /> Official Attachments
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {post.documents.map((doc: string, idx: number) => (
                    <a
                      key={idx}
                      href={doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-brand-primary hover:shadow-md transition-all group"
                    >
                      <div data-ui-icon className="p-3 bg-brand-primary/5  rounded-lg group-hover:bg-brand-primary group-hover:text-white transition-colors">
                        <FaFileAlt />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">
                          Download Document {idx + 1}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[150px]">
                          View Detail
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="border-t border-gray-200 pt-8 flex justify-between items-center">
              <p className="text-xs text-gray-400 italic">
                This verified update was published directly by the Legislative
                Office of {office.constituency}.
              </p>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="text-gray-400 hover:text-red-600 text-xs font-bold uppercase tracking-wide flex items-center gap-2 transition-colors"
              >
                <FaFlag /> Report Content
              </button>
            </div>
          </article>

          {/* --- RIGHT COL: Sidebar Context --- */}
          <aside className="lg:col-span-1 space-y-8">
            {/* Office Snapshot */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-20 bg-gradient-to-r from-brand-primary to-brand-dark relative">
                <div className="absolute -bottom-8 left-6">
                  <div className="w-16 h-16 rounded-full bg-white p-1 shadow-md">
                    {office.officeImageUrl ? (
                      <img
                        src={office.officeImageUrl}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <FaLandmark />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="pt-10 px-6 pb-6">
                <h3 className="font-playfair font-bold text-xl text-gray-900 leading-tight mb-1">
                  {office.representativeName}
                </h3>
                <p data-editorial-accent-text className="text-xs font-bold  uppercase tracking-wide mb-4">
                  {office.designation} | {office.constituency}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FaMapMarkerAlt className="text-gray-400 min-w-[16px]" />{" "}
                    {office.constituency}, J&K
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FaEnvelope className="text-gray-400 min-w-[16px]" />{" "}
                    {office.officialEmail}
                  </div>
                </div>

                <Link
                  href={`/legislative-office/${office.username}`}
                  className="block w-full text-center py-2 bg-gray-900 text-white text-xs font-bold uppercase rounded shadow-sm hover:bg-gray-800 transition-colors"
                >
                  View Full Desk
                </Link>
              </div>
            </div>

            {/* Engagement Snapshot (Mock) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <FaCalendarAlt data-ui-icon  className="" />
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                  Upcoming Engagements
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {meetings.map((m, i) => (
                  <div
                    key={i}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-50 text-blue-600 p-2 rounded text-center min-w-[50px]">
                        <div className="text-xs font-bold uppercase">Oct</div>
                        <div className="text-lg font-bold">25</div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 leading-tight mb-1">
                          {m.title}
                        </h4>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide bg-gray-100 px-1.5 py-0.5 rounded">
                          {m.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscribe CTA */}
            <div className="bg-brand-primary/5 rounded-xl border border-brand-primary/10 p-6 text-center">
              <FaEnvelope data-ui-icon  className="text-3xl  mx-auto mb-3 opacity-50" />
              <h3 className="text-sm font-bold text-brand-primary uppercase tracking-wide mb-2">
                Legislative Alerts
              </h3>
              <button className="w-full py-2 bg-brand-primary text-white text-xs font-bold uppercase rounded shadow-sm hover:bg-brand-dark transition-colors">
                Subscribe Now
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
