import express from 'express';
import {
    createDonationIntent,
    cancelDonationIntent,
    verifyPaymentSignature,
    handleRazorpayWebhook,
    getAdminStats,
    getAdminTransactions,
    getAdminTransactionById,
    manualRefreshPayment,
    exportTransactionsCsv,
    getWebhookLog,
    getMyDonations,
    getAuditLogs,
    getReceiptByNumber,
    submitOfflinePayment,
    getAdminOfflineSubmissions,
    verifyOfflineSubmission,
    getDonationCategories
} from '../controllers/donationController.js';
import { authenticateToken, authorizeAdmin, authorizeRole } from '../middleware/authMiddleware.js';
import { optionalAuthenticateToken } from '../middleware/optionalAuthMiddleware.js';

const router = express.Router();

// --- PUBLIC / OPTIONAL AUTHENTICATED ENDPOINTS ---
// Get all donation categories (for purpose filter dropdown on public form and admin dashboard)
router.get('/categories', getDonationCategories);

// Create donation intent & Razorpay order
router.post('/intent', optionalAuthenticateToken, createDonationIntent);
// Cancel a PENDING intent (called by frontend on offline submit failure e.g. 409 duplicate UTR)
router.delete('/intent/:id', optionalAuthenticateToken, cancelDonationIntent);
router.get('/intent', (req, res) => {
    res.status(405).json({ error: "Method Not Allowed: Intent endpoint requires POST" });
});

// Verify Razorpay payment signature
router.post('/verify', verifyPaymentSignature);

// Razorpay webhook receiver (rawBody signature verified internally)
router.post('/webhook', handleRazorpayWebhook);
router.get('/webhook', (req, res) => {
    res.status(405).json({ error: "Method Not Allowed: Webhook endpoint requires POST" });
});

// Get printable HTML receipt (secured via optional authentication & email verification token)
router.get('/receipt/:receiptNumber', optionalAuthenticateToken, getReceiptByNumber);


// --- USER PROTECTED ENDPOINTS ---
// Get current user's personal donation history
router.get('/my-donations', authenticateToken, getMyDonations);


// Create offline payment submission (Bank Transfer, UPI QR, Cheque/DD)
router.post('/offline-submit', optionalAuthenticateToken, submitOfflinePayment);

// --- ADMIN MANAGEMENT ENDPOINTS ---
const authorizeDonationManager = authorizeRole(['ADMIN', 'MODERATOR_DONATION']);

// Get offline payment submission queue
router.get('/management/offline-queue', authenticateToken, authorizeDonationManager, getAdminOfflineSubmissions);

// Process admin verification/rejection of offline submission
router.post('/management/verify-offline-submission/:id', authenticateToken, authorizeDonationManager, verifyOfflineSubmission);

// Get donation overview metrics & KPIs
router.get('/management/metrics', authenticateToken, authorizeDonationManager, getAdminStats);

// Get filtered list of donation transactions
router.get('/management/records', authenticateToken, authorizeDonationManager, getAdminTransactions);

// Get a single donation transaction by ID
router.get('/management/record/:id', authenticateToken, authorizeDonationManager, getAdminTransactionById);

// Manually fetch and reconcile payment state from Razorpay
router.post('/management/refresh-payment/:paymentId', authenticateToken, authorizeDonationManager, manualRefreshPayment);

// Export all donation records to CSV
router.get('/management/export-csv', authenticateToken, authorizeDonationManager, exportTransactionsCsv);

// Get audit log history of donation adjustments
router.get('/management/history', authenticateToken, authorizeDonationManager, getAuditLogs);

// Get webhook events log
router.get('/management/system-events', authenticateToken, authorizeDonationManager, getWebhookLog);

export default router;
