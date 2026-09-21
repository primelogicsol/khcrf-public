const fs = require('fs');
let c = fs.readFileSync('backend/prisma/schema.prisma', 'utf8');
c = c.replace(/, "partialIndexes"/, '');
fs.writeFileSync('backend/prisma/schema.prisma', c);
