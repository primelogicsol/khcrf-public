import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { EmailService } from '../services/emailService.js';
import { EmailTemplates } from '../constants/emailTemplates.js';
import { requireString } from "../utils/routeHelpers";

// --- Office Registration & Management ---

export const registerOffice = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const data = req.body;
        const isDraft = data.status === 'DRAFT';

        // Check if user already has an office
        const existing = await prisma.legislativeOffice.findFirst({ where: { userId } });

        if (existing) {
            if (existing.status === 'PENDING' || existing.status === 'APPROVED') {
                return res.status(400).json({ error: "You already have a registered office application." });
            }
            // If DRAFT, update it
            const updated = await prisma.legislativeOffice.update({
                where: { id: existing.id },
                data: {
                    representativeName: data.representativeName,
                    designation: data.designation,
                    constituency: data.constituency,
                    district: data.district,
                    legislativeBody: data.legislativeBody,
                    party: data.party || "Independent",
                    termStart: data.termStart,
                    termEnd: data.termEnd,
                    officeAddress: data.officeAddress,
                    officialEmail: data.officialEmail,
                    officialWebsite: data.officialWebsite,
                    socialHandle: data.socialHandle,
                    contactNumber: data.contactNumber,
                    username: data.username, // Should be careful if username changed

                    // Arrays / Json
                    craftSectors: data.craftSectors || [],
                    artisanPresence: data.artisanPresence,
                    artisanPopulation: data.artisanPopulation,
                    craftClusters: data.craftClusters,
                    orgTypes: data.orgTypes || [],
                    craftIssues: data.craftIssues || [],
                    engagementSummary: data.engagementSummary,
                    priorityAreas: data.priorityAreas,
                    supportRequests: data.supportRequests || [],

                    intendedUse: data.intendedUse, // Mapping intendedUse
                    verificationPreference: data.verificationPreference || [],

                    authDocUrl: data.authDocUrl,
                    officeImageUrl: data.officeImageUrl,
                    status: isDraft ? 'DRAFT' : 'PENDING'
                }
            });
            return res.status(200).json(updated);
        }

        // Create new
        const office = await prisma.legislativeOffice.create({
            data: {
                userId: userId || null,
                representativeName: data.representativeName,
                designation: data.designation,
                constituency: data.constituency,
                district: data.district,
                legislativeBody: data.legislativeBody,
                party: data.party || "Independent",
                termStart: data.termStart,
                termEnd: data.termEnd,
                officeAddress: data.officeAddress,
                officialEmail: data.officialEmail,
                officialWebsite: data.officialWebsite,
                socialHandle: data.socialHandle,
                contactNumber: data.contactNumber,

                username: data.username,
                craftSectors: data.craftSectors || [],

                // New Fields
                artisanPresence: data.artisanPresence,
                artisanPopulation: data.artisanPopulation,
                craftClusters: data.craftClusters,
                orgTypes: data.orgTypes || [],
                craftIssues: data.craftIssues || [],
                engagementSummary: data.engagementSummary,
                priorityAreas: data.priorityAreas,
                supportRequests: data.supportRequests || [],
                verificationPreference: data.verificationPreference || [],
                
                // New additions
                knownCraft: data.knownCraft,
                hcrfSupport: data.hcrfSupport ?? false,

                intendedUse: data.intendedUse,
                campaignDisclaimer: data.campaignDisclaimer !== false, // default true
                authDocUrl: data.authDocUrl,
                officeImageUrl: data.officeImageUrl,
                referralCode: data.referralCode || `${data.representativeName.substring(0, 3).toUpperCase()}-${data.constituency.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
                status: isDraft ? 'DRAFT' : 'PENDING'
            }
        });

        // Send Email
        EmailService.sendEmail(data.officialEmail || "unknown@example.com", EmailTemplates.APPLICATION_RECEIVED, {
            name: data.representativeName,
            type: 'Lobby Office Registration',
            id: office.id
        }).catch(err => console.error("Failed to send legislative office application email:", err));

        res.status(201).json(office);
    } catch (error) {
        console.error("Register Legislative Office Error:", error);
        if ((error as any).code === 'P2002') {
            return res.status(400).json({ error: "Username already taken" });
        }
        res.status(500).json({ error: "Failed to register office" });
    }
};

export const updateMyOffice = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const data = req.body;
        
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const existing = await prisma.legislativeOffice.findFirst({ where: { userId } });
        if (!existing) return res.status(404).json({ error: "No office found" });

        const updated = await prisma.legislativeOffice.update({
             where: { id: existing.id },
             data: {
                 officeImageUrl: data.officeImageUrl,
                 socialHandle: data.socialHandle,
                 knownCraft: data.knownCraft,
                 hcrfSupport: data.hcrfSupport,
                 
                 // Identity
                 representativeName: data.representativeName,
                 designation: data.designation,
                 constituency: data.constituency,
                 district: data.district,
                 party: data.party,
                 termStart: data.termStart,
                 termEnd: data.termEnd,
                 legislativeBody: data.legislativeBody,
                 officialEmail: data.officialEmail,
                 contactNumber: data.contactNumber,
                 officeAddress: data.officeAddress,
                 officialWebsite: data.officialWebsite,

                 // Craft Profile
                 artisanPresence: data.artisanPresence,
                 artisanPopulation: data.artisanPopulation,
                 craftSectors: data.craftSectors,
                 craftClusters: data.craftClusters,
                 orgTypes: data.orgTypes,

                 // Engagement
                 craftIssues: data.craftIssues,
                 engagementSummary: data.engagementSummary,
                 priorityAreas: data.priorityAreas,
                 supportRequests: data.supportRequests,
                 
                 // Overview configuration (New!)
                 overviewConfig: data.overviewConfig,
                 
                 // LCAD Updates configuration
                 lcadUpdatesConfig: data.lcadUpdatesConfig,
                 referralCode: data.referralCode,
             }
        });

        res.json(updated);
    } catch (error) {
        console.error("Update My Office Error:", error);
        res.status(500).json({ error: "Failed to update office" });
    }
};

export const getMyOffice = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const office = await prisma.legislativeOffice.findFirst({
            where: { userId },
            include: { posts: true }
        });

        if (!office) return res.status(404).json({ error: "No office found" });

        // Process overviewConfig for dynamic stats (identical logic to getOfficeBySlug)
        let overviewData: any = office.overviewConfig || {};
        let rStats = {
            totalStakeholders: 0,
            verifiedProfiles: 0,
            underEvaluation: 0,
            commerceInterest: 0,
        };

        const impactStatsConfig = overviewData.impactStats || {
            totalStakeholders: { isAuto: true, value: 0 },
            verifiedProfiles: { isAuto: true, value: 0 },
            underEvaluation: { isAuto: true, value: 0 },
            commerceInterest: { isAuto: true, value: 0 }
        };

        const needsAutoCount = 
            impactStatsConfig.totalStakeholders?.isAuto ||
            impactStatsConfig.verifiedProfiles?.isAuto ||
            impactStatsConfig.underEvaluation?.isAuto ||
            impactStatsConfig.commerceInterest?.isAuto;

        if (needsAutoCount || true) { // Always aggregate craft composition
             const ccsiProfiles = await prisma.ccsiProfile.findMany({
                 where: { legislativeOfficeId: office.id },
                 select: { status: true, salesChannels: true, primaryCraft: true }
             });

             const totalCount = ccsiProfiles.length;
             const verifiedCount = ccsiProfiles.filter(p => p.status === 'VERIFIED').length;
             const evaluationCount = ccsiProfiles.filter(p => p.status === 'UNDER_REVIEW' || p.status === 'SUBMITTED').length;
             const commerceCount = ccsiProfiles.filter(p => {
                 try {
                     const channels = typeof p.salesChannels === 'string' ? JSON.parse(p.salesChannels) : p.salesChannels;
                     return Array.isArray(channels) && channels.length > 0;
                 } catch (e) { return false; }
             }).length;

             rStats.totalStakeholders = impactStatsConfig.totalStakeholders?.isAuto ? totalCount : (impactStatsConfig.totalStakeholders?.value || 0);
             rStats.verifiedProfiles = impactStatsConfig.verifiedProfiles?.isAuto ? verifiedCount : (impactStatsConfig.verifiedProfiles?.value || 0);
             rStats.underEvaluation = impactStatsConfig.underEvaluation?.isAuto ? evaluationCount : (impactStatsConfig.underEvaluation?.value || 0);
             rStats.commerceInterest = impactStatsConfig.commerceInterest?.isAuto ? commerceCount : (impactStatsConfig.commerceInterest?.value || 0);

             // Calculate Dynamic Craft Composition
             const craftCounts: { [key: string]: number } = {};
             ccsiProfiles.forEach(p => {
                 if (p.primaryCraft) {
                     craftCounts[p.primaryCraft] = (craftCounts[p.primaryCraft] || 0) + 1;
                 }
             });

             const sortedCrafts = Object.entries(craftCounts)
                 .sort((a, b) => b[1] - a[1]) // Sort descending by count
                 .map(([name, count]) => ({ name, count }));

             overviewData.craftComposition = sortedCrafts;
        } else {
             rStats.totalStakeholders = impactStatsConfig.totalStakeholders?.value || 0;
             rStats.verifiedProfiles = impactStatsConfig.verifiedProfiles?.value || 0;
             rStats.underEvaluation = impactStatsConfig.underEvaluation?.value || 0;
             rStats.commerceInterest = impactStatsConfig.commerceInterest?.value || 0;
             overviewData.craftComposition = [];
        }

        overviewData.rStats = rStats;

        res.json({ ...office, overviewData });
    } catch (error) {
        console.error("Get My Office Error:", error);
        res.status(500).json({ error: "Failed to fetch office" });
    }
};

export const getAllOffices = async (req: Request, res: Response) => {
    try {
        const offices = await prisma.legislativeOffice.findMany({
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true, email: true } } }
        });
        res.json(offices);
    } catch (error) {
        console.error("Get All Offices Error:", error);
        res.status(500).json({ error: "Failed to fetch offices" });
    }
};

export const updateOfficeStatus = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const { status } = req.body;

        const office = await prisma.legislativeOffice.update({
            where: { id },
            data: { status }
        });

        // Send Status Update Email
        if (office.officialEmail) {
            EmailService.sendEmail(office.officialEmail, EmailTemplates.STATUS_UPDATE, {
                name: office.representativeName,
                type: 'Lobby Office Application',
                status: status
            }).catch(err => console.error("Failed to send legislative status update email:", err));
        }

        res.json(office);
    } catch (error) {
        console.error("Update Office Status Error:", error);
        res.status(500).json({ error: "Failed to update status" });
    }
};

// --- Public Blog Access ---

export const getOfficeBySlug = async (req: Request, res: Response) => {
    try {
        const slug = requireString(req.params.slug);
        const office = await prisma.legislativeOffice.findUnique({
            where: { username: slug },
            include: {
                posts: {
                    where: { isPublished: true },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!office) return res.status(404).json({ error: "Office not found" });
        if (office.status === 'BLACKLISTED') return res.status(404).json({ error: "Office not found" });
        if (office.status !== 'APPROVED') return res.status(403).json({ error: "Office not active" });

        // Process overviewConfig for dynamic stats
        let overviewData: any = office.overviewConfig || {};
        let rStats = {
            totalStakeholders: 0,
            verifiedProfiles: 0,
            underEvaluation: 0,
            commerceInterest: 0,
        };

        const impactStatsConfig = overviewData.impactStats || {
            totalStakeholders: { isAuto: true, value: 0 },
            verifiedProfiles: { isAuto: true, value: 0 },
            underEvaluation: { isAuto: true, value: 0 },
            commerceInterest: { isAuto: true, value: 0 }
        };

        const needsAutoCount = 
            impactStatsConfig.totalStakeholders?.isAuto ||
            impactStatsConfig.verifiedProfiles?.isAuto ||
            impactStatsConfig.underEvaluation?.isAuto ||
            impactStatsConfig.commerceInterest?.isAuto;

        if (needsAutoCount || true) { // We also need this for craft composition now
             const ccsiProfiles = await prisma.ccsiProfile.findMany({
                 where: { legislativeOfficeId: office.id },
                 select: { status: true, salesChannels: true, primaryCraft: true }
             });

             const totalCount = ccsiProfiles.length;
             const verifiedCount = ccsiProfiles.filter(p => p.status === 'VERIFIED').length;
             const evaluationCount = ccsiProfiles.filter(p => p.status === 'UNDER_REVIEW' || p.status === 'SUBMITTED').length;
             // Naive logic for commerce interest based on having sales channels defined
             const commerceCount = ccsiProfiles.filter(p => {
                 try {
                     const channels = typeof p.salesChannels === 'string' ? JSON.parse(p.salesChannels) : p.salesChannels;
                     return Array.isArray(channels) && channels.length > 0;
                 } catch (e) { return false; }
             }).length;

             rStats.totalStakeholders = impactStatsConfig.totalStakeholders?.isAuto ? totalCount : (impactStatsConfig.totalStakeholders?.value || 0);
             rStats.verifiedProfiles = impactStatsConfig.verifiedProfiles?.isAuto ? verifiedCount : (impactStatsConfig.verifiedProfiles?.value || 0);
             rStats.underEvaluation = impactStatsConfig.underEvaluation?.isAuto ? evaluationCount : (impactStatsConfig.underEvaluation?.value || 0);
             rStats.commerceInterest = impactStatsConfig.commerceInterest?.isAuto ? commerceCount : (impactStatsConfig.commerceInterest?.value || 0);

             // Calculate Dynamic Craft Composition
             const craftCounts: { [key: string]: number } = {};
             ccsiProfiles.forEach(p => {
                 if (p.primaryCraft) {
                     craftCounts[p.primaryCraft] = (craftCounts[p.primaryCraft] || 0) + 1;
                 }
             });

             const sortedCrafts = Object.entries(craftCounts)
                 .sort((a, b) => b[1] - a[1]) // Sort descending by count
                 .map(([name, count]) => ({ name, count }));

             overviewData.craftComposition = sortedCrafts;
        } else {
             rStats.totalStakeholders = impactStatsConfig.totalStakeholders?.value || 0;
             rStats.verifiedProfiles = impactStatsConfig.verifiedProfiles?.value || 0;
             rStats.underEvaluation = impactStatsConfig.underEvaluation?.value || 0;
             rStats.commerceInterest = impactStatsConfig.commerceInterest?.value || 0;
             overviewData.craftComposition = []; // Fallback if no profiles fetched
        }

        overviewData.rStats = rStats;

        res.json({ ...office, overviewData });
    } catch (error) {
        console.error("Get Office By Slug Error:", error);
        res.status(500).json({ error: "Failed to fetch office" });
    }
};

// --- Blog Management ---

export const createBlogPost = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { officeId, title, content, tags, documents, isPublished, isPinned } = req.body;

        // Verify ownership
        const office = await prisma.legislativeOffice.findFirst({
            where: { id: officeId, userId }
        });

        if (!office) return res.status(403).json({ error: "Unauthorized access to office" });
        if (office.status === 'BLACKLISTED') return res.status(403).json({ error: "Office has been restricted. Cannot create posts." });
        if (office.status !== 'APPROVED') return res.status(403).json({ error: "Office not approved yet" });

        const post = await prisma.officeBlogPost.create({
            data: {
                officeId,
                title,
                content,
                tags,
                documents,
                isPublished: isPublished ?? true,
                isPinned: isPinned ?? false
            }
        });

        // Send notifications to subscribers
        if (post.isPublished) {
            try {
                const subscribers = await prisma.officeSubscription.findMany({
                    where: { officeId },
                    include: { user: true }
                });

                const emailPromises = subscribers.map(sub => {
                    if (sub.user?.email) {
                        return EmailService.sendEmail(
                            sub.user.email,
                            EmailTemplates.NOTIFICATION,
                            {
                                subject: `New Update from ${office.representativeName}: ${post.title}`,
                                message: `${office.representativeName} has posted a new update on their LCAD Desk.\n\nTitle: ${post.title}\n\nView it now on the legislative portal!`,
                                username: sub.user.name || 'Subscriber'
                            }
                        );
                    }
                });

                await Promise.allSettled(emailPromises);
            } catch (notifyError) {
                console.error("Failed to notify subscribers:", notifyError);
            }
        }

        res.status(201).json(post);
    } catch (error) {
        console.error("Create Blog Post Error:", error);
        res.status(500).json({ error: "Failed to create post" });
    }
};

export const updateBlogPost = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const id = requireString(req.params.id);
        const { title, content, tags, documents, isPublished, isPinned } = req.body;

        // Verify ownership via office
        const post = await prisma.officeBlogPost.findUnique({
            where: { id },
            include: { office: true }
        });

        if (!post) return res.status(404).json({ error: "Post not found" });
        if (post.office.userId !== userId) return res.status(403).json({ error: "Unauthorized" });

        const updated = await prisma.officeBlogPost.update({
            where: { id },
            data: {
                title,
                content,
                tags,
                documents,
                isPublished,
                isPinned
            }
        });

        res.json(updated);
    } catch (error) {
        console.error("Update Blog Post Error:", error);
        res.status(500).json({ error: "Failed to update post" });
    }
};

export const deleteBlogPost = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const id = requireString(req.params.id);

        // Verify ownership
        const post = await prisma.officeBlogPost.findUnique({
            where: { id },
            include: { office: true }
        });

        if (!post) return res.status(404).json({ error: "Post not found" });
        if (post.office.userId !== userId) return res.status(403).json({ error: "Unauthorized" });

        await prisma.officeBlogPost.delete({ where: { id } });
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Delete Blog Post Error:", error);
        res.status(500).json({ error: "Failed to delete post" });
    }
};

export const getPublicOffices = async (req: Request, res: Response) => {
    try {
        const offices = await prisma.legislativeOffice.findMany({
            where: { status: 'APPROVED' },
            select: {
                id: true,
                representativeName: true,
                designation: true,
                constituency: true,
                district: true,
                legislativeBody: true,
                termStart: true,
                party: true,
                username: true,
                officeImageUrl: true,
                officialEmail: true,
                contactNumber: true,
                craftSectors: true,
                _count: {
                    select: { posts: { where: { isPublished: true } } }
                }
            },
            orderBy: { representativeName: 'asc' }
        });
        res.json(offices);
    } catch (error) {
        console.error("Get Public Offices Error:", error);
        res.status(500).json({ error: "Failed to fetch offices" });
    }
};

export const getPublicPost = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const post = await prisma.officeBlogPost.findUnique({
             where: { id },
             include: { office: true }
        });
        
        if (!post) return res.status(404).json({ error: "Post not found" });
        if (!post.isPublished) return res.status(403).json({ error: "Post not published" });

        // Check if office is blacklisted
        const office = await prisma.legislativeOffice.findUnique({
             where: { id: post.officeId }
        });
        if (office?.status === 'BLACKLISTED') {
             return res.status(404).json({ error: "Office no longer active" });
        }

        res.json(post);
    } catch (error) {
         console.error("Get Public Post Error:", error);
         res.status(500).json({ error: "Failed to fetch post" });
    }
};

export const reportPost = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId; // Optional
        const { postId, reason } = req.body;

        if (!postId || !reason) {
             return res.status(400).json({ error: "Post ID and reason are required" });
        }

        const report = await prisma.blogPostReport.create({
             data: {
                 postId,
                 userId: userId || null,
                 reason
             }
        });

        res.status(201).json({ message: "Report submitted successfully", id: report.id });
    } catch (error) {
        console.error("Report Post Error:", error);
        res.status(500).json({ error: "Failed to submit report" });
    }
};

export const toggleSubscription = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const slug = requireString(req.params.slug);

        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const office = await prisma.legislativeOffice.findUnique({
            where: { username: slug }
        });

        if (!office) return res.status(404).json({ error: "Office not found" });

        const existingSubscription = await prisma.officeSubscription.findUnique({
             where: {
                 userId_officeId: {
                     userId,
                     officeId: office.id
                 }
             }
        });

        if (existingSubscription) {
             // Unsubscribe
             await prisma.officeSubscription.delete({
                  where: { id: existingSubscription.id }
             });
             return res.json({ isSubscribed: false, message: "Unsubscribed successfully" });
        } else {
             // Subscribe
             await prisma.officeSubscription.create({
                  data: {
                      userId,
                      officeId: office.id
                  }
             });
             return res.json({ isSubscribed: true, message: "Subscribed successfully" });
        }
    } catch (error) {
        console.error("Toggle Subscription Error:", error);
        res.status(500).json({ error: "Failed to toggle subscription" });
    }
};

export const checkSubscriptionStatus = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const slug = requireString(req.params.slug);

        if (!userId) return res.json({ isSubscribed: false });

        const office = await prisma.legislativeOffice.findUnique({
            where: { username: slug }
        });

        if (!office) return res.json({ isSubscribed: false });

        const subscription = await prisma.officeSubscription.findUnique({
             where: {
                 userId_officeId: {
                     userId,
                     officeId: office.id
                 }
             }
        });

        res.json({ isSubscribed: !!subscription });
    } catch (error) {
        console.error("Check Subscription Status Error:", error);
        res.json({ isSubscribed: false });
    }
};

export const generateReferralCode = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const office = await prisma.legislativeOffice.findFirst({
            where: { userId }
        });

        if (!office) return res.status(404).json({ error: "Office not found" });

        if (office.referralCode) {
            return res.status(400).json({ error: "Referral code already exists", referralCode: office.referralCode });
        }

        const referralCode = `${office.representativeName.substring(0, 3).toUpperCase()}-${office.constituency.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        const updated = await prisma.legislativeOffice.update({
            where: { id: office.id },
            data: { referralCode }
        });

        res.json(updated);
    } catch (error) {
        console.error("Generate Referral Code Error:", error);
        res.status(500).json({ error: "Failed to generate referral code" });
    }
};
