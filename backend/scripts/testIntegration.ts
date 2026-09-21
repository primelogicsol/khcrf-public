import { PrismaPublicationRepository } from '../src/domain/publication/repositories/PrismaPublicationRepository';
import { PublicationProjectionService } from '../src/domain/publication/services/PublicationProjectionService';
import { DefaultEditionResolver } from '../src/domain/publication/services/DefaultEditionResolver';
import { DefaultPublicationVisibilityPolicy } from '../src/domain/publication/services/DefaultPublicationVisibilityPolicy';
import { PublicationMapper } from '../src/domain/publication/mappers/PublicationMapper';
import { prisma } from '../src/config/db';

import { DefaultCanonicalFieldResolver } from '../src/domain/publication/services/DefaultCanonicalFieldResolver';
import { NoOpTelemetrySink } from '../src/domain/publication/telemetry/TelemetrySink';

async function testEndpoint() {
  const repo = new PrismaPublicationRepository();
  const visibilityPolicy = new DefaultPublicationVisibilityPolicy();
  const editionResolver = new DefaultEditionResolver();
  const fieldResolver = new DefaultCanonicalFieldResolver(new NoOpTelemetrySink());
  const mapper = new PublicationMapper(fieldResolver);
  const projectionService = new PublicationProjectionService(visibilityPolicy, editionResolver, mapper);

  try {
    const slug = 'premium-pricing-trends-in-authentic-kashmiri-luxury-crafts';
    const aggregate = await repo.findPublicPublicationBySlug(slug);

    if (!aggregate) {
      console.log(JSON.stringify({ error: "Not Found" }));
      process.exit(1);
    }

    const dto = projectionService.projectPublicDetail(aggregate, "test-req-123");
    console.log(JSON.stringify(dto, null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

testEndpoint();
