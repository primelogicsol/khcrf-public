"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { useSidebar } from "@/context/SidebarContext";
import {
  FaBook, FaPlus, FaTrash, FaSave, FaArrowLeft, FaSpinner,
  FaBookOpen, FaSearch, FaEye, FaBrain, FaProjectDiagram, FaLink,
  FaExclamationTriangle, FaCheck, FaFileAlt, FaImage, FaTable,
  FaQuoteRight, FaList, FaBolt, FaLightbulb, FaLayerGroup, FaGlobe,
  FaShieldAlt, FaHistory, FaFilePdf, FaTimes, FaAngleRight,
  FaPen, FaHashtag, FaAlignLeft, FaAlignCenter, FaInfoCircle,
  FaCertificate, FaBoxOpen, FaExpand, FaCompress, FaColumns,
  FaChevronLeft, FaChevronRight, FaKeyboard, FaRegClock,
} from "react-icons/fa";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Block {
  id: string;
  type: "Heading" | "Paragraph" | "Key Insight" | "Quote" | "Callout" |
        "Reference" | "Checklist" | "Table" | "Figure" | "Footnote" |
        "Buyer Guidance" | "Data Block";
  text: string;
}

interface Chapter {
  id?: string;
  title: string;
  order: number;
  status: "DRAFT" | "REVIEW" | "PUBLISHED";
  summary: string;
  pages: { id?: string; content: string; pageNumber: number }[];
  subchapters?: { id?: string; title: string; order: number; summary: string; content: string }[];
}

