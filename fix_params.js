const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultations/[slug]/page.tsx';
if (fs.existsSync(file)) {
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(/export default async function ConsultationOutcomePage\(\{ params \}: \{ params: \{ slug: string \} \}\) \{/g, "export default async function ConsultationOutcomePage({ params }: { params: Promise<{ slug: string }> }) {\n  const resolvedParams = await params;\n  const { slug } = resolvedParams;");
  c = c.replace(/params\.slug/g, "slug");
  fs.writeFileSync(file, c);
  console.log("Fixed params promise error!");
} else {
  console.log("File not found");
}
