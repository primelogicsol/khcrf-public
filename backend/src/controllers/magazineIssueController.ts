import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/db.js';
import { requireString } from "../utils/routeHelpers";

// ─── Validation Schema ────────────────────────────────────────────────────────
const ALLOWED_STATUSES = ['DRAFT', 'REVIEW', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED'] as const;

// Valid lifecycle transitions
const VALID_TRANSITIONS: Record<string, string[]> = {
  DRAFT:     ['REVIEW', 'SCHEDULED', 'PUBLISHED'],
  REVIEW:    ['DRAFT', 'SCHEDULED', 'PUBLISHED'],
  SCHEDULED: ['PUBLISHED', 'DRAFT'],
  PUBLISHED: ['ARCHIVED'],
  ARCHIVED:  ['DRAFT'],
};
const ALLOWED_VISIBILITIES = ['PUBLIC', 'MEMBERS_ONLY', 'HIDDEN'] as const;

const issueWriteSchema = z.object({
  title:              z.string().min(3).max(300),
  subtitle:           z.string().max(400).optional().nullable(),
  slug:               z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens').optional(),
  issueNumber:        z.string().max(50).optional(),
  edition:            z.string().max(100).optional().nullable(),
  coverImage:         z.string().url('Must be a valid URL').optional().nullable(),
  thumbnail:          z.string().url('Must be a valid URL').optional().nullable(),
  coverImageAlt:      z.string().max(300).optional().nullable(),
  shortDescription:   z.string().max(1000).optional().nullable(),
  issueOverview:      z.string().optional().nullable(),
  coverStory:         z.string().optional().nullable(),
  coverStoryTitle:    z.string().max(300).optional().nullable(),
  featuredCraft:      z.string().max(200).optional().nullable(),
  featuredCraftName:  z.string().max(200).optional().nullable(),
  featuredCraftLabel: z.string().max(200).optional().nullable(),
  featureHighlights:  z.array(z.string().max(300)).max(10).optional(),
  status:             z.enum(ALLOWED_STATUSES).optional(),
  visibility:         z.enum(ALLOWED_VISIBILITIES).optional(),
  downloadable:       z.boolean().optional(),
  readerAssetKey:     z.string().optional().nullable(),
  pdfUrl:             z.string().optional().nullable(),
  scheduledFor:       z.string().datetime({ offset: true }).optional().nullable(),
  publishedAt:        z.string().datetime({ offset: true }).optional().nullable(),
  publicationMasthead: z.string().max(200).optional().nullable(),
  heroKicker:         z.string().max(300).optional().nullable(),
  heroEyebrow:        z.string().max(200).optional().nullable(),
  heroFooterLine:     z.string().max(300).optional().nullable(),
  heroOverlayStrength: z.enum(['LIGHT', 'MEDIUM', 'STRONG']).optional().nullable(),
  heroTextPosition:   z.enum(['BOTTOM_LEFT', 'CENTER', 'BOTTOM_CENTER', 'TOP_LEFT']).optional().nullable(),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function generateUniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base;
  let suffix = 0;
  while (true) {
    const existing = await prisma.magazineIssue.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
}

async function generateNextIssueNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.magazineIssue.count();
  const seq = String(count + 1).padStart(3, '0');
  return `KHCRF-MI-${year}-${seq}`;
}

function getUser(req: Request): any {
  return (req as any).user ?? null;
}

// ─── PUBLIC: List (published + non-hidden only) ───────────────────────────────
export const getMagazineIssues = async (req: Request, res: Response) => {
  try {
    const { visibility } = req.query;
    const visibilityFilter = visibility === 'PUBLIC'
      ? 'PUBLIC'
      : undefined;

    const issues = await prisma.magazineIssue.findMany({
      where: {
        status:     'PUBLISHED',
        visibility: visibilityFilter ? 'PUBLIC' : { not: 'HIDDEN' },
      },
      orderBy: [
        { publishedAt: 'desc' },
        { createdAt: 'desc' },
      ],
      select: {
        id:                true,
        issueNumber:       true,
        title:             true,
        subtitle:          true,
        slug:              true,
        coverImage:        true,
        thumbnail:         true,
        coverImageAlt:     true,
        edition:           true,
        shortDescription:  true,
        featuredCraft:     true,
        featuredCraftName: true,
        featureHighlights: true,
        status:            true,
        visibility:        true,
        publishedAt:       true,
        downloadable:      true,
        publicationMasthead: true,
        heroKicker:        true,
        heroEyebrow:       true,
        heroFooterLine:    true,
        heroOverlayStrength: true,
        heroTextPosition:  true,
        createdAt:         true,
      },
    });

    res.json(issues);
  } catch (error) {
    console.error('[MagazineIssue] getMagazineIssues error:', error);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
};

// ─── ADMIN: List (all statuses) ───────────────────────────────────────────────
export const getAdminMagazineIssues = async (req: Request, res: Response) => {
  try {
    const { status, visibility, search } = req.query;

    const where: any = {};
    if (status)     where.status     = status;
    if (visibility) where.visibility = visibility;
    if (search)     where.title      = { contains: String(search), mode: 'insensitive' };

    const issues = await prisma.magazineIssue.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(issues);
  } catch (error) {
    console.error('[MagazineIssue] getAdminMagazineIssues error:', error);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
};

// ─── PUBLIC: Issue detail by slug ────────────────────────────────────────────
export const getMagazineIssueBySlug = async (req: Request, res: Response) => {
  try {
    const slug = requireString(req.params.slug);
    const user = getUser(req);
    const isAdmin = user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'SYSTEM_ADMIN' || user.isAdmin);

    const issue = await prisma.magazineIssue.findUnique({ where: { slug } });
    if (!issue) return res.status(404).json({ error: 'Issue not found' });

    // Non-admins cannot see drafts/archived via public slug route
    if (!isAdmin && issue.status !== 'PUBLISHED') {
      return res.status(404).json({ error: 'Issue not found' });
    }
    if (!isAdmin && issue.visibility === 'HIDDEN') {
      return res.status(404).json({ error: 'Issue not found' });
    }

    // Strip internal delivery key from public response
    const { readerAssetKey: _key, ...publicIssue } = issue as any;
    res.json(publicIssue);
  } catch (error) {
    console.error('[MagazineIssue] getMagazineIssueBySlug error:', error);
    res.status(500).json({ error: 'Failed to fetch issue' });
  }
};

// ─── ACCESS CHECK ─────────────────────────────────────────────────────────────
export const checkIssueAccess = async (req: Request, res: Response) => {
  try {
    const slug = requireString(req.params.slug);
    const issue = await prisma.magazineIssue.findUnique({ where: { slug } });
    if (!issue) return res.status(404).json({ authorized: false, reason: 'ISSUE_NOT_FOUND' });

    const user = getUser(req);
    const isAdmin = user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'SYSTEM_ADMIN' || user.isAdmin);

    // 1. Admin Role Precedence
    if (isAdmin) {
      return res.json({ authorized: true, reason: 'ADMIN_AUTHORIZED', isAdmin: true, requiresMembership: false });
    }

    // 2. Issue publication and visibility checks
    if (issue.status !== 'PUBLISHED') {
      return res.status(404).json({ authorized: false, reason: 'ISSUE_NOT_PUBLISHED' });
    }
    if (issue.visibility === 'HIDDEN') {
      return res.status(404).json({ authorized: false, reason: 'ISSUE_HIDDEN' }); // Return 404 to match getMagazineIssueBySlug behavior
    }

    // 3. Public issue access
    if (issue.visibility === 'PUBLIC') {
      return res.json({ authorized: true, isPublic: true, requiresMembership: false });
    }

    // 4 & 5. Membership evaluation (MEMBERS_ONLY path)
    if (!user) {
      return res.status(401).json({ authorized: false, reason: 'UNAUTHENTICATED' });
    }

    const member = await prisma.member.findUnique({
      where: { userId: user.userId || user.id },
    });

    if (!member) return res.status(403).json({ authorized: false, reason: 'NO_MEMBERSHIP_RECORD' });

    // Enforce the strict state machine:
    // Application phase
    if (member.applicationStatus === 'REJECTED') return res.status(403).json({ authorized: false, reason: 'MEMBERSHIP_REJECTED' });
    if (member.applicationStatus === 'WITHDRAWN') return res.status(403).json({ authorized: false, reason: 'MEMBERSHIP_WITHDRAWN' });
    if (member.applicationStatus !== 'APPROVED') return res.status(403).json({ authorized: false, reason: 'MEMBERSHIP_APPROVAL_REQUIRED' });

    // Membership phase (Only evaluate if Application = APPROVED)
    if (member.membershipStatus === 'EXPIRED') return res.status(403).json({ authorized: false, reason: 'MEMBERSHIP_EXPIRED' });
    if (member.membershipStatus === 'SUSPENDED') return res.status(403).json({ authorized: false, reason: 'MEMBERSHIP_SUSPENDED' });
    if (member.membershipStatus === 'REVOKED') return res.status(403).json({ authorized: false, reason: 'MEMBERSHIP_REVOKED' });
    if (member.membershipStatus !== 'ACTIVE') return res.status(403).json({ authorized: false, reason: 'MEMBERSHIP_INACTIVE' });

    if (!member.permissions?.includes('MAGAZINE_ACCESS')) {
      return res.status(403).json({ authorized: false, reason: 'MAGAZINE_PERMISSION_DENIED' });
    }

    return res.json({ authorized: true, requiresMembership: true });
  } catch (error) {
    console.error('[MagazineIssue] checkIssueAccess error:', error);
    res.status(500).json({ authorized: false, reason: 'SERVER_ERROR' });
  }
};

// ─── ADMIN: Deliver reader content (signed) ───────────────────────────────────
export const getIssueReaderContent = async (req: Request, res: Response) => {
  try {
    const slug = requireString(req.params.slug);
    const user = getUser(req);
    const isAdmin = user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'SYSTEM_ADMIN' || user.isAdmin);

    const issue = await prisma.magazineIssue.findUnique({ where: { slug } });
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    // Prevent IDOR for non-admins
    if (!isAdmin) {
      if (issue.status !== 'PUBLISHED' || issue.visibility === 'HIDDEN') {
        return res.status(404).json({ error: 'Issue not found' });
      }
    }

    // Enforce membership for MEMBERS_ONLY issues
    if (issue.visibility === 'MEMBERS_ONLY' && !isAdmin) {
      if (!user) return res.status(401).json({ error: 'Unauthenticated' });
      const member = await prisma.member.findUnique({
        where: { userId: user.userId || user.id },
      });
      const hasAccess = member?.applicationStatus === 'APPROVED'
        && member?.membershipStatus === 'ACTIVE'
        && member?.permissions?.includes('MAGAZINE_ACCESS');
      if (!hasAccess) {
        return res.status(403).json({ error: 'Membership required' });
      }
    }

    if (!issue.readerAssetKey) {
      return res.status(404).json({ error: 'Reader content not available for this issue' });
    }

    // Return the asset URL — in production this would be a short-lived signed URL
    res.json({
      pdfUrl: issue.readerAssetKey,
      downloadable: issue.downloadable,
      title: issue.title,
      issueNumber: issue.issueNumber,
    });
  } catch (error) {
    console.error('[MagazineIssue] getIssueReaderContent error:', error);
    res.status(500).json({ error: 'Failed to load reader content' });
  }
};

// ─── ADMIN: Create ────────────────────────────────────────────────────────────
export const createMagazineIssue = async (req: Request, res: Response) => {
  try {
    const parsed = issueWriteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
    }

    const data = parsed.data;

    // Auto-generate slug if not provided
    const baseSlug = data.slug ?? generateSlug(data.title);
    const slug = await generateUniqueSlug(baseSlug);

    // Auto-generate issue number if not provided
    const issueNumber = data.issueNumber ?? await generateNextIssueNumber();

    // Ensure issue number is unique
    const existingByNum = await prisma.magazineIssue.findUnique({ where: { issueNumber } });
    if (existingByNum) {
      return res.status(409).json({ error: `Issue number "${issueNumber}" already exists` });
    }

    const issue = await prisma.magazineIssue.create({
      data: {
        ...data,
        slug,
        issueNumber,
        status:     data.status     ?? 'DRAFT',
        visibility: data.visibility ?? 'MEMBERS_ONLY',
        publishedAt: data.status === 'PUBLISHED' ? (data.publishedAt ? new Date(data.publishedAt) : new Date()) : null,
      },
    });

    res.status(201).json(issue);
  } catch (error) {
    console.error('[MagazineIssue] createMagazineIssue error:', error);
    res.status(500).json({ error: 'Failed to create issue' });
  }
};

