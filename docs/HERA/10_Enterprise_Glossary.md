# Document 10: HCRF Enterprise Glossary
**HERA v1.0 Enterprise Architecture**

* **Canonical Entity:** A single, authoritative, unduplicated database record representing a real-world concept (e.g., a specific Craft).
* **Platform Service:** A reusable, decoupled backend domain (e.g., Identity Service, Media Service) that owns specific entities and exposes standardized APIs to the entire ecosystem.
* **Knowledge Object:** Entities representing stable, foundational facts (Crafts, Materials, Techniques).
* **Heritage Object:** Entities representing digitized archival material (Artifacts, Documentaries).
* **Domain Event:** An automated signal broadcast when a state changes (e.g., `CraftVerified`), allowing decoupled services to react (e.g., sending an email).
* **Workflow:** A defined state-machine lifecycle for content (Draft -> Reviewed -> Published -> Archived).
* **Provenance / Verification:** The documented, immutable evidence supporting a factual claim in the system.
* **Ontology:** The formal taxonomy and relational mapping of Kashmir's crafts, tools, and materials.
* **Relationship / Edge:** A graph connection between two entities (`practices`, `uses_tool`) replacing the need for duplicated text fields.
* **Soft Delete:** Hiding a record using a `deletedAt` timestamp rather than permanently removing it from the database (`DELETE`), ensuring archival integrity.
* **Semantic Search / Vector Embedding:** Using AI to convert text into mathematical coordinates to search by *meaning* rather than exact keyword matches.
* **RBAC:** Role-Based Access Control. Restricting API and CMS access based on assigned user roles (e.g., Editor, Archivist).
* **Observability:** The ability to monitor system health, database integrity, and error rates via the Observatory Dashboard.
* **CIDOC CRM:** The international standard ontology for cultural heritage documentation (future-proofing target).
* **IIIF:** International Image Interoperability Framework (future-proofing target for high-res archival images).
* **PURL:** Permanent Uniform Resource Locator; stable web addresses that do not break over decades.
