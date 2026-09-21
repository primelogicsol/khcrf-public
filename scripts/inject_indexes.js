const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'backend', 'prisma', 'schema.prisma');
let schemaContent = fs.readFileSync(schemaPath, 'utf8');

if (!schemaContent.includes('@@index([title])')) {
  // Find where CanonicalEntity model ends
  const target = `  archivedAt                DateTime?`;
  
  const replacement = `  archivedAt                DateTime?

  // Search Indexes
  @@index([title])
  @@index([slug])
  @@index([entityType])
  @@index([visibility])`;

  schemaContent = schemaContent.replace(target, replacement);

  fs.writeFileSync(schemaPath, schemaContent);
  console.log('Successfully injected CanonicalEntity indexes.');
} else {
  console.log('CanonicalEntity indexes already exist.');
}
