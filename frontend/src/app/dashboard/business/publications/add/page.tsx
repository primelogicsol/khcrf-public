"use client";

import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import PublicationForm, {
  PublicationFormData,
  Chapter,
} from "@/components/dashboard/publications/PublicationForm";
import { useState, useEffect, Suspense } from "react";

function isValidPublicationId(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.trim().length > 0 &&
    value !== 'undefined' &&
    value !== 'null'
  );
}

function PublicationEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawEditId = searchParams.get("edit");
  const editId = isValidPublicationId(rawEditId) ? rawEditId : null;

  const [initialData, setInitialData] = useState<Partial<PublicationFormData> | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  // Track the ID of the publication created in this session so subsequent saves use PUT
  const [createdId, setCreatedId] = useState<string | null>(null);

  // The effective publication ID: from URL param (edit mode) or from first save in this session
  const resolvedId = editId || createdId;

  useEffect(() => {
    if (rawEditId && !editId) {
      // Invalid edit param, clear it from URL
      router.replace('/dashboard/business/publications/add');
    }
  }, [rawEditId, editId, router]);

  useEffect(() => {
    if (editId) {
      setLoading(true);
      api
        .get(`/publications/${editId}`)
        .then((res) => {
          const pub = res.data?.data ?? res.data;

          let metaObj: any = {};
          if (pub.metadata) {
            try {
              metaObj = typeof pub.metadata === "string" ? JSON.parse(pub.metadata) : pub.metadata;
            } catch (e) {
              console.error("Could not parse metadata", e);
            }
          }

          const savedState = metaObj?.nested_state || metaObj?.metadata || metaObj || {};
          const innerMetadata = savedState.metadata || {};

          const formattedData: Partial<PublicationFormData> = {
            id: pub.id,
            ...innerMetadata, // Hydrate all original formData fields
            ...savedState,    // Hydrate any top-level nested_state overrides
            
            // Core overrides mapping pub schema fields to UI fields
            title: pub.title || savedState.publication_title || savedState.title || innerMetadata.title || "",
            subtitle: pub.subtitle || savedState.subtitle || innerMetadata.subtitle || "",
            author: pub.author || savedState.publisher_name || savedState.author || innerMetadata.author || "",
            price: String(pub.price ?? savedState.price ?? innerMetadata.price ?? "0"),
            pages: String(pub.pages ?? savedState.pages ?? innerMetadata.pages ?? "30"),
            description: pub.description || savedState.description || innerMetadata.description || "",
            imagePath: pub.imagePath || savedState.imagePath || innerMetadata.imagePath || "",
            slug: pub.slug || savedState.url_slug || savedState.slug || innerMetadata.slug || "",
            published: pub.published || savedState.publication_year || savedState.published || innerMetadata.published || String(new Date().getFullYear()),
            category: pub.category || savedState.category || innerMetadata.category || "",
            categoryId: pub.categoryId || savedState.categoryId || innerMetadata.categoryId || "",
            language: pub.language || savedState.language || innerMetadata.language || "English",
            pdfPath: pub.pdfPath || savedState.pdfPath || innerMetadata.pdfPath || "",
            type: (pub.type as "WRITTEN" | "PDF") || savedState.type || innerMetadata.type || "WRITTEN",
            // Blueprint
            publicationBlueprint: pub.publicationBlueprint || pub.category || "",
            // 1. Identity
            series: pub.series || "",
            volume: pub.volume || "",
            issue: pub.issue || "",
            publicationType: pub.publicationType || "RESEARCH_PAPER",
            publishedStatus: pub.publishedStatus || "DRAFT",
            edition: pub.edition || "",
            isbn: pub.isbn || "",
            doi: pub.doi || "",
            publisher: pub.publisher || "KHCRF Heritage Press",
            // 2. Classification
            craftSector: pub.craftSector || "Pashmina",
            multipleCrafts: pub.multipleCrafts || "",
            domain: pub.domain || "",
            audience: pub.audience || "",
            region: pub.region || "Kashmir",
            country: pub.country || "India",
            accessType: pub.accessType || "PUBLIC",
            researchLevel: pub.researchLevel || "",
            // 3. Contributors
            coAuthor: pub.coAuthor || "",
            researchTeam: pub.researchTeam || "",
            technicalEditor: pub.technicalEditor || "",
            reviewer: pub.reviewer || "",
            institution: pub.institution || "",
            fieldContributor: pub.fieldContributor || "",
            legislativeContributor: pub.legislativeContributor || "",
            industryContributor: pub.industryContributor || "",
            // 4. Intelligence
            execSummary: pub.execSummary || "",
            keyFindings: pub.keyFindings || "",
            methodology: pub.methodology || "",
            objectives: pub.objectives || "",
            expectedOutcomes: pub.expectedOutcomes || "",
            readingTime: pub.readingTime || "15 mins",
            keywords: pub.keywords || "",
            highlights: pub.highlights || "",
            // Dynamic intelligence
            problemStatement: pub.problemStatement || "",
            bestPracticeHighlights: pub.bestPracticeHighlights || "",
            implementationFramework: pub.implementationFramework || "",
            keyRecommendations: pub.keyRecommendations || "",
            caseBackground: pub.caseBackground || "",
            challenge: pub.challenge || "",
            intervention: pub.intervention || "",
            results: pub.results || "",
            lessonsLearned: pub.lessonsLearned || "",
            replicability: pub.replicability || "",
            abstract: pub.abstract || "",
            researchQuestions: pub.researchQuestions || "",
            conclusions: pub.conclusions || "",
            bookOverview: pub.bookOverview || "",
            learningObjectives: pub.learningObjectives || "",
            audienceBenefits: pub.audienceBenefits || "",
            keyTopics: pub.keyTopics || "",
            policySum: pub.policySum || "",
            urgencyStatement: pub.urgencyStatement || "",
            evidenceSnapshot: pub.evidenceSnapshot || "",
            policyRecommendations: pub.policyRecommendations || "",
            marketSummary: pub.marketSummary || "",
            exportTrends: pub.exportTrends || "",
            priceSignals: pub.priceSignals || "",
            marketRisks: pub.marketRisks || "",
            opportunities: pub.opportunities || "",
            forecasts: pub.forecasts || "",
            // 5. Cover
            coverTemplate: pub.coverTemplate || "Scholarly Monograph",
            coverBackground: pub.coverBackground || "",
            hcrfSealPlacement: pub.hcrfSealPlacement || "",
            isbnPlacement: pub.isbnPlacement || "",
            brandingTheme: pub.brandingTheme || "Warm Heritage",
            accessBadge: pub.accessBadge || "",
            seriesBadge: pub.seriesBadge || "",
            // 7. Knowledge Graph
            linkedCrafts: pub.linkedCrafts || "",
            linkedPolicies: pub.linkedPolicies || "",
            linkedGIs: pub.linkedGIs || "",
            linkedPapers: pub.linkedPapers || "",
            linkedCaseStudies: pub.linkedCaseStudies || "",
            linkedBestPractices: pub.linkedBestPractices || "",
            linkedLegislativeWork: pub.linkedLegislativeWork || "",
            linkedClusters: pub.linkedClusters || "",
            linkedExportMarkets: pub.linkedExportMarkets || "",
            linkedAuthentications: pub.linkedAuthentications || "",
            // 8. SEO
            seoTitle: pub.seoTitle || "",
            seoDescription: pub.seoDescription || "",
            canonicalUrl: pub.canonicalUrl || "",
            seoKeywords: pub.seoKeywords || "",
            structuredDataType: pub.structuredDataType || "ResearchPaper",
            seoFaq: pub.seoFaq || "",
            openGraphImage: pub.openGraphImage || "",
            twitterCardType: pub.twitterCardType || "summary_large_image",
            // 9. AI
            aiSummary: pub.aiSummary || "",
            structuredFacts: pub.structuredFacts || "",
            definitions: pub.definitions || "",
            entitiesMatched: pub.entitiesMatched || "",
            knowledgeNodesList: pub.knowledgeNodesList || "",
            qaPairs: pub.qaPairs || [],
            citationSnippets: pub.citationSnippets || "",
            // 10. Reader
            readerTheme: pub.readerTheme || "Warm",
            defaultFont: pub.defaultFont || "IBMPlexSerif",
            readerWidth: pub.readerWidth || "820px",
            citationMode: pub.citationMode || "APA 7th",
            knowledgeLinksEnabled: pub.knowledgeLinksEnabled ?? true,
            footnotesEnabled: pub.footnotesEnabled ?? true,
            references: pub.references || "",
            crossReferences: pub.crossReferences || "",
            readerEnabled: (typeof pub.metadata === "string" ? (() => { try { return JSON.parse(pub.metadata).readerEnabled } catch { return undefined } })() : pub.metadata?.readerEnabled) ?? pub.readerEnabled ?? true,
            readerPath: (typeof pub.metadata === "string" ? (() => { try { return JSON.parse(pub.metadata).readerPath } catch { return undefined } })() : pub.metadata?.readerPath) || pub.readerPath || "",
            
            publishAt: (typeof pub.metadata === "string" ? (() => { try { return JSON.parse(pub.metadata).scheduled_publish_at } catch { return undefined } })() : pub.metadata?.scheduled_publish_at) || undefined,
            // Compat
            seoEnabled: !!(pub.seoTitle || pub.seoDescription),
            isDownloadable: pub.isDownloadable ?? true,
            previewEnabled: pub.previewEnabled ?? true,
            memberOnlyDownload: pub.memberOnlyDownload ?? false,
            citationEnabled: pub.citationEnabled ?? false,
          };

          // Map chapters with subchapters
          if (pub.chapters?.length > 0) {
            const normalizeChaptersForUI = (backendChapters: any[]) => {
              return backendChapters
                .map((ch: any) => {
                  // Normalize pages/blocks from various potential backend shapes
                  let finalPages = [{ content: JSON.stringify([{ type: "Paragraph", text: "" }]), pageNumber: 1 }];
                  
                  if (ch.pages && ch.pages.length > 0) {
                    finalPages = ch.pages.map((p: any) => ({
                      id: p.id,
                      content: typeof p.content === "string" ? p.content : JSON.stringify(p.content ?? []),
                      pageNumber: p.pageNumber,
                    }));
                  } else if (ch.content || ch.blocks) {
                    // Fallback for flat structure
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
                    subchapters: ch.subchapters
                      ? ch.subchapters.map((s: any) => ({
                          id: s.id,
                          title: s.title,
                          order: s.order,
                          summary: s.summary || "",
                          content: s.content || JSON.stringify([{ type: "Paragraph", text: "" }]),
                        }))
                      : [],
                  };
                })
                .sort((a: any, b: any) => a.order - b.order);
            };

            formattedData.chapters = normalizeChaptersForUI(pub.chapters);
          }

          setInitialData(formattedData);
        })
        .catch((err) => {
          console.error("Failed to fetch publication", err);
          toast.error("Failed to load publication for editing");
        })
        .finally(() => setLoading(false));
    }
  }, [editId]);

  const handleSubmit = async (data: PublicationFormData, chapters: Chapter[]) => {
    try {
      let publicationId: string;

      const payload = {
        ...data,
        author: data.author || data.coAuthor || "KHCRF Intelligence Unit",
        title: data.title || "Untitled Draft",
        slug: data.slug || "untitled-draft-" + Date.now(),
        published: data.published || new Date().getFullYear().toString(),
        description: data.description || "Draft publication.",
        metadata: data.nested_state ? JSON.stringify(data.nested_state) : undefined,
      };
      if (resolvedId) {
        // Already saved once (edit mode or same-session draft) — use PUT
        const pubRes = await api.put(`/publications/${resolvedId}`, payload);
        publicationId = resolvedId;
        const statusLabel = data.publishedStatus === "PUBLISHED" ? "published" :
                            data.publishedStatus === "UNDER_REVIEW" ? "submitted for review" :
                            data.publishedStatus === "SCHEDULED" ? "scheduled" : "updated";
        toast.success(`Knowledge asset ${statusLabel} successfully`);
      } else {
        // First save — create new record
        const pubRes = await api.post("/publications", payload);
        const resData = pubRes.data || {};
        publicationId = resData.data?.id || resData.id;
        
        if (!isValidPublicationId(publicationId)) {
          throw new Error(
            'The publication draft was not created correctly. No valid record ID was returned.'
          );
        }

        // Persist the new ID so all subsequent saves in this session use PUT
        setCreatedId(publicationId);
        // Clear local storage draft if successful
        localStorage.removeItem("hcrf_publication_draft");
        // Update the URL to reflect edit mode (prevents double-create on back/refresh)
        router.replace(`/dashboard/business/publications/add?edit=${encodeURIComponent(publicationId)}`, { scroll: false });
        const statusLabel = data.publishedStatus === "PUBLISHED" ? "published" :
                            data.publishedStatus === "UNDER_REVIEW" ? "submitted for review" :
                            data.publishedStatus === "SCHEDULED" ? "scheduled" : "saved as draft";
        toast.success(`Knowledge asset ${statusLabel}`);
      }

      // Save chapters (writer mode)
      let updatedChapters = chapters;
      if (chapters.length > 0) {
        const isDbId = (id: any) => typeof id === "string" && id.length > 10 && !id.startsWith("temp") && !id.startsWith("chapter") && !id.startsWith("page");
        
        // Clone chapters to return updated IDs
        updatedChapters = [...chapters];

        for (let i = 0; i < updatedChapters.length; i++) {
          const chapter = { ...updatedChapters[i] };
          updatedChapters[i] = chapter;
            
            let chapterId = chapter.id;
            if (isDbId(chapter.id)) {
              await api.put(`/publications/chapters/${chapterId}`, {
                title: chapter.title,
                order: i + 1,
                status: chapter.status,
                summary: chapter.summary,
                sectionType: chapter.sectionType,
              });
            } else {
              const res = await api.post("/publications/chapters", {
                title: chapter.title,
                order: i + 1,
                status: chapter.status || "DRAFT",
                summary: chapter.summary || "",
                sectionType: chapter.sectionType || "chapter",
                publicationId,
              });
              const resData = res.data || {};
              chapterId = resData.data?.id || resData.id;
              chapter.id = chapterId; // Save new DB ID to React state!
            }

            // Save pages (block content)
            const updatedPages = [...chapter.pages];
            chapter.pages = updatedPages;
            for (let j = 0; j < updatedPages.length; j++) {
              const page = { ...updatedPages[j] };
              updatedPages[j] = page;
              
              if (isDbId(page.id)) {
                try {
                  await api.put(`/publications/pages/${page.id}`, {
                    content: page.content,
                    pageNumber: j + 1,
                  });
                } catch (e: any) {
                  console.warn(`Failed to PUT page ${page.id}, attempting POST fallback`, e?.response?.data || e);
                  // Fallback to post if 404
                  if (e?.response?.status === 404) {
                    const res = await api.post("/publications/pages", {
                      content: page.content,
                      pageNumber: j + 1,
                      chapterId,
                    });
                    const resData = res.data || {};
                    page.id = resData.data?.id || resData.id;
                  } else {
                    toast.error(`Page save failed: ${e?.response?.data?.message || e.message}`);
                    throw e; // Break the promise chain so it shows error state!
                  }
                }
              } else {
                try {
                  const res = await api.post("/publications/pages", {
                    content: page.content,
                    pageNumber: j + 1,
                    chapterId,
                  });
                  const resData = res.data || {};
                  page.id = resData.data?.id || resData.id; // Update local state ID!
                } catch (e: any) {
                  console.error("Failed to POST new page", e?.response?.data || e);
                  toast.error(`Page create failed: ${e?.response?.data?.message || e.message}`);
                  throw e;
                }
              }
            }
          }
          toast.success("All chapters saved");
        }

        // Navigation logic based on status
        if (data.publishedStatus === "PUBLISHED" && data.slug) {
          router.push(`/publications/${data.slug}`);
        } else if (data.publishedStatus === "UNDER_REVIEW" || data.publishedStatus === "APPROVED") {
          router.push("/dashboard/business/publications/list");
        }
        
        return { publicationId, updatedChapters };
      } catch (error: any) {
        console.group("SAVE PUBLICATION ERROR");
      console.error("Full error:", error);
      console.error("Status:", error?.response?.status);
      console.error("Status text:", error?.response?.statusText);
      console.error("Response data:", error?.response?.data);
      console.error("Request data:", data);
      console.groupEnd();
      
      // Store failed payload in localStorage so user doesn't lose data
      try {
        localStorage.setItem("hcrf_publication_draft", JSON.stringify({ data, chapters }));
        toast("Draft saved locally due to server error", { duration: 4000 });
      } catch (e) {
        console.error("Could not save to localStorage", e);
      }
      
      const errData = error?.response?.data;
      const message = errData?.details || errData?.error || errData?.message || error?.message || "Failed to save — please try again";
      toast.error(typeof message === "string" ? message : JSON.stringify(message));
      throw error;
    }
  };

  const handleSaveDraft = async (data: PublicationFormData, chapters: Chapter[]) => {
    return await handleSubmit({ ...data, publishedStatus: "DRAFT" }, chapters);
  };

  const handlePreviewBook = (data: PublicationFormData) => {
    const pid = resolvedId;
    if (!pid) {
      toast.error("Save the publication as Draft first to unlock Preview Full Book");
      return;
    }
    window.open(`/dashboard/business/publications/${pid}/preview`, "_blank");
  };

  const handlePreviewPublic = (data: PublicationFormData) => {
    const pid = resolvedId;
    if (!pid) {
      toast.error("Save the publication as Draft first to unlock Preview Public Page");
      return;
    }
    window.open(`/dashboard/business/publications/${pid}/public-preview`, "_blank");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading knowledge asset...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <PublicationForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onSaveDraft={handleSaveDraft}
        onPreviewBook={handlePreviewBook}
        onPreviewPublic={handlePreviewPublic}
        onCancel={() => router.push("/dashboard/business/publications/list")}
        isEditing={!!editId || !!resolvedId}
        isAdmin={true}
        publicationId={resolvedId || undefined}
      />
    </div>
  );
}

export default function PublicationEditorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PublicationEditorContent />
    </Suspense>
  );
}
