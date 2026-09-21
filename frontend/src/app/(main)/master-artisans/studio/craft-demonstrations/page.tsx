'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { craftDemonstrationsHeroFallback } from '@/config/heroFallbacks';

export default function CraftDemonstrations() {
  const [allDemos, setAllDemos] = useState<any[]>([
    {
      slug: "demo-reading-talim",
      title: "Reading and Following Talim",
      subtitle: "Translating Traditional Carpet Coding into Hand-Knotted Weaving",
      dur: "38 Minutes",
      durationMin: 38,
      tag: "Technique Demonstration",
      img: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=600&auto=format&fit=crop",
      desc: "This demonstration explains how artisans interpret talim instructions and translate coded design sequences into precise knot placement on the loom. It documents reading rhythm, communication between talim reader and weavers, correction methods, and common interpretation errors.",
      accessionId: "KHCRF-CD-2026-001",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      level: "Intermediate",
      craft: "Hand-Knotted Carpet",
      artisan: "Mohammad Bhat",
      trainer: "Farooq Mir",
      workshop: "Bhat Karkhana, Srinagar",
      district: "Srinagar",
      recordingDate: "Recorded January 2026",
      version: "v1.2 (Version Controlled)",
      objective: "Basic Technique, Quality Control, Design Interpretation",
      format: "Full Demonstration",
      status: "Published",
      hasTranscript: "Yes",
      learningOutcomes: [
        "prepare materials correctly",
        "perform the demonstrated technique safely",
        "recognize common errors",
        "evaluate finished quality",
        "understand when specialist supervision is required"
      ],
      tools: [
        { name: "Traditional Talim Code Sheet", localName: "Talim", function: "Coded carpet pattern reading instruction", material: "Handwritten paper strip", dimensions: "3 x 18 inches", prep: "Grid pattern translation", maintenance: "Keep dry", problems: "Fading ink script", replacement: "Rewriting by talim master" },
        { name: "Comb Beetle", localName: "Yer", function: "Beating weft rows into place", material: "Iron and wood", dimensions: "8 inches long", prep: "None", maintenance: "Polishing teeth", problems: "Bending of teeth", replacement: "Local smith repair" }
      ],
      materials: [
        { name: "Hand-Spun Wool", source: "Budgam", localName: "Pashm", prep: "Sorting and combing", storage: "Dry ventilated bins", quality: "Even fiber thickness", unsuitable: "Damp warehouse storage", alternatives: "Machine spun wool yarn" }
      ],
      steps: [
        { step: "STEP 1", title: "Prepare the Wool", purpose: "Remove grease and debris", tools: "Iron comb", result: "Clean combed wool fiber locks", errors: "Combing too fast tears fibers", safety: "Use finger guards to prevent scratches" },
        { step: "STEP 2", title: "Arrange Warp Threads", purpose: "Set loom foundation tension", tools: "Tension pegs", result: "Evenly spaced vertical strings", errors: "Loose threads lead to uneven knots", safety: "Keep hands clear of raw tension bars" },
        { step: "STEP 3", title: "Begin Knotting", purpose: "Execute first carpet rows", tools: "Knotting knife", result: "Clean knot row matching base talim", errors: "Skipping codes ruins alignment", safety: "Point blades away from fingers" },
        { step: "STEP 4", title: "Inspect Alignment", purpose: "Ensure pattern alignment matches grid", tools: "Metal gauge rule", result: "Correct row symmetry", errors: "Ignoring minor shifts causes distortion", safety: "None" },
        { step: "STEP 5", title: "Correct Mistakes", purpose: "Re-knot uneven regions", tools: "Weaver hook", result: "Perfect design alignment", errors: "Forceful pulling snaps warps", safety: "Wear eye loupe protection" },
        { step: "STEP 6", title: "Final Quality Review", purpose: "Confirm density before wash", tools: "Beating comb", result: "High-density knotted base", errors: "Neglecting fringe inspection", safety: "None" }
      ],
      relatedHistories: "KHCRF-OH-2026-007",
      relatedDoc: "Doc-KHCRF-2026-03",
      relatedArticles: "Wage Structures & Patronage"
    },
    {
      slug: "demo-pashmina-fibre",
      title: "Preparing Raw Pashmina Fibre",
      subtitle: "Sorting, Cleaning and Spinning Preparation",
      dur: "15 Minutes",
      durationMin: 15,
      tag: "Technique Demonstration",
      img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop",
      desc: "This demonstration explains how raw Changthangi goat fleece is sorted by color, cleaned of organic matter, combed using traditional iron combs, and aligned into slivers for spinning.",
      accessionId: "KHCRF-CD-2026-002",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      level: "Beginner",
      craft: "Pashmina",
      artisan: "Zareena Begum",
      trainer: "Zehra Malik",
      workshop: "Domestic Spinners Co-op",
      district: "Srinagar",
      recordingDate: "Recorded February 2026",
      version: "v1.0",
      objective: "Material Knowledge, Basic Technique",
      format: "Material Demonstration",
      status: "Published",
      hasTranscript: "Yes",
      learningOutcomes: [
        "differentiate guard hair from fine pashm",
        "clean organic debris without breaking wool locks",
        "prepare uniform spinning slivers"
      ],
      tools: [
        { name: "Sorting Comb", localName: "Karah", function: "Combing raw fiber clumps", material: "Hand-forged iron", dimensions: "6 inches width", prep: "Rust cleaning", maintenance: "Oil tips periodically", problems: "Tine rust", replacement: "Local replacement" }
      ],
      materials: [
        { name: "Raw Pashm", source: "Ladakh Co-op", localName: "Raw Cashmere", prep: "Drying in sun", storage: "Canvas bags", quality: "Under 15 microns width", unsuitable: "Damp basements", alternatives: "None" }
      ],
      steps: [
        { step: "STEP 1", title: "Color Classification", purpose: "Separate brown, grey and white wool", tools: "Wooden sorting tray", result: "Pure color wool lots", errors: "Mixing shades stains finished yarn", safety: "Wear dusk mask to avoid dust inhalation" }
      ],
      relatedHistories: "KHCRF-OH-2026-009",
      relatedDoc: "Doc-KHCRF-2026-05",
      relatedArticles: "Invisible Spinning Labour"
    },
    {
      slug: "demo-kani-setup",
      title: "Setting Up a Traditional Kani Loom",
      subtitle: "Preparing Warp, Pattern and Kanis",
      dur: "45 Minutes",
      durationMin: 45,
      tag: "Technique Demonstration",
      img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop",
      desc: "An advanced demonstration of loading Pashmina warp threads onto a horizontal Kani loom, setting tension bars, and arranging the colored Tuj bobbins in accordance with design grids.",
      accessionId: "KHCRF-CD-2026-003",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      level: "Advanced",
      craft: "Kani",
      artisan: "Sobia Jan",
      trainer: "Zehra Malik",
      workshop: "Domestic Spinners Co-op",
      district: "Budgam",
      recordingDate: "Recorded January 2026",
      version: "v1.1",
      objective: "Loom Setup, Traditional Method",
      format: "Loom Demonstration",
      status: "Technical Review",
      hasTranscript: "Yes",
      learningOutcomes: [
        "align 2000+ warp threads on a single beam",
        "calculate tension loads",
        "organize Tuj colors"
      ],
      tools: [
        { name: "Weaving Tuj Sticks", localName: "Tuj", function: "Carrying colored weft thread rows", material: "Wild apricot wood", dimensions: "4 inches length", prep: "Smooth sanding", maintenance: "Waxing wood", problems: "Splintering tips", replacement: "Hand carving wood" }
      ],
      materials: [
        { name: "Pashmina Warp Yarn", source: "Domestic spinners", localName: "Warp Pashm", prep: "Sizing with rice water", storage: "Dry box", quality: "Double ply high twist", unsuitable: "High dry heat", alternatives: "Silk warp yarns" }
      ],
      steps: [
        { step: "STEP 1", title: "Beam Threading", purpose: "Heddle thread alignment", tools: "Threading hook", result: "Even spacing", errors: "Overlapping warp strands", safety: "None" }
      ],
      relatedHistories: "KHCRF-OH-2026-001",
      relatedDoc: "Doc-KHCRF-2026-05",
      relatedArticles: "GI Tag Preservation"
    },
    {
      slug: "demo-sozni-stitches",
      title: "Fundamental Sozni Stitches",
      subtitle: "Building Precision Through Hand Control",
      dur: "18 Minutes",
      durationMin: 18,
      tag: "Technique Demonstration",
      img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop",
      desc: "This beginner-friendly video details how needle angle, pressure, and embroidery thread spacing dictate the clarity of fine motifs on raw Pashmina shawls.",
      accessionId: "KHCRF-CD-2026-004",
      year: "2026",
      language: "Kashmiri",
      subtitles: "No",
      level: "Beginner",
      craft: "Sozni",
      artisan: "Safeena Jan",
      trainer: "Zehra Malik",
      workshop: "Domestic Co-op Pampore",
      district: "Srinagar",
      recordingDate: "Recorded February 2026",
      version: "v1.0",
      objective: "Basic Technique, Tool Handling",
      format: "Short Technique",
      status: "Published",
      hasTranscript: "Yes",
      learningOutcomes: [
        "execute basic Sozni stitch paths",
        "verify thread tension bounds",
        "re-thread without warp damage"
      ],
      tools: [
        { name: "Fine Needle", localName: "Sozni Suj", function: "Embroidery needlework", material: "Tempered steel", dimensions: "2 inches", prep: "Tip polishing", maintenance: "Rust protection", problems: "Dull point tips", replacement: "New needle buy" }
      ],
      materials: [
        { name: "Embroidery Silk", source: "Local trader", localName: "Reshm Yarn", prep: "Dye checking", storage: "Spool racks", quality: "Fine spun continuous silk", unsuitable: "Damp boxes", alternatives: "Cotton thread" }
      ],
      steps: [
        { step: "STEP 1", title: "Design Outline Trace", purpose: "Track stitch path limits", tools: "Chalk paper", result: "Clean trace line", errors: "Thick paint lines warp embroidery", safety: "None" }
      ],
      relatedHistories: "KHCRF-OH-2026-001",
      relatedDoc: "Doc-KHCRF-2026-05",
      relatedArticles: "Socio-Economics of Pampore Workers"
    },
    {
      slug: "demo-papier-prep",
      title: "Papier-Mâché Surface Preparation",
      subtitle: "Building a Paint-Ready Foundation",
      dur: "15 Minutes",
      durationMin: 15,
      tag: "Technique Demonstration",
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop",
      desc: "This demonstration explains how raw paper-pulp molds are smoothed using traditional stone tools, coated with base plaster, and lacquered prior to painting.",
      accessionId: "KHCRF-CD-2026-005",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      level: "Intermediate",
      craft: "Papier-Mâché",
      artisan: "Hilal Ahmad",
      trainer: "Farooq Mir",
      workshop: "Habibullah Atelier, Srinagar",
      district: "Srinagar",
      recordingDate: "Recorded April 2026",
      version: "v2.0",
      objective: "Basic Technique, Material Knowledge",
      format: "Comparative Technique",
      status: "Published",
      hasTranscript: "Yes",
      learningOutcomes: [
        "smooth raw paper fiber pulp layers using agate stone",
        "mix base chalk plaster ratios",
        "identify structural moisture spots"
      ],
      tools: [
        { name: "Agate Stone Burnisher", localName: "Sang-i-Yashm", function: "Burnishing dry pulp surfaces", material: "Natural agate stone", dimensions: "3 inches", prep: "Polishing flat faces", maintenance: "Wiping clean", problems: "Chipping edges", replacement: "Agate stone source" }
      ],
      materials: [
        { name: "Chalk plaster", source: "Local mine", localName: "Astar chalk", prep: "Grinding into paste", storage: "Dry jars", quality: "Fine white clay powder", unsuitable: "Humidity peaks", alternatives: "Plaster of Paris" }
      ],
      steps: [
        { step: "STEP 1", title: "Stone Rubbing", purpose: "Flatten raw pulp bumps", tools: "Agate stone", result: "Dense cardboard feel", errors: "Pressing too hard breaks molds", safety: "Wear gloves to prevent splinters" }
      ],
      relatedHistories: "KHCRF-OH-2026-003",
      relatedDoc: "Doc-KHCRF-2026-04",
      relatedArticles: "Curing Cycles of Turpentine"
    },
    {
      slug: "demo-naqashi-brush",
      title: "Traditional Naqashi Brush Control",
      subtitle: "Painting Floral Motifs",
      dur: "40 Minutes",
      durationMin: 40,
      tag: "Technique Demonstration",
      img: "https://images.unsplash.com/photo-1422026276085-c7ff20f6ac95?w=600&auto=format&fit=crop",
      desc: "An advanced demonstration of freehand drawing and painting of classic Gul-i-Wilayat and Chinar motifs using cat-tail hair brushes and natural mineral pigments.",
      accessionId: "KHCRF-CD-2026-006",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      level: "Advanced",
      craft: "Papier-Mâché",
      artisan: "Mohammad Yusuf",
      trainer: "Farooq Mir",
      workshop: "Habibullah Atelier, Srinagar",
      district: "Srinagar",
      recordingDate: "Recorded April 2026",
      version: "v1.2",
      objective: "Tool Handling, Design Interpretation",
      format: "Full Demonstration",
      status: "Published",
      hasTranscript: "Yes",
      learningOutcomes: [
        "form custom cat hair brushes",
        "paint 1mm floral lines freehand",
        "mix mineral pigments"
      ],
      tools: [
        { name: "Detail Brush", localName: "Kalam", function: "Applying gold details and linings", material: "Cat tail hair bundle", dimensions: "5 inches", prep: "Hair bundling", maintenance: "Wash with water", problems: "Hair splits", replacement: "Re-bind brush bundle" }
      ],
      materials: [
        { name: "Lapis Pigment", source: "Local rock mine", localName: "Mineral Blue", prep: "Grinding & gum wash", storage: "Glass jars", quality: "Deep blue hue", unsuitable: "Acid exposure", alternatives: "Cobalt paint" }
      ],
      steps: [
        { step: "STEP 1", title: "Trace Basic Grid Lines", purpose: "Establish design coordinates", tools: "Detail brush", result: "Balanced grid outlines", errors: "Unsteady hand causes layout shift", safety: "Ventilation required when using solvent bases" }
      ],
      relatedHistories: "KHCRF-OH-2026-003",
      relatedDoc: "Doc-KHCRF-2026-04",
      relatedArticles: "Organic Dye Chemistry"
    },
    {
      slug: "demo-sharpen-wood",
      title: "Sharpening Walnut Carving Tools",
      subtitle: "Maintaining Traditional Chisels",
      dur: "24 Minutes",
      durationMin: 24,
      tag: "Technique Demonstration",
      img: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop",
      desc: "This intermediate masterclass details the exact angles, oilstone grit progressions, and leather stropping patterns needed to keep high-carbon steel gouges razor sharp.",
      accessionId: "KHCRF-CD-2026-007",
      year: "2026",
      language: "Kashmiri",
      subtitles: "No",
      level: "Intermediate",
      craft: "Walnut Wood",
      artisan: "Showkat Ahmad",
      trainer: "Sajad Dar",
      workshop: "Downtown Srinagar Woodshop",
      district: "Srinagar",
      recordingDate: "Recorded January 2026",
      version: "v1.0",
      objective: "Tool Handling, Tool Maintenance",
      format: "Tool Demonstration",
      status: "Published",
      hasTranscript: "Yes",
      learningOutcomes: [
        "maintain 25-degree bevel angles",
        "remove wire edges",
        "strop blades to mirror finish"
      ],
      tools: [
        { name: "Sharpening Stone", localName: "Whetstone", function: "Chisel sharpening", material: "Oilstones", dimensions: "2x6 inches", prep: "Oil coating", maintenance: "Wiping slate flat", problems: "Saddle hollows", replacement: "Lap flats on diamond slate" }
      ],
      materials: [
        { name: "Lard Lubricating oil", source: "Local shop", localName: "Tel", prep: "None", storage: "Bottle", quality: "Viscosity grade 10", unsuitable: "Dust areas", alternatives: "Kerosene oil" }
      ],
      steps: [
        { step: "STEP 1", title: "Angle Check", purpose: "Align chisel blade face flat on stone", tools: "Blade gauge", result: "25-degree plane", errors: "Wobbling changes edge flatness", safety: "Keep fingers behind sharpening direction" }
      ],
      relatedHistories: "KHCRF-OH-2026-003",
      relatedDoc: "Doc-KHCRF-2026-04",
      relatedArticles: "Nail-free Double Locking Systems"
    },
    {
      slug: "demo-walnut-relief",
      title: "Basic Walnut Relief Carving",
      subtitle: "Developing Depth and Flow",
      dur: "30 Minutes",
      durationMin: 30,
      tag: "Technique Demonstration",
      img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop",
      desc: "This demonstration guides learners through carving shallow relief patterns on a walnut wood block, explaining grain direction checks and chisel force control.",
      accessionId: "KHCRF-CD-2026-008",
      year: "2026",
      language: "Kashmiri",
      subtitles: "No",
      level: "Intermediate",
      craft: "Walnut Wood",
      artisan: "Ustad Ali Mohammad",
      trainer: "Sajad Dar",
      workshop: "Downtown Srinagar Woodshop",
      district: "Srinagar",
      recordingDate: "Recorded January 2026",
      version: "v1.1",
      objective: "Basic Technique, Common Mistakes",
      format: "Full Demonstration",
      status: "Published",
      hasTranscript: "Yes",
      learningOutcomes: [
        "identify grain path splits",
        "carve even 3mm relief flats",
        "correct wood tear spots"
      ],
      tools: [
        { name: "Curved Gouge", localName: "Wanz Chot", function: "Relief wood carving", material: "Carbon steel", dimensions: "6 inches", prep: "Strop", maintenance: "Wiping sweat oils", problems: "Nick on edges", replacement: "Regrinding tool edge" }
      ],
      materials: [
        { name: "Walnut Block", source: "Anantnag depot", localName: "Dun wood", prep: "Seasoning checking", storage: "Dry stack", quality: "Kiln dried 10% moisture", unsuitable: "Fresh green logs", alternatives: "Pine wood block" }
      ],
      steps: [
        { step: "STEP 1", title: "Grain Trace", purpose: "Locate natural grain fibers flow", tools: "Chalk pencil", result: "Clear cutting paths", errors: "Carving against wood grain splits timber", safety: "Always carve away from stabilizing arm" }
      ],
      relatedHistories: "KHCRF-OH-2026-003",
      relatedDoc: "Doc-KHCRF-2026-04",
      relatedArticles: "Wood Joint Conservation"
    },
    {
      slug: "demo-copper-engrave",
      title: "Traditional Copper Engraving",
      subtitle: "Hammer, Chisel and Pattern Control",
      dur: "35 Minutes",
      durationMin: 35,
      tag: "Technique Demonstration",
      img: "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=600&auto=format&fit=crop",
      desc: "Learn the traditional Kandkari engraving methods in old Srinagar, focusing on holding the naqash chasing tool and regulating hammer strikes.",
      accessionId: "KHCRF-CD-2026-009",
      year: "2026",
      language: "Kashmiri",
      subtitles: "No",
      level: "Advanced",
      craft: "Copperware",
      artisan: "Abdul Rehman",
      trainer: "Sajad Dar",
      workshop: "Zaina Kadal Copper Workshop",
      district: "Old Srinagar",
      recordingDate: "Recorded May 2026",
      version: "v1.5",
      objective: "Basic Technique, Tool Handling",
      format: "Comparative Technique",
      status: "Published",
      hasTranscript: "Yes",
      learningOutcomes: [
        "regulate hammer rhythm lines",
        "create clean Kandkari curves",
        "stamping background fills"
      ],
      tools: [
        { name: "Chasing Chisel", localName: "Naqash", function: "Engraving lines", material: "Forged steel rod", dimensions: "4 inches", prep: "Grinding flat tips", maintenance: "Polishing", problems: "Flaring impact tip", replacement: "Smith reshaping" }
      ],
      materials: [
        { name: "Copper Samovar Plate", source: "Local smith", localName: "Copper tray", prep: "Tin cleaning", storage: "Dry shelves", quality: "Pure hand formed copper", unsuitable: "Corrosive washes", alternatives: "Brass sheets" }
      ],
      steps: [
        { step: "STEP 1", title: "Trace Layout Lines", purpose: "Draw master flower geometry", tools: "Steel compass", result: "Symmetric guide lines", errors: "Offset alignment ruins perimeter patterns", safety: "Wear sound dampening ear plugs" }
      ],
      relatedHistories: "KHCRF-OH-2026-012",
      relatedDoc: "Doc-KHCRF-2026-12",
      relatedArticles: "Downtown Bazaars Heritage"
    },
    {
      slug: "demo-namda-felt",
      title: "Felting Wool for Namda",
      subtitle: "Traditional Moisture and Pressure Techniques",
      dur: "22 Minutes",
      durationMin: 22,
      tag: "Technique Demonstration",
      img: "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=600&auto=format&fit=crop",
      desc: "This demonstration explains how raw carded wool layers are arrayed on rush mats, saturated with boiling water solutions, rolled under forearm pressure, and washed to form felt rugs.",
      accessionId: "KHCRF-CD-2026-010",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      level: "Intermediate",
      craft: "Namda",
      artisan: "Bashir Ahmad",
      trainer: "Zehra Malik",
      workshop: "Downtown Srinagar Felting Unit",
      district: "Anantnag",
      recordingDate: "Recorded February 2026",
      version: "v1.1",
      objective: "Traditional Method, Common Mistakes",
      format: "Full Demonstration",
      status: "Published",
      hasTranscript: "Yes",
      learningOutcomes: [
        "lay uniform layers of carded wool",
        "calibrate alkaline water solutions",
        "roll and press felt bundles evenly"
      ],
      tools: [
        { name: "Rolling Rush Mat", localName: "Patan Mat", function: "Wool bundle rolling base", material: "Dried river rushes", dimensions: "3x6 feet", prep: "Washing", maintenance: "Air dry after use", problems: "Reed breakage", replacement: "Re-weaving rushes" }
      ],
      materials: [
        { name: "Carded Local Wool", source: "Regional shepherds", localName: "Local wool flock", prep: "Carding", storage: "Ventilated racks", quality: "Clean medium staple wool", unsuitable: "Fresh unwashed fleece", alternatives: "Merino wool blends" }
      ],
      steps: [
        { step: "STEP 1", title: "Wool Layering", purpose: "Form three cross-laminated layers", tools: "Hand level tool", result: "Consistent wool block thickness", errors: "Thin centers collapse during washing", safety: "Wear respiratory dust mask during raw wool sorting" }
      ],
      relatedHistories: "KHCRF-OH-2026-010",
      relatedDoc: "Doc-KHCRF-2026-03",
      relatedArticles: "Natural Dye Conservation"
    },
    {
      slug: "demo-willow-prep",
      title: "Willow Preparation Before Weaving",
      subtitle: "Harvesting, Soaking and Splitting",
      dur: "28 Minutes",
      durationMin: 28,
      tag: "Technique Demonstration",
      img: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&auto=format&fit=crop",
      desc: "Learn how green willow rods are harvested in autumn, boiled to loosen skins, peeled, split into three uniform strands, and planed for basketry.",
      accessionId: "KHCRF-CD-2026-011",
      year: "2025",
      language: "Kashmiri",
      subtitles: "Yes",
      level: "Beginner",
      craft: "Willow Wicker",
      artisan: "Ghulam Nabi",
      trainer: "Farooq Mir",
      workshop: "Ganderbal Willow unit",
      district: "Ganderbal",
      recordingDate: "Recorded November 2025",
      version: "v1.0",
      objective: "Basic Technique, Material Knowledge",
      format: "Material Demonstration",
      status: "Published",
      hasTranscript: "Yes",
      learningOutcomes: [
        "select correct willow diameters",
        "split cane strands into three parts",
        "plane splits to uniform thickness"
      ],
      tools: [
        { name: "Cane Splitter", localName: "Phou", function: "Splitting willow rods in three", material: "Hardwood or horn", dimensions: "2 inches", prep: "Keep slots smooth", maintenance: "Waxing slots", problems: "Clogging splits", replacement: "Carving new splitter" }
      ],
      materials: [
        { name: "Green Willow Rods", source: "Ganderbal fields", localName: "Keer cane", prep: "Harvesting & bundling", storage: "Water tanks", quality: "Straight rods no splits", unsuitable: "Dry frozen canes", alternatives: "Willow cane imports" }
      ],
      steps: [
        { step: "STEP 1", title: "Boiling Cycle", purpose: "Soften bark layers", tools: "Boiler vat", result: "Loose paper bark", errors: "Underboiling causes bark splits", safety: "Wear heat protective boots near boiler tanks" }
      ],
      relatedHistories: "KHCRF-OH-2026-008",
      relatedDoc: "Doc-KHCRF-2026-10",
      relatedArticles: "Visitor Etiquette in Karkhanas"
    },
    {
      slug: "demo-final-inspection",
      title: "Final Quality Inspection",
      subtitle: "Evaluating Craftsmanship Before Delivery",
      dur: "18 Minutes",
      durationMin: 18,
      tag: "Technique Demonstration",
      img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop",
      desc: "Learn how senior inspectors examine craft products for structural errors, thread count metrics, and raw material authenticity before shipping.",
      accessionId: "KHCRF-CD-2026-012",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      level: "Intermediate",
      craft: "Chain Stitch",
      artisan: "Abdul Rashid",
      trainer: "Zehra Malik",
      workshop: "Downtown Srinagar Guild room",
      district: "Srinagar",
      recordingDate: "Recorded June 2026",
      version: "v1.2",
      objective: "Quality Control, Common Mistakes",
      format: "Quality Assessment",
      status: "Published",
      hasTranscript: "Yes",
      learningOutcomes: [
        "verify hand-knotted density limits",
        "identify warp shifts",
        "stamping verified seals"
      ],
      tools: [
        { name: "Inspection Glass", localName: "Loupe glass", function: "Thread density check", material: "Brass and optical glass", dimensions: "1 inch", prep: "Lens cleaning", maintenance: "Wiping lens clean", problems: "Scratched glass faces", replacement: "New glass buy" }
      ],
      materials: [
        { name: "Inspection labels", source: "Guild printers", localName: "Guild Tag", prep: "None", storage: "Dry file cupboard", quality: "Acid-free papers", unsuitable: "Moisture peaks", alternatives: "None" }
      ],
      steps: [
        { step: "STEP 1", title: "Density Count", purpose: "Measure threads per square inch", tools: "Loupe glass", result: "Density number log", errors: "Faulty count reads warp shifts", safety: "Avoid eye strain rests" }
      ],
      relatedHistories: "KHCRF-OH-2026-012",
      relatedDoc: "Doc-KHCRF-2026-12",
      relatedArticles: "Downtown Bazaars Heritage"
    }
  ]);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [selectedObjective, setSelectedObjective] = useState('All Objectives');
  const [selectedFormat, setSelectedFormat] = useState('All Formats');
  const [selectedDuration, setSelectedDuration] = useState('All Durations');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedSort, setSelectedSort] = useState('Featured');

  const [currentView, setCurrentView] = useState<'cards' | 'manual' | 'library'>('cards');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeItem, setActiveItem] = useState<any>(null);
  const [activeModalTab, setActiveModalTab] = useState<'guide' | 'tools' | 'vocabulary' | 'progress' | 'archives'>('guide');
  const itemsPerPage = 6;

  // Filter & Search Logic
  const filteredDemos = allDemos.filter(d => {
    // Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchText = `${d.title} ${d.subtitle || ''} ${d.desc} ${d.craft} ${d.artisan} ${d.accessionId} ${d.level} ${d.objective || ''} ${d.format || ''}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    // Craft Category Filter (Horizontal row & Select)
    if (activeFilter !== 'All') {
      if (d.craft !== activeFilter) return false;
    }
    // Select Craft filter check
    // Technique Category
    if (selectedCategory !== 'All Categories') {
      const cat = selectedCategory.toLowerCase();
      const text = `${d.title} ${d.desc} ${d.subtitle || ''} ${d.objective || ''}`.toLowerCase();
      if (cat === 'weaving' && !text.includes('weav') && !text.includes('loom')) return false;
      if (cat === 'embroidery' && !text.includes('embroid') && !text.includes('sozni')) return false;
      if (cat === 'carving' && !text.includes('carv') && !text.includes('chisel')) return false;
      if (cat === 'painting' && !text.includes('paint') && !text.includes('naqashi')) return false;
      if (cat === 'felting' && !text.includes('felt') && !text.includes('namda')) return false;
    }
    // Skill Level
    if (selectedLevel !== 'All Levels') {
      if (d.level !== selectedLevel) return false;
    }
    // Learning Objective
    if (selectedObjective !== 'All Objectives') {
      if (!d.objective?.toLowerCase().includes(selectedObjective.toLowerCase())) return false;
    }
    // Format
    if (selectedFormat !== 'All Formats') {
      if (d.format !== selectedFormat) return false;
    }
    // Duration
    if (selectedDuration !== 'All Durations') {
      const min = d.durationMin;
      if (selectedDuration === 'Under 10 min' && min >= 10) return false;
      if (selectedDuration === '10–20 min' && (min < 10 || min > 20)) return false;
      if (selectedDuration === '20–40 min' && (min < 20 || min > 40)) return false;
      if (selectedDuration === 'Over 40 min' && min <= 40) return false;
    }
    // Status
    if (selectedStatus !== 'All Statuses') {
      if (d.status !== selectedStatus) return false;
    }
    return true;
  });

  // Sorting
  const sortedDemos = [...filteredDemos].sort((a, b) => {
    if (selectedSort === 'Recently Added') {
      return b.accessionId.localeCompare(a.accessionId);
    }
    if (selectedSort === 'Most Viewed') {
      return b.durationMin - a.durationMin;
    }
    if (selectedSort === 'A–Z') {
      return a.title.localeCompare(b.title);
    }
    if (selectedSort === 'Difficulty') {
      return a.level.localeCompare(b.level);
    }
    if (selectedSort === 'Craft') {
      return a.craft.localeCompare(b.craft);
    }
    if (selectedSort === 'Duration') {
      return b.durationMin - a.durationMin;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedDemos.length / itemsPerPage);
  const paginatedDemos = sortedDemos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Pashmina Learner Pathway Steps
  const pashminaPathwaySteps = [
    { id: 1, name: "Fibre Selection", desc: "Evaluating diameter width, guard hair ratios, and fleece color lots." },
    { id: 2, name: "Fibre Cleaning", desc: "Removing organic field debris and dust without chemical bleaching." },
    { id: 3, name: "Hand Spinning", desc: "Drafting aligned fibers on the traditional wooden yinder spinning wheel." },
    { id: 4, name: "Yarn Preparation", desc: "Sizing threads with natural starch and winding onto wooden spools." },
    { id: 5, name: "Loom Setup", desc: "Threading warp runs through local heddles under balanced weight tension." },
    { id: 6, name: "Basic Weaving", desc: "Coordinating weft pick passes and beating rows evenly." },
    { id: 7, name: "Finishing", desc: "Trimming border threads, soft washing, and natural wooden block pressing." },
    { id: 8, name: "Quality Assessment", desc: "Verifying GI thread count indicators and certificate labels." }
  ];

  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pb-24 animate-fadeIn">
      {/* Detailed Technical Lab modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#3E2723]/40 backdrop-blur-sm" onClick={() => setActiveItem(null)}></div>
          <div className="relative z-10 bg-[#FAF9F6] border-2 border-[#3E2723] max-w-3xl w-full p-6 md:p-8 shadow-2xl text-[#2A2A2A] max-h-[95vh] overflow-y-auto custom-scrollbar font-mono rounded-xs" role="dialog" aria-modal="true">
            <button onClick={() => setActiveItem(null)} className="absolute top-4 right-4 text-[#3E2723]/50 hover:text-[#3E2723] text-xl font-bold font-mono">&times;</button>
            
            <div className="text-center mb-6 border-b border-[#3E2723]/25 pb-4">
              <span className="text-[#D4AF37] font-mono text-xs uppercase tracking-widest block mb-1 font-bold">KHCRF DIGITAL CRAFT LABORATORY</span>
              <h2 className="text-xl md:text-2xl font-serif text-[#3E2723] font-bold leading-tight">{activeItem.title}</h2>
              {activeItem.subtitle && <p className="text-gray-500 text-xs italic font-serif mt-1">{activeItem.subtitle}</p>}
              
              <div className="flex flex-wrap justify-center gap-2 mt-3 font-mono text-[9px] uppercase tracking-wider text-gray-500">
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">ACCESSION: {activeItem.accessionId}</span>
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">DIFFICULTY: {activeItem.level}</span>
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">TIME: {activeItem.dur}</span>
                <span className="bg-[#3E2723] text-[#D4AF37] px-2 py-0.5 font-bold">{activeItem.status.toUpperCase()}</span>
              </div>
            </div>

            {/* Modal Tabs navigation */}
            <div className="flex flex-wrap gap-1 border-b border-[#3E2723]/20 pb-3 mb-6 text-[10px] font-mono justify-center">
              {[
                { id: 'guide', label: 'Instruction Guide' },
                { id: 'tools', label: 'Tools & Materials' },
                { id: 'vocabulary', label: 'Traditional Vocabulary' },
                { id: 'progress', label: 'Practice & Review' },
                { id: 'archives', label: 'Related Archives' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveModalTab(tab.id as any)}
                  className={`px-3 py-1.5 border border-t-2 transition-all ${
                    activeModalTab === tab.id
                      ? 'bg-[#3E2723] text-white border-[#3E2723] border-t-[#D4AF37]'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-[#3E2723]/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body Contents */}
            <div className="space-y-6 text-xs text-gray-700 leading-relaxed font-mono">
              
              {/* TAB 1: INSTRUCTION GUIDE */}
              {activeModalTab === 'guide' && (
                <div className="space-y-4 font-sans">
                  <div>
                    <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2 font-mono">Demonstration Overview</h3>
                    <p className="text-gray-650 leading-relaxed font-sans">{activeItem.desc}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 font-mono text-[10px]">
                    <div>
                      <span className="text-gray-400 uppercase font-bold block text-[8px]">Primary Learning Objective</span>
                      <p className="text-[#2A2A2A] font-sans">{activeItem.objective}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 uppercase font-bold block text-[8px]">Format Type</span>
                      <p className="text-[#2A2A2A] font-sans">{activeItem.format}</p>
                    </div>
                  </div>

                  {/* Step-by-Step sequence */}
                  <div className="space-y-4 pt-4 border-t border-gray-200 mt-4">
                    <h4 className="text-[#3E2723] font-bold text-xs uppercase font-mono mb-3">Demonstration Step Sequences</h4>
                    {activeItem.steps?.map((step: any, sIdx: number) => (
                      <div key={sIdx} className="border border-gray-200 p-3 bg-white space-y-1.5 font-mono text-[10px]">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-1 font-bold">
                          <span className="text-[#3E2723]">{step.step} &bull; {step.title}</span>
                          <span className="text-gray-400 uppercase text-[8px]">Purpose: {step.purpose}</span>
                        </div>
                        <div><strong className="text-gray-400 font-mono uppercase text-[8px] block">Expected Result</strong> {step.result}</div>
                        <div><strong className="text-gray-400 font-mono uppercase text-[8px] block">Common Errors</strong> {step.errors}</div>
                        {step.safety !== "None" && (
                          <div className="text-red-700 bg-red-50 px-2 py-1 mt-1 border border-red-100 font-sans"><strong className="font-mono text-[8px]">Safety Notes:</strong> {step.safety}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: TOOLS & MATERIALS */}
              {activeModalTab === 'tools' && (
                <div className="space-y-6">
                  {/* Tools table */}
                  <div>
                    <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Traditional Tools Inventory</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-[10px]">
                        <thead>
                          <tr className="bg-gray-100 uppercase text-gray-400 font-bold border-b border-gray-200">
                            <th className="p-2">Name</th>
                            <th className="p-2">Local Name</th>
                            <th className="p-2">Function</th>
                            <th className="p-2">Material</th>
                            <th className="p-2">Prep</th>
                            <th className="p-2">Maintenance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {activeItem.tools?.map((tool: any, idx: number) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="p-2 font-bold">{tool.name}</td>
                              <td className="p-2 italic">{tool.localName}</td>
                              <td className="p-2">{tool.function}</td>
                              <td className="p-2">{tool.material}</td>
                              <td className="p-2">{tool.prep}</td>
                              <td className="p-2">{tool.maintenance}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Materials table */}
                  <div>
                    <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Material Ledger</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-[10px]">
                        <thead>
                          <tr className="bg-gray-100 uppercase text-gray-400 font-bold border-b border-gray-200">
                            <th className="p-2">Material</th>
                            <th className="p-2">Source</th>
                            <th className="p-2">Local Name</th>
                            <th className="p-2">Storage</th>
                            <th className="p-2">Quality Indicators</th>
                            <th className="p-2">Alternatives</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {activeItem.materials?.map((mat: any, idx: number) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="p-2 font-bold">{mat.name}</td>
                              <td className="p-2">{mat.source}</td>
                              <td className="p-2 italic">{mat.localName}</td>
                              <td className="p-2">{mat.storage}</td>
                              <td className="p-2">{mat.quality}</td>
                              <td className="p-2">{mat.alternatives}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: TRADITIONAL VOCABULARY */}
              {activeModalTab === 'vocabulary' && (
                <div className="space-y-4 font-mono text-[11px] space-y-4">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Traditional Terminology Glossary</h3>
                  <div className="space-y-2">
                    <div><span className="text-gray-400">Master Artisan :</span> {activeItem.artisan}</div>
                    <div><span className="text-gray-400">Trainer        :</span> {activeItem.trainer}</div>
                    <div><span className="text-gray-400">Location       :</span> {activeItem.workshop} ({activeItem.district})</div>
                    <div><span className="text-gray-400">Date Logged    :</span> {activeItem.recordingDate}</div>
                    <div><span className="text-gray-400">Archival Code  :</span> {activeItem.accessionId} ({activeItem.version})</div>
                  </div>

                  <div className="bg-[#FAF9F6] border border-gray-200 p-4 mt-4 font-sans text-xs">
                    <h4 className="font-bold text-[#3E2723] font-mono text-[10px] uppercase mb-2">Regional adaption details:</h4>
                    <p className="text-gray-600">Technical terminology remains standardized according to the historical Downtown Srinagar guild registers. Minor pronunciation shifts documented in the regional files.</p>
                  </div>
                </div>
              )}

              {/* TAB 4: PRACTICE & REVIEW */}
              {activeModalTab === 'progress' && (
                <div className="space-y-6 font-mono text-[11px]">
                  <div>
                    <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">CLIE Progression Path</h3>
                    <div className="flex justify-between items-center text-gray-500 font-bold max-w-sm mb-4 bg-gray-55 p-3 border border-gray-200 rounded-xs">
                      {["Beginner", "Intermediate", "Advanced", "Master Technique"].map((levelText) => (
                        <div key={levelText} className="flex flex-col items-center gap-1">
                          <span className={`text-[9px] ${activeItem.level === levelText ? 'text-[#3E2723]' : 'text-gray-300'}`}>{levelText}</span>
                          <span className={`text-[12px] ${activeItem.level === levelText ? 'text-[#D4AF37]' : 'text-gray-200'}`}>●</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[#3E2723] font-bold text-xs uppercase mb-2">Measurable Learning Outcomes</h4>
                    <ul className="space-y-1.5 text-gray-700">
                      {activeItem.learningOutcomes?.map((out: string, outIdx: number) => (
                        <li key={outIdx} className="flex items-start gap-2">
                          <span className="text-[#D4AF37] font-bold">▪</span>
                          <span>{out}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 5: RELATED ARCHIVES */}
              {activeModalTab === 'archives' && (
                <div className="space-y-4 font-mono text-[11px] space-y-4">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Archival Citation & Connections</h3>
                  <div className="bg-white border border-gray-200 p-4 space-y-1.5 text-[10px]">
                    <div><span className="text-gray-400">CITATION           :</span> KHCRF Craft Demonstrations, Record {activeItem.accessionId}. Retrieved 2026.</div>
                    <div><span className="text-gray-400">RELATED ORAL HISTORY:</span> {activeItem.relatedHistories}</div>
                    <div><span className="text-gray-400">RELATED DOCUMENTARY :</span> {activeItem.relatedDoc}</div>
                    <div><span className="text-gray-400">RELATED ARTICLES    :</span> {activeItem.relatedArticles}</div>
                    <div><span className="text-gray-400">LOG ACCESS CODE     :</span> KHCRF-CD-{activeItem.accessionId.replace("CD-","")}</div>
                  </div>
                </div>
              )}

            </div>

            <div className="border-t border-[#D4AF37]/30 pt-6 text-center space-y-4 font-mono mt-6">
              <p className="text-[9px] uppercase tracking-widest text-gray-400 leading-relaxed font-mono">
                Access to full video demonstration streams and transcripts is reserved for supportive members.
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
      <UniversalEditorialHero pageKey="craft-demonstrations" fallbackConfig={craftDemonstrationsHeroFallback as any} />

      <div className="container-fluid mx-auto px-4 md:px-10 py-12 max-w-7xl animate-fadeIn">
        
        {/* Introductory Statement Block */}
        <div className="bg-[#3E2723]/5 border-l-4 border-[#3E2723] p-8 mb-12 rounded-r-xs max-w-5xl">
          <p className="text-gray-700 text-base md:text-lg leading-relaxed font-serif">
            Craft Demonstrations transform traditional knowledge into structured technical documentation. Each demonstration records not only <em>what</em> is made, but <em>how</em> it is made—capturing the sequence of actions, tools, materials, measurements, hand movements, quality standards, common mistakes, and finishing techniques that define authentic craftsmanship.
          </p>
          <p className="text-gray-755 text-xs mt-3 uppercase tracking-widest font-bold font-mono">
            Designed as an educational and preservation resource, the archive supports artisans, apprentices, trainers, researchers, museums, conservation professionals, designers, and institutions working to safeguard Kashmir's craft traditions.
          </p>
          
          <div className="flex flex-wrap gap-4 mt-6 font-mono text-xs">
            <a href="#results" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-5 py-2.5 font-bold uppercase tracking-wider transition-all">
              Browse Demonstrations
            </a>
            <a href="#suggest" className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-5 py-2.5 font-bold uppercase tracking-wider transition-all">
              Suggest a Demonstration
            </a>
            <a href="#methodology" className="text-[#3E2723] hover:underline font-bold py-2.5">
              Read Documentation Standards &rarr;
            </a>
          </div>
        </div>

        {/* Featured Demonstration */}
        <section className="bg-white border-4 border-[#3E2723] p-8 md:p-10 mb-16 relative shadow-md">
          <div className="absolute top-0 right-0 bg-[#3E2723] text-[#D4AF37] px-4 py-1 text-[10px] font-mono font-bold uppercase tracking-widest">
            FEATURED DEMONSTRATION
          </div>
          
          <div className="max-w-4xl font-mono">
            <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-1">
              Archive Record: KHCRF-CD-2026-001
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3E2723] leading-tight mb-2">
              Reading and Following Talim
            </h2>
            <h3 className="text-base md:text-lg font-serif italic text-gray-500 mb-4">
              Translating Carpet Coding into Weaving
            </h3>
            
            <p className="text-gray-700 text-sm leading-relaxed mb-6 font-sans text-gray-655">
              This demonstration explains how artisans interpret talim instructions and translate coded design sequences into precise knot placement on the loom. It documents reading rhythm, communication between talim reader and weavers, correction methods, and common interpretation errors.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 font-mono text-[10px] border-t border-b border-gray-250 py-3 bg-gray-50 px-4">
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Type</span>
                <span className="font-bold text-[#3E2723]">Technique Demonstration</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Craft</span>
                <span className="font-bold text-[#3E2723]">Hand-Knotted Carpet</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Difficulty</span>
                <span className="font-bold text-[#3E2723]">Intermediate</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Duration</span>
                <span className="font-bold text-[#3E2723]">38 Minutes</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => { setActiveItem(allDemos[0]); setActiveModalTab('guide'); }}
                className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-all font-mono"
              >
                View Demonstration →
              </button>
            </div>
          </div>
        </section>

        {/* Why Demonstrate Traditional Techniques Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start mt-12">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-serif text-[#3E2723] mb-6 font-bold">Why Demonstrate Traditional Techniques?</h2>
            <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans">
              Many traditional craft techniques have historically been transmitted through observation and apprenticeship rather than written manuals. As master artisans retire and workshop structures evolve, valuable technical knowledge risks being lost.
            </p>
            <p className="text-gray-605 text-sm leading-relaxed font-sans">
              Rather than replacing apprenticeship, these demonstrations complement traditional learning by creating reliable educational references for future generations.
            </p>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#3E2723]/10 p-8 rounded-xs shadow-xs">
            <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 font-mono">
              KHCRF Craft Demonstrations create structured records that preserve:
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700 font-sans font-mono">
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>specialist hand movements</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>tool handling techniques</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>material preparation</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>workshop best practices</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>quality-control procedures</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>regional variations</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>terminology</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>safety considerations</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>finishing standards</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>repair methods</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>conservation knowledge</li>
            </ul>
          </div>
        </section>

        {/* Pashmina Learning Pathway Block */}
        <section className="bg-white border border-[#3E2723]/25 p-8 md:p-10 mb-16 rounded-xs shadow-sm">
          <div className="border-b border-[#3E2723]/15 pb-4 mb-8">
            <span className="text-[#D4AF37] text-[10px] font-mono uppercase font-bold tracking-widest block mb-1">Preservation Progression</span>
            <h3 className="font-serif text-2xl font-bold text-[#3E2723]">Pashmina Craft Learning Pathway</h3>
            <p className="text-gray-500 text-xs font-mono mt-1">CLIE COMPATIBLE INTERACTIVE PROGRESSION PATH</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pashminaPathwaySteps.map((step) => (
              <div key={step.id} className="border border-gray-200 p-4 bg-[#FAF9F6] relative font-mono text-[11px] space-y-1.5">
                <div className="absolute top-2 right-2 text-[#D4AF37] font-bold text-[14px]">0{step.id}</div>
                <span className="text-gray-400 font-bold block text-[8px] uppercase">Step {step.id}</span>
                <h4 className="font-bold text-[#3E2723] text-xs font-mono">{step.name}</h4>
                <p className="text-gray-550 font-sans leading-relaxed text-[11px]">{step.desc}</p>
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
            <h3 className="font-serif text-2xl text-[#D4AF37] mb-2 font-bold">Technical Demonstration Registry</h3>
            <p className="text-white/60 text-xs">
              LABORATORY CLASSIFIED METRIC SYSTEM
            </p>
          </div>

          {/* Primary Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 text-center md:text-left border-b border-white/10 pb-8 mb-8">
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Demonstration Records</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">86</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Craft Traditions</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">12</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Techniques Documented</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">168</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Master Artisans</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">39</span>
            </div>
            <div className="last:border-0">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Learning Modules</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">54</span>
            </div>
          </div>

          {/* Secondary Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 text-center md:text-left font-mono">
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Beginner Demos</span>
              <span className="text-xl font-serif font-semibold text-white/80">24</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Intermediate Demos</span>
              <span className="text-xl font-serif font-semibold text-white/80">33</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Advanced Demos</span>
              <span className="text-xl font-serif font-semibold text-white/80">29</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Safety Guides</span>
              <span className="text-xl font-serif font-semibold text-white/80">18</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Technical Illus</span>
              <span className="text-xl font-serif font-semibold text-white/80">92</span>
            </div>
            <div className="last:border-0">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono font-mono">Glossary Terms</span>
              <span className="text-lg font-serif font-semibold text-[#D4AF37] block leading-tight font-mono">301</span>
            </div>
          </div>
        </section>

        {/* View Switcher Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 bg-[#FAF9F6] border border-[#3E2723]/10 p-4 font-mono" id="results">
          <div className="text-xs font-serif text-[#3E2723]">
            KHCRF Technical Demonstrations Catalog &bull; Showing {sortedDemos.length} Records
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] text-gray-400 uppercase self-center mr-2 font-mono">Archive Layout View:</span>
            <button 
              onClick={() => { setCurrentView('cards'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'cards' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Learning Cards
            </button>
            <button 
              onClick={() => { setCurrentView('manual'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'manual' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Technical Manual
            </button>
            <button 
              onClick={() => { setCurrentView('library'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'library' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Technique Library
            </button>
          </div>
        </div>

        {/* Search and Discovery Layout */}
        <section className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4 bg-white border border-[#3E2723]/10 p-6 shadow-xs sticky top-4 z-10 font-sans">
            <h3 className="font-serif text-lg text-[#3E2723] mb-6 pb-2 border-b border-gray-100 flex items-center justify-between font-bold font-serif">
              <span>Filter Laboratory</span>
              <button 
                onClick={() => {
                  setActiveFilter('All');
                  setSelectedCategory('All Categories');
                  setSelectedLevel('All Levels');
                  setSelectedObjective('All Objectives');
                  setSelectedFormat('All Formats');
                  setSelectedDuration('All Durations');
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
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Search Laboratory</label>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="Search demonstrations by craft, technique, tool, material, artisan, difficulty, or keyword..."
                  className="w-full border border-gray-200 px-3 py-2 text-xs rounded-none bg-[#FAF9F6] text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                />
              </div>

              {/* Craft Select filter check */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Craft Tradition</label>
                <select 
                  value={activeFilter}
                  onChange={(e) => { setActiveFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All">All Crafts</option>
                  <option value="Hand-Knotted Carpet">Hand-Knotted Carpet</option>
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
                </select>
              </div>

              {/* Technique Category */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono font-mono">Technique Category</label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Categories">All Categories</option>
                  <option value="Fibre Preparation">Fibre Preparation</option>
                  <option value="Yarn Preparation">Yarn Preparation</option>
                  <option value="Loom Setup">Loom Setup</option>
                  <option value="Weaving">Weaving</option>
                  <option value="Embroidery">Embroidery</option>
                  <option value="Carving">Carving</option>
                  <option value="Engraving">Engraving</option>
                  <option value="Painting">Painting</option>
                  <option value="Dyeing">Dyeing</option>
                  <option value="Felting">Felting</option>
                  <option value="Polishing">Polishing</option>
                  <option value="Finishing">Finishing</option>
                  <option value="Quality Inspection">Quality Inspection</option>
                  <option value="Tool Maintenance">Tool Maintenance</option>
                  <option value="Restoration">Restoration</option>
                </select>
              </div>

              {/* Skill Level */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Skill Level</label>
                <select 
                  value={selectedLevel}
                  onChange={(e) => { setSelectedLevel(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Levels">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Master Artisan">Master Artisan</option>
                </select>
              </div>

              {/* Learning Objective */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono font-mono font-mono">Learning Objective</label>
                <select 
                  value={selectedObjective}
                  onChange={(e) => { setSelectedObjective(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Objectives">All Objectives</option>
                  <option value="Basic Technique">Basic Technique</option>
                  <option value="Traditional Method">Traditional Method</option>
                  <option value="Quality Control">Quality Control</option>
                  <option value="Common Mistakes">Common Mistakes</option>
                  <option value="Conservation">Conservation</option>
                  <option value="Tool Handling">Tool Handling</option>
                  <option value="Design Interpretation">Design Interpretation</option>
                  <option value="Material Knowledge">Material Knowledge</option>
                </select>
              </div>

              {/* Demonstration Format */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Demonstration Format</label>
                <select 
                  value={selectedFormat}
                  onChange={(e) => { setSelectedFormat(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Formats">All Formats</option>
                  <option value="Full Demonstration">Full Demonstration</option>
                  <option value="Short Technique">Short Technique</option>
                  <option value="Tool Demonstration">Tool Demonstration</option>
                  <option value="Material Demonstration">Material Demonstration</option>
                  <option value="Process Breakdown">Process Breakdown</option>
                  <option value="Quality Assessment">Quality Assessment</option>
                  <option value="Comparative Technique">Comparative Technique</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono font-mono">Duration</label>
                <select 
                  value={selectedDuration}
                  onChange={(e) => { setSelectedDuration(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Durations">All Durations</option>
                  <option value="Under 10 min">Under 10 min</option>
                  <option value="10–20 min">10–20 min</option>
                  <option value="20–40 min">20–40 min</option>
                  <option value="Over 40 min">Over 40 min</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Documentation Status</label>
                <select 
                  value={selectedStatus}
                  onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Statuses">All Statuses</option>
                  <option value="Published">Published</option>
                  <option value="Technical Review">Technical Review</option>
                  <option value="Recording Planned">Recording Planned</option>
                  <option value="Editing">Editing</option>
                  <option value="Updated">Updated</option>
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
                  <option value="Most Viewed">Most Viewed</option>
                  <option value="A–Z">A–Z</option>
                  <option value="Difficulty">Difficulty</option>
                  <option value="Craft">Craft</option>
                  <option value="Duration">Duration</option>
                </select>
              </div>

            </div>
          </div>

          {/* Results Area */}
          <div className="w-full lg:w-3/4">

            {loading ? (
              <div className="py-20 text-center text-gray-500 font-serif">Loading demonstrations...</div>
            ) : (
              <>
                {/* 1. LEARNING CARDS VIEW (DEFAULT MODE) */}
                {currentView === 'cards' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                    {paginatedDemos.map((d, i) => (
                      <div 
                        key={i} 
                        className="bg-white border-2 border-[#3E2723]/35 py-8 px-6 hover:bg-[#3E2723]/5 transition-all duration-300 group flex flex-col justify-between shadow-sm relative grid-ledger"
                      >
                        <div>
                          {/* Accession ID & Entry header */}
                          <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5 font-semibold">
                            <span>{d.accessionId}</span>
                            <span>{d.dur.toUpperCase()}</span>
                          </div>

                          {/* Tech demo flag & Craft */}
                          <div className="text-[9px] font-mono text-[#D4AF37] font-bold uppercase tracking-widest mb-4">
                            TECHNIQUE DEMONSTRATION &bull; {d.craft.toUpperCase()}
                          </div>

                          {/* Main Title */}
                          <h3 
                            onClick={() => { setActiveItem(d); setActiveModalTab('guide'); }}
                            className="text-xl md:text-2xl font-serif font-bold text-[#3E2723] leading-snug cursor-pointer group-hover:text-[#D4AF37] transition-colors"
                          >
                            {d.title}
                          </h3>

                          {/* Archival Subtitle */}
                          {d.subtitle && (
                            <h4 className="text-xs font-serif italic text-gray-500 mt-1 leading-snug mb-4">
                              {d.subtitle}
                            </h4>
                          )}

                          {/* Difficulty level */}
                          <div className="mb-4 text-[10px] font-mono border-t border-b border-[#3E2723]/10 py-1.5 my-3">
                            <span className="text-gray-400 block uppercase font-bold text-[8px]">DIFFICULTY</span>
                            <span className="font-bold text-[#3E2723]">{d.level}</span>
                          </div>

                          {/* Tools list */}
                          <div className="relative pl-4 mb-4 border-l-2 border-[#D4AF37]/50 font-mono text-[10px] leading-relaxed">
                            <span className="text-[9px] text-gray-400 uppercase tracking-wider block mb-1">
                              PRIMARY TOOLS
                            </span>
                            <span className="font-bold text-[#3E2723]">
                              {d.tools?.[0]?.name || "Traditional Guild tools"}
                            </span>
                          </div>
                        </div>

                        <div>
                          {/* Graphic device */}
                          <div className="text-[#3E2723]/25 text-[9px] font-mono mb-3 select-none">
                            ─────╱╲──╱────╲╱─────
                          </div>

                          {/* Location / District */}
                          <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-mono text-gray-400 uppercase tracking-wider mb-4 font-semibold">
                            <span>{d.district.toUpperCase()}</span>
                            <span>&middot;</span>
                            <span>{d.recordingDate.toUpperCase()}</span>
                          </div>

                          {/* Action button & Status */}
                          <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto font-mono">
                            <span className="bg-[#3E2723]/5 border border-[#3E2723]/10 text-[#3E2723] text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider font-mono">
                              {d.status.toUpperCase()}
                            </span>
                            
                            <button 
                              onClick={() => { setActiveItem(d); setActiveModalTab('guide'); }}
                              className="text-xs font-bold uppercase tracking-widest text-[#3E2723] hover:text-[#D4AF37] transition-colors font-mono"
                            >
                              View Demonstration &rarr;
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

                {/* 2. TECHNICAL MANUAL VIEW */}
                {currentView === 'manual' && (
                  <div className="space-y-6 animate-fadeIn font-mono text-xs">
                    {paginatedDemos.map((d, i) => (
                      <div key={i} className="bg-white border border-[#3E2723]/15 p-6 shadow-xs relative">
                        <div className="absolute top-4 right-4 text-gray-300 font-bold font-mono text-sm">{d.accessionId}</div>
                        <h4 className="text-[#3E2723] font-serif text-lg font-bold mb-1">{d.title}</h4>
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-3">{d.subtitle}</p>
                        
                        <p className="text-gray-600 font-sans mb-4">{d.desc}</p>
                        
                        <div className="bg-[#FAF9F6] border border-gray-250 p-4 space-y-3">
                          <span className="text-[#3E2723] font-bold text-[10px] uppercase block mb-1">INSTRUCTION MANUAL SEQUENCE</span>
                          
                          {/* Mapping all steps */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px]">
                            {d.steps?.map((step: any, sIdx: number) => (
                              <div key={sIdx} className="bg-white p-2 border border-gray-150">
                                <span className="font-bold text-[#3E2723] block">{step.step} &bull; {step.title}</span>
                                <span className="text-gray-500">Purpose: {step.purpose}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[9px] text-gray-400 uppercase mt-4 pt-3 border-t border-gray-100">
                          <span>Lead Master: {d.artisan}</span>
                          <button 
                            onClick={() => { setActiveItem(d); setActiveModalTab('guide'); }}
                            className="text-[#3E2723] hover:underline font-bold"
                          >
                            Open Complete Technical Manual &rarr;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. TECHNIQUE LIBRARY VIEW */}
                {currentView === 'library' && (
                  <div className="bg-white border border-[#3E2723]/10 overflow-x-auto shadow-sm animate-fadeIn">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#3E2723] text-[#D4AF37] font-mono uppercase tracking-wider text-[10px]">
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Archive Code</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Technique Demonstration</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Craft</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">District</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Format</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center font-mono">Level</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center font-mono">Duration</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center font-mono">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#3E2723]/10 font-sans text-gray-700">
                        {paginatedDemos.map((d, i) => (
                          <tr key={i} className="hover:bg-[#FAF9F6] transition-colors cursor-pointer" onClick={() => { setActiveItem(d); setActiveModalTab('guide'); }}>
                            <td className="p-4 font-mono font-bold text-gray-505 whitespace-nowrap">{d.accessionId}</td>
                            <td className="p-4">
                              <div className="font-serif font-bold text-[#3E2723] text-sm hover:text-[#D4AF37] transition-colors">{d.title}</div>
                              <div className="text-[10px] text-gray-400 font-light truncate max-w-xs">{d.subtitle}</div>
                            </td>
                            <td className="p-4 whitespace-nowrap">{d.craft}</td>
                            <td className="p-4 whitespace-nowrap">{d.district}</td>
                            <td className="p-4 whitespace-nowrap">{d.format}</td>
                            <td className="p-4 text-center whitespace-nowrap font-mono">{d.level}</td>
                            <td className="p-4 text-center font-mono">{d.dur}</td>
                            <td className="p-4 text-center whitespace-nowrap font-mono">
                              <span className="px-2 py-0.5 font-mono text-[9px] uppercase border border-[#3E2723]/20 bg-[#3E2723]/5 text-[#3E2723] font-bold">
                                {d.status}
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
                  className="w-10 h-10 border border-gray-305 flex items-center justify-center text-gray-555 hover:border-[#3E2723] hover:text-[#3E2723] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  &rarr;
                </button>
              </div>
            )}
          </div>

        </section>

        {/* How KHCRF Craft Demonstrations Are Developed Section */}
        <section className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs mt-16" id="methodology">
          <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold">
            How KHCRF Craft Demonstrations Are Developed
          </h2>
          <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans">
            Each demonstration is produced through collaboration with experienced artisans, technical reviewers, researchers, and documentation specialists. Techniques are recorded under real workshop conditions, reviewed for technical accuracy, and supplemented with structured metadata, transcripts, terminology, and educational notes.
          </p>

          <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 font-mono">
            Development Workflow
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 text-xs text-gray-700 font-mono">
            {[
              { id: "01", name: "Technique selection", desc: "Targeting critical know-how at risk of disappearing." },
              { id: "02", name: "Artisan consultation", desc: "Setting procedural parameters with senior master carvers." },
              { id: "03", name: "Technical planning", desc: "Drafting script grids and close-up camera coordinates." },
              { id: "04", name: "Recording under workshop", desc: "Capturing movements under authentic karkhana room levels." },
              { id: "05", name: "Step segmentation", desc: "Dividing continuous logs into the 6 instruction steps." },
              { id: "06", name: "Transcript preparation", desc: "Writing monospaced audio logs in local Kashmiri dialects." },
              { id: "07", name: "Technical review", desc: "Factual audits by independent master craftsman panels." },
              { id: "08", name: "Educational annotation", desc: "Drafting safety warning parameters and student outcomes." },
              { id: "09", name: "Metadata enrichment", desc: "Tagging files with GI-accession records and tool names." },
              { id: "10", name: "Publication track", desc: "Releasing verified manuals into the public CLIE indexes." }
            ].map((step) => (
              <div key={step.id} className="border-l-2 border-[#3E2723] pl-4 py-1 font-mono">
                <span className="font-mono text-[#D4AF37] font-bold block mb-1">STAGE {step.id}</span>
                <span className="font-bold text-[#3E2723] block mb-1">{step.name}</span>
                <span className="text-gray-555 font-sans">{step.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Documentation Principles Section */}
        <section className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs mt-12">
          <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold">
            Technical Documentation Principles
          </h2>
          <p className="text-gray-655 text-sm leading-relaxed mb-8 max-w-4xl font-sans">
            KHCRF demonstrations follow these principles:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-xs text-gray-700 font-sans">
            {[
              "no staged shortcuts presented as traditional methods",
              "technical terminology preserved",
              "regional variations documented where appropriate",
              "safety considerations clearly identified",
              "distinction between traditional and contemporary adaptations",
              "version-controlled updates",
              "attribution of master artisans and reviewers",
              "transparent editorial notes when methods differ between regions"
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
            <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold">
              Using the Technical Lab Archive
            </h2>
            <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans text-gray-500">
              This archive supports:
            </p>
            <div className="flex flex-col gap-3 font-mono">
              <button 
                onClick={() => {
                  setActiveItem(allDemos[0]);
                  setActiveModalTab('progress');
                }}
                className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors text-center font-mono w-full md:w-auto"
              >
                Request Educational Access
              </button>
              <a 
                href="#suggest"
                className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors text-center font-mono w-full md:w-auto block"
              >
                Recommend a Technique
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#FAF9F6] border border-[#3E2723]/10 p-6 md:p-8 font-sans">
            <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 font-mono">
              Approved Educational Frameworks
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4 text-xs text-gray-700 font-sans">
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>apprenticeship programmes</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>vocational institutes</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>museums</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>conservation laboratories</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>restoration workshops</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>artisan cooperatives</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>curriculum development</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>technical research</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>public demonstrations</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>digital learning platforms</li>
            </ul>
          </div>
        </section>

        {/* Propose a Demonstration Section */}
        <section className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs mt-12" id="suggest">
          <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold font-serif">
            Help Preserve Traditional Skills
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-6 font-sans">
            Master artisans, trainers, cooperatives, institutions, and researchers may nominate techniques that should be documented before they disappear.
          </p>
          
          <div className="max-w-2xl bg-[#FAF9F6] border border-[#3E2723]/20 p-6 font-mono text-xs space-y-4">
            <h4 className="font-bold text-[#3E2723] uppercase mb-3 text-[10px]">Required Proposal Fields:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-gray-500 font-mono text-[10px]">
              <div>• Technique Name</div>
              <div>• Traditional Tools</div>
              <div>• Craft</div>
              <div>• Materials Required</div>
              <div>• Difficulty</div>
              <div>• Estimated Demonstration Time</div>
              <div>• Master Artisan</div>
              <div>• Supporting References</div>
              <div>• Workshop</div>
              <div>• Contact Information</div>
              <div>• Village or Locality</div>
              <div>• District</div>
            </div>
            
            <div className="pt-4 border-t border-[#3E2723]/10 mt-4">
              <span className="text-gray-400 block mb-2 font-sans">To submit a proposal, please email our documentation desk:</span>
              <a href="mailto:demonstrations@khcrf.org" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-2.5 font-bold uppercase tracking-wider text-[10px] inline-block font-mono transition-colors">
                Propose a Demonstration
              </a>
            </div>
          </div>
        </section>

        {/* Footer Statement Section */}
        <section className="border-t border-[#3E2723]/20 pt-10 text-center max-w-4xl mx-auto mt-16 font-sans">
          <blockquote className="text-gray-700 text-base md:text-lg leading-relaxed font-serif italic mb-4">
            "KHCRF Craft Demonstrations preserve the practical knowledge behind Kashmir's craft heritage by documenting traditional techniques with technical precision, educational clarity, and respect for the artisans who continue to keep these skills alive."
          </blockquote>
          <p className="text-gray-400 text-xs font-mono uppercase tracking-widest font-bold">
            KHCRF Registry Access Console &bull; Technical Demonstrations Registry Division
          </p>
          <p className="text-[#D4AF37] text-[10px] uppercase font-bold mt-2 tracking-widest font-mono">
            This page represents a technical craft laboratory under development. Access to verified guides and raw records is reserved for supportive members.
          </p>
        </section>

      </div>
    </main>
  );
}
