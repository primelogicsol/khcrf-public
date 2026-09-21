const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, '..', 'backend', 'src', 'services');

fs.readdirSync(basePath).forEach(file => {
  if (file.endsWith('.ts')) {
    const filePath = path.join(basePath, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Remove all occurrences of import { prisma } from '../config/db';
    content = content.replace(/import\s*\{\s*prisma\s*\}\s*from\s*['"]\.\.\/config\/db['"];?\n*/g, '');
    
    // 2. Remove all occurrences of const prisma = new PrismaClient(...);
    content = content.replace(/const\s+prisma\s*=\s*new\s+PrismaClient\([^)]*\);?\n*/g, '');

    // 3. Remove all imports of PrismaClient
    content = content.replace(/import\s*\{\s*PrismaClient\s*\}\s*from\s*['"]@prisma\/client['"];?\n*/g, '');
    content = content.replace(/import\s*\{\s*PrismaClient,\s*(.*?)\}\s*from\s*['"]@prisma\/client['"];?\n*/g, "import { $1 } from '@prisma/client';\n");
    content = content.replace(/,\s*PrismaClient/g, ''); // if PrismaClient is secondary in the import
    content = content.replace(/PrismaClient\s*,/g, ''); // if PrismaClient is primary in the import

    // 4. Ensure we didn't remove Prisma namespace if it's used
    if (content.includes('Prisma.') && !content.includes("import { Prisma }")) {
       content = "import { Prisma } from '@prisma/client';\n" + content;
    }

    // 5. Inject EXACTLY ONE import { prisma } at the top
    content = `import { prisma } from '../config/db';\n` + content;

    fs.writeFileSync(filePath, content);
  }
});

console.log('Successfully cleaned up prisma imports in all services.');
