const fs = require('fs');
const targetFile = 'frontend/src/app/(main)/state-of-kashmir-crafts/current-assessment-2026/CurrentAssessmentClient.tsx';
let content = fs.readFileSync(targetFile, 'utf8');

// Fix Preparatory Analysis styling and filter out Final Report
const oldPrep = `<div className="flex flex-col md:flex-row gap-2 md:gap-4 overflow-x-auto pb-4">
                  {workflowEvents.filter(h => h.eventType === 'INTERNAL_PANEL').map((h, i) => (`;
const newPrep = `<div className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 pb-4">
                  {workflowEvents.filter(h => h.eventType === 'INTERNAL_PANEL' && !h.title.toLowerCase().includes('report')).map((h, i) => (`;
content = content.replace(oldPrep, newPrep);

const oldPrepLength = `i < workflowEvents.filter(e => e.eventType === 'INTERNAL_PANEL').length - 1`;
const newPrepLength = `i < workflowEvents.filter(e => e.eventType === 'INTERNAL_PANEL' && !e.title.toLowerCase().includes('report')).length - 1`;
content = content.replace(oldPrepLength, newPrepLength);

// And we need to remove the hidden md:flex items-center SVG because grid doesn't need arrows easily, 
// wait, the grid will space them evenly. If we have arrows, they might mess up the grid columns! 
// Let's just use flex flex-col md:flex-row flex-wrap md:flex-nowrap and remove overflow-x-auto.

const oldPrep2 = `<div className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 pb-4">`;
const newPrep2 = `<div className="flex flex-col md:flex-row flex-wrap md:flex-nowrap gap-2 md:gap-4 pb-4 w-full">`;
content = content.replace(oldPrep2, newPrep2);

// Make the cards flex-1 so they take equal width
const oldCard = `className="flex-shrink-0 w-full md:w-48 bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col justify-between"`;
const newCard = `className="flex-1 w-full bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col justify-between"`;
content = content.replace(oldCard, newCard);

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Fixed Preparatory Analysis!');
