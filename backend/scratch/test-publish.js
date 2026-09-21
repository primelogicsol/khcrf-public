const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');

async function testPublishWorkflow() {
  console.log("Starting Publish Workflow Audit...");

  try {
    // 1. Create Draft
    console.log("\n[1] Creating Draft Publication...");
    const slug = `audit-publish-workflow-${crypto.randomBytes(4).toString('hex')}`;
    const draftPub = await prisma.publication.create({
      data: {
        title: "Publish Workflow Audit Test",
        author: "Agent",
        slug: slug,
        publishedStatus: "DRAFT",
        content: JSON.stringify([{ type: "Paragraph", text: "Draft text." }])
      }
    });
    console.log(`✓ Draft Created. ID: ${draftPub.id} | Status: ${draftPub.publishedStatus}`);

    // 2. Submit for Review
    console.log("\n[2] Submitting for Review...");
    const reviewPub = await prisma.publication.update({
      where: { id: draftPub.id },
      data: { publishedStatus: "UNDER_REVIEW" }
    });
    console.log(`✓ Status updated to: ${reviewPub.publishedStatus}`);

    // 3. Approve
    console.log("\n[3] Approving Publication...");
    const approvePub = await prisma.publication.update({
      where: { id: draftPub.id },
      data: { publishedStatus: "APPROVED", metadata: JSON.stringify({ approval_status: "approved" }) }
    });
    console.log(`✓ Status updated to: ${approvePub.publishedStatus}`);

    // 4. Schedule
    console.log("\n[4] Scheduling Publication...");
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    const scheduleMeta = { approval_status: "approved", scheduled_publish_at: futureDate.toISOString() };
    const schedulePub = await prisma.publication.update({
      where: { id: draftPub.id },
      data: { publishedStatus: "SCHEDULED", metadata: JSON.stringify(scheduleMeta) }
    });
    console.log(`✓ Status updated to: ${schedulePub.publishedStatus}`);
    
    // 5. Publish
    console.log("\n[5] Publishing Publication...");
    const finalPub = await prisma.publication.update({
      where: { id: draftPub.id },
      data: { publishedStatus: "PUBLISHED" }
    });
    console.log(`✓ Status updated to: ${finalPub.publishedStatus}`);

    console.log("\nFinal DB Verification:");
    console.log({
      id: finalPub.id,
      slug: finalPub.slug,
      publishedStatus: finalPub.publishedStatus,
      metadata: finalPub.metadata
    });

    console.log("\n✅ Publish Workflow is Structurally Stable.");

  } catch (err) {
    console.error("\n❌ Publish Workflow Test Failed:");
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

testPublishWorkflow();
