# Architecture Decisions Record (ADR) & Design Philosophy

## State of Kashmir Crafts (SKC) Assessment Platform

This document outlines the core architectural decisions that govern the SKC Assessment Platform. It serves as the canonical reference for understanding *why* the system is designed the way it is.

---

## 1. Segregation of Public and Admin APIs

### Context
The SKC platform collects sensitive information, raw opinions, and proprietary evidence from stakeholders across Kashmir. However, it must also provide a transparent public dashboard to demonstrate progress without leaking Personally Identifiable Information (PII) or unverified claims.

### Decision
We explicitly separated the API into two distinct layers:
- **Admin Layer (`/api/consultation/*`, `/api/audit/*`)**: Full CRUD operations, returns raw database rows, requires strict authentication.
- **Public Intelligence Layer (`/api/public/skc/*`)**: Read-only, returns only strictly aggregated metrics (counts, themes, geography), requires no authentication.

### Consequence
- **Security:** Public frontends structurally cannot leak PII because the backend payload physically does not contain it.
- **Performance:** Public endpoints are lighter and can be heavily cached.
- **Complexity:** Requires maintaining dual serializers (one for raw data, one for aggregations).

---

## 2. Enforced Workflow Governance (State Machine)

### Context
Consultation data must transition from raw submission to final report material through a rigorously audited pipeline to ensure institutional trust.

### Decision
We implemented a strict, linear state machine governed by the `ConsultationStatus` enum:
`RECEIVED` → `UNDER_REVIEW` → `VERIFIED` → `USED_IN_DRAFT` → `VALIDATED` → `USED_IN_FINAL_REPORT` → `ARCHIVED`

### Consequence
- **Integrity:** Records cannot bypass validation steps.
- **Traceability:** State transitions are tied directly to the audit log.
- **Public Filtering:** The Public Intelligence API uses these states (`?visibility=archive`) to automatically filter out unverified data.

---

## 3. Server-to-Client Hydration Boundaries (Next.js)

### Context
To optimize for SEO and performance while maintaining interactivity for public dashboards.

### Decision
Public pages (`/state-of-kashmir-crafts/*`) use a strict Wrapper/Client pattern:
1. **Server Component Wrapper (`page.tsx`)**: Handles SEO `Metadata` and static shell rendering.
2. **Client Component (`[Page]Client.tsx`)**: Fetches data from `/api/public/skc/*` inside a `useEffect` hook.

### Consequence
- Prevents Next.js serialization errors caused by passing complex server-fetched objects directly to client components.
- Guarantees build-time safety (`npm run build` static generation passes).

---

## 4. Universal Audit Trail

### Context
An institutional assessment must prove *how* a specific finding was reached. 

### Decision
Every mutation to a `ConsultationSubmission` (status change, internal note addition) automatically triggers a `ConsultationAuditLog` entry detailing the `action`, `previousStatus`, `newStatus`, `changedBy` user, and a `timestamp`.

### Consequence
- **Non-repudiation:** Administrators have a permanent, immutable timeline of an application's lifecycle.
