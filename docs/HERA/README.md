# HCRF Enterprise Reference Architecture (HERA v1.0)
**Phase -1: Master Architecture Index**

Welcome to the definitive architectural standard for the HCRF Digital Ecosystem. This repository governs all engineering, database modeling, API design, and CMS development for RC-2 and beyond.

## Executive Summary
This Phase -1 freeze transitions HCRF from a collection of interconnected web pages into a cohesive, highly governed institutional platform. By establishing the Canonical Entity Dictionary and Platform Services, we ensure that the foundation's knowledge graph scales securely for decades.

## Foundational Documents
*These documents must be cross-referenced during all engineering phases.*

1. **[Document 1: Canonical Entity Dictionary](./1_Canonical_Entity_Dictionary.md)**
   *The "Oxford Dictionary" of the platform. Defines the strict schema for every Knowledge, Human, and Heritage object.*
2. **[Document 2: Platform Service Contracts](./2_Platform_Service_Contracts.md)**
   *Defines the responsibilities, owned entities, and APIs for core services (Identity, Knowledge, Media, etc.).*
3. **[Document 3: Relationship Catalogue](./3_Relationship_Catalogue.md)**
   *Maps the institutional relationship graph (e.g., Artisan `practices` Craft).*
4. **[Document 4: Domain Event Catalogue](./4_Event_Catalogue.md)**
   *Lists the event triggers for micro-workflows and notifications (e.g., `CraftVerified`).*
5. **[Document 5: Engineering Standards](./5_Engineering_Standards.md)**
   *The strict coding conventions (Zod Validation, RBAC, Soft Deletes, Prisma rules).*
6. **[Document 6: Architectural Principles](./6_Architectural_Principles.md)**
   *The 15 immutable laws of the platform (Knowledge First, Evidence Required).*
7. **[Document 7: Platform Service Dependency Graph](./7_Service_Dependency_Graph.md)**
   *The strict execution order mapping dependencies to mitigate architectural risk.*
8. **[Document 8: RC-2 Enterprise Roadmap](./8_RC2_Enterprise_Roadmap.md)**
   *The Sprint 0 to Sprint 9 execution plan based on the Dependency Graph.*
9. **[Document 9: Technical Debt Register](./9_Technical_Debt_Register.md)**
   *Tracker for critical security (RBAC) and architectural fixes required before Sprint 1.*
10. **[Document 10: Enterprise Glossary](./10_Enterprise_Glossary.md)**
    *Standardized vocabulary for the engineering and administrative teams.*

---

## Current Status: Phase -1 Complete
* **Remaining Open Decisions:** Final consolidation mapping of `Listing` vs `BusinessProfile` vs `InstituteProfile` into a unified polymorphic entity.
* **Risks:** The backend currently lacks widespread Route-Level RBAC and Zod validation, posing a critical security risk if new models are deployed blindly.
* **Recommendations Before Sprint 0 Begins:** Developers must read *Document 5: Engineering Standards* and *Document 9: Technical Debt Register*. Sprint 0 will focus exclusively on patching RBAC and establishing Media (S3/Mux) pipelines before the Knowledge Graph Prisma models are written in Sprint 1.
