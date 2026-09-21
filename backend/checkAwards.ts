import { prisma } from './src/config/db.ts';

async function main() {
    const artisans = await prisma.masterArtisan.findMany({ include: { award_receipts: true } });
    let withAwards = 0;
    artisans.forEach(a => {
        if (a.award_receipts && a.award_receipts.length > 0) withAwards++;
    });
    console.log("Artisans with awards: ", withAwards);
}
main().catch(console.error);
