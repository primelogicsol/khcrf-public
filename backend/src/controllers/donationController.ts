import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { PrismaClient, Prisma } from '@prisma/client';
import { EmailService } from '../services/emailService.js';
import { EmailTemplates } from '../constants/emailTemplates.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { validateAndNormalizePan } from '../validators/panValidator.js';
import { requireString } from "../utils/routeHelpers";

// Razorpay client — lazily initialized on first real payment request.
// PAYMENT_PROVIDER=disabled suppresses construction so the server boots in Stage 4A / CI.
let _razorpayClient: Razorpay | null = null;

function isPlaceholderCredential(value?: string): boolean {
    if (!value?.trim()) return true;
    const normalized = value.trim().toLowerCase();
    return (
        normalized.includes("your_razorpay") ||
        normalized.includes("xxxxxxxx") ||
        normalized.includes("placeholder") ||
        normalized.includes("example") ||
        normalized === "changeme"
    );
}

function hasValidRazorpayKeyIdFormat(value?: string): boolean {
    return Boolean(
        value &&
        (value.startsWith("rzp_test_") || value.startsWith("rzp_live_"))
    );
}

function getRazorpay(): Razorpay {
    if (process.env.PAYMENT_PROVIDER === 'disabled') {
        throw new Error('[PaymentProvider] PAYMENT_PROVIDER=disabled — Razorpay is not available in this environment.');
    }
    if (!_razorpayClient) {
        const key_id = process.env.RAZORPAY_KEY_ID;
        const key_secret = process.env.RAZORPAY_KEY_SECRET;
        if (isPlaceholderCredential(key_id) || isPlaceholderCredential(key_secret) || !hasValidRazorpayKeyIdFormat(key_id)) {
            throw new Error('[PaymentProvider] Live or test RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be configured in .env before processing online payments.');
        }
        _razorpayClient = new Razorpay({ key_id: key_id!, key_secret: key_secret! });
    }
    return _razorpayClient;
}

// A custom lightweight JSON-to-CSV formatter to prevent CJS vs ESM package loading mismatch issues.
// SECURITY: Sanitizes formula injection (=, +, -, @, TAB, CR prefixes) per OWASP CSV injection guidance.
function sanitizeCsvField(value: any): string {
    const str = '' + (value === null || value === undefined ? '' : value);
    const escaped = str.replace(/"/g, '""');
    // Prefix dangerous formula-starting characters with a single quote to neutralise spreadsheet execution
    if (/^[=+\-@\t\r]/.test(escaped)) {
        return `"'${escaped}"`;
    }
    return `"${escaped}"`;
}

function jsonToCsv(items: any[]) {
    if (items.length === 0) return '';
    const headers = Object.keys(items[0]);
    const csvRows = [
        headers.join(','),
        ...items.map(row =>
            headers.map(fieldName => sanitizeCsvField(row[fieldName])).join(',')
        )
    ];
    return csvRows.join('\r\n');
}

/**
 * Public Endpoint: User submits form, creates a donation intent and starts Razorpay checkout
 */
export const createDonationIntent = async (req: Request, res: Response) => {
    // Disabled-provider fast-exit — avoids confusing 500 in CI environments
    if (process.env.PAYMENT_PROVIDER === 'disabled') {
        return res.status(503).json({
            success: false,
            code: 'PAYMENT_PROVIDER_DISABLED',
            message: 'Donation payment processing is unavailable in this environment.',
        });
    }
    try {
        const {
            amount,
            currency = "INR",
            donorType, // INDIVIDUAL, INSTITUTIONAL, CORPORATE, IN_KIND, LEGACY
            purpose, // Category name, e.g. "Artisan tools"
            name,
            email,
            phone,
            isAnonymous = false,
            wantsReceipt = true,
            recognitionConsent = false,
            campaignSlug,
            pan
        } = req.body;

        if (!amount || !email || !name || !donorType || !purpose) {
            return res.status(400).json({ error: "Required fields are missing" });
        }

        const panValidation = validateAndNormalizePan(pan);
        if (!panValidation.isValid) {
            return res.status(400).json({ error: panValidation.error });
        }
        const normalizedPan = panValidation.normalized;

        // Seed default categories if they don't exist.
        // Uses slug as the unique key (the actual @unique field in the schema).
        // Wrapped in try/catch so a pre-existing slug never aborts a real payment request.
        const seedCategories = [
            "Artisan tools",
            "Craft education",
            "Policy advocacy",
            "Product photography",
            "Workshop improvement"
        ];
        for (const catName of seedCategories) {
            const catSlug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            try {
                await prisma.donationCategory.upsert({
                    where: { slug: catSlug },
                    update: {},
                    create: { name: catName, slug: catSlug }
                });
            } catch (seedErr) {
                // Non-fatal: category already exists or schema mismatch — continue
                console.warn(`[DonationIntent] Category seed skipped for "${catName}":`, (seedErr as Error).message);
            }
        }

        // Find Category Match
        const category = await prisma.donationCategory.findFirst({
            where: { name: { equals: purpose, mode: 'insensitive' } }
        });

        const userId = (req as any).user?.userId || null;

        // Create the DonationIntent in DB
        const intent = await prisma.donationIntent.create({
            data: {
                amount: parseFloat(amount),
                currency,
                donorType,
                purposeId: category?.id || null,
                purpose,
                name,
                email,
                phone,
                isAnonymous,
                pan: normalizedPan,
                wantsReceipt,
                recognitionConsent,
                status: 'PENDING'
            }
        });

        // Branch strictly by paymentMethod
        const requestedMethod = req.body.paymentMethod || "RAZORPAY";
        let orderId = null;

        switch (requestedMethod) {
            case "RAZORPAY": {
                try {
                    const amountInPaise = Math.round(parseFloat(amount) * 100);
                    const options = {
                        amount: amountInPaise,
                        currency,
                        receipt: intent.id,
                        notes: {
                            intent_id: intent.id,
                            donor_name: name,
                            donor_email: email,
                            donor_phone: phone || "",
                            donation_purpose: purpose,
                            donor_type: donorType,
                            campaign_slug: campaignSlug || "",
                            anonymous_status: isAnonymous ? "true" : "false",
                            recognition_consent: recognitionConsent ? "true" : "false",
                            wants_receipt: wantsReceipt ? "true" : "false"
                        }
                    };

                    const order = await getRazorpay().orders.create(options);
                    orderId = order.id;

                    await prisma.donationIntent.update({
                        where: { id: intent.id },
                        data: { razorpayOrderId: orderId }
                    });
                } catch (orderError) {
                    await prisma.donationIntent.update({
                        where: { id: intent.id },
                        data: { status: "FAILED" }
                    });
                    throw orderError;
                }
                break;
            }

            case "BANK_TRANSFER":
            case "UPI_STATIC_QR":
            case "CHEQUE":
            case "DEMAND_DRAFT":
                // Offline contribution methods persist the canonical DonationIntent without calling Razorpay
                break;

            default:
                return res.status(400).json({
                    success: false,
                    message: `Unsupported contribution method: ${requestedMethod}`,
                    code: "UNSUPPORTED_PAYMENT_METHOD"
                });
        }

        res.status(201).json({
            success: true,
            donationIntentId: intent.id,
            orderId: orderId,
            amount: intent.amount,
            currency: intent.currency,
            key: process.env.RAZORPAY_KEY_ID || ""
        });
    } catch (error: any) {
        console.error("[Razorpay] Order creation failed:", {
            name: error instanceof Error ? error.name : "UnknownError",
            message: error instanceof Error ? error.message : String(error),
            statusCode: error?.statusCode || error?.status,
            code: error?.code
        });

        // 1. Local configuration/environment guard failure (HTTP 503 Service Unavailable)
        const isConfigError = error?.message?.includes("PaymentProvider") ||
                              error?.message?.includes("RAZORPAY_KEY_ID") ||
                              error?.message?.includes("PAYMENT_PROVIDER");

        if (isConfigError) {
            return res.status(503).json({
                success: false,
                code: "PAYMENT_PROVIDER_UNAVAILABLE",
                message: "Online payment processing is currently unconfigured or unavailable. Please use Bank Transfer, UPI QR, or Cheque / DD."
            });
        }

        // 2. External Gateway API Order Creation Failure (HTTP 502 Bad Gateway)
        return res.status(502).json({
            success: false,
            code: "PAYMENT_ORDER_CREATION_FAILED",
            message: "The online payment provider could not initialize this transaction. Please try again or use another contribution method."
        });
    }
};

/**
 * Public Endpoint: Cancel a PENDING donation intent.
 * Called by the frontend when an offline submission fails (e.g. duplicate UTR / 409),
 * so the orphaned intent does not accumulate in the DB.
 * Only PENDING intents can be cancelled — already-submitted/captured intents are protected.
 */
export const cancelDonationIntent = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        if (!id) {
            return res.status(400).json({ error: "Intent ID is required." });
        }

        const intent = await prisma.donationIntent.findUnique({ where: { id } });
        if (!intent) {
            return res.status(404).json({ error: "Donation intent not found." });
        }

        // Guard: only allow cancelling PENDING intents — never touch SUBMITTED/CAPTURED/VERIFIED
        const cancellableStatuses = ["PENDING"];
        if (!cancellableStatuses.includes(intent.status)) {
            return res.status(409).json({
                error: `Cannot cancel an intent with status '${intent.status}'.`,
                code: "INTENT_NOT_CANCELLABLE"
            });
        }

        await prisma.donationIntent.update({
            where: { id },
            data: { status: "CANCELLED" }
        });

        return res.status(200).json({ success: true, message: "Donation intent cancelled." });
    } catch (error) {
        console.error("Cancel Donation Intent Error:", error);
        return res.status(500).json({ error: "Failed to cancel donation intent." });
    }
};

