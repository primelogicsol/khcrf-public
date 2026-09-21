import express, { Request } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { submitConsultation, getConsultations, getConsultationById, updateConsultationStatus, deleteConsultation, getConsultationAuditLog } from '../controllers/consultationController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';

const useS3 = process.env.S3_BUCKET && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;

let storage;
if (useS3) {
    const s3 = new S3Client({
        region: process.env.AWS_REGION || 'us-east-1',
        endpoint: process.env.S3_ENDPOINT || undefined, // e.g. https://s3-eu-central-1.ionoscloud.com for IONOS
        forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true' || false,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
        }
    });

    storage = multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET!,
        acl: 'private',
        metadata: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, metadata: Record<string, string>) => void) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, key: string) => void) {
            const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
            cb(null, `consultations/${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeName}`);
        }
    });
} else {
    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            // Prevent path traversal by using path.resolve and ensuring it stays in intended dir
            const dir = path.resolve(process.cwd(), 'uploads', 'consultations');
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            // Sanitize filename
            const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
            cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeName}`);
        }
    });
}

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Allowed file types: Images, PDFs, Word, Excel, CSV
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images, PDFs, Word, and Excel documents are allowed.'));
    }
};

const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    fileFilter
});

router.get('/health', (req, res) => {
    res.json({ success: true, service: 'consultation', status: 'running' });
});

router.post('/submit', upload.array('evidenceFiles', 10), submitConsultation);
router.get('/', authenticateToken, authorizeAdmin, getConsultations);
router.get('/:id', authenticateToken, authorizeAdmin, getConsultationById);
router.patch('/:id/status', authenticateToken, authorizeAdmin, updateConsultationStatus);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteConsultation);
router.get('/:id/audit-log', authenticateToken, authorizeAdmin, getConsultationAuditLog);

export default router;
