"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaCogs, FaBookOpen, FaDownload, FaLink, FaListUl, FaCheckCircle, FaExclamationCircle,
  FaFilePdf, FaFileWord, FaMobileAlt, FaEye, FaQuoteRight, FaGlobe, FaLock, FaCheck
} from "react-icons/fa";

export interface ReaderEngineData {
  readerTheme: string;
  defaultFont: string;
  readerWidth: string;
  readerMode: string;
  citationFormat: string;
  showCitationPanel: boolean;
  showChapterCitations: boolean;
  showBibliography: boolean;
  knowledgeLinksEnabled: boolean;
  knowledgeLinkTypes: string[];
  knowledgeLinkStyle: string;
  footnoteMode: string;
  mobileFootnoteDrawer: boolean;
  downloadsEnabled: string[];
  accessLevel: string;
  navTOC: boolean;
  navProgress: boolean;
  navSearch: boolean;
  navBookmark: boolean;
  qualityChecks: {
    tocGenerated: boolean;
    chaptersRender: boolean;
    referencesRender: boolean;
  };
  readerEnabled?: boolean;
  readerPath?: string;
}

interface ReaderExperienceEngineProps {
  publicationId: string;
  publicationBlueprint: string;
  currentData?: Partial<ReaderEngineData>;
  onApply: (data: ReaderEngineData) => void;
  onPreview: () => void;
}

