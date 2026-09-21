"use client";

/**
 * BulkClassificationModal
 * ─────────────────────────────────────────────────────────────────────────────
 * Three modes:
 *   1. Upload     — CSV / JSON / YAML / DOCX / PDF
 *   2. Auto-Classify — reads title + abstract + keywords from existing form data
 *   3. Review     — controlled taxonomy pickers + discovery preview
 *
 * All parsing is 100% client-side.
 */

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes, FaUpload, FaCheck, FaSpinner, FaMagic, FaFileUpload,
  FaFileCode, FaFileCsv, FaFilePdf, FaFileWord, FaFileAlt,
  FaDownload, FaEye, FaSearch, FaRobot, FaBrain,
  FaGlobe, FaTag, FaUsers, FaChartBar, FaSlidersH,
  FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaArrowRight,
  FaLayerGroup, FaSync,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import Papa from "papaparse";
import { validateClassificationSchema } from "@/utils/schemaValidator";

// ─── KHCRF Controlled Taxonomies ──────────────────────────────────────────────

export const CRAFT_SECTORS = [
  "Pashmina", "Kani Weave", "Sozni Embroidery", "Carpet Weaving",
  "Papier Mâché", "Walnut Wood Carving", "Copperware", "Silverware",
  "Namda Felting", "Gabba Craft", "Chain Stitch Rugs", "Crewel Embroidery",
  "Willow Wicker", "Silk Weaving", "Multi-Craft", "Other",
];

export const DOMAIN_FOCUS = [
  "Authentication", "GI Protection", "Documentation", "Preservation",
  "Trade & Commerce", "Exports & Markets", "Market Intelligence",
  "Policy & Governance", "Sustainability", "Innovation & Technology",
  "Education & Training", "Heritage Conservation", "Legal & Compliance",
  "Artisan Welfare", "Supply Chain", "Quality Standards",
];

export const AUDIENCE_OPTIONS = [
  "Researchers", "Policymakers", "Artisans", "Exporters", "Traders",
  "Collectors", "Students", "Academic Institutions", "NGOs & CSOs",
  "Consumers", "Investors", "Media & Press", "Government Officials",
];

export const ACCESS_TIERS = [
  { value: "PUBLIC", label: "Open Access — Free to all" },
  { value: "REGISTERED", label: "Registered Users Only" },
  { value: "MEMBER", label: "Member-Only Premium" },
];

export const RESEARCH_LEVELS = [
  "General Public", "Professional", "Academic", "Policy-Level",
  "Technical Expert", "Field Practitioner", "Executive Summary",
];

export const CATEGORIES = [
  "Research Papers", "Best Practices", "Case Studies",
  "Market Intelligence", "Policy Briefs", "E-Publications",
  "Authentication Guides", "Craft Documentation", "Cluster Reports",
  "Export Intelligence", "Field Reports",
];

export const REGIONS = [
  "Kashmir Valley", "Jammu", "Ladakh", "Punjab", "Rajasthan",
  "Gujarat", "West Bengal", "Uttar Pradesh", "National", "South Asia",
  "Global", "Multiple Regions",
];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ClassificationData {
  category?: string;
  craftSector?: string;
  domain?: string;
  accessType?: string;
  audience?: string;          // comma-separated multi-select
  region?: string;
  country?: string;
  researchLevel?: string;
  price?: string;
  pages?: string;
  readingTime?: string;       // in minutes
  multipleCrafts?: string;    // comma-separated
  language?: string;
}

interface ConfidenceScore {
  value: string;
  score: number;
}

interface AutoClassifyResult {
  category: ConfidenceScore[];
  craftSector: ConfidenceScore[];
  domain: ConfidenceScore[];
  audience: ConfidenceScore[];
  region: ConfidenceScore[];
  researchLevel: ConfidenceScore[];
}

interface BulkClassificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: ClassificationData) => void;
  existingTitle?: string;
  existingDescription?: string;
  existingKeywords?: string;
  existingChapters?: Array<{ title: string; pages?: Array<{ content: string }> }>;
}

// ─── Field mapping for file parsers ───────────────────────────────────────────

const FIELD_MAP: Record<string, keyof ClassificationData> = {
  publication_category: "category", category: "category", Category: "category",
  craft_sector: "craftSector", craftSector: "craftSector", craft: "craftSector",
  domain_focus: "domain", domain: "domain", Domain: "domain",
  access_tier: "accessType", accessType: "accessType", access_type: "accessType",
  target_audience: "audience", audience: "audience", Audience: "audience",
  region_focus: "region", region: "region", Region: "region",
  country: "country", Country: "country",
  research_level: "researchLevel", researchLevel: "researchLevel", level: "researchLevel",
  price: "price", Price: "price",
  total_pages: "pages", pages: "pages", Pages: "pages",
  reading_time: "readingTime", readingTime: "readingTime",
  language: "language", Language: "language",
};

function parseRecord(raw: Record<string, string>): ClassificationData {
  const result: ClassificationData = {};
  for (const [k, v] of Object.entries(raw)) {
    const mapped = FIELD_MAP[k] ?? FIELD_MAP[k.toLowerCase()] ?? null;
    if (mapped && v) (result as any)[mapped] = v.trim();
  }
  return result;
}

