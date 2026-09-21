import { prisma } from './src/index';
async function main() {
    const counts = await prisma.partnerApplication.count();
    console.log('Total PartnerApplication:', counts);
    
    const canonical = await prisma.canonicalEntity.count();
    console.log('Total CanonicalEntity:', canonical);
    
    const inst = await prisma.skcInstitution.count();
    console.log('Total SkcInstitution:', inst);
}
main().finally(() => process.exit(0));
