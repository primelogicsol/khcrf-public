const http = require('http');

function testUrl(url) {
  http.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`URL: ${url} -> Status: ${res.statusCode}, Body: ${data.substring(0, 150)}`);
    });
  }).on('error', (e) => console.log(`URL: ${url} -> Error: ${e.message}`));
}

testUrl('http://localhost:3000/api/backend/magazine-issues/threads-of-empire-003');
testUrl('http://localhost:3000/api/backend/v1/magazine-issues/threads-of-empire-003');
testUrl('http://127.0.0.1:4000/api/v1/magazine-issues/threads-of-empire-003');
testUrl('http://127.0.0.1:4000/api/magazine-issues/threads-of-empire-003');
