

// Keeping types inline to make the file self-contained or import if needed, wait, I will just export everything from here.

export type EntityType = 'ARTISAN' | 'BUSINESS' | 'INSTITUTION';

export type ResponseType = 'QUALITATIVE' | 'NUMBER' | 'PERCENTAGE' | 'DATE' | 'SELECT' | 'MULTI_SELECT' | 'SHORT_EXPLANATION' | 'STRUCTURED_TEXT' | 'EVIDENCE_UPLOAD' | 'YES_NO';

export interface Question {
  id: string;
  label: string;
  type: ResponseType;
  options?: string[]; // For SELECT, MULTI_SELECT
  required?: boolean;
}

export interface FactorCriteria {
  factorCode: string;
  title: string;
  explanation: string;
  examineCriteria: string[];
  questions: Question[];
  suggestedEvidence: string[];
  evidenceRequirement?: 'OPTIONAL' | 'RECOMMENDED' | 'REQUIRED';
}

export const QUALITATIVE_OPTIONS = ['Fully', 'Mostly', 'Partially', 'Not Yet', 'Not Applicable'];

import factorsData from '../../../shared/factors.json';

const FACTOR_LISTS: Record<EntityType, string[]> = factorsData.FACTOR_LISTS;
export const FACTOR_LABELS: Record<string, string> = factorsData.FACTOR_LABELS;

export function getFactorsForEntity(entityType: EntityType): string[] {
  return FACTOR_LISTS[entityType] || [];
}

