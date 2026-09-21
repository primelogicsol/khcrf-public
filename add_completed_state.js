const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/const \[expandedCardId, setExpandedCardId\] = useState<string \| null>\(null\);/, "const [expandedCardId, setExpandedCardId] = useState<string | null>(null);\n  const [showCompletedSection, setShowCompletedSection] = useState(false);");

fs.writeFileSync(file, c);
console.log("Added showCompletedSection state!");
