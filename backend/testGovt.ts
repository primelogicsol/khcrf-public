import { prisma } from "./src/config/db.ts";
prisma.masterArtisan.count({ where: { government_verified: true } }).then(data => console.log("GOVT VERIFIED:", data)).finally(() => prisma.$disconnect());
