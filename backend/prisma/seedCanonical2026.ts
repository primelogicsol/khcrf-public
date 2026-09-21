import { prisma } from '../src/config/db.js';

async function seedCanonical() {
  console.log('=== SEEDING FULL 21 CANONICAL 2026 EVENTS ===');
  // Trigger deployment for production seed

  let cycle = await prisma.assessmentCycle.findFirst({
    where: { year: 2026 }
  });
  
  if (!cycle) {
    cycle = await prisma.assessmentCycle.create({
      data: {
        year: 2026,
        status: 'ACTIVE',
        name: 'State of Kashmir Crafts 2026',
        slug: 'state-of-kashmir-crafts-2026'
      }
    });
  }
  const assessmentCycleId = cycle.id;

  const events = [
    {
      code: 'REGISTRATION_OPENS',
      title: 'Stakeholder Registration Opens',
      slug: 'stakeholder-registration-opens-17-aug-2026',
      fullDescription: 'Official opening of individual and institutional stakeholder registration across all 10 districts.',
      shortSummary: 'Official opening of individual and institutional stakeholder registration.',
      district: 'Srinagar',
      venueName: 'HCRF Participation Portal',
      startAt: new Date('2026-08-17T11:00:00+05:30'),
      endAt: new Date('2026-08-17T15:00:00+05:30'),
      status: 'REGISTRATION_OPEN',
      timezone: 'Asia/Kolkata'
    },
    {
      code: 'PARTICIPATION_OPENS',
      title: 'Public Participation Opens',
      slug: 'public-participation-opens-17-aug-2026',
      fullDescription: 'Opening of structured surveys, questionnaires, and consultation response forms.',
      shortSummary: 'Opening of structured surveys and questionnaires for all craft roles.',
      district: 'Srinagar',
      venueName: 'HCRF Participation Portal',
      startAt: new Date('2026-08-17T11:00:00+05:30'),
      endAt: new Date('2026-08-17T15:00:00+05:30'),
      status: 'REGISTRATION_OPEN',
      timezone: 'Asia/Kolkata'
    },
    {
      code: 'HEARING_ORIENTATION',
      title: 'Public Hearing Orientation',
      slug: 'public-hearing-orientation-25-aug-2026',
      fullDescription: 'Orientation session detailing public hearing guidelines, testimony submission rules, and district schedule.',
      shortSummary: 'Orientation detailing hearing guidelines and testimony submission rules.',
      district: 'Srinagar',
      venueName: 'HCRF Secretariat, Srinagar',
      startAt: new Date('2026-08-25T11:00:00+05:30'),
      endAt: new Date('2026-08-25T15:00:00+05:30'),
      status: 'REGISTRATION_OPEN',
      timezone: 'Asia/Kolkata'
    },
    {
      code: 'HEARING_PASHMINA',
      title: 'Future of Pashmina',
      slug: 'future-of-pashmina-05-sept-2026',
      fullDescription: 'Public hearing on Pashmina preservation, artisan protection, authenticity, production systems and sector modernization.',
      shortSummary: 'Public hearing on Pashmina preservation, artisan protection, authenticity, production systems and sector modernization.',
      district: 'Srinagar',
      venueName: 'Srinagar / In Person',
      startAt: new Date('2026-09-05T11:00:00+05:30'),
      endAt: new Date('2026-09-05T15:00:00+05:30'),
      status: 'REGISTRATION_OPEN',
      timezone: 'Asia/Kolkata'
    },
    {
      code: 'HEARING_CARPETS_KANI',
      title: 'Carpets & Kani',
      slug: 'carpets-and-kani-12-sept-2026',
      fullDescription: 'In-person hearing evaluating carpet loom clusters, Kani weaving heritage, and artisan livelihoods.',
      shortSummary: 'Evaluating carpet loom clusters and Kani weaving heritage.',
      district: 'Budgam',
      venueName: 'Budgam',
      startAt: new Date('2026-09-12T11:00:00+05:30'),
      endAt: new Date('2026-09-12T15:00:00+05:30'),
      status: 'REGISTRATION_OPEN',
      timezone: 'Asia/Kolkata'
    },
    {
      code: 'HEARING_ARTISAN_LIVELIHOODS',
      title: 'Artisan Livelihoods',
      slug: 'artisan-livelihoods-19-sept-2026',
      fullDescription: 'Special public hearing focusing on artisan wage protection, healthcare access, and weaver welfare.',
      shortSummary: 'Special public hearing on artisan wages, healthcare, and weaver welfare.',
      district: 'Anantnag',
      venueName: 'Anantnag',
      startAt: new Date('2026-09-19T11:00:00+05:30'),
      endAt: new Date('2026-09-19T15:00:00+05:30'),
      status: 'REGISTRATION_OPEN',
      timezone: 'Asia/Kolkata'
    },
    {
      code: 'HEARING_DIGITAL_MARKETS',
      title: 'Digital Craft Markets',
      slug: 'digital-craft-markets-07-nov-2026',
      fullDescription: 'Online hearing focusing on e-commerce platforms, digital payments, direct-to-consumer sales, and marketing.',
      shortSummary: 'Focusing on e-commerce platforms, digital payments, and direct sales.',
      district: 'Online Hearing Room',
      venueName: 'Online Hearing Room',
      startAt: new Date('2026-11-07T11:00:00+05:30'),
      endAt: new Date('2026-11-07T15:00:00+05:30'),
      status: 'UPCOMING',
      timezone: 'Asia/Kolkata'
    },
    {
      code: 'HEARING_GI_AUTHENTICITY',
      title: 'GI & Authenticity',
      slug: 'gi-and-authenticity-03-oct-2026',
      fullDescription: 'Hybrid hearing investigating Geographical Indication enforcement, testing labs, and anti-counterfeit protection.',
      shortSummary: 'Investigating GI enforcement, testing labs, and anti-counterfeit protection.',
      district: 'Srinagar',
      venueName: 'HCRF Secretariat, Srinagar',
      startAt: new Date('2026-10-03T11:00:00+05:30'),
      endAt: new Date('2026-10-03T15:00:00+05:30'),
      status: 'REGISTRATION_OPEN',
      timezone: 'Asia/Kolkata'
    },
    {
      code: 'HEARING_WOMEN_CRAFTS',
      title: 'Women in Crafts',
      slug: 'women-in-crafts-10-oct-2026',
      fullDescription: 'In-person hearing examining spinning cooperatives, wage parity, financial autonomy, and women-led enterprise.',
      shortSummary: 'Examining spinning cooperatives, wage parity, and financial autonomy.',
      district: 'Pulwama',
      venueName: 'Pulwama',
      startAt: new Date('2026-10-10T11:00:00+05:30'),
      endAt: new Date('2026-10-10T15:00:00+05:30'),
      status: 'REGISTRATION_OPEN',
      timezone: 'Asia/Kolkata'
    },
    {
      code: 'HEARING_FINANCE',
      title: 'Craft Finance',
      slug: 'craft-finance-17-oct-2026',
      fullDescription: 'Hearing evaluating credit facilities, working capital, micro-loans, insurance, and banking access for artisans.',
      shortSummary: 'Evaluating credit facilities, working capital, and banking access.',
      district: 'Srinagar',
      venueName: 'Srinagar',
      startAt: new Date('2026-10-17T11:00:00+05:30'),
      endAt: new Date('2026-10-17T15:00:00+05:30'),
      status: 'REGISTRATION_OPEN',
      timezone: 'Asia/Kolkata'
    },
    {
      code: 'HEARING_RAW_MATERIALS',
      title: 'Raw Material Access',
      slug: 'raw-material-access-26-sept-2026',
      fullDescription: 'Hearing addressing raw material procurement, timber supply, silk yarn availability, and price stabilization.',
      shortSummary: 'Addressing raw material procurement and price stabilization.',
      district: 'Shopian',
      venueName: 'Shopian',
      startAt: new Date('2026-09-26T11:00:00+05:30'),
      endAt: new Date('2026-09-26T15:00:00+05:30'),
      status: 'REGISTRATION_OPEN',
      timezone: 'Asia/Kolkata'
    },
    {
      code: 'HEARING_HERITAGE',
      title: 'Heritage Conservation',
      slug: 'heritage-conservation-31-oct-2026',
      fullDescription: 'In-person hearing on museum documentation, antique preservation, rare technique archiving, and heritage zones.',
      shortSummary: 'In-person hearing on museum documentation and antique preservation.',
      district: 'Anantnag',
      venueName: 'Anantnag',
      startAt: new Date('2026-10-31T11:00:00+05:30'),
      endAt: new Date('2026-10-31T15:00:00+05:30'),
      status: 'REGISTRATION_OPEN',
      timezone: 'Asia/Kolkata'
    },
    {
      code: 'HEARING_EDUCATION',
      title: 'Education & Skills',
      slug: 'education-and-skills-24-oct-2026',
      fullDescription: 'Hybrid hearing evaluating craft design institutes, master-apprentice training, youth talent, and vocational integration.',
      shortSummary: 'Evaluating craft design institutes and master-apprentice training.',
      district: 'Srinagar',
      venueName: 'HCRF Secretariat, Srinagar',
      startAt: new Date('2026-10-24T11:00:00+05:30'),
      endAt: new Date('2026-10-24T15:00:00+05:30'),
      status: 'REGISTRATION_OPEN',
      timezone: 'Asia/Kolkata'
    },
    {
      code: 'HEARING_TECH_DESIGN',
      title: 'Technology & Design',
      slug: 'technology-and-design-14-nov-2026',
      fullDescription: 'In-person hearing on CAD integration, modern design innovation, tool modernization, and technical prototyping.',
      shortSummary: 'Hearing on CAD integration, design innovation, and technical prototyping.',
      district: 'Srinagar',
      venueName: 'Srinagar',
      startAt: new Date('2026-11-14T11:00:00+05:30'),
      endAt: new Date('2026-11-14T15:00:00+05:30'),
      status: 'UPCOMING',
      timezone: 'Asia/Kolkata'
    },
    {
      code: 'HEARING_GLOBAL_MARKETS',
      title: 'Global Craft Markets',
      slug: 'global-craft-markets-21-nov-2026',
      fullDescription: 'Online hearing addressing global export tariffs, international trade corridors, subthemes on exports, and e-commerce logistics.',
      shortSummary: 'Online hearing on global export tariffs, trade corridors, and logistics.',
      district: 'Online Hearing Room',
      venueName: 'Online Hearing Room',
      startAt: new Date('2026-11-21T11:00:00+05:30'),
      endAt: new Date('2026-11-21T15:00:00+05:30'),
      status: 'UPCOMING',
      timezone: 'Asia/Kolkata'
    },
    {
      code: 'HEARING_CLIMATE',
      title: 'Climate & Sustainability',
      slug: 'climate-and-sustainability-28-nov-2026',
      fullDescription: 'In-person hearing evaluating eco-friendly dyes, sustainable raw material sourcing, and climate resiliency for craft clusters.',
      shortSummary: 'Evaluating eco-friendly dyes, sustainable sourcing, and climate resiliency.',
      district: 'Ganderbal',
      venueName: 'Ganderbal',
      startAt: new Date('2026-11-28T11:00:00+05:30'),
      endAt: new Date('2026-11-28T15:00:00+05:30'),
      status: 'UPCOMING',
      timezone: 'Asia/Kolkata'
    },
    {
      code: 'SUBMISSION_DEADLINE',
      title: 'Final Written Testimony and Evidence Submission Deadline',
      slug: 'final-submission-deadline',
      shortSummary: 'Final deadline for all written testimonies and evidence submissions.',
      fullDescription: 'Final deadline for all written testimonies and evidence submissions.',
      venueName: 'Online',
      district: 'All',
      startAt: new Date('2026-11-28T23:59:00+05:30'),
      endAt: new Date('2026-11-28T23:59:59+05:30'),
      status: 'UPCOMING',
      timezone: 'Asia/Kolkata'
    },
    {
      code: 'DRAFT_REVIEW',
      title: 'Draft Findings Review',
      slug: 'draft-findings-review-08-dec-2026',
      fullDescription: 'Hybrid review of preliminary assessment draft chapters opened for public commentary.',
      shortSummary: 'Hybrid review of preliminary assessment draft chapters.',
      district: 'Srinagar',
      venueName: 'HCRF Secretariat, Srinagar',
      startAt: new Date('2026-12-08T11:00:00+05:30'),
      endAt: new Date('2026-12-08T15:00:00+05:30'),
      status: 'UPCOMING',
      timezone: 'Asia/Kolkata'
    },
    {
      code: 'STAKEHOLDER_VALIDATION',
      title: 'Stakeholder Validation',
      slug: 'stakeholder-validation-18-dec-2026',
      fullDescription: 'Online validation round across 10 districts to verify numbers and regional findings.',
      shortSummary: 'Online validation round across 10 districts.',
      district: 'Validation Portal',
      venueName: 'Validation Portal',
      startAt: new Date('2026-12-18T11:00:00+05:30'),
      endAt: new Date('2026-12-18T15:00:00+05:30'),
      status: 'UPCOMING',
      timezone: 'Asia/Kolkata'
    },
    {
      code: 'EXPERT_REVIEW',
      title: 'Expert Review Meeting',
      slug: 'expert-review-meeting-22-dec-2026',
      fullDescription: 'Oversight panel and advisory expert review meeting of final assessment draft.',
      shortSummary: 'Oversight panel and advisory expert review meeting.',
      district: 'Srinagar',
      venueName: 'HCRF Secretariat, Srinagar',
      startAt: new Date('2026-12-22T11:00:00+05:30'),
      endAt: new Date('2026-12-22T15:00:00+05:30'),
      status: 'UPCOMING',
      timezone: 'Asia/Kolkata'
    },
    {
      code: 'FINAL_REPORT',
      title: 'Final Report Tabled and Published',
      slug: 'final-report-tabled-29-dec-2026',
      fullDescription: 'Official online tabling of the State of Kashmir Crafts 2026 Final Assessment Report on the website.',
      shortSummary: 'Official online tabling of the State of Kashmir Crafts 2026 Final Assessment Report.',
      district: 'State of Kashmir Crafts Website',
      venueName: 'State of Kashmir Crafts Website',
      startAt: new Date('2026-12-29T11:00:00+05:30'),
      endAt: new Date('2026-12-29T15:00:00+05:30'),
      status: 'UPCOMING',
      timezone: 'Asia/Kolkata'
    }
  ];

  let createdCount = 0;
  let updatedCount = 0;

  for (const item of events) {
    const payload = {
      ...item,
      assessmentCycleId
    };

    await prisma.skcHearing.upsert({
      where: {
        slug: item.slug
      },
      update: payload,
      create: payload
    });
    createdCount++;
  }

  console.log(`Canonical 2026 public hearings seed completed. Upserted Total: ${createdCount}`);
}

