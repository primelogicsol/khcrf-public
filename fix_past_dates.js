const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

const tStart = c.indexOf('{linkedActivities.map((act: any) => {');
const tEnd = c.indexOf('return (', tStart);

const replacement = `{linkedActivities.map((act: any) => {
                                      const dateVal = act.date || act.startAt;
                                      const actDateObj = dateVal ? new Date(dateVal) : new Date(act.milestoneDate);
                                      const isPast = actDateObj < now;

                                      let statusUpper = act.status?.toUpperCase() || 'UPCOMING';
                                      if (isPast && statusUpper !== 'COMPLETED') {
                                        statusUpper = 'COMPLETED';
                                      }

                                      let statusBadge = 'bg-stone-100 text-stone-600 border-stone-200';
                                      let statusLabel = statusUpper;
                                      
                                      // Handle general public consultation override specifically for Youth in Crafts
                                      if (act.title === 'Youth in Crafts') {
                                        statusLabel = 'GENERAL PUBLIC CONSULTATION';
                                        statusBadge = 'bg-indigo-100 text-indigo-800 border-indigo-200';
                                      } else if (statusUpper === 'COMPLETED') {
                                        statusBadge = 'bg-gray-100 text-gray-700 border-gray-200';
                                      } else if (statusUpper === 'REGISTRATION_OPEN') {
                                        statusBadge = 'bg-green-100 text-green-800 border-green-200';
                                      } else if (statusUpper === 'LIVE' || statusUpper === 'ONGOING') {
                                        statusBadge = 'bg-red-50 text-red-700 border-red-200 animate-pulse';
                                        statusLabel = 'LIVE NOW';
                                      } else if (statusUpper === 'UPCOMING' || statusUpper === 'SCHEDULED' || statusUpper === 'PLANNING') {
                                        statusBadge = 'bg-blue-50 text-blue-700 border-blue-200';
                                        statusLabel = 'UPCOMING';
                                      }

                                      const displayDate = dateVal ? actDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : act.milestoneDate;
                                      const displayTime = dateVal ? actDateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }) + ' – 3:00 PM IST' : '11:00 AM – 3:00 PM IST';
                                      
                                      let crafts = act.craft || 'Cross-Craft';
                                      if (act.craftFocus && Array.isArray(act.craftFocus)) {
                                          crafts = act.craftFocus.map((c: string) => c === 'ALL_CRAFTS' ? 'Cross-Craft' : c).join(' · ');
                                      }
                                      if (crafts.includes('General') || crafts.includes('Cross-Craft')) crafts = 'Cross-Craft';

                                      const loc = act.district || act.milestoneLocation || 'Srinagar';
                                      const mode = act.venueName || act.venue || act.milestoneMode || 'SKC Online Secretariat';

                                      const isCompleted = statusUpper === 'COMPLETED';

                                      `;

c = c.substring(0, tStart) + replacement + c.substring(tEnd);

fs.writeFileSync(file, c);
console.log("Replaced mapping logic with past date forcing!");
