"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FaSearch,
  FaFilter,
  FaArrowRight,
  FaFilePdf,
  FaBookOpen,
  FaQuoteRight,
  FaLock,
  FaTimes,
  FaCopy,
  FaCheck,
  FaGlobe,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import React from "react";
import { type Publication } from "@/data/publications";
import { motion, AnimatePresence } from "framer-motion";
import HCRFPressCoverTemplateV1 from "./HCRFPressCoverTemplateV1";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import { usePublicationAccess } from "@/hooks/usePublicationAccess";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface PublicationListProps {
  initialPublications: Publication[];
  categories: Category[];
  defaultCategory?: string;
}

type PublicationCardViewModel = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  coverImageUrl: string | null;
  categoryName: string | null;
  estimatedReadingTimeMinutes: number | null;
  author: string;
  isbn: string | null;
  publicationCode: string | null;
  publicationSeries: string | null;
  isbnStatus: string;
  edition: string;
  publisher: string;
  summaryPoints: any;
  badgeLabel: string;
  readerPath: string | null;
};

function toPublicationCardViewModel(pub: any): PublicationCardViewModel {
  return {
    id: pub.id,
    slug: pub.slug,
    title: pub.title,
    subtitle: pub.subtitle || "",
    coverImageUrl: pub.coverImageUrl || pub.imagePath || null,
    categoryName: pub.category?.name || pub.category || "General",
    estimatedReadingTimeMinutes: pub.estimatedReadingTimeMinutes || null,
    author: pub.contributors?.[0]?.name || pub.author || "KHCRF",
    isbn: pub.metadata?.isbn || pub.isbn || pub.features?.isbn || null,
    publicationCode: pub.metadata?.publicationCode || pub.publicationCode || null,
    publicationSeries: pub.metadata?.publicationSeries || pub.publishingSeries || null,
    isbnStatus: pub.isbnStatus || pub.features?.isbnStatus || "Registered",
    edition: pub.editions?.[0]?.edition || (typeof pub.edition === 'object' ? pub.edition.label : (pub.edition || pub.features?.edition || "1st Edition")),
    publisher: (pub.metadata?.publisher === 'KHCRF Publishing' ? 'KHCRF PRESS' : pub.metadata?.publisher) || (pub.publisher === 'KHCRF Publishing' ? 'KHCRF PRESS' : pub.publisher) || pub.features?.publisher || "KHCRF PRESS",
    summaryPoints: pub.tableOfContents || (Array.isArray(pub.features) ? pub.features : undefined),
    badgeLabel: pub.badgeLabel || "",
    readerPath: pub.readerPath || pub.metadata?.readerPath || `/publications/read/${pub.slug}`
  };
}

