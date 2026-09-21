# Document 8: RC-2 Enterprise Roadmap
**HERA v1.0 Enterprise Architecture**

## Phase -1: Architecture Freeze
* **Objectives:** Lock HERA v1.0 documentation.
* **Deliverables:** Canonical Entity Dictionary, Service Contracts, Relationship Catalogue, Engineering Standards.
* **Completion Criteria:** Architecture approved by stakeholders. No code written.

## Sprint 0: Stabilization & Foundations
* **Objectives:** Secure existing endpoints and establish core infrastructure.
* **Deliverables:** Route-level RBAC (`authorizeRole`), Zod validation middleware, Soft-delete standardization, Media Service (S3/Mux configurations).
* **Dependencies:** Phase -1.

## Sprint 1: Knowledge Repository
* **Objectives:** Build the ontology of HCRF.
* **Deliverables:** Prisma schemas for `Craft`, `Material`, `Technique`, `GlossaryTerm`. APIs and CMS taxonomy manager.

## Sprint 2: Master Artisans (People Service)
* **Objectives:** Digitize the living heritage.
* **Deliverables:** `MasterArtisan` model linked to Knowledge Graph. CMS profile manager with Provenance verification flows.

## Sprint 3: Studio (Media Service integration)
* **Objectives:** Secure video/audio streaming.
* **Deliverables:** `Documentary`, `AudioStory` models. Mux integration. Token-gated playback APIs for Members.

## Sprint 4: Collections (Museum Service)
* **Objectives:** Digitize physical heritage.
* **Deliverables:** `HeritageCollection`, `Artifact` models. Museum-grade CMS metadata fields (Provenance, Conservation).

## Sprint 5: Publications & Editorial
* **Objectives:** Secure PDF delivery and scholarly articles.
* **Deliverables:** `MagazineIssue`, `EditorialStory`. Fix existing `publicationRoutes.ts` RBAC.

## Sprint 6: State of Kashmir Crafts & Policy
* **Objectives:** Dynamic institutional reports.
* **Deliverables:** CMS for dynamic report chapters and chart data linking.

## Sprint 7: Business Support Workflows
* **Objectives:** Enable robust CCSI certification queues.
* **Deliverables:** State-machine verification queues in CMS. Automated notification triggers.

## Sprint 8: Search & AI Integration
* **Objectives:** Semantic discovery.
* **Deliverables:** Algolia/Postgres Full-Text indexing. Vector embeddings for transcripts and essays.

## Sprint 9: Production Hardening & Observatory
* **Objectives:** Platform launch readiness.
* **Deliverables:** Global Observatory Dashboard (Health scoring), CDN caching, penetration testing.
