const fs = require('fs');
const path = require('path');

const entities = [
  { name: 'Craft', model: 'craft' },
  { name: 'Material', model: 'material' },
  { name: 'Tool', model: 'tool' },
  { name: 'Technique', model: 'technique' },
  { name: 'Motif', model: 'motif' },
  { name: 'Product', model: 'product' },
  { name: 'GlossaryTerm', model: 'glossaryTerm' }
];

const basePath = path.join(__dirname, '..', 'backend', 'src');

entities.forEach(entity => {
  // Service
  const servicePath = path.join(basePath, 'services', `${entity.name.toLowerCase()}Service.ts`);
  const serviceContent = `import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ${entity.name}Service {
  static async create(data: any, userId: string) {
    // In reality, this would also create the CanonicalEntity hub object.
    return prisma.${entity.model}.create({
      data: {
        ...data,
      }
    });
  }

  static async getAll(skip: number = 0, take: number = 20) {
    const [total, data] = await prisma.$transaction([
      prisma.${entity.model}.count(),
      prisma.${entity.model}.findMany({
        skip,
        take,
        include: { canonicalEntity: true }
      })
    ]);
    return { total, skip, take, data };
  }

  static async getById(id: string) {
    return prisma.${entity.model}.findUnique({
      where: { id },
      include: { canonicalEntity: true }
    });
  }

  static async update(id: string, data: any, userId: string) {
    return prisma.${entity.model}.update({
      where: { id },
      data
    });
  }

  static async hardDelete(id: string, userId: string) {
    return prisma.${entity.model}.delete({
      where: { id }
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
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      const record = await ${entity.name}Service.create(req.body, userId);
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
      await ${entity.name}Service.hardDelete(req.params.id, userId || 'system');
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
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/', ${entity.name}Controller.getAll);
router.get('/:id', ${entity.name}Controller.getById);

router.post('/', authenticateToken, authorizeRole(['ADMIN', 'SUPER_ADMIN', 'EDITOR', 'ARCHIVIST']), ${entity.name}Controller.create);
router.patch('/:id', authenticateToken, authorizeRole(['ADMIN', 'SUPER_ADMIN', 'EDITOR', 'ARCHIVIST']), ${entity.name}Controller.update);
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN', 'SUPER_ADMIN']), ${entity.name}Controller.delete);

export default router;
`;
  if (!fs.existsSync(routerPath)) fs.writeFileSync(routerPath, routerContent);
});

// Update index.ts to mount the new routes
const indexPath = path.join(basePath, 'index.ts');
let indexContent = fs.readFileSync(indexPath, 'utf8');

const importsToAdd = `
// --- Sprint 1B: Domain Entities Routes ---
import craftRoutes from './routes/craftRoutes';
import materialRoutes from './routes/materialRoutes';
import toolRoutes from './routes/toolRoutes';
import techniqueRoutes from './routes/techniqueRoutes';
import motifRoutes from './routes/motifRoutes';
import productRoutes from './routes/productRoutes';
import glossarytermRoutes from './routes/glossarytermRoutes';
`;

const routesToAdd = `
// --- Sprint 1B: Domain Entities Mounts ---
app.use('/api/craft', craftRoutes);
app.use('/api/material', materialRoutes);
app.use('/api/tool', toolRoutes);
app.use('/api/technique', techniqueRoutes);
app.use('/api/motif', motifRoutes);
app.use('/api/product', productRoutes);
app.use('/api/glossary-term', glossarytermRoutes);
`;

if (!indexContent.includes('import craftRoutes')) {
  const importMatch = indexContent.lastIndexOf('import ');
  if (importMatch !== -1) {
    const endOfLine = indexContent.indexOf('\n', importMatch);
    indexContent = indexContent.slice(0, endOfLine + 1) + importsToAdd + indexContent.slice(endOfLine + 1);
  }
}

if (!indexContent.includes('/api/craft')) {
  const useMatch = indexContent.lastIndexOf("app.use('/api");
  if (useMatch !== -1) {
    const endOfLine = indexContent.indexOf('\n', useMatch);
    indexContent = indexContent.slice(0, endOfLine + 1) + routesToAdd + indexContent.slice(endOfLine + 1);
  }
}

fs.writeFileSync(indexPath, indexContent);
console.log('Successfully scaffolded Sprint 1B backend layers.');
