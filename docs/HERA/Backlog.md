# HCRF Continuous Engineering Backlog

*Formula: Score = (Impact + InstValue) / (Risk + Effort)*

| Task ID | Queue | Description | Impact | Risk | Effort | InstValue | Score | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TSK-01 | Critical | Apply DB `@@index` to CanonicalEntity (title/slug/entityType) | 9 | 2 | 1 | 9 | 6.00 | **COMPLETE** |
| TSK-02 | UX | Implement Global React ErrorBoundary across Dashboard | 8 | 1 | 2 | 7 | 5.00 | **COMPLETE** |
| TSK-03 | InstEx | Align core Schema structure with CIDOC CRM ontology markers | 7 | 3 | 5 | 10 | 2.12 | **COMPLETE** |
| TSK-04 | DX | Scaffold robust end-to-end (E2E) testing suite framework | 9 | 1 | 8 | 6 | 1.66 | **COMPLETE** |
| TSK-05 | Platform | Migrate AI abstraction into actual Vector Search implementation | 8 | 4 | 7 | 8 | 1.45 | **COMPLETE** |
| TSK-06 | Security | Implement aggressive automated JWT token rotation | 9 | 5 | 6 | 7 | 1.45 | Ready |
| TSK-07 | UX | Build visual dashboard skeleton loader for slower taxonomy API queries | 7 | 1 | 3 | 7 | 3.50 | **COMPLETE** |
| TSK-08 | DX | Containerize entire monorepo with `docker-compose.yml` for unified spin-up | 8 | 3 | 5 | 8 | 2.00 | **COMPLETE** |
| TSK-09 | Critical | Audit database for orphaned rows across 14 relation entities | 9 | 2 | 3 | 9 | 3.60 | **COMPLETE** |
| TSK-10 | InstEx | Extend `MediaAsset` with IIIF image server manifest generation | 6 | 4 | 8 | 10 | 1.33 | **COMPLETE** |
| TSK-11 | DX | Centralize Prisma error handling mapping across all 14 domain controllers | 8 | 2 | 6 | 7 | 1.87 | **COMPLETE** |
| TSK-12 | Security | Enable helmet.js and secure CORS headers globally | 9 | 1 | 2 | 8 | 5.66 | **COMPLETE** |
| TSK-13 | Performance | Setup gzip and brotli compression middleware natively in express | 7 | 1 | 2 | 7 | 4.66 | **COMPLETE** |
| TSK-14 | InstEx | Implement generic pagination abstract interface for all list endpoints | 7 | 3 | 5 | 8 | 1.87 | **COMPLETE** |
| TSK-15 | Security | Set up strict rate limiting using express-rate-limit for API routes | 8 | 2 | 3 | 8 | 2.66 | **COMPLETE** |
| TSK-16 | DX | Configure structured JSON logging with Winston to replace console.log | 7 | 2 | 4 | 7 | 1.75 | **COMPLETE** |
| TSK-17 | UX | Implement global toast notification system in frontend for CRUD state | 8 | 2 | 4 | 8 | 2.00 | **COMPLETE** |
| TSK-18 | Platform | Build Redis caching layer abstraction for taxonomy endpoints | 7 | 5 | 6 | 8 | 1.16 | **COMPLETE** |
