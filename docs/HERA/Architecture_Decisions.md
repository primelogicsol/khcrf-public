# HCRF Architecture Decisions (ADR)

## ADR-001: Centralized Prisma Client Instantiation
- **Context:** Node.js backend utilizing `@prisma/adapter-pg` resulted in runtime client initialization failures due to missing edge bindings when instantiated per-service.
- **Decision:** Centralize instantiation into a singleton exported from `config/db.ts` to ensure edge-adapter continuity and prevent connection pooling exhaustion.

## ADR-002: In-Memory vs Redis Caching
- **Context:** Need to optimize global search API latency without imposing immediate infrastructure bloat (Docker Redis).
- **Decision:** Built a custom Express `cacheMiddleware` acting as a localized LRU map cache, which can be transparently swapped with an asynchronous Redis client in the future (Technical Debt logged).
