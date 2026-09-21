const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'backend', 'prisma', 'schema.prisma');
let schemaContent = fs.readFileSync(schemaPath, 'utf8');

if (!schemaContent.includes('cidocClass')) {
  // Find where CanonicalEntity model ends
  const target = `  entityType                CanonicalEntityType`;
  
  const replacement = `  entityType                CanonicalEntityType
  cidocClass                String?     // e.g. E39_Actor, E22_Human_Made_Object`;

  schemaContent = schemaContent.replace(target, replacement);

  fs.writeFileSync(schemaPath, schemaContent);
  console.log('Successfully injected CanonicalEntity cidocClass.');
} else {
  console.log('CanonicalEntity cidocClass already exists.');
}