/**
 * Public Endpoint: Client submits Razorpay payment completion payload for server signature verification
 */
export const verifyPaymentSignature = async (req: Request, res: Response) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donationIntentId } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                error: "Missing required Razorpay verification parameters.",
                code: "MISSING_VERIFICATION_PARAMS"
            });
        }

        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!keySecret) {
            return res.status(500).json({
                error: "Razorpay key secret is unconfigured.",
                code: "RAZORPAY_CONFIG_ERROR"
            });
        }

        const expectedSignature = crypto
            .createHmac("sha256", keySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        const expectedBuf = Buffer.from(expectedSignature, "hex");
        const receivedBuf = Buffer.from(razorpay_signature, "hex");

        if (expectedBuf.length !== receivedBuf.length || !crypto.timingSafeEqual(expectedBuf, receivedBuf)) {
            return res.status(400).json({
                error: "Invalid Razorpay payment signature.",
                code: "INVALID_SIGNATURE"
            });
        }

        // Signature verified: update linked donation intent if available
        if (donationIntentId) {
            await prisma.donationIntent.update({
                where: { id: donationIntentId },
                data: { status: "SUCCESS" }
            });
        }

        return res.json({
            success: true,
            message: "Payment signature verified successfully.",
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id
        });
    } catch (error: any) {
        console.error("Verify Payment Signature Error:", error);
        return res.status(500).json({
            error: "Failed to verify payment signature.",
            code: "VERIFICATION_FAILED"
        });
    }
};

/**
 * Public Webhook: Processes status updates from Razorpay asynchronously
 */
export const handleRazorpayWebhook = async (req: Request, res: Response) => {
    const signature = req.headers['x-razorpay-signature'] as string;
    if (!signature) {
        return res.status(400).json({ error: "Missing signature" });
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
        console.error("RAZORPAY_WEBHOOK_SECRET is not configured. Rejecting webhook request.");
        return res.status(500).json({ error: "Webhook verification is not configured. Contact administrator." });
    }

    const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update((req as any).rawBody)
        .digest("hex");

    const expectedBuf = Buffer.from(expectedSignature, 'hex');
    const receivedBuf = Buffer.from(signature, 'hex');
    if (expectedBuf.length !== receivedBuf.length || !crypto.timingSafeEqual(expectedBuf, receivedBuf)) {
        console.error("Webhook signature verification failed");
        return res.status(400).json({ error: "Invalid signature" });
    }

    const eventId = req.body.id;
    const eventType = req.body.event;
    const payload = req.body.payload;

    if (!eventId) {
        return res.status(400).json({ error: "Missing event ID" });
    }

    // 1. Idempotency Check
    const existingEvent = await prisma.razorpayWebhookEvent.findUnique({
        where: { id: eventId }
    });
    if (existingEvent) {
        console.log(`Webhook event ${eventId} already processed.`);
        return res.status(200).json({ status: "already_processed" });
    }

    // Store raw event
    await prisma.razorpayWebhookEvent.create({
        data: {
            id: eventId,
            eventType: eventType,
            payload: req.body,
            processed: false
        }
    });

    try {
        if (eventType === 'payment.captured' || eventType === 'order.paid') {
            const payment = payload.payment?.entity;
            const orderId = payment?.order_id || payload.order?.entity?.id;
            const paymentId = payment?.id;
            const notes = payment?.notes || payload.order?.entity?.notes || {};

            const intentId = notes.intent_id;
            const amount = payment ? (Number(payment.amount) / 100) : (Number(payload.order?.entity?.amount) / 100);
            const currency = payment?.currency || "INR";

            // Find Intent
            let intent = null;
            if (intentId) {
                intent = await prisma.donationIntent.findUnique({ where: { id: intentId } });
            } else if (orderId) {
                intent = await prisma.donationIntent.findUnique({ where: { razorpayOrderId: orderId } });
            }

            const email = notes.donor_email || intent?.email;
            const name = notes.donor_name || intent?.name || "Anonymous Donor";
            const phone = notes.donor_phone || intent?.phone;
            const donorType = notes.donor_type || intent?.donorType || "INDIVIDUAL";
            const purpose = notes.donation_purpose || intent?.purpose || "General";
            const isAnonymous = (notes.anonymous_status === 'true') || intent?.isAnonymous || false;
            const wantsReceipt = (notes.wants_receipt !== 'false') && (intent?.wantsReceipt !== false);
            const recognitionConsent = (notes.recognition_consent === 'true') || intent?.recognitionConsent || false;

            let userId = null;
            if (email) {
                const user = await prisma.user.findUnique({ where: { email } });
                if (user) userId = user.id;
            }

            // 2. Upsert Donor Profile
            let donor = null;
            if (email) {
                donor = await prisma.donor.upsert({
                    where: { email },
                    update: {
                        name,
                        phone: phone || undefined,
                        type: donorType,
                        pan: intent.pan || undefined,
                        recognitionConsent,
                        isAnonymous,
                        userId: userId || undefined
                    },
                    create: {
                        name,
                        email,
                        phone,
                        type: donorType,
                        pan: intent.pan || undefined,
                        recognitionConsent,
                        isAnonymous,
                        userId
                    }
                });
            }

            // 3. Mark intent successful
            if (intent) {
                await prisma.donationIntent.update({
                    where: { id: intent.id },
                    data: {
                        status: 'SUCCESS',
                        donorId: donor?.id
                    }
                });
            }

            // 4. Save/Update Transaction
            const transaction = await prisma.donationTransaction.upsert({
                where: { razorpayPaymentId: paymentId },
                update: {
                    status: 'CAPTURED',
                    capturedAt: new Date()
                },
                create: {
                    donationIntentId: intent?.id,
                    donorId: donor?.id,
                    amount,
                    currency,
                    status: 'CAPTURED',
                    razorpayOrderId: orderId,
                    razorpayPaymentId: paymentId,
                    paymentMethod: payment?.method || 'RAZORPAY',
                    capturedAt: new Date(),
                    settlementStatus: 'unreconciled',
                    metadata: JSON.parse(JSON.stringify(payment || payload))
                }
            });

            // 5. Ensure Category exists
            let category = await prisma.donationCategory.findFirst({
                where: { name: { equals: purpose, mode: 'insensitive' } }
            });
            if (!category) {
                const slug = purpose.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                category = await prisma.donationCategory.create({
                    data: { name: purpose, slug }
                });
            }

            // 6. Allocate
            await prisma.donationAllocation.create({
                data: {
                    donationTransactionId: transaction.id,
                    categoryId: category.id,
                    amount: amount
                }
            });

            // 7. Generate Receipt if required
            if (wantsReceipt && donor) {
                const receiptNumber = `REC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${transaction.id.slice(-4).toUpperCase()}`;
                const receiptUrl = `/api/donation/receipt/${receiptNumber}`;
                await prisma.donationReceipt.upsert({
                    where: { receiptNumber },
                    update: {},
                    create: {
                        donationTransactionId: transaction.id,
                        donorId: donor.id,
                        receiptNumber,
                        receiptUrl,
                        status: 'GENERATED'
                    }
                });
            }

            // 8. Log Admin Audit
            await prisma.auditLog.create({
                data: {
                    userId,
                    action: 'DONATION_CAPTURED',
                    details: `Successful donation of ${currency} ${amount} from ${name} (Payment ID: ${paymentId})`
                }
            });

            // Send Confirmation Email
            if (email) {
                EmailService.sendEmail(email, EmailTemplates.DONATION_RECEIVED, {
                    name,
                    amount,
                    transactionId: paymentId || "N/A"
                }).catch(err => console.error("Webhook email notification failed:", err));
            }

        } else if (eventType === 'payment.failed') {
            const payment = payload.payment?.entity;
            const orderId = payment?.order_id;
            const paymentId = payment?.id;
            const notes = payment?.notes || {};
            const intentId = notes.intent_id;

            let intent = null;
            if (intentId) {
                intent = await prisma.donationIntent.findUnique({ where: { id: intentId } });
            } else if (orderId) {
                intent = await prisma.donationIntent.findUnique({ where: { razorpayOrderId: orderId } });
            }

            if (intent) {
                await prisma.donationIntent.update({
                    where: { id: intent.id },
                    data: { status: 'FAILED' }
                });
            }

            await prisma.donationTransaction.upsert({
                where: { razorpayPaymentId: paymentId },
                update: { status: 'FAILED' },
                create: {
                    donationIntentId: intent?.id,
                    amount: payment ? (Number(payment.amount) / 100) : 0,
                    status: 'FAILED',
                    razorpayOrderId: orderId,
                    razorpayPaymentId: paymentId,
                    paymentMethod: payment?.method || 'RAZORPAY',
                    metadata: JSON.parse(JSON.stringify(payment))
                }
            });

            await prisma.auditLog.create({
                data: {
                    action: 'DONATION_FAILED',
                    details: `Payment failed for order ${orderId} (Payment ID: ${paymentId})`
                }
            });

        } else if (eventType === 'refund.created') {
            const refund = payload.refund?.entity;
            const paymentId = refund?.payment_id;
            const refundId = refund?.id;
            const amount = refund ? (Number(refund.amount) / 100) : 0;

            const transaction = await prisma.donationTransaction.findUnique({
                where: { razorpayPaymentId: paymentId }
            });

            if (transaction) {
                await prisma.donationTransaction.update({
                    where: { id: transaction.id },
                    data: { status: 'REFUNDED' }
                });

                await prisma.donationRefund.create({
                    data: {
                        donationTransactionId: transaction.id,
                        razorpayRefundId: refundId,
                        amount,
                        status: refund.status || 'processed',
                        reason: refund.notes?.reason || refund.speed_processed
                    }
                });

                await prisma.auditLog.create({
                    data: {
                        action: 'DONATION_REFUNDED',
                        details: `Refund of ${amount} created for payment ID: ${paymentId} (Refund ID: ${refundId})`
                    }
                });
            }
        }

        // Mark webhook processed
        await prisma.razorpayWebhookEvent.update({
            where: { id: eventId },
            data: { processed: true }
        });

        res.status(200).json({ status: "success" });
    } catch (err: any) {
        console.error("Webhook handling error:", err);
        await prisma.razorpayWebhookEvent.update({
            where: { id: eventId },
            data: { error: err.message || "Unknown webhook handler error" }
        });
        res.status(500).json({ error: "Webhook event processing failed" });
    }
};

