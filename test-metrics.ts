import { computeGlobalReachMetrics } from './frontend/src/lib/partnerRegistryAdapter';
import { ECOSYSTEM_PARTNERS } from './frontend/src/config/ecosystemPartners';

const metrics = computeGlobalReachMetrics(ECOSYSTEM_PARTNERS);
console.log('Ecosystem Count (A):', metrics.ecosystemCount);
console.log('Specialized Count (B):', metrics.sisterOrgCount);
console.log('Institutional Count (C):', metrics.approvedPartnerCount);
