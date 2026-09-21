import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { prisma } from '../config/db.js';
import { EmailService } from '../services/emailService.js';
import { EmailTemplates } from '../constants/emailTemplates.js';
import { requireString } from "../utils/routeHelpers";

// Razorpay client — lazily initialized on first real payment request.
// PAYMENT_PROVIDER=disabled suppresses construction so the server can
// boot in Stage 4A / CI environments that carry no payment credentials.
let _razorpay: Razorpay | null = null;

function getRazorpay(): Razorpay {
    if (process.env.PAYMENT_PROVIDER === 'disabled') {
        throw new Error('[PaymentProvider] PAYMENT_PROVIDER=disabled — Razorpay is not available in this environment.');
    }
    if (!_razorpay) {
        const key_id = process.env.RAZORPAY_KEY_ID;
        const key_secret = process.env.RAZORPAY_KEY_SECRET;
        if (!key_id || !key_secret) {
            throw new Error('[PaymentProvider] RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set when PAYMENT_PROVIDER is not "disabled".');
        }
        _razorpay = new Razorpay({ key_id, key_secret });
    }
    return _razorpay;
}

export const createOrder = async (req: Request, res: Response) => {
    // Disabled-provider fast-exit — avoids confusing 500 in CI environments
    if (process.env.PAYMENT_PROVIDER === 'disabled') {
        return res.status(503).json({ error: 'Payment processing is disabled in this environment.' });
    }
    try {
        const { amount, currency = "INR", receipt, notes } = req.body;

        if (!amount) {
            return res.status(400).json({ error: "Amount is required" });
        }

        // H2 FIX: Server-side amount validation
        const numericAmount = typeof amount === 'string' ? parseInt(amount, 10) : amount;
        if (!Number.isFinite(numericAmount) || numericAmount < 100) {
            // Minimum ₹1 (100 paise)
            return res.status(400).json({ error: "Amount must be at least 100 paise (₹1)" });
        }
        if (numericAmount > 50000000) {
            // Maximum ₹5,00,000 (50000000 paise)
            return res.status(400).json({ error: "Amount exceeds maximum allowed" });
        }
        const allowedCurrencies = ['INR'];
        if (!allowedCurrencies.includes(currency)) {
            return res.status(400).json({ error: `Unsupported currency: ${currency}` });
        }

        const options = {
            amount: numericAmount,
            currency,
            receipt,
            notes,
        };

        const order = await getRazorpay().orders.create(options);

        // Create initial transaction record
        await prisma.transaction.create({
            data: {
                orderId: order.id,
                amount: typeof amount === 'string' ? parseFloat(amount) / 100 : amount / 100, // Store as main unit (INR)
                currency: currency,
                status: "CREATED",
                metadata: notes,
                // userId can be extracted from auth middleware if available, 
                // but for now we might keep it optional or pass in body
                userId: (req as any).user?.userId || null,
            }
        });

        res.json({
            order,
            keyId: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ error: "Failed to create order" });
    }
};