interface Publication {
  id: string;
  title: string;
  author: string;
  imagePath?: string;
  publishedStatus: string;
  craftSector?: string;
  chapters?: Chapter[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  linkedCrafts?: string;
  linkedPolicies?: string;
  linkedGIs?: string;
  linkedPapers?: string;
  keywords?: string;
  isbn?: string;
  aiSummary?: string;
  qaPairs?: string;
  slug?: string;
}

// ─── Block type config ────────────────────────────────────────────────────────

const BLOCK_TYPES = [
  { type: "Heading",       icon: FaHashtag,      color: "text-stone-700 bg-stone-100",       rows: 1,  desc: "Section heading" },
  { type: "Paragraph",     icon: FaAlignLeft,    color: "text-gray-600 bg-gray-100",         rows: 4,  desc: "Body text" },
  { type: "Key Insight",   icon: FaBolt,         color: "text-amber-700 bg-amber-100",       rows: 2,  desc: "Key finding or insight" },
  { type: "Quote",         icon: FaQuoteRight,   color: "text-indigo-700 bg-indigo-100",     rows: 2,  desc: "Pull quote or excerpt" },
  { type: "Callout",       icon: FaInfoCircle,   color: "text-blue-700 bg-blue-100",         rows: 2,  desc: "Callout or notice" },
  { type: "Buyer Guidance",icon: FaList,         color: "text-teal-700 bg-teal-100",         rows: 4,  desc: "Buyer guidance block" },
  { type: "Reference",     icon: FaLink,         color: "text-purple-700 bg-purple-100",     rows: 1,  desc: "Citation or reference" },
  { type: "Figure",        icon: FaImage,        color: "text-rose-700 bg-rose-100",         rows: 2,  desc: "Image or figure" },
  { type: "Table",         icon: FaTable,        color: "text-emerald-700 bg-emerald-100",   rows: 5,  desc: "Data table" },
  { type: "Footnote",      icon: FaAlignCenter,  color: "text-gray-500 bg-gray-100",         rows: 1,  desc: "Footnote" },
  { type: "Data Block",    icon: FaLayerGroup,   color: "text-cyan-700 bg-cyan-100",         rows: 3,  desc: "Structured data" },
  { type: "Checklist",     icon: FaCheck,        color: "text-green-700 bg-green-100",       rows: 3,  desc: "Checklist items" },
] as const;

const mkId = () => Math.random().toString(36).slice(2, 9);

function parseBlocks(raw: string): Block[] {
  try {
    const arr = JSON.parse(raw);
    return arr.map((b: any) => ({ id: b.id || mkId(), type: b.type || "Paragraph", text: b.text || "" }));
  } catch { return []; }
}

function serializeBlocks(blocks: Block[]): string {
  return JSON.stringify(blocks);
}

function computeSEOScore(pub: Publication): number {
  let s = 0;
  if (pub.seoTitle) s += 20; if (pub.seoDescription) s += 20;
  if (pub.seoKeywords) s += 15; if (pub.isbn) s += 15;
  if (pub.linkedCrafts) s += 15; if (pub.aiSummary) s += 15;
  return s;
}

function computeAIScore(pub: Publication): number {
  let s = 0;
  if (pub.aiSummary) s += 30;
  if (pub.qaPairs && pub.qaPairs !== JSON.stringify([{ q: "", a: "" }])) s += 30;
  if (pub.linkedCrafts) s += 15; if (pub.linkedGIs) s += 15; if (pub.keywords) s += 10;
  return s;
}

const blockPlaceholder = (type: Block["type"]) => {
  const map: Record<string, string> = {
    Heading: "Section heading...",
    Paragraph: "Write your content here. Use clear, authoritative language that reflects KHCRF's research standards...",
    "Key Insight": "Key finding or insight — what does the reader need to remember from this section?",
    Quote: "Pull quote or expert citation...",
    Callout: "Important notice, warning, or highlight for the reader...",
    "Buyer Guidance": "Step-by-step guidance for buyers — authentication tips, what to look for, red flags...",
    Reference: "Citation: Author (Year). Title. Publication. DOI/URL",
    Figure: "Figure caption and description. Image URL: https://...",
    Table: "| Column 1 | Column 2 | Column 3 |\n|----------|----------| ---------|\n| Data     | Data     | Data     |",
    Footnote: "Footnote text with supporting reference...",
    "Data Block": "Structured data, statistics, or key numbers...",
    Checklist: "Item 1\nItem 2\nItem 3",
  };
  return map[type] || `${type} content...`;
};

// ─── Score Ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-14 h-14">
        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r="22" fill="none" stroke="#e7e5e4" strokeWidth="5" />
          <circle cx="28" cy="28" r="22" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 138.2} 138.2`} />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-gray-900">{score}</span>
      </div>
      <span className="text-[10px] font-bold text-gray-500 mt-1 text-center leading-tight">{label}</span>
    </div>
  );
}

// ─── Publication Picker ───────────────────────────────────────────────────────

function PublicationPicker({ onSelect }: { onSelect: (pub: Publication) => void }) {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/publications")
      .then(r => {
        const payload = r.data;
        const arr = Array.isArray(payload) ? payload : (payload?.data || payload?.publications || []);
        setPublications(Array.isArray(arr) ? arr : []);
      })
      .catch(() => toast.error("Failed to load publications"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = publications.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.author || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-50/40">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 px-8 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/business/publications" className="p-2 text-stone-400 hover:text-brand-primary hover:bg-stone-50 rounded-xl transition-all">
              <FaArrowLeft size={13} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-teal-600/10 rounded-lg flex items-center justify-center">
                  <FaPen className="text-teal-600" size={11} />
                </div>
                <h1 className="text-lg font-black text-gray-900 tracking-tight">Content Studio</h1>
              </div>
              <p className="text-[11px] text-gray-400 ml-9">Select a publication to open its authoring environment</p>
            </div>
          </div>
          <Link href="/dashboard/business/publications/add" className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-teal-700 shadow-lg shadow-teal-600/20 transition-all">
            <FaPlus size={11} /> New Publication
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="relative mb-6">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search publications by title or author..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:border-teal-400 text-sm shadow-sm transition-all"
          />
        </div>

        {/* Studio explainer */}
        <div className="mb-6 bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-5 text-white relative overflow-hidden">
          
          <div className="relative flex items-start gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
              <FaBookOpen size={16} />
            </div>
            <div>
              <h2 className="font-black text-sm mb-1">Three-Panel Knowledge Authoring Environment</h2>
              <p className="text-white/70 text-xs leading-relaxed">
                Chapter Tree · Section Editor · Knowledge Intelligence. Auto-collapses main nav for maximum writing space. Full keyboard shortcuts included.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {["Chapter Builder","Section Editor","Focus Mode","Auto Rail-Nav","Keyboard Shortcuts","Intelligence Panel","Version History"].map(f => (
                  <span key={f} className="text-[10px] font-bold bg-white/15 px-2 py-1 rounded-lg">{f}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><FaSpinner className="animate-spin text-3xl text-teal-600" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
            <FaBookOpen className="text-4xl text-stone-200 mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-500">{search ? "No publications match your search" : "No publications yet"}</p>
            <p className="text-xs text-gray-400 mt-1">{search ? "Try a different search term" : "Create your first knowledge asset to get started"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(pub => (
              <button key={pub.id} onClick={() => onSelect(pub)} className="group bg-white border border-stone-200 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-teal-300 transition-all text-left flex items-start gap-4">
                <div className="w-12 h-16 bg-stone-100 rounded-xl border border-stone-200 overflow-hidden flex items-center justify-center shrink-0">
                  {pub.imagePath ? <img src={pub.imagePath} alt="" className="w-full h-full object-cover" /> : <FaBook className="text-stone-300" size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-black text-gray-900 leading-tight line-clamp-2 group-hover:text-teal-700 transition-colors">{pub.title}</p>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 ${pub.publishedStatus === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {pub.publishedStatus || "DRAFT"}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">{pub.author || "KHCRF Press"}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-[10px] text-gray-500 flex items-center gap-1"><FaBookOpen size={9} />{pub.chapters?.length || 0} chapters</span>
                    {pub.craftSector && <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-bold">{typeof pub.craftSector === "object" ? (pub.craftSector as any)?.name : pub.craftSector}</span>}
                  </div>
                </div>
                <FaAngleRight className="text-stone-300 group-hover:text-teal-500 transition-colors shrink-0 mt-1" size={14} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Intelligence Panel ───────────────────────────────────────────────────────

function IntelligencePanel({
  publication, chapters, activeChapter, onClose
}: {
  publication: Publication;
  chapters: Chapter[];
  activeChapter: Chapter | null;
  onClose: () => void;
}) {
  const seoScore = computeSEOScore(publication);
  const aiScore = computeAIScore(publication);

  const knowledgeNodes = [
    publication.linkedCrafts,
    publication.linkedPolicies,
    publication.linkedGIs,
    publication.linkedPapers,
  ].filter(Boolean).length;

  const missingRefs: string[] = [];
  if (!publication.seoTitle) missingRefs.push("SEO Title");
  if (!publication.seoDescription) missingRefs.push("SEO Description");
  if (!publication.isbn) missingRefs.push("ISBN Registration");
  if (!publication.aiSummary) missingRefs.push("AI Summary");
  if (!publication.linkedCrafts) missingRefs.push("Craft Graph Links");

  const relatedCrafts = (publication.linkedCrafts || "").split(",").map(s => s.trim()).filter(Boolean);
  const relatedGIs = (publication.linkedGIs || "").split(",").map(s => s.trim()).filter(Boolean);
  const relatedPapers = (publication.linkedPapers || "").split(",").map(s => s.trim()).filter(Boolean);

  const chapterBlocks = activeChapter ? parseBlocks(activeChapter.pages?.[0]?.content || "[]") : [];
  const wordCount = chapterBlocks.reduce((acc, b) => acc + (b.text?.split(/\s+/).filter(Boolean).length || 0), 0);

  return (
    <aside className="w-72 bg-white border-l border-stone-200 flex flex-col shrink-0 overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-3 border-b border-stone-100 bg-stone-50/60 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaBrain className="text-purple-600" size={12} />
            <span className="text-[10px] font-black text-gray-700 uppercase tracking-wider">Knowledge Intelligence</span>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-stone-100 transition-all" title="Hide panel (Ctrl+\\)">
            <FaTimes size={10} />
          </button>
        </div>
      </div>

      {/* Score rings */}
      <div className="px-4 py-4 border-b border-stone-100">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Authority Scores</p>
        <div className="flex justify-around">
          <ScoreRing score={seoScore} label="SEO Score" color="#10b981" />
          <ScoreRing score={aiScore}  label="AI Score"  color="#8b5cf6" />
          <ScoreRing
            score={chapters.length > 0 ? Math.min(100, Math.round((chapters.length / 10) * 100)) : 0}
            label="Completeness"
            color="#0d9488"
          />
        </div>
      </div>

      {/* Active chapter stats */}
      {activeChapter && (
        <div className="px-4 py-3 border-b border-stone-100 bg-teal-50/40">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Active Section</p>
          <p className="text-xs font-bold text-teal-800 line-clamp-1">{activeChapter.title}</p>
          <div className="flex gap-3 mt-2">
            <span className="text-[10px] text-gray-500">{wordCount} words</span>
            <span className="text-[10px] text-gray-500">{chapterBlocks.length} blocks</span>
            <span className={`text-[10px] font-bold ${activeChapter.status === "PUBLISHED" ? "text-green-600" : "text-amber-600"}`}>{activeChapter.status}</span>
          </div>
        </div>
      )}

      {/* Knowledge nodes */}
      <div className="px-4 py-3 border-b border-stone-100">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Knowledge Nodes</p>
          <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">{knowledgeNodes} linked</span>
        </div>
        <div className="space-y-1.5">
          {[
            { label: "Craft Links", val: publication.linkedCrafts, color: "text-amber-600", icon: FaShieldAlt },
            { label: "GI Records", val: publication.linkedGIs, color: "text-blue-600", icon: FaCertificate },
            { label: "Policies", val: publication.linkedPolicies, color: "text-indigo-600", icon: FaFileAlt },
            { label: "Papers", val: publication.linkedPapers, color: "text-rose-600", icon: FaLink },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <item.icon size={9} className={item.val ? item.color : "text-stone-300"} />
              <span className={`text-[10px] ${item.val ? "text-gray-700 font-semibold" : "text-gray-300 italic"}`}>
                {item.val ? item.label : `${item.label} — missing`}
              </span>
              {item.val && <FaCheck size={8} className="text-emerald-500 ml-auto" />}
            </div>
          ))}
        </div>
        <Link
          href={`/dashboard/business/publications/add?edit=${publication.id}&section=graph`}
          className="mt-3 flex items-center gap-1.5 text-[10px] font-black text-purple-600 hover:underline"
        >
          <FaProjectDiagram size={9} /> Manage Knowledge Graph
        </Link>
      </div>

      {/* Missing / gaps */}
      {missingRefs.length > 0 && (
        <div className="px-4 py-3 border-b border-stone-100">
          <div className="flex items-center gap-2 mb-2">
            <FaExclamationTriangle size={10} className="text-amber-500" />
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Gaps ({missingRefs.length})</p>
          </div>
          <div className="space-y-1">
            {missingRefs.map(ref => (
              <div key={ref} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                <span className="text-[10px] text-amber-700">{ref}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related crafts */}
      {relatedCrafts.length > 0 && (
        <div className="px-4 py-3 border-b border-stone-100">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Related Crafts</p>
          <div className="flex flex-wrap gap-1.5">
            {relatedCrafts.map(c => (
              <span key={c} className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-100">{c}</span>
            ))}
          </div>
        </div>
      )}

      {/* Related GIs */}
      {relatedGIs.length > 0 && (
        <div className="px-4 py-3 border-b border-stone-100">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">GI References</p>
          <div className="space-y-1">
            {relatedGIs.map(g => (
              <div key={g} className="flex items-center gap-1.5">
                <FaCertificate size={9} className="text-blue-500" />
                <span className="text-[10px] text-blue-700 font-semibold">{g}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related papers */}
      {relatedPapers.length > 0 && (
        <div className="px-4 py-3 border-b border-stone-100">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Related Publications</p>
          <div className="space-y-1">
            {relatedPapers.slice(0, 3).map(p => (
              <div key={p} className="flex items-center gap-1.5">
                <FaBook size={9} className="text-stone-400" />
                <span className="text-[10px] text-gray-600 line-clamp-1">{p}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="px-4 py-4">
        <a
          href={`/publications/read/${publication.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-stone-900 text-white text-[11px] font-black rounded-xl hover:bg-teal-700 transition-colors"
        >
          <FaEye size={10} /> Reader Preview
        </a>
        <Link
          href={`/dashboard/business/publications/add?edit=${publication.id}`}
          className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 bg-stone-100 text-stone-700 text-[11px] font-black rounded-xl hover:bg-stone-200 transition-colors"
        >
          <FaPen size={10} /> Full Metadata Editor
        </Link>
      </div>
    </aside>
  );
}

