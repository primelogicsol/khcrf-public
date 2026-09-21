"use client";

/**
 * ManuscriptImportModal
 * ─────────────────────
 * Fully functional client-side import for:
 *  • DOCX  – mammoth.js  → extracts HTML → converts to blocks
 *  • PDF   – PDF.js CDN  → extracts raw text → splits by headings
 *  • Markdown – regex parser → headings become chapters
 *  • ZIP   – JSZip       → each file → chapter (DOCX/TXT/MD)
 *  • CSV   – PapaParse   → rows become chapters with metadata
 *  • Bulk Upload – multiple files (DOCX/TXT/MD) → each → chapter
 */

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes, FaFileWord, FaFilePdf, FaFileCode, FaFileArchive,
  FaTable, FaUpload, FaCheck, FaSpinner, FaExclamationTriangle,
  FaTrash, FaEye, FaArrowRight, FaMagic, FaChevronDown,
  FaChevronUp, FaFolder, FaRedo,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import Papa from "papaparse";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ImportedChapter {
  title: string;
  content: string; // JSON-stringified Block[]
  summary: string;
  order: number;
  sectionType?: "front-matter" | "chapter" | "back-matter";
  sourceFile?: string;
}

interface Block {
  type: "Heading" | "Paragraph" | "Quote" | "Callout" | "Key Insight" | "Reference" | "Checklist";
  text: string;
}

interface FileStatus {
  name: string;
  size: number;
  status: "pending" | "processing" | "done" | "error";
  error?: string;
  chapters?: ImportedChapter[];
}

type ImportMode = "docx" | "pdf" | "markdown" | "zip" | "csv" | "bulk";

