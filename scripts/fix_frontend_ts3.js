const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, '..', 'frontend', 'src', 'app', 'dashboard');
const sections = ['knowledge', 'taxonomy', 'relationships', 'verification', 'workflow', 'media', 'source-references'];

sections.forEach(section => {
  const pagePath = path.join(basePath, section, 'page.tsx');
  if (fs.existsSync(pagePath)) {
    let content = fs.readFileSync(pagePath, 'utf8');

    // Merge duplicate classNames on td
    content = content.replace(/className="px-6 py-4 whitespace-nowrap"([^>]*)className="/g, 'className="px-6 py-4 whitespace-nowrap $1 ');
    content = content.replace(/className="px-6 py-4 whitespace-nowrap" className="/g, 'className="px-6 py-4 whitespace-nowrap ');
    
    // Specifically handle the colSpan one
    content = content.replace(/className="px-6 py-4 whitespace-nowrap" colSpan=\{3\} className="/g, 'colSpan={3} className="px-6 py-4 whitespace-nowrap ');

    fs.writeFileSync(pagePath, content);
  }
});

console.log('Successfully merged duplicate classNames.');
