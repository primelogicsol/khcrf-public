require('dotenv').config({ path: '.env' });
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const res = await client.query('SELECT id, "collaborationAreas" FROM "PartnerApplication"');
  
  for (const row of res.rows) {
    if (!row.collaborationAreas) continue;
    
    let areas = [];
    try {
      areas = typeof row.collaborationAreas === 'string' ? JSON.parse(row.collaborationAreas) : row.collaborationAreas;
    } catch (e) {
      continue;
    }

    if (!Array.isArray(areas)) continue;

    let modified = false;
    const newAreas = areas.map(a => {
      if (a === "Academic Research") { modified = true; return "Academic & Applied Research"; }
      if (a === "Policy and Advocacy") { modified = true; return "Policy & Advocacy"; }
      if (a === "Sustainability and Ethical Trade") { modified = true; return "Sustainability & Ethical Trade"; }
      if (a === "Innovation and Technology") { modified = true; return "Innovation & Technology"; }
      return a;
    });

    if (modified) {
      await client.query('UPDATE "PartnerApplication" SET "collaborationAreas" = $1 WHERE id = $2', [JSON.stringify(newAreas), row.id]);
    }
  }

  console.log('Normalized old DB values successfully.');
  await client.end();
}

main().catch(console.error);
