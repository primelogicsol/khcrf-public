import { PrismaClient, DataProvenance, RecordSourceSystem, SkcClassifiedEntityType } from '@prisma/client';
import { QueueQuery, HistoryQuery } from '../validators/skcClassification.validator';

// ────────────────────────────────────────────────────────────────────────────
// Shared record shape returned by both getRecordsForPreview and queue queries
// ────────────────────────────────────────────────────────────────────────────

export interface ClassifiableRecord {
  id: string;
  dataProvenance: DataProvenance;
  sourceSystem: RecordSourceSystem;
  updatedAt: Date;
}

// ────────────────────────────────────────────────────────────────────────────
// Classification Repository
// Owns all Prisma access for the classification workflow.
// No business logic — only data reads and writes.
// ────────────────────────────────────────────────────────────────────────────

export class SkcClassificationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // ──────────────────────────────────────────────────────────────
  // Queue
  // ──────────────────────────────────────────────────────────────

  async getQueue(params: QueueQuery) {
    const {
      provenance,
      entityType,
      sourceSystem,
      search,
      page,
      pageSize,
    } = params;
    const skip = (page - 1) * pageSize;
    const provenanceFilter = provenance ? { dataProvenance: provenance } : {};
    const sourceFilter = sourceSystem ? { sourceSystem } : {};

    const includeStakeholders = !entityType || entityType === SkcClassifiedEntityType.SKC_STAKEHOLDER_REGISTRATION;
    const includeInstitutions = !entityType || entityType === SkcClassifiedEntityType.SKC_INSTITUTION_REGISTRATION;

    const [stakeholders, stakeholderTotal, institutions, institutionTotal] = await Promise.all([
      includeStakeholders
        ? this.prisma.skcStakeholderRegistration.findMany({
            where: {
              ...provenanceFilter,
              ...sourceFilter,
              ...(search ? { fullName: { contains: search, mode: 'insensitive' } } : {}),
            },
            select: { id: true, fullName: true, referenceNumber: true, dataProvenance: true, sourceSystem: true, verifiedAt: true, createdAt: true, updatedAt: true },
            skip,
            take: pageSize,
          })
        : [],
      includeStakeholders
        ? this.prisma.skcStakeholderRegistration.count({ where: { ...provenanceFilter, ...sourceFilter } })
        : 0,
      includeInstitutions
        ? this.prisma.skcInstitutionRegistration.findMany({
            where: {
              ...provenanceFilter,
              ...sourceFilter,
              ...(search ? { institutionName: { contains: search, mode: 'insensitive' } } : {}),
            },
            select: { id: true, institutionName: true, referenceNumber: true, dataProvenance: true, sourceSystem: true, verifiedAt: true, createdAt: true, updatedAt: true },
            skip,
            take: pageSize,
          })
        : [],
      includeInstitutions
        ? this.prisma.skcInstitutionRegistration.count({ where: { ...provenanceFilter, ...sourceFilter } })
        : 0,
    ]);

    return {
      records: [
        ...(stakeholders as any[]).map(s => ({ ...s, name: s.fullName, entityType: SkcClassifiedEntityType.SKC_STAKEHOLDER_REGISTRATION })),
        ...(institutions as any[]).map(i => ({ ...i, name: i.institutionName, entityType: SkcClassifiedEntityType.SKC_INSTITUTION_REGISTRATION })),
      ],
      total: (stakeholderTotal as number) + (institutionTotal as number),
    };
  }

  // ──────────────────────────────────────────────────────────────
  // Records for preview/submit — returns current persisted state
  // ──────────────────────────────────────────────────────────────

  async getRecordsById(entityType: SkcClassifiedEntityType, ids: string[]): Promise<ClassifiableRecord[]> {
    if (entityType === SkcClassifiedEntityType.SKC_STAKEHOLDER_REGISTRATION) {
      return this.prisma.skcStakeholderRegistration.findMany({
        where: { id: { in: ids } },
        select: { id: true, dataProvenance: true, sourceSystem: true, updatedAt: true },
      });
    }
    if (entityType === SkcClassifiedEntityType.SKC_INSTITUTION_REGISTRATION) {
      return this.prisma.skcInstitutionRegistration.findMany({
        where: { id: { in: ids } },
        select: { id: true, dataProvenance: true, sourceSystem: true, updatedAt: true },
      });
    }
    return [];
  }

  // ──────────────────────────────────────────────────────────────
  // Idempotency lookup
  // ──────────────────────────────────────────────────────────────

  async findAuditByIdempotencyKey(idempotencyKey: string) {
    return this.prisma.skcDataClassificationAudit.findFirst({
      where: { batchId: idempotencyKey },
      select: { batchId: true, idempotencyKey: true },
    });
  }

  // ──────────────────────────────────────────────────────────────
  // Atomic transaction: update records + insert audit entries
  // ──────────────────────────────────────────────────────────────

  async classifyRecords(params: {
    entityType: SkcClassifiedEntityType;
    records: ClassifiableRecord[];
    targetProvenance: DataProvenance;
    reason: string;
    idempotencyKey: string;
    payloadFingerprint: string;
    actorId: string;
  }) {
    const { entityType, records, targetProvenance, reason, idempotencyKey, payloadFingerprint, actorId } = params;
    const ids = records.map(r => r.id);

    return this.prisma.$transaction(async (tx) => {
      // Update entity provenance
      if (entityType === SkcClassifiedEntityType.SKC_STAKEHOLDER_REGISTRATION) {
        await tx.skcStakeholderRegistration.updateMany({
          where: { id: { in: ids } },
          data: { dataProvenance: targetProvenance },
        });
      } else if (entityType === SkcClassifiedEntityType.SKC_INSTITUTION_REGISTRATION) {
        await tx.skcInstitutionRegistration.updateMany({
          where: { id: { in: ids } },
          data: { dataProvenance: targetProvenance },
        });
      }

      // Insert one audit entry per record
      const audits = await Promise.all(
        records.map(record =>
          tx.skcDataClassificationAudit.create({
            data: {
              entityType,
              recordId: record.id,
              previousProvenance: record.dataProvenance,
              newProvenance: targetProvenance,
              previousSource: record.sourceSystem,
              newSource: record.sourceSystem, // source system unchanged by classification
              reason,
              batchId: idempotencyKey,
              idempotencyKey: `${idempotencyKey}:${record.id}:fingerprint:${payloadFingerprint}`,
              classifiedById: actorId,
            },
          })
        )
      );

      return { classifiedCount: audits.length, batchId: idempotencyKey };
    });
  }

  // ──────────────────────────────────────────────────────────────
  // Audit history
  // ──────────────────────────────────────────────────────────────

  async getHistory(params: HistoryQuery) {
    const { entityType, recordId, actorId, page, pageSize } = params;
    const where = {
      ...(entityType ? { entityType } : {}),
      ...(recordId ? { recordId } : {}),
      ...(actorId ? { classifiedById: actorId } : {}),
    };

    const [records, total] = await Promise.all([
      this.prisma.skcDataClassificationAudit.findMany({
        where,
        orderBy: { classifiedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          classifiedBy: { select: { id: true, name: true, email: true } },
        },
      }),
      this.prisma.skcDataClassificationAudit.count({ where }),
    ]);

    return { records, total, page, pageSize };
  }
}
