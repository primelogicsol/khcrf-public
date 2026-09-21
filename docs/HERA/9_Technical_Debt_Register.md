# Document 9: Technical Debt Register
**HERA v1.0 Enterprise Architecture**

| Description | Impact | Affected Modules | Resolution | Priority | Effort |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Missing RBAC Middleware** | Unauthorized access to mutative endpoints. Any valid JWT token bypasses role checks. | `publicationRoutes.ts`, `businessRoutes.ts` | Apply `authorizeRole` middleware across all routes. | **Critical** | Low |
| **Missing Request Validation** | Malformed payloads crash controllers or corrupt database. | All APIs | Implement declarative `Zod` schema validation middleware. | **High** | Medium |
| **Hard Deletes on Publications** | Permanent loss of archival data when deleted. | `Publication`, `Chapter` | Refactor schemas to use `deletedAt` (Soft Delete). | **High** | Low |
| **Local Image Uploads** | Bloats server storage, lacks CDN delivery, risks data loss on container restart. | `uploadRoutes.ts` | Fully enforce Cloudinary/S3 pipelines; remove local `fs.writeFileSync`. | **High** | Medium |
| **Model Fragmentation** | Disconnected data silos between Business profiles and Artisan profiles. | `Listing`, `ArtisanProfile`, `BusinessProfile` | Design a migration to a polymorphic `Organization`/`Person` schema. | Medium | High |
| **Mock Data Dependency** | Frontend pages crash if `data.ts` is removed; not SEO indexable. | `Master Artisans`, `Studio`, `Research` | Build Backend Services (Sprint 1-4) and hydrate via SSR/APIs. | **Critical** | High |
