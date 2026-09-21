const { PrismaClient } = require("./node_modules/@prisma/client");
const prisma = new PrismaClient();
prisma.workshopCommunity.findFirst().then(data => console.log(JSON.stringify(data, null, 2))).finally(() => prisma.$disconnect());
