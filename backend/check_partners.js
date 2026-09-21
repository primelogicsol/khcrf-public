const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
    const count = await prisma.partnerApplication.count();
    const statuses = await prisma.partnerApplication.groupBy({ by: ["status"], _count: { status: true } });
    console.log("Total partners:", count);
    console.log(statuses);
}
main().finally(() => prisma.$disconnect());
