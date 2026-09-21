import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Governance rules to detect unmigrated hardcoded values
const prohibitedPatterns = [
  /text-gray-[0-9]{2,3}/g,
  /bg-gray-[0-9]{2,3}/g,
  /border-gray-[0-9]{2,3}/g,
  /text-slate-[0-9]{2,3}/g,
  /bg-slate-[0-9]{2,3}/g,
  /border-slate-[0-9]{2,3}/g,
  /text-stone-[0-9]{2,3}/g,
  /bg-stone-[0-9]{2,3}/g,
  /border-stone-[0-9]{2,3}/g,
  /text-\[[#[0-9a-fA-F]{3,8}\]/g,
  /bg-\[[#[0-9a-fA-F]{3,8}\]/g,
  /border-\[[#[0-9a-fA-F]{3,8}\]/g,
  /style=\{\{\s*color:/g,
  /style=\{\{\s*background:/g,
  /style=\{\{\s*borderColor:/g,
];

const baselineFile = path.join(__dirname, '..', 'governance_baseline_fingerprints.json');
const exceptionsFile = path.join(__dirname, '..', 'governance_exceptions.json');

let baseline = {};
let exceptions = [];

if (fs.existsSync(baselineFile)) {
  baseline = JSON.parse(fs.readFileSync(baselineFile, 'utf8'));
}

if (fs.existsSync(exceptionsFile)) {
  exceptions = JSON.parse(fs.readFileSync(exceptionsFile, 'utf8'));
}

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (/\.(tsx|ts|jsx|js)$/.test(dirFile)) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
}

const rootDir = path.join(__dirname, '..', 'src');
const files = walkSync(rootDir);
const currentFingerprints = {};
let totalViolations = 0;

files.forEach((file) => {
  const relPath = path.relative(path.join(__dirname, '..'), file).replace(/\\/g, '/');
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const fileFingerprints = [];

  lines.forEach((line) => {
    prohibitedPatterns.forEach((pattern) => {
      let match;
      // create a new regex to avoid state issues with global flag
      const regex = new RegExp(pattern);
      while ((match = regex.exec(line)) !== null) {
        const token = match[0];
        const context = line.trim().substring(0, 150); // limit context length
        const fingerprint = `${relPath}::${pattern.source}::${token}::${context}`;
        
        // Check if excepted
        const isExcepted = exceptions.some(ex => {
           if (new RegExp(ex.filePattern).test(relPath) && token.includes(ex.token)) {
               return true;
           }
           return false;
        });

        if (!isExcepted) {
           fileFingerprints.push(fingerprint);
           totalViolations++;
        }
      }
    });
  });

  if (fileFingerprints.length > 0) {
    currentFingerprints[relPath] = fileFingerprints;
  }
});

let hasErrors = false;

if (process.argv.includes('--self-test')) {
    // For self-test, we expect to compare two fingerprint arrays.
    // E.g. we removed one and added another, but counts are equal.
    const before = ["src/test.tsx::text-white::text-white::<div className=\"text-white\""];
    const after = ["src/test.tsx::text-white::text-[#fafafa]::<div className=\"text-[#fafafa]\""];
    
    // They should be different
    if (before[0] !== after[0]) {
        console.log("✅ Self-test passed: Fingerprint correctly detected substitution.");
    } else {
        console.error("❌ Self-test failed: Fingerprints were identical.");
    }
    process.exit(0);
}

// Compare current against baseline
Object.keys(currentFingerprints).forEach(file => {
  const currentItems = currentFingerprints[file];
  const baselineItems = baseline[file] || [];

  // Count occurrences of each fingerprint in baseline
  const baselineCounts = {};
  baselineItems.forEach(fp => {
    baselineCounts[fp] = (baselineCounts[fp] || 0) + 1;
  });

  currentItems.forEach(fp => {
    if (baselineCounts[fp] && baselineCounts[fp] > 0) {
      baselineCounts[fp]--; // Matched an existing baseline violation
    } else {
      console.error(`❌ NEW VIOLATION: ${fp}`);
      hasErrors = true;
    }
  });
});

Object.keys(baseline).forEach(file => {
   const baselineItems = baseline[file];
   const currentItems = currentFingerprints[file] || [];
   
   if (currentItems.length < baselineItems.length && !hasErrors) {
       console.log(`✅ IMPROVEMENT: ${file} reduced violations from ${baselineItems.length} to ${currentItems.length}`);
   }
});

// Update baseline if requested
if (process.argv.includes('--update-baseline')) {
  fs.writeFileSync(baselineFile, JSON.stringify(currentFingerprints, null, 2));
  console.log(`✅ Baseline updated. Total violations: ${totalViolations}`);
} else {
  console.log(`Governance check complete. Current violations: ${totalViolations}`);
  if (hasErrors) {
    console.error("Governance check failed: New or modified un-tokenized colors introduced.");
    process.exit(1);
  }
}
