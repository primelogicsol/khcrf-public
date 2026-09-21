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
  const pubId = "seed-bp-001";
  const chapters = await prisma.chapter.findMany({
    where: { publicationId: pubId },
    orderBy: { order: "asc" }
  });
  
  console.log(`CURRENT DB CHAPTERS FOR ${pubId}:`);
  chapters.forEach((ch, idx) => {
    console.log(`${idx + 1}. ID: "${ch.id}", Title: "${ch.title}", SectionType: "${ch.sectionType}", Order: ${ch.order}, CreatedAt: ${ch.createdAt.toISOString()}`);
  });
}

main().catch(console.error).finally(async () => {
  await prisma.$disconnect();
  await pool.end();
});
