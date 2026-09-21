async function main() {
  const res = await fetch('http://127.0.0.1:3000/');
  const html = await res.text();
  const fs = require('fs');
  fs.writeFileSync('home-proof.html', html);
  console.log('Homepage length:', html.length);
}
main();
