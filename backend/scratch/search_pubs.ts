import { prisma } from '../src/config/db';

async function main() {
  const pubs = await prisma.publication.findMany({
    where: {
      title: {
        contains: 'Pashmina',
        mode: 'insensitive'
      }
    },
    include: {
      chapters: true
    }
  });

  console.log(`Found ${pubs.length} matching publications:`);
  for (const pub of pubs) {
    const p = pub as any;
    console.log({
      id: p.id,
      title: p.title,
      slug: p.slug,
      status: p.publishedStatus || p.publish_status,
      chaptersCount: p.chapters?.length || 0,
      frontMatterCount: p.chapters?.filter((c: any) => c.sectionType === 'front-matter').length || 0,
      mainChapterCount: p.chapters?.filter((c: any) => !c.sectionType || c.sectionType === 'chapter' || c.sectionType === 'main-chapter').length || 0,
      backMatterCount: p.chapters?.filter((c: any) => c.sectionType === 'back-matter').length || 0,
      hasKnowledgeGraph: !!p.knowledge_graph,
      seoTitle: p.seoTitle || p.metaTitle,
      aiSummary: p.aiSummary
    });
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
