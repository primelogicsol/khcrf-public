"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  FaProjectDiagram, FaArrowLeft, FaBook, FaSpinner, FaLink, FaShieldAlt,
  FaCertificate, FaFileAlt, FaGlobe, FaCheck, FaTimes, FaSearch,
  FaLayerGroup, FaBrain, FaExclamationTriangle, FaExternalLinkAlt,
  FaChartBar, FaPlus,
} from "react-icons/fa";

interface Publication {
  id: string;
  title: string;
  author: string;
  imagePath?: string;
  craftSector?: string;
  linkedCrafts?: string;
  linkedPolicies?: string;
  linkedGIs?: string;
  linkedPapers?: string;
  linkedCaseStudies?: string;
  linkedBestPractices?: string;
  linkedLegislativeWork?: string;
  linkedClusters?: string;
  linkedExportMarkets?: string;
  linkedAuthentications?: string;
  publishedStatus?: string;
  slug?: string;
}

const NODE_FIELDS = [
  { key: "linkedCrafts",         label: "Craft & Material Links",    icon: FaShieldAlt,    color: "amber",   desc: "Pashmina, Kani, Sozni…" },
  { key: "linkedPolicies",       label: "Policy & Standards",         icon: FaFileAlt,      color: "indigo",  desc: "GI Act, Handicrafts Act…" },
  { key: "linkedGIs",            label: "GI Registrations",           icon: FaCertificate,  color: "blue",    desc: "Kashmir Pashmina GI #…" },
  { key: "linkedPapers",         label: "Related Publications",       icon: FaBook,         color: "rose",    desc: "Linked research papers" },
  { key: "linkedCaseStudies",    label: "Case Studies",               icon: FaLayerGroup,   color: "teal",    desc: "Linked case studies" },
  { key: "linkedBestPractices",  label: "Best Practices",             icon: FaCheck,        color: "green",   desc: "Standards documents" },
  { key: "linkedLegislativeWork",label: "Legislative Documents",      icon: FaFileAlt,      color: "purple",  desc: "Bills, orders, notifications" },
  { key: "linkedClusters",       label: "Artisan Cluster Nodes",      icon: FaGlobe,        color: "cyan",    desc: "Kanihama, Srinagar Old Town…" },
  { key: "linkedExportMarkets",  label: "Export Market Nodes",        icon: FaChartBar,     color: "orange",  desc: "EU, North America, Japan…" },
  { key: "linkedAuthentications",label: "Authentication Records",     icon: FaBrain,        color: "pink",    desc: "Certification links" },
];

const colorMap: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  amber:  { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-400" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", dot: "bg-indigo-400" },
  blue:   { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   dot: "bg-blue-400" },
  rose:   { bg: "bg-rose-50",   text: "text-rose-700",   border: "border-rose-200",   dot: "bg-rose-400" },
  teal:   { bg: "bg-teal-50",   text: "text-teal-700",   border: "border-teal-200",   dot: "bg-teal-400" },
  green:  { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200",  dot: "bg-green-400" },
  purple: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-400" },
  cyan:   { bg: "bg-cyan-50",   text: "text-cyan-700",   border: "border-cyan-200",   dot: "bg-cyan-400" },
  orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-400" },
  pink:   { bg: "bg-pink-50",   text: "text-pink-700",   border: "border-pink-200",   dot: "bg-pink-400" },
};

function countLinks(pub: Publication): number {
  return NODE_FIELDS.filter(f => !!(pub as any)[f.key]).length;
}

