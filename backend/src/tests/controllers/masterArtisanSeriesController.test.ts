import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';

jest.mock('../../../src/middleware/authMiddleware', () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    if (req.headers.authorization === 'Bearer admin') {
      req.user = { role: 'ADMIN' };
      return next();
    }
    return res.status(401).json({ error: 'Unauthenticated' });
  },
  authorizeAdmin: (req: any, res: any, next: any) => {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  },
  authorizeRole: () => (req: any, res: any, next: any) => next()
}));

const mockPrisma = {
  masterArtisanSeries: {
    findMany: jest.fn<any>(),
    findFirst: jest.fn<any>(),
    findUnique: jest.fn<any>(),
    create: jest.fn<any>(),
    updateMany: jest.fn<any>(),
    update: jest.fn<any>(),
    count: jest.fn<any>(),
  },
  masterArtisanSeriesStory: {
    findFirst: jest.fn<any>(),
    findUnique: jest.fn<any>(),
    create: jest.fn<any>(),
    delete: jest.fn<any>(),
    count: jest.fn<any>(),
    aggregate: jest.fn<any>(),
    update: jest.fn<any>(),
  },
  $transaction: jest.fn<any>(async (arg: any) => {
    if (Array.isArray(arg)) {
      return Promise.all(arg);
    }
    if (typeof arg === 'function') {
      return arg(mockPrisma as any);
    }
    return arg;
  })
};

jest.mock('../../../src/config/db', () => ({ prisma: mockPrisma }));
jest.mock('../../../src/config/db.js', () => ({ prisma: mockPrisma }));

import masterArtisanRoutes from '../../../src/routes/masterArtisanRoutes';

const app = express();
app.use(express.json());
app.use('/api', masterArtisanRoutes);

describe('MasterArtisanSeriesController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Create series', async () => {
    mockPrisma.masterArtisanSeries.create.mockResolvedValue({ id: 'series1' });
    const payload = {
      title: 'Valid Series',
      slug: 'valid-series',
      description: 'Desc'
    };
    const res = await request(app)
      .post('/api/admin/editorial-series')
      .set('Authorization', 'Bearer admin')
      .send(payload);
    expect(res.status).toBe(201);
  });

  it('Update with current version', async () => {
    mockPrisma.masterArtisanSeries.updateMany.mockResolvedValue({ count: 1 });
    const payload = { title: 'Updated Series', version: 1 };
    const res = await request(app)
      .patch('/api/admin/editorial-series/series1')
      .set('Authorization', 'Bearer admin')
      .send(payload);
    expect(res.status).toBe(200);
  });

  it('Reject stale version', async () => {
    mockPrisma.masterArtisanSeries.updateMany.mockResolvedValue({ count: 0 });
    const payload = { title: 'Updated Series', version: 1 };
    const res = await request(app)
      .patch('/api/admin/editorial-series/series1')
      .set('Authorization', 'Bearer admin')
      .send(payload);
    expect(res.status).toBe(409);
  });

  it('Add installment', async () => {
    mockPrisma.masterArtisanSeriesStory.findUnique.mockResolvedValue(null);
    mockPrisma.masterArtisanSeriesStory.aggregate.mockResolvedValue({ _max: { position: 0 } });
    mockPrisma.masterArtisanSeriesStory.create.mockResolvedValue({ id: 'inst1' });
    const res = await request(app)
      .post('/api/admin/editorial-series/series1/stories')
      .set('Authorization', 'Bearer admin')
      .send({ storyId: 'clj67r81m000008ld8q4q2b2b' });
    expect(res.status).toBe(201);
  });

  it('Reject duplicate installment', async () => {
    mockPrisma.masterArtisanSeriesStory.findUnique.mockResolvedValue({ id: 'inst1' });
    const res = await request(app)
      .post('/api/admin/editorial-series/series1/stories')
      .set('Authorization', 'Bearer admin')
      .send({ storyId: 'clj67r81m000008ld8q4q2b2b' });
    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/already/i);
  });

  it('Remove installment', async () => {
    mockPrisma.masterArtisanSeriesStory.delete.mockResolvedValue({ id: 'inst1' });
    const res = await request(app)
      .delete('/api/admin/editorial-series/series1/stories/s1')
      .set('Authorization', 'Bearer admin');
    expect(res.status).toBe(204);
  });

  it('Persist reordered installments', async () => {
    mockPrisma.masterArtisanSeriesStory.update.mockResolvedValue({ id: 's' });
    const res = await request(app)
      .patch('/api/admin/editorial-series/series1/stories/reorder')
      .set('Authorization', 'Bearer admin')
      .send({ order: ['clj67r81m000008ld8q4q2b2c', 'clj67r81m000008ld8q4q2b2b'] });
    expect(res.status).toBe(200);
    expect(mockPrisma.masterArtisanSeriesStory.update).toHaveBeenCalledTimes(2);
  });

  it('Archive series', async () => {
    mockPrisma.masterArtisanSeries.update.mockResolvedValue({ id: 'series1' });
    const res = await request(app)
      .post('/api/admin/editorial-series/series1/archive')
      .set('Authorization', 'Bearer admin');
    expect(res.status).toBe(200);
  });

  it('Exclude archived series publicly', async () => {
    mockPrisma.masterArtisanSeries.findMany.mockResolvedValue([]);
    await request(app).get('/api/editorial-series');
    expect(mockPrisma.masterArtisanSeries.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          archivedAt: null
        })
      })
    );
  });
});
