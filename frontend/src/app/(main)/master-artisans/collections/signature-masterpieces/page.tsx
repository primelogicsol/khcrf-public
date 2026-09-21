'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { signatureMasterpiecesHeroFallback } from '@/config/heroFallbacks';

export default function SignatureMasterpieces() {
  const [allMasterpieces, setAllMasterpieces] = useState<any[]>([
    {
      slug: "sm-shah-hamadan-carpet",
      title: "The Shah Hamadan Carpet",
      subtitle: "Monumental Classical Carpet with Exceptional Talim Precision",
      desc: "This exceptional carpet represents one of the finest surviving examples of traditional Kashmiri hand-knotting. Distinguished by its remarkable knot density, balanced proportions, refined talim interpretation, harmonious colour composition, and exceptional finishing, it illustrates the mature craftsmanship achieved through generations of specialised workshop knowledge. The work demonstrates how technical discipline, artistic judgement, and collaborative workshop practice converge in a single object of enduring cultural significance.",
      accessionId: "KHCRF-SM-2026-001",
      year: "Late 20th Century",
      craft: "Carpet",
      technique: "Traditional Hand-Knotting",
      artisan: "Master Weavers Guild",
      workshop: "Master Artisan Workshop",
      district: "Srinagar",
      material: "Wool",
      dimensions: "360 x 270 cm",
      location: "KHCRF Vault A",
      recognition: "Technical Excellence",
      version: "v1.4",
      whyItMatters: "Earned its designation due to an unprecedented knot count of 800 KPSI, flawless rendering of Safavid garden plans without pattern drift, and complete dye stability under conservation audits.",
      technicalAnalysis: {
        technique: "Hand-Knotted Weaving",
        skillLevel: "Master Artisan",
        productionTime: "32 Months",
        toolComplexity: "High (Traditional Loom + Chasing Beetle)",
        sequence: "Warp tension setup -> Talim transcription -> Double-knot weave -> Weft comb beating -> Fringe bind -> Stone wash finish",
        characteristics: "Zero warp drift, absolute color symmetry",
        variations: "Mirrored border layouts",
        standards: "900 knots/sq inch benchmark",
        qualityIndicators: "Perfect flat lay, clear design read from reverse"
      },
      evaluation: [
        { label: "Authenticity", stars: "★★★★★", justification: "Fully verified via family weavers' register and stamp records." },
        { label: "Technical Mastery", stars: "★★★★★", justification: "Zero errors in the complex 12-color grid layout." },
        { label: "Material Quality", stars: "★★★★★", justification: "100% pure organic hand-spun wool warp." },
        { label: "Design Excellence", stars: "★★★★☆", justification: "Stunning medallion symmetry with minor variation in edge grids." },
        { label: "Innovation", stars: "★★★★☆", justification: "Pioneered localized weft insertion rates." },
        { label: "Historical Importance", stars: "★★★★★", justification: "Enduring reference of late-century cooperative success." },
        { label: "Cultural Significance", stars: "★★★★★", justification: "Celebrated in oral histories across Srinagar guilds." },
        { label: "Condition", stars: "★★★★☆", justification: "Minor fringe wear, pile structure is completely intact." },
        { label: "Documentation Quality", stars: "★★★★★", justification: "Complete audio-visual transcription and yarn records logged." }
      ],
      conservation: {
        condition: "Excellent - Minor fringe wear",
        pastConservation: "Stabilized pile structure in 2022",
        risks: "Humidity changes, pest threat",
        handling: "Flat board lifting, cotton gloves compulsory",
        monitoring: "Visual inspection every 6 months",
        treatment: "None required currently",
        reviewSchedule: "Next review December 2026",
        storage: "Acid-free wrapping, horizontal racks",
        environmental: "Temperature 19°C +/- 1°C, Humidity 45% +/- 5%"
      },
      essay: {
        historicalBackground: "Commissioned under mid-century workshop revitalization programs to prove traditional loom limits.",
        artisticInterpretation: "Symbolizes the heavenly paradise garden through geometric symmetry.",
        workshopContext: "Woven in the legendary Bhat cooperative workshop under Farooq Mir's technical direction.",
        technicalInnovation: "Introduced double ply warp sizing with regional rice-starch solutions.",
        culturalMeaning: "Represents the migration of Sufi carpet coding techniques into living practice.",
        comparativeAnalysis: "Compare this carpet with three other late twentieth-century masterpieces from different workshops to understand variations in talim interpretation and border composition.",
        influence: "Inspired contemporary weavers to return to fine-knot density standards.",
        conservationConsiderations: "Requires steady climate to prevent wool fiber dry-out.",
        unansweredQuestions: "Exact origin of the dark indigo dye batch remains under chemical review."
      },
      relatedDoc: "Doc-KHCRF-2026-03",
      relatedHistory: "KHCRF-OH-2026-007",
      relatedDemo: "KHCRF-CD-2026-001",
      relatedCollection: "KHCRF-COL-2026-002",
      bibliography: "Kashmir Carpet Weaving (2012) pp. 45-67.",
      citation: "KHCRF Registry SM-001.",
      rights: "Copyright KHCRF Preservation Trust"
    },
    {
      slug: "sm-winter-pashmina",
      title: "The Winter Pashmina",
      subtitle: "Fine Hand-spun Changthangi Fleece with Traditional Finishing",
      desc: "An exceptional Pashmina shawl representing material excellence through hand-separated 12-micron grade Changthangi goat wool, spun on wooden yinder wheels.",
      accessionId: "KHCRF-SM-2026-002",
      year: "Mid 20th Century",
      craft: "Pashmina",
      technique: "Hand Spinning & Loom Weave",
      artisan: "Zareena Begum",
      workshop: "Downtown Srinagar Spinner Cell",
      district: "Srinagar",
      material: "Pashmina",
      dimensions: "200 x 100 cm",
      location: "KHCRF Vault B",
      recognition: "Material Excellence",
      version: "v1.0",
      whyItMatters: "Earned its designation because of the pure 12-micron fiber count, entirely devoid of guard hair pollution, and finished using organic soap-nut wash paths.",
      technicalAnalysis: {
        technique: "Hand-spun Weaving",
        skillLevel: "Master Spinner",
        productionTime: "8 Months",
        toolComplexity: "Medium (Yinder Wheel)",
        sequence: "Sorting -> De-hairing -> Combing -> Spinning -> Weaving",
        characteristics: "Lightweight 120g total weight, translucent weave",
        variations: "Natural white shade variations",
        standards: "12-micron fiber diameter standard",
        qualityIndicators: "Passed ring test smoothly"
      },
      evaluation: [
        { label: "Authenticity", stars: "★★★★★", justification: "Verified spin roots." }
      ],
      conservation: {
        condition: "Pristine",
        environmental: "Low humidity"
      },
      essay: {
        historicalBackground: "Produced during the golden age of Srinagar cooperative spinning circles.",
        artisticInterpretation: "Understated minimalist design focusing on pure fiber tactile qualities."
      },
      relatedDoc: "Doc-KHCRF-2026-05",
      relatedHistory: "KHCRF-OH-2026-009",
      relatedDemo: "KHCRF-CD-2026-002",
      relatedCollection: "KHCRF-COL-2026-001"
    },
    {
      slug: "sm-garden-chinar",
      title: "Garden of Chinar",
      subtitle: "Masterpiece of Papier-Mâché Floral Painting",
      desc: "A stunning presentation box showing layers of hand-pressed paper pulp coated with fine gypsum plaster and painted with cat tail brush tips.",
      accessionId: "KHCRF-SM-2026-003",
      year: "Early 20th Century",
      craft: "Papier-Mâché",
      technique: "Naqashi Painting",
      artisan: "Mohammad Yusuf",
      workshop: "Habibullah Atelier",
      district: "Srinagar",
      material: "Papier-Mâché",
      dimensions: "30 x 20 cm",
      location: "KHCRF Vault C",
      recognition: "Artistic Innovation",
      version: "v1.2",
      whyItMatters: "Designation awarded for the application of freehand gold lining inside the Chinar leaves without outline guides, utilizing natural gold leaf leafing.",
      technicalAnalysis: {
        technique: "Sakhta pulp moulding & Naqashi painting",
        skillLevel: "Master Naqash",
        productionTime: "6 Months",
        toolComplexity: "High",
        sequence: "Moulding -> Sanding -> Plaster -> Burnishing -> Base coat -> Painting -> Lacquer",
        characteristics: "1mm detail painting",
        variations: "Varying leaf scales",
        standards: "24k gold leaf lining",
        qualityIndicators: "No paint bleed under varnish layer"
      },
      evaluation: [
        { label: "Artistic Innovation", stars: "★★★★★", justification: "Unique gold layering." }
      ],
      conservation: {
        condition: "Excellent",
        environmental: "Protected from UV light"
      },
      essay: {
        historicalBackground: "Exhibited in early regional craft expos as a master reference.",
        artisticInterpretation: "Symbolizes the autumn color changes in Srinagar's gardens."
      },
      relatedDoc: "Doc-KHCRF-2026-04",
      relatedHistory: "KHCRF-OH-2026-003",
      relatedDemo: "KHCRF-CD-2026-006",
      relatedCollection: "KHCRF-COL-2026-005"
    },
    {
      slug: "sm-walnut-minbar",
      title: "Walnut Minbar Panel",
      subtitle: "Architectural Carving of Extraordinary Precision",
      desc: "A massive solid walnut panel carved from seasoned wood displaying interlocking geometric screens and floral undercuts.",
      accessionId: "KHCRF-SM-2026-004",
      year: "Mid 20th Century",
      craft: "Walnut Wood",
      technique: "Deep Undercut Carving",
      artisan: "Showkat Ahmad",
      workshop: "Downtown Srinagar Woodshop",
      district: "Srinagar",
      material: "Walnut",
      dimensions: "180 x 60 cm",
      location: "KHCRF Vault A",
      recognition: "Technical Excellence",
      version: "v1.1",
      whyItMatters: "Pinnacle carve relief depth of 12mm carved from a single piece without joint cracks, demonstrating flawless grain split control.",
      technicalAnalysis: {
        technique: "Deep relief hand carving",
        skillLevel: "Master Carver",
        productionTime: "11 Months",
        toolComplexity: "High (35 Custom Chisels)",
        sequence: "Timber selection -> Curing check -> Layout draw -> Chisel outline -> Deep carve -> Detail burnish",
        characteristics: "12mm deep relief depth",
        variations: "Lattice border configurations",
        standards: "Zero sand fill allowed",
        qualityIndicators: "Crisp shadow lines under low side illumination"
      },
      evaluation: [
        { label: "Technical Mastery", stars: "★★★★★", justification: "Flawless relief depth." }
      ],
      conservation: {
        condition: "Good",
        environmental: "Humidity stabilized to prevent splits"
      },
      essay: {
        historicalBackground: "Carved for a regional prayer hall restoration in Srinagar.",
        artisticInterpretation: "Geometrical lattice representing universal order."
      },
      relatedDoc: "Doc-KHCRF-2026-04",
      relatedHistory: "KHCRF-OH-2026-003",
      relatedDemo: "KHCRF-CD-2026-008",
      relatedCollection: "KHCRF-COL-2026-004"
    },
    {
      slug: "sm-sozni-valley",
      title: "Sozni of the Valley",
      subtitle: "Master Sozni Embroidery Demonstrating Exceptional Needle Control",
      desc: "A masterpiece Sozni Jamawar shawl showing total surface embroidery using fine silk threads on Pashmina base.",
      accessionId: "KHCRF-SM-2026-005",
      year: "Late 20th Century",
      craft: "Sozni",
      technique: "Fine needlework embroidery",
      artisan: "Safeena Jan",
      workshop: "Domestic Co-op Pampore",
      district: "Srinagar",
      material: "Pashmina",
      dimensions: "200 x 100 cm",
      location: "KHCRF Vault B",
      recognition: "Artistic Excellence",
      version: "v1.2",
      whyItMatters: "Designation based on extreme needle stitch density of 90 stitches/inch, creating paint-like borders on Pashmina base fabric.",
      technicalAnalysis: {
        technique: "Needlework Sozni",
        skillLevel: "Master Embroiderer",
        productionTime: "36 Months",
        toolComplexity: "Low (Fine Needle)",
        sequence: "Trace -> Outline stitch -> Infill -> Border stitch -> Wash",
        characteristics: "Paint-like embroidery visual feel",
        variations: "Dorukha double sided variants",
        standards: "90 stitches per inch",
        qualityIndicators: "No warp puckering or border distortion"
      },
      evaluation: [
        { label: "Artistic Excellence", stars: "★★★★★", justification: "Extreme micro stitch paths." }
      ],
      conservation: {
        condition: "Excellent",
        environmental: "No direct light"
      },
      essay: {
        historicalBackground: "Woven as a masterpiece submission for cooperative certification.",
        artisticInterpretation: "Endless floral arrays of central Valley flora."
      },
      relatedDoc: "Doc-KHCRF-2026-05",
      relatedHistory: "KHCRF-OH-2026-001",
      relatedDemo: "KHCRF-CD-2026-004",
      relatedCollection: "KHCRF-COL-2026-003"
    },
    {
      slug: "sm-copper-valley",
      title: "Copper of the Valley",
      subtitle: "Traditional Hand-Engraved Ceremonial Vessel",
      desc: "A classic Kandkari samovar hammered from pure copper displaying chasing lines and tin coated linings.",
      accessionId: "KHCRF-SM-2026-006",
      year: "19th Century",
      craft: "Copperware",
      technique: "Chasing & Kandkari Engraving",
      artisan: "Abdul Rehman",
      workshop: "Zaina Kadal Copper Workshop",
      district: "Srinagar",
      material: "Copper",
      dimensions: "65 x 40 cm",
      location: "KHCRF Vault C",
      recognition: "Historical Significance",
      version: "v1.0",
      whyItMatters: "Provides critical proof of nineteenth-century coppersmith guild symbols, confirming early trade connections with central markets.",
      technicalAnalysis: {
        technique: "Kandkari copper engraving",
        skillLevel: "Master Chaser",
        productionTime: "4 Months",
        toolComplexity: "Medium (Hammer + Chisel)",
        sequence: "Hammer sheet -> Solder joints -> Chasing line trace -> Engraving -> Tin coat",
        characteristics: "Historical signature marks",
        variations: "Vessel height variations",
        standards: "Pure copper sheet substrate",
        qualityIndicators: "Liner tin coating thickness evenness"
      },
      evaluation: [
        { label: "Historical Significance", stars: "★★★★★", justification: "Provides proof of guild symbols." }
      ],
      conservation: {
        condition: "Stable",
        environmental: "Very low moisture"
      },
      essay: {
        historicalBackground: "Acquired from the oldest bazaar guild register inventory.",
        artisticInterpretation: "Traditional floral geometric borders."
      },
      relatedDoc: "Doc-KHCRF-2026-12",
      relatedHistory: "KHCRF-OH-2026-012",
      relatedDemo: "KHCRF-CD-2026-009",
      relatedCollection: "KHCRF-COL-2026-006"
    },
    {
      slug: "sm-kani-seasons",
      title: "Kani of Four Seasons",
      subtitle: "Complex Pattern Weaving Preserving Historic Design Language",
      desc: "A monumental Kani shawl showing seasonal landscape shifts woven in double-beam loom setups.",
      accessionId: "KHCRF-SM-2026-007",
      year: "Mid 20th Century",
      craft: "Kani",
      technique: "Warp-weft interlacing",
      artisan: "Sobia Jan",
      workshop: "Domestic Spinners Co-op",
      district: "Srinagar",
      material: "Pashmina",
      dimensions: "200 x 120 cm",
      location: "KHCRF Vault A",
      recognition: "Design Innovation",
      version: "v1.1",
      whyItMatters: "Awarded for weaving transitional color borders without joint bulk, maintaining smooth shawl thickness across all four quadrants.",
      technicalAnalysis: {
        technique: "Kani Weaving",
        skillLevel: "Master Weaver",
        productionTime: "18 Months",
        toolComplexity: "High (Double beam horizontal loom)",
        sequence: "Warp setup -> Bobbin wind -> Pattern read -> Knot interlock -> Wash finish",
        characteristics: "Smooth quadrant transitions",
        variations: "Loom scale adjustments",
        standards: "2000 warp strings standard",
        qualityIndicators: "Zero bulk at pattern intersections"
      },
      evaluation: [
        { label: "Design Innovation", stars: "★★★★★", justification: "Transitional color borders." }
      ],
      conservation: {
        condition: "Excellent",
        environmental: "Temperature controlled"
      },
      essay: {
        historicalBackground: "Woven under early post-independence revival initiatives.",
        artisticInterpretation: "The changing face of Kashmir's valleys across seasons."
      },
      relatedDoc: "Doc-KHCRF-2026-05",
      relatedHistory: "KHCRF-OH-2026-001",
      relatedDemo: "KHCRF-CD-2026-003",
      relatedCollection: "KHCRF-COL-2026-001"
    },
    {
      slug: "sm-last-namda",
      title: "The Last Traditional Namda",
      subtitle: "Documenting a Rare Felting Tradition",
      desc: "A thick felt floor rug using unspun lamb wool fibers, saturated with alkaline wash water and pressed by hand.",
      accessionId: "KHCRF-SM-2026-008",
      year: "Late 20th Century",
      craft: "Namda",
      technique: "Traditional Felting",
      artisan: "Bashir Ahmad",
      workshop: "Downtown Srinagar Felting Unit",
      district: "Srinagar",
      material: "Wool",
      dimensions: "180 x 120 cm",
      location: "KHCRF Vault B",
      recognition: "Cultural Significance",
      version: "v1.0",
      whyItMatters: "Earned designation for documenting regional carded wool ratios and felting soap recipes under threat from chemical imports.",
      technicalAnalysis: {
        technique: "Hand-pressed wool felting",
        skillLevel: "Master Felter",
        productionTime: "2 Months",
        toolComplexity: "Low (Felting roll mat)",
        sequence: "Wool sorting -> Layering -> Alkaline soak -> Rolling -> Wash -> Drying",
        characteristics: "Dense fiber lock",
        variations: "Shifting border designs",
        standards: "100% organic local wool",
        qualityIndicators: "Consistent felt thickness without hollow spots"
      },
      evaluation: [
        { label: "Cultural Significance", stars: "★★★★★", justification: "Documenting regional wool ratios." }
      ],
      conservation: {
        condition: "Good",
        environmental: "Dry ventilated storage"
      },
      essay: {
        historicalBackground: "Created in the final active felting karkhana of Old Srinagar.",
        artisticInterpretation: "Understated geometric wool shapes."
      },
      relatedDoc: "Doc-KHCRF-2026-03",
      relatedHistory: "KHCRF-OH-2026-010",
      relatedDemo: "KHCRF-CD-2026-010",
      relatedCollection: "KHCRF-COL-2026-008"
    },
    {
      slug: "sm-chinar-relief",
      title: "Chinar in Relief",
      subtitle: "Master Walnut Wood Relief Carving",
      desc: "A small display box panel carved with deep Chinar leaf layouts showing detailed vein carvings.",
      accessionId: "KHCRF-SM-2026-009",
      year: "Mid 20th Century",
      craft: "Walnut Wood",
      technique: "Walnut Relief Carving",
      artisan: "Ustad Ali Mohammad",
      workshop: "Downtown Srinagar Woodshop",
      district: "Srinagar",
      material: "Walnut",
      dimensions: "40 x 30 cm",
      location: "KHCRF Vault A",
      recognition: "Technical Excellence",
      version: "v1.1",
      whyItMatters: "Features the thinnest carved walnut stems (under 1.5mm width) that remained completely stable without splitting over 50 years.",
      technicalAnalysis: {
        technique: "Walnut wood carving",
        skillLevel: "Master Carver",
        productionTime: "3 Months",
        toolComplexity: "Medium",
        sequence: "Timber select -> Draft -> Carving -> Oil polish",
        characteristics: "1.5mm thin carved stems",
        variations: "Border design options",
        standards: "Seasoned walnut heartwood only",
        qualityIndicators: "No tearout or grain splitting"
      },
      evaluation: [
        { label: "Technical Mastery", stars: "★★★★★", justification: "Thinnest wood stems." }
      ],
      conservation: {
        condition: "Excellent",
        environmental: "Humidity monitored"
      },
      essay: {
        historicalBackground: "Carved as a workshop masterpiece reference.",
        artisticInterpretation: "Detailed chinar leaf symmetry."
      },
      relatedDoc: "Doc-KHCRF-2026-04",
      relatedHistory: "KHCRF-OH-2026-003",
      relatedDemo: "KHCRF-CD-2026-008",
      relatedCollection: "KHCRF-COL-2026-004"
    },
    {
      slug: "sm-river-shawl",
      title: "The River Collection Shawl",
      subtitle: "Exceptional Contemporary Interpretation of Traditional Pashmina",
      desc: "A contemporary shawl using vegetable dyed blue threads representing the flowing paths of the Jhelum river.",
      accessionId: "KHCRF-SM-2026-010",
      year: "Contemporary",
      craft: "Pashmina",
      technique: "Vegetable Dyeing & Weaving",
      artisan: "Sobia Jan",
      workshop: "Domestic Spinners Co-op",
      district: "Srinagar",
      material: "Pashmina",
      dimensions: "200 x 100 cm",
      location: "KHCRF Vault B",
      recognition: "Living Masterpiece",
      version: "v1.0",
      whyItMatters: "Recognized for the successful integration of regional wild indigo plant dye formulas with double twist Pashmina warp yarn.",
      technicalAnalysis: {
        technique: "Vegetable dye weaving",
        skillLevel: "Master Weaver",
        productionTime: "12 Months",
        toolComplexity: "Medium",
        sequence: "Dye prep -> Yarn dye -> Loom set -> Weave -> Finisher wash",
        characteristics: "Indigo gradient transitions",
        variations: "Indigo shade variations",
        standards: "100% natural vegetable dyes",
        qualityIndicators: "Passed rub and wash tests"
      },
      evaluation: [
        { label: "Living Masterpiece", stars: "★★★★★", justification: "Wild indigo integration." }
      ],
      conservation: {
        condition: "Excellent",
        environmental: "Low light"
      },
      essay: {
        historicalBackground: "Created under the 2024 regional dye revival audits.",
        artisticInterpretation: "The flowing blue gradients of the Jhelum river."
      },
      relatedDoc: "Doc-KHCRF-2026-05",
      relatedHistory: "KHCRF-OH-2026-001",
      relatedDemo: "KHCRF-CD-2026-011",
      relatedCollection: "KHCRF-COL-2026-011"
    },
    {
      slug: "sm-royal-paisley",
      title: "The Royal Paisley",
      subtitle: "Historic Motif Development Across Generations",
      desc: "A historic Kani shawl showing early paisley designs, demonstrating the evolution of regional wool patterns.",
      accessionId: "KHCRF-SM-2026-011",
      year: "19th Century",
      craft: "Kani",
      technique: "Traditional Kani Weave",
      artisan: "Royal Court Weavers",
      workshop: "Srinagar Palace Guild",
      district: "Srinagar",
      material: "Pashmina",
      dimensions: "200 x 110 cm",
      location: "KHCRF Vault A",
      recognition: "Historical Importance",
      version: "v1.0",
      whyItMatters: "Provides the oldest verified sample of single lobed paisley pattern in central Kashmir, validating early nineteenth-century loom designs.",
      technicalAnalysis: {
        technique: "Kani Weaving",
        skillLevel: "Master Weaver",
        productionTime: "24 Months",
        toolComplexity: "High",
        sequence: "Warp preparation -> Bobbin loading -> Weaving",
        characteristics: "Single lobed paisley motif",
        variations: "Paisley height adjustments",
        standards: "Dogra court standards",
        qualityIndicators: "Extremely dense weave structure"
      },
      evaluation: [
        { label: "Historical Significance", stars: "★★★★★", justification: "Oldest verified single lobed paisley." }
      ],
      conservation: {
        condition: "Fragile",
        environmental: "Strictly climate controlled"
      },
      essay: {
        historicalBackground: "Discovered in the Maharaja palace registers in 2021.",
        artisticInterpretation: "Early court floral paisley design."
      },
      relatedDoc: "Doc-KHCRF-2026-05",
      relatedHistory: "KHCRF-OH-2026-001",
      relatedDemo: "KHCRF-CD-2026-003",
      relatedCollection: "KHCRF-COL-2026-001"
    },
    {
      slug: "sm-lifetime-copper",
      title: "A Lifetime in Copper",
      subtitle: "Master Artisan's Final Signed Work",
      desc: "A ceremonial tea platter hand chased with dense floral details, signed by master coppersmith Abdul Rehman.",
      accessionId: "KHCRF-SM-2026-012",
      year: "Late 20th Century",
      craft: "Copperware",
      technique: "Hand Chasing & Engraving",
      artisan: "Abdul Rehman",
      workshop: "Zaina Kadal Copper Workshop",
      district: "Srinagar",
      material: "Copper",
      dimensions: "70 x 70 cm",
      location: "KHCRF Vault C",
      recognition: "Legacy Achievement",
      version: "v1.0",
      whyItMatters: "Designation awarded for the inclusion of the master's personal signature script in Persian letters within the floral borders.",
      technicalAnalysis: {
        technique: "Kandkari engraving",
        skillLevel: "Master Artisan",
        productionTime: "8 Months",
        toolComplexity: "High",
        sequence: "Trimming -> Surface layout -> Engraving -> Border chasing -> Tin lining",
        characteristics: "Persian signature script border",
        variations: "Central motif sizes",
        standards: "Kandkari high detail standards",
        qualityIndicators: "Perfect circular symmetry"
      },
      evaluation: [
        { label: "Legacy Achievement", stars: "★★★★★", justification: "Carries master's personal Persian signature." }
      ],
      conservation: {
        condition: "Excellent",
        environmental: "Protected from humidity"
      },
      essay: {
        historicalBackground: "Engraved over a period of 8 months as the artisan's final tribute.",
        artisticInterpretation: "Dense floral grids depicting eternal life."
      },
      relatedDoc: "Doc-KHCRF-2026-12",
      relatedHistory: "KHCRF-OH-2026-012",
      relatedDemo: "KHCRF-CD-2026-009",
      relatedCollection: "KHCRF-COL-2026-006"
    }
  ]);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCraft, setSelectedCraft] = useState('All');
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedPeriod, setSelectedPeriod] = useState('All');
  const [selectedRecognition, setSelectedRecognition] = useState('All');
  const [selectedProvenance, setSelectedProvenance] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Featured');

  const [activeItem, setActiveItem] = useState<any>(null);
  const [activeModalTab, setActiveModalTab] = useState<'overview' | 'essay' | 'why' | 'technical' | 'evaluation' | 'conservation' | 'relations'>('overview');
  const [currentView, setCurrentView] = useState<'gallery' | 'catalogue' | 'comparison'>('gallery');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredMasterpieces = allMasterpieces.filter(m => {
    // Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const text = `${m.title} ${m.subtitle || ''} ${m.desc} ${m.craft} ${m.artisan} ${m.accessionId} ${m.material} ${m.district} ${m.year} ${m.recognition}`.toLowerCase();
      if (!text.includes(q)) return false;
    }
    // Craft
    if (selectedCraft !== 'All') {
      if (m.craft !== selectedCraft) return false;
    }
    // Material
    if (selectedMaterial !== 'All') {
      if (m.material !== selectedMaterial) return false;
    }
    // District
    if (selectedDistrict !== 'All') {
      if (m.district !== selectedDistrict) return false;
    }
    // Period
    if (selectedPeriod !== 'All') {
      if (m.year !== selectedPeriod) return false;
    }
    // Recognition Basis
    if (selectedRecognition !== 'All') {
      if (m.recognition !== selectedRecognition) return false;
    }
    return true;
  });

  // Sorting
  const sortedMasterpieces = [...filteredMasterpieces].sort((a, b) => {
    if (selectedSort === 'Curator\'s Selection') {
      return a.accessionId.localeCompare(b.accessionId);
    }
    if (selectedSort === 'Recently Added') {
      return b.accessionId.localeCompare(a.accessionId);
    }
    if (selectedSort === 'Historical Period') {
      return a.year.localeCompare(b.year);
    }
    if (selectedSort === 'Craft') {
      return a.craft.localeCompare(b.craft);
    }
    if (selectedSort === 'Alphabetical') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedMasterpieces.length / itemsPerPage);
  const paginatedMasterpieces = sortedMasterpieces.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pb-24 animate-fadeIn">
      
      {/* Detailed Modal Registry Sheet */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#3E2723]/40 backdrop-blur-sm" onClick={() => setActiveItem(null)}></div>
          <div className="relative z-10 bg-[#FAF9F6] border-2 border-[#3E2723] max-w-3xl w-full p-6 md:p-8 shadow-2xl text-[#2A2A2A] max-h-[95vh] overflow-y-auto custom-scrollbar font-mono rounded-xs" role="dialog" aria-modal="true">
            <button onClick={() => setActiveItem(null)} className="absolute top-4 right-4 text-[#3E2723]/50 hover:text-[#3E2723] text-xl font-bold font-mono">&times;</button>
            
            <div className="text-center mb-6 border-b border-[#3E2723]/25 pb-4">
              <span className="text-[#D4AF37] font-mono text-xs uppercase tracking-widest block mb-1 font-bold font-mono font-mono font-mono font-mono font-mono font-mono">KHCRF SCHOLARLY MASTERPIECE INDEX</span>
              <h2 className="text-xl md:text-2xl font-serif text-[#3E2723] font-bold leading-tight">{activeItem.title}</h2>
              {activeItem.subtitle && <p className="text-gray-500 text-xs italic font-serif mt-1">{activeItem.subtitle}</p>}
              
              <div className="flex flex-wrap justify-center gap-2 mt-3 font-mono text-[9px] uppercase tracking-wider text-gray-500 font-mono">
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">RECORD: {activeItem.accessionId}</span>
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">CRAFT: {activeItem.craft}</span>
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">RECOGNITION: {activeItem.recognition}</span>
              </div>
            </div>

            {/* Modal Tabs navigation */}
            <div className="flex flex-wrap gap-1 border-b border-[#3E2723]/20 pb-3 mb-6 text-[10px] font-mono justify-center">
              {[
                { id: 'overview', label: 'Masterpiece Overview' },
                { id: 'why', label: 'Why This Matters' },
                { id: 'essay', label: 'Scholarly Essay' },
                { id: 'technical', label: 'Technical Analysis' },
                { id: 'evaluation', label: 'Evaluation Matrix' },
                { id: 'conservation', label: 'Conservation Profile' },
                { id: 'relations', label: 'Related Knowledge' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveModalTab(tab.id as any)}
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
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2 font-mono">Object Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div><span className="text-gray-400">MASTERPIECE TITLE:</span> {activeItem.title}</div>
                      <div><span className="text-gray-400">SUBTITLE          :</span> {activeItem.subtitle}</div>
                      <div><span className="text-gray-400">RECORD NUMBER     :</span> {activeItem.accessionId}</div>
                      <div><span className="text-gray-400">CRAFT TYPE        :</span> {activeItem.craft}</div>
                      <div><span className="text-gray-400">TECHNIQUE USED    :</span> {activeItem.technique}</div>
                    </div>
                    <div className="space-y-1">
                      <div><span className="text-gray-400">MASTER ARTISAN    :</span> {activeItem.artisan}</div>
                      <div><span className="text-gray-400">WORKSHOP SOURCE   :</span> {activeItem.workshop}</div>
                      <div><span className="text-gray-400">DISTRICT GEOGRAPHY:</span> {activeItem.district}</div>
                      <div><span className="text-gray-400">HISTORICAL PERIOD :</span> {activeItem.year}</div>
                      <div><span className="text-gray-400">PRIMARY MATERIAL  :</span> {activeItem.material}</div>
                      <div><span className="text-gray-400">DIMENSIONS MEASURE:</span> {activeItem.dimensions}</div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div><span className="text-gray-400">CURRENT VAULT LOCATION:</span> {activeItem.location || "KHCRF Main Vault"}</div>
                    <div><span className="text-gray-400">RECOGNITION BASIS     :</span> {activeItem.recognition}</div>
                    <div><span className="text-gray-400">PUBLICATION VERSION   :</span> {activeItem.version || "v1.0"}</div>
                  </div>
                </div>
              )}

              {/* TAB 2: WHY THIS MATTERS */}
              {activeModalTab === 'why' && (
                <div className="space-y-4 font-sans text-gray-700 bg-amber-50/20 p-4 border border-amber-200/50">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase font-mono border-b border-[#3E2723]/10 pb-1 mb-2">Why This Matters</h3>
                  <p className="leading-relaxed font-sans">{activeItem.whyItMatters || "Earned its designation through extraordinary technical execution, design complexity, and material authenticity."}</p>
                </div>
              )}

              {/* TAB 3: SCHOLARLY ESSAY */}
              {activeModalTab === 'essay' && (
                <div className="space-y-4 font-sans text-gray-650">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase font-mono border-b border-[#3E2723]/10 pb-1 mb-2">Curatorial Interpretive Essay</h3>
                  <p className="leading-relaxed font-sans">
                    {activeItem.essay?.historicalBackground || "Historical background and artistic context is under publication review."}
                  </p>
                  <p className="leading-relaxed font-sans">
                    {activeItem.essay?.artisticInterpretation || ""}
                  </p>
                  <div className="bg-[#FAF9F6] border border-gray-200 p-4 font-mono text-[10px] space-y-1.5 mt-4">
                    <div><span className="text-gray-400">WORKSHOP CONTEXT:</span> {activeItem.essay?.workshopContext || "Standard guild workshop"}</div>
                    <div><span className="text-gray-400">TECHNICAL INNOVATION:</span> {activeItem.essay?.technicalInnovation || "None"}</div>
                    <div><span className="text-gray-400">CULTURAL MEANING:</span> {activeItem.essay?.culturalMeaning || "Traditional Sufi motif roots"}</div>
                    <div><span className="text-gray-400">COMPARATIVE ANALYSIS:</span> {activeItem.essay?.comparativeAnalysis || "N/A"}</div>
                    {activeItem.essay?.influence && (
                      <div><span className="text-gray-400">INFLUENCE ON PRACTICE:</span> {activeItem.essay.influence}</div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: TECHNICAL ANALYSIS */}
              {activeModalTab === 'technical' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Structured Technical Assessment</h3>
                  {activeItem.technicalAnalysis ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 pr-2 border-r border-gray-150">
                        <div><span className="text-gray-400 font-bold block text-[8px]">TECHNIQUE</span> {activeItem.technicalAnalysis.technique}</div>
                        <div><span className="text-gray-400 font-bold block text-[8px]">ESTIMATED SKILL LEVEL</span> {activeItem.technicalAnalysis.skillLevel}</div>
                        <div><span className="text-gray-400 font-bold block text-[8px]">PRODUCTION TIME</span> {activeItem.technicalAnalysis.productionTime}</div>
                        <div><span className="text-gray-400 font-bold block text-[8px]">TOOL COMPLEXITY</span> {activeItem.technicalAnalysis.toolComplexity}</div>
                      </div>
                      <div className="space-y-2">
                        <div><span className="text-gray-400 font-bold block text-[8px]">CONSTRUCTION SEQUENCE</span> {activeItem.technicalAnalysis.sequence}</div>
                        <div><span className="text-gray-400 font-bold block text-[8px]">DISTINCTIVE CHARACTERISTICS</span> {activeItem.technicalAnalysis.characteristics}</div>
                        <div><span className="text-gray-400 font-bold block text-[8px]">KNOWN VARIATIONS</span> {activeItem.technicalAnalysis.variations}</div>
                        <div><span className="text-gray-400 font-bold block text-[8px]">WORKSHOP STANDARDS</span> {activeItem.technicalAnalysis.standards}</div>
                        <div><span className="text-gray-400 font-bold block text-[8px]">QUALITY INDICATORS</span> {activeItem.technicalAnalysis.qualityIndicators}</div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">Technical analysis records are restricted. Index numbers available.</p>
                  )}
                </div>
              )}

              {/* TAB 5: EVALUATION MATRIX */}
              {activeModalTab === 'evaluation' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Scholarly Evaluation Matrix</h3>
                  
                  <div className="space-y-3">
                    {activeItem.evaluation?.map((ev: any, idx: number) => (
                      <div key={idx} className="border-b border-gray-150 pb-2">
                        <div className="flex justify-between items-center font-bold mb-1">
                          <span className="text-[#3E2723]">{ev.label}</span>
                          <span className="text-[#D4AF37] font-bold text-sm tracking-widest">{ev.stars}</span>
                        </div>
                        <p className="text-gray-600 font-sans text-xs">{ev.justification}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: CONSERVATION PROFILE */}
              {activeModalTab === 'conservation' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Conservation Profile Sheet</h3>
                  
                  {activeItem.conservation ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 pr-2 border-r border-gray-150">
                        <div><span className="text-gray-400 font-bold block text-[8px]">CURRENT CONDITION</span> {activeItem.conservation.condition}</div>
                        <div><span className="text-gray-400 font-bold block text-[8px]">PAST CONSERVATION</span> {activeItem.conservation.pastConservation || "None logged"}</div>
                        <div><span className="text-gray-400 font-bold block text-[8px]">ENVIRONMENTAL RISKS</span> {activeItem.conservation.risks}</div>
                      </div>
                      <div className="space-y-2">
                        <div><span className="text-gray-400 font-bold block text-[8px]">HANDLING GUIDANCE</span> {activeItem.conservation.handling}</div>
                        <div><span className="text-gray-400 font-bold block text-[8px]">MONITORING HISTORY</span> {activeItem.conservation.monitoring || "Semi-annual inspections"}</div>
                        <div><span className="text-gray-400 font-bold block text-[8px]">RECOMMENDED STORAGE</span> {activeItem.conservation.storage}</div>
                        <div><span className="text-gray-400 font-bold block text-[8px]">ENVIRONMENTAL REQUIREMENTS</span> {activeItem.conservation.environmental}</div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">Conservation reports are currently private.</p>
                  )}
                </div>
              )}

              {/* TAB 7: RELATED KNOWLEDGE */}
              {activeModalTab === 'relations' && (
                <div className="space-y-4 font-mono text-[11px] space-y-4">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Knowledge Graph Connections</h3>
                  <div className="bg-white border border-gray-200 p-4 space-y-1.5 text-[10px]">
                    <div><span className="text-gray-400">CITATION           :</span> KHCRF Signature Masterpieces Archive, Record {activeItem.accessionId}. Retrieved 2026.</div>
                    <div><span className="text-gray-400">RELATED ORAL HISTORY:</span> {activeItem.relatedHistory}</div>
                    <div><span className="text-gray-400">RELATED DOCUMENTARY :</span> {activeItem.relatedDoc}</div>
                    <div><span className="text-gray-400">RELATED DEMONSTRATION:</span> {activeItem.relatedDemo}</div>
                    <div><span className="text-gray-400">RELATED COLLECTION  :</span> {activeItem.relatedCollection}</div>
                    <div><span className="text-gray-400">BIBLIOGRAPHY        :</span> {activeItem.bibliography || "Under curation review"}</div>
                    <div><span className="text-gray-400">CITATION DETAILS    :</span> {activeItem.citation || "KHCRF Registry"}</div>
                    <div><span className="text-gray-400">RIGHTS & PERMISSIONS:</span> {activeItem.rights || "Copyright KHCRF Preservation Trust"}</div>
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
                <button onClick={() => setActiveItem(null)} className="border border-[#3E2723] hover:bg-[#3E2723]/5 text-[#3E2723] px-6 py-3 uppercase tracking-wider text-xs transition-colors font-light font-mono font-mono font-mono font-mono">
                  Return to Archive
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Hero section */}
      <UniversalEditorialHero pageKey="signature-masterpieces" fallbackConfig={signatureMasterpiecesHeroFallback as any} />

      <div className="container-fluid mx-auto px-4 md:px-10 py-12 max-w-7xl animate-fadeIn">
        
        {/* Scholarly Statement */}
        <div className="bg-[#3E2723]/5 border-l-4 border-[#3E2723] p-8 mb-12 rounded-r-xs max-w-5xl">
          <p className="text-gray-700 text-base md:text-lg leading-relaxed font-serif">
            This is <strong>not</strong> a gallery of expensive objects. It is <strong>KHCRF's Hall of Excellence</strong>—a rigorously curated archive of works that demonstrate extraordinary artistic vision, technical mastery, cultural significance, historical importance, or innovation within traditional practice. These are the objects future generations should study.
          </p>
          <p className="text-gray-755 text-xs mt-3 uppercase tracking-widest font-bold font-mono">
            Signature Masterpieces celebrates the finest examples of Kashmir's craft heritage. Each object included in this archive has been selected through rigorous curatorial evaluation based on craftsmanship, authenticity, originality, technical complexity, historical importance, cultural meaning, artistic achievement, and documentary value. Rather than highlighting commercial value or rarity alone, the archive recognizes works that embody the highest traditions of making—objects that define excellence within their craft and contribute meaningfully to Kashmir's cultural legacy.
          </p>
          <div className="flex flex-wrap gap-4 mt-6 font-mono text-xs">
            <a href="#results" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-5 py-2.5 font-bold uppercase tracking-wider transition-all">
              Explore Masterpieces
            </a>
            <a href="#suggest" className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-5 py-2.5 font-bold uppercase tracking-wider transition-all">
              Nominate a Masterpiece
            </a>
            <a href="#methodology" className="text-[#3E2723] hover:underline font-bold py-2.5">
              Masterpiece Evaluation Framework &rarr;
            </a>
          </div>
        </div>

        {/* Featured Masterpiece */}
        <section className="bg-white border-4 border-[#3E2723] p-8 md:p-10 mb-16 relative shadow-md">
          <div className="absolute top-0 right-0 bg-[#3E2723] text-[#D4AF37] px-4 py-1 text-[10px] font-mono font-bold uppercase tracking-widest font-mono">
            SIGNATURE MASTERPIECE
          </div>
          
          <div className="max-w-4xl font-mono">
            <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-1">
              Masterpiece Record: KHCRF-SM-2026-001
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3E2723] leading-tight mb-2">
              The Shah Hamadan Carpet
            </h2>
            <h3 className="text-base md:text-lg font-serif italic text-gray-500 mb-4">
              Monumental Hand-Knotted Carpet Demonstrating Classical Kashmiri Talim Excellence
            </h3>
            
            <p className="text-gray-700 text-sm leading-relaxed mb-6 font-sans text-gray-655">
              This exceptional carpet represents one of the finest surviving examples of traditional Kashmiri hand-knotting. Distinguished by its remarkable knot density, balanced proportions, refined talim interpretation, harmonious colour composition, and exceptional finishing, it illustrates the mature craftsmanship achieved through generations of specialised workshop knowledge. The work demonstrates how technical discipline, artistic judgement, and collaborative workshop practice converge in a single object of enduring cultural significance.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 font-mono text-[10px] border-t border-b border-gray-250 py-3 bg-gray-55 px-4">
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Type</span>
                <span className="font-bold text-[#3E2723]">Hand-Knotted Carpet</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Source</span>
                <span className="font-bold text-[#3E2723]">Master Artisan Workshop</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Historical Date</span>
                <span className="font-bold text-[#3E2723]">Late 20th Century</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Assessments</span>
                <span className="font-bold text-[#D4AF37] font-bold">Research Essay &amp; Technical Analysis</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => { setActiveItem(allMasterpieces[0]); setActiveModalTab('overview'); }}
                className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-all font-mono"
              >
                Study This Masterpiece &rarr;
              </button>
            </div>
          </div>
        </section>

        {/* Why Signature Masterpieces Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start mt-12">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-serif text-[#3E2723] mb-6 font-bold">What Makes a Masterpiece?</h2>
            <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans">
              A masterpiece is not simply an old object, an expensive object, or a beautifully decorated object. Within KHCRF, a Signature Masterpiece is recognised because it demonstrates exceptional achievement in one or more areas.
            </p>
            <p className="text-gray-605 text-sm leading-relaxed font-sans">
              Every inclusion requires careful research and evidence rather than reputation alone.
            </p>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#3E2723]/10 p-8 rounded-xs shadow-xs">
            <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 font-mono">
              Inclusion Evaluation Criteria:
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700 font-sans font-mono">
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>extraordinary technical execution</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>artistic originality</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>preservation of traditional knowledge</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>cultural significance</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>historical importance</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>excellence in design</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>material mastery</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>innovation rooted in tradition</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>influence on later generations</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>outstanding documentary value</li>
            </ul>
          </div>
        </section>

        {/* Archive Overview Dashboard */}
        <section className="bg-[#3E2723] text-white p-8 md:p-10 mb-12 rounded-xs relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#3E2723] px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-widest">
            Registry Overview
          </div>
          <div className="mb-8 font-mono">
            <h3 className="font-serif text-2xl text-[#D4AF37] mb-2 font-bold font-serif">Signature Masterpieces Registry</h3>
            <p className="text-white/60 text-xs">
              ACADEMIC HALL OF EXCELLENCE CERTIFIED METRIC SYSTEM
            </p>
          </div>

          {/* Primary Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 text-center md:text-left border-b border-white/10 pb-8 mb-8">
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Masterpieces</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">128</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Artisans</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">82</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Craft Traditions</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">12</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono font-mono">Periods</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">6</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Essays</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">128</span>
            </div>
            <div className="last:border-0">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Analyses</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">128</span>
            </div>
          </div>

          {/* Secondary Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 text-center md:text-left font-mono">
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Historical Works</span>
              <span className="text-xl font-serif font-semibold text-white/80 font-mono">46</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Living Masterpieces</span>
              <span className="text-xl font-serif font-semibold text-white/80">58</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono font-mono">Museum Collabs</span>
              <span className="text-xl font-serif font-semibold text-white/80 font-mono">17</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Family Collections</span>
              <span className="text-xl font-serif font-semibold text-white/80">22</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Conservation Assess</span>
              <span className="text-xl font-serif font-semibold text-white/80">121</span>
            </div>
            <div className="last:border-0">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Digitally Preserved</span>
              <span className="text-lg font-serif font-semibold text-[#D4AF37] block leading-tight font-mono">128</span>
            </div>
          </div>
        </section>

        {/* View Switcher Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 bg-[#FAF9F6] border border-[#3E2723]/10 p-4 font-mono" id="results">
          <div className="text-xs font-serif text-[#3E2723]">
            KHCRF Signature Masterpieces Registry &bull; Showing {sortedMasterpieces.length} Verified Masterworks
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] text-gray-400 uppercase self-center mr-2 font-mono">Archive Layout View:</span>
            <button 
              onClick={() => { setCurrentView('gallery'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'gallery' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-550 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Editorial Gallery
            </button>
            <button 
              onClick={() => { setCurrentView('catalogue'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'catalogue' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Research Catalogue
            </button>
            <button 
              onClick={() => { setCurrentView('comparison'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'comparison' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Comparative Study
            </button>
          </div>
        </div>

        {/* Search and Discovery Layout */}
        <section className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4 bg-white border border-[#3E2723]/10 p-6 shadow-xs sticky top-4 z-10 font-sans">
            <h3 className="font-serif text-lg text-[#3E2723] mb-6 pb-2 border-b border-gray-100 flex items-center justify-between font-bold">
              <span>Filter Masterpieces</span>
              <button 
                onClick={() => {
                  setSelectedCraft('All');
                  setSelectedMaterial('All');
                  setSelectedDistrict('All');
                  setSelectedPeriod('All');
                  setSelectedRecognition('All');
                  setSelectedProvenance('All');
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

            <div className="space-y-6">
              {/* Search Field */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Search Masterworks</label>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="Search masterpieces by artisan, craft, motif, technique, material, district, period, or keyword..."
                  className="w-full border border-gray-200 px-3 py-2 text-xs rounded-none bg-[#FAF9F6] text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                />
              </div>

              {/* Craft Tradition select */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Craft Tradition</label>
                <select 
                  value={selectedCraft}
                  onChange={(e) => { setSelectedCraft(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All">All Crafts</option>
                  <option value="Carpet">Carpet</option>
                  <option value="Pashmina">Pashmina</option>
                  <option value="Kani">Kani</option>
                  <option value="Sozni">Sozni</option>
                  <option value="Crewel">Crewel</option>
                  <option value="Papier-Mâché">Papier-Mâché</option>
                  <option value="Walnut Wood">Walnut Wood</option>
                  <option value="Copperware">Copperware</option>
                  <option value="Willow Wicker">Willow Wicker</option>
                  <option value="Chain Stitch">Chain Stitch</option>
                </select>
              </div>

              {/* Recognition Basis */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Recognition Basis</label>
                <select 
                  value={selectedRecognition}
                  onChange={(e) => { setSelectedRecognition(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All">All Criteria</option>
                  <option value="Technical Excellence">Technical Excellence</option>
                  <option value="Artistic Innovation">Artistic Innovation</option>
                  <option value="Historical Importance">Historical Importance</option>
                  <option value="Cultural Significance">Cultural Significance</option>
                  <option value="Material Excellence">Material Excellence</option>
                  <option value="Conservation Landmark">Conservation Landmark</option>
                  <option value="Design Innovation">Design Innovation</option>
                  <option value="Master Artisan Legacy">Master Artisan Legacy</option>
                  <option value="Legacy Achievement">Legacy Achievement</option>
                  <option value="Living Masterpiece">Living Masterpiece</option>
                </select>
              </div>

              {/* Historical Period */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono font-mono">Historical Period</label>
                <select 
                  value={selectedPeriod}
                  onChange={(e) => { setSelectedPeriod(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All">All Periods</option>
                  <option value="Contemporary">Contemporary</option>
                  <option value="Late 20th Century">Late 20th Century</option>
                  <option value="Mid 20th Century">Mid 20th Century</option>
                  <option value="Early 20th Century">Early 20th Century</option>
                  <option value="19th Century">19th Century</option>
                  <option value="Earlier">Earlier</option>
                </select>
              </div>

              {/* Material */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Primary Material</label>
                <select 
                  value={selectedMaterial}
                  onChange={(e) => { setSelectedMaterial(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All">All Materials</option>
                  <option value="Wool">Wool</option>
                  <option value="Silk">Silk</option>
                  <option value="Pashmina">Pashmina</option>
                  <option value="Walnut">Walnut</option>
                  <option value="Copper">Copper</option>
                  <option value="Papier-Mâché">Papier-Mâché</option>
                  <option value="Mixed Materials">Mixed Materials</option>
                </select>
              </div>

              {/* Provenance */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono font-mono">Provenance Source</label>
                <select 
                  value={selectedProvenance}
                  onChange={(e) => { setSelectedProvenance(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All">All Provenance</option>
                  <option value="Family Collection">Family Collection</option>
                  <option value="Museum">Museum</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Institutional">Institutional</option>
                  <option value="Private Collection">Private Collection</option>
                  <option value="KHCRF Documentation">KHCRF Documentation</option>
                </select>
              </div>

              {/* Documentation Status */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono font-mono">Documentation Status</label>
                <select 
                  value={selectedStatus}
                  onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Fully Documented">Fully Documented</option>
                  <option value="Provenance Under Research">Provenance Under Research</option>
                  <option value="Conservation Reviewed">Conservation Reviewed</option>
                  <option value="Technical Review Complete">Technical Review Complete</option>
                  <option value="Archive Preview">Archive Preview</option>
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
                  <option value="Curator's Selection">Curator's Selection</option>
                  <option value="Recently Added">Recently Added</option>
                  <option value="Historical Period">Historical Period</option>
                  <option value="Craft">Craft</option>
                  <option value="Alphabetical">Alphabetical</option>
                </select>
              </div>

            </div>
          </div>

          {/* Results Area */}
          <div className="w-full lg:w-3/4">

            {loading ? (
              <div className="py-20 text-center text-gray-505 font-serif">Loading masterpieces...</div>
            ) : (
              <>
                {/* 1. EDITORIAL GALLERY VIEW */}
                {currentView === 'gallery' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                    {paginatedMasterpieces.map((m, i) => (
                      <div 
                        key={i} 
                        className="bg-white border-2 border-[#3E2723]/35 py-8 px-6 hover:bg-[#3E2723]/5 transition-all duration-300 group flex flex-col justify-between shadow-sm relative grid-ledger font-mono"
                      >
                        <div>
                          {/* Accession ID & Year header */}
                          <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5 font-semibold">
                            <span>{m.accessionId}</span>
                            <span>{m.year}</span>
                          </div>

                          {/* Tech craft label */}
                          <div className="text-[9px] font-mono text-[#D4AF37] font-bold uppercase tracking-widest mb-4">
                            SIGNATURE MASTERPIECE &bull; {m.craft.toUpperCase()}
                          </div>

                          {/* Title */}
                          <h3 
                            onClick={() => { setActiveItem(m); setActiveModalTab('overview'); }}
                            className="text-xl md:text-2xl font-serif font-bold text-[#3E2723] leading-snug cursor-pointer group-hover:text-[#D4AF37] transition-colors"
                          >
                            {m.title}
                          </h3>

                          {m.subtitle && (
                            <h4 className="text-xs font-serif italic text-gray-500 mt-1 leading-snug mb-3">
                              {m.subtitle}
                            </h4>
                          )}

                          <p className="text-gray-655 text-xs leading-relaxed mb-4 font-sans line-clamp-3 mt-3">
                            {m.desc}
                          </p>

                          {/* Recognition Badge */}
                          <div className="relative pl-4 mb-4 border-l-2 border-[#D4AF37]/50 font-mono text-[10px] leading-relaxed my-4">
                            <span className="text-[9px] text-gray-400 uppercase tracking-wider block mb-1">
                              RECOGNITION BASIS
                            </span>
                            <span className="font-bold text-[#3E2723]">
                              {m.recognition}
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="text-[#3E2723]/25 text-[9px] font-mono mb-3 select-none">
                            ─────╱╲──╱────╲╱─────
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto font-mono">
                            <span className="text-[#3949AB] text-[9px] font-bold uppercase tracking-wider">
                              {m.artisan}
                            </span>
                            
                            <button 
                              onClick={() => { setActiveItem(m); setActiveModalTab('overview'); }}
                              className="text-xs font-bold uppercase tracking-widest text-[#3E2723] hover:text-[#D4AF37] transition-colors font-mono"
                            >
                              Study Masterpiece &rarr;
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

                {/* 2. RESEARCH CATALOGUE VIEW */}
                {currentView === 'catalogue' && (
                  <div className="bg-white border border-[#3E2723]/10 overflow-x-auto shadow-sm animate-fadeIn">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#3E2723] text-[#D4AF37] font-mono uppercase tracking-wider text-[10px]">
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Masterpiece No</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Title & Subtitle</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Craft</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Artisan</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Period</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Material</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Recognition</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center font-mono">Location</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#3E2723]/10 font-sans text-gray-700">
                        {paginatedMasterpieces.map((m, i) => (
                          <tr key={i} className="hover:bg-[#FAF9F6] transition-colors cursor-pointer" onClick={() => { setActiveItem(m); setActiveModalTab('overview'); }}>
                            <td className="p-4 font-mono font-bold text-gray-500 whitespace-nowrap">{m.accessionId}</td>
                            <td className="p-4">
                              <div className="font-serif font-bold text-[#3E2723] text-sm hover:text-[#D4AF37] transition-colors">{m.title}</div>
                              <div className="text-[10px] text-gray-400 font-light truncate max-w-xs">{m.subtitle}</div>
                            </td>
                            <td className="p-4 whitespace-nowrap">{m.craft}</td>
                            <td className="p-4 whitespace-nowrap font-bold">{m.artisan}</td>
                            <td className="p-4 whitespace-nowrap">{m.year}</td>
                            <td className="p-4 whitespace-nowrap">{m.material}</td>
                            <td className="p-4 whitespace-nowrap font-bold text-[#D4AF37]">{m.recognition}</td>
                            <td className="p-4 text-center whitespace-nowrap font-mono">{m.location || "KHCRF Vault"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 3. COMPARATIVE STUDY VIEW */}
                {currentView === 'comparison' && (
                  <div className="space-y-6 animate-fadeIn font-mono text-xs">
                    <div className="bg-[#3E2723]/5 p-4 border border-[#3E2723]/10 text-gray-700 leading-relaxed font-sans text-xs">
                      <strong>Compare this carpet with three other late twentieth-century masterpieces from different workshops to understand variations in talim interpretation and border composition.</strong>
                    </div>

                    {paginatedMasterpieces.map((m, i) => (
                      <div key={i} className="bg-white border border-[#3E2723]/15 p-6 shadow-xs relative">
                        <div className="absolute top-4 right-4 text-gray-300 font-bold font-mono text-sm">{m.accessionId}</div>
                        <h4 className="text-[#3E2723] font-serif text-lg font-bold mb-1">{m.title}</h4>
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-3">Recognition: {m.recognition}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] bg-gray-50 p-4 border border-gray-200 font-mono">
                          <div>
                            <div><strong className="text-gray-400 uppercase text-[8px] block">Knot / Stitch Density:</strong> {m.technicalAnalysis?.standards || "Standard Density limits"}</div>
                            <div><strong className="text-gray-400 uppercase text-[8px] block">Carving Depth:</strong> {m.technicalAnalysis?.characteristics || "Standard cuts"}</div>
                            <div><strong className="text-gray-400 uppercase text-[8px] block">Colour Palette:</strong> {m.material} dyes</div>
                          </div>
                          <div>
                            <div><strong className="text-gray-400 uppercase text-[8px] block">Border Evolution:</strong> {m.essay?.comparativeAnalysis || "Traditional borders"}</div>
                            <div><strong className="text-gray-400 uppercase text-[8px] block">Finishing Quality:</strong> {m.technicalAnalysis?.qualityIndicators || "Standard finished level"}</div>
                            <div><strong className="text-gray-400 uppercase text-[8px] block">Conservation State:</strong> {m.conservation?.condition || "Excellent"}</div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[9px] text-gray-400 uppercase mt-4 pt-3 border-t border-gray-100">
                          <span>Maker: {m.artisan}</span>
                          <button 
                            onClick={() => { setActiveItem(m); setActiveModalTab('essay'); }}
                            className="text-[#3E2723] hover:underline font-bold"
                          >
                            Open Scholarly Analysis &rarr;
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
                  className="w-10 h-10 border border-gray-300 flex items-center justify-center text-gray-550 hover:border-[#3E2723] hover:text-[#3E2723] disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-mono"
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

        {/* Curation Methodology Section */}
        <section className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs mt-16" id="methodology">
          <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold">
            How KHCRF Identifies Signature Masterpieces
          </h2>
          <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans">
            Signature Masterpieces are selected through documented research rather than reputation or market value. Each candidate undergoes technical evaluation, provenance research, comparative analysis, curatorial review, and scholarly documentation before inclusion in the archive.
          </p>

          <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 font-mono">
            Curation Workflow
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-gray-700 font-mono">
            {[
              { id: "01", name: "Nomination / identification", desc: "Sourcing candidate works from guilds, family workshops, or collections." },
              { id: "02", name: "Preliminary eligibility", desc: "Screening against traditional authenticity standards." },
              { id: "03", name: "Provenance investigation", desc: "Auditing ownership lineage history registers." },
              { id: "04", name: "Technical examination", desc: "Measuring thread count, dye stability, or chisel marks." },
              { id: "05", name: "Comparative assessment", desc: "Comparing attributes against documented reference works." },
              { id: "06", name: "Curatorial evaluation", desc: "Rigorous review panel scoring against criteria matrix." },
              { id: "07", name: "Conservation review", desc: "Determining conditioning state and storage rules." },
              { id: "08", name: "Metadata preparation", desc: "Cataloging records under unique accession numbers." },
              { id: "09", name: "Scholarly interpretation", desc: "Drafting interpretive essays and comparative studies." },
              { id: "10", name: "Editorial approval", desc: "Obtaining final verification signatures from panels." },
              { id: "11", name: "Publication", desc: "Releasing verified masterpiece log details." },
              { id: "12", name: "Periodic reassessment", desc: "Conducting annual checks to verify conservation health." }
            ].map((step) => (
              <div key={step.id} className="border-l-2 border-[#3E2723] pl-4 py-1 font-mono">
                <span className="font-mono text-[#D4AF37] font-bold block mb-1">STAGE {step.id}</span>
                <span className="font-bold text-[#3E2723] block mb-1">{step.name}</span>
                <span className="text-gray-555 font-sans">{step.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Curation Principles Section */}
        <section className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs mt-12">
          <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold font-serif">
            Evaluation Principles
          </h2>
          <p className="text-gray-655 text-sm leading-relaxed mb-8 max-w-4xl font-sans">
            Masterpiece designation follows principles such as:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-xs text-gray-700 font-sans">
            {[
              "evidence-based assessment",
              "transparent selection criteria",
              "independence from commercial value",
              "respect for ownership and cultural sensitivity",
              "recognition of both historical and living artisans",
              "distinction between confirmed evidence and informed interpretation",
              "periodic review as new research emerges"
            ].map((principle, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>{principle}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Research & Educational Use Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start mt-16 font-sans">
          <div className="lg:col-span-5 font-sans">
            <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold font-serif">
              Research & Educational Use
            </h2>
            <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans text-gray-500">
              The archive supports:
            </p>
            <div className="flex flex-col gap-3 font-mono">
              <button 
                onClick={() => {
                  setActiveItem(allMasterpieces[0]);
                  setActiveModalTab('evaluation');
                }}
                className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors text-center font-mono w-full md:w-auto"
              >
                Request Scholarly Access
              </button>
              <a 
                href="#suggest"
                className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors text-center font-mono w-full md:w-auto block"
              >
                Nominate a Masterpiece
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#FAF9F6] border border-[#3E2723]/10 p-6 md:p-8 font-sans">
            <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 font-mono">
              Approved Academic Frameworks
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4 text-xs text-gray-700 font-sans">
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>advanced craft scholarship</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>museum interpretation</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>conservation training</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>design education</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>provenance research</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>comparative art history</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>heritage management</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>postgraduate teaching</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>exhibition development</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>public engagement with exceptional craftsmanship</li>
            </ul>
          </div>
        </section>

        {/* Nominate a Signature Masterpiece Section */}
        <section className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs mt-12" id="suggest">
          <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold font-serif">
            Nominate a Signature Masterpiece
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-6 font-sans">
            Invite museums, artisan families, workshops, collectors, institutions, and researchers to propose exceptional works for evaluation.
          </p>
          
          <div className="max-w-2xl bg-[#FAF9F6] border border-[#3E2723]/20 p-6 font-mono text-xs space-y-4">
            <h4 className="font-bold text-[#3E2723] uppercase mb-3 text-[10px]">Required Proposal Fields:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-gray-500 font-mono text-[10px]">
              <div>• Object Title</div>
              <div>• Location</div>
              <div>• Maker or Workshop</div>
              <div>• Reason for Nomination</div>
              <div>• Estimated Date</div>
              <div>• Known Provenance</div>
              <div>• Current Owner</div>
              <div>• Supporting Documentation</div>
              <div>• Contact Information</div>
            </div>
            
            <div className="pt-4 border-t border-[#3E2723]/10 mt-4">
              <span className="text-gray-400 block mb-2 font-sans">To submit a nomination proposal, please email our evaluation desk:</span>
              <a href="mailto:masterpieces@khcrf.org" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-2.5 font-bold uppercase tracking-wider text-[10px] inline-block font-mono transition-colors">
                Submit Masterpiece Nomination
              </a>
            </div>
          </div>
        </section>

        {/* Footer Statement Section */}
        <section className="border-t border-[#3E2723]/20 pt-10 text-center max-w-4xl mx-auto mt-16 font-sans">
          <blockquote className="text-gray-700 text-base md:text-lg leading-relaxed font-serif italic mb-4">
            "KHCRF Signature Masterpieces honour the highest achievements of Kashmir's craft traditions by documenting works of exceptional artistic, technical, and cultural significance. Through rigorous research and transparent evaluation, the archive preserves these extraordinary creations as enduring references for scholarship, education, conservation, and future generations."
          </blockquote>
          <p className="text-gray-400 text-xs font-mono uppercase tracking-widest font-bold">
            KHCRF Registry Access Console &bull; Signature Masterpieces Registry Division
          </p>
          <p className="text-[#D4AF37] text-[10px] uppercase font-bold mt-2 tracking-widest font-mono">
            This page represents a scholarly masterpiece registry under development. Access to verified logs and raw records is reserved for supportive members.
          </p>
        </section>

      </div>
    </main>
  );
}
