const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const regexMap = /let regStatus = 'NOT_OPEN';[\s\S]*?if \(rawType === 'REGISTRATION'/m;

const replacement = `let regStatus = 'NOT_OPEN';
            
            // Dynamic registration calculation
            if (evt.registration_open_at && evt.registration_close_at) {
              const nowTime = new Date().getTime();
              const openTime = new Date(evt.registration_open_at).getTime();
              const closeTime = new Date(evt.registration_close_at).getTime();
              if (openTime <= nowTime && closeTime >= nowTime) {
                regStatus = 'OPEN';
              }
            } else if (evt.registrationOpenAt && evt.registrationCloseAt) {
              const nowTime = new Date().getTime();
              const openTime = new Date(evt.registrationOpenAt).getTime();
              const closeTime = new Date(evt.registrationCloseAt).getTime();
              if (openTime <= nowTime && closeTime >= nowTime) {
                regStatus = 'OPEN';
              }
            } else if (normalizedStatus === 'REGISTRATION_OPEN') {
               // Fallback if no dates but explicit status
               normalizedStatus = 'UPCOMING';
               regStatus = 'OPEN';
            }

            if (rawType === 'REGISTRATION'`;

c = c.replace(regexMap, replacement);
fs.writeFileSync(file, c);
console.log("Updated registration open logic!");
