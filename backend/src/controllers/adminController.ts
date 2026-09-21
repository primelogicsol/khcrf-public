import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { requireString } from "../utils/routeHelpers";

// --- Office Management ---

export const getAllOffices = async (req: Request, res: Response) => {
    try {
        const offices = await prisma.legislativeOffice.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                representativeName: true,
                constituency: true,
                status: true,
                username: true
            }
        });
        res.json(offices);
    } catch (error) {
        console.error("Get All Offices Error:", error);
        res.status(500).json({ error: "Failed to fetch offices" });
    }
};

export const blacklistOffice = async (req: Request, res: Response) => {
    try {
        const { officeId } = req.body;
        
        const existingOffice = await prisma.legislativeOffice.findUnique({
            where: { id: officeId },
            select: { status: true }
        });

        if (!existingOffice) {
            return res.status(404).json({ error: "Office not found" });
        }

        const newStatus = existingOffice.status === 'BLACKLISTED' ? 'APPROVED' : 'BLACKLISTED';

        const office = await prisma.legislativeOffice.update({
            where: { id: officeId },
            data: { status: newStatus }
        });

        res.json({ message: `Office ${newStatus === 'BLACKLISTED' ? 'blacklisted' : 'activated'} successfully`, office });
    } catch (error) {
        console.error("Blacklist/Activate Office Error:", error);
        res.status(500).json({ error: "Failed to update office status" });
    }
};

// --- Report Management ---

