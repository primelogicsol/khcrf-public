const fs = require('fs');
const filePath = 'frontend/src/app/(main)/about/partner-network/registry/RegistryClient.tsx';
let c = fs.readFileSync(filePath, 'utf8');

const oldAreasRegex = /const COLLABORATION_AREAS = \[\s*"All",[\s\S]*?\];/;
const newAreas = `const COLLABORATION_AREAS = [
    "All",
    "Artisan Welfare",
    "Academic & Applied Research",
    "Cultural Preservation",
    "Policy & Advocacy",
    "Sustainability & Ethical Trade",
    "Innovation & Technology",
    "CSR & Philanthropy",
    "Community Development",
    "Education & Skills",
    "Environmental Sustainability",
    "Climate Resilience",
    "Natural Resource Management",
    "Research & Evidence",
    "GIS & Spatial Intelligence",
    "Digital Infrastructure",
    "Data & Analytics",
    "Technical Assistance",
    "Institutional Capacity Building",
    "Programme Coordination",
    "Collaboration Infrastructure",
    "Monitoring & Evaluation"
  ];`;

c = c.replace(oldAreasRegex, newAreas);

fs.writeFileSync(filePath, c);
console.log('Expanded COLLABORATION_AREAS successfully');
