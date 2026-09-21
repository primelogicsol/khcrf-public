import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { EmailService } from '../services/emailService.js';
import { EmailTemplates } from '../constants/emailTemplates.js';
import { requireString } from "../utils/routeHelpers";

export const createListing = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const data = req.body;

        // Start a transaction to ensure all related records are created or none
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Base Listing
            const listing = await tx.listing.create({
                data: {
                    userId,
                    type: data.registerType === 'Artisan' ? 'ARTISAN' :
                        data.registerType === 'Business' ? 'BUSINESS' : 'INSTITUTION',
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                    status: 'PENDING',
                },
            });

            // 2. Create Specific Profile based on Type
            if (data.registerType === 'Artisan') {
                await tx.artisanProfile.create({
                    data: {
                        listingId: listing.id,
                        specialty: data.craftSpecialty,
                        skillLevel: data.craftSkill,
                        experienceYears: Number(data.craftExperience) || 0,
                        awards: data.craftAward,
                        catalogUrl: data.craftCatalog,
                    },
                });
            } else if (data.registerType === 'Business') {
                await tx.businessProfile.create({
                    data: {
                        listingId: listing.id,
                        name: data.businessName,
                        email: data.businessEmail,
                        address: data.businessAddress,
                        foundedYear: Number(data.businessYear) || undefined,
                        type: data.businessType,
                        websiteUrl: data.businessLink,
                        productsSold: data.businessSold,
                        employeeCount: Number(data.businessEmployee) || 0,
                        licenseNumber: data.businessLicense,
                    },
                });
            } else if (data.registerType === 'Institution') {
                await tx.instituteProfile.create({
                    data: {
                        listingId: listing.id,
                        name: data.instituteName,
                        email: data.instituteEmail,
                        address: data.instituteAddress,
                        representative: data.instituteRep,
                        repDesignation: data.repPost,
                        type: data.instituteType,
                        websiteUrl: data.instituteLink,
                        missionStatement: data.instituteMission,
                    },
                });
            }

            // 3. Create Compliance Record
            await tx.listingCompliance.create({
                data: {
                    listingId: listing.id,
                    materialSource: data.materialSource,
                    craftingProcess: data.craftingProcess,
                    isSustainable: data.sustainablePractices,
                    sustainableDesc: data.sustainablePracticesDescription,
                    paysFairWage: data.fairWage,
                    supportsGender: data.genderSupport,
                    femaleEmployeePct: Number(data.femalePercentage) || 0,
                    hasWorkplaceStd: data.workplaceStandards,
                    workplaceStdDesc: data.workplaceStandardsDescription,
                    childLaborPolicy: data.childLaborPolicy,
                    fairTradeCert: data.fairTradeCertification,
                    fairTradeDoc: data.fairTradeDocument,
                    giCert: data.giCertification,
                    giCertNumber: data.giCertificationNumber,
                    giCertDoc: data.giCertificationDocument,
                    blockchainCert: data.blockchainCertification,
                    blockchainCertDoc: data.blockchainCertificationDocument,
                    qualityConsent: data.qualityReviewConsent === 'yes',
                    profileConsent: data.profileDisplayConsent === 'yes',
                    complianceAck: data.complianceAcknowledgement === 'yes',
                },
            });

            return listing;
        });

        // Send Email
        EmailService.sendEmail(data.email || data.businessEmail || data.instituteEmail, EmailTemplates.APPLICATION_RECEIVED, {
            name: data.fullName || data.businessName || data.instituteName,
            type: `Career/Listing (${data.registerType})`,
            id: result.id
        })
.catch(err => console.error("Failed to send listing application email:", err));

        res.status(201).json({ message: 'Listing submitted successfully', listingId: result.id });
    } catch (error) {
        console.error('Create Listing Error:', error);
        res.status(500).json({ message: 'Failed to submit listing', error: (error as Error).message });
    }
};

export const getMyListings = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const listings = await prisma.listing.findMany({
            where: { userId },
            include: {
                artisanProfile: true,
                businessProfile: true,
                instituteProfile: true,
                compliance: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        res.status(200).json(listings);
    } catch (error) {
        console.error('Get My Listings Error:', error);
        res.status(500).json({ message: 'Failed to fetch listings', error: (error as Error).message });
    }
};

// Get Single Listing by ID (Admin/Owner)
export const getListingById = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const listing = await prisma.listing.findUnique({
            where: { id },
            include: {
                artisanProfile: true,
                businessProfile: true,
                instituteProfile: true,
                compliance: true,
                user: { select: { name: true, email: true } }
            }
        });

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        res.status(200).json(listing);
    } catch (error) {
        console.error('Get Listing By ID Error:', error);
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

// Update Listing Status (Admin)
export const updateListingStatus = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const { status, adminCertificateUrl } = req.body;

        const updatedListing = await prisma.listing.update({
            where: { id },
            data: { 
                status,
                adminCertificateUrl // Save the certificate URL
            },
            include: { user: true }
        });

        // Send Status Update Email
        const email = updatedListing.email || updatedListing.user?.email || "";
        const name = updatedListing.fullName || updatedListing.user?.name || "User";

        if (email) {
            EmailService.sendEmail(email, EmailTemplates.STATUS_UPDATE, {
                name: name,
                type: 'Certificate/Listing',
                status: status
            }).catch(err => console.error("Failed to send listing status update email:", err));
        }

        res.status(200).json({ message: 'Status updated successfully', listing: updatedListing });
    } catch (error) {
        console.error('Update Listing Status Error:', error);
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};