// ─── ADMIN: Update ────────────────────────────────────────────────────────────
export const updateMagazineIssue = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);

    const existing = await prisma.magazineIssue.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Issue not found' });

    const parsed = issueWriteSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
    }

    const data = parsed.data;

    // If slug is changing, ensure new slug is unique
    if (data.slug && data.slug !== existing.slug) {
      const slugConflict = await prisma.magazineIssue.findUnique({ where: { slug: data.slug } });
      if (slugConflict) return res.status(409).json({ error: `Slug "${data.slug}" already exists` });
    }

    // If issueNumber is changing, ensure new issueNumber is unique
    if (data.issueNumber && data.issueNumber !== existing.issueNumber) {
      const numConflict = await prisma.magazineIssue.findUnique({ where: { issueNumber: data.issueNumber } });
      if (numConflict) return res.status(409).json({ error: `Issue number "${data.issueNumber}" already exists` });
    }

    const issue = await prisma.magazineIssue.update({
      where: { id },
      data: {
        ...data,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
      },
    });

    res.json(issue);
  } catch (error) {
    console.error('[MagazineIssue] updateMagazineIssue error:', error);
    res.status(500).json({ error: 'Failed to update issue' });
  }
};

// ─── ADMIN: Publish ───────────────────────────────────────────────────────────
export const publishMagazineIssue = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    const existing = await prisma.magazineIssue.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Issue not found' });

    const allowed = VALID_TRANSITIONS[existing.status] ?? [];
    if (!allowed.includes('PUBLISHED')) {
      return res.status(409).json({
        error: `Cannot publish from "${existing.status}". Valid transitions: ${allowed.join(', ') || 'none'}.`,
      });
    }

    const issue = await prisma.magazineIssue.update({
      where: { id },
      data: { status: 'PUBLISHED', publishedAt: new Date() },
    });

    res.json(issue);
  } catch (error) {
    console.error('[MagazineIssue] publishMagazineIssue error:', error);
    res.status(500).json({ error: 'Failed to publish issue' });
  }
};