/**
 * Admin: Get Dashboard Stats & KPIs
 */
export const getAdminStats = async (req: Request, res: Response) => {
    try {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const startOfThisMonth = new Date();
        startOfThisMonth.setDate(1);
        startOfThisMonth.setHours(0, 0, 0, 0);

        // Online (Razorpay) totals — CAPTURED transactions only
        const totalResult = await prisma.donationTransaction.aggregate({
            _sum: { amount: true },
            where: { status: 'CAPTURED' }
        });

        const todayResult = await prisma.donationTransaction.aggregate({
            _sum: { amount: true },
            where: {
                status: 'CAPTURED',
                createdAt: { gte: startOfToday }
            }
        });

        const monthResult = await prisma.donationTransaction.aggregate({
            _sum: { amount: true },
            where: {
                status: 'CAPTURED',
                createdAt: { gte: startOfThisMonth }
            }
        });

        // Offline verified totals (VERIFIED and CLEARED submissions)
        const offlineTotalResult = await prisma.offlinePaymentSubmission.aggregate({
            _sum: { amount: true },
            where: { paymentStatus: { in: ['VERIFIED', 'CLEARED'] } }
        });

        const offlineTodayResult = await prisma.offlinePaymentSubmission.aggregate({
            _sum: { amount: true },
            where: {
                paymentStatus: { in: ['VERIFIED', 'CLEARED'] },
                createdAt: { gte: startOfToday }
            }
        });

        const offlineMonthResult = await prisma.offlinePaymentSubmission.aggregate({
            _sum: { amount: true },
            where: {
                paymentStatus: { in: ['VERIFIED', 'CLEARED'] },
                createdAt: { gte: startOfThisMonth }
            }
        });

        // Offline pending verification count
        const offlinePendingCount = await prisma.offlinePaymentSubmission.count({
            where: { paymentStatus: { in: ['AWAITING_VERIFICATION', 'AWAITING_RECEIPT', 'SUBMITTED', 'RECEIVED', 'DEPOSITED'] } }
        });

        const counts = await prisma.donationTransaction.groupBy({
            by: ['status'],
            _count: { _all: true }
        });

        const capturedCount = counts.find(c => c.status === 'CAPTURED')?._count?._all || 0;
        const failedCount = counts.find(c => c.status === 'FAILED')?._count?._all || 0;
        const refundedCount = counts.find(c => c.status === 'REFUNDED')?._count?._all || 0;

        const pendingCount = await prisma.donationIntent.count({
            where: { status: 'PENDING' }
        });

        const donorCount = await prisma.donor.count();

        // Get Top Purpose
        const purposeGroup = await prisma.donationAllocation.groupBy({
            by: ['categoryId'],
            _sum: { amount: true },
            orderBy: {
                _sum: { amount: 'desc' }
            },
            take: 1
        });

        let topPurpose = 'None';
        if (purposeGroup.length > 0 && purposeGroup[0].categoryId) {
            const cat = await prisma.donationCategory.findUnique({
                where: { id: purposeGroup[0].categoryId }
            });
            if (cat) topPurpose = cat.name;
        }

        // Refund sum — only from confirmed refund records
        const refundSum = await prisma.donationRefund.aggregate({
            _sum: { amount: true },
            where: { status: { in: ['processed', 'PROCESSED', 'SUCCESS'] } }
        });

        // Serialize Prisma Decimal aggregates to plain JS numbers
        const toNum = (v: any) => (v == null ? 0 : parseFloat(String(v)));

        const onlineTotal = toNum(totalResult._sum.amount);
        const offlineTotal = toNum(offlineTotalResult._sum.amount);

        res.json({
            // Combined (online + offline verified) totals
            totalDonations: onlineTotal + offlineTotal,
            donationsToday: toNum(todayResult._sum.amount) + toNum(offlineTodayResult._sum.amount),
            donationsThisMonth: toNum(monthResult._sum.amount) + toNum(offlineMonthResult._sum.amount),
            // Online vs offline breakdown
            onlineTotalDonations: onlineTotal,
            offlineTotalDonations: offlineTotal,
            // Payment status counts
            successfulPayments: capturedCount,
            failedPayments: failedCount,
            pendingPayments: pendingCount,
            offlinePendingVerification: offlinePendingCount,
            refunds: refundedCount,
            refundAmount: toNum(refundSum._sum.amount),
            topDonationPurpose: topPurpose,
            donorCount
        });
    } catch (error) {
        console.error("Get Admin Stats Error:", error);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
};

/**
 * Admin: Get filtered transactions with full relationship insight
 */
export const getAdminTransactions = async (req: Request, res: Response) => {
    try {
        const {
            startDate,
            endDate,
            status,
            purpose,
            donorType,
            paymentMethod,
            currency,
            receiptStatus,
            search
        } = req.query;

        const where: Prisma.DonationTransactionWhereInput = {};

        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate as string);
            if (endDate) {
                const end = new Date(endDate as string);
                end.setHours(23, 59, 59, 999);
                where.createdAt.lte = end;
            }
        }

        if (status) {
            where.status = status as string;
        }

        if (paymentMethod) {
            where.paymentMethod = paymentMethod as string;
        }

        if (currency) {
            where.currency = currency as string;
        }

        if (donorType) {
            where.donor = {
                type: donorType as string
            };
        }

        if (purpose) {
            where.allocations = {
                some: {
                    category: {
                        name: { equals: purpose as string, mode: 'insensitive' }
                    }
                }
            };
        }

        if (receiptStatus) {
            if (receiptStatus === 'GENERATED') {
                where.receipts = { some: {} };
            } else if (receiptStatus === 'PENDING') {
                where.receipts = { none: {} };
            }
        }

        if (search) {
            where.OR = [
                { razorpayPaymentId: { contains: search as string, mode: 'insensitive' } },
                { razorpayOrderId: { contains: search as string, mode: 'insensitive' } },
                {
                    donor: {
                        name: { contains: search as string, mode: 'insensitive' }
                    }
                },
                {
                    donor: {
                        email: { contains: search as string, mode: 'insensitive' }
                    }
                }
            ];
        }

        const transactions = await prisma.donationTransaction.findMany({
            where,
            include: {
                donor: true,
                donationIntent: true,
                receipts: true,
                allocations: {
                    include: {
                        category: true
                    }
                },
                refunds: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(transactions);
    } catch (error) {
        console.error("Get Admin Transactions Error:", error);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
};

/**
 * Admin: Get a single donation transaction by ID
 */
export const getAdminTransactionById = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        if (!id) {
            return res.status(400).json({ error: "Transaction ID is required" });
        }

        const transaction = await prisma.donationTransaction.findUnique({
            where: { id },
            include: {
                donor: true,
                donationIntent: true,
                receipts: true,
                allocations: {
                    include: {
                        category: true
                    }
                },
                refunds: true
            }
        });

        if (!transaction) {
            return res.status(404).json({ error: "Donation transaction not found" });
        }

        res.json(transaction);
    } catch (error) {
        console.error("Get Admin Transaction By ID Error:", error);
        res.status(500).json({ error: "Failed to fetch transaction" });
    }
};

/**
 * Admin: Manually fetch a transaction's status from Razorpay & update dashboard
 */
export const manualRefreshPayment = async (req: Request, res: Response) => {
    // Disabled-provider fast-exit
    if (process.env.PAYMENT_PROVIDER === 'disabled') {
        return res.status(503).json({
            success: false,
            code: 'PAYMENT_PROVIDER_DISABLED',
            message: 'Payment refresh is unavailable in this environment.',
        });
    }
    try {
        const paymentId = requireString(req.params.paymentId);
        if (!paymentId) {
            return res.status(400).json({ error: "Payment ID is required" });
        }

        const payment = await getRazorpay().payments.fetch(paymentId);
        if (!payment) {
            return res.status(404).json({ error: "Payment not found in Razorpay" });
        }

        // Audit Log
        await prisma.auditLog.create({
            data: {
                userId: (req as any).user?.userId,
                action: 'MANUAL_REFRESH',
                details: `Admin requested manual status sync for Payment ID: ${paymentId} (Razorpay Status: ${payment.status})`
            }
        });

        if (payment.status === 'captured') {
            const notes = payment.notes || {};
            const intentId = notes.intent_id;
            const orderId = payment.order_id;

            let intent = null;
            if (intentId) {
                intent = await prisma.donationIntent.findUnique({ where: { id: intentId } });
            } else if (orderId) {
                intent = await prisma.donationIntent.findUnique({ where: { razorpayOrderId: orderId } });
            }

            const email = notes.donor_email || intent?.email;
            const name = notes.donor_name || intent?.name || "Anonymous Donor";
            const phone = notes.donor_phone || intent?.phone;
            const donorType = notes.donor_type || intent?.donorType || "INDIVIDUAL";
            const purpose = notes.donation_purpose || intent?.purpose || "General";
            const isAnonymous = (notes.anonymous_status === 'true') || intent?.isAnonymous || false;
            const wantsReceipt = (notes.wants_receipt !== 'false') && (intent?.wantsReceipt !== false);
            const recognitionConsent = (notes.recognition_consent === 'true') || intent?.recognitionConsent || false;

            let userId = null;
            if (email) {
                const user = await prisma.user.findUnique({ where: { email } });
                if (user) userId = user.id;
            }

            let donor = null;
            if (email) {
                donor = await prisma.donor.upsert({
                    where: { email },
                    update: {
                        name,
                        phone: phone || undefined,
                        pan: intent.pan || undefined,
                        type: donorType,
                        recognitionConsent,
                        isAnonymous,
                        userId: userId || undefined
                    },
                    create: {
                        name,
                        email,
                        phone,
                        pan: intent.pan || undefined,
                        type: donorType,
                        recognitionConsent,
                        isAnonymous,
                        userId
                    }
                });
            }

            if (intent) {
                await prisma.donationIntent.update({
                    where: { id: intent.id },
                    data: {
                        status: 'SUCCESS',
                        donorId: donor?.id
                    }
                });
            }

            const transaction = await prisma.donationTransaction.upsert({
                where: { razorpayPaymentId: paymentId },
                update: {
                    status: 'CAPTURED',
                    capturedAt: new Date()
                },
                create: {
                    donationIntentId: intent?.id,
                    donorId: donor?.id,
                    amount: Number(payment.amount) / 100,
                    currency: payment.currency || "INR",
                    status: 'CAPTURED',
                    razorpayOrderId: orderId,
                    razorpayPaymentId: paymentId,
                    paymentMethod: payment.method || 'RAZORPAY',
                    capturedAt: new Date(),
                    settlementStatus: 'unreconciled',
                    metadata: JSON.parse(JSON.stringify(payment))
                }
            });

            let category = await prisma.donationCategory.findFirst({
                where: { name: { equals: purpose, mode: 'insensitive' } }
            });
            if (!category) {
                const slug = purpose.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                category = await prisma.donationCategory.create({
                    data: { name: purpose, slug }
                });
            }

            // Check allocation
            const existingAllocation = await prisma.donationAllocation.findFirst({
                where: { donationTransactionId: transaction.id }
            });
            if (!existingAllocation) {
                await prisma.donationAllocation.create({
                    data: {
                        donationTransactionId: transaction.id,
                        categoryId: category.id,
                        amount: Number(payment.amount) / 100
                    }
                });
            }

            if (wantsReceipt && donor) {
                const receiptNumber = `REC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${transaction.id.slice(-4).toUpperCase()}`;
                const receiptUrl = `/api/donation/receipt/${receiptNumber}`;
                await prisma.donationReceipt.upsert({
                    where: { receiptNumber },
                    update: {},
                    create: {
                        donationTransactionId: transaction.id,
                        donorId: donor.id,
                        receiptNumber,
                        receiptUrl,
                        status: 'GENERATED'
                    }
                });
            }

            return res.json({ success: true, status: 'CAPTURED', message: 'Payment successfully verified and synchronized.' });
        }

        return res.json({ success: true, status: payment.status, message: `Payment found with status: ${payment.status}` });
    } catch (error: any) {
        console.error("Manual Refresh Error:", error);
        res.status(500).json({ error: "Failed to manually synchronize payment: " + error.message });
    }
};

/**
 * Admin: Export donations in CSV format — respects the same filters as getAdminTransactions
 */
export const exportTransactionsCsv = async (req: Request, res: Response) => {
    try {
        const {
            startDate,
            endDate,
            status,
            purpose,
            donorType,
            paymentMethod,
            currency,
            receiptStatus,
            search
        } = req.query;

        // Reuse the same where-clause logic as getAdminTransactions
        const where: Prisma.DonationTransactionWhereInput = {};

        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate as string);
            if (endDate) {
                const end = new Date(endDate as string);
                end.setHours(23, 59, 59, 999);
                where.createdAt.lte = end;
            }
        }

        if (status) where.status = status as string;
        if (paymentMethod) where.paymentMethod = paymentMethod as string;
        if (currency) where.currency = currency as string;

        if (donorType) {
            where.donor = { type: donorType as string };
        }

        if (purpose) {
            where.allocations = {
                some: {
                    category: {
                        name: { equals: purpose as string, mode: 'insensitive' }
                    }
                }
            };
        }

        if (receiptStatus) {
            if (receiptStatus === 'GENERATED') {
                where.receipts = { some: {} };
            } else if (receiptStatus === 'PENDING') {
                where.receipts = { none: {} };
            }
        }

        if (search) {
            where.OR = [
                { razorpayPaymentId: { contains: search as string, mode: 'insensitive' } },
                { razorpayOrderId: { contains: search as string, mode: 'insensitive' } },
                { donor: { name: { contains: search as string, mode: 'insensitive' } } },
                { donor: { email: { contains: search as string, mode: 'insensitive' } } }
            ];
        }

        const transactions = await prisma.donationTransaction.findMany({
            where,
            include: {
                donor: true,
                allocations: { include: { category: true } },
                receipts: true
            },
            orderBy: { createdAt: 'desc' }
        });

        const dateStamp = new Date().toISOString().slice(0, 10);
        const filterSuffix = Object.keys(where).length > 0 ? '_filtered' : '_all';

        const data = transactions.map(t => ({
            Date: t.createdAt.toISOString(),
            CapturedAt: t.capturedAt?.toISOString() || 'N/A',
            DonorName: t.donor?.isAnonymous ? 'Anonymous' : t.donor?.name || 'N/A',
            DonorEmail: t.donor?.isAnonymous ? 'Anonymous' : t.donor?.email || 'N/A',
            DonorPhone: t.donor?.isAnonymous ? 'Anonymous' : t.donor?.phone || 'N/A',
            DonorType: t.donor?.type || 'N/A',
            Amount: t.amount,
            Currency: t.currency,
            PaymentMethod: t.paymentMethod || 'N/A',
            Purpose: t.allocations.map(a => a.category?.name).join('; ') || 'N/A',
            RazorpayPaymentId: t.razorpayPaymentId || 'N/A',
            RazorpayOrderId: t.razorpayOrderId || 'N/A',
            Status: t.status,
            SettlementStatus: t.settlementStatus,
            ReceiptNumber: t.receipts[0]?.receiptNumber || 'N/A'
        }));

        const csv = jsonToCsv(data);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=donations_export_${dateStamp}${filterSuffix}.csv`);
        return res.status(200).send(csv);
    } catch (error) {
        console.error("CSV Export Error:", error);
        res.status(500).json({ error: "Failed to export CSV" });
    }
};


/**
 * Admin: Get Webhook Events Log
 */
export const getWebhookLog = async (req: Request, res: Response) => {
    try {
        const events = await prisma.razorpayWebhookEvent.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100
        });
        res.json(events);
    } catch (error) {
        console.error("Webhook Log Error:", error);
        res.status(500).json({ error: "Failed to fetch webhook log" });
    }
};

/**
 * User/Public: Get My Donations
 */
export const getMyDonations = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const donor = await prisma.donor.findUnique({
            where: { userId }
        });

        if (!donor) return res.json([]);

        const transactions = await prisma.donationTransaction.findMany({
            where: { donorId: donor.id },
            include: {
                receipts: true,
                allocations: {
                    include: {
                        category: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(transactions);
    } catch (error) {
        console.error("Get My Donations Error:", error);
        res.status(500).json({ error: "Failed to fetch donations" });
    }
};

/**
 * Admin: Audit logs
 */
export const getAuditLogs = async (req: Request, res: Response) => {
    try {
        const logs = await prisma.auditLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 200
        });
        res.json(logs);
    } catch (error) {
        console.error("Audit Logs Error:", error);
        res.status(500).json({ error: "Failed to fetch audit logs" });
    }
};

/**
 * Public: Get all donation categories (for purpose filter dropdown)
 */
export const getDonationCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.donationCategory.findMany({
            orderBy: { name: 'asc' },
            select: { id: true, name: true, slug: true }
        });
        res.json(categories);
    } catch (error) {
        console.error("Get Donation Categories Error:", error);
        res.status(500).json({ error: "Failed to fetch categories" });
    }
};


/**
 * Public/User/Admin: Fetch Receipt Details (Printable HTML)
 */
export const getReceiptByNumber = async (req: Request, res: Response) => {
    try {
        const receiptNumber = requireString(req.params.receiptNumber);

        if (!receiptNumber) {
            return res.status(400).json({ error: "Receipt number is required" });
        }

        const receipt = await prisma.donationReceipt.findUnique({
            where: { receiptNumber },
            include: {
                donor: true,
                transaction: {
                    include: {
                        allocations: {
                            include: {
                                category: true
                            }
                        }
                    }
                }
            }
        });

        if (!receipt) {
            return res.status(404).json({ error: "Receipt not found" });
        }

        // Access Control: Allow if user is admin, owner of receipt, or provides token query
        const reqUser = (req as any).user;
        const isOwner = reqUser && (reqUser.userId === receipt.donor?.userId || reqUser.email === receipt.donor?.email);
        const isAdmin = reqUser && reqUser.role === "ADMIN";
        const hasAccess = isOwner || isAdmin || req.query.token === receipt.id;

        if (!hasAccess) {
            return res.status(403).json({ error: "Access denied. Authentication or receipt access token required." });
        }

        // Return a beautiful HTML invoice for printing if HTML is requested, otherwise JSON.
        if (req.headers.accept?.includes("text/html") || req.query.format === "html") {
            res.setHeader("Content-Type", "text/html");
            const dateStr = receipt.createdAt.toLocaleDateString();
            const tx = receipt.transaction;
            const donor = receipt.donor;
            const purpose = tx.allocations[0]?.category?.name || "General Support";

            return res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Donation Receipt - ${receipt.receiptNumber}</title>
                    <style>
                        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 40px; background-color: #fafafa; }
                        .receipt-box { max-width: 800px; margin: auto; padding: 40px; border: 1px solid #e2e8f0; background: white; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); font-size: 15px; line-height: 26px; }
                        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #A06B49; padding-bottom: 24px; margin-bottom: 24px; }
                        .logo { font-size: 26px; font-weight: 900; color: #A06B49; letter-spacing: -0.5px; }
                        .subtitle { font-size: 13px; color: #718096; margin-top: 4px; }
                        .details { margin-bottom: 30px; display: grid; grid-template-cols: 1fr 1fr; gap: 20px; }
                        .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; margin-top: 10px; }
                        .table th { background: #f7fafc; text-align: left; padding: 14px; border-bottom: 2px solid #edf2f7; font-weight: 700; color: #4a5568; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
                        .table td { padding: 14px; border-bottom: 1px solid #edf2f7; color: #4a5568; }
                        .total-section { display: flex; justify-content: flex-end; margin-top: 20px; }
                        .total { font-size: 22px; font-weight: 900; color: #A06B49; border-top: 2px solid #A06B49; padding-top: 10px; display: inline-block; }
                        .footer { font-size: 12px; text-align: center; color: #a0aec0; margin-top: 60px; border-top: 1px solid #e2e8f0; padding-top: 24px; }
                        .button { display: inline-block; padding: 12px 24px; background: #A06B49; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-bottom: 24px; font-size: 14px; transition: background 0.2s; }
                        .button:hover { background: #825334; }
                        .btn-container { max-width: 800px; margin: auto; display: flex; gap: 10px; }
                        @media print { .no-print { display: none; } body { background: white; margin: 0; } .receipt-box { border: none; box-shadow: none; padding: 0; } }
                    </style>
                </head>
                <body>
                    <div class="btn-container no-print">
                        <a href="javascript:window.print()" class="button">Print Receipt</a>
                    </div>
                    <div class="receipt-box">
                        <div class="header">
                            <div>
                                <div class="logo">Hamadan Craft Revival Foundation - Kashmir</div>
                                <div class="subtitle">Sufi Science Center, Kashmir</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-weight: 900; font-size: 20px; color: #2d3748; letter-spacing: -0.5px;">DONATION RECEIPT</div>
                                <div class="subtitle" style="font-family: monospace; font-weight: bold; color: #4a5568;">Receipt: ${receipt.receiptNumber}</div>
                                <div class="subtitle">Date: ${dateStr}</div>
                            </div>
                        </div>

                        <div class="details">
                            <div>
                                <div style="font-weight: 800; color: #A06B49; font-size: 12px; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 8px;">Donor Details</div>
                                <div><strong>Name:</strong> ${donor.isAnonymous ? "Anonymous Donor" : donor.name}</div>
                                <div><strong>Email:</strong> ${donor.isAnonymous ? "Anonymous" : donor.email}</div>
                                <div><strong>Phone:</strong> ${donor.isAnonymous ? "-" : (donor.phone || "-")}</div>
                                <div><strong>Type:</strong> ${donor.type}</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-weight: 800; color: #A06B49; font-size: 12px; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 8px;">Organization Details</div>
                                <div><strong>Hamadan Craft Revival Foundation - Kashmir</strong></div>
                                <div>Sufi Science Center</div>
                                <div>Srinagar, Jammu & Kashmir</div>
                                <div>India</div>
                            </div>
                        </div>

                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Allocation Purpose</th>
                                    <th>Reference ID</th>
                                    <th style="text-align: right;">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Charitable Donation (Kashmir Artisan Support)</td>
                                    <td><strong>${purpose}</strong></td>
                                    <td style="font-family: monospace;">${tx.razorpayPaymentId || "N/A"}</td>
                                    <td style="text-align: right; font-weight: 700;">${tx.currency} ${tx.amount.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div class="total-section">
                            <div class="total">
                                Total Contribution: ${tx.currency} ${tx.amount.toLocaleString()}
                            </div>
                        </div>

                        <div class="footer">
                            <p>Thank you for your support! Your contribution makes a direct, measurable difference in improving workspace conditions, providing tools, and supporting the education of Kashmiri artisans.</p>
                            <p>This is a secure, computer-generated receipt issued by Hamadan Craft Revival Foundation - Kashmir and requires no physical signature.</p>
                            <p>© ${new Date().getFullYear()} Hamadan Craft Revival Foundation - Kashmir. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `);
        }

        res.json(receipt);
    } catch (error) {
        console.error("Get Receipt Error:", error);
        res.status(500).json({ error: "Failed to fetch receipt" });
    }
};

