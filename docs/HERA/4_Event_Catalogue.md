# Document 4: Domain Event Catalogue
**HERA v1.0 Enterprise Architecture**

Event Sourcing enables historical traceability, decoupled micro-workflows, and automated notifications.

| Domain Event | Publisher | Consumers | Trigger | Payload / Business Meaning |
| :--- | :--- | :--- | :--- | :--- |
| `CraftCreated` | Knowledge Service | Search Service, Audit Service | A new craft is drafted. | `{ craftId, authorId, timestamp }` |
| `CraftVerified`| Knowledge Service | Notification Service | Craft passes Expert Panel. | `{ craftId, verifierId, evidence }` |
| `MasterArtisanPublished` | People Service | Search Service, SEO Service | Artisan profile goes live. | `{ artisanId, slug }` Triggers site re-index. |
| `DocumentaryUploaded` | Media Service | AI Service | Raw video file hits S3. | `{ mediaId, s3Url }` Triggers AI transcript generation. |
| `PaymentSucceeded` | Payment Service | Membership Service | Razorpay clears payment. | `{ transactionId, userId, amount }` Activates member tier. |
| `MembershipActivated`| Membership Service| Notification Service | User status changes to MEMBER. | `{ userId, tier }` Triggers welcome email. |
| `ReviewRejected` | Workflow Service | Notification Service | Editorial review fails. | `{ entityId, reviewerId, reason }` Alerts author. |
| `ArtifactArchived` | Museum Service | Search Service | Museum object status changes. | `{ artifactId, condition }` |

*Future Integrations:* Events will trigger AI vector embedding updates automatically.
