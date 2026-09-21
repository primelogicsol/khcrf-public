const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, '..', 'backend', 'src', 'services');

fs.readdirSync(basePath).forEach(file => {
  if (file.endsWith('.ts')) {
    const filePath = path.join(basePath, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace the import and instantiation
    content = content.replace(/import \{ PrismaClient \} from '@prisma\/client';\n+/g, '');
    content = content.replace(/const prisma = new PrismaClient\(\);\n+/g, "import { prisma } from '../config/db';\n\n");
    content = content.replace(/import \{ PrismaClient, [^}]+\} from '@prisma\/client';/g, "import { prisma } from '../config/db';");

    fs.writeFileSync(filePath, content);
  }
});

console.log('Successfully patched all services to use centralized Prisma client.');
