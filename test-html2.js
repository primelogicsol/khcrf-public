const http = require('http');
http.get('http://127.0.0.1:3000', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('Description with Entity:', data.includes("Connecting KHCRF&#x27;s core ecosystem"));
        console.log('Description literal:', data.includes("Connecting KHCRF's core ecosystem"));
    });
});
