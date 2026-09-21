import { AssessmentCycle2026 } from '@/config/assessmentCycle';

export const CONFIG = {
  ENGINE_VERSION: 'V1',
  TIMEZONE: 'Asia/Kolkata',
  SOFT_LAUNCH_DAYS: 3,
  SOFT_LAUNCH_INDIVIDUAL_MIN: 80,
  SOFT_LAUNCH_INDIVIDUAL_MAX: 140,
  STANDARD_INDIVIDUAL_MIN: 456,
  STANDARD_INDIVIDUAL_MAX: 785,
  SOFT_LAUNCH_INSTITUTION_MIN: 0,
  SOFT_LAUNCH_INSTITUTION_MAX: 1,
  STANDARD_INSTITUTION_MIN: 15,
  STANDARD_INSTITUTION_MAX: 22,
  INTERNATIONAL_ORG_HOLD_DAYS: 15,
} as const;

export const INDIVIDUAL_ROLE_WEIGHTS: Record<string, number> = {
  'Artisans / Weavers': 0.44,
  'Youth Participants': 0.10,
  'Retailers': 0.07,
  'Students': 0.07,
  'Manufacturers': 0.07,
  'Exporters': 0.05,
  'Online Sellers': 0.05,
  'Researchers': 0.05,
  'Women Entrepreneurs': 0.05,
  'Tourism Stakeholders': 0.02,
  'Media Professionals': 0.01,
  'Diaspora Members': 0.01,
  'Political Representatives': 0.005,
  'International Buyers / Collectors': 0.003,
  'International Researchers': 0.002,
};

export const INSTITUTION_CATEGORY_WEIGHTS: Record<string, number> = {
  'Cooperative / Producer Group': 0.34,
  'Civil Society Organization': 0.20,
  'Heritage Organization': 0.15,
  'Financial Institution': 0.10,
  'University / Academic Institution': 0.08,
  'Government Department': 0.08,
  'International Organization / Development Agency': 0.03,
  'International Museum / Cultural Institution': 0.02,
};

export const DISTRICT_WEIGHTS: Record<string, number> = {
  Srinagar: 330,
  Anantnag: 92,
  Baramulla: 85,
  Budgam: 131,
  Bandipora: 62,
  Ganderbal: 69,
  Kulgam: 62,
  Kupwara: 38,
  Pulwama: 77,
  Shopian: 54,
};

const districtWeightTotal = Object.values(DISTRICT_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
export const NORMALIZED_DISTRICT_WEIGHTS = Object.fromEntries(
  Object.entries(DISTRICT_WEIGHTS).map(([district, weight]) => [district, weight / districtWeightTotal]),
) as Record<string, number>;

export const GLOBAL_INDIVIDUAL_ROLES = new Set([
  'Diaspora Members',
  'International Buyers / Collectors',
  'International Researchers',
]);

export const GLOBAL_INSTITUTION_CATEGORIES = new Set([
  'International Organization / Development Agency',
  'International Museum / Cultural Institution',
]);

export type EngagementLifecycleStatus = 'NOT_STARTED' | 'ACTIVE' | 'PAUSED' | 'CLOSED';

export interface EngagementLifecycle {
  stage: 'PUBLIC_PARTICIPATION';
  status: EngagementLifecycleStatus;
  startDate: string;
  endDate: string;
  calculationEndDate: string | null;
  accumulationEnabled: boolean;
}

export interface EngagementSnapshot {
  date: string;
  totalEngagement: number;
  approvedParticipantsCount: number;
  cumulativeIndividualEngagement: number;
  cumulativeInstitutionalEngagement: number;
  districtEligibleEngagement: number;
  dailyIndividualIncrement: number;
  weeklyInstitutionIncrement: number;
  roles: Record<string, number>;
  institutionCategories: Record<string, number>;
  districts: Record<string, number>;
  globalEngagement: number;
  composition: {
    women: number;
    youth: number;
    diaspora: number;
    politicalRepresentatives: number;
    governmentDepartments: number;
    universities: number;
  };
  lifecycle: EngagementLifecycle;
}

function mulberry32(seedValue: number) {
  let seed = seedValue;
  return function random() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getSeedFromString(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(index);
    hash |= 0;
  }
  return hash;
}

function getDeterministicInt(seed: string, min: number, max: number): number {
  const random = mulberry32(getSeedFromString(seed))();
  return Math.floor(random * (max - min + 1)) + min;
}

function assertWeightTotal(name: string, weights: Record<string, number>) {
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
  if (Math.abs(total - 1) > 0.000001) {
    throw new Error(`${name} weights must sum to 1. Received ${total}`);
  }
}

function normalizeEligibleWeights(
  weights: Record<string, number>,
  excluded: Set<string>,
): Record<string, number> {
  const eligibleEntries = Object.entries(weights).filter(([key]) => !excluded.has(key));
  const eligibleTotal = eligibleEntries.reduce((sum, [, weight]) => sum + weight, 0);
  if (eligibleTotal <= 0) throw new Error('No eligible engagement categories remain after gating');
  return Object.fromEntries(
    eligibleEntries.map(([key, weight]) => [key, weight / eligibleTotal]),
  );
}

function distributeExact(
  total: number,
  weights: Record<string, number>,
  tieBreakerSeed: string,
): Record<string, number> {
  const result: Record<string, number> = Object.fromEntries(Object.keys(weights).map((key) => [key, 0]));
  if (total <= 0) return result;

  const remainders: Array<{ key: string; remainder: number; tie: number }> = [];
  let allocated = 0;

  for (const [key, weight] of Object.entries(weights)) {
    const exact = total * weight;
    const integerPart = Math.floor(exact);
    result[key] = integerPart;
    allocated += integerPart;
    remainders.push({
      key,
      remainder: exact - integerPart,
      tie: getSeedFromString(`${tieBreakerSeed}:${key}`),
    });
  }

  remainders.sort((a, b) => {
    const remainderDiff = b.remainder - a.remainder;
    if (Math.abs(remainderDiff) > 0.0000001) return remainderDiff;
    return a.tie - b.tie;
  });

  const remaining = total - allocated;
  for (let index = 0; index < remaining; index += 1) {
    result[remainders[index % remainders.length].key] += 1;
  }

  return result;
}

function addDistribution(target: Record<string, number>, addition: Record<string, number>) {
  for (const [key, value] of Object.entries(addition)) {
    target[key] = (target[key] || 0) + value;
  }
}

function zeroDistribution(keys: string[]): Record<string, number> {
  return Object.fromEntries(keys.map((key) => [key, 0]));
}

export function getCanonicalDate(date: Date): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: CONFIG.TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;
  if (!year || !month || !day) throw new Error('Unable to resolve canonical SKC date');
  return `${year}-${month}-${day}`;
}

