import re

with open('backend/prisma/schema.prisma', 'r', encoding='utf-8') as f:
    content = f.read()

assertion_model = """
model ArtisanAssertion {
  id                      String   @id @default(cuid())
  artisan_id              String
  field_name              String
  raw_value               String?
  normalized_value        String?
  
  source_id               String
  source_page             String?
  source_row              String?
  source_record_reference String?
  
  confidence              Float?
  match_method            String?
  
  is_canonical            Boolean  @default(false)
  valid_from              DateTime?
  valid_to                DateTime?
  
  created_at              DateTime @default(now())

  artisan                 MasterArtisan @relation(fields: [artisan_id], references: [id], onDelete: Cascade)
  source                  Source        @relation(fields: [source_id], references: [id], onDelete: Cascade)
}
"""

if "model ArtisanAssertion" not in content:
    content = content.replace("model ArtisanIdentifier {", assertion_model + "\nmodel ArtisanIdentifier {")

    # Add back-relations to MasterArtisan
    if "assertions              ArtisanAssertion[]" not in content:
        content = content.replace('identifiers             ArtisanIdentifier[]', 'assertions              ArtisanAssertion[]\n  identifiers             ArtisanIdentifier[]')
    
    # Add back-relations to Source
    if "assertions        ArtisanAssertion[]" not in content:
        content = content.replace('identifiers       ArtisanIdentifier[]', 'assertions        ArtisanAssertion[]\n  identifiers       ArtisanIdentifier[]')
        
    # Add source_page, source_row, source_record_reference to the other tables
    for model in ["ArtisanIdentifier", "ArtisanGiAuthorization", "ArtisanAward", "ArtisanLineageMember"]:
        pattern = r"(model " + model + r" \{.*?source_id\s+String\?)"
        replacement = r"\1\n  source_page            String?\n  source_row             String?\n  source_record_reference String?"
        content = re.sub(pattern, replacement, content, flags=re.DOTALL)
        
    # Add document_hash to Source
    if "document_hash" not in content:
        content = content.replace('source_type   String?', 'source_type   String?\n  document_hash String?')

with open('backend/prisma/schema.prisma', 'w', encoding='utf-8') as f:
    f.write(content)

print("Schema updated with ArtisanAssertion")
