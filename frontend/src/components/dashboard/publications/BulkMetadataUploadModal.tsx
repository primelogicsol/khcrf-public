"use client";

/**
 * BulkMetadataUploadModal
 * ─────────────────────────────────────────────────────────────────
 * Supports: CSV · JSON · YAML · DOCX · PDF · BibTeX · RIS · XLSX
 * Flow: Upload → Parse → Review → Edit (optional) → Apply
 * 
 * All parsing is 100% client-side — no server calls needed.
 */

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes, FaUpload, FaCheck, FaSpinner, FaFileUpload,
  FaFileCode, FaFileCsv, FaFileAlt, FaFilePdf, FaFileWord,
  FaEdit, FaMagic, FaExclamationTriangle, FaCheckCircle,
  FaDownload, FaSync, FaArrowRight, FaEye, FaTimesCircle,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import Papa from "papaparse";
import { validateMetadataSchema } from "@/utils/schemaValidator";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface PublicationIdentityData {
  title?: string;
  subtitle?: string;
  series?: string;
  volume?: string;
  issue?: string;
  isbn?: string;
  doi?: string;
  publisher?: string;
  edition?: string;
  publicationType?: string;
  publishedStatus?: string;
  language?: string;
  published?: string;   // year
  slug?: string;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

interface BulkMetadataUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: PublicationIdentityData) => void;
  existingSlug?: string;
}

// ─── Field mapping — handles many common alias names ───────────────────────────

const FIELD_MAP: Record<string, keyof PublicationIdentityData> = {
  // Title
  publication_title: "title", title: "title", "Publication Title": "title",
  booktitle: "title", TI: "title", T1: "title",
  // Subtitle
  subtitle: "subtitle", Subtitle: "subtitle", sub_title: "subtitle", ST: "subtitle",
  // Series
  series_name: "series", series: "series", Series: "series", T3: "series",
  collection: "series", journal: "series", JO: "series", JF: "series",
  // Volume
  volume: "volume", Volume: "volume", VL: "volume",
  // Issue
  issue: "issue", Issue: "issue", IS: "issue", number: "issue",
  // ISBN
  isbn: "isbn", ISBN: "isbn", isbn13: "isbn",
  // DOI
  doi: "doi", DOI: "doi", DO: "doi",
  // Publisher
  publisher_name: "publisher", publisher: "publisher", Publisher: "publisher",
  PB: "publisher", firm: "publisher",
  // Edition
  edition: "edition", Edition: "edition", edition_number: "edition", ET: "edition",
  // Publication type
  publication_type: "publicationType", type: "publicationType",
  "publication type": "publicationType", pubtype: "publicationType",
  // Status
  publish_status: "publishedStatus", status: "publishedStatus",
  publishedStatus: "publishedStatus",
  // Language
  language: "language", Language: "language", LA: "language", lang: "language",
  // Year
  publication_year: "published", year: "published", Year: "published",
  PY: "published", Y1: "published",
  // Slug
  url_slug: "slug", slug: "slug", Slug: "slug",
};

// Publication type normalisation
const PUBTYPE_MAP: Record<string, string> = {
  "research paper": "RESEARCH_PAPER", "research_paper": "RESEARCH_PAPER",
  "research": "RESEARCH_PAPER",
  "best practice": "BEST_PRACTICE", "best_practice": "BEST_PRACTICE",
  "case study": "CASE_STUDY", "case_study": "CASE_STUDY",
  "ebook": "EBOOK", "e-book": "EBOOK", "e-publication": "EBOOK",
  "craft manual": "CRAFT_MANUAL",
  "policy brief": "POLICY_BRIEF",
  "market intelligence": "MARKET_INTELLIGENCE",
  "field report": "FIELD_REPORT",
};

// Status normalisation
const STATUS_MAP: Record<string, string> = {
  "draft": "DRAFT", "under review": "UNDER_REVIEW", "review": "UNDER_REVIEW",
  "published": "PUBLISHED", "live": "PUBLISHED",
  "scheduled": "SCHEDULED", "archived": "ARCHIVED",
};

