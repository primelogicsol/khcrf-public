import { prisma } from './src/config/db.js';

async function checkEvent() {
  const event = await prisma.craftloreIntegrationEvent.findUnique({
    where: { eventId: 'ae294af1-e76b-471d-985c-7d8edfe57123' }
  });

  if (event) {
    console.log(`Event ID: ${event.eventId}`);
    console.log(`Verification Request ID: ${event.verificationRequestId}`);
    console.log(`Processing Status: ${event.processingStatus}`);
    console.log(`Response Status: ${event.responseStatus}`);
    console.log(`Error Code: ${event.errorCode}`);
  } else {
    console.log('Event not found in the database. (Perhaps it was cleared out by clearData.ts?)');
  }
}

checkEvent().catch(console.error).finally(() => prisma.$disconnect());
