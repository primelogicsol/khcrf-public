const { Client } = require('ssh2'); 
const conn = new Client(); 
conn.on('ready', () => { 
  conn.exec('cd ~/app && docker compose ps && curl -s -i https://khcrf.org/api/health', (err, stream) => { 
    if (err) throw err; 
    let out = '';
    stream.on('close', (code, signal) => { 
      conn.end(); 
    }).on('data', (data) => { 
      process.stdout.write(data); 
    }).stderr.on('data', (data) => { 
      process.stderr.write(data); 
    }); 
  }); 
}).connect({ 
  host: '198.71.54.159', 
  port: 22, 
  username: 'root', 
  password: 'PQsQ3OL6' 
});
