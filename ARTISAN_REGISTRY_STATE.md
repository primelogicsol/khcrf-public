# KHCRF Master Artisan Registry - State & Handover Document

**Last Updated:** September 2026
**Version:** 2.0
**Current Phase:** Phase 2 (Data Ingestion - Deep Mining & Schema Refinement)

This document serves as the exact save-state for the KHCRF Artisan Registry module. It captures the updated database architecture, strict identity reconciliation rules, and the advanced data-mining framework established during the 1965–2019 era sweeps.

## 1. Environment & Capabilities
*   **Repository:** `primelogicsol/hcr_foundation_full_govind`
*   **Database:** `hcrf_db_clean` (PostgreSQL via Prisma adapter)
*   **Capabilities:** The working setup features native web-search and data-mining capabilities (utilizing Google Gemini). There is no need to switch models to continue the web mining work; autonomous scraping and verification run locally in the background.

## 2. Updated Data Architecture & Rules

### Canonical Artisan Minimum Identity Package
Every approved or provisional artisan record must carry:

| Field | Rule |
|---|---|
| KHCRF Master ID | **ALWAYS ASSIGNED** — immediately on record creation |
| Craftlore Artisan ID | **ALWAYS ASSIGNED** — immediately on record creation |
| Name | Always present |
| Primary Craft | Required IF documented in source. `N/A` if targeted search fails. |
| District | Required IF documented in source. `N/A` if targeted search fails. |
| Village/Locality | Required IF documented in source. `N/A` if targeted search fails. |

> **IDs are always created. Craft and location are never invented.**

### KHCRF Master ID Format — Permanent Rule
```
CORRECT:   KHCRF-MA-00030   (sequential, no craft/district encoded)
CORRECT:   CL-ART-000030

FORBIDDEN: KHCRF-MA-BUD-KANI-0030  (encodes craft+district — creates future conflicts)
```

**Why:** Encoding craft or district into a permanent ID creates irreversible conflicts when:
- An artisan works in multiple crafts
- District attribution is corrected
- Craft normalization changes
- The original geography was wrong

ID = permanent identity key. Craft + location = evidence-backed editable attributes.

**Current ID sequence (as of last run):**
- Highest Craftlore ID issued: `CL-ART-000124`
- Highest KHCRF sequential ID: `KHCRF-MA-10086`
- Next new artisan: `CL-ART-000125` / `KHCRF-MA-10087`

**KHCRF ID merge rule:**
```
If two records prove to be the same person:
  identity_status: MERGED
  merged_into_khcrf_master_id: <canonical KHCRF ID>
IDs are never deleted or recycled.
```

### Other Architecture Rules

*   **Preemptive Identity Issuance:** Every discovered artisan receives a unique `Craftlore Artisan ID` (`CL-ART-000XXX`) immediately upon logging.
*   **Decoupled Reconciliation:** Reconciliation is entirely separate from identity issuance. New identities start as `PENDING` reconciliation status until deduplicated against legacy records.
*   **Period Rules:** `Period` is strictly determined by the *recognition year*, never birth year or active working years.
*   **Relational Awards Schema:** Recognition is highly relational. A single artisan can hold multiple awards across different periods (via `ArtisanAwardRecipient` junction table).
*   **Joint Award Support:** A single award event can link to multiple artisan recipients via junction records, preserving accurate history without mangling names into a single string.
*   **Missing Data Standard:** Missing fields may use `N/A` during the mining phase to indicate a targeted lookup failed to find defensible data, but *nothing is ever inferred or invented*. If a year is unknown, it remains unknown.
*   **Privacy & Internal Data:** Full residential addresses and exact contact numbers are mined but strictly kept *private in the backend*. The public frontend renders only the locality/district and mediated contact.
*   **One-to-Many GI IDs:** One artisan may possess multiple GI Authorized User IDs across different crafts. These are stored relationally via `ArtisanGiAuthorization`, not as a scalar field.

