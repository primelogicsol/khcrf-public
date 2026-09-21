const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgresql://govtech:PQsQ3OL6@127.0.0.1:5432/hcrf_db_clean?schema=public"
  });
  await client.connect();

  // First, let's delete the records with clk IDs
  await client.query(`DELETE FROM "PartnerApplication" WHERE "id" LIKE 'clk%'`);

  const newEntities = [
    { orgName: "Craft Guru", desc: "Craft knowledge and guidance interface across Craftlore intelligence", types: ["Intelligence", "Guidance"], areas: ["Innovation and Technology", "Academic Research"] },
    { orgName: "Craftlore CKHG", desc: "Kashmir Handmade Guardian — protection, anti-counterfeit and authenticity intelligence layer", types: ["GI Protection", "Verification"], areas: ["Innovation and Technology", "Policy and Advocacy"] },
    { orgName: "Craft Digital Passport", desc: "Product-level provenance, GI, artisan/workshop and authenticity passport using QR/NFC", types: ["Provenance", "Verification"], areas: ["Innovation and Technology", "Sustainability and Ethical Trade"] },
    { orgName: "Craftlore Knowledge Graph", desc: "Connected intelligence layer linking crafts, artisans, entities, GI, provenance, markets, sustainability and risk", types: ["Data Architecture", "Intelligence"], areas: ["Innovation and Technology", "Academic Research"] },
    { orgName: "CKTRE Verified Registry", desc: "Verified artisan/business/institution registry and performance-trust records", types: ["Verification", "Compliance"], areas: ["Sustainability and Ethical Trade", "Policy and Advocacy"] },
    { orgName: "CKTRE Performance Rankings", desc: "Dynamic verified PTS and ranking intelligence", types: ["Verification", "Analytics"], areas: ["Academic Research", "Sustainability and Ethical Trade"] },
    { orgName: "CKTRE Trade Blacklist", desc: "GI fraud, counterfeit, misrepresentation and trade-risk records", types: ["Risk Assessment", "Compliance"], areas: ["Policy and Advocacy", "Sustainability and Ethical Trade"] },
    { orgName: "CKTRE Alliance Portal", desc: "Institutional and trade-alliance participation interface", types: ["Partnership Infrastructure"], areas: ["Cultural Preservation", "Sustainability and Ethical Trade"] },
    { orgName: "CGIS Counterfeit Reporting", desc: "Public counterfeit/GI misuse reporting and case-resolution system", types: ["GI Protection", "Risk Assessment"], areas: ["Policy and Advocacy", "Innovation and Technology"] },
    { orgName: "CGIS Product Verification", desc: "Product authenticity and GI verification service", types: ["Verification", "Appraisal"], areas: ["Innovation and Technology", "Sustainability and Ethical Trade"] },
    { orgName: "CLIE Learning Hub", desc: "Structured craft-learning modules and buyer education", types: ["Learning", "Certification"], areas: ["Academic Research", "Cultural Preservation"] },
    { orgName: "CLIE Certification", desc: "Learning assessment and certification layer", types: ["Learning", "Certification"], areas: ["Academic Research", "Artisan Welfare"] },
    { orgName: "CLIE Rewards & Incentives", desc: "Learning incentives, redemption and participation rewards", types: ["Learning", "Incentives"], areas: ["Artisan Welfare", "Cultural Preservation"] },
    { orgName: "CAIS Fair Value Engine", desc: "Product fair-value appraisal", types: ["Appraisal", "Market Intelligence"], areas: ["Innovation and Technology", "Sustainability and Ethical Trade"] },
    { orgName: "CAIS Market Rate Engine", desc: "Craft-market pricing and market-rate intelligence", types: ["Appraisal", "Market Intelligence"], areas: ["Innovation and Technology", "Academic Research"] },
    { orgName: "CSEME Craft Economy Dashboard", desc: "Production, export, productivity and socioeconomic indicators", types: ["Research", "Analytics"], areas: ["Academic Research", "Policy and Advocacy"] },
    { orgName: "CRVAS Risk Intelligence", desc: "Supply-chain, market-access and craft-vulnerability monitoring", types: ["Risk Assessment", "Research"], areas: ["Sustainability and Ethical Trade", "Policy and Advocacy"] }
  ];

  let startId = 58;
  for (const entity of newEntities) {
    const id = "KHCRF-PTR-0000" + startId.toString().padStart(2, '0');
    startId++;
    const email = "contact@" + entity.orgName.toLowerCase().replace(/[^a-z0-9]/g, '') + ".com";
    
    await client.query(`
      INSERT INTO "PartnerApplication" (
        "id", "orgName", "contactName", "email", "country", "status", "collection", "collaborationType", "collaborationAreas", "projectDescription", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()
      )
    `, [
      id,
      entity.orgName,
      "System Generated",
      email,
      "India",
      "ACTIVE",
      "specialized-enterprise",
      JSON.stringify(entity.types),
      JSON.stringify(entity.areas),
      entity.desc
    ]);
    console.log("Created: " + id + " - " + entity.orgName);
  }

  await client.end();
}

main().catch(console.error);