export default function KnowledgeGraphPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Publication | null>(null);
  const [filterMissing, setFilterMissing] = useState(false);

  useEffect(() => {
    api.get("/publications")
      .then(r => {
        const payload = r.data?.data ?? r.data;
        setPublications(Array.isArray(payload) ? payload : []);
      })
      .catch(() => setPublications([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = publications.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchMissing = filterMissing ? countLinks(p) < NODE_FIELDS.length : true;
    return matchSearch && matchMissing;
  });

  // Global graph stats
  const totalLinks = publications.reduce((acc, p) => acc + countLinks(p), 0);
  const maxPossible = publications.length * NODE_FIELDS.length;
  const graphCoverage = maxPossible > 0 ? Math.round((totalLinks / maxPossible) * 100) : 0;

  return (
    <div className="min-h-screen bg-stone-50/40">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/business/publications" className="p-2 text-stone-400 hover:text-brand-primary hover:bg-stone-50 rounded-xl transition-all">
              <FaArrowLeft size={13} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-purple-600/10 rounded-lg flex items-center justify-center">
                  <FaProjectDiagram className="text-purple-600" size={11} />
                </div>
                <h1 className="text-lg font-black text-gray-900 tracking-tight">Knowledge Graph</h1>
              </div>
              <p className="text-[11px] text-gray-400 ml-9">Cross-reference map of crafts, GI records, policies, and publications</p>
            </div>
          </div>
          <Link
            href="/dashboard/business/publications/add"
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-purple-700 shadow-lg shadow-purple-600/20 transition-all"
          >
            <FaPlus size={11} /> Add Publication
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 space-y-8">

        {/* Stats banner */}
        <div className="bg-gradient-to-r from-purple-700 via-purple-800 to-stone-900 rounded-2xl p-6 text-white relative overflow-hidden">
          
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Knowledge Graph Coverage</p>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-black">{graphCoverage}<span className="text-2xl text-white/40">%</span></span>
                <div className="mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${graphCoverage >= 70 ? "bg-green-500/20 text-green-300" : graphCoverage >= 40 ? "bg-amber-500/20 text-amber-300" : "bg-red-500/20 text-red-300"}`}>
                    {graphCoverage >= 70 ? "Strong Network" : graphCoverage >= 40 ? "Building" : "Needs Links"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-white/40 mt-1">{totalLinks} of {maxPossible} possible knowledge links established</p>
            </div>
            <div className="grid grid-cols-2 gap-3 min-w-[240px]">
              {[
                { label: "Publications", val: publications.length },
                { label: "Total Links", val: totalLinks },
                { label: "Node Types", val: NODE_FIELDS.length },
                { label: "Fully Linked", val: publications.filter(p => countLinks(p) >= NODE_FIELDS.length).length },
              ].map(s => (
                <div key={s.label} className="bg-white/10 rounded-xl p-3">
                  <p className="text-[10px] text-white/50 font-bold">{s.label}</p>
                  <p className="text-xl font-black">{s.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Node type coverage */}
        <div>
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Node Coverage by Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {NODE_FIELDS.map(field => {
              const c = colorMap[field.color] || colorMap.amber;
              const Icon = field.icon;
              const covered = publications.filter(p => !!(p as any)[field.key]).length;
              const pct = publications.length > 0 ? Math.round((covered / publications.length) * 100) : 0;
              return (
                <div key={field.key} className={`bg-white border ${c.border} rounded-2xl p-4 shadow-sm`}>
                  <div className={`w-8 h-8 ${c.bg} rounded-xl flex items-center justify-center mb-2`}>
                    <Icon className={c.text} size={13} />
                  </div>
                  <p className="text-[10px] font-black text-gray-700 leading-tight mb-1">{field.label}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black ${c.text}`}>{pct}%</span>
                    <span className="text-[9px] text-gray-400">{covered}/{publications.length}</span>
                  </div>
                  <div className="h-1 bg-stone-100 rounded-full mt-2 overflow-hidden">
                    <div className={`h-full ${c.dot} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Publication graph table */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Publication Link Map</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={11} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search publications..."
                  className="pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-purple-400 transition-all"
                />
              </div>
              <button
                onClick={() => setFilterMissing(v => !v)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  filterMissing ? "bg-amber-50 border-amber-300 text-amber-700" : "bg-white border-stone-200 text-gray-600"
                }`}
              >
                <FaExclamationTriangle size={10} />
                Incomplete only
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <FaSpinner className="animate-spin text-3xl text-purple-600" />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider min-w-[200px]">Publication</th>
                      <th className="px-3 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider text-center">Links</th>
                      {NODE_FIELDS.map(f => (
                        <th key={f.key} className="px-3 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider text-center whitespace-nowrap">
                          {f.label.split(" ")[0]}
                        </th>
                      ))}
                      <th className="px-3 py-3 text-right text-[10px] font-black text-gray-400 uppercase tracking-wider">Edit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filtered.map(pub => {
                      const linkCount = countLinks(pub);
                      return (
                        <tr key={pub.id} className="hover:bg-stone-50/50 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-9 bg-stone-100 rounded border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center">
                                {pub.imagePath
                                  ? <img src={pub.imagePath} alt="" className="w-full h-full object-cover" />
                                  : <FaBook className="text-stone-300" size={10} />
                                }
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 line-clamp-1">{pub.title}</p>
                                <p className="text-[10px] text-gray-400">{(typeof pub.craftSector === "object" ? (pub.craftSector as any)?.name : pub.craftSector) || "Multi-Craft"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                              linkCount >= 8 ? "bg-green-100 text-green-700" :
                              linkCount >= 4 ? "bg-amber-100 text-amber-700" :
                              "bg-red-100 text-red-700"
                            }`}>
                              {linkCount}/{NODE_FIELDS.length}
                            </span>
                          </td>
                          {NODE_FIELDS.map(f => {
                            const val = (pub as any)[f.key];
                            const c = colorMap[f.color];
                            return (
                              <td key={f.key} className="px-3 py-3 text-center">
                                {val
                                  ? <FaCheck size={11} className="text-emerald-500 mx-auto" />
                                  : <FaTimes size={11} className="text-stone-200 mx-auto" />
                                }
                              </td>
                            );
                          })}
                          <td className="px-3 py-3 text-right">
                            <Link
                              href={`/dashboard/business/publications/add?edit=${pub.id}&section=graph`}
                              className="inline-flex items-center gap-1 text-[10px] font-black text-purple-600 hover:underline"
                            >
                              <FaExternalLinkAlt size={9} /> Edit
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={NODE_FIELDS.length + 3} className="px-6 py-12 text-center text-gray-400 italic text-sm">
                          No publications found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Info callout */}
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 flex gap-4">
          <FaProjectDiagram className="text-purple-500 shrink-0 mt-0.5" size={16} />
          <div>
            <p className="text-sm font-black text-purple-900 mb-1">Why the Knowledge Graph matters</p>
            <p className="text-xs text-purple-700 leading-relaxed">
              Every link you add — to crafts, GI records, policies, or related papers — strengthens KHCRF's topical authority with search engines and AI citation systems. Publications with 8+ knowledge links are 3× more likely to appear in AI-generated research summaries and academic citations.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