// ─── File Parsers ─────────────────────────────────────────────────────────────

function parseJSON(text: string): ClassificationData[] {
  const obj = JSON.parse(text);
  const arr = Array.isArray(obj) ? obj : [obj];
  return arr.map(parseRecord);
}

function parseCSV(text: string): ClassificationData[] {
  const { data } = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true });
  return data.map(parseRecord);
}

function parseYAML(text: string): ClassificationData[] {
  const record: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const m = line.match(/^([a-zA-Z_][a-zA-Z0-9_ ]*?)\s*:\s*(.+)$/);
    if (m) record[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return [parseRecord(record)];
}

async function parseDOCXOrPDF(file: File): Promise<ClassificationData[]> {
  let text = "";
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "docx" || ext === "doc") {
    const mammoth = await import("mammoth");
    const { value } = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
    const doc = new DOMParser().parseFromString(value, "text/html");
    text = doc.body.textContent ?? "";
  } else {
    const pdfjsLib: any = await new Promise((res, rej) => {
      if ((window as any).pdfjsLib) return res((window as any).pdfjsLib);
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      s.onload = () => { (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"; res((window as any).pdfjsLib); };
      s.onerror = rej;
      document.head.appendChild(s);
    });
    const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
    for (let i = 1; i <= Math.min(5, pdf.numPages); i++) {
      const page = await pdf.getPage(i);
      const tc = await page.getTextContent();
      text += tc.items.map((it: any) => it.str).join(" ") + "\n";
    }
  }
  return [extractClassificationFromText(text)];
}

function extractClassificationFromText(text: string): ClassificationData {
  const t = text.toLowerCase();
  const result: ClassificationData = {};

  // Category
  for (const cat of CATEGORIES) {
    if (t.includes(cat.toLowerCase())) { result.category = cat; break; }
  }

  // Craft sector — check for keywords
  for (const cs of CRAFT_SECTORS) {
    if (t.includes(cs.toLowerCase())) { result.craftSector = cs; break; }
  }

  // Domain
  for (const d of DOMAIN_FOCUS) {
    if (t.includes(d.toLowerCase())) { result.domain = d; break; }
  }

  // Region
  for (const r of REGIONS) {
    if (t.includes(r.toLowerCase())) { result.region = r; break; }
  }

  // Country
  const countryMatch = text.match(/\b(India|Pakistan|Afghanistan|Bangladesh|Nepal|Sri Lanka)\b/);
  if (countryMatch) result.country = countryMatch[1];

  // Research level
  for (const rl of RESEARCH_LEVELS) {
    if (t.includes(rl.toLowerCase())) { result.researchLevel = rl; break; }
  }

  // Price from text
  const priceMatch = text.match(/price[:\s]*₹?\s*(\d+)/i);
  if (priceMatch) result.price = priceMatch[1];

  return result;
}

// ─── AI Auto-Classifier ────────────────────────────────────────────────────────
// Keyword-scoring based. No external API required.

const CRAFT_KEYWORDS: Record<string, string[]> = {
  "Pashmina": ["pashmina", "pashm", "cashmere", "shahtoosh", "hand-spun", "handspun", "shawl"],
  "Kani Weave": ["kani", "kani weave", "twill tapestry", "loom"],
  "Sozni Embroidery": ["sozni", "needlework", "embroidery", "chain stitch"],
  "Carpet Weaving": ["carpet", "rug", "pile weaving", "hand-knotted", "namdah"],
  "Papier Mâché": ["papier", "paper mache", "lacquerwork"],
  "Walnut Wood Carving": ["walnut", "wood carving", "carved wood"],
  "Copperware": ["copper", "copperware", "metal craft"],
  "Silverware": ["silver", "silverware", "filigree"],
};

const DOMAIN_KEYWORDS: Record<string, string[]> = {
  "Authentication": ["authentic", "verification", "genuine", "gi", "geographic indication", "origin", "traceability"],
  "GI Protection": ["gi tag", "geographic indication", "intellectual property", "trademark"],
  "Trade & Commerce": ["trade", "commerce", "market", "price", "export", "import"],
  "Policy & Governance": ["policy", "governance", "regulation", "legislation", "act", "law"],
  "Preservation": ["preserve", "conservation", "heritage", "tradition"],
  "Market Intelligence": ["market intelligence", "market analysis", "trends", "forecast"],
  "Education & Training": ["training", "skill", "education", "capacity building"],
  "Sustainability": ["sustainable", "sustainability", "environmental", "eco"],
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "Best Practices": ["best practice", "framework", "standard", "guideline", "protocol", "procedure"],
  "Research Papers": ["research", "study", "analysis", "empirical", "hypothesis", "methodology", "abstract"],
  "Case Studies": ["case study", "case analysis", "example", "case report"],
  "Policy Briefs": ["policy brief", "recommendation", "policy maker", "stakeholder"],
  "Market Intelligence": ["market report", "market analysis", "market intelligence", "price signal"],
};

const AUDIENCE_KEYWORDS: Record<string, string[]> = {
  "Researchers": ["research", "academic", "scholar", "study", "findings"],
  "Policymakers": ["policy", "government", "legislation", "governance", "minister"],
  "Artisans": ["artisan", "craftsman", "weaver", "skilled worker"],
  "Exporters": ["export", "exporter", "international market", "foreign buyer"],
  "Traders": ["trader", "merchant", "market participant"],
  "Students": ["student", "curriculum", "university", "college"],
};

const REGION_KEYWORDS: Record<string, string[]> = {
  "Kashmir Valley": ["kashmir", "srinagar", "dal lake", "valley"],
  "Jammu": ["jammu", "dogra"],
  "Ladakh": ["ladakh", "leh", "kargil"],
  "Punjab": ["punjab", "ludhiana"],
  "Gujarat": ["gujarat", "surat", "ahmedabad"],
  "Rajasthan": ["rajasthan", "jaipur", "jodhpur"],
};

function scoreKeywords(text: string, keywords: string[]): number {
  const t = text.toLowerCase();
  let score = 0;
  for (const kw of keywords) {
    const count = (t.match(new RegExp(kw, "g")) || []).length;
    score += count;
  }
  return score;
}

function autoClassify(title: string, description: string, keywords: string, chapterText: string): AutoClassifyResult {
  const fullText = [title, description, keywords, chapterText].join(" ").toLowerCase();

  const rank = <T extends Record<string, string[]>>(map: T): ConfidenceScore[] => {
    const scored = Object.entries(map).map(([label, kws]) => ({
      value: label,
      rawScore: scoreKeywords(fullText, kws),
    }));
    const max = Math.max(...scored.map(s => s.rawScore), 1);
    return scored
      .map(s => ({ value: s.value, score: Math.min(99, Math.round((s.rawScore / max) * 85 + (s.rawScore > 0 ? 10 : 0))) }))
      .filter(s => s.score > 5)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  };

  // Audience multi-score
  const audienceScored = Object.entries(AUDIENCE_KEYWORDS)
    .map(([label, kws]) => ({ value: label, score: scoreKeywords(fullText, kws) }))
    .filter(s => s.score > 0)
    .map(s => ({ value: s.value, score: Math.min(99, Math.round(55 + s.score * 8)) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  // Region
  const regionScored = Object.entries(REGION_KEYWORDS)
    .map(([label, kws]) => ({ value: label, score: scoreKeywords(fullText, kws) }))
    .filter(s => s.score > 0)
    .map(s => ({ value: s.value, score: Math.min(99, Math.round(60 + s.score * 10)) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return {
    category: rank(CATEGORY_KEYWORDS),
    craftSector: rank(CRAFT_KEYWORDS),
    domain: rank(DOMAIN_KEYWORDS),
    audience: audienceScored,
    region: regionScored,
    researchLevel: [
      { value: "Professional", score: 72 },
      { value: "Academic", score: 65 },
    ],
  };
}

// ─── Reading Metrics Calculator ───────────────────────────────────────────────

function calculateReadingMetrics(chapters: Array<{ title: string; pages?: Array<{ content: string }> }>): {
  pages: number; wordCount: number; readingTimeMinutes: number;
} {
  let wordCount = 0;
  let pages = 0;

  for (const ch of chapters) {
    for (const page of ch.pages ?? []) {
      try {
        const blocks = JSON.parse(page.content);
        const text = Array.isArray(blocks) ? blocks.map((b: any) => b.text ?? "").join(" ") : "";
        wordCount += text.split(/\s+/).filter(Boolean).length;
        pages++;
      } catch { /* ignore */ }
    }
  }

  // Estimate: 250 words/page, 200 words/min reading speed
  const estimatedPages = pages || Math.ceil(wordCount / 250);
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
  return { pages: estimatedPages, wordCount, readingTimeMinutes };
}

// ─── Templates ────────────────────────────────────────────────────────────────

const CSV_TPL = `publication_category,craft_sector,domain_focus,access_tier,target_audience,region_focus,country,research_level,price,total_pages,reading_time
Best Practices,Pashmina,Authentication,PUBLIC,Researchers,Kashmir Valley,India,Professional,0,120,360`;

const JSON_TPL = JSON.stringify({
  publication_category: "Best Practices",
  craft_sector: "Pashmina",
  domain_focus: "Authentication",
  access_tier: "PUBLIC",
  target_audience: "Researchers",
  region_focus: "Kashmir Valley",
  country: "India",
  research_level: "Professional",
  price: 0,
  total_pages: 120,
  reading_time: 360,
}, null, 2);

function downloadTemplate(type: "csv" | "json") {
  const map = { csv: { content: CSV_TPL, mime: "text/csv", ext: "csv" }, json: { content: JSON_TPL, mime: "application/json", ext: "json" } };
  const { content, mime, ext } = map[type];
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type: mime }));
  a.download = `hcrf_classification_template.${ext}`;
  a.click();
}

// ─── Score Bar ────────────────────────────────────────────────────────────────

function ScoreBar({ score, color = "teal" }: { score: number; color?: string }) {
  const cls = color === "teal" ? "bg-teal-500" : color === "blue" ? "bg-blue-500" : color === "amber" ? "bg-amber-500" : "bg-purple-500";
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
        <motion.div className={`h-full ${cls} rounded-full`} initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.5 }} />
      </div>
      <span className="text-[9px] font-black text-stone-500 w-8 text-right">{score}%</span>
    </div>
  );
}

// ─── Multi-Select Pills ───────────────────────────────────────────────────────

function MultiSelectPills({ options, selected, onChange, color = "teal" }: {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  color?: string;
}) {
  const toggle = (opt: string) => {
    onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]);
  };
  const activeClass = color === "teal" ? "bg-teal-500 text-white border-teal-500" : "bg-blue-500 text-white border-blue-500";
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(opt => (
        <button key={opt} type="button" onClick={() => toggle(opt)}
          className={`px-2.5 py-1 rounded-full border text-[10px] font-bold transition-all ${
            selected.includes(opt) ? activeClass : "bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-300"
          }`}>
          {selected.includes(opt) && <FaCheck className="inline mr-1" size={7} />}
          {opt}
        </button>
      ))}
    </div>
  );
}