function normaliseField(key: string, value: string): [keyof PublicationIdentityData | null, string] {
  const mapped = FIELD_MAP[key] ?? FIELD_MAP[key.toLowerCase()] ?? FIELD_MAP[key.trim()] ?? null;
  if (!mapped) return [null, value];

  let finalValue = String(value).trim();
  if (mapped === "publicationType") {
    finalValue = PUBTYPE_MAP[finalValue.toLowerCase()] ?? finalValue;
  }
  if (mapped === "publishedStatus") {
    finalValue = STATUS_MAP[finalValue.toLowerCase()] ?? finalValue;
  }
  return [mapped, finalValue];
}

function applyRecord(record: Record<string, string>): PublicationIdentityData {
  const result: PublicationIdentityData = {};
  for (const [key, value] of Object.entries(record)) {
    const [mapped, finalValue] = normaliseField(key, value);
    if (mapped && finalValue) (result as any)[mapped] = finalValue;
  }
  return result;
}

// ─── Slug generation ───────────────────────────────────────────────────────────

function generateSlug(title: string, existing?: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
  if (!existing || existing === base) return base;
  // Append numeric suffix if needed
  const match = existing.match(/-(\d+)$/);
  const n = match ? parseInt(match[1]) + 1 : 2;
  return `${base}-${n}`;
}

// ─── Parsers ───────────────────────────────────────────────────────────────────

function parseJSON(text: string): PublicationIdentityData[] {
  const obj = JSON.parse(text);
  const arr = Array.isArray(obj) ? obj : [obj];
  return arr.map((item: Record<string, string>) => applyRecord(item));
}

function parseCSV(text: string): PublicationIdentityData[] {
  const result = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true });
  return result.data.map(row => applyRecord(row));
}

function parseYAML(text: string): PublicationIdentityData[] {
  // Simple key: value YAML parser — covers the standard template format
  const record: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const m = line.match(/^([a-zA-Z_][a-zA-Z0-9_ ]*?)\s*:\s*(.+)$/);
    if (m) record[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return [applyRecord(record)];
}

function parseBibTeX(text: string): PublicationIdentityData[] {
  const results: PublicationIdentityData[] = [];
  const entryPattern = /@\w+\{[^,]+,([\s\S]*?)\n\}/g;
  let match;
  while ((match = entryPattern.exec(text)) !== null) {
    const body = match[1];
    const record: Record<string, string> = {};
    const fieldPattern = /^\s*(\w+)\s*=\s*\{([^}]*)\}/gm;
    let fm;
    while ((fm = fieldPattern.exec(body)) !== null) {
      record[fm[1]] = fm[2].trim();
    }
    results.push(applyRecord(record));
  }
  return results.length ? results : [];
}

function parseRIS(text: string): PublicationIdentityData[] {
  const records: PublicationIdentityData[] = [];
  let current: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const m = line.match(/^([A-Z0-9]{2})\s+-\s+(.+)$/);
    if (!m) continue;
    const [, tag, value] = m;
    if (tag === "ER") {
      if (Object.keys(current).length) { records.push(applyRecord(current)); current = {}; }
    } else {
      current[tag] = value.trim();
    }
  }
  if (Object.keys(current).length) records.push(applyRecord(current));
  return records;
}

async function parseDOCX(file: File): Promise<PublicationIdentityData[]> {
  const mammoth = await import("mammoth");
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
  const doc = new DOMParser().parseFromString(html, "text/html");
  const text = doc.body.innerText || doc.body.textContent || "";
  return [extractFromText(text, file.name)];
}

