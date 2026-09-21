| File | Git state | Classification | Referenced by application | Potential impact | Risk |
|---|---|---|---|---|---|
| ackend/check.ts | M | Test or diagnostic script | No | Safe | Low |
| backend/prisma/schema.prisma | M | Database schema | No | Contains: Direct PostgreSQL | High |
| backend/src/controllers/magazineIssueController.ts | M | Application source | Yes | Contains: Direct PostgreSQL | High |
| backend/src/controllers/masterArtisanFeatureController.ts | M | Application source | Yes | Contains: Direct PostgreSQL | High |
| backend/src/controllers/masterArtisanIssueController.ts | M | Application source | Yes | Contains: Direct PostgreSQL | High |
| backend/src/controllers/masterArtisanSeriesController.ts | M | Application source | Yes | Contains: Direct PostgreSQL | High |
| backend/src/controllers/masterArtisanStoryController.ts | M | Application source | Yes | Contains: Direct PostgreSQL | High |
| backend/src/controllers/membershipController.ts | M | Application source | Yes | Contains: Direct PostgreSQL | High |
| backend/src/controllers/userController.ts | M | Application source | Yes | Contains: Direct PostgreSQL, Hardcoded credentials | High |
| backend/src/middleware/authMiddleware.ts | M | Application source | Yes | Contains: Direct PostgreSQL, Hardcoded credentials | High |
| backend/src/middleware/optionalAuthMiddleware.ts | M | Application source | Yes | Contains: Direct PostgreSQL, Hardcoded credentials | High |
| backend/src/routes/magazineIssueRoutes.ts | M | Application source | Yes | Contains: Direct PostgreSQL | High |
| backend/src/routes/masterArtisanRoutes.ts | M | Application source | Yes | Contains: Direct PostgreSQL | High |
| backend/src/routes/membershipRoutes.ts | M | Application source | Yes | Contains: Direct PostgreSQL | High |
| backend/src/routes/userRoutes.ts | M | Application source | Yes | Contains: Direct PostgreSQL | High |
| backend/src/tests/controllers/masterArtisanFeatureController.test.ts | M | Application source | Yes | Contains: Direct PostgreSQL, Hardcoded credentials | High |
| backend/src/tests/controllers/masterArtisanSeriesController.test.ts | M | Application source | Yes | Contains: Direct PostgreSQL, Hardcoded credentials | High |
| backend/src/tests/controllers/masterArtisanStoryController.test.ts | M | Application source | Yes | Contains: Direct PostgreSQL, Hardcoded credentials | High |
| backend/src/utils/errorMapper.ts | M | Application source | Yes | Safe | Low |
| backend/src/validators/masterArtisanEditorialValidator.ts | M | Application source | Yes | Contains: Direct PostgreSQL | High |
| frontend/next.config.mjs | M | Configuration | No | Contains: Production URLs | High |
| frontend/package-lock.json | M | Deployment or infrastructure | No | Contains: Direct PostgreSQL | High |
| frontend/package.json | M | Deployment or infrastructure | No | Safe | Low |
| frontend/src/app/(main)/about/memberships/join/MembershipFormClient.tsx | M | Application source | Yes | Contains: Direct PostgreSQL | High |
| frontend/src/app/(main)/master-artisans/issues/[slug]/page.tsx | M | Application source | Yes | Contains: Direct PostgreSQL | High |
| frontend/src/app/(main)/master-artisans/issues/page.tsx | M | Application source | Yes | Contains: Direct PostgreSQL | High |
| frontend/src/app/dashboard/layout.tsx | M | Application source | Yes | Safe | Low |
| frontend/src/app/dashboard/master-artisans/magazine-issues/[id]/edit/page.tsx | M | Application source | Yes | Contains: Direct PostgreSQL | High |
| frontend/src/app/dashboard/master-artisans/magazine-issues/create/page.tsx | M | Application source | Yes | Contains: Direct PostgreSQL | High |
| frontend/src/app/dashboard/membership/MembershipManagementClient.tsx | M | Application source | Yes | Contains: Direct PostgreSQL | High |
| frontend/src/app/dashboard/users/UsersClient.tsx | M | Application source | Yes | Contains: Direct PostgreSQL, Hardcoded credentials | High |
| frontend/src/components/common/Select.tsx | M | Application source | Yes | Contains: Direct PostgreSQL | High |
| frontend/src/components/dashboard/Sidebar.tsx | M | Application source | Yes | Contains: Direct PostgreSQL | High |
| frontend/src/config/dashboard.ts | M | Application source | Yes | Safe | Low |
| audit_classify.js | ?? | Database manipulation script | No | Contains: Direct PostgreSQL, db push/migration, File-system writes | High |
| audit_dirty_status.txt | ?? | Documentation | No | Safe | Low |
| backend/admin_tests.log | ?? | Unknown | No | Safe | Low |
| backend/append_tests.js | ?? | Database manipulation script | No | Contains: Direct PostgreSQL, File-system writes | High |
| backend/check-fayaz.js | ?? | Test or diagnostic script | No | Safe | Low |
| backend/count-pubs.js | ?? | Test or diagnostic script | No | Safe | Low |
| backend/debug_feature.js | ?? | Database manipulation script | No | Contains: File-system writes | High |
| backend/debug_story.js | ?? | Database manipulation script | No | Contains: File-system writes | High |
| backend/debug_story2.js | ?? | Database manipulation script | No | Contains: File-system writes | High |
| backend/fixAdminStatus.ts | ?? | Database manipulation script | No | Contains: Direct PostgreSQL | High |
| backend/fix_series_test.js | ?? | Database manipulation script | No | Contains: Direct PostgreSQL, File-system writes | High |
| backend/get-member.js | ?? | Test or diagnostic script | No | Safe | Low |
| backend/inventory-roles.js | ?? | Database manipulation script | No | Contains: Direct PostgreSQL | High |
| backend/log_error.js | ?? | Database manipulation script | No | Contains: File-system writes | High |
| backend/log_error_3.js | ?? | Database manipulation script | No | Contains: File-system writes | High |
| backend/log_error_type.js | ?? | Database manipulation script | No | Contains: File-system writes | High |
| backend/log_response_body.js | ?? | Database manipulation script | No | Contains: File-system writes | High |
| backend/restoreDB.ts | ?? | Database manipulation script | No | Contains: Direct PostgreSQL | High |
| backend/setup-sysadmin.ts | ?? | Database manipulation script | No | Contains: Direct PostgreSQL, Production URLs, Hardcoded credentials | High |
| backend/src/config/permissions.ts | ?? | Application source | Yes | Safe | Low |
| backend/src/config/rolePermissions.ts | ?? | Application source | Yes | Safe | Low |
| backend/src/middleware/rbacMiddleware.ts | ?? | Application source | Yes | Contains: Direct PostgreSQL | High |
| backend/test-access.js | ?? | Database manipulation script | No | Contains: Direct PostgreSQL, Hardcoded credentials | High |
| backend/test-membership.js | ?? | Database manipulation script | No | Contains: Hardcoded credentials | High |
| backend/test-rbac-magazine.js | ?? | Database manipulation script | No | Contains: Direct PostgreSQL, Hardcoded credentials | High |
| backend/test-rbac-membership.js | ?? | Database manipulation script | No | Contains: Direct PostgreSQL, Hardcoded credentials | High |
| backend/testAccess.ts | ?? | Database manipulation script | No | Contains: Direct PostgreSQL | High |
| backend/testAdminAccess.ts | ?? | Database manipulation script | No | Contains: Direct PostgreSQL | High |
| backend/testMembershipApproval.ts | ?? | Database manipulation script | No | Contains: Direct PostgreSQL | High |
| backend/update.js | ?? | Database manipulation script | No | Contains: Direct PostgreSQL | High |
| backend/update.ts | ?? | Database manipulation script | No | Contains: Direct PostgreSQL | High |
| backend/update2.ts | ?? | Database manipulation script | No | Contains: Direct PostgreSQL | High |
| backend/updateDB.js | ?? | Database manipulation script | No | Contains: Direct PostgreSQL | High |
| backend/updateDB.ts | ?? | Database manipulation script | No | Contains: Direct PostgreSQL | High |
| backend/updateRoleEnum.js | ?? | Database manipulation script | No | Contains: Direct PostgreSQL, File-system writes | High |
| backend/updateTest.ts | ?? | Database manipulation script | No | Contains: Direct PostgreSQL | High |
| backend/update_all_catch.js | ?? | Database manipulation script | No | Contains: File-system writes | High |
| backend/update_catch.js | ?? | Database manipulation script | No | Contains: File-system writes | High |
| backend/update_catch2.js | ?? | Database manipulation script | No | Contains: File-system writes | High |
| backend/update_catch3.js | ?? | Database manipulation script | No | Contains: File-system writes | High |
| backend/update_catch4.js | ?? | Database manipulation script | No | Contains: File-system writes | High |
| frontend/postcss.config.mjs.bak | ?? | Configuration | No | Safe | Low |
| frontend/public/images/ | ?? | Unknown | No | Safe | Low |
| frontend/src/components/master-artisans/ | ?? | Unknown | Yes | Safe | Low |
| frontend/src/tests/master-artisans/issues-filter.test.ts | ?? | Application source | Yes | Safe | Low |
| frontend/update-roles.js | ?? | Database manipulation script | No | Contains: File-system writes | High |
| membership_access_audit.md | ?? | Documentation | No | Safe | Low |