const fs = require('fs');
let c = fs.readFileSync('prisma/schema.prisma', 'utf8');

c = c.replace(/userId\s+String\n/, 'userId                      String?\n');
c = c.replace(/score\s+Float\n/, 'score                       Float?\n');
c = c.replace(/tier\s+String\n/, 'tier                        String?\n');
c = c.replace(/answers\s+Json\n/, 'answers                     Json?\n');

c = c.replace(
  'adminCertificateUrl         String?',
  'adminCertificateUrl         String?\n  trackingId                  String?      @unique\n  entityType                  String?\n  origin                      String?\n  caseStatus                  String?\n  currentRevision             Int?\n  craftloreEntityId           String?\n  snapshotId                  String?\n  snapshotSha256              String?\n  methodologyVersion          String?\n  selfReportedPts             Float?\n  submittedAt                 DateTime?\n  receivedAt                  DateTime?\n  reviewStartedAt             DateTime?\n  completedAt                 DateTime?'
);

c = c.replace('user                        User     @relation', 'user                        User?    @relation');

c = c.split(/\r?\n/).filter(line => !line.includes('where: raw(')).join('\n');

c += `

enum EvidenceTransferStatus {
  PENDING
  RETRIEVING
  RECEIVED
  HASH_VERIFIED
  FAILED
}

model VerificationEvidence {
  id               String   @id @default(cuid())
  submissionId     String
  revision         Int
  evidenceId       String
  factorCode       String
  originalFilename String
  mimeType         String
  sizeBytes        Int
  expectedSha256   String
  receivedSha256   String?
  storageKey       String   @unique
  transferStatus   EvidenceTransferStatus @default(PENDING)
  integrityVerified Boolean @default(false)
  receivedAt       DateTime?
  createdAt        DateTime @default(now())
  
  submission       EvaluationSubmission @relation(fields: [submissionId], references: [id], onDelete: Restrict)
  
  @@unique([submissionId, revision, evidenceId])
}
`;

fs.writeFileSync('prisma/schema.prisma', c);
