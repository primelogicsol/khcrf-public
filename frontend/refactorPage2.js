const fs = require('fs');
let content = fs.readFileSync('src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx', 'utf8');

// 1. Add action render helper and update card rendering logic
const actionHelper = `
function renderActions(hearing: any, primaryRoute: string) {
  const type = (hearing.eventType || '').toUpperCase();
  const isClosed = hearing.status === 'COMPLETED' || hearing.status === 'CLOSED';
  
  if (type === 'REGISTRATION') {
    return (
      <>
        <Link href={primaryRoute} className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">Register</Link>
        <Link href="/state-of-kashmir-crafts/participation-guidelines" className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">Participation Guidelines</Link>
      </>
    );
  }
  if (type === 'PUBLIC_PARTICIPATION') {
    return (
      <>
        <Link href={primaryRoute} className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">Participate</Link>
        <Link href="/state-of-kashmir-crafts/questionnaires" className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">View Questionnaires</Link>
      </>
    );
  }
  if (type === 'ORIENTATION') {
    return (
      <>
        <Link href={primaryRoute} className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">Register</Link>
        <Link href="/state-of-kashmir-crafts/orientation-details" className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">View Orientation Details</Link>
      </>
    );
  }
  if (type === 'PUBLIC_HEARING') {
    return (
      <>
        {!isClosed && <Link href={primaryRoute} className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">Register</Link>}
        {!isClosed && <Link href={\`/state-of-kashmir-crafts/public-hearings/submit-testimony?hearingSlug=\${hearing.slug}&hearingId=\${hearing.id}\`} className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">Submit Testimony</Link>}
      </>
    );
  }
  if (type === 'THEMATIC_CONSULTATION') {
    return (
      <>
        {!isClosed && <Link href={primaryRoute} className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">Register</Link>}
        {!isClosed && <Link href={\`/state-of-kashmir-crafts/public-hearings/submit-testimony?hearingSlug=\${hearing.slug}&hearingId=\${hearing.id}\`} className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">Submit Evidence</Link>}
      </>
    );
  }
  if (type === 'SUBMISSION_DEADLINE') {
    return isClosed ? (
      <div className="w-full py-2 bg-gray-100 text-gray-500 border border-gray-200 rounded-xl text-xs font-bold text-center">Submissions Closed</div>
    ) : (
      <>
        <Link href={\`/state-of-kashmir-crafts/public-hearings/submit-testimony?hearingSlug=\${hearing.slug}&hearingId=\${hearing.id}\`} className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">Submit Testimony</Link>
        <Link href={\`/state-of-kashmir-crafts/submit-evidence\`} className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">Submit Evidence</Link>
      </>
    );
  }
  if (type === 'DRAFT_REVIEW') {
    return (
      <>
        <Link href="/state-of-kashmir-crafts/draft-findings" className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">Review Draft Findings</Link>
        {!isClosed && <Link href="/state-of-kashmir-crafts/public-comment" className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">Submit Public Comment</Link>}
      </>
    );
  }
  if (type === 'VALIDATION') {
    return (
      <>
        <Link href="/state-of-kashmir-crafts/validation-portal" className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">Open Validation Portal</Link>
        {!isClosed && <Link href="/state-of-kashmir-crafts/validation-response" className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">Submit Validation Response</Link>}
      </>
    );
  }
  if (type === 'EXPERT_REVIEW') {
    return (
      <Link href="/state-of-kashmir-crafts/expert-review-info" className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">View Review Information</Link>
    );
  }
  if (type === 'FINAL_PUBLICATION') {
    return (
      <>
        <Link href="/state-of-kashmir-crafts/final-report" className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">View Final Report</Link>
        <a href="/state-of-kashmir-crafts/final-report/download" className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">Download Report</a>
      </>
    );
  }

  return (
    <>
      <Link href={primaryRoute} className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">Register</Link>
      <Link href={\`/state-of-kashmir-crafts/public-hearings/submit-testimony?hearingSlug=\${hearing.slug}&hearingId=\${hearing.id}\`} className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">Submit Testimony</Link>
    </>
  );
}

function shouldShowTime(hearing: any) {
  const type = (hearing.eventType || '').toUpperCase();
  if (type === 'FINAL_PUBLICATION' || type === 'SUBMISSION_DEADLINE' || type === 'DRAFT_REVIEW' || type === 'VALIDATION' || type === 'EXPERT_REVIEW') return false;
  return true;
}
`;

