import { ResearchTopic } from "@/components/ResearchTopicDetail";

// We can define a type that satisfies both ResearchTopic (for detail page)
// and the needs of the listing page (CampaignsClient)
export interface CampaignData extends ResearchTopic {
  id: string; // Alias for slug to match existing usage if needed, or we just use slug
  heroImage: string; // specific to campaigns listing or hero?
}

export const CAMPAIGN_TOPICS: CampaignData[] = [
  {
    id: "cultural-pride",
    slug: "cultural-pride",
    title: "Cultural Pride & Heritage Restoration",
    shortDescription:
      "Inspiring local and global audiences to recognize and celebrate Kashmir's unique crafts as symbols of identity and pride.",
    objective:
      "To inspire local and global audiences to recognize and celebrate Kashmir's unique crafts as symbols of identity and pride, fostering a renewed appreciation for these crafts among communities, young people, and international enthusiasts.",
    icon: "fa-landmark",
    heroImage: "/assets/images/resources/campaign-1.jpg",
    narrative: `The Kashmir region is not only known for its breathtaking landscapes but also as a cradle of unique cultural craftsmanship. Each craft, whether handwoven Pashmina, intricately carved walnut wood, or delicate papier-mâché, is a window into Kashmir's history, spirituality, and way of life. These crafts have survived centuries, evolving through a blend of local traditions and influences from Central Asia and Persia. However, globalization, economic challenges, and a declining artisan population threaten these crafts with extinction.

The Cultural Pride and Heritage Restoration Campaign aims to renew the bond between Kashmiri people and their traditional crafts by narrating the stories embedded within each piece, crafting a tapestry of heritage that resonates both locally and globally. By connecting communities, schools, and cultural organizations, this campaign will build a collective sense of pride and responsibility to protect and preserve these crafts. It encourages people to view these crafts as cultural treasures that embody resilience and cultural identity rather than merely functional items or decorative objects. Through powerful storytelling, personal testimonies, and creative educational initiatives, the campaign will foster a sense of belonging, continuity, and pride among Kashmiris while extending this appreciation to audiences worldwide.`,
    proposals: [
      {
        title: "Heritage Education Mandate",
        objective: "Integrate craft heritage into the core school curriculum.",
        rationale: [
          {
            title: "Cultural Anchoring",
            description:
              "Ensures the next generation understands their legacy.",
          },
          {
            title: "Awareness",
            description: "Builds respect for the artisan's role in society.",
          },
          {
            title: "Future Interest",
            description: "Sparks early interest in craft-related careers.",
          },
        ],
        legislativeAsk:
          "Mandate craft history modules in state school curricula.",
      },
      {
        title: "National Craft Day",
        objective:
          "Establish an official day to celebrate Kashmiri craftsmanship annually.",
        rationale: [
          {
            title: "Visibility",
            description: "Creates a focused media moment for local crafts.",
          },
          {
            title: "Celebration",
            description: "Public recognition boosts artisan morale.",
          },
          {
            title: "Commerce",
            description: "Events stimulate local sales and tourism.",
          },
        ],
        legislativeAsk:
          "Officially declare a 'Kashmir Heritage Craft Day' with state funding.",
      },
      {
        title: "Heritage Preservation Grants",
        objective:
          "Provide funding for communities to document and restore local craft traditions.",
        rationale: [
          {
            title: "Documentation",
            description: "Archives disappearing techniques and oral histories.",
          },
          {
            title: "Restoration",
            description: "Funds the repair of historical craft artifacts.",
          },
          {
            title: "Community Pride",
            description: "Empowers locals to take ownership of their history.",
          },
        ],
        legislativeAsk:
          "Create a 'Heritage Restoration Fund' for community projects.",
      },
    ],
    strategies: [
      {
        title: "School Edu. Programs",
        objective: "Cultivate cultural pride among future generations.",
        points: [
          {
            title: "Curriculum Modules",
            description: "Partnering with boards to teach craft history.",
          },
          {
            title: "Artisan Visits",
            description: "Bringing masters into classrooms for demos.",
          },
          {
            title: "Student Projects",
            description: "Hands-on miniature craft making competitions.",
          },
        ],
        actionSteps: [
          "Develop curriculum modules",
          "Schedule artisan visits",
          "Launch school competitions",
        ],
      },
      {
        title: "Global Heritage Ambassadors",
        objective: "Position crafts as symbols of pride internationally.",
        points: [
          {
            title: "Ambassador Selection",
            description: "Appointing cultural figures to champion the cause.",
          },
          {
            title: "Workshops",
            description: "Ambassador-led sessions on craft preservation.",
          },
          {
            title: "Media Campaigns",
            description: "Viral hashtags like #CelebrateKashmirCrafts.",
          },
        ],
        actionSteps: [
          "Identify ambassadors",
          "Launch hashtag campaigns",
          "Organize virtual webinars",
        ],
      },
      {
        title: "Public Exhibitions",
        objective: "Connect communities with crafts in public spaces.",
        points: [
          {
            title: "Gallery Displays",
            description: "Museum-quality exhibitions of masterworks.",
          },
          {
            title: "Live Installations",
            description: "Interactive demos in public squares.",
          },
          {
            title: "Virtual Tours",
            description: "360-degree online access to exhibitions.",
          },
        ],
        actionSteps: [
          "Curate gallery exhibitions",
          "Setup interactive displays",
          "Launch virtual tours",
        ],
      },
    ],
    outcomes: [
      {
        title: "Restored Cultural Pride",
        description:
          "A renewed sense of ownership and pride in Kashmiri heritage among locals.",
        points: [
          {
            title: "Community Engagement",
            description: "Increased participation in cultural events.",
          },
          {
            title: "Youth Awareness",
            description:
              "Higher interest in traditional crafts among students.",
          },
        ],
      },
      {
        title: "Global Recognition",
        description:
          "Enhanced international profile for Kashmir's unique craftsmanship.",
        points: [
          {
            title: "International Demand",
            description:
              "Increased export and appreciation of authentic crafts.",
          },
          {
            title: "Cultural Tourism",
            description: "Growth in tourism centered around craft heritage.",
          },
        ],
      },
      {
        title: "Living Heritage",
        description:
          "Crafts integrate back into daily life rather than just museum pieces.",
        points: [
          {
            title: "Daily Use",
            description: "Locals returning to using traditional items.",
          },
          {
            title: "Preservation",
            description: "Active practice of endangered techniques.",
          },
        ],
      },
    ],
    conclusion:
      "The Cultural Pride and Heritage Restoration Campaign is a call to everyone—Kashmiris and global audiences alike—to recognize the value and significance of Kashmiri crafts as symbols of identity and pride. Join us in celebrating and preserving this rich heritage.",
  },
  {
    id: "women-empowerment",
    slug: "women-empowerment",
    title: "The Empowerment of Kashmiri Women Artisans",
    shortDescription:
      "Closing the gender gap in handicrafts by advocating for fair wages and leadership opportunities.",
    objective:
      "To highlight and address the challenges faced by women artisans in Kashmir's handicraft sector and to advocate for initiatives that promote economic and social equity.",
    icon: "fa-person-dress",
    heroImage: "/assets/images/resources/campaign-2.jpg",
    narrative: `Women artisans in Kashmir are the unsung heroes behind some of the region's most intricate and celebrated crafts. From the painstaking detail of Sozni embroidery to the weaving of fine Pashmina shawls, Kashmiri women bring unmatched skill, dedication, and cultural wisdom to the craft sector. These women not only contribute to the local economy but also uphold the legacy of Kashmiri craftsmanship, passed down through generations. Yet, despite their essential role, women artisans often face systemic challenges such as limited access to fair wages, leadership opportunities, financial independence, and market reach.

The Empowerment of Kashmiri Women Artisans Campaign shines a light on these challenges, advocating for an inclusive and equitable environment that allows women artisans to be acknowledged, respected, and compensated fairly for their contributions. Through personal stories, social media campaigns, community workshops, and collaboration with local businesses and international organizations, this campaign aims to build economic resilience, increase visibility, and empower women artisans to take on leadership roles.`,
    proposals: [
      {
        title: "Equal Pay Mandate",
        objective:
          "Enforce equal pay for equal work across the handicraft sector.",
        rationale: [
          {
            title: "Fairness",
            description: "Eliminates gender-based wage discrimination.",
          },
          {
            title: "Economic Power",
            description: "Increases financial independence for women.",
          },
          {
            title: "Motivation",
            description: "Encourages women to stay in the skilled workforce.",
          },
        ],
        legislativeAsk:
          "Pass strict legislation monitoring artisan wages by gender.",
      },
      {
        title: "Women's Leadership Quota",
        objective:
          "Ensure women are represented in cooperative decision-making bodies.",
        rationale: [
          {
            title: "Representation",
            description: "Gives women a voice in shaping industry policy.",
          },
          {
            title: "Role Models",
            description: "Inspires younger women to aspire to leadership.",
          },
          {
            title: "Equity",
            description: "Balances power dynamics in traditional structures.",
          },
        ],
        legislativeAsk:
          "Mandate 30% female representation in registered cooperative boards.",
      },
      {
        title: "Workplace Safety Act",
        objective:
          "Establish standards for safe and dignified workspaces for women.",
        rationale: [
          {
            title: "Health",
            description: "Protects women from hazardous working conditions.",
          },
          {
            title: "Dignity",
            description: "Ensures freedom from harassment and exploitation.",
          },
          {
            title: "Productivity",
            description: "Safe environments lead to better quality work.",
          },
        ],
        legislativeAsk:
          "Enact specific safety codes for home-based and unit-based female artisans.",
      },
    ],
    strategies: [
      {
        title: "Fair Wage Certification",
        objective: "Guarantee fair compensation and recognition.",
        points: [
          {
            title: "Standards Creation",
            description: "Developing clear wage benchmarks with NGOs.",
          },
          {
            title: "Financial Literacy",
            description: "Training on contracts and negotiation skills.",
          },
          {
            title: "Incentives",
            description: "Supporting businesses that pay fair wages.",
          },
        ],
        actionSteps: [
          "Develop certification standards",
          "Conduct financial workshops",
          "Launch awareness campaign",
        ],
      },
      {
        title: "Leadership Mentorship",
        objective: "Create pathways for women to lead.",
        points: [
          {
            title: "Mentorship Circles",
            description: "Connecting artisans with experienced leaders.",
          },
          {
            title: "Skill Training",
            description: "Workshops on management and decision making.",
          },
          {
            title: "Cooperative Training",
            description: "Guidance on running women-led cooperatives.",
          },
        ],
        actionSteps: [
          "Form mentorship circles",
          "Organize leadership workshops",
          "Facilitate exchange programs",
        ],
      },
      {
        title: "Market Access Support",
        objective: "Provide tools to reach broader audiences directly.",
        points: [
          {
            title: "Digital Training",
            description: "Teaching online sales and social marketing.",
          },
          {
            title: "Ethical Partners",
            description: "Connecting with fair-trade retailers.",
          },
          {
            title: "Trade Fairs",
            description: "Sponsoring women's booths at major events.",
          },
        ],
        actionSteps: [
          "Run digital marketing courses",
          "Establish retail partnerships",
          "Secure fair booths",
        ],
      },
    ],
    outcomes: [
      {
        title: "Economic Independence",
        description:
          "Increased financial security and independence for women artisans.",
        points: [
          {
            title: "Fair Wages",
            description: "Standardized fair payment for work.",
          },
          {
            title: "Market Reach",
            description: "Direct access to global markets.",
          },
        ],
      },
      {
        title: "Leadership Representation",
        description:
          "More women in leadership positions within cooperatives and businesses.",
        points: [
          {
            title: "Cooperative Leaders",
            description: "Rise in women-led cooperatives.",
          },
          {
            title: "Policy Voices",
            description: "Women actively shaping craft policy.",
          },
        ],
      },
      {
        title: "Social Transformation",
        description:
          "A shift in societal perception regarding women's roles in the economy.",
        points: [
          {
            title: "Respect",
            description: "Women viewed as key economic drivers.",
          },
          {
            title: "Empowerment",
            description: "Greater agency in household and community decisions.",
          },
        ],
      },
    ],
    conclusion:
      "The Empowerment of Kashmiri Women Artisans Campaign is a transformative initiative that seeks to address gender inequality... These women are not only skilled craftswomen but also bearers of a rich cultural legacy.",
  },
  {
    id: "environmental-sustainability",
    slug: "environmental-sustainability",
    title: "Environmental Sustainability in Handicrafts",
    shortDescription:
      "Embedding responsible material use, low-impact production methods, and ecological accountability to align traditional crafts with modern sustainability expectations.",
    objective:
      "To advocate for sustainable production practices in Kashmir's handicraft sector, prioritizing eco-friendly methods.",
    icon: "fa-leaf",
    heroImage: "/assets/images/resources/campaign-3.jpg",
    narrative: `Kashmir's handicraft sector is a symbol of cultural pride and economic strength, yet its environmental footprint poses serious challenges. As global demand grows, so does the impact of raw material extraction, pollution, and waste. Historically, Kashmiri artisans used natural dyes and organic materials, but mass production has introduced harmful chemicals and unsustainable sourcing.

The Environmental Sustainability in Handicrafts Campaign seeks to bridge the gap between tradition and sustainable innovation. Through awareness campaigns, partnerships, and sustainable sourcing initiatives, we aim to revitalize the use of natural materials, reduce pollution, and empower artisans to adopt practices that honor the environment.`,
    proposals: [
      {
        title: "Eco-Material Subsidies",
        objective:
          "Make sustainable raw materials affordable for all artisans.",
        rationale: [
          {
            title: "Cost Parity",
            description: "Reduces the price gap between synthetic and natural.",
          },
          {
            title: "Adoption",
            description: "Incentivizes the switch to organic wool and dyes.",
          },
          {
            title: "Sustainability",
            description:
              "Reduces reliance on environmentally taxing resources.",
          },
        ],
        legislativeAsk:
          "Allocate subsidies forcertified organic raw materials.",
      },
      {
        title: "Waste Management Rules",
        objective: "Standardize waste disposal for craft industries.",
        rationale: [
          {
            title: "Clean Water",
            description: "Prevents dye runoff into Kashmir's rivers.",
          },
          {
            title: "Hygiene",
            description: "Keeps artisan clusters clean and safe.",
          },
          {
            title: "Recycling",
            description: "Encourages repurposing of textile scraps.",
          },
        ],
        legislativeAsk:
          "Enforce strict waste treatment protocols for dyeing units.",
      },
      {
        title: "Forest Protection Act",
        objective:
          "Regulate the harvesting of wood for crafts like walnut carving.",
        rationale: [
          {
            title: "Conservation",
            description: "Prevents deforestation of endangered species.",
          },
          {
            title: "regeneration",
            description: "Mandates replanting for every tree harvested.",
          },
          {
            title: "Certification",
            description: "Ensures wood is legally and ethically sourced.",
          },
        ],
        legislativeAsk:
          "Amend forestry laws to include specific craft-wood protections.",
      },
    ],
    strategies: [
      {
        title: "Eco-Certification Labeling",
        objective: "Distinguish products made with sustainable methods.",
        points: [
          {
            title: "Green Standards",
            description: "Defining criteria for eco-friendly production.",
          },
          {
            title: "Training",
            description: "Workshops on meeting green certification norms.",
          },
          {
            title: "Labeling",
            description: "Visual tags to guide eco-conscious buyers.",
          },
        ],
        actionSteps: [
          "Draft eco-standards",
          "Certify first batch of products",
          "Launch green label",
        ],
      },
      {
        title: "Conservation Partnerships",
        objective: "Leverage expertise for resource management.",
        points: [
          {
            title: "Reforestation",
            description: "Planting walnut trees for future generations.",
          },
          {
            title: "Sustainable Harvest",
            description: "Teaching responsible material collection.",
          },
          {
            title: "Clean Tech",
            description: "Introducing solar-powered tools and looms.",
          },
        ],
        actionSteps: [
          "Plant walnut trees",
          "Install solar looms",
          "Partner with conservation NGOs",
        ],
      },
      {
        title: "Revive Eco-Practices",
        objective: "Return to inherent eco-friendly traditional techniques.",
        points: [
          {
            title: "Natural Dyes",
            description: "Promoting indigo, madder, and pomegranate dyes.",
          },
          {
            title: "Waste Reduction",
            description: "Creative upcycling of production scraps.",
          },
          {
            title: "Eco-Packaging",
            description: "Shifting to plastic-free biodegradable packaging.",
          },
        ],
        actionSteps: [
          "Host natural dye workshops",
          "Implement waste reduction protocols",
          "Switch to eco-packaging",
        ],
      },
    ],
    outcomes: [
      {
        title: "Reduced Environmental Footprint",
        description: "Lower pollution and waste from craft production.",
        points: [
          {
            title: "Chemical Reduction",
            description: "Decreased use of synthetic chemicals.",
          },
          {
            title: "Resource Recovery",
            description: "Better management of waste materials.",
          },
        ],
      },
      {
        title: "Sustainable Industry",
        description: "Long-term viability of raw material sources.",
        points: [
          {
            title: "Material Security",
            description: "Stablized supply of natural materials.",
          },
          {
            title: "Market Edge",
            description: "Competitive advantage in ethical markets.",
          },
        ],
      },
      {
        title: "Global Eco-Standards",
        description:
          "Kashmir crafts meet international environmental compliance norms.",
        points: [
          {
            title: "Export Readiness",
            description: "Products qualify for strict green markets.",
          },
          {
            title: "Brand Image",
            description: "Kashmir recognized as a responsible producer.",
          },
        ],
      },
    ],
    conclusion:
      "The Environmental Sustainability in Handicrafts Campaign is a movement to honor Kashmir's cultural heritage and protect the natural resources that have sustained it for centuries.",
  },
  {
    id: "artisan-health",
    slug: "artisan-health",
    title: "Artisan Health and Safety Standards",
    shortDescription:
      "Establishing safe working conditions, ergonomic practices, and occupational protections to safeguard artisan wellbeing across production environments.",
    objective:
      "To improve health and safety conditions for artisans in Kashmir, focusing on safer environments and healthcare access.",
    icon: "fa-helmet-safety",
    heroImage: "/assets/images/resources/campaign-4.jpg",
    narrative: `Kashmir's artisans are the backbone of the region's cultural heritage. However, behind each handcrafted item is an artisan who often endures unsafe working conditions and health risks. Prolonged hours, dust inhalation, and chemical exposure lead to chronic issues like respiratory illnesses and musculoskeletal disorders.

The Artisan Health and Safety Campaign brings attention to these challenges and advocates for a safer, more supportive environment. By partnering with healthcare providers and policymakers, we seek to implement health standards, provide protective equipment, and offer ergonomic training, ensuring artisans can practice their craft with dignity and security.`,
    proposals: [
      {
        title: "Occupational Safety Act",
        objective:
          "Legislative framework for compulsory safety standards in workshops.",
        rationale: [
          {
            title: "Legal Safety",
            description: "Makes safety gear mandatory by law.",
          },
          {
            title: "Inspections",
            description: "Allows for regular health and safety audits.",
          },
          {
            title: "Accountability",
            description: "Holds workshop owners responsible for conditions.",
          },
        ],
        legislativeAsk: "Pass the 'Artisan Occupational Health & Safety Act'.",
      },
      {
        title: "Healthcare Access Bill",
        objective:
          "Ensure every artisan has access to affordable specialized healthcare.",
        rationale: [
          {
            title: "Access",
            description: "Subsidized checkups for occupational ailments.",
          },
          {
            title: "Insurance",
            description: "State-sponsored health coverage for families.",
          },
          {
            title: "Prevention",
            description: "Early detection of respiratory issues.",
          },
        ],
        legislativeAsk:
          "Include artisans in the priority list for state health schemes.",
      },
      {
        title: "Hazardous Material Control",
        objective: "Regulate the sale and use of toxic chemicals in crafts.",
        rationale: [
          {
            title: "Exposure",
            description: "Limits access to dangerous industrial dyes.",
          },
          {
            title: "Training",
            description: "Mandatory training for handling chemicals.",
          },
          {
            title: "Alternatives",
            description: "Promotes safer, non-toxic alternatives.",
          },
        ],
        legislativeAsk:
          "Strictly regulate the supply chain of toxic craft chemicals.",
      },
    ],
    strategies: [
      {
        title: "Mobile Health Clinics",
        objective: "Bring accessible healthcare directly to communities.",
        points: [
          {
            title: "Medical Units",
            description: "Vans equipped with essential medical supplies.",
          },
          {
            title: "Screenings",
            description: "Regular checks for eyes, lungs, and joints.",
          },
          {
            title: "Education",
            description: "Sessions on preventive care and hygiene.",
          },
        ],
        actionSteps: [
          "Deploy mobile clinics",
          "Conduct health screenings",
          "Distribute health pamphlets",
        ],
      },
      {
        title: "Ergonomics & Safety",
        objective: "Prevent chronic pain and long-term injuries.",
        points: [
          {
            title: "Training",
            description: "Workshops on posture and stretching exercises.",
          },
          {
            title: "Workstations",
            description: "Retrofitted seats and lights for comfort.",
          },
          {
            title: "Safe Handling",
            description: "Best practices for using tools and dyes.",
          },
        ],
        actionSteps: [
          "Run ergonomic workshops",
          "Retrofit workstations",
          "Publish safety guidelines",
        ],
      },
      {
        title: "Protective Equipment",
        objective: "Provide essential gear to every artisan.",
        points: [
          {
            title: "Distribution",
            description: "Supplying masks, gloves, and safety goggles.",
          },
          {
            title: "Subsidies",
            description: "Making safety equipment affordable for all.",
          },
          {
            title: "Custom Kits",
            description: "Safety packs tailored to specific craft risks.",
          },
        ],
        actionSteps: [
          "Distribute safety kits",
          "Establish subsidy program",
          "Train on PPE use",
        ],
      },
    ],
    outcomes: [
      {
        title: "Improved Artisan Health",
        description: "Reduction in occupational illnesses and injuries.",
        points: [
          {
            title: "Health Metrics",
            description: "Lower incidence of respiratory and muscle issues.",
          },
          {
            title: "Productivity",
            description: "Fewer workdays lost to illness.",
          },
        ],
      },
      {
        title: "Dignified Work",
        description: "Safer and more professional working environments.",
        points: [
          {
            title: "Safety Standards",
            description: "Widespread adoption of safety protocols.",
          },
          {
            title: "Well-being",
            description: "Enhanced physical and mental well-being.",
          },
        ],
      },
      {
        title: "Career Longevity",
        description: "Artisans actice for longer without debilitating injury.",
        points: [
          {
            title: "Experience",
            description: "Masters can teach for more years.",
          },
          {
            title: "Stability",
            description: "Families rely on longer earning periods.",
          },
        ],
      },
    ],
    conclusion:
      "The Artisan Health and Safety Campaign is an urgent call to protect the health and well-being of the hands that create Kashmir's most treasured crafts.",
  },
  {
    id: "economic-resilience",
    slug: "economic-resilience",
    title: "Economic Resilience and Fair Trade",
    shortDescription:
      "Strengthening artisan livelihoods through fair pricing, transparent trade systems, and market structures that reduce volatility and long-term vulnerability.",
    objective:
      "To strengthen economic resilience by promoting fair trade, financial security, and direct market access.",
    icon: "fa-hand-holding-dollar",
    heroImage: "/assets/images/resources/campaign-5.jpg",
    narrative: `Artisans in Kashmir often face economic hardships, earning only a fraction of the value their work brings to the market due to intermediaries and low bargaining power.

The Economic Resilience and Fair Trade Campaign seeks to address these challenges by promoting fair trade practices, improving artisans' economic resilience, and creating direct-to-consumer pathways. By advocating for fair wages, empowering artisans with financial literacy, and connecting them to ethical buyers, we strive to create a sustainable market that values Kashmir's crafts and the artisans who make them.`,
    proposals: [
      {
        title: "Fair Trade Legislation",
        objective: "Embed fair trade principles into state craft policy.",
        rationale: [
          {
            title: "Justice",
            description: "Ensures legally mandated fair revenue share.",
          },
          {
            title: "Transparency",
            description: "Mandates clear pricing breakdowns for buyers.",
          },
          {
            title: "Ethics",
            description: "Aligns state policy with global ethical standards.",
          },
        ],
        legislativeAsk: "Adopt the 'Kashmir Fair Trade Charter' into law.",
      },
      {
        title: "Direct Export Policy",
        objective: "Simplify the process for artisans to export directly.",
        rationale: [
          {
            title: "Profits",
            description: "Removes middlemen, keeping revenue with artisans.",
          },
          {
            title: "Efficiency",
            description: "Reduces red tape in small-volume exports.",
          },
          {
            title: "Access",
            description: "Opens global markets to small-scale producers.",
          },
        ],
        legislativeAsk:
          "Create a simplified 'Artisan Export License' category.",
      },
      {
        title: "Cooperative Tax Exemption",
        objective: "Relieve financial burden on artisan-owned cooperatives.",
        rationale: [
          {
            title: "Growth",
            description: "Allows reinvestment of profits into the business.",
          },
          {
            title: "competitiveness",
            description: "Helps cooperatives compete with private traders.",
          },
          {
            title: "Support",
            description: "State support for the cooperative model.",
          },
        ],
        legislativeAsk:
          "Grant 5-year tax holidays for registered artisan cooperatives.",
      },
    ],
    strategies: [
      {
        title: "Direct-to-Consumer Platforms",
        objective: "Reduce dependency on traditional intermediaries.",
        points: [
          {
            title: "E-Commerce",
            description: "User-friendly artisan portals for selling.",
          },
          {
            title: "Digital Training",
            description: "Teaching management of online orders.",
          },
          {
            title: "Collaborations",
            description: "Expanding reach through marketplace partners.",
          },
        ],
        actionSteps: [
          "Launch artisan portal",
          "Train on e-commerce tools",
          "Sign marketplace MOUs",
        ],
      },
      {
        title: "Fair Trade Certification",
        objective: "Ensure fair wages and ethical treatment.",
        points: [
          {
            title: "Standards",
            description: "Defining criteria for fair wage safety.",
          },
          {
            title: "Support",
            description: "Helping groups meet certification needs.",
          },
          {
            title: "Marketing",
            description: "Promoting the certified fair trade label.",
          },
        ],
        actionSteps: [
          "Define fair trade criteria",
          "Certify pilot group",
          "Promote certified label",
        ],
      },
      {
        title: "Financial Literacy",
        objective: "Build long-term financial resilience.",
        points: [
          {
            title: "Workshops",
            description: "Training on budgeting and investing.",
          },
          {
            title: "Microloans",
            description: "Access to low-interest capital for materials.",
          },
          {
            title: "Savings Groups",
            description: "Community savings plans for emergencies.",
          },
        ],
        actionSteps: [
          "Conduct finance workshops",
          "Disburse microloans",
          "Form savings groups",
        ],
      },
    ],
    outcomes: [
      {
        title: "Increased Income",
        description: "Higher share of profits reaching the artisans.",
        points: [
          {
            title: "Direct Sales",
            description: "Growth in direct-to-consumer revenue.",
          },
          {
            title: "Wage Security",
            description: "Stable and fair income levels.",
          },
        ],
      },
      {
        title: "Market Empowerment",
        description: "Reduced reliance on exploitative intermediaries.",
        points: [
          {
            title: "Bargaining Power",
            description: "Stronger negotiation position for artisans.",
          },
          {
            title: "Global Reach",
            description: "Access to international customer base.",
          },
        ],
      },
      {
        title: "Community Reinvestment",
        description: "Wealth generated stays within the artisan communities.",
        points: [
          {
            title: "Development",
            description: "Funds spent on local education and health.",
          },
          {
            title: "Cycle of Growth",
            description: "Prosperity fuels further craft investment.",
          },
        ],
      },
    ],
    conclusion:
      "The Economic Resilience and Fair Trade Campaign is a call to action... Join us in building an ecosystem where fair trade supports the hands that create.",
  },
  {
    id: "youth-engagement",
    slug: "youth-engagement",
    title: "Youth Engagement and Skill Transfer",
    shortDescription:
      "Encouraging intergenerational continuity by supporting training, mentorship, and innovation pathways that attract youth into sustainable craft careers.",
    objective:
      "To inspire and equip young Kashmiris with skills and opportunities to carry forward traditional crafts.",
    icon: "fa-users",
    heroImage: "/assets/images/resources/campaign-6.jpg",
    narrative: `The crafts of Kashmir are a heritage forged over centuries. Yet, today, the continuity of this legacy faces a serious challenge as young people seek careers elsewhere, leaving the sector to an aging population.

The Youth Engagement and Skill Transfer Campaign aims to address this challenge by making traditional crafts a viable, respected, and fulfilling career choice for young Kashmiris. Through hands-on apprenticeships, school programs, mentorship initiatives, and collaborations with modern designers, we create opportunities for youth to learn and innovate.`,
    proposals: [
      {
        title: "Apprenticeship Stipend Scheme",
        objective: "Financial support for youth learning traditional crafts.",
        rationale: [
          {
            title: "Incentive",
            description: "Offsets the opportunity cost of training.",
          },
          {
            title: "Support",
            description: "Allows masters to take on students without loss.",
          },
          {
            title: "Focus",
            description: "Enables full-time dedication to learning skills.",
          },
        ],
        legislativeAsk:
          "Allocate budget for a monthly 'Young Artisan Stipend'.",
      },
      {
        title: "Craft Education Policy",
        objective:
          "Formalize craft training within the higher education system.",
        rationale: [
          {
            title: "Status",
            description: "Elevates craft to the level of other degrees.",
          },
          {
            title: "Innovation",
            description: "Merges tradition with modern design education.",
          },
          {
            title: "Career",
            description: "Creates clear academic pathways for artisans.",
          },
        ],
        legislativeAsk:
          "Accredit craft courses in state universities and polytechnics.",
      },
      {
        title: "Young Entrepreneur Fund",
        objective: "Seed funding for youth-led craft startups.",
        rationale: [
          {
            title: "Innovation",
            description: "Supports new business models in the sector.",
          },
          {
            title: "Employment",
            description: "Youth businesses hire other young people.",
          },
          {
            title: "Risk Taking",
            description: "De-risks the launch of experimental ventures.",
          },
        ],
        legislativeAsk:
          "Create a venture fund specifically for craft startups.",
      },
    ],
    strategies: [
      {
        title: "Youth Apprenticeships",
        objective: "Provide hands-on experience under master artisans.",
        points: [
          {
            title: "Mentors",
            description: "Selecting master artisans to train youth.",
          },
          {
            title: "Stipends",
            description: "Providing financial support during training.",
          },
          {
            title: "Curriculum",
            description: "Documented techniques for standardized learning.",
          },
        ],
        actionSteps: [
          "Recruit master artisans",
          "Select apprentices",
          "Start apprenticeship cycle",
        ],
      },
      {
        title: "School Workshops",
        objective: "Introduce crafts during formative years.",
        points: [
          {
            title: "History",
            description: "Integrating craft heritage into schools.",
          },
          {
            title: "Hands-on",
            description: "Interactive learning sessions with artisans.",
          },
          {
            title: "Exhibitions",
            description: "Celebrating student craft projects publicly.",
          },
        ],
        actionSteps: [
          "Develop school modules",
          "Organize workshops",
          "Host annual exhibition",
        ],
      },
      {
        title: "Design Innovation",
        objective: "Bridge tradition with contemporary innovation.",
        points: [
          {
            title: "Collaborations",
            description: "Partnering with fashion and interior designers.",
          },
          {
            title: "Products",
            description: "Developing modern, sustainable product fines.",
          },
          {
            title: "Awards",
            description: "Recognizing creative contributions annually.",
          },
        ],
        actionSteps: [
          "Launch design challenge",
          "Partner with design schools",
          "Award innovation grants",
        ],
      },
    ],
    outcomes: [
      {
        title: "Generational Continuity",
        description:
          "New generation of skilled artisans entering the workforce.",
        points: [
          {
            title: "Youth Enrollment",
            description: "Higher numbers in craft training.",
          },
          {
            title: "Skill Preservation",
            description: "Transfer of critical traditional skills.",
          },
        ],
      },
      {
        title: "Sector Innovation",
        description: "Fresh ideas and modern designs revitalizing the market.",
        points: [
          {
            title: "Product Diversity",
            description: "New product lines appealing to modern tastes.",
          },
          {
            title: "Career Viability",
            description: "Craft seen as a desirable career path.",
          },
        ],
      },
      {
        title: "Cultural Continuity",
        description:
          "The gap between generations is bridged through shared heritage.",
        points: [
          {
            title: "Pride",
            description: "Youth take ownership of their culture.",
          },
          {
            title: "Evoluation",
            description: "Tradition evolves to stay relevant.",
          },
        ],
      },
    ],
    conclusion:
      "The Youth Engagement and Skill Transfer Campaign is a movement to safeguard Kashmir's craft heritage by inspiring and empowering the next generation of artisans.",
  },
];
