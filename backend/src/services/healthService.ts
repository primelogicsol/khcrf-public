import { prisma } from '../config/db';

export class HealthService {
  static async getKnowledgeHealth() {
    const allEntities = await prisma.canonicalEntity.findMany({
      where: { deletedAt: null },
      include: {
        sourceRefs: { select: { id: true } },
        sourceRelations: { select: { id: true } },
        targetRelations: { select: { id: true } },
        mediaAssets: { select: { id: true } }
      }
    });

    const totalEntities = allEntities.length;
    if (totalEntities === 0) {
      return { totalEntities: 0, metrics: null, records: [] };
    }

    let verifiedCount = 0;
    let missingSources = 0;
    let missingMedia = 0;
    let missingRelationships = 0;
    let missingSummaries = 0;
    let missingTranslations = 0;

    const scoredEntities = allEntities.map(entity => {
      let score = 0;
      let maxScore = 100;
      
      // 1. Metadata Completeness (20 points)
      let metadataScore = 0;
      if (entity.title) metadataScore += 5;
      if (entity.slug) metadataScore += 5;
      if (entity.summary) {
        metadataScore += 5;
      } else {
        missingSummaries++;
      }
      if (entity.metadata && Object.keys(entity.metadata).length > 0) metadataScore += 5;
      score += metadataScore;

      // 2. Provenance Completeness (15 points)
      let provenanceScore = 0;
      if (entity.sourceRefs.length > 0) {
        provenanceScore = 15;
      } else {
        missingSources++;
      }
      score += provenanceScore;

      // 3. Relationship Completeness (15 points)
      let relationScore = 0;
      if (entity.sourceRelations.length > 0 || entity.targetRelations.length > 0) {
        relationScore = 15;
      } else {
        missingRelationships++;
      }
      score += relationScore;

      // 4. Media Completeness (15 points)
      let mediaScore = 0;
      if (entity.mediaAssets.length > 0) {
        mediaScore = 15;
      } else {
        missingMedia++;
      }
      score += mediaScore;

      // 5. SEO Completeness (10 points)
      let seoScore = 0;
      if (entity.seoMetadata && Object.keys(entity.seoMetadata).length > 0) seoScore = 10;
      score += seoScore;

      // 6. Translation/Transliteration Completeness (10 points)
      let transScore = 0;
      const hasAliases = entity.aliases && Array.isArray(entity.aliases) && entity.aliases.length > 0;
      const hasTrans = entity.transliterations && Object.keys(entity.transliterations).length > 0;
      if (hasAliases || hasTrans) {
        transScore = 10;
      } else {
        missingTranslations++;
      }
      score += transScore;

      // 7. Verification Status (10 points)
      let verificationScore = 0;
      if (entity.verificationStatus === 'VERIFIED') {
        verificationScore = 10;
        verifiedCount++;
      } else if (entity.verificationStatus === 'PARTIALLY_VERIFIED') {
        verificationScore = 5;
      }
      score += verificationScore;

      // 8. Workflow Readiness (5 points)
      let workflowScore = 0;
      if (entity.lifecycle === 'PUBLISHED') workflowScore += 2.5;
      if (entity.visibility === 'PUBLIC') workflowScore += 2.5;
      score += workflowScore;

      return {
        id: entity.id,
        title: entity.title,
        entityType: entity.entityType,
        verificationStatus: entity.verificationStatus,
        lifecycle: entity.lifecycle,
        healthScore: score,
        breakdown: {
          metadata: metadataScore,
          provenance: provenanceScore,
          relationships: relationScore,
          media: mediaScore,
          seo: seoScore,
          translations: transScore,
          verification: verificationScore,
          workflow: workflowScore
        }
      };
    });

    scoredEntities.sort((a, b) => b.healthScore - a.healthScore);
    
    const topHealthyRecords = scoredEntities.slice(0, 10);
    const lowHealthRecords = [...scoredEntities].sort((a, b) => a.healthScore - b.healthScore).slice(0, 10);
    const entitiesNeedingReview = scoredEntities.filter(e => e.healthScore < 50 || e.verificationStatus === 'UNVERIFIED' || e.verificationStatus === 'DISPUTED').slice(0, 50);

    return {
      metrics: {
        totalEntities,
        verifiedPercentage: Math.round((verifiedCount / totalEntities) * 100),
        missingSources,
        missingMedia,
        missingRelationships,
        missingSummaries,
        missingTranslations,
        averageHealthScore: Math.round(scoredEntities.reduce((acc, curr) => acc + curr.healthScore, 0) / totalEntities)
      },
      records: {
        topHealthyRecords,
        lowHealthRecords,
        entitiesNeedingReview
      }
    };
  }
}
