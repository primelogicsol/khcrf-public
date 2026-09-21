import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { PublicationModule } from '../domain/publication/module.js';
import { requireString } from "../utils/routeHelpers";

export const getAllPublications = async (req: Request, res: Response) => {
    try {
        const { category, author } = req.query;
        
        const pubModule = PublicationModule.getInstance();
        const enableCanonical = await pubModule.featureFlags.getFlag('enableCanonicalPublicReads');
        
        if (enableCanonical) {
            const aggregates = await pubModule.repository.findPublicationCards({
                categoryId: category ? String(category) : undefined,
                searchTerm: author ? String(author) : undefined,
                visibility: 'PUBLIC'
            });
            const dtos = pubModule.projectionService.projectPublicCards(aggregates);
            return res.json(dtos);
        }

        // Legacy Fallback Path
        const where: any = {};
        
        if (category) where.category = String(category);
        if (author) where.author = { contains: String(author), mode: 'insensitive' };

        const publications = await prisma.publication.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
        res.json(publications);
    } catch (error: any) {
        if (error.name === 'ZodError') {
            console.error("DTO Validation Failed (ZodError):", error.errors);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
                correlationId: req.headers['x-request-id'] || 'req-id-placeholder'
            });
        }
        console.error("Get Publications Error:", error);
        res.status(500).json({ error: "Failed to fetch publications" });
    }
};

function normalizeContent(content: unknown): any[] {
  if (!content) return [];

  if (Array.isArray(content)) return content;

  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
      return [parsed];
    } catch {
      return content
        .split(/\n{2,}/)
        .map((p) => ({ type: "paragraph", text: p.trim() }))
        .filter((p) => p.text);
    }
  }

  if (typeof content === "object") return [content];

  return [];
}

export const getPublication = async (req: Request, res: Response) => {
    try {
        const slug = requireString(req.params.slug);
        if (!slug) {
            return res.status(400).json({
                success: false,
                error: "Publication slug is required"
            });
        }

        const pubModule = PublicationModule.getInstance();
        const enableCanonical = await pubModule.featureFlags.getFlag('enableCanonicalPublicReads');

        if (enableCanonical) {
            const aggregate = await pubModule.repository.findPublicPublicationBySlug(slug);
            if (!aggregate) {
                return res.status(404).json({ success: false, error: "Publication not found" });
            }
            try {
                const dto = pubModule.projectionService.projectCanonicalPublication(aggregate);
                return res.json(dto);
            } catch (err: any) {
                if (err.name === 'PublicationNotVisibleError') {
                    // Fail identically to a 404 to avoid leaking editorial state
                    return res.status(404).json({ success: false, error: "Publication not found" });
                }
                // Let other errors fall through to the 500 handler
                throw err;
            }
        }

        // Legacy Fallback Path
        const publication = await prisma.publication.findUnique({
            where: { slug },
            include: {
                chapters: {
                    orderBy: { order: 'asc' },
                    include: {
                        pages: {
                            orderBy: { pageNumber: 'asc' }
                        }
                    }
                },
                reviews: {
                    where: { status: "Approved" },
                    orderBy: [
                        { isExpert: 'desc' },
                        { createdAt: 'desc' }
                    ]
                }
            }
        });

        if (!publication) {
            return res.status(404).json({
                success: false,
                error: "Publication not found"
            });
        }

        const chapters = Array.isArray(publication.chapters) ? publication.chapters.map(chapter => {
            if (!chapter) return chapter;
            const pages = Array.isArray(chapter.pages) ? chapter.pages.map(page => {
                if (!page) return page;
                return {
                    ...page,
                    content: normalizeContent(page.content)
                };
            }) : [];
            return {
                ...chapter,
                pages
            };
        }) : [];

        const normalizedPublication = {
            ...publication,
            chapters
        };

        res.json(normalizedPublication);
    } catch (error) {
        console.error("Publication details failed:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to load publication details",
            errorName: error?.name,
            errorMessage: error?.message,
            errorStack: error?.stack
        });
    }
};

export const getPublicationContent = async (req: Request, res: Response) => {
    try {
        const slug = requireString(req.params.slug);
        const user = (req as any).user;

        const publication = await prisma.publication.findUnique({
            where: { slug },
            include: {
                chapters: {
                    orderBy: { order: 'asc' },
                    include: {
                        pages: {
                            orderBy: { pageNumber: 'asc' }
                        }
                    }
                }
            }
        });

        if (!publication) {
            return res.status(404).json({ success: false, error: "Publication not found" });
        }

        const currentMeta = typeof publication.metadata === 'string' ? JSON.parse(publication.metadata) : (publication.metadata || {});
        const accessType = currentMeta.access_tier || publication.accessType || 'PUBLIC';

        // Admins and staff have automatic override
        const isAdminOrStaff = user && (user.isAdmin || user.role === 'ADMIN' || user.role?.startsWith('MODERATOR_') || user.role?.startsWith('COLLABORATOR_'));

        if (!isAdminOrStaff) {
            if (accessType === 'MEMBER' || accessType === 'APPROVED_MEMBER_ACCESS') {
                const { getPublicationAccessState } = await import('../utils/authorization.js');
                let membership = null;
                if (user) {
                    membership = await (prisma as any).member.findUnique({
                        where: { userId: user.id }
                    });
                }
                const canRead = getPublicationAccessState(user, membership);
                if (!canRead) {
                    return res.status(403).json({
                        success: false,
                        error: "Access denied. Approved membership required."
                    });
                }
            } else if (accessType === 'REGISTERED' || accessType === 'REGISTERED_USER') {
                if (!user) {
                    return res.status(401).json({
                        success: false,
                        error: "Access denied. Authentication required."
                    });
                }
            }
        }

        res.json(publication);
    } catch (error) {
        console.error("Error fetching publication content:", error);
        res.status(500).json({ success: false, error: "Failed to fetch publication content" });
    }
};

