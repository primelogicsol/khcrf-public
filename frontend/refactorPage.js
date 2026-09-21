const fs = require('fs');

let content = fs.readFileSync('src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx', 'utf8');

const helpers = `
const EVENT_TYPE_LABELS: Record<string, string> = {
  REGISTRATION: "Registration",
  PUBLIC_PARTICIPATION: "Public Participation",
  EVIDENCE_SUBMISSION: "Evidence Submission",
  ORIENTATION: "Orientation",
  PUBLIC_HEARING: "Public Hearing",
  THEMATIC_CONSULTATION: "Thematic Consultation",
  SUBMISSION_DEADLINE: "Submission Deadline",
  DRAFT_REVIEW: "Draft Review",
  VALIDATION: "Stakeholder Validation",
  EXPERT_REVIEW: "Expert Review",
  FINAL_PUBLICATION: "Final Publication",
};

function getEventTypeLabel(eventType: string, defaultVal: string = '') {
  return EVENT_TYPE_LABELS[eventType] || defaultVal || eventType;
}

function getModeLabel(eventType: string, mode: string = '') {
  const typeUpper = (eventType || '').toUpperCase();
  const modeUpper = (mode || '').toUpperCase();
  const isOnline = modeUpper.includes('ONLINE') || modeUpper.includes('VIRTUAL');
  const isHybrid = modeUpper.includes('HYBRID');
  
  if (typeUpper === 'REGISTRATION') return isOnline ? 'Online Registration' : 'Registration';
  if (typeUpper === 'PUBLIC_PARTICIPATION') return isOnline ? 'Online Participation' : 'Participation';
  if (typeUpper === 'ORIENTATION') return isHybrid ? 'Hybrid Orientation' : (isOnline ? 'Online Orientation' : 'Orientation');
  if (typeUpper === 'PUBLIC_HEARING') return isOnline ? 'Online Public Hearing' : (isHybrid ? 'Hybrid Public Hearing' : 'In-Person Public Hearing');
  if (typeUpper === 'THEMATIC_CONSULTATION') return isOnline ? 'Online Thematic Consultation' : 'Thematic Consultation';
  if (typeUpper === 'SUBMISSION_DEADLINE') return isOnline ? 'Online Submission Deadline' : 'Submission Deadline';
  if (typeUpper === 'DRAFT_REVIEW') return isHybrid ? 'Hybrid Draft Review' : 'Draft Review';
  if (typeUpper === 'VALIDATION') return isOnline ? 'Online Validation' : 'Validation';
  if (typeUpper === 'EXPERT_REVIEW') return isHybrid ? 'Hybrid Expert Review' : 'Expert Review';
  if (typeUpper === 'FINAL_PUBLICATION') return isOnline ? 'Online Publication' : 'Publication';
  
  return mode || 'Online';
}
`;

content = content.replace('export default function PublicHearingsPage() {', helpers + '\nexport default function PublicHearingsPage() {');

// Sorting the data
content = content.replace(/setHearings\(actualEvents\);/g, `
        actualEvents.sort((a, b) => {
          const tA = new Date(a.startAt || a.date || a.scheduledDate).getTime();
          const tB = new Date(b.startAt || b.date || b.scheduledDate).getTime();
          if (tA !== tB) return tA - tB;
          return (a.programmeSequence || 0) - (b.programmeSequence || 0);
        });
        setHearings(actualEvents);
`);

// Title fixes
content = content.replace(/Hearings Published:/g, 'Programme Events:');
content = content.replace(/Showing \{filteredHearings\.length\} \{filteredHearings\.length === 1 \? 'hearing' : 'hearings'\}/g, 
  "Showing {filteredHearings.length} {filteredHearings.length === 1 ? 'programme event' : 'programme events'}");

content = content.replace(/Hearings & Testimonies/g, 'Public Hearings and Assessment Programme');
content = content.replace(/Public Hearing Programme 2026/g, 'Public Hearings and Assessment Programme');
content = content.replace(/No public assessment hearings are currently available./g, 'No public assessment programme events are currently available.');
content = content.replace(/No public hearings matching the selected filters were found./g, 'No programme events matching the selected filters were found.');

// Update Hearing Schedule Milestones header
content = content.replace(/Hearing Schedule Milestones/g, 'Programme Schedule Milestones');

fs.writeFileSync('src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx', content, 'utf8');
console.log('Done 1');