export default function ReaderExperienceEngine({ publicationId, publicationBlueprint, currentData, onApply, onPreview }: ReaderExperienceEngineProps) {
  
  const defaultMode = publicationBlueprint === "Best Practices" ? "Book Reader" :
                      publicationBlueprint === "Case Studies" ? "Case Study Reader" :
                      publicationBlueprint === "Research Papers" ? "Research Reader" :
                      publicationBlueprint === "Policy Briefs" ? "Policy Reader" :
                      publicationBlueprint === "Market Intelligence" ? "Report Reader" : "Book Reader";

  const [data, setData] = useState<ReaderEngineData>({
    readerTheme: currentData?.readerTheme || "Warm Parchment",
    defaultFont: currentData?.defaultFont || "Merriweather",
    readerWidth: currentData?.readerWidth || "820px",
    readerMode: currentData?.readerMode || defaultMode,
    citationFormat: currentData?.citationFormat || "KHCRF Standard Citation",
    showCitationPanel: currentData?.showCitationPanel ?? true,
    showChapterCitations: currentData?.showChapterCitations ?? true,
    showBibliography: currentData?.showBibliography ?? true,
    knowledgeLinksEnabled: currentData?.knowledgeLinksEnabled ?? true,
    knowledgeLinkTypes: currentData?.knowledgeLinkTypes || ["Craft Terms", "Policy Terms", "GI Registrations"],
    knowledgeLinkStyle: currentData?.knowledgeLinkStyle || "Popover Cards",
    footnoteMode: currentData?.footnoteMode || "Right Sidebar",
    mobileFootnoteDrawer: currentData?.mobileFootnoteDrawer ?? true,
    downloadsEnabled: currentData?.downloadsEnabled || ["PDF", "EPUB", "Citation Export"],
    accessLevel: currentData?.accessLevel || "Public",
    navTOC: currentData?.navTOC ?? true,
    navProgress: currentData?.navProgress ?? true,
    navSearch: currentData?.navSearch ?? true,
    navBookmark: currentData?.navBookmark ?? true,
    qualityChecks: currentData?.qualityChecks || { tocGenerated: true, chaptersRender: true, referencesRender: true },
    readerEnabled: currentData?.readerEnabled ?? true,
    readerPath: currentData?.readerPath || `/publications/read/[slug]`,
  });

  const handleChange = (field: keyof ReaderEngineData, value: any) => {
    const next = { ...data, [field]: value };
    setData(next);
    onApply(next);
  };

  const toggleArrayItem = (field: keyof ReaderEngineData, item: string) => {
    const arr = data[field] as string[];
    const nextArr = arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
    handleChange(field, nextArr);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <FaCogs className="text-gray-300" /> Reader Experience Engine
          </h3>
          <p className="text-[10px] text-gray-400 mt-1">Configure layout, typography, navigation, and access governance for the public reader.</p>
        </div>
        <button type="button" onClick={onPreview} className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-lg shadow-md hover:bg-brand-primary/90 transition-all">
          <FaEye size={12} /> Preview Full Reader
        </button>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Layout & Typography */}
        <div>
          <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
            <FaBookOpen data-ui-icon  className="" /> Display & Typography
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">Reader Mode</label>
              <select value={data.readerMode} onChange={e => handleChange("readerMode", e.target.value)} className="w-full p-2 border border-stone-200 rounded-lg text-xs bg-stone-50">
                {["Book Reader", "Case Study Reader", "Research Reader", "Policy Reader", "Report Reader"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">Theme Preset</label>
              <select value={data.readerTheme} onChange={e => handleChange("readerTheme", e.target.value)} className="w-full p-2 border border-stone-200 rounded-lg text-xs bg-stone-50">
                {["Warm Parchment", "Clean White", "Scholarly Dark", "Policy Minimal", "Market Report", "Heritage Sepia"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">Typography</label>
              <select value={data.defaultFont} onChange={e => handleChange("defaultFont", e.target.value)} className="w-full p-2 border border-stone-200 rounded-lg text-xs bg-stone-50">
                {["IBM Plex Serif", "Merriweather", "Lora", "Georgia", "Inter", "Source Serif"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">Max Width</label>
              <select value={data.readerWidth} onChange={e => handleChange("readerWidth", e.target.value)} className="w-full p-2 border border-stone-200 rounded-lg text-xs bg-stone-50">
                {["720px", "820px", "960px", "Full Report Width"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-100"></div>

        {/* Citation & Knowledge Graph */}
        <div>
          <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
            <FaLink className="text-emerald-600" /> References & Knowledge Graph
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Citations */}
            <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                 <label className="text-[10px] font-bold text-emerald-800">Citation Style</label>
                 <select value={data.citationFormat} onChange={e => handleChange("citationFormat", e.target.value)} className="p-1 border border-emerald-200 rounded text-xs bg-white text-emerald-900">
                    {["KHCRF Standard Citation", "APA 7th Edition", "MLA 9th Edition", "Chicago 17th Edition", "Harvard", "IEEE"].map(o => <option key={o}>{o}</option>)}
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="flex items-center gap-2 text-xs font-bold text-emerald-900 cursor-pointer">
                   <input type="checkbox" checked={data.showCitationPanel} onChange={e => handleChange("showCitationPanel", e.target.checked)} className="rounded text-emerald-600 border-emerald-300" />
                   Show "Copy Citation" Panel
                 </label>
                 <label className="flex items-center gap-2 text-xs font-bold text-emerald-900 cursor-pointer">
                   <input type="checkbox" checked={data.showBibliography} onChange={e => handleChange("showBibliography", e.target.checked)} className="rounded text-emerald-600 border-emerald-300" />
                   Generate Structured Bibliography
                 </label>
              </div>
            </div>

            {/* Knowledge Graph Links */}
            <div className="p-4 bg-cyan-50/50 border border-cyan-100 rounded-xl space-y-3">
               <div className="flex items-center justify-between">
                 <label className="text-xs font-black text-cyan-800 flex items-center gap-2">
                   <input type="checkbox" checked={data.knowledgeLinksEnabled} onChange={e => handleChange("knowledgeLinksEnabled", e.target.checked)} className="rounded text-cyan-600" />
                   Enable Knowledge Graph Links
                 </label>
                 {data.knowledgeLinksEnabled && (
                   <select value={data.knowledgeLinkStyle} onChange={e => handleChange("knowledgeLinkStyle", e.target.value)} className="p-1 border border-cyan-200 rounded text-[10px] bg-white">
                      {["Inline Links", "Subtle Underline", "Popover Cards", "Sidebar Definitions"].map(o => <option key={o}>{o}</option>)}
                   </select>
                 )}
               </div>
               {data.knowledgeLinksEnabled && (
                 <div className="flex flex-wrap gap-2 mt-2">
                   {["Craft Terms", "Policy Terms", "GI Registrations", "Artisan Clusters", "Market Nodes"].map(t => (
                     <button key={t} type="button" onClick={() => toggleArrayItem("knowledgeLinkTypes", t)}
                       className={`px-2 py-1 text-[10px] font-bold rounded-full border transition-colors ${
                         data.knowledgeLinkTypes.includes(t) ? "bg-cyan-600 text-white border-cyan-700" : "bg-white text-cyan-700 border-cyan-200"
                       }`}>
                       {t}
                     </button>
                   ))}
                 </div>
               )}
            </div>

          </div>
        </div>

        <div className="border-t border-stone-100"></div>

        {/* Footnotes & Navigation */}
        <div>
           <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
            <FaListUl className="text-blue-600" /> Navigation & Annotations
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Footnote Placement</label>
                <select value={data.footnoteMode} onChange={e => handleChange("footnoteMode", e.target.value)} className="w-full p-2 border border-stone-200 rounded-lg text-xs bg-stone-50">
                  {["Inline Footnotes", "Margin Notes", "Right Sidebar", "Endnotes Only", "Hidden"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                 <input type="checkbox" checked={data.mobileFootnoteDrawer} onChange={e => handleChange("mobileFootnoteDrawer", e.target.checked)} className="rounded" />
                 <FaMobileAlt className="text-gray-400" /> Collapse footnotes into tap-to-open mobile drawer
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
               {[
                 { id: "navTOC", label: "Table of Contents" },
                 { id: "navProgress", label: "Reading Progress Bar" },
                 { id: "navSearch", label: "Search Within" },
                 { id: "navBookmark", label: "Bookmark / Resume" }
               ].map(opt => (
                 <label key={opt.id} className="flex items-center gap-2 text-[10px] font-bold text-gray-700 cursor-pointer">
                   <input type="checkbox" checked={data[opt.id as keyof ReaderEngineData] as boolean} onChange={e => handleChange(opt.id as keyof ReaderEngineData, e.target.checked)} className="rounded" />
                   {opt.label}
                 </label>
               ))}
            </div>
          </div>
        </div>

        <div className="border-t border-stone-100"></div>

        {/* Access & Downloads */}
        <div>
           <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
            <FaDownload className="text-purple-600" /> Access Governance & Downloads
          </h4>
          <div className="flex flex-col gap-6">
            <div className="flex gap-6 p-4 bg-gray-50 border border-gray-100 rounded-xl">
              <div className="flex-1">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-900 cursor-pointer mb-1">
                  <input type="checkbox" checked={data.readerEnabled} onChange={e => handleChange("readerEnabled", e.target.checked)} className="rounded text-brand-primary" />
                  Enable Knowledge Reader
                </label>
                <p className="text-[10px] text-gray-500 mb-2 ml-5">If disabled, the "Read Online" CTA will be hidden completely.</p>
              </div>

              <div className="flex-2 w-2/3">
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Reader Route (Canonical Path)</label>
                <input 
                  type="text" 
                  value={data.readerPath || ""} 
                  onChange={e => handleChange("readerPath", e.target.value)} 
                  className="w-full p-2 border border-stone-200 rounded-lg text-xs bg-white"
                  placeholder="/publications/read/[slug]"
                  disabled={!data.readerEnabled}
                />
                <p className="text-[10px] text-gray-500 mt-1">The explicit route destination the UI will use. Example: <code>/publications/read/slug</code></p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-1/3">
                <label className="block text-[10px] font-bold text-gray-500 mb-2">Access Level</label>
                <div className="space-y-2">
                   {[
                     { id: "Public", icon: FaGlobe, desc: "Open access" },
                     { id: "Members Only", icon: FaLock, desc: "Requires login" },
                     { id: "Researchers Only", icon: FaLock, desc: "Academic access" },
                     { id: "Internal KHCRF", icon: FaLock, desc: "Staff only" }
                   ].map(lvl => (
                     <div key={lvl.id} onClick={() => handleChange("accessLevel", lvl.id)} className={`p-2 border rounded-lg cursor-pointer flex items-center gap-3 transition-colors ${data.accessLevel === lvl.id ? "bg-purple-50 border-purple-300" : "bg-white border-stone-200 hover:bg-stone-50"}`}>
                        <lvl.icon className={data.accessLevel === lvl.id ? "text-purple-600" : "text-stone-400"} size={14} />
                        <div>
                          <p className={`text-xs font-bold ${data.accessLevel === lvl.id ? "text-purple-900" : "text-gray-700"}`}>{lvl.id}</p>
                          <p className="text-[9px] text-gray-500">{lvl.desc}</p>
                        </div>
                        {data.accessLevel === lvl.id && <FaCheckCircle className="ml-auto text-purple-600" size={12} />}
                     </div>
                   ))}
                </div>
              </div>
            <div className="w-2/3 bg-stone-50 rounded-xl border border-stone-200 p-4">
              <label className="block text-[10px] font-bold text-gray-500 mb-3">Allowed Export Formats</label>
              <div className="grid grid-cols-2 gap-3">
                 {[
                   { id: "PDF", icon: FaFilePdf, label: "Enable PDF Download" },
                   { id: "DOCX", icon: FaFileWord, label: "Enable DOCX Download" },
                   { id: "EPUB", icon: FaBookOpen, label: "Enable EPUB Download" },
                   { id: "Print", icon: FaCogs, label: "Enable Print View" },
                   { id: "Citation Export", icon: FaQuoteRight, label: "Enable Citation Export" },
                   { id: "RIS/BibTeX", icon: FaFileWord, label: "Enable RIS/BibTeX" }
                 ].map(fmt => (
                   <label key={fmt.id} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                     data.downloadsEnabled.includes(fmt.id) ? "bg-white border-brand-primary shadow-sm" : "bg-white border-stone-200 opacity-60"
                   }`}>
                     <input type="checkbox" checked={data.downloadsEnabled.includes(fmt.id)} onChange={() => toggleArrayItem("downloadsEnabled", fmt.id)} className="sr-only" />
                     <div className={`w-4 h-4 rounded border flex items-center justify-center ${data.downloadsEnabled.includes(fmt.id) ? "bg-brand-primary border-brand-primary text-white" : "border-stone-300 text-transparent"}`}>
                       <FaCheck size={8} />
                     </div>
                     <fmt.icon className={data.downloadsEnabled.includes(fmt.id) ? "text-brand-primary" : "text-stone-400"} />
                     <span className="text-[10px] font-bold text-gray-700">{fmt.label}</span>
                   </label>
                 ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
  );
}
