const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/master-artisans/issues/MagazineIssueComponents.tsx', 'utf8');

const match = content.match(/<div className="flex items-center gap-4 group"><span className="[^"]+">(.*?)<\/span> <span className="text-sm text-gray-300 font-light">Exclusive archive<\/span><\/div>/);
if (match) {
  const char = match[1];
  content = content.replace(
    /{issue.downloadable && \([\s\S]*?Download PDF<\/span><\/div>\s*\)}/,
    `{issue.downloadable && (
            <div className="flex items-center gap-4 group"><span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F6F2EC]/10 text-[#F6F2EC] text-xs border border-[#F6F2EC]/20 group-hover:bg-[#F6F2EC] group-hover:text-black transition-colors">${char}</span> <span className="text-sm text-gray-300 font-light">Download PDF</span></div>
          )}`
  );
  fs.writeFileSync('frontend/src/components/master-artisans/issues/MagazineIssueComponents.tsx', content);
  console.log('Restored the correct character.');
}