interface ManuscriptImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (chapters: ImportedChapter[]) => void;
  publicationTitle?: string;
  initialMode?: ImportMode;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MODE_CONFIG: Record<ImportMode, {
  label: string;
  icon: React.ReactNode;
  accept: string;
  multiple: boolean;
  color: string;
  desc: string;
  hint: string;
}> = {
  docx: {
    label: "Import DOCX",
    icon: <FaFileWord />,
    accept: ".docx,.doc",
    multiple: false,
    color: "text-blue-600 bg-blue-50 border-blue-200",
    desc: "Microsoft Word document",
    hint: "Headings (H1/H2/H3) become chapters. Paragraphs become content blocks.",
  },
  pdf: {
    label: "Import PDF",
    icon: <FaFilePdf />,
    accept: ".pdf",
    multiple: false,
    color: "text-red-600 bg-red-50 border-red-200",
    desc: "PDF document",
    hint: "Text is extracted and split by detected headings. Best with text-based PDFs.",
  },
  markdown: {
    label: "Import Markdown",
    icon: <FaFileCode />,
    accept: ".md,.markdown,.txt",
    multiple: false,
    color: "text-purple-600 bg-purple-50 border-purple-200",
    desc: "Markdown or plain text file",
    hint: "# Heading 1 → new chapter. ## Heading 2 → subheading block. Paragraphs preserved.",
  },
  zip: {
    label: "Import ZIP",
    icon: <FaFileArchive />,
    accept: ".zip",
    multiple: false,
    color: "text-amber-600 bg-amber-50 border-amber-200",
    desc: "ZIP archive of multiple files",
    hint: "Each DOCX/MD/TXT file in the ZIP becomes a chapter. Files are sorted alphabetically.",
  },
  csv: {
    label: "Import CSV",
    icon: <FaTable />,
    accept: ".csv",
    multiple: false,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    desc: "CSV spreadsheet",
    hint: "Columns: title, content, summary, section_type. Each row becomes a chapter.",
  },
  bulk: {
    label: "Bulk Upload",
    icon: <FaUpload />,
    accept: ".docx,.doc,.md,.markdown,.txt",
    multiple: true,
    color: "text-teal-600 bg-teal-50 border-teal-200",
    desc: "Multiple DOCX / Markdown / TXT files",
    hint: "Each file becomes a chapter. Sorted by filename. Prefix with 00_, 01_, 02_ for order.",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function textToBlocks(text: string): Block[] {
  if (!text.trim()) return [];
  const lines = text.split("\n");
  const blocks: Block[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("# ")) {
      blocks.push({ type: "Heading", text: trimmed.slice(2) });
    } else if (trimmed.startsWith("## ") || trimmed.startsWith("### ")) {
      blocks.push({ type: "Heading", text: trimmed.replace(/^#{2,3} /, "") });
    } else if (trimmed.startsWith("> ")) {
      blocks.push({ type: "Quote", text: trimmed.slice(2) });
    } else if (trimmed.startsWith("- [ ] ") || trimmed.startsWith("* ")) {
      blocks.push({ type: "Checklist", text: trimmed.replace(/^[-*]\s*(\[.\]\s*)?/, "") });
    } else if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      blocks.push({ type: "Key Insight", text: trimmed.slice(2, -2) });
    } else {
      blocks.push({ type: "Paragraph", text: trimmed });
    }
  }
  return blocks;
}

function htmlToBlocks(html: string): Block[] {
  // Simple HTML→block parser for mammoth output
  const blocks: Block[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const elements = doc.body.children;
  for (const el of Array.from(elements)) {
    const tag = el.tagName.toLowerCase();
    const text = el.textContent?.trim() || "";
    if (!text) continue;
    if (tag === "h1" || tag === "h2") {
      blocks.push({ type: "Heading", text });
    } else if (tag === "h3" || tag === "h4") {
      blocks.push({ type: "Heading", text });
    } else if (tag === "blockquote") {
      blocks.push({ type: "Quote", text });
    } else if (tag === "ul" || tag === "ol") {
      for (const li of Array.from(el.querySelectorAll("li"))) {
        blocks.push({ type: "Checklist", text: li.textContent?.trim() || "" });
      }
    } else {
      blocks.push({ type: "Paragraph", text });
    }
  }
  return blocks;
}

function splitIntoChapters(
  text: string,
  sourceFile: string = ""
): ImportedChapter[] {
  // Split on markdown-style headings or "Chapter N" / numbered sections
  const chapterPattern = /^(#{1,2}\s.+|Chapter\s+\d+.*|^\d+\.\s+.+)$/m;
  const lines = text.split("\n");
  const chapters: ImportedChapter[] = [];
  let currentTitle = sourceFile.replace(/\.[^.]+$/, "").replace(/^\d+[_-]/, "") || "Introduction";
  let currentLines: string[] = [];
  let order = 1;

  const flush = () => {
    const content = currentLines.join("\n").trim();
    if (content || currentTitle) {
      const blocks = textToBlocks(content);
      const firstPara = blocks.find(b => b.type === "Paragraph")?.text || "";
      chapters.push({
        title: currentTitle,
        content: JSON.stringify(blocks),
        summary: firstPara.slice(0, 120) + (firstPara.length > 120 ? "…" : ""),
        order: order++,
        sectionType: "chapter",
        sourceFile,
      });
    }
    currentLines = [];
  };

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,2})\s+(.+)/) ||
      line.match(/^(Chapter\s+\d+[:\s].*)$/i) ||
      line.match(/^(\d+\.\s+[A-Z].{3,})$/);

    if (headingMatch && currentLines.length > 0) {
      flush();
      currentTitle = (headingMatch[2] || headingMatch[1] || line).trim().replace(/^#+\s*/, "");
    } else if (headingMatch && currentLines.length === 0) {
      currentTitle = (headingMatch[2] || headingMatch[1] || line).trim().replace(/^#+\s*/, "");
    } else {
      currentLines.push(line);
    }
  }
  flush();

  return chapters.filter(c => c.content !== "[]" && c.content !== JSON.stringify([]));
}

// Detect section type from filename
function detectSectionType(filename: string): ImportedChapter["sectionType"] {
  const lower = filename.toLowerCase();
  if (lower.includes("cover") || lower.includes("preface") || lower.includes("foreword") ||
      lower.includes("copyright") || lower.includes("front") || lower.includes("intro") ||
      lower.includes("acknowledgement") || lower.includes("abstract")) {
    return "front-matter";
  }
  if (lower.includes("appendix") || lower.includes("appendic") || lower.includes("glossary") ||
      lower.includes("reference") || lower.includes("bibliography") || lower.includes("index") ||
      lower.includes("back") || lower.includes("faq") || lower.includes("credits")) {
    return "back-matter";
  }
  return "chapter";
}

// ─── Format parsers ───────────────────────────────────────────────────────────

async function parseDOCX(file: File): Promise<ImportedChapter[]> {
  // Dynamically import mammoth (client-only)
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });

  // Split HTML by h1/h2 headings into chapters
  const html = result.value;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const elements = Array.from(doc.body.children);

  const chapters: ImportedChapter[] = [];
  let currentTitle = file.name.replace(/\.[^.]+$/, "");
  let currentBlocks: Block[] = [];
  let order = 1;

  const flush = () => {
    if (currentBlocks.length > 0 || currentTitle) {
      const firstPara = currentBlocks.find(b => b.type === "Paragraph")?.text || "";
      chapters.push({
        title: currentTitle,
        content: JSON.stringify(currentBlocks),
        summary: firstPara.slice(0, 120),
        order: order++,
        sectionType: detectSectionType(currentTitle),
        sourceFile: file.name,
      });
    }
    currentBlocks = [];
  };

  for (const el of elements) {
    const tag = el.tagName.toLowerCase();
    const text = el.textContent?.trim() || "";
    if (!text) continue;

    if (tag === "h1" || tag === "h2") {
      if (currentBlocks.length > 0) flush();
      currentTitle = text;
    } else if (tag === "h3" || tag === "h4") {
      currentBlocks.push({ type: "Heading", text });
    } else if (tag === "blockquote") {
      currentBlocks.push({ type: "Quote", text });
    } else if (tag === "ul" || tag === "ol") {
      for (const li of Array.from(el.querySelectorAll("li"))) {
        currentBlocks.push({ type: "Checklist", text: li.textContent?.trim() || "" });
      }
    } else {
      currentBlocks.push({ type: "Paragraph", text });
    }
  }
  flush();

  // If no headings found, treat whole file as one chapter
  if (chapters.length === 0) {
    const allBlocks = htmlToBlocks(html);
    const firstPara = allBlocks.find(b => b.type === "Paragraph")?.text || "";
    chapters.push({
      title: file.name.replace(/\.[^.]+$/, ""),
      content: JSON.stringify(allBlocks),
      summary: firstPara.slice(0, 120),
      order: 1,
      sectionType: detectSectionType(file.name),
      sourceFile: file.name,
    });
  }

  return chapters;
}

async function parsePDF(file: File): Promise<ImportedChapter[]> {
  // Use PDF.js via CDN (dynamically loaded)
  const pdfjsLib = await loadPDFJS();

  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdfDoc.numPages;

  let fullText = "";
  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(" ")
      .replace(/\s+/g, " ");
    fullText += pageText + "\n\n";
  }

  return splitIntoChapters(fullText, file.name);
}

