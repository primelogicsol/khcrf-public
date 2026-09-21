'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { craftLineagesHeroFallback } from '@/config/heroFallbacks';

interface PersonNode {
  name: string;
  role: string;
  generation: number;
  activePeriod?: string;
  notes?: string;
  children?: PersonNode[];
}

interface LineageEvent {
  year: string;
  details: string;
}

interface Lineage {
  slug: string;
  lineageNumber: string;
  title: string;
  subtitle: string;
  lineageType: 'Family Lineage' | 'Master–Apprentice Lineage' | 'Workshop Lineage' | 'Women’s Household Lineage' | 'Community Lineage' | 'Village Tradition' | 'Cooperative Lineage' | 'Institutional Training Lineage' | 'Migrated Lineage' | 'Revival Lineage' | 'Interrupted Lineage' | 'Multi-Branch Lineage' | 'Family and Master–Apprentice Lineage' | 'Family and Workshop Lineage';
  primaryCraft: string;
  secondaryCraft?: string;
  placeOfOrigin: string;
  currentLocations: string;
  earliestDocumentedDate: string;
  latestDocumentedActivity: string;
  generationCount: number | string;
  personCount: number;
  workshopCount: number;
  continuityStatus: 'Strongly Continuing' | 'Continuing' | 'Active but Vulnerable' | 'At Risk' | 'Severely At Risk' | 'Interrupted' | 'Revived' | 'Historical' | 'Status Unknown' | 'Active';
  verificationStatus: string;
  summary: string;
  whyItMatters: string;
  historicalContext: string;
  transmissionMethod: string;
  evidenceTypes: string[];
  evidenceConfidence: 'Confirmed' | 'Strongly Supported' | 'Probable' | 'Reported' | 'Disputed' | 'Unverified';
  genderComposition: 'Women-Led' | 'Men-Led' | 'Mixed-Gender' | 'Household-Based' | 'Multi-Generational';
  historicalPeriod: string;
  treeData: PersonNode;
  timeline: LineageEvent[];
  skillsTransmitted: string[];
  referencedObjects: string[];
  oralHistories: string[];
  disputedClaims?: string;
  risks: string[];
}

