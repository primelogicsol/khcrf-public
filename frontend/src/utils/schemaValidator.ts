/**
 * KHCRF Importer Schema Validator & Migration Adapters
 * Version: v1
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  normalizedData: any;
}

// ─── 1. SEO INTEL SCHEMA (hcrf_seo_v1) ──────────────────────────────────────
const SEO_KEYS = ['seoTitle', 'seoDescription', 'seoKeywords', 'canonicalUrl', 'structuredDataType', 'seoFaq', 'ogImageUrl', 'twitterCard'];

export function validateSeoSchema(json: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const normalized: any = {};

  if (!json || typeof json !== 'object') {
    return { isValid: false, errors: ['Invalid JSON object structure'], warnings: [], normalizedData: null };
  }

  // Required properties (At least one must exist)
  const incomingKeys = Object.keys(json);
  const matchedSeoKeys = incomingKeys.filter(k => SEO_KEYS.includes(k) || [
    'seo_title', 'seo_description', 'seo_keywords', 'canonical_url', 'structured_data_type', 'seo_faq', 'og_image_url', 'twitter_card'
  ].includes(k));

  if (matchedSeoKeys.length === 0) {
    errors.push('No recognized SEO metadata keys found in file.');
  }

  // Legacy mappings & normalization
  normalized.seoTitle = json.seoTitle || json.seo_title || "";
  normalized.seoDescription = json.seoDescription || json.seo_description || "";
  normalized.seoKeywords = json.seoKeywords || json.seo_keywords || "";
  normalized.canonicalUrl = json.canonicalUrl || json.canonical_url || "";
  normalized.structuredDataType = json.structuredDataType || json.structured_data_type || "Book";
  normalized.seoFaq = json.seoFaq || json.seo_faq || "";
  normalized.ogImageUrl = json.ogImageUrl || json.og_image_url || "";
  normalized.twitterCard = json.twitterCard || json.twitter_card || "Summary Large Image";

  // Check for unknown fields
  incomingKeys.forEach(k => {
    const isStandard = SEO_KEYS.includes(k);
    const isLegacy = ['seo_title', 'seo_description', 'seo_keywords', 'canonical_url', 'structured_data_type', 'seo_faq', 'og_image_url', 'twitter_card'].includes(k);
    if (!isStandard && !isLegacy) {
      warnings.push(`Ignored unknown/unsupported SEO key: "${k}"`);
    } else if (isLegacy) {
      warnings.push(`Legacy format key detected and migrated: "${k}" → "${SEO_KEYS.find(sk => sk.toLowerCase() === k.replace(/_/g, '').toLowerCase())}"`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    normalizedData: normalized
  };
}

// ─── 2. AI CITATION SCHEMA (hcrf_ai_citation_v1) ────────────────────────────
const AI_KEYS = ['aiSummary', 'structuredFacts', 'definitions', 'entitiesMatched', 'knowledgeNodesList', 'qaPairs'];

export function validateAiSchema(json: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const normalized: any = {};

  if (!json || typeof json !== 'object') {
    return { isValid: false, errors: ['Invalid JSON object structure'], warnings: [], normalizedData: null };
  }

  // Required baseline fields
  if (!json.aiSummary && !json.ai_summary) {
    errors.push('Missing required base field: "aiSummary" / "ai_summary"');
  }

  normalized.aiSummary = json.aiSummary || json.ai_summary || "";
  normalized.entitiesMatched = json.entitiesMatched || json.entities_matched || "";
  normalized.knowledgeNodesList = json.knowledgeNodesList || json.knowledge_nodes_list || "";

  // Normalize structured facts
  let rawFacts = json.structuredFacts || json.structured_facts || [];
  if (typeof rawFacts === 'string') {
    try { rawFacts = JSON.parse(rawFacts); } catch { rawFacts = []; }
  }
  normalized.structuredFacts = Array.isArray(rawFacts) ? rawFacts : [];

  // Normalize Glossary/Definitions
  let rawDefs = json.definitions || json.glossary || [];
  if (typeof rawDefs === 'string') {
    try { rawDefs = JSON.parse(rawDefs); } catch { rawDefs = []; }
  }
  normalized.definitions = Array.isArray(rawDefs) ? rawDefs : [];

  // Normalize Q&A Pairs
  let rawQa = json.qaPairs || json.qa_pairs || [];
  if (typeof rawQa === 'string') {
    try { rawQa = JSON.parse(rawQa); } catch { rawQa = []; }
  }
  normalized.qaPairs = Array.isArray(rawQa) ? rawQa : [];

  // Check for unknown keys
  Object.keys(json).forEach(k => {
    const isStandard = AI_KEYS.includes(k);
    const isLegacy = ['ai_summary', 'structured_facts', 'entities_matched', 'knowledge_nodes_list', 'qa_pairs', 'glossary'].includes(k);
    if (!isStandard && !isLegacy) {
      warnings.push(`Ignored unknown/unsupported AI key: "${k}"`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    normalizedData: normalized
  };
}

// ─── 3. KNOWLEDGE GRAPH SCHEMA (hcrf_knowledge_graph_v1) ──────────────────────
export function validateKgSchema(json: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const normalized: any = { nodes: [] };

  if (!json || typeof json !== 'object') {
    return { isValid: false, errors: ['Invalid JSON object structure'], warnings: [], normalizedData: null };
  }

  const nodes = json.nodes || json.graphNodes || json.knowledge_graph || json.nodesList;
  if (!nodes || !Array.isArray(nodes)) {
    errors.push('Missing array list payload container: "nodes"');
    return { isValid: false, errors, warnings, normalizedData: null };
  }

  nodes.forEach((n: any, index: number) => {
    if (!n.name) {
      errors.push(`Node index [${index}] is missing required property "name"`);
      return;
    }
    const normalizedNode = {
      id: n.id || `n_${Date.now()}_${index}`,
      entityType: n.entityType || n.entity_type || 'Craft',
      name: n.name,
      relationship: n.relationship || n.relationship_type || 'Related To',
      confidence: n.confidence !== undefined ? Number(n.confidence) : 85,
      notes: n.notes || ""
    };
    normalized.nodes.push(normalizedNode);
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    normalizedData: normalized
  };
}

// ─── 4. METADATA SCHEMA (hcrf_metadata_v1) ──────────────────────────────────
const METADATA_KEYS = [
  'title', 'subtitle', 'series', 'volume', 'issue', 'isbn', 'doi',
  'publisher', 'edition', 'publicationType', 'publishedStatus', 'language', 'published', 'slug'
];
export function validateMetadataSchema(json: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const normalized: any = {};

  if (!json || typeof json !== 'object') {
    return { isValid: false, errors: ['Invalid JSON object structure'], warnings: [], normalizedData: null };
  }

  if (!json.title && !json.publication_title && !json.publicationTitle) {
    errors.push('Missing required property: "title"');
  }

  normalized.title = json.title || json.publication_title || json.publicationTitle || "";
  normalized.subtitle = json.subtitle || json.sub_title || "";
  normalized.series = json.series || json.series_name || "";
  normalized.volume = json.volume || "";
  normalized.issue = json.issue || "";
  normalized.isbn = json.isbn || "";
  normalized.doi = json.doi || "";
  normalized.publisher = json.publisher || json.publisher_name || "";
  normalized.edition = json.edition || "";
  normalized.publicationType = json.publicationType || json.publication_type || "";
  normalized.publishedStatus = json.publishedStatus || json.publish_status || "";
  normalized.language = json.language || "";
  normalized.published = json.published || json.publication_year || json.year || "";
  normalized.slug = json.slug || json.url_slug || "";

  Object.keys(json).forEach(k => {
    const isStandard = METADATA_KEYS.includes(k);
    const isLegacy = [
      'publication_title', 'publicationTitle', 'sub_title', 'series_name', 'publisher_name',
      'publication_type', 'publish_status', 'publication_year', 'year', 'url_slug'
    ].includes(k);
    if (!isStandard && !isLegacy) {
      warnings.push(`Ignored unknown Metadata key: "${k}"`);
    }
  });

  return { isValid: errors.length === 0, errors, warnings, normalizedData: normalized };
}

// ─── 5. CLASSIFICATION SCHEMA (hcrf_classification_v1) ──────────────────────
const CLASSIFICATION_KEYS = ['craftSector', 'domain', 'knowledgeDomain', 'audience', 'region'];
export function validateClassificationSchema(json: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const normalized: any = {};

  if (!json || typeof json !== 'object') {
    return { isValid: false, errors: ['Invalid JSON object structure'], warnings: [], normalizedData: null };
  }

  normalized.craftSector = json.craftSector || json.craft_sector || "";
  normalized.domain = json.domain || json.knowledgeDomain || json.knowledge_domain || "";
  normalized.audience = json.audience || "";
  normalized.region = json.region || "";

  Object.keys(json).forEach(k => {
    const isStandard = CLASSIFICATION_KEYS.includes(k);
    const isLegacy = ['craft_sector', 'knowledge_domain', 'knowledgeDomain'].includes(k);
    if (!isStandard && !isLegacy) {
      warnings.push(`Ignored unknown Classification key: "${k}"`);
    }
  });

  return { isValid: errors.length === 0, errors, warnings, normalizedData: normalized };
}

// ─── 6. CONTRIBUTORS SCHEMA (hcrf_contributors_v1) ─────────────────────────

export function normalizeContributorRole(role: string): string {
  const r = String(role).toLowerCase().trim().replace(/_/g, '-').replace(/\s+/g, '-');
  
  if (['lead-author', 'lead', 'author'].includes(r)) return 'Lead Author';
  if (['co-authors', 'co-author', 'coauthor'].includes(r)) return 'Co-Author';
  if (r === 'corresponding-author') return 'Corresponding Author';
  if (r === 'contributing-author') return 'Contributing Author';
  if (['academic-institution', 'institution', 'academic_institution'].includes(r)) return 'Academic Institution';
  if (['research-team', 'team', 'research_team'].includes(r)) return 'Research Team';
  if (['technical-editor', 'editor', 'technical_editor'].includes(r)) return 'Technical Editor';
  if (['peer-reviewer', 'reviewer', 'peer_reviewer'].includes(r)) return 'Peer Reviewer';
  if (['field-contributors', 'field-contributor', 'field_contributors', 'master-artisan', 'artisan', 'master_artisan'].includes(r)) return 'Field Contributor';
  if (['legislative-contributors', 'legislative-contributor', 'legislative_contributors', 'policy-advisor', 'policy_advisor'].includes(r)) return 'Legislative Contributor';
  if (['industry-guild-contributors', 'industry-guild-contributor', 'industry-body', 'industry_guild_contributors', 'industry_guild_contributor', 'industry_body', 'guild'].includes(r)) return 'Industry & Guild Contributor';
  
  return 'Contributing Author';
}

export function isGarbageOrHeading(name: string): boolean {
  const trimmed = name.trim();
  if (trimmed.length < 3) return true;

  const clean = trimmed.toLowerCase();
  
  const garbagePhrases = [
    "co-authors", "coauthors", "institution", "academic institution", "research team",
    "technical editor", "peer reviewer", "editorial & review panel", "editorial and review panel",
    "review panel", "primary authorship", "field & industry contributors", "field and industry contributors",
    "field contributors", "legislative contributors", "industry contributors", "editorial panel"
  ];
  if (garbagePhrases.some(phrase => clean === phrase || clean.includes(phrase))) {
    return true;
  }

  const labelsList = [
    "lead author", "lead authors", "co-author", "co-authors", "coauthor", "coauthors",
    "institution", "institutions", "academic institution", "academic institutions",
    "research team", "research_team", "research teams", "editorial", "editorial panel",
    "review panel", "review_panel", "peer reviewer", "peer_reviewer", "peer reviewers",
    "field contributor", "field contributors", "field_contributors",
    "legislative contributor", "legislative contributors", "legislative_contributors",
    "industry contributor", "industry contributors", "industry_contributors",
    "primary authorship", "field & industry contributors", "editorial & review panel",
    "technical editor", "co-authors, institution", "research team)editorial"
  ];
  let labelCount = 0;
  for (const label of labelsList) {
    const regex = new RegExp("\\b" + label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "gi");
    const matches = clean.match(regex);
    if (matches) {
      labelCount += matches.length;
    }
  }
  if (labelCount >= 2) {
    return true;
  }

  const labelWordsSet = new Set([
    "lead", "author", "authors", "co-author", "co-authors", "coauthor", "coauthors",
    "institution", "institutions", "academic", "research", "team", "teams", "editorial",
    "review", "panel", "panels", "technical", "editor", "editors", "peer", "reviewer",
    "reviewers", "field", "contributor", "contributors", "legislative", "industry",
    "primary", "authorship", "guild", "advisors", "advisor"
  ]);
  const words = clean.replace(/[^\w\s-]/g, "").split(/\s+/).filter(Boolean);
  const totalWords = words.length;
  if (totalWords === 0) return true;
  
  let labelWordsCount = 0;
  for (const word of words) {
    if (labelWordsSet.has(word)) {
      labelWordsCount++;
    }
  }
  if (labelWordsCount / totalWords > 0.5) {
    return true;
  }

  return false;
}

export function validateContributorsSchema(json: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const normalized: any = { contributors: [] };

  if (!json || typeof json !== 'object') {
    return { isValid: false, errors: ['Invalid JSON object structure'], warnings: [], normalizedData: null };
  }

  let list = json.contributors || json.authors || json.people;
  if (!list) {
    if (json.name) {
      list = [json];
    } else {
      const keys = Object.keys(json);
      const hasRoles = keys.some(k => {
        const r = k.toLowerCase().replace(/_/g, '-').replace(/\s+/g, '-');
        return ['lead-author', 'lead', 'author', 'co-authors', 'co-author', 'coauthor', 'academic-institution', 'institution', 'research-team', 'team', 'technical-editor', 'editor', 'peer-reviewer', 'reviewer', 'field-contributors', 'field-contributor', 'master-artisan', 'artisan', 'legislative-contributors', 'policy-advisor', 'industry-guild-contributors', 'industry-body', 'guild'].includes(r);
      });
      
      if (hasRoles) {
        list = [];
        for (const [key, val] of Object.entries(json)) {
          const role = normalizeContributorRole(key);
          if (Array.isArray(val)) {
            val.forEach((item: any) => {
              if (typeof item === 'object' && item !== null) {
                list.push({
                  name: item.name || item.full_name || "",
                  role: item.role || role,
                  email: item.email || "",
                  institution: item.institution || item.organization || ""
                });
              } else if (typeof item === 'string') {
                list.push({
                  name: item,
                  role: role,
                  email: "",
                  institution: ""
                });
              }
            });
          } else if (typeof val === 'string') {
            list.push({
              name: val,
              role: role,
              email: "",
              institution: ""
            });
          } else if (typeof val === 'object' && val !== null) {
            list.push({
              name: (val as any).name || (val as any).full_name || "",
              role: (val as any).role || role,
              email: (val as any).email || "",
              institution: (val as any).institution || (val as any).organization || ""
            });
          }
        }
      } else {
        errors.push('Missing array list payload container: "contributors"');
        return { isValid: false, errors, warnings, normalizedData: null };
      }
    }
  }

  if (!Array.isArray(list)) {
    list = [list];
  }

  list.forEach((c: any, index: number) => {
    if (!c.name) {
      errors.push(`Contributor index [${index}] is missing required property "name"`);
      return;
    }
    if (isGarbageOrHeading(String(c.name))) {
      errors.push(`Invalid contributor payload: schema labels detected where contributor names were expected.`);
      return;
    }
    const normalizedRole = normalizeContributorRole(c.role || "Author");
    normalized.contributors.push({
      id: c.id || `c_${Date.now()}_${index}`,
      name: String(c.name),
      role: normalizedRole,
      email: c.email || "",
      institution: c.institution || c.organization || ""
    });

    if (normalizedRole === "Lead Author" && c.institution) {
      const instName = String(c.institution).trim();
      if (instName && !list.some((item: any) => normalizeContributorRole(item.role || "") === "Academic Institution" && String(item.name || item).trim().toLowerCase() === instName.toLowerCase())) {
        normalized.contributors.push({
          id: `c_inst_${Date.now()}_${index}`,
          name: instName,
          role: "Academic Institution",
          email: "",
          institution: ""
        });
      }
    }
  });

  return { isValid: errors.length === 0, errors, warnings, normalizedData: normalized };
}
