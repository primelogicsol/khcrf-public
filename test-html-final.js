const http = require('http');
http.get('http://127.0.0.1:3000', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('KHCRF stem?', data.includes('KHCRF\\'stem'));
        console.log('KHCRF san?', data.includes('KHCRF\\'san'));
        console.log('KHCRF ship?', data.includes('KHCRF\\'ship'));
        console.log('Col A Description OK?', data.includes('Technology, research, provenance, tourism, media and public-interest platforms connected to the KHCRF ecosystem.'));
        console.log('Col C Description OK?', data.includes('Independent institutions collaborating with KHCRF across research, policy, heritage, trade, artisan welfare and development.'));
        console.log('Col A Text Color (Slate):', data.includes('text-slate-400 block mb-2'));
        console.log('Col A Text Color (White):', data.includes('font-black text-white transition-colors block'));
    });
});
