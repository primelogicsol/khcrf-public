import { z } from 'zod';
export const createArtisanSchema = z.object({ canonicalEntityId: z.string().uuid() });
export const updateArtisanSchema = createArtisanSchema.partial();