// ─── ADMIN: Archive ───────────────────────────────────────────────────────────
export const archiveMagazineIssue = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    const existing = await prisma.magazineIssue.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Issue not found' });

    const allowed = VALID_TRANSITIONS[existing.status] ?? [];
    if (!allowed.includes('ARCHIVED')) {
      return res.status(409).json({
        error: `Cannot archive from "${existing.status}". Only PUBLISHED issues can be archived.`,
      });
    }

    const issue = await prisma.magazineIssue.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });

    res.json(issue);
  } catch (error) {
    console.error('[MagazineIssue] archiveMagazineIssue error:', error);
    res.status(500).json({ error: 'Failed to archive issue' });
  }
};

// ─── ADMIN: Submit for review ─────────────────────────────────────────────────
export const submitMagazineIssueForReview = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    const existing = await prisma.magazineIssue.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Issue not found' });

    const allowed = VALID_TRANSITIONS[existing.status] ?? [];
    if (!allowed.includes('REVIEW')) {
      return res.status(409).json({
        error: `Cannot submit for review from "${existing.status}".`,
      });
    }

    const issue = await prisma.magazineIssue.update({
      where: { id },
      data: { status: 'REVIEW' },
    });
    res.json(issue);
  } catch (error) {
    console.error('[MagazineIssue] submitForReview error:', error);
    res.status(500).json({ error: 'Failed to submit for review' });
  }
};

