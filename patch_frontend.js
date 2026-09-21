const fs = require('fs');
let code = fs.readFileSync('frontend/src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', 'utf8');

code = code.replace(
  /const res = await api\.get\("\/evaluation\/my-evaluation"\);\s*if \(res\.data && res\.data\.length > 0\) \{\s*const draft = res\.data\.find\(\(sub: any\) => sub\.caseStatus === "DRAFT"\);\s*const submitted = res\.data\.find\(\(sub: any\) => sub\.caseStatus === "SUBMITTED"\);/,
  `const res = await api.get("/evaluation/my-evaluation");
        const submissions = Array.isArray(res.data?.data) ? res.data.data : [];
        const assessments = submissions.filter((sub: any) => sub.evaluationType === "KHCRF_16_STEP");
        
        const draft = assessments.find((sub: any) => sub.caseStatus === "DRAFT");
        const submitted = assessments.find((sub: any) => sub.caseStatus !== "DRAFT" && sub.caseStatus != null);
        if (true) {` // Keep the brace since we replaced the 'if (res.data)' line.
);

fs.writeFileSync('frontend/src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', code);
console.log('Frontend patched');
