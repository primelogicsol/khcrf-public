const { PrismaClient } = require("./backend/node_modules/@prisma/client");
const prisma = new PrismaClient();
prisma.artisan.groupBy({
  by: ["artisanClass"],
  _count: { artisanClass: true }
}).then(console.log).finally(() => prisma.$disconnect());
