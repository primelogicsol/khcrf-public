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

let evalSub = schema.substring(schema.indexOf('model EvaluationSubmission {'), schema.indexOf('}', schema.indexOf('model EvaluationSubmission {')) + 1);
let newEvalSub = evalSub;
if (!newEvalSub.includes('verificationFindings')) {
  newEvalSub = newEvalSub.replace(
    'evidence            EvaluationEvidence[]',
    'evidence            EvaluationEvidence[]\n    verificationFindings EvaluationVerificationFinding[]'
  );
  schema = schema.replace(evalSub, newEvalSub);
}

// Ensure `EvaluationEvidence` has the opposite relation:
let evalEvid = schema.substring(schema.indexOf('model EvaluationEvidence {'), schema.indexOf('}', schema.indexOf('model EvaluationEvidence {')) + 1);
let newEvalEvid = evalEvid;
if (!newEvalEvid.includes('verificationFindings')) {
  newEvalEvid = newEvalEvid.replace(
    'factors          EvaluationEvidenceFactor[]',
    'factors          EvaluationEvidenceFactor[]\n    verificationFindings EvaluationFindingEvidence[]'
  );
  schema = schema.replace(evalEvid, newEvalEvid);
}

// Add models
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

fs.writeFileSync('prisma/schema.prisma', schema);
console.log('Schema updated Phase 2');
