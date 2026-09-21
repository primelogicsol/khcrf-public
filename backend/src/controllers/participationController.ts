import { Request, Response } from 'express';
import { z, ZodError } from 'zod';
import { prisma } from '../config/db.js';
import { ParticipationService } from '../services/participationService.js';
import { requireString } from "../utils/routeHelpers";

// --- Zod Validation Schemas ---

export const artisanNominationSchema = z.object({
  nomineeName: z.string().trim().min(2, "Nominee name must be at least 2 characters long"),
  nominationType: z.string().trim().optional(),
  primaryCraft: z.string().trim().min(2, "Primary craft category is required"),
  secondaryCrafts: z.string().trim().optional(),
  yearsOfPractice: z.number().int().min(1, "Minimum 1 year of practice required"),
  unionTerritory: z.string().trim().optional(),
  district: z.string().trim().min(2, "District is required"),
  tehsil: z.string().trim().min(2, "Tehsil is required"),
  village: z.string().trim().min(2, "Village / Town / Mohalla is required"),
  pinCode: z.string().regex(/^\d{6}$/, "PIN Code must be exactly 6 digits"),
  fullAddress: z.string().trim().optional(),
  landmark: z.string().trim().optional(),
  notes: z.string().trim().min(10, "Description must be at least 10 characters long"),
  nominatorInfo: z.string().trim().min(2, "Nominator name is required"),
  relationship: z.string().trim().min(2, "Relationship to artisan is required"),
  nominatorEmail: z.string().email("Invalid email format"),
  nominatorPhone: z.string().regex(/^\+?[\d\s\-()]{7,20}$/, "Invalid phone format"),
  consentGiven: z.literal(true, {
    message: "You must provide consent to submit this nomination."
  }),
  hasGovtArtisanId: z.string().trim().optional(),
  govtArtisanId: z.string().trim().optional(),
  artisanRegistrationType: z.string().trim().optional(),
  artisanIssuingAuthority: z.string().trim().optional(),
  artisanYearOfRegistration: z.string().trim().optional(),
  existingHcrfArtisanId: z.string().trim().optional(),

  hasWorkshop: z.string().trim().optional(),
  workshopName: z.string().trim().optional(),
  workshopType: z.string().trim().optional(),
  isWorkshopRegistered: z.string().trim().optional(),
  workshopId: z.string().trim().optional(),
  workshopRegistrationType: z.string().trim().optional(),
  workshopIssuingAuthority: z.string().trim().optional(),
  workshopYearOfRegistration: z.string().trim().optional(),
  workshopAddress: z.string().trim().optional(),
  workshopPinCode: z.string().trim().optional(),
  existingHcrfWorkshopId: z.string().trim().optional(),
  mediaAssets: z.object({
    create: z.array(z.object({
      mediaType: z.enum(['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT']),
      storageProvider: z.string().default('cloudinary'),
      publicUrl: z.string().url("Must be a valid URL"),
      fileName: z.string().min(1),
      sizeBytes: z.number().int().max(10 * 1024 * 1024, "File exceeds 10MB limit").optional(),
      mimeType: z.string().refine(val => {
        if (!val) return true;
        return ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(val);
      }, "Invalid file format.").optional(),
    }))
  }).optional()
});