export const getPublicationById = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Publication ID is required"
            });
        }

        const publication = await prisma.publication.findUnique({
            where: { id },
            include: {
                chapters: {
                    orderBy: { order: 'asc' },
                    include: {
                        pages: {
                            orderBy: { pageNumber: 'asc' }
                        }
                    }
                },
                reviews: {
                    where: { status: "Approved" },
                    orderBy: [
                        { isExpert: 'desc' },
                        { createdAt: 'desc' }
                    ]
                }
            }
        });

        if (!publication) {
            return res.status(404).json({
                success: false,
                error: "Publication not found"
            });
        }

        const chapters = Array.isArray(publication.chapters) ? publication.chapters.map(chapter => {
            if (!chapter) return chapter;
            const pages = Array.isArray(chapter.pages) ? chapter.pages.map(page => {
                if (!page) return page;
                return {
                    ...page,
                    content: normalizeContent(page.content)
                };
            }) : [];
            return {
                ...chapter,
                pages
            };
        }) : [];

        const normalizedPublication = {
            ...publication,
            chapters
        };

        res.json(normalizedPublication);
    } catch (error) {
        console.error("Publication details by ID failed:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to load publication details"
        });
    }
};

export const getMyLibrary = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const purchases = await prisma.userPurchase.findMany({
            where: { userId },
            include: {
                publication: true
            },
            orderBy: { purchaseDate: 'desc' }
        });

        const publications = purchases.map(p => ({
            ...p.publication,
            purchaseDate: p.purchaseDate
        }));

        res.json(publications);
    } catch (error) {
        console.error("Get Library Error:", error);
        res.status(500).json({ error: "Failed to fetch library" });
    }
};

// Toggle bookmark in personal library (reuses UserPurchase relation)
export const toggleBookmark = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { publicationId } = req.body;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!publicationId) {
            return res.status(400).json({ error: "Publication ID is required" });
        }

        const existing = await prisma.userPurchase.findUnique({
            where: {
                userId_publicationId: {
                    userId,
                    publicationId
                }
            }
        });

        if (existing) {
            await prisma.userPurchase.delete({
                where: {
                    userId_publicationId: {
                        userId,
                        publicationId
                    }
                }
            });
            return res.json({ bookmarked: false, message: "Removed from library" });
        } else {
            await prisma.userPurchase.create({
                data: {
                    userId,
                    publicationId,
                    amount: 0 // Default to 0 for bookmarks
                }
            });
            return res.json({ bookmarked: true, message: "Added to library" });
        }
    } catch (error) {
        console.error("Toggle Bookmark Error:", error);
        res.status(500).json({ error: "Failed to toggle bookmark" });
    }
};

// Check if user owns a book
export const checkAccess = async (req: Request, res: Response) => {
    try {
        const slug = requireString(req.params.slug);
        const userId = (req as any).user?.userId;

        const publication = await prisma.publication.findUnique({
            where: { slug }
        });

        if (!publication) {
            return res.status(404).json({ error: "Book not found" });
        }

        const currentMeta = typeof publication.metadata === 'string' ? JSON.parse(publication.metadata) : (publication.metadata || {});
        const accessType = currentMeta.access_tier || publication.accessType || 'PUBLIC';

        // PUBLIC access is open to all users
        if (accessType === 'PUBLIC') {
            return res.json({ hasAccess: true, state: "APPROVED" });
        }

        // REGISTERED and MEMBER access require authentication
        if (!userId) {
            return res.json({ hasAccess: false, state: "NOT_AUTHENTICATED" });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.json({ hasAccess: false, state: "NOT_AUTHENTICATED" });
        }

        // Admins and staff have automatic override access to all content
        const isAdminOrStaff = 
            user.isAdmin || 
            user.role === 'ADMIN' || 
            user.role.startsWith('MODERATOR_') || 
            user.role.startsWith('COLLABORATOR_');

        if (isAdminOrStaff) {
            return res.json({ hasAccess: true, state: "APPROVED" });
        }

        if (accessType === 'REGISTERED' || accessType === 'REGISTERED_USER') {
            return res.json({ hasAccess: true, state: "APPROVED" });
        }

        if (accessType === 'MEMBER' || accessType === 'APPROVED_MEMBER_ACCESS') {
            const member = await (prisma as any).member.findUnique({
                where: { userId }
            });

            if (!member) {
                return res.json({ hasAccess: false, state: "NO_APPLICATION" });
            }

            let state = "NO_APPLICATION";
            const profile = member.profileData as any;
            if (profile?.workflowState) {
                state = profile.workflowState;
            } else {
                switch (member.status) {
                    case "APPROVED":
                        state = "APPROVED";
                        break;
                    case "PENDING":
                        state = "UNDER_REVIEW";
                        break;
                    case "REJECTED":
                        state = "DECLINED";
                        break;
                    case "EXPIRED":
                        state = "EXPIRED";
                        break;
                    default:
                        state = "NO_APPLICATION";
                }
            }

            return res.json({
                hasAccess: state === "APPROVED",
                state,
                submittedAt: member.createdAt || null
            });
        }

        res.json({ hasAccess: false, state: "NO_APPLICATION" });

    } catch (error) {
        console.error("Check Access Error:", error);
        res.status(500).json({ error: "Failed to check access" });
    }
}

