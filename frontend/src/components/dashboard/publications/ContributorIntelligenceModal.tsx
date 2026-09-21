"use client";

/**
 * ContributorIntelligenceModal
 * ─────────────────────────────────────────────────────────────────────────────
 * Tabs:
 *   1. Bulk Upload  — CSV / JSON / YAML / DOCX / PDF / BibTeX / RIS
 *   2. Auto-Extract — scans chapter / manuscript text for author signals
 *   3. Directory    — search localStorage contributor registry, pick & reuse
 *   4. Authority    — live authority map + publication readiness validation
 *
 * Storage: localStorage `hcrf_contributor_registry` (JSON array)
 *          Replaces the need for backend until full registry API is built.
 *
 * All parsing is 100% client-side.
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes, FaUpload, FaCheck, FaSpinner, FaMagic, FaFileUpload,
  FaSearch, FaUserPlus, FaUsers, FaBuilding, FaRobot,
  FaFileCode, FaFileCsv, FaFilePdf, FaFileWord, FaFileAlt,
  FaDownload, FaEye, FaCheckCircle, FaTimesCircle, FaExclamationTriangle,
  FaArrowRight, FaLink, FaCopy, FaLayerGroup, FaTrash, FaEdit,
  FaProjectDiagram, FaGraduationCap, FaFlask, FaGavel, FaIndustry,
  FaStar, FaPlus, FaChevronDown, FaChevronUp,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import Papa from "papaparse";
import { validateContributorsSchema, normalizeContributorRole, isGarbageOrHeading } from "@/utils/schemaValidator";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ContributorRole =
  | "Lead Author" | "Co-Author" | "Corresponding Author" | "Contributing Author"
  | "Academic Institution" | "Research Team" | "Research Laboratory" | "Research Center"
  | "Technical Editor" | "Managing Editor" | "Language Editor" | "Peer Reviewer" | "Review Committee"
  | "Master Artisan" | "Artisan Contributor" | "Cluster Coordinator" | "Field Researcher" | "Documentation Team" | "Field Contributor"
  | "Policy Advisor" | "GI Specialist" | "Legal Advisor" | "Government Liaison" | "Legislative Researcher" | "Legislative Contributor"
  | "Exporter" | "Trade Association" | "Craft Guild" | "Industry Body" | "Certification Agency" | "Market Expert" | "Industry & Guild Contributor";

export interface Contributor {
  id: string;
  role: ContributorRole;
  name: string;
  title?: string;
  institution?: string;
  email?: string;
  orcid?: string;
  researchAreas?: string;
  craftDomains?: string;
  publications?: number;
  verified?: boolean;
  addedAt?: string;
  source?: string;
}

// What the form expects — a structured contributors object
export interface ContributorsData {
  author?: string;
  coAuthor?: string;
  institution?: string;
  researchTeam?: string;
  technicalEditor?: string;
  reviewer?: string;
  fieldContributor?: string;
  legislativeContributor?: string;
  industryContributor?: string;
  // Extended authority fields
  correspondingAuthor?: string;
  reviewCommittee?: string;
  masterArtisan?: string;
  policyAdvisor?: string;
  // Raw JSON for structured storage
  contributorsJson?: string;
}

interface ContributorIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: ContributorsData, contributors: Contributor[]) => void;
  existingContributors?: Contributor[];
  existingChapters?: Array<{ title: string; pages?: Array<{ content: string }> }>;
  publicationTitle?: string;
}

// ─── Contributor Role Taxonomy ────────────────────────────────────────────────

const ROLE_GROUPS = [
  {
    label: "Primary Authorship",
    icon: FaGraduationCap,
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-200",
    roles: ["Lead Author", "Co-Author", "Corresponding Author", "Contributing Author"] as ContributorRole[],
  },
  {
    label: "Academic & Research",
    icon: FaFlask,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    roles: ["Academic Institution", "Research Team", "Research Laboratory", "Research Center"] as ContributorRole[],
  },
  {
    label: "Editorial & Review",
    icon: FaEdit,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    roles: ["Technical Editor", "Managing Editor", "Language Editor", "Peer Reviewer", "Review Committee"] as ContributorRole[],
  },
  {
    label: "Field Contributors",
    icon: FaUsers,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    roles: ["Master Artisan", "Artisan Contributor", "Cluster Coordinator", "Field Researcher", "Documentation Team", "Field Contributor"] as ContributorRole[],
  },
  {
    label: "Legislative",
    icon: FaGavel,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    roles: ["Policy Advisor", "GI Specialist", "Legal Advisor", "Government Liaison", "Legislative Researcher", "Legislative Contributor"] as ContributorRole[],
  },
  {
    label: "Industry",
    icon: FaIndustry,
    color: "text-stone-600",
    bg: "bg-stone-50",
    border: "border-stone-200",
    roles: ["Exporter", "Trade Association", "Craft Guild", "Industry Body", "Certification Agency", "Market Expert", "Industry & Guild Contributor"] as ContributorRole[],
  },
];

const ALL_ROLES = ROLE_GROUPS.flatMap(g => g.roles);

function getRoleGroup(role: ContributorRole) {
  return ROLE_GROUPS.find(g => (g.roles as string[]).includes(role));
}

// ─── Validation ───────────────────────────────────────────────────────────────

interface ReadinessResult {
  score: number;
  errors: string[];
  warnings: string[];
  ok: string[];
}

function checkReadiness(contributors: Contributor[]): ReadinessResult {
  const has = (role: string) => contributors.some(c => c.role === role);
  const errors: string[] = [];
  const warnings: string[] = [];
  const ok: string[] = [];

  if (!has("Lead Author")) errors.push("Lead Author is required");
  else ok.push("Lead Author ✓");
  if (!has("Academic Institution")) errors.push("Academic Institution is required");
  else ok.push("Institution ✓");
  if (!has("Technical Editor")) warnings.push("Technical Editor recommended");
  else ok.push("Technical Editor ✓");
  if (!has("Peer Reviewer")) warnings.push("Peer Reviewer recommended for academic credibility");
  else ok.push("Peer Reviewer ✓");

  const score = Math.min(100,
    (has("Lead Author") ? 30 : 0) +
    (has("Academic Institution") ? 25 : 0) +
    (has("Technical Editor") ? 20 : 0) +
    (has("Peer Reviewer") ? 15 : 0) +
    (contributors.length > 3 ? 10 : 0)
  );

  return { score, errors, warnings, ok };
}

// ─── Local Registry ───────────────────────────────────────────────────────────

const REGISTRY_KEY = "hcrf_contributor_registry";

function loadRegistry(): Contributor[] {
  try {
    const raw = localStorage.getItem(REGISTRY_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    const filtered = list.filter(c => c && c.name && !isGarbageOrHeading(c.name));
    if (filtered.length !== list.length) {
      localStorage.setItem(REGISTRY_KEY, JSON.stringify(filtered));
      console.log(`[Registry Startup Cleanup] Removed ${list.length - filtered.length} malformed records from local storage registry.`);
    }
    return filtered;
  } catch { return []; }
}

function saveRegistry(contributors: Contributor[]) {
  try { localStorage.setItem(REGISTRY_KEY, JSON.stringify(contributors)); } catch { /**/ }
}

