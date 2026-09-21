const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

const startIndex = schema.indexOf('model EvaluationSubmission {');
const endIndex = schema.indexOf('}', startIndex) + 1;
let evalSub = schema.substring(startIndex, endIndex);

let newEvalSub = evalSub
  .replace(/userId\s+String\n/, 'userId              String?\n')
  .replace(/score\s+Float\n/, 'score               Float?\n')
  .replace(/answers\s+Json\n/, 'answers             Json?\n')
  .replace(/user\s+User\s+@relation/, 'user                User?         @relation');

schema = schema.replace(evalSub, newEvalSub);
fs.writeFileSync('prisma/schema.prisma', schema);
console.log('Fixed properly!');
