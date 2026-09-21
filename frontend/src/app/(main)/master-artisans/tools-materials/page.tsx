'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { toolsMaterialsHeroFallback } from '@/config/heroFallbacks';

interface ToolAnatomy {
  part: string;
  description: string;
}

interface MaterialProperty {
  property: string;
  value: string;
}

interface QualityGrade {
  gradeName: string;
  criteria: string;
}

interface ToolMaterialRecord {
  slug: string;
  recordNumber: string;
  recordType: 'Tool' | 'Material';
  title: string;
  subtitle: string;
  localName: string;
  craft: 'Carpet' | 'Pashmina' | 'Kani' | 'Sozni' | 'Crewel' | 'Papier-Mâché' | 'Walnut Wood' | 'Copperware' | 'Namda' | 'Willow Wicker' | 'Chain Stitch' | 'Multi-Craft';
  category: string;
  functionOrUse: string;
  materialComposition: string;
  origin: string;
  seasonality: string;
  availability: 'Stable' | 'Generally Available' | 'Seasonally Limited' | 'Increasingly Difficult to Source' | 'Supply Vulnerable' | 'Environmentally Sensitive' | 'Severely Restricted' | 'Historical Material' | 'Status Unknown' | 'Limited';
  preparationState: string;
  riskStatus: string;
  status: 'Fully Documented' | 'Technical Review Complete' | 'Artisan-Verified' | 'Under Research' | 'Material Testing' | 'Archive Preview';
  version: string;
  summary: string;
  whyItMatters: string;
  historicalBackground: string;
  dimensions?: string;
  weight?: string;
  maker?: string;
  anatomy?: ToolAnatomy[];
  properties?: MaterialProperty[];
  grades?: QualityGrade[];
  maintenance?: string[];
  preparationPathway?: string[];
  alternatives?: { original: string; substitute: string; comparison: string };
  authenticityConcerns?: string;
  conservationNotes?: string;
  referencedObjects: string[];
}

