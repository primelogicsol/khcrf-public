const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'backend', 'src', 'index.ts');
let content = fs.readFileSync(indexPath, 'utf8');

const importsToAdd = `
// --- Sprint 1A: Knowledge Infrastructure Routes ---
import knowledgeRoutes from './routes/knowledgeRoutes';
import taxonomyRoutes from './routes/taxonomyRoutes';
import relationshipRoutes from './routes/relationshipRoutes';
import sourcereferenceRoutes from './routes/sourcereferenceRoutes';
import verificationRoutes from './routes/verificationRoutes';
import workflowRoutes from './routes/workflowRoutes';
import mediaassetRoutes from './routes/mediaassetRoutes';
`;

const routesToAdd = `
// --- Sprint 1A: Knowledge Infrastructure Mounts ---
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/taxonomy', taxonomyRoutes);
app.use('/api/relationship', relationshipRoutes);
app.use('/api/source-reference', sourcereferenceRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/workflow', workflowRoutes);
app.use('/api/media', mediaassetRoutes);
`;

if (!content.includes('import knowledgeRoutes')) {
  // Find last import statement
  const importMatch = content.lastIndexOf('import ');
  if (importMatch !== -1) {
    const endOfLine = content.indexOf('\n', importMatch);
    content = content.slice(0, endOfLine + 1) + importsToAdd + content.slice(endOfLine + 1);
  } else {
    content = importsToAdd + content;
  }
}

if (!content.includes('/api/knowledge')) {
  // Find last app.use('/api
  const useMatch = content.lastIndexOf("app.use('/api");
  if (useMatch !== -1) {
    const endOfLine = content.indexOf('\n', useMatch);
    content = content.slice(0, endOfLine + 1) + routesToAdd + content.slice(endOfLine + 1);
  }
}

fs.writeFileSync(indexPath, content);
console.log('Successfully mounted Sprint 1A routes in index.ts');
