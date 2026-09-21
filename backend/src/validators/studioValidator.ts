import { z } from 'zod';
export const createStudioSchema = z.object({ canonicalEntityId: z.string().uuid() });
export const updateStudioSchema = createStudioSchema.partial();