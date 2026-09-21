const fs = require('fs');
const file = 'backend/src/controllers/publicSkcController.ts';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/const activities = await prisma\.skcHearing\.findMany\(\{[\s\S]*?\}\);/g, `let activities = await prisma.skcHearing.findMany({
        where: {
          publicationStatus: 'PUBLISHED',
          ...(activeCycleId ? { assessmentCycleId: activeCycleId } : {})
        },
        orderBy: {
          startAt: 'desc'
        },
        ...(!all ? { take: 5 } : {})
      });
      
      activities = activities.map((a: any) => ({
         ...a,
         startAt: a.startAt ? new Date(a.startAt).toISOString() : null,
         date: a.date ? new Date(a.date).toISOString() : null,
      }));`);

fs.writeFileSync(file, c);
console.log("Fixed backend date serialization!");
