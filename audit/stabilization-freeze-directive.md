# KHCRF Full Stabilization Freeze Directive

KHCRF.org is now under a full stabilization freeze.

Do not develop, add, expand, redesign, or activate any new module.

## Authorized Work Scope
The only authorized work is:
1. Complete the forensic audit.
2. Establish one verified source-of-truth baseline.
3. Reconcile Git, Prisma migrations, database state, API contracts, dashboard permissions, deployment state, and production runtime.
4. Create an automated multi-module regression suite.
5. Repair confirmed regressions in a controlled sequence.
6. Demonstrate that all major modules operate together from a clean checkout and reproducible deployment.

## Core Rules for Module Completion
No module may be declared complete merely because its own interface works.
It is complete only when:
- New module works
- All existing modules still work
- Database migration is reversible
- API contracts remain compatible
- Production build passes
- Rollback is documented

Every change must prove that existing modules remain functional.

## Database Discipline
Do not use standalone database-fix scripts, manual database edits, `prisma db push --accept-data-loss`, destructive seeds, or undocumented role changes.

All database changes must use reviewed, named migrations with:
- Impact analysis
- Data-preservation plan
- Regression tests
- Rollback procedure
- Production verification

## Change Management
Before modifying any shared file, identify every dependent module.
After every repair, run the full regression suite.
New feature development may resume only after the platform passes the stabilization acceptance criteria and a stable release is tagged.
