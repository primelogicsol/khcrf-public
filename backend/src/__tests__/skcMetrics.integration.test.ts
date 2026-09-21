import { DataProvenance } from '@prisma/client';
import { SkcMetricsRepository } from '../repositories/skcMetrics.repository';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { prisma } from '../config/db';

describe('SKC Metrics Runtime Consistency (P2)', () => {
  let repository: SkcMetricsRepository;
  let testCycleId: string;
  let testHearingId: string;

  beforeAll(async () => {
    if (process.env.NODE_ENV !== 'test' || !process.env.DATABASE_URL?.includes('_test')) {
      throw new Error('Refusing destructive SKC test setup outside dedicated test database');
    }

    repository = new SkcMetricsRepository(prisma);

    // 0. Truncate pollution from previous test runs using specific IDs
    await prisma.skcEvidence.deleteMany({ where: { slug: { startsWith: 'ev-' } } });
    await prisma.hearingRegistration.deleteMany({ where: { referenceNumber: { startsWith: 'HR-TEST-' } } });
    await prisma.skcHearing.deleteMany({ where: { slug: { startsWith: 'hearing-' } } });
    await prisma.skcInstitutionRegistration.deleteMany({ where: { referenceNumber: { startsWith: 'INST-METRICS-TEST-' } } });
    await prisma.skcStakeholderRegistration.deleteMany({ where: { referenceNumber: { startsWith: 'SH-METRICS-TEST-' } } });
    await prisma.skcLifecycleStage.deleteMany({ where: { key: { startsWith: 'STAGE_TEST_' } } });
    await prisma.skcAssessmentCycle.deleteMany({ where: { cycle_label: 'Metrics Consistency Test Cycle' } });

    // 1. Setup Assessment Cycle
    const cycle = await prisma.skcAssessmentCycle.create({
      data: {
        cycle_id: `2026-${Date.now()}`,
        cycle_label: 'Metrics Consistency Test Cycle',
        status: 'ACTIVE',
      }
    });
    testCycleId = cycle.id;
    
    await prisma.skcLifecycleStage.create({
      data: {
        key: `STAGE_TEST_${Date.now()}`,
        title: 'Validation Phase',
        status: 'IN_PROGRESS',
        order: 1,
        assessmentCycleId: testCycleId
      }
    });

    // 2. Insert SkcStakeholderRegistration
    await prisma.skcStakeholderRegistration.createMany({
      data: [
        {
          referenceNumber: `SH-METRICS-TEST-PROD-VERIFIED-${Date.now()}`,
          fullName: 'Verified Stakeholder',
          category: 'GENERAL',
          email: 'verified@example.com',
          dataProvenance: DataProvenance.PRODUCTION,
          verifiedAt: new Date()
        },
        {
          referenceNumber: `SH-METRICS-TEST-PROD-UNVERIFIED-${Date.now()}`,
          fullName: 'Unverified Stakeholder',
          category: 'GENERAL',
          email: 'unverified@example.com',
          dataProvenance: DataProvenance.PRODUCTION
        },
        {
          referenceNumber: `SH-METRICS-TEST-UNKNOWN-${Date.now()}`,
          fullName: 'Unknown Stakeholder',
          category: 'GENERAL',
          email: 'unknown@example.com',
          dataProvenance: DataProvenance.UNKNOWN
        },
        {
          referenceNumber: `SH-METRICS-TEST-TEST-${Date.now()}`,
          fullName: 'Test Stakeholder',
          category: 'GENERAL',
          email: 'test@example.com',
          dataProvenance: DataProvenance.TEST
        }
      ]
    });

    // 3. Insert SkcInstitutionRegistration
    await prisma.skcInstitutionRegistration.createMany({
      data: [
        {
          referenceNumber: `INST-METRICS-TEST-PROD-VERIFIED-${Date.now()}`,
          institutionName: 'Verified Inst',
          participationScope: 'SKC',
          category: 'NGO',
          country: 'India',
          representativeName: 'Head',
          designation: 'Director',
          email: 'inst-ver@example.com',
          phone: '1234567890',
          dataProvenance: DataProvenance.PRODUCTION,
          verifiedAt: new Date()
        },
        {
          referenceNumber: `INST-METRICS-TEST-UNKNOWN-${Date.now()}`,
          institutionName: 'Unknown Inst',
          participationScope: 'SKC',
          category: 'GOVERNMENT',
          country: 'India',
          representativeName: 'Head',
          designation: 'Director',
          email: 'inst-unk@example.com',
          phone: '1234567890',
          dataProvenance: DataProvenance.UNKNOWN
        }
      ]
    });

    // 4. Insert SkcHearing
    const hearingPub = await prisma.skcHearing.create({
      data: {
        title: 'Completed Public Hearing',
        slug: `hearing-pub-${Date.now()}`,
        shortSummary: 'Summary',
        status: 'COMPLETED',
        isPublic: true,
        dataProvenance: DataProvenance.PRODUCTION
      }
    });
    testHearingId = hearingPub.id;

    await prisma.skcHearing.create({
      data: {
        title: 'Draft Hearing',
        slug: `hearing-draft-${Date.now()}`,
        shortSummary: 'Summary',
        status: 'DRAFT',
        isPublic: false,
        dataProvenance: DataProvenance.PRODUCTION
      }
    });

    // 5. Insert HearingRegistration
    await prisma.hearingRegistration.create({
      data: {
        referenceNumber: `HR-TEST-${Date.now()}`,
        hearingId: testHearingId,
        fullName: 'Attending Stakeholder',
        email: 'attending@example.com',
        attendanceType: 'IN_PERSON'
      }
    });

    // 6. Insert SkcEvidence
    await prisma.skcEvidence.createMany({
      data: [
        {
          referenceNumber: `EV-PROD-${Date.now()}`,
          title: 'Evidence Prod',
          slug: `ev-prod-${Date.now()}`,
          evidenceType: 'Document',
          dataProvenance: DataProvenance.PRODUCTION,
          status: 'VERIFIED'
        },
        {
          referenceNumber: `EV-UNK-${Date.now()}`,
          title: 'Evidence Unk',
          slug: `ev-unk-${Date.now()}`,
          evidenceType: 'Document',
          dataProvenance: DataProvenance.UNKNOWN,
          status: 'SUBMITTED'
        }
      ]
    });

  });

  afterAll(async () => {
    // Cleanup records using test-specific keys to avoid destructive global deletes
    await prisma.skcEvidence.deleteMany({ where: { slug: { startsWith: 'ev-' } } });
    await prisma.hearingRegistration.deleteMany({ where: { referenceNumber: { startsWith: 'HR-TEST-' } } });
    await prisma.skcHearing.deleteMany({ where: { slug: { startsWith: 'hearing-' } } });
    await prisma.skcInstitutionRegistration.deleteMany({ where: { referenceNumber: { startsWith: 'INST-METRICS-TEST-' } } });
    await prisma.skcStakeholderRegistration.deleteMany({ where: { referenceNumber: { startsWith: 'SH-METRICS-TEST-' } } });
    await prisma.skcLifecycleStage.deleteMany({ where: { key: { startsWith: 'STAGE_TEST_' } } });
    await prisma.skcAssessmentCycle.deleteMany({ where: { cycle_label: 'Metrics Consistency Test Cycle' } });
    await prisma.$disconnect();
  });

  describe('Aggregate Summaries Consistency', () => {
    it('should map aggregate summary fields identically to their canonical domain metrics', async () => {
      // 1. Fetch domain metrics directly
      const stakeholderMetrics = await repository.getStakeholderMetrics();
      const institutionMetrics = await repository.getInstitutionMetrics();
      const hearingMetrics = await repository.getHearingMetrics();
      const evidenceMetrics = await repository.getEvidenceMetrics();

      // 2. Fetch aggregate summaries
      const publicSummary = await repository.getPublicSummary();
      const dashboardSummary = await repository.getDashboardSummary();
      const executiveSummary = await repository.getExecutiveSummary();

      // The critical anti-drift mappings mapping exactly one canonical field
      const metricMappings = [
        // Public Summary mappings
        { aggregate: publicSummary.verifiedStakeholders, domain: stakeholderMetrics.verified },
        { aggregate: publicSummary.completedHearings, domain: hearingMetrics.completed },
        { aggregate: publicSummary.verifiedEvidence, domain: evidenceMetrics.evidenceVerified },
        { aggregate: publicSummary.findingsEstablished, domain: evidenceMetrics.findingsEstablished },

        // Dashboard Summary mappings
        { aggregate: dashboardSummary.pendingReviews, domain: stakeholderMetrics.pending },
        { aggregate: dashboardSummary.totalInputVolume, domain: evidenceMetrics.totalSubmissions },
        
        // Executive Summary mappings (should compose correctly)
        { aggregate: executiveSummary.verifiedStakeholders, domain: stakeholderMetrics.verified },
        { aggregate: executiveSummary.verifiedInstitutions, domain: institutionMetrics.verified },
        { aggregate: executiveSummary.totalInputVolume, domain: evidenceMetrics.totalSubmissions }
      ];

      // Assert each explicit mapping
      for (const mapping of metricMappings) {
        expect(mapping.aggregate).toEqual(mapping.domain);
      }
    });

    it('should calculate individual domains correctly based on fixture definitions', async () => {
      const stakeholderMetrics = await repository.getStakeholderMetrics();
      const institutionMetrics = await repository.getInstitutionMetrics();
      const hearingMetrics = await repository.getHearingMetrics();
      const evidenceMetrics = await repository.getEvidenceMetrics();

      // Only 1 PRODUCTION + verified stakeholder exists
      expect(stakeholderMetrics.verified).toBe(1);
      
      // 3 stakeholders in (PRODUCTION, UNKNOWN) exist
      expect(stakeholderMetrics.registered).toBe(3);

      // Only 1 UNKNOWN stakeholder exists
      expect(stakeholderMetrics.pending).toBe(1);

      // 1 PRODUCTION + verified institution exists
      expect(institutionMetrics.verified).toBe(1);

      // 1 COMPLETED + Public hearing exists
      expect(hearingMetrics.completed).toBe(1);

      // 1 VERIFIED evidence exists
      expect(evidenceMetrics.evidenceVerified).toBe(1);
    });

    it('should correctly exclude UNKNOWN, TEST, DEMO, and unverified records from public metrics', async () => {
      const publicSummary = await repository.getPublicSummary();
      const stakeholders = await repository.getStakeholderMetrics();

      // UNKNOWN public count = 0
      // TEST public count = 0
      // DEMO public count = 0
      // SEED public count = 0
      // Draft private hearing count = 0
      
      expect(publicSummary.verifiedStakeholders).toBe(1); // the 3 others are excluded
      expect(publicSummary.completedHearings).toBe(1); // draft private is excluded
      expect(publicSummary.verifiedEvidence).toBe(1); // UNKNOWN submitted is excluded
      
      // registered excludes TEST, DEMO, SEED, but includes UNKNOWN
      expect(stakeholders.registered).toBe(3);
    });
  });
});
