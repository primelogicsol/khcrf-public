const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/if \(type === 'REGISTRATION'\) \{\s*return \(\s*<>\s*<Link href="\/state-of-kashmir-crafts\/stakeholder-registry"[^>]*>Register<\/Link>\s*<Link href="\/state-of-kashmir-crafts\/participation-guidelines"[^>]*>View Guidelines<\/Link>\s*<\/>\s*\);\s*\}/g, `if (type === 'REGISTRATION') {
      if (isClosed) return <div className="w-full py-2 bg-gray-100 text-gray-500 border border-gray-200 rounded-xl text-xs font-bold text-center">Registration Closed</div>;
      return (
        <>
          <Link href="/state-of-kashmir-crafts/stakeholder-registry" className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">Register</Link>
          <Link href="/state-of-kashmir-crafts/participation-guidelines" className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">View Guidelines</Link>
        </>
      );
    }`);

c = c.replace(/if \(type === 'PUBLIC_PARTICIPATION'\) \{\s*return \(\s*<>\s*<Link href="\/state-of-kashmir-crafts\/participate"[^>]*>Participate<\/Link>\s*<Link href="\/state-of-kashmir-crafts\/questionnaires"[^>]*>View Questionnaires<\/Link>\s*<\/>\s*\);\s*\}/g, `if (type === 'PUBLIC_PARTICIPATION') {
      if (isClosed) return <div className="w-full py-2 bg-gray-100 text-gray-500 border border-gray-200 rounded-xl text-xs font-bold text-center">Participation Closed</div>;
      return (
        <>
          <Link href="/state-of-kashmir-crafts/participate" className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">Participate</Link>
          <Link href="/state-of-kashmir-crafts/questionnaires" className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">View Questionnaires</Link>
        </>
      );
    }`);

c = c.replace(/if \(type === 'ORIENTATION'\) \{\s*return \(\s*<>\s*<Link href=\{primaryRoute\}[^>]*>Register<\/Link>\s*<Link href="\/state-of-kashmir-crafts\/orientation-details"[^>]*>View Orientation Details<\/Link>\s*<\/>\s*\);\s*\}/g, `if (type === 'ORIENTATION') {
      if (isClosed) return <div className="w-full py-2 bg-gray-100 text-gray-500 border border-gray-200 rounded-xl text-xs font-bold text-center">Orientation Closed</div>;
      return (
        <>
          <Link href={primaryRoute} className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">Register</Link>
          <Link href="/state-of-kashmir-crafts/orientation-details" className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">View Orientation Details</Link>
        </>
      );
    }`);

fs.writeFileSync(file, c);
console.log("Fixed missing blocks!");
