const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/master-artisans/issues/MagazineIssueComponents.tsx', 'utf8');

content = content.replace(
  /case 'SUSPENDED':\s*default:/,
  `case null:
          return (
            <div className="flex justify-center items-center py-12">
              <span className="inline-block w-8 h-8 border-2 border-[#B8860B] border-t-transparent rounded-full animate-spin" />
            </div>
          );
        case 'SUSPENDED':
        default:`
);

fs.writeFileSync('frontend/src/components/master-artisans/issues/MagazineIssueComponents.tsx', content);
console.log('Fixed null accessState handling');
