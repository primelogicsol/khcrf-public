const fs = require('fs');
let code = fs.readFileSync('backend/prisma/schema.prisma', 'utf8');

code = code.replace(/enum EvaluationCaseStatus \{[\s\S]*?\}/, `enum VerificationCaseStatus {
  DRAFT
  GROUND_VERIFICATION_COMPLETE
  GROUND_VERIFICATION_REQUIRED
  GROUND_VERIFICATION_SCHEDULED
  MORE_EVIDENCE_REQUIRED
  READY_FOR_DECISION
  RECEIVED
  REJECTED
  SUBMITTED
  SUSPENDED
  UNDER_REVIEW
  VERIFICATION_COMPLETED
  WITHDRAWN
}`);

code = code.replace('caseStatus          EvaluationCaseStatus?', 'caseStatus          VerificationCaseStatus?');

fs.writeFileSync('backend/prisma/schema.prisma', code);