export const seedPublications = async (req: Request, res: Response) => {
    const publicationsInfo = [
        {
            id: "bp-001",
            title: "Modern Craftsmanship",
            subtitle: "Integrating Traditional Skills with Digital Tools",
            author: "Sarah Jenkins",
            published: "2024",
            category: "Best Practices",
            price: 29.99,
            pages: 245,
            description: "A comprehensive guide to merging artisanal techniques with modern technology.",
            imagePath: "1.png",
            slug: "modern-craftsmanship",
            features: [
                "Learn how to integrate digital tools without losing artisanal soul",
                "Case studies from 50+ successful modern workshops",
                "Guide to sustainable sourcing in a global market",
                "Strategies for digital marketing and storytelling"
            ],
            language: "English",
            formats: ["PDF", "ePub", "Mobi"],
            tableOfContents: [
                "The Digital Artisan's Toolkit",
                "Preserving Heritage in Code",
                "Sustainable Sourcing 2.0",
                "Global Markets for Local Makers",
                "Case Study: The Smart Loom"
            ]
        },
        {
            id: "bp-002",
            title: "Sustainable Standards",
            subtitle: "Global Frameworks for Ethical Production",
            author: "Dr. Robert Chen",
            published: "2023",
            category: "Best Practices",
            price: 34.99,
            pages: 180,
            description: "Best practices for maintaining sustainability in large-scale craft production.",
            imagePath: "2.png",
            slug: "sustainable-standards-2023",
            features: [
                "Comprehensive framework for ethical production",
                "Waste reduction protocols for large workshops",
                "Certification pathways explained",
                "Supply chain transparency guide"
            ],
            language: "English",
            formats: ["PDF"],
            tableOfContents: [
                "Defining Ethical Production",
                "Supply Chain Transparency",
                "Waste Reduction Protocols",
                "Certification Pathways",
                "Measuring Impact"
            ]
        },
        {
            id: "rp-001",
            title: "The Economics of Craft",
            subtitle: "Global Market Trends 2025",
            author: "World Craft Council",
            published: "2024",
            category: "Research Papers",
            price: 150.00,
            pages: 80,
            description: "Statistical analysis and projections for the handmade goods sector.",
            imagePath: "13.png",
            slug: "economics-of-craft-2025",
            language: "English",
            formats: ["PDF"]
        }
    ];

    try {
        let count = 0;
        for (const pub of publicationsInfo) {
            const existing = await prisma.publication.findUnique({
                where: { slug: pub.slug }
            });

            if (!existing) {
                await prisma.publication.create({
                    data: {
                        id: pub.id,
                        title: pub.title,
                        subtitle: pub.subtitle,
                        author: pub.author,
                        published: pub.published,
                        category: pub.category,
                        price: pub.price,
                        pages: pub.pages,
                        description: pub.description,
                        imagePath: pub.imagePath,
                        slug: pub.slug,
                        features: pub.features ? JSON.stringify(pub.features) : undefined,
                        tableOfContents: pub.tableOfContents ? JSON.stringify(pub.tableOfContents) : undefined,
                        language: pub.language,
                        formats: pub.formats ? JSON.stringify(pub.formats) : undefined,
                    }
                });
                count++;
            }
        }
        res.json({ message: `Seeded ${count} publications` });
    } catch (error) {
        console.error("Seed Error:", error);
        res.status(500).json({ error: "Failed to seed" });
    }
};

export const createPublication = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;

        // Fallbacks for the new Manuscript Builder JSON payload vs legacy payload
        let title = req.body.title || req.body.publication_title || req.body.nested_state?.publication_title || req.body.metadata?.publication_title;
        let slug = req.body.slug || req.body.url_slug || req.body.nested_state?.url_slug || (title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now() : null);
        let author = req.body.author || req.body.publisher_name || req.body.nested_state?.publisher_name || "KHCRF Heritage Press";
        let category = req.body.category || req.body.publication_type || req.body.nested_state?.publication_type || "General";
        
        // Extract raw fields
        let {
            subtitle, published, price, pages, description, imagePath, features, tableOfContents,
            language, formats, type, pdfPath, categoryId, accessType, publicationType, isPublic, isMemberOnly,
            previewContent, fullContent, downloadUrl, memberDownloadUrl, citationEnabled, seoTitle, seoDescription, 
            structuredDataType, publishedStatus, metadata
        } = req.body;

        // Validation - Only require title
        if (!title) {
            return res.status(400).json({ 
                error: "Missing required fields", 
                missing: ["title"],
                receivedKeys: Object.keys(req.body) 
            });
        }

        const isPublishing = publishedStatus === 'PUBLISHED';
        if (!price) price = '0';
        if (isPublishing && !imagePath) {
            return res.status(400).json({ error: "A cover image is required before publishing" });
        }

        // Check if slug exists
        const existing = await prisma.publication.findUnique({ where: { slug } });
        if (existing) {
            return res.status(400).json({ error: "Slug already exists" });
        }

        // Logic to resolve Category ID if not provided but name is present
        if ((!categoryId || categoryId === "") && category) {
             try {
                const existingCat = await prisma.publicationCategory.findUnique({ where: { name: category } });
                if (existingCat) {
                    categoryId = existingCat.id;
                } else {
                    const newCat = await prisma.publicationCategory.create({
                        data: {
                            name: category,
                            slug: category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
                            description: 'Auto-created via upload'
                        }
                    });
                    categoryId = newCat.id;
                }
             } catch (err) {
                 console.warn("Category auto-creation failed, proceeding without link:", err);
                 categoryId = undefined;
             }
        }
        if (categoryId === "") categoryId = undefined;

        const userRecord = userId ? await prisma.user.findUnique({ where: { id: userId } }) : null;
        const isContributor = userRecord && userRecord.role !== 'USER' && userRecord.role !== 'ADMIN';

        // Safe defaults for non-nullable DB fields
        if (!published) published = String(new Date().getFullYear());
        if (!description) description = title;
        if (!imagePath) imagePath = "";

        // Properly stringify metadata payload
        let finalMetadata = null;
        if (req.body.nested_state) {
            finalMetadata = JSON.stringify(req.body.nested_state);
        } else if (metadata) {
            finalMetadata = typeof metadata === "string" ? metadata : JSON.stringify(metadata);
        } else {
            finalMetadata = JSON.stringify(req.body);
        }

        const publication = await prisma.publication.create({
            data: {
                title,
                subtitle,
                author,
                published,
                category,
                categoryId,
                price: parseFloat(price) || 0,
                pages: parseInt(pages) || 0,
                description,
                imagePath,
                slug,
                features: features ? (typeof features === 'string' ? features : JSON.stringify(features)) : undefined,
                tableOfContents: tableOfContents ? (typeof tableOfContents === 'string' ? tableOfContents : JSON.stringify(tableOfContents)) : undefined,
                language,
                formats: formats ? (typeof formats === 'string' ? formats : JSON.stringify(formats)) : undefined,
                type: type || 'WRITTEN',
                pdfPath,
                accessType: accessType || 'PUBLIC',
                publicationType: publicationType || 'EBOOK',
                isPublic: isPublic !== undefined ? (isPublic === true || isPublic === 'true') : true,
                isMemberOnly: isMemberOnly !== undefined ? (isMemberOnly === true || isMemberOnly === 'true') : false,
                previewContent,
                fullContent,
                downloadUrl,
                memberDownloadUrl,
                citationEnabled: citationEnabled === true || citationEnabled === 'true',
                seoTitle,
                seoDescription,
                structuredDataType: structuredDataType || 'Book',
                publishedStatus: isContributor ? 'DRAFT' : (publishedStatus || 'DRAFT'),
                contributorId: isContributor ? userId : undefined,
                submittedByContributor: !!isContributor,
                metadata: finalMetadata
            }
        });

        res.status(201).json({
            id: publication.id,
            title: publication.title,
            slug: publication.slug,
            status: publication.publishedStatus,
            metadata: publication.metadata // Optional, useful for client testing
        });

    } catch (error) {
        console.error("Create Publication Error:", error);
        res.status(500).json({ error: "Failed to create publication" });
    }
};

