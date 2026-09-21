import { prisma } from './src/config/db.js';

async function run() {
    const s = await prisma.evaluationSubmission.findUnique({where: {trackingId: 'VR-2026-497A2BED'}});
    if (!s) return console.log("Not found");
    const id = s.id;
    console.log("Found ID:", id);
    
    // Complete verification
    console.log("-> 4. Completing verification (resending)");
    const res = await fetch(`http://localhost:4000/api/verification/${id}/complete`, { method: 'POST' });
    console.log(`   Status: ${res.status}`);
}

run().finally(() => prisma.$disconnect());
