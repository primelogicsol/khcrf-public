const fs = require('fs');
let c = fs.readFileSync('backend/prisma/schema.prisma', 'utf8');

c = c.replace(/model FellowshipApplication \{([\s\S]*?)updatedAt\s+DateTime\s+@updatedAt\r?\n\}/, 
`model FellowshipApplication {$1updatedAt       DateTime @updatedAt
  cohortId        String   @default("2026")
  normalizedEmail String?

  @@unique([cohortId, normalizedEmail, position])
}`);

fs.writeFileSync('backend/prisma/schema.prisma', c);
