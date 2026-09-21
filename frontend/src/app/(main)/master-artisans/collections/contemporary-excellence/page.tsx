'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { contemporaryExcellenceHeroFallback } from '@/config/heroFallbacks';

interface TraditionInnovationMatrix {
  techniquesRetained: string;
  materialsRetained: string;
  newMaterialsIntroduced: string;
  modernDesignAdaptations: string;
  environmentalImprovements: string;
  newApplications: string;
  educationalValue: string;
  potentialWiderAdoption: string;
}

interface SustainabilityProfile {
  primaryMaterials: string;
  materialOrigin: string;
  renewableResources: string;
  wasteReductionMeasures: string;
  energyConsiderations: string;
  packaging: string;
  repairability: string;
  expectedLifespan: string;
  environmentalConsiderations: string;
}

interface ImpactProfile {
  skillsPreserved: string;
  apprenticesInvolved: string;
  womenArtisansEngaged: string;
  ruralEmploymentSupported: string;
  exportMarketsReached: string;
  museumCollaborations: string;
  publicInstallations: string;
  awardsReceived: string;
  researchPublicationsGenerated: string;
}

interface EvaluationFramework {
  craftsmanshipStars: number;
  innovationStars: number;
  authenticityStars: number;
  materialResponsibilityStars: number;
  technicalComplexityStars: number;
  culturalContinuityStars: number;
  contemporaryRelevanceStars: number;
  documentationQualityStars: number;
  craftsmanshipNarrative: string;
  innovationNarrative: string;
  authenticityNarrative: string;
  sustainabilityNarrative: string;
}

interface ContemporaryProject {
  slug: string;
  archiveNumber: string;
  title: string;
  subtitle: string;
  primaryCraft: string;
  secondaryCraft: string;
  leadArtisan: string;
  collaboratingDesigners: string;
  workshop: string;
  district: string;
  projectYear: string;
  projectCategory: string;
  publicationVersion: string;
  docStatus: 'Fully Documented' | 'Technical Review' | 'Published' | 'Under Research' | 'Archive Preview';
  appCategory: string;
  sustainabilityRating: string;
  recognition: string;
  desc: string;
  whyRepresentsExcellence: string;
  designBrief: string;
  creativeProcess: string;
  traditionalKnowledgeApplied: string;
  innovation: string;
  materialAnalysis: string;
  sustainabilityAssessment: string;
  technicalDocumentation: string;
  productionProcess: string;
  challenges: string;
  outcomes: string;
  relatedCollections: string;
  relatedArtisans: string;
  relatedDemonstrations: string;
  relatedWorkshopDiaries: string;
  bibliography: string;
  rights: string;
  matrix: TraditionInnovationMatrix;
  sustainability: SustainabilityProfile;
  impact: ImpactProfile;
  evaluation: EvaluationFramework;
}

