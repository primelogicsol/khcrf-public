import re

with open('backend/prisma/schema.prisma', 'r', encoding='utf-8') as f:
    content = f.read()

# Add reconciliation_status and documentation_level to MasterArtisan
master_artisan_repl = """
  khcrf_verified         Boolean   @default(false)
  evidence_grade         String?
  reconciliation_status  String?   @default("UNRESOLVED")
  documentation_level    String?
"""
content = re.sub(r'khcrf_verified\s+Boolean\s+@default\(false\)\n\s+evidence_grade\s+String\?', master_artisan_repl.strip(), content)

# Add reconciliation_reason to ArtisanAssertion
assertion_repl = """
  confidence   Float?
  match_method String?
  reconciliation_reason String?
"""
content = re.sub(r'confidence\s+Float\?\n\s+match_method\s+String\?', assertion_repl.strip(), content)

with open('backend/prisma/schema.prisma', 'w', encoding='utf-8') as f:
    f.write(content)

print("Schema updated")
