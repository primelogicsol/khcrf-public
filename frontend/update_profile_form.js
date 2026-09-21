const fs = require('fs');
let file = fs.readFileSync('frontend/src/components/forms/StakeholderProfileForm.tsx', 'utf8');

// 1. Add import for PARTICIPANT_CATEGORIES
if (!file.includes('PARTICIPANT_CATEGORIES')) {
    file = file.replace(/import \{ useRouter \} from 'next\/navigation';/, "import { useRouter } from 'next/navigation';\nimport { PARTICIPANT_CATEGORIES } from '@/lib/skc/participant-categories';");
}

// 2. Add initialCategory to props
file = file.replace(/export default function StakeholderProfileForm\(\) \{/, 'export default function StakeholderProfileForm({ initialCategory = "" }: { initialCategory?: string }) {');

// 3. Set category to initialCategory in initial formData state
file = file.replace(/category: '',/g, 'category: initialCategory,');
file = file.replace(/const \[registeredCategory, setRegisteredCategory\] = useState\(''\);/, "const [registeredCategory, setRegisteredCategory] = useState(initialCategory);");

// 4. Remove old hash parsing logic for category
file = file.replace(/if \(hash\.includes\('category='\)\) \{[\s\S]*?\} else if \(hash\.includes\('tab='\)\)/, "if (hash.includes('tab='))");

// 5. Replace <optgroup> with mapped categories
file = file.replace(/<optgroup label="Artisans & Production">[\s\S]*?<\/optgroup>/, 
{PARTICIPANT_CATEGORIES.map(cat => (
    <option key={cat} value={cat}>{cat}</option>
  ))});

fs.writeFileSync('frontend/src/components/forms/StakeholderProfileForm.tsx', file);
console.log('StakeholderProfileForm.tsx updated successfully');