seedCanonical()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedMasterArtisans() {
  console.log('=== SEEDING MASTER ARTISANS ===');
  const snapshotPath = path.join(__dirname, 'master_artisan_export_20260915.json');
  if (!fs.existsSync(snapshotPath)) {
    console.log('Snapshot not found:', snapshotPath);
    return;
  }
  const raw = fs.readFileSync(snapshotPath, 'utf8');
  const data = JSON.parse(raw);
  if (!data.records || !Array.isArray(data.records)) return;

  for (const record of data.records) {
    try {
      await prisma.masterArtisan.upsert({
        where: { id: record.id },
        update: {
          khcrf_master_id: record.khcrf_master_id,
          artisan_name: record.artisan_name,
          district: record.district,
          gender: record.gender,
          status: record.status,
        },
        create: {
          id: record.id,
          khcrf_master_id: record.khcrf_master_id,
          artisan_name: record.artisan_name,
          district: record.district,
          gender: record.gender,
          status: record.status,
        }
      });
    } catch(e) {
      console.log('Error seeding artisan:', record.artisan_name, e.message);
    }
  }
  console.log('Finished seeding master artisans.');
}
seedMasterArtisans().then(() => seedWorkshopsAndAwards()).catch(console.error);

  async function seedWorkshopsAndAwards() {
    console.log("=== SEEDING WORKSHOPS AND AWARDS ===");
    const fs2 = require("fs");
    const path2 = require("path");
    
    // Seed Workshops
    try {
      const wPath = path2.join(__dirname, "workshops_export.json");
      if (fs2.existsSync(wPath)) {
        const workshops = JSON.parse(fs2.readFileSync(wPath, "utf8"));
        for (const w of workshops) {
          w.primary_craft_id = null; // Bypass FK constraint if Craft table is empty
          await prisma.workshopCommunity.upsert({
            where: { id: w.id },
            update: w,
            create: w
          });
        }
        console.log("Seeded " + workshops.length + " workshops.");
      }
    } catch (e) {
      console.log("Error seeding workshops:", e.message);
    }

    // Seed Awards
    try {
      const aPath = path2.join(__dirname, "awards_export.json");
      if (fs2.existsSync(aPath)) {
        const awards = JSON.parse(fs2.readFileSync(aPath, "utf8"));
        for (const a of awards) {
          a.source_id = null; // Bypass FK constraint if Source table is empty
          a.normalized_craft_id = null; // Bypass FK constraint if GiCraft table is empty or mismatched
          await prisma.artisanAward.upsert({
            where: { id: a.id },
            update: a,
            create: a
          });
        }
        console.log("Seeded " + awards.length + " awards.");
      }
    } catch (e) {
      console.log("Error seeding awards:", e.message);
    }

    // Seed Award Recipients
    try {
      const arPath = path2.join(__dirname, "award_recipients_export.json");
      if (fs2.existsSync(arPath)) {
        const recipients = JSON.parse(fs2.readFileSync(arPath, "utf8"));
        for (const ar of recipients) {
          await prisma.artisanAwardRecipient.upsert({
            where: { id: ar.id },
            update: ar,
            create: ar
          });
        }
        console.log("Seeded " + recipients.length + " award recipients.");
      }
    } catch (e) {
      console.log("Error seeding award recipients:", e.message);
    }
  }

