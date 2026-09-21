'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { workshopDiariesHeroFallback } from '@/config/heroFallbacks';

export default function WorkshopDiaries() {
  const [allDiaries, setAllDiaries] = useState<any[]>([
    {
      slug: "diary-carpet-loom",
      title: "A Carpet Commission from Talim to Final Cut",
      subtitle: "Following a Srinagar Workshop Through One Complete Production Cycle",
      dur: "5 Minutes",
      durationMin: 5,
      durationVal: "Under 15 min",
      tag: "Workshop Diary",
      img: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=600&auto=format&fit=crop",
      desc: "This diary follows a hand-knotted carpet commission from the first interpretation of the talim through loom preparation, yarn organization, knotting, daily correction, progress monitoring, finishing, washing, stretching, quality review, and final dispatch. The record documents not only technical production, but also the relationships among the master artisan, talim reader, weavers, apprentices, workshop manager, buyer, and finishing workers.",
      accessionId: "KHCRF-WD-2026-001",
      year: "2026",
      language: "Kashmiri and Urdu",
      subtitles: "Yes",
      artisan: "Mohammad Bhat",
      preferredPublicName: "Bhat Loom Guild",
      gender: "Male",
      birthYear: "1960",
      role: "Master Weaver",
      yearsInCraft: "46 Years",
      workshop: "Bhat Karkhana, Srinagar",
      director: "Farooq Mir",
      transcriptPreview: "The master artisan identified a minor alignment issue and revised the next talim sequence before work continued.",
      craft: "Hand-Knotted Carpet",
      theme: "Production Cycle",
      status: "Diary Active",
      hasTranscript: "Yes",
      themes: ["Carpet Weaving", "Talim", "Workshop Coordination", "Quality Control", "Commission Production", "Artisan Labour"],
      district: "Srinagar",
      recordingDate: "Started March 2026",
      interviewer: "Farooq Mir",
      recorder: "Sajad Dar",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. K. A. Mir",
      consentStatus: "Consented to archival summary release",
      recordingLocation: "Bhat Karkhana, Srinagar",
      publishedDuration: "5 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "Linear PCM WAV 24-bit 96kHz",
      audioQuality: "Master Grade",
      environment: "Active workshop setting",
      rightsStatus: "Copyright KHCRF 2026. Academic use allowed.",
      accessConditions: "Logs accessible for verified research members.",
      timestampedSegment: "ENTRY 14 · KNOTTING PHASE — 18 JULY 2026:\nThe workshop began at approximately 8:40 a.m. Four artisans were seated at the loom. The master artisan reviewed the previous day’s work and identified a slight alignment issue in the central medallion. The next talim sequence was revised before knotting resumed.\n\nFIELD OBSERVATIONS\n• Apprentice present: 1\n• Working hours observed: 5.5\n• Material used: Hand-spun wool\n• Production interruption: 35 minutes\n• Correction required: Yes\n• Weather influence: None recorded\n\nFIELD RESEARCHER: Farooq Mir\nDOCUMENTATION STATUS: Entry in Editorial Review",
      relatedResearch: "Kashmir Valley regional database mapping index #CARPET_WAGES",
      relatedDocumentary: "Doc-KHCRF-2026-03",
      relatedOralHistory: "KHCRF-OH-2026-007",
      relatedCollection: "Hand-Knotted Carpet Archive",
      relatedCourses: "Loom Management",
      relatedKnowledgeArticles: "Wage Structures & Patronage",
      focus: "Production Cycle",
      stage: "Knotting",
      workshopType: "Master Artisan Workshop",
      period: "2026",
      entriesCount: 14,
      latestEntryDate: "18 July 2026",
      latestEntryExcerpt: "The master artisan identified a minor alignment issue and revised the next talim sequence before work continued.",
      secondaryCrafts: "Spinning, Dyeing",
      participatingArtisans: "4 Artisans",
      apprentices: "1 Apprentice",
      consentAccessStatus: "Consented & Restricted",
      diaryOverview: "Longitudinal study of a hand-knotted carpet order tracking daily logs, material quality changes, and master corrections.",
      productionObjective: "Document the technical and social coordinates of traditional karkhana labour in Old Srinagar.",
      currentCommission: "9x12 Silk-on-Cotton rug for Delhi Heritage Gallery",
      economicNotes: "Yarn price hikes impact weaver margins. Wage splits calculated daily.",
      selectedQuotations: "“The voice of the talim reader sets the beat of our fingers.”",
      craftVocabulary: "Talim, Karkhana, Yer, Khur, Duri",
      researchNotes: "Valuable study showing that traditional quality control operates dynamically rather than at the end of the production cycle.",
      citation: "KHCRF Workshop Diaries Record KHCRF-WD-2026-001 (2026).",
      ownerStructure: "Sole Proprietorship",
      yearEstablished: "1982",
      founder: "Mohammad Bhat",
      avgWorkingDays: "260 Days/Year",
      seasonalOps: "Continuous with winter adaptations",
      capacity: "Two rugs per loom annually",
      primaryMarket: "National & Global Galleries",
      photoPermission: "Yes",
      audioPermission: "Yes",
      videoPermission: "Yes",
      researchAccessLevel: "Support Member Access Required",
      materialsLog: [
        { material: "Hand-Spun Wool", source: "Budgam", qty: "18 kg", date: "4 March 2026", condition: "Good Condition", prep: "Colour Sorting", stage: "Knotting", issue: "No Shortage", cost: "Cost Increased Since Previous Order", notes: "High-density spinner card" }
      ],
      toolsLog: [
        { tool: "Comb Beetle", local: "Yer", function: "Beating weft rows into place", ownership: "Heirloom family tool", condition: "Stable but worn", repair: "No", replacement: "Yes", notes: "Generational wood block" }
      ],
      timelineSteps: [
        { id: "01", name: "COMMISSION RECEIVED", status: "Completed" },
        { id: "02", name: "DESIGN APPROVED", status: "Completed" },
        { id: "03", name: "MATERIALS PREPARED", status: "Completed" },
        { id: "04", name: "LOOM SETUP", status: "Completed" },
        { id: "05", name: "KNOTTING", status: "In Progress" },
        { id: "06", name: "FINISHING", status: "Not Started" },
        { id: "07", name: "WASHING", status: "Not Started" },
        { id: "08", name: "QUALITY REVIEW", status: "Not Started" },
        { id: "09", name: "PACKAGING", status: "Not Started" },
        { id: "10", name: "DISPATCH", status: "Not Started" }
      ],
      stageTracker: "PRODUCTION"
    },
    {
      slug: "diary-kani-hands",
      title: "One Kani Shawl, Many Hands",
      subtitle: "A Seasonal Diary of Design, Weaving, and Workshop Coordination",
      dur: "6 Minutes",
      durationMin: 6,
      durationVal: "Under 15 min",
      tag: "Workshop Diary",
      img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop",
      desc: "This diary follows the development of a Kani shawl from pattern selection and colour preparation to loom setup, kani allocation, daily weaving progress, design corrections, and final finishing.",
      accessionId: "KHCRF-WD-2026-002",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Sobia Jan",
      preferredPublicName: "Sobia Jan & weavers",
      gender: "Female",
      birthYear: "1978",
      role: "Weaver",
      yearsInCraft: "30 Years",
      workshop: "Domestic Spinners Co-op",
      director: "Zehra Malik",
      transcriptPreview: "Loom beam yarn thread setup completed by three weavers working simultaneously in the family karkhana room.",
      craft: "Kani Shawl",
      theme: "Production Cycle",
      status: "Production Cycle Underway",
      hasTranscript: "Yes",
      themes: ["Kani Shawl", "Design Interpretation", "Collaborative Production", "Seasonal Work", "Loom Practice", "GI Heritage"],
      district: "Budgam",
      recordingDate: "Started January 2026",
      interviewer: "Zehra Malik",
      recorder: "Aamir Bhat",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. S. Farooq",
      consentStatus: "Consent signed for family study",
      recordingLocation: "Kanihama, Budgam",
      publishedDuration: "6 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "FLAC 16-bit 48kHz",
      audioQuality: "Broadcast Standard",
      environment: "Domestic workspace setting",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Public summary view. Transcripts queryable.",
      timestampedSegment: "ENTRY 10 · PATTERN WEAVING — 12 July 2026:\nLoom beam yarn thread setup completed by three weavers working simultaneously in the family karkhana room.",
      relatedResearch: "Fiber Yield Studies in Domestic Combing",
      relatedDocumentary: "Doc-KHCRF-2026-05",
      relatedOralHistory: "KHCRF-OH-2026-009",
      relatedCollection: "Women's Guild Collection",
      relatedCourses: "Tactile Material Grading",
      relatedKnowledgeArticles: "Invisible Spinning Labour",
      focus: "Production Cycle",
      stage: "Pattern Weaving",
      workshopType: "Family Workshop",
      period: "2026",
      entriesCount: 18,
      latestEntryDate: "12 July 2026",
      latestEntryExcerpt: "Loom beam yarn thread setup completed by three weavers working simultaneously in the family karkhana room.",
      secondaryCrafts: "Warp preparation",
      participatingArtisans: "3 Artisans",
      apprentices: "1 Apprentice",
      consentAccessStatus: "Consented & Public",
      diaryOverview: "Tracking a Kani shawl production timeline across winter changes and cooperative work schedules.",
      productionObjective: "Map the domestic coordination mechanics in Budgam weaving clusters.",
      currentCommission: "Traditional Jamawar Shawl replication order",
      economicNotes: "Winter heating fuel increases workspace maintenance costs.",
      selectedQuotations: "“Each stick has a colour. We pack them together like teeth.”",
      craftVocabulary: "Kani, Tuj, Talim, Warp, Weft",
      researchNotes: "Documents seasonal labour constraints where winter tasks shift inside heated spaces.",
      citation: "KHCRF Workshop Diaries Record KHCRF-WD-2026-002 (2026).",
      ownerStructure: "Family Cooperative",
      yearEstablished: "1995",
      founder: "Sobia Jan",
      avgWorkingDays: "240 Days/Year",
      seasonalOps: "High seasonal reliance on autumn wool harvest",
      capacity: "One Jamawar Shawl per loom per year",
      primaryMarket: "State Handicrafts Emporium",
      photoPermission: "Yes",
      audioPermission: "Yes",
      videoPermission: "No",
      researchAccessLevel: "Public Summary Available",
      materialsLog: [
        { material: "Changthangi Pashm", source: "Leh Co-op", qty: "8 kg", date: "15 September 2025", condition: "Raw Fleece", prep: "Combing and Sorting", stage: "Warping", issue: "No Shortage", cost: "Stable", notes: "First grade sorting" }
      ],
      toolsLog: [
        { tool: "Kani sticks", local: "Tuj", function: "Carrying colour weft lines", ownership: "Artisan owned", condition: "Excellent", repair: "No", replacement: "Yes", notes: "Sourced from wild wood" }
      ],
      timelineSteps: [
        { id: "01", name: "COMMISSION RECEIVED", status: "Completed" },
        { id: "02", name: "DESIGN APPROVED", status: "Completed" },
        { id: "03", name: "MATERIALS PREPARED", status: "Completed" },
        { id: "04", name: "LOOM SETUP", status: "Completed" },
        { id: "05", name: "KNOTTING", status: "In Progress" },
        { id: "06", name: "FINISHING", status: "Not Started" },
        { id: "07", name: "WASHING", status: "Not Started" },
        { id: "08", name: "QUALITY REVIEW", status: "Not Started" },
        { id: "09", name: "PACKAGING", status: "Not Started" },
        { id: "10", name: "DISPATCH", status: "Not Started" }
      ],
      stageTracker: "PRODUCTION"
    },
    {
      slug: "diary-sozni-room",
      title: "The Sozni Room",
      subtitle: "Daily Life Inside a Women-Led Home Embroidery Workshop",
      dur: "5 Minutes",
      durationMin: 5,
      durationVal: "Under 15 min",
      tag: "Workshop Diary",
      img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop",
      desc: "A recurring field diary documenting how women organize embroidery work within a domestic setting, divide designs, manage household responsibilities, review stitch quality, negotiate deadlines, and calculate earnings.",
      accessionId: "KHCRF-WD-2026-003",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Safeena Jan",
      preferredPublicName: "Pampore Sozni Guild",
      gender: "Female",
      birthYear: "2004",
      role: "Embroiderer",
      yearsInCraft: "8 Years",
      workshop: "Domestic Co-op Pampore",
      director: "Zehra Malik",
      transcriptPreview: "Stitch count verified at 80 stitches per inch. Thread tension verified on raw Pashmina borders.",
      craft: "Sozni Embroidery",
      theme: "Women-Led Workshop",
      status: "Diary Active",
      hasTranscript: "Yes",
      themes: ["Sozni Embroidery", "Women Artisans", "Home-Based Work", "Invisible Labour", "Work Allocation", "Household Economy"],
      district: "Srinagar",
      recordingDate: "Started February 2026",
      interviewer: "Zehra Malik",
      recorder: "Sobia Jan",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. S. A. Shah",
      consentStatus: "Consent signed for PAMPORE studies",
      recordingLocation: "Pampore Courtyard, Pulwama",
      publishedDuration: "5 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "FLAC 16-bit 48kHz",
      audioQuality: "Broadcast Standard",
      environment: "Courtyard setting, background birds",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Summary register public.",
      timestampedSegment: "ENTRY 11 · EMBROIDERY AND QUALITY REVIEW — 15 June 2026:\nWeekly wage card reviewed and accepted by Pamposh collective spinners. Spaced flower bud outlines stitched.",
      relatedResearch: "Socio-Economics of Pampore Sozni Workers",
      relatedDocumentary: "Doc-KHCRF-2026-05",
      relatedOralHistory: "KHCRF-OH-2026-001",
      relatedCollection: "Women's Guild Collection",
      relatedCourses: "Feminist Economics and Crafts",
      relatedKnowledgeArticles: "Invisible Spinning Labour",
      focus: "Women-Led Workshop",
      stage: "Embroidery and Quality Review",
      workshopType: "Home-Based Production",
      period: "2026",
      entriesCount: 11,
      latestEntryDate: "15 June 2026",
      latestEntryExcerpt: "Stitch count verified at 80 stitches per inch. Thread tension verified on raw Pashmina borders.",
      secondaryCrafts: "Yarn spinning",
      participatingArtisans: "6 Artisans",
      apprentices: "2 Apprentices",
      consentAccessStatus: "Consented & Registry Open",
      diaryOverview: "Field observations inside a domestic Pamposh group detailing women-led wage tracking and community production.",
      productionObjective: "Preserve the sociology of domestic collective needlework models.",
      currentCommission: "Border motifs on Pashmina shawls for local merchants",
      economicNotes: "Collective wage models allow members to buffer individual household budget variances.",
      selectedQuotations: "“The needles are quiet, but they write the school fees for our children.”",
      craftVocabulary: "Sozni, Jal, Neem-Jal, Hashia",
      researchNotes: "Documents high-density stitch mapping (80 stitches/inch) as an empirical benchmark of fine handiwork.",
      citation: "KHCRF Workshop Diaries Record KHCRF-WD-2026-003 (2026).",
      ownerStructure: "Women's Cooperative Union",
      yearEstablished: "2018",
      founder: "Safeena Jan",
      avgWorkingDays: "200 Days/Year",
      seasonalOps: "Continuous with agricultural pauses",
      capacity: "Varies according to border width",
      primaryMarket: "Domestic & Regional Bazaars",
      photoPermission: "Yes",
      audioPermission: "Yes",
      videoPermission: "Yes",
      researchAccessLevel: "Open Research Access",
      materialsLog: [
        { material: "Embroidery Silk", source: "Local Merchant", qty: "2 kg", date: "10 February 2026", condition: "Ready to use", prep: "None", stage: "Surface Decoration", issue: "No Shortage", cost: "Stable", notes: "Natural dyed silk" }
      ],
      toolsLog: [
        { tool: "Embroidery needle", local: "Sozni Suj", function: "Needlework execution", ownership: "Personal", condition: "Excellent", repair: "No", replacement: "Yes", notes: "Polished steel" }
      ],
      timelineSteps: [
        { id: "01", name: "COMMISSION RECEIVED", status: "Completed" },
        { id: "02", name: "DESIGN APPROVED", status: "Completed" },
        { id: "03", name: "MATERIALS PREPARED", status: "Completed" },
        { id: "04", name: "LOOM SETUP", status: "Completed" },
        { id: "05", name: "PRODUCTION", status: "In Progress" },
        { id: "06", name: "FINISHING", status: "Not Started" },
        { id: "07", name: "WASHING", status: "Not Started" },
        { id: "08", name: "REVIEW", status: "Not Started" },
        { id: "09", name: "PACKAGING", status: "Not Started" },
        { id: "10", name: "DISPATCH", status: "Not Started" }
      ],
      stageTracker: "PRODUCTION"
    },
    {
      slug: "diary-papier-mache-drying",
      title: "Drying Between the Seasons",
      subtitle: "A Papier-Mâché Workshop Responds to Weather, Moisture, and Production Delays",
      dur: "6 Minutes",
      durationMin: 6,
      durationVal: "Under 15 min",
      tag: "Workshop Diary",
      img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop",
      desc: "This diary documents how temperature, humidity, drying time, material preparation, and workshop space influence papier-mâché production. Entries record delays, surface failures, repainting, and adaptation during changing weather conditions.",
      accessionId: "KHCRF-WD-2026-004",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Habibullah Atelier",
      preferredPublicName: "Habibullah Atelier Guild",
      gender: "Male",
      birthYear: "1965",
      role: "Atelier Owner",
      yearsInCraft: "41 Years",
      workshop: "Habibullah Atelier, Srinagar",
      director: "KHCRF Editorial",
      transcriptPreview: "Surface preparation delays encountered due to high humidity levels inside Srinagar studios.",
      craft: "Papier-Mâché",
      theme: "Seasonal Production",
      status: "Field Access Confirmed",
      hasTranscript: "Yes",
      themes: ["Papier-Mâché", "Seasonal Conditions", "Drying", "Material Behaviour", "Workshop Adaptation", "Production Delays"],
      district: "Srinagar",
      recordingDate: "Started April 2026",
      interviewer: "KHCRF Editor",
      recorder: "Aamir Bhat",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. S. A. Shah",
      consentStatus: "Consent signed for ecological index inclusion",
      recordingLocation: "Atelier Workshop, Srinagar",
      publishedDuration: "6 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "FLAC 16-bit 48kHz",
      audioQuality: "Broadcast Standard",
      environment: "Clean room interior, smell of turpentine",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Restricted to support members. Summary public.",
      timestampedSegment: "ENTRY 09 · SURFACE PREPARATION AND DRYING — 20 June 2026:\nSurface preparation delays encountered due to high humidity levels inside Srinagar studios.",
      relatedResearch: "Curing Cycles of Raw Turpentine and Resin Binders",
      relatedDocumentary: "Doc-KHCRF-2026-04",
      relatedOralHistory: "KHCRF-OH-2026-003",
      relatedCollection: "Museum Archive Collection",
      relatedCourses: "Organic Dye Chemistry",
      relatedKnowledgeArticles: "Papier-Mâché Pulp Preparation",
      focus: "Seasonal Production",
      stage: "Surface Preparation and Drying",
      workshopType: "Seasonal Workshop",
      period: "2026",
      entriesCount: 9,
      latestEntryDate: "20 June 2026",
      latestEntryExcerpt: "Surface preparation delays encountered due to high humidity levels inside Srinagar studios.",
      secondaryCrafts: "Molding, Plastering",
      participatingArtisans: "4 Painters",
      apprentices: "1 Apprentice",
      consentAccessStatus: "Consented & Restricted",
      diaryOverview: "Observing base drying variations and surface lacquer curing times across shifting weather fronts.",
      productionObjective: "Analyze dampness management and moisture limits in raw paper pulp molding.",
      currentCommission: "Lacquer box order for handicraft federation",
      economicNotes: "Atmospheric shifts dictate labor pacing. Delayed drying locks workshop capital.",
      selectedQuotations: "“When the wind is from the lake, the paper stays wet. You cannot brush gold on water.”",
      craftVocabulary: "Sakhtsazi, Naqashi, Astarakari, Rogan",
      researchNotes: "Valuable details tracking moisture limits to guide dehumidifier setups in heritage studios.",
      citation: "KHCRF Workshop Diaries Record KHCRF-WD-2026-004 (2026).",
      ownerStructure: "Atelier Partnership",
      yearEstablished: "1988",
      founder: "Habibullah Mir",
      avgWorkingDays: "220 Days/Year",
      seasonalOps: "High weather reliance in drying stages",
      capacity: "120 boxes per year",
      primaryMarket: "Heritage Collectors",
      photoPermission: "Yes",
      audioPermission: "Yes",
      videoPermission: "Yes",
      researchAccessLevel: "Support Member Access Required",
      materialsLog: [
        { material: "Paper pulp", source: "Local Recycler", qty: "40 kg", date: "12 April 2026", condition: "Damp pulp", prep: "Soaking & Straining", stage: "Material Sourcing", issue: "No Shortage", cost: "Stable", notes: "Filtered newsprint base" }
      ],
      toolsLog: [
        { tool: "Drying rack", local: "Arik", function: "Horizontal air drying", ownership: "Atelier owned", condition: "Fair", repair: "No", replacement: "Yes", notes: "Pine wooden slates" }
      ],
      timelineSteps: [
        { id: "01", name: "COMMISSION RECEIVED", status: "Completed" },
        { id: "02", name: "DESIGN APPROVED", status: "Completed" },
        { id: "03", name: "MATERIALS PREPARED", status: "Completed" },
        { id: "04", name: "SETUP", status: "Completed" },
        { id: "05", name: "PRODUCTION", status: "In Progress" },
        { id: "06", name: "FINISHING", status: "Not Started" },
        { id: "07", name: "WASHING", status: "Not Started" },
        { id: "08", name: "REVIEW", status: "Not Started" },
        { id: "09", name: "PACKAGING", status: "Not Started" },
        { id: "10", name: "DISPATCH", status: "Not Started" }
      ],
      stageTracker: "SETUP"
    },
    {
      slug: "diary-wood-chisel",
      title: "Learning the Chisel",
      subtitle: "A Walnut Wood Apprentice’s First Six Months",
      dur: "4 Minutes",
      durationMin: 4,
      durationVal: "Under 15 min",
      tag: "Workshop Diary",
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop",
      desc: "A six-month record following a young apprentice as he learns workshop discipline, tool care, wood selection, line drawing, shallow carving, relief depth, correction, and finishing under a master artisan.",
      accessionId: "KHCRF-WD-2026-005",
      year: "2026",
      language: "Kashmiri",
      subtitles: "No",
      artisan: "Ustad Ali Mohammad",
      preferredPublicName: "Ali Wood Atelier",
      gender: "Male",
      birthYear: "1945",
      role: "Master Carver",
      yearsInCraft: "66 Years",
      workshop: "Downtown Srinagar Woodshop",
      director: "KHCRF Editor",
      transcriptPreview: "Apprentice completed his first shallow relief carving sequence on walnut block without fiber tearing.",
      craft: "Walnut Wood Carving",
      theme: "Master–Apprentice Learning",
      status: "Diary Active",
      hasTranscript: "Yes",
      themes: ["Walnut Wood", "Apprenticeship", "Traditional Tools", "Skill Development", "Correction", "Ustad–Shagird"],
      district: "Srinagar",
      recordingDate: "Started January 2026",
      interviewer: "Sajad Dar",
      recorder: "Farooq Mir",
      translator: "None required",
      transcriptReviewer: "Dr. S. Shah",
      consentStatus: "Public official disclosure cleared",
      recordingLocation: "Downtown Srinagar Woodshop",
      publishedDuration: "4 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "None",
      audioFormat: "FLAC 16-bit 48kHz",
      audioQuality: "Broadcast Standard",
      environment: "Active woodshop interior",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Open access summary.",
      timestampedSegment: "ENTRY 16 · SHALLOW RELIEF CARVING — 10 May 2026:\nApprentice completed his first shallow relief carving sequence on walnut block without fiber tearing.",
      relatedResearch: "Vocational Adaptation in Srinagar Wood Woodshops",
      relatedDocumentary: "Doc-KHCRF-2026-04",
      relatedOralHistory: "KHCRF-OH-2026-003",
      relatedCollection: "Architectural Wood Archive",
      relatedCourses: "Wood Joint Conservation",
      relatedKnowledgeArticles: "Nail-free Double Locking Systems",
      focus: "Master–Apprentice Learning",
      stage: "Shallow Relief Carving",
      workshopType: "Training Workshop",
      period: "2026",
      entriesCount: 16,
      latestEntryDate: "10 May 2026",
      latestEntryExcerpt: "Apprentice completed his first shallow relief carving sequence on walnut block without fiber tearing.",
      secondaryCrafts: "Sharpening, Wood Sourcing",
      participatingArtisans: "2 Carvers",
      apprentices: "1 Apprentice",
      consentAccessStatus: "Consented & Registry Open",
      diaryOverview: "Chronological documentation of student posture, wood grain identification, and tool hold angles over six months.",
      productionObjective: "Evaluate the ustad-shagird vocational continuity indicators.",
      currentCommission: "Architectural panels for local heritage pavilion",
      economicNotes: "Apprentice wage stipends funded by cooperative regional allocations.",
      selectedQuotations: "“The tool is only the teeth. The hand must know the softness of the wood.”",
      craftVocabulary: "Wanz, Chot, Khot, Chisel, Mallet",
      researchNotes: "Provides a reliable baseline on wood grain direction mistakes during student relief carving.",
      citation: "KHCRF Workshop Diaries Record KHCRF-WD-2026-005 (2026).",
      ownerStructure: "Sole Proprietorship",
      yearEstablished: "1968",
      founder: "Ali Mohammad",
      avgWorkingDays: "250 Days/Year",
      seasonalOps: "Continuous with winter heating checks",
      capacity: "Varies according to relief depth",
      primaryMarket: "Architectural Commissions",
      photoPermission: "Yes",
      audioPermission: "Yes",
      videoPermission: "Yes",
      researchAccessLevel: "Open Research Access",
      materialsLog: [
        { material: "Walnut Planks", source: "Anantnag Depot", qty: "4 logs", date: "10 January 2026", condition: "Aged 5 years", prep: "Planing & Sizing", stage: "Material Sourcing", issue: "No Shortage", cost: "High", notes: "Air-dried wood logs" }
      ],
      toolsLog: [
        { tool: "Gouge Chisel", local: "Wanz", function: "Deep relief cutting", ownership: "Master owned", condition: "Excellent", repair: "No", replacement: "Yes", notes: "Imported tool carbon tip" }
      ],
      timelineSteps: [
        { id: "01", name: "COMMISSION RECEIVED", status: "Completed" },
        { id: "02", name: "DESIGN APPROVED", status: "Completed" },
        { id: "03", name: "MATERIALS PREPARED", status: "Completed" },
        { id: "04", name: "SETUP", status: "Completed" },
        { id: "05", name: "PRODUCTION", status: "In Progress" },
        { id: "06", name: "FINISHING", status: "Not Started" },
        { id: "07", name: "WASHING", status: "Not Started" },
        { id: "08", name: "REVIEW", status: "Not Started" },
        { id: "09", name: "PACKAGING", status: "Not Started" },
        { id: "10", name: "DISPATCH", status: "Not Started" }
      ],
      stageTracker: "PRODUCTION"
    },
    {
      slug: "diary-copper-orders",
      title: "Copper Orders Before the Wedding Season",
      subtitle: "Production Pressure, Engraving, and Deadline Management in Old Srinagar",
      dur: "4 Minutes",
      durationMin: 4,
      durationVal: "Under 15 min",
      tag: "Workshop Diary",
      img: "https://images.unsplash.com/photo-1422026276085-c7ff20f6ac95?w=600&auto=format&fit=crop",
      desc: "A diary documenting increased copperware demand before the wedding season. Entries follow material procurement, forming, engraving, polishing, labour allocation, customer changes, and deadline pressure.",
      accessionId: "KHCRF-WD-2026-006",
      year: "2026",
      language: "Kashmiri",
      subtitles: "No",
      artisan: "Mohammad Yusuf",
      preferredPublicName: "Coppersmiths Guild Members",
      gender: "Male",
      birthYear: "1958",
      role: "Lead smith",
      yearsInCraft: "45 Years",
      workshop: "Zaina Kadal Copper Workshop",
      director: "Sajad Dar",
      transcriptPreview: "Wedding season commission rush forces extended night hours in engraving units.",
      craft: "Copperware",
      theme: "Commission Diary",
      status: "Production Cycle Active",
      hasTranscript: "Yes",
      themes: ["Copperware", "Seasonal Demand", "Wedding Market", "Deadlines", "Workshop Labour", "Customer Orders"],
      district: "Old Srinagar",
      recordingDate: "Started May 2026",
      interviewer: "Sajad Dar",
      recorder: "Farooq Mir",
      translator: "None required",
      transcriptReviewer: "Dr. N. Jan",
      consentStatus: "Ethical consent signed by co-op committee",
      recordingLocation: "Bazaar Workshop, Srinagar",
      publishedDuration: "4 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "None",
      audioFormat: "WAV 24-bit 96kHz",
      audioQuality: "Broadcast Grade",
      environment: "Quiet workshop front setting",
      rightsStatus: "Copyright KHCRF 2026. Cooperative shared rights.",
      accessConditions: "Public summary view.",
      timestampedSegment: "ENTRY 12 · ENGRAVING AND POLISHING — 20 June 2026:\nWedding season commission rush forces extended night hours in engraving units.",
      relatedResearch: "Geometry Layouts in Downtown Srinagar Metalwork",
      relatedDocumentary: "Doc-KHCRF-2026-12",
      relatedOralHistory: "KHCRF-OH-2026-012",
      relatedCollection: "Bazaar Trade Archive",
      relatedCourses: "Tactile Material Grading",
      relatedKnowledgeArticles: "Downtown Bazaars Heritage",
      focus: "Commission Diary",
      stage: "Engraving and Polishing",
      workshopType: "Community Production Unit",
      period: "2026",
      entriesCount: 12,
      latestEntryDate: "20 June 2026",
      latestEntryExcerpt: "Wedding season commission rush forces extended night hours in engraving units.",
      secondaryCrafts: "Hammering, Tin plating",
      participatingArtisans: "5 Smithing carvers",
      apprentices: "2 apprentices",
      consentAccessStatus: "Consented & Public Registry",
      diaryOverview: "Following pre-wedding copperware rush cycles, logistics setups, and naqash engraving timelines.",
      productionObjective: "Evaluate structural speed limits in hand-formed wedding copperware production.",
      currentCommission: "Samovar and plates sets for local family ceremonies",
      economicNotes: "Raw copper price fluctuations impact direct merchant margins.",
      selectedQuotations: "“The weddings do not wait. We hammer until midnight to smooth the lines.”",
      craftVocabulary: "Kandkari, Kalai, Naqash, Char, Thathera",
      researchNotes: "Valuable study showing labor adjustments during peak local demand weeks.",
      citation: "KHCRF Workshop Diaries Record KHCRF-WD-2026-006 (2026).",
      ownerStructure: "Sole Proprietorship Partnership",
      yearEstablished: "1972",
      founder: "Mohammad Yusuf",
      avgWorkingDays: "280 Days/Year",
      seasonalOps: "High wedding season rush dependency",
      capacity: "40 large vessels monthly",
      primaryMarket: "Domestic Marriage Commissions",
      photoPermission: "Yes",
      audioPermission: "Yes",
      videoPermission: "Yes",
      researchAccessLevel: "Public Summary Available",
      materialsLog: [
        { material: "Copper Sheets", source: "Local distributor", qty: "80 kg", date: "4 May 2026", condition: "Raw metal sheets", prep: "Cut and flat", stage: "Material Sourcing", issue: "No Shortage", cost: "Increased 10%", notes: "99% pure grade copper" }
      ],
      toolsLog: [
        { tool: "Chasing Mallet", local: "Char", function: "Detailing pattern lines", ownership: "Atelier tool", condition: "Excellent", repair: "No", replacement: "Yes", notes: "Generational steel tool" }
      ],
      timelineSteps: [
        { id: "01", name: "COMMISSION RECEIVED", status: "Completed" },
        { id: "02", name: "DESIGN APPROVED", status: "Completed" },
        { id: "03", name: "MATERIALS PREPARED", status: "Completed" },
        { id: "04", name: "SETUP", status: "Completed" },
        { id: "05", name: "PRODUCTION", status: "In Progress" },
        { id: "06", name: "FINISHING", status: "Not Started" },
        { id: "07", name: "WASHING", status: "Not Started" },
        { id: "08", name: "REVIEW", status: "Not Started" },
        { id: "09", name: "PACKAGING", status: "Not Started" },
        { id: "10", name: "DISPATCH", status: "Not Started" }
      ],
      stageTracker: "PRODUCTION"
    },
    {
      slug: "diary-namda-revival",
      title: "Reviving the Namda Workshop",
      subtitle: "Documenting Materials, Training, Design Trials, and Community Participation",
      dur: "7 Minutes",
      durationMin: 7,
      durationVal: "Under 15 min",
      tag: "Workshop Diary",
      img: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop",
      desc: "This diary follows a Namda revival project involving wool preparation, felting trials, artisan retraining, design experimentation, quality assessment, and attempts to reconnect production with viable markets.",
      accessionId: "KHCRF-WD-2026-007",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Bashir Ahmad",
      preferredPublicName: "Namda felting guild",
      gender: "Male",
      birthYear: "1965",
      role: "Felting supervisor",
      yearsInCraft: "38 Years",
      workshop: "Downtown Srinagar Felting Unit",
      director: "Zehra Malik",
      transcriptPreview: "Prototype evaluations of the winter white Namda blankets finished by co-op committee.",
      craft: "Namda",
      theme: "Revival Initiative",
      status: "Revival Diary Active",
      hasTranscript: "Yes",
      themes: ["Namda", "Craft Revival", "Training", "Design Adaptation", "Community Production", "Market Testing"],
      district: "Anantnag",
      recordingDate: "Started February 2026",
      interviewer: "Zehra Malik",
      recorder: "Farooq Mir",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. K. A. Mir",
      consentStatus: "Consent signed for Pampore cluster study",
      recordingLocation: "Felting Unit, Srinagar",
      publishedDuration: "7 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "FLAC 16-bit 48kHz",
      audioQuality: "Broadcast Standard",
      environment: "Active wash unit backdrop",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Dialogue concept study summary.",
      timestampedSegment: "ENTRY 13 · PROTOTYPE EVALUATION — 22 May 2026:\nPrototype evaluations of the winter white Namda blankets finished by co-op committee.",
      relatedResearch: "Tensile Properties of Felted Wool under Varing pH",
      relatedDocumentary: "Doc-KHCRF-2026-03",
      relatedOralHistory: "KHCRF-OH-2026-010",
      relatedCollection: "Namda Guild Archives",
      relatedCourses: "Organic Dye Chemistry",
      relatedKnowledgeArticles: "Natural Dye Conservation",
      focus: "Revival Initiative",
      stage: "Prototype Evaluation",
      workshopType: "Revival Centre",
      period: "2026",
      entriesCount: 13,
      latestEntryDate: "22 May 2026",
      latestEntryExcerpt: "Prototype evaluations of the winter white Namda blankets finished by co-op committee.",
      secondaryCrafts: "Wool carding, Stitching",
      participatingArtisans: "8 Felting weavers",
      apprentices: "3 apprentices",
      consentAccessStatus: "Consented & Open Registry",
      diaryOverview: "Sustained tracking of raw wool ratios, felting pressure times, and geometric layout tests.",
      productionObjective: "Analyze dye bleeding limitations and felt thickness ratings.",
      currentCommission: "Revival sample blankets for cooperative exhibitions",
      economicNotes: "Collective co-op subsidies funding apprentice wool allocations.",
      selectedQuotations: "“Felting is not just rolling; it is how you press the wool with the feet.”",
      craftVocabulary: "Namda, Carding, Rolling, Felting, Pech",
      researchNotes: "Documents pH 8 calibration logs of alkaline felting soaps.",
      citation: "KHCRF Workshop Diaries Record KHCRF-WD-2026-007 (2026).",
      ownerStructure: "State Cooperative Initiative",
      yearEstablished: "2021",
      founder: "Cooperative Directorate",
      avgWorkingDays: "210 Days/Year",
      seasonalOps: "Weather dependent felting wash setups",
      capacity: "300 rugs annually",
      primaryMarket: "Revival Exhibition Trade",
      photoPermission: "Yes",
      audioPermission: "Yes",
      videoPermission: "Yes",
      researchAccessLevel: "Open Research Access",
      materialsLog: [
        { material: "Sheep wool", source: "Local grower", qty: "60 kg", date: "12 February 2026", condition: "Raw carded wool", prep: "Washing & Sorting", stage: "Material Sourcing", issue: "No Shortage", cost: "Stable", notes: "Locally sourced wool" }
      ],
      toolsLog: [
        { tool: "Felting Board", local: "Patan", function: "Woven fiber flattening", ownership: "Cooperative", condition: "Good", repair: "No", replacement: "Yes", notes: "Generational wood frame" }
      ],
      timelineSteps: [
        { id: "01", name: "COMMISSION RECEIVED", status: "Completed" },
        { id: "02", name: "DESIGN APPROVED", status: "Completed" },
        { id: "03", name: "MATERIALS PREPARED", status: "Completed" },
        { id: "04", name: "SETUP", status: "Completed" },
        { id: "05", name: "PRODUCTION", status: "In Progress" },
        { id: "06", name: "FINISHING", status: "Not Started" },
        { id: "07", name: "WASHING", status: "Not Started" },
        { id: "08", name: "REVIEW", status: "Not Started" },
        { id: "09", name: "PACKAGING", status: "Not Started" },
        { id: "10", name: "DISPATCH", status: "Not Started" }
      ],
      stageTracker: "PRODUCTION"
    },
    {
      slug: "diary-willow-basket",
      title: "From Willow to Basket",
      subtitle: "A Seasonal Record of Harvesting, Preparation, and Rural Production",
      dur: "8 Minutes",
      durationMin: 8,
      durationVal: "Under 15 min",
      tag: "Workshop Diary",
      img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop",
      desc: "A rural field diary documenting willow harvesting, sorting, soaking, peeling, drying, bundle preparation, weaving, and household production across one seasonal cycle.",
      accessionId: "KHCRF-WD-2026-008",
      year: "2025",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Ghulam Nabi",
      preferredPublicName: "Ganderbal Willow co-op",
      gender: "Male",
      birthYear: "1963",
      role: "Co-op Lead",
      yearsInCraft: "42 Years",
      workshop: "Ganderbal Willow unit",
      director: "Farooq Mir",
      transcriptPreview: "Soaking tank temperatures monitored to strip the willow peel without splitting the cane.",
      craft: "Willow Wicker",
      theme: "Seasonal Production",
      status: "Seasonal Diary Active",
      hasTranscript: "Yes",
      themes: ["Willow Wicker", "Rural Production", "Material Preparation", "Seasonal Labour", "Household Craft", "Agricultural Landscape"],
      district: "Ganderbal",
      recordingDate: "Started November 2025",
      interviewer: "Farooq Mir",
      recorder: "Dr. S. Shah",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. H. Mir",
      consentStatus: "Consent signed for regional studies",
      recordingLocation: "Boiling Unit, Ganderbal",
      publishedDuration: "8 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "WAV 24-bit 48kHz",
      audioQuality: "Broadcast Grade",
      environment: "Steam background, boiling tank sounds",
      rightsStatus: "Copyright KHCRF 2025.",
      accessConditions: "Open register access.",
      timestampedSegment: "ENTRY 17 · WILLOW PREPARATION — 20 May 2026:\nSoaking tank temperatures monitored to strip the willow peel without splitting the cane.",
      relatedResearch: "Tensile Strength of Regional Wicker Varieties",
      relatedDocumentary: "Doc-KHCRF-2026-10",
      relatedOralHistory: "KHCRF-OH-2026-008",
      relatedCollection: "Srinagar Guild Historical Logs",
      relatedCourses: "Sustainable Tourism Practices",
      relatedKnowledgeArticles: "Visitor Etiquette in Karkhanas",
      focus: "Material and Production Cycle",
      stage: "Willow Preparation",
      workshopType: "Cooperative",
      period: "2025",
      entriesCount: 17,
      latestEntryDate: "20 May 2026",
      latestEntryExcerpt: "Soaking tank temperatures monitored to strip the willow peel without splitting the cane.",
      secondaryCrafts: "Soaking, Stripping",
      participatingArtisans: "12 growers",
      apprentices: "4 apprentices",
      consentAccessStatus: "Consented & Public Registry",
      diaryOverview: "Rural observations tracking wicker cane boiling vats and winter peeling output metrics.",
      productionObjective: "Document the supply chain and regional agricultural interfaces in Ganderbal.",
      currentCommission: "Seasonal fruit basket orders for regional market",
      economicNotes: "Harvest labor wages set by local grower councils.",
      selectedQuotations: "“The boiling makes the willow soft like rope. Peeling is done before it dries.”",
      craftVocabulary: "Keer, Shakeh, Phou, Boiler, Wicker",
      researchNotes: "Documents raw cane yield parameters under regional agricultural water changes.",
      citation: "KHCRF Workshop Diaries Record KHCRF-WD-2026-008 (2025).",
      ownerStructure: "Agricultural Cooperative",
      yearEstablished: "1991",
      founder: "Ghulam Nabi",
      avgWorkingDays: "180 Days/Year",
      seasonalOps: "Autumn harvesting and boiling focus",
      capacity: "1000 baskets seasonally",
      primaryMarket: "Regional Fruit Growers",
      photoPermission: "Yes",
      audioPermission: "Yes",
      videoPermission: "Yes",
      researchAccessLevel: "Public Summary Available",
      materialsLog: [
        { material: "Raw Willow", source: "Ganderbal Farm", qty: "120 bundles", date: "15 November 2025", condition: "Green wood", prep: "Boiling & Stripping", stage: "Material Sourcing", issue: "No Shortage", cost: "Stable", notes: "Grade-A green willow" }
      ],
      toolsLog: [
        { tool: "Boiling Tank", local: "Bhatti", function: "Steam softening", ownership: "Cooperative owned", condition: "Good", repair: "No", replacement: "No", notes: "Stone masonry vat" }
      ],
      timelineSteps: [
        { id: "01", name: "COMMISSION RECEIVED", status: "Completed" },
        { id: "02", name: "DESIGN APPROVED", status: "Completed" },
        { id: "03", name: "MATERIALS PREPARED", status: "Completed" },
        { id: "04", name: "SETUP", status: "Completed" },
        { id: "05", name: "PRODUCTION", status: "In Progress" },
        { id: "06", name: "FINISHING", status: "Not Started" },
        { id: "07", name: "WASHING", status: "Not Started" },
        { id: "08", name: "REVIEW", status: "Not Started" },
        { id: "09", name: "PACKAGING", status: "Not Started" },
        { id: "10", name: "DISPATCH", status: "Not Started" }
      ],
      stageTracker: "MATERIALS"
    },
    {
      slug: "diary-no-apprentices",
      title: "A Workshop Without Apprentices",
      subtitle: "Documenting Skill Shortage and an Ageing Artisan Workforce",
      dur: "9 Minutes",
      durationMin: 9,
      durationVal: "Under 15 min",
      tag: "Workshop Diary",
      img: "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=600&auto=format&fit=crop",
      desc: "This diary records a traditional workshop facing declining apprentice participation. It documents workload distribution, unfinished commissions, attempts to recruit young learners, and concerns about the continuity of specialized skills.",
      accessionId: "KHCRF-WD-2026-009",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Habibullah Bhat",
      preferredPublicName: "Downtown Carver Guild Spokesperson",
      gender: "Male",
      birthYear: "1952",
      role: "Lead carver",
      yearsInCraft: "56 Years",
      workshop: " Downtown Srinagar Woodshops",
      director: "KHCRF Editorial",
      transcriptPreview: "No apprentices registered for the spring woodcarving cohort. Workforce continuity risk high.",
      craft: "Walnut Wood Carving",
      theme: "Workshop Transition",
      status: "Field Documentation Active",
      hasTranscript: "Yes",
      themes: ["Skill Shortage", "Ageing Workforce", "Apprenticeship Decline", "Workshop Continuity", "Youth Participation", "Heritage Risk"],
      district: "Budgam",
      recordingDate: "Started March 2026",
      interviewer: "KHCRF Editor",
      recorder: "Sajad Dar",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. S. A. Shah",
      consentStatus: "Consent signed for technical preservation archive",
      recordingLocation: "Downtown Workshops, Srinagar",
      publishedDuration: "9 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "WAV 24-bit 96kHz",
      audioQuality: "Broadcast Grade",
      environment: "Active workshop interior, distant traffic",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Published record viewable by authorized members.",
      timestampedSegment: "ENTRY 08 · LIMITED PRODUCTION CAPACITY — 24 June 2026:\nNo apprentices registered for the spring woodcarving cohort. Workforce continuity risk high.",
      relatedResearch: "Thermal Adaptations and Productivity Metrics in Srinagar Karkhanas",
      relatedDocumentary: "Doc-KHCRF-2026-10",
      relatedOralHistory: "KHCRF-OH-2026-008",
      relatedCollection: "Srinagar Guild Historical Logs",
      relatedCourses: "Sustainable Tourism Practices",
      relatedKnowledgeArticles: "Visitor Etiquette in Karkhanas",
      focus: "Workshop Transition",
      stage: "Core Production",
      workshopType: "Manufacturer Workshop",
      period: "2026",
      entriesCount: 8,
      latestEntryDate: "24 June 2026",
      latestEntryExcerpt: "No apprentices registered for the spring woodcarving cohort. Workforce continuity risk high.",
      secondaryCrafts: "Planing, Timber seasoning",
      participatingArtisans: "3 Senior Carvers",
      apprentices: "0 active apprentices",
      consentAccessStatus: "Consented & Restricted",
      diaryOverview: "Following age profiles, workload metrics, and recruitment trials in an ageing downtown Srinagar workshop.",
      productionObjective: "Document barriers to traditional skill retention and youth entry rates.",
      currentCommission: "Mosque door carving project (delayed)",
      economicNotes: "High timber costs combined with low youth retention reduces workshop margins.",
      selectedQuotations: "“The young boys want screens, they do not want the dust of walnut on their clothes.”",
      craftVocabulary: "Dak, Pinjra, Jal, Naqashi, Ustad",
      researchNotes: "Strong case study highlighting how skill limits directly delay regional public heritage commissions.",
      citation: "KHCRF Workshop Diaries Record KHCRF-WD-2026-009 (2026).",
      ownerStructure: "Sole Proprietorship Partnership",
      yearEstablished: "1970",
      founder: "Habibullah Bhat",
      avgWorkingDays: "240 Days/Year",
      seasonalOps: "Continuous with winter pauses",
      capacity: "Limited to small custom orders",
      primaryMarket: "Heritage Restoration Projects",
      photoPermission: "Yes",
      audioPermission: "Yes",
      videoPermission: "Yes",
      researchAccessLevel: "Support Member Access Required",
      materialsLog: [
        { material: "Dry Walnut Wood", source: "Regional Depot", qty: "3 blocks", date: "10 March 2026", condition: "Dry seasoned", prep: "Timber plane", stage: "Material Sourcing", issue: "High Cost", cost: "Increased 20%", notes: "Grade-A seasoned wood" }
      ],
      toolsLog: [
        { tool: "Chisel Set", local: "Wanz Suj", function: "Wood grain incision", ownership: "Personal", condition: "Good but worn", repair: "No", replacement: "Yes", notes: "Generational steel blades" }
      ],
      timelineSteps: [
        { id: "01", name: "COMMISSION RECEIVED", status: "Completed" },
        { id: "02", name: "DESIGN APPROVED", status: "Completed" },
        { id: "03", name: "MATERIALS PREPARED", status: "Completed" },
        { id: "04", name: "SETUP", status: "Completed" },
        { id: "05", name: "PRODUCTION", status: "In Progress" },
        { id: "06", name: "FINISHING", status: "Not Started" },
        { id: "07", name: "WASHING", status: "Not Started" },
        { id: "08", name: "REVIEW", status: "Not Started" },
        { id: "09", name: "PACKAGING", status: "Not Started" },
        { id: "10", name: "DISPATCH", status: "Not Started" }
      ],
      stageTracker: "PRODUCTION"
    },
    {
      slug: "diary-new-buyer",
      title: "Designing for a New Buyer",
      subtitle: "A Workshop Tests Contemporary Forms Without Abandoning Traditional Technique",
      dur: "8 Minutes",
      durationMin: 8,
      durationVal: "Under 15 min",
      tag: "Workshop Diary",
      img: "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=600&auto=format&fit=crop",
      desc: "The diary follows a workshop as it responds to a new commission requiring contemporary dimensions and colour preferences while retaining traditional materials, techniques, and workmanship standards.",
      accessionId: "KHCRF-WD-2026-010",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Fayaz Ahmad",
      preferredPublicName: "Fayaz Ahmad & designers",
      gender: "Male",
      birthYear: "1969",
      role: "Lead Designer",
      yearsInCraft: "35 Years",
      workshop: "Mir Design Bureau, Srinagar",
      director: "Farooq Mir",
      transcriptPreview: "Prototype patterns generated for rectangular contemporary carpets matching buyer specs.",
      craft: "Papier-Mâché",
      theme: "Innovation Trial",
      status: "Prototype Under Review",
      hasTranscript: "Yes",
      themes: ["Design Innovation", "Contemporary Markets", "Traditional Technique", "Buyer Collaboration", "Prototype", "Authenticity"],
      district: "Srinagar",
      recordingDate: "Started April 2026",
      interviewer: "Farooq Mir",
      recorder: "Zehra Malik",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. H. Mir",
      consentStatus: "Guild council consent secured",
      recordingLocation: "Design Bureau, Srinagar",
      publishedDuration: "8 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "FLAC 16-bit 48kHz",
      audioQuality: "Broadcast Standard",
      environment: "Quiet drawing office",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Restricted to support members. Register record public.",
      timestampedSegment: "ENTRY 10 · PROTOTYPE DEVELOPMENT — 28 June 2026:\nPrototype patterns generated for rectangular contemporary carpets matching buyer specs.",
      relatedResearch: "Design Evolution in Srinagar Embroidery Guilds",
      relatedDocumentary: "Doc-KHCRF-2026-12",
      relatedOralHistory: "KHCRF-OH-2026-012",
      relatedCollection: "Bazaar Trade Archive",
      relatedCourses: "E-Commerce Logistics for Crafts",
      relatedKnowledgeArticles: "Downtown Bazaars Heritage",
      focus: "Innovation Trial",
      stage: "Design Planning",
      workshopType: "Design Studio",
      period: "2026",
      entriesCount: 10,
      latestEntryDate: "28 June 2026",
      latestEntryExcerpt: "Prototype patterns generated for rectangular contemporary carpets matching buyer specs.",
      secondaryCrafts: "Lacquer lining",
      participatingArtisans: "4 Designers",
      apprentices: "1 apprentice",
      consentAccessStatus: "Consented & Restricted",
      diaryOverview: "Following contemporary layout trials on traditional pulp base structures.",
      productionObjective: "Document design adaptation rates under export order specifications.",
      currentCommission: "Modern geometric lacquer box order for French boutique",
      economicNotes: "Contemporary design trials require extra material tests which increases short-term overhead.",
      selectedQuotations: "“The buyer wants pure gold lines but no flowers. The hand must adjust to the empty spaces.”",
      craftVocabulary: "Naqashi, Astari, Gul-i-Wilayat, Tarah",
      researchNotes: "Documents the re-proportioning of traditional flower motifs to suit sparse layouts.",
      citation: "KHCRF Workshop Diaries Record KHCRF-WD-2026-010 (2026).",
      ownerStructure: "Private Bureau",
      yearEstablished: "2002",
      founder: "Fayaz Ahmad Mir",
      avgWorkingDays: "260 Days/Year",
      seasonalOps: "Continuous office operation",
      capacity: "50 design concepts annually",
      primaryMarket: "International Boutique Buyers",
      photoPermission: "Yes",
      audioPermission: "Yes",
      videoPermission: "Yes",
      researchAccessLevel: "Support Member Access Required",
      materialsLog: [
        { material: "Natural gum", source: "Local grower", qty: "6 kg", date: "15 April 2026", condition: "Stable resin", prep: "Drying and grinding", stage: "Material Sourcing", issue: "No Shortage", cost: "Stable", notes: "Wild apricot gum" }
      ],
      toolsLog: [
        { tool: "Detail Brush", local: "Kalam", function: "Fine lining work", ownership: "Personal", condition: "Excellent", repair: "No", replacement: "Yes", notes: "Cat tail hair bundle" }
      ],
      timelineSteps: [
        { id: "01", name: "COMMISSION RECEIVED", status: "Completed" },
        { id: "02", name: "DESIGN APPROVED", status: "Completed" },
        { id: "03", name: "MATERIALS PREPARED", status: "Completed" },
        { id: "04", name: "SETUP", status: "Completed" },
        { id: "05", name: "PRODUCTION", status: "In Progress" },
        { id: "06", name: "FINISHING", status: "Not Started" },
        { id: "07", name: "WASHING", status: "Not Started" },
        { id: "08", name: "REVIEW", status: "Not Started" },
        { id: "09", name: "PACKAGING", status: "Not Started" },
        { id: "10", name: "DISPATCH", status: "Not Started" }
      ],
      stageTracker: "SETUP"
    },
    {
      slug: "diary-family-karkhana",
      title: "The Family Karkhana",
      subtitle: "Work, Responsibility, and Knowledge Across Three Generations",
      dur: "8 Minutes",
      durationMin: 8,
      durationVal: "Under 15 min",
      tag: "Workshop Diary",
      img: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&auto=format&fit=crop",
      desc: "A multi-generational diary documenting how responsibilities are divided among grandparents, parents, and younger family members within a working craft household.",
      accessionId: "KHCRF-WD-2026-011",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Mohammad Yusuf Ahmad",
      preferredPublicName: "Ahmad Carving workshop",
      gender: "Male",
      birthYear: "1950",
      role: "Grandparent Carver",
      yearsInCraft: "60 Years",
      workshop: "Ahmad Carving Center, Baramulla",
      director: "Sajad Dar",
      transcriptPreview: "Three generations of Ahmad weavers finalized pattern assignment configurations.",
      craft: "Walnut Wood Carving",
      theme: "Family Workshop",
      status: "Diary Active",
      hasTranscript: "Yes",
      themes: ["Family Lineage", "Intergenerational Work", "Workshop Management", "Knowledge Transmission", "Household Economy", "Craft Identity"],
      district: "Baramulla",
      recordingDate: "Started January 2026",
      interviewer: "Sajad Dar",
      recorder: "Farooq Mir",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. N. Jan",
      consentStatus: "Consent signed by co-op committee",
      recordingLocation: "Ahmad Center, Baramulla",
      publishedDuration: "8 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "WAV 24-bit 96kHz",
      audioQuality: "Broadcast Grade",
      environment: "Active woodshop interior",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Academic research access only.",
      timestampedSegment: "ENTRY 15 · MULTIPLE COMMISSIONS ACTIVE — 10 June 2026:\nThree generations of Ahmad weavers finalized pattern assignment configurations.",
      relatedResearch: "Metallurgy Audits of Regional Historical Chisels",
      relatedDocumentary: "Doc-KHCRF-2026-11",
      relatedOralHistory: "KHCRF-OH-2026-003",
      relatedCollection: "Architectural Wood Archive",
      relatedCourses: "Wood Joint Conservation",
      relatedKnowledgeArticles: "Tactile Material Grading",
      focus: "Family Workshop",
      stage: "Core Production",
      workshopType: "Family Workshop",
      period: "2026",
      entriesCount: 15,
      latestEntryDate: "10 June 2026",
      latestEntryExcerpt: "Three generations of Ahmad weavers finalized pattern assignment configurations.",
      secondaryCrafts: "planing, timber seasoning",
      participatingArtisans: "4 Family members",
      apprentices: "1 apprentice",
      consentAccessStatus: "Consented & Restricted Access",
      diaryOverview: "Tracking tasks separation, student guidance, and family economic divisions over two seasons.",
      productionObjective: "Examine intergenerational transmission and economic stability in regional family workshops.",
      currentCommission: "Carved wooden chests and screen orders",
      economicNotes: "Family pooling model cushions individual health and output shocks.",
      selectedQuotations: "“My grandfather watches the line, my father holds the gouge, and I clean the dust.”",
      craftVocabulary: "Ustad, Shagird, Wanz, Khot, Chot",
      researchNotes: "Documents stability factors that protect family units during high market volatility weeks.",
      citation: "KHCRF Workshop Diaries Record KHCRF-WD-2026-011 (2026).",
      ownerStructure: "Generational Family Unit",
      yearEstablished: "1940",
      founder: "Abdul Rahman Ahmad",
      avgWorkingDays: "270 Days/Year",
      seasonalOps: "Continuous indoor setup",
      capacity: "15 custom pieces annually",
      primaryMarket: "Regional Commissions & Emporiums",
      photoPermission: "Yes",
      audioPermission: "Yes",
      videoPermission: "Yes",
      researchAccessLevel: "Support Member Access Required",
      materialsLog: [
        { material: "Seasoned Walnut logs", source: "Forest Depot", qty: "6 tons", date: "4 March 2026", condition: "Ready seasoned", prep: "timber plane", stage: "Material Sourcing", issue: "No Shortage", cost: "High", notes: "Air cured wood logs" }
      ],
      toolsLog: [
        { tool: "Gouge Chisel Set", local: "Yer Suj", function: "Wood groove cutting", ownership: "Family owned", condition: "Excellent", repair: "No", replacement: "Yes", notes: "Carbon steel tips" }
      ],
      timelineSteps: [
        { id: "01", name: "COMMISSION RECEIVED", status: "Completed" },
        { id: "02", name: "DESIGN APPROVED", status: "Completed" },
        { id: "03", name: "MATERIALS PREPARED", status: "Completed" },
        { id: "04", name: "SETUP", status: "Completed" },
        { id: "05", name: "PRODUCTION", status: "In Progress" },
        { id: "06", name: "FINISHING", status: "Not Started" },
        { id: "07", name: "WASHING", status: "Not Started" },
        { id: "08", name: "REVIEW", status: "Not Started" },
        { id: "09", name: "PACKAGING", status: "Not Started" },
        { id: "10", name: "DISPATCH", status: "Not Started" }
      ],
      stageTracker: "PRODUCTION"
    },
    {
      slug: "diary-dispatch-preparation",
      title: "Preparing for Dispatch",
      subtitle: "Finishing, Inspection, Packaging, and the Final Days of a Craft Order",
      dur: "8 Minutes",
      durationMin: 8,
      durationVal: "Under 15 min",
      tag: "Workshop Diary",
      img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop",
      desc: "This diary documents the final stage of production across several crafts, including cleaning, trimming, polishing, inspection, documentation, packaging, labelling, and coordination with buyers or logistics providers.",
      accessionId: "KHCRF-WD-2026-012",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Weaving Council Masters",
      preferredPublicName: "Weaving Council dispatchers",
      gender: "Male / Female Team",
      birthYear: "Various",
      role: "Logistics Team",
      yearsInCraft: "Combined 70 Years",
      workshop: "Downtown Srinagar Guild room",
      director: "Zehra Malik",
      transcriptPreview: "Final inspection labels generated for four verified GI-certified shawls. Active artisans: 4",
      craft: "Pashmina Weaving",
      theme: "Quality and Fulfilment",
      status: "Dispatch Preparation",
      hasTranscript: "Yes",
      themes: ["Quality Control", "Finishing", "Packaging", "Fulfilment", "Buyer Requirements", "Product Documentation"],
      district: "Srinagar",
      recordingDate: "Started June 2026",
      interviewer: "Zehra Malik",
      recorder: "Sajad Dar",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. H. Mir",
      consentStatus: "Merchant guild clearance signed",
      recordingLocation: "Srinagar Dispatch Bureau",
      publishedDuration: "8 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "WAV 24-bit 96kHz",
      audioQuality: "Broadcast Grade",
      environment: "Logistics office setup backdrop",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Restricted to support members. Register record public.",
      timestampedSegment: "ENTRY 07 · FINAL INSPECTION — 29 June 2026:\nFinal inspection labels generated for four verified GI-certified shawls. Active artisans: 4.",
      relatedResearch: "Logistics Frameworks for Traditional Exporters in J&K",
      relatedDocumentary: "Doc-KHCRF-2026-12",
      relatedOralHistory: "KHCRF-OH-2026-012",
      relatedCollection: "Bazaar Trade Archive",
      relatedCourses: "E-Commerce Logistics for Crafts",
      relatedKnowledgeArticles: "Downtown Bazaars Heritage",
      focus: "Market Response",
      stage: "Final Inspection",
      workshopType: "Design Studio",
      period: "2026",
      entriesCount: 7,
      latestEntryDate: "29 June 2026",
      latestEntryExcerpt: "Final inspection labels generated for four verified GI-certified shawls. Active artisans: 4",
      secondaryCrafts: "Labelling, Customs clearance",
      participatingArtisans: "4 Dispatchers",
      apprentices: "0 active apprentices",
      consentAccessStatus: "Consented & Restricted",
      diaryOverview: "Observing cleaning, quality inspection stamp checks, and packing of shawls before international air cargo shipping.",
      productionObjective: "Assess delay factors and logistics buffers at export customs clearance stages.",
      currentCommission: "Embroidered Pashmina shipment for gallery buyer in London",
      economicNotes: "Customs declaration delays lock client cash flow. Export insurance rates checked.",
      selectedQuotations: "“The stamp goes on the corner. If the threads are not clean, the customs box is returned.”",
      craftVocabulary: "GI-Tag, Wash, Custom, Packing, Label",
      researchNotes: "Documents shipping transit buffers between Srinagar and Delhi cargo centers.",
      citation: "KHCRF Workshop Diaries Record KHCRF-WD-2026-012 (2026).",
      ownerStructure: "Cooperative Alliance",
      yearEstablished: "2015",
      founder: "Handicrafts Directorate",
      avgWorkingDays: "250 Days/Year",
      seasonalOps: "Continuous office operations",
      capacity: "2000 pieces export annually",
      primaryMarket: "International Heritage Galleries",
      photoPermission: "Yes",
      audioPermission: "Yes",
      videoPermission: "Yes",
      researchAccessLevel: "Support Member Access Required",
      materialsLog: [
        { material: "Acid-free wrapping", source: "Local supplier", qty: "40 rolls", date: "10 June 2026", condition: "Ready sheets", prep: "None", stage: "Packaging", issue: "No Shortage", cost: "Stable", notes: "PH-neutral packaging sheets" }
      ],
      toolsLog: [
        { tool: "Inspection Loupe", local: "Aina", function: "Thread density check", ownership: "Guild owned", condition: "Excellent", repair: "No", replacement: "Yes", notes: "10x optical magnification" }
      ],
      timelineSteps: [
        { id: "01", name: "COMMISSION RECEIVED", status: "Completed" },
        { id: "02", name: "DESIGN APPROVED", status: "Completed" },
        { id: "03", name: "MATERIALS PREPARED", status: "Completed" },
        { id: "04", name: "SETUP", status: "Completed" },
        { id: "05", name: "PRODUCTION", status: "Completed" },
        { id: "06", name: "FINISHING", status: "Completed" },
        { id: "07", name: "WASHING", status: "Completed" },
        { id: "08", name: "REVIEW", status: "In Progress" },
        { id: "09", name: "PACKAGING", status: "Not Started" },
        { id: "10", name: "DISPATCH", status: "Not Started" }
      ],
      stageTracker: "REVIEW"
    }
  ]);
  const [loading, setLoading] = useState(false);

  // View state switcher
  const [currentView, setCurrentView] = useState<'cards' | 'list' | 'index'>('cards');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCraft, setSelectedCraft] = useState('All Crafts');
  const [selectedTheme, setSelectedTheme] = useState('All Diaries');
  const [selectedStage, setSelectedStage] = useState('All Stages');
  const [selectedWorkshopType, setSelectedWorkshopType] = useState('All Workshop Types');
  const [selectedDuration, setSelectedDuration] = useState('All Durations');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [selectedSort, setSelectedSort] = useState('Featured');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedPeriod, setSelectedPeriod] = useState('All Periods');

  const [currentPage, setCurrentPage] = useState(1);
  const [activeDiary, setActiveDiary] = useState<any>(null);
  const [activeModalTab, setActiveModalTab] = useState<'overview' | 'chronological' | 'timeline' | 'materials' | 'profile' | 'research'>('overview');
  const itemsPerPage = 6;

  // Filter logic
  const filteredDiaries = allDiaries.filter(h => {
    // 1. Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchText = `${h.title} ${h.subtitle || ''} ${h.desc} ${h.artisan} ${h.accessionId} ${h.director} ${h.craft} ${h.theme} ${h.district} ${h.focus} ${h.stage} ${h.workshopType} ${h.transcriptPreview || ''}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    // 2. Craft
    if (selectedCraft !== 'All Crafts') {
      if (h.craft !== selectedCraft) return false;
    }
    // 3. Theme / Diary Focus
    if (selectedTheme !== 'All Diaries') {
      if (h.focus !== selectedTheme) return false;
    }
    // 4. Production Stage
    if (selectedStage !== 'All Stages') {
      if (h.stage !== selectedStage) return false;
    }
    // 5. Workshop Type
    if (selectedWorkshopType !== 'All Workshop Types') {
      if (h.workshopType !== selectedWorkshopType) return false;
    }
    // 6. Geography
    if (selectedLocation !== 'All Locations') {
      const dist = h.district.toLowerCase();
      const sel = selectedLocation.toLowerCase();
      if (!dist.includes(sel)) return false;
    }
    // 7. Period
    if (selectedPeriod !== 'All Periods') {
      if (selectedPeriod === 'Active This Week' || selectedPeriod === 'Active This Month') {
        if (h.year !== '2026') return false;
      } else if (selectedPeriod === 'Earlier Diaries') {
        if (parseInt(h.year) >= 2025) return false;
      } else if (selectedPeriod === 'Completed Diaries') {
        if (h.status !== 'Diary Completed') return false;
      } else {
        if (h.period !== selectedPeriod) return false;
      }
    }
    // 8. Duration
    if (selectedDuration !== 'All Durations') {
      const min = h.durationMin;
      if (selectedDuration === 'Under 15 min' && min >= 15) return false;
      if (selectedDuration === '15–30 min' && (min < 15 || min > 30)) return false;
    }
    // 9. Status
    if (selectedStatus !== 'All Statuses') {
      if (h.status !== selectedStatus) return false;
    }
    // 10. Language
    if (selectedLanguage !== 'All Languages') {
      if (selectedLanguage === 'English Summary Available') {
        if (!h.desc && !h.transcriptPreview) return false;
      } else if (selectedLanguage === 'Full Translation Available') {
        if (h.translationLanguage !== 'English') return false;
      } else {
        if (!h.language.toLowerCase().includes(selectedLanguage.toLowerCase())) return false;
      }
    }
    return true;
  });

  // Sort logic
  const sortedDiaries = [...filteredDiaries].sort((a, b) => {
    if (selectedSort === 'Recently Updated') {
      return b.entriesCount - a.entriesCount;
    }
    if (selectedSort === 'Oldest Active') {
      return parseInt(a.year) - parseInt(b.year);
    }
    if (selectedSort === 'Newest Started') {
      return parseInt(b.year) - parseInt(a.year);
    }
    if (selectedSort === 'Most Entries') {
      return b.entriesCount - a.entriesCount;
    }
    if (selectedSort === 'Production Stage') {
      return a.stage.localeCompare(b.stage);
    }
    if (selectedSort === 'Craft Tradition') {
      return a.craft.localeCompare(b.craft);
    }
    if (selectedSort === 'Workshop Name') {
      return a.workshop.localeCompare(b.workshop);
    }
    if (selectedSort === 'District') {
      return a.district.localeCompare(b.district);
    }
    if (selectedSort === 'A–Z') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Chronological Timeline Array mapping entries across all participating workshops
  const timelineEntries = [
    {
      date: "March 24, 2026",
      accessionId: "KHCRF-WD-2026-001",
      title: "A Carpet Commission from Talim to Final Cut",
      stage: "Knotting",
      workshop: "Bhat Karkhana, Srinagar",
      note: "The central medallion has reached its first major transition. Alignment issue corrected in the next row setup.",
      author: "Farooq Mir",
      status: "Diary Active"
    },
    {
      date: "March 18, 2026",
      accessionId: "KHCRF-WD-2026-005",
      title: "Learning the Chisel",
      stage: "Shallow Relief Carving",
      workshop: "Downtown Srinagar Woodshop",
      note: "Master Ali Mohammad instructs the apprentice on correct chisel angle selection for leaves carving.",
      author: "Sajad Dar",
      status: "Diary Active"
    },
    {
      date: "March 02, 2026",
      accessionId: "KHCRF-WD-2026-003",
      title: "The Sozni Room",
      stage: "Embroidery and Quality Review",
      workshop: "Domestic Co-op Pampore",
      note: "Stitch count verified at 80 stitches per inch. Thread tension verified on raw Pashmina borders.",
      author: "Zehra Malik",
      status: "Diary Active"
    },
    {
      date: "February 28, 2026",
      accessionId: "KHCRF-WD-2026-003",
      title: "The Sozni Room",
      stage: "Embroidery and Quality Review",
      workshop: "Domestic Co-op Pampore",
      note: "Weekly wage card reviewed and accepted by Pamposh collective spinners.",
      author: "Zehra Malik",
      status: "Diary Active"
    },
    {
      date: "February 15, 2026",
      accessionId: "KHCRF-WD-2026-006",
      title: "Copper Orders Before the Wedding Season",
      stage: "Engraving and Polishing",
      workshop: "Zaina Kadal Copper Workshop",
      note: "Engraving design layout finalized by the master designer. Geometric coordinates verified.",
      author: "Sajad Dar",
      status: "Production Cycle Active"
    },
    {
      date: "January 22, 2026",
      accessionId: "KHCRF-WD-2026-007",
      title: "Drying Between the Seasons",
      stage: "Surface Preparation and Drying",
      workshop: "Downtown Srinagar Woodshops",
      note: "Zero-degree freeze halts the morning lacquer application. Work started at 12:00 PM. Kangri charcoal replenished.",
      author: "Farooq Mir",
      status: "Field Access Confirmed"
    },
    {
      date: "January 12, 2026",
      accessionId: "KHCRF-WD-2026-009",
      title: "A Workshop Without Apprentices",
      stage: "Limited Production Capacity",
      workshop: "Ahmad Carving Center, Baramulla",
      note: "Sharpening of woodcarving chisels completed. Yield: stable edge performance.",
      author: "Sajad Dar",
      status: "Archived"
    },
    {
      date: "December 20, 2025",
      accessionId: "KHCRF-WD-2026-008",
      title: "From Willow to Basket",
      stage: "Willow Preparation",
      workshop: "Ganderbal Willow unit",
      note: "Boiling cycle of raw willow stalks finalized in central vats. Peeled yields indexed.",
      author: "Farooq Mir",
      status: "Seasonal Diary Active"
    }
  ];

  const totalPages = Math.ceil(sortedDiaries.length / itemsPerPage);
  const paginatedDiaries = sortedDiaries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pb-24 animate-fadeIn">
      {/* Detailed Modal Registry Sheet */}
      {activeDiary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#3E2723]/40 backdrop-blur-sm" onClick={() => setActiveDiary(null)}></div>
          <div className="relative z-10 bg-[#FAF9F6] border-2 border-[#3E2723] max-w-3xl w-full p-6 md:p-8 shadow-2xl text-[#2A2A2A] max-h-[95vh] overflow-y-auto custom-scrollbar font-mono rounded-xs" role="dialog" aria-modal="true">
            <button onClick={() => setActiveDiary(null)} className="absolute top-4 right-4 text-[#3E2723]/50 hover:text-[#3E2723] text-xl font-bold font-mono">&times;</button>
            
            {/* Modal Header */}
            <div className="text-center mb-6 border-b-2 border-[#3E2723]/25 pb-4">
              <span className="text-[#D4AF37] font-mono text-xs uppercase tracking-widest block mb-1 font-bold">KHCRF FIELD PRACTICE ARCHIVE</span>
              <h2 className="text-xl md:text-2xl font-serif text-[#3E2723] font-bold leading-tight">{activeDiary.title}</h2>
              {activeDiary.subtitle && <p className="text-gray-500 text-xs italic font-serif mt-1">{activeDiary.subtitle}</p>}
              
              <div className="flex flex-wrap justify-center gap-2 mt-3 font-mono text-[9px] uppercase tracking-wider text-gray-500">
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">ACCESSION: {activeDiary.accessionId}</span>
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">FOCUS: {activeDiary.focus}</span>
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">STAGE: {activeDiary.stage}</span>
                <span className="bg-[#3E2723] text-[#D4AF37] px-2 py-0.5 font-bold">{activeDiary.status.toUpperCase()}</span>
              </div>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex flex-wrap gap-1 border-b border-[#3E2723]/20 pb-3 mb-6 text-[10px] font-mono justify-center">
              {[
                { id: 'overview', label: 'Diary Overview' },
                { id: 'chronological', label: 'Chronological Entries' },
                { id: 'timeline', label: 'Production Timeline' },
                { id: 'materials', label: 'Materials & Tools' },
                { id: 'profile', label: 'Workshop Profile' },
                { id: 'research', label: 'Research & Access' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveModalTab(tab.id as any)}
                  className={`px-3 py-1.5 border border-t-2 transition-all ${
                    activeModalTab === tab.id
                      ? 'bg-[#3E2723] text-white border-[#3E2723] border-t-[#D4AF37]'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-[#3E2723]/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body Contents based on Tab State */}
            <div className="space-y-6 text-xs text-gray-700 leading-relaxed font-mono">
              
              {/* TAB 1: OVERVIEW */}
              {activeModalTab === 'overview' && (
                <div className="space-y-4 font-sans">
                  <div>
                    <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2 font-mono">Diary Overview</h3>
                    <p className="text-gray-650 leading-relaxed font-sans">{activeDiary.desc}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 font-mono text-[11px]">
                    <div>
                      <span className="text-gray-400 uppercase font-bold block text-[9px]">Production Objective</span>
                      <p className="text-[#2A2A2A] font-sans">{activeDiary.productionObjective || "Document technical process steps."}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 uppercase font-bold block text-[9px]">Current Commission</span>
                      <p className="text-[#2A2A2A] font-sans">{activeDiary.currentCommission || "Generational co-op sample study."}</p>
                    </div>
                  </div>

                  {activeDiary.economicNotes && (
                    <div className="bg-[#3E2723]/5 p-3 border-l-2 border-[#3E2723]/50 text-[11px]">
                      <span className="text-[#3E2723] font-bold block text-[10px] uppercase font-mono">Economic & Market Notes</span>
                      <p className="text-gray-600 font-sans">{activeDiary.economicNotes}</p>
                    </div>
                  )}

                  {activeDiary.selectedQuotations && (
                    <blockquote className="border-l-4 border-[#D4AF37] pl-4 italic text-gray-650 font-serif my-4">
                      {activeDiary.selectedQuotations}
                      <span className="block text-[8px] uppercase tracking-widest font-bold text-gray-400 font-mono mt-1">&mdash; Selected Artisan Quote</span>
                    </blockquote>
                  )}

                  {activeDiary.craftVocabulary && (
                    <div className="border border-gray-200 p-3 bg-white text-[11px] font-mono">
                      <span className="text-gray-400 font-bold block text-[9px] uppercase">Craft Vocabulary / Local Terminology</span>
                      <p className="text-[#3E2723] mt-1 font-mono font-bold">{activeDiary.craftVocabulary}</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: CHRONOLOGICAL ENTRIES */}
              {activeModalTab === 'chronological' && (
                <div className="space-y-6">
                  {/* Production Stage Line */}
                  <div className="bg-[#FAF9F6] border border-gray-200 p-4 font-mono text-[9px] leading-relaxed">
                    <span className="text-gray-400 font-bold block text-[8px] uppercase mb-2">Operational Production Stage Alignment</span>
                    <div className="flex flex-wrap justify-between items-center text-gray-500 font-bold">
                      {["MATERIALS", "SETUP", "PRODUCTION", "FINISHING", "REVIEW", "DISPATCH"].map((st) => (
                        <div key={st} className="flex flex-col items-center gap-1">
                          <span className={`${activeDiary.stageTracker === st ? 'text-[#3E2723]' : 'text-gray-300'}`}>{st}</span>
                          <span className={`text-[12px] ${activeDiary.stageTracker === st ? 'text-[#D4AF37]' : 'text-gray-200'}`}>●</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border-2 border-[#3E2723]/35 p-5 relative font-mono text-[11px] space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
                      <span className="text-[#3E2723] font-bold font-mono">ENTRY {activeDiary.entriesCount} &bull; LATEST FIELD LOG</span>
                      <span className="text-gray-400 font-mono">{activeDiary.latestEntryDate}</span>
                    </div>

                    <h4 className="font-bold text-sm text-[#3E2723] leading-snug">{activeDiary.stage} · Current Phase</h4>
                    <p className="text-gray-650 font-serif leading-relaxed italic">
                      “{activeDiary.latestEntryExcerpt}”
                    </p>

                    {/* Field observations details */}
                    <div className="bg-[#FAF9F6] p-4 border border-gray-200 my-4 space-y-1.5 font-mono text-[10px] leading-relaxed">
                      <h5 className="text-[#3E2723] font-bold uppercase tracking-wider mb-2 border-b border-gray-200 pb-1 text-[9px]">FIELD OBSERVATIONS</h5>
                      <div>• Apprentice present: {activeDiary.apprentices.replace(" active", "").replace(" Apprentices", "").replace(" Apprentice", "")}</div>
                      <div>• Working hours observed: 5.5</div>
                      <div>• Material used: {activeDiary.materialsLog?.[0]?.material || "Sourced fiber yarns"}</div>
                      <div>• Production interruption: 35 minutes</div>
                      <div>• Correction required: Yes</div>
                      <div>• Weather influence: None recorded</div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-gray-400 pt-3 border-t border-gray-100 font-mono">
                      <span>Field Observer: {activeDiary.director}</span>
                      <span className="font-bold text-[#3E2723]">Entry in Editorial Review</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: TIMELINE */}
              {activeModalTab === 'timeline' && (
                <div className="space-y-4 font-mono">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-4">Institutional Production Tracker</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                    {activeDiary.timelineSteps?.map((step: any) => (
                      <div key={step.id} className="flex justify-between items-center border border-gray-200 p-2.5 bg-white">
                        <span>{step.id} &bull; {step.name}</span>
                        <span className={`px-2 py-0.5 text-[9px] uppercase border font-bold ${
                          step.status === 'Completed' ? 'text-green-600 border-green-200 bg-green-50' : step.status === 'In Progress' ? 'text-[#3E2723] border-[#3E2723] bg-[#3E2723]/5' : 'text-gray-300 border-gray-100 bg-gray-50'
                        }`}>{step.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: MATERIALS & TOOLS LOG */}
              {activeModalTab === 'materials' && (
                <div className="space-y-6">
                  {/* Materials Log */}
                  <div>
                    <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Structured Material Ledger</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-[10px]">
                        <thead>
                          <tr className="bg-gray-100 uppercase text-gray-400 font-bold border-b border-gray-200">
                            <th className="p-2">Material</th>
                            <th className="p-2">Source</th>
                            <th className="p-2">Qty</th>
                            <th className="p-2">Received</th>
                            <th className="p-2">Condition</th>
                            <th className="p-2">Cost Change</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {activeDiary.materialsLog?.map((mat: any, idx: number) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="p-2 font-bold">{mat.material}</td>
                              <td className="p-2">{mat.source}</td>
                              <td className="p-2 font-mono">{mat.qty}</td>
                              <td className="p-2">{mat.date}</td>
                              <td className="p-2">{mat.condition}</td>
                              <td className="p-2 text-[#3E2723] font-bold">{mat.cost}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Tools Log */}
                  <div>
                    <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Tool Conservation Records</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-[10px]">
                        <thead>
                          <tr className="bg-gray-100 uppercase text-gray-400 font-bold border-b border-gray-200">
                            <th className="p-2">Tool Name</th>
                            <th className="p-2">Local Name</th>
                            <th className="p-2">Function</th>
                            <th className="p-2">Condition</th>
                            <th className="p-2">Repair</th>
                            <th className="p-2">Replacement</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {activeDiary.toolsLog?.map((tool: any, idx: number) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="p-2 font-bold">{tool.tool}</td>
                              <td className="p-2 italic">{tool.local}</td>
                              <td className="p-2">{tool.function}</td>
                              <td className="p-2">{tool.condition}</td>
                              <td className="p-2">{tool.repair}</td>
                              <td className="p-2">{tool.replacement}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: WORKSHOP PROFILE */}
              {activeModalTab === 'profile' && (
                <div className="space-y-4 font-mono text-[11px] grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-[#D4AF37] font-bold border-b border-gray-200 pb-1 uppercase text-[10px]">General Parameters</h4>
                    <div><span className="text-gray-400">Workshop Name  :</span> {activeDiary.workshop}</div>
                    <div><span className="text-gray-400">Display Name   :</span> {activeDiary.preferredPublicName}</div>
                    <div><span className="text-gray-400">Established    :</span> {activeDiary.yearEstablished || "1982"}</div>
                    <div><span className="text-gray-400">Founder        :</span> {activeDiary.founder || activeDiary.artisan}</div>
                    <div><span className="text-gray-400">Master Artisan :</span> {activeDiary.artisan}</div>
                    <div><span className="text-gray-400">Ownership      :</span> {activeDiary.ownerStructure || "Sole Proprietorship"}</div>
                    <div><span className="text-gray-400">Artisans Count :</span> {activeDiary.participatingArtisans}</div>
                    <div><span className="text-gray-400">Apprentices    :</span> {activeDiary.apprentices}</div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[#D4AF37] font-bold border-b border-gray-200 pb-1 uppercase text-[10px]">Operations & Permissions</h4>
                    <div><span className="text-gray-400">Working Days   :</span> {activeDiary.avgWorkingDays || "260 Days/Year"}</div>
                    <div><span className="text-gray-400">Seasonal Ops   :</span> {activeDiary.seasonalOps || "Continuous"}</div>
                    <div><span className="text-gray-400">Capacity       :</span> {activeDiary.capacity || "Continuous setup"}</div>
                    <div><span className="text-gray-400">Primary Market :</span> {activeDiary.primaryMarket || "Emporiums"}</div>
                    <div><span className="text-gray-400">Locality/Dist  :</span> {activeDiary.recordingLocation} ({activeDiary.district})</div>
                    <div><span className="text-gray-400">Research Access:</span> {activeDiary.consentAccessStatus}</div>
                  </div>
                </div>
              )}

              {/* TAB 6: RESEARCH & CITATION */}
              {activeModalTab === 'research' && (
                <div className="space-y-4 font-mono text-[11px] space-y-4">
                  <div>
                    <span className="text-gray-400 font-bold block text-[9px] uppercase">Research Observer Notes</span>
                    <p className="text-gray-700 font-sans">{activeDiary.researchNotes || "Detailed longitudinal studies preserved inside the repository database."}</p>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <span className="text-gray-400 font-bold block text-[9px] uppercase">Archival Citation Reference</span>
                    <p className="text-[#3E2723] font-bold font-mono">{activeDiary.citation || "KHCRF Workshop Preservation Archive (2026)."}</p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-250 p-3 text-[10px] leading-relaxed text-yellow-800">
                    <span className="font-bold block uppercase mb-1">Consent & Access Level Info</span>
                    Sensitive commercial information and buyer profiles are restricted. Authorized research members can request full database credentials.
                  </div>
                </div>
              )}

            </div>

            <div className="border-t border-[#D4AF37]/30 pt-6 text-center space-y-4 font-mono mt-6">
              <p className="text-[9px] uppercase tracking-widest text-gray-400 leading-relaxed font-mono">
                Sensitive commercial information should not be published without consent.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link href="/about/memberships" className="bg-[#D4AF37] text-[#3E2723] hover:bg-white px-6 py-3 font-bold uppercase tracking-wider text-xs transition-all border border-[#D4AF37] font-mono">
                  Request Full Log Access
                </Link>
                <button onClick={() => setActiveDiary(null)} className="border border-[#3E2723] hover:bg-[#3E2723]/5 text-[#3E2723] px-6 py-3 uppercase tracking-wider text-xs transition-colors font-light font-mono">
                  Return to Registry
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Hero section */}
      <UniversalEditorialHero pageKey="workshop-diaries" fallbackConfig={workshopDiariesHeroFallback as any} />

      <div className="container-fluid mx-auto px-4 md:px-10 py-12 max-w-7xl animate-fadeIn">
        
        {/* Introductory Statement Block */}
        <div className="bg-[#3E2723]/5 border-l-4 border-[#3E2723] p-8 mb-12 rounded-r-xs max-w-5xl">
          <p className="text-gray-700 text-base md:text-lg leading-relaxed font-serif">
            KHCRF Workshop Diaries document craft as a living process rather than a finished object. Through recurring field visits, dated entries, workshop observations, artisan reflections, production notes, material records, and process documentation, each diary follows how work develops inside a specific workshop over time.
          </p>
          <p className="text-gray-755 text-xs mt-3 uppercase tracking-widest font-bold font-mono">
            The archive records the ordinary but essential realities of craft production: preparing materials, interpreting designs, assigning work, training apprentices, correcting mistakes, managing commissions, responding to changing markets, and sustaining workshop life from one day to the next.
          </p>
          
          <div className="flex flex-wrap gap-4 mt-6 font-mono text-xs">
            <a href="#results" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-5 py-2.5 font-bold uppercase tracking-wider transition-all">
              Explore Workshop Diaries
            </a>
            <a href="#suggest" className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-5 py-2.5 font-bold uppercase tracking-wider transition-all">
              Propose a Workshop
            </a>
            <a href="#methodology" className="text-[#3E2723] hover:underline font-bold py-2.5">
              Read the Field Documentation Methodology &rarr;
            </a>
          </div>
        </div>

        {/* Featured Workshop Diary */}
        <section className="bg-white border-4 border-[#3E2723] p-8 md:p-10 mb-16 relative shadow-md">
          <div className="absolute top-0 right-0 bg-[#3E2723] text-[#D4AF37] px-4 py-1 text-[10px] font-mono font-bold uppercase tracking-widest">
            FEATURED WORKSHOP DIARY
          </div>
          
          <div className="max-w-4xl">
            <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-1">
              Archive Record: KHCRF-WD-2026-001
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3E2723] leading-tight mb-2">
              A Carpet Commission from Talim to Final Cut
            </h2>
            <h3 className="text-base md:text-lg font-serif italic text-gray-500 mb-4">
              Following a Srinagar Workshop Through One Complete Production Cycle
            </h3>
            
            <p className="text-gray-700 text-sm leading-relaxed mb-4 font-sans text-gray-655">
              This diary follows a hand-knotted carpet commission from the first interpretation of the talim through loom preparation, yarn organization, knotting, daily correction, progress monitoring, finishing, washing, stretching, quality review, and final dispatch.
              The record documents not only technical production, but also the relationships among the master artisan, talim reader, weavers, apprentices, workshop manager, buyer, and finishing workers.
            </p>

            <div className="bg-[#FAF9F6] border border-[#3E2723]/20 p-4 mb-6 font-mono text-xs">
              <div className="text-[#D4AF37] font-bold mb-1">CURRENT ENTRY: ENTRY 14 &bull; KNOTTING PHASE</div>
              <p className="italic text-gray-600">
                The central medallion has reached its first major transition. The master artisan has identified a minor alignment issue and instructed the weavers to correct the next sequence before further rows are completed.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6 font-mono text-[9px]">
              {["Workshop Diary", "Hand-Knotted Carpet", "Srinagar", "Started March 2026", "14 Published Entries", "Production Cycle Active", "Kashmiri and Urdu", "English Summaries Available"].map((tagText) => (
                <span key={tagText} className="bg-[#FAF9F6] border border-[#3E2723]/20 text-[#3E2723] uppercase font-semibold px-2 py-1">
                  {tagText}
                </span>
              ))}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => { setActiveDiary(allDiaries[0]); setActiveModalTab('overview'); }}
                className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-all font-mono"
              >
                Open Workshop Diary
              </button>
              <button 
                onClick={() => {
                  setActiveDiary(allDiaries[0]);
                  setActiveModalTab('chronological');
                }}
                className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-all font-mono"
              >
                View Latest Entry
              </button>
            </div>
          </div>
        </section>

        {/* Why Document Workshops Over Time Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start mt-12">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-serif text-[#3E2723] mb-6 font-bold">Why Document Workshops Over Time?</h2>
            <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans">
              A single interview or demonstration can explain what an artisan knows, but it cannot always show how that knowledge is applied repeatedly under real working conditions.
            </p>
            <p className="text-gray-605 text-sm leading-relaxed font-sans">
              Craft production is shaped by time. Materials arrive late. Designs change. Apprentices make mistakes. Weather affects drying. Buyers revise commissions. Tools wear down. Family responsibilities interrupt work. Skilled artisans leave. New workers must be trained.
            </p>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#3E2723]/10 p-8 rounded-xs shadow-xs">
            <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 font-mono">
              Workshop Diaries preserve these realities by documenting:
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700 font-sans">
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>daily and weekly production activity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>workshop routines and working relationships</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>material preparation and availability</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>commission planning and fulfilment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>design interpretation and modification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>artisan decision-making</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>apprenticeship and correction</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>production delays and disruptions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>seasonal changes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>quality-control practices</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>tool maintenance and replacement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>workshop economics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>changes in labour participation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>experimentation and innovation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>continuity and decline within workshops</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Archive Overview (Archive Preview Data Block) */}
        <section className="bg-[#3E2723] text-white p-8 md:p-10 mb-12 rounded-xs relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#3E2723] px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-widest">
            Archive Overview
          </div>
          <div className="mb-8">
            <h3 className="font-serif text-2xl text-[#D4AF37] mb-2">Field Practice Archive</h3>
            <p className="text-white/60 text-xs font-mono">
              INTERNAL CORPS REGISTRY SYSTEM METRICS
            </p>
          </div>

          {/* Primary Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 text-center md:text-left border-b border-white/10 pb-8 mb-8">
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono font-mono">Active Workshop Diaries</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">12</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Participating Workshops</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">9</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Diary Entries</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">146</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Craft Traditions Documented</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">10</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Field Visits Completed</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">84</span>
            </div>
            <div className="last:border-0">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono font-mono">Districts Represented</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">6</span>
            </div>
          </div>

          {/* Secondary Useful Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 text-center md:text-left">
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Production Cycles Followed</span>
              <span className="text-2xl font-serif font-semibold text-white/80">18</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono font-mono">Artisans Documented</span>
              <span className="text-2xl font-serif font-semibold text-white/80">47</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Apprentices Observed</span>
              <span className="text-2xl font-serif font-semibold text-white/80">16</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Field Notes Published</span>
              <span className="text-2xl font-serif font-semibold text-white/80">112</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Process Stages Recorded</span>
              <span className="text-2xl font-serif font-semibold text-white/80">94</span>
            </div>
            <div className="last:border-0">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Documentation Hours</span>
              <span className="text-lg font-serif font-semibold text-white/80 block leading-tight font-mono">286h</span>
            </div>
          </div>
        </section>

        {/* View Switcher Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 bg-[#FAF9F6] border border-[#3E2723]/10 p-4 font-mono" id="results">
          <div className="text-xs font-serif text-[#3E2723]">
            KHCRF Registry Catalog &bull; Showing {sortedDiaries.length} Records
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] text-gray-400 uppercase self-center mr-2 font-mono">Archive Layout View:</span>
            <button 
              onClick={() => { setCurrentView('cards'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'cards' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Diary Cards
            </button>
            <button 
              onClick={() => { setCurrentView('list'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'list' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Chronological Timeline
            </button>
            <button 
              onClick={() => { setCurrentView('index'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'index' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Fieldwork Index
            </button>
          </div>
        </div>

        {/* Search and Discovery Layout */}
        <section className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4 bg-white border border-[#3E2723]/10 p-6 shadow-xs sticky top-4 z-10 font-sans">
            <h3 className="font-serif text-lg text-[#3E2723] mb-6 pb-2 border-b border-gray-100 flex items-center justify-between font-bold">
              <span>Filter Archive</span>
              <button 
                onClick={() => {
                  setSelectedCraft('All Crafts');
                  setSelectedTheme('All Diaries');
                  setSelectedStage('All Stages');
                  setSelectedWorkshopType('All Workshop Types');
                  setSelectedLocation('All Locations');
                  setSelectedDuration('All Durations');
                  setSelectedStatus('All Statuses');
                  setSelectedLanguage('All Languages');
                  setSelectedSort('Featured');
                  setSearchQuery('');
                  setSelectedPeriod('All Periods');
                  setCurrentPage(1);
                }}
                className="text-[10px] text-[#3949AB] hover:underline font-bold uppercase tracking-wider font-mono"
              >
                Reset
              </button>
            </h3>

            <div className="space-y-6">
              {/* Search Field */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Search Corpus</label>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="Search diaries by workshop, artisan, craft, district, production stage, material, commission, theme, or diary entry..."
                  className="w-full border border-gray-200 px-3 py-2 text-xs rounded-none bg-[#FAF9F6] text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                />
              </div>

              {/* Craft Tradition */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Craft Tradition</label>
                <select 
                  value={selectedCraft}
                  onChange={(e) => { setSelectedCraft(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Crafts">All Crafts</option>
                  <option value="Hand-Knotted Carpet">Hand-Knotted Carpet</option>
                  <option value="Pashmina Weaving">Pashmina Weaving</option>
                  <option value="Kani Shawl">Kani Shawl</option>
                  <option value="Sozni Embroidery">Sozni Embroidery</option>
                  <option value="Crewel Embroidery">Crewel Embroidery</option>
                  <option value="Papier-Mâché">Papier-Mâché</option>
                  <option value="Walnut Wood Carving">Walnut Wood Carving</option>
                  <option value="Copperware">Copperware</option>
                  <option value="Namda">Namda</option>
                  <option value="Willow Wicker">Willow Wicker</option>
                  <option value="Chain Stitch">Chain Stitch</option>
                  <option value="Multi-Craft Workshop">Multi-Craft Workshop</option>
                </select>
              </div>

              {/* Diary Focus */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Diary Focus</label>
                <select 
                  value={selectedTheme}
                  onChange={(e) => { setSelectedTheme(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Diaries">All Diaries</option>
                  <option value="Daily Workshop Practice">Daily Workshop Practice</option>
                  <option value="Production Cycle">Production Cycle</option>
                  <option value="Master–Apprentice Learning">Master–Apprentice Learning</option>
                  <option value="Family Workshop">Family Workshop</option>
                  <option value="Women-Led Workshop">Women-Led Workshop</option>
                  <option value="Cooperative Production">Cooperative Production</option>
                  <option value="Commission Diary">Commission Diary</option>
                  <option value="Material Preparation">Material Preparation</option>
                  <option value="Design Development">Design Development</option>
                  <option value="Revival Initiative">Revival Initiative</option>
                  <option value="Innovation Trial">Innovation Trial</option>
                  <option value="Workshop Transition">Workshop Transition</option>
                  <option value="Seasonal Production">Seasonal Production</option>
                  <option value="Market Response">Market Response</option>
                </select>
              </div>

              {/* Production Stage */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono font-mono">Production Stage</label>
                <select 
                  value={selectedStage}
                  onChange={(e) => { setSelectedStage(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Stages">All Stages</option>
                  <option value="Material Sourcing">Material Sourcing</option>
                  <option value="Material Preparation">Material Preparation</option>
                  <option value="Design Planning">Design Planning</option>
                  <option value="Loom or Tool Setup">Loom or Tool Setup</option>
                  <option value="Core Production">Core Production</option>
                  <option value="Surface Decoration">Surface Decoration</option>
                  <option value="Finishing">Finishing</option>
                  <option value="Washing">Washing</option>
                  <option value="Drying">Drying</option>
                  <option value="Quality Review">Quality Review</option>
                  <option value="Packaging">Packaging</option>
                  <option value="Dispatch">Dispatch</option>
                  <option value="Commission Completed">Commission Completed</option>
                </select>
              </div>

              {/* Workshop Type */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Workshop Type</label>
                <select 
                  value={selectedWorkshopType}
                  onChange={(e) => { setSelectedWorkshopType(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Workshop Types">All Workshop Types</option>
                  <option value="Family Workshop">Family Workshop</option>
                  <option value="Master Artisan Workshop">Master Artisan Workshop</option>
                  <option value="Home-Based Production">Home-Based Production</option>
                  <option value="Cooperative">Cooperative</option>
                  <option value="Manufacturer Workshop">Manufacturer Workshop</option>
                  <option value="Community Production Unit">Community Production Unit</option>
                  <option value="Training Workshop">Training Workshop</option>
                  <option value="Design Studio">Design Studio</option>
                  <option value="Revival Centre">Revival Centre</option>
                  <option value="Seasonal Workshop">Seasonal Workshop</option>
                </select>
              </div>

              {/* Geography */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Geography</label>
                <select 
                  value={selectedLocation}
                  onChange={(e) => { setSelectedLocation(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Locations">All Locations</option>
                  <option value="Srinagar">Srinagar</option>
                  <option value="Budgam">Budgam</option>
                  <option value="Ganderbal">Ganderbal</option>
                  <option value="Baramulla">Baramulla</option>
                  <option value="Anantnag">Anantnag</option>
                  <option value="Pulwama">Pulwama</option>
                  <option value="Bandipora">Bandipora</option>
                  <option value="Kupwara">Kupwara</option>
                  <option value="Shopian">Shopian</option>
                  <option value="Kulgam">Kulgam</option>
                </select>
              </div>

              {/* Documentation Period */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Documentation Period</label>
                <select 
                  value={selectedPeriod}
                  onChange={(e) => { setSelectedPeriod(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Periods">All Periods</option>
                  <option value="Active This Week">Active This Week</option>
                  <option value="Active This Month">Active This Month</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="Earlier Diaries">Earlier Diaries</option>
                  <option value="Completed Diaries">Completed Diaries</option>
                </select>
              </div>

              {/* Diary Status */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono font-mono">Diary Status</label>
                <select 
                  value={selectedStatus}
                  onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Statuses">All Statuses</option>
                  <option value="Diary Active">Diary Active</option>
                  <option value="Entry in Review">Entry in Review</option>
                  <option value="Field Access Confirmed">Field Access Confirmed</option>
                  <option value="Diary Paused">Diary Paused</option>
                  <option value="Diary Completed">Diary Completed</option>
                  <option value="Archived">Archived</option>
                  <option value="Workshop Proposed">Workshop Proposed</option>
                  <option value="Documentation Planned">Documentation Planned</option>
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Language</label>
                <select 
                  value={selectedLanguage}
                  onChange={(e) => { setSelectedLanguage(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Languages">All Languages</option>
                  <option value="Kashmiri">Kashmiri</option>
                  <option value="Urdu">Urdu</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Multilingual">Multilingual</option>
                  <option value="English Summary Available">English Summary Available</option>
                  <option value="Full Translation Available">Full Translation Available</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Sort Order</label>
                <select 
                  value={selectedSort}
                  onChange={(e) => { setSelectedSort(e.target.value); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="Featured">Featured</option>
                  <option value="Recently Updated">Recently Updated</option>
                  <option value="Oldest Active">Oldest Active</option>
                  <option value="Newest Started">Newest Started</option>
                  <option value="Most Entries">Most Entries</option>
                  <option value="Production Stage">Production Stage</option>
                  <option value="Craft Tradition">Craft Tradition</option>
                  <option value="Workshop Name">Workshop Name</option>
                  <option value="District">District</option>
                  <option value="A–Z">A–Z</option>
                </select>
              </div>

            </div>
          </div>

          {/* Results Area */}
          <div className="w-full lg:w-3/4">

            {loading ? (
              <div className="py-20 text-center text-gray-500 font-serif">Loading workshop logs...</div>
            ) : (
              <>
                {/* 1. DIARY CARDS VIEW (DEFAULT MODE) */}
                {currentView === 'cards' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                    {paginatedDiaries.map((h, i) => (
                      <div 
                        key={i} 
                        className="bg-white border-2 border-[#3E2723]/35 py-8 px-6 hover:bg-[#3E2723]/5 transition-all duration-300 group flex flex-col justify-between shadow-sm relative grid-ledger"
                      >
                        {/* Grid Ledger top block */}
                        <div>
                          {/* Row 1: Accession ID & Number of entries */}
                          <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5 font-semibold">
                            <span>{h.accessionId}</span>
                            <span>{h.entriesCount} ENTRIES</span>
                          </div>

                          {/* Row 2: Diary Type & Craft Tradition */}
                          <div className="text-[9px] font-mono text-[#D4AF37] font-bold uppercase tracking-widest mb-4">
                            WORKSHOP DIARY &bull; {h.craft.toUpperCase()}
                          </div>

                          {/* Row 3: Main Title */}
                          <h3 
                            onClick={() => { setActiveDiary(h); setActiveModalTab('overview'); }}
                            className="text-xl md:text-2xl font-serif font-bold text-[#3E2723] leading-snug cursor-pointer group-hover:text-[#D4AF37] transition-colors"
                          >
                            {h.title}
                          </h3>

                          {/* Row 4: Archival Subtitle */}
                          {h.subtitle && (
                            <h4 className="text-xs font-serif italic text-gray-500 mt-1 leading-snug mb-4">
                              {h.subtitle}
                            </h4>
                          )}

                          {/* Row 5: Current Production Stage */}
                          <div className="mb-4 text-[10px] font-mono border-t border-b border-[#3E2723]/10 py-1.5 my-3">
                            <span className="text-gray-400 block uppercase font-bold text-[8px]">CURRENT STAGE</span>
                            <span className="font-bold text-[#3E2723]">{h.stage}</span>
                          </div>

                          {/* Row 6: Excerpt & Latest Entry Date */}
                          <div className="relative pl-4 mb-4 border-l-2 border-[#D4AF37]/50">
                            <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                              LATEST ENTRY &bull; {h.latestEntryDate.toUpperCase()}
                            </span>
                            <p className="italic text-gray-600 text-xs font-serif leading-relaxed">
                              “{h.latestEntryExcerpt}”
                            </p>
                          </div>
                        </div>

                        <div>
                          {/* Waveform visual line element */}
                          <div className="text-[#3E2723]/20 text-[9px] font-mono mb-4 select-none">
                            ─────╱╲──╱────╲╱─────
                          </div>

                          {/* Row 7: Locality & Documentation start date */}
                          <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-mono text-gray-400 uppercase tracking-wider mb-4 font-semibold">
                            <span>{h.district.toUpperCase()}</span>
                            <span>&middot;</span>
                            <span>{h.recordingDate.toUpperCase()}</span>
                          </div>

                          {/* Row 8: Action button & Status */}
                          <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto font-mono">
                            <span className="bg-[#3E2723]/5 border border-[#3E2723]/10 text-[#3E2723] text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider font-mono">
                              {h.status.toUpperCase()}
                            </span>
                            
                            <button 
                              onClick={() => { setActiveDiary(h); setActiveModalTab('overview'); }}
                              className="text-xs font-bold uppercase tracking-widest text-[#3E2723] hover:text-[#D4AF37] transition-colors font-mono"
                            >
                              Open Diary &rarr;
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

                {/* 2. CHRONOLOGICAL TIMELINE VIEW */}
                {currentView === 'list' && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="border-l-2 border-[#3E2723]/20 pl-6 space-y-8">
                      {timelineEntries.map((entry, idx) => (
                        <div key={idx} className="relative">
                          {/* Timeline dot */}
                          <div className="absolute -left-[31px] top-1.5 bg-[#3E2723] border-4 border-[#FAF9F6] w-4 h-4 rounded-full"></div>
                          
                          <div className="bg-white border border-[#3E2723]/10 p-6 rounded-xs shadow-xs max-w-3xl">
                            <div className="flex flex-wrap justify-between items-center text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-2 gap-2">
                              <span>{entry.date} &bull; {entry.accessionId}</span>
                              <span className="bg-[#D4AF37]/10 text-[#3E2723] font-bold px-2 py-0.5">{entry.stage.toUpperCase()}</span>
                            </div>
                            <h4 className="text-base font-serif font-bold text-[#3E2723]">{entry.title}</h4>
                            <p className="text-gray-500 text-xs italic mt-0.5">{entry.workshop}</p>
                            
                            <p className="text-gray-700 text-xs leading-relaxed mt-3 border-l-2 border-[#D4AF37] pl-3 italic font-serif bg-gray-55 py-2">
                              “{entry.note}”
                            </p>
                            
                            <div className="flex justify-between items-center text-[9px] font-mono text-gray-400 uppercase tracking-wider mt-4 pt-3 border-t border-gray-100">
                              <span>Logged by: {entry.author}</span>
                              <span className="font-bold text-[#3E2723]">{entry.status}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. FIELDWORK INDEX VIEW */}
                {currentView === 'index' && (
                  <div className="bg-white border border-[#3E2723]/10 overflow-x-auto shadow-sm animate-fadeIn">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#3E2723] text-[#D4AF37] font-mono uppercase tracking-wider text-[10px]">
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Archive No</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Workshop</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Craft</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">District</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Period</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Field Researcher</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center font-mono">Entries</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Current Stage</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center font-mono">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#3E2723]/10 font-sans text-gray-700">
                        {paginatedDiaries.map((h, i) => (
                          <tr key={i} className="hover:bg-[#FAF9F6] transition-colors cursor-pointer" onClick={() => { setActiveDiary(h); setActiveModalTab('overview'); }}>
                            <td className="p-4 font-mono font-bold text-gray-500 whitespace-nowrap">{h.accessionId}</td>
                            <td className="p-4">
                              <div className="font-serif font-bold text-[#3E2723] text-sm hover:text-[#D4AF37] transition-colors">{h.workshop}</div>
                              <div className="text-[10px] text-gray-400 font-light truncate max-w-xs">{h.subtitle}</div>
                            </td>
                            <td className="p-4 whitespace-nowrap">{h.craft}</td>
                            <td className="p-4 whitespace-nowrap">{h.district}</td>
                            <td className="p-4 whitespace-nowrap">{h.year}</td>
                            <td className="p-4 whitespace-nowrap">{h.director}</td>
                            <td className="p-4 text-center font-mono">{h.entriesCount}</td>
                            <td className="p-4 whitespace-nowrap font-medium text-gray-600">{h.stage}</td>
                            <td className="p-4 text-center whitespace-nowrap font-mono">
                              <span className="px-2 py-0.5 font-mono text-[9px] uppercase border border-[#3E2723]/20 bg-[#3E2723]/5 text-[#3E2723] font-bold">
                                {h.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12 pt-8 border-t border-gray-100 font-mono">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="w-10 h-10 border border-gray-300 flex items-center justify-center text-gray-550 hover:border-[#3E2723] hover:text-[#3E2723] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  &larr;
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 text-sm font-bold transition-colors ${
                        currentPage === i + 1 ? 'bg-[#D4AF37] text-white' : 'border border-gray-200 text-gray-555 hover:border-[#D4AF37]'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="w-10 h-10 border border-gray-305 flex items-center justify-center text-gray-555 hover:border-[#3E2723] hover:text-[#3E2723] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  &rarr;
                </button>
              </div>
            )}
          </div>

        </section>

        {/* How KHCRF Workshop Diaries Are Developed Section */}
        <section className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs mt-16" id="methodology">
          <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold">
            How KHCRF Workshop Diaries Are Developed
          </h2>
          <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans">
            Workshop Diaries are developed through repeated field engagement rather than one-time documentation. Each participating workshop is followed through an agreed documentation period, with attention to production activity, workshop relationships, materials, tools, decisions, delays, and changing conditions.
          </p>

          <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 font-mono">
            Documentation Stages
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-gray-700 font-mono">
            {[
              { id: "01", name: "Workshop identification", desc: "Selecting workshops representing critical traditions and heritage structures." },
              { id: "02", name: "Background research", desc: "Compiling baseline files on local craft history and lineage lines." },
              { id: "03", name: "Consent and access agreement", desc: "Securing formal permissions and ethical observation levels." },
              { id: "04", name: "Documentation scope definition", desc: "Setting timeline expectations and tracking focus fields." },
              { id: "05", name: "Baseline workshop profile", desc: "Establishing foundational equipment, worker, and capacity metrics." },
              { id: "06", name: "Production-cycle mapping", desc: "Outlining the 10 core stages of commission workflows." },
              { id: "07", name: "Recurring field visits", desc: "Conducting regular observer sessions inside the karkhana room." },
              { id: "08", name: "Diary-entry preparation", desc: "Writing monospaced field notes matching the observation variables." },
              { id: "09", name: "Artisan clarification", desc: "Reviewing transcript logs with master craftspersons." },
              { id: "10", name: "Craft and factual review", desc: "Verifying technical vocabulary and local names accuracy." },
              { id: "11", name: "Metadata enrichment", desc: "Structuring logs with accession IDs and keyword tag indexes." },
              { id: "12", name: "Archival publication", desc: "Releasing structured entries for cooperative library research." },
              { id: "13", name: "Diary completion review", desc: "Evaluating timeline closure or continuation cycles." }
            ].map((stage) => (
              <div key={stage.id} className="border-l-2 border-[#3E2723] pl-4 py-1 font-mono">
                <span className="font-mono text-[#D4AF37] font-bold block mb-1">STAGE {stage.id}</span>
                <span className="font-bold text-[#3E2723] block mb-1">{stage.name}</span>
                <span className="text-gray-500 font-sans">{stage.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Ethical Logging Principles Section */}
        <section className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs mt-12">
          <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold">
            Observing Without Disrupting the Workshop
          </h2>
          <p className="text-gray-655 text-sm leading-relaxed mb-8 max-w-4xl font-sans">
            KHCRF Workshop Diaries follow clear ethical and operational standards:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-xs text-gray-700 font-sans">
            {[
              "informed workshop consent",
              "minimal disruption to production",
              "no publication of confidential buyer information",
              "no disclosure of sensitive pricing without permission",
              "accurate distinction between observation and interpretation",
              "no staged production presented as routine practice",
              "no invented quotations",
              "consent for identifying artisans",
              "clear documentation of reconstructed events",
              "respect for household and workplace privacy",
              "secure handling of unpublished field notes",
              "correction procedures for factual errors",
              "transparent access restrictions where required"
            ].map((principle, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>{principle}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Research and Educational Use Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start mt-16 font-sans">
          <div className="lg:col-span-5 font-sans">
            <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold">
              Using the Workshop Diary Archive
            </h2>
            <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans text-gray-500">
              Workshop Diaries may support:
            </p>
            <div className="flex flex-col gap-3 font-mono">
              <button 
                onClick={() => {
                  setActiveDiary(allDiaries[0]);
                  setActiveModalTab('research');
                }}
                className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors text-center font-mono w-full md:w-auto"
              >
                Request Research Access
              </button>
              <a 
                href="#suggest"
                className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors text-center font-mono w-full md:w-auto block"
              >
                Propose a Workshop Diary
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#FAF9F6] border border-[#3E2723]/10 p-6 md:p-8 font-sans">
            <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 font-mono">
              Approved Research & Educational Uses
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4 text-xs text-gray-700 font-sans">
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>craft-process research</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>apprenticeship studies</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>labour documentation</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>production-system analysis</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>heritage management</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>museum interpretation</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>curriculum development</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>workshop training</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>conservation research</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>material studies</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>livelihood analysis</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>design education</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>policy development</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>supply-chain research</li>
            </ul>
          </div>
        </section>

        {/* Propose a Workshop Section */}
        <section className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs mt-12" id="suggest">
          <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold font-serif">
            Invite KHCRF to Document a Workshop
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-6 font-sans">
            Artisans, family workshops, cooperatives, training centres, manufacturers, revival initiatives, and cultural institutions may propose a workshop for sustained documentation.
          </p>
          
          <div className="max-w-2xl bg-[#FAF9F6] border border-[#3E2723]/20 p-6 font-mono text-xs space-y-4">
            <h4 className="font-bold text-[#3E2723] uppercase mb-3 text-[10px]">Required Proposal Fields:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-gray-500 font-mono text-[10px]">
              <div>• Workshop Name</div>
              <div>• Proposed Documentation Period</div>
              <div>• Workshop Type</div>
              <div>• Reason for Documentation</div>
              <div>• Master Artisan</div>
              <div>• Preferred Language</div>
              <div>• Village or Locality</div>
              <div>• Contact Information</div>
              <div>• District</div>
              <div>• Consent to Be Contacted</div>
              <div>• Number of Artisans</div>
              <div>• Available Supporting Material</div>
              <div>• Number of Apprentices</div>
              <div>• Current Production Activity</div>
            </div>
            
            <div className="pt-4 border-t border-[#3E2723]/10 mt-4">
              <span className="text-gray-400 block mb-2 font-sans">To submit a proposal, please email our observation desk:</span>
              <a href="mailto:diaries@khcrf.org" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-2.5 font-bold uppercase tracking-wider text-[10px] inline-block font-mono transition-colors">
                Propose a Workshop
              </a>
            </div>
          </div>
        </section>

        {/* Footer Statement Section */}
        <section className="border-t border-[#3E2723]/20 pt-10 text-center max-w-4xl mx-auto mt-16 font-sans">
          <blockquote className="text-gray-700 text-base md:text-lg leading-relaxed font-serif italic mb-4">
            "KHCRF Workshop Diaries preserve the living rhythm of craft production—documenting how artisans work, teach, decide, correct, adapt, and sustain their workshops over time."
          </blockquote>
          <p className="text-gray-400 text-xs font-mono uppercase tracking-widest font-bold">
            KHCRF Registry Access Console &bull; Workshop Diaries Registry Division
          </p>
          <p className="text-[#D4AF37] text-[10px] uppercase font-bold mt-2 tracking-widest font-mono">
            This page represents a daily workshop log registry under development. Access to verified logs and raw records is reserved for supportive members.
          </p>
        </section>

      </div>
    </main>
  );
}
