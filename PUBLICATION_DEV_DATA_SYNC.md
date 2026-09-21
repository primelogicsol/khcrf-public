# Publication Development Data Synchronization

## Overview
The publication catalogue for KHCRF is authoritatively managed on production (`khcrf.org`). Local development environments MUST NOT manually create mock publications, as the canonical publication model relies on a deeply relational graph (Categories, Editions, Metadata) governed by strict visibility policies.

To ensure localhost mirrors production without risking manual drift, a safe canonical sync utility is provided.

## Architecture
1. **Production is Authoritative:** The live DB is the source of truth.
2. **Read-Only Sync:** Localhost pulls from the public `GET /api/backend/publications` endpoints. It does not access private CMS endpoints or production database credentials.
3. **Local Database is the Dev Mirror:** The script idempotently upserts the production payload into the local PostgreSQL database, fulfilling the strict relational requirements (`PublicationEdition`, `PublicationCategory`, `PUBLISHED` status).

## Usage
Run the script locally in the `backend` directory to refresh your development data.

**Dry Run (Required first):**
```bash
npx tsx scripts/syncCanonicalPublications.ts --dry-run
```

**Execute Sync:**
```bash
npx tsx scripts/syncCanonicalPublications.ts
```

## Safety Mechanisms
- **Production Block:** The script explicitly aborts if the `DATABASE_URL` contains `khcrf.org` or if `NODE_ENV=production`.
- **Idempotency:** Records are matched by `slug`. Re-running the script updates metadata safely without duplicating records or categories.
- **Test/Fixture Separation:** Existing local-only draft records (like "Idempotent Update") are untouched because the script only upserts items found in the production feed.

## Reconstructed Canonical Graph
The script automatically builds the following for each publication:
- `Publication` (scalar fields)
- `PublicationCategory` (if present in prod payload)
- `PublicationEdition` (with `status: "PUBLISHED"`, satisfying `enableCanonicalPublicReads` visibility requirements).

## What is intentionally NOT synchronized
- Private editorial workflows (DraftJS states, Review comments, Internal approvals)
- Unpublished drafts
- Contributor private data
The goal is strictly to bootstrap the *public* catalogue so development and UI testing can proceed against real data.
