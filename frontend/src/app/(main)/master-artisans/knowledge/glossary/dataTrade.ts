import { GlossaryEntry, GlossaryType, FieldValidationStatus } from './data';

const parseTrade = (dataArray: string[]): GlossaryEntry[] => {
  return dataArray.map(line => {
    const parts = line.split('|');
    return {
      term: parts[0],
      localSpellingVariants: parts[1] || undefined,
      type: 'Trade' as GlossaryType,
      craftCategory: parts[2],
      definition: parts[3],
      traditionalUsage: '',
      technicalMeaning: '',
      relatedTerms: [],
      exampleUsage: '',
      useInTransaction: parts[4],
      relatedDocument: parts[5],
      riskConcern: parts[6],
      relatedCertification: parts[7],
      validationStatus: (parts[8] || 'Requires Field Validation') as FieldValidationStatus,
      sourceType: parts[9] || 'Online Evidence',
    };
  });
};

const rawTrade = [
  // 1-20: Certification & Authentication
  "GI Tag|Geographical Indication|All Crafts|Certification for origin-linked crafts proving they were made in Kashmir using traditional methods.|Guarantees authenticity to buyers and commands premium pricing.|GI Certificate / Secure Seal|Counterfeit labels mimicking GI status|Kashmir Pashmina GI, Kani Shawl GI|Verified|Govt of India GI Registry",
  "Authentication|Tasdeeq|Pashmina / Carpets|Verification of craft identity, material, origin, and process.|Used during appraisal or high-value retail to assure the buyer.|Certificate of Authenticity|Fake certificates issued by unregulated bodies|Pashmina Testing & Quality Certification (PTQCC)|Verified|Trade Usage",
  "Appraisal|Takhmeena|Carpets / Shawls|Estimated value assessment of a craft product based on knot density, age, or material purity.|Determines insurance value, auction reserve, or wholesale base price.|Appraisal Report|Overvaluation by biased intermediaries|ISO Standards|Verified|Trade Usage",
  "Provenance|Asal|All Crafts|Ownership, origin, and production history of the piece.|Critical for antique carpets and shawls sold at auction.|Letter of Provenance|Forged historical ownership documents|Antique Certification|Verified|Trade Usage",
  "Traceability|Pata|All Crafts|Ability to track product origin, maker, material, and production path.|Allows buyers to verify ethical sourcing and artisan compensation.|Supply Chain Log / Blockchain ledger|Broken chain of custody, unverified middlemen|Fair Trade Certification|Verified|Trade Usage",
  "Artisan Card|Pehchaan Card|All Crafts|Government-issued ID proving the maker is a registered artisan.|Used to access subsidies and prove the handmade origin of goods.|Pehchaan ID|Stolen identities or front companies|Ministry of Textiles Registration|Verified|Ministry of Textiles",
  "Product Label|Brand Label|All Crafts|Physical tag identifying the brand, material, and care instructions.|The primary consumer-facing point of information.|Compliance Tag|Misleading claims (e.g., 'Cashmere feel')|Textile Labeling Acts|Verified|Trade Usage",
  "Material Disclosure|Tafseel-e-Mawad|Textiles|Legal requirement to list the exact fiber content percentages.|Ensures buyers know if they are buying pure Pashmina or a silk blend.|Composition Tag|Hidden synthetic blends (e.g., nylon mixed in Pashmina)|Laboratory Testing Certificate|Verified|Trade Usage",
  "Counterfeit|Naqli|Pashmina / Carpets|Fake goods mimicking traditional Kashmir crafts (often machine-made in other states/countries).|A major threat leading to loss of market trust and price undercutting.|Warning Notices|Severe risk to entire regional economy|GI Enforcement|Verified|Trade Usage",
  "Machine-made|Mill-made / Powerloom|Textiles / Carpets|Products woven on automated looms rather than handlooms.|Sold deceptively as handmade to increase margins.|Product Analysis|Deceptive marketing destroying artisan livelihoods|Handloom Mark|Verified|Trade Usage",
  "Origin Claim|Kashmir-Made|All Crafts|Marketing claim stating the product was made geographically in Kashmir.|Used to leverage the historical prestige of Kashmiri crafts.|Origin Tag|Goods made in Amritsar or Ludhiana branded as 'Kashmiri'|Geographical Indication|Verified|Trade Usage",
  "Craftmark|Craftmark|All Crafts|A national certification for authentic Indian handmade craft processes.|Used by ethical retailers to assure buyers of handmade status.|Craftmark License|Unlicensed use of the logo|Craftmark India|Technical Reference|Trade Usage",
  "Handloom Mark|Handloom Mark|Textiles|Government certification that the textile was woven on a manual handloom.|Differentiates from powerloom imitations in wholesale/retail.|Handloom Tag|Forged tags on powerloom goods|Ministry of Textiles|Verified|Ministry of Textiles",
  "Silk Mark|Silk Mark|Carpets / Textiles|Certification ensuring the product uses 100% pure natural silk.|Used in high-end carpet sales to prove pile authenticity.|Silk Mark Tag|Viscose or art-silk sold as pure silk|Silk Board of India|Verified|Silk Board",

  // 21-40: Pricing & Transactions
  "Market Rate|Bazar Bhav|All Crafts|The current standard price for materials or finished goods in the local market.|Baselines negotiations between Karkhandars and buyers.|Daily Rate Sheet|Volatility in raw material (e.g., raw pashm) prices|None|Verified|Trade Usage",
  "Wholesale Rate|Thok Bhav|All Crafts|The discounted price offered for purchasing goods in bulk.|Used in B2B transactions between manufacturers and exporters.|Wholesale Invoice|Undercutting by machine-made bulk goods|None|Verified|Trade Usage",
  "Retail Price|MRP|All Crafts|The final price charged to the consumer.|Includes massive markups by middlemen, often leaving artisans underpaid.|Price Tag|Exorbitant markups hurting the craft's accessibility|Fair Pricing Policies|Verified|Trade Usage",
  "Consignment|Amanat|All Crafts|Goods placed with a seller where payment is only made after the item sells.|Common in retail showrooms carrying high-value carpets or shawls.|Consignment Agreement|Damage to goods or delayed payment|None|Technical Reference|Trade Usage",
  "Invoice|Bill / Challan|All Crafts|Commercial document showing sale details, quantities, and prices.|Essential for taxation, export customs, and accounting.|Commercial Invoice|Under-invoicing to avoid taxes|GST|Verified|Trade Usage",
  "Purchase Order|PO|All Crafts|Formal document from a buyer requesting goods at agreed prices.|Initiates the production cycle in large Karkhanas.|Purchase Order|Cancellation after raw materials are bought|None|Verified|Trade Usage",
  "Buyer Order|Order|All Crafts|A customized request for specific designs, colors, and quantities.|Drives the bespoke export market for Kashmir crafts.|Order Sheet|Miscommunication regarding design specs|None|Verified|Trade Usage",
  "Markup|Munafa|All Crafts|The amount added to the cost price to determine the selling price.|Exporters and luxury retailers often apply 300-500% markups.|Financial Ledger|Disproportionate profit distribution away from artisans|Fair Trade Pricing|Technical Reference|Trade Usage",
  "Commission|Dasturi|All Crafts|Percentage paid to agents, guides, or middlemen for facilitating a sale.|A major issue in tourist retail, inflating prices significantly.|Commission Ledger|Hidden commissions creating distrust|None|Verified|Trade Usage",
  "Piece Rate|Theka|Textiles / Carpets|Payment made per unit of work (e.g., per 1000 knots).|Standard wage structure in Kashmiri craft production.|Tally Sheet|Quality drops due to rushed work|Minimum Wage Laws|Verified|Trade Usage",
  "Fair Trade Pricing|Munsifana Bhav|All Crafts|Pricing structure that ensures a living wage for the primary artisan.|Used by ethical brands to market directly to conscious consumers.|Cost Breakdown|Resistance from traditional middlemen|Fair Trade Certified|Verified|Trade Usage",
  "Customs Duty|Tax|Craft Exports|Taxes levied by international governments on imported crafts.|Affects the final retail price in destination countries.|Customs Declaration|Incorrect HS codes leading to penalties|None|Verified|Trade Usage",
  "Raw Material Cost|Kham Mawad Qeemat|All Crafts|The price of unspun pashm, raw silk, copper sheets, or walnut timber.|Fluctuations directly impact the artisan's profit margin.|Material Bill|Hoarding by raw material cartels|None|Verified|Trade Usage",
  "Value Addition|Izafa-e-Qeemat|All Crafts|The increase in value through processing (e.g., embroidering a plain shawl).|The core economic driver of Kashmir's artisan sector.|Appraisal|Undervaluation of extreme skill (e.g., Rez-e-Kari)|None|Technical Reference|Trade Usage",
  "Distributor Margin|Middleman Cut|All Crafts|The profit taken by the aggregator who moves goods from village to city.|Often opaque, leading to artisan exploitation.|Ledger|Monopolistic control of market access|None|Requires Field Validation|Trade Usage",

  // 41-60: Market Structures & Supply Chain
  "Domestic Market|Desi Bazar|All Crafts|Goods sold within India or local Kashmir market channels.|Sustains artisans during global economic downturns.|GST Invoice|Lower price tolerance compared to export|None|Technical Reference|Trade Usage",
  "Wholesale Market|Thok Bazar|All Crafts|Physical or networks where goods are aggregated in bulk.|Located historically in downtown Srinagar (Maharaj Gunj).|Bulk Invoice|Price fixing by cartels|None|Verified|Trade Usage",
  "Retail Showroom|Showroom|All Crafts|Physical stores catering to tourists and local elites.|Provides the aesthetic environment to justify high markups.|Receipt|High overhead costs|None|Verified|Trade Usage",
  "Supply Chain|Silsila-e-Tijarat|All Crafts|Movement from artisan to buyer through production, aggregation, export, and retail.|Highly fragmented and opaque in traditional Kashmir crafts.|Supply Chain Map|Exploitation due to lack of transparency|Fair Trade|Verified|Trade Usage",
  "Craft Cluster|Cluster|All Crafts|Geographic concentration of interconnected artisans and workshops.|Government targets clusters for infrastructure support (e.g., Safa Kadal for copper).|Cluster Map|Lack of modern infrastructure (electricity/water)|MSME Schemes|Verified|Ministry of Textiles",
  "Aggregator|Wani / Middleman|All Crafts|A trader who collects finished goods from disparate rural artisans.|Bridges the gap between village production and urban export.|Ledger|Debt traps for artisans|None|Verified|Trade Usage",
  "Karkhana|Workshop|All Crafts|A localized production unit where multiple artisans work under an Ustad.|The traditional unit of Kashmir craft production.|Registration|Poor working conditions and lighting|Labor Laws|Verified|Trade Usage",
  "Master Artisan Enterprise|Ustad Karkhana|All Crafts|A business owned and run directly by the master craftsman.|Allows artisans to bypass middlemen and retain profits.|Business Registration|Lack of marketing and digital literacy|MSME|Technical Reference|Trade Usage",
  "Cooperative Society|Co-op|All Crafts|A registered group of artisans pooling resources to manufacture and sell.|Provides collective bargaining power and direct market access.|Co-op Registration|Political interference and mismanagement|Co-op Acts|Verified|Trade Usage",
  "Exhibition|Numaish|All Crafts|Government or privately organized events (e.g., Dilli Haat, Surajkund).|Allows rural artisans to sell directly to urban domestic consumers.|Stall Allotment|High travel costs and stall fees|Development Commissioner Handicrafts|Verified|Trade Usage",
  "E-Commerce|Online Retail|All Crafts|Digital sales directly to consumers worldwide.|Disrupting traditional supply chains and empowering young artisans.|Shipping Waybill|High return rates and shipping costs|None|Verified|Trade Usage",
  "Boutique Buyer|Boutique|All Crafts|Small, high-end international retailers seeking bespoke, ethical goods.|Drives demand for custom colors and designs in Pashmina and Crewel.|PO|Strict quality and compliance demands|Fair Trade|Technical Reference|Trade Usage",
  "Sourcing Agent|Buying House|Craft Exports|Local representatives who source goods for international brands.|They handle quality control and export logistics on the ground.|Agency Contract|Taking hidden cuts from both sides|None|Verified|Trade Usage",
  "Tourist Trade|Siyahati Tijarat|All Crafts|Sales made directly to tourists visiting Kashmir.|Highly seasonal and prone to aggressive commission structures.|Retail Bill|Sale of fake goods destroying Kashmir's reputation|None|Verified|Trade Usage",
  "Weavers' Guild|Anjuman-e-Wovur|Textiles|Traditional or modern associations of weavers.|Advocates for minimum wages and standard piece-rates.|Guild Charter|Weakened by fragmented modern supply chains|None|Historical / Archival|Archival",
  "Raw Material Bank|Mawad Bank|All Crafts|Government or co-op initiative providing subsidized raw materials.|Prevents artisans from falling into debt with private suppliers.|Passbook|Stock shortages and bureaucracy|None|Verified|Government Initiative",
  "Common Facility Centre|CFC|All Crafts|Shared infrastructure (e.g., dyeing vats, washing plants) for a cluster.|Reduces capital costs for individual artisans.|Usage Log|Maintenance failures|Ministry of Textiles|Verified|Ministry of Textiles",

  // 61-100: Documentation, Export & Risk
  "HS Code|Harmonized System Code|Craft Exports|International product classification code for customs (e.g., 5102.11 for Cashmere).|Determines the import duties the buyer will pay.|Customs Declaration|Misclassification leading to seizure or penalties|WCO Standard|Verified|Trade Usage",
  "Commercial Invoice|Export Bill|Craft Exports|The official bill of sale used for customs clearance.|Declares the exact value of the exported goods.|Invoice|Under-declaring value to evade duties|Customs Authority|Verified|Trade Usage",
  "Airway Bill|AWB|Craft Exports|Receipt issued by an international airline for goods.|Serves as proof of dispatch for carpets and shawls.|AWB Document|Loss of goods in transit|IATA|Verified|Trade Usage",
  "Bill of Lading|B/L|Craft Exports|Document issued by a carrier for ocean freight (used for heavy carpets/woodwork).|Serves as a title of ownership for the goods.|B/L|Document loss causing demurrage|None|Technical Reference|Trade Usage",
  "Letter of Credit|L/C|Craft Exports|A bank guarantee ensuring the exporter gets paid once shipping docs are presented.|The safest payment method for large wholesale carpet exports.|Bank Guarantee|Complex banking discrepancies|Banking Standards|Technical Reference|Trade Usage",
  "RCMC|Registration-cum-Membership Certificate|Craft Exports|License required to export handicrafts legally from India.|Mandatory for accessing government export benefits.|RCMC|Lapse of membership|EPCH|Verified|Trade Usage",
  "Phytosanitary Certificate|Phyto|Walnut Wood Carving|Document proving raw wood is free of pests and diseases.|Required by strict agricultural importing countries (e.g., Australia, US).|Phyto Certificate|Wood rejected and incinerated at destination port|Plant Quarantine|Verified|Trade Usage",
  "Wildlife Clearance|Wildlife NOC|Pashmina|Certificate proving the wool is not from an endangered species (like Shahtoosh/Tibetan Antelope).|Crucial due to the global ban on Shahtoosh trading.|NOC Document|Seizure of Pashmina suspected to be Shahtoosh|CITES|Verified|CITES",
  "Shahtoosh Ban|Shahtoosh Prohibition|Pashmina|Global ban on the trade of Tibetan Antelope down hair.|Has forced strict testing of all Kashmir fine wool exports.|Testing Report|Accidental blending causing entire shipments to be burned|Wildlife Protection Act|Verified|Wildlife Act",
  "AZO Free Certification|AZO-Free|Textiles / Carpets|Testing proving dyes do not contain banned carcinogenic AZO compounds.|Mandatory for exporting textiles to the European Union.|Lab Report|Rejection of goods at EU borders|REACH Compliance|Verified|Trade Usage",
  "GSP Certificate|Generalized System of Preferences|Craft Exports|Allows Indian handicrafts to enter certain countries duty-free.|Gives Kashmiri exports a competitive pricing edge.|GSP Form A|Changes in international trade policies|UNCTAD|Technical Reference|Trade Usage",
  "Customs Clearance|Clearance|Craft Exports|The process of getting goods through the destination country's borders.|Requires perfect alignment of all export documentation.|Customs Bill of Entry|Unexpected tariffs wiping out profit margins|Customs|Verified|Trade Usage",
  "Freight Forwarder|Cargo Agent|Craft Exports|Logistics company that arranges the shipping of carpets and crafts globally.|Navigates the complex web of airlines, ships, and customs.|Shipping Contract|Hidden handling fees|None|Verified|Trade Usage",
  "Lead Time|Production Time|All Crafts|The total time taken from placing an order to shipping the goods.|In Kashmir, this can be 6-18 months for fine carpets or Kani shawls.|Production Schedule|Delays caused by harsh winters or unrest|None|Verified|Trade Usage",
  "Minimum Order Quantity|MOQ|All Crafts|The smallest number of items a Karkhana will agree to produce.|Protects the workshop from unprofitable micro-orders.|PO Terms|Excludes small boutique buyers|None|Technical Reference|Trade Usage",
  "Intellectual Property|IP Rights|All Crafts|Legal protection over original designs (e.g., a specific Naksha).|Historically weak in Kashmir, allowing widespread design theft.|Copyright Registration|Designs stolen and mass-produced in China or Amritsar|Copyright Act|Technical Reference|Trade Usage",
  "Design Piracy|Naqal|All Crafts|The copying of traditional Kashmiri motifs by mechanized factories globally.|The biggest threat to the survival of the authentic hand-craft sector.|Legal Injunction|Erosion of brand equity for authentic Kashmir|GI Act|Verified|Trade Usage",
  "Social Audit|Social Compliance|All Crafts|An external review ensuring no child labor and safe working conditions.|Required by massive global retailers before sourcing.|Audit Report|Workshops failing structural safety checks|SA8000|Technical Reference|Trade Usage",
  "Artisan Empowerment|Kari-gar Taraqqi|All Crafts|Initiatives (like KHCRF) aimed at giving artisans direct market access and fair pricing.|Shifts the power dynamic from middlemen back to the maker.|Impact Report|Resistance from entrenched middlemen|None|Verified|KHCRF Objectives",
  "Bespoke / Custom|Khusoosi|All Crafts|Made-to-order goods tailored specifically to a high-net-worth client's demands.|The highest margin sector of the craft economy.|Custom PO|High pressure for perfection|None|Verified|Trade Usage",
  "Stock Lot|Ready Stock|All Crafts|Pre-made inventory ready for immediate sale.|Ties up capital but allows for immediate retail sales.|Inventory Ledger|Dead stock tying up workshop finances|None|Verified|Trade Usage",
  "Drop Shipping|Direct Dispatch|All Crafts|Retailer sells goods, but the Karkhana ships directly to the consumer.|Reduces inventory risk for the retailer.|Shipping Label|Quality control issues unseen by the retailer|None|Technical Reference|Trade Usage",
  "Value Chain|Tijarati Silsila|All Crafts|The sequence of activities that add value to the craft (Raw material -> Spun -> Woven -> Embroidered -> Sold).|Each step in Kashmir is highly specialized and fragmented.|Value Chain Analysis|Bottlenecks in specific skills (e.g., lack of spinners)|None|Verified|Trade Usage",
  "Sustainable Practice|Paaidar Tariqa|All Crafts|Environmentally friendly methods (e.g., natural dyes, responsible wood sourcing).|Increasingly demanded by luxury buyers.|Sustainability Report|Toxicity of chemical dyes entering local waterways|GOTS|Verified|Trade Usage",
  "Upcycling|Naya-Saaz|Gabba / Papier Mâché|Creating new value from waste (e.g., Gabba from old blankets, Papier Mâché from waste paper).|Traditional Kashmiri crafts are inherently sustainable.|Product Description|None|None|Verified|Trade Usage",
  "Craft Revival|Ahya-e-Hunar|All Crafts|Efforts to bring back extinct or dying craft techniques (e.g., glazed pottery, specific Kani weaves).|Aims to preserve cultural heritage.|Project Proposal|Lack of market demand for ancient aesthetics|None|Verified|Trade Usage",
  "Heritage Craft|Virasati Hunar|All Crafts|Crafts recognized for their immense historical and cultural significance.|Commands respect and premium pricing globally.|Heritage Designation|Loss of traditional knowledge as youth leave the sector|UNESCO Intangible Heritage|Verified|Trade Usage",
  "Transparency|Shafafiyat|All Crafts|Openness about the supply chain, pricing, and exact materials used.|The modern antidote to the exploitation and counterfeiting in the craft sector.|Transparency Ledger|Middlemen hiding the true makers to retain control|Fair Trade|Verified|Trade Usage",
  "Luxury Market|Shahi Bazar|Carpets / Pashmina|The high-end segment purchasing the finest Silk Carpets and Shah-Tush/Pashmina.|The traditional lifeline for Kashmir's most skilled Ustads.|Boutique Invoice|Extreme sensitivity to economic downturns|None|Verified|Trade Usage",
  "Trade Guild|Tijarati Anjuman|All Crafts|Associations of exporters and merchants who lobby for policies.|Historically powerful in setting market rates and export policies.|Guild Charter|Often prioritizes merchants over grassroots artisans|Chamber of Commerce|Historical / Archival|Archival"
];

export const tradeData = parseTrade(rawTrade);