export const storySubmissionSchema = z.object({
  // Section 1
  submissionType: z.string().trim().min(2, "Submission type is required"),
  submissionStage: z.string().trim().min(2, "Submission stage is required"),
  primaryEditorialTheme: z.string().trim().min(2, "Primary theme is required"),
  primaryCraft: z.string().trim().min(2, "Primary craft is required"),
  secondaryCrafts: z.string().trim().optional(),
  geographicScope: z.string().trim().min(2, "Geographic scope is required"),

  // Section 2
  authorName: z.string().trim().min(2, "Author name is required"),
  authorEmail: z.string().email("Invalid email format"),
  authorPhone: z.string().regex(/^\+?[\d\s\-()]{7,20}$/, "Invalid phone format"),
  contributorCategory: z.string().trim().min(2, "Contributor category is required"),
  country: z.string().trim().min(2, "Country is required"),
  stateRegion: z.string().trim().optional(),
  cityDistrict: z.string().trim().optional(),
  institutionalAffiliation: z.string().trim().optional(),
  professionalRole: z.string().trim().optional(),
  shortBio: z.string().trim().min(10, "Short biography must be at least 10 characters long"),
  portfolioUrl: z.string().trim().optional(),

  // Section 3
  title: z.string().trim().min(10, "Title must be at least 10 characters long").max(180, "Title cannot exceed 180 characters"),
  synopsis: z.string().trim().min(10, "Synopsis is required").refine(val => {
    const wordCount = val.split(/\s+/).filter(word => word.length > 0).length;
    return wordCount >= 100 && wordCount <= 300;
  }, "Synopsis must be between 100 and 300 words"),
  subjectFeatured: z.string().trim().optional(),
  subjectLocation: z.string().trim().optional(),
  researchDetails: z.string().trim().optional(),
  previousPublicationStatus: z.string().trim().min(2, "Previous publication status is required"),
  conflictOfInterest: z.string().trim().optional(),

  // Section 4
  interviewsIncluded: z.boolean().default(false),
  fieldResearchIncluded: z.boolean().default(false),
  archiveConsulted: z.boolean().default(false),
  bibliographyIncluded: z.boolean().default(false),
  supportingEvidenceAvailable: z.boolean().default(false),
  existingRecordIds: z.string().trim().optional(),

  // Section 5
  originalityDeclaration: z.boolean().refine(v => v === true, "You must accept the originality declaration"),
  copyrightDeclaration: z.boolean().refine(v => v === true, "You must accept the copyright declaration"),
  interviewConsent: z.boolean().refine(v => v === true, "You must accept the interview consent declaration"),
  accuracyDeclaration: z.boolean().refine(v => v === true, "You must accept the accuracy declaration"),
  priorPublicationDeclaration: z.boolean().refine(v => v === true, "You must accept the prior publication declaration"),
  sensitiveKnowledgeDeclaration: z.boolean().refine(v => v === true, "You must accept the sensitive knowledge declaration"),
  editorialReviewAcknowledgement: z.boolean().refine(v => v === true, "You must acknowledge the editorial review process"),

  // Section 6
  notes: z.string().trim().optional(),
  accessRestrictions: z.string().trim().optional(),
  translationSupportRequired: z.string().trim().optional(),
  preferredTimeframe: z.string().trim().optional(),

  mediaAssets: z.object({
    create: z.array(z.object({
      mediaType: z.enum(['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT']),
      storageProvider: z.string().default('cloudinary'),
      publicUrl: z.string().url("Must be a valid URL"),
      fileName: z.string().min(1),
      sizeBytes: z.number().int().max(250 * 1024 * 1024, "File exceeds 250MB limit").optional(),
      mimeType: z.string().optional(),
    }))
  }).optional()
});

