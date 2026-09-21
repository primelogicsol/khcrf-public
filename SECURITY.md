# Security & Governance Standard

## State of Kashmir Crafts (SKC) Assessment Platform

This document outlines the security perimeter, authentication boundaries, and data privacy policies enforced across the SKC platform.

---

## 1. Authentication & Authorization

### RBAC (Role-Based Access Control)
The platform distinguishes between the following roles:
- **Public / Anonymous:** Can view aggregated data dashboards and submit consultations. Cannot view specific submissions.
- **Admin (HCRF Staff):** Can access `/dashboard/skc/*`. Can view raw submissions, change workflow statuses, append internal notes, and view audit logs.

### Enforcement
- **Frontend Route Protection:** The `/dashboard/*` layout inherently requires a valid, authenticated session to mount.
- **Backend Route Protection:** All `/api/consultation` and `/api/audit` routes are protected by middleware verifying the JWT/Session of an Admin user.

---

## 2. Privacy Boundaries & Data Segregation

The primary security directive of the SKC platform is the absolute protection of participant identity and raw testimony from public disclosure until explicitly approved in a final published format.

### The "No-PII Payload" Rule
The Public Intelligence Layer (`/api/public/skc/*`) is mathematically restricted from querying or serializing:
- `participantName`
- `email`
- `phone`
- `internalNotes`
- `auditLog`
- File paths / File URLs

### Visibility Gating
Public routes pass a `?visibility=[stage]` query parameter to the backend. The backend enforces that only records matching specific, highly-vetted states are included in public aggregations.
- `visibility=expert` requires `VERIFIED` or higher.
- `visibility=report` requires `VALIDATED` or higher.
- Draft data (`RECEIVED`, `UNDER_REVIEW`) is silently dropped from public aggregations.

---

## 3. Evidence Handling

### File Uploads
- Evidence uploaded via the Participate form is stored securely on the remote storage provider.
- **Public Denial:** Public pages are strictly forbidden from rendering direct download links to evidence files. Aggregates may show the *count* of evidence items, but never the files themselves.

---

## 4. Known Threats & Mitigations

- **IDOR (Insecure Direct Object Reference):** Mitigated by the fact that the public API does not accept IDs. It only returns ecosystem-wide aggregates.
- **Data Scraping:** Scraping the public SKC pages will only yield statistical aggregates, safely preventing the harvesting of stakeholder contacts.