// Inferred metadata mapper to handle existing dataset dynamically & elegantly
const getPubMetadata = (pub: any) => {
  const f =
    pub.features && typeof pub.features === "object" && !Array.isArray(pub.features)
      ? pub.features
      : {};

  const categoryStr = pub.category?.name || pub.category || "";

  let craftSector = pub.craftSector || f.craftSector || "Pashmina";
  const titleLower = pub?.title ? String(pub.title).toLowerCase() : "";
  const descLower = pub?.description ? String(pub.description).toLowerCase() : "";
  const subtitleLower = pub?.subtitle ? String(pub.subtitle).toLowerCase() : "";
  const combineText = `${titleLower} ${descLower} ${subtitleLower}`;

  if (!pub.craftSector && !f.craftSector) {
    if (combineText.includes("kani")) craftSector = "Kani";
    else if (combineText.includes("carpet")) craftSector = "Carpet";
    else if (combineText.includes("papier") || combineText.includes("paper"))
      craftSector = "Papier-Mâché";
    else if (combineText.includes("wood") || combineText.includes("walnut"))
      craftSector = "Walnut Wood";
    else if (combineText.includes("sozni")) craftSector = "Sozni";
    else if (combineText.includes("crewel")) craftSector = "Crewel";
    else if (combineText.includes("copper") || combineText.includes("metal"))
      craftSector = "Copperware";
    else if (combineText.includes("namda")) craftSector = "Namda";
    else if (combineText.includes("gabba")) craftSector = "Gabba";
    else if (combineText.includes("willow") || combineText.includes("wicker"))
      craftSector = "Willow Wicker";
    else if (combineText.includes("multi-craft") || combineText.includes("handicraft"))
      craftSector = "Multi-Craft";
  }

  let knowledgeDomain = pub.knowledgeDomain || f.knowledgeDomain || "GI Protection";
  if (!pub.knowledgeDomain && !f.knowledgeDomain) {
    if (
      categoryStr === "Best Practices" ||
      pub.publicationType === "BEST_PRACTICE"
    ) {
      knowledgeDomain = "Authentication, GI Protection";
    } else if (
      categoryStr === "Case Studies" ||
      pub.publicationType === "CASE_STUDY"
    ) {
      knowledgeDomain = "Artisan Development, Research";
    } else if (
      categoryStr === "Research Papers" ||
      pub.publicationType === "RESEARCH_PAPER"
    ) {
      knowledgeDomain = "Research, Sustainability";
    } else if (
      categoryStr === "Policy Briefs" ||
      categoryStr === "Policy Guidance"
    ) {
      knowledgeDomain = "Policy, GI Protection";
    } else if (categoryStr === "Market Intelligence") {
      knowledgeDomain = "Market Intelligence, Export";
    }
  }

  let audience = pub.audience || f.audience || "Buyers, Exporters, Policymakers";
  if (!pub.audience && !f.audience) {
    if (categoryStr === "Research Papers") {
      audience = "Researchers, Government, Museums";
    } else if (categoryStr === "Best Practices") {
      audience = "Artisans, Exporters, Consumers";
    }
  }

  let region = pub.region || f.region || "Kashmir";
  if (!pub.region && !f.region) {
    if (
      combineText.includes("central asian") ||
      combineText.includes("global") ||
      combineText.includes("nordic") ||
      combineText.includes("japan") ||
      combineText.includes("international")
    ) {
      region = "Global";
    } else if (combineText.includes("india")) {
      region = "India";
    } else if (combineText.includes("europe")) {
      region = "Europe";
    } else if (combineText.includes("north america") || combineText.includes("us")) {
      region = "North America";
    }
  }

  const language = pub.language || f.language || "English";
  const accessType = pub.accessType || pub.accessTier || undefined;

  return {
    craftSector,
    knowledgeDomain,
    audience,
    region,
    language,
    accessType,
  };
};

// Filter matching helpers
const matchesCraftVal = (craft: string, selected: string) => {
  if (selected === "All") return true;
  const c = craft.toLowerCase();
  const s = selected.toLowerCase();
  if (s === "papier-mâché" && (c.includes("papier") || c.includes("paper")))
    return true;
  if (s === "walnut wood" && c.includes("walnut")) return true;
  return c.includes(s) || s.includes(c);
};

const matchesDomainVal = (domain: string, selected: string) => {
  if (selected === "All") return true;
  return domain.toLowerCase().includes(selected.toLowerCase());
};

const matchesAudienceVal = (audience: string, selected: string) => {
  if (selected === "All") return true;
  return audience.toLowerCase().includes(selected.toLowerCase());
};

const matchesRegionVal = (region: string, selected: string) => {
  if (selected === "All") return true;
  return (
    region.toLowerCase().includes(selected.toLowerCase()) ||
    selected.toLowerCase().includes(region.toLowerCase())
  );
};

const matchesLanguageVal = (language: string, selected: string) => {
  if (selected === "All") return true;
  return language.toLowerCase() === selected.toLowerCase();
};

const matchesAccessVal = (accessType: string, selected: string) => {
  if (selected === "All") return true;
  if (selected === "Open Access") return accessType === "PUBLIC";
  if (selected === "Member Access") return accessType === "REGISTERED";
  if (selected === "Premium Research" || selected === "Institutional Access")
    return accessType === "MEMBER";
  return true;
};

