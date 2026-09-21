import { StudioEntity } from '../services/canonicalStudio';

export interface StudioSection {
  id: string;
  label: string;
}

export interface StudioColophonField {
  label: string;
  value: string | number;
}

export interface StudioExperienceDTO {
  typeLabel: string;
  publicCTA: string;
  protectedCTA: string;
  cinematicRatio: string;
  
  hasOverview: boolean;
  hasContext: boolean;
  hasContent: boolean;
  hasRecord: boolean;
  
  sections: StudioSection[];
  colophonMetadata: StudioColophonField[];
  
  publicOverview: StudioEntity['publicOverview'] | null;
  contextModules: StudioEntity['contextModules'];
  contentPreview: StudioEntity['contentPreview'];
  
  contentState: 'COMPLETE' | 'PUBLIC_CONTENT_INCOMPLETE';
}

export function resolveStudioExperience(record: StudioEntity): StudioExperienceDTO {
  // Determine Type Label and Ratio
  let typeLabel = 'Studio Record';
  let cinematicRatio = 'aspect-video'; // 16:9 default
  let publicCTA = 'VIEW PREVIEW';
  let protectedCTA = 'VIEW FULL RECORD';
  
  switch (record.studioType) {
    case 'DOCUMENTARY_FILM':
      typeLabel = 'Documentary Film';
      cinematicRatio = 'aspect-[2.2/1]';
      publicCTA = 'WATCH PREVIEW';
      protectedCTA = 'WATCH FULL DOCUMENTARY';
      break;
    case 'VIDEO_INTERVIEW':
      typeLabel = 'Video Interview';
      cinematicRatio = 'aspect-video';
      publicCTA = 'WATCH PREVIEW';
      protectedCTA = 'WATCH FULL INTERVIEW';
      break;
    case 'ORAL_HISTORY':
      typeLabel = 'Oral History';
      cinematicRatio = 'aspect-[4/5]'; // Audio-first portrait style
      publicCTA = 'LISTEN TO PREVIEW';
      protectedCTA = 'LISTEN TO COMPLETE ORAL HISTORY';
      break;
    case 'WORKSHOP':
      typeLabel = 'Workshop Documentation';
      cinematicRatio = 'aspect-[3/2]';
      publicCTA = 'EXPLORE WORKSHOP';
      protectedCTA = 'ENTER FULL WORKSHOP RECORD';
      break;
    case 'CRAFT_DEMONSTRATION':
      typeLabel = 'Craft Demonstration';
      cinematicRatio = 'aspect-video';
      publicCTA = 'WATCH PREVIEW';
      protectedCTA = 'VIEW COMPLETE DEMONSTRATION';
      break;
  }

  // Enforce strict content readiness
  const publicOverview = record.publicOverview || null;
  const contextModules = record.contextModules || [];
  const contentPreview = record.contentPreview || [];

  const hasOverview = !!publicOverview && !!publicOverview.synopsis;
  const hasContext = contextModules.length > 0;
  const hasContent = contentPreview.length > 0;
  
  const contentState = (hasOverview && hasContext && hasContent) ? 'COMPLETE' : 'PUBLIC_CONTENT_INCOMPLETE';

  // Build the Studio Record Colophon (The Archival Slate)
  const colophonMetadata: StudioColophonField[] = [];
  colophonMetadata.push({ label: 'RECORD TYPE', value: typeLabel });
  if (record.id) colophonMetadata.push({ label: 'RECORD ID', value: record.id });
  
  // const craftStr = null;
  // if (craftStr)...
  
  if (record.location) colophonMetadata.push({ label: 'LOCATION', value: record.location });
  if (record.duration) colophonMetadata.push({ label: 'DURATION', value: record.duration });
  if (record.language) colophonMetadata.push({ label: 'LANGUAGE', value: record.language });
  if (record.transcriptAvailable) colophonMetadata.push({ label: 'TRANSCRIPT', value: 'Available' });
  if (record.recordedYear) colophonMetadata.push({ label: 'RECORDED', value: record.recordedYear });
  
  colophonMetadata.push({ label: 'DOCUMENTING INSTITUTION', value: 'Kashmir Hamadan Craft Revival Foundation' });

  const hasRecord = colophonMetadata.length > 0;

  // Build the universal tab navigation
  const sections: StudioSection[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'context', label: 'Context' },
    { id: 'content', label: 'Content' },
    { id: 'record', label: 'Record' },
    { id: 'access', label: 'Access' }
  ];

  return {
    typeLabel,
    publicCTA,
    protectedCTA,
    cinematicRatio,
    hasOverview,
    hasContext,
    hasContent,
    hasRecord,
    sections,
    colophonMetadata,
    publicOverview,
    contextModules,
    contentPreview,
    contentState
  };
}


