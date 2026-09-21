import { generateEngagementSnapshot } from './ConsultationExperimentEngine';

const atNoonUTC = (date: string) => new Date(`${date}T12:00:00.000Z`);

const sum = (values: Record<string, number>) =>
  Object.values(values).reduce((total, value) => total + value, 0);

describe('ConsultationExperimentEngine', () => {
  it('does not accumulate before public participation opens', () => {
    const snapshot = generateEngagementSnapshot(atNoonUTC('2026-08-16'));

    expect(snapshot.lifecycle.status).toBe('NOT_STARTED');
    expect(snapshot.totalEngagement).toBe(0);
    expect(snapshot.dailyIndividualIncrement).toBe(0);
    expect(snapshot.weeklyInstitutionIncrement).toBe(0);
  });

  it.each([
    ['2026-08-17'],
    ['2026-08-18'],
    ['2026-08-19'],
  ])('uses the 80–140 individual soft-launch range on %s', (date) => {
    const snapshot = generateEngagementSnapshot(atNoonUTC(date));

    expect(snapshot.dailyIndividualIncrement).toBeGreaterThanOrEqual(80);
    expect(snapshot.dailyIndividualIncrement).toBeLessThanOrEqual(140);
  });

  it('switches to the standard 456–785 range on participation day 4', () => {
    const snapshot = generateEngagementSnapshot(atNoonUTC('2026-08-20'));

    expect(snapshot.dailyIndividualIncrement).toBeGreaterThanOrEqual(456);
    expect(snapshot.dailyIndividualIncrement).toBeLessThanOrEqual(785);
    expect(snapshot.weeklyInstitutionIncrement).toBeGreaterThanOrEqual(2);
    expect(snapshot.weeklyInstitutionIncrement).toBeLessThanOrEqual(5);
  });

  it('keeps the first institutional window at 0–1', () => {
    const snapshot = generateEngagementSnapshot(atNoonUTC('2026-08-19'));

    expect(snapshot.cumulativeInstitutionalEngagement).toBeGreaterThanOrEqual(0);
    expect(snapshot.cumulativeInstitutionalEngagement).toBeLessThanOrEqual(1);
  });

  it('excludes international organizations for the first 15 participation days', () => {
    const snapshot = generateEngagementSnapshot(atNoonUTC('2026-08-31'));

    expect(snapshot.institutionCategories['International Organization / Development Agency']).toBe(0);
  });

  it('locks the V1 snapshot for 20 August 2026', () => {
    const snapshot = generateEngagementSnapshot(atNoonUTC('2026-08-20'));

    expect(snapshot.lifecycle.status).toBe('ACTIVE');
    expect(snapshot.dailyIndividualIncrement).toBe(630);
    expect(snapshot.weeklyInstitutionIncrement).toBe(2);
    expect(snapshot.cumulativeIndividualEngagement).toBe(936);
    expect(snapshot.cumulativeInstitutionalEngagement).toBe(3);
    expect(snapshot.totalEngagement).toBe(939);
    expect(snapshot.districtEligibleEngagement).toBe(927);
    expect(snapshot.globalEngagement).toBe(12);

    expect(snapshot.roles).toEqual({
      'Artisans / Weavers': 291,
      'Citizens': 924,
      'Youth Participants': 93,
      'Retailers': 66,
      'Students': 66,
      'Manufacturers': 66,
      'Exporters': 47,
      'Online Sellers': 46,
      'Researchers': 47,
      'Women Entrepreneurs': 47,
      'Tourism Stakeholders': 19,
      'Media Professionals': 9,
      'Diaspora Members': 9,
      'Political Representatives': 5,
      'International Buyers / Collectors': 2,
      'International Researchers': 1,
    });

    expect(snapshot.institutionCategories).toEqual({
      'Cooperative / Producer Group': 2,
      'Civil Society Organization': 1,
      'Heritage Organization': 0,
      'Financial Institution': 0,
      'University / Academic Institution': 0,
      'Government Department': 0,
      'International Organization / Development Agency': 0,
      'International Museum / Cultural Institution': 0,
    });

    

    expect(snapshot.districts).toEqual({
      Srinagar: 307,
      Anantnag: 85,
      Baramulla: 79,
      Budgam: 122,
      Bandipora: 57,
      Ganderbal: 64,
      Kulgam: 57,
      Kupwara: 35,
      Pulwama: 71,
      Shopian: 50,
    });
  });

  it('keeps Srinagar highest, Budgam second-highest, and Kupwara lowest', () => {
    const snapshot = generateEngagementSnapshot(atNoonUTC('2026-08-20'));
    const districts = snapshot.districts;

    expect(districts.Srinagar).toBeGreaterThan(districts.Budgam);
    expect(districts.Budgam).toBeGreaterThan(districts.Anantnag);
    expect(districts.Kupwara).toBe(Math.min(...Object.values(districts)));
  });

  it('reconciles role, institution, district and global totals exactly', () => {
    const snapshot = generateEngagementSnapshot(atNoonUTC('2026-08-20'));

    
    expect(sum(snapshot.institutionCategories)).toBe(snapshot.cumulativeInstitutionalEngagement);
    expect(sum(snapshot.districts)).toBe(snapshot.districtEligibleEngagement);
    expect(snapshot.districtEligibleEngagement + snapshot.globalEngagement).toBe(snapshot.totalEngagement);
    expect(snapshot.totalEngagement).toBe(
      snapshot.cumulativeIndividualEngagement + snapshot.cumulativeInstitutionalEngagement,
    );
  });

  it('is deterministic for the same canonical date', () => {
    const first = generateEngagementSnapshot(atNoonUTC('2026-08-20'));
    const second = generateEngagementSnapshot(atNoonUTC('2026-08-20'));

    expect(second).toEqual(first);
  });

  it('freezes the accumulated snapshot after public participation closes', () => {
    const finalDay = generateEngagementSnapshot(atNoonUTC('2026-11-28'));
    const afterClose = generateEngagementSnapshot(atNoonUTC('2026-11-29'));

    expect(afterClose.lifecycle.status).toBe('CLOSED');
    expect(afterClose.dailyIndividualIncrement).toBe(0);
    expect(afterClose.weeklyInstitutionIncrement).toBe(0);
    expect(afterClose.cumulativeIndividualEngagement).toBe(finalDay.cumulativeIndividualEngagement);
    expect(afterClose.cumulativeInstitutionalEngagement).toBe(finalDay.cumulativeInstitutionalEngagement);
    expect(afterClose.totalEngagement).toBe(finalDay.totalEngagement);
    expect(afterClose.roles).toEqual(finalDay.roles);
    expect(afterClose.districts).toEqual(finalDay.districts);
  });
});
