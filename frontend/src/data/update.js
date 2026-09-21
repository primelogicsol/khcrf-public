import fs from 'fs';

const filePath = 'C:\\Users\\Fayaz\\Sufipulseupdate2026\\HCRF 2026\\hcr_foundation_full_govind\\frontend\\src\\data\\evaluationRegistry.ts';
let content = fs.readFileSync(filePath, 'utf-8');

const artisanPashminaBlock = `
  if (entityType === 'ARTISAN' && isPashmina) {
    const isWeaver = role === 'WEAVER' || role === 'KANI_WEAVER';
    const isEmbroiderer = role === 'SOZNI_EMBROIDERER';
    const isSpinner = role === 'SPINNER';
    const isDyer = role === 'DYER';
    const isFinisher = role === 'FINISHER';

    switch (factorCode) {
      case 'CRAFT_QUALITY':
        return {
          factorCode,
          title: "Craft Quality / Craft Mastery",
          explanation: \`Craft Mastery examines your technical skill, consistency, and ability to independently execute \${role || 'your craft'} in Pashmina production.\`,
          examineCriteria: [
            "years of practice", "stages of production performed", "technical independence", "defect identification", "workmanship consistency", "training background"
          ],
          questions: [
            { id: 'q1', label: \`How many years have you practiced \${role || 'your craft'} in Pashmina?\`, type: 'NUMBER', required: true },
            { id: 'q2', label: 'Which stages of production do you personally perform?', type: 'STRUCTURED_TEXT', required: true },
            isWeaver ? { id: 'q_weaver1', label: 'Can you independently prepare and operate the loom for Pashmina weaving?', type: 'YES_NO', required: true } :
            isEmbroiderer ? { id: 'q_emb1', label: 'Can you independently execute fine Sozni stitches on delicate Pashmina without puckering?', type: 'YES_NO', required: true } :
            isSpinner ? { id: 'q_spin1', label: 'Can you spin fine, consistent Pashmina yarn by hand (Charkha/Yinder)?', type: 'YES_NO', required: true } :
            isDyer ? { id: 'q_dye1', label: 'Can you accurately match shades and ensure even dyeing without damaging the delicate fiber?', type: 'YES_NO', required: true } :
            { id: 'q_other1', label: 'Can you independently execute your craft to accepted quality standards?', type: 'YES_NO', required: true },
            { id: 'q3', label: 'Can you maintain consistent structure, dimension, or quality across pieces?', type: 'SELECT', options: ['Always', 'Usually', 'Sometimes', 'No'], required: true },
            { id: 'q4', label: 'How do you identify and correct defects in your work?', type: 'STRUCTURED_TEXT', required: true },
            { id: 'q5', label: 'Can finished work be linked directly to you?', type: 'SELECT', options: ['Always', 'Usually', 'Sometimes', 'No'], required: true },
            { id: 'q6', label: 'Have you trained under a master artisan, family tradition, cooperative, institute or another recognized pathway?', type: 'YES_NO', required: true },
            { id: 'q7', label: 'Do you maintain samples or records demonstrating your workmanship?', type: 'YES_NO', required: true },
            { id: 'overall', label: 'Based on the criteria above, how completely do you meet this factor?', type: 'QUALITATIVE', required: true }
          ],
          suggestedEvidence: ["artisan card", "work samples", "loom/workshop photographs", "process photographs", "training records", "master-artisan reference", "product records", "awards/certificates where applicable"],
          evidenceRequirement: 'RECOMMENDED'
        };

      case 'AUTHENTICITY_PROVENANCE':
        return {
          factorCode,
          title: "Authenticity & Provenance",
          explanation: "Authenticity examines your ability to identify genuine Pashmina, distinguish it from blends, and properly attribute your handmade work.",
          examineCriteria: [
            "material identification", "work attribution", "production stages", "blend detection", "GI/handmade claims", "record keeping", "dispute history"
          ],
          questions: [
            { id: 'q1', label: 'Can you identify the source/type of material you work with?', type: 'SELECT', options: ['Always', 'Usually', 'Sometimes', 'No'], required: true },
            { id: 'q2', label: 'Can your work be linked to you or your workshop?', type: 'SELECT', options: ['Always', 'Usually', 'Sometimes', 'No'], required: true },
            { id: 'q3', label: 'Which production stages do you personally perform?', type: 'STRUCTURED_TEXT', required: true },
            { id: 'q4', label: 'Can you distinguish declared Pashmina material from substitutes/blends relevant to your work?', type: 'YES_NO', required: true },
            { id: 'q5', label: 'Are GI/origin/handmade claims associated with your work documented where applicable?', type: 'SELECT', options: ['Yes', 'Partially', 'No', 'N/A'], required: true },
            { id: 'q6', label: 'Do you maintain records or references linking finished pieces to your work?', type: 'YES_NO', required: true },
            { id: 'q7', label: 'Have authenticity or attribution disputes occurred? (If yes, explain)', type: 'SHORT_EXPLANATION', required: true },
            { id: 'overall', label: 'Based on the criteria above, how completely do you meet this factor?', type: 'QUALITATIVE', required: true }
          ],
          suggestedEvidence: ["artisan registration", "workshop evidence", "material records", "process photographs", "product records", "GI-linked evidence where applicable", "Craft Digital Passport"],
          evidenceRequirement: 'REQUIRED'
        };

      case 'GROUND_PRESENCE':
        return {
          factorCode,
          title: "Ground Presence",
          explanation: "Ground Presence confirms where you practice your craft and whether the location and equipment can be verified.",
          examineCriteria: [
            "practice location", "duration at location", "required equipment", "verifiability", "process observation"
          ],
          questions: [
            { id: 'q1', label: 'Where do you normally practice your craft?', type: 'SELECT', options: ['Household', 'Own Workshop', 'Cooperative', 'Employer Workshop', 'Shared Facility', 'Other'], required: true },
            { id: 'q2', label: 'How long have you worked from this location? (years)', type: 'NUMBER', required: true },
            { id: 'q3', label: 'Is equipment required for your declared role present?', type: 'YES_NO', required: true },
            { id: 'q4', label: 'Can KHCRF verify this location?', type: 'YES_NO', required: true },
            { id: 'q5', label: 'Can KHCRF observe the declared craft process if required?', type: 'YES_NO', required: true },
            { id: 'overall', label: 'Based on the criteria above, how completely do you meet this factor?', type: 'QUALITATIVE', required: true }
          ],
          suggestedEvidence: ["workshop photographs", "location evidence", "artisan registration"],
          evidenceRequirement: 'RECOMMENDED'
        };

      case 'CHILD_LABOUR_SAFEGUARDS':
        return {
          factorCode,
          title: "Child-Labour Safeguards",
          explanation: "This factor examines protections against prohibited child labour within your household or workshop.",
          examineCriteria: [
            "minor involvement", "apprentice safeguards", "subcontracting practices", "incident history", "verification access"
          ],
          questions: [
            { id: 'q1', label: 'Are minors involved in commercial production under your supervision?', type: 'YES_NO', required: true },
            { id: 'q2', label: 'Do you use apprentices?', type: 'YES_NO', required: true },
            { id: 'q3', label: 'If apprentices are young persons, how are age, education and permitted work conditions safeguarded?', type: 'STRUCTURED_TEXT', required: true },
            { id: 'q4', label: 'Do you subcontract work to households?', type: 'YES_NO', required: true },
            { id: 'q5', label: 'If yes, how do you ensure prohibited child labour is not involved?', type: 'STRUCTURED_TEXT', required: true },
            { id: 'q6', label: 'Have any concerns/incidents occurred?', type: 'YES_NO', required: true },
            { id: 'q7', label: 'Will you permit KHCRF ground verification?', type: 'YES_NO', required: true },
            { id: 'overall', label: 'Based on the criteria above, how completely do you meet this factor?', type: 'QUALITATIVE', required: true }
          ],
          suggestedEvidence: ["age verification documents where applicable", "apprentice records"],
          evidenceRequirement: 'REQUIRED'
        };

      case 'WOMEN_EMPOWERMENT':
        return {
          factorCode,
          title: "Women's Participation & Empowerment",
          explanation: "This factor examines women's involvement, fair compensation, and safe working conditions in your practice.",
          examineCriteria: [
            "women's involvement", "direct payment", "skilled processes", "decision participation", "training opportunities", "safe conditions"
          ],
          questions: [
            { id: 'q1', label: 'Are women involved in the craft activity/workshop?', type: 'YES_NO', required: true },
            { id: 'q2', label: 'Are women paid directly for their work where applicable?', type: 'SELECT', options: ['Always', 'Usually', 'Sometimes', 'No', 'N/A'], required: true },
            { id: 'q3', label: 'Do women perform skilled/high-value processes?', type: 'SELECT', options: ['Yes', 'Partially', 'No', 'N/A'], required: true },
            { id: 'q4', label: 'Do women participate in decisions regarding production/payment?', type: 'SELECT', options: ['Yes', 'Partially', 'No', 'N/A'], required: true },
            { id: 'q5', label: 'Do women receive training opportunities?', type: 'SELECT', options: ['Yes', 'Partially', 'No', 'N/A'], required: true },
            { id: 'q6', label: 'Are working conditions safe and respectful?', type: 'SELECT', options: ['Yes', 'Partially', 'No'], required: true },
            { id: 'overall', label: 'Based on the criteria above, how completely do you meet this factor?', type: 'QUALITATIVE', required: true }
          ],
          suggestedEvidence: ["payment records", "workshop photographs", "training records"],
          evidenceRequirement: 'OPTIONAL'
        };

      case 'FAIR_WAGES':
        return {
          factorCode,
          title: "Fair Wages & Artisan Treatment",
          explanation: "This factor examines payment terms, timely compensation, and freedom from coercive debt for you and anyone you employ.",
          examineCriteria: [
            "agreed rates", "clear terms", "timely payment", "payment documentation", "deductions", "dispute history", "freedom of work"
          ],
          questions: [
            { id: 'q1', label: 'Are you paid an agreed rate before accepting commissioned work?', type: 'SELECT', options: ['Always', 'Usually', 'Sometimes', 'No'], required: true },
            { id: 'q2', label: 'Are payment terms clear?', type: 'YES_NO', required: true },
            { id: 'q3', label: 'Are payments received on time?', type: 'SELECT', options: ['Always', 'Usually', 'Sometimes', 'No'], required: true },
            { id: 'q4', label: 'Are payments documented?', type: 'YES_NO', required: true },
            { id: 'q5', label: 'Are deductions made? (If yes, explain)', type: 'SHORT_EXPLANATION', required: true },
            { id: 'q6', label: 'Have you experienced payment disputes in the previous 12 months?', type: 'YES_NO', required: true },
            { id: 'q7', label: 'Are you free to accept/reject work without coercion or debt restriction?', type: 'YES_NO', required: true },
            { id: 'q8', label: 'If you employ/pay other artisans, do the same safeguards apply to them?', type: 'SELECT', options: ['Yes', 'No', 'N/A'], required: true },
            { id: 'overall', label: 'Based on the criteria above, how completely do you meet this factor?', type: 'QUALITATIVE', required: true }
          ],
          suggestedEvidence: ["payment receipts", "bank statements", "order books", "contracts"],
          evidenceRequirement: 'RECOMMENDED'
        };

      case 'BUYER_EXPERIENCE':
        return {
          factorCode,
          title: "Buyer Experience",
          explanation: "This factor examines how accurately you represent your work to buyers and how you handle direct sales and complaints.",
          examineCriteria: [
            "direct sales", "accurate descriptions", "complaint history", "dispute resolution", "buyer references"
          ],
          questions: [
            { id: 'q1', label: 'Do you sell directly to buyers?', type: 'YES_NO', required: true },
            { id: 'q2', label: 'Are product descriptions accurate?', type: 'SELECT', options: ['Always', 'Usually', 'Sometimes', 'No', 'N/A'], required: true },
            { id: 'q3', label: 'Do you communicate material/process/origin accurately?', type: 'SELECT', options: ['Always', 'Usually', 'Sometimes', 'No', 'N/A'], required: true },
            { id: 'q4', label: 'Have you received complaints or returns?', type: 'YES_NO', required: true },
            { id: 'q5', label: 'How are disputes resolved?', type: 'STRUCTURED_TEXT', required: true },
            { id: 'q6', label: 'Can transaction or buyer-reference evidence be provided?', type: 'SELECT', options: ['Yes', 'Partially', 'No', 'N/A'], required: true },
            { id: 'q7', label: 'If you do not sell directly, who is your primary intermediary? (Leave blank if N/A)', type: 'SHORT_EXPLANATION', required: false },
            { id: 'overall', label: 'Based on the criteria above, how completely do you meet this factor?', type: 'QUALITATIVE', required: true }
          ],
          suggestedEvidence: ["buyer references", "transaction records", "communication logs"],
          evidenceRequirement: 'OPTIONAL'
        };

      case 'FULFILLMENT':
        return {
          factorCode,
          title: "Fulfillment & Logistics",
          explanation: "This factor examines your ability to meet delivery timelines and safely handle orders.",
          examineCriteria: [
            "direct orders", "delivery timelines", "on-time completion", "delay communication", "packaging standards", "order records"
          ],
          questions: [
            { id: 'q1', label: 'Do you accept direct orders/commissions?', type: 'YES_NO', required: true },
            { id: 'q2', label: 'Do you agree delivery timelines?', type: 'SELECT', options: ['Always', 'Usually', 'Sometimes', 'No', 'N/A'], required: true },
            { id: 'q3', label: 'What percentage are completed on time?', type: 'PERCENTAGE', required: false },
            { id: 'q4', label: 'How are delays communicated?', type: 'STRUCTURED_TEXT', required: true },
            { id: 'q5', label: 'How is finished work protected/packaged?', type: 'STRUCTURED_TEXT', required: true },
            { id: 'q6', label: 'Are order records maintained?', type: 'SELECT', options: ['Yes', 'Partially', 'No', 'N/A'], required: true },
            { id: 'overall', label: 'Based on the criteria above, how completely do you meet this factor?', type: 'QUALITATIVE', required: true }
          ],
          suggestedEvidence: ["order books", "dispatch records", "packaging photos"],
          evidenceRequirement: 'OPTIONAL'
        };

      case 'TRANSPARENCY':
        return {
          factorCode,
          title: "Transparency & Documentation",
          explanation: "This factor examines whether you can substantiate your identity, records, and relationships.",
          examineCriteria: [
            "identity verification", "record retention", "commission documentation", "material description", "inspection readiness"
          ],
          questions: [
            { id: 'q1', label: 'Can your artisan identity be independently verified?', type: 'YES_NO', required: true },
            { id: 'q2', label: 'Do you retain work/payment/order records where applicable?', type: 'SELECT', options: ['Always', 'Usually', 'Sometimes', 'No'], required: true },
            { id: 'q3', label: 'Can commissions or production relationships be documented?', type: 'YES_NO', required: true },
            { id: 'q4', label: 'Can materials used in your work be described accurately?', type: 'YES_NO', required: true },
            { id: 'q5', label: 'Can KHCRF confidentially inspect supporting records?', type: 'YES_NO', required: true },
            { id: 'overall', label: 'Based on the criteria above, how completely do you meet this factor?', type: 'QUALITATIVE', required: true }
          ],
          suggestedEvidence: ["artisan registration", "identity documents", "work records"],
          evidenceRequirement: 'RECOMMENDED'
        };

      case 'TECHNOLOGY':
        return {
          factorCode,
          title: "Technology & Digital Capability",
          explanation: "This factor examines your use of digital tools to support your craft practice and communication.",
          examineCriteria: [
            "device usage", "digital catalogs", "digital communication", "digital records", "verification system access"
          ],
          questions: [
            { id: 'q1', label: 'Do you use a smartphone/digital device for craft-related activity?', type: 'YES_NO', required: true },
            { id: 'q2', label: 'Do you maintain digital photographs/catalogs of work?', type: 'YES_NO', required: true },
            { id: 'q3', label: 'Do you communicate with buyers/businesses digitally?', type: 'YES_NO', required: true },
            { id: 'q4', label: 'Do you maintain digital payment/order records where applicable?', type: 'YES_NO', required: true },
            { id: 'q5', label: 'Can you access or use digital provenance/verification systems?', type: 'SELECT', options: ['Yes', 'Partially', 'No'], required: true },
            { id: 'overall', label: 'Based on the criteria above, how completely do you meet this factor?', type: 'QUALITATIVE', required: true }
          ],
          suggestedEvidence: ["digital catalogs", "communication screenshots", "digital records"],
          evidenceRequirement: 'OPTIONAL'
        };

      case 'DIGITAL_TRACEABILITY':
        return {
          factorCode,
          title: "Digital Traceability",
          explanation: "This factor examines whether your work can be digitally tracked back to you.",
          examineCriteria: [
            "digital linkage", "identifiers used", "role visibility", "location linkage", "material information", "traceable percentage"
          ],
          questions: [
            { id: 'q1', label: 'Can finished pieces be digitally linked to you as the artisan?', type: 'YES_NO', required: true },
            { id: 'q2', label: 'Do products you make use a QR/NFC/Digital Passport/batch identifier?', type: 'YES_NO', required: true },
            { id: 'q3', label: 'Can the identifier show your craft role?', type: 'YES_NO', required: true },
            { id: 'q4', label: 'Can your workshop/location be linked to the product record?', type: 'YES_NO', required: true },
            { id: 'q5', label: 'Can material/process information be attached?', type: 'YES_NO', required: true },
            { id: 'q6', label: 'What percentage of your output is digitally traceable?', type: 'PERCENTAGE', required: true },
            { id: 'overall', label: 'Based on the criteria above, how completely do you meet this factor?', type: 'QUALITATIVE', required: true }
          ],
          suggestedEvidence: ["sample Digital Passport", "QR tags", "traceability records"],
          evidenceRequirement: 'OPTIONAL'
        };

      case 'SUSTAINABILITY':
        return {
          factorCode,
          title: "Sustainability",
          explanation: "This factor examines how you manage materials, reduce waste, and handle environmental practices specific to your role.",
          examineCriteria: [
            "material identification", "waste reduction", "material reuse", "input management", "repair/rework", "environmental claims", "claim substantiation"
          ],
          questions: [
            { id: 'q1', label: 'Can you identify the principal materials used?', type: 'YES_NO', required: true },
            { id: 'q2', label: 'Do you minimize material waste?', type: 'YES_NO', required: true },
            { id: 'q3', label: 'Are remnants/materials reused where practical?', type: 'YES_NO', required: true },
            { id: 'q4', label: 'If dyeing/finishing is part of your role, how are relevant inputs managed?', type: 'STRUCTURED_TEXT', required: true },
            { id: 'q5', label: 'Do you repair/rework products where possible?', type: 'YES_NO', required: true },
            { id: 'q6', label: 'Do you make environmental claims about your work?', type: 'YES_NO', required: true },
            { id: 'q7', label: 'Can those claims be substantiated?', type: 'SELECT', options: ['Yes', 'Partially', 'No', 'N/A'], required: true },
            { id: 'overall', label: 'Based on the criteria above, how completely do you meet this factor?', type: 'QUALITATIVE', required: true }
          ],
          suggestedEvidence: ["process photographs", "material records", "waste management evidence"],
          evidenceRequirement: 'RECOMMENDED'
        };

      case 'KNOWLEDGE_TRANSFER':
        return {
          factorCode,
          title: "Knowledge Transfer",
          explanation: "This factor examines how you learned your craft and how you pass those skills to the next generation.",
          examineCriteria: [
            "learning pathway", "training duration", "current apprentices", "recent trainees", "techniques taught", "documentation", "apprentice compensation", "skill risk"
          ],
          questions: [
            { id: 'q1', label: 'Did you learn the craft through family tradition, master artisan, institution, cooperative or another route?', type: 'SHORT_EXPLANATION', required: true },
            { id: 'q2', label: 'How many years did you train?', type: 'NUMBER', required: true },
            { id: 'q3', label: 'Do you currently train apprentices or younger artisans?', type: 'YES_NO', required: true },
            { id: 'q4', label: 'How many have you trained during the previous 3 years?', type: 'NUMBER', required: true },
            { id: 'q5', label: 'Which techniques do you teach?', type: 'STRUCTURED_TEXT', required: true },
            { id: 'q6', label: 'Do you document patterns, processes, terminology or techniques?', type: 'YES_NO', required: true },
            { id: 'q7', label: 'Are apprentices compensated where applicable?', type: 'SELECT', options: ['Yes', 'No', 'N/A'], required: true },
            { id: 'q8', label: 'Do you believe the skill you practice is at risk of declining?', type: 'YES_NO', required: true },
            { id: 'overall', label: 'Based on the criteria above, how completely do you meet this factor?', type: 'QUALITATIVE', required: true }
          ],
          suggestedEvidence: ["apprentice records", "training photographs", "references", "certificates", "workshop records", "documentation of techniques"],
          evidenceRequirement: 'RECOMMENDED'
        };

      default:
        break; // Fall through to base default if not explicitly handled
    }
  }

  if (entityType === 'BUSINESS' && isPashmina) {
`;

content = content.replace("  if (entityType === 'BUSINESS' && isPashmina) {", artisanPashminaBlock);
fs.writeFileSync(filePath, content, 'utf-8');
console.log('Done!');
