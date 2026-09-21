export interface CanonicalPublicationPresentation {
  id: string;
  slug: string;

  title: string;
  subtitle: string | null;

  cover: {
    type: "RENDERED_TEMPLATE";
    templateVersion: string;
  };

  authors: string[];
  
  publicationType: string;
  series: string;
  edition: string;
  isbn: string | null;
  isbnStatus: string;
  publicationCode: string;
  publishingSeries: string | null;
  doi: string | null;
  publisher: string;
  publicationYear: string;

  executiveSummary: string | null;
  readingTime: string;
  pageCount: number;

  language: string;
  craftSector: string | null;
  domain: string | null;
  audience: string | null;
  region: string | null;
  whyMatters: string | null;
  whoShouldRead: string | null;
  
  keyInsights: string[];
  relatedCrafts: string[];
  relatedPolicies: string[];
  
  // Nested rich objects for specific sections
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chapters?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  citations?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reviews?: any[];
  accessTier: string;
  pricing: {
    amount: number;
    currency: string;
  } | null;
  readerEnabled: boolean;
  readerPath: string | null;
  coverImageUrl: string | null;
  publicationStatus: string;
  readerAvailability: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toCanonicalPublicationPresentation(raw: any): CanonicalPublicationPresentation {
  const pub = raw?.data || raw?.publication || raw || {};

  const title = pub.title || "Untitled";
  const author = pub.authors?.[0] || pub.contributors?.[0]?.name || pub.author || "KHCRF Editorial Board";

  const keyInsightsList = pub.keyInsights
    ? (Array.isArray(pub.keyInsights) ? pub.keyInsights : pub.keyInsights.split(",").map((i: string) => i.trim()).filter(Boolean))
    : [];

  return {
    id: pub.id || "",
    slug: pub.slug || "",
    title,
    subtitle: pub.subtitle || null,
    cover: pub.cover || {
      type: "RENDERED_TEMPLATE",
      templateVersion: "v1.0"
    },
    authors: Array.isArray(pub.authors) ? pub.authors : [author],
    publicationType: (() => {
      const rawType = pub.publicationType || "";
      const typeLower = rawType.toLowerCase();
      
      if (typeLower === "best_practice" || typeLower === "best practice") return "Best Practice";
      if (typeLower === "case_study" || typeLower === "case study") return "Case Study";
      if (typeLower === "ebook" || typeLower === "knowledge book" || typeLower === "knowledge_book") return "Knowledge Book";
      if (typeLower === "research_paper" || typeLower === "research paper") {
        const catName = pub.category?.name || pub.category || "";
        const catNameLower = catName.toLowerCase();
        if (catNameLower.includes("policy") || catNameLower.includes("governance")) return "Policy Brief";
        if (catNameLower.includes("intelligence") || catNameLower.includes("market")) return "Market Intelligence";
        return "Research Paper";
      }

      const catName = pub.category?.name || pub.category || "";
      const catNameLower = catName.toLowerCase();
      if (catNameLower.includes("practice")) return "Best Practice";
      if (catNameLower.includes("case")) return "Case Study";
      if (catNameLower.includes("research") || catNameLower.includes("paper")) return "Research Paper";
      if (catNameLower.includes("policy") || catNameLower.includes("governance")) return "Policy Brief";
      if (catNameLower.includes("intelligence") || catNameLower.includes("market")) return "Market Intelligence";
      if (catNameLower.includes("book") || catNameLower.includes("e-pub") || catNameLower.includes("epub")) return "Knowledge Book";
      return "Market Intelligence";
    })(),
    series: pub.series || pub.category?.name || pub.category || "General Series",
    edition: typeof pub.edition === 'object' && pub.edition !== null
      ? (pub.edition.label || pub.edition.edition || "1st Edition")
      : (pub.edition || pub.features?.edition || "1st Edition"),
    isbn: pub.isbn || null,
    isbnStatus: pub.isbnStatus || (pub.isbn ? "REGISTERED" : "Pending"),
    publicationCode: pub.publicationCode || `KHCRF-MI-2026-0001`,
    publishingSeries: pub.publishingSeries || null,
    doi: pub.doi || null,
    publisher: pub.publisher || "KHCRF PRESS",
    publicationYear: pub.publicationYear || pub.published || "2026",
    executiveSummary: pub.executiveSummary || pub.description || null,
    readingTime: pub.readingTime || (pub.estimatedReadingTimeMinutes ? `${pub.estimatedReadingTimeMinutes} min read` : "45 min read"),
    pageCount: pub.pageCount || pub.pages || 0,
    language: pub.language || "English",
    craftSector: pub.craftSector || "Multi-Craft",
    domain: pub.domain || "Authentication",
    audience: pub.audience || "Researchers",
    region: pub.region || "Kashmir",
    whyMatters: pub.whyMatters || null,
    whoShouldRead: pub.whoShouldRead || null,
    keyInsights: keyInsightsList,
    relatedCrafts: pub.relatedCrafts || [],
    relatedPolicies: pub.relatedPolicies || [],
    chapters: pub.chapters || [],
    citations: pub.citations || [],
    reviews: pub.reviews || [],
    accessTier: pub.accessTier || pub.accessType || "PUBLIC",
    pricing: pub.pricing || (pub.price ? { amount: pub.price, currency: "INR" } : null),
    readerEnabled: pub.readerEnabled ?? true,
    readerPath: pub.readerPath || `/publications/read/${pub.slug}`,
    coverImageUrl: pub.coverImageUrl || pub.imagePath || null,
    publicationStatus: pub.publishedStatus || pub.status || (pub.readerEnabled ? "RELEASED" : "FORTHCOMING"),
    readerAvailability: pub.readerAvailability || (pub.readerEnabled ? "AVAILABLE" : "NOT_AVAILABLE")
  };
}
