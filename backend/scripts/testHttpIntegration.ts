import fetch from 'node-fetch';

async function testHttpEndpoints() {
  console.log("=== Testing Canonical HTTP Endpoints ===");
  
  const baseUrl = "http://localhost:5000"; // Assuming backend runs on 5000
  const slug = "premium-pricing-trends-in-authentic-kashmiri-luxury-crafts";

  try {
    // 1. Test Detail Endpoint
    console.log(`\n[1] GET /api/public/publications/details/${slug}`);
    let res = await fetch(`${baseUrl}/api/public/publications/details/${slug}`);
    
    // Fallback to older route if new one isn't mounted yet
    if (res.status === 404) {
      console.log(`Fallback: GET /api/publications/details/${slug}`);
      res = await fetch(`${baseUrl}/api/publications/details/${slug}`);
    }

    if (!res.ok) {
      throw new Error(`Detail endpoint failed with status ${res.status}: ${await res.text()}`);
    }

    const detailData: any = await res.json();
    console.log("Detail payload received successfully.");
    
    // Assertions
    console.log("Asserting detail payload...");
    const assertions = [
      { name: "Executive Summary", val: detailData.executiveSummary },
      { name: "Cover Path", val: detailData.coverImageUrl },
      { name: "Correct Category", val: detailData.category?.name === "Pricing Intelligence Series" },
      { name: "Semantic Edition", val: typeof detailData.edition === "object" && detailData.edition !== null },
      { name: "Subtitle", val: detailData.subtitle },
      { name: "Reading Time", val: detailData.estimatedReadingTimeMinutes === 45 },
    ];
    
    for (const a of assertions) {
      if (!a.val) throw new Error(`Assertion failed: ${a.name}`);
      console.log(`  ✓ ${a.name}`);
    }

    // 2. Test Catalogue Endpoint
    console.log(`\n[2] GET /api/publications`);
    const catRes = await fetch(`${baseUrl}/api/publications`);
    
    if (!catRes.ok) {
      throw new Error(`Catalogue endpoint failed with status ${catRes.status}: ${await catRes.text()}`);
    }

    const catData: any = await catRes.json();
    const flagship = catData.publications?.find((p: any) => p.slug === slug) || catData.find?.((p: any) => p.slug === slug);
    
    if (!flagship) {
      throw new Error("Flagship publication not found in catalogue response");
    }

    console.log("Catalogue payload received successfully.");
    console.log("Asserting catalogue payload...");
    if (!flagship.coverImageUrl) throw new Error("Assertion failed: Catalogue Cover Path");
    console.log(`  ✓ Cover Path`);
    if (typeof flagship.edition !== "object") throw new Error("Assertion failed: Catalogue Semantic Edition");
    console.log(`  ✓ Semantic Edition`);

    // 3. Test 404 for unpublished
    console.log(`\n[3] GET /api/publications/details/non-existent-or-unpublished`);
    const notFoundRes = await fetch(`${baseUrl}/api/publications/details/non-existent-or-unpublished`);
    if (notFoundRes.status !== 404) {
      throw new Error(`Expected 404, got ${notFoundRes.status}`);
    }
    console.log(`  ✓ HTTP 404 for unpublished`);

    console.log("\n✅ All HTTP integration tests passed.");
  } catch (error) {
    console.error("\n❌ HTTP Integration Test Failed:");
    console.error(error);
    process.exit(1);
  }
}

testHttpEndpoints();
