# Sprint 1B: Knowledge Domain Entities Design

## Overview
Sprint 1A established the Core Knowledge Infrastructure (Canonical Entities, Relationships, Taxonomy, Verification, and Workflows). Sprint 1B will build upon this abstract foundation to implement the concrete, domain-specific objects that map the cultural heritage of Kashmir.

## Design Philosophy
Following the HERA (HCRF Enterprise Reference Architecture) v1.0 principles, all entities in Sprint 1B will act as specialized "types" of a `CanonicalEntity`.

Instead of isolating them in detached tables, they will share common traits (visibility, verification, lifecycle, relationships) through the `CanonicalEntity` hub, whilst their unique schemas remain tightly scoped.

---

## 1. Craft Model (`Craft`)
**Purpose:** Represents a recognized discipline of artisanship (e.g., *Papier-Mâché*, *Pashmina*, *Sozni*).
**Fields:**
- `id` (UUID)
- `canonicalEntityId` (FK -> CanonicalEntity)
- `historicalOrigin` (String, nullable)
- `culturalSignificance` (String, nullable)
- `endangermentStatus` (Enum: `THRIVING`, `STABLE`, `VULNERABLE`, `ENDANGERED`, `EXTINCT`)

## 2. Material Model (`Material`)
**Purpose:** Represents raw or processed inputs used in crafts (e.g., *Walnut wood*, *Pashmina yarn*, *Copper*).
**Fields:**
- `id` (UUID)
- `canonicalEntityId` (FK -> CanonicalEntity)
- `sourcingRegion` (String)
- `sustainabilityStatus` (Enum: `SUSTAINABLE`, `CONCERN`, `DEPLETED`)
- `processingMethod` (Text)

## 3. Tool Model (`Tool`)
**Purpose:** Represents the implements used by artisans (e.g., *Kander-e-Qalam*).
**Fields:**
- `id` (UUID)
- `canonicalEntityId` (FK -> CanonicalEntity)
- `primaryMaterial` (String)
- `maintenanceRequirements` (Text)

## 4. Technique Model (`Technique`)
**Purpose:** Represents a method of applying a craft.
**Fields:**
- `id` (UUID)
- `canonicalEntityId` (FK -> CanonicalEntity)
- `complexityLevel` (Enum: `BASIC`, `INTERMEDIATE`, `MASTER`)
- `learningDurationMonths` (Int)

## 5. Motif Model (`Motif`)
**Purpose:** Represents recurring thematic or visual patterns (e.g., *Chinar leaf*, *Boteh/Paisley*).
**Fields:**
- `id` (UUID)
- `canonicalEntityId` (FK -> CanonicalEntity)
- `symbolicMeaning` (Text)
- `geometricProperties` (Json)

## 6. Product Model (`Product`)
**Purpose:** Represents a categorized output (e.g., *Samovar*, *Qalamdan*). Not to be confused with a commerce SKU.
**Fields:**
- `id` (UUID)
- `canonicalEntityId` (FK -> CanonicalEntity)
- `typicalUse` (Text)
- `averageCreationTimeDays` (Int)

## 7. Trade & Workshop Terms (`GlossaryTerm`)
**Purpose:** Replaces standalone Trade Term and Workshop Term models with a unified contextual glossary.
**Fields:**
- `id` (UUID)
- `canonicalEntityId` (FK -> CanonicalEntity)
- `termContext` (Enum: `WORKSHOP`, `TRADE`, `GENERAL`)
- `regionalDialect` (String)

---

## Integration Plan
1. **Schema Extension:** Add models to `schema.prisma`.
2. **Relationships:** `Craft` uses `EntityRelationship` to link to `Material`, `Tool`, and `Motif`.
3. **API Expansion:** Expose domain-specific endpoints (`/api/crafts`, `/api/materials`) that automatically construct the underlying `CanonicalEntity`.

## Readiness
Sprint 1B is **ready for implementation** pending the successful deployment of the Sprint 1A database migration to production and final sign-off on the schema expansion.
