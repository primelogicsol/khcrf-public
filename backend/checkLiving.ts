import { prisma } from './src/config/db.ts';

async function main() {
    const where = { AND: [{ status: 'Living' }, { award_receipts: { some: {} } }] };
    const artisans = await prisma.masterArtisan.findMany({ where });
    console.log("Living Legends: ", artisans.length);
}
main().catch(console.error);
