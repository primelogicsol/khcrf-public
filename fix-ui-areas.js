const fs = require('fs');
const filePath = 'frontend/src/app/(main)/about/partner-network/registry/RegistryClient.tsx';
let c = fs.readFileSync(filePath, 'utf8');

const oldAreasRegex = /const COLLABORATION_AREAS = \[[^\]]+\];/;
const newAreas = `const COLLABORATION_AREAS = [
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

// Now update the render mapping for COLLABORATION_AREAS to use dynamic counts
const oldRenderRegex = /<option value="All">All Collaboration Areas<\/option>\s*\{COLLABORATION_AREAS\.map\(\(area\) => \(\s*<option key=\{area\} value=\{area\}>\s*\{area\}\s*<\/option>\s*\)\)\}/;
const newRender = `<option value="All">All Collaboration Areas ({partners.filter(p => p.status === "ACTIVE" || p.status === "APPROVED").length})</option>
              {COLLABORATION_AREAS.map((area) => {
                const count = partners.filter(p => (p.status === "ACTIVE" || p.status === "APPROVED") && Array.isArray(p.collaborationAreas) && p.collaborationAreas.includes(area)).length;
                return (
                  <option key={area} value={area}>
                    {area} ({count})
                  </option>
                );
              })}`;

c = c.replace(oldRenderRegex, newRender);

fs.writeFileSync(filePath, c);
console.log('Fixed UI mapping and counts!');
