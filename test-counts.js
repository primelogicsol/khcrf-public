const http = require('http');
http.get('http://127.0.0.1:3000', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        const counts = data.match(/<span class="text-5xl font-black text-white transition-colors block">.*?<\/span>/g);
        console.log('Counts in DOM:', counts);
    });
});
