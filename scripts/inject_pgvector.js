const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'backend', 'prisma', 'schema.prisma');
let schemaContent = fs.readFileSync(schemaPath, 'utf8');

if (!schemaContent.includes('postgresqlExtensions')) {
  // Inject into generator
  schemaContent = schemaContent.replace(
    'generator client {\n  provider = "prisma-client-js"\n}',
    'generator client {\n  provider = "prisma-client-js"\n  previewFeatures = ["postgresqlExtensions"]\n}'
  );
  
  // Inject into datasource
  schemaContent = schemaContent.replace(
    'datasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}',
    'datasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n  extensions = [vector]\n}'
  );
  
  // Inject field into CanonicalEntity
  const target = '  cidocClass                String?     // e.g. E39_Actor, E22_Human_Made_Object';
  const replacement = target + '\n  embedding                 Unsupported("vector(1536)")?';
  
  schemaContent = schemaContent.replace(target, replacement);

  fs.writeFileSync(schemaPath, schemaContent);
  console.log('Successfully injected pgvector capabilities into schema.');
} else {
  console.log('pgvector capabilities already exist.');
}
