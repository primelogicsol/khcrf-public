"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  FaBook,
  FaPlus,
  FaArrowRight,
  FaFolderOpen,
  FaUserFriends,
  FaSpinner,
  FaFileAlt,
  FaChartBar,
  FaProjectDiagram,
  FaHourglassHalf,
  FaAward,
  FaBookOpen,
  FaGlobe,
  FaBrain,
  FaSearch,
  FaShieldAlt,
  FaTags,
  FaExclamationTriangle,
  FaCheckCircle,
  FaCertificate,
  FaUsers,
  FaLayerGroup,
  FaCogs,
  FaInbox,
  FaUserCircle
} from "react-icons/fa";

export default function PublicationsOverviewPage() {
  const { user } = useAuth();
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const userRole = user?.role || "USER";
  const isContributor = [
    "RESEARCH_CONTRIBUTOR", 
    "FIELD_CONTRIBUTOR", 
    "ARTISAN_CONTRIBUTOR", 
    "INDUSTRY_CONTRIBUTOR", 
    "POLICY_CONTRIBUTOR", 
    "INSTITUTIONAL_PARTNER"
  ].includes(userRole);

  // Safely convert any API field to a display string
  // (handles cases where the API returns a nested object e.g. {id, name, slug})
  const str = (val: any, fallback = "—"): string => {
    if (!val) return fallback;
    if (typeof val === "string") return val;
    if (typeof val === "number") return String(val);
    if (typeof val === "object") return val.name || val.label || val.title || val.slug || fallback;
    return fallback;
  };

  useEffect(() => {
    api.get("/publications")
      .then(r => {
        // API may return { success, data: [...] } or a raw array
        const payload = r.data?.data ?? r.data;
        setPublications(Array.isArray(payload) ? payload : []);
      })
      .catch(() => setPublications([]))
      .finally(() => setLoading(false));
  }, []);

  // Filter publications by current contributor if applicable
  const displayPublications = isContributor
    ? publications.filter(p => 
        p.author?.toLowerCase().includes(user?.name?.toLowerCase() || "") || 
        p.userId === user?.id
      )
    : publications;

  const published = displayPublications.filter(p => p.publishedStatus === "PUBLISHED").length;
  const drafts = displayPublications.filter(p => p.publishedStatus !== "PUBLISHED").length;
  const withISBN = displayPublications.filter(p => p.isbn).length;
  const withSEO = displayPublications.filter(p => p.seoTitle || p.seoDescription).length;
  const withGraph = displayPublications.filter(p => p.linkedCrafts || p.linkedPolicies).length;
  const withAI = displayPublications.filter(p => p.aiSummary || p.qaPairs).length;
  const total = displayPublications.length;
  const authorityScore = total === 0 ? 0 : Math.round(((withISBN + withSEO + withGraph + withAI) / (total * 4)) * 100);

  // Craft coverage — craftSector may be an object or string
  const allCrafts = displayPublications.flatMap(p => {
    const cs = str(p.craftSector, "");
    return cs ? [cs] : [];
  });
  const craftCounts: Record<string, number> = {};
  allCrafts.forEach(c => { craftCounts[c] = (craftCounts[c] || 0) + 1; });
  const topCraft = Object.entries(craftCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Pashmina";

  // Content gaps
  const missingISBN = total - withISBN;
  const missingSEO = total - withSEO;
  const missingGraph = total - withGraph;
  const missingAI = total - withAI;

  const allModules = [
    { label: "Publications",      desc: isContributor ? "My Submissions & works" : "Manage all knowledge assets", href: "/dashboard/business/publications/list",            icon: FaBook,          color: "bg-stone-800 text-white", allowed: true },
    { label: "Content Studio",    desc: "Chapter Builder · Section Editor",    href: "/dashboard/business/publications/content-studio",  icon: FaBookOpen,      color: "bg-teal-600 text-white", allowed: true },
    { label: "Categories",        desc: "15-domain taxonomy",                  href: "/dashboard/business/publications/categories",      icon: FaLayerGroup,    color: "bg-blue-600 text-white", allowed: !isContributor },
    { label: "Cover Templates",   desc: "Branding & cover design",             href: "/dashboard/business/publications/cover-templates",  icon: FaShieldAlt,     color: "bg-amber-600 text-white", allowed: !isContributor },
    { label: "Contributor Intake",desc: "Review submissions",                  href: "/dashboard/business/publications/contributor-intake",icon: FaUserFriends,   color: "bg-indigo-600 text-white", allowed: !isContributor },
    { label: "Reviews",           desc: "Editorial workflow",                  href: "/dashboard/business/publications/reviews",          icon: FaAward,         color: "bg-rose-600 text-white", allowed: !isContributor },
    { label: "SEO & AI Intel",   desc: "Meta, schema, ISBN, AI readiness",   href: "/dashboard/business/publications/seo-citations",    icon: FaSearch,        color: "bg-emerald-600 text-white", allowed: true },
    { label: "Knowledge Graph",   desc: "Craft · GI · Policy node map",       href: "/dashboard/business/publications/knowledge-graph",  icon: FaProjectDiagram,color: "bg-purple-600 text-white", allowed: true },
    { label: "Analytics",         desc: "Reach & AI referral tracking",        href: "/dashboard/business/publications/analytics",        icon: FaChartBar,      color: "bg-cyan-700 text-white", allowed: !isContributor },
  ];

  const visibleModules = allModules.filter(m => m.allowed);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <FaSpinner data-ui-icon  className="animate-spin text-4xl " />
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50/40 font-sans">
      {/* Dynamic Command Center Header */}
      <div className="bg-white border-b border-stone-200 px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                <FaBrain data-ui-icon  className=" text-sm" />
              </div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight">
                {isContributor ? "KHCRF Knowledge Contributor Command Center" : "KHCRF Knowledge Command Center"}
              </h1>
            </div>
            <p className="text-xs text-gray-500 ml-11">
              {isContributor 
                ? "Contributor Dashboard — Author, draft, and track your verified research publications and case data"
                : "Knowledge Publishing System (KPS) — Authority, reach, and discoverability across search engines and AI agents"
              }
            </p>
          </div>
          <div className="flex gap-3 ml-11 md:ml-0">
            <Link href="/dashboard/business/publications/list"
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-stone-200 rounded-xl hover:bg-stone-50 text-xs font-black uppercase tracking-wider transition-all">
              <FaBook size={12} /> {isContributor ? "My Submissions" : "All Publications"}
            </Link>
            <Link href="/dashboard/business/publications/add"
              className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/20 text-xs font-black uppercase tracking-wider transition-all">
              <FaPlus size={12} /> Create Knowledge Asset
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 space-y-8">
        
        {/* Contributor Profile Banner */}
        {isContributor && (
          <div className="bg-emerald-50 border border-emerald-250/20 p-5 rounded-2xl flex items-center gap-4 animate-fadeIn">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-black">
              {user?.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="text-xs space-y-0.5">
              <h3 className="font-bold text-stone-850">Verified Knowledge Partner: <span className="text-emerald-800 font-extrabold">{user?.name}</span></h3>
              <p className="text-stone-500 font-semibold">Active Role: <span className="uppercase text-emerald-700 font-bold">{userRole.replace("_", " ")}</span></p>
            </div>
          </div>
        )}

        {/* Authority Score Banner */}
        <div className="bg-gradient-to-r from-brand-dark via-stone-800 to-stone-900 rounded-2xl p-6 text-white relative overflow-hidden">
          
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">KPS Authority Score</p>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-black text-white">{authorityScore}<span className="text-2xl text-white/40">%</span></span>
                <div className="mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${authorityScore >= 70 ? "bg-green-500/20 text-green-300" : authorityScore >= 40 ? "bg-amber-500/20 text-amber-300" : "bg-red-500/20 text-red-300"}`}>
                    {authorityScore >= 70 ? "High Authority" : authorityScore >= 40 ? "Building" : "Needs Work"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-white/40 mt-1">Based on ISBN registration, SEO completeness, Knowledge Graph links, and AI optimization coverage</p>
            </div>

            {/* Mini progress bars */}
            <div className="grid grid-cols-2 gap-4 min-w-[320px]">
              {[
                { label: "ISBN Registered", val: total ? Math.round((withISBN / total) * 100) : 0, color: "bg-emerald-400" },
                { label: "SEO Optimised", val: total ? Math.round((withSEO / total) * 100) : 0, color: "bg-blue-400" },
                { label: "Knowledge Graph", val: total ? Math.round((withGraph / total) * 100) : 0, color: "bg-purple-400" },
                { label: "AI Optimised", val: total ? Math.round((withAI / total) * 100) : 0, color: "bg-amber-400" },
              ].map(m => (
                <div key={m.label}>
                  <div className="flex justify-between text-[10px] text-white/50 mb-1">
                    <span>{m.label}</span><span>{m.val}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full ${m.color} rounded-full`} style={{ width: `${m.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Knowledge Reach KPIs */}
        <div>
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
            {isContributor ? "My Reach Metrics" : "Knowledge Reach Metrics"}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: isContributor ? "My Submissions" : "Total Publications", value: total, icon: FaBook, color: "bg-stone-100 text-stone-700" },
              { label: "Published Live", value: published, icon: FaCheckCircle, color: "bg-emerald-50 text-emerald-700" },
              { label: isContributor ? "Drafts / In Review" : "Drafts in Queue", value: drafts, icon: FaFileAlt, color: "bg-amber-50 text-amber-700" },
              { label: "Knowledge Nodes", value: withGraph * 10 + published * 5, icon: FaProjectDiagram, color: "bg-purple-50 text-purple-700" },
              { label: "ISBN Registered", value: withISBN, icon: FaCertificate, color: "bg-blue-50 text-blue-700" },
              { label: "SEO Complete", value: withSEO, icon: FaSearch, color: "bg-indigo-50 text-indigo-700" },
              { label: "AI Optimised", value: withAI, icon: FaBrain, color: "bg-rose-50 text-rose-700" },
              { label: "Graph Linked", value: withGraph, icon: FaGlobe, color: "bg-teal-50 text-teal-700" },
            ].map((card, i) => (
              <div key={i} className="bg-white border border-stone-200/60 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1">{card.label}</p>
                  <h3 className="text-2xl font-black text-stone-900">{card.value}</h3>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                  <card.icon className="text-base" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Gaps + Top Performers side-by-side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Content Gaps — Intelligence Alerts */}
          <div className="bg-white border border-stone-200/60 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center gap-2">
              <FaExclamationTriangle className="text-amber-500 text-sm" />
              <h3 className="font-black text-sm text-gray-900">Content Gaps</h3>
              <span className="ml-auto text-[10px] text-gray-400">Publications missing authority layers</span>
            </div>
            <div className="divide-y divide-stone-100">
              {[
                { gap: "Missing ISBN Registration",  count: missingISBN,  action: "/dashboard/business/publications/list",            icon: FaCertificate,    color: "text-red-500",    bg: "bg-red-50" },
                { gap: "Missing SEO & AI Meta",      count: missingSEO,   action: "/dashboard/business/publications/seo-citations",   icon: FaSearch,         color: "text-orange-500", bg: "bg-orange-50" },
                { gap: "No Knowledge Graph Links",   count: missingGraph, action: "/dashboard/business/publications/knowledge-graph", icon: FaProjectDiagram, color: "text-purple-500", bg: "bg-purple-50" },
                { gap: "No AI Optimization",         count: missingAI,    action: "/dashboard/business/publications/content-studio",  icon: FaBrain,          color: "text-blue-500",   bg: "bg-blue-50" },
              ].map((item, i) => (
                <Link key={i} href={item.action} className="flex items-center gap-4 px-6 py-4 hover:bg-stone-50 transition-all group">
                  <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                    <item.icon className={`${item.color} text-sm`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800">{item.gap}</p>
                    <p className="text-[10px] text-gray-400">
                      {item.count === 0 ? "All complete ✓" : `${item.count} publication${item.count !== 1 ? "s" : ""} affected`}
                    </p>
                  </div>
                  <div className={`text-xs font-black px-2.5 py-1 rounded-full ${item.count === 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                    {item.count === 0 ? "Done" : item.count}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white border border-stone-200/60 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center gap-2">
              <FaAward className="text-amber-500 text-sm" />
              <h3 className="font-black text-sm text-gray-900">{isContributor ? "My Top Contributions" : "Top Performers"}</h3>
            </div>
            <div className="divide-y divide-stone-100">
              <div className="px-6 py-4 flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 text-xs font-black text-amber-700">P</div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Top Craft Sector</p>
                  <p className="text-sm font-bold text-gray-900">{topCraft}</p>
                  <p className="text-[10px] text-gray-400">{craftCounts[topCraft] || 0} publication{craftCounts[topCraft] !== 1 ? "s" : ""} covering this craft</p>
                </div>
              </div>
              {displayPublications.slice(0, 3).map((pub, i) => (
                <div key={i} className="px-6 py-4 flex items-start gap-4">
                  <div className="w-8 h-12 bg-stone-100 rounded border border-stone-200 overflow-hidden shrink-0">
                    {pub.imagePath ? <img src={pub.imagePath} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><FaBook className="text-stone-300" size={10} /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 line-clamp-1">{pub.title}</p>
                    <p className="text-[10px] text-gray-400">{pub.author} · {str(pub.category, "Research")}</p>
                    <div className="flex gap-1 mt-1">
                      {pub.isbn && <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded">ISBN ✓</span>}
                      {pub.seoTitle && <span className="bg-blue-50 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded">SEO ✓</span>}
                      {pub.linkedCrafts && <span className="bg-purple-50 text-purple-700 text-[9px] font-bold px-1.5 py-0.5 rounded">Graph ✓</span>}
                    </div>
                  </div>
                </div>
              ))}
              {displayPublications.length === 0 && (
                <div className="px-6 py-8 text-center text-gray-400 text-xs italic">No publications yet. Create your first knowledge asset.</div>
              )}
            </div>
          </div>
        </div>

        {/* KPS Module Quick Access Grid */}
        <div>
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
            {isContributor ? "Contributor Dashboard Modules" : "KPS Control Modules"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 font-bold text-stone-700">
            {visibleModules.map((mod, i) => (
              <Link key={i} href={mod.href}
                className="bg-white border border-stone-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group flex flex-col gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${mod.color}`}>
                  <mod.icon className="text-sm" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-900 group-hover:text-brand-primary transition-colors">{mod.label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{mod.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent publications table */}
        {displayPublications.length > 0 && (
          <div className="bg-white border border-stone-200/60 rounded-2xl shadow-sm overflow-hidden font-medium">
            <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
              <h3 className="font-bold text-sm text-gray-900">{isContributor ? "My Submissions" : "Recent Knowledge Assets"}</h3>
              <Link href="/dashboard/business/publications/list" className="text-xs font-bold text-icon-on-light uppercase tracking-wider hover:underline flex items-center gap-1">
                View All <FaArrowRight size={10} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200/50">
                  <tr>
                    {["Title & Author", "Craft / Domain", "Access", "ISBN", "SEO", "Graph", "Status"].map(h => (
                      <th key={h} className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {displayPublications.slice(0, 6).map(pub => (
                    <tr key={pub.id} className="hover:bg-stone-50/40 transition-colors">
                      <td className="px-6 py-3.5">
                        <p className="text-xs font-bold text-gray-900 line-clamp-1">{pub.title}</p>
                        <p className="text-[10px] text-gray-400">{pub.author || "KHCRF Press"}</p>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded">{str(pub.craftSector, "Multi")}</span>
                        <span className="block text-[9px] text-gray-400 mt-0.5">{str(pub.domain, "—")}</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${str(pub.accessType) === "PREMIUM" ? "bg-rose-50 text-rose-700" : str(pub.accessType) === "MEMBER" ? "bg-indigo-50 text-indigo-700" : "bg-emerald-50 text-emerald-700"}`}>
                          {str(pub.accessType, "OPEN")}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        {pub.isbn ? <FaCheckCircle className="text-emerald-500" size={12} /> : <span className="text-[9px] text-gray-300">—</span>}
                      </td>
                      <td className="px-6 py-3.5">
                        {(pub.seoTitle || pub.seoDescription) ? <FaCheckCircle className="text-emerald-500" size={12} /> : <span className="text-[9px] text-gray-300">—</span>}
                      </td>
                      <td className="px-6 py-3.5">
                        {pub.linkedCrafts ? <FaCheckCircle className="text-emerald-500" size={12} /> : <span className="text-[9px] text-gray-300">—</span>}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${str(pub.publishedStatus) === "PUBLISHED" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                          {str(pub.publishedStatus, "DRAFT")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
