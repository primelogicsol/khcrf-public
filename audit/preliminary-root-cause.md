# Preliminary Root-Cause Observation (Subject to Verification)

The forensic audit has identified significant indicators that the development workflow gradually shifted from controlled, migration-driven engineering toward ad hoc corrective changes.

Current evidence includes:

* A large divergence between the committed repository and the active local working tree.
* Numerous standalone database manipulation scripts outside the standard Prisma migration lifecycle.
* Multiple modified and untracked files that are not represented by the authoritative Git history.
* Signs of architectural drift between frontend, backend, API contracts, and role management.

These findings indicate that previous development activities may have introduced changes directly into database state, API behavior, authorization logic, or shared infrastructure without preserving a single authoritative source of truth.

At this stage, the audit has **not yet established a direct causal relationship** between these observations and every reported regression.

The next phases of the forensic audit will determine:

* Which changes were actually executed.
* Which environments they affected.
* Which modules were impacted.
* Which regressions can be directly traced to specific commits, scripts, schema changes, or deployment actions.

Until that evidence chain is completed, any attribution of individual failures remains provisional.
