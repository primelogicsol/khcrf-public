const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'backend', 'prisma', 'schema.prisma');
let schemaContent = fs.readFileSync(schemaPath, 'utf8');

const sprint1BSchema = `
// --- SPRINT 1B: KNOWLEDGE DOMAIN ENTITIES ---

enum EndangermentStatus {
  THRIVING
  STABLE
  VULNERABLE
  ENDANGERED
  EXTINCT
}

enum SustainabilityStatus {
  SUSTAINABLE
  CONCERN
  DEPLETED
}

enum ComplexityLevel {
  BASIC
  INTERMEDIATE
  MASTER
}

enum TermContext {
  WORKSHOP
  TRADE
  GENERAL
}

model Craft {
  id                   String             @id @default(uuid())
  canonicalEntityId    String             @unique
  historicalOrigin     String?            @db.Text
  culturalSignificance String?            @db.Text
  endangermentStatus   EndangermentStatus @default(STABLE)
  
  canonicalEntity      CanonicalEntity    @relation(fields: [canonicalEntityId], references: [id])
}

model Material {
  id                   String               @id @default(uuid())
  canonicalEntityId    String               @unique
  sourcingRegion       String
  sustainabilityStatus SustainabilityStatus @default(SUSTAINABLE)
  processingMethod     String?              @db.Text
  
  canonicalEntity      CanonicalEntity      @relation(fields: [canonicalEntityId], references: [id])
}

model Tool {
  id                      String          @id @default(uuid())
  canonicalEntityId       String          @unique
  primaryMaterial         String
  maintenanceRequirements String?         @db.Text
  
  canonicalEntity         CanonicalEntity @relation(fields: [canonicalEntityId], references: [id])
}

model Technique {
  id                     String          @id @default(uuid())
  canonicalEntityId      String          @unique
  complexityLevel        ComplexityLevel @default(INTERMEDIATE)
  learningDurationMonths Int?
  
  canonicalEntity        CanonicalEntity @relation(fields: [canonicalEntityId], references: [id])
}

model Motif {
  id                  String          @id @default(uuid())
  canonicalEntityId   String          @unique
  symbolicMeaning     String?         @db.Text
  geometricProperties Json?
  
  canonicalEntity     CanonicalEntity @relation(fields: [canonicalEntityId], references: [id])
}

model Product {
  id                      String          @id @default(uuid())
  canonicalEntityId       String          @unique
  typicalUse              String?         @db.Text
  averageCreationTimeDays Int?
  
  canonicalEntity         CanonicalEntity @relation(fields: [canonicalEntityId], references: [id])
}

model GlossaryTerm {
  id                String          @id @default(uuid())
  canonicalEntityId String          @unique
  termContext       TermContext     @default(GENERAL)
  regionalDialect   String?
  
  canonicalEntity   CanonicalEntity @relation(fields: [canonicalEntityId], references: [id])
}
`;

if (!schemaContent.includes('model Craft {')) {
  // Inject back relations into CanonicalEntity
  const backRelations = `
  // Sprint 1B Extensions
  craft             Craft?
  material          Material?
  tool              Tool?
  technique         Technique?
  motif             Motif?
  product           Product?
  glossaryTerm      GlossaryTerm?
`;
  
  // Find where CanonicalEntity model ends
  const modelStart = schemaContent.indexOf('model CanonicalEntity {');
  if (modelStart !== -1) {
    const modelEnd = schemaContent.indexOf('}', modelStart);
    schemaContent = schemaContent.substring(0, modelEnd) + backRelations + schemaContent.substring(modelEnd);
  }

  fs.writeFileSync(schemaPath, schemaContent + '\n' + sprint1BSchema);
  console.log('Successfully appended Sprint 1B schema.');
} else {
  console.log('Sprint 1B schema already exists.');
}
