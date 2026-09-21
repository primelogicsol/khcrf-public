const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

// 1. Add VerificationFindingEvidence model
if (!schema.includes('model VerificationFindingEvidence')) {
  schema += `

model VerificationFindingEvidence {
  findingId  String
  evidenceId String

  finding    VerificationFinding @relation(fields: [findingId], references: [id], onDelete: Cascade)
  evidence   EvaluationEvidence  @relation(fields: [evidenceId], references: [id], onDelete: Cascade)

  @@id([findingId, evidenceId])
  @@index([findingId])
  @@index([evidenceId])
}
`;
}

// 2. Add relation to VerificationFinding
let findModel = schema.substring(schema.indexOf('model VerificationFinding {'), schema.indexOf('}', schema.indexOf('model VerificationFinding {')) + 1);
if (!findModel.includes('VerificationFindingEvidence[]')) {
  let newFindModel = findModel.replace(
    '@@unique([submissionId, revision, factorKey])',
    'evidence VerificationFindingEvidence[]\n\n  @@unique([submissionId, revision, factorKey])'
  );
  schema = schema.replace(findModel, newFindModel);
}

// 3. Add relation to EvaluationEvidence
let evidModel = schema.substring(schema.indexOf('model EvaluationEvidence {'), schema.indexOf('}', schema.indexOf('model EvaluationEvidence {')) + 1);
if (!evidModel.includes('VerificationFindingEvidence[]')) {
  let newEvidModel = evidModel.replace(
    'factors          EvaluationEvidenceFactor[]',
    'factors          EvaluationEvidenceFactor[]\n  verificationFindings VerificationFindingEvidence[]'
  );
  schema = schema.replace(evidModel, newEvidModel);
}

// 4. Update VerificationCaseStatus (if UNDER_REVIEW is missing)
if (!schema.includes('UNDER_REVIEW') && schema.includes('enum VerificationCaseStatus {')) {
  schema = schema.replace(/enum VerificationCaseStatus \{/, 'enum VerificationCaseStatus \{\n  UNDER_REVIEW\n  VERIFICATION_COMPLETED');
}

fs.writeFileSync('prisma/schema.prisma', schema);
console.log('Phase 2 schema properly appended!');
