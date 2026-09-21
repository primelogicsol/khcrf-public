const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const regex = /\/\/ Dropdown list categories[\s\S]*?const dateRanges = \[.*?\];/;

const replacement = `// Dropdown list categories
  const derivedDistricts = useMemo(() => Array.from(new Set(hearings.map((h: any) => h.district).filter(Boolean))), [hearings]);
  const derivedCrafts = useMemo(() => {
    const all = hearings.flatMap((h: any) => h.craftFocus || []);
    return Array.from(new Set(all)).filter(Boolean);
  }, [hearings]);
  const derivedTopics = useMemo(() => {
    const all = hearings.flatMap((h: any) => h.topics || []);
    return Array.from(new Set(all)).filter(Boolean);
  }, [hearings]);
  const derivedStakeholders = useMemo(() => {
    const all = hearings.flatMap((h: any) => h.stakeholderCategories || []);
    return Array.from(new Set(all)).filter(Boolean);
  }, [hearings]);
  const participationTypes = ["Attend / Register", "Submit Written Testimony", "Submit Evidence", "Panel Speaker", "Observer", "Institutional Submission"];
  const dateRanges = ["This Week", "This Month", "Next 30 Days", "September 2026", "October 2026", "November 2026", "Past Hearings"];`;

c = c.replace(regex, replacement);

c = c.replace(/\{districts\.map\(d/g, '{derivedDistricts.map(d');
c = c.replace(/\{crafts\.map\(c/g, '{derivedCrafts.map(c');
c = c.replace(/\{topics\.map\(t/g, '{derivedTopics.map(t');
c = c.replace(/\{stakeholders\.map\(s/g, '{derivedStakeholders.map(s');

fs.writeFileSync(file, c);
console.log("Updated dynamic dropdown derivation!");
