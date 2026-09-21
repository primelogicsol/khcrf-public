const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

const useEfectRegex = /(fetched = fetched\.map\(\(a: any\) => \{[\s\S]*?return a;\n\s*\}\);)/;

const newUseEffect = `$1
              
              const nowTime = new Date('2026-09-19T00:00:00Z');
              fetched = fetched.map((feed: any) => {
                  const isOverride = feed.status === 'CANCELLED' || feed.status === 'POSTPONED' || feed.status === 'RESCHEDULED';
                  if (!isOverride && feed.startAt) {
                      const start = new Date(feed.startAt);
                      const end = feed.endAt ? new Date(feed.endAt) : new Date(start.getTime() + 4 * 60 * 60 * 1000);
                      
                      if (nowTime > end) {
                          feed._temporalStatus = 'COMPLETED';
                          feed.status = 'COMPLETED';
                          feed.registrationStatus = 'CLOSED';
                      } else if (nowTime >= start && nowTime <= end) {
                          feed._temporalStatus = 'LIVE';
                          feed.status = 'LIVE';
                      } else {
                          feed._temporalStatus = 'UPCOMING';
                          const isInternal = feed.status === 'INTERNAL_REVIEW' || feed.status === 'Governance_Approval' || feed.status === 'Governance_Briefing' || feed.status === 'FINAL_PUBLICATION';
                          if (!isInternal) {
                              let regOpen = feed.registrationStatus === 'OPEN';
                              if (feed.registrationOpensAt && feed.registrationClosesAt) {
                                  const rStart = new Date(feed.registrationOpensAt);
                                  const rEnd = new Date(feed.registrationClosesAt);
                                  regOpen = (nowTime >= rStart && nowTime <= rEnd);
                              }
                              feed.status = regOpen ? 'REGISTRATION_OPEN' : 'SCHEDULED';
                              feed.registrationStatus = regOpen ? 'OPEN' : 'CLOSED';
                          }
                      }
                  } else {
                      feed._temporalStatus = 'UPCOMING';
                  }
                  return feed;
              });`;

c = c.replace(useEfectRegex, newUseEffect);

fs.writeFileSync(file, c);
console.log("Injected useEffect temporal mapper!");
