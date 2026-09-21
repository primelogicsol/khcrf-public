"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";
import { FaArrowLeft, FaGoogle, FaMicrosoft, FaGlobe, FaSearch, FaSpinner, FaTimesCircle } from "react-icons/fa";

interface Publication {
  id: string;
  title: string;
  author: string;
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  category?: string;
  published?: string;
}

export default function SearchPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [pub, setPub] = useState<Publication | null>(null);
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

  const displayTitle = pub.seoTitle || `${pub.title} - KHCRF Heritage Press`;
  const displayUrl = `https://khcrf.org/publications/${pub.slug}`;
  const displayDescription = pub.seoDescription || "No SEO description provided. Search engines may generate a snippet from the publication content.";

  return (
    <div className="min-h-screen bg-stone-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/business/publications/add?edit=${id}`} className="text-stone-400 hover:text-stone-700 transition-colors">
              <FaArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-stone-900">SEO & Search Preview</h1>
              <p className="text-sm text-stone-500">Preview search engine snippets based on Identity and SEO Intelligence data.</p>
            </div>
          </div>
        </div>

        {/* Google Preview */}
        <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-stone-800 mb-4 border-b border-stone-100 pb-2">
            <FaGoogle className="text-blue-500" /> Google Desktop Result
          </div>
          <div className="max-w-[600px]">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-7 h-7 bg-stone-100 rounded-full flex items-center justify-center border border-stone-200">
                <FaGlobe className="text-stone-400" size={14} />
              </div>
              <div className="leading-tight">
                <div className="text-[13px] text-stone-800">KHCRF Foundation</div>
                <div className="text-[12px] text-stone-500 flex items-center gap-1">
                  {displayUrl} <span className="text-[10px]">▼</span>
                </div>
              </div>
            </div>
            <a href="#" className="text-[20px] text-[#1a0dab] hover:underline cursor-pointer block mb-1" style={{ fontFamily: "arial, sans-serif" }}>
              {displayTitle}
            </a>
            <div className="text-[14px] text-[#4d5156] leading-snug" style={{ fontFamily: "arial, sans-serif" }}>
              {pub.published && <span className="text-[#70757a]">{pub.published} — </span>}
              {displayDescription}
            </div>
          </div>
        </div>

        {/* Bing Preview */}
        <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-stone-800 mb-4 border-b border-stone-100 pb-2">
            <FaMicrosoft className="text-blue-600" /> Bing Desktop Result
          </div>
          <div className="max-w-[600px]">
            <div className="text-[13px] text-[#006621] mb-0.5" style={{ fontFamily: "Segoe UI, Arial, sans-serif" }}>
              {displayUrl}
            </div>
            <a href="#" className="text-[18px] text-[#001ba0] hover:underline cursor-pointer font-semibold block mb-1" style={{ fontFamily: "Segoe UI, Arial, sans-serif" }}>
              {displayTitle}
            </a>
            <div className="text-[13px] text-[#444] leading-relaxed" style={{ fontFamily: "Segoe UI, Arial, sans-serif" }}>
              {displayDescription}
            </div>
          </div>
        </div>

        {/* Catalog Preview */}
        <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-stone-800 mb-4 border-b border-stone-100 pb-2">
            <FaSearch className="text-teal-600" /> Internal Catalog Result
          </div>
          <div className="flex gap-4 p-4 border border-stone-100 rounded-xl bg-stone-50/50 hover:bg-stone-50 transition-colors">
            <div className="w-16 h-20 bg-stone-200 rounded-md shrink-0 flex items-center justify-center border border-stone-300">
              <span className="text-[8px] font-bold text-stone-400 uppercase">Cover</span>
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-[10px] font-black uppercase text-teal-600 tracking-wider mb-1">
                {(typeof pub.category === "object" ? (pub.category as any)?.name : pub.category) || "Publication"}
              </div>
              <h3 className="text-sm font-bold text-stone-900 mb-1">{pub.title}</h3>
              <p className="text-xs text-stone-500 line-clamp-2">By {pub.author}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