export const contributorApplicationSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters long"),
  email: z.string().trim().email("Please provide a valid email address"),
  phone: z.string().trim().min(5, "Phone number is required"),
  country: z.string().trim().min(2, "Country is required"),
  stateRegion: z.string().trim().min(2, "State or Region is required"),
  districtCity: z.string().trim().min(2, "District or City is required"),
  pinCode: z.string().trim().optional(),
  currentAddress: z.string().trim().optional(),
  preferredContactMethod: z.string().trim().optional(),

  contributorCategory: z.string().trim().min(2, "Contributor category is required"),
  currentProfession: z.string().trim().min(2, "Current profession is required"),
  organization: z.string().trim().optional(),
  highestQualification: z.string().trim().optional(),
  shortBio: z.string().trim().min(10, "Short professional biography is required"),

  linkedinProfile: z.string().trim().optional(),
  personalWebsite: z.string().trim().optional(),
  portfolioUrl: z.string().trim().optional(),
  orcidProfile: z.string().trim().optional(),
  existingHcrfMemberId: z.string().trim().optional(),

  areasOfContribution: z.string().trim().min(2, "At least one area of contribution is required"),
  primaryCraftSpecialisation: z.string().trim().optional(),
  additionalCraftSpecialisations: z.string().trim().optional(),
  natureOfKnowledge: z.string().trim().optional(),
  yearsOfExperience: z.string().trim().min(1, "Years of experience is required"),
  geographicAvailability: z.string().trim().min(2, "Geographic availability is required"),
  accessibleDistricts: z.string().trim().optional(),
  preferredEngagementType: z.string().trim().min(2, "Preferred engagement type is required"),
  availability: z.string().trim().min(2, "Availability is required"),
  timeCommitment: z.string().trim().min(2, "Time commitment is required"),

  equipmentAndSoftware: z.string().trim().optional(),
  relevantCertifications: z.string().trim().optional(),
  relevantTraining: z.string().trim().optional(),
  referenceName: z.string().trim().optional(),
  referenceOrganization: z.string().trim().optional(),
  referenceRelationship: z.string().trim().optional(),
  referenceEmail: z.string().trim().optional(),
  referencePhone: z.string().trim().optional(),

  motivation: z.string().trim().refine(val => {
    const wordCount = val.split(/\s+/).filter(word => word.length > 0).length;
    return wordCount >= 150 && wordCount <= 500;
  }, "Motivation must be between 150 and 500 words."),
  proposedContribution: z.string().trim().optional(),
  relevantCommunityAccess: z.string().trim().optional(),
  conflictOfInterest: z.string().trim().optional(),

  declarationAccuracy: z.boolean().refine(val => val === true, "You must confirm accuracy"),
  declarationRights: z.boolean().refine(val => val === true, "You must agree to rights declaration"),
  declarationEthical: z.boolean().refine(val => val === true, "You must agree to ethical declaration"),
  declarationConfidentiality: z.boolean().refine(val => val === true, "You must agree to confidentiality"),
  declarationRepresentation: z.boolean().refine(val => val === true, "You must confirm representation"),
  declarationSelection: z.boolean().refine(val => val === true, "You must confirm understanding of selection process"),
  declarationPrivacy: z.boolean().refine(val => val === true, "You must accept privacy policy"),

  mediaAssets: z.object({
    create: z.array(z.object({
      mediaType: z.enum(['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT']),
      storageProvider: z.string().default('cloudinary'),
      publicUrl: z.string().url("Must be a valid URL"),
      fileName: z.string().min(1),
      sizeBytes: z.number().int().max(10 * 1024 * 1024, "File exceeds 10MB limit").optional(),
      mimeType: z.string().refine(val => {
        if (!val) return true;
        const validTypes = [
          'application/pdf', 
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
          'application/msword',
          'application/vnd.oasis.opendocument.text'
        ];
        return validTypes.includes(val);
      }, "Invalid file format.").optional(),
    }))
  }).optional()
}).refine(data => {
  if (!data.portfolioUrl && (!data.mediaAssets || data.mediaAssets.create.length === 0) && (!data.proposedContribution || data.proposedContribution.length < 10)) {
    return false;
  }
  return true;
}, {
  message: "Provide a portfolio link, upload relevant work samples, or describe comparable work where public samples are unavailable.",
  path: ["portfolioUrl"]
});

export const supportDocumentationSchema = z.object({
  purpose: z.string().trim().min(2, "Purpose of Submission is required"),
  purposeOther: z.string().trim().optional(),
  title: z.string().trim().min(2, "Title is required"),
  materialType: z.string().trim().min(2, "Material type is required"),
  primaryCraft: z.string().trim().min(2, "Primary craft category is required"),
  secondaryCrafts: z.string().trim().optional(),
  peopleOrInstitutions: z.string().trim().optional(),
  identifiablePersons: z.string().trim().min(2, "Required"),
  identifiablePersonsDetails: z.string().trim().optional(),
  historicalContext: z.string().trim().refine(val => {
    const wordCount = val.split(/\s+/).filter(word => word.length > 0).length;
    return wordCount >= 100 && wordCount <= 1500;
  }, "Historical context must be between 100 and 1500 words."),
  dateType: z.string().trim().min(2, "Date type is required"),
  dateEstimate: z.string().trim().optional(),
  basisForDate: z.string().trim().optional(),
  placeAssociated: z.string().trim().optional(),
  placeFound: z.string().trim().optional(),
  currentLocation: z.string().trim().optional(),
  legalOwner: z.string().trim().min(2, "Legal owner is required"),
  currentCustodian: z.string().trim().optional(),
  ownerType: z.string().trim().optional(),
  relationshipToOwner: z.string().trim().min(2, "Relationship to owner is required"),
  ownerAuthorisation: z.boolean(),
  ownershipDisputed: z.boolean().optional(),
  ownershipHistory: z.string().trim().optional(),
  copyrightStatus: z.string().trim().min(2, "Copyright status is required"),
  copyrightHolder: z.string().trim().optional(),
  permissionPrivateReview: z.boolean(),
  publicUsePermissions: z.string().trim().optional(),
  attributionPreference: z.string().trim().min(2, "Attribution preference is required"),
  preferredCreditLine: z.string().trim().optional(),
  containsSensitiveInfo: z.string().trim().min(2, "Required"),
  sensitiveInfoDetails: z.string().trim().optional(),
  requestedRestrictions: z.string().trim().optional(),
  digitisationInfo: z.string().trim().optional(),
  alterationStatus: z.string().trim().optional(),
  submitterName: z.string().trim().min(2, "Full Name is required"),
  submitterEmail: z.string().email("Valid email is required"),
  submitterPhone: z.string().trim().min(5, "Phone is required"),
  submitterLocation: z.string().trim().optional(),
  relationshipToMaterial: z.string().trim().min(2, "Relationship to material is required"),
  submitterOrganisation: z.string().trim().optional(),
  authToSubmit: z.boolean().refine(val => val === true, "You must confirm authorization"),
  accuracyDeclaration: z.boolean().refine(val => val === true, "You must confirm accuracy"),
  rightsDisclosure: z.boolean().refine(val => val === true, "You must disclose rights"),
  sensitiveDisclosure: z.boolean().refine(val => val === true, "You must disclose sensitivity"),
  noAutomaticTransfer: z.boolean().refine(val => val === true, "You must confirm understanding"),
  noGuaranteedPublication: z.boolean().refine(val => val === true, "You must confirm understanding"),
  notes: z.string().trim().optional(),
  mediaAssets: z.object({
    create: z.array(z.object({
      mediaType: z.enum(['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT']),
      storageProvider: z.string().default('cloudinary'),
      publicUrl: z.string().url("Must be a valid URL"),
      fileName: z.string().min(1),
      sizeBytes: z.number().int().optional(),
      mimeType: z.string().optional(),
    }))
  }).optional()
});