function saveToRegistry(contributor: Contributor) {
  const registry = loadRegistry();
  const existing = registry.findIndex(r =>
    r.name.toLowerCase() === contributor.name.toLowerCase() && r.role === contributor.role
  );
  if (existing >= 0) {
    registry[existing] = { ...registry[existing], ...contributor, addedAt: registry[existing].addedAt };
  } else {
    registry.push({ ...contributor, addedAt: new Date().toISOString() });
  }
  saveRegistry(registry);
}

// ─── File Parsers ─────────────────────────────────────────────────────────────

const ROLE_MAP: Record<string, ContributorRole> = {
  "lead author": "Lead Author", "author": "Lead Author", "lead": "Lead Author",
  "co author": "Co-Author", "co-author": "Co-Author", "coauthor": "Co-Author",
  "corresponding author": "Corresponding Author",
  "contributing author": "Contributing Author",
  "institution": "Academic Institution", "affiliation": "Academic Institution",
  "research team": "Research Team", "team": "Research Team",
  "technical editor": "Technical Editor", "editor": "Technical Editor",
  "peer reviewer": "Peer Reviewer", "reviewer": "Peer Reviewer",
  "master artisan": "Master Artisan", "artisan": "Artisan Contributor",
  "field researcher": "Field Researcher", "field contributor": "Field Researcher",
  "policy advisor": "Policy Advisor", "gi specialist": "GI Specialist",
  "legal advisor": "Legal Advisor", "legislative_contributors": "Policy Advisor",
  "exporter": "Exporter", "industry": "Industry Body", "trade": "Trade Association",
  "industry_guild_contributors": "Industry Body",
  "lead_author": "Lead Author", "co_authors": "Co-Author",
  "academic_institution": "Academic Institution", "research_team": "Research Team",
  "technical_editor": "Technical Editor", "peer_reviewer": "Peer Reviewer",
  "field_contributors": "Field Researcher",
  "corresponding_author": "Corresponding Author",
  "review_committee": "Review Committee",
  "master_artisan": "Master Artisan",
  "policy_advisor": "Policy Advisor",
};

function normaliseRole(raw: any): ContributorRole {
  return normalizeContributorRole(String(raw)) as ContributorRole;
}

function makeId() { return `c_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`; }

function parseCSVContributors(text: string): Contributor[] {
  const { data } = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true });
  return data.map(row => ({
    id: makeId(),
    role: normaliseRole(row.role || row.Role || "Co-Author"),
    name: row.name || row.Name || "",
    title: row.title || row.Title || "",
    institution: row.institution || row.Institution || row.affiliation || "",
    email: row.email || row.Email || "",
    orcid: row.orcid || row.ORCID || "",
    researchAreas: row.research_areas || row.researchAreas || "",
    verified: false,
    source: "CSV Import",
  })).filter(c => c.name);
}

function parseJSONContributors(text: string): Contributor[] {
  const obj = JSON.parse(text);

  // Handle flat dictionary format (e.g. {"lead_author": "Name"})
  if (!Array.isArray(obj) && !obj.name && !obj.Name) {
    const rolesDetected = Object.keys(obj).some(k => ROLE_MAP[k.toLowerCase().trim()]);
    if (rolesDetected) {
      return Object.entries(obj)
        .filter(([_, val]) => val && typeof val === "string")
        .map(([key, val]) => ({
          id: makeId(),
          role: normaliseRole(key),
          name: String(val),
          title: "", institution: "", email: "", orcid: "", researchAreas: "", verified: false,
        }));
    }
  }

  const arr = Array.isArray(obj) ? obj : [obj];
  return arr.map(item => ({
    id: makeId(),
    role: normaliseRole(item.role ?? item.Role ?? item.contributor_type ?? "Co-Author"),
    name: String(item.name ?? item.full_name ?? item.Name ?? ""),
    title: String(item.title ?? item.designation ?? ""),
    institution: String(item.institution ?? item.affiliation ?? item.organization ?? ""),
    email: String(item.email ?? ""),
    orcid: String(item.orcid ?? item.ORCID ?? ""),
    researchAreas: String(item.research_areas ?? item.expertise ?? ""),
    verified: false,
  })).filter(c => c.name);
}

function parseYAMLContributors(text: string): Contributor[] {
  // Try array of contributor blocks
  const blocks: Record<string, string>[] = [];
  let current: Record<string, string> = {};
  for (const line of text.split("\n")) {
    if (line.trim().startsWith("-") && Object.keys(current).length) {
      blocks.push(current); current = {};
    }
    const m = line.match(/^\s*([a-zA-Z_]+)\s*:\s*(.+)$/);
    if (m) current[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  if (Object.keys(current).length) blocks.push(current);
  return blocks.map(b => ({
    id: makeId(),
    role: normaliseRole(b.role ?? "Co-Author"),
    name: b.name ?? b.full_name ?? "",
    title: b.title ?? "",
    institution: b.institution ?? b.affiliation ?? "",
    email: b.email ?? "",
    orcid: b.orcid ?? "",
    verified: false,
    source: "YAML Import",
  })).filter(c => c.name);
}

function parseBibTeXContributors(text: string): Contributor[] {
  const contributors: Contributor[] = [];
  const authorMatch = text.match(/author\s*=\s*\{([^}]+)\}/i);
  if (authorMatch) {
    const names = authorMatch[1].split(" and ").map(n => n.trim());
    names.forEach((name, i) => {
      contributors.push({ id: makeId(), role: i === 0 ? "Lead Author" : "Co-Author", name, verified: false, source: "BibTeX Import" });
    });
  }
  const pubMatch = text.match(/publisher\s*=\s*\{([^}]+)\}/i);
  if (pubMatch) contributors.push({ id: makeId(), role: "Academic Institution", name: pubMatch[1].trim(), verified: false, source: "BibTeX Import" });
  return contributors;
}

function parseRISContributors(text: string): Contributor[] {
  const contributors: Contributor[] = [];
  const lines = text.split("\n");
  let isFirst = true;
  for (const line of lines) {
    const m = line.match(/^(A1|AU|A2|A3|A4)\s+-\s+(.+)$/);
    if (m) {
      contributors.push({ id: makeId(), role: isFirst ? "Lead Author" : "Co-Author", name: m[2].trim(), verified: false, source: "RIS Import" });
      isFirst = false;
    }
    const inst = line.match(/^(AD|JO|JF)\s+-\s+(.+)$/);
    if (inst) contributors.push({ id: makeId(), role: "Academic Institution", name: inst[2].trim(), verified: false, source: "RIS Import" });
  }
  return contributors;
}

