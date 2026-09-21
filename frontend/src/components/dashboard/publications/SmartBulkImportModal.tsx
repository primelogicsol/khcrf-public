"use client";

/**
 * SmartBulkImportModal — Manuscript-Builder-Driven Structure-First Importer
 * ──────────────────────────────────────────────────────────────────────────
 * ARCHITECTURE:
 *  • existingChapters[] from Manuscript Builder = SINGLE SOURCE OF TRUTH
 *  • Slots are derived 1:1 from chapters — NEVER from blueprint templates
 *  • Uploaded files FILL existing slots — they NEVER create new nodes
 *  • onImport returns ChapterUpdate[] (index + content) not new chapters
 */

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes, FaUpload, FaCheck, FaSpinner,
  FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaTrash,
  FaMagic, FaArrowRight, FaFile, FaFileWord,
  FaFilePdf, FaFileCode, FaFileArchive,
  FaChevronDown, FaChevronUp, FaLayerGroup,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

// ─── Exported Types ────────────────────────────────────────────────────────────

/** Legacy type — kept for ManuscriptImportModal compatibility */
export interface ImportedChapter {
  title: string;
  content: string;
  summary: string;
  order: number;
  sectionType?: "front-matter" | "chapter" | "back-matter";
  sourceFile?: string;
}

/** UPDATE operation emitted by SmartBulkImportModal */
export interface ChapterUpdate {
  chapterIndex: number;
  chapterId?: string;
  title: string;
  content: string;
  summary: string;
  sourceFile: string;
}

// ─── Internal types ────────────────────────────────────────────────────────────

interface Block {
  type: "Heading" | "Paragraph" | "Quote" | "Callout" | "Key Insight" | "Reference" | "Checklist";
  text: string;
}

interface ExistingChapter {
  id?: string;
  title: string;
  order: number;
  status: string;
  summary: string;
  pages: Array<{ id?: string; content: string; pageNumber: number }>;
  subchapters?: Array<{ id?: string; title: string; order: number; summary: string; content: string; type?: string }>;
  sectionType?: "front-matter" | "chapter" | "back-matter";
}

interface ManuscriptSlot {
  chapterIndex: number;
  chapterId?: string;
  title: string;
  sectionType: "front-matter" | "chapter" | "back-matter";
  hasExistingContent: boolean;
  matchedFileId: string | null;
  content: string;
  confidence: number;
}

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  status: "pending" | "parsing" | "done" | "error";
  error?: string;
  parsedContent: string;
  assignedSlotIdx: number | null;
  isExtra: boolean;
}

interface SmartBulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (updates: ChapterUpdate[]) => void;
  existingChapters: ExistingChapter[];
  publicationBlueprint?: string;
  publicationTitle?: string;
}

// ─── Matching Engine ───────────────────────────────────────────────────────────