export default function PublicationList({
  initialPublications,
  categories,
  defaultCategory,
}: PublicationListProps) {
  const searchParams = useSearchParams();
  const initialCategory = defaultCategory || searchParams.get("category") || "All";

  const {
    loading: accessLoading,
    checkAccess,
    AccessModal
  } = usePublicationAccess();

  // Primary filter state (Premium Tabs)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // Search filter state
  const [searchTerm, setSearchTerm] = useState("");

  // Secondary filters state
  const [selectedCraft, setSelectedCraft] = useState("All");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [selectedAudience, setSelectedAudience] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedAccess, setSelectedAccess] = useState("All");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Interactive citation modal state
  const [citationPub, setCitationPub] = useState<any | null>(null);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const { user } = useAuth();
  const isMember =
    user?.isMember ||
    user?.isAdmin ||
    user?.role === "ADMIN" ||
    user?.role?.startsWith("MODERATOR_") ||
    user?.role?.startsWith("COLLABORATOR_");

  // Listen to searchParams change (navigation)
  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setSelectedCategory(category);
    } else if (defaultCategory) {
      setSelectedCategory(defaultCategory);
    } else {
      setSelectedCategory("All");
    }
  }, [searchParams, defaultCategory]);

  const PRIMARY_TABS = [
    { name: "All Publications", value: "All" },
    { name: "Best Practices", value: "Best Practices" },
    { name: "Case Studies", value: "Case Studies" },
    { name: "Research Papers", value: "Research Papers" },
    { name: "Knowledge Books", value: "Knowledge Books" },
    { name: "Policy Briefs", value: "Policy Briefs" },
    { name: "Market Intelligence", value: "Market Intelligence" },
  ];

  // Dynamically compute secondary filter values matching request exactly
  const craftOptions = [
    "All",
    "Pashmina",
    "Kani",
    "Carpet",
    "Papier-Mâché",
    "Walnut Wood",
    "Sozni",
    "Crewel",
    "Copperware",
    "Namda",
    "Gabba",
    "Willow Wicker",
    "Multi-Craft",
  ];
  const domainOptions = [
    "All",
    "Authentication",
    "GI Protection",
    "Research",
    "Policy",
    "Market Intelligence",
    "Export",
    "Traceability",
    "Artisan Development",
    "Sustainability",
  ];
  const audienceOptions = [
    "All",
    "Consumers",
    "Artisans",
    "Exporters",
    "Researchers",
    "Government",
    "Museums",
    "Retailers",
    "Collectors",
  ];
  const regionOptions = [
    "All",
    "Kashmir",
    "India",
    "South Asia",
    "Middle East",
    "Europe",
    "North America",
    "Global",
  ];
  const languageOptions = [
    "All",
    "English",
    "Urdu",
    "Kashmiri",
    "Arabic",
    "French",
    "German",
    "Spanish",
  ];
  const accessOptions = [
    "All",
    "Member Access",
    "Premium Research",
    "Institutional Access",
  ];

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCraft("All");
    setSelectedDomain("All");
    setSelectedAudience("All");
    setSelectedRegion("All");
    setSelectedLanguage("All");
    setSelectedAccess("All");
    setCurrentPage(1);
  };

  // Reset pagination on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedCraft, selectedDomain, selectedAudience, selectedRegion, selectedLanguage, selectedAccess]);


  // Ensure publications is always an array to prevent .filter crash
  const validPublications = Array.isArray(initialPublications) ? initialPublications : [];

  const filteredPublications = validPublications.filter((pub) => {
    // 1. Search filter
    const searchLower = searchTerm.toLowerCase();
    const titleLower = pub?.title ? String(pub.title).toLowerCase() : "";
    const subtitleLower = pub?.subtitle ? String(pub.subtitle).toLowerCase() : "";
    const authorLower = pub?.author ? String(pub.author).toLowerCase() : "";
    const descLower = pub?.description ? String(pub.description).toLowerCase() : "";

    const matchesSearch =
      titleLower.includes(searchLower) ||
      subtitleLower.includes(searchLower) ||
      authorLower.includes(searchLower) ||
      descLower.includes(searchLower);

    // 2. Primary Tab Category filter
    const categoryStr = (pub.category as any)?.name || pub.category || "";
    let matchesTab = false;
    if (selectedCategory === "All") {
      matchesTab = true;
    } else if (selectedCategory === "Knowledge Books" || selectedCategory === "E-Publications") {
      matchesTab =
        categoryStr === "Knowledge Books" ||
        categoryStr === "E-Publications" ||
        categoryStr === "E Publications" ||
        categoryStr === "e Book";
    } else {
      matchesTab = categoryStr === selectedCategory;
    }

    // Get inferred metadata
    const meta = getPubMetadata(pub);

    // 3. Secondary filters
    const matchesCraft = matchesCraftVal(meta.craftSector, selectedCraft);
    const matchesDomain = matchesDomainVal(meta.knowledgeDomain, selectedDomain);
    const matchesAudience = matchesAudienceVal(meta.audience, selectedAudience);
    const matchesRegion = matchesRegionVal(meta.region, selectedRegion);
    const matchesLanguage = matchesLanguageVal(meta.language, selectedLanguage);
    const matchesAccess = matchesAccessVal(meta.accessType, selectedAccess);

    return (
      matchesSearch &&
      matchesTab &&
      matchesCraft &&
      matchesDomain &&
      matchesAudience &&
      matchesRegion &&
      matchesLanguage &&
      matchesAccess
    );
  });

  const itemsPerPage = 3;
  const totalPages = Math.ceil(filteredPublications.length / itemsPerPage);
  const paginatedPublications = filteredPublications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  // Handle Copy Citation Clipboard
  const handleCopyCitation = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    toast.success(`${format} citation copied to clipboard!`);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Unified Publication Discovery Panel */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-150 shadow-md mb-12">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
          PUBLICATION LIBRARY
        </h3>

        {/* Category Chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {PRIMARY_TABS.map((tab) => {
            let href = "/publications";
            if (tab.value !== "All") {
              const categoryMapping: Record<string, string> = {
                'Market Intelligence': 'market-intelligence',
                'Policy Briefs': 'policy-briefs',
                'Research Papers': 'research-papers',
                'Best Practices': 'best-practices',
                'Case Studies': 'case-studies',
                'E-Publications': 'knowledge-books',
                'Knowledge Books': 'knowledge-books'
              };
              const dest = categoryMapping[tab.value] || encodeURIComponent(tab.value);
              href = `/publications/${dest}`;
            }

            return (
              <Link
                href={href}
                key={tab.value}
                className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                  selectedCategory === tab.value
                    ? "bg-brand-dark text-white shadow-md"
                    : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-brand-primary hover:text-white hover:border-brand-primary"
                }`}
              >
                {tab.name}
              </Link>
            );
          })}
        </div>

        {/* Search Field */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <FaSearch />
          </div>
          <input
            type="text"
            placeholder="Search by craft, topic, publication, keyword, or policy issue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-4 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none text-sm font-semibold text-gray-700 bg-slate-50/50"
          />
        </div>

        {/* Secondary Dropdown Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Craft Sector */}
          <div className="flex flex-col">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <FaFilter className="text-[8px]" /> Craft Sector
            </label>
            <select
              value={selectedCraft}
              onChange={(e) => setSelectedCraft(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg p-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-brand-primary"
            >
              <option value="All">All Sectors</option>
              {craftOptions.filter((c) => c !== "All").map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Knowledge Domain */}
          <div className="flex flex-col">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <FaFilter className="text-[8px]" /> Domain
            </label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg p-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-brand-primary"
            >
              <option value="All">All Domains</option>
              {domainOptions.filter((d) => d !== "All").map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Audience */}
          <div className="flex flex-col">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <FaFilter className="text-[8px]" /> Audience
            </label>
            <select
              value={selectedAudience}
              onChange={(e) => setSelectedAudience(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg p-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-brand-primary"
            >
              <option value="All">All Audiences</option>
              {audienceOptions.filter((a) => a !== "All").map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Region */}
          <div className="flex flex-col">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <FaGlobe className="text-[8px]" /> Region
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg p-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-brand-primary"
            >
              <option value="All">All Regions</option>
              {regionOptions.filter((r) => r !== "All").map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div className="flex flex-col">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => {
                const val = e.target.value;
                if (val !== "All" && val !== "English") {
                  window.location.href = `/publications/translation-request?lang=${val}`;
                } else {
                  setSelectedLanguage(val);
                }
              }}
              className="bg-white border border-gray-200 rounded-lg p-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-brand-primary"
            >
              <option value="All">All Languages</option>
              {languageOptions.filter((l) => l !== "All").map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* Access Type */}
          <div className="flex flex-col">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              Access Tier
            </label>
            <select
              value={selectedAccess}
              onChange={(e) => setSelectedAccess(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg p-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-brand-primary"
            >
              <option value="All">All Tiers</option>
              {accessOptions.filter((o) => o !== "All").map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Filters Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6 pt-6 border-t border-gray-100 gap-4">
          <div className="flex flex-wrap gap-2">
            {["Open Access", "Members Only", "Free", "Latest"].map((chip) => {
              const isInactive = chip === "Open Access" || chip === "Free";
              const isActive =
                (chip === "Members Only" && selectedAccess === "Member Access");
                
              return (
                <button
                  key={chip}
                  disabled={isInactive}
                  onClick={() => {
                    if (!isInactive && chip === "Members Only") {
                      setSelectedAccess(selectedAccess === "Member Access" ? "All" : "Member Access");
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${
                    isInactive
                      ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed opacity-70"
                      : isActive
                      ? "bg-brand-primary text-white border-brand-primary shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-brand-primary hover:text-brand-primary"
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>

          {/* Clear Filters Helper & Upcoming Button */}
          <div className="flex items-center gap-4">
            {(() => {
              let upcomingHref = "/publications/upcoming";
              if (selectedCategory && selectedCategory !== "All" && selectedCategory !== "Upcoming") {
                const categoryMapping: Record<string, string> = {
                  'Market Intelligence': 'market-intelligence',
                  'Policy Briefs': 'policy-briefs',
                  'Research Papers': 'research-papers',
                  'Best Practices': 'best-practices',
                  'Case Studies': 'case-studies',
                  'E-Publications': 'knowledge-books',
                  'Knowledge Books': 'knowledge-books'
                };
                const dest = categoryMapping[selectedCategory];
                if (dest) {
                  upcomingHref = `/publications/${dest}/upcoming`;
                }
              }
              
              return (
                <Link
                  href={upcomingHref}
                  className="px-4 py-2 bg-brand-dark text-white rounded-xl shadow-sm hover:bg-brand-primary transition-all text-[10px] font-black uppercase tracking-wider flex items-center gap-2"
                >
                  <FaCalendarAlt /> View Upcoming
                </Link>
              );
            })()}
            
            {(searchTerm ||
              selectedCategory !== "All" ||
              selectedCraft !== "All" ||
              selectedDomain !== "All" ||
              selectedAudience !== "All" ||
              selectedRegion !== "All" ||
              selectedLanguage !== "All" ||
              selectedAccess !== "All") && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] font-black text-brand-primary hover:text-brand-primary/80 uppercase tracking-widest flex items-center gap-1.5"
              >
                <FaTimes /> Clear All Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Publication Grid */}
      {filteredPublications.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
            {paginatedPublications.map((pub, index) => {
            const vm = toPublicationCardViewModel(pub);
            const meta = getPubMetadata(pub);
            const hasAccess = meta.accessType === "PUBLIC" || isMember;

            return (
              <motion.div
                key={pub.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 h-full relative"
              >
                {/* Access badge */}
                {(() => {
                  let badgeLabel = "Open Access";
                  let badgeColorClass = "bg-emerald-600 text-white"; // Green
                  
                  if (meta.accessType === "REGISTERED") {
                    badgeLabel = "Registered Access";
                    badgeColorClass = "bg-blue-600 text-white";
                  } else if (meta.accessType === "MEMBER") {
                    badgeLabel = "Member Access";
                    badgeColorClass = "bg-[#C7A15A]/85 text-white/95";
                  }
                  
                  return (
                    <div
                      className={`absolute top-4 right-4 z-20 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1 ${badgeColorClass}`}
                    >
                      {(meta.accessType === "MEMBER" || meta.accessType === "REGISTERED") && <FaLock className="text-[7px]" />}
                      {badgeLabel}
                    </div>
                  );
                })()}

                {/* Cover & Image Container (65% of card, cover occupies 90% space) */}
                <div className="relative aspect-[5/7] overflow-hidden bg-slate-100/40 border-b border-gray-150 flex items-center justify-center p-4 shrink-0">
                  <div className="w-full h-full shadow-lg rounded-r-md rounded-l-sm group-hover:scale-[1.025] transition-transform duration-500 relative z-10">
                    <HCRFPressCoverTemplateV1
                      publicationType={vm.categoryName || "KHCRF PUBLICATION"}
                      year={pub.published || "2026"}
                      title={vm.title}
                      subtitle={vm.subtitle}
                      publicationCode={vm.publicationCode || undefined}
                      isbn={vm.isbn || undefined}
                      edition={vm.edition}
                      isComingSoon={false}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-200/20 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Card Content details */}
                <div className="p-4 sm:p-6 flex flex-col grow">
                  {/* Category Badge & Year */}
                  <div className="flex justify-between items-center mb-3">
                    <span data-editorial-accent-text className="text-[10px] font-black uppercase tracking-widest ">
                      {vm.categoryName}
                    </span>
                    <span className="text-xs text-gray-400 font-semibold flex items-center gap-1">
                      <FaCalendarAlt className="text-[10px]" /> {pub.published || "2026"}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-lg font-bold text-brand-dark leading-snug mb-1.5 group-hover:text-brand-primary transition-colors line-clamp-2">
                    {pub.title}
                  </h3>
                  {pub.subtitle && (
                    <p className="text-xs text-gray-500 italic mb-4 line-clamp-1 font-medium">
                      {pub.subtitle}
                    </p>
                  )}

                  {/* Descriptive field mapping */}
                  <div className="bg-slate-50/50 p-4 rounded-2xl space-y-2 border border-gray-100/50 text-xs font-semibold text-gray-600 mb-6">
                    <div className="flex justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                        Craft
                      </span>
                      <span className="text-brand-dark font-bold">{meta.craftSector}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 shrink-0">
                        Domain
                      </span>
                      <span className="text-brand-dark font-bold text-right line-clamp-1">
                        {meta.knowledgeDomain}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 shrink-0">
                        Audience
                      </span>
                      <span className="text-brand-dark font-bold text-right line-clamp-1">
                        {meta.audience}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4 border-t border-gray-200/50 pt-2 mt-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 shrink-0">
                        ISBN Status
                      </span>
                      <span data-editorial-accent-text className=" font-black text-right flex items-center gap-1 text-[9px] uppercase tracking-wide bg-brand-secondary/5 px-2 py-0.5 rounded border border-brand-secondary/10">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-secondary" />
                        ISBN Registered
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <Link
                      href={`/publications/${pub.slug}`}
                      className="px-4 py-2.5 rounded-xl border border-gray-200 hover:border-brand-primary text-gray-700 hover:text-brand-primary text-xs font-black text-center uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => checkAccess(pub.slug, vm.readerPath)}
                      disabled={accessLoading}
                      className="px-4 py-2.5 rounded-xl bg-brand-dark text-white hover:bg-brand-primary disabled:bg-stone-600/50 text-xs font-black text-center uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <FaBookOpen /> Open Reader
                    </button>
                  </div>

                  {/* Citation trigger option */}
                  <button
                    onClick={() => setCitationPub(pub)}
                    className="mt-4 text-center text-[10px] font-black text-gray-400 hover:text-brand-primary uppercase tracking-widest flex items-center justify-center gap-1 mx-auto"
                  >
                    <FaQuoteRight className="text-[8px]" /> Cite Publication
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-16 gap-3">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 shadow-sm text-gray-400 hover:text-brand-primary hover:border-brand-primary hover:shadow-md transition-all duration-300 disabled:opacity-40 disabled:hover:border-gray-100 disabled:hover:text-gray-400 disabled:hover:shadow-sm disabled:cursor-not-allowed group"
            >
              <FaChevronLeft className="text-sm transition-transform group-hover:-translate-x-0.5" />
            </button>
            
            <div className="flex gap-2 bg-white border border-gray-100 p-1.5 rounded-2xl shadow-sm">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((page, index, array) => {
                  const isGap = index > 0 && page - array[index - 1] > 1;
                  return (
                    <React.Fragment key={page}>
                      {isGap && <span className="px-2 text-gray-300 self-end mb-2 font-black tracking-widest text-xs">...</span>}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl text-xs font-black transition-all duration-300 ${
                          currentPage === page
                            ? "bg-brand-dark text-white shadow-md scale-105"
                            : "text-gray-500 hover:bg-gray-50 hover:text-brand-primary"
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 shadow-sm text-gray-400 hover:text-brand-primary hover:border-brand-primary hover:shadow-md transition-all duration-300 disabled:opacity-40 disabled:hover:border-gray-100 disabled:hover:text-gray-400 disabled:hover:shadow-sm disabled:cursor-not-allowed group"
            >
              <FaChevronRight className="text-sm transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        )}
        </>
      ) : (
        /* Empty State Upgrade */
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl bg-white border border-gray-200 shadow-sm max-w-4xl mx-auto">
          <div data-ui-icon className="w-20 h-20 bg-brand-primary/5 rounded-full flex items-center justify-center mb-6 ">
            <FaBookOpen size={30} className="opacity-75" />
          </div>

          <h3 className="text-2xl font-serif font-black text-brand-dark mb-4">
            Knowledge Library Being Built
          </h3>
          <p className="text-gray-600 max-w-xl mx-auto mb-8 leading-relaxed text-sm">
            KHCRF is preparing a structured publication archive covering Kashmir handicrafts, artisan livelihoods, authentication, GI protection, market access, and heritage preservation.
          </p>

          <div className="bg-slate-50 border border-gray-150 p-6 rounded-2xl max-w-lg mx-auto mb-8 text-left">
            <span className="text-[9px] font-black text-brand-primary bg-brand-primary/10 px-2 py-1 rounded-md uppercase tracking-wider inline-block mb-3">
              Featured publication in preparation
            </span>
            {(() => {
              if (selectedCategory === "Market Intelligence") {
                return (
                  <>
                    <h4 className="text-sm font-bold text-brand-dark mb-1">Luxury Consumer Trends in North America</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">Demand forecasting for authentic Pashmina targeting exporters and global brands.</p>
                  </>
                );
              }
              if (selectedCategory === "Policy Briefs") {
                return (
                  <>
                    <h4 className="text-sm font-bold text-brand-dark mb-1">Geographical Indications & Global IP</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">Securing Kashmir&apos;s Heritage through legal frameworks and trade bodies.</p>
                  </>
                );
              }
              if (selectedCategory === "Research Papers") {
                return (
                  <>
                    <h4 className="text-sm font-bold text-brand-dark mb-1">Historical Trajectories of Walnut Wood Carving</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">Evolution of motifs from 18th to 21st century for historians and museums.</p>
                  </>
                );
              }
              if (selectedCategory === "Case Studies") {
                return (
                  <>
                    <h4 className="text-sm font-bold text-brand-dark mb-1">Revival of the Kani Weaving Cooperative</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">A success story in collective bargaining for cooperatives and academics.</p>
                  </>
                );
              }
              if (selectedCategory === "Knowledge Books" || selectedCategory === "E-Publications") {
                return (
                  <>
                    <h4 className="text-sm font-bold text-brand-dark mb-1">The Encyclopedia of Kashmir Crafts</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">Volume I: Textiles and Weaves. For global libraries, researchers, and collectors.</p>
                  </>
                );
              }
              // Default (Best Practices or All)
              return (
                <>
                  <h4 className="text-sm font-bold text-brand-dark mb-1">Best Practices for Pashmina Authentication</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">A technical and practical guide for buyers, artisans, exporters, certification agencies, and policymakers.</p>
                </>
              );
            })()}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {(() => {
              let upcomingHref = "/publications/upcoming";
              if (selectedCategory && selectedCategory !== "All" && selectedCategory !== "Upcoming") {
                const categoryMapping: Record<string, string> = {
                  'Market Intelligence': 'market-intelligence',
                  'Policy Briefs': 'policy-briefs',
                  'Research Papers': 'research-papers',
                  'Best Practices': 'best-practices',
                  'Case Studies': 'case-studies',
                  'E-Publications': 'knowledge-books',
                  'Knowledge Books': 'knowledge-books'
                };
                const dest = categoryMapping[selectedCategory];
                if (dest) {
                  upcomingHref = `/publications/${dest}/upcoming`;
                }
              }
              return (
                <Link
                  href={upcomingHref}
                  className="px-6 py-3 bg-brand-primary text-white rounded-xl shadow-md hover:bg-brand-primary/95 transition-all text-xs font-black uppercase tracking-wider text-center"
                >
                  View Upcoming Publications
                </Link>
              );
            })()}
            <Link
              href="/publications/contribute"
              className="px-6 py-3 border border-gray-200 hover:border-brand-primary text-gray-700 hover:text-brand-primary transition-all rounded-xl text-xs font-black uppercase tracking-wider bg-white text-center"
            >
              Contribute Research
            </Link>
          </div>
        </div>
      )}

      {/* Citation Overlay Modal */}
      <AnimatePresence>
        {citationPub && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8 max-w-2xl w-full border border-gray-100 shadow-2xl relative"
            >
              <button
                onClick={() => setCitationPub(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-brand-dark text-lg"
              >
                <FaTimes />
              </button>

              <h3 className="text-xl font-bold font-serif text-brand-dark mb-6 flex items-center gap-2">
                <FaQuoteRight data-ui-icon  className="" /> Cite Publication
              </h3>

              <div className="space-y-6">
                {/* APA */}
                <div className="p-4 bg-slate-50 rounded-xl border border-gray-100 relative group">
                  <div className="flex justify-between items-center mb-2">
                    <span data-editorial-accent-text className="text-[9px] font-black  uppercase tracking-widest">
                      APA (7th Edition)
                    </span>
                    <button
                      onClick={() =>
                        handleCopyCitation(
                          `Hamadan Craft Revival Foundation. (${citationPub.published || "2026"}). ${citationPub.title}: ${citationPub.subtitle || ""}. KHCRF Press.`,
                          "APA"
                        )
                      }
                      className="text-gray-400 hover:text-brand-primary text-xs flex items-center gap-1 font-bold"
                    >
                      {copiedFormat === "APA" ? <FaCheck /> : <FaCopy />}
                    </button>
                  </div>
                  <p className="text-xs font-mono text-gray-700 pr-6 leading-relaxed select-all">
                    Hamadan Craft Revival Foundation. ({citationPub.published || "2026"}).{" "}
                    <span className="italic">{citationPub.title}: {citationPub.subtitle || ""}</span>. KHCRF Press.
                  </p>
                </div>

                {/* Harvard */}
                <div className="p-4 bg-slate-50 rounded-xl border border-gray-100 relative group">
                  <div className="flex justify-between items-center mb-2">
                    <span data-editorial-accent-text className="text-[9px] font-black  uppercase tracking-widest">
                      Harvard
                    </span>
                    <button
                      onClick={() =>
                        handleCopyCitation(
                          `Hamadan Craft Revival Foundation, ${citationPub.published || "2026"}. ${citationPub.title}: ${citationPub.subtitle || ""}, KHCRF Press.`,
                          "Harvard"
                        )
                      }
                      className="text-gray-400 hover:text-brand-primary text-xs flex items-center gap-1 font-bold"
                    >
                      {copiedFormat === "Harvard" ? <FaCheck /> : <FaCopy />}
                    </button>
                  </div>
                  <p className="text-xs font-mono text-gray-700 pr-6 leading-relaxed select-all">
                    Hamadan Craft Revival Foundation, {citationPub.published || "2026"}.{" "}
                    <span className="italic">{citationPub.title}: {citationPub.subtitle || ""}</span>, KHCRF Press.
                  </p>
                </div>

                {/* Chicago */}
                <div className="p-4 bg-slate-50 rounded-xl border border-gray-100 relative group">
                  <div className="flex justify-between items-center mb-2">
                    <span data-editorial-accent-text className="text-[9px] font-black  uppercase tracking-widest">
                      Chicago (Author-Date)
                    </span>
                    <button
                      onClick={() =>
                        handleCopyCitation(
                          `Hamadan Craft Revival Foundation. ${citationPub.published || "2026"}. "${citationPub.title}: ${citationPub.subtitle || ""}." KHCRF Press.`,
                          "Chicago"
                        )
                      }
                      className="text-gray-400 hover:text-brand-primary text-xs flex items-center gap-1 font-bold"
                    >
                      {copiedFormat === "Chicago" ? <FaCheck /> : <FaCopy />}
                    </button>
                  </div>
                  <p className="text-xs font-mono text-gray-700 pr-6 leading-relaxed select-all">
                    Hamadan Craft Revival Foundation. {citationPub.published || "2026"}. &quot;
                    {citationPub.title}: {citationPub.subtitle || ""}.&quot; KHCRF Press.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setCitationPub(null)}
                  className="px-6 py-2.5 bg-brand-dark text-white rounded-xl text-xs font-black uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AccessModal />
    </div>
  );
}
