/**
 * Shared canonical configuration for districts of the Kashmir Division.
 * Used globally across directories and filters to ensure consistency.
 * 
 * Ordered geographically (Central -> South -> North).
 */

export const KASHMIR_DISTRICTS = [
  // Central
  'Srinagar',
  'Ganderbal',
  'Budgam',
  
  // South
  'Pulwama',
  'Shopian',
  'Anantnag',
  'Kulgam',
  
  // North
  'Baramulla',
  'Bandipora',
  'Kupwara',
] as const;

export type KashmirDistrict = typeof KASHMIR_DISTRICTS[number];