function normalise(s: string): string {
  return s.toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/^[0-9]+[_\-\s]+/, "")
    .replace(/[_\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractChapterNumber(s: string): number | undefined {
  const pats = [/chapter[_\s-]*(\d+)/i, /ch[_\s]?(\d+)/i, /^(\d+)[_\-\s]/, /section[_\s-]*(\d+)/i];
  for (const p of pats) {
    const m = s.match(p);
    if (m) return parseInt(m[1], 10);
  }
  return undefined;
}

function matchScore(filename: string, slotTitle: string): number {
  const fn = normalise(filename);
  const st = normalise(slotTitle);
  if (fn === st) return 99;
  if (fn.includes(st) || st.includes(fn)) return 92;
  const fnNum = extractChapterNumber(filename);
  const stNum = extractChapterNumber(slotTitle);
  if (fnNum !== undefined && stNum !== undefined && fnNum === stNum) return 95;
  const fnW = new Set(fn.split(" ").filter(w => w.length > 2));
  const stW = new Set(st.split(" ").filter(w => w.length > 2));
  if (fnW.size === 0 || stW.size === 0) return 0;
  const inter = [...fnW].filter(w => stW.has(w)).length;
  const union = new Set([...fnW, ...stW]).size;
  return Math.round((inter / union) * 80);
}

function autoMatchToSlot(filename: string, slots: ManuscriptSlot[]): number | null {
  let bestIdx: number | null = null;
  let bestScore = 45;
  for (const slot of slots) {
    if (slot.matchedFileId) continue;
    const score = matchScore(filename, slot.title);
    if (score > bestScore) { bestScore = score; bestIdx = slot.chapterIndex; }
  }
  return bestIdx;
}

// ─── File Parsers ──────────────────────────────────────────────────────────────

function textToBlocks(text: string): Block[] {
  const result: Block[] = [];
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t) continue;
    if (/^#{1,2}\s/.test(t)) result.push({ type: "Heading", text: t.replace(/^#+\s/, "") });
    else if (/^>\s/.test(t)) result.push({ type: "Quote", text: t.slice(2) });
    else if (/^[-*]\s/.test(t)) result.push({ type: "Checklist", text: t.slice(2) });
    else result.push({ type: "Paragraph", text: t });
  }
  return result;
}

function htmlToBlocks(html: string): Block[] {
  const blocks: Block[] = [];
  const doc = new DOMParser().parseFromString(html, "text/html");
  for (const el of Array.from(doc.body.children)) {
    const tag = el.tagName.toLowerCase();
    const text = el.textContent?.trim() || "";
    if (!text) continue;
    if (tag === "h1" || tag === "h2" || tag === "h3") blocks.push({ type: "Heading", text });
    else if (tag === "blockquote") blocks.push({ type: "Quote", text });
    else if (tag === "ul" || tag === "ol") {
      for (const li of Array.from(el.querySelectorAll("li")))
        blocks.push({ type: "Checklist", text: li.textContent?.trim() || "" });
    } else blocks.push({ type: "Paragraph", text });
  }
  return blocks;
}

async function loadPDFJS(): Promise<any> {
  if ((window as any).pdfjsLib) return (window as any).pdfjsLib;
  return new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    s.onload = () => {
      const lib = (window as any).pdfjsLib;
      lib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      res(lib);
    };
    s.onerror = rej;
    document.head.appendChild(s);
  });
}

async function parseFileToContent(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();
  try {
    if (ext === "docx" || ext === "doc") {
      const mammoth = await import("mammoth");
      const result = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
      const blocks = htmlToBlocks(result.value);
      return JSON.stringify(blocks.length ? blocks : [{ type: "Paragraph", text: "" }]);
    }
    if (ext === "pdf") {
      const pdfjsLib = await loadPDFJS();
      const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const tc = await page.getTextContent();
        text += tc.items.map((it: any) => it.str).join(" ") + "\n\n";
      }
      const blocks = textToBlocks(text);
      return JSON.stringify(blocks.length ? blocks : [{ type: "Paragraph", text: text.slice(0, 2000) }]);
    }
    const text = await file.text();
    const blocks = textToBlocks(text);
    return JSON.stringify(blocks.length ? blocks : [{ type: "Paragraph", text: text.slice(0, 2000) }]);
  } catch (err: any) {
    throw new Error(err?.message || "Parse failed");
  }
}

// ─── Slot builder ──────────────────────────────────────────────────────────────

function buildSlotsFromChapters(chapters: ExistingChapter[]): ManuscriptSlot[] {
  return chapters.map((ch, idx) => {
    let hasContent = false;
    try {
      const blocks: Block[] = JSON.parse(ch.pages[0]?.content || "[]");
      hasContent = blocks.some(b => b.text.trim().length > 0);
    } catch { hasContent = false; }
    return {
      chapterIndex: idx,
      chapterId: ch.id,
      title: ch.title,
      sectionType: ch.sectionType ?? "chapter",
      hasExistingContent: hasContent,
      matchedFileId: null,
      content: ch.pages[0]?.content ?? JSON.stringify([{ type: "Paragraph", text: "" }]),
      confidence: 0,
    };
  });
}

