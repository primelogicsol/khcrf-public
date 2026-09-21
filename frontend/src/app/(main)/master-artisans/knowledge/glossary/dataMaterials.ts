import { GlossaryEntry, GlossaryType, FieldValidationStatus } from './data';

const parseMaterials = (dataArray: string[]): GlossaryEntry[] => {
  return dataArray.map(line => {
    const parts = line.split('|');
    return {
      term: parts[0],
      localSpellingVariants: parts[1] || undefined,
      type: 'Material' as GlossaryType,
      craftCategory: parts[2],
      definition: parts[3],
      traditionalUsage: parts[4],
      technicalMeaning: parts[5],
      relatedTerms: [],
      exampleUsage: '',
      validationStatus: (parts[6] || 'Requires Field Validation') as FieldValidationStatus,
    };
  });
};

const rawMaterials = [
  // Fibers & Yarns
  "Pashm / Pashmina fiber|Pashm|Pashmina|The raw undercoat fleece of the Changthangi goat.|Spun by hand into ultra-fine yarn for luxury shawls.|Fibers measuring 12 to 16 microns in diameter.|Verified",
  "Sheep Wool|Oon|Textiles|Fleece sheared from domestic sheep.|Used as the primary fiber for carpets, blankets, and tweeds.|Coarser staple fiber than pashmina.|Requires Field Validation",
  "Merino Wool|Merino|Textiles|High-quality, soft sheep wool.|Often imported to blend with local wool for softer apparel.|A specific breed yielding fine, crimped wool.|Trade Usage",
  "Silk Yarn|Abrisham|Carpets / Embroidery|Strong, lustrous continuous filament yarn.|Used for the pile and warp of premium carpets and Sozni embroidery.|Protein fiber produced by Bombyx mori silkworms.|Verified",
  "Cotton Yarn|Soot|Textiles / Carpets|Spun thread made from the cotton plant.|Primarily used for the strong, tension-bearing warp in carpets.|Cellulose-based spun fiber.|Requires Field Validation",
  "Wool Yarn|Oon-Dhaaga|Textiles|Spun sheep wool ready for weaving or embroidery.|Used extensively in crewel embroidery and carpet weaving.|Twisted staple woolen fiber.|Requires Field Validation",
  "Hand-spun Yarn|Charkha-Soot|Pashmina|Yarn spun entirely by hand on a traditional wheel.|Essential for authentic GI-certified Pashmina production.|Yarn with natural twist variations and high structural integrity.|Verified",
  "Machine-spun Yarn|Mill-Soot|Textiles|Commercially produced yarn spun by machines.|Used in lower-grade or commercial textiles to speed up production.|Highly uniform, high-twist industrial yarn.|Trade Usage",

  // Base Fabrics
  "Pashmina Cloth|Pashmina|Pashmina|The finished woven textile made from pure pashm.|Used as the canvas for Sozni embroidery or worn plain.|A lightweight, insulating cashmere plain or twill weave.|Verified",
  "Wool Cloth|Patto|Textiles|A dense, warm woolen fabric woven locally.|Used to make winter cloaks (pherans) and blankets.|A milled and heavily fulled woolen textile.|Verified",
  "Cotton Cloth|Sooti-Kapda|Embroidery|A basic woven cotton fabric.|Sometimes used as a backing for embroidery or lining.|Plain weave cellulose fabric.|Requires Field Validation",
  "Silk Fabric|Resham|Textiles|A woven fabric made entirely of silk.|Used for high-end linings or occasionally as an embroidery base.|Continuous filament weave with high luster.|Requires Field Validation",
  "Dusooti Cotton|Dusooti|Embroidery|A thick, hand-woven double-thread canvas.|The standard base fabric for Kashmiri Crewel and Chain stitch.|A durable, balanced plain weave cotton cloth.|Verified",
  "Canvas|Kirmich|Textiles|A heavy, durable fabric.|Used as backing for heavy rugs or structural bags.|A tightly woven heavy-duty fabric.|Requires Field Validation",
  "Felt Base|Namda|Namda Felting|A dense, non-woven wool pad.|Serves as the canvas for vibrant woolen embroidery in Namda rugs.|Matted, compressed, and fulled wool fibers.|Verified",
  "Velvet|Makhmal|Embroidery|A luxurious fabric with a short, dense pile.|The preferred base for heavy Zardozi and Tilla embroidery.|A tufted woven fabric.|Verified",

  // Embroidery Materials
  "Silk Thread|Resham-Dhaaga|Embroidery|Fine, untwisted or lightly twisted silk filament.|The exclusive thread used for authentic Sozni embroidery.|High-tensile protein filament.|Requires Field Validation",
  "Cotton Thread|Sooti-Dhaaga|Embroidery|Spun cotton yarn used for stitching.|Often used in Aari work or for basting and tracing patterns.|Mercerized or unmercerized cellulose yarn.|Requires Field Validation",
  "Wool Thread|Oon-Dhaaga|Crewel|Thick, brightly dyed wool yarn.|The primary material for filling large floral patterns in Crewel work.|2-ply or 3-ply worsted wool yarn.|Verified",
  "Metallic Tilla Thread|Tilla|Tilla|A metallic thread historically made of pure silver or gold.|Couched onto fabric to create majestic borders on pherans.|A core yarn wrapped in a flattened metallic strip.|Verified",
  "Zari Thread|Zari|Zardozi|A broader term for metallic threads used in heavy embroidery.|Used to create 3D, raised patterns on velvet.|Complex metallic-wrapped yarns.|Verified",
  "Gold-tone Thread|Sone-Tilla|Tilla|Thread that mimics the appearance of pure gold.|Used extensively in modern Tilla work for bridal wear.|Lurex or synthetic polymer wrapped yarn.|Requires Field Validation",
  "Silver-tone Thread|Chandi-Tilla|Tilla|Thread that mimics the appearance of pure silver.|A popular alternative to gold for subtle, elegant ornamentation.|Aluminum or synthetic silver-coated yarn.|Requires Field Validation",
  "Dyed Yarn|Rangi-Dhaaga|Textiles|Yarn that has been processed by a Rangrez.|Provides the color palette for carpets and embroidered shawls.|Yarn treated with mordants and natural/synthetic pigments.|Requires Field Validation",

  // Papier Mâché Materials
  "Paper Pulp|Kagaz-Khamir|Papier Mâché|Mashed, soaked paper mixed with water.|The primary structural material used to form the Sakhta.|A cellulosic slurry.|Verified",
  "Waste Paper|Raddi|Papier Mâché|Recycled paper and old books.|The sustainable base ingredient collected for pulping.|Post-consumer cellulosic fiber.|Verified",
  "Adhesive Paste|Atij|Papier Mâché|A traditional glue made from boiled rice.|Mixed into the paper pulp to provide structural rigidity upon drying.|Starch-based organic binder.|Verified",
  "Chalk / Gesso Base|Safeda|Papier Mâché|A white primer applied over the dried pulp.|Provides a smooth, bright canvas for the Naqash to paint on.|Calcium carbonate or lead white mixed with binder.|Verified",
  "Lacquer|Rogan|Papier Mâché|A clear protective coating applied over the final painting.|Seals the water-based colors and provides a durable, glossy finish.|A solvent-based transparent resin.|Verified",
  "Varnish|Polish|Papier Mâché|A modern alternative or supplement to traditional lacquer.|Used to protect the papier-mâché object from moisture.|A synthetic or natural clear topcoat.|Requires Field Validation",
  "Gold Leaf|Sone-Warq|Papier Mâché|Extremely thin sheets of real gold.|Applied during the Naqashi phase to create luminous, illuminated backgrounds.|Aurum pounded to micro-thickness.|Verified",
  "Paint Pigments|Rang|Papier Mâché|The colors used to paint the intricate motifs.|Historically derived from stones and plants; now often synthetic watercolors or poster paints.|Aqueous dispersions of colored powders.|Requires Field Validation",

  // Wood Materials
  "Walnut Wood|Akhrot|Walnut Wood Carving|The dense, dark wood of the Juglans regia tree.|The exclusive and highly prized timber used for Kashmiri carving.|A premium hardwood known for its close grain.|Verified",
  "Seasoned Walnut Timber|Khushk Akhrot|Walnut Wood Carving|Walnut wood that has been air-dried for several years.|Essential to prevent the final carved piece from warping or cracking.|Wood with a stabilized equilibrium moisture content.|Verified",
  "Carving Block|Lath|Walnut Wood Carving|A solid, prepared piece of wood ready for the chisel.|The raw canvas for the wood carver.|A dimensioned timber blank.|Requires Field Validation",
  "Veneer|Sunmica / Veneer|Woodwork|A very thin slice of wood glued to a cheaper core.|Frowned upon in traditional Kashmiri carving, but used in commercial replicas.|A decorative wood overlay.|Trade Usage",
  "Wood Polish|Polish|Woodwork|Chemical or natural compounds used to shine wood.|Applied as the final step to enhance the wood grain.|A surface finishing abrasive/chemical.|Requires Field Validation",
  "Wax|Mom|Woodwork|Natural beeswax applied to finished carving.|Provides a soft, matte sheen and protects the wood pores.|An organic hydrophobic sealant.|Requires Field Validation",
  "Natural Oil|Tel|Woodwork|Linseed or walnut oil rubbed into the wood.|Deepens the color and prevents the timber from drying out and splitting.|A penetrating wood finish.|Verified",
  "Wood Stain|Rang|Woodwork|Dye applied to lighten or darken wood.|Sometimes used to uniform the color of varying walnut planks.|A penetrating pigment solution.|Requires Field Validation",

  // Metal Materials
  "Copper Sheet|Traam|Copperware|Flat sheets of raw copper.|The starting material hammered into pots, trays, and samovars.|Elemental copper (Cu) in sheet form.|Verified",
  "Silver Sheet|Chandi|Silverware|Flat sheets of sterling or pure silver.|Used by Sonars to create luxury bowls and jewelry.|Elemental silver (Ag).|Verified",
  "Brass|Peetal|Metalwork|An alloy of copper and zinc.|Often used for cast handles (Dasteh) or cheaper engraved items.|A malleable, golden-colored metal alloy.|Verified",
  "Tin Lining|Kalai|Copperware|Molten tin wiped onto the inside of copper pots.|Prevents acidic foods from reacting with the toxic copper.|A protective metallic coating (Sn).|Verified",
  "Solder|Tanka|Metalwork|A low-melting alloy used to join metal pieces.|Used to attach spouts and handles to samovars.|A fusible metal alloy.|Requires Field Validation",
  "Metal Wire|Taar|Silverware / Copperware|Thin strands of copper or silver.|Used in filigree work or as a structural rim inside vessels.|Drawn metal filament.|Requires Field Validation",
  "Polishing Compound|Masala|Copperware|Abrasive pastes used to shine the metal.|Applied by the Roshangar to achieve a mirror finish.|A chemical/mineral abrasive matrix.|Requires Field Validation",

  // Carpet / Namda / Gabba Materials
  "Wool Pile|Oon-Pile|Carpets|The upright tufts of yarn that form the carpet surface.|Knotted meticulously to create the pattern and provide softness.|Cut staple yarn extending from the foundation.|Requires Field Validation",
  "Silk Pile|Resham-Pile|Carpets|Pile made entirely of silk.|Creates the most expensive, dense, and luminous Kashmiri carpets.|Cut continuous filament yarn.|Verified",
  "Cotton Warp|Soot-Tana|Carpets|The structural longitudinal threads made of strong cotton.|Provides the rigid framework necessary to hold thousands of heavy knots.|High-tension cellulose yarn.|Verified",
  "Wool Warp|Oon-Tana|Carpets|Warp threads made of wool.|Used in older or tribal-style carpets; less common in modern fine Kashmiri Qaleens.|Elastic, tension-bearing staple yarn.|Historical / Archival",
  "Cotton Weft|Soot-Bana|Carpets|The transverse threads inserted between rows of knots.|Locks the knots in place and stabilizes the carpet structure.|Structural filling yarn.|Verified",
  "Wool Weft|Oon-Bana|Carpets|Weft threads made of wool.|Used in Namdas, Gabbas, and occasionally rustic carpets.|Staple filling yarn.|Requires Field Validation",
  "Felted Wool|Namda|Namda / Gabba|Wool that has been matted together using moisture and pressure.|The base material for traditional floor rugs.|Non-woven consolidated keratin fibers.|Verified",
  "Dyed Wool|Rangi-Oon|Carpets / Namda|Wool colored specifically for the design.|Pre-dyed before it ever reaches the weaver or embroiderer.|Pigmented staple fiber.|Requires Field Validation"
];

export const materialsData = parseMaterials(rawMaterials);