content = content.replace('function getEventTypeLabel', actionHelper + '\nfunction getEventTypeLabel');

const oldActions1 = `                            <Link
                              href={primaryRoute}
                              className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center"
                            >
                              Register
                            </Link>
                            <Link
                              href={\`/state-of-kashmir-crafts/public-hearings/submit-testimony?hearingSlug=\${hearing.slug}&hearingId=\${hearing.id}\`}
                              className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center"
                            >
                              Submit Testimony
                            </Link>`;

content = content.replace(oldActions1, `                            {renderActions(hearing, primaryRoute)}`);

const oldActions2 = `                                <Link
                                  href={
                                    (selectedCalendarEvent.eventType || selectedCalendarEvent.category || '').toUpperCase().includes('REGISTRATION') || (selectedCalendarEvent.slug || '').includes('stakeholder-registration') ? '/state-of-kashmir-crafts/stakeholder-registry' :
                                    (selectedCalendarEvent.eventType || selectedCalendarEvent.category || '').toUpperCase().includes('VALIDATION') || (selectedCalendarEvent.slug || '').includes('draft-findings') || (selectedCalendarEvent.slug || '').includes('validation') ? '/state-of-kashmir-crafts/validation-round' :
                                    (selectedCalendarEvent.eventType || selectedCalendarEvent.category || '').toUpperCase().includes('EXPERT REVIEW') || (selectedCalendarEvent.slug || '').includes('expert-review') ? '/state-of-kashmir-crafts/expert-review' :
                                    '/state-of-kashmir-crafts/participate'
                                  }
                                  onClick={() => setSelectedCalendarEvent(null)}
                                  className="flex-1 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white font-bold text-xs rounded-xl text-center transition"
                                >
                                  Register & Participate
                                </Link>
                                <Link
                                  href={\`/state-of-kashmir-crafts/public-hearings/submit-testimony?hearingSlug=\${selectedCalendarEvent.slug}&hearingId=\${selectedCalendarEvent.id}\`}
                                  onClick={() => setSelectedCalendarEvent(null)}
                                  className="px-4 py-2.5 border border-gray-250 text-brand-primary hover:bg-gray-55 font-bold text-xs rounded-xl text-center transition"
                                >
                                  Submit Testimony
                                </Link>`;

content = content.replace(oldActions2, `                                {renderActions(selectedCalendarEvent, '/state-of-kashmir-crafts/participate')}`);

// 2. Change 11:00 AM - 3:00 PM IST
const clockBlock = `<FaClock /> 11:00 AM – 3:00 PM IST`;
content = content.replace(clockBlock, `{shouldShowTime(hearing) ? <><FaClock /> 11:00 AM – 3:00 PM IST</> : null}`);

// Replace "Online Hearing" generic labels with getModeLabel
// In timeline:
content = content.replace(
  /<span className="flex items-center gap-1">\s*📍 \{hearing.venue \|\| 'Virtual Webcast'\}\s*<\/span>/, 
  `<span className="flex items-center gap-1">📍 {getModeLabel(hearing.eventType, hearing.venue || hearing.mode || 'Virtual Webcast')}</span>`
);

// In Popover:
content = content.replace(
  /\{selectedCalendarEvent.location \|\| 'Virtual Webcast'\} \(\{selectedCalendarEvent.mode\}\)/g,
  `{getModeLabel(selectedCalendarEvent.eventType, selectedCalendarEvent.location || selectedCalendarEvent.mode || 'Virtual Webcast')}`
);

// 3. Fix Draft Findings Review Date: 8-17 December
const draftDateRegex = /const displayDate = hearing.scheduledDate \|\| hearing.date \|\| hearing.startAt;/g;
content = content.replace(draftDateRegex, `
                                  if (hearing.eventType === 'DRAFT_REVIEW' || (hearing.title && hearing.title.includes('Draft Findings'))) {
                                    return '8–17 December 2026';
                                  }
                                  const displayDate = hearing.scheduledDate || hearing.date || hearing.startAt;
`);

// 4. Update the "Hearing Type" badge on cards to be dynamic (Event Type + Status)
// Replace existing status badge logic in map:
const oldTitleRow = `<h3 className="text-xl font-bold text-gray-900 leading-snug">{hearing.title}</h3>`;
const newTitleRow = `<div className="text-[10px] font-bold text-brand-primary uppercase tracking-wider mb-1">{getEventTypeLabel(hearing.eventType, hearing.category)}</div>
<h3 className="text-xl font-bold text-gray-900 leading-snug">{hearing.title}</h3>`;
content = content.replace(oldTitleRow, newTitleRow);

