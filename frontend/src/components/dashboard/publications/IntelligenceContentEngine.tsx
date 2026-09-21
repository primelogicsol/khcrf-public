"use client";

/**
 * IntelligenceContentEngine
 * ─────────────────────────────────────────────────────────────────────────────
 * Inline panel injected at the top of the Intelligence Page Content section.
 * Provides:
 *   • Generate From Manuscript (client-side, reads chapters[])
 *   • Category-aware template fields (already handled by parent form)
 *   • Keyword Intelligence (Primary / Secondary / Long-tail / Entity)
 *   • Catalog Card Generator (Short 120 / Standard 300 / Extended 600 chars)
 *   • AI Quality Score panel
 *   • Live public preview panel (right side)
 *
 * ALL generation is 100% client-side — no external API required.
 * Generation uses keyword extraction + sentence scoring from chapter content.
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMagic, FaSpinner, FaCheck, FaRedo, FaEye, FaCopy,
  FaLightbulb, FaSearch, FaTag, FaChartBar, FaBookOpen,
  FaExclamationTriangle, FaCheckCircle, FaArrowDown,
  FaFileAlt, FaDownload, FaBolt,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IntelligenceContent {
  execSummary?: string;
  problemStatement?: string;
  keyFindings?: string;
  bestPracticeHighlights?: string;
  implementationFramework?: string;
  keyRecommendations?: string;
  objectives?: string;
  expectedOutcomes?: string;
  methodology?: string;
  abstract?: string;
  researchQuestions?: string;
  conclusions?: string;
  // Keywords
  keywords?: string;
  primaryKeywords?: string;
  secondaryKeywords?: string;
  longTailKeywords?: string;
  entityKeywords?: string;
  // Catalog
  catalogShort?: string;    // 120 chars
  catalogStandard?: string; // 300 chars
  catalogExtended?: string; // 600 chars
  topHighlight?: string;
  description?: string;
  // Case Study
  caseBackground?: string;
  challenge?: string;
  intervention?: string;
  results?: string;
  lessonsLearned?: string;
  replicability?: string;
  // Policy
  policySum?: string;
  urgencyStatement?: string;
  evidenceSnapshot?: string;
  policyRecommendations?: string;
  // Market
  marketSummary?: string;
  exportTrends?: string;
  priceSignals?: string;
  marketRisks?: string;
  opportunities?: string;
  forecasts?: string;
  // E-pub
  bookOverview?: string;
  learningObjectives?: string;
  audienceBenefits?: string;
  keyTopics?: string;
}

export interface IntelligenceEngineProps {
  publicationTitle?: string;
  publicationBlueprint?: string;
  craftSector?: string;
  domain?: string;
  existingKeywords?: string;
  chapters?: Array<{ title: string; pages?: Array<{ content: string }> }>;
  onApply: (content: IntelligenceContent) => void;
  currentContent?: Partial<IntelligenceContent>;
}

// ─── Text Extraction Utilities ────────────────────────────────────────────────

function extractChapterText(
  chapters: Array<{ title: string; pages?: Array<{ content: string }> }>
): string {
  return chapters.flatMap(ch => [
    ch.title,
    ...(ch.pages ?? []).flatMap(pg => {
      try { return (JSON.parse(pg.content) as any[]).map(b => b.text ?? ""); }
      catch { return []; }
    }),
  ]).join(" ");
}

function topSentences(text: string, count: number, minLen = 40): string[] {
  const sentences = text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length >= minLen);
  // Score: longer, early sentences score higher
  const scored = sentences.map((s, i) => ({
    text: s,
    score: s.length * 0.5 + Math.max(0, 100 - i * 3),
  }));
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(s => s.text + ".");
}

function extractKeywords(text: string, title: string, craft: string): {
  primary: string[];
  secondary: string[];
  longTail: string[];
  entities: string[];
} {
  const CRAFT_TERMS = [
    "Pashmina", "Kani", "Sozni", "Carpet", "Papier-Mâché", "Walnut Wood",
    "Copperware", "Silverware", "Namda", "Gabba", "Chain Stitch", "Crewel",
    "Kashmir", "GI", "Authentication", "Handloom", "Artisan", "Heritage",
  ];
  const DOMAIN_TERMS = [
    "Authentication", "GI Protection", "Traceability", "Quality Standard",
    "Policy", "Export", "Market Intelligence", "Preservation", "Sustainability",
    "Documentation", "Certification", "Verification",
  ];
  const ENTITY_TERMS = [
    "KHCRF", "GI Registry", "Changthangi Goat", "Kashmir University",
    "SKUAST", "GI Act 1999", "Pashmina Cluster", "Kanihama",
  ];

  const t = text.toLowerCase();
  const titleWords = title.toLowerCase().split(/\s+/);

  const primary = CRAFT_TERMS.filter(term => t.includes(term.toLowerCase())).slice(0, 6);
  if (craft && !primary.includes(craft)) primary.unshift(craft);

  const secondary = DOMAIN_TERMS.filter(term => t.includes(term.toLowerCase())).slice(0, 6);

  const entities = ENTITY_TERMS.filter(term => t.includes(term.toLowerCase())).slice(0, 5);

  // Long-tail: build from title + primary keyword
  const longTail: string[] = [];
  if (primary[0] && secondary[0]) {
    longTail.push(`How to verify authentic ${primary[0]}`);
    longTail.push(`${primary[0]} ${secondary[0].toLowerCase()} standards India`);
    longTail.push(`Kashmir ${primary[0]} quality certification guide`);
  }

  return { primary, secondary, longTail, entities };
}

function generateCatalogCard(title: string, summary: string, craft: string, domain: string): {
  short: string; standard: string; extended: string;
} {
  const base = summary || `A comprehensive ${craft || "craft"} ${domain?.toLowerCase() || "knowledge"} publication by KHCRF.`;
  const sentences = base.split(/[.]+/).filter(s => s.trim().length > 10);

  const short = `${title.slice(0, 80)} — ${craft} ${domain} reference by KHCRF.`.slice(0, 120);
  const standard = [title, craft && `Covers ${craft} authentication and quality frameworks.`, sentences[0]]
    .filter(Boolean).join(" ").slice(0, 300);
  const extended = [title, base, craft && `Explores ${craft} craft documentation, GI protection, and market intelligence.`]
    .filter(Boolean).join(" ").slice(0, 600);

  return { short, standard, extended };
}

// ─── Category-aware generation ─────────────────────────────────────────────────

function generateForBlueprint(
  blueprint: string,
  title: string,
  text: string,
  craft: string,
  domain: string,
): Partial<IntelligenceContent> {
  const sentences = topSentences(text, 12);
  const kw = extractKeywords(text, title, craft);
  const catalog = generateCatalogCard(title, sentences.slice(0, 3).join(" "), craft, domain);

  const base: Partial<IntelligenceContent> = {
    keywords: [...kw.primary, ...kw.secondary].join(", "),
    primaryKeywords: kw.primary.join(", "),
    secondaryKeywords: kw.secondary.join(", "),
    longTailKeywords: kw.longTail.join("\n"),
    entityKeywords: kw.entities.join(", "),
    catalogShort: catalog.short,
    catalogStandard: catalog.standard,
    catalogExtended: catalog.extended,
    description: catalog.extended,
    topHighlight: sentences[0] || `Introduces a comprehensive ${craft} ${domain?.toLowerCase()} framework for KHCRF practitioners.`,
    bestPracticeHighlights: sentences.slice(0, 5).map(s => `• ${s}`).join("\n"),
  };

  const bp = (blueprint || "").toLowerCase();

  if (bp.includes("best practice") || bp === "") {
    return {
      ...base,
      execSummary: sentences.slice(0, 4).join(" "),
      problemStatement: `The ${craft || "craft"} sector faces significant challenges including lack of standardized ${domain?.toLowerCase() || "documentation"} frameworks, market fraud, and inadequate traceability systems. This publication addresses these gaps.`,
      keyRecommendations: [
        `1. Implement ${craft} authentication protocols at the point of production.`,
        `2. Establish traceability systems linking artisans to end products.`,
        `3. Create institutional frameworks for ${domain?.toLowerCase()} enforcement.`,
        `4. Build capacity among artisans for self-certification.`,
        `5. Integrate digital verification at export checkpoints.`,
      ].join("\n"),
      objectives: `To establish a standardized ${craft} ${domain?.toLowerCase()} framework that strengthens market trust, protects artisan livelihoods, and ensures GI compliance.`,
      expectedOutcomes: `Improved market transparency, reduced fraud, stronger artisan income, and enhanced KHCRF authority as the lead ${craft} knowledge institution.`,
    };
  }

  if (bp.includes("case stud")) {
    return {
      ...base,
      caseBackground: sentences.slice(0, 2).join(" "),
      challenge: `The ${craft || "craft"} sector in Kashmir faces systemic challenges around ${domain?.toLowerCase() || "quality"} that this case study documents in depth.`,
      intervention: sentences.slice(2, 4).join(" "),
      results: sentences.slice(4, 6).join(" "),
      lessonsLearned: `Key lessons for the ${craft} sector: ${sentences.slice(6, 8).join(" ")}`,
      replicability: `This model can be replicated across similar craft clusters in Kashmir and beyond with appropriate institutional support.`,
    };
  }

  if (bp.includes("research")) {
    return {
      ...base,
      abstract: sentences.slice(0, 3).join(" "),
      methodology: `Mixed-methods approach combining field surveys, laboratory testing, and stakeholder interviews across ${craft || "craft"} production clusters.`,
      keyFindings: sentences.slice(3, 7).map((s, i) => `Finding ${i + 1}: ${s}`).join("\n"),
      conclusions: sentences.slice(7, 9).join(" "),
    };
  }

  if (bp.includes("policy")) {
    return {
      ...base,
      policySum: sentences.slice(0, 3).join(" "),
      urgencyStatement: `Immediate policy intervention is required to address ${domain?.toLowerCase() || "quality"} gaps in the ${craft || "craft"} sector before irreversible market damage occurs.`,
      evidenceSnapshot: sentences.slice(3, 6).join(" "),
      policyRecommendations: [
        `• Mandate ${craft} authentication at point of export`,
        `• Establish a dedicated GI enforcement authority`,
        `• Fund artisan capacity building programs`,
        `• Implement digital traceability across supply chain`,
      ].join("\n"),
      expectedOutcomes: `Strengthened regulatory framework, improved market access, and increased artisan revenue within 24 months of implementation.`,
    };
  }

  if (bp.includes("market")) {
    return {
      ...base,
      marketSummary: sentences.slice(0, 3).join(" "),
      exportTrends: `${craft || "Craft"} exports have shown consistent growth in EU, North America, and Japan markets with increasing premium demand.`,
      priceSignals: `Premium authentic ${craft} commands 3-5x price over counterfeit products; quality certification drives price discovery.`,
      marketRisks: `Counterfeiting, synthetic substitutes, and lack of traceability remain primary market risks for ${craft} exports.`,
      opportunities: `E-commerce, luxury retail, and heritage tourism represent emerging channels for authenticated ${craft} products.`,
      forecasts: `Market intelligence indicates 15-20% CAGR for authenticated ${craft} products over next 5 years given current demand trends.`,
    };
  }

  if (bp.includes("e-pub") || bp.includes("ebook") || bp.includes("book")) {
    return {
      ...base,
      bookOverview: sentences.slice(0, 3).join(" "),
      learningObjectives: [
        `• Understand ${craft} authentication frameworks`,
        `• Apply ${domain?.toLowerCase() || "best practice"} standards in practice`,
        `• Navigate GI compliance requirements`,
        `• Build institutional capacity for quality management`,
      ].join("\n"),
      audienceBenefits: `Practitioners will gain actionable frameworks, decision trees, and case references to implement ${craft} quality management independently.`,
      keyTopics: [...kw.primary, ...kw.secondary].slice(0, 8).join(", "),
    };
  }

  return base;
}

// ─── Quality Scorer ───────────────────────────────────────────────────────────

interface QualityScore {
  execSummary: number;
  keywords: number;
  recommendations: number;
  catalog: number;
  highlights: number;
  overall: number;
}

function scoreContent(content: Partial<IntelligenceContent>, blueprint: string): QualityScore {
  const len = (s?: string) => (s || "").trim().length;
  const count = (s?: string) => (s || "").split(",").filter(Boolean).length;

  const execSummary = Math.min(100, Math.round(len(content.execSummary || content.abstract || content.policySum || content.marketSummary || content.caseBackground) / 8));
  const keywords = Math.min(100, count(content.keywords) * 12 + count(content.primaryKeywords) * 8);
  const recommendations = Math.min(100, len(content.keyRecommendations || content.policyRecommendations || content.lessonsLearned || content.keyFindings) > 100 ? 90 : 40);
  const catalog = Math.min(100,
    (len(content.catalogShort) > 10 ? 35 : 0) +
    (len(content.catalogStandard) > 50 ? 35 : 0) +
    (len(content.catalogExtended) > 100 ? 30 : 0)
  );
  const highlights = Math.min(100, len(content.bestPracticeHighlights || content.topHighlight) > 50 ? 88 : 30);
  const overall = Math.round((execSummary + keywords + recommendations + catalog + highlights) / 5);

  return { execSummary, keywords, recommendations, catalog, highlights, overall };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreBar({ label, score, color = "teal" }: { label: string; score: number; color?: string }) {
  const barClass = {
    teal: "bg-teal-500", blue: "bg-blue-500", amber: "bg-amber-500",
    purple: "bg-purple-500", emerald: "bg-emerald-500",
  }[color] ?? "bg-teal-500";
  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] text-stone-500 w-28 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
        <motion.div className={`h-full ${barClass} rounded-full`}
          initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.5 }} />
      </div>
      <span className={`text-[9px] font-black w-8 text-right ${score >= 80 ? "text-emerald-600" : score >= 50 ? "text-amber-600" : "text-red-500"}`}>
        {score}%
      </span>
    </div>
  );
}

function GenButton({ label, loading, onClick, small = false }: {
  label: string; loading: boolean; onClick: () => void; small?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} disabled={loading}
      className={`flex items-center gap-1.5 ${small ? "px-2.5 py-1 text-[9px]" : "px-3 py-1.5 text-[10px]"} bg-purple-50 border border-purple-200 text-purple-700 font-black rounded-xl hover:bg-purple-100 transition-all disabled:opacity-40`}>
      {loading ? <FaSpinner size={small ? 8 : 9} className="animate-spin" /> : <FaMagic size={small ? 8 : 9} />}
      {label}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function IntelligenceContentEngine({
  publicationTitle = "",
  publicationBlueprint = "",
  craftSector = "",
  domain = "",
  existingKeywords = "",
  chapters = [],
  onApply,
  currentContent = {},
}: IntelligenceEngineProps) {
  const [generating, setGenerating] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [generated, setGenerated] = useState<Partial<IntelligenceContent>>({});
  const [catalogMode, setCatalogMode] = useState<"short" | "standard" | "extended">("standard");
  const [kwExpanded, setKwExpanded] = useState(false);

  const merged = { ...currentContent, ...generated };
  const quality = scoreContent(merged, publicationBlueprint);
  const hasChapters = chapters.length > 0;

  // ── Generate all from manuscript ────────────────────────────────────────────

  const handleGenerateAll = useCallback(async () => {
    if (!hasChapters && !publicationTitle) {
      toast.error("Add a title and build some manuscript chapters first");
      return;
    }
    setGenerating(true);
    await new Promise(r => setTimeout(r, 900));
    const text = extractChapterText(chapters) + " " + publicationTitle;
    const result = generateForBlueprint(publicationBlueprint, publicationTitle, text, craftSector, domain);
    setGenerated(result);
    setGenerating(false);
    toast.success(`Generated ${Object.keys(result).length} intelligence fields from manuscript`);
  }, [chapters, publicationTitle, publicationBlueprint, craftSector, domain]);

  // ── Generate single field ────────────────────────────────────────────────────

  const generateField = useCallback(async (field: string) => {
    setActiveField(field);
    await new Promise(r => setTimeout(r, 500));
    const text = extractChapterText(chapters) + " " + publicationTitle;
    const all = generateForBlueprint(publicationBlueprint, publicationTitle, text, craftSector, domain);
    if ((all as any)[field]) {
      setGenerated(prev => ({ ...prev, [field]: (all as any)[field] }));
      toast.success(`Generated: ${field}`);
    }
    setActiveField(null);
  }, [chapters, publicationTitle, publicationBlueprint, craftSector, domain]);

  // ── Generate keyword intelligence ─────────────────────────────────────────

  const generateKeywords = useCallback(async () => {
    setActiveField("keywords");
    await new Promise(r => setTimeout(r, 400));
    const text = extractChapterText(chapters) + " " + publicationTitle + " " + existingKeywords;
    const kw = extractKeywords(text, publicationTitle, craftSector);
    setGenerated(prev => ({
      ...prev,
      keywords: [...kw.primary, ...kw.secondary].join(", "),
      primaryKeywords: kw.primary.join(", "),
      secondaryKeywords: kw.secondary.join(", "),
      longTailKeywords: kw.longTail.join("\n"),
      entityKeywords: kw.entities.join(", "),
    }));
    setActiveField(null);
    toast.success("Keyword intelligence generated");
  }, [chapters, publicationTitle, craftSector, existingKeywords]);

  // ── Generate catalog card ────────────────────────────────────────────────────

  const generateCatalog = useCallback(async () => {
    setActiveField("catalog");
    await new Promise(r => setTimeout(r, 300));
    const text = extractChapterText(chapters);
    const sentences = topSentences(text + " " + publicationTitle, 5);
    const card = generateCatalogCard(publicationTitle, sentences.join(" "), craftSector, domain);
    setGenerated(prev => ({
      ...prev,
      catalogShort: card.short,
      catalogStandard: card.standard,
      catalogExtended: card.extended,
      description: card.extended,
    }));
    setActiveField(null);
    toast.success("Catalog card generated");
  }, [chapters, publicationTitle, craftSector, domain]);

  // ── Apply to form ───────────────────────────────────────────────────────────

  const handleApply = () => {
    onApply(generated);
    toast.success(`✓ ${Object.keys(generated).filter(k => (generated as any)[k]).length} intelligence fields applied`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text).then(() => toast.success("Copied!"));
  };

  // ── Preview card ─────────────────────────────────────────────────────────────

  const PreviewPanel = () => (
    <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-2xl p-5 text-white space-y-3">
      <p className="text-[9px] font-black uppercase tracking-widest text-stone-400">Public Page Preview</p>
      {publicationTitle && (
        <div>
          <p className="text-xs font-black text-white leading-tight">{publicationTitle}</p>
          {craftSector && <p className="text-[9px] text-teal-400 mt-0.5">{craftSector} · {domain}</p>}
        </div>
      )}
      {(merged.topHighlight || merged.execSummary) && (
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-[9px] font-black text-stone-400 uppercase mb-1">Top Highlight</p>
          <p className="text-[10px] text-white leading-relaxed line-clamp-3">
            {merged.topHighlight || merged.execSummary?.slice(0, 200)}
          </p>
        </div>
      )}
      {merged.bestPracticeHighlights && (
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-[9px] font-black text-stone-400 uppercase mb-1">Highlights</p>
          {merged.bestPracticeHighlights.split("\n").slice(0, 4).map((h, i) => (
            <p key={i} className="text-[9px] text-stone-300 leading-relaxed mb-1">{h}</p>
          ))}
        </div>
      )}
      {merged.primaryKeywords && (
        <div>
          <p className="text-[9px] font-black text-stone-400 uppercase mb-1.5">Keywords</p>
          <div className="flex flex-wrap gap-1">
            {(merged.primaryKeywords || "").split(",").map(k => (
              <span key={k} className="bg-teal-500/30 text-teal-200 px-2 py-0.5 rounded-full text-[8px] font-bold">{k.trim()}</span>
            ))}
          </div>
        </div>
      )}
      {merged.catalogStandard && (
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-[9px] font-black text-stone-400 uppercase mb-1">Catalog Card</p>
          <p className="text-[9px] text-stone-300 leading-relaxed">{merged.catalogStandard}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* ── Action Bar ── */}
      <div className="flex items-center gap-2 flex-wrap p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl">
        <div className="flex-1">
          <p className="text-[10px] font-black text-purple-800">Intelligence Content Engine</p>
          <p className="text-[9px] text-purple-600 mt-0.5">
            {hasChapters ? `${chapters.length} chapters available for generation` : "No manuscript yet — add chapters for AI generation"}
          </p>
        </div>
        <button type="button" onClick={handleGenerateAll} disabled={generating}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[10px] font-black rounded-xl hover:opacity-90 disabled:opacity-40 shadow-md shadow-purple-500/20 transition-all">
          {generating ? <FaSpinner size={11} className="animate-spin" /> : <FaBolt size={11} />}
          Generate All From Manuscript
        </button>
        <button type="button" onClick={() => setShowPreview(p => !p)}
          className={`flex items-center gap-1.5 px-3 py-2 text-[10px] font-black rounded-xl border transition-all ${
            showPreview ? "bg-stone-800 text-white border-stone-800" : "bg-white border-stone-200 text-stone-600 hover:border-stone-400"
          }`}>
          <FaEye size={10} /> {showPreview ? "Hide" : "Preview"}
        </button>
      </div>

      <div className={`grid gap-5 ${showPreview ? "grid-cols-3" : "grid-cols-1"}`}>
        {/* ── LEFT: Generated fields ── */}
        <div className={`${showPreview ? "col-span-2" : ""} space-y-4`}>

          {/* Quality Score */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest">Intelligence Quality Score</p>
              <div className={`text-sm font-black px-3 py-1 rounded-xl ${
                quality.overall >= 80 ? "bg-emerald-100 text-emerald-700" :
                quality.overall >= 50 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
              }`}>{quality.overall}/100</div>
            </div>
            <div className="space-y-2">
              <ScoreBar label="Executive Summary" score={quality.execSummary} color="teal" />
              <ScoreBar label="Keywords" score={quality.keywords} color="blue" />
              <ScoreBar label="Recommendations" score={quality.recommendations} color="purple" />
              <ScoreBar label="Catalog Card" score={quality.catalog} color="amber" />
              <ScoreBar label="Highlights" score={quality.highlights} color="emerald" />
            </div>
            {Object.keys(generated).length > 0 && (
              <button type="button" onClick={handleApply}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2 bg-purple-500 text-white text-[10px] font-black rounded-xl hover:bg-purple-600 transition-all">
                <FaCheck size={9} /> Apply {Object.keys(generated).filter(k => (generated as any)[k]).length} Fields to Form
              </button>
            )}
          </div>

          {/* Keyword Intelligence */}
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-stone-50 border-b border-stone-200">
              <p className="text-[10px] font-black text-stone-700">Keyword Intelligence</p>
              <div className="flex gap-2">
                <GenButton label="Generate Keywords" loading={activeField === "keywords"} onClick={generateKeywords} small />
                <button type="button" onClick={() => setKwExpanded(p => !p)}
                  className="text-stone-400 hover:text-stone-700 p-1">
                  {kwExpanded ? <FaArrowDown size={9} /> : <FaArrowDown size={9} className="rotate-180" />}
                </button>
              </div>
            </div>
            <AnimatePresence>
              {kwExpanded && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                  className="overflow-hidden">
                  <div className="p-4 space-y-3">
                    {[
                      { label: "Primary Keywords", field: "primaryKeywords", color: "teal" },
                      { label: "Secondary Keywords", field: "secondaryKeywords", color: "blue" },
                      { label: "Long-Tail Keywords", field: "longTailKeywords", color: "purple" },
                      { label: "Entity Keywords", field: "entityKeywords", color: "amber" },
                    ].map(({ label, field, color }) => (
                      <div key={field}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-black text-stone-500 uppercase tracking-wider">{label}</span>
                          {(merged as any)[field] && (
                            <button type="button" onClick={() => copyToClipboard((merged as any)[field])}
                              className="text-stone-400 hover:text-stone-700"><FaCopy size={8} /></button>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {((merged as any)[field] || "").split(/[,\n]/).filter(Boolean).map((kw: string) => (
                            <span key={kw} className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              color === "teal" ? "bg-teal-50 text-teal-700 border border-teal-200" :
                              color === "blue" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                              color === "purple" ? "bg-purple-50 text-purple-700 border border-purple-200" :
                              "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}>{kw.trim()}</span>
                          ))}
                          {!(merged as any)[field] && <span className="text-[9px] text-stone-300 italic">— not generated yet</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {!kwExpanded && (
              <div className="px-4 py-3 flex flex-wrap gap-1">
                {(merged.keywords || "").split(",").filter(Boolean).slice(0, 8).map(k => (
                  <span key={k} className="bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full text-[9px] font-bold">{k.trim()}</span>
                ))}
                {!merged.keywords && <span className="text-[9px] text-stone-300 italic">Click Generate Keywords</span>}
                <button type="button" onClick={() => setKwExpanded(true)} className="text-[9px] text-purple-500 font-bold ml-1">Expand →</button>
              </div>
            )}
          </div>

          {/* Catalog Card */}
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-stone-50 border-b border-stone-200">
              <p className="text-[10px] font-black text-stone-700">Catalog Card Generator</p>
              <GenButton label="Generate Card" loading={activeField === "catalog"} onClick={generateCatalog} small />
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-1 mb-2">
                {(["short", "standard", "extended"] as const).map(mode => (
                  <button key={mode} type="button" onClick={() => setCatalogMode(mode)}
                    className={`flex-1 py-1 text-[9px] font-black rounded-lg transition-all ${
                      catalogMode === mode ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}>
                    {mode.charAt(0).toUpperCase() + mode.slice(1)} {mode === "short" ? "(120)" : mode === "standard" ? "(300)" : "(600)"}
                  </button>
                ))}
              </div>
              <div className="relative">
                <p className="text-[10px] text-gray-700 leading-relaxed min-h-[40px]">
                  {(merged as any)[`catalog${catalogMode.charAt(0).toUpperCase() + catalogMode.slice(1)}`] ||
                    <span className="text-stone-300 italic">Click Generate Card above</span>}
                </p>
                {(merged as any)[`catalog${catalogMode.charAt(0).toUpperCase() + catalogMode.slice(1)}`] && (
                  <button type="button" onClick={() => copyToClipboard((merged as any)[`catalog${catalogMode.charAt(0).toUpperCase() + catalogMode.slice(1)}`])}
                    className="absolute top-0 right-0 text-stone-400 hover:text-stone-700"><FaCopy size={10} /></button>
                )}
              </div>
              <div className="text-[8px] text-stone-400 text-right">
                {((merged as any)[`catalog${catalogMode.charAt(0).toUpperCase() + catalogMode.slice(1)}`] || "").length} chars
              </div>
            </div>
          </div>

          {/* Top Highlight */}
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-stone-50 border-b border-stone-200">
              <p className="text-[10px] font-black text-stone-700">Top Highlight</p>
              <GenButton label="Generate" loading={activeField === "topHighlight"} onClick={() => generateField("topHighlight")} small />
            </div>
            <div className="p-4">
              {merged.topHighlight
                ? <p className="text-[10px] text-gray-700 leading-relaxed italic">&ldquo;{merged.topHighlight}&rdquo;</p>
                : <p className="text-[9px] text-stone-300 italic">Click Generate above</p>}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Preview ── */}
        {showPreview && (
          <div className="col-span-1">
            <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest mb-3">Live Preview</p>
            <PreviewPanel />
          </div>
        )}
      </div>
    </div>
  );
}
