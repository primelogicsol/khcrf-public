const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultations/[slug]/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/export async function generateMetadata\(\{ params \}: \{ params: \{ slug: string \} \}\) \{[\s\S]*?const activity = activities\.find\(\(a: any\) => a\.slug === slug\);/g, `export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const res = await safeFetch('/api/public/skc/activities');
  const activities = res?.data?.activities || res?.activities || [];
  const activity = activities.find((a: any) => a.slug === slug);`);

fs.writeFileSync(file, c);
console.log("Fixed Metadata params promise!");
