const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

// 1. Inject the derivation logic right after fetched = activitiesRes.data.activities;
const fetchPoint = "let fetched = activitiesRes.data.activities;";
const derivationLogic = `
              const nowTime = new Date('2026-09-19T00:00:00Z');
              fetched = fetched.map((feed) => {
                  const isOverride = feed.status === 'CANCELLED' || feed.status === 'POSTPONED' || feed.status === 'RESCHEDULED';
                  if (!isOverride && feed.startAt) {
                      const start = new Date(feed.startAt);
                      const end = feed.endAt ? new Date(feed.endAt) : new Date(start.getTime() + 4 * 60 * 60 * 1000);
                      
                      if (nowTime > end) {
                          feed._temporalStatus = 'COMPLETED';
                          feed.status = 'COMPLETED';
                      } else if (nowTime >= start && nowTime <= end) {
                          feed._temporalStatus = 'LIVE';
                          feed.status = 'LIVE';
                      } else {
                          feed._temporalStatus = 'UPCOMING';
                          const isInternal = feed.status === 'INTERNAL_REVIEW' || feed.status === 'Governance_Approval' || feed.status === 'Governance_Briefing' || feed.status === 'FINAL_PUBLICATION';
                          if (!isInternal) {
                              feed.status = 'SCHEDULED';
                          }
                      }
                  } else {
                      feed._temporalStatus = 'UPCOMING';
                  }
                  return feed;
              });
`;

c = c.replace(fetchPoint, fetchPoint + derivationLogic);

// 2. Rewrite the timeline generation block
const timelineStart = "const completed = activities.filter(a => a.status === 'COMPLETED' || (a.startAt && new Date(a.startAt) < now && new Date(a.startAt).getFullYear() === 2026));";
const timelineEndRegex = /const displayFeed = \[[^\]]*\];/;

const timelineMatch = c.match(timelineEndRegex);
if (timelineMatch) {
    const startIndex = c.indexOf(timelineStart);
    const endIndex = timelineMatch.index + timelineMatch[0].length;
    
    if (startIndex !== -1) {
        const newTimeline = `
                      const completed = activities.filter((a) => a._temporalStatus === 'COMPLETED');
                      
                      const thresholdMs = 150 * 24 * 60 * 60 * 1000;
                      const future = activities.filter((a) => a._temporalStatus === 'UPCOMING' || a._temporalStatus === 'LIVE');
                      future.sort((a, b) => new Date(a.startAt || 0).getTime() - new Date(b.startAt || 0).getTime());
                      
                      const currentNext = future.slice(0, 1);
                      const remainingFuture = future.slice(1);
                      
                      const upcoming = remainingFuture.filter((a) => (new Date(a.startAt || 0).getTime() - now.getTime()) <= thresholdMs);
                      const later = remainingFuture.filter((a) => (new Date(a.startAt || 0).getTime() - now.getTime()) > thresholdMs);
                      
                      completed.sort((a, b) => new Date(b.startAt || 0).getTime() - new Date(a.startAt || 0).getTime());
                      
                      const displayFeed = [
                        ...(currentNext.length > 0 ? [{ _isDivider: true, title: 'CURRENT / NEXT' }, ...currentNext] : []),
                        ...(upcoming.length > 0 ? [{ _isDivider: true, title: 'UPCOMING' }, ...upcoming] : []),
                        ...(completed.length > 0 ? [{ _isDivider: true, title: 'RECENTLY COMPLETED' }, ...completed] : []),
                        ...(later.length > 0 ? [{ _isDivider: true, title: 'LATER PROGRAMME ACTIVITIES' }, ...later] : [])
                      ];
        `;
        c = c.substring(0, startIndex) + newTimeline + c.substring(endIndex);
    }
}

// 3. Nuke CTAs globally
c = c.replace(/const showCTA =[\s\S]*?;/, "const showCTA = false;");

fs.writeFileSync(file, c);
console.log("Master patch applied cleanly!");
