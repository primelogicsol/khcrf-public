with open("prisma/schema.prisma", "a") as f:
    f.write("""
model MagazineIssue {
  id             String   @id @default(cuid())
  issueNumber    String   @unique
  title          String
  slug           String   @unique
  featuredCraft  String?
  edition        String?
  publicationDate DateTime?
  status         String   @default("DRAFT")
  visibility     String   @default("MEMBERS_ONLY")
  coverImage     String?
  coverAltText   String?
  teaser         String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
""")
