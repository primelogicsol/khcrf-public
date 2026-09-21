import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
    const e = await prisma.evaluationSubmission.findFirst({
        where: { caseStatus: 'VERIFICATION_COMPLETED', evaluationType: 'KHCRF_16_STEP' }
    });
    console.log(e?.id);
    process.exit(0);
}
run();
