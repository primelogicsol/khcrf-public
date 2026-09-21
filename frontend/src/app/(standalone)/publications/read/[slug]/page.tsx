"use client";

export const dynamic = 'force-dynamic';

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import {
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaList,
  FaBookOpen,
  FaBookmark,
  FaLock,
  FaGlobe,
  FaTimes,
  FaMoon,
  FaSun,
  FaFont,
  FaCopy,
  FaHighlighter,
  FaInfoCircle,
  FaCheckCircle,
  FaQuoteRight,
  FaChevronDown,
  FaStar,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { normalizeParagraphContent } from "@/lib/publications/normalizePublicationContent";

function parsePageContent(content: any) {
  if (!content) return [];
  if (Array.isArray(content)) return content;
  if (typeof content === "object") {
    if (Array.isArray(content.blocks)) return content.blocks;
    return [content];
  }
  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && typeof parsed === "object" && Array.isArray(parsed.blocks)) return parsed.blocks;
      if (parsed && typeof parsed === "object") return [parsed];
      return [];
    } catch {
      return content.trim() ? [{ type: "Paragraph", text: content }] : [];
    }
  }
  return [];
}

// --- Types ---
interface SavedNote {
  id: string;
  chapterIndex: number;
  pageIndex: number;
  text: string;
  selectedText?: string;
  timestamp: string;
}

interface SavedBookmark {
  chapterIndex: number;
  pageIndex: number;
  timestamp: string;
}

// --- Security Watermark & Copy Prevention ---
const SecurityLayer = ({
  children,
  userIdentity,
}: {
  children: React.ReactNode;
  userIdentity: string;
}) => {
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && (e.key === "p" || e.key === "s" || e.key === "c" || e.key === "u")) ||
        (e.metaKey && (e.key === "p" || e.key === "s" || e.key === "c" || e.key === "u"))
      ) {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("contextmenu", (e) => e.preventDefault());

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("contextmenu", (e) => e.preventDefault());
    };
  }, []);

  return (
    <div
      className="relative select-none w-full h-full animate-fadeIn"
      onContextMenu={handleContextMenu}
      onDragStart={(e) => e.preventDefault()}
    >
      {/* Super Subtle Background Security Watermark */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden opacity-[0.015] select-none flex flex-wrap content-center justify-center gap-32 rotate-[-12deg]">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="text-xl font-bold text-stone-900 whitespace-nowrap">
            {userIdentity} • KHCRF SECURE CORE
          </div>
        ))}
      </div>
      <div className="relative z-10 pointer-events-auto h-full">{children}</div>
    </div>
  );
};

