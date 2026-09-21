
import { Request, Response } from 'express';
import { prisma } from '../config/db'; // Adjust path as needed based on project structure
import { Parser } from 'json2csv';
import { requireString } from "../utils/routeHelpers";

// --- Types ---

// --- Controller Methods ---

export const deleteProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const id = requireString(req.params.id);

        const office = await prisma.legislativeOffice.findFirst({ where: { userId } });
        if (!office) return res.status(403).json({ message: "Unauthorized" });

        // Ensure profile belongs to this office
        const profile = await prisma.ccsiProfile.findFirst({
            where: { id, legislativeOfficeId: office.id }
        });

        if (!profile) return res.status(404).json({ message: "Profile not found or unauthorized" });

        await prisma.ccsiProfile.delete({ where: { id } });

        res.json({ message: "Profile deleted successfully" });

    } catch (error) {
        console.error("Delete Profile Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const id = requireString(req.params.id);
        const data = req.body;

        const office = await prisma.legislativeOffice.findFirst({ where: { userId } });
        if (!office) return res.status(403).json({ message: "Unauthorized" });

        const profile = await prisma.ccsiProfile.findFirst({
            where: { id, legislativeOfficeId: office.id }
        });

        if (!profile) return res.status(404).json({ message: "Profile not found or unauthorized" });

        // Remove non-updatable fields if any
        delete data.id;
        delete data.legislativeOfficeId;
        delete data.officeId; // Frontend might send this
        delete data.batchId;
        delete data.createdAt;
        delete data.updatedAt;
        delete data.referralId; // Should not change
        // delete data.status; // Optional: let them update status? Maybe restricted to specific transitions. Leaving for now.

        const updated = await prisma.ccsiProfile.update({
            where: { id },
            data: data
        });

        res.json(updated);

    } catch (error) {
        console.error("Update Profile Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const updateProfileStatus = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const id = requireString(req.params.id);
        const { status, remarks } = req.body;

        const office = await prisma.legislativeOffice.findFirst({ where: { userId } });
        if (!office) return res.status(403).json({ message: "Unauthorized" });

        const profile = await prisma.ccsiProfile.findFirst({
            where: { id, legislativeOfficeId: office.id }
        });

        if (!profile) return res.status(404).json({ message: "Profile not found" });

        const updated = await prisma.ccsiProfile.update({
            where: { id },
            data: { 
                status,
                // store remarks/rejection reason if schema supports it, for now assuming we might just log or store in a field if exists
                // If schema doesn't have a specific remarks field, we might need to add it or ignore for now.
                // Checking schema... let's assume we just update status for now as explicit requirement.
                // If we need remarks, I should ideally check schema. 
                // For now, let's proceed with status update.
            }
        });

        res.json(updated);

    } catch (error) {
        console.error("Update Status Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    
    // Find legislative office for this user
    const office = await prisma.legislativeOffice.findFirst({
        where: { 
            OR: [
                { userId: userId },
                // Check if user is a collaborator? For now assuming direct link or handled via middleware/role check
            ]
        }
    });

    if (!office) {
        return res.status(404).json({ message: "Legislative Office not found for this user" });
    }

    // 1. Registry Metrics
    const totalRegistered = await prisma.ccsiProfile.count({ where: { legislativeOfficeId: office.id } });
    const verifiedProfiles = await prisma.ccsiProfile.count({ where: { legislativeOfficeId: office.id, status: "VERIFIED" } });
    const underEvaluation = await prisma.ccsiProfile.count({ where: { legislativeOfficeId: office.id, status: "UNDER_REVIEW" } });
    const commerceInterested = await prisma.ccsiProfile.count({ where: { legislativeOfficeId: office.id, isCommerceInterested: true } });

    // 2. Craft Composition
    const craftDistribution = await prisma.ccsiProfile.groupBy({
        by: ['primaryCraft'],
        where: { legislativeOfficeId: office.id },
        _count: { primaryCraft: true }
    });

    const subCraftDistribution = await prisma.ccsiProfile.groupBy({
        by: ['secondaryCraft'],
        where: { legislativeOfficeId: office.id, secondaryCraft: { not: null } },
        _count: { secondaryCraft: true }
    });

    // 3. Economic Indicators (Approximation)
    const womenLed = await prisma.ccsiProfile.count({ 
        where: { legislativeOfficeId: office.id, gender: "Female" } // Case sensitive check needed?
    });
    
    // 4. Commerce Funnel
    const auditCompleted = await prisma.ccsiProfile.count({ where: { legislativeOfficeId: office.id, isCommerceInterested: true, commerceStatus: { not: "INTEREST_SUBMITTED" } } });
    const eligibleForForward = await prisma.ccsiProfile.count({ where: { legislativeOfficeId: office.id, commerceStatus: "ELIGIBLE" } });


    res.json({
        registry: {
            totalRegistered,
            verifiedProfiles,
            underEvaluation,
            commerceInterested
        },
        craftComposition: craftDistribution.map(c => ({ name: c.primaryCraft, count: c._count.primaryCraft })),
        subCraftComposition: subCraftDistribution
            .filter(c => c.secondaryCraft && c.secondaryCraft.trim() !== '')
            .map(c => ({ name: c.secondaryCraft, count: c._count.secondaryCraft })),
        economic: {
            womenLedUnits: womenLed,
            // youthParticipation: ... calc based on logic if age/dob available, currently not in schema clearly
        },
        commerceFunnel: {
            interested: commerceInterested,
            auditCompleted,
            eligible: eligibleForForward,
            forwarded: 0 // Placeholder
        }
    });

  } catch (error) {
    console.error("Dashboard Stats Error", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId; // Check auth middleware payload structure. Usually user.userId or user.id
        const data = req.body;

        // Find legislative office
        const office = await prisma.legislativeOffice.findFirst({
            where: { userId: userId } 
        });

        if (!office) return res.status(403).json({ message: "No Legislative Office associated" });

        // Generate ID / Check duplicates
        const existing = await prisma.ccsiProfile.findFirst({
            where: { primaryContact: data.primaryContact, legislativeOfficeId: office.id }
        });

        if (existing) {
            return res.status(400).json({ message: "Profile with this contact number already exists in your registry." });
        }

        // Remove officeId if present in request body to avoid Prisma error
        if ('officeId' in data) {
            delete data.officeId;
        }

        const newProfile = await prisma.ccsiProfile.create({
            data: {
                ...data,
                legislativeOfficeId: office.id,
                status: "SUBMITTED",
                referralId: `CCSI-${Date.now()}-${Math.floor(Math.random()*1000)}`
            }
        });

        res.status(201).json(newProfile);

    } catch (error) {
        console.error("Create Profile Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const validatePublicCcsiContact = async (req: Request, res: Response) => {
    try {
        const slug = requireString(req.params.slug);
        const { primaryContact, email } = req.body;

        if (!primaryContact) {
            return res.status(400).json({ message: "Primary contact is required for validation." });
        }

        let office = null;
        if (slug) {
            office = await prisma.legislativeOffice.findUnique({
                where: { username: slug }
            });

            if (!office) {
                return res.status(404).json({ message: "Legislative Office not found" });
            }

            const existingContact = await prisma.ccsiProfile.findFirst({
                where: { primaryContact, legislativeOfficeId: office.id }
            });

            if (existingContact) {
                return res.status(409).json({ message: "A profile with this contact number already exists for this constituency." });
            }

            if (email) {
                 const existingEmail = await prisma.ccsiProfile.findFirst({
                    where: { email, legislativeOfficeId: office.id }
                });
                if (existingEmail) {
                    return res.status(409).json({ message: "A profile with this email already exists for this constituency." });
                }
            }

        } else {
            const existingGeneral = await prisma.ccsiProfile.findFirst({
                where: { primaryContact, legislativeOfficeId: null }
            });

            if (existingGeneral) {
                return res.status(409).json({ message: "A profile with this contact number already exists in general intake." });
            }

            if (email) {
                 const existingGeneralEmail = await prisma.ccsiProfile.findFirst({
                    where: { email, legislativeOfficeId: null }
                });
                if (existingGeneralEmail) {
                    return res.status(409).json({ message: "A profile with this email already exists in general intake." });
                }
            }
        }

        return res.status(200).json({ message: "Contact details are available." });

    } catch (error) {
        console.error("Validate Public CCSI Contact Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const submitPublicCcsiProfile = async (req: Request, res: Response) => {
    try {
        const slug = requireString(req.params.slug);
        const data = req.body;

        let office = null;
        if (slug) {
            // Find legislative office by slug
            office = await prisma.legislativeOffice.findUnique({
                where: { username: slug }
            });

            if (!office) {
                return res.status(404).json({ message: "Legislative Office not found" });
            }

            // Verify referral code ONLY IF it is provided
            if (data.referralCode && data.referralCode !== office.referralCode) {
                return res.status(400).json({ message: "Invalid referral code for this constituency." });
            }

            // Check duplicates for this specific office
            const existing = await prisma.ccsiProfile.findFirst({
                where: { primaryContact: data.primaryContact, legislativeOfficeId: office.id }
            });

            if (existing) {
                return res.status(400).json({ message: "A profile with this contact number already exists for this constituency." });
            }
        } else {
            // Check duplicates for general intake
             const existingGeneral = await prisma.ccsiProfile.findFirst({
                where: { primaryContact: data.primaryContact, legislativeOfficeId: null }
            });
            if (existingGeneral) {
                return res.status(400).json({ message: "A profile with this contact number already exists in general intake." });
            }
        }

        // Remove officeId if present in request body to avoid Prisma error
        if ('officeId' in data) {
            delete data.officeId;
        }

        const applicationCode = `CCSI-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const jurisdictionExpiresAt = office ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null;
        const status = office ? "PENDING_JURISDICTION" : "GENERAL_INTAKE";

        const userId = (req as any).user?.userId || null;
        if (userId) {
            // Check if user already has a pending non-General intake profile to avoid duplicates for the same user
            const userExisting = await prisma.ccsiProfile.findFirst({
                where: { userId, legislativeOfficeId: office ? office.id : null }
            });
            if (userExisting) {
                return res.status(400).json({ message: "You have already submitted a profile for this constituency." });
            }
        }

        const newProfile = await prisma.ccsiProfile.create({
            data: {
                ...data,
                userId,
                legislativeOfficeId: office ? office.id : null,
                status,
                applicationCode,
                jurisdictionExpiresAt,
                referralCode: data.referralCode || null,
                referralId: `CC-REF-${Date.now()}`,
                isProfileCompleted: data.isProfileCompleted || false,
            }
        });

        res.status(201).json({ 
            message: "Profile submitted successfully", 
            profile: newProfile,
            applicationCode,
            status 
        });

    } catch (error) {
        console.error("Public Create Profile Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getProfiles = async (req: Request, res: Response) => {
    try {
        // Auto-convert any expired jurisdictions to GENERAL_INTAKE globally
        const expiredProfiles = await prisma.ccsiProfile.findMany({
            where: {
                status: "PENDING_JURISDICTION",
                jurisdictionExpiresAt: { lt: new Date() }
            },
            select: { id: true, auditLog: true }
        });

        if (expiredProfiles.length > 0) {
            await Promise.all(expiredProfiles.map(p => 
                prisma.ccsiProfile.update({
                    where: { id: p.id },
                    data: {
                        status: "GENERAL_INTAKE",
                        legislativeOfficeId: null,
                        auditLog: p.auditLog 
                            ? [...(p.auditLog as any[]), { action: "AUTO_CONVERT_GENERAL_INTAKE", timestamp: new Date() }] 
                            : [{ action: "AUTO_CONVERT_GENERAL_INTAKE", timestamp: new Date() }]
                    }
                })
            ));
        }

        const userId = (req as any).user.userId;
        const { page = 1, limit = 10, search, status, craft } = req.query;

        const office = await prisma.legislativeOffice.findFirst({ where: { userId } });
        if (!office) return res.status(403).json({ message: "Unauthorized" });

        const where: any = { legislativeOfficeId: office.id };

        if (status) where.status = status;
        if (craft) where.primaryCraft = craft;
        if (search) {
            where.OR = [
                { fullName: { contains: String(search), mode: 'insensitive' } },
                { primaryContact: { contains: String(search) } },
                { businessName: { contains: String(search), mode: 'insensitive' } },
            ];
        }

        const profiles = await prisma.ccsiProfile.findMany({
            where,
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
            orderBy: { createdAt: 'desc' }
        });

        const total = await prisma.ccsiProfile.count({ where });

        res.json({
            data: profiles,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit))
        });

    } catch (error) {
        console.error("Get Profiles Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const id = requireString(req.params.id);

        const office = await prisma.legislativeOffice.findFirst({ where: { userId } });
        if (!office) return res.status(403).json({ message: "Unauthorized" });

        const profile = await prisma.ccsiProfile.findFirst({
            where: { 
                id,
                legislativeOfficeId: office.id 
            }
        });

        if (!profile) return res.status(404).json({ message: "Profile not found" });

        res.json(profile);

    } catch (error) {
        console.error("Get Profile Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const previewBulk = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const rows = req.body.rows; // Expecting array of objects

        if (!rows || !Array.isArray(rows)) {
             return res.status(400).json({ message: "Invalid data format" });
        }

        const office = await prisma.legislativeOffice.findFirst({ where: { userId } });
        if (!office) return res.status(403).json({ message: "No Legislative Office associated" });

        const results = {
            total: rows.length,
            valid: 0,
            errors: 0,
            duplicates: 0,
            errorRows: [] as any[],
            validRows: [] as any[]
        };

        // Fetch existing phone numbers for quick duplicate check
        const existingPhones = await prisma.ccsiProfile.findMany({
            where: { legislativeOfficeId: office.id },
            select: { primaryContact: true }
        });
        const phoneSet = new Set(existingPhones.map(p => p.primaryContact));
        const currentBatchPhones = new Set();

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const errors = [];

            // Basic Validation
            if (!row.applicant_category) errors.push("Missing Category");
            if (!row.full_name) errors.push("Missing Full Name");
            if (!row.primary_contact) errors.push("Missing Contact");
            if (!row.village) errors.push("Missing Village");
            if (!row.district) errors.push("Missing District"); // Should ideally match office district

            // Duplicate Check
            if (row.primary_contact) {
                if (phoneSet.has(row.primary_contact) || currentBatchPhones.has(row.primary_contact)) {
                   errors.push("Duplicate Phone Number");
                   results.duplicates++;
                } else {
                   currentBatchPhones.add(row.primary_contact);
                }
            }

            if (errors.length > 0) {
                results.errors++;
                results.errorRows.push({ row: i + 1, data: row, errors });
            } else {
                results.valid++;
                results.validRows.push(row);
            }
        }

        res.json(results);

    } catch (error) {
        console.error("Preview Bulk Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const submitBulk = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { validRows, totalOriginal, errorCount } = req.body;

        const office = await prisma.legislativeOffice.findFirst({ where: { userId } });
        if (!office) return res.status(403).json({ message: "No Legislative Office associated" });

        // Create Batch
        const batch = await prisma.ccsiBatch.create({
            data: {
                legislativeOfficeId: office.id,
                totalProfiles: totalOriginal,
                validProfiles: validRows.length,
                errorProfiles: errorCount,
                status: "PENDING_VERIFICATION",
                riskLevel: "LOW" // Logic for risk scoring can be added
            }
        });

        // Create Profiles
        // Note: createMany is faster but doesn't support nested relations nicely if needed, 
        // but CCSIProfile is flat enough.
        
        // Map CSV fields to Prisma fields
        const profilesData = validRows.map((row: any) => ({
            legislativeOfficeId: office.id,
            batchId: batch.id,
            applicantCategory: row.applicant_category,
            fullName: row.full_name,
            businessName: row.business_name,
            fatherName: row.guardian_name,
            gender: row.gender,
            primaryContact: row.primary_contact,
            alternateContact: row.alternate_contact,
            email: row.email,
            village: row.village,
            district: row.district,
            clusterName: row.cluster,
            primaryCraft: row.primary_craft,
            secondaryCraft: row.secondary_craft,
            yearsExperience: row.years_experience ? Number(row.years_experience) : undefined,
            familyLineage: row.family_lineage === 'Yes' || row.family_lineage === true,
            giAssociation: row.gi_association,
            monthlyCapacity: row.monthly_capacity,
            numberOfWorkers: row.number_workers ? Number(row.number_workers) : undefined,
            workshopAddress: row.workshop_address,
            workshopSeparate: row.workshop_separate === 'Yes',
            rawMaterials: row.raw_materials,
            toolsUsed: row.tools_used,
            status: "SUBMITTED",
            referralId: `CCSI-B${batch.id.substring(20)}-${Math.floor(Math.random()*10000)}` 
        }));

        await prisma.ccsiProfile.createMany({
            data: profilesData
        });

        res.status(201).json({ message: "Batch submitted successfully", batchId: batch.id });

    } catch (error) {
         console.error("Submit Bulk Error", error);
         res.status(500).json({ message: "Server Error" });
    }
};

export const downloadTemplate = async (req: Request, res: Response) => {
    try {
        const fields = [
            'applicant_category', 'full_name', 'business_name', 'guardian_name', 'gender',
            'primary_contact', 'alternate_contact', 'email', 'village', 'district', 'cluster',
            'primary_craft', 'secondary_craft', 'years_experience', 'family_lineage', 
            'gi_association', 'monthly_capacity', 'number_workers',
            'workshop_address', 'workshop_separate', 'raw_materials', 'tools_used', 'geo_captured',
            'commerce_interest', 'selling_outside_district', 'bank_account_available',
            'gst_available', 'pricing_records', 'production_type', 'lead_time', 'standard_packaging',
            'courier_capability', 'digital_tools', 'digital_payments_ready'
        ];
        
        const json2csv = new Parser({ fields });
        const csv = json2csv.parse([]);

        res.header('Content-Type', 'text/csv');
        res.attachment('ccsi_bulk_template.csv');
        res.send(csv);

    } catch (error) {
        console.error("Template Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Bulk upload implementation would require file parsing middleware (multer) and logic to parse CSV
// For this step, I'll add the placeholder or basic logic if file is passed in body/req
// Assuming routes will handle file upload before calling controller

export const approveJurisdiction = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const id = requireString(req.params.id);

        // Verify the legislative office 
        const office = await prisma.legislativeOffice.findFirst({
            where: { userId }
        });

        if (!office) {
            return res.status(403).json({ message: "Unauthorized. Legislative Office not found." });
        }

        // Fetch the profile
        const profile = await prisma.ccsiProfile.findUnique({
            where: { id }
        });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found." });
        }

        // Security check: ensure this profile belongs to this office
        if (profile.legislativeOfficeId !== office.id) {
            return res.status(403).json({ message: "Unauthorized. This profile does not fall under your jurisdiction." });
        }

        // Ensure the profile is actually pending jurisdiction
        if (profile.status !== "PENDING_JURISDICTION") {
            return res.status(400).json({ message: "This profile is not currently pending jurisdiction approval." });
        }

        // Approve it! (Reset expiry, move to verification)
        const updatedProfile = await prisma.ccsiProfile.update({
            where: { id },
            data: {
                status: "JURISDICTION_APPROVED",
                jurisdictionExpiresAt: null, // Clear the countdown timer
                auditLog: profile.auditLog 
                    ? [...(profile.auditLog as any[]), { action: "JURISDICTION_APPROVED", by: office.username, timestamp: new Date() }] 
                    : [{ action: "JURISDICTION_APPROVED", by: office.username, timestamp: new Date() }]
            }
        });

        res.json({ message: "Jurisdiction confirmed successfully.", profile: updatedProfile });

    } catch (error) {
        console.error("Approve Jurisdiction Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const verifyProfile = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const profile = await prisma.ccsiProfile.findFirst({
            where: {
                OR: [
                    { id: id },
                    { referralId: id },
                    { applicationCode: id }
                ]
            },
            select: {
                id: true,
                fullName: true,
                businessName: true,
                status: true,
                primaryContact: true,
                email: true,
                village: true,
                referralId: true
            }
        });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.json(profile);
    } catch (error) {
        console.error("Verify Profile Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getMyCcsiProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;

        const profile = await prisma.ccsiProfile.findFirst({
            where: { userId },
            include: {
                legislativeOffice: {
                    select: {
                        constituency: true,
                        representativeName: true,
                        username: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(profile); // Returns null if not found, which is fine
    } catch (error) {
        console.error("Get My CCSI Profile Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const resumeCcsiRegistration = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const data = req.body; // updated profile data + commerce data
        
        // Find existing profile
        const existingProfile = await prisma.ccsiProfile.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        if (!existingProfile) {
            return res.status(404).json({ message: "Profile not found." });
        }

        // Needs to have legislative office slug to verify referral code
        let office = null;
        if (existingProfile.legislativeOfficeId) {
            office = await prisma.legislativeOffice.findUnique({
                where: { id: existingProfile.legislativeOfficeId }
            });
        } else if (data.slug) {
            office = await prisma.legislativeOffice.findUnique({
                where: { username: data.slug }
            });
        }

        if (data.referralCode && office) {
            if (data.referralCode !== office.referralCode) {
                return res.status(400).json({ message: "Invalid referral code for this constituency." });
            }
        }

        const updateData = { ...data };
        const fieldsToExclude = [
            'id', 'userId', 'slug', 'legislativeOfficeId', 'batchId',
            'legislativeOffice', 'user', 'batch',
            'createdAt', 'updatedAt', 'applicationCode', 'auditLog'
        ];
        fieldsToExclude.forEach(field => delete (updateData as any)[field]);

        // If newly submitting referral code and commerce, maybe update status
        const updatedProfile = await prisma.ccsiProfile.update({
            where: { id: existingProfile.id },
            data: {
                ...updateData,
                legislativeOfficeId: office ? office.id : existingProfile.legislativeOfficeId,
                referralCode: data.referralCode || existingProfile.referralCode,
                status: existingProfile.status === "GENERAL_INTAKE" && office ? "PENDING_JURISDICTION" : existingProfile.status,
            }
        });

        res.json({ message: "Profile resumed/updated successfully", profile: updatedProfile });
    } catch (error) {
        console.error("Resume CCSI Registration Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const requestReferralCode = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const profile = await prisma.ccsiProfile.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        if (!profile) return res.status(404).json({ message: "Profile not found" });

        const updatedProfile = await prisma.ccsiProfile.update({
            where: { id: profile.id },
            data: {
                status: "PENDING_ACTIVATION",
                referralStatus: "pending_activation"
            }
        });

        res.json({ message: "Referral code requested", profile: updatedProfile });
    } catch (error) {
        console.error("Request Referral Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const approveReferralCode = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const id = requireString(req.params.id);

        // Verify the legislative office 
        const office = await prisma.legislativeOffice.findFirst({
            where: { userId }
        });

        if (!office) {
            return res.status(403).json({ message: "Unauthorized. Legislative Office not found." });
        }

        // Fetch the profile
        const profile = await prisma.ccsiProfile.findUnique({
            where: { id }
        });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found." });
        }

        // Security check: ensure this profile belongs to this office
        if (profile.legislativeOfficeId !== office.id) {
            return res.status(403).json({ message: "Unauthorized. This profile does not fall under your jurisdiction." });
        }

        // Update the profile to activated state
        const updatedProfile = await prisma.ccsiProfile.update({
            where: { id },
            data: {
                referralStatus: "activated",
                referralCode: office.referralCode, // Assign the office's referral code
                auditLog: profile.auditLog 
                    ? [...(profile.auditLog as any[]), { action: "REFERRAL_ACTIVATED", by: office.username, timestamp: new Date() }] 
                    : [{ action: "REFERRAL_ACTIVATED", by: office.username, timestamp: new Date() }]
            }
        });

        res.json({ message: "Referral activated successfully.", profile: updatedProfile });

    } catch (error) {
        console.error("Approve Referral Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};
