import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { randomBytes, createHash } from 'crypto';
import jwt from 'jsonwebtoken';
import { requireString } from "../utils/routeHelpers";

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development';

export const getPublicMessages = async (req: any, res: any) => {
  try {
    const { category, featured, search, page = '1', pageSize = '50' } = req.query;
    const where: any = {
      workflowStatus: 'PUBLISHED',
      publishedAt: { lte: new Date() }
    };
    if (category) where.category = { slug: category };
    if (featured === 'true') where.isFeatured = true;
    if (search) {
      where.OR = [
        { fullName: { contains: search as string, mode: 'insensitive' } },
        { institution: { contains: search as string, mode: 'insensitive' } },
        { title: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const skip = (parseInt(page as string) - 1) * parseInt(pageSize as string);
    const take = parseInt(pageSize as string);

    const [messages, total] = await Promise.all([
      prisma.skcOfficialMessage.findMany({
        where,
        orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }],
        skip,
        take,
        select: {
          id: true,
          referenceNumber: true,
          slug: true,
          title: true,
          excerpt: true,
          category: { select: { id: true, title: true, slug: true } },
          fullName: true,
          publicDisplayName: true,
          designation: true,
          institution: true,
          country: true,
          photographUrl: true,
          institutionLogoUrl: true,
          isFeatured: true,
          publishedAt: true,
        }
      }),
      prisma.skcOfficialMessage.count({ where })
    ]);

    res.status(200).json({
      status: 'success',
      success: true,
      data: messages,
      pagination: { page: parseInt(page as string), pageSize: take, total, totalPages: Math.ceil(total / take) }
    });
  } catch (error) {
    console.error("Failed to fetch official messages", error);
    res.status(500).json({ status: 'error', success: false, error: "Internal Server Error" });
  }
};

export const getPublicStats = async (req: any, res: any) => {
  try {
    const [published, categories] = await Promise.all([
      prisma.skcOfficialMessage.count({ where: { workflowStatus: 'PUBLISHED' } }),
      prisma.skcOfficialMessageCategory.count(),
    ]);
    // Count distinct countries
    const countryData = await prisma.skcOfficialMessage.findMany({
      where: { workflowStatus: 'PUBLISHED' },
      select: { country: true },
      distinct: ['country'],
    });
    const countries = countryData.filter(c => c.country).length;

    res.status(200).json({
      status: 'success',
      success: true,
      data: { published, categories, countries }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', success: false, error: "Internal Server Error" });
  }
};

export const getPublicCategories = async (req: any, res: any) => {
  try {
    const cats = await prisma.skcOfficialMessageCategory.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        _count: {
          select: {
            messages: { where: { workflowStatus: 'PUBLISHED' } }
          }
        }
      }
    });
    res.status(200).json({ status: 'success', success: true, data: cats });
  } catch (error) {
    res.status(500).json({ status: 'error', success: false, error: "Internal Server Error" });
  }
};

export const getMessageBySlug = async (req: any, res: any) => {
  try {
    const slug = requireString(req.params.slug);
    const message = await prisma.skcOfficialMessage.findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, title: true, slug: true } }
      }
    });

    if (!message || message.workflowStatus !== 'PUBLISHED' || (message.publishedAt && message.publishedAt > new Date())) {
      return res.status(404).json({ status: 'error', success: false, error: "Message not found or not yet published." });
    }

    // Exclude internal fields for public consumption
    const { internalNotes, editorialNotes, officialEmail, phone, ...publicData } = message as any;
    res.status(200).json({ status: 'success', success: true, data: publicData });
  } catch (error) {
    res.status(500).json({ status: 'error', success: false, error: "Internal Server Error" });
  }
};