export function getFactorCriteria(entityType: EntityType, role: string, craftCode: string, factorCode: string): FactorCriteria {
  const isPashmina = craftCode?.toLowerCase().includes('pashmina');
  
  // Base default
  let criteria: FactorCriteria = {
    factorCode,
    title: FACTOR_LABELS[factorCode] || factorCode,
    explanation: `What this means for ${entityType} in ${craftCode || 'your craft'}.`,
    examineCriteria: ['General compliance', 'Documentation', 'Standard practices'],
    questions: [
      { id: 'overall', label: 'Based on the criteria above, how completely does your current operation meet this factor?', type: 'QUALITATIVE', required: true }
    ],
    suggestedEvidence: ['Any supporting documents'],
    evidenceRequirement: 'OPTIONAL'
  };


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
          explanation: `Craft Mastery examines your technical skill, consistency, and ability to independently execute ${role || 'your craft'} in Pashmina production.`,
          examineCriteria: [
            "years of practice", "stages of production performed", "technical independence", "defect identification", "workmanship consistency", "training background"
          ],
          questions: [
            { id: 'q1', label: `How many years have you practiced ${role || 'your craft'} in Pashmina?`, type: 'NUMBER', required: true },
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
          explanation: `Craft Mastery examines your technical skill, consistency, and ability to independently execute ${role || 'your craft'} in Pashmina production.`,
          examineCriteria: [
            "years of practice", "stages of production performed", "technical independence", "defect identification", "workmanship consistency", "training background"
          ],
          questions: [
            { id: 'q1', label: `How many years have you practiced ${role || 'your craft'} in Pashmina?`, type: 'NUMBER', required: true },
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


    switch (factorCode) {
      case 'CRAFT_QUALITY':
        return {
          factorCode,
          title: "Craft Quality",
          explanation: "Craft Quality examines whether the Pashmina products made or supplied by the business consistently meet declared standards for material, workmanship, weaving/embroidery, dimensions, finishing and defect control.",
          examineCriteria: [
            "material specifications", "workmanship", "weaving / embroidery quality where applicable",
            "finishing", "dimensional consistency", "quality inspection", "defect handling", "consistency between batches/products"
          ],
          questions: [
            { id: 'q1', label: 'Do you maintain defined quality specifications for the Pashmina products you produce or sell?', type: 'SELECT', options: ['Yes', 'Partially', 'No'], required: true },
            { id: 'q2', label: 'Are products inspected before sale or dispatch?', type: 'SELECT', options: ['Every product', 'Sampled batches', 'Occasionally', 'No'], required: true },
            { id: 'q3', label: 'Which characteristics are routinely checked?', type: 'MULTI_SELECT', options: ['material', 'weaving', 'embroidery', 'dimensions', 'finishing', 'color/dye', 'defects', 'labeling'], required: true },
            { id: 'q4', label: 'Who performs final quality inspection?', type: 'SELECT', options: ['Owner', 'Internal staff', 'Master artisan', 'External expert', 'Other'], required: true },
            { id: 'q5', label: 'How do you handle products that fail quality inspection?', type: 'STRUCTURED_TEXT', required: true },
            { id: 'q6', label: 'Approximately what percentage of products were returned or rejected for quality problems during the previous 12 months?', type: 'PERCENTAGE', required: true },
            { id: 'q7', label: 'Can you demonstrate consistency across repeated production?', type: 'SELECT', options: ['Fully', 'Mostly', 'Partially', 'No'], required: true },
            { id: 'overall', label: 'Based on the criteria above, how completely does your current operation meet this factor?', type: 'QUALITATIVE', required: true }
          ],
          suggestedEvidence: ["product specifications", "inspection records", "sample quality checklist", "product photographs", "rejection/defect records", "return records", "laboratory/material test where applicable"],
          evidenceRequirement: 'RECOMMENDED'
        };
      
      case 'AUTHENTICITY_PROVENANCE':
        return {
          factorCode,
          title: "Authenticity & Provenance",
          explanation: "This factor examines whether Pashmina products, materials, artisans, workshops and origin claims can be traced and substantiated.",
          examineCriteria: [
            "material origin", "artisan/workshop identity", "supplier traceability", "GI/origin claims",
            "handmade claims", "production records", "product provenance", "disclosure of blends/substitutes"
          ],
          questions: [
            { id: 'q1', label: 'Can each product or batch be linked to the artisan, workshop or production unit responsible?', type: 'SELECT', options: ['Fully', 'Mostly', 'Partially', 'No'], required: true },
            { id: 'q2', label: 'Can the declared Pashmina material be linked to supplier/source records?', type: 'SELECT', options: ['Fully', 'Mostly', 'Partially', 'No'], required: true },
            { id: 'q3', label: 'Do you make GI, Kashmir-origin, handmade or pure-Pashmina claims?', type: 'YES_NO', required: true },
            { id: 'q4', label: 'If yes, can those claims be supported with documentation?', type: 'SELECT', options: ['Fully', 'Partially', 'No', 'N/A'], required: true },
            { id: 'q5', label: 'Do you retain provenance records after the product is sold?', type: 'SELECT', options: ['Yes', 'Partially', 'No'], required: true },
            { id: 'q6', label: 'Are blended, substitute or machine-assisted products clearly disclosed?', type: 'SELECT', options: ['Always', 'Usually', 'Sometimes', 'Never', 'N/A'], required: true },
            { id: 'q7', label: 'Have you had authenticity, provenance, GI or mislabeling complaints during the previous 3 years? (If yes, explain)', type: 'SHORT_EXPLANATION', required: true },
            { id: 'overall', label: 'Based on the criteria above, how completely does your current operation meet this factor?', type: 'QUALITATIVE', required: true }
          ],
          suggestedEvidence: ["artisan records", "supplier invoices", "material sourcing records", "GI authorization", "production records", "product labels", "provenance certificates", "Craft Digital Passport"],
          evidenceRequirement: 'REQUIRED'
        };

      case 'FULFILLMENT':
        return {
          factorCode,
          title: "Fulfillment & Logistics",
          explanation: "This factor examines whether customer orders are processed, packed, dispatched and delivered reliably and according to promised terms.",
          examineCriteria: [
            "order processing", "packing standards", "dispatch timing", "delivery reliability", "record keeping", "dispute handling"
          ],
          questions: [
            { id: 'q1', label: 'Approximately how many orders did you complete in the previous 12 months?', type: 'NUMBER', required: true },
            { id: 'q2', label: 'What percentage were dispatched within the promised timeframe?', type: 'PERCENTAGE', required: true },
            { id: 'q3', label: 'Do customers receive expected dispatch/delivery dates?', type: 'SELECT', options: ['Always', 'Usually', 'Sometimes', 'Never'], required: true },
            { id: 'q4', label: 'Do you maintain order and dispatch records?', type: 'SELECT', options: ['Fully', 'Partially', 'No'], required: true },
            { id: 'q5', label: 'Are Pashmina products packaged to protect them from moisture, staining and transit damage?', type: 'SELECT', options: ['Always', 'Usually', 'Sometimes', 'No'], required: true },
            { id: 'q6', label: 'How are lost or damaged shipments handled?', type: 'STRUCTURED_TEXT', required: true },
            { id: 'q7', label: 'Have you had significant fulfillment disputes during the previous 12 months? (Provide number + explanation)', type: 'SHORT_EXPLANATION', required: true },
            { id: 'overall', label: 'Based on the criteria above, how completely does your current operation meet this factor?', type: 'QUALITATIVE', required: true }
          ],
          suggestedEvidence: ["order records", "dispatch records", "courier tracking", "invoices", "packaging standards", "delivery confirmations", "claims/refund records"],
          evidenceRequirement: 'RECOMMENDED'
        };

      case 'BUYER_EXPERIENCE':
        return {
          factorCode,
          title: "Buyer Experience",
          explanation: "Buyer Experience measures whether customers receive accurate product information, reliable service and appropriate resolution when problems occur.",
          examineCriteria: [
            "product descriptions", "complaint resolution", "refunds and returns", "written policies", "buyer references"
          ],
          questions: [
            { id: 'q1', label: 'Are product descriptions materially accurate regarding material, craft process, origin and dimensions?', type: 'SELECT', options: ['Always', 'Usually', 'Sometimes', 'No'], required: true },
            { id: 'q2', label: 'How many customer complaints were received in the last 12 months?', type: 'NUMBER', required: true },
            { id: 'q3', label: 'How many returns/refunds occurred?', type: 'NUMBER', required: true },
            { id: 'q4', label: 'Do you maintain a written return/refund policy?', type: 'SELECT', options: ['Yes', 'Partial', 'No'], required: true },
            { id: 'q5', label: 'What is your typical complaint resolution time? (in days)', type: 'NUMBER', required: true },
            { id: 'q6', label: 'Do you record complaints and their resolution?', type: 'SELECT', options: ['Fully', 'Partially', 'No'], required: true },
            { id: 'q7', label: 'Can you provide independently verifiable buyer references or transaction records?', type: 'SELECT', options: ['Yes', 'Partial', 'No'], required: true },
            { id: 'overall', label: 'Based on the criteria above, how completely does your current operation meet this factor?', type: 'QUALITATIVE', required: true }
          ],
          suggestedEvidence: ["buyer reviews", "complaint records", "refund records", "return policy", "customer correspondence", "transaction records", "references"],
          evidenceRequirement: 'RECOMMENDED'
        };

      case 'FAIR_WAGES':
        return {
          factorCode,
          title: "Fair Wages & Artisan Treatment",
          explanation: "This factor examines whether artisans and workers understand payment terms, are paid as agreed and are protected from exploitative arrangements.",
          examineCriteria: [
            "payment terms", "wage documentation", "timely payments", "piece-rate logic", "deductions", "dispute resolution", "relationship termination"
          ],
          questions: [
            { id: 'q1', label: 'Are artisans informed of payment/rates before work begins?', type: 'SELECT', options: ['Always', 'Usually', 'Sometimes', 'No'], required: true },
            { id: 'q2', label: 'Are artisan payments documented?', type: 'SELECT', options: ['Fully', 'Partially', 'No'], required: true },
            { id: 'q3', label: 'Are payments normally made within the agreed timeframe?', type: 'SELECT', options: ['Always', 'Usually', 'Sometimes', 'No'], required: true },
            { id: 'q4', label: 'Do you use piece-rate payment?', type: 'YES_NO', required: true },
            { id: 'q5', label: 'If yes, how are rates established?', type: 'STRUCTURED_TEXT', required: true },
            { id: 'q6', label: 'Are deductions made from artisan payments? (If yes, explain)', type: 'SHORT_EXPLANATION', required: true },
            { id: 'q7', label: 'Have payment disputes occurred during the previous 12 months? (Provide number + explanation)', type: 'SHORT_EXPLANATION', required: true },
            { id: 'q8', label: 'Can artisans terminate the commercial relationship without withheld documents, coercion or debt restrictions?', type: 'YES_NO', required: true },
            { id: 'overall', label: 'Based on the criteria above, how completely does your current operation meet this factor?', type: 'QUALITATIVE', required: true }
          ],
          suggestedEvidence: ["sample payment records", "receipts", "contracts", "wage registers", "artisan acknowledgements"],
          evidenceRequirement: 'REQUIRED'
        };

      case 'CHILD_LABOUR_SAFEGUARDS':
        return {
          factorCode,
          title: "Child-Labour Safeguards",
          explanation: "This is a critical safeguard factor examining whether prohibited child labour is prevented across direct, subcontracted and household production.",
          examineCriteria: [
            "safeguarding policy", "age verification", "subcontracted monitoring", "supplier agreements", "incident history", "corrective actions", "ground verification"
          ],
          questions: [
            { id: 'q1', label: 'Do you maintain a prohibition against prohibited child labour?', type: 'YES_NO', required: true },
            { id: 'q2', label: 'How is age verified where workers are engaged?', type: 'STRUCTURED_TEXT', required: true },
            { id: 'q3', label: 'Do you use subcontracted or household production?', type: 'YES_NO', required: true },
            { id: 'q4', label: 'If yes, how do you monitor child-labour risk there?', type: 'STRUCTURED_TEXT', required: true },
            { id: 'q5', label: 'Are suppliers/subcontractors required to follow child-labour safeguards?', type: 'SELECT', options: ['Yes', 'Partially', 'No'], required: true },
            { id: 'q6', label: 'Have any child-labour incidents been identified during the previous 3 years?', type: 'YES_NO', required: true },
            { id: 'q7', label: 'If yes, what corrective action was taken?', type: 'STRUCTURED_TEXT', required: true },
            { id: 'q8', label: 'Will you permit KHCRF ground verification where required?', type: 'YES_NO', required: true },
            { id: 'overall', label: 'Based on the criteria above, how completely does your current operation meet this factor?', type: 'QUALITATIVE', required: true }
          ],
          suggestedEvidence: ["safeguarding policy", "age verification procedure", "supplier agreements", "monitoring records", "corrective-action documentation"],
          evidenceRequirement: 'REQUIRED'
        };

      case 'WOMEN_EMPOWERMENT':
        return {
          factorCode,
          title: "Women's Participation & Empowerment",
          explanation: "This factor examines women's participation, payment, access to skilled work, training, decision-making, leadership and safe working conditions.",
          examineCriteria: [
            "participation rate", "direct payment", "access to skilled work", "leadership roles", "training access", "safe workplace", "livelihood initiatives"
          ],
          questions: [
            { id: 'q1', label: 'Approximately what percentage of your artisan/workforce is women?', type: 'PERCENTAGE', required: true },
            { id: 'q2', label: 'Are women normally paid directly for their work?', type: 'SELECT', options: ['Always', 'Usually', 'Sometimes', 'No'], required: true },
            { id: 'q3', label: 'Do women have access to skilled/higher-value assignments?', type: 'SELECT', options: ['Fully', 'Mostly', 'Partially', 'No'], required: true },
            { id: 'q4', label: 'Are women represented in supervisory/management/ownership roles? (Provide number/percentage)', type: 'SHORT_EXPLANATION', required: true },
            { id: 'q5', label: 'Do women have equal access to training?', type: 'SELECT', options: ['Yes', 'Partially', 'No'], required: true },
            { id: 'q6', label: 'Are safe and respectful workplace safeguards maintained?', type: 'SELECT', options: ['Yes', 'Partially', 'No'], required: true },
            { id: 'q7', label: 'Do you operate women-focused livelihood or development initiatives? (If yes, describe)', type: 'SHORT_EXPLANATION', required: true },
            { id: 'overall', label: 'Based on the criteria above, how completely does your current operation meet this factor?', type: 'QUALITATIVE', required: true }
          ],
          suggestedEvidence: ["workforce records", "payment records", "training records", "management records", "program documentation", "safeguarding policy"],
          evidenceRequirement: 'RECOMMENDED'
        };

      case 'GROUND_PRESENCE':
        return {
          factorCode,
          title: "Ground Presence",
          explanation: "Ground Presence examines whether the business's claimed physical operation actually exists, is active and can be independently verified. This is NOT the same as KHCRF GROUND_VERIFIED.",
          examineCriteria: [
            "physical location", "location type", "operational history", "workforce size", "actual production", "verifiability"
          ],
          questions: [
            { id: 'q1', label: 'Do you currently operate from a physical workshop, office or production location?', type: 'YES_NO', required: true },
            { id: 'q2', label: 'What type of location is it?', type: 'SELECT', options: ['Owned', 'Rented', 'Shared', 'Household', 'Other'], required: true },
            { id: 'q3', label: 'How long have you operated there? (years)', type: 'NUMBER', required: true },
            { id: 'q4', label: 'Approximately how many people normally work from this location?', type: 'NUMBER', required: true },
            { id: 'q5', label: 'Is production actually performed at this location?', type: 'SELECT', options: ['All', 'Most', 'Some', 'None'], required: true },
            { id: 'q6', label: 'Can this location be independently verified?', type: 'YES_NO', required: true },
            { id: 'q7', label: 'Will you permit a KHCRF visit if required?', type: 'YES_NO', required: true },
            { id: 'overall', label: 'Based on the criteria above, how completely does your current operation meet this factor?', type: 'QUALITATIVE', required: true }
          ],
          suggestedEvidence: ["workshop photographs", "registration", "lease/ownership record", "utility record", "operating documents", "location evidence"],
          evidenceRequirement: 'RECOMMENDED'
        };

      case 'TRANSPARENCY':
        return {
          factorCode,
          title: "Transparency & Documentation",
          explanation: "This factor examines whether the business can substantiate its identity, transactions, suppliers, product claims and operating practices with records.",
          examineCriteria: [
            "legal identity", "transaction records", "supplier documentation", "product documentation", "transaction conditions", "record retention", "inspection readiness"
          ],
          questions: [
            { id: 'q1', label: 'Is your legal/operating identity clearly disclosed?', type: 'SELECT', options: ['Yes', 'Partially', 'No'], required: true },
            { id: 'q2', label: 'Do you issue invoices or equivalent transaction records?', type: 'SELECT', options: ['Always', 'Usually', 'Sometimes', 'Never'], required: true },
            { id: 'q3', label: 'Can principal suppliers/artisan partners be documented?', type: 'SELECT', options: ['Fully', 'Partially', 'No'], required: true },
            { id: 'q4', label: 'Are product materials and methods accurately documented?', type: 'SELECT', options: ['Fully', 'Partially', 'No'], required: true },
            { id: 'q5', label: 'Are price, shipping, return and other transaction conditions disclosed before purchase?', type: 'SELECT', options: ['Always', 'Usually', 'Sometimes', 'No'], required: true },
            { id: 'q6', label: 'How long are important business records normally retained?', type: 'STRUCTURED_TEXT', required: true },
            { id: 'q7', label: 'Can KHCRF confidentially inspect supporting records when required?', type: 'YES_NO', required: true },
            { id: 'overall', label: 'Based on the criteria above, how completely does your current operation meet this factor?', type: 'QUALITATIVE', required: true }
          ],
          suggestedEvidence: ["registration documents", "invoices", "supplier records", "contracts", "product specifications", "policies", "operating records"],
          evidenceRequirement: 'RECOMMENDED'
        };

      case 'TECHNOLOGY':
        return {
          factorCode,
          title: "Technology & Digital Capability",
          explanation: "This factor examines whether appropriate digital tools support the business's records, inventory, orders, product information and secure information management.",
          examineCriteria: [
            "digital inventory", "order tracking", "digital specifications", "artisan records", "data backup", "access controls", "data exchange"
          ],
          questions: [
            { id: 'q1', label: 'Do you maintain digital inventory records?', type: 'SELECT', options: ['Fully', 'Partially', 'No'], required: true },
            { id: 'q2', label: 'Are customer orders tracked electronically?', type: 'SELECT', options: ['Fully', 'Partially', 'No'], required: true },
            { id: 'q3', label: 'Do you maintain digital product specifications/catalog records?', type: 'SELECT', options: ['Fully', 'Partially', 'No'], required: true },
            { id: 'q4', label: 'Are production or artisan records maintained digitally?', type: 'SELECT', options: ['Fully', 'Partially', 'No'], required: true },
            { id: 'q5', label: 'Are important records backed up?', type: 'SELECT', options: ['Yes', 'Partially', 'No'], required: true },
            { id: 'q6', label: 'Are access controls/password protections used for sensitive records?', type: 'SELECT', options: ['Yes', 'Partially', 'No'], required: true },
            { id: 'q7', label: 'Can structured product/provenance information be exchanged digitally with commercial partners?', type: 'SELECT', options: ['Yes', 'Partially', 'Not Yet'], required: true },
            { id: 'overall', label: 'Based on the criteria above, how completely does your current operation meet this factor?', type: 'QUALITATIVE', required: true }
          ],
          suggestedEvidence: ["inventory screenshots", "system reports", "order-management screenshots", "digital catalog", "backup/process documentation"],
          evidenceRequirement: 'OPTIONAL'
        };

      case 'DIGITAL_TRACEABILITY':
        return {
          factorCode,
          title: "Digital Traceability",
          explanation: "Digital Traceability examines whether Pashmina products can be connected through reliable digital records to their material source, artisan/workshop, production process and provenance.",
          examineCriteria: [
            "unique identifiers", "artisan linkage", "material linkage", "traceability systems", "traceable percentage", "buyer access", "historical retention"
          ],
          questions: [
            { id: 'q1', label: 'Do products/batches have unique identifiers?', type: 'SELECT', options: ['All', 'Most', 'Some', 'None'], required: true },
            { id: 'q2', label: 'Can the identifier be linked to the artisan/workshop/production unit?', type: 'SELECT', options: ['Fully', 'Mostly', 'Partially', 'No'], required: true },
            { id: 'q3', label: 'Can declared Pashmina material be linked to supplier/source records?', type: 'SELECT', options: ['Fully', 'Mostly', 'Partially', 'No'], required: true },
            { id: 'q4', label: 'Which systems are currently used?', type: 'MULTI_SELECT', options: ['Craft Digital Passport', 'QR', 'NFC', 'batch/lot number', 'digital inventory', 'supplier/artisan record', 'other', 'none'], required: true },
            { id: 'q5', label: 'Approximately what percentage of products are digitally traceable?', type: 'PERCENTAGE', required: true },
            { id: 'q6', label: 'Can buyers/verifiers retrieve provenance information from the identifier?', type: 'SELECT', options: ['Directly', 'Internally on request', 'Partially', 'Not Yet'], required: true },
            { id: 'q7', label: 'Are historical records preserved when product information changes?', type: 'SELECT', options: ['Yes', 'Partially', 'No'], required: true },
            { id: 'overall', label: 'Based on the criteria above, how completely does your current operation meet this factor?', type: 'QUALITATIVE', required: true }
          ],
          suggestedEvidence: ["sample Digital Passport", "QR/NFC record", "product identifier", "batch record", "artisan/workshop linkage", "supplier linkage", "traceability screenshots"],
          evidenceRequirement: 'OPTIONAL'
        };

      case 'SUSTAINABILITY':
        return {
          factorCode,
          title: "Sustainability",
          explanation: "Sustainability examines how the Pashmina business identifies material sources, manages waste/resources and substantiates environmental claims.",
          examineCriteria: [
            "material identification", "sourcing records", "waste reduction", "chemical management", "material recovery", "resource tracking", "environmental claims"
          ],
          questions: [
            { id: 'q1', label: 'Can principal raw materials be identified and documented?', type: 'SELECT', options: ['Fully', 'Partially', 'No'], required: true },
            { id: 'q2', label: 'Do you maintain material sourcing records?', type: 'SELECT', options: ['Fully', 'Partially', 'No'], required: true },
            { id: 'q3', label: 'Do you operate practices to reduce production waste?', type: 'SELECT', options: ['Yes', 'Partially', 'No'], required: true },
            { id: 'q4', label: 'Are relevant dyes, chemicals or processing inputs appropriately managed?', type: 'SELECT', options: ['Yes', 'Partially', 'No', 'N/A'], required: true },
            { id: 'q5', label: 'Are repair, reuse, recycling or material recovery practices used?', type: 'SELECT', options: ['Regularly', 'Sometimes', 'No'], required: true },
            { id: 'q6', label: 'Can you provide information about important production inputs such as energy or water where applicable?', type: 'SELECT', options: ['Yes', 'Partially', 'No', 'N/A'], required: true },
            { id: 'q7', label: 'Do you make environmental or sustainability claims to buyers?', type: 'YES_NO', required: true },
            { id: 'q8', label: 'If yes, can those claims be substantiated?', type: 'SELECT', options: ['Fully', 'Partially', 'No', 'N/A'], required: true },
            { id: 'overall', label: 'Based on the criteria above, how completely does your current operation meet this factor?', type: 'QUALITATIVE', required: true }
          ],
          suggestedEvidence: ["sourcing records", "supplier documents", "waste records", "dye/process records", "repair/reuse policy", "sustainability documentation", "environmental certifications where applicable"],
          evidenceRequirement: 'RECOMMENDED'
        };
      
      default:
        return criteria;
    }
  }

  // Fallback for others
  return criteria;
}
