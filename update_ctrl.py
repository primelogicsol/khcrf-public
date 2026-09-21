import re

with open('backend/src/controllers/masterArtisanController.ts', 'r', encoding='utf-8') as f:
    content = f.read()

start_idx = content.find('  static async getAll(req: Request, res: Response) {')
end_idx = content.find('  static async getBySlug(req: Request, res: Response) {')

get_all_logic = """  static async getAll(req: Request, res: Response) {
    try {
      const { craftId, search, district, period, recognition, verification, status, reconciliationStatus, evidenceGrade, documentation, view } = req.query;
      
      const where: any = { AND: [] };

      // Helper to add AND conditions safely
      const addCondition = (cond: any) => where.AND.push(cond);
      
      let awardsSome: any = {};
      let requireAward = false;
      let noAward = false;

      if (view && view !== 'ALL') {
        if (view === 'MASTER_ARTISAN') {
          requireAward = true;
        } else if (view === 'LIVING_MASTER') {
          addCondition({ status: 'Living' });
          requireAward = true;
        } else if (view === 'HISTORICAL_MASTER') {
          addCondition({ status: { in: ['Deceased', 'Historical', 'Unknown', 'Historical Only'] } });
          requireAward = true;
        } else if (view === 'WOMEN_ARTISAN') {
          addCondition({ gender: { in: ['Female', 'FEMALE', 'female'] } });
        } else if (view === 'EMERGING_ARTISAN') {
          addCondition({ practice_status: { in: ['Emerging', 'EMERGING'] } });
        } else if (view === 'APPRENTICE') {
          addCondition({ lineagesAsMember: { some: { relationship_type: { in: ['Apprentice', 'APPRENTICE'] } } } });
        } else if (view === 'WORKSHOP_COMMUNITY') {
          addCondition({ lineagesAsMember: { some: { relationship_type: { in: ['Workshop Member', 'WORKSHOP_MEMBER'] } } } });
        }
      }

      if (craftId && craftId !== 'ALL') {
        addCondition({ primary_craft: { gi_application_no: String(craftId) } });
      }

      if (district && district !== 'ALL') {
        addCondition({ district: { equals: String(district), mode: 'insensitive' } });
      }

      if (period && period !== 'ALL') {
        const p = String(period);
        if (p === '1965_1999') awardsSome.award_year = { gte: 1965, lte: 1999 };
        if (p === '2000_2008') awardsSome.award_year = { gte: 2000, lte: 2008 };
        if (p === '2009_2019') awardsSome.award_year = { gte: 2009, lte: 2019 };
        if (p === '2020_2026') awardsSome.award_year = { gte: 2020, lte: 2026 };
        requireAward = true;
      }

      if (recognition && recognition !== 'ALL') {
        if (recognition === 'NO_AWARD') {
          noAward = true;
        } else {
          awardsSome.award_level = { equals: String(recognition), mode: 'insensitive' };
          requireAward = true;
        }
      }

      if (noAward) {
        addCondition({ awards: { none: {} } });
      } else if (requireAward) {
        addCondition({ awards: { some: Object.keys(awardsSome).length > 0 ? awardsSome : {} } });
      }

      if (reconciliationStatus && reconciliationStatus !== 'ALL') {
        addCondition({ reconciliation_status: { equals: String(reconciliationStatus), mode: 'insensitive' } });
      }

      if (evidenceGrade && evidenceGrade !== 'ALL') {
        addCondition({ evidence_grade: { equals: String(evidenceGrade), mode: 'insensitive' } });
      }
      
      if (documentation && documentation !== 'ALL') {
        addCondition({ documentation_level: { equals: String(documentation), mode: 'insensitive' } });
      }

      if (status && status !== 'ALL') {
        const s = String(status).toUpperCase();
        if (['LIVING', 'DECEASED', 'UNKNOWN', 'HISTORICAL_ONLY'].includes(s)) {
          addCondition({ status: { equals: s === 'HISTORICAL_ONLY' ? 'Historical Only' : String(status), mode: 'insensitive' } });
        } else if (['ACTIVE', 'RETIRED'].includes(s)) {
          addCondition({ practice_status: { equals: String(status), mode: 'insensitive' } });
        }
      }

      if (verification && verification !== 'ALL') {
        if (verification === 'GOVT_AWARD' && !requireAward) {
          addCondition({ awards: { some: {} } });
        }
        if (verification === 'GOVT_REG') addCondition({ identifiers: { some: { identifier_type: 'GOVT_REG' } } });
        if (verification === 'PEHCHAN') addCondition({ pehchan_verified: true });
        if (verification === 'GI_AU') addCondition({ gi_verified: true });
        if (verification === 'KHCRF') addCondition({ khcrf_verified: true });
        if (verification === 'MULTIPLE_GOVT') {
          addCondition({ sources: { _count: { gte: 2 } } });
        }
        if (verification === 'UNVERIFIED_HISTORICAL') {
          addCondition({ government_verified: false });
          addCondition({ khcrf_verified: false });
          addCondition({ status: { in: ['Deceased', 'Historical', 'Historical Only'] } });
        }
      }
      
      if (search) {
        const s = String(search);
        addCondition({
          OR: [
            { artisan_name: { contains: s, mode: 'insensitive' } },
            { khcrf_master_id: { contains: s, mode: 'insensitive' } },
            { village_locality: { contains: s, mode: 'insensitive' } },
            { district: { contains: s, mode: 'insensitive' } },
            { father_husband_name: { contains: s, mode: 'insensitive' } },
            { identifiers: { some: { identifier_value: { contains: s, mode: 'insensitive' } } } },
            { gi_authorizations: { some: { gi_authorized_user_id: { contains: s, mode: 'insensitive' } } } },
            { awards: { some: { award_name: { contains: s, mode: 'insensitive' } } } }
          ]
        });
      }

      if (where.AND.length === 0) {
        delete where.AND;
      }

      const records = await prisma.masterArtisan.findMany({
        where,
        include: {
          assertions: { include: { source: true } },
          identifiers: { include: { source: true } },
          gi_authorizations: { include: { source: true } },
          awards: {
            include: { normalized_craft: true, source: true }
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
print("Updated controller successfully")
