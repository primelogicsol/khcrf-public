const fs = require('fs');
let lines = fs.readFileSync('src/components/business/EvaluateFarmLink.tsx', 'utf8').split(/\r?\n/);
lines[8] = `export default function EvaluateFarmLink({ buttonLink = "/business-support/evaluation" }: { buttonLink?: string }) {`;
lines[9] = `  const [openTier, setOpenTier] = useState<string>('GOLD');`;
fs.writeFileSync('src/components/business/EvaluateFarmLink.tsx', lines.join('\n'), 'utf8');
