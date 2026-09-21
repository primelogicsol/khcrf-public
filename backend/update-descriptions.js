const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgresql://govtech:PQsQ3OL6@127.0.0.1:5432/hcrf_db_clean?schema=public"
  });
  await client.connect();

  const updates = [
    { orgName: "Craft Guru", desc: "Craft Guru serves as the primary knowledge and guidance interface, leveraging the full depth of Craftlore intelligence to provide actionable insights, strategic counsel, and dynamic decision-support for stakeholders navigating the artisan economy." },
    { orgName: "Craftlore CKHG", desc: "Craftlore Kashmir Handmade Guardian operates as a specialized intelligence layer dedicated to anti-counterfeit protection, brand integrity, and authenticity monitoring, ensuring the global safeguarding of Kashmir's geographical indications and heritage assets." },
    { orgName: "Craft Digital Passport", desc: "Craft Digital Passport provides a secure, traceable product-level provenance infrastructure, utilizing advanced QR and NFC technologies to embed verifiable authenticity, geographical indication data, and workshop histories directly into physical craft assets." },
    { orgName: "Craftlore Knowledge Graph", desc: "Craftlore Knowledge Graph delivers a connected intelligence ecosystem that maps complex relationships across artisans, institutional entities, geographical indications, provenance trails, global markets, sustainability metrics, and localized risk factors." },
    { orgName: "CKTRE Verified Registry", desc: "CKTRE Verified Registry maintains an immutable and rigorously audited database of artisans, businesses, and institutional partners, facilitating transparency through verifiable performance metrics and institutional trust records." },
    { orgName: "CKTRE Performance Rankings", desc: "CKTRE Performance Rankings provides dynamic, data-driven intelligence on stakeholder performance, leveraging verified Participation and Trust Scores (PTS) to establish clear benchmarks for excellence within the craft ecosystem." },
    { orgName: "CKTRE Trade Blacklist", desc: "CKTRE Trade Blacklist functions as a critical compliance and enforcement tool, systematically recording instances of geographical indication fraud, counterfeit distribution, material misrepresentation, and overarching trade risks." },
    { orgName: "CKTRE Alliance Portal", desc: "CKTRE Alliance Portal serves as the dedicated interface for institutional partners and trade alliances, streamlining collaborative initiatives, participation tracking, and strategic integration into the broader KHCRF network." },
    { orgName: "CGIS Counterfeit Reporting", desc: "CGIS Counterfeit Reporting offers a comprehensive public-facing infrastructure for the documentation, tracking, and systematic resolution of geographical indication misuse and counterfeit craft allegations." },
    { orgName: "CGIS Product Verification", desc: "CGIS Product Verification provides authoritative diagnostic and verification services, ensuring that craft products meet strict authenticity standards and comply fully with established geographical indication frameworks." },
    { orgName: "CLIE Learning Hub", desc: "CLIE Learning Hub delivers structured, accessible educational modules designed to elevate artisan capabilities while simultaneously educating global buyers on the heritage, material science, and cultural value of Kashmir crafts." },
    { orgName: "CLIE Certification", desc: "CLIE Certification operates as the formal assessment and credentialing authority within the learning ecosystem, providing recognized certifications that validate technical mastery, ethical practices, and cultural knowledge." },
    { orgName: "CLIE Rewards & Incentives", desc: "CLIE Rewards & Incentives manages a structured motivation framework, aligning educational participation and skill advancement with tangible benefits, redemption programs, and institutional recognition." },
    { orgName: "CAIS Fair Value Engine", desc: "CAIS Fair Value Engine deploys advanced algorithmic appraisal models to calculate equitable market valuations for craft products, integrating material costs, labor intensity, technique rarity, and historical provenance." },
    { orgName: "CAIS Market Rate Engine", desc: "CAIS Market Rate Engine provides continuous, data-driven intelligence on global pricing trends, enabling stakeholders to navigate the commercial landscape with accurate, real-time assessments of craft-market dynamics." },
    { orgName: "CSEME Craft Economy Dashboard", desc: "CSEME Craft Economy Dashboard aggregates critical sector data to provide a comprehensive visualization of production volumes, export metrics, artisan productivity, and vital socioeconomic indicators shaping the industry." },
    { orgName: "CRVAS Risk Intelligence", desc: "CRVAS Risk Intelligence executes continuous monitoring of the craft sector, analyzing supply-chain disruptions, market-access barriers, and systemic vulnerabilities to preemptively safeguard artisan livelihoods." }
  ];

  for (const update of updates) {
    await client.query(`UPDATE "PartnerApplication" SET "projectDescription" = $1 WHERE "orgName" = $2`, [update.desc, update.orgName]);
    console.log("Updated description for: " + update.orgName);
  }

  await client.end();
}

main().catch(console.error);