export const validateToken = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: 'Enter the complete 16-character invitation code.' });
    }
    const normalized = code.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (normalized.length !== 16) {
      return res.status(400).json({ success: false, error: 'Enter the complete 16-character invitation code.' });
    }
    
    // Hash token
    const tokenHash = createHash('sha256').update(normalized).digest('hex');

    const inv = await prisma.skcOfficialMessageInvitation.findUnique({
      where: { tokenHash: tokenHash }
    });

    if (!inv) return res.status(404).json({ success: false, error: 'We could not verify this invitation code. Check the code and try again.' });
    if (inv.status === 'REVOKED') return res.status(403).json({ success: false, error: 'This invitation is no longer active. Contact the Assessment Secretariat.' });
    if (inv.status === 'COMPLETED') return res.status(409).json({ success: false, error: 'This invitation has already been used to submit an official message.' });
    if (new Date(inv.expiryDate) < new Date() || inv.status === 'EXPIRED') return res.status(410).json({ success: false, error: 'This invitation has expired. Contact the Assessment Secretariat for assistance.' });

    // Mark as OPENED if first view
    if ((inv.status === 'SENT' || inv.status === 'READY') && !inv.firstAccessedAt) {
      await prisma.skcOfficialMessageInvitation.update({
        where: { tokenHash: tokenHash },
        data: { firstAccessedAt: new Date(), lastAccessedAt: new Date(), status: 'OPENED' }
      });
    } else {
      await prisma.skcOfficialMessageInvitation.update({
        where: { tokenHash: tokenHash },
        data: { lastAccessedAt: new Date() }
      });
    }

    // In a real application, we would create a secure session here (e.g. JWT)
    // For now we just return success with the invitation details.
    const sessionToken = jwt.sign(
      { invitationId: inv.id, tokenHash: tokenHash },
      JWT_SECRET,
      { expiresIn: '2h' }
    );
    
    res.cookie('omi_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV?.trim() === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 2 * 60 * 60 * 1000 // 2 hours
    });

    return res.json({ success: true, data: { id: inv.id, fullName: inv.fullName, institution: inv.institution, tokenLastFour: inv.tokenLastFour } });
  } catch (error) {
    console.error('validateToken error:', error);
    return res.status(500).json({ success: false, error: 'The invitation service is temporarily unavailable. Please try again shortly.' });
  }
};

