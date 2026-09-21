const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/const \[activeTab, setActiveTab\] = useState\<'timeline' \| 'calendar' \| 'map'\>\('timeline'\);/, "const [activeTab, setActiveTab] = useState<'timeline' | 'calendar' | 'map'>('timeline');\n  const [showMoreFilters, setShowMoreFilters] = useState(false);");

fs.writeFileSync(file, c);
console.log("Added showMoreFilters state");
