"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import ShareButtons from "@/components/common/ShareButtons";
import {
  FaLandmark,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaCheckCircle,
  FaCalendarAlt,
  FaTag,
  FaThumbtack,
  FaFileAlt,
  FaGlobe,
  FaShareAlt,
  FaHandshake,
  FaInstagram,
  FaFlag,
} from "react-icons/fa";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReportModal from "@/components/common/ReportModal";

export default function OfficeBlogClient({
  initialSlug,
}: {
  initialSlug?: string;
}) {
  const params = useParams();
  const slug = initialSlug || (params.slug as string);
  const [office, setOffice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportingPostId, setReportingPostId] = useState<string | null>(null);

  useEffect(() => {
    if (slug) fetchOffice();
  }, [slug]);

  const fetchOffice = async () => {
    try {
      const { data } = await api.get(`/legislative/public/${slug}`);
      setOffice(data);
    } catch (err) {
      setError("Office not found or verification pending.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportClick = (postId: string) => {
    setReportingPostId(postId);
    setIsReportModalOpen(true);
  };

  const handleReportSubmit = async (reason: string) => {
    if (!reportingPostId) return;
    try {
      await api.post("/legislative/public/posts/report", {
        postId: reportingPostId,
        reason,
      });
      alert("Report submitted. Thank you for your feedback.");
    } catch (err) {
      console.error("Report error:", err);
      alert("Failed to submit report. Please try again.");
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50 text-gray-500">
        Loading verified office portal...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50 text-center">
        <FaLandmark className="text-6xl text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Office Not Accessible
        </h1>
        <p className="text-gray-500">{error}</p>
        <a
          href="/"
          className="mt-8 text-brand-primary font-bold hover:underline"
        >
          Return Home
        </a>
      </div>
    );

  if (!office) return null;

  const pinnedPosts = office.posts.filter((p: any) => p.isPinned);
  const regularPosts = office.posts.filter((p: any) => !p.isPinned);

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-roboto">
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
      />
      {/* Header / Official Banner */}
      <div className="bg-white border-b-4 border-brand-primary shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden shrink-0">
              {office.officeImageUrl ? (
                <img
                  src={office.officeImageUrl}
                  alt={office.representativeName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaLandmark className="text-4xl text-gray-300" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                  <FaCheckCircle /> Verified Legislative Office
                </span>
                <span className="text-gray-400 text-sm">|</span>
                <span className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                  {office.constituency} Constituency
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-playfair font-black text-gray-900 leading-tight mb-2">
                {office.representativeName}
              </h1>
              <p className="text-xl text-gray-600 font-medium flex flex-wrap items-center gap-2">
                <span className="font-bold text-brand-primary">
                  {office.designation}
                </span>
                <span>•</span>
                <span>{office.party}</span>
                {office.legislativeBody && (
                  <>
                    <span>•</span>
                    <span>{office.legislativeBody}</span>
                  </>
                )}
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-sm font-bold text-gray-500">
                {office.termStart && office.termEnd && (
                  <span className="flex items-center gap-2 px-3 py-1.5 bg-white rounded border border-gray-200">
                    <FaCalendarAlt data-ui-icon  className="" />
                    Term: {new Date(office.termStart).getFullYear()} –{" "}
                    {new Date(office.termEnd).getFullYear()}
                  </span>
                )}
                {office.officialWebsite && (
                  <a
                    href={office.officialWebsite}
                    target="_blank"
                    rel="noopener"
                    className="flex items-center gap-2 px-3 py-1.5 bg-white rounded border border-gray-200 hover:text-brand-primary hover:border-brand-primary transition-colors"
                  >
                    <FaGlobe data-ui-icon  className="" /> Website
                  </a>
                )}
                {office.socialHandle && (
                  <span className="flex items-center gap-2 px-3 py-1.5 bg-white rounded border border-gray-200">
                    <FaInstagram className="text-purple-600" />{" "}
                    {office.socialHandle}
                  </span>
                )}
                {office.knownCraft && (
                  <span className="flex items-center gap-2 px-3 py-1.5 bg-white rounded border border-gray-200">
                    <FaTag className="text-orange-500" /> Known for:{" "}
                    {office.knownCraft}
                  </span>
                )}
                {office.hcrfSupport && (
                  <span className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded border border-blue-100 font-bold uppercase text-xs tracking-wider">
                    <FaHandshake /> KHCRF Supporter
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-8 order-2 lg:order-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Official Contact
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <FaMapMarkerAlt data-ui-icon  className=" mt-1 shrink-0" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    Office Address
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {office.officeAddress}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <FaEnvelope data-ui-icon  className=" shrink-0" />
                <a
                  href={`mailto:${office.officialEmail}`}
                  className="text-sm text-gray-600 hover:text-brand-primary transition-colors truncate"
                >
                  {office.officialEmail}
                </a>
              </div>
              <div className="flex items-center gap-4">
                <FaPhone data-ui-icon  className=" shrink-0" />
                <p className="text-sm text-gray-600">{office.contactNumber}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Focus Areas
            </h3>
            <div className="flex flex-wrap gap-2">
              {office.craftSectors?.map((sector: string) => (
                <span
                  key={sector}
                  className="px-3 py-1 bg-stone-50 border border-stone-200 text-stone-600 text-xs font-bold rounded"
                >
                  {sector}
                </span>
              ))}
            </div>
          </div>

          {/* Engagement & Priorities */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Engagement & Priorities
            </h3>

            {office.engagementSummary && (
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-2">
                  Recent Engagement
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {office.engagementSummary}
                </p>
              </div>
            )}

            {office.priorityAreas && (
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-2">
                  Current Priorities
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {office.priorityAreas}
                </p>
              </div>
            )}

            {office.craftIssues && office.craftIssues.length > 0 && (
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-2">
                  Key Issues Identified
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {office.craftIssues.map((issue: string, idx: number) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-blue-50 p-6 rounded-xl text-sm text-blue-800 leading-relaxed">
            <strong>Official Disclaimer:</strong> This portal is a verified
            communication channel for legislative updates regarding Kashmir
            handicrafts. Content published here reflects official work and is
            not for political campaigning.
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-8 order-1 lg:order-2">
          {/* Pinned Posts */}
          {pinnedPosts.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                <FaThumbtack data-ui-icon  className=" transform rotate-45" />
                <h3 className="text-lg font-bold text-gray-800">
                  Important Notices
                </h3>
              </div>
              {pinnedPosts.map((post: any) => (
                <PostCard
                  key={post.id}
                  post={post}
                  office={office}
                  isPinned
                  onReport={handleReportClick}
                />
              ))}
            </div>
          )}

          {/* Recent Posts */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
              <FaCalendarAlt className="text-gray-400" />
              <h3 className="text-lg font-bold text-gray-800">
                Recent Updates
              </h3>
            </div>
            {regularPosts.length > 0 ? (
              regularPosts.map((post: any) => (
                <PostCard
                  key={post.id}
                  post={post}
                  office={office}
                  onReport={handleReportClick}
                />
              ))
            ) : (
              <div className="p-8 text-center bg-white rounded-xl border border-dashed border-gray-300 text-gray-400">
                No updates published yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PostCard({
  post,
  office,
  isPinned,
  onReport,
}: {
  post: any;
  office: any;
  isPinned?: boolean;
  onReport?: (postId: string) => void;
}) {
  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
      {/* FB Style Header */}
      <div className="p-4 flex items-center gap-3 border-b border-gray-50">
        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
          {office.officeImageUrl ? (
            <img
              src={office.officeImageUrl}
              alt={office.representativeName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full text-gray-400 text-xs">
              <FaLandmark />
            </div>
          )}
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-sm leading-tight">
            {office.representativeName}
          </h4>
          <p className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {isPinned && (
              <span className="ml-2 text-brand-secondary font-bold">
                • Pinned
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="p-5 md:p-6">
        <Link
          href={`/legislative-office/post/${post.id}`}
          className="block group"
        >
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 font-playfair group-hover:text-brand-primary transition-colors">
            {post.title}
          </h2>
          <div
            className="prose prose-stone max-w-none text-gray-600 mb-4 line-clamp-3 text-sm md:text-base"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </Link>

        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.map((tag: string) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-wider rounded border border-gray-100"
            >
              #{tag.replace(/\s+/g, "")}
            </span>
          ))}
        </div>
      </div>

      {post.documents && post.documents.length > 0 && (
        <div className="px-5 pb-5 pt-0">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
              <FaTag className="text-[8px]" /> {post.documents.length}{" "}
              Attachment{post.documents.length > 1 ? "s" : ""}
            </h5>
            <div className="flex flex-wrap gap-2">
              {post.documents.map((doc: string, idx: number) => (
                <a
                  key={idx}
                  href={doc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-medium text-icon-on-light hover:border-brand-primary transition-colors"
                >
                  <FaFileAlt /> View Document {idx + 1}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            href={`/legislative-office/post/${post.id}`}
            className="text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-brand-primary"
          >
            Read Full Update ↗
          </Link>
          <button
            onClick={() => onReport && onReport(post.id)}
            className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-red-500 flex items-center gap-1"
            title="Report this post"
          >
            <FaFlag /> Report
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">
            Share:
          </span>
          <ShareButtons
            url={`${typeof window !== "undefined" ? window.location.origin : ""}/legislative-office/post/${post.id}`}
            title={post.title}
          />
        </div>
      </div>
    </article>
  );
}
