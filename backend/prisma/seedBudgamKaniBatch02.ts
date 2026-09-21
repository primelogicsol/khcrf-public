import { prisma } from '../src/config/db.js';

const SOURCE_TITLE = 'GI Authorized Users - Kani Shawl (Application 51)';
const SOURCE_AGENCY = 'Intellectual Property India';
const SOURCE_URL = 'https://search.ipindia.gov.in/GIRPublicSearch/Application/Details/51';
const CRAFT_NAME = 'Kani Shawl';
const GI_APPLICATION_NO = '51';

type PilotRecord = {
  khcrfMasterId: string;
  fullName: string;
  rawSourceName: string;
  gender: 'Male' | 'Female';
  fatherHusbandName?: string;
  locality: string;
  giAuthorizedUserNo: string;
  sourceRow: string;
  giStatus: string;
  confidence: 'A' | 'B';
  dataStatus: 'VERIFIED' | 'PROVISIONAL';
  notes?: string;
};

// Batch 02 contains only individual artisans whose source address is explicitly in Budgam.
// Business/organizational GI authorized users and non-Budgam/ambiguous localities are intentionally excluded.
const records: PilotRecord[] = [
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0026', fullName: 'Showkat Mohi Ud Din Dar', rawSourceName: 'Mr Showkat Mohi Ud Din Dar', gender: 'Male', locality: 'Batapora Kanihama, Budgam', giAuthorizedUserNo: 'AU/36433/GI/51/811', sourceRow: '811', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0027', fullName: 'Mohammad Rafiq Ganaie', rawSourceName: 'Mr Mohammad Rafiq Ganaie', gender: 'Male', locality: 'Batapora Kanihama, Budgam', giAuthorizedUserNo: 'AU/36434/GI/51/812', sourceRow: '812', giStatus: 'UNKNOWN_ON_SOURCE_ROW', confidence: 'B', dataStatus: 'PROVISIONAL', notes: 'GI status is blank on the source row; retain as provisional until corroborated.' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0028', fullName: 'Ishfaq Ahmad Hajam', rawSourceName: 'Mr Ishfaq Ahmad Hajam', gender: 'Male', locality: 'Batapora Kanihama, Budgam', giAuthorizedUserNo: 'AU/36435/GI/51/813', sourceRow: '813', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0029', fullName: 'Fayaz Ahmad Akhoon', rawSourceName: 'Mr Fayaz Ahmad Akhoon', gender: 'Male', locality: 'Batapora Kanihama, Budgam', giAuthorizedUserNo: 'AU/36436/GI/51/814', sourceRow: '814', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0030', fullName: 'Abdul Rashid Ganaie', rawSourceName: 'Mr Abdul Rashid Ganaie', gender: 'Male', locality: 'Batapora Kanihama, Budgam', giAuthorizedUserNo: 'AU/36442/GI/51/817', sourceRow: '817', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0031', fullName: 'Mudasir Ahmad Akhoon', rawSourceName: 'Mr Mudasir Ahmad Akhoon', gender: 'Male', locality: 'Batapora Kanihama, Budgam', giAuthorizedUserNo: 'AU/36443/GI/51/818', sourceRow: '818', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0032', fullName: 'Asif Ahmad Ganaie', rawSourceName: 'Mr Asif Ahmad Ganaie', gender: 'Male', locality: 'Batapora Kanihama, Budgam', giAuthorizedUserNo: 'AU/36444/GI/51/819', sourceRow: '819', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0033', fullName: 'Lateef Ahmed Mir', rawSourceName: 'Mr Lateef Ahmed Mir', gender: 'Male', locality: 'Batapora Kanihama, Budgam', giAuthorizedUserNo: 'AU/36445/GI/51/820', sourceRow: '820', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0034', fullName: 'Adil Ahmad Akhoon', rawSourceName: 'Mr Adil Ahmad Akhoon', gender: 'Male', locality: 'Batapora Kanihama, Budgam', giAuthorizedUserNo: 'AU/36446/GI/51/821', sourceRow: '821', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0035', fullName: 'Aqib Mushtaq Dar', rawSourceName: 'Mr Aqib Mushtaq Dar', gender: 'Male', locality: 'Batapora Kanihama, Budgam', giAuthorizedUserNo: 'AU/36447/GI/51/822', sourceRow: '822', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0036', fullName: 'Hilal Ahmad Malik', rawSourceName: 'Mr Hilal Ahmad Malik', gender: 'Male', locality: 'Batapora Kanihama, Budgam', giAuthorizedUserNo: 'AU/36448/GI/51/823', sourceRow: '823', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0037', fullName: 'Sheikh Saleem Gul', rawSourceName: 'Mr Sheikh Saleem Gul', gender: 'Male', locality: 'Batapora Kanihama, Budgam', giAuthorizedUserNo: 'AU/36449/GI/51/824', sourceRow: '824', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0038', fullName: 'Bilal Ahmad Dar', rawSourceName: 'Mr Bilal Ahmad Dar', gender: 'Male', locality: 'Batapora Kanihama, Budgam', giAuthorizedUserNo: 'AU/36450/GI/51/825', sourceRow: '825', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0039', fullName: 'Sajad Rasool Hajam', rawSourceName: 'Mr Sajad Rasool Hajam', gender: 'Male', locality: 'Mazhama Narbal, Budgam', giAuthorizedUserNo: 'AU/36453/GI/51/827', sourceRow: '827', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0040', fullName: 'Manzoor Ahmad Sofi', rawSourceName: 'Mr Manzoor Ahmad Sofi', gender: 'Male', locality: 'Batapora Kanihama, Budgam', giAuthorizedUserNo: 'AU/36454/GI/51/828', sourceRow: '828', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0041', fullName: 'Showkat Majeed Hajam', rawSourceName: 'Mr Showkat Majeed Hajam', gender: 'Male', locality: 'Batapora Kanihama, Budgam', giAuthorizedUserNo: 'AU/36455/GI/51/829', sourceRow: '829', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0042', fullName: 'Asif Majeed Hajam', rawSourceName: 'Mr Asif Majeed Hajam', gender: 'Male', locality: 'Batapora Kanihama, Budgam', giAuthorizedUserNo: 'AU/36456/GI/51/830', sourceRow: '830', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0043', fullName: 'Farooq Ahmad Lone', rawSourceName: 'Mr Farooq Ahmad Lone', gender: 'Male', locality: 'Batapora Kanihama, Budgam', giAuthorizedUserNo: 'AU/36457/GI/51/831', sourceRow: '831', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0044', fullName: 'Asif Ahmad Shah', rawSourceName: 'Mr Asif Ahmad Shah', gender: 'Male', locality: 'Batapora Kanihama, Budgam', giAuthorizedUserNo: 'AU/36458/GI/51/832', sourceRow: '832', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0045', fullName: 'Nisar Ahmad Malik', rawSourceName: 'Mr. Nisar Ahmad Malik', gender: 'Male', locality: 'Warapora Budgam', giAuthorizedUserNo: 'AU/37152/GI/51/833', sourceRow: '833', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0046', fullName: 'Nazir Ahmad Dar', rawSourceName: 'Mr. Nazir Ahmad Dar', gender: 'Male', locality: 'Batapora Kanihama Budgam', giAuthorizedUserNo: 'AU/37153/GI/51/834', sourceRow: '834', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0047', fullName: 'Haseena Bano', rawSourceName: 'Mrs. Haseena Bano W/O Imtiyaz Ahmad Najar', gender: 'Female', fatherHusbandName: 'Imtiyaz Ahmad Najar', locality: 'Heewooder Budgam', giAuthorizedUserNo: 'AU/37154/GI/51/835', sourceRow: '835', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0048', fullName: 'Tariq Ahmad Dar', rawSourceName: 'Mr Tariq ahmad Dar.', gender: 'Male', locality: 'Batapora Kanihama Beerwah Budgam', giAuthorizedUserNo: 'AU/37169/GI/51/838', sourceRow: '838', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0049', fullName: 'Ashaq Ahmad Dar', rawSourceName: 'Mr Ashaq Ahmad Dar', gender: 'Male', locality: 'Batapora Kanihama Beerwah Budgam', giAuthorizedUserNo: 'AU/37170/GI/51/839', sourceRow: '839', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0050', fullName: 'Mohammad Yousuf Hanji', rawSourceName: 'Mr. Mohammad Yousuf Hanji', gender: 'Male', locality: 'Batapora Kanihama Beerwah Budgam', giAuthorizedUserNo: 'AU/37175/GI/51/842', sourceRow: '842', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
];

