export type QuestionType = 'rating' | 'radio' | 'multiselect' | 'textarea' | 'rank' | 'text' | 'number' | 'select';

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  options?: string[];
  placeholder?: string;
  description?: string;
}

export interface GroupSchema {
  profile: Question[];
  situation: Question[];
  challenges: Question[];
  opportunities: Question[];
  recommendations: Question[];
}

export const QUESTIONNAIRE_SCHEMA: Record<string, GroupSchema> = {
  "Artisan & Production": {
    profile: [
      { id: "craft", type: "select", label: "Craft", options: ["Pashmina", "Carpet", "Papier-Mache", "Walnut Wood", "Other"] },
      { id: "experience", type: "number", label: "Years of Experience", placeholder: "e.g. 15" },
      { id: "productionType", type: "select", label: "Production Type", options: ["Individual", "Family / Karkhana", "Cooperative"] },
      { id: "familyMembers", type: "number", label: "Family Members Involved", placeholder: "e.g. 3" },
    ],
    situation: [
      { id: "rawMaterials", type: "rating", label: "How would you rate access to raw materials in the current year?", options: ["Excellent", "Good", "Average", "Poor", "Very Poor"] },
      { id: "salesChannel", type: "radio", label: "What is your primary sales channel?", options: ["Local Market", "Middleman", "Retail Shop", "Exporter", "Online", "Mixed"] }
    ],
    challenges: [
      { id: "biggestChallenges", type: "multiselect", label: "Select the three biggest challenges you face:", description: "Select up to 3", options: ["Raw Materials", "Marketing", "Finance", "Counterfeit Products", "Training", "Technology", "Labor", "Transportation"] },
      { id: "singleBiggest", type: "textarea", label: "Describe the single biggest challenge facing your craft today.", placeholder: "Please provide specific details..." }
    ],
    opportunities: [
      { id: "priorities", type: "rank", label: "Rank the following priorities:", description: "Select a rank for each item (1 is highest priority)", options: ["Export Support", "Skill Training", "Tourism Integration", "Marketing", "Finance & Subsidies", "GI Protection"] }
    ],
    recommendations: [
      { id: "govPriority", type: "textarea", label: "What should government prioritize?" },
      { id: "industryPriority", type: "textarea", label: "What should industry (exporters/buyers) prioritize?" },
      { id: "oneAction", type: "textarea", label: "What is one action that could improve your sector within 12 months?" }
    ]
  },
  "Trade & Markets": {
    profile: [
      { id: "markets", type: "text", label: "Primary Markets", placeholder: "Europe, US, Domestic..." },
      { id: "yearsBusiness", type: "number", label: "Years in Business", placeholder: "e.g. 20" },
      { id: "valueRange", type: "select", label: "Annual Volume/Value Range", options: ["Under ₹10 Lakh", "₹10L - ₹1Cr", "Over ₹1Cr"] },
      { id: "primaryProducts", type: "text", label: "Primary Products Traded", placeholder: "Carpets, Shawls..." },
    ],
    situation: [
      { id: "demand", type: "rating", label: "How would you rate consumer demand for Kashmir crafts currently?", options: ["Excellent", "Good", "Average", "Poor", "Very Poor"] },
      { id: "sourcing", type: "radio", label: "How do you primarily source products?", options: ["Direct from Artisans", "Through Middlemen", "Manufacturer/Karkhana", "Mixed"] }
    ],
    challenges: [
      { id: "biggestChallenges", type: "multiselect", label: "Select the three biggest challenges in trade:", description: "Select up to 3", options: ["Logistics/Shipping", "Counterfeit/Machine-made", "Working Capital", "Marketing/Branding", "Taxation/Customs", "Finding Authentic Suppliers", "E-commerce Infrastructure"] },
      { id: "singleBiggest", type: "textarea", label: "Describe the single biggest obstacle to scaling your craft business.", placeholder: "Please provide specific details..." }
    ],
    opportunities: [
      { id: "priorities", type: "rank", label: "Rank the following priorities for market growth:", description: "Select a rank for each item (1 is highest priority)", options: ["International Marketing", "GI Awareness", "E-commerce Support", "Easier Financing", "Logistics Subsidies", "Trade Fairs"] }
    ],
    recommendations: [
      { id: "govPriority", type: "textarea", label: "What should government prioritize for trade enablement?" },
      { id: "artisanPriority", type: "textarea", label: "What should artisans/producers prioritize to meet market needs?" },
      { id: "oneAction", type: "textarea", label: "What is one action that could boost sales within 12 months?" }
    ]
  },
  "Education & Research": {
    profile: [
      { id: "institution", type: "text", label: "Institution/Organization Name", placeholder: "e.g. University of Kashmir" },
      { id: "department", type: "text", label: "Department / Field of Study", placeholder: "e.g. Economics, Design" },
      { id: "researchInterests", type: "textarea", label: "Research Interests / Focus Areas", placeholder: "Livelihoods, Value Chains, History..." }
    ],
    situation: [
      { id: "dataAvailability", type: "rating", label: "How would you rate the availability of reliable data on Kashmir crafts?", options: ["Excellent", "Good", "Average", "Poor", "Very Poor"] },
      { id: "curriculum", type: "radio", label: "How integrated are craft studies in the current academic curriculum?", options: ["Highly Integrated", "Somewhat Integrated", "Marginally Integrated", "Not Integrated"] }
    ],
    challenges: [
      { id: "biggestChallenges", type: "multiselect", label: "Select the three biggest challenges in craft education/research:", description: "Select up to 3", options: ["Lack of Funding", "Data Scarcity", "Disconnect from Artisans", "Outdated Curriculum", "Lack of Institutional Support", "Student Disinterest"] },
      { id: "singleBiggest", type: "textarea", label: "Describe the single biggest gap in current research or education regarding crafts.", placeholder: "Please provide specific details..." }
    ],
    opportunities: [
      { id: "priorities", type: "rank", label: "Rank the following priorities for education/research:", description: "Select a rank for each item (1 is highest priority)", options: ["Research Funding", "Curriculum Updates", "Industry-Academia Linkages", "Digitization of Archives", "Design Incubation", "Skill Certification"] }
    ],
    recommendations: [
      { id: "govPriority", type: "textarea", label: "What should government prioritize in craft education?" },
      { id: "industryPriority", type: "textarea", label: "How can the industry better engage with academia?" },
      { id: "oneAction", type: "textarea", label: "What is one immediate intervention needed in craft education/research?" }
    ]
  },
  "Government & Policy": {
    profile: [
      { id: "department", type: "text", label: "Department / Organization", placeholder: "e.g. Directorate of Handicrafts" },
      { id: "role", type: "text", label: "Designation / Role", placeholder: "e.g. Assistant Director" },
      { id: "focus", type: "textarea", label: "Primary Policy/Implementation Focus", placeholder: "Skill development, subsidies, GI..." }
    ],
    situation: [
      { id: "policyImpact", type: "rating", label: "How would you rate the impact of current craft policies?", options: ["Highly Effective", "Effective", "Neutral", "Ineffective", "Highly Ineffective"] },
      { id: "coordination", type: "radio", label: "How is inter-departmental coordination regarding crafts?", options: ["Excellent", "Good", "Needs Improvement", "Poor"] }
    ],
    challenges: [
      { id: "biggestChallenges", type: "multiselect", label: "Select the three biggest challenges in policy implementation:", description: "Select up to 3", options: ["Budget Constraints", "Implementation Bottlenecks", "Lack of Accurate Data", "Stakeholder Resistance", "Complex Bureaucracy", "Monitoring & Evaluation"] },
      { id: "singleBiggest", type: "textarea", label: "Describe the single biggest obstacle to effective policy implementation.", placeholder: "Please provide specific details..." }
    ],
    opportunities: [
      { id: "priorities", type: "rank", label: "Rank the following policy priorities:", description: "Select a rank for each item (1 is highest priority)", options: ["Digital Governance", "Direct Benefit Transfers", "Export Promotion Policies", "GI Enforcement", "Artisan Welfare Schemes", "Infrastructure Development"] }
    ],
    recommendations: [
      { id: "artisanPriority", type: "textarea", label: "What should artisans do to better utilize government schemes?" },
      { id: "marketPriority", type: "textarea", label: "How can the private sector support policy goals?" },
      { id: "oneAction", type: "textarea", label: "What is one policy change that could transform the sector?" }
    ]
  },
  "Society & Community": {
    profile: [
      { id: "occupation", type: "text", label: "Primary Occupation", placeholder: "e.g. Teacher, Engineer" },
      { id: "connection", type: "select", label: "Connection to Crafts", options: ["Consumer/Buyer", "Family Background", "Cultural Interest", "Activist/NGO", "None"] }
    ],
    situation: [
      { id: "perception", type: "rating", label: "How do you perceive the current social status of artisans in Kashmir?", options: ["Highly Respected", "Respected", "Average", "Undervalued", "Highly Undervalued"] },
      { id: "purchasing", type: "radio", label: "How often do you purchase genuine handmade Kashmir crafts?", options: ["Frequently", "Occasionally", "Rarely", "Never"] }
    ],
    challenges: [
      { id: "biggestChallenges", type: "multiselect", label: "Select the three biggest threats to Kashmir crafts from a societal perspective:", description: "Select up to 3", options: ["Loss of Heritage", "Youth Disinterest", "High Prices", "Inability to Distinguish Fakes", "Changing Consumer Tastes", "Lack of Awareness"] },
      { id: "singleBiggest", type: "textarea", label: "Describe the primary reason why local youth may be turning away from crafts.", placeholder: "Please provide specific details..." }
    ],
    opportunities: [
      { id: "priorities", type: "rank", label: "Rank the following priorities for societal engagement:", description: "Select a rank for each item (1 is highest priority)", options: ["Consumer Awareness Campaigns", "Heritage Preservation", "Youth Apprenticeships", "Community Craft Centers", "Integration in School Curricula"] }
    ],
    recommendations: [
      { id: "govPriority", type: "textarea", label: "What should government do to preserve craft heritage?" },
      { id: "artisanPriority", type: "textarea", label: "How can artisans better connect with the local community?" },
      { id: "oneAction", type: "textarea", label: "What is one action to increase local appreciation for Kashmir crafts?" }
    ]
  },
  "Communication & Tourism": {
    profile: [
      { id: "profession", type: "text", label: "Profession", placeholder: "e.g. Journalist, Tour Operator" },
      { id: "focusArea", type: "text", label: "Focus Area", placeholder: "e.g. Cultural reporting, Experiential tourism" }
    ],
    situation: [
      { id: "mediaRepresentation", type: "rating", label: "How would you rate the current media representation of Kashmir crafts?", options: ["Excellent", "Good", "Average", "Poor", "Very Poor"] },
      { id: "tourismLinkage", type: "radio", label: "How well are crafts integrated into the Kashmir tourism experience?", options: ["Highly Integrated", "Moderately Integrated", "Poorly Integrated", "Not Integrated"] }
    ],
    challenges: [
      { id: "biggestChallenges", type: "multiselect", label: "Select the three biggest challenges in craft communication/tourism:", description: "Select up to 3", options: ["Lack of Craft Tourism Infrastructure", "Poor Storytelling/Branding", "Tourist Scams/Fakes", "Limited Media Coverage", "Disconnect between Tour Operators & Artisans"] },
      { id: "singleBiggest", type: "textarea", label: "Describe the single biggest missed opportunity in promoting Kashmir crafts.", placeholder: "Please provide specific details..." }
    ],
    opportunities: [
      { id: "priorities", type: "rank", label: "Rank the following priorities:", description: "Select a rank for each item (1 is highest priority)", options: ["Craft Tourism Circuits", "Global Media Campaigns", "Authenticity Verification Apps for Tourists", "Artisan Documentaries", "Tour Guide Training on Crafts"] }
    ],
    recommendations: [
      { id: "govPriority", type: "textarea", label: "What should the Tourism Department prioritize regarding crafts?" },
      { id: "artisanPriority", type: "textarea", label: "How can artisans better cater to tourists or media?" },
      { id: "oneAction", type: "textarea", label: "What is one action to improve the global narrative around Kashmir crafts?" }
    ]
  },
  "Global Community": {
    profile: [
      { id: "country", type: "text", label: "Country of Residence", placeholder: "e.g. USA, UK, UAE" },
      { id: "profession", type: "text", label: "Profession", placeholder: "e.g. Tech, Business, Medicine" }
    ],
    situation: [
      { id: "availability", type: "rating", label: "How would you rate the availability of authentic Kashmir crafts in your region?", options: ["Excellent", "Good", "Average", "Poor", "Very Poor"] },
      { id: "perception", type: "radio", label: "How are Kashmir crafts perceived in your current country?", options: ["Premium Luxury", "Standard Handicrafts", "Unknown/Niche", "Associated with Conflict"] }
    ],
    challenges: [
      { id: "biggestChallenges", type: "multiselect", label: "Select the three biggest challenges in accessing/promoting Kashmir crafts globally:", description: "Select up to 3", options: ["High Shipping Costs", "Lack of Trust/Authenticity", "Poor E-commerce Experience", "Limited Marketing", "Inconvenient Payment Methods", "Lack of Modern Designs"] },
      { id: "singleBiggest", type: "textarea", label: "Describe the primary obstacle to expanding the Kashmir craft market in your region.", placeholder: "Please provide specific details..." }
    ],
    opportunities: [
      { id: "priorities", type: "rank", label: "Rank the following priorities for global expansion:", description: "Select a rank for each item (1 is highest priority)", options: ["International Exhibitions", "Diaspora Ambassador Programs", "Seamless E-commerce Platforms", "B2B Matchmaking", "Global GI Enforcement"] }
    ],
    recommendations: [
      { id: "govPriority", type: "textarea", label: "What should the government do to support international market access?" },
      { id: "diasporaRole", type: "textarea", label: "How can the Kashmiri diaspora actively support the craft sector?" },
      { id: "oneAction", type: "textarea", label: "What is one immediate action to boost international sales?" }
    ]
  }
};
