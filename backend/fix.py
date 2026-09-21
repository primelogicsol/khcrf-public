content = open('update_magazine_issues.ts').read()
content = content.replace('import { PrismaClient } from ''@prisma/client'';\n\nconst prisma = new PrismaClient();', 'import { prisma } from ''./src/config/db.js'';')
open('update_magazine_issues.ts', 'w').write(content)
