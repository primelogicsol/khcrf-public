import re

with open('backend/src/controllers/masterArtisanController.ts', 'r', encoding='utf-8') as f:
    content = f.read()

get_stats_logic = """
  static async getStats(req: Request, res: Response) {
    try {
      const total = await prisma.masterArtisan.count();
      const recognized = await prisma.masterArtisan.count({ where: { awards: { some: {} } } });
      const living = await prisma.masterArtisan.count({ where: { status: 'Living' } });
      const historical = await prisma.masterArtisan.count({ where: { status: { in: ['Deceased', 'Historical', 'Unknown'] } } });
      const women = await prisma.masterArtisan.count({ where: { gender: { in: ['Female', 'FEMALE', 'female'] } } });
      const emerging = await prisma.masterArtisan.count({ where: { practice_status: { in: ['Emerging', 'EMERGING'] } } });
      const apprentices = await prisma.masterArtisan.count({ where: { lineagesAsMember: { some: { relationship_type: { in: ['Apprentice', 'APPRENTICE'] } } } } });
      const workshops = await prisma.masterArtisan.count({ where: { lineagesAsMember: { some: { relationship_type: { in: ['Workshop Member', 'WORKSHOP_MEMBER'] } } } } });

      res.json({
        total,
        recognized,
        living,
        historical,
        women,
        emerging,
        apprentices,
        workshops
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

  static async getAll"""

content = content.replace('  static async getAll', get_stats_logic)

with open('backend/src/controllers/masterArtisanController.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added getStats to controller")
