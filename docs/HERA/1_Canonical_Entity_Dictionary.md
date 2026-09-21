# Document 1: Canonical Entity Dictionary
**HERA v1.0 Enterprise Architecture**

This dictionary serves as the absolute "Oxford Dictionary" of the HCRF platform. Every entity in the system is defined here as an **Institutional Knowledge Object**.

## 1. Knowledge Objects

### 1.1 Craft
* **Purpose:** The primary anchor node representing a distinct artisanal tradition.
* **Description:** A recognized traditional practice (e.g., Walnut Wood Carving).
* **Owner:** Knowledge Service
* **Required Fields:** `uuid`, `slug`, `title`, `description`, `status`
* **Optional Fields:** `titleUrdu`, `titleKashmiri`, `origin`, `significance`
* **Relationships:** `has_many` -> Material, Tool, Technique, Motif, Product, MasterArtisan
* **Validation:** Slug must be unique.
* **Workflow:** Draft -> Research Verified -> Field Verified -> Approved -> Published
* **Permissions:** SUPER_ADMIN, ARCHIVIST
* **Search Fields:** title, description, titleUrdu
* **SEO Metadata:** JSON-LD schema support, metaTitle, openGraphImage
* **AI Metadata:** Vector embedding for semantic search
* **Audit:** Full historical logging
* **Media:** heroImage, gallery
* **Versioning:** Yes
* **Lifecycle:** Active, Deprecated, Archived
* **Business Rules:** Must have at least 1 verified Material and Technique before publication.

### 1.2 Material
* **Purpose:** Document physical components of Kashmir crafts.
* **Description:** Raw, processed, or synthetic substances.
* **Owner:** Knowledge Service
* **Required Fields:** `uuid`, `slug`, `name`, `type`
* **Optional Fields:** `sourceRegion`, `sustainabilityNotes`
* **Relationships:** `belongs_to_many` -> Craft, Tool
* **Validation:** Must link to >= 1 Craft.
* **Workflow:** Draft -> Expert Verified -> Published

### 1.3 Tool
* **Purpose:** Instruments utilized in artisanal execution.
* **Owner:** Knowledge Service
* **Relationships:** `used_in` -> Craft, Technique.

*(Additional Knowledge Objects defined in DB: Technique, Motif, Pattern, Design, Glossary Term, Trade Term, Workshop Term, Product, GI, Raw Material, Natural Dye, Color, Measurement Unit, Craft Category, Market Segment, Certification, Standard)*

## 2. Human Objects

### 2.1 Person
* **Purpose:** Canonical entity for all humans (Users, Donors, Artisans).
* **Owner:** Identity Service / People Service
* **Required Fields:** `uuid`, `firstName`, `lastName`
* **Relationships:** Base for MasterArtisan, User, Contributor.
* **Audit:** Highly sensitive PII tracking.

### 2.2 Master Artisan
* **Purpose:** Documents living legends of Kashmir's crafts.
* **Owner:** People Service
* **Required Fields:** `personId` (FK), `slug`, `craftId`, `location`, `yearsOfPractice`
* **Relationships:** `belongs_to` -> Craft, WorkshopCommunity; `mentors` -> Apprentice; `appears_in` -> Documentary.
* **Workflow:** Draft -> Field Verified -> Expert Verified -> Published.
* **Business Rules:** Must have verified Provenance chain.

*(Additional Human Objects: Living Legend, Woman Artisan, Emerging Artisan, Apprentice, Researcher, Contributor, Volunteer, Reviewer, Organization, Institution, Partner, Donor, Member)*

## 3. Heritage Objects

### 3.1 Documentary
* **Purpose:** Visual archive for intangible heritage.
* **Owner:** Media Service
* **Required Fields:** `uuid`, `slug`, `title`, `muxPlaybackId`
* **Relationships:** `features` -> MasterArtisan, Craft, Technique.
* **Media Support:** 4K video streaming, subtitles, transcripts.

### 3.2 Collection
* **Purpose:** Museum-grade grouping of rare artifacts.
* **Owner:** Museum Service
* **Required Fields:** `uuid`, `title`, `curatorId`
* **Relationships:** `contains` -> Artifact, MuseumObject.

*(Additional Heritage Objects: Artifact, Museum Object, Rare Object, Publication, Book, Magazine, Research Paper, Policy Brief, Case Study, Film, Video Interview, Audio Story, Workshop Diary, Photograph, Drawing, Map, Archive Record)*

## 4. Administrative Objects

### 4.1 Verification Record
* **Purpose:** Immutable proof of authenticity for any factual claim.
* **Owner:** Audit / Observatory Service
* **Required Fields:** `uuid`, `entityId`, `entityType`, `verifierId`, `evidenceType`, `dateVerified`
* **Audit:** Immutable. Cannot be modified.

*(Additional Administrative Objects: User, Role, Permission, Workflow, Audit Log, Notification, Source Reference, Research Project, Media Asset, Submission, Payment, Membership, Subscription, Task, Review Queue, Approval Queue)*
