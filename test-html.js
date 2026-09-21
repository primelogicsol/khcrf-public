const http = require('http');
http.get('http://127.0.0.1:3000', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('Description:', data.includes("Connecting KHCRF's core ecosystem, specialized operating enterprises, and independent institutional alliances supporting the future of Kashmir craftsmanship."));
        console.log('Col A Description:', data.includes("Technology, research, provenance, tourism, media and public-interest platforms connected to the KHCRF ecosystem."));
        console.log('Col B Description:', data.includes("Specialized operating entities across commerce, technology, design, media, logistics, market access and cultural services."));
        console.log('Col C Description:', data.includes("Independent institutions collaborating with KHCRF across research, policy, heritage, trade, artisan welfare and development."));
        console.log('Col A Title:', data.includes("Collection A &bull; Core Ecosystem"));
        console.log('Col B Title:', data.includes("Collection B &bull; Specialized Enterprises"));
        console.log('Col C Title:', data.includes("Collection C &bull; External Alliances"));
    });
});