export default function LineagesDirectory() {
  const [allLineages] = useState<Lineage[]>([
    {
      slug: "ro-wani-kani-weaving",
      lineageNumber: "KHCRF-LIN-2026-001",
      title: "The Wani Kani Weaving Lineage",
      subtitle: "Four Generations of Pattern Knowledge and Loom Practice in Kanihama",
      lineageType: "Family and Master–Apprentice Lineage",
      primaryCraft: "Kani Weaving",
      secondaryCraft: "Pashmina Weaving",
      placeOfOrigin: "Kanihama, Budgam",
      currentLocations: "Kanihama, Srinagar",
      earliestDocumentedDate: "c. 1932",
      latestDocumentedActivity: "Active in 2026",
      generationCount: 4,
      personCount: 13,
      workshopCount: 3,
      continuityStatus: "Active but Vulnerable",
      verificationStatus: "Verified",
      summary: "This lineage documents four generations of Kani weaving practice associated with a family workshop in Kanihama. The record traces changes in pattern interpretation, loom organization, artisan participation, market demand, training practices, and workshop leadership. The lineage includes both family transmission and the teaching of apprentices from outside the household, demonstrating that craft continuity often extends beyond blood relationships.",
      whyItMatters: "This lineage preserves one of the few documented chains of Kani pattern interpretation extending across four generations. Its significance lies not only in family continuity, but also in the training of non-family apprentices who later established independent workshops.",
      historicalContext: "Formed in the early 20th century in Kanihama, a village historically associated with Kani weaving, during the revival of handloom patronage.",
      transmissionMethod: "Ustad–Shagird & Family Transmission",
      evidenceTypes: ["Oral Testimony", "Workshop Records", "Family Records", "Object-Based Evidence"],
      evidenceConfidence: "Confirmed",
      genderComposition: "Mixed-Gender",
      historicalPeriod: "21st Century",
      risks: ["weak market demand", "low earnings for young weavers", "rising raw material costs"],
      skillsTransmitted: ["Talim reading", "Pattern sequencing", "Kani handling", "Loom tension control", "Colour allocation", "Error correction", "Border alignment", "Final quality review"],
      referencedObjects: ["KHCRF-OBJ-2026-0184 (Kani shawl, Gen II)", "KHCRF-OBJ-2026-0217 (Pattern manuscript)", "KHCRF-OBJ-2026-0361 (Contemporary shawl)"],
      oralHistories: ["Memories of the Kanihama Workshop (Gen III)", "Learning from My Father (Gen IV)"],
      disputedClaims: "Family testimony identifies the first practitioner as active before 1910. The earliest currently verified workshop record dates from 1932. The earlier date remains possible but unconfirmed.",
      treeData: {
        name: "Ghulam Ahmad Wani",
        role: "Master Kani Weaver (Active c. 1932–1968)",
        generation: 1,
        children: [
          {
            name: "Mohammad Sultan Wani",
            role: "Son & Apprentice",
            generation: 2,
            children: [
              {
                name: "Ali Wani",
                role: "Kani Weaver (Gen III)",
                generation: 3,
                children: [
                  { name: "Active Practitioner 1", role: "Weaver (Gen IV)", generation: 4 },
                  { name: "Active Practitioner 2", role: "Weaver (Gen IV)", generation: 4 }
                ]
              },
              {
                name: "Farooq Wani",
                role: "Pattern Specialist (Gen III)",
                generation: 3
              }
            ]
          },
          {
            name: "Abdul Rahman",
            role: "Workshop Apprentice (Non-family)",
            generation: 2,
            notes: "Established New Workshop in 1958"
          }
        ]
      },
      timeline: [
        { year: "1932", details: "First documented workshop activity by Ghulam Ahmad Wani in Kanihama." },
        { year: "1954", details: "Second generation Mohammad Sultan Wani enters the family workshop as apprentice." },
        { year: "1958", details: "Abdul Rahman completes apprenticeship; establishes first external branch workshop." },
        { year: "1982", details: "Ali Wani introduces new motif layout designs under regional cooperative patronage." },
        { year: "2014", details: "Fourth generation weavers publish digital talim records for educational study." },
        { year: "2026", details: "Lineage fully documented and published by KHCRF teams." }
      ]
    },
    {
      slug: "dar-carpet-workshop",
      lineageNumber: "KHCRF-LIN-2026-002",
      title: "The Dar Carpet Workshop Lineage",
      subtitle: "From Talim Reading to Independent Workshops",
      lineageType: "Workshop Lineage",
      primaryCraft: "Hand-Knotted Carpet",
      placeOfOrigin: "Srinagar",
      currentLocations: "Srinagar, Budgam",
      earliestDocumentedDate: "c. 1912",
      latestDocumentedActivity: "Continuing in 2026",
      generationCount: 5,
      personCount: 21,
      workshopCount: 6,
      continuityStatus: "Continuing",
      verificationStatus: "Verified",
      summary: "This record traces a carpet workshop master, the weavers trained under him, and the later workshops established by former apprentices. It documents the horizontal movement of craft knowledge across unrelated families in Downtown Srinagar.",
      whyItMatters: "Documents how a single master ustad's teaching method catalyzed the formation of six distinct neighborhood workshops.",
      historicalContext: "Established during the late British colonial period, responding to a surge in carpet commissions for European markets.",
      transmissionMethod: "Ustad–Shagird (Master–Apprentice)",
      evidenceTypes: ["Workshop Records", "Oral Testimony", "Museum Records"],
      evidenceConfidence: "Strongly Supported",
      genderComposition: "Men-Led",
      historicalPeriod: "Late 20th Century",
      risks: ["ageing practitioners", "reduced quality standards due to commercial speed", "lost toolmakers"],
      skillsTransmitted: ["Talim reading", "Double-knotting", "Upright loom tensioning", "Washing chemistry", "Pattern drafting"],
      referencedObjects: ["KHCRF-OBJ-2026-0023 (Mughal medallion replica)", "KHCRF-OBJ-2026-0044 (Talim book)"],
      oralHistories: ["Learning the Chisel from Ustad Dar (1998 Interview)"],
      treeData: {
        name: "Ustad Habibullah Dar",
        role: "Workshop Master (c. 1912-1955)",
        generation: 1,
        children: [
          {
            name: "Ghulam Hassan Dar",
            role: "Son & Master Weaver",
            generation: 2,
            children: [
              { name: "Nazir Ahmad Dar", role: "Weaver (Gen III)", generation: 3 }
            ]
          },
          {
            name: "Mohammad Maqbool",
            role: "Apprentice Weaving Lead",
            generation: 2,
            notes: "Established Loom & Lattice workshop branch"
          }
        ]
      },
      timeline: [
        { year: "1912", details: "Loom set up in Zaina Kadal by Ustad Habibullah Dar." },
        { year: "1935", details: "Maqbool begins apprenticeship, training in talim coding structures." },
        { year: "1955", details: "Maqbool establishes independent loom house in Safa Kadal." },
        { year: "2026", details: "Lineage records integrated with KHCRF digital knowledge network." }
      ]
    },
    {
      slug: "women-mir-sozni-household",
      lineageNumber: "KHCRF-LIN-2026-003",
      title: "Women of the Mir Sozni Household",
      subtitle: "Needle Knowledge Passed Through Mothers, Daughters, Aunts, and Neighbours",
      lineageType: "Women’s Household Lineage",
      primaryCraft: "Sozni Embroidery",
      placeOfOrigin: "Srinagar",
      currentLocations: "Downtown Srinagar",
      earliestDocumentedDate: "c. 1920",
      latestDocumentedActivity: "Active in 2026",
      generationCount: 4,
      personCount: 17,
      workshopCount: 0,
      continuityStatus: "Active",
      verificationStatus: "Verified",
      summary: "A lineage documenting how Sozni embroidery knowledge was transmitted within domestic spaces through observation, correction, shared commissions, and collective work. This record challenges male-dominated guild narratives by highlighting female transmission networks.",
      whyItMatters: "Preserves the oral and visual teaching chains of home-based women embroiderers who traditionally operated outside formal workshops.",
      historicalContext: "Developed inside Srinagar domestic courtyards as an economic supplement to agricultural or urban guild labor.",
      transmissionMethod: "Maternal & Sisterly Transmission",
      evidenceTypes: ["Oral Testimony", "Object-Based Evidence", "Family Records"],
      evidenceConfidence: "Confirmed",
      genderComposition: "Women-Led",
      historicalPeriod: "21st Century",
      risks: ["low commission wages", "eye strain", "absence of structured healthcare support"],
      skillsTransmitted: ["Split stitch (Sozni)", "Satin stitch borders", "Botanical sketch transfer", "Natural dye yarn sorting"],
      referencedObjects: ["KHCRF-OBJ-2026-0331 (Embroidered shawl, Gen I)", "KHCRF-OBJ-2026-0399 (Practice sampler)"],
      oralHistories: [" Courtyard Sozni Circles (Interview 2021)"],
      treeData: {
        name: "Fatima Begum Mir",
        role: "Maternal Lead embroiderer (c. 1920-1960)",
        generation: 1,
        children: [
          {
            name: "Ayesha Mir",
            role: "Daughter & Embroiderer",
            generation: 2,
            children: [
              { name: "Sakeena Begum", role: "Sozni Master (Gen III)", generation: 3 }
            ]
          },
          {
            name: "Zehra Begum (Neighbor)",
            role: "Community Apprentice",
            generation: 2,
            notes: "Established local Ganderbal weaving center branch"
          }
        ]
      },
      timeline: [
        { year: "1920", details: "Fatima Begum starts embroidery circle in Mir family home." },
        { year: "1948", details: "Cooperative contracts signed with women spinners." },
        { year: "2026", details: "Sakeena Begum continues training girls inside Downtown community hub." }
      ]
    },
    {
      slug: "bhat-papier-mache-naqashi",
      lineageNumber: "KHCRF-LIN-2026-004",
      title: "The Bhat Papier-Mâché Naqashi Lineage",
      subtitle: "Painting Knowledge Across Workshop and Family Networks",
      lineageType: "Family and Workshop Lineage",
      primaryCraft: "Papier-Mâché",
      placeOfOrigin: "Srinagar",
      currentLocations: "Zadibal, Srinagar",
      earliestDocumentedDate: "c. 1890",
      latestDocumentedActivity: "Active in 2026",
      generationCount: 5,
      personCount: 19,
      workshopCount: 4,
      continuityStatus: "Continuing",
      verificationStatus: "Partially Verified",
      summary: "This lineage follows painters, surface preparers, motif specialists, and apprentices connected through a Papier-Mâché workshop tradition. It documents the transmission of fine naqashi brushwork and secret mineral dye recipes.",
      whyItMatters: "Preserves the specific Sufi-inspired geometric motifs and lacquer techniques of Zadibal.",
      historicalContext: "Zadibal district urban cluster development under regional patronage blocks.",
      transmissionMethod: "Parent to Child & Workshop Training",
      evidenceTypes: ["Oral Testimony", "Family Records", "Photographic Evidence"],
      evidenceConfidence: "Probable",
      genderComposition: "Mixed-Gender",
      historicalPeriod: "20th Century",
      risks: ["import of cheap synthetic lacquers", "occupational paint toxicity", "lack of museum contracts"],
      skillsTransmitted: ["Sakhta moulding", "Naqashi outlining", "Mineral grinding", "Copal varnishing"],
      referencedObjects: ["KHCRF-OBJ-2026-0091 (Painted Qalamdan box)"],
      oralHistories: ["Secret Recipes of Zadibal (2023 Study)"],
      treeData: {
        name: "Ustad Subhan Bhat",
        role: "Naqashi Painter (c. 1890-1945)",
        generation: 1,
        children: [
          {
            name: "Ghulam Rasool Bhat",
            role: "Son & Artist",
            generation: 2,
            children: [
              { name: "Riyaz Ahmad Bhat", role: "Master Artist (Gen III)", generation: 3 }
            ]
          }
        ]
      },
      timeline: [
        { year: "1890", details: "Subhan Bhat sets up painting studio in Zadibal." },
        { year: "2026", details: "Riyaz Bhat coordinates modular lighting collection projects with global designers." }
      ]
    },
    {
      slug: "lone-walnut-carving",
      lineageNumber: "KHCRF-LIN-2026-005",
      title: "The Lone Walnut Carving Lineage",
      subtitle: "Tools, Drawing, and Relief Carving Across Three Generations",
      lineageType: "Family Lineage",
      primaryCraft: "Walnut Wood Carving",
      placeOfOrigin: "Srinagar",
      currentLocations: "Srinagar, Safa Kadal",
      earliestDocumentedDate: "c. 1935",
      latestDocumentedActivity: "Active in 2026",
      generationCount: 3,
      personCount: 8,
      workshopCount: 1,
      continuityStatus: "Active",
      verificationStatus: "Verified",
      summary: "A documented lineage of walnut wood carvers preserving tool preparation, drawing methods, relief depth, finishing, and architectural carving. It illustrates high-density leaf-relief pedagogy.",
      whyItMatters: "Preserves rare WILD walnut wood carving techniques that require specialized slow hand chiseling.",
      historicalContext: "Formed post-independence as woodcarving workshops expanded in Srinagar urban wards.",
      transmissionMethod: "Parent to Child",
      evidenceTypes: ["Workshop Records", "Photographic Evidence", "Oral Testimony"],
      evidenceConfidence: "Confirmed",
      genderComposition: "Men-Led",
      historicalPeriod: "21st Century",
      risks: ["wood logging bans", "import of commercial timber", "modern router replacements"],
      skillsTransmitted: ["Wild walnut seasoning", "Relief depth calculation", "Chisel sharpening", "Beeswax finish"],
      referencedObjects: ["KHCRF-OBJ-2026-0312 (Carved walnut screen)"],
      oralHistories: ["The Seasoning of Wild Walnut Planks (Oral History)"],
      treeData: {
        name: "Ghulam Qadir Lone",
        role: "Master Carver (c. 1935-1980)",
        generation: 1,
        children: [
          {
            name: "Nazir Ahmad Lone",
            role: "Son & Woodcarver",
            generation: 2,
            children: [
              { name: "Bilal Lone", role: "Active Carver (Gen III)", generation: 3 }
            ]
          }
        ]
      },
      timeline: [
        { year: "1935", details: "Ghulam Qadir sets up shop in Safa Kadal." },
        { year: "2026", details: "Bilal Lone completes custom architectural panel wall for Srinagar public hall." }
      ]
    }
  ]);

  const [loading] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLineageType, setSelectedLineageType] = useState('All');
  const [selectedCraft, setSelectedCraft] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedTransmission, setSelectedTransmission] = useState('All');
  const [selectedDepth, setSelectedDepth] = useState('All');
  const [selectedGeography, setSelectedGeography] = useState('All');
  const [selectedEvidence, setSelectedEvidence] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Featured');

  const [activeLineage, setActiveLineage] = useState<Lineage | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'overview' | 'map' | 'timeline' | 'details' | 'methodology'>('overview');
  const [currentView, setCurrentView] = useState<'stories' | 'map' | 'timeline' | 'index'>('stories');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Nomination form state
  const [nominationForm, setNominationForm] = useState({
    title: '',
    craft: '',
    origin: '',
    earliestPractitioner: '',
    generations: '',
    teachers: '',
    appCategory: '',
    reason: '',
    documentation: '',
    contact: ''
  });
  const [nominationSubmitted, setNominationSubmitted] = useState(false);

  const handleNominationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNominationSubmitted(true);
    setTimeout(() => {
      setNominationSubmitted(false);
      setNominationForm({
        title: '',
        craft: '',
        origin: '',
        earliestPractitioner: '',
        generations: '',
        teachers: '',
        appCategory: '',
        reason: '',
        documentation: '',
        contact: ''
      });
    }, 4000);
  };

  const filteredLineages = allLineages.filter(l => {
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchText = `${l.title} ${l.subtitle} ${l.lineageNumber} ${l.primaryCraft} ${l.placeOfOrigin} ${l.summary} ${l.whyItMatters}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    // Lineage Type
    if (selectedLineageType !== 'All' && l.lineageType !== selectedLineageType) return false;

    // Craft
    if (selectedCraft !== 'All' && l.primaryCraft !== selectedCraft) return false;

    // Status
    if (selectedStatus !== 'All' && l.continuityStatus !== selectedStatus) return false;

    // Transmission Method
    if (selectedTransmission !== 'All' && !l.transmissionMethod.toLowerCase().includes(selectedTransmission.toLowerCase())) return false;

    // Generation Depth
    if (selectedDepth !== 'All') {
      const depth = Number(l.generationCount);
      if (selectedDepth === 'Two Generations' && depth !== 2) return false;
      if (selectedDepth === 'Three Generations' && depth !== 3) return false;
      if (selectedDepth === 'Four Generations' && depth !== 4) return false;
      if (selectedDepth === 'Five or More Generations' && (isNaN(depth) || depth < 5)) return false;
    }

    // Geography
    if (selectedGeography !== 'All' && !l.placeOfOrigin.toLowerCase().includes(selectedGeography.toLowerCase())) return false;

    // Evidence Status
    if (selectedEvidence !== 'All' && !l.evidenceTypes.includes(selectedEvidence)) return false;

    // Gender Composition
    if (selectedGender !== 'All' && l.genderComposition !== selectedGender) return false;

    return true;
  });

  // Sorting
  const sortedLineages = [...filteredLineages].sort((a, b) => {
    if (selectedSort === 'Recently Documented') {
      return b.lineageNumber.localeCompare(a.lineageNumber);
    }
    if (selectedSort === 'Longest Documented Lineage' || selectedSort === 'Most Generations') {
      const depthA = typeof a.generationCount === 'number' ? a.generationCount : 0;
      const depthB = typeof b.generationCount === 'number' ? b.generationCount : 0;
      return depthB - depthA;
    }
    if (selectedSort === 'Most Artisans') {
      return b.personCount - a.personCount;
    }
    if (selectedSort === 'District') {
      return a.placeOfOrigin.localeCompare(b.placeOfOrigin);
    }
    if (selectedSort === 'Active Lineages') {
      return a.continuityStatus === 'Active' ? -1 : 1;
    }
    if (selectedSort === 'At-Risk Lineages') {
      return a.continuityStatus === 'At Risk' ? -1 : 1;
    }
    if (selectedSort === 'Alphabetical' || selectedSort === 'A–Z') {
      return a.title.localeCompare(b.title);
    }
    return b.lineageNumber.localeCompare(a.lineageNumber); // Default Featured
  });

  const totalPages = Math.ceil(sortedLineages.length / itemsPerPage);
  const paginatedLineages = sortedLineages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const featuredLineage = allLineages[0]; // Wani Kani Weaving Lineage

  // Recursive Tree Rendering
  const renderTree = (node: PersonNode): React.ReactNode => {
    return (
      <div key={node.name} className="border border-gray-250 p-3 bg-white space-y-1 relative pl-6 border-l-2 border-l-[#3E2723]/30 font-mono text-[9px] text-gray-700">
        <div className="absolute -left-[5px] top-[14px] w-2 h-2 rounded-full bg-[#3E2723]"></div>
        <div><strong className="text-[#3E2723] uppercase text-[9px]">{node.name}</strong></div>
        <div className="text-gray-500">{node.role}</div>
        {node.notes && <div className="text-[#D4AF37] italic text-[8px]">{node.notes}</div>}
        {node.children && node.children.length > 0 && (
          <div className="space-y-2 mt-2 pt-2 border-t border-dashed border-gray-200">
            {node.children.map(child => renderTree(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pb-24 animate-fadeIn">
      
      {/* Detailed Modal Registry Sheet */}
      {activeLineage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#3E2723]/40 backdrop-blur-sm" onClick={() => setActiveLineage(null)}></div>
          <div className="relative z-10 bg-[#FAF9F6] border-2 border-[#3E2723] max-w-3xl w-full p-6 md:p-8 shadow-2xl text-[#2A2A2A] max-h-[95vh] overflow-y-auto custom-scrollbar font-mono rounded-xs" role="dialog" aria-modal="true">
            <button onClick={() => setActiveLineage(null)} className="absolute top-4 right-4 text-[#3E2723]/50 hover:text-[#3E2723] text-xl font-bold font-mono">&times;</button>
            
            <div className="text-center mb-6 border-b border-[#3E2723]/25 pb-4">
              <span className="text-[#D4AF37] font-mono text-xs uppercase tracking-widest block mb-1 font-bold">KHCRF CRAFT LINEAGE REGISTRY</span>
              <h2 className="text-xl md:text-2xl font-serif text-[#3E2723] font-bold leading-tight">{activeLineage.title}</h2>
              {activeLineage.subtitle && <p className="text-gray-555 text-xs italic font-serif mt-1">{activeLineage.subtitle}</p>}
              
              <div className="flex flex-wrap justify-center gap-2 mt-3 font-mono text-[9px] uppercase tracking-wider text-gray-500">
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">ACCESSION: {activeLineage.lineageNumber}</span>
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">TYPE: {activeLineage.lineageType}</span>
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">STATUS: {activeLineage.continuityStatus}</span>
              </div>
            </div>

            {/* Modal Tabs navigation */}
            <div className="flex flex-wrap gap-1 border-b border-[#3E2723]/20 pb-3 mb-6 text-[10px] font-mono justify-center">
              {[
                { id: 'overview', label: 'Lineage Overview' },
                { id: 'map', label: 'Relationship Map' },
                { id: 'timeline', label: 'Generational Timeline' },
                { id: 'details', label: 'Pedagogy & Risks' },
                { id: 'methodology', label: 'Research Standards' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveModalTab(tab.id as 'overview' | 'map' | 'timeline' | 'details' | 'methodology')}
                  className={`px-3 py-1.5 border border-t-2 transition-all ${
                    activeModalTab === tab.id
                      ? 'bg-[#3E2723] text-white border-[#3E2723] border-t-[#D4AF37]'
                      : 'bg-white text-gray-550 border-gray-200 hover:border-[#3E2723]/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body Contents */}
            <div className="space-y-6 text-xs text-gray-700 leading-relaxed font-mono">
              
              {/* TAB 1: OVERVIEW */}
              {activeModalTab === 'overview' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2">Genealogical Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div><span className="text-gray-400">LINEAGE TITLE    :</span> {activeLineage.title}</div>
                      <div><span className="text-gray-400">ARCHIVE NUMBER   :</span> {activeLineage.lineageNumber}</div>
                      <div><span className="text-gray-400">PRIMARY CRAFT    :</span> {activeLineage.primaryCraft}</div>
                      <div><span className="text-gray-400">PLACE OF ORIGIN  :</span> {activeLineage.placeOfOrigin}</div>
                      <div><span className="text-gray-400">CURRENT LOCATIONS:</span> {activeLineage.currentLocations}</div>
                    </div>
                    <div className="space-y-1">
                      <div><span className="text-gray-400">GENERATIONS      :</span> {activeLineage.generationCount} documented</div>
                      <div><span className="text-gray-400">KNOWN ARTISANS   :</span> {activeLineage.personCount} practitioners</div>
                      <div><span className="text-gray-400">ACTIVE WORKSHOPS :</span> {activeLineage.workshopCount} units</div>
                      <div><span className="text-gray-400">EARLIEST DATE    :</span> {activeLineage.earliestDocumentedDate}</div>
                      <div><span className="text-gray-400">LATEST ACTIVITY  :</span> {activeLineage.latestDocumentedActivity}</div>
                    </div>
                  </div>

                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2 mt-6">Why This Lineage Matters</h3>
                  <p className="font-sans leading-relaxed text-gray-700 bg-white p-4 border border-[#3E2723]/10 shadow-xs">{activeLineage.whyItMatters}</p>

                  <div className="border-t border-gray-200 pt-3 mt-3 space-y-1.5">
                    <div><span className="text-gray-400">TRANSMISSION METHOD:</span> {activeLineage.transmissionMethod}</div>
                    <div><span className="text-gray-400">GENDER COMPOSITION :</span> {activeLineage.genderComposition}</div>
                    <div><span className="text-gray-400">EVIDENCE BASE      :</span> {activeLineage.evidenceTypes.join(', ')}</div>
                    <div><span className="text-gray-400">CONFIDENCE RATING  :</span> <span className="font-bold text-[#D4AF37]">{activeLineage.evidenceConfidence}</span></div>
                  </div>
                </div>
              )}

              {/* TAB 2: RELATIONSHIP MAP */}
              {activeModalTab === 'map' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <div className="border border-gray-250 p-4 bg-[#FAF9F6] rounded">
                    <span className="text-[#3E2723] font-bold text-[9px] uppercase block mb-3 border-b border-[#3E2723]/10 pb-1">
                      Relationship Map Legend
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[8px] text-gray-500 uppercase font-bold">
                      <div><span className="text-[#3E2723]">Solid Line:</span> Verified family relationship</div>
                      <div><span className="text-[#3E2723]">Arrow:</span> Documented teaching relationship</div>
                      <div><span className="text-[#3E2723]">Double Line:</span> Shared workshop practice</div>
                      <div><span className="text-[#3E2723]">Dotted Line:</span> Reported but unverified relationship</div>
                    </div>
                  </div>

                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Transmission Trees</h3>
                  <div className="space-y-4 max-w-xl mx-auto">
                    {renderTree(activeLineage.treeData)}
                  </div>
                </div>
              )}

              {/* TAB 3: GENERATIONAL TIMELINE */}
              {activeModalTab === 'timeline' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Generational Timeline</h3>
                  <div className="border-l-2 border-[#3E2723]/20 pl-4 space-y-3 relative">
                    {activeLineage.timeline.map((ev, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[21px] top-1 bg-[#3E2723] w-2 h-2 rounded-full"></div>
                        <span className="font-bold text-[#3E2723]">{ev.year}</span>
                        <p className="text-gray-500 text-[9px]">{ev.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: PEDAGOGY & RISKS */}
              {activeModalTab === 'details' && (
                <div className="space-y-4 font-mono text-[10px] grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="text-[#D4AF37] font-bold border-b border-gray-200 pb-1 uppercase text-[9px]">Knowledge Transmitted</h4>
                    <ul className="space-y-1 list-disc pl-4 text-gray-700">
                      {activeLineage.skillsTransmitted.map((skill, idx) => (
                        <li key={idx}>{skill}</li>
                      ))}
                    </ul>

                    {activeLineage.disputedClaims && (
                      <div className="bg-red-50/50 border border-red-200 p-3 mt-4 text-[9px]">
                        <span className="font-bold text-red-700 block uppercase mb-1">Disputed Claims &amp; Gaps</span>
                        <p className="text-red-900 leading-relaxed font-sans">{activeLineage.disputedClaims}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-[#D4AF37] font-bold border-b border-gray-200 pb-1 uppercase text-[9px]">Continuity Risks</h4>
                    <div className="bg-[#FAF9F6] border border-gray-250 p-4 space-y-1.5 text-gray-650">
                      {activeLineage.risks.map((risk, idx) => (
                        <div key={idx} className="flex gap-2">
                          <span className="text-red-500 font-bold">&bull;</span>
                          <span>{risk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: RESEARCH STANDARDS */}
              {activeModalTab === 'methodology' && (
                <div className="space-y-4 font-mono text-[10px] text-gray-700">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2">Evidence &amp; Verification Details</h3>
                  
                  <div className="bg-white border border-gray-200 p-4 space-y-3">
                    <div>
                      <strong className="text-gray-400 text-[8px] block uppercase font-bold">Oral histories collected</strong>
                      <ul className="list-disc pl-4 space-y-1 text-gray-650 mt-1">
                        {activeLineage.oralHistories.map((hist, idx) => (
                          <li key={idx}>{hist}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong className="text-gray-400 text-[8px] block uppercase font-bold">Referenced Objects in this Lineage</strong>
                      <ul className="list-disc pl-4 space-y-1 text-gray-650 mt-1">
                        {activeLineage.referencedObjects.map((obj, idx) => (
                          <li key={idx}>{obj}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white border border-red-200 p-4 mt-4">
                    <span className="text-red-700 font-bold uppercase text-[8px] block mb-1">Ethical Safeguard Notice</span>
                    <p className="font-sans leading-relaxed text-red-900">Craft Lineages are documented to preserve knowledge transmission, not to establish social superiority, hereditary privilege, caste authority, or exclusive ownership of a craft tradition.</p>
                  </div>
                </div>
              )}

            </div>

            <div className="border-t border-[#D4AF37]/30 pt-6 text-center space-y-4 font-mono mt-6">
              <p className="text-[9px] uppercase tracking-widest text-gray-400 leading-relaxed font-mono">
                Access to full microscopic logs and high-definition material spectra is reserved for supportive members.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link href="/about/memberships" className="bg-[#D4AF37] text-[#3E2723] hover:bg-white px-6 py-3 font-bold uppercase tracking-wider text-xs transition-colors border border-[#D4AF37] font-mono">
                  Become a Member
                </Link>
                <button onClick={() => setActiveLineage(null)} className="border border-[#3E2723] hover:bg-[#3E2723]/5 text-[#3E2723] px-6 py-3 uppercase tracking-wider text-xs transition-colors font-light font-mono">
                  Return to Archive
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Hero section */}
      <UniversalEditorialHero pageKey="craft-lineages" fallbackConfig={craftLineagesHeroFallback as unknown as Parameters<typeof UniversalEditorialHero>[0]['fallbackConfig']} />

      <div className="container-fluid mx-auto px-4 md:px-10 py-12 max-w-7xl animate-fadeIn">
        
        {/* Scholarly Statement */}
        <div className="bg-[#3E2723]/5 border-l-4 border-[#3E2723] p-8 mb-12 rounded-r-xs max-w-5xl">
          <p className="text-gray-700 text-base md:text-lg leading-relaxed font-serif">
            This page functions as KHCRF’s <strong>genealogical and knowledge-transmission archive</strong>. It documents how craft knowledge travels across families, workshops, master–apprentice relationships, villages, communities, institutions, and generations. This section must <strong>not</strong> become a directory of surnames or a collection of unverified family claims. Its purpose is to preserve <strong>documented relationships of teaching, practice, influence, migration, continuity, and change</strong>.
          </p>
          <p className="text-gray-755 text-xs mt-3 uppercase tracking-widest font-bold font-mono">
            Craft traditions survive through people. Skills are taught by parents, grandparents, workshop masters, senior artisans, neighbours, cooperative instructors, and community practitioners. These relationships form lineages of knowledge that may extend across generations, workshops, villages, and regions. The KHCRF Craft Lineages Archive documents these connections through oral testimony, family records, workshop histories, apprenticeship evidence, objects, photographs, technical comparisons, and field research. Each lineage is presented as a documented knowledge network rather than an unquestioned genealogy. Confirmed relationships, oral traditions, disputed claims, missing generations, and uncertain connections are clearly distinguished.
          </p>
          <div className="bg-yellow-50/50 border border-yellow-200 p-4 my-6 font-mono text-[10px] text-yellow-800 leading-relaxed">
            <strong>Important Interpretive Principle:</strong> A craft lineage is not limited to blood relationship. Many of Kashmir&apos;s most important craft traditions have survived through Ustad–Shagird relationships, workshop mentorship, cooperative learning, neighbourhood transmission, women&apos;s household networks, institutional training, migration and resettlement, and collaborative production.
          </div>
          <div className="flex flex-wrap gap-4 mt-6 font-mono text-xs">
            <a href="#results" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-5 py-2.5 font-bold uppercase tracking-wider transition-all">
              Explore Craft Lineages
            </a>
            <a href="#nomination-section" className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-5 py-2.5 font-bold uppercase tracking-wider transition-all">
              Document a Lineage
            </a>
            <a href="#methodology" className="text-[#3E2723] hover:underline font-bold py-2.5">
              Read Lineage Research Standards &rarr;
            </a>
          </div>
        </div>

        {/* Featured Lineage Card */}
        <section className="bg-white border-4 border-[#3E2723] p-8 md:p-10 mb-16 relative shadow-md">
          <div className="absolute top-0 right-0 bg-[#3E2723] text-[#D4AF37] px-4 py-1 text-[10px] font-mono font-bold uppercase tracking-widest">
            FEATURED CRAFT LINEAGE
          </div>
          
          <div className="max-w-4xl font-mono">
            <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-1">
              Archive Record: {featuredLineage.lineageNumber}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3E2723] leading-tight mb-2">
              {featuredLineage.title}
            </h2>
            <h3 className="text-base md:text-lg font-serif italic text-gray-550 mb-4">
              {featuredLineage.subtitle}
            </h3>
            
            <p className="text-gray-700 text-sm leading-relaxed mb-6 font-sans text-gray-655">
              {featuredLineage.summary}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 font-mono text-[10px] border-t border-b border-gray-250 py-3 bg-gray-55 px-4">
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Craft</span>
                <span className="font-bold text-[#3E2723]">{featuredLineage.primaryCraft}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Origin</span>
                <span className="font-bold text-[#3E2723]">{featuredLineage.placeOfOrigin}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Generations Traced</span>
                <span className="font-bold text-[#3E2723]">{featuredLineage.generationCount}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Continuity Status</span>
                <span className="font-bold text-[#D4AF37] font-bold">{featuredLineage.continuityStatus}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => { setActiveLineage(featuredLineage); setActiveModalTab('overview'); }}
                className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-all font-mono"
              >
                Explore Lineage &rarr;
              </button>
            </div>
          </div>
        </section>

        {/* Why Lineages Matter Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start mt-12">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-serif text-[#3E2723] mb-6 font-bold">How Does Craft Knowledge Survive?</h2>
            <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans">
              Traditional craft knowledge is rarely preserved in a single manual or institution. It is carried through repeated practice, correction, observation, memory, discipline, and trust. By recording these relationships, KHCRF helps explain not only who practiced a craft, but how technical knowledge and artistic identity were transmitted.
            </p>
            <p className="text-gray-605 text-sm leading-relaxed font-sans">
              Lineages map the intergenerational movements of technical wisdom, safeguarding raw material recipes and motor design blueprints from fading.
            </p>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#3E2723]/10 p-8 rounded-xs shadow-xs">
            <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 font-mono">
              Lineage Transmission Factors:
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700 font-sans font-mono">
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>parent to child</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>unrelated master (Ustad-Shagird)</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>former apprentice workshops</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>women within households</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>families changing crafts over time</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>village clusters and cooperatives</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>displaced/relocated workshops</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>revived interrupted branches</li>
            </ul>
          </div>
        </section>

        {/* Archive Overview Dashboard */}
        <section className="bg-[#3E2723] text-white p-8 md:p-10 mb-12 rounded-xs relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#3E2723] px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-widest">
            Registry Overview
          </div>
          <div className="mb-8 font-mono">
            <h3 className="font-serif text-2xl text-[#D4AF37] mb-2 font-bold font-serif">Craft Lineages Overview</h3>
            <p className="text-white/60 text-xs">
              INTERGENERATIONAL NETWORK &amp; DIRECT TRANSMISSION REGISTRY
            </p>
          </div>

          {/* Primary Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 text-center md:text-left border-b border-white/10 pb-8 mb-8">
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Documented Lineages</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">74</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono font-mono">Generations Traced</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">286</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Artisans Connected</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">642</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Workshops Represented</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">119</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono font-mono">Craft Traditions</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">12</span>
            </div>
            <div className="last:border-0">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Districts Documented</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">10</span>
            </div>
          </div>

          {/* Secondary Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 text-center md:text-left font-mono">
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Family Lineages</span>
              <span className="text-xl font-serif font-semibold text-white/80 font-mono">39</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Master-Apprentice</span>
              <span className="text-xl font-serif font-semibold text-white/80">51</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono font-mono">Women-Led Lineages</span>
              <span className="text-xl font-serif font-semibold text-white/80 font-mono">18</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Active Lineages</span>
              <span className="text-xl font-serif font-semibold text-white/80">46</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Interrupted Lineages</span>
              <span className="text-xl font-serif font-semibold text-white/80">17</span>
            </div>
            <div className="last:border-0">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono font-mono">Revival Lineages</span>
              <span className="text-lg font-serif font-semibold text-[#D4AF37] block leading-tight font-mono">11</span>
            </div>
          </div>
        </section>

        {/* View Switcher Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 bg-[#FAF9F6] border border-[#3E2723]/10 p-4 font-mono" id="results">
          <div className="text-xs font-serif text-[#3E2723]">
            KHCRF Lineages Directory &bull; Showing {sortedLineages.length} Documented Lineage Records
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] text-gray-400 uppercase self-center mr-2 font-mono">Archive Layout View:</span>
            <button 
              onClick={() => { setCurrentView('stories'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'stories' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Lineage Stories
            </button>
            <button 
              onClick={() => { setCurrentView('map'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'map' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Relationship Map
            </button>
            <button 
              onClick={() => { setCurrentView('timeline'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'timeline' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Generational Timeline
            </button>
            <button 
              onClick={() => { setCurrentView('index'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'index' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Research Index
            </button>
          </div>
        </div>

        {/* Search and Discovery Layout */}
        <section className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Filters Sidebar */}
          {currentView !== 'map' && currentView !== 'timeline' && (
            <div className="w-full lg:w-1/4 bg-white border border-[#3E2723]/10 p-6 shadow-xs sticky top-4 z-10 font-sans">
              <h3 className="font-serif text-lg text-[#3E2723] mb-6 pb-2 border-b border-gray-100 flex items-center justify-between font-bold">
                <span>Filter Archive</span>
                <button 
                  onClick={() => {
                    setSelectedLineageType('All');
                    setSelectedCraft('All');
                    setSelectedStatus('All');
                    setSelectedTransmission('All');
                    setSelectedDepth('All');
                    setSelectedGeography('All');
                    setSelectedEvidence('All');
                    setSelectedGender('All');
                    setSelectedSort('Featured');
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="text-[10px] text-[#3949AB] hover:underline font-bold uppercase tracking-wider font-mono"
                >
                  Reset
                </button>
              </h3>

              <div className="space-y-6 text-xs">
                {/* Search Field */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Search Keyword</label>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder="Search by artisan, family, workshop, craft, village, district, teacher..."
                    className="w-full border border-gray-200 px-3 py-2 text-xs rounded-none bg-[#FAF9F6] text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  />
                </div>

                {/* Lineage Type */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Lineage Type</label>
                  <select 
                    value={selectedLineageType}
                    onChange={(e) => { setSelectedLineageType(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Types</option>
                    <option value="Family Lineage">Family Lineage</option>
                    <option value="Master–Apprentice Lineage">Master–Apprentice Lineage</option>
                    <option value="Workshop Lineage">Workshop Lineage</option>
                    <option value="Women’s Household Lineage">Women&apos;s Household Lineage</option>
                    <option value="Community Lineage">Community Lineage</option>
                    <option value="Village Tradition">Village Tradition</option>
                    <option value="Cooperative Lineage">Cooperative Lineage</option>
                    <option value="Institutional Training Lineage">Institutional Training Lineage</option>
                    <option value="Migrated Lineage">Migrated Lineage</option>
                    <option value="Revival Lineage">Revival Lineage</option>
                    <option value="Interrupted Lineage">Interrupted Lineage</option>
                    <option value="Multi-Branch Lineage">Multi-Branch Lineage</option>
                  </select>
                </div>

                {/* Craft Filter */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Craft Tradition</label>
                  <select 
                    value={selectedCraft}
                    onChange={(e) => { setSelectedCraft(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Crafts</option>
                    <option value="Hand-Knotted Carpet">Hand-Knotted Carpet</option>
                    <option value="Pashmina Weaving">Pashmina Weaving</option>
                    <option value="Kani Weaving">Kani Weaving</option>
                    <option value="Sozni Embroidery">Sozni Embroidery</option>
                    <option value="Crewel Embroidery">Crewel Embroidery</option>
                    <option value="Papier-Mâché">Papier-Mâché</option>
                    <option value="Walnut Wood Carving">Walnut Wood Carving</option>
                    <option value="Copperware">Copperware</option>
                    <option value="Namda">Namda</option>
                    <option value="Willow Wicker">Willow Wicker</option>
                    <option value="Chain Stitch">Chain Stitch</option>
                    <option value="Multi-Craft">Multi-Craft</option>
                  </select>
                </div>

                {/* Lineage Status */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Lineage Status</label>
                  <select 
                    value={selectedStatus}
                    onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Continuing">Continuing</option>
                    <option value="At Risk">At Risk</option>
                    <option value="Interrupted">Interrupted</option>
                    <option value="Revived">Revived</option>
                    <option value="Historical">Historical</option>
                    <option value="Disputed">Disputed</option>
                  </select>
                </div>

                {/* Transmission Method */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Transmission Method</label>
                  <select 
                    value={selectedTransmission}
                    onChange={(e) => { setSelectedTransmission(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Methods</option>
                    <option value="Parent to Child">Parent to Child</option>
                    <option value="Grandparent to Grandchild">Grandparent to Grandchild</option>
                    <option value="Ustad–Shagird">Ustad–Shagird</option>
                    <option value="Workshop Training">Workshop Training</option>
                    <option value="Community Learning">Community Learning</option>
                    <option value="Cooperative Training">Cooperative Training</option>
                  </select>
                </div>

                {/* Generation Depth */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Generation Depth</label>
                  <select 
                    value={selectedDepth}
                    onChange={(e) => { setSelectedDepth(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Depths</option>
                    <option value="Two Generations">Two Generations</option>
                    <option value="Three Generations">Three Generations</option>
                    <option value="Four Generations">Four Generations</option>
                    <option value="Five or More Generations">Five or More Generations</option>
                  </select>
                </div>

                {/* Geography */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">District Origin</label>
                  <select 
                    value={selectedGeography}
                    onChange={(e) => { setSelectedGeography(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Districts</option>
                    <option value="Srinagar">Srinagar</option>
                    <option value="Budgam">Budgam</option>
                    <option value="Ganderbal">Ganderbal</option>
                    <option value="Baramulla">Baramulla</option>
                    <option value="Anantnag">Anantnag</option>
                  </select>
                </div>

                {/* Gender Composition */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Gender Composition</label>
                  <select 
                    value={selectedGender}
                    onChange={(e) => { setSelectedGender(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Compositions</option>
                    <option value="Women-Led">Women-Led</option>
                    <option value="Men-Led">Men-Led</option>
                    <option value="Mixed-Gender">Mixed-Gender</option>
                    <option value="Household-Based">Household-Based</option>
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
                    <option value="Recently Documented">Recently Documented</option>
                    <option value="Longest Documented Lineage">Longest Documented Lineage</option>
                    <option value="Most Generations">Most Generations</option>
                    <option value="Most Artisans">Most Artisans</option>
                    <option value="Craft Tradition">Craft Tradition</option>
                    <option value="District">District</option>
                    <option value="Active Lineages">Active Lineages</option>
                    <option value="At-Risk Lineages">At-Risk Lineages</option>
                  </select>
                </div>

              </div>
            </div>
          )}

          {/* Results Area */}
          <div className={`w-full ${currentView === 'map' || currentView === 'timeline' ? 'lg:w-full' : 'lg:w-3/4'}`}>

            {loading ? (
              <div className="py-20 text-center text-gray-505 font-serif font-bold">Loading lineages...</div>
            ) : (
              <>
                {/* 1. LINEAGE STORIES VIEW */}
                {currentView === 'stories' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                    {paginatedLineages.map((l, i) => (
                      <div 
                        key={i} 
                        className="bg-white border-2 border-[#3E2723]/35 py-8 px-6 hover:bg-[#3E2723]/5 transition-all duration-300 group flex flex-col justify-between shadow-sm relative grid-ledger font-mono text-xs text-gray-700"
                      >
                        <div>
                          {/* Accession ID & Generations header */}
                          <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5 font-semibold">
                            <span>{l.lineageNumber}</span>
                            <span>{l.generationCount} GENERATIONS</span>
                          </div>

                          {/* Lineage Type & Craft */}
                          <div className="text-[9px] font-mono text-[#D4AF37] font-bold uppercase tracking-widest mb-4">
                            {l.lineageType.toUpperCase()} &bull; {l.primaryCraft.toUpperCase()}
                          </div>

                          {/* Title */}
                          <h3 
                            onClick={() => { setActiveLineage(l); setActiveModalTab('overview'); }}
                            className="text-xl md:text-2xl font-serif font-bold text-[#3E2723] leading-snug cursor-pointer group-hover:text-[#D4AF37] transition-colors"
                          >
                            {l.title}
                          </h3>

                          {l.subtitle && (
                            <h4 className="text-xs font-serif italic text-gray-500 mt-1 leading-snug mb-3">
                              {l.subtitle}
                            </h4>
                          )}

                          <p className="text-gray-655 text-xs leading-relaxed mb-4 font-sans line-clamp-3 mt-3">
                            {l.summary}
                          </p>

                          {/* Geographic origin info */}
                          <div className="relative pl-4 mb-4 border-l-2 border-[#D4AF37]/50 font-mono text-[10px] leading-relaxed my-4">
                            <span className="text-[9px] text-gray-400 uppercase tracking-wider block mb-1">
                              GEOGRAPHIC ORIGIN &bull; EVIDENCE CONFIDENCE
                            </span>
                            <span className="font-bold text-[#3E2723]">
                              {l.placeOfOrigin} ({l.evidenceConfidence})
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="text-[#3E2723]/25 text-[9px] font-mono mb-3 select-none">
                            ─────╱╲──╱────╲╱─────
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto font-mono">
                            <span className="bg-[#3E2723]/5 border border-[#3E2723]/10 text-[#3E2723] text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider">
                              {l.continuityStatus.toUpperCase()}
                            </span>
                            
                            <button 
                              onClick={() => { setActiveLineage(l); setActiveModalTab('overview'); }}
                              className="text-xs font-bold uppercase tracking-widest text-[#3E2723] hover:text-[#D4AF37] transition-colors font-mono"
                            >
                              Explore Lineage &rarr;
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

                {/* 2. RELATIONSHIP MAP VIEW */}
                {currentView === 'map' && (
                  <div className="bg-white border-2 border-[#3E2723] p-6 shadow-md animate-fadeIn font-mono text-xs text-[#3E2723]">
                    <span className="text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest block mb-1">FEATURED TRANSMISSION GRAPH</span>
                    <h3 className="font-serif text-lg font-bold mb-4 border-b border-gray-150 pb-2">{featuredLineage.title} &bull; Relationship Map</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* Left: General relationship tree view */}
                      <div className="lg:col-span-7 space-y-4">
                        {renderTree(featuredLineage.treeData)}
                      </div>

                      {/* Right: Technical Details panel */}
                      <div className="lg:col-span-5 bg-[#FAF9F6] border border-gray-250 p-5 space-y-3">
                        <span className="text-[#D4AF37] font-bold text-[8px] block uppercase">LINEAGE ATTRIBUTES</span>
                        <h4 className="font-serif text-base font-bold">{featuredLineage.title}</h4>
                        <div className="text-[10px] space-y-1 text-gray-700">
                          <div><strong>Transmission Method:</strong> {featuredLineage.transmissionMethod}</div>
                          <div><strong>District:</strong> {featuredLineage.placeOfOrigin}</div>
                          <div><strong>Documented Generations:</strong> {featuredLineage.generationCount}</div>
                          <div><strong>Known Artisans connected:</strong> {featuredLineage.personCount} practitioners</div>
                        </div>
                        <div className="pt-2 border-t border-gray-150">
                          <strong className="text-gray-400 text-[8px] block uppercase font-bold">Skills Transmitted</strong>
                          <div className="flex gap-1 flex-wrap mt-1 text-[8px] uppercase tracking-wider font-bold">
                            {featuredLineage.skillsTransmitted.map((sk, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 bg-white border border-gray-200 text-gray-600">{sk}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* 3. GENERATIONAL TIMELINE VIEW */}
                {currentView === 'timeline' && (
                  <div className="bg-white border-2 border-[#3E2723] p-6 shadow-md animate-fadeIn font-mono text-xs text-[#3E2723]">
                    <span className="text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest block mb-1 font-mono">CHRONOLOGICAL LOOM RECORDS</span>
                    <h3 className="font-serif text-lg font-bold mb-6 border-b border-gray-150 pb-2">{featuredLineage.title} &bull; Generational Timeline</h3>
                    <div className="border-l-2 border-[#3E2723]/20 pl-6 space-y-6 relative max-w-2xl mx-auto">
                      {featuredLineage.timeline.map((ev, idx) => (
                        <div key={idx} className="relative">
                          <div className="absolute -left-[29px] top-1 bg-[#3E2723] w-2.5 h-2.5 rounded-full border-2 border-white"></div>
                          <span className="font-bold text-[#D4AF37] text-sm block mb-1">{ev.year}</span>
                          <p className="text-gray-600 text-[11px] leading-relaxed">{ev.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. RESEARCH INDEX VIEW */}
                {currentView === 'index' && (
                  <div className="bg-white border border-[#3E2723]/10 overflow-x-auto shadow-sm animate-fadeIn">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#3E2723] text-[#D4AF37] font-mono uppercase tracking-wider text-[10px]">
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Lineage No</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Title & Generational Scope</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Craft</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Origin</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center font-mono">Gens</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center font-mono">Artisans</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center font-mono">Workshops</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Evidence Status</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center font-mono">Continuity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#3E2723]/10 font-sans text-gray-700">
                        {paginatedLineages.map((l, idx) => (
                          <tr key={idx} className="hover:bg-[#FAF9F6] transition-colors cursor-pointer" onClick={() => { setActiveLineage(l); setActiveModalTab('overview'); }}>
                            <td className="p-4 font-mono font-bold text-gray-500 whitespace-nowrap">{l.lineageNumber}</td>
                            <td className="p-4">
                              <div className="font-serif font-bold text-[#3E2723] text-sm hover:text-[#D4AF37] transition-colors">{l.title}</div>
                              <div className="text-[10px] text-gray-400 font-light truncate max-w-xs">{l.subtitle}</div>
                            </td>
                            <td className="p-4 whitespace-nowrap font-bold">{l.primaryCraft}</td>
                            <td className="p-4 whitespace-nowrap">{l.placeOfOrigin}</td>
                            <td className="p-4 text-center font-mono font-bold text-[#3E2723]">{l.generationCount}</td>
                            <td className="p-4 text-center font-mono">{l.personCount}</td>
                            <td className="p-4 text-center font-mono">{l.workshopCount}</td>
                            <td className="p-4 whitespace-nowrap font-mono">{l.evidenceTypes[0]}</td>
                            <td className="p-4 text-center whitespace-nowrap font-mono">
                              <span className="px-2 py-0.5 font-mono text-[9px] uppercase border border-[#3E2723]/20 bg-[#3E2723]/5 text-[#3E2723] font-bold">
                                {l.continuityStatus}
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
            {currentView !== 'map' && currentView !== 'timeline' && totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12 pt-8 border-t border-gray-100 font-mono">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="w-10 h-10 border border-gray-300 flex items-center justify-center text-gray-555 hover:border-[#3E2723] hover:text-[#3E2723] disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-mono"
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
                  className="w-10 h-10 border border-gray-305 flex items-center justify-center text-gray-555 hover:border-[#3E2723] hover:text-[#3E2723] disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-mono"
                >
                  &rarr;
                </button>
              </div>
            )}
          </div>

        </section>

        {/* Documentation Methodology */}
        <section className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs mt-16" id="methodology">
          <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold">
            How KHCRF Documents Craft Lineages
          </h2>
          <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans">
            Craft Lineages are developed through a combination of field research, oral histories, workshop documentation, family records, object analysis, museum catalogues, technical comparison, and community review. KHCRF maps lineages to preserve knowledge transmission, not to establish social superiority, hereditary privilege, caste authority, or exclusive ownership of a craft tradition.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 text-xs font-mono">
            <div>
              <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3 font-mono">Research Workflow</h3>
              <ol className="list-decimal pl-4 space-y-2 text-gray-600">
                <li>Lineage nomination and preliminary scope review</li>
                <li>Identification of living participants and consent agreement</li>
                <li>Oral-history interviews and family/workshop record review</li>
                <li>Object and tool documentation with relationship mapping</li>
                <li>Technical comparison and community review</li>
                <li>Evidence classification, editorial/scholarly review, and publication</li>
              </ol>
            </div>
            <div>
              <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3 font-mono">Research Principles</h3>
              <ul className="list-disc pl-4 space-y-2 text-gray-600">
                <li>no fabricated ancestry or automatic acceptance of prestige claims</li>
                <li>equal recognition of family and non-family teaching (Ustad-Shagird)</li>
                <li>transparent evidence classification with conflicting testimony preserved</li>
                <li>consent protection and recognition of women&apos;s contributions</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Research & Educational Use */}
        <section className="bg-white border border-[#3E2723]/25 p-8 md:p-10 mb-16 rounded-xs shadow-sm">
          <h2 className="text-2xl font-serif text-[#3E2723] mb-4 font-bold">Using the Craft Lineages Archive</h2>
          <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans">
            The archive may support craft history, apprenticeship research, genealogy of technical knowledge, workshop studies, museum interpretation, education and curriculum development, heritage policy, and conservation planning.
          </p>
          <div className="flex gap-4 font-mono">
            <Link href="mailto:research@khcrf.org" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3 font-bold uppercase tracking-wider text-xs transition-colors">
              Request Research Access
            </Link>
            <a href="#nomination-section" className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-6 py-3 font-bold uppercase tracking-wider text-xs transition-colors">
              Explore Lineage Data
            </a>
          </div>
        </section>

        {/* Document a Lineage Form */}
        <section id="nomination-section" className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs">
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase block mb-1 font-mono">Help Preserve a Craft Lineage</span>
            <h2 className="text-3xl font-serif text-[#3E2723] font-bold">Submit Lineage Proposal</h2>
            <p className="text-gray-500 text-xs font-mono mt-1">Artisans, families, workshops, cooperatives, and community members are invited to propose a lineage.</p>
          </div>

          <div className="bg-[#FAF9F6] p-6 md:p-8 border border-gray-250">
            {nominationSubmitted ? (
              <div className="text-center py-8 font-mono">
                <h3 className="text-lg font-bold text-green-600 mb-2">Lineage Proposal Staged</h3>
                <p className="text-xs text-gray-500">Thank you. KHCRF field research teams will review the details and contact the elders for oral histories verification.</p>
              </div>
            ) : (
              <form onSubmit={handleNominationSubmit} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Proposed Lineage Name *</label>
                    <input 
                      required 
                      type="text" 
                      value={nominationForm.title}
                      onChange={(e) => setNominationForm({...nominationForm, title: e.target.value})}
                      placeholder="e.g. The Wani Kani Weavers"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Primary Craft *</label>
                    <input 
                      required 
                      type="text" 
                      value={nominationForm.craft}
                      onChange={(e) => setNominationForm({...nominationForm, craft: e.target.value})}
                      placeholder="e.g. Kani Weaving"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Place of Origin *</label>
                    <input 
                      required
                      type="text" 
                      value={nominationForm.origin}
                      onChange={(e) => setNominationForm({...nominationForm, origin: e.target.value})}
                      placeholder="e.g. Kanihama, Budgam"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Earliest Known Practitioner</label>
                    <input 
                      type="text" 
                      value={nominationForm.earliestPractitioner}
                      onChange={(e) => setNominationForm({...nominationForm, earliestPractitioner: e.target.value})}
                      placeholder="e.g. Ghulam Ahmad Wani (c. 1932)"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Generations Count *</label>
                    <input 
                      required
                      type="text" 
                      value={nominationForm.generations}
                      onChange={(e) => setNominationForm({...nominationForm, generations: e.target.value})}
                      placeholder="e.g. 4 Generations"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Known Teachers &amp; Apprentices</label>
                    <input 
                      type="text" 
                      value={nominationForm.teachers}
                      onChange={(e) => setNominationForm({...nominationForm, teachers: e.target.value})}
                      placeholder="e.g. Sultan Wani taught Ali Wani"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-500 mb-1">Reason for Documentation *</label>
                  <textarea 
                    required 
                    rows={4} 
                    value={nominationForm.reason}
                    onChange={(e) => setNominationForm({...nominationForm, reason: e.target.value})}
                    placeholder="Describe why documenting this lineage is vital (e.g. preserves rare Kani pattern coding, traces women's home-based sozni circles)..."
                    className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723] resize-none" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Associated Workshops / Objects</label>
                    <textarea 
                      rows={2} 
                      value={nominationForm.appCategory}
                      onChange={(e) => setNominationForm({...nominationForm, appCategory: e.target.value})}
                      placeholder="List historical workshops or signed family shawls/objects..."
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723] resize-none" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Supporting Documentation / Contact Info *</label>
                    <textarea 
                      required
                      rows={2} 
                      value={nominationForm.contact}
                      onChange={(e) => setNominationForm({...nominationForm, contact: e.target.value})}
                      placeholder="Provide names of living practitioners, family record references, and email/phone..."
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723] resize-none" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-[#3E2723] hover:bg-[#D4AF37] text-white hover:text-[#3E2723] font-bold uppercase tracking-widest transition-colors font-mono"
                >
                  Submit Lineage Proposal
                </button>
              </form>
            )}
          </div>
        </section>

      </div>

      {/* FOOTER STATEMENT */}
      <footer className="bg-[#3E2723] py-16 px-4 md:px-10 text-white/90">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto"></div>
          <p className="font-serif italic text-lg leading-relaxed text-white/80 max-w-3xl mx-auto font-mono">
            &ldquo;KHCRF Craft Lineages preserve the human relationships through which knowledge survives. By documenting families, teachers, apprentices, workshops, communities, movements, interruptions, and revivals, the archive reveals how Kashmir’s craft traditions have travelled across generations and how their future depends upon the continued transmission of skill.&rdquo;
          </p>
          <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto"></div>
        </div>
      </footer>

    </main>
  );
}
