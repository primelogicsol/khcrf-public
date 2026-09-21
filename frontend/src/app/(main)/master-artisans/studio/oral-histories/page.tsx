'use client';
import { getBaseUrlNoApi } from "@/lib/api";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { oralHistoriesHeroFallback } from '@/config/heroFallbacks';

export default function OralHistories() {
  const [allHistories, setAllHistories] = useState<any[]>([
    {
      slug: "passing-needle",
      title: "Passing the Needle",
      subtitle: "Intergenerational Learning in Sozni Embroidery",
      dur: "16 Minutes",
      durationMin: 16,
      tag: "Sozni Embroidery",
      img: "/assets/images/passing_the_needle.jpg",
      desc: "A mother and daughter discuss how Sozni embroidery was taught inside the home through observation, repetition, patience, and correction. The record examines women’s role in transmitting embroidery knowledge across generations.",
      accessionId: "KHCRF-OH-2026-001",
      year: "2026",
      language: "Kashmiri",
      subtitles: "English Transcript Planned",
      artisan: "Bashir Ahmad & family",
      preferredPublicName: "Mubeena Begum & Safeena Jan",
      gender: "Female",
      birthYear: "1968 / 2004",
      role: "Embroidery Artisans",
      yearsInCraft: "38 Years / 8 Years",
      workshop: "Domestic Home Karkhana",
      director: "Tariq Qadri",
      transcriptPreview: "Before I learned the design, I learned how to hold the cloth without disturbing it.",
      craft: "Sozni Embroidery",
      theme: "Women Artisans",
      speakerType: "Woman Artisan",
      status: "Oral History Concept",
      hasTranscript: "Yes",
      themes: ["Women Artisans", "Sozni", "Family Lineage", "Home-Based Work", "Intergenerational Learning", "Invisible Labour"],
      district: "Srinagar",
      recordingDate: "February 12, 2026",
      interviewer: "Sajad Dar",
      recorder: "Farooq Mir",
      translator: "Tariq Qadri",
      transcriptReviewer: "Dr. Z. A. Shah",
      consentStatus: "Ethical Consent Obtained for Archival Summary",
      recordingLocation: "Zaina Kadal District",
      publishedDuration: "16 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "Linear PCM 24-bit 96kHz",
      audioQuality: "Master Grade",
      environment: "Domestic interior, light morning background ambience (street sounds)",
      rightsStatus: "Copyright KHCRF 2026. Academic use allowed.",
      accessConditions: "Restricted to supportive research members. Summary publicly queryable.",
      timestampedSegment: "00:04:18 — Speaker:\nMy mother did not call it teaching. She would complete one section, leave the next part unfinished, and ask me to continue from memory."
    },
    {
      slug: "craft-through-conflict",
      title: "Craft Through Conflict",
      subtitle: "Workshop Continuity During Instability and Economic Disruption",
      dur: "24 Minutes",
      durationMin: 24,
      tag: "Multi-Craft",
      img: "/assets/images/studio_demo_conflict.jpg",
      desc: "Artisans and workshop owners describe the difficulty of sustaining production during periods of instability, market closure, disrupted mobility, weakened demand, and interrupted supply chains. The record focuses on resilience, adaptation, and the determination to keep workshops and skills alive.",
      accessionId: "KHCRF-OH-2026-002",
      year: "2026",
      language: "Kashmiri and Urdu",
      subtitles: "Yes",
      artisan: "Downtown Woodcarvers Guild",
      preferredPublicName: "Ustad Ghulam Hassan & Guild",
      gender: "Male",
      birthYear: "1955",
      role: "Workshop Owner / Master Carver",
      yearsInCraft: "52 Years",
      workshop: "Hassan Woodcarving Karkhana",
      director: "KHCRF Editorial",
      transcriptPreview: "The workshop closed many times, but the craft never left our hands.",
      craft: "Walnut Wood Carving",
      theme: "Conflict and Resilience",
      speakerType: "Workshop Owner",
      status: "Documentation Planned",
      hasTranscript: "Yes",
      themes: ["Resilience", "Workshop Closures", "Livelihoods", "Conflict", "Supply Chains", "Cultural Continuity"],
      district: "Kashmir Valley",
      recordingDate: "January 28, 2026",
      interviewer: "Farooq Mir",
      recorder: "Aamir Bhat",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. S. Qadri",
      consentStatus: "Pending final speaker verification review",
      recordingLocation: "Safa Kadal, Srinagar",
      publishedDuration: "24 Minutes",
      transcriptLanguage: "Kashmiri / Urdu",
      translationLanguage: "English",
      audioFormat: "FLAC 16-bit 48kHz",
      audioQuality: "Broadcast Standard",
      environment: "Active workshop interior, distant traffic",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Documentation planned. Full recording restricted.",
      timestampedSegment: "00:08:12 — Speaker:\nThe workshop closed many times, but the craft never left our hands. Even in the dark, the hand knows the depth of the walnut grain."
    },
    {
      slug: "life-in-papier-mache",
      title: "A Life in Papier-Mâché",
      subtitle: "Memory, Motif, and the Inner Vision of a Master Painter",
      dur: "21 Minutes",
      durationMin: 21,
      tag: "Papier-Mâché",
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop",
      desc: "A senior papier-mâché painter reflects on a lifetime of drawing, colour preparation, motif composition, and workshop learning. Having lost much of his eyesight, he describes how patterns remain preserved in memory.",
      accessionId: "KHCRF-OH-2026-003",
      year: "2026",
      language: "Urdu and Kashmiri",
      subtitles: "Yes",
      artisan: "Habibullah",
      preferredPublicName: "Ustad Habibullah Naqash",
      gender: "Male",
      birthYear: "1948",
      role: "Master Naqash",
      yearsInCraft: "60 Years",
      workshop: "Habibullah Atelier, Eidgah",
      director: "Zehra Malik",
      transcriptPreview: "I may no longer see every flower, but I still know where every curve must turn.",
      craft: "Papier-Mâché",
      theme: "Childhood and Learning",
      speakerType: "Master Artisan",
      status: "Oral History Concept",
      hasTranscript: "Yes",
      themes: ["Papier-Mâché", "Naqashi", "Master Artisan", "Memory", "Motifs", "Disability and Craft"],
      district: "Srinagar",
      recordingDate: "March 11, 2026",
      interviewer: "Zehra Malik",
      recorder: "Sajad Dar",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Prof. F. Ahmad",
      consentStatus: "Consent given for summary and selected quotes publication",
      recordingLocation: "Eidgah, Srinagar",
      publishedDuration: "21 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English / Urdu",
      audioFormat: "WAV 24-bit 48kHz",
      audioQuality: "Studio Grade",
      environment: "Atelier interior, rain sounds on wood roof",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Academic use only. Sound reel accessible on site.",
      timestampedSegment: "00:11:34 — Speaker:\nI may no longer see every flower, but I still know where every curve must turn. The hand does not need eyes to find the center."
    },
    {
      slug: "story-every-pattern",
      title: "The Story Behind Every Pattern",
      subtitle: "Floral, Bird, and Geometric Symbolism in Kashmir’s Decorative Arts",
      dur: "19 Minutes",
      durationMin: 19,
      tag: "Multi-Craft",
      img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop",
      desc: "Artisans and design practitioners discuss the meaning, naming, adaptation, and transmission of floral, bird, vine, medallion, and geometric patterns across Kashmir’s decorative crafts.",
      accessionId: "KHCRF-OH-2026-004",
      year: "2026",
      language: "Kashmiri and Urdu",
      subtitles: "Yes",
      artisan: "Fayaz Ahmad",
      preferredPublicName: "Fayaz Ahmad Mir",
      gender: "Male",
      birthYear: "1969",
      role: "Senior Pattern Designer",
      yearsInCraft: "35 Years",
      workshop: "Mir Design Bureau, Pampore",
      director: "KHCRF Editorial",
      transcriptPreview: "A motif was never simply decoration; it carried memory, place, and recognition.",
      craft: "Papier-Mâché",
      theme: "Symbolism and Motifs",
      speakerType: "Senior Artisan",
      status: "Research in Preparation",
      hasTranscript: "Yes",
      themes: ["Motifs", "Symbolism", "Design Vocabulary", "Cultural Meaning", "Pattern Transmission", "Decorative Arts"],
      district: "Srinagar",
      recordingDate: "April 02, 2026",
      interviewer: "Tariq Qadri",
      recorder: "Farooq Mir",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. H. Mir",
      consentStatus: "Consented to database register mapping",
      recordingLocation: "Zaina Kadal Registry Office",
      publishedDuration: "19 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "WAV 24-bit 96kHz",
      audioQuality: "Broadcast Grade",
      environment: "Silent record room",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "In preparation. Register file publicly visible.",
      timestampedSegment: "00:03:52 — Speaker:\nA motif was never simply decoration; it carried memory, place, and recognition. The gul-i-hazara tells the story of a thousand springs."
    },
    {
      slug: "learning-without-schools",
      title: "Learning Without Schools",
      subtitle: "The Ustad–Shagird Tradition of Craft Education",
      dur: "17 Minutes",
      durationMin: 17,
      tag: "Multi-Craft",
      img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop",
      desc: "Masters and former apprentices explain how craft knowledge was transmitted outside formal institutions through observation, discipline, repetition, responsibility, and long-term workshop relationships.",
      accessionId: "KHCRF-OH-2026-005",
      year: "2026",
      language: "Kashmiri and Urdu",
      subtitles: "Yes",
      artisan: "Ustad Apprentice Guilds",
      preferredPublicName: "Ustad Mohammad Amin & Guild",
      gender: "Male / Female Clusters",
      birthYear: "1960 onwards",
      role: "Workshop Master / Apprentices",
      yearsInCraft: "Varies",
      workshop: "Downtown Srinagar Woodshops",
      director: "Mehran Qazi",
      transcriptPreview: "The ustad first taught us patience; the technique came later.",
      craft: "Walnut Wood Carving",
      theme: "Ustad–Shagird Tradition",
      speakerType: "Apprentice",
      status: "Documentation Planned",
      hasTranscript: "Yes",
      themes: ["Ustad–Shagird", "Apprenticeship", "Informal Education", "Workshop Discipline", "Skill Transmission", "Youth"],
      district: "Srinagar and Budgam",
      recordingDate: "May 10, 2026",
      interviewer: "Mehran Qazi",
      recorder: "Sajad Dar",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. S. Farooq",
      consentStatus: "Ethical Consent Obtained for Archival Summary",
      recordingLocation: "Zaina Kadal, Srinagar",
      publishedDuration: "17 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "FLAC 16-bit 48kHz",
      audioQuality: "Broadcast Standard",
      environment: "Active workshop interior, hammer and chisel sounds",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Restricted academic release under review.",
      timestampedSegment: "00:05:44 — Speaker:\nThe ustad first taught us patience; the technique came later. You must learn the weight of the steel before you shape the wood."
    },
    {
      slug: "our-village-craft",
      title: "Our Village, Our Craft",
      subtitle: "Collective Memory of Wool Spinning and Namda Production",
      dur: "14 Minutes",
      durationMin: 14,
      tag: "Namda and Wool Processing",
      img: "https://images.unsplash.com/photo-1473163928189-364b2c4e1135?w=600&auto=format&fit=crop",
      desc: "Residents of a craft-producing village recall how different households participated in wool cleaning, spinning, felting, washing, drying, and decoration, creating a shared rural production system.",
      accessionId: "KHCRF-OH-2026-006",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Rural Felting Guild",
      preferredPublicName: "Felting Cooperative Members",
      gender: "Male / Female Co-op",
      birthYear: "Various",
      role: "Cooperative Members",
      yearsInCraft: "Combined 150+ Years",
      workshop: "Anantnag Village Cluster",
      director: "Sana Shah",
      transcriptPreview: "No single household completed the work; the village completed it together.",
      craft: "Namda",
      theme: "Rural Craft Identity",
      speakerType: "Cooperative Member",
      status: "Community Documentation Planned",
      hasTranscript: "Yes",
      themes: ["Namda", "Rural Craft Identity", "Community Production", "Wool", "Village Economy", "Shared Knowledge"],
      district: "Anantnag",
      recordingDate: "June 04, 2026",
      interviewer: "Sana Shah",
      recorder: "Aamir Bhat",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. M. Amin",
      consentStatus: "Cooperative consensus consent signed",
      recordingLocation: "Anantnag Guild Hall",
      publishedDuration: "14 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "Linear PCM 24-bit 48kHz",
      audioQuality: "Field Archive Standard",
      environment: "Village square, sound of flowing stream nearby",
      rightsStatus: "Copyright KHCRF 2026. Cooperative ownership shared.",
      accessConditions: "Open summary database view.",
      timestampedSegment: "00:02:18 — Speaker:\nNo single household completed the work; the village completed it together. One cleaned, one spun, one felted, and the whole street washed."
    },
    {
      slug: "forty-winters",
      title: "Forty Winters at the Loom",
      subtitle: "A Carpet Master’s Lifetime of Knotting, Talim, and Workshop Memory",
      dur: "30 Minutes",
      durationMin: 30,
      tag: "Hand-Knotted Carpet",
      img: "/assets/images/studio_demo_forty_winters.jpg",
      desc: "A senior carpet artisan reflects on decades spent reading talim, tying knots, working alongside apprentices, and responding to changes in wages, designs, materials, and workshop culture.",
      accessionId: "KHCRF-OH-2026-007",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Ghulam Hassan",
      preferredPublicName: "Master Ghulam Hassan Bhat",
      gender: "Male",
      birthYear: "1951",
      role: "Master Carpet Weaver",
      yearsInCraft: "61 Years",
      workshop: "Bhat Karkhana, Zaina Kadal",
      director: "Bilal Jan",
      transcriptPreview: "Every winter passed differently, but the loom waited in the same place.",
      craft: "Hand-Knotted Carpet",
      theme: "Workshop Life",
      speakerType: "Master Artisan",
      status: "Featured Concept",
      hasTranscript: "Yes",
      themes: ["Carpet Weaving", "Talim", "Master Artisan", "Workshop Life", "Labour", "Lifetime Practice"],
      district: "Srinagar",
      recordingDate: "July 15, 2026",
      interviewer: "Bilal Jan",
      recorder: "Sajad Dar",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. K. A. Mir",
      consentStatus: "Informed consent verified by speaker",
      recordingLocation: "Bhat Karkhana, Srinagar",
      publishedDuration: "30 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "WAV 24-bit 96kHz",
      audioQuality: "Broadcast Grade",
      environment: "Active loom room, soft rhythmic thread tapping",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Featured concept summary. Academic reel reserved.",
      timestampedSegment: "00:09:42 — Speaker:\nEvery winter passed differently, but the loom waited in the same place. The talim card grows soft, but the design never changes in my head."
    },
    {
      slug: "before-tourism-changed",
      title: "Before Tourism Changed Kashmir",
      subtitle: "Local Markets, Household Demand, and the Memory of Traditional Patronage",
      dur: "25 Minutes",
      durationMin: 25,
      tag: "Walnut Wood Carving",
      img: "/assets/images/studio_demo_before_tourism.jpg",
      desc: "Senior artisans and traders recall a period when local households, regional elites, religious institutions, and royal or institutional patrons played a stronger role in shaping craft demand and design.",
      accessionId: "KHCRF-OH-2026-008",
      year: "2026",
      language: "Kashmiri and Urdu",
      subtitles: "Yes",
      artisan: "Tariq Ahmad",
      preferredPublicName: "Tariq Ahmad Dar",
      gender: "Male",
      birthYear: "1953",
      role: "Senior Carver & Heritage Merchant",
      yearsInCraft: "49 Years",
      workshop: "Dar Carvings, Safa Kadal",
      director: "Zehra Malik",
      transcriptPreview: "We made for homes, ceremonies, and seasons before we began making for visitors.",
      craft: "Walnut Wood Carving",
      theme: "Traditional Markets",
      speakerType: "Senior Artisan",
      status: "Research in Preparation",
      hasTranscript: "Yes",
      themes: ["Traditional Markets", "Patronage", "Local Consumption", "Craft Design", "Trade History", "Market Change"],
      district: "Srinagar",
      recordingDate: "August 22, 2026",
      interviewer: "Zehra Malik",
      recorder: "Farooq Mir",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. S. Shah",
      consentStatus: "Consent signed for historical database research",
      recordingLocation: "Safa Kadal, Srinagar",
      publishedDuration: "25 Minutes",
      transcriptLanguage: "Kashmiri / Urdu",
      translationLanguage: "English",
      audioFormat: "WAV 24-bit 48kHz",
      audioQuality: "Archival Standard",
      environment: "Quiet courtyard, birds chirping",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Academic research access under review.",
      timestampedSegment: "00:07:22 — Speaker:\nWe made for homes, ceremonies, and seasons before we began making for visitors. A carved chest was a daughter's dowry, expected to live for three lifetimes."
    },
    {
      slug: "women-preserved-craft",
      title: "Women Who Preserved the Craft",
      subtitle: "The Unrecorded Labour Behind Kashmir’s Craft Production",
      dur: "22 Minutes",
      durationMin: 22,
      tag: "Pashmina",
      img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop",
      desc: "Women describe their contributions to spinning, cleaning, sorting, embroidery, painting, finishing, household production, and the transmission of craft knowledge—work frequently excluded from formal economic records.",
      accessionId: "KHCRF-OH-2026-009",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Sobia Jan",
      preferredPublicName: "Sobia Jan & spinners cluster",
      gender: "Female",
      birthYear: "1972",
      role: "Master Spinner Guild Leader",
      yearsInCraft: "30 Years",
      workshop: "Domestic Spinners Cooperative",
      director: "Sajad Dar",
      transcriptPreview: "The finished object carried many hands, but only a few names were ever remembered.",
      craft: "Pashmina",
      theme: "Women Artisans",
      speakerType: "Woman Artisan",
      status: "Interview Planning",
      hasTranscript: "Yes",
      themes: ["Women Artisans", "Home-Based Labour", "Spinning", "Embroidery", "Family Economy", "Hidden Production"],
      district: "Kashmir Valley",
      recordingDate: "September 05, 2026",
      interviewer: "Sajad Dar",
      recorder: "Aamir Bhat",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. N. Jan",
      consentStatus: "Pending group confirmation consensus",
      recordingLocation: "Eidgah Domestic Cluster, Srinagar",
      publishedDuration: "22 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "FLAC 16-bit 48kHz",
      audioQuality: "Broadcast Standard",
      environment: "Domestic workspace, kitchen sounds in background",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Planning phase. Interview scheduled for late 2026.",
      timestampedSegment: "00:04:32 — Speaker:\nThe finished object carried many hands, but only a few names were ever remembered. The wheel turns at night when the child is sleeping."
    },
    {
      slug: "lessons-grandfather",
      title: "Lessons from My Grandfather",
      subtitle: "Family Lineage and the Oral Transmission of Design Knowledge",
      dur: "20 Minutes",
      durationMin: 20,
      tag: "Kani Shawl",
      img: "/assets/images/studio_demo_lessons_grandfather.jpg",
      desc: "An artisan reflects on learning from his grandfather through stories, repeated demonstrations, workshop discipline, motif names, and correction. The record explores how family relationships shaped professional identity.",
      accessionId: "KHCRF-OH-2026-010",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Mustafa Loom",
      preferredPublicName: "Mustafa Loom & lineage weavers",
      gender: "Male",
      birthYear: "1988",
      role: "Weaver / Design Transcriber",
      yearsInCraft: "22 Years",
      workshop: "Mustafa Weavers, Budgam",
      director: "Fahad Malik",
      transcriptPreview: "He never drew the entire pattern for me; he expected me to remember the missing part.",
      craft: "Kani Shawl",
      theme: "Craft Lineage",
      speakerType: "Family Member",
      status: "Oral History Concept",
      hasTranscript: "Yes",
      themes: ["Family Lineage", "Grandparental Knowledge", "Design Transmission", "Apprenticeship", "Memory", "Craft Identity"],
      district: "Budgam",
      recordingDate: "October 18, 2026",
      interviewer: "Fahad Malik",
      recorder: "Farooq Mir",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. G. N. Bhat",
      consentStatus: "Consent verified for academic registry index",
      recordingLocation: "Kanihama, Budgam",
      publishedDuration: "20 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "WAV 24-bit 96kHz",
      audioQuality: "Broadcast Grade",
      environment: "Loom room, rhythmic shuttle movement",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Academic summary access allowed.",
      timestampedSegment: "00:06:14 — Speaker:\nHe never drew the entire pattern for me; he expected me to remember the missing part. He said the mind must weave the thread before the hand touches the loom."
    },
    {
      slug: "my-first-loom",
      title: "My First Loom",
      subtitle: "Childhood, Apprenticeship, and the Beginning of a Weaver’s Life",
      dur: "18 Minutes",
      durationMin: 18,
      tag: "Pashmina",
      img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&auto=format&fit=crop",
      desc: "An elder weaver recalls entering a workshop as a child, learning to sit at the loom, observing senior artisans, making early mistakes, and gradually developing confidence and responsibility.",
      accessionId: "KHCRF-OH-2026-011",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Master Ali Mohammad",
      preferredPublicName: "Ali Mohammad Bhat",
      gender: "Male",
      birthYear: "1945",
      role: "Weaving Master / Cooperative Leader",
      yearsInCraft: "66 Years",
      workshop: "Bhat Looms, Ganderbal",
      director: "Aamir Bhat",
      transcriptPreview: "The loom looked larger than the room when I first sat before it.",
      craft: "Pashmina",
      theme: "Childhood and Learning",
      speakerType: "Apprentice",
      status: "Documentation Planned",
      hasTranscript: "Yes",
      themes: ["Childhood", "First Apprenticeship", "Weaving", "Workshop Memory", "Learning"],
      district: "Ganderbal",
      recordingDate: "November 12, 2026",
      interviewer: "Aamir Bhat",
      recorder: "Sajad Dar",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. K. Mir",
      consentStatus: "Consent pending final review with Ganderbal guild representatives",
      recordingLocation: "Ganderbal Weaving Center",
      publishedDuration: "18 Minutes",
      transcriptLanguage: "Kashmiri",
      translationLanguage: "English",
      audioFormat: "FLAC 16-bit 48kHz",
      audioQuality: "Field Quality Standard",
      environment: "Active cooperative loom workshop",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Documentation planned. Target interview scheduling pending.",
      timestampedSegment: "00:02:44 — Speaker:\nThe loom looked larger than the room when I first sat before it. My feet could not reach the treadles, but I wanted to make the threads dance."
    },
    {
      slug: "memories-old-bazaars",
      title: "Memories of the Old Srinagar Bazaars",
      subtitle: "Trade, Bargaining, Community, and Craft Life in Historic Markets",
      dur: "15 Minutes",
      durationMin: 15,
      tag: "Copperware",
      img: "/assets/images/studio_demo_old_bazaars.jpg",
      desc: "Senior artisans and traders remember historic markets as places of production, negotiation, social interaction, reputation, apprenticeship, and long-term relationships between makers and buyers.",
      accessionId: "KHCRF-OH-2026-012",
      year: "2026",
      language: "Kashmiri and Urdu",
      subtitles: "Yes",
      artisan: "Ustad Ghulam Nabi",
      preferredPublicName: "Ustad Ghulam Nabi Zargar",
      gender: "Male",
      birthYear: "1949",
      role: "Master Coppersmith",
      yearsInCraft: "55 Years",
      workshop: "Nabi Coppers, Zaina Kadal",
      director: "Farooq Mir",
      transcriptPreview: "A shop was not only a place of sale; it was where news, trust, and reputation travelled.",
      craft: "Copperware",
      theme: "Traditional Markets",
      speakerType: "Senior Artisan",
      status: "Research in Preparation",
      hasTranscript: "Yes",
      themes: ["Old Srinagar", "Bazaars", "Trade", "Artisan Communities", "Market Memory", "Urban Heritage"],
      district: "Old Srinagar",
      recordingDate: "December 04, 2026",
      interviewer: "Farooq Mir",
      recorder: "Sajad Dar",
      translator: "KHCRF Editorial",
      transcriptReviewer: "Dr. S. A. Shah",
      consentStatus: "Informed consent verified by merchant guild",
      recordingLocation: "Zaina Kadal Market Bazaar",
      publishedDuration: "15 Minutes",
      transcriptLanguage: "Kashmiri / Urdu",
      translationLanguage: "English",
      audioFormat: "WAV 24-bit 96kHz",
      audioQuality: "Broadcast Grade",
      environment: "Bazaar front shop, sound of copper hammering and voices",
      rightsStatus: "Copyright KHCRF 2026.",
      accessConditions: "Research in preparation. Catalog sheet publicly readable.",
      timestampedSegment: "00:03:18 — Speaker:\nA shop was not only a place of sale; it was where news, trust, and reputation travelled. We sat cross-legged on white sheets, drinking tea with the buyer."
    }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
const API_BASE_URL = getBaseUrlNoApi();
    fetch(`${API_BASE_URL}/api/v1/knowledge?entityType=KNOWLEDGE_OBJECT&take=100`).catch(() => ({ ok: false, json: () => Promise.resolve([]) }))
      .then(res => { if (!res.ok) return []; return res.json(); })
      .then(data => {
        const items = (Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : [])).filter((d: any) => d.metadata?.kind === 'STUDIO_MEDIA' && d.metadata?.type === 'Oral History').map((d: any) => ({
          title: d.title,
          subtitle: d.metadata.subtitle || d.title,
          dur: d.metadata.dur || '20 Minutes',
          durationMin: d.metadata.durationMin || 20,
          tag: d.metadata.tag || 'Featured Oral History',
          img: d.metadata.img || '/assets/images/studio/oral/oral_1.jpg',
          desc: d.summary || d.metadata.desc,
          slug: d.slug,
          accessionId: d.metadata.accessionId || `KHCRF-OH-2026-${d.slug.toUpperCase()}`,
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
          theme: d.metadata.theme || 'Artisan Life',
          status: d.metadata.status || 'Published Record',
          hasTranscript: d.metadata.hasTranscript || 'No',
          themes: d.metadata.themes || ["Kashmir", "Oral History"],
          recordingDate: d.metadata.recordingDate || '2026',
          interviewer: d.metadata.interviewer || 'KHCRF Field Staff',
          recorder: d.metadata.recorder || 'KHCRF Archive Team',
          translator: d.metadata.translator || 'KHCRF Linguistics Dept',
          transcriptReviewer: d.metadata.transcriptReviewer || 'Archival Board',
          consentStatus: d.metadata.consentStatus || 'Informed consent secured',
          recordingLocation: d.metadata.recordingLocation || 'Srinagar Cluster',
          publishedDuration: d.metadata.publishedDuration || d.metadata.dur || '20 Minutes',
          transcriptLanguage: d.metadata.transcriptLanguage || 'Kashmiri',
          translationLanguage: d.metadata.translationLanguage || 'English',
          audioFormat: d.metadata.audioFormat || 'Linear PCM WAV',
          audioQuality: d.metadata.audioQuality || 'Broadcast Quality',
          environment: d.metadata.environment || 'Indoor karkhana studio setting',
          rightsStatus: d.metadata.rightsStatus || 'Copyright KHCRF 2026.',
          accessConditions: d.metadata.accessConditions || 'Restricted to support members.',
          timestampedSegment: d.metadata.timestampedSegment || '00:00:00 — Recording initialized.'
        }));
        if (items.length > 0) {
          setAllHistories(items);
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
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedDuration, setSelectedDuration] = useState('All Durations');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [selectedSort, setSelectedSort] = useState('Featured');
  const [selectedSpeakerType, setSelectedSpeakerType] = useState('All Speakers');

  const [currentPage, setCurrentPage] = useState(1);
  const [activeHistory, setActiveHistory] = useState<any>(null);
  const itemsPerPage = 6;

  // Nomination form state
  const [nominationSubmitted, setNominationSubmitted] = useState(false);
  const [nominee, setNominee] = useState({
    speaker: '',
    craft: 'Pashmina',
    village: '',
    district: 'Srinagar',
    reason: '',
    language: 'Kashmiri',
    lineage: '',
    importance: '',
    contact: '',
    consent: false
  });

  const handleNominate = (e: React.FormEvent) => {
    e.preventDefault();
    setNominationSubmitted(true);
    setTimeout(() => {
      setNominationSubmitted(false);
      setNominee({
        speaker: '',
        craft: 'Pashmina',
        village: '',
        district: 'Srinagar',
        reason: '',
        language: 'Kashmiri',
        lineage: '',
        importance: '',
        contact: '',
        consent: false
      });
    }, 5000);
  };

  // Filter logic
  const filteredHistories = allHistories.filter(h => {
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
    // 5. Speaker Type
    if (selectedSpeakerType !== 'All Speakers') {
      if (h.speakerType !== selectedSpeakerType) return false;
    }
    // 6. Duration
    if (selectedDuration !== 'All Durations') {
      const min = h.durationMin;
      if (selectedDuration === 'Under 15 Minutes' && min >= 15) return false;
      if (selectedDuration === '15–20 Minutes' && (min < 15 || min > 20)) return false;
      if (selectedDuration === '20–30 Minutes' && (min < 20 || min > 30)) return false;
      if (selectedDuration === 'Over 30 Minutes' && min <= 30) return false;
    }
    // 7. Recording Status
    if (selectedStatus !== 'All Statuses') {
      if (selectedStatus === 'Transcript Available') {
        if (h.hasTranscript !== 'Yes') return false;
      } else if (h.status !== selectedStatus) {
        return false;
      }
    }
    // 8. Language
    if (selectedLanguage !== 'All Languages') {
      if (selectedLanguage === 'English Transcript Available' || selectedLanguage === 'English Translation Available') {
        if (h.subtitles !== 'Yes' && !h.subtitles.includes("English")) return false;
      } else if (!h.language.toLowerCase().includes(selectedLanguage.toLowerCase())) {
        return false;
      }
    }
    return true;
  });

  // Sort logic
  const sortedHistories = [...filteredHistories].sort((a, b) => {
    if (selectedSort === 'Newest Recorded') {
      return parseInt(b.year) - parseInt(a.year);
    }
    if (selectedSort === 'Oldest Recorded') {
      return parseInt(a.year) - parseInt(b.year);
    }
    if (selectedSort === 'Duration') {
      return b.durationMin - a.durationMin;
    }
    if (selectedSort === 'A–Z') {
      return a.title.localeCompare(b.title);
    }
    if (selectedSort === 'Speaker Name') {
      return a.artisan.localeCompare(b.artisan);
    }
    if (selectedSort === 'Craft Tradition') {
      return a.craft.localeCompare(b.craft);
    }
    if (selectedSort === 'District') {
      return a.district.localeCompare(b.district);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedHistories.length / itemsPerPage);
  const paginatedHistories = sortedHistories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveHistory(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pb-24 animate-fadeIn">
      {/* Detailed Modal Registry Sheet */}
      {activeHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#3E2723]/40 backdrop-blur-sm" onClick={() => setActiveHistory(null)}></div>
          <div className="relative z-10 bg-[#3E2723] border border-[#D4AF37]/50 max-w-2xl w-full p-8 md:p-10 shadow-2xl text-white max-h-[90vh] overflow-y-auto custom-scrollbar" role="dialog" aria-modal="true">
            <button onClick={() => setActiveHistory(null)} className="absolute top-4 right-4 text-white/50 hover:text-white text-lg font-mono">&times;</button>
            
            <div className="text-center mb-8">
              <span className="text-[#D4AF37] font-mono text-xs uppercase tracking-widest block mb-2">KHCRF LIVING MEMORY ARCHIVE REGISTER</span>
              <h2 className="text-2xl md:text-3xl font-serif text-white font-bold leading-tight">{activeHistory.title}</h2>
              {activeHistory.subtitle && <p className="text-white/60 text-xs italic font-serif mt-1">{activeHistory.subtitle}</p>}
              <div className="text-[10px] text-[#D4AF37] font-mono mt-3 uppercase tracking-wider bg-white/5 inline-block px-3 py-1 border border-[#D4AF37]/20">
                Archive record: {activeHistory.accessionId}
              </div>
            </div>

            <p className="text-[#FAF9F6]/90 text-xs leading-relaxed mb-6 font-sans border-b border-white/10 pb-6">
              {activeHistory.desc}
            </p>

            {/* Structured Columns: Speaker Info and Recording Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px] font-mono mb-6">
              {/* Speaker Information */}
              <div className="space-y-2 border-r border-white/10 pr-4">
                <h3 className="text-[#D4AF37] font-bold text-xs uppercase border-b border-white/10 pb-1 mb-2">Speaker Information</h3>
                <div><span className="text-white/40">PREFERRED NAME:</span> {activeHistory.preferredPublicName}</div>
                <div><span className="text-white/40">GENDER / BIRTH :</span> {activeHistory.gender} (b. {activeHistory.birthYear})</div>
                <div><span className="text-white/40">PRIMARY ROLE  :</span> {activeHistory.role}</div>
                <div><span className="text-white/40">CRAFT SECTOR  :</span> {activeHistory.craft}</div>
                <div><span className="text-white/40">YEARS IN CRAFT :</span> {activeHistory.yearsInCraft}</div>
                <div><span className="text-white/40">WORKSHOP CLAN :</span> {activeHistory.workshop}</div>
                <div><span className="text-white/40">LOCALITY/DIST :</span> {activeHistory.district}</div>
                <div><span className="text-white/40">CONSENT STATUS :</span> {activeHistory.consentStatus}</div>
              </div>

              {/* Recording Metadata */}
              <div className="space-y-2">
                <h3 className="text-[#D4AF37] font-bold text-xs uppercase border-b border-white/10 pb-1 mb-2">Recording Metadata</h3>
                <div><span className="text-white/40">RECORDED DATE :</span> {activeHistory.recordingDate}</div>
                <div><span className="text-white/40">INTERVIEWER   :</span> {activeHistory.interviewer}</div>
                <div><span className="text-white/40">TECHNICAL REC :</span> {activeHistory.recorder}</div>
                <div><span className="text-white/40">TRANSLATOR    :</span> {activeHistory.translator}</div>
                <div><span className="text-white/40">REVIEWER CODE :</span> {activeHistory.transcriptReviewer}</div>
                <div><span className="text-white/40">AUDIO FORMAT  :</span> {activeHistory.audioFormat}</div>
                <div><span className="text-white/40">ROOM ACOUSTICS:</span> {activeHistory.environment}</div>
                <div><span className="text-white/40">ACCESS RIGHTS :</span> {activeHistory.rightsStatus}</div>
              </div>
            </div>

            {/* Transcript Experience Snippet */}
            {activeHistory.timestampedSegment && (
              <div className="mb-6 bg-white/5 border border-white/10 p-4 font-mono text-[10px] leading-relaxed rounded-xs">
                <h4 className="text-[#D4AF37] font-bold uppercase tracking-wider mb-2 border-b border-white/10 pb-1 text-[9px]">Archival Transcript Excerpt</h4>
                <div className="whitespace-pre-line text-white/90">
                  {activeHistory.timestampedSegment}
                </div>
              </div>
            )}

            {/* Additional parameters */}
            <div className="space-y-2 text-[10px] font-mono text-white/70 border-t border-white/10 pt-4 mb-6">
              <div><span className="text-[#D4AF37] font-bold">RELATED CRAFT KNOWLEDGE:</span> Kashmir Valley regional database mapping index #{activeHistory.craft.replace(" ", "_")}</div>
              <div><span className="text-[#D4AF37] font-bold">CITATION INFORMATION    :</span> KHCRF Oral Histories Registry, Accession ID {activeHistory.accessionId}. Retrieved 2026.</div>
              <div><span className="text-[#D4AF37] font-bold">RIGHTS AND ACCESS       :</span> {activeHistory.accessConditions}</div>
            </div>

            <div className="border-t border-[#D4AF37]/30 pt-6 text-center space-y-4">
              <p className="text-[9px] uppercase tracking-widest text-white/50 leading-relaxed font-mono">
                Sensitive personal data should only be published with explicit consent.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link href="/about/memberships" className="bg-[#D4AF37] text-[#3E2723] hover:bg-white px-6 py-3 font-bold uppercase tracking-wider text-xs transition-colors font-mono">
                  Request Full Reel Access
                </Link>
                <button onClick={() => setActiveHistory(null)} className="border border-white/20 hover:border-white text-white px-6 py-3 uppercase tracking-wider text-xs transition-colors font-light font-mono">
                  Return to Registry
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Hero section */}
      <UniversalEditorialHero pageKey="oral-histories" fallbackConfig={oralHistoriesHeroFallback as any} />

      <div className="container-fluid mx-auto px-4 md:px-10 py-12 max-w-7xl animate-fadeIn">
        
        {/* Introductory Statement Block */}
        <div className="bg-[#3E2723]/5 border-l-4 border-[#3E2723] p-8 mb-12 rounded-r-xs max-w-5xl">
          <p className="text-gray-700 text-base md:text-lg leading-relaxed font-serif">
            KHCRF Oral Histories document knowledge that often survives outside written records. Through the voices of artisans, family members, apprentices, workshop owners, traders, researchers, and community elders, the archive preserves how Kashmir’s craft traditions were learned, practised, remembered, challenged, and transmitted across generations.
          </p>
          <p className="text-gray-500 text-xs mt-3 uppercase tracking-widest font-bold font-mono">
            These records capture not only techniques and objects, but also relationships, emotions, livelihoods, places, social change, and the personal meaning of craft.
          </p>
        </div>

        {/* Featured Oral History Section */}
        <section className="bg-white border-4 border-[#3E2723] p-8 md:p-10 mb-16 relative shadow-md">
          <div className="absolute top-0 right-0 bg-[#3E2723] text-[#D4AF37] px-4 py-1 text-[10px] font-mono font-bold uppercase tracking-widest">
            FEATURED ORAL HISTORY
          </div>
          
          <div className="max-w-4xl">
            <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold block mb-1">
              Archive Record: KHCRF-OH-2026-001
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3E2723] leading-tight mb-2">
              Passing the Needle
            </h2>
            <h3 className="text-base md:text-lg font-serif italic text-gray-500 mb-4">
              Intergenerational Learning in Sozni Embroidery
            </h3>
            
            <p className="text-gray-700 text-sm leading-relaxed mb-4 font-sans text-gray-600">
              A mother and daughter reflect on how Sozni embroidery entered their home, how the younger generation learned through observation and correction, and how women sustained intricate embroidery traditions while balancing domestic responsibilities and uncertain earnings.
            </p>

            <blockquote className="border-l-4 border-[#D4AF37] pl-4 italic text-gray-650 text-sm mb-6 font-serif">
              “Before I learned the design, I learned how to hold the cloth without disturbing it.”
              <span className="block text-[9px] uppercase tracking-widest font-bold text-gray-400 font-mono mt-1">&mdash; Editorial preview quotation</span>
            </blockquote>

            <div className="flex flex-wrap gap-2 mb-6">
              {["16 Minutes", "Sozni Embroidery", "Srinagar", "Recorded 2026", "Kashmiri", "English Transcript Planned"].map((tagText) => (
                <span key={tagText} className="bg-[#FAF9F6] border border-[#3E2723]/20 text-[#3E2723] font-mono text-[10px] uppercase font-semibold px-2.5 py-1">
                  {tagText}
                </span>
              ))}
            </div>

            <button 
              onClick={() => setActiveHistory(allHistories[0])}
              className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-all font-mono"
            >
              Read Record Summary
            </button>
          </div>
        </section>

        {/* Why Oral Histories Matter Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-serif text-[#3E2723] mb-6">Why Oral Histories Matter</h2>
            <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans">
              Craft knowledge is rarely transmitted through written manuals alone. It lives in memory, gesture, repetition, correction, observation, family relationships, workshop discipline, local vocabulary, and personal experience.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed font-sans text-gray-600">
              When an artisan, spinner, painter, trader, apprentice, or family elder is no longer able to tell that story, an irreplaceable part of Kashmir’s cultural record may disappear.
            </p>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#3E2723]/10 p-8 rounded-xs shadow-xs">
            <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 font-mono">
              KHCRF Oral Histories Preserve
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700 font-sans">
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>personal memories of learning and apprenticeship</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>family and workshop lineages</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>women’s often-unrecorded contribution to production</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>local terminology and craft vocabulary</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>memories of historic markets and patronage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>workshop life and artisan relationships</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>experiences of economic and political change</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>migration, decline, adaptation, and revival</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>cultural meanings associated with motifs and materials</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>community identity connected to craft practice</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Archive Summary (Archive Preview Data Block) */}
        <section className="bg-[#3E2723] text-white p-8 md:p-10 mb-12 rounded-xs relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#3E2723] px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-widest">
            Archive Preview
          </div>
          <div className="mb-8">
            <h3 className="font-serif text-2xl text-[#D4AF37] mb-2">Oral History Registry Archive</h3>
            <p className="text-white/60 text-xs font-mono">
              INTERNAL AUDIT PREVIEW // CONNECTS DIRECTLY TO CANONICAL CMS OBJECTS
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 text-center md:text-left">
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Oral History Records</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">12</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Recorded Testimonies</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">18</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Craft Traditions Represented</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">9</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Recorded Duration</span>
              <span className="text-lg md:text-xl font-serif font-bold text-[#D4AF37] block leading-tight">4 Hours 05 Minutes</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Districts Documented</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">6</span>
            </div>
            <div className="last:border-0">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Transcripts Available</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">12</span>
            </div>
          </div>
        </section>

        {/* View Switcher Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 bg-[#FAF9F6] border border-[#3E2723]/10 p-4 font-mono">
          <div className="text-xs font-serif text-[#3E2723]">
            KHCRF Registry Catalog &bull; Showing {sortedHistories.length} Records
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
                  placeholder="Search oral histories by speaker, craft, family, workshop, village, district, theme, quotation, or transcript..."
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
                  <option value="Pashmina">Pashmina</option>
                  <option value="Kani Shawl">Kani Shawl</option>
                  <option value="Sozni Embroidery">Sozni Embroidery</option>
                  <option value="Papier-Mâché">Papier-Mâché</option>
                  <option value="Walnut Wood Carving">Walnut Wood Carving</option>
                  <option value="Copperware">Copperware</option>
                  <option value="Namda">Namda</option>
                  <option value="Crewel Embroidery">Crewel Embroidery</option>
                  <option value="Willow Wicker">Willow Wicker</option>
                  <option value="Chain Stitch">Chain Stitch</option>
                </select>
              </div>

              {/* Theme Selection */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Oral History Theme</label>
                <select 
                  value={selectedTheme}
                  onChange={(e) => { setSelectedTheme(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Themes">All Themes</option>
                  <option value="Craft Lineage">Craft Lineage</option>
                  <option value="Childhood and Learning">Childhood and Learning</option>
                  <option value="Ustad–Shagird Tradition">Ustad–Shagird Tradition</option>
                  <option value="Women Artisans">Women Artisans</option>
                  <option value="Workshop Life">Workshop Life</option>
                  <option value="Traditional Markets">Traditional Markets</option>
                  <option value="Symbolism and Motifs">Symbolism and Motifs</option>
                  <option value="Conflict and Resilience">Conflict and Resilience</option>
                  <option value="Migration and Change">Migration and Change</option>
                  <option value="Rural Craft Identity">Rural Craft Identity</option>
                  <option value="Decline and Revival">Decline and Revival</option>
                  <option value="Artisan Livelihoods">Artisan Livelihoods</option>
                  <option value="Cultural Memory">Cultural Memory</option>
                </select>
              </div>

              {/* Speaker Type Selection */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Speaker Type</label>
                <select 
                  value={selectedSpeakerType}
                  onChange={(e) => { setSelectedSpeakerType(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Speakers">All Speakers</option>
                  <option value="Master Artisan">Master Artisan</option>
                  <option value="Senior Artisan">Senior Artisan</option>
                  <option value="Woman Artisan">Woman Artisan</option>
                  <option value="Apprentice">Apprentice</option>
                  <option value="Family Member">Family Member</option>
                  <option value="Workshop Owner">Workshop Owner</option>
                  <option value="Trader">Trader</option>
                  <option value="Designer">Designer</option>
                  <option value="Researcher">Researcher</option>
                  <option value="Community Elder">Community Elder</option>
                  <option value="Cooperative Member">Cooperative Member</option>
                  <option value="Institutional Representative">Institutional Representative</option>
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
                  <option value="English Transcript Available">English Transcript Available</option>
                  <option value="English Translation Available">English Translation Available</option>
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
                  <option value="Under 15 Minutes">Under 15 Minutes</option>
                  <option value="15–20 Minutes">15–20 Minutes</option>
                  <option value="20–30 Minutes">20–30 Minutes</option>
                  <option value="Over 30 Minutes">Over 30 Minutes</option>
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
                  <option value="Oral History Concept">Oral History Concept</option>
                  <option value="Documentation Planned">Documentation Planned</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Field Recorded">Field Recorded</option>
                  <option value="Transcript in Preparation">Transcript in Preparation</option>
                  <option value="Editorial Review">Editorial Review</option>
                  <option value="Published Record">Published Record</option>
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
                  <option value="Newest Recorded">Newest Recorded</option>
                  <option value="Oldest Recorded">Oldest Recorded</option>
                  <option value="Duration">Duration</option>
                  <option value="A–Z">A–Z</option>
                  <option value="Speaker Name">Speaker Name</option>
                  <option value="Craft Tradition">Craft Tradition</option>
                  <option value="District">District</option>
                </select>
              </div>

            </div>
          </div>

          {/* Results Area */}
          <div className="w-full lg:w-3/4">

            {loading ? (
              <div className="py-20 text-center text-gray-500 font-serif">Loading oral histories...</div>
            ) : (
              <>
                {/* 1. EDITORIAL CARDS VIEW (RESTYLED WITHOUT IMAGES IN 2-COLUMN GRID) */}
                {currentView === 'cards' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                    {paginatedHistories.map((h, i) => (
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
                            ORAL HISTORY &bull; {h.craft.toUpperCase()}
                          </div>

                          {/* Row 3: Title */}
                          <h3 
                            onClick={() => setActiveHistory(h)}
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
                          <p className="text-gray-700 text-xs leading-relaxed mb-6 font-sans">
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
                          <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                            <span className="bg-[#3E2723]/5 border border-[#3E2723]/10 text-[#3E2723] text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider font-mono">
                              {h.status.replace(" Record", "").toUpperCase()}
                            </span>
                            
                            <button 
                              onClick={() => setActiveHistory(h)}
                              className="text-xs font-bold uppercase tracking-widest text-[#3E2723] hover:text-[#D4AF37] transition-colors font-mono"
                            >
                              Explore Oral History &rarr;
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
                          <th className="p-4 border-b border-[#3E2723]/20">Accession ID</th>
                          <th className="p-4 border-b border-[#3E2723]/20">Speaker / Informant</th>
                          <th className="p-4 border-b border-[#3E2723]/20">Craft Sector</th>
                          <th className="p-4 border-b border-[#3E2723]/20">District / Geography</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-right">Duration</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center">Year</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center">Transcript</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#3E2723]/10 font-sans text-gray-700">
                        {paginatedHistories.map((h, i) => (
                          <tr key={i} className="hover:bg-[#FAF9F6] transition-colors cursor-pointer" onClick={() => setActiveHistory(h)}>
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
                  <div className="space-y-8 font-mono text-xs animate-fadeIn">
                    {paginatedHistories.map((h, i) => (
                      <div key={i} className="bg-white border-2 border-[#3E2723] p-6 shadow-sm relative">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-[#3E2723] mb-4 gap-2">
                          <div>
                            <span className="bg-[#3E2723] text-white px-2 py-0.5 text-[10px] font-bold mr-3 font-mono">
                              KHCRF LIVING MEMORY REGISTRY
                            </span>
                            <span className="font-bold text-gray-500">
                              METADATA ACCESSION CODE: {h.accessionId}
                            </span>
                          </div>
                          <div className="text-[#3E2723] font-bold text-[10px] uppercase font-mono">
                            STATUS: {h.status.toUpperCase()} // RECORDED {h.year}
                          </div>
                        </div>

                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-[#3E2723] uppercase font-serif">
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
                            <div><span className="text-gray-400">PRIMARY CRAFT SECTOR :</span> <span className="font-bold text-[#3E2723]">{h.craft}</span></div>
                            <div><span className="text-gray-400">PRIMARY GEOGRAPHY    :</span> <span className="font-bold text-[#3E2723]">{h.district}</span></div>
                            <div><span className="text-gray-400">RECORDED DURATION   :</span> <span className="font-bold text-[#3E2723]">{h.dur}</span></div>
                            <div><span className="text-gray-400">RESEARCH DIRECTOR   :</span> <span className="font-bold text-[#3E2723]">{h.director}</span></div>
                          </div>
                          <div className="space-y-1.5">
                            <div><span className="text-gray-400">SPEAKER/INFORMANT   :</span> <span className="font-bold text-[#3E2723]">{h.artisan}</span></div>
                            <div><span className="text-gray-400">RECORDING LANGUAGE  :</span> <span className="font-bold text-[#3E2723]">{h.language}</span></div>
                            <div><span className="text-gray-400">SUBTITLES INDEXED   :</span> <span className="font-bold text-[#3E2723]">{h.subtitles === 'Yes' || h.subtitles.includes("English") ? 'ENGLISH (BURNED-IN)' : 'NONE'}</span></div>
                            <div><span className="text-gray-400">TRANSCRIPT CODE     :</span> <span className="font-bold text-[#3E2723]">{h.hasTranscript === 'Yes' ? `TR-${h.accessionId.replace('KHCRF-OH-', '')}-VERIFIED` : 'ARCHIVED/FORTHCOMING'}</span></div>
                          </div>
                        </div>

                        {/* Emphasized Quotation snippet */}
                        {h.transcriptPreview && (
                          <div className="mb-4 border-l-4 border-[#3E2723] pl-4 italic text-gray-700 bg-gray-50 py-3">
                            <span className="text-[10px] text-gray-400 font-bold block mb-1 uppercase font-mono">Archival Transcript Excerpt:</span>
                            “{h.transcriptPreview}”
                          </div>
                        )}

                        <div className="mb-4 font-sans">
                          <span className="text-gray-400 block mb-1 uppercase font-bold text-[10px] font-mono">Archival Synopsis:</span>
                          <p className="text-gray-700 leading-relaxed text-[11px]">
                            {h.desc}
                          </p>
                        </div>

                        {h.themes && (
                          <div className="mb-4 font-mono">
                            <span className="text-gray-400 block mb-1 uppercase font-bold text-[10px]">Index Keywords & Themes:</span>
                            <div className="flex flex-wrap gap-1">
                              {h.themes.map((th: string) => (
                                <span key={th} className="bg-gray-100 text-[#3E2723] px-2 py-0.5 text-[9px] border border-gray-300">
                                  {th.toUpperCase()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="pt-4 border-t border-[#3E2723]/20 flex justify-between items-center text-[10px] font-mono">
                          <span className="text-gray-400">KHCRF LIVING MEMORY DEPT &bull; SRINAGAR HQ</span>
                          <button onClick={() => setActiveHistory(h)} className="text-[#3949AB] hover:underline font-bold uppercase">
                            Explore Oral History &rarr;
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
              <div className="flex justify-center items-center gap-4 mt-12 pt-8 border-t border-gray-100">
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
                        currentPage === i + 1 ? 'bg-[#D4AF37] text-white' : 'border border-gray-200 text-gray-505 hover:border-[#D4AF37]'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="w-10 h-10 border border-gray-305 flex items-center justify-center text-gray-505 hover:border-[#3E2723] hover:text-[#3E2723] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  &rarr;
                </button>
              </div>
            )}
          </div>

        </section>

        {/* How KHCRF Oral Histories Are Developed Section */}
        <section className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs mt-16" id="methodology">
          <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold">
            How KHCRF Oral Histories Are Developed
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-4xl font-sans">
            Every oral history should be produced through informed consent, structured field documentation, respectful interviewing, transcript review, contextual research, metadata preparation, and appropriate access controls.
          </p>

          <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 font-mono">
            Documentation Stages
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-gray-700">
            {[
              "Subject identification",
              "Background and lineage research",
              "Informed consent",
              "Interview planning",
              "Field recording",
              "Transcription",
              "Translation where required",
              "Fact and name verification",
              "Speaker review where possible",
              "Editorial contextualization",
              "Rights and access classification",
              "Archival publication"
            ].map((stageText, idx) => (
              <div key={idx} className="border-l-2 border-[#3E2723] pl-4 py-1">
                <span className="font-mono text-[#D4AF37] font-bold block mb-1">STAGE {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                <span className="font-bold text-[#3E2723] block mb-1">{stageText}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Ethical Documentation Principles Section */}
        <section className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs mt-12">
          <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold">
            Respecting the Voice of the Speaker
          </h2>
          <p className="text-gray-655 text-sm leading-relaxed mb-8 max-w-4xl font-sans">
            KHCRF Oral Histories should be developed according to the following principles:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-xs text-gray-700 font-sans">
            {[
              "informed and documented consent",
              "accurate representation of the speaker’s words",
              "no manufactured quotations",
              "no alteration of testimony for dramatic effect",
              "clear separation between testimony and editorial interpretation",
              "respect for personal, family, and community sensitivities",
              "the option to restrict sensitive material",
              "attribution of interviewers, translators, and recorders",
              "correction procedures for names and factual errors",
              "long-term preservation of original recordings"
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
              Using the Oral History Archive
            </h2>
            <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans">
              The archive may support:
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setActiveHistory(allHistories[0])}
                className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors text-center font-mono w-full md:w-auto"
              >
                Request Research Access
              </button>
              <a 
                href="#nominate"
                className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors text-center font-mono w-full md:w-auto block"
              >
                Propose an Oral History Subject
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#FAF9F6] border border-[#3E2723]/10 p-6 md:p-8 font-sans">
            <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-200 font-mono">
              Approved Research & Educational Uses
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4 text-xs text-gray-700 font-sans">
              {[
                "academic research",
                "family and community history",
                "museum interpretation",
                "craft education",
                "linguistic research",
                "documentary production",
                "exhibition development",
                "policy research",
                "apprenticeship studies",
                "women’s labour documentation",
                "cultural heritage preservation"
              ].map((useItem, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-[#D4AF37] font-bold">▪</span>{useItem}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Contribute an Oral History Section */}
        <section className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs mt-12" id="nominate">
          <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold">
            Help Preserve a Craft Memory
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-6 font-sans">
            Artisans, families, workshop communities, researchers, cooperatives, and cultural institutions may propose individuals or communities whose memories should be documented.
          </p>

          {nominationSubmitted ? (
            <div className="bg-[#FAF9F6] border-2 border-dashed border-[#D4AF37] p-8 text-center text-[#3E2723] font-serif rounded-xs">
              <h3 className="text-xl font-bold mb-2">Thank You for Your Nomination</h3>
              <p className="text-xs font-mono text-gray-500">
                The KHCRF Oral Histories Registry Board has received the nomination file. We will audit the community request and follow up.
              </p>
            </div>
          ) : (
            <form onSubmit={handleNominate} className="space-y-6 text-xs font-mono max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block uppercase text-gray-400 font-bold mb-2">Proposed Speaker Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={nominee.speaker}
                    onChange={e => setNominee({...nominee, speaker: e.target.value})}
                    placeholder="Enter name of speaker..."
                    className="w-full border border-gray-200 px-3 py-2 bg-[#FAF9F6] focus:outline-none focus:border-[#3E2723]" 
                  />
                </div>
                <div>
                  <label className="block uppercase text-gray-400 font-bold mb-2">Craft Tradition *</label>
                  <select 
                    value={nominee.craft}
                    onChange={e => setNominee({...nominee, craft: e.target.value})}
                    className="w-full border border-gray-200 px-3 py-2 bg-[#FAF9F6] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="Pashmina">Pashmina</option>
                    <option value="Kani Shawl">Kani Shawl</option>
                    <option value="Sozni Embroidery">Sozni Embroidery</option>
                    <option value="Papier-Mâché">Papier-Mâché</option>
                    <option value="Walnut Wood Carving">Walnut Wood Carving</option>
                    <option value="Copperware">Copperware</option>
                    <option value="Namda">Namda</option>
                    <option value="Hand-Knotted Carpet">Hand-Knotted Carpet</option>
                    <option value="Willow Wicker">Willow Wicker</option>
                  </select>
                </div>
                <div>
                  <label className="block uppercase text-gray-400 font-bold mb-2">Village or Locality *</label>
                  <input 
                    type="text" 
                    required
                    value={nominee.village}
                    onChange={e => setNominee({...nominee, village: e.target.value})}
                    placeholder="Enter village cluster..."
                    className="w-full border border-gray-200 px-3 py-2 bg-[#FAF9F6] focus:outline-none focus:border-[#3E2723]" 
                  />
                </div>
                <div>
                  <label className="block uppercase text-gray-400 font-bold mb-2">District *</label>
                  <select 
                    value={nominee.district}
                    onChange={e => setNominee({...nominee, district: e.target.value})}
                    className="w-full border border-gray-200 px-3 py-2 bg-[#FAF9F6] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="Srinagar">Srinagar</option>
                    <option value="Budgam">Budgam</option>
                    <option value="Ganderbal">Ganderbal</option>
                    <option value="Baramulla">Baramulla</option>
                    <option value="Anantnag">Anantnag</option>
                    <option value="Pulwama">Pulwama</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase text-gray-400 font-bold mb-2">Reason for Documentation *</label>
                <textarea 
                  required
                  rows={4}
                  value={nominee.reason}
                  onChange={e => setNominee({...nominee, reason: e.target.value})}
                  placeholder="Explain why this speaker's oral histories should be preserved in the archive register..."
                  className="w-full border border-gray-200 px-3 py-2 bg-[#FAF9F6] focus:outline-none focus:border-[#3E2723]"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block uppercase text-gray-400 font-bold mb-2">Language of Interview</label>
                  <input 
                    type="text" 
                    value={nominee.language}
                    onChange={e => setNominee({...nominee, language: e.target.value})}
                    placeholder="Kashmiri, Urdu, Gojri, etc..."
                    className="w-full border border-gray-200 px-3 py-2 bg-[#FAF9F6] focus:outline-none focus:border-[#3E2723]" 
                  />
                </div>
                <div>
                  <label className="block uppercase text-gray-400 font-bold mb-2">Family or Workshop Lineage</label>
                  <input 
                    type="text" 
                    value={nominee.lineage}
                    onChange={e => setNominee({...nominee, lineage: e.target.value})}
                    placeholder="Family clan or workshop name..."
                    className="w-full border border-gray-200 px-3 py-2 bg-[#FAF9F6] focus:outline-none focus:border-[#3E2723]" 
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase text-gray-400 font-bold mb-2">Historical Importance / Supporting Material Links</label>
                <input 
                  type="text" 
                  value={nominee.importance}
                  onChange={e => setNominee({...nominee, importance: e.target.value})}
                  placeholder="Links to articles, photos, documents, or general notes..."
                  className="w-full border border-gray-200 px-3 py-2 bg-[#FAF9F6] focus:outline-none focus:border-[#3E2723]" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block uppercase text-gray-400 font-bold mb-2">Your Contact Information *</label>
                  <input 
                    type="text" 
                    required 
                    value={nominee.contact}
                    onChange={e => setNominee({...nominee, contact: e.target.value})}
                    placeholder="Email or phone number..."
                    className="w-full border border-gray-200 px-3 py-2 bg-[#FAF9F6] focus:outline-none focus:border-[#3E2723]" 
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      required
                      checked={nominee.consent}
                      onChange={e => setNominee({...nominee, consent: e.target.checked})}
                      className="accent-[#3E2723]" 
                    />
                    <span className="uppercase text-gray-500 font-bold text-[9px]">I confirm ethical consent to contact proposed speaker</span>
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-8 py-4 font-bold uppercase tracking-widest text-xs transition-colors font-mono"
              >
                Nominate an Oral History
              </button>
            </form>
          )}
        </section>

        {/* Footer Statement Section */}
        <section className="border-t border-[#3E2723]/20 pt-10 text-center max-w-4xl mx-auto mt-16 font-sans">
          <blockquote className="text-gray-700 text-base md:text-lg leading-relaxed font-serif italic mb-4">
            "KHCRF Oral Histories preserve Kashmir’s craft heritage through the voices of those who lived it—recording not only how objects were made, but how knowledge, memory, labour, identity, and tradition moved across generations."
          </blockquote>
          <p className="text-gray-400 text-xs font-mono uppercase tracking-widest font-bold">
            KHCRF Registry Access Console &bull; Oral History Registry Division
          </p>
          <p className="text-[#D4AF37] text-[10px] uppercase font-bold mt-2 tracking-widest font-mono">
            This page represents a serious cultural-memory archive under structured development. Access to verified audio recordings and transcriptions is reserved for supportive members.
          </p>
        </section>

      </div>
    </main>
  );
}
