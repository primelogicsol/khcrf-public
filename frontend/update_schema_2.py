import os

filepath = '../backend/prisma/schema.prisma'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_fields = '''  organizationType         String?
  globalReachCategory      String?
  primaryCollaborationArea String?
  ecosystemRelationship    String?
  relationshipStatus       String?
  publicVisibility         String?
  countInGlobalReach       Boolean  @default(false)
  isTestRecord             Boolean  @default(false)
}'''

new_fields = '''  organizationType         String?
  globalReachCategory      String?
  primaryCollaborationArea String?
  ecosystemRelationship    String?
  relationshipClass        String?
  parentOrg                String?
  relationshipStatus       String?
  publicVisibility         String?
  countInGlobalReach       Boolean  @default(false)
  isTestRecord             Boolean  @default(false)
}'''

content = content.replace(old_fields, new_fields)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated schema.prisma with new fields")