export default function ToolsMaterials() {
  const [allRecords] = useState<ToolMaterialRecord[]>([
    {
      slug: "ro-pashmina-fibre",
      recordNumber: "KHCRF-MAT-2026-001",
      recordType: "Material",
      title: "Pashmina Fibre",
      subtitle: "Material Quality, Preparation, Source, and Technical Behaviour Before Spinning",
      localName: "Pashm",
      craft: "Pashmina",
      category: "Animal Fibre",
      functionOrUse: "Base warp and weft spun threads",
      materialComposition: "Capra Hircus underwool",
      origin: "Himalayan Pastoral Systems (Ladakh Changthang)",
      seasonality: "High (combed in spring)",
      availability: "Increasingly Difficult to Source",
      preparationState: "Sorted & Dehaired",
      riskStatus: "Material Pressure Under Review",
      status: "Fully Documented",
      version: "v3.1",
      summary: "Pashmina fibre forms the material foundation of one of Kashmir’s most renowned textile traditions. Its quality depends upon fibre fineness, length, cleanliness, sorting, dehairing, storage, spinning preparation, and the conditions under which it is handled. This record documents the material not simply as a luxury commodity, but as a technical substance whose properties determine yarn quality.",
      whyItMatters: "Tools and materials are not passive inputs. They carry technical knowledge, regional identity, environmental history, and workshop memory. Pashm underwool properties directly affect Kani loom thread tensioning, determining whether weavers can execute micro-motifs without thread snap events.",
      historicalBackground: "Sourced traditionally from high-altitude nomadic pastoral routes connecting Lhasa, Ladakh, and Srinagar since the 14th century.",
      properties: [
        { property: "Fibre Diameter", value: "12-15 microns average" },
        { property: "Fibre Length", value: "35mm - 55mm" },
        { property: "Elasticity", value: "High bounce recovery rate" },
        { property: "Dye Absorption", value: "Excellent response to natural mordanted dye compounds" }
      ],
      grades: [
        { gradeName: "Grade A (Grade One)", criteria: "Pure underwool combed manually, fiber diameter under 13 microns, zero coarse hair." },
        { gradeName: "Grade B (Standard)", criteria: "Machine sorted, minimal guard hair content, diameter 14-15 microns." }
      ],
      preparationPathway: [
        "Raw wool collection from nomadic Changpa herders.",
        "Sifting with local rice flour or clay to absorb animal oils.",
        "Manual dehairing (separating fine underwool from coarse guard hairs).",
        "Combing over vertical metal cards to align staple directions."
      ],
      alternatives: {
        original: "Pure Changthang Pashmina",
        substitute: "Imported merino blend or synthetic viscose",
        comparison: "Substitutes lack natural microscopic heat hollows, have higher diameter counts, and pill rapidly."
      },
      authenticityConcerns: "Fibers blended with merino or nylon are often mislabeled as 100% Pashmina, undermining the geographical indication (GI) accreditation standards.",
      conservationNotes: "Store in linen casings under 45% relative humidity; highly vulnerable to clothes moths and structural fiber breakdown from direct sunlight.",
      referencedObjects: ["KHCRF-OBJ-2026-0005", "KHCRF-OBJ-2026-0361"]
    },
    {
      slug: "ro-kani-shuttle",
      recordNumber: "KHCRF-TOOL-2026-001",
      recordType: "Tool",
      title: "Kani Weaving Shuttle",
      subtitle: "The Small Wooden Weaving Implement That Gives the Kani Shawl Its Name",
      localName: "Tuji",
      craft: "Kani",
      category: "Weaving Tool",
      functionOrUse: "Holding and wrapping design thread counts",
      materialComposition: "Seasoned wild walnut or boxwood",
      origin: "Kanihama, Budgam",
      seasonality: "None",
      availability: "Generally Available",
      preparationState: "Shaped & Polished",
      riskStatus: "Obsolete Toolmaker Risks",
      status: "Artisan-Verified",
      version: "v2.0",
      summary: "The Kani is a small wooden tool used to interlace coloured weft threads according to a coded design system. Its shape, size, finish, handling, and relationship to the loom affect speed, control, colour transitions, and pattern precision. The tool demonstrates how a seemingly simple implement can carry generations of specialized knowledge.",
      whyItMatters: "Tuji design determines how cleanly weavers pass yarn between the vertical warp threads. Obsolete tool shapes can increase weaving times by 20% due to friction catch events.",
      historicalBackground: "Passed down through woodturning centers in Ganderbal and Budgam districts.",
      dimensions: "80mm length, 6mm diameter",
      weight: "12 grams",
      maker: "Kanihama Woodturners Collective",
      anatomy: [
        { part: "Bobbin Tip", description: "Smooth rounded end to slide between warp threads without splitting fibers." },
        { part: "Thread Reservoir", description: "Central grooved section holding up to 20 meters of dyed silk/wool weft thread." }
      ],
      maintenance: [
        "Light sand with wild apricot seed oil every six months.",
        "Store in dry boxwood chests to prevent humidity warp."
      ],
      referencedObjects: ["KHCRF-OBJ-2026-0184", "KHCRF-OBJ-2026-0217"]
    },
    {
      slug: "walnut-carving-gouge",
      recordNumber: "KHCRF-TOOL-2026-014",
      recordType: "Tool",
      title: "Walnut Carving Gouge",
      subtitle: "A curved cutting tool used to remove wood, shape relief, and establish carved depth",
      localName: "Wathlo",
      craft: "Walnut Wood",
      category: "Carving Tool",
      functionOrUse: "Relief carving and deep detail outlining",
      materialComposition: "High-carbon forged steel blade with ash wood handle",
      origin: "Srinagar Blacksmith Wards",
      seasonality: "None",
      availability: "Limited",
      preparationState: "Honed",
      riskStatus: "Fewer blacksmiths forging specialist chisels",
      status: "Artisan-Verified",
      version: "v1.1",
      summary: "A curved cutting tool used to remove wood, shape relief, and establish carved depth. The gouge allows the woodcarver to slice walnut grain smoothly, leaving satin wood textures that do not require sanding.",
      whyItMatters: "Kashmiri relief woodcarving is deep and layered. Traditional hand-forged tools can hold an extremely sharp edge, preventing the wild walnut grain from tearing during undercut work.",
      historicalBackground: "Forged by family blacksmith lineages in Downtown Srinagar who specialize in edge-tool geometry.",
      dimensions: "180mm length, 12mm blade sweep",
      weight: "120 grams",
      maker: "Ustad Ghulam Blacksmith Guild",
      anatomy: [
        { part: "Bevel Edge", description: "Sharp cutting bevel set at 25 degrees for soft walnut slicing." },
        { part: "Ferrule ring", description: "Brass collar reinforcing the wooden handle junction." }
      ],
      maintenance: [
        "Hone daily using local sharpening oil on natural whetstones.",
        "Wipe with linseed oil to prevent surface rust."
      ],
      referencedObjects: ["KHCRF-OBJ-2026-0312"]
    },
    {
      slug: "walnut-wood",
      recordNumber: "KHCRF-MAT-2026-008",
      recordType: "Material",
      title: "Walnut Wood",
      subtitle: "A dense, workable hardwood associated with Kashmir’s architectural and decorative carving",
      localName: "Dun",
      craft: "Walnut Wood",
      category: "Wood",
      functionOrUse: "Furniture panels and architectural ceiling beams",
      materialComposition: "Juglans regia timber",
      origin: "Kashmir Forest Ranges",
      seasonality: "High (winter logging yields best density)",
      availability: "Limited",
      preparationState: "Seasoned",
      riskStatus: "Environmental logging restrictions",
      status: "Fully Documented",
      version: "v1.4",
      summary: "A dense, workable hardwood associated with Kashmir’s architectural and decorative carving. Sourced from mature wild trees, walnut wood is valued for its strength, dimensional stability, and dark fine grain.",
      whyItMatters: "Walnut trees must grow for 80-100 years before their wood yields the deep dark color required for master carvings. Fresh, unseasoned wood cracks during carving, destroying months of design work.",
      historicalBackground: "The timber of choice for palace columns and temple paneling in Kashmir since the historical Sultanate period.",
      properties: [
        { property: "Density", value: "640 kg/m³ average" },
        { property: "Shrinkage Rate", value: "Low after correct air-seasoning cycles" }
      ],
      grades: [
        { gradeName: "Khoi (Root wood)", criteria: "Darkest root section timber with rich swirly grain, reserved for luxury boxes." },
        { gradeName: "Lasp (Branch wood)", criteria: "Lighter cream colored wood, used for secondary structural panels." }
      ],
      preparationPathway: [
        "Selective harvesting of mature walnut trees.",
        "Log slicing into planks under controlled sawmill conditions.",
        "Air-drying seasoning for 2-5 years depending on plank thickness."
      ],
      alternatives: {
        original: "Kashmiri Wild Walnut Wood",
        substitute: "Imported American walnut or local poplar timber",
        comparison: "Poplar lacks the mechanical strength for deep relief carving and chips easily under hammer pressure."
      },
      authenticityConcerns: "Softwoods like poplar are stained dark and sold as genuine walnut wood, which decays and wraps within years.",
      conservationNotes: "Avoid exposure to wood-boring beetles; keep finished panels sealed with natural beeswax layers.",
      referencedObjects: ["KHCRF-OBJ-2026-0033", "KHCRF-OBJ-2026-0312"]
    }
  ]);

  const [loading] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecordType, setSelectedRecordType] = useState('All');
  const [selectedCraft, setSelectedCraft] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Featured');

  const [activeRecord, setActiveRecord] = useState<ToolMaterialRecord | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'overview' | 'anatomy' | 'sourcing' | 'maintenance' | 'safety'>('overview');
  const [currentView, setCurrentView] = useState<'catalogue' | 'toolkit' | 'map' | 'process'>('catalogue');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Sourcing coordinates data for map view
  const sourcingLocations = [
    { name: "Ladakh Changthang Plains", material: "Raw Pashmina Fibers (Hircus Goat underwool)", type: "Origin Range" },
    { name: "Downtown Srinagar Wards", material: "Hand-forged steel chisels (Wathlo) & copperware sheets", type: "Blacksmith Center" },
    { name: "Kanihama Village, Budgam", material: "Kani shuttle (Tuji) woodturning & silk warps sizing", type: "Workshop Hub" },
    { name: "Anantnag Alpine Valleys", material: "Wild walnut log harvesting & Namda sheep wool felting", type: "Timber & Felting Source" }
  ];

  // Workshop Toolkits
  const workshopToolkits = [
    {
      craft: "Kani Weaving Workshop Toolkit",
      tools: ["Tuji bobbins", "Loom frame logs", "Reed combs", "Talim reading stand"],
      materials: ["Hand-spun silk warp", "Indigo wool wefts", "Talim pattern script"]
    },
    {
      craft: "Walnut Wood Carving Toolkit",
      tools: ["Carving Gouge (Wathlo)", "Wood Mallet", "Marking Compass", "Linseed oil scraper"],
      materials: ["Aged wild walnut planks", "Natural beeswax sealer", "Sharpening mineral oil"]
    }
  ];

  // Craft Process Stages
  const processStages = [
    { stage: "1. Material Sourcing", items: ["Raw Pashmina", "Wild Walnut Timber", "Nomad sheep wool"] },
    { stage: "2. Cleaning & Seasoning", items: ["Rice flour sifting", "Air drying planks (2-5 years)"] },
    { stage: "3. Tool Honing & Setup", items: ["Whetstone sharpening", "Tuji bobbin winding"] },
    { stage: "4. Production Execution", items: ["Talim reciting", "Deep relief chiseling", "Split stitch sozni needlework"] }
  ];

  // Proposal form state
  const [proposalForm, setProposalForm] = useState({
    title: '',
    recordType: '',
    localName: '',
    craft: '',
    category: '',
    source: '',
    preparation: '',
    maintenance: '',
    risk: '',
    summary: '',
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
        recordType: '',
        localName: '',
        craft: '',
        category: '',
        source: '',
        preparation: '',
        maintenance: '',
        risk: '',
        summary: '',
        contact: ''
      });
    }, 4000);
  };

  const filteredRecords = allRecords.filter(r => {
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchText = `${r.title} ${r.subtitle} ${r.recordNumber} ${r.localName} ${r.craft} ${r.category} ${r.origin} ${r.summary} ${r.whyItMatters}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    // Record Type
    if (selectedRecordType !== 'All' && r.recordType !== selectedRecordType) return false;

    // Craft
    if (selectedCraft !== 'All' && r.craft !== selectedCraft) return false;

    // Category
    if (selectedCategory !== 'All' && !r.category.toLowerCase().includes(selectedCategory.toLowerCase())) return false;

    // Availability
    if (selectedAvailability !== 'All' && r.availability !== selectedAvailability) return false;

    // Status
    if (selectedStatus !== 'All' && r.status !== selectedStatus) return false;

    return true;
  });

  // Sorting
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (selectedSort === 'Recently Documented') {
      return b.recordNumber.localeCompare(a.recordNumber);
    }
    if (selectedSort === 'Craft Tradition') {
      return a.craft.localeCompare(b.craft);
    }
    if (selectedSort === 'Tool Type' || selectedSort === 'Material Type') {
      return a.recordType.localeCompare(b.recordType);
    }
    if (selectedSort === 'Availability Risk') {
      return a.availability.localeCompare(b.availability);
    }
    if (selectedSort === 'A–Z') {
      return a.title.localeCompare(b.title);
    }
    return b.recordNumber.localeCompare(a.recordNumber); // Default Featured
  });

  const totalPages = Math.ceil(sortedRecords.length / itemsPerPage);
  const paginatedRecords = sortedRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const featuredRecord = allRecords[0]; // Pashmina Fibre

  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pb-24 animate-fadeIn">
      
      {/* Detailed Modal Registry Sheet */}
      {activeRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#3E2723]/40 backdrop-blur-sm" onClick={() => setActiveRecord(null)}></div>
          <div className="relative z-10 bg-[#FAF9F6] border-2 border-[#3E2723] max-w-4xl w-full p-6 md:p-8 shadow-2xl text-[#2A2A2A] max-h-[95vh] overflow-y-auto custom-scrollbar font-mono rounded-xs" role="dialog" aria-modal="true">
            <button onClick={() => setActiveRecord(null)} className="absolute top-4 right-4 text-[#3E2723]/50 hover:text-[#3E2723] text-xl font-bold font-mono">&times;</button>
            
            <div className="text-center mb-6 border-b border-[#3E2723]/25 pb-4">
              <span className="text-[#D4AF37] font-mono text-xs uppercase tracking-widest block mb-1 font-bold">KHCRF MATERIAL CULTURE REGISTRY</span>
              <h2 className="text-xl md:text-2xl font-serif text-[#3E2723] font-bold leading-tight">{activeRecord.title}</h2>
              {activeRecord.subtitle && <p className="text-gray-555 text-xs italic font-serif mt-1">{activeRecord.subtitle}</p>}
              
              <div className="flex flex-wrap justify-center gap-2 mt-3 font-mono text-[9px] uppercase tracking-wider text-gray-500">
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">CODE: {activeRecord.recordNumber}</span>
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">TYPE: {activeRecord.recordType}</span>
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">RISK: {activeRecord.availability}</span>
              </div>
            </div>

            {/* Modal Tabs navigation */}
            <div className="flex flex-wrap gap-1 border-b border-[#3E2723]/20 pb-3 mb-6 text-[10px] font-mono justify-center">
              {[
                { id: 'overview', label: 'Technical Overview' },
                { id: 'anatomy', label: 'Anatomy & Properties' },
                { id: 'sourcing', label: 'Sourcing & Sorters' },
                { id: 'maintenance', label: 'Maintenance & Life' },
                { id: 'safety', label: 'Substitutes & GI Verification' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveModalTab(tab.id as 'overview' | 'anatomy' | 'sourcing' | 'maintenance' | 'safety')}
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
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2">Registry Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div><span className="text-gray-400">LOCAL TERM       :</span> <strong className="text-[#3E2723]">{activeRecord.localName}</strong></div>
                      <div><span className="text-gray-400">RECORD NUMBER    :</span> {activeRecord.recordNumber}</div>
                      <div><span className="text-gray-400">PRIMARY CRAFT    :</span> {activeRecord.craft}</div>
                      <div><span className="text-gray-400">CATEGORY         :</span> {activeRecord.category}</div>
                    </div>
                    <div className="space-y-1">
                      <div><span className="text-gray-400">GEOGRAPHIC ORIGIN:</span> {activeRecord.origin}</div>
                      <div><span className="text-gray-400">PREPARATION STATE:</span> {activeRecord.preparationState}</div>
                      <div><span className="text-gray-400">AVAILABILITY RISK:</span> {activeRecord.availability}</div>
                      <div><span className="text-gray-400">VERSION RECORD   :</span> {activeRecord.version} ({activeRecord.status})</div>
                    </div>
                  </div>

                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2 mt-6">Why This Resource Matters</h3>
                  <p className="font-sans leading-relaxed text-gray-700 bg-white p-4 border border-[#3E2723]/10 shadow-xs">{activeRecord.whyItMatters}</p>

                  <div className="border-t border-gray-200 pt-3 mt-3 space-y-1.5">
                    <div><span className="text-gray-400">HISTORICAL BACKGROUND:</span> {activeRecord.historicalBackground}</div>
                  </div>
                </div>
              )}

              {/* TAB 2: ANATOMY & PROPERTIES */}
              {activeModalTab === 'anatomy' && (
                <div className="space-y-4 font-mono text-[10px]">
                  {activeRecord.recordType === 'Tool' && activeRecord.anatomy && (
                    <div>
                      <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Tool Anatomy</h3>
                      <div className="space-y-2">
                        {activeRecord.anatomy.map((an, idx) => (
                          <div key={idx} className="border border-gray-200 p-3 bg-white">
                            <span className="font-bold text-[#3E2723] block">{an.part}</span>
                            <span className="text-gray-500 block mt-0.5">{an.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeRecord.recordType === 'Material' && activeRecord.properties && (
                    <div>
                      <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Material Properties</h3>
                      <div className="space-y-2">
                        {activeRecord.properties.map((pr, idx) => (
                          <div key={idx} className="border border-gray-200 p-3 bg-white flex justify-between">
                            <strong>{pr.property}</strong>
                            <span className="text-gray-600">{pr.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SOURCING & SORTERS */}
              {activeModalTab === 'sourcing' && (
                <div className="space-y-6 font-mono text-[10px]">
                  {activeRecord.preparationPathway && (
                    <div>
                      <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Preparation Pathway</h3>
                      <ol className="list-decimal pl-4 space-y-2 text-gray-700">
                        {activeRecord.preparationPathway.map((path, idx) => (
                          <li key={idx}>{path}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {activeRecord.grades && (
                    <div>
                      <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Quality Grading System</h3>
                      <div className="space-y-2">
                        {activeRecord.grades.map((gr, idx) => (
                          <div key={idx} className="border border-gray-200 p-3 bg-white">
                            <span className="font-bold text-[#3E2723] block">{gr.gradeName}</span>
                            <span className="text-gray-500 block mt-0.5">{gr.criteria}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: MAINTENANCE & LIFE */}
              {activeModalTab === 'maintenance' && (
                <div className="space-y-4 font-mono text-[10px]">
                  {activeRecord.maintenance && (
                    <div>
                      <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Maintenance &amp; Sharpening</h3>
                      <ul className="list-disc pl-4 space-y-1 text-gray-700">
                        {activeRecord.maintenance.map((m, idx) => (
                          <li key={idx}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeRecord.conservationNotes && (
                    <div className="bg-[#FAF9F6] border border-gray-250 p-4">
                      <span className="font-bold text-[#3E2723] uppercase block mb-1">Conservation Notes</span>
                      <p className="font-sans leading-relaxed text-gray-750">{activeRecord.conservationNotes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: SUBSTITUTES & GI VERIFICATION */}
              {activeModalTab === 'safety' && (
                <div className="space-y-4 font-mono text-[10px] text-gray-700">
                  {activeRecord.alternatives && (
                    <div className="border border-gray-250 p-4 bg-white">
                      <span className="text-[#D4AF37] font-bold uppercase block mb-2 text-[9px]">Traditional vs Modern Alternatives</span>
                      <div className="space-y-1.5 text-[9px]">
                        <div><strong className="text-gray-400">TRADITIONAL :</strong> {activeRecord.alternatives.original}</div>
                        <div><strong className="text-red-600">ALTERNATIVE :</strong> {activeRecord.alternatives.substitute}</div>
                        <p className="text-gray-600 mt-2 font-sans leading-relaxed">{activeRecord.alternatives.comparison}</p>
                      </div>
                    </div>
                  )}

                  {activeRecord.authenticityConcerns && (
                    <div className="bg-red-50/50 border border-red-200 p-4">
                      <span className="font-bold text-red-700 block uppercase mb-1 text-[9px]">GI Verification Concerns</span>
                      <p className="font-sans leading-relaxed text-red-900">{activeRecord.authenticityConcerns}</p>
                    </div>
                  )}
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
                <button onClick={() => setActiveRecord(null)} className="border border-[#3E2723] hover:bg-[#3E2723]/5 text-[#3E2723] px-6 py-3 uppercase tracking-wider text-xs transition-colors font-light font-mono">
                  Return to Archive
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Hero section */}
      <UniversalEditorialHero pageKey="tools-materials" fallbackConfig={toolsMaterialsHeroFallback as unknown as Parameters<typeof UniversalEditorialHero>[0]['fallbackConfig']} />

      <div className="container-fluid mx-auto px-4 md:px-10 py-12 max-w-7xl animate-fadeIn">
        
        {/* Scholarly Statement */}
        <div className="bg-[#3E2723]/5 border-l-4 border-[#3E2723] p-8 mb-12 rounded-r-xs max-w-5xl font-sans">
          <p className="text-gray-700 text-base md:text-lg leading-relaxed font-serif">
            Unlike <strong>Traditional Techniques</strong> which explains how work is performed, <strong>Tools &amp; Materials</strong> explains <strong>what enables that work</strong>. This page answers: <em>&ldquo;What tools and materials make Kashmir&apos;s craft traditions possible, how are they selected and prepared, and what happens when they become scarce, altered, or replaced?&rdquo;</em>
          </p>
          <p className="text-gray-755 text-xs mt-3 uppercase tracking-widest font-bold font-mono">
            Every craft tradition depends upon a precise relationship between hand, tool, material, technique, and environment. A loom does more than hold threads. A carving chisel determines depth and control. Pashmina fibre requires careful sorting before spinning. Walnut wood behaves differently according to age, moisture, grain, and seasoning. Pigments, adhesives, metals, reeds, fibres, brushes, needles, and finishing materials all shape the quality and identity of the finished object.
          </p>
          <div className="bg-yellow-50/50 border border-yellow-200 p-4 my-6 font-mono text-[10px] text-yellow-800 leading-relaxed">
            <strong>Core Interpretive Principle:</strong> Tools and materials are not passive inputs. They carry technical knowledge, regional identity, environmental history, and workshop memory. A tool may reveal how an artisan was trained. A material may connect a craft to a forest, pasture, river, agricultural system, mining source, trade route, or specialist supplier.
          </div>
          <div className="flex flex-wrap gap-4 mt-6 font-mono text-xs">
            <a href="#results" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-5 py-2.5 font-bold uppercase tracking-wider transition-all">
              Explore Tools &amp; Materials
            </a>
            <a href="#nomination-section" className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-5 py-2.5 font-bold uppercase tracking-wider transition-all">
              Document a Tool or Material
            </a>
            <a href="#methodology" className="text-[#3E2723] hover:underline font-bold py-2.5">
              Documentation Standards &rarr;
            </a>
          </div>
        </div>

        {/* Featured Record Card */}
        <section className="bg-white border-4 border-[#3E2723] p-8 md:p-10 mb-16 relative shadow-md">
          <div className="absolute top-0 right-0 bg-[#3E2723] text-[#D4AF37] px-4 py-1 text-[10px] font-mono font-bold uppercase tracking-widest">
            FEATURED {featuredRecord.recordType.toUpperCase()} RECORD
          </div>
          
          <div className="max-w-4xl font-mono">
            <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-1">
              Archive Code: {featuredRecord.recordNumber}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3E2723] leading-tight mb-2">
              {featuredRecord.title}
            </h2>
            <h3 className="text-base md:text-lg font-serif italic text-gray-550 mb-4">
              {featuredRecord.subtitle}
            </h3>
            
            <p className="text-gray-700 text-sm leading-relaxed mb-6 font-sans text-gray-655">
              {featuredRecord.summary}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 font-mono text-[10px] border-t border-b border-gray-250 py-3 bg-gray-55 px-4">
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Type</span>
                <span className="font-bold text-[#3E2723]">{featuredRecord.recordType}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Craft</span>
                <span className="font-bold text-[#3E2723]">{featuredRecord.craft}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Category</span>
                <span className="font-bold text-[#3E2723]">{featuredRecord.category}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Availability</span>
                <span className="font-bold text-[#D4AF37] font-bold">{featuredRecord.availability}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => { setActiveRecord(featuredRecord); setActiveModalTab('overview'); }}
                className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-all font-mono"
              >
                Study Material &rarr;
              </button>
            </div>
          </div>
        </section>

        {/* Why Resources Matter Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start mt-12">
          <div className="lg:col-span-5 font-sans">
            <h2 className="text-3xl font-serif text-[#3E2723] mb-6 font-bold">Craftsmanship Begins Before Making</h2>
            <p className="text-gray-655 text-sm leading-relaxed mb-6">
              The quality of a craft object is often determined before the principal technique begins. Material selection, preparation, storage, tool condition, workshop environment, and the artisan’s understanding of physical properties all influence the final outcome.
            </p>
            <p className="text-gray-605 text-sm leading-relaxed">
              This archive documents traditional tool forms, local terminology, toolmaking lineages, raw-material origins, seasonal availability, conservation risks, supply-chain constraints, and modern synthetic alternatives.
            </p>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#3E2723]/10 p-8 rounded-xs shadow-xs">
            <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 font-mono">
              Material Technology Safeguards:
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700 font-sans font-mono">
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>traditional tool forms</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>local tool terminology</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>toolmaking traditions (The Crafts Behind Crafts)</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>raw-material origins &amp; seasonal logging</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>quality grading criteria</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>environmental pressure assessments</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>modern material substitute reviews</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>conservation &amp; humidity packaging</li>
            </ul>
          </div>
        </section>

        {/* Archive Overview Dashboard */}
        <section className="bg-[#3E2723] text-white p-8 md:p-10 mb-12 rounded-xs relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#3E2723] px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-widest">
            Registry Overview
          </div>
          <div className="mb-8 font-mono">
            <h3 className="font-serif text-2xl text-[#D4AF37] mb-2 font-bold font-serif">Tools &amp; Materials Overview</h3>
            <p className="text-white/60 text-xs">
              LIVE RESOURCE ARCHIVE &amp; SUPPLY-CHAIN DENSITY LEDGER
            </p>
          </div>

          {/* Primary Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 text-center md:text-left border-b border-white/10 pb-8 mb-8">
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Tools Documented</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">187</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono font-mono">Materials Documented</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">142</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Craft Traditions</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">12</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono font-mono font-mono">Toolmakers Recorded</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">41</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono font-mono">Material Sources Mapped</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">96</span>
            </div>
            <div className="last:border-0">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono font-mono font-mono font-mono">Technical Guides</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">173</span>
            </div>
          </div>

          {/* Secondary Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 text-center md:text-left font-mono">
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Traditional Tools</span>
              <span className="text-xl font-serif font-semibold text-white/80 font-mono">126</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Workshop Equipment</span>
              <span className="text-xl font-serif font-semibold text-white/80">61</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono font-mono font-mono">Natural Materials</span>
              <span className="text-xl font-serif font-semibold text-white/80 font-mono">103</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono font-mono">Prepared Materials</span>
              <span className="text-xl font-serif font-semibold text-white/80">39</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Endangered Materials</span>
              <span className="text-xl font-serif font-semibold text-white/80">18</span>
            </div>
            <div className="last:border-0">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono font-mono font-mono">Modern Substitutes</span>
              <span className="text-lg font-serif font-semibold text-[#D4AF37] block leading-tight font-mono">27</span>
            </div>
          </div>
        </section>

        {/* View Switcher Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 bg-[#FAF9F6] border border-[#3E2723]/10 p-4 font-mono" id="results">
          <div className="text-xs font-serif text-[#3E2723]">
            Tools &amp; Materials Registry &bull; Showing {sortedRecords.length} Documented Records
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] text-gray-400 uppercase self-center mr-2 font-mono">Archive Layout View:</span>
            <button 
              onClick={() => { setCurrentView('catalogue'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'catalogue' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Archive Catalogue
            </button>
            <button 
              onClick={() => { setCurrentView('toolkit'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'toolkit' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Workshop Toolkit
            </button>
            <button 
              onClick={() => { setCurrentView('map'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'map' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Material Source Map
            </button>
            <button 
              onClick={() => { setCurrentView('process'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'process' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Craft Process View
            </button>
          </div>
        </div>

        {/* Search and Discovery Layout */}
        <section className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Filters Sidebar */}
          {currentView !== 'toolkit' && currentView !== 'map' && currentView !== 'process' && (
            <div className="w-full lg:w-1/4 bg-white border border-[#3E2723]/10 p-6 shadow-xs sticky top-4 z-10 font-sans">
              <h3 className="font-serif text-lg text-[#3E2723] mb-6 pb-2 border-b border-gray-100 flex items-center justify-between font-bold">
                <span>Filter Archive</span>
                <button 
                  onClick={() => {
                    setSelectedRecordType('All');
                    setSelectedCraft('All');
                    setSelectedCategory('All');
                    setSelectedAvailability('All');
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
                    placeholder="Search by tool, material, craft, technique, local name..."
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
                    <option value="Tool">Tool</option>
                    <option value="Material">Material</option>
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
                    <option value="Carpet">Hand-Knotted Carpet</option>
                    <option value="Pashmina">Pashmina</option>
                    <option value="Kani">Kani Weaving</option>
                    <option value="Sozni">Sozni Embroidery</option>
                    <option value="Crewel">Crewel Embroidery</option>
                    <option value="Papier-Mâché">Papier-Mâché</option>
                    <option value="Walnut Wood">Walnut Wood</option>
                    <option value="Copperware">Copperware</option>
                    <option value="Namda">Namda</option>
                    <option value="Willow Wicker">Willow Wicker</option>
                  </select>
                </div>

                {/* Material Category */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Resource Category</label>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Categories</option>
                    <option value="Fibre">Animal &amp; Plant Fibre</option>
                    <option value="Tool">Weaving &amp; Carving Tool</option>
                    <option value="Wood">Walnut &amp; Willow Wood</option>
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
                    <option value="Supply Vulnerable">Supply Vulnerable</option>
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
                    <option value="Most Referenced">Most Referenced</option>
                    <option value="Craft Tradition">Craft Tradition</option>
                    <option value="Tool Type">Tool Type</option>
                    <option value="Material Type">Material Type</option>
                    <option value="Availability Risk">Availability Risk</option>
                    <option value="A–Z">A–Z</option>
                  </select>
                </div>

              </div>
            </div>
          )}

          {/* Results Area */}
          <div className={`w-full ${currentView === 'toolkit' || currentView === 'map' || currentView === 'process' ? 'lg:w-full' : 'lg:w-3/4'}`}>

            {loading ? (
              <div className="py-20 text-center text-gray-505 font-serif font-bold">Loading records...</div>
            ) : (
              <>
                {/* 1. ARCHIVE CATALOGUE VIEW */}
                {currentView === 'catalogue' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                    {paginatedRecords.map((r, i) => (
                      <div 
                        key={i} 
                        className="bg-white border-2 border-[#3E2723]/35 py-8 px-6 hover:bg-[#3E2723]/5 transition-all duration-300 group flex flex-col justify-between shadow-sm relative grid-ledger font-mono text-xs text-gray-700"
                      >
                        <div>
                          {/* Accession ID & Record Type header */}
                          <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5 font-semibold">
                            <span>{r.recordNumber}</span>
                            <span>{r.recordType.toUpperCase()} RECORD</span>
                          </div>

                          {/* Category & Craft */}
                          <div className="text-[9px] font-mono text-[#D4AF37] font-bold uppercase tracking-widest mb-4">
                            {r.category.toUpperCase()} &bull; {r.craft.toUpperCase()}
                          </div>

                          {/* Title */}
                          <h3 
                            onClick={() => { setActiveRecord(r); setActiveModalTab('overview'); }}
                            className="text-xl md:text-2xl font-serif font-bold text-[#3E2723] leading-snug cursor-pointer group-hover:text-[#D4AF37] transition-colors"
                          >
                            {r.title}
                          </h3>

                          {r.subtitle && (
                            <h4 className="text-xs font-serif italic text-gray-500 mt-1 leading-snug mb-3">
                              {r.subtitle}
                            </h4>
                          )}

                          <p className="text-gray-655 text-xs leading-relaxed mb-4 font-sans line-clamp-3 mt-3">
                            {r.summary}
                          </p>

                          {/* Sourcing region indicator */}
                          <div className="relative pl-4 mb-4 border-l-2 border-[#D4AF37]/50 font-mono text-[10px] leading-relaxed my-4">
                            <span className="text-[9px] text-gray-400 uppercase tracking-wider block mb-1">
                              LOCAL NAME &bull; SOURCE ORIGIN
                            </span>
                            <span className="font-bold text-[#3E2723]">
                              {r.localName} ({r.origin})
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="text-[#3E2723]/25 text-[9px] font-mono mb-3 select-none">
                            ─────╱╲──╱────╲╱─────
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto font-mono">
                            <span className="bg-[#3E2723]/5 border border-[#3E2723]/10 text-[#3E2723] text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider">
                              {r.availability.toUpperCase()}
                            </span>
                            
                            <button 
                              onClick={() => { setActiveRecord(r); setActiveModalTab('overview'); }}
                              className="text-xs font-bold uppercase tracking-widest text-[#3E2723] hover:text-[#D4AF37] transition-colors font-mono"
                            >
                              Study {r.recordType} &rarr;
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

                {/* 2. WORKSHOP TOOLKIT VIEW */}
                {currentView === 'toolkit' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn font-mono text-xs text-[#3E2723]">
                    {workshopToolkits.map((kit, idx) => (
                      <div key={idx} className="bg-white border-2 border-[#3E2723] p-6 shadow-md flex flex-col justify-between">
                        <div>
                          <span className="text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest block mb-1">ESSENTIAL WORKSHOP SETUP</span>
                          <h4 className="font-serif text-lg font-bold mb-4 border-b border-gray-150 pb-2 text-[#3E2723]">{kit.craft}</h4>
                          
                          <div className="space-y-4">
                            <div>
                              <strong className="text-gray-400 text-[8px] uppercase block mb-1">Essential Hand Tools</strong>
                              <div className="flex gap-1.5 flex-wrap">
                                {kit.tools.map((t, tIdx) => (
                                  <span key={tIdx} className="px-2 py-0.5 bg-[#3E2723]/5 border border-gray-250 rounded text-gray-700 font-bold">{t}</span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <strong className="text-gray-400 text-[8px] uppercase block mb-1">Essential Materials</strong>
                              <div className="flex gap-1.5 flex-wrap">
                                {kit.materials.map((m, mIdx) => (
                                  <span key={mIdx} className="px-2 py-0.5 bg-[#D4AF37]/10 border border-[#D4AF37]/35 rounded text-gray-700 font-bold">{m}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <button className="w-full bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] py-2.5 font-bold uppercase tracking-widest text-[10px] transition-colors mt-6 font-mono">
                          Request Toolkit Guide &rarr;
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. MATERIAL SOURCE MAP VIEW */}
                {currentView === 'map' && (
                  <div className="bg-white border-2 border-[#3E2723] p-6 shadow-md animate-fadeIn font-mono text-xs text-[#3E2723]">
                    <span className="text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest block mb-1">CRAFT MATERIAL INTELLIGENCE MAP</span>
                    <h3 className="font-serif text-lg font-bold mb-6 border-b border-gray-150 pb-2">Himalayan Sourcing &amp; Processing Pathways</h3>
                    
                    <div className="space-y-4">
                      {sourcingLocations.map((loc, idx) => (
                        <div key={idx} className="border border-gray-250 p-4 bg-[#FAF9F6] flex justify-between items-center text-xs">
                          <div>
                            <span className="text-[8px] text-gray-400 uppercase font-bold block">{loc.type}</span>
                            <strong className="text-[#3E2723] text-sm font-serif">{loc.name}</strong>
                          </div>
                          <div>
                            <span className="text-[8px] text-gray-400 uppercase font-bold block">RESOURCES MAPPED</span>
                            <span className="text-gray-750 font-bold">{loc.material}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. CRAFT PROCESS VIEW */}
                {currentView === 'process' && (
                  <div className="bg-white border-2 border-[#3E2723] p-6 shadow-md animate-fadeIn font-mono text-xs text-[#3E2723]">
                    <span className="text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest block mb-1">PRODUCTION STAGE SEQUENCING</span>
                    <h3 className="font-serif text-lg font-bold mb-6 border-b border-gray-150 pb-2">Essential Toolkit Pipeline Stages</h3>
                    
                    <div className="border-l-2 border-[#3E2723]/20 pl-6 space-y-6 relative max-w-2xl mx-auto">
                      {processStages.map((stage, idx) => (
                        <div key={idx} className="relative">
                          <div className="absolute -left-[30px] top-1 bg-[#3E2723] w-2.5 h-2.5 rounded-full border border-white"></div>
                          <span className="font-bold text-[#D4AF37] text-xs block mb-1">{stage.stage}</span>
                          <div className="flex gap-1.5 flex-wrap">
                            {stage.items.map((it, itIdx) => (
                              <span key={itIdx} className="px-2 py-0.5 bg-gray-100 border border-gray-350 text-gray-600 font-bold">{it}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            {currentView === 'catalogue' && totalPages > 1 && (
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
            How KHCRF Documents Tools and Materials
          </h2>
          <p className="text-gray-655 text-sm leading-relaxed mb-6">
            Tools and materials are documented through artisan interviews, workshop observation, technical measurement, photographic recording, source research, historical comparison, conservation studies, supplier consultation, and where appropriate, laboratory or material analysis.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 text-xs font-mono">
            <div>
              <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3 font-mono">Research Workflow</h3>
              <ol className="list-decimal pl-4 space-y-2 text-gray-600">
                <li>Record nomination and preliminary identification review</li>
                <li>Artisan consultation and local terminology collection</li>
                <li>Tool measurements &amp; process photography</li>
                <li>Material properties &amp; environmental assessment analysis</li>
                <li>Editorial review, technical validation, and final publication</li>
              </ol>
            </div>
            <div>
              <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3 font-mono">Documentation Principles</h3>
              <ul className="list-disc pl-4 space-y-2 text-gray-600">
                <li>preserve local terminology with absolute accuracy</li>
                <li>distinguish artisan sensory judgment from laboratory findings</li>
                <li>document alternatives neutrally without automatic condemnation</li>
                <li>respect private workshop sourcing confidentiality</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Research & Educational Use */}
        <section className="bg-white border border-[#3E2723]/25 p-8 md:p-10 mb-16 rounded-xs shadow-sm font-sans">
          <h2 className="text-2xl font-serif text-[#3E2723] mb-4 font-bold">Using the Tools &amp; Materials Archive</h2>
          <p className="text-gray-655 text-sm leading-relaxed mb-6">
            This archive supports artisan training, apprenticeship programs, conservation science, museum studies, design education, forestry and natural resource studies, and authenticity GI verification.
          </p>
          <div className="flex gap-4 font-mono">
            <Link href="mailto:research@khcrf.org" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3 font-bold uppercase tracking-wider text-xs transition-colors">
              Request Technical Access
            </Link>
            <a href="#nomination-section" className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-6 py-3 font-bold uppercase tracking-wider text-xs transition-colors">
              Use in Education
            </a>
          </div>
        </section>

        {/* Nominate Tool Form */}
        <section id="nomination-section" className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs">
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase block mb-1 font-mono">Help Document the Foundations of Craft</span>
            <h2 className="text-3xl font-serif text-[#3E2723] font-bold">Submit Tool or Material Record</h2>
            <p className="text-gray-500 text-xs font-mono mt-1">Artisans, toolmakers, workshop leads, and material suppliers are invited to contribute records.</p>
          </div>

          <div className="bg-[#FAF9F6] p-6 md:p-8 border border-gray-250">
            {proposalSubmitted ? (
              <div className="text-center py-8 font-mono">
                <h3 className="text-lg font-bold text-green-600 mb-2">Record Proposal Staged</h3>
                <p className="text-xs text-gray-500">Thank you. The KHCRF Materials Committee will verify your sourcing coordinates and tool blueprints.</p>
              </div>
            ) : (
              <form onSubmit={handleProposalSubmit} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Tool or Material Name *</label>
                    <input 
                      required 
                      type="text" 
                      value={proposalForm.title}
                      onChange={(e) => setProposalForm({...proposalForm, title: e.target.value})}
                      placeholder="e.g. Traditional Hand Spindle"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Local Term *</label>
                    <input 
                      required 
                      type="text" 
                      value={proposalForm.localName}
                      onChange={(e) => setProposalForm({...proposalForm, localName: e.target.value})}
                      placeholder="e.g. Yinder"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Record Type *</label>
                    <select
                      required
                      value={proposalForm.recordType}
                      onChange={(e) => setProposalForm({...proposalForm, recordType: e.target.value})}
                      className="w-full border border-gray-200 px-2 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                    >
                      <option value="">Select Type</option>
                      <option value="Tool">Tool</option>
                      <option value="Material">Material</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Primary Craft Tradition *</label>
                    <input 
                      required
                      type="text" 
                      value={proposalForm.craft}
                      onChange={(e) => setProposalForm({...proposalForm, craft: e.target.value})}
                      placeholder="e.g. Pashmina"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Resource Category *</label>
                    <input 
                      required
                      type="text" 
                      value={proposalForm.category}
                      onChange={(e) => setProposalForm({...proposalForm, category: e.target.value})}
                      placeholder="e.g. Animal Fibre, Carving Tool"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Sourcing / Origin *</label>
                    <input 
                      required
                      type="text" 
                      value={proposalForm.source}
                      onChange={(e) => setProposalForm({...proposalForm, source: e.target.value})}
                      placeholder="e.g. Ladakh Changthang Plains"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-500 mb-1">Summary &amp; Technical Description *</label>
                  <textarea 
                    required 
                    rows={4} 
                    value={proposalForm.summary}
                    onChange={(e) => setProposalForm({...proposalForm, summary: e.target.value})}
                    placeholder="Outline dimensions, material composition, properties, and why the tool or material is vital to KHCRF..."
                    className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723] resize-none" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Preparation &amp; Sourcing pathways</label>
                    <textarea 
                      rows={2} 
                      value={proposalForm.preparation}
                      onChange={(e) => setProposalForm({...proposalForm, preparation: e.target.value})}
                      placeholder="Describe steps (e.g. clay sifting, air seasoning planks)..."
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723] resize-none" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Maintenance &amp; Risk Considerations *</label>
                    <textarea 
                      required
                      rows={2} 
                      value={proposalForm.maintenance}
                      onChange={(e) => setProposalForm({...proposalForm, maintenance: e.target.value})}
                      placeholder="Sharpening oil intervals, humidity requirements, or scarcity status..."
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723] resize-none" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-[#3E2723] hover:bg-[#D4AF37] text-white hover:text-[#3E2723] font-bold uppercase tracking-widest transition-colors font-mono"
                >
                  Submit Tool or Material Record
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
            &ldquo;The KHCRF Tools &amp; Materials Archive preserves the physical foundations of Kashmir’s craft heritage. By documenting tools, raw materials, preparation systems, maintenance practices, sources, substitutes, and environmental conditions, the archive explains how craftsmanship depends upon an intricate relationship between knowledge, resource, hand, and place.&rdquo;
          </p>
          <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto"></div>
        </div>
      </footer>

    </main>
  );
}