// 5. Build dynamic category stats inside the ribbon/page.
// I will place it above the list of hearings.
const countsHtml = `
              {/* Dynamic Category Summary */}
              <div className="mb-6 grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-white border border-gray-200 p-3 rounded-xl text-center shadow-xs">
                  <span className="block text-xl font-black text-brand-primary">{hearings.length}</span>
                  <span className="block text-[9px] uppercase font-bold text-gray-500">Programme Events</span>
                </div>
                <div className="bg-white border border-gray-200 p-3 rounded-xl text-center shadow-xs">
                  <span className="block text-xl font-black text-brand-secondary">{hearings.filter((h: any) => h.eventType === 'PUBLIC_HEARING' && h.isFormalHearing).length}</span>
                  <span className="block text-[9px] uppercase font-bold text-gray-500">Formal Hearings</span>
                </div>
                <div className="bg-white border border-gray-200 p-3 rounded-xl text-center shadow-xs">
                  <span className="block text-xl font-black text-gray-700">{hearings.filter((h: any) => h.eventType === 'THEMATIC_CONSULTATION').length}</span>
                  <span className="block text-[9px] uppercase font-bold text-gray-500">Thematic Consultations</span>
                </div>
                <div className="bg-white border border-gray-200 p-3 rounded-xl text-center shadow-xs">
                  <span className="block text-xl font-black text-gray-700">{hearings.filter((h: any) => h.eventType === 'SUBMISSION_DEADLINE').length}</span>
                  <span className="block text-[9px] uppercase font-bold text-gray-500">Submission Deadlines</span>
                </div>
                <div className="bg-white border border-gray-200 p-3 rounded-xl text-center shadow-xs">
                  <span className="block text-xl font-black text-gray-700">{hearings.filter((h: any) => !['PUBLIC_HEARING', 'THEMATIC_CONSULTATION', 'SUBMISSION_DEADLINE'].includes(h.eventType)).length}</span>
                  <span className="block text-[9px] uppercase font-bold text-gray-500">Other Milestones</span>
                </div>
              </div>
`;

content = content.replace('{/* Results Count and Filter Chips */}', countsHtml + '\n              {/* Results Count and Filter Chips */}');

// Update Filter Options
const filterStatusOld = `<option value="ALL">All Statuses</option>`;
content = content.replace(filterStatusOld, `<option value="ALL">All Statuses</option>
                <option value="Event Types">--- Event Types ---</option>
                <option value="Registration">Registration</option>
                <option value="Public Participation">Public Participation</option>
                <option value="Orientation">Orientation</option>
                <option value="Public Hearing">Public Hearings</option>
                <option value="Thematic Consultation">Thematic Consultations</option>
                <option value="Submission Deadline">Submission Deadlines</option>
                <option value="Draft Review">Draft Review</option>
                <option value="Stakeholder Validation">Validation</option>
                <option value="Expert Review">Expert Review</option>
                <option value="Final Publication">Final Publication</option>
                <option value="Statuses">--- Statuses ---</option>`);

// Apply event type filtering logic
const filterStatusLogicOld = `if (s === 'REGISTRATION OPEN') return h.status === 'REGISTRATION_OPEN';`;
content = content.replace(filterStatusLogicOld, `
        const et = getEventTypeLabel(h.eventType).toUpperCase();
        if (s === 'REGISTRATION') return et === 'REGISTRATION';
        if (s === 'PUBLIC PARTICIPATION') return et === 'PUBLIC PARTICIPATION';
        if (s === 'ORIENTATION') return et === 'ORIENTATION';
        if (s === 'PUBLIC HEARING') return et === 'PUBLIC HEARING';
        if (s === 'THEMATIC CONSULTATION') return et === 'THEMATIC CONSULTATION';
        if (s === 'SUBMISSION DEADLINE') return et === 'SUBMISSION DEADLINE';
        if (s === 'DRAFT REVIEW') return et === 'DRAFT REVIEW';
        if (s === 'STAKEHOLDER VALIDATION') return et === 'STAKEHOLDER VALIDATION';
        if (s === 'EXPERT REVIEW') return et === 'EXPERT REVIEW';
        if (s === 'FINAL PUBLICATION') return et === 'FINAL PUBLICATION';
        if (s === 'REGISTRATION OPEN') return h.status === 'REGISTRATION_OPEN';`);

fs.writeFileSync('src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx', content, 'utf8');
console.log('Done 2');
