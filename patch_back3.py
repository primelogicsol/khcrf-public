import re

with open('backend/src/controllers/masterArtisanController.ts', 'r', encoding='utf-8') as f:
    content = f.read()

new_get_all = """  static async getAll(req: Request, res: Response) {
    try {
      const { craftId, search, district, period, recognition, verification, status, reconciliationStatus, evidenceGrade, documentation, view } = req.query;
      
      const where: any = {};

      if (view && view !== 'ALL') {
        if (view === 'LIVING_MASTER') {
          where.status = 'Living';
        } else if (view === 'HISTORICAL_MASTER') {
          where.status = { in: ['Deceased', 'Historical', 'Unknown'] };
        } else if (view === 'WOMEN_ARTISAN') {
          where.gender = { in: ['Female', 'FEMALE', 'female'] };
        } else if (view === 'EMERGING_ARTISAN') {
          where.practice_status = { in: ['Emerging', 'EMERGING'] };
        } else if (view === 'APPRENTICE') {
          where.lineagesAsMember = { some: { relationship_type: { in: ['Apprentice', 'APPRENTICE'] } } };
        } else if (view === 'WORKSHOP_COMMUNITY') {
          where.lineagesAsMember = { some: { relationship_type: { in: ['Workshop Member', 'WORKSHOP_MEMBER'] } } };
        }
      }

      if (craftId && craftId !== 'ALL') {
        where.primary_craft = { gi_application_no: String(craftId) };
      }

      if (district && district !== 'ALL') {
        where.district = { equals: String(district), mode: 'insensitive' };
      }

      if (status && status !== 'ALL') {
        where.status = { equals: String(status), mode: 'insensitive' };
      }

      if (verification && verification !== 'ALL') {
        if (verification === 'GOVT_AWARD') where.awards = { some: {} };
        if (verification === 'GOVT_REG') where.identifiers = { some: {} };
        if (verification === 'PEHCHAN') where.pehchan_verified = true;
        if (verification === 'GI_AU') where.gi_verified = true;
        if (verification === 'KHCRF') where.khcrf_verified = true;
      }
      
      if (search) {
        const s = String(search);
        where.OR = [
          { artisan_name: { contains: s, mode: 'insensitive' } },
          { khcrf_master_id: { contains: s, mode: 'insensitive' } },
          { village_locality: { contains: s, mode: 'insensitive' } },
          { district: { contains: s, mode: 'insensitive' } }
        ];
      }

      const records = await prisma.masterArtisan.findMany({
        where,
        include: {
          assertions: true,
          identifiers: true,
          gi_authorizations: true,
          awards: {
            include: { normalized_craft: true }
          },
          primary_craft: true,
          lineagesAsMember: true,
          lineagesAsRelated: true,
          sources: true
        }
      });

      res.json(records);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }
"""

content = re.sub(r'static async getAll\(req: Request, res: Response\) \{.*?\}\n\s+static async getBySlug', new_get_all.strip() + '\n\n  static async getBySlug', content, flags=re.DOTALL)

with open('backend/src/controllers/masterArtisanController.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Backend Controller fully clean-patched")
