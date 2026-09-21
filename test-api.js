const http = require('http');
http.get('http://localhost:3000/api/backend/v1/magazine-issues', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Array?', Array.isArray(parsed), 'Data array?', parsed.data ? Array.isArray(parsed.data) : false, 'Length:', parsed.data ? parsed.data.length : parsed.length);
    } catch(e) {
      console.log('Not JSON:', data.substring(0, 100));
    }
  });
});
