const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/reports-archive/ReportsArchiveClient.tsx', 'utf8');

content = content.replace(
    /const \[error, setError\] = useState\(false\);/,
    "const [error, setError] = useState(false);\n  const [loading, setLoading] = useState(true);"
);

fs.writeFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/reports-archive/ReportsArchiveClient.tsx', content);
console.log('Added loading state');
