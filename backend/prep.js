const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

// Update VerificationCaseStatus
if (!schema.includes('UNDER_REVIEW') && schema.includes('enum VerificationCaseStatus {')) {
  schema = schema.replace(/enum VerificationCaseStatus \{/, 'enum VerificationCaseStatus \{\n  UNDER_REVIEW\n  VERIFICATION_COMPLETED');
}

// Update VerificationStatus
if (!schema.includes('INSUFFICIENT_EVIDENCE') && schema.includes('enum VerificationStatus {')) {
  schema = schema.replace(/enum VerificationStatus \{/, 'enum VerificationStatus \{\n  INSUFFICIENT_EVIDENCE\n  NOT_APPLICABLE');
}

// Ensure EvaluationSubmission fields are optional to avoid db push errors
let evalSub = schema.substring(schema.indexOf('model EvaluationSubmission {'), schema.indexOf('}', schema.indexOf('model EvaluationSubmission {')) + 1);
let newEvalSub = evalSub
  .replace(/userId\s+String\n/, 'userId              String?\n')
  .replace(/score\s+Float\n/, 'score               Float?\n')
  .replace(/answers\s+Json\n/, 'answers             Json?\n')
  .replace(/user\s+User\s+@relation/, 'user                User?         @relation');

if (!newEvalSub.includes('verificationFindings')) {
  newEvalSub = newEvalSub.replace(
    /evaluationType\s+String\?\s+@default\("SELF_ASSESSMENT"\)/,
    'evaluationType      String?      @default("SELF_ASSESSMENT")\n  evidence            EvaluationEvidence[]\n  verificationFindings EvaluationVerificationFinding[]'
  );
}
schema = schema.replace(evalSub, newEvalSub);

// Add models
if (!schema.includes('model EvaluationVerificationFinding')) {
  schema += `

model EvaluationEvidence {
  id               String                     @id @default(cuid())
  evaluationId     String
  originalFilename String
  storageKey       String
  mimeType         String
  fileSize         Int
  uploadedBy       String?
  uploadedAt       DateTime                   @default(now())
  status           String                     @default("ACTIVE")
  evaluation       EvaluationSubmission       @relation(fields: [evaluationId], references: [id], onDelete: Cascade)
  factors          EvaluationEvidenceFactor[]
  verificationFindings EvaluationFindingEvidence[]
}

model EvaluationEvidenceFactor {
  id         String             @id @default(cuid())
  evidenceId String
  factorCode String
  evidence   EvaluationEvidence @relation(fields: [evidenceId], references: [id], onDelete: Cascade)
}

model EvaluationVerificationFinding {
  id              String             @id @default(cuid())
  evaluationId    String
  factorCode      String
  status          VerificationStatus
  reviewerId      String
  reviewerNote    String?
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  evaluation      EvaluationSubmission @relation(fields: [evaluationId], references: [id], onDelete: Cascade)
  reviewer        User                 @relation(fields: [reviewerId], references: [id])
  evidence        EvaluationFindingEvidence[]

  @@unique([evaluationId, factorCode])
  @@index([evaluationId])
  @@index([reviewerId])
}

model EvaluationFindingEvidence {
  findingId       String
  evidenceId      String

  finding         EvaluationVerificationFinding @relation(fields: [findingId], references: [id], onDelete: Cascade)
  evidence        EvaluationEvidence            @relation(fields: [evidenceId], references: [id], onDelete: Cascade)

  @@id([findingId, evidenceId])
  @@index([findingId])
  @@index([evidenceId])
}
`;
}

fs.writeFileSync('prisma/schema.prisma', schema);
console.log('Schema prepped');
