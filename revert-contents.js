const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/master-artisans/issues/MagazineIssueComponents.tsx', 'utf8');

const startContents = content.indexOf('export const IssueContents = ({ highlights }: { highlights: string[] }) => {');
const endContents = content.indexOf('export const IssuePublicationDetails = ({ issue }: { issue: any }) => {');

if (startContents !== -1 && endContents !== -1) {
  const newContents = `export const IssueContents = ({ highlights }: { highlights: string[] }) => {
    if (!highlights || highlights.length === 0) return null;
    
    // Parse stats
    let stories = '', artisans = '', crafts = '';
    highlights.forEach(h => {
      const text = h.toUpperCase();
      if (text.includes('STORIES')) stories = text.replace(/[^0-9]/g, '');
      if (text.includes('ARTISANS')) artisans = text.replace(/[^0-9]/g, '');
      if (text.includes('CRAFTS')) crafts = text.replace(/[^0-9]/g, '');
    });

    const introText = (stories && artisans && crafts) 
      ? \`\${stories} stories documenting \${artisans} master artisans across \${crafts} living craft traditions.\`
      : \`Exploring Kashmir's living craft heritage through \${highlights.length} key perspectives.\`;

    return (
      <section id="contents" className="bg-[#FAF8F3] py-20 md:py-24 border-t border-gray-200/60">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-16">
            <h3 className="text-[11px] tracking-[0.3em] text-gray-900 uppercase font-bold mb-6">Inside This Issue</h3>
            <p className="text-gray-500 font-serif italic text-xl max-w-2xl mx-auto">
              {introText}
            </p>
            <div className="w-12 h-[1px] bg-[#B8860B]/30 mx-auto mt-8"></div>
          </div>
  
          <div className="flex flex-col border-t border-gray-200/50">
            {highlights.map((highlight: string, idx: number) => {
              const num = (idx + 1).toString().padStart(2, '0');
              const label = highlight.replace(/[^A-Za-z\\s]/g, '').trim().toUpperCase();
              return (
                <div key={idx} className="border-b border-gray-200/50 py-6 md:py-8 flex flex-col md:flex-row md:items-center gap-6 md:gap-16">
                  <div className="flex items-center gap-6 shrink-0 w-32 md:w-40">
                    <span className="text-[10px] font-sans tracking-[0.2em] text-[#B8860B] uppercase font-bold flex-1">{label || 'SECTION'}</span>
                    <span className="text-xl font-serif text-gray-400 italic opacity-60">{num}</span>
                  </div>
                  <h4 className="text-2xl md:text-3xl font-serif text-gray-800">
                    {highlight}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  };

  `;
  
  content = content.substring(0, startContents) + newContents + content.substring(endContents);
  fs.writeFileSync('frontend/src/components/master-artisans/issues/MagazineIssueComponents.tsx', content);
  console.log('Successfully reverted IssueContents formatting.');
} else {
  console.log('Could not find bounds');
}
