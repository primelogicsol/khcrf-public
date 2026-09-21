import { PrismaClient } from "./node_modules/@prisma/client/index.js";
const prisma = new PrismaClient();
prisma.masterArtisan.groupBy({
  by: ["artisanClass"],
  _count: { artisanClass: true }
}).then(console.log).finally(() => prisma.$disconnect());