async function parsePDF(file: File): Promise<PublicationIdentityData[]> {
  // Load pdf.js from CDN
  const pdfjsLib: any = await new Promise((res, rej) => {
    if ((window as any).pdfjsLib) return res((window as any).pdfjsLib);
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
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  // Only read first 3 pages (title pages)
  let text = "";
  for (let i = 1; i <= Math.min(3, pdf.numPages); i++) {
    const page = await pdf.getPage(i);
    const tc = await page.getTextContent();
    text += tc.items.map((it: any) => it.str).join(" ") + "\n";
  }
  return [extractFromText(text, file.name)];
}

/** Heuristic extractor from plain text (DOCX/PDF title pages) */
function extractFromText(text: string, filename: string): PublicationIdentityData {
  const result: PublicationIdentityData = {};
  const lines = text.split(/\n|\r/).map(l => l.trim()).filter(Boolean);

  // Title: longest line in first 5, or line starting with "Title:"
  const titleMatch = text.match(/title[:\s]+([^\n]{5,120})/i);
  if (titleMatch) result.title = titleMatch[1].trim();
  else if (lines[0] && lines[0].length > 5) result.title = lines[0];

  // Subtitle: second substantial line
  const subtitleMatch = text.match(/subtitle[:\s]+([^\n]{3,120})/i);
  if (subtitleMatch) result.subtitle = subtitleMatch[1].trim();
  else if (lines[1] && lines[1].length > 5 && lines[1] !== result.title) result.subtitle = lines[1];

  // Author / publisher
  const authorMatch = text.match(/(?:author|by)[:\s]+([^\n]{3,80})/i);
  if (authorMatch) result.publisher = authorMatch[1].trim();

  const pubMatch = text.match(/publisher[:\s]+([^\n]{3,80})/i);
  if (pubMatch) result.publisher = pubMatch[1].trim();

  // ISBN
  const isbnMatch = text.match(/(?:isbn[-–:]\s*)?(?:978|979)[-\s]?\d[-\s]?\d{1,5}[-\s]?\d{1,7}[-\s]?\d{1,6}[-\s]?\d/i);
  if (isbnMatch) result.isbn = isbnMatch[0].replace(/\s/g, "");

  // DOI
  const doiMatch = text.match(/10\.\d{4,}\/[^\s]+/);
  if (doiMatch) result.doi = doiMatch[0];

  // Year
  const yearMatch = text.match(/\b(19|20)\d{2}\b/);
  if (yearMatch) result.published = yearMatch[0];

  // Edition
  const editionMatch = text.match(/(\d+(?:st|nd|rd|th)|first|second|third)\s+edition/i);
  if (editionMatch) result.edition = editionMatch[0];

  // Language
  const langMatch = text.match(/language[:\s]+(English|Urdu|Hindi|Kashmiri|Arabic|French|German)/i);
  if (langMatch) result.language = langMatch[1];
  else result.language = "English"; // default

  // Series
  const seriesMatch = text.match(/series[:\s]+([^\n]{3,80})/i);
  if (seriesMatch) result.series = seriesMatch[1].trim();

  return result;
}

// ─── Validation ────────────────────────────────────────────────────────────────

function validate(data: PublicationIdentityData): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!data.title) errors.push("Publication Title is required");
  if (!data.publisher) errors.push("Publisher Name is required");
  if (!data.publicationType) errors.push("Publication Type is required");
  if (!data.language) errors.push("Language is required");
  if (!data.published) errors.push("Publication Year is required");
  if (!data.slug && data.title) {/* will be auto-generated */ }

  if (!data.isbn) warnings.push("ISBN not provided — recommended for formal publications");
  if (!data.doi) warnings.push("DOI not provided — needed for academic indexing");
  if (!data.subtitle) warnings.push("No subtitle — consider adding one");
  if (!data.series) warnings.push("No series name");

  return { valid: errors.length === 0, errors, warnings };
}

// ─── Template downloads ────────────────────────────────────────────────────────

const CSV_TEMPLATE = `publication_title,subtitle,series_name,volume,issue,isbn,doi,publisher_name,edition,publication_type,publish_status,language,publication_year,url_slug
Pashmina Authentication Standards & GI Compliance Manual,A comprehensive framework for verifying hand-spun origin,KHCRF Reference Series,1,1,978-xx-xxxxx-xx-x,10.xxxxx/hcrf.2026.xxx,KHCRF Heritage Press,1st Edition,Research Paper,Draft,English,2026,pashmina-authentication-standards-gi-compliance-manual`;