export const submitViaToken = async (req: Request, res: Response) => {
  try {
    const rawToken = requireString(req.params.token);
    const normalized = rawToken.toUpperCase().replace(/[^A-Z2-9]/g, '');
    if (!normalized || normalized.length < 16) {
      return res.status(400).json({ success: false, error: 'Code not recognized.' });
    }
    const tokenHash = createHash('sha256').update(normalized).digest('hex');

    const inv = await prisma.skcOfficialMessageInvitation.findUnique({ where: { tokenHash } });

    if (!inv) return res.status(404).json({ success: false, error: 'Code not recognized.' });
    if (inv.status === 'REVOKED') return res.status(403).json({ success: false, error: 'Invitation no longer valid.' });
    if ((inv.status === 'SUBMITTED' || inv.status === 'COMPLETED') && !inv.resubmissionAllowed) return res.status(409).json({ success: false, error: 'Submission already completed.' });
    if (new Date(inv.expiryDate) < new Date() || inv.status === 'EXPIRED') return res.status(410).json({ success: false, error: 'Invitation expired.' });

    // Generate reference number
    const settings = await prisma.skcOfficialMessageSettings.upsert({
      where: { id: 'global' },
      update: {},
      create: { id: 'global' }
    });

    const seq = settings.nextSequenceNumber || 1;
    const prefix = settings.referenceNumberPrefix || 'SKC2026';
    const type = settings.referenceNumberType || 'OM';
    const ref = `${prefix}-${type}-${String(seq).padStart(4, '0')}`;
    const slug = `${ref.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${randomBytes(4).toString('hex')}`;

    // Find default category if none in invitation
    let categoryId = inv.categoryId;
    if (!categoryId) {
      const cat = await prisma.skcOfficialMessageCategory.findFirst({ orderBy: { displayOrder: 'asc' } });
      if (!cat) return res.status(500).json({ success: false, error: 'No message categories are configured.' });
      categoryId = cat.id;
    }

    const {
      title, fullBody, excerpt, language, themes,
      honorific, publicDisplayName, department, phone,
      region, district,
      photographUrl, institutionLogoUrl, signedLetterUrl
    } = req.body;

    const msg = await prisma.skcOfficialMessage.create({
      data: {
        referenceNumber: ref,
        slug,
        fullName: inv.fullName,
        designation: inv.designation,
        institution: inv.institution,
        officialEmail: inv.officialEmail,
        country: inv.country,
        contributorCategory: inv.contributorCategory,
        categoryId: categoryId,
        workflowStatus: 'SUBMITTED',
        identityStatus: 'PENDING',
        authorityStatus: 'PENDING',
        editorialStatus: 'PENDING',
        invitationId: inv.id,
        title: title || null,
        fullBody: fullBody || null,
        excerpt: excerpt || null,
        language: language || 'English',
        honorific: honorific || null,
        publicDisplayName: publicDisplayName || inv.fullName,
        department: department || null,
        phone: phone || null,
        region: region || null,
        district: district || null,
        photographUrl: photographUrl || null,
        institutionLogoUrl: institutionLogoUrl || null,
        signedLetterUrl: signedLetterUrl || null,
      }
    });

    await Promise.all([
      prisma.skcOfficialMessageInvitation.update({
        where: { tokenHash },
        data: { status: 'SUBMITTED', completedAt: new Date(), useCount: { increment: 1 } }
      }),
      prisma.skcOfficialMessageSettings.update({
        where: { id: 'global' },
        data: { nextSequenceNumber: seq + 1 }
      }),
      prisma.skcOfficialMessageAuditLog.create({
        data: {
          messageId: msg.id,
          invitationId: inv.id,
          actorId: 'public',
          actorName: inv.fullName,
          action: 'SUBMITTED',
          newValue: { referenceNumber: ref },
          ipAddress: req.ip,
        }
      })
    ]);

    return res.json({
      success: true,
      data: { id: msg.id, referenceNumber: ref, slug }
    });
  } catch (error) {
    console.error('submitViaToken error:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

export const requestInvitation = async (req: Request, res: Response) => {
  try {
    const { fullName, designation, institution, officialEmail, proposedRelevance, contributorCategory, reasonForRequest, consentAccepted } = req.body;
    
    if (!fullName || !officialEmail || !institution || !contributorCategory || !reasonForRequest || !consentAccepted) {
      return res.status(400).json({ success: false, message: 'Please review the highlighted fields and try again.' });
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(officialEmail)) {
      return res.status(400).json({ success: false, message: 'Please review the highlighted fields and try again.' });
    }
    
    if (reasonForRequest.length < 50 || reasonForRequest.length > 500) {
      return res.status(400).json({ success: false, message: 'Please review the highlighted fields and try again.' });
    }
    
    const validCategories = [
      'GOVERNMENT_PUBLIC_INSTITUTIONS',
      'INDUSTRY_TRADE',
      'ACADEMIA_RESEARCH',
      'ARTISANS_CRAFT_COMMUNITIES',
      'CIVIL_SOCIETY_HERITAGE',
      'MEDIA_COMMUNICATION',
      'INTERNATIONAL_INSTITUTIONS',
      'POLICY_LEGAL',
      'OTHER_RELEVANT_AUTHORITY'
    ];
    if (!validCategories.includes(contributorCategory)) {
      return res.status(400).json({ success: false, message: 'Please review the highlighted fields and try again.' });
    }

    // Duplicate check
    const existing = await prisma.skcOfficialMessageAccessRequest.findFirst({
      where: {
        officialEmail,
        institution,
        requestedCategory: contributorCategory
      }
    });
    
    if (existing) {
      return res.status(400).json({ success: false, message: 'A request from this email and institution has already been submitted for the current assessment cycle.' });
    }

    const count = await prisma.skcOfficialMessageAccessRequest.count();
    const referenceNumber = `OMI-2026-${String(count + 1).padStart(6, '0')}`;

    const newReq = await prisma.skcOfficialMessageAccessRequest.create({
      data: {
        referenceNumber,
        fullName,
        designation: designation || 'Not Provided',
        institution,
        officialEmail,
        proposedRelevance: proposedRelevance || '',
        requestedCategory: contributorCategory,
        reasonForRequest,
        consentToTerms: Boolean(consentAccepted),
        status: 'PENDING'
      }
    });

    return res.json({
      success: true,
      referenceNumber: newReq.referenceNumber,
      status: newReq.status,
      submittedAt: newReq.createdAt
    });
  } catch (error) {
    console.error('Access Request Error', error);
    return res.status(500).json({ success: false, message: 'We could not complete your request at this time. Please try again shortly.' });
  }
};

// ── Check active session cookie ─────────────────────────────────
export const checkSession = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.omi_session;
    if (!token) {
      return res.status(401).json({ success: false, error: 'No active session.' });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(401).json({ success: false, error: 'Session expired or invalid.' });
    }

    const inv = await prisma.skcOfficialMessageInvitation.findUnique({
      where: { tokenHash: decoded.tokenHash }
    });

    if (!inv || inv.status === 'REVOKED' || inv.status === 'COMPLETED') {
      return res.status(403).json({ success: false, error: 'Invitation is no longer valid.' });
    }
    if (new Date(inv.expiryDate) < new Date()) {
      return res.status(410).json({ success: false, error: 'Invitation expired.' });
    }

    return res.json({
      success: true,
      valid: true,
      invitation: {
        id: inv.id,
        fullName: inv.fullName,
        institution: inv.institution,
        contributorCategory: inv.contributorCategory,
        tokenLastFour: inv.tokenLastFour,
      }
    });
  } catch (error) {
    console.error('checkSession error:', error);
    return res.status(500).json({ success: false, error: 'Session verification failed.' });
  }
};

// ── Submit official message (requires valid session cookie) ─────
export const submitMessage = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.omi_session;
    if (!token) return res.status(401).json({ success: false, error: 'No active session. Please verify your invitation code first.' });

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(401).json({ success: false, error: 'Session expired. Please re-enter your invitation code.' });
    }

    const inv = await prisma.skcOfficialMessageInvitation.findUnique({
      where: { tokenHash: decoded.tokenHash }
    });
    if (!inv) return res.status(404).json({ success: false, error: 'Invitation not found.' });
    if (inv.status === 'REVOKED') return res.status(403).json({ success: false, error: 'This invitation has been revoked.' });
    if (inv.status === 'COMPLETED') return res.status(409).json({ success: false, error: 'This invitation has already been used to submit a message.' });
    if (new Date(inv.expiryDate) < new Date()) return res.status(410).json({ success: false, error: 'This invitation has expired.' });

    const { title, fullBody, excerpt, language, honorific, publicDisplayName, department, phone, signedLetterUrl, country } = req.body;

    if (!title?.trim() || title.length < 10) return res.status(400).json({ success: false, error: 'A title of at least 10 characters is required.' });
    if (!fullBody?.trim() || fullBody.length < 100) return res.status(400).json({ success: false, error: 'Message body must be at least 100 characters.' });
    if (fullBody.length > 10000) return res.status(400).json({ success: false, error: 'Message body must not exceed 10,000 characters.' });
    const resolvedCountry = country?.trim() || inv.country || 'India'; // default for J&K crafts context

    // Generate reference number
    const settings = await prisma.skcOfficialMessageSettings.upsert({
      where: { id: 'global' }, update: {}, create: { id: 'global' }
    });
    const seq = settings.nextSequenceNumber || 1;
    const prefix = settings.referenceNumberPrefix || 'SKC2026';
    const type = settings.referenceNumberType || 'OM';
    const ref = `${prefix}-${type}-${String(seq).padStart(4, '0')}`;
    const slug = `${ref.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${randomBytes(4).toString('hex')}`;

    // categoryId: use the one from invitation or fallback to a default
    let categoryId = inv.categoryId;
    if (!categoryId) {
      const cat = await prisma.skcOfficialMessageCategory.findFirst({ orderBy: { displayOrder: 'asc' } });
      categoryId = cat?.id || null;
    }
    if (!categoryId) return res.status(500).json({ success: false, error: 'No message categories configured. Contact the Secretariat.' });

    const msg = await prisma.skcOfficialMessage.create({
      data: {
        referenceNumber: ref,
        slug,
        // Verified contributor identity — sourced from the approved invitation request
        fullName:            inv.fullName,
        designation:         inv.designation,
        institution:         inv.institution,
        contributorCategory: inv.contributorCategory,
        officialEmail:       inv.officialEmail,
        country:             resolvedCountry,
        // Submitter-editable fields
        publicDisplayName:   publicDisplayName || inv.fullName,
        honorific:           honorific || inv.honorific,
        department:          department || inv.department,
        phone:               phone || inv.phone,
        // Message content
        title,
        fullBody,
        excerpt:             excerpt || null,
        language:            language || 'English',
        signedLetterUrl:     signedLetterUrl || null,
        // All statuses default to PENDING via schema — explicit for clarity
        workflowStatus:      'SUBMITTED',
        identityStatus:      'PENDING',
        authorityStatus:     'PENDING',
        editorialStatus:     'PENDING',
        // Category
        categoryId,
      }
    });

    await Promise.all([
      prisma.skcOfficialMessageInvitation.update({
        where: { tokenHash: decoded.tokenHash },
        data: { status: 'COMPLETED', completedAt: new Date(), useCount: { increment: 1 } }
      }),
      prisma.skcOfficialMessageSettings.update({
        where: { id: 'global' },
        data: { nextSequenceNumber: seq + 1 }
      }),
    ]);

    // Clear the session cookie
    res.clearCookie('omi_session');

    return res.json({ success: true, referenceNumber: ref, slug });
  } catch (error) {
    console.error('submitMessage error:', error);
    return res.status(500).json({ success: false, error: 'We could not submit your message. Please try again.' });
  }
};
