import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { requireString } from "../utils/routeHelpers";

export const getStakeholdersAdmin = async (req: Request, res: Response) => {
    try {
        const { status, category, district, search } = req.query;

        // Where clauses for Individual
        const indWhere: any = {};
        if (status) indWhere.status = String(status);
        if (category) indWhere.category = String(category);
        if (district) indWhere.district = String(district);
        if (search) {
            indWhere.OR = [
                { fullName: { contains: String(search), mode: 'insensitive' } },
                { email: { contains: String(search), mode: 'insensitive' } },
                { organization: { contains: String(search), mode: 'insensitive' } },
            ];
        }

        // Where clauses for Institution
        const instWhere: any = {};
        if (status) instWhere.status = String(status);
        if (category) instWhere.category = String(category);
        if (district) instWhere.districtCity = String(district);
        if (search) {
            instWhere.OR = [
                { institutionName: { contains: String(search), mode: 'insensitive' } },
                { email: { contains: String(search), mode: 'insensitive' } },
            ];
        }

        const individuals = await prisma.skcStakeholderRegistration.findMany({
            where: indWhere,
            orderBy: { submittedAt: 'desc' }
        });

        const institutions = await prisma.skcInstitutionRegistration.findMany({
            where: instWhere,
            orderBy: { submittedAt: 'desc' }
        });

        // Normalize to common format
        const combined = [
            ...individuals.map((ind) => ({
                id: ind.id,
                type: 'INDIVIDUAL',
                referenceNumber: ind.referenceNumber,
                name: ind.fullName,
                organization: ind.organization || null,
                category: ind.category,
                district: ind.district,
                craftSector: ind.craftSector,
                email: ind.email,
                phone: ind.phone,
                status: ind.status,
                submittedAt: ind.submittedAt
            })),
            ...institutions.map((inst) => ({
                id: inst.id,
                type: 'INSTITUTION',
                referenceNumber: inst.referenceNumber,
                name: inst.institutionName,
                organization: inst.institutionName,
                category: inst.category,
                district: inst.districtCity,
                craftSector: inst.areasOfExpertise?.[0] || 'Multiple/Other',
                email: inst.email,
                phone: inst.phone,
                status: inst.status,
                submittedAt: inst.submittedAt
            }))
        ];

        // Sort combined
        combined.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());

        return res.json({ success: true, data: combined });
    } catch (error: any) {
        console.error('getStakeholdersAdmin error:', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch stakeholder registrations.' });
    }
};

export const updateStakeholderStatus = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const { status, type } = req.body; // Expecting type to know which table to update
        
        if (!['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status value.' });
        }

        if (type === 'INSTITUTION') {
             const updated = await prisma.skcInstitutionRegistration.update({
                 where: { id },
                 data: { status }
             });
             return res.json({ success: true, data: updated });
        } else {
             const updated = await prisma.skcStakeholderRegistration.update({
                 where: { id },
                 data: { status }
             });
             return res.json({ success: true, data: updated });
        }
    } catch (error: any) {
        console.error('updateStakeholderStatus error:', error);
        return res.status(500).json({ success: false, error: 'Failed to update stakeholder status.' });
    }
};

export const registerStakeholder = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const count = await prisma.skcStakeholderRegistration.count();
        const referenceNumber = `SKC-STK-${String(count + 1).padStart(6, '0')}`;

        const stakeholder = await prisma.skcStakeholderRegistration.create({
            data: {
                referenceNumber,
                fullName: data.fullName,
                organization: data.organization,
                category: data.category,
                designation: data.designation,
                district: data.district,
                craftSector: data.craftSector,
                email: data.email,
                phone: data.phone,
                website: data.website,
                participationModes: data.participationModes || [],
                participationScope: data.participationScope || 'BOTH',
                consent: data.consent,
                consentAt: new Date()
            }
        });

        res.json({ success: true, data: stakeholder });
    } catch (error: any) {
        console.error("Stakeholder Registration Error:", error);
        res.status(500).json({ success: false, error: "Failed to submit stakeholder registration" });
    }
};