function dateOnlyToUTC(dateString: string): Date {
  return new Date(`${dateString}T00:00:00.000Z`);
}

function addDays(dateString: string, days: number): string {
  const date = dateOnlyToUTC(dateString);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function daysBetweenInclusive(startDate: string, endDate: string): number {
  const difference = dateOnlyToUTC(endDate).getTime() - dateOnlyToUTC(startDate).getTime();
  return Math.floor(difference / 86400000) + 1;
}

function resolveLifecycle(targetDate: string): EngagementLifecycle {
  const stage = AssessmentCycle2026.publicParticipation;
  const startDate = stage.actualStart || stage.plannedStart;
  const endDate = stage.actualEnd || stage.plannedEnd;

  if (!startDate || !endDate) {
    throw new Error('Public Participation must define an official start and end date');
  }

  if (targetDate < startDate) {
    return {
      stage: 'PUBLIC_PARTICIPATION',
      status: 'NOT_STARTED',
      startDate,
      endDate,
      calculationEndDate: null,
      accumulationEnabled: false,
    };
  }

  if (targetDate > endDate) {
    return {
      stage: 'PUBLIC_PARTICIPATION',
      status: 'CLOSED',
      startDate,
      endDate,
      calculationEndDate: stage.actualEnd || endDate,
      accumulationEnabled: false,
    };
  }

  if (stage.status === 'Closed' || stage.status === 'Completed') {
    return {
      stage: 'PUBLIC_PARTICIPATION',
      status: 'CLOSED',
      startDate,
      endDate,
      calculationEndDate: stage.actualEnd || targetDate,
      accumulationEnabled: false,
    };
  }

  if (stage.status === 'Open / In Progress') {
    return {
      stage: 'PUBLIC_PARTICIPATION',
      status: 'ACTIVE',
      startDate,
      endDate,
      calculationEndDate: targetDate,
      accumulationEnabled: true,
    };
  }

  return {
    stage: 'PUBLIC_PARTICIPATION',
    status: 'PAUSED',
    startDate,
    endDate,
    calculationEndDate: null,
    accumulationEnabled: false,
  };
}

function getIndividualRange(participationDay: number): { min: number; max: number } {
  if (participationDay <= CONFIG.SOFT_LAUNCH_DAYS) {
    return {
      min: CONFIG.SOFT_LAUNCH_INDIVIDUAL_MIN,
      max: CONFIG.SOFT_LAUNCH_INDIVIDUAL_MAX,
    };
  }
  return {
    min: CONFIG.STANDARD_INDIVIDUAL_MIN,
    max: CONFIG.STANDARD_INDIVIDUAL_MAX,
  };
}

function getInstitutionWindowIndex(participationDay: number): number {
  if (participationDay <= CONFIG.SOFT_LAUNCH_DAYS) return 0;
  return 1 + Math.floor((participationDay - (CONFIG.SOFT_LAUNCH_DAYS + 1)) / 7);
}

function getInstitutionWindowStartDay(windowIndex: number): number {
  if (windowIndex === 0) return 1;
  return CONFIG.SOFT_LAUNCH_DAYS + 1 + ((windowIndex - 1) * 7);
}

function getInstitutionRange(windowIndex: number): { min: number; max: number } {
  if (windowIndex === 0) {
    return {
      min: CONFIG.SOFT_LAUNCH_INSTITUTION_MIN,
      max: CONFIG.SOFT_LAUNCH_INSTITUTION_MAX,
    };
  }
  return {
    min: CONFIG.STANDARD_INSTITUTION_MIN,
    max: CONFIG.STANDARD_INSTITUTION_MAX,
  };
}

function getInstitutionWeightsForWindow(windowStartDay: number): Record<string, number> {
  const excluded = new Set<string>();
  if (windowStartDay <= CONFIG.INTERNATIONAL_ORG_HOLD_DAYS) {
    excluded.add('International Organization / Development Agency');
  }
  return normalizeEligibleWeights(INSTITUTION_CATEGORY_WEIGHTS, excluded);
}

function makeEmptySnapshot(targetDate: string, lifecycle: EngagementLifecycle): EngagementSnapshot {
  return {
    date: targetDate,
    totalEngagement: 0,
    cumulativeIndividualEngagement: 0,
    cumulativeInstitutionalEngagement: 0,
    districtEligibleEngagement: 0,
    dailyIndividualIncrement: 0,
    weeklyInstitutionIncrement: 0,
    roles: zeroDistribution(Object.keys(INDIVIDUAL_ROLE_WEIGHTS)),
    institutionCategories: zeroDistribution(Object.keys(INSTITUTION_CATEGORY_WEIGHTS)),
    districts: zeroDistribution(Object.keys(DISTRICT_WEIGHTS)),
    globalEngagement: 0,
    composition: {
      women: 0,
      youth: 0,
      diaspora: 0,
      politicalRepresentatives: 0,
      governmentDepartments: 0,
      universities: 0,
    },
    lifecycle,
  };
}

assertWeightTotal('Individual role', INDIVIDUAL_ROLE_WEIGHTS);
assertWeightTotal('Institution category', INSTITUTION_CATEGORY_WEIGHTS);
assertWeightTotal('District', NORMALIZED_DISTRICT_WEIGHTS);

export function generateEngagementSnapshot(targetDate: Date = new Date()): EngagementSnapshot {
  const targetCanonicalDate = getCanonicalDate(targetDate);
  const lifecycle = resolveLifecycle(targetCanonicalDate);

  if (lifecycle.status === 'NOT_STARTED' || lifecycle.status === 'PAUSED' || !lifecycle.calculationEndDate) {
    return makeEmptySnapshot(targetCanonicalDate, lifecycle);
  }

  const aggregatedRoles = zeroDistribution(Object.keys(INDIVIDUAL_ROLE_WEIGHTS));
  const aggregatedInstitutions = zeroDistribution(Object.keys(INSTITUTION_CATEGORY_WEIGHTS));
  const aggregatedDistricts = zeroDistribution(Object.keys(DISTRICT_WEIGHTS));

  let cumulativeIndividual = 0;
  let cumulativeInstitution = 0;
  let globalIndividual = 0;
  let globalInstitution = 0;
  let todayIndividualIncrement = 0;
  let currentInstitutionWindowIncrement = 0;

  const processedInstitutionWindows = new Set<number>();
  let currentDate = lifecycle.startDate;

  while (currentDate <= lifecycle.calculationEndDate) {
    const participationDay = daysBetweenInclusive(lifecycle.startDate, currentDate);
    const dailyRange = getIndividualRange(participationDay);
    const dailySeed = `SKC2026:ENGAGEMENT:${currentDate}:${CONFIG.ENGINE_VERSION}`;
    const dailyIncrement = getDeterministicInt(dailySeed, dailyRange.min, dailyRange.max);

    cumulativeIndividual += dailyIncrement;
    if (currentDate === targetCanonicalDate && lifecycle.status === 'ACTIVE') {
      todayIndividualIncrement = dailyIncrement;
    }

    const dailyRoles = distributeExact(
      dailyIncrement,
      INDIVIDUAL_ROLE_WEIGHTS,
      `${dailySeed}:ROLES`,
    );
    addDistribution(aggregatedRoles, dailyRoles);

    const districtEligibleIndividuals = Object.entries(dailyRoles)
      .filter(([role]) => !GLOBAL_INDIVIDUAL_ROLES.has(role))
      .reduce((sum, [, value]) => sum + value, 0);
    globalIndividual += dailyIncrement - districtEligibleIndividuals;

    const dailyDistricts = distributeExact(
      districtEligibleIndividuals,
      NORMALIZED_DISTRICT_WEIGHTS,
      `${dailySeed}:DISTRICTS`,
    );
    addDistribution(aggregatedDistricts, dailyDistricts);

    const institutionWindowIndex = getInstitutionWindowIndex(participationDay);
    if (!processedInstitutionWindows.has(institutionWindowIndex)) {
      processedInstitutionWindows.add(institutionWindowIndex);
      const windowStartDay = getInstitutionWindowStartDay(institutionWindowIndex);
      const windowStartDate = addDays(lifecycle.startDate, windowStartDay - 1);
      const institutionRange = getInstitutionRange(institutionWindowIndex);
      const institutionSeed = `SKC2026:INSTITUTIONAL:WINDOW-${institutionWindowIndex}:${windowStartDate}:${CONFIG.ENGINE_VERSION}`;
      const institutionIncrement = getDeterministicInt(
        institutionSeed,
        institutionRange.min,
        institutionRange.max,
      );

      cumulativeInstitution += institutionIncrement;
      if (institutionWindowIndex === getInstitutionWindowIndex(daysBetweenInclusive(lifecycle.startDate, lifecycle.calculationEndDate))) {
        currentInstitutionWindowIncrement = institutionIncrement;
      }

      const eligibleInstitutionWeights = getInstitutionWeightsForWindow(windowStartDay);
      const eligibleDistribution = distributeExact(
        institutionIncrement,
        eligibleInstitutionWeights,
        `${institutionSeed}:CATEGORIES`,
      );
      const institutionDistribution = zeroDistribution(Object.keys(INSTITUTION_CATEGORY_WEIGHTS));
      addDistribution(institutionDistribution, eligibleDistribution);
      addDistribution(aggregatedInstitutions, institutionDistribution);

      const districtEligibleInstitutions = Object.entries(institutionDistribution)
        .filter(([category]) => !GLOBAL_INSTITUTION_CATEGORIES.has(category))
        .reduce((sum, [, value]) => sum + value, 0);
      globalInstitution += institutionIncrement - districtEligibleInstitutions;

      const institutionDistricts = distributeExact(
        districtEligibleInstitutions,
        NORMALIZED_DISTRICT_WEIGHTS,
        `${institutionSeed}:DISTRICTS`,
      );
      addDistribution(aggregatedDistricts, institutionDistricts);
    }

    currentDate = addDays(currentDate, 1);
  }

  const totalEngagement = cumulativeIndividual + cumulativeInstitution;
  const globalEngagement = globalIndividual + globalInstitution;
  
  // Approve 3% of total stakeholder engagement
  const approvedParticipantsCount = Math.floor(totalEngagement * 0.03);

  const districtEligibleEngagement = Object.values(aggregatedDistricts).reduce((sum, value) => sum + value, 0);
  // (Removed Citizens manual override as requested)

  const roleSum = Object.values(aggregatedRoles).reduce((sum, value) => sum + value, 0);
  const institutionSum = Object.values(aggregatedInstitutions).reduce((sum, value) => sum + value, 0);


  if (institutionSum !== cumulativeInstitution) {
    throw new Error('SKC engagement reconciliation failed: institution category sum does not equal institution total');
  }
  if (districtEligibleEngagement + globalEngagement !== totalEngagement) {
    throw new Error('SKC engagement reconciliation failed: district + global does not equal total');
  }

  return {
    date: targetCanonicalDate,
    totalEngagement,
    approvedParticipantsCount,
    cumulativeIndividualEngagement: cumulativeIndividual,
    cumulativeInstitutionalEngagement: cumulativeInstitution,
    districtEligibleEngagement,
    dailyIndividualIncrement: todayIndividualIncrement,
    weeklyInstitutionIncrement: lifecycle.status === 'ACTIVE' ? currentInstitutionWindowIncrement : 0,
    roles: aggregatedRoles,
    institutionCategories: aggregatedInstitutions,
    districts: aggregatedDistricts,
    globalEngagement,
    composition: {
      women: aggregatedRoles['Women Entrepreneurs'] || 0,
      youth: aggregatedRoles['Youth Participants'] || 0,
      diaspora: aggregatedRoles['Diaspora Members'] || 0,
      politicalRepresentatives: aggregatedRoles['Political Representatives'] || 0,
      governmentDepartments: aggregatedInstitutions['Government Department'] || 0,
      universities: aggregatedInstitutions['University / Academic Institution'] || 0,
    },
    lifecycle,
  };
}
