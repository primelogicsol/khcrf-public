const fs = require('fs');
const path = require('path');

const entities = [
  { name: 'Taxonomy', model: 'taxonomyCategory' },
  { name: 'Relationship', model: 'entityRelationship' },
  { name: 'SourceReference', model: 'sourceReference' },
  { name: 'Verification', model: 'verificationRecord' },
  { name: 'Workflow', model: 'workflowRecord' },
  { name: 'MediaAsset', model: 'mediaAsset' }
];

const basePath = path.join(__dirname, '..', 'backend', 'src');

entities.forEach(entity => {
  // Service
  const servicePath = path.join(basePath, 'services', `${entity.name.toLowerCase()}Service.ts`);
  const serviceContent = `import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class ${entity.name}Service {
  static async create(data: any, userId: string) {
    return prisma.${entity.model}.create({
      data: {
        ...data,
        ${entity.name !== 'Taxonomy' ? 'createdById: userId,' : ''}
      }
    });
  }

  static async getAll(skip: number = 0, take: number = 20) {
    const [total, data] = await prisma.$transaction([
      prisma.${entity.model}.count({ where: { deletedAt: null } }),
      prisma.${entity.model}.findMany({
        where: { deletedAt: null },
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      })
    ]);
    return { total, skip, take, data };
  }

  static async getById(id: string) {
    return prisma.${entity.model}.findFirst({
      where: { id, deletedAt: null }
    });
  }

  static async update(id: string, data: any, userId: string) {
    return prisma.${entity.model}.update({
      where: { id },
      data
    });
  }

  static async softDelete(id: string, userId: string) {
    return prisma.${entity.model}.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}
`;
  if (!fs.existsSync(servicePath)) fs.writeFileSync(servicePath, serviceContent);

  // Controller
  const controllerPath = path.join(basePath, 'controllers', `${entity.name.toLowerCase()}Controller.ts`);
  const controllerContent = `import { Request, Response } from 'express';
import { ${entity.name}Service } from '../services/${entity.name.toLowerCase()}Service';

export class ${entity.name}Controller {
  static async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId && '${entity.name}' !== 'Taxonomy') return res.status(401).json({ error: 'Unauthorized' });
      const record = await ${entity.name}Service.create(req.body, userId || 'system');
      return res.status(201).json(record);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const skip = req.query.skip ? parseInt(String(req.query.skip), 10) : 0;
      const take = req.query.take ? parseInt(String(req.query.take), 10) : 20;
      const results = await ${entity.name}Service.getAll(skip, take);
      return res.json(results);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const record = await ${entity.name}Service.getById(req.params.id);
      if (!record) return res.status(404).json({ error: 'Not found' });
      return res.json(record);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const record = await ${entity.name}Service.update(req.params.id, req.body, userId || 'system');
      return res.json(record);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      await ${entity.name}Service.softDelete(req.params.id, userId || 'system');
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
`;
  if (!fs.existsSync(controllerPath)) fs.writeFileSync(controllerPath, controllerContent);

  // Router
  const routerPath = path.join(basePath, 'routes', `${entity.name.toLowerCase()}Routes.ts`);
  const routerContent = `import { Router } from 'express';
import { ${entity.name}Controller } from '../controllers/${entity.name.toLowerCase()}Controller';
import { authenticate, authorizeRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/', ${entity.name}Controller.getAll);
router.get('/:id', ${entity.name}Controller.getById);

router.post('/', authenticate, authorizeRole(['ADMIN', 'SUPER_ADMIN', 'EDITOR', 'ARCHIVIST']), ${entity.name}Controller.create);
router.patch('/:id', authenticate, authorizeRole(['ADMIN', 'SUPER_ADMIN', 'EDITOR', 'ARCHIVIST']), ${entity.name}Controller.update);
router.delete('/:id', authenticate, authorizeRole(['ADMIN', 'SUPER_ADMIN']), ${entity.name}Controller.delete);

export default router;
`;
  if (!fs.existsSync(routerPath)) fs.writeFileSync(routerPath, routerContent);
});

console.log('Successfully scaffolded Sprint 1A backend layers.');
