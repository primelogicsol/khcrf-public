const fs = require('fs');
let c = fs.readFileSync('backend/prisma/schema.prisma', 'utf8');

c = c.replace(/, "partialIndexes"/g, '');
c = c.replace(/datasource db\s*\{\s*provider\s*=\s*"postgresql"\s*\}/g, 'datasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}');

fs.writeFileSync('backend/prisma/schema.prisma', c);