export default function ContemporaryExcellence() {
  const [allProjects] = useState<ContemporaryProject[]>([
    {
      slug: "reimagining-walnut-wood",
      archiveNumber: "KHCRF-CE-2026-001",
      title: "Reimagining Walnut Wood for Contemporary Architecture",
      subtitle: "Traditional Carving Meets Modern Interior Design",
      primaryCraft: "Walnut Wood",
      secondaryCraft: "Joinery",
      leadArtisan: "Ustad Ghulam Nabi",
      collaboratingDesigners: "Studio Giza Architects",
      workshop: "Nabi Woodcarving Atelier",
      district: "Srinagar",
      projectYear: "2025",
      projectCategory: "Architectural Integration",
      publicationVersion: "v2.1",
      docStatus: "Fully Documented",
      appCategory: "Architectural Components",
      sustainabilityRating: "Responsible Forestry",
      recognition: "Jury Selection",
      desc: "This project documents how master walnut wood artisans collaborated with architects and designers to create contemporary architectural panels using traditional carving techniques. The work preserves historic craftsmanship while adapting scale, detailing, and installation methods for present-day architectural applications, demonstrating how heritage skills continue to contribute to modern built environments.",
      whyRepresentsExcellence: "Balances large-scale modern architectural layouts with micro-carved details, maintaining traditional wood seasoning procedures.",
      designBrief: "Create a modular 12-meter structural wall partition for a civic center using hand-carved wild walnut planks.",
      creativeProcess: "Apprentices drafted digital vector paths, which the master artisan hand-carved using classical gouges on seasoned planks.",
      traditionalKnowledgeApplied: "Hand-seasoning wood for 6 years, traditional line-carving templates, and beeswax polish application.",
      innovation: "Interlocking modular track systems allowing walnut wood panels to breathe and slide dynamically.",
      materialAnalysis: "Naturally seasoned wild walnut wood, sourced from dead trees in Ganderbal, with organic seed-oil finishes.",
      sustainabilityAssessment: "Zero varnish chemistry used. Off-cuts repurposed into domestic lifestyle kitchenware.",
      technicalDocumentation: "3D CAD mapping matched with traditional wood grain routing calculations.",
      productionProcess: "Rough cutting, grain orientation alignment, relief carving, modular tongue-and-groove assembly.",
      challenges: "Controlling wood warping across large flat panels in climate-controlled spaces.",
      outcomes: "Completed civic installation visited by over 10,000 people; commissioned for two international showcases.",
      relatedCollections: "KHCRF-COL-2026-008",
      relatedArtisans: "Ustad Ghulam Nabi Profile",
      relatedDemonstrations: "KHCRF-CD-2026-014",
      relatedWorkshopDiaries: "KHCRF-WD-2026-001",
      bibliography: "Modern Joinery and Traditional Carving (2023).",
      rights: "Courtesy KHCRF & Studio Giza",
      matrix: {
        techniquesRetained: "Double relief carving, wood seasoning, organic polishing",
        materialsRetained: "Wild walnut wood, organic beeswax",
        newMaterialsIntroduced: "Aluminium structural frames, rubber gaskets",
        modernDesignAdaptations: "Modular panels, simplified geometrical borders",
        environmentalImprovements: "Sourced exclusively from verified fallen trees",
        newApplications: "Sliding wall partitions, public hall decoration",
        educationalValue: "Apprentice blueprints published for local design colleges",
        potentialWiderAdoption: "High commercial adaptability for hospitality projects"
      },
      sustainability: {
        primaryMaterials: "Seasoned Wild Walnut",
        materialOrigin: "Ganderbal District forest reserves",
        renewableResources: "Yes, certified dead wood allocation",
        wasteReductionMeasures: "Off-cuts repurposed to make small carving samples",
        energyConsiderations: "100% manual hand carving; zero heavy machinery footprint",
        packaging: "Reusable canvas padded sheets",
        repairability: "Carved details can be individually re-waxed and patched",
        expectedLifespan: "150+ years under dry conditions",
        environmentalConsiderations: "Biodegradable, carbon-sequestering structure"
      },
      impact: {
        skillsPreserved: "Relief leaf carving pedagogy",
        apprenticesInvolved: "4 senior apprentices trained in scaling",
        womenArtisansEngaged: "None (historically male woodcarver guild)",
        ruralEmploymentSupported: "Wood log acquisition from rural forest teams",
        exportMarketsReached: "Exhibited in Dubai Design Week",
        museumCollaborations: "Permanent design log at Srinagar Craft Museum",
        publicInstallations: "Srinagar Civic Auditorium central partition",
        awardsReceived: "Kashmir Design Guild Excellence Prize 2025",
        researchPublicationsGenerated: "Wood Seasoning & Architecture (KHCRF 2026)"
      },
      evaluation: {
        craftsmanshipStars: 5,
        innovationStars: 5,
        authenticityStars: 5,
        materialResponsibilityStars: 4,
        technicalComplexityStars: 5,
        culturalContinuityStars: 5,
        contemporaryRelevanceStars: 5,
        documentationQualityStars: 5,
        craftsmanshipNarrative: "Exquisite hand gouging showing absolute consistency in depths across 12 meters.",
        innovationNarrative: "The slide track integration resolves structural warping, a major wood panel challenge.",
        authenticityNarrative: "Maintains standard motifs re-scaled and hand polished with zero modern chemical lacquer.",
        sustainabilityNarrative: "Fallen wood sourcing minimizes logging impact; all scrap is fully circular."
      }
    },
    {
      slug: "sustainable-pashmina",
      archiveNumber: "KHCRF-CE-2026-002",
      title: "Sustainable Pashmina for Global Luxury",
      subtitle: "Responsible Fibre, Traditional Weaving",
      primaryCraft: "Pashmina",
      secondaryCraft: "Spinning",
      leadArtisan: "Zehra Begum",
      collaboratingDesigners: "Atelier Sustainable Luxury",
      workshop: "Maharaj Gunj Handloom Studio",
      district: "Srinagar",
      projectYear: "2024",
      projectCategory: "Sustainable Practice",
      publicationVersion: "v1.8",
      docStatus: "Fully Documented",
      appCategory: "Fashion",
      sustainabilityRating: "Traditional Dyes",
      recognition: "Curator's Choice",
      desc: "This project traces a fully certified, sustainable pashmina supply chain from Changthang nomadic pastoralists to Srinagar hand-weavers, using local plant-based dyes instead of chemical compounds to create lightweight scarves for ethical luxury markets.",
      whyRepresentsExcellence: "Establishes a verifiable chain-of-custody tracking natural dyes and ethical hand-spinning wages.",
      designBrief: "Develop a collection of 50 organic pashmina shawls utilizing only local plant extracts for color.",
      creativeProcess: "Raw wool sourced directly, hand-spun by a women's cooperative, dyed in wild herbs, and hand-woven.",
      traditionalKnowledgeApplied: "Sufi vat dye recipes, manual carding, and handloom draft weaving.",
      innovation: "Blockchain-enabled QR code tracing every shawl back to the specific nomadic herd.",
      materialAnalysis: "100% Changthangi Capra Hircus cashmere, averaging 13.8 microns.",
      sustainabilityAssessment: "Chemical-free wastewater, local organic dye stuff, and certified fair wages.",
      technicalDocumentation: "Dye formulation charts, fiber micro-photographs, and ledger records.",
      productionProcess: "Dehairing, hand spinning, herbal vat dyeing, loom setup, hand weaving, natural wash finishing.",
      challenges: "Consistency of natural dye shades across batches without chemical mordants.",
      outcomes: "Adopted by two European luxury houses; 40 spinning families secured double wages.",
      relatedCollections: "KHCRF-COL-2026-012",
      relatedArtisans: "Zehra Begum Profile",
      relatedDemonstrations: "KHCRF-CD-2026-003",
      relatedWorkshopDiaries: "KHCRF-WD-2026-008",
      bibliography: "Ethical Fibres and Heritage Weaves (2024).",
      rights: "Courtesy KHCRF & Maharaj Gunj Guild",
      matrix: {
        techniquesRetained: "Charkha hand spinning, wooden handloom weaving",
        materialsRetained: "Pure Changthangi pashm fiber, natural saffron & walnut dye",
        newMaterialsIntroduced: "Digital tracking tags",
        modernDesignAdaptations: "Solid minimalist colors, featherweight density",
        environmentalImprovements: "100% biodegradable dyes; zero synthetic chemicals",
        newApplications: "Ethical high fashion retail",
        educationalValue: "Natural dye safety booklets printed for local artisans",
        potentialWiderAdoption: "High value model for premium export houses"
      },
      sustainability: {
        primaryMaterials: "Changthangi Pashm fleece",
        materialOrigin: "Changthang high-altitude plains",
        renewableResources: "Yes, organic seasonal animal combing",
        wasteReductionMeasures: "Waste fiber collected and blended for coarse wool throws",
        energyConsiderations: "Zero fuel used in spinning/weaving; solar hot water for dyeing",
        packaging: "Recycled handmade cotton bags",
        repairability: "Mending support provided by Srinagar guild weavers",
        expectedLifespan: "80+ years with proper dry storage",
        environmentalConsiderations: "Fully organic, low carbon, zero waste production"
      },
      impact: {
        skillsPreserved: "Charkha hand-spinning, natural indigo and madder dyeing",
        apprenticesInvolved: "12 young spinning apprentices",
        womenArtisansEngaged: "32 women spinners in Downtown Srinagar",
        ruralEmploymentSupported: "Nomadic pastoralists and wild herb gatherers",
        exportMarketsReached: "Paris, Milan, London boutique retail",
        museumCollaborations: "Exhibited at the Geneva Sustainable Craft Forum",
        publicInstallations: "None",
        awardsReceived: "Global Green Craft Initiative Award 2024",
        researchPublicationsGenerated: "Spectroscopy of Kashmiri Natural Dyes (KHCRF)"
      },
      evaluation: {
        craftsmanshipStars: 5,
        innovationStars: 4,
        authenticityStars: 5,
        materialResponsibilityStars: 5,
        technicalComplexityStars: 4,
        culturalContinuityStars: 5,
        contemporaryRelevanceStars: 5,
        documentationQualityStars: 5,
        craftsmanshipNarrative: "Superb even tension from manual spinning, creating a perfectly balanced fabric.",
        innovationNarrative: "Digital verification solves provenance concerns without changing physical craft.",
        authenticityNarrative: "Strictly adheres to historical spinning and loom methods.",
        sustainabilityNarrative: "Sets the benchmark for zero chemical footprint in Kashmiri textile processing."
      }
    },
    {
      slug: "papier-mache-lighting",
      archiveNumber: "KHCRF-CE-2026-003",
      title: "Contemporary Papier-Mâché Lighting Collection",
      subtitle: "Traditional Painting Meets Interior Design",
      primaryCraft: "Papier-Mâché",
      secondaryCraft: "Metalwork",
      leadArtisan: "Riyaz Ahmad",
      collaboratingDesigners: "Numinous Design Studio",
      workshop: "Zadibal Atelier",
      district: "Srinagar",
      projectYear: "2025",
      projectCategory: "Contemporary Design",
      publicationVersion: "v1.2",
      docStatus: "Fully Documented",
      appCategory: "Furniture",
      sustainabilityRating: "Recycled Materials",
      recognition: "Jury Selection",
      desc: "A series of minimalist dome pendant lights hand-formed from recycled paper pulp and painted with botanical motifs. The interior is finished in gold leaf to optimize warm light emission, merging traditional Zadibal naqashi painting with contemporary functional home illumination.",
      whyRepresentsExcellence: "Adapts fragile papier-mâché shells into heat-resistant light fixtures utilizing natural pulp stabilizers.",
      designBrief: "Create a commercial range of ceiling pendants reflecting traditional miniature painting in modern residential spaces.",
      creativeProcess: "Moulding paper pulp over clay bases, drying, painting with mineral pigments, and applying heat-resistant lacquer.",
      traditionalKnowledgeApplied: "Sakhta paper moulding, Naqashi painting, mineral pigment blending.",
      innovation: "Integrated internal heat shield to prevent paper shell scorching from light bulbs.",
      materialAnalysis: "Recycled paper pulp, local clay binders, natural copal varnish, gold leaf lining.",
      sustainabilityAssessment: "Uses 100% post-consumer waste paper; zero plastic additives.",
      technicalDocumentation: "CAD drawings for structural mounts, lux emission reports.",
      productionProcess: "Clay mould preparation, pulp layering, drying, surface smoothing, naqashi painting, sealing.",
      challenges: "Achieving structural rigidity in thin-walled larger domes without artificial glues.",
      outcomes: "Commercial collection successfully launched in high-end design boutiques.",
      relatedCollections: "KHCRF-COL-2026-022",
      relatedArtisans: "Riyaz Ahmad Profile",
      relatedDemonstrations: "KHCRF-CD-2026-022",
      relatedWorkshopDiaries: "KHCRF-WD-2026-015",
      bibliography: "Interior Adaptation of Lacquerware (2024).",
      rights: "Courtesy KHCRF & Numinous Design",
      matrix: {
        techniquesRetained: "Sakhta paper pulp layering, hand-painted naqashi brushwork",
        materialsRetained: "Recycled paper pulp, gold leaf, mineral blue pigments",
        newMaterialsIntroduced: "Brass socket mounts, fireproof internal coatings",
        modernDesignAdaptations: "Large dome shapes, monochromatic exterior botanical line art",
        environmentalImprovements: "Sourced from local printing house waste paper",
        newApplications: "Residential and hospitality lighting fixtures",
        educationalValue: "Wiring safety and shell construction workshops",
        potentialWiderAdoption: "Highly reproducible for international lighting markets"
      },
      sustainability: {
        primaryMaterials: "Recycled pulp paper, brass, gold leaf",
        materialOrigin: "Srinagar printing houses, local metal benders",
        renewableResources: "Yes, paper waste",
        wasteReductionMeasures: "Pulp scraps continuously re-hydrated and reused",
        energyConsiderations: "Passive sun-drying of shells; zero kiln firing energy",
        packaging: "Compostable honeycomb paper wrap",
        repairability: "Pulp shells can be patched and repainted if damaged",
        expectedLifespan: "30+ years under dry indoor conditions",
        environmentalConsiderations: "Low energy fabrication, high recycled content"
      },
      impact: {
        skillsPreserved: "Sakhta moulding, fine lining naqashi work",
        apprenticesInvolved: "5 youth trained in paper pulp preparation",
        womenArtisansEngaged: "None directly in paint workshop, pulp prepared by family cooperatives",
        ruralEmploymentSupported: "Clay mould supply from rural potters",
        exportMarketsReached: "United States, Singapore design retail",
        museumCollaborations: "Featured in the New Delhi Craft Museum contemporary wing",
        publicInstallations: "Srinagar Heritage Hotel lobby",
        awardsReceived: "Design India Best Lighting Award nominee 2025",
        researchPublicationsGenerated: "Structural Papier-Mâché Domes (KHCRF 2026)"
      },
      evaluation: {
        craftsmanshipStars: 5,
        innovationStars: 5,
        authenticityStars: 4,
        materialResponsibilityStars: 5,
        technicalComplexityStars: 4,
        culturalContinuityStars: 5,
        contemporaryRelevanceStars: 5,
        documentationQualityStars: 5,
        craftsmanshipNarrative: "Exquisite brush work featuring micro-level botanical drawings across a curved exterior surface.",
        innovationNarrative: "Brilliantly solves heat dissipation, converting a traditional souvenir into a functional product.",
        authenticityNarrative: "Paintwork maintains historic motifs, though the color layout is simplified.",
        sustainabilityNarrative: "Using waste paper directly addresses landfill concerns; zero plastic binders used."
      }
    },
    {
      slug: "chinar-reinterpreted",
      archiveNumber: "KHCRF-CE-2026-004",
      title: "Chinar Reinterpreted",
      subtitle: "Modern Motifs Inspired by Classical Ornament",
      primaryCraft: "Sozni",
      secondaryCraft: "Embroidery",
      leadArtisan: "Fatima Jan",
      collaboratingDesigners: "Srinagar Design Lab",
      workshop: "Beerwah Sozni Collective",
      district: "Budgam",
      projectYear: "2024",
      projectCategory: "Contemporary Design",
      publicationVersion: "v1.0",
      appCategory: "Fashion",
      sustainabilityRating: "Natural Materials",
      recognition: "Jury Selection",
      docStatus: "Fully Documented",
      desc: "This design project reinterprets the classical Kashmiri Chinar leaf motif. Historically represented with dense naturalistic detail, the designers and master artisans have abstracted the shape into geometric lines, creating a contemporary visual language for modern fashion accessories.",
      whyRepresentsExcellence: "Simplifies complex organic lines into geometric stitch configurations without losing the precision of Sozni needlework.",
      designBrief: "Develop a modern geometric pattern system based on the Chinar leaf outline for home decor textile borders.",
      creativeProcess: "Designing geometric Chinar outlines, transfer via traditional chalk dust stencils, and hand-embroidering using fine silk thread.",
      traditionalKnowledgeApplied: "Chalk stencil transfer (woodblock block printing templates), needle stitch direction control.",
      innovation: "Introduced digital line-generation software to design block patterns, which were hand-embroidered.",
      materialAnalysis: "Handloom cotton linen base, naturally-dyed silk threads (dyed with onion skins and madder).",
      sustainabilityAssessment: "Linen fabric is locally sourced; dyes are biodegradable and non-toxic.",
      technicalDocumentation: "Stitch density mapping, pattern draft vector diagrams.",
      productionProcess: "Digital pattern design, printing template cutting, block stamping, hand embroidery, washing, steam pressing.",
      challenges: "Maintaining straight lines on hand-spun linen base since the weave is slightly irregular.",
      outcomes: "Released 12 accessory prototypes; adopted by Srinagar fashion startup for commercial production.",
      relatedCollections: "KHCRF-COL-2026-015",
      relatedArtisans: "Fatima Jan Profile",
      relatedDemonstrations: "KHCRF-CD-2026-004",
      relatedWorkshopDiaries: "KHCRF-WD-2026-022",
      bibliography: "Evolution of Motifs in Sozni Embroidery (2024).",
      rights: "Courtesy KHCRF & Beerwah Collective",
      matrix: {
        techniquesRetained: "Sozni fine needlework, woodblock pattern transfer",
        materialsRetained: "Silk thread, handloom cotton linen base",
        newMaterialsIntroduced: "Digital design software vector drafts",
        modernDesignAdaptations: "Geometric simplified outlines, negative space layouts",
        environmentalImprovements: "Wastewater-free natural dyeing on silk thread",
        newApplications: "Contemporary fashion shawls, linen pillows",
        educationalValue: "Geometric template guides published for training institutes",
        potentialWiderAdoption: "High interest among domestic luxury brands"
      },
      sustainability: {
        primaryMaterials: "Linen, Silk Thread",
        materialOrigin: "Budgam agricultural lands, Srinagar silk mills",
        renewableResources: "Yes, organic flax and silk cocoon harvests",
        wasteReductionMeasures: "Zero-waste stenciling using charcoal wash markers",
        energyConsiderations: "100% manual needlework; zero electrical consumption in production",
        packaging: "Unbleached cotton envelopes",
        repairability: "Embroidery threads can be individually replaced if damaged",
        expectedLifespan: "50+ years with proper hand washing",
        environmentalConsiderations: "Low carbon, biodegradable product"
      },
      impact: {
        skillsPreserved: "Sozni satin stitch precision",
        apprenticesInvolved: "8 young women artisans in Budgam",
        womenArtisansEngaged: "15 women in the Beerwah Collective",
        ruralEmploymentSupported: "Linen weavers in Ganderbal",
        exportMarketsReached: "Domestic metro markets (Delhi, Mumbai)",
        museumCollaborations: "None",
        publicInstallations: "None",
        awardsReceived: "Budgam Handicrafts Fair Innovation Award 2024",
        researchPublicationsGenerated: "Geometric Abstraction in Kashmiri Crafts (2025)"
      },
      evaluation: {
        craftsmanshipStars: 5,
        innovationStars: 4,
        authenticityStars: 5,
        materialResponsibilityStars: 5,
        technicalComplexityStars: 4,
        culturalContinuityStars: 5,
        contemporaryRelevanceStars: 5,
        documentationQualityStars: 5,
        craftsmanshipNarrative: "Stitch work is dense and completely uniform, with clean reverse side finishing.",
        innovationNarrative: "Geometric interpretation opens new modern interior markets for Sozni.",
        authenticityNarrative: "Strictly preserves the manual needlework tradition while refreshing the layout.",
        sustainabilityNarrative: "Plant-dyed silk threads eliminate hazardous dye compounds from village runoff."
      }
    },
    {
      slug: "contemporary-kani-studio",
      archiveNumber: "KHCRF-CE-2026-005",
      title: "The Contemporary Kani Studio",
      subtitle: "Traditional Technique, Contemporary Colour Language",
      primaryCraft: "Kani",
      secondaryCraft: "Pashmina",
      leadArtisan: "Mustafa Loom Guild",
      collaboratingDesigners: "Delhi Fashion Guild",
      workshop: "Kanihama Weaving Centre",
      district: "Budgam",
      projectYear: "2025",
      projectCategory: "Fashion",
      publicationVersion: "v2.0",
      docStatus: "Fully Documented",
      appCategory: "Fashion",
      sustainabilityRating: "Traditional Dyes",
      recognition: "Award Winner",
      desc: "This design project introduces an updated, contemporary color palette to Kani loom weaving. By substituting traditional jewel tones with soft earth tones and pastel hues, the studio creates modern Kani shawls designed to complement international fashion styling.",
      whyRepresentsExcellence: "Uses plant-dyed pashm threads to weave intricate kani motifs, adjusting code-reading talim sheets for modern coordinates.",
      designBrief: "Introduce soft minimal color palettes to traditional Kani weaves for global winter resort collections.",
      creativeProcess: "Formulating plant-based pastel dyes, recoding Kani talim scripts, and weaving on horizontal timber looms.",
      traditionalKnowledgeApplied: "Talim script writing, wooden shuttle tujis, double-warp loom setup.",
      innovation: "Adapted talim writing algorithms to support gradient color shifting.",
      materialAnalysis: "100% fine hand-spun pashm yarn, natural madder, wild pomegranate skins, and walnut bark.",
      sustainabilityAssessment: "All dyes are sourced locally; zero chemical effluents in wastewater.",
      technicalDocumentation: "Talim code registers, dye formula percentages.",
      productionProcess: "Yarn spinning, color dyeing, warp preparation, talim coding, twin-weaver loom work.",
      challenges: "Preventing thread breakage when weaving pastel-dyed pashm, which has slightly lower tensile strength.",
      outcomes: "Awarded Best Collection at the Delhi Fashion Guild 2025 show; 5 looms operational year-round.",
      relatedCollections: "KHCRF-COL-2026-020",
      relatedArtisans: "Mustafa Loom Guild Profile",
      relatedDemonstrations: "KHCRF-CD-2026-005",
      relatedWorkshopDiaries: "KHCRF-WD-2026-033",
      bibliography: "Color Dynamics in Himalayan Weaves (2025).",
      rights: "Courtesy KHCRF & Kanihama Guild",
      matrix: {
        techniquesRetained: "Double warp Kani weave, talim pattern reading",
        materialsRetained: "Fine hand-spun pashmina yarn",
        newMaterialsIntroduced: "None (focused strictly on colorway refinement)",
        modernDesignAdaptations: "Pastel color palettes, oversized border motifs",
        environmentalImprovements: "Replaced chemical synthetic dyes with organic plant dyes",
        newApplications: "High-end global luxury apparel",
        educationalValue: "Talim colorway manuals shared with village cooperatives",
        potentialWiderAdoption: "High commercial feasibility for export markets"
      },
      sustainability: {
        primaryMaterials: "Hand-spun Pashmina",
        materialOrigin: "Ladakh high pasturelands, Budgam dye house",
        renewableResources: "Yes, organic wool shearings",
        wasteReductionMeasures: "Ends of yarn re-spun for secondary weave borders",
        energyConsiderations: "Fully manual looms; zero electrical consumption",
        packaging: "Handmade cedarwood presentation boxes",
        repairability: "Re-weaving services guaranteed by the Budgam cooperative",
        expectedLifespan: "100+ years if kept moth-free",
        environmentalConsiderations: "Natural dye water is fully compostable"
      },
      impact: {
        skillsPreserved: "Kani shuttle weaving, talim notation",
        apprenticesInvolved: "6 young weavers trained in talim coding",
        womenArtisansEngaged: "18 women spinners in rural Budgam",
        ruralEmploymentSupported: "Spinners, weavers, and plant gatherers",
        exportMarketsReached: "Japan, North America boutique retail",
        museumCollaborations: "Shawls registered with the Tokyo Crafts Museum",
        publicInstallations: "None",
        awardsReceived: "National Weaving Excellence Award 2025",
        researchPublicationsGenerated: "Natural Dyeing of Pashm Fibres (KHCRF 2026)"
      },
      evaluation: {
        craftsmanshipStars: 5,
        innovationStars: 4,
        authenticityStars: 5,
        materialResponsibilityStars: 5,
        technicalComplexityStars: 5,
        culturalContinuityStars: 5,
        contemporaryRelevanceStars: 5,
        documentationQualityStars: 5,
        craftsmanshipNarrative: "Perfect weave density (32 warp threads/cm), showing clean color changes.",
        innovationNarrative: "Gradient color programming updates the aesthetic without changing the technique.",
        authenticityNarrative: "Maintains traditional talim coding and shuttle execution without digital looms.",
        sustainabilityNarrative: "100% plant dye usage eliminates hazardous heavy metal mordants."
      }
    },
    {
      slug: "copper-hospitality",
      archiveNumber: "KHCRF-CE-2026-006",
      title: "Copper for Contemporary Hospitality",
      subtitle: "Handcrafted Tableware for Modern Dining",
      primaryCraft: "Copperware",
      secondaryCraft: "Forging",
      leadArtisan: "Abdul Ahad Bhat",
      collaboratingDesigners: "Traam Studio",
      workshop: "Zaina Kadal Coppersmiths",
      district: "Srinagar",
      projectYear: "2024",
      projectCategory: "Interior Design",
      publicationVersion: "v1.5",
      docStatus: "Fully Documented",
      appCategory: "Hospitality",
      sustainabilityRating: "Circular Design",
      recognition: "Curator's Choice",
      desc: "This design project reinterprets traditional copperware for the modern hospitality sector. Master coppersmiths forged minimalist serving platters and bowls, substituting dense geometric engravings with clean, hand-hammered textures designed for high-end restaurants.",
      whyRepresentsExcellence: "Reduces visual noise to emphasize hand-hammering texture, ensuring thick tin lining (kalai) for food safety.",
      designBrief: "Develop a 200-piece food-safe copper tableware collection for an boutique organic restaurant.",
      creativeProcess: "Forging raw copper sheets, hand hammering to shape, applying hot-dip tin lining, and soft polish finishing.",
      traditionalKnowledgeApplied: "Hammer shaping, traditional hot-dip tin lining (Kalai work).",
      innovation: "Clean rim designs that resist bending under high-volume commercial dishwashing.",
      materialAnalysis: "Purity-grade copper, lead-free tin lining.",
      sustainabilityAssessment: "Made from 80% recycled scrap copper; tin liner is 100% recyclable.",
      technicalDocumentation: "Thickness profiles, food safety certification documents.",
      productionProcess: "Sheet cutting, hand raising, hammer texturing, degreasing, hot tin dipping, polishing.",
      challenges: "Maintaining uniform thickness on wide, flat platters raised entirely by hand.",
      outcomes: "Successfully installed in three luxury resorts; raised coppersmith daily wages by 40%.",
      relatedCollections: "KHCRF-COL-2026-025",
      relatedArtisans: "Abdul Ahad Bhat Profile",
      relatedDemonstrations: "KHCRF-CD-2026-015",
      relatedWorkshopDiaries: "KHCRF-WD-2026-042",
      bibliography: "Tinning Technology and Copper Tableware (2024).",
      rights: "Courtesy KHCRF & Traam Studio",
      matrix: {
        techniquesRetained: "Hand raising, hammer texturing, hot-tinning (Kalai)",
        materialsRetained: "High-grade copper, lead-free tin",
        newMaterialsIntroduced: "None (focused strictly on texture and form)",
        modernDesignAdaptations: "Minimalist shapes, zero surface engravings",
        environmentalImprovements: "Utilizes recycled copper sheets",
        newApplications: "Commercial restaurant tableware",
        educationalValue: "Food-safety tinning standards published online",
        potentialWiderAdoption: "High market potential for hotel supply chains"
      },
      sustainability: {
        primaryMaterials: "Recycled Copper, Pure Tin",
        materialOrigin: "Local metal recycling centers, Srinagar merchant imports",
        renewableResources: "Yes, fully circular metal loop",
        wasteReductionMeasures: "Copper trimmings melted down and re-rolled into sheets",
        energyConsiderations: "Charcoal forge used for annealing; hand-powered raising",
        packaging: "Biodegradable paper wraps",
        repairability: "Tin lining can be re-applied every 2 years in high-use settings",
        expectedLifespan: "Indefinite; metal is fully recyclable",
        environmentalConsiderations: "Zero plastic waste; low energy fabrication"
      },
      impact: {
        skillsPreserved: "Kalai hot-tinning, hand raising",
        apprenticesInvolved: "4 apprentices trained at the forge",
        womenArtisansEngaged: "None (traditional male smithing guild)",
        ruralEmploymentSupported: "None directly (Downtown Srinagar urban guild)",
        exportMarketsReached: "Middle East hotel markets",
        museumCollaborations: "None",
        publicInstallations: "Hospitality dining displays in Srinagar",
        awardsReceived: "Srinagar Craft Development Center Selection 2024",
        researchPublicationsGenerated: "Lead-Free Tinning Safety Audits (KHCRF 2025)"
      },
      evaluation: {
        craftsmanshipStars: 5,
        innovationStars: 4,
        authenticityStars: 5,
        materialResponsibilityStars: 5,
        technicalComplexityStars: 4,
        culturalContinuityStars: 5,
        contemporaryRelevanceStars: 5,
        documentationQualityStars: 5,
        craftsmanshipNarrative: "Hammermarks are perfectly aligned, creating a beautiful shimmering surface.",
        innovationNarrative: "Minimalist forms prove that copperware can fit modern food presentation.",
        authenticityNarrative: "Preserves the vital lead-free kalai tinning method for safety.",
        sustainabilityNarrative: "Recycled copper sourcing significantly lowers environmental extraction costs."
      }
    },
    {
      slug: "living-carpet-traditions",
      archiveNumber: "KHCRF-CE-2026-007",
      title: "Living Carpet Traditions",
      subtitle: "Custom Hand-Knotted Installations",
      primaryCraft: "Carpet",
      secondaryCraft: "Dyeing",
      leadArtisan: "Mohammad Maqbool",
      collaboratingDesigners: "Loom & Lattice",
      workshop: "Srinagar Master Weavers",
      district: "Srinagar",
      projectYear: "2025",
      projectCategory: "Architectural Integration",
      publicationVersion: "v1.9",
      docStatus: "Fully Documented",
      appCategory: "Residential Interiors",
      sustainabilityRating: "Traditional Dyes",
      recognition: "Curator's Choice",
      desc: "This project documents a large-scale contemporary carpet hand-knotted for architectural interiors. Reinterpreting traditional medallion plans, the weavers introduced gradient color transitions and varied pile heights to create a three-dimensional landscape effect.",
      whyRepresentsExcellence: "Balances traditional high-density knotting (324 knots/sq inch) with modern structural pile shearing.",
      designBrief: "Create a 5x4 meter custom installation carpet featuring organic topographical landscape patterns.",
      creativeProcess: "Mapping topography into talim notation, dyeing hand-spun wool with local plants, and weaving on upright timber looms.",
      traditionalKnowledgeApplied: "Upright loom setup, hand-knotting, talim reading, natural dyeing.",
      innovation: "Differential high-low pile shearing to create tactile 3D topography.",
      materialAnalysis: "Fine Merino wool pile, handloom cotton warp, natural madder and walnut dye.",
      sustainabilityAssessment: "No synthetic chemical wash treatment used; naturally mothproofed using wild herbs.",
      technicalDocumentation: "Shearing height profiles, talim pattern maps.",
      productionProcess: "Loom assembly, warp tensioning, talim script reading, knotting, washing, differential shearing.",
      challenges: "Translating asymmetrical topographical lines into talim codes, which are traditionally symmetrical.",
      outcomes: "Completed installation featured in international architectural journals.",
      relatedCollections: "KHCRF-COL-2026-030",
      relatedArtisans: "Mohammad Maqbool Profile",
      relatedDemonstrations: "KHCRF-CD-2026-001",
      relatedWorkshopDiaries: "KHCRF-WD-2026-048",
      bibliography: "Topographical Weaving and Architectural Carpets (2024).",
      rights: "Courtesy KHCRF & Loom & Lattice",
      matrix: {
        techniquesRetained: "Hand-knotting, talim design notation, organic wash finish",
        materialsRetained: "Hand-spun wool, cotton warp threads",
        newMaterialsIntroduced: "None",
        modernDesignAdaptations: "Topographical pattern layouts, asymmetrical gradients",
        environmentalImprovements: "Eliminated chlorinated chemical washes",
        newApplications: "Luxury custom architectural floor art",
        educationalValue: "Topographical talim templates published for weaver guild schools",
        potentialWiderAdoption: "High commercial value for custom architectural commissions"
      },
      sustainability: {
        primaryMaterials: "Hand-spun Merino wool, cotton thread",
        materialOrigin: "Local valley farmers, Ganderbal dye houses",
        renewableResources: "Yes, organic wool harvests",
        wasteReductionMeasures: "Wool clippings collected and processed for felt NAMDA rugs",
        energyConsiderations: "100% hand crafted; zero electrical footprint in weaving",
        packaging: "Canvas linen rolls, zero plastic wraps",
        repairability: "Individual knots can be re-knotted and patched if worn",
        expectedLifespan: "120+ years under residential use",
        environmentalConsiderations: "Biodegradable, local material cycle"
      },
      impact: {
        skillsPreserved: "High-density hand knotting, organic dye blending",
        apprenticesInvolved: "5 young weavers trained in differential shearing",
        womenArtisansEngaged: "None in weaving, 8 rural women in wool carding/spinning",
        ruralEmploymentSupported: "Rural wool spinners and dye gatherers",
        exportMarketsReached: "North American architectural commissions",
        museumCollaborations: "None",
        publicInstallations: "Private architectural showrooms",
        awardsReceived: "Srinagar Craft Council Innovation Prize 2025",
        researchPublicationsGenerated: "Topographical Weaving Systems (KHCRF 2026)"
      },
      evaluation: {
        craftsmanshipStars: 5,
        innovationStars: 5,
        authenticityStars: 5,
        materialResponsibilityStars: 5,
        technicalComplexityStars: 5,
        culturalContinuityStars: 5,
        contemporaryRelevanceStars: 5,
        documentationQualityStars: 5,
        craftsmanshipNarrative: "Stunning precision in knotting density and differential pile heights.",
        innovationNarrative: "First recorded use of 3D topography in Kashmiri carpet weaving.",
        authenticityNarrative: "Maintains traditional talim structures, but scales the design asymmetrically.",
        sustainabilityNarrative: "Eliminating synthetic wash chemicals protects local weavers from skin issues."
      }
    },
    {
      slug: "new-voices-sozni",
      archiveNumber: "KHCRF-CE-2026-008",
      title: "New Voices in Sozni Embroidery",
      subtitle: "Emerging Women Artisans",
      primaryCraft: "Sozni",
      secondaryCraft: "Embroidery",
      leadArtisan: "Sobia Jan",
      collaboratingDesigners: "Kashmir Women Crafts Trust",
      workshop: "Ganderbal Embroidery Centre",
      district: "Ganderbal",
      projectYear: "2024",
      projectCategory: "Living Heritage",
      publicationVersion: "v1.1",
      docStatus: "Fully Documented",
      appCategory: "Fashion",
      sustainabilityRating: "Natural Materials",
      recognition: "Award Winner",
      desc: "This project documents how a cooperative of emerging women artisans in Ganderbal developed contemporary fashion accessories using traditional Sozni stitches. Historically, Sozni was dominated by male artisans; this collective empowers women through training and design collaboration.",
      whyRepresentsExcellence: "Facilitates independent income and professional design credentials for women artisans.",
      designBrief: "Train 20 young women in rural Ganderbal to produce modern embroidered stoles using local silk threads.",
      creativeProcess: "Pattern design workshops, thread sorting, natural dyeing, stenciling, hand embroidery.",
      traditionalKnowledgeApplied: "Traditional sozni stitches (satin stitch, herringbone stitch), woodblock stenciling.",
      innovation: "Introduced ergonomic seating and high-lux solar lamps to reduce eye strain in home workshops.",
      materialAnalysis: "Local fine wool base fabric, vegetable-dyed silk threads.",
      sustainabilityAssessment: "Low-impact natural dyes, solar-powered home workshop systems.",
      technicalDocumentation: "Economic impact sheets, ergonomic workshop layouts.",
      productionProcess: "Base fabric preparation, woodblock stencil transfer, hand embroidery, quality audit, press finishing.",
      challenges: "Overcoming local cultural barriers against women working in professional commercial ateliers.",
      outcomes: "24 women secured stable incomes; collection sold out at Delhi craft fair.",
      relatedCollections: "KHCRF-COL-2026-042",
      relatedArtisans: "Sobia Jan Profile",
      relatedDemonstrations: "KHCRF-CD-2026-009",
      relatedWorkshopDiaries: "KHCRF-WD-2026-054",
      bibliography: "Gender Roles and Economic Shifts in Kashmir Crafts (2023).",
      rights: "Courtesy KHCRF & Women Crafts Trust",
      matrix: {
        techniquesRetained: "Sozni embroidery stitches, woodblock layout transfer",
        materialsRetained: "Silk thread, wool base fabric",
        newMaterialsIntroduced: "Solar-powered task lighting, ergonomic floor cushions",
        modernDesignAdaptations: "Asymmetrical pattern placement, monochrome layouts",
        environmentalImprovements: "Clean natural dyes; zero plastic workspace components",
        newApplications: "Modern stoles, scarves, and table linens",
        educationalValue: "Ergonomic health guidelines printed and distributed",
        potentialWiderAdoption: "Excellent model for rural women craft empowerment"
      },
      sustainability: {
        primaryMaterials: "Local Wool, Silk Thread",
        materialOrigin: "Ganderbal rural sheep farms, local cocoons",
        renewableResources: "Yes, organic wool and silk",
        wasteReductionMeasures: "Thread scraps recycled for children's embroidery classes",
        energyConsiderations: "Solar-charged task lights reduce reliance on grid coal power",
        packaging: "Cotton drawstring bags sewn by apprentices",
        repairability: "Guaranteed free stitch repair for five years",
        expectedLifespan: "60+ years with gentle care",
        environmentalConsiderations: "Zero effluent, low carbon fabrication"
      },
      impact: {
        skillsPreserved: "Traditional Sozni stitch configurations",
        apprenticesInvolved: "24 young women apprentices",
        womenArtisansEngaged: "24 women weavers and embroiderers",
        ruralEmploymentSupported: "Empowers rural Ganderbal artisan families",
        exportMarketsReached: "Domestic luxury craft markets",
        museumCollaborations: "Featured in the Delhi Crafts Museum special display",
        publicInstallations: "None",
        awardsReceived: "National Craft Empowerment Award 2024",
        researchPublicationsGenerated: "Ergonomics and Women in Handcrafts (2025)"
      },
      evaluation: {
        craftsmanshipStars: 4,
        innovationStars: 5,
        authenticityStars: 5,
        materialResponsibilityStars: 5,
        technicalComplexityStars: 4,
        culturalContinuityStars: 5,
        contemporaryRelevanceStars: 5,
        documentationQualityStars: 5,
        craftsmanshipNarrative: "Clean stitch tension and detail, proving excellent training quality.",
        innovationNarrative: "Ergonomic adjustments significantly reduce occupational fatigue.",
        authenticityNarrative: "Preserves identical stitch types historically used on court shawls.",
        sustainabilityNarrative: "Use of local wool and solar power is highly responsible."
      }
    },
    {
      slug: "willow-beyond-basketry",
      archiveNumber: "KHCRF-CE-2026-009",
      title: "Willow Beyond Basketry",
      subtitle: "Contemporary Functional Design",
      primaryCraft: "Willow Wicker",
      secondaryCraft: "Joinery",
      leadArtisan: "Ghulam Rasool",
      collaboratingDesigners: "Srinagar Furniture Collective",
      workshop: "Shallabugh Willow Cooperative",
      district: "Ganderbal",
      projectYear: "2025",
      projectCategory: "Functional Design",
      publicationVersion: "v1.4",
      docStatus: "Fully Documented",
      appCategory: "Furniture",
      sustainabilityRating: "Responsible Forestry",
      recognition: "Curator's Choice",
      desc: "This project documents how Shallabugh willow weavers collaborated with furniture designers to create minimalist wicker lounge chairs. By combining bentwood willow structural frames with tight hand-woven wicker paneling, the cooperative creates modern indoor furniture.",
      whyRepresentsExcellence: "Successfully transitions willow from cheap ephemera baskets to high-value indoor furniture components.",
      designBrief: "Design a lightweight, durable wicker lounge chair for contemporary residential living spaces.",
      creativeProcess: "Harvesting local willow, boiling, peeling, bending thick structural rods, and hand-weaving panels.",
      traditionalKnowledgeApplied: "Willow boiling and peeling, complex wicker weave patterns.",
      innovation: "Reinforced structural joints utilizing hidden copper pins instead of traditional plastic bindings.",
      materialAnalysis: "Shallabugh organic willow rods, copper reinforcement pins.",
      sustainabilityAssessment: "Willow is a highly renewable, rapid-growth crop; zero chemical paints.",
      technicalDocumentation: "Stress load calculations, blueprints for modular joinery.",
      productionProcess: "Willow harvesting, steam boiling, hand peeling, framework bending, weave skin panels, assembly.",
      challenges: "Ensuring load-bearing capability of willow frames under continuous daily weight stress.",
      outcomes: "Launched three furniture designs; acquired by national luxury hotels.",
      relatedCollections: "KHCRF-COL-2026-068",
      relatedArtisans: "Ghulam Rasool Profile",
      relatedDemonstrations: "KHCRF-CD-2026-062",
      relatedWorkshopDiaries: "KHCRF-WD-2026-072",
      bibliography: "Willow Cultivation and Design Evolution (2024).",
      rights: "Courtesy KHCRF & Shallabugh Cooperative",
      matrix: {
        techniquesRetained: "Willow boiling, skin peeling, hand weaving patterns",
        materialsRetained: "Local Shallabugh willow rods",
        newMaterialsIntroduced: "Copper structural pins, felt glides",
        modernDesignAdaptations: "Lounge chair shapes, minimalist geometrical lines",
        environmentalImprovements: "Organic harvest cycles; zero synthetic varnish coats",
        newApplications: "Contemporary residential and resort furniture",
        educationalValue: "Structural wicker blueprints shared with village councils",
        potentialWiderAdoption: "Excellent potential for rural community workspace clusters"
      },
      sustainability: {
        primaryMaterials: "Organic Willow Wicker",
        materialOrigin: "Shallabugh village wetlands",
        renewableResources: "Yes, willow harvests regenerate annually",
        wasteReductionMeasures: "Willow bark waste used as organic compost for next crop",
        energyConsiderations: "Low-energy wood-fired boiling vat; manual hand weaving",
        packaging: "Recyclable cardboard boxes, paper padding",
        repairability: "Wicker weave skin can be unraveled and re-woven easily",
        expectedLifespan: "25+ years if kept dry",
        environmentalConsiderations: "Negative carbon footprint; 100% biodegradable materials"
      },
      impact: {
        skillsPreserved: "Wicker panel weaving, rod bending",
        apprenticesInvolved: "7 young weavers in Shallabugh",
        womenArtisansEngaged: "None in framing; 10 women in peeling/preparation",
        ruralEmploymentSupported: "Wetland willow growers and harvest collectors",
        exportMarketsReached: "Middle East hospitality markets",
        museumCollaborations: "None",
        publicInstallations: "Resort lobbies in Srinagar and Gulmarg",
        awardsReceived: "Shallabugh Cooperative Development Prize 2024",
        researchPublicationsGenerated: "Mechanical Limits of Willow Wicker (2025)"
      },
      evaluation: {
        craftsmanshipStars: 5,
        innovationStars: 5,
        authenticityStars: 5,
        materialResponsibilityStars: 5,
        technicalComplexityStars: 4,
        culturalContinuityStars: 5,
        contemporaryRelevanceStars: 5,
        documentationQualityStars: 5,
        craftsmanshipNarrative: "Stunningly tight weave with zero visible split willow fibers.",
        innovationNarrative: "Use of copper pins elevates structural strength to premium furniture levels.",
        authenticityNarrative: "Preserves the historical Shallabugh weaving techniques completely.",
        sustainabilityNarrative: "Willow is exceptionally renewable, making this a highly green product."
      }
    },
    {
      slug: "reviving-namda-felt",
      archiveNumber: "KHCRF-CE-2026-010",
      title: "Reviving Namda Through Sustainable Interiors",
      subtitle: "Traditional Felting in Modern Homes",
      primaryCraft: "Namda",
      secondaryCraft: "Embroidery",
      leadArtisan: "Habibullah Felt Guild",
      collaboratingDesigners: "Noma Interiors",
      workshop: "Anantnag Felt Guild",
      district: "Anantnag",
      projectYear: "2024",
      projectCategory: "Sustainable Practice",
      publicationVersion: "v1.2",
      docStatus: "Fully Documented",
      appCategory: "Residential Interiors",
      sustainabilityRating: "Recycled Materials",
      recognition: "Jury Selection",
      desc: "This project documents the revival of traditional felted wool Namda rugs. Master artisans collaborated with interior designers to create minimalist geometric acoustic panels and rugs, utilizing coarse sheep wool that was historically discarded.",
      whyRepresentsExcellence: "Converts coarse waste wool into high-performance acoustic felt panels using manual rolling techniques.",
      designBrief: "Create a range of geometric felted panels for contemporary office space acoustics.",
      creativeProcess: "Layering raw wool, soap-water spray, manual rolling, sun drying, and minimal modern chain stitching.",
      traditionalKnowledgeApplied: "Wool felting layers, soap rolling, manual embroidery stitching.",
      innovation: "Formulated an organic flame-retardant solution to meet architectural fire codes.",
      materialAnalysis: "Coarse indigenous wool, vegetable-dyed wool yarn.",
      sustainabilityAssessment: "Utilizes waste wool; zero synthetic acoustic foam fillers.",
      technicalDocumentation: "Acoustic decibel absorption tests, fire safety ratings.",
      productionProcess: "Wool cleaning, carding, layering, soap felting, compression rolling, drying, embroidery.",
      challenges: "Achieving uniform density on large felt panels without industrial hydraulic presses.",
      outcomes: "Installed in three eco-friendly corporate offices; revived felt industry in Anantnag.",
      relatedCollections: "KHCRF-COL-2026-038",
      relatedArtisans: "Habibullah Felt Guild Profile",
      relatedDemonstrations: "KHCRF-CD-2026-035",
      relatedWorkshopDiaries: "KHCRF-WD-2026-081",
      bibliography: "Acoustic Felting and Traditional Rugs (2024).",
      rights: "Courtesy KHCRF & Noma Interiors",
      matrix: {
        techniquesRetained: "Soap-water hand-pressing, manual rolling, wool carding",
        materialsRetained: "Coarse local sheep wool, organic dye yarn",
        newMaterialsIntroduced: "Natural fireproofing solutions",
        modernDesignAdaptations: "Monochromatic geometric color blocks, square panels",
        environmentalImprovements: "Brings industrial value to previously discarded local wool",
        newApplications: "Acoustic wall panels, minimalist modern floor rugs",
        educationalValue: "Felt-pressing efficiency classes established in Anantnag",
        potentialWiderAdoption: "Excellent potential for green building insulation"
      },
      sustainability: {
        primaryMaterials: "Coarse Sheep Wool",
        materialOrigin: "Anantnag rural sheep herds",
        renewableResources: "Yes, organic wool shearings",
        wasteReductionMeasures: "Waste wool fibers collected and re-felted; zero waste",
        energyConsiderations: "Sun-dried felt; hand pressed without energy grid consumption",
        packaging: "Jute bags and paper rope tie",
        repairability: "Felt can be re-pressed or spot repaired easily",
        expectedLifespan: "40+ years under interior wall conditions",
        environmentalConsiderations: "Low-impact dye wastewater; fully compostable felt"
      },
      impact: {
        skillsPreserved: "Manual Namda soap-rolling, chain stitch embroidery",
        apprenticesInvolved: "9 young felters trained",
        womenArtisansEngaged: "None in felting; 12 women in embroidery detailing",
        ruralEmploymentSupported: "Anantnag sheep farmers and wool gatherers",
        exportMarketsReached: "European eco-office interior projects",
        museumCollaborations: "None",
        publicInstallations: "National Green Office showcase in New Delhi",
        awardsReceived: "Eco-Design India Prize nominee 2024",
        researchPublicationsGenerated: "Acoustic Absorption of Natural Kashmiri Felt (2025)"
      },
      evaluation: {
        craftsmanshipStars: 4,
        innovationStars: 5,
        authenticityStars: 5,
        materialResponsibilityStars: 5,
        technicalComplexityStars: 4,
        culturalContinuityStars: 5,
        contemporaryRelevanceStars: 5,
        documentationQualityStars: 5,
        craftsmanshipNarrative: "Felt density is highly stable and uniform, with excellent embroidery detailing.",
        innovationNarrative: "Applies felt to modern office acoustics, opening a major new market.",
        authenticityNarrative: "Strictly adheres to manual pressing without mechanical needle felters.",
        sustainabilityNarrative: "Highly sustainable, using discarded coarse wool that has zero food competition."
      }
    },
    {
      slug: "craft-meets-digital",
      archiveNumber: "KHCRF-CE-2026-011",
      title: "Craft Meets Digital Design",
      subtitle: "Collaborative Pattern Development",
      primaryCraft: "Mixed Craft",
      secondaryCraft: "Digital Design",
      leadArtisan: "Downtown Craft Collaborative",
      collaboratingDesigners: "Sufi Pulse Digital",
      workshop: "KHCRF Research Hub",
      district: "Srinagar",
      projectYear: "2025",
      projectCategory: "Technical Innovation",
      publicationVersion: "v1.0",
      docStatus: "Fully Documented",
      appCategory: "Fine Art",
      sustainabilityRating: "Natural Materials",
      recognition: "Jury Selection",
      desc: "This technical project bridges digital code and physical craft. Generative design algorithms were used to generate evolving patterns that were then interpreted and executed by master papier-mâché and wood carving artisans, showing how digital creativity can inspire living heritage.",
      whyRepresentsExcellence: "Uses generative math algorithms to feed traditional wood blocks and painting layouts.",
      designBrief: "Develop a generative design pipeline that output prints compatible with traditional woodblock templates.",
      creativeProcess: "Coding design variables, generating pattern options, rendering, transferring to wood blocks, carving, and painting.",
      traditionalKnowledgeApplied: "Hand block carving, mineral paint mixing.",
      innovation: "Algorithmically generated pattern vectors that remain compatible with hand carving tools.",
      materialAnalysis: "Handmade mulberry paper, mineral paints, walnut blocks.",
      sustainabilityAssessment: "Low waste; patterns are digitally iterated before printing.",
      technicalDocumentation: "Algorithm source codes, block carving blueprints.",
      productionProcess: "Generative code execution, block printing, woodblock carving, paint application.",
      challenges: "Coding vectors that match the maximum curvature limits of traditional hand carving chisels.",
      outcomes: "Exhibited at digital art fairs; created 3 permanent community design libraries.",
      relatedCollections: "KHCRF-COL-2026-052",
      relatedArtisans: "Downtown Srinagar Artisans",
      relatedDemonstrations: "KHCRF-CD-2026-064",
      relatedWorkshopDiaries: "KHCRF-WD-2026-092",
      bibliography: "Generative Algorithms and Manual Handcrafts (2025).",
      rights: "Courtesy KHCRF & Sufi Pulse Digital",
      matrix: {
        techniquesRetained: "Woodblock block printing, manual naqashi painting",
        materialsRetained: "Seasoned walnut wood blocks, mineral blue pigments",
        newMaterialsIntroduced: "Generative algorithm code sheets, laser-etched transfer templates",
        modernDesignAdaptations: "Fractal pattern layouts, mathematically morphing panels",
        environmentalImprovements: "Reduced raw material scrap by digitally pre-testing fits",
        newApplications: "Digital art exhibitions, corporate interior panels",
        educationalValue: "Coding workshops hosted for young artisan families",
        potentialWiderAdoption: "Excellent concept for premium custom branding"
      },
      sustainability: {
        primaryMaterials: "Walnut Wood, Pigment Inks",
        materialOrigin: "Srinagar wood depot, natural dye sources",
        renewableResources: "Yes, certified wood block materials",
        wasteReductionMeasures: "Digital previewing eliminates paper prototype waste",
        energyConsiderations: "Low-power digital screen mockups; manual hand block execution",
        packaging: "Recyclable cardboard tubes",
        repairability: "Wood blocks can be shaved and re-carved; paint layers touch-up",
        expectedLifespan: "50+ years for painted wood artworks",
        environmentalConsiderations: "Low physical waste due to digital optimization"
      },
      impact: {
        skillsPreserved: "Hand block carving, traditional naqashi line work",
        apprenticesInvolved: "4 digital design apprentices",
        womenArtisansEngaged: "None in block carving, 3 women in naqashi painting",
        ruralEmploymentSupported: "None directly (Downtown Srinagar urban digital hub)",
        exportMarketsReached: "Global digital design platforms",
        museumCollaborations: "Digital registry shared with national archives",
        publicInstallations: "Digital craft exhibit in Delhi Design Hub",
        awardsReceived: "Craft and Tech Integration Award nominee 2025",
        researchPublicationsGenerated: "Coding Heritage: Algorithms in Handcrafts (2026)"
      },
      evaluation: {
        craftsmanshipStars: 4,
        innovationStars: 5,
        authenticityStars: 4,
        materialResponsibilityStars: 4,
        technicalComplexityStars: 5,
        culturalContinuityStars: 4,
        contemporaryRelevanceStars: 5,
        documentationQualityStars: 5,
        craftsmanshipNarrative: "Stitch-perfect block transfers and beautifully executed naqashi lines.",
        innovationNarrative: "Brilliantly connects digital design with hand tools, showing potential futures.",
        authenticityNarrative: "Preserves hand painting and block carving, replacing only manual layouts.",
        sustainabilityNarrative: "Digital pre-iteration reduces prototype iterations and material waste."
      }
    },
    {
      slug: "heritage-public-spaces",
      archiveNumber: "KHCRF-CE-2026-012",
      title: "Heritage for Public Spaces",
      subtitle: "Craft Installations in Civic Architecture",
      primaryCraft: "Mixed Craft",
      secondaryCraft: "Metalwork",
      leadArtisan: "Srinagar Guild Coalition",
      collaboratingDesigners: "Municipal Civic Design Office",
      workshop: "City Center Crafts",
      district: "Srinagar",
      projectYear: "2026",
      projectCategory: "Public Art",
      publicationVersion: "v1.0",
      docStatus: "Fully Documented",
      appCategory: "Public Art",
      sustainabilityRating: "Circular Design",
      recognition: "Award Winner",
      desc: "This major public art project documents the creation of large-scale craft installations inside civic buildings. Combining copperware, khatamband joinery, and brickwork, the collective designed public murals celebrating Srinagar's craft status.",
      whyRepresentsExcellence: "Demonstrates that traditional craft can survive at scale inside public spaces without losing quality.",
      designBrief: "Develop a public art installation for the main lobby of the Srinagar Civic Office.",
      creativeProcess: "Structural planning, scale drawings, forging copper panels, interlocking wooden grids, and wall mount assembly.",
      traditionalKnowledgeApplied: "Khatamband interlocking joints, hand-chased copper reliefs.",
      innovation: "Integrated structural backing allowing the massive timber installation to withstand earthquakes.",
      materialAnalysis: "Forged copper, pine wood khatamband blocks, steel backing.",
      sustainabilityAssessment: "Uses recyclable copper and local pine; low-emission natural varnishes.",
      technicalDocumentation: "Structural load calculations, earthquake shear safety approvals.",
      productionProcess: "Metal forging, woodwork, modular backing alignment, public wall mount assembly.",
      challenges: "Managing structural weight and meeting safety regulations for overhead installations in public zones.",
      outcomes: "Completed mural seen by thousands daily; highly praised by regional urban planners.",
      relatedCollections: "KHCRF-COL-2026-058",
      relatedArtisans: "Srinagar Guild Coalition Masters",
      relatedDemonstrations: "KHCRF-CD-2026-068",
      relatedWorkshopDiaries: "KHCRF-WD-2026-096",
      bibliography: "Craft in Public Space: Murals and Architecture (2025).",
      rights: "Courtesy KHCRF & Municipal Design Office",
      matrix: {
        techniquesRetained: "Khatamband timber joinery, copper engraving",
        materialsRetained: "Pine wood, forged copper",
        newMaterialsIntroduced: "Steel backing panels, heavy-duty toggle bolts",
        modernDesignAdaptations: "Abstract geometric map layout of Srinagar",
        environmentalImprovements: "Utilizes non-toxic natural waxes; zero VOC emissions",
        newApplications: "Public lobbies, municipal building decoration",
        educationalValue: "Public explanation plaque installed at eye level",
        potentialWiderAdoption: "Excellent blueprint for public transport hubs"
      },
      sustainability: {
        primaryMaterials: "Pine wood, Copper",
        materialOrigin: "Local valley timber yards, recycled metal markets",
        renewableResources: "Yes, fast-growing pine",
        wasteReductionMeasures: "Pine scraps collected for community heating",
        energyConsiderations: "Low energy manual assembly; zero heavy milling tools",
        packaging: "Crated in reusable wooden transit boxes",
        repairability: "Individual timber blocks can be popped out and replaced if damaged",
        expectedLifespan: "80+ years under building shelter",
        environmentalConsiderations: "Biodegradable timber, recyclable copper, low-carbon"
      },
      impact: {
        skillsPreserved: "Interlocking joint construction, metal chasing",
        apprenticesInvolved: "12 youth trained in site installation",
        womenArtisansEngaged: "None directly",
        ruralEmploymentSupported: "Rural lumberyards and log transport networks",
        exportMarketsReached: "None (designed strictly for domestic public space)",
        museumCollaborations: "Exhibition drawings registered with the State Museum",
        publicInstallations: "Srinagar Municipal Office main lobby",
        awardsReceived: "Urban Civic Art Excellence Prize 2026",
        researchPublicationsGenerated: "Structural Joinery in Civic Art (KHCRF 2026)"
      },
      evaluation: {
        craftsmanshipStars: 5,
        innovationStars: 5,
        authenticityStars: 5,
        materialResponsibilityStars: 4,
        technicalComplexityStars: 5,
        culturalContinuityStars: 5,
        contemporaryRelevanceStars: 5,
        documentationQualityStars: 5,
        craftsmanshipNarrative: "Absolute precision in interlocking wood points and beautifully finished copper edges.",
        innovationNarrative: "Solves structural mounting, proving craft can scale into heavy public spaces.",
        authenticityNarrative: "Utilizes historical pine joint structures exactly, simply scaling the assembly.",
        sustainabilityNarrative: "Sourced locally with zero chemical sealants, protecting indoor air quality."
      }
    }
  ]);

  const [loading] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCraft, setSelectedCraft] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedApplication, setSelectedApplication] = useState('All');
  const [selectedSustainability, setSelectedSustainability] = useState('All');
  const [selectedRecognition, setSelectedRecognition] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Featured');

  const [activeProject, setActiveProject] = useState<ContemporaryProject | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'overview' | 'matrix' | 'process' | 'sustainability' | 'impact' | 'relations'>('overview');
  const [currentView, setCurrentView] = useState<'showcase' | 'gallery' | 'catalogue'>('showcase');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Nomination form state
  const [nominationForm, setNominationForm] = useState({
    title: '',
    craft: '',
    leadArtisan: '',
    collaborators: '',
    year: '',
    innovationSummary: '',
    materialsUsed: '',
    sustainabilityFeatures: '',
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
        leadArtisan: '',
        collaborators: '',
        year: '',
        innovationSummary: '',
        materialsUsed: '',
        sustainabilityFeatures: '',
        documentation: '',
        contact: ''
      });
    }, 4000);
  };

  const filteredProjects = allProjects.filter(p => {
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchText = `${p.title} ${p.subtitle} ${p.archiveNumber} ${p.primaryCraft} ${p.leadArtisan} ${p.collaboratingDesigners} ${p.workshop} ${p.district} ${p.desc} ${p.whyRepresentsExcellence}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    // Craft filter
    if (selectedCraft !== 'All') {
      if (p.primaryCraft !== selectedCraft && p.secondaryCraft !== selectedCraft) return false;
    }

    // Category filter
    if (selectedCategory !== 'All' && p.projectCategory !== selectedCategory) return false;

    // Application filter
    if (selectedApplication !== 'All' && p.appCategory !== selectedApplication) return false;

    // Sustainability filter
    if (selectedSustainability !== 'All') {
      if (selectedSustainability === 'Natural Materials' && p.sustainability.primaryMaterials.toLowerCase().includes('synthetic')) return false;
      if (selectedSustainability === 'Traditional Dyes' && p.sustainabilityRating !== 'Traditional Dyes') return false;
      if (selectedSustainability === 'Responsible Forestry' && p.sustainabilityRating !== 'Responsible Forestry') return false;
      if (selectedSustainability === 'Recycled Materials' && p.sustainabilityRating !== 'Recycled Materials') return false;
      if (selectedSustainability === 'Zero Waste Practice' && !p.sustainability.wasteReductionMeasures.toLowerCase().includes('zero')) return false;
    }

    // Recognition filter
    if (selectedRecognition !== 'All' && p.recognition !== selectedRecognition) return false;

    // Status filter
    if (selectedStatus !== 'All' && p.docStatus !== selectedStatus) return false;

    return true;
  });

  // Sorting
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (selectedSort === 'Recently Added') {
      return b.archiveNumber.localeCompare(a.archiveNumber);
    }
    if (selectedSort === 'Most Studied') {
      return b.evaluation.documentationQualityStars - a.evaluation.documentationQualityStars;
    }
    if (selectedSort === 'Curator\'s Selection') {
      return a.recognition === 'Curator\'s Choice' ? -1 : 1;
    }
    if (selectedSort === 'Alphabetical') {
      return a.title.localeCompare(b.title);
    }
    if (selectedSort === 'Craft') {
      return a.primaryCraft.localeCompare(b.primaryCraft);
    }
    if (selectedSort === 'Publication Date') {
      return b.projectYear.localeCompare(a.projectYear);
    }
    // Default: Featured
    return b.evaluation.craftsmanshipStars - a.evaluation.craftsmanshipStars;
  });

  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);
  const paginatedProjects = sortedProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const featuredProject = allProjects[0]; // Walnut Wood Project

  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pb-24 animate-fadeIn">
      
      {/* Detailed Modal Registry Sheet */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#3E2723]/40 backdrop-blur-sm" onClick={() => setActiveProject(null)}></div>
          <div className="relative z-10 bg-[#FAF9F6] border-2 border-[#3E2723] max-w-3xl w-full p-6 md:p-8 shadow-2xl text-[#2A2A2A] max-h-[95vh] overflow-y-auto custom-scrollbar font-mono rounded-xs" role="dialog" aria-modal="true">
            <button onClick={() => setActiveProject(null)} className="absolute top-4 right-4 text-[#3E2723]/50 hover:text-[#3E2723] text-xl font-bold font-mono">&times;</button>
            
            <div className="text-center mb-6 border-b border-[#3E2723]/25 pb-4">
              <span className="text-[#D4AF37] font-mono text-xs uppercase tracking-widest block mb-1 font-bold">KHCRF CONTEMPORARY EXCELLENCE REGISTRY</span>
              <h2 className="text-xl md:text-2xl font-serif text-[#3E2723] font-bold leading-tight">{activeProject.title}</h2>
              {activeProject.subtitle && <p className="text-gray-550 text-xs italic font-serif mt-1">{activeProject.subtitle}</p>}
              
              <div className="flex flex-wrap justify-center gap-2 mt-3 font-mono text-[9px] uppercase tracking-wider text-gray-500">
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">ACCESSION: {activeProject.archiveNumber}</span>
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">CATEGORY: {activeProject.projectCategory}</span>
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">YEAR: {activeProject.projectYear}</span>
              </div>
            </div>

            {/* Modal Tabs navigation */}
            <div className="flex flex-wrap gap-1 border-b border-[#3E2723]/20 pb-3 mb-6 text-[10px] font-mono justify-center">
              {[
                { id: 'overview', label: 'Project Overview' },
                { id: 'matrix', label: 'Tradition & Innovation' },
                { id: 'process', label: 'Creative Process' },
                { id: 'sustainability', label: 'Sustainability Profile' },
                { id: 'impact', label: 'Impact Profile' },
                { id: 'relations', label: 'Related Knowledge' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveModalTab(tab.id as 'overview' | 'matrix' | 'process' | 'sustainability' | 'impact' | 'relations')}
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
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2">Project Metadata</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div><span className="text-gray-400">PROJECT TITLE     :</span> {activeProject.title}</div>
                      <div><span className="text-gray-400">ARCHIVE NUMBER   :</span> {activeProject.archiveNumber}</div>
                      <div><span className="text-gray-400">PRIMARY CRAFT    :</span> {activeProject.primaryCraft}</div>
                      <div><span className="text-gray-400">SECONDARY CRAFT  :</span> {activeProject.secondaryCraft}</div>
                      <div><span className="text-gray-400">LEAD ARTISAN     :</span> {activeProject.leadArtisan}</div>
                      <div><span className="text-gray-400">COLLABORATORS    :</span> {activeProject.collaboratingDesigners}</div>
                    </div>
                    <div className="space-y-1">
                      <div><span className="text-gray-400">WORKSHOP         :</span> {activeProject.workshop}</div>
                      <div><span className="text-gray-400">DISTRICT         :</span> {activeProject.district}</div>
                      <div><span className="text-gray-400">PROJECT YEAR     :</span> {activeProject.projectYear}</div>
                      <div><span className="text-gray-400">PROJECT CATEGORY :</span> {activeProject.projectCategory}</div>
                      <div><span className="text-gray-400">PUBLICATION VER  :</span> {activeProject.publicationVersion}</div>
                      <div><span className="text-gray-400">DOCUMENT STATUS  :</span> {activeProject.docStatus}</div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3 space-y-1">
                    <div><span className="text-gray-400">APPLICATION CATEGORY:</span> {activeProject.appCategory}</div>
                    <div><span className="text-gray-400">RECOGNITION STATUS  :</span> {activeProject.recognition}</div>
                    <div><span className="text-gray-400">SUSTAINABILITY INDEX:</span> {activeProject.sustainabilityRating}</div>
                  </div>
                </div>
              )}

              {/* TAB 2: TRADITION & INNOVATION */}
              {activeModalTab === 'matrix' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2">Tradition &bull; Innovation Matrix</h3>
                  
                  <div className="bg-white border border-[#D4AF37]/20 p-4 rounded shadow-sm space-y-3">
                    <div><strong className="text-gray-400 block uppercase text-[8px]">Traditional techniques retained:</strong> {activeProject.matrix.techniquesRetained}</div>
                    <div><strong className="text-gray-400 block uppercase text-[8px] mt-1">Traditional materials retained:</strong> {activeProject.matrix.materialsRetained}</div>
                    <div><strong className="text-gray-400 block uppercase text-[8px] mt-1">New materials introduced (if any):</strong> {activeProject.matrix.newMaterialsIntroduced}</div>
                    <div><strong className="text-gray-400 block uppercase text-[8px] mt-1">Modern design adaptations:</strong> {activeProject.matrix.modernDesignAdaptations}</div>
                    <div><strong className="text-gray-400 block uppercase text-[8px] mt-1">Environmental improvements:</strong> {activeProject.matrix.environmentalImprovements}</div>
                    <div><strong className="text-gray-400 block uppercase text-[8px] mt-1">New applications:</strong> {activeProject.matrix.newApplications}</div>
                    <div><strong className="text-gray-400 block uppercase text-[8px] mt-1">Educational value:</strong> {activeProject.matrix.educationalValue}</div>
                    <div><strong className="text-gray-400 block uppercase text-[8px] mt-1">Potential for wider adoption:</strong> {activeProject.matrix.potentialWiderAdoption}</div>
                  </div>

                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2 mt-6">Evaluation Scores</h3>
                  <div className="space-y-1.5 bg-[#FAF9F6] border border-gray-250 p-4">
                    {[
                      { label: 'Craftsmanship', score: activeProject.evaluation.craftsmanshipStars },
                      { label: 'Innovation', score: activeProject.evaluation.innovationStars },
                      { label: 'Authenticity', score: activeProject.evaluation.authenticityStars },
                      { label: 'Material Responsibility', score: activeProject.evaluation.materialResponsibilityStars },
                      { label: 'Technical Complexity', score: activeProject.evaluation.technicalComplexityStars },
                      { label: 'Cultural Continuity', score: activeProject.evaluation.culturalContinuityStars },
                      { label: 'Contemporary Relevance', score: activeProject.evaluation.contemporaryRelevanceStars },
                      { label: 'Documentation Quality', score: activeProject.evaluation.documentationQualityStars }
                    ].map(score => (
                      <div key={score.label} className="flex justify-between items-center">
                        <span className="text-gray-650 font-bold">{score.label}</span>
                        <div className="flex text-[#D4AF37] gap-0.5 text-xs font-mono">
                          {'★'.repeat(score.score)}{'☆'.repeat(5 - score.score)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 mt-4 text-gray-700">
                    <div><span className="font-bold text-[#3E2723] text-[9px] uppercase block mb-0.5">Craftsmanship Assessment:</span> {activeProject.evaluation.craftsmanshipNarrative}</div>
                    <div><span className="font-bold text-[#3E2723] text-[9px] uppercase block mb-0.5">Innovation Review:</span> {activeProject.evaluation.innovationNarrative}</div>
                    <div><span className="font-bold text-[#3E2723] text-[9px] uppercase block mb-0.5">Authenticity Balance:</span> {activeProject.evaluation.authenticityNarrative}</div>
                    <div><span className="font-bold text-[#3E2723] text-[9px] uppercase block mb-0.5">Sustainability Evaluation:</span> {activeProject.evaluation.sustainabilityNarrative}</div>
                  </div>
                </div>
              )}

              {/* TAB 3: CREATIVE PROCESS */}
              {activeModalTab === 'process' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2">Design Brief & Creative Process</h3>
                  <div className="space-y-2 text-gray-700">
                    <div><span className="text-gray-400 block uppercase text-[8px] font-bold">Design Brief:</span> {activeProject.designBrief}</div>
                    <div><span className="text-gray-400 block uppercase text-[8px] font-bold mt-2">Creative Process:</span> {activeProject.creativeProcess}</div>
                    <div><span className="text-gray-400 block uppercase text-[8px] font-bold mt-2">Traditional Knowledge Applied:</span> {activeProject.traditionalKnowledgeApplied}</div>
                    <div><span className="text-gray-400 block uppercase text-[8px] font-bold mt-2">Technical Innovation:</span> {activeProject.innovation}</div>
                    <div><span className="text-gray-400 block uppercase text-[8px] font-bold mt-2">Production Stages:</span> {activeProject.productionProcess}</div>
                    <div><span className="text-gray-400 block uppercase text-[8px] font-bold mt-2">Core Challenges:</span> {activeProject.challenges}</div>
                    <div><span className="text-gray-400 block uppercase text-[8px] font-bold mt-2">Project Outcomes:</span> {activeProject.outcomes}</div>
                  </div>
                </div>
              )}

              {/* TAB 4: SUSTAINABILITY PROFILE */}
              {activeModalTab === 'sustainability' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2">Sustainability Assessment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div><span className="text-gray-400 block uppercase text-[8px] font-bold">Primary Materials:</span> {activeProject.sustainability.primaryMaterials}</div>
                      <div><span className="text-gray-400 block uppercase text-[8px] font-bold mt-1.5">Material Origin:</span> {activeProject.sustainability.materialOrigin}</div>
                      <div><span className="text-gray-400 block uppercase text-[8px] font-bold mt-1.5">Renewable Resources:</span> {activeProject.sustainability.renewableResources}</div>
                      <div><span className="text-gray-400 block uppercase text-[8px] font-bold mt-1.5">Waste Reduction Measures:</span> {activeProject.sustainability.wasteReductionMeasures}</div>
                      <div><span className="text-gray-400 block uppercase text-[8px] font-bold mt-1.5">Energy Considerations:</span> {activeProject.sustainability.energyConsiderations}</div>
                    </div>
                    <div className="space-y-2">
                      <div><span className="text-gray-400 block uppercase text-[8px] font-bold">Packaging:</span> {activeProject.sustainability.packaging}</div>
                      <div><span className="text-gray-400 block uppercase text-[8px] font-bold mt-1.5">Repairability:</span> {activeProject.sustainability.repairability}</div>
                      <div><span className="text-gray-400 block uppercase text-[8px] font-bold mt-1.5">Expected Lifespan:</span> {activeProject.sustainability.expectedLifespan}</div>
                      <div><span className="text-gray-400 block uppercase text-[8px] font-bold mt-1.5">Environmental Impact Summary:</span> {activeProject.sustainability.environmentalConsiderations}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: IMPACT PROFILE */}
              {activeModalTab === 'impact' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2">Community &amp; Sector Impact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div><span className="text-gray-400 block uppercase text-[8px] font-bold">Skills Preserved:</span> {activeProject.impact.skillsPreserved}</div>
                      <div><span className="text-gray-400 block uppercase text-[8px] font-bold mt-1.5">Apprentices Involved:</span> {activeProject.impact.apprenticesInvolved}</div>
                      <div><span className="text-gray-400 block uppercase text-[8px] font-bold mt-1.5">Women Artisans Engaged:</span> {activeProject.impact.womenArtisansEngaged}</div>
                      <div><span className="text-gray-400 block uppercase text-[8px] font-bold mt-1.5">Rural Employment Supported:</span> {activeProject.impact.ruralEmploymentSupported}</div>
                    </div>
                    <div className="space-y-2">
                      <div><span className="text-gray-400 block uppercase text-[8px] font-bold">Export Markets Reached:</span> {activeProject.impact.exportMarketsReached}</div>
                      <div><span className="text-gray-400 block uppercase text-[8px] font-bold mt-1.5">Museum Collaborations:</span> {activeProject.impact.museumCollaborations}</div>
                      <div><span className="text-gray-400 block uppercase text-[8px] font-bold mt-1.5">Public Installations:</span> {activeProject.impact.publicInstallations}</div>
                      <div><span className="text-gray-400 block uppercase text-[8px] font-bold mt-1.5">Awards Received:</span> {activeProject.impact.awardsReceived}</div>
                      <div><span className="text-gray-400 block uppercase text-[8px] font-bold mt-1.5">Research Publications:</span> {activeProject.impact.researchPublicationsGenerated}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: RELATED KNOWLEDGE */}
              {activeModalTab === 'relations' && (
                <div className="space-y-4 font-mono text-[11px]">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Scholarly Connections</h3>
                  <div className="bg-white border border-gray-200 p-4 space-y-1.5 text-[10px]">
                    <div><span className="text-gray-400">CITATION           :</span> KHCRF Contemporary Excellence Archive, Record {activeProject.archiveNumber}.</div>
                    <div><span className="text-gray-400">RELATED ARTISAN    :</span> {activeProject.relatedArtisans}</div>
                    <div><span className="text-gray-400">RELATED DEMONSTRATION:</span> {activeProject.relatedDemonstrations}</div>
                    <div><span className="text-gray-400">RELATED WORKSHOP DIARY:</span> {activeProject.relatedWorkshopDiaries}</div>
                    <div><span className="text-gray-400">RELATED COLLECTION  :</span> {activeProject.relatedCollections}</div>
                    <div><span className="text-gray-400">BIBLIOGRAPHY        :</span> {activeProject.bibliography}</div>
                    <div><span className="text-gray-400">RIGHTS STATEMENT    :</span> {activeProject.rights}</div>
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
                <button onClick={() => setActiveProject(null)} className="border border-[#3E2723] hover:bg-[#3E2723]/5 text-[#3E2723] px-6 py-3 uppercase tracking-wider text-xs transition-colors font-light font-mono">
                  Return to Archive
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Hero section */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <UniversalEditorialHero pageKey="contemporary-excellence" fallbackConfig={contemporaryExcellenceHeroFallback as any} />

      <div className="container-fluid mx-auto px-4 md:px-10 py-12 max-w-7xl animate-fadeIn">
        
        {/* Scholarly Statement */}
        <div className="bg-[#3E2723]/5 border-l-4 border-[#3E2723] p-8 mb-12 rounded-r-xs max-w-5xl">
          <p className="text-gray-700 text-base md:text-lg leading-relaxed font-serif">
            This is <strong>not</strong> a &ldquo;modern crafts&rdquo; gallery. The <strong>Contemporary Excellence Archive</strong> celebrates <strong>today&apos;s living creativity</strong>. It demonstrates how today&apos;s artisans continue centuries-old traditions while responding to contemporary aesthetics, sustainable practices, evolving lifestyles, architecture, hospitality, interior design, fashion, and international markets—without losing authenticity.
          </p>
          <p className="text-gray-755 text-xs mt-3 uppercase tracking-widest font-bold font-mono">
            Contemporary Excellence celebrates the achievements of today&apos;s master artisans, designers, workshops, cooperatives, and emerging practitioners who continue to strengthen Kashmir&apos;s craft heritage through exceptional contemporary practice. Rather than separating tradition from innovation, this archive documents how traditional knowledge continues to evolve through new ideas, responsible materials, collaborative design, changing markets, and contemporary cultural expression while remaining rooted in authentic craftsmanship. Each documented work demonstrates that heritage is not static—it is continually renewed through skilled hands, informed creativity, and respect for generations of accumulated knowledge.
          </p>
          <div className="flex flex-wrap gap-4 mt-6 font-mono text-xs">
            <a href="#results" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-5 py-2.5 font-bold uppercase tracking-wider transition-all">
              Explore Contemporary Works
            </a>
            <a href="#nomination-section" className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-5 py-2.5 font-bold uppercase tracking-wider transition-all">
              Nominate Contemporary Excellence
            </a>
            <a href="#framework" className="text-[#3E2723] hover:underline font-bold py-2.5">
              Selection &amp; Evaluation Framework &rarr;
            </a>
          </div>
        </div>

        {/* Featured Contemporary Work */}
        <section className="bg-white border-4 border-[#3E2723] p-8 md:p-10 mb-16 relative shadow-md">
          <div className="absolute top-0 right-0 bg-[#3E2723] text-[#D4AF37] px-4 py-1 text-[10px] font-mono font-bold uppercase tracking-widest">
            FEATURED CONTEMPORARY WORK
          </div>
          
          <div className="max-w-4xl font-mono">
            <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-1">
              Contemporary Excellence Record: {featuredProject.archiveNumber}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3E2723] leading-tight mb-2">
              {featuredProject.title}
            </h2>
            <h3 className="text-base md:text-lg font-serif italic text-gray-500 mb-4">
              {featuredProject.subtitle}
            </h3>
            
            <p className="text-gray-700 text-sm leading-relaxed mb-6 font-sans text-gray-655">
              {featuredProject.desc}
            </p>

            {/* Tradition -> Innovation Matrix Block */}
            <div className="border border-[#D4AF37]/30 p-5 bg-[#FAF9F6] mb-6 text-[10px]">
              <span className="text-[#3E2723] font-bold text-[10px] uppercase block mb-3 border-b border-[#3E2723]/10 pb-1">
                Featured Tradition &rarr; Innovation Matrix
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 block uppercase font-bold text-[8px]">Traditional Techniques Retained</span>
                  <span className="font-bold text-[#3E2723] block mb-2">{featuredProject.matrix.techniquesRetained}</span>
                  
                  <span className="text-gray-400 block uppercase font-bold text-[8px]">Traditional Materials Retained</span>
                  <span className="font-bold text-[#3E2723] block mb-2">{featuredProject.matrix.materialsRetained}</span>

                  <span className="text-gray-400 block uppercase font-bold text-[8px]">New Materials Introduced</span>
                  <span className="font-bold text-[#3E2723] block mb-2">{featuredProject.matrix.newMaterialsIntroduced}</span>
                </div>
                <div>
                  <span className="text-gray-400 block uppercase font-bold text-[8px]">Modern Design Adaptations</span>
                  <span className="font-bold text-[#3E2723] block mb-2">{featuredProject.matrix.modernDesignAdaptations}</span>

                  <span className="text-gray-400 block uppercase font-bold text-[8px]">Environmental Improvements</span>
                  <span className="font-bold text-[#3E2723] block mb-2">{featuredProject.matrix.environmentalImprovements}</span>

                  <span className="text-gray-400 block uppercase font-bold text-[8px]">New Applications</span>
                  <span className="font-bold text-[#3E2723] block">{featuredProject.matrix.newApplications}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => { setActiveProject(featuredProject); setActiveModalTab('overview'); }}
                className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-all font-mono"
              >
                Study Project &rarr;
              </button>
            </div>
          </div>
        </section>

        {/* Why Contemporary Excellence Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start mt-12">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-serif text-[#3E2723] mb-6 font-bold">Why Document Contemporary Craft Excellence?</h2>
            <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans">
              Living traditions survive because artisans continue to create—not simply reproduce. Today&apos;s craftspeople face new expectations, including sustainable production, responsible sourcing, international markets, digital commerce, architectural integration, hospitality projects, museum collaborations, and evolving customer preferences.
            </p>
            <p className="text-gray-605 text-sm leading-relaxed font-sans">
              The Contemporary Excellence Archive documents how these challenges inspire innovation while preserving the technical knowledge, cultural identity, and craftsmanship that define Kashmir&apos;s traditional arts.
            </p>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#3E2723]/10 p-8 rounded-xs shadow-xs">
            <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 font-mono">
              Balancing Selection Pillars:
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700 font-sans font-mono">
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>authenticity</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>craftsmanship</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>innovation</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>sustainability</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>functionality</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>artistic excellence</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>material integrity</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>cultural continuity</li>
            </ul>
          </div>
        </section>

        {/* Evaluation Framework Section */}
        <section className="bg-white border border-[#3E2723]/25 p-8 md:p-10 mb-16 rounded-xs shadow-sm" id="framework">
          <div className="border-b border-[#3E2723]/15 pb-4 mb-8">
            <span className="text-[#D4AF37] text-[10px] font-mono uppercase font-bold tracking-widest block mb-1">Evaluation Framework</span>
            <h3 className="font-serif text-2xl font-bold text-[#3E2723]">Contemporary Excellence Evaluation Framework</h3>
            <p className="text-gray-500 text-xs font-mono mt-1">EVALUATING LIVING PRACTICE VIA STRATEGIC CRITERIA</p>
          </div>

          <p className="text-gray-655 text-xs leading-relaxed mb-6 font-sans">
            Unlike Signature Masterpieces, this archive evaluates living practice. Each project is assessed using transparent criteria to ensure that innovation builds upon heritage rather than replacing it:
          </p>

          <ul className="space-y-2 text-xs font-mono text-gray-700 mb-6">
            <li className="flex items-center gap-2"><span className="text-[#D4AF37]">▪</span><strong>Technical Complexity:</strong> Evaluates hand-skill precision and adherence to traditional structural methods.</li>
            <li className="flex items-center gap-2"><span className="text-[#D4AF37]">▪</span><strong>Material Responsibility:</strong> Gauges natural material source extraction, local dyeing, and recycling.</li>
            <li className="flex items-center gap-2"><span className="text-[#D4AF37]">▪</span><strong>Contemporary Relevance:</strong> Reviews design suitability for global architecture, hospitality, fashion, or interiors.</li>
          </ul>
        </section>

        {/* Archive Overview Dashboard */}
        <section className="bg-[#3E2723] text-white p-8 md:p-10 mb-12 rounded-xs relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#3E2723] px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-widest">
            Registry Overview
          </div>
          <div className="mb-8 font-mono">
            <h3 className="font-serif text-2xl text-[#D4AF37] mb-2 font-bold font-serif">Contemporary Excellence Overview</h3>
            <p className="text-white/60 text-xs">
              LIVING ARTISANS, COLLABORATIVE DESIGN, &amp; SUSTAINABLE VENTURES
            </p>
          </div>

          {/* Primary Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 text-center md:text-left border-b border-white/10 pb-8 mb-8">
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Contemporary Works</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">326</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Living Master Artisans</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">118</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Emerging Artisans</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">74</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Studios &amp; Workshops</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">63</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Design Collaborations</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">42</span>
            </div>
            <div className="last:border-0">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Research Essays</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">81</span>
            </div>
          </div>

          {/* Secondary Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 text-center md:text-left font-mono">
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono font-mono">Sustainable Materials</span>
              <span className="text-xl font-serif font-semibold text-white/80 font-mono">38</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Product Collections</span>
              <span className="text-xl font-serif font-semibold text-white/80">71</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono font-mono">Architectural Installs</span>
              <span className="text-xl font-serif font-semibold text-white/80 font-mono">19</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Museum Collabs</span>
              <span className="text-xl font-serif font-semibold text-white/80">11</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Hospitality Projects</span>
              <span className="text-xl font-serif font-semibold text-white/80">23</span>
            </div>
            <div className="last:border-0">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono font-mono">Intl Exhibitions</span>
              <span className="text-lg font-serif font-semibold text-[#D4AF37] block leading-tight font-mono">27</span>
            </div>
          </div>
        </section>

        {/* View Switcher Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 bg-[#FAF9F6] border border-[#3E2723]/10 p-4 font-mono" id="results">
          <div className="text-xs font-serif text-[#3E2723]">
            KHCRF Contemporary Excellence &bull; Showing {sortedProjects.length} Documented Projects
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] text-gray-400 uppercase self-center mr-2 font-mono">Archive Layout View:</span>
            <button 
              onClick={() => { setCurrentView('showcase'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'showcase' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-550 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Editorial Showcase
            </button>
            <button 
              onClick={() => { setCurrentView('gallery'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'gallery' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Project Gallery
            </button>
            <button 
              onClick={() => { setCurrentView('catalogue'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'catalogue' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
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
              <span>Filter Archive</span>
              <button 
                onClick={() => {
                  setSelectedCraft('All');
                  setSelectedCategory('All');
                  setSelectedApplication('All');
                  setSelectedSustainability('All');
                  setSelectedRecognition('All');
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
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Search Field</label>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="Search contemporary works by artisan, craft, technique, project, material, designer, district, or keyword..."
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
                  <option value="Mixed Craft">Mixed Craft</option>
                </select>
              </div>

              {/* Excellence Category */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Excellence Category</label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All">All Categories</option>
                  <option value="Technical Innovation">Technical Innovation</option>
                  <option value="Contemporary Design">Contemporary Design</option>
                  <option value="Sustainable Practice">Sustainable Practice</option>
                  <option value="Material Innovation">Material Innovation</option>
                  <option value="Living Heritage">Living Heritage</option>
                  <option value="Architectural Integration">Architectural Integration</option>
                  <option value="Interior Design">Interior Design</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Public Art">Public Art</option>
                  <option value="Functional Design">Functional Design</option>
                  <option value="Cultural Interpretation">Cultural Interpretation</option>
                </select>
              </div>

              {/* Application Category */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Application Focus</label>
                <select 
                  value={selectedApplication}
                  onChange={(e) => { setSelectedApplication(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All">All Applications</option>
                  <option value="Residential Interiors">Residential Interiors</option>
                  <option value="Hospitality">Hospitality</option>
                  <option value="Public Spaces">Public Spaces</option>
                  <option value="Museums">Museums</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Fine Art">Fine Art</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Architectural Components">Architectural Components</option>
                  <option value="Collectibles">Collectibles</option>
                  <option value="Lifestyle Products">Lifestyle Products</option>
                </select>
              </div>

              {/* Sustainability Category */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Sustainability Standard</label>
                <select 
                  value={selectedSustainability}
                  onChange={(e) => { setSelectedSustainability(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All">All Standards</option>
                  <option value="Natural Materials">Natural Materials</option>
                  <option value="Traditional Dyes">Traditional Dyes</option>
                  <option value="Responsible Forestry">Responsible Forestry</option>
                  <option value="Recycled Materials">Recycled Materials</option>
                  <option value="Zero Waste Practice">Zero Waste Practice</option>
                </select>
              </div>

              {/* Recognition */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Recognition Status</label>
                <select 
                  value={selectedRecognition}
                  onChange={(e) => { setSelectedRecognition(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All">All Recognitions</option>
                  <option value="Award Winner">Award Winner</option>
                  <option value="Jury Selection">Jury Selection</option>
                  <option value="Curator's Choice">Curator&apos;s Choice</option>
                  <option value="Community Recognition">Community Recognition</option>
                  <option value="International Exhibition">International Exhibition</option>
                  <option value="Emerging Excellence">Emerging Excellence</option>
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
                  <option value="Fully Documented">Fully Documented</option>
                  <option value="Technical Review">Technical Review</option>
                  <option value="Published">Published</option>
                  <option value="Under Research">Under Research</option>
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
                  <option value="Most Studied">Most Studied</option>
                  <option value="Curator's Selection">Curator&apos;s Selection</option>
                  <option value="Alphabetical">Alphabetical</option>
                  <option value="Craft">Craft</option>
                  <option value="Publication Date">Publication Date</option>
                </select>
              </div>

            </div>
          </div>

          {/* Results Area */}
          <div className="w-full lg:w-3/4">

            {loading ? (
              <div className="py-20 text-center text-gray-505 font-serif font-bold">Loading contemporary works...</div>
            ) : (
              <>
                {/* 1. EDITORIAL SHOWCASE VIEW */}
                {currentView === 'showcase' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                    {paginatedProjects.map((p, i) => (
                      <div 
                        key={i} 
                        className="bg-white border-2 border-[#3E2723]/35 py-8 px-6 hover:bg-[#3E2723]/5 transition-all duration-300 group flex flex-col justify-between shadow-sm relative grid-ledger font-mono text-xs"
                      >
                        <div>
                          {/* Accession ID & Date header */}
                          <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5 font-semibold">
                            <span>{p.archiveNumber}</span>
                            <span>{p.projectYear}</span>
                          </div>

                          {/* Collection Type & Craft */}
                          <div className="text-[9px] font-mono text-[#D4AF37] font-bold uppercase tracking-widest mb-4">
                            CONTEMPORARY EXCELLENCE &bull; {p.primaryCraft.toUpperCase()}
                          </div>

                          {/* Title */}
                          <h3 
                            onClick={() => { setActiveProject(p); setActiveModalTab('overview'); }}
                            className="text-xl md:text-2xl font-serif font-bold text-[#3E2723] leading-snug cursor-pointer group-hover:text-[#D4AF37] transition-colors"
                          >
                            {p.title}
                          </h3>

                          {p.subtitle && (
                            <h4 className="text-xs font-serif italic text-gray-500 mt-1 leading-snug mb-3">
                              {p.subtitle}
                            </h4>
                          )}

                          <p className="text-gray-655 text-xs leading-relaxed mb-4 font-sans line-clamp-3 mt-3">
                            {p.desc}
                          </p>

                          {/* Category & Craft Indicators */}
                          <div className="relative pl-4 mb-4 border-l-2 border-[#D4AF37]/50 font-mono text-[10px] leading-relaxed my-4">
                            <span className="text-[9px] text-gray-400 uppercase tracking-wider block mb-1">
                              Excellence Attributes
                            </span>
                            <span className="font-bold text-[#3E2723]">
                              Category: {p.projectCategory} &bull; Craft: {p.primaryCraft}
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="text-[#3E2723]/25 text-[9px] font-mono mb-3 select-none">
                            ─────╱╲──╱────╲╱─────
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto font-mono">
                            <span className="bg-[#3E2723]/5 border border-[#3E2723]/10 text-[#3E2723] text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider">
                              {p.docStatus.toUpperCase()}
                            </span>
                            
                            <button 
                              onClick={() => { setActiveProject(p); setActiveModalTab('overview'); }}
                              className="text-xs font-bold uppercase tracking-widest text-[#3E2723] hover:text-[#D4AF37] transition-colors font-mono"
                            >
                              Study Project &rarr;
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

                {/* 2. PROJECT GALLERY VIEW */}
                {currentView === 'gallery' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn font-mono text-xs">
                    {paginatedProjects.map((p, i) => (
                      <div key={i} className="bg-white border border-[#3E2723]/15 p-6 shadow-xs relative flex flex-col justify-between">
                        <div>
                          <div className="text-gray-300 font-bold font-mono text-[9px] mb-2">{p.archiveNumber}</div>
                          <span className="text-[9px] font-mono text-[#D4AF37] font-bold uppercase tracking-widest block mb-1">
                            CONTEMPORARY EXCELLENCE
                          </span>
                          <h4 
                            onClick={() => { setActiveProject(p); setActiveModalTab('overview'); }}
                            className="text-[#3E2723] font-serif text-base font-bold mb-2 cursor-pointer hover:text-[#D4AF37] transition-colors"
                          >
                            {p.title}
                          </h4>
                          <p className="text-gray-500 text-[10px] leading-relaxed mb-4 line-clamp-3 font-sans">
                            {p.desc}
                          </p>
                        </div>
                        
                        <div className="border-t border-gray-100 pt-3 mt-4">
                          <div className="grid grid-cols-2 gap-2 text-[9px] text-gray-500 mb-3">
                            <div><strong className="text-gray-400 uppercase text-[8px]">Category</strong><br/>{p.projectCategory}</div>
                            <div><strong className="text-gray-400 uppercase text-[8px]">Craft</strong><br/>{p.primaryCraft}</div>
                          </div>
                          <button 
                            onClick={() => { setActiveProject(p); setActiveModalTab('overview'); }}
                            className="text-xs font-bold uppercase tracking-widest text-[#3E2723] hover:text-[#D4AF37] transition-colors font-mono w-full text-center bg-gray-55 py-2 border border-gray-200"
                          >
                            Study Project &rarr;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. RESEARCH CATALOGUE VIEW */}
                {currentView === 'catalogue' && (
                  <div className="bg-white border border-[#3E2723]/10 overflow-x-auto shadow-sm animate-fadeIn">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#3E2723] text-[#D4AF37] font-mono uppercase tracking-wider text-[10px]">
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Registry No</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Title & Innovation Focus</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Craft</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Lead Artisan / Workshop</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">District</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center font-mono">Year</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Recognition</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center font-mono">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#3E2723]/10 font-sans text-gray-700">
                        {paginatedProjects.map((p, i) => (
                          <tr key={i} className="hover:bg-[#FAF9F6] transition-colors cursor-pointer" onClick={() => { setActiveProject(p); setActiveModalTab('overview'); }}>
                            <td className="p-4 font-mono font-bold text-gray-500 whitespace-nowrap">{p.archiveNumber}</td>
                            <td className="p-4">
                              <div className="font-serif font-bold text-[#3E2723] text-sm hover:text-[#D4AF37] transition-colors">{p.title}</div>
                              <div className="text-[10px] text-gray-400 font-light truncate max-w-xs">{p.whyRepresentsExcellence}</div>
                            </td>
                            <td className="p-4 whitespace-nowrap font-bold">{p.primaryCraft}</td>
                            <td className="p-4 whitespace-nowrap">{p.leadArtisan} &bull; {p.workshop}</td>
                            <td className="p-4 whitespace-nowrap">{p.district}</td>
                            <td className="p-4 text-center whitespace-nowrap font-mono">{p.projectYear}</td>
                            <td className="p-4 whitespace-nowrap font-mono">{p.recognition}</td>
                            <td className="p-4 text-center whitespace-nowrap font-mono">
                              <span className="px-2 py-0.5 font-mono text-[9px] uppercase border border-[#3E2723]/20 bg-[#3E2723]/5 text-[#3E2723] font-bold">
                                {p.docStatus}
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
        <section className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs mt-16">
          <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold">
            How KHCRF Documents Contemporary Excellence
          </h2>
          <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans">
            Projects are selected through documented evaluation of craftsmanship, innovation, authenticity, sustainability, cultural significance, and educational value. The emphasis is on demonstrating how traditional knowledge continues to evolve through responsible contemporary practice. Commercial success alone should never determine inclusion.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div>
              <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3 font-mono">Standardization Workflow</h3>
              <ol className="list-decimal pl-4 space-y-2 text-xs text-gray-600 font-mono">
                <li>Project nomination</li>
                <li>Eligibility review</li>
                <li>Artisan consultation</li>
                <li>Technical documentation</li>
                <li>Sustainability assessment</li>
                <li>Comparative review</li>
                <li>Editorial evaluation</li>
                <li>Metadata preparation</li>
                <li>Publication</li>
                <li>Periodic updates</li>
              </ol>
            </div>
            <div>
              <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3 font-mono">Selection Principles</h3>
              <ul className="list-disc pl-4 space-y-2 text-xs text-gray-600 font-mono">
                <li>authentic craft practice</li>
                <li>respect for traditional knowledge</li>
                <li>meaningful innovation</li>
                <li>responsible material use</li>
                <li>high technical standards</li>
                <li>transparent documentation</li>
                <li>educational value</li>
                <li>contribution to the future of the craft</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Research & Educational Use */}
        <section className="bg-white border border-[#3E2723]/25 p-8 md:p-10 mb-16 rounded-xs shadow-sm">
          <h2 className="text-2xl font-serif text-[#3E2723] mb-4 font-bold">Research &amp; Educational Use</h2>
          <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans">
            This archive supports design education, architecture and interiors, museum interpretation, sustainability research, innovation studies, craft entrepreneurship, policy development, vocational education, and cultural industries research.
          </p>
          <div className="flex gap-4 font-mono">
            <Link href="mailto:research@khcrf.org" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3 font-bold uppercase tracking-wider text-xs transition-colors">
              Request Research Access
            </Link>
            <a href="#nomination-section" className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-6 py-3 font-bold uppercase tracking-wider text-xs transition-colors">
              Nominate a Contemporary Project
            </a>
          </div>
        </section>

        {/* Contributions Form */}
        <section id="nomination-section" className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs">
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase block mb-1 font-mono">Showcase Contemporary Craft Excellence</span>
            <h2 className="text-3xl font-serif text-[#3E2723] font-bold">Submit Contemporary Project</h2>
            <p className="text-gray-500 text-xs font-mono mt-1">Master artisans, designers, cooperatives, architects, museums, and enterprises are invited to propose projects.</p>
          </div>

          <div className="bg-[#FAF9F6] p-6 md:p-8 border border-gray-255">
            {nominationSubmitted ? (
              <div className="text-center py-8 font-mono">
                <h3 className="text-lg font-bold text-green-600 mb-2">Proposal Transmitted</h3>
                <p className="text-xs text-gray-500">Thank you. The KHCRF Contemporary Committee will verify your submission metadata against our evaluation pillars.</p>
              </div>
            ) : (
              <form onSubmit={handleNominationSubmit} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Project Title *</label>
                    <input 
                      required 
                      type="text" 
                      value={nominationForm.title}
                      onChange={(e) => setNominationForm({...nominationForm, title: e.target.value})}
                      placeholder="e.g. Minimalist Khatamband Console"
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
                      placeholder="e.g. Walnut Wood"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Lead Artisan *</label>
                    <input 
                      required
                      type="text" 
                      value={nominationForm.leadArtisan}
                      onChange={(e) => setNominationForm({...nominationForm, leadArtisan: e.target.value})}
                      placeholder="e.g. Ustad Ghulam Nabi"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Collaborating Designers</label>
                    <input 
                      type="text" 
                      value={nominationForm.collaborators}
                      onChange={(e) => setNominationForm({...nominationForm, collaborators: e.target.value})}
                      placeholder="e.g. Studio Giza Architects"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Project Year *</label>
                    <input 
                      required
                      type="text" 
                      value={nominationForm.year}
                      onChange={(e) => setNominationForm({...nominationForm, year: e.target.value})}
                      placeholder="e.g. 2025"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Contact Email/Phone *</label>
                    <input 
                      required 
                      type="text" 
                      value={nominationForm.contact}
                      onChange={(e) => setNominationForm({...nominationForm, contact: e.target.value})}
                      placeholder="Email or Phone Number"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-500 mb-1">Innovation Summary *</label>
                  <textarea 
                    required 
                    rows={3} 
                    value={nominationForm.innovationSummary}
                    onChange={(e) => setNominationForm({...nominationForm, innovationSummary: e.target.value})}
                    placeholder="Describe how this project reinterprets traditional techniques, adapts design templates, or introduces new applications..."
                    className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723] resize-none" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Materials Used *</label>
                    <textarea 
                      required
                      rows={2} 
                      value={nominationForm.materialsUsed}
                      onChange={(e) => setNominationForm({...nominationForm, materialsUsed: e.target.value})}
                      placeholder="e.g. Seasoned wild walnut wood, organic beeswax..."
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723] resize-none" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Sustainability &amp; Ergonmic Features</label>
                    <textarea 
                      rows={2} 
                      value={nominationForm.sustainabilityFeatures}
                      onChange={(e) => setNominationForm({...nominationForm, sustainabilityFeatures: e.target.value})}
                      placeholder="e.g. Sourced from fallen trees, zero toxic varnishes..."
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723] resize-none" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-500 mb-1">Supporting Documentation &amp; Image URLs</label>
                  <textarea 
                    rows={2} 
                    value={nominationForm.documentation}
                    onChange={(e) => setNominationForm({...nominationForm, documentation: e.target.value})}
                    placeholder="Provide bibliography references, exhibition booklets, or high-res photo links..."
                    className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723] resize-none" 
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-[#3E2723] hover:bg-[#D4AF37] text-white hover:text-[#3E2723] font-bold uppercase tracking-widest transition-colors font-mono"
                >
                  Submit Contemporary Project
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
            &ldquo;KHCRF Contemporary Excellence demonstrates that Kashmir&apos;s craft traditions are living, evolving practices. By documenting today&apos;s finest works with the same scholarly rigor applied to historic collections, the archive recognizes the artisans, workshops, and collaborations shaping the future of this remarkable cultural heritage.&rdquo;
          </p>
          <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto"></div>
        </div>
      </footer>

    </main>
  );
}
