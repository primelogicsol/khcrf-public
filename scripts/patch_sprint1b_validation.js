const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, '..', 'backend', 'src', 'controllers');

const entities = ['Craft', 'Material', 'Tool', 'Technique', 'Motif', 'Product', 'GlossaryTerm'];

entities.forEach(entity => {
  const controllerPath = path.join(basePath, `${entity.toLowerCase()}Controller.ts`);
  if (fs.existsSync(controllerPath)) {
    let content = fs.readFileSync(controllerPath, 'utf8');

    // Add Zod and Validator imports
    const imports = `import { ZodError } from 'zod';\nimport { ${entity.charAt(0).toLowerCase() + entity.slice(1)}Schema, update${entity}Schema } from '../validators/sprint1BValidator';\n`;
    content = imports + content;

    // Patch Create method
    const createRegex = /const record = await ([A-Za-z]+)Service\.create\(req\.body, userId\);/g;
    content = content.replace(createRegex, `const validatedData = ${entity.charAt(0).toLowerCase() + entity.slice(1)}Schema.parse(req.body);\n      const record = await $1Service.create(validatedData, userId);`);

    // Patch Update method
    const updateRegex = /const record = await ([A-Za-z]+)Service\.update\(req\.params\.id, req\.body, userId \|\| 'system'\);/g;
    content = content.replace(updateRegex, `const validatedData = update${entity}Schema.parse(req.body);\n      const record = await $1Service.update(req.params.id, validatedData, userId || 'system');`);

    // Patch error handling blocks to catch ZodError
    const catchRegex = /catch \(error: any\) \{\n      console\.error\(error\);/g;
    content = content.replace(catchRegex, `catch (error: any) {\n      if (error instanceof ZodError) return res.status(400).json({ error: 'Validation failed', details: error.issues });\n      console.error(error);`);
    
    // Some catches didn't have error: any
    const catchRegex2 = /catch \(error\) \{\n      console\.error\(error\);/g;
    content = content.replace(catchRegex2, `catch (error: any) {\n      if (error instanceof ZodError) return res.status(400).json({ error: 'Validation failed', details: error.issues });\n      console.error(error);`);

    fs.writeFileSync(controllerPath, content);
  }
});

console.log('Successfully patched Sprint 1B controllers with Zod Validation.');