/**
 * Public/User: Submit Offline Payment Evidence (Bank Transfer, UPI QR, Cheque/DD)
 */
export const submitOfflinePayment = async (req: Request, res: Response) => {
    try {
        const {
            donationIntentId,
            paymentMethod,
            amount,
            utrNumber,
            paymentDate,
            originatingBank,
            accountHolderName,
            paymentProofUrl,
            instrumentType,
            instrumentNumber,
            issuingBank,
            instrumentDate,
            courierTracking
        } = req.body;

        if (!paymentMethod || !amount) {
            return res.status(400).json({ error: "Payment method and amount are required" });
        }

        const validMethods = ["BANK_TRANSFER", "UPI_STATIC_QR", "CHEQUE", "DEMAND_DRAFT"];
        if (!validMethods.includes(paymentMethod)) {
            return res.status(400).json({ error: `Invalid payment method: ${paymentMethod}` });
        }

        // Reconcile linked DonationIntent if provided
        let targetIntent = null;
        if (donationIntentId) {
            targetIntent = await prisma.donationIntent.findUnique({
                where: { id: donationIntentId }
            });
            if (!targetIntent) {
                return res.status(404).json({ error: "Linked donation intent not found" });
            }

            // Amount & method integrity check
            if (Math.abs(targetIntent.amount - parseFloat(amount)) > 0.01) {
                return res.status(400).json({ error: "Submitted amount does not match the intended donation amount" });
            }
        }

        // Method-specific field validation
        if (paymentMethod === "BANK_TRANSFER" || paymentMethod === "UPI_STATIC_QR") {
            if (!utrNumber || utrNumber.trim().length < 6) {
                return res.status(400).json({
                    message: "A valid UTR or transaction reference (minimum 6 characters) is required.",
                    code: "INVALID_UTR_REFERENCE"
                });
            }
        }

        if (paymentMethod === "CHEQUE" || paymentMethod === "DEMAND_DRAFT") {
            if (!instrumentNumber || instrumentNumber.trim().length < 3) {
                return res.status(400).json({
                    message: "A valid instrument number is required.",
                    code: "INVALID_INSTRUMENT_NUMBER"
                });
            }
            if (!issuingBank || issuingBank.trim().length < 2) {
                return res.status(400).json({
                    message: "The issuing bank name is required.",
                    code: "INVALID_ISSUING_BANK"
                });
            }
        }

        // Method-aware duplicate detection
        const normalizedUtr = utrNumber ? utrNumber.trim().replace(/\s+/g, "").toUpperCase() : null;
        if (normalizedUtr) {
            const existingUtr = await prisma.offlinePaymentSubmission.findFirst({
                where: { utrNumber: normalizedUtr }
            });
            if (existingUtr) {
                return res.status(409).json({
                    message: "A payment submission with this transaction reference (UTR) already exists.",
                    code: "DUPLICATE_UTR"
                });
            }
        }

        // Cheque / DD instrument number duplicate detection
        const normalizedInstrument = instrumentNumber ? instrumentNumber.trim().replace(/\s+/g, "").toUpperCase() : null;
        if (normalizedInstrument && (paymentMethod === "CHEQUE" || paymentMethod === "DEMAND_DRAFT")) {
            const existingInstrument = await prisma.offlinePaymentSubmission.findFirst({
                where: {
                    instrumentNumber: normalizedInstrument,
                    paymentMethod: paymentMethod as any
                }
            });
            if (existingInstrument) {
                return res.status(409).json({
                    message: `A submission with this ${paymentMethod === "CHEQUE" ? "cheque" : "demand draft"} number already exists.`,
                    code: "DUPLICATE_INSTRUMENT_NUMBER"
                });
            }
        }

        // Operational lifecycle initial state logic
        const isChequeOrDd = paymentMethod === "CHEQUE" || paymentMethod === "DEMAND_DRAFT";
        const initialPaymentStatus = isChequeOrDd ? "AWAITING_RECEIPT" : "AWAITING_VERIFICATION";

        const submission = await prisma.offlinePaymentSubmission.create({
            data: {
                donationIntentId: donationIntentId || null,
                paymentMethod: paymentMethod as any,
                amount: parseFloat(amount),
                utrNumber: normalizedUtr,
                paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
                originatingBank: originatingBank || null,
                accountHolderName: accountHolderName || null,
                paymentProofUrl: paymentProofUrl || null,
                instrumentType: instrumentType || (isChequeOrDd ? paymentMethod : null),
                instrumentNumber: instrumentNumber || null,
                issuingBank: issuingBank || null,
                instrumentDate: instrumentDate ? new Date(instrumentDate) : null,
                courierTracking: courierTracking || null,
                submissionStatus: "SUBMITTED",
                paymentStatus: initialPaymentStatus,
                receiptStatus: "NOT_ELIGIBLE"
            }
        });

        // Update linked donation intent status
        if (donationIntentId) {
            await prisma.donationIntent.update({
                where: { id: donationIntentId },
                data: {
                    paymentMethod: paymentMethod as any,
                    status: "SUBMITTED"
                }
            });
        }

        // ── Email: Submission received → donor confirmation ────────────────
        if (targetIntent?.email) {
            try {
                const methodLabel: Record<string,string> = {
                    BANK_TRANSFER: 'Bank Transfer',
                    UPI_STATIC_QR: 'UPI QR Payment',
                    CHEQUE: 'Cheque',
                    DEMAND_DRAFT: 'Demand Draft',
                };
                await EmailService.sendEmail(
                    targetIntent.email,
                    'offline_submission_received',
                    {
                        subject: 'We received your payment details — KHCRF',
                        donorName: targetIntent.name || 'Donor',
                        amount: `₹${parseFloat(amount).toLocaleString('en-IN')}`,
                        paymentMethod: methodLabel[paymentMethod] || paymentMethod,
                        referenceNumber: `KHCRF-OFFLINE-${submission.id.slice(-6).toUpperCase()}`,
                        purpose: targetIntent.purpose || 'General Support',
                        utrNumber: normalizedUtr || 'N/A',
                        instrumentNumber: normalizedInstrument || 'N/A',
                    }
                );
            } catch (emailErr) {
                // Non-fatal — log and continue
                console.error('[submitOfflinePayment] Donor confirmation email failed (non-fatal):', emailErr);
            }
        }

        // ── Email: New submission → admin alert ────────────────────────────
        const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM;
        if (adminEmail) {
            try {
                await EmailService.sendEmail(
                    adminEmail,
                    'admin_offline_submission_alert',
                    {
                        subject: `[KHCRF Admin] New offline payment — ${paymentMethod} — ₹${parseFloat(amount).toLocaleString('en-IN')}`,
                        donorName: targetIntent?.name || 'Unknown',
                        donorEmail: targetIntent?.email || 'Unknown',
                        amount: `₹${parseFloat(amount).toLocaleString('en-IN')}`,
                        paymentMethod,
                        submissionId: submission.id,
                        referenceNumber: `KHCRF-OFFLINE-${submission.id.slice(-6).toUpperCase()}`,
                        utrNumber: normalizedUtr || 'N/A',
                        instrumentNumber: normalizedInstrument || 'N/A',
                        reviewUrl: `${process.env.FRONTEND_URL || 'https://khcrf.org'}/dashboard/donations`,
                    }
                );
            } catch (emailErr) {
                console.error('[submitOfflinePayment] Admin alert email failed (non-fatal):', emailErr);
            }
        }

        res.status(201).json({
            success: true,
            submissionId: submission.id,
            message: "Your payment details have been submitted for verification.",
            referenceNumber: `KHCRF-OFFLINE-${submission.id.slice(-6).toUpperCase()}`,
            submission
        });
    } catch (error: any) {
        console.error("Submit Offline Payment Error:", error);
        res.status(500).json({
            message: "We could not submit your payment details. Please try again or contact KHCRF support.",
            error: "We could not submit your payment details. Please try again or contact KHCRF support.",
            code: "OFFLINE_SUBMISSION_FAILED"
        });
    }
};

