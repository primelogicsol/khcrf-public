import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { CanonicalEntityType, VisibilityStatus, LifecycleStatus } from '@prisma/client';
import { requireString } from "../utils/routeHelpers";

export class MasterArtisanController {
  
  static async seed(req: Request, res: Response) {
    try {
      res.json({ message: 'Seed functionality moved to backend scripts (seedDemo.ts)' });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }


  static async getStats(req: Request, res: Response) {
    try {
      const publicBase = {
        AND: [
          { OR: [{ identity_status: null }, { identity_status: { not: 'ARCHIVED' } }] },
          { OR: [{ record_completeness: null }, { record_completeness: { not: 'OUT_OF_SCOPE' } }] },
          { OR: [{ reconciliation_status: null }, { reconciliation_status: { not: 'GEOGRAPHIC_SCOPE_ERROR' } }] }
        ]
      };

      const total = await prisma.masterArtisan.count({ where: publicBase });
      const recognized = await prisma.masterArtisan.count({ where: { ...publicBase, award_receipts: { some: {} } } });
      const living = await prisma.masterArtisan.count({ where: { ...publicBase, status: 'Living' } });
      const historical = await prisma.masterArtisan.count({ where: { ...publicBase, status: { in: ['Deceased', 'Historical', 'Unknown'] } } });
      const women = await prisma.masterArtisan.count({ where: { ...publicBase, gender: { in: ['Female', 'FEMALE', 'female'] } } });
      const emerging = await prisma.masterArtisan.count({ where: { ...publicBase, practice_status: { in: ['Emerging', 'EMERGING'] } } });
      const apprentices = await prisma.masterArtisan.count({ where: { ...publicBase, lineagesAsMember: { some: { relationship_type: { in: ['Apprentice', 'APPRENTICE'] } } } } });
      const workshops = await prisma.workshopCommunity.count();

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

  static async getAll(req: Request, res: Response) {
    try {
      const { craftId, search, district, period, awardType, recognition, verification, status, reconciliationStatus, evidenceGrade, documentation, view } = req.query;
      
      const activeAwardType = awardType || recognition;
      
      
      if (view === 'WORKSHOP_COMMUNITY') {
        const communities = await prisma.workshopCommunity.findMany({
          include: {
            primary_craft: true,
            workshops: true,
            organizations: true
          }
        });
        return res.json({ data: communities });
      }

      const where: any = { AND: [] };
  
  
      // Helper to add AND conditions safely
      const addCondition = (cond: any) => where.AND.push(cond);
      
      // Add base visibility rules for public views
      if (view && view !== 'ALL') {
        addCondition({ OR: [{ identity_status: null }, { identity_status: { not: 'ARCHIVED' } }] });
        addCondition({ OR: [{ record_completeness: null }, { record_completeness: { not: 'OUT_OF_SCOPE' } }] });
        addCondition({ OR: [{ reconciliation_status: null }, { reconciliation_status: { not: 'GEOGRAPHIC_SCOPE_ERROR' } }] });
      }

      // awardsSome: conditions that must ALL be true on the SAME ArtisanAward record
      const awardsSome: any = {};
      let requireAward = false;
      let noAward = false;

      if (view && view !== 'ALL') {
        if (view === 'MASTER_ARTISAN') {
          addCondition({ artisanClass: 'MASTER' });
        } else if (view === 'LIVING_MASTER') {
          addCondition({ status: 'Living' });
          requireAward = true;
        } else if (view === 'HISTORICAL_MASTER') {
          addCondition({ status: { in: ['Deceased', 'Historical', 'Unknown', 'Historical Only'] } });
          addCondition({ artisanClass: 'MASTER' });
        } else if (view === 'WOMEN_ARTISAN') {
          addCondition({ gender: { in: ['Female', 'FEMALE', 'female'] } });
        } else if (view === 'EMERGING_ARTISAN') {
          addCondition({ artisanClass: 'EMERGING' });
        } else if (view === 'APPRENTICE') {
          addCondition({ artisanClass: 'APPRENTICE' });
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

      // Period: filters award_year on the SAME award record as awardType
      if (period && period !== 'ALL') {
        const p = String(period);
        if (p === '1965_1999') awardsSome.award_year = { gte: 1965, lte: 1999 };
        if (p === '2000_2008') awardsSome.award_year = { gte: 2000, lte: 2008 };
        if (p === '2009_2019') awardsSome.award_year = { gte: 2009, lte: 2019 };
        if (p === '2020_2026') awardsSome.award_year = { gte: 2020, lte: 2026 };
        requireAward = true;
      }

      // awardType: filters award_name on the SAME award record as period
      // Option values are exact DB award_name strings — no translation needed
      if (activeAwardType && activeAwardType !== 'ALL') {
        const at = String(activeAwardType);
        if (at === 'NO_AWARD') {
          noAward = true;
        } else if (at === 'ANY_AWARD') {
          requireAward = true; // just require at least one award row, no name filter
        } else if (at === 'State Award') {
          // "State Award" and "J&K State Award" are the same family in DB
          awardsSome.award_name = { in: ['State Award', 'J&K State Award'] };
          requireAward = true;
        } else {
          // All other values are exact award_name strings from DB
          awardsSome.award_name = { equals: at, mode: 'insensitive' };
          requireAward = true;
        }
      }

      // Apply award conditions — both period + awardType on the SAME ArtisanAward record
      if (noAward) {
        addCondition({ award_receipts: { none: {} } });
      } else if (requireAward) {
        addCondition({ award_receipts: { some: Object.keys(awardsSome).length > 0 ? { award: awardsSome } : {} } });
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
          addCondition({ award_receipts: { some: {} } });
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
            { award_receipts: { some: { award: { award_name: { contains: s, mode: 'insensitive' } } } } }
          ]
        });
      }

      if (where.AND.length === 0) {
        delete where.AND;
      }

      // Default sorting: evidence_grade, then name
      let orderBy: any = [
        { evidence_grade: 'asc' },
        { artisan_name: 'asc' }
      ];

      const { sort } = req.query;
      if (sort) {
        if (sort === 'NAME_ASC') orderBy = { artisan_name: 'asc' };
        else if (sort === 'NAME_DESC') orderBy = { artisan_name: 'desc' };
        else if (sort === 'DISTRICT_ASC') orderBy = { district: 'asc' };
        else if (sort === 'CRAFT_ASC') orderBy = { primary_craft: { canonical_name: 'asc' } };
        else if (sort === 'EVIDENCE_DESC') orderBy = { evidence_grade: 'asc' }; // A+ comes before B in alphabet, so asc is actually 'better' grade first.
      }

      const records = await prisma.masterArtisan.findMany({
        where,
        orderBy,
        include: {
          assertions: { include: { source: true } },
          identifiers: { include: { source: true } },
          gi_authorizations: { include: { source: true, craft: true } },
          award_receipts: {
            include: { award: { include: { normalized_craft: true, source: true } } }
          },
          primary_craft: true,
          craft_affiliations: { include: { craft: true } },
          lineagesAsMember: true,
          lineagesAsRelated: true,
          sources: true
        }
      });

      const mappedRecords = records.map(r => ({
        ...r,
        awards: r.award_receipts.map((ar: any) => ({
          ...ar.award,
          recipient_role: ar.recipient_role
        }))
      }));

      res.json(mappedRecords);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

  static async getBySlug(req: Request, res: Response) {
    try {
      const slug = requireString(req.params.slug);
      const record = await prisma.canonicalEntity.findUnique({
        where: { slug },
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

  static async getIssues(req: Request, res: Response) {
    try {
      const where: any = {
        entityType: CanonicalEntityType.KNOWLEDGE_OBJECT,
        visibility: VisibilityStatus.PUBLIC,
        lifecycle: LifecycleStatus.PUBLISHED,
        deletedAt: null,
        slug: { startsWith: 'issue-' }
      };

      const records = await prisma.canonicalEntity.findMany({
        where,
        orderBy: { title: 'asc' }
      });

      const mappedRecords = records.map(record => {
        const metadata = record.metadata as any || {};
        return {
          slug: record.slug.replace('issue-', ''),
          num: metadata.num || '',
          title: record.title,
          season: metadata.season || '',
          year: metadata.year || '',
          desc: record.summary || '',
          img: metadata.img || '/assets/images/placeholder.jpg',
          isDemo: record.isDemo,
          isFeatured: record.isFeatured
        };
      });

      res.json(mappedRecords);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

  static async getIssueBySlug(req: Request, res: Response) {
    try {
      const slug = `issue-${requireString(req.params.slug)}`;
      const record = await prisma.canonicalEntity.findUnique({
        where: { slug }
      });
      if (!record || record.entityType !== CanonicalEntityType.KNOWLEDGE_OBJECT) {
        return res.status(404).json({ error: 'Issue not found' });
      }

      const metadata = record.metadata as any || {};
      const mappedRecord = {
        slug: record.slug.replace('issue-', ''),
        num: metadata.num || '',
        title: record.title,
        season: metadata.season || '',
        year: metadata.year || '',
        desc: record.summary || '',
        img: metadata.img || '/assets/images/placeholder.jpg',
        isDemo: record.isDemo,
        isFeatured: record.isFeatured
      };

      res.json(mappedRecord);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

  static async submitNomination(req: Request, res: Response) {
    try {
      const data = req.body;
      const created = await prisma.artisanNomination.create({
        data: {
          submissionNumber: `NOM-${Date.now()}`,
          nomineeName: data.nomineeName || 'Unknown',
          nominatorInfo: data.authorName || 'Self',
          craft: data.primaryCraft || 'Unspecified',
          district: data.geographicScope || 'Unknown',
          status: 'SUBMITTED'
        } as any
      });
      res.json({ success: true, data: created, message: 'Nomination submitted successfully.' });
    } catch (e: any) { res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: e.message } }); }
  }

  static async submitStory(req: Request, res: Response) {
    try {
      const data = req.body;
      const created = await prisma.storySubmission.create({
        data: {
          submissionNumber: `STY-${Date.now()}`,
          title: data.title || 'Untitled Story',
          authorName: data.authorName || 'Unknown',
          authorEmail: data.authorEmail || 'unknown@example.com',
          authorPhone: data.authorPhone || '0000',
          contributorCategory: data.contributorCategory || 'GENERAL',
          country: data.country || 'Unknown',
          primaryCraft: data.primaryCraft || 'Unspecified',
          submissionType: data.submissionType || 'PUBLIC',
          submissionStage: data.submissionStage || 'INITIAL',
          primaryEditorialTheme: data.primaryEditorialTheme || 'GENERAL',
          geographicScope: data.geographicScope || 'Global',
          status: 'SUBMITTED'
        } as any
      });
      res.json({ success: true, data: created, message: 'Story submitted successfully.' });
    } catch (e: any) { res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: e.message } }); }
  }

  static async submitContributor(req: Request, res: Response) {
    try {
      const data = req.body;
      const created = await prisma.contributorApplication.create({
        data: {
          submissionNumber: `CON-${Date.now()}`,
          fullName: data.fullName || 'Unknown',
          email: data.email || 'unknown@example.com',
          phone: data.phone || '0000',
          country: data.country || 'Unknown',
          stateRegion: data.stateRegion || 'Unknown',
          districtCity: data.districtCity || 'Unknown',
          contributorCategory: data.contributorCategory || 'GENERAL',
          currentProfession: data.currentProfession || 'Unknown',
          shortBio: data.shortBio || 'Bio',
          areasOfContribution: data.areasOfContribution || 'General',
          yearsOfExperience: data.yearsOfExperience || '0',
          geographicAvailability: data.geographicAvailability || 'Local',
          preferredEngagementType: data.preferredEngagementType || 'Voluntary',
          availability: data.availability || 'As needed',
          timeCommitment: data.timeCommitment || 'Flexible',
          motivation: data.motivation || 'Interest',
          status: 'SUBMITTED',
          declarationPrivacy: true
        } as any
      });
      res.json({ success: true, data: created, message: 'Application submitted successfully.' });
    } catch (e: any) { res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: e.message } }); }
  }

  static async submitDocumentation(req: Request, res: Response) {
    try {
      const data = req.body;
      const created = await prisma.supportDocumentation.create({
        data: {
          submissionNumber: `DOC-${Date.now()}`,
          purpose: data.purpose || 'EVIDENCE',
          title: data.title || 'Untitled Evidence',
          materialType: data.materialType || 'Photograph',
          primaryCraft: data.primaryCraft || 'Unspecified',
          identifiablePersons: data.identifiablePersons || 'None',
          historicalContext: data.historicalContext || 'Unknown',
          dateType: data.dateType || 'EXACT',
          legalOwner: data.legalOwner || 'Self',
          relationshipToOwner: data.relationshipToOwner || 'Self',
          ownerAuthorisation: true,
          copyrightStatus: data.copyrightStatus || 'OWNED',
          permissionPrivateReview: true,
          attributionPreference: data.attributionPreference || 'PUBLIC',
          containsSensitiveInfo: data.containsSensitiveInfo || 'NO',
          submitterName: data.submitterName || 'Unknown',
          submitterEmail: data.submitterEmail || 'test@test.com',
          submitterPhone: data.submitterPhone || '0000',
          relationshipToMaterial: data.relationshipToMaterial || 'Owner',
          authToSubmit: true,
          declarationAccuracy: true,
          termsAccepted: true,
          noGuaranteedPublication: true,
          status: 'SUBMITTED'
        } as any
      });
      res.json({ success: true, data: created, message: 'Documentation submitted successfully.' });
    } catch (e: any) { res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: e.message } }); }
  }
}
