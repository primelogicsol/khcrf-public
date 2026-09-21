import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { requireString } from "../utils/routeHelpers";

const PARTICIPATION_SCOPE = [
  "KHCRF",
  "SKC",
  "BOTH",
] as const;

export const institutionalRegistrySchema = z.object({
  participationScope: z.enum(PARTICIPATION_SCOPE),
  institutionName: z
    .string()
    .trim()
    .min(2, "Institution name must be at least 2 characters long")
    .max(200),
  category: z.string().trim().min(2, "Institution category is required"),
  representativeName: z
    .string()
    .trim()
    .min(2, "Representative name is required")
    .max(150),
  designation: z
    .string()
    .trim()
    .min(2, "Designation is required")
    .max(150),
  districtCity: z.string().trim().min(1, "District is required"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid official email address"),
  phone: z
    .string()
    .trim()
    .min(7, "Phone number must be at least 7 digits long"),
  country: z.string().trim().min(1, "Country is required"),
  stateProvince: z.string().trim().optional().nullable().transform(val => val || null),
  website: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((value) => value || null),
  participationTypes: z.union([z.array(z.string()), z.string()]).transform(val => {
    if (Array.isArray(val)) return val;
    try {
      return JSON.parse(val);
    } catch {
      return [val];
    }
  }),
  areasOfExpertise: z.union([z.array(z.string()), z.string()]).optional().nullable().transform(val => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try {
      return JSON.parse(val);
    } catch {
      return [val];
    }
  }),
  profile: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .nullable()
    .transform((value) => value || null),
  proposedContribution: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .nullable()
    .transform((value) => value || null),
  authConsent: z.union([z.boolean(), z.string()]).transform(val => val === true || val === 'true'),
  privacyConsent: z.union([z.boolean(), z.string()]).transform(val => val === true || val === 'true'),
  publicDirectoryConsent: z.union([z.boolean(), z.string()]).optional().nullable().transform(val => val === true || val === 'true'),
  communicationsConsent: z.union([z.boolean(), z.string()]).optional().nullable().transform(val => val === true || val === 'true'),
});

// Public registration — unified KHCRF + SKC form
export const registerInstitution = async (req: Request, res: Response) => {
    try {
        const parsed = institutionalRegistrySchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                error: "Please correct the highlighted fields.",
                fieldErrors: parsed.error.flatten().fieldErrors,
            });
        }

        const body = parsed.data;

        if (!body.authConsent) {
            return res.status(400).json({
                success: false,
                error: "Authorization statement is required.",
                fieldErrors: { authConsent: ["Authorization statement is required."] }
            });
        }
        if (!body.privacyConsent) {
            return res.status(400).json({
                success: false,
                error: "Privacy policy acceptance is required.",
                fieldErrors: { privacyConsent: ["Privacy policy acceptance is required."] }
            });
        }

        // Composite duplicate check
        const existing = await prisma.skcInstitutionRegistration.findFirst({
            where: {
                email: body.email,
                institutionName: body.institutionName,
                participationScope: body.participationScope
            }
        });

        if (existing) {
            return res.status(409).json({
                success: false,
                error: "An institutional profile already exists with this official email and institution name."
            });
        }

        // Reference number: scope-prefixed
        const prefix = 'SKC-INS';
        const count = await prisma.skcInstitutionRegistration.count();
        const referenceNumber = `${prefix}-${String(count + 1).padStart(6, '0')}`;

        const now = new Date();
        const registration = await prisma.skcInstitutionRegistration.create({
            data: {
                referenceNumber,
                participationScope: body.participationScope,
                institutionName: body.institutionName,
                category: body.category,
                representativeName: body.representativeName,
                designation: body.designation,
                email: body.email,
                phone: body.phone,
                country: body.country,
                stateProvince: body.stateProvince,
                districtCity: body.districtCity,
                primaryLocation: body.districtCity || body.country || null,
                website: body.website,
                participationTypes: body.participationTypes,
                areasOfExpertise: body.areasOfExpertise,
                profile: body.profile,
                proposedContribution: body.proposedContribution,
                authConsent: true,
                authConsentAt: now,
                privacyConsent: true,
                privacyConsentAt: now,
                publicDirectoryConsent: body.publicDirectoryConsent || false,
                communicationsConsent: body.communicationsConsent || false,
                communicationsConsentAt: body.communicationsConsent ? now : null,
                status: 'SUBMITTED',
            }
        });

        // Also create a PartnerApplication if scope is BOTH or KHCRF
        if (body.participationScope === 'BOTH' || body.participationScope === 'KHCRF') {
            await prisma.partnerApplication.create({
                data: {
                    orgName: body.institutionName,
                    website: body.website,
                    contactName: body.representativeName,
                    email: body.email,
                    phone: body.phone,
                    country: body.country,
                    collaborationAreas: body.areasOfExpertise,
                    collaborationType: body.participationTypes,
                    projectDescription: body.profile || body.proposedContribution || null,
                    status: 'APPROVED', // Approve it so it shows up in public registry immediately
                }
            }).catch(err => console.error('Failed to create companion PartnerApplication:', err));
        }

        return res.status(201).json({
            success: true,
            message: "Institutional profile submitted successfully.",
            data: {
                id: registration.id,
                status: registration.status,
                referenceNumber: registration.referenceNumber,
                confirmationUrl: `/state-of-kashmir-crafts/stakeholder-registry/institution-confirmation/${registration.referenceNumber}`
            }
        });
    } catch (error: any) {
        console.error('registerInstitution error:', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return res.status(409).json({
                success: false,
                error: "A registration with this reference number or unique fields already exists."
            });
        }
        return res.status(500).json({
            success: false,
            error: 'We could not process your registration. Please try again.',
            details: process.env.NODE_ENV !== 'production' ? error.message : undefined
        });
    }
};

