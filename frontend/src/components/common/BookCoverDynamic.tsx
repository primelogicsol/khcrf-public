"use client";

import { useMemo } from "react";

export interface BookCoverDynamicProps {
  title?: string;
  subtitle?: string;
  author?: string;
  category?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  isbn?: string;
  isbnStatus?: string;
  edition?: string;
  publisher?: string;
  summaryPoints?: string[];
}

// 1. Universal Content Configuration
const getUniversalConfig = (category: string) => {
  const cat = (category || "").toLowerCase();

  let series = "E-PUBLICATIONS SERIES";
  let pubType = "FOUNDATIONAL REFERENCE WORK";

  if (cat.includes("best practice")) {
    series = "BEST PRACTICES SERIES";
    pubType = "OPERATIONAL STANDARDS NOTE";
  } else if (cat.includes("case study") || cat.includes("case studies")) {
    series = "CASE STUDY ARCHIVE";
    pubType = "FIELD RESEARCH EVIDENCE";
  } else if (cat.includes("research paper") || cat.includes("research papers")) {
    series = "RESEARCH PAPER SERIES";
    pubType = "ACADEMIC & SCIENTIFIC INQUIRY";
  } else if (cat.includes("policy brief") || cat.includes("policy briefs")) {
    series = "POLICY BRIEF SERIES";
    pubType = "EXECUTIVE POLICY ADVISORY";
  } else if (cat.includes("market intelligence")) {
    series = "MARKET INTELLIGENCE SERIES";
    pubType = "EXECUTIVE ANALYSIS REPORT";
  }

  return {
    bg: "bg-[#0A1833]", // Strongest Background combination for KHCRF
    textPrimary: "text-[#F5F2EC]", // Primary Text: #F5F2EC
    textSecondary: "text-[#8B4B1F]", // KHCRF Brown: #8B4B1F
    divider: "bg-[#8B4B1F]/30",
    accentBorder: "border-[#1A2D52]", // Borders: #1A2D52
    series,
    pubType,
  };
};

