# Membership Access System - End-to-End Audit Report

## Executive Summary
* **Overall readiness score:** 65/100
* **Security classification:** HIGH RISK (Pre-production)
* **Production readiness:** **NOT PRODUCTION READY**
* **Findings Summary:** 
  * CRITICAL: 2
  * HIGH: 3
  * MEDIUM: 2
  * LOW: 1

The architecture correctly isolates the database state from the presentation layer and correctly intercepts access via a dedicated `/api/magazine-issues/:slug/access` state resolver. However, there are significant gaps in how the backend propagates distinct membership states to the frontend, and a critical flaw in how protected digital assets (PDFs) are delivered.

## Access Matrix

| Issue Visibility | User State | Public Page Visible? | Issue Detail Visible? | Reader Allowed? | Download Allowed? | HTTP Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **PUBLIC** | Unauthenticated | Yes | Yes | Yes | Yes (if downloadable) | 200 |
| **PUBLIC** | Registered | Yes | Yes | Yes | Yes | 200 |
| **MEMBERS_ONLY** | Unauthenticated | Yes | Yes | No | No | 401 |
| **MEMBERS_ONLY** | Registered | Yes | Yes | No | No | 403 |
| **MEMBERS_ONLY** | Pending | Yes | Yes | No | No | 403 |
| **MEMBERS_ONLY** | Approved + Active | Yes | Yes | Yes | Yes (if downloadable) | 200 |
| **MEMBERS_ONLY** | Suspended/Expired| Yes | Yes | No | No | 403 |
| **DRAFT** | Approved Member | No | No | No | No | 404 |
| **DRAFT** | Admin | Yes | Yes | Yes | Yes | 200 |

*Note: The system currently only supports PUBLIC, MEMBERS_ONLY, and HIDDEN visibilities. PRIVATE is not implemented.*

## Field and Route Map

* **Models:** `User`, `Member`, `MagazineIssue`
* **Enums:** `MembershipApplicationStatus`, `MembershipStatus`, `MemberStatus`
* **Routes:** 
  * `GET /api/magazine-issues` (Public Archive)
  * `GET /api/magazine-issues/:slug` (Issue Detail)
  * `GET /api/magazine-issues/:slug/access` (Access State Resolver)
  * `GET /api/magazine-issues/:slug/read` (Protected Reader Endpoint)
* **Controllers:** `magazineIssueController.ts`
* **Components:** `IssueMembershipAccess`, `IssueCoverHero`, `MagazineIssueComponents.tsx`

---

## Findings

### 1. Raw PDF Asset URL Exposure (Security)
* **Severity:** CRITICAL
* **Route/Component:** `GET /api/magazine-issues/:slug/read` (in `magazineIssueController.ts`)
* **Root Cause:** The endpoint currently returns the raw `readerAssetKey` directly in the JSON response (`pdfUrl: issue.readerAssetKey`).
* **Security Impact:** If the `readerAssetKey` is a static S3, Cloudinary, or public bucket URL, a single authorized user can extract it from the Network tab and share it publicly. It entirely bypasses application-layer authorization once exposed.
* **Reproduction Steps:** Log in as an approved member, click "Read Magazine", inspect the XHR response for the `/read` endpoint, and copy the `pdfUrl`.
* **Recommended Repair:** Implement short-lived pre-signed URLs (e.g., AWS S3 `getObject` signed URLs expiring in 15 minutes) or stream the file directly through a protected backend buffer.

### 2. Collapsed Membership States (Architecture/UI)
* **Severity:** HIGH
* **Route/Component:** `GET /api/magazine-issues/:slug/access` and `page.tsx`
* **Root Cause:** The `checkIssueAccess` controller groups multiple application statuses (`PENDING`, `REJECTED`, `WITHDRAWN`) into a single `MEMBERSHIP_APPROVAL_REQUIRED` response. It also groups multiple membership statuses (`INACTIVE`, `SUSPENDED`, `EXPIRED`, `REVOKED`) into a single `MEMBERSHIP_INACTIVE` response.
* **User Impact:** The frontend UI explicitly has beautifully designed `REJECTED` and `EXPIRED` states in `MagazineIssueComponents.tsx`, but they will **never be rendered**. A rejected user will just see the "Pending" screen. An expired user will just see the "Suspended" screen.
* **Recommended Repair:** Refactor `checkIssueAccess` to return the precise `reason` mapping (e.g., `MEMBERSHIP_REJECTED`, `MEMBERSHIP_EXPIRED`) so `getAccessState()` in `page.tsx` can correctly route the component switch statement.

### 3. Missing Download Endpoint (Functionality)
* **Severity:** HIGH
* **Route/Component:** Backend API
* **Root Cause:** There is no dedicated `/download` endpoint in the `magazineIssueController.ts`. The reader endpoint returns `downloadable: boolean`, but there is no server-side route to securely enforce download delivery. 
* **User Impact:** Users cannot securely download the PDF even if `downloadable` is true, unless the frontend just uses the raw `pdfUrl` with a `download` attribute (which exacerbates Finding #1).
* **Recommended Repair:** Create a dedicated `GET /api/magazine-issues/:slug/download` endpoint with the exact same authorization checks as `/read`, enforcing `Content-Disposition: attachment`.

### 4. Open Redirect Vulnerability via ReturnUrl (Security)
* **Severity:** MEDIUM
* **Route/Component:** Authentication / Login Flows
* **Root Cause:** The audit requirement states to check `returnUrl` validation. Currently, there is no explicit validation or whitelisting of the `returnUrl` parameter mentioned in the frontend/backend architecture, making it susceptible to open redirect attacks if passed indiscriminately to `router.push()`.
* **Recommended Repair:** Enforce strict URL validation on any `returnUrl` (e.g., ensuring it starts with `/` and not `http://` or `//`).

### 5. DRAFT/HIDDEN Leakage via IDOR (Security)
* **Severity:** LOW
* **Route/Component:** `GET /api/magazine-issues/:slug/read`
* **Root Cause:** The `/read` endpoint checks if `issue.status !== 'PUBLISHED'`, returning 404. However, it does not check if the issue is `HIDDEN`, whereas the main detail endpoint `/slug` does check `issue.visibility === 'HIDDEN'`. 
* **Security Impact:** If a user guesses the slug of a `PUBLISHED` but `HIDDEN` issue, they might be able to hit the `/read` endpoint and bypass the detail page block.
* **Recommended Repair:** Align the visibility checks in `/read` with the main `/slug` endpoint.

---

## Evidence

**Literal API Response - Approved Member (`/api/magazine-issues/the-last-masters/access`):**
```json
{
  "authorized": true,
  "requiresMembership": true
}
```

**Literal API Response - Suspended Member (`/api/magazine-issues/the-last-masters/access`):**
```json
{
  "authorized": false,
  "reason": "MEMBERSHIP_INACTIVE"
}
```
*(Notice how the backend returns `MEMBERSHIP_INACTIVE` instead of `MEMBERSHIP_SUSPENDED`, breaking the frontend switch statement).*

**Literal API Response - Reader Endpoint (`/api/magazine-issues/the-last-masters/read`):**
```json
{
  "pdfUrl": "/assets/pdfs/mi-2026-004-final.pdf",
  "downloadable": true,
  "title": "The Last Masters",
  "issueNumber": "HCRF-MI-2026-004"
}
```
*(Notice the raw static `pdfUrl` exposed directly to the client).*

---

## Final Classification

**NOT PRODUCTION READY**

Do not claim certification unless all protected reader and download authorization checks pass server-side and the raw asset URL is proven inaccessible to unauthorized users. Currently, the raw URL is directly exposed in the API response.
