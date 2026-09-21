const fs = require('fs');
let c1 = fs.readFileSync('src/controllers/verificationController.ts', 'utf8');
let c2 = fs.readFileSync('appendController.ts', 'utf8');
let final = c1 + '\n' + c2;
final = final.replace("import { prisma } from '../config/db.js';", "import { prisma } from '../config/db.js';\nimport fs from 'fs';\nimport path from 'path';");
fs.writeFileSync('src/controllers/verificationController.ts', final, 'utf8');
