import { prisma } from './src/config/db.js';

async function test() {
    try {
        const evals = await prisma.evaluationSubmission.findMany({
            orderBy: { createdAt: 'desc' }
        });
        console.log("Success, found:", evals.length);
    } catch(e) {
        console.error("Prisma error:", e);
    } finally {
        process.exit(0);
    }
}
test();
