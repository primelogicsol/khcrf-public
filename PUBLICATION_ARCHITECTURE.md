# KHCRF Publication Architecture

## Core Principles
- **DATABASE IS SOURCE OF TRUTH**: The production Postgres database holds authoritative records.
- **API IS THE ONLY PUBLIC DATA CONTRACT**: The frontend never bypasses the API to parse raw database schemas.
- **FRONTEND NEVER OWNS PUBLICATION DATA**: Static local JSON files are deprecated.
- **CATEGORY FILTERS NEVER FETCH THEIR OWN DATA**: All categories are subsets of the singular public catalogue.
- **MEMBERSHIP/ENTITLEMENT NEVER CONTROLS CARD VISIBILITY**: Access restrictions apply to reading/downloading, not catalogue discovery.
- **TECHNICAL FAILURE NEVER BECOMES EMPTY CATALOGUE**: 500s or network failures yield `SERVICE_ERROR`.

## Architectural Boundaries

### 1. Canonical Repository
All publication records are fetched via `PublicationModule.getInstance().repository`. Legacy Prisma fallback queries bypassing `enableCanonicalPublicReads` are deprecated.

### 2. Catalogue Service & Endpoint
`GET /api/publications` (or `/api/publications/catalogue` if versioned) serves as the sole frontend integration point for the catalogue.

### 3. Canonical DTO
All endpoints serving the catalogue return `PublicPublicationCardDTO[]`.

### 4. Visibility Invariant
`isPublicationVisible(publication) === true` requires at least one `PublicationEdition` with `status === 'PUBLISHED'`.

### 5. Taxonomy Freeze
Backend canonical Enums map deterministically to Frontend UI labels:
- `MARKET_INTELLIGENCE` -> Market Intelligence
- `POLICY_BRIEF` -> Policy Briefs
- `RESEARCH_PAPER` -> Research Papers
- `BEST_PRACTICE` -> Best Practices
- `CASE_STUDY` -> Case Studies
- `KNOWLEDGE_BOOK` -> Knowledge Books

## Development Data Synchronization
Production data is the authoritative source for the catalogue. Localhost databases must be bootstrapped via `scripts/syncCanonicalPublications.ts`, which safely and idempotently mirrors public canonical fields without mutating production.

## Invariant Safety Rules
**NO NEW PUBLICATION DATA PATH MAY BE INTRODUCED WITHOUT UPDATING THE CANONICAL CONTRACT AND REGRESSION TESTS.**
