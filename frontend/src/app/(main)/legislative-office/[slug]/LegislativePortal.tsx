"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  FaLandmark,
  FaMapMarkerAlt,
  FaEnvelope,
  FaCheckCircle,
  FaFileAlt,
  FaInstagram,
  FaAward,
  FaBullhorn,
  FaChartPie,
  FaUsers,
  FaFlag,
  FaArrowRight,
} from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReportModal from "@/components/common/ReportModal";
import ShareButtons from "@/components/common/ShareButtons";
import { useAuth } from "@/context/AuthContext";

import OverviewTab from "./components/OverviewTab";
import UpdatesTab from "./components/UpdatesTab";
import CCSIDeskTab from "./components/CCSIDeskTab";
import CCEProgramTab from "./components/CCEProgramTab";

export default function LegislativePortal({
  initialSlug,
}: {
  initialSlug?: string;
}) {
  const router = useRouter();
  const params = useParams();
  const slug = initialSlug || (params.slug as string);
  const [office, setOffice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportingPostId, setReportingPostId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [openReferralSections, setOpenReferralSections] = useState<
    Record<string, boolean>
  >({});

  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const toggleReferralSection = (id: string) => {
    setOpenReferralSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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

  const fetchSubscriptionStatus = async () => {
    if (!user) return;
    try {
      const { data } = await api.get(`/legislative/public/${slug}/subscribe`);
      setIsSubscribed(data.isSubscribed);
    } catch (err) {
      console.error("Failed to fetch subscription status:", err);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchOffice();
      fetchSubscriptionStatus();
    }
  }, [slug, user]);

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

  const handleToggleSubscription = async () => {
    if (!user) {
      alert("Please log in to subscribe to office updates.");
      router.push("/login");
      return;
    }

    try {
      setIsSubscribing(true);
      const { data } = await api.post(`/legislative/public/${slug}/subscribe`);
      setIsSubscribed(data.isSubscribed);
    } catch (err) {
      console.error("Subscription toggle failed:", err);
      alert("Failed to update subscription status. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-[#F8F9FA] text-gray-500 font-medium">
        Loading verified constituency data...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#F8F9FA] text-center">
        <FaLandmark className="text-6xl text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Constituency Desk Not Accessible
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

  if (!office) return null;

  const pinnedPosts = office.posts.filter((p: any) => p.isPinned);
  const regularPosts = office.posts.filter((p: any) => !p.isPinned);

  // Dynamic Overview Data
  const overviewData = office.overviewData || {
    rStats: {
      totalStakeholders: 0,
      verifiedProfiles: 0,
      underEvaluation: 0,
      commerceInterest: 0,
    },
    craftComposition: [],
    economicIndicators: [],
    caseStatus: [],
  };

  // Dynamic LCAD Updates Data
  const lcadData = office.lcadUpdatesConfig || {
    meetings: [],
    policies: [],
    notices: [],
    clusterVisits: [],
  };

  const tabs = [
    { id: "overview", label: "Impact Overview", icon: FaChartPie },
    { id: "updates", label: "LCAD Desk Updates", icon: FaBullhorn },
    { id: "ccsi-desk", label: "CCSI Desk", icon: FaUsers },
    { id: "cce-program", label: "CCE Program", icon: FaAward },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-900">
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
      />

      {/* --- Header / Official Banner --- */}
      <header className="bg-white border-b border-gray-200">
        <div className="bg-brand-primary/5 border-b border-brand-primary/10 px-4 py-2">
          <div data-editorial-accent-text className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs font-bold  uppercase tracking-widest gap-2">
            <span className="flex items-center gap-2">
              <FaLandmark /> Legislative Constituency Artisan Desk
            </span>
            <span className="flex items-center gap-2 text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
              <FaCheckCircle /> Verified Official Portal
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-full flex items-center justify-center border-4 border-white shadow-xl overflow-hidden shrink-0">
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
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gray-500 font-bold uppercase text-sm tracking-wide">
                  {office.constituency} Constituency
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-playfair font-black text-gray-900 leading-none mb-3">
                {office.representativeName}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 font-medium flex flex-wrap items-center gap-3">
                <span className="text-brand-primary font-bold">
                  {office.designation}
                </span>
                <span className="text-gray-300">|</span>
                <span>{office.party}</span>
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded border border-gray-200">
                  <FaMapMarkerAlt data-ui-icon  className="" />{" "}
                  {office.constituency}, J&K
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded border border-gray-200">
                  <FaEnvelope data-ui-icon  className="" />{" "}
                  {office.officialEmail}
                </div>
                {office.socialHandle && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded border border-gray-200">
                    <FaInstagram className="text-purple-600" />{" "}
                    {office.socialHandle}
                  </div>
                )}
              </div>
            </div>
            <div className="w-full md:w-auto mt-4 md:mt-0">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl max-w-xs mb-4">
                <p className="text-blue-900  font-bold uppercase tracking-widest mb-1 flex items-center gap-2 text-md">
                  <FaLandmark /> Governance Statement
                </p>
                <p className="text-blue-800 text-xs leading-relaxed mt-2">
                  This desk operates under a structured Public–Private
                  Partnership (PPP) governance framework led by the Local
                  Constituency Representative and technically supported by
                  Hamadan Craft Revival Foundation.
                  <br />
                  <br />
                  Registration does not guarantee commercial placement or
                  contractual benefit.
                </p>
              </div>

              <button
                onClick={handleToggleSubscription}
                disabled={isSubscribing}
                className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest transition-all ${
                  isSubscribed
                    ? "bg-green-100 text-green-800 hover:bg-green-200 border border-green-200"
                    : "bg-brand-primary text-white hover:bg-brand-dark shadow-md"
                } ${isSubscribing ? "opacity-70 cursor-wait" : ""}`}
              >
                {isSubscribing ? (
                  <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                ) : isSubscribed ? (
                  <>
                    <FaCheckCircle className="text-lg" /> Subscribed
                  </>
                ) : (
                  <>
                    <FaBullhorn className="text-lg" /> Subscribe to Updates
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* --- Tabs Navigation --- */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-4">
          <div className="flex justify-end mb-2 md:hidden">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 animate-pulse">
              Swipe for more <FaArrowRight />
            </span>
          </div>
          <div className="flex gap-6 border-b border-gray-200 overflow-x-auto pb-1 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-2 text-sm font-bold uppercase tracking-wide flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-brand-primary border-b-2 border-brand-primary"
                    : "text-gray-400 hover:text-gray-600 border-b-2 border-transparent"
                }`}
              >
                <tab.icon /> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* --- TAB: OVERVIEW --- */}
        {activeTab === "overview" && (
          <OverviewTab office={office} overviewData={overviewData} />
        )}

        {/* --- TAB: UPDATES --- */}
        {activeTab === "updates" && (
          <UpdatesTab
            pinnedPosts={pinnedPosts}
            regularPosts={regularPosts}
            office={office}
            onReportClick={handleReportClick}
            meetings={lcadData.meetings}
            policies={lcadData.policies}
            notices={lcadData.notices}
            clusterVisits={lcadData.clusterVisits}
          />
        )}

        {/* --- TAB: CCSI DESK --- */}
        {activeTab === "ccsi-desk" && (
          <CCSIDeskTab
            office={office}
            slug={slug}
            router={router}
            openReferralSections={openReferralSections}
            toggleReferralSection={toggleReferralSection}
          />
        )}

        {/* --- TAB: CCE PROGRAM --- */}
        {activeTab === "cce-program" && (
          <CCEProgramTab setActiveTab={setActiveTab} />
        )}
      </main>

      {/* Footer Disclaimer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <FaLandmark className="text-3xl text-gray-300 mx-auto mb-4" />
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-2">
            Legislative Constituency Artisan Desk
          </p>
          <p className="text-gray-400 text-xs max-w-2xl mx-auto leading-relaxed">
            This platform reflects verified registry data, policy engagement,
            integrity oversight, and recognition initiatives within the Kashmir
            handicrafts ecosystem. It does not conduct trade or commercial
            transactions.
          </p>
        </div>
      </footer>
    </div>
  );
}

// --- Components ---

function MetricCard({ label, value, sub, highlight }: any) {
  return (
    <div
      className={`p-6 rounded-xl border ${highlight ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20" : "bg-white border-gray-200 shadow-sm"}`}
    >
      <h4
        className={`text-xs font-bold uppercase tracking-widest mb-2 ${highlight ? "text-white/80" : "text-gray-400"}`}
      >
        {label}
      </h4>
      <div className="text-3xl font-black mb-1 font-playfair">{value}</div>
      <div
        className={`text-xs font-medium ${highlight ? "text-white/90" : "text-gray-500"}`}
      >
        {sub}
      </div>
    </div>
  );
}

function Indicator({ label, value, type }: any) {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
      <span className="text-sm font-bold text-gray-600">{label}</span>
      <span className="flex items-center gap-2">
        <span className="text-lg font-bold text-gray-900">{value}</span>
        {type === "trend-up" && (
          <span className="text-green-500 text-xs">▲</span>
        )}
      </span>
    </div>
  );
}

function PolicyItem({ issue, status, color }: any) {
  return (
    <li className="flex justify-between items-center text-sm">
      <span className="font-bold text-gray-700">{issue}</span>
      <span
        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${color}`}
      >
        {status}
      </span>
    </li>
  );
}

function PostSummary({ post }: any) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
        <span className="text-gray-300">•</span>
        <span className="text-[10px] font-bold text-brand-secondary uppercase">
          Verified Update
        </span>
      </div>
      <Link
        href={`/legislative-office/post/${post.id}`}
        className="font-bold text-gray-900 hover:text-brand-primary block text-lg font-playfair leading-tight mb-2"
      >
        {post.title}
      </Link>
      <p className="text-sm text-gray-600 line-clamp-2">
        {post.content.replace(/<[^>]*>?/gm, "")}
      </p>
    </div>
  );
}

function PostCard({ post, office, onReport }: any) {
  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
            {office.officeImageUrl ? (
              <img
                src={office.officeImageUrl}
                className="w-full h-full object-cover"
              />
            ) : (
              <FaLandmark className="text-gray-400 m-auto mt-2" />
            )}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">
              {office.representativeName}
            </h4>
            <p className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <Link
          href={`/legislative-office/post/${post.id}`}
          className="group block"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-3 font-playfair group-hover:text-brand-primary transition-colors">
            {post.title}
          </h3>
          <div
            className="prose prose-stone max-w-none text-gray-600 text-sm mb-4 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </Link>

        {post.documents &&
          post.documents.length > 0 /* ... attachments logic ... */ && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.documents.map((doc: string, i: number) => (
                <a
                  key={i}
                  href={doc}
                  target="_blank"
                  className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded text-xs font-bold text-icon-on-light flex items-center gap-2"
                >
                  <FaFileAlt /> Attachment {i + 1}
                </a>
              ))}
            </div>
          )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Link
            href={`/legislative-office/post/${post.id}`}
            className="text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-brand-primary"
          >
            Read Full Update ↗
          </Link>
          <div className="flex gap-3">
            <button
              onClick={() => onReport(post.id)}
              className="text-gray-400 hover:text-red-500"
            >
              <FaFlag />
            </button>
            <ShareButtons
              url={`/legislative-office/post/${post.id}`}
              title={post.title}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
