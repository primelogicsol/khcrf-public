# Source of Truth

## Repository Information
- **Repository Root:** `C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind`
- **Current Branch:** `audit/khcrf-full-platform-forensic-audit`
- **Current Commit SHA:** `2727f34` (HEAD -> audit/khcrf-full-platform-forensic-audit, main) fix: update release references and secure smoke test cookie handling
- **Remote main SHA:** `8bd0959edcff9b4a6bd8dd5e0067e0415175bd6f` (from `production` remote `refs/heads/main`)
- **Actual production runtime SHA:** unverified
- **Production container digest:** unverified
- **VPS working-tree state:** unverified
- **Production database migration state:** unverified
- **Staging Deployment SHA:** Unknown (No staging remote configured)
- **Last Known Fully Functional SHA:** `4e1b8a9` (v2026.07-skc-classification-certified) or `9bb153a` (master-artisans-phase1-complete) based on tags.
- **Last Production-Certified SHA:** `3275d30` (v2026.07-skc-production-ready)
- **Current Uncommitted Changes:** 34 modified files, 45 untracked files.
- **Current Remote Branches:**
  - `origin/main`
  - `origin/rc2-development`
  - `origin/design-system/phase-3b-public-page-framework`
  - `origin/feature/incremental-cicd`
  - `production/main`

## Environment Information
- **Current Deployment Workflow:** Unknown (Requires GitHub Actions / CI inspection)
- **Current Production Database:** PostgreSQL (URI not verified yet)
- **Current Development Database:** PostgreSQL (Local `hcrf_db_clean` at `127.0.0.1:5432`)
- **Current VPS Deployment Directory:** Unknown (Requires VPS inspection)
- **Current Docker Image/Container Versions:** Docker not running locally (Docker Desktop Linux Engine missing/not started).
- **Current Runtime Environment:** Windows (win32)
- **Current Node.js Version:** `v24.14.1`
- **Current Package Manager Version:** npm `11.11.0`
- **Current Next.js Version:** Unverified (in `frontend/package.json`)
- **Current Prisma Version:** `6.5.0`
- **Current PostgreSQL Version:** Unknown (Needs DB query)

## Conclusion
The authoritative environment is currently the local Windows setup running Node.js `v24.14.1` with Prisma `6.5.0`.
The local commit SHA is `2727f34`, but the remote production HEAD is `8bd0959`. `8bd0959` is the remote main SHA. It is not yet proven to be the SHA currently running in production. The production runtime SHA, image digest, VPS source state, and migration state remain unverified.
The presence of uncommitted changes and unapplied scripts suggests that local development is actively modifying the repository without committing to source control.
