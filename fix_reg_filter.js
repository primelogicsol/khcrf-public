const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

// Add the state
c = c.replace(/const \[selectedStatus, setSelectedStatus\] = useState\('ALL'\);/, "const [selectedStatus, setSelectedStatus] = useState('ALL');\n  const [selectedRegistrationOpen, setSelectedRegistrationOpen] = useState(false);");

// Update the Registration Open button
c = c.replace(/onClick=\{.*?setSelectedStatus\(selectedStatus === 'Registration Open' \? 'ALL' : 'Registration Open'\).*?\}/, "onClick={() => setSelectedRegistrationOpen(!selectedRegistrationOpen)}");

c = c.replace(/selectedStatus === 'Registration Open' \? 'bg-stone-800/g, "selectedRegistrationOpen ? 'bg-stone-800");

// Apply the filter in filteredHearings
const filterRegex = /if \(selectedStatus !== 'ALL'\) \{/;
const filterReplacement = `if (selectedRegistrationOpen) {
        result = result.filter(h => h.registrationStatus === 'OPEN');
      }
      if (selectedStatus !== 'ALL') {`;
c = c.replace(filterRegex, filterReplacement);

fs.writeFileSync(file, c);
console.log("Separated Registration Open filter!");