## 3. Required Mining Fields
Any future data mining pass must aggressively pursue these fields to constitute a "fully enriched" record:
*   Name
*   Gender
*   Craft
*   District
*   Period
*   Recognition
*   Verification
*   Life Status (Living / Deceased / Historical)
*   Reconciliation Status
*   Evidence Grade (e.g., A+++, A, B)
*   Documentation (Documented / Partial / Not documented)
*   Address/Locality
*   Record Type (Contemporary / Historical)
*   Contact Number (Internal only)
*   GI Authorized User ID (Relational array)
*   Pehchan ID
*   Government Artisan ID
*   Craft & Lineage (Master-apprentice networks, familial hand-downs)

## 4. Current Pipeline & Batch Status
### 1965–1999

```
MINING_STATUS:          FINAL_OFFICIAL_PASS_REQUIRED
SEARCH_RESULT:          PRIOR_PASS_INCOMPLETE — official handloom, parliamentary,
                        and Padma archival coverage not yet explicitly exhausted
UNIQUE_ARTISANS:        20
RECOGNITIONS:           28 (across all 20 artisans)
NEW_ARTISANS_THIS_PASS: 0
TARGET_OF_25:           NOT FORCED — 20 is the defensible ceiling at current search scope
DATA_FREEZE_STATUS:     HOLD

REASON_FOR_HOLD:
  Official handloom / parliamentary / Padma archival coverage
  not yet explicitly exhausted.
  YEAR_TEXT_CONFLICT detected and corrected (Ghulam Nabi Dar
  National Award year text: '1995' → '1995–96' per primary Padma citation).

AUDITOR_DISPOSITION (prior pass):
  A. Zero new artisans          → ACCEPTED provisionally
  B. Fayaz Ahmad Jan rows       → REJECTED as new data (already captured)
  B. Ghulam Nabi Dar rows       → REJECTED as new data; year corrected to 1995–96
  C. Government IDs             → ACCEPTED (zero new findings)
  D. GI authorizations          → ACCEPTED (zero new findings)
  E. Lineage                    → ACCEPTED (zero new findings)
  F. Secondary sources, no URL  → NOT USED for evidence upgrade
  G. "No conflicts"             → REJECTED — YEAR_TEXT_CONFLICT was present and missed
  H. Search coverage            → PARTIAL — official-source gap pass required
```

**Required Final Official Pass targets:**
- `handlooms.gov.in` / `handlooms.nic.in` — consolidated National Award, NMC, Sant Kabir registers
- `sansad.in` / Digital Sansad — Lok Sabha and Rajya Sabha craft-award tables
- `padmaawards.gov.in` — citations and notifications year-by-year 1965–1999
- Surviving official J&K State Award / Directorate archive or gazette material

**Defensible wording for all future references:**
> No additional defensible unique artisan identities were identified within the public digital sources searched during the final mining pass.

**Permanent Rule — Frozen does not mean immutable:**
A future primary archival discovery (physical gazette, institutional archive, museum record) may reopen an individual artisan record without reopening the entire mining exercise for the period.

**Search Coverage (period_freeze_notes):**
- Government of India Alive MCP Welfare Register (2025)
- DC Handicrafts Compendium (2017)
- Lok Sabha Unstarred Questions / Digital Sansad
- Handlooms National Award Register (PDF)
- Padma Awards citations
- eGyanKosh craft biographies
- Sahapedia & Daily Excelsior reporting
- Brighter Kashmir / Awaz The Voice secondary archives
- IP India GI Authorized User Search
- Year-by-year query vectors: 1965 through 1999
- Program-by-program: J&K State Award, National Award, NMC, National Handloom Award, Shilp Guru predecessors, Padma, Sant Kabir predecessors

**Explicit zero-result documentation:**
- 1965–1979 block returned only programmatic/overview content. No primary or secondary digitized list naming individual Kashmiri artisans was found for this sub-window.
- National Handloom Awards / Sant Kabir predecessors (1980s–90s J&K): No uniquely identifiable new names beyond the existing 20.

**Defensible wording for all future references:**
> No additional defensible unique artisan identities were identified within the public digital sources searched during the final mining pass.

**Permanent Rule — Frozen does not mean immutable:**
A future primary archival discovery (physical gazette, institutional archive, museum record) may reopen an individual artisan record without reopening the entire mining exercise for the period.

---

*   **2000–2008:** Staged and injected.
*   **2009–2019:** Staged and injected (Batch 1 & Batch 2).

Any new coding/mining session should load this document as the absolute truth for the current relational database state and web mining strategy before taking action.
