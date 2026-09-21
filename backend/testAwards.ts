import { prisma } from "./src/config/db.ts";
prisma.artisanAwardRecipient.count().then(data => console.log("AWARDS:", data)).finally(() => prisma.$disconnect());
