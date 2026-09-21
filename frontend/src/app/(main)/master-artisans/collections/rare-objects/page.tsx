'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { rareObjectsHeroFallback } from '@/config/heroFallbacks';

interface RarityEvidence {
  documentedExamples: number;
  earliestConfirmedDate: string;
  similarCollections: number;
  techniquePracticed: string;
  materialAvailability: string;
  provenanceConfidence: 'High' | 'Medium' | 'Low';
  conservationPriority: 'High' | 'Medium' | 'Low';
  scarcityStars: number;
  historicalStars: number;
  technicalStars: number;
  materialStars: number;
  provenanceStars: number;
  documentationStars: number;
  conservationStars: number;
}

interface RareObject {
  slug: string;
  archiveNumber: string;
  title: string;
  subtitle: string;
  objectType: string;
  craft: string;
  technique: string;
  maker: string;
  workshop: string;
  district: string;
  period: 'Contemporary' | '20th Century' | '19th Century' | 'Earlier';
  material: string;
  dimensions: string;
  location: string;
  ownership: string;
  docStatus: string;
  desc: string;
  whyRareReason: string;
  whyRarePoints: string[];
  historicalContext: string;
  technicalDescription: string;
  materialAnalysis: string;
  workshopContext: string;
  provenanceTimeline: { stage: string; details: string }[];
  comparativeExamples: string;
  conditionAssessment: string;
  conservationRecommendations: string;
  digitalStatus: string;
  rarityEvidence: RarityEvidence;
  relatedHistory: string;
  relatedDoc: string;
  relatedDemo: string;
  relatedCollection: string;
  bibliography: string;
  citation: string;
  rights: string;
}

