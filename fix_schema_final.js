const fs = require('fs');
let c = fs.readFileSync('backend/prisma/schema.prisma', 'utf8');

c = c.replace('  updatedAt       DateTime @updatedAt\n}', '  updatedAt       DateTime @updatedAt\n  cohortId        String   @default("2026")\n  normalizedEmail String?\n\n  @@unique([cohortId, normalizedEmail, position])\n}');

fs.writeFileSync('backend/prisma/schema.prisma', c);
