const fs = require('fs');
const path = require('path');

const models = [
  { name: 'Artisan', slug: 'artisan', plural: 'artisans' },
  { name: 'Studio', slug: 'studio', plural: 'studios' },
  { name: 'Collection', slug: 'collection', plural: 'collections' },
  { name: 'ResearchPublication', slug: 'research-publication', plural: 'research-publications' }
];

const backendSrc = path.join(__dirname, '..', 'backend', 'src');
const frontendSrc = path.join(__dirname, '..', 'frontend', 'src');

models.forEach(model => {
  const lowerName = model.name.toLowerCase();
  
  // 1. Validator
  const validatorCode = `import { z } from 'zod';\nexport const create${model.name}Schema = z.object({ canonicalEntityId: z.string().uuid() });\nexport const update${model.name}Schema = create${model.name}Schema.partial();`;
  fs.writeFileSync(path.join(backendSrc, 'validators', `${lowerName}Validator.ts`), validatorCode);

  // 2. Service
  const serviceCode = `
import { prisma } from '../config/db';

export class ${model.name}Service {
  static async getAll(skip = 0, take = 20) {
    return prisma.${lowerName}.findMany({ skip, take, include: { canonicalEntity: true } });
  }
  static async getById(id: string) {
    return prisma.${lowerName}.findUnique({ where: { id }, include: { canonicalEntity: true } });
  }
  static async create(data: any) {
    return prisma.${lowerName}.create({ data });
  }
  static async update(id: string, data: any) {
    return prisma.${lowerName}.update({ where: { id }, data });
  }
  static async remove(id: string) {
    return prisma.${lowerName}.delete({ where: { id } });
  }
}
`;
  fs.writeFileSync(path.join(backendSrc, 'services', `${lowerName}Service.ts`), serviceCode.trim());

  // 3. Controller
  const controllerCode = `
import { Request, Response } from 'express';
import { ${model.name}Service } from '../services/${lowerName}Service';
import { create${model.name}Schema, update${model.name}Schema } from '../validators/${lowerName}Validator';

export class ${model.name}Controller {
  static async getAll(req: Request, res: Response) {
    try {
      const skip = req.query.skip ? parseInt(req.query.skip as string, 10) : 0;
      const take = req.query.take ? parseInt(req.query.take as string, 10) : 20;
      const records = await ${model.name}Service.getAll(skip, take);
      res.json(records);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  }

  static async getById(req: Request, res: Response) {
    try {
      const record = await ${model.name}Service.getById(req.params.id);
      if (!record) return res.status(404).json({ error: 'Not Found' });
      res.json(record);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  }

  static async create(req: Request, res: Response) {
    try {
      const parsed = create${model.name}Schema.parse(req.body);
      const record = await ${model.name}Service.create(parsed);
      res.status(201).json(record);
    } catch (e: any) { res.status(400).json({ error: e.message || 'Validation Error' }); }
  }

  static async update(req: Request, res: Response) {
    try {
      const parsed = update${model.name}Schema.parse(req.body);
      const record = await ${model.name}Service.update(req.params.id, parsed);
      res.json(record);
    } catch (e: any) { res.status(400).json({ error: e.message || 'Validation Error' }); }
  }

  static async remove(req: Request, res: Response) {
    try {
      await ${model.name}Service.remove(req.params.id);
      res.status(204).send();
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  }
}
`;
  fs.writeFileSync(path.join(backendSrc, 'controllers', `${lowerName}Controller.ts`), controllerCode.trim());

  // 4. Routes
  const routesCode = `
import { Router } from 'express';
import { ${model.name}Controller } from '../controllers/${lowerName}Controller';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/', ${model.name}Controller.getAll);
router.get('/:id', ${model.name}Controller.getById);
router.post('/', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), ${model.name}Controller.create);
router.patch('/:id', authenticateToken, authorizeRole(['ADMIN', 'EDITOR']), ${model.name}Controller.update);
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN']), ${model.name}Controller.remove);

export default router;
`;
  fs.writeFileSync(path.join(backendSrc, 'routes', `${lowerName}Routes.ts`), routesCode.trim());

  // 5. Frontend Dashboard Page
  const dashboardDir = path.join(frontendSrc, 'app', 'dashboard', model.slug);
  fs.mkdirSync(dashboardDir, { recursive: true });
  
  const pageCode = `
"use client";
import React from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ${model.name}Dashboard() {
  const { data, error, isLoading } = useSWR('/api/${model.slug}', fetcher);

  if (isLoading) return <div className="p-8">Loading ${model.name}s...</div>;
  if (error) return <div className="p-8 text-red-500">Failed to load data.</div>;

  return (
    <div className="p-8 w-full">
      <h1 className="text-2xl font-bold mb-6">${model.name} Management</h1>
      <div className="bg-white rounded shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50 text-sm text-gray-600">
              <th className="p-4">ID</th>
              <th className="p-4">Canonical Title</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item: any) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-xs font-mono">{item.id.slice(0,8)}...</td>
                <td className="p-4">{item.canonicalEntity?.title || 'Unknown'}</td>
                <td className="p-4">
                  <button className="text-blue-500 hover:underline mr-4">Edit</button>
                </td>
              </tr>
            ))}
            {(!data || data.length === 0) && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-400">No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(dashboardDir, 'page.tsx'), pageCode.trim());
});

console.log('Successfully scaffolded Sprints 4-7 APIs and UI components.');
