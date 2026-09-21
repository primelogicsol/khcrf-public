import { GlossaryEntry, GlossaryType, FieldValidationStatus } from './data';

const parseRoles = (dataArray: string[]): GlossaryEntry[] => {
  return dataArray.map(line => {
    const parts = line.split('|');
    return {
      term: parts[0],
      localSpellingVariants: parts[1] || undefined,
      type: 'Artisan Role' as GlossaryType,
      craftCategory: parts[2],
      definition: parts[3], // Function in production
      traditionalUsage: '',
      technicalMeaning: '',
      relatedTerms: [],
      exampleUsage: '',
      stageOfProduction: parts[4],
      skillsRequired: parts[5],
      toolsUsed: parts[6],
      relatedTechnique: parts[7],
      apprenticeshipPathway: parts[8],
      validationStatus: (parts[9] || 'Requires Field Validation') as FieldValidationStatus,
      sourceType: parts[10] || 'Online Evidence',
    };
  });
};

const rawRoles = [
  // 1-15: Carpet Weaving & Talim
  "Master Weaver|Ustad / Wasta|Carpet Weaving|Senior craft expert, trainer, and lineage bearer overseeing the entire carpet loom.|Supervision and Training|Leadership, deep knowledge of knotting, defect correction|Measuring Scale, Talim|Knotting / Management|Decades of apprenticeship starting from childhood.|Requires Field Validation|IAFOR",
  "Carpet Weaver|Kalimba|Carpet Weaving|Executes the intricate knotting on the loom following the Talim.|Production|Dexterity, rhythm, color matching|Khur, Panja, Scissors|Asymmetrical Knotting|Learns under a Wasta for 5-7 years.|Verified|IAFOR",
  "Talim Writer|Talim Guru|Carpet / Kani|Converts the visual design into coded talim instructions.|Preparation|Mathematics, cryptography, pattern visualization|Pen, Graph Paper|Talim Coding|Trained directly by elder Talim masters.|Verified|IAFOR",
  "Pattern Designer|Naqash / Nakaash|Carpet / Design|Creates the master visual design and floral motifs for the carpet.|Design|Drawing, geometry, knowledge of traditional motifs|Pencil, Naksha (Graph)|Drafting|Familial lineage; requires immense artistic talent.|Verified|IAFOR",
  "Loom Setter|Waan-Wasta|Carpet Weaving|Prepares the warp tension and structural integrity of the loom before weaving begins.|Preparation|Physical strength, structural understanding|Warp Beam, Tension Pegs|Warping|Learns alongside senior weavers.|Requires Field Validation|General Knowledge",
  "Carpet Finisher|Charakgar-Qaleen|Carpet Weaving|Washes, stretches, and shears the final carpet to ensure uniform pile height.|Finishing|Precision shearing, chemical knowledge|Shears, Brushes, Water Vats|Shearing / Washing|Specialized trade within the carpet industry.|Requires Field Validation|General Knowledge",
  "Yarn Preparer|Tokri-wal|Carpet Weaving|Cuts and organizes colored yarn balls into baskets for the Kalimba.|Preparation|Color sorting|Scissors, Yarn Basket|Yarn Prep|Often the first task given to young apprentices.|Requires Field Validation|General Knowledge",
  "Color Caller|Talim-Khaan|Carpet Weaving|Reads the Talim instructions aloud to multiple weavers on a large loom.|Production|Fluent reading of Talim code, rhythmic chanting|Talim Sheet|Chanting|Usually a senior weaver or Wasta.|Historical / Archival|Archival",
  "Edge Binder|Kunda-Kash|Carpet Weaving|Binds the selvedges of the carpet to prevent fraying.|Finishing|Tension control|Needle, Thick Wool|Binding|Finishing apprenticeship.|Requires Field Validation|General Knowledge",
  "Carpet Dyer|Ranger / Rangrez|Carpet / Textile|Dyer or color specialist preparing the wool or silk yarn.|Preparation|Chemistry, color matching, temperature control|Vats, Dyes|Dyeing|Hereditary profession.|Verified|IAFOR",
  "Silk Sorter|Abrisham-Saaz|Carpet Weaving|Sorts and grades pure silk filament before dyeing.|Preparation|Tactile sensitivity|Hands, Spindles|Sorting|Specialized material handling.|Requires Field Validation|General Knowledge",
  "Loom Carpenter|Khaddi-Saaz|Carpet Weaving|Builds and repairs the heavy wooden vertical looms.|Infrastructure|Woodworking|Saw, Hammer|Carpentry|Woodworking lineage.|Requires Field Validation|General Knowledge",
  "Graph Reader|Naksha-Khaan|Carpet Weaving|Assists the Talim Guru by calling out grid coordinates from the design.|Design|Visual tracking|Graph Paper|Drafting|Apprentice to the Naqash or Talim Guru.|Requires Field Validation|General Knowledge",
  "Knot Inspector|Taftish-gar|Carpet Weaving|Checks knot density and corrects mistakes during weaving.|Quality Control|Keen eyesight|Pick, Magnifier|Inspection|Senior Kalimba role.|Requires Field Validation|General Knowledge",
  "Carpet Washer|Dhobi-Qaleen|Carpet Weaving|Performs the rigorous final chemical and water wash of the carpet.|Finishing|Knowledge of wool reaction to water|Squeegee, Hose|Washing|Apprenticeship in finishing houses.|Requires Field Validation|General Knowledge",

  // 16-30: Copperware & Silverware
  "Copper Smith|Khar|Copperware|Smith or maker of the copper vessel form from raw sheets.|Forming|Hammering, forging, annealing|Draz, Mekh, Yandrewah|Forging|Hereditary profession (Khar lineage).|Verified|IAFOR / Greater Kashmir",
  "Copper Engraver|Naqash|Copperware|Engraves floral and geometric patterns into the shaped copper vessel.|Decoration|Precision striking, artistic flair|Chisels, Punches, Compass|Kandkari|Apprenticeship under a Master Naqash.|Verified|IAFOR",
  "Gilder|Zarcod|Copperware / Silverware|Applies gold or silver plating to the finished vessel.|Finishing|Chemical plating, temperature control|Brushes, Chemicals|Gilding|Highly specialized chemical training.|Verified|IAFOR",
  "Copper Polisher|Roshangar|Copperware|Polishes the metal to a high mirror shine.|Finishing|Stamina, abrasive knowledge|Polishing Wheel, Buffs|Polishing|Apprenticeship in finishing workshops.|Verified|IAFOR",
  "Copper Cleaner|Charakgar|Copperware|Cleans and removes oxidation/acid residues after engraving.|Finishing|Chemical handling|Acids, Brushes|Cleaning|Entry-level finishing role.|Verified|IAFOR",
  "Tin Liner|Kalai-gar|Copperware|Coats the interior of copper cooking vessels with molten tin.|Finishing|Heat management, speed|Tin, Cotton Swab, Flux|Kalai|Nomadic or hereditary trade.|Verified|Trade Usage",
  "Silver Smith|Sonar|Silverware|Crafts jewelry, bowls, and fine objects from silver.|Forming|Soldering, fine manipulation|Crucible, Soldering Iron|Silversmithing|Traditional Sonar caste/lineage.|Requires Field Validation|General Knowledge",
  "Wire Drawer|Tar-Kash|Silverware|Pulls silver through plates to create fine wire for filigree.|Preparation|Physical strength|Drawplate (Jantar)|Wire Drawing|Specialized sub-role of silversmithing.|Requires Field Validation|General Knowledge",
  "Repousse Artist|Dabu-gar|Copperware|Punches the metal from behind to create raised relief motifs.|Decoration|Depth perception, hammer control|Dabu-Kalam, Pitch Bowl|Repousse|Apprenticeship in Kandkari.|Requires Field Validation|General Knowledge",
  "Furnace Operator|Bhatti-wal|Copperware|Maintains the extreme heat needed to anneal copper.|Forming|Temperature judgment|Bellows (Khalu)|Annealing|Entry-level Khar role.|Requires Field Validation|General Knowledge",
  "Vessel Joiner|Jod-gar|Copperware|Solders and rivets handles, spouts, and bases onto samovars.|Forming|Soldering, riveting|Hammer, Solder|Joinery|Mid-level Khar training.|Requires Field Validation|General Knowledge",
  "Pattern Tracer|Khakha-Kash|Copperware|Traces the initial design onto the pitch-covered vessel.|Preparation|Tracing|Stylus|Layout|Apprentice Naqash.|Requires Field Validation|General Knowledge",
  "Scrap Recycler|Raddi-wal|Copperware|Melts down copper scraps for reuse.|Preparation|Smelting|Crucible|Smelting|Utility role.|Requires Field Validation|General Knowledge",
  "Silver Polisher|Chandi-Roshangar|Silverware|Uses agate burnishers to shine delicate silver.|Finishing|Gentle pressure control|Agate Burnisher|Burnishing|Specialized Roshangar.|Requires Field Validation|General Knowledge",

  // 31-45: Papier Mâché
  "Pulp Maker|Sakhtsaz|Papier Mâché|Maker of the paper-pulp object structure.|Forming|Pounding, molding, smoothing|Mould (Qalib), Pestle|Sakhtsazi|Hereditary or workshop apprenticeship.|Verified|IAFOR",
  "Surface Painter|Naqash|Papier Mâché|Painter and decorator of the papier mâché surface.|Decoration|Brush control, color theory, miniature painting|Qalam, Rez-Qalam|Naqashi|Extensive artistic apprenticeship.|Verified|IAFOR",
  "Gold Illuminator|Sone-Naqash|Papier Mâché|Specializes in applying gold leaf and gold paint details.|Decoration|Extreme precision, breath control|Sone-Qalam|Illumination|Senior Naqash role.|Requires Field Validation|General Knowledge",
  "Varnish Applier|Rogan-gar|Papier Mâché|Applies the final protective lacquer layers.|Finishing|Dust-free application, smooth coating|Lacquer Brush|Varnishing|Finishing specialization.|Requires Field Validation|General Knowledge",
  "Base Primer|Safeda-Kash|Papier Mâché|Applies the chalk/gesso base over the dried pulp.|Preparation|Smooth application|Base Brush|Priming|Junior Naqash or Sakhtsaz apprentice.|Requires Field Validation|General Knowledge",
  "Pulp Pounder|Muhul-wal|Papier Mâché|Pounds waste paper into a fine pulp slurry.|Preparation|Physical endurance|Stone Mortar, Pestle|Pounding|Entry-level Sakhtsazi role.|Requires Field Validation|General Knowledge",
  "Object Demolder|Chhura-wal|Papier Mâché|Carefully cuts the dried pulp off the wooden mold.|Forming|Precision cutting without damaging the mold|Cutting Knife|Demolding|Mid-level Sakhtsazi.|Requires Field Validation|General Knowledge",
  "Surface Sander|Kurkut-Kash|Papier Mâché|Sands the raw Sakhta to a flawless finish before painting.|Preparation|Tactile assessment|Sanding Stone|Sanding|Junior Sakhtsazi role.|Requires Field Validation|General Knowledge",
  "Color Mixer|Rang-Saaz|Papier Mâché|Grinds and mixes natural pigments and binders.|Preparation|Color theory, chemistry|Palette, Mortar|Color Mixing|Apprentice Naqash.|Requires Field Validation|General Knowledge",
  "Detail Liner|Rez-Kari-Ustad|Papier Mâché|Executes the microscopic black outlines around motifs.|Decoration|Micro-precision|Single-hair brush|Rez-e-Kari|Master Naqash.|Requires Field Validation|General Knowledge",
  "Adhesive Maker|Atij-Saaz|Papier Mâché|Boils rice to create the structural adhesive paste.|Preparation|Temperature control|Glue Pot|Boiling|Utility role.|Requires Field Validation|General Knowledge",
  "Pattern Drafter|Naksha-Navis|Papier Mâché|Draws the initial master sketches for new box designs.|Design|Composition|Paper, Pencil|Drafting|Master Naqash.|Requires Field Validation|General Knowledge",
  "Drying Overseer|Dhoop-wal|Papier Mâché|Manages the sun-drying process of wet pulp and varnish.|Forming|Weather monitoring|Drying Racks|Curing|Entry-level role.|Requires Field Validation|General Knowledge",
  "Wood Turner|Charkh-wal|Papier Mâché|Uses a lathe to trim circular papier mâché boxes perfectly round.|Forming|Lathe operation|Hand Lathe|Trimming|Specialized Sakhtsaz.|Requires Field Validation|General Knowledge",
  "Master Decorator|Ustad Naqash|Papier Mâché|Designs the overarching theme and executes the most difficult motifs.|Decoration|Mastery of all styles|All brushes|Naqashi|Lifelong dedication.|Verified|General Knowledge",

  // 46-60: Textiles, Pashmina & Kani
  "Weaver|Wovur / Weaver|Shawl / Pashmina|Executes plain or twill weaving on a handloom.|Production|Rhythm, tension control|Handloom, Shuttle|Weaving|Apprenticeship under a master weaver.|Verified|IAFOR",
  "Kani Weaver|Kani-Wovur|Kani Shawls|Weaves complex tapestry patterns using multiple tujlis.|Production|Reading Talim, color management|Kani/Tujli|Tapestry Weaving|Highly specialized training, often 10+ years.|Verified|Trade Usage",
  "Spinner|Yinder-wal|Pashmina|Spins raw pashm into ultra-fine yarn.|Preparation|Tactile sensitivity, drafting control|Spinning Wheel (Yinder)|Spinning|Traditionally a female-dominated household craft.|Verified|Trade Usage",
  "Raw Wool Sorter|Pashm-Tchatan|Pashmina|Sorts raw fleece by color, length, and micron count.|Preparation|Visual and tactile grading|Hands|Sorting|Learned through family tradition.|Requires Field Validation|General Knowledge",
  "Wool Washer|Dhobi|Pashmina / Wool|Washes the raw fleece to remove grease and impurities.|Preparation|Water temperature control|Vats|Scouring|Specialized utility role.|Requires Field Validation|General Knowledge",
  "Wool Comber|Kanga-wal|Pashmina|Combs the washed wool to align fibers for spinning.|Preparation|Patience, fiber knowledge|Combs|Carding / Combing|Preparation role.|Requires Field Validation|General Knowledge",
  "Warp Maker|Tana-Kash|Shawl / Carpet|Measures and prepares the warp threads on a frame.|Preparation|Mathematics, tension control|Warping Frame|Warping|Specialized pre-loom role.|Requires Field Validation|General Knowledge",
  "Thread Twister|Pech-wal|Textiles|Twists single yarns into stronger 2-ply yarns.|Preparation|Spindle control|Spindle|Twisting|Apprentice role.|Requires Field Validation|General Knowledge",
  "Loom Threader|Aankuz-wal|Textiles|Threads thousands of warp ends through the heddles and reed.|Preparation|Patience, eyesight|Drawing Hook|Threading|Pre-loom setup.|Requires Field Validation|General Knowledge",
  "Dyer|Ranger / Rangrez|Textile|Dyes pashmina and wool yarns in vibrant colors.|Preparation|Dye chemistry|Vats|Dyeing|Hereditary profession.|Verified|IAFOR",
  "Shawl Washer|Purzagor|Shawl|Washes the finished shawl to bring out the softness.|Finishing|Chemical and thermal knowledge|Vats|Finishing Wash|Specialized finishing.|Historical / Archival|Archival",
  "Tweeser|Tchimta-wal|Pashmina|Uses tweezers to remove guard hairs from the woven shawl.|Finishing|Extreme patience, eyesight|Tweezers|De-hairing|Finishing role.|Requires Field Validation|General Knowledge",
  "Fringe Maker|Dawal-Saaz|Shawl|Knots the loose warp ends into decorative fringes.|Finishing|Knotting|Hands|Fringing|Often done by women at home.|Requires Field Validation|General Knowledge",
  "Master Weaver|Ustad Wovur|Kani Shawls|Oversees the Kani karkhana and quality.|Supervision|Mastery of all steps|None|Management|Decades of experience.|Verified|General Knowledge",

  // 61-75: Embroidery (Sozni, Aari, Tilla, Crewel)
  "Sozni Artisan|Sozni-Kash|Sozni Embroidery|Executes fine needle embroidery on pashmina.|Decoration|Micro-stitching, patience|Sozni Needle|Satin Stitch|Long apprenticeship starting with simple borders.|Technical Reference|Trade Usage",
  "Aari Artisan|Ari-Kash|Aari Embroidery|Executes hook embroidery for crewel and chain stitch.|Decoration|Rhythm, continuous stitching|Aari Hook|Zalakdozi|Learned in workshops or at home.|Technical Reference|Trade Usage",
  "Tilla Artisan|Tilla-Kash|Tilla Embroidery|Couches metallic threads onto garments.|Decoration|Tension control, precision|Needle, Tilla Thread|Couched Embroidery|Specialized apprenticeship.|Technical Reference|Trade Usage",
  "Crewel Artisan|Crewel-Kash|Crewel|Fills large motifs with thick wool yarn using an awl/hook.|Decoration|Color blending|Aari Hook|Chain Stitch|Often a cottage industry role.|Technical Reference|Trade Usage",
  "Design Tracer|Khakha-Kash|Embroidery|Transfers the paper pattern onto the fabric using pounce.|Preparation|Alignment|Pounce Bag, Khakha|Tracing|Apprentice to Naqash.|Verified|Trade Usage",
  "Master Pattern Maker|Naqash|Embroidery|Draws the original floral designs for shawls and garments.|Design|Drawing, motif knowledge|Pen, Paper|Drafting|Hereditary Naqash families.|Verified|IAFOR",
  "Frame Setter|Adda-wal|Embroidery|Stretches the fabric tightly onto the wooden Adda.|Preparation|Tensioning|Tension Straps|Framing|Junior artisan role.|Requires Field Validation|General Knowledge",
  "Thread Sorter|Dhaaga-wal|Embroidery|Matches thread colors to the master design.|Preparation|Color theory|None|Sorting|Apprentice role.|Requires Field Validation|General Knowledge",
  "Embroidery Finisher|Istari-wal|Embroidery|Presses and flattens the embroidery to set the stitches.|Finishing|Heat control|Iron|Pressing|Finishing house role.|Requires Field Validation|General Knowledge",
  "Zardozi Artisan|Zardoz|Embroidery|Executes heavy 3D metallic embroidery on velvet.|Decoration|Handling heavy materials|Needle, Zari|Zardozi|Specialized metallic training.|Requires Field Validation|General Knowledge",
  "Master Embroiderer|Ustad-Sozni|Sozni Embroidery|Executes the most difficult motifs like the Shah-Buta.|Decoration|Flawless execution|Sozni Needle|Sozni|Highest level of Sozni-Kash.|Requires Field Validation|General Knowledge",
  "Perforator|Gargari-wal|Embroidery|Punches holes in the tracing paper to create the Khakha.|Preparation|Tracing accuracy|Pricking Pin|Perforating|Junior Naqash role.|Requires Field Validation|General Knowledge",
  "Thread Cutter|Kainchi-wal|Embroidery|Carefully trims loose threads from the back of the fabric.|Finishing|Precision cutting|Scissors|Trimming|Apprentice finishing role.|Requires Field Validation|General Knowledge",
  "Color Blender|Rang-Amez|Crewel|Specializes in blending multiple shades of wool in a single petal.|Decoration|Shading (Aab)|Aari Hook|Shading|Senior Ari-Kash.|Requires Field Validation|General Knowledge",

  // 76-90: Walnut Wood Carving & General
  "Wood Carver|Tarkhan / Carver|Walnut Wood Carving|Carves decorative patterns into walnut wood.|Decoration|Chisel control, 3D visualization|Chisels, Gouges|Relief / Deep Carving|Apprenticeship in wood workshops.|Technical Reference|Incredible India",
  "Master Carver|Ustad Tarkhan|Walnut Wood Carving|Designs and executes undercut (Vidad) carving.|Decoration|Mastery of depth and shadow|Specialized Gouges|Undercut Carving|Decades of carving experience.|Requires Field Validation|General Knowledge",
  "Wood Joiner|Jod-gar|Walnut Wood Carving|Assembles carved panels into furniture without nails.|Forming|Joinery, geometry|Mallet, Glue|Joinery|Specialized carpentry.|Requires Field Validation|General Knowledge",
  "Rough Cutter|Aar-wal|Walnut Wood Carving|Cuts the raw walnut logs into workable planks.|Preparation|Physical strength|Saw|Sawing|Entry-level timber role.|Requires Field Validation|General Knowledge",
  "Surface Smoother|Randha-wal|Walnut Wood Carving|Planes the wood flat before carving begins.|Preparation|Leveling|Scraper / Plane|Planing|Junior workshop role.|Requires Field Validation|General Knowledge",
  "Wood Polisher|Polish-gar|Walnut Wood Carving|Applies wax or oil to finish the carved wood.|Finishing|Friction polishing|Polishing Cloth, Agate|Polishing|Specialized finishing role.|Requires Field Validation|General Knowledge",
  "Khatamband Artisan|Khatamband-Kaar|Woodwork|Assembles geometric wooden ceiling pieces.|Decoration|Geometry, puzzle assembly|Template, Compass|Khatamband|Specific Khatamband lineage.|Historical / Archival|Archival",
  "Seasoning Overseer|Khushk-gar|Walnut Wood Carving|Manages the multi-year drying process of walnut timber.|Preparation|Moisture assessment|None|Seasoning|Senior timber merchant.|Requires Field Validation|General Knowledge",
  "Background Stippler|Dabu-Kash|Walnut Wood Carving|Punches the background wood to create a matte texture.|Decoration|Repetitive striking|Punches|Stippling|Apprentice carver role.|Requires Field Validation|General Knowledge",
  "Lattice Carver|Jali-Kash|Walnut Wood Carving|Carves see-through screens (Pinjrakari).|Decoration|Extreme delicacy|Fine Chisels|Openwork Carving|Senior carver.|Requires Field Validation|General Knowledge",
  "Master Artisan|Ustad|All crafts|Senior craft expert, trainer, lineage bearer.|Supervision|Holistic craft mastery|Varies|Mentorship|A title earned over a lifetime of excellence.|Requires Field Validation|IAFOR",
  "Workshop Manager|Karkhandar|All crafts|Owns or manages the workshop, finances, and material supply.|Management|Business, logistics|Ledgers|Management|Merchant class.|Verified|Trade Usage",
  "Apprentice|Shagird|All crafts|A young learner acquiring basic skills under an Ustad.|Learning|Observation, basic tasks|Basic Tools|Learning|The start of every artisan's journey.|Verified|Trade Usage",
  "GI Tagger|GI-Wala|All crafts|Applies the secure GI seal to certified authentic crafts.|Certification|Administrative accuracy|GI Seals|Certification|Government or guild role.|Requires Field Validation|General Knowledge",

  // 91-100: Namda, Gabba & Miscellaneous
  "Namda Felter|Namda-Saaz|Namda|Molds and compresses loose wool into solid felt mats.|Forming|Physical strength, moisture control|Wagoo, Soap|Felting|Apprenticeship in felting.|Verified|Trade Usage",
  "Wool Fluffer|Dhunia|Namda|Bows the raw wool to make it fluffy before felting.|Preparation|Rhythmic bowing|Cotton Bow|Bowing|Preparation role.|Requires Field Validation|General Knowledge",
  "Gabba Applique Artist|Gabba-Kash|Gabba|Cuts and sews pieces of recycled blankets into patterns.|Decoration|Cutting, stitching|Scissors, Hook|Applique|Traditional village craft.|Verified|Trade Usage",
  "Gabba Dyer|Rangrez-Gabba|Gabba|Dyes old blanket pieces in vibrant colors for applique.|Preparation|Dyeing|Vats|Dyeing|Utility role.|Requires Field Validation|General Knowledge",
  "Namda Embroiderer|Ari-Kash-Namda|Namda|Embroiders bright woolen floral patterns onto the felt base.|Decoration|Aari stitching|Aari Hook|Zalakdozi|Namda specialization.|Requires Field Validation|General Knowledge",
  "Namda Washer|Dhobi-Namda|Namda|Washes the finished rug to shrink and tighten the embroidery.|Finishing|Water/shrinkage management|Water|Washing|Finishing role.|Requires Field Validation|General Knowledge",
  "Felt Pattern Maker|Naksha-Namda|Namda|Inlays colored wool into the base felt before rolling.|Decoration|Design layout|Hands|Inlay Felting|Senior felter.|Requires Field Validation|General Knowledge",
  "Tool Maker|Khar-Auzaar|All crafts|The blacksmith who forges the specialized tools for other artisans.|Infrastructure|Metallurgy|Forge, Anvil|Toolmaking|Essential support craft.|Requires Field Validation|General Knowledge",
  "Wood Block Carver|Block-Saaz|Textile|Carves wooden blocks for stamping designs on cloth.|Design|Relief carving|Chisels|Block Carving|Specialized carver.|Requires Field Validation|General Knowledge",
  "Block Printer|Chhapa-gar|Textile|Stamps the carved block onto the fabric as an embroidery guide.|Preparation|Alignment, pressure|Blocks, Ink|Printing|Preparation role.|Requires Field Validation|General Knowledge"
];

export const rolesData = parseRoles(rawRoles);
