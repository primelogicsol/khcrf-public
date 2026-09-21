const fs = require('fs');
let c = fs.readFileSync('prisma/schema.prisma', 'utf8');

c += `

enum VerificationOrigin {
  CRAFTLORE
  KHCRF
}

enum VerificationCaseStatus {
  DRAFT
  SUBMITTED
  RECEIVED
  UNDER_REVIEW
  MORE_EVIDENCE_REQUIRED
  GROUND_VERIFICATION_REQUIRED
  GROUND_VERIFICATION_SCHEDULED
  GROUND_VERIFICATION_COMPLETE
  READY_FOR_DECISION
  VERIFICATION_COMPLETED
  REJECTED
  SUSPENDED
  WITHDRAWN
}

enum FactorVerificationState {
  SELF_REPORTED
  EVIDENCE_SUBMITTED
  UNDER_REVIEW
  DOCUMENT_VERIFIED
  GROUND_VERIFIED
  PARTIALLY_VERIFIED
  MORE_EVIDENCE_REQUIRED
  DISPUTED
  REJECTED
  EXPIRED
}

model VerificationFinding {
  id                String   @id @default(cuid())
  submissionId      String
  revision          Int
  factorKey         String

  selfReportedValue Json?
  verifiedValue     Json?

  status            FactorVerificationState @default(SELF_REPORTED)

  confidence        Float?
  reviewerNotes     String?
  reviewerId        String?
  reviewedAt        DateTime?
  verifiedAt        DateTime?

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  submission EvaluationSubmission @relation(fields: [submissionId], references: [id], onDelete: Restrict)
  reviewer   User?                @relation(fields: [reviewerId], references: [id], onDelete: SetNull)

  @@unique([submissionId, revision, factorKey])
  @@index([submissionId, revision])
  @@index([status])
}

enum IntegrationProcessingStatus {
  RECEIVED
  PROCESSING
  SUCCESS
  FAILED
}

enum IntegrationEventType {
  VERIFICATION_REQUESTED
}

model VerificationSubmissionRevision {
  id                 String               @id @default(cuid())
  submissionId       String
  revision           Int
  origin             VerificationOrigin
  
  // Immutability markers
  snapshotId         String?              
  snapshotSha256     String?              
  methodologyVersion String?
  selfReportedPts    Float?
  
  // Snapshots of the tree at this revision
  answersSnapshot    Json?
  factorSnapshot     Json?                 
  evidenceManifest   Json?                
  
  submittedAt        DateTime?
  receivedAt         DateTime?
  createdAt          DateTime             @default(now())

  EvaluationSubmission EvaluationSubmission @relation(fields: [submissionId], references: [id], onDelete: Restrict)
  
  @@unique([submissionId, revision])
  @@index([submissionId])
  @@index([snapshotId])
  @@index([snapshotSha256])
}

model CraftloreIntegrationEvent {
  eventId              String   @id 
  verificationRequestId String  
  eventType            IntegrationEventType
  payloadSha256        String   
  signatureValid       Boolean  
  processingStatus     IntegrationProcessingStatus
  assessmentRevision   Int?
  snapshotId           String?
  snapshotSha256       String?
  responseStatus       Int?     
  errorCode            String?  
  receivedAt           DateTime @default(now())
  processedAt          DateTime?
  
  @@index([verificationRequestId])
}
`;

fs.writeFileSync('prisma/schema.prisma', c);
