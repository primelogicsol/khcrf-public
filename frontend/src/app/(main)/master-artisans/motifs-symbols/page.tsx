'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { motifsSymbolsHeroFallback } from '@/config/heroFallbacks';

interface MotifAnatomy {
  partName: string;
  description: string;
}

interface GrammarRule {
  ruleType: string;
  horizontalUnit: string;
  verticalUnit: string;
  explanation: string;
}

interface MeaningEvidence {
  interpretation: string;
  evidenceClass: 'Artisan Testimony' | 'Historical Source' | 'Museum Attribution' | 'Scholarly Interpretation' | 'Commercial Description';
  confidence: 'HIGH CONFIDENCE' | 'MODERATE CONFIDENCE' | 'CONTEXT-DEPENDENT' | 'TRADITIONALLY ASSOCIATED' | 'COMPARATIVE INTERPRETATION' | 'DISPUTED' | 'UNVERIFIED' | 'UNKNOWN';
  supportingNote: string;
}

interface CraftAdaptation {
  craftName: string;
  adaptationStyle: string;
  technicalConstraints: string;
}

interface MotifRecord {
  slug: string;
  motifNumber: string;
  primaryName: string;
  localName: string;
  category: 'Floral' | 'Botanical' | 'Tree' | 'Fruit' | 'Leaf' | 'Animal' | 'Bird' | 'Architectural' | 'Geometric' | 'Calligraphic' | 'Abstract';
  visualForm: 'Naturalistic' | 'Stylized' | 'Geometric' | 'Abstracted';
  primaryCrafts: string[];
  designFunction: string;
  historicalPeriod: string;
  geography: string;
  knownVariantsCount: number;
  referencedObjectsCount: number;
  earliestUse: string;
  confidenceRating: 'High' | 'Moderate' | 'Low' | 'Context-Dependent';
  status: 'Fully Documented' | 'Artisan-Verified' | 'Scholarly Review Complete' | 'Under Research' | 'Archive Preview' | 'Interpretation Restricted';
  version: string;
  summary: string;
  whyItMatters: string;
  historicalBackground: string;
  objectiveVisualDescription: string;
  definingCharacteristics: string[];
  anatomy: MotifAnatomy[];
  grammar: GrammarRule[];
  meanings: MeaningEvidence[];
  craftAdaptations: CraftAdaptation[];
  commonMisidentifications: string[];
  referencedObjects: string[];
}

