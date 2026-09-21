"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";
import {
  FaArrowLeft, FaEdit, FaEye, FaGlobe, FaBookOpen,
  FaChevronDown, FaChevronUp, FaChevronRight, FaChevronLeft,
  FaPrint, FaExclamationTriangle, FaCheckCircle, FaTimesCircle,
  FaSpinner, FaLock, FaClock, FaRocket, FaTimes, FaSave
} from "react-icons/fa";
import { toast } from "react-hot-toast";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Block {
  type: "Heading" | "Paragraph" | "Quote" | "Callout" | "Key Insight" | "Reference" | "Checklist";
  text: string;
}

interface Page { id: string; content: string; pageNumber: number; }
interface Subchapter { id: string; title: string; order: number; summary: string; content: string; }
interface Chapter {
  id: string; title: string; order: number; status: string; summary: string;
  pages: Page[]; subchapters?: Subchapter[];
  sectionType?: "front-matter" | "chapter" | "back-matter";
}
interface Publication {
  id: string; title: string; subtitle?: string; author: string;
  description?: string; imagePath?: string; slug: string;
  publishedStatus: string; publicationType?: string;
  category?: string; language?: string; published?: string;
  chapters?: Chapter[];
}

// ─── Block Parser ──────────────────────────────────────────────────────────────

function parsePageContent(content: any): Block[] {
  if (!content) return [];
  if (Array.isArray(content)) return content;
  if (typeof content === "object") {
    if (Array.isArray(content.blocks)) return content.blocks;
    return [content];
  }
  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && typeof parsed === "object" && Array.isArray(parsed.blocks)) return parsed.blocks;
      if (parsed && typeof parsed === "object") return [parsed];
      return [];
    } catch {
      return content.trim() ? [{ type: "Paragraph", text: content }] : [];
    }
  }
  return [];
}

function EmptySection({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <FaExclamationTriangle className="text-amber-400 text-3xl mb-3" />
      <p className="text-sm font-bold text-gray-500">"{title}" has no content yet</p>
      <p className="text-xs text-gray-400 mt-1">Add content in the Manuscript Builder</p>
    </div>
  );
}

