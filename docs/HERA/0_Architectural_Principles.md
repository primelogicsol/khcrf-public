# HCRF Architectural Principles (HERA v1.0)
**The Constitution of the Platform**

These 10 immutable principles govern all engineering, product, and data decisions within the HCRF digital ecosystem. Whenever there is uncertainty about implementation, the team must return to these principles for guidance.

---

### 1. Knowledge First
Knowledge entities (the ontology of crafts, techniques, and materials) are the foundation of the platform. All other modules (Studio, Publications, Collections) are built to consume, enrich, or present that shared knowledge.

### 2. Single Source of Truth
Every canonical entity exists only once in the Canonical Entity Registry. A specific craft, artisan, or tool must have a single UUID referenced globally to prevent data fragmentation.

### 3. Relationships Over Duplication
Connect entities rather than copying data. If a documentary features an artisan using a specific tool, the system must create relationship edges (`appears_in`, `uses_tool`) rather than storing duplicate text describing the tool.

### 4. Institutional Before Commercial
Scholarly integrity, archival longevity, and data governance take absolute precedence over engineering convenience or commercial shortcuts. 

### 5. Evidence Required
Every factual claim must support provenance and verification. Entities must track their source, verification level, and the authoritative reviewer who approved them.

### 6. API First
All functionality—whether utilized by the HCRF CMS, the public frontend, or external researchers—must be available through well-defined, secure, and standardized APIs.

### 7. Metadata by Default
Every entity inherently carries strict, structured metadata. Taxonomies, transliterated aliases, SEO schemas, and AI embeddings are not optional add-ons; they are core requirements for platform ingestion.

### 8. Accessibility by Design
Public knowledge should be broadly accessible within licensing and ethical constraints. The architecture must support deep internationalization, standard web accessibility, and interoperability protocols (IIIF, Linked Open Data).

### 9. AI Assists, Humans Approve
AI is utilized to enrich content (semantic embeddings, transcript generation, entity extraction) but it never replaces institutional editorial verification. AI suggests; human experts approve.

### 10. Backward Compatibility
Schema evolution should preserve existing data, relationship history, and permanent identifiers (PURLs) whenever practical. The archive's stability across decades is paramount.
