const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(main)/page.tsx', 'utf8');

const newGetPubs = `async function getPublications() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";
  try {
    const res = await fetch(\`\${API_BASE}/publications\`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      throw new Error("Publications API returned status: " + res.status);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      throw error;
    }
    return [];
  }
}`;

content = content.replace(/async function getPublications\(\) \{[\s\S]*?\} catch \(error\) \{ return \[\]; \}\s*\}/, newGetPubs);
fs.writeFileSync('frontend/src/app/(main)/page.tsx', content, 'utf8');
