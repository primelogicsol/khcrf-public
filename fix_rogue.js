const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/            </div>\r?\n          \)\}\r?\n        <\/div>\r?\n      <\/section>/, `            </div>
        </div>
      </section>`);

fs.writeFileSync(file, c);
console.log("Removed rogue parenthesis!");
