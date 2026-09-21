"use client";

import { useState, useEffect, useRef } from "react";
import {
  FaBook, FaPlus, FaSpinner, FaArrowLeft, FaTrash, FaSave, FaFileAlt,
  FaFilter, FaGlobe, FaChevronRight, FaCogs, FaBookOpen,
  FaUserFriends, FaBrain, FaSearch, FaProjectDiagram, FaCheck,
  FaShieldAlt, FaLightbulb, FaLink, FaChevronDown, FaChevronUp,
  FaEye, FaRocket, FaCalendarAlt, FaFileDownload, FaExclamationTriangle,
  FaLayerGroup, FaMagic, FaUpload, FaSort, FaFilePdf, FaFileWord,
  FaFileCode, FaFileArchive, FaCheckCircle, FaTimesCircle, FaClock, FaDownload,
  FaStar, FaArrowRight, FaArrowDown, FaBolt, FaCloudUploadAlt,
} from "react-icons/fa";
import { 
  Wand2, Book as BookIcon, Filter as FilterIcon, Users, Brain as BrainIcon, ShieldCheck, 
  BookOpen as BookOpenIcon, Network, Search as SearchIcon, Lightbulb as LightbulbIcon, Settings2, Rocket as RocketIcon,
  Check as CheckIcon, AlertTriangle,
  ClipboardCheck, SearchCheck, Microscope, ScrollText, BarChart3, BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import Select from "@/components/common/Select";
import ManuscriptImportModal, { ImportedChapter } from "@/components/dashboard/publications/ManuscriptImportModal";
import SmartBulkImportModal from "@/components/dashboard/publications/SmartBulkImportModal";
import BulkMetadataUploadModal, { PublicationIdentityData } from "@/components/dashboard/publications/BulkMetadataUploadModal";
import BulkClassificationModal, { ClassificationData, CRAFT_SECTORS as TAXONOMY_CRAFTS, DOMAIN_FOCUS as TAXONOMY_DOMAINS, AUDIENCE_OPTIONS as TAXONOMY_AUDIENCES } from "@/components/dashboard/publications/BulkClassificationModal";
import ContributorIntelligenceModal, { Contributor, ContributorsData } from "@/components/dashboard/publications/ContributorIntelligenceModal";
import IntelligenceContentEngine, { IntelligenceContent } from "@/components/dashboard/publications/IntelligenceContentEngine";
import CraftAuthorityEngine, { AuthorityData, CraftAuthorityItem } from "@/components/dashboard/publications/CraftAuthorityEngine";
import KnowledgeGraphManager, { GraphNode, KnowledgeGraphData } from "@/components/dashboard/publications/KnowledgeGraphManager";
import AICitationEngine, { AIEngineData } from "@/components/dashboard/publications/AICitationEngine";
import ReaderExperienceEngine, { ReaderEngineData } from "@/components/dashboard/publications/ReaderExperienceEngine";
import PublicationReadinessEngine from "@/components/dashboard/publications/PublicationReadinessEngine";
import BulkIntelligenceUploadModal from "@/components/dashboard/publications/BulkIntelligenceUploadModal";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import { validateSeoSchema, validateAiSchema } from "@/utils/schemaValidator";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Block {
  type: "Heading" | "Paragraph" | "Quote" | "Callout" | "Key Insight" | "Reference" | "Checklist";
  text: string;
}
export interface Subchapter {
  id?: string;
  title: string;
  order: number;
  summary: string;
  content: string;
  type?: "front-matter" | "chapter" | "back-matter";
}
export interface Page {
  id?: string;
  content: string;
  pageNumber: number;
}
export interface Chapter {
  id?: string;
  title: string;
  order: number;
  status: string;
  summary: string;
  pages: Page[];
  subchapters?: Subchapter[];
  sectionType?: "front-matter" | "chapter" | "back-matter";
}
export interface PublicationFormData {
  id?: string;
  title: string;
  subtitle: string;
  author: string;
  price: string;
  pages: string;
  description: string;
  imagePath: string;
  slug: string;
  published: string;
  category: string;
  categoryId: string;
  language: string;
  pdfPath: string;
  type?: "WRITTEN" | "PDF";
  chapters?: Chapter[];
  // Blueprint
  publicationBlueprint?: string;
  // Identity
  series?: string; volume?: string; issue?: string;
  publicationType?: string; publishedStatus?: string;
  edition?: string; isbn?: string; doi?: string; publisher?: string;
  // Classification
  craftSector?: string; multipleCrafts?: string; domain?: string;
  audience?: string; region?: string; country?: string;
  accessType?: string; researchLevel?: string;
  // Contributors
  coAuthor?: string; researchTeam?: string; technicalEditor?: string;
  reviewer?: string; institution?: string; fieldContributor?: string;
  legislativeContributor?: string; industryContributor?: string;
  // Intelligence
  execSummary?: string; keyFindings?: string; methodology?: string;
  objectives?: string; expectedOutcomes?: string; readingTime?: string;
  keywords?: string; highlights?: string;
  // Dynamic Intelligence fields
  problemStatement?: string; bestPracticeHighlights?: string; implementationFramework?: string; keyRecommendations?: string;
  caseBackground?: string; challenge?: string; intervention?: string; results?: string; lessonsLearned?: string; replicability?: string;
  abstract?: string; researchQuestions?: string; conclusions?: string;
  bookOverview?: string; learningObjectives?: string; audienceBenefits?: string; keyTopics?: string;
  policySum?: string; urgencyStatement?: string; evidenceSnapshot?: string; policyRecommendations?: string;
  marketSummary?: string; exportTrends?: string; priceSignals?: string; marketRisks?: string; opportunities?: string; forecasts?: string;
  catalogShort?: string; catalogStandard?: string; catalogExtended?: string;
  // Cover
  coverTemplate?: string; coverBackground?: string;
  hcrfSealPlacement?: string; isbnPlacement?: string;
  brandingTheme?: string; accessBadge?: string; seriesBadge?: string;
  // Reader
  readerTheme?: string; defaultFont?: string; readerWidth?: string;
  citationMode?: string; knowledgeLinksEnabled?: boolean;
  footnotesEnabled?: boolean; references?: string; crossReferences?: string;
  readerEnabled?: boolean; readerPath?: string;
  // Knowledge Graph
  linkedCrafts?: string; linkedPolicies?: string; linkedGIs?: string;
  linkedPapers?: string; linkedCaseStudies?: string; linkedBestPractices?: string;
  linkedLegislativeWork?: string; linkedClusters?: string;
  linkedExportMarkets?: string; linkedAuthentications?: string;
  // SEO
  seoTitle?: string; seoDescription?: string; canonicalUrl?: string;
  seoKeywords?: string; structuredDataType?: string; seoFaq?: string;
  openGraphImage?: string; twitterCardType?: string;
  // AI
  aiSummary?: string; structuredFacts?: any; definitions?: any;
  entitiesMatched?: string; knowledgeNodesList?: string;
  qaPairs?: any; citationSnippets?: string;
  readinessScore?: number;
  // Compat
  isDownloadable?: boolean; previewEnabled?: boolean;
  memberOnlyDownload?: boolean; citationEnabled?: boolean;
  seoEnabled?: boolean; previewContent?: string; fullContent?: string;
  downloadUrl?: string; memberDownloadUrl?: string;
  isPublic?: boolean; isMemberOnly?: boolean;
  // Lifecycle
  publishAt?: string;
  approvedBy?: string;
  publicationVersion?: string;
  approvalNotes?: string;
  approvedAt?: string;
  publishedAt?: string;
  publishedBy?: string;
  nested_state?: any;
}

interface PublicationFormProps {
  initialData?: Partial<PublicationFormData>;
  onSubmit: (data: PublicationFormData, chapters: Chapter[]) => Promise<any>;
  onSaveDraft?: (data: PublicationFormData, chapters: Chapter[]) => Promise<any>;
  onPreviewBook?: (data: PublicationFormData) => void;
  onPreviewPublic?: (data: PublicationFormData) => void;
  /** @deprecated use onPreviewBook or onPreviewPublic */
  onPreview?: (data: PublicationFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
  isAdmin?: boolean;
  publicationId?: string;
}

// ─── Category Configuration ──────────────────────────────────────────────────

const PUBLICATION_BLUEPRINTS: Record<string, {
  label: string;
  purpose: string;
  lengthRange: string;
  format: string;
  schema: string;
  readerMode: string;
  chapterRange: string;
  citationFormat: string;
  publicationType: string;
  color: string;
  icon: any;
  defaultStructure: Array<{ section: string; items: string[]; type: "front-matter" | "chapter" | "back-matter" }>;
  intelligenceFields: string[];
}> = {
  "Best Practices": {
    label: "Best Practices",
    purpose: "Practical guidance and standards",
    lengthRange: "100–160 pages",
    format: "Book / Manual",
    schema: "Book",
    readerMode: "Book View",
    chapterRange: "10–15",
    citationFormat: "APA 7th",
    publicationType: "BEST_PRACTICE",
    color: "bg-amber-600",
    icon: ClipboardCheck,
    defaultStructure: [
      { section: "Front Matter", items: ["Cover Page", "Copyright", "Foreword", "Preface", "Executive Summary"], type: "front-matter" },
      { section: "Main Chapters", items: ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10"], type: "chapter" },
      { section: "Back Matter", items: ["Appendices", "Glossary", "References", "Citation Page"], type: "back-matter" },
    ],
    intelligenceFields: ["execSummary", "problemStatement", "bestPracticeHighlights", "implementationFramework", "keyRecommendations"],
  },
  "Case Studies": {
    label: "Case Studies",
    purpose: "Real-world examples and lessons",
    lengthRange: "40–80 pages",
    format: "Case Study Report",
    schema: "Report / CaseStudy",
    readerMode: "Case Study View",
    chapterRange: "8–12",
    citationFormat: "APA 7th",
    publicationType: "CASE_STUDY",
    color: "bg-indigo-600",
    icon: SearchCheck,
    defaultStructure: [
      { section: "Front Matter", items: ["Cover Page", "Executive Summary", "Case Snapshot"], type: "front-matter" },
      { section: "Case Body", items: ["Background", "Problem", "Stakeholders", "Intervention", "Implementation", "Results", "Challenges", "Lessons Learned", "Replicability"], type: "chapter" },
      { section: "Back Matter", items: ["Evidence Gallery", "Appendices", "References"], type: "back-matter" },
    ],
    intelligenceFields: ["caseBackground", "challenge", "intervention", "results", "lessonsLearned", "replicability"],
  },
  "Research Papers": {
    label: "Research Papers",
    purpose: "Academic and technical research",
    lengthRange: "25–60 pages",
    format: "Research Paper",
    schema: "ScholarlyArticle",
    readerMode: "Research View",
    chapterRange: "6–10",
    citationFormat: "APA 7th",
    publicationType: "RESEARCH_PAPER",
    color: "bg-purple-600",
    icon: Microscope,
    defaultStructure: [
      { section: "Research Paper", items: ["Title Page", "Abstract", "Keywords", "Introduction", "Literature Review", "Research Questions", "Methodology", "Results", "Discussion", "Conclusion", "References", "Appendices"], type: "chapter" },
    ],
    intelligenceFields: ["abstract", "researchQuestions", "methodology", "keyFindings", "conclusions"],
  },
  "E-Publications": {
    label: "E-Publications",
    purpose: "Public-facing educational books",
    lengthRange: "80–200 pages",
    format: "E-book",
    schema: "Book",
    readerMode: "Book View",
    chapterRange: "12–20",
    citationFormat: "MLA 9th",
    publicationType: "EBOOK",
    color: "bg-emerald-600",
    icon: BookOpen,
    defaultStructure: [
      { section: "Front Matter", items: ["Cover Page", "About This Book", "Acknowledgements", "Introduction"], type: "front-matter" },
      { section: "Main Chapters", items: ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10"], type: "chapter" },
      { section: "Back Matter", items: ["FAQ", "Glossary", "Credits", "References", "Further Reading"], type: "back-matter" },
    ],
    intelligenceFields: ["bookOverview", "learningObjectives", "audienceBenefits", "keyTopics"],
  },
  "Policy Briefs": {
    label: "Policy Briefs",
    purpose: "Policy recommendations",
    lengthRange: "8–20 pages",
    format: "Brief / White Paper",
    schema: "GovernmentReport / PolicyPaper",
    readerMode: "Policy View",
    chapterRange: "4–8",
    citationFormat: "Chicago",
    publicationType: "POLICY_BRIEF",
    color: "bg-rose-600",
    icon: ScrollText,
    defaultStructure: [
      { section: "Policy Brief", items: ["Title", "Policy Summary", "Key Message", "Problem Statement", "Evidence Snapshot", "Policy Gap", "Recommendations", "Implementation Pathway", "Expected Outcomes", "References"], type: "chapter" },
    ],
    intelligenceFields: ["policySum", "urgencyStatement", "evidenceSnapshot", "policyRecommendations", "expectedOutcomes"],
  },
  "Market Intelligence": {
    label: "Market Intelligence",
    purpose: "Trade, pricing, exports, demand",
    lengthRange: "30–80 pages",
    format: "Intelligence Report",
    schema: "Report / Dataset",
    readerMode: "Report View",
    chapterRange: "8–14",
    citationFormat: "IEEE",
    publicationType: "MARKET_INTELLIGENCE",
    color: "bg-sky-600",
    icon: BarChart3,
    defaultStructure: [
      { section: "Market Intelligence Report", items: ["Executive Summary", "Market Overview", "Craft Sector Profile", "Demand Analysis", "Export Trends", "Pricing Intelligence", "Buyer Segmentation", "Competitor Analysis", "Risk Assessment", "Opportunity Map", "Strategic Recommendations", "Data Tables", "Appendices", "References"], type: "chapter" },
    ],
    intelligenceFields: ["marketSummary", "exportTrends", "priceSignals", "marketRisks", "opportunities", "forecasts"],
  },
};

// ─── Sections config ─────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "blueprint",      label: "0. Publication Blueprint", icon: Wand2,         color: "text-brand-primary" },
  { id: "identity",       label: "1. Identity",              icon: BookIcon,        color: "text-brand-primary" },
  { id: "classification", label: "2. Classification",        icon: FilterIcon,      color: "text-brand-primary" },
  { id: "contributors",   label: "3. Contributors",          icon: Users,           color: "text-brand-primary" },
  { id: "intelligence",   label: "4. Intelligence Page",     icon: BrainIcon,       color: "text-brand-primary" },
  { id: "crafts",         label: "5. Authority Mapping",     icon: ShieldCheck,     color: "text-brand-primary" },
  { id: "chapters",       label: "6. Manuscript Builder",    icon: BookOpenIcon,    color: "text-brand-primary" },
  { id: "graph",          label: "7. Knowledge Graph",       icon: Network,         color: "text-brand-primary" },
  { id: "seo",            label: "8. SEO Intelligence",      icon: SearchIcon,      color: "text-brand-primary" },
  { id: "ai",             label: "9. AI Optimization",       icon: LightbulbIcon,   color: "text-brand-primary" },
  { id: "reader",         label: "10. Reader Controls",      icon: Settings2,       color: "text-brand-primary" },
  { id: "review",         label: "11. Review & Publish",     icon: RocketIcon,      color: "text-brand-primary" },
];

const CRAFT_OPTIONS = [
  "Pashmina","Kani","Carpet","Papier-Mâché","Walnut Wood",
  "Sozni","Copperware","Chain Stitch","Crewel","Silk","Namdha"
];

// ─── Default form state ──────────────────────────────────────────────────────

const DEFAULT_FORM: PublicationFormData = {
  title: "", subtitle: "", author: "", price: "0", pages: "30",
  description: "", imagePath: "", slug: "", published: new Date().getFullYear().toString(),
  category: "", categoryId: "", language: "English",
  pdfPath: "", type: "WRITTEN",
  publicationBlueprint: "",
  series: "KHCRF Reference Series", volume: "1", issue: "1",
  publicationType: "RESEARCH_PAPER", publishedStatus: "DRAFT",
  edition: "1st Edition", isbn: "", doi: "", publisher: "KHCRF Heritage Press",
  craftSector: "Pashmina", multipleCrafts: "", domain: "Authentication",
  audience: "Researchers & Policymakers", region: "Kashmir", country: "India",
  accessType: "PUBLIC", researchLevel: "Peer-Reviewed",
  coAuthor: "", researchTeam: "", technicalEditor: "", reviewer: "",
  institution: "", fieldContributor: "", legislativeContributor: "", industryContributor: "",
  execSummary: "", keyFindings: "", methodology: "",
  objectives: "", expectedOutcomes: "", readingTime: "15 mins",
  keywords: "Kashmir, Pashmina, GI Protection", highlights: "",
  problemStatement: "", bestPracticeHighlights: "", implementationFramework: "", keyRecommendations: "",
  caseBackground: "", challenge: "", intervention: "", results: "", lessonsLearned: "", replicability: "",
  abstract: "", researchQuestions: "", conclusions: "",
  bookOverview: "", learningObjectives: "", audienceBenefits: "", keyTopics: "",
  policySum: "", urgencyStatement: "", evidenceSnapshot: "", policyRecommendations: "",
  marketSummary: "", exportTrends: "", priceSignals: "", marketRisks: "", opportunities: "", forecasts: "",
  coverTemplate: "Scholarly Monograph", coverBackground: "Parchment Cream",
  hcrfSealPlacement: "Top Center", isbnPlacement: "Bottom Right",
  brandingTheme: "Warm Heritage", accessBadge: "Open Access",
  seriesBadge: "KHCRF Reference Library",
  readerTheme: "Warm", defaultFont: "IBMPlexSerif",
  readerWidth: "820px", citationMode: "APA 7th",
  knowledgeLinksEnabled: true, footnotesEnabled: true,
  references: "", crossReferences: "",
  linkedCrafts: "", linkedPolicies: "", linkedGIs: "",
  linkedPapers: "", linkedCaseStudies: "", linkedBestPractices: "",
  linkedLegislativeWork: "", linkedClusters: "",
  linkedExportMarkets: "", linkedAuthentications: "",
  seoTitle: "", seoDescription: "", canonicalUrl: "",
  seoKeywords: "", structuredDataType: "ResearchPaper",
  seoFaq: "", openGraphImage: "", twitterCardType: "summary_large_image",
  aiSummary: "", structuredFacts: "", definitions: "",
  entitiesMatched: "", knowledgeNodesList: "",
  qaPairs: JSON.stringify([{ q: "", a: "" }]), citationSnippets: "",
  isDownloadable: true, previewEnabled: true, memberOnlyDownload: false, citationEnabled: false,
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function PublicationForm({
  initialData, onSubmit, onSaveDraft, onPreviewBook, onPreviewPublic, onPreview,
  onCancel, isEditing = false, isAdmin = false, publicationId
}: PublicationFormProps) {
  const [activeSection, setActiveSection] = useState("blueprint");
  const [loading, setLoading] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [formData, setFormData] = useState<PublicationFormData>({ ...DEFAULT_FORM });
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [activeSubIdx, setActiveSubIdx] = useState<number | null>(null);
  const [selectedCrafts, setSelectedCrafts] = useState<string[]>([]);
  const [qaPairs, setQaPairs] = useState<{ q: string; a: string }[]>([{ q: "", a: "" }]);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [bulkChapterCount, setBulkChapterCount] = useState(5);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importMode, setImportMode] = useState<"docx" | "pdf" | "markdown" | "zip" | "csv" | "bulk">("bulk");
  const [showBulkMetadata, setShowBulkMetadata] = useState(false);
  const [showBulkIntelligence, setShowBulkIntelligence] = useState(false);
  const [showBulkClassification, setShowBulkClassification] = useState(false);
  const [showContributorModal, setShowContributorModal] = useState(false);
  const [contributorsList, setContributorsList] = useState<Contributor[]>([]);
  const [showKGManager, setShowKGManager] = useState(false);
  const [kgNodes, setKgNodes] = useState<GraphNode[]>([]);
  const [craftAuthorityData, setCraftAuthorityData] = useState<AuthorityData | null>(null);
  const [showSmartImport, setShowSmartImport] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [publishLoading, setPublishLoading] = useState(false);
  const [sectionErrors, setSectionErrors] = useState<Record<string, string[]>>({});
  const mainRef = useRef<HTMLDivElement>(null);

  const blueprint = formData.publicationBlueprint ? PUBLICATION_BLUEPRINTS[formData.publicationBlueprint] : null;

  const latestChaptersRef = useRef(chapters);
  const hasAutoInitialized = useRef(false);
  useEffect(() => {
    if (activeSection === "writer" && publicationId && chapters.length === 0 && !hasAutoInitialized.current && !loading) {
        hasAutoInitialized.current = true;
        const autoInit = async () => {
            const activeBpKey = formData.publicationBlueprint || formData.category || "";
            setLoading(true);
            try {
                const res = await api.post(`/publications/${publicationId}/manuscript/initialize`, {
                    blueprintKey: activeBpKey
                });
                const payload = res.data?.data || res.data;
                if (payload && payload.chapters) {
                    const newChapters = payload.chapters.map((ch: any) => ({
                        id: ch.id, title: ch.title, order: ch.order,
                        status: ch.status || "DRAFT", summary: ch.summary || "",
                        sectionType: ch.sectionType || "chapter",
                        pages: ch.pages && ch.pages.length > 0 ? ch.pages.map((p: any) => ({
                            id: p.id,
                            content: typeof p.content === "string" ? p.content : JSON.stringify(p.content ?? []),
                            pageNumber: p.pageNumber,
                        })) : [{ content: JSON.stringify([{ type: "Paragraph", text: "" }]), pageNumber: 1 }],
                        subchapters: ch.subchapters || []
                    }));
                    setChapters(newChapters);
                    toast.success("? Blueprint chapters initialized");
                }
            } catch (err: any) {
                if (err.response?.status !== 400) {
                    toast.error("Failed to auto-initialize chapters.");
                }
            } finally {
                setLoading(false);
            }
        };
        autoInit();
    }
  }, [activeSection, publicationId, chapters.length, formData.publicationBlueprint, formData.category, loading]);
  useEffect(() => {
    latestChaptersRef.current = chapters;
  }, [chapters]);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
      if (initialData.chapters?.length) setChapters(initialData.chapters);
      if (initialData.multipleCrafts) {
        setSelectedCrafts(initialData.multipleCrafts.split(",").map(s => s.trim()).filter(Boolean));
      }
      if (initialData.qaPairs) {
        try { setQaPairs(JSON.parse(initialData.qaPairs)); } catch { }
      }
      // If editing, mark blueprint as done if blueprint set
      if (initialData.publicationBlueprint) {
        setCompletedSections(prev => new Set([...prev, "blueprint"]));
      }
      if ((initialData as any).knowledge_graph) {
        let loadedNodes = (initialData as any).knowledge_graph;
        if (typeof loadedNodes === 'string') {
          try { loadedNodes = JSON.parse(loadedNodes); } catch {}
        }
        setKgNodes(Array.isArray(loadedNodes) ? loadedNodes : []);
      } else if (initialData.knowledgeNodesList) {
        const nodesList = typeof initialData.knowledgeNodesList === 'string' 
          ? initialData.knowledgeNodesList.split(',').map((s: string) => s.trim()).filter(Boolean)
          : [];
        setKgNodes(nodesList.map((name: string, i: number) => ({
          id: `legacy_${i}`,
          entityType: "Craft",
          name,
          relationship: "Related To"
        })));
      }
    }
  }, [initialData]);

  const hc = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (!formData.slug && name === "title") {
      setFormData(prev => ({ ...prev, title: value, slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleCraft = (craft: string) => {
    setSelectedCrafts(prev => {
      const next = prev.includes(craft) ? prev.filter(c => c !== craft) : [...prev, craft];
      setFormData(fd => ({ ...fd, multipleCrafts: next.join(", ") }));
      return next;
    });
  };

  // ─── Chapter operations ──────────────────────────────────────────────────

  const addChapter = (title?: string, type: Chapter["sectionType"] = "chapter") => {
    const n: Chapter = {
      title: title || `Chapter ${chapters.filter(c => c.sectionType === "chapter").length + 1}`,
      order: chapters.length + 1, status: "DRAFT", summary: "",
      pages: [{ content: JSON.stringify([{ type: "Paragraph", text: "" }]), pageNumber: 1 }],
      subchapters: [],
      sectionType: type,
    };
    setChapters(prev => [...prev, n]);
    setActiveChapterIdx(chapters.length);
    setActiveSubIdx(null);
  };

  useEffect(() => {
    // DOCUMENT CLICK TRACER
    const handler = (e: any) => {
      console.log("DOCUMENT CLICK", e.target);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const generateStructure = () => {
    // Determine active blueprint: from explicit selection OR category field
    const activeBp = blueprint
      ?? (formData.category ? PUBLICATION_BLUEPRINTS[formData.category] ?? null : null);

    let newChapters: Chapter[];
    let order = 1;

    if (activeBp) {
      // Blueprint-aware: use the full defaultStructure
      newChapters = activeBp.defaultStructure.flatMap(section =>
        section.items.map(item => ({
          title: item,
          order: order++,
          status: "DRAFT" as const,
          summary: "",
          pages: [{ content: JSON.stringify([{ type: "Paragraph", text: "" }]), pageNumber: 1 }],
          subchapters: [],
          sectionType: section.type,
        }))
      );
    } else {
      // Generic fallback when no blueprint or category is selected yet
      const generic: Array<{ title: string; sectionType: "front-matter" | "chapter" | "back-matter" }> = [
        { title: "Cover Page",        sectionType: "front-matter" },
        { title: "Foreword",          sectionType: "front-matter" },
        { title: "Preface",           sectionType: "front-matter" },
        { title: "Executive Summary", sectionType: "front-matter" },
        { title: "Chapter 1",         sectionType: "chapter" },
        { title: "Chapter 2",         sectionType: "chapter" },
        { title: "Chapter 3",         sectionType: "chapter" },
        { title: "Chapter 4",         sectionType: "chapter" },
        { title: "Chapter 5",         sectionType: "chapter" },
        { title: "Appendices",        sectionType: "back-matter" },
        { title: "Glossary",          sectionType: "back-matter" },
        { title: "References",        sectionType: "back-matter" },
      ];
      newChapters = generic.map((g, i) => ({
        title: g.title,
        order: i + 1,
        status: "DRAFT" as const,
        summary: "",
        pages: [{ content: JSON.stringify([{ type: "Paragraph", text: "" }]), pageNumber: 1 }],
        subchapters: [],
        sectionType: g.sectionType,
      }));
      toast(
        "No blueprint selected — generated a generic 12-section structure. Select a blueprint in Step 0 for a category-specific layout.",
        { icon: "💡", duration: 5000 }
      );
    }

    // Confirm before replacing existing chapters
    if (chapters.length > 0) {
      const confirmed = window.confirm(
        `This will replace your ${chapters.length} existing section${chapters.length !== 1 ? "s" : ""} with the "${
          activeBp?.label ?? "Generic"
        }" template (${newChapters.length} sections).\n\nContinue?`
      );
      if (!confirmed) return;
    }

    setChapters(newChapters);
    setActiveChapterIdx(0);
    setActiveSubIdx(null);

    if (activeBp) {
      toast.success(`\u2713 Generated ${newChapters.length} sections from the "${activeBp.label}" blueprint`);
    }
  };

  const autoGenerateChapters = (count: number) => {
    const base = chapters.filter(c => c.sectionType !== "chapter");
    const newOnes: Chapter[] = Array.from({ length: count }, (_, i) => ({
      title: `Chapter ${i + 1}`,
      order: base.length + i + 1,
      status: "DRAFT",
      summary: "",
      pages: [{ content: JSON.stringify([{ type: "Paragraph", text: "" }]), pageNumber: 1 }],
      subchapters: [],
      sectionType: "chapter" as const,
    }));
    setChapters(prev => [...prev.filter(c => c.sectionType !== "chapter"), ...newOnes]);
  };

  const addSubchapter = (chIdx: number) => {
    const subs = chapters[chIdx]?.subchapters || [];
    const s: Subchapter = {
      title: `${chIdx + 1}.${subs.length + 1} Subheading`,
      order: subs.length + 1, summary: "",
      content: JSON.stringify([{ type: "Paragraph", text: "" }]),
    };
    setChapters(prev => prev.map((c, i) => i === chIdx ? { ...c, subchapters: [...(c.subchapters || []), s] } : c));
    setActiveChapterIdx(chIdx);
    setActiveSubIdx(subs.length);
  };

  const deleteChapter = (idx: number) => {
    setChapters(prev => prev.filter((_, i) => i !== idx));
    if (activeChapterIdx >= idx && activeChapterIdx > 0) setActiveChapterIdx(prev => prev - 1);
  };

  const getBlocks = (): Block[] => {
    try {
      if (activeSubIdx !== null) {
        return JSON.parse(chapters[activeChapterIdx]?.subchapters?.[activeSubIdx]?.content || "[]");
      }
      return JSON.parse(chapters[activeChapterIdx]?.pages?.[0]?.content || "[]");
    } catch { return []; }
  };

  const setBlocks = (blocks: Block[]) => {
    const str = JSON.stringify(blocks);
    setChapters(prev => {
      const updated = prev.map((ch, i) => {
        if (i !== activeChapterIdx) return ch;
        if (activeSubIdx !== null) {
          return { ...ch, subchapters: ch.subchapters?.map((s, j) => j === activeSubIdx ? { ...s, content: str } : s) };
        }
        return { ...ch, pages: ch.pages.map((p, j) => j === 0 ? { ...p, content: str } : p) };
      });
      console.log("CHAPTER STATE UPDATE", updated);
      return updated;
    });
  };

  const addBlock = (type: Block["type"]) => setBlocks([...getBlocks(), { type, text: "" }]);
  const editBlock = (idx: number, text: string) => {
    const b = [...getBlocks()]; b[idx].text = text; setBlocks(b);
  };
  const removeBlock = (idx: number) => setBlocks(getBlocks().filter((_, i) => i !== idx));

  // ─── Section completion logic ────────────────────────────────────────────

  const sectionDone: Record<string, boolean> = {
    blueprint: !!formData.publicationBlueprint,
    identity: !!(formData.title && formData.publisher),
    classification: !!(formData.craftSector && formData.domain && formData.audience),
    contributors: !!formData.author,
    intelligence: !!(formData.execSummary || formData.abstract || formData.policySum || formData.marketSummary || formData.caseBackground || formData.bookOverview),
    crafts: selectedCrafts.length > 0 || !!formData.craftSector,
    chapters: chapters.length > 0,
    graph: !!(formData.linkedCrafts || formData.linkedPolicies),
    seo: !!(formData.seoTitle && formData.seoDescription),
    ai: !!(formData.aiSummary && formData.entitiesMatched),
    reader: true,
    review: false,
  };

  const completionScore = Math.round(
    (Object.entries(sectionDone).filter(([k, v]) => k !== "review" && v).length / (SECTIONS.length - 1)) * 100
  );

  // Section status
  const getSectionStatus = (sectionId: string): "done" | "in-progress" | "not-started" | "needs-review" => {
    if (sectionId === "review") return "not-started";
    if (sectionDone[sectionId]) return "done";
    if (completedSections.has(sectionId) && !sectionDone[sectionId]) return "needs-review";
    if (sectionId === activeSection) return "in-progress";
    return "not-started";
  };

  // ─── Navigation ──────────────────────────────────────────────────────────

  const sectionIds = SECTIONS.map(s => s.id);

  const goTo = (id: string) => {
    setActiveSection(id);
    if (mainRef.current) mainRef.current.scrollTop = 0;
  };

  const goPrev = () => {
    const idx = sectionIds.indexOf(activeSection);
    if (idx > 0) goTo(sectionIds[idx - 1]);
  };

  const goNext = () => {
    setCompletedSections(prev => new Set([...prev, activeSection]));
    const idx = sectionIds.indexOf(activeSection);
    if (idx < sectionIds.length - 1) goTo(sectionIds[idx + 1]);
  };

  // ─── Submit handlers ─────────────────────────────────────────────────────

  /** Auto-derive a slug from the title if the user hasn't set one */
  const ensureSlug = (): string => {
    if (formData.slug) return formData.slug;
    const derived = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 80);
    setFormData(prev => ({ ...prev, slug: derived }));
    return derived;
  };

  /** Pre-flight validation. Returns null if OK, or an error message string. */
  const validate = (status: string): string | null => {
    const missing: string[] = [];
    if (!formData.title) missing.push("Title");
    
    // Only strictly require author and slug if publishing or reviewing
    if (status !== "DRAFT") {
      if (!formData.author) missing.push("Author");
      const slug = formData.slug || ensureSlug();
      if (!slug) missing.push("URL Slug");
    }
    
    if (status === "PUBLISHED" && !formData.imagePath) missing.push("Cover Image (required to publish)");
    if (missing.length) return `Missing required fields: ${missing.join(", ")}`;
    return null;
  };

  const buildPayload = (status?: string) => {
    const payload = {
      ...formData,
      slug: formData.slug || ensureSlug(),
      price: formData.price || "0",
      multipleCrafts: selectedCrafts.join(", "),
      qaPairs: JSON.stringify(qaPairs),
      type: "WRITTEN" as const,
      ...(status ? { publishedStatus: status } : {}),
      
      // Inject nested payload structure requested for validation
      nested_state: {
        publication_title: formData.title,
        publication_type: formData.publicationType,
        publication_year: formData.published,
        publisher_name: formData.publisher,
        language: formData.language,
        publish_status: status || formData.publishedStatus,
        url_slug: formData.slug || ensureSlug(),
        blueprint: formData.publicationBlueprint,
        metadata: formData,
        classification: { craftSector: formData.craftSector, domain: formData.domain },
        contributors: contributorsList,
        intelligence: { execSummary: formData.execSummary, keyFindings: formData.keyFindings },
        authority_mapping: craftAuthorityData,
        knowledge_graph: kgNodes,
        seo: { seoTitle: formData.seoTitle, seoDescription: formData.seoDescription },
        ai_optimization: { aiSummary: formData.aiSummary, qaPairs },
        reader_controls: { readerTheme: formData.readerTheme, defaultFont: formData.defaultFont }
      }
    };
    
    console.log("PublicationForm save payload:", payload);
    return payload;
  };


  // ─── Import handler ─────────────────────────────────────────────────────────
  // Called by SmartBulkImportModal with UPDATE operations — never creates duplicate nodes
  const handleChapterUpdates = (updates: Array<{
    chapterIndex: number; chapterId?: string; title: string; content: string; summary: string; sourceFile: string;
  }>) => {
    setChapters(prev => {
      const next = [...prev];
      let firstUpdatedIdx = -1;
      for (const upd of updates) {
        const idx = upd.chapterIndex;
        if (idx < 0 || idx >= next.length) continue;
        if (firstUpdatedIdx === -1) firstUpdatedIdx = idx;
        next[idx] = {
          ...next[idx],
          summary: upd.summary || next[idx].summary,
          status: "DRAFT",
          pages: [{ ...next[idx].pages[0], content: upd.content, pageNumber: 1 }],
        };
      }
      if (firstUpdatedIdx >= 0) {
        setActiveChapterIdx(firstUpdatedIdx);
        setActiveSubIdx(null);
      }
      return next;
    });
    toast.success(`✓ ${updates.length} section${updates.length !== 1 ? "s" : ""} updated from uploaded files`);
  };

  // Called by ManuscriptImportModal (format-specific import) — appends new chapters
  const handleImportChapters = (imported: ImportedChapter[]) => {
    const newChapters: Chapter[] = imported.map((ic, i) => ({
      title: ic.title,
      order: chapters.length + i + 1,
      status: "DRAFT",
      summary: ic.summary || "",
      pages: [{ content: ic.content, pageNumber: 1 }],
      subchapters: [],
      sectionType: ic.sectionType,
    }));
    const combined = [...chapters, ...newChapters];
    const sorted = [
      ...combined.filter(c => c.sectionType === "front-matter"),
      ...combined.filter(c => c.sectionType === "chapter" || !c.sectionType),
      ...combined.filter(c => c.sectionType === "back-matter"),
    ].map((c, i) => ({ ...c, order: i + 1 }));
    setChapters(sorted);
    setActiveChapterIdx(chapters.length);
    setActiveSubIdx(null);
  };

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const isSavingRef = useRef(false);

  useEffect(() => {
    console.log("SAVE STATUS CHANGED", saveStatus);
  }, [saveStatus]);

  const handleSaveDraft = async () => {
    console.log("NORMAL SAVE DRAFT CLICKED");
    if (isSavingRef.current) {
      toast.error("Save already in progress. Please wait.");
      return;
    }
    
    const currentChapters = latestChaptersRef.current;
    
    // FORENSIC LOGS REQUESTED BY USER
    console.log("EDITOR CURRENT VALUE", JSON.stringify(getBlocks()));
    console.log("CHAPTER STATE VALUE", currentChapters[activeChapterIdx]?.pages?.[0]?.content);
    
    console.log("CURRENT CHAPTERS STATE", currentChapters);
    console.log("CURRENT FORM DATA", formData);
    
    const err = validate("DRAFT");
    if (err) { 
      console.log("VALIDATION FAILED:", err);
      toast.error(err); 
      return; 
    }
    
    setDraftLoading(true);
    isSavingRef.current = true;
    console.log("SETTING STATUS -> saving");
    setSaveStatus("saving");
    const payload = buildPayload("DRAFT");
    console.log("NORMAL SAVE PAYLOAD", payload);

    try {
      let response;
      if (onSaveDraft) {
        response = await onSaveDraft(payload, currentChapters);
      } else {
        response = await onSubmit(payload, currentChapters);
      }
      console.log("NORMAL SAVE RESPONSE", response);


      if (response && response.updatedChapters) {
        setChapters(response.updatedChapters);
        latestChaptersRef.current = response.updatedChapters;
      }

      console.log("SETTING STATUS -> saved");
      setSaveStatus("saved");
      setLastSavedAt(new Date().toLocaleTimeString());
    } catch (error) { 
      console.log("SETTING STATUS -> error");
      setSaveStatus("error");
      console.error("NORMAL SAVE FAILED", error);
    } finally { 
      setDraftLoading(false); 
      isSavingRef.current = false;
    }
  };

  const handlePublishNow = async () => {
    if (isSavingRef.current) {
      toast.error("Save already in progress. Please wait.");
      return;
    }
    if (!publicationId) {
      toast.error("Save draft before publishing");
      return;
    }
    const err = validate("PUBLISHED");
    if (err) { toast.error(err); return; }
    setPublishLoading(true);
    isSavingRef.current = true;
    try {
      const payload = {
        publish_status: "PUBLISHED",
        published_by: formData.approvedBy || "Manager Name",
        publication_version: formData.publicationVersion || "v1.0",
        public_slug: formData.slug,
        access_tier: formData.accessType || "PUBLIC",
        visibility: formData.isPublic ? "Public" : "Private",
        reader_access: formData.previewContent ? "Enabled" : "Disabled",
        download_access: formData.isDownloadable ? "Allowed" : "Blocked"
      };
      
      const response = await api.patch(`/publications/${publicationId}/publish`, payload);
      toast.success("Publication Published Successfully");
      setFormData(prev => ({
        ...prev,
        publishedStatus: "PUBLISHED",
        publishedAt: new Date().toISOString(),
        publishedBy: payload.published_by,
        publicationVersion: payload.publication_version
      }));
    } catch (e: any) { 
      console.error(e);
      toast.error(e.response?.data?.error || "Publishing failed"); 
    }
    finally { 
      setPublishLoading(false); 
      isSavingRef.current = false;
    }
  };

  const handleApprove = async (approvedBy: string, version: string, notes: string) => {
    if (isSavingRef.current) {
      toast.error("Save already in progress. Please wait.");
      return;
    }
    if (!publicationId) {
      toast.error("Save draft before approving");
      return;
    }
    setLoading(true);
    isSavingRef.current = true;
    try {
      const payload = {
        approved_by: approvedBy,
        approval_notes: notes,
        approval_status: "approved",
        publication_version: version,
        readiness_score: formData.readinessScore || 0
      };
      
      const response = await api.patch(`/publications/${publicationId}/approve`, payload);
      toast.success("Publication Approved");
      setFormData(prev => ({
        ...prev,
        publishedStatus: "APPROVED",
        approvedBy,
        publicationVersion: version,
        approvalNotes: notes,
        approvedAt: new Date().toISOString()
      }));
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.error || "Approval failed");
    } finally {
      setLoading(false);
      isSavingRef.current = false;
    }
  };

  const handleSubmitReview = async () => {
    if (isSavingRef.current) {
      toast.error("Save already in progress. Please wait.");
      return;
    }
    const err = validate("UNDER_REVIEW");
    if (err) { toast.error(err); return; }
    setLoading(true);
    isSavingRef.current = true;
    try {
      await onSubmit(buildPayload("UNDER_REVIEW"), latestChaptersRef.current);
      setFormData(prev => ({ ...prev, publishedStatus: "UNDER_REVIEW" }));
    } catch (e) { console.error(e); }
    finally { 
      setLoading(false); 
      isSavingRef.current = false;
    }
  };

  const handleSchedule = async () => {
    if (!publicationId) {
      toast.error("Save draft before scheduling");
      return;
    }
    const err = validate("SCHEDULED");
    if (err) { toast.error(err); return; }
    
    // Ensure scheduleDate is in the future
    const selectedDate = new Date(scheduleDate);
    if (selectedDate <= new Date()) {
      toast.error("Select a future date and time");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        scheduled_publish_at: selectedDate.toISOString(),
        publish_status: "SCHEDULED"
      };
      console.log("schedule publicationId", publicationId);
      console.log("selectedDateTime", selectedDate.toISOString());
      console.log("schedule payload", payload);
      
      const response = await api.patch(`/publications/${publicationId}/schedule`, payload);
      console.log("schedule response", response.data);
      
      toast.success("Publication Scheduled");
      // Update local state to reflect it's scheduled
      setFormData(prev => ({ ...prev, publishedStatus: "SCHEDULED", publishAt: selectedDate.toISOString() }));
    } catch (e: any) { 
      console.error(e);
      toast.error(e.response?.data?.error || "Scheduled publish failed"); 
    }
    finally { setLoading(false); setShowScheduleModal(false); }
  };

  // ─── Apply bulk-uploaded identity metadata ──────────────────────────────────
  const handleApplyMetadata = (data: PublicationIdentityData) => {
    setFormData(prev => {
      const next = { ...prev };
      if (data.title)           next.title = data.title;
      if (data.subtitle)        next.subtitle = data.subtitle;
      if (data.series)          next.series = data.series;
      if (data.volume)          next.volume = data.volume;
      if (data.issue)           next.issue = data.issue;
      if (data.isbn)            next.isbn = data.isbn;
      if (data.doi)             next.doi = data.doi;
      if (data.publisher)       next.publisher = data.publisher;
      if (data.edition)         next.edition = data.edition;
      if (data.publicationType) next.publicationType = data.publicationType as any;
      if (data.publishedStatus) next.publishedStatus = data.publishedStatus;
      if (data.language)        next.language = data.language;
      if (data.published)       next.published = data.published;
      if (data.slug)            next.slug = data.slug;
      // Auto-generate slug if not provided but title exists
      if (!data.slug && data.title && !next.slug) {
        next.slug = data.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-")
          .slice(0, 80);
      }
      return next;
    });
  };

  // ─── Apply bulk classification data ───────────────────────────────────
  const handleApplyClassification = (data: ClassificationData) => {
    setFormData(prev => {
      const next = { ...prev };
      if (data.category)      next.category = data.category;
      if (data.craftSector)   next.craftSector = data.craftSector;
      if (data.domain)        next.domain = data.domain;
      if (data.accessType)    next.accessType = data.accessType;
      if (data.audience)      next.audience = data.audience;
      if (data.region)        next.region = data.region;
      if (data.country)       next.country = data.country;
      if (data.researchLevel) next.researchLevel = data.researchLevel;
      if (data.price)         next.price = data.price;
      if (data.pages)         next.pages = data.pages;
      if (data.readingTime)   next.readingTime = `${data.readingTime} mins`;
      if (data.language)      next.language = data.language;
      return next;
    });
  };

  const handleApplyContributors = (data: ContributorsData, list: Contributor[]) => {
    setContributorsList(list);
    setFormData(prev => ({
      ...prev,
      author: data.author || "",
      coAuthor: data.coAuthor || "",
      institution: data.institution || "",
      researchTeam: data.researchTeam || "",
      technicalEditor: data.technicalEditor || "",
      reviewer: data.reviewer || "",
      fieldContributor: data.fieldContributor || "",
      legislativeContributor: data.legislativeContributor || "",
      industryContributor: data.industryContributor || "",
    }));
  };

  // ─── Apply Intelligence Content Engine ──────────────────────────────────
  const handleApplyIntelligence = (content: IntelligenceContent) => {
    setFormData(prev => {
      const next = { ...prev };
      const map: Record<string, keyof typeof prev> = {
        execSummary: "execSummary", problemStatement: "problemStatement",
        bestPracticeHighlights: "bestPracticeHighlights", implementationFramework: "implementationFramework",
        keyRecommendations: "keyRecommendations", keywords: "keywords", 
        topHighlight: "highlights", description: "description", abstract: "abstract",
        catalogShort: "catalogShort", catalogStandard: "catalogStandard", catalogExtended: "catalogExtended",
        methodology: "methodology", keyFindings: "keyFindings",
        conclusions: "conclusions", caseBackground: "caseBackground",
        challenge: "challenge", intervention: "intervention",
        results: "results", lessonsLearned: "lessonsLearned",
        replicability: "replicability", policySum: "policySum",
        urgencyStatement: "urgencyStatement", evidenceSnapshot: "evidenceSnapshot",
        policyRecommendations: "policyRecommendations", expectedOutcomes: "expectedOutcomes",
        marketSummary: "marketSummary", exportTrends: "exportTrends",
        priceSignals: "priceSignals", marketRisks: "marketRisks",
        opportunities: "opportunities", forecasts: "forecasts",
        bookOverview: "bookOverview", learningObjectives: "learningObjectives",
        audienceBenefits: "audienceBenefits", keyTopics: "keyTopics",
      };
      Object.entries(map).forEach(([src, dest]) => {
        const val = (content as any)[src];
        if (val) (next as any)[dest] = val;
      });
      return next;
    });
  };

  // ─── Apply Craft Authority data ────────────────────────────────────
  const handleApplyAuthority = (data: AuthorityData) => {
    setCraftAuthorityData(data);
    setFormData(prev => ({
      ...prev,
      coverTemplate: data.coverTemplate ?? prev.coverTemplate,
      brandingTheme: data.brandingTheme ?? prev.brandingTheme,
      seriesBadge: data.seriesBadge ?? prev.seriesBadge,
    }));
    if (data.linkedCrafts) {
      const crafts = data.craftAuthority?.map(c => c.craft) ?? data.linkedCrafts.split(", ");
      setSelectedCrafts(crafts);
    }
  };

  // ─── Apply Knowledge Graph data ──────────────────────────────────────
  const handleApplyKG = (data: KnowledgeGraphData) => {
    setKgNodes(data.nodes);
    setFormData(prev => ({
      ...prev,
      linkedCrafts: data.linkedCrafts ?? prev.linkedCrafts,
      linkedPolicies: data.linkedPolicies ?? (prev as any).linkedPolicies,
      linkedGIs: data.linkedGIs ?? (prev as any).linkedGIs,
      linkedClusters: data.linkedClusters ?? (prev as any).linkedClusters,
      linkedAuthentications: data.linkedAuthentications ?? (prev as any).linkedAuthentications,
      linkedExportMarkets: data.linkedExportMarkets ?? (prev as any).linkedExportMarkets,
      linkedPapers: data.linkedPapers ?? (prev as any).linkedPapers,
      linkedCaseStudies: data.linkedCaseStudies ?? (prev as any).linkedCaseStudies,
      linkedBestPractices: data.linkedBestPractices ?? (prev as any).linkedBestPractices,
      linkedLegislativeWork: data.linkedLegislativeWork ?? (prev as any).linkedLegislativeWork,
    }));
  };

  const handleApplyAI = (data: AIEngineData) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleApplyReader = (data: ReaderEngineData) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handlePreviewBook = () => {
    if (onPreviewBook) onPreviewBook(formData);
    else if (onPreview) onPreview(formData);
    else toast.error("Save as Draft first to unlock Preview Full Book");
  };

  const handlePreviewPublic = () => {
    if (onPreviewPublic) onPreviewPublic(formData);
    else if (onPreview) onPreview(formData);
    else toast.error("Save as Draft first to unlock Preview Public Page");
  };

  /** @deprecated single preview — kept for backward compat */
  const handlePreview = handlePreviewBook;

  // ─── Test Automation ──────────────────────────────────────────────────────
  const [testResults, setTestResults] = useState<any>(null);

  const runSavePersistenceTest = async () => {
    setTestResults({ status: "running" });
    setSaveStatus("saving");
    try {
      // 1. & 2. Construct simulated state
      const testPayload = {
        ...buildPayload("DRAFT"),
        title: "Test Pashmina Draft",
        nested_state: {
          ...buildPayload("DRAFT").nested_state,
          publication_title: "Test Pashmina Draft"
        }
      };
      
      const testChapters = [{
        id: "",
        title: "Test Chapter",
        order: 1,
        status: "DRAFT",
        summary: "",
        sectionType: "chapter" as const,
        pages: [{
          pageNumber: 1,
          content: JSON.stringify([
            { type: "Heading", text: "Test Chapter" },
            { type: "Paragraph", text: "This is a test chapter." }
          ])
        }]
      }];

      // 3. & 4. & 5. Call onSaveDraft
      let pubId = null;
      if (onSaveDraft) {
        pubId = await onSaveDraft(testPayload, testChapters);
      } else {
        pubId = await onSubmit(testPayload, testChapters);
      }

      if (!pubId) throw new Error("No publicationId returned from save");

      setSaveStatus("saved");
      setLastSavedAt(new Date().toLocaleTimeString());

      // 6. GET /publications/:id
      const getResponse = await api.get(`/publications/${pubId}`);
      const pub = getResponse.data;

      console.log("SAVE TEST GET RESPONSE", pub);

      // 7. Re-run hydration mapping locally
      const normalizeChaptersForUI = (backendChapters: any[]) => {
        return backendChapters
          .map((ch: any) => {
            let finalPages = [{ content: JSON.stringify([{ type: "Paragraph", text: "" }]), pageNumber: 1 }];
            if (ch.pages && ch.pages.length > 0) {
              finalPages = ch.pages.map((p: any) => ({
                id: p.id,
                content: p.content,
                pageNumber: p.pageNumber,
              }));
            } else if (ch.content || ch.blocks) {
              finalPages = [{
                content: ch.content || JSON.stringify(ch.blocks || [{ type: "Paragraph", text: "" }]),
                pageNumber: 1,
              }];
            }

            return {
              id: ch.id,
              title: ch.title,
              order: ch.order,
              status: ch.status || "DRAFT",
              summary: ch.summary || "",
              sectionType: ch.sectionType || "chapter",
              pages: finalPages,
              subchapters: ch.subchapters || [],
            };
          })
          .sort((a: any, b: any) => a.order - b.order);
      };

      const extractedChapters = pub.chapters ? normalizeChaptersForUI(pub.chapters) : [];
      console.log("EXTRACTED CHAPTERS FOR HYDRATION", extractedChapters);
      
      const hydratedState = {
        title: pub.title || pub.metadata?.publication_title || "",
        chapters: extractedChapters
      };
      
      console.log("SAVE TEST HYDRATED STATE", hydratedState);

      // 8. Verify Hydration
      const titleMatch = hydratedState.title.includes("Test Pashmina Draft");
      const hasChapters = hydratedState.chapters.length > 0;
      
      let hasBlocks = false;
      if (hasChapters) {
        const firstPageContent = hydratedState.chapters[0].pages[0]?.content;
        const stringContent = typeof firstPageContent === "string" ? firstPageContent : JSON.stringify(firstPageContent);
        hasBlocks = stringContent.includes("This is a test chapter.");
      }

      setTestResults({
        status: "done",
        postPass: true,
        publicationId: pubId,
        chapterPass: hasChapters,
        getPass: true,
        hydrationPass: titleMatch && hasBlocks,
        finalPass: titleMatch && hasChapters && hasBlocks,
        error: null
      });

    } catch (e: any) {
      console.error("SAVE TEST EXCEPTION:", e);
      setTestResults({
        status: "done",
        postPass: false,
        publicationId: null,
        chapterPass: false,
        getPass: false,
        hydrationPass: false,
        finalPass: false,
        error: e.message
      });
    }
  };

  // ─── Safe Block Parser ───────────────────────────────────────────────────
  const getBlockCount = (content: any) => {
    if (!content) return 0;
    if (Array.isArray(content)) return content.length;
    if (typeof content === "object") {
      return Array.isArray(content.blocks) ? content.blocks.length : 1;
    }
    if (typeof content === "string") {
      try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) return parsed.length;
        if (parsed && typeof parsed === "object" && Array.isArray(parsed.blocks)) {
          return parsed.blocks.length;
        }
        return parsed ? 1 : 0;
      } catch {
        return content.trim() ? 1 : 0;
      }
    }
    return 0;
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-stone-50 relative">
      {/* DEVELOPMENT DEBUG PANEL */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-2 right-4 z-50 bg-black text-lime-400 font-mono text-[10px] p-3 rounded-lg shadow-xl opacity-90 pointer-events-none flex flex-col gap-2">
          <div>
            <div><strong>DEBUG PANEL</strong></div>
            <div>publicationId: {publicationId || "null"}</div>
            <div>saveStatus: {saveStatus}</div>
            <div>chapters: {chapters.length}</div>
            <div>
              active blocks: {
                activeChapterIdx !== null && activeSubIdx === null
                  ? getBlockCount(chapters[activeChapterIdx]?.pages?.[0]?.content)
                  : 0
              }
            </div>
            <div>lastSaved: {lastSavedAt || "Never"}</div>
          </div>

          {testResults && (
            <div className="border-t border-lime-800 pt-2 mt-2">
              <div><strong>SAVE PERSISTENCE TEST</strong></div>
              <div>POST /publications: {testResults.postPass ? "PASS" : "FAIL"}</div>
              <div>publicationId: {testResults.publicationId}</div>
              <div>Chapter save: {testResults.chapterPass ? "PASS" : "FAIL"}</div>
              <div>GET /publications/:id: {testResults.getPass ? "PASS" : "FAIL"}</div>
              <div>Hydration restore: {testResults.hydrationPass ? "PASS" : "FAIL"}</div>
              <div>Final result: {testResults.finalPass ? "PASS" : "FAIL"}</div>
              {testResults.error && <div className="text-red-400">Error: {testResults.error}</div>}
            </div>
          )}
        </div>
      )}

      {/* ── Left sidebar ──────────────────────────────────────────────────── */}
      <aside className="w-72 bg-white border-r border-stone-200 flex flex-col shrink-0">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 bg-gradient-to-br from-stone-800 to-stone-900">
          <button onClick={onCancel} className="flex items-center gap-2 text-stone-400 hover:text-white text-xs font-bold mb-3 transition-colors">
            <FaArrowLeft size={10} /> Back
          </button>
          <h2 className="text-sm font-black text-white leading-tight">
            {isEditing ? "Edit Knowledge Asset" : "Intake Knowledge Asset"}
          </h2>
          <p className="text-[10px] text-stone-400 mt-0.5">KHCRF Knowledge Publishing System</p>

          {/* Overall completion */}
          <div className="mt-3">
            <div className="flex justify-between text-[9px] text-stone-400 mb-1">
              <span>Completion</span>
              <span>{Object.entries(sectionDone).filter(([k, v]) => k !== "review" && v).length}/{SECTIONS.length - 1} Sections</span>
            </div>
            <div className="h-1.5 bg-stone-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${completionScore}%` }}
              />
            </div>
            <p className="text-[9px] text-stone-400 mt-1">{completionScore}% ready</p>
          </div>
        </div>

        {/* Blueprint badge if set */}
        {blueprint && (
          <div className={`px-5 py-3 ${blueprint.color} border-b border-stone-200`}>
            <div className="flex items-center gap-2">
              <span className="text-xl flex items-center justify-center"><blueprint.icon size={22} className="text-white drop-shadow-sm" /></span>
              <div>
                <p className="text-xs font-black text-white">{blueprint.label}</p>
                <p className="text-[10px] text-white/70">{blueprint.lengthRange} · {blueprint.format}</p>
              </div>
            </div>
          </div>
        )}

        {/* Section nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {SECTIONS.map(sec => {
            const Icon = sec.icon;
            const active = activeSection === sec.id;
            const status = getSectionStatus(sec.id);
            return (
              <button
                key={sec.id}
                onClick={() => goTo(sec.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                  active
                    ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20 shadow-sm"
                    : "text-stone-500 hover:bg-stone-50 hover:text-stone-900 border border-transparent"
                }`}
              >
                <Icon size={14} strokeWidth={active ? 2.5 : 2} className={active ? "text-brand-primary" : "text-stone-400"} />
                <span className="flex-1 truncate">{sec.label}</span>
                {status === "done" && <CheckIcon size={12} strokeWidth={3} className="text-emerald-500 shrink-0" />}
                {status === "in-progress" && <span data-editorial-accent-bg className="w-1.5 h-1.5 rounded-full  shrink-0 animate-pulse" />}
                {status === "needs-review" && <AlertTriangle size={12} className="text-amber-500 shrink-0" />}
                {status === "not-started" && <span className="w-1.5 h-1.5 rounded-full border border-stone-300 shrink-0" />}
              </button>
            );
          })}
        </nav>

        {/* Quick save */}
        <div className="p-4 border-t border-stone-200 space-y-2">
          {/* DEV ONLY TEST BUTTON */}
          <button
            onClick={runSavePersistenceTest}
            disabled={testResults?.status === "running"}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-lime-500 text-black text-xs font-black rounded-xl hover:bg-lime-400 transition-all shadow-[0_0_15px_rgba(132,204,22,0.3)] border border-lime-600 mb-4"
          >
            {testResults?.status === "running" ? <FaSpinner className="animate-spin" size={11} /> : <FaMagic size={11} />}
            Run Save Persistence Test
          </button>
          
          <button
            onClick={() => {
              console.log("SAVE BUTTON FIRED", { component: "Sidebar", timestamp: Date.now() });
              handleSaveDraft();
            }}
            disabled={draftLoading}
            style={{ border: "4px solid red", position: "relative", zIndex: 99999 }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-100 text-stone-700 text-xs font-black rounded-xl hover:bg-stone-200 transition-all disabled:opacity-60"
          >
            {draftLoading ? <FaSpinner className="animate-spin" size={11} /> : <FaSave size={11} />}
            {saveStatus === "idle" && "Save Draft"}
            {saveStatus === "saving" && "Saving..."}
            {saveStatus === "saved" && "Draft Saved ✓"}
            {saveStatus === "error" && "Save Failed ✗"}
          </button>
          <button
            onClick={handlePreviewBook}
            title={!isEditing ? "Save as Draft first" : undefined}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-black rounded-xl hover:bg-teal-100 transition-all"
          >
            <FaBookOpen size={11} /> Preview Book
          </button>
          <button
            onClick={handlePreviewPublic}
            title={!isEditing ? "Save as Draft first" : undefined}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black rounded-xl hover:bg-blue-100 transition-all"
          >
            <FaEye size={11} /> Public Page
          </button>
        </div>
      </aside>

      {/* ── Main canvas ───────────────────────────────────────────────────── */}
      <main ref={mainRef} className="flex-1 overflow-y-auto">
        <div className="p-8">
          <AnimatePresence mode="wait">

            {/* ── 0. PUBLICATION BLUEPRINT ─────────────────────────────────── */}
            {activeSection === "blueprint" && (
              <motion.div key="blueprint" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="max-w-4xl mx-auto space-y-6">
                <SectionHeader
                  icon={FaMagic} color="bg-amber-600"
                  title="Publication Blueprint"
                  desc="Select the type of knowledge asset you are creating. This selection controls fields, manuscript structure, SEO schema, reader mode, chapter templates, and AI optimization patterns."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(PUBLICATION_BLUEPRINTS).map(([key, bp]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          publicationBlueprint: key,
                          category: key,
                          publicationType: bp.publicationType,
                          citationMode: bp.citationFormat,
                          structuredDataType: bp.schema.split(" / ")[0].replace(" ", ""),
                        }));
                      }}
                      className={`relative flex flex-col items-start gap-3 p-5 rounded-2xl border-2 text-left transition-all hover:shadow-lg ${
                        formData.publicationBlueprint === key
                          ? "border-brand-primary shadow-lg shadow-brand-primary/10 bg-brand-primary/5"
                          : "border-stone-200 bg-white hover:border-stone-300"
                      }`}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${bp.color}`}>
                        <bp.icon className="text-white" size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-black text-gray-900">{bp.label}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{bp.purpose}</p>
                      </div>
                      <div className="w-full pt-3 border-t border-stone-100 space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-gray-400">Length</span>
                          <span className="font-bold text-gray-700">{bp.lengthRange}</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-gray-400">Format</span>
                          <span className="font-bold text-gray-700">{bp.format}</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-gray-400">Chapters</span>
                          <span className="font-bold text-gray-700">{bp.chapterRange}</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-gray-400">Reader Mode</span>
                          <span className="font-bold text-gray-700">{bp.readerMode}</span>
                        </div>
                      </div>
                      {formData.publicationBlueprint === key && (
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center">
                          <FaCheck size={10} className="text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {blueprint && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-sm font-black text-gray-900 mb-4">Auto-configured for: {blueprint.label}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: "Schema Type", value: blueprint.schema },
                        { label: "Citation Format", value: blueprint.citationFormat },
                        { label: "Reader Mode", value: blueprint.readerMode },
                        { label: "Chapter Structure", value: blueprint.chapterRange + " chapters" },
                      ].map(item => (
                        <div key={item.label} className="bg-stone-50 rounded-xl p-3">
                          <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">{item.label}</p>
                          <p className="text-xs font-black text-gray-800 mt-0.5">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ── 1. IDENTITY ──────────────────────────────────────────────── */}
            {activeSection === "identity" && (
              <motion.div key="identity" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="max-w-3xl mx-auto space-y-6">
                <SectionHeader icon={FaBook} color="bg-stone-800" title="Publication Identity"
                  desc="Core bibliographic data — this defines KHCRF's formal record for this knowledge asset">
                  <button
                    onClick={() => setShowBulkMetadata(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-teal-500 text-white text-[10px] font-black rounded-xl hover:bg-teal-600 transition-all shadow-md shadow-teal-500/20"
                  >
                    <FaCloudUploadAlt size={11} /> Import Metadata
                  </button>
                </SectionHeader>

                <Card>
                  <CardTitle>Title & Series</CardTitle>
                  <div className="grid grid-cols-1 gap-4">
                    <Textarea label="Publication Title (exactly 4 lines allowed) *" name="title" value={formData.title} onChange={hc} required placeholder="PREMIUM\nPRICING TRENDS\nIN AUTHENTIC\nKASHMIRI LUXURY CRAFTS" rows={4} />
                    <Input label="Subtitle" name="subtitle" value={formData.subtitle} onChange={hc} placeholder="A comprehensive framework for verifying hand-spun origin" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <Input label="Series Name" name="series" value={formData.series} onChange={hc} />
                    <Input label="Volume" name="volume" value={formData.volume} onChange={hc} />
                    <Input label="Issue" name="issue" value={formData.issue} onChange={hc} />
                  </div>
                </Card>

                <Card>
                  <CardTitle>Publication Identity Codes</CardTitle>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="ISBN Number" name="isbn" value={formData.isbn} onChange={hc} placeholder="978-xx-xxxxx-xx-x" />
                    <Input label="DOI Reference" name="doi" value={formData.doi} onChange={hc} placeholder="10.xxxxx/hcrf.2026.xxx" />
                    <Input label="Publisher Name *" name="publisher" value={formData.publisher} onChange={hc} />
                    <Input label="Edition" name="edition" value={formData.edition} onChange={hc} />
                  </div>
                </Card>

                <Card>
                  <CardTitle>Status & Type</CardTitle>
                  <div className="grid grid-cols-3 gap-4">
                    <Select label="Publication Type" name="publicationType" value={formData.publicationType} onChange={hc}
                      options={[
                        { value: "RESEARCH_PAPER", label: "Research Paper" },
                        { value: "BEST_PRACTICE", label: "Best Practice" },
                        { value: "CASE_STUDY", label: "Case Study" },
                        { value: "EBOOK", label: "E-Book" },
                        { value: "CRAFT_MANUAL", label: "Craft Manual" },
                        { value: "POLICY_BRIEF", label: "Policy Brief" },
                        { value: "MARKET_INTELLIGENCE", label: "Market Intelligence Report" },
                        { value: "FIELD_REPORT", label: "Field Report" },
                        { value: "TECHNICAL_DOC", label: "Technical Documentation" },
                      ]} />
                    <Select label="Publish Status" name="publishedStatus" value={formData.publishedStatus} onChange={hc}
                      options={[
                        { value: "DRAFT", label: "Draft" },
                        { value: "UNDER_REVIEW", label: "Under Review" },
                        { value: "PUBLISHED", label: "Published Live" },
                        { value: "SCHEDULED", label: "Scheduled" },
                        { value: "ARCHIVED", label: "Archived" },
                      ]} />
                    <Select label="Language" name="language" value={formData.language} onChange={hc}
                      options={[
                        { value: "English", label: "English" },
                        { value: "Urdu", label: "Urdu" },
                        { value: "Kashmiri", label: "Kashmiri" },
                        { value: "Hindi", label: "Hindi" },
                      ]} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Input label="Publication Year" name="published" value={formData.published} onChange={hc} />
                    <Input label="URL Slug" name="slug" value={formData.slug} onChange={hc} subtext="Auto-generated from title. Edit carefully." />
                  </div>
                </Card>
              </motion.div>
            )}

            {/* ── 2. CLASSIFICATION ────────────────────────────────────────── */}
            {activeSection === "classification" && (
              <motion.div key="classification" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="max-w-3xl mx-auto space-y-6">
                <SectionHeader icon={FaFilter} color="bg-blue-600" title="Classification & Targeting"
                  desc="Defines how this publication is indexed, filtered, and discovered across the KHCRF hub and external search engines">
                  <div className="flex gap-2">
                    <button onClick={() => setShowBulkClassification(true)}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white text-[10px] font-black rounded-xl hover:bg-blue-600 transition-all shadow-md shadow-blue-500/20">
                      <FaUpload size={10} /> Import Classification
                    </button>
                    <button onClick={() => { setShowBulkClassification(true); }}
                      className="flex items-center gap-2 px-3 py-2 bg-purple-500 text-white text-[10px] font-black rounded-xl hover:bg-purple-600 transition-all shadow-md shadow-purple-500/20">
                      <FaMagic size={10} /> Auto-Classify
                    </button>
                  </div>
                </SectionHeader>

                <Card>
                  <CardTitle>Primary Classification</CardTitle>
                  <div className="grid grid-cols-2 gap-4">
                    <Select label="Publication Category *" name="category" value={formData.category} onChange={hc}
                      options={[
                        { value: "Research Papers", label: "Research Papers" },
                        { value: "Best Practices", label: "Best Practices" },
                        { value: "Case Studies", label: "Case Studies" },
                        { value: "Market Intelligence", label: "Market Intelligence" },
                        { value: "Policy Briefs", label: "Policy Briefs" },
                        { value: "E-Publications", label: "Knowledge Books" },
                        { value: "Authentication", label: "Authentication Guides" },
                        { value: "Craft Documentation", label: "Craft Documentation" },
                        { value: "Cluster Reports", label: "Cluster Reports" },
                        { value: "Export Intelligence", label: "Export Intelligence" },
                        { value: "Legislative Analysis", label: "Legislative Analysis" },
                        { value: "Training Guides", label: "Training Guides" },
                      ]} />
                    <Select label="Primary Craft Sector *" name="craftSector" value={formData.craftSector} onChange={hc}
                      options={CRAFT_OPTIONS.map(c => ({ value: c, label: c }))} />
                    <Select label="Domain Focus *" name="domain" value={formData.domain} onChange={hc}
                      options={TAXONOMY_DOMAINS.map(d => ({ value: d, label: d }))} />
                    <Select label="Access Tier" name="accessType" value={formData.accessType} onChange={hc}
                      options={[
                        { value: "REGISTERED", label: "Registered Users Only" },
                        { value: "MEMBER", label: "Member-Only Premium" },
                      ]} />
                  </div>
                </Card>

                <Card>
                  <CardTitle>Geographic & Audience Targeting</CardTitle>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Target Audience *" name="audience" value={formData.audience} onChange={hc}
                      placeholder="e.g. Researchers, Policymakers, Exporters" />
                    <Input label="Region Focus" name="region" value={formData.region} onChange={hc} />
                    <Input label="Country" name="country" value={formData.country} onChange={hc} />
                    <Input label="Research Level" name="researchLevel" value={formData.researchLevel} onChange={hc}
                      placeholder="e.g. Peer-Reviewed, Field Survey, Policy Grade" />
                  </div>
                </Card>

                <Card>
                  <CardTitle>Pricing & Access</CardTitle>
                  <div className="grid grid-cols-3 gap-4">
                    <Input label="Price (₹ / 0 = free)" name="price" value={formData.price} onChange={hc} />
                    <Input label="Total Pages" name="pages" value={formData.pages} onChange={hc} />
                    <Input label="Reading Time" name="readingTime" value={formData.readingTime} onChange={hc} placeholder="e.g. 25 mins" />
                  </div>
                </Card>
              </motion.div>
            )}

            {/* ── 3. CONTRIBUTORS ──────────────────────────────────────────── */}
            {activeSection === "contributors" && (
              <motion.div key="contributors" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="max-w-3xl mx-auto space-y-6">
                <SectionHeader icon={FaUserFriends} color="bg-indigo-600" title="Contributors Network"
                  desc="Build bibliographic authority and institutional credibility for AI, Google, and academic discovery">
                  <div className="flex gap-2">
                    <button onClick={() => setShowContributorModal(true)}
                      className="flex items-center gap-2 px-3 py-2 bg-indigo-500 text-white text-[10px] font-black rounded-xl hover:bg-indigo-600 transition-all shadow-md shadow-indigo-500/20">
                      <FaUpload size={10} /> Import Contributors
                    </button>
                    <button onClick={() => { setShowContributorModal(true); }}
                      className="flex items-center gap-2 px-3 py-2 bg-purple-500 text-white text-[10px] font-black rounded-xl hover:bg-purple-600 transition-all shadow-md shadow-purple-500/20">
                      <FaProjectDiagram size={10} /> Authority Map
                    </button>
                  </div>
                </SectionHeader>

                {/* Live contributor pills — populated by modal */}
                {contributorsList.length > 0 && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{contributorsList.length} Contributor{contributorsList.length !== 1 ? "s" : ""} Loaded</p>
                      <button onClick={() => setShowContributorModal(true)} className="text-[9px] text-indigo-500 font-bold hover:text-indigo-700">Edit in Authority System →</button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {contributorsList.map(c => (
                        <div key={c.id} className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-indigo-200 rounded-full">
                          <span className="text-[8px] font-black text-indigo-600">{c.role.split(" ")[0]}</span>
                          <span className="text-[9px] font-bold text-gray-800">{c.name}</span>
                          {c.orcid && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Has ORCID" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Card>
                  <CardTitle>Primary Authorship</CardTitle>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Lead Author *" name="author" value={formData.author} onChange={hc} required placeholder="Dr. Full Name, Title" />
                    <Input label="Co-Author(s)" name="coAuthor" value={formData.coAuthor} onChange={hc} placeholder="Dr. Name 1, Dr. Name 2" />
                    <Input label="Academic Institution" name="institution" value={formData.institution} onChange={hc} placeholder="e.g. Kashmir University, KHCRF" />
                    <Input label="Research Team" name="researchTeam" value={formData.researchTeam} onChange={hc} placeholder="e.g. KHCRF Materials Science Lab" />
                  </div>
                </Card>

                <Card>
                  <CardTitle>Editorial & Review Panel</CardTitle>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Technical Editor" name="technicalEditor" value={formData.technicalEditor} onChange={hc} />
                    <Input label="Peer Reviewer" name="reviewer" value={formData.reviewer} onChange={hc} />
                  </div>
                </Card>

                <Card>
                  <CardTitle>Field & Industry Contributors</CardTitle>
                  <div className="grid grid-cols-1 gap-4">
                    <Input label="Field Contributors" name="fieldContributor" value={formData.fieldContributor} onChange={hc}
                      placeholder="Artisan names, cluster coordinators who contributed field data" />
                    <Input label="Legislative Contributors" name="legislativeContributor" value={formData.legislativeContributor} onChange={hc}
                      placeholder="Policy advisors, GI office contacts" />
                    <Input label="Industry & Guild Contributors" name="industryContributor" value={formData.industryContributor} onChange={hc}
                      placeholder="Export councils, craft guilds, industry bodies" />
                  </div>
                </Card>
              </motion.div>
            )}

            {/* ── 4. INTELLIGENCE PAGE ─────────────────────────────────────── */}
            {activeSection === "intelligence" && (
              <motion.div key="intelligence" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="max-w-3xl mx-auto space-y-6">
                <SectionHeader icon={FaBrain} color="bg-purple-600" title="Intelligence Page Content"
                  desc={`Category-aware content for the public publication page — powered by ${formData.publicationBlueprint || "your selected blueprint"}`}>
                  <button
                    onClick={() => setShowBulkIntelligence(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-500 text-white text-[10px] font-black rounded-xl hover:bg-purple-600 transition-all shadow-md shadow-purple-500/20"
                  >
                    <FaCloudUploadAlt size={11} /> Import Intelligence
                  </button>
                </SectionHeader>

                {/* ── Intelligence Content Engine ── */}
                <IntelligenceContentEngine
                  publicationTitle={formData.title}
                  publicationBlueprint={formData.publicationBlueprint}
                  craftSector={formData.craftSector || selectedCrafts[0] || ""}
                  domain={formData.domain || ""}
                  existingKeywords={formData.keywords || ""}
                  chapters={chapters}
                  onApply={handleApplyIntelligence}
                  currentContent={formData as any}
                />

                {/* Dynamic intelligence fields based on category */}
                {(!formData.publicationBlueprint || formData.publicationBlueprint === "Best Practices") && (
                  <>
                    <Card>
                      <CardTitle>Executive Summary</CardTitle>
                      <Textarea label="Executive Summary *" name="execSummary" value={formData.execSummary} onChange={hc} rows={5}
                        placeholder="Write 3–5 paragraphs summarising the publication's scope, relevance, and core findings." />
                    </Card>
                    <Card>
                      <CardTitle>Best Practice Highlights</CardTitle>
                      <div className="space-y-4">
                        <Textarea label="Problem Statement" name="problemStatement" value={formData.problemStatement} onChange={hc} rows={3}
                          placeholder="What problem does this best practice address?" />
                        <Textarea label="Best Practice Highlights" name="bestPracticeHighlights" value={formData.bestPracticeHighlights} onChange={hc} rows={4}
                          placeholder="Core highlights of the best practice (one per line)" />
                        <Textarea label="Implementation Framework" name="implementationFramework" value={formData.implementationFramework} onChange={hc} rows={3}
                          placeholder="How should practitioners implement this?" />
                        <Textarea label="Key Recommendations" name="keyRecommendations" value={formData.keyRecommendations} onChange={hc} rows={3}
                          placeholder="Top actionable recommendations" />
                      </div>
                    </Card>
                  </>
                )}

                {formData.publicationBlueprint === "Case Studies" && (
                  <>
                    <Card>
                      <CardTitle>Case Background</CardTitle>
                      <div className="space-y-4">
                        <Textarea label="Case Background" name="caseBackground" value={formData.caseBackground} onChange={hc} rows={4}
                          placeholder="Context, location, actors involved" />
                        <Textarea label="Challenge / Problem" name="challenge" value={formData.challenge} onChange={hc} rows={3}
                          placeholder="What was the central challenge?" />
                      </div>
                    </Card>
                    <Card>
                      <CardTitle>Intervention & Results</CardTitle>
                      <div className="space-y-4">
                        <Textarea label="Intervention" name="intervention" value={formData.intervention} onChange={hc} rows={3}
                          placeholder="What intervention was applied?" />
                        <Textarea label="Results" name="results" value={formData.results} onChange={hc} rows={3}
                          placeholder="What were the measurable outcomes?" />
                        <Textarea label="Lessons Learned" name="lessonsLearned" value={formData.lessonsLearned} onChange={hc} rows={3}
                          placeholder="What lessons emerged for future practice?" />
                        <Textarea label="Replicability" name="replicability" value={formData.replicability} onChange={hc} rows={2}
                          placeholder="Can this be replicated? Under what conditions?" />
                      </div>
                    </Card>
                  </>
                )}

                {formData.publicationBlueprint === "Research Papers" && (
                  <>
                    <Card>
                      <CardTitle>Academic Abstract</CardTitle>
                      <Textarea label="Abstract *" name="abstract" value={formData.abstract} onChange={hc} rows={5}
                        placeholder="Structured abstract: Background, Objective, Methods, Results, Conclusion." />
                    </Card>
                    <Card>
                      <CardTitle>Research Framework</CardTitle>
                      <div className="space-y-4">
                        <Textarea label="Research Questions" name="researchQuestions" value={formData.researchQuestions} onChange={hc} rows={3}
                          placeholder="List primary research questions (one per line)" />
                        <Textarea label="Methodology" name="methodology" value={formData.methodology} onChange={hc} rows={3}
                          placeholder="Research method: field survey, optical analysis, legal review, etc." />
                        <Textarea label="Key Findings" name="keyFindings" value={formData.keyFindings} onChange={hc} rows={4}
                          placeholder="Primary research findings (one per line)" />
                        <Textarea label="Conclusions" name="conclusions" value={formData.conclusions} onChange={hc} rows={3}
                          placeholder="Summary conclusions and implications" />
                      </div>
                    </Card>
                  </>
                )}

                {formData.publicationBlueprint === "E-Publications" && (
                  <>
                    <Card>
                      <CardTitle>Book Overview</CardTitle>
                      <Textarea label="Book Overview *" name="bookOverview" value={formData.bookOverview} onChange={hc} rows={4}
                        placeholder="What is this book about? What will readers discover?" />
                    </Card>
                    <Card>
                      <CardTitle>Learning Design</CardTitle>
                      <div className="space-y-4">
                        <Textarea label="Learning Objectives" name="learningObjectives" value={formData.learningObjectives} onChange={hc} rows={3}
                          placeholder="What will readers know/be able to do after reading?" />
                        <Textarea label="Audience Benefits" name="audienceBenefits" value={formData.audienceBenefits} onChange={hc} rows={3}
                          placeholder="Who benefits and how?" />
                        <Textarea label="Key Topics Covered" name="keyTopics" value={formData.keyTopics} onChange={hc} rows={3}
                          placeholder="Main topics (one per line)" />
                      </div>
                    </Card>
                  </>
                )}

                {formData.publicationBlueprint === "Policy Briefs" && (
                  <>
                    <Card>
                      <CardTitle>Policy Summary</CardTitle>
                      <div className="space-y-4">
                        <Textarea label="Policy Summary *" name="policySum" value={formData.policySum} onChange={hc} rows={4}
                          placeholder="High-level policy context and scope" />
                        <Textarea label="Urgency Statement" name="urgencyStatement" value={formData.urgencyStatement} onChange={hc} rows={2}
                          placeholder="Why action is needed now" />
                      </div>
                    </Card>
                    <Card>
                      <CardTitle>Evidence & Recommendations</CardTitle>
                      <div className="space-y-4">
                        <Textarea label="Evidence Snapshot" name="evidenceSnapshot" value={formData.evidenceSnapshot} onChange={hc} rows={3}
                          placeholder="Key data points and evidence" />
                        <Textarea label="Policy Recommendations" name="policyRecommendations" value={formData.policyRecommendations} onChange={hc} rows={4}
                          placeholder="Specific actionable policy recommendations (one per line)" />
                        <Textarea label="Expected Outcomes" name="expectedOutcomes" value={formData.expectedOutcomes} onChange={hc} rows={3}
                          placeholder="What outcomes are expected if recommendations are adopted?" />
                      </div>
                    </Card>
                  </>
                )}

                {formData.publicationBlueprint === "Market Intelligence" && (
                  <>
                    <Card>
                      <CardTitle>Market Summary</CardTitle>
                      <Textarea label="Market Summary *" name="marketSummary" value={formData.marketSummary} onChange={hc} rows={4}
                        placeholder="Overview of the market being analyzed" />
                    </Card>
                    <Card>
                      <CardTitle>Intelligence Signals</CardTitle>
                      <div className="space-y-4">
                        <Textarea label="Export Trends" name="exportTrends" value={formData.exportTrends} onChange={hc} rows={3}
                          placeholder="Key export data, destinations, volume changes" />
                        <Textarea label="Price Signals" name="priceSignals" value={formData.priceSignals} onChange={hc} rows={3}
                          placeholder="Pricing trends, premium segments, commodity grades" />
                        <Textarea label="Market Risks" name="marketRisks" value={formData.marketRisks} onChange={hc} rows={2}
                          placeholder="Identified market risks" />
                        <Textarea label="Opportunities" name="opportunities" value={formData.opportunities} onChange={hc} rows={3}
                          placeholder="Key market opportunities" />
                        <Textarea label="Forecasts" name="forecasts" value={formData.forecasts} onChange={hc} rows={2}
                          placeholder="Market forecasts and projections" />
                      </div>
                    </Card>
                  </>
                )}

                {/* Common: keywords + description always visible */}
                <Card>
                  <CardTitle>Search Keywords &amp; Highlights</CardTitle>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Keywords (comma-separated)" name="keywords" value={formData.keywords} onChange={hc}
                      placeholder="Kashmir, Pashmina, GI Protection, Authentication" />
                    <Input label="Top Highlight Line" name="highlights" value={formData.highlights} onChange={hc}
                      placeholder="e.g. 98% accuracy in hand-spun yarn identification" />
                  </div>
                  <div className="mt-4">
                    <Textarea label="Long Description (public catalog card)" name="description" value={formData.description} onChange={hc} rows={3}
                      placeholder="Summary shown on the publications listing page" />
                  </div>
                </Card>
              </motion.div>
            )}

            {/* ── 5. AUTHORITY MAPPING ─────────────────────────────────────── */}
            {activeSection === "crafts" && (
              <motion.div key="crafts" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="max-w-4xl mx-auto space-y-6">
                <SectionHeader icon={FaShieldAlt} color="bg-amber-600" title="Craft Authority & Knowledge Graph Signals"
                  desc="Multi-level craft authority mapping, domain authority, cover branding — builds KHCRF topical authority across search engines, AI systems, and the knowledge graph." />

                <Card>
                  <CraftAuthorityEngine
                    chapters={chapters}
                    publicationTitle={formData.title}
                    craftSector={formData.craftSector || selectedCrafts[0] || ""}
                    domain={formData.domain || ""}
                    onApply={handleApplyAuthority}
                    currentData={craftAuthorityData ?? undefined}
                  />
                </Card>

                <Card>
                  <CardTitle>Cover & Branding</CardTitle>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Cover Image URL" name="imagePath" value={formData.imagePath} onChange={hc} placeholder="https://..." />
                    <Select label="Cover Template" name="coverTemplate" value={formData.coverTemplate} onChange={hc}
                      options={[
                        { value: "Scholarly Monograph", label: "Scholarly Monograph" },
                        { value: "Institutional Paper", label: "Institutional Paper" },
                        { value: "Foundation Press", label: "Foundation Press" },
                        { value: "Heritage Document", label: "Heritage Document" },
                      ]} />
                    <Input label="Branding Theme" name="brandingTheme" value={formData.brandingTheme} onChange={hc} />
                    <Input label="Series Badge" name="seriesBadge" value={formData.seriesBadge} onChange={hc} />
                  </div>
                </Card>
              </motion.div>
            )}

            {/* ── 6. MANUSCRIPT BUILDER ────────────────────────────────────── */}
            {activeSection === "chapters" && (
              <motion.div key="chapters" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="max-w-6xl mx-auto space-y-6">
                <SectionHeader icon={FaBookOpen} color="bg-teal-600" title="Chapter Builder (Manuscript Builder)"
                  desc="Build the full knowledge asset using the manuscript structure for your publication category." />

                {/* Action toolbar */}
                <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">

                  {/* Smart Bulk Import — prominent CTA */}
                  <div className="mb-4 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shrink-0 shadow-md shadow-teal-500/30">
                      <FaMagic className="text-white" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-teal-900">Smart Bulk Manuscript Import</p>
                      <p className="text-[10px] text-teal-700 mt-0.5">
                        Upload a full book or chapter-wise files. Auto-detects structure, sequences sections,
                        flags missing chapters and duplicates, scores confidence.
                      </p>
                    </div>
                    <button type="button"
                      onClick={() => setShowSmartImport(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white text-xs font-black rounded-xl hover:bg-teal-700 transition-all shadow-md shadow-teal-600/25 shrink-0">
                      <FaUpload size={11} /> Smart Import
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center">
                    <button type="button" onClick={generateStructure}
                      title={blueprint ? `Generate ${blueprint.label} structure` : "No blueprint — will use generic structure"}
                      className="flex flex-col items-center gap-0.5 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:opacity-90 shadow-sm">
                      <span className="flex items-center gap-1.5 text-xs font-black"><FaMagic size={10} /> Generate Structure</span>
                      <span className="text-[9px] font-normal opacity-75">
                        {blueprint ? blueprint.label : formData.category ? formData.category : "Generic template"}
                      </span>
                    </button>
                    <button type="button" onClick={() => addChapter(undefined, "front-matter")}
                      className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 text-stone-700 text-xs font-bold rounded-lg hover:bg-stone-200">
                      <FaPlus size={9} /> Front Matter
                    </button>
                    <button type="button" onClick={() => addChapter(undefined, "chapter")}
                      className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 text-stone-700 text-xs font-bold rounded-lg hover:bg-stone-200">
                      <FaPlus size={9} /> Add Chapter
                    </button>
                    <button type="button" onClick={() => addChapter(undefined, "back-matter")}
                      className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 text-stone-700 text-xs font-bold rounded-lg hover:bg-stone-200">
                      <FaPlus size={9} /> Back Matter
                    </button>
                    <div className="h-5 w-px bg-stone-200" />
                    {/* Quick chapter generator */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-bold">Auto-generate:</span>
                      <input
                        type="number"
                        value={bulkChapterCount}
                        onChange={e => setBulkChapterCount(Number(e.target.value))}
                        min={1} max={50}
                        className="w-16 text-xs border border-stone-200 rounded-lg px-2 py-1.5 text-center focus:outline-none focus:border-teal-400"
                      />
                      <button type="button" onClick={() => autoGenerateChapters(bulkChapterCount)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 text-stone-700 text-xs font-bold rounded-lg hover:bg-stone-200">
                        <FaBolt size={9} /> {bulkChapterCount} Chapters
                      </button>
                    </div>
                  </div>

                  {/* Import row — each button opens ManuscriptImportModal pre-set to that format */}
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-stone-100">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider self-center">Import:</span>
                    {([
                      { icon: FaFileWord, label: "DOCX", mode: "docx" as const },
                      { icon: FaFilePdf, label: "PDF", mode: "pdf" as const },
                      { icon: FaFileCode, label: "Markdown", mode: "markdown" as const },
                      { icon: FaFileArchive, label: "ZIP", mode: "zip" as const },
                      { icon: FaLayerGroup, label: "CSV", mode: "csv" as const },
                    ] as const).map(({ icon: Icon, label, mode: m }) => (
                      <button key={label} type="button"
                        onClick={() => { setImportMode(m); setShowImportModal(true); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 border border-stone-200 text-stone-600 text-[10px] font-bold rounded-lg hover:bg-stone-100 hover:border-teal-300 hover:text-teal-700 transition-all">
                        <Icon size={9} /> {label}
                      </button>
                    ))}
                    <button type="button"
                      onClick={() => { setImportMode("bulk"); setShowImportModal(true); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 border border-teal-200 text-teal-700 text-[10px] font-bold rounded-lg hover:bg-teal-100 transition-all">
                      <FaUpload size={9} /> Bulk Upload
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Manuscript tree */}
                  <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-4 py-3 border-b border-stone-100 bg-stone-50/60">
                      <span className="text-[10px] font-black text-stone-500 uppercase tracking-wider">Manuscript Structure</span>
                      <p className="text-[9px] text-stone-400 mt-0.5">{chapters.length} sections</p>
                    </div>
                    <div className="p-2 space-y-0.5 min-h-[300px] max-h-[500px] overflow-y-auto">
                      {chapters.length === 0 && (
                        <div className="text-center py-8 text-xs text-gray-400 italic">
                          Click "Generate Structure" or add sections manually
                        </div>
                      )}

                      {/* Group by section type */}
                      {["front-matter", "chapter", "back-matter"].map(sType => {
                        const sTypeChapters = chapters.filter(c => c.sectionType === sType);
                        if (sTypeChapters.length === 0) return null;
                        const label = sType === "front-matter" ? "Front Matter" : sType === "chapter" ? "Main Content" : "Back Matter";
                        const color = sType === "front-matter" ? "text-blue-600" : sType === "chapter" ? "text-teal-600" : "text-amber-600";
                        return (
                          <div key={sType}>
                            <div className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest ${color} opacity-70`}>{label}</div>
                            {sTypeChapters.map((ch) => {
                              const cIdx = chapters.indexOf(ch);
                              return (
                                <div key={cIdx}>
                                  <div
                                    onClick={() => { setActiveChapterIdx(cIdx); setActiveSubIdx(null); }}
                                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-xs font-bold transition-all group ${
                                      activeChapterIdx === cIdx && activeSubIdx === null
                                        ? "bg-teal-50 text-teal-700 border border-teal-200"
                                        : "text-stone-700 hover:bg-stone-50 border border-transparent"
                                    }`}
                                  >
                                    <span className="truncate flex-1">{ch.title}</span>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                                      <button type="button" onClick={e => { e.stopPropagation(); addSubchapter(cIdx); }}
                                        className="text-stone-400 hover:text-teal-600 text-[10px] font-black">+sub</button>
                                      <button type="button" onClick={e => { e.stopPropagation(); deleteChapter(cIdx); }}
                                        className="text-stone-300 hover:text-red-500">
                                        <FaTrash size={8} />
                                      </button>
                                    </div>
                                  </div>
                                  {ch.subchapters?.map((sub, sIdx) => (
                                    <div key={sIdx}
                                      onClick={() => { setActiveChapterIdx(cIdx); setActiveSubIdx(sIdx); }}
                                      className={`ml-4 flex items-center px-3 py-1.5 rounded-lg cursor-pointer text-[11px] transition-all ${
                                        activeChapterIdx === cIdx && activeSubIdx === sIdx
                                          ? "bg-teal-50/60 text-teal-600 font-bold"
                                          : "text-stone-500 hover:bg-stone-50"
                                      }`}
                                    >
                                      <span className="text-stone-300 mr-2">└</span> {sub.title}
                                    </div>
                                  ))}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}

                      {/* Non-typed chapters */}
                      {chapters.filter(c => !c.sectionType).map((ch, cIdx) => (
                        <div key={cIdx}
                          onClick={() => { setActiveChapterIdx(cIdx); setActiveSubIdx(null); }}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-xs font-bold transition-all ${
                            activeChapterIdx === cIdx && activeSubIdx === null
                              ? "bg-teal-50 text-teal-700 border border-teal-200"
                              : "text-stone-700 hover:bg-stone-50 border border-transparent"
                          }`}
                        >
                          <span className="truncate">{ch.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Block editor */}
                  <div className="lg:col-span-2 bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
                    {chapters.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-center p-8">
                        <FaBookOpen className="text-3xl text-stone-200 mb-3" />
                        <p className="text-sm font-bold text-stone-500">No manuscript structure yet</p>
                        <p className="text-xs text-gray-400 mt-1">Use "Generate Structure" to auto-build from your blueprint</p>
                      </div>
                    ) : (
                      <>
                        <div className="px-5 py-3 border-b border-stone-100 bg-stone-50/60">
                          <input
                            value={activeSubIdx !== null
                              ? chapters[activeChapterIdx]?.subchapters?.[activeSubIdx]?.title || ""
                              : chapters[activeChapterIdx]?.title || ""
                            }
                            onChange={e => {
                              if (activeSubIdx !== null) {
                                setChapters(prev => prev.map((c, i) => i !== activeChapterIdx ? c : {
                                  ...c, subchapters: c.subchapters?.map((s, j) => j === activeSubIdx ? { ...s, title: e.target.value } : s)
                                }));
                              } else {
                                setChapters(prev => prev.map((c, i) => i === activeChapterIdx ? { ...c, title: e.target.value } : c));
                              }
                            }}
                            className="w-full bg-transparent border-none outline-none text-sm font-bold text-gray-900 placeholder:text-gray-400"
                            placeholder="Section title..."
                          />
                        </div>

                        <div className="p-5 space-y-3 min-h-[300px]">
                          {getBlocks().map((block, bIdx) => (
                            <div key={bIdx} className="group bg-stone-50/60 border border-stone-200/60 rounded-xl p-3.5 space-y-2">
                              <div className="flex justify-between items-center">
                                <span data-editorial-accent-text className="text-[9px] font-black uppercase tracking-widest /70 bg-brand-primary/8 px-2 py-0.5 rounded">
                                  {block.type}
                                </span>
                                <button type="button" onClick={() => removeBlock(bIdx)}
                                  className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-500 transition-all">
                                  <FaTrash size={10} />
                                </button>
                              </div>
                              <textarea
                                value={block.text}
                                onChange={e => {
                                  console.log(`BLOCK CHANGE [${block.type}]`, e.target.value);
                                  editBlock(bIdx, e.target.value);
                                }}
                                rows={block.type === "Paragraph" ? 3 : 1}
                                placeholder={`${block.type} content...`}
                                className="w-full text-xs bg-white border border-stone-200/60 rounded-lg p-2.5 focus:outline-none focus:border-brand-primary resize-none text-gray-800 font-serif"
                              />
                            </div>
                          ))}

                          <div className="flex flex-wrap gap-2 pt-3 border-t border-stone-100">
                            {(["Heading", "Paragraph", "Key Insight", "Quote", "Callout", "Reference", "Checklist"] as const).map(t => (
                              <button key={t} type="button" onClick={() => addBlock(t)}
                                className="px-3 py-1.5 bg-white border border-stone-200 text-stone-600 text-[10px] font-bold rounded-lg hover:bg-stone-50 hover:border-brand-primary/30 hover:text-brand-primary transition-all">
                                + {t}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* PDF import */}
                <div className="border border-dashed border-stone-300 rounded-2xl p-6 bg-stone-50/50 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-stone-200 flex items-center justify-center shrink-0">
                    <FaFileAlt className="text-stone-500" size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-700">Import Existing PDF (Secondary)</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">If you have an existing document, paste its URL below. Writer Mode above is the primary experience.</p>
                    <Input label="" name="pdfPath" value={formData.pdfPath} onChange={hc} placeholder="https://... PDF URL (optional import only)" className="mt-2" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── 7. KNOWLEDGE GRAPH ───────────────────────────────────────── */}
            {activeSection === "graph" && (
              <motion.div key="graph" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="max-w-3xl mx-auto space-y-6">
                <SectionHeader icon={FaProjectDiagram} color="bg-rose-600" title="Knowledge Graph Relationship Manager"
                  desc="Connect this publication to the KHCRF knowledge network via typed graph nodes — crafts, policies, GI registrations, artisan clusters, export markets, authentication systems, and more." />

                {/* ── KG Summary & Launch Button ── */}
                <div className="p-5 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center shrink-0 shadow-md shadow-rose-500/20">
                    <FaProjectDiagram className="text-white" size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-rose-900">Knowledge Graph Relationship Manager</p>
                    <p className="text-[10px] text-rose-700 mt-0.5">
                      {kgNodes.length > 0
                        ? `${kgNodes.length} nodes · ${new Set(kgNodes.map(n => n.entityType)).size} entity types mapped`
                        : "No graph nodes yet — launch the manager to auto-detect from manuscript or add manually"}
                    </p>
                  </div>
                  <button type="button" onClick={() => setShowKGManager(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 text-white text-xs font-black rounded-xl hover:bg-rose-600 transition-all shadow-md shadow-rose-500/20 shrink-0">
                    <FaProjectDiagram size={11} /> {kgNodes.length > 0 ? "Edit Graph" : "Build Graph"}
                  </button>
                </div>

                {/* Node pills by entity type */}
                {kgNodes.length > 0 && (
                  <Card>
                    <CardTitle>Active Graph Nodes ({kgNodes.length})</CardTitle>
                    <div className="space-y-3">
                      {([
                        { type: "Craft", color: "bg-amber-100 text-amber-800 border-amber-300" },
                        { type: "Policy Standard", color: "bg-red-100 text-red-800 border-red-300" },
                        { type: "GI Registration", color: "bg-purple-100 text-purple-800 border-purple-300" },
                        { type: "Artisan Cluster", color: "bg-green-100 text-green-800 border-green-300" },
                        { type: "Export Market", color: "bg-cyan-100 text-cyan-800 border-cyan-300" },
                        { type: "Authentication System", color: "bg-violet-100 text-violet-800 border-violet-300" },
                        { type: "Institution", color: "bg-stone-100 text-stone-800 border-stone-300" },
                        { type: "Legislative Document", color: "bg-orange-100 text-orange-800 border-orange-300" },
                      ].map(({ type, color }) => {
                        const nodes = kgNodes.filter(n => n.entityType === type);
                        if (!nodes.length) return null;
                        return (
                          <div key={type} className="flex items-start gap-3">
                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border w-28 shrink-0 text-center ${color}`}>{type}</span>
                            <div className="flex flex-wrap gap-1.5">
                              {nodes.map(n => (
                                <span key={n.id} className={`px-2.5 py-1 rounded-full border text-[9px] font-bold ${color}`}>
                                  {n.name} <span className="opacity-50">· {n.relationship}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      }))}
                    </div>
                    <button type="button" onClick={() => setShowKGManager(true)}
                      className="mt-4 text-[10px] text-rose-600 font-bold hover:text-rose-800">Edit Knowledge Graph →</button>
                  </Card>
                )}
              </motion.div>
            )}

            {/* ── 8. SEO INTELLIGENCE ──────────────────────────────────────── */}
            {activeSection === "seo" && (
              <motion.div key="seo" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="max-w-3xl mx-auto space-y-6">
                <SectionHeader icon={FaSearch} color="bg-emerald-600" title="SEO Intelligence"
                  desc={`Schema type auto-set to "${blueprint?.schema || "ResearchPaper"}" based on your blueprint. All fields below directly affect discoverability.`} />

                <div className="flex justify-between items-center bg-stone-100 p-4 rounded-xl border border-stone-200">
                  <div className="text-[11px] text-stone-500">
                    Upload a JSON file to instantly populate and save all SEO fields.
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => {
                      const json = JSON.stringify({
                        seoTitle: "Reviving Trust in Kashmir Pashmina | KHCRF",
                        seoDescription: "A comprehensive publication on Kashmir Pashmina GI authentication and craft preservation by Hamadan Craft Revival Foundation.",
                        seoKeywords: "Kashmir Pashmina, GI Authentication, Craft Revival, Srinagar",
                        canonicalUrl: "https://khcrf.org/publications/reviving-trust-pashmina",
                        structuredDataType: "Book",
                        seoFaq: "Question: What is GI? Answer: Geographical Indication...",
                        ogImageUrl: "https://khcrf.org/images/pashmina-og.jpg",
                        twitterCard: "Summary Large Image"
                      }, null, 2);
                      const blob = new Blob([json], { type: "application/json" });
                      const a = document.createElement("a");
                      a.href = URL.createObjectURL(blob);
                      a.download = "hcrf_seo_template.json";
                      a.click();
                      URL.revokeObjectURL(a.href);
                    }} className="inline-flex items-center gap-2 bg-white text-stone-700 border border-stone-300 px-4 py-2 rounded-lg text-[11px] font-bold shadow hover:bg-stone-50 transition-colors">
                      <FaDownload /> Download SEO Template
                    </button>
                    <label className="cursor-pointer inline-flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-lg text-[11px] font-bold shadow hover:bg-stone-800 transition-colors">
                      <FaUpload /> Bulk Upload SEO JSON
                      <input type="file" accept=".json" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = async (ev) => {
                        try {
                          const json = JSON.parse(ev.target?.result as string);
                          
                          // Run Canonical Validator
                          const result = validateSeoSchema(json);
                          if (!result.isValid) {
                            toast.error(`Invalid Schema (hcrf_seo_v1): ${result.errors.join(", ")}`);
                            return;
                          }

                          // Warn about unknown keys
                          if (result.warnings.length > 0) {
                            result.warnings.forEach(w => toast(w, { icon: "⚠️", duration: 4000 }));
                          }

                          const validated = result.normalizedData;
                          const nextData = {
                            ...formData,
                            seoTitle: validated.seoTitle || formData.seoTitle,
                            seoDescription: validated.seoDescription || formData.seoDescription,
                            seoKeywords: validated.seoKeywords || formData.seoKeywords,
                            canonicalUrl: validated.canonicalUrl || formData.canonicalUrl,
                            structuredDataType: validated.structuredDataType || formData.structuredDataType,
                            seoFaq: validated.seoFaq || formData.seoFaq,
                          };
                          setFormData(nextData);
                          
                          // Auto Save
                          setDraftLoading(true);
                          const payload = {
                            ...nextData,
                            slug: nextData.slug || ensureSlug(),
                            price: nextData.price || "0",
                            multipleCrafts: selectedCrafts.join(", "),
                            qaPairs: JSON.stringify(qaPairs),
                            type: "WRITTEN",
                            publishedStatus: "DRAFT"
                          };
                          try {
                            if (onSaveDraft) await onSaveDraft(payload as any, chapters);
                            else await onSubmit(payload as any, chapters);
                            toast.success("✓ SEO Data Imported & Auto-Saved! (hcrf_seo_v1)");
                          } catch (err) {
                            toast.error("Failed to auto-save SEO data.");
                          } finally {
                            setDraftLoading(false);
                          }
                        } catch (err) {
                          toast.error("Failed to parse JSON file.");
                        }
                      };
                      reader.readAsText(file);
                      e.target.value = ""; // reset
                    }} />
                  </label>
                </div>
              </div>

                <Card>
                  <CardTitle>Meta Tags</CardTitle>
                  <div className="space-y-4">
                    <Input label="Meta Title (max 60 chars)" name="seoTitle" value={formData.seoTitle} onChange={hc}
                      placeholder="Kashmir Pashmina Authentication Guide | KHCRF" />
                    <div>
                      <Textarea label="Meta Description (max 155 chars)" name="seoDescription" value={formData.seoDescription} onChange={hc} rows={2}
                        placeholder="KHCRF's definitive guide to authenticating Kashmir Pashmina using GI protocols and optical scanning techniques." />
                      {formData.seoDescription && (
                        <p className={`text-[10px] mt-1 ${formData.seoDescription.length > 155 ? "text-red-500" : "text-gray-400"}`}>
                          {formData.seoDescription.length}/155 chars
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Canonical URL (optional)" name="canonicalUrl" value={formData.canonicalUrl} onChange={hc} />
                      <Input label="Target Keywords" name="seoKeywords" value={formData.seoKeywords} onChange={hc}
                        placeholder="pashmina authentication, GI protection Kashmir" />
                    </div>
                  </div>
                </Card>

                <Card>
                  <CardTitle>Structured Data Schema</CardTitle>
                  <div className="grid grid-cols-2 gap-4">
                    <Select label="Schema Type" name="structuredDataType" value={formData.structuredDataType} onChange={hc}
                      options={[
                        { value: "ResearchPaper", label: "Research Paper (ScholarlyArticle)" },
                        { value: "Book", label: "Book" },
                        { value: "Report", label: "Report" },
                        { value: "TechReport", label: "Technical Report" },
                        { value: "GovernmentReport", label: "Government Report" },
                        { value: "Dataset", label: "Dataset" },
                      ]} />
                    <Select label="Twitter Card" name="twitterCardType" value={formData.twitterCardType} onChange={hc}
                      options={[
                        { value: "summary_large_image", label: "Summary Large Image" },
                        { value: "summary", label: "Summary" },
                      ]} />
                  </div>
                </Card>

                <Card>
                  <CardTitle>FAQ Schema (boosts search snippets)</CardTitle>
                  <Textarea label="FAQ Pairs (one Q: A: block per line)" name="seoFaq" value={formData.seoFaq} onChange={hc} rows={4}
                    placeholder={"Q: What is GI protection for Kashmir Pashmina?\nA: Geographic Indication (GI) protection certifies that Pashmina originates from Kashmir..."} />
                </Card>

                <Card>
                  <CardTitle>Open Graph</CardTitle>
                  <Input label="OG Image URL" name="openGraphImage" value={formData.openGraphImage} onChange={hc}
                    placeholder="https://... (1200x630px recommended)" />
                </Card>
              </motion.div>
            )}

            {/* ── 9. AI OPTIMIZATION ───────────────────────────────────────── */}
            {activeSection === "ai" && (
              <motion.div key="ai" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="max-w-4xl mx-auto space-y-6">
                
                <div className="flex justify-between items-center bg-cyan-50 p-4 rounded-xl border border-cyan-100">
                  <div className="text-[11px] text-cyan-800">
                    Upload a JSON file to instantly populate and save AI summaries, facts, entities, and Q&A pairs.
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => {
                      const json = JSON.stringify({
                        aiSummary: "The publication provides a detailed, scientific analysis of the geographical authentication protocols for genuine Kashmir Pashmina, outlining physical fiber testing standards.",
                        entitiesMatched: "Kashmir Pashmina, Srinagar, GI Registry, optical microscopes",
                        knowledgeNodesList: "Pashmina Guard Hair -> GI Registry; Srinagar Laboratories -> Fiber Diagnostics",
                        structuredFacts: [
                          "Pashmina fiber diameter must be under 15 microns to qualify for genuine GI protection.",
                          "Traditional spinning wheel (Yander) processes the fiber without molecular damage."
                        ],
                        definitions: [
                          { term: "Yander", definition: "A traditional wooden spinning wheel used in Kashmir for hand-spinning fine Pashmina fiber." },
                          { term: "Geographical Indication (GI)", definition: "A sign used on products that have a specific geographical origin and possess qualities or a reputation that are due to that origin." }
                        ],
                        qaPairs: [
                          { q: "What is the maximum fiber diameter allowed for GI Pashmina?", a: "To qualify for Geographical Indication (GI) registration, the hand-spun Pashmina fiber must have a mean diameter of less than 15 microns." },
                          { q: "Who conducts the fiber diagnostics?", a: "The diagnostics are performed at certified Srinagar-based testing laboratories using optical scanning microscopes." }
                        ]
                      }, null, 2);
                      const blob = new Blob([json], { type: "application/json" });
                      const a = document.createElement("a");
                      a.href = URL.createObjectURL(blob);
                      a.download = "hcrf_ai_citation_template.json";
                      a.click();
                      URL.revokeObjectURL(a.href);
                    }} className="inline-flex items-center gap-2 bg-white text-cyan-700 border border-cyan-300 px-4 py-2 rounded-lg text-[11px] font-bold shadow hover:bg-cyan-50 transition-colors">
                      <FaDownload /> Download AI Template
                    </button>
                    <label className="cursor-pointer inline-flex items-center gap-2 bg-cyan-900 text-white px-4 py-2 rounded-lg text-[11px] font-bold shadow hover:bg-cyan-800 transition-colors">
                      <FaUpload /> Bulk Upload AI JSON
                      <input type="file" accept=".json" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = async (ev) => {
                        try {
                          const json = JSON.parse(ev.target?.result as string);
                          
                          // Run AI Schema Validator
                          const result = validateAiSchema(json);
                          if (!result.isValid) {
                            toast.error(`Invalid Schema (hcrf_ai_citation_v1): ${result.errors.join(", ")}`);
                            return;
                          }

                          // Warn about unknown keys
                          if (result.warnings.length > 0) {
                            result.warnings.forEach(w => toast(w, { icon: "⚠️", duration: 4000 }));
                          }

                          const validated = result.normalizedData;
                          const nextData = {
                            ...formData,
                            aiSummary: validated.aiSummary || formData.aiSummary,
                            structuredFacts: validated.structuredFacts,
                            definitions: validated.definitions,
                            entitiesMatched: validated.entitiesMatched || formData.entitiesMatched,
                            knowledgeNodesList: validated.knowledgeNodesList || formData.knowledgeNodesList,
                            qaPairs: validated.qaPairs,
                          };
                          setFormData(nextData);
                          
                          // Auto Save
                          setDraftLoading(true);
                          const payload = {
                            ...nextData,
                            slug: nextData.slug || ensureSlug(),
                            price: nextData.price || "0",
                            multipleCrafts: selectedCrafts.join(", "),
                            qaPairs: typeof nextData.qaPairs === 'string' ? nextData.qaPairs : JSON.stringify(nextData.qaPairs),
                            type: "WRITTEN",
                            publishedStatus: "DRAFT"
                          };
                          try {
                            if (onSaveDraft) await onSaveDraft(payload as any, chapters);
                            else await onSubmit(payload as any, chapters);
                            toast.success("✓ AI Data Imported & Auto-Saved! (hcrf_ai_citation_v1)");
                          } catch (err) {
                            toast.error("Failed to auto-save AI data.");
                          } finally {
                            setDraftLoading(false);
                          }
                        } catch (err) {
                          toast.error("Failed to parse JSON file.");
                        }
                      };
                      reader.readAsText(file);
                      e.target.value = ""; // reset
                    }} />
                  </label>
                </div>
              </div>

                <AICitationEngine
                  publicationTitle={formData.title}
                  chapters={chapters}
                  currentData={formData as Partial<AIEngineData>}
                  onApply={handleApplyAI}
                />
              </motion.div>
            )}

            {/* ── 10. READER CONTROLS ──────────────────────────────────────── */}
            {activeSection === "reader" && (
              <motion.div key="reader" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="max-w-4xl mx-auto space-y-6">
                <ReaderExperienceEngine
                  publicationId={formData.id || ""}
                  publicationBlueprint={formData.publicationBlueprint || ""}
                  currentData={formData as Partial<ReaderEngineData>}
                  onApply={handleApplyReader}
                  onPreview={() => {
                    toast.success("Opening Reader Preview Experience...");
                    handlePreviewBook();
                  }}
                />
              </motion.div>
            )}

            {/* ── 11. REVIEW & PUBLISH ─────────────────────────────────────── */}
            {activeSection === "review" && (
              <motion.div key="review" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="max-w-4xl mx-auto space-y-6">
                <PublicationReadinessEngine
                  formData={formData}
                  chapters={chapters}
                  aiScore={formData.readinessScore || 0}
                  onSaveDraft={handleSaveDraft}
                  onSubmitReview={handleSubmitReview}
                  onPublishNow={handlePublishNow}
                  onApprove={handleApprove}
                  onSchedule={() => setShowScheduleModal(true)}
                  onArchive={() => toast.success("Publication archived")}
                  onPreviewBook={handlePreviewBook}
                  onPreviewPublic={handlePreviewPublic}
                  onPreviewReader={() => { toast.success("Opening Reader Preview..."); handlePreviewBook(); }}
                  draftLoading={draftLoading}
                  publishLoading={publishLoading}
                  publicationId={formData.id || publicationId}
                  kgNodes={kgNodes}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── Step navigation bar ────────────────────────────────────────── */}
        <div className="sticky bottom-0 bg-white border-t border-stone-200 px-8 py-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            {/* Prev */}
            <button
              onClick={goPrev}
              disabled={activeSection === "blueprint"}
              className="flex items-center gap-2 px-5 py-2.5 bg-stone-100 text-stone-700 text-xs font-black rounded-xl hover:bg-stone-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FaArrowLeft size={10} /> Previous
            </button>

            {/* Center actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  console.log("SAVE BUTTON FIRED", { component: "BottomSticky", timestamp: Date.now() });
                  handleSaveDraft();
                }}
                disabled={draftLoading}
                style={{ border: "4px solid red", position: "relative", zIndex: 99999 }}
                className="flex items-center gap-2 px-4 py-2.5 bg-stone-100 text-stone-700 text-xs font-black rounded-xl hover:bg-stone-200 transition-all"
              >
                {draftLoading ? <FaSpinner className="animate-spin" size={10} /> : <FaSave size={10} />}
                {saveStatus === "idle" && "Save Draft"}
                {saveStatus === "saving" && "Saving..."}
                {saveStatus === "saved" && "Draft Saved ✓"}
                {saveStatus === "error" && "Save Failed ✗"}
              </button>
              <button
                onClick={handlePreview}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black rounded-xl hover:bg-blue-100 transition-all"
              >
                <FaEye size={10} /> Preview
              </button>
            </div>

            {/* Next / Publish */}
            {activeSection !== "review" && (
              <button
                onClick={goNext}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white text-xs font-black rounded-xl hover:bg-brand-primary/90 shadow-md shadow-brand-primary/20 transition-all"
              >
                Save & Continue <FaArrowRight size={10} />
              </button>
            )}
          </div>
        </div>
      </main>


      {/* ── Smart Bulk Import Modal ───────────────────────────────────────── */}
      <SmartBulkImportModal
        isOpen={showSmartImport}
        onClose={() => setShowSmartImport(false)}
        onImport={handleChapterUpdates}
        existingChapters={chapters}
        publicationBlueprint={formData.publicationBlueprint || ""}
        publicationTitle={formData.title || ""}
      />

      {/* ── Manuscript Import Modal ───────────────────────────────────────── */}
      <ManuscriptImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportChapters}
        publicationTitle={formData.title || undefined}
        initialMode={importMode}
      />

      <ContributorIntelligenceModal
        isOpen={showContributorModal}
        onClose={() => setShowContributorModal(false)}
        onApply={handleApplyContributors}
        existingContributors={contributorsList}
        existingChapters={chapters}
        publicationTitle={formData.title}
      />

      <BulkClassificationModal
        isOpen={showBulkClassification}
        onClose={() => setShowBulkClassification(false)}
        onApply={handleApplyClassification}
        existingTitle={formData.title}
        existingDescription={formData.description || formData.execSummary || ""}
        existingKeywords={formData.keywords || ""}
        existingChapters={chapters}
      />

      <KnowledgeGraphManager
        isOpen={showKGManager}
        onClose={() => setShowKGManager(false)}
        onApply={handleApplyKG}
        existingNodes={kgNodes}
        chapters={chapters}
        publicationTitle={formData.title}
      />

      {/* ── Bulk Metadata Upload Modal ────────────────────────────────── */}
      <BulkMetadataUploadModal
        isOpen={showBulkMetadata}
        onClose={() => setShowBulkMetadata(false)}
        onApply={handleApplyMetadata}
        existingSlug={formData.slug}
      />

      <BulkIntelligenceUploadModal
        isOpen={showBulkIntelligence}
        onClose={() => setShowBulkIntelligence(false)}
        onApply={handleApplyIntelligence}
      />

      {/* ── Schedule Modal ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showScheduleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowScheduleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-sm font-black text-gray-900 mb-1">Schedule Publication</h3>
              <p className="text-xs text-gray-500 mb-4">Publication will automatically go live at the specified time</p>
              <label className="block text-xs font-bold text-gray-600 mb-2">Publish Date & Time</label>
              <input
                type="datetime-local"
                value={scheduleDate}
                onChange={e => setScheduleDate(e.target.value)}
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-brand-primary mb-4"
              />
              <div className="flex gap-3">
                <button onClick={() => setShowScheduleModal(false)}
                  className="flex-1 px-4 py-2.5 bg-stone-100 text-stone-700 text-xs font-black rounded-xl hover:bg-stone-200 transition-all">
                  Cancel
                </button>
                <button onClick={handleSchedule}
                  disabled={!scheduleDate || loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white text-xs font-black rounded-xl hover:bg-purple-700 transition-all disabled:opacity-50">
                  {loading ? <FaSpinner className="animate-spin" size={10} /> : <FaCalendarAlt size={10} />}
                  Schedule
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, color, title, desc, children }: {
  icon: any; color: string; title: string; desc: string; children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-200">
      <div className="flex items-start gap-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
          <Icon className="text-white" size={16} />
        </div>
        <div>
          <h2 className="text-lg font-black text-gray-900">{title}</h2>
          <p className="text-xs text-gray-500 mt-0.5 max-w-xl">{desc}</p>
        </div>
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-stone-200/60 rounded-2xl p-6 shadow-sm space-y-4">
      {children}
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest border-b border-stone-100 pb-2">
      {children}
    </h3>
  );
}