function suggestFilename(title: string): string {
  const num = extractChapterNumber(title);
  const kebab = title.replace(/\s+/g, "_");
  if (num !== undefined) return `Chapter_${String(num).padStart(2, "0")}_[Title].docx`;
  return `${kebab}.docx`;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function FileIcon({ name }: { name: string }) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "docx" || ext === "doc") return <FaFileWord className="text-blue-500" />;
  if (ext === "pdf") return <FaFilePdf className="text-red-500" />;
  if (ext === "md" || ext === "txt") return <FaFileCode className="text-purple-500" />;
  if (ext === "zip") return <FaFileArchive className="text-amber-500" />;
  return <FaFile className="text-stone-400" />;
}

function ProgressRing({ pct }: { pct: number }) {
  const r = 33;
  const circ = 2 * Math.PI * r;
  const color = pct >= 80 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#f87171";
  return (
    <svg width={80} height={80} viewBox="0 0 80 80">
      <circle cx={40} cy={40} r={r} fill="none" stroke="#e5e7eb" strokeWidth={7} />
      <circle cx={40} cy={40} r={r} fill="none" stroke={color} strokeWidth={7}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
        strokeLinecap="round" transform="rotate(-90 40 40)"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text x={40} y={45} textAnchor="middle" fontSize={14} fontWeight="900" fill={color}>{Math.round(pct)}%</text>
    </svg>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function SmartBulkImportModal({
  isOpen, onClose, onImport, existingChapters,
  publicationBlueprint = "", publicationTitle = "",
}: SmartBulkImportModalProps) {
  const globalInputRef = useRef<HTMLInputElement>(null);
  const slotInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const [slots, setSlots] = useState<ManuscriptSlot[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSlots(buildSlotsFromChapters(existingChapters));
      setUploadedFiles([]);
      setExpandedIdx(null);
    }
  }, [isOpen, existingChapters]);

  // Stats
  const filledSlots = slots.filter(s => s.matchedFileId !== null);
  const emptySlots = slots.filter(s => s.matchedFileId === null && !s.hasExistingContent);
  const alreadyFilled = slots.filter(s => s.hasExistingContent && !s.matchedFileId);
  const extraFiles = uploadedFiles.filter(f => f.isExtra && f.status === "done");
  const completionPct = slots.length > 0
    ? Math.round(((filledSlots.length + alreadyFilled.length) / slots.length) * 100)
    : 0;

  const frontSlots = slots.filter(s => s.sectionType === "front-matter");
  const mainSlots = slots.filter(s => s.sectionType === "chapter");
  const backSlots = slots.filter(s => s.sectionType === "back-matter");

  // Process uploaded files
  const processFiles = useCallback(async (files: File[], targetSlotIdx?: number) => {
    const newUFs: UploadedFile[] = files.map((f, i) => ({
      id: `uf-${Date.now()}-${i}`,
      file: f,
      name: f.name,
      size: f.size,
      status: "pending" as const,
      parsedContent: "",
      assignedSlotIdx: targetSlotIdx ?? null,
      isExtra: false,
    }));
    setUploadedFiles(prev => [...prev, ...newUFs]);

    for (const uf of newUFs) {
      setUploadedFiles(prev => prev.map(f => f.id === uf.id ? { ...f, status: "parsing" } : f));
      try {
        const content = await parseFileToContent(uf.file);
        setSlots(prevSlots => {
          let slotIdx: number | null = targetSlotIdx ?? autoMatchToSlot(uf.name, prevSlots);
          // If auto-matched slot already filled, mark as extra
          if (slotIdx !== null) {
            const slot = prevSlots.find(s => s.chapterIndex === slotIdx);
            if (slot?.matchedFileId) slotIdx = null;
          }
          const confidence = slotIdx !== null
            ? matchScore(uf.name, prevSlots.find(s => s.chapterIndex === slotIdx)?.title ?? "")
            : 0;
          const updatedSlots = prevSlots.map(s =>
            s.chapterIndex === slotIdx ? { ...s, matchedFileId: uf.id, content, confidence } : s
          );
          setUploadedFiles(prev => prev.map(f =>
            f.id === uf.id
              ? { ...f, status: "done", parsedContent: content, assignedSlotIdx: slotIdx, isExtra: slotIdx === null }
              : f
          ));
          return updatedSlots;
        });
      } catch (err: any) {
        setUploadedFiles(prev => prev.map(f =>
          f.id === uf.id ? { ...f, status: "error", error: err?.message } : f
        ));
        toast.error(`Failed to parse ${uf.name}`);
      }
    }
  }, []);

  const handleDrop = (e: React.DragEvent, targetSlotIdx?: number) => {
    e.preventDefault(); setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) processFiles(files, targetSlotIdx);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, targetSlotIdx?: number) => {
    const files = Array.from(e.target.files || []);
    if (files.length) processFiles(files, targetSlotIdx);
    e.target.value = "";
  };

  const reassignFile = (fileId: string, newSlotIdx: number) => {
    const uf = uploadedFiles.find(f => f.id === fileId);
    if (!uf) return;
    setSlots(prev => prev.map(s => {
      if (s.matchedFileId === fileId) return { ...s, matchedFileId: null, confidence: 0 };
      if (s.chapterIndex === newSlotIdx) return { ...s, matchedFileId: fileId, content: uf.parsedContent, confidence: matchScore(uf.name, s.title) };
      return s;
    }));
    setUploadedFiles(prev => prev.map(f =>
      f.id === fileId ? { ...f, assignedSlotIdx: newSlotIdx, isExtra: false } : f
    ));
  };

  const removeFile = (fileId: string) => {
    setSlots(prev => prev.map(s => s.matchedFileId === fileId ? { ...s, matchedFileId: null, confidence: 0 } : s));
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const clearSlot = (slotIdx: number) => {
    const slot = slots.find(s => s.chapterIndex === slotIdx);
    if (!slot) return;
    if (slot.matchedFileId) {
      setUploadedFiles(prev => prev.map(f =>
        f.id === slot.matchedFileId ? { ...f, assignedSlotIdx: null, isExtra: true } : f
      ));
    }
    setSlots(prev => prev.map(s =>
      s.chapterIndex === slotIdx ? { ...s, matchedFileId: null, confidence: 0 } : s
    ));
  };

  const handleConfirm = () => {
    const updates: ChapterUpdate[] = slots
      .filter(s => s.matchedFileId !== null)
      .map(s => {
        const uf = uploadedFiles.find(f => f.id === s.matchedFileId);
        let summary = "";
        try {
          const blocks: Block[] = JSON.parse(s.content);
          summary = blocks.filter(b => b.type === "Paragraph").slice(0, 1).map(b => b.text).join(" ").slice(0, 120);
        } catch { /* no-op */ }
        return { chapterIndex: s.chapterIndex, chapterId: s.chapterId, title: s.title, content: s.content, summary, sourceFile: uf?.name ?? "" };
      });

    if (updates.length === 0) { toast.error("No files assigned to slots yet."); return; }
    onImport(updates);
    onClose();
  };

  if (!isOpen) return null;

  // Slot renderer
  const renderSlot = (slot: ManuscriptSlot) => {
    const uf = uploadedFiles.find(f => f.id === slot.matchedFileId);
    const filled = slot.matchedFileId !== null;
    const hasPre = slot.hasExistingContent && !filled;

    return (
      <div key={slot.chapterIndex}
        className={`mb-1 rounded-xl border overflow-hidden transition-all ${
          filled ? "border-emerald-300 bg-emerald-50/40" :
          hasPre ? "border-stone-300 bg-stone-50" : "border-stone-200 bg-white"
        }`}
      >
        <div className="flex items-center gap-2 px-3 py-2.5 group">
          {filled
            ? <FaCheckCircle className="text-emerald-500 shrink-0" size={12} />
            : hasPre
              ? <div className="w-3 h-3 rounded-full border-2 border-stone-400 shrink-0" />
              : <FaTimesCircle className="text-stone-200 shrink-0" size={12} />
          }
          <span className="text-[9px] font-black text-stone-400 w-5 text-center shrink-0">{slot.chapterIndex + 1}</span>
          <span className={`flex-1 text-xs font-bold truncate ${
            filled ? "text-emerald-800" : hasPre ? "text-stone-600" : "text-stone-400"
          }`}>
            {slot.title}
            {hasPre && <span className="ml-1.5 text-[8px] text-stone-400 font-normal">(has content)</span>}
          </span>
          {filled && slot.confidence > 0 && (
            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${
              slot.confidence >= 90 ? "bg-emerald-100 text-emerald-700" :
              slot.confidence >= 70 ? "bg-amber-100 text-amber-700" : "bg-orange-100 text-orange-700"
            }`}>{slot.confidence}%</span>
          )}
          {filled && uf && (
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[9px] text-stone-500 truncate max-w-[80px]">{uf.name}</span>
              <button onClick={() => clearSlot(slot.chapterIndex)}
                className="p-1 rounded hover:bg-red-100 text-stone-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                <FaTrash size={8} />
              </button>
            </div>
          )}
          {!filled && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button onClick={() => slotInputRefs.current[slot.chapterIndex]?.click()}
                className="flex items-center gap-1 px-2 py-1 bg-teal-50 border border-teal-200 text-teal-700 text-[9px] font-black rounded-lg hover:bg-teal-100">
                <FaUpload size={7} /> Upload
              </button>
              <input type="file" ref={el => { slotInputRefs.current[slot.chapterIndex] = el; }}
                accept=".docx,.doc,.pdf,.md,.txt" className="hidden"
                onChange={e => handleInput(e, slot.chapterIndex)} />
            </div>
          )}
          <button onClick={() => setExpandedIdx(expandedIdx === slot.chapterIndex ? null : slot.chapterIndex)}
            className="p-1 rounded text-stone-300 hover:text-stone-600 transition-colors">
            {expandedIdx === slot.chapterIndex ? <FaChevronUp size={8} /> : <FaChevronDown size={8} />}
          </button>
        </div>

        <AnimatePresence>
          {expandedIdx === slot.chapterIndex && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-stone-100">
              <div className="px-4 py-3 bg-white/80 space-y-2">
                {filled && (
                  <p className="text-[10px] font-serif text-stone-600 line-clamp-3 leading-relaxed">
                    {(() => { try { return (JSON.parse(slot.content) as Block[]).filter(b => b.type === "Paragraph").map(b => b.text).join(" ").slice(0, 200) || "No text"; } catch { return "No preview"; } })()}
                  </p>
                )}
                {extraFiles.length > 0 && !filled && (
                  <div>
                    <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1.5">Assign Unmatched File</p>
                    <div className="flex flex-wrap gap-1.5">
                      {extraFiles.map(ef => (
                        <button key={ef.id} onClick={() => reassignFile(ef.id, slot.chapterIndex)}
                          className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-[9px] font-bold rounded-lg hover:bg-amber-100">
                          <FileIcon name={ef.name} /> {ef.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {!filled && (
                  <p className="text-[9px] text-stone-400">
                    Suggested: <span className="font-mono">{suggestFilename(slot.title)}</span>
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderGroup = (label: string, groupSlots: ManuscriptSlot[], colorClass: string) => {
    if (groupSlots.length === 0) return null;
    const filled = groupSlots.filter(s => s.matchedFileId !== null).length;
    return (
      <div className="mb-4">
        <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-1.5 rounded-lg mb-1.5 ${colorClass}`}>
          {label} · {filled}/{groupSlots.length}
        </div>
        {groupSlots.map(renderSlot)}
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3"
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full flex flex-col overflow-hidden"
          style={{ maxWidth: "1100px", height: "92vh" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-stone-900 to-stone-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 flex items-center justify-center">
                <FaMagic className="text-teal-400" size={15} />
              </div>
              <div>
                <h2 className="text-sm font-black text-white">Manuscript-Aware File Import</h2>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  {publicationTitle && <span className="text-teal-400 font-bold">{publicationTitle} · </span>}
                  {existingChapters.length} manuscript sections · files fill existing slots only
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-stone-400 hover:text-white transition-colors">
              <FaTimes size={14} />
            </button>
          </div>

          {/* Empty state */}
          {existingChapters.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <FaExclamationTriangle className="text-amber-400 text-4xl mb-4" />
              <p className="text-base font-black text-gray-900">Manuscript Builder is empty</p>
              <p className="text-sm text-gray-500 mt-2 max-w-md">
                Use <strong>Generate Structure</strong> or <strong>Add Chapter</strong> in the Manuscript Builder first.
                The importer fills existing sections — it never creates new ones.
              </p>
            </div>
          )}

          {/* Three-panel body */}
          {existingChapters.length > 0 && (
            <div className="flex flex-1 overflow-hidden">

              {/* LEFT — Manuscript structure */}
              <div className="w-72 shrink-0 border-r border-stone-200 overflow-y-auto bg-stone-50/70 p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Manuscript Structure</p>
                  <span className="text-[9px] font-black text-teal-600 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                    {existingChapters.length} sections
                  </span>
                </div>
                {renderGroup("Front Matter", frontSlots, "text-blue-600 bg-blue-50")}
                {renderGroup("Main Chapters", mainSlots, "text-teal-600 bg-teal-50")}
                {renderGroup("Back Matter", backSlots, "text-amber-600 bg-amber-50")}
              </div>

              {/* CENTER — Drop zone + uploaded files */}
              <div className="flex-1 flex flex-col overflow-hidden border-r border-stone-200">
                <div className="p-4 border-b border-stone-200 shrink-0"
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => handleDrop(e)}
                >
                  <div onClick={() => globalInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2 text-center cursor-pointer transition-all ${
                      dragOver ? "border-teal-400 bg-teal-50" : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                    }`}
                  >
                    <input ref={globalInputRef} type="file" multiple accept=".docx,.doc,.pdf,.md,.txt"
                      onChange={e => handleInput(e)} className="hidden" />
                    <FaUpload className={dragOver ? "text-teal-500 text-xl" : "text-stone-400 text-xl"} />
                    <div>
                      <p className="text-sm font-black text-gray-700">Drop chapter files or <span className="text-teal-600">click to browse</span></p>
                      <p className="text-[10px] text-stone-400 mt-0.5">Each file auto-matches to an existing manuscript slot</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">
                    Uploaded Files ({uploadedFiles.length})
                  </p>
                  {uploadedFiles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-stone-300">
                      <FaLayerGroup className="text-3xl mb-2" />
                      <p className="text-xs font-bold">No files yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {uploadedFiles.map(uf => {
                        const slot = slots.find(s => s.chapterIndex === uf.assignedSlotIdx);
                        return (
                          <div key={uf.id} className={`flex items-center gap-3 p-3 rounded-xl border ${
                            uf.isExtra ? "bg-amber-50 border-amber-200" :
                            uf.status === "error" ? "bg-red-50 border-red-200" : "bg-white border-stone-200"
                          }`}>
                            <div className="text-base shrink-0"><FileIcon name={uf.name} /></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-gray-800 truncate">{uf.name}</p>
                              <p className="text-[9px] text-stone-400 mt-0.5">
                                {(uf.size / 1024).toFixed(1)} KB ·{" "}
                                {uf.status === "parsing" ? <span className="text-amber-500 font-bold">Parsing…</span>
                                  : uf.status === "error" ? <span className="text-red-500 font-bold">{uf.error}</span>
                                  : slot ? <span className="text-emerald-600 font-bold">→ {slot.title}</span>
                                  : <span className="text-amber-600 font-bold">⚠ No matching slot</span>}
                              </p>
                            </div>
                            <div className="shrink-0">
                              {uf.status === "parsing" && <FaSpinner className="text-amber-500 animate-spin" size={12} />}
                              {uf.status === "done" && !uf.isExtra && <FaCheckCircle className="text-emerald-500" size={12} />}
                              {uf.status === "done" && uf.isExtra && <FaExclamationTriangle className="text-amber-500" size={12} />}
                              {uf.status === "error" && <FaTimesCircle className="text-red-500" size={12} />}
                            </div>
                            {uf.status === "done" && (
                              <select value={uf.assignedSlotIdx ?? ""}
                                onChange={e => { if (e.target.value !== "") reassignFile(uf.id, parseInt(e.target.value)); }}
                                className="text-[9px] border border-stone-200 rounded-lg px-2 py-1 bg-white text-stone-600 focus:outline-none cursor-pointer max-w-[130px] shrink-0">
                                <option value="">Assign to…</option>
                                {slots.map(s => (
                                  <option key={s.chapterIndex} value={s.chapterIndex}
                                    disabled={!!(s.matchedFileId && s.matchedFileId !== uf.id)}>
                                    {s.title}
                                  </option>
                                ))}
                              </select>
                            )}
                            <button onClick={() => removeFile(uf.id)}
                              className="p-1.5 rounded-lg hover:bg-red-100 text-stone-300 hover:text-red-500 shrink-0">
                              <FaTrash size={9} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {extraFiles.length > 0 && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="text-[9px] font-black text-amber-700 uppercase tracking-widest mb-1">
                        ⚠ {extraFiles.length} Unmatched — expand a slot on the left to assign
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT — Gap analysis */}
              <div className="w-60 shrink-0 overflow-y-auto p-4 bg-white">
                <div className="flex flex-col items-center mb-5 pt-2">
                  <ProgressRing pct={completionPct} />
                  <p className="text-xs font-black text-gray-800 mt-2">Upload Coverage</p>
                  <p className="text-[10px] text-stone-500 mt-0.5">{filledSlots.length} / {slots.length} slots filled</p>
                </div>

                {[
                  { label: "Front Matter", groupSlots: frontSlots, color: "bg-blue-400" },
                  { label: "Main Chapters", groupSlots: mainSlots, color: "bg-teal-400" },
                  { label: "Back Matter", groupSlots: backSlots, color: "bg-amber-400" },
                ].map(({ label, groupSlots, color }) => {
                  const done = groupSlots.filter(s => s.matchedFileId !== null).length;
                  return (
                    <div key={label} className="mb-3">
                      <div className="flex justify-between text-[9px] mb-1">
                        <span className="font-bold text-stone-600">{label}</span>
                        <span className="font-black text-stone-700">{done}/{groupSlots.length}</span>
                      </div>
                      <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div className={`h-full ${color} rounded-full transition-all duration-500`}
                          style={{ width: groupSlots.length ? `${(done / groupSlots.length) * 100}%` : "0%" }} />
                      </div>
                    </div>
                  );
                })}

                {emptySlots.length > 0 && (
                  <div className="mt-4">
                    <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest mb-2">Still Empty</p>
                    <div className="space-y-1">
                      {emptySlots.slice(0, 6).map((s, i) => (
                        <div key={s.chapterIndex} className="flex items-start gap-2 text-[9px] text-stone-500">
                          <span className="w-4 h-4 rounded bg-stone-100 font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                          <span className="font-mono text-stone-600 leading-tight">{suggestFilename(s.title)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filledSlots.length > 0 && emptySlots.length === 0 && (
                  <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                    <FaCheckCircle className="text-emerald-500 text-xl mx-auto mb-1" />
                    <p className="text-[10px] font-black text-emerald-700">All slots filled!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-stone-200 bg-stone-50 shrink-0">
            <div className="text-[11px] text-stone-500 space-x-3">
              <span><span className="font-black text-gray-800">{filledSlots.length}</span> files assigned</span>
              {extraFiles.length > 0 && <span className="text-amber-600 font-black">· {extraFiles.length} unmatched</span>}
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="px-4 py-2.5 bg-stone-100 text-stone-700 text-xs font-black rounded-xl hover:bg-stone-200 transition-all">
                Cancel
              </button>
              <button onClick={handleConfirm} disabled={filledSlots.length === 0}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-xs font-black rounded-xl hover:opacity-90 shadow-md shadow-teal-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                <FaCheck size={10} />
                Update {filledSlots.length} Section{filledSlots.length !== 1 ? "s" : ""}
                <FaArrowRight size={9} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
