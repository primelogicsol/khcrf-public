"use client";

/**
 * BulkIntelligenceUploadModal
 * ─────────────────────────────────────────────────────────────────
 * Supports: CSV · JSON · YAML · DOCX · PDF
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
import { IntelligenceContent } from "./IntelligenceContentEngine";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

interface BulkIntelligenceUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: IntelligenceContent) => void;
}

// ─── Field mapping — handles many common alias names ───────────────────────────

const FIELD_MAP: Record<string, keyof IntelligenceContent> = {
  "execSummary": "execSummary", "Executive Summary": "execSummary", "executive summary": "execSummary", "executive_summary": "execSummary",
  "problemStatement": "problemStatement", "Problem Statement": "problemStatement", "problem_statement": "problemStatement",
  "keyFindings": "keyFindings", "Key Findings": "keyFindings", "key_findings": "keyFindings",
  "highlights": "bestPracticeHighlights", "Highlights": "bestPracticeHighlights", "bestPracticeHighlights": "bestPracticeHighlights", "Best Practice Highlights": "bestPracticeHighlights", "best_practice_highlights": "bestPracticeHighlights",
  "implementationFramework": "implementationFramework", "Implementation Framework": "implementationFramework", "implementation_framework": "implementationFramework",
  "keyRecommendations": "keyRecommendations", "Key Recommendations": "keyRecommendations", "key_recommendations": "keyRecommendations",
  "objectives": "objectives", "Objectives": "objectives",
  "expectedOutcomes": "expectedOutcomes", "Expected Outcomes": "expectedOutcomes", "expected_outcomes": "expectedOutcomes",
  "methodology": "methodology", "Methodology": "methodology",
  "abstract": "abstract", "Abstract": "abstract",
  "researchQuestions": "researchQuestions", "Research Questions": "researchQuestions", "research_questions": "researchQuestions",
  "conclusions": "conclusions", "Conclusions": "conclusions",
  "keywords": "keywords", "Keywords": "keywords",
  "primaryKeywords": "primaryKeywords", "Primary Keywords": "primaryKeywords", "primary_keywords": "primaryKeywords",
  "secondaryKeywords": "secondaryKeywords", "Secondary Keywords": "secondaryKeywords", "secondary_keywords": "secondaryKeywords",
  "longTailKeywords": "longTailKeywords", "Long Tail Keywords": "longTailKeywords", "long_tail_keywords": "longTailKeywords",
  "entityKeywords": "entityKeywords", "Entity Keywords": "entityKeywords", "entity_keywords": "entityKeywords",
  "catalogShort": "catalogShort", "Catalog Short": "catalogShort", "catalog_short": "catalogShort",
  "catalogStandard": "catalogStandard", "Catalog Standard": "catalogStandard", "catalog_standard": "catalogStandard",
  "catalogExtended": "catalogExtended", "Catalog Extended": "catalogExtended", "catalog_extended": "catalogExtended",
  "topHighlight": "topHighlight", "Top Highlight": "topHighlight", "top_highlight": "topHighlight",
  "description": "description", "Description": "description", "longDescription": "description", "Long Description": "description", "long_description": "description",
  "caseBackground": "caseBackground", "Case Background": "caseBackground", "case_background": "caseBackground",
  "challenge": "challenge", "Challenge": "challenge",
  "intervention": "intervention", "Intervention": "intervention",
  "results": "results", "Results": "results",
  "lessonsLearned": "lessonsLearned", "Lessons Learned": "lessonsLearned",
  "replicability": "replicability", "Replicability": "replicability",
  "policySum": "policySum", "Policy Summary": "policySum", "policy summary": "policySum",
  "urgencyStatement": "urgencyStatement", "Urgency Statement": "urgencyStatement",
  "evidenceSnapshot": "evidenceSnapshot", "Evidence Snapshot": "evidenceSnapshot",
  "policyRecommendations": "policyRecommendations", "Policy Recommendations": "policyRecommendations",
  "marketSummary": "marketSummary", "Market Summary": "marketSummary",
  "exportTrends": "exportTrends", "Export Trends": "exportTrends",
  "priceSignals": "priceSignals", "Price Signals": "priceSignals",
  "marketRisks": "marketRisks", "Market Risks": "marketRisks",
  "opportunities": "opportunities", "Opportunities": "opportunities",
  "forecasts": "forecasts", "Forecasts": "forecasts",
  "bookOverview": "bookOverview", "Book Overview": "bookOverview",
  "learningObjectives": "learningObjectives", "Learning Objectives": "learningObjectives",
  "audienceBenefits": "audienceBenefits", "Audience Benefits": "audienceBenefits",
  "keyTopics": "keyTopics", "Key Topics": "keyTopics",
};

function normaliseField(key: string, value: string): [keyof IntelligenceContent | null, string] {
  const mapped = FIELD_MAP[key] ?? FIELD_MAP[key.toLowerCase()] ?? FIELD_MAP[key.trim()] ?? null;
  if (!mapped) return [null, value];

  let finalValue = String(value).trim();
  return [mapped, finalValue];
}

function applyRecord(record: Record<string, string>): IntelligenceContent {
  const result: IntelligenceContent = {};
  for (const [key, value] of Object.entries(record)) {
    const [mapped, finalValue] = normaliseField(key, value);
    if (mapped && finalValue) (result as any)[mapped] = finalValue;
  }
  return result;
}

// ─── Parsers ───────────────────────────────────────────────────────────────────

function parseJSON(text: string): IntelligenceContent[] {
  const obj = JSON.parse(text);
  const arr = Array.isArray(obj) ? obj : [obj];
  return arr.map((item: Record<string, string>) => applyRecord(item));
}

function parseCSV(text: string): IntelligenceContent[] {
  const result = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true });
  return result.data.map(row => applyRecord(row));
}

function parseYAML(text: string): IntelligenceContent[] {
  const record: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const m = line.match(/^([a-zA-Z_][a-zA-Z0-9_ ]*?)\s*:\s*(.+)$/);
    if (m) record[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return [applyRecord(record)];
}

function parseBibTeX(text: string): IntelligenceContent[] {
  const results: IntelligenceContent[] = [];
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

function parseRIS(text: string): IntelligenceContent[] {
  const records: IntelligenceContent[] = [];
  let current: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const m = line.match(/^([A-Z0-9]{2})\s+-\s+(.+)$/);
    if (!m) continue;
    const [, tag, value] = m;
    if (tag === "ER") {
      records.push(applyRecord(current));
      current = {};
    } else {
      current[tag] = value.trim();
    }
  }
  if (Object.keys(current).length > 0) records.push(applyRecord(current));
  return records.length ? records : [];
}

async function parseDOCX(file: File): Promise<IntelligenceContent[]> {
  const mammoth = await import("mammoth");
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
  const doc = new DOMParser().parseFromString(html, "text/html");
  const text = doc.body.textContent || "";
  return [extractFromText(text, file.name)];
}

async function parsePDF(file: File): Promise<IntelligenceContent[]> {
  const pdfjsLib: any = await new Promise((res, rej) => {
    if ((window as any).pdfjsLib) return res((window as any).pdfjsLib);
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = () => {
      (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      res((window as any).pdfjsLib);
    };
    script.onerror = rej;
    document.head.appendChild(script);
  });

  const pdf = await pdfjsLib.getDocument(await file.arrayBuffer()).promise;
  const numPages = Math.min(pdf.numPages, 3);
  let fullText = "";
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map((it: any) => it.str).join(" ") + "\n";
  }
  return [extractFromText(fullText, file.name)];
}

function extractFromText(text: string, filename: string): IntelligenceContent {
  const result: IntelligenceContent = {};
  const lines = text.split(/\n|\r/).map(l => l.trim()).filter(Boolean);

  let currentKey: keyof IntelligenceContent | null = null;
  let currentValue: string[] = [];

  const assignCurrent = () => {
    if (currentKey && currentValue.length > 0) {
      // Append if it already has value (e.g. parsed from same line then next line)
      result[currentKey] = result[currentKey] ? result[currentKey] + "\n" + currentValue.join("\n") : currentValue.join("\n");
    }
  };

  for (const line of lines) {
    // Try to match headers like "Executive Summary" or "Keywords: Pashmina"
    const cleanHeader = line.replace(/[*:]+$/g, "").trim();
    let mappedKey = FIELD_MAP[cleanHeader] || FIELD_MAP[cleanHeader.toLowerCase()];
    
    let inlineValue = "";
    if (!mappedKey && line.includes(":")) {
      const parts = line.split(":", 2);
      const possibleHeader = parts[0].replace(/[*]+$/g, "").trim();
      mappedKey = FIELD_MAP[possibleHeader] || FIELD_MAP[possibleHeader.toLowerCase()];
      if (mappedKey) {
        inlineValue = parts[1].trim();
      }
    }

    // Special match for Top Highlight Line which is sometimes "Top Highlight Line" in the prompt
    if (!mappedKey && cleanHeader.toLowerCase() === "top highlight line") {
      mappedKey = "topHighlight";
    }
    if (!mappedKey && cleanHeader.toLowerCase() === "long description (public catalog card)") {
      mappedKey = "description";
    }
    if (!mappedKey && cleanHeader.toLowerCase() === "search keywords & highlights") {
      continue; // skip section headers
    }

    if (mappedKey) {
      assignCurrent();
      currentKey = mappedKey;
      currentValue = inlineValue ? [inlineValue] : [];
    } else if (currentKey) {
      currentValue.push(line);
    }
  }
  assignCurrent();

  // If nothing was extracted, fallback to storing it all in execSummary
  if (Object.keys(result).length === 0) {
    result.execSummary = text.substring(0, 1000);
  }

  return result;
}

function validate(data: IntelligenceContent): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  return { valid: errors.length === 0, errors, warnings };
}

// ─── Input Components ──────────────────────────────────────────────────────────

function Input({ label, name, value, onChange, required, placeholder }: any) {
  return (
    <div className="flex flex-col">
      <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1.5 flex gap-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input type="text" name={name} value={value || ""} onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all bg-white" />
    </div>
  );
}

// ─── Templates ─────────────────────────────────────────────────────────────────

function downloadTemplate(type: "csv" | "json" | "bibtex") {
  const downloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  if (type === "csv") {
    const csv = `execSummary,problemStatement,bestPracticeHighlights,implementationFramework,keyRecommendations,abstract,conclusions\nThis is a sample executive summary...,The core challenge is...,Highlight 1\\nHighlight 2,Phase 1\\nPhase 2,1. Recommendation A,A structured abstract...,In conclusion...`;
    downloadFile(csv, "intelligence_template.csv", "text/csv");
  } else if (type === "json") {
    const json = JSON.stringify({
      execSummary: "This is a sample executive summary highlighting the main findings...",
      problemStatement: "The core challenge addressed in this paper is...",
      bestPracticeHighlights: "1. Highlight A\n2. Highlight B",
      implementationFramework: "Phase 1: Planning\nPhase 2: Execution",
      keyRecommendations: "1. Recommendation A",
      keywords: "Kashmir Pashmina, Pashmina Authentication",
      primaryKeywords: "Kashmir Pashmina",
      secondaryKeywords: "Pashmina Authentication",
      longTailKeywords: "Authentic Kashmir Pashmina, GI Certified Pashmina",
      entityKeywords: "KHCRF, Srinagar, Pashmina Artisans",
      topHighlight: "Introduces a comprehensive Pashmina authentication framework.",
      description: "Reviving Trust in Kashmir Pashmina. A comprehensive publication by KHCRF.",
      catalogShort: "Short 120-char catalog description.",
      catalogStandard: "Standard 300-char catalog description.",
      catalogExtended: "Extended 600-char catalog description.",
      abstract: "A structured abstract of the publication...",
      conclusions: "In conclusion, this research indicates..."
    }, null, 2);
    downloadFile(json, "intelligence_template.json", "application/json");
  } else if (type === "bibtex") {
    const bib = `@article{sample2026,
  author = {Author Name},
  title = {Sample Title},
  journal = {Journal of Craft Intelligence},
  year = {2026}
}`;
    downloadFile(bib, "intelligence_template.bib", "text/plain");
  }
}

// ─── File icon ─────────────────────────────────────────────────────────────────

function getFileIcon(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === "pdf") return <FaFilePdf className="text-red-500" />;
  if (ext === "doc" || ext === "docx") return <FaFileWord className="text-blue-500" />;
  if (ext === "csv" || ext === "xlsx") return <FaFileCsv className="text-green-500" />;
  if (ext === "json" || ext === "yaml" || ext === "yml") return <FaFileCode className="text-yellow-500" />;
  return <FaFileAlt className="text-stone-400" />;
}

type Step = "upload" | "review" | "edit";

// ─── Main Modal ────────────────────────────────────────────────────────────────

export default function BulkIntelligenceUploadModal({
  isOpen, onClose, onApply
}: BulkIntelligenceUploadModalProps) {
  const dropRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("upload");
  const [dragOver, setDragOver] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsedRecords, setParsedRecords] = useState<IntelligenceContent[]>([]);
  const [activeRecordIdx, setActiveRecordIdx] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<IntelligenceContent>({});
  const [filename, setFilename] = useState("");

  const reset = () => {
    setStep("upload");
    setParsedRecords([]);
    setActiveRecordIdx(0);
    setEditData({});
    setFilename("");
  };

  const handleClose = () => {
    onClose();
    setTimeout(reset, 300);
  };

  const processFile = useCallback(async (file: File) => {
    try {
      setParsing(true);
      setFilename(file.name);
      const ext = file.name.split('.').pop()?.toLowerCase();
      
      let records: IntelligenceContent[] = [];

      if (ext === "json") records = parseJSON(await file.text());
      else if (ext === "csv") records = parseCSV(await file.text());
      else if (ext === "yaml" || ext === "yml") records = parseYAML(await file.text());
      else if (ext === "bib") records = parseBibTeX(await file.text());
      else if (ext === "ris") records = parseRIS(await file.text());
      else if (ext === "docx" || ext === "doc") records = await parseDOCX(file);
      else if (ext === "pdf") records = await parsePDF(file);
      else {
        toast.error("Unsupported format");
        setParsing(false);
        return;
      }

      if (!records.length) throw new Error("No intelligence found in file");

      setParsedRecords(records);
      setActiveRecordIdx(0);
      setEditData(records[0]);
      setStep("review");
      toast.success(`Parsed ${records.length} intelligence record(s)`);
    } catch (err: any) {
      toast.error(`Parse failed: ${err?.message ?? "Unknown error"}`);
    } finally {
      setParsing(false);
    }
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const handleApply = () => {
    const data = editMode ? editData : parsedRecords[activeRecordIdx];
    toast.success("✓ Intelligence applied");
    onApply(data);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
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
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                <FaMagic className="text-purple-400" size={14} />
              </div>
              <div>
                <h2 className="text-sm font-black text-white">Bulk Intelligence Upload</h2>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  {step === "upload" ? "Upload a file to auto-fill Intelligence data" :
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
                    step === s ? "bg-purple-500 text-white" :
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
                  dragOver ? "border-purple-400 bg-purple-50" : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                } ${parsing ? "pointer-events-none opacity-60" : ""}`}
              >
                <input ref={dropRef} type="file"
                  accept=".csv,.json,.yaml,.yml,.docx,.doc,.pdf,.bib,.ris"
                  onChange={handleInput} className="hidden" />
                {parsing
                  ? <FaSpinner className="text-purple-500 text-3xl animate-spin" />
                  : <FaFileUpload className={dragOver ? "text-purple-500 text-3xl" : "text-stone-400 text-3xl"} />
                }
                <div>
                  <p className="text-sm font-black text-gray-800">
                    {parsing ? "Parsing intelligence data…" : <>Drop your intelligence file or <span className="text-purple-600">click to browse</span></>}
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Supports: CSV · JSON · YAML · DOCX · PDF
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
                    { icon: <FaFileWord className="text-blue-500" />, label: "DOCX", desc: "Content extract" },
                    { icon: <FaFilePdf className="text-red-500" />, label: "PDF", desc: "Text extract" },
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
                        i === activeRecordIdx ? "bg-purple-500 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}>
                      Record {i + 1}
                    </button>
                  ))}
                </div>
              )}

              {/* Current Record Review */}
              <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
                  <div>
                    <h3 className="text-sm font-black text-gray-900 mt-2">Parsed Intelligence</h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">Review the extracted intelligence fields before applying to the publication.</p>
                  </div>
                  {!editMode && (
                    <button onClick={() => setEditMode(true)} className="flex items-center gap-2 px-3 py-1.5 bg-stone-100 text-stone-700 text-[10px] font-black rounded-lg hover:bg-stone-200 transition-colors">
                      <FaEdit /> Edit Fields
                    </button>
                  )}
                </div>

                {editMode ? (
                  // Editor Form
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Using generic Input mapped to editData fields */}
                      <Input label="Executive Summary" name="execSummary" value={editData.execSummary} onChange={(e: any) => setEditData({...editData, execSummary: e.target.value})} />
                      <Input label="Problem Statement" name="problemStatement" value={editData.problemStatement} onChange={(e: any) => setEditData({...editData, problemStatement: e.target.value})} />
                      <Input label="Key Findings" name="keyFindings" value={editData.keyFindings} onChange={(e: any) => setEditData({...editData, keyFindings: e.target.value})} />
                      <Input label="Best Practice Highlights" name="bestPracticeHighlights" value={editData.bestPracticeHighlights} onChange={(e: any) => setEditData({...editData, bestPracticeHighlights: e.target.value})} />
                      <Input label="Implementation Framework" name="implementationFramework" value={editData.implementationFramework} onChange={(e: any) => setEditData({...editData, implementationFramework: e.target.value})} />
                      <Input label="Key Recommendations" name="keyRecommendations" value={editData.keyRecommendations} onChange={(e: any) => setEditData({...editData, keyRecommendations: e.target.value})} />
                      <Input label="Objectives" name="objectives" value={editData.objectives} onChange={(e: any) => setEditData({...editData, objectives: e.target.value})} />
                      <Input label="Expected Outcomes" name="expectedOutcomes" value={editData.expectedOutcomes} onChange={(e: any) => setEditData({...editData, expectedOutcomes: e.target.value})} />
                      <Input label="Methodology" name="methodology" value={editData.methodology} onChange={(e: any) => setEditData({...editData, methodology: e.target.value})} />
                      <Input label="Abstract" name="abstract" value={editData.abstract} onChange={(e: any) => setEditData({...editData, abstract: e.target.value})} />
                      <Input label="Research Questions" name="researchQuestions" value={editData.researchQuestions} onChange={(e: any) => setEditData({...editData, researchQuestions: e.target.value})} />
                      <Input label="Conclusions" name="conclusions" value={editData.conclusions} onChange={(e: any) => setEditData({...editData, conclusions: e.target.value})} />
                      <Input label="Keywords" name="keywords" value={editData.keywords} onChange={(e: any) => setEditData({...editData, keywords: e.target.value})} />
                      <Input label="Primary Keywords" name="primaryKeywords" value={editData.primaryKeywords} onChange={(e: any) => setEditData({...editData, primaryKeywords: e.target.value})} />
                      <Input label="Secondary Keywords" name="secondaryKeywords" value={editData.secondaryKeywords} onChange={(e: any) => setEditData({...editData, secondaryKeywords: e.target.value})} />
                      <Input label="Long Tail Keywords" name="longTailKeywords" value={editData.longTailKeywords} onChange={(e: any) => setEditData({...editData, longTailKeywords: e.target.value})} />
                      <Input label="Entity Keywords" name="entityKeywords" value={editData.entityKeywords} onChange={(e: any) => setEditData({...editData, entityKeywords: e.target.value})} />
                      <Input label="Catalog Short" name="catalogShort" value={editData.catalogShort} onChange={(e: any) => setEditData({...editData, catalogShort: e.target.value})} />
                      <Input label="Catalog Standard" name="catalogStandard" value={editData.catalogStandard} onChange={(e: any) => setEditData({...editData, catalogStandard: e.target.value})} />
                      <Input label="Catalog Extended" name="catalogExtended" value={editData.catalogExtended} onChange={(e: any) => setEditData({...editData, catalogExtended: e.target.value})} />
                      <Input label="Top Highlight" name="topHighlight" value={editData.topHighlight} onChange={(e: any) => setEditData({...editData, topHighlight: e.target.value})} />
                      <Input label="Description" name="description" value={editData.description} onChange={(e: any) => setEditData({...editData, description: e.target.value})} />
                      <Input label="Case Background" name="caseBackground" value={editData.caseBackground} onChange={(e: any) => setEditData({...editData, caseBackground: e.target.value})} />
                      <Input label="Challenge" name="challenge" value={editData.challenge} onChange={(e: any) => setEditData({...editData, challenge: e.target.value})} />
                      <Input label="Intervention" name="intervention" value={editData.intervention} onChange={(e: any) => setEditData({...editData, intervention: e.target.value})} />
                      <Input label="Results" name="results" value={editData.results} onChange={(e: any) => setEditData({...editData, results: e.target.value})} />
                      <Input label="Lessons Learned" name="lessonsLearned" value={editData.lessonsLearned} onChange={(e: any) => setEditData({...editData, lessonsLearned: e.target.value})} />
                      <Input label="Replicability" name="replicability" value={editData.replicability} onChange={(e: any) => setEditData({...editData, replicability: e.target.value})} />
                      <Input label="Policy Summary" name="policySum" value={editData.policySum} onChange={(e: any) => setEditData({...editData, policySum: e.target.value})} />
                      <Input label="Urgency Statement" name="urgencyStatement" value={editData.urgencyStatement} onChange={(e: any) => setEditData({...editData, urgencyStatement: e.target.value})} />
                      <Input label="Evidence Snapshot" name="evidenceSnapshot" value={editData.evidenceSnapshot} onChange={(e: any) => setEditData({...editData, evidenceSnapshot: e.target.value})} />
                      <Input label="Policy Recommendations" name="policyRecommendations" value={editData.policyRecommendations} onChange={(e: any) => setEditData({...editData, policyRecommendations: e.target.value})} />
                      <Input label="Market Summary" name="marketSummary" value={editData.marketSummary} onChange={(e: any) => setEditData({...editData, marketSummary: e.target.value})} />
                      <Input label="Export Trends" name="exportTrends" value={editData.exportTrends} onChange={(e: any) => setEditData({...editData, exportTrends: e.target.value})} />
                      <Input label="Price Signals" name="priceSignals" value={editData.priceSignals} onChange={(e: any) => setEditData({...editData, priceSignals: e.target.value})} />
                      <Input label="Market Risks" name="marketRisks" value={editData.marketRisks} onChange={(e: any) => setEditData({...editData, marketRisks: e.target.value})} />
                      <Input label="Opportunities" name="opportunities" value={editData.opportunities} onChange={(e: any) => setEditData({...editData, opportunities: e.target.value})} />
                      <Input label="Forecasts" name="forecasts" value={editData.forecasts} onChange={(e: any) => setEditData({...editData, forecasts: e.target.value})} />
                      <Input label="Book Overview" name="bookOverview" value={editData.bookOverview} onChange={(e: any) => setEditData({...editData, bookOverview: e.target.value})} />
                      <Input label="Learning Objectives" name="learningObjectives" value={editData.learningObjectives} onChange={(e: any) => setEditData({...editData, learningObjectives: e.target.value})} />
                      <Input label="Audience Benefits" name="audienceBenefits" value={editData.audienceBenefits} onChange={(e: any) => setEditData({...editData, audienceBenefits: e.target.value})} />
                      <Input label="Key Topics" name="keyTopics" value={editData.keyTopics} onChange={(e: any) => setEditData({...editData, keyTopics: e.target.value})} />
                    </div>
                  </div>
                ) : (
                  // Readonly Data
                  <div className="p-5 grid grid-cols-2 lg:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto">
                    {Object.entries(parsedRecords[activeRecordIdx]).map(([k, v]) => (
                      <div key={k} className="p-3 bg-stone-50 border border-stone-100 rounded-xl">
                        <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{k}</p>
                        <p className="text-xs text-gray-800 mt-1 line-clamp-3">{String(v)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Footer ── */}
          <div className="px-6 py-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between shrink-0">
            <div className="text-xs text-stone-500">
              {step === "review" && (
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-emerald-500" />
                  <span>Ready to apply</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button onClick={handleClose}
                className="px-4 py-2 bg-white border border-stone-200 text-stone-600 text-xs font-black rounded-xl hover:bg-stone-50 transition-colors">
                Cancel
              </button>
              
              {step === "review" && editMode && (
                <button onClick={() => {
                  setParsedRecords(prev => prev.map((r, i) => i === activeRecordIdx ? editData : r));
                  setEditMode(false);
                }} className="px-4 py-2 bg-stone-800 text-white text-xs font-black rounded-xl hover:bg-stone-900 transition-colors">
                  Save Changes
                </button>
              )}

              {step === "review" && !editMode && (
                <button onClick={handleApply}
                  className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white text-xs font-black rounded-xl hover:bg-purple-700 transition-all shadow-md shadow-purple-600/20">
                  <FaMagic /> Apply to Intelligence
                </button>
              )}
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
