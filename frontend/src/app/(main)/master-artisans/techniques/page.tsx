'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { traditionalTechniquesHeroFallback } from '@/config/heroFallbacks';

interface Step {
  stepNumber: number;
  title: string;
  objectives: string;
  toolsRequired: string[];
  expectedOutcome: string;
  commonMistakes: string;
  qualityCheck: string;
}

interface RequiredTool {
  name: string;
  description: string;
  source: string;
}

interface RequiredMaterial {
  name: string;
  source: string;
  preparation: string;
  storage: string;
  sustainability: string;
  qualityCriteria: string;
}

interface CommonMistake {
  mistake: string;
  consequence: string;
  correction: string;
}

interface Technique {
  slug: string;
  techniqueNumber: string;
  title: string;
  subtitle: string;
  craft: 'Carpet' | 'Pashmina' | 'Kani' | 'Sozni' | 'Crewel' | 'Papier-Mâché' | 'Walnut Wood' | 'Copperware' | 'Namda' | 'Willow Wicker' | 'Chain Stitch' | 'Multi-Craft';
  category: 'Fibre Preparation' | 'Spinning' | 'Dyeing' | 'Warping' | 'Weaving' | 'Knotting' | 'Embroidery' | 'Carving' | 'Turning' | 'Engraving' | 'Painting' | 'Polishing' | 'Finishing' | 'Restoration' | 'Quality Inspection';
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master Level' | 'Specialist';
  learningTime: string;
  prerequisites: string;
  masterContributors: string[];
  workshop: string;
  region: string;
  status: 'Published' | 'Under Review' | 'Field Documentation' | 'Technical Validation' | 'Archive Preview';
  version: string;
  formats: string[];
  summary: string;
  whyItMatters: string;
  historicalBackground: string;
  purpose: string;
  whenUsed: string;
  steps: Step[];
  tools: RequiredTool[];
  materials: RequiredMaterial[];
  safetyConsiderations: string[];
  qualityIndicators: string[];
  commonErrors: CommonMistake[];
  regionalVariations: string;
  technicalTerminology: { term: string; definition: string }[];
  referencedObjects: string[];
  oralHistories: string[];
}

