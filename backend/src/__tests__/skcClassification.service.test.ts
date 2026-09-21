import fs from 'fs';
import path from 'path';
import { describe, it, expect, jest } from '@jest/globals';
import { SkcClassificationService, ClassificationServiceError } from '../services/skcClassification.service';
import { SkcClassificationRepository } from '../repositories/skcClassification.repository';
import { DataProvenance, RecordSourceSystem, SkcClassifiedEntityType } from '@prisma/client';

// ─── Fixtures ───────────────────────────────────────────────────────────────

const ACTOR = 'user-admin-01';
const BATCH_KEY = '123e4567-e89b-12d3-a456-426614174000';

const UNKNOWN_RECORD = {
  id: 'rec-001',
  dataProvenance: DataProvenance.UNKNOWN,
  sourceSystem: RecordSourceSystem.ONLINE_PORTAL,
  updatedAt: new Date('2026-07-01T00:00:00Z'),
};

const PRODUCTION_RECORD = {
  id: 'rec-002',
  dataProvenance: DataProvenance.PRODUCTION,
  sourceSystem: RecordSourceSystem.ONLINE_PORTAL,
  updatedAt: new Date('2026-07-01T00:00:00Z'),
};

// ─── Mock repository ─────────────────────────────────────────────────────────

function makeMockRepo(overrides: Record<string, any> = {}) {
  return {
    getQueue: jest.fn<any>().mockResolvedValue({ records: [], total: 0 }),
    getRecordsById: jest.fn<any>().mockResolvedValue([UNKNOWN_RECORD]),
    findAuditByIdempotencyKey: jest.fn<any>().mockResolvedValue(null),
    classifyRecords: jest.fn<any>().mockResolvedValue({ classifiedCount: 1, batchId: BATCH_KEY }),
    getHistory: jest.fn<any>().mockResolvedValue({ records: [], total: 0, page: 1, pageSize: 50 }),
    ...overrides,
  } as unknown as SkcClassificationRepository;
}

// ─── Helper: generate a valid preview token ───────────────────────────────────

