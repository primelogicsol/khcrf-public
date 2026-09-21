import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';
import { requireString } from "../utils/routeHelpers";

export const createApplication = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const {
      stakeholderCategory,
      entityName,
      ccsiRegistrationId,
      referralCode,
      craftCategory,
      clusterName,
      phone,
      email,
      address,
      awardCategory,
      yearsExperience,
      productionScale,
      teamSize,
      marketsServed,
      giStatus,
      giAuthorizedNumber,
      giSupportingDoc,
      meritStatement,
      productImages,
      certifications,
      giDocumentation,
      exportRecords,
      mediaCoverage,
      testimonials,
      complianceDocs,
      complianceAccurate,
      meritBasedAck,
      noSponsorshipImpact,
      publicDisplayConsent,
      signature,
      communityImpact,
      sustainability,
      legislativeOfficeId,
    } = req.body;

    // 1. Verify CCSI Registration ID existence and status
    const ccsiProfile = await prisma.ccsiProfile.findFirst({
      where: {
        OR: [
            { id: ccsiRegistrationId },
            { referralId: ccsiRegistrationId },
            { applicationCode: ccsiRegistrationId }
        ],
        status: { in: ['VERIFIED', 'JURISDICTION_APPROVED'] },
      },
    });

    if (!ccsiProfile) {
      return res.status(403).json({ error: 'Valid CCSI verification is required to participate.' });
    }

    // 2. Prevent duplicate applications per cycle (Year)
    const currentYear = new Date().getFullYear().toString();
    const existing = await prisma.cceApplication.findFirst({
        where: {
            userId,
            ccsiRegistrationId,
            createdAt: {
                gte: new Date(`${currentYear}-01-01`),
                lte: new Date(`${currentYear}-12-31`),
            }
        }
    });

    if (existing) {
        return res.status(400).json({ error: 'You have already submitted an application for this year cycle.' });
    }

    // 3. Generate Reference Number
    const referenceNumber = `CCE-${currentYear}-${uuidv4().substring(0, 8).toUpperCase()}`;

    // 4. Create Application
    const application = await prisma.cceApplication.create({
      data: {
        userId,
        legislativeOfficeId,
        referenceNumber,
        stakeholderCategory,
        entityName,
        ccsiRegistrationId,
        referralCode,
        craftCategory,
        clusterName,
        phone,
        email,
        address,
        awardCategory,
        yearsExperience: parseInt(String(yearsExperience)) || 0,
        productionScale,
        teamSize: teamSize ? (parseInt(String(teamSize)) || 0) : null,
        marketsServed,
        giStatus,
        giAuthorizedNumber,
        giSupportingDoc,
        meritStatement,
        productImages,
        certifications,
        giDocumentation,
        exportRecords,
        mediaCoverage,
        testimonials,
        complianceDocs,
        complianceAccurate,
        meritBasedAck,
        noSponsorshipImpact,
        publicDisplayConsent,
        signature,
        signatureDate: new Date(),
        communityImpact,
        sustainability,
      },
    });

    res.status(201).json(application);
  } catch (error: any) {
    console.error('Create CCE Application Error Details:', {
        message: error.message,
        stack: error.stack,
        code: error.code,
        meta: error.meta
    });
    res.status(500).json({ error: 'Failed to submit application: ' + (error.message || 'Internal Server Error') });
  }
};

export const getMyApplications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const applications = await prisma.cceApplication.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

export const getApplicationById = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    const application = await prisma.cceApplication.findUnique({
      where: { id },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch application' });
  }
};

export const getAllApplications = async (req: Request, res: Response) => {
  try {
    const applications = await prisma.cceApplication.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
      }
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    const { 
        status, 
        complianceScore, 
        craftQualityScore, 
        innovationScore, 
        clusterContributionScore, 
        marketReadinessScore, 
        documentationScore,
        adminNotes 
    } = req.body;

    const totalScore = (complianceScore || 0) + (craftQualityScore || 0) + (innovationScore || 0) + (clusterContributionScore || 0) + (marketReadinessScore || 0) + (documentationScore || 0);

    const updated = await prisma.cceApplication.update({
      where: { id },
      data: {
        status,
        complianceScore,
        craftQualityScore,
        innovationScore,
        clusterContributionScore,
        marketReadinessScore,
        documentationScore,
        totalScore,
        adminNotes,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update application' });
  }
};
