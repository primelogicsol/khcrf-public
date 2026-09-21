const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const updates = [
    { title: 'Youth in Crafts', tags: 'ALL_CRAFTS' },
    { title: 'Exports', tags: 'ALL_CRAFTS' },
    { title: 'Future of Pashmina', tags: 'Pashmina' },
    { title: 'Digital Commerce', tags: 'ALL_CRAFTS' },
    { title: 'Future of Carpets', tags: 'Carpet' },
    { title: 'Technology & Design', tags: 'Pashmina, Carpet, Papier-Mâché, Walnut Wood, Sozni, Kani' },
    { title: 'Artisan Livelihoods', tags: 'ALL_CRAFTS' },
    { title: 'GI & Authenticity', tags: 'Pashmina, Kani, Carpet, Papier-Mâché, Walnut Wood' },
    { title: 'Women in Crafts', tags: 'ALL_CRAFTS' },
    { title: 'Finance & Investment', tags: 'ALL_CRAFTS' },
    { title: 'Raw Material Access', tags: 'Pashmina, Carpet, Silk' },
    { title: 'Climate & Sustainability', tags: 'Pashmina, Carpet, ALL_CRAFTS' },
    { title: 'Cultural Heritage', tags: 'ALL_CRAFTS' },
    { title: 'Education & Skills', tags: 'ALL_CRAFTS' },
    { title: 'Global Markets', tags: 'ALL_CRAFTS' },
    { title: 'Policy & Governance', tags: 'ALL_CRAFTS' }
  ];

  for (const u of updates) {
    const hearings = await prisma.skcHearing.findMany({ where: { title: { contains: u.title } } });
    for (const h of hearings) {
      await prisma.skcHearing.update({
        where: { id: h.id },
        data: { craftFocus: u.tags }
      });
      console.log(`Updated ${h.title} -> ${u.tags}`);
    }
  }
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
