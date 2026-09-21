'use client';
import { getBaseUrlNoApi } from "@/lib/api";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { videoInterviewsHeroFallback } from '@/config/heroFallbacks';

export default function VideoInterviews() {
  const [allInterviews, setAllInterviews] = useState<any[]>([
    {
      slug: "why-craft-heritage-needs-better-documentation",
      title: "Why Craft Heritage Needs Better Documentation",
      subtitle: "Research, Archives, and Cultural Preservation",
      dur: "42 Minutes",
      durationMin: 42,
      durationVal: "30–60 min",
      tag: "Research & Documentation",
      img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop",
      desc: "Researchers, documentation specialists, and cultural practitioners discuss why systematic documentation is essential for preserving Kashmir's craft heritage. The discussion explores archival standards, metadata, digital preservation, policy gaps, and future opportunities for collaborative research.",
      accessionId: "KHCRF-VI-2026-001",
      year: "2026",
      language: "English",
      subtitles: "Yes",
      artisan: "Dr. Khurshid Bhat & Panel",
      preferredPublicName: "Dr. Khurshid Bhat",
      additionalParticipants: "Dr. Z. A. Shah, Prof. F. Ahmad",
      gender: "Male / Female Panel",
      birthYear: "1970",
      role: "Documentation Specialist / Director",
      designation: "Director of Archival Registry",
      yearsInCraft: "15 Years",
      workshop: "KHCRF Registry Division",
      director: "Farooq Mir",
      transcriptPreview: "Without a metadata catalog, an audio recording remains isolated noise.",
      craft: "Pashmina",
      theme: "Heritage Documentation",
      category: "Researcher",
      institution: "KHCRF",
      status: "Transcript Available",
      hasTranscript: "Yes",
      themes: ["Documentation", "Heritage", "Archives", "Metadata"],
      district: "Srinagar",
      recordingDate: "January 14, 2026",
      interviewer: "Farooq Mir",
      recorder: "Sajad Dar",
      translator: "None required",
      transcriptReviewer: "Dr. K. A. Mir",
      consentStatus: "Consented to archival summary release",
      recordingLocation: "KHCRF Archive Headquarters, Srinagar",
      publishedDuration: "42 Minutes",
      transcriptLanguage: "English",
      translationLanguage: "None",
      audioFormat: "Linear PCM WAV 24-bit 96kHz",
      audioQuality: "Broadcast Grade",
      environment: "Control room setting, silent background",
      rightsStatus: "Copyright KHCRF 2026. Academic use allowed.",
      accessConditions: "Dialogue accessible for verified research members.",
      timestampedSegment: "00:04:18 — Speaker:\nWithout a metadata catalog, an audio recording remains isolated noise. We must map the loom, the village, the weaver, and the lineage index code.",
      relatedResearch: "Kashmir Valley regional database mapping index #PASHMINA_DOC",
      relatedDocumentary: "Doc-KHCRF-2026-01",
      relatedOralHistory: "KHCRF-OH-2026-001",
      relatedCollection: "Signature Masterpieces",
      relatedCourses: "Preservation Level 1",
      relatedKnowledgeArticles: "Motifs & Symbolism"
    },
    {
      slug: "understanding-gi-beyond-certification",
      title: "Understanding GI Beyond Certification",
      subtitle: "Protecting Authenticity Through Geographical Indications",
      dur: "32 Minutes",
      durationMin: 32,
      durationVal: "30–60 min",
      tag: "GI & Policy",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop",
      desc: "An administrative expert explains the role of Geographical Indication tags in protection of Kashmir Pashmina, outlining the testing procedures and security labels.",
      accessionId: "KHCRF-VI-2026-002",
      year: "2026",
      language: "English",
      subtitles: "No",
      artisan: "Dr. Haseeb Mir",
      preferredPublicName: "Dr. Haseeb Mir",
      additionalParticipants: "None",
      gender: "Male",
      birthYear: "1975",
      role: "GI Protection Officer",
      designation: "Senior Registrar",
      yearsInCraft: "18 Years",
      workshop: "GI Registry Center, Srinagar",
      director: "Zehra Malik",
      transcriptPreview: "A Geographical Indication tag is not a design stamp; it represents geographical tracing.",
      craft: "Pashmina",
      theme: "GI Protection",
      category: "Policy Expert",
      institution: "Government",
      status: "Published",
      hasTranscript: "Yes",
      themes: ["GI", "Policy", "Authenticity"],
      district: "Srinagar",
      recordingDate: "January 20, 2026",
      interviewer: "Zehra Malik",
      recorder: "Aamir Bhat",
      translator: "None required",
      transcriptReviewer: "Dr. S. Farooq",
      consentStatus: "Consent signed for wage policy study",
      recordingLocation: "GI Laboratory, Srinagar",
      publishedDuration: "32 Minutes",
      transcriptLanguage: "English",
      translationLanguage: "None",
      audioFormat: "FLAC 16-bit 48kHz",
      audioQuality: "Broadcast Standard",
      environment: "Lab environment, soft machine hum",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Public summary view. Transcripts queryable.",
      timestampedSegment: "00:07:22 — Speaker:\nA Geographical Indication tag is not a design stamp; it represents geographical tracing. If the yarn is spun on power looms outside the designated zones, it ceases to hold GI status.",
      relatedResearch: "GI Protection Registry Framework #KASHMIR_PASHMINA_GI",
      relatedDocumentary: "Doc-KHCRF-2026-02",
      relatedOralHistory: "KHCRF-OH-2026-004",
      relatedCollection: "Rare Objects Collection",
      relatedCourses: "IP and Traditional Crafts",
      relatedKnowledgeArticles: "GI Testing Protocols"
    },
    {
      slug: "inside-craft-economy",
      title: "Inside Kashmir's Craft Economy",
      subtitle: "Markets, Livelihoods, and Future Opportunities",
      dur: "28 Minutes",
      durationMin: 28,
      durationVal: "15–30 min",
      tag: "Craft Economy",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop",
      desc: "An economic review of export policies, wages, and trade channels, exploring credit risk absorption, merchant networks, and direct-to-artisan payouts.",
      accessionId: "KHCRF-VI-2026-003",
      year: "2026",
      language: "Urdu",
      subtitles: "Yes",
      artisan: "Prof. Haseeb Drabu",
      preferredPublicName: "Prof. Haseeb Drabu",
      additionalParticipants: "Downtown Weavers Guild Spokesperson",
      gender: "Male",
      birthYear: "1962",
      role: "Senior Economist",
      designation: "Consultant of Heritage Economics",
      yearsInCraft: "30 Years",
      workshop: "Research Bureau, Srinagar",
      director: "KHCRF Editorial",
      transcriptPreview: "Credit absorption is what decides whether a weaving household survives the winter.",
      craft: "Carpet",
      theme: "Craft Economy",
      category: "Export Specialist",
      institution: "Research Institutes",
      status: "Editorial Review",
      hasTranscript: "Yes",
      themes: ["Economy", "Exports", "Livelihood"],
      district: "Srinagar",
      recordingDate: "February 04, 2026",
      interviewer: "KHCRF Editor",
      recorder: "Farooq Mir",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. S. Shah",
      consentStatus: "Public official disclosure cleared",
      recordingLocation: "Economic Research Institute, Srinagar",
      publishedDuration: "28 Minutes",
      transcriptLanguage: "Urdu",
      translationLanguage: "English",
      audioFormat: "FLAC 16-bit 48kHz",
      audioQuality: "Broadcast Standard",
      environment: "Quiet office, carpeted floor",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Open access summary.",
      timestampedSegment: "00:03:15 — Speaker:\nCredit absorption is what decides whether a weaving household survives the winter. Intermediary traders absorb cash-flow delays that would otherwise crush individual loom owners.",
      relatedResearch: "Economic Survey of Downtown श्रीनगर Weavers #WAGES_2026",
      relatedDocumentary: "Doc-KHCRF-2026-03",
      relatedOralHistory: "KHCRF-OH-2026-007",
      relatedCollection: "Hand-Knotted Carpet Archive",
      relatedCourses: "Craft Economics 101",
      relatedKnowledgeArticles: "Wage Structures & Patronage"
    },
    {
      slug: "conserving-traditional-techniques",
      title: "Conserving Traditional Techniques",
      subtitle: "Balancing Innovation with Authentic Practice",
      dur: "35 Minutes",
      durationMin: 35,
      durationVal: "30–60 min",
      tag: "Conservation",
      img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop",
      desc: "A step-by-step review of wood-joining methods and ancient embroidery stitches that are vanishing from modern commercial production, focusing on preservation balance.",
      accessionId: "KHCRF-VI-2026-004",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Bashir Ahmad Dar",
      preferredPublicName: "Bashir Ahmad Dar",
      additionalParticipants: "None",
      gender: "Male",
      birthYear: "1960",
      role: "Senior Carver",
      designation: "Master Artisan Liaison",
      yearsInCraft: "42 Years",
      workshop: "Downtown Srinagar Wood Guild",
      director: "Farooq Mir",
      transcriptPreview: "Innovation is essential, but it must not erase the original mechanical discipline of the hand.",
      craft: "Walnut Wood",
      theme: "Traditional Knowledge",
      category: "Conservator",
      institution: "KHCRF",
      status: "Peer Reviewed",
      hasTranscript: "Yes",
      themes: ["Conservation", "Traditional Skills", "Innovation"],
      district: "Srinagar",
      recordingDate: "February 18, 2026",
      interviewer: "Farooq Mir",
      recorder: "Sajad Dar",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. G. Bhat",
      consentStatus: "Consent signed for database register mapping",
      recordingLocation: "Woodcarvers Guild, Srinagar",
      publishedDuration: "35 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "WAV 24-bit 48kHz",
      audioQuality: "Studio Grade",
      environment: "Active workshop background",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Academic research access only. Transcription register public.",
      timestampedSegment: "00:10:44 — Speaker:\nInnovation is essential, but it must not erase the original mechanical discipline of the hand. If we abandon the nail-free double lock joint, the wood loses its breathing room.",
      relatedResearch: "Joinery and Structural Integrity in Kashmiri Walnut Carving",
      relatedDocumentary: "Doc-KHCRF-2026-04",
      relatedOralHistory: "KHCRF-OH-2026-002",
      relatedCollection: "Architectural Wood Archive",
      relatedCourses: "Wood Joint Conservation",
      relatedKnowledgeArticles: "Nail-free Double Locking Systems"
    },
    {
      slug: "women-transforming-landscape",
      title: "Women Transforming Kashmir's Craft Landscape",
      subtitle: "Leadership, Home-Based Work, and Entrepreneurship",
      dur: "24 Minutes",
      durationMin: 24,
      durationVal: "15–30 min",
      tag: "Women Artisans",
      img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&auto=format&fit=crop",
      desc: "Interviews with women building cooperatives to sell craft products directly, focusing on home-based labour value and financial empowerment.",
      accessionId: "KHCRF-VI-2026-005",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Yasmeen Ara & Co-op",
      preferredPublicName: "Yasmeen Ara",
      additionalParticipants: "Co-op Spinners Group",
      gender: "Female",
      birthYear: "1972",
      role: "Co-op Lead Spinner",
      designation: "President of Spinners Collective",
      yearsInCraft: "30 Years",
      workshop: "Sozni Spinners Guild, Srinagar",
      director: "Zehra Malik",
      transcriptPreview: "Home-based labour is the true foundation of our craft volume, but it goes uncatalogued.",
      craft: "Sozni",
      theme: "Women Artisans",
      category: "Entrepreneur",
      institution: "Cooperatives",
      status: "Published",
      hasTranscript: "Yes",
      themes: ["Women", "Entrepreneurship", "Community"],
      district: "Srinagar",
      recordingDate: "March 02, 2026",
      interviewer: "Zehra Malik",
      recorder: "Aamir Bhat",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. M. Amin",
      consentStatus: "Institutional consent cleared",
      recordingLocation: "Cooperative Workroom, Srinagar",
      publishedDuration: "24 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "FLAC 16-bit 48kHz",
      audioQuality: "Broadcast Standard",
      environment: "Chatter of spinning wheels",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Dialogue concept study. Full release forthcoming.",
      timestampedSegment: "00:08:14 — Speaker:\nHome-based labour is the true foundation of our craft volume, but it goes uncatalogued. If the woman at the spinning wheel is ignored, the weaver at the loom has no thread.",
      relatedResearch: "Unrecorded Domestic Spinning Output in Kashmir Valley",
      relatedDocumentary: "Doc-KHCRF-2026-05",
      relatedOralHistory: "KHCRF-OH-2026-009",
      relatedCollection: "Women's Craft Guild Collection",
      relatedCourses: "Feminist Economics and Crafts",
      relatedKnowledgeArticles: "Invisible Spinning Labour"
    },
    {
      slug: "museum-perspectives-material-heritage",
      title: "Museum Perspectives on Kashmir Crafts",
      subtitle: "Collecting, Preserving, and Interpreting Material Heritage",
      dur: "19 Minutes",
      durationMin: 19,
      durationVal: "15–30 min",
      tag: "Museums",
      img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop",
      desc: "How global museums catalog and value historic Kashmiri shawls and wood paneling, highlighting catalog sheets and curator registers.",
      accessionId: "KHCRF-VI-2026-006",
      year: "2026",
      language: "English",
      subtitles: "No",
      artisan: "Rachel Cohen",
      preferredPublicName: "Rachel Cohen",
      additionalParticipants: "None",
      gender: "Female",
      birthYear: "1968",
      role: "Textile Historian",
      designation: "Senior Textile Curator",
      yearsInCraft: "28 Years",
      workshop: "Metropolitan Museum Archives",
      director: "Sajad Dar",
      transcriptPreview: "Every museum piece has an active story about how the fiber was selected, not just who wore it.",
      craft: "Kani",
      theme: "Museum Collections",
      category: "Museum Professional",
      institution: "Museums",
      status: "Archive Preview",
      hasTranscript: "Yes",
      themes: ["Museums", "Collections", "Interpretation"],
      district: "Srinagar",
      recordingDate: "March 18, 2026",
      interviewer: "Sajad Dar",
      recorder: "Farooq Mir",
      translator: "None required",
      transcriptReviewer: "Dr. N. Jan",
      consentStatus: "Ethical consent signed by co-op committee",
      recordingLocation: "Kashmir Heritage Center, Srinagar",
      publishedDuration: "19 Minutes",
      transcriptLanguage: "English",
      translationLanguage: "None",
      audioFormat: "WAV 24-bit 96kHz",
      audioQuality: "Broadcast Grade",
      environment: "Silent gallery backdrop",
      rightsStatus: "Copyright KHCRF 2026. Cooperative shared rights.",
      accessConditions: "Public summary view.",
      timestampedSegment: "00:05:12 — Speaker:\nEvery museum piece has an active story about how the fiber was selected, not just who wore it. The catalog must record the diameter grades of historic wools to understand changes in livestock ecology.",
      relatedResearch: "Sourcing Wools: Historical Fiber Diameter Classifications",
      relatedDocumentary: "Doc-KHCRF-2026-06",
      relatedOralHistory: "KHCRF-OH-2026-003",
      relatedCollection: "Museum Archive Collection",
      relatedCourses: "Textile Curation & Archiving",
      relatedKnowledgeArticles: "Historic Kani Weaves"
    },
    {
      slug: "apprenticeship-twenty-first-century",
      title: "Apprenticeship in the Twenty-First Century",
      subtitle: "Can the Ustad–Shagird Tradition Survive?",
      dur: "45 Minutes",
      durationMin: 45,
      durationVal: "30–60 min",
      tag: "Education",
      img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&auto=format&fit=crop",
      desc: "A discussion on updating the apprentice framework, introducing stipend models, and validating craft skills as academic equivalents under the Ustad-Shagird system.",
      accessionId: "KHCRF-VI-2026-007",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Ustad Fayaz Ahmad",
      preferredPublicName: "Ustad Fayaz Ahmad",
      additionalParticipants: "Guild Apprentice Panel",
      gender: "Male",
      birthYear: "1958",
      role: "Carving Master",
      designation: "President of Woodcarvers Guild",
      yearsInCraft: "50 Years",
      workshop: "Budgam Carver Guild",
      director: "KHCRF Editorial",
      transcriptPreview: "If we do not make the workshop a place of dignity, the ustad-shagird lineage ends here.",
      craft: "Walnut Wood",
      theme: "Skill Transmission",
      category: "Master Artisan",
      institution: "KHCRF",
      status: "Scheduled",
      hasTranscript: "Yes",
      themes: ["Apprenticeship", "Education", "Youth"],
      district: "Budgam",
      recordingDate: "April 10, 2026",
      interviewer: "KHCRF Editor",
      recorder: "Aamir Bhat",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. S. A. Shah",
      consentStatus: "Consent signed for ecological index inclusion",
      recordingLocation: "Craft School, Budgam",
      publishedDuration: "45 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "FLAC 16-bit 48kHz",
      audioQuality: "Broadcast Standard",
      environment: "Workshop classroom environment",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Restricted editorial review status. Summary public.",
      timestampedSegment: "00:03:45 — Speaker:\nIf we do not make the workshop a place of dignity, the ustad-shagird lineage ends here. Stipends must replace direct charity so apprentices can support their households.",
      relatedResearch: "Stipend Models and Retention rates in Downtown Karkhanas",
      relatedDocumentary: "Doc-KHCRF-2026-07",
      relatedOralHistory: "KHCRF-OH-2026-005",
      relatedCollection: "Guild Apprenticeship Logs",
      relatedCourses: "Preservation and Lineages",
      relatedKnowledgeArticles: "Ustad-Shagird Legacies"
    },
    {
      slug: "digital-technologies-heritage",
      title: "Digital Technologies and Heritage Documentation",
      subtitle: "Using GIS, AI, Archives, and Digital Twins",
      dur: "38 Minutes",
      durationMin: 38,
      durationVal: "30–60 min",
      tag: "Technology",
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&auto=format&fit=crop",
      desc: "Researchers discuss the integration of geographic information systems, machine learning, and physical digital modeling in capturing the geometry and geography of historic craft layouts.",
      accessionId: "KHCRF-VI-2026-008",
      year: "2026",
      language: "English",
      subtitles: "No",
      artisan: "Dr. Irfan Mir",
      preferredPublicName: "Dr. Irfan Mir",
      additionalParticipants: "None",
      gender: "Male",
      birthYear: "1980",
      role: "Digital Preservationist",
      designation: "Assistant Professor of Heritage Technology",
      yearsInCraft: "12 Years",
      workshop: "Digital Heritage Labs, Srinagar",
      director: "Zehra Malik",
      transcriptPreview: "Digital twins let us document the tension shifts of a loom across time.",
      craft: "Kani",
      theme: "Digital Documentation",
      category: "Researcher",
      institution: "Universities",
      status: "Published",
      hasTranscript: "Yes",
      themes: ["AI", "GIS", "Digital Heritage"],
      recordingDate: "April 22, 2026",
      interviewer: "Zehra Malik",
      recorder: "Sajad Dar",
      translator: "None required",
      transcriptReviewer: "Dr. H. Mir",
      consentStatus: "Consented to educational registry presentation",
      recordingLocation: "University Center, Srinagar",
      publishedDuration: "38 Minutes",
      transcriptLanguage: "English",
      translationLanguage: "None",
      audioFormat: "WAV 24-bit 48kHz",
      audioQuality: "Studio Grade",
      environment: "Lab environment",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Open educational register access.",
      timestampedSegment: "00:09:12 — Speaker:\nDigital twins let us document the tension shifts of a loom across time. This makes it possible to preserve design mathematical logic forever.",
      relatedResearch: "Volumetric Mapping of Heritage Looms using Photogrammetry",
      relatedDocumentary: "Doc-KHCRF-2026-08",
      relatedOralHistory: "KHCRF-OH-2026-010",
      relatedCollection: "Digital Twin Files Archive",
      relatedCourses: "Digital Heritage Mapping",
      relatedKnowledgeArticles: "AI in Pattern Preservation"
    },
    {
      slug: "future-craft-education-universities",
      title: "The Future of Craft Education",
      subtitle: "Building Skills for the Next Generation",
      dur: "22 Minutes",
      durationMin: 22,
      durationVal: "15–30 min",
      tag: "Education",
      img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&auto=format&fit=crop",
      desc: "Proposing formal school and university curriculums that include design, weaving, and woodcraft masters as full faculty members.",
      accessionId: "KHCRF-VI-2026-009",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Nighat Shafi",
      preferredPublicName: "Nighat Shafi",
      additionalParticipants: "School Board Liaisons",
      gender: "Female",
      birthYear: "1960",
      role: "Academic Reformist",
      designation: "Chairperson of Craft Pedagogy",
      yearsInCraft: "25 Years",
      workshop: "Education Cooperative, Srinagar",
      director: "Farooq Mir",
      transcriptPreview: "We need master weavers on university design faculties, not just guest visits.",
      craft: "Pashmina",
      theme: "Education",
      category: "Academic",
      institution: "Universities",
      status: "Transcript Available",
      hasTranscript: "Yes",
      themes: ["Education", "Curriculum", "Universities"],
      recordingDate: "May 12, 2026",
      interviewer: "Farooq Mir",
      recorder: "Sajad Dar",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. S. Shah",
      consentStatus: "Consent signed for market study publication",
      recordingLocation: "University Senate Hall, Srinagar",
      publishedDuration: "22 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "FLAC 16-bit 48kHz",
      audioQuality: "Broadcast Standard",
      environment: "Quiet classroom",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Academic research viewable under request.",
      timestampedSegment: "00:04:18 — Speaker:\nWe need master weavers on university design faculties, not just guest visits. Academic accreditation must recognize 40 years of workshop practice as a terminal degree equivalent.",
      relatedResearch: "Pedagogical Alignments in Craft Guild Systems",
      relatedDocumentary: "Doc-KHCRF-2026-09",
      relatedOralHistory: "KHCRF-OH-2026-005",
      relatedCollection: "Curriculum Registry",
      relatedCourses: "Heritage Craft Education",
      relatedKnowledgeArticles: "Master Artisan Pedagogy"
    },
    {
      slug: "craft-tourism-authenticity",
      title: "Craft Tourism Without Losing Authenticity",
      subtitle: "Balancing Visitor Experience and Cultural Integrity",
      dur: "30 Minutes",
      durationMin: 30,
      durationVal: "15–30 min",
      tag: "Tourism",
      img: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=600&auto=format&fit=crop",
      desc: "Balancing tourism growth with workshop privacy and respect for the natural pacing of manual craft production.",
      accessionId: "KHCRF-VI-2026-010",
      year: "2026",
      language: "English",
      subtitles: "No",
      artisan: "Mohammad Yasir",
      preferredPublicName: "Mohammad Yasir",
      additionalParticipants: "Guild Representatives",
      gender: "Male",
      birthYear: "1983",
      role: "Heritage Tour Director",
      designation: "Tourism Advisory Panelist",
      yearsInCraft: "14 Years",
      workshop: "Srinagar Heritage Bureau",
      director: "Bilal Jan",
      transcriptPreview: "Tourism must adapt to the workshop, not require the artisan to perform for cameras.",
      craft: "Copperware",
      theme: "Tourism",
      category: "Entrepreneur",
      institution: "NGOs",
      status: "Peer Reviewed",
      hasTranscript: "Yes",
      themes: ["Tourism", "Sustainability", "Community"],
      recordingDate: "June 04, 2026",
      interviewer: "Bilal Jan",
      recorder: "Farooq Mir",
      translator: "None required",
      transcriptReviewer: "Dr. K. A. Mir",
      consentStatus: "Consent signed by craft school guild",
      recordingLocation: "Heritage Alliance Office, Srinagar",
      publishedDuration: "30 Minutes",
      transcriptLanguage: "English",
      translationLanguage: "None",
      audioFormat: "WAV 24-bit 48kHz",
      audioQuality: "Studio Grade",
      environment: "Quiet courtyard, Srinagar",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Dialogue concept study summary.",
      timestampedSegment: "00:03:12 — Speaker:\nTourism must adapt to the workshop, not require the artisan to perform for cameras. If we commodify the gesture, we compromise the craft's interior focus.",
      relatedResearch: "Impact of Tourist Disruptions in Active Srinagar Karkhanas",
      relatedDocumentary: "Doc-KHCRF-2026-10",
      relatedOralHistory: "KHCRF-OH-2026-008",
      relatedCollection: "Srinagar Guild Historical Logs",
      relatedCourses: "Sustainable Tourism Practices",
      relatedKnowledgeArticles: "Visitor Etiquette in Karkhanas"
    },
    {
      slug: "designing-contemporary-markets",
      title: "Designing for Contemporary Markets",
      subtitle: "Respecting Tradition While Meeting Modern Demand",
      dur: "27 Minutes",
      durationMin: 27,
      durationVal: "15–30 min",
      tag: "Design",
      img: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&auto=format&fit=crop",
      desc: "Exploring how modern color systems and geometric updates can be introduced without diluting structural rules of Kani or Sozni patterns.",
      accessionId: "KHCRF-VI-2026-011",
      year: "2026",
      language: "Urdu",
      subtitles: "Yes",
      artisan: "Sajid Ahmad",
      preferredPublicName: "Sajid Ahmad",
      additionalParticipants: "None",
      gender: "Male",
      birthYear: "2002",
      role: "Contemporary Pattern Designer",
      designation: "Lead Pattern Illustrator",
      yearsInCraft: "4 Years",
      workshop: "Downtown Srinagar Studio",
      director: "KHCRF Editorial",
      transcriptPreview: "Modern colors can bring new life, but the structural integrity of the weave must remain.",
      craft: "Sozni",
      theme: "Design",
      category: "Designer",
      institution: "Research Institutes",
      status: "Editorial Review",
      hasTranscript: "Yes",
      themes: ["Design", "Markets", "Innovation"],
      recordingDate: "July 12, 2026",
      interviewer: "KHCRF Editor",
      recorder: "Sajad Dar",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. S. A. Shah",
      consentStatus: "Consent signed for technical preservation archive",
      recordingLocation: "Registry Design Lab, Srinagar",
      publishedDuration: "27 Minutes",
      transcriptLanguage: "Urdu",
      translationLanguage: "English",
      audioFormat: "WAV 24-bit 96kHz",
      audioQuality: "Broadcast Grade",
      environment: "Quiet workspace",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Published record viewable by authorized members.",
      timestampedSegment: "00:08:44 — Speaker:\nModern colors can bring new life, but the structural integrity of the weave must remain. If the geometry is compromised, the layout fails its structural balance.",
      relatedResearch: "Pattern Evolution in Srinagar Design Houses #DESIGN_2026",
      relatedDocumentary: "Doc-KHCRF-2026-11",
      relatedOralHistory: "KHCRF-OH-2026-004",
      relatedCollection: "Contemporary Design Catalog",
      relatedCourses: "Pattern Drafting Legacy",
      relatedKnowledgeArticles: "Motifs & Symbolism"
    },
    {
      slug: "voices-from-the-workshop",
      title: "Voices from the Workshop",
      subtitle: "Roundtable with Master Artisans",
      dur: "50 Minutes",
      durationMin: 50,
      durationVal: "30–60 min",
      tag: "Roundtable",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop",
      desc: "A group panel of Srinagar's Downtown weavers and carvers discussing karkhana economics, supplier trust, and raw material grading.",
      accessionId: "KHCRF-VI-2026-012",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Weaver Council Master",
      preferredPublicName: "Weaving Council Masters",
      additionalParticipants: "Downtown Srinagar Woodcarvers representatives",
      gender: "Male / Female Panel",
      birthYear: "1945–1970",
      role: "Weaving Guild Council",
      designation: "Guild Committee Spokesperson",
      yearsInCraft: "Combined 200+ Years",
      workshop: "Downtown Srinagar Weaving Guild",
      director: "Zehra Malik",
      transcriptPreview: "A master knows the wood by its smell before the tool touches it.",
      craft: "Walnut Wood",
      theme: "Workshop Culture",
      category: "Master Artisan",
      institution: "Cooperatives",
      status: "Transcript Available",
      hasTranscript: "Yes",
      themes: ["Workshop Culture", "Skills", "Heritage"],
      district: "Srinagar",
      recordingDate: "August 04, 2026",
      interviewer: "Zehra Malik",
      recorder: "Sajad Dar",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. H. Mir",
      consentStatus: "Merchant guild clearance signed",
      recordingLocation: "Downtown Srinagar Guild room",
      publishedDuration: "50 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "WAV 24-bit 96kHz",
      audioQuality: "Broadcast Grade",
      environment: "Active loom room backdrop",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Restricted to support members. Register record public.",
      timestampedSegment: "00:11:18 — Speaker:\nA master knows the wood by its smell before the tool touches it. If the wood is too wet, the steel carving tools will drag instead of cutting clean lines.",
      relatedResearch: "Tactile Sensation and Sizing in raw Walnut Selection",
      relatedDocumentary: "Doc-KHCRF-2026-12",
      relatedOralHistory: "KHCRF-OH-2026-012",
      relatedCollection: "Lineages & Workshop Diaries",
      relatedCourses: "Tactile Material Grading",
      relatedKnowledgeArticles: "Downtown Bazaars Heritage"
    }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
const API_BASE_URL = getBaseUrlNoApi();
    fetch(`${API_BASE_URL}/api/v1/knowledge?entityType=KNOWLEDGE_OBJECT&take=100`).catch(() => ({ ok: false, json: () => Promise.resolve([]) }))
      .then(res => { if (!res.ok) return []; return res.json(); })
      .then(data => {
        const items = (Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : [])).filter((d: any) => d.metadata?.kind === 'STUDIO_MEDIA' && d.metadata?.type === 'Video Interview').map((d: any) => ({
          title: d.title,
          subtitle: d.metadata.subtitle || d.title,
          dur: d.metadata.dur || '20 Minutes',
          durationMin: d.metadata.durationMin || 20,
          durationVal: d.metadata.durationVal || '15–30 min',
          tag: d.metadata.tag || 'Featured Video Interview',
          img: d.metadata.img || '/assets/images/studio/video/video_1.jpg',
          desc: d.summary || d.metadata.desc,
          slug: d.slug,
          accessionId: d.metadata.accessionId || `KHCRF-VI-2026-${d.slug.toUpperCase()}`,
          year: d.metadata.year || '2026',
          language: d.metadata.language || 'English',
          subtitles: d.metadata.subtitles || 'Yes',
          artisan: d.metadata.artisan || 'Master Artisan',
          preferredPublicName: d.metadata.preferredPublicName || d.metadata.artisan || 'Master Artisan',
          additionalParticipants: d.metadata.additionalParticipants || 'None',
          gender: d.metadata.gender || 'Unknown',
          birthYear: d.metadata.birthYear || 'Varies',
          role: d.metadata.role || 'Artisan',
          designation: d.metadata.designation || 'Specialist',
          yearsInCraft: d.metadata.yearsInCraft || 'Varies',
          workshop: d.metadata.workshop || 'Karkhana',
          district: d.metadata.district || 'Srinagar',
          director: d.metadata.director || 'KHCRF',
          transcriptPreview: d.metadata.transcriptPreview || 'Archived transcript snippet is loaded under support request.',
          craft: d.metadata.craft || 'Pashmina',
          theme: d.metadata.theme || 'Heritage Documentation',
          category: d.metadata.category || 'Master Artisan',
          institution: d.metadata.institution || 'KHCRF',
          status: d.metadata.status || 'Published',
          hasTranscript: d.metadata.hasTranscript || 'No',
          themes: d.metadata.themes || ["Kashmir", "Video Dialogue"],
          recordingDate: d.metadata.recordingDate || '2026',
          interviewer: d.metadata.interviewer || 'KHCRF Field Staff',
          recorder: d.metadata.recorder || 'KHCRF Archive Team',
          translator: d.metadata.translator || 'KHCRF Linguistics Dept',
          transcriptReviewer: d.metadata.transcriptReviewer || 'Archival Board',
          consentStatus: d.metadata.consentStatus || 'Informed consent secured',
          recordingLocation: d.metadata.recordingLocation || 'Srinagar Cluster',
          publishedDuration: d.metadata.publishedDuration || d.metadata.dur || '20 Minutes',
          transcriptLanguage: d.metadata.transcriptLanguage || 'English',
          translationLanguage: d.metadata.translationLanguage || 'None',
          audioFormat: d.metadata.audioFormat || 'Linear PCM WAV',
          audioQuality: d.metadata.audioQuality || 'Broadcast Quality',
          environment: d.metadata.environment || 'Indoor karkhana studio setting',
          rightsStatus: d.metadata.rightsStatus || 'Copyright KHCRF 2026.',
          accessConditions: d.metadata.accessConditions || 'Restricted to support members.',
          timestampedSegment: d.metadata.timestampedSegment || '00:00:00 — Recording initialized.',
          relatedResearch: d.metadata.relatedResearch || 'Kashmir Valley regional database mapping index',
          relatedDocumentary: d.metadata.relatedDocumentary || 'Doc-KHCRF-2026-01',
          relatedOralHistory: d.metadata.relatedOralHistory || 'KHCRF-OH-2026-03',
          relatedCollection: d.metadata.relatedCollection || 'Signature Masterpieces',
          relatedCourses: d.metadata.relatedCourses || 'Preservation Level 1',
          relatedKnowledgeArticles: d.metadata.relatedKnowledgeArticles || 'Motifs & Symbolism'
        }));
        if (items.length > 0) {
          setAllInterviews(items);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // View state switcher
  const [currentView, setCurrentView] = useState<'cards' | 'list' | 'index'>('cards');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCraft, setSelectedCraft] = useState('All Crafts');
  const [selectedTheme, setSelectedTheme] = useState('All Themes');
  const [selectedInstitution, setSelectedInstitution] = useState('All Institutions');
  const [selectedDuration, setSelectedDuration] = useState('All Durations');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [selectedSort, setSelectedSort] = useState('Featured');
  const [selectedSpeakerType, setSelectedSpeakerType] = useState('All Speakers');

  const [currentPage, setCurrentPage] = useState(1);
  const [activeInterview, setActiveInterview] = useState<any>(null);
  const itemsPerPage = 6;

  // Filter logic
  const filteredInterviews = allInterviews.filter(h => {
    // 1. Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchText = `${h.title} ${h.subtitle || ''} ${h.desc} ${h.artisan} ${h.accessionId} ${h.director} ${h.craft} ${h.theme} ${h.district} ${h.transcriptPreview || ''} ${h.institution || ''}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    // 2. Craft
    if (selectedCraft !== 'All Crafts') {
      if (h.craft !== selectedCraft) return false;
    }
    // 3. Theme
    if (selectedTheme !== 'All Themes') {
      if (h.theme !== selectedTheme) return false;
    }
    // 4. Institution
    if (selectedInstitution !== 'All Institutions') {
      if (h.institution !== selectedInstitution) return false;
    }
    // 5. Speaker Type
    if (selectedSpeakerType !== 'All Speakers') {
      if (h.category !== selectedSpeakerType) return false;
    }
    // 6. Duration
    if (selectedDuration !== 'All Durations') {
      const min = h.durationMin;
      if (selectedDuration === 'Under 15 min' && min >= 15) return false;
      if (selectedDuration === '15–30 min' && (min < 15 || min > 30)) return false;
      if (selectedDuration === '30–60 min' && (min < 30 || min > 60)) return false;
      if (selectedDuration === 'Over 60 min' && min <= 60) return false;
    }
    // 7. Recording Status
    if (selectedStatus !== 'All Statuses') {
      if (h.status !== selectedStatus) return false;
    }
    // 8. Language
    if (selectedLanguage !== 'All Languages') {
      if (!h.language.toLowerCase().includes(selectedLanguage.toLowerCase())) return false;
    }
    return true;
  });

  // Sort logic
  const sortedInterviews = [...filteredInterviews].sort((a, b) => {
    if (selectedSort === 'Newest') {
      return parseInt(b.year) - parseInt(a.year);
    }
    if (selectedSort === 'Oldest') {
      return parseInt(a.year) - parseInt(b.year);
    }
    if (selectedSort === 'Duration') {
      return b.durationMin - a.durationMin;
    }
    if (selectedSort === 'A–Z') {
      return a.title.localeCompare(b.title);
    }
    if (selectedSort === 'Institution') {
      return a.institution.localeCompare(b.institution);
    }
    if (selectedSort === 'Speaker') {
      return a.artisan.localeCompare(b.artisan);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedInterviews.length / itemsPerPage);
  const paginatedInterviews = sortedInterviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCuratedQuery = (queryText: string) => {
    setSearchQuery(queryText);
    setCurrentPage(1);
    const element = document.getElementById('results');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveInterview(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pb-24 animate-fadeIn">
      {/* Detailed Modal Registry Sheet */}
      {activeInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#3E2723]/40 backdrop-blur-sm" onClick={() => setActiveInterview(null)}></div>
          <div className="relative z-10 bg-[#3E2723] border border-[#D4AF37]/50 max-w-2xl w-full p-8 md:p-10 shadow-2xl text-white max-h-[90vh] overflow-y-auto custom-scrollbar" role="dialog" aria-modal="true">
            <button onClick={() => setActiveInterview(null)} className="absolute top-4 right-4 text-white/50 hover:text-white text-lg font-mono">&times;</button>
            
            <div className="text-center mb-8">
              <span className="text-[#D4AF37] font-mono text-xs uppercase tracking-widest block mb-2">KHCRF KNOWLEDGE DIALOGUE ARCHIVE REGISTER</span>
              <h2 className="text-2xl md:text-3xl font-serif text-white font-bold leading-tight">{activeInterview.title}</h2>
              {activeInterview.subtitle && <p className="text-white/60 text-xs italic font-serif mt-1">{activeInterview.subtitle}</p>}
              <div className="text-[10px] text-[#D4AF37] font-mono mt-3 uppercase tracking-wider bg-white/5 inline-block px-3 py-1 border border-[#D4AF37]/20 font-mono">
                Archive record: {activeInterview.accessionId}
              </div>
            </div>

            <p className="text-[#FAF9F6]/90 text-xs leading-relaxed mb-6 font-sans border-b border-white/10 pb-6">
              {activeInterview.desc}
            </p>

            {/* Structured Columns: Speaker Info and Recording Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px] font-mono mb-6">
              {/* Speaker Information */}
              <div className="space-y-2 border-r border-white/10 pr-4">
                <h3 className="text-[#D4AF37] font-bold text-xs uppercase border-b border-white/10 pb-1 mb-2">Speaker Information</h3>
                <div><span className="text-white/40">PRIMARY SPEAKER :</span> {activeInterview.artisan}</div>
                <div><span className="text-white/40">ADDITIONAL PART :</span> {activeInterview.additionalParticipants}</div>
                <div><span className="text-white/40">GENDER / BIRTH  :</span> {activeInterview.gender} (b. {activeInterview.birthYear})</div>
                <div><span className="text-white/40">DESIGNATION     :</span> {activeInterview.designation}</div>
                <div><span className="text-white/40">PRIMARY ROLE    :</span> {activeInterview.role}</div>
                <div><span className="text-white/40">INSTITUTION     :</span> {activeInterview.institution}</div>
                <div><span className="text-white/40">CRAFT SECTOR    :</span> {activeInterview.craft}</div>
                <div><span className="text-white/40">YEARS IN FIELD  :</span> {activeInterview.yearsInCraft}</div>
                <div><span className="text-white/40">LOCALITY/DIST   :</span> {activeInterview.district}</div>
                <div><span className="text-white/40">CONSENT STATUS  :</span> {activeInterview.consentStatus}</div>
              </div>

              {/* Recording Metadata */}
              <div className="space-y-2">
                <h3 className="text-[#D4AF37] font-bold text-xs uppercase border-b border-white/10 pb-1 mb-2">Recording Metadata</h3>
                <div><span className="text-white/40">RECORDED DATE  :</span> {activeInterview.recordingDate}</div>
                <div><span className="text-white/40">INTERVIEWER    :</span> {activeInterview.interviewer}</div>
                <div><span className="text-white/40">TECHNICAL REC  :</span> {activeInterview.recorder}</div>
                <div><span className="text-white/40">TRANSLATOR     :</span> {activeInterview.translator}</div>
                <div><span className="text-white/40">REVIEWER CODE  :</span> {activeInterview.transcriptReviewer}</div>
                <div><span className="text-white/40">AUDIO FORMAT   :</span> {activeInterview.audioFormat}</div>
                <div><span className="text-white/40">ROOM ACOUSTICS :</span> {activeInterview.environment}</div>
                <div><span className="text-white/40">ACCESS RIGHTS  :</span> {activeInterview.rightsStatus}</div>
              </div>
            </div>

            {/* Transcript Experience Snippet */}
            {activeInterview.timestampedSegment && (
              <div className="mb-6 bg-white/5 border border-white/10 p-4 font-mono text-[10px] leading-relaxed rounded-xs">
                <h4 className="text-[#D4AF37] font-bold uppercase tracking-wider mb-2 border-b border-white/10 pb-1 text-[9px] font-mono">Archival Transcript Excerpt</h4>
                <div className="whitespace-pre-line text-white/90">
                  {activeInterview.timestampedSegment}
                </div>
              </div>
            )}

            {/* Related Research Registry Links */}
            <div className="bg-white/5 border border-white/15 p-4 mb-6 font-mono text-[9px] leading-relaxed rounded-xs space-y-1.5">
              <h4 className="text-[#D4AF37] font-bold uppercase tracking-wider border-b border-white/10 pb-1 text-[9px] mb-2 font-mono">Related Archive Registry Links</h4>
              <div><span className="text-white/40">RELATED RESEARCH     :</span> {activeInterview.relatedResearch}</div>
              <div><span className="text-white/40">RELATED DOCUMENTARY  :</span> {activeInterview.relatedDocumentary}</div>
              <div><span className="text-white/40">RELATED ORAL HISTORY :</span> {activeInterview.relatedOralHistory}</div>
              <div><span className="text-white/40">RELATED COLLECTION   :</span> {activeInterview.relatedCollection}</div>
              <div><span className="text-white/40">RELATED COURSES      :</span> {activeInterview.relatedCourses}</div>
              <div><span className="text-white/40">RELATED ARTICLES     :</span> {activeInterview.relatedKnowledgeArticles}</div>
            </div>

            {/* Additional parameters */}
            <div className="space-y-2 text-[10px] font-mono text-white/70 border-t border-white/10 pt-4 mb-6">
              <div><span className="text-[#D4AF37] font-bold">CITATION INFORMATION  :</span> KHCRF Video Dialogues Registry, Accession ID {activeInterview.accessionId}. Retrieved 2026. DOI: Pending registration.</div>
              <div><span className="text-[#D4AF37] font-bold">RIGHTS AND ACCESS     :</span> {activeInterview.accessConditions}</div>
            </div>

            <div className="border-t border-[#D4AF37]/30 pt-6 text-center space-y-4">
              <p className="text-[9px] uppercase tracking-widest text-white/50 leading-relaxed font-mono">
                Sensitive personal data should only be published with explicit consent.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link href="/about/memberships" className="bg-[#D4AF37] text-[#3E2723] hover:bg-white px-6 py-3 font-bold uppercase tracking-wider text-xs transition-colors font-mono">
                  Request Full Dialogue Access
                </Link>
                <button onClick={() => setActiveInterview(null)} className="border border-white/20 hover:border-white text-white px-6 py-3 uppercase tracking-wider text-xs transition-colors font-light font-mono">
                  Return to Registry
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Hero section */}
      <UniversalEditorialHero pageKey="video-interviews" fallbackConfig={videoInterviewsHeroFallback as any} />

      <div className="container-fluid mx-auto px-4 md:px-10 py-12 max-w-7xl animate-fadeIn">
        
        {/* Introductory Statement Block */}
        <div className="bg-[#3E2723]/5 border-l-4 border-[#3E2723] p-8 mb-12 rounded-r-xs max-w-5xl">
          <p className="text-gray-700 text-base md:text-lg leading-relaxed font-serif">
            KHCRF Video Interviews capture expert knowledge, lived experience, institutional perspectives, and informed dialogue surrounding Kashmir's craft traditions. Unlike oral histories, which preserve personal memory, these interviews explore contemporary challenges, traditional knowledge, research findings, policy questions, market dynamics, innovation, education, conservation, and the future of the craft sector.
          </p>
          <p className="text-gray-550 text-xs mt-3 leading-relaxed font-sans">
            The archive supports researchers, universities, cultural institutions, government agencies, museums, artisans, entrepreneurs, students, and the wider public seeking informed perspectives on Kashmir's living craft heritage.
          </p>
          
          <div className="flex flex-wrap gap-4 mt-6 font-mono text-xs">
            <a href="#results" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-5 py-2.5 font-bold uppercase tracking-wider transition-all">
              Browse Interviews
            </a>
            <a href="#suggest" className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-5 py-2.5 font-bold uppercase tracking-wider transition-all">
              Suggest an Interview
            </a>
            <a href="#methodology" className="text-[#3E2723] hover:underline font-bold py-2.5">
              View Interview Methodology &rarr;
            </a>
          </div>
        </div>

        {/* Curated Knowledge Queries (organize by question first) */}
        <section className="bg-white border border-[#3E2723]/10 p-6 md:p-8 mb-12 rounded-xs shadow-xs">
          <h3 className="text-xs font-bold text-[#3E2723] uppercase tracking-widest mb-4 font-mono">
            Explore Curated Knowledge Queries
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <button 
              onClick={() => handleCuratedQuery("documentation")}
              className="border border-[#3E2723]/15 hover:border-[#3E2723] p-4 text-left hover:bg-[#3E2723]/5 transition-all flex flex-col justify-between h-32"
            >
              <span className="italic text-[#D4AF37] font-bold">Query 01</span>
              <span className="text-[#3E2723] font-bold mt-2">How can traditional knowledge be preserved?</span>
              <span className="text-[10px] text-gray-400 mt-2 uppercase tracking-wider">Browse Dialogue Records &rarr;</span>
            </button>
            <button 
              onClick={() => handleCuratedQuery("GI")}
              className="border border-[#3E2723]/15 hover:border-[#3E2723] p-4 text-left hover:bg-[#3E2723]/5 transition-all flex flex-col justify-between h-32"
            >
              <span className="italic text-[#D4AF37] font-bold">Query 02</span>
              <span className="text-[#3E2723] font-bold mt-2">What does GI actually protect?</span>
              <span className="text-[10px] text-gray-400 mt-2 uppercase tracking-wider">Browse Dialogue Records &rarr;</span>
            </button>
            <button 
              onClick={() => handleCuratedQuery("apprenticeship")}
              className="border border-[#3E2723]/15 hover:border-[#3E2723] p-4 text-left hover:bg-[#3E2723]/5 transition-all flex flex-col justify-between h-32"
            >
              <span className="italic text-[#D4AF37] font-bold">Query 03</span>
              <span className="text-[#3E2723] font-bold mt-2">Can apprenticeship survive in the digital age?</span>
              <span className="text-[10px] text-gray-400 mt-2 uppercase tracking-wider">Browse Dialogue Records &rarr;</span>
            </button>
            <button 
              onClick={() => handleCuratedQuery("women")}
              className="border border-[#3E2723]/15 hover:border-[#3E2723] p-4 text-left hover:bg-[#3E2723]/5 transition-all flex flex-col justify-between h-32"
            >
              <span className="italic text-[#D4AF37] font-bold">Query 04</span>
              <span className="text-[#3E2723] font-bold mt-2">Why are women central to Kashmir's craft economy?</span>
              <span className="text-[10px] text-gray-400 mt-2 uppercase tracking-wider">Browse Dialogue Records &rarr;</span>
            </button>
          </div>
        </section>

        {/* Featured Video Dialogue Section */}
        <section className="bg-white border-4 border-[#3E2723] p-8 md:p-10 mb-16 relative shadow-md">
          <div className="absolute top-0 right-0 bg-[#3E2723] text-[#D4AF37] px-4 py-1 text-[10px] font-mono font-bold uppercase tracking-widest">
            FEATURED INTERVIEW
          </div>
          
          <div className="max-w-4xl">
            <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold block mb-1">
              Archive Record: KHCRF-VI-2026-001
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3E2723] leading-tight mb-2">
              Why Craft Heritage Needs Better Documentation
            </h2>
            <h3 className="text-base md:text-lg font-serif italic text-gray-500 mb-4">
              A Conversation on Research, Preservation, and Public Policy
            </h3>
            
            <p className="text-gray-700 text-sm leading-relaxed mb-4 font-sans text-gray-600">
              Researchers, documentation specialists, and cultural practitioners discuss why systematic documentation is essential for preserving Kashmir's craft heritage. The discussion explores archival standards, metadata, digital preservation, policy gaps, and future opportunities for collaborative research.
            </p>

            <blockquote className="border-l-4 border-[#D4AF37] pl-4 italic text-gray-650 text-sm mb-6 font-serif">
              “Without a metadata catalog, an audio recording remains isolated noise.”
              <span className="block text-[9px] uppercase tracking-widest font-bold text-gray-400 font-mono mt-1">&mdash; Editorial preview quotation</span>
            </blockquote>

            <div className="flex flex-wrap gap-2 mb-6">
              {["42 Minutes", "Research & Documentation", "Srinagar", "Recorded 2026", "English", "Transcript Available"].map((tagText) => (
                <span key={tagText} className="bg-[#FAF9F6] border border-[#3E2723]/20 text-[#3E2723] font-mono text-[10px] uppercase font-semibold px-2.5 py-1">
                  {tagText}
                </span>
              ))}
            </div>

            <button 
              onClick={() => setActiveInterview(allInterviews[0])}
              className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-all font-mono"
            >
              View Interview Record &rarr;
            </button>
          </div>
        </section>

        {/* Why Video Interviews Matter Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start mt-12">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-serif text-[#3E2723] mb-6 font-bold">Why Video Interviews Matter</h2>
            <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans">
              Craft heritage is sustained not only through practice but also through dialogue. Experienced artisans, researchers, educators, museum professionals, policymakers, designers, exporters, and cultural practitioners each hold different forms of knowledge that are rarely documented together.
            </p>
            <p className="text-gray-605 text-sm leading-relaxed font-sans">
              The Video Interview Archive brings these perspectives into conversation, helping preserve professional expertise while creating a trusted reference for future research, education, policy, and public understanding.
            </p>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#3E2723]/10 p-8 rounded-xs shadow-xs">
            <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 font-mono">
              The archive documents:
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700 font-sans">
              {[
                "traditional knowledge",
                "contemporary practice",
                "research insights",
                "institutional experience",
                "policy perspectives",
                "conservation challenges",
                "market evolution",
                "innovation and entrepreneurship",
                "education and training",
                "international collaborations"
              ].map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#D4AF37] font-bold">▪</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Archive Overview (Archive Preview Data Block) */}
        <section className="bg-[#3E2723] text-white p-8 md:p-10 mb-12 rounded-xs relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#3E2723] px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-widest">
            Archive Overview
          </div>
          <div className="mb-8">
            <h3 className="font-serif text-2xl text-[#D4AF37] mb-2">Institutional Knowledge Dialogue Archive</h3>
            <p className="text-white/60 text-xs font-mono">
              INTERNAL CORPS REGISTRY SYSTEM PREVIEW
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 text-center md:text-left">
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Interview Records</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">24</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Expert Contributors</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">38</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Craft Traditions Covered</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">12</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Institutions Represented</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">16</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Hours Recorded</span>
              <span className="text-lg md:text-xl font-serif font-bold text-[#D4AF37] block leading-tight font-mono">18h 35m</span>
            </div>
            <div className="last:border-0">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Verified Transcripts</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">20</span>
            </div>
          </div>
        </section>

        {/* View Switcher Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 bg-[#FAF9F6] border border-[#3E2723]/10 p-4 font-mono" id="results">
          <div className="text-xs font-serif text-[#3E2723]">
            KHCRF Registry Catalog &bull; Showing {sortedInterviews.length} Records
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] text-gray-400 uppercase self-center mr-2 font-mono">Archive Layout View:</span>
            <button 
              onClick={() => { setCurrentView('cards'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'cards' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Editorial Cards
            </button>
            <button 
              onClick={() => { setCurrentView('list'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'list' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Research Catalogue
            </button>
            <button 
              onClick={() => { setCurrentView('index'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'index' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Transcript Library
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
                  setSelectedTheme('All Themes');
                  setSelectedInstitution('All Institutions');
                  setSelectedDuration('All Durations');
                  setSelectedStatus('All Statuses');
                  setSelectedLanguage('All Languages');
                  setSelectedSort('Featured');
                  setSelectedSpeakerType('All Speakers');
                  setSearchQuery('');
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
                  placeholder="Search interviews by expert, institution, craft, topic, district, keyword, or transcript..."
                  className="w-full border border-gray-200 px-3 py-2 text-xs rounded-none bg-[#FAF9F6] text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                />
              </div>

              {/* Category / Speaker Type */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Interview Category</label>
                <select 
                  value={selectedSpeakerType}
                  onChange={(e) => { setSelectedSpeakerType(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Speakers">All Interviews</option>
                  <option value="Master Artisan">Master Artisan</option>
                  <option value="Researcher">Researcher</option>
                  <option value="Academic">Academic</option>
                  <option value="Museum Professional">Museum Professional</option>
                  <option value="Designer">Designer</option>
                  <option value="Government Official">Government Official</option>
                  <option value="Policy Expert">Policy Expert</option>
                  <option value="Export Specialist">Export Specialist</option>
                  <option value="Entrepreneur">Entrepreneur</option>
                  <option value="Conservator">Conservator</option>
                  <option value="Student Voices">Student Voices</option>
                </select>
              </div>

              {/* Craft Selection */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Craft Tradition</label>
                <select 
                  value={selectedCraft}
                  onChange={(e) => { setSelectedCraft(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Crafts">All Crafts</option>
                  <option value="Carpet">Carpet</option>
                  <option value="Pashmina">Pashmina</option>
                  <option value="Kani">Kani</option>
                  <option value="Sozni">Sozni</option>
                  <option value="Crewel">Crewel</option>
                  <option value="Papier-Mâché">Papier-Mâché</option>
                  <option value="Walnut Wood">Walnut Wood</option>
                  <option value="Copperware">Copperware</option>
                  <option value="Namda">Namda</option>
                  <option value="Willow Wicker">Willow Wicker</option>
                  <option value="Chain Stitch">Chain Stitch</option>
                </select>
              </div>

              {/* Discussion Theme Selection */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Discussion Theme</label>
                <select 
                  value={selectedTheme}
                  onChange={(e) => { setSelectedTheme(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Themes">All Themes</option>
                  <option value="Heritage Documentation">Heritage Documentation</option>
                  <option value="Traditional Knowledge">Traditional Knowledge</option>
                  <option value="Skill Transmission">Skill Transmission</option>
                  <option value="Innovation">Innovation</option>
                  <option value="Sustainability">Sustainability</option>
                  <option value="Craft Economy">Craft Economy</option>
                  <option value="Market Access">Market Access</option>
                  <option value="GI Protection">GI Protection</option>
                  <option value="Cultural Policy">Cultural Policy</option>
                  <option value="Museum Collections">Museum Collections</option>
                  <option value="Design">Design</option>
                  <option value="Tourism">Tourism</option>
                  <option value="Education">Education</option>
                  <option value="Digital Documentation">Digital Documentation</option>
                </select>
              </div>

              {/* Institution */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Institution</label>
                <select 
                  value={selectedInstitution}
                  onChange={(e) => { setSelectedInstitution(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Institutions">All Institutions</option>
                  <option value="KHCRF">KHCRF</option>
                  <option value="Universities">Universities</option>
                  <option value="Museums">Museums</option>
                  <option value="Government">Government</option>
                  <option value="NGOs">NGOs</option>
                  <option value="Cooperatives">Cooperatives</option>
                  <option value="Research Institutes">Research Institutes</option>
                  <option value="International Organizations">International Organizations</option>
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
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Duration</label>
                <select 
                  value={selectedDuration}
                  onChange={(e) => { setSelectedDuration(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Durations">All Durations</option>
                  <option value="Under 15 min">Under 15 min</option>
                  <option value="15–30 min">15–30 min</option>
                  <option value="30–60 min">30–60 min</option>
                  <option value="Over 60 min">Over 60 min</option>
                </select>
              </div>

              {/* Recording Status */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Documentation Status</label>
                <select 
                  value={selectedStatus}
                  onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Statuses">All Statuses</option>
                  <option value="Published">Published</option>
                  <option value="Transcript Available">Transcript Available</option>
                  <option value="Peer Reviewed">Peer Reviewed</option>
                  <option value="Editorial Review">Editorial Review</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Archive Preview">Archive Preview</option>
                </select>
              </div>

              {/* Sorting */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Sort Order</label>
                <select 
                  value={selectedSort}
                  onChange={(e) => { setSelectedSort(e.target.value); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="Featured">Featured</option>
                  <option value="Newest">Newest</option>
                  <option value="Oldest">Oldest</option>
                  <option value="Duration">Duration</option>
                  <option value="A–Z">A–Z</option>
                  <option value="Institution">Institution</option>
                  <option value="Speaker">Speaker</option>
                </select>
              </div>

            </div>
          </div>

          {/* Results Area */}
          <div className="w-full lg:w-3/4">

            {loading ? (
              <div className="py-20 text-center text-gray-500 font-serif">Loading dialogue records...</div>
            ) : (
              <>
                {/* 1. EDITORIAL CARDS VIEW (RESTYLED WITHOUT IMAGES IN 2-COLUMN GRID) */}
                {currentView === 'cards' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                    {paginatedInterviews.map((h, i) => (
                      <div 
                        key={i} 
                        className="bg-white border border-[#3E2723]/25 py-8 px-6 hover:bg-[#3E2723]/5 transition-all duration-300 group flex flex-col justify-between"
                      >
                        <div>
                          {/* Row 1: Archive ID & Duration */}
                          <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-2">
                            <span>{h.accessionId}</span>
                            <span className="font-bold text-[#3E2723]">{h.dur.replace(" Minutes", " MIN").toUpperCase()}</span>
                          </div>

                          {/* Row 2: Record Type & Craft */}
                          <div className="text-[9px] font-mono text-[#D4AF37] font-bold uppercase tracking-widest mb-4">
                            VIDEO INTERVIEW
                          </div>

                          {/* Row 3: Title */}
                          <h3 
                            onClick={() => setActiveInterview(h)}
                            className="text-2xl font-serif font-bold text-[#3E2723] leading-snug cursor-pointer group-hover:text-[#D4AF37] transition-colors"
                          >
                            {h.title}
                          </h3>

                          {/* Row 4: Subtitle */}
                          {h.subtitle && (
                            <h4 className="text-xs font-serif italic text-gray-505 mt-1 leading-snug mb-4">
                              {h.subtitle}
                            </h4>
                          )}

                          {/* Row 5: Synopsis */}
                          <p className="text-gray-705 text-xs leading-relaxed mb-6 font-sans">
                            {h.desc}
                          </p>

                          {/* Row 6: Excerpt / Quotation styled with quote marks */}
                          {h.transcriptPreview && (
                            <div className="relative pl-6 mb-6">
                              <span className="absolute left-0 top-0 text-3xl font-serif text-[#D4AF37] leading-none">“</span>
                              <p className="italic text-gray-600 text-xs font-serif leading-relaxed">
                                {h.transcriptPreview}”
                              </p>
                            </div>
                          )}
                        </div>

                        <div>
                          {/* Soundline graphic device */}
                          <div className="text-[#3E2723]/20 text-[9px] font-mono mb-4 select-none">
                            ─────╱╲──╱────╲╱─────
                          </div>

                          {/* Row 7: Metadata row */}
                          <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-mono text-gray-400 uppercase tracking-wider mb-4">
                            <span>{h.district.toUpperCase()}</span>
                            <span>&middot;</span>
                            <span>{h.language.toUpperCase()}</span>
                            <span>&middot;</span>
                            <span>RECORDED {h.year}</span>
                          </div>

                          {/* Row 8: Action button & Status */}
                          <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto font-mono">
                            <span className="bg-[#3E2723]/5 border border-[#3E2723]/10 text-[#3E2723] text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider font-mono">
                              {h.status.toUpperCase()}
                            </span>
                            
                            <button 
                              onClick={() => setActiveInterview(h)}
                              className="text-xs font-bold uppercase tracking-widest text-[#3E2723] hover:text-[#D4AF37] transition-colors font-mono"
                            >
                              Explore Dialogue &rarr;
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

                {/* 2. RESEARCH CATALOGUE VIEW */}
                {currentView === 'list' && (
                  <div className="bg-white border border-[#3E2723]/10 overflow-x-auto shadow-sm animate-fadeIn font-sans">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#3E2723] text-[#D4AF37] font-mono uppercase tracking-wider text-[10px]">
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Accession ID</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Dialogue Record / Subtitle</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Craft Tradition</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Institution</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-right font-mono">Duration</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center font-mono">Status</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center font-mono">Transcript</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#3E2723]/10 font-sans text-gray-700">
                        {paginatedInterviews.map((h, i) => (
                          <tr key={i} className="hover:bg-[#FAF9F6] transition-colors cursor-pointer" onClick={() => setActiveInterview(h)}>
                            <td className="p-4 font-mono font-bold text-gray-500 whitespace-nowrap">{h.accessionId}</td>
                            <td className="p-4">
                              <div className="font-serif font-bold text-[#3E2723] text-sm hover:text-[#D4AF37] transition-colors">{h.title}</div>
                              <div className="text-[10px] text-gray-400 font-light truncate max-w-xs">{h.subtitle}</div>
                            </td>
                            <td className="p-4 font-medium">{h.craft}</td>
                            <td className="p-4 whitespace-nowrap">{h.institution}</td>
                            <td className="p-4 text-right font-mono whitespace-nowrap">{h.dur}</td>
                            <td className="p-4 text-center font-mono">{h.status}</td>
                            <td className="p-4 text-center whitespace-nowrap">
                              <span className={`px-2 py-0.5 font-mono text-[9px] uppercase border ${
                                h.hasTranscript === 'Yes' ? 'text-green-600 border-green-200 bg-green-50' : 'text-gray-400 border-gray-100 bg-gray-55'
                              }`}>
                                {h.hasTranscript === 'Yes' ? 'Available' : 'Archived'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 3. TRANSCRIPT LIBRARY VIEW */}
                {currentView === 'index' && (
                  <div className="space-y-8 font-mono text-xs animate-fadeIn font-mono">
                    {paginatedInterviews.map((h, i) => (
                      <div key={i} className="bg-white border-2 border-[#3E2723] p-6 shadow-sm relative">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-[#3E2723] mb-4 gap-2">
                          <div>
                            <span className="bg-[#3E2723] text-white px-2 py-0.5 text-[10px] font-bold mr-3 font-mono">
                              KHCRF DIALOGUE ARCHIVE REGISTRY
                            </span>
                            <span className="font-bold text-gray-500">
                              METADATA ACCESSION CODE: {h.accessionId}
                            </span>
                          </div>
                          <div className="text-[#3E2723] font-bold text-[10px] uppercase font-mono">
                            STATUS: {h.status.toUpperCase()} // RECORDED {h.year}
                          </div>
                        </div>

                        <div className="mb-4 font-serif">
                          <h3 className="text-xl font-bold text-[#3E2723] uppercase">
                            {h.title}
                          </h3>
                          {h.subtitle && (
                            <h4 className="text-xs text-gray-505 italic mt-0.5 uppercase">
                              {h.subtitle}
                            </h4>
                          )}
                        </div>

                        {/* Strict Key-Value Catalog Table */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-[#3E2723]/10 p-4 mb-4 bg-[#FAF9F6] font-mono">
                          <div className="space-y-1.5">
                            <div><span className="text-gray-400 font-mono">PRIMARY CRAFT SECTOR :</span> <span className="font-bold text-[#3E2723]">{h.craft}</span></div>
                            <div><span className="text-gray-400 font-mono">PRIMARY GEOGRAPHY    :</span> <span className="font-bold text-[#3E2723]">{h.district}</span></div>
                            <div><span className="text-gray-400 font-mono">RECORDED DURATION   :</span> <span className="font-bold text-[#3E2723]">{h.dur}</span></div>
                            <div><span className="text-gray-400 font-mono">RESEARCH DIRECTOR   :</span> <span className="font-bold text-[#3E2723]">{h.director}</span></div>
                          </div>
                          <div className="space-y-1.5">
                            <div><span className="text-gray-400 font-mono">SPEAKER/REPRESENTATIVE:</span> <span className="font-bold text-[#3E2723]">{h.artisan}</span></div>
                            <div><span className="text-gray-400 font-mono">RECORDING LANGUAGE  :</span> <span className="font-bold text-[#3E2723]">{h.language}</span></div>
                            <div><span className="text-gray-400 font-mono">SUBTITLES INDEXED   :</span> <span className="font-bold text-[#3E2723]">{h.subtitles === 'Yes' ? 'ENGLISH (BURNED-IN)' : 'NONE'}</span></div>
                            <div><span className="text-gray-400 font-mono">TRANSCRIPT CODE     :</span> <span className="font-bold text-[#3E2723]">{h.hasTranscript === 'Yes' ? `TR-${h.accessionId.replace('KHCRF-VI-', '')}-VERIFIED` : 'ARCHIVED/FORTHCOMING'}</span></div>
                          </div>
                        </div>

                        {/* Emphasized Quotation snippet */}
                        {h.transcriptPreview && (
                          <div className="mb-4 border-l-4 border-[#3E2723] pl-4 italic text-gray-700 bg-gray-50 py-3 font-serif">
                            <span className="text-[10px] text-gray-400 font-bold block mb-1 uppercase font-mono">Dialogue Transcript Excerpt:</span>
                            “{h.transcriptPreview}”
                          </div>
                        )}

                        <div className="mb-4 font-sans text-gray-655 text-xs">
                          <span className="text-gray-400 block mb-1 uppercase font-bold text-[10px] font-mono">Archival Synopsis:</span>
                          <p className="text-gray-750 leading-relaxed text-[11px]">
                            {h.desc}
                          </p>
                        </div>

                        {h.themes && (
                          <div className="mb-4 font-mono">
                            <span className="text-gray-400 block mb-1 uppercase font-bold text-[10px]">Index Keywords & Themes:</span>
                            <div className="flex flex-wrap gap-1">
                              {h.themes.map((th: string) => (
                                <span key={th} className="bg-gray-100 text-[#3E2723] px-2 py-0.5 text-[9px] border border-gray-300 font-mono">
                                  {th.toUpperCase()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="pt-4 border-t border-[#3E2723]/20 flex justify-between items-center text-[10px] font-mono">
                          <span className="text-gray-400">KHCRF KNOWLEDGE ACADEMY &bull; SRINAGAR HQ</span>
                          <button onClick={() => setActiveInterview(h)} className="text-[#3949AB] hover:underline font-bold uppercase font-mono">
                            Explore Dialogue Record &rarr;
                          </button>
                        </div>

                      </div>
                    ))}
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
                  className="w-10 h-10 border border-gray-305 flex items-center justify-center text-gray-550 hover:border-[#3E2723] hover:text-[#3E2723] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  &rarr;
                </button>
              </div>
            )}
          </div>

        </section>

        {/* How KHCRF Dialogues Are Developed Section */}
        <section className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs mt-16" id="methodology">
          <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold">
            How KHCRF Video Interviews Are Developed
          </h2>
          <p className="text-gray-605 text-sm leading-relaxed mb-8 max-w-4xl font-sans">
            Each interview follows a structured editorial process to ensure that professional knowledge is accurately documented, ethically recorded, and made accessible for long-term educational and research use.
          </p>

          <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 font-mono">
            Workflow Stages
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 text-xs text-gray-700">
            <div className="border-l-2 border-[#3E2723] pl-4 py-1">
              <span className="font-mono text-[#D4AF37] font-bold block mb-1">STAGE 01</span>
              <span className="font-bold text-[#3E2723] block mb-1">Topic identification</span>
            </div>
            <div className="border-l-2 border-[#3E2723] pl-4 py-1">
              <span className="font-mono text-[#D4AF37] font-bold block mb-1">STAGE 02</span>
              <span className="font-bold text-[#3E2723] block mb-1">Background research</span>
            </div>
            <div className="border-l-2 border-[#3E2723] pl-4 py-1">
              <span className="font-mono text-[#D4AF37] font-bold block mb-1">STAGE 03</span>
              <span className="font-bold text-[#3E2723] block mb-1">Speaker invitation</span>
            </div>
            <div className="border-l-2 border-[#3E2723] pl-4 py-1">
              <span className="font-mono text-[#D4AF37] font-bold block mb-1">STAGE 04</span>
              <span className="font-bold text-[#3E2723] block mb-1">Interview preparation</span>
            </div>
            <div className="border-l-2 border-[#3E2723] pl-4 py-1">
              <span className="font-mono text-[#D4AF37] font-bold block mb-1">STAGE 05</span>
              <span className="font-bold text-[#3E2723] block mb-1">Structured recording</span>
            </div>
            <div className="border-l-2 border-[#3E2723] pl-4 py-1 col-span-1">
              <span className="font-mono text-[#D4AF37] font-bold block mb-1">STAGE 06</span>
              <span className="font-bold text-[#3E2723] block mb-1">Transcript preparation</span>
            </div>
            <div className="border-l-2 border-[#3E2723] pl-4 py-1">
              <span className="font-mono text-[#D4AF37] font-bold block mb-1">STAGE 07</span>
              <span className="font-bold text-[#3E2723] block mb-1">Fact verification</span>
            </div>
            <div className="border-l-2 border-[#3E2723] pl-4 py-1">
              <span className="font-mono text-[#D4AF37] font-bold block mb-1">STAGE 08</span>
              <span className="font-bold text-[#3E2723] block mb-1">Editorial review</span>
            </div>
            <div className="border-l-2 border-[#3E2723] pl-4 py-1">
              <span className="font-mono text-[#D4AF37] font-bold block mb-1">STAGE 09</span>
              <span className="font-bold text-[#3E2723] block mb-1">Metadata enrichment</span>
            </div>
            <div className="border-l-2 border-[#3E2723] pl-4 py-1">
              <span className="font-mono text-[#D4AF37] font-bold block mb-1">STAGE 10</span>
              <span className="font-bold text-[#3E2723] block mb-1">Publication</span>
            </div>
          </div>
        </section>

        {/* Ethical Documentation Principles Section */}
        <section className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs mt-12">
          <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold">
            Ethical Interview Principles
          </h2>
          <p className="text-gray-655 text-sm leading-relaxed mb-8 max-w-4xl font-sans">
            The archive follows clear documentation standards:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-xs text-gray-700 font-sans">
            {[
              "informed consent",
              "accurate representation",
              "transparent editing",
              "fact verification",
              "contextual notes",
              "citation standards",
              "multilingual accessibility",
              "long-term preservation",
              "respect for intellectual contributions"
            ].map((principle, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>{principle}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Suggest an Interview Section */}
        <section className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs mt-12" id="suggest">
          <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold">
            Suggest a Dialogue Subject
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-6 font-sans">
            Artisans, scholars, policy planners, and cooperative representatives are invited to propose dialogue topics or experts to be interviewed for the registry archive.
          </p>
          <div className="max-w-2xl bg-[#FAF9F6] border border-[#3E2723]/20 p-6 font-mono text-xs space-y-4">
            <div>
              <span className="text-[#3E2723] font-bold block mb-1">PROPOSAL PATHWAY</span>
              <span className="text-gray-500">To submit a proposal, please contact the registry board directly at <strong className="text-[#3E2723]">registry@khcrf.org</strong> with a brief outline of the proposed expert, their affiliation, and the dialogue questions.</span>
            </div>
          </div>
        </section>

        {/* Research and Educational Use Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start mt-16 font-sans">
          <div className="lg:col-span-5 font-sans">
            <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold">
              Using the Dialogue Archive
            </h2>
            <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans text-gray-500">
              The interview archive supports:
            </p>
            <div className="flex flex-col gap-3 font-mono">
              <button 
                onClick={() => setActiveInterview(allInterviews[0])}
                className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors text-center font-mono w-full md:w-auto"
              >
                Request Research Access
              </button>
              <button 
                onClick={() => setActiveInterview(allInterviews[0])}
                className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors text-center font-mono w-full md:w-auto"
              >
                Recommend an Interview Topic
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#FAF9F6] border border-[#3E2723]/10 p-6 md:p-8 font-sans">
            <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-200 font-mono">
              Approved Research & Educational Uses
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4 text-xs text-gray-700 font-sans">
              <li className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>Universities
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>Museum studies
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>Conservation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>Policy research
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>Artisan training
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>Public education
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>Curriculum development
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>Heritage management
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>International collaboration
              </li>
            </ul>
          </div>
        </section>

        {/* Footer Statement Section */}
        <section className="border-t border-[#3E2723]/20 pt-10 text-center max-w-4xl mx-auto mt-16 font-sans">
          <blockquote className="text-gray-700 text-base md:text-lg leading-relaxed font-serif italic mb-4">
            "KHCRF Video Interviews document the knowledge, experience, and perspectives of the individuals shaping Kashmir's craft ecosystem today. By preserving informed dialogue alongside practice, the archive creates a trusted reference for research, education, policy, and the future stewardship of living heritage."
          </blockquote>
          <p className="text-gray-400 text-xs font-mono uppercase tracking-widest font-bold">
            KHCRF Registry Access Console &bull; Video Dialogues Registry Division
          </p>
          <p className="text-[#D4AF37] text-[10px] uppercase font-bold mt-2 tracking-widest font-mono">
            This page represents an institutional knowledge dialogue archive under development. Access to verified video files and transcriptions is reserved for supportive members.
          </p>
        </section>

      </div>
    </main>
  );
}