async function getValidPreviewToken(
  service: SkcClassificationService,
  repo: ReturnType<typeof makeMockRepo>,
  records: typeof UNKNOWN_RECORD[] = [UNKNOWN_RECORD]
): Promise<string> {
  (repo.getRecordsById as jest.Mock<any>).mockResolvedValueOnce(records);
  const preview = await service.preview({
    actorId: ACTOR,
    entityType: SkcClassifiedEntityType.SKC_STAKEHOLDER_REGISTRATION,
    recordIds: records.map(r => r.id),
    targetProvenance: DataProvenance.PRODUCTION,
  });
  return preview.previewToken;
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('SkcClassificationService', () => {

  describe('preview', () => {
    it('returns affected, blocked, and missing counts correctly', async () => {
      const repo = makeMockRepo({
        getRecordsById: jest.fn<any>().mockResolvedValue([UNKNOWN_RECORD]),
      });
      const service = new SkcClassificationService(repo);

      const result = await service.preview({
        actorId: ACTOR,
        entityType: SkcClassifiedEntityType.SKC_STAKEHOLDER_REGISTRATION,
        recordIds: [UNKNOWN_RECORD.id, 'does-not-exist'],
        targetProvenance: DataProvenance.PRODUCTION,
      });

      expect(result.affectedCount).toBe(1);
      expect(result.blockedCount).toBe(0);
      expect(result.missingCount).toBe(1);
      expect(typeof result.previewToken).toBe('string');
      expect(result.previewToken.length).toBeGreaterThan(32);
    });

    it('marks PRODUCTION→PRODUCTION as blocked', async () => {
      const repo = makeMockRepo({
        getRecordsById: jest.fn<any>().mockResolvedValue([PRODUCTION_RECORD]),
      });
      const service = new SkcClassificationService(repo);

      const result = await service.preview({
        actorId: ACTOR,
        entityType: SkcClassifiedEntityType.SKC_STAKEHOLDER_REGISTRATION,
        recordIds: [PRODUCTION_RECORD.id],
        targetProvenance: DataProvenance.PRODUCTION,
      });

      expect(result.blockedCount).toBe(1);
      expect(result.affectedCount).toBe(0);
    });
  });

  describe('submit — stale preview detection', () => {
    it('rejects STALE_PREVIEW when a record updatedAt changes between preview and confirm', async () => {
      const repo = makeMockRepo();
      const service = new SkcClassificationService(repo);

      const previewToken = await getValidPreviewToken(service, repo);

      const updatedRecord = { ...UNKNOWN_RECORD, updatedAt: new Date('2026-07-02T00:00:00Z') };
      (repo.getRecordsById as jest.Mock<any>).mockResolvedValueOnce([updatedRecord]);

      let caughtError: any;
      try {
        await service.submit({
          actorId: ACTOR,
          entityType: SkcClassifiedEntityType.SKC_STAKEHOLDER_REGISTRATION,
          recordIds: [UNKNOWN_RECORD.id],
          targetProvenance: DataProvenance.PRODUCTION,
          reason: 'Verified against 2026 registry',
          idempotencyKey: BATCH_KEY,
          previewToken,
        });
      } catch (err) {
        caughtError = err;
      }

      expect(caughtError).toBeInstanceOf(ClassificationServiceError);
      expect(caughtError.code).toBe('STALE_PREVIEW');
      expect(caughtError.statusCode).toBe(409);
    });

    it('rejects STALE_PREVIEW when provenance changes between preview and confirm', async () => {
      const repo = makeMockRepo();
      const service = new SkcClassificationService(repo);

      const previewToken = await getValidPreviewToken(service, repo);

      const nowProduction = { ...UNKNOWN_RECORD, dataProvenance: DataProvenance.PRODUCTION };
      (repo.getRecordsById as jest.Mock<any>).mockResolvedValueOnce([nowProduction]);

      let caughtError: any;
      try {
        await service.submit({
          actorId: ACTOR,
          entityType: SkcClassifiedEntityType.SKC_STAKEHOLDER_REGISTRATION,
          recordIds: [UNKNOWN_RECORD.id],
          targetProvenance: DataProvenance.PRODUCTION,
          reason: 'Verified against 2026 registry',
          idempotencyKey: BATCH_KEY,
          previewToken,
        });
      } catch (err) {
        caughtError = err;
      }

      expect(caughtError).toBeInstanceOf(ClassificationServiceError);
      expect(caughtError.code).toBe('STALE_PREVIEW');
    });

    it('rejects STALE_PREVIEW when only updatedAt changes (provenance unchanged)', async () => {
      const repo = makeMockRepo();
      const service = new SkcClassificationService(repo);

      const previewToken = await getValidPreviewToken(service, repo, [UNKNOWN_RECORD]);

      const onlyTimestampChanged = {
        ...UNKNOWN_RECORD,
        dataProvenance: DataProvenance.UNKNOWN,
        updatedAt: new Date('2026-07-01T12:00:00Z'),
      };
      (repo.getRecordsById as jest.Mock<any>).mockResolvedValueOnce([onlyTimestampChanged]);

      let caughtError: any;
      try {
        await service.submit({
          actorId: ACTOR,
          entityType: SkcClassifiedEntityType.SKC_STAKEHOLDER_REGISTRATION,
          recordIds: [UNKNOWN_RECORD.id],
          targetProvenance: DataProvenance.PRODUCTION,
          reason: 'Verified against 2026 registry',
          idempotencyKey: `${BATCH_KEY}-ts`,
          previewToken,
        });
      } catch (err) {
        caughtError = err;
      }

      expect(caughtError).toBeInstanceOf(ClassificationServiceError);
      expect(caughtError.code).toBe('STALE_PREVIEW');
    });
  });

  describe('submit — idempotency', () => {
    it('returns idempotent result when same key is submitted again', async () => {
      const repo = makeMockRepo({
        findAuditByIdempotencyKey: jest.fn<any>().mockResolvedValue({
          batchId: BATCH_KEY,
          idempotencyKey: `${BATCH_KEY}:${UNKNOWN_RECORD.id}`,
        }),
      });
      const service = new SkcClassificationService(repo);

      const result = await service.submit({
        actorId: ACTOR,
        entityType: SkcClassifiedEntityType.SKC_STAKEHOLDER_REGISTRATION,
        recordIds: [UNKNOWN_RECORD.id],
        targetProvenance: DataProvenance.PRODUCTION,
        reason: 'Verified against 2026 registry',
        idempotencyKey: BATCH_KEY,
        previewToken: 'any-token',
      });

      expect((result as any).idempotent).toBe(true);
      expect((result as any).classifiedCount).toBe(0);
      expect(repo.classifyRecords).not.toHaveBeenCalled();
    });

    it('throws IDEMPOTENCY_KEY_REUSED when same key used with different payload', async () => {
      const repo = makeMockRepo({
        findAuditByIdempotencyKey: jest.fn<any>().mockResolvedValue({
          batchId: BATCH_KEY,
          idempotencyKey: `${BATCH_KEY}:rec-001:fingerprint:some-other-fingerprint`,
        }),
      });
      const service = new SkcClassificationService(repo);

      let caughtError: any;
      try {
        await service.submit({
          actorId: ACTOR,
          entityType: SkcClassifiedEntityType.SKC_STAKEHOLDER_REGISTRATION,
          recordIds: [UNKNOWN_RECORD.id],
          targetProvenance: DataProvenance.PRODUCTION,
          reason: 'A completely different reason that was not in the original batch',
          idempotencyKey: BATCH_KEY,
          previewToken: 'any-token',
        });
      } catch (err) {
        caughtError = err;
      }

      expect(caughtError).toBeInstanceOf(ClassificationServiceError);
      expect(caughtError.code).toBe('IDEMPOTENCY_KEY_REUSED');
      expect(caughtError.statusCode).toBe(409);
    });
  });

  describe('architectural — controller has no direct Prisma access', () => {
    it('controller module source does not import PrismaClient or call prisma directly', () => {
      const controllerPath = path.resolve(process.cwd(), 'src/controllers/skcClassification.controller.ts');
      const source = fs.readFileSync(controllerPath, 'utf-8') as string;

      expect(source).not.toContain("from '@prisma/client'");
      expect(source).not.toMatch(/prisma\.\w+\.\w+\(/);
    });
  });
});
