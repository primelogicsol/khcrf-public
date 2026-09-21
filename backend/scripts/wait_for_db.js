const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkConnection() {
  while (true) {
    try {
      await prisma.$connect();
      console.log('PostgreSQL database is online!');
      await prisma.$disconnect();
      return;
    } catch (error) {
      console.log('Database not yet available. Retrying in 5 seconds...');
      await new Promise(res => setTimeout(res, 5000));
    }
  }
}

checkConnection();
