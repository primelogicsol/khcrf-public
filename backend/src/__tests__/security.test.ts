import request from 'supertest';
import app from '../index'; // Adjust path if necessary based on your server setup

describe('Security and Authorization Tests', () => {

  describe('Advisory Council Admin Routes', () => {
    it('should return 401 when unauthenticated on GET /api/advisors', async () => {
      const res = await request(app).get('/api/advisors');
      expect(res.status).toBe(401);
    });

    it('should return 401 when unauthenticated on PATCH /api/advisors/:id/status', async () => {
      const res = await request(app).patch('/api/advisors/123/status');
      expect(res.status).toBe(401);
    });
  });

  describe('Consultation Admin Routes', () => {
    it('should return 401 when unauthenticated on GET /api/consultations', async () => {
      const res = await request(app).get('/api/consultations');
      expect(res.status).toBe(401);
    });

    it('should return 401 when unauthenticated on GET /api/consultations/:id', async () => {
      const res = await request(app).get('/api/consultations/123');
      expect(res.status).toBe(401);
    });
  });

  describe('SKC Official Messages Admin Routes', () => {
    it('should return 401 when unauthenticated on GET /api/skc/admin/messages', async () => {
      const res = await request(app).get('/api/skc/admin/messages');
      expect(res.status).toBe(401);
    });

    it('should return 401 when unauthenticated on POST /api/skc/admin/categories', async () => {
      const res = await request(app).post('/api/skc/admin/categories').send({});
      expect(res.status).toBe(401);
    });
  });

  describe('Public Endpoints (Safe Data Only)', () => {
    it('should succeed but filter sensitive fields on GET /api/skc/public/messages', async () => {
      const res = await request(app).get('/api/skc/public/messages');
      expect(res.status).toBe(200);
      if (res.body.data && res.body.data.length > 0) {
        expect(res.body.data[0]).not.toHaveProperty('email');
        expect(res.body.data[0]).not.toHaveProperty('internalNotes');
      }
    });
  });

});
