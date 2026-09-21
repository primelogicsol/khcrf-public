const http = require('http');

http.get('http://localhost:3000/api/backend/magazine-issues/threads-of-empire-003/access', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Access:', data));
});
