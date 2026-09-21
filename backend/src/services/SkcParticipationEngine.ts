import crypto from 'crypto';

export class SkcParticipationEngine {
  private static readonly START_DATE = new Date('2026-01-01T00:00:00Z');
  
  private static readonly INDIVIDUAL_CATEGORIES = [
    'Artisan / Weaver', 'Manufacturer', 'Exporter', 'Retailer', 'Online Seller', 
    'Student', 'Researcher', 'Political Party Representative', 'Citizen', 
    'Youth Participant', 'Women Entrepreneur', 'Media Professional', 
    'Tourism Stakeholder', 'Diaspora Member', 'International Buyer / Collector', 
    'International Researcher'
  ];

  private static readonly INSTITUTION_CATEGORIES = [
    'Cooperative / Producer Group', 'Financial Institution', 
    'University / Academic Institution', 'Government Department', 
    'Civil Society Organization', 'Heritage Organization', 
    'International Organization / Development Agency', 
    'International Museum / Cultural Institution'
  ];

  private static readonly DISTRICTS = [
    'Srinagar', 'Anantnag', 'Baramulla', 'Bandipora', 'Budgam', 
    'Ganderbal', 'Kulgam', 'Kupwara', 'Pulwama', 'Shopian'
  ];

  // A simple deterministic PRNG based on a seed
  private static mulberry32(a: number) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
  }

  // Get a deterministic random number between min and max for a given day and namespace
  private static getDailyRandom(daysSinceStart: number, namespace: string, min: number, max: number): number {
    const seedString = `${namespace}-${daysSinceStart}`;
    const hash = crypto.createHash('md5').update(seedString).digest('hex');
    const seed = parseInt(hash.substring(0, 8), 16);
    const prng = this.mulberry32(seed);
    return Math.floor(prng() * (max - min + 1)) + min;
  }

  private static getDistribution(count: number, categories: string[], daysSinceStart: number, namespace: string) {
    const distribution: Record<string, number> = {};
    categories.forEach(c => distribution[c] = 0);
    
    const seedString = `${namespace}-dist-${daysSinceStart}`;
    const hash = crypto.createHash('md5').update(seedString).digest('hex');
    const seed = parseInt(hash.substring(0, 8), 16);
    const prng = this.mulberry32(seed);

    for (let i = 0; i < count; i++) {
      const catIdx = Math.floor(prng() * categories.length);
      distribution[categories[catIdx]]++;
    }
    return distribution;
  }

  public static getAutomaticCounts(targetDate: Date = new Date()) {
    let daysSinceStart = Math.floor((targetDate.getTime() - this.START_DATE.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceStart < 0) daysSinceStart = 0;

    let totalIndividuals = 0;
    let totalInstitutions = 0;

    const individualCategoryCounts: Record<string, number> = {};
    const institutionCategoryCounts: Record<string, number> = {};
    const individualDistrictCounts: Record<string, number> = {};
    const institutionDistrictCounts: Record<string, number> = {};
    
    // Cross-dimensional counts
    // e.g. District -> Category -> Count
    const individualCrossCounts: Record<string, Record<string, number>> = {};
    
    this.INDIVIDUAL_CATEGORIES.forEach(c => individualCategoryCounts[c] = 0);
    this.INSTITUTION_CATEGORIES.forEach(c => institutionCategoryCounts[c] = 0);
    this.DISTRICTS.forEach(d => {
      individualDistrictCounts[d] = 0;
      institutionDistrictCounts[d] = 0;
      individualCrossCounts[d] = {};
      this.INDIVIDUAL_CATEGORIES.forEach(c => individualCrossCounts[d][c] = 0);
    });

    for (let day = 0; day <= daysSinceStart; day++) {
      // Individuals: 456 to 785 per day
      const dailyInd = this.getDailyRandom(day, 'ind', 456, 785);
      totalIndividuals += dailyInd;

      const indCatDist = this.getDistribution(dailyInd, this.INDIVIDUAL_CATEGORIES, day, 'ind-cat');
      const indDistDist = this.getDistribution(dailyInd, this.DISTRICTS, day, 'ind-dist');
      
      // We also need to distribute the day's individuals across both dimensions deterministically
      const prng = this.mulberry32(parseInt(crypto.createHash('md5').update(`ind-cross-${day}`).digest('hex').substring(0, 8), 16));
      
      for (let i = 0; i < dailyInd; i++) {
        const catIdx = Math.floor(prng() * this.INDIVIDUAL_CATEGORIES.length);
        const distIdx = Math.floor(prng() * this.DISTRICTS.length);
        const cat = this.INDIVIDUAL_CATEGORIES[catIdx];
        const dist = this.DISTRICTS[distIdx];
        individualCategoryCounts[cat]++;
        individualDistrictCounts[dist]++;
        individualCrossCounts[dist][cat]++;
      }

      // Institutions: 2 to 5 per week (we'll just do 0-1 per day to average out)
      const dailyInst = this.getDailyRandom(day, 'inst', 0, 100) < (3.5 / 7 * 100) ? 1 : 0;
      if (dailyInst > 0) {
        totalInstitutions += dailyInst;
        const prngInst = this.mulberry32(parseInt(crypto.createHash('md5').update(`inst-cross-${day}`).digest('hex').substring(0, 8), 16));
        const cat = this.INSTITUTION_CATEGORIES[Math.floor(prngInst() * this.INSTITUTION_CATEGORIES.length)];
        const dist = this.DISTRICTS[Math.floor(prngInst() * this.DISTRICTS.length)];
        institutionCategoryCounts[cat]++;
        institutionDistrictCounts[dist]++;
      }
    }

    return {
      totalIndividuals,
      totalInstitutions,
      individualCategoryCounts,
      institutionCategoryCounts,
      individualDistrictCounts,
      institutionDistrictCounts,
      individualCrossCounts
    };
  }
}
