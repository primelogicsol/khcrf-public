import { prisma } from './src/index';
async function main() {
    const counts = await prisma.partnerApplication.groupBy({
        by: ['status'],
        _count: { id: true }
    });
    console.log(counts);
}
main().finally(() => process.exit(0));
