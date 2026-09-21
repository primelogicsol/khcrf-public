import { prisma } from '../src/config/db';

async function main() {
  console.log('Seeding 15 varied test artisans...');
  await prisma.masterArtisan.deleteMany({ where: { khcrf_master_id: { startsWith: 'KHCRF-MA-10' } } });
  await prisma.masterArtisan.deleteMany({ where: { khcrf_master_id: { startsWith: 'KHCRF-MA-10' } } });

  let kaniCraft = await prisma.giCraft.findFirst({ where: { gi_application_no: '51' } });
  if (!kaniCraft) {
    kaniCraft = await prisma.giCraft.create({ data: { canonical_name: 'Kashmir Kani Shawl', gi_application_no: '51', category: 'Textiles' } });
  }

  let sozniCraft = await prisma.giCraft.findFirst({ where: { gi_application_no: '1046' } });
  if (!sozniCraft) {
    sozniCraft = await prisma.giCraft.create({ data: { canonical_name: 'Kashmir Sozani Embroidery', gi_application_no: '1046', category: 'Textiles' } });
  }

  const sourceGovt1 = await prisma.source.create({ data: { source_title: 'State Award List 1999', source_type: 'Government Publication', source_agency: 'Govt of J&K' }});
  const sourceGovt2 = await prisma.source.create({ data: { source_title: 'National Awardees 2012', source_type: 'Government Publication', source_agency: 'Ministry of Textiles' }});
  const sourceGovt3 = await prisma.source.create({ data: { source_title: 'Pehchan Directory', source_type: 'Database', source_agency: 'Handicrafts Dept' }});

  const a1 = await prisma.masterArtisan.create({
    data: { khcrf_master_id: 'KHCRF-MA-1001', artisan_name: 'Abdul Rashid Dar', gender: 'Male', status: 'Living', practice_status: 'Active', district: 'Budgam', craftlore_id: kaniCraft.id, reconciliation_status: 'Verified', evidence_grade: 'A+', government_verified: true, khcrf_verified: true,
      awards: { create: [{ award_name: 'National Award', award_year: 2012, award_level: 'NATIONAL_AWARD', source_id: sourceGovt2.id }, { award_name: 'State Award', award_year: 1999, award_level: 'STATE_AWARD', source_id: sourceGovt1.id }] },
      identifiers: { create: [{ identifier_type: 'PEHCHAN', identifier_value: 'PCH-K-001', source_id: sourceGovt3.id }] },
      gi_authorizations: { create: [{ craft_id: kaniCraft.id, gi_authorized_user_id: 'AU-KANI-008', source_id: sourceGovt3.id }] },
      assertions: { create: [{ field_name: 'artisan_name', raw_value: 'Abdul Rashid', source_id: sourceGovt1.id, is_canonical: false, confidence: 90, reconciliation_reason: 'Missing surname' }, { field_name: 'artisan_name', raw_value: 'Abdul Rashid Dar', source_id: sourceGovt2.id, is_canonical: true, confidence: 99 }] }
    }
  });

  await prisma.masterArtisan.create({
    data: { khcrf_master_id: 'KHCRF-MA-1002', artisan_name: 'Ghulam Mohammad Bhat (Unresolved)', gender: 'Male', status: 'Unknown', district: 'Srinagar', craftlore_id: sozniCraft.id, reconciliation_status: 'Conflicted', evidence_grade: 'C',
      assertions: { create: [{ field_name: 'artisan_name', raw_value: 'Gh. Mohd Bhat', source_id: sourceGovt1.id, is_canonical: false }, { field_name: 'artisan_name', raw_value: 'Gull Mohamad Batt', source_id: sourceGovt3.id, is_canonical: false }] }
    }
  });

  await prisma.masterArtisan.create({
    data: { khcrf_master_id: 'KHCRF-MA-1003', artisan_name: 'Lateef Ahmad', gender: 'Male', status: 'Deceased', practice_status: 'Retired', district: 'Srinagar', craftlore_id: kaniCraft.id, reconciliation_status: 'Verified',
      awards: { create: [{ award_name: 'National Award', award_year: 1985, award_level: 'NATIONAL_AWARD', source_id: sourceGovt1.id }] }
    }
  });

  await prisma.masterArtisan.create({ data: { khcrf_master_id: 'KHCRF-MA-1004', artisan_name: 'Fatima Begum', gender: 'Female', status: 'Living', district: 'Ganderbal', craftlore_id: sozniCraft.id, awards: { create: [{ award_name: 'State Award', award_year: 2018, award_level: 'STATE_AWARD', source_id: sourceGovt2.id }] } } });

  await prisma.masterArtisan.create({ data: { khcrf_master_id: 'KHCRF-MA-1005', artisan_name: 'Tariq Ali', status: 'Living', district: 'Srinagar', craftlore_id: kaniCraft.id, pehchan_verified: true, identifiers: { create: [{ identifier_type: 'PEHCHAN', identifier_value: 'PCH-K-105' }] } } });

  await prisma.masterArtisan.create({ data: { khcrf_master_id: 'KHCRF-MA-1006', artisan_name: 'Bilal Ahmad', status: 'Living', district: 'Budgam', craftlore_id: sozniCraft.id, gi_verified: true, gi_authorizations: { create: [{ craft_id: sozniCraft.id, gi_authorized_user_id: 'AU-SOZ-044' }] } } });

  await prisma.masterArtisan.create({ data: { khcrf_master_id: 'KHCRF-MA-1007', artisan_name: 'Riyaz Wani', status: 'Living', district: 'Srinagar', craftlore_id: kaniCraft.id, pehchan_verified: true, gi_verified: true, identifiers: { create: [{ identifier_type: 'PEHCHAN', identifier_value: 'PCH-K-777' }] }, gi_authorizations: { create: [{ craft_id: kaniCraft.id, gi_authorized_user_id: 'AU-KANI-777' }] } } });

  const a8 = await prisma.masterArtisan.create({ data: { khcrf_master_id: 'KHCRF-MA-1008', artisan_name: 'Zubair Dar', status: 'Living', practice_status: 'Emerging', district: 'Budgam', craftlore_id: kaniCraft.id } });
  
  await prisma.masterArtisan.create({ data: { khcrf_master_id: 'KHCRF-MA-1009', artisan_name: 'Mohammad Shafi', status: 'Living', district: 'Srinagar', craftlore_id: sozniCraft.id, sources: { connect: [{ id: sourceGovt1.id }, { id: sourceGovt2.id }, { id: sourceGovt3.id }] } } });

  await prisma.masterArtisan.create({ data: { khcrf_master_id: 'KHCRF-MA-1010', artisan_name: 'Farooq Lone', status: 'Unknown', district: 'Anantnag', craftlore_id: kaniCraft.id } });

  await prisma.masterArtisan.create({ data: { khcrf_master_id: 'KHCRF-MA-1011', artisan_name: 'Shabir Hussain', status: 'Living', district: 'Srinagar', craftlore_id: sozniCraft.id, evidence_grade: 'A+', awards: { create: [{ award_name: 'Shilp Guru', award_level: 'SHILP_GURU', award_year: 2015 }] } } });

  await prisma.masterArtisan.create({ data: { khcrf_master_id: 'KHCRF-MA-1012', artisan_name: 'Ali Mohammad (Historical)', status: 'Historical Only', district: 'Srinagar', craftlore_id: kaniCraft.id, evidence_grade: 'C', awards: { create: [{ award_name: 'State Award', award_level: 'STATE_AWARD', award_year: 1968 }] } } });

  const a13 = await prisma.masterArtisan.create({ data: { khcrf_master_id: 'KHCRF-MA-1013', artisan_name: 'Nisar Ahmed', status: 'Living', district: 'Budgam', craftlore_id: kaniCraft.id, } });
  
  await prisma.masterArtisan.create({ data: { khcrf_master_id: 'KHCRF-MA-1014', artisan_name: 'Mohiuddin', status: 'Historical Only', district: 'Pulwama', craftlore_id: sozniCraft.id, government_verified: false, khcrf_verified: false } });

  await prisma.masterArtisan.create({ data: { khcrf_master_id: 'KHCRF-MA-1015', artisan_name: 'Saima', gender: 'Female', status: 'Living', practice_status: 'Emerging', district: 'Srinagar', craftlore_id: sozniCraft.id, } });

  console.log('Seeded 15 artisans.');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
