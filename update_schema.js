const fs = require('fs');
let schema = fs.readFileSync('backend/prisma/schema.prisma', 'utf8');

// Update VerificationCaseStatus
if (!schema.includes('UNDER_REVIEW') && schema.includes('enum VerificationCaseStatus {')) {
  schema = schema.replace(/enum VerificationCaseStatus \{/, 'enum VerificationCaseStatus \{\n    UNDER_REVIEW\n    VERIFICATION_COMPLETED');
}

// Update VerificationStatus
if (!schema.includes('INSUFFICIENT_EVIDENCE') && schema.includes('enum VerificationStatus {')) {
  schema = schema.replace(/enum VerificationStatus \{/, 'enum VerificationStatus \{\n    INSUFFICIENT_EVIDENCE\n    NOT_APPLICABLE');
}

// Add Models
if (!schema.includes('model EvaluationVerificationFinding')) {
  schema += `

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

// Add verificationFindings to EvaluationSubmission
if (!schema.includes('verificationFindings EvaluationVerificationFinding[]')) {
  schema = schema.replace(
    'evidence            EvaluationEvidence[]',
    'evidence            EvaluationEvidence[]\n    verificationFindings EvaluationVerificationFinding[]'
  );
}

fs.writeFileSync('backend/prisma/schema.prisma', schema);
console.log('Schema updated.');