export const updatePublication = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const raw = req.body;

        const pub = await prisma.publication.findUnique({ where: { id } });
        if (!pub) return res.status(404).json({ error: "Publication not found" });

        // These fields exist in the Prisma schema.
        const KNOWN_FIELDS = new Set([
            'title', 'subtitle', 'author', 'published', 'category', 'price', 'pages',
            'description', 'imagePath', 'slug', 'features', 'tableOfContents',
            'language', 'formats', 'pdfPath', 'type', 'categoryId',
            'accessType', 'publicationType', 'isPublic', 'isMemberOnly',
            'previewContent', 'fullContent', 'downloadUrl', 'memberDownloadUrl',
            'citationEnabled', 'seoTitle', 'seoDescription', 'structuredDataType',
            'publishedStatus', 'contributorId', 'submittedByContributor'
        ]);

        const data: Record<string, any> = {};
        const incomingMetadata: Record<string, any> = {};
        
        // Exclude dummy fields that are in the form but not the schema
        const DUMMY_FIELDS = new Set(['isDownloadable', 'previewEnabled', 'memberOnlyDownload', 'chapters']);

        for (const key of Object.keys(raw)) {
            if (DUMMY_FIELDS.has(key)) continue;

            if (KNOWN_FIELDS.has(key)) {
                // Only include if it's explicitly provided and valid
                if (raw[key] !== undefined) {
                    data[key] = raw[key];
                }
            } else {
                incomingMetadata[key] = raw[key];
            }
        }

        // Draft protection & state transition rules
        if (pub.publishedStatus === "PUBLISHED") {
            if (raw.publishedStatus && raw.publishedStatus !== "PUBLISHED") {
                return res.status(400).json({ error: "Cannot change status of a PUBLISHED publication back to DRAFT or other states." });
            }
            data.publishedStatus = "PUBLISHED";
        } else if (raw.publishedStatus) {
            try {
                validateStatusTransition(pub.publishedStatus, raw.publishedStatus);
            } catch (transitionErr: any) {
                return res.status(400).json({ error: transitionErr.message });
            }
        }

        // Merge metadata safely
        let existingMetadata: any = {};
        if (pub.metadata) {
            existingMetadata = typeof pub.metadata === 'string' ? JSON.parse(pub.metadata) : pub.metadata;
        }
        
        let mergedMetadata = { ...existingMetadata, ...incomingMetadata };
        
        // Audit log history for status transitions on update
        const oldStatus = pub.publishedStatus;
        const newStatus = data.publishedStatus || oldStatus;
        if (oldStatus !== newStatus) {
            const by = getRequesterName(req);
            if (newStatus === "UNDER_REVIEW") {
                mergedMetadata = appendReleaseHistory(mergedMetadata, {
                    action: "SUBMITTED_FOR_REVIEW",
                    by,
                    notes: "Submitted for validation review."
                });
            } else if (newStatus === "APPROVED") {
                mergedMetadata = appendReleaseHistory(mergedMetadata, {
                    action: "APPROVED",
                    by,
                    version: data.publicationVersion || mergedMetadata.publication_version || "v1.0",
                    readinessScore: mergedMetadata.readiness_score || 0,
                    notes: "Approved."
                });
            } else if (newStatus === "PUBLISHED") {
                mergedMetadata = appendReleaseHistory(mergedMetadata, {
                    action: "PUBLISHED",
                    by,
                    version: data.publicationVersion || mergedMetadata.publication_version || "v1.0",
                    slug: pub.slug || data.slug
                });
            }
        }

        if (Object.keys(mergedMetadata).length > 0) {
            data.metadata = JSON.stringify(mergedMetadata);
        }

        // Type coercions
        if (data.price !== undefined) data.price = parseFloat(data.price) || 0;
        if (data.pages !== undefined) data.pages = parseInt(data.pages) || 0;

        // Provide safe defaults for non-nullable fields if they're empty strings
        if (data.published === '') delete data.published;
        if (data.category === '') delete data.category;
        if (data.description === '') delete data.description;
        if (data.imagePath === '') delete data.imagePath;

        // Handle categoryId empty string → null
        if (data.categoryId === '') data.categoryId = null;

        // Convert boolean fields
        if (data.isPublic !== undefined) data.isPublic = data.isPublic === true || data.isPublic === 'true';
        if (data.isMemberOnly !== undefined) data.isMemberOnly = data.isMemberOnly === true || data.isMemberOnly === 'true';
        if (data.citationEnabled !== undefined) data.citationEnabled = data.citationEnabled === true || data.citationEnabled === 'true';

        // Auto-resolve categoryId from category name
        if ((!data.categoryId) && data.category && data.category !== 'General') {
             try {
                const existingCat = await prisma.publicationCategory.findUnique({ where: { name: data.category } });
                if (existingCat) {
                    data.categoryId = existingCat.id;
                } else {
                    const newCat = await prisma.publicationCategory.create({
                        data: {
                            name: data.category,
                            slug: data.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
                            description: 'Auto-created via update'
                        }
                    });
                    data.categoryId = newCat.id;
                }
             } catch (err) {
                 console.warn('Category auto-creation failed during update:', err);
             }
        }

        // Handle JSON fields
        if (data.features && typeof data.features !== 'string') data.features = JSON.stringify(data.features);
        if (data.tableOfContents && typeof data.tableOfContents !== 'string') data.tableOfContents = JSON.stringify(data.tableOfContents);
        if (data.formats && typeof data.formats !== 'string') data.formats = JSON.stringify(data.formats);

        const publication = await prisma.publication.update({
            where: { id },
            data
        });

        res.json(publication);
    } catch (error: any) {
        console.error("Update Publication Error:", error);
        res.status(400).json({ 
            error: "Failed to update publication",
            details: error.message || error
        });
    }
};

