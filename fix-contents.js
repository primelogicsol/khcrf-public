const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/master-artisans/issues/MagazineIssueComponents.tsx', 'utf8');

// Replace IssueContents entirely
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
        <div className="max-w-[900px] mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-12">
            <h3 className="text-[11px] tracking-[0.3em] text-gray-900 uppercase font-bold mb-6">Inside This Issue</h3>
            <p className="text-gray-500 font-serif italic text-xl max-w-2xl mx-auto">
              {introText}
            </p>
            <div className="w-12 h-[1px] bg-[#B8860B]/30 mx-auto mt-8"></div>
          </div>
  
          <div className="flex flex-col">
            {highlights.map((highlight: string, idx: number) => {
              const num = (idx + 1).toString().padStart(2, '0');
              const label = highlight.replace(/[^A-Za-z\\s]/g, '').trim().toUpperCase();
              return (
                <div key={idx} className="group cursor-pointer border-b border-gray-200/50 py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/50 transition-all duration-500 px-6 md:px-10 -mx-6 md:-mx-10 rounded-xl hover:shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-10 flex-1">
                    <div className="flex items-center gap-4 w-32 shrink-0">
                      <span className="text-[10px] font-sans tracking-[0.2em] text-[#B8860B] uppercase font-bold">{label || 'SECTION'}</span>
                      <span className="text-xl font-serif text-gray-400 italic opacity-50 group-hover:text-[#B8860B] group-hover:opacity-100 transition-all duration-300">{num}</span>
                    </div>
                    <h4 className="text-2xl md:text-3xl lg:text-4xl font-serif text-gray-800 leading-snug group-hover:text-black group-hover:translate-x-2 transition-all duration-500">
                      {highlight}
                    </h4>
                  </div>
                  <div className="text-[#B8860B] opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-500 hidden md:block">
                    +"
                  </div>
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
  console.log('Fixed IssueContents.');
} else {
  console.log('Could not find IssueContents bounds.');
}
