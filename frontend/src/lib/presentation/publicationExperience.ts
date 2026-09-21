export interface PublicationSection {
  id: string;
  label: string;
}

export interface ColophonField {
  label: string;
  value: string | number;
}

export interface ContentPreviewEntry {
  order: string;
  title: string;
  publicSummary: string;
  contentType?: string;
}

export interface ContextModule {
  title: string;
  content: string;
}

export interface PublicOverview {
  about: string;
  premise?: string;
  scope?: string;
  themes?: string[];
  editorialNote?: string;
}

export interface PublicationExperienceDTO {
  contentState: 'COMPLETE' | 'PUBLIC_CONTENT_INCOMPLETE';
  typeLabel: string;
  aboutLabel: string;
  accessVerb: string;
  hasOverview: boolean;
  hasContext: boolean;
  hasContents: boolean;
  hasMetadata: boolean;
  sections: PublicationSection[];
  colophonMetadata: ColophonField[];
  publicOverview: PublicOverview | null;
  contextModules: ContextModule[];
  contentsPreview: ContentPreviewEntry[];
}

export function resolvePublicationExperience(issue: any): PublicationExperienceDTO {
  // Determine Type Label
  let typeLabel = issue.issueOverview || 'Quarterly Review';
  if (typeLabel.toUpperCase() === 'MASTER ARTISAN DOSSIER') {
    typeLabel = 'Artisan Dossier';
  }

  // Determine Terminology
  let aboutLabel = 'About This Publication';
  let accessVerb = 'Read Publication';

  if (typeLabel.includes('Dossier')) {
    aboutLabel = 'About This Dossier';
    accessVerb = 'Read Dossier';
  } else if (typeLabel.includes('Monograph')) {
    aboutLabel = 'About This Monograph';
    accessVerb = 'Read Monograph';
  } else if (typeLabel.includes('Edition')) {
    aboutLabel = 'About This Edition';
    accessVerb = 'Read Edition';
  } else if (typeLabel.includes('Quarterly')) {
    aboutLabel = 'About This Issue';
    accessVerb = 'Read Issue';
  }

  // Resolve Content Presence (Content-Aware Degradation)
  // Map Canonical Rich Data Fields (Strict mapping, NO fallbacks)
  const publicOverview: PublicOverview | null = issue.publicOverview || null;
  const contextModules: ContextModule[] = issue.contextModules || [];
  const contentsPreview: ContentPreviewEntry[] = issue.contentsPreview || [];

  const hasOverview = !!publicOverview && !!publicOverview.about;
  const hasContext = contextModules.length > 0;
  const hasContents = contentsPreview.length > 0;
  
  const contentState = (hasOverview && hasContext && hasContents) ? 'COMPLETE' : 'PUBLIC_CONTENT_INCOMPLETE';
  // Resolve Metadata Fields (Type-Aware Metadata)
  const colophonMetadata: ColophonField[] = [];
  colophonMetadata.push({ label: 'PUBLICATION', value: 'KHCRF Magazine' });
  colophonMetadata.push({ label: 'TYPE', value: typeLabel });
  
  if (issue.edition && typeof issue.edition === 'string' && issue.edition.trim() !== '') {
    colophonMetadata.push({ label: 'EDITION', value: issue.edition });
  }

  if (issue.issueNumber) {
    const idLabel = typeLabel.includes('Dossier') ? 'DOSSIER NUMBER' : 'ISSUE NUMBER';
    colophonMetadata.push({ label: idLabel, value: issue.issueNumber });
  }

  // Resolve Year
  if (issue.publishedAt && typeof issue.publishedAt === 'string') {
    const year = new Date(issue.publishedAt).getFullYear();
    if (!isNaN(year)) colophonMetadata.push({ label: 'YEAR', value: year });
  } else if (issue.edition && typeof issue.edition === 'string') {
    const parts = issue.edition.trim().split(' ');
    if (parts.length > 1 && !isNaN(Number(parts[1]))) {
      colophonMetadata.push({ label: 'YEAR', value: parts[1] });
    } else if (!isNaN(Number(parts[0]))) {
      colophonMetadata.push({ label: 'YEAR', value: parts[0] });
    }
  }

  colophonMetadata.push({ label: 'LANGUAGE', value: 'English' });

  if (publicOverview?.themes?.length) {
    colophonMetadata.push({ label: 'PRIMARY THEMES', value: publicOverview.themes.join(' · ') });
  }

  colophonMetadata.push({ label: 'PUBLISHER', value: 'Kashmir Hamadan Craft Revival Foundation' });

  const hasMetadata = colophonMetadata.length > 0;

  // Dynamically Generate Navigation Sections
  const sections: PublicationSection[] = [];
  if (hasOverview) sections.push({ id: 'overview', label: 'Overview' });
  if (hasContext) sections.push({ id: 'context', label: 'Context' });
  if (hasContents) sections.push({ id: 'contents', label: 'Contents' });
  if (hasMetadata) sections.push({ id: 'publication', label: 'Publication' });
  sections.push({ id: 'membership', label: 'Membership' }); // Access gate is universal

  return {
    typeLabel,
    aboutLabel,
    accessVerb,
    hasOverview,
    hasContents,
    hasContext,
    hasMetadata,
    sections,
    colophonMetadata,
    publicOverview,
    contextModules,
    contentsPreview,
    contentState
  };
}
