import { rawDataAM } from './dataAM';
import { rawDataNZ } from './dataNZ';
import { rawDataExtra } from './dataExtra';
import { workshopData } from './dataWorkshop';
import { toolsData } from './dataTools';
import { materialsData } from './dataMaterials';
import { motifsData } from './dataMotifs';
import { rolesData } from './dataRoles';
import { tradeData } from './dataTrade';
import { craftsData } from './dataCrafts';
import { productsData } from './dataProducts';

export type FieldValidationStatus = 'Verified' | 'Field Verified' | 'Requires Field Validation' | 'Historical / Archival' | 'Archival Term' | 'Technical Reference' | 'Trade Usage';
export type GlossaryType = 'Term' | 'Material' | 'Technique' | 'Tool' | 'Motif' | 'Artisan Role' | 'Workshop Term' | 'Certification' | 'Trade' | 'Conservation' | 'Craft' | 'Product';

export interface GlossaryEntry {
  term: string;
  type: GlossaryType;
  craftCategory: string;
  definition: string;
  traditionalUsage: string;
  technicalMeaning: string;
  relatedTerms: string[];
  exampleUsage: string;
  validationStatus: FieldValidationStatus;
  // Optional Workshop Term fields
  localSpellingVariants?: string;
  workshopMeaning?: string;
  whoUsesIt?: string;
  whereItIsUsed?: string;
  sourceType?: string;
  // Optional Tool fields
  material?: string;
  relatedTechnique?: string;
  // Optional Motif fields
  symbolicMeaning?: string;
  commonPlacement?: string;
  historicalInfluence?: string;
  // Optional Artisan Role fields
  stageOfProduction?: string;
  skillsRequired?: string;
  toolsUsed?: string;
  apprenticeshipPathway?: string;
  // Optional Trade fields
  useInTransaction?: string;
  relatedDocument?: string;
  riskConcern?: string;
  relatedCertification?: string;
  // Optional Craft fields
  craftType?: string;
  primaryMaterials?: string;
  coreTechniques?: string;
  artisanRoles?: string;
  commonMotifs?: string;
  productForms?: string;
  productionStages?: string;
  clusterRegion?: string;
  giCertificationStatus?: string;
  authenticityRisks?: string;
  // Optional Product fields
  productType?: string;
  commonSizes?: string;
  qualityIndicators?: string;
}

const parseRawData = (dataArray: string[]): GlossaryEntry[] => {
  return dataArray.map(line => {
    const parts = line.split('|');
    return {
      term: parts[0],
      type: parts[1] as GlossaryType,
      craftCategory: parts[2],
      definition: parts[3],
      traditionalUsage: parts[4],
      technicalMeaning: parts[5],
      relatedTerms: parts[6] ? parts[6].split(',') : [],
      exampleUsage: parts[7],
      validationStatus: parts[8] as FieldValidationStatus,
    };
  });
};

export const glossaryData: GlossaryEntry[] = [
  ...parseRawData(rawDataAM),
  ...parseRawData(rawDataNZ),
  ...parseRawData(rawDataExtra),
  ...workshopData,
  ...toolsData,
  ...materialsData,
  ...motifsData,
  ...rolesData,
  ...tradeData,
  ...craftsData,
  ...productsData
];
