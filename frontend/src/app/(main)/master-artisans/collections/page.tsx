'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { collectionsHeroFallback } from '@/config/heroFallbacks';

export default function Collections() {
  const [allCollections, setAllCollections] = useState<any[]>([
    {
      slug: "col-language-pashmina",
      title: "The Language of Pashmina",
      subtitle: "Masterpieces of Fibre, Weaving, Embroidery, and Finishing",
      desc: "This collection explores the artistic and technical journey of Kashmir Pashmina through carefully selected examples representing fibre preparation, weaving traditions, embroidery techniques, finishing practices, regional variation, and contemporary interpretation. Rather than documenting a single shawl, the collection demonstrates how generations of artisans have shaped one of Kashmir's most celebrated craft traditions.",
      accessionId: "KHCRF-COL-2026-001",
      year: "2026",
      objectsCount: 46,
      artisansCount: 18,
      essayIncluded: "Yes",
      type: "Heritage Collection",
      craft: "Pashmina",
      period: "Contemporary",
      material: "Pashmina Fibre",
      provenance: "KHCRF Documentation",
      district: "Srinagar",
      status: "Fully Documented",
      img: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop",
      secondaryCrafts: "Spinning, Washing",
      geographicCoverage: "Srinagar, Budgam, Ganderbal",
      curator: "Zehra Malik",
      researchLead: "Dr. S. Farooq",
      publicationDate: "March 2026",
      version: "v1.4 (Version Controlled)",
      historicalContext: "Traces the consolidation of shawl guilds in the late Dogra period to cooperative models post-1947.",
      conservation: {
        condition: "Excellent - Stored in climate-controlled cases",
        risks: "Moisture variation, moth infestation",
        storage: "Acid-free tissue wrapping, cedar chests",
        handling: "Cotton gloves required, flat support lifting",
        environmental: "Temperature 18°C +/- 2°C, Humidity 45% +/- 5%",
        restoration: "Loom borders re-secured in 2024",
        monitoring: "Visual audit scheduled semi-annually"
      },
      objects: [
        { title: "Kani Jamawar Shawl Fragment", number: "OBJ-COL-001-01", craft: "Kani Shawl", technique: "Warp-faced double beam weave", maker: "Unknown Royal Weaver", workshop: "Srinagar Palace Guild", date: "c. 1880", material: "Changthangi Pashm", dimensions: "120 x 80 cm", weight: "180g", condition: "Stable with localized edge fraying", provenance: "Dogra Royal Court inventory", acquisition: "Transferred from state archive in 2021", ownership: "KHCRF Preservation Trust", district: "Srinagar", conservation: "Restricted handling. Humidification chamber treatment completed.", relatedLiterature: "Moorcroft travel logs (1823) page 112.", relatedArtisan: "Mir family weavers lineage" },
        { title: "Sozni Embroidered Dorukha", number: "OBJ-COL-001-02", craft: "Sozni", technique: "Double-sided hand needlework", maker: "Ustad Ghulam Rasool", workshop: "Rasool Atelier", date: "c. 1925", material: "Pashmina and Silk", dimensions: "200 x 140 cm", weight: "320g", condition: "Excellent", provenance: "Private collection, London", acquisition: "Purchased at auction in 2023", ownership: "KHCRF Preservation Trust", district: "Srinagar", conservation: "Acid-free wrapping, flat storage.", relatedLiterature: "Kashmir Crafts Journal #Sozni_Dur", relatedArtisan: "Ghulam Rasool" }
      ],
      comparativeAnalysis: {
        motifEvolution: " Paisley shapes evolved from floral naturalism to geometric patterns over 100 years.",
        borderDesign: "Hashia width decreased from 6 inches to 2 inches to meet Export market tastes.",
        colorPalette: "Vegetable dye colors shifted from local madder red to synthetic blues in the late 20th C.",
        stitchDensity: "Fine Sozni density reached 90 stitches/inch in the central medallion area.",
        knotDensity: "N/A (Embroidery)",
        carvingDepth: "N/A",
        brushwork: "N/A",
        toolMarks: "N/A",
        finishingQuality: "Soft washing with regional soap-nut extract yields superior tactile feel.",
        conservationState: "Stable base fibers with minor color bleeding in water-washed sections."
      },
      timeline: [
        { year: "1850", event: "Workshop Established" },
        { year: "1895", event: "First Known Object" },
        { year: "1932", event: "Second Generation" },
        { year: "1978", event: "Technique Variation" },
        { year: "2006", event: "Documentation Begins" },
        { year: "2026", event: "KHCRF Collection Published" }
      ],
      relatedOralHistories: "KHCRF-OH-2026-001",
      relatedDocFilms: "Doc-KHCRF-2026-05",
      relatedDemonstrations: "KHCRF-CD-2026-002",
      relatedKnowledgeArticles: "GI Tag Preservation"
    },
    {
      slug: "col-hundred-years-carpet",
      title: "One Hundred Years of Carpet Design",
      subtitle: "Changing Motifs Across Four Generations",
      desc: "A chronological assemblage tracking Safavid replicas, local floral adaptations, medallion scaling shifts, and geometric variations from 1920 to the present day.",
      accessionId: "KHCRF-COL-2026-002",
      year: "2026",
      objectsCount: 62,
      artisansCount: 12,
      essayIncluded: "Yes",
      type: "Research Collection",
      craft: "Carpet",
      period: "Mid 20th Century",
      material: "Silk",
      provenance: "Workshop Collection",
      district: "Srinagar",
      status: "Fully Documented",
      img: "https://images.unsplash.com/photo-1606744824163-985d376605aa?w=600&auto=format&fit=crop",
      secondaryCrafts: "Talim writing",
      geographicCoverage: "Srinagar, Budgam",
      curator: "Farooq Mir",
      researchLead: "Dr. K. A. Mir",
      publicationDate: "January 2026",
      version: "v2.1",
      historicalContext: "Documents the survival of carpet weavers through the mid-century trade shifts.",
      conservation: {
        condition: "Good - Rolled on cardboard cores",
        risks: "Weft stretching",
        storage: "Horizontal racks",
        handling: "Two-person support lifting",
        environmental: "Temperature 20°C, Humidity 50%",
        restoration: "Fringe re-binding",
        monitoring: "Annual inspections"
      },
      objects: [],
      comparativeAnalysis: {
        motifEvolution: "Safavid medallion patterns simplified to speed up knotting rates.",
        borderDesign: "Complex borders replaced by thin outer bands.",
        colorPalette: "Introduction of chemical wool dyes changed base colors.",
        stitchDensity: "Knot count stabilized around 400 knots per square inch.",
        knotDensity: "400 KPSI",
        carvingDepth: "N/A",
        brushwork: "N/A",
        toolMarks: "N/A",
        finishingQuality: "Stone washing gives antique look.",
        conservationState: "Warp tension remains stable."
      },
      timeline: [],
      relatedOralHistories: "KHCRF-OH-2026-007",
      relatedDocFilms: "Doc-KHCRF-2026-03",
      relatedDemonstrations: "KHCRF-CD-2026-001",
      relatedKnowledgeArticles: "Wage Structures & Patronage"
    },
    {
      slug: "col-women-needle",
      title: "Women Behind the Needle",
      subtitle: "Sozni Embroidery Across Family Lineages",
      desc: "Documenting domestic home-based embroidery layouts, needle size selections, and geometric border details executed by women artisans in rural districts.",
      accessionId: "KHCRF-COL-2026-003",
      year: "2026",
      objectsCount: 41,
      artisansCount: 22,
      essayIncluded: "Yes",
      type: "Family Collection",
      craft: "Sozni",
      period: "Late 20th Century",
      material: "Silk",
      provenance: "Family Collection",
      district: "Budgam",
      status: "Fully Documented",
      img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop",
      secondaryCrafts: "Yarn spinning",
      geographicCoverage: "Budgam, Pulwama",
      curator: "Zehra Malik",
      researchLead: "Dr. S. Farooq",
      publicationDate: "February 2026",
      version: "v1.0",
      historicalContext: "Mapping women-led household embroidery cells in central valleys.",
      conservation: {
        condition: "Excellent",
        risks: "Thread fading",
        storage: "Dark storage boxes",
        handling: "Cotton gloves",
        environmental: "Low UV exposure",
        restoration: "None",
        monitoring: "Visual reviews"
      },
      objects: [],
      comparativeAnalysis: {
        motifEvolution: "Border patterns simplified to suit modern fashion exports.",
        borderDesign: "Hashia stitch width reduced.",
        colorPalette: "Neutral thread colors preferred over traditional bright tones.",
        stitchDensity: "Needlework density reached 80 stitches per inch.",
        knotDensity: "N/A",
        carvingDepth: "N/A",
        brushwork: "N/A",
        toolMarks: "N/A",
        finishingQuality: "Mild detergent wash preserves fiber texture.",
        conservationState: "Stable thread alignment."
      },
      timeline: [],
      relatedOralHistories: "KHCRF-OH-2026-001",
      relatedDocFilms: "Doc-KHCRF-2026-05",
      relatedDemonstrations: "KHCRF-CD-2026-004",
      relatedKnowledgeArticles: "Socio-Economics of Sozni Workers"
    },
    {
      slug: "col-walnut-relief",
      title: "Walnut in Relief",
      subtitle: "Master Carvers and Their Signature Styles",
      desc: "A comparative layout of shallow, deep, under-cut, and lattice walnut carving panels displaying the signature chisel cuts of Kashmir's living legends.",
      accessionId: "KHCRF-COL-2026-004",
      year: "2026",
      objectsCount: 38,
      artisansCount: 8,
      essayIncluded: "Yes",
      type: "Signature Masterpieces",
      craft: "Walnut Wood",
      period: "Mid 20th Century",
      material: "Walnut Wood",
      provenance: "Institutional Archive",
      district: "Srinagar",
      status: "Fully Documented",
      img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop",
      secondaryCrafts: "Joinery",
      geographicCoverage: "Srinagar, Baramulla",
      curator: "Sajad Dar",
      researchLead: "Dr. N. Jan",
      publicationDate: "April 2026",
      version: "v1.2",
      historicalContext: "Walnut woodcarving guilds and construction carvings in early urban architecture.",
      conservation: {
        condition: "Excellent",
        risks: "Wood cracking, humidity drop",
        storage: "Sealed cases with humidity logs",
        handling: "Supported base lifting",
        environmental: "Humidity 50% +/- 5%",
        restoration: "Wax polish",
        monitoring: "Quarterly inspection"
      },
      objects: [],
      comparativeAnalysis: {
        motifEvolution: "Lattice designs shifted to stylized animal representations.",
        borderDesign: "Double lines replaced simple single cuts.",
        colorPalette: "N/A",
        stitchDensity: "N/A",
        knotDensity: "N/A",
        carvingDepth: "Relief cuts range from 2mm to 8mm deep.",
        brushwork: "N/A",
        toolMarks: "Fine flat chisel sweeps verified on panel backgrounds.",
        finishingQuality: "Sandpaper finishing replaced original straw rubbing.",
        conservationState: "Minimal grain splits."
      },
      timeline: [],
      relatedOralHistories: "KHCRF-OH-2026-003",
      relatedDocFilms: "Doc-KHCRF-2026-04",
      relatedDemonstrations: "KHCRF-CD-2026-008",
      relatedKnowledgeArticles: "Wood Joint Conservation"
    },
    {
      slug: "col-gardens-papier",
      title: "Gardens in Papier-Mâché",
      subtitle: "Floral Traditions in Painted Craft",
      desc: "Detailing Astari plaster structures and natural mineral pigment brushstrokes representing Kashmir's spring gardens on lacquer boxes.",
      accessionId: "KHCRF-COL-2026-005",
      year: "2026",
      objectsCount: 57,
      artisansCount: 14,
      essayIncluded: "Yes",
      type: "Museum Archive",
      craft: "Papier-Mâché",
      period: "Early 20th Century",
      material: "Papier-Mâché",
      provenance: "Museum",
      district: "Srinagar",
      status: "Fully Documented",
      img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop",
      secondaryCrafts: "Lacquering",
      geographicCoverage: "Srinagar (Eidgah)",
      curator: "Farooq Mir",
      researchLead: "Dr. S. A. Shah",
      publicationDate: "June 2026",
      version: "v1.1",
      historicalContext: "Mapping Eidgah painters' guilds and Persian motif roots.",
      conservation: {
        condition: "Excellent",
        risks: "Lacquer yellowing",
        storage: "UV filtered glass cases",
        handling: "Soft gloves only",
        environmental: "Low light levels",
        restoration: "Lacquered topcoat re-cured",
        monitoring: "Annual inspections"
      },
      objects: [],
      comparativeAnalysis: {
        motifEvolution: "Naturalist flower painting shifted to dense paisley borders.",
        borderDesign: "Gold leaf border width increased.",
        colorPalette: "Shifting from wild plant dyes to imported pigments.",
        stitchDensity: "N/A",
        knotDensity: "N/A",
        carvingDepth: "N/A",
        brushwork: "1mm hair brush strokes verified under microscope.",
        toolMarks: "Agate stone rubbing marks visible on pulp interiors.",
        finishingQuality: "Hand burnished lacquer topcoat.",
        conservationState: "Stable plaster base."
      },
      timeline: [],
      relatedOralHistories: "KHCRF-OH-2026-003",
      relatedDocFilms: "Doc-KHCRF-2026-04",
      relatedDemonstrations: "KHCRF-CD-2026-006",
      relatedKnowledgeArticles: "Organic Dye Chemistry"
    },
    {
      slug: "col-copper-fire",
      title: "Copper Through Fire",
      subtitle: "Traditional Metalwork of Kashmir",
      desc: "Chased Traam copper and tin coated samovars displaying classic Kandkari geometries hammered in Old Srinagar workshops.",
      accessionId: "KHCRF-COL-2026-006",
      year: "2026",
      objectsCount: 34,
      artisansCount: 9,
      essayIncluded: "Yes",
      type: "Rare Objects",
      craft: "Copperware",
      period: "19th Century",
      material: "Copper",
      provenance: "Private Collection",
      district: "Srinagar",
      status: "Fully Documented",
      img: "https://images.unsplash.com/photo-1595273670150-bd0c3c6ca68e?w=600&auto=format&fit=crop",
      secondaryCrafts: "Tin coating",
      geographicCoverage: "Old Srinagar (Zaina Kadal)",
      curator: "Sajad Dar",
      researchLead: "Dr. N. Jan",
      publicationDate: "May 2026",
      version: "v1.0",
      historicalContext: "Coppersmith bazaar routes and household kitchen vessels design evolution.",
      conservation: {
        condition: "Good",
        risks: "Oxidization",
        storage: "Dry cabinets",
        handling: "Bare hands allowed if washed",
        environmental: "Low humidity",
        restoration: "Tin coating re-applied",
        monitoring: "Visual reviews"
      },
      objects: [],
      comparativeAnalysis: {
        motifEvolution: "Engraved designs shifted from geometric panels to dense foliage grids.",
        borderDesign: "Chased borders deepened.",
        colorPalette: "Tin coating gives brilliant silver tone.",
        stitchDensity: "N/A",
        knotDensity: "N/A",
        carvingDepth: "Chisel engraving depth averages 1.5mm.",
        brushwork: "N/A",
        toolMarks: "Concentric compass layout marks verified on bases.",
        finishingQuality: "Polished with soft sand paste.",
        conservationState: "Some tin wear."
      },
      timeline: [],
      relatedOralHistories: "KHCRF-OH-2026-012",
      relatedDocFilms: "Doc-KHCRF-2026-12",
      relatedDemonstrations: "KHCRF-CD-2026-009",
      relatedKnowledgeArticles: "Downtown Bazaars Heritage"
    },
    {
      slug: "col-living-talim",
      title: "The Living Talim",
      subtitle: "Historic and Contemporary Carpet Coding",
      desc: "Preserving handwritten paper pattern rolls (Talim) alongside their finished knotted textile segments to bridge code and physical carpet form.",
      accessionId: "KHCRF-COL-2026-007",
      year: "2026",
      objectsCount: 28,
      artisansCount: 6,
      essayIncluded: "No",
      type: "Research Collection",
      craft: "Carpet",
      period: "Contemporary",
      material: "Wool",
      provenance: "KHCRF Documentation",
      district: "Budgam",
      status: "Conservation Assessment",
      img: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=600&auto=format&fit=crop",
      secondaryCrafts: "Weaving",
      geographicCoverage: "Srinagar, Budgam",
      curator: "Farooq Mir",
      researchLead: "Dr. K. A. Mir",
      publicationDate: "June 2026",
      version: "v1.0",
      historicalContext: "Mapping the symbols of carpet weaving codes.",
      conservation: {
        condition: "Fragile paper rolls",
        risks: "Paper crumbling",
        storage: "Polyester sleeves",
        handling: "Support sheets",
        environmental: "Low humidity",
        restoration: "Deacidification",
        monitoring: "Monthly checks"
      },
      objects: [],
      comparativeAnalysis: {
        motifEvolution: "Code notation became smaller to fit complex medallion shapes.",
        borderDesign: "N/A",
        colorPalette: "Color key remains standardized.",
        stitchDensity: "N/A",
        knotDensity: "Matches 350 KPSI setups.",
        carvingDepth: "N/A",
        brushwork: "N/A",
        toolMarks: "Calligraphy pen ink marks verified.",
        finishingQuality: "None",
        conservationState: "Ink remains legible."
      },
      timeline: [],
      relatedOralHistories: "KHCRF-OH-2026-007",
      relatedDocFilms: "Doc-KHCRF-2026-03",
      relatedDemonstrations: "KHCRF-CD-2026-001",
      relatedKnowledgeArticles: "Wage Structures & Patronage"
    },
    {
      slug: "col-namda-revival",
      title: "The Namda Revival Collection",
      subtitle: "Traditional Felting Meets Contemporary Design",
      desc: "Documenting clean wool layering tests, pH calibrated alkaline felting soaps, and modern geometric layout adaptations on felt bases.",
      accessionId: "KHCRF-COL-2026-008",
      year: "2026",
      objectsCount: 31,
      artisansCount: 15,
      essayIncluded: "Yes",
      type: "Contemporary Excellence",
      craft: "Namda",
      period: "Contemporary",
      material: "Wool",
      provenance: "Community Collection",
      district: "Anantnag",
      status: "Fully Documented",
      img: "https://images.unsplash.com/photo-1565192647048-f997ded87958?w=600&auto=format&fit=crop",
      secondaryCrafts: "Embroidery",
      geographicCoverage: "Anantnag",
      curator: "Zehra Malik",
      researchLead: "Dr. K. A. Mir",
      publicationDate: "May 2026",
      version: "v1.1",
      historicalContext: "Cooperative revival schemes starting from 2021 felt audits.",
      conservation: {
        condition: "Excellent",
        risks: "Wool compression loss",
        storage: "Flat cedar shelves",
        handling: "Support flat lifting",
        environmental: "Low humidity",
        restoration: "Fibers brushed",
        monitoring: "Bi-annual review"
      },
      objects: [],
      comparativeAnalysis: {
        motifEvolution: "Minimalist patterns replacing traditional all-over Sozni patterns.",
        borderDesign: "Borders removed to give clean modern edges.",
        colorPalette: "Winter white base felt tones preferred.",
        stitchDensity: "Embroidery stitch lengths increased to 4mm.",
        knotDensity: "N/A",
        carvingDepth: "N/A",
        brushwork: "N/A",
        toolMarks: "Felt pin indentations visible on bases.",
        finishingQuality: "Calender iron pressed finishing.",
        conservationState: "Fibers densely locked."
      },
      timeline: [],
      relatedOralHistories: "KHCRF-OH-2026-010",
      relatedDocFilms: "Doc-KHCRF-2026-03",
      relatedDemonstrations: "KHCRF-CD-2026-010",
      relatedKnowledgeArticles: "Natural Dye Conservation"
    },
    {
      slug: "col-family-workshops",
      title: "Objects from Family Workshops",
      subtitle: "Three Generations of Craft Practice",
      desc: "A comparative compilation of wooden templates, tools, and finished sample panels handed down across three generations of Ahmad woodcarvers.",
      accessionId: "KHCRF-COL-2026-009",
      year: "2026",
      objectsCount: 49,
      artisansCount: 10,
      essayIncluded: "Yes",
      type: "Family Collection",
      craft: "Multi-Craft",
      period: "Late 20th Century",
      material: "Mixed Materials",
      provenance: "Family Collection",
      district: "Baramulla",
      status: "Fully Documented",
      img: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&auto=format&fit=crop",
      secondaryCrafts: "Woodworking",
      geographicCoverage: "Baramulla",
      curator: "Sajad Dar",
      researchLead: "Dr. N. Jan",
      publicationDate: "March 2026",
      version: "v1.0",
      historicalContext: "Mapping family lineage workshops in north Jhelum trade nodes.",
      conservation: {
        condition: "Stable",
        risks: "Termite exposure",
        storage: "Treated oak cabinets",
        handling: "Cotton gloves",
        environmental: "Dry ventilation",
        restoration: "Bee wax coating",
        monitoring: "Monthly checks"
      },
      objects: [],
      comparativeAnalysis: {
        motifEvolution: "Geometric joinery styles remained stable over three generations.",
        borderDesign: "Minor variations in chisel widths.",
        colorPalette: "N/A",
        stitchDensity: "N/A",
        knotDensity: "N/A",
        carvingDepth: "Background depth consistent at 4mm.",
        brushwork: "N/A",
        toolMarks: "Traditional wooden mallet punch marks verified.",
        finishingQuality: "Polished with organic oils.",
        conservationState: "Wood remains dense."
      },
      timeline: [],
      relatedOralHistories: "KHCRF-OH-2026-003",
      relatedDocFilms: "Doc-KHCRF-2026-11",
      relatedDemonstrations: "KHCRF-CD-2026-008",
      relatedKnowledgeArticles: "Tactile Material Grading"
    },
    {
      slug: "col-jhelum-trade",
      title: "Crafts of the Jhelum",
      subtitle: "Objects Connected to River-Based Trade",
      desc: "Historically mapping wicker boat baskets, heavy cargo wood bindings, and river silt pottery molds utilized along the trade paths of the Jhelum river.",
      accessionId: "KHCRF-COL-2026-010",
      year: "2026",
      objectsCount: 52,
      artisansCount: 11,
      essayIncluded: "Yes",
      type: "Research Collection",
      craft: "Multi-Craft",
      period: "Earlier",
      material: "Willow",
      provenance: "Community Collection",
      district: "Ganderbal",
      status: "Provenance Under Research",
      img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop",
      secondaryCrafts: "Pottery, Wicker work",
      geographicCoverage: "Ganderbal, Srinagar",
      curator: "Farooq Mir",
      researchLead: "Dr. H. Mir",
      publicationDate: "June 2026",
      version: "v1.0",
      historicalContext: "River boat routes and basketry trade logs.",
      conservation: {
        condition: "Dry wicker, highly fragile",
        risks: "Fiber splitting",
        storage: "Controlled moisture chambers",
        handling: "Double handed support",
        environmental: "Humidity 55%",
        restoration: "Stabilization oils applied",
        monitoring: "Bi-weekly checks"
      },
      objects: [],
      comparativeAnalysis: {
        motifEvolution: "Utility basket shapes remained consistent for river transit.",
        borderDesign: "Thick double weaves for weight load bearing.",
        colorPalette: "Unpainted boiled willow tones.",
        stitchDensity: "N/A",
        knotDensity: "N/A",
        carvingDepth: "N/A",
        brushwork: "N/A",
        toolMarks: "Splitting knife cuts verified on interior splits.",
        finishingQuality: "Air dried cane fibers.",
        conservationState: "Brittle fiber structures."
      },
      timeline: [],
      relatedOralHistories: "KHCRF-OH-2026-008",
      relatedDocFilms: "Doc-KHCRF-2026-10",
      relatedDemonstrations: "KHCRF-CD-2026-011",
      relatedKnowledgeArticles: "Karkhana Etiquette Guidelines"
    },
    {
      slug: "col-contemporary-kashmir",
      title: "Masterpieces of Contemporary Kashmir",
      subtitle: "Exceptional Works by Living Artisans",
      desc: "Showcasing signature shawls and woodcraft items carrying GI tags and verified craftsman signatures that represent contemporary excellence.",
      accessionId: "KHCRF-COL-2026-011",
      year: "2026",
      objectsCount: 44,
      artisansCount: 20,
      essayIncluded: "Yes",
      type: "Contemporary Excellence",
      craft: "Multi-Craft",
      period: "Contemporary",
      material: "Mixed Materials",
      provenance: "KHCRF Documentation",
      district: "Srinagar",
      status: "Fully Documented",
      img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop",
      secondaryCrafts: "Engraving",
      geographicCoverage: "Srinagar, Budgam",
      curator: "Zehra Malik",
      researchLead: "Dr. H. Mir",
      publicationDate: "June 2026",
      version: "v1.2",
      historicalContext: "Mapping contemporary GI verification logs.",
      conservation: {
        condition: "Excellent",
        risks: "None immediately",
        storage: "Standard catalog displays",
        handling: "Normal protocols",
        environmental: "Ambient museum climate",
        restoration: "None",
        monitoring: "Annual checks"
      },
      objects: [],
      comparativeAnalysis: {
        motifEvolution: "Geometric precision increases using modern templates.",
        borderDesign: "Symmetrical borders preferred.",
        colorPalette: "Wide variety including pastel tones.",
        stitchDensity: "Averages 85 stitches/inch.",
        knotDensity: "450 KPSI average.",
        carvingDepth: "3mm average.",
        brushwork: "Extremely clean paint edges.",
        toolMarks: "Minimal visible marks.",
        finishingQuality: "Industrial grade washes.",
        conservationState: "Prise condition."
      },
      timeline: [],
      relatedOralHistories: "KHCRF-OH-2026-012",
      relatedDocFilms: "Doc-KHCRF-2026-12",
      relatedDemonstrations: "KHCRF-CD-2026-012",
      relatedKnowledgeArticles: "GI Tag Preservation"
    },
    {
      slug: "col-motifs-paradise",
      title: "Motifs of Paradise",
      subtitle: "Floral, Vine, Paisley, and Chinar Across Crafts",
      desc: "An iconographic study tracking the Chinar leaf motif and paisley shapes across carpet grids, needlework outlines, copper engravings, and papier-mâché panels.",
      accessionId: "KHCRF-COL-2026-012",
      year: "2026",
      objectsCount: 67,
      artisansCount: 25,
      essayIncluded: "Yes",
      type: "Heritage Collection",
      craft: "Multi-Craft",
      period: "Mid 20th Century",
      material: "Mixed Materials",
      provenance: "Institutional Archive",
      district: "Srinagar",
      status: "Fully Documented",
      img: "https://images.unsplash.com/photo-1487180142328-0c4e37023af5?w=600&auto=format&fit=crop",
      secondaryCrafts: "Iconography, Painting",
      geographicCoverage: "Srinagar, Budgam, Anantnag",
      curator: "Zehra Malik",
      researchLead: "Dr. S. Farooq",
      publicationDate: "June 2026",
      version: "v1.2",
      historicalContext: "Mapping naturalism in Kashmiri design paths.",
      conservation: {
        condition: "Good",
        risks: "Color change under UV light",
        storage: "UV shielding window spaces",
        handling: "Cotton gloves",
        environmental: "Low light",
        restoration: "Fiber consolidations completed",
        monitoring: "Semi-annual inspections"
      },
      objects: [],
      comparativeAnalysis: {
        motifEvolution: "Naturalistic chinar leaf shapes stylized into geometric shapes on carpets.",
        borderDesign: "Chinar borders widened.",
        colorPalette: "Bright natural shades representing changing seasons.",
        stitchDensity: "N/A",
        knotDensity: "Matches standard guild averages.",
        carvingDepth: "Relief cuts mirror leaf details.",
        brushwork: "Fine outline details.",
        toolMarks: "Compass layout circles verified.",
        finishingQuality: "Hand burnished details.",
        conservationState: "Durable base."
      },
      timeline: [
        { year: "1850", event: "Chinar motif first mapped in royal shawl registers" }
      ],
      relatedOralHistories: "KHCRF-OH-2026-012",
      relatedDocFilms: "Doc-KHCRF-2026-12",
      relatedDemonstrations: "KHCRF-CD-2026-006",
      relatedKnowledgeArticles: "GI Tag Preservation"
    }
  ]);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedCraft, setSelectedCraft] = useState('All Crafts');
  const [selectedPeriod, setSelectedPeriod] = useState('All Periods');
  const [selectedMaterial, setSelectedMaterial] = useState('All Materials');
  const [selectedProvenance, setSelectedProvenance] = useState('All Provenance');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedSort, setSelectedSort] = useState('Featured');

  const [currentView, setCurrentView] = useState<'editorial' | 'grid' | 'index'>('editorial');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeItem, setActiveItem] = useState<any>(null);
  const [activeModalTab, setActiveModalTab] = useState<'essay' | 'objects' | 'analysis' | 'timeline' | 'conservation' | 'relations'>('essay');
  const itemsPerPage = 6;

  // Filter Logic
  const filteredCollections = allCollections.filter(c => {
    // Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchText = `${c.title} ${c.subtitle || ''} ${c.desc} ${c.craft} ${c.accessionId} ${c.period} ${c.material} ${c.provenance} ${c.district}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    // Collection Type
    if (selectedType !== 'All Types') {
      if (c.type !== selectedType) return false;
    }
    // Craft
    if (selectedCraft !== 'All Crafts') {
      if (c.craft !== selectedCraft) return false;
    }
    // Historical Period
    if (selectedPeriod !== 'All Periods') {
      if (c.period !== selectedPeriod) return false;
    }
    // Material
    if (selectedMaterial !== 'All Materials') {
      if (c.material !== selectedMaterial) return false;
    }
    // Provenance
    if (selectedProvenance !== 'All Provenance') {
      if (c.provenance !== selectedProvenance) return false;
    }
    // District
    if (selectedDistrict !== 'All Districts') {
      if (c.district !== selectedDistrict) return false;
    }
    // Status
    if (selectedStatus !== 'All Statuses') {
      if (c.status !== selectedStatus) return false;
    }
    return true;
  });

  // Sorting
  const sortedCollections = [...filteredCollections].sort((a, b) => {
    if (selectedSort === 'Recently Added') {
      return b.accessionId.localeCompare(a.accessionId);
    }
    if (selectedSort === 'Newest Acquisitions') {
      return b.objectsCount - a.objectsCount;
    }
    if (selectedSort === 'Most Viewed') {
      return b.objectsCount - a.objectsCount;
    }
    if (selectedSort === 'Alphabetical') {
      return a.title.localeCompare(b.title);
    }
    if (selectedSort === 'Craft') {
      return a.craft.localeCompare(b.craft);
    }
    if (selectedSort === 'Historical Period') {
      return a.period.localeCompare(b.period);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedCollections.length / itemsPerPage);
  const paginatedCollections = sortedCollections.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pb-24 animate-fadeIn">
      
      {/* Detailed Modal Registry Sheet */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#3E2723]/40 backdrop-blur-sm" onClick={() => setActiveItem(null)}></div>
          <div className="relative z-10 bg-[#FAF9F6] border-2 border-[#3E2723] max-w-3xl w-full p-6 md:p-8 shadow-2xl text-[#2A2A2A] max-h-[95vh] overflow-y-auto custom-scrollbar font-mono rounded-xs" role="dialog" aria-modal="true">
            <button onClick={() => setActiveItem(null)} className="absolute top-4 right-4 text-[#3E2723]/50 hover:text-[#3E2723] text-xl font-bold font-mono">&times;</button>
            
            <div className="text-center mb-6 border-b border-[#3E2723]/25 pb-4">
              <span className="text-[#D4AF37] font-mono text-xs uppercase tracking-widest block mb-1 font-bold">KHCRF SCHOLARLY COLLECTIONS INDEX</span>
              <h2 className="text-xl md:text-2xl font-serif text-[#3E2723] font-bold leading-tight">{activeItem.title}</h2>
              {activeItem.subtitle && <p className="text-gray-500 text-xs italic font-serif mt-1">{activeItem.subtitle}</p>}
              
              <div className="flex flex-wrap justify-center gap-2 mt-3 font-mono text-[9px] uppercase tracking-wider text-gray-500">
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">ACCESSION: {activeItem.accessionId}</span>
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">OBJECTS: {activeItem.objectsCount}</span>
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">ARTISANS: {activeItem.artisansCount}</span>
                <span className="bg-[#3E2723] text-[#D4AF37] px-2 py-0.5 font-bold">{activeItem.status.toUpperCase()}</span>
              </div>
            </div>

            {/* Modal Tabs navigation */}
            <div className="flex flex-wrap gap-1 border-b border-[#3E2723]/20 pb-3 mb-6 text-[10px] font-mono justify-center">
              {[
                { id: 'essay', label: 'Curatorial Essay' },
                { id: 'objects', label: 'Objects' },
                { id: 'analysis', label: 'Comparative Analysis' },
                { id: 'timeline', label: 'Timeline' },
                { id: 'conservation', label: 'Conservation' },
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
              
              {/* TAB 1: CURATORIAL ESSAY */}
              {activeModalTab === 'essay' && (
                <div className="space-y-4 font-sans text-gray-650">
                  <div>
                    <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2 font-mono">Why this collection exists</h3>
                    <p className="leading-relaxed font-sans">{activeItem.desc}</p>
                  </div>
                  <div>
                    <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2 font-mono">Historical Context</h3>
                    <p className="leading-relaxed font-sans">{activeItem.historicalContext || "Scholarly essay tracking regional changes and trade nodes."}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 font-mono text-[10px] border-t border-gray-150 mt-2">
                    <div>
                      <span className="text-gray-400 uppercase font-bold block text-[8px]">Curator Lead</span>
                      <p className="text-[#2A2A2A] font-sans font-bold">{activeItem.curator}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 uppercase font-bold block text-[8px]">Research Lead</span>
                      <p className="text-[#2A2A2A] font-sans font-bold">{activeItem.researchLead}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: OBJECTS */}
              {activeModalTab === 'objects' && (
                <div className="space-y-4 font-mono">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Documented Objects Inventory</h3>
                  
                  {activeItem.objects?.length > 0 ? (
                    <div className="space-y-4">
                      {activeItem.objects.map((obj: any, oIdx: number) => (
                        <div key={oIdx} className="border border-gray-200 p-4 bg-white space-y-2 text-[10px] font-mono">
                          <div className="flex justify-between items-center border-b border-gray-100 pb-1 font-bold">
                            <span className="text-[#3E2723]">{obj.title}</span>
                            <span className="text-gray-400">{obj.number}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[9px] text-gray-500">
                            <div><span className="font-bold">Craft:</span> {obj.craft}</div>
                            <div><span className="font-bold">Technique:</span> {obj.technique}</div>
                            <div><span className="font-bold">Maker:</span> {obj.maker}</div>
                            <div><span className="font-bold">Workshop:</span> {obj.workshop}</div>
                            <div><span className="font-bold">Date:</span> {obj.date}</div>
                            <div><span className="font-bold">Material:</span> {obj.material}</div>
                            <div><span className="font-bold">Dimensions:</span> {obj.dimensions}</div>
                            <div><span className="font-bold">Condition:</span> {obj.condition}</div>
                          </div>
                          <div className="pt-2 border-t border-gray-100 text-[9px] text-gray-450 italic">
                            Provenance: {obj.provenance}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">Inventory lists are restricted for institutional archives. Summary numbers logged.</p>
                  )}
                </div>
              )}

              {/* TAB 3: COMPARATIVE ANALYSIS */}
              {activeModalTab === 'analysis' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Object Comparison Parameters</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 divide-y divide-gray-100 md:divide-y-0">
                    <div className="space-y-2 pr-2">
                      <div><span className="text-gray-400 font-bold block text-[8px]">MOTIF EVOLUTION</span> {activeItem.comparativeAnalysis?.motifEvolution}</div>
                      <div><span className="text-gray-400 font-bold block text-[8px]">BORDER DESIGN</span> {activeItem.comparativeAnalysis?.borderDesign}</div>
                      <div><span className="text-gray-400 font-bold block text-[8px]">COLOUR PALETTE</span> {activeItem.comparativeAnalysis?.colorPalette}</div>
                    </div>
                    <div className="space-y-2">
                      <div><span className="text-gray-400 font-bold block text-[8px]">STITCH DENSITY</span> {activeItem.comparativeAnalysis?.stitchDensity}</div>
                      {activeItem.comparativeAnalysis?.knotDensity !== 'N/A' && (
                        <div><span className="text-gray-400 font-bold block text-[8px]">KNOT DENSITY</span> {activeItem.comparativeAnalysis?.knotDensity}</div>
                      )}
                      {activeItem.comparativeAnalysis?.carvingDepth !== 'N/A' && (
                        <div><span className="text-gray-400 font-bold block text-[8px]">CARVING DEPTH</span> {activeItem.comparativeAnalysis?.carvingDepth}</div>
                      )}
                      <div><span className="text-gray-400 font-bold block text-[8px]">FINISHING QUALITY</span> {activeItem.comparativeAnalysis?.finishingQuality}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: TIMELINE */}
              {activeModalTab === 'timeline' && (
                <div className="space-y-4 font-mono text-[11px]">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-4">Collection Development Timeline</h3>
                  {activeItem.timeline?.length > 0 ? (
                    <div className="border-l-2 border-[#3E2723]/25 pl-4 space-y-4">
                      {activeItem.timeline.map((t: any, idx: number) => (
                        <div key={idx} className="relative">
                          <div className="absolute -left-[21px] top-1.5 bg-[#3E2723] w-2 h-2 rounded-full"></div>
                          <span className="font-bold text-[#D4AF37]">{t.year}</span>
                          <p className="text-gray-650 font-sans text-xs mt-0.5">{t.event}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">Timeline data is under verification by independent master panels.</p>
                  )}
                </div>
              )}

              {/* TAB 5: CONSERVATION */}
              {activeModalTab === 'conservation' && (
                <div className="space-y-4 font-mono text-[10px] grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-[#D4AF37] font-bold border-b border-gray-200 pb-1 uppercase text-[9px]">Status & Storage</h4>
                    <div><span className="text-gray-400">Current Condition:</span> {activeItem.conservation?.condition}</div>
                    <div><span className="text-gray-400">Risks Identified:</span> {activeItem.conservation?.risks}</div>
                    <div><span className="text-gray-400">Recommended Storage:</span> {activeItem.conservation?.storage}</div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[#D4AF37] font-bold border-b border-gray-200 pb-1 uppercase text-[9px]">Handling & Climate</h4>
                    <div><span className="text-gray-400">Handling instructions:</span> {activeItem.conservation?.handling}</div>
                    <div><span className="text-gray-400">Environment requirements:</span> {activeItem.conservation?.environmental}</div>
                    <div><span className="text-gray-400">Restoration History:</span> {activeItem.conservation?.restoration}</div>
                  </div>
                </div>
              )}

              {/* TAB 6: RELATED KNOWLEDGE */}
              {activeModalTab === 'relations' && (
                <div className="space-y-4 font-mono text-[11px] space-y-4">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Related Knowledge Ecosystem Links</h3>
                  <div className="bg-white border border-gray-200 p-4 space-y-1.5 text-[10px]">
                    <div><span className="text-gray-400">CITATION           :</span> KHCRF Collections Archive, Record {activeItem.accessionId}. Retrieved 2026.</div>
                    <div><span className="text-gray-400">RELATED ORAL HISTORY:</span> {activeItem.relatedOralHistories}</div>
                    <div><span className="text-gray-400">RELATED DOCUMENTARY :</span> {activeItem.relatedDocFilms}</div>
                    <div><span className="text-gray-400">RELATED DEMONSTRATION:</span> {activeItem.relatedDemonstrations}</div>
                    <div><span className="text-gray-400">RELATED ARTICLES    :</span> {activeItem.relatedKnowledgeArticles}</div>
                  </div>
                </div>
              )}

            </div>

            <div className="border-t border-[#D4AF37]/30 pt-6 text-center space-y-4 font-mono mt-6">
              <p className="text-[9px] uppercase tracking-widest text-gray-400 leading-relaxed font-mono">
                Access to high-resolution objects imagery, structural drawings, and essays is reserved for supportive members.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link href="/about/memberships" className="bg-[#D4AF37] text-[#3E2723] hover:bg-white px-6 py-3 font-bold uppercase tracking-wider text-xs transition-colors border border-[#D4AF37] font-mono">
                  Become a Member
                </Link>
                <button onClick={() => setActiveItem(null)} className="border border-[#3E2723] hover:bg-[#3E2723]/5 text-[#3E2723] px-6 py-3 uppercase tracking-wider text-xs transition-colors font-light font-mono">
                  Return to Archive
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Hero section */}
      <UniversalEditorialHero pageKey="collections" fallbackConfig={collectionsHeroFallback as any} />

      <div className="container-fluid mx-auto px-4 md:px-10 py-12 max-w-7xl animate-fadeIn">
        
        {/* Introductory Statement Block */}
        <div className="bg-[#3E2723]/5 border-l-4 border-[#3E2723] p-8 mb-12 rounded-r-xs max-w-5xl">
          <p className="text-gray-700 text-base md:text-lg leading-relaxed font-serif">
            The KHCRF Collections bring together carefully curated groups of craft objects that share a common history, technique, lineage, material, maker, period, geography, or cultural significance. Rather than presenting individual works in isolation, each collection explores the relationships between objects and the stories they tell collectively.
          </p>
          <p className="text-gray-755 text-xs mt-3 uppercase tracking-widest font-bold font-mono">
            Collections may include historical masterpieces, contemporary works, workshop archives, family inheritances, museum collaborations, private collections, thematic studies, technical comparisons, and significant examples of living craftsmanship. Each collection is supported by scholarly interpretation, provenance research, technical documentation, and contextual knowledge to encourage deeper understanding of Kashmir's craft heritage.
          </p>
          
          <div className="flex flex-wrap gap-4 mt-6 font-mono text-xs">
            <a href="#results" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-5 py-2.5 font-bold uppercase tracking-wider transition-all">
              Explore Collections
            </a>
            <a href="#suggest" className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-5 py-2.5 font-bold uppercase tracking-wider transition-all">
              Propose a Collection
            </a>
            <a href="#methodology" className="text-[#3E2723] hover:underline font-bold py-2.5">
              Collection Documentation Standards &rarr;
            </a>
          </div>
        </div>

        {/* Featured Collection */}
        <section className="bg-white border-4 border-[#3E2723] p-8 md:p-10 mb-16 relative shadow-md">
          <div className="absolute top-0 right-0 bg-[#3E2723] text-[#D4AF37] px-4 py-1 text-[10px] font-mono font-bold uppercase tracking-widest">
            FEATURED COLLECTION
          </div>
          
          <div className="max-w-4xl font-mono">
            <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-1">
              Archive Record: KHCRF-COL-2026-001
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3E2723] leading-tight mb-2">
              The Language of Pashmina
            </h2>
            <h3 className="text-base md:text-lg font-serif italic text-gray-500 mb-4">
              Masterpieces of Fibre, Weaving, Embroidery, and Finishing
            </h3>
            
            <p className="text-gray-700 text-sm leading-relaxed mb-6 font-sans text-gray-655">
              This collection explores the artistic and technical journey of Kashmir Pashmina through carefully selected examples representing fibre preparation, weaving traditions, embroidery techniques, finishing practices, regional variation, and contemporary interpretation.
              Rather than documenting a single shawl, the collection demonstrates how generations of artisans have shaped one of Kashmir's most celebrated craft traditions.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 font-mono text-[10px] border-t border-b border-gray-250 py-3 bg-gray-50 px-4">
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Type</span>
                <span className="font-bold text-[#3E2723]">Heritage Collection</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Objects</span>
                <span className="font-bold text-[#3E2723]">46 Objects</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Artisans</span>
                <span className="font-bold text-[#3E2723]">18 Master Artisans</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Status</span>
                <span className="font-bold text-[#3E2723]">Research Essay Included</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => { setActiveItem(allCollections[0]); setActiveModalTab('essay'); }}
                className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-all font-mono"
              >
                Explore Collection &rarr;
              </button>
            </div>
          </div>
        </section>

        {/* Why Curate Collections Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start mt-12">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-serif text-[#3E2723] mb-6 font-bold">Why Curate Collections?</h2>
            <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans">
              A single craft object can demonstrate exceptional skill, but a thoughtfully curated collection reveals patterns that individual objects cannot.
            </p>
            <p className="text-gray-605 text-sm leading-relaxed font-sans">
              By bringing related works together, KHCRF enables researchers, educators, artisans, museums, collectors, and the public to study Kashmir's craft heritage through comparison, interpretation, and long-term documentation.
            </p>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#3E2723]/10 p-8 rounded-xs shadow-xs">
            <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 font-mono">
              Collections help us understand:
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700 font-sans font-mono">
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>artistic evolution</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>family traditions</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>regional variation</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>workshop styles</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>changing materials</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>technical innovation</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>historical continuity</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>cultural symbolism</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>collecting practices</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>conservation priorities</li>
            </ul>
          </div>
        </section>

        {/* Cross-Collection Comparison Feature */}
        <section className="bg-white border border-[#3E2723]/25 p-8 md:p-10 mb-16 rounded-xs shadow-sm">
          <div className="border-b border-[#3E2723]/15 pb-4 mb-8">
            <span className="text-[#D4AF37] text-[10px] font-mono uppercase font-bold tracking-widest block mb-1">Analytical Capabilities</span>
            <h3 className="font-serif text-2xl font-bold text-[#3E2723]">Cross-Collection Design Comparison</h3>
            <p className="text-gray-500 text-xs font-mono mt-1">INTERCONNECTED SYSTEM RESEARCH PLATFORM</p>
          </div>

          <p className="text-gray-650 text-xs leading-relaxed mb-6 font-sans">
            Unlike a conventional museum catalogue, KHCRF Collections support <strong>cross-collection comparison</strong>. A researcher can compare, for example, all Chinar motifs across papier-mâché, carpets, Sozni embroidery, and walnut wood carving, or trace how a particular border design evolved across regions and decades. This comparative, interconnected approach is what elevates the Collections section from an archive of objects to a research platform.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] font-mono">
            {[
              "Motif Evolution",
              "Border Design",
              "Colour Palette",
              "Stitch Density",
              "Knot Density",
              "Carving Depth",
              "Brushwork",
              "Tool Marks"
            ].map((param, idx) => (
              <div key={idx} className="border border-gray-200 p-3 bg-[#FAF9F6] text-center font-bold">
                {param}
              </div>
            ))}
          </div>
        </section>

        {/* Archive Overview Dashboard */}
        <section className="bg-[#3E2723] text-white p-8 md:p-10 mb-12 rounded-xs relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#3E2723] px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-widest">
            Archive Overview
          </div>
          <div className="mb-8 font-mono">
            <h3 className="font-serif text-2xl text-[#D4AF37] mb-2 font-bold">Scholarly Collections Registry</h3>
            <p className="text-white/60 text-xs">
              MUSEUM & COOPERATIVE CLASSIFIED METRIC SYSTEM
            </p>
          </div>

          {/* Primary Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 text-center md:text-left border-b border-white/10 pb-8 mb-8">
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Collections Curated</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">48</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Documented Objects</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">2,318</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono font-mono">Craft Traditions</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">14</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Master Artisans Represented</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">186</span>
            </div>
            <div className="last:border-0">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Collection Essays</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">94</span>
            </div>
          </div>

          {/* Secondary Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 text-center md:text-left font-mono">
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono font-mono">Historical Objects</span>
              <span className="text-xl font-serif font-semibold text-white/80">624</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono font-mono">Contemporary Works</span>
              <span className="text-xl font-serif font-semibold text-white/80">891</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono font-mono">Family Collections</span>
              <span className="text-xl font-serif font-semibold text-white/80">37</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono font-mono">Museum Collaborations</span>
              <span className="text-xl font-serif font-semibold text-white/80">12</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono font-mono">Private Collections</span>
              <span className="text-xl font-serif font-semibold text-white/80">19</span>
            </div>
            <div className="last:border-0">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Digitally Documented</span>
              <span className="text-lg font-serif font-semibold text-[#D4AF37] block leading-tight font-mono font-mono font-mono">1,842</span>
            </div>
          </div>
        </section>

        {/* View Switcher Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 bg-[#FAF9F6] border border-[#3E2723]/10 p-4 font-mono" id="results">
          <div className="text-xs font-serif text-[#3E2723]">
            KHCRF Collections Catalog &bull; Showing {sortedCollections.length} Curated Archives
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] text-gray-400 uppercase self-center mr-2 font-mono">Archive Layout View:</span>
            <button 
              onClick={() => { setCurrentView('editorial'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'editorial' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Editorial Collections
            </button>
            <button 
              onClick={() => { setCurrentView('grid'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'grid' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Collection Grid
            </button>
            <button 
              onClick={() => { setCurrentView('index'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'index' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Research Catalogue
            </button>
          </div>
        </div>

        {/* Search and Discovery Layout */}
        <section className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4 bg-white border border-[#3E2723]/10 p-6 shadow-xs sticky top-4 z-10 font-sans">
            <h3 className="font-serif text-lg text-[#3E2723] mb-6 pb-2 border-b border-gray-100 flex items-center justify-between font-bold">
              <span>Filter Collections</span>
              <button 
                onClick={() => {
                  setSelectedType('All Types');
                  setSelectedCraft('All Crafts');
                  setSelectedPeriod('All Periods');
                  setSelectedMaterial('All Materials');
                  setSelectedProvenance('All Provenance');
                  setSelectedDistrict('All Districts');
                  setSelectedStatus('All Statuses');
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
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Search Collection</label>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="Search collections by title, craft, artisan, motif, material, district, period, owner, or keyword..."
                  className="w-full border border-gray-200 px-3 py-2 text-xs rounded-none bg-[#FAF9F6] text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                />
              </div>

              {/* Collection Type */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Collection Type</label>
                <select 
                  value={selectedType}
                  onChange={(e) => { setSelectedType(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Types">All Types</option>
                  <option value="Heritage Collection">Heritage Collection</option>
                  <option value="Signature Masterpieces">Signature Masterpieces</option>
                  <option value="Museum Archive">Museum Archive</option>
                  <option value="Rare Objects">Rare Objects</option>
                  <option value="Contemporary Excellence">Contemporary Excellence</option>
                  <option value="Family Collection">Family Collection</option>
                  <option value="Workshop Archive">Workshop Archive</option>
                  <option value="Institutional Collection">Institutional Collection</option>
                  <option value="Research Collection">Research Collection</option>
                  <option value="Comparative Collection">Comparative Collection</option>
                  <option value="Travelling Exhibition">Travelling Exhibition</option>
                </select>
              </div>

              {/* Craft Select filter check */}
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
                  <option value="Multi-Craft">Multi-Craft</option>
                </select>
              </div>

              {/* Historical Period */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Historical Period</label>
                <select 
                  value={selectedPeriod}
                  onChange={(e) => { setSelectedPeriod(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Periods">All Periods</option>
                  <option value="Contemporary">Contemporary</option>
                  <option value="Late 20th Century">Late 20th Century</option>
                  <option value="Mid 20th Century">Mid 20th Century</option>
                  <option value="Early 20th Century">Early 20th Century</option>
                  <option value="19th Century">19th Century</option>
                  <option value="Earlier">Earlier</option>
                  <option value="Unknown Date">Unknown Date</option>
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
                  <option value="All Materials">All Materials</option>
                  <option value="Wool">Wool</option>
                  <option value="Pashmina Fibre">Pashmina Fibre</option>
                  <option value="Silk">Silk</option>
                  <option value="Walnut Wood">Walnut Wood</option>
                  <option value="Copper">Copper</option>
                  <option value="Papier-Mâché">Papier-Mâché</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Willow">Willow</option>
                  <option value="Mixed Materials">Mixed Materials</option>
                </select>
              </div>

              {/* Provenance */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Provenance Source</label>
                <select 
                  value={selectedProvenance}
                  onChange={(e) => { setSelectedProvenance(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Provenance">All Provenance</option>
                  <option value="Family Collection">Family Collection</option>
                  <option value="Workshop Collection">Workshop Collection</option>
                  <option value="Museum">Museum</option>
                  <option value="Institutional Archive">Institutional Archive</option>
                  <option value="Private Collection">Private Collection</option>
                  <option value="Community Collection">Community Collection</option>
                  <option value="KHCRF Documentation">KHCRF Documentation</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>

              {/* District */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">District</label>
                <select 
                  value={selectedDistrict}
                  onChange={(e) => { setSelectedDistrict(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Districts">All Districts</option>
                  <option value="Srinagar">Srinagar</option>
                  <option value="Budgam">Budgam</option>
                  <option value="Baramulla">Baramulla</option>
                  <option value="Anantnag">Anantnag</option>
                  <option value="Ganderbal">Ganderbal</option>
                  <option value="Kupwara">Kupwara</option>
                  <option value="Bandipora">Bandipora</option>
                  <option value="Pulwama">Pulwama</option>
                  <option value="Shopian">Shopian</option>
                  <option value="Kulgam">Kulgam</option>
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
                  <option value="All Statuses">All Statuses</option>
                  <option value="Fully Documented">Fully Documented</option>
                  <option value="Provenance Under Research">Provenance Under Research</option>
                  <option value="Conservation Assessment">Conservation Assessment</option>
                  <option value="Digitization Complete">Digitization Complete</option>
                  <option value="Editorial Review">Editorial Review</option>
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
                  <option value="Recently Added">Recently Added</option>
                  <option value="Newest Acquisitions">Newest Acquisitions</option>
                  <option value="Most Viewed">Most Viewed</option>
                  <option value="Alphabetical">Alphabetical</option>
                  <option value="Craft">Craft</option>
                  <option value="Historical Period">Historical Period</option>
                </select>
              </div>

            </div>
          </div>

          {/* Results Area */}
          <div className="w-full lg:w-3/4">

            {loading ? (
              <div className="py-20 text-center text-gray-500 font-serif">Loading curations...</div>
            ) : (
              <>
                {/* 1. EDITORIAL CARDS VIEW (DEFAULT MODE) */}
                {currentView === 'editorial' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                    {paginatedCollections.map((c, i) => (
                      <div 
                        key={i} 
                        className="bg-white border-2 border-[#3E2723]/35 py-8 px-6 hover:bg-[#3E2723]/5 transition-all duration-300 group flex flex-col justify-between shadow-sm relative grid-ledger animate-fadeIn"
                      >
                        <div>
                          {/* Accession ID & Objects count header */}
                          <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5 font-semibold">
                            <span>{c.accessionId}</span>
                            <span>{c.objectsCount} OBJECTS</span>
                          </div>

                          {/* Collection Type & Craft */}
                          <div className="text-[9px] font-mono text-[#D4AF37] font-bold uppercase tracking-widest mb-4">
                            {c.type.toUpperCase()} &bull; {c.craft.toUpperCase()}
                          </div>

                          {/* Main Title */}
                          <h3 
                            onClick={() => { setActiveItem(c); setActiveModalTab('essay'); }}
                            className="text-xl md:text-2xl font-serif font-bold text-[#3E2723] leading-snug cursor-pointer group-hover:text-[#D4AF37] transition-colors"
                          >
                            {c.title}
                          </h3>

                          {/* Archival Subtitle */}
                          {c.subtitle && (
                            <h4 className="text-xs font-serif italic text-gray-500 mt-1 leading-snug mb-4">
                              {c.subtitle}
                            </h4>
                          )}

                          {/* Summary text */}
                          <p className="text-gray-655 text-xs leading-relaxed mb-4 font-sans line-clamp-3">
                            {c.desc}
                          </p>

                          {/* Artisans Count */}
                          <div className="mb-4 text-[10px] font-mono border-t border-b border-[#3E2723]/10 py-1.5 my-3">
                            <span className="text-gray-400 block uppercase font-bold text-[8px]">REPRESENTING</span>
                            <span className="font-bold text-[#3E2723]">{c.artisansCount} Master Artisans</span>
                          </div>
                        </div>

                        <div>
                          {/* Graphic device */}
                          <div className="text-[#3E2723]/25 text-[9px] font-mono mb-3 select-none">
                            ─────╱╲──╱────╲╱─────
                          </div>

                          {/* Period / Essay tag */}
                          <div className="flex flex-wrap justify-between items-center text-[9px] font-mono text-gray-400 uppercase tracking-wider mb-4 font-semibold font-mono">
                            <span>{c.period.toUpperCase()}</span>
                            {c.essayIncluded === 'Yes' && (
                              <span className="text-[#D4AF37] font-bold font-mono">RESEARCH ESSAY INCLUDED</span>
                            )}
                          </div>

                          {/* Action button & Status */}
                          <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto font-mono">
                            <span className="bg-[#3E2723]/5 border border-[#3E2723]/10 text-[#3E2723] text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider font-mono">
                              {c.status.toUpperCase()}
                            </span>
                            
                            <button 
                              onClick={() => { setActiveItem(c); setActiveModalTab('essay'); }}
                              className="text-xs font-bold uppercase tracking-widest text-[#3E2723] hover:text-[#D4AF37] transition-colors font-mono"
                            >
                              Explore Collection &rarr;
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

                {/* 2. COLLECTION GRID VIEW */}
                {currentView === 'grid' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
                    {paginatedCollections.map((c, i) => (
                      <div 
                        key={i} 
                        className="bg-white border border-[#3E2723]/15 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
                      >
                        <div className="relative aspect-video bg-[#FAF9F6] border-b border-[#3E2723]/10 flex flex-col justify-between p-4 overflow-hidden font-mono">
                          <div className="flex justify-between items-center text-[8px] font-bold tracking-widest text-[#3E2723]">
                            <span>{c.accessionId}</span>
                            <span className="bg-[#D4AF37] text-white px-2 py-0.5 text-[8px] uppercase tracking-widest">
                              {c.objectsCount} Objects
                            </span>
                          </div>
                          
                          <div className="text-[10px] text-gray-300 py-2 select-none text-center">
                            ┌────────────────────────┐
                            │      SCHEMATIC REG     │
                            └────────────────────────┘
                          </div>

                          <div className="text-[8px] text-gray-400 uppercase tracking-wider text-right">
                            {c.type}
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="text-[9px] text-[#D4AF37] font-mono font-bold uppercase tracking-widest mb-1.5">{c.type}</div>
                          <h4 className="text-[#3E2723] font-serif text-lg font-bold mb-2 hover:text-[#D4AF37] cursor-pointer transition-colors" onClick={() => { setActiveItem(c); setActiveModalTab('essay'); }}>{c.title}</h4>
                          <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{c.desc}</p>
                          
                          <div className="flex justify-between items-center text-[9px] font-mono text-gray-400 uppercase tracking-widest border-t border-gray-100 pt-3">
                            <span>{c.craft}</span>
                            <button onClick={() => { setActiveItem(c); setActiveModalTab('essay'); }} className="text-[#3E2723] font-bold hover:underline font-mono">Explore &rarr;</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. RESEARCH CATALOGUE VIEW */}
                {currentView === 'index' && (
                  <div className="bg-white border border-[#3E2723]/10 overflow-x-auto shadow-sm animate-fadeIn">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#3E2723] text-[#D4AF37] font-mono uppercase tracking-wider text-[10px]">
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Collection No</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Thematic Title</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Category Type</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Craft</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Period</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Material</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center font-mono">Objects</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Provenance</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center font-mono">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#3E2723]/10 font-sans text-gray-700">
                        {paginatedCollections.map((c, i) => (
                          <tr key={i} className="hover:bg-[#FAF9F6] transition-colors cursor-pointer" onClick={() => { setActiveItem(c); setActiveModalTab('essay'); }}>
                            <td className="p-4 font-mono font-bold text-gray-500 whitespace-nowrap">{c.accessionId}</td>
                            <td className="p-4">
                              <div className="font-serif font-bold text-[#3E2723] text-sm hover:text-[#D4AF37] transition-colors">{c.title}</div>
                              <div className="text-[10px] text-gray-400 font-light truncate max-w-xs">{c.subtitle}</div>
                            </td>
                            <td className="p-4 whitespace-nowrap">{c.type}</td>
                            <td className="p-4 whitespace-nowrap">{c.craft}</td>
                            <td className="p-4 whitespace-nowrap">{c.period}</td>
                            <td className="p-4 whitespace-nowrap">{c.material}</td>
                            <td className="p-4 text-center font-mono">{c.objectsCount}</td>
                            <td className="p-4 whitespace-nowrap">{c.provenance}</td>
                            <td className="p-4 text-center whitespace-nowrap font-mono">
                              <span className="px-2 py-0.5 font-mono text-[9px] uppercase border border-[#3E2723]/20 bg-[#3E2723]/5 text-[#3E2723] font-bold font-mono">
                                {c.status}
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

        {/* Collection Documentation Methodology Section */}
        <section className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs mt-16" id="methodology">
          <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold font-serif">
            How KHCRF Collections Are Developed
          </h2>
          <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans">
            Collections are developed through curatorial research, field documentation, provenance investigation, technical analysis, object photography, metadata preparation, conservation review, and scholarly interpretation. Each collection is designed to preserve both the physical object and the knowledge that gives it cultural meaning.
          </p>

          <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 font-mono">
            Development Workflow
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-gray-700 font-mono">
            {[
              { id: "01", name: "Collection concept & scope", desc: "Setting the curatorial thesis and relationship goals." },
              { id: "02", name: "Object identification", desc: "Selecting objects that collectively establish the context." },
              { id: "03", name: "Provenance research", desc: "Investigating lineage records, dynasty archives, and bills." },
              { id: "04", name: "Permissions and access", desc: "Securing ethical catalog consent layers." },
              { id: "05", name: "Technical documentation", desc: "Measuring thread count, chisel depth, and pigment chemistry." },
              { id: "06", name: "Photography & imaging", desc: "Executing high-definition macro and multi-spectral scans." },
              { id: "07", name: "Curatorial research", desc: "Drafting scholarly essays and regional variation details." },
              { id: "08", name: "Conservation assessment", desc: "Writing humidity handling rules and repair plans." },
              { id: "09", name: "Metadata enrichment", desc: "Indexing objects with unique accession numbers." },
              { id: "10", name: "Editorial review", desc: "Verification checks by independent guild advisors." },
              { id: "11", name: "Publication", desc: "Releasing files inside the digital research catalog." },
              { id: "12", name: "Periodic updates", desc: "Adding emerging provenance findings." }
            ].map((step) => (
              <div key={step.id} className="border-l-2 border-[#3E2723] pl-4 py-1 font-mono">
                <span className="font-mono text-[#D4AF37] font-bold block mb-1">STAGE {step.id}</span>
                <span className="font-bold text-[#3E2723] block mb-1">{step.name}</span>
                <span className="text-gray-555 font-sans">{step.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Curatorial Principles Section */}
        <section className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs mt-12">
          <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold font-serif">
            Curatorial Principles
          </h2>
          <p className="text-gray-655 text-sm leading-relaxed mb-8 max-w-4xl font-sans">
            KHCRF Collections follow these principles:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-xs text-gray-700 font-sans">
            {[
              "documented provenance wherever possible",
              "transparent attribution",
              "distinction between confirmed facts and informed interpretation",
              "respect for ownership and cultural sensitivity",
              "accurate technical terminology",
              "preservation-oriented documentation",
              "clear version history for evolving research",
              "ethical handling of private and community collections"
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
              Collections may support:
            </p>
            <div className="flex flex-col gap-3 font-mono">
              <button 
                onClick={() => {
                  setActiveItem(allCollections[0]);
                  setActiveModalTab('analysis');
                }}
                className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors text-center font-mono w-full md:w-auto"
              >
                Request Collection Access
              </button>
              <a 
                href="#suggest"
                className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors text-center font-mono w-full md:w-auto block"
              >
                Nominate a Collection
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#FAF9F6] border border-[#3E2723]/10 p-6 md:p-8 font-sans">
            <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 font-mono">
              Approved Research Frameworks
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4 text-xs text-gray-700 font-sans">
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>museum exhibitions</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>university teaching</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>conservation studies</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>comparative design research</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>provenance investigations</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>craft education</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>digital humanities</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>cultural tourism interpretation</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>public exhibitions</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>policy and heritage planning</li>
            </ul>
          </div>
        </section>

        {/* Propose a Collection Section */}
        <section className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs mt-12" id="suggest">
          <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold font-serif">
            Help Preserve Significant Craft Collections
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-6 font-sans">
            Collectors, artisan families, workshops, museums, institutions, and community organizations may propose collections for documentation and research.
          </p>
          
          <div className="max-w-2xl bg-[#FAF9F6] border border-[#3E2723]/20 p-6 font-mono text-xs space-y-4">
            <h4 className="font-bold text-[#3E2723] uppercase mb-3 text-[10px]">Required Proposal Fields:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-gray-500 font-mono text-[10px]">
              <div>• Collection Title</div>
              <div>• Location</div>
              <div>• Collection Type</div>
              <div>• Historical Significance</div>
              <div>• Primary Craft</div>
              <div>• Access for Documentation</div>
              <div>• Estimated Number of Objects</div>
              <div>• Supporting Information</div>
              <div>• Ownership Category</div>
              <div>• Contact Details</div>
            </div>
            
            <div className="pt-4 border-t border-[#3E2723]/10 mt-4">
              <span className="text-gray-400 block mb-2 font-sans">To submit a proposal, please email our curation desk:</span>
              <a href="mailto:collections@khcrf.org" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-2.5 font-bold uppercase tracking-wider text-[10px] inline-block font-mono transition-colors">
                Submit a Collection Proposal
              </a>
            </div>
          </div>
        </section>

        {/* Footer Statement Section */}
        <section className="border-t border-[#3E2723]/20 pt-10 text-center max-w-4xl mx-auto mt-16 font-sans">
          <blockquote className="text-gray-700 text-base md:text-lg leading-relaxed font-serif italic mb-4">
            "KHCRF Collections preserve not only exceptional craft objects but also the relationships, histories, techniques, and cultural meanings that emerge when these works are studied together. Through careful curation and scholarly documentation, each collection becomes a lasting resource for research, education, conservation, and the continued appreciation of Kashmir's living craft heritage."
          </blockquote>
          <p className="text-gray-400 text-xs font-mono uppercase tracking-widest font-bold">
            KHCRF Registry Access Console &bull; Collections Registry Division
          </p>
          <p className="text-[#D4AF37] text-[10px] uppercase font-bold mt-2 tracking-widest font-mono">
            This page represents a curatorial collection registry under development. Access to verified logs and raw records is reserved for supportive members.
          </p>
        </section>

      </div>
    </main>
  );
}
