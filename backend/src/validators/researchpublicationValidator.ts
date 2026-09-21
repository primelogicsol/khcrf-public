import { z } from 'zod';
export const createResearchPublicationSchema = z.object({ canonicalEntityId: z.string().uuid() });
export const updateResearchPublicationSchema = createResearchPublicationSchema.partial();