const JSON_TEMPLATE = JSON.stringify({
  publication_title: "Pashmina Authentication Standards & GI Compliance Manual",
  subtitle: "A comprehensive framework for verifying hand-spun origin",
  series_name: "KHCRF Reference Series",
  volume: "1", issue: "1",
  isbn: "978-xx-xxxxx-xx-x",
  doi: "10.xxxxx/hcrf.2026.xxx",
  publisher_name: "KHCRF Heritage Press",
  edition: "1st Edition",
  publication_type: "Research Paper",
  publish_status: "Draft",
  language: "English",
  publication_year: "2026",
  url_slug: "pashmina-authentication-standards-gi-compliance-manual",
}, null, 2);

const BIBTEX_TEMPLATE = `@book{hcrf2026,
  title     = {Pashmina Authentication Standards & GI Compliance Manual},
  subtitle  = {A comprehensive framework for verifying hand-spun origin},
  author    = {KHCRF Heritage Press},
  publisher = {KHCRF Heritage Press},
  year      = {2026},
  edition   = {1st Edition},
  isbn      = {978-xx-xxxxx-xx-x},
  doi       = {10.xxxxx/hcrf.2026.xxx},
  series    = {KHCRF Reference Series},
  language  = {English}
}`;

function downloadTemplate(type: "csv" | "json" | "bibtex") {
  const map = {
    csv: { content: CSV_TEMPLATE, mime: "text/csv", ext: "csv" },
    json: { content: JSON_TEMPLATE, mime: "application/json", ext: "json" },
    bibtex: { content: BIBTEX_TEMPLATE, mime: "text/plain", ext: "bib" },
  };
  const { content, mime, ext } = map[type];
  const blob = new Blob([content], { type: mime });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `hcrf_publication_metadata.${ext}`;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ─── File icon ─────────────────────────────────────────────────────────────────

function FileIcon({ name }: { name: string }) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "csv") return <FaFileCsv className="text-green-500" size={24} />;
  if (ext === "json") return <FaFileCode className="text-yellow-500" size={24} />;
  if (ext === "yaml" || ext === "yml") return <FaFileCode className="text-orange-400" size={24} />;
  if (ext === "pdf") return <FaFilePdf className="text-red-500" size={24} />;
  if (ext === "docx" || ext === "doc") return <FaFileWord className="text-blue-500" size={24} />;
  if (ext === "bib") return <FaFileAlt className="text-purple-500" size={24} />;
  if (ext === "ris") return <FaFileAlt className="text-indigo-500" size={24} />;
  return <FaFileAlt className="text-stone-400" size={24} />;
}

// ─── Field labels map for review screen ───────────────────────────────────────

const FIELD_LABELS: Record<keyof PublicationIdentityData, string> = {
  title: "Publication Title",
  subtitle: "Subtitle",
  series: "Series Name",
  volume: "Volume",
  issue: "Issue",
  isbn: "ISBN",
  doi: "DOI",
  publisher: "Publisher",
  edition: "Edition",
  publicationType: "Publication Type",
  publishedStatus: "Publish Status",
  language: "Language",
  published: "Publication Year",
  slug: "URL Slug",
};

type Step = "upload" | "review" | "edit";

// ─── Main Modal ────────────────────────────────────────────────────────────────

