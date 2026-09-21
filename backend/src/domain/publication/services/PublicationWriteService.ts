// @ts-nocheck
import { PrismaClient } from '@prisma/client';
import { prisma } from '../../../config/db.js';
import { 
  UpdatePublicationTitleCommand, 
  UpdatePublicationTitleCommandSchema 
} from '../contracts/PublicationCommands.js';
import { 
  OptimisticLockError, 
  IdempotencyConflictError 
} from '../errors/OptimisticLockError.js';

export class PublicationWriteService {
  /**
   * Updates the publication title securely using Optimistic Concurrency Control,
   * Idempotency checking, and Audit Logging within a serialized transaction.
   */
  public async updateTitle(command: UpdatePublicationTitleCommand): Promise<void> {
    // 1. Validate payload boundary
    const validated = UpdatePublicationTitleCommandSchema.parse(command);

    // The transaction isolation level ensures safety, but we want the DB uniqueness constraint
    // to be the absolute authority for idempotency, avoiding read-modify-write race conditions.
    try {
      await prisma.$transaction(async (tx) => {
        // 2. Insert Idempotency Reservation
        // If this exact key for this user/command already exists, it will throw PrismaClientKnownRequestError (P2002)
        await tx.idempotencyRecord.create({
          data: {
            idempotencyKey: validated.idempotencyKey,
            commandType: 'UPDATE_TITLE',
            aggregateId: validated.publicationId,
            userId: validated.userId,
            resultStatus: 'STARTED'
          }
        });

        // 3. Atomically update the publication IF AND ONLY IF revision matches
        const updateResult = await tx.publication.updateMany({
          where: {
            id: validated.publicationId,
            revision: validated.expectedRevision
          },
          data: {
            title: validated.title,
            subtitle: validated.subtitle !== undefined ? validated.subtitle : undefined,
            revision: { increment: 1 }
          }
        });

        if (updateResult.count === 0) {
          // Either the publication doesn't exist, or the revision didn't match.
          throw new OptimisticLockError(validated.publicationId, validated.expectedRevision);
        }

        // 4. Record Audit Log
        await tx.publicationWorkflowHistory.create({
          data: {
            publicationId: validated.publicationId,
            expectedRevision: validated.expectedRevision,
            status: 'DRAFT', // Placeholder for actual transition logic
            changedBy: validated.userId,
          }
        });

        // 5. Store Idempotent Result
        await tx.idempotencyRecord.update({
          where: { 
            userId_commandType_idempotencyKey: {
              userId: validated.userId,
              commandType: 'UPDATE_TITLE',
              idempotencyKey: validated.idempotencyKey
            }
          },
          data: { resultStatus: 'COMPLETED' }
        });
      }, {
        isolationLevel: 'Serializable'
      });
    } catch (error: any) {
      if (error.code === 'P2002' && error.meta?.target?.includes('idempotencyKey')) {
        // Unique constraint failed on idempotency reservation!
        // We now fetch the existing record to see if it's completed or in-progress.
        const existingRecord = await prisma.idempotencyRecord.findUnique({
          where: {
            userId_commandType_idempotencyKey: {
              userId: validated.userId,
              commandType: 'UPDATE_TITLE',
              idempotencyKey: validated.idempotencyKey
            }
          }
        });

        if (existingRecord?.resultStatus === 'COMPLETED') {
          // Return previous result (idempotent success)
          return;
        }

        throw new IdempotencyConflictError(validated.idempotencyKey);
      }
      throw error;
    }
  }
}
