import { prisma } from '../config/db';
import { NotificationService } from './notificationService';

export class ParticipationService {
  private static generateSubmissionNumber(prefix: string) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  }

  // 1. Artisan Nomination
  static async createNomination(data: any) {
    // Duplicate Detection: Check if nomination exists for same name & district
    const existing = await prisma.artisanNomination.findFirst({
      where: {
        nomineeName: { equals: data.nomineeName, mode: 'insensitive' },
        district: { equals: data.district, mode: 'insensitive' },
        isDeleted: false
      }
    });
    
    if (existing) {
      throw new Error(`Duplicate Nomination: An artisan named '${data.nomineeName}' from '${data.district}' has already been nominated.`);
    }

    const record = await prisma.artisanNomination.create({
      data: {
        ...data,
        submissionNumber: this.generateSubmissionNumber('NOM'),
      }
    });

    const emailMatch = data.contactInfo?.match(/Email:\s*([^\s,]+)/i);
    const email = emailMatch ? emailMatch[1] : null;

    if (email) {
      NotificationService.sendEmail(
        email, 
        'Nomination Received - KHCRF', 
        `<p>Thank you for nominating <strong>${data.nomineeName}</strong>. Your submission (${record.submissionNumber}) is under review.</p>`
      ).catch(console.error);
    }
    
    NotificationService.alertAdmins('New Artisan Nomination', `<p>A new nomination (${record.submissionNumber}) has been submitted for ${data.nomineeName}.</p>`).catch(console.error);

    return record;
  }

  static async getNominations(filters: any) {
    return await prisma.artisanNomination.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
      include: { mediaAssets: true }
    });
  }

  static async updateNominationStatus(id: string, status: any, reviewerId?: string, notes?: string) {
    return await prisma.artisanNomination.update({
      where: { id },
      data: { status, reviewerId, notes }
    });
  }

  // 2. Story Submission
  static async createStory(data: any) {
    // Duplicate Detection: Check if story exists for same title & author
    const existing = await prisma.storySubmission.findFirst({
      where: {
        title: { equals: data.title, mode: 'insensitive' },
        authorName: { equals: data.authorName, mode: 'insensitive' },
        isDeleted: false
      }
    });
    
    if (existing) {
      throw new Error(`Duplicate Story: A story titled '${data.title}' by '${data.authorName}' has already been submitted.`);
    }

    const record = await prisma.storySubmission.create({
      data: {
        ...data,
        submissionNumber: this.generateSubmissionNumber('STY'),
      }
    });

    if (data.authorEmail) {
      NotificationService.sendEmail(
        data.authorEmail, 
        'Story Submission Received - KHCRF', 
        `<p>Thank you for submitting your story/manuscript <strong>${data.title}</strong>. Your submission (${record.submissionNumber}) is under review by the Editorial Board.</p>`
      ).catch(console.error);
    }
    
    NotificationService.alertAdmins('New Story Submission', `<p>A new story (${record.submissionNumber}) titled "${data.title}" has been submitted by ${data.authorName}.</p>`).catch(console.error);

    return record;
  }

  static async getStories(filters: any) {
    return await prisma.storySubmission.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
      include: { mediaAssets: true }
    });
  }

  static async updateStoryStatus(id: string, status: any, reviewerId?: string, notes?: string) {
    return await prisma.storySubmission.update({
      where: { id },
      data: { status, reviewerId, notes }
    });
  }

  static async createContributor(data: any) {
    const existing = await prisma.contributorApplication.findFirst({
      where: {
        email: { equals: data.email, mode: 'insensitive' },
        isDeleted: false
      }
    });

    if (existing) {
      throw new Error(`Duplicate Application: An application with this email has already been submitted.`);
    }

    const record = await prisma.contributorApplication.create({
      data: {
        ...data,
        submissionNumber: this.generateSubmissionNumber('CON'),
      }
    });

    if (data.email) {
      NotificationService.sendEmail(
        data.email, 
        'Contributor Application Received - KHCRF', 
        `<p>Thank you for applying to be a contributor, <strong>${data.fullName}</strong>. Your application (${record.submissionNumber}) is under review.</p>`
      ).catch(console.error);
    }
    
    NotificationService.alertAdmins('New Contributor Application', `<p>A new contributor application (${record.submissionNumber}) has been submitted by ${data.fullName}.</p>`).catch(console.error);

    return record;
  }

  static async getContributors(filters: any) {
    return await prisma.contributorApplication.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
      include: { mediaAssets: true }
    });
  }

  static async updateContributorStatus(id: string, status: any, reviewerId?: string, notes?: string) {
    return await prisma.contributorApplication.update({
      where: { id },
      data: { status, reviewerId, notes }
    });
  }

  // 4. Support Documentation
  static async createDocumentation(data: any) {
    const existing = await prisma.supportDocumentation.findFirst({
      where: {
        title: { equals: data.title, mode: 'insensitive' },
        historicalContext: { equals: data.historicalContext, mode: 'insensitive' },
        isDeleted: false
      }
    });

    if (existing) {
      throw new Error(`Duplicate Documentation: An artifact with this title and description has already been submitted.`);
    }

    const record = await prisma.supportDocumentation.create({
      data: {
        ...data,
        submissionNumber: this.generateSubmissionNumber('DOC'),
      }
    });

    if (data.submitterEmail) {
      NotificationService.sendEmail(
        data.submitterEmail, 
        'Historical Documentation Received - KHCRF', 
        `<p>Thank you for submitting historical documentation <strong>${data.title}</strong>. Your submission (${record.submissionNumber}) is under review.</p>`
      ).catch(console.error);
    }
    
    NotificationService.alertAdmins('New Historical Documentation', `<p>New historical documentation (${record.submissionNumber}) titled "${data.title}" has been submitted by ${data.submitterName || 'a user'}.</p>`).catch(console.error);

    return record;
  }

  static async getDocumentation(filters: any) {
    return await prisma.supportDocumentation.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
      include: { mediaAssets: true }
    });
  }

  static async updateDocumentationStatus(id: string, status: any, reviewerId?: string, notes?: string) {
    return await prisma.supportDocumentation.update({
      where: { id },
      data: { status, reviewerId, notes }
    });
  }
}