export default function BulkMetadataUploadModal({
  isOpen, onClose, onApply, existingSlug = "",
}: BulkMetadataUploadModalProps) {
  const dropRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("upload");
  const [dragOver, setDragOver] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsedRecords, setParsedRecords] = useState<PublicationIdentityData[]>([]);
  const [activeRecordIdx, setActiveRecordIdx] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<PublicationIdentityData>({});
  const [filename, setFilename] = useState("");

  const reset = () => {
    setStep("upload"); setParsedRecords([]); setActiveRecordIdx(0);
    setEditMode(false); setEditData({}); setFilename(""); setParsing(false);
  };

  const handleClose = () => { reset(); onClose(); };

  const activeRecord = editMode ? editData : (parsedRecords[activeRecordIdx] ?? {});
  const validation = validate(activeRecord);

  // ── Parse dispatcher ─────────────────────────────────────────────────────────

  const parseFile = useCallback(async (file: File) => {
    setParsing(true);
    setFilename(file.name);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      let records: PublicationIdentityData[] = [];

      if (ext === "json") {
        const jsonText = await file.text();
        const json = JSON.parse(jsonText);
        
        // Handle array or single object format
        const arr = Array.isArray(json) ? json : [json];
        for (const item of arr) {
          const result = validateMetadataSchema(item);
          if (!result.isValid) {
            throw new Error(`Invalid Schema (hcrf_metadata_v1): ${result.errors.join(", ")}`);
          }
          if (result.warnings.length > 0) {
            result.warnings.forEach(w => toast(w, { icon: "⚠️" }));
          }
          records.push(result.normalizedData);
        }
      } else if (ext === "csv") {
        records = parseCSV(await file.text());
      } else if (ext === "yaml" || ext === "yml") {
        records = parseYAML(await file.text());
      } else if (ext === "bib") {
        records = parseBibTeX(await file.text());
      } else if (ext === "ris") {
        records = parseRIS(await file.text());
      } else if (ext === "docx" || ext === "doc") {
        records = await parseDOCX(file);
      } else if (ext === "pdf") {
        records = await parsePDF(file);
      } else {
        throw new Error(`Unsupported format: .${ext}`);
      }

      if (!records.length) throw new Error("No metadata found in file");

      // Auto-generate slugs for any record missing one
      const enriched = records.map(r => ({
        ...r,
        slug: r.slug || (r.title ? generateSlug(r.title, existingSlug || undefined) : ""),
        publishedStatus: r.publishedStatus || "DRAFT",
        language: r.language || "English",
        publisher: r.publisher || "KHCRF Heritage Press",
      }));

      setParsedRecords(enriched);
      setActiveRecordIdx(0);
      setEditData(enriched[0]);
      setStep("review");
      toast.success(`Parsed ${enriched.length} publication record${enriched.length > 1 ? "s" : ""} from ${file.name}`);
    } catch (err: any) {
      toast.error(`Parse failed: ${err?.message ?? "Unknown error"}`);
    } finally {
      setParsing(false);
    }
  }, [existingSlug]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) parseFile(file);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
    e.target.value = "";
  };

  const handleApply = () => {
    const data = editMode ? editData : parsedRecords[activeRecordIdx];
    if (!validation.valid) {
      toast.success("Applied partial metadata (fix missing fields in form)");
    } else {
      toast.success("✓ Publication metadata applied");
    }
    onApply(data);
    handleClose();
  };

  const handleRegenerateSlug = () => {
    const src = editMode ? editData : parsedRecords[activeRecordIdx];
    if (!src.title) { toast.error("Title is needed to generate a slug"); return; }
    const newSlug = generateSlug(src.title);
    if (editMode) setEditData(p => ({ ...p, slug: newSlug }));
    else setParsedRecords(prev => prev.map((r, i) => i === activeRecordIdx ? { ...r, slug: newSlug } : r));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        onClick={e => e.target === e.currentTarget && handleClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full flex flex-col overflow-hidden"
          style={{ maxWidth: 760, maxHeight: "92vh" }}
        >

          {/* ── Header ── */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-stone-900 to-stone-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 flex items-center justify-center shrink-0">
                <FaMagic className="text-teal-400" size={14} />
              </div>
              <div>
                <h2 className="text-sm font-black text-white">Bulk Metadata Upload</h2>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  {step === "upload" ? "Upload a file to auto-fill Publication Identity" :
                   step === "review" ? `Detected ${parsedRecords.length} record${parsedRecords.length !== 1 ? "s" : ""} from ${filename}` :
                   "Edit before applying"}
                </p>
              </div>
            </div>
            {/* Step indicator */}
            <div className="flex items-center gap-2 mr-4">
              {(["upload", "review"] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black transition-all ${
                    step === s ? "bg-teal-500 text-white" :
                    (step === "review" && s === "upload") || (step === "edit" && s !== "edit") ? "bg-emerald-500 text-white" :
                    "bg-stone-600 text-stone-400"
                  }`}>{i + 1}</div>
                  {i < 1 && <div className="w-6 h-px bg-stone-600" />}
                </div>
              ))}
            </div>
            <button onClick={handleClose} className="p-2 rounded-xl hover:bg-white/10 text-stone-400 hover:text-white transition-colors">
              <FaTimes size={13} />
            </button>
          </div>

          {/* ── Step: Upload ── */}
          {step === "upload" && (
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => dropRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-4 text-center cursor-pointer transition-all ${
                  dragOver ? "border-teal-400 bg-teal-50" : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                } ${parsing ? "pointer-events-none opacity-60" : ""}`}
              >
                <input ref={dropRef} type="file"
                  accept=".csv,.json,.yaml,.yml,.docx,.doc,.pdf,.bib,.ris"
                  onChange={handleInput} className="hidden" />
                {parsing
                  ? <FaSpinner className="text-teal-500 text-3xl animate-spin" />
                  : <FaFileUpload className={dragOver ? "text-teal-500 text-3xl" : "text-stone-400 text-3xl"} />
                }
                <div>
                  <p className="text-sm font-black text-gray-800">
                    {parsing ? "Parsing metadata…" : <>Drop your metadata file or <span className="text-teal-600">click to browse</span></>}
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Supports: CSV · JSON · YAML · DOCX · PDF · BibTeX (.bib) · RIS
                  </p>
                </div>
              </div>

              {/* Supported formats grid */}
              <div>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">Supported Formats</p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { icon: <FaFileCsv className="text-green-500" />, label: "CSV", desc: "Spreadsheet export" },
                    { icon: <FaFileCode className="text-yellow-500" />, label: "JSON", desc: "Structured data" },
                    { icon: <FaFileCode className="text-orange-400" />, label: "YAML", desc: "Config format" },
                    { icon: <FaFileWord className="text-blue-500" />, label: "DOCX", desc: "Title page extract" },
                    { icon: <FaFilePdf className="text-red-500" />, label: "PDF", desc: "Cover page extract" },
                    { icon: <FaFileAlt className="text-purple-500" />, label: "BibTeX", desc: "Academic citation" },
                    { icon: <FaFileAlt className="text-indigo-500" />, label: "RIS", desc: "Reference manager" },
                    { icon: <FaFileAlt className="text-stone-400" />, label: "XLSX", desc: "Coming soon" },
                  ].map(({ icon, label, desc }) => (
                    <div key={label} className="flex flex-col items-center gap-1.5 p-3 bg-stone-50 border border-stone-100 rounded-xl text-center">
                      <div className="text-xl">{icon}</div>
                      <p className="text-[10px] font-black text-gray-800">{label}</p>
                      <p className="text-[9px] text-stone-400">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Template downloads */}
              <div>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">Download Templates</p>
                <div className="flex gap-2">
                  {(["csv", "json", "bibtex"] as const).map(type => (
                    <button key={type} onClick={() => downloadTemplate(type)}
                      className="flex items-center gap-2 px-3 py-2 bg-stone-50 border border-stone-200 text-stone-600 text-[10px] font-black rounded-xl hover:bg-stone-100 transition-all">
                      <FaDownload size={9} /> {type.toUpperCase()} Template
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step: Review ── */}
          {step === "review" && (
            <div className="flex-1 overflow-y-auto p-6 space-y-4">

              {/* Multi-record tabs */}
              {parsedRecords.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {parsedRecords.map((r, i) => (
                    <button key={i} onClick={() => { setActiveRecordIdx(i); setEditData(r); setEditMode(false); }}
                      className={`shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${
                        i === activeRecordIdx ? "bg-teal-500 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}>
                      Record {i + 1}{r.title ? `: ${r.title.slice(0, 24)}…` : ""}
                    </button>
                  ))}
                </div>
              )}

              {/* Validation */}
              {validation.errors.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1">
                  <p className="text-[10px] font-black text-red-700 flex items-center gap-1.5">
                    <FaTimesCircle size={10} /> Required fields missing
                  </p>
                  {validation.errors.map((e, i) => (
                    <p key={i} className="text-[10px] text-red-600 ml-4">• {e}</p>
                  ))}
                </div>
              )}
              {validation.warnings.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                  <p className="text-[10px] font-black text-amber-700 flex items-center gap-1.5">
                    <FaExclamationTriangle size={10} /> Recommended fields missing
                  </p>
                  {validation.warnings.map((w, i) => (
                    <p key={i} className="text-[10px] text-amber-600 ml-4">• {w}</p>
                  ))}
                </div>
              )}

              {/* Detected metadata card */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-stone-100 border-b border-stone-200">
                  <p className="text-[10px] font-black text-stone-600 uppercase tracking-widest">Detected Publication Identity</p>
                  <div className="flex gap-2">
                    <button onClick={handleRegenerateSlug}
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-stone-200 text-stone-600 text-[9px] font-black rounded-lg hover:bg-stone-50">
                      <FaSync size={8} /> Regenerate Slug
                    </button>
                    <button onClick={() => { setEditMode(true); setEditData({ ...activeRecord }); setStep("edit"); }}
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-stone-200 text-stone-600 text-[9px] font-black rounded-lg hover:bg-stone-50">
                      <FaEdit size={8} /> Edit Before Apply
                    </button>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {(Object.keys(FIELD_LABELS) as (keyof PublicationIdentityData)[]).map(field => {
                    const val = activeRecord[field];
                    const isRequired = ["title", "publisher", "publicationType", "language", "published"].includes(field);
                    const isEmpty = !val;
                    return (
                      <div key={field} className={`flex items-start gap-3 py-2 border-b border-stone-100 last:border-0 ${isEmpty && isRequired ? "bg-red-50/40 px-2 rounded-lg" : ""}`}>
                        <span className="text-[9px] font-black text-stone-400 uppercase w-36 shrink-0 pt-0.5">
                          {FIELD_LABELS[field]}
                          {isRequired && <span className="text-red-400 ml-1">*</span>}
                        </span>
                        {isEmpty
                          ? <span className="text-[10px] text-stone-300 italic">—</span>
                          : <span className="text-[11px] font-bold text-gray-800 break-words">{String(val)}</span>
                        }
                        {!isEmpty && <FaCheckCircle className="text-emerald-400 shrink-0 ml-auto mt-0.5" size={10} />}
                        {isEmpty && isRequired && <FaTimesCircle className="text-red-400 shrink-0 ml-auto mt-0.5" size={10} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Batch info */}
              {parsedRecords.length > 1 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-[10px] font-black text-blue-700 mb-1">📦 Batch Mode: {parsedRecords.length} records detected</p>
                  <p className="text-[9px] text-blue-600">
                    Currently previewing Record {activeRecordIdx + 1}. Apply applies the current record only.
                    Batch creation (all records → draft publications) coming soon.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Step: Edit ── */}
          {step === "edit" && (
            <div className="flex-1 overflow-y-auto p-6">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">Edit Metadata Before Applying</p>
              <div className="space-y-3">
                {(Object.keys(FIELD_LABELS) as (keyof PublicationIdentityData)[]).map(field => {
                  const isRequired = ["title", "publisher", "publicationType", "language", "published"].includes(field);
                  if (field === "publicationType") {
                    return (
                      <div key={field}>
                        <label className="text-[10px] font-black text-stone-500 uppercase tracking-wider block mb-1">
                          {FIELD_LABELS[field]}{isRequired && <span className="text-red-400 ml-1">*</span>}
                        </label>
                        <select value={editData[field] ?? ""}
                          onChange={e => setEditData(p => ({ ...p, [field]: e.target.value }))}
                          className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400">
                          <option value="">Select type…</option>
                          {["RESEARCH_PAPER", "BEST_PRACTICE", "CASE_STUDY", "EBOOK", "CRAFT_MANUAL", "POLICY_BRIEF", "MARKET_INTELLIGENCE", "FIELD_REPORT"].map(v => (
                            <option key={v} value={v}>{v.replace(/_/g, " ")}</option>
                          ))}
                        </select>
                      </div>
                    );
                  }
                  if (field === "publishedStatus") {
                    return (
                      <div key={field}>
                        <label className="text-[10px] font-black text-stone-500 uppercase tracking-wider block mb-1">{FIELD_LABELS[field]}</label>
                        <select value={editData[field] ?? "DRAFT"}
                          onChange={e => setEditData(p => ({ ...p, [field]: e.target.value }))}
                          className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400">
                          {["DRAFT", "UNDER_REVIEW", "PUBLISHED", "SCHEDULED", "ARCHIVED"].map(v => (
                            <option key={v} value={v}>{v.replace(/_/g, " ")}</option>
                          ))}
                        </select>
                      </div>
                    );
                  }
                  if (field === "language") {
                    return (
                      <div key={field}>
                        <label className="text-[10px] font-black text-stone-500 uppercase tracking-wider block mb-1">
                          {FIELD_LABELS[field]}{isRequired && <span className="text-red-400 ml-1">*</span>}
                        </label>
                        <select value={editData[field] ?? "English"}
                          onChange={e => setEditData(p => ({ ...p, [field]: e.target.value }))}
                          className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400">
                          {["English", "Urdu", "Kashmiri", "Hindi", "Arabic", "French"].map(v => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </select>
                      </div>
                    );
                  }
                  return (
                    <div key={field}>
                      <label className="text-[10px] font-black text-stone-500 uppercase tracking-wider block mb-1">
                        {FIELD_LABELS[field]}{isRequired && <span className="text-red-400 ml-1">*</span>}
                      </label>
                      <div className="flex gap-2">
                        <input
                          value={editData[field] ?? ""}
                          onChange={e => setEditData(p => ({ ...p, [field]: e.target.value }))}
                          className="flex-1 px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                          placeholder={`Enter ${FIELD_LABELS[field].toLowerCase()}…`}
                        />
                        {field === "slug" && (
                          <button onClick={handleRegenerateSlug} title="Regenerate from title"
                            className="px-2.5 py-2 bg-stone-50 border border-stone-200 text-stone-500 rounded-xl hover:bg-stone-100 transition-colors">
                            <FaSync size={10} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Footer ── */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-stone-200 bg-stone-50 shrink-0">
            <div className="flex gap-2">
              {step !== "upload" && (
                <button onClick={() => { setStep("upload"); setEditMode(false); }}
                  className="px-3 py-2 bg-stone-100 text-stone-600 text-[10px] font-black rounded-xl hover:bg-stone-200 transition-all">
                  ← Upload Different File
                </button>
              )}
              {step === "edit" && (
                <button onClick={() => { setStep("review"); setEditMode(false); }}
                  className="px-3 py-2 bg-stone-100 text-stone-600 text-[10px] font-black rounded-xl hover:bg-stone-200 transition-all">
                  ← Back to Review
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={handleClose}
                className="px-4 py-2 bg-stone-100 text-stone-600 text-[10px] font-black rounded-xl hover:bg-stone-200 transition-all">
                Cancel
              </button>
              {step === "review" && (
                <>
                  <button onClick={() => { setEditMode(true); setEditData({ ...activeRecord }); setStep("edit"); }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-stone-100 border border-stone-200 text-stone-700 text-[10px] font-black rounded-xl hover:bg-stone-200 transition-all">
                    <FaEdit size={9} /> Edit Before Apply
                  </button>
                  <button onClick={handleApply}
                    className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-[10px] font-black rounded-xl hover:opacity-90 shadow-md shadow-teal-500/20 transition-all">
                    <FaCheck size={9} /> Apply Metadata <FaArrowRight size={8} />
                  </button>
                </>
              )}
              {step === "edit" && (
                <button onClick={handleApply}
                  className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-[10px] font-black rounded-xl hover:opacity-90 shadow-md shadow-teal-500/20 transition-all">
                  <FaCheck size={9} /> Apply Metadata <FaArrowRight size={8} />
                </button>
              )}
            </div>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
