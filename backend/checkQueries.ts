import { prisma } from './src/config/db.ts';

async function main() {
    console.log(await prisma.masterArtisan.count({ where: { status: 'Living', award_receipts: { some: {} } } }));
    console.log(await prisma.masterArtisan.count({ where: { status: { in: ['Deceased', 'Historical', 'Unknown', 'Historical Only'] }, artisanClass: 'MASTER' } }));
    console.log(await prisma.masterArtisan.count({ where: { gender: { in: ['Female', 'FEMALE', 'female'] } } }));
}
main().catch(console.error);