async function loadPDFJS(): Promise<any> {
  // Check if already loaded
  if ((window as any).pdfjsLib) return (window as any).pdfjsLib;

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = () => {
      const lib = (window as any).pdfjsLib;
      lib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      resolve(lib);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function parseMarkdown(file: File): Promise<ImportedChapter[]> {
  const text = await file.text();
  return splitIntoChapters(text, file.name);
}

async function parseZIP(file: File): Promise<ImportedChapter[]> {
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(await file.arrayBuffer());

  const entries = Object.entries(zip.files)
    .filter(([name, f]) => !f.dir && !name.startsWith("__MACOSX"))
    .filter(([name]) => /\.(docx|doc|md|markdown|txt)$/i.test(name))
    .sort(([a], [b]) => a.localeCompare(b));

  const allChapters: ImportedChapter[] = [];
  let globalOrder = 1;

  for (const [name, zipEntry] of entries) {
    const ext = name.split(".").pop()?.toLowerCase();
    let chapters: ImportedChapter[] = [];

    if (ext === "docx" || ext === "doc") {
      const blob = new Blob([await zipEntry.async("arraybuffer")]);
      const f = new File([blob], name, { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      chapters = await parseDOCX(f);
    } else {
      const text = await zipEntry.async("string");
      const shortName = name.split("/").pop() || name;
      chapters = splitIntoChapters(text, shortName);
    }

    // Re-number and tag
    for (const ch of chapters) {
      ch.order = globalOrder++;
      ch.sectionType = detectSectionType(name);
      ch.sourceFile = name.split("/").pop() || name;
      allChapters.push(ch);
    }
  }

  return allChapters;
}

async function parseCSV(file: File): Promise<ImportedChapter[]> {
  const text = await file.text();

  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const chapters: ImportedChapter[] = [];
        let order = 1;

        for (const row of result.data as any[]) {
          const title = row.title || row.Title || row.TITLE || row.chapter || `Chapter ${order}`;
          const content = row.content || row.Content || row.CONTENT || row.body || row.Body || "";
          const summary = row.summary || row.Summary || content.slice(0, 120);
          const sectionType = (row.section_type || row.type || "chapter").toLowerCase() as any;

          const blocks = textToBlocks(content);
          chapters.push({
            title: String(title).trim(),
            content: JSON.stringify(blocks),
            summary: String(summary).slice(0, 200),
            order: order++,
            sectionType: ["front-matter", "chapter", "back-matter"].includes(sectionType)
              ? sectionType
              : "chapter",
            sourceFile: file.name,
          });
        }
        resolve(chapters);
      },
      error: reject,
    });
  });
}

