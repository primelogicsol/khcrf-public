const fs = require('fs');
let lines = fs.readFileSync('src/components/business/EvaluateFarmLink.tsx', 'utf8').split(/\r?\n/);

// Remove the duplicate export
lines = lines.filter((l, i) => {
  // If line 8 (index 7) and 9 (index 8) are the same export, remove one.
  return !(l.includes('export default function EvaluateFarmLink') && lines[i-1] && lines[i-1].includes('export default function EvaluateFarmLink'));
});

// find the export line
const exportIdx = lines.findIndex(l => l.includes('export default function EvaluateFarmLink'));
if (exportIdx !== -1) {
  // check if next line has useState
  if (!lines[exportIdx+1].includes('useState')) {
    lines.splice(exportIdx+1, 0, "  const [openTier, setOpenTier] = useState<string>('GOLD');");
  }
  // check if next next line has return (
  if (!lines[exportIdx+2].includes('return')) {
    lines.splice(exportIdx+2, 0, "  return (");
  }
}

fs.writeFileSync('src/components/business/EvaluateFarmLink.tsx', lines.join('\n'), 'utf8');
