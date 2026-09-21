# Document 7: Platform Service Dependency Graph
**HERA v1.0 Enterprise Architecture**

This graph defines the strict execution order for platform development. A service cannot be built if its dependencies are missing.

| Platform Service | Depends On | Criticality | Risk if Missing | Order of Implementation |
| :--- | :--- | :--- | :--- | :--- |
| **Identity Service** | *None* | Highest | Complete platform vulnerability. | 1 (Sprint 0) |
| **Audit Service** | Identity | High | Loss of institutional accountability. | 2 (Sprint 0) |
| **Media Service** | Identity | High | Storage bloat, unscalable media delivery. | 3 (Sprint 0) |
| **Knowledge Service** | Identity, Audit | Highest | Everything else lacks canonical context. | 4 (Sprint 1) |
| **People Service** | Knowledge, Media | High | Artisans cannot be linked to Crafts. | 5 (Sprint 2) |
| **Museum Service** | Knowledge, Media | High | Artifacts lack material/craft context. | 6 (Sprint 3) |
| **Editorial Service**| Knowledge, Media, People | Medium | Publications lack semantic tags and authors. | 7 (Sprint 4) |
| **Participation Service**| Workflow, Identity | Medium | Public submissions will be lost/unreviewed. | 8 (Sprint 5) |
| **Business Service** | Identity, Knowledge | Medium | Certifications cannot link to Crafts. | 9 (Sprint 6) |
| **Search & AI Service**| ALL Services | High | Platform is a silo; data is undiscoverable. | 10 (Sprint 7) |
| **Observatory Service**| ALL Services | High | Admin loses visibility into platform health. | 11 (Sprint 8) |
