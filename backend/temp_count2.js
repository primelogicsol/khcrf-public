const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.evaluationSubmission.count().then(console.log).finally(() => prisma.$disconnect());
