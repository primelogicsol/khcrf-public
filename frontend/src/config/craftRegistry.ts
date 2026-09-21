export interface CraftEntry {
  craftId: string;
  category: string;
  englishName: string;
  localName?: string;
  urduName?: string;
  giStatus: boolean;
  active: boolean;
}

export const CRAFT_REGISTRY: CraftEntry[] = [
  // Textiles
  { craftId: 'CR001', category: 'Textiles', englishName: 'Pashmina Spinning', giStatus: true, active: true },
  { craftId: 'CR002', category: 'Textiles', englishName: 'Pashmina Weaving', giStatus: true, active: true },
  { craftId: 'CR003', category: 'Textiles', englishName: 'Kani Weaving', giStatus: true, active: true },
  { craftId: 'CR004', category: 'Textiles', englishName: 'Raffal Weaving', giStatus: false, active: true },
  { craftId: 'CR005', category: 'Textiles', englishName: 'Tweed Weaving', giStatus: false, active: true },
  { craftId: 'CR006', category: 'Textiles', englishName: 'Gabba Making', giStatus: false, active: true },
  { craftId: 'CR007', category: 'Textiles', englishName: 'Namda Making', giStatus: true, active: true },
  { craftId: 'CR008', category: 'Textiles', englishName: 'Chain Stitch', giStatus: false, active: true },
  { craftId: 'CR009', category: 'Textiles', englishName: 'Crewel Embroidery', giStatus: false, active: true },
  { craftId: 'CR010', category: 'Textiles', englishName: 'Sozni Embroidery', giStatus: true, active: true },
  { craftId: 'CR011', category: 'Textiles', englishName: 'Aari Embroidery', giStatus: false, active: true },
  { craftId: 'CR012', category: 'Textiles', englishName: 'Tilla Embroidery', giStatus: false, active: true },
  { craftId: 'CR013', category: 'Textiles', englishName: 'Crochet', giStatus: false, active: true },
  { craftId: 'CR014', category: 'Textiles', englishName: 'Hand Knitting', giStatus: false, active: true },
  { craftId: 'CR015', category: 'Textiles', englishName: 'Carpet Weaving', giStatus: true, active: true },
  { craftId: 'CR016', category: 'Textiles', englishName: 'Kilim Weaving', giStatus: false, active: true },
  { craftId: 'CR017', category: 'Textiles', englishName: 'Cotton Handloom', giStatus: false, active: true },
  { craftId: 'CR018', category: 'Textiles', englishName: 'Silk Weaving', giStatus: false, active: true },

  // Wood Crafts
  { craftId: 'CR019', category: 'Wood Crafts', englishName: 'Walnut Wood Carving', giStatus: true, active: true },
  { craftId: 'CR020', category: 'Wood Crafts', englishName: 'Walnut Furniture', giStatus: false, active: true },
  { craftId: 'CR021', category: 'Wood Crafts', englishName: 'Willow Wicker', giStatus: false, active: true },
  { craftId: 'CR022', category: 'Wood Crafts', englishName: 'Cricket Bat Making', giStatus: false, active: true },
  { craftId: 'CR023', category: 'Wood Crafts', englishName: 'Wood Turning', giStatus: false, active: true },
  { craftId: 'CR024', category: 'Wood Crafts', englishName: 'Lattice Work', giStatus: false, active: true },
  { craftId: 'CR025', category: 'Wood Crafts', englishName: 'Joinery', giStatus: false, active: true },

  // Metal Crafts
  { craftId: 'CR026', category: 'Metal Crafts', englishName: 'Copperware', giStatus: true, active: true },
  { craftId: 'CR027', category: 'Metal Crafts', englishName: 'Silverware', giStatus: false, active: true },
  { craftId: 'CR028', category: 'Metal Crafts', englishName: 'Brassware', giStatus: false, active: true },
  { craftId: 'CR029', category: 'Metal Crafts', englishName: 'Metal Engraving', giStatus: false, active: true },
  { craftId: 'CR030', category: 'Metal Crafts', englishName: 'Repoussé', giStatus: false, active: true },
  { craftId: 'CR031', category: 'Metal Crafts', englishName: 'Bidri Style Work', giStatus: false, active: true },

  // Decorative Arts
  { craftId: 'CR032', category: 'Decorative Arts', englishName: 'Papier-Mâché', giStatus: true, active: true },
  { craftId: 'CR033', category: 'Decorative Arts', englishName: 'Naqashi', giStatus: false, active: true },
  { craftId: 'CR034', category: 'Decorative Arts', englishName: 'Khatamband', giStatus: true, active: true },
  { craftId: 'CR035', category: 'Decorative Arts', englishName: 'Pinjrakari', giStatus: false, active: true },
  { craftId: 'CR036', category: 'Decorative Arts', englishName: 'Stucco Work', giStatus: false, active: true },
  { craftId: 'CR037', category: 'Decorative Arts', englishName: 'Fresco Decoration', giStatus: false, active: true },

  // Stone & Earth
  { craftId: 'CR038', category: 'Stone & Earth', englishName: 'Stone Carving', giStatus: false, active: true },
  { craftId: 'CR039', category: 'Stone & Earth', englishName: 'Brick Craft', giStatus: false, active: true },
  { craftId: 'CR040', category: 'Stone & Earth', englishName: 'Lime Plaster Heritage Work', giStatus: false, active: true },
  { craftId: 'CR041', category: 'Stone & Earth', englishName: 'Tile Work', giStatus: false, active: true },

  // Leather & Felt
  { craftId: 'CR042', category: 'Leather & Felt', englishName: 'Leather Craft', giStatus: false, active: true },
  { craftId: 'CR043', category: 'Leather & Felt', englishName: 'Saddle Making', giStatus: false, active: true },
  { craftId: 'CR044', category: 'Leather & Felt', englishName: 'Traditional Footwear', giStatus: false, active: true },
  { craftId: 'CR045', category: 'Leather & Felt', englishName: 'Fur Craft', giStatus: false, active: true },

  // Natural Fibre
  { craftId: 'CR046', category: 'Natural Fibre', englishName: 'Willow Weaving', giStatus: false, active: true },
  { craftId: 'CR047', category: 'Natural Fibre', englishName: 'Reed Craft', giStatus: false, active: true },
  { craftId: 'CR048', category: 'Natural Fibre', englishName: 'Bamboo Craft', giStatus: false, active: true },
  { craftId: 'CR049', category: 'Natural Fibre', englishName: 'Grass Weaving', giStatus: false, active: true },

  // Jewelry
  { craftId: 'CR050', category: 'Jewelry', englishName: 'Traditional Jewelry', giStatus: false, active: true },
  { craftId: 'CR051', category: 'Jewelry', englishName: 'Silver Filigree', giStatus: false, active: true },
  { craftId: 'CR052', category: 'Jewelry', englishName: 'Goldsmith', giStatus: false, active: true },
  { craftId: 'CR053', category: 'Jewelry', englishName: 'Beadwork', giStatus: false, active: true },

  // Musical Instrument Making
  { craftId: 'CR054', category: 'Musical Instrument Making', englishName: 'Santoor Making', giStatus: false, active: true },
  { craftId: 'CR055', category: 'Musical Instrument Making', englishName: 'Rabab Making', giStatus: false, active: true },
  { craftId: 'CR056', category: 'Musical Instrument Making', englishName: 'Sarangi Making', giStatus: false, active: true },
  { craftId: 'CR057', category: 'Musical Instrument Making', englishName: 'Other Traditional Instrument Making', giStatus: false, active: true },

  // Paper & Writing
  { craftId: 'CR058', category: 'Paper & Writing', englishName: 'Calligraphy', giStatus: false, active: true },
  { craftId: 'CR059', category: 'Paper & Writing', englishName: 'Manuscript Conservation', giStatus: false, active: true },
  { craftId: 'CR060', category: 'Paper & Writing', englishName: 'Book Binding', giStatus: false, active: true },
  { craftId: 'CR061', category: 'Paper & Writing', englishName: 'Handmade Paper', giStatus: false, active: true },

  // Traditional Foods
  { craftId: 'CR062', category: 'Traditional Foods', englishName: 'Saffron Processing', giStatus: true, active: true },
  { craftId: 'CR063', category: 'Traditional Foods', englishName: 'Traditional Bakery', giStatus: false, active: true },
  { craftId: 'CR064', category: 'Traditional Foods', englishName: 'Dry Fruit Processing', giStatus: false, active: true },
  { craftId: 'CR065', category: 'Traditional Foods', englishName: 'Wazwaan Culinary Heritage', giStatus: false, active: true },

  // Miscellaneous
  { craftId: 'CR066', category: 'Miscellaneous', englishName: 'Toy Making', giStatus: false, active: true },
  { craftId: 'CR067', category: 'Miscellaneous', englishName: 'Doll Making', giStatus: false, active: true },
  { craftId: 'CR068', category: 'Miscellaneous', englishName: 'Religious Craft Objects', giStatus: false, active: true },
  { craftId: 'CR069', category: 'Miscellaneous', englishName: 'Heritage Restoration', giStatus: false, active: true },
  { craftId: 'CR070', category: 'Miscellaneous', englishName: 'Mixed Media', giStatus: false, active: true },
  { craftId: 'CR071', category: 'Miscellaneous', englishName: 'Other Traditional Craft', giStatus: false, active: true }
];

export const getCraftsByCategory = () => {
  return CRAFT_REGISTRY.reduce((acc, craft) => {
    if (!acc[craft.category]) acc[craft.category] = [];
    acc[craft.category].push(craft);
    return acc;
  }, {} as Record<string, CraftEntry[]>);
};
