const fs = require('fs');

let c = fs.readFileSync('prisma/schema.prisma', 'utf8');

c = c.split(/\r?\n/).filter(line => !line.includes('where: raw(')).join('\n');

c = c.replace(
  'verificationFindings          VerificationFinding[]',
  'verificationFindings          VerificationFinding[]\n  verificationEvidences         VerificationEvidence[]'
);

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