export class ParticipationController {

  // --- My Submissions for user profile ---
  static async getMySubmissions(req: Request, res: Response) {
    try {
      const email = (req as any).user?.email;
      if (!email) {
        return res.status(401).json({ error: 'Unauthorized: User email not found' });
      }

      const [nominations, stories, contributors, documentations] = await Promise.all([
        prisma.artisanNomination.findMany({
          where: {
            OR: [
              { contactInfo: { contains: email, mode: 'insensitive' } },
              { notes: { contains: email, mode: 'insensitive' } }
            ],
            isDeleted: false
          },
          orderBy: { createdAt: 'desc' },
          include: { mediaAssets: true }
        }),
        prisma.storySubmission.findMany({
          where: {
            OR: [
              { source: { contains: email, mode: 'insensitive' } },
              { contributor: { contains: email, mode: 'insensitive' } }
            ],
            isDeleted: false
          },
          orderBy: { createdAt: 'desc' },
          include: { mediaAssets: true }
        }),
        prisma.contributorApplication.findMany({
          where: {
            email: { contains: email, mode: 'insensitive' },
            isDeleted: false
          },
          orderBy: { createdAt: 'desc' },
          include: { mediaAssets: true }
        }),
        prisma.supportDocumentation.findMany({
          where: {
            submitterEmail: { equals: email, mode: 'insensitive' },
            isDeleted: false
          },
          orderBy: { createdAt: 'desc' },
          include: { mediaAssets: true }
        })
      ]);

      const combined = [
        ...nominations.map(n => ({
          id: n.id,
          submissionNumber: n.submissionNumber,
          type: 'Nomination',
          title: `Nomination: ${n.nomineeName}`,
          status: n.status,
          createdAt: n.createdAt,
          mediaAssets: n.mediaAssets
        })),
        ...stories.map(s => ({
          id: s.id,
          submissionNumber: s.submissionNumber,
          type: 'Story Submission',
          title: s.title,
          status: s.status,
          createdAt: s.createdAt,
          mediaAssets: s.mediaAssets
        })),
        ...contributors.map(c => ({
          id: c.id,
          submissionNumber: c.submissionNumber,
          type: 'Contributor Pathway',
          title: `Application: ${c.fullName}`,
          status: c.status,
          createdAt: c.createdAt,
          mediaAssets: c.mediaAssets
        })),
        ...documentations.map(d => ({
          id: d.id,
          submissionNumber: d.submissionNumber,
          type: 'Support Documentation',
          title: d.title,
          status: d.status,
          createdAt: d.createdAt,
          mediaAssets: (d as any).mediaAssets
        }))
      ];

      combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return res.json(combined);
    } catch (e: any) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }
  
