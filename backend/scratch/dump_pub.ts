import { prisma } from '../src/config/db';

async function main() {
  const pub = await prisma.publication.findUnique({
    where: { id: 'cmqd3mkxs006y4cbozkn3gycq' },
    include: { chapters: { include: { pages: true } } }
  });
  
  if (!pub) {
    console.log("Publication not found");
    return;
  }
  
  console.log(JSON.stringify(pub, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