// ─── Discovery Preview Card ───────────────────────────────────────────────────

function DiscoveryPreview({ data }: { data: ClassificationData }) {
  const audiences = data.audience ? data.audience.split(",").map(s => s.trim()) : [];
  const searchVisibility = (() => {
    let score = 0;
    if (data.category) score += 25;
    if (data.craftSector) score += 25;
    if (data.domain) score += 20;
    if (audiences.length) score += 15;
    if (data.region) score += 15;
    const label = score >= 80 ? "High" : score >= 50 ? "Medium" : "Low";
    const cls = score >= 80 ? "text-emerald-600 bg-emerald-50 border-emerald-200" : score >= 50 ? "text-amber-600 bg-amber-50 border-amber-200" : "text-red-600 bg-red-50 border-red-200";
    return { label, cls, score };
  })();

  return (
    <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-2xl p-5 text-white">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[9px] font-black uppercase tracking-widest text-stone-400">Discovery Preview</p>
        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${searchVisibility.cls}`}>
          Search Visibility: {searchVisibility.label}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-[10px]">
        {[
          { label: "Category", value: data.category, icon: <FaLayerGroup size={9} className="text-teal-400" /> },
          { label: "Craft Sector", value: data.craftSector, icon: <FaTag size={9} className="text-amber-400" /> },
          { label: "Domain Focus", value: data.domain, icon: <FaSearch size={9} className="text-blue-400" /> },
          { label: "Access Tier", value: data.accessType ? ACCESS_TIERS.find(a => a.value === data.accessType)?.label?.split("—")[0]?.trim() : null, icon: <FaGlobe size={9} className="text-purple-400" /> },
          { label: "Region", value: data.region, icon: <FaGlobe size={9} className="text-green-400" /> },
          { label: "Country", value: data.country, icon: <FaGlobe size={9} className="text-green-300" /> },
        ].map(({ label, value, icon }) => (
          <div key={label} className={`p-2.5 rounded-xl ${value ? "bg-white/10" : "bg-white/5 opacity-40"}`}>
            <div className="flex items-center gap-1.5 mb-1">{icon}<span className="text-stone-400 text-[9px]">{label}</span></div>
            <p className="font-bold truncate">{value || <span className="text-stone-500 italic text-[9px]">Not set</span>}</p>
          </div>
        ))}
      </div>
      {audiences.length > 0 && (
        <div className="mt-3 p-2.5 bg-white/10 rounded-xl">
          <div className="flex items-center gap-1.5 mb-1.5"><FaUsers size={9} className="text-teal-400" /><span className="text-stone-400 text-[9px]">Target Audience</span></div>
          <div className="flex flex-wrap gap-1">
            {audiences.map(a => <span key={a} className="bg-teal-500/30 text-teal-200 px-2 py-0.5 rounded-full text-[9px] font-bold">{a}</span>)}
          </div>
        </div>
      )}
      {(data.pages || data.readingTime) && (
        <div className="mt-3 flex gap-3">
          {data.pages && <div className="flex-1 p-2.5 bg-white/10 rounded-xl text-center"><p className="text-[9px] text-stone-400">Pages</p><p className="font-black text-lg">{data.pages}</p></div>}
          {data.readingTime && <div className="flex-1 p-2.5 bg-white/10 rounded-xl text-center"><p className="text-[9px] text-stone-400">Read Time</p><p className="font-black text-lg">{Math.ceil(Number(data.readingTime) / 60)}h {Number(data.readingTime) % 60}m</p></div>}
        </div>
      )}
      {/* Search visibility bar */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] text-stone-400">Indexing Completeness</span>
          <span className="text-[9px] font-black text-white">{searchVisibility.score}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
            initial={{ width: 0 }} animate={{ width: `${searchVisibility.score}%` }} transition={{ duration: 0.8 }} />
        </div>
      </div>
    </div>
  );
}

// ─── Main Modal ────────────────────────────────────────────────────────────────

type ModalTab = "upload" | "auto" | "review";

export default function BulkClassificationModal({
  isOpen, onClose, onApply,
  existingTitle = "", existingDescription = "", existingKeywords = "",
  existingChapters = [],
}: BulkClassificationModalProps) {
  const dropRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<ModalTab>("upload");
  const [dragOver, setDragOver] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [classifying, setClassifying] = useState(false);
  const [filename, setFilename] = useState("");

  // Review state
  const [data, setData] = useState<ClassificationData>({});
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>([]);
  const [autoResult, setAutoResult] = useState<AutoClassifyResult | null>(null);
  const [metricsCalculated, setMetricsCalculated] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const reset = () => {
    setTab("upload"); setData({}); setSelectedAudiences([]); setAutoResult(null);
    setMetricsCalculated(false); setShowReview(false); setFilename("");
  };

  const handleClose = () => { reset(); onClose(); };

  const mergeAudiences = (d: ClassificationData, aud: string[]): ClassificationData => ({
    ...d,
    audience: aud.length ? aud.join(", ") : d.audience,
  });

  const handleApply = () => {
    const final = mergeAudiences(data, selectedAudiences);
    if (!final.category) { toast.error("Publication Category is required"); return; }
    onApply(final);
    toast.success("✓ Classification applied");
    handleClose();
  };

  // ── File parse ───────────────────────────────────────────────────────────────

  const parseFile = useCallback(async (file: File) => {
    setParsing(true); setFilename(file.name);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      let records: ClassificationData[] = [];
      if (ext === "json") {
        const jsonText = await file.text();
        const json = JSON.parse(jsonText);
        const arr = Array.isArray(json) ? json : [json];
        for (const item of arr) {
          const result = validateClassificationSchema(item);
          if (!result.isValid) {
            throw new Error(`Invalid Schema (hcrf_classification_v1): ${result.errors.join(", ")}`);
          }
          if (result.warnings.length > 0) {
            result.warnings.forEach(w => toast(w, { icon: "⚠️" }));
          }
          records.push(result.normalizedData);
        }
      } else if (ext === "csv") records = parseCSV(await file.text());
      else if (ext === "yaml" || ext === "yml") records = parseYAML(await file.text());
      else if (ext === "docx" || ext === "doc" || ext === "pdf") records = await parseDOCXOrPDF(file);
      else throw new Error(`Unsupported format: .${ext}`);

      const merged = records[0] ?? {};
      const aud = merged.audience ? merged.audience.split(",").map(s => s.trim()) : [];
      setData(merged);
      setSelectedAudiences(aud);
      setShowReview(true);
      setTab("review");
      toast.success(`Parsed classification from ${file.name}`);
    } catch (err: any) {
      toast.error(`Parse failed: ${err?.message ?? "Unknown error"}`);
    } finally { setParsing(false); }
  }, []);

  // ── Auto-classify ────────────────────────────────────────────────────────────

  const handleAutoClassify = async () => {
    setClassifying(true);
    await new Promise(r => setTimeout(r, 800)); // simulate analysis
    const chapterText = existingChapters.flatMap(c =>
      (c.pages ?? []).map(p => { try { return JSON.parse(p.content).map((b: any) => b.text).join(" "); } catch { return ""; } })
    ).join(" ");
    const result = autoClassify(existingTitle, existingDescription, existingKeywords, chapterText);
    setAutoResult(result);
    setClassifying(false);
  };

  const applyAutoSuggestion = (field: keyof ClassificationData, value: string) => {
    if (field === "audience") {
      setSelectedAudiences(prev => prev.includes(value) ? prev : [...prev, value]);
    } else {
      setData(prev => ({ ...prev, [field]: value }));
    }
    toast.success(`Applied: ${value}`);
  };

  // ── Reading metrics ──────────────────────────────────────────────────────────

  const handleCalculateMetrics = () => {
    if (!existingChapters.length) { toast.error("No manuscript chapters yet. Build the manuscript first."); return; }
    const { pages, wordCount, readingTimeMinutes } = calculateReadingMetrics(existingChapters);
    setData(prev => ({ ...prev, pages: String(pages), readingTime: String(readingTimeMinutes) }));
    setMetricsCalculated(true);
    toast.success(`Calculated: ${pages} pages, ~${wordCount} words, ${readingTimeMinutes} min reading time`);
  };

  if (!isOpen) return null;

  const currentData = mergeAudiences(data, selectedAudiences);

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        onClick={e => e.target === e.currentTarget && handleClose()}>
        <motion.div initial={{ scale: 0.95, y: 10, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full flex flex-col overflow-hidden"
          style={{ maxWidth: 900, maxHeight: "93vh" }}>

          {/* ── Header ── */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-stone-900 to-stone-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <FaLayerGroup className="text-blue-400" size={14} />
              </div>
              <div>
                <h2 className="text-sm font-black text-white">Bulk Classification Import</h2>
                <p className="text-[10px] text-stone-400 mt-0.5">Auto-populate craft sector, domain, audience, region, and discovery metadata</p>
              </div>
            </div>
            {/* Tabs */}
            <div className="flex bg-white/10 rounded-xl p-1 gap-1">
              {([
                { id: "upload", label: "Upload File", icon: <FaFileUpload size={9} /> },
                { id: "auto", label: "Auto-Classify", icon: <FaRobot size={9} /> },
                { id: "review", label: "Review & Apply", icon: <FaEye size={9} /> },
              ] as const).map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                    tab === t.id ? "bg-white text-stone-900" : "text-stone-400 hover:text-white"
                  }`}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
            <button onClick={handleClose} className="p-2 rounded-xl hover:bg-white/10 text-stone-400 hover:text-white transition-colors ml-3">
              <FaTimes size={13} />
            </button>
          </div>

          {/* ── Body ── */}
          <div className="flex-1 overflow-y-auto">

            {/* ╔══ TAB: Upload ══╗ */}
            {tab === "upload" && (
              <div className="p-6 space-y-5">
                {/* Drop zone */}
                <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) parseFile(f); }}
                  onClick={() => dropRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-4 text-center cursor-pointer transition-all ${dragOver ? "border-blue-400 bg-blue-50" : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"} ${parsing ? "pointer-events-none opacity-60" : ""}`}>
                  <input ref={dropRef} type="file" accept=".csv,.json,.yaml,.yml,.docx,.doc,.pdf" onChange={e => { const f = e.target.files?.[0]; if (f) parseFile(f); e.target.value = ""; }} className="hidden" />
                  {parsing ? <FaSpinner className="text-blue-500 text-3xl animate-spin" /> : <FaFileUpload className={dragOver ? "text-blue-500 text-3xl" : "text-stone-400 text-3xl"} />}
                  <div>
                    <p className="text-sm font-black text-gray-800">
                      {parsing ? "Parsing classification data…" : <>Drop a metadata file or <span className="text-blue-600">click to browse</span></>}
                    </p>
                    <p className="text-[11px] text-stone-400 mt-1">CSV · JSON · YAML · DOCX · PDF</p>
                  </div>
                </div>

                {/* Format grid */}
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { icon: <FaFileCsv className="text-green-500 text-xl" />, label: "CSV" },
                    { icon: <FaFileCode className="text-yellow-500 text-xl" />, label: "JSON" },
                    { icon: <FaFileCode className="text-orange-400 text-xl" />, label: "YAML" },
                    { icon: <FaFileWord className="text-blue-500 text-xl" />, label: "DOCX" },
                    { icon: <FaFilePdf className="text-red-500 text-xl" />, label: "PDF" },
                  ].map(({ icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1.5 p-3 bg-stone-50 border border-stone-100 rounded-xl">
                      {icon}<p className="text-[10px] font-black text-gray-700">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Templates */}
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">Download Templates</p>
                  <div className="flex gap-2">
                    {(["csv", "json"] as const).map(type => (
                      <button key={type} onClick={() => downloadTemplate(type)}
                        className="flex items-center gap-2 px-3 py-2 bg-stone-50 border border-stone-200 text-stone-600 text-[10px] font-black rounded-xl hover:bg-stone-100 transition-all">
                        <FaDownload size={9} /> {type.toUpperCase()} Template
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tip */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-[10px] font-black text-blue-700 mb-1">💡 Or use Auto-Classify</p>
                  <p className="text-[9px] text-blue-600">Switch to the Auto-Classify tab to automatically detect classification from your existing title, abstract, and manuscript content — no file needed.</p>
                </div>
              </div>
            )}

            {/* ╔══ TAB: Auto-Classify ══╗ */}
            {tab === "auto" && (
              <div className="p-6 space-y-5">
                {/* Source info */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Title", value: existingTitle, filled: !!existingTitle },
                    { label: "Abstract / Description", value: existingDescription?.slice(0, 60), filled: !!existingDescription },
                    { label: "Chapters", value: existingChapters.length ? `${existingChapters.length} chapters loaded` : null, filled: existingChapters.length > 0 },
                  ].map(({ label, value, filled }) => (
                    <div key={label} className={`p-3 rounded-xl border ${filled ? "bg-emerald-50 border-emerald-200" : "bg-stone-50 border-stone-200 opacity-60"}`}>
                      <div className="flex items-center gap-1.5 mb-1">
                        {filled ? <FaCheckCircle className="text-emerald-500" size={10} /> : <FaTimesCircle className="text-stone-300" size={10} />}
                        <span className="text-[9px] font-black text-stone-500 uppercase">{label}</span>
                      </div>
                      <p className="text-[10px] text-gray-700 font-bold truncate">{value || <span className="text-stone-300 italic">Not yet entered</span>}</p>
                    </div>
                  ))}
                </div>

                {!autoResult ? (
                  <div className="flex flex-col items-center gap-4 py-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                      <FaBrain className="text-blue-500 text-2xl" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-sm font-black text-gray-900">Auto-Classify From Manuscript</h3>
                      <p className="text-xs text-gray-500 mt-1 max-w-sm">Analyzes title, description, keywords, and chapter content to suggest classification values with confidence scores.</p>
                    </div>
                    <button onClick={handleAutoClassify} disabled={classifying || (!existingTitle && !existingDescription)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-black rounded-xl hover:opacity-90 disabled:opacity-40 shadow-lg shadow-blue-500/20 transition-all">
                      {classifying ? <FaSpinner className="animate-spin" size={12} /> : <FaMagic size={12} />}
                      {classifying ? "Analysing content…" : "Run Auto-Classification"}
                    </button>
                    {!existingTitle && !existingDescription && (
                      <p className="text-[10px] text-amber-600">Enter a title or description in the Identity section first</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest">AI Classification Results — Click to apply</p>
                      <button onClick={() => { setAutoResult(null); setClassifying(false); }}
                        className="text-[9px] text-stone-400 hover:text-stone-700 font-bold flex items-center gap-1">
                        <FaSync size={8} /> Re-analyse
                      </button>
                    </div>

                    {([
                      { key: "category" as const, label: "Publication Category", color: "teal" },
                      { key: "craftSector" as const, label: "Craft Sector", color: "amber" },
                      { key: "domain" as const, label: "Domain Focus", color: "blue" },
                      { key: "region" as const, label: "Geographic Region", color: "green" },
                    ]).map(({ key, label, color }) => (
                      autoResult[key].length > 0 && (
                        <div key={key} className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
                          <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest mb-3">{label}</p>
                          <div className="space-y-2">
                            {autoResult[key].map(({ value, score }) => (
                              <div key={value} className="flex items-center gap-3">
                                <button onClick={() => applyAutoSuggestion(key, value)}
                                  title="Click to apply"
                                  className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-black border transition-all ${
                                    data[key] === value ? "bg-teal-500 text-white border-teal-500" : "bg-white border-stone-200 text-stone-700 hover:border-teal-300 hover:bg-teal-50"
                                  }`}>
                                  {data[key] === value ? <FaCheck className="inline mr-1" size={7} /> : null}
                                  {value}
                                </button>
                                <ScoreBar score={score} color={color} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    ))}

                    {/* Audience multi-select */}
                    {autoResult.audience.length > 0 && (
                      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
                        <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest mb-3">Target Audience <span className="text-teal-500">(multi-select)</span></p>
                        <div className="space-y-2">
                          {autoResult.audience.map(({ value, score }) => (
                            <div key={value} className="flex items-center gap-3">
                              <button onClick={() => applyAutoSuggestion("audience", value)}
                                className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-black border transition-all ${
                                  selectedAudiences.includes(value) ? "bg-teal-500 text-white border-teal-500" : "bg-white border-stone-200 text-stone-700 hover:border-teal-300 hover:bg-teal-50"
                                }`}>
                                {selectedAudiences.includes(value) ? <FaCheck className="inline mr-1" size={7} /> : null}
                                {value}
                              </button>
                              <ScoreBar score={score} color="teal" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button onClick={() => setTab("review")}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-black rounded-xl hover:bg-blue-100 transition-all">
                      Review & Adjust All Fields <FaArrowRight size={9} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ╔══ TAB: Review ══╗ */}
            {tab === "review" && (
              <div className="p-6">
                <div className="grid grid-cols-5 gap-5">

                  {/* LEFT: controlled fields */}
                  <div className="col-span-3 space-y-4">
                    <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Classification Fields</p>

                    {/* Category */}
                    <div>
                      <label className="text-[10px] font-black text-stone-600 uppercase tracking-wider block mb-1.5">
                        Publication Category <span className="text-red-400">*</span>
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {CATEGORIES.map(cat => (
                          <button key={cat} type="button" onClick={() => setData(p => ({ ...p, category: cat }))}
                            className={`px-2.5 py-1 rounded-full border text-[10px] font-bold transition-all ${
                              data.category === cat ? "bg-teal-500 text-white border-teal-500" : "bg-stone-50 text-stone-600 border-stone-200 hover:border-teal-300"
                            }`}>
                            {data.category === cat && <FaCheck className="inline mr-1" size={7} />}{cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Craft Sector */}
                    <div>
                      <label className="text-[10px] font-black text-stone-600 uppercase tracking-wider block mb-1.5">Primary Craft Sector</label>
                      <div className="flex flex-wrap gap-1.5">
                        {CRAFT_SECTORS.map(cs => (
                          <button key={cs} type="button" onClick={() => setData(p => ({ ...p, craftSector: cs }))}
                            className={`px-2.5 py-1 rounded-full border text-[10px] font-bold transition-all ${
                              data.craftSector === cs ? "bg-amber-500 text-white border-amber-500" : "bg-stone-50 text-stone-600 border-stone-200 hover:border-amber-300"
                            }`}>
                            {data.craftSector === cs && <FaCheck className="inline mr-1" size={7} />}{cs}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Domain Focus */}
                    <div>
                      <label className="text-[10px] font-black text-stone-600 uppercase tracking-wider block mb-1.5">Domain Focus</label>
                      <div className="flex flex-wrap gap-1.5">
                        {DOMAIN_FOCUS.map(d => (
                          <button key={d} type="button" onClick={() => setData(p => ({ ...p, domain: d }))}
                            className={`px-2.5 py-1 rounded-full border text-[10px] font-bold transition-all ${
                              data.domain === d ? "bg-blue-500 text-white border-blue-500" : "bg-stone-50 text-stone-600 border-stone-200 hover:border-blue-300"
                            }`}>
                            {data.domain === d && <FaCheck className="inline mr-1" size={7} />}{d}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Target Audience (multi) */}
                    <div>
                      <label className="text-[10px] font-black text-stone-600 uppercase tracking-wider block mb-1.5">
                        Target Audience <span className="text-teal-500 text-[9px] normal-case font-bold">(multi-select)</span>
                      </label>
                      <MultiSelectPills options={AUDIENCE_OPTIONS} selected={selectedAudiences} onChange={setSelectedAudiences} />
                    </div>

                    {/* Access Tier */}
                    <div>
                      <label className="text-[10px] font-black text-stone-600 uppercase tracking-wider block mb-1.5">Access Tier</label>
                      <div className="flex gap-2">
                        {ACCESS_TIERS.map(({ value, label }) => (
                          <button key={value} type="button" onClick={() => setData(p => ({ ...p, accessType: value }))}
                            className={`flex-1 px-3 py-2 rounded-xl border text-[10px] font-bold text-center transition-all ${
                              data.accessType === value ? "bg-purple-500 text-white border-purple-500" : "bg-stone-50 text-stone-600 border-stone-200 hover:border-purple-300"
                            }`}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Research Level */}
                    <div>
                      <label className="text-[10px] font-black text-stone-600 uppercase tracking-wider block mb-1.5">Research Level</label>
                      <div className="flex flex-wrap gap-1.5">
                        {RESEARCH_LEVELS.map(rl => (
                          <button key={rl} type="button" onClick={() => setData(p => ({ ...p, researchLevel: rl }))}
                            className={`px-2.5 py-1 rounded-full border text-[10px] font-bold transition-all ${
                              data.researchLevel === rl ? "bg-stone-700 text-white border-stone-700" : "bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400"
                            }`}>
                            {data.researchLevel === rl && <FaCheck className="inline mr-1" size={7} />}{rl}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Region + Country */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-black text-stone-600 uppercase tracking-wider block mb-1.5">Region Focus</label>
                        <select value={data.region ?? ""} onChange={e => setData(p => ({ ...p, region: e.target.value }))}
                          className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400">
                          <option value="">Select region…</option>
                          {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-stone-600 uppercase tracking-wider block mb-1.5">Country</label>
                        <input value={data.country ?? ""} onChange={e => setData(p => ({ ...p, country: e.target.value }))}
                          placeholder="e.g. India"
                          className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" />
                      </div>
                    </div>

                    {/* Price */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-black text-stone-600 uppercase tracking-wider block mb-1.5">Price (₹ — 0 for free)</label>
                        <input type="number" min="0" value={data.price ?? ""} onChange={e => setData(p => ({ ...p, price: e.target.value }))}
                          placeholder="0"
                          className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-stone-600 uppercase tracking-wider block mb-1.5">
                          Reading Metrics
                          <button onClick={handleCalculateMetrics} title="Calculate from manuscript"
                            className="ml-2 text-teal-500 hover:text-teal-700 transition-colors">
                            <FaSync size={9} className={metricsCalculated ? "text-emerald-500" : ""} />
                          </button>
                        </label>
                        <div className="flex gap-2">
                          <input type="number" value={data.pages ?? ""} onChange={e => setData(p => ({ ...p, pages: e.target.value }))}
                            placeholder="Pages"
                            className="flex-1 px-2 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" />
                          <input type="number" value={data.readingTime ?? ""} onChange={e => setData(p => ({ ...p, readingTime: e.target.value }))}
                            placeholder="Min"
                            className="flex-1 px-2 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>
                        <p className="text-[9px] text-stone-400 mt-1">Pages · Reading time (mins). Click ↻ to auto-calculate.</p>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: discovery preview */}
                  <div className="col-span-2 sticky top-0 space-y-4">
                    <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Live Preview</p>
                    <DiscoveryPreview data={currentData} />
                    {!data.category && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-[10px] font-black text-red-700 flex items-center gap-1.5">
                          <FaTimesCircle size={10} /> Category required before applying
                        </p>
                      </div>
                    )}
                    {data.category && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <p className="text-[10px] font-black text-emerald-700 flex items-center gap-1.5 mb-1">
                          <FaCheckCircle size={10} /> Ready to apply
                        </p>
                        <p className="text-[9px] text-emerald-600">Classification will be applied to the current publication form.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-stone-200 bg-stone-50 shrink-0">
            <div className="flex gap-2">
              {tab === "review" && (
                <button onClick={() => setTab("upload")}
                  className="px-3 py-2 bg-stone-100 text-stone-600 text-[10px] font-black rounded-xl hover:bg-stone-200 transition-all">
                  ← Upload Different File
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={handleClose} className="px-4 py-2 bg-stone-100 text-stone-600 text-[10px] font-black rounded-xl hover:bg-stone-200">
                Cancel
              </button>
              {tab !== "review" && (
                <button onClick={() => setTab("review")}
                  className="flex items-center gap-1.5 px-4 py-2 bg-stone-100 border border-stone-200 text-stone-700 text-[10px] font-black rounded-xl hover:bg-stone-200 transition-all">
                  <FaEye size={9} /> Open Review & Apply
                </button>
              )}
              {tab === "review" && (
                <button onClick={handleApply} disabled={!data.category}
                  className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[10px] font-black rounded-xl hover:opacity-90 shadow-md shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  <FaCheck size={9} /> Apply Classification <FaArrowRight size={8} />
                </button>
              )}
            </div>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
