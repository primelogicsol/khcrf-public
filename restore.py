import re

with open('backend/src/controllers/masterArtisanController.ts', 'r', encoding='utf-8') as f:
    content = f.read()

get_by_slug = """
  static async getBySlug(req: Request, res: Response) {
    try {
      const record = await prisma.canonicalEntity.findUnique({
        where: { slug: req.params.slug },
        include: { artisan: true }
      });
      if (!record || record.entityType !== CanonicalEntityType.HUMAN_OBJECT) {
        return res.status(404).json({ error: 'Artisan not found' });
      }

      const metadata = record.metadata as any || {};
      const mappedRecord = {
        slug: record.slug,
        name: record.title,
        craft: metadata.craft || '',
        loc: metadata.loc || record.artisan?.activeRegion || '',
        award: metadata.award || '',
        img: metadata.img || '/assets/images/placeholder.jpg',
        stage: metadata.stage || '',
        desc: metadata.desc || '',
        years: metadata.years || 0,
        sig: metadata.sig || '',
        bio: record.summary || record.artisan?.biography || '',
        isDemo: record.isDemo,
        isFeatured: record.isFeatured
      };

      res.json(mappedRecord);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

"""

if 'static async getBySlug' not in content:
    content = content.replace('static async getIssues(req: Request, res: Response) {', get_by_slug + '  static async getIssues(req: Request, res: Response) {')
    with open('backend/src/controllers/masterArtisanController.ts', 'w', encoding='utf-8') as f:
        f.write(content)
    print("getBySlug restored")
else:
    print("getBySlug already present")

