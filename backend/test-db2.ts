import { prisma } from './src/index';

async function test() {
    const res = await prisma.$queryRawUnsafe("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    console.log(res);
}
test().catch(console.error).finally(() => process.exit(0));