async function extractFromDOCXOrPDF(file: File): Promise<Contributor[]> {
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
      s.onerror = rej; document.head.appendChild(s);
    });
    const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
    for (let i = 1; i <= Math.min(5, pdf.numPages); i++) {
      const page = await pdf.getPage(i);
      const tc = await page.getTextContent();
      text += tc.items.map((it: any) => it.str).join(" ") + "\n";
    }
  }
  console.log("RAW EXTRACTED TEXT", text);
  const parsed = heuristicExtract(text);
  const sourceName = ext === "pdf" ? "PDF Suggestion" : "DOCX Suggestion";
  const updatedParsed = parsed.map(c => ({ ...c, source: sourceName }));
  console.log("PARSED CONTRIBUTORS", updatedParsed.map(c => ({ name: c.name, role: c.role })));
  return updatedParsed;
}

function heuristicExtract(text: string): Contributor[] {
  const contributors: Contributor[] = [];
  const lines = text.split(/\n|\r/).map(l => l.trim()).filter(Boolean);

  const patterns: [RegExp, ContributorRole][] = [
    [/(?:authored?|written)\s+by\s*[:\-]?\s*(.+)/i, "Lead Author"],
    [/(?:lead|principal)\s+author\s*[:\-]?\s*(.+)/i, "Lead Author"],
    [/(?:co-?authors?|authors?)\s*[:\-]\s*(.+)/i, "Co-Author"],
    [/(?:technical\s+editor|editor)\s*[:\-]\s*(.+)/i, "Technical Editor"],
    [/(?:peer\s+reviewer?|reviewed?\s+by)\s*[:\-]\s*(.+)/i, "Peer Reviewer"],
    [/(?:institution|affiliated?\s+to|university|college)\s*[:\-]\s*(.+)/i, "Academic Institution"],
    [/(?:research\s+team|team)\s*[:\-]\s*(.+)/i, "Research Team"],
    [/(?:artisan|master\s+artisan)\s*[:\-]\s*(.+)/i, "Master Artisan"],
    [/(?:policy\s+advisor|advisor)\s*[:\-]\s*(.+)/i, "Policy Advisor"],
    [/ORCID\s*[:\-]?\s*(0000-\d{4}-\d{4}-\d{3}[\dX])/i, "Lead Author"],
  ];

  const labelsPattern = /\b(lead\s+authors?|authors?|co-?authors?|institutions?|affiliations?|research\s+teams?|editorial|review\s+panels?|technical\s+editors?|peer\s+reviewers?|field\s+contributors?|legislative\s+contributors?|industry\s+contributors?|corresponding\s+authors?|policy\s+advisors?|advisors?)\b/i;

  for (const line of lines) {
    for (const [pattern, role] of patterns) {
      const m = line.match(pattern);
      if (m) {
        let name = m[1].trim();
        const matchIdx = name.search(labelsPattern);
        if (matchIdx !== -1) {
          name = name.slice(0, matchIdx);
        }
        name = name.replace(/^[\s,;.:()\-\[\]/\\+|]+|[\s,;.:()\-\[\]/\\+|]+$/g, "").trim();

        if (name.length > 2 && !isGarbageOrHeading(name) && !contributors.find(c => c.name === name)) {
          contributors.push({ id: makeId(), role, name, verified: false });
        }
      }
    }
    // ORCID inline
    const orcidMatch = line.match(/(0000-\d{4}-\d{4}-\d{3}[\dX])/);
    if (orcidMatch) {
      const last = contributors[contributors.length - 1];
      if (last && !last.orcid) last.orcid = orcidMatch[1];
    }
  }

  return contributors.slice(0, 20);
}

// ─── Auto-extraction from manuscript chapters ─────────────────────────────────

function autoExtractFromChapters(
  chapters: Array<{ title: string; pages?: Array<{ content: string }> }>,
  publicationTitle: string
): { contributor: Contributor; confidence: number }[] {
  const text = [
    publicationTitle,
    ...chapters.flatMap(ch => [
      ch.title,
      ...(ch.pages ?? []).flatMap(pg => {
        try { return (JSON.parse(pg.content) as any[]).map(b => b.text ?? ""); }
        catch { return []; }
      }),
    ]),
  ].join(" ");

  const suggestions: { contributor: Contributor; confidence: number }[] = [];

  const patterns: [RegExp, ContributorRole, number][] = [
    [/authored?\s+by\s*[:\-]?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/g, "Lead Author", 98],
    [/([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}),?\s*(?:PhD|Ph\.D|Dr\.|Prof\.|Professor)/g, "Lead Author", 92],
    [/co-?authors?\s*[:\-]\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/gi, "Co-Author", 88],
    [/(?:technical\s+)?editor\s*[:\-]\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/gi, "Technical Editor", 90],
    [/reviewed?\s+by\s*[:\-]?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/gi, "Peer Reviewer", 85],
    [/(?:KHCRF|Kashmir University|SKUAST|NIT|University[^,\n]{0,20})/g, "Academic Institution", 95],
    [/(?:master\s+)?artisan\s*[:\-]?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/gi, "Master Artisan", 82],
  ];

  for (const [pattern, role, confidence] of patterns) {
    let m;
    pattern.lastIndex = 0;
    while ((m = pattern.exec(text)) !== null) {
      const name = (m[1] || m[0]).trim().slice(0, 80);
      if (name.length > 2 && !suggestions.find(s => s.contributor.name === name)) {
        suggestions.push({ contributor: { id: makeId(), role, name, verified: false }, confidence });
      }
      if (suggestions.length >= 12) break;
    }
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 10);
}

// ─── Template ─────────────────────────────────────────────────────────────────

const CSV_TEMPLATE = `role,name,title,institution,email,orcid,research_areas
Lead Author,Dr Fayaz Ahmad Khan,Founder & Research Lead,KHCRF,,0000-0000-0000-0001,Pashmina Authentication|GI Protection
Co-Author,Dr XYZ,Research Fellow,Kashmir University,,,Craft Economics
Technical Editor,John Smith,Technical Editor,KHCRF,,,
Peer Reviewer,Dr Jane Doe,Professor,Kashmir University,,,
Master Artisan,Ghulam Mohammad,Master Artisan,Pashmina Cluster,,,
Industry Contributor,KCCI Representative,Industry Advisor,KCCI,,,`;

const JSON_TEMPLATE = `{
  "schema": "hcrf_contributors_v1",
  "contributors": [
    {
      "name": "Hamadan Craft Revival Foundation (KHCRF)",
      "role": "lead_author",
      "institution": "Hamadan Craft Revival Foundation",
      "email": "",
      "orcid": "",
      "notes": "Institutional lead author"
    },
    {
      "name": "KHCRF Research & Documentation Team",
      "role": "co_author",
      "institution": "KHCRF",
      "email": "",
      "orcid": "",
      "notes": "Research and documentation contributors"
    },
    {
      "name": "KHCRF Editorial Board",
      "role": "technical_editor",
      "institution": "KHCRF",
      "email": "",
      "orcid": "",
      "notes": "Editorial review and technical validation"
    },
    {
      "name": "Independent Craft Heritage and GI Review Panel",
      "role": "peer_reviewer",
      "institution": "Independent Review Panel",
      "email": "",
      "orcid": "",
      "notes": "Peer and GI review"
    },
    {
      "name": "Pashmina artisans, hand spinners, weavers, traders, cluster coordinators, and field researchers",
      "role": "field_contributor",
      "institution": "Kashmir Pashmina Field Network",
      "email": "",
      "orcid": "",
      "notes": "Field knowledge contributors"
    },
    {
      "name": "GI policy advisors, handicrafts policy stakeholders, and regulatory contributors",
      "role": "legislative_contributor",
      "institution": "GI and Handicrafts Policy Network",
      "email": "",
      "orcid": "",
      "notes": "Policy and regulatory contributors"
    },
    {
      "name": "Export councils, craft guilds, artisan cooperatives, and Kashmir handicraft industry bodies",
      "role": "industry_guild_contributor",
      "institution": "Kashmir Handicraft Industry Network",
      "email": "",
      "orcid": "",
      "notes": "Industry and guild contributors"
    }
  ]
}`;

