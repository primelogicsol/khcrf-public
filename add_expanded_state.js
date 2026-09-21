const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/const \[selectedDateRange, setSelectedDateRange\] = useState\('ALL'\);/, "const [selectedDateRange, setSelectedDateRange] = useState('ALL');\n    const [expandedCardId, setExpandedCardId] = useState<string | null>(null);");

fs.writeFileSync(file, c);
console.log("Added expandedCardId state!");