export const deletePublication = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const { force } = req.query;

        // Check for purchases
        const purchaseCount = await prisma.userPurchase.count({
            where: { publicationId: id }
        });

        if (purchaseCount > 0 && force !== 'true') {
            return res.status(409).json({ 
                error: "Publication has been purchased", 
                count: purchaseCount,
                requiresConfirmation: true 
            });
        }

        // If forced or no purchases, proceed to delete
        // We use a transaction to ensure clean deletion
        await prisma.$transaction(async (tx) => {
            // Delete associated purchases first (manual cascade)
            if (purchaseCount > 0) {
                await tx.userPurchase.deleteMany({
                    where: { publicationId: id }
                });
            }

            // Delete chapters and pages (they handle their own cascade usually, but let's be safe if schema has cascade)
            // Schema says Chapter -> Publication is OnDelete Cascade.
            // BookPage -> Chapter is OnDelete Cascade.
            // So just deleting publication is enough for those.

            await tx.publication.delete({ where: { id } });
        });

        res.json({ message: "Publication deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete publication" });
    }
};

export const getPublicationStats = async (req: Request, res: Response) => {
    try {
        const totalPublications = await prisma.publication.count();
        const totalCategories = await prisma.publicationCategory.count();
        
        // Calculate total revenue from UserPurchase
        const purchases = await prisma.userPurchase.findMany({
            select: { amount: true }
        });
        const totalRevenue = purchases.reduce((sum, p) => sum + p.amount, 0);

        // Get 5 recent publications
        const recentPublications = await prisma.publication.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                author: true,
                price: true,
                category: true, // category name string
                published: true,
                createdAt: true,
                imagePath: true
            }
        });

        res.json({
            totalPublications,
            totalCategories,
            totalRevenue,
            recentPublications
        });
    } catch (error) {
        console.error("Get Publication Stats Error:", error);
        res.status(500).json({ error: "Failed to fetch publication stats" });
    }
};

export const submitPublicationReview = async (req: Request, res: Response) => {
    try {
        const publicationId = requireString(req.params.id);
        const userId = (req as any).user?.userId;
        const { 
            reviewType, 
            rating, 
            title, 
            review, 
            isExpert, 
            expertType, 
            expertDesignation,
            reviewerName,
            institution,
            country,
            disclosure,
            permissionToDisplayName
        } = req.body;

        if (!rating || !review || !reviewType) {
            return res.status(400).json({ error: "Missing required fields (rating, review, reviewType)" });
        }

        // Check if publication exists
        const pub = await prisma.publication.findUnique({
            where: { id: publicationId }
        });

        if (!pub) {
            return res.status(404).json({ error: "Publication not found" });
        }

        // Determine if verified reader
        let verifiedReader = false;
        if (userId) {
            const purchase = await prisma.userPurchase.findFirst({
                where: { userId, publicationId }
            });
            if (purchase || pub.accessType === "PUBLIC") {
                verifiedReader = true;
            }
        }

        // Check if expert (only if user is admin)
        let setExpert = false;
        let setExpertType = null;
        let setExpertName = null;
        let setExpertDesignation = null;

        if (userId) {
            const userObj = await prisma.user.findUnique({ where: { id: userId } });
            if (userObj && (userObj.isAdmin || userObj.role === "ADMIN")) {
                setExpert = isExpert === true || isExpert === 'true';
                if (setExpert) {
                    setExpertType = expertType || "Academic Review";
                    setExpertName = userObj.name;
                    setExpertDesignation = expertDesignation || "KHCRF Panelist";
                }
            }
        }

        const newReview = await prisma.publicationReview.create({
            data: {
                publicationId,
                userId: userId || null,
                reviewType,
                rating: parseInt(rating) || 5,
                title,
                review,
                verifiedReader,
                isExpert: setExpert,
                expertType: setExpertType,
                expertName: setExpertName,
                expertDesignation: setExpertDesignation,
                reviewerName: reviewerName || (userId ? (await prisma.user.findUnique({ where: { id: userId } }))?.name : null) || "Anonymous Contributor",
                institution: institution || null,
                country: country || null,
                disclosure: disclosure || null,
                permissionToDisplayName: permissionToDisplayName !== undefined ? (permissionToDisplayName === true || permissionToDisplayName === 'true') : true,
                status: "Submitted"
            }
        });

        res.status(201).json(newReview);
    } catch (error) {
        console.error("Submit Review Error:", error);
        res.status(500).json({ error: "Failed to submit review" });
    }
};