function confidenceScore(grade: 'A' | 'B'): number {
  return grade === 'A' ? 0.95 : 0.75;
}

async function main() {
  const apply = process.argv.includes('--apply');

  if (!apply) {
    console.log(`DRY RUN: ${records.length} Budgam Kani batch-02 records validated. Re-run with --apply to write.`);
    console.table(records.map((r) => ({ id: r.khcrfMasterId, row: r.sourceRow, name: r.fullName, status: r.dataStatus, gi: r.giStatus })));
    return;
  }

  const result = await prisma.$transaction(async (tx) => {
    let source = await tx.source.findFirst({
      where: { source_url: SOURCE_URL, source_title: SOURCE_TITLE },
    });

    if (!source) {
      source = await tx.source.create({
        data: {
          source_agency: SOURCE_AGENCY,
          source_title: SOURCE_TITLE,
          source_url: SOURCE_URL,
          source_type: 'GOVERNMENT_GI_REGISTER',
          retrieved_at: new Date(),
          notes: 'Kani Shawl GI authorized-user register. Source spellings and source row references are preserved.',
        },
      });
    }

    let craft = await tx.giCraft.findFirst({
      where: { canonical_name: CRAFT_NAME, gi_application_no: GI_APPLICATION_NO },
    });

    if (!craft) {
      craft = await tx.giCraft.create({
        data: {
          canonical_name: CRAFT_NAME,
          gi_application_no: GI_APPLICATION_NO,
          category: 'Handicraft',
          active: true,
        },
      });
    }

    let verified = 0;
    let provisional = 0;

    for (const record of records) {
      const isVerified = record.dataStatus === 'VERIFIED';

      const artisan = await tx.masterArtisan.upsert({
        where: { khcrf_master_id: record.khcrfMasterId },
        update: {
          artisan_name: record.fullName,
          father_husband_name: record.fatherHusbandName ?? null,
          gender: record.gender,
          historical_state: 'Jammu and Kashmir',
          current_ut: 'Jammu and Kashmir',
          district: 'Budgam',
          village_locality: record.locality,
          primary_craft_id: craft.id,
          status: record.dataStatus,
          government_verified: isVerified,
          gi_verified: isVerified,
          khcrf_verified: false,
          evidence_grade: record.confidence,
          reconciliation_status: isVerified ? 'RESOLVED' : 'PROVISIONAL',
          documentation_level: 'SOURCE_RECORD',
          last_verified_at: isVerified ? new Date() : null,
          sources: { connect: { id: source.id } },
        },
        create: {
          khcrf_master_id: record.khcrfMasterId,
          artisan_name: record.fullName,
          father_husband_name: record.fatherHusbandName ?? null,
          gender: record.gender,
          historical_state: 'Jammu and Kashmir',
          current_ut: 'Jammu and Kashmir',
          district: 'Budgam',
          village_locality: record.locality,
          primary_craft_id: craft.id,
          status: record.dataStatus,
          government_verified: isVerified,
          gi_verified: isVerified,
          khcrf_verified: false,
          evidence_grade: record.confidence,
          reconciliation_status: isVerified ? 'RESOLVED' : 'PROVISIONAL',
          documentation_level: 'SOURCE_RECORD',
          last_verified_at: isVerified ? new Date() : null,
          sources: { connect: { id: source.id } },
        },
      });

      await tx.artisanAssertion.deleteMany({
        where: { artisan_id: artisan.id, source_id: source.id },
      });

      const assertions = [
        { field: 'artisan_name', raw: record.rawSourceName, normalized: record.fullName },
        { field: 'gender', raw: record.gender, normalized: record.gender },
        { field: 'district', raw: record.locality, normalized: 'Budgam' },
        { field: 'village_locality', raw: record.locality, normalized: record.locality },
        { field: 'craft', raw: CRAFT_NAME, normalized: CRAFT_NAME },
        { field: 'gi_application_number', raw: GI_APPLICATION_NO, normalized: GI_APPLICATION_NO },
        { field: 'gi_authorized_user_id', raw: record.giAuthorizedUserNo, normalized: record.giAuthorizedUserNo },
        { field: 'gi_authorization_status', raw: record.giStatus, normalized: record.giStatus },
      ];

      if (record.fatherHusbandName) {
        assertions.push({ field: 'father_husband_name', raw: record.rawSourceName, normalized: record.fatherHusbandName });
      }

      await tx.artisanAssertion.createMany({
        data: assertions.map((assertion) => ({
          artisan_id: artisan.id,
          field_name: assertion.field,
          raw_value: assertion.raw,
          normalized_value: assertion.normalized,
          source_id: source.id,
          source_row: record.sourceRow,
          source_record_reference: record.giAuthorizedUserNo,
          confidence: confidenceScore(record.confidence),
          match_method: 'DIRECT_SOURCE_ROW',
          reconciliation_reason: record.notes ?? null,
          is_canonical: true,
        })),
      });

      await tx.artisanIdentifier.deleteMany({
        where: {
          artisan_id: artisan.id,
          identifier_type: 'GI_AUTHORIZED_USER_ID',
          source_id: source.id,
        },
      });

      await tx.artisanIdentifier.create({
        data: {
          artisan_id: artisan.id,
          identifier_type: 'GI_AUTHORIZED_USER_ID',
          identifier_value: record.giAuthorizedUserNo,
          issuer: SOURCE_AGENCY,
          status: record.giStatus,
          source_id: source.id,
          source_row: record.sourceRow,
          source_record_reference: record.giAuthorizedUserNo,
        },
      });

      await tx.artisanGiAuthorization.deleteMany({
        where: {
          artisan_id: artisan.id,
          craft_id: craft.id,
          source_id: source.id,
        },
      });

      await tx.artisanGiAuthorization.create({
        data: {
          artisan_id: artisan.id,
          craft_id: craft.id,
          gi_authorized_user_id: record.giAuthorizedUserNo,
          gi_application_number: GI_APPLICATION_NO,
          authorization_status: record.giStatus,
          source_id: source.id,
          source_row: record.sourceRow,
          source_record_reference: record.giAuthorizedUserNo,
        },
      });

      if (isVerified) verified += 1;
      else provisional += 1;
    }

    return {
      sourceId: source.id,
      craftId: craft.id,
      insertedOrUpdated: records.length,
      verified,
      provisional,
      firstKhcrfId: records[0].khcrfMasterId,
      lastKhcrfId: records[records.length - 1].khcrfMasterId,
    };
  });

  console.log('Budgam Kani batch 02 injection complete:', result);
}

main()
  .catch((error) => {
    console.error('Budgam Kani batch 02 injection failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
