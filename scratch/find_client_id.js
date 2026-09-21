const https = require('https');

https.get('https://khcrf.org/login', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const index = data.indexOf('187203497792');
    if (index !== -1) {
      console.log("CONTEXT:");
      console.log(data.substring(index - 50, index + 100));
    } else {
      console.log("Client ID string not found in HTML response");
    }
  });
}).on('error', (err) => {
  console.error("Fetch error:", err.message);
});