// ─── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    DRAFT: { label: "Draft", cls: "bg-stone-100 text-stone-600 border-stone-300", icon: <FaEdit size={9} /> },
    UNDER_REVIEW: { label: "Under Review", cls: "bg-amber-100 text-amber-700 border-amber-300", icon: <FaClock size={9} /> },
    SCHEDULED: { label: "Scheduled", cls: "bg-purple-100 text-purple-700 border-purple-300", icon: <FaClock size={9} /> },
    PUBLISHED: { label: "Published", cls: "bg-emerald-100 text-emerald-700 border-emerald-300", icon: <FaRocket size={9} /> },
  };
  const c = cfg[status] ?? cfg.DRAFT;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black ${c.cls}`}>
      {c.icon} {c.label}
    </span>
  );
}

// ─── Main Preview Page ─────────────────────────────────────────────────────────

export default function DashboardBookPreview({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [pub, setPub] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [expandedSubs, setExpandedSubs] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  // Editing Mode States
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedBlocks, setEditedBlocks] = useState<Block[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchPublication = (pubId: string) => {
    setLoading(true);
    api.get(`/publications/${pubId}`)
      .then(res => {
        setPub(res.data);
      })
      .catch(() => setPub(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    params.then(({ id: resolvedId }) => {
      setId(resolvedId);
      fetchPublication(resolvedId);
    });
  }, [params]);

  const handlePrint = () => window.print();

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

  const chapters = pub.chapters || [];
  const frontMatter = chapters.filter(c => c.sectionType === "front-matter");
  const mainChapters = chapters.filter(c => c.sectionType === "chapter" || !c.sectionType);
  const backMatter = chapters.filter(c => c.sectionType === "back-matter");
  const allSections = [...frontMatter, ...mainChapters, ...backMatter];

  const activeChapter = allSections[activeChapterIdx];
  const chapterContent = activeChapter?.pages?.[0]?.content ?? "";
  const hasContent = (() => {
    try { const b = parsePageContent(chapterContent); return Array.isArray(b) && b.some((x: Block) => x.text?.trim()); }
    catch { return false; }
  })();

  const filledCount = allSections.filter(c => {
    try { const b = parsePageContent(c.pages?.[0]?.content); return b.some((x: Block) => x.text?.trim()); }
    catch { return false; }
  }).length;

  const completionPct = allSections.length > 0 ? Math.round((filledCount / allSections.length) * 100) : 0;

  // Initialize Edit state buffers
  const startEditing = () => {
    if (!activeChapter) return;
    const confirmed = window.confirm(
      "You are editing the saved draft from preview mode. Changes will update the manuscript after saving."
    );
    if (!confirmed) return;

    setEditedTitle(activeChapter.title);
    setEditedBlocks(parsePageContent(chapterContent));
    setEditMode(true);
  };

  const cancelEditing = () => {
    setEditMode(false);
    setEditedTitle("");
    setEditedBlocks([]);
    toast("Edits reverted locally.");
  };

  const savePreviewEdits = async () => {
    if (!activeChapter) return;
    setSaving(true);
    try {
      const updatedContent = JSON.stringify(editedBlocks);
      const pageId = activeChapter.pages?.[0]?.id;

      // Update chapter title using existing API
      await api.put(`/publications/chapters/${activeChapter.id}`, {
        title: editedTitle,
        order: activeChapter.order,
        status: activeChapter.status,
        summary: activeChapter.summary,
        sectionType: activeChapter.sectionType
      });

      // Update page content using existing API
      if (pageId) {
        await api.put(`/publications/pages/${pageId}`, {
          content: updatedContent,
          pageNumber: activeChapter.pages[0].pageNumber || 1,
          chapterId: activeChapter.id
        });
      } else {
        await api.post(`/publications/pages`, {
          content: updatedContent,
          pageNumber: 1,
          chapterId: activeChapter.id
        });
      }

      toast.success("✓ Preview changes saved successfully!");
      setEditMode(false);
      fetchPublication(id);
    } catch (err: any) {
      toast.error("Failed to save inline changes.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleBlockChange = (index: number, text: string) => {
    setEditedBlocks(prev => prev.map((b, i) => i === index ? { ...b, text } : b));
  };

  const renderBlocks = (content: any, isSubchapter = false): React.ReactNode => {
    let blocks: Block[] = (editMode && !isSubchapter) ? editedBlocks : parsePageContent(content);
    if (!blocks.length) return <p className="text-gray-400 italic text-sm">This section is empty.</p>;
    return (
      <div className="space-y-4">
        {blocks.map((b, i) => {
          if (editMode && !isSubchapter) {
            return (
              <div key={i} className="flex flex-col gap-1.5 p-2 bg-stone-50 border border-stone-200 rounded-xl">
                <span className="text-[9px] font-black uppercase text-stone-400 tracking-wider px-1">{b.type}</span>
                <textarea
                  value={b.text}
                  onChange={e => handleBlockChange(i, e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-teal-400"
                  rows={b.type === "Paragraph" ? 3 : 1}
                />
              </div>
            );
          }
          switch (b.type) {
            case "Heading": return <h3 key={i} className="text-lg font-bold text-gray-900 mt-5 mb-2 border-b border-stone-100 pb-1">{b.text}</h3>;
            case "Quote": return <blockquote key={i} className="border-l-4 border-teal-400 pl-4 py-1 text-gray-600 italic bg-teal-50/50 rounded-r-lg">{b.text}</blockquote>;
            case "Callout": return <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 font-medium text-sm">{b.text}</div>;
            case "Key Insight": return <div key={i} className="bg-teal-50 border-l-4 border-teal-500 rounded-r-xl p-4 text-teal-800 font-semibold text-sm">💡 {b.text}</div>;
            case "Checklist": return <div key={i} className="flex items-start gap-2 text-sm text-gray-700"><FaCheckCircle className="text-teal-500 mt-0.5 shrink-0" size={12} /><span>{b.text}</span></div>;
            case "Reference": return <p key={i} className="text-xs text-gray-500 font-mono bg-stone-50 px-3 py-1.5 rounded-lg">{b.text}</p>;
            default: return <p key={i} className="text-gray-700 leading-relaxed text-[15px]">{b.text}</p>;
          }
        })}
      </div>
    );
  };

  const renderNavGroup = (label: string, group: Chapter[], colorClass: string) => {
    if (!group.length) return null;
    return (
      <div className="mb-3">
        <p className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 ${colorClass}`}>{label}</p>
        {group.map(ch => {
          const globalIdx = allSections.findIndex(s => s.id === ch.id);
          const isActive = globalIdx === activeChapterIdx;
          const filled = (() => { try { const b = parsePageContent(ch.pages?.[0]?.content); return b.some((x: Block) => x.text?.trim()); } catch { return false; } })();
          return (
            <div key={ch.id}>
              <button
                onClick={() => { 
                  if (editMode) {
                    const leave = window.confirm("You have unsaved edits. Discard and switch section?");
                    if (!leave) return;
                    setEditMode(false);
                  }
                  setActiveChapterIdx(globalIdx); 
                }}
                className={`w-full text-left flex items-center gap-2 px-3 py-2 text-xs transition-all ${isActive ? "bg-teal-50 text-teal-800 font-black border-r-2 border-teal-500" : "text-stone-600 hover:bg-stone-50 font-bold"}`}
              >
                {filled
                  ? <FaCheckCircle className="text-emerald-400 shrink-0" size={9} />
                  : <FaExclamationTriangle className="text-amber-300 shrink-0" size={9} />
                }
                <span className="flex-1 truncate">{ch.title}</span>
                {ch.subchapters && ch.subchapters.length > 0 && (
                  <button onClick={e => { e.stopPropagation(); setExpandedSubs(p => ({ ...p, [ch.id]: !p[ch.id] })); }}>
                    {expandedSubs[ch.id] ? <FaChevronUp size={7} /> : <FaChevronDown size={7} />}
                  </button>
                )}
              </button>
              {expandedSubs[ch.id] && ch.subchapters?.map(sub => (
                <div key={sub.id} className="pl-8 py-1.5 text-[10px] text-stone-500 hover:text-stone-800 hover:bg-stone-50 cursor-pointer transition-colors border-l-2 border-stone-100 ml-4">
                  {sub.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden print:block print:h-auto">

      {/* ── Sidebar ── */}
      <aside className={`${sidebarOpen ? "w-64" : "w-0"} shrink-0 bg-white border-r border-stone-200 flex flex-col overflow-hidden transition-all duration-300 print:hidden`}>
        {/* Sidebar header */}
        <div className="px-4 py-3 bg-gradient-to-br from-stone-900 to-stone-800 shrink-0">
          <button onClick={() => router.push(`/dashboard/business/publications/add?edit=${id}`)}
            className="flex items-center gap-2 text-stone-400 hover:text-white text-[10px] font-bold mb-2 transition-colors">
            <FaArrowLeft size={9} /> Back to Editor
          </button>
          <h2 className="text-xs font-black text-white leading-tight truncate">{pub.title}</h2>
          <div className="flex items-center gap-2 mt-2">
            <StatusBadge status={pub.publishedStatus} />
            <span className="text-[9px] text-stone-400">{completionPct}% complete</span>
          </div>
        </div>

        {/* Completion bar */}
        <div className="px-4 py-2 border-b border-stone-100 shrink-0">
          <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${completionPct}%` }} />
          </div>
          <p className="text-[9px] text-stone-400 mt-1">{filledCount}/{allSections.length} sections with content</p>
        </div>

        {/* Chapter nav */}
        <div className="flex-1 overflow-y-auto py-2">
          {renderNavGroup("Front Matter", frontMatter, "text-blue-500 bg-blue-50/50")}
          {renderNavGroup("Main Chapters", mainChapters, "text-teal-600 bg-teal-50/50")}
          {renderNavGroup("Back Matter", backMatter, "text-amber-600 bg-amber-50/50")}
          {allSections.length === 0 && (
            <div className="px-4 py-6 text-center">
              <FaBookOpen className="text-stone-300 text-2xl mx-auto mb-2" />
              <p className="text-xs text-stone-400">No sections yet. Build the manuscript first.</p>
            </div>
          )}
        </div>

        {/* Sidebar actions */}
        <div className="p-3 border-t border-stone-100 space-y-2 shrink-0">
          <Link href={`/dashboard/business/publications/${id}/public-preview`} target="_blank"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-black rounded-xl hover:bg-blue-100 transition-all">
            <FaGlobe size={9} /> Preview Public Page
          </Link>
          <button onClick={handlePrint}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-stone-50 border border-stone-200 text-stone-600 text-[10px] font-black rounded-xl hover:bg-stone-100 transition-all">
            <FaPrint size={9} /> Print / Save PDF
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col overflow-hidden print:block">

        {/* Topbar */}
        <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-stone-200 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(o => !o)}
              className="p-2 rounded-lg hover:bg-stone-100 text-stone-500 transition-colors">
              <FaBookOpen size={13} />
            </button>
            <div>
              <h1 className="text-sm font-black text-gray-900">{pub.title}</h1>
              {pub.subtitle && <p className="text-[10px] text-gray-400">{pub.subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={pub.publishedStatus} />
            
            {editMode ? (
              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  onClick={savePreviewEdits}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white text-[10px] font-black rounded-xl hover:bg-teal-700 transition-all cursor-pointer shadow-sm"
                >
                  {saving ? <FaSpinner className="animate-spin" size={9} /> : <FaSave size={9} />}
                  Save Preview Edits
                </button>
                <button 
                  type="button"
                  onClick={cancelEditing}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-150 border border-stone-300 text-stone-700 text-[10px] font-black rounded-xl hover:bg-stone-200 transition-all cursor-pointer"
                >
                  <FaTimes size={9} /> Cancel Edits
                </button>
              </div>
            ) : (
              <button 
                type="button"
                aria-label="Edit this publication"
                onClick={startEditing}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 border border-teal-200 text-teal-700 text-[10px] font-black rounded-xl hover:bg-teal-100 transition-all cursor-pointer"
              >
                <FaEdit size={9} /> Edit
              </button>
            )}

            <button 
              type="button"
              aria-label="View public preview of this publication"
              onClick={() => {
                router.push(`/dashboard/business/publications/${id}/public-preview`);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-black rounded-xl hover:bg-blue-100 transition-all cursor-pointer"
            >
              <FaGlobe size={9} /> Public Preview
            </button>
          </div>
        </div>

        {/* Chapter prev/next nav */}
        <div className="flex items-center justify-between px-6 py-2 bg-stone-50 border-b border-stone-100 shrink-0 print:hidden">
          <button onClick={() => {
            if (editMode) {
              const leave = window.confirm("You have unsaved edits. Discard and switch section?");
              if (!leave) return;
              setEditMode(false);
            }
            setActiveChapterIdx(i => Math.max(0, i - 1));
          }}
            disabled={activeChapterIdx === 0}
            className="flex items-center gap-1.5 text-[10px] font-black text-stone-500 hover:text-stone-800 disabled:opacity-30 transition-colors">
            <FaChevronLeft size={9} /> Previous
          </button>
          <span className="text-[10px] text-stone-400 font-bold">
            {activeChapter ? `${activeChapterIdx + 1} / ${allSections.length} — ${activeChapter.title}` : "No sections"}
          </span>
          <button onClick={() => {
            if (editMode) {
              const leave = window.confirm("You have unsaved edits. Discard and switch section?");
              if (!leave) return;
              setEditMode(false);
            }
            setActiveChapterIdx(i => Math.min(allSections.length - 1, i + 1));
          }}
            disabled={activeChapterIdx >= allSections.length - 1}
            className="flex items-center gap-1.5 text-[10px] font-black text-stone-500 hover:text-stone-800 disabled:opacity-30 transition-colors">
            Next <FaChevronRight size={9} />
          </button>
        </div>

        {/* Content area */}
        <div ref={contentRef} className="flex-1 overflow-y-auto print:overflow-visible">

          {/* Cover page */}
          {allSections.length === 0 && (
            <div className="max-w-3xl mx-auto px-8 py-16 text-center">
              <div className="w-32 h-44 bg-gradient-to-br from-stone-700 to-stone-900 rounded-xl mx-auto mb-8 flex items-center justify-center shadow-2xl">
                <FaBookOpen className="text-white text-4xl opacity-60" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">{pub.title}</h1>
              {pub.subtitle && <p className="text-lg text-gray-500 mb-4">{pub.subtitle}</p>}
              <p className="text-sm text-gray-400">by {pub.author}</p>
              <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl text-left">
                <p className="text-sm font-black text-amber-700 mb-1">⚠ Manuscript is empty</p>
                <p className="text-xs text-amber-600">Use the Manuscript Builder to add chapters and content before previewing.</p>
              </div>
            </div>
          )}

          {allSections.length > 0 && activeChapter && (
            <div className="max-w-3xl mx-auto px-8 py-12 print:py-6">
              {/* Section header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                    activeChapter.sectionType === "front-matter" ? "bg-blue-100 text-blue-600" :
                    activeChapter.sectionType === "back-matter" ? "bg-amber-100 text-amber-600" :
                    "bg-teal-100 text-teal-600"
                  }`}>
                    {activeChapter.sectionType === "front-matter" ? "Front Matter" :
                     activeChapter.sectionType === "back-matter" ? "Back Matter" : "Chapter"}
                  </span>
                  {!hasContent && (
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                      ⚠ No Content
                    </span>
                  )}
                </div>

                {editMode ? (
                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase text-stone-400 tracking-wider block">Chapter Title</span>
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={e => setEditedTitle(e.target.value)}
                      className="w-full text-lg font-bold p-2 bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-teal-400 text-gray-900"
                    />
                  </div>
                ) : (
                  <h1 className="text-2xl font-black text-gray-900">{activeChapter.title}</h1>
                )}

                {activeChapter.summary && (
                  <p className="text-sm text-gray-500 mt-2 font-medium italic">{activeChapter.summary}</p>
                )}
              </div>

              {/* Content blocks */}
              <div className="prose-like">
                {hasContent || editMode ? renderBlocks(chapterContent) : <EmptySection title={activeChapter.title} />}
              </div>

              {/* Subchapters */}
              {activeChapter.subchapters && activeChapter.subchapters.length > 0 && (
                <div className="mt-10 space-y-6">
                  <h2 className="text-sm font-black text-gray-600 uppercase tracking-wider border-t border-stone-100 pt-4">Sub-sections</h2>
                  {activeChapter.subchapters.map(sub => (
                    <div key={sub.id} className="pl-4 border-l-2 border-stone-100">
                      <h3 className="text-base font-bold text-gray-800 mb-3">{sub.title}</h3>
                      {sub.content ? renderBlocks(sub.content, true) : (
                        <p className="text-xs text-gray-400 italic">No content yet.</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Chapter footer nav */}
              <div className="flex justify-between mt-16 pt-6 border-t border-stone-100 print:hidden">
                <button onClick={() => {
                  if (editMode) {
                    const leave = window.confirm("You have unsaved edits. Discard and switch section?");
                    if (!leave) return;
                    setEditMode(false);
                  }
                  setActiveChapterIdx(i => Math.max(0, i - 1));
                }}
                  disabled={activeChapterIdx === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-600 text-xs font-black rounded-xl hover:bg-stone-200 disabled:opacity-30 transition-all">
                  <FaChevronLeft size={10} /> Previous Section
                </button>
                <button onClick={() => {
                  if (editMode) {
                    const leave = window.confirm("You have unsaved edits. Discard and switch section?");
                    if (!leave) return;
                    setEditMode(false);
                  }
                  setActiveChapterIdx(i => Math.min(allSections.length - 1, i + 1));
                }}
                  disabled={activeChapterIdx >= allSections.length - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-black rounded-xl hover:bg-teal-100 disabled:opacity-30 transition-all">
                  Next Section <FaChevronRight size={10} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
