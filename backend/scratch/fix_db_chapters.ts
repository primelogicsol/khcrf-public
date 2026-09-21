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
  const confirm = process.argv.includes("--confirm");

  console.log(`=== DUPLICATE CLEANUP FOR ${pubId} (${confirm ? "CONFIRM MODE" : "DRY RUN MODE"}) ===`);

  // 1. Get all chapters with their pages
  const chapters = await prisma.chapter.findMany({
    where: { publicationId: pubId },
    include: { pages: true },
    orderBy: { createdAt: "asc" }
  });

  console.log(`Total chapters found initially: ${chapters.length}`);

  // Group chapters by sectionType + order
  const groups: Record<string, typeof chapters> = {};
  for (const ch of chapters) {
    const key = `${ch.sectionType || "chapter"}-${ch.order}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(ch);
  }

  const toDeleteIds: string[] = [];
  const keptChapters: typeof chapters = [];

  for (const key of Object.keys(groups)) {
    const list = groups[key];
    if (list.length === 1) {
      keptChapters.push(list[0]);
      continue;
    }

    console.log(`\nDuplicate group found for ${key}:`);
    list.forEach((c, idx) => {
      console.log(`  [${idx}] ID: ${c.id}, Title: "${c.title}", Pages count: ${c.pages.length}, CreatedAt: ${c.createdAt.toISOString()}`);
    });

    // Sort to find the best candidate to keep
    list.sort((a, b) => {
      const aContentLen = a.pages.reduce((acc, p) => acc + (p.content?.length || 0), 0);
      const bContentLen = b.pages.reduce((acc, p) => acc + (p.content?.length || 0), 0);
      if (aContentLen !== bContentLen) {
        return bContentLen - aContentLen; // descending content length
      }
      return a.createdAt.getTime() - b.createdAt.getTime(); // ascending date (earliest first)
    });

    const kept = list[0];
    const duplicates = list.slice(1);

    console.log(`  => KEEPING: ID ${kept.id} ("${kept.title}")`);
    keptChapters.push(kept);

    for (const dup of duplicates) {
      console.log(`  => MARKING FOR DELETION: ID ${dup.id} ("${dup.title}")`);
      toDeleteIds.push(dup.id);

      if (dup.pages.length > 0) {
        if (confirm) {
          console.log(`    Reassigning ${dup.pages.length} pages to kept chapter ID ${kept.id}`);
          for (const page of dup.pages) {
            await prisma.bookPage.update({
              where: { id: page.id },
              data: { chapterId: kept.id }
            });
          }
        } else {
          console.log(`    [DRY RUN] Would reassign ${dup.pages.length} pages to kept chapter`);
        }
      }
    }
  }

  console.log(`\nSummary:`);
  console.log(`  Kept chapters count: ${keptChapters.length}`);
  console.log(`  Chapters marked for deletion: ${toDeleteIds.length}`);

  if (confirm) {
    if (toDeleteIds.length > 0) {
      console.log("\nDeleting duplicate chapters from database...");
      await prisma.chapter.deleteMany({
        where: { id: { in: toDeleteIds } }
      });
      console.log("Deletion complete.");
    }
  } else {
    console.log("\n[DRY RUN] No records were deleted. Run with '--confirm' to execute the cleanup.");
  }
}

main().catch(console.error).finally(async () => {
  await prisma.$disconnect();
  await pool.end();
});