export default function BookCoverDynamic({
  title = "Untitled",
  subtitle = "",
  author = "KHCRF Editorial Board",
  category = "E-Publications",
  size = "md",
  isbn = null,
  isbnStatus = "Registered",
  edition = "2026 Edition",
  publisher = "KHCRF Heritage Press",
  summaryPoints,
}: BookCoverDynamicProps) {
  const style = useMemo(() => getUniversalConfig(category), [category]);

  const safeTitle = title || "Untitled";
  const titleLength = safeTitle.length;
  const titleSizeClass = useMemo(() => {
    if (titleLength > 60) return "text-[1.3em]";
    if (titleLength > 40) return "text-[1.55em]";
    if (titleLength > 20) return "text-[1.85em]";
    return "text-[2.25em]";
  }, [titleLength]);

  const subtitleColor = useMemo(() => {
    const isDarkBg =
      style.bg.includes("navy") ||
      style.bg.includes("burgundy") ||
      style.bg.includes("0A1833") ||
      style.bg.includes("450a0f");
    return isDarkBg ? "text-gray-300" : "text-[#472c1c]/80";
  }, [style.bg]);

  const volumeLabel = useMemo(() => {
    const t = safeTitle.toLowerCase();
    if (t.includes("encyclopedia")) return "Reference Edition | Vol. I";
    if (t.includes("handbook")) return "Technical Standard | Vol. II";
    if (t.includes("atlas")) return "Cartographical Edition | Vol. III";
    return "Official Issue | Vol. IV";
  }, [safeTitle]);



  return (
    <div
      className={`relative w-full h-full ${style.bg} border border-black/5 transition-all duration-300 select-none flex flex-col font-sans`}
      style={{ backgroundColor: "#0A1833" }}
    >
      {/* Universal Protected Grid Box - Perfect structured spacing */}
      <div
        className={`absolute inset-[0.85em] border ${style.accentBorder} rounded-sm p-[1.1em] pb-[1.4em] flex flex-col justify-between z-10`}
      >
        {/* 1. TOP ZONE: Institution Identity (20%) */}
        <div className="flex flex-col items-center text-center pb-[0.5em] shrink-0">
          {/* KHCRF Logo Image */}
          <div className="mb-[0.4em] transform hover:scale-[1.05] transition-transform duration-300 shrink-0">
            <img src="/assets/images/HCRF_LOGO_1.png" alt="KHCRF Logo" className="w-[3.7em] h-[3.7em] object-contain" />
          </div>
          {/* KHCRF Identity Authority */}
          <span className={`text-[0.54em] font-extrabold tracking-[0.25em] uppercase leading-tight ${style.textPrimary}`}>
            Hamadan Craft Revival Foundation
          </span>
          <span className={`text-[0.62em] font-black tracking-[0.2em] uppercase mt-[0.3em] ${style.textSecondary}`}>
            {style.series}
          </span>
        </div>

        {/* Divider 1 */}
        <div className={`h-[1px] w-full ${style.divider} shrink-0`} />

        {/* 2. UPPER MIDDLE: Publication Identity (30%) */}
        <div className="flex flex-col justify-start pt-[0.4em] pb-[0.2em] text-center max-w-full overflow-hidden shrink-0">
          <span className={`text-[0.58em] font-black tracking-[0.15em] uppercase mb-[0.25em] ${style.textSecondary}`}>
            {style.pubType}
          </span>
          <span className={`text-[0.54em] font-bold uppercase tracking-[0.2em] mb-[0.5em] ${style.textSecondary}`}>
            {volumeLabel}
          </span>
          <h2 className={`font-serif font-black tracking-tight leading-[1.1] text-balance ${style.textPrimary} ${titleSizeClass}`}>
            {safeTitle}
          </h2>
          {subtitle && (
            <p className={`text-[0.7em] leading-[1.3] mt-[0.4em] font-medium italic max-w-[90%] mx-auto line-clamp-2 ${subtitleColor}`}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Center spacing spacer to keep title/subtitle optically centered with clean breathing space */}
        <div className="grow" />

        {/* Divider 2 */}
        <div className={`h-[1px] w-full ${style.divider} shrink-0 mb-[0.4em]`} />

        {/* 4. FOOTER: Publishing Metadata (20%) */}
        <div className="flex flex-col items-start text-left shrink-0 w-full pt-[0.2em]">
          <div className="flex justify-between items-center w-full mb-[0.2em]">
            <span className={`text-[0.54em] font-extrabold tracking-wider uppercase ${style.textPrimary}`}>
              by {author}
            </span>
            <span className="text-[0.42em] font-bold tracking-[0.08em] uppercase text-gray-400">
              Est. 2026
            </span>
          </div>
          
          <div className={`h-[1px] w-full ${style.divider} shrink-0 mb-[0.4em]`} />
          
          <div className="flex justify-between items-end w-full gap-2">
            <div className="flex flex-col items-start gap-[0.1em] font-sans">
              <span className={`text-[0.52em] font-black tracking-[0.1em] uppercase leading-tight ${style.textSecondary}`}>
                KHCRF Heritage Press
              </span>
              <span className="text-[0.42em] font-bold tracking-[0.05em] uppercase text-gray-400">
                Hamadan Craft Revival Foundation
              </span>
              
              <div className="flex items-center gap-[0.3em] mt-[0.25em]">
                {/* Barcode representation */}
                <svg className={`w-[2.4em] h-[1em] opacity-85 ${style.textSecondary}`} viewBox="0 0 40 20" fill="currentColor">
                  <rect x="0" y="0" width="2" height="20" />
                  <rect x="3" y="0" width="1" height="20" />
                  <rect x="5" y="0" width="3" height="20" />
                  <rect x="9" y="0" width="1" height="20" />
                  <rect x="11" y="0" width="2" height="20" />
                  <rect x="14" y="0" width="1" height="20" />
                  <rect x="16" y="0" width="4" height="20" />
                  <rect x="21" y="0" width="2" height="20" />
                  <rect x="24" y="0" width="1" height="20" />
                  <rect x="26" y="0" width="3" height="20" />
                  <rect x="30" y="0" width="1" height="20" />
                  <rect x="32" y="0" width="2" height="20" />
                  <rect x="35" y="0" width="1" height="20" />
                  <rect x="37" y="0" width="3" height="20" />
                </svg>
                <span className={`text-[0.45em] font-mono tracking-tight ${style.textSecondary}`}>{isbn}</span>
              </div>
            </div>
            
            <div className={`text-right text-[0.45em] font-mono leading-tight shrink-0 ${style.textSecondary}`}>
              <span className="block font-black uppercase tracking-wider">{edition}</span>
              <span className="block text-[0.85em] uppercase">ISBN Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Spine Shadow */}
      <div className="absolute inset-y-0 left-0 w-[0.35em] bg-black/10 z-20 pointer-events-none" />

      {/* Linen Paper Texture Overlay */}
      <div className="absolute inset-0 bg-linear-to-tr from-black/5 via-transparent to-white/5 opacity-40 mix-blend-overlay pointer-events-none" />
    </div>
  );
}
