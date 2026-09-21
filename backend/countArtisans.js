const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const artisans = await prisma.masterArtisan.findMany();
    const stats = {
        total: artisans.length,
        artisanClass: {},
        status: {},
        gender: {}
    };
    artisans.forEach(a => {
        stats.artisanClass[a.artisanClass] = (stats.artisanClass[a.artisanClass] || 0) + 1;
        stats.status[a.status] = (stats.status[a.status] || 0) + 1;
        stats.gender[a.gender] = (stats.gender[a.gender] || 0) + 1;
    });
    console.log(stats);
}
main().catch(console.error).finally(() => prisma.$disconnect());
