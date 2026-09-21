# Document 3: Relationship Catalogue
**HERA v1.0 Enterprise Architecture**

This catalogue defines the institutional relationship graph. Relationships are first-class citizens in HERA.

| Source Entity | Relationship Edge | Target Entity | Cardinality | Context / Business Rule |
| :--- | :--- | :--- | :--- | :--- |
| **Craft** | `uses_material` | **Material** | N:M | A craft must have materials. |
| **Craft** | `uses_tool` | **Tool** | N:M | |
| **MasterArtisan** | `practices` | **Craft** | N:M | Defines expertise area. |
| **MasterArtisan** | `mentors` | **Apprentice** | 1:N | Tracks lineage and legacy. |
| **MasterArtisan** | `belongs_to` | **WorkshopCommunity** | N:1 | |
| **MasterArtisan** | `appears_in` | **Documentary** | N:M | Links humans to media records. |
| **Documentary** | `documents` | **Technique** | N:M | |
| **Artifact** | `part_of` | **Collection** | N:1 | Museum hierarchy. |
| **Artifact** | `created_by` | **MasterArtisan** | N:1 | Provenance tracking. |
| **GlossaryTerm** | `references` | **Craft** | N:M | Semantic linking. |
| **Publication** | `features` | **Craft** | N:M | Editorial tagging. |
| **Any Entity** | `verified_by` | **VerificationRecord**| 1:N | Audit requirement. |
| **Organization**| `certified_by` | **Standard** | N:M | Compliance and CCSI. |

*Architectural Principle: Use relationship edges (`appears_in`) rather than duplicating text metadata on entities.*
