import { Request, Response } from 'express';
import { CanonicalEntityType } from '@prisma/client';
import { prisma } from '../config/db.js';
import crypto from 'crypto';
import { requireString } from "../utils/routeHelpers";

export const getHearingsAdmin = async (req: Request, res: Response) => {
    try {
        const hearings = await prisma.skcHearing.findMany({
            orderBy: { date: 'desc' },
            include: {
                registrations: true,
                testimonies: true,
                speakers: true,
                documents: true
            }
        });
        res.json({ success: true, data: hearings });
    } catch (error: any) {
        console.error('Error fetching admin hearings:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch hearings' });
    }
};

export const createHearing = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        if (!data.title || !data.description || !data.date) {
            return res.status(400).json({ success: false, error: 'Title, description, and date are required.' });
        }
        
        const hearing = await prisma.skcHearing.create({
            data: {
                slug: data.slug || Math.random().toString(36).substring(7),
                shortSummary: data.shortSummary || 'Summary pending',
                title: data.title,
                fullDescription: data.description,
                date: new Date(data.date),
                status: data.status || 'DRAFT',
                venue: data.venue || null,
                meetingLink: data.meetingLink || null,
                district: data.district || null,
                craftFocus: data.craftFocus || null
            }
        });
        res.status(201).json({ success: true, data: hearing });
    } catch (error: any) {
        console.error('Error creating hearing:', error);
        res.status(500).json({ success: false, error: 'Failed to create hearing' });
    }
};

export const updateHearing = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const data = req.body;
        
        const hearing = await prisma.skcHearing.update({
            where: { id },
            data: {
                title: data.title || undefined,
                fullDescription: data.description || undefined,
                date: data.date ? new Date(data.date) : undefined,
                status: data.status || undefined,
                meetingLink: data.meetingLink || undefined,
                district: data.district || undefined,
                craftFocus: data.craftFocus || undefined
            }
        });
        res.json({ success: true, data: hearing });
    } catch (error: any) {
        console.error('Error updating hearing:', error);
        res.status(500).json({ success: false, error: 'Failed to update hearing' });
    }
};

export const deleteHearing = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        await prisma.skcHearing.delete({ where: { id } });
        res.json({ success: true, message: 'Hearing deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting hearing:', error);
        res.status(500).json({ success: false, error: 'Failed to delete hearing' });
    }
};

