import { prisma } from './src/index';

async function test() {
    const total = await prisma.partnerRegistryEntity.count();
    const core = await prisma.partnerRegistryEntity.count({ where: { collection: 'core-ecosystem' } });
    const spec = await prisma.partnerRegistryEntity.count({ where: { collection: 'specialized-enterprise' } });
    const inst = await prisma.partnerRegistryEntity.count({ where: { collection: 'institutional-alliance' } });
    console.log("DB Total: " + total);
    console.log("DB Core: " + core);
    console.log("DB Spec: " + spec);
    console.log("DB Inst: " + inst);
}

test().catch(console.error).finally(() => process.exit(0));
