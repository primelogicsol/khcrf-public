'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { naturalDyesHeroFallback } from '@/config/heroFallbacks';

interface RecipeStep {
  stepNumber: number;
  instruction: string;
  duration: string;
  temperature: string;
}

interface FibreBehavior {
  fibreType: string;
  mordantUsed: string;
  colorOutcome: string;
  fastnessRating: string;
}

interface DyeRecord {
  slug: string;
  dyeNumber: string;
  commonName: string;
  localName: string;
  scientificName: string;
  sourceCategory: 'Leaf' | 'Flower' | 'Bark' | 'Root' | 'Rhizome' | 'Fruit' | 'Peel' | 'Seed' | 'Wood' | 'Gall' | 'Lichen' | 'Mineral' | 'Insect-Derived' | 'Food or Agricultural By-product';
  partUsed: string;
  colourFamilies: string[];
  primaryFibres: string[];
  craftApplications: string[];
  origin: string;
  harvestSeason: string;
  cultivatedOrWild: 'Cultivated' | 'Wild-Harvested' | 'Both';
  availability: 'Stable' | 'Generally Available' | 'Seasonally Limited' | 'Increasingly Difficult to Source' | 'Supply Vulnerable' | 'Environmentally Sensitive' | 'Severely Restricted' | 'Historical Material' | 'Status Unknown';
  safetyClassification: 'Low Documented Risk' | 'Handling Precautions Required' | 'Specialist Use' | 'Restricted Documentation' | 'Toxicity Review Required' | 'Environmental Disposal Concern' | 'Historical Recipe Not Recommended';
  status: 'Fully Documented' | 'Artisan-Verified' | 'Technical Review Complete' | 'Under Research' | 'Archive Preview' | 'Restricted';
  version: string;
  hexCode: string; // for color atlas swatch
  summary: string;
  whyItMatters: string;
  historicalBackground: string;
  extractionMethod: string;
  recipeTitle: string;
  recipeSteps: RecipeStep[];
  fibreMatrix: FibreBehavior[];
  safetyPrecautions: string[];
  disposalGuidance: string;
  conservationNotes: string;
  referencedObjects: string[];
  mordantsAndModifiers: string[];
  lightfastnessScale: string;
}

