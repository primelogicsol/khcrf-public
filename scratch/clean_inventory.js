const fs = require('fs');

const inventoryPath = 'C:\\Users\\Fayaz\\.gemini\\antigravity-cli\\brain\\b132a69c-cbfc-4584-9c1f-61ab5dd382c3\\form_inventory_v2.md';
const content = fs.readFileSync(inventoryPath, 'utf8');

const lines = content.split('\n');
const cleanedLines = [];

// Components known to be just display pages or buttons, not actual submission forms
const falsePositives = [
  'NaturalDyes',
  'Techniques',
  'ToolsMaterials',
  'LineagesDirectory',
  'ContemporaryExcellence',
  'PlatformUpgradeButton',
  'ReportModal',
  'ThemeToggle',
  'LanguageSelector',
  'Pagination',
  'SearchBar',
  'SearchDialog',
  'TablePagination',
  'DataTable',
  'FilterDrawer',
  'ViewToggle',
  'SortDropdown'
];

for (const line of lines) {
  if (line.trim().startsWith('|') && !line.includes('---')) {
    const parts = line.split('|').map(p => p.trim());
    if (parts.length > 3) {
      const componentName = parts[3];
      
      // Skip the header
      if (componentName === 'Component') {
        cleanedLines.push(line);
        continue;
      }

      // Check for false positives
      let isFalsePositive = false;
      for (const fp of falsePositives) {
        if (componentName.includes(fp)) {
          isFalsePositive = true;
          break;
        }
      }

      // Skip pages that are likely just wrappers or display
      if (componentName.endsWith('Page') && !componentName.includes('Register') && !componentName.includes('Apply') && !componentName.includes('Nominate') && !componentName.includes('Request') && !componentName.includes('Become') && !componentName.includes('Submission')) {
        // Many 'Page' components just render a form. We only want the Form itself if it's separate.
        // Wait, some pages ARE the form (e.g. BecomeAFellowPage). We'll allow it if it has mutation keywords.
        // Let's just exclude the specific false positives the user mentioned, plus some generic ones.
      }

      if (!isFalsePositive) {
        cleanedLines.push(line);
      }
    } else {
      cleanedLines.push(line);
    }
  } else {
    cleanedLines.push(line);
  }
}

fs.writeFileSync('C:\\Users\\Fayaz\\.gemini\\antigravity-cli\\brain\\b132a69c-cbfc-4584-9c1f-61ab5dd382c3\\cleaned_inventory_v3.md', cleanedLines.join('\n'));
console.log('Cleaned inventory generated at cleaned_inventory_v3.md');
