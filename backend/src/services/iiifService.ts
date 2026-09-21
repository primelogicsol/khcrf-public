import { prisma } from '../config/db';

export class IIIFService {
  /**
   * Generates a IIIF Presentation API 3.0 Manifest for a Media Asset.
   * This aligns KHCRF with museum standard interoperability (CIDOC/IIIF).
   */
  static async generateManifest(mediaAssetId: string, baseUrl: string) {
    const asset = await prisma.mediaAsset.findUnique({
      where: { id: mediaAssetId },
      include: { entities: true }
    });

    if (!asset) {
      throw new Error('MediaAsset not found');
    }

    // Ensure we only generate manifests for Images
    if (asset.mediaType !== 'IMAGE') {
      throw new Error('IIIF manifests are currently only supported for IMAGE types.');
    }

    const manifestUrl = `${baseUrl}/api/iiif/${asset.id}/manifest.json`;
    const canvasUrl = `${baseUrl}/api/iiif/${asset.id}/canvas/1`;
    const imageUrl = asset.publicUrl; // In a true IIIF Server, this would point to a Cantaloupe/Loris server endpoint.

    const mainEntity = asset.entities && asset.entities.length > 0 ? asset.entities[0] : null;

    const manifest = {
      "@context": "http://iiif.io/api/presentation/3/context.json",
      "id": manifestUrl,
      "type": "Manifest",
      "label": {
        "en": [asset.altText || (mainEntity ? mainEntity.title : 'KHCRF Artifact')]
      },
      "metadata": [
        {
          "label": { "en": ["Repository"] },
          "value": { "en": ["Heritage Craft & Research Foundation"] }
        },
        {
          "label": { "en": ["Entity Type"] },
          "value": { "en": [mainEntity ? mainEntity.entityType : 'Unknown'] }
        }
      ],
      "items": [
        {
          "id": canvasUrl,
          "type": "Canvas",
          "label": { "en": ["Image 1"] },
          "height": 2000, // Hardcoded for abstraction
          "width": 1500,
          "items": [
            {
              "id": `${canvasUrl}/annotation-page`,
              "type": "AnnotationPage",
              "items": [
                {
                  "id": `${canvasUrl}/annotation`,
                  "type": "Annotation",
                  "motivation": "painting",
                  "body": {
                    "id": imageUrl,
                    "type": "Image",
                    "format": "image/jpeg"
                  },
                  "target": canvasUrl
                }
              ]
            }
          ]
        }
      ]
    };

    return manifest;
  }
}