export const getPublicationReviews = async (req: Request, res: Response) => {
    try {
        const publicationId = requireString(req.params.id);
        const reviews = await prisma.publicationReview.findMany({
            where: { 
                publicationId,
                status: "Approved"
            },
            orderBy: [
                { isExpert: 'desc' },
                { createdAt: 'desc' }
            ]
        });
        res.json(reviews);
    } catch (error) {
        console.error("Get Reviews Error:", error);
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
};

export const voteHelpfulReview = async (req: Request, res: Response) => {
    try {
        const reviewId = requireString(req.params.reviewId);
        const review = await prisma.publicationReview.update({
            where: { id: reviewId },
            data: {
                helpfulCount: {
                    increment: 1
                }
            }
        });
        res.json(review);
    } catch (error) {
        console.error("Vote Helpful Error:", error);
        res.status(500).json({ error: "Failed to vote review" });
    }
};

export const voteRecommendReview = async (req: Request, res: Response) => {
    try {
        const reviewId = requireString(req.params.reviewId);
        const review = await prisma.publicationReview.update({
            where: { id: reviewId },
            data: {
                recommendCount: {
                    increment: 1
                }
            }
        });
        res.json(review);
    } catch (error) {
        console.error("Vote Recommend Error:", error);
        res.status(500).json({ error: "Failed to recommend review" });
    }
};

export const reportReviewConcern = async (req: Request, res: Response) => {
    try {
        const reviewId = requireString(req.params.reviewId);
        const current = await prisma.publicationReview.findUnique({
            where: { id: reviewId }
        });
        if (!current) {
            return res.status(404).json({ error: "Review not found" });
        }
        
        const newReportedCount = (current.reportedCount || 0) + 1;
        const newStatus = newReportedCount >= 3 ? "Flagged" : current.status;

        const review = await prisma.publicationReview.update({
            where: { id: reviewId },
            data: {
                reportedCount: newReportedCount,
                status: newStatus
            }
        });
        res.json(review);
    } catch (error) {
        console.error("Report Review Error:", error);
        res.status(500).json({ error: "Failed to report review" });
    }
};

export const getAdminReviewsQueue = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const userObj = await prisma.user.findUnique({ where: { id: userId } });
        if (!userObj || (!userObj.isAdmin && userObj.role !== "ADMIN")) {
            return res.status(403).json({ error: "Forbidden: Admins only" });
        }

        const { status } = req.query;
        const where: any = {};
        if (status) {
            where.status = String(status);
        }

        const reviews = await prisma.publicationReview.findMany({
            where,
            include: {
                publication: {
                    select: {
                        title: true,
                        slug: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(reviews);
    } catch (error) {
        console.error("Get Admin Reviews Queue Error:", error);
        res.status(500).json({ error: "Failed to fetch reviews queue" });
    }
};

export const updateReviewStatus = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const userObj = await prisma.user.findUnique({ where: { id: userId } });
        if (!userObj || (!userObj.isAdmin && userObj.role !== "ADMIN")) {
            return res.status(403).json({ error: "Forbidden: Admins only" });
        }

        const reviewId = requireString(req.params.reviewId);
        const { status } = req.body;

        const validStatuses = ["Submitted", "Under Review", "Approved", "Needs Revision", "Rejected", "Flagged", "Hidden"];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
        }

        const review = await prisma.publicationReview.update({
            where: { id: reviewId },
            data: { status }
        });

        res.json(review);
    } catch (error) {
        console.error("Update Review Status Error:", error);
        res.status(500).json({ error: "Failed to update review status" });
    }
};

export const getMyContributorPublications = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { search, status } = req.query;
        const where: any = { contributorId: userId };

        if (search) {
            where.title = { contains: String(search), mode: 'insensitive' };
        }
        if (status) {
            where.publishedStatus = String(status);
        }

        const publications = await prisma.publication.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        res.json(publications);
    } catch (error) {
        console.error("Get My Contributor Publications Error:", error);
        res.status(500).json({ error: "Failed to fetch your publications." });
    }
};

export const getContributorBooks = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const userObj = await prisma.user.findUnique({ where: { id: userId } });
        if (!userObj || (!userObj.isAdmin && userObj.role !== "ADMIN")) {
            return res.status(403).json({ error: "Forbidden: Admins only" });
        }

        const { search, status } = req.query;
        const where: any = { submittedByContributor: true };

        if (search) {
            where.OR = [
                { title: { contains: String(search), mode: 'insensitive' } },
                { author: { contains: String(search), mode: 'insensitive' } }
            ];
        }
        if (status) {
            where.publishedStatus = String(status);
        }

        const publications = await prisma.publication.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                contributor: {
                    select: { id: true, name: true, email: true }
                }
            }
        });

        res.json(publications);
    } catch (error) {
        console.error("Get Contributor Books Error:", error);
        res.status(500).json({ error: "Failed to fetch contributor books." });
    }
};

export const updateContributorBookStatus = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const userObj = await prisma.user.findUnique({ where: { id: userId } });
        if (!userObj || (!userObj.isAdmin && userObj.role !== "ADMIN")) {
            return res.status(403).json({ error: "Forbidden: Admins only" });
        }

        const id = requireString(req.params.id);
        const { publishedStatus } = req.body;

        const validStatuses = ["DRAFT", "PUBLISHED", "ARCHIVED"];
        if (!publishedStatus || !validStatuses.includes(publishedStatus)) {
            return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
        }

        const publication = await prisma.publication.update({
            where: { id },
            data: { publishedStatus }
        });

        res.json(publication);
    } catch (error) {
        console.error("Update Contributor Book Status Error:", error);
        res.status(500).json({ error: "Failed to update book status." });
    }
};
// ─── Status Validation & Publish Gating Helpers ─────────────────────────────

const getRequesterName = (req: Request) => {
    const user = (req as any).user;
    return user?.name || user?.email || "System User";
};

const validateStatusTransition = (current: string, target: string) => {
    if (current === target) return;
    
    // Blocked transitions:
    // PUBLISHED -> anything else
    if (current === "PUBLISHED" && target !== "PUBLISHED") {
        throw new Error(`Cannot change status from PUBLISHED to ${target}. Transitions from PUBLISHED are blocked.`);
    }
    // SCHEDULED -> DRAFT
    if (current === "SCHEDULED" && target === "DRAFT") {
        throw new Error("Cannot change status from SCHEDULED to DRAFT.");
    }
    
    // Allowed transitions:
    const allowed = [
        "DRAFT->UNDER_REVIEW",
        "UNDER_REVIEW->APPROVED",
        "UNDER_REVIEW->DRAFT",
        "APPROVED->SCHEDULED",
        "APPROVED->PUBLISHED",
        "SCHEDULED->PUBLISHED",
        "APPROVED->APPROVED",
        "DRAFT->DRAFT",
        "UNDER_REVIEW->UNDER_REVIEW",
        "SCHEDULED->SCHEDULED",
        "PUBLISHED->PUBLISHED"
    ];
    
    const transition = `${current}->${target}`;
    if (!allowed.includes(transition)) {
        if (target === "PUBLISHED" && current !== "APPROVED" && current !== "SCHEDULED") {
            throw new Error("Cannot publish directly. Publication must be APPROVED or SCHEDULED first.");
        }
    }
};