export default function NaturalDyes() {
  const [allDyes] = useState<DyeRecord[]>([
    {
      slug: "ro-madder-root",
      dyeNumber: "KHCRF-DYE-2026-001",
      commonName: "Madder",
      localName: "Manjith",
      scientificName: "Rubia cordifolia",
      sourceCategory: "Root",
      partUsed: "Dried pulverised root stalks",
      colourFamilies: ["Red", "Rust", "Coral", "Brown"],
      primaryFibres: ["Wool", "Pashmina", "Silk"],
      craftApplications: ["Pashmina", "Kani", "Carpet", "Sozni"],
      origin: "Kashmir Forest Foothills",
      harvestSeason: "Late Autumn (root density peak)",
      cultivatedOrWild: "Wild-Harvested",
      availability: "Increasingly Difficult to Source",
      safetyClassification: "Low Documented Risk",
      status: "Fully Documented",
      version: "v3.2",
      hexCode: "#A24836",
      summary: "Madder has long been associated with red, rust, coral, orange, and brown colour families across textile traditions. Its final colour depends upon botanical source, root age, preparation, water chemistry, mordant, fibre, temperature, and duration of dyeing. This record documents the source as a technical and historical material rather than presenting 'madder red' as a single predictable shade.",
      whyItMatters: "A natural dye is not a fixed colour. It is a variable material system. Madder root contains alizarin compounds whose crystallization is highly sensitive to calcium minerals present in Kashmir Jhelum water springs.",
      historicalBackground: "Documented in local chronicles since the 14th century as the primary red dye used in Royal Kani loom shawl carpets.",
      extractionMethod: "Boiling crushed root stems in water for 90 minutes prior to dye-bath entry.",
      recipeTitle: "Classical Coral Red on Pashmina Warp",
      recipeSteps: [
        { stepNumber: 1, instruction: "Soak ground madder root in water overnight.", duration: "12 Hours", temperature: "Ambient" },
        { stepNumber: 2, instruction: "Simmer bath with alum mordanted yarn.", duration: "90 Mins", temperature: "82°C" }
      ],
      fibreMatrix: [
        { fibreType: "Pashmina", mordantUsed: "Alum-based system", colorOutcome: "Soft warm red", fastnessRating: "Grade 4 (Very Good)" },
        { fibreType: "Sheep wool", mordantUsed: "Iron modifier", colorOutcome: "Deep rust-brown", fastnessRating: "Grade 5 (Excellent)" },
        { fibreType: "Silk", mordantUsed: "Alum-based system", colorOutcome: "Clear coral-red", fastnessRating: "Grade 4" },
        { fibreType: "Cotton", mordantUsed: "Tannin & mordant sequence", colorOutcome: "Muted red", fastnessRating: "Grade 3" }
      ],
      safetyPrecautions: ["Avoid inhaling dry root powder during grinding.", "Use protective gloves when draining bath solution."],
      disposalGuidance: "Residue is biodegradable organic matter. Dispose of spent bath water safely on agricultural lands.",
      conservationNotes: "Highly stable colorant, but acidic soil conditions can shift red tones to brown over multi-decade cycles.",
      referencedObjects: ["KHCRF-OBJ-2026-0005", "KHCRF-OBJ-2026-0331"],
      mordantsAndModifiers: ["Alum", "Iron", "Tannin"],
      lightfastnessScale: "Grade 4-5 on the Blue Wool Scale"
    },
    {
      slug: "ro-pomegranate-rind",
      dyeNumber: "KHCRF-DYE-2026-014",
      commonName: "Pomegranate Rind",
      localName: "Nasphal",
      scientificName: "Punica granatum",
      sourceCategory: "Peel",
      partUsed: "Dried fruit skin hulls",
      colourFamilies: ["Yellow", "Gold", "Olive", "Brown"],
      primaryFibres: ["Wool", "Pashmina", "Silk"],
      craftApplications: ["Pashmina", "Kani", "Sozni", "Carpet"],
      origin: "Local Orchards",
      harvestSeason: "Autumn harvest",
      cultivatedOrWild: "Cultivated",
      availability: "Generally Available",
      safetyClassification: "Low Documented Risk",
      status: "Technical Review Complete",
      version: "v2.0",
      hexCode: "#C8A663",
      summary: "Pomegranate Rind is a tannin-rich plant material associated with yellow, gold, olive, brown, and modified tones. It functions as both a yellow colorant and a natural mordant enhancer when combined with other dyes.",
      whyItMatters: "High ellagitannin content binds naturally to animal protein fibers, making it a reliable base colorant that increases the fastness of over-dyed colors.",
      historicalBackground: "Used locally as an abundant agricultural by-product of regional fruit cultivation networks.",
      extractionMethod: "Boiling dried rinds in soft water for 60 minutes.",
      recipeTitle: "Golden Olive on Wool Yarn",
      recipeSteps: [
        { stepNumber: 1, instruction: "Simmer dried rinds in dye bath.", duration: "60 Mins", temperature: "90°C" },
        { stepNumber: 2, instruction: "Modify bath with iron vitriol solution.", duration: "15 Mins", temperature: "80°C" }
      ],
      fibreMatrix: [
        { fibreType: "Wool", mordantUsed: "Iron modifier", colorOutcome: "Deep olive green", fastnessRating: "Grade 5" },
        { fibreType: "Pashmina", mordantUsed: "Alum mordant", colorOutcome: "Bright gold-yellow", fastnessRating: "Grade 4" }
      ],
      safetyPrecautions: ["No hazardous risks. Handwashing after use is sufficient."],
      disposalGuidance: "Spent rinds can be organic compost. Bath effluent holds no metallic risk.",
      conservationNotes: "Iron-modified olive tones are highly lightfast but can weaken delicate silk fibers over centuries.",
      referencedObjects: ["KHCRF-OBJ-2026-0142"],
      mordantsAndModifiers: ["Alum", "Iron"],
      lightfastnessScale: "Grade 5 (Excellent)"
    },
    {
      slug: "indigo-leaf",
      dyeNumber: "KHCRF-DYE-2026-002",
      commonName: "Indigo",
      localName: "Neel",
      scientificName: "Indigofera tinctoria",
      sourceCategory: "Leaf",
      partUsed: "Fermented plant leaves",
      colourFamilies: ["Blue", "Green"],
      primaryFibres: ["Wool", "Pashmina", "Cotton"],
      craftApplications: ["Carpet", "Pashmina", "Crewel"],
      origin: "Imported / Plains trade routes",
      harvestSeason: "Summer harvest",
      cultivatedOrWild: "Cultivated",
      availability: "Generally Available",
      safetyClassification: "Handling Precautions Required",
      status: "Fully Documented",
      version: "v3.0",
      hexCode: "#2B4C7E",
      summary: "Indigo produces deep blue shades and acts as the foundation for over-dyed green tones. It requires an alkaline fermentation reduction process to make the dye soluble before it can bind to fibers.",
      whyItMatters: "Since indigo dye molecules are insoluble in water, they must be chemically reduced to a soluble leuco form. Exposure to oxygen during yarn lifting oxidizes the dye back to its permanent blue state.",
      historicalBackground: "Traded along transregional valley routes since early antiquities.",
      extractionMethod: "Alkaline vat reduction process using local lime and sugars.",
      recipeTitle: "Deep Sky Blue on Pashmina Skeins",
      recipeSteps: [
        { stepNumber: 1, instruction: "Prepare reduction vat using sodium hydrosulfite and lime.", duration: "4 Hours", temperature: "50°C" },
        { stepNumber: 2, instruction: "Dip skeins below vat surface, lift and oxidize in air.", duration: "15 Mins", temperature: "Ambient" }
      ],
      fibreMatrix: [
        { fibreType: "Wool", mordantUsed: "No Mordant (Vat Dye)", colorOutcome: "Deep indigo blue", fastnessRating: "Grade 5" },
        { fibreType: "Pashmina", mordantUsed: "No Mordant", colorOutcome: "Vibrant mid-blue", fastnessRating: "Grade 5" }
      ],
      safetyPrecautions: ["Perform reduction inside a well-ventilated space to avoid sulfur gas buildup.", "Wear protective goggles when handling sodium hydrosulfite."],
      disposalGuidance: "Neutralize vat pH with mild organic acid before drainage. Do not release alkaline vats directly into local waterways.",
      conservationNotes: "Extremely stable against sunlight but vulnerable to rubbing (crocking) if dye is not reduced properly.",
      referencedObjects: ["KHCRF-OBJ-2026-0005"],
      mordantsAndModifiers: ["Alkaline Modifier", "Acidic Modifier"],
      lightfastnessScale: "Grade 5"
    },
    {
      slug: "walnut-hull",
      dyeNumber: "KHCRF-DYE-2026-003",
      commonName: "Walnut Hull",
      localName: "Wont",
      scientificName: "Juglans regia",
      sourceCategory: "Peel",
      partUsed: "Green outer fruit hull",
      colourFamilies: ["Brown", "Beige", "Grey"],
      primaryFibres: ["Wool", "Pashmina", "Silk"],
      craftApplications: ["Pashmina", "Kani", "Carpet", "Wood Surface"],
      origin: "Local Mountain Ranges",
      harvestSeason: "Late Summer",
      cultivatedOrWild: "Both",
      availability: "Stable",
      safetyClassification: "Low Documented Risk",
      status: "Fully Documented",
      version: "v1.5",
      hexCode: "#5B4A3D",
      summary: "Walnut hull produces rich, lightfast brown shades without requiring mordants due to high natural juglone and tannin levels. Iron modifiers shift the brown tones to deep dark greys and charcoal blacks.",
      whyItMatters: "Juglone molecules exhibit strong natural binding affinities to protein keratin fibers, making it one of the most stable and lightfast local brown color sources.",
      historicalBackground: "Commonly used in rural weaving villages due to walnut tree abundances across the valley foothills.",
      extractionMethod: "Boiling fresh or dried hulls in water for 90 minutes.",
      recipeTitle: "Sable Brown on Pashmina Yarn",
      recipeSteps: [
        { stepNumber: 1, instruction: "Boil hulls to extract juglone pigments.", duration: "90 Mins", temperature: "95°C" },
        { stepNumber: 2, instruction: "Immerse pashmina yarn without mordant.", duration: "60 Mins", temperature: "80°C" }
      ],
      fibreMatrix: [
        { fibreType: "Pashmina", mordantUsed: "No Mordant", colorOutcome: "Warm sable brown", fastnessRating: "Grade 5" },
        { fibreType: "Silk", mordantUsed: "Iron modifier", colorOutcome: "Deep charcoal grey", fastnessRating: "Grade 4" }
      ],
      safetyPrecautions: ["Wear gloves to prevent skin staining."],
      disposalGuidance: "Spent hulls can be composted directly.",
      conservationNotes: "Highly stable against UV degradation.",
      referencedObjects: ["KHCRF-OBJ-2026-0217"],
      mordantsAndModifiers: ["Iron", "No Mordant"],
      lightfastnessScale: "Grade 5"
    }
  ]);

  const [loading] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecordType, setSelectedRecordType] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFamily, setSelectedFamily] = useState('All');
  const [selectedFibre, setSelectedFibre] = useState('All');
  const [selectedMordant, setSelectedMordant] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [selectedSafety, setSelectedSafety] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Featured');

  const [activeDye, setActiveDye] = useState<DyeRecord | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'overview' | 'recipe' | 'matrix' | 'safety' | 'conservation'>('overview');
  const [currentView, setCurrentView] = useState<'archive' | 'atlas' | 'map' | 'matrix'>('archive');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Proposal form state
  const [proposalForm, setProposalForm] = useState({
    title: '',
    localName: '',
    craft: '',
    category: '',
    source: '',
    preparation: '',
    mordant: '',
    safety: '',
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
        source: '',
        preparation: '',
        mordant: '',
        safety: '',
        contact: ''
      });
    }, 4000);
  };

  const filteredDyes = allDyes.filter(d => {
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchText = `${d.commonName} ${d.localName} ${d.dyeNumber} ${d.scientificName} ${d.origin} ${d.summary} ${d.whyItMatters}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    // Record Type
    if (selectedRecordType !== 'All') {
      if (selectedRecordType === 'Dye Source' && d.sourceCategory === 'Mineral') return false;
      if (selectedRecordType === 'Botanical Record' && d.sourceCategory === 'Mineral') return false;
    }

    // Category
    if (selectedCategory !== 'All' && d.sourceCategory !== selectedCategory) return false;

    // Colour Family
    if (selectedFamily !== 'All' && !d.colourFamilies.includes(selectedFamily)) return false;

    // Fibre
    if (selectedFibre !== 'All' && !d.primaryFibres.includes(selectedFibre)) return false;

    // Mordant
    if (selectedMordant !== 'All' && !d.mordantsAndModifiers.includes(selectedMordant)) return false;

    // Availability
    if (selectedAvailability !== 'All' && d.availability !== selectedAvailability) return false;

    // Safety
    if (selectedSafety !== 'All' && d.safetyClassification !== selectedSafety) return false;

    // Status
    if (selectedStatus !== 'All' && d.status !== selectedStatus) return false;

    return true;
  });

  // Sorting
  const sortedDyes = [...filteredDyes].sort((a, b) => {
    if (selectedSort === 'Recently Documented') {
      return b.dyeNumber.localeCompare(a.dyeNumber);
    }
    if (selectedSort === 'Colour Family') {
      return a.colourFamilies[0].localeCompare(b.colourFamilies[0]);
    }
    if (selectedSort === 'Dye Source') {
      return a.commonName.localeCompare(b.commonName);
    }
    if (selectedSort === 'Fibre Type') {
      return a.primaryFibres[0].localeCompare(b.primaryFibres[0]);
    }
    if (selectedSort === 'Availability Risk') {
      return a.availability.localeCompare(b.availability);
    }
    if (selectedSort === 'Safety Review') {
      return a.safetyClassification.localeCompare(b.safetyClassification);
    }
    if (selectedSort === 'A–Z') {
      return a.commonName.localeCompare(b.commonName);
    }
    return b.dyeNumber.localeCompare(a.dyeNumber); // Featured default
  });

  const totalPages = Math.ceil(sortedDyes.length / itemsPerPage);
  const paginatedDyes = sortedDyes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const featuredDye = allDyes[0]; // Madder

  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pb-24 animate-fadeIn">
      
      {/* Detailed Modal Registry Sheet */}
      {activeDye && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#3E2723]/40 backdrop-blur-sm" onClick={() => setActiveDye(null)}></div>
          <div className="relative z-10 bg-[#FAF9F6] border-2 border-[#3E2723] max-w-4xl w-full p-6 md:p-8 shadow-2xl text-[#2A2A2A] max-h-[95vh] overflow-y-auto custom-scrollbar font-mono rounded-xs" role="dialog" aria-modal="true">
            <button onClick={() => setActiveDye(null)} className="absolute top-4 right-4 text-[#3E2723]/50 hover:text-[#3E2723] text-xl font-bold font-mono">&times;</button>
            
            <div className="text-center mb-6 border-b border-[#3E2723]/25 pb-4">
              <span className="text-[#D4AF37] font-mono text-xs uppercase tracking-widest block mb-1 font-bold">KHCRF NATURAL DYE REGISTRY</span>
              <h2 className="text-xl md:text-2xl font-serif text-[#3E2723] font-bold leading-tight">{activeDye.commonName} ({activeDye.localName})</h2>
              {activeDye.scientificName && <p className="text-gray-555 text-xs italic font-serif mt-1">{activeDye.scientificName}</p>}
              
              <div className="flex flex-wrap justify-center gap-2 mt-3 font-mono text-[9px] uppercase tracking-wider text-gray-500">
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">CODE: {activeDye.dyeNumber}</span>
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">CATEGORY: {activeDye.sourceCategory}</span>
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">RISK: {activeDye.availability}</span>
              </div>
            </div>

            {/* Modal Tabs navigation */}
            <div className="flex flex-wrap gap-1 border-b border-[#3E2723]/20 pb-3 mb-6 text-[10px] font-mono justify-center">
              {[
                { id: 'overview', label: 'Technical Overview' },
                { id: 'recipe', label: 'Dye Recipe' },
                { id: 'matrix', label: 'Fibre Matrix' },
                { id: 'safety', label: 'Safety & Disposal' },
                { id: 'conservation', label: 'Conservation & Fastness' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveModalTab(tab.id as 'overview' | 'recipe' | 'matrix' | 'safety' | 'conservation')}
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
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2">Technical Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div><span className="text-gray-400">COMMON NAME      :</span> {activeDye.commonName}</div>
                      <div><span className="text-gray-400">LOCAL NAME       :</span> {activeDye.localName}</div>
                      <div><span className="text-gray-400">BOTANICAL NAME   :</span> {activeDye.scientificName}</div>
                      <div><span className="text-gray-400">PART USED        :</span> {activeDye.partUsed}</div>
                      <div><span className="text-gray-400">COLOUR FAMILIES  :</span> {activeDye.colourFamilies.join(', ')}</div>
                    </div>
                    <div className="space-y-1">
                      <div><span className="text-gray-400">GEOGRAPHIC ORIGIN:</span> {activeDye.origin}</div>
                      <div><span className="text-gray-400">HARVEST SEASON   :</span> {activeDye.harvestSeason}</div>
                      <div><span className="text-gray-400">CULTIVATED/WILD  :</span> {activeDye.cultivatedOrWild}</div>
                      <div><span className="text-gray-400">AVAILABILITY RISK:</span> {activeDye.availability}</div>
                      <div><span className="text-gray-400">VERSION RECORD   :</span> {activeDye.version} ({activeDye.status})</div>
                    </div>
                  </div>

                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2 mt-6">Why This Dye Matters</h3>
                  <p className="font-sans leading-relaxed text-gray-700 bg-white p-4 border border-[#3E2723]/10 shadow-xs">{activeDye.whyItMatters}</p>

                  <div className="border-t border-gray-200 pt-3 mt-3 space-y-1.5">
                    <div><span className="text-gray-400">HISTORICAL BACKGROUND:</span> {activeDye.historicalBackground}</div>
                    <div><span className="text-gray-400">PRIMARY CRAFTS       :</span> {activeDye.craftApplications.join(', ')}</div>
                  </div>
                </div>
              )}

              {/* TAB 2: DYE RECIPE */}
              {activeModalTab === 'recipe' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Recipe: {activeDye.recipeTitle}</h3>
                  <div className="space-y-4">
                    <div><strong>EXTRACTION METHOD:</strong> {activeDye.extractionMethod}</div>
                    <div><strong>RECOMMENDED MORDANTS:</strong> {activeDye.mordantsAndModifiers.join(', ')}</div>
                    
                    <div className="space-y-2 mt-4">
                      {activeDye.recipeSteps.map(step => (
                        <div key={step.stepNumber} className="border border-gray-200 p-3 bg-white flex justify-between items-center text-[9px]">
                          <div>
                            <span className="text-gray-400 block font-bold">STEP {step.stepNumber}</span>
                            <span className="font-bold text-gray-700">{step.instruction}</span>
                          </div>
                          <div className="text-right text-gray-500">
                            <div><strong>TEMP:</strong> {step.temperature}</div>
                            <div><strong>DUR:</strong> {step.duration}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: FIBRE MATRIX */}
              {activeModalTab === 'matrix' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Dye-Fibre-Mordant Behavior Matrix</h3>
                  <div className="bg-white border border-[#3E2723]/10 overflow-x-auto shadow-sm">
                    <table className="w-full text-left border-collapse text-[9px]">
                      <thead>
                        <tr className="bg-[#3E2723] text-[#D4AF37] font-mono uppercase">
                          <th className="p-3 border-b border-[#3E2723]/20">Fibre Type</th>
                          <th className="p-3 border-b border-[#3E2723]/20">Mordant / Modifier</th>
                          <th className="p-3 border-b border-[#3E2723]/20">Colour Outcome</th>
                          <th className="p-3 border-b border-[#3E2723]/20 text-center">Fastness Rating</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-sans text-gray-700">
                        {activeDye.fibreMatrix.map((fb, idx) => (
                          <tr key={idx} className="hover:bg-[#FAF9F6] transition-colors">
                            <td className="p-3 font-mono font-bold text-[#3E2723]">{fb.fibreType}</td>
                            <td className="p-3 font-mono">{fb.mordantUsed}</td>
                            <td className="p-3 font-bold">{fb.colorOutcome}</td>
                            <td className="p-3 text-center font-mono font-bold text-gray-600">{fb.fastnessRating}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: SAFETY & DISPOSAL */}
              {activeModalTab === 'safety' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <div className="bg-red-50/50 border border-red-200 p-4">
                    <span className="font-bold text-red-700 block uppercase mb-2 text-[9px]">Essential Safety Notice</span>
                    <p className="font-sans leading-relaxed text-red-900">Natural does not automatically mean safe. Some dye plants, minerals, mordants, fumes, residues, and historical recipes may be toxic, corrosive, irritating, environmentally harmful, or unsafe for domestic use. KHCRF documentation is educational and archival and must not replace professional chemical, occupational-health, botanical, or environmental guidance.</p>
                  </div>

                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2 mt-4">Required Safety Precautions</h3>
                  <ul className="list-disc pl-4 space-y-1 text-gray-700">
                    {activeDye.safetyPrecautions.map((safe, idx) => (
                      <li key={idx}>{safe}</li>
                    ))}
                  </ul>

                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2 mt-4">Waste &amp; Disposal Guidance</h3>
                  <p className="font-sans text-gray-600 leading-relaxed">{activeDye.disposalGuidance}</p>
                </div>
              )}

              {/* TAB 5: CONSERVATION & FASTNESS */}
              {activeModalTab === 'conservation' && (
                <div className="space-y-4 font-mono text-[10px] text-gray-700">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2">Conservation &amp; Display Behavior</h3>
                  <p className="font-sans leading-relaxed">{activeDye.conservationNotes}</p>

                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2 mt-4">Lightfastness Scale Status</h3>
                  <div><strong>Measured lightfastness values:</strong> {activeDye.lightfastnessScale}</div>
                  
                  <div className="border-t border-gray-250 pt-3 mt-4 text-[9px] text-gray-500 space-y-1">
                    <div><strong>REFERENCED ARCHIVE OBJECTS:</strong> {activeDye.referencedObjects.join(', ')}</div>
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
                <button onClick={() => setActiveDye(null)} className="border border-[#3E2723] hover:bg-[#3E2723]/5 text-[#3E2723] px-6 py-3 uppercase tracking-wider text-xs transition-colors font-light font-mono">
                  Return to Archive
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Hero section */}
      <UniversalEditorialHero pageKey="natural-dyes" fallbackConfig={naturalDyesHeroFallback as unknown as Parameters<typeof UniversalEditorialHero>[0]['fallbackConfig']} />

      <div className="container-fluid mx-auto px-4 md:px-10 py-12 max-w-7xl animate-fadeIn">
        
        {/* Scholarly Statement */}
        <div className="bg-[#3E2723]/5 border-l-4 border-[#3E2723] p-8 mb-12 rounded-r-xs max-w-5xl font-sans">
          <p className="text-gray-700 text-base md:text-lg leading-relaxed font-serif">
            Unlike <strong>Tools &amp; Materials</strong> which documents physical inputs, <strong>Natural Dyes</strong> preserves the <strong>specialised knowledge system through which colour is extracted, prepared, controlled, applied, tested, and preserved</strong>. This page answers: <em>&ldquo;How were colours traditionally produced, what materials and conditions shaped them, and how can this knowledge be responsibly preserved and used today?&rdquo;</em>
          </p>
          <p className="text-gray-755 text-xs mt-3 uppercase tracking-widest font-bold font-mono">
            Natural dyeing is a complex craft knowledge system combining botany, chemistry, water, heat, timing, fibre preparation, colour judgement, and workshop experience. The final colour produced by a plant, bark, root, flower, fruit, mineral, insect-derived substance, or other natural source depends upon numerous variables. Sourcing, seasons, age, water composition, vessel types, mordants, fibers, temperatures, and timing all shape the outcome.
          </p>
          <div className="bg-red-50/50 border border-red-200 p-4 my-6 font-mono text-[10px] text-red-800 leading-relaxed">
            <strong>Essential Safety Notice:</strong> Natural does not automatically mean safe. Some dye plants, minerals, mordants, fumes, residues, and historical recipes may be toxic, corrosive, irritating, environmentally harmful, or unsafe for domestic use. KHCRF documentation is educational and archival and must not replace professional chemical, occupational-health, botanical, or environmental guidance.
          </div>
          <div className="flex flex-wrap gap-4 mt-6 font-mono text-xs">
            <a href="#results" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-5 py-2.5 font-bold uppercase tracking-wider transition-all">
              Explore Natural Dyes
            </a>
            <a href="#nomination-section" className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-5 py-2.5 font-bold uppercase tracking-wider transition-all">
              Document a Dye Tradition
            </a>
            <a href="#methodology" className="text-[#3E2723] hover:underline font-bold py-2.5">
              Read Dye Documentation &amp; Safety Standards &rarr;
            </a>
          </div>
        </div>

        {/* Featured Dye Card */}
        <section className="bg-white border-4 border-[#3E2723] p-8 md:p-10 mb-16 relative shadow-md">
          <div className="absolute top-0 right-0 bg-[#3E2723] text-[#D4AF37] px-4 py-1 text-[10px] font-mono font-bold uppercase tracking-widest">
            FEATURED DYE SOURCE
          </div>
          
          <div className="max-w-4xl font-mono">
            <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-1">
              Dye Source Record: {featuredDye.dyeNumber}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3E2723] leading-tight mb-2">
              {featuredDye.commonName} ({featuredDye.localName})
            </h2>
            <h3 className="text-base md:text-lg font-serif italic text-gray-550 mb-4">
              {featuredDye.scientificName}
            </h3>
            
            <p className="text-gray-700 text-sm leading-relaxed mb-6 font-sans text-gray-655">
              {featuredDye.summary}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 font-mono text-[10px] border-t border-b border-gray-250 py-3 bg-gray-55 px-4">
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Source Part</span>
                <span className="font-bold text-[#3E2723]">{featuredDye.partUsed}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Primary Fibres</span>
                <span className="font-bold text-[#3E2723]">{featuredDye.primaryFibres.join(', ')}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Availability</span>
                <span className="font-bold text-[#3E2723]">{featuredDye.availability}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Dye Status</span>
                <span className="font-bold text-[#D4AF37] font-bold">{featuredDye.status}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => { setActiveDye(featuredDye); setActiveModalTab('overview'); }}
                className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-all font-mono"
              >
                Study Dye Source &rarr;
              </button>
            </div>
          </div>
        </section>

        {/* Why Dyes Matter Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start mt-12">
          <div className="lg:col-span-5 font-sans">
            <h2 className="text-3xl font-serif text-[#3E2723] mb-6 font-bold">Colour Is Knowledge, Not Just Appearance</h2>
            <p className="text-gray-655 text-sm leading-relaxed mb-6">
              Traditional colour is created through accumulated judgement. An experienced dyer may assess a dye bath through smell, temperature, tone, sediment, fibre response, and the behaviour of colour under light. Much of this knowledge is learned through observation and repeated practice rather than written formulae.
            </p>
            <p className="text-gray-605 text-sm leading-relaxed">
              By documenting natural dyes, KHCRF preserves: traditional colour vocabulary, dye-source identification, seasonal harvesting knowledge, fibre preparation, extraction methods, mordanting practices, recipe proportions, and fastness knowledge.
            </p>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#3E2723]/10 p-8 rounded-xs shadow-xs">
            <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 font-mono">
              Natural Color Knowledge Safeguards:
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700 font-sans font-mono">
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>traditional color vocabulary</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>dye-source botanical profiles</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>seasonal harvesting guidelines</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>fiber mordanting practices (Alum, Iron)</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>water Jhelum spring pH effects</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>controlled fiber fastness reviews</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>occupational safety instructions</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>historical museum palette analyses</li>
            </ul>
          </div>
        </section>

        {/* Archive Overview Dashboard */}
        <section className="bg-[#3E2723] text-white p-8 md:p-10 mb-12 rounded-xs relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#3E2723] px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-widest">
            Registry Overview
          </div>
          <div className="mb-8 font-mono">
            <h3 className="font-serif text-2xl text-[#D4AF37] mb-2 font-bold font-serif">Natural Dyes Overview</h3>
            <p className="text-white/60 text-xs">
              LIVE COLOUR SCIENCE ARCHIVE &amp; ETHNOBOTANICAL REGISTRY
            </p>
          </div>

          {/* Primary Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 text-center md:text-left border-b border-white/10 pb-8 mb-8">
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono font-mono">Dye Sources</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">86</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Colour Records</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">247</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Traditional Recipes</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">119</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono font-mono font-mono">Fibre Tests</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">173</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono font-mono">Dye Practitioners</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">42</span>
            </div>
            <div className="last:border-0">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono font-mono font-mono font-mono">Historical References</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">138</span>
            </div>
          </div>

          {/* Secondary Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 text-center md:text-left font-mono">
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Botanical Sources</span>
              <span className="text-xl font-serif font-semibold text-white/80 font-mono">61</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Mineral Sources</span>
              <span className="text-xl font-serif font-semibold text-white/80">12</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono font-mono font-mono">Mordants &amp; Modifiers</span>
              <span className="text-xl font-serif font-semibold text-white/80 font-mono">18</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono font-mono font-mono">Colourfastness Studies</span>
              <span className="text-xl font-serif font-semibold text-white/80 font-mono font-mono">74</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Regional Dye Traditions</span>
              <span className="text-xl font-serif font-semibold text-white/80">27</span>
            </div>
            <div className="last:border-0">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono font-mono font-mono">Conservation Notes</span>
              <span className="text-lg font-serif font-semibold text-[#D4AF37] block leading-tight font-mono">53</span>
            </div>
          </div>
        </section>

        {/* View Switcher Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 bg-[#FAF9F6] border border-[#3E2723]/10 p-4 font-mono" id="results">
          <div className="text-xs font-serif text-[#3E2723]">
            Natural Dyes Archive &bull; Showing {sortedDyes.length} Documented Plants &amp; Recipes
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] text-gray-400 uppercase self-center mr-2 font-mono">Archive Layout View:</span>
            <button 
              onClick={() => { setCurrentView('archive'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'archive' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Dye Archive
            </button>
            <button 
              onClick={() => { setCurrentView('atlas'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'atlas' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Colour Atlas
            </button>
            <button 
              onClick={() => { setCurrentView('map'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'map' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Source Map
            </button>
            <button 
              onClick={() => { setCurrentView('matrix'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'matrix' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Recipe &amp; Fibre Matrix
            </button>
          </div>
        </div>

        {/* Search and Discovery Layout */}
        <section className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Filters Sidebar */}
          {currentView !== 'map' && currentView !== 'matrix' && (
            <div className="w-full lg:w-1/4 bg-white border border-[#3E2723]/10 p-6 shadow-xs sticky top-4 z-10 font-sans">
              <h3 className="font-serif text-lg text-[#3E2723] mb-6 pb-2 border-b border-gray-100 flex items-center justify-between font-bold">
                <span>Filter Archive</span>
                <button 
                  onClick={() => {
                    setSelectedRecordType('All');
                    setSelectedCategory('All');
                    setSelectedFamily('All');
                    setSelectedFibre('All');
                    setSelectedMordant('All');
                    setSelectedAvailability('All');
                    setSelectedSafety('All');
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

              <div className="space-y-6 text-xs">
                {/* Search Field */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Search Keyword</label>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder="Search by dye source, local name, colour..."
                    className="w-full border border-gray-200 px-3 py-2 text-xs rounded-none bg-[#FAF9F6] text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  />
                </div>

                {/* Record Type */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Record Type</label>
                  <select 
                    value={selectedRecordType}
                    onChange={(e) => { setSelectedRecordType(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Types</option>
                    <option value="Dye Source">Dye Source</option>
                    <option value="Botanical Record">Botanical Record</option>
                    <option value="Dye Recipe">Dye Recipe</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Part Used</label>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Parts</option>
                    <option value="Root">Root / Rhizome</option>
                    <option value="Leaf">Leaf</option>
                    <option value="Peel">Fruit Peel / Rind</option>
                  </select>
                </div>

                {/* Color Family */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Colour Family</label>
                  <select 
                    value={selectedFamily}
                    onChange={(e) => { setSelectedFamily(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Colours</option>
                    <option value="Red">Red</option>
                    <option value="Yellow">Yellow / Gold</option>
                    <option value="Blue">Blue / Indigo</option>
                    <option value="Brown">Brown / Grey</option>
                  </select>
                </div>

                {/* Fibre compatibility */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Fibre Type</label>
                  <select 
                    value={selectedFibre}
                    onChange={(e) => { setSelectedFibre(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Fibres</option>
                    <option value="Pashmina">Pashmina</option>
                    <option value="Wool">Sheep Wool</option>
                    <option value="Silk">Silk</option>
                    <option value="Cotton">Cotton</option>
                  </select>
                </div>

                {/* Mordants */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Mordant / Modifier</label>
                  <select 
                    value={selectedMordant}
                    onChange={(e) => { setSelectedMordant(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Mordants</option>
                    <option value="Alum">Alum</option>
                    <option value="Iron">Iron Vitriol</option>
                    <option value="Tannin">Tannin Base</option>
                  </select>
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Availability Status</label>
                  <select 
                    value={selectedAvailability}
                    onChange={(e) => { setSelectedAvailability(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Stable">Stable</option>
                    <option value="Generally Available">Generally Available</option>
                    <option value="Seasonally Limited">Seasonally Limited</option>
                    <option value="Increasingly Difficult to Source">Difficult to Source</option>
                  </select>
                </div>

                {/* Safety Classification */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Safety Classification</label>
                  <select 
                    value={selectedSafety}
                    onChange={(e) => { setSelectedSafety(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Risks</option>
                    <option value="Low Documented Risk">Low Documented Risk</option>
                    <option value="Handling Precautions Required">Handling Precautions Required</option>
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
                    <option value="Colour Family">Colour Family</option>
                    <option value="Dye Source">Dye Source</option>
                    <option value="Fibre Type">Fibre Type</option>
                    <option value="Availability Risk">Availability Risk</option>
                    <option value="Safety Review">Safety Review</option>
                    <option value="A–Z">A–Z</option>
                  </select>
                </div>

              </div>
            </div>
          )}

          {/* Results Area */}
          <div className={`w-full ${currentView === 'map' || currentView === 'matrix' ? 'lg:w-full' : 'lg:w-3/4'}`}>

            {loading ? (
              <div className="py-20 text-center text-gray-550 font-serif font-bold">Loading dyes...</div>
            ) : (
              <>
                {/* 1. DYE ARCHIVE VIEW */}
                {currentView === 'archive' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                    {paginatedDyes.map((d, i) => (
                      <div 
                        key={i} 
                        className="bg-white border-2 border-[#3E2723]/35 py-8 px-6 hover:bg-[#3E2723]/5 transition-all duration-300 group flex flex-col justify-between shadow-sm relative grid-ledger font-mono text-xs text-gray-700"
                      >
                        <div>
                          {/* Accession ID & Part used header */}
                          <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5 font-semibold">
                            <span>{d.dyeNumber}</span>
                            <span>{d.partUsed.toUpperCase()}</span>
                          </div>

                          {/* Category & Botanical */}
                          <div className="text-[9px] font-mono text-[#D4AF37] font-bold uppercase tracking-widest mb-4">
                            {d.sourceCategory.toUpperCase()} &bull; {d.scientificName}
                          </div>

                          {/* Title */}
                          <h3 
                            onClick={() => { setActiveDye(d); setActiveModalTab('overview'); }}
                            className="text-xl md:text-2xl font-serif font-bold text-[#3E2723] leading-snug cursor-pointer group-hover:text-[#D4AF37] transition-colors"
                          >
                            {d.commonName} ({d.localName})
                          </h3>

                          <p className="text-gray-655 text-xs leading-relaxed mb-4 font-sans line-clamp-3 mt-3">
                            {d.summary}
                          </p>

                          {/* Color families indicator */}
                          <div className="relative pl-4 mb-4 border-l-2 border-[#D4AF37]/50 font-mono text-[10px] leading-relaxed my-4">
                            <span className="text-[9px] text-gray-400 uppercase tracking-wider block mb-1">
                              COLOUR FAMILIES &bull; ORIGIN RANGE
                            </span>
                            <span className="font-bold text-[#3E2723]">
                              {d.colourFamilies.join(' · ')} ({d.origin})
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="text-[#3E2723]/25 text-[9px] font-mono mb-3 select-none">
                            ─────╱╲──╱────╲╱─────
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto font-mono">
                            <span className="bg-[#3E2723]/5 border border-[#3E2723]/10 text-[#3E2723] text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider">
                              {d.safetyClassification.toUpperCase()}
                            </span>
                            
                            <button 
                              onClick={() => { setActiveDye(d); setActiveModalTab('recipe'); }}
                              className="text-xs font-bold uppercase tracking-widest text-[#3E2723] hover:text-[#D4AF37] transition-colors font-mono"
                            >
                              Study Dye &rarr;
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

                {/* 2. COLOUR ATLAS VIEW */}
                {currentView === 'atlas' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeIn font-mono text-xs text-[#3E2723]">
                    {sortedDyes.map((d, idx) => (
                      <div key={idx} className="bg-white border-2 border-[#3E2723] p-5 shadow-md space-y-4">
                        <div 
                          className="w-full aspect-[4/3] border border-gray-200"
                          style={{ backgroundColor: d.hexCode }}
                        ></div>
                        <div className="space-y-1">
                          <span className="text-gray-400 text-[8px] block uppercase">COLOUR RESULT</span>
                          <h4 className="font-serif text-base font-bold text-[#3E2723]">{d.colourFamilies[0]} ({d.localName})</h4>
                          <div className="text-[9px] text-gray-500">
                            <div><strong>SOURCE:</strong> {d.commonName} ({d.scientificName})</div>
                            <div><strong>FIBRE:</strong> {d.primaryFibres[0]}</div>
                            <div><strong>MORDANT:</strong> {d.mordantsAndModifiers[0]}</div>
                          </div>
                        </div>
                        <button 
                          onClick={() => { setActiveDye(d); setActiveModalTab('matrix'); }}
                          className="w-full bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] py-2 font-bold uppercase tracking-widest text-[9px] transition-colors font-mono"
                        >
                          View Swatch Specs &rarr;
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. SOURCE MAP VIEW */}
                {currentView === 'map' && (
                  <div className="bg-white border-2 border-[#3E2723] p-6 shadow-md animate-fadeIn font-mono text-xs text-[#3E2723]">
                    <span className="text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest block mb-1">ECOLOGICAL SOURCE MAP</span>
                    <h3 className="font-serif text-lg font-bold mb-6 border-b border-gray-150 pb-2">Botanical Sourcing Ranges &bull; Forest Foothills</h3>
                    
                    <div className="space-y-4">
                      {sortedDyes.map((d, idx) => (
                        <div key={idx} className="border border-gray-250 p-4 bg-[#FAF9F6] flex justify-between items-center">
                          <div>
                            <span className="text-[8px] text-gray-400 uppercase font-bold block">Source Range Foothills</span>
                            <strong className="text-[#3E2723] text-sm font-serif">{d.origin}</strong>
                          </div>
                          <div>
                            <span className="text-[8px] text-gray-400 uppercase font-bold block">BOTANICAL SOURCE</span>
                            <span className="text-gray-750 font-bold">{d.commonName} ({d.scientificName})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. RECIPE & FIBRE MATRIX VIEW */}
                {currentView === 'matrix' && (
                  <div className="bg-white border border-[#3E2723]/10 overflow-x-auto shadow-sm animate-fadeIn font-mono text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#3E2723] text-[#D4AF37] font-mono uppercase tracking-wider text-[10px]">
                          <th className="p-4 border-b border-[#3E2723]/20">Fibre Type</th>
                          <th className="p-4 border-b border-[#3E2723]/20">Dye Source</th>
                          <th className="p-4 border-b border-[#3E2723]/20">Mordant / Modifier</th>
                          <th className="p-4 border-b border-[#3E2723]/20">Colour Outcome</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center">Fastness Rating</th>
                          <th className="p-4 border-b border-[#3E2723]/20">Documentation status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#3E2723]/10 font-sans text-gray-700 text-xs">
                        {sortedDyes.flatMap(dye => 
                          dye.fibreMatrix.map((matrix, mIdx) => (
                            <tr key={`${dye.dyeNumber}-${mIdx}`} className="hover:bg-[#FAF9F6] transition-colors cursor-pointer" onClick={() => { setActiveDye(dye); setActiveModalTab('matrix'); }}>
                              <td className="p-4 font-mono font-bold text-[#3E2723]">{matrix.fibreType}</td>
                              <td className="p-4 font-serif font-bold whitespace-nowrap">{dye.commonName}</td>
                              <td className="p-4 font-mono">{matrix.mordantUsed}</td>
                              <td className="p-4 font-bold">{matrix.colorOutcome}</td>
                              <td className="p-4 text-center font-mono font-bold text-gray-650">{matrix.fastnessRating}</td>
                              <td className="p-4 whitespace-nowrap font-mono">
                                <span className="px-2 py-0.5 font-mono text-[9px] uppercase border border-[#3E2723]/20 bg-[#3E2723]/5 text-[#3E2723] font-bold">
                                  {dye.status}
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
            How KHCRF Documents Natural Dyes
          </h2>
          <p className="text-gray-655 text-sm leading-relaxed mb-6">
            Natural dye records are developed through artisan interviews, workshop observation, recipe documentation, botanical identification, material sampling, fibre testing, historical research, museum study, conservation evidence, and technical analysis where available.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 text-xs font-mono">
            <div>
              <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3 font-mono">Research Workflow</h3>
              <ol className="list-decimal pl-4 space-y-2 text-gray-600">
                <li>Dye source or practice nomination and practitioner consent</li>
                <li>Source botanical identification &amp; traditional terminology mapping</li>
                <li>Recipe process &amp; fiber preparation controlled dye testing</li>
                <li>Lightfastness &amp; safety classification review analysis</li>
                <li>Technical review by elders, validation, and final publication</li>
              </ol>
            </div>
            <div>
              <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3 font-mono">Documentation Principles</h3>
              <ul className="list-disc pl-4 space-y-2 text-gray-600">
                <li>preserve local terminology with absolute scientific accuracy</li>
                <li>distinguish workshop testimony from laboratory testing profiles</li>
                <li>neutral documentation of modern substitutes without simple labels</li>
                <li>strict protection of ecologically sensitive forest coordinates</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Research & Educational Use */}
        <section className="bg-white border border-[#3E2723]/25 p-8 md:p-10 mb-16 rounded-xs shadow-sm font-sans">
          <h2 className="text-2xl font-serif text-[#3E2723] mb-4 font-bold">Research &amp; Educational Use</h2>
          <p className="text-gray-655 text-sm leading-relaxed mb-6">
            The archive supports artisan vocational training, conservation sciences, museum research, ethnobotanical studies, environmental effluent monitoring, and heritage policy guidelines.
          </p>
          <div className="flex gap-4 font-mono">
            <Link href="mailto:research@khcrf.org" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3 font-bold uppercase tracking-wider text-xs transition-colors">
              Request Research Access
            </Link>
            <a href="#nomination-section" className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-6 py-3 font-bold uppercase tracking-wider text-xs transition-colors">
              Use the Colour Atlas
            </a>
          </div>
        </section>

        {/* Nominate Dye Tradition Form */}
        <section id="nomination-section" className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs">
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase block mb-1 font-mono">Help Preserve Kashmir’s Colour Knowledge</span>
            <h2 className="text-3xl font-serif text-[#3E2723] font-bold">Submit Natural Dye Documentation</h2>
            <p className="text-gray-500 text-xs font-mono mt-1">Dyers, botanists, conservators, and researchers are invited to contribute documentation drafts.</p>
          </div>

          <div className="bg-[#FAF9F6] p-6 md:p-8 border border-gray-250">
            {proposalSubmitted ? (
              <div className="text-center py-8 font-mono">
                <h3 className="text-lg font-bold text-green-600 mb-2">Dye Documentation Staged</h3>
                <p className="text-xs text-gray-500">Thank you. The KHCRF Botanical &amp; Chemical Committee will verify your extraction parameters.</p>
              </div>
            ) : (
              <form onSubmit={handleProposalSubmit} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Dye Source / Colour Name *</label>
                    <input 
                      required 
                      type="text" 
                      value={proposalForm.title}
                      onChange={(e) => setProposalForm({...proposalForm, title: e.target.value})}
                      placeholder="e.g. Madder Root Red"
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
                      placeholder="e.g. Manjith"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Source Category *</label>
                    <input 
                      required 
                      type="text" 
                      value={proposalForm.category}
                      onChange={(e) => setProposalForm({...proposalForm, category: e.target.value})}
                      placeholder="e.g. Root, Leaf, Fruit Peel"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Fibre compatibility *</label>
                    <input 
                      required
                      type="text" 
                      value={proposalForm.craft}
                      onChange={(e) => setProposalForm({...proposalForm, craft: e.target.value})}
                      placeholder="e.g. Pashmina, Sheep Wool"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Mordants / Modifiers *</label>
                    <input 
                      required
                      type="text" 
                      value={proposalForm.mordant}
                      onChange={(e) => setProposalForm({...proposalForm, mordant: e.target.value})}
                      placeholder="e.g. Alum mordant, Iron modifier"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Origin / Sourcing *</label>
                    <input 
                      required
                      type="text" 
                      value={proposalForm.source}
                      onChange={(e) => setProposalForm({...proposalForm, source: e.target.value})}
                      placeholder="e.g. Kashmir Forest Foothills"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-500 mb-1">Recipe Outline &amp; Process Summary *</label>
                  <textarea 
                    required 
                    rows={4} 
                    value={proposalForm.preparation}
                    onChange={(e) => setProposalForm({...proposalForm, preparation: e.target.value})}
                    placeholder="Outline step-by-step extraction times, temperatures, bath ratios, and color checks..."
                    className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723] resize-none" 
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-500 mb-1">Safety Precautions &amp; Contributor Details *</label>
                  <textarea 
                    required
                    rows={2} 
                    value={proposalForm.safety}
                    onChange={(e) => setProposalForm({...proposalForm, safety: e.target.value})}
                    placeholder="Document toxicity warnings, ventilation requirements, or disposal logs..."
                    className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723] resize-none" 
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Contact Coordinates *</label>
                    <input 
                      required
                      type="text" 
                      value={proposalForm.contact}
                      onChange={(e) => setProposalForm({...proposalForm, contact: e.target.value})}
                      placeholder="Contributor name, email, or phone number"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-[#3E2723] hover:bg-[#D4AF37] text-white hover:text-[#3E2723] font-bold uppercase tracking-widest transition-colors font-mono"
                >
                  Submit Natural Dye Documentation
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
            &ldquo;The KHCRF Natural Dyes Archive preserves the knowledge through which natural materials become colour. By documenting sources, fibres, recipes, mordants, water, vessels, workshop practices, safety, ecology, and conservation behaviour, the archive protects a sophisticated heritage system connecting craft, science, environment, and human judgement.&rdquo;
          </p>
          <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto"></div>
        </div>
      </footer>

    </main>
  );
}
