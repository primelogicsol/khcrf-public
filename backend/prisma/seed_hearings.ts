import { prisma } from '../src/config/db';

async function main() {
  console.log('Seeding Hearing Taxonomies and Calendar Events (2026)...');

  // 1. Assessment Cycle
  const cycle = await prisma.assessmentCycle.upsert({
    where: { slug: '2026-cycle' },
    update: {},
    create: {
      name: '2026 Public Assessment',
      year: 2026,
      slug: '2026-cycle',
      status: 'ACTIVE',
      isActive: true,
    }
  });

  // 2. Districts
  const districtsList = ['Srinagar', 'Ganderbal', 'Budgam', 'Anantnag', 'Baramulla', 'Kupwara', 'Pulwama', 'Shopian', 'Bandipora', 'Kulgam'];
  const districtMap: Record<string, any> = {};
  for (let i = 0; i < districtsList.length; i++) {
    const d = await prisma.district.upsert({
      where: { name: districtsList[i] },
      update: {},
      create: { name: districtsList[i], slug: districtsList[i].toLowerCase(), displayOrder: i }
    });
    districtMap[districtsList[i]] = d;
  }

  // 3. Hearing Types
  const typesList = ['District Hearing', 'Craft-Specific Hearing', 'Thematic Hearing', 'Institutional Hearing', 'Expert Hearing', 'Launch Event', 'Internal Milestone'];
  const typeMap: Record<string, any> = {};
  for (let i = 0; i < typesList.length; i++) {
    const slug = typesList[i].toLowerCase().replace(/\s+/g, '-');
    const t = await prisma.hearingType.upsert({
      where: { name: typesList[i] },
      update: {},
      create: { name: typesList[i], slug: slug, displayOrder: i }
    });
    typeMap[typesList[i]] = t;
  }

  // 4. Hearing Formats
  const formatsList = ['In Person', 'Virtual', 'Hybrid'];
  const formatMap: Record<string, any> = {};
  for (let i = 0; i < formatsList.length; i++) {
    const slug = formatsList[i].toLowerCase().replace(/\s+/g, '-');
    const f = await prisma.hearingFormat.upsert({
      where: { name: formatsList[i] },
      update: {},
      create: { name: formatsList[i], slug: slug, displayOrder: i }
    });
    formatMap[formatsList[i]] = f;
  }

  // 5. Clean existing themes, categories, and hearings
  console.log('Clearing existing records...');
  await prisma.hearingThemeAssignment.deleteMany({});
  await prisma.consultationTheme.deleteMany({});
  await prisma.consultationCategory.deleteMany({});
  await prisma.skcHearing.deleteMany({});

  // 5a. Seed Consultation Categories
  const categoriesList = [
    { name: 'HERITAGE & AUTHENTICITY', slug: 'heritage-authenticity', summary: 'Traditional crafts, authenticity and cultural preservation.' },
    { name: 'PEOPLE & LIVELIHOODS', slug: 'people-livelihoods', summary: 'Participation, livelihoods, skills and inclusion.' },
    { name: 'MARKETS & ECONOMY', slug: 'markets-economy', summary: 'Markets, exports, finance and commerce.' },
    { name: 'INNOVATION & SUSTAINABILITY', slug: 'innovation-sustainability', summary: 'Innovation, sustainability and policy.' }
  ];
  const categoryMap: Record<string, any> = {};
  for (let i = 0; i < categoriesList.length; i++) {
    const c = await prisma.consultationCategory.upsert({
      where: { name: categoriesList[i].name },
      update: {},
      create: {
        name: categoriesList[i].name,
        slug: categoriesList[i].slug,
        summary: categoriesList[i].summary,
        displayOrder: i
      }
    });
    categoryMap[categoriesList[i].name] = c;
  }

  // 5b. Seed Consultation Themes (Flagship Themes)
  const themesData = [
    // Heritage
    { title: "Future of Pashmina", slug: "future-of-pashmina", category: "HERITAGE & AUTHENTICITY", summary: "Public hearing programme for sector modernization", progress: 35, displayOrder: 1, nextMilestoneDate: "10 Sep 2026", nextMilestoneLoc: "Srinagar", nextMilestoneMode: "Registration Open", currentStatus: "Registration Open" },
    { title: "Future of Carpets", slug: "future-of-carpets", category: "HERITAGE & AUTHENTICITY", summary: "Technology and export competitiveness consultation", progress: 0, displayOrder: 2, nextMilestoneDate: "20 Sep 2026", nextMilestoneLoc: "Budgam", nextMilestoneMode: "Planning", currentStatus: "Planning" },
    { title: "GI & Authenticity", slug: "gi-authenticity", category: "HERITAGE & AUTHENTICITY", summary: "Evidence framework for authenticity protection", progress: 10, displayOrder: 3, nextMilestoneDate: "05 Oct 2026", nextMilestoneLoc: "Secretariat, Srinagar", nextMilestoneMode: "Preparing", currentStatus: "Preparing" },
    { title: "Cultural Heritage", slug: "cultural-heritage", category: "HERITAGE & AUTHENTICITY", summary: "Documentation and safeguarding consultation", progress: 0, displayOrder: 4, nextMilestoneDate: "30 Oct 2026", nextMilestoneLoc: "Anantnag", nextMilestoneMode: "Planning", currentStatus: "Planning" },
    // People
    { title: "Women in Crafts", slug: "women-in-crafts", category: "PEOPLE & LIVELIHOODS", summary: "Regional consultation and leadership programme", progress: 5, displayOrder: 5, nextMilestoneDate: "10 Oct 2026", nextMilestoneLoc: "Pulwama", nextMilestoneMode: "Planning", currentStatus: "Planning" },
    { title: "Youth in Crafts", slug: "youth-in-crafts", category: "PEOPLE & LIVELIHOODS", summary: "Youth stakeholder engagement programme", progress: 20, displayOrder: 6, nextMilestoneDate: "Ongoing", nextMilestoneLoc: "Online Portal", nextMilestoneMode: "Artisan Registry", currentStatus: "Registration Open" },
    { title: "Artisan Livelihoods", slug: "artisan-livelihoods", category: "PEOPLE & LIVELIHOODS", summary: "Wage standards, livelihood security and welfare", progress: 15, displayOrder: 7, nextMilestoneDate: "30 Sep 2026", nextMilestoneLoc: "Anantnag", nextMilestoneMode: "Preparing", currentStatus: "Preparing" },
    { title: "Education & Skills", slug: "education-skills", category: "PEOPLE & LIVELIHOODS", summary: "Institutional training, apprenticeships and design schools", progress: 0, displayOrder: 8, nextMilestoneDate: "04 Nov 2026", nextMilestoneLoc: "Secretariat", nextMilestoneMode: "Curriculum Review", currentStatus: "Planning" },
    // Markets
    { title: "Exports", slug: "exports", category: "MARKETS & ECONOMY", summary: "Trade policy, customs and export corridors", progress: 0, displayOrder: 9, nextMilestoneDate: "05 Sep 2026", nextMilestoneLoc: "Srinagar", nextMilestoneMode: "First Consultation", currentStatus: "Planning" },
    { title: "Global Markets", slug: "global-markets", category: "MARKETS & ECONOMY", summary: "Global trade routes, custom structures and tariffs", progress: 0, displayOrder: 10, nextMilestoneDate: "09 Nov 2026", nextMilestoneLoc: "Secretariat", nextMilestoneMode: "Branding Assessment", currentStatus: "Planning" },
    { title: "Digital Commerce", slug: "digital-commerce", category: "MARKETS & ECONOMY", summary: "E-commerce onboarding, logistics and virtual branding", progress: 0, displayOrder: 11, nextMilestoneDate: "15 Sep 2026", nextMilestoneLoc: "Online", nextMilestoneMode: "Preparing", currentStatus: "Preparing" },
    { title: "Finance & Investment", slug: "finance-investment", category: "MARKETS & ECONOMY", summary: "Artisan credit cards, interest subsidies and microfinance", progress: 0, displayOrder: 12, nextMilestoneDate: "15 Oct 2026", nextMilestoneLoc: "Srinagar", nextMilestoneMode: "Planning", currentStatus: "Planning" },
    // Innovation
    { title: "Climate & Sustainability", slug: "climate-sustainability", category: "INNOVATION & SUSTAINABILITY", summary: "Environmental resilience and raw material review", progress: 15, displayOrder: 13, nextMilestoneDate: "25 Oct 2026", nextMilestoneLoc: "Ganderbal", nextMilestoneMode: "Preparing", currentStatus: "Preparing" },
    { title: "Raw Material Access", slug: "raw-material-access", category: "INNOVATION & SUSTAINABILITY", summary: "Pashmina and silk supply chain integrity review", progress: 0, displayOrder: 14, nextMilestoneDate: "20 Oct 2026", nextMilestoneLoc: "Shopian", nextMilestoneMode: "Planning", currentStatus: "Planning" },
    { title: "Technology & Design", slug: "technology-design", category: "INNOVATION & SUSTAINABILITY", summary: "Modern tools and design innovation frameworks", progress: 0, displayOrder: 15, nextMilestoneDate: "25 Sep 2026", nextMilestoneLoc: "Srinagar", nextMilestoneMode: "Planning", currentStatus: "Planning" },
    { title: "Policy & Governance", slug: "policy-governance", category: "INNOVATION & SUSTAINABILITY", summary: "Long-term development frameworks and structures", progress: 0, displayOrder: 16, nextMilestoneDate: "14 Nov 2026", nextMilestoneLoc: "Secretariat", nextMilestoneMode: "Draft Consultation", currentStatus: "Planning" }
  ];
  const themeMap: Record<string, any> = {};
  for (let i = 0; i < themesData.length; i++) {
    const td = themesData[i];
    const cat = categoryMap[td.category];
    const theme = await prisma.consultationTheme.create({
      data: {
        title: td.title,
        slug: td.slug,
        summary: td.summary,
        progress: td.progress,
        displayOrder: td.displayOrder,
        nextMilestoneDate: td.nextMilestoneDate,
        nextMilestoneLoc: td.nextMilestoneLoc,
        nextMilestoneMode: td.nextMilestoneMode,
        currentStatus: td.currentStatus,
        categoryId: cat ? cat.id : null,
        assessmentCycleId: cycle.id
      }
    });
    themeMap[td.slug] = theme;
  }

  // 6. Define Calendar Events (Hearings and Internal Milestones)
  const hearingsData = [
    // --- AUGUST (Internal Secretariat Work) ---
    {
      title: "Assessment Launch & Internal Briefing",
      date: "2026-08-05T10:00:00Z",
      type: "Launch Event",
      category: "Programme",
      venue: "Secretariat Assembly Hall",
      format: "Hybrid",
      status: "COMPLETED",
      district: "Srinagar",
      craft: "General",
      summary: "Official launch of the State of Kashmir Crafts Assessment 2026 and internal briefings."
    },
    {
      title: "Stakeholder Registry Activation & Approvals",
      date: "2026-08-10T10:00:00Z",
      type: "Expert Hearing",
      category: "Programme",
      venue: "Secretariat Board Room",
      format: "Hybrid",
      status: "COMPLETED",
      district: "Srinagar",
      craft: "General",
      summary: "Final approval and onboarding protocols for registered organizations and representatives."
    },
    {
      title: "Registration Portal & Outreach Launch",
      date: "2026-08-14T10:00:00Z",
      type: "Expert Hearing",
      category: "Programme",
      venue: "Secretariat Board Room",
      format: "Online",
      status: "COMPLETED",
      district: "Srinagar",
      craft: "General",
      summary: "Outreach and onboarding registry activations for public engagement paths."
    },
    {
      title: "Hearing Schedule Finalization",
      date: "2026-08-18T10:00:00Z",
      type: "Expert Hearing",
      category: "Programme",
      venue: "Secretariat Board Room",
      format: "Hybrid",
      status: "COMPLETED",
      district: "Srinagar",
      craft: "General",
      summary: "Final scheduling, dates validation, and coordination of the flagship hearings."
    },
    {
      title: "Venue Confirmations & Safety Inspections",
      date: "2026-08-21T10:00:00Z",
      type: "Expert Hearing",
      category: "Programme",
      venue: "Secretariat Board Room",
      format: "Hybrid",
      status: "COMPLETED",
      district: "Srinagar",
      craft: "General",
      summary: "Safety checks and physical coordination at selected regional venues."
    },
    {
      title: "Panel Invitations & Speakers Briefing",
      date: "2026-08-24T10:00:00Z",
      type: "Expert Hearing",
      category: "Programme",
      venue: "Secretariat Board Room",
      format: "Hybrid",
      status: "COMPLETED",
      district: "Srinagar",
      craft: "General",
      summary: "Formal panels setup, speakers onboarding, and testimony frameworks coordination."
    },
    {
      title: "Media Planning & Communication Campaign",
      date: "2026-08-27T10:00:00Z",
      type: "Expert Hearing",
      category: "Programme",
      venue: "Secretariat Board Room",
      format: "Online",
      status: "COMPLETED",
      district: "Srinagar",
      craft: "General",
      summary: "Public awareness campaign launch, media briefing kits distribution, and announcements."
    },
    {
      title: "Technical Rehearsals & Hybrid Stream Setup",
      date: "2026-08-30T10:00:00Z",
      type: "Expert Hearing",
      category: "Programme",
      venue: "Sher-i-Kashmir International Convention Centre",
      format: "Hybrid",
      status: "COMPLETED",
      district: "Srinagar",
      craft: "General",
      summary: "Dry-runs, soundcheck, and hybrid stream integration tests ahead of launch."
    },
    // --- SEPTEMBER (Flagship Hearings) ---
    {
      title: "Exports",
      date: "2026-09-05T10:00:00Z",
      type: "Thematic Hearing",
      category: "Markets & Economy",
      venue: "Exporters Council Hall",
      format: "Hybrid",
      status: "SCHEDULED",
      district: "Srinagar",
      craft: "General",
      summary: "Policy consultation on trade barriers, shipping tariffs, and international export corridor assessments."
    },
    {
      title: "Future of Pashmina",
      date: "2026-09-10T10:00:00Z",
      type: "Craft-Specific Hearing",
      category: "Heritage & Authenticity",
      venue: "Sher-i-Kashmir International Convention Centre",
      format: "Hybrid",
      status: "REGISTRATION_OPEN",
      district: "Srinagar",
      craft: "Pashmina",
      summary: "Public hearing programme for sector modernization, focusing on wages, spinning and supply chains."
    },
    {
      title: "Digital Commerce",
      date: "2026-09-15T10:00:00Z",
      type: "Thematic Hearing",
      category: "Markets & Economy",
      venue: "EDI Pampore Conference Hall",
      format: "Hybrid",
      status: "SCHEDULED",
      district: "Srinagar",
      craft: "General",
      summary: "Platform ecosystem roundtable covering direct-to-consumer e-commerce, global cataloging, and seller registration."
    },
    {
      title: "Future of Carpets",
      date: "2026-09-20T10:00:00Z",
      type: "Craft-Specific Hearing",
      category: "Heritage & Authenticity",
      venue: "Budgam Community Center",
      format: "In Person",
      status: "SCHEDULED",
      district: "Budgam",
      craft: "Carpets",
      summary: "Public hearing and export competitiveness roundtable for the carpet weaving community."
    },
    {
      title: "Technology & Design",
      date: "2026-09-25T10:00:00Z",
      type: "Thematic Hearing",
      category: "Innovation & Sustainability",
      venue: "National Institute of Fashion Technology (NIFT) Srinagar",
      format: "Hybrid",
      status: "SCHEDULED",
      district: "Srinagar",
      craft: "General",
      summary: "Innovation forum regarding modern product catalog designs and raw material adaptations."
    },
    {
      title: "Artisan Livelihoods",
      date: "2026-09-30T10:00:00Z",
      type: "District Hearing",
      category: "People & Livelihoods",
      venue: "Anantnag Weaver Cooperative Hall",
      format: "In Person",
      status: "SCHEDULED",
      district: "Anantnag",
      craft: "General",
      summary: "Socio-economic hearing looking at raw material access and artisan minimum wage recommendations."
    },
    {
      title: "Youth in Crafts",
      date: "2026-09-01T10:00:00Z",
      type: "Thematic Hearing",
      category: "People & Livelihoods",
      venue: "Online Portal",
      format: "Online",
      status: "REGISTRATION_OPEN",
      district: "All Districts",
      craft: "General",
      summary: "Ongoing youth stakeholder registration and engagement programme."
    },
    // --- OCTOBER (Flagship Hearings) ---
    {
      title: "GI & Authenticity",
      date: "2026-10-05T10:00:00Z",
      type: "Expert Hearing",
      category: "Heritage & Authenticity",
      venue: "Secretariat Assembly Hall",
      format: "Hybrid",
      status: "SCHEDULED",
      district: "Srinagar",
      craft: "General",
      summary: "Expert consultation on building a robust evidence framework for Geographical Indication and authenticity protection."
    },
    {
      title: "Women in Crafts",
      date: "2026-10-10T10:00:00Z",
      type: "Thematic Hearing",
      category: "People & Livelihoods",
      venue: "Pulwama Town Hall",
      format: "In Person",
      status: "SCHEDULED",
      district: "Pulwama",
      craft: "General",
      summary: "Public consultation on wage equity, healthcare access, and cooperative leadership for women artisans."
    },
    {
      title: "Finance & Investment",
      date: "2026-10-15T10:00:00Z",
      type: "Institutional Hearing",
      category: "Markets & Economy",
      venue: "JK Bank Corporate Headquarters",
      format: "Hybrid",
      status: "SCHEDULED",
      district: "Srinagar",
      craft: "General",
      summary: "Financial consultation exploring micro-credit products, artisan loans, and bank coordination strategies."
    },
    {
      title: "Raw Material Access",
      date: "2026-10-20T10:00:00Z",
      type: "Thematic Hearing",
      category: "Innovation & Sustainability",
      venue: "Shopian Community Hall",
      format: "In Person",
      status: "SCHEDULED",
      district: "Shopian",
      craft: "General",
      summary: "Regional hearing assessing pashmina, silk, and raw wool supply chains availability."
    },
    {
      title: "Climate & Sustainability",
      date: "2026-10-25T10:00:00Z",
      type: "Expert Hearing",
      category: "Innovation & Sustainability",
      venue: "Ganderbal Environment Station",
      format: "Hybrid",
      status: "SCHEDULED",
      district: "Ganderbal",
      craft: "General",
      summary: "Expert hearing assessing environmental resilience and local raw material shortages (wool, silk, dyes)."
    },
    {
      title: "Cultural Heritage",
      date: "2026-10-30T10:00:00Z",
      type: "Thematic Hearing",
      category: "Heritage & Authenticity",
      venue: "Anantnag Town Hall",
      format: "In Person",
      status: "SCHEDULED",
      district: "Anantnag",
      craft: "General",
      summary: "Heritage documentation workshop, oral history collection, and traditional design protection."
    },
    // --- NOVEMBER (Synthesis & Governance Activities) ---
    {
      title: "Education & Skills",
      date: "2026-11-04T10:00:00Z",
      type: "Institutional Hearing",
      category: "People & Livelihoods",
      venue: "Kashmir University Crafts Center",
      format: "Hybrid",
      status: "SCHEDULED",
      district: "Srinagar",
      craft: "General",
      summary: "Academic review of vocational schools, design curriculum, and artisan certification systems."
    },
    {
      title: "Global Markets",
      date: "2026-11-09T10:00:00Z",
      type: "Expert Hearing",
      category: "Markets & Economy",
      venue: "Secretariat Board Room",
      format: "Hybrid",
      status: "SCHEDULED",
      district: "Srinagar",
      craft: "General",
      summary: "International branding assessment, trade route analysis, and global market trends review."
    },
    {
      title: "Policy & Governance",
      date: "2026-11-14T10:00:00Z",
      type: "Institutional Hearing",
      category: "Innovation & Sustainability",
      venue: "Srinagar Secretariat Complex",
      format: "Hybrid",
      status: "SCHEDULED",
      district: "Srinagar",
      craft: "General",
      summary: "Draft framework consultation and legislative proposals review for long-term governance."
    },
    // --- NOVEMBER/DECEMBER (Evidence & Report Review Phases) ---
    {
      title: "Evidence Review Begins",
      date: "2026-11-18T10:00:00Z",
      type: "Internal Milestone",
      category: "Evidence Phase",
      venue: "Secretariat Board Room",
      format: "Hybrid",
      status: "INTERNAL_REVIEW",
      district: "Srinagar",
      craft: "General",
      summary: "Start of systematic intake collation and initial classification of evidence submissions."
    },
    {
      title: "Expert Evidence Panel",
      date: "2026-11-22T10:00:00Z",
      type: "Internal Milestone",
      category: "Evidence Phase",
      venue: "Secretariat Board Room",
      format: "Hybrid",
      status: "INTERNAL_REVIEW",
      district: "Srinagar",
      craft: "General",
      summary: "Secretariat panel convened to review technical testimony and research inputs."
    },
    {
      title: "Statistical Analysis Review",
      date: "2026-11-26T10:00:00Z",
      type: "Internal Milestone",
      category: "Evidence Phase",
      venue: "Secretariat Board Room",
      format: "Hybrid",
      status: "INTERNAL_REVIEW",
      district: "Srinagar",
      craft: "General",
      summary: "Review of quantitative data on artisan demographics, income, and export trends."
    },
    {
      title: "Draft Recommendation Workshop",
      date: "2026-12-02T10:00:00Z",
      type: "Internal Milestone",
      category: "Evidence Phase",
      venue: "Secretariat Board Room",
      format: "Hybrid",
      status: "INTERNAL_REVIEW",
      district: "Srinagar",
      craft: "General",
      summary: "Internal workshop drafting recommendations for the 2026 final report."
    },
    {
      title: "Advisory Council Review",
      date: "2026-12-08T10:00:00Z",
      type: "Internal Milestone",
      category: "Evidence Phase",
      venue: "Secretariat Board Room",
      format: "Hybrid",
      status: "INTERNAL_REVIEW",
      district: "Srinagar",
      craft: "General",
      summary: "Advisory Council evaluation of evidence reports and draft validation proposals."
    },
    {
      title: "Draft Report Validation",
      date: "2026-12-14T10:00:00Z",
      type: "Internal Milestone",
      category: "Report Phase",
      venue: "Secretariat Board Room",
      format: "Hybrid",
      status: "INTERNAL_REVIEW",
      district: "Srinagar",
      craft: "General",
      summary: "Reviewing feedback from expert groups and validating drafts for final edits."
    },
    {
      title: "Final Editorial Review",
      date: "2026-12-18T10:00:00Z",
      type: "Internal Milestone",
      category: "Report Phase",
      venue: "Secretariat Board Room",
      format: "Hybrid",
      status: "INTERNAL_REVIEW",
      district: "Srinagar",
      craft: "General",
      summary: "Final validation of references, footnotes, and bibliographic entries."
    },
    {
      title: "Advisory Council Approval",
      date: "2026-12-22T10:00:00Z",
      type: "Internal Milestone",
      category: "Report Phase",
      venue: "Secretariat Board Room",
      format: "Hybrid",
      status: "INTERNAL_REVIEW",
      district: "Srinagar",
      craft: "General",
      summary: "Official sign-off of the State of Kashmir Crafts 2026 Final Report by the Advisory Council."
    },
    {
      title: "Government Briefing",
      date: "2026-12-24T10:00:00Z",
      type: "Internal Milestone",
      category: "Report Phase",
      venue: "Secretariat Board Room",
      format: "Hybrid",
      status: "INTERNAL_REVIEW",
      district: "Srinagar",
      craft: "General",
      summary: "Briefing government stakeholders and policy directors on key findings."
    },
    {
      title: "State of Kashmir Crafts Report Released",
      date: "2026-12-28T10:00:00Z",
      type: "Internal Milestone",
      category: "Report Phase",
      venue: "Secretariat Board Room",
      format: "Hybrid",
      status: "INTERNAL_REVIEW",
      district: "Srinagar",
      craft: "General",
      summary: "Official release and public publication of the finalized 2026 assessment report."
    }
  ];

  for (let i = 0; i < hearingsData.length; i++) {
    const hd = hearingsData[i];
    const eventDate = new Date(hd.date);
    const endDate = new Date(eventDate.getTime() + (3 * 60 * 60 * 1000)); // 3 hours later
    const slug = hd.title.toLowerCase().replace(/[^a-z0-9]/g, '-') + `-2026`;

    const hearing = await prisma.skcHearing.create({
      data: {
        title: hd.title,
        slug: slug,
        shortSummary: hd.summary,
        fullDescription: hd.summary,
        status: hd.status,
        publicationStatus: 'PUBLISHED', // Must be published to fetch in timeline
        registrationStatus: hd.status === 'REGISTRATION_OPEN' ? 'OPEN' : 'CLOSED',
        date: eventDate,
        startAt: eventDate,
        endAt: endDate,
        venueName: hd.venue,
        venue: hd.venue,
        district: hd.district,
        craftFocus: hd.craft,
        topics: [hd.category],
        panelChair: 'Assessment Secretariat',
        assessmentCycleId: cycle.id,
        code: hd.code || "H-2026-" + i.toString().padStart(3, '0'),
        capacity: hd.capacity || 250,
        purpose: hd.purpose || null,
        coverageDistricts: hd.coverageDistricts || [],
        regionalCoverageLabel: hd.regionalCoverageLabel || null,
        stakeholderCategories: hd.stakeholderCategories || [],
        assessmentQuestions: hd.assessmentQuestions || [],
        hearingTypeId: typeMap[hd.type]?.id,
        formatId: formatMap[hd.format]?.id,
        registrationOpensAt: new Date(eventDate.getTime() - (15 * 24 * 60 * 60 * 1000)), // 15 days before
        registrationClosesAt: new Date(eventDate.getTime() - (24 * 60 * 60 * 1000)) // 1 day before
      }
    });

    // Link to ConsultationTheme
    let matchedThemeSlug = "";
    const lowerTitle = hd.title.toLowerCase();
    if (lowerTitle.includes("pashmina")) matchedThemeSlug = "future-of-pashmina";
    else if (lowerTitle.includes("carpet")) matchedThemeSlug = "future-of-carpets";
    else if (lowerTitle.includes("gi & authenticity")) matchedThemeSlug = "gi-authenticity";
    else if (lowerTitle.includes("cultural heritage") || lowerTitle.includes("documentation")) matchedThemeSlug = "cultural-heritage";
    else if (lowerTitle.includes("women")) matchedThemeSlug = "women-in-crafts";
    else if (lowerTitle.includes("youth")) matchedThemeSlug = "youth-in-crafts";
    else if (lowerTitle.includes("livelihood")) matchedThemeSlug = "artisan-livelihoods";
    else if (lowerTitle.includes("education") || lowerTitle.includes("skills") || lowerTitle.includes("training")) matchedThemeSlug = "education-skills";
    else if (lowerTitle.includes("export")) matchedThemeSlug = "exports";
    else if (lowerTitle.includes("global market") || lowerTitle.includes("international market")) matchedThemeSlug = "global-markets";
    else if (lowerTitle.includes("digital") || lowerTitle.includes("e-commerce")) matchedThemeSlug = "digital-commerce";
    else if (lowerTitle.includes("finance") || lowerTitle.includes("investment")) matchedThemeSlug = "finance-investment";
    else if (lowerTitle.includes("climate") || lowerTitle.includes("sustainability")) matchedThemeSlug = "climate-sustainability";
    else if (lowerTitle.includes("raw material")) matchedThemeSlug = "raw-material-access";
    else if (lowerTitle.includes("design") || lowerTitle.includes("technology")) matchedThemeSlug = "technology-design";
    else if (lowerTitle.includes("policy") || lowerTitle.includes("governance")) matchedThemeSlug = "policy-governance";

    if (matchedThemeSlug && themeMap[matchedThemeSlug]) {
      await prisma.hearingThemeAssignment.create({
        data: {
          hearingId: hearing.id,
          themeId: themeMap[matchedThemeSlug].id
        }
      });
    }
    console.log(`Seeded event ${i + 1}/27: ${hd.title} (${hd.date})`);
  }

  console.log('Seeding Complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
