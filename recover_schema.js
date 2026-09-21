const fs = require('fs');
let schema = fs.readFileSync('backend/prisma/schema.prisma', 'utf8');

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
`;

if (!schema.includes('evidence            EvaluationEvidence[]')) {
  schema = schema.replace(
    'evaluationType      String?      @default("SELF_ASSESSMENT")',
    'evaluationType      String?      @default("SELF_ASSESSMENT")\n    evidence            EvaluationEvidence[]'
  );
}

fs.writeFileSync('backend/prisma/schema.prisma', schema);
console.log('Recovered!');
