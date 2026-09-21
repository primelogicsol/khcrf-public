import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { requireString } from "../utils/routeHelpers";

// Helper to calculate SHA256 checksum of local file
const getFileChecksum = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', data => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', err => reject(err));
  });
};

// Helper to log audit events
const logDashboardAudit = async (req: Request, action: string, recordId: string, notes: string, prev: any = null, nextVal: any = null) => {
  try {
    const user = (req as any).user;
    await prisma.dashboardAuditLog.create({
      data: {
        module: 'Stakeholder Registry',
        recordType: 'Download Center Resource',
        recordId,
        action,
        previousValue: prev ? JSON.stringify(prev) : null,
        newValue: nextVal ? JSON.stringify(nextVal) : null,
        notes,
        performedById: user?.id || null,
        performedByEmail: user?.email || null,
        performedByRole: user?.role || null,
        ipAddress: req.ip || null,
        userAgent: req.headers['user-agent'] || null,
      }
    });
  } catch (err) {
    console.error('logDashboardAudit error:', err);
  }
};

// ==========================================
// PUBLIC CONTROLLERS
// ==========================================

// GET /api/skc/stakeholder-registry/resources - Get active public resources
export const getStakeholderRegistryResources = async (req: Request, res: Response) => {
  try {
    const { search, category, documentType, language, sort } = req.query;

    const whereClause: any = {
      status: 'ACTIVE',
      isPublic: true,
    };

    if (category && category !== 'all') {
      whereClause.category = category as string;
    }
    if (documentType && documentType !== 'all') {
      whereClause.documentType = documentType as string;
    }
    if (language && language !== 'all') {
      whereClause.language = language as string;
    }

    if (search && typeof search === 'string' && search.trim()) {
      const term = search.trim();
      whereClause.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { shortDescription: { contains: term, mode: 'insensitive' } },
        { category: { contains: term, mode: 'insensitive' } },
        { documentType: { contains: term, mode: 'insensitive' } },
      ];
    }

    let orderBy: any = { displayOrder: 'asc' };
    if (sort === 'latest') {
      orderBy = { publicationDate: 'desc' };
    } else if (sort === 'alphabetical') {
      orderBy = { title: 'asc' };
    }

    const resources = await prisma.skcRegistryResource.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        longDescription: true,
        category: true,
        documentType: true,
        version: true,
        status: true,
        language: true,
        fileUrl: true,
        mimeType: true,
        fileSizeBytes: true,
        publicationDate: true,
        effectiveDate: true,
        lastUpdatedAt: true,
        displayOrder: true,
        isFeatured: true,
        downloadCount: true,
        viewCount: true,
      },
      orderBy,
    });

    return res.status(200).json({
      success: true,
      data: resources,
    });
  } catch (error: any) {
    console.error('getStakeholderRegistryResources error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// GET /api/skc/stakeholder-registry/resources/:slug - Get active public resource detail
export const getStakeholderRegistryResourceBySlug = async (req: Request, res: Response) => {
  try {
    const slug = requireString(req.params.slug);
    const resource = await prisma.skcRegistryResource.findFirst({
      where: {
        slug,
        status: 'ACTIVE',
        isPublic: true,
      }
    });

    if (!resource) {
      return res.status(404).json({ success: false, message: 'This document is not currently available.' });
    }

    // Increment view counter
    await prisma.skcRegistryResource.update({
      where: { id: resource.id },
      data: { viewCount: { increment: 1 } }
    });

    return res.status(200).json({
      success: true,
      data: resource
    });
  } catch (error: any) {
    console.error('getStakeholderRegistryResourceBySlug error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// GET /api/skc/stakeholder-registry/resources/:slug/download - Stream/download the PDF
export const downloadStakeholderRegistryResource = async (req: Request, res: Response) => {
  try {
    const slug = requireString(req.params.slug);
    const resource = await prisma.skcRegistryResource.findFirst({
      where: {
        slug,
        status: 'ACTIVE',
      }
    });

    if (!resource) {
      return res.status(404).json({ success: false, message: 'This document is temporarily unavailable.' });
    }

    const storageKey = resource.storageKey;
    if (!storageKey) {
      return res.status(404).json({ success: false, message: 'This document is temporarily unavailable.' });
    }

    // Resolve file path
    const filePath = path.join(process.cwd(), 'secure_uploads', storageKey);
    if (!fs.existsSync(filePath)) {
      console.error(`downloadStakeholderRegistryResource: File not found at path: ${filePath}`);
      return res.status(404).json({ success: false, message: 'This document is temporarily unavailable.' });
    }

    // Increment download counter
    await prisma.skcRegistryResource.update({
      where: { id: resource.id },
      data: { downloadCount: { increment: 1 } }
    });

    const publicFilename = resource.publicFilename || `${resource.slug}.pdf`;
    res.setHeader('Content-Type', resource.mimeType || 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${publicFilename}"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error: any) {
    console.error('downloadStakeholderRegistryResource error:', error);
    return res.status(500).json({ success: false, message: 'We could not download this document. Please try again shortly.' });
  }
};

// ==========================================
// ADMIN CONTROLLERS
// ==========================================

// GET /api/skc/admin/stakeholder-registry/resources - Admin view all resources
export const adminGetRegistryResources = async (req: Request, res: Response) => {
  try {
    const { search, category, status } = req.query;
    const whereClause: any = {};

    if (category && category !== 'all') {
      whereClause.category = category as string;
    }
    if (status && status !== 'all') {
      whereClause.status = status as string;
    }
    if (search && typeof search === 'string' && search.trim()) {
      const term = search.trim();
      whereClause.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { shortDescription: { contains: term, mode: 'insensitive' } },
        { slug: { contains: term, mode: 'insensitive' } },
      ];
    }

    const resources = await prisma.skcRegistryResource.findMany({
      where: whereClause,
      orderBy: [
        { displayOrder: 'asc' },
        { updatedAt: 'desc' }
      ]
    });

    // Also get the versions history for each resource to return metadata
    const enrichedResources = await Promise.all(
      resources.map(async (r) => {
        const versions = await prisma.skcRegistryResourceVersion.findMany({
          where: { resourceId: r.id },
          orderBy: { createdAt: 'desc' }
        });
        return {
          ...r,
          versions,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: enrichedResources
    });
  } catch (error: any) {
    console.error('adminGetRegistryResources error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// POST /api/skc/admin/stakeholder-registry/resources - Admin create new resource
export const adminCreateRegistryResource = async (req: Request, res: Response) => {
  try {
    const {
      title,
      slug,
      shortDescription,
      longDescription,
      category,
      documentType,
      version,
      status,
      language,
      displayOrder,
      isFeatured,
      isPublic,
      fileUrl,
      storageKey,
      originalFilename,
      publicFilename,
      mimeType,
      fileSizeBytes,
      checksum,
      publicationDate,
      effectiveDate,
      expiryDate
    } = req.body;

    const user = (req as any).user;

    // Check slug uniqueness
    const existing = await prisma.skcRegistryResource.findUnique({ where: { slug } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A resource with this slug already exists.' });
    }

    const defaultPublicFilename = publicFilename || `HCRF_Stakeholder_Registry_${title.replace(/ /g, '_')}_${version}.pdf`;

    const resource = await prisma.skcRegistryResource.create({
      data: {
        title,
        slug,
        shortDescription,
        longDescription,
        category,
        documentType,
        version,
        status,
        language: language || 'en',
        fileUrl,
        storageKey,
        originalFilename,
        publicFilename: defaultPublicFilename,
        mimeType: mimeType || 'application/pdf',
        fileSizeBytes: fileSizeBytes ? parseInt(fileSizeBytes, 10) : null,
        checksum,
        publicationDate: publicationDate ? new Date(publicationDate) : new Date(),
        effectiveDate: effectiveDate ? new Date(effectiveDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        displayOrder: displayOrder ? parseInt(displayOrder, 10) : 0,
        isFeatured: !!isFeatured,
        isPublic: !!isPublic,
        createdBy: user?.email || 'admin',
        updatedBy: user?.email || 'admin',
        lastUpdatedAt: new Date(),
      }
    });

    // Create the first version record
    await prisma.skcRegistryResourceVersion.create({
      data: {
        resourceId: resource.id,
        title: resource.title,
        version: resource.version,
        status: resource.status,
        fileUrl: resource.fileUrl,
        storageKey: resource.storageKey,
        originalFilename: resource.originalFilename,
        publicFilename: resource.publicFilename,
        mimeType: resource.mimeType,
        fileSizeBytes: resource.fileSizeBytes,
        checksum: resource.checksum,
        createdBy: user?.email || 'admin',
        notes: 'Initial publication'
      }
    });

    await logDashboardAudit(req, 'CREATE', resource.id, `Created resource: ${resource.title} v${resource.version}`, null, resource);

    return res.status(201).json({
      success: true,
      data: resource
    });
  } catch (error: any) {
    console.error('adminCreateRegistryResource error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// PUT /api/skc/admin/stakeholder-registry/resources/:id - Admin update resource or push new version
export const adminUpdateRegistryResource = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    const {
      title,
      slug,
      shortDescription,
      longDescription,
      category,
      documentType,
      version,
      status,
      language,
      displayOrder,
      isFeatured,
      isPublic,
      fileUrl,
      storageKey,
      originalFilename,
      publicFilename,
      mimeType,
      fileSizeBytes,
      checksum,
      publicationDate,
      effectiveDate,
      expiryDate,
      versionNotes
    } = req.body;

    const user = (req as any).user;

    const resource = await prisma.skcRegistryResource.findUnique({ where: { id } });
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    const versionChanged = version && version !== resource.version;

    // Check slug uniqueness if slug changed
    if (slug && slug !== resource.slug) {
      const existingSlug = await prisma.skcRegistryResource.findUnique({ where: { slug } });
      if (existingSlug) {
        return res.status(400).json({ success: false, message: 'A resource with this slug already exists.' });
      }
    }

    const oldData = { ...resource };

    // If version changed, we archive the old version first
    if (versionChanged) {
      // 1. Write the old active version to the versions log as SUPERSEDED or active archive
      await prisma.skcRegistryResourceVersion.create({
        data: {
          resourceId: resource.id,
          title: resource.title,
          version: resource.version,
          status: 'SUPERSEDED',
          fileUrl: resource.fileUrl,
          storageKey: resource.storageKey,
          originalFilename: resource.originalFilename,
          publicFilename: resource.publicFilename,
          mimeType: resource.mimeType,
          fileSizeBytes: resource.fileSizeBytes,
          checksum: resource.checksum,
          createdBy: resource.updatedBy,
          notes: versionNotes || `Superseded by v${version}`
        }
      });
    }

    const defaultPublicFilename = publicFilename || (fileUrl ? `HCRF_Stakeholder_Registry_${title.replace(/ /g, '_')}_${version || resource.version}.pdf` : resource.publicFilename);

    const updatedResource = await prisma.skcRegistryResource.update({
      where: { id },
      data: {
        title: title !== undefined ? title : resource.title,
        slug: slug !== undefined ? slug : resource.slug,
        shortDescription: shortDescription !== undefined ? shortDescription : resource.shortDescription,
        longDescription: longDescription !== undefined ? longDescription : resource.longDescription,
        category: category !== undefined ? category : resource.category,
        documentType: documentType !== undefined ? documentType : resource.documentType,
        version: version !== undefined ? version : resource.version,
        status: status !== undefined ? status : resource.status,
        language: language !== undefined ? language : resource.language,
        fileUrl: fileUrl !== undefined ? fileUrl : resource.fileUrl,
        storageKey: storageKey !== undefined ? storageKey : resource.storageKey,
        originalFilename: originalFilename !== undefined ? originalFilename : resource.originalFilename,
        publicFilename: defaultPublicFilename,
        mimeType: mimeType !== undefined ? mimeType : resource.mimeType,
        fileSizeBytes: fileSizeBytes !== undefined ? (fileSizeBytes ? parseInt(fileSizeBytes, 10) : null) : resource.fileSizeBytes,
        checksum: checksum !== undefined ? checksum : resource.checksum,
        publicationDate: publicationDate !== undefined ? (publicationDate ? new Date(publicationDate) : null) : resource.publicationDate,
        effectiveDate: effectiveDate !== undefined ? (effectiveDate ? new Date(effectiveDate) : null) : resource.effectiveDate,
        expiryDate: expiryDate !== undefined ? (expiryDate ? new Date(expiryDate) : null) : resource.expiryDate,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder, 10) : resource.displayOrder,
        isFeatured: isFeatured !== undefined ? !!isFeatured : resource.isFeatured,
        isPublic: isPublic !== undefined ? !!isPublic : resource.isPublic,
        updatedBy: user?.email || 'admin',
        lastUpdatedAt: new Date(),
      }
    });

    // If version changed, write the new active version to the versions log
    if (versionChanged) {
      await prisma.skcRegistryResourceVersion.create({
        data: {
          resourceId: updatedResource.id,
          title: updatedResource.title,
          version: updatedResource.version,
          status: updatedResource.status,
          fileUrl: updatedResource.fileUrl,
          storageKey: updatedResource.storageKey,
          originalFilename: updatedResource.originalFilename,
          publicFilename: updatedResource.publicFilename,
          mimeType: updatedResource.mimeType,
          fileSizeBytes: updatedResource.fileSizeBytes,
          checksum: updatedResource.checksum,
          createdBy: user?.email || 'admin',
          notes: versionNotes || `Updated to version ${version}`
        }
      });
    }

    await logDashboardAudit(req, 'UPDATE', updatedResource.id, `Updated resource metadata ${versionChanged ? `(New version v${version})` : ''}`, oldData, updatedResource);

    return res.status(200).json({
      success: true,
      data: updatedResource
    });
  } catch (error: any) {
    console.error('adminUpdateRegistryResource error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// DELETE /api/skc/admin/stakeholder-registry/resources/:id - Archive or delete resource
export const adminDeleteRegistryResource = async (req: Request, res: Response) => {
  try {
    const id = requireString(req.params.id);
    const resource = await prisma.skcRegistryResource.findUnique({ where: { id } });
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    // Instead of hard deleting, we archive the resource status
    const updated = await prisma.skcRegistryResource.update({
      where: { id },
      data: {
        status: 'ARCHIVED',
        isPublic: false,
      }
    });

    await logDashboardAudit(req, 'ARCHIVE', id, `Archived resource: ${resource.title}`, resource, updated);

    return res.status(200).json({
      success: true,
      message: 'Resource archived successfully.',
      data: updated
    });
  } catch (error: any) {
    console.error('adminDeleteRegistryResource error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// POST /api/skc/admin/stakeholder-registry/resources/upload - Handle file upload and checksum calculation
export const adminUploadResourceFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const file = req.file;
    const storageKey = file.filename;
    
    // In our disk config, the local public download URL is served relative to backend uploads or streamed via download API.
    // Streamed download matches the requirement "Do not store files only in the frontend public folder if the dashboard must replace them dynamically".
    // We stream it through /api/skc/stakeholder-registry/resources/:slug/download.
    // So the fileUrl is exactly this downloadable stream route.
    const fileUrl = `/api/skc/stakeholder-registry/resources/download-file/${storageKey}`; 

    const filePath = path.join(process.cwd(), 'secure_uploads', storageKey);
    const checksum = await getFileChecksum(filePath);

    return res.status(200).json({
      success: true,
      data: {
        fileUrl,
        storageKey,
        originalFilename: file.originalname,
        mimeType: file.mimetype,
        fileSizeBytes: file.size,
        checksum,
      }
    });
  } catch (error: any) {
    console.error('adminUploadResourceFile error:', error);
    return res.status(500).json({ success: false, message: 'File upload failed' });
  }
};
