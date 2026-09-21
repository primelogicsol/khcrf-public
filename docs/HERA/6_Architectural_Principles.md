# Document 6: HERA Architectural Principles
**The Constitution of the Platform**

These 15 immutable principles govern all engineering, product, and data decisions within the HCRF digital ecosystem. 

1. **Knowledge First:** Knowledge entities (Crafts, Materials) are the foundation. All other modules consume or present that shared knowledge.
2. **Single Source of Truth:** Every canonical entity exists only once. A specific craft must have a single UUID referenced globally.
3. **Relationships Over Duplication:** Connect entities rather than copying data. Create relationship edges (`uses_tool`) rather than storing duplicate text.
4. **Institution Before Feature:** Scholarly integrity and archival longevity take absolute precedence over engineering convenience or commercial shortcuts. 
5. **Evidence Before Publication:** Every factual claim must support provenance and verification via `VerificationRecord`.
6. **API First:** All functionality must be available through well-defined, secure, and standardized APIs.
7. **Metadata By Default:** Taxonomies, transliterated aliases, SEO schemas, and AI embeddings are core requirements for ingestion, not optional add-ons.
8. **AI Assists, Humans Decide:** AI enriches content (semantic embeddings, transcripts) but never replaces institutional editorial verification.
9. **Everything Is Searchable:** All entities must flow into a unified Full-Text and Semantic Search index.
10. **Everything Is Auditable:** Every mutative action must be logged persistently.
11. **Backward Compatibility:** Schema evolution must preserve existing data, relationship history, and permanent identifiers (PURLs).
12. **Composable Services:** Platform Services (Identity, Media, Knowledge) must be decoupled and reusable across the ecosystem.
13. **Security By Default:** RBAC enforcement at the route level, strict Zod validation, and secure cookie sessions are non-negotiable.
14. **Scalability First:** Storage architectures must handle massive files (4K Documentaries) natively via S3/Mux, not local server disk space.
15. **Long-Term Preservation:** The archive must be designed to outlive its original developers, utilizing stable open standards (IIIF, JSON-LD, CIDOC CRM mapping).
