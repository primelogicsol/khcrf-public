const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

if (!c.includes('const [showMoreFilters, setShowMoreFilters] = useState(false);')) {
  c = c.replace(/const \[selectedDateRange, setSelectedDateRange\] = useState\('ALL'\);/, "const [selectedDateRange, setSelectedDateRange] = useState('ALL');\n    const [showMoreFilters, setShowMoreFilters] = useState(false);");
  fs.writeFileSync(file, c);
  console.log("Added showMoreFilters state!");
}
