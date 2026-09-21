const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const regex = /<Link\s+href=\{\s*\(selectedCalendarEvent\.eventType\s*\|\|[\s\S]*?Submit Testimony\s*<\/Link>/m;

const replacement = `{(() => {
                                    const primaryRoute = (selectedCalendarEvent.eventType || selectedCalendarEvent.category || '').toUpperCase().includes('REGISTRATION') || (selectedCalendarEvent.slug || '').includes('stakeholder-registration') ? '/state-of-kashmir-crafts/stakeholder-registry' :
                                      (selectedCalendarEvent.eventType || selectedCalendarEvent.category || '').toUpperCase().includes('VALIDATION') || (selectedCalendarEvent.slug || '').includes('draft-findings') || (selectedCalendarEvent.slug || '').includes('validation') ? '/state-of-kashmir-crafts/validation-round' :
                                      (selectedCalendarEvent.eventType || selectedCalendarEvent.category || '').toUpperCase().includes('EXPERT REVIEW') || (selectedCalendarEvent.slug || '').includes('expert-review') ? '/state-of-kashmir-crafts/expert-review' :
                                      '/state-of-kashmir-crafts/participate';
                                    return <div className="flex-1 flex gap-3 w-full" onClick={() => setSelectedCalendarEvent(null)}>{renderActions(selectedCalendarEvent, primaryRoute)}</div>;
                                  })()}`;

c = c.replace(regex, replacement);
fs.writeFileSync(file, c);
console.log("Fixed calendar action buttons!");
