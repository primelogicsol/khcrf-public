import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { randomBytes, createHash } from 'crypto';
import { requireString } from "../utils/routeHelpers";

// ────────────────────────────────────────────────────────────────────────────
// STATS – returns all 12 fields the frontend OverviewTab expects
// ────────────────────────────────────────────────────────────────────────────
export const getStats = async (req: Request, res: Response) => {
  try {
    const [
      invitationsIssued,
      submitted,
      identityReview,
      authorityVerification,
      editorialReview,
      contributorApproval,
      revisionRequested,
      approved,
      scheduled,
      published,
      withdrawn,
      declined,
      archived,
    ] = await Promise.all([
      prisma.skcOfficialMessageInvitation.count(),
      prisma.skcOfficialMessage.count({ where: { workflowStatus: 'SUBMITTED' } }),
      prisma.skcOfficialMessage.count({ where: { workflowStatus: 'IDENTITY_REVIEW' } }),
      prisma.skcOfficialMessage.count({ where: { workflowStatus: 'AUTHORITY_VERIFICATION' } }),
      prisma.skcOfficialMessage.count({ where: { workflowStatus: 'EDITORIAL_REVIEW' } }),
      prisma.skcOfficialMessage.count({ where: { workflowStatus: 'AWAITING_CONTRIBUTOR_APPROVAL' } }),
      prisma.skcOfficialMessage.count({ where: { workflowStatus: 'REVISION_REQUESTED' } }),
      prisma.skcOfficialMessage.count({ where: { workflowStatus: 'APPROVED' } }),
      prisma.skcOfficialMessage.count({ where: { workflowStatus: 'SCHEDULED' } }),
      prisma.skcOfficialMessage.count({ where: { workflowStatus: 'PUBLISHED' } }),
      prisma.skcOfficialMessage.count({ where: { workflowStatus: 'WITHDRAWN' } }),
      prisma.skcOfficialMessage.count({ where: { workflowStatus: 'DECLINED' } }),
      prisma.skcOfficialMessage.count({ where: { workflowStatus: 'ARCHIVED' } }),
    ]);

    const awaitingSubmission = await prisma.skcOfficialMessageInvitation.count({
      where: { message: null, status: { notIn: ['REVOKED', 'DECLINED', 'EXPIRED'] } },
    });

    res.status(200).json({
      success: true,
      data: {
        invitationsIssued,
        awaitingSubmission,
        submitted,
        identityReview,
        editorialReview,
        contributorApproval,
        scheduled,
        published,
        revisionRequested,
        declined,
        withdrawn,
        archived,
        // bonus aggregates
        authorityVerification,
        approved,
        inReview: identityReview + authorityVerification + editorialReview + revisionRequested + contributorApproval,
        totalMessages: submitted + identityReview + authorityVerification + editorialReview + contributorApproval +
          revisionRequested + approved + scheduled + published + withdrawn + declined + archived,
      },
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// CATEGORIES
// ────────────────────────────────────────────────────────────────────────────
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.skcOfficialMessageCategory.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await prisma.skcOfficialMessageCategory.create({ data: req.body });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    const category = await prisma.skcOfficialMessageCategory.update({ where: { id }, data: req.body });
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    await prisma.skcOfficialMessageCategory.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// SETTINGS
// ────────────────────────────────────────────────────────────────────────────
export const getSettings = async (req: Request, res: Response) => {
  try {
    let settings = await prisma.skcOfficialMessageSettings.findUnique({ where: { id: 'global' } });
    if (!settings) {
      settings = await prisma.skcOfficialMessageSettings.create({ data: { id: 'global' } });
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { id: _id, ...updateData } = req.body;
    const settings = await prisma.skcOfficialMessageSettings.upsert({
      where: { id: 'global' },
      update: updateData,
      create: { id: 'global', ...updateData },
    });
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// INVITATIONS
// ────────────────────────────────────────────────────────────────────────────
export const getInvitations = async (req: Request, res: Response) => {
  try {
    const { status, page = '1', pageSize = '50' } = req.query;
    const where: any = {};
    if (status) where.status = status;

    const skip = (parseInt(page as string) - 1) * parseInt(pageSize as string);
    const take = parseInt(pageSize as string);

    const [invitations, total] = await Promise.all([
      prisma.skcOfficialMessageInvitation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: {
          message: { select: { id: true, workflowStatus: true, referenceNumber: true } },
        },
      }),
      prisma.skcOfficialMessageInvitation.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: invitations,
      pagination: { page: parseInt(page as string), pageSize: take, total },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const createInvitation = async (req: Request, res: Response) => {
  try {
    const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let rawToken = '';
    while (rawToken.length < 16) {
      const byte = randomBytes(1)[0];
      if (byte < 248) { // 248 is the largest multiple of 31 less than 256
        rawToken += alphabet[byte % 31];
      }
    }
    
    // Format token as XXXX-XXXX-XXXX-XXXX for the user
    const formattedToken = rawToken.match(/.{1,4}/g)!.join('-');
    
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const tokenLastFour = rawToken.slice(-4);
    
    const expiryDate = req.body.expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    
    // Explicit mapping to prevent mapping raw token or missing fields
    const data = {
      tokenHash,
      tokenLastFour,
      fullName: req.body.fullName,
      publicDisplayName: req.body.publicDisplayName,
      honorific: req.body.honorific,
      designation: req.body.designation,
      institution: req.body.institution,
      department: req.body.department,
      contributorCategory: req.body.contributorCategory,
      institutionType: req.body.institutionType,
      officialEmail: req.body.officialEmail,
      phone: req.body.phone,
      country: req.body.country,
      region: req.body.region,
      district: req.body.district,
      preferredLanguage: req.body.preferredLanguage || 'English',
      expiryDate,
      assignedReviewerId: req.body.assignedReviewerId,
      internalPriority: req.body.internalPriority || 'NORMAL',
      invitationNote: req.body.invitationNote,
      targetPublicationDate: req.body.targetPublicationDate,
      categoryId: req.body.categoryId,
      purpose: req.body.purpose,
      resubmissionAllowed: req.body.resubmissionAllowed || false,
      maxUses: req.body.maxUses || 1,
      createdBy: (req as any).user?.id || 'admin',
      status: 'READY'
    };
    
    const invitation = await prisma.skcOfficialMessageInvitation.create({ data });
    
    // Return the RAW token only this one time
    res.status(201).json({ success: true, data: { ...invitation, rawToken: formattedToken } });
  } catch (error) {
    console.error('createInvitation error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const updateInvitation = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    const invitation = await prisma.skcOfficialMessageInvitation.update({ where: { id }, data: req.body });
    res.status(200).json({ success: true, data: invitation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const deleteInvitation = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    await prisma.skcOfficialMessageInvitation.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Invitation deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// ---- Invitation workflow action endpoints ----

export const resendInvitation = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    const invitation = await prisma.skcOfficialMessageInvitation.update({
      where: { id },
      data: { status: 'SENT', sentAt: new Date() },
    });
    res.status(200).json({ success: true, data: invitation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const revokeInvitation = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    const invitation = await prisma.skcOfficialMessageInvitation.update({
      where: { id },
      data: { 
        status: 'REVOKED', 
        revokedAt: new Date(),
        revokedBy: (req as any).user?.id || 'admin',
        revocationReason: req.body.reason || 'Manually revoked'
      },
    });
    res.status(200).json({ success: true, data: invitation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const extendInvitation = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    const existing = await prisma.skcOfficialMessageInvitation.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Invitation not found' });
    const newExpiry = new Date(Math.max(existing.expiryDate.getTime(), Date.now()) + 30 * 24 * 60 * 60 * 1000);
    const invitation = await prisma.skcOfficialMessageInvitation.update({
      where: { id },
      data: {
        expiryDate: newExpiry,
        status: existing.status === 'EXPIRED' ? 'SENT' : existing.status,
      },
    });
    res.status(200).json({ success: true, data: invitation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const copyInvitationLink = async (req: Request, res: Response) => {
  // We no longer store the raw token, so we cannot return it after creation.
  return res.status(400).json({ success: false, message: 'Raw tokens cannot be retrieved after generation for security reasons.' });
};

// ────────────────────────────────────────────────────────────────────────────
// MESSAGES – filtering and pagination support
// ────────────────────────────────────────────────────────────────────────────
const REVIEW_QUEUE_STATUSES = [
  'SUBMITTED',
  'IDENTITY_REVIEW',
  'AUTHORITY_VERIFICATION',
  'EDITORIAL_REVIEW',
  'REVISION_REQUESTED',
  'AWAITING_CONTRIBUTOR_APPROVAL',
  'APPROVED',
];

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { status, reviewQueue, page = '1', pageSize = '50' } = req.query;
    const where: any = {};

    if (reviewQueue === 'true') {
      where.workflowStatus = { in: REVIEW_QUEUE_STATUSES };
    } else if (status === 'ARCHIVED') {
      where.workflowStatus = { in: ['ARCHIVED', 'WITHDRAWN', 'DECLINED'] };
    } else if (status) {
      where.workflowStatus = status;
    }

    const skip = (parseInt(page as string) - 1) * parseInt(pageSize as string);
    const take = parseInt(pageSize as string);

    const [messages, total] = await Promise.all([
      prisma.skcOfficialMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: { category: { select: { id: true, title: true, slug: true } } },
      }),
      prisma.skcOfficialMessage.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: messages,
      pagination: {
        page: parseInt(page as string),
        pageSize: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getMessageById = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    const message = await prisma.skcOfficialMessage.findUnique({
      where: { id },
      include: {
        category: true,
        revisions: { orderBy: { createdAt: 'desc' } },
        auditLogs: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    });
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    res.status(200).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const createMessage = async (req: Request, res: Response) => {
  try {
    const catId = req.body.categoryId;
    if (!catId) {
      const defaultCat = await prisma.skcOfficialMessageCategory.findFirst();
      if (!defaultCat) {
        return res.status(400).json({ success: false, message: 'No category found. Please create a category first.' });
      }
      req.body.categoryId = defaultCat.id;
    }
    const settings = await prisma.skcOfficialMessageSettings.upsert({
      where: { id: 'global' },
      update: {},
      create: { id: 'global' },
    });
    const seq = settings.nextSequenceNumber || 1;
    const ref = `${settings.referenceNumberPrefix}-${settings.referenceNumberType}-${String(seq).padStart(4, '0')}`;
    const slug = `${ref.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${randomBytes(4).toString('hex')}`;
    await prisma.skcOfficialMessageSettings.update({ where: { id: 'global' }, data: { nextSequenceNumber: seq + 1 } });

    const message = await prisma.skcOfficialMessage.create({
      data: { ...req.body, referenceNumber: ref, slug },
    });
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.error('createMessage error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const updateMessage = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    const { id: _id, referenceNumber: _ref, slug: _slug, ...updateData } = req.body;
    const message = await prisma.skcOfficialMessage.update({ where: { id }, data: updateData });
    res.status(200).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    await prisma.skcOfficialMessage.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// WORKFLOW TRANSITIONS
// ────────────────────────────────────────────────────────────────────────────
const WORKFLOW_TRANSITIONS: Record<string, string> = {
  IDENTITY_APPROVE: 'AUTHORITY_VERIFICATION',
  AUTHORITY_VERIFY: 'EDITORIAL_REVIEW',
  EDITORIAL_APPROVE: 'AWAITING_CONTRIBUTOR_APPROVAL',
  REQUEST_REVISION: 'REVISION_REQUESTED',
  APPROVE: 'APPROVED',
  SCHEDULE: 'SCHEDULED',
  PUBLISH: 'PUBLISHED',
  UNPUBLISH: 'SUBMITTED',
  ARCHIVE: 'ARCHIVED',
  DECLINE: 'DECLINED',
  WITHDRAW: 'WITHDRAWN',
};

export const transitionMessageWorkflow = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    const { action, reason, scheduledFor } = req.body;

    const newStatus = WORKFLOW_TRANSITIONS[action];
    if (!newStatus) return res.status(400).json({ success: false, message: `Unknown action: ${action}` });

    const existing = await prisma.skcOfficialMessage.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Message not found' });

    const updateData: any = { workflowStatus: newStatus };
    if (action === 'PUBLISH') updateData.publishedAt = new Date();
    if (action === 'SCHEDULE' && scheduledFor) updateData.scheduledFor = new Date(scheduledFor);
    if (action === 'ARCHIVE') updateData.archivedAt = new Date();
    if (action === 'UNPUBLISH') updateData.unpublishedAt = new Date();
    if (action === 'IDENTITY_APPROVE') updateData.identityStatus = 'APPROVED';
    if (action === 'AUTHORITY_VERIFY') updateData.authorityStatus = 'VERIFIED';
    if (action === 'EDITORIAL_APPROVE') updateData.editorialStatus = 'REVIEWED';

    const message = await prisma.skcOfficialMessage.update({ where: { id }, data: updateData });

    await prisma.skcOfficialMessageAuditLog.create({
      data: {
        messageId: id,
        actorId: (req as any).user?.id || 'system',
        actorName: (req as any).user?.name || 'Admin',
        action,
        previousValue: { workflowStatus: existing.workflowStatus },
        newValue: { workflowStatus: newStatus },
        reason: reason || null,
        ipAddress: req.ip,
      },
    });

    res.status(200).json({ success: true, data: message });
  } catch (error) {
    console.error('transitionMessageWorkflow error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// FEATURE TOGGLE
// ────────────────────────────────────────────────────────────────────────────
export const toggleMessageFeature = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    const existing = await prisma.skcOfficialMessage.findUnique({
      where: { id },
      select: { isFeatured: true },
    });
    if (!existing) return res.status(404).json({ success: false, message: 'Message not found' });
    const message = await prisma.skcOfficialMessage.update({
      where: { id },
      data: { isFeatured: !existing.isFeatured },
    });
    res.status(200).json({ success: true, data: { isFeatured: message.isFeatured } });
  } catch (error) {
    console.error('toggleMessageFeature error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// REVISIONS & AUDIT LOGS (view only)
// ────────────────────────────────────────────────────────────────────────────
export const getMessageRevisions = async (req: Request, res: Response) => {
  try {
    const messageId = requireString(req.params.messageId);
    const revisions = await prisma.skcOfficialMessageRevision.findMany({
      where: { messageId },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, data: revisions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getMessageAuditLogs = async (req: Request, res: Response) => {
  try {
    const messageId = requireString(req.params.messageId);
    const logs = await prisma.skcOfficialMessageAuditLog.findMany({
      where: { messageId },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getAccessRequests = async (req: Request, res: Response) => {
  try {
    const { page = '1', pageSize = '20', status } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(pageSize as string);
    const take = parseInt(pageSize as string);
    const where: any = {};
    if (status) where.status = status;
    
    const [requests, total] = await Promise.all([
      prisma.skcOfficialMessageAccessRequest.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.skcOfficialMessageAccessRequest.count({ where })
    ]);
    res.json({ success: true, data: requests, pagination: { page: parseInt(page as string), pageSize: take, total } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const approveAccessRequest = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    const request = await prisma.skcOfficialMessageAccessRequest.update({
      where: { id },
      data: { status: 'APPROVED', internalNotes: req.body.notes }
    });
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const rejectAccessRequest = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    const request = await prisma.skcOfficialMessageAccessRequest.update({
      where: { id },
      data: { status: 'REJECTED', rejectionReason: req.body.reason }
    });
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
