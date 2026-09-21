import request from 'supertest';
import express from 'express';
import { prisma } from '../config/db';
import knowledgeRoutes from '../routes/knowledgeRoutes';

const app = express();
app.use(express.json());
app.use('/api/knowledge', knowledgeRoutes);

// Mock the prisma client methods used by the controller
jest.mock('../config/db', () => ({
  prisma: {
    canonicalEntity: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
    }
  }
}));

describe('Knowledge API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/knowledge', () => {
    it('should return a list of knowledge domains with pagination', async () => {
      const mockData = [
        { id: '1', slug: 'test-1', title: 'Test 1' },
      ];
      
      (prisma.canonicalEntity.findMany as jest.Mock).mockResolvedValue(mockData);
      (prisma.canonicalEntity.count as jest.Mock).mockResolvedValue(1);

      const res = await request(app).get('/api/knowledge?page=1&limit=10');
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toEqual(mockData);
      expect(res.body.pagination.total).toBe(1);
    });

    it('should validate query parameters using Zod', async () => {
      const res = await request(app).get('/api/knowledge?page=invalid');
      
      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('Validation failed');
    });
  });

  describe('GET /api/knowledge/:slug', () => {
    it('should return a single knowledge domain by slug', async () => {
      const mockEntity = { id: '1', slug: 'test-1', title: 'Test 1' };
      (prisma.canonicalEntity.findUnique as jest.Mock).mockResolvedValue(mockEntity);

      const res = await request(app).get('/api/knowledge/test-1');
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toEqual(mockEntity);
    });

    it('should return 404 if knowledge domain is not found', async () => {
      (prisma.canonicalEntity.findUnique as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get('/api/knowledge/non-existent');
      
      expect(res.status).toBe(404);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('Entity not found');
    });
  });
});
