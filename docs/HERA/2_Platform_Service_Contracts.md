# Document 2: Platform Service Contracts
**HERA v1.0 Enterprise Architecture**

Platform Services are reusable, decoupled domains that own specific Knowledge Objects and expose functionality to other services.

## 1. Identity Service
* **Mission:** Secure authentication, authorization, and RBAC across HCRF.
* **Owned Entities:** User, Role, Permission, Session.
* **Consumed Services:** Audit Service.
* **Public APIs:** `/auth/login`, `/auth/register`
* **Internal APIs:** `verifyToken()`, `checkRole()`
* **Events Published:** `UserCreated`, `RoleAssigned`, `LoginFailed`

## 2. Knowledge Service
* **Mission:** Maintain the canonical ontology of Kashmir crafts.
* **Owned Entities:** Craft, Material, Tool, Technique, Motif, GlossaryTerm, GI.
* **Consumed Services:** Identity Service (Auth).
* **Public APIs:** `/api/knowledge/crafts`, `/api/knowledge/glossary`
* **Events Published:** `CraftCreated`, `GlossaryTermApproved`
* **Security:** Public read, strictly authorized write (SUPER_ADMIN, ARCHIVIST).

## 3. People Service
* **Mission:** Catalog and verify the human heritage of artisans and contributors.
* **Owned Entities:** Person, MasterArtisan, Apprentice, WorkshopCommunity, Contributor.
* **Consumed Services:** Knowledge Service (Craft validation), Identity Service.
* **Public APIs:** `/api/people/artisans`
* **Events Published:** `ArtisanVerified`, `ApprenticeRegistered`

## 4. Media Service
* **Mission:** Enterprise-grade storage, transcoding, and delivery of digital assets.
* **Owned Entities:** MediaAsset, Documentary, Photograph, AudioStory.
* **Dependencies:** Mux (Video), AWS S3 (Files/Audio), Cloudinary (Images).
* **Internal APIs:** `requestUploadSignature()`, `getSecureStreamUrl()`
* **Events Published:** `MediaUploaded`, `VideoTranscoded`

## 5. Editorial Service
* **Mission:** Manage the scholarly publishing lifecycle.
* **Owned Entities:** Publication, Magazine, ResearchPaper, Article.
* **Consumed Services:** Media Service, Knowledge Service.

## 6. Museum Service
* **Mission:** Digitize physical heritage objects to CIDOC CRM standards.
* **Owned Entities:** Artifact, Collection, MuseumObject, ConservationRecord.

*(Additional Services defined in architecture: Membership Service, Participation Service, Business Service, Research Service, Policy Service, Notification Service, Workflow Service, Audit Service, Search Service, AI Service, Taxonomy Service, File Storage Service, Payment Service, Reporting Service, Observatory Service)*
