"use client";

/**
 * CraftAuthorityEngine
 * ─────────────────────────────────────────────────────────────────────────────
 * Inline + modal panel for the Authority Mapping & Cover/Branding section.
 * Features:
 *   • Auto-detect crafts from manuscript chapters (client-side keyword scoring)
 *   • Multi-level authority (Primary / Secondary / Referenced / Mentioned)
 *   • Controlled KHCRF craft taxonomy
 *   • Domain authority mapping
 *   • Authority score (0–100)
 *   • Discovery Impact Preview
 *   • Cover template & branding theme selectors
 *   • Series badge directory
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMagic, FaSpinner, FaCheck, FaTag, FaLayerGroup,
  FaChartBar, FaSearch, FaStar, FaArrowRight,
  FaTimes, FaPlus, FaTrash, FaGlobe,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

// ─── Taxonomies ───────────────────────────────────────────────────────────────

export const CRAFT_TAXONOMY = [
  "Pashmina", "Kani Weave", "Sozni Embroidery", "Carpet Weaving",
  "Papier-Mâché", "Walnut Wood Carving", "Copperware", "Silverware",
  "Namda Felting", "Gabba Craft", "Chain Stitch Rugs", "Crewel Embroidery",
  "Willow Wicker", "Silk Weaving", "Multi-Craft",
];

export const DOMAIN_AUTHORITY = [
  "Authentication", "GI Protection", "Documentation", "Preservation",
  "Trade & Commerce", "Exports & Markets", "Market Intelligence",
  "Policy & Governance", "Sustainability", "Innovation & Technology",
  "Education & Training", "Heritage Conservation", "Artisan Welfare",
];

export const AUTHORITY_LEVELS = ["Primary Authority", "Secondary Authority", "Referenced", "Mentioned"] as const;
export type AuthorityLevel = typeof AUTHORITY_LEVELS[number];

export const COVER_TEMPLATES = [
  "Scholarly Monograph", "Research Report", "Case Study Report",
  "Policy Brief", "Market Intelligence", "Reference Manual",
  "Educational Book", "Heritage Edition",
];

export const BRANDING_THEMES = [
  "Warm Heritage", "Scholarly Blue", "Craft Heritage", "Policy Gold",
  "Research Gray", "Market Intelligence", "Minimal White", "KHCRF Standard",
];

export const SERIES_BADGES = [
  "KHCRF Reference Library", "KHCRF Research Series", "KHCRF Best Practices",
  "KHCRF Case Study Series", "KHCRF Policy Series", "KHCRF Market Intelligence",
  "KHCRF Educational Series", "KHCRF Heritage Documentation",
];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CraftAuthorityItem {
  craft: string;
  level: AuthorityLevel;
  confidence?: number;
}

export interface AuthorityData {
  craftAuthority?: CraftAuthorityItem[];
  domainAuthority?: string[];
  coverTemplate?: string;
  brandingTheme?: string;
  seriesBadge?: string;
  // Legacy flat fields for formData
  linkedCrafts?: string;
  multipleCrafts?: string;
}

export interface CraftAuthorityEngineProps {
  chapters?: Array<{ title: string; pages?: Array<{ content: string }> }>;
  publicationTitle?: string;
  craftSector?: string;
  domain?: string;
  onApply: (data: AuthorityData) => void;
  currentData?: Partial<AuthorityData>;
}

// ─── Keyword scoring ──────────────────────────────────────────────────────────

const CRAFT_KEYWORDS: Record<string, string[]> = {
  "Pashmina": ["pashmina", "pashm", "cashmere", "shahtoosh", "hand-spun", "shawl", "changthangi"],
  "Kani Weave": ["kani", "twill tapestry", "woven pattern", "loom design"],
  "Sozni Embroidery": ["sozni", "needlework", "hand embroidery", "chain stitch"],
  "Carpet Weaving": ["carpet", "rug", "pile weaving", "hand-knotted", "gabba"],
  "Papier-Mâché": ["papier", "paper mache", "lacquerwork", "mache"],
  "Walnut Wood Carving": ["walnut", "wood carving", "carved furniture"],
  "Copperware": ["copper", "copperware", "metal craft", "tinning"],
  "Silverware": ["silver", "silverware", "filigree"],
  "Namda Felting": ["namda", "felt", "felting", "namdah"],
  "Gabba Craft": ["gabba", "recycled carpet"],
  "Chain Stitch Rugs": ["chain stitch", "crewel", "aari"],
};

function autoDetectCrafts(
  chapters: Array<{ title: string; pages?: Array<{ content: string }> }>,
  title: string,
): CraftAuthorityItem[] {
  const text = [
    title,
    ...chapters.flatMap(ch => [
      ch.title,
      ...(ch.pages ?? []).flatMap(pg => {
        try { return (JSON.parse(pg.content) as any[]).map(b => b.text ?? ""); }
        catch { return []; }
      }),
    ]),
  ].join(" ").toLowerCase();

  const scores: { craft: string; score: number }[] = [];
  for (const [craft, keywords] of Object.entries(CRAFT_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      const matches = (text.match(new RegExp(kw, "gi")) || []).length;
      score += matches * (kw.length > 5 ? 2 : 1);
    }
    if (score > 0) scores.push({ craft, score });
  }

  const max = Math.max(...scores.map(s => s.score), 1);
  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((s, i) => ({
      craft: s.craft,
      level: i === 0 ? "Primary Authority" : i <= 2 ? "Secondary Authority" : "Referenced",
      confidence: Math.min(99, Math.round(55 + (s.score / max) * 44)),
    }));
}

function computeAuthorityScore(items: CraftAuthorityItem[], domains: string[]): number {
  let score = 0;
  if (items.some(i => i.level === "Primary Authority")) score += 35;
  if (items.some(i => i.level === "Secondary Authority")) score += 20;
  if (items.length >= 3) score += 15;
  if (domains.length >= 2) score += 20;
  if (domains.length >= 4) score += 10;
  return Math.min(100, score);
}

// ─── Confidence Bar ───────────────────────────────────────────────────────────

function ConfBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex-1 h-1 bg-stone-100 rounded-full overflow-hidden">
        <motion.div className="h-full bg-amber-500 rounded-full"
          initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.5 }} />
      </div>
      <span className="text-[8px] font-black text-stone-400 w-7 text-right">{value}%</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CraftAuthorityEngine({
  chapters = [], publicationTitle = "", craftSector = "", domain = "",
  onApply, currentData = {},
}: CraftAuthorityEngineProps) {
  const [detecting, setDetecting] = useState(false);
  const [craftItems, setCraftItems] = useState<CraftAuthorityItem[]>(
    currentData.craftAuthority ?? (craftSector ? [{ craft: craftSector, level: "Primary Authority" }] : [])
  );
  const [selectedDomains, setSelectedDomains] = useState<string[]>(
    currentData.domainAuthority ?? (domain ? [domain] : [])
  );
  const [coverTemplate, setCoverTemplate] = useState(currentData.coverTemplate ?? "Scholarly Monograph");
  const [brandingTheme, setBrandingTheme] = useState(currentData.brandingTheme ?? "Warm Heritage");
  const [seriesBadge, setSeriesBadge] = useState(currentData.seriesBadge ?? "KHCRF Reference Library");
  const [suggestions, setSuggestions] = useState<CraftAuthorityItem[]>([]);
  const [showDetected, setShowDetected] = useState(false);

  const authorityScore = computeAuthorityScore(craftItems, selectedDomains);

  const handleAutoDetect = useCallback(async () => {
    if (!chapters.length && !publicationTitle) {
      toast.error("Add manuscript chapters or a title first");
      return;
    }
    setDetecting(true);
    await new Promise(r => setTimeout(r, 700));
    const detected = autoDetectCrafts(chapters, publicationTitle);
    setSuggestions(detected);
    setShowDetected(true);
    setDetecting(false);
    if (!detected.length) toast.error("No craft keywords found in manuscript");
    else toast.success(`Detected ${detected.length} craft${detected.length !== 1 ? "s" : ""} with authority levels`);
  }, [chapters, publicationTitle]);

  const applySuggestion = (item: CraftAuthorityItem) => {
    if (craftItems.some(c => c.craft === item.craft)) { toast("Already added"); return; }
    setCraftItems(prev => [...prev, item]);
    toast.success(`Added: ${item.craft} — ${item.level}`);
  };

  const toggleDomain = (d: string) => {
    setSelectedDomains(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  const removeCraft = (craft: string) => setCraftItems(prev => prev.filter(c => c.craft !== craft));

  const addManualCraft = (craft: string) => {
    if (!craft || craftItems.some(c => c.craft === craft)) return;
    setCraftItems(prev => [
      ...prev,
      { craft, level: prev.length === 0 ? "Primary Authority" : "Secondary Authority" },
    ]);
  };

  const handleApply = () => {
    if (!craftItems.length) { toast.error("Select at least one craft"); return; }
    const data: AuthorityData = {
      craftAuthority: craftItems,
      domainAuthority: selectedDomains,
      coverTemplate,
      brandingTheme,
      seriesBadge,
      linkedCrafts: craftItems.map(c => c.craft).join(", "),
      multipleCrafts: craftItems.filter(c => c.level !== "Primary Authority").map(c => c.craft).join(", "),
    };
    onApply(data);
    toast.success(`Authority mapping applied — Score: ${authorityScore}/100`);
  };

  const LEVEL_COLORS: Record<AuthorityLevel, string> = {
    "Primary Authority": "bg-amber-500 text-white border-amber-500",
    "Secondary Authority": "bg-blue-500 text-white border-blue-500",
    "Referenced": "bg-stone-200 text-stone-700 border-stone-300",
    "Mentioned": "bg-stone-100 text-stone-500 border-stone-200",
  };

  return (
    <div className="space-y-5">
      {/* ── Action Bar ── */}
      <div className="flex items-center gap-2 flex-wrap p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl">
        <div className="flex-1">
          <p className="text-[10px] font-black text-amber-800">Craft Authority Intelligence Engine</p>
          <p className="text-[9px] text-amber-600 mt-0.5">
            Authority Score: <span className="font-black">{authorityScore}/100</span> · {craftItems.length} craft{craftItems.length !== 1 ? "s" : ""} mapped
          </p>
        </div>
        <button type="button" onClick={handleAutoDetect} disabled={detecting}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[10px] font-black rounded-xl hover:opacity-90 disabled:opacity-40 shadow-md shadow-amber-500/20">
          {detecting ? <FaSpinner size={10} className="animate-spin" /> : <FaMagic size={10} />}
          Detect Crafts From Manuscript
        </button>
        <button type="button" onClick={handleApply}
          className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-white text-[10px] font-black rounded-xl hover:bg-stone-900 transition-all">
          <FaCheck size={9} /> Apply Authority Map
        </button>
      </div>

      {/* Auto-detected suggestions */}
      <AnimatePresence>
        {showDetected && suggestions.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[9px] font-black text-amber-700 uppercase tracking-widest">Detected Crafts — Click to Add</p>
              <button type="button" onClick={() => setShowDetected(false)} className="text-amber-400 hover:text-amber-700"><FaTimes size={10} /></button>
            </div>
            {suggestions.map(item => (
              <div key={item.craft} className="flex items-center gap-3">
                <button type="button" onClick={() => applySuggestion(item)}
                  disabled={craftItems.some(c => c.craft === item.craft)}
                  className={`shrink-0 px-2.5 py-1 rounded-lg text-[9px] font-black border transition-all ${
                    craftItems.some(c => c.craft === item.craft)
                      ? "opacity-40 bg-stone-100 text-stone-400 border-stone-200"
                      : "bg-white border-amber-300 text-amber-700 hover:bg-amber-100"
                  }`}>
                  {craftItems.some(c => c.craft === item.craft) ? <FaCheck className="inline mr-1" size={8} /> : <FaPlus className="inline mr-1" size={8} />}
                  {item.craft}
                </button>
                <div className="flex-1"><ConfBar value={item.confidence ?? 0} /></div>
                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${
                  item.level === "Primary Authority" ? "bg-amber-100 text-amber-700 border-amber-300" :
                  item.level === "Secondary Authority" ? "bg-blue-100 text-blue-700 border-blue-300" :
                  "bg-stone-100 text-stone-600 border-stone-200"
                }`}>{item.level}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-4">
        {/* LEFT: Craft authority items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-stone-600 uppercase tracking-wider">Craft Authority Mapping</p>
          </div>

          {/* Manual picker */}
          <div>
            <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-2">Primary Crafts</p>
            <div className="flex flex-wrap gap-1.5">
              {CRAFT_TAXONOMY.map(craft => {
                const existing = craftItems.find(c => c.craft === craft);
                return (
                  <button key={craft} type="button"
                    onClick={() => existing ? removeCraft(craft) : addManualCraft(craft)}
                    className={`px-2.5 py-1 rounded-full border text-[9px] font-bold transition-all ${
                      existing
                        ? LEVEL_COLORS[existing.level]
                        : "bg-stone-50 text-stone-600 border-stone-200 hover:border-amber-300 hover:bg-amber-50"
                    }`}>
                    {existing && <FaCheck className="inline mr-1" size={7} />}
                    {craft}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current craft items with level control */}
          {craftItems.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Authority Levels</p>
              {craftItems.map(item => (
                <div key={item.craft} className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-gray-800 flex-1">{item.craft}</span>
                  <select
                    value={item.level}
                    onChange={e => setCraftItems(prev => prev.map(c => c.craft === item.craft ? { ...c, level: e.target.value as AuthorityLevel } : c))}
                    className="flex-1 px-2 py-1 text-[9px] border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400">
                    {AUTHORITY_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <button type="button" onClick={() => removeCraft(item.craft)} className="text-stone-400 hover:text-red-500 p-1">
                    <FaTrash size={9} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Domain authority + Discovery Impact + Cover/Brand */}
        <div className="space-y-4">
          {/* Domain Authority */}
          <div>
            <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-2">Domain Authority</p>
            <div className="flex flex-wrap gap-1.5">
              {DOMAIN_AUTHORITY.map(d => (
                <button key={d} type="button" onClick={() => toggleDomain(d)}
                  className={`px-2.5 py-1 rounded-full border text-[9px] font-bold transition-all ${
                    selectedDomains.includes(d)
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-stone-50 text-stone-600 border-stone-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}>
                  {selectedDomains.includes(d) && <FaCheck className="inline mr-1" size={7} />}{d}
                </button>
              ))}
            </div>
          </div>

          {/* Authority Score */}
          <div className="bg-stone-900 rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-stone-400">Authority Footprint</p>
              <span className={`text-sm font-black ${
                authorityScore >= 80 ? "text-emerald-400" : authorityScore >= 50 ? "text-amber-400" : "text-red-400"
              }`}>{authorityScore}/100</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
              <motion.div className={`h-full rounded-full ${
                authorityScore >= 80 ? "bg-emerald-400" : authorityScore >= 50 ? "bg-amber-400" : "bg-red-400"
              }`} initial={{ width: 0 }} animate={{ width: `${authorityScore}%` }} transition={{ duration: 0.8 }} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-[9px]">
              {[
                { label: "Primary Craft", value: craftItems.find(c => c.level === "Primary Authority")?.craft || "—" },
                { label: "Secondary", value: craftItems.filter(c => c.level === "Secondary Authority").map(c => c.craft).join(", ") || "—" },
                { label: "Domains", value: selectedDomains.slice(0, 2).join(", ") || "—" },
                { label: "Coverage", value: authorityScore >= 80 ? "Excellent" : authorityScore >= 50 ? "Good" : "Needs Work" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/10 rounded-lg p-2">
                  <p className="text-stone-400 text-[8px]">{label}</p>
                  <p className="font-bold truncate">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cover & Branding */}
          <div className="space-y-3">
            <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Cover & Branding</p>
            <div>
              <label className="text-[8px] font-black text-stone-500 uppercase block mb-1">Cover Template</label>
              <select value={coverTemplate} onChange={e => setCoverTemplate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400">
                {COVER_TEMPLATES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[8px] font-black text-stone-500 uppercase block mb-1">Branding Theme</label>
              <div className="flex flex-wrap gap-1">
                {BRANDING_THEMES.map(t => (
                  <button key={t} type="button" onClick={() => setBrandingTheme(t)}
                    className={`px-2 py-0.5 rounded-lg text-[8px] font-bold border transition-all ${
                      brandingTheme === t ? "bg-stone-800 text-white border-stone-800" : "bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400"
                    }`}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[8px] font-black text-stone-500 uppercase block mb-1">Series Badge</label>
              <select value={seriesBadge} onChange={e => setSeriesBadge(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400">
                {SERIES_BADGES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