export const getReportedPosts = async (req: Request, res: Response) => {
    try {
        const reports = await prisma.blogPostReport.findMany({
            where: { status: 'PENDING' },
            include: {
                post: {
                    include: {
                        office: {
                            select: { representativeName: true, constituency: true }
                        }
                    }
                },
                user: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(reports);
    } catch (error) {
        console.error("Get Reported Posts Error:", error); 
        res.status(500).json({ error: "Failed to fetch reports" });
    }
};

export const getHiddenPosts = async (req: Request, res: Response) => {
    try {
        const hiddenPosts = await prisma.officeBlogPost.findMany({
            where: { isTakedown: true },
            include: {
                 office: {
                     select: { representativeName: true, constituency: true }
                 }
            },
            orderBy: { updatedAt: 'desc' }
        });
        res.json(hiddenPosts);
    } catch (error) {
        console.error("Get Hidden Posts Error:", error);
        res.status(500).json({ error: "Failed to fetch hidden posts" });
    }
};

export const resolveReport = async (req: Request, res: Response) => {
    try {
        const reportId = requireString(req.params.reportId);
        const { action } = req.body; // 'DELETE_POST' or 'DISMISS'

        console.log(`Resolving report ${reportId} with action ${action}`);

        const report = await prisma.blogPostReport.findUnique({
            where: { id: reportId },
            include: { post: true }
        });

        if (!report) {
            console.log("Report not found");
            return res.status(404).json({ error: "Report not found" });
        }

        if (action === 'DELETE_POST') {
            console.log(`Taking down post ${report.postId}`);
            // Instead of deleting, mark as takedown
            await prisma.officeBlogPost.update({
                where: { id: report.postId },
                data: { isTakedown: true }
            });
            
            // Mark report as resolved
            await prisma.blogPostReport.update({
                where: { id: reportId },
                data: { status: 'RESOLVED' }
            });

            return res.json({ message: "Post taken down and report resolved" });
        } else if (action === 'DISMISS') {
            console.log("Dismissing report");
            await prisma.blogPostReport.update({
                where: { id: reportId },
                data: { status: 'DISMISSED' }
            });
            return res.json({ message: "Report dismissed" });
        } else {
             return res.status(400).json({ error: "Invalid action" });
        }
    } catch (error) {
        console.error("Resolve Report Error:", error);
        res.status(500).json({ error: "Failed to resolve report", details: error instanceof Error ? error.message : String(error) });
    }
};

export const restorePost = async (req: Request, res: Response) => {
    try {
        const { postId } = req.body;
        
        await prisma.officeBlogPost.update({
            where: { id: postId },
            data: { isTakedown: false }
        });

        res.json({ message: "Post restored successfully" });
    } catch (error) {
        console.error("Restore Post Error:", error);
        res.status(500).json({ error: "Failed to restore post" });
    }
};

// --- Dashboard Stats ---

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(today.getMonth() - 5);
        sixMonthsAgo.setDate(1); // Start of the month 6 months ago

        // Helper to get monthly data
        const getMonthlyData = async (model: any, dateField = 'createdAt', sumField?: string, extraWhere: any = {}) => {
             // Prisma doesn't support easy month grouping without raw queries, so we'll fetch and aggregate in JS for now (assuming scale isn't massive yet)
             // or use separate queries per month. For efficiency with small-medium data, fetching limited fields is fine.
             // Better for production: raw query. implementing raw query for Postgres.
             
             // However, to be database agnostic or safely typed, we can loop 6 months.
             const months = [];
             for(let i=0; i<6; i++) {
                 const d = new Date();
                 d.setMonth(today.getMonth() - i);
                 const start = new Date(d.getFullYear(), d.getMonth(), 1);
                 const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
                 months.push({ start, end, label: start.toLocaleString('default', { month: 'short' }) });
             }
             months.reverse();

             const stats = await Promise.all(months.map(async (m) => {
                 if (sumField) {
                     const agg = await model.aggregate({
                         _sum: { [sumField]: true },
                         where: { ...extraWhere, [dateField]: { gte: m.start, lte: m.end } }
                     });
                     return agg._sum[sumField] || 0;
                 } else {
                    return await model.count({
                        where: { ...extraWhere, [dateField]: { gte: m.start, lte: m.end } }
                    });
                 }
             }));
             return { labels: months.map(m => m.label), data: stats };
        };

        const [
            usersCount,
            partnersCount,
            jobAppsCount,
            grantAppsCount,
            accreditationAppsCount,
            evaluationsCount,
            listingsCount,
            donationsSum,
            offlineVerifiedSum,
            certificationsSum,
            publicationSalesSum,
            membershipSum,
            otherSum,
            legislativeOfficesCount,
            contactSubmissionsCount
        ] = await Promise.all([
            prisma.user.count(),
            prisma.partnerApplication.count(),
            prisma.jobApplication.count(),
            prisma.grantApplication.count(),
            prisma.accreditationApplication.count(),
            prisma.evaluationSubmission.count(),
            prisma.listing.count(),
            prisma.donationTransaction.aggregate({
                _sum: { amount: true },
                where: { status: 'CAPTURED' }
            }),
            // Include verified offline payments (VERIFIED = digital, CLEARED = cheque/DD)
            prisma.offlinePaymentSubmission.aggregate({
                _sum: { amount: true },
                where: { paymentStatus: { in: ['VERIFIED', 'CLEARED'] } }
            }),
            prisma.certification.aggregate({ _sum: { amount: true } }),
            prisma.userPurchase.aggregate({ _sum: { amount: true } }),
            prisma.transaction.aggregate({
                _sum: { amount: true },
                where: {
                    entityType: 'MEMBERSHIP',
                    OR: [
                        { status: 'SUCCESS' },
                        { status: 'CAPTURED' },
                        { status: 'success' }
                    ]
                }
            }),
            prisma.transaction.aggregate({
                _sum: { amount: true },
                where: {
                    OR: [
                        { status: 'SUCCESS' },
                        { status: 'CAPTURED' },
                        { status: 'success' }
                    ],
                    NOT: [
                        { entityType: 'MEMBERSHIP' }
                    ]
                }
            }),
            prisma.legislativeOffice.count(),
            prisma.contactSubmission.count()
        ]);

        // Historical Data for Graphs
        const revenueHistory = await getMonthlyData(prisma.userPurchase, 'purchaseDate', 'amount');
        const donationHistory = await getMonthlyData(prisma.donationTransaction, 'capturedAt', 'amount', { status: 'CAPTURED' });
        const certHistory = await getMonthlyData(prisma.certification, 'createdAt', 'amount');
        const membershipHistory = await getMonthlyData(prisma.transaction, 'createdAt', 'amount', {
            entityType: 'MEMBERSHIP',
            OR: [
                { status: 'SUCCESS' },
                { status: 'CAPTURED' },
                { status: 'success' }
            ]
        });
        const otherHistory = await getMonthlyData(prisma.transaction, 'createdAt', 'amount', {
            OR: [
                { status: 'SUCCESS' },
                { status: 'CAPTURED' },
                { status: 'success' }
            ],
            NOT: [
                { entityType: 'MEMBERSHIP' }
            ]
        });
        
        const combinedRevenue = revenueHistory.labels.map((label, index) => ({
            name: label,
            revenue: (revenueHistory.data[index] as number) +
                     (donationHistory.data[index] as number) +
                     (certHistory.data[index] as number) +
                     (membershipHistory.data[index] as number) +
                     (otherHistory.data[index] as number)
        }));

        const applicationsHistory = await getMonthlyData(prisma.partnerApplication, 'createdAt'); // Just partners for now, or total?
        const grantHistory = await getMonthlyData(prisma.grantApplication, 'createdAt');
        
        const combinedApps = applicationsHistory.labels.map((label, index) => ({
             name: label,
             partners: applicationsHistory.data[index],
             grants: grantHistory.data[index]
        }));


        // Compute real month-over-month % change for total revenue
        const lastMonthRevenue = combinedRevenue.length >= 2
            ? (combinedRevenue[combinedRevenue.length - 2].revenue as number)
            : 0;
        const thisMonthRevenue = combinedRevenue.length >= 1
            ? (combinedRevenue[combinedRevenue.length - 1].revenue as number)
            : 0;
        let monthOverMonth = '0%';
        if (lastMonthRevenue > 0) {
            const pct = ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
            monthOverMonth = `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
        } else if (thisMonthRevenue > 0) {
            monthOverMonth = '+100%'; // First month with revenue
        }

        const onlineDonations = parseFloat(String(donationsSum._sum.amount || 0));
        const offlineDonations = parseFloat(String(offlineVerifiedSum._sum.amount || 0));
        const totalDonations = onlineDonations + offlineDonations;

        const stats = {
            counts: {
                users: usersCount,
                partners: partnersCount,
                jobApplications: jobAppsCount,
                grants: grantAppsCount,
                accreditations: accreditationAppsCount,
                evaluations: evaluationsCount,
                listings: listingsCount,
                legislativeOffices: legislativeOfficesCount,
                contactSubmissions: contactSubmissionsCount
            },
            revenue: {
                donations: totalDonations,
                onlineDonations,
                offlineDonations,
                certifications: parseFloat(String(certificationsSum._sum.amount || 0)),
                publications: parseFloat(String(publicationSalesSum._sum.amount || 0)),
                memberships: parseFloat(String(membershipSum._sum.amount || 0)),
                other: parseFloat(String(otherSum._sum.amount || 0)),
                total: totalDonations +
                       parseFloat(String(certificationsSum._sum.amount || 0)) +
                       parseFloat(String(publicationSalesSum._sum.amount || 0)) +
                       parseFloat(String(membershipSum._sum.amount || 0)) +
                       parseFloat(String(otherSum._sum.amount || 0))
            },
            graphs: {
                revenue: combinedRevenue,
                applications: combinedApps
            },
            monthOverMonth,
        };

        res.json(stats);
    } catch (error) {
        console.error("Get Dashboard Stats Error:", error);
        res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
};

// --- User Management ---

export const getUserLoginHistory = async (req: Request, res: Response) => {
    try {
        const userId = requireString(req.params.userId);
        
        const user = await prisma.user.findUnique({
             where: { id: userId },
             select: { currentSessionId: true }
        });

        const history = await prisma.loginHistory.findMany({
            where: { userId },
            orderBy: { loginAt: 'desc' },
            take: 50 // Limit to last 50 logins
        });
        
        const historyWithActiveStatus = history.map(log => ({
            ...log,
            isActive: log.sessionId && user?.currentSessionId && log.sessionId === user.currentSessionId
        }));

        res.json(historyWithActiveStatus);
    } catch (error) {
        console.error("Get User Login History Error:", error);
        res.status(500).json({ error: "Failed to fetch login history" });
    }
};

export const getPublicationCSVTemplate = async (req: Request, res: Response) => {
    try {
        const headers = [
            'title',
            'subtitle',
            'author',
            'published',
            'category',
            'price',
            'pages',
            'description',
            'language',
            'type'
        ];
        
        // Add a sample row to guide the user (ensure commas in text are escaped if needed, keeping it simple for now)
        const sampleRow = [
            'Sample Book Title',
            'An Inspiring Subtitle',
            'John Doe',
            '2024',
            'Research',
            '19.99',
            '300',
            '"A brief description, in quotes if containing commas"',
            'English',
            'PDF'
        ];

        const csvContent = [
            headers.join(','),
            sampleRow.join(',')
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=publication_import_template.csv');
        res.status(200).send(csvContent);
    } catch (error) {
        console.error("Get CSV Template Error:", error);
        res.status(500).json({ error: "Failed to generate CSV template" });
    }
};

// --- CCSI Profiles Management ---

export const getAllCcsiProfiles = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, search, status, craft, constituency } = req.query;

        const where: any = {};

        if (status && status !== 'ALL') where.status = status;
        if (craft) where.primaryCraft = craft;
        if (constituency && constituency !== 'ALL') {
            where.legislativeOffice = {
                constituency: {
                    equals: String(constituency),
                    mode: 'insensitive'
                }
            };
        }
        if (search) {
            where.OR = [
                { fullName: { contains: String(search), mode: 'insensitive' } },
                { primaryContact: { contains: String(search) } },
                { businessName: { contains: String(search), mode: 'insensitive' } },
                { email: { contains: String(search), mode: 'insensitive' } }
            ];
        }

        const profiles = await prisma.ccsiProfile.findMany({
            where,
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
            orderBy: { createdAt: 'desc' },
            include: {
                legislativeOffice: {
                    select: {
                        id: true,
                        username: true,
                        representativeName: true,
                        constituency: true
                    }
                }
            }
        });

        const total = await prisma.ccsiProfile.count({ where });

        res.json({
            data: profiles,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit))
        });
    } catch (error) {
        console.error("Get All CCSI Profiles Error:", error);
        res.status(500).json({ error: "Failed to fetch CCSI profiles" });
    }
};

export const getCcsiProfileById = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);

        const profile = await prisma.ccsiProfile.findUnique({
            where: { id },
            include: {
                legislativeOffice: {
                    select: {
                        id: true,
                        username: true,
                        representativeName: true,
                        constituency: true
                    }
                }
            }
        });

        if (!profile) {
            return res.status(404).json({ error: "CCSI Profile not found" });
        }

        res.json(profile);
    } catch (error) {
        console.error("Get CCSI Profile By ID Error:", error);
        res.status(500).json({ error: "Failed to fetch CCSI profile" });
    }
};

export const updateCcsiProfile = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const updateData = req.body;

        const profile = await prisma.ccsiProfile.update({
            where: { id },
            data: updateData
        });

        res.json(profile);
    } catch (error: any) {
        console.error("Update CCSI Profile Error:", error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "CCSI Profile not found" });
        }
        res.status(500).json({ error: "Failed to update CCSI profile" });
    }
};

export const updateCcsiProfileStatus = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: "Status is required" });
        }

        const profile = await prisma.ccsiProfile.update({
            where: { id },
            data: { status }
        });

        res.json(profile);
    } catch (error: any) {
        console.error("Update CCSI Profile Status Error:", error);
         if (error.code === 'P2025') {
            return res.status(404).json({ error: "CCSI Profile not found" });
        }
        res.status(500).json({ error: "Failed to update CCSI profile status" });
    }
};

export const deleteCcsiProfile = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const actorId = (req as any).user?.userId;

        const profile = await prisma.ccsiProfile.findUnique({ where: { id } });
        if (!profile) {
            return res.status(404).json({ error: "CCSI Profile not found" });
        }

        // Soft-delete: archive rather than destroy
        await prisma.ccsiProfile.update({
            where: { id },
            data: { status: 'ARCHIVED' }
        });

        // Audit trail
        await prisma.auditLog.create({
            data: {
                userId: actorId || null,
                action: 'CCSI_PROFILE_ARCHIVED',
                details: JSON.stringify({ entityType: 'CcsiProfile', entityId: id, previousStatus: profile.status, reason: 'Admin soft-delete' })
            }
        }).catch(() => {}); // Non-fatal if audit schema differs

        res.json({ success: true, message: "CCSI Profile archived successfully. It can be restored by an admin." });
    } catch (error: any) {
        console.error("Archive CCSI Profile Error:", error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "CCSI Profile not found" });
        }
        res.status(500).json({ error: "Failed to archive CCSI profile" });
    }
};


export const getRecentActivity = async (req: Request, res: Response) => {
    try {
        const [users, partners, grants, jobs, donations] = await Promise.all([
            prisma.user.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, name: true, createdAt: true } }),
            prisma.partnerApplication.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, orgName: true, createdAt: true } }),
            prisma.grantApplication.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, applicantName: true, createdAt: true } }),
            prisma.jobApplication.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, fullName: true, createdAt: true } }),
            prisma.donationTransaction.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                where: { status: 'CAPTURED' },
                select: {
                    id: true,
                    amount: true,
                    createdAt: true,
                    donor: { select: { name: true } },
                    donationIntent: { select: { name: true } }
                }
            })
        ]);

        const activities: any[] = [];

        users.forEach(u => activities.push({
            id: `user-${u.id}`,
            user: u.name || "New User",
            action: "joined as a new member",
            time: u.createdAt,
            type: 'user'
        }));

        partners.forEach(p => activities.push({
            id: `partner-${p.id}`,
            user: p.orgName || "Organization",
            action: "submitted a partner application",
            time: p.createdAt,
            type: 'partner'
        }));

        grants.forEach(g => activities.push({
            id: `grant-${g.id}`,
            user: g.applicantName || "Applicant",
            action: "submitted a new grant application",
            time: g.createdAt,
            type: 'grant'
        }));

        jobs.forEach(j => activities.push({
            id: `job-${j.id}`,
            user: j.fullName || "Someone",
            action: "applied for a job",
            time: j.createdAt,
            type: 'job'
        }));

        donations.forEach((d: any) => activities.push({
            id: `donation-${d.id}`,
            user: d.donor?.name || d.donationIntent?.name || "Anonymous Donor",
            action: `made a donation of ₹${d.amount}`,
            time: d.createdAt,
            type: 'donation'
        }));

        activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

        res.json(activities.slice(0, 10));
    } catch (error) {
        console.error("Get Recent Activity Error:", error);
        res.status(500).json({ error: "Failed to fetch recent activity" });
    }
};
