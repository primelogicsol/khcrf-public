const { getHearingLifecycle } = require('./src/lib/skc/hearingLifecycle');

const events = [
  { slug: "youth", scheduledDate: "2026-09-01T11:00:00Z" },
  { slug: "exports", scheduledDate: "2026-09-05T11:00:00Z" },
  { slug: "pashmina", scheduledDate: "2026-09-10T11:00:00Z" },
  { slug: "commerce", scheduledDate: "2026-09-15T11:00:00Z" },
  { slug: "carpets", scheduledDate: "2026-09-20T11:00:00Z" },
  { slug: "tech", scheduledDate: "2026-09-25T11:00:00Z" },
  { slug: "artisan", scheduledDate: "2026-09-30T11:00:00Z" },
  { slug: "gi", scheduledDate: "2026-10-05T11:00:00Z" },
  { slug: "women", scheduledDate: "2026-10-10T11:00:00Z" },
  { slug: "finance", scheduledDate: "2026-10-15T11:00:00Z" },
  { slug: "materials", scheduledDate: "2026-10-20T11:00:00Z" },
  { slug: "climate", scheduledDate: "2026-10-25T11:00:00Z" },
  { slug: "heritage", scheduledDate: "2026-10-30T11:00:00Z" },
  { slug: "education", scheduledDate: "2026-11-04T11:00:00Z" },
  { slug: "markets", scheduledDate: "2026-11-09T11:00:00Z" },
  { slug: "policy", scheduledDate: "2026-11-14T11:00:00Z" }
];

const testDate = new Date("2026-09-16T15:00:00Z");
const resolved = events.map(e => getHearingLifecycle(e, testDate));

let completed = 0, upcoming = 0, registrationOpen = 0, closingSoon = 0, liveNow = 0;

resolved.forEach(h => {
  if (h.hearingStatus === 'COMPLETED') completed++;
  if (h.hearingStatus === 'LIVE') liveNow++;
  if (h.hearingStatus === 'SCHEDULED' && h.displayStatus !== 'SCHEDULE_PENDING') upcoming++;
  if (h.registrationStatus === 'OPEN' || h.registrationStatus === 'CLOSING_SOON') registrationOpen++;
  if (h.registrationStatus === 'CLOSING_SOON') closingSoon++;
});

console.log("Test Date:", testDate.toISOString());
console.log("Programme Events:", events.length);
console.log("Completed:", completed);
console.log("Upcoming:", upcoming);
console.log("Registration Open:", registrationOpen);
console.log("Closing Soon:", closingSoon);
console.log("Live Now:", liveNow);

console.log("\nFuture of Carpets on Sep 17 (Inside Closing Soon Window):");
const carpTest = new Date("2026-09-17T11:00:00Z");
const resolvedCarp = getHearingLifecycle(events[4], carpTest);
console.log(resolvedCarp);
