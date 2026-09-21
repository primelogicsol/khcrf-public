const fs = require('fs');
let lines = fs.readFileSync('src/components/business/EvaluateFarmLink.tsx', 'utf8').split(/\r?\n/);
let output = [];
for(let i=0; i<15; i++) {
  output.push((i+1) + ': ' + lines[i]);
}
fs.writeFileSync('head.txt', output.join('\n'), 'utf8');
