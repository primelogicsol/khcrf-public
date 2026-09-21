const fs = require('fs');
async function fetchAndSave(url, filename) {
  const res = await fetch(url);
  const text = await res.text();
  fs.writeFileSync(filename, text);
}
async function main() {
  await fetchAndSave('http://localhost:3000/publications', 'out-pub.html');
  await fetchAndSave('http://localhost:3000/about/partner-network/registry?collection=institutional-alliance', 'out-reg.html');
  await fetchAndSave('http://localhost:3000/master-artisans/issues', 'out-issues.html');
  await fetchAndSave('http://localhost:3000/state-of-kashmir-crafts/current-assessment-2026', 'out-skc.html');
}
main();
