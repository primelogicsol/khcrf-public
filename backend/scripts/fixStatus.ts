import { prisma } from '../src/config/db';

async function main() {
  const records = await prisma.masterArtisan.findMany({
    where: { status: { in: ['VERIFIED', 'PROVISIONAL'] } }
  });
  
  for (const rec of records) {
    await prisma.masterArtisan.update({
      where: { id: rec.id },
      data: {
        reconciliation_status: rec.status,
        status: 'Unknown'
      }
    });
  }
  console.log(`Updated ${records.length} records to separate life status from reconciliation status.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