const checkPublishGating = async (pub: any, dbChapters: any[]) => {
    if (pub.publishedStatus !== "APPROVED" && pub.publishedStatus !== "SCHEDULED") {
        throw new Error("Publishing blocked: Publication must be APPROVED or SCHEDULED before publishing.");
    }
    if (!pub.slug || pub.slug.trim() === "") {
        throw new Error("Publishing blocked: URL Slug is missing.");
    }
    if (!pub.accessType || pub.accessType.trim() === "") {
        throw new Error("Publishing blocked: Access Tier is missing.");
    }
    
    const placeholderTerms = ["test", "demo", "sample", "placeholder", "draft chapter", "untitled"];
    const hasPlaceholders = dbChapters.some(c => 
        placeholderTerms.some(term => c.title.toLowerCase().includes(term))
    );
    if (hasPlaceholders) {
        throw new Error("Publishing blocked: Placeholder chapters exist.");
    }
    
    const titles = dbChapters.map(c => c.title.toLowerCase().trim());
    const orders = dbChapters.map(c => c.order);
    const hasDuplicateTitles = titles.some((val, i) => titles.indexOf(val) !== i);
    const hasDuplicateOrders = orders.some((val, i) => orders.indexOf(val) !== i);
    if (hasDuplicateTitles || hasDuplicateOrders) {
        throw new Error("Publishing blocked: Duplicate chapters or order values exist in the database.");
    }
    
    const hasEmptyChapters = dbChapters.length === 0 || dbChapters.some(c => {
        return !c.pages || c.pages.length === 0 || !c.pages[0].content || c.pages[0].content === "[]" || c.pages[0].content.length < 10;
    });
    if (hasEmptyChapters) {
        throw new Error("Publishing blocked: One or more chapters have no content.");
    }
};

const appendReleaseHistory = (existingMetadata: any, event: {
    action: string;
    by: string;
    notes?: string;
    version?: string;
    readinessScore?: number;
    slug?: string;
}) => {
    const history = existingMetadata.releaseHistory || [];
    history.push({
        ...event,
        at: new Date().toISOString()
    });
    existingMetadata.releaseHistory = history;
    return existingMetadata;
};

export const approvePublication = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const { approved_by, approval_notes, approval_status, publication_version, readiness_score } = req.body;

        const pub = await prisma.publication.findUnique({ where: { id } });
        if (!pub) return res.status(404).json({ error: "Not found" });

        const targetStatus = "APPROVED";
        try {
            validateStatusTransition(pub.publishedStatus, targetStatus);
        } catch (transitionErr: any) {
            return res.status(400).json({ error: transitionErr.message });
        }

        const currentMeta = typeof pub.metadata === 'string' ? JSON.parse(pub.metadata) : (pub.metadata || {});
        let newMeta = {
            ...currentMeta,
            approved_by: approved_by || getRequesterName(req),
            approval_notes,
            approval_status: "approved",
            publication_version: publication_version || "v1.0",
            readiness_score: readiness_score || 0,
            approved_at: new Date().toISOString()
        };

        newMeta = appendReleaseHistory(newMeta, {
            action: "APPROVED",
            by: approved_by || getRequesterName(req),
            version: publication_version || "v1.0",
            readinessScore: readiness_score || 0,
            notes: approval_notes || "All validation checks passed. Approved for public release."
        });

        const updated = await prisma.publication.update({
            where: { id },
            data: {
                publishedStatus: targetStatus,
                metadata: JSON.stringify(newMeta)
            }
        });
        res.json(updated);
    } catch (error: any) {
        console.error("Approve Publication Error:", error);
        res.status(400).json({ error: "Failed to approve", details: error.message });
    }
};

export const publishPublication = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const { publish_status, published_at, published_by, publication_version, public_slug, access_tier, visibility, reader_access, download_access } = req.body;

        const pub = await prisma.publication.findUnique({ where: { id } });
        if (!pub) return res.status(404).json({ error: "Not found" });

        const targetStatus = "PUBLISHED";
        try {
            validateStatusTransition(pub.publishedStatus, targetStatus);
        } catch (transitionErr: any) {
            return res.status(400).json({ error: transitionErr.message });
        }

        const dbChapters = await prisma.chapter.findMany({
            where: { publicationId: id },
            include: { pages: true }
        });
        try {
            await checkPublishGating(pub, dbChapters);
        } catch (gatingErr: any) {
            return res.status(400).json({ error: gatingErr.message });
        }

        const currentMeta = typeof pub.metadata === 'string' ? JSON.parse(pub.metadata) : (pub.metadata || {});
        let newMeta = {
            ...currentMeta,
            published_by: published_by || getRequesterName(req),
            published_at: published_at || new Date().toISOString(),
            publication_version: publication_version || "v1.0",
            public_slug: public_slug || pub.slug,
            access_tier: access_tier || pub.accessType || "PUBLIC",
            visibility: visibility || (pub.isPublic ? "Public" : "Private"),
            reader_access: reader_access || (pub.previewContent ? "Enabled" : "Disabled"),
            download_access: download_access || (currentMeta.isDownloadable ? "Allowed" : "Blocked")
        };

        newMeta = appendReleaseHistory(newMeta, {
            action: "PUBLISHED",
            by: published_by || getRequesterName(req),
            version: publication_version || "v1.0",
            slug: public_slug || pub.slug
        });

        const updated = await prisma.publication.update({
            where: { id },
            data: {
                publishedStatus: targetStatus,
                published: published_at || new Date().toISOString(),
                isPublic: true,
                metadata: JSON.stringify(newMeta)
            }
        });
        res.json(updated);
    } catch (error: any) {
        console.error("Publish Publication Error:", error);
        res.status(400).json({ error: "Failed to publish", details: error.message });
    }
};

