export const INDIVIDUAL_CATEGORIES = [
  "Artisan / Weaver",
  "Manufacturer",
  "Exporter",
  "Retailer",
  "Online Seller",
  "Student",
  "Researcher",
  "Political Party Representative",
  "Citizen",
  "Youth Participant",
  "Women Entrepreneur",
  "Media Professional",
  "Tourism Stakeholder",
  "Diaspora Member",
  "International Buyer / Collector",
  "International Researcher"
] as const;

export const INSTITUTIONAL_CATEGORIES = [
  "Cooperative / Producer Group",
  "Financial Institution",
  "University / Academic Institution",
  "Government Department",
  "Civil Society Organization",
  "Heritage Organization",
  "International Organization / Development Agency",
  "International Museum / Cultural Institution"
] as const;

export const PARTICIPANT_CATEGORIES = [
  ...INDIVIDUAL_CATEGORIES,
  ...INSTITUTIONAL_CATEGORIES
] as const;

export type ParticipantCategory = typeof PARTICIPANT_CATEGORIES[number];

export const isValidCategory = (category: string | null | undefined): category is ParticipantCategory => {
  if (!category) return false;
  return (PARTICIPANT_CATEGORIES as readonly string[]).includes(category);
};

export const normalizeCategory = (categoryParam: string | null): ParticipantCategory | null => {
  if (!categoryParam) return null;
  
  const paramMap: Record<string, ParticipantCategory> = {
    'youth-participant': 'Youth Participant',
    'women-entrepreneur': 'Women Entrepreneur',
    'student': 'Student',
    'exporter': 'Exporter',
    'online-seller': 'Online Seller',
    'financial-institution': 'Financial Institution',
    'government-department': 'Government Department',
    'artisan-weaver': 'Artisan / Weaver',
  };

  const lower = categoryParam.toLowerCase();
  
  if (paramMap[lower]) return paramMap[lower];

  const matched = (PARTICIPANT_CATEGORIES as readonly string[]).find(c => c.toLowerCase() === lower);
  return (matched as ParticipantCategory) || null;
};
