import fs from 'fs';
import https from 'https';
import path from 'path';

async function fetchOgImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const match = data.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"[^>]*>/i) || 
                      data.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:image"[^>]*>/i);
        if (match && match[1]) {
          let imageUrl = match[1];
          imageUrl = imageUrl.replace(/&amp;/g, '&');
          
          console.log(`Found image URL for ${url}:\n${imageUrl}`);
          
          const file = fs.createWriteStream(outputPath);
          https.get(imageUrl, (imgRes) => {
            imgRes.pipe(file);
            file.on('finish', () => {
              file.close();
              console.log(`Successfully saved to ${outputPath}`);
              resolve();
            });
          }).on('error', err => {
            fs.unlink(outputPath, () => {});
            reject(err);
          });
        } else {
          reject(new Error(`og:image not found in ${url}`));
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  const destDir = path.resolve('./public/assets/images/issues');
  
  const tasks = [
    fetchOgImage('https://chatgpt.com/s/m_6a5da2cfe2708191bb089d50b69de1cc', path.join(destDir, 'issue-003-namda-new.jpg'))
  ];

  try {
    await Promise.all(tasks);
    console.log('All images downloaded successfully.');
  } catch (err) {
    console.error('Error downloading images:', err);
  }
}

main();