const parseMilestoneDateToISO = (milestoneDate: string | null): string | null => {
    if (!milestoneDate) return null;
    const clean = milestoneDate.trim();
    if (clean.toLowerCase() === 'ongoing') return null;

    // Parse "05 Oct 2026" or "5 Oct 2026" or similar
    const parts = clean.split(/\s+/);
    if (parts.length >= 3) {
        const dayStr = parts[0].replace(/^0+/, '').padStart(2, '0');
        const monthStr = parts[1].toLowerCase();
        const year = parts[2];
        const months: Record<string, string> = {
            jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
            jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
        };
        const month = months[monthStr.substring(0, 3)];
        if (month) {
            return `${year}-${month}-${dayStr}`;
        }
    }
    // Fallback try standard Date parsing
    try {
        const d = new Date(clean);
        if (!isNaN(d.getTime())) {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${y}-${m}-${day}`;
        }
    } catch(e) {}
    return null;
};

export const getHearingsPublic = async (req: Request, res: Response) => {
    try {
        const dbHearings = await prisma.skcHearing.findMany({
            orderBy: { date: 'asc' },
            include: { speakers: true, documents: true, hearingType: true }
        });

        const mappedDbHearings = dbHearings.map(h => {
            const dateISO = (h.date || h.startAt) ? (h.date || h.startAt)!.toISOString().split('T')[0] : null;
            const venueLower = (h.venue || h.venueName || '').toLowerCase();
            let mode = venueLower.includes('online') ? 'Online' : ((h as any).mode || 'In Person');

            return {
                id: h.id,
                slug: h.slug,
                code: h.code,
                title: h.title,
                eventType: h.eventType,
                shortSummary: h.shortSummary,
                fullDescription: h.fullDescription,
                description: h.fullDescription,
                date: h.date,
                startAt: h.startAt,
                endAt: h.endAt,
                scheduledDate: dateISO,
                rawScheduledDate: dateISO,
                venue: h.venue || h.venueName,
                mode,
                district: h.district || 'Srinagar',
                craftFocus: h.craftFocus ? h.craftFocus.split(',').map(s => s.trim()) : [],
                isFormalHearing: (h.hearingType && (h.hearingType as any).isFormalHearing !== undefined) ? (h.hearingType as any).isFormalHearing : (h.eventType && (h.eventType.includes('CONSULTATION') || h.eventType.includes('ROUNDTABLE') || h.eventType === 'WORKSHOP' || h.eventType === 'ONGOING_STAKEHOLDER_ENGAGEMENT') ? true : false),
                category: h.craftFocus ? `${h.craftFocus} Hearing` : 'Public Hearing',
                topics: h.topics || [],
                speakers: h.speakers,
                documents: h.documents,
                status: (() => {
                  let s = h.status;
                  const evtDate = h.date || h.startAt || (h as any).scheduledDate;
                  if (evtDate) {
                      const now = new Date();
                      const ed = new Date(evtDate);
                      ed.setHours(23, 59, 59, 999);
                      if (ed < now) return 'COMPLETED';
                      if (ed.toDateString() === now.toDateString()) return 'ONGOING';
                  }
                  return s;
              })(),
                registrationStatus: h.registrationStatus
            };
        });

        res.json({ status: 'success', success: true, data: mappedDbHearings });
    } catch (error: any) {
        console.error('Error fetching public hearings:', error);
        // Returns the explicit error message to the frontend to aid diagnosis.
        res.status(500).json({ status: 'error', success: false, error: 'Failed to fetch hearings', detail: error?.message || String(error) });
    }
};

export const getHearingBySlugPublic = async (req: Request, res: Response) => {
    try {
        const slug = requireString(req.params.slug);
        let hearing = await prisma.skcHearing.findUnique({
            where: { slug },
            include: {
                speakers: true,
                documents: true,
                registrations: {
                    select: { id: true }
                }
            }
        });

        // Sync and upsert dynamically based on ConsultationTheme
        const theme = await prisma.consultationTheme.findUnique({
            where: { slug },
            include: { category: true }
        });

        if (theme) {
            let dateStr = new Date("2026-09-01T10:00:00Z");
            if (theme.nextMilestoneDate && theme.nextMilestoneDate !== 'Ongoing') {
                const parts = theme.nextMilestoneDate.trim().split(/\s+/);
                if (parts.length >= 3) {
                    const day = parseInt(parts[0], 10);
                    const monthStr = parts[1].toLowerCase();
                    const year = parseInt(parts[2], 10);
                    const months: Record<string, number> = {
                        jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
                        jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
                    };
                    const month = months[monthStr.substring(0, 3)] ?? 8;
                    dateStr = new Date(year, month, day, 10, 0, 0);
                }
            }

            const expectedStatus = theme.currentStatus === "Registration Open" ? "REGISTRATION_OPEN" : (theme.currentStatus === "Completed" ? "COMPLETED" : "SCHEDULED");

            if (!hearing) {
                hearing = await prisma.skcHearing.create({
                    data: {
                        id: theme.id,
                        title: theme.title,
                        slug: theme.slug,
                        date: dateStr,
                        startAt: dateStr,
                        venueName: theme.nextMilestoneLoc || "TBD",
                        venue: theme.nextMilestoneLoc || "TBD",
                        status: expectedStatus,
                        publicationStatus: "PUBLISHED",
                        shortSummary: theme.summary || '',
                        fullDescription: theme.summary || '',
                    },
                    include: {
                        speakers: true,
                        documents: true,
                        registrations: {
                            select: { id: true }
                        }
                    }
                });
            } else {
                // Keep SkcHearing record fully synchronized with updates from ConsultationTheme
                if (hearing.status !== expectedStatus || hearing.date?.getTime() !== dateStr.getTime() || hearing.title !== theme.title || hearing.shortSummary !== theme.summary) {
                    hearing = await prisma.skcHearing.update({
                        where: { id: hearing.id },
                        data: {
                            title: theme.title,
                            date: dateStr,
                            startAt: dateStr,
                            venueName: theme.nextMilestoneLoc || "TBD",
                            venue: theme.nextMilestoneLoc || "TBD",
                            status: expectedStatus,
                            shortSummary: theme.summary || '',
                            fullDescription: theme.summary || '',
                        },
                        include: {
                            speakers: true,
                            documents: true,
                            registrations: {
                                select: { id: true }
                            }
                        }
                    });
                }
            }
        }

        if (!hearing) {
            return res.status(404).json({ success: false, error: 'Hearing not found' });
        }

        const sanitizedHearing = { ...hearing };
        delete (sanitizedHearing as any).meetingLink;
        delete (sanitizedHearing as any).publicMeetingUrl;
        delete (sanitizedHearing as any).virtualJoinUrlEncrypted;

        res.json({ success: true, data: sanitizedHearing });
    } catch (error: any) {
        console.error('Error fetching public hearing:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch hearing' });
    }
};

export const registerForHearing = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const data = req.body;

        let hearing = await prisma.skcHearing.findUnique({ where: { id } });

        if (hearing) {
            const start = hearing.startAt ? new Date(hearing.startAt) : (hearing.date ? new Date(hearing.date) : null);
            if (start) {
                const now = new Date();
                const cutoff = new Date(start.getTime() - 30 * 60000); // 30 mins before
                if (now >= cutoff) {
                    return res.status(403).json({ success: false, error: 'Registration is closed. It closes 30 minutes before the hearing begins.' });
                }
            }
        }

        if (!hearing) {
            // Upsert SkcHearing dynamically to satisfy foreign keys
            const theme = await prisma.consultationTheme.findUnique({ where: { id } });
            if (!theme) {
                return res.status(404).json({ success: false, error: 'Hearing not found' });
            }

            let dateStr = new Date("2026-09-01T10:00:00Z");
            if (theme.nextMilestoneDate && theme.nextMilestoneDate !== 'Ongoing') {
                const parts = theme.nextMilestoneDate.trim().split(/\s+/);
                if (parts.length >= 3) {
                    const day = parseInt(parts[0], 10);
                    const monthStr = parts[1].toLowerCase();
                    const year = parseInt(parts[2], 10);
                    const months: Record<string, number> = {
                        jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
                        jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
                    };
                    const month = months[monthStr.substring(0, 3)] ?? 8;
                    dateStr = new Date(year, month, day, 10, 0, 0);
                }
            }

            const expectedStatus = theme.currentStatus === "Registration Open" ? "REGISTRATION_OPEN" : (theme.currentStatus === "Completed" ? "COMPLETED" : "SCHEDULED");

            hearing = await prisma.skcHearing.create({
                data: {
                    id: theme.id,
                    title: theme.title,
                    slug: theme.slug,
                    date: dateStr,
                    startAt: dateStr,
                    venueName: theme.nextMilestoneLoc || "TBD",
                    venue: theme.nextMilestoneLoc || "TBD",
                    status: expectedStatus,
                    publicationStatus: "PUBLISHED",
                    shortSummary: theme.summary || '',
                    fullDescription: theme.summary || '',
                }
            });
        }

        const registration = await prisma.hearingRegistration.create({
            data: {
                hearingId: hearing.id,
                referenceNumber: crypto.randomBytes(8).toString('hex').toUpperCase(),
                fullName: data.fullName,
                email: data.email,
                phone: data.phone || null,
                organization: data.organization || null,
                designation: data.designation || null,
                attendanceType: data.attendanceType || 'IN_PERSON',
                consentAccepted: data.consent === true
            }
        });

        res.status(201).json({ success: true, data: registration });
    } catch (error: any) {
        console.error('Error registering:', error);
        res.status(500).json({ success: false, error: 'Failed to register' });
    }
};

export const submitTestimony = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const data = req.body;

        let targetHearingId = id;
        
        let hearing = await prisma.skcHearing.findUnique({
            where: { id: targetHearingId }
        });

        if (!hearing) {
            let generalHearing = await prisma.skcHearing.findFirst({
                where: { slug: 'general-public-hearing-2026' }
            });

            if (!generalHearing) {
                generalHearing = await prisma.skcHearing.findFirst();
            }

            if (!generalHearing) {
                generalHearing = await prisma.skcHearing.create({
                    data: {
                        title: 'General Public Hearing & Submissions Cycle 2026',
                        slug: 'general-public-hearing-2026',
                        shortSummary: 'General submission portal for the State of Kashmir Crafts Assessment 2026.',
                        fullDescription: 'This is the general public submissions hearing for the State of Kashmir Crafts Assessment 2026.',
                        status: 'ONGOING',
                        date: new Date(),
                        venue: 'SKICC Srinagar / Online'
                    }
                });
            }
            targetHearingId = generalHearing.id;
        }

        const testimony = await prisma.hearingTestimony.create({
            data: {
                hearingId: targetHearingId,
                title: data.title,
                testimonyBody: data.writtenSubmission || 'No body provided',
                submitterName: data.fullName || data.organization || 'Anonymous',
                submitterEmail: data.email || 'anon@example.com',
                organization: data.organization || null,
                consentAccepted: data.consent === true,
                publicAttributionConsent: data.publicAttribution === true,
                confidentialityLevel: data.confidential ? 'CONFIDENTIAL' : 'PUBLIC',
                topic: data.topic || null
            }
        });

        res.status(201).json({ success: true, data: testimony });
    } catch (error: any) {
        console.error('Error submitting testimony:', error);
        res.status(500).json({ success: false, error: 'Failed to submit testimony' });
    }
};

export const subscribeToHearingNotifications = async (req: Request, res: Response) => {
    try {
        const { fullName, email, districtsOfInterest, craftsOfInterest, topicsOfInterest, stakeholderCategory, formatPreferences, notificationFrequency } = req.body;
        
        if (!email || !fullName) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({ success: false, error: 'Invalid email address format' });
        }

        let sub = await prisma.hearingNotificationSubscriber.findUnique({
            where: { email: normalizedEmail }
        });

        const token = crypto.randomBytes(32).toString('hex');
        const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        if (sub) {
            if (sub.status === 'ACTIVE') {
                return res.status(400).json({ success: false, error: 'This email is already actively subscribed.' });
            }
            
            sub = await prisma.hearingNotificationSubscriber.update({
                where: { email: normalizedEmail },
                data: {
                    fullName,
                    verificationTokenHash: token,
                    verificationExpiresAt,
                    status: 'PENDING_VERIFICATION',
                    privacyPolicyVersion: '1.0',
                    consentAt: new Date(),
                    formatPreferences: Array.isArray(formatPreferences) ? formatPreferences : [],
                    notificationFrequency: typeof notificationFrequency === 'string' ? notificationFrequency : 'all'
                }
            });
        } else {
            sub = await prisma.hearingNotificationSubscriber.create({
                data: {
                    fullName,
                    email: normalizedEmail,
                    privacyPolicyVersion: '1.0',
                    consentAt: new Date(),
                    verificationTokenHash: token,
                    verificationExpiresAt,
                    status: 'PENDING_VERIFICATION',
                    formatPreferences: Array.isArray(formatPreferences) ? formatPreferences : [],
                    notificationFrequency: typeof notificationFrequency === 'string' ? notificationFrequency : 'all'
                }
            });
        }

        // Save interests
        await prisma.subscriberDistrict.deleteMany({ where: { subscriberId: sub.id } });
        await prisma.subscriberCraft.deleteMany({ where: { subscriberId: sub.id } });
        await prisma.subscriberTopic.deleteMany({ where: { subscriberId: sub.id } });
        await prisma.subscriberStakeholderCategory.deleteMany({ where: { subscriberId: sub.id } });

        // Link districts
        if (Array.isArray(districtsOfInterest)) {
            for (const dName of districtsOfInterest) {
                if (!dName) continue;
                const dSlug = dName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                let district = await prisma.district.findUnique({ where: { name: dName } });
                if (!district) {
                    district = await prisma.district.create({
                        data: { name: dName, slug: dSlug }
                    });
                }
                await prisma.subscriberDistrict.create({
                    data: {
                        subscriberId: sub.id,
                        districtId: district.id
                    }
                }).catch(err => console.error(`Error linking district ${dName}:`, err));
            }
        }

        // Link crafts
        if (Array.isArray(craftsOfInterest)) {
            for (const cName of craftsOfInterest) {
                if (!cName) continue;
                const cSlug = cName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                let canonical = await prisma.canonicalEntity.findUnique({ where: { slug: cSlug } });
                if (!canonical) {
                    canonical = await prisma.canonicalEntity.create({
                        data: {
                            slug: cSlug,
                            title: cName,
                            entityType: CanonicalEntityType.HERITAGE_OBJECT
                        }
                    });
                }
                let craft = await prisma.craft.findUnique({ where: { canonicalEntityId: canonical.id } });
                if (!craft) {
                    craft = await prisma.craft.create({
                        data: { canonicalEntityId: canonical.id }
                    });
                }
                await prisma.subscriberCraft.create({
                    data: {
                        subscriberId: sub.id,
                        craftId: craft.id
                    }
                }).catch(err => console.error(`Error linking craft ${cName}:`, err));
            }
        }

        // Link topics
        if (Array.isArray(topicsOfInterest)) {
            for (const tName of topicsOfInterest) {
                if (!tName) continue;
                const tSlug = tName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                let topic = await prisma.hearingTopic.findUnique({ where: { name: tName } });
                if (!topic) {
                    topic = await prisma.hearingTopic.create({
                        data: { name: tName, slug: tSlug }
                    });
                }
                await prisma.subscriberTopic.create({
                    data: {
                        subscriberId: sub.id,
                        topicId: topic.id
                    }
                }).catch(err => console.error(`Error linking topic ${tName}:`, err));
            }
        }

        // Link category
        if (stakeholderCategory) {
            const catName = stakeholderCategory;
            const catSlug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            let categoryObj = await prisma.hearingStakeholderCategory.findUnique({ where: { name: catName } });
            if (!categoryObj) {
                categoryObj = await prisma.hearingStakeholderCategory.create({
                    data: { name: catName, slug: catSlug }
                });
            }
            await prisma.subscriberStakeholderCategory.create({
                data: {
                    subscriberId: sub.id,
                    stakeholderCategoryId: categoryObj.id
                }
            }).catch(err => console.error(`Error linking category ${catName}:`, err));
        }

        console.log(`[Email Service Mock] Sending verification email to ${normalizedEmail}. Link: /state-of-kashmir-crafts/public-hearings/verify?token=${token}`);

        res.status(200).json({ success: true, message: 'Subscription saved. Please check your email to verify.' });
    } catch (error: any) {
        console.error('Error subscribing:', error);
        res.status(500).json({ success: false, error: 'Failed to subscribe' });
    }
};

export const verifySubscription = async (req: Request, res: Response) => {
    try {
        const token = requireString(req.params.token);
        const sub = await prisma.hearingNotificationSubscriber.findUnique({
            where: { verificationTokenHash: token }
        });

        if (!sub || !sub.verificationExpiresAt || sub.verificationExpiresAt < new Date()) {
            return res.status(400).json({ success: false, error: 'Invalid or expired token' });
        }

        await prisma.hearingNotificationSubscriber.update({
            where: { id: sub.id },
            data: {
                status: 'ACTIVE',
                verifiedAt: new Date(),
                verificationTokenHash: null,
                verificationExpiresAt: null
            }
        });

        res.json({ success: true, message: 'Subscription verified successfully.' });
    } catch (error: any) {
        console.error('Error verifying subscription:', error);
        res.status(500).json({ success: false, error: 'Failed to verify subscription' });
    }
};

export const getHearingSubscribersAdmin = async (req: Request, res: Response) => {
    try {
        const subscribers = await prisma.hearingNotificationSubscriber.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: subscribers });
    } catch (error: any) {
        console.error('Error fetching subscribers:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch subscribers' });
    }
};

export const updateHearingSubscriberStatusAdmin = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const { status } = req.body;
        const sub = await prisma.hearingNotificationSubscriber.update({
            where: { id },
            data: { status }
        });
        res.json({ success: true, data: sub });
    } catch (error: any) {
        console.error('Error updating subscriber:', error);
        res.status(500).json({ success: false, error: 'Failed to update subscriber' });
    }
};

export const getSubscriberCountForHearing = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const hearing = await prisma.skcHearing.findUnique({ where: { id } });
        if (!hearing) return res.status(404).json({ success: false, error: 'Hearing not found' });

        const count = await prisma.hearingNotificationSubscriber.count({
            where: { status: 'ACTIVE' }
        });

        res.json({ success: true, data: { count } });
    } catch (error: any) {
        console.error('Error getting subscriber count:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch count' });
    }
};

export const sendHearingNotification = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const hearing = await prisma.skcHearing.findUnique({ where: { id } });
        if (!hearing) return res.status(404).json({ success: false, error: 'Hearing not found' });

        if (hearing.status !== 'PUBLISHED' && hearing.status !== 'UPCOMING') {
            return res.status(400).json({ success: false, error: 'Cannot send notifications for draft or unpublished hearings.' });
        }

        const subscribers = await prisma.hearingNotificationSubscriber.findMany({
            where: { status: 'ACTIVE' }
        });

        let sent = 0;
        const notificationLogs = [];

        for (const sub of subscribers) {
            sent++;
            notificationLogs.push({
                subscriberId: sub.id,
                hearingId: hearing.id,
                status: 'SENT',
            });
        }

        if (notificationLogs.length > 0) {
            await prisma.hearingNotificationDelivery.createMany({
                data: notificationLogs
            });
        }

        res.json({ success: true, message: `Notifications sent to ${sent} subscribers.` });
    } catch (error: any) {
        console.error('Error sending notifications:', error);
        res.status(500).json({ success: false, error: 'Failed to send notifications' });
    }
};
export const getHearingAccess = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const user = (req as any).user;
        
        if (!user || !user.email) {
            return res.status(401).json({ success: false, error: 'Authentication required' });
        }

        const hearing = await prisma.skcHearing.findUnique({
            where: { id }
        });

        if (!hearing) {
            return res.status(404).json({ success: false, error: 'Hearing not found' });
        }

        // Check if user is registered for THIS hearing
        const registration = await prisma.hearingRegistration.findFirst({
            where: {
                hearingId: id,
                email: {
                    equals: user.email,
                    mode: 'insensitive'
                }
            }
        });

        if (!registration) {
            return res.status(403).json({ success: false, error: 'You are not registered for this hearing.' });
        }

        // Time check
        const now = new Date();
        const start = hearing.startAt ? new Date(hearing.startAt) : (hearing.date ? new Date(hearing.date) : null);
        const end = hearing.endAt ? new Date(hearing.endAt) : null;

        if (!start || !end) {
            return res.status(400).json({ success: false, error: 'Hearing schedule is not properly defined.' });
        }

        const accessOpens = new Date(start.getTime() - 5 * 60000); // 5 minutes before

        if (now < accessOpens) {
            return res.status(403).json({ 
                success: false, 
                error: 'Meeting access has not opened yet.',
                opensAt: accessOpens.toISOString()
            });
        }

        if (now >= end) {
            return res.status(403).json({ success: false, error: 'Meeting has concluded.' });
        }

        // Return URL
        return res.json({ 
            success: true, 
            data: { 
                meetingLink: hearing.meetingLink || hearing.publicMeetingUrl || null 
            } 
        });
    } catch (error: any) {
        console.error('Error fetching hearing access:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};



