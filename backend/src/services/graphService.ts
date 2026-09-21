import { prisma } from '../config/db';
export class GraphService {
  /**
   * Fetches the local knowledge graph (Nodes & Edges) around a central CanonicalEntity.
   * @param centerEntityId UUID of the central entity.
   * @param depth How many hops out to fetch.
   */
  static async getEgoGraph(centerEntityId: string, depth: number = 1) {
    const nodesMap = new Map();
    const edgesList: any[] = [];
    const visitedEdges = new Set();
    const queue = [{ id: centerEntityId, currentDepth: 0 }];

    // Fetch the root node first
    const rootEntity = await prisma.canonicalEntity.findUnique({
      where: { id: centerEntityId },
      include: {
        craft: true,
        material: true,
        tool: true,
        technique: true,
        motif: true,
        product: true,
        glossaryTerm: true,
      }
    });

    if (!rootEntity) {
      throw new Error("Central entity not found");
    }

    nodesMap.set(rootEntity.id, {
      id: rootEntity.id,
      label: rootEntity.title,
      type: rootEntity.entityType,
      data: rootEntity,
    });

    while (queue.length > 0) {
      const { id, currentDepth } = queue.shift()!;

      if (currentDepth >= depth) continue;

      // Find all relationships where this entity is either source or target
      const relationships = await prisma.entityRelationship.findMany({
        where: {
          OR: [
            { sourceEntityId: id },
            { targetEntityId: id }
          ]
        },
        include: {
          sourceEntity: true,
          targetEntity: true
        }
      });

      for (const rel of relationships) {
        if (!visitedEdges.has(rel.id)) {
          visitedEdges.add(rel.id);
          edgesList.push({
            id: rel.id,
            source: rel.sourceEntityId,
            target: rel.targetEntityId,
            label: rel.relationshipType,
            data: rel,
          });

          // Add neighbor nodes if not present
          if (!nodesMap.has(rel.sourceEntityId)) {
            nodesMap.set(rel.sourceEntityId, {
              id: rel.sourceEntity.id,
              label: rel.sourceEntity.title,
              type: rel.sourceEntity.entityType,
              data: rel.sourceEntity,
            });
            queue.push({ id: rel.sourceEntityId, currentDepth: currentDepth + 1 });
          }

          if (!nodesMap.has(rel.targetEntityId)) {
            nodesMap.set(rel.targetEntityId, {
              id: rel.targetEntity.id,
              label: rel.targetEntity.title,
              type: rel.targetEntity.entityType,
              data: rel.targetEntity,
            });
            queue.push({ id: rel.targetEntityId, currentDepth: currentDepth + 1 });
          }
        }
      }
    }

    return {
      nodes: Array.from(nodesMap.values()),
      edges: edgesList
    };
  }
}
