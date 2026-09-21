import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';

jest.mock('../../../src/middleware/authMiddleware', () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    if (req.headers.authorization === 'Bearer admin') {
      req.user = { role: 'ADMIN' };
      return next();
    }
    if (req.headers.authorization === 'Bearer user') {
      req.user = { role: 'USER' };
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
  masterArtisanStory: {
    findMany: jest.fn<any>(),
    findFirst: jest.fn<any>(),
    findUnique: jest.fn<any>(),
    create: jest.fn<any>(),
    updateMany: jest.fn<any>(),
    update: jest.fn<any>(),
    count: jest.fn<any>(),
  }
};

jest.mock('../../../src/config/db', () => ({ prisma: mockPrisma }));
jest.mock('../../../src/config/db.js', () => ({ prisma: mockPrisma }));

import masterArtisanRoutes from '../../../src/routes/masterArtisanRoutes';

const app = express();
app.use(express.json());
app.use('/api', masterArtisanRoutes);

describe('MasterArtisanStoryController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Unauthenticated request returns 401', async () => {
    const res = await request(app).post('/api/admin/stories').send({});
    expect(res.status).toBe(401);
  });
  
  it('Non-admin request returns 403', async () => {
    const res = await request(app)
      .post('/api/admin/stories')
      .set('Authorization', 'Bearer user')
      .send({});
    expect(res.status).toBe(403);
  });

  it('Create valid story', async () => {
    mockPrisma.masterArtisanStory.create.mockResolvedValue({ id: 'clj67r81m000008ld8q4q2b2b' });
    const payload = {
      title: 'Valid Story',
      slug: 'valid-story',
      storyType: 'Historical',
      primaryCraft: 'Wood Carving',
      excerpt: 'Excerpt',
      artisanId: '00000000-0000-0000-0000-000000000001',
      authorId: '00000000-0000-0000-0000-000000000002',
      publishedAt: new Date().toISOString()
    };
    const res = await request(app)
      .post('/api/admin/stories')
      .set('Authorization', 'Bearer admin')
      .send(payload);
    expect(res.status).toBe(201);
    expect(mockPrisma.masterArtisanStory.create).toHaveBeenCalled();
  });

  it('Reject invalid payload', async () => {
    const res = await request(app)
      .post('/api/admin/stories')
      .set('Authorization', 'Bearer admin')
      .send({ title: '' }); // missing required fields
    console.log('RESPONSE BODY:', res.body); expect(res.status).toBe(400);
  });

  it('Admin list', async () => {
    mockPrisma.masterArtisanStory.findMany.mockResolvedValue([{ id: 'clj67r81m000008ld8q4q2b2b' }]);
    mockPrisma.masterArtisanStory.count.mockResolvedValue(1);
    const res = await request(app)
      .get('/api/admin/stories')
      .set('Authorization', 'Bearer admin');
    console.log('RESPONSE BODY:', res.body); expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
  });

  it('Admin detail', async () => {
    mockPrisma.masterArtisanStory.findUnique.mockResolvedValue({ id: 'clj67r81m000008ld8q4q2b2b' });
    const res = await request(app)
      .get('/api/admin/stories/s1')
      .set('Authorization', 'Bearer admin');
    console.log('RESPONSE BODY:', res.body); expect(res.status).toBe(200);
  });

  it('Atomic update succeeds with current version', async () => {
    mockPrisma.masterArtisanStory.updateMany.mockResolvedValue({ count: 1 });
    mockPrisma.masterArtisanStory.findUnique.mockResolvedValue({ id: 'clj67r81m000008ld8q4q2b2b', version: 2 });
    const payload = {
      title: 'Valid Story Updated',
      version: 1
    };
    const res = await request(app)
      .patch('/api/admin/stories/s1')
      .set('Authorization', 'Bearer admin')
      .send(payload);
    console.log('RESPONSE BODY:', res.body); expect(res.status).toBe(200);
  });

  it('Atomic update rejects stale version', async () => {
    mockPrisma.masterArtisanStory.updateMany.mockResolvedValue({ count: 0 }); // 0 means stale
    const payload = {
      title: 'Valid Story Updated',
      version: 1
    };
    const res = await request(app)
      .patch('/api/admin/stories/s1')
      .set('Authorization', 'Bearer admin')
      .send(payload);
    expect(res.status).toBe(409);
  });

  it('Archive succeeds', async () => {
    mockPrisma.masterArtisanStory.update.mockResolvedValue({ id: 'clj67r81m000008ld8q4q2b2b' });
    const res = await request(app)
      .post('/api/admin/stories/s1/archive')
      .set('Authorization', 'Bearer admin');
    console.log('RESPONSE BODY:', res.body); expect(res.status).toBe(200);
  });

  it('Draft excluded publicly & Archived excluded publicly', async () => {
    mockPrisma.masterArtisanStory.findMany.mockResolvedValue([]);
    await request(app).get('/api/editorial-stories');
    expect(mockPrisma.masterArtisanStory.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          publicationStatus: 'PUBLISHED',
          archivedAt: null
        })
      })
    );
  });

  describe('Regression coverage', () => {
    it('Empty public query succeeds', async () => {
      mockPrisma.masterArtisanStory.findMany.mockResolvedValue([]);
      const res = await request(app).get('/api/editorial-stories');
      console.log('RESPONSE BODY:', res.body); expect(res.status).toBe(200);
    });
    it('Invalid pagination returns 400', async () => {
      const res = await request(app).get('/api/editorial-stories?skip=abc');
      console.log('RESPONSE BODY:', res.body); expect(res.status).toBe(400);
    });
    it('P2034 returns 409', async () => {
      mockPrisma.masterArtisanStory.create.mockRejectedValue({ code: 'P2034' });
      const res = await request(app).post('/api/admin/stories').set('Authorization', 'Bearer admin').send({ title: 'T', slug: 's', storyType: 'S', primaryCraft: 'P' });
      expect(res.status).toBe(409);
    });
    it('Schedule overlap returns 409', async () => {
      mockPrisma.masterArtisanStory.create.mockRejectedValue(new Error('Schedule overlap'));
      const res = await request(app).post('/api/admin/stories').set('Authorization', 'Bearer admin').send({ title: 'T', slug: 's', storyType: 'S', primaryCraft: 'P' });
      expect(res.status).toBe(409);
    });
    it('Stale version returns 409', async () => {
      mockPrisma.masterArtisanStory.updateMany.mockResolvedValue({ count: 0 });
      const res = await request(app).patch('/api/admin/stories/1').set('Authorization', 'Bearer admin').send({ version: 1 });
      expect(res.status).toBe(409);
    });
    it('Ordinary Zod validation returns 400', async () => {
      const res = await request(app).post('/api/admin/stories').set('Authorization', 'Bearer admin').send({});
      console.log('RESPONSE BODY:', res.body); expect(res.status).toBe(400);
    });
    it('Unexpected TypeError returns 500', async () => {
      mockPrisma.masterArtisanStory.create.mockRejectedValue(new TypeError('Some internal error'));
      const res = await request(app).post('/api/admin/stories').set('Authorization', 'Bearer admin').send({ title: 'T', slug: 's', storyType: 'S', primaryCraft: 'P' });
      expect(res.status).toBe(500);
    });
  });
});
