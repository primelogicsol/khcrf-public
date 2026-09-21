const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const target = `    return (
      <>
        <Link href={primaryRoute} className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">Register</Link>
        <Link href={\`/state-of-kashmir-crafts/public-hearings/submit-testimony?hearingSlug=\${hearing.slug}&hearingId=\${hearing.id}\`} className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">Submit Testimony</Link>
      </>
    );`;

const replacement = `    return (
      <>
        {isClosed ? (
           <div className="w-full py-2 bg-gray-100 text-gray-500 border border-gray-200 rounded-xl text-xs font-bold text-center">Submissions Closed</div>
        ) : (
           <>
             <Link href={primaryRoute} className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">Register</Link>
             <Link href={\`/state-of-kashmir-crafts/public-hearings/submit-testimony?hearingSlug=\${hearing.slug}&hearingId=\${hearing.id}\`} className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">Submit Testimony</Link>
           </>
        )}
      </>
    );`;

c = c.replace(target, replacement);

fs.writeFileSync(file, c);
console.log("Fixed default buttons!");
