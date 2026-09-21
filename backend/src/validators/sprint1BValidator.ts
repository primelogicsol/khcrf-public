import { z } from 'zod';

export const craftSchema = z.object({
  canonicalEntityId: z.string().uuid(),
  historicalOrigin: z.string().optional(),
  culturalSignificance: z.string().optional(),
  endangermentStatus: z.enum(['THRIVING', 'STABLE', 'VULNERABLE', 'ENDANGERED', 'EXTINCT']).optional(),
});
export const updateCraftSchema = craftSchema.partial();

export const materialSchema = z.object({
  canonicalEntityId: z.string().uuid(),
  sourcingRegion: z.string().min(1, 'Sourcing region is required'),
  sustainabilityStatus: z.enum(['SUSTAINABLE', 'CONCERN', 'DEPLETED']).optional(),
  processingMethod: z.string().optional(),
});
export const updateMaterialSchema = materialSchema.partial();

export const toolSchema = z.object({
  canonicalEntityId: z.string().uuid(),
  primaryMaterial: z.string().min(1, 'Primary material is required'),
  maintenanceRequirements: z.string().optional(),
});
export const updateToolSchema = toolSchema.partial();

export const techniqueSchema = z.object({
  canonicalEntityId: z.string().uuid(),
  complexityLevel: z.enum(['BASIC', 'INTERMEDIATE', 'MASTER']).optional(),
  learningDurationMonths: z.number().int().min(0).optional(),
});
export const updateTechniqueSchema = techniqueSchema.partial();

export const motifSchema = z.object({
  canonicalEntityId: z.string().uuid(),
  symbolicMeaning: z.string().optional(),
  geometricProperties: z.any().optional(),
});
export const updateMotifSchema = motifSchema.partial();

export const productSchema = z.object({
  canonicalEntityId: z.string().uuid(),
  typicalUse: z.string().optional(),
  averageCreationTimeDays: z.number().int().min(0).optional(),
});
export const updateProductSchema = productSchema.partial();

export const glossaryTermSchema = z.object({
  canonicalEntityId: z.string().uuid(),
  termContext: z.enum(['WORKSHOP', 'TRADE', 'GENERAL']).optional(),
  regionalDialect: z.string().optional(),
});
export const updateGlossaryTermSchema = glossaryTermSchema.partial();
