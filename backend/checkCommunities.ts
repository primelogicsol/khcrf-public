import { prisma } from './src/config/db.ts';

async function main() {
    const communities = await prisma.workshopCommunity.findMany();
    console.log("Communities:", communities.length);
}
main().catch(console.error);