export const schedulePublication = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const { scheduled_publish_at, publish_status } = req.body;

        const pub = await prisma.publication.findUnique({ where: { id } });
        if (!pub) return res.status(404).json({ error: "Not found" });

        const targetStatus = "SCHEDULED";
        try {
            validateStatusTransition(pub.publishedStatus, targetStatus);
        } catch (transitionErr: any) {
            return res.status(400).json({ error: transitionErr.message });
        }

        const currentMeta = typeof pub.metadata === 'string' ? JSON.parse(pub.metadata) : (pub.metadata || {});
        let newMeta = {
            ...currentMeta,
            scheduled_publish_at
        };

        newMeta = appendReleaseHistory(newMeta, {
            action: "SCHEDULED",
            by: getRequesterName(req),
            notes: `Scheduled for release at ${scheduled_publish_at}`
        });

        const updated = await prisma.publication.update({
            where: { id },
            data: {
                publishedStatus: targetStatus,
                metadata: JSON.stringify(newMeta)
            }
        });
        res.json(updated);
    } catch (error: any) {
        console.error("Schedule Publication Error:", error);
        res.status(400).json({ error: "Failed to schedule", details: error.message });
    }
};

export const cancelSchedulePublication = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const { publish_status } = req.body;

        const pub = await prisma.publication.findUnique({ where: { id } });
        if (!pub) return res.status(404).json({ error: "Not found" });

        const currentMeta = typeof pub.metadata === 'string' ? JSON.parse(pub.metadata) : (pub.metadata || {});
        let newMeta = {
            ...currentMeta,
            scheduled_publish_at: null
        };

        newMeta = appendReleaseHistory(newMeta, {
            action: "CANCELLED_SCHEDULE",
            by: getRequesterName(req),
            notes: "Cancelled scheduled release."
        });

        const updated = await prisma.publication.update({
            where: { id },
            data: {
                publishedStatus: publish_status || "APPROVED",
                metadata: JSON.stringify(newMeta)
            }
        });
        res.json(updated);
    } catch (error: any) {
        console.error("Cancel Schedule Publication Error:", error);
        res.status(400).json({ error: "Failed to cancel schedule", details: error.message });
    }
};

// ─── Automated Scheduled Publisher (Cron Simulator) ─────────────────────────
// Runs every 60 seconds to find and publish scheduled publications whose time has arrived
setInterval(async () => {
    try {
        const scheduledPubs = await prisma.publication.findMany({
            where: { publishedStatus: "SCHEDULED" }
        });

        const now = new Date();
        for (const pub of scheduledPubs) {
            let meta: any = {};
            try { meta = typeof pub.metadata === 'string' ? JSON.parse(pub.metadata) : pub.metadata || {}; } catch (e) {}

            if (meta.scheduled_publish_at) {
                const scheduledTime = new Date(meta.scheduled_publish_at);
                if (scheduledTime <= now && meta.approval_status === "approved") {
                    console.log(`Auto-publishing scheduled publication: ${pub.id}`);
                    await prisma.publication.update({
                        where: { id: pub.id },
                        data: {
                            publishedStatus: "PUBLISHED",
                            published: now.toISOString(),
                            isPublic: true
                        }
                    });
                }
            }
        }
    } catch (error) {
        console.error("Scheduled Publisher Worker Error:", error);
    }
}, 60000);

export const getCitationsForPublication = async (req: Request, res: Response) => {
    try {
        const publicationId = requireString(req.params.publicationId);
        const citations = await prisma.citation.findMany({
            where: { publicationId },
            include: {
                chapter: true,
                section: true,
                block: true
            }
        });
        res.json({ success: true, data: citations });
    } catch (error: any) {
        console.error("Get Citations Error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch citations" });
    }
};

export const createOrUpsertCitation = async (req: Request, res: Response) => {
    try {
        const publicationId = requireString(req.params.publicationId);
        const { id, claim, evidenceStatus, sourceData, chapterId, sectionId, blockId } = req.body;

        if (!claim || !claim.trim()) {
            return res.status(400).json({ success: false, error: "Citation claim text is required." });
        }

        const validStatuses = ["VERIFIED", "UNVERIFIED", "HYPOTHESIS", "PROHIBITED_UNTIL_SOURCED"];
        if (!validStatuses.includes(evidenceStatus)) {
            return res.status(400).json({ success: false, error: `Invalid evidence status. Must be one of: ${validStatuses.join(", ")}` });
        }

        if (evidenceStatus === 'PROHIBITED_UNTIL_SOURCED' && (!sourceData || !sourceData.trim())) {
            return res.status(400).json({ success: false, error: "Source bibliography reference is strictly required when status is PROHIBITED_UNTIL_SOURCED." });
        }

        let citation;
        if (id) {
            citation = await prisma.citation.update({
                where: { id },
                data: {
                    claim,
                    evidenceStatus,
                    sourceData: sourceData || null,
                    chapterId: chapterId || null,
                    sectionId: sectionId || null,
                    blockId: blockId || null
                }
            });
        } else {
            citation = await prisma.citation.create({
                data: {
                    publicationId,
                    claim,
                    evidenceStatus,
                    sourceData: sourceData || null,
                    chapterId: chapterId || null,
                    sectionId: sectionId || null,
                    blockId: blockId || null
                }
            });
        }

        res.json({ success: true, data: citation });
    } catch (error: any) {
        console.error("Create/Upsert Citation Error:", error);
        res.status(500).json({ success: false, error: "Failed to save citation" });
    }
};

export const deleteCitation = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        await prisma.citation.delete({ where: { id } });
        res.json({ success: true, message: "Citation deleted successfully" });
    } catch (error: any) {
        console.error("Delete Citation Error:", error);
        res.status(500).json({ success: false, error: "Failed to delete citation" });
    }
};