// ─── ADMIN: Duplicate ─────────────────────────────────────────────────────────
export const duplicateMagazineIssue = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    const source = await prisma.magazineIssue.findUnique({ where: { id } });
    if (!source) return res.status(404).json({ error: 'Issue not found' });

    const baseSlug = `${source.slug}-copy`;
    const newSlug = await generateUniqueSlug(baseSlug);
    const newIssueNumber = await generateNextIssueNumber();

    const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = source as any;

    const duplicate = await prisma.magazineIssue.create({
      data: {
        ...rest,
        slug:        newSlug,
        issueNumber: newIssueNumber,
        title:       `${source.title} (Copy)`,
        status:      'DRAFT',
        publishedAt: null,
      },
    });

    res.status(201).json(duplicate);
  } catch (error) {
    console.error('[MagazineIssue] duplicateMagazineIssue error:', error);
    res.status(500).json({ error: 'Failed to duplicate issue' });
  }
};

// ─── ADMIN: Delete ────────────────────────────────────────────────────────────
export const deleteMagazineIssue = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    const existing = await prisma.magazineIssue.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Issue not found' });

    await prisma.magazineIssue.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('[MagazineIssue] deleteMagazineIssue error:', error);
    res.status(500).json({ error: 'Failed to delete issue' });
  }
};
