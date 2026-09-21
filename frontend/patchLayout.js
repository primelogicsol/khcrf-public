const fs = require('fs');

let c = fs.readFileSync('src/components/business/EvaluateFarmLink.tsx', 'utf8');

// Fix the button text
c = c.replace('Start Preliminary Readiness Assessment', 'START VERIFICATION APPLICATION');

// We want to extract <ScrollReveal delay={200}> and <ScrollReveal delay={300}> from the right column
// and append them to the left column.

const sr200Start = c.indexOf('<ScrollReveal delay={200}>');
const sr300Start = c.indexOf('<ScrollReveal delay={300}>');
// we know the closing tag for sr300 is </ScrollReveal> before closing the Right Column div

const sr300End = c.indexOf('</div>', c.indexOf('</ScrollReveal>', sr300Start) + 15); 
// wait, the exact block is:
/*
            <ScrollReveal delay={200}>
              ...
            </ScrollReveal>

            <ScrollReveal delay={300}>
              ...
            </ScrollReveal>
          </div>
*/

// Let's grab the blocks using regex or string splits
const parts = c.split('<ScrollReveal delay={200}>');
const part1 = parts[0];
const rest = '<ScrollReveal delay={200}>' + parts[1];

const lastScrollRevealClose = rest.lastIndexOf('</ScrollReveal>') + 15;
const blocksToMove = rest.substring(0, lastScrollRevealClose);
const afterBlocks = rest.substring(lastScrollRevealClose);

// Now part1 has the left column and right column start.
// we need to inject blocksToMove into the Left Column.
// Left Column ends at:
/*
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column - Content *\/}
*/

let newPart1 = part1.replace(
  /<\/ScrollReveal>\s*<\/div>\s*\{\/\* Right Column - Content \*\/\}/,
  `</ScrollReveal>\n\n            ${blocksToMove}\n          </div>\n\n          {/* Right Column - Content */}`
);

// We should also change `<div className="relative">` of the Left Column to `<div className="space-y-10">`
newPart1 = newPart1.replace(
  /\{\/\* Left Column - Image & Dashboard Vibe \*\/\}\s*<div className="relative">/,
  `{/* Left Column - Image & Dashboard Vibe */}\n          <div className="space-y-16">` // changed to space-y-16 for better breathing room since it's beneath a big image
);

// We should change `items-center` to `items-start` on the grid
newPart1 = newPart1.replace(
  /<div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">/,
  `<div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">`
);

let finalCode = newPart1 + afterBlocks;

// Wait, the previous height change in page.tsx wasn't in EvaluateFarmLink.tsx. 
// Did I change lg:h-[800px] in page.tsx? I should undo that so the image is just responsive again.

fs.writeFileSync('src/components/business/EvaluateFarmLink.tsx', finalCode, 'utf8');

let pageTsx = fs.readFileSync('src/app/(main)/business-support/evaluation/page.tsx', 'utf8');
pageTsx = pageTsx.replace('lg:h-[800px] ', ''); // revert my previous change
fs.writeFileSync('src/app/(main)/business-support/evaluation/page.tsx', pageTsx, 'utf8');