export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        console.log("Verifying Payment for order:", razorpay_order_id);

        if (!process.env.RAZORPAY_KEY_SECRET) {
            console.error("RAZORPAY_KEY_SECRET is missing");
            return res.status(500).json({ error: "Server configuration error" });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
            .update(body.toString())
            .digest("hex");

        // H1 FIX: Use timing-safe comparison to prevent timing attacks
        const expectedBuf = Buffer.from(expectedSignature, 'hex');
        const receivedBuf = Buffer.from(razorpay_signature || '', 'hex');
        const isAuthentic = expectedBuf.length === receivedBuf.length && crypto.timingSafeEqual(expectedBuf, receivedBuf);

        if (isAuthentic) {
            // 1. First look up general transaction (memberships, certifications, etc.)
            const existingTx = await prisma.transaction.findUnique({
                where: { orderId: razorpay_order_id }
            });

            if (existingTx) {
                const updatedTransaction = await prisma.transaction.update({
                    where: { orderId: razorpay_order_id },
                    data: {
                        status: "SUCCESS",
                        paymentId: razorpay_payment_id,
                        signature: razorpay_signature,
                    },
                });

                // Handle Post-Payment Logic based on Metadata
                const notes = updatedTransaction.metadata as any;

                console.log("Transaction/Notes:", { transactionId: updatedTransaction.id, notes });

                if (notes) {
                    // Certification Purchase
                    if (notes.certType) {
                        await prisma.certification.create({
                            data: {
                                userId: updatedTransaction.userId || null,
                                type: notes.certType,
                                name: notes.certName || "Certification",
                                amount: updatedTransaction.amount,
                                firstName: notes.firstName || "Unknown",
                                lastName: notes.lastName || "Unknown",
                                email: notes.email || "unknown@example.com",
                                phone: notes.phone || "",
                                razorpayOrderId: razorpay_order_id,
                                razorpayPaymentId: razorpay_payment_id,
                                paymentMethod: "RAZORPAY",
                                status: "SUCCESS",
                            }
                        });

                        // Send Certification Email
                        EmailService.sendEmail(notes.email || "unknown@example.com", EmailTemplates.CERTIFICATION_ISSUED, {
                            name: notes.firstName || "User",
                            certName: notes.certName || "Certification",
                            link: "https://hcrf.gov.in/dashboard/certificates" // Placeholder
                        }).catch(err => console.error("Failed to send certification email:", err));
                    }

                    // Publication Purchase (DEPRECATED - membership model active)
                    if (notes.purchaseType === 'PUBLICATION') {
                        console.warn("Publication purchase is deprecated. Access is managed via membership.");
                    }
                }

                return res.json({
                    success: true,
                    message: "Payment verified successfully",
                    orderId: razorpay_order_id,
                    paymentId: razorpay_payment_id
                });
            }

            // 2. Fallback: If not in Transaction, check if it's a DonationIntent
            const intent = await prisma.donationIntent.findUnique({
                where: { razorpayOrderId: razorpay_order_id }
            });

            if (intent) {
                // Update donation intent status to SUCCESS
                await prisma.donationIntent.update({
                    where: { id: intent.id },
                    data: { status: 'SUCCESS' }
                });

                // Upsert donor profile
                let donor = null;
                if (intent.email) {
                    let userId = null;
                    const user = await prisma.user.findUnique({ where: { email: intent.email } });
                    if (user) userId = user.id;

                    donor = await prisma.donor.upsert({
                        where: { email: intent.email },
                        update: {
                            name: intent.name,
                            phone: intent.phone || undefined,
                            type: intent.donorType,
                            recognitionConsent: intent.recognitionConsent,
                            isAnonymous: intent.isAnonymous,
                            userId: userId || undefined
                        },
                        create: {
                            name: intent.name,
                            email: intent.email,
                            phone: intent.phone,
                            type: intent.donorType,
                            recognitionConsent: intent.recognitionConsent,
                            isAnonymous: intent.isAnonymous,
                            userId
                        }
                    });
                }

                // Update intent with donorId
                if (donor) {
                    await prisma.donationIntent.update({
                        where: { id: intent.id },
                        data: { donorId: donor.id }
                    });
                }

                // Create DonationTransaction
                const donationTx = await prisma.donationTransaction.upsert({
                    where: { razorpayPaymentId: razorpay_payment_id },
                    update: {
                        status: 'CAPTURED',
                        capturedAt: new Date()
                    },
                    create: {
                        donationIntentId: intent.id,
                        donorId: donor?.id || null,
                        amount: intent.amount,
                        currency: intent.currency || 'INR',
                        status: 'CAPTURED',
                        razorpayOrderId: razorpay_order_id,
                        razorpayPaymentId: razorpay_payment_id,
                        paymentMethod: 'RAZORPAY',
                        capturedAt: new Date(),
                        settlementStatus: 'unreconciled',
                        metadata: {
                            payment_id: razorpay_payment_id,
                            order_id: razorpay_order_id,
                            signature: razorpay_signature,
                            email: intent.email,
                            contact: intent.phone
                        }
                    }
                });

                // Find or create Category Allocation
                let category = null;
                if (intent.purposeId) {
                    category = await prisma.donationCategory.findUnique({ where: { id: intent.purposeId } });
                }
                if (!category && intent.purpose) {
                    category = await prisma.donationCategory.findFirst({
                        where: { name: { equals: intent.purpose, mode: 'insensitive' } }
                    });
                }
                if (category) {
                    const existingAlloc = await prisma.donationAllocation.findFirst({
                        where: { donationTransactionId: donationTx.id }
                    });
                    if (!existingAlloc) {
                        await prisma.donationAllocation.create({
                            data: {
                                donationTransactionId: donationTx.id,
                                categoryId: category.id,
                                amount: intent.amount
                            }
                        });
                    }
                }

                // Generate Receipt
                if (intent.wantsReceipt && donor) {
                    const receiptNumber = `REC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${donationTx.id.slice(-4).toUpperCase()}`;
                    const receiptUrl = `/api/donation/receipt/${receiptNumber}`;
                    await prisma.donationReceipt.upsert({
                        where: { receiptNumber },
                        update: {},
                        create: {
                            donationTransactionId: donationTx.id,
                            donorId: donor.id,
                            receiptNumber,
                            receiptUrl,
                            status: 'GENERATED'
                        }
                    });
                }

                // Log audit
                await prisma.auditLog.create({
                    data: {
                        action: 'DONATION_VERIFIED',
                        details: `Verified donation of ${intent.amount} via checkout callback for Payment ID: ${razorpay_payment_id}`
                    }
                });

                return res.json({
                    success: true,
                    message: "Donation payment verified successfully",
                    orderId: razorpay_order_id,
                    paymentId: razorpay_payment_id
                });
            }

            console.error("Order ID not found in Transaction or DonationIntent:", razorpay_order_id);
            return res.status(404).json({ error: "Order ID not found in system" });

        } else {
            // Update transaction to FAILED if it exists in Transaction table
            const existingTx = await prisma.transaction.findUnique({
                where: { orderId: razorpay_order_id }
            });

            if (existingTx) {
                await prisma.transaction.update({
                    where: { orderId: razorpay_order_id },
                    data: {
                        status: "FAILED",
                        paymentId: razorpay_payment_id,
                        signature: razorpay_signature,
                    },
                });
            }

            console.error("Signature Mismatch");

            return res.status(400).json({
                success: false,
                message: "Invalid signature"
            });
        }
    } catch (error) {
        console.error("Verify Payment Error:", error);
        return res.status(500).json({ error: "Payment verification failed" });
    }
};
// Get all certifications (Admin)
export const getAllCertifications = async (req: Request, res: Response) => {
    try {
        const certifications = await prisma.certification.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(certifications);
    } catch (error) {
        console.error("Get All Certifications Error:", error);
        res.status(500).json({ error: "Failed to fetch certifications" });
    }
};

// Update certification status (Admin)
export const updateCertificationStatus = async (req: Request, res: Response) => {
    try {
        const id = requireString(req.params.id);
        const { status, adminCertificateUrl } = req.body;

        if (!status) {
            return res.status(400).json({ error: "Status is required" });
        }

        const updatedCert = await prisma.certification.update({
            where: { id },
            data: { 
                status,
                adminCertificateUrl
            },
        });

        // Send Status Update Email
        if (updatedCert.email) {
            EmailService.sendEmail(updatedCert.email, EmailTemplates.STATUS_UPDATE, {
                name: updatedCert.firstName,
                type: 'Certification Request',
                status: status
            }).catch(err => console.error("Failed to send cert status update email:", err));
        }

        res.json(updatedCert);
    } catch (error) {
        console.error("Update Certification Status Error:", error);
        res.status(500).json({ error: "Failed to update status" });
    }
};

// Get my certifications (User)
export const getMyCertifications = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const certifications = await prisma.certification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(certifications);
    } catch (error) {
        console.error("Get My Certifications Error:", error);
        res.status(500).json({ error: "Failed to fetch certifications" });
    }
};
