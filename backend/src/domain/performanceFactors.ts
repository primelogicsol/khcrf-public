export const ARTISAN_ALLOWED_FACTORS = [
  'AUTHENTICITY_PROVENANCE',
  'CHILD_LABOUR_SAFEGUARDS',
  'FAIR_WAGES',
  'WOMEN_EMPOWERMENT',
  'CRAFT_QUALITY',
  'SUSTAINABILITY',
  'DIGITAL_TRACEABILITY',
  'TECHNOLOGY_ADOPTION'
];

export const BUSINESS_ALLOWED_FACTORS = [
  'AUTHENTICITY_PROVENANCE',
  'CHILD_LABOUR_SAFEGUARDS',
  'FAIR_WAGES',
  'WOMEN_EMPOWERMENT',
  'GROUND_PRESENCE',
  'FULFILLMENT_RELIABILITY',
  'BUYER_EXPERIENCE',
  'SUSTAINABILITY',
  'DIGITAL_TRACEABILITY',
  'TECHNOLOGY_ADOPTION'
];

export const INSTITUTION_ALLOWED_FACTORS = [
  'AUTHENTICITY_PROVENANCE',
  'CHILD_LABOUR_SAFEGUARDS',
  'WOMEN_EMPOWERMENT',
  'GROUND_PRESENCE',
  'TRAINING_PROGRAMS',
  'SUSTAINABILITY',
  'TECHNOLOGY_ADOPTION'
];

export function validateFactors(entityType: string, factorFindings: any[]): boolean {
  if (!factorFindings || !Array.isArray(factorFindings)) return false;
  let allowed: string[] = [];
  if (entityType === 'ARTISAN') allowed = ARTISAN_ALLOWED_FACTORS;
  else if (entityType === 'BUSINESS') allowed = BUSINESS_ALLOWED_FACTORS;
  else if (entityType === 'INSTITUTION') allowed = INSTITUTION_ALLOWED_FACTORS;

  for (const finding of factorFindings) {
      if (!finding.factor_code || !allowed.includes(finding.factor_code)) {
          return false;
      }
      if (finding.self_reported_value === undefined) {
          return false;
      }
  }
  return true;
}
