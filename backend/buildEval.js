const fs = require('fs');

let head = fs.readFileSync('src/controllers/evaluationController.ts', 'utf8');

let phase2 = fs.readFileSync('restoreEval.ts', 'utf8');
let upload = fs.readFileSync('appendUpload.ts', 'utf8');

// The original HEAD starts with:
// import { Request, Response } from 'express';
// import { prisma } from '../config/db.js';
// import { EmailService } from '../services/emailService.js';
// import { EmailTemplates } from '../constants/emailTemplates.js';

let final = `import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { EmailService } from '../services/emailService.js';
import { EmailTemplates } from '../constants/emailTemplates.js';
import crypto from 'crypto';
import { validateFactors } from '../domain/performanceFactors.js';
import multer from 'multer';
import path from 'path';
import fs_native from 'fs';

` + phase2.replace(/import .*\n/g, '') + '\n' + upload.replace(/import .*\n/g, '').replace(/fs\./g, 'fs_native.') + '\n' + head.replace(/import .*\n/g, '');

fs.writeFileSync('src/controllers/evaluationController.ts', final, 'utf8');
