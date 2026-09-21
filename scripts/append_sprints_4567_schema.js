const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'backend', 'prisma', 'schema.prisma');
let schemaContent = fs.readFileSync(schemaPath, 'utf8');

const newSchema = `
// --- SPRINTS 4, 5, 6, 7: HUMANS, PLACES, COLLECTIONS, RESEARCH ---

model Artisan {
  id                String          @id @default(uuid())
  canonicalEntityId String          @unique
  birthYear         Int?
  deathYear         Int?
  activeRegion      String?
  biography         String?         @db.Text
  
  canonicalEntity   CanonicalEntity @relation(fields: [canonicalEntityId], references: [id])
}

model Studio {
  id                String          @id @default(uuid())
  canonicalEntityId String          @unique
  address           String?
  foundingYear      Int?
  
  canonicalEntity   CanonicalEntity @relation(fields: [canonicalEntityId], references: [id])
}

model Collection {
  id                String          @id @default(uuid())
  canonicalEntityId String          @unique
  institutionName   String?
  curationFocus     String?         @db.Text
  
  canonicalEntity   CanonicalEntity @relation(fields: [canonicalEntityId], references: [id])
}

model ResearchPublication {
  id                String          @id @default(uuid())
  canonicalEntityId String          @unique
  doi               String?
  journalName       String?
  publicationYear   Int?
  
  canonicalEntity   CanonicalEntity @relation(fields: [canonicalEntityId], references: [id])
}
`;

if (!schemaContent.includes('model Artisan {')) {
  // Inject back relations into CanonicalEntity
  const backRelations = `
  // Sprints 4-7 Extensions
  artisan              Artisan?
  studio               Studio?
  collection           Collection?
  researchPublication  ResearchPublication?
`;
  
  // Find where CanonicalEntity model ends
  const modelStart = schemaContent.indexOf('model CanonicalEntity {');
  if (modelStart !== -1) {
    const modelEnd = schemaContent.indexOf('}', modelStart);
    schemaContent = schemaContent.substring(0, modelEnd) + backRelations + schemaContent.substring(modelEnd);
  }

  fs.writeFileSync(schemaPath, schemaContent + '\n' + newSchema);
  console.log('Successfully appended Sprints 4-7 schema.');
} else {
  console.log('Sprints 4-7 schema already exists.');
}
