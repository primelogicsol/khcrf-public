const net = require('net');

function checkPort() {
  const client = new net.Socket();
  client.setTimeout(2000);

  client.connect(5432, '127.0.0.1', () => {
    console.log('PostgreSQL port 5432 is OPEN! Database is available.');
    client.destroy();
    process.exit(0);
  });

  client.on('error', (err) => {
    console.log('PostgreSQL not available. Retrying in 5 seconds...');
    client.destroy();
    setTimeout(checkPort, 5000);
  });

  client.on('timeout', () => {
    console.log('PostgreSQL connection timed out. Retrying in 5 seconds...');
    client.destroy();
    setTimeout(checkPort, 5000);
  });
}

console.log('Starting continuous detection for PostgreSQL (port 5432)...');
checkPort();
