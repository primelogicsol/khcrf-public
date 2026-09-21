import { prisma } from '../src/config/db';

async function main() {
  const pub = await prisma.publication.findUnique({
    where: { id: 'cmqd3mkxs006y4cbozkn3gycq' },
    include: { chapters: true }
  });

  if (!pub) {
    console.log("Publication not found");
    return;
  }

  // Define actual chapter titles mapping
  const actualTitles: Record<number, string> = {
    1: "Chapter 1 – The Trust Crisis",
    2: "Chapter 2 – Authentication Framework",
    3: "Chapter 3 – Transparency and Accountability",
    4: "Chapter 4 – Artisan Economic Protection",
    5: "Chapter 5 – Digital Traceability",
    6: "Chapter 6 – Governance and Institutions",
    7: "Chapter 7 – Global Case Studies",
    8: "Chapter 8 – KHCRF Framework",
    9: "Chapter 9 – Implementation Toolkit",
    10: "Chapter 10 – Roadmap and Recommendations"
  };

  let renameCount = 0;
  for (const ch of pub.chapters) {
    if (ch.sectionType === 'chapter' || !ch.sectionType) {
      // Find matches for Chapter titles and parse their index
      const match = ch.title.match(/Chapter\s*(?:0*(\d+))|Test\s*Chapter/i);
      if (match) {
        let chNum = match[1] ? parseInt(match[1]) : null;
        if (!chNum) {
          // If it was just "Test Chapter", try using the order index to map it
          const mainChapters = pub.chapters
            .filter(c => c.sectionType === 'chapter' || !c.sectionType)
            .sort((a, b) => a.order - b.order);
          const pos = mainChapters.findIndex(c => c.id === ch.id) + 1;
          chNum = pos;
        }

        const newTitle = actualTitles[chNum];
        if (newTitle) {
          await prisma.chapter.update({
            where: { id: ch.id },
            data: { title: newTitle }
          });
          console.log(`Renamed chapter ID ${ch.id}: "${ch.title}" -> "${newTitle}"`);
          renameCount++;
        }
      }
    }
  }

  console.log(`Successfully updated ${renameCount} chapter titles.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
