import { prisma } from '../src/config/db.js';

const SOURCE_TITLE = 'GI Authorized Users - Kani Shawl (Application 51)';
const SOURCE_AGENCY = 'Intellectual Property India';
const SOURCE_URL = 'https://search.ipindia.gov.in/GIRPublicSearch/Application/Details/51';
const CRAFT_NAME = 'Kani Shawl';
const GI_APPLICATION_NO = '51';

type PilotRecord = {
  khcrfMasterId: string;
  fullName: string;
  gender: 'Male' | 'Female';
  locality: string;
  giAuthorizedUserNo: string;
  giStatus: string;
  confidence: 'A' | 'B';
  dataStatus: 'VERIFIED' | 'PROVISIONAL';
  notes?: string;
};

const records: PilotRecord[] = [
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0001', fullName: 'Sameena Ahad Khan', gender: 'Female', locality: 'Batapora Kanihama', giAuthorizedUserNo: 'AU/36404/GI/51/786', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0002', fullName: 'Waseem Ahmad Khan', gender: 'Male', locality: 'Batapora Kanihama', giAuthorizedUserNo: 'AU/36405/GI/51/787', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0003', fullName: 'Ifrana Akhter', gender: 'Female', locality: 'Batapora Kanihama', giAuthorizedUserNo: 'AU/36406/GI/51/788', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0004', fullName: 'Tawheed Ahmad Bhat', gender: 'Male', locality: 'Batapora Kanihama', giAuthorizedUserNo: 'AU/36407/GI/51/789', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0005', fullName: 'Waheed Ahmad Dar', gender: 'Male', locality: 'Batapora Kanihama', giAuthorizedUserNo: 'AU/36408/GI/51/790', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0006', fullName: 'Mushtaq Ahmad Dar', gender: 'Male', locality: 'Batapora Kanihama', giAuthorizedUserNo: 'AU/36409/GI/51/791', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0007', fullName: 'Arshid Ahmad Dar', gender: 'Male', locality: 'Batapora Kanihama', giAuthorizedUserNo: 'AU/36410/GI/51/792', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0008', fullName: 'Fayaz Ahmad Wani', gender: 'Male', locality: 'Mazhama', giAuthorizedUserNo: 'AU/36415/GI/51/793', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0009', fullName: 'Lateef Ahmad Rather', gender: 'Male', locality: 'Purani Sunder Shah Kawsa Jagir', giAuthorizedUserNo: 'AU/36416/GI/51/794', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0010', fullName: 'Nazir Ahmad Bhat', gender: 'Male', locality: 'Shipora, Magam', giAuthorizedUserNo: 'AU/36417/GI/51/795', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0011', fullName: 'Ishfaq Ahmad Reshi', gender: 'Male', locality: 'Batapora Kanihama', giAuthorizedUserNo: 'AU/36418/GI/51/796', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0012', fullName: 'Shabir Ahmad Reshi', gender: 'Male', locality: 'Batapora Kanihama', giAuthorizedUserNo: 'AU/36419/GI/51/797', giStatus: 'UNKNOWN_ON_SOURCE_ROW', confidence: 'B', dataStatus: 'PROVISIONAL', notes: 'GI status is not stated on the source row; retain as provisional until corroborated.' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0013', fullName: 'Ashiq Nazir Mir', gender: 'Male', locality: 'Batapora Kanihama', giAuthorizedUserNo: 'AU/36420/GI/51/798', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0014', fullName: 'Irshad Nazir Mir', gender: 'Male', locality: 'Batapora Kanihama', giAuthorizedUserNo: 'AU/36421/GI/51/799', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0015', fullName: 'Irafn Ahmad Ganaie', gender: 'Male', locality: 'Batapora Kanihama', giAuthorizedUserNo: 'AU/36422/GI/51/800', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED', notes: 'Name preserved exactly as published by source; possible spelling normalization requires corroboration.' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0016', fullName: 'Rameez Raja Ganaie', gender: 'Male', locality: 'Batapora Kanihama', giAuthorizedUserNo: 'AU/36423/GI/51/801', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0017', fullName: 'Tahseer Ahmad Dar', gender: 'Male', locality: 'Batapora Kanihama', giAuthorizedUserNo: 'AU/36424/GI/51/802', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0018', fullName: 'Ishfaq Ahmad Shah', gender: 'Male', locality: 'Roshanabad Magam', giAuthorizedUserNo: 'AU/36425/GI/51/803', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0019', fullName: 'Hilal Ahmad Ganaie', gender: 'Male', locality: 'Batapora Kanihama', giAuthorizedUserNo: 'AU/36426/GI/51/804', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0020', fullName: 'Jameel Ahmad Hajam', gender: 'Male', locality: 'Batapora Kanihama', giAuthorizedUserNo: 'AU/36427/GI/51/805', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0021', fullName: 'Jan Mohammad Hajam', gender: 'Male', locality: 'Batapora Kanihama', giAuthorizedUserNo: 'AU/36428/GI/51/806', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0022', fullName: 'Mohammad Younis Doom', gender: 'Male', locality: 'Petpora Hardu Surash Khag', giAuthorizedUserNo: 'AU/36429/GI/51/807', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0023', fullName: 'Shabir Ahmad Malik', gender: 'Male', locality: 'Batapora Kanihama', giAuthorizedUserNo: 'AU/36430/GI/51/808', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0024', fullName: 'Mohammad Ashraf Mir', gender: 'Male', locality: 'Batapora Kanihama', giAuthorizedUserNo: 'AU/36431/GI/51/809', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
  { khcrfMasterId: 'KHCRF-MA-BUD-KANI-0025', fullName: 'Omer Mohi Ud Din Dar', gender: 'Male', locality: 'Batapora Kanihama', giAuthorizedUserNo: 'AU/36432/GI/51/810', giStatus: 'Registered', confidence: 'A', dataStatus: 'VERIFIED' },
];

