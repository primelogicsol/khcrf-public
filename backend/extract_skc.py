import os
import glob
import re
import json

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts"

# Match const arrayName = [ { ... } ];
array_regex = re.compile(r'const\s+([a-zA-Z0-9_]+)\s*=\s*(\[.*?\]);', re.DOTALL)

all_data = {}

for filepath in glob.glob(base_dir + '/**/*.tsx', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    matches = array_regex.findall(content)
    if not matches:
        continue
    
    # skip complex files
    if 'AdvisorForm' in filepath:
        continue
        
    for var_name, array_content in matches:
        # Save the string representing the JS array
        all_data[var_name] = array_content

# We will write a TypeScript seeder file
seeder_content = """
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const skcData: Record<string, any[]> = {
"""

for var_name, array_content in all_data.items():
    # Attempt to just inject the JS array directly into the TS file
    # We must be careful because it might have JSX like `<Icon/>` inside it!
    # Let's check for JSX. If it has `<` we might have a problem.
    seeder_content += f"  {var_name}: {array_content},\n"

seeder_content += """
};

async function seed() {
  console.log("Seeding SKC Records...");
  for (const [kind, items] of Object.entries(skcData)) {
    for (const item of items) {
      // Remove React elements (like icons) if they exist
      const safeMetadata = { ...item };
      for (const key in safeMetadata) {
        if (typeof safeMetadata[key] === 'object' && safeMetadata[key]?.type) {
           delete safeMetadata[key]; // naive strip of jsx
        }
      }

      await prisma.canonicalEntity.create({
        data: {
          id: `SKC_${kind}_${Math.random().toString(36).substr(2, 9)}`,
          title: item.title || item.name || item.color || item.position || kind,
          entityType: 'SKC_RECORD',
          isDraft: false,
          summary: item.desc || item.description || '',
          metadata: {
            kind,
            ...safeMetadata
          }
        }
      });
    }
  }
  console.log("SKC Seeding complete.");
}

seed().catch(console.error).finally(() => prisma.$disconnect());
"""

with open('seed_skc_temp.ts', 'w', encoding='utf-8') as f:
    f.write(seeder_content)
print("Created seed_skc_temp.ts")