// ─── Section Editor ───────────────────────────────────────────────────────────

function SectionEditor({
  chapter, blocks, onUpdateTitle, onBlocksChange, isSaving, focusMode
}: {
  chapter: Chapter | null;
  blocks: Block[];
  onUpdateTitle: (title: string) => void;
  onBlocksChange: (blocks: Block[]) => void;
  isSaving: boolean;
  focusMode: boolean;
}) {
  const [showBlockPicker, setShowBlockPicker] = useState(false);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditingBlock(null);
    setShowBlockPicker(false);
  }, [chapter?.id]);

  const addBlock = (type: Block["type"]) => {
    const nb: Block = { id: mkId(), type, text: "" };
    onBlocksChange([...blocks, nb]);
    setEditingBlock(nb.id);
    setShowBlockPicker(false);
    setTimeout(() => contentRef.current?.scrollTo({ top: contentRef.current.scrollHeight, behavior: "smooth" }), 50);
  };

  const updateBlock = (id: string, text: string) => onBlocksChange(blocks.map(b => b.id === id ? { ...b, text } : b));
  const removeBlock = (id: string) => onBlocksChange(blocks.filter(b => b.id !== id));
  const moveBlock = (idx: number, dir: -1 | 1) => {
    const arr = [...blocks]; const t = idx + dir;
    if (t < 0 || t >= arr.length) return;
    [arr[idx], arr[t]] = [arr[t], arr[idx]]; onBlocksChange(arr);
  };

  if (!chapter) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center bg-stone-50/40 p-12">
        <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mb-4">
          <FaBookOpen className="text-stone-300" size={24} />
        </div>
        <h3 className="text-base font-black text-stone-500">Select a chapter</h3>
        <p className="text-xs text-gray-400 mt-2 max-w-xs">
          Choose a chapter from the tree on the left, or add a new chapter to start writing.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      {/* Toolbar */}
      <div className="border-b border-stone-200 bg-white px-6 py-3 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${
            chapter.status === "PUBLISHED" ? "bg-green-100 text-green-700" :
            chapter.status === "REVIEW" ? "bg-blue-100 text-blue-700" :
            "bg-amber-100 text-amber-700"
          }`}>{chapter.status}</span>
          <span className="text-[10px] text-gray-400">
            {blocks.length} blocks · {blocks.reduce((a, b) => a + (b.text.split(/\s+/).filter(Boolean).length), 0)} words
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBlockPicker(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white text-[11px] font-black rounded-lg hover:bg-teal-700 transition-colors"
          >
            <FaPlus size={9} /> Add Block
          </button>
          {isSaving && (
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
              <FaSpinner size={9} className="animate-spin" /> Saving...
            </div>
          )}
          {!isSaving && blocks.length > 0 && (
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-600">
              <FaCheck size={9} /> Saved
            </div>
          )}
          {focusMode && (
            <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">Focus Mode</span>
          )}
        </div>
      </div>

      {/* Block picker */}
      {showBlockPicker && (
        <div className="border-b border-stone-200 bg-stone-50/80 px-6 py-3 shrink-0">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Insert Block</p>
          <div className="flex flex-wrap gap-1.5">
            {BLOCK_TYPES.map(bt => {
              const Icon = bt.icon;
              return (
                <button
                  key={bt.type}
                  onClick={() => addBlock(bt.type as Block["type"])}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-[10px] font-bold text-gray-700 hover:border-teal-400 hover:text-teal-700 transition-all"
                  title={bt.desc}
                >
                  <Icon size={9} className={bt.color.split(" ")[0]} />
                  {bt.type}
                </button>
              );
            })}
            <button onClick={() => setShowBlockPicker(false)} className="px-2.5 py-1.5 text-[10px] text-gray-400 hover:text-gray-600">
              <FaTimes size={10} />
            </button>
          </div>
        </div>
      )}

      {/* Chapter title */}
      <div className="px-8 pt-8 pb-2 shrink-0">
        <input
          value={chapter.title}
          onChange={e => onUpdateTitle(e.target.value)}
          className="w-full text-2xl font-black text-gray-900 bg-transparent border-none outline-none placeholder:text-gray-300"
          placeholder="Chapter title..."
        />
        <div className="h-px bg-stone-100 mt-4" />
      </div>

      {/* Block list */}
      <div ref={contentRef} className="flex-1 overflow-y-auto px-8 py-4 space-y-3">
        {blocks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-400 italic">
              This chapter is empty. Click <span className="font-bold text-teal-600">+ Add Block</span> to start writing.
            </p>
          </div>
        )}
        {blocks.map((block, idx) => {
          const Icon = BLOCK_TYPES.find(b => b.type === block.type)?.icon || FaAlignLeft;
          const [iconColor, bgColor] = (BLOCK_TYPES.find(b => b.type === block.type)?.color || "text-gray-600 bg-gray-100").split(" ");
          const isActive = editingBlock === block.id;
          return (
            <div
              key={block.id}
              className={`group relative rounded-xl border transition-all ${
                isActive
                  ? "border-teal-300 shadow-sm bg-teal-50/30"
                  : "border-stone-200/60 hover:border-stone-300 bg-stone-50/30"
              }`}
            >
              <div className="flex items-center gap-2 px-3 pt-3 pb-1">
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${bgColor} ${iconColor}`}>
                  <Icon size={8} />{block.type}
                </div>
                <div className="flex-1" />
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => moveBlock(idx, -1)} disabled={idx === 0}
                    className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 rounded hover:bg-stone-100 transition-all" title="Move up">
                    <span className="text-[9px] font-black">↑</span>
                  </button>
                  <button onClick={() => moveBlock(idx, 1)} disabled={idx === blocks.length - 1}
                    className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 rounded hover:bg-stone-100 transition-all" title="Move down">
                    <span className="text-[9px] font-black">↓</span>
                  </button>
                  <button onClick={() => removeBlock(block.id)}
                    className="p-1 text-stone-300 hover:text-red-500 rounded hover:bg-red-50 transition-all" title="Delete block">
                    <FaTrash size={9} />
                  </button>
                </div>
              </div>
              <div className="px-3 pb-3">
                <textarea
                  value={block.text}
                  onChange={e => updateBlock(block.id, e.target.value)}
                  onFocus={() => setEditingBlock(block.id)}
                  rows={BLOCK_TYPES.find(b => b.type === block.type)?.rows ?? 2}
                  placeholder={blockPlaceholder(block.type)}
                  className={`w-full bg-transparent border-none outline-none resize-none text-sm text-gray-800 placeholder:text-gray-300 leading-relaxed ${
                    block.type === "Heading" ? "font-black text-base text-gray-900" :
                    block.type === "Key Insight" ? "font-bold text-amber-800" :
                    block.type === "Quote" ? "italic text-indigo-800 font-medium" :
                    block.type === "Reference" ? "font-mono text-xs text-purple-700" :
                    block.type === "Footnote" ? "text-xs text-gray-500" :
                    "font-serif"
                  }`}
                />
              </div>
            </div>
          );
        })}
        {blocks.length > 0 && (
          <button
            onClick={() => setShowBlockPicker(true)}
            className="w-full py-3 border-2 border-dashed border-stone-200 rounded-xl text-xs text-gray-400 hover:border-teal-300 hover:text-teal-600 transition-all flex items-center justify-center gap-2 font-bold"
          >
            <FaPlus size={10} /> Insert block
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Content Studio ──────────────────────────────────────────────────────

export default function ContentStudioPage() {
  const { setIsRail, isRail } = useSidebar();

  const searchParams = useSearchParams();
  const [publication, setPublication] = useState<Publication | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeChapterIdx, setActiveChapterIdx] = useState<number | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingChapters, setIsLoadingChapters] = useState(false);
  const [view, setView] = useState<"studio" | "picker">("picker");
  const [activeTab, setActiveTab] = useState<"chapters" | "references" | "appendices" | "versions">("chapters");
  const [blocks, setBlocks] = useState<Block[]>([]);

  // Panel visibility
  const [showTree, setShowTree] = useState(true);
  const [showIntelligence, setShowIntelligence] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Auto-collapse sidebar to rail when entering studio
  const prevRailRef = useRef(isRail);
  useEffect(() => {
    if (view === "studio") {
      prevRailRef.current = isRail;
      setIsRail(true);
    }
    return () => {
      if (view === "studio") setIsRail(prevRailRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  // Auto-load if publicationId is in the query string (e.g. when redirected from workspace/manuscript)
  useEffect(() => {
    const pubId = searchParams?.get('publicationId');
    if (!pubId) return;
    api.get(`/publications/${pubId}`)
      .then(res => loadPublication(res.data?.data ?? res.data))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Focus mode: hide all panels
  useEffect(() => {
    if (focusMode) { setShowTree(false); setShowIntelligence(false); setIsRail(true); }
    else { setShowTree(true); setShowIntelligence(true); }
  }, [focusMode]);

  // Load blocks when chapter changes
  const activeChapter = activeChapterIdx !== null ? chapters[activeChapterIdx] : null;
  useEffect(() => {
    if (activeChapter) {
      setBlocks(parseBlocks(activeChapter.pages?.[0]?.content || "[]"));
    }
  }, [activeChapterIdx, activeChapter?.id]);

  // Autosave timer
  const saveTimer = useRef<NodeJS.Timeout | null>(null);
  const handleBlocksChange = useCallback((updated: Block[]) => {
    setBlocks(updated);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      if (activeChapterIdx === null) return;
      const ch = chapters[activeChapterIdx];
      if (!ch) return;
      setIsSaving(true);
      try {
        if (ch.id) await api.put(`/publications/chapters/${ch.id}`, { title: ch.title, order: ch.order, status: ch.status, summary: ch.summary });
        const page = ch.pages[0];
        const content = serializeBlocks(updated);
        if (page?.id) await api.put(`/publications/pages/${page.id}`, { content, pageNumber: 1 });
        setChapters(prev => prev.map((c, i) => i === activeChapterIdx ? { ...c, pages: c.pages.map((p, j) => j === 0 ? { ...p, content } : p) } : c));
      } catch { toast.error("Auto-save failed"); }
      finally { setIsSaving(false); }
    }, 1500);
  }, [activeChapterIdx, chapters]);

  // Keyboard shortcuts
  useEffect(() => {
    if (view !== "studio") return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "b" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault();
        setIsRail((r: boolean) => !r);
      }
      if (e.key === "b" && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault();
        setShowTree(v => !v);
      }
      if (e.key === "\\" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setShowIntelligence(v => !v);
      }
      if (e.key === "F11") {
        e.preventDefault();
        setFocusMode(v => !v);
      }
      if (e.key === "Escape" && focusMode) {
        setFocusMode(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [view, focusMode]);

  // Load publication with chapters
  const loadPublication = async (pub: Publication) => {
    setIsLoadingChapters(true);
    try {
      const res = await api.get(`/publications/${pub.id}`);
      const full = res.data as Publication;
      const loaded: Chapter[] = (full.chapters || [])
        .map((ch: any) => ({
          id: ch.id, title: ch.title, order: ch.order,
          status: ch.status || "DRAFT", summary: ch.summary || "",
          pages: ch.pages?.length
            ? ch.pages.map((p: any) => ({ id: p.id, content: p.content, pageNumber: p.pageNumber }))
            : [{ content: JSON.stringify([]), pageNumber: 1 }],
          subchapters: ch.subchapters || [],
        }))
        .sort((a: Chapter, b: Chapter) => a.order - b.order);
      setPublication(full);
      setChapters(loaded);
      setActiveChapterIdx(loaded.length > 0 ? 0 : null);
      setView("studio");
    } catch { toast.error("Failed to load publication content"); }
    finally { setIsLoadingChapters(false); }
  };

  const addChapter = async () => {
    if (!publication) return;
    try {
      const res = await api.post("/publications/chapters", {
        title: `Chapter ${chapters.length + 1}`, order: chapters.length + 1,
        status: "DRAFT", summary: "", publicationId: publication.id,
      });
      const pageRes = await api.post("/publications/pages", {
        content: JSON.stringify([]), pageNumber: 1, chapterId: res.data.id,
      });
      const saved: Chapter = {
        id: res.data.id, title: `Chapter ${chapters.length + 1}`, order: chapters.length + 1,
        status: "DRAFT", summary: "",
        pages: [{ id: pageRes.data.id, content: JSON.stringify([]), pageNumber: 1 }],
        subchapters: [],
      };
      const updated = [...chapters, saved];
      setChapters(updated); setActiveChapterIdx(updated.length - 1);
      toast.success("Chapter added");
    } catch { toast.error("Failed to add chapter"); }
  };

  const deleteChapter = async (idx: number) => {
    const ch = chapters[idx];
    if (!ch?.id) return;
    try {
      await api.delete(`/publications/chapters/${ch.id}`);
      const updated = chapters.filter((_, i) => i !== idx);
      setChapters(updated); setActiveChapterIdx(updated.length > 0 ? 0 : null);
      toast.success("Chapter removed");
    } catch { toast.error("Failed to delete chapter"); }
  };

  const updateChapterTitle = (title: string) => {
    if (activeChapterIdx === null) return;
    setChapters(prev => prev.map((c, i) => i === activeChapterIdx ? { ...c, title } : c));
  };

  // ── Picker view ──────────────────────────────────────────────────────────────
  if (view === "picker") return <PublicationPicker onSelect={loadPublication} />;

  if (isLoadingChapters) return (
    <div className="flex items-center justify-center min-h-screen bg-stone-50">
      <div className="text-center">
        <FaSpinner className="animate-spin text-3xl text-teal-600 mx-auto mb-3" />
        <p className="text-sm text-gray-500">Loading Content Studio...</p>
      </div>
    </div>
  );

  // ── Studio layout ─────────────────────────────────────────────────────────────
  return (
    <div className="flex bg-stone-50 overflow-hidden -m-6 md:-m-12" style={{ height: "calc(100vh - 5rem)" }}>

      {/* Keyboard shortcuts modal */}
      {showShortcuts && (
        <div className="fixed inset-0 z-[300] bg-black/40 flex items-center justify-center" onClick={() => setShowShortcuts(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-80" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-gray-900 flex items-center gap-2"><FaKeyboard size={14} className="text-teal-600" /> Keyboard Shortcuts</h3>
              <button onClick={() => setShowShortcuts(false)} className="text-gray-400 hover:text-gray-700"><FaTimes size={12} /></button>
            </div>
            <div className="space-y-2">
              {[
                ["Ctrl + B", "Toggle main nav rail"],
                ["Ctrl + Shift + B", "Toggle chapter tree"],
                ["Ctrl + \\", "Toggle intelligence panel"],
                ["F11", "Toggle focus writing mode"],
                ["Escape", "Exit focus mode"],
              ].map(([key, desc]) => (
                <div key={key} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
                  <span className="text-xs text-gray-500">{desc}</span>
                  <kbd className="text-[10px] font-black bg-stone-100 text-stone-700 px-2 py-1 rounded-lg">{key}</kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── LEFT PANEL: Chapter Tree ─────────────────────────────────────── */}
      {showTree && !focusMode && (
        <aside className="w-64 bg-white border-r border-stone-200 flex flex-col shrink-0 transition-all duration-300">
          {/* Publication header */}
          <div className="px-3 py-3 border-b border-stone-200 bg-stone-50/60 shrink-0">
            <button onClick={() => setView("picker")} className="flex items-center gap-1.5 text-[10px] text-stone-400 hover:text-brand-primary font-bold mb-2 transition-colors">
              <FaArrowLeft size={9} /> All Publications
            </button>
            {publication?.imagePath && (
              <div className="w-8 h-10 rounded-lg overflow-hidden border border-stone-200 mb-2 shrink-0">
                <img src={publication.imagePath} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <p className="text-xs font-black text-gray-900 leading-tight line-clamp-2">{publication?.title}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{publication?.author || "KHCRF Press"}</p>
          </div>

          {/* Tab bar */}
          <div className="flex border-b border-stone-200 shrink-0">
            {(["chapters", "references", "appendices", "versions"] as const).map((tab, ti) => {
              const icons = [FaBookOpen, FaLink, FaBoxOpen, FaHistory];
              const Icon = icons[ti];
              return (
                <button key={tab} onClick={() => setActiveTab(tab)} title={tab}
                  className={`flex-1 py-2 transition-all ${activeTab === tab ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-400 hover:text-gray-600"}`}>
                  <Icon className="mx-auto" size={11} />
                </button>
              );
            })}
          </div>

          {/* Tree content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "chapters" && (
              <>
                <div className="px-3 pt-3 pb-1 flex items-center justify-between shrink-0">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Chapter Tree</span>
                  <button onClick={addChapter} className="flex items-center gap-1 px-2 py-1 bg-teal-600 text-white text-[9px] font-black rounded-lg hover:bg-teal-700">
                    <FaPlus size={7} /> Add
                  </button>
                </div>
                <div className="px-2 pb-2 space-y-0.5">
                  {chapters.length === 0 && (
                    <div className="text-center py-8 px-3">
                      <FaBookOpen className="text-stone-200 mx-auto mb-2" size={20} />
                      <p className="text-[10px] text-gray-400 italic">No chapters yet.<br />Click Add to begin.</p>
                    </div>
                  )}
                  {chapters.map((ch, idx) => (
                    <div key={ch.id || idx}>
                      <div
                        onClick={() => {
                          setActiveChapterIdx(idx);
                          setExpandedChapters(prev => { const s = new Set(prev); s.has(idx) ? s.delete(idx) : s.add(idx); return s; });
                        }}
                        className={`group flex items-center gap-2 px-2.5 py-2 rounded-xl cursor-pointer transition-all ${
                          activeChapterIdx === idx ? "bg-teal-50 border border-teal-200" : "hover:bg-stone-50 border border-transparent"
                        }`}
                      >
                        <span className={`text-[9px] font-black w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                          activeChapterIdx === idx ? "bg-teal-600 text-white" : "bg-stone-100 text-stone-500"
                        }`}>{idx + 1}</span>
                        <span className={`flex-1 text-[11px] font-bold leading-tight line-clamp-2 ${
                          activeChapterIdx === idx ? "text-teal-800" : "text-gray-700"
                        }`}>{ch.title}</span>
                        <span className={`text-[8px] font-black px-1 py-0.5 rounded ${
                          ch.status === "PUBLISHED" ? "bg-green-100 text-green-600" : ch.status === "REVIEW" ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-600"
                        }`}>{ch.status.charAt(0)}</span>
                        <button
                          onClick={e => { e.stopPropagation(); if (window.confirm(`Delete "${ch.title}"?`)) deleteChapter(idx); }}
                          className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-500 transition-all"
                        >
                          <FaTrash size={8} />
                        </button>
                      </div>
                      {expandedChapters.has(idx) && ch.subchapters && ch.subchapters.length > 0 && (
                        <div className="ml-5 mt-0.5 space-y-0.5">
                          {ch.subchapters.map((sub, si) => (
                            <div key={si} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer text-[10px] text-gray-500 hover:text-teal-600 hover:bg-teal-50/50">
                              <span className="text-stone-300">└</span>{sub.title}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {chapters.length > 0 && <div className="pt-2 pb-1"><div className="h-px bg-stone-100 mx-2" /></div>}
                  {["References", "Appendices"].map(node => (
                    <div key={node} className="flex items-center gap-2 px-2.5 py-2 rounded-xl cursor-pointer text-[11px] font-bold text-gray-400 hover:text-gray-700 hover:bg-stone-50 border border-transparent">
                      {node === "References" ? <FaLink size={9} className="text-purple-400" /> : <FaBoxOpen size={9} className="text-stone-400" />}{node}
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === "references" && (
              <div className="px-4 py-4">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">References</p>
                <p className="text-[11px] text-gray-400 italic">Add your chapter-level references here. They will appear at the end of the publication.</p>
                <Link
                  href={`/dashboard/business/publications/add?edit=${publication?.id}&section=reader`}
                  className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-teal-600 hover:underline"
                >
                  <FaLink size={9} /> Manage in Metadata Editor
                </Link>
              </div>
            )}

            {activeTab === "appendices" && (
              <div className="px-4 py-4">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Appendices</p>
                <p className="text-[11px] text-gray-400 italic">Attach supplementary materials, data tables, and documents as appendices.</p>
              </div>
            )}

            {activeTab === "versions" && (
              <div className="px-4 py-4">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Version History</p>
                <div className="space-y-2">
                  {[
                    { label: "Auto-saved", time: "2 mins ago", icon: FaRegClock },
                    { label: "Manual save", time: "1 hour ago", icon: FaSave },
                    { label: "Published", time: "2 days ago", icon: FaCheck },
                  ].map((v, i) => (
                    <div key={i} className="flex items-center gap-2.5 py-2 border-b border-stone-100">
                      <v.icon size={10} className="text-stone-400" />
                      <div>
                        <p className="text-[10px] font-bold text-gray-700">{v.label}</p>
                        <p className="text-[9px] text-gray-400">{v.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 mt-3 italic">Full version history coming soon.</p>
              </div>
            )}
          </div>

          {/* Bottom toolbar */}
          <div className="px-3 py-3 border-t border-stone-200 space-y-2 shrink-0">
            {/* Panel toggles */}
            <div className="flex gap-1.5 mb-1">
              <button
                onClick={() => setShowIntelligence(v => !v)}
                title="Toggle Intelligence Panel (Ctrl+\\)"
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[9px] font-black transition-all ${
                  showIntelligence ? "bg-purple-50 text-purple-600 border border-purple-200" : "bg-stone-50 text-stone-400 border border-stone-200 hover:text-purple-600"
                }`}
              >
                <FaBrain size={8} /> AI Panel
              </button>
              <button
                onClick={() => setFocusMode(v => !v)}
                title="Toggle Focus Mode (F11)"
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[9px] font-black transition-all ${
                  focusMode ? "bg-indigo-50 text-indigo-600 border border-indigo-200" : "bg-stone-50 text-stone-400 border border-stone-200 hover:text-indigo-600"
                }`}
              >
                <FaExpand size={8} /> Focus
              </button>
              <button
                onClick={() => setShowShortcuts(true)}
                title="Keyboard shortcuts"
                className="flex items-center justify-center px-2 py-1.5 rounded-lg text-[9px] font-black bg-stone-50 text-stone-400 border border-stone-200 hover:text-teal-600 transition-all"
              >
                <FaKeyboard size={9} />
              </button>
            </div>
            <Link
              href={`/dashboard/business/publications/add?edit=${publication?.id}`}
              className="w-full flex items-center justify-center gap-1.5 py-2 bg-stone-900 text-white text-[11px] font-black rounded-xl hover:bg-teal-700 transition-colors"
            >
              <FaLayerGroup size={9} /> Full Metadata Editor
            </Link>
            <Link
              href={`/publications/read/${publication?.slug}`}
              target="_blank"
              className="w-full flex items-center justify-center gap-1.5 py-2 bg-stone-100 text-stone-600 text-[11px] font-black rounded-xl hover:bg-stone-200 transition-colors"
            >
              <FaEye size={9} /> Reader Preview
            </Link>
          </div>
        </aside>
      )}

      {/* Show tree toggle button when tree is hidden */}
      {!showTree && !focusMode && (
        <div className="flex flex-col justify-center shrink-0">
          <button
            onClick={() => setShowTree(true)}
            title="Show chapter tree (Ctrl+Shift+B)"
            className="p-2 m-1 bg-white border border-stone-200 rounded-lg text-stone-400 hover:text-teal-600 transition-all shadow-sm"
          >
            <FaChevronRight size={10} />
          </button>
        </div>
      )}

      {/* ── CENTER: Section Editor ────────────────────────────────────────── */}
      <SectionEditor
        chapter={activeChapter}
        blocks={blocks}
        onUpdateTitle={updateChapterTitle}
        onBlocksChange={handleBlocksChange}
        isSaving={isSaving}
        focusMode={focusMode}
      />

      {/* Focus mode escape hint */}
      {focusMode && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-gray-900/80 text-white text-[10px] font-bold px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-2">
            <FaCompress size={9} /> Focus Mode active · Press <kbd className="bg-white/20 px-1.5 rounded">Esc</kbd> or <kbd className="bg-white/20 px-1.5 rounded">F11</kbd> to exit
          </div>
        </div>
      )}

      {/* ── RIGHT PANEL: Intelligence ─────────────────────────────────────── */}
      {showIntelligence && !focusMode && publication && (
        <IntelligencePanel
          publication={publication}
          chapters={chapters}
          activeChapter={activeChapter}
          onClose={() => setShowIntelligence(false)}
        />
      )}
    </div>
  );
}

