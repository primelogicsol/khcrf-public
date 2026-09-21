import { PrismaPublicationRepository } from './repositories/PrismaPublicationRepository';
import { DefaultCanonicalFieldResolver } from './services/DefaultCanonicalFieldResolver';
import { DefaultEditionResolver } from './services/DefaultEditionResolver';
import { DefaultPublicationVisibilityPolicy } from './services/DefaultPublicationVisibilityPolicy';
import { PublicationProjectionService } from './services/PublicationProjectionService';
import { PublicationMapper } from './mappers/PublicationMapper';
import { NoOpTelemetrySink } from './telemetry/TelemetrySink';
import { DefaultFeatureFlagService } from './telemetry/FeatureFlags';

// Simple DI container / module for the publication bounded context
export class PublicationModule {
  private static instance: PublicationModule;
  
  public repository: PrismaPublicationRepository;
  public projectionService: PublicationProjectionService;
  public featureFlags: DefaultFeatureFlagService;

  private constructor() {
    const telemetry = new NoOpTelemetrySink();
    const fieldResolver = new DefaultCanonicalFieldResolver(telemetry);
    const visibilityPolicy = new DefaultPublicationVisibilityPolicy();
    const editionResolver = new DefaultEditionResolver();
    const mapper = new PublicationMapper(fieldResolver);
    
    this.repository = new PrismaPublicationRepository();
    this.projectionService = new PublicationProjectionService(visibilityPolicy, editionResolver, mapper);
    this.featureFlags = new DefaultFeatureFlagService();
  }

  public static getInstance(): PublicationModule {
    if (!PublicationModule.instance) {
      PublicationModule.instance = new PublicationModule();
    }
    return PublicationModule.instance;
  }
}
