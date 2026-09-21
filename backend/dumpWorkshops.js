const { PrismaClient } = require("./node_modules/@prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();
prisma.workshopCommunity.findMany().then(data => {
    fs.writeFileSync("workshops_dump.json", JSON.stringify(data, null, 2));
    console.log("Dumped", data.length, "workshops");
}).finally(() => prisma.$disconnect());