export default function Techniques() {
  const [allTechs] = useState<Technique[]>([
    {
      slug: "reading-the-talim",
      techniqueNumber: "KHCRF-TEC-2026-001",
      title: "Reading the Talim",
      subtitle: "Understanding the Traditional Design Language of Kashmir Carpet Weaving",
      craft: "Carpet",
      category: "Weaving",
      skillLevel: "Advanced",
      learningTime: "120 Hours",
      prerequisites: "Basic loom operation & knotting patterns",
      masterContributors: ["Ustad Habibullah Dar", "M. Y. Kani"],
      workshop: "Zaina Kadal Loom Guild",
      region: "Srinagar",
      status: "Published",
      version: "v2.1",
      formats: ["Illustrated Guide", "Video Demonstration", "Interactive Diagram"],
      summary: "The Talim system is a unique coded language that translates carpet designs into instructions for weavers. This technique combines colour sequencing, knot counts, pattern interpretation, and collaborative workshop communication. Rather than functioning as a simple pattern, Talim represents a complete technical language preserved through specialist training.",
      whyItMatters: "By recording knot sequences mathematically, the Talim language pre-dated digital punch cards by centuries, enabling complex floral motifs to be executed symmetrically across multi-weaver looms without visual paper guides.",
      historicalBackground: "Emerged in the 15th century under Sultan Zain-ul-Abidin as Persian weavers integrated with Kashmiri wool-dyeing craftsmen.",
      purpose: "Translates complex curved designs into knot count steps for loom recitation.",
      whenUsed: "Throughout the weaving stage of hand-knotted double-warp carpets.",
      steps: [
        {
          stepNumber: 1,
          title: "Decipher the color notation prefixes",
          objectives: "Verify the dye batch code mapping against current inventory.",
          toolsRequired: ["Talim script book", "Thread sample ring"],
          expectedOutcome: "Accurate linking of handwritten shorthand letters to actual warp yarn hanks.",
          commonMistakes: "Reading 'Surkh' (red) as 'Sabz' (green) under fading workshop lighting.",
          qualityCheck: "Double-check notation labels with the master dyer."
        },
        {
          stepNumber: 2,
          title: "Chant and execute knot loops",
          objectives: "Recite the knot count coordinates clearly to the second loom weaver.",
          toolsRequired: ["Traditional Loom frame", "Carpet knife (Khurma)"],
          expectedOutcome: "Consistent knot loops tied tightly around the warp strings.",
          commonMistakes: "Losing rhythm causing a difference of two knots on the horizontal border.",
          qualityCheck: "Measure horizontal width every ten rows."
        }
      ],
      tools: [
        { name: "Khurma carpet knife", description: "Curved metal knife with wooden handle for slicing yarn loops.", source: "Traditional Srinagar blacksmiths" },
        { name: "Panja comb", description: "Heavy iron comb used to beat down the weft threads.", source: "Local woodturners & smiths" }
      ],
      materials: [
        {
          name: "Natural Indigo Wool Yarn",
          source: "Ladakh pastoral supplies",
          preparation: "Indigo fermented with local lime",
          storage: "Dry ventilated storage chests",
          sustainability: "100% biodegradable organic wool",
          qualityCriteria: "Minimum fiber length of 85mm"
        }
      ],
      safetyConsiderations: [
        "Ensure mask is worn when beating down dry wool fibers to prevent lung inhalation",
        "Keep fingers clear of warp strings when striking with the heavy iron comb"
      ],
      qualityIndicators: [
        "Uniform fiber alignment",
        "Consistent knot tension",
        "Even border width across all columns"
      ],
      commonErrors: [
        {
          mistake: "Incorrect Talim reading",
          consequence: "Design asymmetry in the floral center medallion.",
          correction: "Reverse the row knots and repeat matching the mirror coordinates."
        }
      ],
      regionalVariations: "Budgam workshops read Talim at a slower recitative pitch compared to the fast rhythmic chants of Downtown Srinagar guilds.",
      technicalTerminology: [
        { term: "Talim", definition: "Coded carpet pattern script." },
        { term: "Panja", definition: "Heavy iron beating comb." }
      ],
      referencedObjects: ["KHCRF-OBJ-2026-0012", "KHCRF-OBJ-2026-0044"],
      oralHistories: ["Memories of the reciter Habibullah Dar"]
    },
    {
      slug: "preparing-raw-pashmina",
      techniqueNumber: "KHCRF-TEC-2026-041",
      title: "Preparing Raw Pashmina Fibre",
      subtitle: "Traditional cleaning and sorting of raw pashmina before spinning",
      craft: "Pashmina",
      category: "Fibre Preparation",
      skillLevel: "Intermediate",
      learningTime: "40 Hours",
      prerequisites: "Raw fiber grading and identification",
      masterContributors: ["Sana Bhat", "Haleema Begum"],
      workshop: "Budgam Pashmina Collective",
      region: "Budgam",
      status: "Published",
      version: "v1.2",
      formats: ["Illustrated Guide", "Video Demonstration"],
      summary: "Traditional cleaning and sorting of raw pashmina before spinning. This technique covers manual dehairing (separating fine underwool from coarse guard hairs), dust removal using local rice paste, and comb alignment.",
      whyItMatters: "Raw pashm fibers are microscopic (typically 12-15 microns). Improper mechanical cleaning breaks these fibers, reducing the yarn's durability and softness.",
      historicalBackground: "Practiced for centuries inside agricultural households in Budgam district before spinning began.",
      purpose: "Ensures the combed wool yields yarn with high tensile strength.",
      whenUsed: "Initial stage prior to hand spinning.",
      steps: [
        {
          stepNumber: 1,
          title: "Grind and sift organic clay powder",
          objectives: "Apply clay dust to raw fiber to absorb natural goat grease.",
          toolsRequired: ["Clay mortar", "Wooden sifter"],
          expectedOutcome: "Raw wool feels dry and easy to separate.",
          commonMistakes: "Applying wet clay causing fiber clump blockages.",
          qualityCheck: "Fibers should slide apart with minimal static cling."
        }
      ],
      tools: [
        { name: "Wooden Carding Combs", description: "Flat wooden paddles with wire teeth for aligning fibers.", source: "Local craft cooperatives" }
      ],
      materials: [
        {
          name: "Raw Changthang Pashm",
          source: "Changthang plateau pastoralists",
          preparation: "Graded manually by fiber diameter",
          storage: "Pest-proof linen bags",
          sustainability: "Sourced through fair trade nomad contracts",
          qualityCriteria: "Fiber diameter under 15 microns"
        }
      ],
      safetyConsiderations: ["Perform carding in ventilated spaces to avoid organic dust buildup."],
      qualityIndicators: ["Microscopic fiber alignment without clump residues."],
      commonErrors: [
        {
          mistake: "Weak fiber twist",
          consequence: "Yarn snapping on the Kani handloom.",
          correction: "Recard the fibers and adjust spinning wheel speed."
        }
      ],
      regionalVariations: "Srinagar weavers use rice paste sifting, whereas Budgam artisans rely on dry local white clay sorting.",
      technicalTerminology: [
        { term: "Pashm", definition: "Underwool of the Capra Hircus goat." }
      ],
      referencedObjects: ["KHCRF-OBJ-2026-0005"],
      oralHistories: ["Courtyard sorting traditions of Ganderbal"]
    },
    {
      slug: "traditional-hand-spinning",
      techniqueNumber: "KHCRF-TEC-2026-003",
      title: "Traditional Hand Spinning",
      subtitle: "Spinning fine pashm yarn on the traditional Yinder wheel",
      craft: "Pashmina",
      category: "Spinning",
      skillLevel: "Advanced",
      learningTime: "80 Hours",
      prerequisites: "Preparing Raw Pashmina Fibre",
      masterContributors: ["Fatima Jan", "Haleema Begum"],
      workshop: "Beerwah Sozni Collective",
      region: "Budgam",
      status: "Published",
      version: "v2.0",
      formats: ["Illustrated Guide", "Video Demonstration"],
      summary: "Spinning fine pashm yarn on the traditional Yinder wheel. This process requires precise manual coordination of wheel speed and fiber draw-out distance to produce yarn of uniform count.",
      whyItMatters: "Hand-spun pashmina yarn retains a natural wave that mechanical spindles flatten, producing shawls with unmatched softness and warmth.",
      historicalBackground: "Predominantly practiced by women in domestic settings, forming a vital home industry network.",
      purpose: "Convert aligned pashm fibers into stable, thin threads.",
      whenUsed: "After fiber preparation and before dyeing.",
      steps: [
        {
          stepNumber: 1,
          title: "Align the Yinder spindle",
          objectives: "Adjust spindle tension using local cotton strings.",
          toolsRequired: ["Yinder spindle", "Tuning wedge"],
          expectedOutcome: "Smooth rotation without spindle wobble.",
          commonMistakes: "Tightening spindle too far, breaking threads.",
          qualityCheck: "Spindle spin time should exceed five seconds."
        }
      ],
      tools: [
        { name: "Yinder spinning wheel", description: "Traditional wooden wheel mounted on a low base.", source: "Srinagar carpenters" }
      ],
      materials: [
        {
          name: "Combed Pashm Silver",
          source: "Local carders",
          preparation: "Carded and hand rolled into clean wool rolls",
          storage: "Sealed boxes to prevent humidity",
          sustainability: "Low energy manual process",
          qualityCriteria: "Free of coarse guard hairs"
        }
      ],
      safetyConsiderations: ["Maintain clean posture to avoid lower back fatigue during long sessions."],
      qualityIndicators: ["Even thread twist count, zero thick slubs."],
      commonErrors: [
        {
          mistake: "Weak fiber twist",
          consequence: "Yarn breakages when wound into skeins.",
          correction: "Rotate the Yinder wheel slower while maintaining tension."
        }
      ],
      regionalVariations: "Srinagar spinners use a smaller wooden wheel, while Budgam spinners use a larger Yinder wheel for higher output.",
      technicalTerminology: [
        { term: "Yinder", definition: "Traditional Kashmiri spinning wheel." }
      ],
      referencedObjects: ["KHCRF-OBJ-2026-0361"],
      oralHistories: ["Yinder spinning songs of Beerwah"]
    },
    {
      slug: "kani-loom-setup",
      techniqueNumber: "KHCRF-TEC-2026-004",
      title: "Kani Loom Setup",
      subtitle: "Preparing the double-warp loom for traditional Kani weaving",
      craft: "Kani",
      category: "Warping",
      skillLevel: "Master Level",
      learningTime: "150 Hours",
      prerequisites: "Warp Preparation",
      masterContributors: ["Ali Mohammad Wani"],
      workshop: "Kanihama Loom House",
      region: "Budgam",
      status: "Technical Validation",
      version: "v3.0",
      formats: ["Illustrated Guide", "Technical Drawing"],
      summary: "Preparing the double-warp loom for traditional Kani weaving. This is a complex technique of setting up the warp threads, aligning the heddle rods, and installing the Kani bobbins (Tujis).",
      whyItMatters: "Kani weaving requires thousands of individual warp threads to be under uniform tension to prevent fabric distortion during pattern integration.",
      historicalBackground: "Centred in Kanihama, the historical heart of Kani weaving in the Kashmir Valley.",
      purpose: "Establish the structural base for weaving Kani shawls.",
      whenUsed: "Prior to weaving any Kani patterned fabric.",
      steps: [
        {
          stepNumber: 1,
          title: "Install warp beam logs",
          objectives: "Align the heavy wooden logs horizontally.",
          toolsRequired: ["Warp beam keys", "Leveling ruler"],
          expectedOutcome: "Perfect horizontal alignment of the warp log.",
          commonMistakes: "Uneven leveling causing loose warp threads.",
          qualityCheck: "Check alignment using water level tool."
        }
      ],
      tools: [
        { name: "Tuji bobbins", description: "Small eyeless wooden bobbins for holding design threads.", source: "Kanihama woodturners" }
      ],
      materials: [
        {
          name: "Hand-spun silk warp",
          source: "State cocoon farms",
          preparation: "Boiled and sized with rice starch",
          storage: "Wound on paper spools",
          sustainability: "Organically produced silk",
          qualityCriteria: "High tensile strength yarn"
        }
      ],
      safetyConsiderations: ["Wear protective gloves when handling heavy warp logs."],
      qualityIndicators: ["Warp threads are under uniform tension across the entire width."],
      commonErrors: [
        {
          mistake: "Uneven warp tension",
          consequence: "Wavy borders on the finished shawl.",
          correction: "Adjust warp beam tension keys."
        }
      ],
      regionalVariations: "Kanihama loom setups use a double-beam structure, while Srinagar urban looms utilize a single-beam setup.",
      technicalTerminology: [
        { term: "Tuji", definition: "Small wooden bobbin used in Kani weaving." }
      ],
      referencedObjects: ["KHCRF-OBJ-2026-0184"],
      oralHistories: ["Loom builders of Kanihama"]
    },
    {
      slug: "sozni-satin-stitch",
      techniqueNumber: "KHCRF-TEC-2026-005",
      title: "Sozni Satin Stitch",
      subtitle: "Executing the classical split and satin stitch in Sozni needlework",
      craft: "Sozni",
      category: "Embroidery",
      skillLevel: "Intermediate",
      learningTime: "60 Hours",
      prerequisites: "Basic embroidery stitch work",
      masterContributors: ["Fatima Jan", "Peerzada Asif"],
      workshop: "Beerwah Sozni Collective",
      region: "Budgam",
      status: "Published",
      version: "v1.5",
      formats: ["Illustrated Guide", "Video Demonstration"],
      summary: "Executing the classical split and satin stitch in Sozni needlework. This involves microscopic embroidery using fine silk threads on a pashmina wool base, ensuring the stitches are perfectly parallel.",
      whyItMatters: "Sozni embroidery is known for its incredible density. A single shawl can require millions of satin stitches to cover the surface.",
      historicalBackground: "Developed under Sufi master influences in the valley during the medieval period.",
      purpose: "Create highly detailed floral patterns on shawls.",
      whenUsed: "Main embroidery stage of Sozni shawl production.",
      steps: [
        {
          stepNumber: 1,
          title: "Transfer design layout",
          objectives: "Apply traditional woodblock print outline to pashmina cloth.",
          toolsRequired: ["Woodblocks", "Washable ink paste"],
          expectedOutcome: "Clear visible lines for the embroiderer.",
          commonMistakes: "Ink smudging during block placement.",
          qualityCheck: "Review block print clarity."
        }
      ],
      tools: [
        { name: "Fine embroidery needles", description: "Steel needles with micro eyes.", source: "Srinagar merchants" }
      ],
      materials: [
        {
          name: "Natural dyed silk thread",
          source: "State silk cooperatives",
          preparation: "Dyed with natural plant extracts",
          storage: "Protected from direct sunlight",
          sustainability: "Natural dyes and silk",
          qualityCriteria: "Uniform thickness and dye penetration"
        }
      ],
      safetyConsiderations: ["Ensure adequate lighting to reduce eye strain."],
      qualityIndicators: ["Parallel stitches, zero puckering of the wool fabric."],
      commonErrors: [
        {
          mistake: "Uneven stitch density",
          consequence: "Puckering of the wool fabric.",
          correction: "Steam block the fabric and adjust tension."
        }
      ],
      regionalVariations: "Srinagar Sozni is famous for its dense Jaldaar style, while Budgam specializes in delicate Hashia borders.",
      technicalTerminology: [
        { term: "Sozni", definition: "Fine needle embroidery technique." }
      ],
      referencedObjects: ["KHCRF-OBJ-2026-0331"],
      oralHistories: ["Elders of the Sozni Collective"]
    },
    {
      slug: "woodcarver-tool-sharpening",
      techniqueNumber: "KHCRF-TEC-2026-006",
      title: "Tool Sharpening",
      subtitle: "Preparing chisels and knives for walnut woodcarving",
      craft: "Walnut Wood",
      category: "Turning",
      skillLevel: "Beginner",
      learningTime: "15 Hours",
      prerequisites: "None",
      masterContributors: ["Imran Qazi", "Ghulam Qadir Lone"],
      workshop: "Srinagar Wood Guild",
      region: "Srinagar",
      status: "Published",
      version: "v1.0",
      formats: ["Illustrated Guide", "Video Demonstration"],
      summary: "Preparing chisels and knives for walnut woodcarving. This technique covers wetstone sharpening, leather strapping, and angle adjustment.",
      whyItMatters: "Dull chisels tear wild walnut timber grain rather than slicing it, causing rough surface finishes that cannot be sanded out.",
      historicalBackground: "Passed down through generations of Srinagar woodcarving workshops.",
      purpose: "Ensure clean woodcarving relief incisions.",
      whenUsed: "Daily before starting woodcarving work.",
      steps: [
        {
          stepNumber: 1,
          title: "Wet the stone",
          objectives: "Apply lubricant oil to the stone surface.",
          toolsRequired: ["Whetstone", "Sharpening oil"],
          expectedOutcome: "Stone surface is oily and smooth.",
          commonMistakes: "Using dry stone causing chisel edge chipping.",
          qualityCheck: "Oil should coat the stone surface evenly."
        }
      ],
      tools: [
        { name: "Leather strap", description: "Thick leather belt for final polishing.", source: "Local tanners" }
      ],
      materials: [
        {
          name: "Natural sharpening oil",
          source: "State oil cooperatives",
          preparation: "Refined mineral oil",
          storage: "Cool dry bottle",
          sustainability: "Minimal waste",
          qualityCriteria: "Consistent viscosity"
        }
      ],
      safetyConsiderations: ["Always point chisel edges away from fingers when strapping."],
      qualityIndicators: ["Mirror finish edge, passes paper cut test."],
      commonErrors: [
        {
          mistake: "Incorrect angle",
          consequence: "Chisel edge chipping under mallet force.",
          correction: "Reset the bevel angle on the whetstone."
        }
      ],
      regionalVariations: "Srinagar carvers use a 25-degree bevel angle, whereas Budgam carvers prefer a 30-degree angle for hard walnut wood.",
      technicalTerminology: [
        { term: "Whetstone", definition: "A stone used for sharpening edge tools." }
      ],
      referencedObjects: ["KHCRF-OBJ-2026-0033"],
      oralHistories: ["Apprentices learning the stone"]
    }
  ]);

  const [loading] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCraft, setSelectedCraft] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Featured');

  const [activeTech, setActiveTech] = useState<Technique | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'overview' | 'steps' | 'tools' | 'quality' | 'variations'>('overview');
  const [currentView, setCurrentView] = useState<'library' | 'path' | 'workflow' | 'atlas'>('library');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Learning Paths progression
  const learningPaths = [
    {
      level: "Beginner Level",
      title: "Material Preparation",
      steps: ["Preparing Raw Pashmina Fibre", "Tool Sharpening", "Pulp Preparation", "Sheet Forming"]
    },
    {
      level: "Intermediate Level",
      title: "Basic Technique",
      steps: ["Traditional Hand Spinning", "Sozni Satin Stitch", "Surface Levelling", "Engraving"]
    },
    {
      level: "Advanced Level",
      title: "Master-Level Precision",
      steps: ["Reading the Talim", "Kani Loom Setup", "Deep Undercutting", "Naqashi Brush Control"]
    }
  ];

  // Workshop Workflow progression
  const workflowStages = [
    { stage: "Stage 1: Fibre sorting & cleaning", technique: "Preparing Raw Pashmina Fibre", status: "Documented" },
    { stage: "Stage 2: Hand spinning", technique: "Traditional Hand Spinning", status: "Documented" },
    { stage: "Stage 3: Warp preparation", technique: "Warp Preparation", status: "Published" },
    { stage: "Stage 4: Loom setup", technique: "Kani Loom Setup", status: "Validation" },
    { stage: "Stage 5: Weaving & pattern integration", technique: "Reading the Talim", status: "Published" }
  ];

  // Proposal Form State
  const [proposalForm, setProposalForm] = useState({
    title: '',
    craft: '',
    category: '',
    skillLevel: '',
    workshop: '',
    region: '',
    summary: '',
    tools: '',
    materials: '',
    references: '',
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
        craft: '',
        category: '',
        skillLevel: '',
        workshop: '',
        region: '',
        summary: '',
        tools: '',
        materials: '',
        references: '',
        contact: ''
      });
    }, 4000);
  };

  const filteredTechs = allTechs.filter(t => {
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchText = `${t.title} ${t.subtitle} ${t.techniqueNumber} ${t.craft} ${t.category} ${t.summary} ${t.whyItMatters} ${t.region}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    // Craft
    if (selectedCraft !== 'All' && t.craft !== selectedCraft) return false;

    // Category
    if (selectedCategory !== 'All' && t.category !== selectedCategory) return false;

    // Skill Level
    if (selectedSkillLevel !== 'All' && t.skillLevel !== selectedSkillLevel) return false;

    // Status
    if (selectedStatus !== 'All' && t.status !== selectedStatus) return false;

    // Format
    if (selectedFormat !== 'All' && !t.formats.includes(selectedFormat)) return false;

    return true;
  });

  // Sorting
  const sortedTechs = [...filteredTechs].sort((a, b) => {
    if (selectedSort === 'Recently Published') {
      return b.techniqueNumber.localeCompare(a.techniqueNumber);
    }
    if (selectedSort === 'Craft') {
      return a.craft.localeCompare(b.craft);
    }
    if (selectedSort === 'Skill Level') {
      const levels = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Master Level': 4, 'Specialist': 5 };
      return levels[b.skillLevel] - levels[a.skillLevel];
    }
    if (selectedSort === 'Alphabetical') {
      return a.title.localeCompare(b.title);
    }
    return b.techniqueNumber.localeCompare(a.techniqueNumber); // Default Featured
  });

  const totalPages = Math.ceil(sortedTechs.length / itemsPerPage);
  const paginatedTechs = sortedTechs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const featuredTech = allTechs[0]; // Reading the Talim

  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pb-24 animate-fadeIn">
      
      {/* Detailed Modal Registry Sheet */}
      {activeTech && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#3E2723]/40 backdrop-blur-sm" onClick={() => setActiveTech(null)}></div>
          <div className="relative z-10 bg-[#FAF9F6] border-2 border-[#3E2723] max-w-4xl w-full p-6 md:p-8 shadow-2xl text-[#2A2A2A] max-h-[95vh] overflow-y-auto custom-scrollbar font-mono rounded-xs" role="dialog" aria-modal="true">
            <button onClick={() => setActiveTech(null)} className="absolute top-4 right-4 text-[#3E2723]/50 hover:text-[#3E2723] text-xl font-bold font-mono">&times;</button>
            
            <div className="text-center mb-6 border-b border-[#3E2723]/25 pb-4">
              <span className="text-[#D4AF37] font-mono text-xs uppercase tracking-widest block mb-1 font-bold">KHCRF TECHNICAL ARCHIVE</span>
              <h2 className="text-xl md:text-2xl font-serif text-[#3E2723] font-bold leading-tight">{activeTech.title}</h2>
              {activeTech.subtitle && <p className="text-gray-555 text-xs italic font-serif mt-1">{activeTech.subtitle}</p>}
              
              <div className="flex flex-wrap justify-center gap-2 mt-3 font-mono text-[9px] uppercase tracking-wider text-gray-500">
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">ACCESSION: {activeTech.techniqueNumber}</span>
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">CRAFT: {activeTech.craft}</span>
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">LEVEL: {activeTech.skillLevel}</span>
              </div>
            </div>

            {/* Modal Tabs navigation */}
            <div className="flex flex-wrap gap-1 border-b border-[#3E2723]/20 pb-3 mb-6 text-[10px] font-mono justify-center">
              {[
                { id: 'overview', label: 'Technical Overview' },
                { id: 'steps', label: 'Workflow Steps' },
                { id: 'tools', label: 'Tools & Materials' },
                { id: 'quality', label: 'Quality & Errors' },
                { id: 'variations', label: 'Regional Variations' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveModalTab(tab.id as 'overview' | 'steps' | 'tools' | 'quality' | 'variations')}
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
                      <div><span className="text-gray-400">TECHNIQUE NUMBER :</span> {activeTech.techniqueNumber}</div>
                      <div><span className="text-gray-400">CATEGORY         :</span> {activeTech.category}</div>
                      <div><span className="text-gray-400">EST LEARNING TIME:</span> {activeTech.learningTime}</div>
                      <div><span className="text-gray-400">PREREQUISITES    :</span> {activeTech.prerequisites}</div>
                    </div>
                    <div className="space-y-1">
                      <div><span className="text-gray-400">REGIONAL VARIANT :</span> {activeTech.region}</div>
                      <div><span className="text-gray-400">WORKSHOP GUILD   :</span> {activeTech.workshop}</div>
                      <div><span className="text-gray-400">CONTRIBUTORS     :</span> {activeTech.masterContributors.join(', ')}</div>
                      <div><span className="text-gray-400">VERSION RECORD   :</span> {activeTech.version} ({activeTech.status})</div>
                    </div>
                  </div>

                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2 mt-6">Why This Technique Matters</h3>
                  <p className="font-sans leading-relaxed text-gray-700 bg-white p-4 border border-[#3E2723]/10 shadow-xs">{activeTech.whyItMatters}</p>

                  <div className="border-t border-gray-200 pt-3 mt-3 space-y-1.5">
                    <div><span className="text-gray-400">HISTORICAL BACKGROUND:</span> {activeTech.historicalBackground}</div>
                    <div><span className="text-gray-400">DOCUMENTATION FORMATS:</span> {activeTech.formats.join(', ')}</div>
                  </div>
                </div>
              )}

              {/* TAB 2: WORKFLOW STEPS */}
              {activeModalTab === 'steps' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Step-by-Step Procedure</h3>
                  <div className="space-y-4">
                    {activeTech.steps.map(step => (
                      <div key={step.stepNumber} className="border border-gray-200 p-4 bg-white space-y-2">
                        <div className="text-[#3E2723] font-bold text-[10px] uppercase border-b border-gray-100 pb-1">
                          STEP {step.stepNumber}: {step.title}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[9px] text-gray-650">
                          <div>
                            <div><strong className="text-[#D4AF37]">OBJECTIVES:</strong> {step.objectives}</div>
                            <div className="mt-1"><strong className="text-gray-400">REQUIRED TOOLS:</strong> {step.toolsRequired.join(', ')}</div>
                          </div>
                          <div>
                            <div><strong className="text-green-700">EXPECTED OUTCOME:</strong> {step.expectedOutcome}</div>
                            <div className="mt-1"><strong className="text-red-700">COMMON MISTAKES:</strong> {step.commonMistakes}</div>
                            <div className="mt-1"><strong className="text-[#3E2723]">QUALITY CHECK:</strong> {step.qualityCheck}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: TOOLS & MATERIALS */}
              {activeModalTab === 'tools' && (
                <div className="space-y-6 font-mono text-[10px]">
                  <div>
                    <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Required Tools</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeTech.tools.map((t, idx) => (
                        <div key={idx} className="border border-gray-200 p-3 bg-white">
                          <span className="font-bold text-[#3E2723] block text-[9px]">{t.name}</span>
                          <span className="text-gray-500 block mt-0.5">{t.description}</span>
                          <span className="text-[8px] text-[#D4AF37] block mt-1 uppercase font-bold">SOURCE: {t.source}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Required Materials</h3>
                    <div className="space-y-3">
                      {activeTech.materials.map((m, idx) => (
                        <div key={idx} className="border border-gray-200 p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="font-bold text-[#3E2723] text-[10px] block">{m.name}</span>
                            <span className="text-[9px] text-gray-500 block mt-1">SOURCE: {m.source}</span>
                            <span className="text-[9px] text-gray-550 block mt-1">PREPARATION: {m.preparation}</span>
                          </div>
                          <div className="text-[9px] text-gray-650 space-y-1">
                            <div><strong>STORAGE:</strong> {m.storage}</div>
                            <div><strong>SUSTAINABILITY:</strong> {m.sustainability}</div>
                            <div><strong>QUALITY CRITERIA:</strong> {m.qualityCriteria}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {activeTech.safetyConsiderations.length > 0 && (
                    <div className="bg-red-50/50 border border-red-200 p-3 mt-4">
                      <span className="font-bold text-red-700 block uppercase mb-1">Safety Considerations</span>
                      <ul className="list-disc pl-4 text-red-900 space-y-1">
                        {activeTech.safetyConsiderations.map((safety, idx) => (
                          <li key={idx}>{safety}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: QUALITY & ERRORS */}
              {activeModalTab === 'quality' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <div>
                    <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2">Quality Indicators</h3>
                    <ul className="list-disc pl-4 space-y-1 text-gray-700">
                      {activeTech.qualityIndicators.map((ind, idx) => (
                        <li key={idx}>{ind}</li>
                      ))}
                    </ul>
                  </div>

                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3 mt-6">Common Execution Errors</h3>
                  <div className="space-y-3">
                    {activeTech.commonErrors.map((err, idx) => (
                      <div key={idx} className="border border-red-200 p-3 bg-red-50/20 text-[9px] text-gray-700 space-y-1.5">
                        <div><strong className="text-red-700 uppercase">MISTAKE:</strong> {err.mistake}</div>
                        <div><strong className="text-gray-500 uppercase font-bold">CONSEQUENCE:</strong> {err.consequence}</div>
                        <div><strong className="text-green-700 uppercase">CORRECTION:</strong> {err.correction}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: REGIONAL VARIATIONS */}
              {activeModalTab === 'variations' && (
                <div className="space-y-4 font-mono text-[10px] text-gray-700">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2">Regional Variations</h3>
                  <p className="font-sans leading-relaxed">{activeTech.regionalVariations}</p>

                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3 mt-6">Technical Glossary Terms</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeTech.technicalTerminology.map((term, idx) => (
                      <div key={idx} className="border border-gray-200 p-3 bg-white">
                        <span className="font-bold text-[#3E2723] block text-[9px]">{term.term}</span>
                        <span className="text-gray-500 block mt-0.5">{term.definition}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-3 mt-6 text-[9px] text-gray-500 space-y-1.5">
                    <div><strong>REFERENCED ARCHIVE OBJECTS:</strong> {activeTech.referencedObjects.join(', ')}</div>
                    <div><strong>ORAL HISTORY TRANSMISSIONS:</strong> {activeTech.oralHistories.join(', ')}</div>
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
                <button onClick={() => setActiveTech(null)} className="border border-[#3E2723] hover:bg-[#3E2723]/5 text-[#3E2723] px-6 py-3 uppercase tracking-wider text-xs transition-colors font-light font-mono">
                  Return to Archive
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Hero section */}
      <UniversalEditorialHero pageKey="traditional-techniques" fallbackConfig={traditionalTechniquesHeroFallback as unknown as Parameters<typeof UniversalEditorialHero>[0]['fallbackConfig']} />

      <div className="container-fluid mx-auto px-4 md:px-10 py-12 max-w-7xl animate-fadeIn">
        
        {/* Scholarly Statement */}
        <div className="bg-[#3E2723]/5 border-l-4 border-[#3E2723] p-8 mb-12 rounded-r-xs max-w-5xl font-sans">
          <p className="text-gray-700 text-base md:text-lg leading-relaxed font-serif">
            Unlike the <strong>Master Artisans</strong> section, which documents people, or <strong>Collections</strong>, which document objects, <strong>Traditional Techniques</strong> preserves <strong>how craftsmanship is actually practiced</strong>. It is the scientific and technical documentation of Kashmir&apos;s intangible craft knowledge. This page answers: <em>&ldquo;How is this craft actually made, and why is every step important?&rdquo;</em>
          </p>
          <p className="text-gray-755 text-xs mt-3 uppercase tracking-widest font-bold font-mono">
            Traditional craft techniques are the foundation of Kashmir&apos;s artistic heritage. Every woven shawl, carved walnut panel, embroidered textile, engraved copper vessel, or painted Papier-Mâché object reflects generations of accumulated technical knowledge. The KHCRF Traditional Techniques Archive documents these methods through structured research, artisan interviews, workshop observations, demonstrations, diagrams, process photography, technical terminology, and scholarly interpretation. Rather than preserving only finished objects, this archive preserves the knowledge required to create them.
          </p>
          <div className="flex flex-wrap gap-4 mt-6 font-mono text-xs">
            <a href="#results" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-5 py-2.5 font-bold uppercase tracking-wider transition-all">
              Explore Techniques
            </a>
            <a href="#nomination-section" className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-5 py-2.5 font-bold uppercase tracking-wider transition-all">
              Document a Technique
            </a>
            <a href="#methodology" className="text-[#3E2723] hover:underline font-bold py-2.5">
              Technical Documentation Standards &rarr;
            </a>
          </div>
        </div>

        {/* Featured Technique Card */}
        <section className="bg-white border-4 border-[#3E2723] p-8 md:p-10 mb-16 relative shadow-md">
          <div className="absolute top-0 right-0 bg-[#3E2723] text-[#D4AF37] px-4 py-1 text-[10px] font-mono font-bold uppercase tracking-widest">
            FEATURED TECHNIQUE
          </div>
          
          <div className="max-w-4xl font-mono">
            <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-1">
              Technique Record: {featuredTech.techniqueNumber}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3E2723] leading-tight mb-2">
              {featuredTech.title}
            </h2>
            <h3 className="text-base md:text-lg font-serif italic text-gray-550 mb-4">
              {featuredTech.subtitle}
            </h3>
            
            <p className="text-gray-700 text-sm leading-relaxed mb-6 font-sans text-gray-655">
              {featuredTech.summary}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 font-mono text-[10px] border-t border-b border-gray-250 py-3 bg-gray-55 px-4">
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Craft</span>
                <span className="font-bold text-[#3E2723]">{featuredTech.craft}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Skill Level</span>
                <span className="font-bold text-[#3E2723]">{featuredTech.skillLevel}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Category</span>
                <span className="font-bold text-[#3E2723]">{featuredTech.category}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Version</span>
                <span className="font-bold text-[#D4AF37] font-bold">{featuredTech.version}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => { setActiveTech(featuredTech); setActiveModalTab('overview'); }}
                className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-all font-mono"
              >
                Study Technique &rarr;
              </button>
            </div>
          </div>
        </section>

        {/* Why Techniques Matter Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start mt-12">
          <div className="lg:col-span-5 font-sans">
            <h2 className="text-3xl font-serif text-[#3E2723] mb-6 font-bold">Preserving Knowledge Before It Disappears</h2>
            <p className="text-gray-655 text-sm leading-relaxed mb-6">
              Many traditional techniques are transmitted through observation and repeated practice rather than written manuals. As experienced artisans retire, workshops close, raw materials change, and markets evolve, technical knowledge can disappear long before the craft itself is considered endangered.
            </p>
            <p className="text-gray-605 text-sm leading-relaxed">
              By documenting techniques systematically, KHCRF supports artisan education, apprenticeship, conservation, museum interpretation, curriculum development, research, and quality preservation.
            </p>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#3E2723]/10 p-8 rounded-xs shadow-xs">
            <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 font-mono">
              Intangible Knowledge Safeguards:
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700 font-sans font-mono">
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>vocational education</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>museum conservation</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>university teaching</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>craft schools</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>apprenticeship curricula</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>restoration projects</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>heritage policy</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>digital preservation</li>
            </ul>
          </div>
        </section>

        {/* Archive Overview Dashboard */}
        <section className="bg-[#3E2723] text-white p-8 md:p-10 mb-12 rounded-xs relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#3E2723] px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-widest">
            Registry Overview
          </div>
          <div className="mb-8 font-mono">
            <h3 className="font-serif text-2xl text-[#D4AF37] mb-2 font-bold font-serif">Traditional Techniques Overview</h3>
            <p className="text-white/60 text-xs">
              LIVE TECHNICAL REGISTRY &amp; QUALITY STANDARDS DATABASE
            </p>
          </div>

          {/* Primary Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 text-center md:text-left border-b border-white/10 pb-8 mb-8">
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Documented Techniques</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">182</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono font-mono">Craft Traditions</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">12</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Demonstration Videos</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">214</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono font-mono font-mono">Illustrated Guides</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">163</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono font-mono">Glossary Terms</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">694</span>
            </div>
            <div className="last:border-0">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono font-mono font-mono font-mono">Master Contributors</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">96</span>
            </div>
          </div>

          {/* Secondary Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 text-center md:text-left font-mono">
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Workshop Processes</span>
              <span className="text-xl font-serif font-semibold text-white/80 font-mono">412</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Traditional Tools</span>
              <span className="text-xl font-serif font-semibold text-white/80">187</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono font-mono font-mono">Natural Materials</span>
              <span className="text-xl font-serif font-semibold text-white/80 font-mono">129</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono font-mono">Quality Standards</span>
              <span className="text-xl font-serif font-semibold text-white/80">138</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Safety Notes</span>
              <span className="text-xl font-serif font-semibold text-white/80">74</span>
            </div>
            <div className="last:border-0">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono font-mono font-mono">Research Papers</span>
              <span className="text-lg font-serif font-semibold text-[#D4AF37] block leading-tight font-mono">81</span>
            </div>
          </div>
        </section>

        {/* View Switcher Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 bg-[#FAF9F6] border border-[#3E2723]/10 p-4 font-mono" id="results">
          <div className="text-xs font-serif text-[#3E2723]">
            Traditional Techniques Directory &bull; Showing {sortedTechs.length} Documented Craft Processes
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] text-gray-400 uppercase self-center mr-2 font-mono">Archive Layout View:</span>
            <button 
              onClick={() => { setCurrentView('library'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'library' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Technique Library
            </button>
            <button 
              onClick={() => { setCurrentView('path'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'path' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Learning Path
            </button>
            <button 
              onClick={() => { setCurrentView('workflow'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'workflow' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Workshop Workflow
            </button>
            <button 
              onClick={() => { setCurrentView('atlas'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'atlas' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Technical Atlas
            </button>
          </div>
        </div>

        {/* Search and Discovery Layout */}
        <section className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Filters Sidebar */}
          {currentView !== 'path' && currentView !== 'workflow' && currentView !== 'atlas' && (
            <div className="w-full lg:w-1/4 bg-white border border-[#3E2723]/10 p-6 shadow-xs sticky top-4 z-10 font-sans">
              <h3 className="font-serif text-lg text-[#3E2723] mb-6 pb-2 border-b border-gray-100 flex items-center justify-between font-bold">
                <span>Filter Archive</span>
                <button 
                  onClick={() => {
                    setSelectedCraft('All');
                    setSelectedCategory('All');
                    setSelectedSkillLevel('All');
                    setSelectedStatus('All');
                    setSelectedFormat('All');
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
                    placeholder="Search techniques by craft, tool, material, process..."
                    className="w-full border border-gray-200 px-3 py-2 text-xs rounded-none bg-[#FAF9F6] text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  />
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
                    <option value="Chain Stitch">Chain Stitch</option>
                  </select>
                </div>

                {/* Technique Category */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Technique Category</label>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Categories</option>
                    <option value="Fibre Preparation">Fibre Preparation</option>
                    <option value="Spinning">Spinning</option>
                    <option value="Dyeing">Dyeing</option>
                    <option value="Warping">Warping</option>
                    <option value="Weaving">Weaving</option>
                    <option value="Knotting">Knotting</option>
                    <option value="Embroidery">Embroidery</option>
                    <option value="Carving">Carving</option>
                    <option value="Turning">Turning</option>
                    <option value="Engraving">Engraving</option>
                    <option value="Painting">Painting</option>
                    <option value="Polishing">Polishing</option>
                    <option value="Finishing">Finishing</option>
                    <option value="Restoration">Restoration</option>
                    <option value="Quality Inspection">Quality Inspection</option>
                  </select>
                </div>

                {/* Skill Level */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Skill Level</label>
                  <select 
                    value={selectedSkillLevel}
                    onChange={(e) => { setSelectedSkillLevel(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Master Level">Master Level</option>
                    <option value="Specialist">Specialist</option>
                  </select>
                </div>

                {/* Documentation Status */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Documentation Status</label>
                  <select 
                    value={selectedStatus}
                    onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Published">Published</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Field Documentation">Field Documentation</option>
                    <option value="Technical Validation">Technical Validation</option>
                    <option value="Archive Preview">Archive Preview</option>
                  </select>
                </div>

                {/* Learning Format */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Learning Format</label>
                  <select 
                    value={selectedFormat}
                    onChange={(e) => { setSelectedFormat(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Formats</option>
                    <option value="Illustrated Guide">Illustrated Guide</option>
                    <option value="Video Demonstration">Video Demonstration</option>
                    <option value="Interactive Diagram">Interactive Diagram</option>
                    <option value="Technical Drawing">Technical Drawing</option>
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
                    <option value="Most Referenced">Most Referenced</option>
                    <option value="Recently Published">Recently Published</option>
                    <option value="Craft">Craft</option>
                    <option value="Skill Level">Skill Level</option>
                    <option value="Alphabetical">Alphabetical</option>
                  </select>
                </div>

              </div>
            </div>
          )}

          {/* Results Area */}
          <div className={`w-full ${currentView === 'path' || currentView === 'workflow' || currentView === 'atlas' ? 'lg:w-full' : 'lg:w-3/4'}`}>

            {loading ? (
              <div className="py-20 text-center text-gray-505 font-serif font-bold">Loading techniques...</div>
            ) : (
              <>
                {/* 1. TECHNIQUE LIBRARY VIEW */}
                {currentView === 'library' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                    {paginatedTechs.map((t, i) => (
                      <div 
                        key={i} 
                        className="bg-white border-2 border-[#3E2723]/35 py-8 px-6 hover:bg-[#3E2723]/5 transition-all duration-300 group flex flex-col justify-between shadow-sm relative grid-ledger font-mono text-xs text-gray-700"
                      >
                        <div>
                          {/* Accession ID & Skill level header */}
                          <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5 font-semibold">
                            <span>{t.techniqueNumber}</span>
                            <span>{t.skillLevel} LEVEL</span>
                          </div>

                          {/* Category & Craft */}
                          <div className="text-[9px] font-mono text-[#D4AF37] font-bold uppercase tracking-widest mb-4">
                            {t.category.toUpperCase()} &bull; {t.craft.toUpperCase()}
                          </div>

                          {/* Title */}
                          <h3 
                            onClick={() => { setActiveTech(t); setActiveModalTab('overview'); }}
                            className="text-xl md:text-2xl font-serif font-bold text-[#3E2723] leading-snug cursor-pointer group-hover:text-[#D4AF37] transition-colors"
                          >
                            {t.title}
                          </h3>

                          {t.subtitle && (
                            <h4 className="text-xs font-serif italic text-gray-550 mt-1 leading-snug mb-3">
                              {t.subtitle}
                            </h4>
                          )}

                          <p className="text-gray-655 text-xs leading-relaxed mb-4 font-sans line-clamp-3 mt-3">
                            {t.summary}
                          </p>

                          {/* Formats indicator */}
                          <div className="relative pl-4 mb-4 border-l-2 border-[#D4AF37]/50 font-mono text-[10px] leading-relaxed my-4">
                            <span className="text-[9px] text-gray-400 uppercase tracking-wider block mb-1">
                              AVAILABLE INSTRUCTIONAL FORMATS
                            </span>
                            <span className="font-bold text-[#3E2723]">
                              {t.formats.join(' · ')}
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="text-[#3E2723]/25 text-[9px] font-mono mb-3 select-none">
                            ─────╱╲──╱────╲╱─────
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto font-mono">
                            <span className="bg-[#3E2723]/5 border border-[#3E2723]/10 text-[#3E2723] text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider">
                              {t.status.toUpperCase()}
                            </span>
                            
                            <button 
                              onClick={() => { setActiveTech(t); setActiveModalTab('steps'); }}
                              className="text-xs font-bold uppercase tracking-widest text-[#3E2723] hover:text-[#D4AF37] transition-colors font-mono"
                            >
                              Study Technique &rarr;
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

                {/* 2. LEARNING PATH VIEW */}
                {currentView === 'path' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeIn font-mono text-xs text-[#3E2723]">
                    {learningPaths.map((path, idx) => (
                      <div key={idx} className="bg-white border-2 border-[#3E2723] p-6 shadow-md flex flex-col justify-between">
                        <div>
                          <span className="text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest block mb-1">{path.level}</span>
                          <h4 className="font-serif text-lg font-bold mb-4 border-b border-gray-150 pb-2 text-[#3E2723]">{path.title}</h4>
                          <ul className="space-y-3 text-gray-650 text-[11px] mb-6">
                            {path.steps.map((step, sIdx) => (
                              <li key={sIdx} className="flex gap-2">
                                <span className="text-[#D4AF37] font-bold">{sIdx + 1}.</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <button className="w-full bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] py-2.5 font-bold uppercase tracking-widest text-[10px] transition-colors font-mono">
                          Begin Level Studies &rarr;
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. WORKSHOP WORKFLOW VIEW */}
                {currentView === 'workflow' && (
                  <div className="bg-white border-2 border-[#3E2723] p-6 shadow-md animate-fadeIn font-mono text-xs text-[#3E2723]">
                    <span className="text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest block mb-1">INTERACTIVE PROCESS MAP</span>
                    <h3 className="font-serif text-lg font-bold mb-6 border-b border-gray-150 pb-2">Kashmiri Weaving Production Stage Pipeline</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                      {workflowStages.map((stage, idx) => (
                        <div key={idx} className="border border-gray-250 p-4 bg-white space-y-2 flex flex-col justify-between text-center">
                          <div>
                            <span className="text-[9px] text-[#D4AF37] font-bold uppercase">{stage.stage}</span>
                            <h4 className="font-serif text-xs font-bold mt-1 text-[#3E2723]">{stage.technique}</h4>
                          </div>
                          <div className="pt-2 border-t border-dashed border-gray-200">
                            <span className="px-2 py-0.5 bg-gray-100 text-[#3E2723] text-[8px] font-bold border border-gray-300">
                              {stage.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. TECHNICAL ATLAS VIEW */}
                {currentView === 'atlas' && (
                  <div className="bg-white border border-[#3E2723]/10 overflow-x-auto shadow-sm animate-fadeIn font-mono">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#3E2723] text-[#D4AF37] font-mono uppercase tracking-wider text-[10px]">
                          <th className="p-4 border-b border-[#3E2723]/20">Record ID</th>
                          <th className="p-4 border-b border-[#3E2723]/20">Title & Technique Scope</th>
                          <th className="p-4 border-b border-[#3E2723]/20">Craft</th>
                          <th className="p-4 border-b border-[#3E2723]/20">Category</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center">Level</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center">Learning Time</th>
                          <th className="p-4 border-b border-[#3E2723]/20">Master Contributors</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#3E2723]/10 font-sans text-gray-700 text-xs">
                        {paginatedTechs.map((t, idx) => (
                          <tr key={idx} className="hover:bg-[#FAF9F6] transition-colors cursor-pointer" onClick={() => { setActiveTech(t); setActiveModalTab('overview'); }}>
                            <td className="p-4 font-mono font-bold text-gray-500 whitespace-nowrap">{t.techniqueNumber}</td>
                            <td className="p-4">
                              <div className="font-serif font-bold text-[#3E2723] text-sm hover:text-[#D4AF37] transition-colors">{t.title}</div>
                              <div className="text-[10px] text-gray-400 font-light truncate max-w-xs">{t.subtitle}</div>
                            </td>
                            <td className="p-4 whitespace-nowrap font-bold">{t.craft}</td>
                            <td className="p-4 whitespace-nowrap">{t.category}</td>
                            <td className="p-4 text-center font-mono font-bold text-[#3E2723]">{t.skillLevel}</td>
                            <td className="p-4 text-center font-mono">{t.learningTime}</td>
                            <td className="p-4 whitespace-nowrap font-mono">{t.masterContributors.join(', ')}</td>
                            <td className="p-4 text-center whitespace-nowrap font-mono">
                              <span className="px-2 py-0.5 font-mono text-[9px] uppercase border border-[#3E2723]/20 bg-[#3E2723]/5 text-[#3E2723] font-bold">
                                {t.status}
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
            {currentView !== 'path' && currentView !== 'workflow' && currentView !== 'atlas' && totalPages > 1 && (
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
            How KHCRF Documents Traditional Techniques
          </h2>
          <p className="text-gray-655 text-sm leading-relaxed mb-6">
            Traditional Techniques are documented through direct observation, workshop recording, artisan interviews, process photography, technical measurements, demonstrations, historical references, and comparative analysis. Documentation emphasizes repeatable technical understanding rather than simplified instruction.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 text-xs font-mono">
            <div>
              <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3 font-mono">Research Workflow</h3>
              <ol className="list-decimal pl-4 space-y-2 text-gray-600">
                <li>Technique nomination and workshop access authorization</li>
                <li>Artisan consultation and sequential process recording</li>
                <li>Technical macro photography and tool geometry blueprints</li>
                <li>Material composition analysis and quality benchmarks</li>
                <li>Editorial review and technical verification by elders</li>
              </ol>
            </div>
            <div>
              <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3 font-mono">Documentation Principles</h3>
              <ul className="list-disc pl-4 space-y-2 text-gray-600">
                <li>evidence-based documentation verified by practitioners</li>
                <li>traditional terminology preservation with absolute precision</li>
                <li>distinction between district variants without claiming superiority</li>
                <li>respect for private guild family secrets</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Research & Educational Use */}
        <section className="bg-white border border-[#3E2723]/25 p-8 md:p-10 mb-16 rounded-xs shadow-sm font-sans">
          <h2 className="text-2xl font-serif text-[#3E2723] mb-4 font-bold">Research &amp; Educational Use</h2>
          <p className="text-gray-655 text-sm leading-relaxed mb-6">
            The archive supports vocational education, museum conservation, university teaching, craft schools, apprenticeship programs, restoration projects, and digital preservation.
          </p>
          <div className="flex gap-4 font-mono">
            <Link href="mailto:research@khcrf.org" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3 font-bold uppercase tracking-wider text-xs transition-colors">
              Request Technical Documentation
            </Link>
            <a href="#nomination-section" className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-6 py-3 font-bold uppercase tracking-wider text-xs transition-colors">
              Submit a Technique
            </a>
          </div>
        </section>

        {/* Nominate Technique Form */}
        <section id="nomination-section" className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs">
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase block mb-1 font-mono">Help Preserve Traditional Knowledge</span>
            <h2 className="text-3xl font-serif text-[#3E2723] font-bold">Submit Technique Documentation</h2>
            <p className="text-gray-500 text-xs font-mono mt-1">Master artisans, researchers, and conservators are invited to submit technical documentation drafts.</p>
          </div>

          <div className="bg-[#FAF9F6] p-6 md:p-8 border border-gray-250">
            {proposalSubmitted ? (
              <div className="text-center py-8 font-mono">
                <h3 className="text-lg font-bold text-green-600 mb-2">Documentation Proposal Staged</h3>
                <p className="text-xs text-gray-500">Thank you. The KHCRF Quality Committee will verify the steps, tools, and material logs before editorial indexing.</p>
              </div>
            ) : (
              <form onSubmit={handleProposalSubmit} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Technique Title *</label>
                    <input 
                      required 
                      type="text" 
                      value={proposalForm.title}
                      onChange={(e) => setProposalForm({...proposalForm, title: e.target.value})}
                      placeholder="e.g. Double-Sided Sozni Satin Stitch"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Craft Tradition *</label>
                    <input 
                      required 
                      type="text" 
                      value={proposalForm.craft}
                      onChange={(e) => setProposalForm({...proposalForm, craft: e.target.value})}
                      placeholder="e.g. Sozni Embroidery"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Category *</label>
                    <input 
                      required
                      type="text" 
                      value={proposalForm.category}
                      onChange={(e) => setProposalForm({...proposalForm, category: e.target.value})}
                      placeholder="e.g. Embroidery, Fibre Preparation"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Skill Level *</label>
                    <input 
                      required
                      type="text" 
                      value={proposalForm.skillLevel}
                      onChange={(e) => setProposalForm({...proposalForm, skillLevel: e.target.value})}
                      placeholder="e.g. Advanced, Master Level"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Workshop / Guild</label>
                    <input 
                      type="text" 
                      value={proposalForm.workshop}
                      onChange={(e) => setProposalForm({...proposalForm, workshop: e.target.value})}
                      placeholder="e.g. Beerwah Sozni Collective"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Region *</label>
                    <input 
                      required
                      type="text" 
                      value={proposalForm.region}
                      onChange={(e) => setProposalForm({...proposalForm, region: e.target.value})}
                      placeholder="e.g. Budgam District"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-500 mb-1">Process Summary &amp; Steps *</label>
                  <textarea 
                    required 
                    rows={4} 
                    value={proposalForm.summary}
                    onChange={(e) => setProposalForm({...proposalForm, summary: e.target.value})}
                    placeholder="Outline step-by-step how the technique is executed, common mistakes, and quality checks..."
                    className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723] resize-none" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Required Tools &amp; Materials</label>
                    <textarea 
                      rows={2} 
                      value={proposalForm.tools}
                      onChange={(e) => setProposalForm({...proposalForm, tools: e.target.value})}
                      placeholder="List tools (e.g. fine needles, Panja comb) and materials..."
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723] resize-none" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Supporting References &amp; Contributor Info *</label>
                    <textarea 
                      required
                      rows={2} 
                      value={proposalForm.contact}
                      onChange={(e) => setProposalForm({...proposalForm, contact: e.target.value})}
                      placeholder="Provide references, videos, or contact coordinates..."
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723] resize-none" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-[#3E2723] hover:bg-[#D4AF37] text-white hover:text-[#3E2723] font-bold uppercase tracking-widest transition-colors font-mono"
                >
                  Submit Technique Documentation
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
            &ldquo;The KHCRF Traditional Techniques Archive preserves the knowledge behind Kashmir&apos;s craftsmanship. By documenting processes, tools, materials, terminology, and workshop practices with scholarly rigor, the archive ensures that the skills required to create exceptional craft objects remain accessible to future generations.&rdquo;
          </p>
          <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto"></div>
        </div>
      </footer>

    </main>
  );
}
