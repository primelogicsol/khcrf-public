const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

const tStart = c.indexOf('const DEFAULT_THEMATIC_CLUSTERS = [');
const tEnd = c.indexOf('];', tStart) + 2;

const replacement = `const DEFAULT_THEMATIC_CLUSTERS = [
  {
    group: "HERITAGE & AUTHENTICITY",
    summary: "Traditional crafts, authenticity and cultural preservation.",
    themes: [
      { name: "Future of Pashmina", objective: "Public hearing programme for sector modernization", slug: "future-of-pashmina" },
      { name: "Future of Carpets", objective: "Technology and export competitiveness consultation", slug: "future-of-carpets" },
      { name: "GI & Authenticity", objective: "Evidence framework for authenticity protection", slug: "gi-authenticity" },
      { name: "Cultural Heritage", objective: "Documentation and safeguarding consultation", slug: "cultural-heritage" }
    ]
  },
  {
    group: "PEOPLE & LIVELIHOODS",
    summary: "Participation, livelihoods, skills and inclusion.",
    themes: [
      { name: "Youth in Crafts", objective: "Youth stakeholder engagement programme", slug: "youth-in-crafts" },
      { name: "Artisan Livelihoods", objective: "Wage standards, livelihood security and welfare", slug: "artisan-livelihoods" },
      { name: "Women in Crafts", objective: "Regional consultation and leadership programme", slug: "women-in-crafts" },
      { name: "Education & Skills", objective: "Institutional training, apprenticeships and design schools", slug: "education-skills" }
    ]
  },
  {
    group: "MARKETS & ECONOMY",
    summary: "Markets, exports, finance and commerce.",
    themes: [
      { name: "Exports", objective: "Trade policy, customs and export corridors", slug: "exports" },
      { name: "Digital Commerce", objective: "E-commerce onboarding, logistics and virtual branding", slug: "digital-commerce" },
      { name: "Finance & Investment", objective: "Artisan credit cards, interest subsidies and microfinance", slug: "finance-investment" },
      { name: "Global Markets", objective: "Global trade routes, custom structures and tariffs", slug: "global-markets" }
    ]
  },
  {
    group: "INNOVATION & SUSTAINABILITY",
    summary: "Innovation, sustainability and policy.",
    themes: [
      { name: "Technology & Design", objective: "Modern tools and design innovation frameworks", slug: "technology-design" },
      { name: "Raw Material Access", objective: "Pashmina and silk supply chain integrity review", slug: "raw-material-access" },
      { name: "Climate & Sustainability", objective: "Environmental resilience and raw material review", slug: "climate-sustainability" },
      { name: "Policy & Governance", objective: "Long-term development frameworks and structures", slug: "policy-governance" }
    ]
  }
];`;

c = c.substring(0, tStart) + replacement + c.substring(tEnd);

fs.writeFileSync(file, c);
console.log("Replaced DEFAULT_THEMATIC_CLUSTERS!");
