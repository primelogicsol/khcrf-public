export interface EvidenceMetadata {
  filename?: string;
  originalName?: string;
  fileType?: string;
  size?: number;
  url?: string;
  evidenceCategory?: string;
  uploadTimestamp?: string;
  [key: string]: any;
}

export interface RawConsultationData {
  participantName?: string;
  name?: string;
  [key: string]: any;
}

export interface NormalizedConsultation {
  id: string;
  consultationId: string;
  shortId: string;
  
  // Normalized Display Strings
  displayName: string;
  displayDistrict: string;
  displayCraft: string;
  displayStakeholderType: string;
  displayConfidenceLevel: string;
  
  intelligenceScore: number;
  evidenceCount: number;
  
  status: string;
  internalNotes: string;
  
  submittedAt: string;
  submittedDateFormatted: string;
  
  inferredThemes: string[];
  inferredTags: string[];
  aiNarrative: string;
  governmentRecommendation: string;
  industryRecommendation: string;
  
  qualityIndicators: any;
  graphNodes: any[];
  graphEdges: any[];
  
  evidenceMetadata: EvidenceMetadata[];
  rawConsultationData: RawConsultationData;
  
  // Computed Workflow Readiness
  readyForDraft: boolean;
  readyForValidation: boolean;
  readyForFinalReport: boolean;
  missingEvidence: boolean;
  needsClarification: boolean;
  highPolicyValue: boolean;
  
  // Original properties
  original: any;
}

/**
 * Normalizes raw consultation data from the backend into a consistent frontend object.
 * Applies defensive fallbacks to all fields.
 */
export function normalizeConsultation(raw: any): NormalizedConsultation {
  if (!raw) raw = {};
  
  const rawData = raw.rawConsultationData || {};
  const rawName = rawData.participantName || rawData.name || rawData.profile?.fullName;
  
  return {
    id: raw.id || '',
    consultationId: raw.consultationId || '',
    shortId: (raw.consultationId && typeof raw.consultationId === 'string' && raw.consultationId.includes('-')) 
      ? raw.consultationId.split('-')[1] 
      : (raw.id ? String(raw.id).substring(0, 8) : 'Unknown'),
      
    displayName: rawName ? String(rawName) : 'Anonymous / Not Provided',
    displayDistrict: raw.district ? String(raw.district) : 'Unknown District',
    displayCraft: raw.craft ? String(raw.craft) : 'Unknown Craft',
    displayStakeholderType: raw.participantType || raw.stakeholderType || 'Unknown Stakeholder',
    displayConfidenceLevel: raw.confidenceLevel || 'Not Scored',
    
    intelligenceScore: typeof raw.intelligenceScore === 'number' ? raw.intelligenceScore : 0,
    evidenceCount: typeof raw.evidenceCount === 'number' ? raw.evidenceCount : 0,
    
    status: raw.status || 'RECEIVED',
    internalNotes: raw.internalNotes || '',
    
    submittedAt: raw.createdAt || new Date().toISOString(),
    submittedDateFormatted: new Date(raw.createdAt || new Date()).toLocaleDateString(),
    
    inferredThemes: Array.isArray(raw.inferredThemes) && raw.inferredThemes.length > 0 
      ? raw.inferredThemes 
      : [],
    inferredTags: Array.isArray(raw.inferredTags) && raw.inferredTags.length > 0 
      ? raw.inferredTags 
      : [],
    aiNarrative: raw.aiNarrative || 'No narrative generated.',
    
    governmentRecommendation: raw.governmentRecommendation || '',
    industryRecommendation: raw.industryRecommendation || '',
    
    qualityIndicators: raw.qualityIndicators || {},
    graphNodes: Array.isArray(raw.graphNodes) ? raw.graphNodes : [],
    graphEdges: Array.isArray(raw.graphEdges) ? raw.graphEdges : [],
    
    evidenceMetadata: Array.isArray(raw.evidenceMetadata) ? raw.evidenceMetadata : [],
    rawConsultationData: rawData,
    
    // Computed Readiness
    readyForDraft: (raw.status === 'VERIFIED' || raw.status === 'USED_IN_DRAFT' || raw.status === 'VALIDATED' || raw.status === 'USED_IN_FINAL_REPORT') && (typeof raw.evidenceCount === 'number' && raw.evidenceCount > 0),
    readyForValidation: (raw.status === 'USED_IN_DRAFT' || raw.status === 'VALIDATED' || raw.status === 'USED_IN_FINAL_REPORT'),
    readyForFinalReport: (raw.status === 'VALIDATED' || raw.status === 'USED_IN_FINAL_REPORT'),
    missingEvidence: typeof raw.evidenceCount !== 'number' || raw.evidenceCount === 0,
    needsClarification: raw.status === 'NEEDS_CLARIFICATION',
    highPolicyValue: raw.qualityIndicators?.insights?.policyPriority === 'HIGH',
    
    original: raw
  };
}

export function normalizeConsultationList(rawList: any[]): NormalizedConsultation[] {
  if (!Array.isArray(rawList)) return [];
  return rawList.map(normalizeConsultation);
}
