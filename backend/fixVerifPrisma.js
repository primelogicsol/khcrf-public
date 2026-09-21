const fs = require('fs');
let c = fs.readFileSync('src/controllers/verificationController.ts', 'utf8');
if (!c.includes('import { prisma }')) {
    fs.writeFileSync('src/controllers/verificationController.ts', "import { prisma } from '../config/db.js';\n" + c, 'utf8');
}