export default function MotifsSymbols() {
  const [allMotifs] = useState<MotifRecord[]>([
    {
      slug: "ro-chinar-leaf",
      motifNumber: "KHCRF-MOT-2026-001",
      primaryName: "The Chinar",
      localName: "Chinar-Patt",
      category: "Botanical",
      visualForm: "Stylized",
      primaryCrafts: ["Carpet", "Sozni", "Papier-Mâché", "Walnut Wood", "Copperware"],
      designFunction: "Border & Field motifs",
      historicalPeriod: "18th Century to Present",
      geography: "Kashmir Valley Widespread",
      knownVariantsCount: 37,
      referencedObjectsCount: 126,
      earliestUse: "Mughal period structures and early shawl fragments",
      confidenceRating: "High",
      status: "Fully Documented",
      version: "v4.0",
      summary: "The Chinar appears across Kashmir’s material culture in naturalistic, stylized, geometric, and abstract forms. It may be represented as an individual leaf, a branching tree, a repeated border, a central composition, or an autumnal colour field. Its widespread use has been associated with landscape, seasonal change, place, cultural memory, public identity, and artistic continuity. However, these meanings vary across objects, periods, workshops, and contemporary interpretations.",
      whyItMatters: "A motif does not always possess one fixed or universal meaning. KHCRF distinguishes between verified historical evidence and popular commercial symbol descriptions.",
      historicalBackground: "The Chinar leaf was adopted into regional ornamental repertoires as mature Chinar groves became royal garden anchors during the 16th-17th centuries.",
      objectiveVisualDescription: "A broad, lobed leaf form with a central stem and radiating veins. Variants range from botanically observed representations to simplified angular forms adapted for weaving, engraving, and repeated borders.",
      definingCharacteristics: [
        "Broad leaf structure with 5 to 7 pointed lobes",
        "Central axis stem",
        "Radiating vein lines",
        "Often rendered in autumnal palettes (rust, orange, copper)"
      ],
      anatomy: [
        { partName: "Central Axis stem", description: "The core dividing line anchors the leaf orientation." },
        { partName: "Lobed Outer Contour", description: "Pointed leaf points mirror natural rubia structures." }
      ],
      grammar: [
        { ruleType: "Border Sequence", horizontalUnit: "60mm", verticalUnit: "60mm", explanation: "Leaves alternate upward and downward orientations connected by an S-scroll vine line." }
      ],
      meanings: [
        { interpretation: "Seasonal Change & Autumnal Memory", evidenceClass: "Artisan Testimony", confidence: "HIGH CONFIDENCE", supportingNote: "Weavers select orange and rust silks specifically to represent seasonal decay." },
        { interpretation: "Paradise garden landscape representation", evidenceClass: "Scholarly Interpretation", confidence: "CONTEXT-DEPENDENT", supportingNote: "Usually associated with centralized garden grid panels in palace carpets." },
        { interpretation: "General Prosperity & Luxury", evidenceClass: "Commercial Description", confidence: "UNVERIFIED", supportingNote: "Modern retail catalogs assign this symbol to boost buyer aesthetic value." }
      ],
      craftAdaptations: [
        { craftName: "Carpet", adaptationStyle: "Geometric grid adaptation", technicalConstraints: "Restricted by vertical wrap knot densities; curves become stepped diagonals." },
        { craftName: "Sozni", adaptationStyle: "Directional split-stitch filling", technicalConstraints: "Stitch directions follow leaf vein directions to catch reflective light." },
        { craftName: "Papier-Mâché", adaptationStyle: "Naturalistic painted gradients", technicalConstraints: "Outline contours are established with fine cat-hair brushes using liquid gold ink." }
      ],
      commonMisidentifications: ["Maple leaf", "Grape leaf", "Sycamore leaf"],
      referencedObjects: ["KHCRF-OBJ-2026-0142", "KHCRF-OBJ-2026-0218", "KHCRF-OBJ-2026-0311"]
    },
    {
      slug: "ro-cypress-tree",
      motifNumber: "KHCRF-SYM-2026-012",
      primaryName: "The Cypress",
      localName: "Sarv",
      category: "Tree",
      visualForm: "Stylized",
      primaryCrafts: ["Carpet", "Kani", "Sozni", "Papier-Mâché"],
      designFunction: "Central field columns & border dividers",
      historicalPeriod: "17th Century onwards",
      geography: "Srinagar & Budgam weaving centres",
      knownVariantsCount: 19,
      referencedObjectsCount: 42,
      earliestUse: "17th century Safavid and Mughal textile collections",
      confidenceRating: "Context-Dependent",
      status: "Scholarly Review Complete",
      version: "v2.5",
      summary: "The Cypress appears as a vertical, tapered tree form, representing stability, garden symmetry, and eternal life. Its representation ranges from naturalistic evergreen trees to highly stylized bent cones that merge with the Boteh (paisley) form.",
      whyItMatters: "The Cypress demonstrates how motifs migrate across crafts, carrying Persianate courtly garden aesthetics into Kashmiri village shawl looms.",
      historicalBackground: "Rooted in Persian visual traditions where the cypress represents the upright stature of the beloved or the tree of life.",
      objectiveVisualDescription: "A tall, slender, conical form with dense diagonal texture layers representing dense evergreen foliage.",
      definingCharacteristics: [
        "Symmetrical vertical taper",
        "Pointed apex, occasionally curved (bent-tip)",
        "Diagonal texture layers"
      ],
      anatomy: [
        { partName: "Apex Tip", description: "The crown taper indicates whether the form is classical upright or bent-style." }
      ],
      grammar: [
        { ruleType: "Staggered Field Repeat", horizontalUnit: "120mm", verticalUnit: "240mm", explanation: "Cypress columns rise in staggered rows to populate carpet fields." }
      ],
      meanings: [
        { interpretation: "Eternity & Lifecycle Continuity", evidenceClass: "Museum Attribution", confidence: "MODERATE CONFIDENCE", supportingNote: "Associated with permanent green foliage life-cycles in funerary cloths." }
      ],
      craftAdaptations: [
        { craftName: "Kani", adaptationStyle: "Vertical twill weave block", technicalConstraints: "Requires precise weft color lock intervals to maintain tapered contours." }
      ],
      commonMisidentifications: ["Poplar tree", "Pine cone", "Boteh"],
      referencedObjects: ["KHCRF-OBJ-2026-0005", "KHCRF-OBJ-2026-0184"]
    }
  ]);

  const [loading] = useState(false);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedVisualForm, setSelectedVisualForm] = useState('All');
  const [selectedCraft, setSelectedCraft] = useState('All');
  const [selectedMeaning, setSelectedMeaning] = useState('All');
  const [selectedPeriod, setSelectedPeriod] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Featured');

  const [activeMotif, setActiveMotif] = useState<MotifRecord | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'overview' | 'anatomy' | 'grammar' | 'symbolism' | 'variations'>('overview');
  const [currentView, setCurrentView] = useState<'archive' | 'atlas' | 'comparison' | 'grammar' | 'index'>('archive');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Proposal form state
  const [proposalForm, setProposalForm] = useState({
    title: '',
    localName: '',
    craft: '',
    category: '',
    description: '',
    meaning: '',
    evidence: '',
    contact: ''
  });
  const [proposalSubmitted, setProposalSubmitted] = useState(false);

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProposalSubmitted(true);
    setTimeout(() => {
      setProposalSubmitted(false);
      setProposalForm({
        title: '',
        localName: '',
        craft: '',
        category: '',
        description: '',
        meaning: '',
        evidence: '',
        contact: ''
      });
    }, 4000);
  };

  const filteredMotifs = allMotifs.filter(m => {
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchText = `${m.primaryName} ${m.localName} ${m.motifNumber} ${m.category} ${m.summary} ${m.whyItMatters} ${m.objectiveVisualDescription}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    // Category
    if (selectedCategory !== 'All' && m.category !== selectedCategory) return false;

    // Visual Form
    if (selectedVisualForm !== 'All' && m.visualForm !== selectedVisualForm) return false;

    // Craft
    if (selectedCraft !== 'All' && !m.primaryCrafts.includes(selectedCraft)) return false;

    // Meaning
    if (selectedMeaning !== 'All') {
      const hasMeaning = m.meanings.some(mean => mean.interpretation.toLowerCase().includes(selectedMeaning.toLowerCase()));
      if (!hasMeaning) return false;
    }

    // Period
    if (selectedPeriod !== 'All' && !m.historicalPeriod.includes(selectedPeriod)) return false;

    // Status
    if (selectedStatus !== 'All' && m.status !== selectedStatus) return false;

    return true;
  });

  // Sorting
  const sortedMotifs = [...filteredMotifs].sort((a, b) => {
    if (selectedSort === 'Recently Documented') {
      return b.motifNumber.localeCompare(a.motifNumber);
    }
    if (selectedSort === 'Motif Category') {
      return a.category.localeCompare(b.category);
    }
    if (selectedSort === 'Craft Tradition') {
      return a.primaryCrafts[0].localeCompare(b.primaryCrafts[0]);
    }
    if (selectedSort === 'Historical Period') {
      return a.historicalPeriod.localeCompare(b.historicalPeriod);
    }
    if (selectedSort === 'Interpretation Confidence') {
      return a.confidenceRating.localeCompare(b.confidenceRating);
    }
    if (selectedSort === 'Number of Variants') {
      return b.knownVariantsCount - a.knownVariantsCount;
    }
    if (selectedSort === 'A–Z') {
      return a.primaryName.localeCompare(b.primaryName);
    }
    return b.motifNumber.localeCompare(a.motifNumber); // Featured default
  });

  const totalPages = Math.ceil(sortedMotifs.length / itemsPerPage);
  const paginatedMotifs = sortedMotifs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const featuredMotif = allMotifs[0]; // The Chinar

  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pb-24 animate-fadeIn">
      
      {/* Detailed Modal Registry Sheet */}
      {activeMotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#3E2723]/40 backdrop-blur-sm" onClick={() => setActiveMotif(null)}></div>
          <div className="relative z-10 bg-[#FAF9F6] border-2 border-[#3E2723] max-w-4xl w-full p-6 md:p-8 shadow-2xl text-[#2A2A2A] max-h-[95vh] overflow-y-auto custom-scrollbar font-mono rounded-xs" role="dialog" aria-modal="true">
            <button onClick={() => setActiveMotif(null)} className="absolute top-4 right-4 text-[#3E2723]/50 hover:text-[#3E2723] text-xl font-bold font-mono">&times;</button>
            
            <div className="text-center mb-6 border-b border-[#3E2723]/25 pb-4">
              <span className="text-[#D4AF37] font-mono text-xs uppercase tracking-widest block mb-1 font-bold">KHCRF VISUAL LANGUAGE REGISTRY</span>
              <h2 className="text-xl md:text-2xl font-serif text-[#3E2723] font-bold leading-tight">{activeMotif.primaryName} ({activeMotif.localName})</h2>
              {activeMotif.category && <p className="text-gray-555 text-xs italic font-serif mt-1">{activeMotif.category} Motif Class</p>}
              
              <div className="flex flex-wrap justify-center gap-2 mt-3 font-mono text-[9px] uppercase tracking-wider text-gray-500">
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">CODE: {activeMotif.motifNumber}</span>
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">FORM: {activeMotif.visualForm}</span>
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">CONFIDENCE: {activeMotif.confidenceRating}</span>
              </div>
            </div>

            {/* Modal Tabs navigation */}
            <div className="flex flex-wrap gap-1 border-b border-[#3E2723]/20 pb-3 mb-6 text-[10px] font-mono justify-center">
              {[
                { id: 'overview', label: 'Technical Overview' },
                { id: 'anatomy', label: 'Anatomy & Form' },
                { id: 'grammar', label: 'Design Grammar' },
                { id: 'symbolism', label: 'Symbolism & Meanings' },
                { id: 'variations', label: 'Cross-Craft Adaptation' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveModalTab(tab.id as 'overview' | 'anatomy' | 'grammar' | 'symbolism' | 'variations')}
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
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2">Iconography Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div><span className="text-gray-400">PRIMARY NAME     :</span> {activeMotif.primaryName}</div>
                      <div><span className="text-gray-400">LOCAL NAME       :</span> {activeMotif.localName}</div>
                      <div><span className="text-gray-400">MOTIF CATEGORY   :</span> {activeMotif.category}</div>
                      <div><span className="text-gray-400">VISUAL FORM      :</span> {activeMotif.visualForm}</div>
                      <div><span className="text-gray-400">DESIGN FUNCTION  :</span> {activeMotif.designFunction}</div>
                    </div>
                    <div className="space-y-1">
                      <div><span className="text-gray-400">GEOGRAPHY FOCUS  :</span> {activeMotif.geography}</div>
                      <div><span className="text-gray-400">HISTORICAL PERIOD:</span> {activeMotif.historicalPeriod}</div>
                      <div><span className="text-gray-400">EARLIEST USE     :</span> {activeMotif.earliestUse}</div>
                      <div><span className="text-gray-400">CONFIDENCE INDEX :</span> {activeMotif.confidenceRating}</div>
                      <div><span className="text-gray-400">VERSION RECORD   :</span> {activeMotif.version} ({activeMotif.status})</div>
                    </div>
                  </div>

                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2 mt-6">Interpretation Summary</h3>
                  <p className="font-sans leading-relaxed text-gray-700 bg-white p-4 border border-[#3E2723]/10 shadow-xs">{activeMotif.summary}</p>

                  <div className="border-t border-gray-200 pt-3 mt-3 space-y-1.5">
                    <div><span className="text-gray-400">WHY IT MATTERS       :</span> {activeMotif.whyItMatters}</div>
                    <div><span className="text-gray-400">HISTORICAL BACKGROUND:</span> {activeMotif.historicalBackground}</div>
                  </div>
                </div>
              )}

              {/* TAB 2: ANATOMY & FORM */}
              {activeModalTab === 'anatomy' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2">Visual Description</h3>
                  <p className="font-sans text-gray-655 leading-relaxed bg-white p-4 border border-gray-200">{activeMotif.objectiveVisualDescription}</p>

                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2 mt-6">Defining Characteristics</h3>
                  <ul className="list-disc pl-4 space-y-1 text-gray-600">
                    {activeMotif.definingCharacteristics.map((char, idx) => (
                      <li key={idx}>{char}</li>
                    ))}
                  </ul>

                  {activeMotif.anatomy && (
                    <div className="mt-6">
                      <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Motif Anatomy</h3>
                      <div className="space-y-2">
                        {activeMotif.anatomy.map((an, idx) => (
                          <div key={idx} className="border border-gray-200 p-3 bg-white">
                            <span className="font-bold text-[#3E2723] block">{an.partName}</span>
                            <span className="text-gray-500 block mt-0.5">{an.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: DESIGN GRAMMAR */}
              {activeModalTab === 'grammar' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Pattern Repeat Grammar</h3>
                  <div className="space-y-3">
                    {activeMotif.grammar.map((rule, idx) => (
                      <div key={idx} className="border border-gray-200 p-3 bg-white space-y-1.5">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-1.5">
                          <strong className="text-[#3E2723]">{rule.ruleType}</strong>
                          <span className="text-[8px] text-gray-400">GRID: {rule.horizontalUnit} x {rule.verticalUnit}</span>
                        </div>
                        <p className="text-gray-600 font-sans">{rule.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SYMBOLISM & MEANINGS */}
              {activeModalTab === 'symbolism' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <div className="bg-yellow-50/50 border border-yellow-250 p-4 font-sans text-yellow-905 mb-4 text-[9px] leading-relaxed">
                    <strong>Core Interpretive Principle:</strong> A motif does not always possess one fixed or universal meaning. KHCRF distinguishes between documented historical meaning, artisan explanation, oral tradition, and commercial description.
                  </div>

                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Symbolic Interpretations</h3>
                  <div className="space-y-4">
                    {activeMotif.meanings.map((mean, idx) => (
                      <div key={idx} className="border border-gray-250 p-4 bg-white space-y-2">
                        <div className="flex justify-between items-center text-[8px] uppercase tracking-wider border-b border-gray-100 pb-1.5">
                          <span className="bg-gray-100 px-2 py-0.5 font-bold text-[#3E2723]">{mean.evidenceClass}</span>
                          <span className="text-[#D4AF37] font-bold">{mean.confidence}</span>
                        </div>
                        <strong className="text-sm font-serif block text-[#3E2723]">{mean.interpretation}</strong>
                        <p className="text-gray-550 font-sans leading-relaxed text-[9px]">{mean.supportingNote}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: CROSS-CRAFT VARIATIONS */}
              {activeModalTab === 'variations' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Material Adaptation</h3>
                  <div className="space-y-3">
                    {activeMotif.craftAdaptations.map((adapt, idx) => (
                      <div key={idx} className="border border-gray-200 p-3 bg-white">
                        <span className="font-bold text-[#D4AF37] text-[9px] uppercase tracking-widest block mb-1">{adapt.craftName}</span>
                        <strong className="text-gray-700 block text-xs font-serif mb-1">{adapt.adaptationStyle}</strong>
                        <span className="text-gray-500 block font-sans leading-relaxed text-[9px]">{adapt.technicalConstraints}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-3 mt-4 text-[9px] text-gray-500">
                    <div><strong>COMMON MISIDENTIFICATIONS:</strong> {activeMotif.commonMisidentifications.join(', ')}</div>
                    <div className="mt-1"><strong>REFERENCED ARCHIVE OBJECTS:</strong> {activeMotif.referencedObjects.join(', ')}</div>
                  </div>
                </div>
              )}

            </div>

            <div className="border-t border-[#D4AF37]/30 pt-6 text-center space-y-4 font-mono mt-6">
              <p className="text-[9px] uppercase tracking-widest text-gray-400 leading-relaxed font-mono">
                Access to full design grid blueprints and high-definition pattern coordinates is reserved for supportive members.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link href="/about/memberships" className="bg-[#D4AF37] text-[#3E2723] hover:bg-white px-6 py-3 font-bold uppercase tracking-wider text-xs transition-colors border border-[#D4AF37] font-mono">
                  Become a Member
                </Link>
                <button onClick={() => setActiveMotif(null)} className="border border-[#3E2723] hover:bg-[#3E2723]/5 text-[#3E2723] px-6 py-3 uppercase tracking-wider text-xs transition-colors font-light font-mono">
                  Return to Archive
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Hero section */}
      <UniversalEditorialHero pageKey="motifs-symbols" fallbackConfig={motifsSymbolsHeroFallback as unknown as Parameters<typeof UniversalEditorialHero>[0]['fallbackConfig']} />

      <div className="container-fluid mx-auto px-4 md:px-10 py-12 max-w-7xl animate-fadeIn">
        
        {/* Scholarly Statement */}
        <div className="bg-[#3E2723]/5 border-l-4 border-[#3E2723] p-8 mb-12 rounded-r-xs max-w-5xl font-sans">
          <p className="text-gray-700 text-base md:text-lg leading-relaxed font-serif">
            Unlike <strong>Traditional Techniques</strong> (how design is executed) or <strong>Collections</strong> (objects carrying the design), <strong>Motifs &amp; Symbols</strong> explains the <strong>visual language and meanings embodied within those objects</strong>. This page answers: <em>&ldquo;What do Kashmir&apos;s craft motifs depict, how do they change across materials and workshops, and what historical, cultural, spiritual, ecological, or artistic meanings have been associated with them?&rdquo;</em>
          </p>
          <p className="text-gray-755 text-xs mt-3 uppercase tracking-widest font-bold font-mono">
            Motifs are among the most visible elements of Kashmir’s craft heritage, yet their meanings are often simplified, romanticized, or repeated without evidence. A flower may function as botanical observation, ornament, workshop convention, spiritual metaphor, courtly design, market adaptation, or a combination of several traditions. The same motif may change substantially when woven into a carpet, embroidered on Pashmina, carved in walnut, painted on Papier-Mâché, or engraved into copper.
          </p>
          <div className="bg-yellow-50/50 border border-yellow-250 p-4 my-6 font-mono text-[10px] text-yellow-850 leading-relaxed">
            <strong>Core Interpretive Principle:</strong> A motif does not always possess one fixed or universal meaning. Meaning may differ according to craft, period, workshop, patron, or religious context. KHCRF distinguishes between documented historical meaning, artisan explanation, oral tradition, and commercial description.
          </div>
          <div className="flex flex-wrap gap-4 mt-6 font-mono text-xs">
            <a href="#results" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-5 py-2.5 font-bold uppercase tracking-wider transition-all">
              Explore Motifs &amp; Symbols
            </a>
            <a href="#nomination-section" className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-5 py-2.5 font-bold uppercase tracking-wider transition-all">
              Document a Motif
            </a>
            <a href="#methodology" className="text-[#3E2723] hover:underline font-bold py-2.5">
              Attribution Standards &rarr;
            </a>
          </div>
        </div>

        {/* Featured Motif Card */}
        <section className="bg-white border-4 border-[#3E2723] p-8 md:p-10 mb-16 relative shadow-md">
          <div className="absolute top-0 right-0 bg-[#3E2723] text-[#D4AF37] px-4 py-1 text-[10px] font-mono font-bold uppercase tracking-widest">
            FEATURED MOTIF RECORD
          </div>
          
          <div className="max-w-4xl font-mono">
            <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-1">
              Motif Record: {featuredMotif.motifNumber}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3E2723] leading-tight mb-2">
              {featuredMotif.primaryName} ({featuredMotif.localName})
            </h2>
            
            <p className="text-gray-700 text-sm leading-relaxed mb-6 font-sans text-gray-655">
              {featuredMotif.summary}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 font-mono text-[10px] border-t border-b border-gray-250 py-3 bg-gray-55 px-4">
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Category</span>
                <span className="font-bold text-[#3E2723]">{featuredMotif.category}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Crafts Mapped</span>
                <span className="font-bold text-[#3E2723]">{featuredMotif.primaryCrafts.join(', ')}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Known Variants</span>
                <span className="font-bold text-[#3E2723]">{featuredMotif.knownVariantsCount}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Confidence Rating</span>
                <span className="font-bold text-[#D4AF37] font-bold">{featuredMotif.confidenceRating}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => { setActiveMotif(featuredMotif); setActiveModalTab('overview'); }}
                className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-all font-mono"
              >
                Study Motif &rarr;
              </button>
            </div>
          </div>
        </section>

        {/* Terminological Distinction Alert */}
        <section className="bg-white border border-[#3E2723]/25 p-8 rounded-xs mb-16 shadow-xs font-sans">
          <h3 className="text-lg font-serif text-[#3E2723] mb-4 font-bold border-b border-gray-100 pb-2">
            Important Terminological Distinctions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-700 leading-relaxed font-mono">
            <div>
              <strong className="text-[#3E2723] block mb-1">Motif</strong>
              <p>A recurring visual unit such as a leaf, flower, animal, medallion, or geometric form.</p>
            </div>
            <div>
              <strong className="text-[#3E2723] block mb-1">Symbol</strong>
              <p>A form associated with an attributed cultural, religious, philosophical, or historical meaning.</p>
            </div>
            <div>
              <strong className="text-[#3E2723] block mb-1">Pattern &amp; Ornament</strong>
              <p>Organized repetitions or decorative surface treatments applied to objects.</p>
            </div>
          </div>
        </section>

        {/* Archive Overview Dashboard */}
        <section className="bg-[#3E2723] text-white p-8 md:p-10 mb-12 rounded-xs relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#3E2723] px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-widest">
            Registry Overview
          </div>
          <div className="mb-8 font-mono">
            <h3 className="font-serif text-2xl text-[#D4AF37] mb-2 font-bold font-serif">Motifs &amp; Symbols Overview</h3>
            <p className="text-white/60 text-xs">
              LIVE VISUAL GRAMMAR ARCHIVE &bull; ICONOGRAPHY INDEX
            </p>
          </div>

          {/* Primary Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 text-center md:text-left border-b border-white/10 pb-8 mb-8">
            <div className="border-r border-white/10 last:border-0 pr-4 font-mono">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2">Motifs Documented</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">264</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4 font-mono">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2">Symbolic Meanings</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">118</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4 font-mono">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2">Craft Traditions</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">12</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4 font-mono">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2">Design Variants</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">743</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4 font-mono">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2">Objects Mapped</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">1,286</span>
            </div>
            <div className="last:border-0 font-mono">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2">Historical Sources</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">196</span>
            </div>
          </div>

          {/* Secondary Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 text-center md:text-left font-mono">
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2">Botanical Motifs</span>
              <span className="text-xl font-serif font-semibold text-white/80">94</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2">Geometric Motifs</span>
              <span className="text-xl font-serif font-semibold text-white/80">67</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2">Architectural Motifs</span>
              <span className="text-xl font-serif font-semibold text-white/80">31</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4 font-mono">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2">Animal &amp; Bird</span>
              <span className="text-xl font-serif font-semibold text-white/80">28</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2">Calligraphic Units</span>
              <span className="text-xl font-serif font-semibold text-white/80">16</span>
            </div>
            <div className="last:border-0">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2">Multi-Craft Motifs</span>
              <span className="text-lg font-serif font-semibold text-[#D4AF37] block leading-tight">83</span>
            </div>
          </div>
        </section>

        {/* View Switcher Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 bg-[#FAF9F6] border border-[#3E2723]/10 p-4 font-mono" id="results">
          <div className="text-xs font-serif text-[#3E2723]">
            Visual Language Archive &bull; Showing {sortedMotifs.length} Documented Motifs &amp; Symbols
          </div>
          <div className="flex gap-2 font-mono">
            <span className="text-[10px] text-gray-400 uppercase self-center mr-2">Archive Layout View:</span>
            <button 
              onClick={() => { setCurrentView('archive'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'archive' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Motif Archive
            </button>
            <button 
              onClick={() => { setCurrentView('atlas'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'atlas' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Visual Atlas
            </button>
            <button 
              onClick={() => { setCurrentView('comparison'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'comparison' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Cross-Craft Comparison
            </button>
            <button 
              onClick={() => { setCurrentView('grammar'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'grammar' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Design Grammar
            </button>
            <button 
              onClick={() => { setCurrentView('index'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'index' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Interpretation Index
            </button>
          </div>
        </div>

        {/* Search and Discovery Layout */}
        <section className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Filters Sidebar */}
          {currentView !== 'comparison' && currentView !== 'grammar' && currentView !== 'index' && (
            <div className="w-full lg:w-1/4 bg-white border border-[#3E2723]/10 p-6 shadow-xs sticky top-4 z-10 font-sans">
              <h3 className="font-serif text-lg text-[#3E2723] mb-6 pb-2 border-b border-gray-100 flex items-center justify-between font-bold font-serif">
                <span>Filter Archive</span>
                <button 
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedVisualForm('All');
                    setSelectedCraft('All');
                    setSelectedMeaning('All');
                    setSelectedPeriod('All');
                    setSelectedStatus('All');
                    setSelectedSort('Featured');
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="text-[10px] text-[#3949AB] hover:underline font-bold uppercase tracking-wider font-mono"
                >
                  Reset
                </button>
              </h3>

              <div className="space-y-6 text-xs font-sans">
                {/* Search Field */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Search Keyword</label>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder="Search by motif, local name, symbol..."
                    className="w-full border border-gray-200 px-3 py-2 text-xs rounded-none bg-[#FAF9F6] text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  />
                </div>

                {/* Motif Category */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Motif Category</label>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Categories</option>
                    <option value="Floral">Floral / Rosette</option>
                    <option value="Botanical">Botanical / Leaf</option>
                    <option value="Tree">Tree / Cypress</option>
                    <option value="Fruit">Fruit / Pomegranate</option>
                    <option value="Animal">Animal / Stag</option>
                    <option value="Geometric">Geometric / Lattice</option>
                    <option value="Calligraphic">Calligraphic / Text</option>
                  </select>
                </div>

                {/* Visual Form */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Visual Form</label>
                  <select 
                    value={selectedVisualForm}
                    onChange={(e) => { setSelectedVisualForm(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Forms</option>
                    <option value="Naturalistic">Naturalistic</option>
                    <option value="Stylized">Stylized</option>
                    <option value="Geometric">Geometric</option>
                    <option value="Abstracted">Abstracted</option>
                  </select>
                </div>

                {/* Craft Tradition */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Craft Tradition</label>
                  <select 
                    value={selectedCraft}
                    onChange={(e) => { setSelectedCraft(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Crafts</option>
                    <option value="Carpet">Carpet</option>
                    <option value="Kani">Kani</option>
                    <option value="Sozni">Sozni</option>
                    <option value="Papier-Mâché">Papier-Mâché</option>
                    <option value="Walnut Wood">Walnut Wood</option>
                    <option value="Copperware">Copperware</option>
                  </select>
                </div>

                {/* Associated Meaning */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Associated Meaning</label>
                  <select 
                    value={selectedMeaning}
                    onChange={(e) => { setSelectedMeaning(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Meanings</option>
                    <option value="Autumn">Autumnal Memory</option>
                    <option value="Garden">Paradise Garden</option>
                    <option value="Eternity">Eternity / Life Cycles</option>
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
                    <option value="Motif Category">Motif Category</option>
                    <option value="Craft Tradition">Craft Tradition</option>
                    <option value="Historical Period">Historical Period</option>
                    <option value="Interpretation Confidence">Confidence</option>
                    <option value="Number of Variants">Number of Variants</option>
                    <option value="A–Z">A–Z</option>
                  </select>
                </div>

              </div>
            </div>
          )}

          {/* Results Area */}
          <div className={`w-full ${currentView === 'comparison' || currentView === 'grammar' || currentView === 'index' ? 'lg:w-full' : 'lg:w-3/4'}`}>

            {loading ? (
              <div className="py-20 text-center text-gray-550 font-serif font-bold">Loading visual records...</div>
            ) : (
              <>
                {/* 1. MOTIF ARCHIVE VIEW */}
                {currentView === 'archive' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn font-mono text-xs">
                    {paginatedMotifs.map((m, i) => (
                      <div 
                        key={i} 
                        className="bg-white border-2 border-[#3E2723]/35 py-8 px-6 hover:bg-[#3E2723]/5 transition-all duration-300 group flex flex-col justify-between shadow-sm relative grid-ledger text-gray-700"
                      >
                        <div>
                          {/* Accession ID & Category header */}
                          <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5 font-semibold">
                            <span>{m.motifNumber}</span>
                            <span>{m.category.toUpperCase()} MOTIF</span>
                          </div>

                          {/* Visual form & Crafts */}
                          <div className="text-[9px] font-mono text-[#D4AF37] font-bold uppercase tracking-widest mb-4">
                            {m.visualForm.toUpperCase()} &bull; {m.primaryCrafts.join(', ')}
                          </div>

                          {/* Title */}
                          <h3 
                            onClick={() => { setActiveMotif(m); setActiveModalTab('overview'); }}
                            className="text-xl md:text-2xl font-serif font-bold text-[#3E2723] leading-snug cursor-pointer group-hover:text-[#D4AF37] transition-colors"
                          >
                            {m.primaryName} ({m.localName})
                          </h3>

                          <p className="text-gray-655 text-xs leading-relaxed mb-4 font-sans line-clamp-3 mt-3">
                            {m.summary}
                          </p>

                          {/* Variants & referenced objects counts */}
                          <div className="relative pl-4 mb-4 border-l-2 border-[#D4AF37]/50 font-mono text-[10px] leading-relaxed my-4">
                            <span className="text-[9px] text-gray-400 uppercase tracking-wider block mb-1">
                              VARIANTS &bull; OBJECTS FEATURED
                            </span>
                            <span className="font-bold text-[#3E2723]">
                              {m.knownVariantsCount} Variants recorded &bull; {m.referencedObjectsCount} museum objects
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="text-[#3E2723]/25 text-[9px] font-mono mb-3 select-none">
                            ─────╱╲──╱────╲╱─────
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto font-mono">
                            <span className="bg-[#3E2723]/5 border border-[#3E2723]/10 text-[#3E2723] text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider">
                              {m.status.toUpperCase()}
                            </span>
                            
                            <button 
                              onClick={() => { setActiveMotif(m); setActiveModalTab('overview'); }}
                              className="text-xs font-bold uppercase tracking-widest text-[#3E2723] hover:text-[#D4AF37] transition-colors font-mono"
                            >
                              Study Motif &rarr;
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

                {/* 2. VISUAL ATLAS VIEW */}
                {currentView === 'atlas' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeIn font-mono text-xs text-[#3E2723]">
                    {sortedMotifs.map((m, idx) => (
                      <div key={idx} className="bg-white border-2 border-[#3E2723] p-5 shadow-md space-y-4">
                        <div className="w-full aspect-[4/3] bg-gray-50 border border-gray-250 flex items-center justify-center text-gray-300 font-serif italic text-lg select-none">
                          [Variant Drawing Outline]
                        </div>
                        <div className="space-y-1">
                          <span className="text-gray-400 text-[8px] block uppercase">MOTIF RECORD</span>
                          <h4 className="font-serif text-base font-bold text-[#3E2723]">{m.primaryName} ({m.localName})</h4>
                          <div className="text-[9px] text-gray-500">
                            <div><strong>FORM:</strong> {m.visualForm}</div>
                            <div><strong>CRAFTS:</strong> {m.primaryCrafts.join(', ')}</div>
                            <div><strong>PERIOD:</strong> {m.historicalPeriod}</div>
                          </div>
                        </div>
                        <button 
                          onClick={() => { setActiveMotif(m); setActiveModalTab('anatomy'); }}
                          className="w-full bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] py-2 font-bold uppercase tracking-widest text-[9px] transition-colors font-mono"
                        >
                          View Anatomy Diagrams &rarr;
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. CROSS-CRAFT COMPARISON VIEW */}
                {currentView === 'comparison' && (
                  <div className="bg-white border-2 border-[#3E2723] p-6 shadow-md animate-fadeIn font-mono text-xs text-[#3E2723]">
                    <span className="text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest block mb-1 font-mono">CROSS-CRAFT MATERIAL COMPARISONS</span>
                    <h3 className="font-serif text-lg font-bold mb-6 border-b border-gray-150 pb-2">How One Motif Changes Across Five Crafts</h3>
                    
                    <div className="space-y-6">
                      {sortedMotifs.map((m, idx) => (
                        <div key={idx} className="border border-gray-250 p-4 bg-[#FAF9F6] space-y-3">
                          <h4 className="font-serif text-base font-bold border-b border-[#3E2723]/10 pb-1 text-[#3E2723]">
                            {m.primaryName} ({m.localName}) Cross-Adaptations
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {m.craftAdaptations.map((adapt, aIdx) => (
                              <div key={aIdx} className="bg-white border border-gray-200 p-3 text-[9px]">
                                <strong className="text-[#D4AF37] uppercase block mb-1">{adapt.craftName}</strong>
                                <strong className="text-gray-700 block mb-1 font-serif">{adapt.adaptationStyle}</strong>
                                <p className="text-gray-550 font-sans leading-relaxed">{adapt.technicalConstraints}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. DESIGN GRAMMAR VIEW */}
                {currentView === 'grammar' && (
                  <div className="bg-white border-2 border-[#3E2723] p-6 shadow-md animate-fadeIn font-mono text-xs text-[#3E2723]">
                    <span className="text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest block mb-1 font-mono">DESIGN GRAMMAR SYSTEMS</span>
                    <h3 className="font-serif text-lg font-bold mb-6 border-b border-gray-150 pb-2">Pattern Repeat Rules &amp; Symmetries</h3>
                    
                    <div className="space-y-6">
                      {sortedMotifs.map((m, idx) => (
                        <div key={idx} className="border border-gray-250 p-4 bg-[#FAF9F6] space-y-3">
                          <h4 className="font-serif text-base font-bold border-b border-[#3E2723]/10 pb-1 text-[#3E2723]">{m.primaryName} Repeat Rules</h4>
                          <div className="space-y-2">
                            {m.grammar.map((rule, rIdx) => (
                              <div key={rIdx} className="bg-white border border-gray-200 p-3 text-[9px]">
                                <div className="flex justify-between items-center mb-1">
                                  <strong className="text-[#3E2723] uppercase">{rule.ruleType}</strong>
                                  <span className="text-gray-400">SCALE: {rule.horizontalUnit} x {rule.verticalUnit}</span>
                                </div>
                                <p className="text-gray-600 font-sans">{rule.explanation}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. INTERPRETATION INDEX VIEW */}
                {currentView === 'index' && (
                  <div className="bg-white border border-[#3E2723]/10 overflow-x-auto shadow-sm animate-fadeIn font-mono text-xs text-[#3E2723]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#3E2723] text-[#D4AF37] font-mono uppercase tracking-wider text-[10px]">
                          <th className="p-4 border-b border-[#3E2723]/20">Motif Name</th>
                          <th className="p-4 border-b border-[#3E2723]/20">Attributed Meaning</th>
                          <th className="p-4 border-b border-[#3E2723]/20">Evidence Class</th>
                          <th className="p-4 border-b border-[#3E2723]/20">Confidence Level</th>
                          <th className="p-4 border-b border-[#3E2723]/20">Historical Period</th>
                          <th className="p-4 border-b border-[#3E2723]/20">Draft status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#3E2723]/10 font-sans text-gray-700 text-xs">
                        {sortedMotifs.flatMap(m => 
                          m.meanings.map((mean, mIdx) => (
                            <tr key={`${m.motifNumber}-${mIdx}`} className="hover:bg-[#FAF9F6] transition-colors cursor-pointer" onClick={() => { setActiveMotif(m); setActiveModalTab('symbolism'); }}>
                              <td className="p-4 font-serif font-bold whitespace-nowrap">{m.primaryName} ({m.localName})</td>
                              <td className="p-4 font-bold">{mean.interpretation}</td>
                              <td className="p-4 font-mono whitespace-nowrap">
                                <span className="bg-gray-100 px-2 py-0.5 font-mono text-[9px] uppercase border border-gray-200">
                                  {mean.evidenceClass}
                                </span>
                              </td>
                              <td className="p-4 font-mono font-bold text-[#D4AF37] whitespace-nowrap">{mean.confidence}</td>
                              <td className="p-4 font-mono whitespace-nowrap">{m.historicalPeriod}</td>
                              <td className="p-4 font-mono whitespace-nowrap">
                                <span className="px-2 py-0.5 border border-[#3E2723]/20 bg-[#3E2723]/5 text-[#3E2723] font-bold text-[9px] uppercase">
                                  {m.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            {currentView === 'archive' && totalPages > 1 && (
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
        <section className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs mt-16 font-sans" id="methodology">
          <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold">
            How KHCRF Documents Motifs and Symbols
          </h2>
          <p className="text-gray-655 text-sm leading-relaxed mb-6">
            Motif records are developed through direct object study, artisan interviews, workshop documentation, design manuscripts, technical analysis, museum records, historical texts, architectural comparison, botanical reference, photography, and scholarly interpretation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 text-xs font-mono">
            <div>
              <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3 font-mono">Research Workflow</h3>
              <ol className="list-decimal pl-4 space-y-2 text-gray-600">
                <li>Motif nomination and preliminary visual outline review</li>
                <li>Artisan and workshop consultations to log local terminology</li>
                <li>Design manuscript, Talim tracing &amp; pattern-book comparisons</li>
                <li>Cross-craft material adaptation analysis and symbolic review</li>
                <li>Scholarly validation review, cataloging, and final publication</li>
              </ol>
            </div>
            <div>
              <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3 font-mono">Documentation Principles</h3>
              <ul className="list-disc pl-4 space-y-2 text-gray-600">
                <li>always describe visual form objectively before interpreting meaning</li>
                <li>distinguish decoration from symbolic associations strictly</li>
                <li>separate historic courtly uses from contemporary retail marketing</li>
                <li>retain competing or disputed oral interpretations transparently</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Research & Educational Use */}
        <section className="bg-white border border-[#3E2723]/25 p-8 md:p-10 mb-16 rounded-xs shadow-sm font-sans">
          <h2 className="text-2xl font-serif text-[#3E2723] mb-4 font-bold">Research &amp; Educational Use</h2>
          <p className="text-gray-655 text-sm leading-relaxed mb-6">
            The archive supports academic art history, textile design history, museum registries, digitised pattern libraries, and artisan craftsmanship schools.
          </p>
          <div className="flex gap-4 font-mono">
            <Link href="mailto:research@khcrf.org" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3 font-bold uppercase tracking-wider text-xs transition-colors">
              Request Research Access
            </Link>
            <a href="#nomination-section" className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-6 py-3 font-bold uppercase tracking-wider text-xs transition-colors">
              Explore the Visual Atlas
            </a>
          </div>
        </section>

        {/* Nominate Motif Form */}
        <section id="nomination-section" className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs">
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase block mb-1 font-mono">Help Document Kashmir’s Visual Language</span>
            <h2 className="text-3xl font-serif text-[#3E2723] font-bold">Submit Motif Documentation</h2>
            <p className="text-gray-500 text-xs font-mono mt-1">Artisans, historians, designers, and community knowledge holders are invited to contribute variants.</p>
          </div>

          <div className="bg-[#FAF9F6] p-6 md:p-8 border border-gray-250">
            {proposalSubmitted ? (
              <div className="text-center py-8 font-mono">
                <h3 className="text-lg font-bold text-green-600 mb-2">Motif Draft Staged</h3>
                <p className="text-xs text-gray-500">Thank you. The KHCRF Design Grammar Committee will verify your pattern repeat coordinates.</p>
              </div>
            ) : (
              <form onSubmit={handleProposalSubmit} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Motif or Symbol Name *</label>
                    <input 
                      required 
                      type="text" 
                      value={proposalForm.title}
                      onChange={(e) => setProposalForm({...proposalForm, title: e.target.value})}
                      placeholder="e.g. Tree of Life"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Local Name *</label>
                    <input 
                      required 
                      type="text" 
                      value={proposalForm.localName}
                      onChange={(e) => setProposalForm({...proposalForm, localName: e.target.value})}
                      placeholder="e.g. Sarv"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Motif Category *</label>
                    <input 
                      required 
                      type="text" 
                      value={proposalForm.category}
                      onChange={(e) => setProposalForm({...proposalForm, category: e.target.value})}
                      placeholder="e.g. Floral, Botanical, Architectural"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Primary Crafts *</label>
                    <input 
                      required
                      type="text" 
                      value={proposalForm.craft}
                      onChange={(e) => setProposalForm({...proposalForm, craft: e.target.value})}
                      placeholder="e.g. Carpet, Sozni embroidery"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-500 mb-1">Visual Outline &amp; Defining Anatomy *</label>
                  <textarea 
                    required 
                    rows={4} 
                    value={proposalForm.description}
                    onChange={(e) => setProposalForm({...proposalForm, description: e.target.value})}
                    placeholder="Describe petals, lobes, symmetries, repeats, and outline coordinates..."
                    className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723] resize-none" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Attributed Meaning *</label>
                    <textarea 
                      required
                      rows={2} 
                      value={proposalForm.meaning}
                      onChange={(e) => setProposalForm({...proposalForm, meaning: e.target.value})}
                      placeholder="e.g. Paradise garden imagery, eternity..."
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723] resize-none" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Supporting Evidence Sources *</label>
                    <textarea 
                      required
                      rows={2} 
                      value={proposalForm.evidence}
                      onChange={(e) => setProposalForm({...proposalForm, evidence: e.target.value})}
                      placeholder="e.g. Museum catalog attributions, ustad testimonies..."
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723] resize-none" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Contact coordinates *</label>
                    <input 
                      required
                      type="text" 
                      value={proposalForm.contact}
                      onChange={(e) => setProposalForm({...proposalForm, contact: e.target.value})}
                      placeholder="Contributor name, email, or workshop details"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-[#3E2723] hover:bg-[#D4AF37] text-white hover:text-[#3E2723] font-bold uppercase tracking-widest transition-colors font-mono"
                >
                  Submit Motif Documentation
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
            &ldquo;The KHCRF Motifs &amp; Symbols Archive preserves Kashmir’s visual language by documenting forms, names, patterns, meanings, variants, techniques, objects, and interpretations with scholarly care. By separating visual evidence from assumption and connecting motifs across crafts, workshops, periods, and collections, the archive reveals how design carries memory, identity, knowledge, and artistic continuity.&rdquo;
          </p>
          <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto"></div>
        </div>
      </footer>

    </main>
  );
}
