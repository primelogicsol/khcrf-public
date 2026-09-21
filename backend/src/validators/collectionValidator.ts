import { z } from 'zod';
export const createCollectionSchema = z.object({ canonicalEntityId: z.string().uuid() });
export const updateCollectionSchema = createCollectionSchema.partial();