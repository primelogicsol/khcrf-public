const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const t1 = `    if (type === 'REGISTRATION') {
      return (
        <>
          <Link href="/state-of-kashmir-crafts/stakeholder-registry" className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">Register</Link>
          <Link href="/state-of-kashmir-crafts/participation-guidelines" className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">View Guidelines</Link>
        </>
      );
    }`;

const r1 = `    if (type === 'REGISTRATION') {
      return isClosed ? (
        <div className="w-full py-2 bg-gray-100 text-gray-500 border border-gray-200 rounded-xl text-xs font-bold text-center">Registration Closed</div>
      ) : (
        <>
          <Link href="/state-of-kashmir-crafts/stakeholder-registry" className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">Register</Link>
          <Link href="/state-of-kashmir-crafts/participation-guidelines" className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">View Guidelines</Link>
        </>
      );
    }`;

const t2 = `    if (type === 'PUBLIC_PARTICIPATION') {
      return (
        <>
          <Link href="/state-of-kashmir-crafts/participate" className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">Participate</Link>
          <Link href="/state-of-kashmir-crafts/questionnaires" className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">View Questionnaires</Link>
        </>
      );
    }`;

const r2 = `    if (type === 'PUBLIC_PARTICIPATION') {
      return isClosed ? (
        <div className="w-full py-2 bg-gray-100 text-gray-500 border border-gray-200 rounded-xl text-xs font-bold text-center">Participation Closed</div>
      ) : (
        <>
          <Link href="/state-of-kashmir-crafts/participate" className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">Participate</Link>
          <Link href="/state-of-kashmir-crafts/questionnaires" className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">View Questionnaires</Link>
        </>
      );
    }`;

const t3 = `    if (type === 'ORIENTATION') {
      return (
        <>
          <Link href={primaryRoute} className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">Register</Link>
          <Link href="/state-of-kashmir-crafts/orientation-details" className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">View Orientation Details</Link>
        </>
      );
    }`;

const r3 = `    if (type === 'ORIENTATION') {
      return isClosed ? (
        <div className="w-full py-2 bg-gray-100 text-gray-500 border border-gray-200 rounded-xl text-xs font-bold text-center">Submissions Closed</div>
      ) : (
        <>
          <Link href={primaryRoute} className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">Register</Link>
          <Link href="/state-of-kashmir-crafts/orientation-details" className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">View Orientation Details</Link>
        </>
      );
    }`;

c = c.replace(t1, r1);
c = c.replace(t2, r2);
c = c.replace(t3, r3);

fs.writeFileSync(file, c);
console.log("Fixed all other button blocks!");