  // --- Nominations ---
  static async submitNomination(req: Request, res: Response) {
    try {
      const parsed = artisanNominationSchema.parse(req.body);
      const { nominatorEmail, nominatorPhone, nominationType, ...restData } = parsed;
      const contactInfo = `Email: ${nominatorEmail}, Phone: ${nominatorPhone}`;
      
      const classificationLabel = nominationType ? `[Classification: ${nominationType}] ` : '';
      const notes = `${classificationLabel}${restData.notes || ''}`;

      const dataToSave = {
        ...restData,
        notes,
        contactInfo
      };

      const data = await ParticipationService.createNomination(dataToSave);
      return res.status(201).json({ success: true, data });
    } catch (e: any) {
      if (e instanceof ZodError) {
        console.error('Nomination validation failed:', JSON.stringify(e.issues, null, 2));
        const formattedErrors = e.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }));
        return res.status(422).json({ success: false, errors: formattedErrors });
      }
      
      if (e.message && e.message.includes('Duplicate')) {
        return res.status(409).json({ success: false, error: e.message });
      }

      console.error('Nomination unexpected error:', e);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  static async getNominations(req: Request, res: Response) {
    try {
      const data = await ParticipationService.getNominations({ isDeleted: false });
      return res.json(data);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  static async reviewNomination(req: Request, res: Response) {
    try {
      const id = requireString(req.params.id);
      const { status, reviewerId, notes } = req.body;
      const data = await ParticipationService.updateNominationStatus(id, status, reviewerId, notes);
      return res.json(data);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  // --- Stories ---
  static async submitStory(req: Request, res: Response) {
    try {
      const parsed = storySubmissionSchema.parse(req.body);
      const data = await ParticipationService.createStory(parsed);
      return res.status(201).json({ success: true, data });
    } catch (e: any) {
      if (e instanceof ZodError) {
        console.error('Story validation failed:', JSON.stringify(e.issues, null, 2));
        const formattedErrors = e.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }));
        return res.status(422).json({ success: false, errors: formattedErrors });
      }
      
      if (e.message && e.message.includes('Duplicate')) {
        return res.status(409).json({ success: false, error: e.message });
      }

      console.error('Story unexpected error:', e);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  static async getStories(req: Request, res: Response) {
    try {
      const data = await ParticipationService.getStories({ isDeleted: false });
      return res.json(data);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  static async reviewStory(req: Request, res: Response) {
    try {
      const id = requireString(req.params.id);
      const { status, reviewerId, notes } = req.body;
      const data = await ParticipationService.updateStoryStatus(id, status, reviewerId, notes);
      return res.json(data);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  // --- Contributors ---
  static async submitContributor(req: Request, res: Response) {
    try {
      const parsed = contributorApplicationSchema.parse(req.body);

      const data = await ParticipationService.createContributor(parsed);
      return res.status(201).json({ success: true, data });
    } catch (e: any) {
      if (e instanceof ZodError) {
        console.error('Contributor validation failed:', JSON.stringify(e.issues, null, 2));
        const formattedErrors = e.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }));
        return res.status(422).json({ success: false, errors: formattedErrors });
      }
      
      if (e.message && e.message.includes('Duplicate')) {
        return res.status(409).json({ success: false, error: e.message });
      }

      console.error('Contributor unexpected error:', e);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  static async getContributors(req: Request, res: Response) {
    try {
      const data = await ParticipationService.getContributors({ isDeleted: false });
      return res.json(data);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  static async reviewContributor(req: Request, res: Response) {
    try {
      const id = requireString(req.params.id);
      const { status, reviewerId, notes } = req.body;
      const data = await ParticipationService.updateContributorStatus(id, status, reviewerId, notes);
      return res.json(data);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  // --- Documentation ---
  static async submitDocumentation(req: Request, res: Response) {
    try {
      const parsed = supportDocumentationSchema.parse(req.body);
      const data = await ParticipationService.createDocumentation(parsed);
      return res.status(201).json({ success: true, data });
    } catch (e: any) {
      if (e instanceof ZodError) {
        console.error('Documentation validation failed:', JSON.stringify(e.issues, null, 2));
        const formattedErrors = e.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }));
        return res.status(422).json({ success: false, errors: formattedErrors });
      }

      if (e.message && e.message.includes('Duplicate')) {
        return res.status(409).json({ success: false, error: e.message });
      }

      console.error('Documentation unexpected error:', e);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  static async getDocumentation(req: Request, res: Response) {
    try {
      const data = await ParticipationService.getDocumentation({ isDeleted: false });
      return res.json(data);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  static async reviewDocumentation(req: Request, res: Response) {
    try {
      const id = requireString(req.params.id);
      const { status, reviewerId, notes } = req.body;
      const data = await ParticipationService.updateDocumentationStatus(id, status, reviewerId, notes);
      return res.json(data);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }
}
