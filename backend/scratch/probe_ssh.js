const { exec } = require('child_process');
const path = require('path');

const ips = [
  '74.208.31.158',
  '198.71.54.159',
  '147.93.107.135',
  '85.215.44.10',
  '66.179.81.46',
  '74.208.184.45',
  '209.46.123.152'
];

const keys = [
  'id_ed25519',
  'sufipulse_deploy',
  'hcrf_github_actions'
];

const users = ['root', 'ubuntu', 'deploy'];

async function probe() {
  for (const ip of ips) {
    for (const key of keys) {
      for (const user of users) {
        const keyPath = path.join('C:\\Users\\Fayaz\\.ssh', key);
        const cmd = `ssh -o ConnectTimeout=2 -o StrictHostKeyChecking=no -i "${keyPath}" ${user}@${ip} "echo SUCCESS && docker ps --format 'table {{.Names}}'"`;
        
        console.log(`Probing: ${user}@${ip} with ${key}...`);
        
        await new Promise((resolve) => {
          exec(cmd, { timeout: 3000 }, (error, stdout, stderr) => {
            if (stdout && stdout.includes('SUCCESS')) {
              console.log(`\n🎉 FOUND WORKING CONNECTION!`);
              console.log(`User: ${user}`);
              console.log(`IP: ${ip}`);
              console.log(`Key: ${key}`);
              console.log(`Output:\n${stdout}\n`);
            }
            resolve();
          });
        });
      }
    }
  }
  console.log("Probing complete.");
}

probe().catch(console.error);
