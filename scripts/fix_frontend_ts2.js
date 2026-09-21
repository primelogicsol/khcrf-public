const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, '..', 'frontend', 'src', 'app', 'dashboard');
const sections = ['knowledge', 'taxonomy', 'relationships', 'verification', 'workflow', 'media', 'source-references'];

sections.forEach(section => {
  const pagePath = path.join(basePath, section, 'page.tsx');
  if (fs.existsSync(pagePath)) {
    let content = fs.readFileSync(pagePath, 'utf8');

    // Fix the missing opening <TableRow ...> to <tr ...>
    content = content.replace(/<TableRow /g, '<tr ');

    fs.writeFileSync(pagePath, content);
  }
});

console.log('Successfully patched TableRow attributes.');