// ─── Contributor Card ─────────────────────────────────────────────────────────

function ContributorCard({
  contributor, onRemove, onEdit,
}: { contributor: Contributor; onRemove: () => void; onEdit: () => void }) {
  const group = getRoleGroup(contributor.role);
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
      className={`relative flex items-start gap-3 p-3 rounded-xl border ${group?.border ?? "border-stone-200"} ${group?.bg ?? "bg-stone-50"}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${group?.bg ?? "bg-stone-100"}`}>
        {group?.icon && <group.icon className={group.color} size={13} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-[10px] font-black text-gray-900">{contributor.name}</p>
          {contributor.verified && <FaStar className="text-amber-400" size={9} title="Verified in registry" />}
          {contributor.orcid && (
            <span className="text-[8px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">ORCID</span>
          )}
        </div>
        <p className="text-[9px] text-stone-500 mt-0.5">{contributor.title}{contributor.title && contributor.institution ? " · " : ""}{contributor.institution}</p>
        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[8px] font-black ${group?.bg} ${group?.color} border ${group?.border}`}>
          {contributor.role}
        </span>
        {contributor.source && (
          <span className="inline-block mt-1 ml-1 px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200 text-[7px] font-bold">
            {contributor.source}
          </span>
        )}
      </div>
      <div className="flex gap-1 shrink-0">
        <button onClick={onEdit} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-white transition-all"><FaEdit size={9} /></button>
        <button onClick={onRemove} className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg hover:bg-white transition-all"><FaTrash size={9} /></button>
      </div>
    </motion.div>
  );
}

// ─── Authority Map ────────────────────────────────────────────────────────────

function AuthorityMap({ contributors }: { contributors: Contributor[] }) {
  const grouped = ROLE_GROUPS.map(g => ({
    ...g,
    items: contributors.filter(c => (g.roles as string[]).includes(c.role)),
  })).filter(g => g.items.length > 0);

  if (!grouped.length) return (
    <div className="text-center py-8 text-stone-400">
      <FaProjectDiagram size={28} className="mx-auto mb-2 opacity-40" />
      <p className="text-xs font-bold">No contributors selected yet.</p>
      <p className="text-[10px] text-stone-400 mt-1 max-w-xs mx-auto">Choose contributors from Directory or click Auto-Apply Recommended.</p>
    </div>
  );

  return (
    <div className="space-y-2">
      {grouped.map((group, gi) => (
        <div key={group.label}>
          <div className={`flex items-center gap-2 p-3 rounded-xl border ${group.border} ${group.bg}`}>
            <group.icon className={group.color} size={12} />
            <span className={`text-[9px] font-black uppercase tracking-widest ${group.color}`}>{group.label}</span>
            <div className="flex flex-wrap gap-1.5 ml-2">
              {group.items.map(c => (
                <span key={c.id} className="flex items-center gap-1 bg-white border border-current/20 px-2 py-0.5 rounded-full text-[9px] font-bold text-gray-800">
                  {c.name}
                  {c.orcid && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" title="Has ORCID" />}
                </span>
              ))}
            </div>
          </div>
          {gi < grouped.length - 1 && (
            <div className="flex justify-center py-0.5">
              <div className="w-px h-3 bg-stone-300" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main Modal ────────────────────────────────────────────────────────────────

type Tab = "upload" | "extract" | "directory" | "authority";

interface EditingState { idx: number; contributor: Contributor }

export default function ContributorIntelligenceModal({
  isOpen, onClose, onApply,
  existingContributors = [],
  existingChapters = [],
  publicationTitle = "",
}: ContributorIntelligenceModalProps) {
  const dropRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<Tab>("upload");
  const [dragOver, setDragOver] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [filename, setFilename] = useState<string | null>(null);

  // Contributors being assembled
  const [contributors, setContributors] = useState<Contributor[]>(existingContributors);
  const [autoSuggestions, setAutoSuggestions] = useState<{ contributor: Contributor; confidence: number }[]>([]);
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [newContributor, setNewContributor] = useState<Partial<Contributor>>({ role: "Lead Author" });

  // Directory
  const [registry, setRegistry] = useState<Contributor[]>([]);
  const [directorySearch, setDirectorySearch] = useState("");

  // Duplicate detection
  const [duplicates, setDuplicates] = useState<{ incoming: Contributor; existing: Contributor }[]>([]);

  useEffect(() => {
    if (isOpen) {
      setRegistry(loadRegistry());
      setContributors(existingContributors.length ? existingContributors : []);
    }
  }, [isOpen]);

  const reset = () => {
    setTab("upload"); setContributors(existingContributors); setAutoSuggestions([]);
    setEditing(null); setAddingNew(false); setDuplicates([]); setDirectorySearch("");
  };

  const handleClose = () => { reset(); onClose(); };

  const normalizeForDedupe = (str: string) => {
    return str.toLowerCase().replace(/[^\w\s]/g, "").trim().replace(/\s+/g, " ");
  };

  const findDuplicates = (incoming: Contributor[]) => {
    const dupes: { incoming: Contributor; existing: Contributor }[] = [];
    for (const inc of incoming) {
      const match = contributors.find(c =>
        normalizeForDedupe(c.name) === normalizeForDedupe(inc.name) &&
        normalizeForDedupe(c.role) === normalizeForDedupe(inc.role)
      );
      if (match) dupes.push({ incoming: inc, existing: match });
    }
    return dupes;
  };

  const mergeContributors = (incoming: Contributor[], skipDuplicates = false) => {
    const cleanedIncoming = incoming.filter(c => !isGarbageOrHeading(c.name));
    const uniqueIncoming: Contributor[] = [];
    const seen = new Set<string>();
    
    cleanedIncoming.forEach(c => {
      const key = `${normalizeForDedupe(c.name)}|${normalizeForDedupe(c.role)}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueIncoming.push(c);
      }
    });

    const dupes = findDuplicates(uniqueIncoming);
    if (dupes.length && !skipDuplicates) {
      setDuplicates(dupes);
      toast.error(`Workflow paused: Found ${dupes.length} duplicate(s)`);
      return;
    }
    const deduped = uniqueIncoming.filter(inc =>
      !contributors.some(c =>
        normalizeForDedupe(c.name) === normalizeForDedupe(inc.name) &&
        normalizeForDedupe(c.role) === normalizeForDedupe(inc.role)
      )
    );
    if (!deduped.length) {
      toast.error("Workflow paused: No new contributors to add.");
      return;
    }
    setContributors(prev => [...prev, ...deduped]);
    deduped.forEach(saveToRegistry);
    setDuplicates([]);
    toast.success(`Workflow advancing: Added ${deduped.length} contributor(s)`);
    setTab("authority");
  };

  // ── File parse ────────────────────────────────────────────────────────────

  const parseFile = useCallback(async (file: File) => {
    setParsing(true);
    setFilename(file.name);
    toast.loading(`Parsing ${file.name}...`, { id: "parse-toast" });
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      let parsed: Contributor[] = [];
      if (ext === "csv") {
        parsed = parseCSVContributors(await file.text());
      } else if (ext === "json") {
        const jsonText = await file.text();
        const json = JSON.parse(jsonText);
        const result = validateContributorsSchema(json);
        if (!result.isValid) {
          throw new Error(`Invalid Schema (hcrf_contributors_v1): ${result.errors.join(", ")}`);
        }
        if (result.warnings.length > 0) {
          result.warnings.forEach(w => toast(w, { icon: "⚠️" }));
        }
        parsed = result.normalizedData.contributors.map((c: any) => ({ ...c, source: "JSON Import" }));
      } else if (ext === "yaml" || ext === "yml") {
        parsed = parseYAMLContributors(await file.text());
      } else if (ext === "bib") {
        parsed = parseBibTeXContributors(await file.text());
      } else if (ext === "ris") {
        parsed = parseRISContributors(await file.text());
      } else if (ext === "docx" || ext === "doc" || ext === "pdf") {
        parsed = await extractFromDOCXOrPDF(file);
        setAutoSuggestions(parsed.map(c => ({ contributor: c, confidence: 90 })));
        setTab("extract");
        toast.success(`Heuristic scan complete: ${parsed.length} suggestions generated. Check 'Auto-Extract' tab.`, { id: "parse-toast" });
        setParsing(false);
        return;
      } else {
        throw new Error(`Unsupported format: .${ext}`);
      }
      
      if (!parsed.length) {
        throw new Error("No valid contributors found. Check file format.");
      }
      toast.success(`Parsed ${parsed.length} row(s) from file`, { id: "parse-toast" });
      mergeContributors(parsed);
    } catch (err: any) {
      setFilename(null);
      toast.error(`Parse failed: ${err?.message ?? "Unknown error"}`, { id: "parse-toast" });
    } finally { setParsing(false); }
  }, [contributors]);

  // ── Auto-extract ──────────────────────────────────────────────────────────

  const handleAutoExtract = async () => {
    setExtracting(true);
    await new Promise(r => setTimeout(r, 600));
    const suggestions = autoExtractFromChapters(existingChapters, publicationTitle);
    setAutoSuggestions(suggestions);
    setExtracting(false);
    if (!suggestions.length) toast.error("No contributors detected. Try adding content to the manuscript first.");
  };

  const applySuggestion = (s: { contributor: Contributor; confidence: number }) => {
    if (contributors.some(c => c.name === s.contributor.name)) {
      toast("Already in contributors list"); return;
    }
    setContributors(prev => [...prev, s.contributor]);
    saveToRegistry(s.contributor);
    toast.success(`Added: ${s.contributor.name}`);
  };

  // ── Directory pick ────────────────────────────────────────────────────────

  const filteredRegistry = registry.filter(r =>
    !directorySearch || r.name.toLowerCase().includes(directorySearch.toLowerCase()) ||
    (r.institution ?? "").toLowerCase().includes(directorySearch.toLowerCase())
  );

  const pickFromDirectory = (c: Contributor) => {
    if (contributors.some(ex => ex.name.toLowerCase() === c.name.toLowerCase())) {
      toast("Already added"); return;
    }
    setContributors(prev => [...prev, { ...c, id: makeId(), verified: true, source: "Directory Selection" }]);
    toast.success(`✓ ${c.name} added from directory`);
  };

  // ── Remove / edit ─────────────────────────────────────────────────────────

  const removeContributor = (id: string) => setContributors(prev => prev.filter(c => c.id !== id));

  const saveEdit = () => {
    if (!editing) return;
    setContributors(prev => prev.map((c, i) => i === editing.idx ? editing.contributor : c));
    saveToRegistry(editing.contributor);
    setEditing(null);
    toast.success("Contributor updated");
  };

  const saveNew = () => {
    if (!newContributor.name) { toast.error("Name is required"); return; }
    const full: Contributor = { id: makeId(), role: newContributor.role as ContributorRole ?? "Co-Author", name: newContributor.name ?? "", title: newContributor.title, institution: newContributor.institution, email: newContributor.email, orcid: newContributor.orcid, verified: false, source: "Manual Entry" };
    setContributors(prev => [...prev, full]);
    saveToRegistry(full);
    setAddingNew(false);
    setNewContributor({ role: "Lead Author" });
    setRegistry(loadRegistry());
    toast.success(`Added: ${full.name}`);
  };

  const autoApplyRecommended = () => {
    const recommendedRoles = ["Lead Author", "Co-Author", "Academic Institution", "Research Team", "Technical Editor", "Peer Reviewer"];
    const toAdd = registry
      .filter(c => recommendedRoles.includes(c.role) && !isGarbageOrHeading(c.name))
      .map(c => ({ ...c, id: makeId(), source: "Directory Selection" }));
    if (toAdd.length === 0) {
      toast.error("No recommended contributors found in directory/registry.");
      return;
    }
    mergeContributors(toAdd);
  };

  const addAllSuggestions = () => {
    if (!autoSuggestions.length) return;
    const contributorsToAdd = autoSuggestions.map(s => s.contributor);
    mergeContributors(contributorsToAdd);
  };

  const addAllDirectory = () => {
    const toAdd = filteredRegistry
      .filter(c => !contributors.some(ex => ex.name.toLowerCase() === c.name.toLowerCase()))
      .map(c => ({ ...c, id: makeId(), source: "Directory Selection" }));
    if (!toAdd.length) {
      toast("All directory items already added.");
      return;
    }
    mergeContributors(toAdd);
  };

  const handleApply = () => {
    const readiness = checkReadiness(contributors);
    const data = buildContributorsData(contributors);
    onApply(data, contributors);
    if (readiness.errors.length) {
      toast.success("Applied partial contributors (missing roles can be added later)");
    } else {
      toast.success(`✓ ${contributors.length} contributors applied`);
    }
    handleClose();
  };

  function buildContributorsData(list: Contributor[]): ContributorsData {
    const find = (role: string) => list.find(c => c.role === role);
    const findAll = (roles: string[]) => list.filter(c => roles.includes(c.role)).map(c => c.name).join(", ");
    return {
      author: find("Lead Author")?.name ?? "",
      coAuthor: findAll(["Co-Author"]),
      institution: findAll(["Academic Institution"]),
      researchTeam: find("Research Team")?.name ?? "",
      technicalEditor: find("Technical Editor")?.name ?? "",
      reviewer: findAll(["Peer Reviewer"]),
      fieldContributor: findAll(["Field Contributor"]),
      legislativeContributor: findAll(["Legislative Contributor"]),
      industryContributor: findAll(["Industry & Guild Contributor"]),
      contributorsJson: JSON.stringify(list),
    };
  }

  const readiness = checkReadiness(contributors);

  if (!isOpen) return null;

  const TABS = [
    { id: "upload" as Tab, label: "Bulk Upload", icon: <FaFileUpload size={9} /> },
    { id: "extract" as Tab, label: "Auto-Extract", icon: <FaRobot size={9} /> },
    { id: "directory" as Tab, label: "Directory", icon: <FaSearch size={9} /> },
    { id: "authority" as Tab, label: "Authority Map", icon: <FaProjectDiagram size={9} /> },
  ];

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/75 z-50 flex items-start justify-center p-4 pt-6"
        onClick={e => e.target === e.currentTarget && handleClose()}>
        <motion.div initial={{ scale: 0.95, y: 10, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full flex flex-col overflow-hidden"
          style={{ maxWidth: 960, maxHeight: "92vh" }}>

          {/* ── Header ── */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-stone-900 to-stone-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <FaUsers className="text-indigo-400" size={14} />
              </div>
              <div>
                <h2 className="text-sm font-black text-white">Contributor Intelligence System</h2>
                <p className="text-[10px] text-stone-400 mt-0.5">Build KHCRF author, institution &amp; reviewer authority network</p>
              </div>
            </div>
            {/* Tabs */}
            <div className="flex bg-white/10 rounded-xl p-1 gap-1">
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${tab === t.id ? "bg-white text-stone-900" : "text-stone-400 hover:text-white"}`}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 ml-3">
              {/* Readiness badge */}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black border ${
                readiness.score === 100 ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" :
                readiness.score >= 55 ? "bg-amber-500/20 border-amber-500/30 text-amber-400" :
                "bg-red-500/20 border-red-500/30 text-red-400"
              }`}>
                <FaStar size={8} /> {readiness.score}% Ready
              </div>
              <button onClick={handleClose} className="p-2 rounded-xl hover:bg-white/10 text-stone-400 hover:text-white transition-colors">
                <FaTimes size={13} />
              </button>
            </div>
          </div>

          {/* ── Body: 2-column layout ── */}
          <div className="flex flex-1 overflow-hidden">

            {/* LEFT — tab content */}
            <div className="flex-1 overflow-y-auto p-5">

              {/* ╔══ TAB: Upload ══╗ */}
              {tab === "upload" && (
                <div className="space-y-4">
                  {/* Drop zone */}
                  <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
                    onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) parseFile(f); }}
                    onClick={() => dropRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center gap-3 text-center cursor-pointer transition-all ${dragOver ? "border-indigo-400 bg-indigo-50" : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"} ${parsing ? "pointer-events-none opacity-60" : ""}`}>
                    <input ref={dropRef} type="file" accept=".csv,.json,.yaml,.yml,.docx,.doc,.pdf,.bib,.ris" onChange={e => { const f = e.target.files?.[0]; if (f) parseFile(f); e.target.value = ""; }} className="hidden" />
                    {parsing ? <FaSpinner className="text-indigo-500 text-2xl animate-spin" /> : <FaFileUpload className={dragOver ? "text-indigo-500 text-2xl" : "text-stone-400 text-2xl"} />}
                    <div>
                      <p className="text-sm font-black text-gray-800">
                        {parsing ? "Parsing contributors…" : <>Drop a contributor file or <span className="text-indigo-600">browse</span></>}
                      </p>
                      <p className="text-[10px] text-stone-400 mt-0.5">CSV · JSON · YAML · DOCX · PDF · BibTeX · RIS</p>
                    </div>
                  </div>

                  {/* Suggestion Warning */}
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3 text-[10px] font-medium leading-relaxed">
                    <strong>Notice:</strong> DOCX/PDF extraction is suggestive only. Extracted contributors will generate suggestions inside the <strong>Auto-Extract</strong> tab for manual review. Use the <strong>KHCRF Contributors JSON</strong> format for official, reliable imports.
                  </div>

                  {/* Template download */}
                  <div className="flex gap-2">
                    <button onClick={() => {
                      const a = document.createElement("a");
                      a.href = URL.createObjectURL(new Blob([CSV_TEMPLATE], { type: "text/csv" }));
                      a.download = "hcrf_contributors_template.csv";
                      a.click();
                    }} className="flex items-center gap-1.5 px-3 py-2 bg-stone-50 border border-stone-200 text-stone-600 text-[10px] font-black rounded-xl hover:bg-stone-100 transition-all">
                      <FaDownload size={9} /> CSV Template
                    </button>
                    <button onClick={() => {
                      const a = document.createElement("a");
                      a.href = URL.createObjectURL(new Blob([JSON_TEMPLATE], { type: "application/json" }));
                      a.download = "hcrf_contributors_template.json";
                      a.click();
                    }} className="flex items-center gap-1.5 px-3 py-2 bg-stone-50 border border-stone-200 text-stone-600 text-[10px] font-black rounded-xl hover:bg-stone-100 transition-all">
                      <FaDownload size={9} /> JSON Template (v1)
                    </button>
                  </div>

                  {/* Manual Add */}
                  <div className="border-t border-stone-100 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Manual Add</p>
                      <button onClick={() => setAddingNew(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[9px] font-black rounded-xl hover:bg-indigo-100 transition-all">
                        <FaPlus size={8} /> Add Contributor
                      </button>
                    </div>

                    {/* Add form */}
                    {addingNew && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 space-y-3 mb-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[9px] font-black text-stone-500 uppercase tracking-wider block mb-1">Role *</label>
                            <select value={newContributor.role ?? "Lead Author"}
                              onChange={e => setNewContributor(p => ({ ...p, role: e.target.value as ContributorRole }))}
                              className="w-full px-2.5 py-1.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                              {ALL_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-stone-500 uppercase tracking-wider block mb-1">Full Name *</label>
                            <input value={newContributor.name ?? ""} onChange={e => setNewContributor(p => ({ ...p, name: e.target.value }))}
                              placeholder="Dr Full Name" className="w-full px-2.5 py-1.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" />
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-stone-500 uppercase tracking-wider block mb-1">Title / Designation</label>
                            <input value={newContributor.title ?? ""} onChange={e => setNewContributor(p => ({ ...p, title: e.target.value }))}
                              placeholder="Professor, PhD" className="w-full px-2.5 py-1.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" />
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-stone-500 uppercase tracking-wider block mb-1">Institution</label>
                            <input value={newContributor.institution ?? ""} onChange={e => setNewContributor(p => ({ ...p, institution: e.target.value }))}
                              placeholder="KHCRF / University" className="w-full px-2.5 py-1.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" />
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-stone-500 uppercase tracking-wider block mb-1">ORCID</label>
                            <input value={newContributor.orcid ?? ""} onChange={e => setNewContributor(p => ({ ...p, orcid: e.target.value }))}
                              placeholder="0000-0000-0000-0000" className="w-full px-2.5 py-1.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white font-mono" />
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-stone-500 uppercase tracking-wider block mb-1">Email</label>
                            <input value={newContributor.email ?? ""} onChange={e => setNewContributor(p => ({ ...p, email: e.target.value }))}
                              placeholder="email@domain.com" className="w-full px-2.5 py-1.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => { setAddingNew(false); setNewContributor({ role: "Lead Author" }); }} className="px-3 py-1.5 text-[9px] font-black bg-stone-100 text-stone-600 rounded-xl hover:bg-stone-200">Cancel</button>
                          <button onClick={saveNew} className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black bg-indigo-500 text-white rounded-xl hover:bg-indigo-600">
                            <FaCheck size={8} /> Save Contributor
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Duplicate warning */}
                  {duplicates.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
                      <p className="text-[10px] font-black text-amber-700 flex items-center gap-1.5">
                        <FaExclamationTriangle size={10} /> {duplicates.length} Duplicate{duplicates.length > 1 ? "s" : ""} Detected
                      </p>
                      {duplicates.map(({ incoming, existing }) => (
                        <div key={incoming.id} className="bg-white rounded-xl border border-amber-200 p-3">
                          <p className="text-[10px] font-black text-gray-900 mb-2">{incoming.name}</p>
                          <div className="flex gap-2">
                            <button onClick={() => { setContributors(prev => prev.map(c => c.id === existing.id ? { ...c, ...incoming, id: existing.id } : c)); setDuplicates([]); toast.success("Merged"); }}
                              className="flex-1 py-1.5 text-[9px] font-black bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100">Merge Records</button>
                            <button onClick={() => setDuplicates([])}
                              className="flex-1 py-1.5 text-[9px] font-black bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200">Skip Duplicates</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ╔══ TAB: Auto-Extract ══╗ */}
              {tab === "extract" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Publication Title", filled: !!publicationTitle, value: publicationTitle?.slice(0, 40) },
                      { label: "Chapters", filled: existingChapters.length > 0, value: existingChapters.length ? `${existingChapters.length} chapters` : null },
                      { label: "Registry", filled: registry.length > 0, value: registry.length ? `${registry.length} contributors` : null },
                    ].map(({ label, filled, value }) => (
                      <div key={label} className={`p-3 rounded-xl border ${filled ? "bg-emerald-50 border-emerald-200" : "bg-stone-50 border-stone-200 opacity-60"}`}>
                        <div className="flex items-center gap-1.5 mb-1">
                          {filled ? <FaCheckCircle className="text-emerald-500" size={10} /> : <FaTimesCircle className="text-stone-300" size={10} />}
                          <span className="text-[9px] font-black text-stone-500 uppercase">{label}</span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-800 truncate">{value ?? <span className="text-stone-300 italic">Not available</span>}</p>
                      </div>
                    ))}
                  </div>

                  {!autoSuggestions.length ? (
                    <div className="flex flex-col items-center gap-4 py-10">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                        <FaRobot className="text-indigo-500 text-2xl" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-sm font-black text-gray-900">Auto-Extract Contributors</h3>
                        <p className="text-xs text-gray-500 mt-1 max-w-sm">Scans title, chapter headings, acknowledgements, and body text for author signals with confidence scoring.</p>
                      </div>
                      <button onClick={handleAutoExtract} disabled={extracting || (!publicationTitle && !existingChapters.length)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-black rounded-xl hover:opacity-90 disabled:opacity-40 shadow-lg shadow-indigo-500/20">
                        {extracting ? <FaSpinner className="animate-spin" size={12} /> : <FaMagic size={12} />}
                        {extracting ? "Scanning manuscript…" : "Extract Contributors"}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Detected — Click to add</p>
                        <div className="flex gap-3">
                          <button onClick={addAllSuggestions} className="text-[9px] text-indigo-600 hover:text-indigo-800 font-black uppercase tracking-wider">Add All Suggestions</button>
                          <button onClick={() => setAutoSuggestions([])} className="text-[9px] text-stone-400 hover:text-stone-700 font-bold">Clear</button>
                        </div>
                      </div>
                      {autoSuggestions.map(({ contributor: c, confidence }) => {
                        const group = getRoleGroup(c.role);
                        const alreadyAdded = contributors.some(ex => ex.name === c.name);
                        return (
                          <div key={c.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${alreadyAdded ? "opacity-40 bg-stone-50 border-stone-100" : `${group?.bg} ${group?.border} hover:shadow-sm cursor-pointer`}`}
                            onClick={() => !alreadyAdded && applySuggestion({ contributor: c, confidence })}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${group?.bg}`}>
                              {group?.icon && <group.icon className={group.color} size={12} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-black text-gray-900">{c.name}</p>
                              <span className={`text-[8px] font-black ${group?.color}`}>{c.role}</span>
                            </div>
                            {/* Confidence bar */}
                            <div className="flex items-center gap-2 w-28 shrink-0">
                              <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${confidence}%` }} />
                              </div>
                              <span className="text-[9px] font-black text-stone-500 w-8 text-right">{confidence}%</span>
                            </div>
                            {alreadyAdded
                              ? <FaCheckCircle className="text-emerald-400 shrink-0" size={12} />
                              : <FaPlus className="text-indigo-400 shrink-0" size={12} />}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ╔══ TAB: Directory ══╗ */}
              {tab === "directory" && (
                <div className="space-y-4">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={11} />
                    <input value={directorySearch} onChange={e => setDirectorySearch(e.target.value)}
                      placeholder="Search contributor or institution…"
                      className="w-full pl-9 pr-4 py-2.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>

                  {filteredRegistry.length === 0 ? (
                    <div className="text-center py-10">
                      <FaUsers size={28} className="mx-auto text-stone-200 mb-3" />
                      <p className="text-xs font-bold text-stone-400">No contributors in directory yet</p>
                      <p className="text-[10px] text-stone-300 mt-1">Contributors are automatically saved to the directory when added via Upload or Auto-Extract.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{filteredRegistry.length} in Directory · Selected: {contributors.length}</p>
                        <button onClick={addAllDirectory} className="text-[9px] text-indigo-600 hover:text-indigo-800 font-black uppercase tracking-wider">Add All to Selection</button>
                      </div>
                      {filteredRegistry.map(c => {
                        const group = getRoleGroup(c.role);
                        const alreadyAdded = contributors.some(ex => ex.name.toLowerCase() === c.name.toLowerCase());
                        return (
                          <div key={c.id}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${alreadyAdded ? "opacity-50 bg-stone-50 border-stone-100" : `bg-white border-stone-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer`}`}
                            onClick={() => !alreadyAdded && pickFromDirectory(c)}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${group?.bg ?? "bg-stone-100"}`}>
                              {group?.icon && <group.icon className={group.color} size={12} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-[10px] font-black text-gray-900 truncate">{c.name}</p>
                                {c.orcid && <span className="text-[7px] bg-emerald-100 text-emerald-700 px-1 rounded font-bold shrink-0">ORCID</span>}
                                {c.verified && <FaStar size={8} className="text-amber-400 shrink-0" />}
                              </div>
                              <p className="text-[9px] text-stone-400 truncate">{c.role}{c.institution ? ` · ${c.institution}` : ""}</p>
                            </div>
                            {alreadyAdded
                              ? <span className="text-[8px] font-black text-emerald-600 shrink-0">Added ✓</span>
                              : <FaPlus className="text-indigo-400 shrink-0" size={11} />}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ╔══ TAB: Authority Map ══╗ */}
              {tab === "authority" && (
                <div className="space-y-4">
                  {/* File Upload Confirmation Banner */}
                  {filename && contributors.length > 0 && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-3">
                      <FaCheckCircle className="text-emerald-500" size={14} />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-emerald-900">Successfully extracted from {filename}</p>
                        <p className="text-[10px] text-emerald-700">Review the authority map below before applying.</p>
                      </div>
                    </div>
                  )}

                  {/* Readiness */}
                  <div className="bg-stone-900 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[9px] font-black uppercase tracking-widest text-stone-400">Publication Authority Score</p>
                      <span className="text-lg font-black text-white">{readiness.score}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                      <motion.div className={`h-full rounded-full ${readiness.score >= 80 ? "bg-emerald-400" : readiness.score >= 55 ? "bg-amber-400" : "bg-red-400"}`}
                        initial={{ width: 0 }} animate={{ width: `${readiness.score}%` }} transition={{ duration: 0.8 }} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {readiness.errors.map(e => (
                        <div key={e} className="flex items-center gap-1.5 text-[9px] text-red-400"><FaTimesCircle size={8} /> {e}</div>
                      ))}
                      {readiness.warnings.map(w => (
                        <div key={w} className="flex items-center gap-1.5 text-[9px] text-amber-400"><FaExclamationTriangle size={8} /> {w}</div>
                      ))}
                      {readiness.ok.map(o => (
                        <div key={o} className="flex items-center gap-1.5 text-[9px] text-emerald-400"><FaCheckCircle size={8} /> {o}</div>
                      ))}
                    </div>
                  </div>

                  {/* Authority map */}
                  <div>
                    <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest mb-3">Authority Network</p>
                    <AuthorityMap contributors={contributors} />
                  </div>

                  {/* ORCID coverage */}
                  {contributors.length > 0 && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                      <p className="text-[9px] font-black text-emerald-700 uppercase tracking-widest mb-1.5">ORCID Coverage</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${Math.round(contributors.filter(c => c.orcid).length / contributors.length * 100)}%` }} />
                        </div>
                        <span className="text-[9px] font-black text-emerald-700">
                          {contributors.filter(c => c.orcid).length}/{contributors.length} have ORCID
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT — current contributors panel */}
            <div className="w-80 shrink-0 border-l border-stone-100 bg-stone-50 flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200">
                <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest">
                  Contributors · {contributors.length}
                </p>
                {contributors.length === 0 && registry.length > 0 ? (
                  <button onClick={autoApplyRecommended}
                    className="text-[8px] text-indigo-500 font-black hover:text-indigo-700 uppercase tracking-wider">Auto-Apply Recommended</button>
                ) : (
                  contributors.length > 0 && (
                    <button onClick={() => { setTab("directory"); setRegistry(loadRegistry()); }}
                      className="text-[8px] text-indigo-500 font-bold hover:text-indigo-700">Browse Directory →</button>
                  )
                )}
              </div>

              {/* Editing overlay */}
              {editing && (
                <div className="p-4 bg-white border-b border-stone-200 space-y-2.5">
                  <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest">Editing</p>
                  {[
                    { key: "role", label: "Role", isSelect: true },
                    { key: "name", label: "Name *" },
                    { key: "title", label: "Title" },
                    { key: "institution", label: "Institution" },
                    { key: "orcid", label: "ORCID" },
                    { key: "email", label: "Email" },
                  ].map(({ key, label, isSelect }) => (
                    <div key={key}>
                      <label className="text-[8px] font-black text-stone-400 uppercase block mb-0.5">{label}</label>
                      {isSelect ? (
                        <select value={(editing.contributor as any)[key] ?? ""} onChange={e => setEditing(prev => prev ? { ...prev, contributor: { ...prev.contributor, [key]: e.target.value } } : null)}
                          className="w-full px-2 py-1.5 text-[10px] border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white">
                          {ALL_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      ) : (
                        <input value={(editing.contributor as any)[key] ?? ""} onChange={e => setEditing(prev => prev ? { ...prev, contributor: { ...prev.contributor, [key]: e.target.value } } : null)}
                          className="w-full px-2 py-1.5 text-[10px] border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400" />
                      )}
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(null)} className="flex-1 py-1.5 text-[9px] font-black bg-stone-100 text-stone-600 rounded-lg">Cancel</button>
                    <button onClick={saveEdit} className="flex-1 py-1.5 text-[9px] font-black bg-indigo-500 text-white rounded-lg"><FaCheck size={8} className="inline mr-1" />Save</button>
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {contributors.length === 0 ? (
                  <div className="text-center py-8 text-stone-400">
                    <FaUserPlus size={24} className="mx-auto mb-2 opacity-30" />
                    <p className="text-[10px] font-bold">No contributors yet</p>
                    <p className="text-[9px] mt-0.5 opacity-60">Upload a file, add manually, or</p>
                    <button onClick={autoApplyRecommended} className="mt-2 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[9px] font-black rounded-lg border border-indigo-200 transition-all">Auto-Apply Recommended</button>
                  </div>
                ) : (
                  contributors.map((c, idx) => (
                    <ContributorCard key={c.id} contributor={c}
                      onRemove={() => removeContributor(c.id)}
                      onEdit={() => setEditing({ idx, contributor: { ...c } })} />
                  ))
                )}
              </div>

              {/* Role coverage pills */}
              {contributors.length > 0 && (
                <div className="px-3 pb-3 pt-2 border-t border-stone-200">
                  <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-1.5">Role Coverage</p>
                  <div className="flex flex-wrap gap-1">
                    {ROLE_GROUPS.map(g => {
                      const count = contributors.filter(c => (g.roles as string[]).includes(c.role)).length;
                      return count > 0 ? (
                        <span key={g.label} className={`px-1.5 py-0.5 rounded-full text-[7px] font-black ${g.bg} ${g.color} border ${g.border}`}>
                          {g.label.split(" ")[0]} ×{count}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-stone-200 bg-stone-50 shrink-0">
            <div className="text-[10px] text-stone-500">
              {contributors.length} contributor{contributors.length !== 1 ? "s" : ""}
              {registry.length > 0 && <span className="ml-2 text-indigo-400">{registry.length} in registry</span>}
            </div>
            <div className="flex gap-2">
              <button onClick={handleClose} className="px-4 py-2 bg-stone-100 text-stone-600 text-[10px] font-black rounded-xl hover:bg-stone-200">Cancel</button>
              <button onClick={handleApply}
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-[10px] font-black rounded-xl hover:opacity-90 shadow-md shadow-indigo-500/20 transition-all">
                <FaCheck size={9} /> Apply Contributors <FaArrowRight size={8} />
              </button>
            </div>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
