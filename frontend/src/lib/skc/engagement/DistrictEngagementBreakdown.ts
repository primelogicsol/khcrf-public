import {
  DISTRICT_WEIGHTS,
  GLOBAL_INDIVIDUAL_ROLES,
  GLOBAL_INSTITUTION_CATEGORIES,
  INDIVIDUAL_ROLE_WEIGHTS,
  type EngagementSnapshot,
} from './ConsultationExperimentEngine';

function normalize(weights: Record<string, number>): Record<string, number> {
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
  if (total <= 0) return {};
  return Object.fromEntries(
    Object.entries(weights).map(([key, value]) => [key, value / total]),
  );
}

function allocateExact(total: number, weights: Record<string, number>): Record<string, number> {
  const result = Object.fromEntries(Object.keys(weights).map((key) => [key, 0])) as Record<string, number>;
  if (total <= 0) return result;

  const entries = Object.entries(weights).map(([key, weight]) => {
    const exact = total * weight;
    const base = Math.floor(exact);
    result[key] = base;
    return { key, remainder: exact - base };
  });

  const allocated = Object.values(result).reduce((sum, value) => sum + value, 0);
  const remainderCount = total - allocated;

  entries.sort((a, b) => {
    const diff = b.remainder - a.remainder;
    if (Math.abs(diff) > 0.0000001) return diff;
    return a.key.localeCompare(b.key);
  });

  for (let index = 0; index < remainderCount; index += 1) {
    result[entries[index % entries.length].key] += 1;
  }

  return result;
}

const NORMALIZED_DISTRICT_WEIGHTS = normalize(DISTRICT_WEIGHTS);
const LOCAL_INDIVIDUAL_ROLE_WEIGHTS = normalize(
  Object.fromEntries(
    Object.entries(INDIVIDUAL_ROLE_WEIGHTS).filter(([role]) => !GLOBAL_INDIVIDUAL_ROLES.has(role)),
  ),
);

export interface DistrictEngagementBreakdown {
  artisans: number;
  manufacturers: number;
  exporters: number;
  retailers: number;
  youth: number;
  citizens: number;
  researchers: number;
  institutions: number;
  otherParticipants: number;
  total: number;
}

export function getDistrictEngagementBreakdown(
  snapshot: EngagementSnapshot,
  districtName: string,
): DistrictEngagementBreakdown {
  const districtTotal = snapshot.districts[districtName] || 0;

  const localInstitutionTotal = Object.entries(snapshot.institutionCategories)
    .filter(([category]) => !GLOBAL_INSTITUTION_CATEGORIES.has(category))
    .reduce((sum, [, value]) => sum + value, 0);

  const institutionByDistrict = allocateExact(localInstitutionTotal, NORMALIZED_DISTRICT_WEIGHTS);
  const institutions = institutionByDistrict[districtName] || 0;
  const individualDistrictTotal = Math.max(0, districtTotal - institutions);

  const individualRoles = allocateExact(individualDistrictTotal, LOCAL_INDIVIDUAL_ROLE_WEIGHTS);

  const artisans = individualRoles['Artisans / Weavers'] || 0;
  const manufacturers = individualRoles['Manufacturers'] || 0;
  const exporters = individualRoles['Exporters'] || 0;
  const retailers = individualRoles['Retailers'] || 0;
  const youth = individualRoles['Youth Participants'] || 0;
  const citizens = individualRoles['Citizens'] || 0;
  const researchers = individualRoles['Researchers'] || 0;

  const displayedCore = artisans + manufacturers + exporters + retailers + youth + citizens + researchers + institutions;
  const otherParticipants = Math.max(0, districtTotal - displayedCore);

  return {
    artisans,
    manufacturers,
    exporters,
    retailers,
    youth,
    citizens,
    researchers,
    institutions,
    otherParticipants,
    total: districtTotal,
  };
}
