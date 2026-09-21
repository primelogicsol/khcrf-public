import { prisma } from './src/config/db.js';
async function check() {
    const findings = await prisma.verificationFinding.findMany({
        where: { submissionId: 'cmu7q1hxt000070bo2ywyssjt' }
    });
    console.log(findings.map(f => f.status));
}
check().finally(() => prisma.$disconnect());
