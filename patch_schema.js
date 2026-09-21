const fs = require('fs');
let s = fs.readFileSync('backend/prisma/schema.prisma', 'utf8');

s = s.replace('enum MemberStatus {', 'enum EvaluationCaseStatus {\n  DRAFT\n  SUBMITTED\n  UNDER_REVIEW\n  GROUND_VERIFICATION_REQUIRED\n  VERIFICATION_COMPLETED\n  REJECTED\n}\n\nenum MemberStatus {');

const regex = /(model EvaluationSubmission \{[\s\S]*?adminCertificateUrl String\?)([\s\S]*?\})/;
s = s.replace(regex, `$1\n  caseStatus          EvaluationCaseStatus?\n  trackingId          String?       @unique\n  evidence            EvaluationEvidence[]$2`);

s += `
model EvaluationEvidence {
  id               String             @id @default(cuid())
  evaluationId     String
  originalFilename String
  storageKey       String
  mimeType         String
  fileSize         Int
  uploadedBy       String?
  uploadedAt       DateTime           @default(now())
  status           String             @default("ACTIVE")
  evaluation       EvaluationSubmission       @relation(fields: [evaluationId], references: [id], onDelete: Cascade)
  factors          EvaluationEvidenceFactor[]
}

model EvaluationEvidenceFactor {
  id         String             @id @default(cuid())
  evidenceId String
  factorCode String
  evidence   EvaluationEvidence @relation(fields: [evidenceId], references: [id], onDelete: Cascade)
}
`;

fs.writeFileSync('backend/prisma/schema.prisma', s);