function confidenceScore(grade: 'A' | 'B'): number {
  return grade === 'A' ? 0.95 : 0.75;
}

async function main() {
  const apply = process.argv.includes('--apply');
  if (!apply) {
    console.log(`DRY RUN: ${records.length} Budgam Kani records validated. Re-run with --apply to write.`);
    console.table(records.map((r) => ({ id: r.khcrfMasterId, name: r.fullName, status: r.dataStatus, gi: r.giStatus })));
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
          notes: 'Budgam Kani Shawl GI authorized-user pilot ingestion. Source spelling is preserved exactly.',
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
        ['artisan_name', record.fullName, record.fullName],
        ['gender', record.gender, record.gender],
        ['district', 'Budgam', 'Budgam'],
        ['village_locality', record.locality, record.locality],
        ['craft', CRAFT_NAME, CRAFT_NAME],
        ['gi_application_number', GI_APPLICATION_NO, GI_APPLICATION_NO],
        ['gi_authorized_user_id', record.giAuthorizedUserNo, record.giAuthorizedUserNo],
        ['gi_authorization_status', record.giStatus, record.giStatus],
      ] as const;

      await tx.artisanAssertion.createMany({
        data: assertions.map(([fieldName, rawValue, normalizedValue]) => ({
          artisan_id: artisan.id,
          field_name: fieldName,
          raw_value: rawValue,
          normalized_value: normalizedValue,
          source_id: source.id,
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
          source_record_reference: record.giAuthorizedUserNo,
        },
      });

      if (isVerified) verified += 1;
      else provisional += 1;
    }

    return { sourceId: source.id, craftId: craft.id, insertedOrUpdated: records.length, verified, provisional };
  });

  console.log('Budgam Kani GI pilot injection complete:', result);
}

main()
  .catch((error) => {
    console.error('Budgam Kani GI pilot injection failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
