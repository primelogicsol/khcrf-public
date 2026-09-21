const fs = require('fs');
let c = fs.readFileSync('backend/prisma/schema.prisma', 'utf8');

// 1. Remove partialIndexes
c = c.replace(/, "partialIndexes"/g, '');

// 2. Add url to datasource db
c = c.replace(/datasource db\s*\{\s*provider\s*=\s*"postgresql"\s*\}/g, 'datasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}');

// 3. Update FellowshipApplication model
const origModel = `  updatedAt       DateTime @updatedAt
}`;
const newModel = `  updatedAt       DateTime @updatedAt
  cohortId        String   @default("2026")
  normalizedEmail String?

  @@unique([cohortId, normalizedEmail, position])
}`;
c = c.replace(origModel, newModel);

fs.writeFileSync('backend/prisma/schema.prisma', c);
