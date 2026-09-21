import { prisma } from "./src/config/db.ts";
prisma.workshopCommunity.findFirst().then(data => console.log(JSON.stringify(data, null, 2))).finally(() => prisma.$disconnect());