export const getStakeholdersStatsPublic = async (req: Request, res: Response) => {
    try {
        const verifiedStakeholders = await prisma.skcStakeholderRegistration.count({
            where: { status: 'APPROVED' }
        });
        const unverifiedStakeholders = await prisma.skcStakeholderRegistration.count({
            where: { status: { not: 'APPROVED' } }
        });
        const participatingInstitutions = await prisma.skcInstitutionRegistration.count({
            where: { status: 'APPROVED' }
        });
        const stakeholderCategories = await prisma.skcStakeholderRegistration.groupBy({
            by: ['category'],
            _count: { category: true },
            where: { status: 'APPROVED' }
        });
        const institutionDistricts = await prisma.skcInstitutionRegistration.findMany({
            where: { status: 'APPROVED' },
            select: { districtCity: true }
        });
        const activeDistricts = new Set(institutionDistricts.map(d => d.districtCity)).size;

        return res.json({
            success: true,
            data: {
                verifiedStakeholders,
                unverifiedStakeholders,
                participatingInstitutions,
                activeDistricts,
                stakeholderCategories
            }
        });
    } catch (error: any) {
        console.error('getStakeholdersStatsPublic error:', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch public stats.' });
    }
};

export const getStakeholdersPublic = async (req: Request, res: Response) => {
    try {
        const stakeholders = await prisma.skcStakeholderRegistration.findMany({
            where: { status: 'APPROVED' },
            select: {
                referenceNumber: true,
                fullName: true,
                organization: true,
                category: true,
                district: true,
                country: true,
                locationType: true,
                craftSector: true
            },
            orderBy: { submittedAt: 'desc' }
        });

        return res.json({ success: true, data: stakeholders });
    } catch (error: any) {
        console.error('getStakeholdersPublic error:', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch public stakeholders.' });
    }
};

export const getStakeholderByReference = async (req: Request, res: Response) => {
    try {
        const referenceNumber = requireString(req.params.referenceNumber);
        const stakeholder = await prisma.skcStakeholderRegistration.findUnique({
            where: { referenceNumber }
        });

        if (stakeholder) {
            return res.json({ success: true, data: { ...stakeholder, type: 'INDIVIDUAL' } });
        }

        const institution = await prisma.skcInstitutionRegistration.findUnique({
            where: { referenceNumber }
        });

        if (institution) {
            return res.json({ success: true, data: { ...institution, type: 'INSTITUTION' } });
        }

        return res.status(404).json({ success: false, error: 'Registration not found' });
    } catch (error: any) {
        console.error('getStakeholderByReference error:', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch registration.' });
    }
};

export const getRegistrationStatusForUser = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const individual = await prisma.skcStakeholderRegistration.findFirst({
            where: { userId: user.id, status: 'APPROVED' },
            orderBy: { submittedAt: 'desc' }
        });

        const institution = await prisma.skcInstitutionRegistration.findFirst({
            where: { userId: user.id, status: 'APPROVED' },
            orderBy: { submittedAt: 'desc' }
        });

        if (individual) {
            return res.json({
                success: true,
                hasRegistration: true,
                registration: {
                    referenceNumber: individual.referenceNumber,
                    fullName: individual.fullName,
                    organizationName: individual.organization,
                    registrationType: 'INDIVIDUAL',
                    categoryLabel: individual.category,
                    district: individual.district,
                    craftSector: individual.craftSector,
                    email: individual.email,
                    status: individual.status
                },
                workspaceAccess: {
                    status: 'ACTIVE'
                }
            });
        }

        if (institution) {
            return res.json({
                success: true,
                hasRegistration: true,
                registration: {
                    referenceNumber: institution.referenceNumber,
                    fullName: institution.representativeName,
                    organizationName: institution.institutionName,
                    registrationType: 'INSTITUTION',
                    categoryLabel: institution.category,
                    district: institution.districtCity,
                    craftSector: institution.areasOfExpertise?.[0] || "",
                    email: institution.email,
                    status: institution.status
                },
                workspaceAccess: {
                    status: 'ACTIVE'
                }
            });
        }

        return res.json({
            success: true,
            hasRegistration: false,
            registration: null,
            workspaceAccess: null
        });
    } catch (error: any) {
        console.error('getRegistrationStatusForUser error:', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch registration status.' });
    }
};

export const recoverReferenceByEmail = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email?.trim()) {
            return res.status(400).json({ success: false, error: 'Email address is required.' });
        }
        
        const emailLower = email.trim().toLowerCase();
        
        const stakeholder = await prisma.skcStakeholderRegistration.findFirst({
            where: { email: emailLower },
            orderBy: { submittedAt: 'desc' }
        });

        const institution = await prisma.skcInstitutionRegistration.findFirst({
            where: { email: emailLower },
            orderBy: { submittedAt: 'desc' }
        });

        if (!stakeholder && !institution) {
            return res.status(404).json({ success: false, error: 'No registrations found associated with this email.' });
        }

        const results = [];
        if (stakeholder) results.push({ type: 'INDIVIDUAL', referenceNumber: stakeholder.referenceNumber, name: stakeholder.fullName, status: stakeholder.status });
        if (institution) results.push({ type: 'INSTITUTION', referenceNumber: institution.referenceNumber, name: institution.institutionName, status: institution.status });

        return res.status(200).json({ success: true, results });
    } catch (error: any) {
        console.error('recoverReferenceByEmail error:', error);
        return res.status(500).json({ success: false, error: 'Failed to recover reference number.' });
    }
};
