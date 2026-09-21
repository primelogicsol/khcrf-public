import re

path = 'backend/prisma/schema.prisma'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Update SkcStakeholderRegistration
search = """  model SkcStakeholderRegistration {
    id              String  @id @default(cuid())
    userId          String? @unique
    referenceNumber String  @unique

    user               User?     @relation(fields: [userId], references: [id])
    fullName           String
    organization       String?
    category           String
    designation        String?
    district           String
    craftSector        String?
    email              String
    phone              String?
    website            String?
    participationModes String[]
    consent            Boolean   @default(false)
    consentAt          DateTime?
    participationScope String    @default("BOTH")
    status             String    @default("SUBMITTED") // SUBMITTED | UNDER_REVIEW | APPROVED | REJECTED
    submittedAt        DateTime  @default(now())
  }"""

replace = """  model SkcStakeholderRegistration {
    id              String  @id @default(cuid())
    userId          String? @unique
    referenceNumber String  @unique

    user               User?     @relation(fields: [userId], references: [id])
    fullName           String
    organization       String?
    category           String
    designation        String?
    district           String?
    country            String?
    stateProvinceRegion String?
    city               String?
    districtOfOrigin   String?
    locationType       String?
    craftSector        String?
    email              String
    phone              String?
    website            String?
    participationModes String[]
    consent            Boolean   @default(false)
    consentAt          DateTime?
    participationScope String    @default("BOTH")
    status             String    @default("SUBMITTED") // SUBMITTED | UNDER_REVIEW | APPROVED | REJECTED
    submittedAt        DateTime  @default(now())
  }"""

content = content.replace(search, replace)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Prisma Schema!")