export default function KnowledgeReaderPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const slug = params?.slug as string;

  // --- Core States ---
  const [publication, setPublication] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"toc" | "notes" | "bookmarks" | "reviews">("toc");
  const [themeMode, setThemeMode] = useState<"warm" | "dark" | "white">("warm");
  const [fontSizePercent, setFontSizePercent] = useState<number>(100);

  // --- Reading Position State ---
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [viewportMode, setViewportMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // --- Interactive Side Panels ---
  const [knowledgeOpen, setKnowledgeOpen] = useState(false);
  const [activeKnowledgeTerm, setActiveKnowledgeTerm] = useState<string | null>(null);
  const [citationOpen, setCitationOpen] = useState(false);
  const [selectedTextForHighlight, setSelectedTextForHighlight] = useState<string>("");

  // --- Saved Bookmarks & Notes (Persisted via LocalStorage) ---
  const [notes, setNotes] = useState<SavedNote[]>([]);
  const [bookmarks, setBookmarks] = useState<SavedBookmark[]>([]);
  const [newNoteText, setNewNoteText] = useState("");

  // --- Review Submission State ---
  const [formRating, setFormRating] = useState<number>(5);
  const [formTitle, setFormTitle] = useState<string>("");
  const [formReview, setFormReview] = useState<string>("");
  const [formReviewType, setFormReviewType] = useState<string>("Researcher");
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
  const [savedPosition, setSavedPosition] = useState<{ chapterIndex: number; pageIndex: number } | null>(null);

  // --- Membership / Access Tier State ---
  const [membershipStatus, setMembershipStatus] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isApprovedMember = user && membershipStatus === "APPROVED";

  interface ContentBlock {
    type: "chapter-header" | "chapter-title" | "page-title" | "paragraph";
    text: string;
  }

  const pageContainerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [paginatedPages, setPaginatedPages] = useState<ContentBlock[][]>([[]]);

  const currentPageIndexRef = useRef(currentPageIndex);
  useEffect(() => {
    currentPageIndexRef.current = currentPageIndex;
  }, [currentPageIndex]);

  const paginatedPagesRef = useRef(paginatedPages);
  useEffect(() => {
    paginatedPagesRef.current = paginatedPages;
  }, [paginatedPages]);

  const bodyFontPx =
    fontSizePercent === 60 ? 12 :
    fontSizePercent === 70 ? 14 :
    fontSizePercent === 80 ? 16 :
    fontSizePercent === 90 ? 18 :
    fontSizePercent === 100 ? 20 :
    fontSizePercent === 110 ? 22 :
    fontSizePercent === 120 ? 24 :
    26; // 130%

  const headingScale =
    fontSizePercent === 60 ? 0.80 :
    fontSizePercent === 70 ? 0.85 :
    fontSizePercent === 80 ? 0.90 :
    fontSizePercent === 90 ? 0.95 :
    fontSizePercent === 100 ? 1.00 :
    fontSizePercent === 110 ? 1.05 :
    fontSizePercent === 120 ? 1.10 :
    1.15; // 130%

  // --- Check Access Tier Gate ---
  const accessState = useMemo(() => {
    if (!publication) return { locked: false, reason: null as string | null };
    const accessType = publication.accessType || "PUBLIC";

    // PUBLIC: always open
    if (accessType === "PUBLIC") return { locked: false, reason: null };

    // First chapter is always free for all tiers
    if (currentChapterIndex === 0) return { locked: false, reason: null };

    // REGISTERED: requires logged-in user for chapters 2+
    if (accessType === "REGISTERED") {
      if (!user) return { locked: true, reason: "register" };
      return { locked: false, reason: null };
    }

    // MEMBER: requires approved membership for chapters 2+
    if (accessType === "MEMBER") {
      if (!user) return { locked: true, reason: "membership-login" };
      if (!membershipStatus) return { locked: true, reason: "get-membership" };
      if (membershipStatus === "PENDING") return { locked: true, reason: "membership-pending" };
      if (membershipStatus === "REJECTED") return { locked: true, reason: "membership-rejected" };
      if (membershipStatus === "APPROVED") return { locked: false, reason: null };
      return { locked: true, reason: "get-membership" };
    }

    return { locked: false, reason: null };
  }, [publication, user, currentChapterIndex, membershipStatus]);

  // --- Fetch Publication Content & Generate Mock Book Structure if missing ---
  useEffect(() => {
    const loadPublication = async () => {
      if (!slug) return;
      try {
        const res = await api.get(`/publications/content/${slug}`);
        const data = res.data?.data || res.data;
        
        if (data.chapters && data.chapters.length > 0) {
          data.chapters = data.chapters.map((ch: any) => {
            if (ch.pages && ch.pages.length > 0) return ch;
            if (ch.paragraphs && ch.paragraphs.length > 0) return ch;
            
            const rawContent = ch.fullContent || ch.content || "";
            const paragraphs = rawContent
              .split(/<\/p>|\n\n|\r\n\r\n/)
              .map((p: string) => p.replace(/<[^>]*>/g, "").trim())
              .filter((p: string) => p.length > 0);

            return {
              ...ch,
              paragraphs: paragraphs.length > 0 ? paragraphs : ["Content is under review."]
            };
          });
        } else {
          data.chapters = [];
        }

        setPublication(data);
      } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          toast.error("Access Denied: You must be an approved member to read this publication.");
          router.push(`/publications/${slug}`);
        } else {
          console.error("Failed to load publication", error);
        }
      } finally {
        setLoading(false);
      }
    };
    loadPublication();
  }, [slug]);

  // --- Load and Save Bookmarks/Notes & Settings/Read Position ---
  useEffect(() => {
    if (!slug) return;
    const storedNotes = localStorage.getItem(`hcrf_notes_${slug}`);
    const storedBookmarks = localStorage.getItem(`hcrf_bookmarks_${slug}`);
    const savedTheme = localStorage.getItem("hcrf_reader_theme");
    const savedFontSize = localStorage.getItem("hcrf-reader-font-size");
    const savedReadPos = localStorage.getItem(`hcrf_read_pos_${slug}`);

    if (storedNotes) setNotes(JSON.parse(storedNotes));
    if (storedBookmarks) setBookmarks(JSON.parse(storedBookmarks));
    if (savedTheme) setThemeMode(savedTheme as any);
    if (savedFontSize) setFontSizePercent(Number(savedFontSize));
    if (savedReadPos) {
      const pos = JSON.parse(savedReadPos);
      if (pos.chapterIndex > 0 || pos.pageIndex > 0) {
        setSavedPosition(pos);
      }
    }
  }, [slug]);

  // Persist theme choice
  useEffect(() => {
    localStorage.setItem("hcrf_reader_theme", themeMode);
  }, [themeMode]);

  // Persist font size choice
  useEffect(() => {
    localStorage.setItem("hcrf-reader-font-size", String(fontSizePercent));
  }, [fontSizePercent]);

  // Persist reading position
  useEffect(() => {
    if (!slug || loading || !publication) return;
    localStorage.setItem(
      `hcrf_read_pos_${slug}`,
      JSON.stringify({ chapterIndex: currentChapterIndex, pageIndex: currentPageIndex })
    );
  }, [currentChapterIndex, currentPageIndex, slug, loading, publication]);

  // Fetch membership status for MEMBER access tier
  useEffect(() => {
    if (user) {
      api.get("/membership/my-membership")
        .then((res) => setMembershipStatus(res.data?.status || null))
        .catch(() => setMembershipStatus(null));
    } else {
      setMembershipStatus(null);
    }
  }, [user]);

  const saveNotes = (updatedNotes: SavedNote[]) => {
    setNotes(updatedNotes);
    localStorage.setItem(`hcrf_notes_${slug}`, JSON.stringify(updatedNotes));
  };

  const saveBookmarks = (updatedBookmarks: SavedBookmark[]) => {
    setBookmarks(updatedBookmarks);
    localStorage.setItem(`hcrf_bookmarks_${slug}`, JSON.stringify(updatedBookmarks));
  };

  // --- Pagination & Chapter Helpers ---
  const paginateBlocksFallback = useCallback((blocks: ContentBlock[]) => {
    if (!blocks || blocks.length === 0) return [[]];
    let maxParagraphs = 4;
    let maxWords = 400;
    if (viewportMode === "mobile") {
      maxParagraphs = 2;
      maxWords = 150;
    } else if (viewportMode === "tablet") {
      maxParagraphs = 3;
      maxWords = 250;
    }
    
    const scaleFactor = fontSizePercent / 100;
    maxParagraphs = Math.max(1, Math.round(maxParagraphs / scaleFactor));
    maxWords = Math.max(50, Math.round(maxWords / scaleFactor));

    const pages: ContentBlock[][] = [];
    let currentPage: ContentBlock[] = [];
    let paragraphCount = 0;
    let wordCount = 0;

    blocks.forEach((block) => {
      if (block.type === "paragraph") {
        const words = block.text.split(/\s+/).filter(Boolean).length;
        if (currentPage.length > 0 && (paragraphCount >= maxParagraphs || wordCount + words > maxWords)) {
          pages.push(currentPage);
          currentPage = [block];
          paragraphCount = 1;
          wordCount = words;
        } else {
          currentPage.push(block);
          paragraphCount++;
          wordCount += words;
        }
      } else {
        if (currentPage.length > 0 && paragraphCount >= maxParagraphs) {
          pages.push(currentPage);
          currentPage = [block];
          paragraphCount = 0.5;
          wordCount = 0;
        } else {
          currentPage.push(block);
          paragraphCount += 0.5;
        }
      }
    });

    if (currentPage.length > 0) {
      pages.push(currentPage);
    }
    return pages.length > 0 ? pages : [[]];
  }, [viewportMode, fontSizePercent]);

  const currentChapter = useMemo(() => {
    if (!publication || !publication.chapters) return null;
    return publication.chapters[currentChapterIndex] || null;
  }, [publication, currentChapterIndex]);

  const allChapterBlocks = useMemo(() => {
    if (!currentChapter) return [];
    const blocks: ContentBlock[] = [];
    blocks.push({
      type: "chapter-header",
      text: `Chapter ${currentChapterIndex + 1}`
    });
    blocks.push({
      type: "chapter-title",
      text: currentChapter.chapterTitle || currentChapter.title || ""
    });

    if (currentChapter.pages && currentChapter.pages.length > 0) {
      currentChapter.pages.forEach((p: any) => {
        if (p.title) {
          blocks.push({
            type: "page-title",
            text: p.title
          });
        }
        const parsedBlocks = parsePageContent(p.content);
        parsedBlocks.forEach((b: any) => {
          blocks.push({
            type: b.type === "Heading" ? "page-title" : "paragraph",
            text: b.text || b
          });
        });
      });
    } else if (currentChapter.paragraphs) {
      currentChapter.paragraphs.forEach((text: string) => {
        blocks.push({
          type: "paragraph",
          text
        });
      });
    }
    return blocks;
  }, [currentChapter, currentChapterIndex]);

  const recomputePagination = useCallback(() => {
    if (allChapterBlocks.length === 0) {
      setPaginatedPages([[]]);
      return;
    }

    // Capture the first paragraph of the current page before reflow to keep visual alignment
    const firstParaOfCurrentPage = paginatedPagesRef.current[currentPageIndexRef.current]?.find(b => b.type === "paragraph")?.text;

    const measureEl = measureRef.current;
    if (!measureEl) {
      const fallback = paginateBlocksFallback(allChapterBlocks);
      setPaginatedPages(fallback);
      return;
    }

    const width = window.innerWidth;
    const cardEl = pageContainerRef.current;
    const contentContainer = cardEl?.querySelector(".reader-content-scalable") as HTMLElement;

    // Minimize safety margins to maximize card filling (85-95% space utilization)
    let bottomSafetyBuffer = 32;
    if (width <= 768) {
      bottomSafetyBuffer = 20;
    }

    const usableHeight = (contentContainer?.clientHeight || 600) - bottomSafetyBuffer;

    // Calculate card width and exact padding from DOM
    const cardWidth = cardEl?.clientWidth || 900;
    const cardStyle = cardEl ? window.getComputedStyle(cardEl) : null;
    const paddingLeft = cardStyle ? parseFloat(cardStyle.paddingLeft) : 56;
    const paddingRight = cardStyle ? parseFloat(cardStyle.paddingRight) : 56;

    // Force width of measure element matching the real content card using setProperty for !important override
    const innerWidthVal = `${cardWidth - paddingLeft - paddingRight}px`;
    measureEl.style.setProperty("width", innerWidthVal, "important");
    measureEl.style.setProperty("max-width", innerWidthVal, "important");

    const pages: ContentBlock[][] = [];
    let currentPage: ContentBlock[] = [];

    const getMeasuredHeight = (pageBlocks: ContentBlock[]) => {
      let html = "";
      
      pageBlocks.forEach((block) => {
        if (block.type === "chapter-header") {
          html += `
            <span class="text-[10px] font-black tracking-widest text-brand-secondary uppercase block mb-1">
              ${block.text}
            </span>
          `;
        } else if (block.type === "chapter-title") {
          html += `
            <h3 class="font-serif text-lg font-bold text-stone-500 uppercase tracking-wide block mb-3 border-b border-brand-primary/10 pb-4 mb-6">
              ${block.text}
            </h3>
          `;
        } else if (block.type === "page-title") {
          html += `
            <h2 class="font-serif font-black text-2xl md:text-3xl leading-tight text-brand-dark mt-1 mb-6">
              ${block.text}
            </h2>
          `;
        } else if (block.type === "paragraph") {
          const isFirstParaInChapter = allChapterBlocks.findIndex(b => b.type === "paragraph") === allChapterBlocks.findIndex(b => b.text === block.text && b.type === "paragraph");
          const dropCapClass = isFirstParaInChapter ? "drop-cap first-letter:text-5xl first-letter:font-black first-letter:float-left first-letter:mr-3 first-letter:text-brand-primary first-letter:font-serif" : "";
          html += `
            <p class="text-base md:text-lg leading-[1.7] font-serif ${dropCapClass}">
              ${block.text}
            </p>
          `;
        }
      });

      measureEl.innerHTML = html;
      return measureEl.scrollHeight;
    };

    for (let i = 0; i < allChapterBlocks.length; i++) {
      const block = allChapterBlocks[i];
      const testPage = [...currentPage, block];
      const measuredHeight = getMeasuredHeight(testPage);

      if (measuredHeight > usableHeight && currentPage.length > 0) {
        pages.push(currentPage);
        currentPage = [block];
      } else {
        currentPage = testPage;
      }
    }

    if (currentPage.length > 0) {
      pages.push(currentPage);
    }

    measureEl.innerHTML = "";
    setPaginatedPages(pages.length > 0 ? pages : [[]]);

    if (firstParaOfCurrentPage) {
      const newPageIndex = pages.findIndex(page => page.some(b => b.type === "paragraph" && b.text === firstParaOfCurrentPage));
      if (newPageIndex !== -1) {
        setCurrentPageIndex(newPageIndex);
      }
    }

    console.log("KHCRF Reader Paginator debug:", {
      cardWidth,
      measuredWidth: measureEl.clientWidth,
      bottomSafetyBuffer,
      usableHeight,
      pagesCreated: pages.length
    });
  }, [currentChapter, currentChapterIndex, fontSizePercent, viewportMode, paginateBlocksFallback, bodyFontPx, headingScale, allChapterBlocks]);

  const currentChapterPages = paginatedPages;

  // Trigger recomputation on changes
  useEffect(() => {
    const timer = setTimeout(() => {
      recomputePagination();
    }, 50);
    return () => clearTimeout(timer);
  }, [currentChapter, fontSizePercent, recomputePagination]);

  // Correct out-of-bounds page indexes on layout structure changes
  useEffect(() => {
    if (currentPageIndex >= currentChapterPages.length) {
      setCurrentPageIndex(Math.max(0, currentChapterPages.length - 1));
    }
  }, [currentChapterPages, currentPageIndex]);

  // Handle viewport responsive mode changes & trigger dynamic pagination recomputation
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 768) {
        setViewportMode("mobile");
      } else if (width <= 1024) {
        setViewportMode("tablet");
      } else {
        setViewportMode("desktop");
      }
      recomputePagination();
    };
    
    const timer = setTimeout(handleResize, 100);
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [recomputePagination]);

  const getChapterBlocks = useCallback((ch: any, chIdx: number) => {
    const blocks: ContentBlock[] = [];
    blocks.push({
      type: "chapter-header",
      text: `Chapter ${chIdx + 1}`
    });
    blocks.push({
      type: "chapter-title",
      text: ch.chapterTitle || ch.title || ""
    });

    if (ch.pages && ch.pages.length > 0) {
      ch.pages.forEach((p: any) => {
        if (p.title) {
          blocks.push({
            type: "page-title",
            text: p.title
          });
        }
        const content = normalizeParagraphContent(p.content);
        content.forEach((text: string) => {
          blocks.push({
            type: "paragraph",
            text
          });
        });
      });
    } else if (ch.paragraphs) {
      ch.paragraphs.forEach((text: string) => {
        blocks.push({
          type: "paragraph",
          text
        });
      });
    }
    return blocks;
  }, []);

  const totalPagesInBook = useMemo(() => {
    if (!publication || !publication.chapters) return 0;
    return publication.chapters.reduce((acc: number, ch: any, idx: number) => {
      const chBlocks = getChapterBlocks(ch, idx);
      const pages = paginateBlocksFallback(chBlocks);
      return acc + pages.length;
    }, 0);
  }, [publication, getChapterBlocks, paginateBlocksFallback]);

  const currentPageOffset = useMemo(() => {
    if (!publication || !publication.chapters) return 0;
    let offset = 0;
    for (let i = 0; i < currentChapterIndex; i++) {
      const ch = publication.chapters[i];
      const chBlocks = getChapterBlocks(ch, i);
      const pages = paginateBlocksFallback(chBlocks);
      offset += pages.length;
    }
    return offset + currentPageIndex + 1;
  }, [publication, currentChapterIndex, currentPageIndex, getChapterBlocks, paginateBlocksFallback]);

  const progressPercentage = useMemo(() => {
    if (totalPagesInBook === 0) return 0;
    return Math.round((currentPageOffset / totalPagesInBook) * 100);
  }, [currentPageOffset, totalPagesInBook]);

  // --- Handlers ---
  const handleNextPage = () => {
    if (currentPageIndex < currentChapterPages.length - 1) {
      setCurrentPageIndex((prev) => prev + 1);
    } else if (currentChapterIndex < (publication?.chapters?.length || 0) - 1) {
      setCurrentChapterIndex((prev) => prev + 1);
      setCurrentPageIndex(0);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
    } else if (currentChapterIndex > 0) {
      const prevChIdx = currentChapterIndex - 1;
      const prevCh = publication.chapters[prevChIdx];
      const prevChBlocks = getChapterBlocks(prevCh, prevChIdx);
      const prevChPages = paginateBlocksFallback(prevChBlocks);
      const prevChPagesCount = prevChPages.length;
      
      setCurrentChapterIndex(prevChIdx);
      setCurrentPageIndex(Math.max(0, prevChPagesCount - 1));
    }
  };

  const jumpTo = (chapterIdx: number, pageIdx: number) => {
    setCurrentChapterIndex(chapterIdx);
    setCurrentPageIndex(pageIdx);
  };

  // --- Notes Actions ---
  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    const newNote: SavedNote = {
      id: Math.random().toString(36).substr(2, 9),
      chapterIndex: currentChapterIndex,
      pageIndex: currentPageIndex,
      text: newNoteText.trim(),
      selectedText: selectedTextForHighlight || undefined,
      timestamp: new Date().toLocaleDateString(),
    };
    saveNotes([...notes, newNote]);
    setNewNoteText("");
    setSelectedTextForHighlight("");
  };

  const handleDeleteNote = (id: string) => {
    saveNotes(notes.filter((n) => n.id !== id));
  };

  // --- Bookmarks Actions ---
  const isCurrentPageBookmarked = useMemo(() => {
    return bookmarks.some(
      (b) => b.chapterIndex === currentChapterIndex && b.pageIndex === currentPageIndex
    );
  }, [bookmarks, currentChapterIndex, currentPageIndex]);

  const handleToggleBookmark = () => {
    if (isCurrentPageBookmarked) {
      saveBookmarks(
        bookmarks.filter(
          (b) => !(b.chapterIndex === currentChapterIndex && b.pageIndex === currentPageIndex)
        )
      );
    } else {
      const newBookmark: SavedBookmark = {
        chapterIndex: currentChapterIndex,
        pageIndex: currentPageIndex,
        timestamp: new Date().toLocaleDateString(),
      };
      saveBookmarks([...bookmarks, newBookmark]);
    }
  };

  // --- Review Actions ---
  const handleSubmitReview = async () => {
    if (!formReview.trim() || !formReviewType) {
      toast.error("Please fill in the review content and choose your category.");
      return;
    }
    if (progressPercentage < 20) {
      toast.error("Reviews are locked. You must read at least 20% of this publication first.");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const { data } = await api.post(`/publications/${publication.id}/reviews`, {
        rating: formRating,
        title: formTitle.trim() || null,
        review: formReview.trim(),
        reviewType: formReviewType
      });

      // Update local state publication.reviews
      setPublication((prev: any) => ({
        ...prev,
        reviews: [data, ...(prev.reviews || [])]
      }));

      // Reset form
      setFormTitle("");
      setFormReview("");
      setFormRating(5);
      toast.success("Scholarly review submitted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // --- Text Selection Event ---
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      setSelectedTextForHighlight(selection.toString().trim());
    }
  };

  // --- Knowledge Layer Database ---
  const knowledgeProfiles: { [key: string]: any } = {
    pashmina: {
      title: "Kashmir Pashmina",
      giStatus: "Registered Geographical Indication (GI) under Pashmina sector since 2008.",
      authGuide: "Genuine Pashmina must be hand-spun and hand-woven from the fine undercoat of the Changthangi goat (Capra hircus). Under 100x magnification, look for fiber fineness between 12-15 microns. Genuine articles feature the secure laser-etched GI medallion.",
      relatedResearch: [
        "Socio-Economic Profiles of Pashmina Weavers in Hamadan (2025)",
        "GI Certification Protocols & Counterfeit Deterrence (2024)"
      ]
    },
    kani: {
      title: "Kani Shawl Heritage",
      giStatus: "Registered GI since 2005.",
      authGuide: "Crafted exclusively on traditional looms using eyeless wooden sticks called 'tujis'. The design follows a complex coded pattern script called 'Talim'. A hand-woven Kani shawl takes between 6 months to 2 years to complete depending on pattern complexity.",
      relatedResearch: [
        "Kani Weaving Structures and Talim Code Standardizations (2024)",
        "Mathematical Modeling of Carpet and Shawl Talim Codes (2023)"
      ]
    },
    sozni: {
      title: "Kashmir Sozni needlework",
      giStatus: "Registered GI under Kashmir Sozni Craft.",
      authGuide: "Highly intricate embroidery executed with an extremely fine needle. Traditional motifs include the 'Boteh' (paisley) and geometric panels. The embroidery must match yarn tension exactly to avoid fabric puckering.",
      relatedResearch: [
        "Technological Catalog of Kashmir Embroideries (2025)"
      ]
    },
    carpet: {
      title: "Kashmir Hand-Knotted Carpet",
      giStatus: "Registered GI since 2016. Features QR-code based quick verification.",
      authGuide: "Knotted by hand on a vertical warp using pure silk or wool yarn. Knotted density is measured in knots per square inch (KPI), ranging from 200 to over 1000 KPI for museum-quality silk carpets.",
      relatedResearch: [
        "Silk-on-Silk KPI Density Metrics & Historical Provenance (2023)"
      ]
    },
    "papier-mâché": {
      title: "Kashmir Papier-Mâché",
      giStatus: "Registered GI.",
      authGuide: "Crafted from molded paper pulp, dried, polished, and painted by hand. Genuine items are painted with natural pigments and gilded with real 24k gold leaf ('tila') before final lacquering.",
      relatedResearch: [
        "Chemical Paint Analysis in Traditional Papier-Mâché Conservation (2025)"
      ]
    },
    "walnut wood": {
      title: "Kashmir Walnut Wood Carving",
      giStatus: "Registered GI.",
      authGuide: "Carved from mature walnut trees (Juglans regia). Standard wood carvings feature distinct deep brown grain density and high structural strength, carved entirely by hand with precision gouges.",
      relatedResearch: [
        "Walnut Wood Supply Chains & Sustainable Forestry (2024)"
      ]
    },
    "gi certification": {
      title: "Geographical Indication (GI)",
      giStatus: "Official Government Intellectual Property Safeguard.",
      authGuide: "Verifies the geographic origin, quality, and traditional manufacturing methods of local handicrafts. Protects artisans from copycat industrial counterfeits.",
      relatedResearch: [
        "GI Protection and Rural Economic Safeguards (2026)",
        "Counterfeit Prevention via Blockchain Registry (2025)"
      ]
    },
    provenance: {
      title: "Provenance Safeguards",
      giStatus: "Authentic Chain of Custody Validation.",
      authGuide: "Establishes a verifiable chain of custody from sheep herd shearing, through spinning and weaving clusters, to the final collector, ensuring complete transparency.",
      relatedResearch: [
        "Provenance Value Perceptions in High-End Luxury Markets (2026)"
      ]
    }
  };

  const processKeywords = (text: string) => {
    let processed = text;
    const keywords = [
      "Pashmina",
      "Kani",
      "Sozni",
      "Carpet",
      "Papier-Mâché",
      "Walnut Wood",
      "GI Certification",
      "Provenance",
    ];

    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b(${keyword})\\b`, "gi");
      processed = processed.replace(
        regex,
        `<span class="border-b border-dashed border-brand-primary/80 cursor-pointer text-brand-dark hover:bg-brand-primary/10 px-0.5 rounded transition-colors font-semibold" data-keyword="${keyword.toLowerCase()}">$1</span>`
      );
    });

    return processed;
  };

  const handlePageContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const term = target.getAttribute("data-keyword");
    if (term && knowledgeProfiles[term]) {
      setActiveKnowledgeTerm(term);
      setKnowledgeOpen(true);
    }
  };

  // --- Citation Generator ---
  const currentCitations = useMemo(() => {
    if (!publication) return { apa: "", mla: "", chicago: "", plain: "" };
    const auth = publication.author || "Hamadan Craft Revival Foundation";
    const year = publication.published || "2026";
    const titleText = publication.title;
    const pubName = publication.publisher || "KHCRF Heritage Press";
    const url = typeof window !== "undefined" ? window.location.origin + `/publications/${slug}` : `https://khcrf.org/publications/${slug}`;
    
    return {
      apa: `${auth}. (${year}). *${titleText}*. ${pubName}.`,
      mla: `${auth}. *${titleText}*. ${pubName}, ${year}.`,
      chicago: `${auth}. ${year}. *${titleText}*. ${pubName}.`,
      plain: `${auth}, "${titleText}", ${pubName}, ${year}. Available at: ${url}`,
    };
  }, [publication, slug]);

  const handleCopyCitation = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Citation copied to clipboard");
  };

  // --- Theme Mode Mappings ---
  const themeClassMap = {
    warm: "bg-[#FAF7F0] text-[#2B1D0C]",
    dark: "bg-[#1C1A17] text-[#E5E0D8]",
    white: "bg-[#FFFFFF] text-[#111111]",
  };

  const bgClassMap = {
    warm: "bg-[#F3EFE0]",
    dark: "bg-[#12110F]",
    white: "bg-[#F0F2F5]",
  };

  const sidebarClassMap = {
    warm: "bg-white border-[#E9E4D6] text-stone-750",
    dark: "bg-[#181614] border-[#2A2722] text-stone-300",
    white: "bg-white border-stone-200 text-stone-800",
  };

  const currentTheme = themeClassMap[themeMode];
  const currentBg = bgClassMap[themeMode];
  const currentSidebar = sidebarClassMap[themeMode];

  if (loading || !publication) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#FAF7F0] font-serif text-[#2B1D0C]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold uppercase tracking-widest text-[#2B1D0C]/60">Loading Secure Reader...</p>
        </div>
      </div>
    );
  }



  return (
    <div
      style={{
        "--reader-body-size": `${bodyFontPx}px`,
        "--reader-heading-scale": headingScale,
      } as React.CSSProperties}
      className={`flex h-screen w-screen overflow-hidden ${currentBg} transition-colors duration-300 font-serif select-none ${themeMode === "dark" ? "reader-theme-dark" : themeMode === "warm" ? "reader-theme-warm" : "reader-theme-white"}`}
    >
      
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* 1. SECURE SIDEBAR TOC/NOTES/BOOKMARKS */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300
        lg:relative lg:translate-x-0 lg:flex
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        flex-col border-r h-full ${currentSidebar}
      `}>
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-stone-200/50">
          <div className="flex items-center justify-between mb-4">
            <Link
              href={`/publications/${slug}`}
              className="inline-flex items-center text-xs font-black uppercase tracking-[0.2em] text-icon-on-light hover:text-brand-dark transition-colors"
            >
              <FaArrowLeft className="mr-2 text-[10px]" /> Back to Details
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 transition-all"
              title="Close sidebar"
            >
              <FaTimes size={14} />
            </button>
          </div>
          <h1 className="font-serif font-black text-lg leading-snug line-clamp-2">
            {publication.title}
          </h1>
          <div className="mt-2">
            <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${accessState.locked ? (accessState.reason === "register" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700") : "bg-emerald-500 text-emerald-700"}`}>
              {(publication.accessType || "PUBLIC") === "PUBLIC" ? "Open Access" : (publication.accessType || "PUBLIC") === "REGISTERED" ? "Registered Access" : "Member Access"}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="tabs-wrapper flex border-b border-stone-200/50 text-[10px] sm:text-xs font-bold uppercase tracking-wider shrink-0 bg-stone-50/50 dark:bg-stone-900/10 overflow-x-auto scrollbar-none whitespace-nowrap">
          <button
            onClick={() => setActiveTab("toc")}
            className={`tab-item flex-1 sm:flex-initial px-4 py-3 text-center border-b-2 transition-all shrink-0 ${
              activeTab === "toc" ? "active border-brand-primary text-brand-primary font-black animate-none" : "border-transparent text-stone-400 hover:text-stone-750"
            }`}
          >
            Chapters
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`tab-item flex-1 sm:flex-initial px-4 py-3 text-center border-b-2 transition-all shrink-0 ${
              activeTab === "notes" ? "active border-brand-primary text-brand-primary font-black animate-none" : "border-transparent text-stone-400 hover:text-stone-750"
            }`}
          >
            Notes ({notes.length})
          </button>
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`tab-item flex-1 sm:flex-initial px-4 py-3 text-center border-b-2 transition-all shrink-0 ${
              activeTab === "bookmarks" ? "active border-brand-primary text-brand-primary font-black animate-none" : "border-transparent text-stone-400 hover:text-stone-750"
            }`}
          >
            Bookmarks ({bookmarks.length})
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`tab-item flex-1 sm:flex-initial px-4 py-3 text-center border-b-2 transition-all shrink-0 ${
              activeTab === "reviews" ? "active border-brand-primary text-brand-primary font-black animate-none" : "border-transparent text-stone-400 hover:text-stone-750"
            }`}
          >
            Reception ({(publication?.reviews?.filter((r: any) => !r.isExpert)?.length || 0)})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          
          {/* TOC Tab */}
          {activeTab === "toc" && (
            <div className="space-y-1">
              {publication.chapters?.map((ch: any, i: number) => {
                const accessType = publication.accessType || "PUBLIC";
                const isChLocked = i > 0 && (
                  accessType === "REGISTERED" ? !user :
                  accessType === "MEMBER" ? !isApprovedMember :
                  false
                );
                const lockLabel = accessType === "MEMBER" ? "Member Access" : "Registered Access";
                return (
                  <button
                    key={i}
                    onClick={() => jumpTo(i, 0)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 ${
                      currentChapterIndex === i
                        ? "bg-brand-primary/10 text-brand-primary font-bold shadow-sm"
                        : "hover:bg-stone-200/35 text-stone-600 dark:text-stone-300"
                    }`}
                  >
                    <span className="font-mono text-xs opacity-50 mt-1">
                      {(i + 1).toString().padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-serif leading-snug line-clamp-2 block">{ch.chapterTitle || ch.title}</span>
                      {isChLocked && (
                        <span data-editorial-accent-text className="inline-flex items-center gap-1 text-[8px] uppercase tracking-wider  font-bold mt-1">
                          <FaLock className="text-[7px]" /> {lockLabel}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === "notes" && (
            <div className="space-y-3">
              {selectedTextForHighlight && (
                <div className="p-3 rounded-xl bg-yellow-50 border border-yellow-150 text-stone-800 text-xs">
                  <div className="font-bold mb-1 flex items-center gap-1.5 text-yellow-800">
                    <FaHighlighter size={10} /> Selection Highlighted
                  </div>
                  <p className="italic line-clamp-3 mb-2">&ldquo;{selectedTextForHighlight}&rdquo;</p>
                  <textarea
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Type note or annotation here..."
                    className="w-full p-2 border border-stone-200 rounded-lg text-xs bg-white focus:outline-none focus:border-brand-primary text-black"
                    rows={2}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => setSelectedTextForHighlight("")}
                      className="px-2 py-1 text-[10px] uppercase font-bold text-stone-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddNote}
                      className="px-3 py-1 bg-brand-primary text-white text-[10px] uppercase font-black rounded"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              )}

              {notes.length === 0 ? (
                <div className="p-6 text-center text-xs text-stone-400 italic">
                  No annotations saved. Select text on page to create a highlight note.
                </div>
              ) : (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div key={note.id} className="p-3 bg-stone-50 border border-stone-200/50 rounded-xl space-y-2 dark:bg-stone-900/20">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono text-stone-400 uppercase tracking-widest animate-none">
                          Ch {note.chapterIndex + 1} • Pg {note.pageIndex + 1}
                        </span>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-stone-400 hover:text-red-500 transition-colors animate-none"
                        >
                          <FaTimes size={10} />
                        </button>
                      </div>
                      {note.selectedText && (
                        <p className="italic text-[10px] border-l-2 border-[var(--card-left-accent)]/40 pl-2 text-stone-550 line-clamp-2">
                          &ldquo;{note.selectedText}&rdquo;
                        </p>
                      )}
                      <p className="text-xs text-stone-800 dark:text-stone-205">{note.text}</p>
                      <button
                        onClick={() => jumpTo(note.chapterIndex, note.pageIndex)}
                        className="text-[9px] uppercase font-black text-brand-primary hover:underline block"
                      >
                        Jump to page
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bookmarks Tab */}
          {activeTab === "bookmarks" && (
            <div className="space-y-2">
              {bookmarks.length === 0 ? (
                <div className="p-6 text-center text-xs text-stone-400 italic">
                  No pages bookmarked. Click the ribbon icon on top-right of page to save locations.
                </div>
              ) : (
                <div className="space-y-2">
                  {bookmarks.map((b, idx) => (
                    <button
                      key={idx}
                      onClick={() => jumpTo(b.chapterIndex, b.pageIndex)}
                      className="w-full p-3 text-left rounded-xl bg-stone-50 hover:bg-stone-200/35 border border-stone-200/50 flex items-center justify-between text-xs dark:bg-stone-900/20"
                    >
                      <div className="flex items-center gap-2">
                        <FaBookmark data-ui-icon  className="" size={10} />
                        <span>
                          Chapter {b.chapterIndex + 1}, Page {b.pageIndex + 1}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-stone-400">{b.timestamp}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              {/* Overall Stats */}
              {(() => {
                const publicReviews = (publication?.reviews || []).filter((r: any) => !r.isExpert);
                const totalCount = publicReviews.length;
                const averageRating = totalCount > 0
                  ? (publicReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / totalCount).toFixed(1)
                  : "4.8";
                return (
                  <div className="reception-card card p-4 rounded-xl bg-stone-50 border border-stone-200/50 space-y-2 dark:bg-stone-900/20 text-center">
                    <span className="text-[10px] uppercase font-black tracking-widest text-stone-400 block">
                      Field Reception Rating
                    </span>
                    <div className="rating-number text-3xl font-black text-brand-primary font-serif">
                      {averageRating} <span className="rating-muted text-xs text-stone-400 font-bold font-sans">/ 5</span>
                    </div>
                    <div className="star-rating flex justify-center text-yellow-400 gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < Math.round(parseFloat(averageRating)) ? "fill-current" : "text-gray-200"}
                          size={12}
                        />
                      ))}
                    </div>
                    <span className="rating-muted text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                      {totalCount} Scholarly Reviews
                    </span>
                  </div>
                );
              })()}

              {/* Progress Lock Warning or Review Form */}
              {progressPercentage < 20 ? (
                <div className="locked-reception-card card p-4 rounded-xl bg-stone-50 border border-stone-200/50 space-y-3 dark:bg-stone-900/20 text-center">
                  <div data-ui-icon className="locked-icon-wrapper w-10 h-10 rounded-full bg-brand-secondary/10 flex items-center justify-center  mx-auto shadow-inner">
                    <FaLock size={14} className="locked-icon" />
                  </div>
                  <h4 data-editorial-accent-text className="text-xs font-black  uppercase tracking-wider">
                    Reception Form Locked
                  </h4>
                  <p className="text-[11px] text-stone-550 leading-relaxed italic font-serif">
                    To maintain high-quality scholarly reception, reviews are restricted. You must read at least 20% of this publication to submit.
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                      <span className="progress-label">Progress</span>
                      <span className="progress-value">{progressPercentage}% / 20%</span>
                    </div>
                    <div className="progress-track h-1.5 w-full bg-stone-200 dark:bg-stone-850 rounded-full overflow-hidden">
                      <div
                        className="progress-fill h-full bg-brand-secondary rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((progressPercentage / 20) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="reception-card card p-4 rounded-xl bg-stone-50 border border-[#E9E4D6] space-y-3 dark:bg-stone-900/20">
                  <h4 data-editorial-accent-text className="text-xs font-black  uppercase tracking-widest border-b border-stone-250 pb-2 flex items-center gap-1.5">
                    <FaBookOpen data-ui-icon  size={10} className="" /> Rate Publication
                  </h4>
                  
                  {/* Rating Selector */}
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-black tracking-widest text-stone-400 block">
                      Select Rating
                    </label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setFormRating(val)}
                          className="focus:outline-none transition-colors"
                        >
                          <FaStar
                            size={20}
                            className={val <= formRating ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-stone-700"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Dropdown */}
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-black tracking-widest text-stone-400 block">
                      Scholarly Category
                    </label>
                    <select
                      value={formReviewType}
                      onChange={(e) => setFormReviewType(e.target.value)}
                      className="w-full p-2 border border-stone-200 rounded-lg text-xs bg-white focus:outline-none focus:border-brand-primary text-black"
                    >
                      <option value="Researcher">Researcher</option>
                      <option value="Artisan">Artisan</option>
                      <option value="Exporter">Exporter</option>
                      <option value="Policy">Policy Maker</option>
                      <option value="Consumer">Collector / Consumer</option>
                      <option value="Institution">Institution</option>
                    </select>
                  </div>

                  {/* Title */}
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-black tracking-widest text-stone-400 block">
                      Review Title
                    </label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="Summary of reception..."
                      className="w-full p-2 border border-stone-200 rounded-lg text-xs bg-white focus:outline-none focus:border-brand-primary text-black"
                    />
                  </div>

                  {/* Review Text */}
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-black tracking-widest text-stone-400 block">
                      Review / Field Notes
                    </label>
                    <textarea
                      value={formReview}
                      onChange={(e) => setFormReview(e.target.value)}
                      placeholder="Provide structured feedback..."
                      className="w-full p-2 border border-stone-200 rounded-lg text-xs bg-white focus:outline-none focus:border-brand-primary text-black"
                      rows={4}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmitReview}
                    disabled={isSubmittingReview}
                    className="w-full py-2.5 bg-brand-primary text-white text-[10px] uppercase font-black rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-50"
                  >
                    {isSubmittingReview ? "Submitting..." : "Submit Reception Note"}
                  </button>
                </div>
              )}

              {/* Existing Reviews List */}
              <div className="space-y-2.5 pt-2">
                <span className="field-comments-title text-[9px] font-black uppercase tracking-widest text-stone-400 block">
                  Field Comments
                </span>
                {!(publication?.reviews) || publication.reviews.filter((r: any) => !r.isExpert).length === 0 ? (
                  <p className="field-comments-empty text-[10px] text-stone-400 italic">No field reviews submitted yet.</p>
                ) : (
                  <div className="space-y-2">
                    {publication.reviews
                      .filter((r: any) => !r.isExpert)
                      .map((rev: any) => (
                        <div
                          key={rev.id}
                          className="reception-card card p-3 bg-stone-50 border border-stone-200/50 rounded-xl space-y-1.5 dark:bg-stone-900/20"
                        >
                          <div className="flex justify-between items-center text-[9px] text-stone-400">
                            <span data-editorial-accent-text className="font-bold  uppercase tracking-wider">
                              {rev.reviewType}
                            </span>
                            <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="star-rating flex text-yellow-400 gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <FaStar
                                key={i}
                                className={i < rev.rating ? "fill-current" : "text-gray-200"}
                                size={8}
                              />
                            ))}
                          </div>
                          {rev.title && <h5 className="text-[11px] font-black text-brand-dark">{rev.title}</h5>}
                          <p className="text-[10px] text-stone-700 dark:text-stone-300 font-serif leading-relaxed line-clamp-3">
                            {rev.review}
                          </p>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar Controls */}
        <div className="reader-controls reader-sidebar reader-settings-panel p-6 border-t border-stone-200/50 bg-stone-50/50 dark:bg-stone-900/10 space-y-4">
          
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-400">
            <label>Size</label>
            <div className="flex items-center bg-white border border-stone-200 rounded-lg overflow-hidden shadow-sm dark:bg-[#1C1A17] dark:border-stone-750">
              <button
                type="button"
                onClick={() => setFontSizePercent(prev => Math.max(60, prev - 10))}
                className="reader-control-button px-3 py-1.5 hover:bg-stone-50 text-stone-600 dark:hover:bg-stone-900 border-r border-stone-200 dark:border-stone-750"
                title="Decrease Font Size"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSizePercent(100)}
                className="reader-control-button w-12 text-center font-mono text-[10px] font-bold text-black dark:text-white hover:text-brand-primary transition-colors"
                title="Reset to 100%"
              >
                {fontSizePercent}%
              </button>
              <button
                type="button"
                onClick={() => setFontSizePercent(prev => Math.min(130, prev + 10))}
                className="reader-control-button px-3 py-1.5 hover:bg-stone-50 text-stone-600 dark:hover:bg-stone-900 border-l border-stone-200 dark:border-stone-750"
                title="Increase Font Size"
              >
                A+
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-400">
            <label>Theme</label>
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-stone-200 shadow-sm dark:bg-[#1C1A17] dark:border-stone-750">
              <button
                onClick={() => setThemeMode("warm")}
                className={`reader-control-button px-2 py-1 rounded text-[10px] transition-all flex items-center gap-1 ${
                  themeMode === "warm" ? "active bg-[#FAF7F0] text-[#2B1D0C] shadow-sm font-black border border-[#FAF7F0]" : "text-stone-400 hover:bg-stone-50"
                }`}
              >
                Warm
              </button>
              <button
                onClick={() => setThemeMode("white")}
                className={`reader-control-button px-2 py-1 rounded text-[10px] transition-all flex items-center gap-1 ${
                  themeMode === "white" ? "active bg-white text-stone-900 shadow-sm font-black border border-stone-150" : "text-stone-400 hover:bg-stone-50"
                }`}
              >
                Light
              </button>
              <button
                onClick={() => setThemeMode("dark")}
                className={`reader-control-button px-2 py-1 rounded text-[10px] transition-all flex items-center gap-1 ${
                  themeMode === "dark" ? "active bg-[#1C1A17] text-[#E5E0D8] shadow-sm font-black border border-[#2A2722]" : "text-stone-400 hover:bg-stone-50"
                }`}
              >
                Dark
              </button>
            </div>
          </div>

          <button
            onClick={() => setCitationOpen(true)}
            className="generate-citation-button w-full bg-brand-primary text-white py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-brand-dark transition-colors flex items-center justify-center gap-2"
          >
            <FaQuoteRight size={10} /> Generate Citation
          </button>
        </div>
      </aside>

      {/* 2. MAIN READING WINDOW */}
      <main className="flex-1 flex flex-col relative h-full overflow-hidden reader-main">
        
        {/* Header bar */}
        <div className="h-14 border-b border-stone-200/20 px-4 sm:px-6 md:px-8 flex items-center justify-between shrink-0 bg-transparent relative z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 transition-all mr-1"
              title="Open navigation"
            >
              <FaList size={16} />
            </button>
            <span className="text-xs uppercase font-bold tracking-widest text-stone-400">
              Reading Portfolio:
            </span>
            <span className="text-xs font-serif font-medium text-brand-dark italic opacity-75">
              {currentChapter?.chapterTitle || currentChapter?.title}
            </span>
          </div>

          <button
            onClick={handleToggleBookmark}
            className={`p-2 transition-colors ${
              isCurrentPageBookmarked ? "text-brand-primary" : "text-stone-400 hover:text-brand-primary"
            }`}
            title="Toggle Bookmark"
          >
            <FaBookmark size={18} />
          </button>
        </div>

        {/* Page columns */}
        <div className="reader-page-container flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-8 py-8 flex justify-center custom-scrollbar">
          <div className="reader-page-wrapper w-full max-w-full flex flex-col">
            
            {/* Book sheet */}
            <div
              ref={pageContainerRef}
              onMouseUp={handleTextSelection}
              onClick={handlePageContentClick}
              className={`w-full reader-page rounded-2xl shadow-xl border border-stone-200/30 p-4 sm:p-6 md:p-10 lg:p-14 min-h-[550px] relative transition-colors duration-300 ${currentTheme}`}
              style={{
                boxShadow: "0 10px 30px -15px rgba(0,0,0,0.15)",
              }}
            >
              <SecurityLayer userIdentity={user?.email || "GUEST_VIEWER"}>
                
                {/* Lock Screen overlay */}
                <AnimatePresence>
                  {accessState.locked && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-40 bg-[#FAF7F0]/98 backdrop-blur-[6px] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-center rounded-2xl text-stone-850"
                    >
                      <div data-ui-icon className="w-16 h-16 rounded-full bg-brand-secondary/15 flex items-center justify-center  mb-6 shadow-inner animate-pulse">
                        <FaLock size={24} />
                      </div>
                      <span className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                        {accessState.reason === "register" ? "Registered Access Required" : "Member Exclusive Archive"}
                      </span>
                      <h3 className="font-serif font-black text-2xl mb-3 leading-snug">
                        {accessState.reason === "register"
                          ? "Sign In to Continue Reading"
                          : accessState.reason === "membership-login"
                          ? "Sign In & Get Membership"
                          : accessState.reason === "get-membership"
                          ? "Membership Required"
                          : accessState.reason === "membership-pending"
                          ? "Membership Under Review"
                          : accessState.reason === "membership-rejected"
                          ? "Membership Application Rejected"
                          : "Unlock Complete Publication"}
                      </h3>

                      {accessState.reason === "register" && (
                        <>
                          <p className="text-sm font-serif italic text-stone-500 max-w-md mx-auto mb-8 leading-relaxed">
                            Create a free account or sign in to access the full publication. Registered members can read all chapters and save their reading progress.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-sm">
                            <Link
                              href="/login"
                              className="w-full py-3.5 bg-brand-dark text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-primary transition-colors text-center shadow-lg"
                            >
                              Sign In / Register
                            </Link>
                          </div>
                        </>
                      )}

                      {accessState.reason === "membership-login" && (
                        <>
                          <p className="text-sm font-serif italic text-stone-500 max-w-md mx-auto mb-8 leading-relaxed">
                            This publication requires an active KHCRF membership. Sign in or create an account first, then apply for membership to access full chapters, annotations, citation standards, and craft profiles.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-sm">
                            <Link
                              href="/about/memberships"
                              className="w-full py-3.5 bg-brand-dark text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-primary transition-colors text-center shadow-lg"
                            >
                              Get KHCRF Membership
                            </Link>
                            <Link
                              href="/login"
                              className="w-full py-3.5 bg-transparent border border-stone-300 text-stone-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-stone-50 transition-colors text-center"
                            >
                              Sign In
                            </Link>
                          </div>
                        </>
                      )}

                      {accessState.reason === "get-membership" && (
                        <>
                          <p className="text-sm font-serif italic text-stone-500 max-w-md mx-auto mb-8 leading-relaxed">
                            This publication requires an active KHCRF membership. Join the Hamadan Craft Revival Foundation partner network to access full chapters, annotations, citation standards, and craft profiles.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-sm">
                            <Link
                              href="/about/memberships"
                              className="w-full py-3.5 bg-brand-dark text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-primary transition-colors text-center shadow-lg"
                            >
                              Get KHCRF Membership
                            </Link>
                          </div>
                        </>
                      )}

                      {accessState.reason === "membership-pending" && (
                        <>
                          <p className="text-sm font-serif italic text-stone-500 max-w-md mx-auto mb-8 leading-relaxed">
                            Your membership application is currently under review by the KHCRF team. You will be notified via email once your membership is approved. Thank you for your patience.
                          </p>
                        </>
                      )}

                      {accessState.reason === "membership-rejected" && (
                        <>
                          <p className="text-sm font-serif italic text-stone-500 max-w-md mx-auto mb-8 leading-relaxed">
                            Unfortunately, your membership application was not approved. If you believe this is an error, please contact the KHCRF team for assistance.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-sm">
                            <Link
                              href="/contact"
                              className="w-full py-3.5 bg-brand-dark text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-primary transition-colors text-center shadow-lg"
                            >
                              Contact Support
                            </Link>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Main page content */}
                <div
                  className="reader-content-scalable space-y-6 md:space-y-8 select-text"
                  style={{
                    "--reader-body-size": `${bodyFontPx}px`,
                    "--reader-heading-scale": headingScale,
                  } as React.CSSProperties}
                >
                  {currentChapterPages[currentPageIndex]?.map((block: any, idx: number) => {
                    if (block.type === "chapter-header") {
                      return (
                        <span key={idx} className="text-[10px] font-black tracking-widest text-brand-secondary uppercase block mb-1">
                          {block.text}
                        </span>
                      );
                    }
                    if (block.type === "chapter-title") {
                      return (
                        <h3 key={idx} className="font-serif text-lg font-bold text-stone-500 uppercase tracking-wide block mb-3 border-b border-brand-primary/10 pb-4 mb-6">
                          {block.text}
                        </h3>
                      );
                    }
                    if (block.type === "page-title") {
                      return (
                        <h2 key={idx} className="font-serif font-black text-2xl md:text-3xl leading-tight text-brand-dark mt-1 mb-6">
                          {block.text}
                        </h2>
                      );
                    }
                    if (block.type === "paragraph") {
                      const isFirstParaInChapter = allChapterBlocks.findIndex(b => b.type === "paragraph") === allChapterBlocks.findIndex(b => b.text === block.text && b.type === "paragraph");
                      const dropCapClass = isFirstParaInChapter ? "drop-cap first-letter:text-5xl first-letter:font-black first-letter:float-left first-letter:mr-3 first-letter:text-brand-primary first-letter:font-serif" : "";
                      return (
                        <p
                          key={idx}
                          className={`text-base md:text-lg leading-[1.7] font-serif break-words max-w-full ${dropCapClass}`}
                          dangerouslySetInnerHTML={{
                            __html: processKeywords(block.text),
                          }}
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              </SecurityLayer>

              {/* Hidden measuring container for dynamic pagination */}
              <div
                ref={measureRef}
                className="absolute invisible pointer-events-none select-none opacity-0 reader-content-scalable"
                style={{
                  fontFamily: "serif",
                  // Apply font size scale parameters
                  "--reader-body-size": `${bodyFontPx}px`,
                  "--reader-heading-scale": headingScale,
                } as React.CSSProperties}
              />
            </div>

            {/* Pagination numbers */}
            <div className="reader-page-nav reader-pagination mt-8 mb-12 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-mono text-stone-400">
              <button
                onClick={handlePrevPage}
                disabled={currentChapterIndex === 0 && currentPageIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2 hover:bg-stone-200/40 rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent font-bold uppercase tracking-wider"
              >
                <FaChevronLeft size={10} /> Prev Page
              </button>

              <span className="font-bold text-center flex flex-col items-center gap-1">
                <span>
                  Chapter {currentChapterIndex + 1} of {publication.chapters?.length || 1} &bull; Page {currentPageIndex + 1} of {currentChapterPages.length}
                </span>
                <span className="text-[10px] text-stone-400/80 font-semibold tracking-wider uppercase font-sans">
                  Publication Progress: {progressPercentage}%
                </span>
              </span>

              <button
                onClick={handleNextPage}
                disabled={
                  currentChapterIndex === (publication.chapters?.length || 1) - 1 &&
                  currentPageIndex === currentChapterPages.length - 1
                }
                className="flex items-center gap-1.5 px-4 py-2 hover:bg-stone-200/40 rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent font-bold uppercase tracking-wider"
              >
                Next Page <FaChevronRight size={10} />
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* 3. KNOWLEDGE LAYER SIDE PANEL */}
      <AnimatePresence>
        {knowledgeOpen && activeKnowledgeTerm && (
          <motion.div
            initial={{ x: 360, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 360, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className={`w-90 border-l h-full relative z-40 flex flex-col shadow-2xl transition-colors duration-300 ${currentSidebar}`}
          >
            {/* Side header */}
            <div className="p-6 border-b border-stone-200/50 flex items-center justify-between">
              <div data-ui-icon className="flex items-center gap-2 ">
                <FaGlobe />
                <span className="text-xs uppercase font-black tracking-widest">Knowledge Profile</span>
              </div>
              <button
                onClick={() => setKnowledgeOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 transition-all"
              >
                <FaTimes size={14} />
              </button>
            </div>

            {/* Profiles */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-sm font-serif">
              {(() => {
                const profile = knowledgeProfiles[activeKnowledgeTerm];
                if (!profile) return null;
                return (
                  <>
                    <div>
                      <h2 className="text-2xl font-black text-brand-dark mb-1 font-serif">
                        {profile.title}
                      </h2>
                      <div className="h-1 w-12 bg-brand-primary rounded-full mt-2" />
                    </div>

                    <div className="space-y-1">
                      <span data-editorial-accent-text className="text-[10px] uppercase font-black tracking-widest  block">
                        Geographical Indication (GI) Status
                      </span>
                      <p className="italic text-stone-750 text-xs font-semibold leading-relaxed">
                        {profile.giStatus}
                      </p>
                    </div>

                    <div className="space-y-2 bg-stone-50 border border-stone-150 p-4 rounded-xl dark:bg-stone-900/30">
                      <span className="text-[10px] uppercase font-black tracking-widest text-stone-400 block">
                        Authentication Criteria
                      </span>
                      <p className="text-stone-650 leading-relaxed text-xs">
                        {profile.authGuide}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <span className="text-[10px] uppercase font-black tracking-widest text-stone-400 block">
                        KHCRF Related Library Resources
                      </span>
                      <div className="space-y-2">
                        {profile.relatedResearch.map((res: string, idx: number) => (
                          <div key={idx} className="flex gap-2.5 items-start">
                            <span className="h-1.5 w-1.5 rounded-full bg-brand-primary mt-2 shrink-0" />
                            <span className="text-xs text-brand-dark font-medium underline hover:text-brand-primary cursor-pointer leading-tight">
                              {res}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. MODAL: CITATION GENERATOR */}
      <AnimatePresence>
        {citationOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setCitationOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-4 sm:p-6 md:p-8 relative z-10 text-stone-850 font-serif"
            >
              <div className="flex justify-between items-center pb-4 border-b border-stone-100 mb-6">
                <h3 className="font-serif font-black text-lg text-brand-dark">
                  Generate Citation Reference
                </h3>
                <button
                  onClick={() => setCitationOpen(false)}
                  className="p-1 rounded-full hover:bg-stone-100 text-stone-400"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-6 text-sm">
                
                {/* APA */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-wider text-stone-455">
                    <span>APA Format</span>
                    <button
                      onClick={() => handleCopyCitation(currentCitations.apa)}
                      className="text-icon-on-light hover:underline flex items-center gap-1 font-black"
                    >
                      <FaCopy /> Copy
                    </button>
                  </div>
                  <div className="p-3 bg-stone-50 border border-stone-200/50 rounded-xl font-mono text-xs select-text">
                    {currentCitations.apa}
                  </div>
                </div>

                {/* MLA */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-wider text-stone-455">
                    <span>MLA Format</span>
                    <button
                      onClick={() => handleCopyCitation(currentCitations.mla)}
                      className="text-icon-on-light hover:underline flex items-center gap-1 font-black"
                    >
                      <FaCopy /> Copy
                    </button>
                  </div>
                  <div className="p-3 bg-stone-50 border border-stone-200/50 rounded-xl font-mono text-xs select-text">
                    {currentCitations.mla}
                  </div>
                </div>

                {/* Chicago */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-wider text-stone-455">
                    <span>Chicago Format</span>
                    <button
                      onClick={() => handleCopyCitation(currentCitations.chicago)}
                      className="text-icon-on-light hover:underline flex items-center gap-1 font-black"
                    >
                      <FaCopy /> Copy
                    </button>
                  </div>
                  <div className="p-3 bg-stone-50 border border-stone-200/50 rounded-xl font-mono text-xs select-text">
                    {currentCitations.chicago}
                  </div>
                </div>

                {/* Plain Text */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-wider text-stone-455">
                    <span>Plain Text Format</span>
                    <button
                      onClick={() => handleCopyCitation(currentCitations.plain)}
                      className="text-icon-on-light hover:underline flex items-center gap-1 font-black"
                    >
                      <FaCopy /> Copy
                    </button>
                  </div>
                  <div className="p-3 bg-stone-50 border border-stone-200/50 rounded-xl font-mono text-xs select-text">
                    {currentCitations.plain}
                  </div>
                </div>

              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setCitationOpen(false)}
                  className="px-6 py-2.5 bg-brand-dark text-white rounded-xl text-xs uppercase font-black tracking-wider hover:bg-brand-primary transition-all"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Continue Reading prompt banner */}
      <AnimatePresence>
        {savedPosition && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 z-50 bg-white border border-stone-200 p-4 rounded-xl shadow-xl flex items-center gap-4 dark:bg-[#1C1A17] dark:border-stone-750 sm:max-w-sm"
          >
            <div className="text-left font-sans">
              <span data-editorial-accent-text className="text-[9px] uppercase font-black tracking-widest  block">
                Saved Position
              </span>
              <p className="text-xs font-bold text-stone-800 dark:text-stone-200 leading-snug">
                Continue reading from page {savedPosition.pageIndex + 1} of Chapter {savedPosition.chapterIndex + 1}?
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => {
                  setSavedPosition(null);
                  localStorage.removeItem(`hcrf_read_pos_${slug}`);
                }}
                className="px-2.5 py-1.5 border border-stone-200 text-stone-500 rounded-lg text-[9px] uppercase font-bold hover:bg-stone-50 dark:border-stone-700 dark:text-stone-400"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  jumpTo(savedPosition.chapterIndex, savedPosition.pageIndex);
                  setSavedPosition(null);
                }}
                className="px-3 py-1.5 bg-brand-primary text-white rounded-lg text-[9px] uppercase font-black hover:bg-brand-dark"
              >
                Resume
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
