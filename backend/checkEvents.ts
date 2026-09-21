import { prisma } from './src/config/db.js';

async function check() {
  const events = await prisma.craftloreIntegrationEvent.findMany();
  console.log(events);
}

check().catch(console.error).finally(() => prisma.$disconnect());