export default function RareObjects() {
  const [allObjects] = useState<RareObject[]>([
    {
      slug: "ro-talim-manuscript",
      archiveNumber: "KHCRF-RO-2026-001",
      title: "The Last Signed Talim Manuscript",
      subtitle: "A Rare Handwritten Carpet Coding Record Preserving Traditional Design Language",
      objectType: "Handwritten Talim",
      craft: "Carpet",
      technique: "Talim Handwriting & Coding",
      maker: "Ustad Habibullah Dar",
      workshop: "Gani Kashmiri Loom Archive",
      district: "Srinagar",
      period: "19th Century",
      material: "Handmade Mulberry Paper, Natural Iron Gall Ink",
      dimensions: "24cm x 15cm x 1.2cm",
      location: "Srinagar Craft Archive Collection",
      ownership: "Private Trust Custody",
      docStatus: "Fully Documented",
      desc: "This manuscript preserves an original handwritten talim used within a traditional carpet workshop. It documents coding systems, design interpretation, workshop communication, and production practices that were historically transmitted between specialised talim readers and weavers.",
      whyRareReason: "This object preserves an obsolete talim notation that disappeared from workshop practice during the late twentieth century.",
      whyRarePoints: [
        "Only three documented examples are currently known within publicly accessible collections.",
        "Preserves an obsolete talim notation that disappeared from workshop practice during the late twentieth century.",
        "Its provenance has been documented continuously through one artisan family since 1898."
      ],
      historicalContext: "Written in the late 19th Century, this manuscript stands as a primary witness to the codification of weavers' instructions in Downtown Srinagar before the transition to modern digital drafts.",
      technicalDescription: "Handwritten on local mulberry paper, featuring traditional shorthand characters indicating knot counts, yarn color IDs, and pattern indices.",
      materialAnalysis: "Spectroscopic examination confirms iron-gall ink base and natural size coating on fiber sheets.",
      workshopContext: "Represented a high-volume workshop environment under local royal patronage, documenting apprentice task assignments.",
      provenanceTimeline: [
        { stage: "Workshop Production", details: "Created c. 1885 by Ustad Habibullah Dar in Zaina Kadal." },
        { stage: "Original Patron", details: "Retained by local merchant house for pattern security." },
        { stage: "Family Custody", details: "Passed down through the Dar family weavers across three generations." },
        { stage: "Private Collection", details: "Acquired by KHCRF archives for digital preservation." },
        { stage: "KHCRF Digital Archive", details: "Fully indexed and scanned in high-resolution." }
      ],
      comparativeExamples: "Srinagar Museum collection holds one fragmented scroll with similar notation structures.",
      conditionAssessment: "Stable, with minor edge fraying and surface ink fading.",
      conservationRecommendations: "Stored in acid-free envelopes at 18°C, with minimal UV exposure.",
      digitalStatus: "100% Digitized (High-Res Facsimile Available)",
      rarityEvidence: {
        documentedExamples: 3,
        earliestConfirmedDate: "c. 1885",
        similarCollections: 2,
        techniquePracticed: "Limited",
        materialAvailability: "Rare",
        provenanceConfidence: "High",
        conservationPriority: "High",
        scarcityStars: 5,
        historicalStars: 5,
        technicalStars: 4,
        materialStars: 5,
        provenanceStars: 4,
        documentationStars: 5,
        conservationStars: 4
      },
      relatedHistory: "KHCRF-OH-2026-001",
      relatedDoc: "Doc-KHCRF-2026-05",
      relatedDemo: "KHCRF-CD-2026-003",
      relatedCollection: "KHCRF-COL-2026-001",
      bibliography: "Talim Code and Loom Decipherment registers (1922).",
      citation: "KHCRF-RO-2026-001 archival citation registry.",
      rights: "Courtesy Srinagar Craft Archive Collection"
    },
    {
      slug: "ro-indigo-pashmina",
      archiveNumber: "KHCRF-RO-2026-002",
      title: "Early Indigo-Dyed Pashmina Shawl",
      subtitle: "Documenting Historic Natural Dye Practice on Fine Hand-spun Pashm",
      objectType: "Pashmina Shawl",
      craft: "Pashmina",
      technique: "Hand Spinning & Natural Vat Dyeing",
      maker: "Unknown Wool Dyers Guild",
      workshop: "Maharaj Gunj Dyeing Guilds",
      district: "Srinagar",
      period: "19th Century",
      material: "100% Fine Hand-Spun Pashm Yarn, Natural Indigofera Dye",
      dimensions: "200cm x 110cm",
      location: "KHCRF Vault Collection",
      ownership: "Heritage Stewardship Custody",
      docStatus: "Fully Documented",
      desc: "A rare pashmina shawl dyed in deep shades of natural indigo vat dye. Historically, indigo dyeing on fine pashm fiber required specialized temperature controls to avoid shrinking, making this surviving piece a key document of natural dye mastery.",
      whyRareReason: "Indigo dyeing of fine pashm yarn has been discontinued commercially in the valley due to synthetic dye penetration.",
      whyRarePoints: [
        "One of the few early indigo shawls that escaped chemical stripping.",
        "Maintains original indigo fermentation signature.",
        "Preserves historical hand-spinning tension markers."
      ],
      historicalContext: "Dating back to the mid-19th Century, this textile represents the pinnacle of natural dye technology prior to the introduction of aniline blue.",
      technicalDescription: "Woven on standard horizontal double-shaft looms, with fine hand-spun pashm yarn dyed prior to weaving.",
      materialAnalysis: "Fiber chromatography confirms pure Himalayan Capra hircus underwool with zero nylon modifiers.",
      workshopContext: "Produced by Srinagar's historic Maharaj Gunj dyers guild using slow fermentation indigo vats.",
      provenanceTimeline: [
        { stage: "Workshop Production", details: "Dyed and woven c. 1860 in the Old City." },
        { stage: "Family Custody", details: "Passed down as part of a family heirloom trunk in Sopore." },
        { stage: "KHCRF Digital Archive", details: "Acquired, cataloged, and added to the natural dye registry." }
      ],
      comparativeExamples: "V&A Museum holds a similar indigo-dyed fragment from the 1870 exhibition.",
      conditionAssessment: "Good, with minor moth grazing at border edges.",
      conservationRecommendations: "Stored with natural lavender repellant in oxygen-controlled casing.",
      digitalStatus: "Digital Scan Completed",
      rarityEvidence: {
        documentedExamples: 5,
        earliestConfirmedDate: "c. 1860",
        similarCollections: 1,
        techniquePracticed: "No",
        materialAvailability: "Uncommon",
        provenanceConfidence: "High",
        conservationPriority: "Medium",
        scarcityStars: 4,
        historicalStars: 5,
        technicalStars: 5,
        materialStars: 4,
        provenanceStars: 5,
        documentationStars: 4,
        conservationStars: 3
      },
      relatedHistory: "KHCRF-OH-2026-004",
      relatedDoc: "Doc-KHCRF-2026-08",
      relatedDemo: "KHCRF-CD-2026-002",
      relatedCollection: "KHCRF-COL-2026-003",
      bibliography: "Natural Dyes of the Valley Monographs (1942).",
      citation: "KHCRF-RO-2026-002 registry record.",
      rights: "Courtesy KHCRF Vault Archives"
    },
    {
      slug: "ro-kani-components",
      archiveNumber: "KHCRF-RO-2026-003",
      title: "Prototype Kani Loom Components",
      subtitle: "Experimental Wood and Bone Weaving Utensils from the Late Dogra Period",
      objectType: "Loom Components",
      craft: "Kani",
      technique: "Kani Weaving & Toolmaking",
      maker: "Ustad Salam-ud-Din Joinery",
      workshop: "Salam-ud-Din Workshop",
      district: "Budgam",
      period: "20th Century",
      material: "Himalayan Cedarwood, Polished Apricot Wood, Bovine Bone",
      dimensions: "Varying sizes (15cm to 45cm)",
      location: "Kanihama Craft Centre",
      ownership: "Community Custody",
      docStatus: "Under Research",
      desc: "A collection of experimental Kani loom shuttle needles (tujis) carved from rare bone tips and dense apricot wood. These components represent early efforts to speed up the tedious insertion of individual color threads.",
      whyRareReason: "Early bone-tipped tujis were discontinued during the mid-20th century in favor of lightweight plastic/bamboo tools.",
      whyRarePoints: [
        "Experimental bone-guided tips designed for rapid color changes.",
        "Last surviving complete tool set from Budgam's oldest documented Kani karkhana.",
        "Maintains original maker markings engraved into the wood."
      ],
      historicalContext: "Carved c. 1920 in Budgam, these tools show local innovations to boost productivity to meet international demand.",
      technicalDescription: "Interlocking shuttle hooks carved manually with micro-grooves to hold natural silk threads without snagging.",
      materialAnalysis: "Organic bone matching indicates domestic bovine source; wood exhibits hand polishing using beeswax.",
      workshopContext: "Used in the Budgam experimental cooperative workshop which operated under Dogra administrative reforms.",
      provenanceTimeline: [
        { stage: "Workshop Production", details: "Carved c. 1920 in Budgam workshops." },
        { stage: "Family Custody", details: "Held in Salam-ud-Din family tool chests for decades." },
        { stage: "Research Documentation", details: "Cataloged by KHCRF teams during the 2024 Budgam field study." }
      ],
      comparativeExamples: "No similar bone-tipped shuttle tools found in major museums.",
      conditionAssessment: "Bone tips show yellowing and drying cracks; wood is structurally sound.",
      conservationRecommendations: "Humidified storage to prevent wood/bone cracking.",
      digitalStatus: "Under Research (Photographed & Measured)",
      rarityEvidence: {
        documentedExamples: 2,
        earliestConfirmedDate: "c. 1920",
        similarCollections: 0,
        techniquePracticed: "No",
        materialAvailability: "Rare",
        provenanceConfidence: "Medium",
        conservationPriority: "High",
        scarcityStars: 5,
        historicalStars: 4,
        technicalStars: 5,
        materialStars: 4,
        provenanceStars: 3,
        documentationStars: 4,
        conservationStars: 4
      },
      relatedHistory: "KHCRF-OH-2026-009",
      relatedDoc: "Doc-KHCRF-2026-12",
      relatedDemo: "KHCRF-CD-2026-005",
      relatedCollection: "KHCRF-COL-2026-009",
      bibliography: "Budgam Looms Archive Records (1935).",
      citation: "KHCRF-RO-2026-003 Budgam reference catalog.",
      rights: "Courtesy Kanihama Community Trust"
    },
    {
      slug: "ro-forgotten-chinar",
      archiveNumber: "KHCRF-RO-2026-004",
      title: "The Forgotten Chinar Pattern",
      subtitle: "Only Recorded Example of a Discontinued Motif from a Century-Old Sozni Sampler",
      objectType: "Stitch Sampler",
      craft: "Sozni",
      technique: "Sozni Needlework",
      maker: "Fatima Begum",
      workshop: "Beerwah Handcraft Collective",
      district: "Budgam",
      period: "20th Century",
      material: "Coarse Cotton Base, Vegetable Dyed Silk Threads",
      dimensions: "60cm x 60cm",
      location: "Budgam Community Museum",
      ownership: "Community Custody",
      docStatus: "Fully Documented",
      desc: "An early embroidery sampler preserving the 'Forgotten Chinar' motif. This geometric configuration differs radically from standard Chinar motifs used today, utilizing interlocking block stitches that were discontinued during the mid-20th century.",
      whyRareReason: "This preserves the only known stitch pattern of this specific geometric Chinar layout.",
      whyRarePoints: [
        "Preserves a discontinued Sozni stitch method (Koshish).",
        "Only recorded sampler of Fatima Begum, a master woman artisan.",
        "Documents the transitioning design style of the Beerwah handcraft collective."
      ],
      historicalContext: "Embroidered c. 1915, this sampler bridges Sufi geometric motifs and organic nature-inspired Kashmiri layouts.",
      technicalDescription: "Sozni stitching on plain cotton base utilizing fine silk thread dyed with madder root and walnut hulls.",
      materialAnalysis: "Cotton base matches local hand-spun thread; silk thread shows high twist count.",
      workshopContext: "Created in a domestic karkhana setting, serving as a training reference sampler.",
      provenanceTimeline: [
        { stage: "Workshop Production", details: "Embroidered c. 1915 by Fatima Begum in Beerwah." },
        { stage: "Family Custody", details: "Inherited by granddaughter who donated it to the local guild." },
        { stage: "KHCRF Digital Archive", details: "Scanned, motif mapped, and cataloged." }
      ],
      comparativeExamples: "No similar Koshish stitch patterns recorded in the state registry.",
      conditionAssessment: "Moderate silk thread decay; cotton base is slightly stained.",
      conservationRecommendations: "Lying flat in nitrogen chamber; spot cleaned using non-water methods.",
      digitalStatus: "Fully Documented & Motif Mapped",
      rarityEvidence: {
        documentedExamples: 1,
        earliestConfirmedDate: "c. 1915",
        similarCollections: 0,
        techniquePracticed: "Limited",
        materialAvailability: "Common",
        provenanceConfidence: "High",
        conservationPriority: "High",
        scarcityStars: 5,
        historicalStars: 4,
        technicalStars: 4,
        materialStars: 3,
        provenanceStars: 5,
        documentationStars: 5,
        conservationStars: 4
      },
      relatedHistory: "KHCRF-OH-2026-015",
      relatedDoc: "Doc-KHCRF-2026-18",
      relatedDemo: "KHCRF-CD-2026-009",
      relatedCollection: "KHCRF-COL-2026-012",
      bibliography: "Beerwah Handcraft Collective Archives (1920).",
      citation: "KHCRF-RO-2026-004 needlework catalog.",
      rights: "Courtesy Budgam Community Museum Collection"
    },
    {
      slug: "ro-royal-vessel",
      archiveNumber: "KHCRF-RO-2026-005",
      title: "Copper Vessel with Royal Commission Inscription",
      subtitle: "Historic Patronage Object Commissioned by the Dogra Royal Court in 1905",
      objectType: "Engraved Samovar",
      craft: "Copperware",
      technique: "Copper Engraving & Naqashi",
      maker: "Ustad Ahad Bhat",
      workshop: "Ahad Bhat Copperware",
      district: "Srinagar",
      period: "20th Century",
      material: "Forged Copper, Tin Lining",
      dimensions: "38cm height x 30cm diameter",
      location: "Srinagar Palace Museum Archive",
      ownership: "Institutional Stewardship",
      docStatus: "Fully Documented",
      desc: "A heavy forged copper samovar bearing the royal seal inscription of the Maharaja of Jammu & Kashmir. This piece exhibits rare hand-engraving depicting local hunting scenes, a decoration style strictly regulated and reserved for court presentations.",
      whyRareReason: "Carries verified royal court inscriptions and depicts rare court-exclusive figurative engravings.",
      whyRarePoints: [
        "Verified royal inventory inscription on handle.",
        "Depicts rare hunting scenes on copper (most samovars are geometric or floral).",
        "Provenance documented through Srinagar palace registers."
      ],
      historicalContext: "Commissioned c. 1905 during the reign of Maharaja Pratap Singh for use in royal guest halls.",
      technicalDescription: "Forged copper hammered by hand, hand-chased with deep relief engravings.",
      materialAnalysis: "High-purity copper (98.6%) with local tin liner.",
      workshopContext: "Fabricated under direct administrative supervision of the court Handcraft Commissioner.",
      provenanceTimeline: [
        { stage: "Workshop Production", details: "Fabricated c. 1905 by Ustad Ahad Bhat." },
        { stage: "Original Patron", details: "Delivered to Dogra Royal Guest Palace, Gulab Bhavan." },
        { stage: "Family Custody", details: "Acquired by collector during the palace inventory sales." },
        { stage: "KHCRF Digital Archive", details: "Digitally cataloged with royal archives." }
      ],
      comparativeExamples: "One similar vessel is held in the Jammu Palace Archive.",
      conditionAssessment: "Excellent, with minor tarnish on handle joint.",
      conservationRecommendations: "Dry air display, no chemical polishes.",
      digitalStatus: "Fully Documented (3D Scan Available)",
      rarityEvidence: {
        documentedExamples: 2,
        earliestConfirmedDate: "c. 1905",
        similarCollections: 1,
        techniquePracticed: "Yes",
        materialAvailability: "Common",
        provenanceConfidence: "High",
        conservationPriority: "Medium",
        scarcityStars: 4,
        historicalStars: 5,
        technicalStars: 5,
        materialStars: 3,
        provenanceStars: 5,
        documentationStars: 5,
        conservationStars: 3
      },
      relatedHistory: "KHCRF-OH-2026-021",
      relatedDoc: "Doc-KHCRF-2026-25",
      relatedDemo: "KHCRF-CD-2026-015",
      relatedCollection: "KHCRF-COL-2026-018",
      bibliography: "Dogra Royal Court inventories (1910).",
      citation: "KHCRF-RO-2026-005 court registry.",
      rights: "Courtesy Srinagar Palace Museum Archive"
    },
    {
      slug: "ro-practice-panel",
      archiveNumber: "KHCRF-RO-2026-006",
      title: "Walnut Apprentice Practice Panel",
      subtitle: "Rare Evidence of Traditional Training Showing Graduated Wood Carving Exercises",
      objectType: "Practice Panel",
      craft: "Walnut Wood",
      technique: "Graduated relief carving exercises",
      maker: "Apprentice Ghulam Qadir",
      workshop: "Qadir Wood Carving Studio",
      district: "Srinagar",
      period: "20th Century",
      material: "Seasoned Wild Walnut Wood",
      dimensions: "120cm x 30cm x 3cm",
      location: "KHCRF Education Hub",
      ownership: "Private Trust Custody",
      docStatus: "Fully Documented",
      desc: "A walnut board utilized by an apprentice woodcarver to practice graduated techniques, from simple line chasing to double-relief leaves. Wood boards were routinely shaved down and reused, making this surviving panel an exceptional record of training history.",
      whyRareReason: "Apprentice boards were almost always shaved down and reused, leaving this as the only known surviving complete panel.",
      whyRarePoints: [
        "Demonstrates structural pedagogy of wood carving apprenticeship c. 1935.",
        "Preserves notes and guides carved by the master instructor.",
        "Avoided shaving due to a workshop closure in 1947."
      ],
      historicalContext: "Carved c. 1935, this panel illustrates the traditional ustad-shagird training system in Srinagar before modern school classrooms.",
      technicalDescription: "Single solid walnut plank featuring 10 progressive panels of increasing technical difficulty.",
      materialAnalysis: "Wild walnut wood, seasoned naturally for approximately 8 years before carving.",
      workshopContext: "Qadir wood carving studio located in Safa Kadal, which closed during partition migration.",
      provenanceTimeline: [
        { stage: "Workshop Production", details: "Used by Ghulam Qadir c. 1935." },
        { stage: "Family Custody", details: "Retained in the closed workshop building and discovered during renovations." },
        { stage: "KHCRF Digital Archive", details: "Fully photographed and analyzed for training research." }
      ],
      comparativeExamples: "No similar apprentice panels recorded in other archives.",
      conditionAssessment: "Dry wood worm damage at top; carving zones are clean.",
      conservationRecommendations: "Fumigation and resin consolidation of insect exit holes.",
      digitalStatus: "Fully Documented & Restored",
      rarityEvidence: {
        documentedExamples: 1,
        earliestConfirmedDate: "c. 1935",
        similarCollections: 0,
        techniquePracticed: "No",
        materialAvailability: "Rare",
        provenanceConfidence: "Medium",
        conservationPriority: "High",
        scarcityStars: 5,
        historicalStars: 4,
        technicalStars: 4,
        materialStars: 4,
        provenanceStars: 4,
        documentationStars: 5,
        conservationStars: 4
      },
      relatedHistory: "KHCRF-OH-2026-031",
      relatedDoc: "Doc-KHCRF-2026-32",
      relatedDemo: "KHCRF-CD-2026-022",
      relatedCollection: "KHCRF-COL-2026-024",
      bibliography: "Traditional Guild Pedagogy Manuals (1940).",
      citation: "KHCRF-RO-2026-006 apprenticeship survey.",
      rights: "Courtesy KHCRF Education Hub Archives"
    },
    {
      slug: "ro-pigment-board",
      archiveNumber: "KHCRF-RO-2026-007",
      title: "Papier-Mâché Pigment Sample Board",
      subtitle: "Obsolete Color Reference Board Storing Natural Mineral Pigment Swatches",
      objectType: "Color Swatch Board",
      craft: "Papier-Mâché",
      technique: "Naqashi Painting & Pigment Mixing",
      maker: "Ustad Habibullah",
      workshop: "Zadibal Naqashi Studio",
      district: "Srinagar",
      period: "19th Century",
      material: "Lacquered Papier-Mâché base, Mineral & Plant pigments",
      dimensions: "45cm x 22cm",
      location: "KHCRF Conservation Lab",
      ownership: "Private Trust Custody",
      docStatus: "Fully Documented",
      desc: "A reference board used by a papier-mâché workshop to store color swatches of natural mineral pigments, including lapis lazuli blue, gold leaf, and cochineal red. Swatch boards were rare as recipes were kept secret and committed to memory.",
      whyRareReason: "Most workshop swatch boards were destroyed or paint-stripped for reuse when chemical pigments were adopted.",
      whyRarePoints: [
        "Preserves raw physical swatches of 18 historical natural pigments.",
        "Features handwritten Persian pigment names next to each swatch.",
        "Provides baseline reference for chemical pigment analysis."
      ],
      historicalContext: "Created in the late 19th Century in Zadibal, the primary hub of papier-mâché artisans in Srinagar.",
      technicalDescription: "Lacquered papier-mâché tray with distinct painted squares of natural pigments, finished with early copal varnish.",
      materialAnalysis: "Gold swatches are verified 24k leaf; blue is verified imported Afghan lapis lazuli.",
      workshopContext: "Zadibal studio under Persian export trade influence, keeping strict chemical secret codes.",
      provenanceTimeline: [
        { stage: "Workshop Production", details: "Prepared c. 1890 for color consistency." },
        { stage: "Family Custody", details: "Passed down inside Zadibal Naqash families." },
        { stage: "KHCRF Digital Archive", details: "Acquired for pigment restoration baseline research." }
      ],
      comparativeExamples: "One similar board is in the Srinagar Museum archive.",
      conditionAssessment: "Cracking in the lacquer overlay; swatches remain intact.",
      conservationRecommendations: "Stored in desiccated environment (RH 45%), shielded from light.",
      digitalStatus: "Spectral Analysis Completed",
      rarityEvidence: {
        documentedExamples: 2,
        earliestConfirmedDate: "c. 1890",
        similarCollections: 1,
        techniquePracticed: "No",
        materialAvailability: "Rare",
        provenanceConfidence: "High",
        conservationPriority: "High",
        scarcityStars: 5,
        historicalStars: 5,
        technicalStars: 4,
        materialStars: 5,
        provenanceStars: 5,
        documentationStars: 5,
        conservationStars: 4
      },
      relatedHistory: "KHCRF-OH-2026-037",
      relatedDoc: "Doc-KHCRF-2026-38",
      relatedDemo: "KHCRF-CD-2026-028",
      relatedCollection: "KHCRF-COL-2026-029",
      bibliography: "Zadibal Workshop Secret Codes (1902).",
      citation: "KHCRF-RO-2026-007 pigment analysis registry.",
      rights: "Courtesy Zadibal Guild Custodians"
    },
    {
      slug: "ro-felt-templates",
      archiveNumber: "KHCRF-RO-2026-008",
      title: "Namda Design Template Archive",
      subtitle: "Preserving Historic Pattern Planning Templates for Felted Wool Floor Rugs",
      objectType: "Pattern Templates",
      craft: "Namda",
      technique: "Wool Felting & Layout Chalking",
      maker: "Unknown Wool Felt Guild",
      workshop: "Anantnag Felt Artisans",
      district: "Anantnag",
      period: "20th Century",
      material: "Thick Stenciled Parchment Paper, Charcoal Residue",
      dimensions: "85cm x 60cm",
      location: "Anantnag Guild Hall",
      ownership: "Community Custody",
      docStatus: "Under Research",
      desc: "A series of stenciled paper patterns used to trace geometric layouts onto pressed wool felt rugs. They preserve large-scale motifs that were discontinued when Namda production was downscaled for tourist export markets.",
      whyRareReason: "Paper stencils typically dissolved in the wet felting environment, making this dry set extremely rare.",
      whyRarePoints: [
        "Pre-tourist era layout templates featuring complex interlocking mandalas.",
        "Preserves traces of historical organic charcoal markers.",
        "Documents the forgotten felt pattern configurations of Anantnag."
      ],
      historicalContext: "Dating from the 1920s, these stencils reflect early attempts to standardize carpet-like designs on felt.",
      technicalDescription: "Perforated heavy paper sheets designed for charcoal dusting transfer onto wool beds.",
      materialAnalysis: "Handmade pulp paper showing high hemp content, resistant to water tearing.",
      workshopContext: "Anantnag felt artisans working in centralized winter workshops.",
      provenanceTimeline: [
        { stage: "Workshop Production", details: "Created c. 1920 in Anantnag." },
        { stage: "Family Custody", details: "Preserved by the local cooperative society archive." },
        { stage: "Research Documentation", details: "Inventoried and digitized under the KHCRF community archives project." }
      ],
      comparativeExamples: "No similar felt stencils exist in recorded handcraft registries.",
      conditionAssessment: "Fragile, with water damage and creased corners.",
      conservationRecommendations: "Deacidification treatment and storage in custom flat drawers.",
      digitalStatus: "Under Research (Partially Digitized)",
      rarityEvidence: {
        documentedExamples: 3,
        earliestConfirmedDate: "c. 1920",
        similarCollections: 0,
        techniquePracticed: "No",
        materialAvailability: "Common",
        provenanceConfidence: "Medium",
        conservationPriority: "Medium",
        scarcityStars: 4,
        historicalStars: 4,
        technicalStars: 4,
        materialStars: 3,
        provenanceStars: 4,
        documentationStars: 4,
        conservationStars: 3
      },
      relatedHistory: "KHCRF-OH-2026-042",
      relatedDoc: "Doc-KHCRF-2026-44",
      relatedDemo: "KHCRF-CD-2026-035",
      relatedCollection: "KHCRF-COL-2026-038",
      bibliography: "Anantnag Felting Society Archives (1930).",
      citation: "KHCRF-RO-2026-008 Namda inventory.",
      rights: "Courtesy Anantnag Guild Trust"
    },
    {
      slug: "ro-family-notebook",
      archiveNumber: "KHCRF-RO-2026-009",
      title: "Family Pattern Notebook",
      subtitle: "Three Generations of Hand-drawn Workshop Design Sketches",
      objectType: "Design Notebook",
      craft: "Sozni",
      technique: "Design sketching and pattern mapping",
      maker: "Mir family designers",
      workshop: "Mir Curation Studio",
      district: "Srinagar",
      period: "19th Century",
      material: "Local handmade paper, indigo wash ink",
      dimensions: "18cm x 12cm",
      location: "Private Family Collection, Srinagar",
      ownership: "Family Custody",
      docStatus: "Provenance Verification",
      desc: "A pocket ledger filled with hand-drawn Sozni embroidery motifs, including botanical diagrams, border configurations, and layout sketches, compiled across three generations of the Mir family of master embroiderers.",
      whyRareReason: "Most design sketchbooks were kept secret and destroyed upon the head artisan's passing to prevent copyright copycats.",
      whyRarePoints: [
        "Continuous family updates spanning 1898 to 1965.",
        "Shows progressive evolution of the Chinar and Buta motifs over time.",
        "Annotated with Kashmiri design jargon terms."
      ],
      historicalContext: "Contains annotations in Urdu, Persian, and early Kashmiri, recording historical price rates and designer signatures.",
      technicalDescription: "Thread-bound notebook containing 48 pages of fine ink wash drawings.",
      materialAnalysis: "Paper matches Srinagar's historical Nowshera pulp mills; ink shows copperas trace.",
      workshopContext: "High-end custom commission workshop in Old Srinagar.",
      provenanceTimeline: [
        { stage: "Workshop Production", details: "Started c. 1898 by Ustad Ghulam Rasool Mir." },
        { stage: "Family Custody", details: "Maintained and updated by sons and grandsons in Srinagar." },
        { stage: "Provenance Verification", details: "Submitted to KHCRF for validation and digitization." }
      ],
      comparativeExamples: "One similar notebook is in the National Museum collection.",
      conditionAssessment: "Paper is highly acidic and yellowed; binding thread is loose.",
      conservationRecommendations: "Re-binding with archival thread, interleaving with buffered tissue.",
      digitalStatus: "In-Queue for Scanning",
      rarityEvidence: {
        documentedExamples: 4,
        earliestConfirmedDate: "c. 1898",
        similarCollections: 2,
        techniquePracticed: "Yes",
        materialAvailability: "Rare",
        provenanceConfidence: "High",
        conservationPriority: "Medium",
        scarcityStars: 4,
        historicalStars: 5,
        technicalStars: 3,
        materialStars: 5,
        provenanceStars: 5,
        documentationStars: 3,
        conservationStars: 3
      },
      relatedHistory: "KHCRF-OH-2026-048",
      relatedDoc: "Doc-KHCRF-2026-51",
      relatedDemo: "KHCRF-CD-2026-042",
      relatedCollection: "KHCRF-COL-2026-046",
      bibliography: "Srinagar Design Lineages volumes (1915).",
      citation: "KHCRF-RO-2026-009 Mir family catalog.",
      rights: "Private Custody (Mir Family Collection)"
    },
    {
      slug: "ro-sozni-sampler",
      archiveNumber: "KHCRF-RO-2026-010",
      title: "Early Sozni Sampler",
      subtitle: "Obsolete Technical Record of Fine Needle Techniques on Pashm Base",
      objectType: "Needlework Sampler",
      craft: "Sozni",
      technique: "Fine needle satin stitch variations",
      maker: "Sultan Begum",
      workshop: "Begum Domestic Atelier",
      district: "Ganderbal",
      period: "19th Century",
      material: "Pashmina base fabric, hand-spun raw silk thread",
      dimensions: "40cm x 40cm",
      location: "KHCRF Collection",
      ownership: "Private Trust Custody",
      docStatus: "Fully Documented",
      desc: "A small square pashmina panel preserving 24 distinct hand-stitched borders. This technical sampler demonstrates obsolete needle tension styles that are no longer used by contemporary Sozni embroiderers.",
      whyRareReason: "Stitch samplers (namunas) on pashmina fabric are rarely preserved as the fabric was expensive and reserved for full shawls.",
      whyRarePoints: [
        "Utilizes expensive hand-spun pashm as a practice base.",
        "Preserves five border stitches that have no modern equivalents.",
        "Provenance documented through Ganderbal community elders."
      ],
      historicalContext: "Stitched c. 1895, representing technical standards before commercial stencil printing replaced hand tracing.",
      technicalDescription: "Fine embroidery on natural undyed pashm using local organic silk threads.",
      materialAnalysis: "Base fiber exhibits fine 14-micron pashmina wool diameter.",
      workshopContext: "Domestic women's atelier in Ganderbal, focused on luxury bridal shawl contracts.",
      provenanceTimeline: [
        { stage: "Workshop Production", details: "Stitched c. 1895 by Sultan Begum." },
        { stage: "Family Custody", details: "Preserved in bridal chests as a technical master sample." },
        { stage: "KHCRF Digital Archive", details: "Acquired, documented, and published online." }
      ],
      comparativeExamples: "No similar pashmina-base samplers recorded in the craft directories.",
      conditionAssessment: "Fair, with minor surface dirt and slight pilling.",
      conservationRecommendations: "Vacuum cleaned through protective mesh, stored under low light.",
      digitalStatus: "Fully Documented & Photographed",
      rarityEvidence: {
        documentedExamples: 2,
        earliestConfirmedDate: "c. 1895",
        similarCollections: 0,
        techniquePracticed: "No",
        materialAvailability: "Rare",
        provenanceConfidence: "High",
        conservationPriority: "Medium",
        scarcityStars: 5,
        historicalStars: 4,
        technicalStars: 5,
        materialStars: 5,
        provenanceStars: 4,
        documentationStars: 5,
        conservationStars: 3
      },
      relatedHistory: "KHCRF-OH-2026-054",
      relatedDoc: "Doc-KHCRF-2026-58",
      relatedDemo: "KHCRF-CD-2026-048",
      relatedCollection: "KHCRF-COL-2026-052",
      bibliography: "Historic Needlework Registers (1900).",
      citation: "KHCRF-RO-2026-010 technical index.",
      rights: "Courtesy KHCRF Archive Trust"
    },
    {
      slug: "ro-toolmaker-catalog",
      archiveNumber: "KHCRF-RO-2026-011",
      title: "Traditional Toolmaker's Catalogue",
      subtitle: "Obsolete Paper Booklet Listing Handcrafted Woodcarving Chisels and Adzes",
      objectType: "Forge Catalog Booklet",
      craft: "Walnut Wood",
      technique: "Chisel forging and toolmaking cataloging",
      maker: "Lohar Ahmad & Sons Forge",
      workshop: "Ahmad Forge Downtown",
      district: "Srinagar",
      period: "20th Century",
      material: "Printed newsprint paper, iron oxide ink",
      dimensions: "15cm x 10cm",
      location: "KHCRF Archive Library",
      ownership: "Private Trust Custody",
      docStatus: "Fully Documented",
      desc: "A small printed catalog booklet listing over 80 types of hand-forged woodcarving chisels, adzes, and gouges, detailing their shapes, functions, and traditional names. This documents the complex tool array used in early walnut workshops.",
      whyRareReason: "Tool catalogs from traditional blacksmiths were treated as ephemeral waste and almost never survived.",
      whyRarePoints: [
        "Lists obsolete names for 32 specialized carving chisels.",
        "Provides pricing scales and workshop order sizes from 1912.",
        "Verified stamp of the Srinagar Lohar (Blacksmith) Guild."
      ],
      historicalContext: "Printed in 1912, recording local manufacturing infrastructure before the import of mass-produced foreign tools.",
      technicalDescription: "8-page paper pamphlet, woodblock printed with hand-drawn tool profiles.",
      materialAnalysis: "Acidic wood-pulp paper with visible carbon ink stamps.",
      workshopContext: "Downtown forge supplying woodcarving workshops across Kashmir.",
      provenanceTimeline: [
        { stage: "Workshop Production", details: "Printed in 1912 for the Srinagar Handcraft Fair." },
        { stage: "Family Custody", details: "Kept in family tool chests as a forge inventory record." },
        { stage: "KHCRF Digital Archive", details: "Acquired and fully digitized in high-resolution." }
      ],
      comparativeExamples: "No similar toolmaker catalogs recorded in regional archives.",
      conditionAssessment: "Very fragile; paper is brittle with split center crease.",
      conservationRecommendations: "Stored in polyester sleeve inside archival binder.",
      digitalStatus: "Fully Digitized (PDF Available)",
      rarityEvidence: {
        documentedExamples: 1,
        earliestConfirmedDate: "c. 1912",
        similarCollections: 0,
        techniquePracticed: "No",
        materialAvailability: "Rare",
        provenanceConfidence: "High",
        conservationPriority: "High",
        scarcityStars: 5,
        historicalStars: 5,
        technicalStars: 4,
        materialStars: 4,
        provenanceStars: 5,
        documentationStars: 5,
        conservationStars: 4
      },
      relatedHistory: "KHCRF-OH-2026-062",
      relatedDoc: "Doc-KHCRF-2026-64",
      relatedDemo: "KHCRF-CD-2026-054",
      relatedCollection: "KHCRF-COL-2026-058",
      bibliography: "Lohar Guild commercial pamphlets (1915).",
      citation: "KHCRF-RO-2026-011 tool registry.",
      rights: "Courtesy KHCRF Archive Library"
    },
    {
      slug: "ro-willow-ledger",
      archiveNumber: "KHCRF-RO-2026-012",
      title: "Willow Harvest Ledger",
      subtitle: "Historic Production Records from Rural Willow Wicker Workshops",
      objectType: "Cooperative Ledger",
      craft: "Willow Wicker",
      technique: "Harvest recording and community labor logs",
      maker: "Village Cooperative Council",
      workshop: "Shallabugh Cooperative Archive",
      district: "Ganderbal",
      period: "20th Century",
      material: "Rag-paper ledger, native walnut ink dye",
      dimensions: "32cm x 20cm",
      location: "Shallabugh Archive Collection",
      ownership: "Community Custody",
      docStatus: "Fully Documented",
      desc: "A community logbook documenting willow harvesting, boiling times, peeling teams, and weaving allocations in the village of Shallabugh. This records early cooperative management in rural wicker economies.",
      whyRareReason: "Rural agricultural craft logbooks were routinely discarded or water-damaged, leaving this as the earliest record of Shallabugh's cooperative.",
      whyRarePoints: [
        "Earliest written record of collective wicker boiling schedules c. 1938.",
        "Details labor logs of 40 historical basket weaving families.",
        "Writings utilize locally prepared walnut husk ink."
      ],
      historicalContext: "Compiled between 1938 and 1952, recording the growth of Shallabugh into Kashmir's primary willow wicker hub.",
      technicalDescription: "Hardcover ledger containing hand-drawn tables of harvest yields.",
      materialAnalysis: "Cotton rag paper with high resistance to damp decay; ink is organic juglone.",
      workshopContext: "Shallabugh village cooperative during early rural development schemes.",
      provenanceTimeline: [
        { stage: "Workshop Production", details: "Maintained c. 1938 by the village Cooperative Council secretary." },
        { stage: "Family Custody", details: "Preserved by the secretary's son in Shallabugh." },
        { stage: "KHCRF Digital Archive", details: "Photographed and indexed during the Ganderbal rural survey." }
      ],
      comparativeExamples: "No similar willow cooperatives logs exist from the pre-independence era.",
      conditionAssessment: "Stable; minor water stains on bottom corner edges.",
      conservationRecommendations: "De-humidified storage, kept in linen archival box.",
      digitalStatus: "100% Digitized (High-Res Facsimile Available)",
      rarityEvidence: {
        documentedExamples: 1,
        earliestConfirmedDate: "c. 1938",
        similarCollections: 0,
        techniquePracticed: "Yes",
        materialAvailability: "Common",
        provenanceConfidence: "High",
        conservationPriority: "Medium",
        scarcityStars: 5,
        historicalStars: 5,
        technicalStars: 3,
        materialStars: 3,
        provenanceStars: 5,
        documentationStars: 5,
        conservationStars: 3
      },
      relatedHistory: "KHCRF-OH-2026-072",
      relatedDoc: "Doc-KHCRF-2026-72",
      relatedDemo: "KHCRF-CD-2026-062",
      relatedCollection: "KHCRF-COL-2026-068",
      bibliography: "Ganderbal agricultural registries (1945).",
      citation: "KHCRF-RO-2026-012 Shallabugh logbook.",
      rights: "Courtesy Shallabugh Cooperative Archive"
    }
  ]);
  const [loading] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWhyRare, setSelectedWhyRare] = useState('All');
  const [selectedCraft, setSelectedCraft] = useState('All');
  const [selectedPeriod, setSelectedPeriod] = useState('All');
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Featured');

  const [activeItem, setActiveItem] = useState<RareObject | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'overview' | 'rarity' | 'provenance' | 'essay' | 'conservation' | 'relations'>('overview');
  const [currentView, setCurrentView] = useState<'gallery' | 'matrix' | 'catalogue' | 'map'>('gallery');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Global Maps plots for Interactive Map
  const mapPlots = [
    {
      name: "The Last Signed Talim Manuscript (Srinagar)",
      city: "Srinagar",
      country: "India",
      coords: "34.0837° N, 74.7973° E",
      holdings: 1,
      crafts: ["Carpet"],
      strengths: "Obsolete hand-written loom patterns",
      research: "Provenance verified continuously from 1898",
      artisans: "Ustad Habibullah Dar",
      techniques: "Talim Handwriting & Coding",
      motifs: "Shorthand design matrices",
      publications: "Loom Decipherment volumes"
    },
    {
      name: "Early Indigo-Dyed Pashmina Shawl (KHCRF Vault)",
      city: "Sopore",
      country: "India",
      coords: "34.2982° N, 74.4691° E",
      holdings: 1,
      crafts: ["Pashmina"],
      strengths: "Natural dye chemical chromatography",
      research: "Discontinued organic fermentation tracing",
      artisans: "Old Maharaj Gunj Guilds",
      techniques: "Indigofera fermentation dyeing",
      motifs: "Plain border traditional layouts",
      publications: "Natural Dye Monographs"
    },
    {
      name: "Prototype Kani Loom Components (Budgam)",
      city: "Budgam",
      country: "India",
      coords: "34.0150° N, 74.7244° E",
      holdings: 3,
      crafts: ["Kani"],
      strengths: "Obsolete bone and cedarwood shuttles",
      research: "Cooperatives tool archives mapping",
      artisans: "Ustad Salam-ud-Din Joinery",
      techniques: "Kani shuttle carving",
      motifs: "Engraved workshop signatures",
      publications: "Loom Component registers"
    },
    {
      name: "The Forgotten Chinar Pattern (Beerwah)",
      city: "Beerwah",
      country: "India",
      coords: "34.0289° N, 74.5936° E",
      holdings: 1,
      crafts: ["Sozni"],
      strengths: "Discontinued geometric leaf motif",
      research: "Obsolete Koshish block stitch mapping",
      artisans: "Fatima Begum",
      techniques: "Sozni needlework samplers",
      motifs: "Forgotten Chinar border",
      publications: "Beerwah Collective Archives"
    }
  ];

  const [mapSelectedCraft, setMapSelectedCraft] = useState('All');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mapSelectedPlot, setMapSelectedPlot] = useState<any>(null);

  const filteredMapPlots = mapPlots.filter(p => {
    if (mapSelectedCraft === 'All') return true;
    return p.crafts.includes(mapSelectedCraft);
  });

  // Nomination form state
  const [nominationForm, setNominationForm] = useState({
    title: '',
    craft: '',
    estimatedDate: '',
    custodian: '',
    location: '',
    reasonForRarity: '',
    provenance: '',
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
        estimatedDate: '',
        custodian: '',
        location: '',
        reasonForRarity: '',
        provenance: '',
        documentation: '',
        contact: ''
      });
    }, 4000);
  };

  const filteredObjects = allObjects.filter(obj => {
    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchText = `${obj.title} ${obj.subtitle} ${obj.archiveNumber} ${obj.craft} ${obj.maker} ${obj.workshop} ${obj.district} ${obj.material} ${obj.desc} ${obj.whyRareReason}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    // Why Is It Rare filter
    if (selectedWhyRare !== 'All') {
      if (selectedWhyRare === 'Only Known Example' && obj.rarityEvidence.documentedExamples !== 1) return false;
      if (selectedWhyRare === 'Very Few Surviving Examples' && (obj.rarityEvidence.documentedExamples <= 1 || obj.rarityEvidence.documentedExamples > 5)) return false;
      if (selectedWhyRare === 'Discontinued Technique' && obj.rarityEvidence.techniquePracticed !== 'No') return false;
      if (selectedWhyRare === 'Rare Material' && obj.rarityEvidence.materialAvailability !== 'Rare') return false;
      if (selectedWhyRare === 'Conservation Priority' && obj.rarityEvidence.conservationPriority !== 'High') return false;
      if (selectedWhyRare === 'Unique Provenance' && obj.rarityEvidence.provenanceConfidence !== 'High') return false;
      if (!obj.whyRareReason.toLowerCase().includes(selectedWhyRare.toLowerCase()) && 
          !obj.title.toLowerCase().includes(selectedWhyRare.toLowerCase()) &&
          selectedWhyRare !== 'Only Known Example' && 
          selectedWhyRare !== 'Very Few Surviving Examples' &&
          selectedWhyRare !== 'Discontinued Technique' &&
          selectedWhyRare !== 'Rare Material' &&
          selectedWhyRare !== 'Conservation Priority' &&
          selectedWhyRare !== 'Unique Provenance') {
        return false;
      }
    }

    // Craft filter
    if (selectedCraft !== 'All' && obj.craft !== selectedCraft) return false;

    // Period filter
    if (selectedPeriod !== 'All' && obj.period !== selectedPeriod) return false;

    // Material filter
    if (selectedMaterial !== 'All' && !obj.material.toLowerCase().includes(selectedMaterial.toLowerCase())) return false;

    // Documentation Status filter
    if (selectedStatus !== 'All' && obj.docStatus !== selectedStatus) return false;

    // Rarity Category filter
    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Extremely Rare' && obj.rarityEvidence.scarcityStars !== 5) return false;
      if (selectedCategory === 'Very Rare' && obj.rarityEvidence.scarcityStars !== 4) return false;
      if (selectedCategory === 'Historically Rare' && obj.rarityEvidence.historicalStars !== 5) return false;
      if (selectedCategory === 'Technically Rare' && obj.rarityEvidence.technicalStars !== 5) return false;
      if (selectedCategory === 'Materially Rare' && obj.rarityEvidence.materialStars !== 5) return false;
    }

    return true;
  });

  // Sorting Logic
  const sortedObjects = [...filteredObjects].sort((a, b) => {
    if (selectedSort === 'Recently Added') {
      return b.archiveNumber.localeCompare(a.archiveNumber);
    }
    if (selectedSort === 'Highest Documentary Value') {
      return b.rarityEvidence.documentationStars - a.rarityEvidence.documentationStars;
    }
    if (selectedSort === 'Historical Period') {
      return a.period.localeCompare(b.period);
    }
    if (selectedSort === 'Craft') {
      return a.craft.localeCompare(b.craft);
    }
    if (selectedSort === 'Alphabetical') {
      return a.title.localeCompare(b.title);
    }
    // Default: Featured (by scarcity stars descending)
    return b.rarityEvidence.scarcityStars - a.rarityEvidence.scarcityStars;
  });

  // Pagination
  const totalPages = Math.ceil(sortedObjects.length / itemsPerPage);
  const paginatedObjects = sortedObjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const featuredItem = allObjects[0]; // "The Last Signed Talim Manuscript"

  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pb-24 animate-fadeIn">
      
      {/* Detailed Modal Registry Sheet */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#3E2723]/40 backdrop-blur-sm" onClick={() => setActiveItem(null)}></div>
          <div className="relative z-10 bg-[#FAF9F6] border-2 border-[#3E2723] max-w-3xl w-full p-6 md:p-8 shadow-2xl text-[#2A2A2A] max-h-[95vh] overflow-y-auto custom-scrollbar font-mono rounded-xs" role="dialog" aria-modal="true">
            <button onClick={() => setActiveItem(null)} className="absolute top-4 right-4 text-[#3E2723]/50 hover:text-[#3E2723] text-xl font-bold font-mono">&times;</button>
            
            <div className="text-center mb-6 border-b border-[#3E2723]/25 pb-4">
              <span className="text-[#D4AF37] font-mono text-xs uppercase tracking-widest block mb-1 font-bold">KHCRF RARE OBJECT REGISTRY</span>
              <h2 className="text-xl md:text-2xl font-serif text-[#3E2723] font-bold leading-tight">{activeItem.title}</h2>
              {activeItem.subtitle && <p className="text-gray-550 text-xs italic font-serif mt-1">{activeItem.subtitle}</p>}
              
              <div className="flex flex-wrap justify-center gap-2 mt-3 font-mono text-[9px] uppercase tracking-wider text-gray-500">
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">ACCESSION: {activeItem.archiveNumber}</span>
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">TYPE: {activeItem.objectType}</span>
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">STATUS: {activeItem.docStatus}</span>
              </div>
            </div>

            {/* Modal Tabs navigation */}
            <div className="flex flex-wrap gap-1 border-b border-[#3E2723]/20 pb-3 mb-6 text-[10px] font-mono justify-center">
              {[
                { id: 'overview', label: 'Object Overview' },
                { id: 'rarity', label: 'Rarity Assessment' },
                { id: 'provenance', label: 'Provenance History' },
                { id: 'essay', label: 'Technical Essay' },
                { id: 'conservation', label: 'Conservation Profile' },
                { id: 'relations', label: 'Related Knowledge' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveModalTab(tab.id as 'overview' | 'rarity' | 'provenance' | 'essay' | 'conservation' | 'relations')}
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
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2">Technical Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div><span className="text-gray-400">OBJECT TITLE     :</span> {activeItem.title}</div>
                      <div><span className="text-gray-400">ARCHIVE NUMBER   :</span> {activeItem.archiveNumber}</div>
                      <div><span className="text-gray-400">OBJECT TYPE      :</span> {activeItem.objectType}</div>
                      <div><span className="text-gray-400">CRAFT            :</span> {activeItem.craft}</div>
                      <div><span className="text-gray-400">TECHNIQUE        :</span> {activeItem.technique}</div>
                      <div><span className="text-gray-400">MAKER            :</span> {activeItem.maker}</div>
                    </div>
                    <div className="space-y-1">
                      <div><span className="text-gray-400">WORKSHOP         :</span> {activeItem.workshop}</div>
                      <div><span className="text-gray-400">DISTRICT         :</span> {activeItem.district}</div>
                      <div><span className="text-gray-400">HISTORICAL PERIOD:</span> {activeItem.period}</div>
                      <div><span className="text-gray-400">MATERIAL         :</span> {activeItem.material}</div>
                      <div><span className="text-gray-400">DIMENSIONS       :</span> {activeItem.dimensions}</div>
                      <div><span className="text-gray-400">CURRENT LOCATION :</span> {activeItem.location}</div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3 space-y-1">
                    <div><span className="text-gray-400">OWNERSHIP STATUS :</span> {activeItem.ownership}</div>
                    <div><span className="text-gray-400">DOCUMENT STATUS  :</span> {activeItem.docStatus}</div>
                    <div><span className="text-gray-400">DIGITIZATION REF :</span> {activeItem.digitalStatus}</div>
                  </div>
                </div>
              )}

              {/* TAB 2: RARITY ASSESSMENT */}
              {activeModalTab === 'rarity' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2">Rarity Assessment Matrix</h3>
                  
                  <div className="bg-white border border-[#D4AF37]/20 p-4 rounded shadow-sm space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-150">
                      <span className="font-bold text-[#3E2723]">Rarity Evidence Dashboard</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[9px] text-gray-500 mb-4">
                      <div><span className="font-bold">Documented Examples:</span> {activeItem.rarityEvidence.documentedExamples} known</div>
                      <div><span className="font-bold">Earliest Confirmed Date:</span> {activeItem.rarityEvidence.earliestConfirmedDate}</div>
                      <div><span className="font-bold">Technique Practiced:</span> {activeItem.rarityEvidence.techniquePracticed}</div>
                      <div><span className="font-bold">Material Availability:</span> {activeItem.rarityEvidence.materialAvailability}</div>
                      <div><span className="font-bold">Provenance Confidence:</span> {activeItem.rarityEvidence.provenanceConfidence}</div>
                      <div><span className="font-bold">Conservation Priority:</span> {activeItem.rarityEvidence.conservationPriority}</div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-gray-100">
                      {[
                        { label: 'Scarcity', score: activeItem.rarityEvidence.scarcityStars },
                        { label: 'Historical Importance', score: activeItem.rarityEvidence.historicalStars },
                        { label: 'Technical Uniqueness', score: activeItem.rarityEvidence.technicalStars },
                        { label: 'Material Rarity', score: activeItem.rarityEvidence.materialStars },
                        { label: 'Provenance Strength', score: activeItem.rarityEvidence.provenanceStars },
                        { label: 'Documentation Quality', score: activeItem.rarityEvidence.documentationStars },
                        { label: 'Conservation Priority', score: activeItem.rarityEvidence.conservationStars }
                      ].map(score => (
                        <div key={score.label} className="flex justify-between items-center">
                          <span className="text-gray-600 font-bold">{score.label}</span>
                          <div className="flex text-[#D4AF37] gap-0.5 text-xs font-mono">
                            {'★'.repeat(score.score)}{'☆'.repeat(5 - score.score)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <span className="font-bold text-[#3E2723] uppercase block text-[9px] tracking-wider">Why This Object Is Rare:</span>
                    <p className="font-medium text-gray-700 italic">{activeItem.whyRareReason}</p>
                    <ul className="space-y-1 text-gray-550 list-disc pl-4 mt-2">
                      {activeItem.whyRarePoints.map((pt, idx) => (
                        <li key={idx}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 3: PROVENANCE */}
              {activeModalTab === 'provenance' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Provenance Timeline</h3>
                  <div className="border-l-2 border-[#3E2723]/20 pl-4 space-y-3 relative">
                    {activeItem.provenanceTimeline.map((pt, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[21px] top-1 bg-[#3E2723] w-2 h-2 rounded-full"></div>
                        <span className="font-bold text-[#3E2723]">{pt.stage}</span>
                        <p className="text-gray-500 text-[9px]">{pt.details}</p>
                      </div>
                    ))}
                    <div className="relative text-gray-400 italic text-[9px]">
                      Where provenance is uncertain, KHCRF explicitly identifies gaps instead of speculating.
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: TECHNICAL ESSAY */}
              {activeModalTab === 'essay' && (
                <div className="space-y-4 font-sans text-gray-655">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase font-mono border-b border-[#3E2723]/10 pb-1 mb-2">Curatorial Analysis</h3>
                  <p className="leading-relaxed font-sans text-gray-700">{activeItem.desc}</p>
                  
                  <div className="bg-[#FAF9F6] border border-gray-200 p-4 font-mono text-[10px] space-y-2 mt-4">
                    <div><strong className="text-gray-450 uppercase text-[8px] block">Historical Context:</strong> {activeItem.historicalContext}</div>
                    <div><strong className="text-gray-450 uppercase text-[8px] block mt-1">Technical Description:</strong> {activeItem.technicalDescription}</div>
                    <div><strong className="text-gray-450 uppercase text-[8px] block mt-1">Material Analysis:</strong> {activeItem.materialAnalysis}</div>
                    <div><strong className="text-gray-450 uppercase text-[8px] block mt-1">Workshop Context:</strong> {activeItem.workshopContext}</div>
                  </div>
                </div>
              )}

              {/* TAB 5: CONSERVATION PROFILE */}
              {activeModalTab === 'conservation' && (
                <div className="space-y-4 font-mono text-[10px] grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-[#D4AF37] font-bold border-b border-gray-200 pb-1 uppercase text-[9px]">Condition Assessment</h4>
                    <p className="text-gray-700">{activeItem.conditionAssessment}</p>
                    <div><span className="text-gray-400">Previous Treatments:</span> Sourced from private registry notes</div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[#D4AF37] font-bold border-b border-gray-200 pb-1 uppercase text-[9px]">Conservation Recommendations</h4>
                    <p className="text-gray-700">{activeItem.conservationRecommendations}</p>
                    <div><span className="text-gray-400">Digitization Status:</span> {activeItem.digitalStatus}</div>
                  </div>
                </div>
              )}

              {/* TAB 6: RELATED KNOWLEDGE */}
              {activeModalTab === 'relations' && (
                <div className="space-y-4 font-mono text-[11px]">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Scholarly Connections</h3>
                  <div className="bg-white border border-gray-200 p-4 space-y-1.5 text-[10px]">
                    <div><span className="text-gray-400">CITATION           :</span> KHCRF Rare Objects Archive, Record {activeItem.archiveNumber}.</div>
                    <div><span className="text-gray-400">RELATED ORAL HISTORY:</span> {activeItem.relatedHistory}</div>
                    <div><span className="text-gray-400">RELATED DOCUMENTARY :</span> {activeItem.relatedDoc}</div>
                    <div><span className="text-gray-400">RELATED DEMONSTRATION:</span> {activeItem.relatedDemo}</div>
                    <div><span className="text-gray-400">RELATED COLLECTION  :</span> {activeItem.relatedCollection}</div>
                    <div><span className="text-gray-400">BIBLIOGRAPHY        :</span> {activeItem.bibliography}</div>
                    <div><span className="text-gray-400">CITATION DETAILS    :</span> {activeItem.citation}</div>
                    <div><span className="text-gray-400">RIGHTS STATEMENT    :</span> {activeItem.rights}</div>
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
                <button onClick={() => setActiveItem(null)} className="border border-[#3E2723] hover:bg-[#3E2723]/5 text-[#3E2723] px-6 py-3 uppercase tracking-wider text-xs transition-colors font-light font-mono">
                  Return to Archive
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Hero section */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <UniversalEditorialHero pageKey="rare-objects" fallbackConfig={rareObjectsHeroFallback as any} />

      <div className="container-fluid mx-auto px-4 md:px-10 py-12 max-w-7xl animate-fadeIn">
        
        {/* Scholarly Statement */}
        <div className="bg-[#3E2723]/5 border-l-4 border-[#3E2723] p-8 mb-12 rounded-r-xs max-w-5xl">
          <p className="text-gray-700 text-base md:text-lg leading-relaxed font-serif">
            This is <strong>not</strong> a generic masterpieces gallery. The <strong>Rare Objects Archive</strong> documents and preserves craft traditions, experimental techniques, disappearing materials, forgotten workshop practices, and surviving examples that are difficult—or impossible—to encounter today. Unlike <strong>Signature Masterpieces</strong>, which focus on artistic excellence, this section focuses on <strong>scarcity, survival, uniqueness, and documentary importance</strong>.
          </p>
          <p className="text-gray-755 text-xs mt-3 uppercase tracking-widest font-bold font-mono">
            Each rare object is documented as an irreplaceable source of knowledge, helping researchers, artisans, museums, conservators, and future generations understand aspects of Kashmir&apos;s craft heritage that may otherwise disappear.
          </p>
          <div className="flex flex-wrap gap-4 mt-6 font-mono text-xs">
            <a href="#results" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-5 py-2.5 font-bold uppercase tracking-wider transition-all">
              Explore Rare Objects
            </a>
            <a href="#nominate-section" className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-5 py-2.5 font-bold uppercase tracking-wider transition-all">
              Nominate a Rare Object
            </a>
            <a href="#framework" className="text-[#3E2723] hover:underline font-bold py-2.5">
              Rare Object Assessment Framework &rarr;
            </a>
          </div>
        </div>

        {/* Featured Rare Object */}
        <section className="bg-white border-4 border-[#3E2723] p-8 md:p-10 mb-16 relative shadow-md">
          <div className="absolute top-0 right-0 bg-[#3E2723] text-[#D4AF37] px-4 py-1 text-[10px] font-mono font-bold uppercase tracking-widest">
            FEATURED RARE OBJECT
          </div>
          
          <div className="max-w-4xl font-mono">
            <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-1">
              Registry Record: {featuredItem.archiveNumber}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3E2723] leading-tight mb-2">
              {featuredItem.title}
            </h2>
            <h3 className="text-base md:text-lg font-serif italic text-gray-500 mb-4">
              {featuredItem.subtitle}
            </h3>
            
            <p className="text-gray-700 text-sm leading-relaxed mb-6 font-sans text-gray-655">
              {featuredItem.desc}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 font-mono text-[10px] border-t border-b border-gray-250 py-3 bg-gray-55 px-4">
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Object Type</span>
                <span className="font-bold text-[#3E2723]">{featuredItem.objectType}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Craft</span>
                <span className="font-bold text-[#3E2723]">{featuredItem.craft}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Dating Period</span>
                <span className="font-bold text-[#3E2723]">{featuredItem.period}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Assessments</span>
                <span className="font-bold text-[#D4AF37] font-bold">Provenance &amp; Rarity Evidence Complete</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => { setActiveItem(featuredItem); setActiveModalTab('overview'); }}
                className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-all font-mono"
              >
                Explore Object Details &rarr;
              </button>
            </div>
          </div>
        </section>

        {/* Why Rare Objects Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start mt-12">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-serif text-[#3E2723] mb-6 font-bold">Preserving Scarcity</h2>
            <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans">
              Scarcity often reveals stories that common objects cannot. A rare object may survive because it belongs to a disappearing craft tradition, documents an obsolete workshop technique, preserves a forgotten material, records a unique historical event, or remains the only known example of its kind.
            </p>
            <p className="text-gray-605 text-sm leading-relaxed font-sans">
              By documenting these works before knowledge is lost, KHCRF helps preserve evidence of Kashmir&apos;s artistic evolution, workshop diversity, cultural resilience, and technical ingenuity.
            </p>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#3E2723]/10 p-8 rounded-xs shadow-xs">
            <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 font-mono">
              Research Domains Supported:
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700 font-sans font-mono">
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>endangered techniques</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>discontinued workshop practices</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>unusual materials</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>historic commissions</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>experimental craftsmanship</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>lost motifs</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>surviving prototypes</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>rare signatures</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>exceptional provenance</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>undocumented regional traditions</li>
            </ul>
          </div>
        </section>

        {/* Comparative Research Tools Section */}
        <section className="bg-white border border-[#3E2723]/25 p-8 md:p-10 mb-16 rounded-xs shadow-sm" id="framework">
          <div className="border-b border-[#3E2723]/15 pb-4 mb-8">
            <span className="text-[#D4AF37] text-[10px] font-mono uppercase font-bold tracking-widest block mb-1">Preservation Principles</span>
            <h3 className="font-serif text-2xl font-bold text-[#3E2723]">Rare Object Assessment Framework</h3>
            <p className="text-gray-500 text-xs font-mono mt-1">EVIDENCE-BASED PRESERVATION METHODOLOGY</p>
          </div>

          <p className="text-gray-655 text-xs leading-relaxed mb-6 font-sans">
            Every rare object undergoes strict validation criteria to document why it qualifies as rare. Rather than vague claims of antiquity, KHCRF publishes evidence of scarcity:
          </p>

          <ul className="space-y-2 text-xs font-mono text-gray-700 mb-6">
            <li className="flex items-center gap-2"><span className="text-[#D4AF37]">▪</span><strong>Documented examples:</strong> exact count of similar cataloged objects globally.</li>
            <li className="flex items-center gap-2"><span className="text-[#D4AF37]">▪</span><strong>Technique status:</strong> whether the weave, stitch, or joinery is still practiced.</li>
            <li className="flex items-center gap-2"><span className="text-[#D4AF37]">▪</span><strong>Provenance timeline:</strong> continuous historical chain of custody registers.</li>
          </ul>
        </section>

        {/* Archive Overview Dashboard */}
        <section className="bg-[#3E2723] text-white p-8 md:p-10 mb-12 rounded-xs relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#3E2723] px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-widest">
            Registry Overview
          </div>
          <div className="mb-8 font-mono">
            <h3 className="font-serif text-2xl text-[#D4AF37] mb-2 font-bold font-serif">Rare Objects Registry Overview</h3>
            <p className="text-white/60 text-xs">
              FEDERATED SCARCITY INDEXING &amp; DOCUMENTATION SYSTEM
            </p>
          </div>

          {/* Primary Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 text-center md:text-left border-b border-white/10 pb-8 mb-8">
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Rare Objects</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">214</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Unique Techniques</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">83</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Documented Workshops</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">56</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Historical Periods</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">8</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Research Essays</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">214</span>
            </div>
            <div className="last:border-0">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Conservation Assessments</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">173</span>
            </div>
          </div>

          {/* Secondary Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 text-center md:text-left font-mono">
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Single Known Examples</span>
              <span className="text-xl font-serif font-semibold text-white/80 font-mono">41</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Endangered Techniques</span>
              <span className="text-xl font-serif font-semibold text-white/80">28</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Complete Provenance</span>
              <span className="text-xl font-serif font-semibold text-white/80 font-mono">96</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Family Heirlooms</span>
              <span className="text-xl font-serif font-semibold text-white/80">33</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Museum Collaborations</span>
              <span className="text-xl font-serif font-semibold text-white/80">19</span>
            </div>
            <div className="last:border-0">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Digitally Preserved</span>
              <span className="text-lg font-serif font-semibold text-[#D4AF37] block leading-tight font-mono">214</span>
            </div>
          </div>
        </section>

        {/* View Switcher Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 bg-[#FAF9F6] border border-[#3E2723]/10 p-4 font-mono" id="results">
          <div className="text-xs font-serif text-[#3E2723]">
            KHCRF Rare Objects Registry &bull; Showing {sortedObjects.length} Scarcity Cataloged Records
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] text-gray-400 uppercase self-center mr-2 font-mono">Archive Layout View:</span>
            <button 
              onClick={() => { setCurrentView('gallery'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'gallery' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-550 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Rare Object Gallery
            </button>
            <button 
              onClick={() => { setCurrentView('matrix'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'matrix' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Scarcity Matrix
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
              onClick={() => { setCurrentView('map'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'map' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Global Distribution
            </button>
          </div>
        </div>

        {/* Search and Discovery Layout */}
        <section className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Filters Sidebar */}
          {currentView !== 'map' && (
            <div className="w-full lg:w-1/4 bg-white border border-[#3E2723]/10 p-6 shadow-xs sticky top-4 z-10 font-sans">
              <h3 className="font-serif text-lg text-[#3E2723] mb-6 pb-2 border-b border-gray-100 flex items-center justify-between font-bold">
                <span>Filter Archive</span>
                <button 
                  onClick={() => {
                    setSelectedWhyRare('All');
                    setSelectedCraft('All');
                    setSelectedPeriod('All');
                    setSelectedMaterial('All');
                    setSelectedStatus('All');
                    setSelectedCategory('All');
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
                    placeholder="Search by object, rarity, craft, artisan, material, period, location..."
                    className="w-full border border-gray-200 px-3 py-2 text-xs rounded-none bg-[#FAF9F6] text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  />
                </div>

                {/* Why Is It Rare? */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Why Is It Rare?</label>
                  <select 
                    value={selectedWhyRare}
                    onChange={(e) => { setSelectedWhyRare(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Reasons</option>
                    <option value="Only Known Example">Only Known Example</option>
                    <option value="Very Few Surviving Examples">Very Few Surviving Examples</option>
                    <option value="Discontinued Technique">Discontinued Technique</option>
                    <option value="Rare Material">Rare Material</option>
                    <option value="Experimental Object">Experimental Object</option>
                    <option value="Historic Commission">Historic Commission</option>
                    <option value="Unique Provenance">Unique Provenance</option>
                    <option value="Last Workshop Example">Last Workshop Example</option>
                    <option value="Cultural Significance">Cultural Significance</option>
                    <option value="Conservation Priority">Conservation Priority</option>
                  </select>
                </div>

                {/* Craft tradition filter */}
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
                    <option value="All">All Periods</option>
                    <option value="Contemporary">Contemporary</option>
                    <option value="20th Century">20th Century</option>
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
                    <option value="Pashmina">Pashmina</option>
                    <option value="Silk">Silk</option>
                    <option value="Wool">Wool</option>
                    <option value="Copper">Copper</option>
                    <option value="Walnut">Walnut</option>
                    <option value="Papier-Mâché">Papier-Mâché</option>
                    <option value="Mixed Materials">Mixed Materials</option>
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
                    <option value="Under Research">Under Research</option>
                    <option value="Conservation Review">Conservation Review</option>
                    <option value="Provenance Verification">Provenance Verification</option>
                    <option value="Archive Preview">Archive Preview</option>
                  </select>
                </div>

                {/* Rarity Category */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Rarity Category</label>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Categories</option>
                    <option value="Extremely Rare">Extremely Rare</option>
                    <option value="Very Rare">Very Rare</option>
                    <option value="Regionally Rare">Regionally Rare</option>
                    <option value="Technically Rare">Technically Rare</option>
                    <option value="Historically Rare">Historically Rare</option>
                    <option value="Materially Rare">Materially Rare</option>
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
                    <option value="Highest Documentary Value">Highest Documentary Value</option>
                    <option value="Recently Added">Recently Added</option>
                    <option value="Historical Period">Historical Period</option>
                    <option value="Craft">Craft</option>
                    <option value="Alphabetical">Alphabetical</option>
                  </select>
                </div>

              </div>
            </div>
          )}

          {/* Results Area */}
          <div className={`w-full ${currentView === 'map' ? 'lg:w-full' : 'lg:w-3/4'}`}>

            {loading ? (
              <div className="py-20 text-center text-gray-505 font-serif font-bold">Loading collections...</div>
            ) : (
              <>
                {/* 1. RARE OBJECT GALLERY VIEW */}
                {currentView === 'gallery' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                    {paginatedObjects.map((obj, i) => (
                      <div 
                        key={i} 
                        className="bg-white border-2 border-[#3E2723]/35 py-8 px-6 hover:bg-[#3E2723]/5 transition-all duration-300 group flex flex-col justify-between shadow-sm relative grid-ledger font-mono text-xs"
                      >
                        <div>
                          {/* Accession ID & Date header */}
                          <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5 font-semibold">
                            <span>{obj.archiveNumber}</span>
                            <span>{obj.period.toUpperCase()}</span>
                          </div>

                          {/* Collection Type & Craft */}
                          <div className="text-[9px] font-mono text-[#D4AF37] font-bold uppercase tracking-widest mb-4">
                            RARE OBJECT &bull; {obj.craft.toUpperCase()}
                          </div>

                          {/* Title */}
                          <h3 
                            onClick={() => { setActiveItem(obj); setActiveModalTab('overview'); }}
                            className="text-xl md:text-2xl font-serif font-bold text-[#3E2723] leading-snug cursor-pointer group-hover:text-[#D4AF37] transition-colors"
                          >
                            {obj.title}
                          </h3>

                          {obj.subtitle && (
                            <h4 className="text-xs font-serif italic text-gray-500 mt-1 leading-snug mb-3">
                              {obj.subtitle}
                            </h4>
                          )}

                          <p className="text-gray-655 text-xs leading-relaxed mb-4 font-sans line-clamp-3 mt-3">
                            {obj.desc}
                          </p>

                          {/* Why Rare (Evidence Block) */}
                          <div className="relative pl-4 mb-4 border-l-2 border-[#D4AF37]/50 font-mono text-[10px] leading-relaxed my-4">
                            <span className="text-[9px] text-gray-400 uppercase tracking-wider block mb-1">
                              Why This Object Is Rare
                            </span>
                            <span className="font-bold text-[#3E2723]">
                              {obj.whyRareReason}
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="text-[#3E2723]/25 text-[9px] font-mono mb-3 select-none">
                            ─────╱╲──╱────╲╱─────
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto font-mono">
                            <span className="bg-[#3E2723]/5 border border-[#3E2723]/10 text-[#3E2723] text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider">
                              {obj.docStatus.toUpperCase()}
                            </span>
                            
                            <button 
                              onClick={() => { setActiveItem(obj); setActiveModalTab('overview'); }}
                              className="text-xs font-bold uppercase tracking-widest text-[#3E2723] hover:text-[#D4AF37] transition-colors font-mono"
                            >
                              Study Object &rarr;
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

                {/* 2. SCARCITY MATRIX VIEW */}
                {currentView === 'matrix' && (
                  <div className="space-y-6 animate-fadeIn font-mono text-xs">
                    {paginatedObjects.map((obj, i) => (
                      <div key={i} className="bg-white border border-[#3E2723]/15 p-6 shadow-xs relative">
                        <div className="absolute top-4 right-4 text-gray-300 font-bold font-mono text-sm">{obj.archiveNumber}</div>
                        <h4 className="text-[#3E2723] font-serif text-lg font-bold mb-1">{obj.title}</h4>
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-3">Dating Era: {obj.period} &bull; Craft Type: {obj.craft}</p>
                        
                        <div className="bg-[#FAF9F6] border border-gray-250 p-4 mt-3">
                          <span className="text-[#3E2723] font-bold text-[10px] uppercase block mb-1">Rarity Assessment Evidence</span>
                          <div className="text-[10px] space-y-1.5">
                            <div><strong className="text-gray-450 uppercase text-[8px]">Known Documented Examples:</strong> {obj.rarityEvidence.documentedExamples} similar instances worldwide</div>
                            <div><strong className="text-gray-450 uppercase text-[8px]">Technique Practiced Today:</strong> {obj.rarityEvidence.techniquePracticed}</div>
                            <div><strong className="text-gray-450 uppercase text-[8px]">Provenance Confidence:</strong> {obj.rarityEvidence.provenanceConfidence}</div>
                            <div><strong className="text-gray-450 uppercase text-[8px]">Conservation Priority:</strong> {obj.rarityEvidence.conservationPriority}</div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[9px] text-gray-400 uppercase mt-4 pt-3 border-t border-gray-100">
                          <span>Maker: {obj.maker} &bull; Workshop: {obj.workshop}</span>
                          <button 
                            onClick={() => { setActiveItem(obj); setActiveModalTab('rarity'); }}
                            className="text-[#3E2723] hover:underline font-bold"
                          >
                            Open Rarity Dashboard &rarr;
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
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Archive No</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Title & Rarity Profile</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Craft</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Maker / Workshop</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">District</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center font-mono">Era</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Material</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center font-mono">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#3E2723]/10 font-sans text-gray-700">
                        {paginatedObjects.map((obj, i) => (
                          <tr key={i} className="hover:bg-[#FAF9F6] transition-colors cursor-pointer" onClick={() => { setActiveItem(obj); setActiveModalTab('overview'); }}>
                            <td className="p-4 font-mono font-bold text-gray-500 whitespace-nowrap">{obj.archiveNumber}</td>
                            <td className="p-4">
                              <div className="font-serif font-bold text-[#3E2723] text-sm hover:text-[#D4AF37] transition-colors">{obj.title}</div>
                              <div className="text-[10px] text-gray-400 font-light truncate max-w-xs">{obj.whyRareReason}</div>
                            </td>
                            <td className="p-4 whitespace-nowrap font-bold">{obj.craft}</td>
                            <td className="p-4 whitespace-nowrap">{obj.maker} &bull; {obj.workshop}</td>
                            <td className="p-4 whitespace-nowrap">{obj.district}</td>
                            <td className="p-4 text-center whitespace-nowrap font-mono">{obj.period}</td>
                            <td className="p-4 whitespace-nowrap font-mono">{obj.material.split(',')[0]}</td>
                            <td className="p-4 text-center whitespace-nowrap font-mono">
                              <span className="px-2 py-0.5 font-mono text-[9px] uppercase border border-[#3E2723]/20 bg-[#3E2723]/5 text-[#3E2723] font-bold">
                                {obj.docStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 4. INTERACTIVE GLOBAL DISTRIBUTION VIEW */}
                {currentView === 'map' && (
                  <div className="bg-white border-2 border-[#3E2723] p-6 shadow-md animate-fadeIn font-mono text-xs">
                    <div className="border-b border-[#3E2723]/15 pb-3 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-[#3E2723] block mb-1">Global Preservation Distribution</h3>
                        <p className="text-gray-500 text-[10px]">SELECT A CRAFT TO HIGHLIGHT KNOWN PRESERVATION LOCATIONS WORLDWIDE</p>
                      </div>

                      {/* Craft Selector inside map view */}
                      <div className="flex gap-2">
                        {["All", "Carpet", "Pashmina", "Kani", "Sozni"].map((cr) => (
                          <button
                            key={cr}
                            onClick={() => { setMapSelectedCraft(cr); setMapSelectedPlot(null); }}
                            className={`px-3 py-1.5 text-[9px] font-bold uppercase border transition-colors ${
                              mapSelectedCraft === cr 
                                ? 'bg-[#D4AF37] text-white border-[#D4AF37]' 
                                : 'bg-[#FAF9F6] text-[#3E2723] border-gray-250 hover:border-[#3E2723]'
                            }`}
                          >
                            {cr}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* Left: Interactive plots directory */}
                      <div className="lg:col-span-7 bg-[#FAF9F6] border border-gray-250 p-4 space-y-4">
                        <span className="text-[10px] font-bold text-gray-400 block mb-2 uppercase">MAPPED RARE PLOTS ({filteredMapPlots.length})</span>
                        
                        <div className="space-y-3">
                          {filteredMapPlots.map((plot, idx) => (
                            <div 
                              key={idx}
                              onClick={() => setMapSelectedPlot(plot)}
                              className={`border p-3 cursor-pointer transition-all ${
                                mapSelectedPlot?.name === plot.name 
                                  ? 'bg-[#3E2723] text-white border-[#3E2723]' 
                                  : 'bg-white hover:bg-gray-50 border-gray-200 text-[#3E2723]'
                              }`}
                            >
                              <div className="flex justify-between items-center font-bold">
                                <span>{plot.name}</span>
                                <span className={mapSelectedPlot?.name === plot.name ? 'text-[#D4AF37]' : 'text-gray-400'}>{plot.coords}</span>
                              </div>
                              <div className={`text-[9px] mt-1 ${mapSelectedPlot?.name === plot.name ? 'text-white/60' : 'text-gray-500'}`}>
                                Location: {plot.city}, {plot.country}
                              </div>
                              <div className="flex gap-1.5 mt-2 flex-wrap text-[8px] uppercase tracking-wider font-bold">
                                {plot.crafts.map((c, cIdx) => (
                                  <span key={cIdx} className={`px-1.5 py-0.5 border ${mapSelectedPlot?.name === plot.name ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
                                    {c}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Selected Plot Details */}
                      <div className="lg:col-span-5 bg-white border border-[#3E2723]/15 p-5 shadow-xs">
                        {mapSelectedPlot ? (
                          <div className="space-y-4 text-[10px]">
                            <div className="border-b border-[#3E2723]/15 pb-2 mb-2">
                              <span className="text-[#D4AF37] font-bold text-[9px] block uppercase mb-0.5">PLOT SPECIFICATIONS</span>
                              <h4 className="font-serif text-base font-bold text-[#3E2723]">{mapSelectedPlot.name}</h4>
                              <p className="text-gray-500 text-[9px]">{mapSelectedPlot.city}, {mapSelectedPlot.country}</p>
                            </div>

                            <div>
                              <span className="text-gray-450 uppercase block text-[8px] font-bold mb-0.5">RARITY ATTRIBUTES</span>
                              <p className="text-gray-700 font-sans leading-relaxed">{mapSelectedPlot.strengths}</p>
                            </div>

                            <div>
                              <span className="text-gray-455 uppercase block text-[8px] font-bold mb-0.5">KHCRF DOCUMENTARY VALUE</span>
                              <p className="text-gray-700 font-sans leading-relaxed">{mapSelectedPlot.research}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-150">
                              <div>
                                <span className="text-gray-405 uppercase block text-[8px] font-bold">ASSOCIATED ARTISANS</span>
                                <span className="text-[#3949AB] font-bold text-[9px] block mt-0.5">{mapSelectedPlot.artisans}</span>
                              </div>
                              <div>
                                <span className="text-gray-455 uppercase block text-[8px] font-bold">CORE TECHNIQUES</span>
                                <span className="text-gray-700 text-[9px] block mt-0.5">{mapSelectedPlot.techniques}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-150">
                              <div>
                                <span className="text-gray-455 uppercase block text-[8px] font-bold">MOTIFS &amp; SYMBOLS</span>
                                <span className="text-gray-700 text-[9px] block mt-0.5">{mapSelectedPlot.motifs}</span>
                              </div>
                              <div>
                                <span className="text-gray-455 uppercase block text-[8px] font-bold">KEY REGISTRIES</span>
                                <span className="text-gray-700 text-[9px] block mt-0.5 leading-snug">{mapSelectedPlot.publications}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="py-20 text-center text-gray-400 italic">
                            Select a mapped object from the directory to inspect its global preservation details.
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            {currentView !== 'map' && totalPages > 1 && (
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

        {/* Identification Methodology */}
        <section className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs mt-16">
          <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold font-serif">
            How KHCRF Identifies Rare Objects
          </h2>
          <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans">
            Rare Objects are identified through historical research, field documentation, museum studies, family collections, workshop archives, technical examination, provenance investigation, and comparative analysis. Selection is based on documented evidence of rarity rather than market demand or anecdotal claims.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div>
              <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3 font-mono">Standardization Workflow</h3>
              <ol className="list-decimal pl-4 space-y-2 text-xs text-gray-600 font-mono">
                <li>Object nomination and preliminary review</li>
                <li>Rarity evidence assessment matrices</li>
                <li>Continuous provenance timeline trace</li>
                <li>Comparative cross-institutional academic checks</li>
                <li>Non-destructive mineral/fiber analysis</li>
                <li>Conservation stability review</li>
                <li>High-resolution digital mapping &amp; scans</li>
                <li>Metadata packaging &amp; registry logging</li>
                <li>Review by KHCRF Scientific Advisory Council</li>
                <li>Public publication and vault release</li>
              </ol>
            </div>
            <div>
              <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3 font-mono">Assessment Principles</h3>
              <p className="text-gray-655 text-xs leading-relaxed mb-4 font-sans">
                Evaluation is structured strictly around evidence-based scarcity, transparent provenance documentation, historical and technical uniqueness, conservation urgency, and scholarly peer review.
              </p>
              <p className="text-gray-605 text-[10px] font-mono leading-relaxed bg-[#FAF9F6] border border-gray-250 p-4">
                Important: Objects are not classified as rare solely because they are old, expensive, or privately owned. Selection requires documented evidence of technical, material, or historical scarcity.
              </p>
            </div>
          </div>
        </section>

        {/* Research & Educational Use */}
        <section className="bg-white border border-[#3E2723]/25 p-8 md:p-10 mb-16 rounded-xs shadow-sm">
          <h2 className="text-2xl font-serif text-[#3E2723] mb-4 font-bold font-serif">Research &amp; Educational Use</h2>
          <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans">
            The archive supports provenance research, conservation science, museum studies, craft history, material culture research, heritage management, university teaching, exhibition planning, and documentation of endangered knowledge.
          </p>
          <div className="flex gap-4 font-mono">
            <Link href="mailto:research@khcrf.org" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3 font-bold uppercase tracking-wider text-xs transition-colors">
              Request Research Access
            </Link>
            <a href="#nominate-section" className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-6 py-3 font-bold uppercase tracking-wider text-xs transition-colors">
              Nominate a Rare Object
            </a>
          </div>
        </section>

        {/* Contributions Form */}
        <section id="nominate-section" className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs">
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase block mb-1">Help Preserve Rare Craft Heritage</span>
            <h2 className="text-3xl font-serif text-[#3E2723] font-bold">Submit Rare Object Proposal</h2>
            <p className="text-gray-500 text-xs font-mono mt-1">Artisan families, collectors, museums, and workshops are invited to nominate objects.</p>
          </div>

          <div className="bg-[#FAF9F6] p-6 md:p-8 border border-gray-250">
            {nominationSubmitted ? (
              <div className="text-center py-8 font-mono">
                <h3 className="text-lg font-bold text-green-600 mb-2">Proposal Transmitted</h3>
                <p className="text-xs text-gray-500">Thank you. The KHCRF Documentation Committee will verify your submission metadata against our scarcity records.</p>
              </div>
            ) : (
              <form onSubmit={handleNominationSubmit} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Object Title *</label>
                    <input 
                      required 
                      type="text" 
                      value={nominationForm.title}
                      onChange={(e) => setNominationForm({...nominationForm, title: e.target.value})}
                      placeholder="e.g. Obsolete Walnut Practice Platter"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Craft Tradition *</label>
                    <input 
                      required 
                      type="text" 
                      value={nominationForm.craft}
                      onChange={(e) => setNominationForm({...nominationForm, craft: e.target.value})}
                      placeholder="e.g. Walnut Wood Carving"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Estimated Date / Era</label>
                    <input 
                      type="text" 
                      value={nominationForm.estimatedDate}
                      onChange={(e) => setNominationForm({...nominationForm, estimatedDate: e.target.value})}
                      placeholder="e.g. c. 1910"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Current Custodian *</label>
                    <input 
                      required 
                      type="text" 
                      value={nominationForm.custodian}
                      onChange={(e) => setNominationForm({...nominationForm, custodian: e.target.value})}
                      placeholder="e.g. Family heirloom trunk"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Location *</label>
                    <input 
                      required 
                      type="text" 
                      value={nominationForm.location}
                      onChange={(e) => setNominationForm({...nominationForm, location: e.target.value})}
                      placeholder="e.g. Srinagar, Kashmir"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Contact Info *</label>
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
                  <label className="block font-bold text-gray-500 mb-1">Reason for Rarity *</label>
                  <textarea 
                    required 
                    rows={4} 
                    value={nominationForm.reasonForRarity}
                    onChange={(e) => setNominationForm({...nominationForm, reasonForRarity: e.target.value})}
                    placeholder="Describe what makes this object exceptionally scarce (discontinued technique, rare material, documented signatures)..."
                    className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723] resize-none" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Known Provenance</label>
                    <textarea 
                      rows={2} 
                      value={nominationForm.provenance}
                      onChange={(e) => setNominationForm({...nominationForm, provenance: e.target.value})}
                      placeholder="List family custody, private collection history, or acquisition dates..."
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723] resize-none" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Supporting Documentation</label>
                    <textarea 
                      rows={2} 
                      value={nominationForm.documentation}
                      onChange={(e) => setNominationForm({...nominationForm, documentation: e.target.value})}
                      placeholder="List catalogs, books, or certificates mentioning similar objects..."
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723] resize-none" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-[#3E2723] hover:bg-[#D4AF37] text-white hover:text-[#3E2723] font-bold uppercase tracking-widest transition-colors font-mono"
                >
                  Submit Rare Object Proposal
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
          <p className="font-serif italic text-lg leading-relaxed text-white/80 max-w-3xl mx-auto">
            &ldquo;KHCRF Rare Objects preserve the uncommon, the endangered, and the irreplaceable. By documenting objects whose rarity lies in their history, technique, material, provenance, or survival, the archive safeguards knowledge that might otherwise disappear from Kashmir&apos;s living craft heritage.&rdquo;
          </p>
          <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto"></div>
        </div>
      </footer>

    </main>
  );
}
