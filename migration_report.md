# Publication Module Architecture Migration Report

## 1. Files Using Both Models (Highest Risk)
- frontend\src\app\(standalone)\publications\read\[slug]\page.tsx
- frontend\src\app\dashboard\business\publications\add\page.tsx
- frontend\src\app\dashboard\business\publications\[id]\preview\page.tsx
- frontend\src\components\dashboard\publications\ContributorIntelligenceModal.tsx
- frontend\src\components\dashboard\publications\IntelligenceContentEngine.tsx
- frontend\src\components\dashboard\publications\KnowledgeGraphManager.tsx
- frontend\src\components\dashboard\publications\PublicationForm.tsx
- frontend\src\components\dashboard\publications\SmartBulkImportModal.tsx

## 2. Files Using Legacy Model (Requires Refactor)
- frontend\src\app\(legislative-dashboard)\legislative-dashboard\LegislativeProfileClient.tsx
- frontend\src\app\(main)\about\compliance\page.tsx
- frontend\src\app\(main)\about\contact\page.tsx
- frontend\src\app\(main)\about\hcrf-project\page.tsx
- frontend\src\app\(main)\about\leadership\page.tsx
- frontend\src\app\(main)\about\mission\page.tsx
- frontend\src\app\(main)\business-support\accreditation\page.tsx
- frontend\src\app\(main)\legislative-office\post\[id]\PostDetailClient.tsx
- frontend\src\app\(main)\legislative-office\[slug]\components\PostCard.tsx
- frontend\src\app\(main)\legislative-office\[slug]\components\PostSummary.tsx
- frontend\src\app\(main)\legislative-office\[slug]\LegislativePortal.tsx
- frontend\src\app\(main)\legislative-office\[slug]\OfficeBlogClient.tsx
- frontend\src\app\dashboard\cms\accreditations\page.tsx
- frontend\src\app\dashboard\cms\compliance\page.tsx
- frontend\src\app\dashboard\cms\contact\page.tsx
- frontend\src\app\dashboard\cms\hcrf-project\page.tsx
- frontend\src\app\dashboard\cms\hero\page.tsx
- frontend\src\app\dashboard\cms\leadership\page.tsx
- frontend\src\app\dashboard\cms\mission-framework\page.tsx
- frontend\src\app\dashboard\cms\partner-stats\page.tsx
- frontend\src\components\common\PartnerStats.tsx
- frontend\src\components\dashboard\publications\CraftAuthorityEngine.tsx
- frontend\src\components\dashboard\publications\ManuscriptImportModal.tsx
- frontend\src\components\dashboard\publications\PublicationReadinessEngine.tsx
- frontend\src\components\Footer.tsx
- frontend\src\components\Hero.tsx
- backend\src\controllers\publicationContentController.ts

## 3. Files Using Nested Model (Correct Architecture)
- frontend\src\app\(main)\publications\[slug]\page.tsx
- frontend\src\app\dashboard\business\publications\content-studio\page.tsx
- frontend\src\app\dashboard\business\publications\[id]\public-preview\page.tsx
- frontend\src\app\dashboard\ccsi\CcsiClient.tsx
- frontend\src\components\common\BookCreationForm.tsx
- frontend\src\components\dashboard\publications\BulkClassificationModal.tsx
- frontend\src\components\dashboard\publications\BulkUploadModal.tsx
- frontend\src\components\dashboard\publications\SmartImportModal.tsx
- backend\src\controllers\publicationController.ts
- backend\src\seedPublications.ts
