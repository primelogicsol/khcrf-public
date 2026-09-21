import { PublicationWriteService } from './PublicationWriteService.js';
import { prisma } from '../../../config/db.js';
import { OptimisticLockError, IdempotencyConflictError } from '../errors/OptimisticLockError.js';

// We skip this from automated test suites for now as it requires a DB connection,
// but it serves as the test contract for Phase 4.1D.
describe('PublicationWriteService', () => {
  let service: PublicationWriteService;

  beforeAll(() => {
    service = new PublicationWriteService();
  });

  it('should successfully update title and increment revision', async () => {
    const pubId = 'test-pub-1';
    
    // Setup test publication
    await prisma.publication.upsert({
      where: { id: pubId },
      update: { title: 'Old', slug: 'test-pub-1', author: 'Test', published: '2026', category: 'Test', price: 0, pages: 10, description: '', imagePath: '', revision: 1 },
      create: { id: pubId, title: 'Old', slug: 'test-pub-1', author: 'Test', published: '2026', category: 'Test', price: 0, pages: 10, description: '', imagePath: '', revision: 1 }
    });

    await service.updateTitle({
      publicationId: pubId,
      expectedRevision: 1,
      userId: 'user-1',
      idempotencyKey: 'idem-1',
      title: 'New Title'
    });

    const updated = await prisma.publication.findUnique({ where: { id: pubId } });
    expect(updated?.title).toBe('New Title');
    expect(updated?.revision).toBe(2);
  });

  it('should reject concurrent update (mid-air collision) with OptimisticLockError', async () => {
    const pubId = 'test-pub-2';
    
    await prisma.publication.upsert({
      where: { id: pubId },
      update: { title: 'Old', slug: 'test-pub-2', author: 'Test', published: '2026', category: 'Test', price: 0, pages: 10, description: '', imagePath: '', revision: 5 },
      create: { id: pubId, title: 'Old', slug: 'test-pub-2', author: 'Test', published: '2026', category: 'Test', price: 0, pages: 10, description: '', imagePath: '', revision: 5 }
    });

    // We pass expectedRevision = 4, but actual is 5.
    await expect(service.updateTitle({
      publicationId: pubId,
      expectedRevision: 4,
      userId: 'user-1',
      idempotencyKey: 'idem-2',
      title: 'Stale Update'
    })).rejects.toThrow(OptimisticLockError);

    // Ensure it was not updated
    const updated = await prisma.publication.findUnique({ where: { id: pubId } });
    expect(updated?.title).toBe('Old');
    expect(updated?.revision).toBe(5);
  });

  it('should be idempotent (same command twice does not increment twice)', async () => {
    const pubId = 'test-pub-3';
    
    await prisma.publication.upsert({
      where: { id: pubId },
      update: { title: 'Old', slug: 'test-pub-3', author: 'Test', published: '2026', category: 'Test', price: 0, pages: 10, description: '', imagePath: '', revision: 1 },
      create: { id: pubId, title: 'Old', slug: 'test-pub-3', author: 'Test', published: '2026', category: 'Test', price: 0, pages: 10, description: '', imagePath: '', revision: 1 }
    });

    // First call
    await service.updateTitle({
      publicationId: pubId,
      expectedRevision: 1,
      userId: 'user-1',
      idempotencyKey: 'idem-3',
      title: 'Idempotent Update'
    });

    // Second call with same idempotency key - should succeed but do nothing
    await service.updateTitle({
      publicationId: pubId,
      expectedRevision: 1, // Notice we send 1 again, even though it's 2 now.
      userId: 'user-1',
      idempotencyKey: 'idem-3',
      title: 'Idempotent Update'
    });

    const updated = await prisma.publication.findUnique({ where: { id: pubId } });
    expect(updated?.title).toBe('Idempotent Update');
    expect(updated?.revision).toBe(2); // Only incremented once
  });
});
