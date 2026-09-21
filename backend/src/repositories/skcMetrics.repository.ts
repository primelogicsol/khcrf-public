import { PrismaClient, DataProvenance } from '@prisma/client';

// Provenance values that are excluded from all public-facing metrics.
// Records with these values are internal/governance-only.
const PUBLIC_PROVENANCE_FILTER = { dataProvenance: DataProvenance.PRODUCTION };
const EXCLUDED_FOR_REGISTERED = {
  dataProvenance: { notIn: [DataProvenance.TEST, DataProvenance.DEMO, DataProvenance.SEED] as DataProvenance[] }
};

export class SkcMetricsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // ────────────────────────────────────────────────────────────────────────────
  // Domain: Stakeholder Metrics
  // ────────────────────────────────────────────────────────────────────────────

  async getStakeholderMetrics() {
    const [verified, registered, pending] = await Promise.all([
      // verified = PRODUCTION + verifiedAt is not null
      this.prisma.skcStakeholderRegistration.count({
        where: {
          ...PUBLIC_PROVENANCE_FILTER,
          verifiedAt: { not: null },
        },
      }),
      // registered = not TEST, DEMO, or SEED (includes PRODUCTION + UNKNOWN)
      this.prisma.skcStakeholderRegistration.count({
        where: EXCLUDED_FOR_REGISTERED,
      }),
      // pending = UNKNOWN (awaiting classification)
      this.prisma.skcStakeholderRegistration.count({
        where: { dataProvenance: DataProvenance.UNKNOWN },
      }),
    ]);

    return { verified, registered, pending };
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Domain: Institution Metrics
  // ────────────────────────────────────────────────────────────────────────────

  async getInstitutionMetrics() {
    const [verified, registered] = await Promise.all([
      this.prisma.skcInstitutionRegistration.count({
        where: { ...PUBLIC_PROVENANCE_FILTER, verifiedAt: { not: null } },
      }),
      this.prisma.skcInstitutionRegistration.count({
        where: EXCLUDED_FOR_REGISTERED,
      }),
    ]);

    return { verified, registered };
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Domain: Hearing Metrics
  // ────────────────────────────────────────────────────────────────────────────

  async getHearingMetrics() {
    const [completed, published, total] = await Promise.all([
      this.prisma.skcHearing.count({
        where: {
          ...PUBLIC_PROVENANCE_FILTER,
          status: 'COMPLETED',
          isPublic: true,
        },
      }),
      this.prisma.skcHearing.count({
        where: {
          ...PUBLIC_PROVENANCE_FILTER,
          publicationStatus: 'PUBLISHED',
          isPublic: true,
        },
      }),
      this.prisma.skcHearing.count({
        where: PUBLIC_PROVENANCE_FILTER,
      }),
    ]);

    return { completed, published, total };
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Domain: Evidence Metrics
  // ────────────────────────────────────────────────────────────────────────────

  async getEvidenceMetrics() {
    const [totalSubmissions, evidenceVerified, findingsEstablished] = await Promise.all([
      this.prisma.skcEvidence.count({
        where: EXCLUDED_FOR_REGISTERED,
      }),
      this.prisma.skcEvidence.count({
        where: {
          ...PUBLIC_PROVENANCE_FILTER,
          status: 'VERIFIED',
        },
      }),
      this.prisma.skcEvidence.count({
        where: {
          ...PUBLIC_PROVENANCE_FILTER,
          isReferencedInFinal: true,
        },
      }),
    ]);

    return { totalSubmissions, evidenceVerified, findingsEstablished };
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Domain: Assessment Progress
  // ────────────────────────────────────────────────────────────────────────────

  async getAssessmentProgress() {
    const [totalCycles, activeCycles, completedStages, totalStages] = await Promise.all([
      this.prisma.skcAssessmentCycle.count(),
      this.prisma.skcAssessmentCycle.count({ where: { status: 'ACTIVE' } }),
      this.prisma.skcLifecycleStage.count({ where: { status: 'COMPLETED' } }),
      this.prisma.skcLifecycleStage.count(),
    ]);

    return { totalCycles, activeCycles, completedStages, totalStages };
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Domain: Validation Metrics
  // ────────────────────────────────────────────────────────────────────────────

  async getValidationMetrics() {
    const [publishedHearings] = await Promise.all([
      this.prisma.skcHearing.count({
        where: { ...PUBLIC_PROVENANCE_FILTER, publicationStatus: 'PUBLISHED' },
      }),
    ]);

    return { publishedHearings };
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Domain: Publication Metrics
  // ────────────────────────────────────────────────────────────────────────────

  async getPublicationMetrics() {
    const publishedEvidence = await this.prisma.skcEvidence.count({
      where: { ...PUBLIC_PROVENANCE_FILTER, visibility: 'PUBLIC' },
    });

    return { publishedEvidence };
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Aggregate: Public Summary (citizen-facing metrics)
  // All fields MUST be sourced from the canonical domain methods above — no independent queries.
  // ────────────────────────────────────────────────────────────────────────────

  async getPublicSummary() {
    const [stakeholderMetrics, hearingMetrics, evidenceMetrics] = await Promise.all([
      this.getStakeholderMetrics(),
      this.getHearingMetrics(),
      this.getEvidenceMetrics(),
    ]);

    return {
      verifiedStakeholders: stakeholderMetrics.verified,
      completedHearings: hearingMetrics.completed,
      verifiedEvidence: evidenceMetrics.evidenceVerified,
      findingsEstablished: evidenceMetrics.findingsEstablished,
    };
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Aggregate: Dashboard Summary (internal admin metrics)
  // ────────────────────────────────────────────────────────────────────────────

  async getDashboardSummary() {
    const [stakeholderMetrics, evidenceMetrics, institutionMetrics] = await Promise.all([
      this.getStakeholderMetrics(),
      this.getEvidenceMetrics(),
      this.getInstitutionMetrics(),
    ]);

    return {
      pendingReviews: stakeholderMetrics.pending,
      totalInputVolume: evidenceMetrics.totalSubmissions,
      verifiedInstitutions: institutionMetrics.verified,
    };
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Aggregate: Executive Summary (board/reporting metrics)
  // ────────────────────────────────────────────────────────────────────────────

  async getExecutiveSummary() {
    const [stakeholderMetrics, institutionMetrics, evidenceMetrics, hearingMetrics] = await Promise.all([
      this.getStakeholderMetrics(),
      this.getInstitutionMetrics(),
      this.getEvidenceMetrics(),
      this.getHearingMetrics(),
    ]);

    return {
      verifiedStakeholders: stakeholderMetrics.verified,
      verifiedInstitutions: institutionMetrics.verified,
      totalInputVolume: evidenceMetrics.totalSubmissions,
      completedHearings: hearingMetrics.completed,
      findingsEstablished: evidenceMetrics.findingsEstablished,
    };
  }
}
