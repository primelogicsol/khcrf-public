import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const pubs = await prisma.publication.findMany({
    include: {
      _count: {
        select: { chapters: true }
      }
    }
  });

  console.log("ALL PUBLICATIONS:");
  for (const pub of pubs) {
    console.log(`ID: ${pub.id}, Title: "${pub.title}", Chapters Count: ${pub._count.chapters}`);
  }
}

main().catch(console.error).finally(async () => {
  await prisma.$disconnect();
  await pool.end();
});