// Get all registrations (Admin)
export const getRegistrationsAdmin = async (req: Request, res: Response) => {
    try {
        const { status, category, location, search } = req.query;
        const where: any = {};
        if (status) where.status = String(status);
        if (category) where.category = String(category);
        if (location) where.primaryLocation = String(location);
        if (search) {
            where.OR = [
                { institutionName: { contains: String(search), mode: 'insensitive' } },
                { email: { contains: String(search), mode: 'insensitive' } },
                { representativeName: { contains: String(search), mode: 'insensitive' } },
            ];
        }
        const registrations = await prisma.skcInstitutionRegistration.findMany({
            where,
            orderBy: { submittedAt: 'desc' }
        });
        return res.json({ success: true, data: registrations });
    } catch (error: any) {
        console.error('getRegistrationsAdmin error:', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch registrations.' });
    }
};

// Update registration status (Admin)
export const updateRegistrationStatus = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const { status, reviewerNotes, assignedReviewerId } = req.body;
        const data: any = {};
        if (status) { data.status = status; data.reviewedAt = new Date(); }
        if (reviewerNotes !== undefined) data.reviewerNotes = reviewerNotes;
        if (assignedReviewerId !== undefined) data.assignedReviewerId = assignedReviewerId;
        if (status === 'VERIFIED') data.verifiedAt = new Date();
        if (status === 'APPROVED') data.approvedAt = new Date();

        const updated = await prisma.skcInstitutionRegistration.update({ where: { id }, data });
        return res.json({ success: true, data: updated });
    } catch (error: any) {
        console.error('updateRegistrationStatus error:', error);
        return res.status(500).json({ success: false, error: 'Failed to update registration.' });
    }
};

// Get all institutions (Admin)
export const getInstitutionsAdmin = async (req: Request, res: Response) => {
    try {
        const institutions = await prisma.skcInstitution.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: institutions });
    } catch (error: any) {
        console.error('Error fetching admin institutions:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch institutions' });
    }
};

// Create an institution (Admin)
export const createInstitution = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        if (!data.name || !data.type) {
            return res.status(400).json({ success: false, error: 'Name and type are required.' });
        }
        
        const institution = await prisma.skcInstitution.create({
            data: {
                name: data.name,
                type: data.type,
                district: data.district || null,
                contactPerson: data.contactPerson || null,
                email: data.email || null,
                status: data.status || 'ACTIVE',
                participationType: data.participationType || null
            }
        });
        res.status(201).json({ success: true, data: institution });
    } catch (error: any) {
        console.error('Error creating institution:', error);
        res.status(500).json({ success: false, error: 'Failed to create institution' });
    }
};

// Update an institution (Admin)
export const updateInstitution = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const data = req.body;
        
        const updateData: any = {};
        if (data.name) updateData.name = data.name;
        if (data.type) updateData.type = data.type;
        if (data.district !== undefined) updateData.district = data.district;
        if (data.contactPerson !== undefined) updateData.contactPerson = data.contactPerson;
        if (data.email !== undefined) updateData.email = data.email;
        if (data.status) updateData.status = data.status;
        if (data.participationType !== undefined) updateData.participationType = data.participationType;

        const institution = await prisma.skcInstitution.update({
            where: { id },
            data: updateData
        });
        res.json({ success: true, data: institution });
    } catch (error: any) {
        console.error('Error updating institution:', error);
        res.status(500).json({ success: false, error: 'Failed to update institution' });
    }
};

// Delete an institution (Admin)
export const deleteInstitution = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        await prisma.skcInstitution.delete({ where: { id } });
        res.json({ success: true, message: 'Institution deleted' });
    } catch (error: any) {
        console.error('Error deleting institution:', error);
        res.status(500).json({ success: false, error: 'Failed to delete institution' });
    }
};

// Get active institutions count/list (Public) — only safe public fields
export const getInstitutionsPublic = async (req: Request, res: Response) => {
    try {
        const institutions = await prisma.skcInstitution.findMany({
            where: { status: 'ACTIVE' },
            orderBy: { name: 'asc' },
            select: { id: true, name: true, type: true, district: true, status: true, participationType: true }
        });
        res.json({ success: true, data: institutions });
    } catch (error: any) {
        console.error('Error fetching public institutions:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch public institutions' });
    }
};

// Retrieve institution registration profile by reference number
export const getInstitutionRegistrationByReference = async (req: Request, res: Response) => {
    try {
        const referenceNumber = requireString(req.params.referenceNumber);
        const registration = await prisma.skcInstitutionRegistration.findFirst({
            where: { referenceNumber }
        });
        if (!registration) {
            return res.status(404).json({ success: false, error: 'Registration not found.' });
        }
        return res.status(200).json({
            success: true,
            data: registration
        });
    } catch (error: any) {
        console.error('getInstitutionRegistrationByReference error:', error);
        return res.status(500).json({ success: false, error: 'Failed to retrieve registration.' });
    }
};