async function seedMagazineArchive() {
  console.log('Seeding canonical 6 magazine issues...');
  await prisma.magazineIssue.deleteMany({});
  
  const issues = [
    {
      issueNumber: '006',
      title: 'The Last Masters',
      slug: 'the-last-masters-006',
      subtitle: 'Preserving the final lineage of Kani master weavers.',
      coverImage: '/assets/images/crafts/kani-weaving.jpg',
      coverImageAlt: 'Kani weaver at loom',
      edition: 'Autumn 2026',
      shortDescription: 'An unprecedented documentary journey into the workshops of Kashmir’s most reclusive Kani weavers, documenting techniques that have survived for four centuries.',
      featureHighlights: ['14 STORIES', '08 ARTISANS', '05 CRAFTS'],
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      publishedAt: new Date('2026-10-15T00:00:00Z'),
      featuredCraft: 'Kani Weaving',
      featuredCraftName: 'Kani Weaving',
      publicationMasthead: 'KHCRF PRESS',
      heroEyebrow: 'KHCRF MASTER ARTISANS',
    },
    {
      issueNumber: '005',
      title: 'Carved in Walnut',
      slug: 'carved-in-walnut-005',
      subtitle: 'The architectural legacy of Srinagar.',
      coverImage: '/assets/images/crafts/khatamband.jpg',
      coverImageAlt: 'Intricate walnut wood carving',
      edition: 'Summer 2026',
      shortDescription: 'Exploring the intricate Khatamband ceilings and Pinjrakari lattices that define the historic architectural character of downtown Srinagar.',
      featureHighlights: ['12 STORIES', '06 ARTISANS', '02 CRAFTS'],
      status: 'PUBLISHED',
      visibility: 'MEMBERS_ONLY',
      publishedAt: new Date('2026-07-20T00:00:00Z'),
      featuredCraft: 'Woodwork',
      featuredCraftName: 'Woodwork',
      publicationMasthead: 'KHCRF PRESS',
      heroEyebrow: 'MEMBERS ARCHIVE',
    },
    {
      issueNumber: '004',
      title: 'The Paper Alchemists',
      slug: 'paper-alchemists-004',
      subtitle: 'Sakhta and Naqashi in modern practice.',
      coverImage: '/assets/images/crafts/papier-mache.jpg',
      coverImageAlt: 'Papier-mache artisan painting',
      edition: 'Spring 2026',
      shortDescription: 'A deep dive into the dual disciplines of Sakhta (base making) and Naqashi (painting) that comprise true Kashmiri Papier-Mache.',
      featureHighlights: ['08 STORIES', '10 ARTISANS', '01 CRAFT'],
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      publishedAt: new Date('2026-04-10T00:00:00Z'),
      featuredCraft: 'Papier-Mache',
      featuredCraftName: 'Papier-Mache',
      publicationMasthead: 'KHCRF PRESS',
      heroEyebrow: 'KHCRF MASTER ARTISANS',
    },
    {
      issueNumber: '003',
      title: 'Threads of Empire',
      slug: 'threads-of-empire-003',
      subtitle: 'Pashmina\'s journey from the Himalayas.',
      coverImage: '/assets/images/crafts/pashmina.jpg',
      coverImageAlt: 'Spun pashmina yarn',
      edition: 'Winter 2025',
      shortDescription: 'Tracing the provenance of genuine Pashmina from the Changthang plateau to the spinning wheels and looms of Kashmir valleys.',
      featureHighlights: ['15 STORIES', '12 ARTISANS', '03 CRAFTS'],
      status: 'PUBLISHED',
      visibility: 'MEMBERS_ONLY',
      publishedAt: new Date('2025-12-05T00:00:00Z'),
      featuredCraft: 'Pashmina',
      featuredCraftName: 'Pashmina',
      publicationMasthead: 'KHCRF PRESS',
      heroEyebrow: 'MEMBERS ARCHIVE',
    },
    {
      issueNumber: '002',
      title: 'The Hands That Remember',
      slug: 'hands-that-remember-002',
      subtitle: 'Transmission of workshop knowledge.',
      coverImage: '/assets/images/crafts/copperware.jpg',
      coverImageAlt: 'Copperware being engraved',
      edition: 'Autumn 2025',
      shortDescription: 'An examination of the oral transmission of complex geometric and botanical engraving patterns across generations of Copperware masters.',
      featureHighlights: ['09 STORIES', '04 ARTISANS', '02 CRAFTS'],
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      publishedAt: new Date('2025-09-15T00:00:00Z'),
      featuredCraft: 'Copperware',
      featuredCraftName: 'Copperware',
      publicationMasthead: 'KHCRF PRESS',
      heroEyebrow: 'KHCRF MASTER ARTISANS',
    },
    {
      issueNumber: '001',
      title: 'The Foundation Issue',
      slug: 'foundation-issue-001',
      subtitle: 'Establishing the institutional record.',
      coverImage: '/assets/images/crafts/carpet-weaving.jpg',
      coverImageAlt: 'Carpet weaving talim',
      edition: 'Summer 2025',
      shortDescription: 'Our inaugural documentary edition establishing the framework for preserving Kashmir\'s master artisan lineage and traditional craft knowledge.',
      featureHighlights: ['10 STORIES', '05 ARTISANS', '04 CRAFTS'],
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      publishedAt: new Date('2025-06-20T00:00:00Z'),
      featuredCraft: 'Carpet Weaving',
      featuredCraftName: 'Carpet Weaving',
      publicationMasthead: 'KHCRF PRESS',
      heroEyebrow: 'KHCRF MASTER ARTISANS',
    }
  ];

  for (const issue of issues) {
    await prisma.magazineIssue.create({ data: issue });
  }
  console.log('Finished seeding magazine issues.');
}

seedMagazineArchive().catch(console.error);
