# HCRF Technical Debt Registry

| Debt ID | Component | Description | Remediation Plan | Severity |
| :--- | :--- | :--- | :--- | :--- |
| TD-001 | Infrastructure | Missing Redis container | Replace `cacheMiddleware.ts` in-memory map with ioredis bindings when cache scale requires multi-node clustering. | Low |
| TD-002 | Search API | Prisma `contains` case-insensitive | Prisma `mode: insensitive` does not use standard Postgres indexing natively. Consider switching to raw `tsvector` / GIN indexing for true Full-Text Search. | Medium |
| TD-003 | Testing | Missing E2E suite | Integration tests are currently a simple `fetch` runner. Implement a robust Cypress or Playwright framework. | Medium |