async function parseBulkFiles(files: File[]): Promise<ImportedChapter[]> {
  // Sort by filename for predictable order
  const sorted = [...files].sort((a, b) => a.name.localeCompare(b.name));
  const allChapters: ImportedChapter[] = [];
  let globalOrder = 1;

  for (const file of sorted) {
    const ext = file.name.split(".").pop()?.toLowerCase();
    let chapters: ImportedChapter[] = [];

    if (ext === "docx" || ext === "doc") {
      chapters = await parseDOCX(file);
    } else {
      // TXT / MD
      const text = await file.text();
      chapters = splitIntoChapters(text, file.name);
    }

    for (const ch of chapters) {
      ch.order = globalOrder++;
      ch.sectionType = detectSectionType(file.name);
      ch.sourceFile = file.name;
      allChapters.push(ch);
    }
  }

  return allChapters;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ManuscriptImportModal({
  isOpen,
  onClose,
  onImport,
  publicationTitle,
  initialMode,
}: ManuscriptImportModalProps) {
  const [mode, setMode] = useState<ImportMode>("bulk");
  const [fileStatuses, setFileStatuses] = useState<FileStatus[]>([]);
  const [importedChapters, setImportedChapters] = useState<ImportedChapter[]>([]);
  const [processing, setProcessing] = useState(false);
  const [previewIdx, setPreviewIdx] = useState<number | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset when closing; set initialMode when opening
  useEffect(() => {
    if (!isOpen) {
      setFileStatuses([]);
      setImportedChapters([]);
      setProcessing(false);
      setPreviewIdx(null);
    } else if (initialMode) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  const cfg = MODE_CONFIG[mode];

  const processFiles = useCallback(async (files: File[]) => {
    if (!files.length) return;
    setProcessing(true);

    const statuses: FileStatus[] = files.map(f => ({
      name: f.name,
      size: f.size,
      status: "pending",
    }));
    setFileStatuses(statuses);
    setImportedChapters([]);

    const updateStatus = (idx: number, update: Partial<FileStatus>) => {
      setFileStatuses(prev => prev.map((s, i) => i === idx ? { ...s, ...update } : s));
    };

    const allChapters: ImportedChapter[] = [];

    try {
      if (mode === "bulk") {
        // Process each file individually for status tracking
        for (let i = 0; i < files.length; i++) {
          updateStatus(i, { status: "processing" });
          try {
            const ext = files[i].name.split(".").pop()?.toLowerCase();
            let chapters: ImportedChapter[] = [];
            if (ext === "docx" || ext === "doc") {
              chapters = await parseDOCX(files[i]);
            } else {
              const text = await files[i].text();
              chapters = splitIntoChapters(text, files[i].name);
            }
            for (const ch of chapters) {
              ch.sectionType = detectSectionType(files[i].name);
              ch.sourceFile = files[i].name;
              allChapters.push(ch);
            }
            updateStatus(i, { status: "done", chapters });
          } catch (err: any) {
            updateStatus(i, { status: "error", error: err?.message || "Parse error" });
          }
        }
        // Re-number all
        allChapters.forEach((ch, idx) => (ch.order = idx + 1));
      } else {
        updateStatus(0, { status: "processing" });
        try {
          let chapters: ImportedChapter[] = [];
          if (mode === "docx") chapters = await parseDOCX(files[0]);
          else if (mode === "pdf") chapters = await parsePDF(files[0]);
          else if (mode === "markdown") chapters = await parseMarkdown(files[0]);
          else if (mode === "zip") chapters = await parseZIP(files[0]);
          else if (mode === "csv") chapters = await parseCSV(files[0]);
          allChapters.push(...chapters);
          updateStatus(0, { status: "done", chapters });
        } catch (err: any) {
          updateStatus(0, { status: "error", error: err?.message || "Parse failed" });
          toast.error(`Failed to parse ${files[0].name}: ${err?.message || "Unknown error"}`);
        }
      }
    } catch (err: any) {
      toast.error("Import failed: " + err?.message);
    } finally {
      setImportedChapters(allChapters);
      setProcessing(false);
    }
  }, [mode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) processFiles(files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) processFiles(files);
  };

  const removeChapter = (idx: number) => {
    setImportedChapters(prev => prev.filter((_, i) => i !== idx).map((ch, i) => ({ ...ch, order: i + 1 })));
  };

  const updateChapterTitle = (idx: number, title: string) => {
    setImportedChapters(prev => prev.map((ch, i) => i === idx ? { ...ch, title } : ch));
  };

  const updateChapterType = (idx: number, type: ImportedChapter["sectionType"]) => {
    setImportedChapters(prev => prev.map((ch, i) => i === idx ? { ...ch, sectionType: type } : ch));
  };

  const handleImport = () => {
    if (!importedChapters.length) {
      toast.error("No chapters to import");
      return;
    }
    onImport(importedChapters);
    toast.success(`${importedChapters.length} chapter${importedChapters.length !== 1 ? "s" : ""} imported into manuscript`);
    onClose();
  };

  const getBlockPreview = (contentJson: string): string => {
    try {
      const blocks: Block[] = JSON.parse(contentJson);
      return blocks
        .filter(b => b.type === "Paragraph")
        .slice(0, 2)
        .map(b => b.text)
        .join(" ")
        .slice(0, 200) || "No preview available";
    } catch {
      return "No preview available";
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50 shrink-0">
            <div>
              <h2 className="text-sm font-black text-gray-900">Manuscript Import</h2>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {publicationTitle ? `→ ${publicationTitle}` : "Import files into your manuscript"}
              </p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-stone-200 transition-colors text-stone-500">
              <FaTimes size={13} />
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Left panel: mode selector */}
            <div className="w-48 shrink-0 border-r border-stone-100 bg-stone-50/70 p-3 space-y-1 overflow-y-auto">
              <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest px-2 pb-2">Import Type</p>
              {(Object.keys(MODE_CONFIG) as ImportMode[]).map(m => {
                const c = MODE_CONFIG[m];
                return (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setFileStatuses([]); setImportedChapters([]); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                      mode === m
                        ? "bg-white shadow-sm border border-stone-200 text-gray-900"
                        : "text-stone-600 hover:bg-white/70"
                    }`}
                  >
                    <span className={`text-sm ${mode === m ? c.color.split(" ")[0] : "text-stone-400"}`}>
                      {c.icon}
                    </span>
                    <span>{c.label.replace("Import ", "")}</span>
                  </button>
                );
              })}
            </div>

            {/* Right panel: upload + results */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Upload zone */}
              <div className="p-5 border-b border-stone-100 shrink-0">
                <div className={`text-xs font-bold px-3 py-1.5 rounded-lg border inline-flex items-center gap-2 mb-3 ${cfg.color}`}>
                  <span>{cfg.icon}</span> {cfg.label}
                </div>
                <p className="text-[11px] text-gray-500 mb-3">{cfg.hint}</p>

                {/* Drop zone */}
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    dragOver
                      ? "border-brand-primary bg-brand-primary/5 scale-[1.01]"
                      : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                  } ${processing ? "pointer-events-none opacity-60" : ""}`}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept={cfg.accept}
                    multiple={cfg.multiple}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {processing ? (
                    <div className="flex flex-col items-center gap-2">
                      <FaSpinner data-ui-icon  className=" animate-spin text-2xl" />
                      <p className="text-xs font-bold text-gray-600">Processing files…</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 text-xl">
                        {cfg.icon}
                      </div>
                      <p className="text-sm font-black text-gray-700">
                        Drop {cfg.multiple ? "files" : "file"} here or <span className="text-brand-primary">click to browse</span>
                      </p>
                      <p className="text-[10px] text-gray-400">
                        Accepts: {cfg.accept.toUpperCase().replace(/\./g, "").split(",").join(", ")}
                        {cfg.multiple && " · Multiple files allowed"}
                      </p>
                    </div>
                  )}
                </div>

                {/* CSV template hint */}
                {mode === "csv" && (
                  <div className="mt-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-[10px] text-emerald-700">
                    <p className="font-black mb-1">Expected CSV columns:</p>
                    <code className="font-mono">title, content, summary, section_type</code>
                    <p className="mt-1 text-emerald-600">section_type values: front-matter · chapter · back-matter</p>
                  </div>
                )}

                {/* ZIP hint */}
                {mode === "zip" && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl text-[10px] text-amber-700">
                    <p className="font-black mb-1">ZIP file naming convention:</p>
                    <code className="font-mono">00_Cover.docx · 01_Introduction.md · 02_Chapter1.docx · 98_References.txt</code>
                    <p className="mt-1">Files are sorted alphabetically. Prefix with numbers to control order.</p>
                  </div>
                )}
              </div>

              {/* File status list */}
              {fileStatuses.length > 0 && (
                <div className="px-5 py-3 border-b border-stone-100 shrink-0 space-y-1.5 max-h-32 overflow-y-auto">
                  {fileStatuses.map((fs, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ${
                        fs.status === "done" ? "bg-emerald-100" :
                        fs.status === "error" ? "bg-red-100" :
                        fs.status === "processing" ? "bg-amber-100" : "bg-stone-100"
                      }`}>
                        {fs.status === "done" && <FaCheck size={9} className="text-emerald-600" />}
                        {fs.status === "error" && <FaExclamationTriangle size={9} className="text-red-500" />}
                        {fs.status === "processing" && <FaSpinner size={9} className="text-amber-600 animate-spin" />}
                        {fs.status === "pending" && <div className="w-1.5 h-1.5 rounded-full bg-stone-300" />}
                      </div>
                      <span className="flex-1 truncate font-bold text-gray-700">{fs.name}</span>
                      <span className="text-stone-400 shrink-0">
                        {fs.status === "done" && `${fs.chapters?.length || 0} chapter${fs.chapters?.length !== 1 ? "s" : ""}`}
                        {fs.status === "error" && <span className="text-red-500">{fs.error}</span>}
                        {fs.status === "processing" && "Parsing…"}
                        {fs.status === "pending" && `${(fs.size / 1024).toFixed(1)} KB`}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Chapters preview */}
              {importedChapters.length > 0 && (
                <div className="flex-1 overflow-y-auto p-5 space-y-2">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      {importedChapters.length} Chapter{importedChapters.length !== 1 ? "s" : ""} Detected
                    </p>
                    <button
                      onClick={() => { setFileStatuses([]); setImportedChapters([]); }}
                      className="text-[10px] font-bold text-stone-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                    >
                      <FaRedo size={8} /> Reset
                    </button>
                  </div>

                  {importedChapters.map((ch, idx) => (
                    <div key={idx} className={`border rounded-xl overflow-hidden transition-all ${
                      expandedIdx === idx ? "border-brand-primary/30 shadow-sm" : "border-stone-200"
                    }`}>
                      {/* Chapter row */}
                      <div className="flex items-center gap-3 p-3 bg-stone-50/60 hover:bg-stone-50">
                        {/* Order badge */}
                        <div className="w-6 h-6 rounded-lg bg-stone-200 flex items-center justify-center text-[10px] font-black text-stone-600 shrink-0">
                          {ch.order}
                        </div>

                        {/* Section type badge */}
                        <select
                          value={ch.sectionType || "chapter"}
                          onChange={e => updateChapterType(idx, e.target.value as any)}
                          className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg border cursor-pointer shrink-0 ${
                            ch.sectionType === "front-matter" ? "bg-blue-50 text-blue-700 border-blue-200" :
                            ch.sectionType === "back-matter" ? "bg-amber-50 text-amber-700 border-amber-200" :
                            "bg-teal-50 text-teal-700 border-teal-200"
                          }`}
                        >
                          <option value="front-matter">Front</option>
                          <option value="chapter">Chapter</option>
                          <option value="back-matter">Back</option>
                        </select>

                        {/* Editable title */}
                        <input
                          value={ch.title}
                          onChange={e => updateChapterTitle(idx, e.target.value)}
                          className="flex-1 bg-transparent text-xs font-bold text-gray-800 focus:outline-none border-b border-transparent focus:border-brand-primary/40 min-w-0 py-0.5"
                        />

                        {/* Source file */}
                        {ch.sourceFile && ch.sourceFile !== ch.title && (
                          <span className="text-[9px] text-stone-400 shrink-0 truncate max-w-[100px]" title={ch.sourceFile}>
                            {ch.sourceFile}
                          </span>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                            className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-400 hover:text-stone-600 transition-colors"
                          >
                            {expandedIdx === idx ? <FaChevronUp size={9} /> : <FaChevronDown size={9} />}
                          </button>
                          <button
                            onClick={() => removeChapter(idx)}
                            className="p-1.5 rounded-lg hover:bg-red-100 text-stone-300 hover:text-red-500 transition-colors"
                          >
                            <FaTrash size={9} />
                          </button>
                        </div>
                      </div>

                      {/* Expanded preview */}
                      <AnimatePresence>
                        {expandedIdx === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-stone-100"
                          >
                            <div className="p-4 bg-white">
                              <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-2">Content Preview</p>
                              <p className="text-xs text-gray-600 leading-relaxed font-serif">
                                {getBlockPreview(ch.content)}
                              </p>
                              {ch.summary && (
                                <p className="text-[10px] text-stone-400 mt-2 italic">
                                  Summary: {ch.summary}
                                </p>
                              )}
                              {/* Block count */}
                              {(() => {
                                try {
                                  const blocks = JSON.parse(ch.content);
                                  return (
                                    <div className="flex gap-3 mt-3">
                                      {["Heading", "Paragraph", "Quote", "Checklist"].map(t => {
                                        const count = blocks.filter((b: Block) => b.type === t).length;
                                        return count > 0 ? (
                                          <span key={t} className="text-[9px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-bold">
                                            {count} {t.toLowerCase()}{count !== 1 ? "s" : ""}
                                          </span>
                                        ) : null;
                                      })}
                                    </div>
                                  );
                                } catch { return null; }
                              })()}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state when no files */}
              {!processing && fileStatuses.length === 0 && importedChapters.length === 0 && (
                <div className="flex-1 flex items-center justify-center text-center p-8">
                  <div>
                    <div className="text-4xl mb-3 opacity-20">{cfg.icon}</div>
                    <p className="text-sm font-bold text-stone-400">
                      Select a {mode === "bulk" ? "file or files" : "file"} to import
                    </p>
                    <p className="text-[10px] text-stone-300 mt-1">{cfg.desc}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-stone-200 bg-stone-50 shrink-0">
            <div className="text-[11px] text-stone-500">
              {importedChapters.length > 0 && (
                <span className="font-bold text-emerald-600">
                  ✓ {importedChapters.length} chapter{importedChapters.length !== 1 ? "s" : ""} ready to import
                </span>
              )}
              {processing && (
                <span className="text-amber-600 font-bold flex items-center gap-1.5">
                  <FaSpinner className="animate-spin" size={10} /> Processing…
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-stone-100 text-stone-700 text-xs font-black rounded-xl hover:bg-stone-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!importedChapters.length || processing}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-xs font-black rounded-xl hover:opacity-90 transition-all shadow-md shadow-teal-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <FaMagic size={11} />
                Import {importedChapters.length > 0 ? `${importedChapters.length} Chapter${importedChapters.length !== 1 ? "s" : ""}` : "into Manuscript"}
                <FaArrowRight size={9} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
