import { prisma } from './src/config/db.js';

async function test() {
    try {
        const user = await prisma.user.findFirst({
            select: {
                _count: {
                    select: {
                        userPurchases: true, donations: true, certifications: true,
                        accreditationApplications: true, grantApplications: true,
                        evaluationSubmissions: true, 
                        legislativeOffices: { where: { status: 'APPROVED' } },
                        partnerApplications: true, apprenticeshipApplications: true,
                    }
                },
                isMember: true, name: true,
            }
        });
        console.log("Success:", !!user);
    } catch(e) {
        console.error("Prisma error:", e);
    } finally {
        process.exit(0);
    }
}
test();
