const http = require('http');

http.get('http://127.0.0.1:4000/api/backend/magazine-issues/threads-of-empire-003', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', data));
});
