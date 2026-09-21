import { IIIFService } from '../src/services/iiifService';
import { prisma } from '../src/config/db';

jest.mock('../src/config/db', () => ({
  prisma: {
    mediaAsset: {
      findUnique: jest.fn(),
    },
  },
}));

describe('IIIFService', () => {
  const mockAsset: any = {
    id: 'asset-123',
    altText: 'Antique Copper Bowl',
    caption: '19th century copper work from Srinagar',
    filePath: '/assets/images/copper_bowl.jpg',
    publicUrl: '/assets/images/copper_bowl.jpg',
    width: 2000,
    height: 1500,
    mediaType: 'IMAGE',
    fileType: 'image/jpeg',
    author: 'Unknown Artisan',
    entities: [
      { slug: 'copper-craft-srinagar' }
    ]
  };

  it('should generate a valid IIIF Manifest 3.0 structure', async () => {
    (prisma.mediaAsset.findUnique as jest.Mock).mockResolvedValue(mockAsset);
    const manifest = await IIIFService.generateManifest('asset-123', 'http://localhost:8000');

    expect(manifest['@context']).toBe('http://iiif.io/api/presentation/3/context.json');
    expect(manifest.id).toContain('/api/iiif/asset-123/manifest.json');
    expect(manifest.type).toBe('Manifest');
    expect(manifest.label.en[0]).toBe('Antique Copper Bowl');
    
    // Check items/canvases
    expect(manifest.items.length).toBe(1);
    const canvas = manifest.items[0];
    expect(canvas.type).toBe('Canvas');
    expect(canvas.width).toBe(1500);
    expect(canvas.height).toBe(2000);

    // Check images
    const image = canvas.items[0].items[0].body;
    expect(image.type).toBe('Image');
    expect(image.format).toBe('image/jpeg');
    expect(image.id).toContain('/assets/images/copper_bowl.jpg');
  });
});