/**
 * Admin Endpoint: List all offline payment submissions for review
 */
export const getAdminOfflineSubmissions = async (req: Request, res: Response) => {
    try {
        const submissions = await prisma.offlinePaymentSubmission.findMany({
            include: {
                donationIntent: true
            },
            orderBy: { createdAt: "desc" }
        });
        res.json(submissions);
    } catch (error) {
        console.error("Get Admin Offline Submissions Error:", error);
        res.status(500).json({ error: "Failed to fetch offline submissions" });
    }
};

/**
 * Admin Endpoint: Process verification or rejection of an offline payment submission
 */
export const verifyOfflineSubmission = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const { action, adminNotes, rejectionReason } = req.body;

        if (!id || !action) {
            return res.status(400).json({ error: "Submission ID and action are required" });
        }

        // REJECT requires a reason
        if ((action === "REJECT" || action === "MARK_BOUNCED") && !rejectionReason?.trim()) {
            return res.status(400).json({
                error: "A rejection reason is required when rejecting or bouncing a submission.",
                code: "REJECTION_REASON_REQUIRED"
            });
        }

        const submission = await prisma.offlinePaymentSubmission.findUnique({
            where: { id },
            include: { donationIntent: true }
        });

        if (!submission) {
            return res.status(404).json({ error: "Offline payment submission not found" });
        }

        const currentStatus = submission.paymentStatus;
        const adminUserId = (req as any).user?.userId;
        if (!adminUserId) {
            return res.status(401).json({ error: "Authenticated admin user required" });
        }

        // ── State Machine Guard: define valid transitions ──────────────────────
        type PaymentStatus = string;
        const VALID_TRANSITIONS: Record<string, PaymentStatus[]> = {
            VERIFY:         ['AWAITING_VERIFICATION', 'AWAITING_RECEIPT', 'SUBMITTED'],
            MARK_DEPOSITED: ['RECEIVED'],
            MARK_CLEARED:   ['DEPOSITED'],
            REJECT:         ['AWAITING_VERIFICATION', 'AWAITING_RECEIPT', 'SUBMITTED', 'RECEIVED'],
            MARK_BOUNCED:   ['RECEIVED', 'DEPOSITED'],
        };

        const allowed = VALID_TRANSITIONS[action];
        if (!allowed) {
            return res.status(400).json({ error: `Invalid transition action: ${action}` });
        }
        if (!allowed.includes(currentStatus)) {
            return res.status(409).json({
                error: `Action '${action}' is not permitted from current status '${currentStatus}'.`,
                code: "INVALID_STATE_TRANSITION"
            });
        }
        // ──────────────────────────────────────────────────────────────────────

        let newPaymentStatus = currentStatus;
        let newReceiptStatus = submission.receiptStatus;

        if (action === "VERIFY") {
            if (submission.paymentMethod === "CHEQUE" || submission.paymentMethod === "DEMAND_DRAFT") {
                newPaymentStatus = "RECEIVED";
                newReceiptStatus = "NOT_ELIGIBLE";
            } else {
                newPaymentStatus = "VERIFIED";
                newReceiptStatus = "PENDING";
            }
        } else if (action === "MARK_DEPOSITED") {
            if (submission.paymentMethod !== "CHEQUE" && submission.paymentMethod !== "DEMAND_DRAFT") {
                return res.status(400).json({ error: "MARK_DEPOSITED applies only to Cheque or Demand Draft instruments." });
            }
            newPaymentStatus = "DEPOSITED";
            newReceiptStatus = "NOT_ELIGIBLE";
        } else if (action === "MARK_CLEARED") {
            if (submission.paymentMethod !== "CHEQUE" && submission.paymentMethod !== "DEMAND_DRAFT") {
                return res.status(400).json({ error: "MARK_CLEARED applies only to Cheque or Demand Draft instruments." });
            }
            newPaymentStatus = "CLEARED";
            newReceiptStatus = "PENDING";
        } else if (action === "REJECT") {
            newPaymentStatus = "REJECTED";
            newReceiptStatus = "NOT_ELIGIBLE";
        } else if (action === "MARK_BOUNCED") {
            if (submission.paymentMethod !== "CHEQUE" && submission.paymentMethod !== "DEMAND_DRAFT") {
                return res.status(400).json({ error: "MARK_BOUNCED applies only to Cheque or Demand Draft instruments." });
            }
            newPaymentStatus = "BOUNCED";
            newReceiptStatus = "NOT_ELIGIBLE";
        }

        const updated = await prisma.offlinePaymentSubmission.update({
            where: { id },
            data: {
                paymentStatus: newPaymentStatus,
                receiptStatus: newReceiptStatus,
                verifiedAt: new Date(),
                verifiedBy: adminUserId,
                adminNotes: adminNotes || submission.adminNotes,
                rejectionReason: rejectionReason || submission.rejectionReason
            }
        });

        // Audit Trail — immutable record of every state transition
        await prisma.auditLog.create({
            data: {
                userId: adminUserId,
                action: `OFFLINE_PAYMENT_${action}`,
                details: `Submission ${id} transitioned from '${currentStatus}' → '${newPaymentStatus}'. Admin: ${adminUserId}. Notes: ${adminNotes || "N/A"}. Reason: ${rejectionReason || "N/A"}`
            }
        });

        // Sync linked DonationIntent with accurate intermediate states
        if (submission.donationIntentId) {
            const isSuccess = newPaymentStatus === "VERIFIED" || newPaymentStatus === "CLEARED";
            const isIntermediate = newPaymentStatus === "RECEIVED" || newPaymentStatus === "DEPOSITED";
            await prisma.donationIntent.update({
                where: { id: submission.donationIntentId },
                data: {
                    status: isSuccess ? "SUCCESS" : isIntermediate ? "SUBMITTED" : "FAILED"
                }
            });
        }

        // ── P0 FIX: Create DonationTransaction + DonationAllocation on terminal verified states ──────
        // VERIFIED = digital (BANK_TRANSFER / UPI) fully verified
        // CLEARED  = cheque / DD physically cleared by bank
        if (newPaymentStatus === "VERIFIED" || newPaymentStatus === "CLEARED") {
            try {
                const intent = submission.donationIntent;
                const donorRecord = intent?.email
                    ? await prisma.donor.findFirst({ where: { email: intent.email } })
                    : null;

                // 1️⃣ Create DonationTransaction (the ledger entry)
                let linkedTxId: string | null = null;

                // Check if a transaction already exists for this intent (idempotency)
                if (submission.donationIntentId) {
                    const existing = await prisma.donationTransaction.findFirst({
                        where: { donationIntentId: submission.donationIntentId }
                    });
                    if (existing) {
                        linkedTxId = existing.id;
                    }
                }

                if (!linkedTxId) {
                    const newTx = await prisma.donationTransaction.create({
                        data: {
                            donationIntentId: submission.donationIntentId || null,
                            donorId: donorRecord?.id || null,
                            amount: submission.amount,
                            currency: (intent as any)?.currency || 'INR',
                            status: 'CAPTURED',
                            paymentMethod: submission.paymentMethod as string,
                            capturedAt: new Date(),
                            settlementStatus: 'unreconciled',
                            metadata: {
                                source: 'OFFLINE_VERIFICATION',
                                submissionId: id,
                                verifiedBy: adminUserId,
                                action,
                                utrNumber: submission.utrNumber || null,
                                instrumentNumber: submission.instrumentNumber || null,
                                issuingBank: submission.issuingBank || null,
                            }
                        }
                    });
                    linkedTxId = newTx.id;

                    // 2️⃣ Create DonationAllocation (links to category / purpose)
                    if (intent?.purpose) {
                        // Find the matching category by name
                        const category = await prisma.donationCategory.findFirst({
                            where: { name: { equals: intent.purpose, mode: 'insensitive' } }
                        });
                        await prisma.donationAllocation.create({
                            data: {
                                donationTransactionId: linkedTxId,
                                categoryId: category?.id || null,
                                amount: submission.amount,
                            }
                        });
                    }

                    // Update intent status to SUCCESS
                    if (submission.donationIntentId) {
                        await prisma.donationIntent.update({
                            where: { id: submission.donationIntentId },
                            data: { status: 'SUCCESS' }
                        });
                    }
                }

                // 3️⃣ Create DonationReceipt (linked to the transaction)
                const receiptNumber = `REC-OFFLINE-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${id.slice(-6).toUpperCase()}`;
                const receiptUrl = `/api/donation/receipt/${receiptNumber}`;

                const existingReceipt = await prisma.donationReceipt.findFirst({
                    where: { donationTransactionId: linkedTxId }
                });

                if (!existingReceipt) {
                    await prisma.donationReceipt.upsert({
                        where: { receiptNumber },
                        update: {},
                        create: {
                            donationTransactionId: linkedTxId,
                            donorId: donorRecord?.id || null,
                            receiptNumber,
                            receiptUrl,
                            status: 'GENERATED'
                        }
                    });
                    await prisma.offlinePaymentSubmission.update({
                        where: { id },
                        data: { receiptStatus: 'ISSUED' }
                    });
                }

                // 4️⃣ Email: Verified → donor approval + receipt notification
                const donorEmail = intent?.email;
                if (donorEmail) {
                    try {
                        await EmailService.sendEmail(
                            donorEmail,
                            'offline_payment_verified',
                            {
                                subject: 'Your donation has been verified — KHCRF',
                                donorName: intent?.name || 'Donor',
                                amount: `₹${Number(submission.amount).toLocaleString('en-IN')}`,
                                paymentMethod: submission.paymentMethod as string,
                                receiptNumber,
                                receiptUrl: `${process.env.FRONTEND_URL || 'https://khcrf.org'}${receiptUrl}`,
                                purpose: intent?.purpose || 'General Support',
                            }
                        );
                    } catch (emailErr) {
                        console.error('[verifyOfflineSubmission] Verified email failed (non-fatal):', emailErr);
                    }
                }

            } catch (txErr) {
                // Non-fatal receipt/tx creation — log but don't block the status update response
                console.error('[verifyOfflineSubmission] Transaction/receipt generation failed (non-fatal):', txErr);
            }
        }

        // ── Email: REJECT → donor rejection notice ─────────────────────────
        if (action === "REJECT") {
            const donorEmail = submission.donationIntent?.email;
            if (donorEmail) {
                try {
                    await EmailService.sendEmail(
                        donorEmail,
                        'offline_payment_rejected',
                        {
                            subject: 'Update on your payment submission — KHCRF',
                            donorName: submission.donationIntent?.name || 'Donor',
                            amount: `₹${Number(submission.amount).toLocaleString('en-IN')}`,
                            paymentMethod: submission.paymentMethod as string,
                            rejectionReason: rejectionReason || 'Please contact us for more information.',
                            contactEmail: process.env.ADMIN_EMAIL || 'info@khcrf.org',
                        }
                    );
                } catch (emailErr) {
                    console.error('[verifyOfflineSubmission] Rejection email failed (non-fatal):', emailErr);
                }
            }
        }

        // ── Email: MARK_BOUNCED → donor bounce notice ──────────────────────
        if (action === "MARK_BOUNCED") {
            const donorEmail = submission.donationIntent?.email;
            if (donorEmail) {
                try {
                    await EmailService.sendEmail(
                        donorEmail,
                        'offline_payment_bounced',
                        {
                            subject: 'Important: Your cheque/DD could not be processed — KHCRF',
                            donorName: submission.donationIntent?.name || 'Donor',
                            amount: `₹${Number(submission.amount).toLocaleString('en-IN')}`,
                            instrumentNumber: submission.instrumentNumber || 'N/A',
                            issuingBank: submission.issuingBank || 'N/A',
                            bounceReason: rejectionReason || 'Please contact us for more information.',
                            contactEmail: process.env.ADMIN_EMAIL || 'info@khcrf.org',
                        }
                    );
                } catch (emailErr) {
                    console.error('[verifyOfflineSubmission] Bounce email failed (non-fatal):', emailErr);
                }
            }
        }

        res.json({
            success: true,
            message: `Offline payment submission ${action.toLowerCase()} applied successfully.`,
            previousStatus: currentStatus,
            newStatus: newPaymentStatus,
            submission: updated
        });
    } catch (error) {
        console.error("Verify Offline Submission Error:", error);
        res.status(500).json({ error: "Failed to process offline payment verification" });
    }
};
