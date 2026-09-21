'use client';
import { getBaseUrlNoApi } from "@/lib/api";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { audioStoriesHeroFallback } from '@/config/heroFallbacks';

export default function AudioStories() {
  const [allPodcasts, setAllPodcasts] = useState<any[]>([
    {
      slug: "audio-sound-loom",
      title: "The Sound of the Loom",
      subtitle: "Acoustic Cadence of the Handloom",
      dur: "24 Minutes",
      durationMin: 24,
      durationVal: "15–30 min",
      tag: "Ambient workshop",
      img: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop",
      desc: "An immersive audio experience capturing the rhythmic beats of the Kani loom and soft handloom tensioning adjustments inside a Srinagar home karkhana.",
      accessionId: "KHCRF-AS-2026-001",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Ustad Ghulam Rasool",
      preferredPublicName: "Ustad Ghulam Rasool",
      gender: "Male",
      birthYear: "1955",
      role: "Weaver",
      yearsInCraft: "52 Years",
      workshop: "Rasool Looms, Srinagar",
      director: "Farooq Mir",
      transcriptPreview: "Each shuttle pass has a pitch. If the yarn is dry, it clicks; if it is damp, it whispers...",
      craft: "Pashmina",
      theme: "Traditional Knowledge",
      status: "Published Record",
      hasTranscript: "Yes",
      themes: ["Loom Soundscapes", "Acoustics", "Workplace", "Pashmina"],
      district: "Downtown Srinagar",
      recordingDate: "January 14, 2026",
      interviewer: "Farooq Mir",
      recorder: "Sajad Dar",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. K. A. Mir",
      consentStatus: "Consented to archival summary release",
      recordingLocation: "Rasool Looms, Srinagar",
      publishedDuration: "24 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "Linear PCM WAV 24-bit 96kHz",
      audioQuality: "Master Grade",
      environment: "Active loom room, rhythmic wood block tapping",
      rightsStatus: "Copyright KHCRF 2026. Academic use allowed.",
      accessConditions: "Dialogue accessible for verified research members.",
      timestampedSegment: "00:05:18 — Speaker:\nEach shuttle pass has a pitch. If the yarn is dry, it clicks; if it is damp, it whispers. You listen to the loom to know when a thread is about to break.",
      relatedResearch: "Kashmir Valley regional database mapping index #PASHMINA_ACOUSTICS",
      relatedDocumentary: "Doc-KHCRF-2026-01",
      relatedOralHistory: "KHCRF-OH-2026-001",
      relatedCollection: "Signature Masterpieces",
      relatedCourses: "Acoustic Heritage Preservation",
      relatedKnowledgeArticles: "Loom Sound Mapping"
    },
    {
      slug: "audio-morning-papier",
      title: "Morning in a Papier-Mâché Studio",
      subtitle: "Ambient sounds of brush washing and paper preparation",
      dur: "15 Minutes",
      durationMin: 15,
      durationVal: "15–30 min",
      tag: "Daily life",
      img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop",
      desc: "Ambient tea pouring, brush washing, and soft Kashmiri conversation inside Habibullah's papier-mâché atelier.",
      accessionId: "KHCRF-AS-2026-002",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Habibullah Atelier Guild",
      preferredPublicName: "Habibullah Atelier Group",
      gender: "Male / Female",
      birthYear: "Various",
      role: "Atelier Artisans",
      yearsInCraft: "Combined 80+ Years",
      workshop: "Habibullah Atelier, Srinagar",
      director: "Zehra Malik",
      transcriptPreview: "In the morning, the water in the cups is cold. We mix the glue with our fingers, matching the paste thickness...",
      craft: "Papier-Mâché",
      theme: "Workshop Life",
      status: "Published Record",
      hasTranscript: "Yes",
      themes: ["Atelier Ambience", "Daily Life", "Brush Washing", "Papier-Mâché"],
      district: "Srinagar",
      recordingDate: "January 20, 2026",
      interviewer: "Zehra Malik",
      recorder: "Aamir Bhat",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. S. Farooq",
      consentStatus: "Consent signed for daily life study",
      recordingLocation: "Atelier Eidgah, Srinagar",
      publishedDuration: "15 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "FLAC 16-bit 48kHz",
      audioQuality: "Broadcast Standard",
      environment: "Workshop kitchen setting, water splashing, soft voices",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Public summary view. Transcripts queryable.",
      timestampedSegment: "00:03:22 — Speaker:\nIn the morning, the water in the cups is cold. We mix the glue with our fingers, matching the paste thickness. You feel the pulp to know if it is ready for the mold.",
      relatedResearch: "Atelier Sound Studies #PAPIER_MACHE",
      relatedDocumentary: "Doc-KHCRF-2026-04",
      relatedOralHistory: "KHCRF-OH-2026-003",
      relatedCollection: "Rare Objects Collection",
      relatedCourses: "Atelier Ethnography",
      relatedKnowledgeArticles: "Papier-Mâché Pulp Preparation"
    },
    {
      slug: "audio-carpet-begins",
      title: "A Carpet Begins",
      subtitle: "Acoustic tracking of yarn winding and loom setup",
      dur: "18 Minutes",
      durationMin: 18,
      durationVal: "15–30 min",
      tag: "Production journey",
      img: "https://images.unsplash.com/photo-1487180142328-0c4e37023af5?w=600&auto=format&fit=crop",
      desc: "Tracing the early soundscapes of yarn winding, thread tensioning, and the reading of talim cards inside a carpet karkhana.",
      accessionId: "KHCRF-AS-2026-003",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Master Ghulam Hassan",
      preferredPublicName: "Master Ghulam Hassan Bhat",
      gender: "Male",
      birthYear: "1951",
      role: "Weaving Master",
      yearsInCraft: "61 Years",
      workshop: "Bhat Karkhana, Zaina Kadal",
      director: "KHCRF Editorial",
      transcriptPreview: "Reading talim is like chanting. We sing the colors so the weavers' fingers fly without pausing...",
      craft: "Carpet",
      theme: "Traditional Knowledge",
      status: "Published Record",
      hasTranscript: "Yes",
      themes: ["Yarn Winding", "Loom Setup", "Talim Chanting", "Carpet Weaving"],
      district: "Srinagar",
      recordingDate: "February 04, 2026",
      interviewer: "KHCRF Editor",
      recorder: "Farooq Mir",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. S. Shah",
      consentStatus: "Public official disclosure cleared",
      recordingLocation: "Bhat Karkhana, Srinagar",
      publishedDuration: "18 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "FLAC 16-bit 48kHz",
      audioQuality: "Broadcast Standard",
      environment: "Loom room, yarn squeaks, rhythmic pattern calls",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Open access summary.",
      timestampedSegment: "00:04:15 — Speaker:\nReading talim is like chanting. We sing the colors so the weavers' fingers fly without pausing. The voice sets the speed of the knots.",
      relatedResearch: "Acoustics of Talim Recitation in Srinagar Looms",
      relatedDocumentary: "Doc-KHCRF-2026-03",
      relatedOralHistory: "KHCRF-OH-2026-007",
      relatedCollection: "Hand-Knotted Carpet Archive",
      relatedCourses: "Talim Translation Systems",
      relatedKnowledgeArticles: "Pattern Chanting Analysis"
    },
    {
      slug: "audio-voices-downtown",
      title: "Voices from Downtown Srinagar",
      subtitle: "Street soundscapes and bazaar conversations",
      dur: "20 Minutes",
      durationMin: 20,
      durationVal: "15–30 min",
      tag: "Craft market",
      img: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600&auto=format&fit=crop",
      desc: "Audio snippets of historical lanes, wholesale wool bargaining, coppersmith clusters, and merchant guild interactions.",
      accessionId: "KHCRF-AS-2026-004",
      year: "2026",
      language: "Kashmiri and Urdu",
      subtitles: "Yes",
      artisan: "Zaina Kadal Merchants",
      preferredPublicName: "Downtown Merchant Guild Representatives",
      gender: "Male / Female Group",
      birthYear: "Various",
      role: "Bazaar Merchants",
      yearsInCraft: "Various",
      workshop: "Zaina Kadal Market Bazaar",
      director: "Farooq Mir",
      transcriptPreview: "A bazaar is not a silent store. Here, the deal is signed when the tea cup hits the metal tray...",
      craft: "Multi-Craft",
      theme: "Traditional Markets",
      status: "Research in Progress",
      hasTranscript: "Yes",
      themes: ["Downtown", "Bazaars", "Bargaining", "Downtown Srinagar"],
      district: "Srinagar",
      recordingDate: "February 18, 2026",
      interviewer: "Farooq Mir",
      recorder: "Sajad Dar",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. G. Bhat",
      consentStatus: "Consent signed for database register mapping",
      recordingLocation: "Zaina Kadal Bazaar, Srinagar",
      publishedDuration: "20 Minutes",
      transcriptLanguage: "Kashmiri / Urdu",
      translationLanguage: "English",
      audioFormat: "WAV 24-bit 48kHz",
      audioQuality: "Studio Grade",
      environment: "Active street market, metallic tapping, tea sellers shouting",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Academic research access only. Transcription register public.",
      timestampedSegment: "00:08:44 — Speaker:\nA bazaar is not a silent store. Here, the deal is signed when the tea cup hits the metal tray. The negotiation has its own music, a rise and fall that merchants understand.",
      relatedResearch: "Acoustic Landscapes of Old Srinagar Markets",
      relatedDocumentary: "Doc-KHCRF-2026-12",
      relatedOralHistory: "KHCRF-OH-2026-012",
      relatedCollection: "Bazaar Trade Archive",
      relatedCourses: "Heritage Marketplace Studies",
      relatedKnowledgeArticles: "Downtown Bazaars Heritage"
    },
    {
      slug: "audio-apprentice-first-day",
      title: "The Apprentice",
      subtitle: "Oral diary of first week at the loom",
      dur: "12 Minutes",
      durationMin: 12,
      durationVal: "Under 15 min",
      tag: "First day",
      img: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&auto=format&fit=crop",
      desc: "Reflections of a young apprentice weaver adapting to sitting before a massive vertical loom, dealing with hand fatigue and structural discipline.",
      accessionId: "KHCRF-AS-2026-005",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Sajid Ahmad",
      preferredPublicName: "Sajid Ahmad",
      gender: "Male",
      birthYear: "2002",
      role: "Apprentice",
      yearsInCraft: "4 Years",
      workshop: "Srinagar Loom Cluster",
      director: "Zehra Malik",
      transcriptPreview: "On the first day, the loom looked larger than the room. My fingers felt like wood, stiff and clumsy...",
      craft: "Pashmina",
      theme: "Ustad–Shagird Tradition",
      status: "Published Record",
      hasTranscript: "Yes",
      themes: ["Apprenticeship", "First Loom", "Youth", "Weaving"],
      district: "Srinagar",
      recordingDate: "March 02, 2026",
      interviewer: "Zehra Malik",
      recorder: "Aamir Bhat",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. M. Amin",
      consentStatus: "Institutional consent cleared",
      recordingLocation: "Guild Workshop, Srinagar",
      publishedDuration: "12 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "FLAC 16-bit 48kHz",
      audioQuality: "Broadcast Standard",
      environment: "Loom room, soft rhythmic tap of shuttle",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Dialogue concept study. Full release forthcoming.",
      timestampedSegment: "00:03:14 — Speaker:\nOn the first day, the loom looked larger than the room. My fingers felt like wood, stiff and clumsy. But the ustad said the wood must learn to recognize the hand.",
      relatedResearch: "Vocational Adaptation in Handloom Apprentices",
      relatedDocumentary: "Doc-KHCRF-2026-07",
      relatedOralHistory: "KHCRF-OH-2026-005",
      relatedCollection: "Curriculum Registry",
      relatedCourses: "Apprenticeship Integration",
      relatedKnowledgeArticles: "Ustad-Shagird Legacies"
    },
    {
      slug: "audio-hands-remember",
      title: "Hands That Remember",
      subtitle: "Spoken reflections of an elder artisan",
      dur: "22 Minutes",
      durationMin: 22,
      durationVal: "15–30 min",
      tag: "Elder artisan",
      img: "https://images.unsplash.com/photo-1550525811-e5869dd03032?w=600&auto=format&fit=crop",
      desc: "Spoken reflections of an elder craftsman whose hands continue to find patterns automatically on raw walnut blocks despite failing vision.",
      accessionId: "KHCRF-AS-2026-006",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Ustad Ali Mohammad",
      preferredPublicName: "Ustad Ali Mohammad",
      gender: "Male",
      birthYear: "1945",
      role: "Master Carver",
      yearsInCraft: "66 Years",
      workshop: "Downtown Srinagar Woodshop",
      director: "Sajad Dar",
      transcriptPreview: "I do not see the details anymore. The steel tool finds its own path because the fingers remember...",
      craft: "Walnut Wood",
      theme: "Craft Lineage",
      status: "Published Record",
      hasTranscript: "Yes",
      themes: ["Memory", "Tactile", "Elder Memory", "Woodcarving"],
      district: "Srinagar",
      recordingDate: "March 18, 2026",
      interviewer: "Sajad Dar",
      recorder: "Farooq Mir",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. N. Jan",
      consentStatus: "Ethical consent signed by co-op committee",
      recordingLocation: "Zaina Kadal Workshop, Srinagar",
      publishedDuration: "22 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "WAV 24-bit 96kHz",
      audioQuality: "Broadcast Grade",
      environment: "Active workshop backdrop, rhythmic chiseling",
      rightsStatus: "Copyright KHCRF 2026. Cooperative shared rights.",
      accessConditions: "Public summary view.",
      timestampedSegment: "00:06:42 — Speaker:\nI do not see the details anymore. The steel tool finds its own path because the fingers remember. The grain tells the hand when to turn.",
      relatedResearch: "Tactile Memory Preservation in Senior Carvers",
      relatedDocumentary: "Doc-KHCRF-2026-11",
      relatedOralHistory: "KHCRF-OH-2026-003",
      relatedCollection: "Contemporary Design Catalog",
      relatedCourses: "Preservation and Lineages",
      relatedKnowledgeArticles: "Tactile Material Grading"
    },
    {
      slug: "audio-threads-memory",
      title: "Threads of Memory",
      subtitle: "Oral history family weaving secrets",
      dur: "19 Minutes",
      durationMin: 19,
      durationVal: "15–30 min",
      tag: "Family heritage",
      img: "https://images.unsplash.com/photo-1583795128727-6ec36d240d60?w=600&auto=format&fit=crop",
      desc: "Audio recollections of family weaving secrets, focusing on design corrections, motif placement, and domestic production patterns.",
      accessionId: "KHCRF-AS-2026-007",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Mubeena Begum",
      preferredPublicName: "Mubeena Begum",
      gender: "Female",
      birthYear: "1968",
      role: "Embroidery Artisan",
      yearsInCraft: "38 Years",
      workshop: "Domestic Karkhana, Srinagar",
      director: "KHCRF Editorial",
      transcriptPreview: "My mother told me that the color on the back should look as neat as the front. That is how a family name stays clean...",
      craft: "Kani",
      theme: "Women Artisans",
      status: "In Editorial Review",
      hasTranscript: "Yes",
      themes: ["Family Lineage", "Domestic Work", "Invisible Labour", "Kani Shawl"],
      district: "Srinagar",
      recordingDate: "April 10, 2026",
      interviewer: "KHCRF Editor",
      recorder: "Aamir Bhat",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. S. A. Shah",
      consentStatus: "Consent signed for ecological index inclusion",
      recordingLocation: "Domestic Home, Srinagar",
      publishedDuration: "19 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "FLAC 16-bit 48kHz",
      audioQuality: "Broadcast Standard",
      environment: "Kitchen sounds, kids playing in courtyard",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Restricted editorial review status. Summary public.",
      timestampedSegment: "00:04:32 — Speaker:\nMy mother told me that the color on the back should look as neat as the front. That is how a family name stays clean. The needle must not leave any knots behind.",
      relatedResearch: "Unrecorded Female Domestic Labor in Srinagar Guilds",
      relatedDocumentary: "Doc-KHCRF-2026-05",
      relatedOralHistory: "KHCRF-OH-2026-001",
      relatedCollection: "Women's Guild Collection",
      relatedCourses: "Feminist Economics and Crafts",
      relatedKnowledgeArticles: "Invisible Spinning Labour"
    },
    {
      slug: "audio-winter-workshop",
      title: "Winter Workshop Diaries",
      subtitle: "Spoken logs on seasonal work challenges",
      dur: "21 Minutes",
      durationMin: 21,
      durationVal: "15–30 min",
      tag: "Seasonal work",
      img: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop",
      desc: "Spoken logs detailing winter work challenges, showing how freezing temperatures impact paint drying, wood stiffness, dye setups, and artisan hand mobility.",
      accessionId: "KHCRF-AS-2026-008",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Downtown Carver Guild",
      preferredPublicName: "Downtown Srinagar Carver Guild Spokesperson",
      gender: "Male",
      birthYear: "1970",
      role: "Workshop Owner",
      yearsInCraft: "35 Years",
      workshop: "Carver Guild karkhanas",
      director: "Zehra Malik",
      transcriptPreview: "In January, the chisel slips because the hand is numb. We sit close to the kangri, warming our joints...",
      craft: "Walnut Wood",
      theme: "Workshop Life",
      status: "Published Record",
      hasTranscript: "Yes",
      themes: ["Seasonality", "Diaries", "Kangri", "Winter Work"],
      district: "Srinagar",
      recordingDate: "April 22, 2026",
      interviewer: "Zehra Malik",
      recorder: "Sajad Dar",
      translator: "None required",
      transcriptReviewer: "Dr. H. Mir",
      consentStatus: "Consented to educational registry presentation",
      recordingLocation: "Guild Workshop, Srinagar",
      publishedDuration: "21 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "WAV 24-bit 48kHz",
      audioQuality: "Studio Grade",
      environment: "Crackling wood fire, wind blowing outside",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Open educational register access.",
      timestampedSegment: "00:05:42 — Speaker:\nIn January, the chisel slips because the hand is numb. We sit close to the kangri, warming our joints. The wood is stiff, resisting the steel.",
      relatedResearch: "Seasonal Production Declines in Kashmir Downtown Workshops",
      relatedDocumentary: "Doc-KHCRF-2026-10",
      relatedOralHistory: "KHCRF-OH-2026-008",
      relatedCollection: "Srinagar Guild Historical Logs",
      relatedCourses: "Sustainable Tourism Practices",
      relatedKnowledgeArticles: "Visitor Etiquette in Karkhanas"
    },
    {
      slug: "audio-copper-hammer",
      title: "The Copper Hammer",
      subtitle: "Rhythmic sounds of coppersmith workshops",
      dur: "14 Minutes",
      durationMin: 14,
      durationVal: "Under 15 min",
      tag: "Copperware sounds",
      img: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&auto=format&fit=crop",
      desc: "The metallic symphony of Zaina Kadal copper hammering, recording the acoustic speed and rhythmic patterns used to flatten raw brass and copper sheets.",
      accessionId: "KHCRF-AS-2026-009",
      year: "2026",
      language: "Kashmiri",
      subtitles: "No",
      artisan: "Coppersmiths Guild",
      preferredPublicName: "Coppersmiths Guild Members",
      gender: "Male",
      birthYear: "Various",
      role: "Coppersmiths",
      yearsInCraft: "Various",
      workshop: "Zaina Kadal Copper Atelier",
      director: "Farooq Mir",
      transcriptPreview: "The hammer has a beat. One strong strike to flatten, two quick taps to smooth. We talk in beats...",
      craft: "Copperware",
      theme: "Traditional Techniques",
      status: "Published Record",
      hasTranscript: "Yes",
      themes: ["Metalwork", "Acoustics", "Hammering", "Copperware"],
      district: "Srinagar",
      recordingDate: "May 12, 2026",
      interviewer: "Farooq Mir",
      recorder: "Sajad Dar",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. S. Shah",
      consentStatus: "Consent signed for market study publication",
      recordingLocation: "Copper Bazaar, Srinagar",
      publishedDuration: "14 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "FLAC 16-bit 48kHz",
      audioQuality: "Broadcast Standard",
      environment: "Deafening rhythmic metallic beats, calling voices",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Academic research viewable under request.",
      timestampedSegment: "00:02:18 — Speaker:\nThe hammer has a beat. One strong strike to flatten, two quick taps to smooth. We talk in beats, raising our voices over the metal.",
      relatedResearch: "Acoustics of Hand-Hammered Copperware in Srinagar Bazaars",
      relatedDocumentary: "Doc-KHCRF-2026-12",
      relatedOralHistory: "KHCRF-OH-2026-012",
      relatedCollection: "Bazaar Trade Archive",
      relatedCourses: "Tactile Material Grading",
      relatedKnowledgeArticles: "Downtown Bazaars Heritage"
    },
    {
      slug: "audio-colours-nature",
      title: "Colours from Nature",
      subtitle: "Spoken descriptions of boiling dye pots",
      dur: "16 Minutes",
      durationMin: 16,
      durationVal: "15–30 min",
      tag: "Natural dye process",
      img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop",
      desc: "Immersive audio capturing the bubbling of massive natural dye pots, steam venting, and spoken logs of wild walnut shell binding methods.",
      accessionId: "KHCRF-AS-2026-010",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Ustad Irfan Mir",
      preferredPublicName: "Dr. Irfan Mir & Dye masters",
      gender: "Male",
      birthYear: "1980",
      role: "Dye Master",
      yearsInCraft: "12 Years",
      workshop: "Central Dye House, Srinagar",
      director: "Bilal Jan",
      transcriptPreview: "When the walnut peel boils, it smells like vinegar. You must boil it for four hours until the steam turns yellow...",
      craft: "Pashmina",
      theme: "Sustainability",
      status: "Published Record",
      hasTranscript: "Yes",
      themes: ["Natural Dyes", "Dyeing Pot", "Walnut Shell", "Preservation"],
      district: "Srinagar",
      recordingDate: "June 04, 2026",
      interviewer: "Bilal Jan",
      recorder: "Farooq Mir",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. K. A. Mir",
      consentStatus: "Consent signed by craft school guild",
      recordingLocation: "Dyeing Workshop, Srinagar",
      publishedDuration: "16 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "WAV 24-bit 48kHz",
      audioQuality: "Studio Grade",
      environment: "Bubbling water, wood stove crackle, steam hissing",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Dialogue concept study summary.",
      timestampedSegment: "00:04:12 — Speaker:\nWhen the walnut peel boils, it smells like vinegar. You must boil it for four hours until the steam turns yellow. Then you slide the wet yarn in.",
      relatedResearch: "Chemical Evaluation of Walnut and Saffron Bindings",
      relatedDocumentary: "Doc-KHCRF-2026-07",
      relatedOralHistory: "KHCRF-OH-2026-006",
      relatedCollection: "Natural Dye Registry",
      relatedCourses: "Organic Dye Chemistry",
      relatedKnowledgeArticles: "Natural Dye Conservation"
    },
    {
      slug: "audio-women-needle",
      title: "Women Behind the Needle",
      subtitle: "Spoken diaries of home embroiderers",
      dur: "23 Minutes",
      durationMin: 23,
      durationVal: "15–30 min",
      tag: "Women artisans",
      img: "https://images.unsplash.com/photo-1513829096999-4978602294fc?w=600&auto=format&fit=crop",
      desc: "Soft recordings of women embroiderers discussing pattern lines, balancing home duties, and yarn selection inside domestic Srinagar living rooms.",
      accessionId: "KHCRF-AS-2026-011",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Safeena Jan",
      preferredPublicName: "Safeena Jan",
      gender: "Female",
      birthYear: "2004",
      role: "Embroiderer",
      yearsInCraft: "8 Years",
      workshop: "Domestic Karkhana, Srinagar",
      director: "KHCRF Editorial",
      transcriptPreview: "We sit in the circle after the afternoon chores. The needle doesn't make a sound, only the thread passing...",
      craft: "Sozni",
      theme: "Women Artisans",
      status: "Published Record",
      hasTranscript: "Yes",
      themes: ["Women Weavers", "Sozni", "Domestic Space", "Invisible Labor"],
      district: "Srinagar",
      recordingDate: "July 12, 2026",
      interviewer: "KHCRF Editor",
      recorder: "Sajad Dar",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. S. A. Shah",
      consentStatus: "Consent signed for technical preservation archive",
      recordingLocation: "Domestic Atelier, Srinagar",
      publishedDuration: "23 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "WAV 24-bit 96kHz",
      audioQuality: "Broadcast Grade",
      environment: "Quiet domestic interior, soft birds in background",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Published record viewable by authorized members.",
      timestampedSegment: "00:05:18 — Speaker:\nWe sit in the circle after the afternoon chores. The needle doesn't make a sound, only the thread passing through the soft pashmina cloth. That sound tells you the tension is right.",
      relatedResearch: "Socio-Economics of Domestic Sozni Workers in Downtown Srinagar",
      relatedDocumentary: "Doc-KHCRF-2026-05",
      relatedOralHistory: "KHCRF-OH-2026-001",
      relatedCollection: "Signature Masterpieces",
      relatedCourses: "Feminist Economics and Crafts",
      relatedKnowledgeArticles: "Invisible Spinning Labour"
    },
    {
      slug: "audio-markets-borders",
      title: "Markets Beyond Borders",
      subtitle: "Oral chronicle of a shawl export journey",
      dur: "26 Minutes",
      durationMin: 26,
      durationVal: "15–30 min",
      tag: "Export stories",
      img: "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=600&auto=format&fit=crop",
      desc: "An oral chronicle tracing the export log of a single Pashmina shawl from Srinagar bazaars to European galleries.",
      accessionId: "KHCRF-AS-2026-012",
      year: "2026",
      language: "Urdu",
      subtitles: "Yes",
      artisan: "Manzoor Ahmad",
      preferredPublicName: "Manzoor Ahmad",
      gender: "Male",
      birthYear: "1966",
      role: "Exporter",
      yearsInCraft: "38 Years",
      workshop: "Srinagar Emporium Alliance",
      director: "Zehra Malik",
      transcriptPreview: "A shawl is packed in oil-paper to prevent humidity during transit. Every hand that touches the bundle writes a log...",
      craft: "Pashmina",
      theme: "Markets and Trade",
      status: "Research in Progress",
      hasTranscript: "Yes",
      themes: ["Export Logs", "Markets", "Transit", "Trade Channels"],
      district: "Srinagar",
      recordingDate: "August 04, 2026",
      interviewer: "Zehra Malik",
      recorder: "Sajad Dar",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. H. Mir",
      consentStatus: "Merchant guild clearance signed",
      recordingLocation: "Shawl Emporium, Srinagar",
      publishedDuration: "26 Minutes",
      transcriptLanguage: "Urdu",
      translationLanguage: "English",
      audioFormat: "WAV 24-bit 96kHz",
      audioQuality: "Broadcast Grade",
      environment: "Showroom interior, silent backdrop",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Restricted to support members. Register record public.",
      timestampedSegment: "00:09:12 — Speaker:\nA shawl is packed in oil-paper to prevent humidity during transit. Every hand that touches the bundle writes a log, from the Srinagar warehouse to the customs deck in Delhi.",
      relatedResearch: "Logistics Frameworks for Traditional Exporters in J&K",
      relatedDocumentary: "Doc-KHCRF-2026-12",
      relatedOralHistory: "KHCRF-OH-2026-012",
      relatedCollection: "Bazaar Trade Archive",
      relatedCourses: "E-Commerce Logistics for Crafts",
      relatedKnowledgeArticles: "Downtown Bazaars Heritage"
    }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
const API_BASE_URL = getBaseUrlNoApi();
    fetch(`${API_BASE_URL}/api/v1/knowledge?entityType=KNOWLEDGE_OBJECT&take=100`).catch(() => ({ ok: false, json: () => Promise.resolve([]) }))
      .then(res => { if (!res.ok) return []; return res.json(); })
      .then(data => {
        const items = (Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : [])).filter((d: any) => d.metadata?.kind === 'STUDIO_MEDIA' && d.metadata?.type === 'Audio Story').map((d: any) => ({
          title: d.title,
          subtitle: d.metadata.subtitle || d.title,
          dur: d.metadata.dur || '24 Minutes',
          durationMin: d.metadata.durationMin || 24,
          durationVal: d.metadata.durationVal || '15–30 min',
          tag: d.metadata.tag || 'Featured Audio Story',
          img: d.metadata.img || '/assets/images/studio/audio/audio_1.jpg',
          desc: d.summary || d.metadata.desc,
          slug: d.slug,
          accessionId: d.metadata.accessionId || `KHCRF-AS-2026-${d.slug.toUpperCase()}`,
          year: d.metadata.year || '2026',
          language: d.metadata.language || 'Kashmiri',
          subtitles: d.metadata.subtitles || 'Yes',
          artisan: d.metadata.artisan || 'Master Artisan',
          preferredPublicName: d.metadata.preferredPublicName || d.metadata.artisan || 'Master Artisan',
          gender: d.metadata.gender || 'Unknown',
          birthYear: d.metadata.birthYear || 'Varies',
          role: d.metadata.role || 'Artisan',
          yearsInCraft: d.metadata.yearsInCraft || 'Varies',
          workshop: d.metadata.workshop || 'Karkhana',
          district: d.metadata.district || 'Srinagar',
          director: d.metadata.director || 'KHCRF',
          transcriptPreview: d.metadata.transcriptPreview || 'Archived transcript snippet is loaded under support request.',
          craft: d.metadata.craft || 'Pashmina',
          theme: d.metadata.theme || 'Traditional Knowledge',
          status: d.metadata.status || 'Published Record',
          hasTranscript: d.metadata.hasTranscript || 'No',
          themes: d.metadata.themes || ["Kashmir", "Audio Story"],
          recordingDate: d.metadata.recordingDate || '2026',
          interviewer: d.metadata.interviewer || 'KHCRF Field Staff',
          recorder: d.metadata.recorder || 'KHCRF Archive Team',
          translator: d.metadata.translator || 'KHCRF Linguistics Dept',
          transcriptReviewer: d.metadata.transcriptReviewer || 'Archival Board',
          consentStatus: d.metadata.consentStatus || 'Informed consent secured',
          recordingLocation: d.metadata.recordingLocation || 'Srinagar Cluster',
          publishedDuration: d.metadata.publishedDuration || d.metadata.dur || '24 Minutes',
          transcriptLanguage: d.metadata.transcriptLanguage || 'Kashmiri',
          translationLanguage: d.metadata.translationLanguage || 'English',
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
          setAllPodcasts(items);
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
  const [selectedDuration, setSelectedDuration] = useState('All Durations');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [selectedSort, setSelectedSort] = useState('Featured');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');

  const [currentPage, setCurrentPage] = useState(1);
  const [activePodcast, setActivePodcast] = useState<any>(null);
  const itemsPerPage = 6;

  // Filter logic
  const filteredPodcasts = allPodcasts.filter(h => {
    // 1. Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchText = `${h.title} ${h.subtitle || ''} ${h.desc} ${h.artisan} ${h.accessionId} ${h.director} ${h.craft} ${h.theme} ${h.district} ${h.transcriptPreview || ''}`.toLowerCase();
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
    // 4. Geography
    if (selectedLocation !== 'All Locations') {
      const dist = h.district.toLowerCase();
      const sel = selectedLocation.toLowerCase();
      if (!dist.includes(sel)) return false;
    }
    // 5. Duration
    if (selectedDuration !== 'All Durations') {
      const min = h.durationMin;
      if (selectedDuration === 'Under 15 min' && min >= 15) return false;
      if (selectedDuration === '15–30 min' && (min < 15 || min > 30)) return false;
      if (selectedDuration === '30–60 min' && (min < 30 || min > 60)) return false;
      if (selectedDuration === 'Over 60 min' && min <= 60) return false;
    }
    // 6. Recording Status
    if (selectedStatus !== 'All Statuses') {
      if (h.status !== selectedStatus) return false;
    }
    // 7. Language
    if (selectedLanguage !== 'All Languages') {
      if (!h.language.toLowerCase().includes(selectedLanguage.toLowerCase())) return false;
    }
    return true;
  });

  // Sort logic
  const sortedPodcasts = [...filteredPodcasts].sort((a, b) => {
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
    return 0;
  });

  const totalPages = Math.ceil(sortedPodcasts.length / itemsPerPage);
  const paginatedPodcasts = sortedPodcasts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePodcast(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pb-24 animate-fadeIn">
      {/* Detailed Modal Registry Sheet */}
      {activePodcast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#3E2723]/40 backdrop-blur-sm" onClick={() => setActivePodcast(null)}></div>
          <div className="relative z-10 bg-[#3E2723] border border-[#D4AF37]/50 max-w-2xl w-full p-8 md:p-10 shadow-2xl text-white max-h-[90vh] overflow-y-auto custom-scrollbar" role="dialog" aria-modal="true">
            <button onClick={() => setActivePodcast(null)} className="absolute top-4 right-4 text-white/50 hover:text-white text-lg font-mono">&times;</button>
            
            <div className="text-center mb-8">
              <span className="text-[#D4AF37] font-mono text-xs uppercase tracking-widest block mb-2">KHCRF STUDIO &bull; AUDIO ARCHIVE REGISTER</span>
              <h2 className="text-2xl md:text-3xl font-serif text-white font-bold leading-tight">{activePodcast.title}</h2>
              {activePodcast.subtitle && <p className="text-white/60 text-xs italic font-serif mt-1">{activePodcast.subtitle}</p>}
              <div className="text-[10px] text-[#D4AF37] font-mono mt-3 uppercase tracking-wider bg-white/5 inline-block px-3 py-1 border border-[#D4AF37]/20 font-mono">
                Archive record: {activePodcast.accessionId}
              </div>
            </div>

            <p className="text-[#FAF9F6]/90 text-xs leading-relaxed mb-6 font-sans border-b border-white/10 pb-6">
              {activePodcast.desc}
            </p>

            {/* Structured Columns: Speaker Info and Recording Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px] font-mono mb-6">
              {/* Speaker Information */}
              <div className="space-y-2 border-r border-white/10 pr-4">
                <h3 className="text-[#D4AF37] font-bold text-xs uppercase border-b border-white/10 pb-1 mb-2">Speaker Information</h3>
                <div><span className="text-white/40">PREFERRED NAME:</span> {activePodcast.preferredPublicName}</div>
                <div><span className="text-white/40">GENDER / BIRTH :</span> {activePodcast.gender} (b. {activePodcast.birthYear})</div>
                <div><span className="text-white/40">PRIMARY ROLE  :</span> {activePodcast.role}</div>
                <div><span className="text-white/40">CRAFT SECTOR  :</span> {activePodcast.craft}</div>
                <div><span className="text-white/40">YEARS IN CRAFT :</span> {activePodcast.yearsInCraft}</div>
                <div><span className="text-white/40">WORKSHOP CLAN :</span> {activePodcast.workshop}</div>
                <div><span className="text-white/40">LOCALITY/DIST :</span> {activePodcast.district}</div>
                <div><span className="text-white/40">CONSENT STATUS :</span> {activePodcast.consentStatus}</div>
              </div>

              {/* Recording Metadata */}
              <div className="space-y-2">
                <h3 className="text-[#D4AF37] font-bold text-xs uppercase border-b border-white/10 pb-1 mb-2">Recording Metadata</h3>
                <div><span className="text-white/40">RECORDED DATE :</span> {activePodcast.recordingDate}</div>
                <div><span className="text-white/40">INTERVIEWER   :</span> {activePodcast.interviewer}</div>
                <div><span className="text-white/40">TECHNICAL REC :</span> {activePodcast.recorder}</div>
                <div><span className="text-white/40">TRANSLATOR    :</span> {activePodcast.translator}</div>
                <div><span className="text-white/40">REVIEWER CODE :</span> {activePodcast.transcriptReviewer}</div>
                <div><span className="text-white/40">AUDIO FORMAT  :</span> {activePodcast.audioFormat}</div>
                <div><span className="text-white/40">ROOM ACOUSTICS:</span> {activePodcast.environment}</div>
                <div><span className="text-white/40">ACCESS RIGHTS :</span> {activePodcast.rightsStatus}</div>
              </div>
            </div>

            {/* Transcript Experience Snippet */}
            {activePodcast.timestampedSegment && (
              <div className="mb-6 bg-white/5 border border-white/10 p-4 font-mono text-[10px] leading-relaxed rounded-xs">
                <h4 className="text-[#D4AF37] font-bold uppercase tracking-wider mb-2 border-b border-white/10 pb-1 text-[9px] font-mono">Archival Transcript Excerpt</h4>
                <div className="whitespace-pre-line text-white/90 font-mono">
                  {activePodcast.timestampedSegment}
                </div>
              </div>
            )}

            {/* Related Research Registry Links */}
            <div className="bg-white/5 border border-white/15 p-4 mb-6 font-mono text-[9px] leading-relaxed rounded-xs space-y-1.5">
              <h4 className="text-[#D4AF37] font-bold uppercase tracking-wider border-b border-white/10 pb-1 text-[9px] mb-2 font-mono">Related Archive Registry Links</h4>
              <div><span className="text-white/40 font-mono">RELATED RESEARCH     :</span> {activePodcast.relatedResearch}</div>
              <div><span className="text-white/40 font-mono">RELATED DOCUMENTARY  :</span> {activePodcast.relatedDocumentary}</div>
              <div><span className="text-white/40 font-mono">RELATED ORAL HISTORY :</span> {activePodcast.relatedOralHistory}</div>
              <div><span className="text-white/40 font-mono">RELATED COLLECTION   :</span> {activePodcast.relatedCollection}</div>
              <div><span className="text-white/40 font-mono">RELATED COURSES      :</span> {activePodcast.relatedCourses}</div>
              <div><span className="text-white/40 font-mono">RELATED ARTICLES     :</span> {activePodcast.relatedKnowledgeArticles}</div>
            </div>

            {/* Additional parameters */}
            <div className="space-y-2 text-[10px] font-mono text-white/70 border-t border-white/10 pt-4 mb-6">
              <div><span className="text-[#D4AF37] font-bold">CITATION INFORMATION  :</span> KHCRF Audio preservation registry, Accession ID {activePodcast.accessionId}. Retrieved 2026.</div>
              <div><span className="text-[#D4AF37] font-bold">RIGHTS AND ACCESS     :</span> {activePodcast.accessConditions}</div>
            </div>

            <div className="border-t border-[#D4AF37]/30 pt-6 text-center space-y-4 font-mono">
              <p className="text-[9px] uppercase tracking-widest text-white/50 leading-relaxed font-mono">
                Sensitive personal data should only be published with explicit consent.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link href="/about/memberships" className="bg-[#D4AF37] text-[#3E2723] hover:bg-white px-6 py-3 font-bold uppercase tracking-wider text-xs transition-colors font-mono">
                  Request Full Audio Access
                </Link>
                <button onClick={() => setActivePodcast(null)} className="border border-white/20 hover:border-white text-white px-6 py-3 uppercase tracking-wider text-xs transition-colors font-light font-mono">
                  Return to Registry
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Hero section */}
      <UniversalEditorialHero pageKey="audio-stories" fallbackConfig={audioStoriesHeroFallback as any} />

      <div className="container-fluid mx-auto px-4 md:px-10 py-12 max-w-7xl animate-fadeIn">
        
        {/* Introductory Statement Block */}
        <div className="bg-[#3E2723]/5 border-l-4 border-[#3E2723] p-8 mb-12 rounded-r-xs max-w-5xl">
          <p className="text-gray-700 text-base md:text-lg leading-relaxed font-serif">
            KHCRF Audio Stories document the acoustic dimensions of craft heritage. From the rhythmic cadence of the loom and the sharp ring of the coppersmith’s hammer to dialectal oral readings of carpet talim codes, the archive preserves sound as a primary cultural record.
          </p>
          <p className="text-gray-500 text-xs mt-3 uppercase tracking-widest font-bold font-mono">
            These soundscapes, Spoken Narratives, Dialect Tapes, and Oral Translations map the acoustic heritage of Kashmir's living craft traditions.
          </p>
          
          <div className="flex flex-wrap gap-4 mt-6 font-mono text-xs">
            <a href="#results" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-5 py-2.5 font-bold uppercase tracking-wider transition-all">
              Browse Audio Archive
            </a>
            <a href="#suggest" className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-5 py-2.5 font-bold uppercase tracking-wider transition-all">
              Nominate a Soundscape Subject
            </a>
            <a href="#methodology" className="text-[#3E2723] hover:underline font-bold py-2.5">
              Read Audio Preservation Standards &rarr;
            </a>
          </div>
        </div>

        {/* Featured Audio Soundscape Section */}
        <section className="bg-white border-4 border-[#3E2723] p-8 md:p-10 mb-16 relative shadow-md">
          <div className="absolute top-0 right-0 bg-[#3E2723] text-[#D4AF37] px-4 py-1 text-[10px] font-mono font-bold uppercase tracking-widest">
            FEATURED AUDIO RECORD
          </div>
          
          <div className="max-w-4xl">
            <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold block mb-1">
              Archive Record: KHCRF-AS-2026-001
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3E2723] leading-tight mb-2">
              The Sound of the Loom
            </h2>
            <h3 className="text-base md:text-lg font-serif italic text-gray-500 mb-4">
              Acoustic Cadence of the Handloom
            </h3>
            
            <p className="text-gray-700 text-sm leading-relaxed mb-4 font-sans text-gray-600">
              An immersive audio experience capturing the rhythmic beats of the Kani loom and soft handloom tensioning adjustments inside a Srinagar home karkhana.
            </p>

            <blockquote className="border-l-4 border-[#D4AF37] pl-4 italic text-gray-650 text-sm mb-6 font-serif">
              “Each shuttle pass has a pitch. If the yarn is dry, it clicks; if it is damp, it whispers. You listen to the loom to know when a thread is about to break.”
              <span className="block text-[9px] uppercase tracking-widest font-bold text-gray-400 font-mono mt-1">&mdash; Editorial preview quotation</span>
            </blockquote>

            <div className="flex flex-wrap gap-2 mb-6">
              {["24 Minutes", "Pashmina", "Srinagar", "Recorded 2026", "Kashmiri", "Transcript Available"].map((tagText) => (
                <span key={tagText} className="bg-[#FAF9F6] border border-[#3E2723]/20 text-[#3E2723] font-mono text-[10px] uppercase font-semibold px-2.5 py-1">
                  {tagText}
                </span>
              ))}
            </div>

            <button 
              onClick={() => setActivePodcast(allPodcasts[0])}
              className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-all font-mono"
            >
              View Audio Record Summary
            </button>
          </div>
        </section>

        {/* Why Audio preservation Matters Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start mt-12">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-serif text-[#3E2723] mb-6 font-bold">Acoustic Preservation</h2>
            <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans">
              Workshops are auditory environments. The cadence of weaving, the friction of chisels on green walnut, the hum of copper basins, and the spoken talim codes hold crucial structural and cultural indicators.
            </p>
            <p className="text-gray-605 text-sm leading-relaxed font-sans">
              KHCRF maps these soundscapes to document workspace mechanics and preserve local dialects, verbal patterns, and family loom songs.
            </p>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#3E2723]/10 p-8 rounded-xs shadow-xs">
            <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 font-mono">
              Preserved Soundscapes Include
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700 font-sans">
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>weaving cadence and shuttle glide sound patterns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>verbal talim chanting code instructions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>wood-chiseling strikes and joinery friction sounds</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>coppersmith hammer rhythms at Zaina Kadal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>natural dye bubbling and water-pouring sounds</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>verbal memories, local songs and workshop dialects</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Archive Overview (Archive Preview Data Block) */}
        <section className="bg-[#3E2723] text-white p-8 md:p-10 mb-12 rounded-xs relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#3E2723] px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-widest">
            Archive Preview
          </div>
          <div className="mb-8">
            <h3 className="font-serif text-2xl text-[#D4AF37] mb-2">Acoustic Audio Registry</h3>
            <p className="text-white/60 text-xs font-mono">
              INTERNAL CORPS REGISTRY SYSTEM PREVIEW
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 text-center md:text-left">
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Sound Tapes</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">12</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Recorded Workspaces</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">15</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Craft Sectors Map</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">8</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Dialect Versions</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">3</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Recorded Hours</span>
              <span className="text-lg md:text-xl font-serif font-bold text-[#D4AF37] block leading-tight font-mono">3h 45m</span>
            </div>
            <div className="last:border-0">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Transcripts Available</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">12</span>
            </div>
          </div>
        </section>

        {/* View Switcher Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 bg-[#FAF9F6] border border-[#3E2723]/10 p-4 font-mono" id="results">
          <div className="text-xs font-serif text-[#3E2723]">
            KHCRF Registry Catalog &bull; Showing {sortedPodcasts.length} Records
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
              Archive List
            </button>
            <button 
              onClick={() => { setCurrentView('index'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'index' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Transcript Index
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
                  setSelectedLocation('All Locations');
                  setSelectedDuration('All Durations');
                  setSelectedStatus('All Statuses');
                  setSelectedLanguage('All Languages');
                  setSelectedSort('Featured');
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
                  placeholder="Search audio stories by keywords, craft, theme, locations..."
                  className="w-full border border-gray-200 px-3 py-2 text-xs rounded-none bg-[#FAF9F6] text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                />
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
                  <option value="Papier-Mâché">Papier-Mâché</option>
                  <option value="Walnut Wood">Walnut Wood</option>
                  <option value="Copperware">Copperware</option>
                  <option value="Multi-Craft">Multi-Craft</option>
                </select>
              </div>

              {/* Theme Selection */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Acoustic Theme</label>
                <select 
                  value={selectedTheme}
                  onChange={(e) => { setSelectedTheme(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Themes">All Themes</option>
                  <option value="Traditional Knowledge">Traditional Knowledge</option>
                  <option value="Workshop Life">Workshop Life</option>
                  <option value="Traditional Markets">Traditional Markets</option>
                  <option value="Ustad–Shagird Tradition">Ustad–Shagird Tradition</option>
                  <option value="Craft Lineage">Craft Lineage</option>
                  <option value="Women Artisans">Women Artisans</option>
                  <option value="Traditional Techniques">Traditional Techniques</option>
                  <option value="Sustainability">Sustainability</option>
                  <option value="Markets and Trade">Markets and Trade</option>
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
                  <option value="Published Record">Published Record</option>
                  <option value="Research in Progress">Research in Progress</option>
                  <option value="In Editorial Review">In Editorial Review</option>
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
                </select>
              </div>

            </div>
          </div>

          {/* Results Area */}
          <div className="w-full lg:w-3/4">

            {loading ? (
              <div className="py-20 text-center text-gray-500 font-serif">Loading audio records...</div>
            ) : (
              <>
                {/* 1. EDITORIAL CARDS VIEW (RESTYLED WITHOUT IMAGES IN 2-COLUMN GRID) */}
                {currentView === 'cards' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                    {paginatedPodcasts.map((h, i) => (
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
                            AUDIO STORY &bull; {h.craft.toUpperCase()}
                          </div>

                          {/* Row 3: Title */}
                          <h3 
                            onClick={() => setActivePodcast(h)}
                            className="text-2xl font-serif font-bold text-[#3E2723] leading-snug cursor-pointer group-hover:text-[#D4AF37] transition-colors"
                          >
                            {h.title}
                          </h3>

                          {/* Row 4: Subtitle */}
                          {h.subtitle && (
                            <h4 className="text-xs font-serif italic text-gray-500 mt-1 leading-snug mb-4">
                              {h.subtitle}
                            </h4>
                          )}

                          {/* Row 5: Synopsis */}
                          <p className="text-gray-707 text-xs leading-relaxed mb-6 font-sans">
                            {h.desc}
                          </p>

                          {/* Row 6: Excerpt / Quotation styled with quote marks */}
                          {h.transcriptPreview && (
                            <div className="relative pl-6 mb-6">
                              <span className="absolute left-0 top-0 text-3xl font-serif text-[#D4AF37] leading-none">“</span>
                              <p className="italic text-gray-650 text-xs font-serif leading-relaxed">
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
                              {h.status.replace(" Record", "").toUpperCase()}
                            </span>
                            
                            <button 
                              onClick={() => setActivePodcast(h)}
                              className="text-xs font-bold uppercase tracking-widest text-[#3E2723] hover:text-[#D4AF37] transition-colors font-mono"
                            >
                              Explore Audio &rarr;
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

                {/* 2. ARCHIVE LIST VIEW */}
                {currentView === 'list' && (
                  <div className="bg-white border border-[#3E2723]/10 overflow-x-auto shadow-sm animate-fadeIn">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#3E2723] text-[#D4AF37] font-mono uppercase tracking-wider text-[10px]">
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Accession ID</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Dialogue / Soundscape</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Craft Tradition</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">District / Geography</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-right font-mono">Duration</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center font-mono">Year</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center font-mono">Transcript</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#3E2723]/10 font-sans text-gray-700">
                        {paginatedPodcasts.map((h, i) => (
                          <tr key={i} className="hover:bg-[#FAF9F6] transition-colors cursor-pointer" onClick={() => setActivePodcast(h)}>
                            <td className="p-4 font-mono font-bold text-gray-500 whitespace-nowrap">{h.accessionId}</td>
                            <td className="p-4">
                              <div className="font-serif font-bold text-[#3E2723] text-sm hover:text-[#D4AF37] transition-colors">{h.title}</div>
                              <div className="text-[10px] text-gray-400 font-light truncate max-w-xs">{h.subtitle}</div>
                            </td>
                            <td className="p-4 font-medium">{h.craft}</td>
                            <td className="p-4 whitespace-nowrap">{h.district}</td>
                            <td className="p-4 text-right font-mono whitespace-nowrap">{h.dur}</td>
                            <td className="p-4 text-center font-mono">{h.year}</td>
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

                {/* 3. TRANSCRIPT INDEX VIEW */}
                {currentView === 'index' && (
                  <div className="space-y-8 font-mono text-xs animate-fadeIn font-mono">
                    {paginatedPodcasts.map((h, i) => (
                      <div key={i} className="bg-white border-2 border-[#3E2723] p-6 shadow-sm relative">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-[#3E2723] mb-4 gap-2">
                          <div>
                            <span className="bg-[#3E2723] text-white px-2 py-0.5 text-[10px] font-bold mr-3 font-mono">
                              KHCRF AUDIO ARCHIVE REGISTRY
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
                            <div><span className="text-gray-400 font-mono">TRANSCRIPT CODE     :</span> <span className="font-bold text-[#3E2723]">{h.hasTranscript === 'Yes' ? `TR-${h.accessionId.replace('KHCRF-AS-', '')}-VERIFIED` : 'ARCHIVED/FORTHCOMING'}</span></div>
                          </div>
                        </div>

                        {/* Emphasized Quotation snippet */}
                        {h.transcriptPreview && (
                          <div className="mb-4 border-l-4 border-[#3E2723] pl-4 italic text-gray-700 bg-gray-50 py-3 font-serif">
                            <span className="text-[10px] text-gray-400 font-bold block mb-1 uppercase font-mono">Audio Transcript Excerpt:</span>
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
                          <span className="text-gray-400 font-mono">KHCRF AUDIO ARCHIVE DIVISION &bull; SRINAGAR HQ</span>
                          <button onClick={() => setActivePodcast(h)} className="text-[#3949AB] hover:underline font-bold uppercase font-mono">
                            Explore Audio Record &rarr;
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
                  className="w-10 h-10 border border-gray-305 flex items-center justify-center text-gray-555 hover:border-[#3E2723] hover:text-[#3E2723] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  &rarr;
                </button>
              </div>
            )}
          </div>

        </section>

        {/* How KHCRF Audio Tapes Are Developed Section */}
        <section className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs mt-16" id="methodology">
          <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold">
            How KHCRF Audio Tapes Are Developed
          </h2>
          <p className="text-gray-605 text-sm leading-relaxed mb-8 max-w-4xl font-sans">
            Each audio story is produced through calibrated ambient field recordings, high-fidelity transcription, name checking, and ethical permissions from master artisans.
          </p>

          <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 font-mono">
            Development Stages
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-gray-700">
            <div className="border-l-2 border-[#3E2723] pl-4 py-1">
              <span className="font-mono text-[#D4AF37] font-bold block mb-1">STAGE 01</span>
              <span className="font-bold text-[#3E2723] block mb-1">Ambient Field Recording</span>
              <span className="text-gray-500 font-sans">Capturing raw soundscapes at 24-bit 96kHz master grade levels.</span>
            </div>
            <div className="border-l-2 border-[#3E2723] pl-4 py-1">
              <span className="font-mono text-[#D4AF37] font-bold block mb-1">STAGE 02</span>
              <span className="font-bold text-[#3E2723] block mb-1">Voice Alignments</span>
              <span className="text-gray-550 font-sans">Interviewing master craftsmen inside their own karkhanas.</span>
            </div>
            <div className="border-l-2 border-[#3E2723] pl-4 py-1">
              <span className="font-mono text-[#D4AF37] font-bold block mb-1">STAGE 03</span>
              <span className="font-bold text-[#3E2723] block mb-1">Digitization & Indexing</span>
              <span className="text-gray-555 font-sans">Labeling sound bites with detailed metadata accession IDs.</span>
            </div>
            <div className="border-l-2 border-[#3E2723] pl-4 py-1">
              <span className="font-mono text-[#D4AF37] font-bold block mb-1">STAGE 04</span>
              <span className="font-bold text-[#3E2723] block mb-1">Consent Clearance</span>
              <span className="text-gray-505 font-sans">Obtaining written permissions from guild and family elders.</span>
            </div>
          </div>
        </section>

        {/* Ethical Audio Preservation Principles Section */}
        <section className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs mt-12">
          <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold">
            Respecting the Acoustic Voice
          </h2>
          <p className="text-gray-655 text-sm leading-relaxed mb-8 max-w-4xl font-sans">
            The archive follows strict acoustic standards:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-xs text-gray-700 font-sans">
            {[
              "informed and documented consent",
              "accurate representation of workshop speech",
              "zero digital manipulation of vocal testimonies",
              "transparent listing of technical recorders and interviewers",
              "long-term preservation of original master reels",
              "safe storage of sensitive family lineage details"
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
              Using the Acoustic Archive
            </h2>
            <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans text-gray-500">
              The Audio archive supports:
            </p>
            <div className="flex flex-col gap-3 font-mono">
              <button 
                onClick={() => setActivePodcast(allPodcasts[0])}
                className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors text-center font-mono w-full md:w-auto"
              >
                Request Research Access
              </button>
              <a 
                href="#suggest"
                className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors text-center font-mono w-full md:w-auto block"
              >
                Recommend a Soundscape Subject
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#FAF9F6] border border-[#3E2723]/10 p-6 md:p-8 font-sans">
            <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 font-mono">
              Approved Research & Educational Uses
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4 text-xs text-gray-700 font-sans">
              <li className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>Academic research
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>Soundscape conservation studies
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>Dialectal research
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>Cultural mapping and exhibition creation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>Public museum installations
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>Artisan guild lineages tracking
              </li>
            </ul>
          </div>
        </section>

        {/* Suggest a soundscape Section */}
        <section className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs mt-12" id="suggest">
          <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold">
            Recommend a Soundscape Subject
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-6 font-sans">
            Artisans, scholars, and local residents are welcome to propose ambient workshop locations or elder artisans whose voices and tools should be recorded.
          </p>
          <div className="max-w-2xl bg-[#FAF9F6] border border-[#3E2723]/20 p-6 font-mono text-xs space-y-4">
            <div>
              <span className="text-[#3E2723] font-bold block mb-1">PROPOSAL PATHWAY</span>
              <span className="text-gray-500">To submit an audio recording proposal, please email the archive division at <strong className="text-[#3E2723]">audio@khcrf.org</strong> with a brief summary of the soundscape background.</span>
            </div>
          </div>
        </section>

        {/* Footer Statement Section */}
        <section className="border-t border-[#3E2723]/20 pt-10 text-center max-w-4xl mx-auto mt-16 font-sans">
          <blockquote className="text-gray-700 text-base md:text-lg leading-relaxed font-serif italic mb-4">
            "KHCRF Audio Stories capture the living soundscapes and oral testimonies of Kashmir's artisan workshops—preserving the acoustic heritage of craftsmanship for future generations."
          </blockquote>
          <p className="text-gray-400 text-xs font-mono uppercase tracking-widest font-bold">
            KHCRF Registry Access Console &bull; Audio Archive Registry Division
          </p>
          <p className="text-[#D4AF37] text-[10px] uppercase font-bold mt-2 tracking-widest font-mono">
            This page represents an audio preservation registry under development. Access to verified audio recordings and transcriptions is reserved for supportive members.
          </p>
        </section>

      </div>
    </main>
  );
}
