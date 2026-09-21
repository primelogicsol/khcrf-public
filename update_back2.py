import re

with open('backend/src/controllers/masterArtisanController.ts', 'r', encoding='utf-8') as f:
    content = f.read()

start_idx = content.find('  static async getAll(req: Request, res: Response) {')
end_idx = content.find('  static async getBySlug(req: Request, res: Response) {')

if start_idx != -1 and end_idx != -1:
    old_get_all = content[start_idx:end_idx]
    
    get_all_logic = """  static async getAll(req: Request, res: Response) {
    try {
      const { craftId, search, district, period, recognition, verification, status, reconciliationStatus, evidenceGrade, documentation, view } = req.query;
      
      const where: any = {};

      if (view && view !== 'ALL') {
        if (view === 'MASTER_ARTISAN') {
          where.awards = { some: {} };
        } else if (view === 'LIVING_MASTER') {
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

      if (period && period !== 'ALL') {
        const p = String(period);
        if (p === '1965_1999') where.awards = { some: { award_year: { gte: 1965, lte: 1999 } } };
        if (p === '2000_2008') where.awards = { some: { award_year: { gte: 2000, lte: 2008 } } };
        if (p === '2009_2019') where.awards = { some: { award_year: { gte: 2009, lte: 2019 } } };
        if (p === '2020_2026') where.awards = { some: { award_year: { gte: 2020, lte: 2026 } } };
      }

      if (recognition && recognition !== 'ALL') {
        if (recognition === 'NO_AWARD') {
          where.awards = { none: {} };
        } else {
          where.awards = { some: { award_level: { equals: String(recognition), mode: 'insensitive' } } };
        }
      }

      if (reconciliationStatus && reconciliationStatus !== 'ALL') {
        where.reconciliation_status = { equals: String(reconciliationStatus), mode: 'insensitive' };
      }

      if (evidenceGrade && evidenceGrade !== 'ALL') {
        where.evidence_grade = { equals: String(evidenceGrade), mode: 'insensitive' };
      }
      
      if (documentation && documentation !== 'ALL') {
        where.documentation_level = { equals: String(documentation), mode: 'insensitive' };
      }

      if (status && status !== 'ALL') {
        const s = String(status).toUpperCase();
        if (['LIVING', 'DECEASED', 'UNKNOWN', 'HISTORICAL_ONLY'].includes(s)) {
          where.status = { equals: s === 'HISTORICAL_ONLY' ? 'Historical Only' : String(status), mode: 'insensitive' };
        } else if (['ACTIVE', 'RETIRED'].includes(s)) {
          where.practice_status = { equals: String(status), mode: 'insensitive' };
        }
      }

      if (verification && verification !== 'ALL') {
        if (verification === 'GOVT_AWARD') where.awards = { some: {} };
        if (verification === 'GOVT_REG') where.identifiers = { some: { identifier_type: 'GOVT_REG' } };
        if (verification === 'PEHCHAN') where.pehchan_verified = true;
        if (verification === 'GI_AU') where.gi_verified = true;
        if (verification === 'KHCRF') where.khcrf_verified = true;
        if (verification === 'MULTIPLE_GOVT') where.sources = { some: {} }; 
        if (verification === 'UNVERIFIED_HISTORICAL') {
          where.government_verified = false;
          where.khcrf_verified = false;
          where.status = { in: ['Deceased', 'Historical', 'Historical Only'] };
        }
      }
      
      if (search) {
        const s = String(search);
        where.OR = [
          { artisan_name: { contains: s, mode: 'insensitive' } },
          { khcrf_master_id: { contains: s, mode: 'insensitive' } },
          { village_locality: { contains: s, mode: 'insensitive' } },
          { district: { contains: s, mode: 'insensitive' } },
          { father_husband_name: { contains: s, mode: 'insensitive' } },
          { identifiers: { some: { identifier_value: { contains: s, mode: 'insensitive' } } } },
          { awards: { some: { award_name: { contains: s, mode: 'insensitive' } } } }
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
    
    content = content[:start_idx] + get_all_logic + content[end_idx:]
    with open('backend/src/controllers/masterArtisanController.ts', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Backend Controller updated properly using substring replacement!")
else:
    print("Could not find start or end index.")
