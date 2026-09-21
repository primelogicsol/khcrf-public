"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import Link from "next/link";
import {
  FaArrowLeft,
  FaChartLine,
  FaEye,
  FaBookOpen,
  FaBookmark,
  FaQuoteRight,
  FaProjectDiagram,
  FaSearch,
  FaExternalLinkAlt,
} from "react-icons/fa";

export default function AnalyticsPage() {
  const [activeRange, setActiveRange] = useState("30d");

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/publications/stats')
      .then(res => {
        setStats(res);
      })
      .catch(err => console.error("Error fetching publication stats:", err))
      .finally(() => setLoading(false));
  }, []);

  // TODO: Replace referringSources with real data from a backend endpoint (e.g., /analytics/referring-sources)
  const referringSources = [
    { name: "Google Academic / Scholar", percentage: 42, count: 624 },
    { name: "Gemini / Google Search AI", percentage: 24, count: 356 },
    { name: "Direct Library Hub", percentage: 18, count: 267 },
    { name: "Perplexity Answers", percentage: 11, count: 163 },
    { name: "OpenAI ChatGPT Search", percentage: 5, count: 74 },
  ];

  // TODO: Replace searchQueries with real data from a backend endpoint (e.g., /analytics/search-queries)
  const searchQueries = [
    { query: "Kashmir Pashmina GI certification guidelines", clicks: 312 },
    { query: "Kani loom weaving economic wage index", clicks: 184 },
    { query: "How to authenticate handloom carpets", clicks: 142 },
    { query: "Kashmir craft export policy tariffs 2026", clicks: 98 },
  ];

  // TODO: Replace chapterEngagement with real data from a backend endpoint (e.g., /analytics/chapter-engagement)
  const chapterEngagement = [
    { ch: "Chapter 3: Economic Compensation Indexing", time: "18m 42s", completion: "92%" },
    { ch: "Chapter 1: Executive Summary & Scope", time: "8m 10s", completion: "96%" },
    { ch: "Chapter 5: Digital Ledger Traceability", time: "14m 55s", completion: "84%" },
    { ch: "Chapter 4: Export Compliance & Logistics", time: "11m 30s", completion: "78%" },
  ];

  if (loading) return <div className="p-8">Loading analytics...</div>;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/business/publications"
            className="p-2 text-stone-500 hover:bg-stone-50 rounded-xl transition-all"
          >
            <FaArrowLeft />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">KPS Analytics & Reach Metrics</h1>
            <p className="text-stone-500 text-sm">Track reader engagement, citation exports, and search referring parameters.</p>
          </div>
        </div>

        {/* Date Filter selector */}
        <div className="flex bg-stone-100 p-1 rounded-xl">
          {["7d", "30d", "90d"].map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase ${
                activeRange === range ? "bg-white text-brand-primary shadow-sm" : "text-stone-500 hover:text-stone-850"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Upgraded core metrics grids */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 block uppercase mb-1">Total Publications</span>
            <span className="text-2xl font-black text-stone-850">{stats?.totalPublications || 0}</span>
            <span className="text-[10px] text-green-650 block mt-1">Live in registry</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl">
            <FaEye size={18} />
          </div>
        </div>

        <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 block uppercase mb-1">Total Categories</span>
            <span className="text-2xl font-black text-stone-850">{stats?.totalCategories || 0}</span>
            <span className="text-[10px] text-stone-500 block mt-1">Across all publications</span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl">
            <FaBookOpen size={16} />
          </div>
        </div>

        <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 block uppercase mb-1">Total Revenue</span>
            <span className="text-2xl font-black text-stone-850">${stats?.totalRevenue?.toLocaleString() || 0}</span>
            <span className="text-[10px] text-brand-primary block mt-1">From user purchases</span>
          </div>
          <div className="p-3 bg-purple-50 text-purple-700 border border-purple-100 rounded-xl">
            <FaChartLine size={18} />
          </div>
        </div>

        <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 block uppercase mb-1">Recent Activity</span>
            <span className="text-2xl font-black text-stone-850">{stats?.recentPublications?.length || 0}</span>
            <span className="text-[10px] text-stone-500 block mt-1">Newly added pubs</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-700 border border-amber-100 rounded-xl">
            <FaBookmark size={16} />
          </div>
        </div>
      </div>

      {/* Grid: Referring Sources & Search queries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Referring sources visual barchart */}
        <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-stone-850 border-b border-stone-100 pb-3">
            Top Referring AI & Search Sources
          </h3>
          <div className="space-y-3">
            {referringSources.map((src, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-stone-800">
                  <span>{src.name}</span>
                  <span>{src.count} ({src.percentage}%)</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2">
                  <div
                    className="bg-brand-primary h-2 rounded-full"
                    style={{ width: `${src.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top search queries list */}
        <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-stone-850 border-b border-stone-100 pb-3 flex items-center gap-2">
            <FaSearch data-ui-icon  size={14} className="" /> Top Referring Search Queries
          </h3>
          <div className="divide-y divide-stone-100">
            {searchQueries.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0">
                <span className="text-xs font-serif text-stone-700 italic select-all">
                  &ldquo;{item.query}&rdquo;
                </span>
                <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-md">
                  {item.clicks} clicks
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Chapter level engagement table */}
      <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-stone-850 border-b border-stone-100 pb-3">
          Chapter-Specific Reader Engagement
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-655">
            <thead className="bg-stone-50 border-b border-stone-200/50">
              <tr>
                <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Chapter name</th>
                <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Avg reading duration</th>
                <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Completion rate (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {chapterEngagement.map((item, idx) => (
                <tr key={idx} className="hover:bg-stone-50/20 transition-all">
                  <td className="px-6 py-3.5 text-xs font-bold text-stone-850 flex items-center gap-2">
                    <FaBookOpen className="text-stone-300" size={12} />
                    {item.ch}
                  </td>
                  <td className="px-6 py-3.5 text-xs font-semibold text-stone-800">{item.time}</td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-stone-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-1.5" style={{ width: item.completion }}></div>
                      </div>
                      <span className="text-xs font-black text-stone-750">{item.completion}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}



