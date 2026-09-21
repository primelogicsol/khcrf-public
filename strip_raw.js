const fs = require('fs');
let c = fs.readFileSync('backend/prisma/schema.prisma', 'utf8');
c = c.replace(/, where: raw\([^)]*\)/g, '');
c = c.replace(/, where: raw\(.*?\)\)\)\)/g, '');
c = c.replace(/, where: raw\(.*?\)/g, '');
fs.writeFileSync('backend/prisma/schema.prisma', c);
