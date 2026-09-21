import re

with open('backend/prisma/schema.prisma', 'r', encoding='utf-8') as f:
    content = f.read()

# Add document_hash_algorithm to Source
if "document_hash_algorithm" not in content:
    content = content.replace('document_hash String?', 'document_hash String?\n  document_hash_algorithm String?')

# Add reconciliation_reason to ArtisanAssertion
if "reconciliation_reason" not in content:
    content = content.replace('match_method            String?', 'match_method            String?\n  reconciliation_reason   String?')

# Add conflict_status to MasterArtisan
if "reconciliation_status" not in content:
    content = content.replace('evidence_grade          String?', 'evidence_grade          String?\n  reconciliation_status   String? @default("UNRESOLVED")')

# Add indexes to MasterArtisan
indexes_ma = """
  @@index([primary_craft_id])
  @@index([district])
"""
if "@@index([primary_craft_id])" not in content:
    content = content.replace('sources                 Source[] @relation("MasterArtisanSources")', 'sources                 Source[] @relation("MasterArtisanSources")\n' + indexes_ma)

# Add indexes to ArtisanIdentifier
indexes_ai = """
  @@index([artisan_id])
  @@index([identifier_type, identifier_value])
"""
if "@@index([artisan_id])" not in content:
    content = content.replace('source           Source?       @relation(fields: [source_id], references: [id])', 'source           Source?       @relation(fields: [source_id], references: [id])\n' + indexes_ai)

# Add indexes to ArtisanGiAuthorization
indexes_gi = """
  @@index([artisan_id])
  @@index([craft_id])
  @@index([gi_authorized_user_id])
"""
if "@@index([gi_authorized_user_id])" not in content:
    content = content.replace('source                 Source?       @relation(fields: [source_id], references: [id])', 'source                 Source?       @relation(fields: [source_id], references: [id])\n' + indexes_gi)

# Add indexes to ArtisanAward
indexes_aa = """
  @@index([artisan_id])
  @@index([award_year])
  @@index([normalized_craft_id])
"""
if "@@index([award_year])" not in content:
    content = content.replace('source               Source?       @relation(fields: [source_id], references: [id])', 'source               Source?       @relation(fields: [source_id], references: [id])\n' + indexes_aa)

# Add indexes to ArtisanAssertion
indexes_as = """
  @@index([artisan_id, field_name])
  @@index([is_canonical])
  @@index([source_id])
"""
if "@@index([artisan_id, field_name])" not in content:
    content = content.replace('source                  Source        @relation(fields: [source_id], references: [id], onDelete: Cascade)', 'source                  Source        @relation(fields: [source_id], references: [id], onDelete: Cascade)\n' + indexes_as)

with open('backend/prisma/schema.prisma', 'w', encoding='utf-8') as f:
    f.write(content)

print("Final schema tweaks applied")
