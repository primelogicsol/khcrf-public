import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { Role } from '@prisma/client';
import crypto from 'crypto';
import { requireString } from "../utils/routeHelpers";

const sanitize = (str: any): string => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
};

const generateTrackingId = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CTB-${result}`;
};

const mapRoleTypeToEnum = (roleType: string): Role => {
  const norm = roleType.toLowerCase().trim();
  if (norm.includes('research')) return Role.RESEARCH_CONTRIBUTOR;
  if (norm.includes('field')) return Role.FIELD_CONTRIBUTOR;
  if (norm.includes('artisan')) return Role.ARTISAN_CONTRIBUTOR;
  if (norm.includes('industry') || norm.includes('export')) return Role.INDUSTRY_CONTRIBUTOR;
  if (norm.includes('policy')) return Role.POLICY_CONTRIBUTOR;
  if (norm.includes('institution') || norm.includes('partner')) return Role.INSTITUTIONAL_PARTNER;
  if (norm.includes('editor') || norm.includes('reviewer')) return Role.EDITOR_REVIEWER;
  return Role.USER;
};

export const submitIntake = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId || null;
    const {
      fullName, email, phone, country, roleType,
      institution, profileLink, purpose, expertise,
      craftFocus, title, summary, contributionType,
      evidence, fileUrl, sourceNotes
    } = req.body;

    if (!fullName || !email || !country || !roleType || !purpose || !expertise || !craftFocus || !title || !summary || !contributionType) {
      return res.status(400).json({ error: 'Missing required fields in the submission.' });
    }

    const existing = await prisma.knowledgeIntake.findFirst({
      where: { email: sanitize(email) }
    });

    if (existing) {
      return res.status(400).json({
        error: 'You have already submitted a contributor application.',
        alreadySubmitted: true,
        trackingId: existing.trackingId
      });
    }

    let trackingId = generateTrackingId();
    let retries = 0;
    while (retries < 5) {
      const conflict = await prisma.knowledgeIntake.findUnique({ where: { trackingId } });
      if (!conflict) break;
      trackingId = generateTrackingId();
      retries++;
    }

    const intake = await prisma.knowledgeIntake.create({
      data: {
        trackingId,
        userId,
        fullName: sanitize(fullName),
        email: sanitize(email),
        phone: phone ? sanitize(phone) : null,
        country: sanitize(country),
        roleType: sanitize(roleType),
        institution: institution ? sanitize(institution) : null,
        profileLink: profileLink ? sanitize(profileLink) : null,
        purpose: sanitize(purpose),
        expertise: sanitize(expertise),
        craftFocus: sanitize(craftFocus),
        title: sanitize(title),
        summary: sanitize(summary),
        contributionType: sanitize(contributionType),
        evidence: evidence ? sanitize(evidence) : null,
        fileUrl: fileUrl ? sanitize(fileUrl) : null,
        sourceNotes: sourceNotes ? sanitize(sourceNotes) : null,
        status: 'Submitted'
      }
    });

    res.status(201).json({
      message: 'Application submitted successfully.',
      trackingId: intake.trackingId
    });
  } catch (error) {
    console.error('Submit Intake Error:', error);
    res.status(500).json({ error: 'Failed to submit contributor intake.' });
  }
};

export const checkDuplicateSubmission = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const existing = await prisma.knowledgeIntake.findFirst({
      where: { email: sanitize(String(email)) }
    });

    res.json({ exists: !!existing, trackingId: existing?.trackingId || null });
  } catch (error) {
    console.error('Check Duplicate Error:', error);
    res.status(500).json({ error: 'Failed to check duplicate submission.' });
  }
};

export const trackSubmission = async (req: Request, res: Response) => {
  try {
    const trackingId = requireString(req.params.trackingId);
    if (!trackingId) {
      return res.status(400).json({ error: 'Tracking ID is required.' });
    }

    const intake = await prisma.knowledgeIntake.findUnique({
      where: { trackingId: sanitize(trackingId) },
      select: {
        status: true,
        adminReview: true,
        updatedAt: true,
        createdAt: true,
        fullName: true,
        title: true
      }
    });

    if (!intake) {
      return res.status(404).json({ error: 'Submission not found with this tracking ID.' });
    }

    res.json(intake);
  } catch (error) {
    console.error('Track Submission Error:', error);
    res.status(500).json({ error: 'Failed to track submission.' });
  }
};

export const getMySubmissions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const submissions = await prisma.knowledgeIntake.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(submissions);
  } catch (error) {
    console.error('Get My Submissions Error:', error);
    res.status(500).json({ error: 'Failed to fetch submissions.' });
  }
};

export const getAdminIntakeQueue = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || (!user.isAdmin && user.role !== Role.ADMIN)) {
      return res.status(403).json({ error: 'Forbidden: Admins only' });
    }

    const { status, search } = req.query;
    const where: any = {};
    if (status) {
      where.status = String(status);
    }
    if (search) {
      where.OR = [
        { fullName: { contains: String(search), mode: 'insensitive' } },
        { email: { contains: String(search), mode: 'insensitive' } },
        { trackingId: { contains: String(search), mode: 'insensitive' } }
      ];
    }

    const submissions = await prisma.knowledgeIntake.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json(submissions);
  } catch (error) {
    console.error('Get Admin Intake Queue Error:', error);
    res.status(500).json({ error: 'Failed to fetch intake queue.' });
  }
};

export const updateIntakeStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || (!user.isAdmin && user.role !== Role.ADMIN)) {
      return res.status(403).json({ error: 'Forbidden: Admins only' });
    }

    const id = requireString(req.params.id);
    const { status, assignedEditor, adminReview } = req.body;

    const validStatuses = [
      'Submitted', 'Under Review', 'Need More Information',
      'Approved', 'Rejected', 'Invited to Dashboard',
      'Active Contributor', 'Suspended'
    ];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status code.' });
    }

    const intake = await prisma.knowledgeIntake.findUnique({
      where: { id }
    });

    if (!intake) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const updatedData: any = {};
    if (status) updatedData.status = status;
    if (assignedEditor !== undefined) updatedData.assignedEditor = assignedEditor;
    if (adminReview !== undefined) updatedData.adminReview = sanitize(adminReview);

    const updatedIntake = await prisma.knowledgeIntake.update({
      where: { id },
      data: updatedData
    });

    if (status === 'Approved' && intake.userId) {
      const assignedEnumRole = mapRoleTypeToEnum(intake.roleType);
      if (assignedEnumRole !== Role.USER) {
        await prisma.user.update({
          where: { id: intake.userId },
          data: {
            role: assignedEnumRole,
            isMember: true
          }
        });
      }
    }

    res.json(updatedIntake);
  } catch (error) {
    console.error('Update Intake Status Error:', error);
    res.status(500).json({ error: 'Failed to update intake status.' });
  }
};

export const deleteIntakeSubmission = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const id = requireString(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Submission ID is required.' });
    }

    const existing = await prisma.knowledgeIntake.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Submission not found.' });
    }

    // Soft-delete: archive the submission instead of destroying it
    await prisma.knowledgeIntake.update({
      where: { id },
      data: { status: 'Archived' }
    });

    res.json({ success: true, message: 'Submission archived successfully. It can be restored by an admin.' });
  } catch (error) {
    console.error('Archive Intake Submission Error:', error);
    if ((error as any)?.code === 'P2025') {
      return res.status(404).json({ error: 'Submission not found.' });
    }
    res.status(500).json({ error: 'Failed to archive submission.' });
  }
};

